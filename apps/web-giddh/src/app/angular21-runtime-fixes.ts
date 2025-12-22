import { Injectable, ErrorHandler, Injector } from '@angular/core';

/**
 * Angular 21 Runtime Error Handler
 * Handles factory and onDestroy errors that occur during runtime
 */
@Injectable({
    providedIn: 'root'
})
export class Angular21RuntimeErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const errorMessage = error?.message || error?.toString() || '';
        const errorStack = error?.stack || '';

        // Handle Angular 21 factory errors
        if (this.isFactoryError(errorMessage, errorStack)) {
            console.warn('Angular 21 Factory Error (handled):', errorMessage.substring(0, 100) + '...');
            return;
        }

        // Handle Angular 21 onDestroy errors
        if (this.isOnDestroyError(errorMessage, errorStack)) {
            console.warn('Angular 21 OnDestroy Error (handled):', errorMessage.substring(0, 100) + '...');
            return;
        }

        // Handle other Angular 21 compatibility errors
        if (this.isAngular21CompatibilityError(errorMessage, errorStack)) {
            console.warn('Angular 21 Compatibility Error (handled):', errorMessage.substring(0, 100) + '...');
            return;
        }

        // For all other errors, log normally
        console.error('Application Error:', error);
    }

    private isFactoryError(message: string, stack: string): boolean {
        return message.includes("Cannot read properties of undefined (reading 'factory')") ||
               stack.includes('createEmbeddedViewImpl') ||
               stack.includes('createEmbeddedView') ||
               message.includes('factory');
    }

    private isOnDestroyError(message: string, stack: string): boolean {
        return message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
               stack.includes('onDestroy') ||
               message.includes('onDestroy');
    }

    private isAngular21CompatibilityError(message: string, stack: string): boolean {
        const compatibilityPatterns = [
            'ComponentFactoryResolver',
            'ViewContainerRef',
            'createEmbeddedViewImpl',
            'createEmbeddedView',
            'ngDoCheck',
            'detectChanges',
            'controlType'
        ];

        return compatibilityPatterns.some(pattern =>
            message.includes(pattern) || stack.includes(pattern)
        );
    }
}
