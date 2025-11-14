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
import { SAMPLE_FILES_URL } from '../../../app.constant';
import { saveAs } from 'file-saver';
import { LedgerComponentStore } from '../../ledger.store';
import { OptionInterface } from '../../../models/api-models/Voucher';
import { ImportStepEnum, ImportStatementType, VoucherType, VoucherImportType } from './import-statement.const';
import { FileTypeEnum } from '../../../shared/Enums/common.enum';

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
    public postRequest: any = { file: '', password: '', isHeaderProvided: true, accountUniqueName: undefined, sameDebitCreditAmountColumn: undefined, selectedFileList: null };
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Account data results Observable */
    public voucherAccountResults$: Observable<OptionInterface[]> = observableOf(null);
    /** Constant for dialog steps type */
    public importStepEnum: typeof ImportStepEnum = ImportStepEnum;
    /** Constant for dialog steps type */
    public importStep: ImportStepEnum = ImportStepEnum.First;
    /** Constant for statement type */
    public importStatementType: typeof ImportStatementType = ImportStatementType;
    /** Constant for statement type */
    public selectStatement: ImportStatementType = ImportStatementType.Voucher;
    /** Store signed url response */
    public signedUrlResponse: any = {};
    /** Holds  file type enum */
    public fileType: typeof FileTypeEnum = FileTypeEnum;
    /** Holds  entity type */
    public entity: string;

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
                const type = this.entity === ImportStatementType.BankTransactions ? VoucherImportType.BankTransactionsImport : VoucherImportType.AccountWiseImport;
                const requestObject = {
                    accountUniqueName: this.inputData?.accountUniqueName,
                    subType: "VOUCHER",
                    type: type,
                    voucherType: '',
                    isHeaderProvided: this.postRequest.isHeaderProvided,
                    sameDebitCreditAmountColumn: this.postRequest.sameDebitCreditAmountColumn ?? false
                }
                if (this.entity === ImportStatementType.BankTransactions) {
                    requestObject.subType = '';
                }
                    this.ledgerComponentStore.importVoucher({ requestObject, signedUrlResponse: this.signedUrlResponse });
            }
        });

        this.ledgerComponentStore.importVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(importVoucherSuccessResponse => {
            if (importVoucherSuccessResponse) {
                this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(importVoucherSuccessResponse));
                this.toaster.showSnackBar("success", this.inputData?.localeData?.import_success);
                this.dialogRef.close(true);
                this.router.navigate(['pages', 'import', this.entity === ImportStatementType.BankTransactions ? ImportStatementType.BankTransactions : VoucherType.AccountWise]);
            }
        });
    }

    /**
 * This will call the api to upload file
 *
 * @memberof ImportStatementComponent
 */
    public importStatement(): void {
        this.getRequest.companyUniqueName = this.generalService.companyUniqueName;
        this.getRequest.accountUniqueName = this.inputData?.accountUniqueName;
        if (this.getRequest.entity === this.fileType.PDF) {
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
     * This will verify the file extension
     *
     * @param {FileList} file
     * @returns {void}
     * @memberof ImportStatementComponent
     */
    public onFileChange(file: FileList): void {
        let validExtensions = [this.fileType.PDF, this.fileType.CSV, this.fileType.XLS, this.fileType.XLSX];
        let type = (file && file.item(0)) ? this.generalService.getFileExtension(file.item(0).name) : 'null';
        type = type?.toLowerCase();
        let isValidFileType = validExtensions.some(extension => type === extension);
        this.selectedFile = file.item(0).name;

        this.getRequest.entity = type;
        this.postRequest.selectedFileList = file;
        if (!isValidFileType || (this.selectStatement === this.importStatementType.Voucher && this.fileType.PDF === type)) {
            if (file && file.length > 0) {
                this.toaster.showSnackBar("error", this.selectStatement === this.importStatementType.Voucher ? this.inputData?.localeData?.voucher_error : this.inputData?.localeData?.import_error);
            }
            this.selectedFile = null;
            this.postRequest.file = null;
            this.postRequest.selectedFileList = null;
            return;
        }
        this.postRequest.file = file.item(0);
    }

    /**
     *  Import voucher
     *
     * @memberof ImportStatementComponent
     */
    public uploadFile(type: string): void {
        this.entity = type;
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
        const isBankStatement = selectAccount === this.importStatementType.BankStatement;
        const fileUrl = SAMPLE_FILES_URL + `${isBankStatement ? 'bank-transaction' : 'voucher'}.${isCsv ? this.fileType.CSV : this.fileType.XLSX}`;
        const fileName = `${isBankStatement ? 'bank-transaction-sample' : 'voucher-sample'}.${isCsv ? this.fileType.CSV : this.fileType.XLSX}`;
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
        this.postRequest.selectedFileList && this.onFileChange(this.postRequest.selectedFileList);
    }
}
