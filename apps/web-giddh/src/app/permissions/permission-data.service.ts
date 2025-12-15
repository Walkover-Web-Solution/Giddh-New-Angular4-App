import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PermissionDataService {
    constructor() {}

    getPermissions(): Observable<any[]> {
        return of([]);
    }

    hasPermission(permission: string): boolean {
        return true; // Default allow all permissions
    }

    checkUserPermissions(userId: string): Observable<any> {
        return of({ hasAccess: true });
    }

    updatePermissions(permissions: any[]): Observable<any> {
        return of({ success: true });
    }
}
