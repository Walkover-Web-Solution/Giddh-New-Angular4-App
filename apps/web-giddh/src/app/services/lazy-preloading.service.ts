import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * CustomPreloadingStrategy service
 * Provides custompreloadingstrategy related business logic and data operations
 */
export class CustomPreloadingStrategy implements PreloadingStrategy {
    public preloadedModules: string[] = [];

    /**
     * Handles preload functionality
     */
    public preload(route: Route, load: () => Observable<any>): Observable<any> {
        /**
         * Handles if functionality
         */
        if (route.data && route.data['preload']) {
            this.preloadedModules.push(route.path);
            return load();
        } else {
            return of(null);
        }
    }
}
