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
    styleUrls: [`./purchase.component.scss`],
    templateUrl: './purchase.component.html'
})
export class PurchaseComponent implements OnInit {
    constructor(private store: Store<AppState>, private _companyActions: CompanyActions) {
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
