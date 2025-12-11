import { Injectable } from '@angular/core';

export interface IFinancialYearResponse {
    // Placeholder interface
    financialYears?: any[];
}

export interface ILockFinancialYearRequest {
    // Placeholder interface
    uniqueName?: string;
    lockAll?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsFinancialYearService {
    // Placeholder implementation
    constructor() {}
}