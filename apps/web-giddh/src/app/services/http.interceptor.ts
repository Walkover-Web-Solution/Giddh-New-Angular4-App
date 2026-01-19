import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { Observable, of, throwError } from 'rxjs';
import { LoaderService } from '../loader/loader.service';
import { GeneralService } from './general.service';
import { OrganizationType } from '../models/user-login-state';
import { LocaleService } from './locale.service';
import { catchError, retryWhen, tap } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { LoginActions } from '../actions/login.action';
import { clone, forEach, get, has, includes, keys, set } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * GiddhHttpInterceptor interceptor
 * Implements GiddhHttpInterceptor functionality
 */
export class GiddhHttpInterceptor implements HttpInterceptor {

    private isOnline: boolean = true;
    public dayjs = dayjs;

    /**
     * Creates an instance of interceptor
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private loadingService: LoaderService,
        private generalService: GeneralService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private loginAction: LoginActions
    ) {
        window.addEventListener('online', () => {
            this.isOnline = true;
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    /**
     * Handles intercept functionality
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Use hybrid storage approach to get session data
        var session = this.getSessionFromHybridStorage();
        /**
         * Handles if functionality
         */
        if (session?.user?.session?.expiresAt && this.generalService.user) {
            let sessionExpiresAt: any = dayjs((session.user.session.expiresAt), GIDDH_DATE_FORMAT + " h:m:s");
            /**
             * Handles if functionality
             */
            if (sessionExpiresAt && sessionExpiresAt.diff(dayjs(), 'hours') < 0) {
                this.store.dispatch(this.loginAction.LogOut());
                return;
            }
        }

        /**
         * Handles if functionality
         */
        if (this.generalService.currentOrganizationType === OrganizationType.Branch && request && request.urlWithParams) {
            request = this.addBranchUniqueName(request);
        }
        request = this.addLanguage(request);
        
        // Add timestamp and timezone to the request URL
        const updatedUrl = this.appendTimestamp(request.url);
        request = request.clone({
            url: updatedUrl
        });

