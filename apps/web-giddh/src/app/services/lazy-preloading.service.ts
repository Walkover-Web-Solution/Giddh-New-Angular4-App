import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
    public preloadedModules: string[] = [];

    public preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
            this.preloadedModules.push(route.path);
            return load();
        } else {
            return of(null);
        }
    }
}
