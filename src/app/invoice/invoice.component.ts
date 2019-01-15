import { take, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Component({
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
