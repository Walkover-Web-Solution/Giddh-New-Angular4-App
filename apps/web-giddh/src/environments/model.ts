import { NgModuleRef } from '@angular/core';

export interface Environment {
    production: boolean;
    ENV_PROVIDERS: any;
    showDevModule: boolean;
    AppUrl: string;
    ApiUrl: string;
    UkApiUrl: string;
    isElectron: boolean;
    APP_FOLDER: string;
    PORTAL_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID_PROD: string;
    GOOGLE_CLIENT_SECRET_PROD: string;
    OTP_WIDGET_ID: string;
    OTP_TOKEN_AUTH: string;
    RAZORPAY_KEY: string;
    PRODUCTION_ENV: boolean;
    STAGING_ENV: boolean;
    LOCAL_ENV: boolean;
    TEST_ENV: boolean;
    decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
