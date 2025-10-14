// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db

const fs = require('fs');
const path = require('path');
module.exports = async function (params) {
    const { notarize } = await import('@electron/notarize');
    // Only notarize the app on Mac OS only.
    if (process.platform !== 'darwin') {
        return;
    }
    // Same appId in electron-builder.
    const appId = 'com.giddh.prod'; // something like 'com.app_name.io'
    const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);

    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    try {
        await notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: process.env.NOTARIZE_EMAIL, // enter Credential to generate mac's electron build
            appleIdPassword: process.env.NOTARIZE_PASS,
            tool: 'notarytool',
            teamId: "F3U6Z5L2EJ"
        });
    } catch (error) {
        console.error(error);
    }
};
