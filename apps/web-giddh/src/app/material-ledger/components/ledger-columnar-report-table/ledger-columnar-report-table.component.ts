import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest } from '../../../models/api-models/Ledger';
import { ReportsDetailedRequestFilter, ColumnarResponseResult } from '../../../models/api-models/Reports';
import { PAGINATION_LIMIT } from '../../../app.constant';

@Component({
    selector: 'ledger-columnar-report-table',
    templateUrl: './ledger-columnar-report-table.component.html',
    styleUrls: ['./ledger-columnar-report-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LedgerColumnarReportTableComponent implements OnInit, OnDestroy, OnChanges {
    /** Company unique name */
    public companyUniqueName: string = '';
    /** Export ledger request body */
    @Input() public columnarReportExportRequest: ExportLedgerRequest;
    /** Account unique name */
    @Input() public accountUniquename: string;
    /** directives to emit true if back clicked or API break */
    @Output() public backClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Columnar report table request params object */
    public getColumnarRequestModel: ReportsDetailedRequestFilter;
    /** Columnar table rsponse */
    public reportResponse: any;
    /** Columnar table rsponse result array data*/
    public reportResponseResult: ColumnarResponseResult[];
    /** Columns name for table  */
    public columnarTableColumn: string[] = [];
    /** Loader for API request */
    public isLoading: boolean = true;
    /** pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Subject to destroy all observers  */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the dynamic colspan value */
    public colspanValue: number = 0;
    /** Columns to display in table */
    public tableHeadingColumns: string[] = [];

    constructor(
        public settingsFinancialYearService: SettingsFinancialYearService,
        private store: Store<AppState>,
        private toaster: ToasterService,
        private ledgerService: LedgerService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.tableHeadingColumns = this.getDefaultColumns();
        this.store.pipe(takeUntil(this.destroyed$)).subscribe(state => {
            if (state && state.session && state.session.companyUniqueName) {
                this.companyUniqueName = _.cloneDeep(state.session.companyUniqueName);
            }
        });
    }

    /**
     * Initializes the component
     *
     * @memberof ColumnarReportTableComponent
     */
    public ngOnInit(): void {
        this.getColumnarRequestModel = new ReportsDetailedRequestFilter();
        this.getColumnarRequestModel.page = 1;
        this.getColumnarRequestModel.count = this.paginationLimit;
        this.getColumnarReportTable(this.columnarReportExportRequest);
    }

    /**
     *  Life cycle hook for data-bound property of a directive changed
     *
     * @returns {void}
     * @param {SimpleChanges} changes
     * @memberof LedgerColumnarReportTableComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['columnarReportExportRequest'] && changes['columnarReportExportRequest'].currentValue) {
            this.columnarReportExportRequest = changes['columnarReportExportRequest'].currentValue;
        }
    }

    /**
     * Destroyes the data stored
     *
     * @returns {void}
     * @memberof LedgerColumnarReportTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * API call to get columnar report table
     *
     * @returns {void}
     * @param {*} columnarReq Request model
     * @memberof LedgerColumnarReportTableComponent
     */
    public getColumnarReportTable(columnarReq: ExportLedgerRequest): void {
        let body = {
            balanceTypeAsSign: columnarReq.balanceTypeAsSign
        }
        this.getColumnarRequestModel.from = columnarReq.from;
        this.getColumnarRequestModel.to = columnarReq.to;
        this.getColumnarRequestModel.sort = columnarReq.sort;
        this.getColumnarRequestModel.branchUniqueName = columnarReq.branchUniqueName;
        this.isLoading = true;
        this.ledgerService.exportLedgerColumnarReportTable(this.getColumnarRequestModel, this.companyUniqueName, this.accountUniquename, body).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.status === 'success') {
                if (response.body && response.body.results) {
                    this.reportResponse = response.body;
                    this.reportResponseResult = response.body.results;
                    if (response.body.results.length) {
                        this.prepareColumnForTable();
                    }
                    this.colspanValue = this.getTotalNoOfColumn();
                    this.changeDetectorRef.detectChanges();
                }
            } else {
                this.backClick.emit(true);
                this.toaster.showSnackBar("error", response.message);
            }
        });
    }

    /**
     *  To prepare extra columns for table
     *
     * @returns {void}
     * @memberof LedgerColumnarReportTableComponent
     */
    public prepareColumnForTable(): void {
        this.columnarTableColumn = [];
        this.tableHeadingColumns = this.getDefaultColumns();
        if (this.reportResponseResult && this.reportResponseResult.length > 0) {
            this.reportResponseResult.forEach((item, index) => {
                if (item && item.accountNameAndBalanceMap) {
                    let columns = Object.keys(item.accountNameAndBalanceMap);
                    if (columns && columns.length > 0) {
                        columns.forEach((element) => {
                            if (element && this.columnarTableColumn.indexOf(element) === -1) {
                                this.columnarTableColumn.push(element);
                                this.tableHeadingColumns.push(element);
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * To get total number of column as column is dynamic
     *
     * @returns {number} Length of array
     * @memberof LedgerColumnarReportTableComponent
     */
    public getTotalNoOfColumn(): number {
        return (this.columnarTableColumn ? this.columnarTableColumn.length : 0) + 16;
    }

    /**
     * To call API according to pagination
     *
     * @param {*} event Pagination page change event
     * @returns {void}
     * @memberof LedgerColumnarReportTableComponent
     */
    public pageChanged(event: any): void {
        if (event && this.columnarReportExportRequest) {
            if (event && event.page === this.getColumnarRequestModel.page) {
                return;
            }
            this.getColumnarRequestModel.page = event.page;
            this.getColumnarReportTable(this.columnarReportExportRequest);
        }

    }

    /**
     * Tracks the entry by Entry ID
     *
     * @param {*} index Index of current entry
     * @param {*} entry Entry data
     * @return {*}  {string} Entry ID
     * @memberof LedgerColumnarReportTableComponent
     */
    public trackByEntryId(index: any, entry: any): string {
        return entry?.entryId;
    }

    /**
     * Returns the default columns for report
     *
     * @private
     * @return {*}  {Array<string>}
     * @memberof LedgerColumnarReportTableComponent
     */
    private getDefaultColumns(): Array<string> {
        return ['sno', 'date', 'particular', 'address', 'voucher_type', 'voucher_number', 'voucher_refno', 'voucher_refdate', 'tax_number', 'narration', 'stock_name', 'quantity', 'unit', 'rate', 'value', 'gross_total'];
    }
}
