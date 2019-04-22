import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { InvoicePreviewComponent } from '../../../invoice/preview/invoice.preview.component';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GenerateEwayBill, IEwayBilldropDownValues, SelectedInvoices, IEwayBillTransporter, IEwayBillAllList, Result, IAllTransporterDetails } from 'app/models/api-models/Invoice';
import { IOption } from 'app/theme/ng-select/ng-select';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { InvoiceService } from 'app/services/invoice.service';
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
  public isLoggedInUserEwayBill$: Observable<boolean>;
  public transporterDropdown$: any;
  public newLoginUser: boolean = false;
  public keydownClassAdded: boolean = false;
  public status: boolean = false;
  public transportEditMode: boolean = false;
  public transportEditObject: IEwayBillTransporter;
  public transporterList$: Observable<IEwayBillTransporter[]>;
  public transporterListDetails$: Observable<IAllTransporterDetails>;

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
  public supplyType: any = [{
  }];

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public SubsupplyTypesList: IOption[] = [
    { value: '1', label: 'Supply' },
    // {value: '2', label: 'Import'},
    { value: '3', label: 'Export' },
    { value: '4', label: 'Job Work' },
    // {value: '5', label: 'For Own Use'},
    // {value: '6', label: 'Job work Returns'},
    // {value: '7', label: 'Sales Return'},
    // {value: '8', label: 'Others'},
    { value: '9', label: 'SKD/CKD/Lots' },
    // {value: '10', label: 'Line Sales'},
    // {value: '11', label: 'Recipient  Not Known'},
    // {value: '12', label: 'Exhibition or Fairs'}
  ];
  // "INV", "CHL", "BIL","BOE","CNT","OTH"
  public SupplyTypesList: IOption[] = [
    { value: 'O', label: 'Inward' },
    { value: 'I', label: 'Outward' },
  ];
  public TransporterDocType: IOption[] = [
    { value: 'INV', label: 'Invoice' },
    // {value: 'CHL', label: 'Delivery Challan'},
    { value: 'BIL', label: 'Bill of Supply' },
    // {value: 'BOE', label: 'Bill of Entry'},
    //  {value: 'CNT', label: 'Credit Note'},
    // {value: 'OTH', label: 'Others'},
  ];
  public transactionType: IOption[] = [
    { value: '1', label: 'Regular' },
    { value: '2', label: 'Credit Notes' },
    { value: '3', label: 'Delivery challan' }
  ];

  // public generateEwayBillforms: GenerateEwayBill = {
  //   supplyType: null,
  //   subSupplyType: null,
  //   transMode: null,
  //   toPinCode: null,
  //   transDistance: null,
  //   invoiceNumber: null,
  //   transporterName: null,
  //   transporterId: null,
  //   transDocNo: null,
  //   transDocDate: null,

  //   vehicleNo: null,
  //   vehicleType: null,
  //   transactionType: null,
  //   docType: null,
  //   toGstIn: null,
  // };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private _invoiceService: InvoiceService, private router: Router) {
    this.isEwaybillGenerateInProcess$ = this.store.select(p => p.ewaybillstate.isGenerateEwaybillInProcess).pipe(takeUntil(this.destroyed$));
    this.isEwaybillGeneratedSuccessfully$ = this.store.select(p => p.ewaybillstate.isGenerateEwaybilSuccess).pipe(takeUntil(this.destroyed$));
    this.isGenarateTransporterInProcess$ = this.store.select(p => p.ewaybillstate.isAddnewTransporterInProcess).pipe(takeUntil(this.destroyed$));
    this.isGenarateTransporterSuccessfully$ = this.store.select(p => p.ewaybillstate.isAddnewTransporterInSuccess).pipe(takeUntil(this.destroyed$));
    this.transporterListDetails$ = this.store.select(p => p.ewaybillstate.TransporterListDetails).pipe(takeUntil(this.destroyed$));
    this.transporterList$ = this.store.select(p => p.ewaybillstate.TransporterList).pipe(takeUntil(this.destroyed$));
    this.isLoggedInUserEwayBill$ = this.store.select(p => p.ewaybillstate.isUserLoggedInEwaybillSuccess).pipe(takeUntil(this.destroyed$));
    this.invoiceBillingGstinNo = this.selectedInvoices.length ? this.selectedInvoices[0].billingGstNumber : '';
    this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
     this.store.dispatch(this.invoiceActions.getALLTransporterList());
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

    // if (!this.newLoginUser) {
    //   this.toggleEwayBillCredentialsPopup();
    // }
     this.transporterList$.subscribe( s => console.log('s', s) );
    this.store.select(state => state.ewaybillstate.TransporterList).pipe(takeUntil(this.destroyed$)).subscribe(p => {
      if (p && p.length) {
        let transporterDropdown = p;
        let transporterArr = transporterDropdown.map(trans => {
          return {label: trans.transporterName, value: trans.transporterId};
        });
        this.transporterDropdown$ = of(transporterArr);
      }
    });
     this.store.dispatch(this.invoiceActions.getALLTransporterList());
    this.selectedInvoices = this._invoiceService.getSelectedInvoicesList;
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

    this.store.select(state => state.ewaybillstate.isAddnewTransporterInSuccess).pipe(takeUntil(this.destroyed$)).subscribe(p => {
      if (p) {
      this.generateNewTransporter = { transporterId: null,
         transporterName: null
      };
      }
    });
  }

  public onSubmitEwaybill(generateBillform: NgForm) {

    this.generateBill = generateBillform.value;
    this.generateBill['supplyType'] = 'O';                     // O is for Outword in case of invoice
    this.generateBill['transactionType'] = '1';                // transactionType is always 1 for Regular
    this.generateBill['invoiceNumber'] = this.invoiceNumber;
    this.generateBill['toGstIn'] = this.invoiceBillingGstinNo;

    this.generateBill['transDocDate'] = this.generateBill['transDocDate'] ? moment(this.generateBill['transDocDate']).format('DD-MM-YYYY') : null;

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
  public selectTransporter(e) {
    console.log('transpoetrr selected ', e);
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

// this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm.value));
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public editTransporter(trans: any) {
    //
   // this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm.value));
   let transportEditObject = Object.assign({}, trans);
   console.log('trans', trans);
   this.seTransporterDetail(trans);
   this.transportEditMode = true;
  }
   public seTransporterDetail(trans) {
    if (trans !== undefined && trans) {
       this.generateNewTransporter.transporterId = trans.transporterId;
       this.generateNewTransporter.transporterName = trans.transporterName;
    }
  }
  public deleteTransporter(trans: IEwayBillTransporter) {
    this.store.dispatch(this.invoiceActions.deleteTransporter(trans.transporterId));
  }

}
