import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../../store/roots';
import { InvoiceActions } from '../../../../../services/actions/invoice/invoice.actions';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Observable } from 'rxjs/Observable';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { InvoiceTemplatesService } from '../../../../../services/invoice.templates.service';
@Component({
  selector: 'content-selector',
  templateUrl: 'content.filters.component.html',
  styleUrls: ['content.filters.component.css']
})

export class ContentFilterComponent {
  @Input() public content: boolean;
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
  public div$: Observable<IsDivVisible>;
  public divStatus: IsDivVisible;
  public header: boolean = true;
  public grid: boolean = false;
  public footer: boolean = false;
  public field: IsFieldVisible = {
    enableCompanyName: true,
  enableCompanyAddress: true,
  enableInvoiceDate: true,
  enableInvoiceNo: true,
    enableDueDate: true,
    enableBillingAddress: true,
    enableShipDate: true,
  enableShipVia: true,
  enableTrackingNo: true,
  enableDocTitle: true,
  enableBillingState: true,
  enableBillingGstin: true,
  enableShippingAddress: true,
  enableShippingState: true,
  enableShippingGstin: true,
  enableCustom1:  true,
  enableCustom2:  true,
  enableCustom3: true,
  enableSno: true,
  enableDate: true,
  enableItem: true,
  enableHsn: true,
  enableQty: true,
  enableRate: true,
  enableDis: true,
  enableTaxableValue: true,
  enableTax: true,
  enableTotal: true,
  enableTaxableAmount: true,
  enableTotalTax: true,
  enableOtherDeductions: true,
  enableInvoiceTotal: true,
  enableMessage1: true,
  enableMessage2: true,
  enableThanks: true,
  };

