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


export function download(filename: string, data: any, mimeType: string): any {
    const blob = data;
    /**
     * Saves as data
     */
    saveAs(blob, filename);
}
