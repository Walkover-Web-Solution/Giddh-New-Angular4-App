import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImportExcelService } from '../../../services/import-excel.service';
import { CommonActions } from '../../../actions/common.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Router } from '@angular/router';
import { ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT, SAMPLE_FILES_URL } from '../../../app.constant';
import { saveAs } from 'file-saver';
import { LedgerComponentStore } from '../../ledger.store';
import { cloneDeep } from '../../../lodash-optimized';
import { OptionInterface } from '../../../models/api-models/Voucher';
import { ImportStepEnum, ImportStatementType } from './import-statement.const';

@Component({
    selector: 'import-statement',
    templateUrl: './import-statement.component.html',
    styleUrls: ['./import-statement.component.scss'],
    providers: [LedgerComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ImportStatementComponent implements OnDestroy {
    /** Variable for File Upload */
    public selectedFile: any;
    /** Object for API request parameters */
    public getRequest: any = { entity: 'pdf', companyUniqueName: '', accountUniqueName: '' };
    /** Object for API post parameters */
    public postRequest: any = { file: '', password: '', isHeaderProvided: true, accountUniqueName: undefined, sameDebitCreditAmountColumn: undefined };
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Account data results Observable */
    public voucherAccountResults$: Observable<OptionInterface[]> = observableOf(null);
    /** Default result count for account searches */
    public defaultCount = ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT;
    /** Constant for dialog steps type */
    public importStepEnum = ImportStepEnum;
    /** Constant for dialog steps type */
    public importStep: ImportStepEnum = ImportStepEnum.First;
    /** Constant for statement type */
    public importStatementType = ImportStatementType;
    /** Constant for statement type */
    public selectStatement: ImportStatementType = ImportStatementType.Voucher;
    /** Store signed url response */
    public signedUrlResponse: any = {};
    /** Request parameters for account searches */
    public accountSearchRequest: any = {
        count: this.defaultCount,
        withStocks: false
    };
    /** Stores the search results for accounts */
    public accountSearchResponse: any[] = [];
    /** Stores account name */
    public accountLabel: string = "";
    /** Stores account unique name */
    public accountUniqueName: string = "";

    constructor(
        private ledgerService: LedgerService,
        private ledgerComponentStore: LedgerComponentStore,
        public generalService: GeneralService,
        private toaster: ToasterService,
        private importExcelService: ImportExcelService,
        private commonAction: CommonActions,
        private store: Store<AppState>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {
        this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(null));
        if (!this.inputData?.accountUniqueName) {
            this.searchAccount();
        }
    }

    /**
     *  Component lifecycle call stack
     *
     * @memberof ImportStatementComponent
     */
    public ngOnInit(): void {
        this.ledgerComponentStore.signedUrlSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((importSuccess) => {
            if (importSuccess) {
                this.signedUrlResponse = importSuccess;
                this.ledgerComponentStore.uploadVoucher({ url: importSuccess.signedUrl, file: this.postRequest.file });
            }
        });

        this.ledgerComponentStore.uploadVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(voucherResponse => {
            if (voucherResponse) {
                const requestObject = {
                    accountUniqueName: this.inputData?.accountUniqueName ?? this.accountUniqueName,
                    subType: "VOUCHER",
                    type: "ACCOUNT_WISE_VOUCHER_IMPORT",
                    isHeaderProvided: this.postRequest.isHeaderProvided
                }
                this.ledgerComponentStore.importVoucher({ requestObject, signedUrlResponse: this.signedUrlResponse });
            }
        });

        this.ledgerComponentStore.importVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(importVoucherSuccessResponse => {
            if (importVoucherSuccessResponse) {
                this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(importVoucherSuccessResponse));
                this.toaster.showSnackBar("success", this.inputData?.localeData?.import_success);
                this.dialogRef.close(true);
                this.router.navigate(['/pages/import/banktransactions']);
            }
        });

        this.ledgerComponentStore.accountSearch$.pipe(takeUntil(this.destroyed$)).subscribe(accountSearchResponse => {
            if (accountSearchResponse) {
                this.accountSearchRequest.count = accountSearchResponse.count;
                accountSearchResponse.results?.forEach(result => {
                    if (result?.uniqueName) {
                        this.accountSearchResponse.push({
                            value: result.uniqueName,
                            label: result.name
                        });
                    }
                });
                this.accountSearchRequest.isLoading = false;
            }
        });
    }

    /**
     * This will verify the file extension
     *
     * @param {FileList} file
     * @returns {void}
     * @memberof ImportStatementComponent
     */
    public onFileChange(file: FileList): void {
        let validExtensions = ['pdf', 'csv', 'xls', 'xlsx'];
        let type = (file && file.item(0)) ? this.generalService.getFileExtension(file.item(0).name) : 'null';
        type = type?.toLowerCase();
        let isValidFileType = validExtensions.some(extension => type === extension);
        this.selectedFile = file.item(0).name;

        this.getRequest.entity = type;

        if (!isValidFileType) {
            if (file && file.length > 0) {
                this.toaster.showSnackBar("error", this.inputData?.localeData?.import_error);
            }
            this.selectedFile = null;
            this.postRequest.file = null;
            return;
        }
        this.postRequest.file = file.item(0);
    }

    /**
     * This will call the api to upload file
     *
     * @memberof ImportStatementComponent
     */
    public importStatement(): void {
        this.getRequest.companyUniqueName = this.generalService.companyUniqueName;
        this.getRequest.accountUniqueName = this.inputData?.accountUniqueName ?? this.accountUniqueName;
        if (this.getRequest.entity === "pdf") {
            this.ledgerService.importStatement(this.getRequest, this.postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === 'success') {
                    this.toaster.showSnackBar("success", this.inputData?.localeData?.import_success);
                    this.dialogRef.close(true);
                } else {
                    this.toaster.showSnackBar("error", response?.message, response?.code);
                }
            });
        } else {
            this.postRequest.accountUniqueName = this.getRequest.accountUniqueName;
            this.importExcelService.uploadFile("BANK_TRANSACTIONS_IMPORT", this.postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success" && response.body) {
                    this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(response.body));
                    this.toaster.showSnackBar("success", this.inputData?.localeData?.import_success);
                    this.dialogRef.close(true);
                    this.router.navigate(['/pages/import/banktransactions']);
                } else {
                    this.toaster.showSnackBar("error", response?.message, response?.code);
                }
            });
        }
    }

    /**
     *  Import voucher
     *
     * @memberof ImportStatementComponent
     */
    public uploadFile(): void {
        this.ledgerComponentStore.getSignedUrl(this.selectedFile);
    }

    /**
     * Releases memory
     *
     * @memberof ImportStatementComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Download sample files
     *
     * @param {boolean} [isCsv=false]
     * @memberof ImportStatementComponent
     */
    public async downloadSampleFile(selectAccount: string, isCsv: boolean = false) {
        const fileUrl = SAMPLE_FILES_URL + `${selectAccount === this.importStatementType.BankStatement ? 'bank-transaction' : 'voucher'}.${isCsv ? 'csv' : 'xlsx'}`;
        const fileName = `${selectAccount === this.importStatementType.BankStatement ? 'bank-transaction-sample' : 'voucher-sample'}.${isCsv ? 'csv' : 'xlsx'}`;
        try {
            let blob = await fetch(fileUrl).then(r => r.blob());
            saveAs(blob, fileName);
        } catch (e) {
            this.toaster.showSnackBar("error", this.inputData?.commonLocaleData?.app_something_went_wrong);
        }
    }

    /**
     * Sets the current import step and selected statement.
     *
     * @param {ImportStepEnum} importStep The current step in the import process.
     * @param {ImportStatementType} selectStatement The selected statement type.
     * @memberof ImportStatementComponent
     */
    public selectStatementAccount(importStep: ImportStepEnum, selectStatement: ImportStatementType): void {
        this.importStep = importStep;
        this.selectStatement = selectStatement;
    }

    /**
     * Searches for accounts based on the query and updates the account search results.
     *
     * @param {string} [query=''] The search query.
     * @param {number} [page=1] The page number for paginated results.
     * @memberof ImportStatementComponent
     */
    public searchAccount(query: string = '', page: number = 1): void {
        if (page === 1) {
            this.accountSearchResponse = [];
        }
        this.accountSearchRequest.q = query;
        this.accountSearchRequest.page = page;
        this.accountSearchRequest.isLoading = true;

        let requestObject = cloneDeep(this.accountSearchRequest);
        requestObject.isLoading = undefined;
        this.getProjectAccount(requestObject);
    }

    /**
    * Fetches the list of accounts associated with a project.
    *
    * @param {*} requestObject The request parameters for fetching accounts.
    * @memberof ImportStatementComponent
    */
    public getProjectAccount(requestObject: any): void {
        requestObject.count = this.defaultCount;
        this.ledgerComponentStore.getProjectAccount(requestObject);
    }

    /**
     * Handles infinite scroll for account search by fetching the next page of results.
     *
     * @memberof ImportStatementComponent
     */
    public handleSearchAccountScrollEnd(): void {
        if (this.accountSearchRequest.isLoading) {
            return;
        }
        if (this.defaultCount === this.accountSearchRequest.count) {
            this.searchAccount(this.accountSearchRequest.q, this.accountSearchRequest.page + 1);
        }
    }
}
