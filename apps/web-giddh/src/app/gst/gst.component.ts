/**
 * Created by kunalsaxena on 9/1/17.
 */
import * as moment from 'moment/moment';
import {InvoicePurchaseActions} from '../actions/purchase-invoice/purchase-invoice.action';
import {select, Store} from '@ngrx/store';
import {CompanyResponse, StateDetailsRequest} from '../models/api-models/Company';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ToasterService} from '../services/toaster.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CompanyActions} from '../actions/company.actions';
import {AlertConfig, BsDropdownDirective} from 'ngx-bootstrap';
import {GIDDH_DATE_FORMAT} from '../shared/helpers/defaultDateFormat';
import {Observable, of, ReplaySubject} from 'rxjs';
import {AppState} from '../store';
import {take, takeUntil} from 'rxjs/operators';
import {GstReconcileActions} from '../actions/gst-reconcile/GstReconcile.actions';
import {Router} from '@angular/router';
import {GstOverViewRequest} from '../models/api-models/GstReconcile';
import {createSelector} from 'reselect';


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
export class GstComponent implements OnInit {
    @ViewChild('monthWise') public monthWise: BsDropdownDirective;
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

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private _route: Router,
        private _gstAction: GstReconcileActions,
        private _invoicePurchaseActions: InvoicePurchaseActions,
        private _toasty: ToasterService,
        private _cdRf: ChangeDetectorRef) {
        this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
        this.gstr1TransactionCounts$ = this.store.pipe(select(s => s.gstR.gstr1OverViewData.count), takeUntil(this.destroyed$));
        this.gstr2TransactionCounts$ = this.store.pipe(select(s => s.gstR.gstr2OverViewData.count), takeUntil(this.destroyed$));

        this.gstr1OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataInProgress), takeUntil(this.destroyed$));
        this.gstr2OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataInProgress), takeUntil(this.destroyed$));

        this.getCurrentPeriod$ = this.store.pipe(select(p => p.gstR.currentPeriod), take(1));

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

        this.gstr1TransactionCounts$.subscribe(s => {
            this.gstr1TransactionCounts = s;
        });

        this.gstr2TransactionCounts$.subscribe(s => {
            this.gstr2TransactionCounts = s;
        });
    }

    public ngOnInit(): void {

        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'gstfiling';

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

        this.getCurrentPeriod$.subscribe(a => {
            if (a && a.from) {
                let date = {
                    startDate: moment(a.from, 'DD-MM-YYYY').startOf('month').format('DD-MM-YYYY'),
                    endDate: moment(a.to, 'DD-MM-YYYY').endOf('month').format('DD-MM-YYYY')
                };
                if (date.startDate === a.from && date.endDate === a.to) {
                    this.selectedMonth = moment(a.from, 'DD-MM-YYYY').toISOString();
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
                this.selectedMonth = moment(this.currentPeriod.from, 'DD-MM-YYYY').toISOString();
                this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
            }
        });

        if (this.activeCompanyGstNumber) {
            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;

            this.store.dispatch(this._gstAction.GetOverView('gstr1', request));
            this.store.dispatch(this._gstAction.GetOverView('gstr2', request));
            this.store.dispatch(this._gstAction.GetOverView('gstr3b', request));
        }
        this.imgPath = (isElectron||isCordova)  ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';

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
            // this.selectedMonth = null;
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
                this.store.dispatch(this._gstAction.GetOverView('gstr1', request));
                this.store.dispatch(this._gstAction.GetOverView('gstr2', request));
                this.store.dispatch(this._gstAction.GetOverView('gstr3b', request));
            } else {
                // only get gstr1 data
                this.store.dispatch(this._gstAction.GetOverView('gstr1', request));
            }
        } else {
            this._toasty.warningToast('Please add GSTIN in company');
        }
        this._cdRf.detectChanges();

    }

    /**
     * navigateToOverview
     */
    public navigateToOverview(type) {
        this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0 } });
    }

    /**
    * navigateToOverview
    */
    public navigateTogstR3B(type) {
        this._route.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to } });
    }

    public emailSheet(isDownloadDetailSheet: boolean) {
        if (!this.isMonthSelected) {
            return this._toasty.errorToast('Select only month');
        }
        if (!this.userEmail) {
            return this._toasty.errorToast("Email Id can't be empty");
        }
        let check = moment(this.selectedMonth, 'MM-YYYY');
        let monthToSend = check.format('MM') + '-' + check.format('YYYY');
        if (!monthToSend) {
            this._toasty.errorToast('Please select a month');
        } else if (!this.activeCompanyGstNumber) {
            return this._toasty.errorToast('No GST Number found for selected company');
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
        this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: returnType, from: this.currentPeriod.from, to: this.currentPeriod.to, tab } });
    }
    public onOpenChange(data: boolean) {
        this.openMonthWiseCalendar(data);
    }

}
