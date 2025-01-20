import { InjectionToken } from '@angular/core';

export interface IServiceConfigArgs {
    apiUrl: string;
    appUrl:string
    ApiUrl: string;
    AppUrl: string;
    PORTAL_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    OTP_WIDGET_ID: string;
    OTP_TOKEN_AUTH: string;
    _: any;
}

export const ServiceConfig = new InjectionToken('ServiceConfig');
