import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'import-statement',
    templateUrl: './import-statement.component.html',
    styleUrls: ['./import-statement.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ImportStatementComponent implements OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /** Account unique name */
    @Input() public accountUniqueName: string = '';
    /** Directives to emit true if API call successful */
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
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
            if (file && file.length > 0) {
                this.toaster.errorToast(this.localeData?.import_error);
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

        this.ledgerService.importStatement(this.getRequest, this.postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.toaster.successToast(this.localeData?.import_success);
                this.closeModal.emit(true);
            } else {
                this.toaster.errorToast(response?.message, response?.code);
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
