import { Directive, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { HIGH_RATE_FIELD_PRECISION } from "apps/web-giddh/src/app/app.constant";
import { SalesOtherTaxesCalculationMethodEnum } from "apps/web-giddh/src/app/models/api-models/Sales";
import { giddhRoundOff } from "apps/web-giddh/src/app/shared/helpers/helperFunctions";

@Directive({
    selector: '[entryOtherTax]'
})
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
        let taxableValue = 0;

        if (this.entry.otherTax) {
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