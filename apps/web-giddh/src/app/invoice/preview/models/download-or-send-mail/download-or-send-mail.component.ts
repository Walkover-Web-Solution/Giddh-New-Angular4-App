import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable, of, ReplaySubject } from 'rxjs';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { Router } from '@angular/router';
import { findIndex, isEmpty } from 'apps/web-giddh/src/app/lodash-optimized';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { VoucherTypeEnum } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'download-or-send-mail-invoice',
    templateUrl: './download-or-send-mail.component.html',
    styleUrls: ['./download-or-send-mail.component.scss']
})

export class DownloadOrSendInvoiceOnMailComponent implements OnInit, OnDestroy {
    /** Selected voucher details */
    @Input() public selectedVoucher: any;
    @Input() public base64Data: any;
    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
    @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();
    @Output() public downloadInvoiceEvent: EventEmitter<object> = new EventEmitter();
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;

    public showEmailTextarea: boolean = false;
    public showPdfWrap: boolean = false;
    public showEsign: boolean = false;
    public showEditButton: boolean = false;
    public isErrOccured$: Observable<boolean>;
    public invoiceType: string[] = [];
    public showMore: boolean = false;
    public emailTabActive: boolean = true;
    public downloadTabActive: boolean = false;
    public smsTabActive: boolean = false;
    public isSendSmsEnabled: boolean = false;
    public isElectron = isElectron;
    public voucherRequest = null;
    public voucherDetailsInProcess$: Observable<boolean> = of(true);
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
    /** this will store screen size */
    public isMobileScreen : boolean = false;
    /** Stores the current voucher filter applied */
    public currentVoucherFilter: string;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Holds voucher unique name */
    public selectedVoucherUniqueName: string = "";
    /** Voucher has attachments */
    public voucherHasAttachments: boolean = false;
    /** True if attachment is checked */
    public isAttachment: boolean = false;

