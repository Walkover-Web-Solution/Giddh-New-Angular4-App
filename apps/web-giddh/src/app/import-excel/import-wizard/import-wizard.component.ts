import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportExcelRequestStates, ImportExcelResponseData, ImportExcelState, ImportExcelStatusPaginatedResponse, UploadExceltableResponse } from '../../models/api-models/import-excel';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImportExcelService } from '../../services/import-excel.service';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { CommonActions } from '../../actions/common.actions';
import { LedgerComponentStore } from '../../ledger/ledger.store';
import { ImportStatementType, VoucherType } from '../../ledger/components/import-statement/import-statement.const';

@Component({
    selector: 'import-wizard',
    styleUrls: ['./import-wizard.component.scss'],
    templateUrl: './import-wizard.component.html',
    providers: [LedgerComponentStore]
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
    /** Store signed url response */
    public signedUrlResponse: any = {};
    /** Store voucher response */
    public voucherResponse: any = {};

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private importExcelService: ImportExcelService,
        private cdRef: ChangeDetectorRef,
        private toaster: ToasterService,
        private store: Store<AppState>,
        private ledgerComponentStore: LedgerComponentStore,
        private commonAction: CommonActions
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
                if (this.entity === "banktransactions" && this.mappedData?.accountUniqueName) {
                    this.router.navigate(['/pages', 'ledger', this.mappedData.accountUniqueName]);
                } else {
                    this.router.navigate(['/pages', 'downloads', 'imports']);
                }
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

        this.store.pipe(select(state => state.common.importBankTransactions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.mappedData = response;
                this.step = 2;
            } else {
                if (this.entity === "banktransactions") {
                    if (this.mappedData?.accountUniqueName) {
                        this.router.navigate(['/pages', 'ledger', this.mappedData.accountUniqueName]);
                    } else {
                        this.router.navigate(['/pages/import/select-type']);
                    }
                }
            }
        });

        this.ledgerComponentStore.signedUrlSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((importSuccess) => {
            if (importSuccess) {
                this.signedUrlResponse = importSuccess;
                this.ledgerComponentStore.uploadVoucher({ url: importSuccess.signedUrl, file: this.voucherResponse.file });
            }
        });

        this.ledgerComponentStore.uploadVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const type = this.getImportType();
                const requestObject = {
                    accountUniqueName: this.voucherResponse.accountUniqueName ?? "",
                    subType: "VOUCHER",
                    type: type,
                    isHeaderProvided: this.voucherResponse.isHeaderProvided,
                    voucherType: this.voucherResponse.selectVoucher ?? ""
                }
                if (this.entity === ImportStatementType.Entries || this.entity === ImportStatementType.Master || this.entity === ImportStatementType.Stock) {
                    requestObject.subType = '';
                    requestObject.voucherType = '';
                }
                this.ledgerComponentStore.importVoucher({ requestObject, signedUrlResponse: this.signedUrlResponse });
            }
        });

        this.ledgerComponentStore.importVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.excelState.requestState = ImportExcelRequestStates.UploadFileSuccess;
                this.excelState.importExcelData = { ...response, isHeaderProvided: this.voucherResponse.isHeaderProvided };

                this.mappedData = {
                    ...this.excelState.importExcelData,
                    data: {
                        items: this.excelState.importExcelData?.data?.items.map(column => {
                            column.row = column.row.map((rowData, index) => {
                                rowData.columnNumber = index?.toString();
                                return rowData;
                            });
                            return column;
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
            }
        });
    }

    public ngOnDestroy() {
        this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(null));
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles file upload for voucher import
     *
     * @param {any} data
     * @memberof ImportWizardComponent
     */
    public onFileUpload(data: any): void {
        this.voucherResponse = data;
        this.ledgerComponentStore.getSignedUrl(this.voucherResponse.file.name);
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
        if (this.entity === "banktransactions" && this.mappedData?.accountUniqueName) {
            this.router.navigate(['/pages', 'ledger', this.mappedData.accountUniqueName]);
        } else {
            this.step--;
        }
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
        switch (this.entity) {
            case "master":
                importType = "MASTER_IMPORT";
                break;

            case "entries":
                importType = "ENTRIES_IMPORT";
                break;

            case "stock":
                importType = "INVENTORY_IMPORT";
                break;

            case "banktransactions":
                importType = "BANK_TRANSACTIONS_IMPORT";
                break;

            case "account-wise":
                importType = "ACCOUNT_WISE_VOUCHER_IMPORT";
                break;

            case "voucher-wise":
                importType = "VOUCHER_WISE_VOUCHER_IMPORT";
                break;   
        }

        return importType;
    }
}
