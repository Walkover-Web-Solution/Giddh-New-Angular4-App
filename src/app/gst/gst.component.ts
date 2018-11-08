/**
 * Created by kunalsaxena on 9/1/17.
 */
import { Component, OnInit } from '@angular/core';
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
  public showCalendar: boolean = false;
  public currentPeriod: any = null;
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
  public gstTransactionCountsInProcess$: Observable<boolean> = of(true);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _companyActions: CompanyActions, private _route: Router, private _gstAction: GstReconcileActions) {
    this.periodChanged(new Date());
    this.gstAuthenticated$ = this.store.select(p => p.gstReconcile.gstAuthenticated).pipe(takeUntil(this.destroyed$));
    this.gstTransactionCounts$ = this.store.select(p => p.gstR.transactionCounts).pipe(takeUntil(this.destroyed$));
    this.gstTransactionCountsInProcess$ = this.store.select(p => p.gstR.transactionCountsInProcess).pipe(takeUntil(this.destroyed$));
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
              console.log('activeCompanyGstNumber', this.activeCompanyGstNumber);
              this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
            } else {
              // this.toasty.errorToast('GST number not found.');
            }
          }
        } else {
          this.store.dispatch(this._companyActions.RefreshCompanies());
        }
      });
    //
  }
  public ngOnInit(): void {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'gst';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    let dates = {
      from: moment().startOf('month').format(GIDDH_DATE_FORMAT),
      to: moment().endOf('month').format(GIDDH_DATE_FORMAT)
    };
    this.store.dispatch(this._gstAction.GetTransactionsCount(this.currentPeriod, this.activeCompanyGstNumber));

    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
    } else {
      let dates = {
        from: moment(ev).startOf('month').format(GIDDH_DATE_FORMAT),
        to: moment(ev).endOf('month').format(GIDDH_DATE_FORMAT)
      };
      this.currentPeriod = dates;
      this.isMonthSelected = true;
    }
    this.showCalendar = false;
  }

  /**
   * navigateToOverview
   */
  public navigateToOverview(type) {
    this._route.navigate(['pages', 'gstfiling', 'filing-return', type, this.currentPeriod.from, this.currentPeriod.to]);
  }

}
