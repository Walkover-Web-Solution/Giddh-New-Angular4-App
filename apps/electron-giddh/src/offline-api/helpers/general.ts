import electron from "electron";
import fs from "fs";
import * as appAath from "path";

/**
 * This will return the config for internet connectivity check
 *
 * @returns
 */
export function getInternetConnectedConfig(): any {
    return {
        timeout: 2000, //timeout connecting to each server, each try
        retries: 1, //number of retries to do before failing
        domain: 'https://apple.com' //the domain to check DNS record of
    };
}

/**
 * This will create the database file
 *
 * @export
 * @param {string} filename
 */
export function createDbFile(filename: string): any {
    try {
        const fileExists = fs.existsSync(filename);
        if (!fileExists) {
            fs.writeFileSync(filename, "", "utf-8");
        }
        return true;
    } catch (error) {
        return error;
    }
}

/**
 * This will return the directory path
 *
 * @export
 * @returns {*}
 */
export function getPath(filename: string): any {
    const app = electron?.app || electron?.remote?.app;
    const path = (app) ? appAath.join(app.getPath('userData'), filename) : filename;
    createDbFile(path);
    return path;
}

/**
 * This will return the default options for every api call
 *
 * @export
 * @param {*} request
 * @param {string} method
 * @returns {*}
 */
export function getDefaultApiOptions(request: any, method: string): any {
    return {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': request.headers['session-id']
        }
    };
}

/**
 * This will return default query params for every api call
 *
 * @export
 * @param {*} request
 * @returns {string}
 */
export function getDefaultQueryParams(request: any): string {
    return 'branchUniqueName=' + request.query.branchUniqueName + '&lang=' + request.query.lang;
}

/**
 * This will return the locked filename
 *
 * @param {string} filename
 * @returns {string}
 */
function getLockedFileName(filename: string) : string {
    return filename?.replace(".db", "-lock.db");
}

/**
 * Locks the file
 *
 * @export
 * @param {string} filename
 * @returns {string}
 */
export function lockFile(filename: string): string {
    const lockedFile = getLockedFileName(filename);
    fs.writeFileSync(lockedFile, "", "utf-8");
    return lockedFile;
}

/**
 * Checks if file is locked
 *
 * @export
 * @param {string} filename
 * @returns {boolean}
 */
export function checkIfFileLocked(filename: string): boolean {
    const lockedFile = getLockedFileName(filename);
    return fs.existsSync(lockedFile);
}

/**
 * Unlocks the file
 *
 * @export
 * @param {string} filename
 */
export function unlockFile(filename: string): void {
    if(checkIfFileLocked(filename)) {
        const lockedFile = getLockedFileName(filename);
        fs.unlinkSync(lockedFile);
    }
}

/**
 * This will wait till file is unlocked
 *
 * @export
 * @param {string} filename
 * @returns {Promise<void>}
 */
export function waitForFileUnlock(filename: string): Promise<void> {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if(!checkIfFileLocked(filename)) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}