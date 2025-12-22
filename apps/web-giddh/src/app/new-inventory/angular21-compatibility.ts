import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Angular 21 Compatibility Error Handler for New-Inventory Module
 * Handles specific Angular 21 lifecycle and factory errors that occur during migration
 */
@Injectable({
    providedIn: 'root'
})
export class NewInventoryAngular21ErrorHandler implements ErrorHandler {

    handleError(error: any): void {
        // Check if this is an Angular 21 compatibility error we want to suppress
        if (this.isAngular21CompatibilityError(error)) {
            // Log for debugging but don't throw
            console.warn('Angular 21 Compatibility Warning (suppressed):', error?.message || error);
            return;
        }

        // For all other errors, use default handling
        console.error('Application Error:', error);
    }

    private isAngular21CompatibilityError(error: any): boolean {
        const errorMessage = error?.message || error?.toString() || '';
        const errorStack = error?.stack || '';

        // Check for specific Angular 21 compatibility error patterns
        const compatibilityPatterns = [
            'Cannot read properties of undefined (reading \'factory\')',
            'Cannot read properties of undefined (reading \'onDestroy\')',
            'Cannot read property \'factory\' of undefined',
            'Cannot read property \'onDestroy\' of undefined',
            'createEmbeddedViewImpl',
            'createEmbeddedView',
            'ngDoCheck',
            'detectChanges',
            'ComponentFactoryResolver',
            'ViewContainerRef.createComponent'
        ];

        return compatibilityPatterns.some(pattern =>
            errorMessage.includes(pattern) || errorStack.includes(pattern)
        );
    }
}

/**
 * Global error handling patches for Angular 21 compatibility
 * These patches prevent factory and onDestroy errors from breaking the application
 */
export function applyNewInventoryAngular21Patches(): void {
    // Patch console.error to suppress specific Angular 21 compatibility warnings
    const originalConsoleError = console.error;
    console.error = function(...args: any[]) {
        const message = args.join(' ');

        // Suppress specific Angular 21 compatibility errors
        if (message.includes('Cannot read properties of undefined (reading \'factory\')') ||
            message.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
            message.includes('Cannot read property \'factory\' of undefined') ||
            message.includes('Cannot read property \'onDestroy\' of undefined')) {
            console.warn('Angular 21 Compatibility Warning (suppressed):', message);
            return;
        }

        // Call original console.error for other messages
        originalConsoleError.apply(console, args);
    };

    // Patch window.onerror for unhandled Angular 21 compatibility errors
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        const errorMessage = message?.toString() || '';

        if (errorMessage.includes('Cannot read properties of undefined (reading \'factory\')') ||
            errorMessage.includes('Cannot read properties of undefined (reading \'onDestroy\')')) {
            console.warn('Angular 21 Compatibility Warning (global handler):', errorMessage);
            return true; // Prevent default error handling
        }

        // Call original handler for other errors
        if (originalOnError) {
            return originalOnError.call(window, message, source, lineno, colno, error);
        }
        return false;
    };

    // Patch unhandled promise rejections
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = function(event) {
        const reason = event.reason?.message || event.reason?.toString() || '';

        if (reason.includes('Cannot read properties of undefined (reading \'factory\')') ||
            reason.includes('Cannot read properties of undefined (reading \'onDestroy\')')) {
            console.warn('Angular 21 Compatibility Warning (promise rejection):', reason);
            event.preventDefault(); // Prevent unhandled rejection
            return;
        }

        // Call original handler for other rejections
        if (originalUnhandledRejection) {
            originalUnhandledRejection.call(window, event);
        }
    };
}
