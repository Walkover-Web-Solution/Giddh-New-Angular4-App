import { ChangeDetectorRef, Component, computed, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { CompanyActions } from "../../../actions/company.actions";
import { GeneralActions } from "../../../actions/general/general.actions";
import { CompanyService } from "../../../services/company.service";
import { PurchaseReportsModel, ReportsRequestModel } from "../../../models/api-models/Reports";
import { ToasterService } from "../../../services/toaster.service";
import { createSelector } from "reselect";
import { takeUntil, filter, take, skip, debounceTime, tap, distinctUntilChanged } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject } from "rxjs";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MMM_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { CompanyResponse, ActiveFinancialYear } from '../../../models/api-models/Company';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';
import { ExportBodyRequest } from '../../../models/api-models/DaybookRequest';
import { LedgerService } from '../../../services/ledger.service';
import { API_BULK_FETCH_LIMIT, ASIDE_PANE_CONFIG, BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, IOption } from '../../../app.constant';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { ColumnDefinition } from '../../../shared/common-table/giddh-table.component.const';
import { DurationEnum } from '../../constants/reports.constant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SalesPersonComponentStore } from '../../../shared/sales-person/utility/sales-person.store';
import { SalesPersonComponent } from '../../../shared/sales-person/sales-person.component';
import { MatDialog } from '@angular/material/dialog';
import { ReportsComponentStore } from '../reports.store';
import { GroupBy } from '../../constants/reports.constant';
import { cloneDeep, find, forEach, get, includes, indexOf, keys, map, slice } from '../../../lodash-optimized';
@Component({
    selector: 'purchase-register-component',
    templateUrl: './purchase.register.component.html',
    styleUrls: ['./purchase.register.component.scss'],
    providers: [ReportsComponentStore, SalesPersonComponentStore],
    standalone: false
})
export class PurchaseRegisterComponent implements OnInit, OnDestroy {
    /** Directive to get reference of element */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    bsValue = new Date();
    public reportRespone: PurchaseReportsModel[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeFinacialYr: ActiveFinancialYear;
    public purchaseRegisterTotal: PurchaseReportsModel = new PurchaseReportsModel();
    public monthNames = [];
    /** Selected duration type */
    public selectedType: DurationEnum = DurationEnum.Monthly;
    private selectedMonth: string;
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
        purchase: ["app_purchase", true, "text-right"],
        returns: ["app_return", false, "text-right"],
        taxTotal: ["app_tax", false, "text-right"],
        discountTotal: ["app_discount", false, "text-right"],
        tcsTotal: ["app_tcs", false, "text-right"],
        tdsTotal: ["app_tds", false, "text-right"],
        netPurchase: ["app_net_purchase", false, "text-right"],
        cumulative: ["app_cumulative", false, "text-right"]
    }
    /** Constant for duration */
    public durationEnum: typeof DurationEnum = DurationEnum;
    /** Group by options */
    public groupByOptions: IOption[] = [];
    /** Sales Person List */
    public salesPersonList$: Observable<any> = this.salesPersonStore.salesPersonList$;
    /** This will use for instance of sales person Dropdown */
    public salesPerson: FormControl = new FormControl();
    /** This will use for instance of account Dropdown */
    public account: FormControl = new FormControl();
    /** Country list */
    public countryList = signal<IOption[]>([]);
    /** State list */
    public stateList = signal<IOption[]>([]);
    /** This will use for instance of country search */
    public countrySearch: FormControl = new FormControl();
    /** Filtered Country List */
    public filteredCountryList = signal<IOption[]>([]);
    /** This will use for instance of state search */
    public stateSearch: FormControl = new FormControl();
    /** Filtered State List */
    public filteredStateList = signal<IOption[]>([]);
    /** Filtered Sales Person List */
    public filteredSalesPersonList = signal<IOption[]>([]);
    /** Group by enum */
    public groupByEnum: typeof GroupBy = GroupBy;
    /** Date range */
    public dateRange: { from: any, to: any } = { from: null, to: null };
    /** Account search response */
    public accountSearchResponse: any[] = [];
    /** Account list */
    public accountList$: Observable<any[]> = this.componentStore.accountList$;
    /** Sales Register List */
    public salesRegisterList$: Observable<any[]> = this.componentStore.salesPurchaseList$;
    /** Holds report form */
    public reportForm: FormGroup = new FormGroup({
        groupBy: new FormControl<GroupBy>(GroupBy.Duration, Validators.required),
        accountUniqueNames: new FormControl<string[]>([]),
        salesPersonUniqueNames: new FormControl<string[]>([]),
        interval: new FormControl<DurationEnum | null>(null),
        countryCode: new FormControl<string | null>(null),
        countryCodes: new FormControl<string[]>([]),
        stateCodes: new FormControl<string[]>([])
    });
    /** Holds selected date range */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Supported groupBy values for export functionality */
    public supportedExportGroupBy = signal<GroupBy[]>([GroupBy.Duration]);
    /** Current groupBy value selected in the report form */
    public currentGroupBy = signal<GroupBy>(GroupBy.Duration);
    /** Computed signal that determines if export button should be visible based on current groupBy */
    public showExport = computed(() => {
        const currentGroupBy = this.currentGroupBy();
        return this.supportedExportGroupBy().includes(currentGroupBy);
    });

constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private companyService: CompanyService,
        private _toaster: ToasterService,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService,
        private changeDetectorRef: ChangeDetectorRef,
        private ledgerService: LedgerService,
        private dialog: MatDialog,
        private componentStore: ReportsComponentStore,
        private salesPersonStore: SalesPersonComponentStore,
        private generalActions: GeneralActions) {
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
            filter(event => (event instanceof NavigationStart && !(event.url.includes('/reports/purchase-register') || event.url.includes('/reports/purchase-detailed-expand')))),
            takeUntil(this.destroyed$)).subscribe(() => {
                // Reset the chosen financial year when user leaves the module
                this.store.dispatch(this.companyActions.resetUserChosenFinancialYear());
            });

        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.salesRegisterList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.purchaseRegisterTotal = new PurchaseReportsModel();
                this.purchaseRegisterTotal.particular = this.getCustomParticular();
                this.reportRespone = this.filterReportResp(response);
                this.changeDetectorRef.detectChanges();
            }
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
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                } else {
                    const selectedBranch = cloneDeep(response.find(branch => branch?.uniqueName === this.currentBranch?.uniqueName));
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

        this.getSalesPersonList();
        this.salesPersonList$.pipe(skip(1), take(1), filter(Boolean)).subscribe(res => {
            this.filteredSalesPersonList.set(res as IOption[]);
        });

        /** Search for sales person dropdown */
        this.salesPerson.valueChanges.pipe(debounceTime(700),
            takeUntil(this.destroyed$), distinctUntilChanged()).subscribe((search: string) => {
                if (!search) {
                    this.salesPersonList$.pipe(take(1)).subscribe(res => {
                        this.filteredSalesPersonList.set(res as IOption[]);
                    });
                } else {
                    this.salesPersonList$.pipe(take(1)).subscribe(res => {
                        this.filteredSalesPersonList.set(res?.filter(salesPerson => salesPerson?.label?.toLowerCase()?.includes(search?.toLowerCase())) as IOption[]);
                    });
                }
            });
        this.getAccounts();

        /** Search for account dropdown */
        this.account.valueChanges.pipe(debounceTime(700),
            takeUntil(this.destroyed$), distinctUntilChanged()).subscribe((search: string) => {
                this.getAccounts(search ? search : '');
            });

        /** Load countries on init */
        this.loadCountries();

        /** Search for country dropdown */
        this.countrySearch.valueChanges.pipe(debounceTime(700),
            takeUntil(this.destroyed$), distinctUntilChanged()).subscribe((search: string) => {
                if (!search) {
                    this.filteredCountryList.set(this.countryList());
                } else {
                    this.filteredCountryList.set(this.countryList()?.filter(country => country?.label?.toLowerCase()?.includes(search?.toLowerCase())));
                }
            });

        /** Search for state dropdown */
        this.stateSearch.valueChanges.pipe(debounceTime(700),
            takeUntil(this.destroyed$), distinctUntilChanged()).subscribe((search: string) => {
                if (!search) {
                    this.filteredStateList.set(this.stateList());
                } else {
                    this.filteredStateList.set(this.stateList()?.filter(state => state?.label?.toLowerCase()?.includes(search?.toLowerCase())));
                }
            });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.selectedDateRange = { startDate: dayjs(response[0]), endDate: dayjs(response[1]) };
                this.selectedDateRangeUi = dayjs(response[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.store.pipe(
            select(state => state.general.states),
            filter(Boolean),
            takeUntil(this.destroyed$)
        ).subscribe(states => {
            if (states && (states.stateList ?? states.countyList)) {
                this.stateList.set((states.stateList ?? states.countyList).map(state => ({
                    label: state.name,
                    value: state.code
                })));
                this.filteredStateList.set(this.stateList());
            }
        });

        // Subscribe to countryCode changes to automatically load states
        this.reportForm.get('countryCode')?.valueChanges.pipe(
            filter(Boolean),
            takeUntil(this.destroyed$)
        ).subscribe(countryCode => {
            if (countryCode) {
                this.loadStates(countryCode);
            } else {
                this.stateList.set([]);
                this.filteredStateList.set([]);
            }
        });
    }
    /**
     * Handle group by change
     *
     * @param response
     */
    public handleGroupByChange(response: IOption): void {
        this.reportForm.get('salesPersonUniqueNames')?.setValue([]);
        this.reportForm.get('countryCode')?.setValue(null);
        this.reportForm.get('countryCodes')?.setValue([]);
        this.reportForm.get('stateCodes')?.setValue([]);

        if (response?.value && response.value !== GroupBy.Duration) {
            this.dateRange.from = dayjs(this.selectedDateRange?.startDate).format(GIDDH_DATE_FORMAT);
            this.dateRange.to = dayjs(this.selectedDateRange?.endDate).format(GIDDH_DATE_FORMAT);
            if (response.value === GroupBy.State) {
                this.reportForm.get('countryCode')?.setValue(this.activeCompany.countryV2?.alpha2CountryCode);
            }
            this.getPurchaseRegister(this.dateRange.from, this.dateRange.to);
        } else if (response?.value === GroupBy.Duration) {
            this.populateRecords(this.interval, this.selectedMonth);
        }
    }

    public goToDashboard() {
        this.router.navigate(['/pages/reports']);
    }

    public filterReportResp(response) {
        let reportModelArray = [];
        let index = 1;
        let indexMonths = 0;
        let weekCount = 1;
        let reportsModelCombined: PurchaseReportsModel = new PurchaseReportsModel();
        forEach(response, (item) => {
            let reportsModel: PurchaseReportsModel = new PurchaseReportsModel();
            reportsModel.purchase = item.debitTotal;
            reportsModel.returns = item.creditTotal;
            reportsModel.taxTotal = item.taxTotal;
            reportsModel.discountTotal = item.discountTotal;
            reportsModel.tcsTotal = item.tcsTotal;
            reportsModel.tdsTotal = item.tdsTotal;
            reportsModel.netPurchase = (item.balance.type === "CREDIT") ? Number("-" + item.balance.amount) : item.balance.amount;
            reportsModel.cumulative = (item.closingBalance.type === "CREDIT") ? Number("-" + item.closingBalance.amount) : item.closingBalance.amount;
            reportsModel.from = item.from;
            reportsModel.to = item.to;
            reportsModel.interval = this.interval;
            reportsModel.selectedMonth = this.selectedMonth;
            reportsModel.salesPerson = item.salesPerson;

            let mdyFrom = item.from.split('-');
            let mdyTo = item.to.split('-');
            let dateDiff = this.datediff(this.parseDate(mdyFrom), this.parseDate(mdyTo));
            if (item?.stateName) {
                this.setPurchaseRegisterTotal(item);
                reportsModel.particular = item.stateName
                reportsModel.stateCode = item.stateCode;
                reportModelArray.push(reportsModel);
            } else if (item?.countryName) {
                this.setPurchaseRegisterTotal(item);
                reportsModel.countryCode = item.countryCode;
                reportsModel.particular = item.countryName
                reportModelArray.push(reportsModel);
            } else if (item?.salesPerson?.name) {
                this.setPurchaseRegisterTotal(item);
                reportsModel.particular = item.salesPerson.name
                reportModelArray.push(reportsModel);
            } else if (dateDiff <= 8) {
                this.setPurchaseRegisterTotal(item);
                this.purchaseRegisterTotal.particular = this.selectedMonth + " " + mdyFrom[2];
                reportsModel.particular = this.commonLocaleData?.app_week + weekCount++;
                reportModelArray.push(reportsModel);
            } else if (dateDiff <= 31) {
                this.setPurchaseRegisterTotal(item);
                reportsModel.particular = this.monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2];
                indexMonths++;
                reportsModelCombined.purchase += item.debitTotal;
                reportsModelCombined.returns += item.creditTotal;
                reportsModelCombined.taxTotal += item.taxTotal;
                reportsModelCombined.discountTotal += item.discountTotal;
                reportsModelCombined.tcsTotal += item.tcsTotal;
                reportsModelCombined.tdsTotal += item.tdsTotal;
                reportsModelCombined.netPurchase += (item.balance.type === "CREDIT") ? Number("-" + item.balance.amount) : item.balance.amount;
                reportsModelCombined.cumulative = (item.closingBalance.type === "CREDIT") ? Number("-" + item.closingBalance.amount) : item.closingBalance.amount;
                reportsModelCombined.interval = this.interval;
                reportsModelCombined.selectedMonth = this.selectedMonth;
                reportModelArray.push(reportsModel);
                if (indexMonths % 3 === 0) {
                    reportsModelCombined.particular = this.commonLocaleData?.app_quarter + ' ' + indexMonths / 3;
                    reportsModelCombined.reportType = 'combined';
                    reportModelArray.push(reportsModelCombined);

                    reportsModelCombined = new PurchaseReportsModel();
                }
            } else if (dateDiff <= 93) {
                this.setPurchaseRegisterTotal(item);
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
        let currentGroupBy = '';
        let currentSalesPersonUniqueNames = [];
        let currentAccountUniqueNames = [];
        let currentCountryCode = '';
        let currentCountryCodes = [];
        let currentStateCodes = [];

        this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
            if (params?.interval || params?.selectedMonth) {
                this.selectedType = params.interval;
                this.interval = params.interval;
                this.reportForm.get('interval').patchValue(params.interval);
                this.selectedMonth = params.selectedMonth;

                this.router.navigate(['pages', 'reports', 'purchase-register']);
            }
        });

        // set financial years based on company financial year
        this.store.pipe(select(createSelector([(state: AppState) => state.session.activeCompany, (state: AppState) => state.session.registerReportFilters], (activeCompany, registerReportFilters) => {
            financialYearChosenInReportUniqueName = registerReportFilters ? registerReportFilters.financialYearChosenInReport : '';
            currentBranchUniqueName = registerReportFilters ? registerReportFilters.branchChosenInReport : '';
            currentTimeFilter = registerReportFilters?.timeFilter?.toLowerCase() ?? '';
            currentSalesPersonUniqueNames = registerReportFilters?.salesPersonUniqueNames ?? [];
            currentAccountUniqueNames = registerReportFilters?.accountUniqueNames ?? [];
            currentGroupBy = registerReportFilters?.groupBy || GroupBy.Duration;
            currentCountryCode = registerReportFilters?.countryCode ?? '';
            currentCountryCodes = registerReportFilters?.countryCodes ?? [];
            currentStateCodes = registerReportFilters?.stateCodes ?? [];
            return activeCompany;
        })), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
                this.financialOptions = activeCompany.financialYears?.map(response => {
                    if (response) {
                        return { label: response.uniqueName, value: response.uniqueName };
                    }
                });
                let selectedFinancialYear, activeFinancialYear, uniqueNameToSearch;
                if (financialYearChosenInReportUniqueName) {
                    // User is navigating back from details page hence show the selected filter as pre-filled
                    uniqueNameToSearch = financialYearChosenInReportUniqueName;
                } else {
                    uniqueNameToSearch = activeCompany.activeFinancialYear?.uniqueName;
                }
                selectedFinancialYear = this.financialOptions?.find(financialYear => financialYear?.value === uniqueNameToSearch);
                activeFinancialYear = this.selectedCompany.financialYears?.find(financialYear => financialYear?.uniqueName === uniqueNameToSearch);
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
                this.reportForm.get('groupBy').patchValue(currentGroupBy);
                this.reportForm.get('salesPersonUniqueNames').patchValue(currentSalesPersonUniqueNames);
                this.reportForm.get('accountUniqueNames').patchValue(currentAccountUniqueNames);
                this.reportForm.get('countryCode').patchValue(currentCountryCode);
                this.reportForm.get('countryCodes').patchValue(currentCountryCodes);
                this.reportForm.get('stateCodes').patchValue(currentStateCodes);
                this.populateRecords(this.selectedType, this.selectedMonth);
                this.purchaseRegisterTotal.particular = this.getCustomParticular();
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    public selectFinancialYearOption(v: IOption) {
        if (v?.value) {
            let financialYear = this.selectedCompany.financialYears?.find(financialYear => financialYear?.uniqueName === v?.value);
            this.activeFinacialYr = financialYear;
            this.populateRecords(this.interval, this.selectedMonth);
        }
    }

    public populateRecords(interval, month?) {
        this.interval = interval;
        this.reportForm.get('interval').patchValue(interval);
        if (interval === this.durationEnum.Weekly && !month) {
            this.populateRecords(this.durationEnum.Monthly);
            return;
        }
        if (this.activeFinacialYr && this.reportForm.get('groupBy')?.value === GroupBy.Duration) {
            let startDate = this.activeFinacialYr.financialYearStarts?.toString();
            let endDate = this.activeFinacialYr.financialYearEnds?.toString();
            this.dateRange.from = dayjs(startDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.dateRange.to = dayjs(endDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
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
            this.getPurchaseRegister(startDate, endDate);
        } else if (this.reportForm.get('groupBy')?.value === GroupBy.SalesPerson || this.reportForm.get('groupBy')?.value === GroupBy.State || this.reportForm.get('groupBy')?.value === GroupBy.Country) {
            this.dateRange.from = dayjs(this.selectedDateRange?.startDate).format(GIDDH_DATE_FORMAT);
            this.dateRange.to = dayjs(this.selectedDateRange?.endDate).format(GIDDH_DATE_FORMAT);
            this.getPurchaseRegister(this.dateRange.from, this.dateRange.to);
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
                branchUniqueName: this.currentBranch?.uniqueName
            }
            this.companyService.getPurchaseRegister(request).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'error') {
                    this._toaster.errorToast(res?.message);
                } else {
                    this.purchaseRegisterTotal = new PurchaseReportsModel();
                    this.purchaseRegisterTotal.particular = this.getCustomParticular();
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

            // GET THE FIRST AND LAST DATE OF THE MONTH.
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
     * @memberof PurchaseRegisterComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.populateRecords(this.interval, this.selectedMonth);
    }

    /**
     * Saves the user preference for filters
     *
     * @private
     * @memberof PurchaseRegisterComponent
     */
    private savePreferences(): void {
        this.store.dispatch(this.companyActions.setUserChosenFinancialYear({
            financialYear: this.currentActiveFinacialYear?.value, 
            branchUniqueName: this.currentBranch?.uniqueName, 
            timeFilter: this.selectedType, 
            salesPersonUniqueNames: this.reportForm?.get('salesPersonUniqueNames')?.value, 
            accountUniqueNames: this.reportForm?.get('accountUniqueNames')?.value, 
            groupBy: this.reportForm?.get('groupBy')?.value,
            countryCode: this.reportForm?.get('countryCode')?.value,
            countryCodes: this.reportForm?.get('countryCodes')?.value,
            stateCodes: this.reportForm?.get('stateCodes')?.value
        }));
    }

    /**
     * Calculates the purchase register total
     *
     * @private
     * @param {*} transaction Purchase transaction
     * @memberof PurchaseRegisterComponent
     */
    private setPurchaseRegisterTotal(transaction: any): void {
        if (transaction) {
            const item = cloneDeep(transaction);
            this.purchaseRegisterTotal.purchase += item.debitTotal;
            this.purchaseRegisterTotal.returns += item.creditTotal;
            this.purchaseRegisterTotal.taxTotal += item.taxTotal;
            this.purchaseRegisterTotal.discountTotal += item.discountTotal;
            this.purchaseRegisterTotal.tcsTotal += item.tcsTotal;
            this.purchaseRegisterTotal.tdsTotal += item.tdsTotal;
            this.purchaseRegisterTotal.netPurchase += (item.balance.type === "CREDIT") ? Number("-" + item.balance.amount) : item.balance.amount;
            this.purchaseRegisterTotal.cumulative = (item.closingBalance.type === "CREDIT") ? Number("-" + item.closingBalance.amount) : item.closingBalance.amount;
            this.purchaseRegisterTotal.interval = this.interval;
            this.purchaseRegisterTotal.selectedMonth = this.selectedMonth;
            this.showColum(item);
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof PurchaseRegisterComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.monthNames = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];

            this.setCurrentFY();
            this.groupByOptions = [
                { label: this.commonLocaleData?.app_duration?.duration, value: GroupBy.Duration },
                { label: this.commonLocaleData?.app_sales_person, value: GroupBy.SalesPerson },
                { label: this.commonLocaleData?.app_state, value: GroupBy.State },
                { label: this.commonLocaleData?.app_country , value: GroupBy.Country }
            ];
        }
    }

    /**
     * Releases memory
     *
     * @memberof PurchaseRegisterComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Exports purchase register overview report
     *
     * @memberof PurchaseRegisterComponent
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
        exportBodyRequest.exportType = "PURCHASE_REGISTER_OVERVIEW_EXPORT";
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
     * @param {any} item - The transaction item.
     * @memberof PurchaseRegisterComponent
     */
    public showColum(item: any): void {
        Object.keys(this.columnDefinitions).filter((key) => !['purchase', 'particular'].includes(key)).forEach((key) => {
            if (['tcsTotal', 'tdsTotal'].includes(key)) {
                this.columnDefinitions[key][1] = this.isTcsTdsApplicable && this.purchaseRegisterTotal[key];
            } else {
                this.columnDefinitions[key][1] = !!this.purchaseRegisterTotal[key];
            }
        });

        if (item?.salesPerson?.name) {
            this.columnDefinitions['cumulative'][1] = true;
        }
    }

    /**
     * Navigates to the detailed purchase report page with query parameters.
     *
     * @param {ReportsModel} item - The report item containing date ranges and filters.
     * @memberof PurchaseRegisterComponent
     */
    public gotoDetailedPurchase(item: PurchaseReportsModel) {
        let from = item.from;
        let to = item.to;

        if (from != null && to != null) {
            const groupByValue = this.reportForm?.get('groupBy')?.value;
            /** Map of query parameters for each group by type */
            const groupByQueryParams: Record<GroupBy, any> = {
                [GroupBy.Duration]: {
                    interval: item.interval,
                    selectedMonth: item.selectedMonth
                },
                [GroupBy.SalesPerson]: {
                    salesPersonUniqueName: item.salesPerson?.uniqueName
                },
                [GroupBy.State]: {
                    stateCode: item.stateCode,
                    countryCode: this.reportForm?.get('countryCode')?.value
                },
                [GroupBy.Country]: {
                    countryCode: item.countryCode
                }
            };

            this.router.navigate(['pages', 'reports', 'purchase-detailed-expand'], { 
                queryParams: { 
                    from, 
                    to, 
                    branchUniqueName: this.currentBranch.uniqueName,
                    groupBy: this.currentGroupBy(),
                    ...(groupByQueryParams[groupByValue] || {})
                } 
            });
        }
    }

    /**
     * Open sales person dialog
     *
     * @memberof PurchaseRegisterComponent
     */
    public openSalesPersonDialog(): void {
        const dialogRef = this.dialog.open(SalesPersonComponent, ASIDE_PANE_CONFIG);
        dialogRef.afterClosed().pipe(filter(Boolean), take(1), tap(() => this.getSalesPersonList())).subscribe();
    }

    /**
     * Get sales person list as label value
     *
     * @memberof PurchaseRegisterComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: API_BULK_FETCH_LIMIT, archive: '' } });
    }

    /**
     * Get accounts
     *
     * @param {string} search
     * @memberof PurchaseRegisterComponent
     */
    public getAccounts(search: string = ''): void {
        const params = {
            page: 1,
            count: 200,
            withStocks: false,
            group: 'indirectexpenses,operatingcost',
            q: search
        };
        this.componentStore.getAccounts(params);
    }

    /**
     * This will toggle the datepicker
     *
     * @param {boolean} isOpen
     * @memberof PurchaseRegisterComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof PurchaseRegisterComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.dateRange.from = dayjs(this.selectedDateRange?.startDate).format(GIDDH_DATE_FORMAT);
            this.dateRange.to = dayjs(this.selectedDateRange?.endDate).format(GIDDH_DATE_FORMAT);
            this.getPurchaseRegister(
                dayjs(value.startDate).format(GIDDH_DATE_FORMAT),
                dayjs(value.endDate).format(GIDDH_DATE_FORMAT)
            );
        }
    }

    /**
     * Get sales register
     *
     * @param {string} from
     * @param {string} to
     * @memberof PurchaseRegisterComponent
     */
    public getPurchaseRegister(
        from: string = dayjs(this.dateRange?.from).format(GIDDH_DATE_FORMAT),
        to: string = dayjs(this.dateRange?.to).format(GIDDH_DATE_FORMAT)
    ): void {
        if (!from || !to) {
            return;
        }
        this.savePreferences();
        const requestObject = cloneDeep(this.reportForm.value);
        const groupByValue = this.reportForm?.get('groupBy')?.value;

        /** Map of keys to remove for each group by type */
        const keysToRemoveByGroupType: Record<GroupBy, string[]> = {
            [GroupBy.Duration]: ["salesPersonUniqueNames", "countryCode", "countryCodes", "stateCodes"],
            [GroupBy.SalesPerson]: ["interval", "countryCode", "countryCodes", "stateCodes"],
            [GroupBy.Country]: ["salesPersonUniqueNames", "interval", "countryCode", "stateCodes"],
            [GroupBy.State]: ["salesPersonUniqueNames", "interval", "countryCodes", "countryCode"]
        };

        /** Add country object for State grouping */
        if (groupByValue === GroupBy.State) {
            requestObject.country = { code: requestObject.countryCode };
        }

        /** Remove unnecessary keys based on group by type */
        const keysToRemove = keysToRemoveByGroupType[groupByValue];
        if (keysToRemove) {
            this.removeKeysFromObject(requestObject, keysToRemove);
        }
        this.currentGroupBy.set(requestObject.groupBy);
        this.componentStore.getSalesPurchaseList({
            payload: requestObject,
            params: { branchUniqueName: (this.currentBranch ? this.currentBranch.uniqueName : ""), from, to },
            isSalesRegister: false
        });
    }

    /**
     * Get custom particular
     *
     * @returns {string}
     * @memberof PurchaseRegisterComponent
     */
    public getCustomParticular(): string {
        if (this.reportForm?.get('groupBy')?.value === GroupBy.Duration) {
            return this.activeFinacialYr?.uniqueName;
        } else {
            const fromDate = dayjs(this.dateRange?.from, GIDDH_DATE_FORMAT);
            const toDate = dayjs(this.dateRange?.to, GIDDH_DATE_FORMAT);
            return `${fromDate.format(GIDDH_DATE_FORMAT_MMM_YYYY)}-${toDate.format(GIDDH_DATE_FORMAT_MMM_YYYY)}`;
        }
    }

    /**
     * Remove specified keys from object
     *
     * @param {any} obj Object to remove keys from
     * @param {string[]} keysToRemove Array of keys to remove
     * @memberof PurchaseRegisterComponent
     */
    private removeKeysFromObject(obj: any, keysToRemove: string[]): void {
        keysToRemove.forEach(key => {
            delete obj[key];
        });
    }

    /**
     * Load countries list
     *
     * @memberof PurchaseRegisterComponent
     */
    private loadCountries(): void {
        this.companyService.getAccountCountries().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success' && response?.body) {
                this.countryList.set(response.body.map(country => ({
                    label: country.countryName || country.name,
                    value: country.alpha2CountryCode || country.code
                })));
                this.filteredCountryList.set(this.countryList());
            }
        });
    }

    /**
     * Load states based on selected country
     *
     * @param {string} countryCode
     * @memberof PurchaseRegisterComponent
     */
    private loadStates(countryCode: string): void {
        const statesRequest = { country: countryCode };
        this.store.dispatch(this.generalActions.getAllState(statesRequest));
    }

    /**
     * Handle country selection for State groupBy
     *
     * @param {IOption} event
     * @memberof PurchaseRegisterComponent
     */
    public handleCountrySelection(event: IOption): void {
        if (event?.value) {
            this.reportForm.get('stateCodes')?.setValue([]);
            this.getPurchaseRegister();
        }
    }
}
