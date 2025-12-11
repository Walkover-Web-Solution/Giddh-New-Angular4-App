import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    public GetRationAnalysis(date: any, refresh: boolean): Observable<any> {
        // Placeholder implementation
        return of({ status: 'success', body: [] });
    }

    public GetRevenueGraphTypes(): Observable<any> {
        // Placeholder implementation
        return of({ status: 'success', body: [] });
    }
}
