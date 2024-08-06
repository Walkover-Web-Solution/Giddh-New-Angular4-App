import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { ReplaySubject, takeUntil } from "rxjs";
import { AppState } from "../../../../store";
import { giddhRoundOff } from "../../../../shared/helpers/helperFunctions";

@Directive({
    selector: '[entryAmount]'
})
export class EntryAmountDirective implements OnChanges, OnDestroy {
    @Input() public calculateAmount: boolean = true;
    /** Default rate */
    @Input() public rate: number = 0;
    /** Default quantity */
    @Input() public quantity: number = 0;
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
    public ngOnChanges(): void {
        if (this.calculateAmount) {
            const qtyRate = Number(this.quantity) * Number(this.rate);
            const amount = giddhRoundOff(qtyRate, this.balanceDecimalPlaces);
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