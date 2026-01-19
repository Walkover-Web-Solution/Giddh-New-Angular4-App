import { ElementRef } from '@angular/core';
import { IOption } from '../../app.constant';
import { cloneDeep } from '../../lodash-optimized';

/**
 * Shared utility for TDS and tax calculation logic
 * Used by advance-receipt-adjustment and adjust-payment-dialog components
 */
export class TdsTaxCalculationHelper {
    /**
     * To apply TDS tax
     *
     * @param event Select Tax event
     * @param adjustPayment Adjustment payment object
     * @param adjustVoucherForm Adjustment voucher form
     * @param giddhBalanceDecimalPlaces Decimal places for balance
     * @param tdsTypeBox Reference to TDS type box element
     * @param changeTdsAmountCallback Callback to handle TDS amount change
     * @returns Updated TDS amount
     */
    public static tdsTaxSelected(
        event: IOption,
        adjustPayment: any,
        adjustVoucherForm: any,
        giddhBalanceDecimalPlaces: number,
        tdsTypeBox: ElementRef,
        changeTdsAmountCallback: (amount: number) => void
    ): number {
        let tdsAmount = 0;
        if (event && event.additional && event.additional && event.additional.taxDetail && event.additional.taxDetail[0].taxValue && adjustPayment && adjustPayment.subTotal) {
            tdsAmount = cloneDeep(this.calculateTdsAmount(Number(adjustPayment.subTotal), Number(event.additional.taxDetail[0].taxValue), giddhBalanceDecimalPlaces));
            adjustVoucherForm.tdsTaxUniqueName = cloneDeep(event?.value);
            adjustVoucherForm.tdsAmount.amountForAccount = cloneDeep(tdsAmount);
            changeTdsAmountCallback(tdsAmount);
            tdsTypeBox?.nativeElement?.classList?.remove('error-box');
        }
        return tdsAmount;
    }

    /**
     * To add error box in case of amount 0
     *
     * @param event Value of amount
     * @param adjustVoucherForm Adjustment voucher form
     * @param tdsAmountBox Reference to TDS amount box element
     */
    public static changeTdsAmount(
        event: any,
        adjustVoucherForm: any,
        tdsAmountBox: ElementRef
    ): void {
        if (!Number(event) && adjustVoucherForm && adjustVoucherForm.tdsTaxUniqueName) {
            if (tdsAmountBox && tdsAmountBox.nativeElement) {
                tdsAmountBox.nativeElement.classList.add('error-box');
            }
        } else {
            /**
             * Handles if functionality
             */
            if (tdsAmountBox && tdsAmountBox.nativeElement) {
                tdsAmountBox.nativeElement.classList.remove('error-box');
            }
        }
    }

    /**
     * To check TDS section selected or not
     *
     * @param event Click event
     * @param adjustVoucherForm Adjustment voucher form
     */
    public static isTdsSelected(event: any, adjustVoucherForm: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            adjustVoucherForm.tdsAmount = {
                amountForAccount: null
            };
            adjustVoucherForm.tdsTaxUniqueName = '';
            adjustVoucherForm.description = '';
        } else {
            delete adjustVoucherForm['tdsAmount'];
            delete adjustVoucherForm['description'];
            delete adjustVoucherForm['tdsTaxUniqueName'];
        }
    }

    /**
     * Calculate inclusive tax amount based on tax rate
     *
     * @param productAmount Product's Amount with Tax
     * @param rate Tax %
     * @param giddhBalanceDecimalPlaces Decimal places for balance
     * @returns Inclusive Tax Amount
     */
    public static calculateInclusiveTaxAmount(productAmount: number, rate: number, giddhBalanceDecimalPlaces: number): number {
        let taxAmount: number = 0;
        let amount: number = 0;
        amount = cloneDeep(Number(productAmount));
        taxAmount = Number((amount * rate) / (rate + 100));
        return Number(taxAmount.toFixed(giddhBalanceDecimalPlaces));
    }

    /**
     * Calculate TDS amount based on TDS rate
     *
     * @param productAmount Product's Amount with Tax
     * @param rate Tax %
     * @param giddhBalanceDecimalPlaces Decimal places for balance
     * @returns Tds taxable Amount
     */
    public static calculateTdsAmount(productAmount: number, rate: number, giddhBalanceDecimalPlaces: number): number {
        let taxAmount: number = 0;
        let amount: number = 0;
        amount = cloneDeep(Number(productAmount));
        taxAmount = Number((amount * rate) / 100);
        return Number(taxAmount.toFixed(giddhBalanceDecimalPlaces));
    }
}
