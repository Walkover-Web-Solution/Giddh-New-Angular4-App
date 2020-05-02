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

    // public reportTableData: any = {
    //     status: "success",
    //     body: {
    //         page: 1,
    //         count: 50,
    //         totalPages: 20,
    //         totalItems: 8,
    //         results: [
    //             {
    //                 entryId: 129,
    //                 accountId: 214,
    //                 date: "04-04-2020",
    //                 baseAccount: "Cash",
    //                 address: null,
    //                 voucherType: "sales",
    //                 voucherNumber: "5",
    //                 voucherRefNo: null,
    //                 voucherRefDate: "",
    //                 taxNumber: null,
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "100.00 dr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Sales: "100.00 cr"
    //                 }
    //             },
    //             {
    //                 entryId: 125,
    //                 accountId: 214,
    //                 date: "04-04-2020",
    //                 baseAccount: "Cash",
    //                 address: null,
    //                 voucherType: "sales",
    //                 voucherNumber: "1",
    //                 voucherRefNo: null,
    //                 voucherRefDate: "",
    //                 taxNumber: null,
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "100.00 dr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Sales: "100.00 cr"
    //                 }
    //             },
    //             {
    //                 entryId: 126,
    //                 accountId: 214,
    //                 date: "04-04-2020",
    //                 baseAccount: "Cash",
    //                 address: null,
    //                 voucherType: "sales",
    //                 voucherNumber: "2",
    //                 voucherRefNo: null,
    //                 voucherRefDate: "",
    //                 taxNumber: null,
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "100.00 dr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Sales: "100.00 cr"
    //                 }
    //             },
    //             {
    //                 entryId: 128,
    //                 accountId: 214,
    //                 date: "04-04-2020",
    //                 baseAccount: "Cash",
    //                 address: null,
    //                 voucherType: "sales",
    //                 voucherNumber: "4",
    //                 voucherRefNo: null,
    //                 voucherRefDate: "",
    //                 taxNumber: null,
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "100.00 dr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Sales: "100.00 cr"
    //                 }
    //             },
    //             {
    //                 entryId: 127,
    //                 accountId: 214,
    //                 date: "04-04-2020",
    //                 baseAccount: "Cash",
    //                 address: null,
    //                 voucherType: "sales",
    //                 voucherNumber: "3",
    //                 voucherRefNo: null,
    //                 voucherRefDate: "",
    //                 taxNumber: null,
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "110.00 dr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Sales: "100.00 cr",
    //                     GST: "10.00 cr"
    //                 }
    //             },
    //             {
    //                 entryId: 132,
    //                 accountId: 226,
    //                 date: "07-04-2020",
    //                 baseAccount: "debb1",
    //                 address: "",
    //                 voucherType: "receipt",
    //                 voucherNumber: "1",
    //                 voucherRefNo: "RCPT-20200407-1",
    //                 voucherRefDate: "07-04-2020",
    //                 taxNumber: "",
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "1000.00 cr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Cash: "1000.00 dr"
    //                 }
    //             },
    //             {
    //                 entryId: 141,
    //                 accountId: 235,
    //                 date: "14-04-2020",
    //                 baseAccount: "abudebb",
    //                 address: "",
    //                 voucherType: "receipt",
    //                 voucherNumber: "2",
    //                 voucherRefNo: "RCPT-20200414-1",
    //                 voucherRefDate: "14-04-2020",
    //                 taxNumber: "",
    //                 narration: "",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "18706.05 cr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Cash: "18706.05 dr"
    //                 }
    //             },
    //             {
    //                 entryId: 144,
    //                 accountId: 235,
    //                 date: "15-04-2020",
    //                 baseAccount: "abudebb",
    //                 address: "",
    //                 voucherType: "payment",
    //                 voucherNumber: "2",
    //                 voucherRefNo: null,
    //                 voucherRefDate: "",
    //                 taxNumber: "",
    //                 narration: "This is the refund entry of advance receipt number RCPT-20200414-1.",
    //                 stockName: null,
    //                 quantity: "",
    //                 stockUnitCode: null,
    //                 rate: null,
    //                 value: null,
    //                 grossTotal: "100.00 dr",
    //                 balance: null,
    //                 accountNameAndAmountMap: null,
    //                 accountNameAndBalanceMap: {
    //                     Cash: "100.00 cr"
    //                 }
    //             }
    //         ],
    //         size: 8,
    //         fromDate: "04-04-2020",
    //         toDate: "18-04-2020",
    //         openingBalance: {
    //             amount: 0,
    //             type: "DEBIT"
    //         },
    //         closingBalance: {
    //             amount: 0,
    //             type: "DEBIT"
    //         },
    //         debitTotal: 0,
    //         creditTotal: 0
    //     }
    // };

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
     * @memberof LedgerColumnarReportTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * API call to get columnar report table
     *
     * @param {*} columnarReq Request model
     * @memberof LedgerColumnarReportTableComponent
     */
    public getColumnarReportTable(columnarReq: ExportLedgerRequest) {
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
     * @memberof LedgerColumnarReportTableComponent
     */
    public prepareColumnForTable() {
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
     * @memberof LedgerColumnarReportTableComponent
     */
    public getTotalNoOfColumn() {
        return this.columnarTableColumn.length + 16;
    }
}
