import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { ActionModule } from './actions/action.module';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success';
import { AppComponent } from './app.component';
import { IS_ELECTRON_WA, APP_FOLDER_WA, APP_URL_WA } from './app.constant';
import { Angular21CompatibilityErrorHandler } from './angular21-compatibility';

// Debug: Log all environment variables to verify they're loaded correctly
// console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
// console.log('🌍 Core Environment:');
// console.log('  production:', environment.production);
// console.log('  showDevModule:', environment.showDevModule);
// console.log('  isElectron:', environment.isElectron);
// console.log('');
// console.log('🔗 URLs & Endpoints:');
// console.log('  AppUrl:', environment.AppUrl);
// console.log('  ApiUrl:', environment.ApiUrl);
// console.log('  UkApiUrl:', environment.UkApiUrl);
// console.log('  PORTAL_URL:', environment.PORTAL_URL);
// console.log('  APP_FOLDER:', environment.APP_FOLDER);
// console.log('');
// console.log('🔑 Authentication & Services:');
// console.log('  GOOGLE_CLIENT_ID:', environment.GOOGLE_CLIENT_ID);
// console.log('  GOOGLE_CLIENT_SECRET:', environment.GOOGLE_CLIENT_SECRET ? '***HIDDEN***' : 'NOT SET');
// console.log('  OTP_WIDGET_ID:', environment.OTP_WIDGET_ID);
// console.log('  OTP_TOKEN_AUTH:', environment.OTP_TOKEN_AUTH ? '***HIDDEN***' : 'NOT SET');
// console.log('  RAZORPAY_KEY:', environment.RAZORPAY_KEY);
// console.log('');
// console.log('📊 Environment Object Keys:', Object.keys(environment).filter(key => typeof environment[key] !== 'function'));
// console.log('=== END ENVIRONMENT DEBUG ===');
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { DynamicThemeService } from './shared/services/dynamic-theme.service';
import { WhiteLabelService } from './services/white-label.service';
import { EnvironmentService } from './services/environment.service';
import { DecoratorsModule } from './decorators/decorators.module';
import { ExceptionLogService } from './services/exception-log.service';
import { GiddhHttpInterceptor } from './services/http.interceptor';
import { CustomPreloadingStrategy } from './services/lazy-preloading.service';
import { ServiceModule } from './services/service.module';
import { WindowRef } from './shared/helpers/window.object';
import { reducers } from './store';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { SnackBarModule } from './theme/snackbar/snackbar.module';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MobileRestrictedComponent } from './mobile-restricted/mobile-restricted.component';
import { LoaderModule } from './loader/loader.module';
import { PageModule } from './page/page.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldsModule } from './theme/form-fields/form-fields.module';
import { filter, find, forEach, get, includes, keys, startsWith } from './lodash-optimized';
// import { VerifySubscriptionTransferOwnershipModule } from './verify-subscription-transfer-ownership/verify-subscription-transfer-ownership.module';
// Get white label configuration from localStorage
const whiteLabelString = localStorage.getItem('whiteLabel');
let whiteLabelConfig = whiteLabelString ? JSON.parse(whiteLabelString) : null;

// FetchWhiteLabel returns an async function that fetches white-label data from an API, stores it in localStorage, and caches it in whiteLabelConfig.
export function fetchWhiteLabel(): () => Promise<void> {
    return async () => {
        if (!whiteLabelConfig) {
            try {
                const response = await fetch(`${Configuration.ApiUrl}/white-label`);
                const data = await response.json();
                localStorage.setItem('whiteLabel', JSON.stringify(data));
                whiteLabelConfig = data;
            } catch (error) {
                console.error('Failed to fetch white label data:', error);
            }
        }
    };
}

const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    {
        provide: APP_BASE_HREF,
        useValue: IS_ELECTRON_WA
            ? './'
            : '/'
    }
];

// tslint:disable-next-line:prefer-const
let CONDITIONAL_IMPORTS = [];

/**
 * Hybrid Storage Strategy
 * Uses sessionStorage for tab-specific data and localStorage for persistent data
 */
