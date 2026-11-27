#!/usr/bin/env node
/**
 * Prepare Electron release-meta.json for S3 coordination (Windows + macOS same version).
 *
 * Usage:
 *   node scripts/electron-release-meta.js reserve --platform windows|mac --out path.json
 *   node scripts/electron-release-meta.js complete --platform windows|mac --in path.json --out path.json
 *
 * Env:
 *   PACKAGE_VERSION, S3_PATH_PREFIX (or BUILD_ENV), ELECTRON_SOURCE_FINGERPRINT
 *   GITHUB_REF_NAME, GITHUB_SHA
 *   S3_BUCKET, AWS_REGION (for fetching existing meta on reserve/complete)
 *   EXISTING_META_PATH (optional local file instead of fetch)
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

function readFlag(name) {
    const index = args.indexOf(name);
    if (index === -1 || index === args.length - 1) {
        return null;
    }
    return args[index + 1];
}

function fail(message) {
    console.error(`❌ ${message}`);
    process.exit(1);
}

function publicBaseUrl() {
    if (process.env.S3_PUBLIC_BASE) {
        return process.env.S3_PUBLIC_BASE.replace(/\/$/, '');
    }
    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION;
    if (!bucket || !region) {
        return null;
    }
    return `https://s3-${region}.amazonaws.com/${bucket}`;
}

async function fetchJson(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch {
        return null;
    }
}

async function loadExistingMeta(prefix) {
    if (process.env.EXISTING_META_PATH && fs.existsSync(process.env.EXISTING_META_PATH)) {
        return JSON.parse(fs.readFileSync(process.env.EXISTING_META_PATH, 'utf8'));
    }
    const baseUrl = publicBaseUrl();
    if (!baseUrl) {
        return null;
    }
    return fetchJson(`${baseUrl}/${prefix}/release-meta.json`);
}

function normalizePlatform(platform) {
    if (platform === 'windows' || platform === 'mac') {
        return platform;
    }
    fail(`platform must be windows|mac (got: ${platform})`);
}

function emptyPlatforms() {
    return { windows: 'pending', mac: 'pending' };
}

async function reserve() {
    const platform = normalizePlatform(readFlag('--platform'));
    const outPath = readFlag('--out') || 'artifacts/release-meta.json';
    const version = process.env.PACKAGE_VERSION;
    const prefix = process.env.S3_PATH_PREFIX || process.env.BUILD_ENV;
    const fingerprint = process.env.ELECTRON_SOURCE_FINGERPRINT || '';

    if (!version) {
        fail('PACKAGE_VERSION is required');
    }
    if (!prefix) {
        fail('S3_PATH_PREFIX or BUILD_ENV is required');
    }

    const existing = await loadExistingMeta(prefix);
    let meta;

    if (existing && existing.sourceFingerprint === fingerprint && existing.version === version) {
        meta = {
            ...existing,
            status: 'in_progress',
            platforms: {
                windows: existing.platforms?.windows || 'pending',
                mac: existing.platforms?.mac || 'pending'
            }
        };
        meta.platforms[platform] = 'in_progress';
    } else {
        meta = {
            version,
            prefix,
            branch: process.env.GITHUB_REF_NAME || '',
            commitSha: process.env.GITHUB_SHA || '',
            sourceFingerprint: fingerprint,
            status: 'in_progress',
            platforms: emptyPlatforms(),
            generatedAt: new Date().toISOString()
        };
        meta.platforms[platform] = 'in_progress';
    }

    meta.updatedAt = new Date().toISOString();

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
    console.log(`Wrote reserve meta → ${outPath}`);
    console.log(JSON.stringify(meta));
}

async function complete() {
    const platform = normalizePlatform(readFlag('--platform'));
    const inPath = readFlag('--in');
    const outPath = readFlag('--out') || inPath || 'artifacts/release-meta.json';
    const prefix = process.env.S3_PATH_PREFIX || process.env.BUILD_ENV;

    let meta = null;
    if (inPath && fs.existsSync(inPath)) {
        meta = JSON.parse(fs.readFileSync(inPath, 'utf8'));
    } else {
        meta = await loadExistingMeta(prefix);
    }

    if (!meta) {
        fail('No release-meta.json available to complete');
    }

    meta.platforms = {
        windows: meta.platforms?.windows || 'pending',
        mac: meta.platforms?.mac || 'pending',
        ...meta.platforms
    };
    meta.platforms[platform] = 'completed';

    const bothDone = meta.platforms.windows === 'completed' && meta.platforms.mac === 'completed';
    meta.status = bothDone ? 'completed' : 'in_progress';
    meta.updatedAt = new Date().toISOString();

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
    console.log(`Wrote complete meta → ${outPath} (status=${meta.status})`);
    console.log(JSON.stringify(meta));
}

async function main() {
    if (command === 'reserve') {
        await reserve();
        return;
    }
    if (command === 'complete') {
        await complete();
        return;
    }
    fail('Usage: node scripts/electron-release-meta.js <reserve|complete> --platform windows|mac [--out path] [--in path]');
}

main().catch((error) => {
    fail(error && error.message ? error.message : String(error));
});
