import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges, ViewChild } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
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
    @Output() public isLoading: EventEmitter<boolean> = new EventEmitter();


    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private inventoryService: InventoryService,
    ) {
    }

    /**
     * On Component Init
     *
     * @memberof TextFieldComponent
     */
    public ngOnInit(): void {

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
 * This will use to save customised columns
 *
 * @memberof ReportFiltersComponent
 */
    public saveColumns(): void {
        setTimeout(() => {
            this.filteredDisplayColumns();
            let saveColumnReq = {
                module: this.moduleName,
                columns: this.displayedColumns
            }
            this.inventoryService.saveStockTransactionReportColumns(saveColumnReq).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading.emit(false);
            });
        });
    }

    /**
 * This will be used for filtering the display columns
 *
 * @memberof ReportFiltersComponent
 */
    public filteredDisplayColumns(): void {
        console.log(this.customiseColumns, this.displayedColumns);

        this.displayedColumns = this.customiseColumns?.filter(value => value?.checked).map(column => column?.value);
        this.selectedColumns.emit(this.displayedColumns);
        this.changeDetection.detectChanges();
    }


}
