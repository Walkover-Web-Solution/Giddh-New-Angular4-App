import { take } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  styles: [`
    .invoice-bg {
      padding-top: 15px;
    }

    .invoce-controll ::ng-deep.nav > li > a {
      padding: 2px 0px !important;
      margin-right: 25px !important;
    }

    .invoce-controll ::ng-deep.nav-tabs > li.active > a {
      border-bottom: 2px solid #ff5f00 !important;
    }

    .invoce-controll ::ng-deep.nav > li > a {
      border-bottom: 2px solid transparent !important;
    }

    .invoce-controll ::ng-deep.nav.nav-tabs {
      margin-bottom: 28px;
      padding: 10px 0px 0 15px !important;
      margin-right: -15px;
      margin-left: -15px;
    }

    /*.invoice-nav.navbar-nav > li > a {*/
    /*padding: 6px 30px;*/
    /*font-size: 14px;*/
    /*color: #333;*/
    /*background-color: #e6e6e6*/
    /*}*/

    .invoce-controll .invoice-nav.navbar-nav > li > a:hover {
      background-color: #ff5f00;
      color: #fff;
    }

    .invoce-controll .invoice-nav.navbar-nav > li > a.active {
      background-color: #fff;
      color: #ff5f00;
    }

    .navbar {
      min-height: auto;
      margin-bottom: 10px;
    }
  `],
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit, OnDestroy {
  public isRecurringSelected: boolean = false;
  public showInvoiceNav: boolean = false;
  public selectedVoucherType: string = '';
  public activeTab: string;
  @ViewChild('staticTabs') public staticTabs: TabsetComponent;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private companyActions: CompanyActions,
              private router: Router,
              private _cd: ChangeDetectorRef, private _activatedRoute: ActivatedRoute) {
    //
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'invoice';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

    this._activatedRoute.params.subscribe(a => {
      if (!a) {
        return;
      }
      if (a.voucherType === 'recurring') {
        return;
      }
      this.selectedVoucherType = a.voucherType;
      if (a.voucherType === 'sales') {
        this.activeTab = 'invoice';
      }
    });
  }

  public pageChanged(page: string) {
    this.showInvoiceNav = ['generate', 'preview', 'templates', 'settings', 'credit note', 'debit note', 'sales'].indexOf(page) > -1;
    // this._cd.detectChanges();
    // this.showInvoiceNav = page === 'preview';
  }

  public goToRoute(path: string) {
    this.pageChanged(path);
    if (path === 'recurring') {
      this.router.navigateByUrl('pages/invoice/' + path);
    } else {
      this.router.navigateByUrl('pages/invoice/preview/' + path);
    }
  }

  /**
   * voucherChange
   */
  public voucherChange(event) {
    this.selectedVoucherType = event;
    this.pageChanged(event);
  }

  public voucherChanged(tab: string) {
    this.selectedVoucherType = tab;
  }

  public tabChanged(tab: string) {
    this.activeTab = tab;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
