import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { EMAIL_VALIDATION_REGEX, IOption } from '../../app.constant';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { cloneDeep } from '../../lodash-optimized';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { CopyType, FileTypeEnum } from '../../shared/Enums/common.enum';
import { VouchersUtilityService } from '../utility/vouchers.utility.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TributeConfig } from '../../shared/helpers/directives/tributeMention/tributeType';
import { Router } from '@angular/router';

type ExportType = 'SINGLE_PDF' | 'MULTIPLE_PDF' | 'EXCEL' | 'CSV';
enum ExportTypeEnum {
    singlePdf = 'SINGLE_PDF',
    multiplePdf = 'MULTIPLE_PDF',
    excel = FileTypeEnum.XLSX,
    csv = FileTypeEnum.CSV
};

@Component({
    selector: 'app-bulk-export',
    templateUrl: './bulk-export.component.html',
    styleUrls: ['./bulk-export.component.scss'],
    providers: [VoucherComponentStore],
    standalone: false
})
export class BulkExportComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Download Voucher Copy Options */
    public downloadCopyOptions: any[] = [];
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form Group Instance */
    public exportForm: FormGroup;
    /** Last vouchers get in progress Observable */
    public bulkExportVoucherInProgress$: Observable<any> = this.componentStore.bulkExportVoucherInProgress$;
    /** Holds the current date */
    public todayDate: any = new Date();
    /** List of available file formats with predefined values */
    public fileFormatList = [
        { value: 'Voucher Date', label: 'Voucher Date', key: 'DATE', showValue: dayjs(this.todayDate).format(GIDDH_DATE_FORMAT) },
        { value: 'Entry No', label: 'Entry No', key: 'ENTRY_NO', showValue: "3824" },
        { value: 'Account Name', label: 'Account Name', key: 'ACC_NAME', showValue: "Walkover" }
    ];
    /** List of copy type */
    public copyTypes: IOption[] = [];
    /** Prefix of format file name */
    public fileFormatPrefix: string = "AS";
    /* Will check if form is valid */
    public isValidForm: boolean = true;
    /** Holds the file type enum */
    public fileTypeEnum = FileTypeEnum;
    /** Holds the export type enum */
    public exportTypeEnum = ExportTypeEnum;
    /** Holds the vouchers only support excel export */
    public vouchersOnlySupportExcelExport: string[] = [VoucherTypeEnum.estimate, VoucherTypeEnum.proforma, 'purchase order'];
    /** Tribute config */
    public tributeConfig: TributeConfig = {
        trigger: '{',
        suggestionPrefix: '{',
        suggestionSuffix: '}'
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private toasterService: ToasterService,
        private generalService: GeneralService,
        private componentStore: VoucherComponentStore,
        private router: Router,
        private vouchersUtilityService: VouchersUtilityService
    ) { }

    /**
     * Initializes the component
     *
     * @memberof BulkExportComponent
     */
    public ngOnInit(): void {
        this.exportForm = this.formBuilder.group({
            copyTypes: [''],
            recipients: [''],
            exportType: new FormControl<ExportType>(ExportTypeEnum.multiplePdf),
            mergePdf: new FormControl<boolean>(false, { nonNullable: true }),
            attachmentExport: false,
            voucherExport: true,
            selectedFormatList: [""],
            fileNameFormat: "",
            showAccountCustomFields: new FormControl<boolean>(false, { nonNullable: true }),
            showVoucherCustomFields: new FormControl<boolean>(false, { nonNullable: true }),
            showBillingAddress: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingAddress: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingDetails: new FormControl<boolean>(false, { nonNullable: true }),
            showTaxableValueBeforeDiscount: new FormControl<boolean>(false, { nonNullable: true }),
            showDiscountValue: new FormControl<boolean>(false, { nonNullable: true }),
            showTaxValue: new FormControl<boolean>(false, { nonNullable: true }),
            showVoucherNote: new FormControl<boolean>(false, { nonNullable: true }),
            showEInvoiceDetails: new FormControl<boolean>(false, { nonNullable: true }),
            showMobileNumber: new FormControl<boolean>(false, { nonNullable: true }),
            showAttentionTo: new FormControl<boolean>(false, { nonNullable: true }),
            showEmail: new FormControl<boolean>(false, { nonNullable: true }),
            showOtherTaxValue: new FormControl<boolean>(false, { nonNullable: true })
        });

        if (this.vouchersOnlySupportExcelExport.includes(this.inputData?.voucherType)) {
            this.exportForm.get('exportType').setValue(ExportTypeEnum.excel);
        }

        this.getRecipientEmail();

        if (this.inputData?.voucherType === VoucherTypeEnum.sales) {
            this.exportForm.get('copyTypes').setValidators(Validators.required);
            this.exportForm.get('copyTypes').updateValueAndValidity();
        }

        this.componentStore.bulkExportVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response?.status === "success" && response?.body) {
                    if (response.body.type === "base64") {
                        this.dialogRef?.close();
                        let blob = this.generalService.base64ToBlob(response.body.file, 'application/zip', 512);
                        return saveAs(blob, this.inputData?.voucherType + `.zip`);
                    } else {
                        this.router.navigate(["/pages/downloads/exports"]);
                        this.dialogRef?.close();
                    }
                } else {
                    this.dialogRef?.close();
                }
            }
        });

        this.componentStore.exportVouchersFile$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                if (response.message) {
                    this.router.navigate(["/pages/downloads/exports"]);
                    this.toasterService.showSnackBar("success", response.message);
                } else {
                    const mimeType = this.exportForm.get('exportType').value === ExportTypeEnum.csv
                        ? 'text/csv'
                        : 'application/vnd.ms-excel';
                    const blob = this.generalService.base64ToBlob(response.data, mimeType, 512);
                    saveAs(blob, response.name);
                }
                this.dialogRef?.close(true);
            }
        });
    }

    /**
     * Get company email
     *
     * @memberof BulkExportComponent
     */
    public getRecipientEmail(): void {
        this.componentStore.sessionUserEmail$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result && result.user) {
                this.exportForm.get('recipients').patchValue(result.user.email);
            }
        });
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof BulkExportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Export Vouchers API Call
     *
     * @param {boolean} sendMail
     * @return {*}  {void}
     * @memberof BulkExportComponent
     */
    public exportVouchers(sendMail: boolean): void {
        if (this.exportForm.get('exportType').value === ExportTypeEnum.excel || this.exportForm.get('exportType').value === ExportTypeEnum.csv) {
            this.exportExcelDownload();
            return;
        }

        this.isValidForm = this.exportForm.valid;
        if (this.exportForm.invalid && this.exportForm.get('voucherExport').value) {
            return;
        }
        let getRequest: any = { from: "", to: "", type: "", mail: false, q: "" };
        getRequest.from = this.inputData?.advanceFilters?.from;
        getRequest.to = this.inputData?.advanceFilters?.to;
        getRequest.type = this.inputData?.voucherType;
        getRequest.mail = sendMail;
        getRequest.q = (this.inputData?.advanceFilters?.q) ? this.inputData?.advanceFilters?.q : "";

        const postRequest = {
            ...cloneDeep(this.inputData?.advanceFilters),
            mergePdf: this.exportForm.get('mergePdf')?.value ?? false,
            uniqueNames: this.inputData?.voucherUniqueNames ?? [],
            attachmentExport: this.exportForm.get('attachmentExport').value,
            voucherExport: this.exportForm.get('voucherExport').value,
            fileNameFormat: this.exportForm.get('selectedFormatList').value.trim(),
        };

        if (postRequest.fileNameFormat.length) {
            (Array.isArray(this.fileFormatList) ? this.fileFormatList : []).forEach(format => {
                const pattern = new RegExp(`\\{${format.value}\\}`, 'g');
                postRequest.fileNameFormat = postRequest.fileNameFormat.replace(pattern, `\${${format.key}}`);
            });
        } else {
            postRequest.fileNameFormat = this.fileFormatPrefix + "-${" + this.fileFormatList[0].key + "}-${" + this.fileFormatList[1].key + "}-${" + this.fileFormatList[2].key + "}";
        }

        if (this.inputData?.voucherType === VoucherTypeEnum.sales) {
            postRequest.copyTypes = this.exportForm.value?.copyTypes;
        }
        if (!postRequest.attachmentExport) {
            delete postRequest.fileNameFormat;
        }
        delete postRequest.count;
        delete postRequest.page;
        delete postRequest.q;

        let validRecipients: boolean = true;

        if (sendMail && this.exportForm.value?.recipients) {
            let recipients = this.exportForm.value?.recipients.split(",");
            let validEmails = [];
            if (recipients && recipients.length > 0) {
                (Array.isArray(recipients) ? recipients : []).forEach(email => {
                    if (validRecipients && email.trim() && !EMAIL_VALIDATION_REGEX.test(email.trim())) {
                        let invalidEmail = this.localeData?.invalid_email;
                        invalidEmail = invalidEmail?.replace("[EMAIL]", email);
                        this.toasterService.showSnackBar("error", invalidEmail);
                        validRecipients = false;
                    }

                    if (validRecipients && email.trim() && EMAIL_VALIDATION_REGEX.test(email.trim())) {
                        validEmails.push(email.trim());
                    }
                });
            }
            postRequest.email = { to: validEmails };
        } else {
            postRequest.email = undefined;
            postRequest.sendTo = undefined;
        }

        if (!validRecipients) {
            return;
        }

        if (sendMail && !this.exportForm.value?.recipients) {
            this.toasterService.showSnackBar("error", this.localeData?.email_required);
            return;
        }

        if (!postRequest.copyTypes) {
            postRequest.copyTypes = ["ORIGINAL"];
        }

        this.componentStore.bulkExportVoucher({ getRequest: getRequest, postRequest: postRequest });
    }

    /**
     * Generates a formatted file name based on selected file formats.
     *
     * @returns {string} The formatted file name string.
     * @memberof BulkExportComponent
     */
    public getFileFormat() {
        let fileNameFormat = this.exportForm.get("selectedFormatList").value;
        (Array.isArray(this.fileFormatList) ? this.fileFormatList : []).forEach((format) => {
            if(this.exportForm.get("selectedFormatList").value.includes(`{${format.value}}`)) {
                fileNameFormat = fileNameFormat.replaceAll(`{${format.value}}`, format.showValue);
            }
        });
        this.exportForm.get("fileNameFormat").patchValue(fileNameFormat);
    }
    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof ExportLedgerComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.copyTypes = [
                { value: CopyType.ORIGINAL, label: this.localeData?.invoice_copy_options?.original },
                { value: CopyType.CUSTOMER, label: this.localeData?.invoice_copy_options?.customer },
                { value: CopyType.TRANSPORT, label: this.localeData?.invoice_copy_options?.transport }
            ];
        }
    }

    /**
     * Export Excel File and Download
     *
     * @private
     * @memberof BulkExportComponent
     */
    private exportExcelDownload(): void {
        const {
            exportType,
            showAccountCustomFields,
            showVoucherCustomFields,
            showBillingAddress,
            showShippingAddress,
            showShippingDetails,
            showTaxableValueBeforeDiscount,
            showDiscountValue,
            showTaxValue,
            showVoucherNote,
            showEInvoiceDetails,
            showMobileNumber,
            showAttentionTo,
            showEmail,
            showOtherTaxValue
        } = this.exportForm.value;

        this.componentStore.exportVouchers({
            to: this.inputData?.advanceFilters?.to,
            from: this.inputData?.advanceFilters?.from,
            exportType,
            dataToSend: {
                type: this.inputData?.voucherType,
                uniqueNames: this.inputData?.voucherUniqueNames,
                showAccountCustomFields,
                showVoucherCustomFields,
                showBillingAddress,
                showShippingAddress,
                showShippingDetails,
                showTaxableValueBeforeDiscount,
                showDiscountValue,
                showTaxValue,
                showVoucherNote,
                showEInvoiceDetails,
                showMobileNumber,
                showAttentionTo,
                showEmail,
                showOtherTaxValue
            }
        });
    }

    /**
     * Callback for export type change
     *
     * @param {MatRadioChange} event
     * @memberof BulkExportComponent
     */
    public onExportTypeChange(event: MatRadioChange): void {
        if (event.value === this.exportTypeEnum.excel || event.value === this.exportTypeEnum.csv) {
            this.exportForm.get('attachmentExport').setValue(false);
            this.exportForm.get('attachmentExport').disable();
        } else {
            this.exportForm.get('attachmentExport').enable();
        }
    }

    /**
     * Callback for voucher export change
     *
     * @param {MatSlideToggleChange} event
     * @memberof BulkExportComponent
     */
    public onVoucherExportChange(event: MatSlideToggleChange): void {
        if (event.checked) {
            this.exportForm.get('exportType').setValue(this.exportTypeEnum.multiplePdf);
        } else {
            this.exportForm.get('attachmentExport').enable();
        }
    }
}
