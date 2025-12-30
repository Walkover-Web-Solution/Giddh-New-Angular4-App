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
                console.warn('ElectronAPI send failed:', error);
                // Return a no-op function to prevent crashes
                return;
              }
            },
            on: (channel: string, listener: (...args: any[]) => void) => {
              try {
                window.electronAPI!.on(channel, listener);
              } catch (error) {
                console.warn('ElectronAPI on failed:', error);
              }
            },
            removeAllListeners: (channel: string) => {
              try {
                window.electronAPI!.removeAllListeners(channel);
              } catch (error) {
                console.warn('ElectronAPI removeAllListeners failed:', error);
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
            console.warn('Legacy window.require failed:', error);
          }
        }
      }

      // Provide a mock IPC renderer to prevent crashes
      console.warn('No Electron IPC available - providing mock implementation');
      return {
        ipcRenderer: {
          send: (channel: string, data?: any) => {
            console.warn('Mock IPC send called:', channel, data);
          },
          on: (channel: string, listener: (...args: any[]) => void) => {
            console.warn('Mock IPC on called:', channel);
          },
          removeAllListeners: (channel: string) => {
            console.warn('Mock IPC removeAllListeners called:', channel);
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
                  console.warn('Original require failed for electron module:', error);
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
      console.warn('Cannot modify window.require (read-only in secure context) - using fallback approach');

      // Create a global fallback function instead
      (window as any).getElectronAPI = createSecureRequire();
    }
  }
}

// Auto-initialize when module is imported
initializeElectronCompatibility();
