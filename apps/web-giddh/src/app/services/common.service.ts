import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    constructor() {}

    // Placeholder methods for common operations
    getCommonData(): Observable<any> {
        return of({ status: 'success' });
    }

    processData(data: any): Observable<any> {
        return of({ status: 'success', data });
    }

    getOnboardingForm(payload: any): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    GetPartyType(): Observable<any> {
        return of({ status: 'success', body: [] });
    }

    GetCountry(payload: any): Observable<any> {
        return of({ status: 'success', body: [] });
    }

    GetCallingCodes(): Observable<any> {
        return of({ status: 'success', body: [] });
    }
}