  constructor(private store: Store<AppState>, public invoiceAction: InvoiceActions, private _invoiceUiDataService: InvoiceUiDataService, private invoiceTemplatesService: InvoiceTemplatesService) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.div$ = this.invoiceTemplatesService.getDivStatus();
    // this.div$.subscribe(val => {});
    this._invoiceUiDataService.setDivVisible.subscribe((val) => {
      if (val) {
        this.header = val.header;
        this.grid = val.grid;
        this.footer = val.footer;
      }
    });
  }

  public showTemplate(id) {
    this.store.dispatch(this.invoiceAction.setTemplateId(id));
  }

  public onGSTINChange(data) {
    this.store.dispatch(this.invoiceAction.updateGSTIN(data));
  }

  public onPANChange(data) {
    this.store.dispatch(this.invoiceAction.updatePAN(data));
  }

  public onInvoiceDateChange(data) {
    this.store.dispatch(this.invoiceAction.updateInvoiceDate(data));

  }

  public onDueDateChange(data) {
    this.store.dispatch(this.invoiceAction.updateDueDate(data));

  }

  public onInvoiceNoChange(data) {
    this.store.dispatch(this.invoiceAction.updateInvoiceNo(data));
  }

  public onShipDateChange(data) {
    this.store.dispatch(this.invoiceAction.updateShippingDate(data));
  }

  public onShipViaChange(data) {
    this.store.dispatch(this.invoiceAction.updateShippingVia(data));
  }
  public onTrackingNoChange(data) {
    this.store.dispatch(this.invoiceAction.updateTrackingNo(data));
  }

  public onInvoiceChange(data) {
    this.ti = {
      data: data,
      setTaxInvoiceActive: false
    };
    this.store.dispatch(this.invoiceAction.updateFormNameInvoice(this.ti));
  }

  public onTaxInvoiceChange(data) {
    this.ti = {
      data: data,
      setTaxInvoiceActive: true
    };
    this.store.dispatch(this.invoiceAction.updateFormNameTaxInvoice(this.ti));
  }

  public onShippingAddressChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateShippingAddress(data));
  }

  public onShippingGstinChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateShippingGSTIN(data));
  }

  public onBillingAddressChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateBillingAddress(data));
  }

  public onBillingGstinChange(data) {
    // this.store.dispatch(this.invoiceAction.setTemplateId(id));
    this.store.dispatch(this.invoiceAction.updateBillingGSTIN(data));
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

  // logic for image uploader
  public onUploadOutput(output: UploadOutput): void {

    if (output.type === 'allAddedToQueue') {
      this.files.push(output.file);
      console.log(this.files);
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
    };
    this.uploadInput.emit(event);
  }

  public previewFile(files: any) {
    let preview = document.querySelector('img');
    let a: any  = document.querySelector('input[type=file]');
    let file    = a.files[0];
    let reader  = new FileReader();
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
  // checking visibility of a field
  public onCheckField(field, value) {
      if (field === 'companyName') {
        this.field.enableCompanyName = value;
      } else if (field === 'invoiceDate') {
        this.field.enableInvoiceDate = value;
      }  else if (field === 'invoiceNo') {
        this.field.enableInvoiceNo = value;
      } else if (field === 'companyAddress') {
        this.field.enableCompanyAddress = value;
      } else if (field === 'dueDa') {
        this.field.enableDueDate = value;
      } else if (field === 'billingAddr') {
        this.field.enableBillingAddress = value;
      } else if (field === 'billingGstin') {
        this.field.enableBillingGstin = value;
      } else if (field === 'billingState') {
        this.field.enableBillingState = value;
      } else if (field === 'shippingAddr') {
        this.field.enableShippingAddress = value;
      } else if (field === 'shippingGstin') {
        this.field.enableShippingGstin = value;
      } else if (field === 'shippingState') {
        this.field.enableShippingAddress = value;
      } else if (field === 'custom1') {
        this.field.enableCustom1 = value;
      } else if (field === 'custom2') {
        this.field.enableCustom2 = value;
      } else if (field === 'custom3') {
        this.field.enableCustom3 = value;
      } else if (field === 'sNo') {
        this.field.enableSno = value;
      } else if (field === 'date') {
        this.field.enableDate = value;
      } else if (field === 'item') {
        this.field.enableItem = value;
      } else if (field === 'hsn') {
        this.field.enableHsn = value;
      } else if (field === 'qty') {
        this.field.enableQty = value;
      } else if (field === 'rate') {
        this.field.enableRate = value;
      } else if (field === 'dis') {
        this.field.enableDis = value;
      } else if (field === 'taxableValue') {
        this.field.enableTaxableValue = value;
      } else if (field === 'tax') {
        this.field.enableTax = value;
      } else if (field === 'total') {
        this.field.enableTotal = value;
      } else if (field === 'taxableAmount') {
        this.field.enableTaxableAmount = value;
      } else if (field === 'totalTax') {
        this.field.enableTotalTax = value;
      } else if (field === 'otherDeductions') {
        this.field.enableOtherDeductions = value;
      } else if (field === 'invoiceTotal') {
        this.field.enableInvoiceTotal = value;
      } else if (field === 'message1') {
        this.field.enableMessage1 = value;
      } else if (field === 'message2') {
        this.field.enableMessage2 = value;
      } else if (field === 'thanks') {
        this.field.enableThanks = value;
      } else if (field === 'companyAddr') {
        this.field.enableCompanyAddress = value;
      }
      this._invoiceUiDataService.setFieldDisplayState(this.field);
  }
}

export interface TaxInvoiceLabel {
  setTaxInvoiceActive: boolean;
  data: string;
}

export interface IsDivVisible {
  header: boolean;
  grid: boolean;
  footer: boolean;
}

export interface IsFieldVisible {
  enableCompanyName: boolean;
  enableCompanyAddress: boolean;
  enableInvoiceDate: boolean;
  enableInvoiceNo: boolean;
  enableDueDate: boolean;
  enableBillingAddress: boolean;
  enableShipDate: boolean;
  enableShipVia: boolean;
  enableTrackingNo: boolean;
  enableDocTitle: boolean;
  enableBillingState: boolean;
  enableBillingGstin: boolean;
  enableShippingAddress: boolean;
  enableShippingState: boolean;
  enableShippingGstin: boolean;
  enableCustom1: boolean;
  enableCustom2: boolean;
  enableCustom3: boolean;
  enableSno: boolean;
  enableDate: boolean;
  enableItem: boolean;
  enableHsn: boolean;
  enableQty: boolean;
  enableRate: boolean;
  enableDis: boolean;
  enableTaxableValue: boolean;
  enableTax: boolean;
  enableTotal: boolean;
  enableTaxableAmount: boolean;
  enableTotalTax: boolean;
  enableOtherDeductions: boolean;
  enableInvoiceTotal: boolean;
  enableMessage1: boolean;
  enableMessage2: boolean;
  enableThanks: boolean;
}
