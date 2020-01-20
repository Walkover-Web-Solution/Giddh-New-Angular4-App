import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { take, takeUntil } from 'rxjs/operators';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { ToasterService } from '../../../../services/toaster.service';
import { LoaderService } from '../../../../loader/loader.service';
import { INVOICE_API } from '../../../../services/apiurls/invoice';
import { Configuration } from '../../../../app.constant';

@Component({
    selector: 'invoice-bulk-update-modal-component',
    templateUrl: './invoiceBulkUpdateModal.component.html',
    styleUrls: ['./invoiceBulkUpdateModal.component.scss']
})

export class InvoiceBulkUpdateModalComponent implements OnInit {
    @Input() public voucherType: string = '';
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    public fieldOptions: IOption[] = [
        { label: 'PDF Template', value: 'pdf-template' },
        { label: 'Notes', value: 'notes' },
        { label: 'Signature', value: 'signature' },
        { label: 'Due Date', value: 'due-date' },
        { label: 'Shipping Details', value: 'shipping-details' },
        { label: 'Custom Fields', value: 'custom-fields' }
    ];
    public selectedField: string;
    public allTemplates$: Observable<CustomTemplateResponse[]>;
    public allTemplatesOptions: IOption[] = [];
    public fileUploadOptions: UploaderOptions;
    public uploadInput: EventEmitter<UploadInput>;
    public sessionId$: Observable<string>;
    public companyUniqueName$: Observable<string>;
    public isSignatureAttached: boolean = false;
    public signatureSrc: string;
    public companyUniqueName: string;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private _toaster: ToasterService,
        private _loaderService: LoaderService) {
        this.fileUploadOptions = { concurrency: 0 };
        this.sessionId$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.allTemplates$ = this.store.pipe(select(s => s.invoiceTemplate.customCreatedTemplates), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.uploadInput = new EventEmitter<UploadInput>();
        let templateType = this.voucherType === 'debit note' || this.voucherType === 'credit note' ? 'voucher' : 'invoice';
        this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(templateType));
        this.allTemplates$.subscribe(templates => {
            if (templates && templates.length) {
                this.allTemplatesOptions = [];
                templates.forEach(tmpl => {
                    this.allTemplatesOptions.push({
                        label: tmpl.name, value: tmpl.uniqueName
                    });
                });
            }
        });
    }

    public onUploadOutput(output: UploadOutput): void {
        this.isSignatureAttached = true;
        this.previewFile(output.file);
        if (output.type === 'allAddedToQueue') {
            let sessionId = null;
            this.sessionId$.pipe(take(1)).subscribe(a => sessionId = a);
            this.companyUniqueName$.pipe(take(1)).subscribe(a => this.companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + INVOICE_API.UPLOAD_LOGO.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)),
                method: 'POST',
                headers: { 'Session-Id': sessionId },
            };

            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this._loaderService.show();
        } else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
                // this.entryUniqueNamesForBulkAction = [];
                // this.getTransactionData();
                // this.isFileUploading = false;
                this._toaster.successToast('file uploaded successfully');
            } else {
                // this.isFileUploading = false;
                this._toaster.errorToast(output.file.response.message);
            }
        }
    }

    public previewFile(files: any) {
        let preview: any = document.getElementById('signatureImage');
        let a: any = document.querySelector('input[type=file]');
        let file = a.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            preview.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
            // this.logoAttached = true;
        } else {
            preview.src = '';
            // this.logoAttached = false;
        }
    }

    public clearImage() {
        this.signatureSrc = '';
        this.isSignatureAttached = false;
    }

    public onCancel() {
        this.selectedField = null;
        this.closeModelEvent.emit(true);
    }
}
