import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { VatService } from '../../services/vat.service';
import { ToasterService } from '../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface ObligationsStatus {
    label: string;
    value: '' | 'F' | 'O';
}
@Component({
    selector: 'vat-liabilities-payments',
    templateUrl: './vat-liabilities-payments.component.html',
    styleUrls: ['./vat-liabilities-payments.component.scss']
})

export class VatLiabilitiesPayments implements OnInit, OnDestroy {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if current organization is company */
    public isCompanyMode: boolean;
    /** Holds Company Uniquename */
    private companyUniqueName: string;
    /** Holds Branch List */
    public branchList: any;
    /** Holds Tax Number List */
    public taxesList: any;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Instance of bootstrap modal */
    public modalRef: BsModalRef;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Holds true if multiple branches in the company */
    public isMultipleBranch: boolean;
    /** Holds Liabilities-Payment Fromgroup  */
    public searchForm: UntypedFormGroup
    /** Holds Liabilities-Payment table data */
    public tableDataSource: any[] = [];
    /** Holds Payment table columns */
    public paymentColumns: string[] = ["index", "received", "amount"];
    /** Holds Liability table columns */
    public liabilityColumns: string[] = ["index", "from", "to", "originalAmount", "outstandingAmount", "due"];
    /** Holds current table columns */
    public displayColumns: string[] = [];
    /** Hold true if no data found */
    public noDataFound: boolean = true;
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** Holds true if user in vat-payment */
    public isPaymentMode: boolean = true;
    /** selected base currency symbol */
    public baseCurrencySymbol: string = "";
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    constructor(
        private activatedRoute: ActivatedRoute,
        private gstReconcileService: GstReconcileService,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vatService: VatService,
        private toaster: ToasterService,
        private modalService: BsModalService,
        private router: Router,
        private route: Router
    ) {
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && !this.companyUniqueName) {
                this.companyUniqueName = activeCompany.uniqueName;
                this.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
            }
        });
        this.vatSearchForm();
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof VatLiabilitiesPayments
    */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.getUniversalDatePickerDate();
        this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.isPaymentMode = this.router.routerState.snapshot.url.includes('payments');
            this.displayColumns = this.isPaymentMode ? this.paymentColumns : this.liabilityColumns;
            this.noDataFound = true;
            if (this.getFormControl('taxNumber').value) {
                this.getLiabilitiesPayment();
            }
        })
        this.loadTaxDetails();
        this.isCompanyMode = this.generalService.currentOrganizationType === OrganizationType.Company;

        if (this.isCompanyMode) {
            this.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    if (response?.length > 1) {
                        this.isMultipleBranch = true;
                        let unarchivedBranches = response.filter(branch => branch.isArchived === false);
                        this.branchList = unarchivedBranches?.sort(this.generalService.sortBranches);
                        this.branchList = this.branchList.map(branch => {
                            return {
                                label: branch?.alias,
                                value: branch?.uniqueName
                            };
                        });
                    } else {
                        this.isMultipleBranch = false;
                        if (response.uniqueName) {
                            this.getFormControl('branchUniqueName').setValue(response.uniqueName);
                        }
                    }
                }
            });
        } else {
            this.getFormControl('branchUniqueName').setValue(this.generalService.currentBranchUniqueName);
        }
    }

    /**
    * VAT Liabilities/Payments API Call
    *
    * @memberof VatLiabilitiesPayments
    */
    public getLiabilitiesPayment(): void {
        this.isLoading = true;
        this.vatService.getLiabilitiesPaymentList(this.companyUniqueName, this.searchForm.value, this.isPaymentMode ).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response?.status === "success" && (this.isPaymentMode && response?.body?.payments || (!this.isPaymentMode) && response?.body?.liabilities)) {
                this.tableDataSource = this.isPaymentMode ? response?.body?.payments : response?.body?.liabilities;
                this.noDataFound = false;
            } else if (response?.body?.message) {
                this.toaster.showSnackBar('error', response?.body?.message);
            } else if (response?.message) {
                this.toaster.showSnackBar('error', response?.message);
            }
        });
    }

    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
    private vatSearchForm(): void {
        this.searchForm = this.formBuilder.group({
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
            this.getFormControl('taxNumber').setValue(event.value);
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
            this.getFormControl('branchUniqueName').setValue(event.value);
        }
    }

    /**
    * Get Universal Date Observable from Store and subscribed
    *
    * @private
    * @memberof VatLiabilitiesPayments
    */
    private getUniversalDatePickerDate(): void {
        this.store.pipe(select(stateStore => stateStore.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.getFormControl('from').setValue(dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT));
                this.getFormControl('to').setValue(dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT));
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
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.length) {
                this.taxesList = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
                if (this.taxesList.length === 1) {
                    this.getFormControl('taxNumber').patchValue(this.taxesList[0].value);
                }
                this.getLiabilitiesPayment();
            }
        });
    }

    /**
    * This will be use for show datepicker
    *
    * @param {*} element
    * @memberof VatLiabilitiesPayments
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
    * This will be use for hide datepicker
    *
    * @memberof VatLiabilitiesPayments
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof VatLiabilitiesPayments
    */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.getFormControl('from').setValue(dayjs(value.startDate).format(GIDDH_DATE_FORMAT));
            this.getFormControl('to').setValue(dayjs(value.endDate).format(GIDDH_DATE_FORMAT));
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
        return this.searchForm.get(control)
    }

    /**
  * Handles GST Sidebar Navigation
  *
  * @memberof VatLiabilitiesPayments
  */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
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
        this.asideGstSidebarMenuState === 'out'
    }
}
