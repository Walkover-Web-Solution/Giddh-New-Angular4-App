import { take, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Component({
  styles: [`
    .invoice-bg {
      padding-top: 15px;
    }

    .invoice-nav.navbar-nav > li > a {
      padding: 6px 30px;
      font-size: 14px;
      color: #333;
      background-color: #e6e6e6
    }

    .invoice-nav.navbar-nav > li > a:hover {
      background-color: #ff5f00;
      color: #fff;
    }

    .invoice-nav.navbar-nav > li > a.active {
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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private companyActions: CompanyActions,
              private router: Router,
              private _cd: ChangeDetectorRef) {
    //
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'invoice';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

  }

  public pageChanged(page: string) {
    this.showInvoiceNav = ['generate', 'preview', 'templates', 'settings', 'receipt', 'credit note', 'debit note', 'sales'].indexOf(page) > -1;
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
