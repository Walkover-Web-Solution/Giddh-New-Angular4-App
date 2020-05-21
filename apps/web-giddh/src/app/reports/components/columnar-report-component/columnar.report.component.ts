import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { select, Store } from '@ngrx/store';
import { takeUntil, take } from 'rxjs/operators';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { saveAs } from "file-saver";
import { IForceClear } from '../../../models/api-models/Sales';
import { ReportsDetailedRequestFilter } from '../../../models/api-models/Reports';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { BsDropdownDirective } from 'ngx-bootstrap';

@Component({
    selector: 'columnar-report-component',
    templateUrl: './columnar.report.component.html',
    styleUrls: ['./columnar.report.component.scss']
})

export class ColumnarReportComponent implements OnInit, OnDestroy {
    @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
    public fromMonthNames: any = [];
    public toMonthNames: any = [];
    public selectYear: any = [];
    public selectCrDr = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
    public flatGroupsOptions: any = [];
    private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public exportRequest: any = {};
    public companyUniqueName: string = '';
    public groupUniqueName: string = '';
    public isLoading: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearMonths$: Observable<IForceClear> = observableOf({ status: false });
    public fromMonth: any = '';
    public toMonth: any = '';
    public financialYearSelected: any;
    public activeFinancialYear: string = '';
    public activeFinancialYearLabel: string = '';
    /** API response object of columnar report */
    public columnarReportResponse: any;
    /** Columnar report table request params object */
    public getColumnarRequestModel: ReportsDetailedRequestFilter;
    /** report table pagination count constant */
    public paginationCount: number = PAGINATION_LIMIT;
    /** True, if request for show report  */
    public isShowColumnarReport: boolean = false;
    public datePickerOptions: any = {
        hideOnEsc: true,
        // parentEl: '#dateRangePickerParent',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year').subtract(9, 'year'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quater': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                moment().startOf('year').subtract(10, 'year'),
                moment().endOf('year').subtract(10, 'year')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    constructor(public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>, private toaster: ToasterService, private ledgerService: LedgerService, private generalService: GeneralService) {
        this.exportRequest.fileType = 'xls';
        this.exportRequest.balanceTypeAsSign = false;
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));

        this.flattenGroups$.subscribe(flattenGroups => {
            if (flattenGroups) {
                this.flatGroupsOptions = [];
                flattenGroups.forEach(key => {
                    this.flatGroupsOptions.push({ label: key.groupName, value: key.groupUniqueName });
                });
            }
        });

