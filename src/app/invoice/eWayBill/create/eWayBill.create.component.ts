import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-e-way-bill-create',
  templateUrl: './eWayBill.create.component.html',
  styleUrls: ['./eWayBill.create.component.scss']
})
export class EWayBillCreateComponent implements OnInit, OnDestroy {
  @ViewChild('eWayBillCredentials') public eWayBillCredentials: ModalDirective;
  @ViewChild('generateInvForm') public generateEwayBillForm: NgForm;
  public invoiceNumber: string = '';
  public selectedInvoiceNo: string[] = [];
  public generateBill: any[] = [];
  public isEwaybillGenerateInProcess$: Observable<boolean>;
  public isEwaybillGeneratedSuccessfully$: Observable<boolean>;
   public isLoggedInUserEwayBill$: Observable<boolean>;
   public newLoginUser: boolean = false;
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
    {value: '1', label: 'Supply'},
    {value: '2', label: 'Import'},
    {value: '3', label: 'Export'},
    {value: '4', label: 'Job Work'},
    {value: '5', label: 'For Own Use'},
    {value: '6', label: 'Job work Returns'},
    {value: '7', label: 'Sales Return'},
    {value: '8', label: 'Others'},
    {value: '9', label: 'SKD/CKD'},
    {value: '10', label: 'Line Sales'},
    {value: '11', label: 'Recipient  Not Known'},
    {value: '12', label: 'Exhibition or Fairs'}
];
// "INV", "CHL", "BIL","BOE","CNT","OTH"
 public SupplyTypesList: IOption[] = [
    {value: 'O', label: 'Inward'},
    {value: 'I', label: 'Outward'},
];
public TransporterDocType: IOption[] = [
    {value: 'INV', label: 'Invoice'},
    {value: 'CHL', label: 'Delivery Challan'},
     {value: 'BIL', label: 'Bill of Supply'},
    {value: 'BOE', label: 'Bill of Entry'},
     {value: 'CNT', label: 'Credit Note'},
    {value: 'OTH', label: 'Others'},
];
public transactionType: IOption[] = [
    {value: '1', label: 'Regular'},
    {value: '2', label: 'Credit Notes'},
     {value: '3', label: 'Delivery challan'}
];
 private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private _invoiceService: InvoiceService, private router: Router) {
    this.isEwaybillGenerateInProcess$ = this.store.select(p => p.ewaybillstate.isGenerateEwaybillInProcess).pipe(takeUntil(this.destroyed$));
    this.isEwaybillGeneratedSuccessfully$ = this.store.select(p => p.ewaybillstate.isGenerateEwaybilSuccess).pipe(takeUntil(this.destroyed$));
    this.isLoggedInUserEwayBill$ = this.store.select(p => p.ewaybillstate.isUserLoggedInEwaybillSuccess).pipe(takeUntil(this.destroyed$));
  }

  public toggleEwayBillCredentialsPopup() {
    this.eWayBillCredentials.toggle();
  }

  public ngOnInit() {
// this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess).pipe(takeUntil(this.destroyed$));

//  this.isLoggedInUserEwayBill$.subscribe(p => {
//    console.log(`isLoggedInUserEwayBill in create ${p}`);
//          this.newLoginUser = p;
//     });
    if (!this.newLoginUser) {
      this.toggleEwayBillCredentialsPopup();
     }

    this.selectedInvoices = this._invoiceService.getSelectedInvoicesList;
      this.invoiceNumber = this.selectedInvoices.length ? this.selectedInvoices[0].voucherNumber : '';
       if (this.selectedInvoices.length === 0) {
         this.router.navigate(['/invoice/preview/sales']);
      }
      this.isEwaybillGeneratedSuccessfully$.subscribe( s => {
        if (s) {
       console.log('isEwaybillGeneratedSuccessfully', s);
         this.generateEwayBillForm.reset();
        // this.router.navigate(['/pages/invoice/ewaybill']);
        }
      });
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
public onCancelGenerateBill() {
 this.router.navigate(['/invoice/preview/sales']);
}
public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
