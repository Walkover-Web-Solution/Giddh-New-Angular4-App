import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { merge, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES, RestrictedModules } from '../../app.constant';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasterService } from '../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VatReportComponentStore } from '../utility/vat.report.store';
import { cloneDeep } from '../../lodash-optimized';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Angular21ChangeDetectionService } from '../../services/angular21-change-detection.service';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

@Component({
    selector: 'vat-liabilities-payments',
    templateUrl: './vat-liabilities-payments.component.html',
    styleUrls: ['./vat-liabilities-payments.component.scss'],
    providers: [VatReportComponentStore],
    standalone:false
})

export class VatLiabilitiesPayments implements OnInit, OnDestroy {
    /** Directive to get reference of datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if current organization is company */
    public isCompanyMode: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds Branch List */
    public branchList: any;
    /** Holds Tax Number List */
    public taxesList: any;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
/** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Observable to store the data source of Liability Payment */
    public liabilityPaymentList$: Observable<any> = this.componentStore.select(state => state.liabilityPaymentList);
    /** Observable to store the Tax Number */
    public taxNumber$: Observable<any> = this.componentStore.select(state => state.taxNumber);
    /** Holds true if multiple branches in the company */
    public isMultipleBranch: boolean;
    /** Holds Liabilities Payment Formgroup  */
    public searchForm: FormGroup;
    /** Holds table data source */
    public dataSource = signal<any[]>([]);
    /** Holds Payment table columns */
    public paymentColumns: string[] = ["index", "received", "amount"];
    /** Holds Liability table columns */
    public liabilityColumns: string[] = ["index", "from", "to", "originalAmount", "outstandingAmount", "type", "due", "action"];
    /** Holds current table columns */
    public displayColumns: string[] = [];
    /** Holds true if user in vat-payment */
    public isPaymentMode: boolean;
    /** Stores the current company */
    public activeCompany: any = {};
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    /** True if current company or branch has tax number */
    public hasTaxNumber: boolean | null = null;
    /** Holds current branch information */
    private currentBranch: any = {};
    /** Hold true in production environment */
    public isProdMode: boolean = environment.PRODUCTION_ENV;
    /** Hold HMRC portal url */
    public connectToHMRCUrl: string = null;
    /** True if API Call is in progress */
    public isLoading = signal<boolean>(false);
    /** Observable to store the HMRC portal url */
    public connectToHMRCUrl$ = this.componentStore.select(state => state.connectToHMRCUrl);
    /** Observable to store the initiate payment in progress status */
    public initiatePaymentInProgress$ = this.componentStore.select(state => state.initiatePaymentInProgress);
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** True if tax modules is restricted */
    public isTaxRestrictedModule: boolean = true;
    /** Holds pending payment row */
    public pendingPayRow: any = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private generalService: GeneralService,
        private toaster: ToasterService,
        private router: Router,
        private componentStore: VatReportComponentStore,
        private store: Store<AppState>
    ) {
        this.initVatLiabilityPaymentForm();
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.isTaxRestrictedModule = activeCompany?.subscription?.planDetails?.restrictedModules.hasOwnProperty(this.restrictedModules.TaxFilling);
                this.getFormControl('companyUniqueName').patchValue(activeCompany.uniqueName);
            }
        });
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof VatLiabilitiesPayments
    */
    public ngOnInit(): void {
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.getUniversalDatePickerDate();
        this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.isPaymentMode = this.router.routerState.snapshot.url.includes('payments');
            this.displayColumns = this.isPaymentMode ? this.paymentColumns : this.liabilityColumns;
        });
        this.liabilityPaymentList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if ((this.isPaymentMode && response?.body?.payments) || ((!this.isPaymentMode) && response?.body?.liabilities)) {
                this.dataSource.set(this.isPaymentMode ? response.body.payments : response.body.liabilities);
            } else if (response?.body?.message) {
                this.toaster.showSnackBar('error', response.body.message);
            } else if (response?.message) {
                this.toaster.showSnackBar('error', response.message);
            }
        });

        this.isCompanyMode = this.generalService.currentOrganizationType === OrganizationType.Company;
        if (this.isCompanyMode || this.isConsolidatedBranch) {
            this.loadTaxDetails();
            this.componentStore.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    if (response?.length > 1) {
                        this.isMultipleBranch = true;
                        let unarchivedBranches = response.filter(branch => branch.isArchived === false);
                        this.branchList = unarchivedBranches?.sort(this.generalService.sortBranches);
                        this.branchList = this.branchList.map(branch => {
                            return {
                                label: branch?.name,
                                value: branch?.uniqueName
                            };
                        });
                    } else {
                        this.isMultipleBranch = false;
                        if (response.uniqueName) {
                            this.getFormControl('branchUniqueName').patchValue(response.uniqueName);
                        }
                    }
                }
            });
        } else {
            this.getFormControl('branchUniqueName').patchValue(this.generalService.currentBranchUniqueName);
            this.getCurrentCompanyBranchTaxNumber();
        }
        this.taxNumber$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.length) {
                this.taxesList = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
                if (this.taxesList.length === 1) {
                    this.getFormControl('taxNumber').patchValue(this.taxesList[0].value);
                }
                if (this.isCompanyMode || this.isConsolidatedBranch) {
                    this.hasTaxNumber = true;
                }
                if (!this.isTaxRestrictedModule) {
                    this.getURLHMRCAuthorization();
                }
            }
        });

        this.connectToHMRCUrl$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response?.body) {
                    this.connectToHMRCUrl = response.body;
                } else {
                    this.getLiabilitiesPayment();
                }
            }
        });

        merge(this.componentStore.liabilityPaymentListInProgress$, this.componentStore.getTaxNumberInProgress$, this.componentStore.getHMRCInProgress$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading.set(response);
            });

        this.componentStore.initiatePaymentResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success' && response?.body?.nextUrl) {
                const currentData = [...this.dataSource()];
                const rowIndex = currentData.findIndex(r => r?.taxPeriod?.from === this.pendingPayRow?.taxPeriod?.from && r?.taxPeriod?.to === this.pendingPayRow?.taxPeriod?.to);
                if (rowIndex !== -1) {
                    currentData[rowIndex] = { ...currentData[rowIndex], paymentStatus: response.body.status };
                    this.dataSource.set(currentData);
                }
                window.location.href = response.body.nextUrl;
                setTimeout(() => {
                    this.isLoading.set(true);
                }, 200);
            }
        });
    }

    /**
     * Initiates VAT payment for a liability row
     *
     * @param {*} row Liability row data
     * @memberof VatLiabilitiesPayments
     */
    public payNow(row: any): void {
        this.pendingPayRow = row;
        const taxNumber = this.getFormControl('taxNumber').value;
        let payload = this.generalService.getUserAgentData();
        payload = {
            ...payload,
            reference: taxNumber,
            amountInPence: row?.outstandingAmount ?? 0,
            periodFrom: row?.taxPeriod?.from,
            periodTo: row?.taxPeriod?.to
        };
        if (!this.isProdMode) {
            payload["Gov-Test-Scenario"] = "MULTIPLE_PAYMENTS_2018_19";
        }
        this.componentStore.initiatePayment({ companyUniqueName: this.activeCompany.uniqueName, payload });
    }

    /**
     * Navigates to the page for buy plan.
     * @param subscriptionId
     * @memberof  VatLiabilitiesPayments
     */
    public buyPlan(subscriptionId: string): void {
        if (subscriptionId) {
            this.router.navigate(['pages', 'user-details', 'subscription', 'buy-plan', subscriptionId]);
        }
    }
    /**
    * Get Current company branches information
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
    private getCurrentCompanyBranchTaxNumber(): void {
        this.componentStore.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                this.hasTaxNumber = this.currentBranch?.addresses?.filter(address => address?.taxNumber?.length > 0)?.length > 0;
                if (this.hasTaxNumber) {
                    this.loadTaxDetails();
                }
            }
        });
    }

    /**
    * VAT Liabilities/Payments API Call
    *
    * @memberof VatLiabilitiesPayments
    */
    public getLiabilitiesPayment(): void {
        let payload = this.generalService.getUserAgentData();
        if (!this.isProdMode) {
            payload["Gov-Test-Scenario"] = "MULTIPLE_PAYMENTS_2018_19";
        }
        this.componentStore.getLiabilityPaymentList({ payload: payload, searchForm: this.searchForm.value, isPaymentMode: this.isPaymentMode });
    }

    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
    private initVatLiabilityPaymentForm(): void {
        this.searchForm = this.formBuilder.group({
            companyUniqueName: [""],
            branchUniqueName: [''],
            taxNumber: [''],
            from: [''],
            to: ['']
        });
    }

    /**
    * Handle Dropdown callback for Tax Number and save value to form
    *
    * @param {*} event
    * @memberof VatLiabilitiesPayments
    */
    public taxNumberSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('taxNumber').patchValue(event.value);
        }
    }

    /**
    * Handle Dropdown callback for Branch and save value to form
    *
    * @param {*} event
    * @memberof VatLiabilitiesPayments
    */
    public branchSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('branchUniqueName').patchValue(event.value);
        }
    }

    /**
    * Get Universal Date Observable from Store and subscribed
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
    private getUniversalDatePickerDate(): void {
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.getFormControl('from').patchValue(dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT));
                this.getFormControl('to').patchValue(dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT));
                if (this.getFormControl('taxNumber').value) {
                    this.getLiabilitiesPayment();
                }
            }
        });
    }

    /**
    * Loads the tax details of a company
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
    private loadTaxDetails(): void {
        this.componentStore.getTaxNumber();
    }

    /**
     * This will toggle the datepicker
     *
     * @param {boolean} isOpen Set to true to open the datepicker, false to close it
     * @memberof VatLiabilitiesPayments
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (this.universalDatepickerTrigger) {
            if (isOpen) {
                this.universalDatepickerTrigger.openMenu();
            } else {
                this.universalDatepickerTrigger.closeMenu();
            }
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value Selected date range object
     * @memberof VatLiabilitiesPayments
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
            this.getFormControl('from').patchValue(dayjs(value.startDate).format(GIDDH_DATE_FORMAT));
            this.getFormControl('to').patchValue(dayjs(value.endDate).format(GIDDH_DATE_FORMAT));
        }
    }

    /**
    * Used to get and set form control value
    *
    * @param {string} control
    * @returns {*}
    * @memberof VatLiabilitiesPayments
    */
    public getFormControl(control: string): any {
        return this.searchForm.get(control);
    }

    /**
     * This will call API to get HMRC get authorization url
     *
     * @memberof VatLiabilitiesPayments
     */
    public getURLHMRCAuthorization(): void {
        this.componentStore.getHMRCAuthorization(this.activeCompany.uniqueName);
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof VatLiabilitiesPayments
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState = false;
    }
}
