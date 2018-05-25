import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  styles: [`
    .grey-bg{
      background-color: #f4f5f8;
      padding: 20px;
    }
  `],
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit, OnDestroy {
  public isPurchaseInvoice: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private companyActions: CompanyActions,
    public route: ActivatedRoute
  ) {
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'sales';
    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

    if (this.router.routerState.snapshot.url.includes('purchase')) {
      this.isPurchaseInvoice = true;
    } else {
      this.isPurchaseInvoice = false;
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
