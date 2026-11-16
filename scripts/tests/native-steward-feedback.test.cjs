const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

test('environment files read stewardFeedbackUrl and stewardFeedbackKey from process.env with no hardcoded defaults', () => {
    const modelPath = path.resolve(__dirname, '../../apps/web-giddh/src/environments/model.ts');
    assert.ok(existsSync(modelPath), 'model.ts exists');
    const modelContent = readFileSync(modelPath, 'utf8');
    assert.match(modelContent, /stewardFeedbackUrl:\s*string;/, 'model has stewardFeedbackUrl');
    assert.match(modelContent, /stewardFeedbackKey:\s*string;/, 'model has stewardFeedbackKey');

    const buildEnvPath = path.resolve(__dirname, '../../scripts/build-env.js');
    assert.ok(existsSync(buildEnvPath), 'build-env.js exists');
    const buildEnvContent = readFileSync(buildEnvPath, 'utf8');
    assert.match(buildEnvContent, /stewardFeedbackUrl:\s*env\.STEWARD_FEEDBACK_URL\s*\|\|\s*''/, 'build-env.js reads STEWARD_FEEDBACK_URL with empty string fallback, no hardcoded default');
    assert.match(buildEnvContent, /stewardFeedbackKey:\s*env\.STEWARD_FEEDBACK_KEY\s*\|\|\s*''/, 'build-env.js reads STEWARD_FEEDBACK_KEY with empty string fallback, no hardcoded default');
    assert.doesNotMatch(buildEnvContent, /https:\/\/steward\.embarko\.app\/api\/v1\/feedback/, 'no hardcoded Steward URL in build-env.js');
    assert.doesNotMatch(buildEnvContent, /pk_0afaeb4cd6941a797bc88a0ab76c8ac05578/, 'no hardcoded Steward key in build-env.js');

    const coreEnvPath = path.resolve(__dirname, '../../libs/core/environments/environment.ts');
    assert.ok(existsSync(coreEnvPath), 'libs/core/environments/environment.ts exists');
    const coreEnvContent = readFileSync(coreEnvPath, 'utf8');
    assert.doesNotMatch(coreEnvContent, /https:\/\/steward\.embarko\.app\/api\/v1\/feedback/, 'no hardcoded Steward URL in core environment');
    assert.doesNotMatch(coreEnvContent, /pk_0afaeb4cd6941a797bc88a0ab76c8ac05578/, 'no hardcoded Steward key in core environment');

    const envExamplePath = path.resolve(__dirname, '../../.env.example');
    assert.ok(existsSync(envExamplePath), '.env.example exists');
    const envExampleContent = readFileSync(envExamplePath, 'utf8');
    assert.match(envExampleContent, /STEWARD_FEEDBACK_URL=/, '.env.example has STEWARD_FEEDBACK_URL');
    assert.match(envExampleContent, /STEWARD_FEEDBACK_KEY=/, '.env.example has STEWARD_FEEDBACK_KEY');

    const envTemplatePath = path.resolve(__dirname, '../../.env.template');
    assert.ok(existsSync(envTemplatePath), '.env.template exists');
    const envTemplateContent = readFileSync(envTemplatePath, 'utf8');
    assert.match(envTemplateContent, /STEWARD_FEEDBACK_URL=/, '.env.template has STEWARD_FEEDBACK_URL');
    assert.match(envTemplateContent, /STEWARD_FEEDBACK_KEY=/, '.env.template has STEWARD_FEEDBACK_KEY');

    const generatedPath = path.resolve(__dirname, '../../apps/web-giddh/src/environments/environment.generated.ts');
    if (!existsSync(generatedPath)) {
        require('node:child_process').execSync('node scripts/build-env.js local', {
            cwd: path.resolve(__dirname, '../..'),
            stdio: 'ignore'
        });
    }
    assert.ok(existsSync(generatedPath), 'environment.generated.ts exists');
});

test('FeedbackService constructs expected payload and headers for Steward POST request and requires isConfigured', () => {
    const servicePath = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/feedback/feedback.service.ts');
    assert.ok(existsSync(servicePath), 'feedback.service.ts exists');
    const serviceContent = readFileSync(servicePath, 'utf8');

    assert.match(serviceContent, /isConfigured\s*=\s*signal<boolean>\(Boolean\(environment\.stewardFeedbackUrl\s*&&\s*environment\.stewardFeedbackKey\)\)/, 'isConfigured verifies both stewardFeedbackUrl and stewardFeedbackKey');
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

test('Sidebar and floating button entry points hide feedback if environment settings are missing', () => {
    const sidebarHtml = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/primary-sidebar/primary-sidebar.component.html');
    const sidebarContent = readFileSync(sidebarHtml, 'utf8');
    assert.match(sidebarContent, /sidebar-feedback-item/, 'primary sidebar has feedback item');
    assert.match(sidebarContent, /feedbackService\.isConfigured\(\)\s*&&\s*feedbackService\.isLoggedIn\(\)/, 'sidebar feedback item is hidden when not configured');
    assert.match(sidebarContent, /openFeedbackDialog\(\)/, 'opens feedback dialog on click');

    const appHtml = path.resolve(__dirname, '../../apps/web-giddh/src/app/app.component.html');
    const appContent = readFileSync(appHtml, 'utf8');
    assert.match(appContent, /<feedback-floating-button>/, 'app root includes feedback floating button');

    const floatingTs = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/feedback/feedback-floating-button/feedback-floating-button.component.ts');
    const floatingContent = readFileSync(floatingTs, 'utf8');
    assert.match(floatingContent, /this\.feedbackService\.isConfigured\(\)\s*&&\s*this\.feedbackService\.isLoggedIn\(\)\s*&&\s*!this\.feedbackService\.isSidebarVisible\(\)/, 'floating button is hidden if either env setting is missing');
});
