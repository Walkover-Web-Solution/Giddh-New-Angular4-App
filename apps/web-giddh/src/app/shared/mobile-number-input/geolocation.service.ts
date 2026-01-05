import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
 * Interface for cached geolocation data with expiry
 */
interface CachedGeolocationData {
    data: GeolocationResponse;
    timestamp: number;
    expiryDate: number;
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
    
    /** Cache key for localStorage */
    private readonly CACHE_KEY = 'giddh_country_data_cache';
    
    /** Cache duration in milliseconds (30 days) */
    private readonly CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;

    /**
     * Creates an instance of GeolocationService
     * 
     * @param {HttpClient} http - Angular HTTP client
     * @memberof GeolocationService
     */
    constructor(private http: HttpClient) {}

    /**
     * Gets geolocation data from cache or API with automatic caching
     * 
     * @returns {Observable<GeolocationResponse | null>} Observable with geolocation data or null if failed
     * @memberof GeolocationService
     */
    public getCountryData(): Observable<GeolocationResponse | null> {
        // Check cache first
        if (this.hasValidCache()) {
            const cachedData = this.getCachedData();
            if (cachedData) {
                // Use setTimeout to make it async even for cached data
                return new Observable(observer => {
                    setTimeout(() => {
                        observer.next(cachedData.data);
                        observer.complete();
                    }, 0);
                });
            }
        }

        // Make API call if no valid cache
        return this.http.get<GeolocationResponse>(this.API_URL).pipe(
            tap((data) => {
                if (data) {
                    this.setCachedData(data);
                }
            }),
            catchError((error) => {

                return of(null);
            })
        );
    }

    /**
     * @deprecated Use getCountryData() instead
     * Gets user's location based on IP address
     * 
     * @returns {Observable<GeolocationResponse | null>} Observable with geolocation data or null if failed
     * @memberof GeolocationService
     */
    public getUserLocation(): Observable<GeolocationResponse | null> {
        return this.getCountryData();
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

    /**
     * Maps country code directly to Country object (most accurate for geolocation)
     * Handles all duplicate dial code cases correctly by using country code first
     * 
     * @param {string} countryCode - ISO country code (e.g., 'RU', 'KZ', 'US', 'GB')
     * @returns {any | null} Country object if found, null otherwise
     * @memberof GeolocationService
     */
    public mapCountryCodeToCountry(countryCode: string): any | null {
        // Direct country code mapping - handles all duplicate dial codes correctly
        const country = COUNTRIES_DATA.find(c => c.code === countryCode);
        
        if (country) {
            return country;
        }

        // Fallback mapping for any edge cases or country code variations
        const countryCodeMappings: { [key: string]: string } = {
            // Handle any country code variations if needed
            // Example: 'UK': 'GB' - if API returns UK instead of GB
        };

        const mappedCode = countryCodeMappings[countryCode];
        if (mappedCode) {
            return COUNTRIES_DATA.find(c => c.code === mappedCode) || null;
        }

        return null;
    }

    /**
     * Checks if there is valid cached country data
     * 
     * @returns {boolean} True if valid cache exists, false otherwise
     * @memberof GeolocationService
     */
    public hasValidCache(): boolean {
        try {
            const cachedData = this.getCachedData();
            if (!cachedData) {
                return false;
            }
            
            const now = Date.now();
            return now < cachedData.expiryDate;
        } catch (error) {

            return false;
        }
    }

    /**
     * Clears the cached country data from localStorage
     * 
     * @memberof GeolocationService
     */
    public clearCache(): void {
        try {
            localStorage.removeItem(this.CACHE_KEY);
        } catch (error) {

        }
    }

    /**
     * Gets cached geolocation data from localStorage
     * 
     * @private
     * @returns {CachedGeolocationData | null} Cached data or null if not found/invalid
     * @memberof GeolocationService
     */
    private getCachedData(): CachedGeolocationData | null {
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            if (!cached) {
                return null;
            }
            
            const parsedData: CachedGeolocationData = JSON.parse(cached);
            
            // Validate cache structure
            if (!parsedData.data || !parsedData.timestamp || !parsedData.expiryDate) {
                this.clearCache();
                return null;
            }
            
            return parsedData;
        } catch (error) {

            this.clearCache();
            return null;
        }
    }

    /**
     * Stores geolocation data in localStorage with expiry timestamp
     * 
     * @private
     * @param {GeolocationResponse} data - Geolocation data to cache
     * @memberof GeolocationService
     */
    private setCachedData(data: GeolocationResponse): void {
        try {
            const now = Date.now();
            const cachedData: CachedGeolocationData = {
                data,
                timestamp: now,
                expiryDate: now + this.CACHE_DURATION
            };
            
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cachedData));
        } catch (error) {

        }
    }
}
