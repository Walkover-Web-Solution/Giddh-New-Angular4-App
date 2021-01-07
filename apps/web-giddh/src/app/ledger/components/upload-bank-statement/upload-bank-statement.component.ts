import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'upload-bank-statement',
    templateUrl: './upload-bank-statement.component.html',
    styleUrls: ['./upload-bank-statement.component.scss']
})

export class UploadBankStatementComponent {
    /** Account unique name */
    @Input() public accountUniqueName: string = '';
    /** Directives to emit true if API call successful */
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();

    /** Variable for File Upload */
    public selectedFile: any;
    /** Object for API request parameters */
    public getRequest: any = {entity: 'pdf', companyUniqueName: '', accountUniqueName: ''};
    /** Object for API post parameters */
    public postRequest: any = {File: '', Password: ''};

    constructor(private ledgerService: LedgerService, public generalService: GeneralService, private toaster: ToasterService) {
        
    }

    /**
     * This will verify the file extension
     *
     * @param {FileList} file
     * @returns {void}
     * @memberof UploadBankStatementComponent
     */
    public onFileChange(file: FileList): void {
        let validExtensions = ['pdf'];
        let type = (file && file.item(0)) ? this.generalService.getFileExtension(file.item(0).name) : 'null';
        let isValidFileType = validExtensions.some(extension => type === extension);

        if (!isValidFileType) {
            this.toaster.errorToast('Only PDF files are supported for Import');
            this.selectedFile = null;
            this.postRequest.File = null;
            return;
        }

        this.postRequest.File = file.item(0);
    }

    /**
     * This will call the api to upload file
     *
     * @memberof UploadBankStatementComponent
     */
    public uploadBankStatement(): void {
        this.getRequest.companyUniqueName = this.generalService.companyUniqueName;
        this.getRequest.accountUniqueName = this.accountUniqueName;
        
        this.ledgerService.uploadBankStatementFile(this.getRequest, this.postRequest).subscribe(response => {
            if (response.status === 'success') {
                this.toaster.successToast("File has been uploaded successfully.");
                this.closeModal.emit(true);
            } else {
                this.toaster.errorToast(response.message, response.code);
            }
        });
    }
}
