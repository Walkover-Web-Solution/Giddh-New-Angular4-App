"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getGoogleCredentials = function () {
    return {
        GOOGLE_CLIENT_ID: "641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com",
        GOOGLE_SECRET_KEY: "eWzLFEb_T9VrzFjgE40Bz6_l"
    };
};
;
var GOOGLE_CLIENT_ID = getGoogleCredentials().GOOGLE_CLIENT_ID;
var GOOGLE_SECRET_KEY = getGoogleCredentials().GOOGLE_SECRET_KEY;
var TWITTER_CLIENT_ID = "w64afk3ZflEsdFxd6jyB9wt5j";
var TWITTER_SECRET_KEY = "62GfvL1A6FcSEJBPnw59pjVklVI4QqkvmA1uDEttNLbUl2ZRpy";
var LINKEDIN_CLIENT_ID = "75urm0g3386r26";
var LINKEDIN_SECRET_KEY = "3AJTvaKNOEG4ISJ0";
exports.GoogleLoginElectronConfig = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET_KEY,
    authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
    tokenUrl: "https://accounts.google.com/o/oauth2/token",
    useBasicAuthorizationHeader: false,
    redirectUri: "http://localhost"
};
exports.AdditionalGoogleLoginParams = {
    scope: ["email"]
};
exports.AdditionalLinkedinLoginParams = {
    scope: ["r_emailaddress"],
    state: "STATE",
    type: "2.0"
};
exports.LinkedinLoginElectronConfig = {
    clientId: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_SECRET_KEY,
    authorizationUrl: "https://www.linkedin.com/uas/oauth2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    useBasicAuthorizationHeader: false,
    redirectUri: "http://test.giddh.com/login" || "http://localhost"
};
//# sourceMappingURL=main-auth.config.js.map