const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const debugMode = isEnvSet
    ? getFromEnv
    : process.defaultApp ||
    /node_modules[\\/]electron[\\/]/.test(process.execPath);

const getGoogleCredentials = () => {

    if (process.env.PRODUCTION_ENV) {
        return {
            GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
            GOOGLE_CLIENT_SECRET: 'eWzLFEb_T9VrzFjgE40Bz6_l'
        };
    } else {
        return {
            GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
            GOOGLE_CLIENT_SECRET: '8htr7iQVXfZp_n87c99-jm7a'
        };
    }
};
;
const GOOGLE_CLIENT_ID = getGoogleCredentials().GOOGLE_CLIENT_ID;
const GOOGLE_SECRET_KEY = getGoogleCredentials().GOOGLE_CLIENT_SECRET;
const TWITTER_CLIENT_ID = "w64afk3ZflEsdFxd6jyB9wt5j";
const TWITTER_SECRET_KEY = "62GfvL1A6FcSEJBPnw59pjVklVI4QqkvmA1uDEttNLbUl2ZRpy";
const LINKEDIN_CLIENT_ID = "75urm0g3386r26";
const LINKEDIN_SECRET_KEY = "3AJTvaKNOEG4ISJ0";

export const GoogleLoginElectronConfig = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET_KEY,
    authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
    tokenUrl: "https://accounts.google.com/o/oauth2/token",
    useBasicAuthorizationHeader: false,
    redirectUri: "http://localhost"
};

export const AdditionalGoogleLoginParams = {
    scope: ["email"]
};

export const AdditionalLinkedinLoginParams = {
    scope: ["r_emailaddress"],
    state: "STATE",
    type: "2.0"
};

export const LinkedinLoginElectronConfig = {
    clientId: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_SECRET_KEY,
    authorizationUrl: "https://www.linkedin.com/uas/oauth2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    useBasicAuthorizationHeader: false,
    redirectUri: "https://test.giddh.com/login" || "http://localhost"
};
