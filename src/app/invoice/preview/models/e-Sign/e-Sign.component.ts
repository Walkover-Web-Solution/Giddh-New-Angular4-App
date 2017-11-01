import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Esignature, PreviewInvoiceResponseClass } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../../services/actions/invoice/invoice.actions';

@Component({
  selector: 'e-sign-modal-component',
  templateUrl: './e-Sign.component.html'
})

export class EsignModalComponent implements OnInit {
  @Input() public base64Data: string;
  @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public eSignModel: Esignature = new Esignature();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _toasty: ToasterService, private sanitizer: DomSanitizer,
    private store: Store<AppState>, private invoiceActions: InvoiceActions,
  ) {
    this.eSignModel.authToken = '3Ru6iWp1qoWpjkz90fvRzheO8M0KpLxP0TEEk08jKfXL/4NdJUisPtWFw7A0gIja';
  }

  public ngOnInit() {
    this.store.select(p => p.invoice.invoiceData).takeUntil(this.destroyed$).subscribe((o: PreviewInvoiceResponseClass) => {
      if (o && o.dataPreview) {
        this.eSignModel.referenceNumber = o.uniqueName;
        this.eSignModel.companyName = o.company.name;
        this.eSignModel.file = o.dataPreview;
      }
    });
  }

  public onConfirmation(eSignForm) {
    // console.log(this.aadharNum);
    let validateAdadhar = new RegExp(/^\d{4}\d{4}\d{4}$/g);
    if (this.eSignModel.aadharNo) {
      let isValidate = validateAdadhar.test(this.eSignModel.aadharNo);
      if (isValidate) {
        eSignForm.submit();
        this.closeModelEvent.emit(true);
      } else {
        this._toasty.errorToast('Invalid Aadhar No:' + this.eSignModel.aadharNo);
        return false;
      }
    } else {
      eSignForm.submit();
      this.closeModelEvent.emit(true);
    }
  }

  /**
   * generateReferenceNumber
   */
  public generateReferenceNumber() {

    let text = '';
    let randomStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i <= 20; i++) {
      text += randomStr.charAt(Math.floor(Math.random() * randomStr.length));
    }
    return text;

  }

}
