import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class DataResolver  {
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
