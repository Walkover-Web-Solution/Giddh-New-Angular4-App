const fs = await import('fs');
const path = await import('path');
export default async function (params) {
    const { notarize } = await import('@electron/notarize');
    if (process.platform !== 'darwin') {
        return;
    }

    const appId = 'com.giddh.prod';
    const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);

    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    try {
        await notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: process.env.NOTARIZE_EMAIL,
            appleIdPassword: process.env.NOTARIZE_PASS,
            tool: 'notarytool',
            teamId: 'F3U6Z5L2EJ'
        });
    } catch (error) {
        console.error('Notarization failed:', error);
    }
};
