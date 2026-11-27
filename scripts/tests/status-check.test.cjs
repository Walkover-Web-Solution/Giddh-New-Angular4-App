const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const script = path.resolve(__dirname, '../status-check.mjs');

function repoWithStatus(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'giddh-status-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'user.name', 'Test');
    fs.mkdirSync(path.join(root, 'apps'));
    fs.writeFileSync(path.join(root, 'apps/a.ts'), 'one\n');
    fs.writeFileSync(path.join(root, 'STATUS.md'), 'placeholder\n');
    git('add', '.');
    git('commit', '-q', '-m', 'base');
    const reviewed = git('rev-parse', 'HEAD');
    fs.writeFileSync(path.join(root, 'STATUS.md'), `**Reviewed up to commit:** \`${reviewed}\`\n`);
    git('commit', '-q', '-am', 'status header');
    git('checkout', '-q', '-b', 'feature');
    const run = () => spawnSync('node', [script], { cwd: root, encoding: 'utf8', env: { ...process.env, STATUS_BASE: 'main' } });
    return { root, git, run };
}

test('passes when only non-code files change', t => {
    const { root, run } = repoWithStatus(t);
    fs.writeFileSync(path.join(root, 'README.md'), 'docs\n');
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Code files changed on this branch: 0/);
});

test('fails when code changes without STATUS.md and lists commits since the reviewed hash', t => {
    const { root, git, run } = repoWithStatus(t);
    fs.writeFileSync(path.join(root, 'apps/a.ts'), 'two\n');
    git('commit', '-q', '-am', 'change code');
    const result = run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /apps\/a\.ts/);
    assert.match(result.stderr, /since reviewed commit [0-9a-f]+: 1\n.*change code/);
});

test('passes when STATUS.md changes with the code', t => {
    const { root, run } = repoWithStatus(t);
    fs.writeFileSync(path.join(root, 'apps/a.ts'), 'two\n');
    fs.appendFileSync(path.join(root, 'STATUS.md'), 'row updated\n');
    assert.equal(run().status, 0);
});

test('passes when a commit message opts out with [no status]', t => {
    const { root, git, run } = repoWithStatus(t);
    fs.writeFileSync(path.join(root, 'apps/a.ts'), 'two\n');
    git('commit', '-q', '-am', 'typo fix [no status]');
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /\[no status\]/);
});

test('fails visibly without a reviewed-commit header', t => {
    const { root, run } = repoWithStatus(t);
    fs.writeFileSync(path.join(root, 'STATUS.md'), 'no header\n');
    const result = run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /no "\*\*Reviewed up to commit:\*\*/);
});
