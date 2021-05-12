import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import {
    Gstr3bOverviewResult,
    GstOverViewRequest,
    GstDatePeriod,
    GstrSheetDownloadRequest,
    Gstr3bOverviewResult2
} from '../../models/api-models/GstReconcile';
import { takeUntil, take } from 'rxjs/operators';
import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from '../../store';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { GstReconcileActions } from '../../actions/gst-reconcile/GstReconcile.actions';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { InvoicePurchaseActions } from '../../actions/purchase-invoice/purchase-invoice.action';
import { GstReport } from '../constants/gst.constant';


@Component({
    selector: 'file-gstr3',
    templateUrl: './gstR3.component.html',
    styleUrls: ['gstR3.component.scss'],
})
export class FileGstR3Component implements OnInit, OnDestroy {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;

    public gstr3BData: Gstr3bOverviewResult2;
    public currentPeriod: GstDatePeriod = null;
    public selectedGstr: string = null;
    public gstNumber: string = null;
    public activeCompanyGstNumber: string = '';
    public selectedMonth: any = null;
    public selectedGstr3BTab: string = 'pushGSTN';
    public returnGstr3B: {} = { via: null };
    public gstFileSuccess$: Observable<boolean> = of(false);
    public fileReturnSucces: boolean = false;
    public showTaxPro: boolean = true;
    public gstAuthenticated$: Observable<boolean>;
    public gstAuthenticated: boolean = false;
    public dateSelected: boolean = false;
    public userEmail: string = '';
    public selectedMMYYYY: string = '';
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;

