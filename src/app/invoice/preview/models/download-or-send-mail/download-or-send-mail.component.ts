import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult, PreviewInvoiceResponseClass } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../../../lodash-optimized';
import { Observable } from 'rxjs/Observable';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';

@Component({
  selector: 'download-or-send-mail-invoice',
  templateUrl: './download-or-send-mail.component.html',
  styles: [`
    .dropdown-menu{
      width: 400px;
    }
    .dropdown-menu .form-group{
      padding: 20px;
      margin-bottom: 0
    }
    .dropdown-menu.open{
      display: block
    }
  `]
})

export class DownloadOrSendInvoiceOnMailComponent implements OnInit {

  @Input() public base64Data: string;
  @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
  @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
  @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();
  @Output() public downloadInvoiceEvent: EventEmitter<object> = new EventEmitter();

  public showEmailTextarea: boolean = false;
  public base64StringForModel: any;
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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _toasty: ToasterService, private sanitizer: DomSanitizer,
    private store: Store<AppState>, private _invoiceActions: InvoiceActions
  ) {
    this.isErrOccured$ = this.store.select(p => p.invoice.invoiceDataHasError).takeUntil(this.destroyed$).distinctUntilChanged();
  }

  public ngOnInit() {
    this.store.select(p => p.invoice.invoiceData).takeUntil(this.destroyed$).subscribe((o: PreviewInvoiceResponseClass) => {
      if (o && o.dataPreview) {
        this.showEditButton = o.uniqueName ? true : false;
        this.base64Data = o.dataPreview;
        this.showPdfWrap = true;
        let str = 'data:application/pdf;base64,' + o.dataPreview;
        this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
      }else {
        this.showPdfWrap = false;
      }
    });
    this.store.select(p => p.invoice.settings).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o && o.invoiceSettings) {
        this.isSendSmsEnabled = o.invoiceSettings.sendInvLinkOnSms;
      } else {
        this.store.dispatch(this._invoiceActions.getInvoiceSetting());
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

  /**
   * downloadInvoice
   */
  public downloadInvoice() {
    this.downloadInvoiceEvent.emit(this.invoiceType);
  }

}
