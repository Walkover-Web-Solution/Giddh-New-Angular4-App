import { IonicNativePlugin } from '@ionic-native/core';
export interface FileChooserOptions {
    /**
     * comma seperated mime types to filter files.
     */
    mime: string;
}
/**
 * @name File Chooser
 * @description
 *
 * Opens the file picker on Android for the user to select a file, returns a file URI.
 *
 * @usage
 * ```typescript
 * import { FileChooser } from '@ionic-native/file-chooser/ngx';
 *
 * constructor(private fileChooser: FileChooser) { }
 *
 * ...
 *
 * this.fileChooser.open()
 *   .then(uri => console.log(uri))
 *   .catch(e => console.log(e));
 *
 * ```
 * @interfaces
 * FileChooserOptions
 */
export declare class FileChooser extends IonicNativePlugin {
    /**
     * Open a file
     * @param {FileChooserOptions} [options]  Optional parameter, defaults to ''. Filters the file selection list according to mime types
     * @returns {Promise<string>}
     */
    open(options?: FileChooserOptions): Promise<string>;
}
