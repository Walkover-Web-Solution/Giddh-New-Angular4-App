/**
 * SECURITY NOTE: Google Client Secrets are now loaded from environment variables
 * to prevent hardcoded secrets in source code. Set the following environment variables:
 * - GOOGLE_CLIENT_SECRET_PROD: Production Google Client Secret
 * - GOOGLE_CLIENT_SECRET_TEST: Test/Development Google Client Secret
 *
 * These should be set in your deployment environment or .env files (not committed to git)
 */
const getGoogleCredentials = () => {
    if (process.env.PRODUCTION_ENV) {
        return {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID_PROD || '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET_PROD || ''
        };
    } else {
        return {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
        };
    }
};

const GOOGLE_CLIENT_ID = getGoogleCredentials().GOOGLE_CLIENT_ID;
const GOOGLE_SECRET_KEY = getGoogleCredentials().GOOGLE_CLIENT_SECRET;

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
