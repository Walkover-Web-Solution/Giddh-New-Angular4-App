import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ImportExcelStatusPaginatedResponse, ImportExcelStatusResponse } from '../../models/api-models/import-excel';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { saveAs } from 'file-saver';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc' // load on demand
dayjs.extend(utc) // use plugin
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { GeneralService } from '../../services/general.service';
import { ImportExcelService } from '../../services/import-excel.service';

@Component({
    selector: 'import-report',
    templateUrl: './import-report.component.html',
    styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit, OnDestroy {
    public importStatusResponse: ImportExcelStatusPaginatedResponse;
    public importPaginatedRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    /** Stores the current company */
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = true;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private importExcelService: ImportExcelService
    ) {
        this.importPaginatedRequest.page = 1;
        this.importPaginatedRequest.count = 10;
    }

    public ngOnInit() {
        this.getStatus();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    public importFiles() {
        this.router.navigate(['pages', 'import']);
    }

    public pageChanged(event: PageChangedEvent) {
        this.importPaginatedRequest.page = event.page;
        this.getStatus();
    }

    /**
     * Fetching import status
     *
     * @memberof ImportReportComponent
     */
    public getStatus(): void {
        this.isLoading = true;
        this.importExcelService.importStatus(this.importPaginatedRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response?.status === "success" && response?.body) {
                response.body.results = response?.body?.results?.map(res => {
                    res.processDate = dayjs.utc(res.processDate, 'YYYY-MM-DD hh:mm:ss a').local().format(GIDDH_DATE_FORMAT + ' hh:mm:ss a');
                    return res;
                });

                this.importStatusResponse = response.body;
            }
            this.isLoading = false;
        });
    }

    public downloadItem(item: ImportExcelStatusResponse) {
        let blob = this.generalService.base64ToBlob(item.fileBase64, 'application/vnd.ms-excel', 512);
        return saveAs(blob, item.fileName);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
