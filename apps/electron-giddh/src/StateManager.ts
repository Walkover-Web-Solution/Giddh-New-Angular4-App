'use strict';

import * as os from 'os';
import * as path from 'path';

const Configstore = require('configstore');

import * as url from 'url';
import { isDev, isPackaged } from './util';

let serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const debugMode = isEnvSet
    ? getFromEnv
    : process.defaultApp ||
    /node_modules[\\/]electron[\\/]/.test(process.execPath);

// In packaged apps, index.html is in the parent directory of app.asar
// In development, it's in the same directory as the compiled JS
const getIndexPath = () => {
    if (isPackaged()) {
        // In packaged apps, __dirname is inside app.asar
        // We need to find index.html which should be in the app root
        const fs = require('fs');
        const possiblePaths = [
            // Standard Electron packaging: index.html at app root
            path.join(process.resourcesPath, '..', 'index.html'),
            // Alternative: index.html in resources folder
            path.join(process.resourcesPath, 'index.html'),
            // Fallback: relative to __dirname
            path.join(__dirname, '..', '..', 'index.html'),
            path.join(__dirname, '..', 'index.html'),
        ];
        
        for (const testPath of possiblePaths) {
            if (fs.existsSync(testPath)) {
                console.log('✅ Found index.html at:', testPath);
                return testPath;
            }
        }
        
        // If not found, log error and return default
        console.error('❌ index.html not found in any expected location');
        console.error('Searched paths:', possiblePaths);
        console.error('__dirname:', __dirname);
        console.error('process.resourcesPath:', process.resourcesPath);
        
        // Return first path as fallback (will show error to user)
        return possiblePaths[0];
    } else {
        // Development: index.html is in the same directory
        return path.join(__dirname, 'index.html');
    }
};

export const DEFAULT_URL = url.format({
    pathname: getIndexPath(),
    protocol: 'file:',
    slashes: true
});

function defaultWindows() {

    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../../../node_modules/electron`)
        });
        return [
            {
                url: 'http://localhost:4200',
                width: 800,
                height: 600,
                webPreferences: {
                    plugins: true,
                    webSecurity: false,
                    devTools: debugMode
                }
            }
        ];
    } else {
        return [
            {
                url: DEFAULT_URL,
                width: 800,
                height: 600,
                webPreferences: {
                    plugins: true,
                    webSecurity: false,
                }
            }
        ];
    }


}

export class StateManager {
    private store = new Configstore('Gidhh-unofficial', { windows: defaultWindows() });

    private data: Config;

    constructor() {
        if (os.platform() === 'darwin') {
            this.store.path = path.join(os.homedir(), 'Library', 'Preferences', 'org.walkover.giddh' + (isDev() ? '-dev' : '') + '.json');
        }
    }

    public restoreWindows(): void {
        const data = this.getOrLoadData();
        data.windows = defaultWindows();
        if (debugMode) {

            process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
        }
        this.store.all = data;
    }

    public getWindows(): WindowItem[] {
        return this.getOrLoadData().windows;
    }

    public save(): void {
        const data = this.data;
        if (data != null) {
            this.store.all = data;
        }
    }

    private getOrLoadData(): Config {
        let data = this.data;
        if (data == null) {
            data = this.store.all;
            this.data = data;
        }
        return this.store.all;
    }
}

interface Config {
    windows: WindowItem[];
}

export interface WindowItem {
    url: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    maximized?: boolean;
}
