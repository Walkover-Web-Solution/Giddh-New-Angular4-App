import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

// Initialize environment variables based on cookie data
function initializeEnvironment() {
    return new Promise<void>((resolve, reject) => {
        const config = getCookieConfig()?.body || getDummyConfig();
        console.log(config);

        if (config) {
            const envUpdates = {
                "AppUrl": `https://${config.giddhWhiteLabel.domainName}/`,
                "ApiUrl": `https://${config.giddhWhiteLabel.apiDomainName}/`,
                "GOOGLE_CLIENT_ID": config.googleClientId,
                "GOOGLE_CLIENT_SECRET": config.googleClientSecret,
                "OTP_WIDGET_ID": config.otpWidgetId,
                "OTP_TOKEN_AUTH": config.otpWidgetToken,
                "PORTAL_URL": `https://${config.giddhWhiteLabel.portalDomain}/`,
            };

            // Update both window and process.env variables
            Object.entries(envUpdates).forEach(([key, value]) => {
                (window as any)[key] = value;
                (window as any)[`process.env.${key}`] = value;
            });

            resolve();
        } else {
            reject("Config not found in cookie");
        }
    });
}

function getCookieConfig() {
    if (!document.cookie.includes("whiteLabel=")) {
        setTempCookie();
    }

    try {
        const cookie = document.cookie.split("; ").find((row) => row.startsWith("whiteLabel="));
        return cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : null;
    } catch (e) {
        console.error("Error parsing cookie:", e);
        return null;
    }
}

function setTempCookie() {
    const dummyConfig = getDummyConfig();
    document.cookie = `whiteLabel=${encodeURIComponent(JSON.stringify({ body: dummyConfig }))}; path=/`;
}

function getDummyConfig() {
    return {
        googleClientId: "641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com",
        googleClientSecret: "8htr7iQVXfZp_n87c99-jm7a",
        otpWidgetId: "326a63733354393830313330",
        otpWidgetToken: "205968TmXguUAwoD633af103P1",
        calendlyUrl: "https://calendly.com/sales-accounting-software/talk-to-sale",
        emailDomains: ["giddh.com", "walkover.in", "muneem.co", "whozzat.com"],
        iciciSupportedCompanies: [
            "mitti2in16805084405400lx4s8",
            "walkovin164863366504908yve0",
            "iciciiin16929619553650svnjv",
            "aaaain16192663354510ja2o4",
        ],
        giddhWhiteLabel: {
            companyName: "Giddh",
            domainName: "test.giddh.com",
            apiDomainName: "apitest.giddh.com",
            adminDomainName: "vtest.giddh.com",
            archiveStatus: "UNARCHIVED",
            portalDomain: "master.d2n1i21e52r794.amplifyapp.com",
            supportedDomains: ["localhost", "stage.giddh.com", "vtest.giddh.com", "test.giddh.com"],
            logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC"
        },
    };
}
console.log(environment);

// Wait for the environment to initialize before loading the app
initializeEnvironment()
    .then(() => {
        // Once environment is initialized, bootstrap the app
        platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .catch(err => console.log(err));
    })
    .catch(error => {
        console.error("Environment initialization failed:", error);
        // Optionally handle the failure by redirecting or showing an error page
    });
