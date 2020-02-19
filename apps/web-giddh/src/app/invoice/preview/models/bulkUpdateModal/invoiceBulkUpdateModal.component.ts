import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
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
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { BulkUpdateInvoiceNote, BulkUpdateInvoiceImageSignature, BulkUpdateInvoiceTemplates, BulkUpdateInvoiceDueDates, BulkUpdateInvoiceSlogan, BulkUpdateInvoiceShippingDetails, BulkUpdateInvoiceCustomfields } from 'apps/web-giddh/src/app/models/api-models/Contact';
import { InvoiceBulkUpdateService } from 'apps/web-giddh/src/app/services/invoice.bulkupdate.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap';


@Component({
    selector: 'invoice-bulk-update-modal-component',
    templateUrl: './invoiceBulkUpdateModal.component.html',
    styleUrls: ['./invoiceBulkUpdateModal.component.scss']
})

export class InvoiceBulkUpdateModalComponent implements OnInit, OnChanges {
    @Input() public voucherType: string = '';
    @Input() public selectedInvoices;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('bulkUpdateForm') public bulkUpdateForm: NgForm;
    @ViewChild('bulkUpdateImageSlogan') public bulkUpdateImageSlogan: ModalDirective;

    public fieldOptions: IOption[] = [
        { label: 'PDF Template', value: 'pdfTemplate' },
        { label: 'Notes', value: 'notes' },
        { label: 'Signature', value: 'signature' },
        { label: 'Due Date', value: 'dueDate' },
        // { label: 'Shipping Address', value: 'shippingDetails' }, TODO: Under discussion
        { label: 'Custom Fields', value: 'customFields' }
    ];
    public templateSignaturesOptions: IOption[] = [
        { label: 'Image', value: 'image' },
        { label: 'Slogan', value: 'slogan' },
    ];
    public signatureOptions: string = 'image'
    public selectedField: string = ''
    public allTemplates$: Observable<CustomTemplateResponse[]>;
    public allTemplatesOptions: IOption[] = [];
    public fileUploadOptions: UploaderOptions;
    public uploadInput: EventEmitter<UploadInput>;
    public sessionId$: Observable<string>;
    public companyUniqueName$: Observable<string>;
    public isSignatureAttached: boolean = false;
    public signatureSrc: string;
    public companyUniqueName: string;
    public customCreatedTemplates: CustomTemplateResponse[];
    public selectedInvoicesLists: any[] = [];
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public defaultTemplates: CustomTemplateResponse;
    public updateNotesRequest: BulkUpdateInvoiceNote = new BulkUpdateInvoiceNote();
    public updateImageSignatureRequest: BulkUpdateInvoiceImageSignature = new BulkUpdateInvoiceImageSignature();
    public updateTemplatesRequest: BulkUpdateInvoiceTemplates = new BulkUpdateInvoiceTemplates();
    public updateSloganRequest: BulkUpdateInvoiceSlogan = new BulkUpdateInvoiceSlogan();
    public updateDueDatesRequest: BulkUpdateInvoiceDueDates = new BulkUpdateInvoiceDueDates();
    public updateShippingDetailsRequest: BulkUpdateInvoiceShippingDetails = new BulkUpdateInvoiceShippingDetails();
    public updateCustomfieldsRequest: BulkUpdateInvoiceCustomfields = new BulkUpdateInvoiceCustomfields();
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public updateInProcess: boolean = false;
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };

    public isDefaultTemplateSignatureImage: boolean;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private _toaster: ToasterService, private _invoiceService: InvoiceService, private _invoiceBulkUpdateService: InvoiceBulkUpdateService,
        private _loaderService: LoaderService) {
        this.fileUploadOptions = { concurrency: 0 };
        this.sessionId$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.allTemplates$ = this.store.pipe(select(s => s.invoiceTemplate.customCreatedTemplates), takeUntil(this.destroyed$));
    }
    /**
     * Life cycle hook
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public ngOnInit() {
        this.uploadInput = new EventEmitter<UploadInput>();
        this.getTemplates();

    }

    /**
     * Upload file output
     *
     * @param {UploadOutput} output filter update options type for queue
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onUploadOutput(output: UploadOutput): void {
        this.updateInProcess = true;
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
                this.updateInProcess = false;
                this.updateImageSignatureRequest.imageSignatureUniqueName = '';
                if (output.file.response.body && output.file.response.body.uniqueName) {
                    this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
                    this.updateImageSignatureRequest.imageSignatureUniqueName = output.file.response.body.uniqueName;
                }
                // this.isFileUploading = false;
                this._toaster.successToast('file uploaded successfully');
            } else {
                // this.isFileUploading = false;
                this._toaster.errorToast(output.file.response.message);
            }
        }
    }

    /**
     * Preview uploaded file
     *
     * @param {*} files
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public previewFile(files: any): void {
        let preview: any = document.getElementById('signatureImage');
        let a: any = document.querySelector('#bulkUploadfileInput');
        let file = a.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            preview.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
            // this.isSignatureAttached = true;
        } else {
            preview.src = '';
            // this.isSignatureAttached = false;
        }
    }

    /**
     * To clear Image src and Image modal
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public clearImage() {
        this.updateInProcess = false;
        this.signatureSrc = '';
        this.isSignatureAttached = false;
        this.updateImageSignatureRequest.imageSignatureUniqueName = '';
    }

    /**
     * Cancel bulk update
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onCancel(): void {
        this.selectedField = '';
        this.signatureOptions = '';
        this.bulkUpdateForm.reset();
        this.closeModelEvent.emit(true);
    }


    /**
     * To select bulk update options
     *
     * @param {IOption} option bulk update action type
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onSelectEntryField(option: IOption): void {
        if (option && option.value) {
            this.selectedField = option.value;
            this.bulkUpdateForm.reset();
        }

    }


    /**
     *  to get all custom templates according to voucher type
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public getTemplates(): void {
        let templateType = this.voucherType === 'debit note' || this.voucherType === 'credit note' ? 'voucher' : 'invoice';
        this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(templateType));
        this.allTemplates$.pipe(takeUntil(this.destroyed$)).subscribe(templates => {
            if (templates && templates.length) {
                let customDefault = templates.filter(custom => {
                    if (templateType === 'invoice') {
                        if (custom.isDefault === true) {
                            return custom;
                        } else {
                            return;
                        }
                    } else {
                        if (custom.isDefaultForVoucher === true) {
                            return custom;
                        } else {
                            return;
                        }
                    }

                });
                if (customDefault) {
                    this.defaultTemplates = customDefault[0];
                }
                this.checkDefaultTemplateSignature(this.defaultTemplates, templateType);
                this.allTemplatesOptions = [];
                templates.forEach(tmpl => {
                    this.allTemplatesOptions.push({
                        label: tmpl.name, value: tmpl.uniqueName
                    });
                });
            }
        });

    }

    /**]
     *  hook to detect input directive changes
     *
     * @param {SimpleChanges} simpleChanges params to detect simple changes
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public ngOnChanges(simpleChanges: SimpleChanges): void {

        if (simpleChanges) {
            if (simpleChanges.voucherType && simpleChanges.voucherType.currentValue) {

                this.voucherType = simpleChanges.voucherType.currentValue;
                if (this.voucherType === "credit note" || this.voucherType === "debit note") {
                    this.fieldOptions = this.fieldOptions.filter(item => item.value !== 'dueDate' && item.label !== 'Due Date');
                }
            } else if (simpleChanges.selectedInvoices && simpleChanges.selectedInvoices.currentValue) {

                this.selectedInvoicesLists = simpleChanges.selectedInvoices.currentValue;

            }
            this.selectedField = '';
            this.updateInProcess = false;
            this.forceClear$ = observableOf({ status: true });
            this.signatureSrc = '';
            this.isSignatureAttached = false;
        }
    }

    /**
     * Call API to update all selected Invoice/Voucher
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public updateBulkInvoice(): void {
        if (this.selectedField && this.voucherType && this.selectedInvoicesLists) {

            switch (this.selectedField) {
                case 'pdfTemplate':
                    this.bulkUpdateRequest(this.updateTemplatesRequest, 'templates');
                    break;
                case 'notes':
                    this.bulkUpdateRequest(this.updateNotesRequest, 'notes');
                    break;
                case 'signature':
                    if (this.signatureOptions === 'image') {
                        if (!this.isDefaultTemplateSignatureImage) {
                            this.bulkUpdateImageSlogan.show();
                        } else {
                            this.onConfirmationUpdateImageSlogan();
                        }
                    } else {
                        if (this.isDefaultTemplateSignatureImage) {
                            this.bulkUpdateImageSlogan.show();
                        } else {
                            this.onConfirmationUpdateImageSlogan();
                        }
                    }
                    break;
                case 'dueDate':
                    if (this.updateDueDatesRequest.dueDate) {
                        this.updateDueDatesRequest.dueDate = moment(this.updateDueDatesRequest.dueDate, this.giddhDateFormat).format(this.giddhDateFormat);
                    }
                    this.bulkUpdateRequest(this.updateDueDatesRequest, 'duedate');

                    break;
                case 'shippingDetails':
                    //  this.bulkUpdateRequest(this.updateShippingDetailsRequest, 'notes');

                    break;
                case 'customFields':
                    this.bulkUpdateRequest(this.updateCustomfieldsRequest, 'customfields');
                    break;
                default:
                    break;

            }
        }
    }

    /**
     * Update Image/Slogan confirmation true
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onConfirmationUpdateImageSlogan(): void {
        this.bulkUpdateImageSlogan.hide();
        if (this.signatureOptions === 'image') {

            if (this.updateImageSignatureRequest.imageSignatureUniqueName) {
                this.bulkUpdateRequest(this.updateImageSignatureRequest, 'imagesignature');
            } else {
                this._toaster.infoToast('Please upload file');
            }
        } else if (this.signatureOptions === 'slogan') {
            this.bulkUpdateRequest(this.updateSloganRequest, 'slogan');
        }


    }

    /**
     * Cancel bulk update image slogan info modal
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onCancelBulkUpdateImageSloganModal(): void {
        this.bulkUpdateImageSlogan.hide();
        this.clearImage();
        this.forceClear$ = observableOf({ status: true });
        this.updateSloganRequest.slogan = '';
    }

    /**
     * API call for bulk update
     *
     * @param {*} requestModel
     * @param {*} actionType
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public bulkUpdateRequest(requestModel, actionType): void {

        if (requestModel && actionType) {

            let invoiceUniqueName = [];
            if (this.selectedInvoicesLists.length) {
                this.selectedInvoicesLists.forEach(invoice => {
                    if (invoice.voucherNumber) {
                        invoiceUniqueName.push(invoice.voucherNumber)
                    }
                })
            }
            requestModel.voucherNumbers = invoiceUniqueName;
            requestModel.voucherType = this.voucherType;

            if (requestModel.voucherNumbers && requestModel.voucherType) {
                this.updateInProcess = true;
                this._invoiceBulkUpdateService.bulkUpdateInvoice(requestModel, actionType).subscribe(response => {

                    if (response.status === "success") {
                        this._toaster.successToast(response.body);
                        if (actionType === 'imagesignature' || actionType === 'slogan') {
                            this.onCancel();
                        }

                    } else {
                        this.onCancel();
                        this._toaster.errorToast(response.message);
                    }
                    this.updateInProcess = false;

                });
            }
        }
    }

    /**
     * To get check default template image signature type
     *
     * @param {CustomTemplateResponse} defaultTemplate default template object
     * @param {string} templateType selected voucher type
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public checkDefaultTemplateSignature(defaultTemplate: CustomTemplateResponse, voucherType: string) {
        if (defaultTemplate && defaultTemplate.sections && defaultTemplate.sections.footer && defaultTemplate.sections.footer.data) {
            if (defaultTemplate.sections.footer.data.imageSignature && defaultTemplate.sections.footer.data.imageSignature.display && defaultTemplate.sections.footer.data.slogan && !defaultTemplate.sections.footer.data.slogan.display) {
                this.isDefaultTemplateSignatureImage = true;
            } else if (defaultTemplate && defaultTemplate.sections.footer.data.imageSignature && defaultTemplate.sections.footer.data.slogan && defaultTemplate.sections.footer.data.slogan.display && !defaultTemplate.sections.footer.data.imageSignature.display) {
                this.isDefaultTemplateSignatureImage = false;
            } else {
                this.isDefaultTemplateSignatureImage = false;
            }
        }
    }

}
