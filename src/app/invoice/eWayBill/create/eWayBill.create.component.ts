import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { InvoicePreviewComponent } from '../../../invoice/preview/invoice.preview.component';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GenerateEwayBill, IEwayBilldropDownValues } from 'app/models/api-models/Invoice';
import { IOption } from 'app/theme/ng-select/ng-select';

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
  constructor(private store: Store<AppState>) {
    //
  }

  public toggleEwayBillCredentialsPopup() {
    this.eWayBillCredentials.toggle();
  }

  public ngOnInit() {
    //
    // this.selectedInvoiceNo = this.invoicePreviewcomponent.selectedInvoiceNo;
    // console.log(this.selectedInvoiceNo);
  }
  public onSubmitEwaybill(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
    //  this.store.dispatch(this.inventoryAction.createStock(stockObj, formObj.parentGroup));
  }
}