    constructor(
        private _toasty: ToasterService,
        private sanitizer: DomSanitizer,
        private store: Store<AppState>,
        private _invoiceActions: InvoiceActions,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private _router: Router,
        private breakpointObserver: BreakpointObserver,
        private generalService: GeneralService,
        private commonService: CommonService
    ) {
        this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
            this.isMobileScreen = state.matches;
        });

        this.isErrOccured$ = this.store.pipe(select(p => p.invoice.invoiceDataHasError), distinctUntilChanged(), takeUntil(this.destroyed$));
        this.voucherDetailsInProcess$ = this.store.pipe(select(p => p.receipt.voucherDetailsInProcess), takeUntil(this.destroyed$));
        this.voucherPreview$ = this.store.pipe(select(p => p.receipt.base64Data), distinctUntilChanged(), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.selectedVoucherType = this.selectedVoucher?.voucherType;
        this.accountUniqueName = this.selectedVoucher?.accountUniqueName || this.selectedVoucher.account?.uniqueName;
        
        if(this.voucherApiVersion === 2 && ![VoucherTypeEnum.generateEstimate, VoucherTypeEnum.generateProforma].includes(this.selectedVoucher?.voucherType)) {
            this.invoiceType.push('Original');

            let getRequest = {
                voucherType: this.selectedVoucher?.voucherType,
                uniqueName: this.selectedVoucher?.uniqueName
            };

            this.sanitizedPdfFileUrl = null;
            this.voucherHasAttachments = false;
            this.commonService.downloadFile(getRequest, "VOUCHER").pipe(takeUntil(this.destroyed$)).subscribe(result => {
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
                        invoiceNumber:this.selectedVoucher.voucherNumber,
                        voucherType: this.selectedVoucher?.voucherType,
                        uniqueName: this.selectedVoucher?.uniqueName
                    }));

                    this.showPdfWrap = true;
                    this.showEditButton = true;

                    if(result.body.attachments?.length > 0) {
                        this.voucherHasAttachments = true;
                    }
                }
            });
        } else {
            this.voucherPreview$.subscribe((o: any) => {
                if (o) {
                    const reader = new FileReader();

                    reader.addEventListener('loadend', (e: any) => {
                        const blob = this.generalService.base64ToBlob(e.srcElement.result.split(',')[1], 'application/pdf', 512);
                        const file = new Blob([blob], { type: 'application/pdf' });
                        URL.revokeObjectURL(this.pdfFileURL);
                        this.pdfFileURL = URL.createObjectURL(file);
                        this.sanitizedPdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                    });

                    reader.readAsDataURL(o);
                    this.selectedInvoiceNo = o.request.voucherNumber?.join();
                    this.selectedVoucherType = o.request.voucherType;
                    this.selectedVoucherUniqueName = o.request?.uniqueName;

                    this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(o.request.accountUniqueName, {
                        invoiceNumber: o.request.voucherNumber?.join(),
                        voucherType: o.request?.voucherType,
                        uniqueName: (this.voucherApiVersion === 2) ? o.request?.uniqueName : undefined
                    }));

                    this.showPdfWrap = true;
                    this.showEditButton = true;
                } else {
                    this.showPdfWrap = false;
                    this.showEditButton = false;
                }
            });
        }

        this.store.pipe(select(p => p.invoice.settings), takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o && o.invoiceSettings) {
                this.isSendSmsEnabled = o.invoiceSettings.sendInvLinkOnSms;
            } else {
                this.store.dispatch(this._invoiceActions.getInvoiceSetting());
            }
        });

        this.store.pipe(select(p => p.receipt.voucher), takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o) {
                this.accountUniqueName = o.account?.uniqueName;
                if(o.templateDetails?.templateUniqueName) {
                    this.store.dispatch(this._invoiceActions.GetTemplateDetailsOfInvoice(o.templateDetails?.templateUniqueName));
                }
            }
        });
    }

    public onConfirmation(amount) {
        this.closeModelEvent.emit(amount);
    }

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
        if (isEmpty(email)) {
            this._toasty.warningToast(this.localeData?.enter_valid_email_error);
            return;
        }
        let emailList = email.split(',');
        if (Array.isArray(emailList)) {
            this.downloadOrSendMailEvent.emit({ action: 'send_mail', emails: emailList, typeOfInvoice: this.invoiceType });
            this.showEmailTextarea = false;
        } else {
            this._toasty.errorToast(this.localeData?.invalid_emails);
        }
    }

    /**
     * onSendInvoiceOnSms
     */
    public onSendInvoiceOnSms(numbers: string) {
        if (isEmpty(numbers)) {
            this._toasty.warningToast(this.localeData?.enter_valid_number_error);
            return;
        }
        let numberList = numbers.split(',');
        if (Array.isArray(numberList)) {
            this.downloadOrSendMailEvent.emit({ action: 'send_sms', numbers: numberList });
            this.showEmailTextarea = false;
        }
    }

    /**
     * onSelectInvoiceCopy
     */
    public onSelectInvoiceCopy(event) {
        let val = event.target?.value;
        if (event.target?.checked) {
            this.invoiceType.push(val);
        } else {
            let idx = findIndex(this.invoiceType, (o) => o === val);
            return this.invoiceType.splice(idx, 1);
        }
    }

    public editVoucher() {
        if (this.voucherApiVersion === 2) {
            this._router.navigate(['/pages/vouchers/' + this.selectedVoucherType?.toString()?.replace(/-/g, " ") + '/' + this.accountUniqueName + '/' + this.selectedVoucherUniqueName + '/edit'], { queryParams: { redirect: this._router.url } } );
        } else {
            this._router.navigate(['/pages/proforma-invoice/invoice', this.selectedVoucherType, this.accountUniqueName, this.selectedInvoiceNo], { queryParams:  { uniqueName: this.selectedVoucherUniqueName } } );
        }
    }

    /**
     * downloadInvoice
     */
    public downloadInvoice() {
        if(this.voucherApiVersion === 2) {
            let dataToSend = {
                copyTypes: this.invoiceType,
                voucherType: this.selectedVoucher?.voucherType,
                uniqueName: this.selectedVoucher?.uniqueName
            };

            let downloadOption = "";
            let fileType = "pdf";
            if (this.isAttachment) {
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
                if (response?.status !== "error") {
                    if (dataToSend.copyTypes?.length > 1 || this.isAttachment) {
                        if (fileType === "base64") {
                            saveAs((this.generalService.base64ToBlob(response.body?.attachments[0]?.encodedData, '', 512)), response.body?.attachments[0]?.name);
                        } else {
                            saveAs(response, `${this.selectedVoucher?.voucherNumber}.` + 'zip');
                        }
                    } else {
                        saveAs(response, `${this.selectedVoucher?.voucherNumber}.` + 'pdf');
                    }
                } else {
                    this._toasty.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this._toasty.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }));
        } else {
            this.downloadInvoiceEvent.emit(this.invoiceType);
        }
    }

    public ngOnDestroy() {
        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
