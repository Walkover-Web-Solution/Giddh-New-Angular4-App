import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReceiptService } from '../../../services/receipt.service';
import { DownloadVoucherRequest } from '../../../models/api-models/recipt';
import { ToasterService } from '../../../services/toaster.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'preview-download-receipt-component',
  templateUrl: 'preview-download-receipt.component.html'
})

export class PreviewDownloadReceiptComponent implements OnInit, OnChanges {
  @Input() public request: any;
  @Output() public closeModelEvent: EventEmitter<string> = new EventEmitter();
  public base64StringForModel: any;
  public isRequestInProcess: boolean = false;
  public isError: boolean = false;

  constructor(private _receiptService: ReceiptService, private _toasty: ToasterService, private sanitizer: DomSanitizer) {
    //
  }

  public ngOnInit() {
    // debugger;
  }

  public downloadVoucherRequest() {

    let model: DownloadVoucherRequest = {
      voucherType: this.request.voucherType,
      voucherNumber: this.request.voucherNumber
    };
    let accountUniqueName: string = this.request.accountUniqueName;
    //
    this.isRequestInProcess = true;
    this._receiptService.DownloadVoucher(model, accountUniqueName, true)
      .subscribe(s => {
        if (s) {
          this.isRequestInProcess = false;
          this.isError = false;
          debugger;
          let str = (window.URL || (window as any).webkitURL).createObjectURL(s);
          this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
        } else {
          this.isRequestInProcess = false;
          this.isError = true;
          this._toasty.errorToast('Preview Not Available! Please Try Again');
        }
      }, (e) => {
        this.isRequestInProcess = false;
        this.isError = true;
        this._toasty.errorToast('Preview Not Available! Please Try Again');
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['request'].currentValue && changes['request'].currentValue !== changes['request'].previousValue) {
      this.downloadVoucherRequest();
    }
  }
}
