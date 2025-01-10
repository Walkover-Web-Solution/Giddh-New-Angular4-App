import { Injectable } from '@angular/core';
import { Configuration } from '../app.constant';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    private envConfig: any = null;

    constructor() { }

    // /**
    //  * Initialize environment variables
    //  */
    // initializeEnvironment(): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         const config = this.getCookieConfig()?.body;

    //         if (config) {
    //             // Perform environment setup
    //             const envUpdates = {
    //                 'AppUrl': `https://${config.giddhWhiteLabel.domainName}/`,
    //                 'ApiUrl': `https://${config.giddhWhiteLabel.apiDomainName}/`,
    //                 'GOOGLE_CLIENT_ID': config.googleClientId,
    //                 'GOOGLE_CLIENT_SECRET': config.googleClientSecret,
    //                 'OTP_WIDGET_ID': config.otpWidgetId,
    //                 'OTP_TOKEN_AUTH': config.otpWidgetToken,
    //                 'PORTAL_URL': `https://${config.giddhWhiteLabel.portalDomain}/`
    //             };

    //             // Update environment variables in window object
    //             Object.entries(envUpdates).forEach(([key, value]) => {
    //                 (window as any)[key] = value;
    //                 (window as any)[`process.env.${key}`] = value;
    //             });

    //             // Store the config for later use
    //             this.envConfig = config;
    //             resolve();
    //         } else {
    //             reject('Config not found in cookie');
    //         }
    //     });
    // }

    // /**
    //  * Get the cookie configuration
    //  */
    // private getCookieConfig() {

    //     // Set temporary cookie if it doesn't exist
    //     if (!document.cookie.includes('whiteLabel=')) {
    //         this.setTempCookie();
    //     }

    //     try {
    //         const cookie = document.cookie
    //             .split('; ')
    //             .find(row => row.startsWith('whiteLabel='));
    //         return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
    //     } catch (e) {
    //         console.error('Error parsing cookie:', e);
    //         return null;
    //     }
    // }

    // /**
    //  * Set a temporary cookie if it doesn't exist
    //  */
    // private setTempCookie() {
    //     const whiteLabelCookie = document.cookie
    //         .split('; ')
    //         .find(cookie => cookie.startsWith('whiteLabel='))
    //         ?.split('=')[1];
    //     document.cookie = `whiteLabel=${whiteLabelCookie}; path=/`;
    //     console.log(document.cookie);

    // }

    // /**
    //  * Create service config based on the environment
    //  */
    // createServiceConfig() {
    //     const config = this.envConfig?.body;
    //     return {
    //         apiUrl: config?.giddhWhiteLabel?.apiDomainName
    //             ? `https://${config.giddhWhiteLabel.apiDomainName}/`
    //             : Configuration.ApiUrl,
    //         appUrl: config?.giddhWhiteLabel?.domainName
    //             ? `https://${config.giddhWhiteLabel.domainName}/`
    //             : Configuration.AppUrl
    //     };
    // }
}
