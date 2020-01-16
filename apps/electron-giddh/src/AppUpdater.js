"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_updater_1 = require("electron-updater");
var electron_1 = require("electron");
var updater;
var AppUpdaterV1 = /** @class */ (function () {
    function AppUpdaterV1() {
        var _this = this;
        this.isUpdateDownloaded = false;
        var log = require('electron-log');
        log.transports.file.level = 'debug';
        electron_updater_1.autoUpdater.logger = log;
        electron_updater_1.autoUpdater.on('update-available', function () {
            if (updater) {
                electron_1.dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }).then(function (resp) {
                    if (resp.response === 0) {
                        electron_updater_1.autoUpdater.downloadUpdate();
                        updater.label = 'Downloading updates. . . . .';
                        updater.enabled = false;
                    }
                    else {
                        updater.enabled = true;
                        updater = null;
                    }
                });
            }
            electron_updater_1.autoUpdater.downloadUpdate();
        });
        electron_updater_1.autoUpdater.on('update-not-available', function () {
            if (updater) {
                electron_1.dialog.showMessageBox({
                    title: 'No Updates',
                    message: 'Current version is up-to-date.'
                });
                updater.enabled = true;
                updater = null;
            }
        });
        electron_updater_1.autoUpdater.on('update-downloaded', function () {
            // setTimeout(() => {
            //     this.isUpdateDownloaded = true;
            // }, 60000);
            electron_1.dialog.showMessageBox({
                title: 'Install Updates',
                message: 'Updates downloaded, application will be quit for update...'
            }).then(function () {
                _this.isUpdateDownloaded = true;
                setImmediate(function () { return electron_updater_1.autoUpdater.quitAndInstall(); });
            });
        });
        electron_updater_1.autoUpdater.on('error', function (error) {
            electron_1.dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
        });
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
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