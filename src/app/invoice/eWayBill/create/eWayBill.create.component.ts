import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { InvoicePreviewComponent } from '../../../invoice/preview/invoice.preview.component';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GenerateEwayBill, IEwayBilldropDownValues, SelectedInvoices } from 'app/models/api-models/Invoice';
import { IOption } from 'app/theme/ng-select/ng-select';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { InvoiceService } from 'app/services/invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-way-bill-create',
  templateUrl: './eWayBill.create.component.html',
  styleUrls: ['./eWayBill.create.component.scss']
})
export class EWayBillCreateComponent implements OnInit {
  @ViewChild('eWayBillCredentials') public eWayBillCredentials: ModalDirective;
  public invoiceNumber: string = '';
  public selectedInvoiceNo: string[] = [];
  public generateBill: any[] = [];
  public generateEwayBillform: GenerateEwayBill = new GenerateEwayBill();
  public selectedInvoices: any[] = [];
  public supplyType: any = [{
  }];

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
 public SubsupplyTypesList: IOption[] = [
    {value: '0', label: 'Supply'},
    {value: '1', label: 'Export'},
    {value: '2', label: 'SKD/CKD'},
    {value: '3', label: 'Others'}
];
// "INV", "CHL", "BIL","BOE","CNT","OTH"
 public SupplyTypesList: IOption[] = [
    {value: 'O', label: 'SupplyType1'},
    {value: 'I', label: 'SupplyType2'},
];
public TransporterDocType: IOption[] = [
    {value: 'INV', label: 'Invoice'},
    {value: 'CHL', label: 'Challan'},
     {value: 'BIL', label: 'Bill'},
    {value: 'BOE', label: 'Doc Type BOE'},
     {value: 'CNT', label: 'Doc Type CNT'},
    {value: 'OTH', label: 'Other'},
];
  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private _invoiceService: InvoiceService, private router: Router) {
    //
  }

  public toggleEwayBillCredentialsPopup() {
    this.eWayBillCredentials.toggle();
  }

  public ngOnInit() {
    // this.selectedInvoiceNo = this.invoicePreviewcomponent.selectedInvoiceNo;
    this.selectedInvoices = this._invoiceService.getSelectedInvoicesList;
      this.invoiceNumber = this.selectedInvoices.length ? this.selectedInvoices[0].voucherNumber : '';
       if (this.selectedInvoices.length === 0) {
         this.router.navigate(['/invoice/preview/sales']);
      }
       }

  public onSubmitEwaybill(generateBillform: NgForm) {
      this.generateBill = generateBillform.value;
      this.generateBill['invoiceNumber'] =  this.invoiceNumber;
      console.log('this.generateBill', this.generateBill);
        if (generateBillform.valid) {
        this.store.dispatch(this.invoiceActions.GenerateNewEwaybill(generateBillform.value));
        }
    }

public removeInvoice(invoice: any[]) {
    let idx = this.selectedInvoices.indexOf(invoice);
      this.selectedInvoices.splice(idx, 1);
      if (this.selectedInvoices.length === 0) {
         this.router.navigate(['/invoice/preview/sales']);
      }
}
}
