import { IOption } from '../../app.constant';
import { cloneDeep, uniqBy } from '../../lodash-optimized';

/**
 * Shared utility for voucher selection logic in adjustment components
 * Used by advance-receipt-adjustment and adjust-payment-dialog components
 */
export class VoucherSelectionHelper {
    /**
     * To handle removed selected voucher from voucher array
     *
     * @param newAdjustVoucherOptions Available voucher options
     * @param adjustVoucherFormAdjustments Current form adjustments
     * @param commonLocaleData Locale data for translations
     * @returns Filtered selected voucher options
     */
    public static getAdvanceReceiptUnselectedVoucher(
        newAdjustVoucherOptions: IOption[],
        adjustVoucherFormAdjustments: any[],
        commonLocaleData: any
    ): IOption[] {
        let options: IOption[] = [];
        let adjustVoucherAdjustment = [];
        (Array.isArray(newAdjustVoucherOptions) ? newAdjustVoucherOptions : []).forEach(item => {
            options.push(item);
        });
        adjustVoucherAdjustment = cloneDeep(adjustVoucherFormAdjustments);

        /**
         * Handles for functionality
         */
        for (let i = options?.length - 1; i >= 0; i--) {
            /**
             * Handles for functionality
             */
            for (let j = 0; j < adjustVoucherAdjustment?.length; j++) {
                /**
                 * Handles if functionality
                 */
                if (options[i] && options[i].label && adjustVoucherAdjustment[j] && adjustVoucherAdjustment[j].voucherNumber &&
                    options[i]?.value && adjustVoucherAdjustment[j].uniqueName &&
                    ((options[i].label.trim() !== '-' && options[i].label.trim() !== commonLocaleData?.app_not_available && adjustVoucherAdjustment[j].voucherNumber.trim() !== '-' && adjustVoucherAdjustment[j].voucherNumber.trim() !== commonLocaleData?.app_not_available && options[i].label.trim() === adjustVoucherAdjustment[j].voucherNumber.trim()) ||
                        ((options[i].label.trim() === '-' || options[i].label.trim() === commonLocaleData?.app_not_available) && (adjustVoucherAdjustment[j].voucherNumber.trim() === '-' || adjustVoucherAdjustment[j].voucherNumber.trim() === commonLocaleData?.app_not_available) && options[i]?.value && adjustVoucherAdjustment[j].uniqueName && options[i]?.value.trim() === adjustVoucherAdjustment[j].uniqueName.trim()))) {
                    options.splice(i, 1);
                }
            }
        }
        (Array.isArray(options) ? options : []).forEach(item => {
            /**
             * Handles if functionality
             */
            if (item) {
                delete item['isHilighted'];
            }
        });

        options = uniqBy(options, (item) => {
            /**
             * Handles if functionality
             */
            if (item.label === '-' || item.label === commonLocaleData?.app_not_available) {
                return item.value;
            } else {
                return item.value && item.label.trim();
            }
        });
        return options;
    }
}
