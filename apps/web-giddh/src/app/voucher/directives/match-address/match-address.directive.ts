import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { ReplaySubject, takeUntil } from "rxjs";
import { giddhRoundOff } from "../../../../shared/helpers/helperFunctions";

@Directive({
    selector: '[matchAddress]'
})
export class MatchAddressDirective implements OnChanges, OnDestroy {
    @Input() public address: any;
    @Input() public selectedAddres: any;
    @Output() public matchedAddress: EventEmitter<boolean> = new EventEmitter<boolean>();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {}

    public ngOnChanges(): void {
        const isMatched = this.isAddressMatched();
        this.matchedAddress.emit(isMatched);
    }

    private isAddressMatched(): boolean {
        // Add your logic here to determine if the address matches the billing details
        // For example, you can compare specific fields like address.line1, state, etc.
        console.log(this.address, this.selectedAddres)
        return ((this.address.address === this.selectedAddres.address[0]) || (this.address.state?.name === this.selectedAddres.state?.name)|| (this.address.gstNumber === this.selectedAddres.gstNumber));
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}