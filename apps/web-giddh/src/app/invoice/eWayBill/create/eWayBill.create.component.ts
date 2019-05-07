import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { InvoicePreviewComponent } from '../../../invoice/preview/invoice.preview.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { GenerateEwayBill, IEwayBilldropDownValues, SelectedInvoices, IEwayBillTransporter, IEwayBillAllList, Result, IAllTransporterDetails } from '../../../models/api-models/Invoice';
import { IOption } from '../../../theme/ng-select/ng-select';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from 'rxjs';
import * as moment from 'moment';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-e-way-bill-create',
  templateUrl: './eWayBill.create.component.html',
  styleUrls: [`./eWayBill.create.component.scss`]
})
export class EWayBillCreateComponent implements OnInit, OnDestroy {
  @ViewChild('eWayBillCredentials') public eWayBillCredentials: ModalDirective;
  @ViewChild('generateInvForm') public generateEwayBillForm: NgForm;
  @ViewChild('generateTransporterForm') public generateNewTransporterForm: NgForm;
  public invoiceNumber: string = '';
  public invoiceBillingGstinNo: string = '';
  public selectedInvoiceNo: string[] = [];
  public generateBill: any[] = [];
  public isEwaybillGenerateInProcess$: Observable<boolean>;
  public isEwaybillGeneratedSuccessfully$: Observable<boolean>;
  public isGenarateTransporterInProcess$: Observable<boolean>;
  public isGenarateTransporterSuccessfully$: Observable<boolean>;
  public updateTransporterInProcess$: Observable<boolean>;
  public updateTransporterSuccess$: Observable<boolean>;
  public isUserAddedSuccessfully$: Observable<boolean>;
  public isLoggedInUserEwayBill$: Observable<boolean>;
  public transporterDropdown$: any;
  public newLoginUser: boolean = false;
  public keydownClassAdded: boolean = false;
  public status: boolean = false;
  public transportEditMode: boolean = false;
  public transportEditObject: IEwayBillTransporter;
  public transporterList$: Observable<IEwayBillTransporter[]>;
  public transporterListDetails$: Observable<IAllTransporterDetails>;
  public currenTransporterId: string;
  public isUserlogedIn: boolean;

  public generateEwayBillform: GenerateEwayBill = {
    supplyType: null,
    subSupplyType: null,
    transMode: null,
    toPinCode: null,
    transDistance: null,
    invoiceNumber: null,
    transporterName: null,
    transporterId: null,
    transDocNo: null,
    transDocDate: null,

    vehicleNo: null,
    vehicleType: null,
    transactionType: null,
    docType: null,
    toGstIn: null,
  };
  public generateNewTransporter: IEwayBillTransporter = {
    transporterId: null,
    transporterName: null
  };
  public selectedInvoices: any[] = [];
  public supplyType: any = [{}];

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public SubsupplyTypesList: IOption[] = [
    { value: '1', label: 'Supply' },
    { value: '3', label: 'Export' },
    { value: '4', label: 'Job Work' },
    { value: '9', label: 'SKD/CKD/Lots' },
  ];
  // "INV", "CHL", "BIL","BOE","CNT","OTH"
  public SupplyTypesList: IOption[] = [
    {value: 'O', label: 'Inward'},
    {value: 'I', label: 'Outward'},
  ];
  public TransporterDocType: IOption[] = [
    { value: 'INV', label: 'Invoice' },
    { value: 'BIL', label: 'Bill of Supply' },
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
    this.isGenarateTransporterInProcess$ = this.store.select(p => p.ewaybillstate.isAddnewTransporterInProcess).pipe(takeUntil(this.destroyed$));
    this.updateTransporterInProcess$ = this.store.select(p => p.ewaybillstate.updateTransporterInProcess).pipe(takeUntil(this.destroyed$));
    this.updateTransporterSuccess$ = this.store.select(p => p.ewaybillstate.updateTransporterSuccess).pipe(takeUntil(this.destroyed$));
    this.isGenarateTransporterSuccessfully$ = this.store.select(p => p.ewaybillstate.isAddnewTransporterInSuccess).pipe(takeUntil(this.destroyed$));
    this.transporterListDetails$ = this.store.select(p => p.ewaybillstate.TransporterListDetails).pipe(takeUntil(this.destroyed$));
    this.transporterList$ = this.store.select(p => p.ewaybillstate.TransporterList).pipe(takeUntil(this.destroyed$));
    this.isLoggedInUserEwayBill$ = this.store.select(p => p.ewaybillstate.isUserLoggedInEwaybillSuccess).pipe(takeUntil(this.destroyed$));
    this.isUserAddedSuccessfully$ = this.store.select(p => p.ewaybillstate.isEwaybillUserCreationSuccess).pipe(takeUntil(this.destroyed$));
    this.invoiceBillingGstinNo = this.selectedInvoices.length ? this.selectedInvoices[0].billingGstNumber : '';
    this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
     this.store.dispatch(this.invoiceActions.getALLTransporterList());
    //  this.store.dispatch(this.invoiceActions.isLoggedInUserEwayBill());
  }

