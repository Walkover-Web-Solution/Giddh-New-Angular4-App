import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { ToasterService } from "../../services/toaster.service";

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
    /** Holds inventory type module  */
    @Input() public moduleType: string = "";
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
        if (changes?.moduleType?.currentValue !== changes?.moduleType?.previousValue) {
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
            let saveColumnReq = {
                module: this.moduleType,
                columns: this.displayedColumns
            }
            this.commonService.saveSelectedTableColumns(saveColumnReq).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.body && response.status === 'success') {
                    this.isLoading.emit(false);
                } else {
                    this.toaster.errorToast(response?.message);
                    this.isLoading.emit(false);
                }
            });
        });
    }

    /**
     * This will be used for filtering the display columns
     *
     * @memberof SelectTableColumnComponent
     */
    public filteredDisplayColumns(): void {
        this.displayedColumns = this.customiseColumns?.filter(value => value?.checked).map(column => column?.value);
        this.selectedColumns.emit(this.displayedColumns);
        this.changeDetection.detectChanges();
    }

    /**
    * This will get customised columns
    *
    * @memberof SelectTableColumnComponent
    */
    public getSelectedColumns(): void {
        this.commonService.getSelectedTableColumns(this.moduleType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                if (response.body.columns) {
                    const displayColumnsSet = new Set(response.body.columns);
                    this.customiseColumns.forEach(column => column.checked = displayColumnsSet.has(column.value));
                }
            }
            this.filteredDisplayColumns();
        });
    }


}
