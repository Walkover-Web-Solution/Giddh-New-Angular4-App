import { Observable, of as observableOf } from 'rxjs';
import { IOption } from '../../app.constant';

/**
 * Shared utility for creating voucher types list
 * Used by advance search components for consistent voucher type options
 */
export class VoucherTypesHelper {
    /**
     * Creates standardized voucher types list with localized labels
     * 
     * @param commonLocaleData Common locale data with voucher type translations
     * @returns Observable of voucher type options
     */
    public static getVoucherTypes(commonLocaleData: any): Observable<IOption[]> {
        return observableOf([
            {
                label: commonLocaleData?.app_voucher_types?.sales,
                value: 'sales'
            },
            {
                label: commonLocaleData?.app_voucher_types?.purchases,
                value: 'purchase'
            },
            {
                label: commonLocaleData?.app_voucher_types?.receipt,
                value: 'receipt'
            },
            {
                label: commonLocaleData?.app_voucher_types?.payment,
                value: 'payment'
            },
            {
                label: commonLocaleData?.app_voucher_types?.journal,
                value: 'journal'
            },
            {
                label: commonLocaleData?.app_voucher_types?.contra,
                value: 'contra'
            },
            {
                label: commonLocaleData?.app_voucher_types?.debit_note,
                value: 'debit note'
            },
            {
                label: commonLocaleData?.app_voucher_types?.credit_note,
                value: 'credit note'
            }
        ]);
    }
}
