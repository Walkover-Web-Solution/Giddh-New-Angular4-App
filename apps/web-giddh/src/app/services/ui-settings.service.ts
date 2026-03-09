import { Injectable } from '@angular/core';
import { UI_SETTINGS_STORAGE_KEY, CACHE_DURATION } from '../app.constant';

/** Storage key for persisted route query filter params */
const ROUTE_QUERY_FILTERS_KEY = 'route-query-filters';

/**
 * Interface for UI settings data structure
 */
export interface UiSettingsData {
    'resizable-width'?: { [moduleName: string]: number };
    'showAccountUniqueName'?: boolean;
    [key: string]: any;
}

/**
 * Interface for cached setting with expiry
 */
interface CachedSetting<T> {
    value: T;
    expiresAt: number;
    cachedAt: number;
}

/**
 * Service to manage UI settings with localStorage caching and expiry management
 * 
 * @export
 * @class UiSettingsService
 */
@Injectable({
    providedIn: 'root'
})
export class UiSettingsService {
    /** Default cache duration for UI settings (1 year) */
    private readonly DEFAULT_CACHE_DURATION = CACHE_DURATION.ONE_YEAR;

    constructor() {
        this.verifyAndCleanCache();
    }

    /**
     * Gets a setting value from localStorage with cache validation
     * 
     * @public
     * @template T
     * @param {string} key - Setting key
     * @param {T} [defaultValue] - Default value if not found or expired
     * @param {number} [cacheDuration] - Custom cache duration in milliseconds
     * @returns {T} Setting value or default
     * @memberof UiSettingsService
     */
    public getSetting<T>(key: string, defaultValue?: T, cacheDuration?: number): T {
        try {
            const allSettings = this.getAllSettings();
            
            if (!allSettings || !allSettings[key]) {
                return defaultValue as T;
            }

            const setting = allSettings[key];
            
            if (this.isCachedSetting(setting)) {
                if (this.isSettingExpired(setting)) {
                    this.removeSetting(key);
                    return defaultValue as T;
                }
                return setting.value as T;
            }
            
            return setting as T;
        } catch (error) {
            console.warn(`Error getting setting "${key}":`, error);
            return defaultValue as T;
        }
    }

    /**
     * Sets a setting value in localStorage with expiry timestamp
     * 
     * @public
     * @template T
     * @param {string} key - Setting key
     * @param {T} value - Setting value
     * @param {number} [cacheDuration] - Cache duration in milliseconds (default: 1 year)
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public setSetting<T>(key: string, value: T, cacheDuration: number = this.DEFAULT_CACHE_DURATION): boolean {
        try {
            const allSettings = this.getAllSettings();
            const now = Date.now();
            
            const cachedSetting: CachedSetting<T> = {
                value: value,
                expiresAt: now + cacheDuration,
                cachedAt: now
            };
            
            allSettings[key] = cachedSetting;
            
            localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
            return true;
        } catch (error) {
            console.error(`Error setting "${key}":`, error);
            return false;
        }
    }

    /**
     * Removes a specific setting from localStorage
     * 
     * @public
     * @param {string} key - Setting key to remove
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public removeSetting(key: string): boolean {
        try {
            const allSettings = this.getAllSettings();
            
            if (allSettings && allSettings[key]) {
                delete allSettings[key];
                localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error(`Error removing setting "${key}":`, error);
            return false;
        }
    }

    /**
     * Gets all UI settings from localStorage
     * 
     * @public
     * @returns {UiSettingsData} All settings object
     * @memberof UiSettingsService
     */
    public getAllSettings(): UiSettingsData {
        try {
            const data = localStorage.getItem(UI_SETTINGS_STORAGE_KEY);
            
            if (!data) {
                return {};
            }
            
            return JSON.parse(data);
        } catch (error) {
            console.warn('Error parsing UI settings, resetting:', error);
            this.clearAllSettings();
            return {};
        }
    }

    /**
     * Clears all UI settings from localStorage
     * 
     * @public
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public clearAllSettings(): boolean {
        try {
            localStorage.removeItem(UI_SETTINGS_STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing UI settings:', error);
            return false;
        }
    }

    /**
     * Verifies cache integrity and removes expired settings
     * 
     * @public
     * @returns {number} Number of expired settings removed
     * @memberof UiSettingsService
     */
    public verifyAndCleanCache(): number {
        try {
            const allSettings = this.getAllSettings();
            let removedCount = 0;
            
            Object.keys(allSettings).forEach(key => {
                const setting = allSettings[key];
                
                if (this.isCachedSetting(setting) && this.isSettingExpired(setting)) {
                    delete allSettings[key];
                    removedCount++;
                }
            });
            
            if (removedCount > 0) {
                localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
            }
            
            return removedCount;
        } catch (error) {
            console.error('Error verifying cache:', error);
            return 0;
        }
    }

    /**
     * Gets the showAccountUniqueName setting
     * 
     * @public
     * @returns {boolean} Setting value (default: false)
     * @memberof UiSettingsService
     */
    public getShowAccountUniqueName(): boolean {
        return this.getSetting<boolean>('showAccountUniqueName', false);
    }

