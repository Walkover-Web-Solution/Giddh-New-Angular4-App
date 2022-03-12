/* eslint-disable no-var */
declare var global: any;

(function () {
    if (!global.KeyboardEvent) {
        global.KeyboardEvent = function (_eventType: any, _init: any) { };
    }
})();

export type CustomKeyboardEvent = KeyboardEvent;
