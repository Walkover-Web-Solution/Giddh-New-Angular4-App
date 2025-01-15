import { InjectionToken } from '@angular/core';

export interface IServiceConfigArgs {
    appUrl: string;
    apiUrl: string;
    PORTAL_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    OTP_WIDGET_ID: string;
    OTP_TOKEN_AUTH: string;
    _: any;
}

export const ServiceConfig = new InjectionToken('ServiceConfig');
