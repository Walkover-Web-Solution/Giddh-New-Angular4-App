#!/usr/bin/env node
/**
 * Resolve next Electron app version from S3 release feeds + release-meta.json.
 *
 * Usage:
 *   node scripts/fetch-next-version.js <test|prod> [--dry-run]
 *
 * Env:
 *   S3_BUCKET, AWS_REGION (required for remote fetch)
 *   ELECTRON_SOURCE_FINGERPRINT (required for reuse across Win/Mac)
 *   PACKAGE_JSON_PATH (default: apps/electron-giddh/src/package.json)
 *   S3_PUBLIC_BASE (optional override, e.g. https://s3-ap-south-1.amazonaws.com/bucket)
 */

const fs = require('fs');
const path = require('path');

const PREFIX = process.argv[2];
const DRY_RUN = process.argv.includes('--dry-run');
const PACKAGE_JSON_PATH = process.env.PACKAGE_JSON_PATH
    || path.join('apps', 'electron-giddh', 'src', 'package.json');
const SOURCE_FINGERPRINT = process.env.ELECTRON_SOURCE_FINGERPRINT || '';

function fail(message) {
    console.error(`❌ ${message}`);
    process.exit(1);
}

function parseSemver(version) {
    if (typeof version !== 'string') {
        return null;
    }
    const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) {
        return null;
    }
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        raw: `${match[1]}.${match[2]}.${match[3]}`
    };
}

function compareSemver(a, b) {
    const left = parseSemver(a);
    const right = parseSemver(b);
    if (!left || !right) {
        return 0;
    }
    if (left.major !== right.major) {
        return left.major - right.major;
    }
    if (left.minor !== right.minor) {
        return left.minor - right.minor;
    }
    return left.patch - right.patch;
}

function maxSemver(versions) {
    return versions
        .filter((v) => parseSemver(v))
        .reduce((best, current) => {
            if (!best) {
                return current;
            }
            return compareSemver(current, best) > 0 ? current : best;
        }, null);
}

function incrementPatch(version) {
    const parsed = parseSemver(version);
    if (!parsed) {
        fail(`Cannot increment invalid version: ${version}`);
    }
    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
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

async function fetchText(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            return null;
        }
        return await response.text();
    } catch {
        return null;
    }
}

function parseYamlVersion(ymlText) {
    if (!ymlText) {
        return null;
    }
    const match = ymlText.match(/^version:\s*['"]?([0-9]+\.[0-9]+\.[0-9]+)['"]?\s*$/m);
    return match ? match[1] : null;
}

async function fetchRemoteState(prefix, baseUrl) {
    const releaseMetaUrl = `${baseUrl}/${prefix}/release-meta.json`;
    const windowsYmlUrl = `${baseUrl}/${prefix}/windows/latest/latest.yml`;
    const macYmlUrl = `${baseUrl}/${prefix}/mac/latest/latest-mac.yml`;

    const [metaText, windowsYml, macYml] = await Promise.all([
        fetchText(releaseMetaUrl),
        fetchText(windowsYmlUrl),
        fetchText(macYmlUrl)
    ]);

    let releaseMeta = null;
    if (metaText) {
        try {
            releaseMeta = JSON.parse(metaText);
        } catch {
            releaseMeta = null;
        }
    }

    const windowsVersion = parseYamlVersion(windowsYml);
    const macVersion = parseYamlVersion(macYml);
    const metaVersion = releaseMeta && parseSemver(releaseMeta.version) ? releaseMeta.version : null;

    // Include release-meta so preview-only publishes still advance the sequence.
    const highestRemoteVersion = maxSemver([windowsVersion, macVersion, metaVersion].filter(Boolean));

    return {
        releaseMeta,
        windowsVersion,
        macVersion,
        highestRemoteVersion,
        urls: { releaseMetaUrl, windowsYmlUrl, macYmlUrl }
    };
}

function decideNextVersion(packageVersion, remoteState, sourceFingerprint) {
    const { releaseMeta, highestRemoteVersion } = remoteState;

    if (
        releaseMeta
        && parseSemver(releaseMeta.version)
        && sourceFingerprint
        && releaseMeta.sourceFingerprint === sourceFingerprint
    ) {
        return {
            version: releaseMeta.version,
            reason: 'reuse_release_meta_same_fingerprint'
        };
    }

    if (!highestRemoteVersion) {
        return {
            version: packageVersion,
            reason: 'no_remote_version_use_package_json'
        };
    }

    if (compareSemver(packageVersion, highestRemoteVersion) > 0) {
        return {
            version: packageVersion,
            reason: 'package_json_ahead_manual_bump'
        };
    }

    return {
        version: incrementPatch(highestRemoteVersion),
        reason: 'increment_patch_from_highest_remote'
    };
}

async function main() {
    if (!PREFIX || !['test', 'prod'].includes(PREFIX)) {
        fail('Usage: node scripts/fetch-next-version.js <test|prod> [--dry-run]');
    }

    const packageJsonAbs = path.resolve(PACKAGE_JSON_PATH);
    if (!fs.existsSync(packageJsonAbs)) {
        fail(`package.json not found: ${packageJsonAbs}`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonAbs, 'utf8'));
    const packageVersion = packageJson.version;
    if (!parseSemver(packageVersion)) {
        fail(`Invalid package.json version (expected MAJOR.MINOR.PATCH): ${packageVersion}`);
    }

    const baseUrl = publicBaseUrl();
    let remoteState = {
        releaseMeta: null,
        windowsVersion: null,
        macVersion: null,
        highestRemoteVersion: null,
        urls: null
    };

    if (baseUrl) {
        remoteState = await fetchRemoteState(PREFIX, baseUrl);
    } else {
        console.warn('⚠️  S3_BUCKET/AWS_REGION missing; skipping remote version discovery');
    }

    const decision = decideNextVersion(packageVersion, remoteState, SOURCE_FINGERPRINT);
    const decidedVersion = decision.version;

    const decisionLog = {
        prefix: PREFIX,
        packageVersion,
        decidedVersion,
        reason: decision.reason,
        sourceFingerprint: SOURCE_FINGERPRINT || null,
        highestRemoteVersion: remoteState.highestRemoteVersion,
        windowsVersion: remoteState.windowsVersion,
        macVersion: remoteState.macVersion,
        releaseMetaVersion: remoteState.releaseMeta?.version || null,
        releaseMetaFingerprint: remoteState.releaseMeta?.sourceFingerprint || null,
        dryRun: DRY_RUN,
        packageJsonPath: PACKAGE_JSON_PATH
    };

    console.log('VERSION_DECISION_JSON=' + JSON.stringify(decisionLog));
    console.log(`Resolved Electron version: ${decidedVersion} (${decision.reason})`);

    if (decidedVersion !== packageVersion) {
        if (DRY_RUN) {
            console.log(`[dry-run] Would update ${PACKAGE_JSON_PATH}: ${packageVersion} → ${decidedVersion}`);
        } else {
            packageJson.version = decidedVersion;
            fs.writeFileSync(packageJsonAbs, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
            console.log(`Updated ${PACKAGE_JSON_PATH}: ${packageVersion} → ${decidedVersion}`);
        }
    } else {
        console.log(`Keeping package.json version: ${packageVersion}`);
    }

    // Helpful for CI without parsing JSON logs
    if (process.env.GITHUB_ENV) {
        fs.appendFileSync(process.env.GITHUB_ENV, `PACKAGE_VERSION=${decidedVersion}\n`, 'utf8');
    }
    if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${decidedVersion}\n`, 'utf8');
    }
}

main().catch((error) => {
    fail(error && error.message ? error.message : String(error));
});
