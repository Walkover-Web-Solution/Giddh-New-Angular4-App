import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { CompanyActions } from "../../../actions/company.actions";
import { CompanyService } from "../../../services/company.service";
import { ReportsModel, ReportsRequestModel } from "../../../models/api-models/Reports";
import { ToasterService } from "../../../services/toaster.service";
import { createSelector } from "reselect";
import { takeUntil, filter, take } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject } from "rxjs";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { CompanyResponse, ActiveFinancialYear } from '../../../models/api-models/Company';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ExportBodyRequest } from '../../../models/api-models/DaybookRequest';
import { LedgerService } from '../../../services/ledger.service';
import { BranchHierarchyType } from '../../../app.constant';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { ColumnDefinition } from '../../../shared/common-table/giddh-table.component.const';
import { DurationEnum } from '../../constants/reports.constant';
import { cloneDeep } from '../../../lodash-optimized';
@Component({
    selector: 'reports-details-component',
    templateUrl: './report.details.component.html',
    styleUrls: ['./report.details.component.scss']
})
export class ReportsDetailsComponent implements OnInit, OnDestroy {
    public reportRespone: ReportsModel[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeFinacialYr: ActiveFinancialYear;
    public salesRegisterTotal: ReportsModel = new ReportsModel();
    public monthNames = [];
    /** Selected duration type */
    public selectedType: DurationEnum = DurationEnum.Monthly;
    private selectedMonth: string;
    public dateRange: Date[];
    public dayjs = dayjs;
    public financialOptions: IOption[] = [];
    public selectedCompany: CompanyResponse;
    private interval: any;
    public currentActiveFinacialYear: IOption = { label: '', value: '' };
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /* This will hold if it's mobile screen or not */
    public isMobileScreen: boolean = false;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /**
     * Configuration for table columns.
     * 
     * Each key represents a column, and its value is an array with the following structure:
     * 
     * [0] Header Name (string): The label to be displayed in the table header, often tied to localization keys.
     * [1] Visibility (boolean): Determines if the column should be shown (true) or hidden (false).
     * [2] Give Class (string): This class is applied to the header, footer, and secondary header.
     * [3] Clickable (boolean): Defines whether the column data is clickable (true) or static (false).
     */
    public columnDefinitions: Record<string, ColumnDefinition> = {
        particular: ["app_particular", true, "", true],
        sales: ["app_sales", true, "text-right"],
        returns: ["app_return", false, "text-right"],
        taxTotal: ["net_tax", false, "text-right"],
        discountTotal: ["net_discount", false, "text-right"],
        tcsTotal: ["net_tcs", false, "text-right"],
        tdsTotal: ["net_tds", false, "text-right"],
        netSales: ["net_sales", false, "text-right"],
        cumulative: ["app_cumulative", false, "text-right"]
    }
    /** Constant for duration */
    public durationEnum: typeof DurationEnum = DurationEnum;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private companyService: CompanyService,
        private _toaster: ToasterService,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService,
        private breakPointObservar: BreakpointObserver,
        private changeDetectorRef: ChangeDetectorRef,
        private ledgerService: LedgerService) {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    ngOnInit() {
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });

        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.router.events.pipe(
            filter(event => (event instanceof NavigationStart && !(event.url.includes('/reports/sales-register') || event.url.includes('/reports/sales-detailed-expand')))),
            takeUntil(this.destroyed$)).subscribe(() => {
                // Reset the chosen financial year when user leaves the module
                this.store.dispatch(this.companyActions.resetUserChosenFinancialYear());
            });
        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch?.name,
                    value: branch?.uniqueName,
                    name: branch?.name,
                    parentBranch: branch?.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                if (!this.currentBranch || !this.currentBranch?.uniqueName) {
                    let currentBranchUniqueName;
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                } else {
                    const selectedBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === this.currentBranch?.uniqueName));
                    if (selectedBranch) {
                        this.currentBranch.name = selectedBranch.name;
                        this.currentBranch.alias = selectedBranch.alias;
                    } else {
                        // Company was selected from the branch dropdown
                        this.currentBranch.name = this.activeCompany?.name;
                    }
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    }

    public goToDashboard() {
        this.router.navigate(['/pages/reports']);
    }

    public filterReportResp(response) {
        let reportModelArray = [];
        let index = 1;
        let indexMonths = 0;
        let weekCount = 1;
        let reportsModelCombined: ReportsModel = new ReportsModel();
        _.forEach(response, (item) => {
            let reportsModel: ReportsModel = new ReportsModel();
            reportsModel.sales = item.creditTotal;
            reportsModel.returns = item.debitTotal;
            reportsModel.taxTotal = item.taxTotal;
            reportsModel.discountTotal = item.discountTotal;
            reportsModel.tcsTotal = item.tcsTotal;
            reportsModel.tdsTotal = item.tdsTotal;
            reportsModel.netSales = (item.balance.type === "DEBIT") ? Number("-" + item.balance.amount) : item.balance.amount;
            reportsModel.cumulative = (item.closingBalance.type === "DEBIT") ? Number("-" + item.closingBalance.amount) : item.closingBalance.amount;
            reportsModel.from = item.from;
            reportsModel.to = item.to;
            reportsModel.interval = this.interval;
            reportsModel.selectedMonth = this.selectedMonth;

            let mdyFrom = item.from.split('-');
            let mdyTo = item.to.split('-');
            let dateDiff = this.datediff(this.parseDate(mdyFrom), this.parseDate(mdyTo));
            if (dateDiff <= 8) {
                this.setSalesRegisterTotal(item);
                this.salesRegisterTotal.particular = this.selectedMonth + " " + mdyFrom[2];
                reportsModel.particular = this.commonLocaleData?.app_week + '' + weekCount++;
                reportModelArray.push(reportsModel);
            } else if (dateDiff <= 31) {
                this.setSalesRegisterTotal(item);
                reportsModel.particular = this.monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2];
                indexMonths++;
                reportsModelCombined.sales += item.creditTotal;
                reportsModelCombined.returns += item.debitTotal;
                reportsModelCombined.taxTotal += item.taxTotal;
                reportsModelCombined.discountTotal += item.discountTotal;
                reportsModelCombined.tcsTotal += item.tcsTotal;
                reportsModelCombined.tdsTotal += item.tdsTotal;
                reportsModelCombined.netSales += (item.balance.type === "DEBIT") ? Number("-" + item.balance.amount) : item.balance.amount;
                reportsModelCombined.cumulative = (item.closingBalance.type === "DEBIT") ? Number("-" + item.closingBalance.amount) : item.closingBalance.amount;
                reportsModelCombined.interval = this.interval;
                reportsModelCombined.selectedMonth = this.selectedMonth;
                reportModelArray.push(reportsModel);
                if (indexMonths % 3 === 0) {
                    reportsModelCombined.particular = this.commonLocaleData?.app_quarter + ' ' + indexMonths / 3;
                    reportsModelCombined.reportType = 'combined';
                    reportModelArray.push(reportsModelCombined);

                    reportsModelCombined = new ReportsModel();
                }
            } else if (dateDiff <= 93) {
                this.setSalesRegisterTotal(item);
                reportsModel.particular = this.formatParticular(mdyTo, mdyFrom, index, this.monthNames);
                reportModelArray.push(reportsModel);
                index++;
            }
        });
        return reportModelArray;
    }

    // new Date("dateString") is browser-dependent and discouraged, so we'll write
    // a simple parse function for U.S. date format (which does no error checking)
    public parseDate(mdy) {
        return new Date(mdy[2], mdy[1], mdy[0]);
    }

    public datediff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    public setCurrentFY() {
        let financialYearChosenInReportUniqueName = '';
        let currentBranchUniqueName = '';
        let currentTimeFilter: DurationEnum = this.selectedType;

        this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
            if (params?.interval || params?.selectedMonth) {
                this.selectedType = params.interval;
                this.interval = params.interval;
                this.selectedMonth = params.selectedMonth;

                this.router.navigate(['pages', 'reports', 'sales-register']);
            }
        });

        // set financial years based on company financial year
        this.store.pipe(select(createSelector([(state: AppState) => state.session.activeCompany, (state: AppState) => state.session.registerReportFilters], (activeCompany, registerReportFilters) => {
            financialYearChosenInReportUniqueName = registerReportFilters ? registerReportFilters.financialYearChosenInReport : '';
            currentBranchUniqueName = registerReportFilters ? registerReportFilters.branchChosenInReport : '';
            currentTimeFilter = registerReportFilters?.timeFilter?.toLowerCase() ?? '';
            return activeCompany;
        })), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
                this.financialOptions = activeCompany.financialYears.map(response => {
                    if (response) {
                        return { label: response.uniqueName, value: response.uniqueName };
                    }
                });
                let selectedFinancialYear, activeFinancialYear, uniqueNameToSearch;
                if (financialYearChosenInReportUniqueName) {
                    // User is navigating back from details page hence show the selected filter as pre-filled
                    uniqueNameToSearch = financialYearChosenInReportUniqueName;
                } else {
                    uniqueNameToSearch = (activeCompany.activeFinancialYear) ? activeCompany.activeFinancialYear.uniqueName : "";
                }
                selectedFinancialYear = this.financialOptions.find(p => p?.value === uniqueNameToSearch);
                activeFinancialYear = this.selectedCompany.financialYears.find(p => p?.uniqueName === uniqueNameToSearch);
                this.activeFinacialYr = activeFinancialYear;
                if (!this.activeFinacialYr && this.selectedCompany.financialYears?.length) {
                    this.activeFinacialYr = this.selectedCompany.financialYears[0];
                    selectedFinancialYear = this.selectedCompany.financialYears[0];
                }
                if (selectedFinancialYear) {
                    this.currentActiveFinacialYear = cloneDeep(selectedFinancialYear);
                }
                this.currentBranch.uniqueName = currentBranchUniqueName ?? this.currentBranch?.uniqueName ?? "";
                const foundBranch = this.currentCompanyBranches?.find(branch => branch?.value === this.currentBranch?.uniqueName);
                this.currentBranch.name = foundBranch ? foundBranch.name : this.currentBranch?.name;   
                this.selectedType = currentTimeFilter || this.selectedType;
                this.populateRecords(this.selectedType, this.selectedMonth);
                this.salesRegisterTotal.particular = this.activeFinacialYr?.uniqueName;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    public selectFinancialYearOption(v: IOption) {
        if (v?.value) {
            let financialYear = this.selectedCompany.financialYears.find(p => p?.uniqueName === v?.value);
            this.activeFinacialYr = financialYear;
            this.populateRecords(this.interval, this.selectedMonth);
        }
    }
    public populateRecords(interval, month?) {
        this.interval = interval;
        if (this.activeFinacialYr) {
            let startDate = this.activeFinacialYr.financialYearStarts?.toString();
            let endDate = this.activeFinacialYr.financialYearEnds?.toString();
            if (month) {
                this.selectedMonth = month;
                let startEndDate = this.getDateFromMonth(this.monthNames?.indexOf(this.selectedMonth) + 1);
                startDate = startEndDate.firstDay;
                endDate = startEndDate.lastDay;
            } else {
                this.selectedMonth = null;
            }
            this.selectedType = interval?.charAt(0)?.toUpperCase() + interval?.slice(1);

            if (this.currentOrganizationType === OrganizationType.Branch) {
                if (!this.currentBranch) {
                    this.currentBranch = {};
                }
                this.currentBranch.uniqueName = this.generalService.currentBranchUniqueName;
            }

            let request: ReportsRequestModel = {
                to: endDate,
                from: startDate,
                interval: interval,
                branchUniqueName: (this.currentBranch ? this.currentBranch.uniqueName : "")
            }
            this.companyService.getSalesRegister(request).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'error') {
                    this._toaster.errorToast(res?.message);
                } else {
                    this.salesRegisterTotal = new ReportsModel();
                    this.salesRegisterTotal.particular = this.activeFinacialYr?.uniqueName;
                    this.reportRespone = this.filterReportResp(res?.body);
                }
            });
            this.savePreferences();
        }
    }
    public formatParticular(mdyTo, mdyFrom, index, monthNames) {
        return this.commonLocaleData?.app_quarter + ' ' + index + " (" + monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2] + "-" + monthNames[parseInt(mdyTo[1]) - 1] + " " + mdyTo[2] + ")";
    }

    public bsValueChange(event: any) {
        if (event) {
            let request: ReportsRequestModel = {
                to: dayjs(event[1]).format(GIDDH_DATE_FORMAT),
                from: dayjs(event[0]).format(GIDDH_DATE_FORMAT),
                interval: this.durationEnum.Monthly,
                branchUniqueName: (this.currentBranch ? this.currentBranch.uniqueName : "")
            }
            this.companyService.getSalesRegister(request).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'error') {
                    this._toaster.errorToast(res?.message);
                } else {
                    this.salesRegisterTotal = new ReportsModel();
                    this.salesRegisterTotal.particular = this.activeFinacialYr?.uniqueName;
                    this.reportRespone = this.filterReportResp(res?.body);
                }
            });

        }
    }

    public getDateFromMonth(selectedMonth) {
        let firstDay = '', lastDay = '';
        if (this.activeFinacialYr) {
            let mdyFrom = this.activeFinacialYr.financialYearStarts?.split('-');
            let mdyTo = this.activeFinacialYr.financialYearEnds?.split('-');

            let startDate;

            if (mdyFrom[1] > selectedMonth) {
                startDate = '01-' + (selectedMonth - 1) + '-' + mdyTo[2];
            } else {
                startDate = '01-' + (selectedMonth - 1) + '-' + mdyFrom[2];
            }
            let startDateSplit = startDate.split('-');
            let dt = new Date(startDateSplit[2], startDateSplit[1], startDateSplit[0]);
            // GET THE MONTH AND YEAR OF THE SELECTED DATE.
            let month = (dt.getMonth() + 1)?.toString(),
                year = dt.getFullYear();

            if (parseInt(month) < 10) {
                month = '0' + month;
            }
            firstDay = '01-' + (month) + '-' + year;
            lastDay = new Date(year, parseInt(month), 0).getDate() + '-' + month + '-' + year;
        }

        return { firstDay, lastDay };
    }

    /**
     * Branch change handler
     *
     * @memberof ReportsDetailsComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.populateRecords(this.interval, this.selectedMonth);
    }

    /**
     * Saves the user preference for filters
     *
     * @private
     * @memberof ReportsDetailsComponent
     */
    private savePreferences(): void {
        this.store.dispatch(this.companyActions.setUserChosenFinancialYear({
            financialYear: this.currentActiveFinacialYear?.value, branchUniqueName: (this.currentBranch ? this.currentBranch.uniqueName : ""), timeFilter: this.selectedType
        }));
    }

    /**
     * Calculates the sales register total
     *
     * @private
     * @param {*} transaction Sales transaction
     * @memberof ReportsDetailsComponent
     */
    private setSalesRegisterTotal(transaction: any): void {
        const item = _.cloneDeep(transaction);
        this.salesRegisterTotal.sales += item.creditTotal;
        this.salesRegisterTotal.returns += item.debitTotal;
        this.salesRegisterTotal.taxTotal += item.taxTotal;
        this.salesRegisterTotal.discountTotal += item.discountTotal;
        this.salesRegisterTotal.tcsTotal += item.tcsTotal;
        this.salesRegisterTotal.tdsTotal += item.tdsTotal;
        this.salesRegisterTotal.netSales += (item.balance.type === "DEBIT") ? Number("-" + item.balance.amount) : item.balance.amount;
        this.salesRegisterTotal.cumulative = (item.closingBalance.type === "DEBIT") ? Number("-" + item.closingBalance.amount) : item.closingBalance.amount;
        this.salesRegisterTotal.interval = this.interval;
        this.salesRegisterTotal.selectedMonth = this.selectedMonth;
        this.showColum();
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof ReportsDetailsComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.monthNames = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];
            this.setCurrentFY();
            this.getSelectedDuration();
        }
    }

    /**
     * Releases memory
     *
     * @memberof PurchaseRegisterExpandComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will return duration name
     *
     * @returns {string}
     * @memberof ReportsDetailsComponent
     */
    public getSelectedDuration(): string {
        if (this.selectedType?.toLowerCase() === "monthly") {
            return this.commonLocaleData?.app_duration?.monthly;
        } else if (this.selectedType?.toLowerCase() === "quarterly") {
            return this.commonLocaleData?.app_duration?.quarterly;
        } else if (this.selectedType?.toLowerCase() === "weekly") {
            return this.commonLocaleData?.app_duration?.weekly;
        }
    }

    /**
     * Exports sales register overview report
     *
     * @memberof ReportsDetailsComponent
     */
    public export(): void {
        let startDate = this.activeFinacialYr?.financialYearStarts?.toString();
        let endDate = this.activeFinacialYr?.financialYearEnds?.toString();
        if (this.selectedMonth) {
            let startEndDate = this.getDateFromMonth(this.monthNames?.indexOf(this.selectedMonth) + 1);
            startDate = startEndDate.firstDay;
            endDate = startEndDate.lastDay;
        }

        let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
        exportBodyRequest.from = startDate;
        exportBodyRequest.to = endDate;
        exportBodyRequest.exportType = "SALES_REGISTER_OVERVIEW_EXPORT";
        exportBodyRequest.fileType = "CSV";
        exportBodyRequest.interval = this.interval;
        exportBodyRequest.branchUniqueName = this.currentBranch?.uniqueName;
        this.ledgerService.exportData(exportBodyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this._toaster.successToast(response?.body);
                this.router.navigate(["/pages/downloads"]);
            } else {
                this._toaster.errorToast(response?.message);
            }
        });
    }

    /**
     * Updates the visibility of table columns based on specific conditions.
     *
     * @memberof ReportsDetailsComponent
     */
    public showColum(): void {
        Object.keys(this.columnDefinitions).filter((key) => !['sales', 'particular'].includes(key)).forEach((key) => {
            if (['tcsTotal', 'tdsTotal'].includes(key)) {
                this.columnDefinitions[key][1] = this.isTcsTdsApplicable && this.salesRegisterTotal[key];
            } else {
                this.columnDefinitions[key][1] = !!this.salesRegisterTotal[key];
            }
        });
    }

    /**
     * Navigates to the detailed sales report page with query parameters.
     *
     * @param {ReportsModel} item - The report item containing date ranges and filters.
     * @memberof ReportsDetailsComponent
     */
    public goToDetailedSales(item: ReportsModel) {
        let from = item.from;
        let to = item.to;

        if (from != null && to != null) {
            this.router.navigate(['pages', 'reports', 'sales-detailed-expand'], { queryParams: { from: from, to: to, branchUniqueName: this.currentBranch?.uniqueName, interval: item.interval, selectedMonth: item.selectedMonth } });
        }
    }
}
