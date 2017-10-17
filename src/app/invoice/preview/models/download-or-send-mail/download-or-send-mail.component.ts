import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
// import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult, PreviewInvoiceResponseClass } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';

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
  @ViewChild('eSignModal') public eSignModal: ModalDirective;

  public showEmailTextarea: boolean = false;
  public base64StringForModel: any;
  public showPdfWrap: boolean = false;

  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true,
    class: 'bs-modal-parent'
  };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _toasty: ToasterService, private sanitizer: DomSanitizer,
    private store: Store<AppState>,
  ) { }

  public ngOnInit() {
    this.store.select(p => p.invoice.invoiceData).takeUntil(this.destroyed$).subscribe((o: PreviewInvoiceResponseClass) => {
      if (o && o.dataPreview) {
        this.base64Data = o.dataPreview;
        this.showPdfWrap = true;
        let str = 'data:application/pdf;base64,' + o.dataPreview;
        this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
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
      this.downloadOrSendMailEvent.emit({ action: 'send_mail', emails: emailList });
      this.showEmailTextarea = false;
    } else {
      this._toasty.errorToast('Invalid email(s).');
    }
  }

  /**
   * openSignModal
   */
  public openSignModal() {
    console.log('openSignModal');
    this.eSignModal.show();
  }

  public closeEsignModal() {
    this.eSignModal.hide();
    console.log('Close Esign modal');
  }
  // public closeConfirmationPopup() {
  //   this.eSignModal.hide();
  // }
}
