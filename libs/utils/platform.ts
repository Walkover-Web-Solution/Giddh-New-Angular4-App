import { saveAs } from 'file-saver';

/**
 * NativeScript helpers
 */

declare var window;

/**
 * Electron helpers
 */
export function isElectron() {
    return typeof window !== 'undefined' && window.process && window.process.type;
}

export function download(filename, data, mimeType): any {
    const blob = data;
    saveAs(blob, filename);
}
