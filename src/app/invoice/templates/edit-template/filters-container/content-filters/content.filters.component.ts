import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../../store/roots';
import { InvoiceActions } from '../../../../../services/actions/invoice/invoice.actions';
@Component({
  selector: 'content-selector',
  templateUrl: 'content.filters.component.html',
  styleUrls: ['content.filters.component.css']
})

export class ContentFilterComponent {
  @Input() public content: boolean;
  // @Input() public contentData: Content;
  public GSTIN: string;
  public PAN: string;
  public companyName: string;
  public myValue: number;
  public itemSlider: string;
  public item: string;
  public custom1: string;
  public custom2: string;
  public custom3: string;
  public itemCodeSlider: string;
  public qtySlider: string;
  public rateSlider: string;
  public discountSlider: string;
  public taxSlider: string;
  public totalSlider: string;
  public numSlider: string;
  public quantitySlider: string;
  public taxValueSlider: string;
  public dateSlider: string;
  public invoiceNo: string;
  public invoiceDate: string;
  public dueDate: string;
  public shippingDate: string;
  public shippingVia: string;
  public trackingNo: string;
  public invoice: string;
  public taxInvoice: string;
  public billingAddress: string;
  public billingGstin: string;
  public shippingAddress: string;
  public shippingGstin: string;
  public message1: string;
  public message2: string;


  // public data: Content = null;

  constructor(private store: Store<AppState>, public invoiceAction: InvoiceActions) {
    // console.log('design-filters-container constructor called');
  }

  public showTemplate(id) {
    this.store.dispatch(this.invoiceAction.setTemplateId(id));
  }

// -------------------GSTIN--------------------
  public onGSTINChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateGSTIN(data));
    console.log(data);
  }

  // public onCheckGSTIN(check) {
  //   if (check === 'false') {
  //     this.enableGSTIN = false;
  //   }
  // }

  // ----------PAN-----------------
  public onPANChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updatePAN(data));
    console.log(data);
  }


  // -----------InvoiceDate------------

  public onInvoiceDateChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateInvoiceDate(data));
    console.log(data);
  }

  //
  // public onCheckInvoiceDate(check) {
  //   if (check === 'false') {
  //     this.enableInvoiceDate = false;
  //   }
  // }

  // ---------------InvoiceNumber----------
  public onInvoiceNumberChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateInvoiceNo(data));
    console.log(data);
  }

//   public onCheckInvoiceNumber(check) {
//     if (check === 'false') {
//       this.enableInvoiceNumber = false;
//     }
//   }
//
//   // -------------------ShipDate---------------
  public onShipDateChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateShippingDate(data));
    console.log(data);
  }
//
//   public onCheckShipDAte(check) {
//     if (check === 'false') {
//       this.enableShipDate = false;
//     }
//   }
//   // -------------------ShipVia-------------------
  public onShipViaChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateShippingState(data));
    console.log(data);
  }
  public onTrackingNoChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateTrackingNo(data));
    console.log(data);
  }

//   public onCheckTrackingNo(check) {
//     if (check === 'false') {
//       this.enableTrackingNo = false;
//     }
//   }
//
//   // ------------------InvoiceTitleName-------------
  public onInvoiceChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateFormNameInvoice(data));
    console.log(data);
  }

  public onTaxInvoiceChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateFormNameTaxInvoice(data));
    console.log(data);
  }

//   // --------------------CustomerDetails-----------------
//
//   public onCheckCustomerName(check) {
//     if (check === 'false') {
//       this.enableCustomerName = false;
//     }
//   }
//
//   public onCheckCustomerCompanyName(check) {
//     if (check === 'false') {
//       this.enableCompanyName = false;
//     }
//   }
//
//   public onCheckCustomerEmailId(check) {
//     if (check === 'false') {
//       this.enableCustomerEmailId = true;
//     }
//   }
//
//   public onCheckCustomerMobileNo(check) {
//     if (check === 'false') {
//       this.enableCustomerMobileNo = true;
//     }
//   }
// // ------------------------BillingDetails-------------------
//
  public onShippingAddressChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateShippingAddress(data));
    console.log(data);
  }

  public onShippingGstinChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateShippingGSTIN(data));
    console.log(data);
  }

  public onBillingAddressChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateBillingAddress(data));
    console.log(data);
  }

  public onBillingGstinChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateBillingGSTIN(data));
    console.log(data);
  }
  public onMessage1Change(data) {
    this.store.dispatch(this.invoiceAction.updateMessage1(data));
  }
  public onMessage2Change(data) {
    this.store.dispatch(this.invoiceAction.updateMessage2(data));
  }

  public onCustom1Change(data) {
    this.store.dispatch(this.invoiceAction.updateCustomField1(data));
  }
  public onCustom2Change(data) {
    this.store.dispatch(this.invoiceAction.updateCustomField2(data));
  }

  public onCustom3Change(data) {
    this.store.dispatch(this.invoiceAction.updateCustomField3(data));
  }
//
//   public onCheckShippingAddress(check) {
//     if (check === 'false') {
//       this.enableShippingAddress = false;
//     }
//   }
//
//   public onCheckShippingAddressState(check) {
//     if (check === 'false') {
//       this.enableShippingAddressState = true;
//     }
//   }
//
//   // ----------------------InvoiceGrid-----------------------
  public onChangeWidth(value, colName) {
    this.store.dispatch(this.invoiceAction.setColumnWidth(value, colName));
  }
// }
//
//
}
