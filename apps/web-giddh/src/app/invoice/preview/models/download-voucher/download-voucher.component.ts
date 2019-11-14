import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { saveAs } from 'file-saver';
import { InvoiceService } from '../../../../services/invoice.service';
import { ToasterService } from '../../../../services/toaster.service';
import { InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';
import { ProformaService } from '../../../../services/proforma.service';

@Component({
  selector: 'download-voucher',
  templateUrl: './download-voucher.component.html'
})

export class DownloadVoucherComponent implements OnInit {
  @Input() public selectedItem: InvoicePreviewDetailsVm;
  public invoiceType: string[] = [];
  public isTransport: boolean = false;
  public isCustomer: boolean = false;
  public isProformaEstimatesInvoice: boolean = false;
  @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private _invoiceService: InvoiceService, private _toaster: ToasterService, private _cdr: ChangeDetectorRef,
              private _proformaService: ProformaService) {
  }

  ngOnInit() {
    this.isProformaEstimatesInvoice = [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.selectedItem.voucherType)
  }

  invoiceTypeChanged(event) {
    let val = event.target.value;
    if (event.target.checked) {
      this.invoiceType.push(val);
    } else {
      this.invoiceType = this.invoiceType.filter(f => f !== val);
    }
  }

  public onDownloadInvoiceEvent() {
    let dataToSend = {
      voucherNumber: [this.selectedItem.voucherNumber],
      typeOfInvoice: this.invoiceType,
      voucherType: this.selectedItem.voucherType
    };
    this._invoiceService.DownloadInvoice(this.selectedItem.account.uniqueName, dataToSend)
      .subscribe(res => {
        if (res) {
          if (dataToSend.typeOfInvoice.length > 1) {
            saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
          } else {
            saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
          }
        } else {
          this._toaster.errorToast('Something went wrong Please try again!');
        }
      }, (error => {
        this._toaster.errorToast('Something went wrong Please try again!');
      }));
  }

  resetModal() {
    this.invoiceType = [];
    this.isTransport = false;
    this.isCustomer = false;
  }

  cancel() {
    this.resetModal();
    this.cancelEvent.emit(true);
  }
}
