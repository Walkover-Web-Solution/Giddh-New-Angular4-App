import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { saveAs } from "file-saver";
import { IForceClear } from '../../../models/api-models/Sales';
import { ReportsDetailedRequestFilter } from '../../../models/api-models/Reports';
import { API_COUNT_LIMIT, BootstrapToggleSwitch, PAGINATION_LIMIT } from '../../../app.constant';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { GroupService } from '../../../services/group.service';

@Component({
    selector: 'columnar-report-component',
    templateUrl: './columnar.report.component.html',
    styleUrls: ['./columnar.report.component.scss']
})

export class ColumnarReportComponent implements OnInit, OnDestroy {
    public fromMonthNames: any = [];
    public toMonthNames: any = [];
    public selectYear: any = [];
    public selectCrDr = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
    public flatGroupsOptions: any = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public exportRequest: any = {};
    public companyUniqueName: string = '';
    public groupUniqueName: string = '';
    public isLoading: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearMonths$: Observable<IForceClear> = observableOf({ status: false });
    public fromMonth: any = null;
    public toMonth: any = null;
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
    /** To check cr/dr or +/- checked */
    public isBalanceTypeAsSign: boolean = false;
    /** Stores the search results pagination details for group dropdown */
    public groupsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for group dropdown */
    public defaultGroupSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for group dropdown */
    public preventDefaultGroupScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for group dropdown */
    public defaultGroupPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;

    constructor(
        public settingsFinancialYearService: SettingsFinancialYearService,
        private store: Store<AppState>,
        private toaster: ToasterService,
        private ledgerService: LedgerService,
        private generalService: GeneralService,
        private groupService: GroupService
    ) {
        this.exportRequest.fileType = 'xls';
        this.exportRequest.balanceTypeAsSign = false;
        this.exportRequest.showHideOpeningClosingBalance = false;
    }

