/**
 * Created by kunalsaxena on 9/1/17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { StateDetailsRequest, CompanyResponse } from '../models/api-models/Company';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import { Observable, of, ReplaySubject } from 'rxjs';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { TransactionCounts } from 'app/store/GstR/GstR.reducer';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { GIDDH_DATE_FORMAT } from 'app/shared/helpers/defaultDateFormat';
import { InvoicePurchaseActions } from 'app/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from 'app/services/toaster.service';
import { BsDropdownDirective } from 'ngx-bootstrap';

@Component({
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.css'],
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
  @ViewChild ('monthWise') public monthWise: BsDropdownDirective;
  public showCalendar: boolean = false;
  public period: any = null;
  public activeCompanyUniqueName: string = '';
  public companies: CompanyResponse[] = [];
  public activeCompanyGstNumber = '';
  public gstAuthenticated$: Observable<boolean>;
  public gstTransactionCounts$: Observable<TransactionCounts> = of(null);
  public selectedService: string;
  public GstAsidePaneState: string = 'out';
  public imgPath: string = '';
  public isMonthSelected: boolean = true;
  public datePickerOptions: any = {
    alwaysShowCalendars: true,
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  public gstTransactionCountsInProcess$: Observable<boolean> = of(false);
  public moment = moment;
  public currentPeriod: any = {};
  public selectedMonth: any = null;
  public getCurrentPeriod$: Observable<any> = of(null);
  public userEmail: string = '';
  public returnGstr3B: {} = { via: null };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
      private _companyActions: CompanyActions,
      private _route: Router,
      private _gstAction: GstReconcileActions,
      private _invoicePurchaseActions: InvoicePurchaseActions,
      private _toasty: ToasterService) {
    this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
    this.gstTransactionCounts$ = this.store.select(p => p.gstR.transactionCounts).pipe(takeUntil(this.destroyed$));
    this.gstTransactionCountsInProcess$ = this.store.select(p => p.gstR.transactionCountsInProcess).pipe(takeUntil(this.destroyed$));
    this.getCurrentPeriod$ = this.store.select(p => p.gstR.currentPeriod).pipe(take(1));
    this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((c) => {
        if (c) {
          this.activeCompanyUniqueName = _.cloneDeep(c);
        }
      });
      this.store.select(p => p.session.companies).pipe(take(1)).subscribe((c) => {
        if (c.length) {
          let companies = this.companies = _.cloneDeep(c);
          if (this.activeCompanyUniqueName) {
            let activeCompany: any = companies.find((o: CompanyResponse) => o.uniqueName === this.activeCompanyUniqueName);
            if (activeCompany && activeCompany.gstDetails[0]) {
              this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
              this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
            } else {
              // this.toasty.errorToast('GST number not found.');
            }
          }
        } else {
          this.store.dispatch(this._companyActions.RefreshCompanies());
        }
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
        this.periodChanged(new Date());
      }
    });

    let dates = {
      from: moment().startOf('month').format(GIDDH_DATE_FORMAT),
      to: moment().endOf('month').format(GIDDH_DATE_FORMAT)
    };
    if (this.activeCompanyGstNumber) {
      this.store.dispatch(this._gstAction.GetTransactionsCount(dates, this.activeCompanyGstNumber));
      this.store.dispatch(this._invoicePurchaseActions.GetGSPSession(this.activeCompanyGstNumber));
    }
    this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';

  }

  /**
   * periodChanged
   */
  public periodChanged(ev) {
    if (ev && ev.picker) {
      let dates = {
        from: moment(ev.picker.startDate._d).format(GIDDH_DATE_FORMAT),
        to: moment(ev.picker.endDate._d).format(GIDDH_DATE_FORMAT)
      };
      this.currentPeriod = dates;
      this.isMonthSelected = false;
      this.selectedMonth = null;
    } else {
      let dates = {
        from: moment(ev).startOf('month').format(GIDDH_DATE_FORMAT),
        to: moment(ev).endOf('month').format(GIDDH_DATE_FORMAT)
      };
      this.currentPeriod = dates;
      this.selectedMonth = ev;
      this.isMonthSelected = true;
    }
    this.showCalendar = false;
    this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));

    if (this.activeCompanyGstNumber) {
      this.store.dispatch(this._gstAction.GetTransactionsCount(this.currentPeriod, this.activeCompanyGstNumber));
    } else {
      setTimeout(() => {
      this._toasty.warningToast('Please add GSTIN in company');
      }, 100);
    }
  }
  /**
   * navigateToOverview
   */
  public navigateToOverview(type) {
    this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: {return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0}});
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
    if (ev) {
      setTimeout(() => {
      this.monthWise.show();
      }, 50);
    } else {
      // this.monthWise.hide();
    }
  }

  public navigateToTab(tab, returnType) {
    this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: {return_type: returnType, from: this.currentPeriod.from, to: this.currentPeriod.to, tab}});
  }

}
