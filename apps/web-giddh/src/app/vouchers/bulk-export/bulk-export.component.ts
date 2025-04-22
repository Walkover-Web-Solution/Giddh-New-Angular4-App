import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { EMAIL_VALIDATION_REGEX } from '../../app.constant';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { cloneDeep } from '../../lodash-optimized';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { CopyType, FileTypeEnum } from '../../shared/Enums/common.enum';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { VouchersUtilityService } from '../utility/vouchers.utility.service';

type ExportType = 'SINGLE_PDF' | 'MULTIPLE_PDF' | 'EXCEL';
enum ExportTypeEnum {
    singlePdf = 'SINGLE_PDF',
    multiplePdf = 'MULTIPLE_PDF',
    excel = 'EXCEL'
};

@Component({
    selector: 'app-bulk-export',
    templateUrl: './bulk-export.component.html',
    styleUrls: ['./bulk-export.component.scss'],
    providers: [VoucherComponentStore]
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
        { uniqueName: 'DATE', name: 'Voucher Date', showValue: dayjs(this.todayDate).format(GIDDH_DATE_FORMAT) },
        { uniqueName: 'ENTRY_NO', name: 'Entry No', showValue: "3824" },
        { uniqueName: 'ACC_NAME', name: 'Account Name', showValue: "Walkover" }
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

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private toasterService: ToasterService,
        private generalService: GeneralService,
        private componentStore: VoucherComponentStore,
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
            selectedFormatList: [null],
            fileNameFormat: "",
            showAccountCustomFields: new FormControl<boolean>(false, { nonNullable: true }),
            showVoucherCustomFields: new FormControl<boolean>(false, { nonNullable: true }),
            showBillingTaxNumber: new FormControl<boolean>(false, { nonNullable: true }),
            showBillingPinCode: new FormControl<boolean>(false, { nonNullable: true }),
            showBillingStateName: new FormControl<boolean>(false, { nonNullable: true }),
            showBillingCountryName: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingAddress: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingTaxNumber: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingPinCode: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingStateName: new FormControl<boolean>(false, { nonNullable: true }),
            showShippingCountryName: new FormControl<boolean>(false, { nonNullable: true }),
            fileType: new FormControl<FileTypeEnum.XLSX | FileTypeEnum.CSV | 'base64'>(FileTypeEnum.XLSX, { nonNullable: true }),
        });

        this.getRecipientEmail();

        if (this.inputData?.voucherType === VoucherTypeEnum.sales) {
            this.exportForm.get('copyTypes').setValidators(Validators.required);
            this.exportForm.get('copyTypes').updateValueAndValidity();
        }

        this.componentStore.bulkExportVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response?.status === "success" && response?.body) {
                    if (response.body.type === "base64") {
                        this.dialogRef.close();
                        let blob = this.generalService.base64ToBlob(response.body.file, 'application/zip', 512);
                        return saveAs(blob, this.inputData?.voucherType + `.zip`);
                    } else {
                        this.dialogRef.close();
                    }
                } else {
                    this.dialogRef.close();
                }
            }
        });

        this.componentStore.exportVouchersFile$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                if (response.message) {
                    this.toasterService.showSnackBar("success", response.message);
                } else {
                    const mimeType = this.exportForm.get('fileType').value === FileTypeEnum.CSV
                        ? 'text/csv'
                        : 'application/vnd.ms-excel';
                    const blob = this.generalService.base64ToBlob(response, mimeType, 512);
                    const fileName = `${this.vouchersUtilityService.getExportFileNameByVoucherType(this.inputData?.voucherType, this.inputData?.allVouchersSelected, this.inputData?.localeData)}.${this.exportForm.get('fileType').value === FileTypeEnum.CSV ? FileTypeEnum.CSV : FileTypeEnum.XLSX}`;
                    saveAs(blob, fileName);
                }
                this.dialogRef.close(true);
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
        if (this.exportForm.get('exportType').value === ExportTypeEnum.excel) {
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
            fileNameFormat: this.exportForm.get('fileNameFormat').value
        };

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
                recipients.forEach(email => {
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

        if (!this.exportForm.get('selectedFormatList').value?.length) {
            postRequest.fileNameFormat = this.fileFormatPrefix + "-${" + this.fileFormatList[0].uniqueName + "}-${" + this.fileFormatList[1].uniqueName + "}-${" + this.fileFormatList[2].uniqueName + "}";
        }

        this.componentStore.bulkExportVoucher({ getRequest: getRequest, postRequest: postRequest });
    }

    /**
     * Returns a sorted list of file formats.The selected formats appear at the top in the order they were selected.
     * 
     * @returns {any []} A sorted array of file formats.
     * @memberof BulkExportComponent
     */
    public getSortedFormatList(): any[] {
        let selectedList = this.exportForm.get("selectedFormatList")?.value || [];

        return [...this.fileFormatList].sort((a, b) => {
            let indexA = selectedList.findIndex(item => item.uniqueName === a.uniqueName);
            let indexB = selectedList.findIndex(item => item.uniqueName === b.uniqueName);

            if (indexA === -1) indexA = Infinity;
            if (indexB === -1) indexB = Infinity;

            return indexA - indexB;
        });
    }


    /**
     * Generates a formatted file name based on selected file formats.
     *
     * @returns {string} The formatted file name string.
     * @memberof BulkExportComponent
     */
    public getFileFormat(): string {
        let fileFormat = this.fileFormatPrefix;
        let fileNameFormat = this.fileFormatPrefix;
        this.exportForm.get("selectedFormatList").value?.forEach((format) => {
            fileFormat += `-${format.showValue}`
            fileNameFormat += "-${" + format.uniqueName + "}";
        });
        this.exportForm.get("fileNameFormat").patchValue(fileNameFormat);
        return fileFormat;
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
            fileType,
            showAccountCustomFields,
            showVoucherCustomFields,
            showBillingTaxNumber,
            showBillingPinCode,
            showBillingStateName,
            showBillingCountryName,
            showShippingAddress,
            showShippingTaxNumber,
            showShippingPinCode,
            showShippingStateName,
            showShippingCountryName
        } = this.exportForm.value;

        this.componentStore.exportVouchers({
            to: this.inputData?.advanceFilters?.to,
            from: this.inputData?.advanceFilters?.from,
            fileType,
            dataToSend: {
                type: this.inputData?.voucherType,
                uniqueNames: this.inputData?.voucherUniqueNames,
                showAccountCustomFields,
                showVoucherCustomFields,
                showBillingPinCode,
                showBillingTaxNumber,
                showBillingStateName,
                showBillingCountryName,
                showShippingAddress,
                showShippingTaxNumber,
                showShippingPinCode,
                showShippingStateName,
                showShippingCountryName
            }
        });
    }
}
