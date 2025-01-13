import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Configuration } from '../app.constant';

@Injectable({
    providedIn: 'root'
})
export class ReplaceEnvGuard implements CanActivate {
    private envConfig: any;

    // CanActivate guard method
    canActivate(): Promise<boolean> {
        return this.initializeEnvironment().then(() => true);
    }

    // Initialize environment variables based on cookie data
    private initializeEnvironment(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const config = this.getCookieConfig()?.body;

            if (config) {
                // Perform environment setup
                const envUpdates = {
                    'AppUrl': `https://${config.giddhWhiteLabel.domainName}/`,
                    'ApiUrl': `https://${config.giddhWhiteLabel.apiDomainName}/`,
                    'GOOGLE_CLIENT_ID': config.googleClientId,
                    'GOOGLE_CLIENT_SECRET': config.googleClientSecret,
                    'OTP_WIDGET_ID': config.otpWidgetId,
                    'OTP_TOKEN_AUTH': config.otpWidgetToken,
                    'PORTAL_URL': `https://${config.giddhWhiteLabel.portalDomain}/`
                };

                // Update environment variables in window object
                Object.entries(envUpdates).forEach(([key, value]) => {
                    (window as any)[key] = value;
                    (window as any)[`process.env.${key}`] = value;
                });

                // Store the config for later use
                this.envConfig = config;
                resolve();
            } else {
                reject('Config not found in cookie');
            }
        });
    }

    // Get cookie configuration
    private getCookieConfig(): any {
        // Set temporary cookie if it doesn't exist
        if (!document.cookie.includes('whiteLabel=')) {
            this.setTempCookie();
        }

        try {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('whiteLabel='));
            return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
        } catch (e) {
            console.error('Error parsing cookie:', e);
            return null;
        }
    }

    // Set temporary cookie if needed
    private setTempCookie(): void {
        const whiteLabelCookie = document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith('whiteLabel='))
            ?.split('=')[1];
        document.cookie = `whiteLabel=${whiteLabelCookie}; path=/`;
    }

    // Create service configuration based on the environment config
    private createServiceConfig(): any {
        const config = this.envConfig?.body;
        return {
            apiUrl: config?.giddhWhiteLabel?.apiDomainName
                ? `https://${config.giddhWhiteLabel.apiDomainName}/`
                : Configuration.ApiUrl,
            appUrl: config?.giddhWhiteLabel?.domainName
                ? `https://${config.giddhWhiteLabel.domainName}/`
                : Configuration.AppUrl
        };
    }
}
