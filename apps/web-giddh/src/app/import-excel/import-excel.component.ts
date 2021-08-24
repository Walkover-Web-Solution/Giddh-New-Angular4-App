import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';

@Component({
    selector: 'import-excel',
    styleUrls: ['./import-excel.component.scss'],
    templateUrl: './import-excel.component.html'
})
export class ImportComponent implements OnInit {

    constructor(
        private store: Store<AppState>, 
        private companyActions: CompanyActions
    ) {

    }

    public ngOnInit() {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'import';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }
}