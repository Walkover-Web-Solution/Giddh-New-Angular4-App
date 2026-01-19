import { Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';

/**
 * Shared utility for advance receipt adjustment validation and submission logic
 * Used by advance-receipt-adjustment and adjust-payment-dialog components
 * 
 * Extracted from Groups 22, 26, 28 duplication analysis
 */
export class AdvanceReceiptValidationHelper {
    /**
     * Validates adjustment form before submission
     * 
     * @param adjustVoucherForm The adjustment voucher form data
     * @param isTaxDeducted Whether tax is deducted
     * @param tdsTypeBox Reference to TDS type box element
     * @param tdsAmountBox Reference to TDS amount box element
     * @returns True if form is valid, false otherwise
     */
    public static validateAdjustmentForm(
        adjustVoucherForm: any,
        isTaxDeducted: boolean,
        tdsTypeBox: any,
        tdsAmountBox: any
    ): boolean {
        let isValid = true;

        if (adjustVoucherForm && adjustVoucherForm.adjustments) {
            adjustVoucherForm.adjustments.forEach(item => {
                if (item && item.voucherNumber === '') {
                    isValid = false;
                }
            });
            adjustVoucherForm.adjustments = adjustVoucherForm.adjustments?.filter(item => {
                return item?.voucherNumber !== '' || item?.adjustmentAmount?.amountForAccount > 0;
            });
        }

        if (isTaxDeducted) {
            if (adjustVoucherForm.tdsTaxUniqueName === '') {
                if (tdsTypeBox && tdsTypeBox.nativeElement) {
                    tdsTypeBox.nativeElement.classList.add('error-box');
                }
                isValid = false;
            } else if (adjustVoucherForm.tdsAmount.amountForAccount === 0) {
                if (tdsAmountBox && tdsAmountBox.nativeElement) {
                    tdsAmountBox.nativeElement.classList.add('error-box');
                    isValid = false;
                }
            }
        } else {
            delete adjustVoucherForm['tdsAmount'];
            delete adjustVoucherForm['description'];
            delete adjustVoucherForm['tdsTaxUniqueName'];
        }

        return isValid;
    }

    /**
     * Handles voucher selection logic
     * 
     * @param event Selected option event
     * @param entry Current adjustment entry
     * @param index Index of the adjustment
     * @param adjustVoucherForm The adjustment voucher form
     * @param isFormReset Whether form is being reset
     * @param calculateTaxCallback Callback to calculate tax
     * @param checkValidationsCallback Callback to check validations
     * @returns Updated entry
     */
    public static handleVoucherSelection(
        event: any,
        entry: Adjustment,
        index: number,
        adjustVoucherForm: any,
        isFormReset: boolean,
        calculateTaxCallback: (entry: Adjustment, index: number) => void,
        checkValidationsCallback: () => void
    ): Adjustment {
        if (event && entry && !isFormReset) {
            const clonedEntry = JSON.parse(JSON.stringify(event.additional));
            if (clonedEntry?.uniqueName) {
                adjustVoucherForm.adjustments.splice(index, 1, clonedEntry);
                calculateTaxCallback(clonedEntry, index);
            } else {
                adjustVoucherForm.adjustments[index] = new Adjustment();
            }
            checkValidationsCallback();
            return clonedEntry;
        }
        return entry;
    }

    /**
     * Prepares voucher options for selection dropdown
     * 
     * @param index Current adjustment row index
     * @param form NgForm reference
     * @param adjustVoucherForm The adjustment voucher form
     * @param newAdjustVoucherOptions All available voucher options
     * @param getUnselectedVoucherCallback Callback to get unselected vouchers
     * @returns Prepared voucher options
     */
    public static prepareVoucherOptions(
        index: number,
        form: any,
        adjustVoucherForm: any,
        newAdjustVoucherOptions: any[],
        getUnselectedVoucherCallback: () => any[]
    ): any[] {
        if (form.controls[`voucherName${index}`]) {
            form.controls[`voucherName${index}`].markAsTouched();
        }

        let adjustVoucherOptions = getUnselectedVoucherCallback();

        if (adjustVoucherForm && adjustVoucherForm.adjustments && adjustVoucherForm.adjustments.length && 
            adjustVoucherForm.adjustments[index] && adjustVoucherForm.adjustments[index].voucherNumber) {
            const selectedItem = newAdjustVoucherOptions.find(item => 
                item?.value === adjustVoucherForm.adjustments[index]?.uniqueName
            );
            if (selectedItem) {
                delete selectedItem['isHilighted'];
                adjustVoucherOptions.splice(0, 0, { 
                    value: selectedItem?.value, 
                    label: selectedItem.label, 
                    additional: selectedItem.additional 
                });
            }
        }

        return adjustVoucherOptions;
    }
}
