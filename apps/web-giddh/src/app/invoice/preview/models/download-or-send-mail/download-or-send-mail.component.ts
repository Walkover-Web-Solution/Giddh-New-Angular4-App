import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable, of, ReplaySubject } from 'rxjs';
import * as _ from '../../../../lodash-optimized';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { ReceiptVoucherDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { Router } from '@angular/router';

@Component({
    selector: 'download-or-send-mail-invoice',
    templateUrl: './download-or-send-mail.component.html',
    styles: [`
    .dropdown-menu {
      width: 400px;
    }

    .dropdown-menu .form-group {
      padding: 20px;
      margin-bottom: 0
    }

    .dropdown-menu.open {
      display: block
    }
  `]
})

export class DownloadOrSendInvoiceOnMailComponent implements OnInit, OnDestroy {

    @Input() public base64Data: string;
    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
    @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();
    @Output() public downloadInvoiceEvent: EventEmitter<object> = new EventEmitter();
    @ViewChild('pdfViewer') public pdfViewer;

    public showEmailTextarea: boolean = false;
    public base64StringForModel: any;
    public unSafeBase64StringForModel: any;
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
    public isCordova = isCordova;
    public voucherRequest = null;
    public voucherDetailsInProcess$: Observable<boolean> = of(true);
    public accountUniqueName: string = '';
    public selectedInvoiceNo: string = '';
    public selectedVoucherType: string = null;

    public voucherPreview$: Observable<any> = of(null);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _toasty: ToasterService, private sanitizer: DomSanitizer,
        private store: Store<AppState>, private _invoiceActions: InvoiceActions,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private _router: Router
    ) {
        this.isErrOccured$ = this.store.select(p => p.invoice.invoiceDataHasError).pipe(takeUntil(this.destroyed$), distinctUntilChanged());
        this.voucherDetailsInProcess$ = this.store.select(p => p.receipt.voucherDetailsInProcess).pipe(takeUntil(this.destroyed$));
        this.voucherPreview$ = this.store.select(p => p.receipt.base64Data).pipe(takeUntil(this.destroyed$));

        this.voucherPreview$.pipe(distinctUntilChanged()).subscribe((o: any) => {
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
                    this.unSafeBase64StringForModel = _.clone(str);

                    this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
                    this.base64Data = this.base64StringForModel;
                    const blob = b64toBlob(e.srcElement.result.split(',')[1], 'application/pdf');
                    if (this.isElectron) {
                        this.pdfViewer.pdfSrc = blob; // pdfSrc can be Blob or Uint8Array
                        this.pdfViewer.refresh();
                    }
                    else if (this.isCordova) {
                        // todo: show PDF
                    }
                    //   this.pdfViewer.pdfSrc =  new Blob([ e.srcElement.result], { type: "application/pdf" }); // pdfSrc can be Blob or Uint8Array
                    //  this.pdfViewer.refresh();

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

    }

    public ngOnInit() {

        this.store.select(p => p.invoice.settings).pipe(takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o && o.invoiceSettings) {
                this.isSendSmsEnabled = o.invoiceSettings.sendInvLinkOnSms;
            } else {
                this.store.dispatch(this._invoiceActions.getInvoiceSetting());
            }
        });

        this.store.select(p => p.receipt.voucher).pipe(takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o && o.voucherDetails) {
                // this.showEditButton = o.voucherDetails.uniqueName ? true : false;
                this.accountUniqueName = o.accountDetails.uniqueName;
                this.store.dispatch(this._invoiceActions.GetTemplateDetailsOfInvoice(o.templateDetails.templateUniqueName));
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
        if (_.isEmpty(email)) {
            this._toasty.warningToast('Enter some valid email Id\'s');
            return;
        }
        let emailList = email.split(',');
        if (Array.isArray(emailList)) {
            this.downloadOrSendMailEvent.emit({ action: 'send_mail', emails: emailList, typeOfInvoice: this.invoiceType });
            this.showEmailTextarea = false;
        } else {
            this._toasty.errorToast('Invalid email(s).');
        }
    }

    /**
     * onSendInvoiceOnSms
     */
    public onSendInvoiceOnSms(numbers: string) {
        if (_.isEmpty(numbers)) {
            this._toasty.warningToast('Enter some valid number\'s');
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
            let idx = _.findIndex(this.invoiceType, (o) => o === val);
            return this.invoiceType.splice(idx, 1);
        }
    }

    public goToedit(type: string) {
        this._router.navigate(['/pages', 'proforma-invoice', this.selectedVoucherType, this.accountUniqueName, this.selectedInvoiceNo]);

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
