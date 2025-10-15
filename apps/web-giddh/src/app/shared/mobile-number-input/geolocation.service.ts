import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { COUNTRIES_DATA } from './countries-data';

/**
 * Interface for IP geolocation API response
 */
export interface GeolocationResponse {
    ipAddress: string;
    continentCode: string;
    continentName: string;
    countryCode: string;
    countryName: string;
    stateProv: string;
    city: string;
}

/**
 * Service to handle IP-based geolocation detection
 * 
 * @export
 * @class GeolocationService
 */
@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    /** API endpoint for IP geolocation */
    private readonly API_URL = 'https://api.db-ip.com/v2/free/self';

    /**
     * Creates an instance of GeolocationService
     * 
     * @param {HttpClient} http - Angular HTTP client
     * @memberof GeolocationService
     */
    constructor(private http: HttpClient) {}

    /**
     * Gets user's location based on IP address
     * 
     * @returns {Observable<GeolocationResponse | null>} Observable with geolocation data or null if failed
     * @memberof GeolocationService
     */
    public getUserLocation(): Observable<GeolocationResponse | null> {
        return this.http.get<GeolocationResponse>(this.API_URL).pipe(
            catchError((error) => {
                console.warn('Failed to get user location:', error);
                return of(null);
            })
        );
    }

    /**
     * Maps country code to dial code using COUNTRIES_DATA array
     * 
     * @param {string} countryCode - ISO country code (e.g., 'IN', 'US', 'GB')
     * @returns {string | null} Dial code if country is found, null otherwise
     * @memberof GeolocationService
     */
    public mapCountryCodeToDialCode(countryCode: string): string | null {
        const country = COUNTRIES_DATA.find(c => c.code === countryCode);
        return country ? country.dialCode : null;
    }
}