const createHybridStorage = () => {
    // Configuration for data separation
    const config = {
        // Tab-specific keys (stored in sessionStorage)
        tabSpecific: {
            session: ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'],
            branchConsolidated: ['isBranchConsolidated']
        },
        // Persistent keys (stored in localStorage)
        persistent: {
            session: ['user', 'companies', 'userLoginState', 'currencies', 'currentCompanyCurrency', 'commonLocaleData', 'currentLocale', 'activeTheme'],
            permission: ['roles', 'permissions', 'pages']
        }
    };

    return {
        getItem: (key: string): string | null => {
            try {
                if (!['session', 'permission', 'branchConsolidated'].includes(key)) {
                    return sessionStorage.getItem(key) || localStorage.getItem(key);
                }

                const sessionData = sessionStorage.getItem(key);
                const localData = localStorage.getItem(key);

                if (key === 'session') {
                    // Check for query parameters first - this takes precedence over stored data
                    const urlParams = new URLSearchParams(window.location.search);
                    const queryCompanyUniqueName = urlParams.get('companyUniqueName');
                    const queryBranchUniqueName = urlParams.get('branchUniqueName');

                    if (queryCompanyUniqueName && localData) {
                        const localObj = JSON.parse(localData);

                        // Find the company from available companies
                        const targetCompany = localObj.companies?.find((company: any) =>
                            company.uniqueName === queryCompanyUniqueName
                        );

                        if (targetCompany) {
                            // Debug: Log the company structure to understand how branches are stored
                            console.log('Target company structure:', {
                                name: targetCompany.name,
                                uniqueName: targetCompany.uniqueName,
                                branches: targetCompany.branches,
                                branchCount: targetCompany.branchCount,
                                allKeys: Object.keys(targetCompany)
                            });

                            // Validate that the branch belongs to the specified company
                            let validatedBranchUniqueName = '';
                            if (queryBranchUniqueName) {
                                // Check if the branch exists in the target company's branches
                                const targetBranch = targetCompany.branches?.find((branch: any) =>
                                    branch.uniqueName === queryBranchUniqueName
                                );

                                if (targetBranch) {
                                    validatedBranchUniqueName = queryBranchUniqueName;
                                    console.log('✅ Branch validation successful:', queryBranchUniqueName, 'belongs to company:', queryCompanyUniqueName);
                                } else {
                                    console.warn(`❌ Branch '${queryBranchUniqueName}' does not belong to company '${queryCompanyUniqueName}'.`);
                                    console.log('Available branches:', targetCompany.branches);
                                    console.log('Branch count:', targetCompany.branchCount);
                                }
                            }

                            // Create tab-specific data with validated query params
                            const queryTabData = {
                                applicationDate: null,
                                companyUniqueName: queryCompanyUniqueName,
                                todaySelected: false,
                                activeCompany: targetCompany,
                                companyUser: null, // Will be set by the app when company is selected
                                currentBranchUniqueName: validatedBranchUniqueName
                            };

                            // Debug logging to check query params
                            console.log('Query params detected:', {
                                companyUniqueName: queryCompanyUniqueName,
                                branchUniqueName: queryBranchUniqueName,
                                targetCompany: targetCompany,
                                queryTabData: queryTabData
                            });

                            // Store query-based data in sessionStorage
                            sessionStorage.setItem('session', JSON.stringify(queryTabData));

                            // Update localStorage with the query company info and mark as latest selection
                            // Note: currentBranchUniqueName stays tab-specific (sessionStorage only)
                            const updatedLocalData = {
                                ...localObj,
                                companyUniqueName: queryCompanyUniqueName,
                                activeCompany: targetCompany,
                                lastAccessedAt: Date.now() // Mark as recently selected
                            };
                            // Store last active branch as fallback for future new tabs (only if validated)
                            if (validatedBranchUniqueName) {
                                updatedLocalData.lastActiveBranchUniqueName = validatedBranchUniqueName;
                            }
                            // Ensure currentBranchUniqueName is not stored in localStorage (stays tab-specific)
                            delete updatedLocalData.currentBranchUniqueName;
                            localStorage.setItem('session', JSON.stringify(updatedLocalData));

                            // Trigger company/branch switch APIs similar to switchCompany/switchBranch
                            setTimeout(() => {
                                try {
                                    console.log('Dispatching giddh-query-params-company-switch event with:', {
                                        companyUniqueName: queryCompanyUniqueName,
                                        branchUniqueName: validatedBranchUniqueName,
                                        company: targetCompany
                                    });

                                    // Dispatch actions to trigger API calls (similar to switchCompany/switchBranch)
                                    const event = new CustomEvent('giddh-query-params-company-switch', {
                                        detail: {
                                            companyUniqueName: queryCompanyUniqueName,
                                            branchUniqueName: validatedBranchUniqueName,
                                            company: targetCompany
                                        }
                                    });
                                    window.dispatchEvent(event);
                                    console.log('Event dispatched successfully');
                                } catch (error) {
                                    console.warn('Error dispatching query params company switch event:', error);
                                }
                            }, 100);

                            return JSON.stringify(updatedLocalData);
                        } else {
                            console.warn(`Company with uniqueName '${queryCompanyUniqueName}' not found in available companies`);
                        }
                    }

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
                            // Note: currentBranchUniqueName should NOT be inherited directly, but use lastActiveBranchUniqueName as fallback
                            const tabSpecificData: any = {};
                            config.tabSpecific.session.forEach(tabKey => {
                                if (localObj.hasOwnProperty(tabKey)) {
                                    // Skip currentBranchUniqueName - will be set from fallback below
                                    if (tabKey !== 'currentBranchUniqueName') {
                                        tabSpecificData[tabKey] = localObj[tabKey];
                                    }
                                }
                            });

                            // Use lastActiveBranchUniqueName as fallback for new tabs (when no query params)
                            tabSpecificData.currentBranchUniqueName = localObj.lastActiveBranchUniqueName || '';

                            // Store tab-specific data in sessionStorage for future use
                            if (Object.keys(tabSpecificData).length > 0) {
                                sessionStorage.setItem('session', JSON.stringify(tabSpecificData));
                            }

                            // Update localStorage timestamp to mark this company as recently accessed
                            // This helps maintain the "latest company selection" behavior
                            // Note: currentBranchUniqueName stays tab-specific (sessionStorage only)
                            const updatedLocalData = { ...localObj, lastAccessedAt: Date.now() };
                            // Ensure currentBranchUniqueName is not stored in localStorage (stays tab-specific)
                            delete updatedLocalData.currentBranchUniqueName;
                            localStorage.setItem('session', JSON.stringify(updatedLocalData));

                            return JSON.stringify(updatedLocalData); // Return updated localStorage data
                        } else {
                            // No valid company data in localStorage - check if user has companies available
                            console.warn('No valid company data found in localStorage for new tab. Checking available companies...');

                            // If user has companies available, try to use the first one as fallback
                            if (localObj.companies && localObj.companies.length > 0) {
                                const firstCompany = localObj.companies[0];

                                const fallbackTabData = {
                                    applicationDate: null,
                                    companyUniqueName: firstCompany.uniqueName,
                                    todaySelected: false,
                                    activeCompany: firstCompany,
                                    companyUser: null, // Will be set by the app when company is selected
                                    // Use lastActiveBranchUniqueName as fallback if available for this company
                                    currentBranchUniqueName: (localObj.companyUniqueName === firstCompany.uniqueName)
                                        ? (localObj.lastActiveBranchUniqueName || '')
                                        : '' // Reset branch when company changes
                                };

                                // Store fallback data in sessionStorage
                                sessionStorage.setItem('session', JSON.stringify(fallbackTabData));

                                // Update localStorage with the fallback company info and mark as latest selection
                                // Note: currentBranchUniqueName stays tab-specific (sessionStorage only)
                                const updatedLocalData = {
                                    ...localObj,
                                    companyUniqueName: firstCompany.uniqueName,
                                    activeCompany: firstCompany,
                                    lastAccessedAt: Date.now() // Mark as recently selected
                                };
                                // Ensure currentBranchUniqueName is not stored in localStorage (stays tab-specific)
                                delete updatedLocalData.currentBranchUniqueName;
                                localStorage.setItem('session', JSON.stringify(updatedLocalData));

                                return JSON.stringify(updatedLocalData);
                            } else {
                                // No companies available - initialize with empty defaults
                                console.warn('No companies available. User may need to create a company or re-authenticate.');

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
                                return localData;
                            }
                        }
                    }

                    // Normal scenario: merge sessionStorage and localStorage
                    if (sessionData && localData) {
                        const sessionObj = JSON.parse(sessionData);
                        const localObj = JSON.parse(localData);
                        const merged = { ...localObj };

                        // Override with tab-specific data from sessionStorage
                        config.tabSpecific.session.forEach(tabKey => {
                            if (sessionObj.hasOwnProperty(tabKey)) {
                                merged[tabKey] = sessionObj[tabKey];
                            }
                        });

                        return JSON.stringify(merged);
                    }

                    // Fallback: return whatever data is available
                    return sessionData || localData;
                }

                // For permission (always from localStorage)
                if (key === 'permission') {
                    return localData;
                }

                // For branchConsolidated (prefer sessionStorage, fallback to localStorage)
                if (key === 'branchConsolidated') {
                    return sessionData || localData;
                }

                return sessionData || localData;
            } catch (error) {
                console.warn('Error reading from hybrid storage:', error);
                return localStorage.getItem(key);
            }
        },

        setItem: (key: string, value: string): void => {
            try {
                if (!['session', 'permission', 'branchConsolidated'].includes(key)) {
                    sessionStorage.setItem(key, value);
                    return;
                }

                if (key === 'session') {
                    const sessionData = JSON.parse(value);
                    const tabSpecificData: any = {};
                    const persistentData: any = {};

                    // Split data based on configuration
                    Object.keys(sessionData).forEach(dataKey => {
                        if (config.tabSpecific.session.includes(dataKey)) {
                            tabSpecificData[dataKey] = sessionData[dataKey];
                        } else {
                            persistentData[dataKey] = sessionData[dataKey];
                        }
                    });

                    // Store tab-specific data in sessionStorage
                    if (Object.keys(tabSpecificData).length > 0) {
                        const existingSessionData = (() => {
                            try {
                                const existing = sessionStorage.getItem('session');
                                return existing ? JSON.parse(existing) : {};
                            } catch {
                                return {};
                            }
                        })();
                        sessionStorage.setItem('session', JSON.stringify({ ...existingSessionData, ...tabSpecificData }));

                        // IMPORTANT: Also update localStorage with latest company selection for new tabs
                        // When company changes, update localStorage so new tabs inherit the latest company
                        if (tabSpecificData.companyUniqueName || tabSpecificData.activeCompany) {
                            const existingLocalData = (() => {
                                try {
                                    const existing = localStorage.getItem('session');
                                    return existing ? JSON.parse(existing) : {};
                                } catch {
                                    return {};
                                }
                            })();

                            // Update localStorage with latest company info and last active branch as fallback
                            const updatedLocalData = { ...existingLocalData };
                            if (tabSpecificData.companyUniqueName) {
                                updatedLocalData.companyUniqueName = tabSpecificData.companyUniqueName;
                            }
                            if (tabSpecificData.activeCompany) {
                                updatedLocalData.activeCompany = tabSpecificData.activeCompany;
                            }
                            if (tabSpecificData.companyUser) {
                                updatedLocalData.companyUser = tabSpecificData.companyUser;
                            }
                            // Store last active branch as fallback for new tabs (different from currentBranchUniqueName)
                            if (tabSpecificData.currentBranchUniqueName) {
                                updatedLocalData.lastActiveBranchUniqueName = tabSpecificData.currentBranchUniqueName;
                            }
                            // Mark this as the latest company selection with timestamp
                            updatedLocalData.lastAccessedAt = Date.now();
                            // Note: currentBranchUniqueName stays tab-specific, but lastActiveBranchUniqueName is stored as fallback
                            // Ensure currentBranchUniqueName is not stored in localStorage (stays tab-specific)
                            delete updatedLocalData.currentBranchUniqueName;

                            localStorage.setItem('session', JSON.stringify(updatedLocalData));
                        }
                    }

                    // Store persistent data in localStorage
                    if (Object.keys(persistentData).length > 0) {
                        const existingLocalData = (() => {
                            try {
                                const existing = localStorage.getItem('session');
                                return existing ? JSON.parse(existing) : {};
                            } catch {
                                return {};
                            }
                        })();
                        const updatedPersistentData = { ...existingLocalData, ...persistentData };
                        // Ensure currentBranchUniqueName is not stored in localStorage (stays tab-specific)
                        delete updatedPersistentData.currentBranchUniqueName;
                        localStorage.setItem('session', JSON.stringify(updatedPersistentData));
                    }
                } else if (key === 'permission') {
                    // Permissions are always persistent
                    localStorage.setItem(key, value);
                } else if (key === 'branchConsolidated') {
                    // Branch consolidated is tab-specific
                    sessionStorage.setItem(key, value);
                }
            } catch (error) {
                console.warn('Error writing to hybrid storage:', error);
                localStorage.setItem(key, value);
            }
        },

        removeItem: (key: string): void => {
            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
        },

        clear: (): void => {
            // Only clear app-specific keys
            ['session', 'permission', 'branchConsolidated'].forEach(appKey => {
                sessionStorage.removeItem(appKey);
                localStorage.removeItem(appKey);
            });
        },

        length: 0,
        key: (index: number): string | null => null
    };
};

