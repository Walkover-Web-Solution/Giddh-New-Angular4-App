import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable, of, ReplaySubject } from 'rxjs';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { Router } from '@angular/router';
import { findIndex, isEmpty } from '../../../../lodash-optimized';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { VoucherTypeEnum } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';
import { saveAs } from 'file-saver';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
/**
 * InvoicesEnum enumeration
 * Defines constant values for InvoicesEnum
 */
enum InvoicesEnum {
    Invoices = 'invoices'
};
/**
 * Handles Component functionality
 */
@Component({
    selector: 'download-or-send-mail-invoice',
    templateUrl: './download-or-send-mail.component.html',
    styleUrls: ['./download-or-send-mail.component.scss'],
    standalone:false
})

/**
 * DownloadOrSendInvoiceOnMailComponent component
 * Handles downloadorsendinvoiceonmail functionality and user interactions
 */
export class DownloadOrSendInvoiceOnMailComponent implements OnInit, OnDestroy {
    /** Selected voucher details */
    @Input() public selectedVoucher: any;
    @Input() public base64Data: any;
    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    /** Hold current voucher filter */
    @Input() public currentVoucherFilter: string;
    @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
    @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();
    @Output() public downloadInvoiceEvent: EventEmitter<object> = new EventEmitter();
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;

