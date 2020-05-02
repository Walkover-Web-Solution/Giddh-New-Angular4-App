import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { select, Store } from '@ngrx/store';
import { takeUntil, take, single } from 'rxjs/operators';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest } from '../../../models/api-models/Ledger';
import { ReportsDetailedRequestFilter, ColumnarResponseResult } from '../../../models/api-models/Reports';
import { PAGINATION_LIMIT } from '../../../app.constant';

@Component({
    selector: 'ledger-columnar-report-table',
    templateUrl: './ledger.columnar.report.table.component.html',
    styleUrls: ['./ledger.columnar.report.table.component.scss']
})

export class LedgerColumnarReportTableComponent implements OnInit, OnDestroy, OnChanges {
    /** Company unique name */
    public companyUniqueName: string = '';
    /** Export ledger request body */
    @Input() public columnarReportExportRequest: ExportLedgerRequest;
    /** Account unique name */
    @Input() public accountUniquename: string;
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
    /** Subject to destroye all observers  */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>, private toaster: ToasterService, private ledgerService: LedgerService, private generalService: GeneralService) {
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
    ngOnInit(): void {
        this.getColumnarRequestModel = new ReportsDetailedRequestFilter();
        this.getColumnarRequestModel.page = 1;
        this.getColumnarRequestModel.count = PAGINATION_LIMIT;
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
        this.isLoading = true;
        this.ledgerService.ExportLedgerColumnarReportTable(this.getColumnarRequestModel, this.companyUniqueName, this.accountUniquename, body).subscribe(response => {
            this.isLoading = false;
            if (response && response.status === 'success') {
                if (response.body && response.body.results) {
                    this.reportResponse = response.body;
                    this.reportResponseResult = response.body.results;
                    if (response.body.results.length) {
                        this.prepareColumnForTable();
                    }
                }
            } else {
                this.toaster.errorToast(response.message);
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
        let newColumns = [];
        this.reportResponseResult.forEach((item, index) => {
            if (item && item.accountNameAndBalanceMap) {
                let columns = Object.keys(item.accountNameAndBalanceMap);

                columns.forEach((element) => {
                    if (this.columnarTableColumn.indexOf(element) === -1) {
                        this.columnarTableColumn.push(element);
                    }
                });
            }
        });
    }

    /**
     * To get total number of column as column is dynamic
     *
     * @returns {number} Length of array
     * @memberof LedgerColumnarReportTableComponent
     */
    public getTotalNoOfColumn(): number {
        return this.columnarTableColumn.length + 16;
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

}
