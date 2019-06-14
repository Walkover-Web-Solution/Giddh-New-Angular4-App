'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var Configstore = require('configstore');
var url = __importStar(require("url"));
var util_1 = require("./util");
exports.DEFAULT_URL = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
});
function defaultWindows() {
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
        return data;
    };
    return StateManager;
}());
exports.StateManager = StateManager;
//# sourceMappingURL=StateManager.js.map