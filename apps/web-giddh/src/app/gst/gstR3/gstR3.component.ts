import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { Gstr3bOverviewResult, GstOverViewRequest, GstDatePeriod, GstrSheetDownloadRequest, Gstr3bOverviewResult2 } from '../../models/api-models/GstReconcile';
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
  styleUrls: ['gstR3.component.css'],
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
  public selectedMMYYYY: string = ''


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
        if (activeCompany.gstDetails && activeCompany.gstDetails.length) {
          let defaultGst = activeCompany.gstDetails.find(f => !!(f.addressList.find(a => a.isDefault)));
          if (defaultGst) {
            this.activeCompanyGstNumber = defaultGst.gstNumber;
          } else {
            this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
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

if(response) {
  this.gstr3BData = response;
      if (this.gstr3BData.ret_period) {
        this.selectedMMYYYY = this.gstr3BData.ret_period
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

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