        this.store.pipe(takeUntil(this.destroyed$)).subscribe(state => {
            if (state.session && !this.activeFinancialYear) {
                this.companyUniqueName = _.cloneDeep(state.session.companyUniqueName);

                if (this.companyUniqueName && state.session.companies) {
                    let companies = _.cloneDeep(state.session.companies);
                    let comp = companies.find((c) => c.uniqueName === this.companyUniqueName);
                    if (comp) {
                        this.activeFinancialYear = comp.activeFinancialYear.uniqueName;
                        this.selectActiveFinancialYear();
                    }
                }
            }
        });
    }

    /**
     * Initializes the component
     *
     * @memberof ColumnarReportComponent
     */
    ngOnInit(): void {
        this.getColumnarRequestModel = new ReportsDetailedRequestFilter();
        this.getColumnarRequestModel.page = 1;
        this.getColumnarRequestModel.count = this.paginationCount;
        this.columnarReportResponse = null;
        this.getFinancialYears();
    }

    /**
     * This will get all existing financial years for the company
     *
     * @memberof ColumnarReportComponent
     */
    public getFinancialYears(): void {
        this.settingsFinancialYearService.GetAllFinancialYears().subscribe(res => {
            if (res && res.body && res.body.financialYears) {
                res.body.financialYears.forEach(key => {
                    let financialYearStarts = moment(key.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = moment(key.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    this.selectYear.push({ label: financialYearStarts + " - " + financialYearEnds, value: key });
                });
                this.selectActiveFinancialYear();
            }
        });
    }
    /**
     * Callback for group selection
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectGroup(event: any): void {
        this.groupUniqueName = event.value;
    }

    /**
     * This will export the report in excel sheet
     *
     * @memberof ColumnarReportComponent
     */
    public exportReport(isShowReport: boolean): void {
        if (!this.isLoading) {
            this.isLoading = true;
            this.isShowColumnarReport = isShowReport;
            if (this.fromMonth && this.toMonth) {
                let monthYear = [];
                let startDate = moment(new Date(this.fromMonth));
                let monthsCount = moment(new Date(this.toMonth)).diff(startDate, 'months');

                monthYear.push(moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MM-YYYY"));

                for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                    startDate = startDate.add(1, 'month');
                    monthYear.push(moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MM-YYYY"));
                }

                this.exportRequest.monthYear = monthYear;
            }
            if (isShowReport) {
                this.columnarReportResponse = null;
                this.exportRequest.page = this.getColumnarRequestModel.page;
                this.exportRequest.count = this.getColumnarRequestModel.count;
            }
            this.ledgerService.downloadColumnarReport(this.companyUniqueName, this.groupUniqueName, this.exportRequest, isShowReport).subscribe((res) => {
                this.isLoading = false;
                this.isShowColumnarReport = false;
                if (res.status === "success") {
                    if (isShowReport) {
                        this.columnarReportResponse = res.body;
                    } else {
                        let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                        return saveAs(blob, `ColumnarReport.xlsx`);
                    }
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(res.message);
                }
            });
        }
    }

    /**
     * Destroyes the data stored
     *
     * @memberof ColumnarReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    public hideListItems() {
        if (this.filterDropDownList.isOpen) {
            this.filterDropDownList.hide();
        }
    }
    /**
     * Callback for select year to prepare list of months
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectFinancialYear(event): void {
        if (event && event.value) {
            this.forceClearMonths$ = observableOf({ status: true });
            this.financialYearSelected = event.value;
            this.exportRequest.financialYear = moment(event.value.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");

            let financialYearStarts = moment(new Date(event.value.financialYearStarts.split("-").reverse().join("-")));
            let financialYearEnds = moment(new Date(event.value.financialYearEnds.split("-").reverse().join("-")));
            let startDate = financialYearStarts;
            let monthsCount = financialYearEnds.diff(financialYearStarts, 'months');

            this.fromMonthNames = [];
            this.toMonthNames = [];

            this.fromMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate() });
            this.toMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate() });

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.fromMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate() });
                this.toMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate() });
            }
        }
    }

    /**
     * Checks if form is valid
     *
     * @returns {boolean}
     * @memberof ColumnarReportComponent
     */
    public isFormValid(): boolean {
        if (this.exportRequest.financialYear && this.groupUniqueName) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Callback for select from month to update list of to months
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectFromMonth(event): void {
        if (event.value) {
            let fromMonth = moment(new Date(this.financialYearSelected.financialYearStarts.split("-").reverse().join("-")));
            let toMonth = moment(new Date(this.financialYearSelected.financialYearEnds.split("-").reverse().join("-")));
            let startDate = fromMonth;
            let monthsCount = toMonth.diff(fromMonth, 'months');
            this.toMonthNames = [];

            this.toMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) > startDate.toDate()) });

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.toMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) > startDate.toDate()) });
            }
        }
    }

    /**
     * Callback for select to month to update list of from months
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectToMonth(event): void {
        if (event.value) {
            let fromMonth = moment(new Date(this.financialYearSelected.financialYearStarts.split("-").reverse().join("-")));
            let toMonth = moment(new Date(this.financialYearSelected.financialYearEnds.split("-").reverse().join("-")));
            let startDate = fromMonth;
            let monthsCount = toMonth.diff(fromMonth, 'months');
            this.fromMonthNames = [];

            this.fromMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) < startDate.toDate()) });

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.fromMonthNames.push({ label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) < startDate.toDate()) });
            }
        }
    }

    /**
     * This will select the active financial year by default in dropdown
     *
     * @memberof ColumnarReportComponent
     */
    public selectActiveFinancialYear(): void {
        if (this.selectYear && this.selectYear.length > 0 && this.activeFinancialYear) {
            this.selectYear.forEach(key => {
                if (key.value.uniqueName === this.activeFinancialYear) {
                    this.selectFinancialYear(key);

                    let financialYearStarts = moment(key.value.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = moment(key.value.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    this.activeFinancialYearLabel = financialYearStarts + " - " + financialYearEnds;
                }
            });
        }
    }

    /**
   * To call API according to pagination
   *
   * @param {*} event Pagination page change event
   * @returns {void}
   * @memberof ColumnarReportComponent
   */
    public pageChanged(event: any): void {
        if (event && this.getColumnarRequestModel) {
            if (event && event.page === this.getColumnarRequestModel.page) {
                return;
            }
            this.getColumnarRequestModel.page = event.page;
            this.exportReport(true);
        }

    }

    /**
     * To clear applied filter
     *
     * @memberof ColumnarReportComponent
     */
    public clearFilter(): void {
        this.exportRequest = {};
        this.groupUniqueName = '';
        this.forceClear$ = observableOf({ status: true });
        this.forceClearMonths$ = observableOf({ status: true });
        this.fromMonthNames = [];
        this.toMonthNames = [];
        this.selectActiveFinancialYear();
        this.columnarReportResponse = null;
        this.exportRequest.balanceTypeAsSign = false;
    }
}
