'use strict';

import * as os from 'os';
import * as path from 'path';
import * as ConfigStore from 'configstore';
import { isDev } from './util';
import * as url from 'url';

export const DEFAULT_URL = url.format({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file:',
  slashes: true
});

function defaultWindows() {
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

export class StateManager {
  // private store = new ConfigStore('Gidhh-unofficial', { windows: defaultWindows() });

  private data: Config;

  constructor() {
    // if (os.platform() === 'darwin') {
    //   this.store.path = path.join(os.homedir(), 'Library', 'Preferences', 'org.walkover.giddh' + (isDev() ? '-dev' : '') + '.json');
    // }
  }

  public restoreWindows(): void {
    console.log(DEFAULT_URL);
    let data: Config = { windows: [] };
    data.windows = defaultWindows();
    // this.store.all = data;
  }

  public getWindows(): WindowItem[] {
    return defaultWindows();
  }

  public save(): void {
    const data = this.data;
    if (data != null) {
      // this.store.all = data;
    }
  }
  private getOrLoadData(): Config {
    let data = this.data;
    if (data == null) {
      // data = this.store.all;
      this.data = data;
    }
    return data;
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
