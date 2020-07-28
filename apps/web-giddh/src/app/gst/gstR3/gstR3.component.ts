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
import * as _ from 'lodash';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { InvoicePurchaseActions } from '../../actions/purchase-invoice/purchase-invoice.action';


@Component({
    selector: 'file-gstr3',
    templateUrl: './gstR3.component.html',
    styleUrls: ['gstR3.component.scss'],
})
export class FileGstR3Component implements OnInit, OnDestroy {

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
    private gstr3BOverviewDataFetchedSuccessfully$: Observable<boolean>;
    private gstr3BOverviewDataFetchedInProgress$: Observable<boolean>;
    private gstr3BOverviewData$: Observable<Gstr3bOverviewResult2>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
        this.store.pipe(select(createSelector([((s: AppState) => s.session.companies), ((s: AppState) => s.session.companyUniqueName)],
            (companies, uniqueName) => {
                return companies.find(d => d.uniqueName === uniqueName);
            }))
        ).subscribe(activeCompany => {
            if (activeCompany) {
                if (activeCompany.addresses && activeCompany.addresses.length) {
                    let defaultGst = activeCompany.addresses.find(a => a.isDefault);
                    if (defaultGst) {
                        this.activeCompanyGstNumber = defaultGst.taxNumber;
                    } else {
                        this.activeCompanyGstNumber = activeCompany.addresses[0].taxNumber;
                    }
                    this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
                }
            }
        });
        this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);
    }

    public ngOnInit(): void {

        this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
            this.currentPeriod = {
                from: params['from'],
                to: params['to']
            };
            this.selectedMonth = moment(this.currentPeriod.from, 'DD-MM-YYYY').toISOString();
            this.selectedMonth = moment(this.selectedMonth).format('MMMM YYYY');
            this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
            this.selectedGstr = params['return_type'];
        });

        this.gstAuthenticated$.subscribe((a) => this.gstAuthenticated = a);
        this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
            this.activeCompanyGstNumber = result;

            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;

            this.gstr3BOverviewDataFetchedSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe(bool => {
                if (!bool && !this.dateSelected) {
                    this.store.dispatch(this._gstAction.GetOverView('gstr3b', request));
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
            this.store.dispatch(this._gstAction.GetOverView('gstr3b', request));
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
            return this._toasty.errorToast("Email Id can't be empty");
        }
        // Note:- appended ",1" with selectedMonth (July 2020) because "July 2020" format does not support for firefox browser and ("July 2020, 1") is valid format for chrome and firefox browser  
        let convertValidDateFormatForMoment = this.selectedMonth + ',1';
        let monthToSend = moment(convertValidDateFormatForMoment).format("MM") + "-" + moment(convertValidDateFormatForMoment).format("YYYY");
        if (!monthToSend) {
            this._toasty.errorToast('Please select a month');
        } else if (!this.activeCompanyGstNumber) {
            return this._toasty.errorToast('No GST Number found for selected company');
        } else {
            this.store.dispatch(this._invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
            this.userEmail = '';
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
