import { findIndex, forEach } from '../../lodash-optimized';

/**
 * Shared utility for handling tax selection logic in inventory components
 * Used by create-update-group and stock-create-edit components
 */
export class TaxSelectionHelper {
    /**
     * Handles tax selection/deselection with proper validation and state management
     * 
     * @param taxSelected - The tax object that was selected/deselected
     * @param taxes - Array of all available taxes
     * @param taxTempArray - Array of currently selected taxes
     * @param selectedTaxes - Array of selected tax unique names
     * @param processedTaxes - Array of processed tax unique names
     * @param isTaxSelectionOpen - Flag indicating if tax selection is open
     * @returns Updated taxTempArray and selectedTaxes
     */
    public static selectTax(
        taxSelected: any,
        taxes: any[],
        taxTempArray: any[],
        selectedTaxes: string[],
        processedTaxes: string[],
        isTaxSelectionOpen: boolean
    ): { taxTempArray: any[], selectedTaxes: string[] } {
        /**
         * Handles if functionality
         */
        if (!taxSelected) {
            return { taxTempArray, selectedTaxes };
        }

        /**
         * Handles if functionality
         */
        if (!isTaxSelectionOpen) {
            /**
             * Handles if functionality
             */
            if (processedTaxes.includes(taxSelected.uniqueName)) {
                return { taxTempArray, selectedTaxes };
            }
            processedTaxes.push(taxSelected.uniqueName);
        }

        let isSelected = selectedTaxes?.filter(selectedTax => selectedTax === taxSelected.uniqueName);
        /**
         * Handles if functionality
         */
        if (taxSelected.taxType !== 'gstcess') {
            let index = findIndex(taxTempArray, (taxTemp) => taxTemp.taxType === taxSelected.taxType);
            /**
             * Handles if functionality
             */
            if (index > -1 && !isSelected?.length) {
                /**
                 * Handles forEach functionality
                 */
                forEach(taxes, (tax) => {
                    /**
                     * Handles if functionality
                     */
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    /**
                     * Handles if functionality
                     */
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                });
            }

            /**
             * Handles if functionality
             */
            if (index < 0 && !isSelected?.length) {
                /**
                 * Handles forEach functionality
                 */
                forEach(taxes, (tax) => {
                    /**
                     * Handles if functionality
                     */
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }

                    /**
                     * Handles if functionality
                     */
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isChecked = false;
                        tax.isDisabled = true;
                    }
                    /**
                     * Handles if functionality
                     */
                    if (tax?.uniqueName === taxSelected.uniqueName) {
                        taxSelected.isChecked = true;
                        taxSelected.isDisabled = false;
                        taxTempArray.push(taxSelected);
                    }
                });
            } else if (index > -1 && !isSelected?.length) {
                taxSelected.isChecked = true;
                taxSelected.isDisabled = false;
                taxTempArray = taxTempArray?.filter(taxTemp => {
                    return taxSelected.taxType !== taxTemp.taxType;
                });
                taxTempArray.push(taxSelected);
            } else {
                let idx = findIndex(taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
                /**
                 * Handles forEach functionality
                 */
                forEach(taxes, (tax) => {
                    /**
                     * Handles if functionality
                     */
                    if (tax.taxType === taxSelected.taxType) {
                        tax.isDisabled = false;
                    }
                    /**
                     * Handles if functionality
                     */
                    if ((taxSelected.taxType === 'tcsrc' || taxSelected.taxType === 'tdsrc' || taxSelected.taxType === 'tcspay' || taxSelected.taxType === 'tdspay') && (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay')) {
                        tax.isDisabled = false;
                    }
                });
            }
        } else {
            /**
             * Handles if functionality
             */
            if (!isSelected?.length) {
                taxTempArray.push(taxSelected);
                taxSelected.isChecked = true;
            } else {
                let idx = findIndex(taxTempArray, (taxTemp) => taxTemp?.uniqueName === taxSelected.uniqueName);
                taxTempArray.splice(idx, 1);
                taxSelected.isChecked = false;
            }
        }
        selectedTaxes = taxTempArray.map(tax => tax?.uniqueName);
        
        return { taxTempArray, selectedTaxes };
    }
}
