const fs = require('fs');
const path = require('path');
const { notarize } = require('@electron/notarize');

module.exports = async function (params) {
    if (process.platform !== 'darwin') {
        return;
    }

    const appleId = process.env.APPLE_ID || process.env.NOTARIZE_EMAIL;
    const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD || process.env.NOTARIZE_PASS;
    const teamId = process.env.APPLE_TEAM_ID || 'F3U6Z5L2EJ';

    if (!appleId || !appleIdPassword || !teamId) {
        console.warn('⚠️ Skipping notarization — APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID not set.');
        return;
    }

    const appId = 'com.giddh.prod';
    const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);

    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    console.log(`🍎 Notarizing ${appPath}...`);
    await notarize({
        appBundleId: appId,
        appPath,
        appleId,
        appleIdPassword,
        teamId,
        tool: 'notarytool',
    });
    console.log('✅ Notarization complete');
};
