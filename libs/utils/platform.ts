import { saveAs } from 'file-saver';

/**
 * NativeScript helpers
 */

declare var window: any;

/**
 * Electron helpers
 */
export const isElectron = () => {
    return window && window.process && window.process.type;
};

export const isCordova = () => {
    return window && window.cordova;
};

export function download(filename: string, data: any, mimeType: string): any {
    const blob = data;
    saveAs(blob, filename);
}
