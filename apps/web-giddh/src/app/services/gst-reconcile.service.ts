import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GstReconcileService {

    public getTaxDetails(): Observable<any> {
        // Placeholder implementation
        return of({ status: 'success', body: [] });
    }
}
