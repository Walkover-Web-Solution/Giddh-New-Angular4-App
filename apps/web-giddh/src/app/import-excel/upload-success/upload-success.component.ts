import { Component, EventEmitter, Input, OnDestroy, Output, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { UploadExceltableResponse } from 'apps/web-giddh/src/app/models/api-models/import-excel';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from '../../services/general.service';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'upload-success',
    
    standalone: false,styleUrls: ['./upload-success.component.scss'],
    templateUrl: './upload-success.component.html',
})

/**
 * UploadSuccessComponent component
 * Handles uploadsuccess functionality and user interactions
 */
export class UploadSuccessComponent implements OnInit, OnDestroy {
    @Input() public UploadExceltableResponse: UploadExceltableResponse;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public onShowReport: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public onContinueUpload = new EventEmitter();
    public file: File = null;
    public selectedType: string = '';
    public isAre: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public importedCountMessage: string = "";
    public failedReportMessage: string = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private activateRoute: ActivatedRoute, 
        private generalService: GeneralService
    ) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /**
         * Handles if functionality
         */
        if (this.UploadExceltableResponse) {
            this.isAre = Number(this.UploadExceltableResponse.successCount) > 1 ? this.localeData?.are : this.localeData?.is;
        }
        this.activateRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            /**
             * Handles if functionality
             */
            if (res) {
                /**
                 * Handles if functionality
                 */
                if (res.type) {
                    /**
                     * Handles if functionality
                     */
                    if (res.type === 'trial-balance' || res.type === 'entries') {
                        this.selectedType = res.type;
                    } else {
                        this.selectedType = Number(this.UploadExceltableResponse.successCount) > 1 ? res.type + 's' : res.type;
                    }
                } else {
                    this.selectedType = 'accounts';
                }

                this.importedCountMessage = this.localeData?.imported_count_message
                    ?.replace("[SUCCESS_COUNT]", String(this.UploadExceltableResponse.successCount))
                    ?.replace("[COUNT]", String(this.UploadExceltableResponse.failureCount + this.UploadExceltableResponse.successCount))
                    ?.replace("[SELECTED_TYPE]", this.selectedType)
                    ?.replace("[IS_ARE]", this.isAre);

                this.failedReportMessage = this.localeData?.failed_report_message?.replace("[SELECTED_TYPE]", this.selectedType);
            }
        });
    }

    /**
     * Handles downloadImportFile functionality
     */
    public downloadImportFile() {
        // rows less than 400 download report
        /**
         * Handles if functionality
         */
        if (!this.UploadExceltableResponse.message && this.UploadExceltableResponse.response) {
            let blob = this.generalService.base64ToBlob(this.UploadExceltableResponse.response, 'application/vnd.ms-excel', 512);
            return saveAs(blob, this.localeData?.import_report_csv_downloaded_filename);
        }

        // rows grater than 400 show import report screen
        /**
         * Handles if functionality
         */
        if (this.UploadExceltableResponse.message) {
            this.onShowReport.emit(true);
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
