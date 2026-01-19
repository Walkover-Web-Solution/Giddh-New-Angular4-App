/**
 * Configuration interface for report components
 */
export interface ReportConfig {
    /** Column key for net amount (e.g., 'netSales' or 'netPurchase') */
    columnKey: string;
    /** Translation key for column label (e.g., 'net_sales' or 'app_net_purchase') */
    columnLabel: string;
    /** URL patterns to check for navigation (e.g., ['/reports/sales-register', '/reports/sales-detailed-expand']) */
    urlPatterns: string[];
}

/**
 * Shared utility for report component initialization logic
 * Used by report.details.component and purchase.register.component
 * 
 * Extracted from Groups 13, 29 duplication analysis
 */
export class ReportInitializationHelper {
    /**
     * Creates column configuration object with report-specific settings
     * 
     * @param config Report configuration
     * @returns Column configuration object
     */
    public static createColumnConfig(config: ReportConfig): any {
        return {
            voucherNumber: ["app_invoice_number", false, ""],
            voucherDate: ["app_date", false, ""],
            accountName: ["app_account", false, ""],
            voucherTotal: ["app_total", false, "text-right"],
            taxableValue: ["app_taxable_value", false, "text-right"],
            totalTaxAmount: ["app_tax_amount", false, "text-right"],
            tcsAmount: ["app_tcs_amount", false, "text-right"],
            tdsAmount: ["app_tds_amount", false, "text-right"],
            [config.columnKey]: [config.columnLabel, false, "text-right"],
            cumulative: ["app_cumulative", false, "text-right"]
        };
    }

    /**
     * Checks if the given URL matches any of the report URL patterns
     * 
     * @param url URL to check
     * @param urlPatterns Array of URL patterns to match against
     * @returns True if URL matches any pattern
     */
    public static matchesReportUrl(url: string, urlPatterns: string[]): boolean {
        return urlPatterns.some(pattern => url.includes(pattern));
    }

    /**
     * Creates navigation filter for router events
     * Used to reset financial year when leaving the report module
     * 
     * @param url Current navigation URL
     * @param urlPatterns Report-specific URL patterns
     * @returns True if navigation is leaving the report module
     */
    public static shouldResetFinancialYear(url: string, urlPatterns: string[]): boolean {
        return !this.matchesReportUrl(url, urlPatterns);
    }
}
