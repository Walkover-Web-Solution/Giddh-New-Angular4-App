'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var os = tslib_1.__importStar(require("os"));
var path = tslib_1.__importStar(require("path"));
var Configstore = require('configstore');
var url = tslib_1.__importStar(require("url"));
var util_1 = require("./util");
var serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
// let win: Electron.BrowserWindow = null;
var getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
var isEnvSet = 'ELECTRON_IS_DEV' in process.env;
var debugMode = isEnvSet
    ? getFromEnv
    : process.defaultApp ||
        /node_modules[\\/]electron[\\/]/.test(process.execPath);
exports.DEFAULT_URL = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
});
function defaultWindows() {
    console.log('server: ', serve);
    console.log('debugMode: ', debugMode);
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/../../../node_modules/electron")
        });
        return [
            {
                url: 'http://localhost:4200',
                width: 800,
                height: 600,
                webPreferences: {
                    plugins: true,
                    webSecurity: false,
                    devTools: debugMode
                }
            }
        ];
    }
    else {
        return [
            {
                url: exports.DEFAULT_URL,
                width: 800,
                height: 600,
                webPreferences: {
                    plugins: true,
                    webSecurity: false,
                }
            }
        ];
    }
}
var StateManager = /** @class */ (function () {
    function StateManager() {
        this.store = new Configstore('Gidhh-unofficial', { windows: defaultWindows() });
        if (os.platform() === 'darwin') {
            this.store.path = path.join(os.homedir(), 'Library', 'Preferences', 'org.walkover.giddh' + (util_1.isDev() ? '-dev' : '') + '.json');
        }
    }
    StateManager.prototype.restoreWindows = function () {
        console.log(exports.DEFAULT_URL);
        var data = this.getOrLoadData();
        data.windows = defaultWindows();
        if (debugMode) {
            process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
        }
        this.store.all = data;
    };
    StateManager.prototype.getWindows = function () {
        return this.getOrLoadData().windows;
    };
    StateManager.prototype.save = function () {
        var data = this.data;
        if (data != null) {
            this.store.all = data;
        }
    };
    StateManager.prototype.getOrLoadData = function () {
        var data = this.data;
        if (data == null) {
            data = this.store.all;
            this.data = data;
        }
        return this.store.all;
    };
    return StateManager;
}());
exports.StateManager = StateManager;
//# sourceMappingURL=StateManager.js.map