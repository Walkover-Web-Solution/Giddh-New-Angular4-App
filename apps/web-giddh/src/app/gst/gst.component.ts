import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../actions/company.actions';
import { GstReconcileActions } from '../actions/gst-reconcile/GstReconcile.actions';
import { InvoicePurchaseActions } from '../actions/purchase-invoice/purchase-invoice.action';
import { CompanyResponse, StateDetailsRequest } from '../models/api-models/Company';
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
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will check mobile screen size */
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
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };

    public moment = moment;
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
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private _route: Router,
        private _gstAction: GstReconcileActions,
        private _invoicePurchaseActions: InvoicePurchaseActions,
        private _toasty: ToasterService,
        private _cdRf: ChangeDetectorRef,
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
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'gstfiling';

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;

        this._route.events.pipe(filter(route => route instanceof NavigationStart), takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (!event.url.includes('pages/gstfiling')) {
                // Reset the store value
                this.store.dispatch(this._gstAction.SetActiveCompanyGstin(''));
            }
        });

        this.getCurrentPeriod$.subscribe(a => {
            if (a && a.from) {
                let date = {
                    startDate: moment(a.from, GIDDH_DATE_FORMAT).startOf('month').format(GIDDH_DATE_FORMAT),
                    endDate: moment(a.to, GIDDH_DATE_FORMAT).endOf('month').format(GIDDH_DATE_FORMAT)
                };
                if (date.startDate === a.from && date.endDate === a.to) {
                    this.selectedMonth = moment(a.from, GIDDH_DATE_FORMAT).toISOString();
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
                    from: moment().startOf('month').format(GIDDH_DATE_FORMAT),
                    to: moment().endOf('month').format(GIDDH_DATE_FORMAT)
                };
                this.selectedMonth = moment(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
                this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
            }
        });
        this.imgPath = (isElectron || isCordova) ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
                this.loadTaxReport();
            }
        });
    }
    /**
     * Unsubscribes from subscription
     *
     * @memberof GstComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }

    /**
     * periodChanged
     */
    public periodChanged(ev) {
        if (ev && ev.picker) {
            this.currentPeriod = {
                from: moment(ev.picker.startDate._d).format(GIDDH_DATE_FORMAT),
                to: moment(ev.picker.endDate._d).format(GIDDH_DATE_FORMAT)
            };
            this.isMonthSelected = false;
        } else {
            this.currentPeriod = {
                from: moment(ev).startOf('month').format(GIDDH_DATE_FORMAT),
                to: moment(ev).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.selectedMonth = ev;
            this.isMonthSelected = true;
        }
        this.showCalendar = false;
        this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));

        if (this.activeCompanyGstNumber) {
            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;

            if (this.isMonthSelected) {
                // get gstr1 and gstr2 summary
                this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr1, request));
                this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr2, request));
                this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr3b, request));
            } else {
                // only get gstr1 data
                this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr1, request));
            }
        } else {
            this._toasty.warningToast(this.localeData?.gstin_required_error);
        }
        this._cdRf.detectChanges();

    }

    /**
     * navigateToOverview
     */
    public navigateToOverview(type) {
        this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
    * navigateToOverview
    */
    public navigateTogstR3B(type) {
        this._route.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }

    public emailSheet(isDownloadDetailSheet: boolean) {
        if (!this.isMonthSelected) {
            return this._toasty.errorToast(this.localeData?.monthonly_required_error);
        }
        if (!this.userEmail) {
            return this._toasty.errorToast(this.localeData?.email_required_error);
        }
        let check = moment(this.selectedMonth, 'MM-YYYY');
        let monthToSend = check.format('MM') + '-' + check.format('YYYY');
        if (!monthToSend) {
            this._toasty.errorToast(this.localeData?.month_required_error);
        } else if (!this.activeCompanyGstNumber) {
            return this._toasty.errorToast(this.localeData?.gstin_unavailable_error);
        } else {
            this.store.dispatch(this._invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
            this.userEmail = '';
        }
    }

    /**
     * openMonthWiseCalendar
     */
    public openMonthWiseCalendar(ev) {
        if (ev && this.monthWise) {
            ev ? this.monthWise.show() : this.monthWise.hide();
        }
    }

    public navigateToTab(tab, returnType) {
        this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: returnType, from: this.currentPeriod.from, to: this.currentPeriod.to, tab, selectedGst: this.activeCompanyGstNumber } });
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

        this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
        this.loadTaxReport();
    }
    /**
     * this is handle navigation of menu item
     *
     *
     * @memberof GstComponent
     */
    public handleNavigation(type: string): void {
        switch(type) {
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
            this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr1, request));
            this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr2, request));
            this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr3b, request));
        }
    }
}
