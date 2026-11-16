const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

test('environment files expose stewardFeedbackUrl and stewardFeedbackKey with public key', () => {
    const modelPath = path.resolve(__dirname, '../../apps/web-giddh/src/environments/model.ts');
    assert.ok(existsSync(modelPath), 'model.ts exists');
    const modelContent = readFileSync(modelPath, 'utf8');
    assert.match(modelContent, /stewardFeedbackUrl:\s*string;/, 'model has stewardFeedbackUrl');
    assert.match(modelContent, /stewardFeedbackKey:\s*string;/, 'model has stewardFeedbackKey');

    const buildEnvPath = path.resolve(__dirname, '../../scripts/build-env.js');
    assert.ok(existsSync(buildEnvPath), 'build-env.js exists');
    const buildEnvContent = readFileSync(buildEnvPath, 'utf8');
    assert.match(buildEnvContent, /stewardFeedbackUrl/, 'build-env.js defines stewardFeedbackUrl');
    assert.match(buildEnvContent, /stewardFeedbackKey/, 'build-env.js defines stewardFeedbackKey');
    assert.match(buildEnvContent, /https:\/\/steward\.embarko\.app\/api\/v1\/feedback/, 'default URL matches exact Steward endpoint');
    assert.match(buildEnvContent, /pk_0afaeb4cd6941a797bc88a0ab76c8ac05578/, 'default key matches exact public key');

    const generatedPath = path.resolve(__dirname, '../../apps/web-giddh/src/environments/environment.generated.ts');
    if (!existsSync(generatedPath)) {
        require('node:child_process').execSync('node scripts/build-env.js local', {
            cwd: path.resolve(__dirname, '../..'),
            stdio: 'ignore'
        });
    }
    assert.ok(existsSync(generatedPath), 'environment.generated.ts exists');
    const generatedContent = readFileSync(generatedPath, 'utf8');
    assert.match(generatedContent, /stewardFeedbackUrl:\s*['"]https:\/\/steward\.embarko\.app\/api\/v1\/feedback['"]/, 'generated environment has correct URL');
    assert.match(generatedContent, /stewardFeedbackKey:\s*['"]pk_0afaeb4cd6941a797bc88a0ab76c8ac05578['"]/, 'generated environment has correct key');
});

test('FeedbackService constructs expected payload and headers for Steward POST request', () => {
    const servicePath = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/feedback/feedback.service.ts');
    assert.ok(existsSync(servicePath), 'feedback.service.ts exists');
    const serviceContent = readFileSync(servicePath, 'utf8');

    assert.match(serviceContent, /Content-Type['"]:\s*['"]application\/json['"]/, 'uses Content-Type: application/json');
    assert.match(serviceContent, /X-Steward-Key['"]:\s*environment\.stewardFeedbackKey/, 'uses X-Steward-Key header');
    assert.match(serviceContent, /text:\s*text\.trim\(\)/, 'trims and includes text');
    assert.match(serviceContent, /user:\s*\{[\s\S]*?id:[\s\S]*?email:[\s\S]*?name:[\s\S]*?company:[\s\S]*?plan:/, 'includes user { id, email, name, company, plan }');
    assert.match(serviceContent, /page:\s*\{[\s\S]*?url:[\s\S]*?title:/, 'includes page { url, title }');
    assert.match(serviceContent, /meta:\s*\{[\s\S]*?app_version:/, 'includes meta { app_version }');
});

test('FeedbackDialogComponent handles 202 success, 429 rate limit, and plain error messages', () => {
    const dialogPath = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/feedback/feedback-dialog/feedback-dialog.component.ts');
    assert.ok(existsSync(dialogPath), 'feedback-dialog.component.ts exists');
    const dialogContent = readFileSync(dialogPath, 'utf8');

    assert.match(dialogContent, /response\.status === 202/, 'checks for 202 response code');
    assert.match(dialogContent, /err\.status === 429/, 'handles 429 rate limit');
    assert.match(dialogContent, /Too many requests at once\. Please try again shortly\./, '429 friendly retry message');

    const htmlPath = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/feedback/feedback-dialog/feedback-dialog.component.html');
    assert.ok(existsSync(htmlPath), 'feedback-dialog.component.html exists');
    const htmlContent = readFileSync(htmlPath, 'utf8');
    assert.match(htmlContent, /Thanks, we got it/, 'displays exact success copy "Thanks, we got it"');
    assert.match(htmlContent, /<textarea\s+matInput/, 'has one multiline textarea field');
    assert.match(htmlContent, />Send<\/span>|>Send<\/button>/, 'has Send button');
});

test('Sidebar and floating button entry points enforce signed-in and layout constraints', () => {
    const sidebarHtml = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/primary-sidebar/primary-sidebar.component.html');
    const sidebarContent = readFileSync(sidebarHtml, 'utf8');
    assert.match(sidebarContent, /sidebar-feedback-item/, 'primary sidebar has feedback item');
    assert.match(sidebarContent, /feedbackService\.isLoggedIn\(\)/, 'sidebar feedback item is shown to signed-in users only');
    assert.match(sidebarContent, /openFeedbackDialog\(\)/, 'opens feedback dialog on click');

    const appHtml = path.resolve(__dirname, '../../apps/web-giddh/src/app/app.component.html');
    const appContent = readFileSync(appHtml, 'utf8');
    assert.match(appContent, /<feedback-floating-button>/, 'app root includes feedback floating button');

    const floatingTs = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/feedback/feedback-floating-button/feedback-floating-button.component.ts');
    const floatingContent = readFileSync(floatingTs, 'utf8');
    assert.match(floatingContent, /this\.feedbackService\.isLoggedIn\(\)\s*&&\s*!this\.feedbackService\.isSidebarVisible\(\)/, 'floating button only shows for signed-in users where there is no sidebar');
});
