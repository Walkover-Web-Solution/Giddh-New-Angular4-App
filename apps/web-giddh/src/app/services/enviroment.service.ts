import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EnvironmentService {
    private initialized = new BehaviorSubject<boolean>(false);

    constructor() { }

    // Initialize environment variables based on cookie data
    public initializeEnvironment(): Promise<void> {
        return new Promise((resolve, reject) => {
            const config = this.getCookieConfig() || this.getDummyConfig();
            console.log(config);


        });
    }

    private getCookieConfig() {
        if (!document.cookie.includes('whiteLabel=')) {
            this.setTempCookie();
        }

        try {
            const cookie = document.cookie.split('; ').find((row) =>
                row.startsWith('whiteLabel=')
            );
            return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
        } catch (e) {
            console.error('Error parsing cookie:', e);
            return null;
        }
    }

    private setTempCookie() {
        const dummyConfig = this.getDummyConfig();
        document.cookie = `whiteLabel=${encodeURIComponent(
            JSON.stringify({ body: dummyConfig })
        )}; path=/`;
    }

    private getDummyConfig() {
        // return {
        //     googleClientId: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
        //     googleClientSecret: '8htr7iQVXfZp_n87c99-jm7a',
        //     otpWidgetId: '326a63733354393830313330',
        //     otpWidgetToken: '205968TmXguUAwoD633af103P1',
        //     calendlyUrl: 'https://calendly.com/sales-accounting-software/talk-to-sale',
        //     emailDomains: ['giddh.com', 'walkover.in', 'muneem.co', 'whozzat.com'],
        //     iciciSupportedCompanies: [
        //         'mitti2in16805084405400lx4s8',
        //         'walkovin164863366504908yve0',
        //         'iciciiin16929619553650svnjv',
        //         'aaaain16192663354510ja2o4',
        //     ],
        //     giddhWhiteLabel: {
        //         companyName: 'Giddh',
        //         domainName: 'test.giddh.com',
        //         apiDomainName: 'apitest.giddh.com',
        //         adminDomainName: 'vtest.giddh.com',
        //         archiveStatus: 'UNARCHIVED',
        //         portalDomain: 'master.d2n1i21e52r794.amplifyapp.com',
        //         supportedDomains: ['localhost', 'stage.giddh.com', 'vtest.giddh.com', 'test.giddh.com'],
        //         logo:
        //             'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
        //     },
        // };
    }

    // Observable to track initialization state
    get initializationComplete$() {
        return this.initialized.asObservable();
    }
}