    /**
     * Initializes the component
     *
     * @memberof ColumnarReportComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && !this.activeFinancialYear) {
                this.companyUniqueName = activeCompany.uniqueName;
                if(activeCompany.activeFinancialYear) {
                    this.activeFinancialYear = activeCompany.activeFinancialYear.uniqueName;
                    this.selectActiveFinancialYear();
                }
            }
        });

        this.getColumnarRequestModel = new ReportsDetailedRequestFilter();
        this.getColumnarRequestModel.page = 1;
        this.getColumnarRequestModel.count = this.paginationCount;
        this.columnarReportResponse = null;
        this.getFinancialYears();
        this.loadDefaultGroupsSuggestions();
    }

    /**
     * This will get all existing financial years for the company
     *
     * @memberof ColumnarReportComponent
     */
    public getFinancialYears(): void {
        this.settingsFinancialYearService.GetAllFinancialYears().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res && res.body && res.body.financialYears) {
                res.body.financialYears.forEach(key => {
                    let financialYearStarts = dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
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
                let startDate = dayjs(new Date(this.fromMonth));
                let monthsCount = dayjs(new Date(this.toMonth)).diff(startDate, 'months');

                monthYear.push(dayjs(startDate.toDate()).format("MM-YYYY"));

                for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                    startDate = startDate.add(1, 'month');
                    monthYear.push(dayjs(startDate.toDate()).format("MM-YYYY"));
                }

                this.exportRequest.monthYear = monthYear;
            }
            if (isShowReport) {
                this.columnarReportResponse = null;
                this.exportRequest.page = this.getColumnarRequestModel.page;
                this.exportRequest.count = this.getColumnarRequestModel.count;
            }
            this.ledgerService.downloadColumnarReport(this.companyUniqueName, this.groupUniqueName, this.exportRequest, isShowReport).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;
                this.isShowColumnarReport = false;
                if (res.status === "success") {
                    if (isShowReport) {
                        this.columnarReportResponse = res.body;
                    } else {
                        let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                        return saveAs(blob, this.localeData?.downloaded_filename);
                    }
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(res.message);
                }
            });
        }
    }

    /**
     * To balance type sign changed in +/- to Cr/Dr
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public onBalanceTypeAsSignChanged(event): void {
        this.isBalanceTypeAsSign = event;
        this.exportRequest.balanceTypeAsSig = event;
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
            this.exportRequest.financialYear = dayjs(event.value.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");

            let financialYearStarts = dayjs(new Date(event.value.financialYearStarts.split("-").reverse().join("-")));
            let financialYearEnds = dayjs(new Date(event.value.financialYearEnds.split("-").reverse().join("-")));
            let startDate = financialYearStarts;
            let monthsCount = financialYearEnds.diff(financialYearStarts, 'months');

            this.fromMonthNames = [];
            this.toMonthNames = [];

            this.fromMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate() });
            this.toMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate() });

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.fromMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate() });
                this.toMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate() });
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
            let fromMonth = dayjs(new Date(this.financialYearSelected.financialYearStarts.split("-").reverse().join("-")));
            let toMonth = dayjs(new Date(this.financialYearSelected.financialYearEnds.split("-").reverse().join("-")));
            let startDate = fromMonth;
            let monthsCount = toMonth.diff(fromMonth, 'months');
            this.toMonthNames = [];

            this.toMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) > startDate.toDate()) });

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.toMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) > startDate.toDate()) });
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
            let fromMonth = dayjs(new Date(this.financialYearSelected.financialYearStarts.split("-").reverse().join("-")));
            let toMonth = dayjs(new Date(this.financialYearSelected.financialYearEnds.split("-").reverse().join("-")));
            let startDate = fromMonth;
            let monthsCount = toMonth.diff(fromMonth, 'months');
            this.fromMonthNames = [];

            this.fromMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) < startDate.toDate()) });

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.fromMonthNames.push({ label: dayjs(startDate.toDate()).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) < startDate.toDate()) });
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

                    let financialYearStarts = dayjs(key.value.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = dayjs(key.value.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
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
        this.fromMonth = null;
        this.toMonth = null;
        this.forceClear$ = observableOf({ status: true });
        this.forceClearMonths$ = observableOf({ status: true });
        this.fromMonthNames = [];
        this.toMonthNames = [];
        this.selectActiveFinancialYear();
        this.columnarReportResponse = null;
        this.exportRequest.balanceTypeAsSign = false;
        this.exportRequest.showHideOpeningClosingBalance = false;
        this.isBalanceTypeAsSign = false;
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ColumnarReportComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: API_COUNT_LIMIT,
            }
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name}`,
                            additional: result.parentGroups
                        }
                    }) || [];
                    if (page === 1) {
                        this.flatGroupsOptions = searchResults;
                    } else {
                        this.flatGroupsOptions = [
                            ...this.flatGroupsOptions,
                            ...searchResults
                        ];
                    }
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.flatGroupsOptions = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof ColumnarReportComponent
     */
    public handleGroupScrollEnd(): void {
        if (this.groupsSearchResultsPaginationData.page < this.groupsSearchResultsPaginationData.totalPages) {
            this.onGroupSearchQueryChanged(
                this.groupsSearchResultsPaginationData.query,
                this.groupsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.groupsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: `${result.name}`,
                                additional: result.parentGroups
                            }
                        }) || [];
                        this.defaultGroupSuggestions = this.defaultGroupSuggestions.concat(...results);
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default group list for advance search
     *
     * @private
     * @memberof ColumnarReportComponent
     */
    private loadDefaultGroupsSuggestions(): void {
        this.onGroupSearchQueryChanged('', 1, (response) => {
            this.defaultGroupSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: `${result.name}`,
                    additional: result.parentGroups
                }
            }) || [];
            this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
            this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
            this.flatGroupsOptions = [...this.defaultGroupSuggestions];
        });
    }
}