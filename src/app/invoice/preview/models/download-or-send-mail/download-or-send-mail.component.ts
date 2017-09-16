import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';

@Component({
  selector: 'download-or-send-mail-invoice',
  templateUrl: './download-or-send-mail.component.html'
})

export class DownloadOrSendInvoiceOnMailComponent {

  @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
  @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
  @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();

  public showEmailTextarea: boolean = false;

  constructor(private _toasty: ToasterService) {}

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
    let emailList = email.split(',');
    if (Array.isArray(emailList)) {
      this.downloadOrSendMailEvent.emit({ action: 'send_mail', emails: emailList });
      this.showEmailTextarea = false;
    } else {
      this._toasty.errorToast('Invalid email(s).');
    }
  }
}
