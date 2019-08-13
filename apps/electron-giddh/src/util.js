"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var _isDev = require('electron-is-dev');
function isDev() {
    return _isDev;
}
exports.isDev = isDev;
var _log;
if (isDev()) {
    _log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log(args);
    };
}
else {
    // tslint:disable-next-line:no-var-requires
    var log_1 = require('electron-log');
    _log = log_1.info.bind(log_1);
}
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    _log(args);
}
exports.log = log;
//# sourceMappingURL=util.js.map