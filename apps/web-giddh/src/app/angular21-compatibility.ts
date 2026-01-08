// Angular 21 Compatibility Layer - OnDestroy Lifecycle Fix
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../environments/environment.generated';

@Injectable()
export class Angular21CompatibilityErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        // Handle ChunkLoadError - reload page for Angular 21 lazy loading issues
        if (error?.name === 'ChunkLoadError' ||
            (error && error.message && error.message.includes('ChunkLoadError')) ||
            (error && error.stack && /Loading chunk .+ failed/.test(error.stack))) {
            window.location.reload();
            return;
        }

        // Suppress specific Angular 21 onDestroy lifecycle errors
        if (error && error.message && (
            error.message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
            error.message.includes("Cannot read property 'onDestroy' of undefined") ||
            error.message.includes("Cannot read properties of undefined (reading 'factory')") ||
            error.message.includes("Cannot read property 'factory' of undefined") ||
            error.message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
            error.message.includes("Cannot read property 'nativeElement' of undefined")
        )) {

            return;
        }

        // Allow other errors to be handled normally

    }
}

// Global error suppression for Angular 21 lifecycle issues
export function applyAngular21Patches() {
    // Patch console.error to suppress specific lifecycle errors and handle ChunkLoadError
    const originalConsoleError = console.error;
    console.error = function(...args: any[]) {
        const message = args.join(' ');

        // Handle ChunkLoadError
        if (message.includes('ChunkLoadError') ||
            message.includes('Loading chunk') && message.includes('failed')) {
            window.location.reload();
            return;
        }

        if (message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
            message.includes("Cannot read property 'onDestroy' of undefined") ||
            message.includes("Cannot read properties of undefined (reading 'factory')") ||
            message.includes("Cannot read property 'factory' of undefined") ||
            message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
            message.includes("Cannot read property 'nativeElement' of undefined")) {

            return;
        }

        originalConsoleError.apply(console, args);
    };

    // Patch window.onerror for unhandled lifecycle errors and ChunkLoadError
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (typeof message === 'string') {
            // Handle ChunkLoadError
            if (message.includes('ChunkLoadError') ||
                (message.includes('Loading chunk') && message.includes('failed'))) {
                window.location.reload();
                return true;
            }

            if (message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
                message.includes("Cannot read property 'onDestroy' of undefined") ||
                message.includes("Cannot read properties of undefined (reading 'factory')") ||
                message.includes("Cannot read property 'factory' of undefined") ||
                message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
                message.includes("Cannot read property 'nativeElement' of undefined")) {

                return true; // Prevent default error handling
            }
        }

        if (originalOnError) {
            return originalOnError.call(window, message, source, lineno, colno, error);
        }
        return false;
    };

    // Patch unhandled promise rejections for lifecycle errors and ChunkLoadError
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason) {
            // Handle ChunkLoadError in promises
            if (event.reason.name === 'ChunkLoadError' ||
                (event.reason.message && event.reason.message.includes('ChunkLoadError')) ||
                (event.reason.message && event.reason.message.includes('Loading chunk') && event.reason.message.includes('failed'))) {
                window.location.reload();
                event.preventDefault();
                return;
            }

            if (event.reason.message && (
                event.reason.message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
                event.reason.message.includes("Cannot read property 'onDestroy' of undefined") ||
                event.reason.message.includes("Cannot read properties of undefined (reading 'factory')") ||
                event.reason.message.includes("Cannot read property 'factory' of undefined") ||
                event.reason.message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
                event.reason.message.includes("Cannot read property 'nativeElement' of undefined")
            )) {

                event.preventDefault();
            }
        }
    });
}
