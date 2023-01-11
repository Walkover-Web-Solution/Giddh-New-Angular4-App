import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportExcelRequestStates, ImportExcelResponseData, ImportExcelState, ImportExcelStatusPaginatedResponse, UploadExceltableResponse } from '../../models/api-models/import-excel';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImportExcelService } from '../../services/import-excel.service';

@Component({
    selector: 'import-wizard',
    styleUrls: ['./import-wizard.component.scss'],
    templateUrl: './import-wizard.component.html'
})

export class ImportWizardComponent implements OnInit, OnDestroy {
    public step: number = 1;
    public entity: string;
    public isUploadInProgress: boolean = false;
    public excelState: ImportExcelState;
    public mappedData: ImportExcelResponseData;
    public UploadExceltableResponse: UploadExceltableResponse = {
        failureCount: 0,
        message: '',
        response: '',
        successCount: 0
    };

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the selected branch unique name for import entries */
    private currentBranch: string;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private importExcelService: ImportExcelService,
        private cdRef: ChangeDetectorRef,
        private toaster: ToasterService
    ) {
    }

    public dataChanged = (excelState: ImportExcelState) => {
        this.excelState = excelState;

        // if file uploaded successfully
        if (excelState.requestState === ImportExcelRequestStates.UploadFileSuccess) {
            this.step++;
        }

        // if import is done successfully
        if (excelState.requestState === ImportExcelRequestStates.ProcessImportSuccess) {
            // if rows grater then 400 rows show report page
            if (this.excelState.importResponse.message) {
                this.toaster.successToast(this.excelState.importResponse.message);
                this.showReport();
            } else {
                // go to import success page
                this.step++;
                this.UploadExceltableResponse = this.excelState.importResponse;
            }
        }

        if (this.excelState.importResponse) {
            this.UploadExceltableResponse = this.excelState.importResponse;
        }

        this.isUploadInProgress = excelState.requestState === ImportExcelRequestStates.UploadFileInProgress;
    }

    public ngOnInit() {
        this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(p => this.entity = p[0].path);

        const importStatusRequest: ImportExcelStatusPaginatedResponse = new ImportExcelStatusPaginatedResponse();

        this.excelState = {
            requestState: ImportExcelRequestStates.Default,
            importStatus: importStatusRequest
        };
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public onFileUpload(data: any) {
        this.isUploadInProgress = true;
        this.currentBranch = data.branchUniqueName;
        this.excelState.requestState = ImportExcelRequestStates.UploadFileInProgress;

        const importType = this.getImportType();

        this.importExcelService.uploadFile(importType, data).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isUploadInProgress = false;
            if (response?.status === "success" && response.body) {
                this.excelState.requestState = ImportExcelRequestStates.UploadFileSuccess;
                this.excelState.importExcelData = { ...response.body, isHeaderProvided: data.isHeaderProvided };

                this.mappedData = {
                    ...this.excelState.importExcelData,
                    data: {
                        items: this.excelState.importExcelData?.data?.items.map(p => {
                            p.row = p.row.map((pr, index) => {
                                pr.columnNumber = index?.toString();
                                return pr;
                            });
                            return p;
                        }),
                        numRows: 0, 
                        totalRows: 0
                    }
                };

                this.dataChanged(this.excelState);
            } else {
                this.excelState.requestState = ImportExcelRequestStates.UploadFileError;
                this.excelState.importExcelData = null;
                this.dataChanged(this.excelState);
                this.toaster.errorToast(response?.message);
            }
        });
    }

    public onContinueUpload(e) {
        this.router.navigate(['/pages/import/select']);
    }

    public onNext(importData: ImportExcelResponseData) {
        this.mappedData = importData;
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    }

    public mappingDone(importData: ImportExcelResponseData) {
        this.step++;
        this.onNext(importData);
    }

    public onBack() {
        this.step--;
    }

    public showReport() {
        this.router.navigate(['/pages', 'downloads', 'imports']);
    }

    public onSubmit(data: any) {
        if (this.currentBranch) {
            data.branchUniqueName = this.currentBranch;
        }
        this.excelState.requestState = ImportExcelRequestStates.ProcessImportInProgress;
        const importType = this.getImportType();
        this.importExcelService.processImport(importType, data).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'error') {
                this.toaster.errorToast(response.message);
                this.excelState.importResponse = null;
                this.excelState.requestState = ImportExcelRequestStates.ProcessImportError;
            } else {
                if (typeof response?.body === 'string') {
                    this.toaster.successToast(response?.body);
                }
                this.excelState.importResponse = response?.body;
                this.excelState.requestState = ImportExcelRequestStates.ProcessImportSuccess;
            }
            this.dataChanged(this.excelState);
        });
    }

    /**
     * Returns import type based on entity
     *
     * @private
     * @returns {string}
     * @memberof ImportWizardComponent
     */
    private getImportType(): string {
        let importType = "";

        switch(this.entity) {
            case "master":
                importType = "MASTER_IMPORT";
                break;

            case "entries":
                importType = "ENTRIES_IMPORT";
                break;
                
            case "stock":
                importType = "INVENTORY_IMPORT";
                break;    
        }

        return importType;
    }
}
