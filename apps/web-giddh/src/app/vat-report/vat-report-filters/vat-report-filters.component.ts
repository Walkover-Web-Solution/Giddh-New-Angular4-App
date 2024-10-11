import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { GeneralService } from '../../services/general.service';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsFinancialYearService } from '../../services/settings.financial-year.service';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { GIDDH_DATE_RANGE_PICKER_RANGES, SALES_TAX_SUPPORTED_COUNTRIES, TRN_SUPPORTED_COUNTRIES, VAT_SUPPORTED_COUNTRIES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { OrganizationType } from '../../models/user-login-state';
import { cloneDeep } from '../../lodash-optimized';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { CommonService } from '../../services/common.service';
import { ToasterService } from '../../services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { SalesTaxReport } from '../../theme/tax-authority/utility/tax-authority.const';
import { CompanyActions } from '../../actions/company.actions';
import { TaxAuthorityComponentStore } from '../../theme/tax-authority/utility/tax-authority.store';

interface DateCheckResult {
    status: boolean;
    monthName?: string;
    monthNumber?: number;
    year?: number;
}
@Component({
    selector: 'vat-report-filters',
    templateUrl: './vat-report-filters.component.html',
    styleUrls: ['./vat-report-filters.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class VatReportFiltersComponent implements OnInit, OnChanges {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This will hold active company data */
    @Input() public activeCompany: any = null;
    /** This will hold module type */
    @Input() public moduleType: 'VAT_REPORT' | 'LIABILITY_REPORT' = 'VAT_REPORT';
    /** True if active country is UK */
    @Input() public isUKCompany: boolean = false;
    /** True if active country is Zimbabwe */
    @Input() public isZimbabweCompany: boolean = false;
    /** True if active country is Kenya */
    @Input() public isKenyaCompany: boolean = false;
    /** True if active country is US */
    @Input() public isUSCompany: boolean = false;
    /** True if Sales Tax Report Type is US */
    @Input() public salesTaxReportType: string = null;
    /** True if current Tax Authority uniqueName is US */
    @Input() public currentTaxAuthorityUniqueName: string = null;
    /** True if current Tax uniqueName is US */
    @Input() public currentTaxUniqueName: string = null;
    /** Hold HMRC portal url */
    @Input() public connectToHMRCUrl: string = null;
    /** Holds Current Currency Code for Zimbabwe report */
    @Input() public vatReportCurrencyCode: 'BWP' | 'USD' | 'GBP' | 'INR' | 'EUR' = 'BWP';
    /** Emits Current currency code */
    @Output() public currentCurrencyCode: EventEmitter<any> = new EventEmitter<any>();
    /** Emits selected from date */
    @Output() public fromDate: EventEmitter<any> = new EventEmitter<any>();
    /** Emits selected to date */
    @Output() public toDate: EventEmitter<any> = new EventEmitter<any>();
    /** Emits current selected branch */
    @Output() public currentBranchChange: EventEmitter<any> = new EventEmitter<any>();
    /** Emits current Tax Number */
    @Output() public currentTaxNumber: EventEmitter<any> = new EventEmitter<any>();
    /** Emits get report to call api from parent component */
    @Output() public getReport: EventEmitter<any> = new EventEmitter<any>();
    /** Emits export/download report to call api from parent component */
    @Output() public exportReport: EventEmitter<any> = new EventEmitter<any>();
    /** Emits true when tax api call inprogress */
    @Output() public isTaxApiInProgress: EventEmitter<any> = new EventEmitter<any>();
    /** Emits selected taxAuthorityUniqueName */
    @Output() public taxAuthorityUniqueName: EventEmitter<string> = new EventEmitter<string>();
    /** Emits selected taxUniqueName */
    @Output() public taxUniqueName: EventEmitter<string> = new EventEmitter<string>();
    /** Universal Datepicker template reference */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Hold selected from date */
    public from: string = '';
    /** Hold selected to date */
    public to: string = '';
    /** Hold selected year */
    public year: number = null;
    /** Hold true if months dropdown value is selected year */
    public isMonthSelected: boolean = true;
    /** Hold true when show universal date picker */
    public showCalendar: boolean = false;
    /** Hold date picker visibility status */
    public datepickerVisibility: any = 'hidden';
    /** Stores the tax details of a company */
    public taxes: IOption[] = [];
    /** Tax number */
    public taxNumber: string;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Datepicker modal reference */
    public modalRef: BsModalRef;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Hold static months array */
    public months: any[] = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];
    /** Hold financial year list */
    public financialYears: any = [];
    /** Hold selected month value */
    public selectedMonth: any = "";
    /** Hold selected year value */
    public selectedYear: any = "";
    /** Holds Currency List for Zimbabwe Amount exchange rate */
    public vatReportCurrencyList: any[] = [
        { label: 'BWP', value: 'BWP', additional: { symbol: 'P' } },
        { label: 'USD', value: 'USD', additional: { symbol: '$' } },
        { label: 'GBP', value: 'GBP', additional: { symbol: '£' } },
        { label: 'INR', value: 'INR', additional: { symbol: '₹' } },
        { label: 'EUR', value: 'EUR', additional: { symbol: '€' } }
    ];
    /** True if Current branch has Tax Number */
    public hasTaxNumber: boolean = false;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** True if value in query params */
    private hasQueryParams: boolean = false;
    /** True if Vat Report page */
    public isVatReport: boolean;
    /** True if Liability Report page */
    public isLiabilityReport: boolean;
    /** Holds true if active company country is US */
    public taxAuthorityList: IOption[] = [];
    /** Holds true if Sales Tax report type is tax/rate wise */
    public isSalesTaxRateWise: boolean = false;
    /** Holds true if Sales Tax report type is account wise */
    public isSalesTaxAccountWise: boolean = false;
    /** Holds Company taxes list */
    public taxList: IOption[] = [];
    /** Tax Authority info */
    public taxAuthority: any = {
        taxName: '',
        taxUniqueName: '',
        taxAuthorityName: '',
        taxAuthorityUniqueName: ''
    };
    /** Holds Tax type label  */
    public taxType: any = {
        label: '',
        placeholder: ''
    }

    constructor(
        private store: Store<AppState>,
        private gstReconcileService: GstReconcileService,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions,
        private modalService: BsModalService,
        public settingsFinancialYearService: SettingsFinancialYearService,
        private commonService: CommonService,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private settingsTaxesActions: SettingsTaxesActions,
        private companyActions: CompanyActions,
        private componentStore: TaxAuthorityComponentStore
    ) {
        this.getFinancialYears();
    }


    /**
     * Initializes the component
     *
     * @memberof VatReportFiltersComponent
     */
    public ngOnInit(): void {
        this.isSalesTaxRateWise = SalesTaxReport.TaxWise === this.salesTaxReportType;
        this.isSalesTaxAccountWise = SalesTaxReport.AccountWise === this.salesTaxReportType;
        this.isVatReport = this.moduleType === "VAT_REPORT";
        this.isLiabilityReport = this.moduleType === "LIABILITY_REPORT";

        if (this.isLiabilityReport) {
            this.getQueryParams();
        }
        if (!this.hasQueryParams) {
            this.getSelectedCurrency();
        }

        // Refresh report data according to universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj && !this.hasQueryParams) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.fromDate.emit(this.from);
                this.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.toDate.emit(this.to);
                this.selectedMonth = "";
                this.selectedYear = "";
                this.year = null;
                this.getVatReport();
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.getCurrentCompanyBranches();

        // Get All Tax Authorities for US Country
        if (this.isUSCompany) {
            this.componentStore.taxAuthorityList$.pipe(takeUntil(this.destroyed$)).subscribe(taxAuthorities => {
                if (taxAuthorities?.length) {
                    let arr: IOption[] = [];
                    taxAuthorities.forEach(taxAuthority => {
                        arr.push({ label: taxAuthority.name, value: taxAuthority?.uniqueName });
                    });
                    this.taxAuthorityList = arr;
                    if (this.taxAuthority.taxAuthorityUniqueName) {
                        this.setTaxAuthorityLabel(this.taxAuthority.taxAuthorityUniqueName);
                    }
                }
            });
            this.componentStore.getTaxAuthorityList();

            this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$)).subscribe(taxes => {
                if (taxes) {
                    let arr: IOption[] = [];
                    taxes.forEach(tax => {
                        arr.push({ label: tax?.name, value: tax?.uniqueName });
                    });
                    this.taxList = arr;
                    if (this.taxAuthority.taxUniqueName) {
                        this.setTaxLabel(this.taxAuthority.taxUniqueName);
                    }
                }
            });
            this.store.dispatch(this.companyActions.getTax());
        }
    }

    /**
    * On Change of input properties
    *
    * @memberof VatReportFiltersComponent
    */
    public ngOnChanges(changes: SimpleChanges): void {
        if ('currentTaxAuthorityUniqueName' in changes && changes.currentTaxAuthorityUniqueName.currentValue !== changes.currentTaxAuthorityUniqueName.previousValue) {
            this.taxAuthority.taxAuthorityUniqueName = changes.currentTaxAuthorityUniqueName.currentValue;
        }

        if ('currentTaxUniqueName' in changes && changes.currentTaxUniqueName.currentValue !== changes.currentTaxUniqueName.previousValue) {
            this.taxAuthority.taxUniqueName = changes.currentTaxUniqueName.currentValue;
        }

        if ('activeCompany' in changes && changes.activeCompany.currentValue !== changes.activeCompany.previousValue) {
            this.setTaxTypeLabelPlaceholder();
        }
    }

    /**
     * Set tax type label
     *
     * @private
     * @memberof VatReportFiltersComponent
     */
    private setTaxTypeLabelPlaceholder(): void {
        if (this.activeCompany && this.commonLocaleData) {
            const alpha2CountryCode = this.activeCompany?.countryV2?.alpha2CountryCode;

            if (VAT_SUPPORTED_COUNTRIES.includes(alpha2CountryCode)) {
                this.taxType.label = this.commonLocaleData?.app_vat;
                this.taxType.placeholder = this.commonLocaleData?.app_enter_vat;
            } else if (TRN_SUPPORTED_COUNTRIES.includes(alpha2CountryCode)) {
                this.taxType.label = this.commonLocaleData?.app_trn;
                this.taxType.placeholder = this.commonLocaleData?.app_enter_trn;
            } else if (SALES_TAX_SUPPORTED_COUNTRIES.includes(alpha2CountryCode)) {
                this.taxType.label = this.commonLocaleData?.app_sales_tax;
                this.taxType.placeholder = this.commonLocaleData?.app_enter_sales_tax;
            }
        }
    }

    /**
     * Set Tax Authority dropdown lable value
     *
     * @private
     * @param {string} uniqueName
     * @memberof VatReportFiltersComponent
     */
    private setTaxAuthorityLabel(uniqueName: string): void {
        let taxAuthorityObj = this.taxAuthorityList.find(taxAuthority => taxAuthority.value === uniqueName);
        if (taxAuthorityObj) {
            this.taxAuthority.taxAuthorityName = taxAuthorityObj?.label;
            this.onTaxAuthorityChange(taxAuthorityObj);
        }
    }

    /**
     * Set Tax dropdown lable value
     *
     * @private
     * @param {string} uniqueName
     * @memberof VatReportFiltersComponent
     */
    private setTaxLabel(uniqueName: string): void {
        let taxObj = this.taxList.find(tax => tax.value === uniqueName);
        if (taxObj) {
            this.taxAuthority.taxName = taxObj?.label;
            this.onTaxChange(taxObj);
        }
    }

    /**
     * Get Query Params value
     *
     * @private
     * @memberof VatReportFiltersComponent
     */
    private getQueryParams(): void {
        this.route.queryParams.pipe(take(1)).subscribe(params => {
            if (params && Object.keys(params)?.length > 0) {
                const from = params['from'];
                const to = params['to'];
                const taxNumber = params['taxNumber'];
                const currencyCode = params['currencyCode'];
                this.hasQueryParams = from && to && taxNumber;
                const queryObject = { from: from, to: to, taxNumber: taxNumber, currencyCode: currencyCode };
                this.assignQueryValues(queryObject);
            }
        });
    }

    /**
     * Assign values
     *
     * @private
     * @param {*} value
     * @memberof VatReportFiltersComponent
     */
    private assignQueryValues(value: any): void {
        this.taxNumber = value.taxNumber;
        this.currentTaxNumber.emit(this.taxNumber);

        const fromDateInYYYYDDMM = dayjs(value?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
        this.from = dayjs(fromDateInYYYYDDMM).format(GIDDH_DATE_FORMAT);
        this.fromDate.emit(this.from);

        const toDateInYYYYDDMM = dayjs(value?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
        this.to = dayjs(toDateInYYYYDDMM).format(GIDDH_DATE_FORMAT);
        this.toDate.emit(this.to);

        this.selectedDateRange = { startDate: dayjs(fromDateInYYYYDDMM), endDate: dayjs(toDateInYYYYDDMM) };
        this.selectedDateRangeUi = dayjs(fromDateInYYYYDDMM).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(toDateInYYYYDDMM).format(GIDDH_NEW_DATE_FORMAT_UI);
        this.onCurrencyChange({ value: value.currencyCode }, true);

        const isMonthwiseDateRange = this.checkFullMonthRange(fromDateInYYYYDDMM, toDateInYYYYDDMM);

        if (isMonthwiseDateRange.status) {
            this.getYearStartAndEndDate({ label: isMonthwiseDateRange.year, value: isMonthwiseDateRange?.year });
            this.getMonthStartAndEndDate({ label: isMonthwiseDateRange.monthName, value: isMonthwiseDateRange?.monthNumber });
        }
        this.getVatReport();
    }

    /**
     * Get Current company branches information
     *
     * @private
     * @memberof VatReportFiltersComponent
     */
    private getCurrentCompanyBranches(): void {
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded

                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                        this.hasTaxNumber = this.currentBranch?.addresses?.filter(address => address?.taxNumber?.length > 0)?.length > 0;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                    if (this.hasTaxNumber || this.currentOrganizationType === OrganizationType.Company) {
                        this.loadTaxDetails();
                    }
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });
    }

    /**
     * Loads the tax details of a company
     *
     * @private
     * @memberof VatReportFiltersComponent
     */
    private loadTaxDetails(): void {
        this.isTaxApiInProgress.emit(true);
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.taxes = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
                this.taxNumber = this.taxes[0]?.value;
                this.currentTaxNumber.emit(this.taxNumber);
            }
            this.isTaxApiInProgress.emit(false);
            setTimeout(() => {
                if (!this.hasQueryParams) {
                    this.getVatReport();
                }
            }, 100);
        });
    }

    /**
    * To show the datepicker
    *
    * @param {*} element
    * @memberof VatReportFiltersComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof VatReportFiltersComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof VatReportFiltersComponent
    */
    public dateSelectedCallback(value?: any): void {
        this.hasQueryParams = false;
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";
        this.selectedMonth = "";
        this.selectedYear = "";
        this.year = null;

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.fromDate.emit(this.from);
            this.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.toDate.emit(this.to);
            this.getVatReport();
        }
    }

    /**
     * This will get all the financial years of the company
     *
     * @memberof VatReportFiltersComponent
     */
    private getFinancialYears(): void {
        this.settingsFinancialYearService.getFinancialYearLimits().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res.body.startDate && res.body.endDate) {
                this.createFinancialYearsList(res.body.startDate, res.body.endDate);
            }
        });
    }

    /**
    * Create financial years list for dropdown
    *
    * @private
    * @param {*} startDate
    * @param {*} endDate
    * @memberof VatReportFiltersComponent
    */
    private createFinancialYearsList(startDate: any, endDate: any): any {
        if (startDate && endDate) {
            let startYear = startDate.split('-');
            startYear = startYear[startYear?.length - 1];

            let endYear = endDate.split('-');
            endYear = endYear[endYear?.length - 1];
            for (let year = startYear; year <= endYear; year++) {
                this.financialYears.push({ label: year, value: year });
            }
            return { startYear: startYear, endYear: endYear };
        }
    }

    /**
     * Handle Currency change dropdown and call VAT Report API
     *
     * @param {*} event
     * @memberof VatReportFiltersComponent
     */
    public onCurrencyChange(event: any, initialCall: boolean = false): void {
        if (this.vatReportCurrencyCode !== event?.value) {
            this.vatReportCurrencyCode = event.value;
            this.currentCurrencyCode.emit(event.value);

            if (!initialCall) {
                this.saveSelectedCurrency(event.value);
                this.getVatReport();
            }
        }
    }

    /**
     * Handle select tax authority dropdown and emit selected value
     *
     * @memberof VatReportFiltersComponent
     */
    public onTaxAuthorityChange(event: any): void {
        if (event) {
            this.taxAuthorityUniqueName.emit(event.value);
            this.taxAuthority.taxAuthorityName = event.label;
            this.taxAuthority.taxAuthorityUniqueName = event.value;
            this.getVatReport();
        }
    }

    /**
     * Handle select tax dropdown and emit selected value
     *
     * @memberof VatReportFiltersComponent
     */
    public onTaxChange(event: any): void {
        if (event) {
            this.taxUniqueName.emit(event.value);
            this.taxAuthority.taxName = event.label;
            this.taxAuthority.taxUniqueName = event.value;
            this.getVatReport();
        }
    }

    /**
    * This will use for get year selected
    *
    * @param {*} selectedYear
    * @memberof VatReportFiltersComponent
    */
    public getYearStartAndEndDate(selectedYear: any): void {
        if (selectedYear?.value && selectedYear?.label !== this.selectedYear) {
            this.year = Number(selectedYear?.value);
            this.selectedYear = selectedYear.label;

            if (this.selectedMonth) {
                this.getMonthStartAndEndDate(this.selectedMonth);
            }
        }
    }

    /**
     * This will use for get month start date and end date
     *
     * @param {number} selectedMonth
     * @memberof VatReportFiltersComponent
     */
    public getMonthStartAndEndDate(selectedMonth: any): void {
        if (selectedMonth) {
            this.selectedMonth = selectedMonth;

            // Month is zero-based, so subtract 1 from the selected month
            const startDate = new Date(this.year, selectedMonth.value - 1, 1);
            const endDate = new Date(this.year, selectedMonth.value, 0);
            this.selectedDateRange = { startDate: dayjs(startDate), endDate: dayjs(endDate) };
            this.selectedDateRangeUi = dayjs(startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.from = dayjs(startDate).format(GIDDH_DATE_FORMAT);
            this.fromDate.emit(this.from);
            this.to = dayjs(endDate).format(GIDDH_DATE_FORMAT);
            this.toDate.emit(this.to);
            this.getVatReport();
        }
    }

    /**
     * Emits get vat report
     *
     * @param {*} [event]
     * @memberof VatReportFiltersComponent
     */
    public getVatReport(event?: any): void {
        if (event && event.value) {
            this.taxNumber = event.value;
            this.currentTaxNumber.emit(this.taxNumber);
        }
        this.getReport.emit(true);
    }

    /**
     * Emits Download/Export Report
     *
     * @memberof VatReportFiltersComponent
     */
    public downloadVatReport(): void {
        this.exportReport.emit(true);
    }

    /**
     * Branch change handler
     *
     * @memberof VatReportFiltersComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        if (selectedEntity) {
            this.currentBranch.name = selectedEntity.label;
            this.currentBranch.uniqueName = selectedEntity.value;
            this.currentBranchChange.emit(this.currentBranch);
            this.getVatReport();
        }
    }

    /**
    * Get last currency in which the report was viewed.
    *
    * @memberof VatReportFiltersComponent
    */
    public getSelectedCurrency(): void {
        this.commonService.getSelectedTableColumns(this.moduleType).pipe(take(1)).subscribe(response => {
            if (response && response.status === 'success') {
                if (response.body) {
                    this.onCurrencyChange({ value: this.isVatReport ? response.body?.vatReportCurrency : response.body?.liabilityReportCurrency }, true);
                } else if (response.body === null) {
                    this.onCurrencyChange({ value: this.vatReportCurrencyList[0].value }, true);
                }
            }
        });
    }

    /**
     * Save last currency in which the report was viewed.
     *
     * @memberof VatReportFiltersComponent
     */
    public saveSelectedCurrency(currencyCode: string): void {
        let request = {
            module: this.moduleType
        }
        request[this.isVatReport ? 'vatReportCurrency' : 'liabilityReportCurrency'] = currencyCode;
        this.commonService.saveSelectedTableColumns(request).pipe(take(1)).subscribe(response => {
            if (response && response.status === 'error' && response.message) {
                this.toaster.showSnackBar("error", response.message);
            }
        });
    }

    /**
     * Check the From and To Date is lies in same month and also start and end day of the same month
     *
     * @private
     * @param {string} fromDate
     * @param {string} toDate
     * @returns {DateCheckResult}
     * @memberof VatReportFiltersComponent
     */
    private checkFullMonthRange(fromDate: string, toDate: string): DateCheckResult {
        const from = dayjs(fromDate);
        const to = dayjs(toDate);

        const fromStartOfMonth = from.startOf('month');
        const toEndOfMonth = from.endOf('month');

        const isFirstDayOfMonth = from.isSame(fromStartOfMonth, 'day');
        const isLastDayOfMonth = to.isSame(toEndOfMonth, 'day');
        const isSameMonthAndYear = from.isSame(to, 'month') && from.isSame(to, 'year');

        if (isFirstDayOfMonth && isLastDayOfMonth && isSameMonthAndYear) {
            return {
                status: true,
                monthName: from.format('MMMM'),
                monthNumber: from.month() + 1,
                year: from.year()
            };
        } else {
            return {
                status: false
            };
        }
    }

    /**
     * This hook will be use for component destroyed
     *
     * @memberof VatReportFiltersComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
