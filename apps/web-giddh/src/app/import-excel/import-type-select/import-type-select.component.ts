import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'import-type-select',
    styleUrls: ['./import-type-select.component.scss'],
    templateUrl: './import-type-select.component.html'
})

export class ImportTypeSelectComponent implements OnInit, OnDestroy {

    /** True if current organization is branch */
    public isBranch: boolean;
    /** Current branches */
    public branches: Array<any>;

    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private _router: Router,
        private _importExcelActions: ImportExcelActions,
        private _generalActions: GeneralActions,
        private generalService: GeneralService
    ) {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Import Data";
        currentPageObj.url = this._router.url;
        this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }

    public ngOnInit() {
        this.store.dispatch(this._importExcelActions.resetImportExcelState());
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
            }
        });
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof ImportTypeSelectComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
