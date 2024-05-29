import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, TemplateRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { VatReportRequest } from '../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { VatService } from "../services/vat.service";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../shared/helpers/defaultDateFormat";
import { saveAs } from "file-saver";
import { IOption } from '../theme/ng-select/ng-select';
import { GstReconcileService } from '../services/gst-reconcile.service';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { cloneDeep } from '../lodash-optimized';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import { SettingsFinancialYearService } from '../services/settings.financial-year.service';
@Component({
    selector: 'app-vat-report',
    styleUrls: ['./vat-report.component.scss'],
    templateUrl: './vat-report.component.html'
})
export class VatReportComponent implements OnInit, OnDestroy {
    public vatReport: any[] = [];
    public activeCompany: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public dayjs = dayjs;
    public fromDate: string = '';
    public toDate: string = '';
    /** Hold selected year */
    public year: number = null;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    @ViewChild('periodDropdown', { static: true }) public periodDropdown;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    public isMonthSelected: boolean = true;
    public currentPeriod: any = {};
    public showCalendar: boolean = false;
    public datepickerVisibility: any = 'hidden';
    /** Stores the tax details of a company */
    public taxes: IOption[] = [];
    /** Tax number */
    public taxNumber: string;
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
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
    /** Hold uae main table displayed columns */
    public displayedColumns: string[] = ['number', 'name', 'aed_amt', 'vat_amt', 'adjustment'];
    /** Hold uae bottom table displayed columns */
    public uaeDisplayedColumns: string[] = ['number', 'description', 'tooltip'];
    /** Hold uk main table and bottom table displayed columns */
    public ukDisplayedColumns: string[] = ['number', 'name', 'aed_amt'];
    /** Hold Zimbabwe main table displayed columns */
    public zwDisplayedColumns: string[] = ['name', 'mat-code', 'vos-amount', 'vos-decimal', 'ot-amount', 'ot-decimal'];
    /** Hold Zimbabwe table header row displayed columns */
    public zwDisplayedHeaderColumns = ['section', 'office-use', 'value-of-supply', 'output-tax'];
    /** Hold Zimbabwe table displayed columns for last section */
    public zwDisplayedColumnsForLastSection: string[] = ['name', 'amount', 'decimal'];
    /** Hold Kenya table displayed columns */
    public kenyaDisplayedColumns: string[] = ['number', 'description', 'amount', 'rate', 'ot-amount'];
    /** Hold Kenya table displayed columns */
    public kenyaDisplayedColumnsForLastSection: string[] = ['number', 'description', 'vat-amount'];
    /** Holds Section Number which  show Total Output Tax Row */
    public showTotalOutputTaxIn: number[] = [9, 19, 20, 21, 22, 23];
    /** True if active country is UK */
    public isUKCompany: boolean = false;
    /** True if active country is Zimbabwe */
    public isZimbabweCompany: boolean = false;
    /** True if active country is Kenya */
    public isKenyaCompany: boolean = false;
    /** Hold static months array */
    public months: any[] = [
        { label: 'January', value: 1 },
        { label: 'Febuary', value: 2 },
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
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Hold selected month value */
    public selectedMonth: any = "";
    /** Hold selected year value */
    public selectedYear: any = "";
    /** Hold HMRC portal url */
    public connectToHMRCUrl: string = null;
    /** Holds Currency List for Zimbabwe Amount exchange rate */
    public vatReportCurrencyList: any[] = [
        { label: 'BWP', value: 'BWP', additional: { symbol: 'P' } },
        { label: 'USD', value: 'USD', additional: { symbol: '$' } },
        { label: 'GBP', value: 'GBP', additional: { symbol: '£' } },
        { label: 'INR', value: 'INR', additional: { symbol: '₹' } },
        { label: 'EUR', value: 'EUR', additional: { symbol: '€' } }
    ];
    /** Holds Current Currency Code for Zimbabwe report */
    public vatReportCurrencyCode: 'BWP' | 'USD' | 'GBP' | 'INR' | 'EUR' = this.vatReportCurrencyList[0].value;
    /** Holds Current Currency Symbol for Zimbabwe report */
    public vatReportCurrencySymbol: string = this.vatReportCurrencyList[0].additional.symbol;
    /** Holds Current Currency Map Amount Decimal currency wise for Zimbabwe report */
    public vatReportCurrencyMap: string[];
    /** True if Current branch has Tax Number */
    public hasTaxNumber: boolean = false;

    constructor(
        private gstReconcileService: GstReconcileService,
        private store: Store<AppState>,
        private vatService: VatService,
        private generalService: GeneralService,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private route: Router,
        private settingsBranchAction: SettingsBranchActions,
        private breakpointObserver: BreakpointObserver,
        private modalService: BsModalService,
        public settingsFinancialYearService: SettingsFinancialYearService
    ) {
        this.getFinancialYears();
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && this.activeCompany?.uniqueName !== activeCompany.uniqueName) {
                this.activeCompany = activeCompany;
                this.isUKCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'GB';
                this.isZimbabweCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'ZW';
                this.isKenyaCompany = this.activeCompany?.countryV2?.alpha2CountryCode === 'KE';
                if (this.isUKCompany) {
                    this.getURLHMRCAuthorization();
                }
            }
        });
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                if (!this.isMobileScreen) {
                    this.asideGstSidebarMenuState = 'in';
                }
            });
        this.store.pipe(select(appState => appState.general.openGstSideMenu), takeUntil(this.destroyed$)).subscribe(shouldOpen => {
            if (this.isMobileScreen) {
                if (shouldOpen) {
                    this.asideGstSidebarMenuState = 'in';
                } else {
                    this.asideGstSidebarMenuState = 'out';
                }
            }
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;
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
        // Refresh report data according to universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.selectedMonth = "";
                this.selectedYear = "";
                this.year = null;
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }

    /**
     * This will use for get vat report for uae and uk according to country code
     *
     * @param {*} [event]
     * @memberof VatReportComponent
     */
    public getVatReport(event?: any): void {
        if (event && event.value) {
            this.taxNumber = event.value;
        }

        if (this.taxNumber) {
            let countryCode;
            let vatReportRequest = new VatReportRequest();
            vatReportRequest.from = this.fromDate;
            vatReportRequest.to = this.toDate;
            vatReportRequest.taxNumber = this.taxNumber;
            vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;

            if (this.isZimbabweCompany) {
                vatReportRequest.currencyCode = this.vatReportCurrencyCode;
                countryCode = 'ZW';
            } else if (this.isKenyaCompany) {
                vatReportRequest.currencyCode = this.vatReportCurrencyCode;
                countryCode = 'KE';
            } else {
                countryCode = 'UK';
            }
            this.vatReport = [];
            this.isLoading = true;
            if (!this.isUKCompany && !this.isZimbabweCompany && !this.isKenyaCompany) {
                this.vatService.getVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res) {
                        this.isLoading = false;
                        if (res.status === 'success') {
                            this.vatReport = res.body?.sections;
                            this.cdRef.detectChanges();
                        } else {
                            this.toasty.errorToast(res.message);
                        }
                    }
                });
            } else {
                this.vatService.getCountryWiseVatReport(vatReportRequest, countryCode).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res) {
                        this.isLoading = false;
                        if (res && res?.status === 'success' && res?.body) {
                            this.vatReport = res.body?.sections;
                            if (this.isZimbabweCompany) {
                                this.vatReportCurrencyCode = res.body?.currency?.code;
                                this.vatReportCurrencySymbol = this.vatReportCurrencyList.filter(item => item.label === res.body?.currency?.code).map(item => item.additional.symbol).join();
                                this.vatReportCurrencyMap = res.body?.currencyMap;
                            }

                            this.cdRef.detectChanges();
                        } else {
                            this.toasty.errorToast(res.message);
                        }
                    }
                });
            }
        }
    }

    public downloadVatReport() {
        let countryCode;
        let vatReportRequest = new VatReportRequest();
        vatReportRequest.from = this.fromDate;
        vatReportRequest.to = this.toDate;
        vatReportRequest.taxNumber = this.taxNumber;
        vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;

        if (this.activeCompany?.countryV2?.alpha2CountryCode === 'ZW') {
            vatReportRequest.currencyCode = this.vatReportCurrencyCode;
            countryCode = 'ZW';
        } else if (this.isKenyaCompany) {
            vatReportRequest.currencyCode = this.vatReportCurrencyCode;
            countryCode = 'KE';
        } else {
            countryCode = 'UK';
        }

        this.vatService.downloadVatReport(vatReportRequest, countryCode).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, `VatReport${this.isKenyaCompany ? '.csv' : '.xlsx'}`);
            } else {
                this.toasty.clearAllToaster();
                this.toasty.errorToast(res?.message);
            }
        });
    }

    /**
     * This will use for get month start date and end date
     *
     * @param {number} selectedMonth
     * @memberof VatReportComponent
     */
    public getMonthStartAndEndDate(selectedMonth: any) {
        if (selectedMonth) {
            this.selectedMonth = selectedMonth;

            // Month is zero-based, so subtract 1 from the selected month
            const startDate = new Date(this.year, selectedMonth.value - 1, 1);
            const endDate = new Date(this.year, selectedMonth.value, 0);
            this.selectedDateRange = { startDate: dayjs(startDate), endDate: dayjs(endDate) };
            this.selectedDateRangeUi = dayjs(startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(endDate).format(GIDDH_DATE_FORMAT);
            this.getVatReport();

        }
    }

    /**
    * This will use for get year selected
    *
    * @param {*} selectedYear
    * @memberof VatReportComponent
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
    * This will redirect to vat report detail page
    *
    * @param {*} section
    * @memberof VatReportComponent
    */
    public viewVatReportTransactions(section) {
        this.route.navigate(['pages', 'vat-report', 'transactions', 'section', section], { queryParams: { from: this.fromDate, to: this.toDate, taxNumber: this.taxNumber } });
    }

    /**
     * Branch change handler
     *
     * @memberof VatReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.getVatReport();
    }

    /**
     * Loads the tax details of a company
     *
     * @private
     * @memberof VatReportComponent
     */
    private loadTaxDetails(): void {
        this.isTaxApiInProgress = true;
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.taxes = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
            }
            this.isTaxApiInProgress = false;
            this.taxNumber = this.taxes[0]?.value;
            setTimeout(() => {
                this.getVatReport();
            },100);
        });
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof VatReportComponent
     */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }
    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof VatReportComponent
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
     * @memberof VatReportComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof VatReportComponent
    */
    public dateSelectedCallback(value?: any): void {
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
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getVatReport();
        }
    }

    /**
     * This will call API to get HMRC get authorization url
     *
     * @memberof VatReportComponent
     */
    public getURLHMRCAuthorization(): void {
        this.vatService.getHMRCAuthorization(this.activeCompany.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.body) {
                this.connectToHMRCUrl = res?.body;
            }
        })
    }

    /**
     * This will get all the financial years of the company
     *
     * @memberof VatReportComponent
     */
    private getFinancialYears(): void {
        this.settingsFinancialYearService.getFinancialYearLimits().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res.body.startDate && res.body.endDate) {
                this.createFinancialYearsList(res.body.startDate, res.body.endDate)
            }
        });
    }

    /**
    * Create financial years list for dropdown
    *
    * @private
    * @param {*} startDate
    * @param {*} endDate
    * @memberof VatReportComponent
    */
    private createFinancialYearsList(startDate: any, endDate: any): any {
        if (startDate && endDate) {
            let startYear = startDate.split('-');
            startYear = startYear[startYear?.length - 1];

            let endYear = endDate.split('-');
            endYear = endYear[endYear?.length - 1];

            this.financialYears = [
                { label: startYear, value: startYear },
                { label: endYear, value: endYear }
            ];

            return { startYear: startYear, endYear: endYear };
        }
    }

    /**
     * Handle Currency change dropdown and call VAT Report API
     *
     * @param {*} event
     * @memberof VatReportComponent
     */
    public onCurrencyChange(event: any): void {
        if (event) {
            this.vatReportCurrencyCode = event.value;
            this.getVatReport();
        }
    }
}
