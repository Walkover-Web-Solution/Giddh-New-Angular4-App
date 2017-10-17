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
  @Output() public eSignModalEvent: EventEmitter<object> = new EventEmitter();
  @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public showEmailTextarea: boolean = false;
  public base64StringForModel: any;
  public showPdfWrap: boolean = false;
  public aadharNum: number;
  public saveEsign: Esignature = new Esignature();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _toasty: ToasterService, private sanitizer: DomSanitizer,
    private store: Store<AppState>, private invoiceActions: InvoiceActions,
  ) { this.generateReferenceNumber(); }

  public ngOnInit() {
    this.store.select(p => p.invoice.invoiceData).takeUntil(this.destroyed$).subscribe((o: PreviewInvoiceResponseClass) => {
      if (o && o.dataPreview) {
        this.base64Data = o.dataPreview;
        this.showPdfWrap = true;
        let str = 'data:application/pdf;base64,' + o.dataPreview;
        this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
        console.log(this.base64Data);
      }
    });
  }

  public onConfirmation(eSignForm) {
    // this.closeModelEvent.emit(true);
    console.log(eSignForm);
    // let aadharNum = _.cloneDeep(eSignForm);
    // let dataToSave = _.cloneDeep(eSignForm);
    // eSignForm.file = this.base64Data;
    // dataToSave.aadharNo = aadharNum;
    // dataToSave.file = this.base64Data;
    // dataToSave.referenceNumber = this.generateReferenceNumber();
    console.log(eSignForm);
    eSignForm.submit();
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
