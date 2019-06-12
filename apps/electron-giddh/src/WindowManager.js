"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var AppUpdater_1 = __importDefault(require("./AppUpdater"));
var electron_updater_1 = require("electron-updater");
var electronEventSignals_1 = require("./electronEventSignals");
var StateManager_1 = require("./StateManager");
exports.WINDOW_NAVIGATED = 'windowNavigated';
var WindowManager = /** @class */ (function () {
    function WindowManager() {
        var _this = this;
        this.appUpdater = null;
        this.stateManager = new StateManager_1.StateManager();
        this.windows = [];
        electron_1.app.on('window-all-closed', function () {
            // restore default set of windows
            _this.stateManager.restoreWindows();
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform === 'darwin') {
                // reopen initial window
                // this.openWindows();
                if (_this.appUpdater && _this.appUpdater.isUpdateDownloaded) {
                    electron_updater_1.autoUpdater.quitAndInstall();
                }
                else {
                    electron_1.app.quit();
                }
            }
            else {
                if (_this.appUpdater && _this.appUpdater.isUpdateDownloaded) {
                    setTimeout(function () {
                        electron_updater_1.autoUpdater.quitAndInstall();
                    }, 60000);
                }
                else {
                    electron_1.app.quit();
                }
            }
        });
    }
    WindowManager.saveWindowState = function (window, descriptor) {
        if (window.isMaximized()) {
            delete descriptor.width;
            delete descriptor.height;
            delete descriptor.x;
            delete descriptor.y;
        }
        else {
            var bounds = window.getBounds();
            descriptor.width = bounds.width;
            descriptor.height = bounds.height;
            descriptor.x = bounds.x;
            descriptor.y = bounds.y;
        }
    };
    WindowManager.prototype.openWindows = function (url) {
        if (url === void 0) { url = null; }
        var descriptors = this.stateManager.getWindows();
        if (descriptors == null || descriptors.length === 0) {
            this.stateManager.restoreWindows();
            descriptors = this.stateManager.getWindows();
        }
        for (var _i = 0, descriptors_1 = descriptors; _i < descriptors_1.length; _i++) {
            var descriptor = descriptors_1[_i];
            if (isUrlInvalid(descriptor.url) && isUrlInvalid(url)) {
                // was error on load
                descriptor.url = StateManager_1.DEFAULT_URL;
            }
            if (!isUrlInvalid(url)) {
                descriptor.url = url;
                console.log('all set');
            }
            var options = {
                // to avoid visible maximizing
                show: false,
                webPreferences: {
                    nodeIntegration: true
                },
                tabbingIdentifier: 'giddh'
            };
            var isMaximized = true;
            if (descriptor.width != null && descriptor.height != null) {
                options.width = descriptor.width;
                options.height = descriptor.height;
                isMaximized = false;
            }
            if (descriptor.x != null && descriptor.y != null) {
                options.x = descriptor.x;
                options.y = descriptor.y;
                isMaximized = false;
            }
            var window_1 = new electron_1.BrowserWindow(options);
            if (isMaximized) {
                window_1.maximize();
            }
            window_1.loadURL(descriptor.url);
            window_1.show();
            this.registerWindowEventHandlers(window_1, descriptor);
            this.windows.push(window_1);
        }
        // tslint:disable-next-line:no-unused-expression
        this.appUpdater = new AppUpdater_1.default();
    };
    WindowManager.prototype.focusFirstWindow = function () {
        if (this.windows.length > 0) {
            var window_2 = this.windows[0];
            if (window_2.isMinimized()) {
                window_2.restore();
            }
            window_2.focus();
        }
    };
    WindowManager.prototype.registerWindowEventHandlers = function (window, descriptor) {
        var _this = this;
        window.on('close', function () {
            WindowManager.saveWindowState(window, descriptor);
            var url = window.webContents.getURL();
            if (!isUrlInvalid(url)) {
                descriptor.url = url;
            }
            _this.stateManager.save();
        });
        window.on('closed', function (event) {
            var index = _this.windows.indexOf(event.sender);
            console.assert(index >= 0);
            _this.windows.splice(index, 1);
        });
        window.on('app-command', function (e, command) {
            // navigate the window back when the user hits their mouse back button
            if (command === 'browser-backward') {
                if (window.webContents.canGoBack()) {
                    window.webContents.goBack();
                }
            }
            else if (command === 'browser-forward') {
                if (window.webContents.canGoForward()) {
                    window.webContents.goForward();
                }
            }
        });
        var webContents = window.webContents;
        // cannot find way to listen url change in pure JS
        new electronEventSignals_1.WebContentsSignal(webContents)
            .navigated(function (event, url) {
            electron_1.ipcMain.emit(exports.WINDOW_NAVIGATED, event.sender, url);
            webContents.send('maybeUrlChanged', url);
        })
            .navigatedInPage(function (event, url) {
            electron_1.ipcMain.emit(exports.WINDOW_NAVIGATED, event.sender, url);
            webContents.send('maybeUrlChanged', url);
        });
    };
    return WindowManager;
}());
exports.default = WindowManager;
function isUrlInvalid(url) {
    return url == null || url.length === 0 || url === 'about:blank';
}
//# sourceMappingURL=WindowManager.js.map