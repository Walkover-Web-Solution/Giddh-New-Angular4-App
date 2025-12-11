import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountryCodeService {
    constructor() {}

    // Placeholder methods for country code operations
    getCountryCodes(): Observable<any> {
        return of([
            { code: 'US', name: 'United States', dialCode: '+1' },
            { code: 'IN', name: 'India', dialCode: '+91' },
            { code: 'GB', name: 'United Kingdom', dialCode: '+44' }
        ]);
    }

    getCountryByCode(code: string): Observable<any> {
        return of({ code, name: 'Country Name', dialCode: '+1' });
    }
}
