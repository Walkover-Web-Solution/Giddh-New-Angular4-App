import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';

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
export class InvoiceComponent implements OnInit {
  constructor(private store: Store<AppState>,
              private companyActions: CompanyActions
  ) {
    //
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'invoice';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }
}
