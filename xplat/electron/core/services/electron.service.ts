import { Injectable } from '@angular/core';
import { LogService, WindowService } from '@giddh-workspaces/core';
import { isElectron } from '@giddh-workspaces/utils';
import * as childProcess from 'child_process';
import { ipcRenderer } from 'electron';

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * ElectronService service
 * Provides electron related business logic and data operations
 */
export class ElectronService {
    private _ipc: typeof ipcRenderer;
    private _childProcess: typeof childProcess;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _log: LogService, private _win: WindowService) {
        // Conditional imports
        /**
         * Handles if functionality
         */
        if (isElectron()) {
            this._ipc = this._win.require('electron').ipcRenderer;
            this._childProcess = this._win.require('child_process');
            this._log.debug('ElectronService ready.');
        }
    }

    /**
     * Handles  event
     */
    public on(channel: string, listener: Function): void {
        /**
         * Handles if functionality
         */
        if (!this._ipc) {
            return;
        }

        this._ipc.on(channel, listener);
    }

    /**
     * Handles send functionality
     */
    public send(channel: string, ...args): void {
        /**
         * Handles if functionality
         */
        if (!this._ipc) {
            return;
        }

        this._ipc.send(channel, ...args);
    }
}
