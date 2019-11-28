"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
function isEnvTrue(v) {
    return v != null && (v.length === 0 || v === 'true');
}
var isLogEvent = isEnvTrue(process.env.LOG_EVENTS);
function addHandlerWebContents(emitter, event, handler) {
    var _this = this;
    if (isLogEvent) {
        // @ts-ignore
        emitter.on(event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log('%s %s', event, args);
            handler.apply(_this, args);
        });
    }
    else {
        // @ts-ignore
        emitter.on(event, handler);
    }
}
function addHandlerApp(emitter, event, handler) {
    var _this = this;
    if (isLogEvent) {
        // @ts-ignore
        emitter.on(event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log('%s %s', event, args);
            handler.apply(_this, args);
        });
    }
    else {
        // @ts-ignore
        emitter.on(event, handler);
    }
}
var WebContentsSignal = /** @class */ (function () {
    function WebContentsSignal(emitter) {
        this.emitter = emitter;
    }
    WebContentsSignal.prototype.navigated = function (handler) {
        addHandlerWebContents(this.emitter, 'did-navigate', handler);
        return this;
    };
    WebContentsSignal.prototype.navigatedInPage = function (handler) {
        addHandlerWebContents(this.emitter, 'did-navigate-in-page', handler);
        return this;
    };
    WebContentsSignal.prototype.frameLoaded = function (handler) {
        addHandlerWebContents(this.emitter, 'did-frame-finish-load', handler);
        return this;
    };
    return WebContentsSignal;
}());
exports.WebContentsSignal = WebContentsSignal;
var AppSignal = /** @class */ (function () {
    function AppSignal() {
        this.emitter = electron_1.app;
    }
    AppSignal.prototype.windowBlurred = function (handler) {
        addHandlerApp(this.emitter, 'browser-window-blur', handler);
        return this;
    };
    AppSignal.prototype.windowFocused = function (handler) {
        addHandlerApp(this.emitter, 'browser-window-focus', handler);
        return this;
    };
    return AppSignal;
}());
exports.AppSignal = AppSignal;
//# sourceMappingURL=electronEventSignals.js.map