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
import { environment } from '../environments/environment.generated';
import { ActionModule } from './actions/action.module';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success';
import { AppComponent } from './app.component';
import { IS_ELECTRON_WA } from './app.constant';
import { Angular21CompatibilityErrorHandler } from './angular21-compatibility';
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
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MobileRestrictedComponent } from './mobile-restricted/mobile-restricted.component';
import { LoaderModule } from './loader/loader.module';
import { PageModule } from './page/page.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldsModule } from './theme/form-fields/form-fields.module';
import { VerifySubscriptionTransferOwnershipModule } from './verify-subscription-transfer-ownership/verify-subscription-transfer-ownership.module';
// Debug: Log all environment variables to verify they're loaded correctly
// Get white label configuration from localStorage
const whiteLabelString = localStorage.getItem('whiteLabel');
let whiteLabelConfig = whiteLabelString ? JSON.parse(whiteLabelString) : null;
whiteLabelConfig = whiteLabelConfig?.status === 'error' ? null : whiteLabelConfig;
// FetchWhiteLabel returns an async function that fetches white-label data from an API, stores it in localStorage, and caches it in whiteLabelConfig.
export function fetchWhiteLabel(): () => Promise<void> {
    return async () => {
        /**
         * Handles if functionality
         */
        if (!whiteLabelConfig) {
            try {
                const response = await fetch(`${Configuration.ApiUrl}white-label`);
                const data = await response.json();
                localStorage.setItem('whiteLabel', JSON.stringify(data));
                whiteLabelConfig = data;
            } catch (error) {
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
 * Handle session data retrieval with complex query parameter and tab logic
 */
function handleSessionDataRetrieval(sessionData: string | null, localData: string | null, config: any): string | null {
    // Check for query parameters first - this takes precedence over stored data
    const queryResult = handleQueryParameterProcessing(localData);
    /**
     * Handles if functionality
     */
    if (queryResult) {
        return queryResult;
    }

    // Handle new tab scenario: only localStorage data exists
    /**
     * Handles if functionality
     */
    if (!sessionData && localData) {
        return handleNewTabScenario(localData, config);
    }

    // Normal scenario: merge sessionStorage and localStorage
    /**
     * Handles if functionality
     */
    if (sessionData && localData) {
        return mergeSessionAndLocalData(sessionData, localData, config);
    }

    // Fallback: return whatever data is available
    return sessionData || localData;
}

/**
 * Handle query parameter processing for company/branch switching
 */
function handleQueryParameterProcessing(localData: string | null): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const queryCompanyUniqueName = urlParams.get('companyUniqueName');
    const queryBranchUniqueName = urlParams.get('branchUniqueName');

    /**
     * Handles if functionality
     */
    if (!queryCompanyUniqueName || !localData) {
        return null;
    }

    const localObj = JSON.parse(localData);
    const targetCompany = localObj.companies?.find((company: any) =>
        company.uniqueName === queryCompanyUniqueName
    );

    /**
     * Handles if functionality
     */
    if (!targetCompany) {
        return null;
    }

    return processQueryCompanySwitch(localObj, targetCompany, queryCompanyUniqueName, queryBranchUniqueName);
}

/**
 * Process company switch from query parameters
 */
function processQueryCompanySwitch(localObj: any, targetCompany: any, queryCompanyUniqueName: string, queryBranchUniqueName: string | null): string {
    // Validate branch belongs to company
    let validatedBranchUniqueName = '';
    /**
     * Handles if functionality
     */
    if (queryBranchUniqueName) {
        const targetBranch = targetCompany.branches?.find((branch: any) =>
            branch.uniqueName === queryBranchUniqueName
        );
        /**
         * Handles if functionality
         */
        if (targetBranch) {
            validatedBranchUniqueName = queryBranchUniqueName;
        }
    }

    // Create tab-specific data with validated query params
    const queryTabData = {
        applicationDate: null,
        companyUniqueName: queryCompanyUniqueName,
        todaySelected: false,
        activeCompany: targetCompany,
        companyUser: null,
        currentBranchUniqueName: validatedBranchUniqueName
    };

    // Store query-based data in sessionStorage
    sessionStorage.setItem('session', JSON.stringify(queryTabData));

    // Update localStorage with query company info
    const updatedLocalData = {
        ...localObj,
        companyUniqueName: queryCompanyUniqueName,
        activeCompany: targetCompany,
        lastAccessedAt: Date.now()
    };

    /**
     * Handles if functionality
     */
    if (validatedBranchUniqueName) {
        updatedLocalData.lastActiveBranchUniqueName = validatedBranchUniqueName;
    }

    delete updatedLocalData.currentBranchUniqueName;
    localStorage.setItem('session', JSON.stringify(updatedLocalData));

    // Trigger company/branch switch event
    /**
     * Handles triggerCompanySwitchEvent functionality
     */
    triggerCompanySwitchEvent(queryCompanyUniqueName, validatedBranchUniqueName, targetCompany);

    return JSON.stringify(updatedLocalData);
}

/**
 * Trigger company switch event for API calls
 */
function triggerCompanySwitchEvent(companyUniqueName: string, branchUniqueName: string, company: any): void {
    /**
     * Sets timeout value
     */
    setTimeout(() => {
        try {
            const event = new CustomEvent('giddh-query-params-company-switch', {
                detail: {
                    companyUniqueName,
                    branchUniqueName,
                    company
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            // Handle error silently
        }
    }, 100);
}

/**
 * Handle new tab scenario with localStorage data initialization
 */
function handleNewTabScenario(localData: string, config: any): string {
    const localObj = JSON.parse(localData);
    const hasValidCompanyData = localObj.activeCompany &&
        localObj.activeCompany.uniqueName &&
        localObj.companyUniqueName;

    /**
     * Handles if functionality
     */
    if (hasValidCompanyData) {
        return initializeValidCompanyData(localObj, config);
    } else {
        return initializeFallbackCompanyData(localObj, localData);
    }
}

/**
 * Initialize tab with valid company data
 */
function initializeValidCompanyData(localObj: any, config: any): string {
    const tabSpecificData: any = {};

    (Array.isArray(config.tabSpecific.session) ? config.tabSpecific.session : []).forEach(tabKey => {
        /**
         * Handles if functionality
         */
        if (localObj.hasOwnProperty(tabKey)) {
            /**
             * Handles if functionality
             */
            if (tabKey !== 'currentBranchUniqueName') {
                tabSpecificData[tabKey] = localObj[tabKey];
            }
        }
    });

    tabSpecificData.currentBranchUniqueName = localObj.lastActiveBranchUniqueName || '';

    /**
     * Handles if functionality
     */
    if (Object.keys(tabSpecificData).length > 0) {
        sessionStorage.setItem('session', JSON.stringify(tabSpecificData));
    }

    const updatedLocalData = { ...localObj, lastAccessedAt: Date.now() };
    delete updatedLocalData.currentBranchUniqueName;
    localStorage.setItem('session', JSON.stringify(updatedLocalData));

    return JSON.stringify(updatedLocalData);
}

/**
 * Initialize fallback company data when no valid company exists
 */
function initializeFallbackCompanyData(localObj: any, localData: string): string {
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
            /**
             * Handles currentBranchUniqueName functionality
             */
            currentBranchUniqueName: (localObj.companyUniqueName === firstCompany.uniqueName)
                ? (localObj.lastActiveBranchUniqueName || '')
                : ''
        };

        sessionStorage.setItem('session', JSON.stringify(fallbackTabData));

        const updatedLocalData = {
            ...localObj,
            companyUniqueName: firstCompany.uniqueName,
            activeCompany: firstCompany,
            lastAccessedAt: Date.now()
        };

        delete updatedLocalData.currentBranchUniqueName;
        localStorage.setItem('session', JSON.stringify(updatedLocalData));

        return JSON.stringify(updatedLocalData);
    } else {
        // No companies available - initialize with empty defaults
        const defaultTabData = {
            applicationDate: null,
            companyUniqueName: '',
            todaySelected: false,
            activeCompany: null,
            companyUser: null,
            currentBranchUniqueName: ''
        };

        sessionStorage.setItem('session', JSON.stringify(defaultTabData));
        return localData;
    }
}

/**
 * Merge session and local storage data
 */
function mergeSessionAndLocalData(sessionData: string, localData: string, config: any): string {
    const sessionObj = JSON.parse(sessionData);
    const localObj = JSON.parse(localData);
    const merged = { ...localObj };

    // Override with tab-specific data from sessionStorage
    (Array.isArray(config.tabSpecific.session) ? config.tabSpecific.session : []).forEach(tabKey => {
        /**
         * Handles if functionality
         */
        if (sessionObj.hasOwnProperty(tabKey)) {
            merged[tabKey] = sessionObj[tabKey];
        }
    });

    return JSON.stringify(merged);
}

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
        /**
         * Retrieves item data
         */
        getItem: (key: string): string | null => {
            try {
                /**
                 * Handles if functionality
                 */
                if (!['session', 'permission', 'branchConsolidated'].includes(key)) {
                    return sessionStorage.getItem(key) || localStorage.getItem(key);
                }

                const sessionData = sessionStorage.getItem(key);
                const localData = localStorage.getItem(key);

                /**
                 * Handles if functionality
                 */
                if (key === 'session') {
                    return handleSessionDataRetrieval(sessionData, localData, config);
                }

                // For permission (always from localStorage)
                /**
                 * Handles if functionality
                 */
                if (key === 'permission') {
                    return localData;
                }

                // For branchConsolidated (prefer sessionStorage, fallback to localStorage)
                /**
                 * Handles if functionality
                 */
                if (key === 'branchConsolidated') {
                    return sessionData || localData;
                }

                return sessionData || localData;
            } catch (error) {
                return localStorage.getItem(key);
            }
        },
        /**
         * Sets item value
         */
        setItem: (key: string, value: string): void => {
            try {
                /**
                 * Handles if functionality
                 */
                if (!['session', 'permission', 'branchConsolidated'].includes(key)) {
                    sessionStorage.setItem(key, value);
                    return;
                }
                /**
                 * Handles if functionality
                 */
                if (key === 'session') {
                    const sessionData = JSON.parse(value);
                    const tabSpecificData: any = {};
                    const persistentData: any = {};
                    // Split data based on configuration
                    Object.keys(sessionData).forEach(dataKey => {
                        /**
                         * Handles if functionality
                         */
                        if (config.tabSpecific.session.includes(dataKey)) {
                            tabSpecificData[dataKey] = sessionData[dataKey];
                        } else {
                            persistentData[dataKey] = sessionData[dataKey];
                        }
                    });
                    // Store tab-specific data in sessionStorage
                    /**
                     * Handles if functionality
                     */
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
                        /**
                         * Handles if functionality
                         */
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
                            /**
                             * Handles if functionality
                             */
                            if (tabSpecificData.companyUniqueName) {
                                updatedLocalData.companyUniqueName = tabSpecificData.companyUniqueName;
                            }
                            /**
                             * Handles if functionality
                             */
                            if (tabSpecificData.activeCompany) {
                                updatedLocalData.activeCompany = tabSpecificData.activeCompany;
                            }
                            /**
                             * Handles if functionality
                             */
                            if (tabSpecificData.companyUser) {
                                updatedLocalData.companyUser = tabSpecificData.companyUser;
                            }
                            // Store last active branch as fallback for new tabs (different from currentBranchUniqueName)
                            /**
                             * Handles if functionality
                             */
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
                    /**
                     * Handles if functionality
                     */
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
                localStorage.setItem(key, value);
            }
        },
        /**
         * Deletes item
         */
        removeItem: (key: string): void => {
            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
        },
        /**
         * Handles clear functionality
         */
        clear: (): void => {
            // Only clear app-specific keys
            ['session', 'permission', 'branchConsolidated'].forEach(appKey => {
                sessionStorage.removeItem(appKey);
                localStorage.removeItem(appKey);
            });
        },
        length: 0,
        /**
         * Handles key functionality
         */
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
        /**
         * Handles if functionality
         */
        if (localStorage.getItem(migrationKey)) {
            return;
        }
        // Migrate session data
        const existingSession = localStorage.getItem('session');
        /**
         * Handles if functionality
         */
        if (existingSession) {
            const sessionData = JSON.parse(existingSession);
            const tabSpecificKeys = ['companyUniqueName', 'activeCompany', 'companyUser', 'applicationDate', 'todaySelected', 'currentBranchUniqueName'];
            // Keep tab-specific data in current tab's sessionStorage
            const tabSpecificData: any = {};
            (Array.isArray(tabSpecificKeys) ? tabSpecificKeys : []).forEach(key => {
                /**
                 * Handles if functionality
                 */
                if (sessionData.hasOwnProperty(key)) {
                    tabSpecificData[key] = sessionData[key];
                }
            });
            /**
             * Handles if functionality
             */
            if (Object.keys(tabSpecificData).length > 0) {
                sessionStorage.setItem('session', JSON.stringify(tabSpecificData));
            }
        }
        // Migrate branchConsolidated to sessionStorage
        const existingBranch = localStorage.getItem('branchConsolidated');
        /**
         * Handles if functionality
         */
        if (existingBranch) {
            sessionStorage.setItem('branchConsolidated', existingBranch);
        }
        // Mark migration as completed
        localStorage.setItem(migrationKey, 'true');
    } catch (error) {
    }
}
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    // Run migration on first load
    /**
     * Handles migrateExistingData functionality
     */
    migrateExistingData();
    return localStorageSync({
        keys: ['session', 'permission', 'branchConsolidated'],
        rehydrate: true,
        storage: createHybridStorage()
    })(reducer);
}
let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
/**
 * Handles if functionality
 */
if (!environment.production) {
    CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrument({ maxAge: 50 }));
}
// Determine giddh region from cookie and set Country-Region in localStorage
let giddhRegion = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('giddh_region='))
    ?.split('=')[1];
