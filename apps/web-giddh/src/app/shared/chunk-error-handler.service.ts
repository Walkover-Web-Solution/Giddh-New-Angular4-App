import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Service to handle chunk loading errors and implement retry mechanisms
 * 
 * @export
 * @class ChunkErrorHandlerService
 */
@Injectable({
    providedIn: 'root'
})
export class ChunkErrorHandlerService {

    /** Maximum number of retry attempts */
    private readonly MAX_RETRIES = 3;
    
    /** Retry attempts counter */
    private retryAttempts = new Map<string, number>();

    constructor(private router: Router) {
        this.setupGlobalErrorHandler();
    }

    /**
     * Sets up global error handler for chunk loading errors
     * 
     * @private
     * @memberof ChunkErrorHandlerService
     */
    private setupGlobalErrorHandler(): void {
        window.addEventListener('error', (event) => {
            if (this.isChunkLoadError(event)) {
                this.handleChunkError(event);
            }
        });

        // Handle unhandled promise rejections (for dynamic imports)
        window.addEventListener('unhandledrejection', (event) => {
            if (this.isChunkLoadError(event)) {
                this.handleChunkError(event);
            }
        });
    }

    /**
     * Checks if the error is a chunk loading error
     * 
     * @private
     * @param {ErrorEvent | PromiseRejectionEvent} event - The error event
     * @returns {boolean} True if it's a chunk loading error
     * @memberof ChunkErrorHandlerService
     */
    private isChunkLoadError(event: ErrorEvent | PromiseRejectionEvent): boolean {
        const errorMessage = this.getErrorMessage(event);
        return errorMessage.includes('Loading chunk') || 
               errorMessage.includes('ChunkLoadError') ||
               errorMessage.includes('Loading CSS chunk') ||
               errorMessage.includes('Loading failed for the <script>');
    }

    /**
     * Extracts error message from different event types
     * 
     * @private
     * @param {ErrorEvent | PromiseRejectionEvent} event - The error event
     * @returns {string} The error message
     * @memberof ChunkErrorHandlerService
     */
    private getErrorMessage(event: ErrorEvent | PromiseRejectionEvent): string {
        if (event instanceof ErrorEvent) {
            return event.message || event.error?.message || '';
        }
        
        if ('reason' in event) {
            return event.reason?.message || event.reason?.toString() || '';
        }
        
        return '';
    }

    /**
     * Handles chunk loading errors with retry mechanism
     * 
     * @private
     * @param {ErrorEvent | PromiseRejectionEvent} event - The error event
     * @memberof ChunkErrorHandlerService
     */
    private handleChunkError(event: ErrorEvent | PromiseRejectionEvent): void {
        const currentUrl = window.location.pathname;
        const retryKey = `${currentUrl}_chunk_error`;
        const currentRetries = this.retryAttempts.get(retryKey) || 0;

        console.warn(`Chunk loading error detected for ${currentUrl}. Retry attempt: ${currentRetries + 1}`);

        if (currentRetries < this.MAX_RETRIES) {
            // Increment retry counter
            this.retryAttempts.set(retryKey, currentRetries + 1);
            
            // Prevent default error handling
            event.preventDefault();
            
            // Implement retry with exponential backoff
            const retryDelay = Math.pow(2, currentRetries) * 1000; // 1s, 2s, 4s
            
            setTimeout(() => {
                this.retryChunkLoading(currentUrl);
            }, retryDelay);
        } else {
            // Max retries reached, show user-friendly error
            this.showChunkErrorMessage();
            // Reset retry counter
            this.retryAttempts.delete(retryKey);
        }
    }

    /**
     * Retries chunk loading by reloading the current route
     * 
     * @private
     * @param {string} currentUrl - The current URL path
     * @memberof ChunkErrorHandlerService
     */
    private retryChunkLoading(currentUrl: string): void {
        // Clear browser cache for the current session
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        // Navigate to home and then back to trigger fresh chunk loading
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }

    /**
     * Shows user-friendly error message when max retries are reached
     * 
     * @private
     * @memberof ChunkErrorHandlerService
     */
    private showChunkErrorMessage(): void {
        const message = `
            Unable to load the requested page due to a network issue. 
            Please try:
            1. Refreshing the page (Ctrl+F5 or Cmd+Shift+R)
            2. Clearing your browser cache
            3. Checking your internet connection
            
            If the problem persists, please contact support.
        `;

        // Show native alert as fallback
        alert(message);
        
        // Optionally redirect to home page
        this.router.navigate(['/']);
    }

    /**
     * Manually clears retry attempts for a specific route
     * 
     * @param {string} route - The route to clear retries for
     * @memberof ChunkErrorHandlerService
     */
    public clearRetryAttempts(route: string): void {
        const retryKey = `${route}_chunk_error`;
        this.retryAttempts.delete(retryKey);
    }

    /**
     * Preloads critical chunks to prevent loading errors
     * 
     * @memberof ChunkErrorHandlerService
     */
    public preloadCriticalChunks(): void {
        const criticalRoutes = [
            'new-vs-old-invoices',
            'ledger',
            'vouchers',
            'reports',
            'contact'
        ];

        criticalRoutes.forEach(route => {
            // Dynamically import modules to preload them
            this.preloadModule(route);
        });
    }

    /**
     * Preloads a specific module
     * 
     * @private
     * @param {string} route - The route module to preload
     * @memberof ChunkErrorHandlerService
     */
    private preloadModule(route: string): void {
        try {
            switch (route) {
                case 'new-vs-old-invoices':
                    import('../new-vs-old-Invoices/new-vs-old-Invoices.module').catch(err => {
                        console.warn(`Failed to preload ${route} module:`, err);
                    });
                    break;
                case 'ledger':
                    import('../ledger/ledger.module').catch(err => {
                        console.warn(`Failed to preload ${route} module:`, err);
                    });
                    break;
                case 'vouchers':
                    import('../vouchers/vouchers.module').catch(err => {
                        console.warn(`Failed to preload ${route} module:`, err);
                    });
                    break;
                case 'reports':
                    import('../reports/reports.module').catch(err => {
                        console.warn(`Failed to preload ${route} module:`, err);
                    });
                    break;
                case 'contact':
                    import('../contact/contact.module').catch(err => {
                        console.warn(`Failed to preload ${route} module:`, err);
                    });
                    break;
            }
        } catch (error) {
            console.warn(`Error preloading ${route} module:`, error);
        }
    }
}
