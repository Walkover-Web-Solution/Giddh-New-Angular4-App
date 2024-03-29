import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImportExcelService } from '../../../services/import-excel.service';
import { CommonActions } from '../../../actions/common.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Router } from '@angular/router';
import { SAMPLE_FILES_URL } from '../../../app.constant';
import { saveAs } from 'file-saver';

@Component({
    selector: 'import-statement',
    templateUrl: './import-statement.component.html',
    styleUrls: ['./import-statement.component.scss'],
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

    constructor(
        private ledgerService: LedgerService,
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
        this.getRequest.accountUniqueName = this.inputData?.accountUniqueName;

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
    public async downloadSampleFile(isCsv: boolean = false) {
        const fileUrl = SAMPLE_FILES_URL + `bank-transaction.${isCsv ? 'csv' : 'xlsx'}`;
        const fileName = `bank-transaction-sample.${isCsv ? 'csv' : 'xlsx'}`;
        try {
            let blob = await fetch(fileUrl).then(r => r.blob());
            saveAs(blob, fileName);
        } catch (e) {
            this.toaster.showSnackBar("error", this.inputData?.commonLocaleData?.app_something_went_wrong);
        }
    }
}
