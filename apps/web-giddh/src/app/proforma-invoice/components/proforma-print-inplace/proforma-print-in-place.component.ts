import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DownloadVoucherRequest } from '../../../models/api-models/recipt';
import { ProformaDownloadRequest } from '../../../models/api-models/proforma';
import { VoucherTypeEnum } from '../../../models/api-models/Sales';
import { ToasterService } from '../../../services/toaster.service';
import { ProformaService } from '../../../services/proforma.service';
import { ReceiptService } from '../../../services/receipt.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'proforma-print-in-place-component',
    templateUrl: './proforma-print-in-place.component.html',
    styleUrls: ['./proforma-print-in-place.component.scss']
})

export class ProformaPrintInPlaceComponent implements OnInit, OnDestroy {
    @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
    @Input() public selectedItem: { voucherNumber: string, uniqueName: string, blob?: Blob };
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;

    public isVoucherDownloading: boolean = false;
    public isVoucherDownloadError: boolean = false;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';

    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _toasty: ToasterService,
        private _proformaService: ProformaService,
        private _receiptService: ReceiptService,
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService
    ) { }

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
            let accountUniqueName: string = this.selectedItem?.uniqueName;

            this._receiptService.DownloadVoucher(model, accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                if (result) {
                    this.selectedItem.blob = result;
                    const file = new Blob([result], { type: 'application/pdf' });
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                    setTimeout(() => {
                        this.printVoucher();
                    });
                    this.isVoucherDownloadError = false;
                } else {
                    this.isVoucherDownloadError = true;
                    this._toasty.errorToast(this.commonLocaleData?.app_something_went_wrong);
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
            request.accountUniqueName = this.selectedItem?.uniqueName;

            if (this.voucherType === VoucherTypeEnum.generateProforma) {
                request.proformaNumber = this.selectedItem?.voucherNumber;
            } else {
                request.estimateNumber = this.selectedItem?.voucherNumber;
            }

            this._proformaService.download(request, this.voucherType).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                if (result && result.status === 'success') {
                    let blob: Blob = this.generalService.base64ToBlob(result.body, 'application/pdf', 512);
                    const file = new Blob([blob], { type: 'application/pdf' });
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                    setTimeout(() => {
                        this.printVoucher();
                    });
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
        if (this.pdfContainer) {
            const window = this.pdfContainer?.nativeElement?.contentWindow;
            if (window) {
                window.focus();
                setTimeout(() => {
                    window.print();
                }, 200);
            }
        }
    }

    /**
     * Releases memory
     *
     * @memberof ProformaPrintInPlaceComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
