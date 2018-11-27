import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyResponse } from 'app/models/api-models/Company';
import { CompanyActions } from 'app/actions/company.actions';
import { ReplaySubject, Observable } from 'rxjs';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import * as  moment from 'moment/moment';
import { InvoicePurchaseActions } from 'app/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from 'app/services/toaster.service';

@Component({
  selector: 'filing',
  templateUrl: 'filing.component.html',
  styleUrls: ['filing.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit {
  public currentPeriod: any = null;
  public selectedGst: string = null;
  public gstNumber: string = null;
  public activeCompanyUniqueName: string = '';
  public activeCompanyGstNumber: string = '';
  public selectedTab: string = '1. Overview';
  public companies: CompanyResponse[];
  public gstAuthenticated$: Observable<boolean>;
  public isTransactionSummary: boolean = false;
  public showTaxPro: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef, private _route: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>, private companyActions: CompanyActions, private gstAction: GstReconcileActions, private invoicePurchaseActions: InvoicePurchaseActions, private toasty: ToasterService) {
    this.gstAuthenticated$ = this.store.select(p => p.gstReconcile.gstAuthenticated).pipe(takeUntil(this.destroyed$));

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
            this.store.dispatch(this.gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
          } else {
            // this.toasty.errorToast('GST number not found.');
          }
        }
      } else {
        this.store.dispatch(this.companyActions.RefreshCompanies());
      }
    });
    this.gstAuthenticated$.subscribe(s => {
      if (!s) {
        // this.toggleSettingAsidePane(null, 'RECONCILE');
      } else {
        //  means user logged in gst portal
      }
    });
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let dates = {
        from: params['from'],
        to: params['to']
      };
      this.currentPeriod = dates;
      this.selectedGst = params['return_type'];
      this._cdr.detach();
      setTimeout(() => {
          this._cdr.reattach();
          if (!this._cdr['destroyed']) {
            this._cdr.detectChanges();
          }
        }, 20);
    });
  }

  public selectTab(e, val, tabHeading) {
    this._cdr.detach();
    this.selectedTab = tabHeading;
    setTimeout(() => {
        this._cdr.reattach();
        if (!this._cdr['destroyed']) {
          this._cdr.detectChanges();
        }
      }, 200);
    if (this.selectedTab === '1. Overview') {
      this.isTransactionSummary = false;
    } else {
      this.isTransactionSummary = true;
    }
    this.showTaxPro = val;
    this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: {return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to}});
  }

  /**
   * fileJioGstReturn
   */
  public fileJioGstReturn(Via: 'JIO_GST' | 'TAX_PRO') {
    let check = moment(this.currentPeriod, 'YYYY/MM/DD');
    let monthToSend = check.format('MM') + '-' + check.format('YYYY');
    if (this.activeCompanyGstNumber) {
      this.store.dispatch(this.invoicePurchaseActions.FileJioGstReturn(monthToSend, this.activeCompanyGstNumber, Via));
    } else {
      this.toasty.errorToast('GST number not found.');
    }
  }
}
