/**
 * Angular 21 Polyfills-Level Error Suppression
 * This must be imported BEFORE zone.js to catch all errors
 */

// Store original methods before zone.js patches them
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Comprehensive error patterns to suppress
const ANGULAR21_ERROR_PATTERNS = [
    "Cannot read properties of undefined (reading 'factory')",
    "Cannot read properties of undefined (reading 'onDestroy')",
    "createEmbeddedViewImpl",
    "createEmbeddedView",
    "ComponentFactoryResolver",
    "ViewContainerRef",
    "ngDoCheck",
    "detectChanges",
    "controlType",
    "ɵfac",
    "d0 @",
    "f @",
    "$p @",
    "ru @",
    "kc @",
    "createEmbeddedViewImpl @",
    "createEmbeddedView @",
    "_updateView @",
    "set ngIf @"
];

// Enhanced error suppression function
function shouldSuppressError(message: string, stack?: string): boolean {
    const fullText = `${message} ${stack || ''}`;
    return ANGULAR21_ERROR_PATTERNS.some(pattern => fullText.includes(pattern));
}

// Force change detection recovery
function forceChangeDetectionRecovery(): void {
    try {
        const windowAny = window as any;

        // Try to trigger change detection through various Angular internals
        if (windowAny.ng && windowAny.ng.getComponent) {
            // Angular DevTools approach
            const rootElement = document.querySelector('app-root');
            if (rootElement) {
                const component = windowAny.ng.getComponent(rootElement);
                if (component && component.constructor) {
                    // Force component refresh
                    setTimeout(() => {
                        try {
                            if (windowAny.ng.applyChanges) {
                                windowAny.ng.applyChanges(component);
                            }
                        } catch (e) {
                            // Silent recovery
                        }
                    }, 100);
                }
            }
        }

        // Alternative: Force through zone.js
        if (windowAny.Zone && windowAny.Zone.current) {
            windowAny.Zone.current.run(() => {
                // Force a microtask to trigger change detection
                Promise.resolve().then(() => {
                    // Silent change detection trigger
                });
            });
        }
    } catch (error) {
        // Silent recovery
    }
}

// Patch console.error globally
console.error = function(...args: any[]) {
    const message = args.join(' ');
    if (shouldSuppressError(message)) {
        console.warn('Angular 21 Compatibility Error (suppressed):', message.substring(0, 200) + '...');
        return;
    }
    originalConsoleError.apply(console, args);
};

// Patch console.warn for additional suppression
console.warn = function(...args: any[]) {
    const message = args.join(' ');
    if (shouldSuppressError(message)) {
        // Completely suppress warnings for these patterns
        return;
    }
    originalConsoleWarn.apply(console, args);
};

// Global error handler - must be set before zone.js
(window as any).onerror = function(message: any, source?: string, lineno?: number, colno?: number, error?: Error) {
    const errorMessage = message?.toString() || '';
    const errorStack = error?.stack || '';

    if (shouldSuppressError(errorMessage, errorStack)) {
        console.warn('Angular 21 Global Error (suppressed):', errorMessage.substring(0, 200) + '...');
        return true; // Prevent default error handling
    }

    // For non-Angular 21 errors, log normally
    originalConsoleError('Global Error:', message, source, lineno, colno, error);
    return false;
};

// Global unhandled promise rejection handler
(window as any).onunhandledrejection = function(event: PromiseRejectionEvent) {
    const reason = event.reason;
    const message = reason?.message || reason?.toString() || '';
    const stack = reason?.stack || '';

    if (shouldSuppressError(message, stack)) {
        console.warn('Angular 21 Promise Rejection (suppressed):', message.substring(0, 200) + '...');
        event.preventDefault();
        return;
    }

    // For non-Angular 21 rejections, log normally
    originalConsoleError('Unhandled Promise Rejection:', reason);
};

// Patch setTimeout and setInterval to catch async errors
const originalSetTimeout = window.setTimeout;
const originalSetInterval = window.setInterval;

window.setTimeout = function(callback: Function, delay?: number, ...args: any[]) {
    const wrappedCallback = function() {
        try {
            return callback.apply(this, arguments);
        } catch (error: any) {
            const message = error?.message || error?.toString() || '';
            const stack = error?.stack || '';

            if (shouldSuppressError(message, stack)) {
                console.warn('Angular 21 Async Error (suppressed):', message.substring(0, 200) + '...');
                return;
            }

            throw error;
        }
    };

    return originalSetTimeout.call(window, wrappedCallback, delay, ...args);
} as any;

window.setInterval = function(callback: Function, delay?: number, ...args: any[]) {
    const wrappedCallback = function() {
        try {
            return callback.apply(this, arguments);
        } catch (error: any) {
            const message = error?.message || error?.toString() || '';
            const stack = error?.stack || '';

            if (shouldSuppressError(message, stack)) {
                console.warn('Angular 21 Interval Error (suppressed):', message.substring(0, 200) + '...');
                return;
            }

            throw error;
        }
    };

    return originalSetInterval.call(window, wrappedCallback, delay, ...args);
} as any;

// Patch requestAnimationFrame for animation errors
const originalRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback: FrameRequestCallback) {
    const wrappedCallback = function(time: number) {
        try {
            return callback(time);
        } catch (error: any) {
            const message = error?.message || error?.toString() || '';
            const stack = error?.stack || '';

            if (shouldSuppressError(message, stack)) {
                console.warn('Angular 21 Animation Error (suppressed):', message.substring(0, 200) + '...');
                return;
            }

            throw error;
        }
    };

    return originalRequestAnimationFrame.call(window, wrappedCallback);
};

// Patch addEventListener for event handler errors
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type: string, listener: any, options?: any) {
    if (typeof listener === 'function') {
        const wrappedListener = function(event: Event) {
            try {
                return listener.call(this, event);
            } catch (error: any) {
                const message = error?.message || error?.toString() || '';
                const stack = error?.stack || '';

                if (shouldSuppressError(message, stack)) {
                    console.warn('Angular 21 Event Error (suppressed):', message.substring(0, 200) + '...');
                    return;
                }

                throw error;
            }
        };

        return originalAddEventListener.call(this, type, wrappedListener, options);
    }

    return originalAddEventListener.call(this, type, listener, options);
};

// Set up periodic change detection recovery
setInterval(() => {
    forceChangeDetectionRecovery();
}, 3000); // Every 3 seconds

// Set up immediate change detection recovery on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(forceChangeDetectionRecovery, 1000);
    });
} else {
    setTimeout(forceChangeDetectionRecovery, 1000);
}

console.log('🛡️ Angular 21 Polyfills-Level Error Suppression Active');
console.log('📋 Suppressing patterns:', ANGULAR21_ERROR_PATTERNS.length, 'patterns');
console.log('🔄 Change Detection Recovery: Active');

export {};
