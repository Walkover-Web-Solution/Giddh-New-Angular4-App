'use strict';

import * as os from 'os';
import * as path from 'path';
import { app } from 'electron';

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

// In packaged apps, index.html is inside app.asar alongside the compiled JS
// In development, it's in the same directory as the compiled JS
const getIndexPath = () => {
    if (isPackaged()) {
        // In packaged apps, __dirname points inside app.asar
        // index.html is packaged inside app.asar in the same directory as main.js
        // So we use __dirname which correctly points inside the asar
        const indexPath = path.join(__dirname, 'index.html');
        console.log('📦 Packaged app - Loading index.html from:', indexPath);
        console.log('   __dirname:', __dirname);
        console.log('   app.getAppPath():', app.getAppPath());
        return indexPath;
    } else {
        // Development: index.html is in the same directory
        const indexPath = path.join(__dirname, 'index.html');
        console.log('🔧 Development mode - Loading index.html from:', indexPath);
        return indexPath;
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
