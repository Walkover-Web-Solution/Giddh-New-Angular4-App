import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CountryCodeService {
    /** Singleton instance of the CountryCodeService */
    private static instance: CountryCodeService;
    /** Stores the cached country code value */
    private countryCode: string | null = null;
    /** BehaviorSubject to handle async state management of country code */
    private countryCodeSubject: any = new BehaviorSubject<string | null>(null);
    /** Flag to track if an API request is in progress */
    private isLoading: boolean = false;
    /** Default country code to use when API calls fail */
    private readonly DEFAULT_COUNTRY_CODE: string = 'in';
    /** API endpoint to get client's IP address */
    private readonly MOBILE_NUMBER_SELF_URL: string = 'https://api.db-ip.com/v2/free/self';
    /** Primary API endpoint to get country code from IP address */
    private readonly MOBILE_NUMBER_IP_ADDRESS_URL: string = 'http://ip-api.com/json/';
    /** Fallback API endpoint to get country code from IP address */
    private readonly MOBILE_NUMBER_ADDRESS_JSON_URL: string = 'https://ipinfo.io/';

    constructor() {
        if (CountryCodeService.instance) {
            return CountryCodeService.instance;
        }
        CountryCodeService.instance = this;
    }

    /**
     * Gets the country code with caching
     * @returns Observable<string> Country code
     */
    public getCountryCode(): Observable<string> {
        if (this.countryCode) {
            return of(this.countryCode);
        }

        if (this.isLoading) {
            return this.countryCodeSubject.asObservable().pipe(
                map(code => code || this.DEFAULT_COUNTRY_CODE)
            );
        }

        this.isLoading = true;
        this.fetchCountryCode().pipe(take(1)).subscribe({
            next: (code: string) => {
                this.countryCode = code;
                this.countryCodeSubject.next(code);
                this.isLoading = false;
            },
            error: () => {
                this.countryCode = this.DEFAULT_COUNTRY_CODE;
                this.countryCodeSubject.next(this.DEFAULT_COUNTRY_CODE);
                this.isLoading = false;
            }
        });

        return this.countryCodeSubject.asObservable().pipe(
            map(code => code || this.DEFAULT_COUNTRY_CODE)
        );
    }

    /**
     * Clears the country code cache
     */
    public clearCache(): void {
        this.countryCode = null;
        this.countryCodeSubject.next(null);
        this.isLoading = false;
    }

    /**
     * Fetches country code from multiple APIs with fallback
     * @returns Observable<string>
     */
    private fetchCountryCode(): Observable<string> {
        return this.getIPAddress().pipe(
            switchMap(response => {
                const ipAddress = response?.ipAddress;
                if (!ipAddress) {
                    return of(this.DEFAULT_COUNTRY_CODE);
                }
                return this.getCountryFromIP(ipAddress);
            }),
            catchError(error => {
                return of(this.DEFAULT_COUNTRY_CODE);
            })
        );
    }

    /**
     * Gets IP address from self URL
     * @returns Observable
     */
    private getIPAddress(): Observable<any> {
        return ajax({
            url: this.MOBILE_NUMBER_SELF_URL,
            method: 'GET'
        }).pipe(
            map(response => response.response),
            catchError(error => {
                return of(null);
            })
        );
    }

    /**
     * Gets country code from IP address using multiple APIs
     * @param ipAddress IP address
     * @returns Observable<string>
     */
    private getCountryFromIP(ipAddress: string): Observable<string> {
        return ajax({
            url: `${this.MOBILE_NUMBER_IP_ADDRESS_URL}${ipAddress}`,
            method: 'GET'
        }).pipe(
            map((response: any) => response.response?.countryCode?.toLowerCase() || this.DEFAULT_COUNTRY_CODE),
            catchError(() => {
                // Fallback to secondary API
                return ajax({
                    url: `${this.MOBILE_NUMBER_ADDRESS_JSON_URL}${ipAddress}/json`,
                    method: 'GET'
                }).pipe(
                    map((response: any) => response.response?.country?.toLowerCase() || this.DEFAULT_COUNTRY_CODE),
                    catchError(() => of(this.DEFAULT_COUNTRY_CODE))
                );
            })
        );
    }
}
