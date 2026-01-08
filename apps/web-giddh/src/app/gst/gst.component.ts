import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../actions/gst-reconcile/gst-reconcile.actions';
import { InvoicePurchaseActions } from '../actions/purchase-invoice/purchase-invoice.action';
import { CompanyResponse } from '../models/api-models/Company';
import { GstOverViewRequest } from '../models/api-models/GstReconcile';
import { OrganizationType } from '../models/user-login-state';
import { GeneralService } from '../services/general.service';
import { GstReconcileService } from '../services/gst-reconcile.service';
import { ToasterService } from '../services/toaster.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MONTH_YEAR, GIDDH_DATE_FORMAT_WITH_SPACE } from '../shared/helpers/defaultDateFormat';
import { AppState } from '../store';
import { IOption } from '../app.constant';
import { GstReport } from './constants/gst.constant';
import { FormControl } from '@angular/forms';
import { ServiceConfig } from '../services/service.config';
@Component({
    templateUrl: './gst.component.html',
    styleUrls: ['./gst.component.scss']
})
export class GstComponent implements OnInit, OnDestroy {
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    public showCalendar: boolean = false;
    public period: any = null;
    public companies: CompanyResponse[] = [];
    public activeCompanyGstNumber = '';
    public gstAuthenticated$: Observable<boolean>;
    public gstr1TransactionCounts$: Observable<number>;
    public gstr1TransactionCounts: number = 0;
    public gstr1OverviewDataInProgress$: Observable<boolean>;
    public gstr2TransactionCounts$: Observable<number>;
    public gstr2TransactionCounts: number = 0;
    public gstr2OverviewDataInProgress$: Observable<boolean>;
    public getCurrentPeriod$: Observable<any> = of(null);
    public imgPath: string = '';
    public isMonthSelected: boolean = true;
    public datePickerOptions: any = {
        alwaysShowCalendars: true,
        startDate: dayjs().subtract(30, 'day'),
        endDate: dayjs()
    };
    public dayjs = dayjs;
    public currentPeriod: any = {};
    public selectedMonth: any = null;
    public userEmail: string = '';
    public returnGstr3B: {} = { via: null };
    /** Stores the tax details of a company */
    public taxes: IOption[] = [];
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Custom selected month */
    public customMonth: string = '';
    /** Holds start month/year */
    public startAt: Date = new Date();
    /** Holds selected date */
    public date: FormControl<string | null> = new FormControl<string | null>('');
    /** Holds  "MMMM YYYY"  date format string*/
    public giddhDateFormatMonthYear: string = GIDDH_DATE_FORMAT_MONTH_YEAR;
    /** Holds  "DD MMM YYYY"  date format string*/
    public giddhDateFormatWithSpace: string = GIDDH_DATE_FORMAT_WITH_SPACE;

