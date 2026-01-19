import { Injectable, Inject } from '@angular/core';
import { isObject } from '@giddh-workspaces/utils';
import { XPlatWindow } from '../models';
import { PlatformWindowToken } from './tokens';

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * WindowService service
 * Provides window related business logic and data operations
 */
export class WindowService {
    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Inject(PlatformWindowToken) private _platformWindow: XPlatWindow
    ) { }

    public get navigator() {
        return this._platformWindow.navigator;
    }

    public get location() {
        return this._platformWindow.location;
    }

    public get process() {
        return this._platformWindow.process;
    }

    public get require() {
        return this._platformWindow.require;
    }

    /**
     * Handles alert functionality
     */
    public alert(msg: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const result: any = this._platformWindow.alert(msg);
            /**
             * Handles if functionality
             */
            if (isObject(result) && result.then) {
                // console.log('WindowService -- using result.then promise');
                result.then(resolve, reject);
            } else {
                /**
                 * Handles resolve functionality
                 */
                resolve();
            }
        });
    }

    /**
     * Handles confirm functionality
     */
    public confirm(
        msg: any,
        action?: Function /* used for fancyalerts on mobile*/
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const result: any = (<any>this._platformWindow).confirm(
                msg,
                undefined
            );
            /**
             * Handles if functionality
             */
            if (isObject(result) && result.then) {
                result.then(resolve, reject);
            } else if (result) {
                /**
                 * Handles resolve functionality
                 */
                resolve();
            } else {
                /**
                 * Handles reject functionality
                 */
                reject();
            }
        });
    }

    /**
     * Sets timeout value
     */
    public setTimeout(
        /**
         * Handles r event
         */
        handler: (...args: any[]) => void,
        timeout?: number
    ): number {
        return this._platformWindow.setTimeout(handler, timeout);
    }

    /**
     * Handles clearTimeout functionality
     */
    public clearTimeout(timeoutId: number): void {
        return this._platformWindow.clearTimeout(timeoutId);
    }

    /**
     * Sets interval value
     */
    public setInterval(
        /**
         * Handles r event
         */
        handler: (...args: any[]) => void,
        ms?: number,
        ...args: any[]
    ): number {
        return this._platformWindow.setInterval(handler, ms, args);
    }

    /**
     * Handles clearInterval functionality
     */
    public clearInterval(intervalId: number): void {
        return this._platformWindow.clearInterval(intervalId);
    }
}