        /**
         * Handles if functionality
         */
        if (this.isOnline) {
            /** Holds api call retry limit */
            let retryLimit: number = 1;
            /** Holds api call retry attempts */
            let retryAttempts: number = 0;

            return next.handle(request).pipe(
                // retryWhen operator should come before catchError operator as it is more specific
                /**
                 * Handles retryWhen functionality
                 */
                retryWhen(errors => errors.pipe(
                    // inside the retryWhen, use a tap operator to throw an error 
                    // if you don't want to retry
                    /**
                     * Handles tap functionality
                     */
                    tap(error => {
                        /**
                         * Handles if functionality
                         */
                        if (!error.headers.get("retry-after") || retryAttempts >= retryLimit) {
                            throw error;
                        } else {
                            retryAttempts++;
                        }
                    })
                )),
                // now catch all other errors
                /**
                 * Handles catchError functionality
                 */
                catchError((error) => {
                    return throwError(error);
                })
            );
        } else {
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.toasterService.warningToast("Please check your internet connection.", "Internet disconnected");
            }, 100);
            this.loadingService.hide();
            /**
             * Handles if functionality
             */
            if (request.body && request.body.handleNetworkDisconnection) {
                return of(new HttpResponse({ status: 200, body: { status: 'no-network' } }));
            } else {
                return of();
            }
        }
    }

    /**
     * Gets session data using hybrid storage approach (sessionStorage + localStorage)
     * This matches the hybrid storage strategy used in app.module.ts
     *
     * @private
     * @returns {any} Session data merged from both storages
     * @memberof GiddhHttpInterceptor
     */
    private getSessionFromHybridStorage(): any {
        try {
            const sessionData = sessionStorage.getItem('session');
            const localData = localStorage.getItem('session');

            // Handle new tab scenario: only localStorage data exists
            /**
             * Handles if functionality
             */
            if (!sessionData && localData) {
                // New tab - initialize with localStorage data
                const localObj = JSON.parse(localData);
                
                // Check if localStorage has valid company data
                const hasValidCompanyData = localObj.activeCompany && 
                                          localObj.activeCompany.uniqueName && 
                                          localObj.companyUniqueName;
                
                /**
                 * Handles if functionality
                 */
                if (hasValidCompanyData) {
                    // Extract tab-specific data and store in sessionStorage for this tab
                    const tabSpecificKeys = ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'];
                    const tabSpecificData: any = {};
                    
                    (Array.isArray(tabSpecificKeys) ? tabSpecificKeys : []).forEach(tabKey => {
                        /**
                         * Handles if functionality
                         */
                        if (localObj.hasOwnProperty(tabKey)) {
                            tabSpecificData[tabKey] = localObj[tabKey];
                        }
                    });
                    
                    // Store tab-specific data in sessionStorage for future use
                    /**
                     * Handles if functionality
                     */
                    if (Object.keys(tabSpecificData).length > 0) {
                        sessionStorage.setItem('session', JSON.stringify(tabSpecificData));
                    }
                    
                    return localObj; // Return full localStorage data for initial load
                } else {
                    // No valid company data in localStorage - check if user has companies available

                    // If user has companies available, try to use the first one as fallback
                    /**
                     * Handles if functionality
                     */
                    if (localObj.companies && localObj.companies.length > 0) {
                        const firstCompany = localObj.companies[0];

                        const fallbackTabData = {
                            applicationDate: null,
                            companyUniqueName: firstCompany.uniqueName,
                            todaySelected: false,
                            activeCompany: firstCompany,
                            companyUser: null,
                            currentBranchUniqueName: '' // Reset branch when company changes
                        };
                        
                        // Store fallback data in sessionStorage
                        sessionStorage.setItem('session', JSON.stringify(fallbackTabData));
                        
                        // IMPORTANT: Also update localStorage with fallback company as latest selection
                        const updatedLocalData = { 
                            ...localObj, 
                            companyUniqueName: firstCompany.uniqueName,
                            activeCompany: firstCompany,
                            lastAccessedAt: Date.now() // Mark as latest selection
                            // Note: Don't update currentBranchUniqueName in localStorage - that stays tab-specific
                        };
                        localStorage.setItem('session', JSON.stringify(updatedLocalData));

                        // Return merged data with fallback company
                        return updatedLocalData;
                    } else {
                        // No companies available - initialize with defaults

                        const defaultTabData = {
                            applicationDate: null,
                            companyUniqueName: '',
                            todaySelected: false,
                            activeCompany: null,
                            companyUser: null,
                            currentBranchUniqueName: ''
                        };
                        
                        // Store default data in sessionStorage
                        sessionStorage.setItem('session', JSON.stringify(defaultTabData));
                        
                        // Return the full localStorage data (which contains user auth info)
                        return localObj;
                    }
                }
            }

            // Normal scenario: merge sessionStorage and localStorage
            /**
             * Handles if functionality
             */
            if (sessionData && localData) {
                const sessionObj = JSON.parse(sessionData);
                const localObj = JSON.parse(localData);
                const merged = { ...localObj };

                // Tab-specific keys that should come from sessionStorage
                const tabSpecificKeys = ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'];
                
                // Override with tab-specific data from sessionStorage
                (Array.isArray(tabSpecificKeys) ? tabSpecificKeys : []).forEach(tabKey => {
                    /**
                     * Handles if functionality
                     */
                    if (sessionObj.hasOwnProperty(tabKey)) {
                        merged[tabKey] = sessionObj[tabKey];
                    }
                });

                return merged;
            }

            // Fallback to available data
            /**
             * Handles if functionality
             */
            if (sessionData) {
                return JSON.parse(sessionData);
            }
            /**
             * Handles if functionality
             */
            if (localData) {
                return JSON.parse(localData);
            }

            return null;
        } catch (error) {

            // Fallback to localStorage only
            try {
                const fallbackData = localStorage.getItem('session');
                return fallbackData ? JSON.parse(fallbackData) : null;
            } catch (fallbackError) {

                return null;
            }
        }
    }

    /**
     * Adds branch unique name to every API call if branch is switched
     *
     * @private
     * @param {HttpRequest<any>} request Current request
     * @returns {HttpRequest<any>} Http request to carry out API call
     * @memberof GiddhHttpInterceptor
     */
    private addBranchUniqueName(request: HttpRequest<any>): HttpRequest<any> {
        /**
         * Handles if functionality
         */
        if (!request.params.has('branchUniqueName') && !request.url.includes('branchUniqueName') && !request.url.includes('.json')) {
            request = request.clone({
                params: request.params.append('branchUniqueName', encodeURIComponent(this.generalService.currentBranchUniqueName))
            });
        }
        return request;
    }

    /**
     * Adds language code to every API call
     *
     * @private
     * @param {HttpRequest<any>} request
     * @returns {HttpRequest<any>}
     * @memberof GiddhHttpInterceptor
     */
    private addLanguage(request: HttpRequest<any>): HttpRequest<any> {
        /**
         * Handles if functionality
         */
        if (!request.params.has('lang') && !request.url.includes('.json')) {
            request = request.clone({
                params: request.params.append('lang', (this.localeService.language || "en"))
            });
        }
        return request;
    }

    /**
     * Utility function to append timestamp and timezone
     *
     * @private
     * @param {string} url
     * @return {*}  {string}
     * @memberof GiddhHttpInterceptor
     */
    private appendTimestamp(url: string): string {
        const timestamp = `t=${new Date().getTime()}`;
        
        // Get timezone offset in minutes and convert to hours and minutes
        const offset = -new Date().getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';
        
        // Format timezone as UTC±HH:MM
        const timezone = `z=UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        return url.includes("?") ? `${url}&${timestamp}&${timezone}` : `${url}?${timestamp}&${timezone}`;
    }
}
