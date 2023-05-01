import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GeneralService } from "../../services/general.service";
import { PurchaseOrderService } from "../../services/purchase-order.service";
import { ToasterService } from "../../services/toaster.service";

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
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        public purchaseOrderService: PurchaseOrderService,
        private generalService: GeneralService,
        private toaster: ToasterService
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

    /**
     * This will call api to bulk convert po to pb
     *
     * @memberof BulkConvertComponent
     */
    public convertPoToBill(): void {
        let selectedPo = [];

        selectedPo = this.selectedPo?.map(po => {
            po.poUniqueName = undefined;
            return po;
        });

        this.isLoading = true;

        this.purchaseOrderService.bulkUpdate({ companyUniqueName: this.generalService.companyUniqueName, action: 'create_purchase_bill' }, { purchaseOrders: this.selectedPo }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toaster.successToast(response?.body);
                this.closeModelEvent.emit(true);
            } else {
                this.toaster.errorToast(response?.message);
            }
            this.isLoading = false;
        });
    }
}