"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var AppMenuManager_1 = __importDefault(require("./AppMenuManager"));
var util_1 = require("./util");
var WindowManager_1 = __importDefault(require("./WindowManager"));
var main_auth_config_1 = require("./main-auth.config");
var windowManager = null;
electron_1.app.on("ready", function () {
    electron_1.ipcMain.on("log.error", function (event, arg) {
        util_1.log(arg);
    });
    AppMenuManager_1.default();
    windowManager = new WindowManager_1.default();
    windowManager.openWindows();
});
electron_1.ipcMain.on("open-url", function (event, arg) {
    windowManager.openWindows(arg);
});
electron_1.ipcMain.on("authenticate", function (event, arg) {
    return __awaiter(this, void 0, void 0, function () {
        var electronOauth2, config, bodyParams, myApiOauth, token, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    electronOauth2 = require("electron-oauth");
                    config = {};
                    bodyParams = {};
                    if (arg === "google") {
                        // google
                        config = main_auth_config_1.GoogleLoginElectronConfig;
                        bodyParams = main_auth_config_1.AdditionalGoogleLoginParams;
                    }
                    else {
                        // linked in
                        config = main_auth_config_1.LinkedinLoginElectronConfig;
                        bodyParams = main_auth_config_1.AdditionalLinkedinLoginParams;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    myApiOauth = electronOauth2(config, {
                        alwaysOnTop: true,
                        autoHideMenuBar: true,
                        webPreferences: {
                            devTools: true,
                            partition: "oauth2",
                            nodeIntegration: false
                        }
                    });
                    return [4 /*yield*/, myApiOauth.getAccessToken(bodyParams)];
                case 2:
                    token = _a.sent();
                    if (arg === "google") {
                        // google
                        event.returnValue = token.access_token;
                        // this.store.dispatch(this.loginAction.signupWithGoogle(token.access_token));
                    }
                    else {
                        // linked in
                        event.returnValue = token.access_token;
                        // this.store.dispatch(this.loginAction.LinkedInElectronLogin(token.access_token));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=index.js.map