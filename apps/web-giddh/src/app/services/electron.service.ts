import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI?: {
      send: (channel: string, data: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
      isElectron: boolean;
      platform: string;
    };
    require?: (module: string) => any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  get isElectron(): boolean {
    return !!(window && window.electronAPI && window.electronAPI.isElectron);
  }

  get ipcRenderer() {
    if (!this.isElectron) {
      return null;
    }

    return {
      send: (channel: string, data?: any) => {
        if (window.electronAPI) {
          window.electronAPI.send(channel, data);
        }
      },
      on: (channel: string, listener: (...args: any[]) => void) => {
        if (window.electronAPI) {
          window.electronAPI.on(channel, listener);
        }
      },
      removeAllListeners: (channel: string) => {
        if (window.electronAPI) {
          window.electronAPI.removeAllListeners(channel);
        }
      }
    };
  }

  // Legacy support for existing code patterns
  getLegacyRequire() {
    if (!this.isElectron) {
      return null;
    }

    // Try new API first
    if (window.electronAPI) {
      return (module: string) => {
        if (module === 'electron') {
          return {
            ipcRenderer: this.ipcRenderer
          };
        }
        return null;
      };
    }

    // Fallback to window.require if available (for older Electron versions)
    if (window.require) {
      return window.require;
    }

    return null;
  }
}
