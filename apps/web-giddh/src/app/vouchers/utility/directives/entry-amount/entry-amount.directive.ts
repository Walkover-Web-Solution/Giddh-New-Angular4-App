import { Directive, ElementRef, Input, OnChanges, OnDestroy, forwardRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { ReplaySubject, takeUntil } from "rxjs";
import { AppState } from "../../../../store";
import { giddhRoundOff } from "../../../../shared/helpers/helperFunctions";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    selector: '[entryAmount]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EntryAmountDirective),
            multi: true
        }
    ]
})
export class EntryAmountDirective implements OnChanges, OnDestroy {
    /** Default rate */
    @Input() public rate: number = 1;
    /** Default quantity */
    @Input() public quantity: number = 1;
    /** Default decimal places */
    private balanceDecimalPlaces: number = 2;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private elementRef: ElementRef
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
        const qtyRate = Number(this.quantity) * Number(this.rate);
        this.elementRef.nativeElement.value = giddhRoundOff(qtyRate, this.balanceDecimalPlaces);
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