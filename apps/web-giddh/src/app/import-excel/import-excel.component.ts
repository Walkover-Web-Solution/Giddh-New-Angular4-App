import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';

@Component({
    selector: 'import-excel',  // <home></home>
    styleUrls: ['./import-excel.component.scss'],
    templateUrl: './import-excel.component.html'
})

export class ImportComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(private store: Store<AppState>, private _companyActions: CompanyActions) {
        //
    }

    public ngOnInit() {
        //
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'import';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    }

    public ngAfterViewInit(): void {
        //
    }

    public ngOnDestroy() {
        //
    }

}
