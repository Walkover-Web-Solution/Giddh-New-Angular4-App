import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { IOption } from '../../theme/ng-select/option.interface';
import { BULK_UPDATE_FIELDS } from '../../shared/helpers/purchaseOrderStatus';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { SettingsUtilityService } from '../../settings/services/settings-utility.service';

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
    /** Holds Default Template Signature status */
    public isDefaultTemplateSignatureImage: boolean;
    /** Holds Default Template */
    public defaultTemplates: CustomTemplateResponse;
    /** Holds list of templates */
    public templatesList: any[] = [];
    /** True, if user has opted to show notes at the last page of sales invoice */
    public showNotesAtLastPage: boolean;
    /** Holds Upload Image Base64 in progress Observable */
    public uploadImageBase64InProgress$: Observable<any> = this.componentStore.uploadImageBase64InProgress$;
    /** Holds Bulk Update Voucher in progress Observable */
    public bulkUpdateVoucherInProgress$: Observable<any> = this.componentStore.bulkUpdateVoucherInProgress$;
    /** Holds Bulk Update Form */
    public bulkUpdateForm: FormGroup;
    /** Holds signature src */
    public signatureSrc: string = "";
    /** Holds field options */
    public fieldOptions: any[] = [];
    /** Template Signatures Options */
    public templateSignaturesOptions: any[] = [];
    /** Holds Days Reference */
    public dayjs = dayjs;
    /** True if voucher type is Purchase order */
    public isPOVoucher: boolean = false;
    /** This holds the fields which can be updated in bulk */
    public bulkUpdateFields: IOption[] = [];
    /** Stores warehouses for a company */
    public warehouses: Array<any>;
    /** Holds Default Template Name as label value */
    public templateName: string = '';
    /** Holds Default Template Name as label value */
    public signatureName: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private componentStore: VoucherComponentStore,
        private generalService: GeneralService,
        private toasterService: ToasterService,
        private dialog: MatDialog,
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService
    ) { }

    /**
     * Initializes the component
     *
     * @memberof BulkUpdateComponent
     */
    public ngOnInit(): void {
        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;

        this.isPOVoucher = this.inputData?.voucherType === 'purchase-order';
        if (this.isPOVoucher) {
            this.bulkUpdateForm = this.formBuilder.group({
                action: [''],
                purchaseDate: [''],
                dueDate: [''],
                warehouseUniqueName: ['']
            });

            this.bulkUpdateFields = [
                { label: this.localeData?.order_date, value: BULK_UPDATE_FIELDS.purchasedate },
                { label: this.localeData?.expected_delivery_date, value: BULK_UPDATE_FIELDS.duedate },
                { label: this.commonLocaleData?.app_warehouse, value: BULK_UPDATE_FIELDS.warehouse }
            ];
            this.getWarehouses();

        } else {
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
        }

        this.componentStore.bulkUpdateVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.onCancel(true);
            }
        });
    }

    /**
     * Gets company warehouses
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getWarehouses(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.componentStore.warehouseList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let warehouseResults = response.results?.filter(warehouse => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
            }
        });
    }

    /**
     * This hook will be use for component destroyed
     *
     * @memberof BulkUpdateComponent
     */
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
     * @memberof BulkUpdateComponent
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
     * @memberof BulkUpdateComponent
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
     * @memberof BulkUpdateComponent
     */
    public clearImage(): void {
        this.signatureSrc = '';
        this.bulkUpdateForm.get("imageSignatureUniqueName")?.patchValue("");
    }

    /**
     * Cancel bulk update
     *
     * @param {boolean} [refreshVouchers=false]
     * @memberof BulkUpdateComponent
     */
    public onCancel(refreshVouchers: boolean = false): void {
        this.dialogRef.close(refreshVouchers);
    }

    /**
     * Reset Form
     *
     * @memberof BulkUpdateComponent
     */
    public resetFormData(): void {
        if (this.isPOVoucher) {
            this.bulkUpdateForm.get("purchaseDate")?.patchValue("");
            this.bulkUpdateForm.get("dueDate")?.patchValue("");
            this.bulkUpdateForm.get("warehouseUniqueName")?.patchValue("");
        } else {
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
    }

    /**
     * Handle SelectedField dropdown select and set defalut value other related fields 
     *
     * @memberof BulkUpdateComponent
     */
    public handleSelectedFieldSelect(): void {
        const selectedValue = this.bulkUpdateForm.get('selectedField')?.value;

        if (selectedValue === 'pdfTemplate' && this.templatesList?.length) {
            this.bulkUpdateForm.get("templateUniqueName")?.patchValue(this.templatesList[0].value);
            this.templateName = this.templatesList[0].label;
        } else if (selectedValue === 'signature' && this.templateSignaturesOptions?.length) {
            this.bulkUpdateForm.get("signatureOption")?.patchValue(this.templateSignaturesOptions[0].value);
            this.signatureName = this.templateSignaturesOptions[0].label;
        }
    }

    /**
     * Call API to update all selected Invoice/Voucher
     *
     * @memberof BulkUpdateComponent
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
                        dueDate = dayjs(this.bulkUpdateForm.get("dueDate")?.value).format(GIDDH_DATE_FORMAT);
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

    /**
     * Call API to update all selected Purchase Order Voucher
     *
     * @memberof BulkUpdateComponent
     */
    public updateBulkPO(): void {
        if (!this.validateBulkUpdateFields()) {
            return
        }
        const model = this.bulkUpdateForm.value;
        const actionType = model.action;
        delete model.action;

        model.purchaseNumbers = this.inputData?.purchaseNumbers;
        this.componentStore.purchaseOrderBulkUpdateAction({ payload: model, actionType: actionType })
    }

    /**
     * Bulk Update Request API Call
     *
     * @param {*} payload
     * @param {string} actionType
     * @memberof BulkUpdateComponent
     */
    public bulkUpdateRequest(payload: any, actionType: string): void {
        payload.voucherUniqueNames = this.inputData?.voucherUniqueNames;
        payload.voucherType = this.inputData?.voucherType;

        this.componentStore.bulkUpdateInvoice({ payload: payload, actionType: actionType });
    }

    /**
     * Update Image/Slogan confirmation true
     *
     * @memberof BulkUpdateComponent
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
     * @memberof BulkUpdateComponent
     */
    public onCancelBulkUpdateImageSloganModal(): void {
        this.clearImage();
        this.bulkUpdateForm.get("slogan")?.patchValue("");
    }

    /**
     * Open confirmation dialog
     *
     * @private
     * @memberof BulkUpdateComponent
     */
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

    /**
     * This will validate bulk update form and will update fields
     *
     * @memberof BulkUpdateComponent
     */
    public validateBulkUpdateFields(): boolean {
        let isValid = true;
        const form = this.bulkUpdateForm.value;

        if (this.bulkUpdateForm.value.action) {
            if (form.action === BULK_UPDATE_FIELDS.purchasedate) {
                if (!form.purchaseDate) {
                    isValid = false;
                    this.toasterService.showSnackBar('error', this.localeData?.po_date_error);
                } else {
                    let date = dayjs(form.purchaseDate).format(GIDDH_DATE_FORMAT);
                    this.bulkUpdateForm.get('purchaseDate').patchValue(date);
                }
            } else if (form.action === BULK_UPDATE_FIELDS.duedate) {
                if (!form.dueDate) {
                    isValid = false;
                    this.toasterService.showSnackBar('error', this.localeData?.po_expirydate_error);
                } else {
                    this.bulkUpdateForm.get('dueDate').patchValue(dayjs(form.dueDate).format(GIDDH_DATE_FORMAT));
                }
            } else if (form.action === BULK_UPDATE_FIELDS.warehouse) {
                if (!form.warehouseUniqueName) {
                    isValid = false;
                    this.toasterService.showSnackBar('error', this.localeData?.po_warehouse_error);
                }
            }
        } else {
            isValid = false;
            this.toasterService.showSnackBar('error', this.localeData?.po_bulkupdate_error);
        }

        return isValid;
    }
}