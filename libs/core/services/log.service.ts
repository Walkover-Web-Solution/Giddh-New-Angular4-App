// angular
import { Injectable } from '@angular/core';

/**
 * IDebug interface definition
 * Defines the structure and contract for IDebug objects
 */
export interface IDebug {
    LEVEL_1: boolean;
    LEVEL_2: boolean;
    LEVEL_3: boolean;
    LEVEL_4: boolean;
    LEVEL_5: boolean;
}

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * LogService service
 * Provides log related business logic and data operations
 */
export class LogService {
    public static DEBUG: IDebug = {
        LEVEL_1: false, // .warn only
        LEVEL_2: false, // .error only
        LEVEL_3: false, // .log + all the above
        LEVEL_4: false, // .log + all the above + info
        LEVEL_5: false // just info (excluding all else)
    };

    // info (extra messages like analytics)
    // use LEVEL_5 to see only these
    /**
     * Handles info functionality
     */
    public info(...msg: Array<any>) {
        /**
         * Handles if functionality
         */
        if (LogService.DEBUG.LEVEL_5 || LogService.DEBUG.LEVEL_4) {
            // extra messages
            console.info(msg);
        }
    }

    // debug (standard output)
    /**
     * Handles debug functionality
     */
    public debug(...msg: Array<any>) {
        /**
         * Handles if functionality
         */
        if (LogService.DEBUG.LEVEL_4 || LogService.DEBUG.LEVEL_3) {
            // console.debug does not work on {N} apps... use `log`
            console.log(msg);
        }
    }

    // error
    /**
     * Handles error functionality
     */
    public error(...err: Array<any>) {
        /**
         * Handles if functionality
         */
        if (
            LogService.DEBUG.LEVEL_4 ||
            LogService.DEBUG.LEVEL_3 ||
            LogService.DEBUG.LEVEL_2
        ) {
            console.error(err);
        }
    }

    // warn
    /**
     * Handles warn functionality
     */
    public warn(...warn: Array<any>) {
        /**
         * Handles if functionality
         */
        if (
            LogService.DEBUG.LEVEL_4 ||
            LogService.DEBUG.LEVEL_3 ||
            LogService.DEBUG.LEVEL_1
        ) {
            console.warn(warn);
        }
    }
}