  public toggleEwayBillCredentialsPopup() {
    this.eWayBillCredentials.toggle();
  }

  public ngOnInit() {

      this._invoiceService.IsUserLoginEwayBill().subscribe(res => {
      if (res.status === 'success')  {
        this.isUserlogedIn = true;
      } else {
        this.isUserlogedIn = false;
      }
    });

     this.store.dispatch(this.invoiceActions.getALLTransporterList());
    this.selectedInvoices = this._invoiceService.getSelectedInvoicesList;
      this.transporterList$.subscribe( s => console.log('s', s) );
    this.store.select(state => state.ewaybillstate.TransporterList).pipe(takeUntil(this.destroyed$)).subscribe(p => {
      if (p && p.length) {
         let transporterDropdown = null;
         let transporterArr = null;
         transporterDropdown = p;
         transporterArr = transporterDropdown.map(trans => {
          return {label: trans.transporterName, value: trans.transporterId};
        });
        this.transporterDropdown$ = of(transporterArr);
      }
    });
    this.invoiceNumber = this.selectedInvoices.length ? this.selectedInvoices[0].voucherNumber : '';
    this.invoiceBillingGstinNo = this.selectedInvoices.length ? this.selectedInvoices[0].billingGstNumber : null;
    if (this.invoiceBillingGstinNo) {
      this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
    } else {
      this.generateEwayBillform.toGstIn = 'URP';
    }
    if (this.selectedInvoices.length === 0) {
      this.router.navigate(['/invoice/preview/sales']);
    }
    this.isEwaybillGeneratedSuccessfully$.subscribe(s => {
      if (s) {

        this.generateEwayBillForm.reset();
        this.router.navigate(['/pages/invoice/ewaybill']);
      }
    });
    this.isEwaybillGeneratedSuccessfully$.subscribe(s => {
        if (s) {
          this.generateNewTransporter = null;
        }
      }
    );
    this.updateTransporterSuccess$.subscribe(s => {
      if (s) {
        this.generateNewTransporterForm.reset();
      }
    });

    this.store.select(state => state.ewaybillstate.isAddnewTransporterInSuccess).pipe(takeUntil(this.destroyed$)).subscribe(p => {
      if (p) {
     this.clearTransportForm();
      }
    });
  }

public clearTransportForm() {
        this.generateNewTransporter = {
                            transporterId: null,
                            transporterName: null
                          };
}

// generate Eway
  public onSubmitEwaybill(generateBillform: NgForm) {
    this._invoiceService.IsUserLoginEwayBill().subscribe(res => {
      if (res.status === 'success')  {
        this.isUserlogedIn = true;
      } else {
        this.isUserlogedIn = false;
      }
    });
    if (this.isUserlogedIn) {
    this.generateBill = generateBillform.value;
    this.generateBill['supplyType'] = 'O';                     // O is for Outword in case of invoice
    this.generateBill['transactionType'] = '1';                // transactionType is always 1 for Regular
    this.generateBill['invoiceNumber'] = this.invoiceNumber;
    this.generateBill['toGstIn'] = this.invoiceBillingGstinNo ? this.invoiceBillingGstinNo : 'URP';

    this.generateBill['transDocDate'] = this.generateBill['transDocDate'] ? moment(this.generateBill['transDocDate']).format('DD-MM-YYYY') : null;

    if (generateBillform.valid) {
      this.store.dispatch(this.invoiceActions.GenerateNewEwaybill(generateBillform.value));
    }
    } else {
    this.eWayBillCredentials.toggle();
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
  public selectTransporter(e) {
     this.generateEwayBillform.transporterName = e.label;
  }
    public keydownPressed(e) {
    if (e.code === 'ArrowDown') {
      this.keydownClassAdded = true;
    } else if (e.code === 'Enter' && this.keydownClassAdded) {
      this.keydownClassAdded = true;
      this.OpenTransporterModel();
     // this.toggleAsidePane();
    } else {
      this.keydownClassAdded = false;
    }

  }
  public OpenTransporterModel() {
    this.status = !this.status;
  }
  public generateTransporter(generateTransporterForm: NgForm) {

 this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm.value));
  }

  public updateTransporter(generateTransporterForm: NgForm) {

 this.store.dispatch(this.invoiceActions.updateEwayBillTransporter(this.currenTransporterId, generateTransporterForm.value));
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public editTransporter(trans: any) {
    //
   // this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm.value));
   let transportEditObject = Object.assign({}, trans);
   this.seTransporterDetail(trans);
   this.transportEditMode = true;
  }
   public seTransporterDetail(trans) {
    if (trans !== undefined && trans) {
       this.generateNewTransporter.transporterId = trans.transporterId;
       this.generateNewTransporter.transporterName = trans.transporterName;
       this.currenTransporterId = trans.transporterId;
    }
  }
  public deleteTransporter(trans: IEwayBillTransporter) {
    this.store.dispatch(this.invoiceActions.deleteTransporter(trans.transporterId));
  }

}
