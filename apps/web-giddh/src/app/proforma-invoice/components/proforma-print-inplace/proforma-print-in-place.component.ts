import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { DownloadVoucherRequest } from '../../../models/api-models/recipt';
import { ProformaDownloadRequest } from '../../../models/api-models/proforma';
import { VoucherTypeEnum } from '../../../models/api-models/Sales';
import { base64ToBlob } from '../../../shared/helpers/helperFunctions';
import { ToasterService } from '../../../services/toaster.service';
import { ProformaService } from '../../../services/proforma.service';
import { ReceiptService } from '../../../services/receipt.service';

@Component({
    selector: 'proforma-print-in-place-component',
    templateUrl: './proforma-print-in-place.component.html',
    styleUrls: ['./proforma-print-in-place.component.scss']
})

export class ProformaPrintInPlaceComponent implements OnInit {
    @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
    @Input() public selectedItem: { voucherNumber: string, uniqueName: string, blob?: Blob };
    @ViewChild(PdfJsViewerComponent) public pdfViewer: PdfJsViewerComponent;
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public isVoucherDownloading: boolean = false;
    public isVoucherDownloadError: boolean = false;

    constructor(private _toasty: ToasterService, private _proformaService: ProformaService, private _receiptService: ReceiptService) {
    }

    ngOnInit() {
        if (this.selectedItem) {
            this.downloadVoucher('base64');
        }
    }

    public downloadVoucher(fileType: string = '') {
        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;

        if (this.voucherType === 'sales') {
            let model: DownloadVoucherRequest = {
                voucherType: this.voucherType,
                voucherNumber: [this.selectedItem.voucherNumber]
            };
            let accountUniqueName: string = this.selectedItem.uniqueName;
            //
            this._receiptService.DownloadVoucher(model, accountUniqueName, false).subscribe(result => {
                if (result) {
                    this.pdfViewer.pdfSrc = result;
                    this.selectedItem.blob = result;
                    this.pdfViewer.showSpinner = true;
                    this.pdfViewer.refresh();
                    this.printVoucher();
                    this.isVoucherDownloadError = false;
                } else {
                    this.isVoucherDownloadError = true;
                    this._toasty.errorToast('Something went wrong please try again!');
                }
                this.isVoucherDownloading = false;
            }, (err) => {
                this._toasty.errorToast(err.message);
                this.isVoucherDownloading = false;
                this.isVoucherDownloadError = true;
            });
        } else {
            let request: ProformaDownloadRequest = new ProformaDownloadRequest();
            request.fileType = fileType;
            request.accountUniqueName = this.selectedItem.uniqueName;

            if (this.voucherType === VoucherTypeEnum.generateProforma) {
                request.proformaNumber = this.selectedItem.voucherNumber;
            } else {
                request.estimateNumber = this.selectedItem.voucherNumber;
            }

            this._proformaService.download(request, this.voucherType).subscribe(result => {
                if (result && result.status === 'success') {
                    let blob: Blob = base64ToBlob(result.body, 'application/pdf', 512);
                    this.pdfViewer.pdfSrc = blob;
                    this.selectedItem.blob = blob;
                    this.pdfViewer.showSpinner = true;
                    this.pdfViewer.refresh();
                    this.printVoucher();
                    this.isVoucherDownloadError = false;
                } else {
                    this._toasty.errorToast(result.message, result.code);
                    this.isVoucherDownloadError = true;
                }
                this.isVoucherDownloading = false;
            }, (err) => {
                this._toasty.errorToast(err.message);
                this.isVoucherDownloading = false;
                this.isVoucherDownloadError = true;
            });
        }
    }

    public printVoucher() {
        if (this.pdfViewer && this.pdfViewer.pdfSrc) {
            this.pdfViewer.startPrint = true;
            this.pdfViewer.refresh();
            this.pdfViewer.startPrint = false;
        }
    }
}
