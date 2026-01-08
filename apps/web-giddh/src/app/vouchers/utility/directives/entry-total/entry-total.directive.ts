import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { ReplaySubject, takeUntil } from "rxjs";
import { AppState } from "../../../../store";
import { giddhRoundOff } from "../../../../shared/helpers/helperFunctions";
import { isEqual } from "apps/web-giddh/src/app/lodash-optimized";

@Directive({
    selector: '[entryTotal]'
})
export class EntryTotalDirective implements OnChanges, OnDestroy {
    /** Entry */
    @Input() public entry: any;
    /** True if need to exclude tax */
    @Input() public excludeTax: boolean;
    /** Callback to emit calculated amount */
    @Output() public calculatedAmount: EventEmitter<any> = new EventEmitter<any>();
    /** Default decimal places */
    private balanceDecimalPlaces: number = 2;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>
    ) {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.balanceDecimalPlaces) {
                this.balanceDecimalPlaces = response.balanceDecimalPlaces;
            } else {
                this.balanceDecimalPlaces = 2;
            }
        });
    }

    /**
     * Lifecycle hook for input value change
     *
     * @memberof EntryAmountDirective
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if ((!isEqual(changes?.entry?.currentValue, changes?.entry?.previousValue) || !isEqual(changes?.excludeTax?.currentValue, changes?.excludeTax?.previousValue)) && this.entry?.calculateTotal) {
            let amount = 0;
            
            if (this.excludeTax) {
                amount = giddhRoundOff((Number(this.entry.transactions[0].amount?.amountForAccount) - Number(this.entry.totalDiscount)), this.balanceDecimalPlaces);
            } else {
                amount = giddhRoundOff((Number(this.entry.transactions[0].amount?.amountForAccount) - Number(this.entry.totalDiscount)) + (Number(this.entry.totalTax)), this.balanceDecimalPlaces);
            }
            this.calculatedAmount.emit(amount);
        }
    }

    /**
     * Lifecycle hook for directive destroy
     *
     * @memberof EntryAmountDirective
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}