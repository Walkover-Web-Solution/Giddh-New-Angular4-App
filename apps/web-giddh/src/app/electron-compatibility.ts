/**
 * Electron Compatibility Layer
 * Provides secure access to Electron APIs in contextIsolation environment
 */

declare global {
  interface Window {
    electronAPI?: {
      send: (channel: string, data: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
      isElectron: boolean;
      platform: string;
    };
    GiddhBridge?: any;
    require?: (module: string) => any;
  }
}

// Create a secure require function for Electron
function createSecureRequire() {
  return (module: string) => {
    if (module === 'electron') {
      // Check if new electronAPI is available (secure context)
      if (window.electronAPI && window.electronAPI.send) {
        return {
          ipcRenderer: {
            send: (channel: string, data?: any) => {
              try {
                window.electronAPI!.send(channel, data);
              } catch (error) {

                // Return a no-op function to prevent crashes
                return;
              }
            },
            on: (channel: string, listener: (...args: any[]) => void) => {
              try {
                window.electronAPI!.on(channel, listener);
              } catch (error) {

              }
            },
            removeAllListeners: (channel: string) => {
              try {
                window.electronAPI!.removeAllListeners(channel);
              } catch (error) {

              }
            }
          }
        };
      }

      // Fallback for legacy Electron configurations
      if (window.require && typeof window.require === 'function') {
        try {
          return window.require('electron');
        } catch (error) {
          // Only log in Electron environment, not web
          if ((window as any).isElectron) {

          }
        }
      }

      // Provide a mock IPC renderer to prevent crashes

      return {
        ipcRenderer: {
          send: (channel: string, data?: any) => {

          },
          on: (channel: string, listener: (...args: any[]) => void) => {

          },
          removeAllListeners: (channel: string) => {

          }
        }
      };
    }

    return null;
  };
}

// Initialize the compatibility layer
export function initializeElectronCompatibility() {
  // Only initialize if we're in a browser environment AND in Electron
  if (typeof window !== 'undefined' && (window as any).isElectron) {
    try {
      // Provide secure require function if not already available
      if (!window.require) {
        (window as any).require = createSecureRequire();
      } else {
        // Enhance existing require function to handle secure context
        const originalRequire = window.require;
        (window as any).require = (module: string) => {
          if (module === 'electron') {
            const secureRequire = createSecureRequire();
            const result = secureRequire(module);
            if (result) {
              return result;
            }

            // Fallback to original require if available
            if (originalRequire && typeof originalRequire === 'function') {
              try {
                return originalRequire(module);
              } catch (error) {
                // Only log in Electron environment
                if ((window as any).isElectron) {

                }
                return null;
              }
            }
          }

          // For non-electron modules, use original require if available
          if (originalRequire && typeof originalRequire === 'function') {
            return originalRequire(module);
          }

          return null;
        };
      }
    } catch (error) {
      // Silently handle read-only property errors

      // Create a global fallback function instead
      (window as any).getElectronAPI = createSecureRequire();
    }
  }
}

// Auto-initialize when module is imported
initializeElectronCompatibility();
