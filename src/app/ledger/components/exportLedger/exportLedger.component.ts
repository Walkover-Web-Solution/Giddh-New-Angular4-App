import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest, MailLedgerRequest } from '../../../models/api-models/Ledger';
import { base64ToBlob, validateEmail } from '../../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'export-ledger',
  templateUrl: './exportLedger.component.html'
})
export class ExportLedgerComponent implements OnInit {
  @Input() public accountUniqueName: string = '';
  @Input() public from: string = '';
  @Input() public to: string = '';
  @Output() public closeExportLedgerModal: EventEmitter<boolean> = new EventEmitter();
  public emailType: string = 'admin-detailed';
  public emailData: string = '';
  constructor(private _ledgerService: LedgerService, private _toaster: ToasterService) {
    //
  }

  public ngOnInit() {
    //
  }

  public exportLedger() {
    let exportRequest = new ExportLedgerRequest();
    exportRequest.from = this.from;
    exportRequest.to = this.to;
    exportRequest.type = this.emailType;
    this._ledgerService.ExportLedger(exportRequest, this.accountUniqueName).subscribe(a => {
      let blob = base64ToBlob(a.body, 'application/vnd.ms-excel', 512);
      return saveAs(blob, `${this.accountUniqueName}.xls`);
    });
  }

  public sendLedgEmail() {
    this._toaster.clearAllToaster();
    let data = this.emailData;
    const sendData = new MailLedgerRequest();
    data = data.replace(RegExp(' ', 'g'), '');
    const cdata = data.split(',');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < cdata.length; i++) {
      if (validateEmail(cdata[i])) {
        sendData.recipients.push(cdata[i]);
      } else {
        // this._toaster.clearAllToaster();
        this._toaster.warningToast('Enter valid Email ID', 'Warning');
        data = '';
        sendData.recipients = [];
        break;
      }
    }

    if (sendData.recipients.length > 0) {
      this._ledgerService.MailLedger(sendData, this.accountUniqueName, this.from, this.to, this.emailType).subscribe(sent => {
        if (sent.status === 'success') {
          this._toaster.successToast(sent.body, sent.status);
          this.emailData = '';
        } else {
          this._toaster.errorToast(sent.message, sent.status);
        }
      });
    }
  }
}