/**
 * Migration function for existing users
 * Moves existing localStorage data to the hybrid approach
 */
function migrateExistingData(): void {
    try {
        const migrationKey = 'giddh_hybrid_migration_completed';

        // Check if migration already completed
        if (localStorage.getItem(migrationKey)) {
            return;
        }

        // Migrate session data
        const existingSession = localStorage.getItem('session');
        if (existingSession) {
            const sessionData = JSON.parse(existingSession);
            const tabSpecificKeys = ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'];

            // Keep tab-specific data in current tab's sessionStorage
            const tabSpecificData: any = {};
            tabSpecificKeys.forEach(key => {
                if (sessionData.hasOwnProperty(key)) {
                    tabSpecificData[key] = sessionData[key];
                }
            });

            if (Object.keys(tabSpecificData).length > 0) {
                sessionStorage.setItem('session', JSON.stringify(tabSpecificData));
            }
        }

        // Migrate branchConsolidated to sessionStorage
        const existingBranch = localStorage.getItem('branchConsolidated');
        if (existingBranch) {
            sessionStorage.setItem('branchConsolidated', existingBranch);
        }

        // Mark migration as completed
        localStorage.setItem(migrationKey, 'true');
    } catch (error) {
        console.warn('Error during data migration:', error);
    }
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    // Run migration on first load
    migrateExistingData();

    return localStorageSync({
        keys: ['session', 'permission', 'branchConsolidated'],
        rehydrate: true,
        storage: createHybridStorage()
    })(reducer);
}

