import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyResponse }  from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions }  from 'apps/web-giddh/src/app/actions/company.actions';
import { Observable, of, ReplaySubject } from 'rxjs';
import { GstReconcileActions }  from 'apps/web-giddh/src/app/actions/gst-reconcile/GstReconcile.actions';
import { InvoicePurchaseActions }  from 'apps/web-giddh/src/app/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService }  from 'apps/web-giddh/src/app/services/toaster.service';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'filing',
  templateUrl: 'filing.component.html',
  styleUrls: ['filing.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit {
  @ViewChild('staticTabs') public staticTabs: TabsetComponent;
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
  public fileReturn: {} = { isAuthenticate: false };
  public selectedTabId: number = null;
  public gstFileSuccess$: Observable<boolean> = of(false);
  public fileReturnSucces: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef, private _route: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>, private companyActions: CompanyActions, private gstAction: GstReconcileActions, private invoicePurchaseActions: InvoicePurchaseActions, private toasty: ToasterService) {
    this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
    this.gstFileSuccess$ = this.store.select(p => p.gstR.gstReturnFileSuccess).pipe(takeUntil(this.destroyed$));

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
            this.store.dispatch(this.gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
          } else {
            // this.toasty.errorToast('GST number not found.');
          }
        }
      } else {
        this.store.dispatch(this.companyActions.RefreshCompanies());
      }
    });

    this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);

  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let dates = {
        from: params['from'],
        to: params['to']
      };
      this.currentPeriod = dates;
      this.selectedGst = params['return_type'];
      this.selectedTabId = Number(params['tab']);

      this._cdr.detach();
      setTimeout(() => {
          this._cdr.reattach();
          if (!this._cdr['destroyed']) {
            this._cdr.detectChanges();
          }
        if (this.selectedTabId > -1) {
              this.selectTabFromUrl();
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
    this.fileReturnSucces = false;
    this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: {return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: this.selectedTabId}});
  }

  public selectTabFromUrl() {
    this.staticTabs.tabs[this.selectedTabId].active = true;
  }
}
