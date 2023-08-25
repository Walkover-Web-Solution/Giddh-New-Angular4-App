import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { takeUntil } from 'rxjs/operators';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { ToasterService } from '../../../../services/toaster.service';
import { LoaderService } from '../../../../loader/loader.service';
import { BulkUpdateInvoiceNote, BulkUpdateInvoiceImageSignature, BulkUpdateInvoiceTemplates, BulkUpdateInvoiceDueDates, BulkUpdateInvoiceSlogan, BulkUpdateInvoiceShippingDetails, BulkUpdateInvoiceCustomfields } from 'apps/web-giddh/src/app/models/api-models/Contact';
import { InvoiceBulkUpdateService } from 'apps/web-giddh/src/app/services/invoice.bulkupdate.service';
import { NgForm } from '@angular/forms';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { ModalOptions, ModalDirective } from 'ngx-bootstrap/modal';
import { CustomTemplateState } from 'apps/web-giddh/src/app/store/invoice/invoice.template.reducer';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';

@Component({
    selector: 'invoice-bulk-update-modal-component',
    templateUrl: './invoiceBulkUpdateModal.component.html',
    styleUrls: ['./invoiceBulkUpdateModal.component.scss']
})

export class InvoiceBulkUpdateModalComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public voucherType: string = '';
    @Input() public selectedInvoices;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('bulkUpdateForm', { static: true }) public bulkUpdateForm: NgForm;
    @ViewChild('bulkUpdateImageSlogan', { static: true }) public bulkUpdateImageSlogan: ModalDirective;
    public fieldOptions: IOption[] = [];
    public templateSignaturesOptions: IOption[] = [];
    public signatureOptions: string = 'image'
    public selectedField: string = ''
    public allTemplates$: Observable<CustomTemplateResponse[]>;
    public allTemplatesOptions: IOption[] = [];
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
    /** True, if user has opted to show notes at the last page of sales invoice */
    public showNotesAtLastPage: boolean;
    public isDefaultTemplateSignatureImage: boolean;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private toaster: ToasterService,
        private invoiceBulkUpdateService: InvoiceBulkUpdateService,
        private loaderService: LoaderService,
        private generalService: GeneralService,
        private commonService: CommonService
    ) {
        this.allTemplates$ = this.store.pipe(select(s => s.invoiceTemplate.customCreatedTemplates), takeUntil(this.destroyed$));
    }
    /**
     * Life cycle hook
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.getTemplates();
        this.store.pipe(select(appState => appState.invoiceTemplate), takeUntil(this.destroyed$)).subscribe((templateData: CustomTemplateState) => {
            if (templateData && templateData.customCreatedTemplates) {
                const defaultTemplate = templateData.customCreatedTemplates.find(template => (template.isDefault || template.isDefaultForVoucher));
                const sections = defaultTemplate.sections;
                if (sections?.footer?.data) {
                    this.showNotesAtLastPage = sections.footer.data.showNotesAtLastPage?.display;
                }
            }
        });
    }

    /**
     * Uploads image
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public uploadImage(): void {
        const selectedFile: any = document.getElementById("bulkUploadfileInput");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFileBase64(file, (base64) => {
                this.loaderService.show();

                this.commonService.uploadImageBase64({ base64: base64, format: file.type, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.loaderService.hide();

                    if (response?.status === 'success') {
                        this.updateInProcess = false;
                        this.isSignatureAttached = true;
                        this.updateImageSignatureRequest.imageSignatureUniqueName = '';
                        if (response.body && response.body?.uniqueName) {
                            this.signatureSrc = response.body?.path;
                            this.updateImageSignatureRequest.imageSignatureUniqueName = response.body?.uniqueName;
                        }
                        this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.isSignatureAttached = false;
                        this.toaster.showSnackBar("error", response.message);
                    }
                });
            });
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
     * @param {boolean} [refreshVouchers=false]
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onCancel(refreshVouchers: boolean = false): void {
        this.selectedField = '';
        this.signatureOptions = '';
        this.bulkUpdateForm.reset();
        this.closeModelEvent.emit(refreshVouchers);
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
                        if (custom.isDefault) {
                            return custom;
                        } else {
                            return;
                        }
                    } else {
                        if (custom.isDefaultForVoucher) {
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
                        label: tmpl.name, value: tmpl?.uniqueName
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

        this.fieldOptions = [
            { label: this.localeData?.bulk_update_fields?.pdf_template, value: 'pdfTemplate' },
            { label: this.localeData?.bulk_update_fields?.notes, value: 'notes' },
            { label: this.localeData?.bulk_update_fields?.signature, value: 'signature' },
            { label: this.localeData?.bulk_update_fields?.due_date, value: 'dueDate' },
            { label: this.localeData?.bulk_update_fields?.custom_fields, value: 'customFields' }
        ];

        this.templateSignaturesOptions = [
            { label: this.localeData?.image, value: 'image' },
            { label: this.localeData?.slogan, value: 'slogan' },
        ];

        if (simpleChanges) {
            if (simpleChanges.voucherType && simpleChanges.voucherType.currentValue) {

                this.voucherType = simpleChanges.voucherType.currentValue;
                if (this.voucherType === "credit note" || this.voucherType === "debit note") {
                    this.fieldOptions = this.fieldOptions?.filter(item => item?.value !== 'dueDate' && item.label !== this.localeData?.bulk_update_fields?.due_date);
                }
            }
            if (simpleChanges.selectedInvoices && simpleChanges.selectedInvoices.currentValue) {
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
                            this.bulkUpdateImageSlogan?.show();
                        } else {
                            this.onConfirmationUpdateImageSlogan();
                        }
                    } else {
                        if (this.isDefaultTemplateSignatureImage) {
                            this.bulkUpdateImageSlogan?.show();
                        } else {
                            this.onConfirmationUpdateImageSlogan();
                        }
                    }
                    break;

                case 'dueDate':
                    if (this.updateDueDatesRequest.dueDate) {
                        this.updateDueDatesRequest.dueDate = (typeof this.updateDueDatesRequest.dueDate === "object") ? dayjs(this.updateDueDatesRequest.dueDate).format(this.giddhDateFormat) : dayjs(this.updateDueDatesRequest.dueDate, this.giddhDateFormat).format(this.giddhDateFormat);
                    }
                    this.bulkUpdateRequest(this.updateDueDatesRequest, 'duedate');

                    break;
                case 'shippingDetails':
                    break;

                case 'customFields':
                    this.bulkUpdateRequest(this.updateCustomfieldsRequest, 'customfields');
                    break;
                default:
                    break;

            }
        } else if (this.signatureOptions === 'slogan') {
            this.bulkUpdateRequest(this.updateSloganRequest, 'slogan');
        }
    }

    /**
     * Update Image/Slogan confirmation true
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onConfirmationUpdateImageSlogan(): void {
        this.bulkUpdateImageSlogan?.hide();
        if (this.signatureOptions === 'image') {

            if (this.updateImageSignatureRequest.imageSignatureUniqueName) {
                this.bulkUpdateRequest(this.updateImageSignatureRequest, 'imagesignature');
            } else {
                this.toaster.infoToast(this.localeData?.file_required_error);
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
        this.bulkUpdateImageSlogan?.hide();
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
            let selectedVouchers = [];

            if (this.voucherApiVersion === 2) {
                this.selectedInvoicesLists.forEach(item => {
                    selectedVouchers.push(item?.uniqueName);
                });
                requestModel.voucherUniqueNames = selectedVouchers;
            } else {
                this.selectedInvoicesLists.forEach(item => {
                    selectedVouchers.push(item?.voucherNumber);
                });
                requestModel.voucherNumbers = selectedVouchers;
            }

            let invoiceUniqueName = [];
            if (this.selectedInvoicesLists?.length) {
                this.selectedInvoicesLists.forEach(invoice => {
                    if (invoice.voucherNumber) {
                        invoiceUniqueName.push(invoice.voucherNumber)
                    }
                })
            }
            requestModel.voucherType = this.voucherType;

            if (selectedVouchers?.length && requestModel.voucherType) {
                this.updateInProcess = true;
                this.invoiceBulkUpdateService.bulkUpdateInvoice(requestModel, actionType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toaster.successToast(response?.body);
                        this.onCancel(true);
                    } else {
                        this.toaster.errorToast(response?.message);
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

    /**
     * Releases memory
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
