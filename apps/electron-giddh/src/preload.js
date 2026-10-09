const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // IPC communication methods
  send: (channel, data) => {
    // Whitelist channels for security
    const validChannels = [
      'open-url',
      'authenticate',
      'authenticate-send-email',
      'take-server-environment',
      'has-unsaved-changes',
      'log.error'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Listen for messages from main process
  on: (channel, func) => {
    const validChannels = [
      'take-your-gmail-token',
      'maybeUrlChanged'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },

  // Listen for messages from main process (once only)
  once: (channel, func) => {
    const validChannels = [
      'take-your-gmail-token',
      'maybeUrlChanged'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (event, ...args) => {
        console.log('Preload: electronAPI once event received:', channel, 'args:', args);
        func(...args);
      });
    }
  },

  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Electron environment detection
  isElectron: true,

  // Platform information
  platform: process.platform
});

// Legacy support for existing code patterns
contextBridge.exposeInMainWorld('require', (module) => {
  if (module === 'electron') {
    return {
      ipcRenderer: {
        send: (channel, data) => {
          const validChannels = [
            'open-url',
            'authenticate',
            'authenticate-send-email',
            'take-server-environment',
            'has-unsaved-changes',
            'log.error'
          ];
          if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
          }
        },
        on: (channel, func) => {
          const validChannels = [
            'take-your-gmail-token',
            'maybeUrlChanged'
          ];
          if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
        },
        once: (channel, func) => {
          const validChannels = [
            'take-your-gmail-token',
            'maybeUrlChanged'
          ];
          if (validChannels.includes(channel)) {
            ipcRenderer.once(channel, (event, ...args) => {
              console.log('Preload: IPC once event received:', channel, 'args:', args);
              func(event, ...args);
            });
          }
        },
        removeAllListeners: (channel) => {
          ipcRenderer.removeAllListeners(channel);
        }
      }
    };
  }
  return null;
});
