import { Directive, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { HIGH_RATE_FIELD_PRECISION } from "apps/web-giddh/src/app/app.constant";
import { SalesOtherTaxesCalculationMethodEnum } from "apps/web-giddh/src/app/models/api-models/Sales";
import { giddhRoundOff } from "apps/web-giddh/src/app/shared/helpers/helperFunctions";
import { VoucherTypeEnum } from "../../vouchers.const";

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[entryOtherTax]',
    standalone:false
})
/**
 * EntryOtherTaxDirective directive
 * Implements EntryOtherTaxDirective functionality
 */
export class EntryOtherTaxDirective implements OnChanges {
    /** Entry */
    @Input() public entry: any;
    /** Callback to emit calculated amount */
    @Output() public calculatedAmount: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Lifecycle hook for input value change
     *
     * @memberof EntryOtherTaxDirective
     */
    public ngOnChanges(): void {
        /**
         * Handles if functionality
         */
        if (this.entry.voucherType === VoucherTypeEnum.receipt || this.entry.voucherType === VoucherTypeEnum.payment) {
            return;
        }
        let taxableValue = 0;

        /**
         * Handles if functionality
         */
        if (this.entry.otherTax) {
            /**
             * Handles if functionality
             */
            if (this.entry.otherTax?.calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue = Number(this.entry.transactions[0].amount.amountForAccount) - this.entry.totalDiscount;
            } else {
                taxableValue = Number(this.entry.transactions[0].amount.amountForAccount) - this.entry.totalDiscount + this.entry.totalTaxWithoutCess + this.entry.totalCess;
            }

            const amount = giddhRoundOff(((taxableValue * this.entry.otherTax?.taxValue) / 100), HIGH_RATE_FIELD_PRECISION);

            this.calculatedAmount.emit(amount);
        } else {
            this.calculatedAmount.emit(0);
        }
    }
}