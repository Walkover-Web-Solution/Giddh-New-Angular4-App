import { take } from 'rxjs/operators';
/**
 * Created by kunalsaxena on 9/1/17.
 */
import { Component, OnInit } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { StateDetailsRequest } from '../models/api-models/Company';

@Component({
    styles: [`
    .invoice-bg {
      background-color: #f4f5f8;
      padding: 20px;
    }

    .invoice-nav.navbar-nav > li > a {
      padding: 6px 30px;
      font-size: 14px;
      color: #333;
      background-color: #e6e6e6
    }

    .invoice-nav.navbar-nav > li > a:hover {

      color: #fff;
    }

    .invoice-nav.navbar-nav > li > a.active {
      background-color: #fff;

    }
  `],
    templateUrl: './purchase.component.html'
})
export class PurchaseComponent implements OnInit {
    constructor(private store: Store<AppState>, private _companyActions: CompanyActions) {
        // console.log('Hi this is purchase component');
    }

    public ngOnInit(): void {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'purchase';

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    }

}
