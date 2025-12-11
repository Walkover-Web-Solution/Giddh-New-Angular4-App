import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsProfileService {

    constructor() { }

    public GetProfileInfo(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public UpdateProfile(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public GetInventoryInfo(): Observable<any> {
        return of({ status: 'success', body: {} });
    }

    public UpdateInventory(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public PatchProfile(payload: any): Observable<any> {
        return of({ status: 'success', body: payload });
    }

    public getBranchInfo(): Observable<any> {
        return of({ status: 'success', body: {} });
    }
}
