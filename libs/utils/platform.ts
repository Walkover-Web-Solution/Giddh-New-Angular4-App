import { saveAs } from 'file-saver';

/**
 * NativeScript helpers
 */

declare var NSObject, NSString, android, java, window, device, cordova;

/**
 * Determine if running on native iOS mobile app
 */
export function isIOS() {
    return typeof NSObject !== 'undefined' && typeof NSString !== 'undefined';
}

/**
 * Determine if running on native Android mobile app
 */
export function isAndroid() {
    return typeof android !== 'undefined' && typeof java !== 'undefined';
}

/**
 * Determine if running on native iOS or Android mobile app
 */
export function isNativeScript() {
    return isIOS() || isAndroid();
}

/**
 * Electron helpers
 */
export function isElectron() {
    return typeof window !== 'undefined' && window.process && window.process.type;
}

/**
 * Cordova helpers
 */
export function isCordova() {
    return typeof window !== 'undefined' && !!window.cordova;
}

export function download(filename, data, mimeType) {
    const blob = data;
    if (window.cordova && cordova.platformId !== "browser") {
        document.addEventListener("deviceready", () => {
            // debugger;
            let storageLocation = "";

            switch (device.platform) {
                case "Android":
                    storageLocation = cordova.file.externalDataDirectory;
                    break;

                case "iOS":
                    storageLocation = cordova.file.documentsDirectory;
                    break;
            }

            const folderPath = storageLocation;

            window.resolveLocalFileSystemURL(
                folderPath,
                (dir) => {
                    dir.getFile(
                        filename,
                        {
                            create: true
                        },
                        (file) => {
                            // debugger;
                            file.createWriter(
                                (fileWriter) => {

                                    fileWriter.write(blob);

                                    fileWriter.onwriteend = () => {
                                        // debugger;
                                        const url = file.toURL();
                                        cordova.plugins.fileOpener2.open(url, mimeType, {
                                            error: (err) => {
                                                // debugger;
                                                //console.error(err);
                                                alert("No app available to open this type of file.");
                                            },
                                            success: () => {
                                                // debugger;
                                                //alert("success with opening the file");
                                            }
                                        });
                                    };

                                    fileWriter.onerror = (err) => {
                                        //alert("Unable to download");
                                        //console.error(err);
                                    };
                                },
                                (err) => {
                                    // failed
                                    //alert("Unable to download");
                                    //console.error(err);
                                }
                            );
                        },
                        (err) => {
                            //alert("Unable to download");
                            //console.error(err);
                        }
                    );
                },
                (err) => {
                   
                }
            );
        });
    } else {
        saveAs(blob, filename);
    }
}


export function isIOSCordova() {
    // Depending on the device, a few examples are:
    //   - "Android"
    //   - "BlackBerry 10"
    //   - "browser"
    //   - "iOS"
    //   - "WinCE"
    //   - "Tizen"
    //   - "Mac OS X"
    //     debugger;
    if (window.cordova && cordova.platformId !== "browser") {
        const devicePlatform = device.platform;
        return isCordova() && device.platform === "iOS";
    }
}

/**
 * Determine if running on native Android mobile app
 */
export function isAndroidCordova() {
    // Depending on the device, a few examples are:
    //   - "Android"
    //   - "BlackBerry 10"
    //   - "browser"
    //   - "iOS"
    //   - "WinCE"
    //   - "Tizen"
    //   - "Mac OS X"
    //     debugger;
    if (window.cordova && cordova.platformId !== "browser") {
        const devicePlatform = device.platform;
        return isCordova() && device.platform === "Android";
    }
}

