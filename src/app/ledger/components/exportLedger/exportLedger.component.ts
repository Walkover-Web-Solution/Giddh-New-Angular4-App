import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest, MailLedgerRequest } from '../../../models/api-models/Ledger';
import { base64ToBlob, validateEmail } from '../../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionDataService } from 'app/permissions/permission-data.service';
import { some } from '../../../lodash-optimized';

@Component({
  selector: 'export-ledger',
  templateUrl: './exportLedger.component.html'
})
export class ExportLedgerComponent implements OnInit {
  @Input() public accountUniqueName: string = '';
  @Input() public from: string = '';
  @Input() public to: string = '';
  @Input() public advanceSearchRequest: any;
  @Output() public closeExportLedgerModal: EventEmitter<boolean> = new EventEmitter();
  public emailTypeSelected: string = '';
  public exportAs: string = 'excel';
  public order: string = 'asc';
  public emailTypeMini: string = '';
  public emailTypeDetail: string;
  public emailData: string = '';
  constructor(private _ledgerService: LedgerService, private _toaster: ToasterService, private _permissionDataService: PermissionDataService) {
    //
  }

  public ngOnInit() {
    this._permissionDataService.getData.forEach(f => {
      if (f.name === 'LEDGER') {
        let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
        this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
        this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
        this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
      }
    });
  }

  public exportLedger() {
    let exportRequest = new ExportLedgerRequest();
    exportRequest.from = this.from;
    exportRequest.to = this.to;
    exportRequest.format =  this.exportAs;
    exportRequest.sort = this.order;
    exportRequest.type = this.emailTypeSelected;
    const body = _.cloneDeep(this.advanceSearchRequest);
    this._ledgerService.ExportLedger(exportRequest, this.accountUniqueName, body).subscribe(a => {
      if (a.status === 'success') {
        if (a.queryString.fileType === 'excel') {
          let blob = base64ToBlob(a.body, 'application/vnd.ms-excel', 512);
          return saveAs(blob, `${this.accountUniqueName}.xls`);
        } else if (a.queryString.fileType === 'pdf') {
          let blob = base64ToBlob(a.body, 'application/pdf', 512);
          return saveAs(blob, `${this.accountUniqueName}.pdf`);
        }
      } else {
        this._toaster.errorToast(a.message, a.code);
      }
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
      this._ledgerService.MailLedger(sendData, this.accountUniqueName, this.from, this.to, this.emailTypeSelected).subscribe(sent => {
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