    /**
     * Sets the showAccountUniqueName setting
     * 
     * @public
     * @param {boolean} value - Setting value
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public setShowAccountUniqueName(value: boolean): boolean {
        return this.setSetting<boolean>('showAccountUniqueName', value);
    }

    /**
     * Gets resizable width ratio for a specific module
     * 
     * @public
     * @param {string} moduleName - Module identifier
     * @returns {(number | null)} Width ratio or null if not found
     * @memberof UiSettingsService
     */
    public getResizableWidth(moduleName: string): number | null {
        try {
            const allSettings = this.getAllSettings();
            
            if (allSettings['resizable-width'] && allSettings['resizable-width'][moduleName]) {
                const widthData = allSettings['resizable-width'][moduleName];
                
                if (this.isCachedSetting(widthData)) {
                    if (this.isSettingExpired(widthData)) {
                        this.removeResizableWidth(moduleName);
                        return null;
                    }
                    return widthData.value as number;
                }
                
                return widthData as number;
            }
            
            return null;
        } catch (error) {
            console.warn(`Error getting resizable width for "${moduleName}":`, error);
            return null;
        }
    }

    /**
     * Sets resizable width ratio for a specific module with 30-day expiry
     * 
     * @public
     * @param {string} moduleName - Module identifier
     * @param {number} widthRatio - Width ratio to save
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public setResizableWidth(moduleName: string, widthRatio: number): boolean {
        try {
            const allSettings = this.getAllSettings();
            const now = Date.now();
            
            if (!allSettings['resizable-width']) {
                allSettings['resizable-width'] = {};
            }
            
            const cachedWidth: CachedSetting<number> = {
                value: widthRatio,
                expiresAt: now + CACHE_DURATION.THIRTY_DAYS,
                cachedAt: now
            };
            
            (allSettings['resizable-width'] as any)[moduleName] = cachedWidth;
            
            localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
            return true;
        } catch (error) {
            console.error(`Error setting resizable width for "${moduleName}":`, error);
            return false;
        }
    }

    /**
     * Removes resizable width for a specific module
     * 
     * @public
     * @param {string} moduleName - Module identifier
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public removeResizableWidth(moduleName: string): boolean {
        try {
            const allSettings = this.getAllSettings();
            
            if (allSettings['resizable-width'] && allSettings['resizable-width'][moduleName]) {
                delete allSettings['resizable-width'][moduleName];
                localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error(`Error removing resizable width for "${moduleName}":`, error);
            return false;
        }
    }

    /**
     * Gets the saved query params for a specific route and company
     *
     * @public
     * @param {string} companyUniqueName - The active company unique name
     * @param {string} routePath - The route path (e.g. /pages/contact/customer)
     * @returns {(Record<string, any> | null)} Saved query params or null if not found
     * @memberof UiSettingsService
     */
    public getRouteQueryFilters(companyUniqueName: string, routePath: string): Record<string, any> | null {
        try {
            const allSettings = this.getAllSettings();
            const routeFilters = allSettings[ROUTE_QUERY_FILTERS_KEY];
            return routeFilters?.[companyUniqueName]?.[routePath]?.queryParams ?? null;
        } catch (error) {
            console.warn('Error getting route query filters:', error);
            return null;
        }
    }

    /**
     * Saves query params for a specific route and company. Pass null to clear.
     *
     * @public
     * @param {string} companyUniqueName - The active company unique name
     * @param {string} routePath - The route path (e.g. /pages/contact/customer)
     * @param {(Record<string, any> | null)} queryParams - Query params to save, or null to clear
     * @returns {boolean} Success status
     * @memberof UiSettingsService
     */
    public setRouteQueryFilters(companyUniqueName: string, routePath: string, queryParams: Record<string, any> | null): boolean {
        try {
            const allSettings = this.getAllSettings();
            if (!allSettings[ROUTE_QUERY_FILTERS_KEY]) {
                allSettings[ROUTE_QUERY_FILTERS_KEY] = {};
            }
            if (!allSettings[ROUTE_QUERY_FILTERS_KEY][companyUniqueName]) {
                allSettings[ROUTE_QUERY_FILTERS_KEY][companyUniqueName] = {};
            }
            if (queryParams === null) {
                delete allSettings[ROUTE_QUERY_FILTERS_KEY][companyUniqueName][routePath];
            } else {
                allSettings[ROUTE_QUERY_FILTERS_KEY][companyUniqueName][routePath] = { queryParams };
            }
            localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
            return true;
        } catch (error) {
            console.error('Error setting route query filters:', error);
            return false;
        }
    }

    /**
     * Checks if a value is a cached setting with expiry
     * 
     * @private
     * @param {*} value - Value to check
     * @returns {boolean} True if cached setting
     * @memberof UiSettingsService
     */
    private isCachedSetting(value: any): value is CachedSetting<any> {
        return value && typeof value === 'object' && 'value' in value && 'expiresAt' in value && 'cachedAt' in value;
    }

    /**
     * Checks if a cached setting has expired
     * 
     * @private
     * @param {CachedSetting<any>} setting - Cached setting to check
     * @returns {boolean} True if expired
     * @memberof UiSettingsService
     */
    private isSettingExpired(setting: CachedSetting<any>): boolean {
        return Date.now() > setting.expiresAt;
    }
}
