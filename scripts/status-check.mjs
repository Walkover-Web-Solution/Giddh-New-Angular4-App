#!/usr/bin/env node
// Fails when code changed against the base branch but STATUS.md did not, unless a
// commit message on the branch contains "[no status]". Always lists commits that
// touched code since STATUS.md's "Reviewed up to commit" hash.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const CODE_PATHS = ['apps/', 'libs/', 'xplat/', 'scripts/', 'tools/', '.github/workflows/'];
export const STATUS_FILE = 'STATUS.md';
export const OPT_OUT = '[no status]';

const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const lines = output => output.split('\n').filter(Boolean);

export function isCodePath(file) {
    return CODE_PATHS.some(prefix => file.startsWith(prefix));
}

export function reviewedCommit(statusContent) {
    const match = statusContent.match(/\*\*Reviewed up to commit:\*\*\s*`([0-9a-f]{7,40})`/);
    if (!match) {
        throw new Error(`${STATUS_FILE} has no "**Reviewed up to commit:** \`<hash>\`" header.`);
    }
    return match[1];
}

function commitExists(ref, cwd) {
    try {
        git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], cwd);
        return true;
    } catch {
        return false;
    }
}

function resolveBase(base, cwd) {
    const ref = [`origin/${base}`, base].find(candidate => commitExists(candidate, cwd));
    if (!ref) {
        throw new Error(`Base branch "${base}" not found locally or on origin. Fetch it (CI needs fetch-depth: 0).`);
    }
    return ref;
}

export function runStatusCheck({ cwd = process.cwd(), base }) {
    const report = [];
    const baseRef = resolveBase(base, cwd);
    const mergeBase = git(['merge-base', baseRef, 'HEAD'], cwd);

    const changed = new Set([
        ...lines(git(['diff', '--name-only', mergeBase], cwd)),
        ...lines(git(['ls-files', '--others', '--exclude-standard'], cwd))
    ]);
    const codeChanges = [...changed].filter(isCodePath).sort();
    const statusChanged = changed.has(STATUS_FILE);
    const optedOut = git(['log', '--format=%B', `${mergeBase}..HEAD`], cwd).includes(OPT_OUT);

    const reviewed = reviewedCommit(readFileSync(`${cwd}/${STATUS_FILE}`, 'utf8'));
    if (!commitExists(reviewed, cwd)) {
        throw new Error(`Reviewed commit ${reviewed} is not in this clone. Fetch full history (fetch-depth: 0).`);
    }
    const sinceReview = lines(git(['log', '--oneline', `${reviewed}..HEAD`, '--', ...CODE_PATHS], cwd));

    report.push(`Base: ${baseRef} (merge base ${mergeBase.slice(0, 10)})`);
    report.push(`Code files changed on this branch: ${codeChanges.length}`);
    codeChanges.forEach(file => report.push(`  ${file}`));
    report.push(`${STATUS_FILE} changed: ${statusChanged ? 'yes' : 'no'}`);
    report.push(`Commits touching code since reviewed commit ${reviewed}: ${sinceReview.length}`);
    sinceReview.forEach(commit => report.push(`  ${commit}`));

    let ok = true;
    if (codeChanges.length && !statusChanged) {
        if (optedOut) {
            report.push(`Passed: a commit message contains "${OPT_OUT}".`);
        } else {
            ok = false;
            report.push(`Failed: code changed but ${STATUS_FILE} did not. Update the affected row, add a change-log line ` +
                `and the "Reviewed up to commit" hash, or put "${OPT_OUT}" in a commit message.`);
        }
    } else {
        report.push('Passed.');
    }
    return { ok, report };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const base = process.env.STATUS_BASE || process.env.GITHUB_BASE_REF || 'giddh-2.0';
    try {
        const { ok, report } = runStatusCheck({ base });
        (ok ? console.log : console.error)(report.join('\n'));
        process.exitCode = ok ? 0 : 1;
    } catch (error) {
        console.error(`Status check error: ${error.message}`);
        process.exitCode = 1;
    }
}