    private gstr3BOverviewDataFetchedSuccessfully$: Observable<boolean>;
    private gstr3BOverviewDataFetchedInProgress$: Observable<boolean>;
    private gstr3BOverviewData$: Observable<Gstr3bOverviewResult2>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private _toasty: ToasterService,
        private _gstAction: GstReconcileActions,
        private activatedRoute: ActivatedRoute,
        private _invoicePurchaseActions: InvoicePurchaseActions,
    ) {
        //
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.gstr3BOverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr3BOverViewDataFetchedSuccessfully, takeUntil(this.destroyed$)));
        this.gstr3BOverviewData$ = this.store.pipe(select(p => p.gstR.gstr3BOverViewDate), takeUntil(this.destroyed$));
        this.gstFileSuccess$ = this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$));
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
        this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);
    }
    /**
    * Aside pane toggle fixed class
    *
    *
    * @memberof FileGstR3Component
    */
    public toggleBodyClass(): void {
        if (this.asideGstSidebarMenuState === 'in') {
            document.querySelector('body').classList.add('gst-sidebar-open');
        } else {
            document.querySelector('body').classList.remove('gst-sidebar-open');
        }
    }
    /**
      * This will toggle the settings popup
      *
      * @param {*} [event]
      * @memberof FileGstR3Component
      */
    public toggleGstPane(event?): void {
        this.toggleBodyClass();

        if (this.isMobileScreen && event && this.asideGstSidebarMenuState === 'in') {
            this.asideGstSidebarMenuState = "out";
        }
    }

    public ngOnInit(): void {
        this.toggleGstPane();
        this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
            this.currentPeriod = {
                from: params['from'],
                to: params['to']
            };
            if (params['selectedGst']) {
                this.activeCompanyGstNumber = params['selectedGst'];
                this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
            }
            this.isCompany = params['isCompany'] === 'true';
            this.selectedMonth = moment(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
            this.selectedMonth = moment(this.selectedMonth).format('MMMM YYYY');
            this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
            this.selectedGstr = params['return_type'];
        });

        this.gstAuthenticated$.subscribe((a) => this.gstAuthenticated = a);
        this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                this.activeCompanyGstNumber = result;
            }

            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;

            this.gstr3BOverviewDataFetchedSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe(bool => {
                if (!bool && !this.dateSelected) {
                    this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr3b, request));
                }
            });
        });

        this.store.pipe(select(p => p.gstR.gstr3BOverViewDate), takeUntil(this.destroyed$)).subscribe((response: Gstr3bOverviewResult2) => {

            if (response) {
                this.gstr3BData = response;
                if (this.gstr3BData.ret_period) {
                    this.selectedMMYYYY = this.gstr3BData.ret_period
                }
                if (this.gstr3BData) {

                    if (this.gstr3BData.sup_details) {
                        this.gstr3BData.sumTaxVal =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.txval ? this.gstr3BData.sup_details.osup_det.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.txval ? this.gstr3BData.sup_details.isup_rev.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.txval ? this.gstr3BData.sup_details.osup_nil_exmp.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.txval ? this.gstr3BData.sup_details.osup_nongst.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.txval ? this.gstr3BData.sup_details.osup_zero.txval : 0) : 0));

                        this.gstr3BData.sumIamtVal =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.iamt ? this.gstr3BData.sup_details.osup_det.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.iamt ? this.gstr3BData.sup_details.isup_rev.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.iamt ? this.gstr3BData.sup_details.osup_nil_exmp.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.iamt ? this.gstr3BData.sup_details.osup_nongst.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.iamt ? this.gstr3BData.sup_details.osup_zero.iamt : 0) : 0));

                        this.gstr3BData.sumCamtval =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.camt ? this.gstr3BData.sup_details.osup_det.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.camt ? this.gstr3BData.sup_details.isup_rev.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.camt ? this.gstr3BData.sup_details.osup_nil_exmp.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.camt ? this.gstr3BData.sup_details.osup_nongst.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.camt ? this.gstr3BData.sup_details.osup_zero.camt : 0) : 0));

                        this.gstr3BData.sumSamtval =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.samt ? this.gstr3BData.sup_details.osup_det.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.samt ? this.gstr3BData.sup_details.isup_rev.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.samt ? this.gstr3BData.sup_details.osup_nil_exmp.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.samt ? this.gstr3BData.sup_details.osup_nongst.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.samt ? this.gstr3BData.sup_details.osup_zero.samt : 0) : 0));

                        this.gstr3BData.sumCsamtval =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.csamt ? this.gstr3BData.sup_details.osup_det.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.csamt ? this.gstr3BData.sup_details.isup_rev.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.csamt ? this.gstr3BData.sup_details.osup_nil_exmp.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.csamt ? this.gstr3BData.sup_details.osup_nongst.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.csamt ? this.gstr3BData.sup_details.osup_zero.csamt : 0) : 0));
                    }
                }
            }
        });
    }

    public periodChanged(ev) {
        if (ev) {
            this.selectedMonth = moment(ev).format('MMMM YYYY');
            this.currentPeriod = {
                from: moment(ev).startOf('month').format(GIDDH_DATE_FORMAT),
                to: moment(ev).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.dateSelected = true;
            this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;
            this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr3b, request));
        }
    }

    public selectedTab(tabType) {
        this.selectedGstr3BTab = tabType;
    }

    /**
     * onDownloadSheetGSTR
     */

    public emailGSTR3bSheet(isDownloadDetailSheet: boolean) {

        if (!this.userEmail) {
            return this._toasty.errorToast(this.localeData?.email_required_error);
        }
        // Note:- appended ",1" with selectedMonth (July 2020) because "July 2020" format does not support for firefox browser and ("July 2020, 1") is valid format for chrome and firefox browser
        let convertValidDateFormatForMoment = this.selectedMonth + ',1';
        let monthToSend = moment(convertValidDateFormatForMoment).format("MM") + "-" + moment(convertValidDateFormatForMoment).format("YYYY");
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
     * Handles GST sidebar navigation event
     *
     * @param {string} type Type of report (gstr1, gstr2, gstr3b) to navigate to
     * @memberof FileGstR3Component
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
     * Navigates to the overview or dashboard page
     *
     * @param {*} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FileGstR3Component
     */
    public navigateToOverview(type): void {
        this.router.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Navigates to GSTR 3B
     *
     * @param {*} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FileGstR3Component
     */
    public navigateTogstR3B(type): void {
        this.router.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * This will return gst return filed text
     *
     * @returns {string}
     * @memberof FileGstR3Component
     */
    public getGstReturnFiledText(): string {
        let text = this.localeData?.filing?.gst_filed_success;
        text = text?.replace("[PERIOD_FROM]", this.currentPeriod?.from)?.replace("[PERIOD_TO]", this.currentPeriod.to);
        return text;
    }
}
