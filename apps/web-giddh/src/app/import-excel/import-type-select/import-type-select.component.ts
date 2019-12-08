import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';

@Component({
    selector: 'import-type-select',
    styleUrls: ['./import-type-select.component.scss'],
    templateUrl: './import-type-select.component.html'
})

export class ImportTypeSelectComponent implements OnInit {

    constructor(
        private store: Store<AppState>,
        private _router: Router,
        private _importExcelActions: ImportExcelActions,
        private _generalActions: GeneralActions
    ) {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Import Data";
        currentPageObj.url = this._router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }

    public ngOnInit() {
        this.store.dispatch(this._importExcelActions.resetImportExcelState());
    }
}
