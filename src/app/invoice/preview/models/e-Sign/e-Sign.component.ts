import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult, PreviewInvoiceResponseClass, Esignature } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../../services/actions/invoice/invoice.actions';
import * as _ from 'lodash';

@Component({
  selector: 'e-sign-modal-component',
  templateUrl: './e-Sign.component.html'
})

export class EsignModalComponent implements OnInit {
  @Input() public base64Data: string;
  // @Output() public eSignModalEvent: EventEmitter<object> = new EventEmitter();
  @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public showEmailTextarea: boolean = false;
  public aadhaarNum: string;
  public eSignModel: Esignature = new Esignature();
  public referenceNum: string;
  public authToken: string = '3Ru6iWp1qoWpjkz90fvRzheO8M0KpLxP0TEEk08jKfXL/4NdJUisPtWFw7A0gIja';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _toasty: ToasterService, private sanitizer: DomSanitizer,
    private store: Store<AppState>, private invoiceActions: InvoiceActions,
  ) {
    this.referenceNum = this.generateReferenceNumber();
  }

  public ngOnInit() {
    this.store.select(p => p.invoice.invoiceData).takeUntil(this.destroyed$).subscribe((o: PreviewInvoiceResponseClass) => {
      if (o && o.dataPreview) {
        this.base64Data = o.dataPreview;

      }
    });
  }

  public onConfirmation(eSignForm) {
    // console.log(this.aadharNum);
    let validateAdadhar = new RegExp(/^\d{4}\d{4}\d{4}$/g);
    if (this.aadhaarNum) {
      let isValidate = validateAdadhar.test(this.aadhaarNum);
      if (isValidate) {
        eSignForm.submit();
        this.closeModelEvent.emit(true);
      } else {
        this._toasty.errorToast('Invalid Aadhar No:' + this.aadhaarNum);
        return false;
      }
    } else {
      eSignForm.submit();
      this.closeModelEvent.emit(true);
    }

    // this.store.dispatch(this.invoiceActions.Esignature(dataToSave));
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
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
