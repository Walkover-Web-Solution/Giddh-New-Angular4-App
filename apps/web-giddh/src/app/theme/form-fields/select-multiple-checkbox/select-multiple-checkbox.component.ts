import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges, ViewChild } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { InventoryService } from "../../../services/inventory.service";

const noop = () => {
};

@Component({
    selector: "select-multiple-checkbox",
    styleUrls: ["./select-multiple-checkbox.component.scss"],
    templateUrl: "./select-multiple-checkbox.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleCheckboxComponent implements OnInit, OnChanges, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds module name for customised columns */
    @Input() public moduleName: string = "";
    /** Holds default columns list for customised columns */
    @Input() public customiseColumns: any[] = [];
    /** Holds inventory type module  */
    @Input() public moduleType: string = "";
    /** Holds mat tooltip position  */
    @Input() public matTooltipPosition: string = "";
    /** Holds mat tooltip name  */
    @Input() public matTooltip: string = "";
    /** Emits the loading value */
    @Output() public isLoading: EventEmitter<boolean> = new EventEmitter();
    /** Emits the selected filters */
    @Output() public selectedColumns: EventEmitter<any> = new EventEmitter();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for stock report displayed columns */
    public displayedColumns: string[] = [];

    constructor(
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
    ) {
    }

    /**
     * On Component Init
     *
     * @memberof TextFieldComponent
     */
    public ngOnInit(): void {
        this.getReportColumns();
    }

    /**
     * On Change of input properties
     *
     * @memberof TextFieldComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
    }

    /**
     * Releases the memory on component destroy
     *
     * @memberof TextFieldComponent
     */
    public ngOnDestroy() {
    }

    /**
     *This will use to save customised columns
     *
     * @memberof SelectMultipleCheckboxComponent
     */
    public saveColumns(): void {
        setTimeout(() => {
            this.filteredDisplayColumns();
            let saveColumnReq = {
                module: this.moduleType,
                columns: this.displayedColumns
            }
            this.inventoryService.saveStockTransactionReportColumns(saveColumnReq).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading.emit(false);
            });
        });
    }

    /**
    * This will use to select all customised columns
    *
    * @param {*} event
    * @memberof SelectMultipleCheckboxComponent
    */
    public selectAllColumns(event: any): void {
        this.customiseColumns?.forEach(column => {
            if (column) {
                column.checked = event;
            }
        });
        this.filteredDisplayColumns();
        this.saveColumns();
        this.changeDetection.detectChanges();
    }

    /**
     * This will be used for filtering the display columns
     *
     * @memberof SelectMultipleCheckboxComponent
     */
    public filteredDisplayColumns(): void {
        this.displayedColumns = this.customiseColumns?.filter(value => value?.checked).map(column => column?.value);
        this.selectedColumns.emit(this.displayedColumns);
        this.changeDetection.detectChanges();
    }

    /**
    * This will get customised columns
    *
    * @memberof SelectMultipleCheckboxComponent
    */
    public getReportColumns(): void {
        this.inventoryService.getStockTransactionReportColumns(this.moduleType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                if (response.body?.columns) {
                    this.customiseColumns?.forEach(column => {
                        if (!response.body.columns?.includes(column?.value)) {
                            column.checked = false;
                        }
                    });
                }
            }
            this.filteredDisplayColumns();
        });
    }


}
