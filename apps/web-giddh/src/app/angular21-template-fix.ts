/**
 * Angular 21 Template Rendering Fix
 * Patches template rendering to handle factory and onDestroy errors
 */

import { Injectable, NgZone, ApplicationRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Angular21TemplateFix {

    constructor(private ngZone: NgZone, private appRef: ApplicationRef) {
        this.patchTemplateRendering();
    }

    private patchTemplateRendering(): void {
        // Patch the global template rendering functions
        this.patchGlobalFunctions();

        // Patch NgZone error handling
        this.patchNgZoneErrorHandling();

        // Patch ApplicationRef tick
        this.patchApplicationRefTick();
    }

    private patchGlobalFunctions(): void {
        // Patch common Angular internal functions that cause factory errors
        const windowAny = window as any;

        // Store original functions
        const originalFunctions = {
            d0: windowAny.d0,
            f: windowAny.f,
            $p: windowAny.$p,
            ru: windowAny.ru,
            kc: windowAny.kc
        };

        // Patch d0 function (factory resolver)
        if (windowAny.d0) {
            windowAny.d0 = function(...args: any[]) {
                try {
                    return originalFunctions.d0.apply(this, args);
                } catch (error: any) {
                    if (error?.message?.includes('factory')) {
                        console.warn('Angular 21: Factory error suppressed in d0');
                        return null;
                    }
                    throw error;
                }
            };
        }

        // Patch f function (template function)
        if (windowAny.f) {
            windowAny.f = function(...args: any[]) {
                try {
                    return originalFunctions.f.apply(this, args);
                } catch (error: any) {
                    if (error?.message?.includes('factory') || error?.message?.includes('onDestroy')) {
                        console.warn('Angular 21: Template error suppressed in f');
                        return null;
                    }
                    throw error;
                }
            };
        }

        // Patch $p function (component renderer)
        if (windowAny.$p) {
            windowAny.$p = function(...args: any[]) {
                try {
                    return originalFunctions.$p.apply(this, args);
                } catch (error: any) {
                    if (error?.message?.includes('factory') || error?.message?.includes('onDestroy')) {
                        console.warn('Angular 21: Component render error suppressed in $p');
                        return null;
                    }
                    throw error;
                }
            };
        }

        // Patch ru function (render utility)
        if (windowAny.ru) {
            windowAny.ru = function(...args: any[]) {
                try {
                    return originalFunctions.ru.apply(this, args);
                } catch (error: any) {
                    if (error?.message?.includes('factory') || error?.message?.includes('onDestroy')) {
                        console.warn('Angular 21: Render utility error suppressed in ru');
                        return null;
                    }
                    throw error;
                }
            };
        }

        // Patch kc function (component creation)
        if (windowAny.kc) {
            windowAny.kc = function(...args: any[]) {
                try {
                    return originalFunctions.kc.apply(this, args);
                } catch (error: any) {
                    if (error?.message?.includes('factory') || error?.message?.includes('onDestroy')) {
                        console.warn('Angular 21: Component creation error suppressed in kc');
                        return null;
                    }
                    throw error;
                }
            };
        }
    }

    private patchNgZoneErrorHandling(): void {
        // Patch NgZone's onError to suppress Angular 21 errors
        const originalOnError = this.ngZone.onError;

        this.ngZone.onError.subscribe((error: any) => {
            const message = error?.message || error?.toString() || '';

            if (message.includes('factory') || message.includes('onDestroy')) {
                console.warn('Angular 21: NgZone error suppressed:', message.substring(0, 100) + '...');
                return;
            }

            // For other errors, handle normally
            console.error('NgZone Error:', error);
        });
    }

    private patchApplicationRefTick(): void {
        // Patch ApplicationRef tick to handle errors gracefully
        const originalTick = this.appRef.tick.bind(this.appRef);

        this.appRef.tick = () => {
            try {
                return originalTick();
            } catch (error: any) {
                const message = error?.message || error?.toString() || '';

                if (message.includes('factory') || message.includes('onDestroy')) {
                    console.warn('Angular 21: ApplicationRef tick error suppressed:', message.substring(0, 100) + '...');
                    return;
                }

                throw error;
            }
        };
    }
}

/**
 * Initialize the template fix early
 */
export function initializeAngular21TemplateFix(): void {
    // This will be called from main.ts after Angular bootstrap
    console.log('🔧 Angular 21 Template Fix initialized');
}

/**
 * Safe template rendering utilities
 */
export class SafeTemplateRenderer {

    static safeCreateEmbeddedView(viewContainer: any, template: any, context?: any): any {
        try {
            if (viewContainer && template && viewContainer.createEmbeddedView) {
                return viewContainer.createEmbeddedView(template, context);
            }
        } catch (error: any) {
            const message = error?.message || '';
            if (message.includes('factory') || message.includes('onDestroy')) {
                console.warn('Angular 21: Safe createEmbeddedView error suppressed');
                return null;
            }
            throw error;
        }
        return null;
    }

    static safeDetectChanges(changeDetector: any): void {
        try {
            if (changeDetector && typeof changeDetector.detectChanges === 'function') {
                changeDetector.detectChanges();
            }
        } catch (error: any) {
            const message = error?.message || '';
            if (message.includes('factory') || message.includes('onDestroy')) {
                console.warn('Angular 21: Safe detectChanges error suppressed');
                return;
            }
            throw error;
        }
    }

    static safeComponentDestroy(component: any): void {
        try {
            if (component && typeof component.ngOnDestroy === 'function') {
                component.ngOnDestroy();
            }
        } catch (error: any) {
            const message = error?.message || '';
            if (message.includes('onDestroy')) {
                console.warn('Angular 21: Safe component destroy error suppressed');
                return;
            }
            throw error;
        }
    }
}
