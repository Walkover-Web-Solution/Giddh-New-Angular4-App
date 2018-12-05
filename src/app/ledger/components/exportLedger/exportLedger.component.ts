import { GIDDH_DATE_FORMAT } from './../../../shared/helpers/defaultDateFormat';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { ExportLedgerRequest, MailLedgerRequest } from '../../../models/api-models/Ledger';
import { base64ToBlob, validateEmail } from '../../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionDataService } from 'app/permissions/permission-data.service';
import { some } from '../../../lodash-optimized';
import * as moment from 'moment/moment';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'export-ledger',
  templateUrl: './exportLedger.component.html'
})
export class ExportLedgerComponent implements OnInit {
  @Input() public accountUniqueName: string = '';
  // @Input() public from: string = '';
  // @Input() public to: string = '';
  @Input() public advanceSearchRequest: any;
  @Output() public closeExportLedgerModal: EventEmitter<boolean> = new EventEmitter();
  public emailTypeSelected: string = '';
  public exportAs: string = 'excel';
  public order: string = 'asc';
  public emailTypeMini: string = '';
  public emailTypeDetail: string;
  public emailData: string = '';
  public withInvoiceNumber: boolean = false;
  public universalDate$: Observable<any>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _ledgerService: LedgerService, private _toaster: ToasterService, private _permissionDataService: PermissionDataService, private store: Store<AppState>) {
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
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
    let exportByInvoiceNumber: boolean = this.emailTypeSelected === 'admin-condensed' ? false : this.withInvoiceNumber;
    let exportRequest = new ExportLedgerRequest();
    exportRequest.format = this.exportAs;
    exportRequest.sort = this.order;
    exportRequest.type = this.emailTypeSelected;
    const body = _.cloneDeep(this.advanceSearchRequest);
    if (!body.dataToSend.bsRangeValue) {
      this.universalDate$.subscribe(a => {
        if (a) {
          body.dataToSend.bsRangeValue = [moment(a[0], 'DD-MM-YYYY').toDate(), moment(a[1], 'DD-MM-YYYY').toDate()];
        }
      });
    }
    exportRequest.from = moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
    exportRequest.to = moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);
    delete body.dataToSend;
    this._ledgerService.ExportLedger(exportRequest, this.accountUniqueName, body, exportByInvoiceNumber).subscribe(a => {
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
      const body = _.cloneDeep(this.advanceSearchRequest);
      if (!body.dataToSend.bsRangeValue) {
        this.universalDate$.subscribe(a => {
          if (a) {
            body.dataToSend.bsRangeValue = [moment(a[0], 'DD-MM-YYYY').toDate(), moment(a[1], 'DD-MM-YYYY').toDate()];
          }
        });
      }
      let from = moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
      let to = moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(body.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);
      this._ledgerService.MailLedger(sendData, this.accountUniqueName, from, to, this.emailTypeSelected).subscribe(sent => {
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
