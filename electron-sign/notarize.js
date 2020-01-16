// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db

const fs = require('fs');
const path = require('path');
const electronNotarize = require('electron-notarize');
module.exports = async function(params) {
    // Only notarize the app on Mac OS only.
    if (process.platform !== 'darwin') {
        return;
    }
    console.log('afterSign hook triggered', params);
    // Same appId in electron-builder.
    const appId = 'com.giddh.prod'; // something like 'com.app_name.io'
    const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);

    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }
    console.log(`Notarizing ${appId} found at ${appPath}`);
    try {
        await electronNotarize.notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: 'rohit@walkover.in', // enter apple id here
            appleIdPassword: 'Mac@1234'
        });
    } catch (error) {
        console.error(error);
    }
    console.log(`Done notarizing ${appId}`);
};
