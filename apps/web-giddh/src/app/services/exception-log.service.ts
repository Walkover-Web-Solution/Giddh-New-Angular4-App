import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExceptionLogService {
    /**
     * Legacy ExceptionLogService - All error handling functionality has been
     * consolidated into Angular21CompatibilityErrorHandler for better error management.
     *
     * This service is kept for backward compatibility but no longer handles errors directly.
     * All error handling including ChunkLoadError, lifecycle errors, and server logging
     * is now managed by the Angular21CompatibilityErrorHandler.
     */
    constructor() {
        console.log('ExceptionLogService: All error handling consolidated into Angular21CompatibilityErrorHandler');
    }
}
