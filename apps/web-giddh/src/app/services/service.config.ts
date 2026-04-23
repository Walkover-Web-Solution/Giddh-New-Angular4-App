import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment.generated';

export interface IServiceConfigArgs {
    apiUrl: string;
    appUrl: string;
    ApiUrl: string;
    AppUrl: string;
    PORTAL_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    OTP_WIDGET_ID: string;
    OTP_TOKEN_AUTH: string;
    RAZORPAY_KEY: string;
    IS_GIDDH_DOMAIN: boolean;
    
    // All properties from whiteLabel body object
    OTP_WIDGET_ID_WEB?: string;
    OTP_WIDGET_TOKEN_WEB?: string;
    OTP_WIDGET_ID_ELECTRON?: string;
    OTP_WIDGET_TOKEN_ELECTRON?: string;
    CALENDLY_URL?: string;
    EMAIL_DOMAINS?: string[];
    ICICI_SUPPORTED_COMPANIES?: string[];
    PAYU_PAYMENT_DETAILS?: any;
    PROXY_REFERENCE_ID?: string;
    PROXY_URL?: string;
    PROXY_API_URL?: string;
    PROXY_REFERENCE_ID_UK?: string;
    PROXY_API_URL_UK?: string;
    WEBSITE_DOMAIN?: string;
    BRAND_NAME?: string;
    LEGAL_NAME?: string;
    SUPPORT_EMAIL?: string;
    SUPPORT_PHONE?: string;
    GST_CREDENTIALS?: any;
    VAYANA_CREDENTIALS?: any;
    LOGOS: {
        icon: string;
        primary: string;
        light: string;
        favicon: string;
        dark: string;
    };
    GIDDH_WHITE_LABEL?: {
        id?: number;
        uniqueName?: string;
        baseDomain?: string;
        certificateRequired?: boolean;
        certificateStatus?: string;
        domainName?: string;
        portalDomain?: string;
        apiDomain?: string;
        adminDomain?: string;
        uiDomains?: string[];
        theme?: any;
        isActive?: number;
        isDefault?: boolean;
        createdAt?: string;
        updatedAt?: string;
    };

    // Giddh-only URLs - empty string on white label domains
    ANDROID_APP_URL?: string;
    IOS_APP_URL?: string;
    HELP_DOC_URL?: string;
    API_DOC_URL?: string;
    SYNC_TALLY_HELP_DOC_URL?: string;
    BANK_STATEMENT_HELP_DOC_URL?: string;

    _: any;
}

export const ServiceConfig = new InjectionToken('ServiceConfig');
