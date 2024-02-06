import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VoucherTypeEnum } from '../utility/vouchers.const';

@Component({
    selector: 'print-voucher',
    templateUrl: './print-voucher.component.html',
    styleUrls: ['./print-voucher.component.scss']
})
export class PrintVoucherComponent implements OnInit {
    /* This will hold voucher type */
    @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
    /* This will hold selected items from voucher*/
    @Input() public selectedItem: { voucherNumber: string, uniqueName: string, blob?: Blob, voucherUniqueName?: string };
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Emitter for cancel event */
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** True if voucher is downloading  */
    public isVoucherDownloading: boolean = false;
    /** True if voucher download error  */
    public isVoucherDownloadError: boolean = false;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor() { }

    public ngOnInit():void { 
        console.log(this.voucherType, this.selectedItem, this.localeData, this.commonLocaleData)
    }
}
