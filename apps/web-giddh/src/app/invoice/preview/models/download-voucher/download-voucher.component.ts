import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { saveAs } from 'file-saver';
import { InvoiceService } from '../../../../services/invoice.service';
import { ToasterService } from '../../../../services/toaster.service';
import { InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';

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
    public invoiceType: string[] = ['Original'];
    /** True, when original copy is to be downloaded */
    public isOriginal: boolean = true;
    public isTransport: boolean = false;
    public isCustomer: boolean = false;
    public isProformaEstimatesInvoice: boolean = false;
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _invoiceService: InvoiceService, 
        private _toaster: ToasterService, 
        private generalService: GeneralService
    ) {

    }

    ngOnInit() {
        this.isProformaEstimatesInvoice = (this.selectedItem) ? [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.selectedItem.voucherType) : false;
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
        // as discussed with backend team voucherType will never be cash, It will be sales always for download vouchers
        let voucherType = this.selectedItem && this.selectedItem.voucherType === 'cash' ? 'sales' : this.selectedItem.voucherType;
        let dataToSend = {
            voucherNumber: [this.selectedItem.voucherNumber],
            typeOfInvoice: this.invoiceType,
            voucherType: voucherType,
            uniqueName: undefined
        };

        if(this.generalService.voucherApiVersion === 2) {
            dataToSend.uniqueName = this.selectedItem.uniqueName;
        }

        this._invoiceService.DownloadInvoice(this.selectedItem.account.uniqueName, dataToSend).pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res?.status !== "error") {
                    if (dataToSend.typeOfInvoice.length > 1) {
                        saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                    } else {
                        saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                    }
                    this.cancel();
                } else {
                    this._toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this._toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
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
