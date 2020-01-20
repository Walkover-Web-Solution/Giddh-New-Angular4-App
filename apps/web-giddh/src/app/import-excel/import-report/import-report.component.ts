import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ImportExcelStatusPaginatedResponse, ImportExcelStatusResponse } from '../../models/api-models/import-excel';
import { ReplaySubject } from 'rxjs';
import { ImportExcelRequestStates } from '../../store/import-excel/import-excel.reducer';
import { takeUntil } from 'rxjs/operators';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PageChangedEvent } from 'ngx-bootstrap';
import { ImportExcelService } from '../../services/import-excel.service';
import { base64ToBlob } from '../../shared/helpers/helperFunctions';
import { ToasterService } from '../../services/toaster.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
    selector: 'import-report',
    templateUrl: './import-report.component.html',
    styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit, OnDestroy {
    public importStatusResponse: ImportExcelStatusPaginatedResponse;
    public importRequestStatus: ImportExcelRequestStates;
    public importPaginatedRequest: CommonPaginatedRequest = new CommonPaginatedRequest();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _router: Router, private store: Store<AppState>, private _importActions: ImportExcelActions,
        private _importExcelService: ImportExcelService, private _toaster: ToasterService) {
        this.store.pipe(select(s => s.importExcel.importStatus), takeUntil(this.destroyed$)).subscribe(s => {
            if (s && s.results) {
                s.results = s.results.map(res => {
                    res.processDate = moment.utc(res.processDate, 'YYYY-MM-DD hh:mm:ss a').local().format('DD-MM-YYYY hh:mm:ss a');
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
