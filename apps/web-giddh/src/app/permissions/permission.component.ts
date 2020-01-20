import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { StateDetailsRequest } from '../models/api-models/Company';
import { Store } from '@ngrx/store';

@Component({
    template: '<router-outlet></router-outlet>'
})
export class PermissionComponent implements OnInit {
    constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
    }

    public ngOnInit(): void {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'permissions';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }
}
