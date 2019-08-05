'use strict';

import * as os from 'os';
import * as path from 'path';
const Configstore = require('configstore');

import * as url from 'url';
import { isDev } from './util';

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
  private store = new Configstore('Gidhh-unofficial', {windows: defaultWindows()});

  private data: Config;

  constructor() {
    if (os.platform() === 'darwin') {
      this.store.path = path.join(os.homedir(), 'Library', 'Preferences', 'org.walkover.giddh' + (isDev() ? '-dev' : '') + '.json');
    }
  }

  public restoreWindows(): void {
    console.log(DEFAULT_URL);
    const data = this.getOrLoadData();
    data.windows = defaultWindows();
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