giddhRegion = giddhRegion?.toUpperCase();
/**
 * Handles if functionality
 */
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
    /**
     * Handles if functionality
     */
    if (whiteLabelConfig) {
        whiteLabelService.setWhiteLabelConfig(whiteLabelConfig);
    }
    // Apply dynamic theme if white label configuration exists
    /**
     * Handles if functionality
     */
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
        VerifySubscriptionTransferOwnershipModule,
        ServiceModule.forRoot(),
        ActionModule.forRoot(),
        DecoratorsModule.forRoot(),
        ToastrModule.forRoot({ preventDuplicates: true, maxOpened: 3 }),
        StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: false, strictActionImmutability: false } }),
        ScrollingModule,
        RouterModule.forRoot(ROUTES, {
            useHash: IS_ELECTRON_WA,
            onSameUrlNavigation: 'reload',
            preloadingStrategy: QuicklinkStrategy
        }),
        QuicklinkModule,
        MatSnackBarModule,
        MatDialogModule,
        MatButtonModule,
        LoaderModule,
        PageModule,
        ...CONDITIONAL_IMPORTS
    ],
    providers: [
        /**
         * Handles provideHttpClient functionality
         */
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
                maxWidth: '100%',
                autoFocus: true
            }
        },
        CustomPreloadingStrategy
    ]
})
/**
 * AppModule module
 * Implements AppModule functionality
 */
export class AppModule { }
