import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsTaxesService {

    constructor() { }

    public CreateTax(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public UpdateTax(payload: any, uniqueName?: string): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public DeleteTax(value: any): Observable<any> {
        return of({ status: 'success', body: value });
    }

    public getTaxList(payload: any): Observable<any> {
        return of({ status: 'success', body: [] });
    }
}
