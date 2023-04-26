import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PurchaseOrderService } from "../../services/purchase-order.service";

@Component({
    selector: "bulk-convert",
    templateUrl: "./bulk-convert.component.html",
    styleUrls: ["./bulk-convert.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkConvertComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** List of selected po */
    @Input() public selectedPo: any[] = [];
    /* Emitter for filters */
    @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter();
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        public purchaseOrderService: PurchaseOrderService
    ) {

    }

    public ngOnInit(): void {

    }

    /**
     * This will emit false on cancel
     *
     * @memberof BulkConvertComponent
     */
    public onCancel(): void {
        this.closeModelEvent.emit(false);
    }

    /**
     * Releases the memory
     *
     * @memberof BulkConvertComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public convertPoToBill(): void {
        const vendorUniqueName = this.selectedPo[0]?.vendorUniqueName;

        let selectedPo = [];

        selectedPo = this.selectedPo?.map(po => {
            return po.poUniqueName;
        });

        console.log(selectedPo);

        // this.purchaseOrderService.convertPurchaseOrderToBill({ accountUniqueName: vendorUniqueName }, this.selectedPo).pipe(takeUntil(this.destroyed$)).subscribe(response => {

        // });
    }
}