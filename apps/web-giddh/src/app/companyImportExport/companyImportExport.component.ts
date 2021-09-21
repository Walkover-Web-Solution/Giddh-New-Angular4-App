import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { take } from 'rxjs/operators';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';

@Component({
    selector: 'company-import-export-component',
    templateUrl: 'company-import-export.component.html',
    styleUrls: [`company-import-export.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompanyImportExportComponent implements OnInit {
    public mode: 'import' | 'export' = 'export';
    public isFirstScreen: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private companyActions: CompanyActions) {

    }

    public ngOnInit() {
        this.saveStateDetails();
    }

    public setActiveTab(mode: 'import' | 'export') {
        this.mode = mode;
        this.isFirstScreen = false;
    }

    public back() {
        this.isFirstScreen = true;
    }

    /**
     * This will save the last state
     *
     * @private
     * @memberof CompanyImportExportComponent
     */
    private saveStateDetails(): void {
        let companyUniqueName = null;
        this.store.pipe(select(state => state.session.companyUniqueName), take(1)).subscribe(company => companyUniqueName = company);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'company-import-export';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }
}
