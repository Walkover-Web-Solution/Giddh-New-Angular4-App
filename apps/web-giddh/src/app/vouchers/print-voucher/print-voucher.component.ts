import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProformaDownloadRequest } from '../../models/api-models/proforma';
import { DownloadVoucherRequest } from '../../models/api-models/recipt';
import { CommonService } from '../../services/common.service';
import { GeneralService } from '../../services/general.service';
import { ProformaService } from '../../services/proforma.service';
import { ReceiptService } from '../../services/receipt.service';
import { ToasterService } from '../../services/toaster.service';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { VoucherComponentStore } from '../utility/vouchers.store';

@Component({
    selector: 'print-voucher',
    templateUrl: './print-voucher.component.html',
    styleUrls: ['./print-voucher.component.scss']
})
export class PrintVoucherComponent implements OnInit {
    /** Emit the cancel dialog event */
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Hold invoice type */
    @Input() public invoiceType: any;
    /** Hold voucher type */
    @Input() public voucherType: any;
    /** Hold selected item from voucher */
    @Input() public selectedItem: { voucherNumber: string, uniqueName: string, blob?: Blob, voucherUniqueName?: string };
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if voucher is downloading */
    public isVoucherDownloading: boolean = false;
    /** True if download voucher is getting error */
    public isVoucherDownloadError: boolean = false;

    constructor(
        private toaster: ToasterService,
        private proformaService: ProformaService,
        private receiptService: ReceiptService,
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService,
        private commonService: CommonService,
        private componentStore: VoucherComponentStore
    ) { }

    /**
     * Hook cycle for component initialization 
     *
     * @memberof PrintVoucherComponent
     */
    public ngOnInit(): void {
        if (this.selectedItem) {
            this.downloadVoucher('base64');
        }
    }

    /**
     * This will be use for print voucher 
     *
     * @memberof PrintVoucherComponent
     */
    public printVoucher(): void {
        if (this.pdfContainer) {
            this.componentStore.printVoucher(this.pdfContainer);
        }
    }

    /**
     * This will be use for download voucher
     *
     * @param {string} [fileType='']
     * @memberof PrintVoucherComponent
     */
    public downloadVoucher(fileType: string = ''): void {
        this.setLoadingState(true);
        this.isVoucherDownloadError = false;

        if (!this.invoiceType.isEstimateInvoice && !this.invoiceType.isProformaInvoice) {
            this.downloadVoucherType1();
        } else if (this.invoiceType.isSalesInvoice) {
            this.downloadVoucherType2();
        } else {
            this.downloadVoucherType3(fileType);
        }
    }

    /**
     * This will be call where there is not estimate voucher and proforma voucher
     *
     * @private
     * @memberof PrintVoucherComponent
     */
    private downloadVoucherType1(): void {
        let getRequest = {
            voucherType: this.voucherType,
            uniqueName: this.selectedItem.voucherUniqueName
        };

        this.sanitizedPdfFileUrl = null;
        this.commonService.downloadFile(getRequest, "VOUCHER").pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result && result.status === 'success') {
                this.selectedItem.blob = this.generalService.base64ToBlob(result.body?.data, 'application/pdf', 512);
                const file = new Blob([this.selectedItem.blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                this.setVoucherDownloadErrorState(false);

                setTimeout(() => {
                    this.printVoucher();
                });
            } else {
                this.setVoucherDownloadErrorState(true);
                this.handleError(this.commonLocaleData?.app_something_went_wrong);
            }
            this.setLoadingState(false)
        }, (err) => {
            this.setLoadingState(false)
            this.setVoucherDownloadErrorState(true);
        });
    }

    /**
     * This will be use for where voucher type is sales
     *
     * @private
     * @memberof PrintVoucherComponent
     */
    private downloadVoucherType2(): void {
        let model: DownloadVoucherRequest = {
            voucherType: this.voucherType,
            voucherNumber: [this.selectedItem.voucherNumber]
        };
        let accountUniqueName: string = this.selectedItem?.uniqueName;

        this.receiptService.DownloadVoucher(model, accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result && result.status === 'success') {
                this.selectedItem.blob = result;
                const file = new Blob([result], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                setTimeout(() => {
                    this.printVoucher();
                });
                this.setVoucherDownloadErrorState(false);
            } else {
                this.setVoucherDownloadErrorState(true);
                this.handleError(this.commonLocaleData?.app_something_went_wrong);
            }
            this.setLoadingState(false)
        }, (err) => {
            this.setLoadingState(false)
            this.handleError(err.message);
            this.setVoucherDownloadErrorState(true);

        });
    }

    /**
     * This will be called when the proforma voucher are selected
     *
     * @private
     * @param {*} fileType
     * @memberof PrintVoucherComponent
     */
    private downloadVoucherType3(fileType: any): void {
        let request: ProformaDownloadRequest = new ProformaDownloadRequest();
        request.fileType = fileType;
        request.accountUniqueName = this.selectedItem?.uniqueName;

        let voucherType = "";

        if (this.invoiceType.isProformaInvoice) {
            voucherType = VoucherTypeEnum.generateProforma;
            request.proformaNumber = this.selectedItem?.voucherNumber;
        } else {
            voucherType = VoucherTypeEnum.generateEstimate;
            request.estimateNumber = this.selectedItem?.voucherNumber;
        }

        this.proformaService.download(request, voucherType).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result && result.status === 'success') {
                let blob: Blob = this.generalService.base64ToBlob(result.body, 'application/pdf', 512);
                const file = new Blob([blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                setTimeout(() => {
                    this.printVoucher();
                });
                this.setVoucherDownloadErrorState(false);
            } else {
                this.handleError(result.message + ' ' + result.code);
                this.setVoucherDownloadErrorState(true);
            }
            this.setLoadingState(false)

        }, (err) => {
            this.handleError(err.message);
            this.setLoadingState(false)
            this.setVoucherDownloadErrorState(true);
        });
    }

    /**
     * This will be use for hanlde api error
     *
     * @private
     * @param {*} error
     * @memberof PrintVoucherComponent
     */
    private handleError(error: any): void {
        this.toaster.showSnackBar('error', error);
    }

    /**
     * THis will be used for set loading state
     *
     * @private
     * @param {boolean} isLoading
     * @memberof PrintVoucherComponent
     */
    private setLoadingState(isLoading: boolean): void {
        this.isVoucherDownloading = isLoading;
    }

    /**
     * This will be use for set voucher download error
     *
     * @private
     * @param {boolean} isError
     * @memberof PrintVoucherComponent
     */
    private setVoucherDownloadErrorState(isError: boolean): void {
        this.isVoucherDownloadError = isError;
    }


    /**
     * Releases memory
     *
     * @memberof PrintVoucherComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
