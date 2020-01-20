import { take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { StateDetailsRequest } from '../models/api-models/Company';
import { ReplaySubject } from 'rxjs';

@Component({
    template: '<router-outlet></router-outlet>'
})

export class ManufacturingComponent implements OnInit, OnDestroy {

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
        //
    }

    public ngOnInit(): void {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'manufacturing';

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
