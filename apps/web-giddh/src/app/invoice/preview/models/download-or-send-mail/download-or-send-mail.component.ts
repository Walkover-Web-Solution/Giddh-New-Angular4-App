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
import { ReceiptVoucherDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { Router } from '@angular/router';
import { findIndex, isEmpty } from 'apps/web-giddh/src/app/lodash-optimized';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
    selector: 'download-or-send-mail-invoice',
    templateUrl: './download-or-send-mail.component.html',
    styleUrls: ['./download-or-send-mail.component.scss']
})

export class DownloadOrSendInvoiceOnMailComponent implements OnInit, OnDestroy {

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

    constructor(
        private _toasty: ToasterService,
        private sanitizer: DomSanitizer,
        private store: Store<AppState>,
        private _invoiceActions: InvoiceActions,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private _router: Router,
        private breakpointObserver: BreakpointObserver
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
        this.voucherPreview$.subscribe((o: any) => {
            if (o) {

                const reader = new FileReader();
                const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
                    const byteCharacters = atob(b64Data);
                    const byteArrays = [];

                    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        const slice = byteCharacters.slice(offset, offset + sliceSize);

                        const byteNumbers = new Array(slice.length);
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }

                    const blob = new Blob(byteArrays, { type: contentType });
                    return blob;
                }

                reader.addEventListener('loadend', (e: any) => {
                    let str = 'data:application/pdf;base64,' + e.srcElement.result.split(',')[1];
                    const blob = b64toBlob(e.srcElement.result.split(',')[1], 'application/pdf');
                    const file = new Blob([blob], { type: 'application/pdf' });
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                });

                reader.readAsDataURL(o);
                let request: ReceiptVoucherDetailsRequest = new ReceiptVoucherDetailsRequest();
                request.invoiceNumber = o.request.voucherNumber.join();
                request.voucherType = o.request.voucherType;
                this.selectedInvoiceNo = request.invoiceNumber;
                this.selectedVoucherType = request.voucherType;
                this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(o.request.accountUniqueName, request));
                this.showPdfWrap = true;
                this.showEditButton = true;
            } else {
                this.showPdfWrap = false;
                this.showEditButton = false;
            }
        });

        this.store.pipe(select(p => p.invoice.settings), takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o && o.invoiceSettings) {
                this.isSendSmsEnabled = o.invoiceSettings.sendInvLinkOnSms;
            } else {
                this.store.dispatch(this._invoiceActions.getInvoiceSetting());
            }
        });

        this.store.pipe(select(p => p.receipt.voucher), takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o && o.voucherDetails) {
                this.accountUniqueName = o.accountDetails.uniqueName;
                this.store.dispatch(this._invoiceActions.GetTemplateDetailsOfInvoice(o.templateDetails?.templateUniqueName));
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
        let val = event.target.value;
        if (event.target.checked) {
            this.invoiceType.push(val);
        } else {
            let idx = findIndex(this.invoiceType, (o) => o === val);
            return this.invoiceType.splice(idx, 1);
        }
    }

    public goToedit(type: string) {
        this._router.navigate(['/pages/proforma-invoice/invoice', this.selectedVoucherType, this.accountUniqueName, this.selectedInvoiceNo]);
    }

    /**
     * downloadInvoice
     */
    public downloadInvoice() {
        this.downloadInvoiceEvent.emit(this.invoiceType);
    }

    public ngOnDestroy() {
        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