    constructor(
        private store: Store<AppState>,
        private route: Router,
        private gstAction: GstReconcileActions,
        private invoicePurchaseActions: InvoicePurchaseActions,
        private toasty: ToasterService,
        private cdRf: ChangeDetectorRef,
        @Inject(ServiceConfig) private serviceConfig,
        private gstReconcileService: GstReconcileService,
        private generalService: GeneralService
    ) {
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.gstr1TransactionCounts$ = this.store.pipe(select(s => s.gstR.gstr1OverViewData.count), takeUntil(this.destroyed$));
        this.gstr2TransactionCounts$ = this.store.pipe(select(s => s.gstR.gstr2OverViewData.count), takeUntil(this.destroyed$));
        this.gstr1OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataInProgress), takeUntil(this.destroyed$));
        this.gstr2OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataInProgress), takeUntil(this.destroyed$));
        this.getCurrentPeriod$ = this.store.pipe(select(p => p.gstR.currentPeriod), take(1));

        this.gstr1TransactionCounts$.subscribe(s => {
            this.gstr1TransactionCounts = s;
        });

        this.gstr2TransactionCounts$.subscribe(s => {
            this.gstr2TransactionCounts = s;
        });
    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.loadTaxDetails();
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.getCurrentPeriod$.subscribe(a => {
            if (a && a.from) {
                let date = {
                    startDate: dayjs(a.from, GIDDH_DATE_FORMAT).startOf('month').format(GIDDH_DATE_FORMAT),
                    endDate: dayjs(a.to, GIDDH_DATE_FORMAT).endOf('month').format(GIDDH_DATE_FORMAT)
                };
                if (date.startDate === a.from && date.endDate === a.to) {
                    this.selectedMonth = dayjs(a.from, GIDDH_DATE_FORMAT).toISOString();
                    this.date.setValue(dayjs(this.selectedMonth).format(GIDDH_DATE_FORMAT_MONTH_YEAR));
                    this.isMonthSelected = true;
                } else {
                    this.isMonthSelected = false;
                }
                this.currentPeriod = {
                    from: a.from,
                    to: a.to
                };
            } else {
                this.currentPeriod = {
                    from: dayjs().startOf('month').format(GIDDH_DATE_FORMAT),
                    to: dayjs().endOf('month').format(GIDDH_DATE_FORMAT)
                };
                this.selectedMonth = dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
                this.date.setValue(dayjs(this.selectedMonth).format(GIDDH_DATE_FORMAT_MONTH_YEAR));
                this.store.dispatch(this.gstAction.SetSelectedPeriod(this.currentPeriod));
            }
        });
        this.imgPath = isElectron ? 'assets/images/gst/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/gst/';
    }
    /**
     * Unsubscribes from subscription
     *
     * @memberof GstComponent
     */
    public ngOnDestroy(): void {
        this.store.dispatch(this.gstAction.resetGstr1OverViewResponse());
        this.store.dispatch(this.gstAction.resetGstr2OverViewResponse());
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }

    /**
     * Period Changed
     *
     * @param {*} date
     * @memberof GstComponent
     */
    public periodChanged(date: any): void {
        this.currentPeriod = {
            from: dayjs(date?.from).format(GIDDH_DATE_FORMAT),
            to: dayjs(date?.to).format(GIDDH_DATE_FORMAT)
        };
        this.isMonthSelected = true;
        this.store.dispatch(this.gstAction.SetSelectedPeriod(this.currentPeriod));

        if (this.activeCompanyGstNumber) {
            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;

            if (this.isMonthSelected) {
                // get gstr1 and gstr2 summary
                this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr1, request));
                this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr2, request));
                this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr3b, request));
            } else {
                // only get gstr1 data
                this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr1, request));
            }
        } else {
            this.toasty.showSnackBar('warning', this.localeData?.gstin_required_error);
        }
        this.cdRf.detectChanges();
    }

    /**
     * Navigate To Overview
     *
     * @param {*} type
     * @memberof GstComponent
     */
    public navigateToOverview(type) {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Navigate to GSTR3B
     *
     * @param {*} type
     * @memberof GstComponent
     */
    public navigateTogstR3B(type) {
        this.route.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }

    public emailSheet(isDownloadDetailSheet: boolean) {
        if (!this.isMonthSelected) {
            return this.toasty.showSnackBar('error', this.localeData?.monthonly_required_error);
        }
        if (!this.userEmail) {
            return this.toasty.showSnackBar('error', this.localeData?.email_required_error);
        }
        let check = dayjs(this.selectedMonth, 'MM-YYYY');
        let monthToSend = check.format('MM') + '-' + check.format('YYYY');
        if (!monthToSend) {
            this.toasty.showSnackBar('error', this.localeData?.month_required_error);
        } else if (!this.activeCompanyGstNumber) {
            return this.toasty.showSnackBar('error', this.localeData?.gstin_unavailable_error);
        } else {
            this.store.dispatch(this.invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
            this.userEmail = '';
        }
    }

    public navigateToTab(tab, returnType) {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: returnType, from: this.currentPeriod.from, to: this.currentPeriod.to, tab, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Select tax handler
     *
     * @param {*} [event]
     * @memberof GstComponent
     */
    public selectTax(event?: any): void {
        if (event && event.value) {
            this.activeCompanyGstNumber = event.value;
        }

        this.store.dispatch(this.gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
        this.loadTaxReport();
    }

    /**
     * this is handle navigation of menu item
     *
     *
     * @memberof GstComponent
     */
    public handleNavigation(type: string): void {
        switch (type) {
            case GstReport.Gstr1: case GstReport.Gstr2:
                this.navigateToOverview(type);
                break;
            case GstReport.Gstr3b:
                this.navigateTogstR3B(type);
                break;
            default: break;
        }
    }

    /**
     * Loads the tax details of a company
     *
     * @private
     * @memberof GstComponent
     */
    private loadTaxDetails(): void {
        this.isTaxApiInProgress = true;
        this.activeCompanyGstNumber = "";
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.taxes = response.body?.map(tax => ({
                    label: tax,
                    value: tax
                }));

                if (!this.activeCompanyGstNumber && this.taxes?.length > 0) {
                    this.activeCompanyGstNumber = this.taxes[0]?.value;
                }
            }
            this.isTaxApiInProgress = false;
            this.loadTaxReport();
        });
    }

    /**
     * Loads the tax reports
     *
     * @private
     * @memberof GstComponent
     */
    private loadTaxReport(): void {
        if (this.activeCompanyGstNumber) {
            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;
            this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr1, request));
            this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr2, request));
            this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr3b, request));
        }
    }

    /**
    * Selects date and call api
    *
    * @param {*} event
    * @memberof GstComponent
    */
    public dateSelected(event: any): void {
        this.customMonth = event[0].toLocaleString('en-us', { month: 'long', year: 'numeric' });
        this.date.setValue(this.customMonth);
        this.periodChanged({ from: event[0], to: event[1] });
    }

    /**
     * Sets month/year
     *
     * @param {*} date - Selected date from giddh-datepicker
     * @memberof GstComponent
     */
    public setMonthAndYear(date: any): void {
        const selectedMonth = new Date(date);
        const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
        this.dateSelected([firstDay, lastDay]);
    }
}
