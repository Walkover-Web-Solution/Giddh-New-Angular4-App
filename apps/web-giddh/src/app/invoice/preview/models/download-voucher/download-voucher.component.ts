import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { saveAs } from 'file-saver';
import { InvoiceService } from '../../../../services/invoice.service';
import { ToasterService } from '../../../../services/toaster.service';
import { InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';

@Component({
    selector: 'download-voucher',
    templateUrl: './download-voucher.component.html'
})
export class DownloadVoucherComponent implements OnInit, OnDestroy {
    @Input() public selectedItem: InvoicePreviewDetailsVm;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public invoiceType: string[] = [];
    /** True, when original copy is to be downloaded */
    public isOriginal: boolean = false;
    public isTransport: boolean = false;
    public isCustomer: boolean = false;
    /** True if attachment is checked */
    public isAttachment: boolean = false;
    public isProformaEstimatesInvoice: boolean = false;
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private invoiceService: InvoiceService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private commonService: CommonService
    ) {

    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        if (this.voucherApiVersion === 2) {
            this.isOriginal = true;
            this.invoiceType.push('Original');
        }

        this.isProformaEstimatesInvoice = (this.selectedItem) ? [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.selectedItem?.voucherType) : false;
    }

    public invoiceTypeChanged(event): void {
        let val = event.target.value;
        if (event.target.checked) {
            this.invoiceType.push(val);
        } else {
            this.invoiceType = this.invoiceType?.filter(f => f !== val);
        }
    }

    public onDownloadInvoiceEvent(): void {
        // as discussed with backend team voucherType will never be cash, It will be sales always for download vouchers
        let voucherType = this.selectedItem && this.selectedItem.voucherType === VoucherTypeEnum.cash ? VoucherTypeEnum.sales : this.selectedItem?.voucherType;

        if (this.generalService.voucherApiVersion === 2) {
            let dataToSend = {
                copyTypes: this.invoiceType,
                voucherType: voucherType,
                uniqueName: this.selectedItem?.uniqueName
            };

            let downloadOption = "";
            let fileType = "pdf";
            if (this.isAttachment) {
                if (this.invoiceType?.length > 0) {
                    downloadOption = "ALL";
                } else {
                    downloadOption = "ATTACHMENT";
                    fileType = "base64";
                }
            } else {
                downloadOption = "VOUCHER";
            }

            let voucherNumber = (this.selectedItem?.voucherNumber) ? this.selectedItem?.voucherNumber : this.commonLocaleData?.app_not_available;

            this.commonService.downloadFile(dataToSend, downloadOption, fileType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status !== "error") {
                    if (dataToSend.copyTypes?.length > 1 || this.isAttachment) {
                        if (fileType === "base64") {
                            saveAs((this.generalService.base64ToBlob(response.body.attachments[0].encodedData, '', 512)), response.body.attachments[0].name);
                        } else {
                            saveAs(response, `${voucherNumber}.` + 'zip');
                        }
                    } else {
                        saveAs(response, `${voucherNumber}.` + 'pdf');
                    }
                    this.cancel();
                } else {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }));
        } else {
            let dataToSend = {
                voucherNumber: [this.selectedItem.voucherNumber],
                typeOfInvoice: this.invoiceType,
                voucherType: voucherType
            };

            this.invoiceService.DownloadInvoice(this.selectedItem.account?.uniqueName, dataToSend).pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    if (res?.status !== "error") {
                        if (dataToSend.typeOfInvoice?.length > 1) {
                            saveAs(res, `${this.selectedItem.voucherNumber}.` + 'zip');
                        } else {
                            saveAs(res, `${this.selectedItem.voucherNumber}.` + 'pdf');
                        }
                        this.cancel();
                    } else {
                        this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                    }
                }, (error => {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }));
        }
    }

    public resetModal(): void {
        this.invoiceType = [];
        this.isTransport = false;
        this.isCustomer = false;
    }

    public cancel(): void {
        this.resetModal();
        this.cancelEvent.emit(true);
    }

    /**
     * Releases memory
     *
     * @memberof DownloadVoucherComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
