"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_updater_1 = require("electron-updater");
var updater;
var AppUpdaterV1 = /** @class */ (function () {
    function AppUpdaterV1() {
        var _this = this;
        this.isUpdateDownloaded = false;
        var log = require('electron-log');
        log.transports.file.level = 'debug';
        electron_updater_1.autoUpdater.logger = log;
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
        electron_updater_1.autoUpdater.on('update-available', function () {
            if (updater) {
                updater.label = 'Downloading updates. . . . .';
                updater.enabled = false;
            }
            electron_updater_1.autoUpdater.downloadUpdate();
        });
        electron_updater_1.autoUpdater.on('update-not-available', function () {
            if (updater) {
                updater.enabled = true;
                updater = null;
            }
        });
        electron_updater_1.autoUpdater.on('update-downloaded', function () {
            setTimeout(function () {
                _this.isUpdateDownloaded = true;
            }, 60000);
        });
    }
    return AppUpdaterV1;
}());
exports.default = AppUpdaterV1;
function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    electron_updater_1.autoUpdater.checkForUpdates();
}
exports.checkForUpdates = checkForUpdates;
//# sourceMappingURL=AppUpdater.js.map