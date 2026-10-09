export interface ReportItem {
    name: string;
    uniqueName: string;
}

export interface FilterOption {
    name: string;
    reports: string[];
}

export interface AllReportsResponse {
    reportList: ReportItem[];
    favoriteReportList: ReportItem[];
    filterOption?: FilterOption[];
}

export interface ReportCategory {
    label: string;
    icon: string;
    reports: ReportItem[];
}

/** UI-facing shape of a report category rendered as a chip/card */
export interface CategoryDefinition {
    /** URL-safe key, e.g. 'cash-flow' */
    key: string;
    /** Human readable label from API */
    label: string;
    /** CSS icon class or SVG filename */
    icon: string;
    /** Icon foreground color */
    color: string;
    /** Icon badge background color */
    bgColor: string;
    /** Raw report `name` values that belong to this category */
    reports: string[];
}

/** Canonical category names as returned by the API (`filterOption.name`) */
export enum ReportCategoryName {
    ALL = 'All',
    SALES = 'Sales',
    PURCHASE = 'Purchase',
    CUSTOMERS = 'Customers/Vendors',
    FINANCIAL = 'Financial',
    ACCOUNTING = 'Accounting',
    INVENTORY = 'Inventory',
    CASH_FLOW = 'CashFlow'
}
