import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { ToasterService } from "../../services/toaster.service";
import { InventoryModuleName } from "../../new-inventory/inventory.enum";
import { ContactsTab } from "../../contact/contacts.enum";
import { VoucherReportFilterModuleEnum } from "../../vouchers/utility/vouchers.const";
@Component({
    selector: "select-table-column",
    styleUrls: ["./select-table-column.component.scss"],
    templateUrl: "./select-table-column.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTableColumnComponent implements OnInit, OnChanges {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds default columns list for customised columns */
    @Input() public customiseColumns: any[] = [];
    /** Holds default columns list for customised columns */
    @Input() public dynamicCustomColumns: any[] = [];
    /** Holds inventory type module  */
    @Input() public moduleType: string = "";
    /** Holds module name for customised columns */
    @Input() public moduleName: string = "";
    /** Holds mat tooltip position  */
    @Input() public matTooltipPosition: string = "";
    /** Holds mat tooltip name  */
    @Input() public matTooltip: string = "";
    /** CSS class name to add on the field */
    @Input() public cssClass: string = "";
    /** CSS class name to add on the field */
    @Input() public iconClass: string = "";
    /** Inner html add on the field */
    @Input() public buttonText: string = "";
    /** Observable to subscribe refresh columns */
    @Input() public refreshColumnsSubject: Subject<void>;
    /** CSS Class for Mat Menu */
    @Input() public additionalMenuCssClass: string = "";
    /** Emits the selected filters */
    @Output() public selectedColumns: EventEmitter<any> = new EventEmitter();
    /** Emits the refresh column change filters */
    @Output() public refreshColumnsChange: EventEmitter<boolean> = new EventEmitter();
    /** Emits true if api call in progress */
    @Output() public isLoading: EventEmitter<boolean> = new EventEmitter();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for stock report displayed columns */
    public displayedColumns: string[] = [];
    /** Emits the selected custom fields filters */
    @Output() public selectedDynamicColumns: EventEmitter<any> = new EventEmitter();
    /** Get checked columns length */
    public get checkedColumnsCount(): boolean {
        return this.dynamicCustomColumns.filter(col => col?.checked).length == 2;
    }
    /** Get dynamic module types */
    public dynamicModuleTypes: Set<string> = new Set([
        InventoryModuleName.stock,
        InventoryModuleName.variant,
        InventoryModuleName.bulk,
        InventoryModuleName.fixedAssetInventory,
        ContactsTab.customer,
        ContactsTab.vendor,
        VoucherReportFilterModuleEnum.Sales,
        VoucherReportFilterModuleEnum.Estimate,
        VoucherReportFilterModuleEnum.Proforma,
        VoucherReportFilterModuleEnum.CreditNote,
        VoucherReportFilterModuleEnum.DebitNote,
        VoucherReportFilterModuleEnum.Receipt,
        VoucherReportFilterModuleEnum.Payment,
        VoucherReportFilterModuleEnum.Purchase,
        VoucherReportFilterModuleEnum.PurchaseOrder
    ]);
    /** Get dynamic mode */
    public get isDynamicMode(): boolean {
        return this.dynamicModuleTypes.has(this.moduleType);
    }

    constructor(
        private changeDetection: ChangeDetectorRef,
        private commonService: CommonService,
        private toaster: ToasterService
    ) {
    }

    /**
     * On Component Init
     *
     * @memberof SelectTableColumnComponent
     */
    public ngOnInit(): void {
        this.refreshColumnsSubject?.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.filteredDisplayColumns();
        });
    }

    /**
     * On Change of input properties
     *
     * @memberof SelectTableColumnComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.moduleType?.currentValue !== changes?.moduleType?.previousValue || changes?.moduleName?.currentValue !== changes?.moduleName?.previousValue) {
            this.getSelectedColumns();
        }
    }

    /**
     *This will use to save customised columns
     *
     * @memberof SelectTableColumnComponent
     */
    public saveSelectedColumns(): void {
        setTimeout(() => {
            this.filteredDisplayColumns();
            const saveColumnReq = {
                module: this.moduleType,
                ...(this.isDynamicMode
                    ? { reportFilterColumns: this.dynamicCustomColumns }
                    : { columns: this.displayedColumns })
            };
            this.commonService
                .saveSelectedTableColumns(saveColumnReq)
                .pipe(takeUntil(this.destroyed$))
                .subscribe(response => {
                    this.isLoading.emit(false);
                    if (!(response?.status === 'success' && response.body)) {
                        this.toaster.errorToast(response?.message);
                    }
                });
        }, 200);
    }

    /**
     * This will use for on key down enter
     *
     * @param {*} item
     * @return {*}  {void}
     * @memberof SelectTableColumnComponent
     */
    public onKeydownEnter(item: any): void {
        if (!(item?.checked && this.displayedColumns.length <= 2)) {
            item.checked = !item.checked;
            this.saveSelectedColumns();
        }
    }

    /**
     * This will be used for filtering the display columns
     *
     * @memberof SelectTableColumnComponent
     */
    public filteredDisplayColumns(): void {
        this.displayedColumns = this.customiseColumns
            .filter(col => col?.checked)
            .map(col => col.value);
        this.selectedColumns.emit(this.displayedColumns);
        this.selectedDynamicColumns.emit(this.dynamicCustomColumns);
        this.changeDetection.detectChanges();
    }

    /**
    * This will get customised columns
    *
    * @memberof SelectTableColumnComponent
    */
    public getSelectedColumns(): void {
        const isDynamic = this.isDynamicMode;
        this.dynamicCustomColumns = [];
        this.commonService
            .getSelectedTableColumns(this.moduleType, isDynamic)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                const { status, body } = response || {};
                if (isDynamic && status === 'success' && body?.reportFilterColumns) {
                    this.dynamicCustomColumns = body.reportFilterColumns || [];
                } else if (!isDynamic && body?.columns) {
                    const displayColumnsSet = new Set(body.columns);
                    this.customiseColumns.forEach(column => {
                        column.checked = displayColumnsSet.has(column.value);
                    });
                }
                this.filteredDisplayColumns();
            });
    }
}
