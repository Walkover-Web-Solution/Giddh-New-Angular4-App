import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { GeneralService } from '../../services/general.service';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ToasterService } from '../../services/toaster.service';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-bulk-update',
    templateUrl: './bulk-update.component.html',
    styleUrls: ['./bulk-update.component.scss'],
    providers: [VoucherComponentStore]
})
export class BulkUpdateComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isDefaultTemplateSignatureImage: boolean;
    public defaultTemplates: CustomTemplateResponse;
    public templatesList: any[] = [];
    /** True, if user has opted to show notes at the last page of sales invoice */
    public showNotesAtLastPage: boolean;
    public uploadImageBase64InProgress$: Observable<any> = this.componentStore.uploadImageBase64InProgress$;
    public bulkUpdateVoucherInProgress$: Observable<any> = this.componentStore.bulkUpdateVoucherInProgress$;
    public bulkUpdateForm: FormGroup;
    public signatureSrc: string = "";
    public fieldOptions: any[] = [];
    public templateSignaturesOptions: any[] = [];
    public dayjs = dayjs;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private componentStore: VoucherComponentStore,
        private generalService: GeneralService,
        private toasterService: ToasterService,
        private dialog: MatDialog
    ) {

    }

    public ngOnInit(): void {
        this.bulkUpdateForm = this.formBuilder.group({
            selectedField: [''],
            imageSignatureUniqueName: [''],
            templateUniqueName: [''],
            message2: [''],
            signatureOption: ['image'],
            dueDate: [''],
            slogan: [''],
            customField1: [''],
            customField2: [''],
            customField3: ['']
        });

        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;

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

        if (this.inputData?.voucherType === "credit note" || this.inputData?.voucherType === "debit note") {
            this.fieldOptions = this.fieldOptions?.filter(item => item?.value !== 'dueDate' && item.label !== this.localeData?.bulk_update_fields?.due_date);
        }

        this.getCreatedTemplates();

        this.componentStore.uploadImageBase64Response$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.bulkUpdateForm.get("imageSignatureUniqueName")?.patchValue("");
                if (response && response.uniqueName) {
                    this.signatureSrc = response.path;
                    this.bulkUpdateForm.get("imageSignatureUniqueName")?.patchValue(response.uniqueName);
                }
            } else {
                this.bulkUpdateForm.get("imageSignatureUniqueName")?.patchValue("");
            }
        });

        this.componentStore.bulkUpdateVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.onCancel(true);
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Gets template list and use labels from default template
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCreatedTemplates(): void {
        let voucherType = this.inputData?.voucherType === 'debit note' || this.inputData?.voucherType === 'credit note' ? 'voucher' : 'invoice';
        this.componentStore.createdTemplates$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.componentStore.getCreatedTemplates(voucherType);
            } else {
                const defaultTemplate = response.find(template => (template.isDefault || template.isDefaultForVoucher));
                const sections = defaultTemplate.sections;
                if (sections?.footer?.data) {
                    this.showNotesAtLastPage = sections.footer.data.showNotesAtLastPage?.display;
                }

                let customDefault = response.filter(custom => {
                    if (voucherType === 'invoice') {
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

                this.checkDefaultTemplateSignature(this.defaultTemplates);

                this.templatesList = [];
                response.forEach(tmpl => {
                    this.templatesList.push({ label: tmpl.name, value: tmpl?.uniqueName });
                });
            }
        });
    }

    /**
     * To get check default template image signature type
     *
     * @param {CustomTemplateResponse} defaultTemplate default template object
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public checkDefaultTemplateSignature(defaultTemplate: CustomTemplateResponse): void {
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
     * Uploads image
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public uploadImage(): void {
        const selectedFile: any = document.getElementById("bulkUploadfileInput");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];
            this.generalService.getSelectedFileBase64(file, (base64) => {
                this.componentStore.uploadImageBase64({ base64: base64, format: file.type, fileName: file.name });
            });
        }
    }

    /**
     * To clear Image src and Image modal
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public clearImage() {
        this.signatureSrc = '';
        this.bulkUpdateForm.get("imageSignatureUniqueName")?.patchValue("");
    }

    /**
     * Cancel bulk update
     *
     * @param {boolean} [refreshVouchers=false]
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onCancel(refreshVouchers: boolean = false): void {
        this.dialogRef.close(refreshVouchers);
    }

    public resetFormData(): void {
        this.bulkUpdateForm.get("signatureOption")?.patchValue("");
        this.bulkUpdateForm.get("imageSignatureUniqueName")?.patchValue("");
        this.bulkUpdateForm.get("templateUniqueName")?.patchValue("");
        this.bulkUpdateForm.get("message2")?.patchValue("");
        this.bulkUpdateForm.get("signatureOption")?.patchValue("");
        this.bulkUpdateForm.get("dueDate")?.patchValue("");
        this.bulkUpdateForm.get("slogan")?.patchValue("");
        this.bulkUpdateForm.get("customField1")?.patchValue("");
        this.bulkUpdateForm.get("customField2")?.patchValue("");
        this.bulkUpdateForm.get("customField3")?.patchValue("");
    }

    /**
     * Call API to update all selected Invoice/Voucher
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public updateBulkInvoice(): void {
        if (this.bulkUpdateForm.get("selectedField")?.value && this.inputData?.voucherType && this.inputData?.voucherUniqueNames) {
            switch (this.bulkUpdateForm.get("selectedField")?.value) {
                case 'pdfTemplate':
                    this.bulkUpdateRequest({ templateUniqueName: this.bulkUpdateForm.get("templateUniqueName")?.value }, 'templates');
                    break;

                case 'notes':
                    this.bulkUpdateRequest({ message2: this.bulkUpdateForm.get("message2")?.value }, 'notes');
                    break;

                case 'signature':
                    if (this.bulkUpdateForm.get("signatureOption")?.value === 'image') {
                        if (!this.isDefaultTemplateSignatureImage) {
                            this.confirmImageSlogan();
                        } else {
                            this.onConfirmationUpdateImageSlogan();
                        }
                    } else {
                        if (this.isDefaultTemplateSignatureImage) {
                            this.confirmImageSlogan();
                        } else {
                            this.onConfirmationUpdateImageSlogan();
                        }
                    }
                    break;

                case 'dueDate':
                    let dueDate = "";

                    if (this.bulkUpdateForm.get("dueDate")?.value) {
                        let dueDate = (typeof this.bulkUpdateForm.get("dueDate")?.value === "object") ? dayjs(this.bulkUpdateForm.get("dueDate")?.value).format(GIDDH_DATE_FORMAT) : dayjs(this.bulkUpdateForm.get("dueDate")?.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

                        this.bulkUpdateForm.get("dueDate")?.patchValue(dueDate);
                    }
                    this.bulkUpdateRequest({ dueDate: dueDate }, 'duedate');

                    break;

                case 'shippingDetails':
                    break;

                case 'customFields':
                    this.bulkUpdateRequest({ customField1: this.bulkUpdateForm.get("customField1")?.value, customField2: this.bulkUpdateForm.get("customField2")?.value, customField3: this.bulkUpdateForm.get("customField3")?.value }, 'customfields');
                    break;
                default:
                    break;

            }
        } else if (this.bulkUpdateForm.get("signatureOption")?.value === 'slogan') {
            this.bulkUpdateRequest({ slogan: this.bulkUpdateForm.get("slogan")?.value }, 'slogan');
        }
    }

    public bulkUpdateRequest(payload: any, actionType: string): void {
        payload.voucherUniqueNames = this.inputData?.voucherUniqueNames;
        payload.voucherType = this.inputData?.voucherType;

        this.componentStore.bulkUpdateInvoice({ payload: payload, actionType: actionType });
    }

    /**
     * Update Image/Slogan confirmation true
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onConfirmationUpdateImageSlogan(): void {
        if (this.bulkUpdateForm.get("signatureOption")?.value === 'image') {
            if (this.bulkUpdateForm.get("imageSignatureUniqueName")?.value) {
                this.bulkUpdateRequest({ imageSignatureUniqueName: this.bulkUpdateForm.get("imageSignatureUniqueName")?.value }, 'imagesignature');
            } else {
                this.toasterService.showSnackBar("info", this.localeData?.file_required_error);
            }
        } else if (this.bulkUpdateForm.get("signatureOption")?.value === 'slogan') {
            this.bulkUpdateRequest({ slogan: this.bulkUpdateForm.get("slogan")?.value }, 'slogan');
        }
    }

    /**
     * Cancel bulk update image slogan info modal
     *
     * @memberof InvoiceBulkUpdateModalComponent
     */
    public onCancelBulkUpdateImageSloganModal(): void {
        this.clearImage();
        this.bulkUpdateForm.get("slogan")?.patchValue("");
    }

    private confirmImageSlogan(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.bulk_image_note,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.want_proceed
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.onConfirmationUpdateImageSlogan();
            } else {
                this.onCancelBulkUpdateImageSloganModal();
            }
        });
    }
}
