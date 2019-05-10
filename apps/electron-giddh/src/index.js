"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var AppMenuManager_1 = __importDefault(require("./AppMenuManager"));
var util_1 = require("./util");
var WindowManager_1 = __importDefault(require("./WindowManager"));
var windowManager = null;
electron_1.app.on('ready', function () {
    electron_1.ipcMain.on('log.error', function (event, arg) {
        util_1.log(arg);
    });
    AppMenuManager_1.default();
    windowManager = new WindowManager_1.default();
    windowManager.openWindows();
});
electron_1.ipcMain.on('open-url', function (event, arg) {
    windowManager.openWindows(arg);
});
//# sourceMappingURL=index.js.map