import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'import-statement',
    templateUrl: './import-statement.component.html',
    styleUrls: ['./import-statement.component.scss']
})

export class ImportStatementComponent {
    /** Account unique name */
    @Input() public accountUniqueName: string = '';
    /** Directives to emit true if API call successful */
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
    /** Variable for File Upload */
    public selectedFile: any;
    /** Object for API request parameters */
    public getRequest: any = {entity: 'pdf', companyUniqueName: '', accountUniqueName: ''};
    /** Object for API post parameters */
    public postRequest: any = {file: '', password: ''};

    constructor(
        private ledgerService: LedgerService, 
        public generalService: GeneralService, 
        private toaster: ToasterService) {
        
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

        if (!isValidFileType) {
            if(file && file.length > 0) {
                this.toaster.errorToast('Only PDF files are supported for Import');
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
        this.getRequest.accountUniqueName = this.accountUniqueName;
        
        this.ledgerService.importStatement(this.getRequest, this.postRequest).subscribe(response => {
            if (response.status === 'success') {
                this.toaster.successToast("File has been uploaded successfully.");
                this.closeModal.emit(true);
            } else {
                this.toaster.errorToast(response.message, response.code);
            }
        });
    }
}
