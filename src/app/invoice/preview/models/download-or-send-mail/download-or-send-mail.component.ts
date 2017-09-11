import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';

@Component({
  selector: 'download-or-send-mail-invoice',
  templateUrl: './download-or-send-mail.component.html'
})

export class DownloadOrSendInvoiceOnMailComponent {

  @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
  @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
  @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();

  public showEmailTextarea: boolean = false;
  public onConfirmation(amount) {
    this.closeModelEvent.emit(amount);
  }

  public onCancel() {
    this.closeModelEvent.emit(0);
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
  public onSendInvoiceOnMail(email) {
    this.downloadOrSendMailEvent.emit({ action: 'send_mail', emails: [email] });
    this.showEmailTextarea = false;
  }
}
