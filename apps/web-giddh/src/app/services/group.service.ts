import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    public getGroupsWithAccounts(payload: any): Observable<any> {
        // Placeholder implementation
        return of({ status: 'success', body: [] });
    }
}
