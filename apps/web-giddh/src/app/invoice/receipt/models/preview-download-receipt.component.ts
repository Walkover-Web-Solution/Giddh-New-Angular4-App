import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
    @Output() public openUpdateReceiptModel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public closeModelEvent: EventEmitter<string> = new EventEmitter();
    public base64StringForModel: any;
    public isRequestInProcess: boolean = false;
    public isError: boolean = false;
    @Input() public activatedInvoice: string;

    constructor(private _receiptService: ReceiptService, private _toasty: ToasterService,
        private sanitizer: DomSanitizer, private _cdRef: ChangeDetectorRef) {
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
        this._receiptService.DownloadVoucher(model, accountUniqueName, false)
            .subscribe(s => {
                if (s) {
                    this.isRequestInProcess = false;
                    this.isError = false;
                    const reader = new FileReader();

                    reader.addEventListener('loadend', (e: any) => {
                        let str = 'data:application/pdf;base64,' + e.srcElement.result.split(',')[1];
                        this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
                        this._cdRef.detectChanges();
                    });

                    reader.readAsDataURL(s);
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

    public editButtonClicked() {
        this.openUpdateReceiptModel.emit(true);
        this.closeModelEvent.emit();
    }
}
