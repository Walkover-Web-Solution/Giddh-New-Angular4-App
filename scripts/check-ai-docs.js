#!/usr/bin/env node
// Check the maintained agent map without installing application dependencies.
const fs = require('node:fs');
const path = require('node:path');

const documents = [
    'AGENTS.md', 'docs/VISION.md', 'docs/ARCHITECTURE.md', 'docs/FLOWS.md',
    'docs/DESIGN.md', 'docs/CONTRACTS.md', 'docs/EXPERIMENTS.md',
    'docs/DEVELOPMENT.md', 'docs/DECISIONS.md', 'docs/OPEN_QUESTIONS.md',
    'docs/VERIFICATION.md', 'docs/REVIEW.md'
];

function withoutFences(content) {
    return content.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
}

function headingIds(content) {
    const counts = new Map();
    return new Set([...withoutFences(content).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)].map(match => {
        const slug = match[1].toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
        const count = counts.get(slug) || 0;
        counts.set(slug, count + 1);
        return count ? `${slug}-${count}` : slug;
    }));
}

function checkDocuments(root, files = documents) {
    const errors = [];
    for (const file of files) {
        const absolute = path.resolve(root, file);
        if (!fs.existsSync(absolute)) {
            errors.push(`${file}: missing document`);
            continue;
        }
        const content = fs.readFileSync(absolute, 'utf8');
        if (!content.trim() || /\{\{[A-Z][A-Z_\d]*\}\}|<!--\s*fill:/i.test(content)) {
            errors.push(`${file}: empty document or unfinished template`);
        }
        // Scope: inline Markdown links in the maintained map; no network requests.
        for (const match of withoutFences(content).matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
            const target = match[1];
            if (/^[a-z][a-z\d+.-]*:/i.test(target)) continue;
            try {
                const [filePart, fragment] = target.split('#');
                const destination = filePart ? path.resolve(path.dirname(absolute), decodeURIComponent(filePart)) : absolute;
                if (!fs.existsSync(destination)) {
                    errors.push(`${file}: missing link ${target}`);
                } else if (fragment && destination.endsWith('.md') &&
                    !headingIds(fs.readFileSync(destination, 'utf8')).has(decodeURIComponent(fragment))) {
                    errors.push(`${file}: missing heading ${target}`);
                }
            } catch (error) {
                errors.push(`${file}: invalid link ${target}: ${error.message}`);
            }
        }
    }
    return errors;
}

if (require.main === module) {
    const errors = checkDocuments(path.resolve(__dirname, '..'));
    if (errors.length) {
        console.error(errors.join('\n'));
        process.exitCode = 1;
    } else {
        console.log(`Agent map: ${documents.length} documents, local links and template checks passed.`);
    }
}

module.exports = { checkDocuments };
