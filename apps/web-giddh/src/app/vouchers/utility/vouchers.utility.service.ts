import { Injectable } from '@angular/core';
import { filter, isArray, keys, map } from '../../lodash-optimized';

@Injectable({
    providedIn: 'root'
})
export class VouchersUtilityService {
    constructor() {}

    formatVoucherNumber(voucherNumber: string): string {
        return voucherNumber || '';
    }

    validateVoucherData(data: any): boolean {
        return data && typeof data === 'object';
    }

    calculateTotal(items: any[]): number {
        if (!items || !Array.isArray(items)) {
            return 0;
        }
        return items.reduce((total, item) => total + (item.amount || 0), 0);
    }

    createQueryString(baseUrl: string, params: any): string {
        if (!params || typeof params !== 'object') {
            return baseUrl;
        }

        const queryParams = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    }
}
