import { Component, OnInit } from '@angular/core';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';

@Component({
    selector: 'inventory-in-out',
    templateUrl: './inventory-in-out.component.html'
})
export class InventoryInOutComponent implements OnInit {

    constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
        //
    }

    public ngOnInit() {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'inventory-in-out';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }
}
