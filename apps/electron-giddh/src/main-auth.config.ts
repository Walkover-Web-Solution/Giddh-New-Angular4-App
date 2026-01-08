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