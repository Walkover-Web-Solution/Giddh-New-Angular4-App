import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ImportExcelStatusPaginatedResponse, ImportExcelStatusResponse } from '../../models/api-models/import-excel';
import { ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PageEvent } from '@angular/material/paginator';
import { saveAs } from 'file-saver';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc' // load on demand
dayjs.extend(utc) // use plugin
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { GeneralService } from '../../services/general.service';
import { ImportExcelService } from '../../services/import-excel.service';
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../app.constant';
import { map } from '../../lodash-optimized';

@Component({
    selector: 'import-report',
    
    standalone: false,templateUrl: './import-report.component.html',
    styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit, OnDestroy {
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    public importStatusResponse: ImportExcelStatusPaginatedResponse;
    public importPaginatedRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    /** Stores the current company */
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
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
        this.importPaginatedRequest.count = PAGINATION_LIMIT;
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

    /**
     * Handles pagination events and updates API parameters
     * 
     * @param {PageEvent} event - Contains pagination details
     * @memberof ImportReportComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.importPaginatedRequest.page = this.importPaginatedRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.importPaginatedRequest.count = event.pageSize;
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

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
