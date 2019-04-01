import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { InvoicePreviewComponent } from '../../../invoice/preview/invoice.preview.component';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GenerateEwayBill, IEwayBilldropDownValues } from 'app/models/api-models/Invoice';
import { IOption } from 'app/theme/ng-select/ng-select';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { InvoiceService } from 'app/services/invoice.service';

@Component({
  selector: 'app-e-way-bill-create',
  templateUrl: './eWayBill.create.component.html',
  styleUrls: ['./eWayBill.create.component.scss']
})
export class EWayBillCreateComponent implements OnInit {
  @ViewChild('eWayBillCredentials') public eWayBillCredentials: ModalDirective;
  public selectedInvoiceNo: string[] = [];
  public generateEwayBillform: GenerateEwayBill = new GenerateEwayBill();
  public supplyTypeList: IOption[] = [{value: 'O', label: 'supply type 1'},
    {value: 'I', label: 'supply type 2'}];
  public supplyType: any = [{
  }];

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
 public SubsupplyTypesList: IEwayBilldropDownValues[] = [
    {value: 0, name: 'Supply'},
    {value: 1, name: 'Export'},
    {value: 2, name: 'SKD/CKD'},
    {value: 3, name: 'Others'}
];
  constructor(private store: Store<AppState>,  private invoiceActions: InvoiceActions, private _invoiceService: InvoiceService) {
    //
  }

  public toggleEwayBillCredentialsPopup() {
    this.eWayBillCredentials.toggle();
  }

  public ngOnInit() {
    //
    // this.selectedInvoiceNo = this.invoicePreviewcomponent.selectedInvoiceNo;
     console.log(this._invoiceService.getSelectedInvoicesList);
  }
  public onSubmitEwaybill(generateBillform: NgForm) {
    console.log(generateBillform.value);  // { first: '', last: '' }
   console.log('submit list ', this._invoiceService.getSelectedInvoicesList);
    // this.store.dispatch(this.invoiceActions.GenerateNewEwaybill(generateBillform.value));
  }
}
