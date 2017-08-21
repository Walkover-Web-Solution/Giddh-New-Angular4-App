import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../../store/roots';
import { InvoiceActions } from '../../../../../services/actions/invoice/invoice.actions';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import {Observable} from "rxjs/Observable";
import {InvoiceUiDataService} from "../../../../../services/invoice.ui.data.service";
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
  public itemSlider: string;
  public item: string;
  public custom1: string;
  public custom2: string;
  public custom3: string;
  public sNo: string;
  public qty: string;
  public rate: string;
  public discount: string;
  public tax: string;
  public total: string;
  public taxableValue: string;
  public date: string;
  public invoiceNo: string;
  public invoiceDate: string;
  public dueDate: string;
  public shippingDate: string;
  public shippingVia: string;
  public trackingNo: string;
  public invoice: string;
  public taxInvoice: string;
  public hsnSac: string;
  public billingGstin: string;
  public shippingAddress: string;
  public shippingGstin: string;
  public message1: string;
  public message2: string;
  public files: UploadFile[];
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: any;
  public dragOver: boolean;
  public ti: TaxInvoiceLabel;


  // public data: Content = null;

  constructor(private store: Store<AppState>, public invoiceAction: InvoiceActions, private _invoiceUiDataService: InvoiceUiDataService) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
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

  }

  public onDueDateChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateDueDate(data));

  }

  //
  // public onCheckInvoiceDate(check) {
  //   if (check === 'false') {
  //     this.enableInvoiceDate = false;
  //   }
  // }

  // ---------------InvoiceNumber----------
  public onInvoiceNoChange(data) {
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
    this.store.dispatch(this.invoiceAction.updateShippingVia(data));
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
    this.ti = {
      data: data,
      setTaxInvoiceActive: false
    }
    this.store.dispatch(this.invoiceAction.updateFormNameInvoice(this.ti));
    console.log(data);
  }

  public onTaxInvoiceChange(data) {
    this.ti = {
      data: data,
      setTaxInvoiceActive: true
    }
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateFormNameTaxInvoice(this.ti));
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

  public onSnoLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateSnoLabel(data));
  }
  public onDateLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateDateLabel(data));
  }
  public onItemLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateItemLabel(data));
  }

  public onHsnLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateItemLabel(data));
  }
  public onQtyLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateQuantityLabel(data));
  }
  public onRateLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateRateLabel(data));
  }
  public onDiscountLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateDiscountLabel(data));
  }
  public onTaxableValueLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateTaxableValueLabel(data));
  }
  public onTaxLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateTaxLabel(data));
  }
  public onTotalLabelChange(data) {
    this.store.dispatch(this.invoiceAction.updateTotalLabel(data));
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

  public onUploadOutput(output: UploadOutput): void {

    if (output.type === 'allAddedToQueue') {
      this.files.push(output.file);
      console.log(this.files);
      debugger;
      this.previewFile(this.files);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
      console.log(this.files);
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  public startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' },
      // concurrency: this.formData.concurrency
    };

    this.uploadInput.emit(event);
  }

  public previewFile(files: any) {
    let preview = document.querySelector('img');
    let file    = document.querySelector('input[type=file]').files[0];
    let reader  = new FileReader();
    let imgSrc$: Observable<any>;

    reader.onloadend = () => {
      preview.src = reader.result;
      this._invoiceUiDataService.setImageSignatgurePath(preview.src);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = ' ';
    }
  }


//
//
}

export interface TaxInvoiceLabel {
  setTaxInvoiceActive: boolean;
  data: string;
}