let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

if (!environment.production) {
    CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrument({ maxAge: 50 }));
}

// Determine giddh region from cookie and set Country-Region in localStorage
let giddhRegion = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('giddh_region='))
    ?.split('=')[1];
giddhRegion = giddhRegion?.toUpperCase();
if (giddhRegion === "UK") {
    localStorage.setItem("Country-Region", "GB");
} else if (giddhRegion === "AE") {
    localStorage.setItem("Country-Region", "AE");
} else if (giddhRegion === "IN") {
    localStorage.setItem("Country-Region", "IN");
} else {
    localStorage.setItem("Country-Region", "GL");
}

// GetServiceConfig returns a configuration object with API URLs, app URLs, and various authentication tokens, using whiteLabelConfig or EnvironmentService fallback values.
export function getServiceConfig(): any {
    // Create service instances
    const environmentService = new EnvironmentService();
    const whiteLabelService = new WhiteLabelService(environmentService);

    // Set the white label configuration if it exists
    if (whiteLabelConfig) {
        whiteLabelService.setWhiteLabelConfig(whiteLabelConfig);
    }

    // Apply dynamic theme if white label configuration exists
    if (whiteLabelConfig?.body?.giddhWhiteLabel?.theme) {
        const dynamicThemeService = new DynamicThemeService();
        dynamicThemeService.applyThemeFromWhiteLabel(whiteLabelConfig);
    }

    // Use WhiteLabelService to get configuration with proper fallbacks
    return whiteLabelService.getServiceConfig();
}

