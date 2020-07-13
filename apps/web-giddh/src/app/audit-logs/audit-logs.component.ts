import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'audit-logs',
    templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit, OnDestroy {
    /** To check module for new version  */
    public isNewVersion: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private companyActions: CompanyActions, private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.route.params.subscribe(response => {
            if (response) {
                this.isNewVersion = false;
                if (response.version && response.version && String(response.version).toLocaleLowerCase() === 'new') {
                    this.isNewVersion = true;
                }
            } else {
                this.isNewVersion = false;
            }
            console.log('params:', response);
        });
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'audit-logs';

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
