import { Injectable } from '@angular/core';

declare global {
  /**
   * Window interface definition
   * Defines the structure and contract for Window objects
   */
  interface Window {
    electronAPI?: {
      /**
       * Handles send functionality
       */
      send: (channel: string, data: any) => void;
      /**
       * Handles  event
       */
      on: (channel: string, func: (...args: any[]) => void) => void;
      /**
       * Deletes alllisteners
       */
      removeAllListeners: (channel: string) => void;
      isElectron: boolean;
      platform: string;
    };
    require?: (module: string) => any;
  }
}

/**
 * Handles Injectable functionality
 */
@Injectable({
  providedIn: 'root'
})
/**
 * ElectronService service
 * Provides electron related business logic and data operations
 */
export class ElectronService {

  get isElectron(): boolean {
    return !!(window && window.electronAPI && window.electronAPI.isElectron);
  }

  get ipcRenderer() {
    /**
     * Handles if functionality
     */
    if (!this.isElectron) {
      return null;
    }

    return {
      /**
       * Handles send functionality
       */
      send: (channel: string, data?: any) => {
        /**
         * Handles if functionality
         */
        if (window.electronAPI) {
          window.electronAPI.send(channel, data);
        }
      },
      /**
       * Handles  event
       */
      on: (channel: string, listener: (...args: any[]) => void) => {
        /**
         * Handles if functionality
         */
        if (window.electronAPI) {
          window.electronAPI.on(channel, listener);
        }
      },
      /**
       * Deletes alllisteners
       */
      removeAllListeners: (channel: string) => {
        /**
         * Handles if functionality
         */
        if (window.electronAPI) {
          window.electronAPI.removeAllListeners(channel);
        }
      }
    };
  }

  // Legacy support for existing code patterns
  /**
   * Retrieves legacyrequire data
   */
  getLegacyRequire() {
    /**
     * Handles if functionality
     */
    if (!this.isElectron) {
      return null;
    }

    // Try new API first
    /**
     * Handles if functionality
     */
    if (window.electronAPI) {
      /**
       * Handles return functionality
       */
      return (module: string) => {
        /**
         * Handles if functionality
         */
        if (module === 'electron') {
          return {
            ipcRenderer: this.ipcRenderer
          };
        }
        return null;
      };
    }

    // Fallback to window.require if available (for older Electron versions)
    /**
     * Handles if functionality
     */
    if (window.require) {
      return window.require;
    }

    return null;
  }
}