// GetServiceConfigAfterInit returns an async function that first fetches white-label data and then retrieves the service configuration.
export function getServiceConfigAfterInit(): () => Promise<any> {
    return async () => {
        await fetchWhiteLabel()();
        return getServiceConfig();
    };
}


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    declarations: [
        AppComponent,
        AppLoginSuccessComponent,
        MobileRestrictedComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        FormFieldsModule,
        // VerifySubscriptionTransferOwnershipModule,
        ServiceModule.forRoot(),
        ActionModule.forRoot(),
        DecoratorsModule.forRoot(),
        ToastrModule.forRoot({ preventDuplicates: true, maxOpened: 3 }),
        StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: false, strictActionImmutability: false } }),
        ScrollingModule,
        RouterModule.forRoot(ROUTES, {
            useHash: false,
            onSameUrlNavigation: 'reload',
            preloadingStrategy: QuicklinkStrategy
        }),
        QuicklinkModule,
        MatSnackBarModule,
        // SnackBarModule,
        MatDialogModule,
        MatButtonModule,
        LoaderModule,
        PageModule,
        ...CONDITIONAL_IMPORTS
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: APP_INITIALIZER,
            useFactory: getServiceConfigAfterInit,
            multi: true,
            deps: [HttpClient]
        },
        {
            provide: ServiceConfig,
            useFactory: getServiceConfig
        },
        environment.ENV_PROVIDERS,
        APP_PROVIDERS,
        WindowRef,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GiddhHttpInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: Angular21CompatibilityErrorHandler
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                maxWidth: '100%'
            }
        },
        CustomPreloadingStrategy
    ]
})
export class AppModule { }
