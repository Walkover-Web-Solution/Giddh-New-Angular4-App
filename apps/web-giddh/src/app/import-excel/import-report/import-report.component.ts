import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ImportExcelStatusPaginatedResponse, ImportExcelStatusResponse } from '../../models/api-models/import-excel';
import { ReplaySubject } from 'rxjs';
import { ImportExcelRequestStates } from '../../store/import-excel/import-excel.reducer';
import { take, takeUntil } from 'rxjs/operators';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { base64ToBlob } from '../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'import-report',
    templateUrl: './import-report.component.html',
    styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit, OnDestroy {
    public importStatusResponse: ImportExcelStatusPaginatedResponse;
    public importRequestStatus: ImportExcelRequestStates;
    public importPaginatedRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    /** Stores the current company */
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private _router: Router,
        private store: Store<AppState>,
        private _importActions: ImportExcelActions) {
        this.store.pipe(select(s => s.importExcel.importStatus), takeUntil(this.destroyed$)).subscribe(s => {
            if (s && s.results) {
                s.results = s.results.map(res => {
                    res.processDate = moment.utc(res.processDate, 'YYYY-MM-DD hh:mm:ss a').local().format(GIDDH_DATE_FORMAT + ' hh:mm:ss a');
                    return res;
                })
            }
            this.importStatusResponse = s;
        });

        this.store.pipe(select(s => s.importExcel.requestState), takeUntil(this.destroyed$)).subscribe(s => {
            this.importRequestStatus = s;
        });

        this.importPaginatedRequest.page = 1;
        this.importPaginatedRequest.count = 10;
    }

    public ngOnInit() {
        this.getStatus();
        this.store.pipe(
            select(state => state.session.activeCompany), take(1)
        ).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    public importFiles() {
        this._router.navigate(['pages', 'import']);
    }

    public pageChanged(event: PageChangedEvent) {
        this.importPaginatedRequest.page = event.page;
        this.getStatus();
    }

    public getStatus() {
        this.store.dispatch(this._importActions.ImportStatusRequest(this.importPaginatedRequest));
    }

    public downloadItem(item: ImportExcelStatusResponse) {
        let blob = base64ToBlob(item.fileBase64, 'application/vnd.ms-excel', 512);
        return saveAs(blob, item.fileName);
    }

    private resetStoreData() {
        this.store.dispatch(this._importActions.resetImportExcelState());
    }

    public ngOnDestroy() {
        this.resetStoreData();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
