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

@Injectable()
export class Angular21CompatibilityErrorHandler implements ErrorHandler {
    /** Company unique name for current session */
    private companyUniqueName: string;

    constructor(private injector: Injector) { }

    handleError(error: any): void {
        // Handle ChunkLoadError - reload page for Angular 21 lazy loading issues
        if (error?.name === 'ChunkLoadError' ||
            (error && error.message && error.message.includes('ChunkLoadError')) ||
            (error && error.stack && /Loading chunk .+ failed/.test(error.stack))) {
            // [GIDDH-RELOAD-DIAG] Cause B1: ChunkLoadError caught by Angular ErrorHandler
            const reason = {
                cause: 'B1_CHUNK_LOAD_ERROR_HANDLE_ERROR',
                errorName: error?.name,
                errorMessage: error?.message,
                currentUrl: window.location.href,
                timestamp: new Date().toISOString()
            };
            console.warn('[GIDDH-RELOAD-DIAG]', reason, error);
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

        // Log other errors to server (consolidated from ExceptionLogService)
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
        if (generalService && generalService.user) {
            user = generalService.user;
        }

        this.companyUniqueName = generalService.companyUniqueName;
        const payloadJson = {
            user_agent: navigator.userAgent,
            user: (user) ? `Name: ${user.name} Email: ${user.email} Company Uniquename: ${this.companyUniqueName}` : `Company Uniquename: ${this.companyUniqueName}`,
            page: (router) ? router.url : '',
            error: (request.component) ? `${request.component} ${request.exception}` : request.exception,
            env: environment.production ? 'PROD' : 'TEST'
        };

        const url = `${config.apiUrl}${EXCEPTION_API}`;

        if (!(config.AppUrl || environment.AppUrl).includes('localhost') && !(config.AppUrl || environment.AppUrl).includes('dilpreet.giddh.com')) {
            return http.post(url, payloadJson).pipe(
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
        if (!errorHandlerInstance) {
            try {
                // Try to get the error handler from Angular's injector if available
                const injector = (window as any).ng?.getInjector?.();
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
        if (message.includes('ChunkLoadError') ||
            message.includes('Loading chunk') && message.includes('failed')) {
            // [GIDDH-RELOAD-DIAG] Cause B2: ChunkLoadError detected via console.error patch
            const reason = {
                cause: 'B2_CHUNK_LOAD_ERROR_CONSOLE',
                message,
                currentUrl: window.location.href,
                timestamp: new Date().toISOString()
            };
            originalConsoleError.call(console, '[GIDDH-RELOAD-DIAG]', reason);
            window.location.reload();
            return;
        }

        // Suppress Angular 21 lifecycle errors
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
        if (typeof message === 'string') {
            // Handle ChunkLoadError
            if (message.includes('ChunkLoadError') ||
                (message.includes('Loading chunk') && message.includes('failed'))) {
                // [GIDDH-RELOAD-DIAG] Cause B3: ChunkLoadError detected via window.onerror
                const reason = {
                    cause: 'B3_CHUNK_LOAD_ERROR_WINDOW_ONERROR',
                    message,
                    source,
                    lineno,
                    currentUrl: window.location.href,
                    timestamp: new Date().toISOString()
                };
                console.warn('[GIDDH-RELOAD-DIAG]', reason);
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
                // [GIDDH-RELOAD-DIAG] Cause B4: ChunkLoadError detected via unhandledrejection
                const reason = {
                    cause: 'B4_CHUNK_LOAD_ERROR_UNHANDLED_REJECTION',
                    errorName: event.reason.name,
                    errorMessage: event.reason.message,
                    currentUrl: window.location.href,
                    timestamp: new Date().toISOString()
                };
                console.warn('[GIDDH-RELOAD-DIAG]', reason);
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
