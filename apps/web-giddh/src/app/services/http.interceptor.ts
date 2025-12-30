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

@Injectable({
    providedIn: 'root'
})
export class GiddhHttpInterceptor implements HttpInterceptor {

    private isOnline: boolean = true;
    public dayjs = dayjs;

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

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Use hybrid storage approach to get session data
        var session = this.getSessionFromHybridStorage();
        if (session?.user?.session?.expiresAt && this.generalService.user) {
            let sessionExpiresAt: any = dayjs((session.user.session.expiresAt), GIDDH_DATE_FORMAT + " h:m:s");
            if (sessionExpiresAt && sessionExpiresAt.diff(dayjs(), 'hours') < 0) {
                this.store.dispatch(this.loginAction.LogOut());
                return;
            }
        }

        if (this.generalService.currentOrganizationType === OrganizationType.Branch && request && request.urlWithParams) {
            request = this.addBranchUniqueName(request);
        }
        request = this.addLanguage(request);
        
        // Add timestamp and timezone to the request URL
        const updatedUrl = this.appendTimestamp(request.url);
        request = request.clone({
            url: updatedUrl
        });

        if (this.isOnline) {
            /** Holds api call retry limit */
            let retryLimit: number = 1;
            /** Holds api call retry attempts */
            let retryAttempts: number = 0;

            return next.handle(request).pipe(
                // retryWhen operator should come before catchError operator as it is more specific
                retryWhen(errors => errors.pipe(
                    // inside the retryWhen, use a tap operator to throw an error 
                    // if you don't want to retry
                    tap(error => {
                        if (!error.headers.get("retry-after") || retryAttempts >= retryLimit) {
                            throw error;
                        } else {
                            retryAttempts++;
                        }
                    })
                )),
                // now catch all other errors
                catchError((error) => {
                    return throwError(error);
                })
            );
        } else {
            setTimeout(() => {
                this.toasterService.warningToast("Please check your internet connection.", "Internet disconnected");
            }, 100);
            this.loadingService.hide();
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
            if (!sessionData && localData) {
                // New tab - initialize with localStorage data
                const localObj = JSON.parse(localData);
                
                // Check if localStorage has valid company data
                const hasValidCompanyData = localObj.activeCompany && 
                                          localObj.activeCompany.uniqueName && 
                                          localObj.companyUniqueName;
                
                if (hasValidCompanyData) {
                    // Extract tab-specific data and store in sessionStorage for this tab
                    const tabSpecificKeys = ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'];
                    const tabSpecificData: any = {};
                    
                    (Array.isArray(tabSpecificKeys) ? tabSpecificKeys : []).forEach(tabKey => {
                        if (localObj.hasOwnProperty(tabKey)) {
                            tabSpecificData[tabKey] = localObj[tabKey];
                        }
                    });
                    
                    // Store tab-specific data in sessionStorage for future use
                    if (Object.keys(tabSpecificData).length > 0) {
                        sessionStorage.setItem('session', JSON.stringify(tabSpecificData));
                    }
                    
                    return localObj; // Return full localStorage data for initial load
                } else {
                    // No valid company data in localStorage - check if user has companies available
                    console.warn('HTTP Interceptor: No valid company data found in localStorage for new tab.');
                    
                    // If user has companies available, try to use the first one as fallback
                    if (localObj.companies && localObj.companies.length > 0) {
                        const firstCompany = localObj.companies[0];
                        console.log('HTTP Interceptor: Using first available company as fallback:', firstCompany.name);
                        
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
                        console.log('HTTP Interceptor: Updated localStorage with fallback company:', firstCompany.uniqueName);
                        
                        // Return merged data with fallback company
                        return updatedLocalData;
                    } else {
                        // No companies available - initialize with defaults
                        console.warn('HTTP Interceptor: No companies available for fallback.');
                        
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
            if (sessionData && localData) {
                const sessionObj = JSON.parse(sessionData);
                const localObj = JSON.parse(localData);
                const merged = { ...localObj };

                // Tab-specific keys that should come from sessionStorage
                const tabSpecificKeys = ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'];
                
                // Override with tab-specific data from sessionStorage
                (Array.isArray(tabSpecificKeys) ? tabSpecificKeys : []).forEach(tabKey => {
                    if (sessionObj.hasOwnProperty(tabKey)) {
                        merged[tabKey] = sessionObj[tabKey];
                    }
                });

                return merged;
            }

            // Fallback to available data
            if (sessionData) {
                return JSON.parse(sessionData);
            }
            if (localData) {
                return JSON.parse(localData);
            }

            return null;
        } catch (error) {
            console.warn('Error reading session from hybrid storage:', error);
            // Fallback to localStorage only
            try {
                const fallbackData = localStorage.getItem('session');
                return fallbackData ? JSON.parse(fallbackData) : null;
            } catch (fallbackError) {
                console.warn('Error reading fallback session data:', fallbackError);
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
