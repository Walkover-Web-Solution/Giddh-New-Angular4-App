import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Angular 21 Compatibility Error Handler
 * Handles specific Angular 21 lifecycle and factory errors while preserving other error handling
 */
@Injectable()
export class Angular21CompatibilityErrorHandler  {
//     handleError(error: any): void {
//         // Check if this is a known Angular 21 compatibility error
//         if (this.isAngular21CompatibilityError(error)) {
//             // Log for debugging but don't throw
//             console.warn('Angular 21 Compatibility Warning (suppressed):', error.message || error);
//             return;
//         }

//         // For all other errors, use default handling
//         console.error('Application Error:', error);
//     }

//     private isAngular21CompatibilityError(error: any): boolean {
//         const errorMessage = error?.message || error?.toString() || '';

//         // Known Angular 21 compatibility error patterns
//         const compatibilityPatterns = [
//             "Cannot read properties of undefined (reading 'onDestroy')",
//             "Cannot read properties of undefined (reading 'factory')",
//             "Cannot read properties of undefined (reading 'controlType')",
//             "_initializeControl",
//             "createEmbeddedViewImpl",
//             "createEmbeddedView",
//             "ngDoCheck",
//             "detectChanges",
//             "ComponentFactoryResolver",
//             "ViewContainerRef"
//         ];

//         return compatibilityPatterns.some(pattern => errorMessage.includes(pattern));
//     }
// }

// /**
//  * Global Angular 21 Compatibility Patches
//  * Apply these patches before Angular application bootstrap
//  */
// export function applyAngular21CompatibilityPatches(): void {
//     // Patch console.error to suppress specific Angular 21 warnings
//     const originalConsoleError = console.error;
//     console.error = function(...args: any[]) {
//         const message = args.join(' ');

//         // Suppress specific Angular 21 compatibility warnings
//         if (message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
//             message.includes("Cannot read properties of undefined (reading 'factory')") ||
//             message.includes("Cannot read properties of undefined (reading 'controlType')") ||
//             message.includes('_initializeControl') ||
//             message.includes('createEmbeddedViewImpl') ||
//             message.includes('createEmbeddedView') ||
//             message.includes('ngDoCheck') ||
//             message.includes('detectChanges') ||
//             message.includes('ComponentFactoryResolver') ||
//             message.includes('ViewContainerRef')) {
//             // Log as warning instead of error
//             console.warn('Angular 21 Compatibility Warning (suppressed):', ...args);
//             return;
//         }

//         // For all other errors, use original console.error
//         originalConsoleError.apply(console, args);
//     };

//     // Patch window.onerror for unhandled lifecycle and factory errors
//     const originalOnError = window.onerror;
//     window.onerror = function(message, source, lineno, colno, error) {
//         const errorMessage = message?.toString() || '';

//         // Handle Angular 21 compatibility errors
//         if (errorMessage.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
//             errorMessage.includes("Cannot read properties of undefined (reading 'factory')") ||
//             errorMessage.includes("Cannot read properties of undefined (reading 'controlType')") ||
//             errorMessage.includes('_initializeControl') ||
//             errorMessage.includes('createEmbeddedViewImpl') ||
//             errorMessage.includes('createEmbeddedView') ||
//             errorMessage.includes('ComponentFactoryResolver') ||
//             errorMessage.includes('ViewContainerRef')) {
//             console.warn('Angular 21 Compatibility Warning (global handler):', message);
//             return true; // Prevent default error handling
//         }

//         // For other errors, use original handler if it exists
//         if (originalOnError) {
//             return originalOnError(message, source, lineno, colno, error);
//         }

//         return false;
//     };

//     // Patch unhandled promise rejections for lifecycle and factory errors
//     const originalUnhandledRejection = window.onunhandledrejection;
//     window.onunhandledrejection = function(event) {
//         const reason = event.reason?.message || event.reason?.toString() || '';

//         // Handle Angular 21 compatibility promise rejections
//         if (reason.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
//             reason.includes("Cannot read properties of undefined (reading 'factory')") ||
//             reason.includes("Cannot read properties of undefined (reading 'controlType')") ||
//             reason.includes('_initializeControl') ||
//             reason.includes('createEmbeddedViewImpl') ||
//             reason.includes('createEmbeddedView') ||
//             reason.includes('ComponentFactoryResolver') ||
//             reason.includes('ViewContainerRef')) {
//             console.warn('Angular 21 Compatibility Warning (promise rejection):', reason);
//             event.preventDefault(); // Prevent unhandled rejection
//             return;
//         }

//         // For other rejections, use original handler if it exists
//         if (originalUnhandledRejection) {
//             return originalUnhandledRejection.call(this, event);
//         }
//     };

//     // Additional runtime patches for Angular 21 compatibility
//     patchAngularInternals();

//     console.log('Angular 21 Compatibility Patches Applied Successfully');
// }

// /**
//  * Patch Angular internal methods that cause factory and onDestroy errors
//  */
// function patchAngularInternals(): void {
//     // Patch Object.defineProperty to handle undefined factory access
//     const originalDefineProperty = Object.defineProperty;
//     Object.defineProperty = function(obj: any, prop: string | symbol, descriptor: PropertyDescriptor) {
//         try {
//             return originalDefineProperty.call(this, obj, prop, descriptor);
//         } catch (error: any) {
//             if (error.message && (
//                 error.message.includes("Cannot read properties of undefined (reading 'factory')") ||
//                 error.message.includes("Cannot read properties of undefined (reading 'onDestroy')")
//             )) {
//                 console.warn('Angular 21 Compatibility: Patched defineProperty error', error.message);
//                 return obj;
//             }
//             throw error;
//         }
//     };

//     // Patch setTimeout to catch async factory/onDestroy errors
//     const originalSetTimeout = window.setTimeout;
//     (window as any).setTimeout = function(callback: TimerHandler, delay?: number, ...args: any[]): number {
//         const wrappedCallback = function() {
//             try {
//                 if (typeof callback === 'function') {
//                     return callback.apply(this, args);
//                 } else if (typeof callback === 'string') {
//                     return eval(callback);
//                 }
//             } catch (error: any) {
//                 if (error.message && (
//                     error.message.includes("Cannot read properties of undefined (reading 'factory')") ||
//                     error.message.includes("Cannot read properties of undefined (reading 'onDestroy')")
//                 )) {
//                     console.warn('Angular 21 Compatibility: Suppressed async error', error.message);
//                     return;
//                 }
//                 throw error;
//             }
//         };
//         return originalSetTimeout.call(this, wrappedCallback as TimerHandler, delay);
//     };
// }

// /**
//  * Enhanced Component Lifecycle Mixin
//  * Provides safe lifecycle management for Angular 21
//  */
// export class Angular21LifecycleMixin {
//     private isDestroyed = false;

//     /**
//      * Safe ngOnDestroy implementation
//      */
//     protected safeDestroy(callback?: () => void): void {
//         if (this.isDestroyed) {
//             return;
//         }

//         this.isDestroyed = true;

//         try {
//             if (callback) {
//                 callback();
//             }
//         } catch (error) {
//             console.warn('Angular 21 Compatibility: Error during component destruction:', error);
//         }
//     }

//     /**
//      * Check if component is destroyed
//      */
//     protected get destroyed(): boolean {
//         return this.isDestroyed;
//     }
}