    public showEmailTextarea: boolean = false;
    public showPdfWrap: boolean = false;
    public showEditButton: boolean = false;
    public isErrOccured$: Observable<boolean>;
    public invoiceType: string[] = [];
    public isSendSmsEnabled: boolean = false;
    public isElectron = Configuration.isElectron;
    public voucherRequest = null;
    public accountUniqueName: string = '';
    public selectedInvoiceNo: string = '';
    public selectedVoucherType: string = null;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    public voucherPreview$: Observable<any> = of(null);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Holds voucher unique name */
    public selectedVoucherUniqueName: string = "";
    /** Voucher has attachments */
    public voucherHasAttachments: boolean = false;
    /** True if attachment is checked */
    public isAttachment: boolean = false;
    /** Holds active selected Tab Index  */
    public selectedTabIndex: number = 0;
    /** Holds invoice enum */
    public invoicesEnum: string = InvoicesEnum.Invoices;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private _toasty: ToasterService,
        private sanitizer: DomSanitizer,
        private store: Store<AppState>,
        private _invoiceActions: InvoiceActions,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private _router: Router,
        private generalService: GeneralService,
        private commonService: CommonService,
        private changeDetection: ChangeDetectorRef
    ) {
        this.isErrOccured$ = this.store.pipe(select(p => p.invoice.invoiceDataHasError), distinctUntilChanged(), takeUntil(this.destroyed$));
        this.voucherPreview$ = this.store.pipe(select(p => p.receipt.base64Data), distinctUntilChanged(), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.selectedVoucherType = this.selectedVoucher?.voucherType;
        this.accountUniqueName = this.selectedVoucher?.accountUniqueName || this.selectedVoucher.account?.uniqueName;

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2 && ![VoucherTypeEnum.generateEstimate, VoucherTypeEnum.generateProforma].includes(this.selectedVoucher?.voucherType)) {
            this.invoiceType.push('Original');

            let getRequest = {
                voucherType: this.selectedVoucher?.voucherType,
                uniqueName: this.selectedVoucher?.uniqueName
            };

            this.sanitizedPdfFileUrl = null;
            this.voucherHasAttachments = false;
            this.commonService.downloadFile(getRequest, "VOUCHER").pipe(takeUntil(this.destroyed$)).subscribe(result => {
                /**
                 * Handles if functionality
                 */
                if (result?.body) {
                    /** Creating voucher pdf start */
                    const blob = this.generalService.base64ToBlob(result.body.data, 'application/pdf', 512);
                    const file = new Blob([blob], { type: 'application/pdf' });
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);

                    this.selectedInvoiceNo = this.selectedVoucher.voucherNumber;
                    this.selectedVoucherType = this.selectedVoucher?.voucherType;
                    this.selectedVoucherUniqueName = this.selectedVoucher?.uniqueName;

                    let accountUniqueName = (this.selectedVoucher?.accountUniqueName || this.selectedVoucher.account?.uniqueName);

                    this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(accountUniqueName, {
                        invoiceNumber: this.selectedVoucher.voucherNumber,
                        voucherType: this.selectedVoucher?.voucherType,
                        uniqueName: this.selectedVoucher?.uniqueName
                    }));

                    this.showPdfWrap = true;
                    this.showEditButton = true;

                    /**
                     * Handles if functionality
                     */
                    if (result.body.attachments?.length > 0) {
                        this.voucherHasAttachments = true;
                    }

                    this.changeDetection.detectChanges();
                }
            });
        } else {
            this.voucherPreview$.subscribe((o: any) => {
                /**
                 * Handles if functionality
                 */
                if (o) {
                    const reader = new FileReader();

                    reader.addEventListener('loadend', (e: any) => {
                        const blob = this.generalService.base64ToBlob(e.srcElement.result.split(',')[1], 'application/pdf', 512);
                        const file = new Blob([blob], { type: 'application/pdf' });
                        URL.revokeObjectURL(this.pdfFileURL);
                        this.pdfFileURL = URL.createObjectURL(file);
                        this.sanitizedPdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                        this.changeDetection.detectChanges();
                    });

                    reader.readAsDataURL(o);
                    this.selectedInvoiceNo = o.request.voucherNumber?.join();
                    this.selectedVoucherType = o.request.voucherType;
                    this.selectedVoucherUniqueName = o.request?.uniqueName;

                    this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(o.request.accountUniqueName, {
                        invoiceNumber: o.request.voucherNumber?.join(),
                        voucherType: o.request?.voucherType,
                        /**
                         * Handles uniqueName functionality
                         */
                        uniqueName: (this.voucherApiVersion === 2) ? o.request?.uniqueName : undefined
                    }));

                    this.showPdfWrap = true;
                    this.showEditButton = true;
                    this.changeDetection.detectChanges();
                } else {
                    this.showPdfWrap = false;
                    this.showEditButton = false;
                    this.changeDetection.detectChanges();
                }
            });
        }

        this.store.pipe(select(p => p.invoice.settings), takeUntil(this.destroyed$)).subscribe((o: any) => {
            /**
             * Handles if functionality
             */
            if (o && o.invoiceSettings) {
                this.isSendSmsEnabled = o.invoiceSettings.sendInvLinkOnSms;
                this.changeDetection.detectChanges();
            } else {
                this.store.dispatch(this._invoiceActions.getInvoiceSetting());
            }
        });

        this.store.pipe(select(p => p.receipt.voucher), takeUntil(this.destroyed$)).subscribe((o: any) => {
            /**
             * Handles if functionality
             */
            if (o) {
                this.accountUniqueName = o.account?.uniqueName;
                /**
                 * Handles if functionality
                 */
                if (o.templateDetails?.templateUniqueName) {
                    this.store.dispatch(this._invoiceActions.GetTemplateDetailsOfInvoice(o.templateDetails?.templateUniqueName));
                }
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * Handles confirmation event
     */
    public onConfirmation(amount) {
        this.closeModelEvent.emit(amount);
    }

    /**
     * Handles cancel event
     */
    public onCancel(t) {
        let o: any = {
            action: t
        };
        this.ngOnDestroy();
        this.closeModelEvent.emit(o);
    }

    /**
     * onDownloadInvoice
     */
    public onDownloadInvoice() {
        this.downloadOrSendMailEvent.emit({ action: 'download', emails: null });
    }

    /**
     * onSendInvoiceOnMail
     */
    public onSendInvoiceOnMail(email: string) {
        /**
         * Handles if functionality
         */
        if (isEmpty(email)) {
            this._toasty.showSnackBar('warning', this.localeData?.enter_valid_email_error);
            return;
        }
        let emailList = email.split(',');
        /**
         * Handles if functionality
         */
        if (Array.isArray(emailList)) {
            this.downloadOrSendMailEvent.emit({ action: 'send_mail', emails: emailList, typeOfInvoice: this.invoiceType });
            this.showEmailTextarea = false;
        } else {
            this._toasty.showSnackBar('error', this.localeData?.invalid_emails);
        }
    }

    /**
     * onSendInvoiceOnSms
     */
    public onSendInvoiceOnSms(numbers: string) {
        /**
         * Handles if functionality
         */
        if (isEmpty(numbers)) {
            this._toasty.warningToast(this.localeData?.enter_valid_number_error);
            return;
        }
        let numberList = numbers.split(',');
        /**
         * Handles if functionality
         */
        if (Array.isArray(numberList)) {
            this.downloadOrSendMailEvent.emit({ action: 'send_sms', numbers: numberList });
            this.showEmailTextarea = false;
        }
    }

    /**
     * Handle on select invoice copy
     *
     * @param event
     */
    public onSelectInvoiceCopy(event: MatCheckboxChange): void {
        /**
         * Handles if functionality
         */
        if (event) {
            let val = event.source.value;
            /**
             * Handles if functionality
             */
            if (event.checked) {
                this.invoiceType.push(val);
            } else {
                let idx = findIndex(this.invoiceType, (o) => o === val);
                this.invoiceType.splice(idx, 1);
            }
        }
    }

    /**
     * Handles editVoucher functionality
     */
    public editVoucher() {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            /**
             * Handles if functionality
             */
            if (this.isElectron) {
                // For Electron, use router navigation instead of window.open
                this._router.navigate([
                    '/pages/vouchers',
                    this.selectedVoucherType?.toString()?.replace(/-/g, ' '),
                    this.accountUniqueName,
                    this.selectedVoucherUniqueName,
                    'edit'
                ], { queryParams: { redirect: this._router.url } });
            } else {
                // For web, use window.open to open in new tab
                const url = this._router.serializeUrl(
                    this._router.createUrlTree([
                      '/pages/vouchers',
                      this.selectedVoucherType?.toString()?.replace(/-/g, ' '),
                      this.accountUniqueName,
                      this.selectedVoucherUniqueName,
                      'edit'
                    ], { queryParams: { redirect: this._router.url } })
                  );
                  window.open(url, '_blank');
            }
        } else {
            this._router.navigate(['/pages/proforma-invoice/invoice', this.selectedVoucherType, this.accountUniqueName, this.selectedInvoiceNo], { queryParams: { uniqueName: this.selectedVoucherUniqueName } });
        }
    }

    /**
     * downloadInvoice
     */
    public downloadInvoice() {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            let dataToSend = {
                copyTypes: this.invoiceType,
                voucherType: this.selectedVoucher?.voucherType,
                uniqueName: this.selectedVoucher?.uniqueName
            };

            let downloadOption = "";
            let fileType = "pdf";
            /**
             * Handles if functionality
             */
            if (this.isAttachment) {
                /**
                 * Handles if functionality
                 */
                if (this.invoiceType?.length > 0) {
                    downloadOption = "ALL";
                } else {
                    downloadOption = "ATTACHMENT";
                    fileType = "base64";
                }
            } else {
                downloadOption = "VOUCHER";
            }

            this.commonService.downloadFile(dataToSend, downloadOption, fileType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
                if (response?.status !== "error") {
                    /**
                     * Handles if functionality
                     */
                    if (dataToSend.copyTypes?.length > 1 || this.isAttachment) {
                        /**
                         * Handles if functionality
                         */
                        if (fileType === "base64") {
                            /**
                             * Saves as data
                             */
                            saveAs((this.generalService.base64ToBlob(response.body?.attachments[0]?.encodedData, '', 512)), response.body?.attachments[0]?.name);
                        } else {
                            /**
                             * Saves as data
                             */
                            saveAs(response, `${this.selectedVoucher?.voucherNumber}.` + 'zip');
                        }
                    } else {
                        /**
                         * Saves as data
                         */
                        saveAs(response, `${this.selectedVoucher?.voucherNumber}.` + 'pdf');
                    }
                } else {
                    this._toasty.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong);
                }
                this.changeDetection.detectChanges();
            }, (error => {
                this._toasty.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong);
                this.changeDetection.detectChanges();
            }));
        } else {
            this.downloadInvoiceEvent.emit(this.invoiceType);
        }
    }

    /**
     * Handle Tab Change event
     *
     * @param {*} selectedTabIndex
     * @memberof DownloadOrSendInvoiceOnMailComponent
     */
    public tabChanged(selectedTabIndex: any): void {
        this.selectedTabIndex = selectedTabIndex;
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
