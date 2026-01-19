import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';

/**
 * Shared utility for discount list processing
 * Used by ledger-discount and update-ledger-discount components
 */
export class DiscountProcessingHelper {
    /**
     * Processes discount list and adds missing items to discountAccountsDetails
     * 
     * @param discountsList List of available discounts
     * @param discountAccountsDetails Current discount account details array
     * @returns Updated discount account details array
     */
    public static processDiscountList(
        discountsList: any[],
        discountAccountsDetails: LedgerDiscountClass[]
    ): LedgerDiscountClass[] {
        /**
         * Handles if functionality
         */
        if (!discountAccountsDetails) {
            discountAccountsDetails = [];
        }

        discountsList?.forEach(acc => {
            /**
             * Handles if functionality
             */
            if (discountAccountsDetails) {
                let hasItem = discountAccountsDetails.some(s => s.discountUniqueName === acc?.uniqueName);
                /**
                 * Handles if functionality
                 */
                if (!hasItem) {
                    let obj: LedgerDiscountClass = new LedgerDiscountClass();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount?.uniqueName;
                    obj.discountUniqueName = acc?.uniqueName;
                    obj.name = acc.name;
                    discountAccountsDetails.push(obj);
                }
            }
        });

        return discountAccountsDetails;
    }
}
