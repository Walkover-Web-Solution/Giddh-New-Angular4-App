/**
 * NativeScript helpers
 */

declare var NSObject, NSString, android, java, window,device;

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


export function isIOSCordova() {
    // Depending on the device, a few examples are:
//   - "Android"
//   - "BlackBerry 10"
//   - "browser"
//   - "iOS"
//   - "WinCE"
//   - "Tizen"
//   - "Mac OS X"
    debugger;
    var devicePlatform = device.platform;
    return isCordova() && device.platform==="iOS";
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
    debugger;
    var devicePlatform = device.platform;
    return isCordova() && device.platform==="Android";
}

