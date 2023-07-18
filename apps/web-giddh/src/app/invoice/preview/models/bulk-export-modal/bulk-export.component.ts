import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BulkVoucherExportService } from 'apps/web-giddh/src/app/services/bulkvoucherexport.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { EMAIL_VALIDATION_REGEX } from 'apps/web-giddh/src/app/app.constant';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';

@Component({
    selector: 'invoice-bulk-export',
    templateUrl: './bulk-export.component.html',
    styleUrls: [`./bulk-export.component.scss`]
})

export class BulkExportModal implements OnInit, OnDestroy {
    /** Type of voucher */
    @Input() public type: string = "sales";
    /** Selected Vouchers */
    @Input() public voucherUniqueNames: any[] = [];
    /** Advance Search Parameters */
    @Input() public advanceSearch: any;
    /** From/To Date On Page */
    @Input() public dateRange: any;
    /** Total Items For Export */
    @Input() public totalItems: any = 0;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Emit the close modal event */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    /** Download Voucher Copy Options */
    public downloadCopyOptions: any[] = [];

    /** Selected download Voucher Copy Options */
    public copyTypes: any = [];
    /** Email Receivers */
    public recipients: any = "";
    /** Will handle if api call is in process */
    public isLoading: boolean = false;

    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private bulkVoucherExportService: BulkVoucherExportService,
        private generalService: GeneralService,
        private toaster: ToasterService,
        private store: Store<AppState>) {

    }

    /**
     * Initializes the component
     *
     * @memberof BulkExportModal
     */
    public ngOnInit(): void {
        this.downloadCopyOptions = [
            { label: this.localeData?.invoice_copy_options?.original, value: 'ORIGINAL' },
            { label: this.localeData?.invoice_copy_options?.customer, value: 'CUSTOMER' },
            { label: this.localeData?.invoice_copy_options?.transport, value: 'TRANSPORT' }
        ];
        this.getRecipientEmail();
    }

    /**
     * Get company email
     *
     * @memberof BulkExportModal
     */
    public getRecipientEmail(): void {
        this.store.pipe(select(appState => appState.session.user), take(1)).subscribe(result => {
            if (result && result.user) {
                this.recipients = result.user.email;
            }
        });
    }

    /**
     * Export the vouchers
     *
     * @param {boolean} event
     * @memberof BulkExportModal
     */
    public exportVouchers(event: boolean): void {
        if (this.isLoading) {
            return;
        }

        let getRequest: any = { from: "", to: "", type: "", mail: false, q: "" };
        let postRequest: any;
        getRequest.from = this.dateRange.from;
        getRequest.to = this.dateRange.to;
        getRequest.type = this.type;
        getRequest.mail = event;
        getRequest.q = (this.advanceSearch.q) ? this.advanceSearch.q : "";

        postRequest = this.advanceSearch;
        if (this.generalService.voucherApiVersion === 2) {
            postRequest.uniqueNames = this.voucherUniqueNames;
        } else {
            postRequest.voucherUniqueNames = this.voucherUniqueNames;
        }
        postRequest.copyTypes = this.copyTypes;

        delete postRequest.count;
        delete postRequest.page;
        delete postRequest.q;

        let validRecipients: boolean = true;

        if (event && this.recipients) {
            let recipients = this.recipients.split(",");
            let validEmails = [];
            if (recipients && recipients.length > 0) {
                recipients.forEach(email => {
                    if (validRecipients && email.trim() && !EMAIL_VALIDATION_REGEX.test(email.trim())) {
                        this.toaster.clearAllToaster();

                        let invalidEmail = this.localeData?.invalid_email;
                        invalidEmail = invalidEmail?.replace("[EMAIL]", email);
                        this.toaster.errorToast(invalidEmail);
                        validRecipients = false;
                    }

                    if (validRecipients && email.trim() && EMAIL_VALIDATION_REGEX.test(email.trim())) {
                        validEmails.push(email.trim());
                    }
                });
            }
            if (this.generalService.voucherApiVersion === 2) {
                postRequest.email = { to: validEmails };
            } else {
                postRequest.sendTo = { recipients: validEmails };
            }
        } else {
            postRequest.email = undefined;
            postRequest.sendTo = undefined;
        }

        if (!validRecipients) {
            return;
        }

        this.isLoading = true;

        this.bulkVoucherExportService.bulkExport(getRequest, postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response?.status === "success" && response?.body) {
                if (response.body.type === "base64") {
                    this.closeModal();
                    let blob = this.generalService.base64ToBlob(response.body.file, 'application/zip', 512);
                    return saveAs(blob, this.type + `.zip`);
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.successToast(response.body.file);
                    this.closeModal();
                }
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(response?.message);
                this.closeModal();
            }
        });
    }

    /**
     * Emit the close modal event
     *
     * @memberof BulkExportModal
     */
    public closeModal(): void {
        this.closeModelEvent.emit(true);
    }

    /**
     * Releases memory
     *
     * @memberof BulkExportModal
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
