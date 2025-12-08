const getGoogleCredentials = () => {
    if (process.env.PRODUCTION_ENV) {
        return {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID_PROD || '',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET_PROD || ''
        };
    } else {
        return {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID_TEST || '',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET_TEST || ''
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
