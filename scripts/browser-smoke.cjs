// Run after npm run build. Every external request is fulfilled locally or blocked.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../dist/apps/web-giddh');
const output = path.resolve(process.env.BROWSER_ARTIFACTS || 'dist/browser-checks');
const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

async function main() {
    assert.ok(fs.existsSync(path.join(root, 'index.html')), 'Run npm run build first');
    fs.mkdirSync(output, { recursive: true });
    const server = http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        let file = path.resolve(root, '.' + pathname);
        if (!file.startsWith(root + path.sep)) file = path.join(root, 'index.html');
        if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
        response.setHeader('Content-Type', contentTypes[path.extname(file)] || 'application/octet-stream');
        fs.createReadStream(file).pipe(response);
    });
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    const evidence = { checks: [], pageErrors: [], console: [], externalRequests: [], loginRequests: [] };
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
        await context.addInitScript(() => { Math.random = () => 0.1; });
        await context.route('**/*', route => {
            const request = route.request();
            const url = new URL(request.url());
            if (url.origin === origin) return route.continue();
            evidence.externalRequests.push({ method: request.method(), pathname: url.pathname });
            if (url.pathname.endsWith('/v2/login-with-password')) {
                evidence.loginRequests.push({ method: request.method(), body: request.postDataJSON() });
                return route.fulfill({ status: 200, json: { status: 'error', message: 'Fixture: invalid credentials', code: 'FIXTURE_INVALID' } });
            }
            if (url.pathname.endsWith('/white-label')) {
                return route.fulfill({ status: 200, json: { status: 'error', message: 'Fixture: use default branding' } });
            }
            return route.abort('blockedbyclient');
        });
        const page = await context.newPage();
        page.on('pageerror', error => evidence.pageErrors.push(error.message));
        page.on('console', message => {
            if (['error', 'warning'].includes(message.type())) evidence.console.push(message.text());
        });
        await page.goto(origin + '/login');
        await page.getByText('Login to your secure accounting space').waitFor();
        await page.screenshot({ path: path.join(output, 'login.png'), fullPage: true });
        evidence.checks.push('Login renders with default branding when white-label lookup returns an error');

        await page.getByText('Login with email and password').click();
        const submit = page.getByRole('button', { name: 'Login', exact: true });
        assert.equal(await submit.isDisabled(), true);
        await page.getByPlaceholder('Email Id', { exact: true }).fill('review@example.invalid');
        assert.equal(await submit.isDisabled(), true);
        await page.getByPlaceholder('Password', { exact: true }).fill('FixturePassword1!');
        assert.equal(await submit.isEnabled(), true);
        evidence.checks.push('Password login requires both fields before enabling submission');
        await submit.click();
        await page.getByText('Fixture: invalid credentials', { exact: true }).waitFor();
        assert.deepEqual(evidence.loginRequests, [{ method: 'POST', body: { uniqueKey: 'review@example.invalid', password: 'FixturePassword1!' } }]);
        await page.getByPlaceholder('Password', { exact: true }).waitFor();
        assert.match(page.url(), /\/login/);
        evidence.checks.push('Rejected fixture login preserves its payload and returns to the login form');

        await page.getByText('Forgot password?', { exact: true }).click();
        const reset = page.getByRole('button', { name: 'Reset Password', exact: true });
        assert.equal(await reset.isDisabled(), true);
        await page.getByPlaceholder('Email Id', { exact: true }).fill('review@example.invalid');
        assert.equal(await reset.isEnabled(), true);
        evidence.checks.push('Password reset form opens and requires an email value');

        await page.goto(origin + '/pages/home');
        await page.waitForURL('**/login?returnUrl=home');
        await page.getByText('Login to your secure accounting space').waitFor();
        evidence.checks.push('Unauthenticated home navigation returns to login with returnUrl=home');
        assert.deepEqual(evidence.pageErrors, []);
        evidence.checks.push('No uncaught browser exceptions in the checked flows');
        console.log(evidence.checks.map(check => `PASS ${check}`).join('\n'));
    } finally {
        fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2) + '\n');
        await browser?.close();
        await new Promise(resolve => server.close(resolve));
    }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
