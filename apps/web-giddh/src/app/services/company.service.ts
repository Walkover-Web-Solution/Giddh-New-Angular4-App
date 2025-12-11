import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    constructor() {}

    // Placeholder methods for company operations
    getCompanyDetails(): Observable<any> {
        return of({ status: 'success' });
    }

    updateCompany(data: any): Observable<any> {
        return of({ status: 'success' });
    }

    createCompany(data: any): Observable<any> {
        return of({ status: 'success' });
    }

    deleteCompany(uniqueName: string): Observable<any> {
        return of({ status: 'success' });
    }

    getStateDetails(companyUniqueName: string, fetchLastState?: boolean): Observable<any> {
        return of({ status: 'success', data: [] });
    }

    CompanyList(): Observable<any> {
        return of({ status: 'success', body: [] });
    }

    getAllStates(payload: any): Observable<any> {
        return of({ status: 'success', body: [] });
    }

    getMenuItems(): Observable<any> {
        return of({ status: 'success', body: [] });
    }
}
