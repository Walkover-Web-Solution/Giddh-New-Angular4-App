import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    public postRequest: any = { file: '', password: '' };
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private ledgerService: LedgerService,
        public generalService: GeneralService,
        private toaster: ToasterService,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {

    }

    /**
     * This will verify the file extension
     *
     * @param {FileList} file
     * @returns {void}
     * @memberof ImportStatementComponent
     */
    public onFileChange(file: FileList): void {
        let validExtensions = ['pdf'];
        let type = (file && file.item(0)) ? this.generalService.getFileExtension(file.item(0).name) : 'null';
        let isValidFileType = validExtensions.some(extension => type === extension);
        this.selectedFile = file.item(0).name;

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

        this.ledgerService.importStatement(this.getRequest, this.postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.toaster.showSnackBar("success", this.inputData?.localeData?.import_success);
                this.dialogRef.close(true);
            } else {
                this.toaster.showSnackBar("error", response?.message, response?.code);
            }
        });
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
}
