import electron from "electron";
import fs from "fs";
import * as appAath from "path";
import * as lockFile from "proper-lockfile";

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
    const path = appAath.join(app.getPath('userData'), filename);
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

export function fileLock(file: string): any {
    return lockFile.lockSync(file);
}

export function checkIfFileLocked(file: string): boolean {
    return lockFile.checkSync(file);
}

export function fileUnlock(file: string): void {
    lockFile.unlockSync(file);
}

export function waitForFileUnlock(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}