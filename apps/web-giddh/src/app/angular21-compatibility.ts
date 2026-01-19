// Angular 21 Compatibility Layer - Comprehensive Error Handling
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { BaseResponse } from './models/api-models/BaseResponse';
import { EXCEPTION_API } from './services/apiurls/exception-log.api';
import { GiddhErrorHandler } from './services/catchManager/catchmanger';
import { GeneralService } from './services/general.service';
import { HttpWrapperService } from './services/http-wrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './services/service.config';
import { environment } from '../environments/environment.generated';

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * Angular21CompatibilityErrorHandler class
 * Implements Angular21CompatibilityErrorHandler functionality
 */
export class Angular21CompatibilityErrorHandler implements ErrorHandler {
    /** Company unique name for current session */
    private companyUniqueName: string;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private injector: Injector) { }

    /**
     * Handles error event
     */
    handleError(error: any): void {
        // Handle ChunkLoadError - reload page for Angular 21 lazy loading issues
        /**
         * Handles if functionality
         */
        if (error?.name === 'ChunkLoadError' ||
            (error && error.message && error.message.includes('ChunkLoadError')) ||
            (error && error.stack && /Loading chunk .+ failed/.test(error.stack))) {
            window.location.reload();
            return;
        }

        // Suppress specific Angular 21 onDestroy lifecycle errors
        /**
         * Handles if functionality
         */
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

        // Log other errors to server (consolidated from ExceptionLogService)
        /**
         * Handles if functionality
         */
        if (error.stack) {
            this.addUiException({ component: '', exception: error.stack }).pipe(take(1)).subscribe(() => {
                // Error logged successfully
            }, () => {
                // Error logging failed - continue silently
            });
        }

        throw error;
    }

    /**
     * This will Add UI Exception on slack channel #giddh-ui-exception
     * Consolidated from ExceptionLogService
     */
    public addUiException(request: any): Observable<BaseResponse<any, any>> {
        // Need to inject manually as ErrorHandler service is instantiated first and
        // dependency injection is not available at that time
        const generalService = this.injector.get(GeneralService);
        const http = this.injector.get(HttpWrapperService);
        const errorHandler = this.injector.get(GiddhErrorHandler);
        const config: IServiceConfigArgs = this.injector.get(ServiceConfig) as IServiceConfigArgs;
        const router = this.injector.get(Router);
        let user;
        /**
         * Handles if functionality
         */
        if (generalService && generalService.user) {
            user = generalService.user;
        }

        this.companyUniqueName = generalService.companyUniqueName;
        const payloadJson = {
            user_agent: navigator.userAgent,
            /**
             * Handles user functionality
             */
            user: (user) ? `Name: ${user.name} Email: ${user.email} Company Uniquename: ${this.companyUniqueName}` : `Company Uniquename: ${this.companyUniqueName}`,
            /**
             * Handles page functionality
             */
            page: (router) ? router.url : '',
            /**
             * Handles error functionality
             */
            error: (request.component) ? `${request.component} ${request.exception}` : request.exception,
            env: environment.production ? 'PROD' : 'TEST'
        };

        const url = `${config.apiUrl}${EXCEPTION_API}`;

        /**
         * Handles if functionality
         */
        if (!(config.AppUrl || environment.AppUrl).includes('localhost') && !(config.AppUrl || environment.AppUrl).includes('dilpreet.giddh.com')) {
            return http.post(url, payloadJson).pipe(
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => errorHandler.HandleCatch<any, any>(e, request)));
        } else {
            return of();
        }
    }
}

// Global error suppression for Angular 21 lifecycle issues
export function applyAngular21Patches() {
    // Get reference to the error handler for server logging
    let errorHandlerInstance: Angular21CompatibilityErrorHandler | null = null;

    // Function to get error handler instance
    const getErrorHandler = () => {
        /**
         * Handles if functionality
         */
        if (!errorHandlerInstance) {
            try {
                // Try to get the error handler from Angular's injector if available
                const injector = (window as any).ng?.getInjector?.();
                /**
                 * Handles if functionality
                 */
                if (injector) {
                    errorHandlerInstance = injector.get(Angular21CompatibilityErrorHandler);
                }
            } catch (e) {
                // Injector not available, continue without server logging
            }
        }
        return errorHandlerInstance;
    };

    // Patch console.error to suppress specific lifecycle errors and handle ChunkLoadError
    const originalConsoleError = console.error;
    console.error = function(...args: any[]) {
        const message = args.join(' ');

        // Handle ChunkLoadError
        /**
         * Handles if functionality
         */
        if (message.includes('ChunkLoadError') ||
            message.includes('Loading chunk') && message.includes('failed')) {
            window.location.reload();
            return;
        }

        // Suppress Angular 21 lifecycle errors
        /**
         * Handles if functionality
         */
        if (message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
            message.includes("Cannot read property 'onDestroy' of undefined") ||
            message.includes("Cannot read properties of undefined (reading 'factory')") ||
            message.includes("Cannot read property 'factory' of undefined") ||
            message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
            message.includes("Cannot read property 'nativeElement' of undefined")) {
            return;
        }

        // Log other errors to server if error handler is available
        const errorHandler = getErrorHandler();
        /**
         * Handles if functionality
         */
        if (errorHandler && args.length > 0 && typeof args[0] === 'string') {
            try {
                errorHandler.addUiException({ component: 'console.error', exception: message }).subscribe();
            } catch (e) {
                // Server logging failed, continue with console error
            }
        }

        originalConsoleError.apply(console, args);
    };

    // Patch window.onerror for unhandled lifecycle errors and ChunkLoadError
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        /**
         * Handles if functionality
         */
        if (typeof message === 'string') {
            // Handle ChunkLoadError
            /**
             * Handles if functionality
             */
            if (message.includes('ChunkLoadError') ||
                (message.includes('Loading chunk') && message.includes('failed'))) {
                window.location.reload();
                return true;
            }

            /**
             * Handles if functionality
             */
            if (message.includes("Cannot read properties of undefined (reading 'onDestroy')") ||
                message.includes("Cannot read property 'onDestroy' of undefined") ||
                message.includes("Cannot read properties of undefined (reading 'factory')") ||
                message.includes("Cannot read property 'factory' of undefined") ||
                message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
                message.includes("Cannot read property 'nativeElement' of undefined")) {

                return true; // Prevent default error handling
            }
        }

        /**
         * Handles if functionality
         */
        if (originalOnError) {
            return originalOnError.call(window, message, source, lineno, colno, error);
        }
        return false;
    };

    // Patch unhandled promise rejections for lifecycle errors and ChunkLoadError
    window.addEventListener('unhandledrejection', function(event) {
        /**
         * Handles if functionality
         */
        if (event.reason) {
            // Handle ChunkLoadError in promises
            /**
             * Handles if functionality
             */
            if (event.reason.name === 'ChunkLoadError' ||
                (event.reason.message && event.reason.message.includes('ChunkLoadError')) ||
                (event.reason.message && event.reason.message.includes('Loading chunk') && event.reason.message.includes('failed'))) {
                window.location.reload();
                event.preventDefault();
                return;
            }

            /**
             * Handles if functionality
             */
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
