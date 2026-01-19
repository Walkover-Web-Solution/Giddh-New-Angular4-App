import { Injectable } from '@angular/core';

function _window(): any {
    // return the native window obj
    return window;
}

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * WindowRef class
 * Implements WindowRef functionality
 */
export class WindowRef {

    get nativeWindow(): any {
        return _window();
    }

}
