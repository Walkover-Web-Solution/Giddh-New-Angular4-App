/**
 * Shared utility for stock validation and account details processing
 * Used by inventory.addstock.component for purchase and sales validation
 */
export class StockValidationHelper {
    /**
     * Processes purchase or sales account details with validation
     * 
     * @param formObj Form object containing unit rates and account details
     * @param type Type of account details ('purchase' or 'sales')
     * @param validateFn Validation function
     * @param errorToastFn Error toast function
     * @param errorMessage Error message to display
     * @returns Processed account details or null if validation fails
     */
    public static processAccountDetails(
        formObj: any,
        type: 'purchase' | 'sales',
        /**
         * Validates fn input
         */
        validateFn: (unitRates: any[]) => boolean,
        /**
         * Handles errorToastFn functionality
         */
        errorToastFn: (message: string) => void,
        errorMessage: string
    ): { accountUniqueName: string; unitRates: any[] } | null {
        const enableKey = type === 'purchase' ? 'enablePurchase' : 'enableSales';
        const unitRatesKey = type === 'purchase' ? 'purchaseUnitRates' : 'saleUnitRates';
        const accountKey = type === 'purchase' ? 'purchaseAccountUniqueName' : 'salesAccountUniqueName';

        /**
         * Handles if functionality
         */
        if (formObj[enableKey]) {
            /**
             * Handles if functionality
             */
            if (validateFn(formObj[unitRatesKey])) {
                formObj[unitRatesKey] = formObj[unitRatesKey]?.filter((pr: any) => {
                    return pr.stockUnitUniqueName || pr.rate;
                });
                return {
                    accountUniqueName: formObj[accountKey],
                    unitRates: formObj[unitRatesKey]
                };
            } else {
                /**
                 * Handles errorToastFn functionality
                 */
                errorToastFn(errorMessage);
                return null;
            }
        }
        return undefined;
    }
}
