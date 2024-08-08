import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { EMAIL_VALIDATION_REGEX } from '../../app.constant';
import * as saveAs from 'file-saver';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { cloneDeep } from '../../lodash-optimized';

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

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private toasterService: ToasterService,
        private generalService: GeneralService,
        private componentStore: VoucherComponentStore
    ) {

    }

    public ngOnInit(): void {
        this.exportForm = this.formBuilder.group({
            copyTypes: [''],
            recipients: ['']
        });

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
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public exportVouchers(sendMail: boolean): void {
        if (this.exportForm.invalid) {
            return;
        }
        
        let getRequest: any = { from: "", to: "", type: "", mail: false, q: "" };
        let postRequest: any;
        getRequest.from = this.inputData?.advanceFilters?.from;
        getRequest.to = this.inputData?.advanceFilters?.to;
        getRequest.type = this.inputData?.voucherType;
        getRequest.mail = sendMail;
        getRequest.q = (this.inputData?.advanceFilters?.q) ? this.inputData?.advanceFilters?.q : "";

        postRequest = cloneDeep(this.inputData?.advanceFilters);
        postRequest.uniqueNames = this.inputData?.voucherUniqueNames;

        if (this.inputData?.voucherType === VoucherTypeEnum.sales) {
            postRequest.copyTypes = this.exportForm.value?.copyTypes;
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

        this.componentStore.bulkExportVoucher({ getRequest: getRequest, postRequest: postRequest });
    }
}
