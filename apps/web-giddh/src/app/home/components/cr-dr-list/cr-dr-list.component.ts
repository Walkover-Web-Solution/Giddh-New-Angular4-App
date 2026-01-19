import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, ReplaySubject, of } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { takeUntil } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { GeneralService } from '../../../services/general.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { OrganizationType } from '../../../models/user-login-state';
import { cloneDeep } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'cr-dr-list',
    templateUrl: 'cr-dr-list.component.html',
    styleUrls: ['./cr-dr-list.component.scss', '../../home.component.scss'],
    standalone: false
})
/**
 * CrDrComponent component
 * Handles crdr functionality and user interactions
 */
export class CrDrComponent implements OnInit, OnDestroy {
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public dayjs = dayjs;
    public toDate: string;
    public fromDate: string;
    public crAccounts: any[] = [];
    public drAccounts: any[] = [];
    public showRecords: number = 5;
    public dueDate: any;
    public activeCompany: any = {};
    /** This will store the dates returned by api */
    public apiFromDate: string;
    public apiToDate: string;
    /** True, if universal date should only be used once for initializing */
    @Input() initializeDateWithUniversalDate: boolean;
    /** True, if date picker initialization with universal date is successful */
    public isDatePickerInitialized: boolean;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds giddh round off function instance */
    public giddhRoundOff: any = giddhRoundOff;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** This will use for table heading */
    public displayedColumns: string[] = ['name', 'latestInvoiceDate', 'latestBillAmount', 'closingBalance'];
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, private contactService: ContactService, private cdRef: ChangeDetectorRef, private generalService: GeneralService) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil((this.initializeDateWithUniversalDate) ? of(this.isDatePickerInitialized) : this.destroyed$));

        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            /**
             * Handles if functionality
             */
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        this.universalDate$.subscribe(dateObj => {
            /**
             * Handles if functionality
             */
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.dueDate = new Date(dayjs(universalDate[1]).format('YYYY-MM-DD'));
                this.isDatePickerInitialized = true;
                this.getAccountsReport();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response.length > 1;
            }
        });

        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
    }

    /**
     * Retrieves accounts data
     */
    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
        this.isLoading = true;
        this.drAccounts = [];
        this.crAccounts = [];
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';

        this.contactService.GetContactsDashboard(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            /**
             * Handles if functionality
             */
            if (res?.status === 'success') {
                /**
                 * Handles if functionality
                 */
                if (groupUniqueName === "sundrydebtors") {
                    this.drAccounts = res.body?.results;
                }
                /**
                 * Handles if functionality
                 */
                if (groupUniqueName === "sundrycreditors") {
                    this.crAccounts = res.body?.results;
                }

                /**
                 * Handles if functionality
                 */
                if (!(this.fromDate && this.toDate) && res.body && res.body.results && res.body.results.fromDate && res.body.results.toDate) {
                    this.apiFromDate = res.body.results.fromDate;
                    this.apiToDate = res.body.results.toDate;

                    this.apiFromDate = this.apiFromDate.split("-").reverse().join("-");
                    this.apiToDate = this.apiToDate.split("-").reverse().join("-");

                    this.selectedDateRange = { startDate: dayjs(this.apiFromDate), endDate: dayjs(this.apiToDate) };
                    this.selectedDateRangeUi = dayjs(this.apiFromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.apiToDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = dayjs(this.apiFromDate).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(this.apiToDate).format(GIDDH_DATE_FORMAT);
                }

                this.cdRef.detectChanges();
            }
            this.isLoading = false;
        });
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Retrieves accountsreport data
     */
    public getAccountsReport() {
        /**
         * Handles if functionality
         */
        if (!this.fromDate || !this.toDate) {
            this.fromDate = "";
            this.toDate = "";
        }

        this.getAccounts(this.fromDate, this.toDate, 'sundrydebtors', null, null, 'true', this.showRecords, '', 'closingBalance', 'desc');
        this.getAccounts(this.fromDate, this.toDate, 'sundrycreditors', null, null, 'true', this.showRecords, '', 'closingBalance', 'desc');
    }

    /**
     * Handles changeShowRecords functionality
     */
    public changeShowRecords(showRecords) {
        this.showRecords = showRecords;
        this.getAccountsReport();
    }

    /**
     * Retrieves filterdate data
     */
    public getFilterDate(dates: any) {
        /**
         * Handles if functionality
         */
        if (dates !== null) {
            this.dueDate = new Date(dates[1].split("-").reverse().join("-"));
            this.fromDate = dates[0];
            this.toDate = dates[1];
            this.getAccountsReport();
        }
    }

    /**
     * Toggles the datepicker
     * @param {boolean} isOpen - If true, opens the datepicker; if false, closes it
     * @memberof CrDrComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        /**
         * Handles if functionality
         */
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
    * @memberof ProfitLossComponent
    */
    public dateSelectedCallback(value?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.dueDate = new Date(this.toDate.split("-").reverse().join("-"));
            this.getAccountsReport();
        }
    }
}
