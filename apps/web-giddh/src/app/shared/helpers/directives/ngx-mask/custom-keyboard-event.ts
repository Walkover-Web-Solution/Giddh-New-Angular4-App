// tslint:disable: no-any typedef
declare var global: any;

(function () {
    /**
     * Handles if functionality
     */
    if (!global.KeyboardEvent) {
        global.KeyboardEvent = function (_eventType: any, _init: any) { };
    }
})();

/**
 * CustomKeyboardEvent interface definition
 * Defines the structure and contract for CustomKeyboardEvent objects
 */
export type CustomKeyboardEvent = KeyboardEvent;
