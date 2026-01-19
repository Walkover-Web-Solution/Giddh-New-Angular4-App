import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * DataResolver class
 * Implements DataResolver functionality
 */
export class DataResolver  {
    /**
     * Handles resolve functionality
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return of({ res: 'I am data' });
    }
}

/**
 * An array of services to resolve routes with data.
 */
export const APP_RESOLVER_PROVIDERS = [
    DataResolver
];
