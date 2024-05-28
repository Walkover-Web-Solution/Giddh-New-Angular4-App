import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { GeneralService } from '../../services/general.service';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsFinancialYearService } from '../../services/settings.financial-year.service';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { OrganizationType } from '../../models/user-login-state';
import { cloneDeep } from '../../lodash-optimized';
import { GstReconcileService } from '../../services/gst-reconcile.service';

@Component({
    selector: 'vat-report-filters',
    templateUrl: './vat-report-filters.component.html',
    styleUrls: ['./vat-report-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VatReportFiltersComponent implements OnInit, OnChanges {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This will hold active company data */
    @Input() public activeCompany: any = null;
    /** True if active country is UK */
    @Input() public isUKCompany: boolean = false;
    /** True if active country is Zimbabwe */
    @Input() public isZimbabweCompany: boolean = false;
    /** True if active country is Kenya */
    @Input() public isKenyaCompany: boolean = false;
    /** Hold HMRC portal url */
    @Input() public connectToHMRCUrl: string = null;
    /** Holds Current Currency Code for Zimbabwe report */
    @Input() public vatReportCurrencyCode: 'BWP' | 'USD' | 'GBP' | 'INR' | 'EUR' = 'BWP';
    /** Emits Current currency symbol */
    @Output() public currentCurrencySymbol: EventEmitter<any> = new EventEmitter<any>();
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

    /** directive to get reference of element */
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

    constructor(
        private store: Store<AppState>,
        private gstReconcileService: GstReconcileService,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions,
        private modalService: BsModalService,
        public settingsFinancialYearService: SettingsFinancialYearService
    ) {
        this.getFinancialYears();
    }


    /**
     * Initializes the component
     *
     * @memberof VatReportFiltersComponent
     */
    public ngOnInit(): void {
        // Refresh report data according to universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.fromDate.emit(this.from);
                this.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.toDate.emit(this.to);
                this.selectedMonth = "";
                this.selectedYear = "";
                this.year = null;
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.getCurrentCompanyBranches();
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
    * Lifecycle hook which detects any changes in values
    *
    * @param {SimpleChanges} changes
    * @memberof VatReportFiltersComponent
    */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && this.isZimbabweCompany && changes.vatReportCurrencyCode) {
            // Extract Currency symbol by currency code and emits
            this.currentCurrencySymbol.emit(this.vatReportCurrencyList.filter(item => item.label === changes.vatReportCurrencyCode.currentValue).map(item => item.additional.symbol).join());
        }
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
            }
            this.isTaxApiInProgress.emit(false);
            this.taxNumber = this.taxes[0]?.value;
            this.currentTaxNumber.emit(this.taxNumber);
            setTimeout(() => {
                this.getVatReport();
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
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof VatReportFiltersComponent
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
    * @memberof VatReportFiltersComponent
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
     * @memberof VatReportFiltersComponent
     */
    public onCurrencyChange(event: any): void {
        if (event) {
            this.vatReportCurrencyCode = event.value;
            this.currentCurrencyCode.emit(event.value);
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
     * This hook will be use for component destroyed
     *
     * @memberof VatReportFiltersComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
