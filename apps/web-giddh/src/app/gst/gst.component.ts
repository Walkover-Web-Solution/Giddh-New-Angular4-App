import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../actions/gst-reconcile/GstReconcile.actions';
import { InvoicePurchaseActions } from '../actions/purchase-invoice/purchase-invoice.action';
import { CompanyResponse } from '../models/api-models/Company';
import { GstOverViewRequest } from '../models/api-models/GstReconcile';
import { OrganizationType } from '../models/user-login-state';
import { GeneralService } from '../services/general.service';
import { GstReconcileService } from '../services/GstReconcile.service';
import { ToasterService } from '../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { AppState } from '../store';
import { IOption } from '../theme/ng-select/ng-select';
import { GstReport } from './constants/gst.constant';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
    templateUrl: './gst.component.html',
    styleUrls: ['./gst.component.scss'],
    providers: [
        {
            provide: AlertConfig, useValue: {}
        }
    ],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in <=> out', animate('400ms ease-in-out')),
        ])
    ]
})
export class GstComponent implements OnInit, OnDestroy {
    @ViewChild('monthWise', { static: true }) public monthWise: BsDropdownDirective;
    @ViewChild('periodDropdown', { static: true }) public periodDropdown;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Aside pane state*/
    public asideMenuState: string = 'out';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
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
    public datepickerVisibility: any = 'hidden';
    /** Stores the tax details of a company */
    public taxes: IOption[] = [];
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
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

    constructor(
        private store: Store<AppState>,
        private route: Router,
        private gstAction: GstReconcileActions,
        private invoicePurchaseActions: InvoicePurchaseActions,
        private toasty: ToasterService,
        private cdRf: ChangeDetectorRef,
        private gstReconcileService: GstReconcileService,
        private generalService: GeneralService,
        private breakpointObserver: BreakpointObserver
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
        this.loadTaxDetails();

        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;

        this.getCurrentPeriod$.subscribe(a => {
            if (a && a.from) {
                let date = {
                    startDate: dayjs(a.from, GIDDH_DATE_FORMAT).startOf('month').format(GIDDH_DATE_FORMAT),
                    endDate: dayjs(a.to, GIDDH_DATE_FORMAT).endOf('month').format(GIDDH_DATE_FORMAT)
                };
                if (date.startDate === a.from && date.endDate === a.to) {
                    this.selectedMonth = dayjs(a.from, GIDDH_DATE_FORMAT).toISOString();
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
                this.store.dispatch(this.gstAction.SetSelectedPeriod(this.currentPeriod));
            }
        });
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
                this.loadTaxReport();
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
        this.asideGstSidebarMenuState = 'out';
    }

    /**
     * Period Changed
     *
     * @param {*} ev
     * @memberof GstComponent
     */
    public periodChanged(ev) {
        if (ev && ev.picker) {
            this.currentPeriod = {
                from: dayjs(ev.picker.startDate.d).format(GIDDH_DATE_FORMAT),
                to: dayjs(ev.picker.endDate.d).format(GIDDH_DATE_FORMAT)
            };
            this.isMonthSelected = false;
        } else {
            this.currentPeriod = {
                from: dayjs(ev).startOf('month').format(GIDDH_DATE_FORMAT),
                to: dayjs(ev).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.selectedMonth = ev;
            this.isMonthSelected = true;
        }
        this.showCalendar = false;
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
            this.toasty.warningToast(this.localeData?.gstin_required_error);
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
            return this.toasty.errorToast(this.localeData?.monthonly_required_error);
        }
        if (!this.userEmail) {
            return this.toasty.errorToast(this.localeData?.email_required_error);
        }
        let check = dayjs(this.selectedMonth, 'MM-YYYY');
        let monthToSend = check.format('MM') + '-' + check.format('YYYY');
        if (!monthToSend) {
            this.toasty.errorToast(this.localeData?.month_required_error);
        } else if (!this.activeCompanyGstNumber) {
            return this.toasty.errorToast(this.localeData?.gstin_unavailable_error);
        } else {
            this.store.dispatch(this.invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
            this.userEmail = '';
        }
    }

    /**
     * Open Month Wise Calendar
     *
     * @param {*} ev
     * @memberof GstComponent
     */
    public openMonthWiseCalendar(ev) {
        if (ev && this.monthWise) {
            ev ? this.monthWise.show() : this.monthWise.hide();
        }
    }

    public navigateToTab(tab, returnType) {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: returnType, from: this.currentPeriod.from, to: this.currentPeriod.to, tab, selectedGst: this.activeCompanyGstNumber } });
    }

    public onOpenChange(data: boolean) {
        this.openMonthWiseCalendar(data);
    }

    public updateDatepickerVisibility(visibility) {
        this.datepickerVisibility = visibility;
    }

    public checkIfDatepickerVisible() {
        setTimeout(() => {
            if (this.datepickerVisibility === "hidden") {
                this.periodDropdown.hide();
            }
        }, 500);
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
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.taxes = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));

                if (!this.activeCompanyGstNumber && this.taxes?.length > 0) {
                    this.activeCompanyGstNumber = this.taxes[0].value;
                    this.selectTax();
                }
            }
            this.isTaxApiInProgress = false;
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
}
