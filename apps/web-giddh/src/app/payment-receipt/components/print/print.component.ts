import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DownloadVoucherRequest } from '../../../models/api-models/recipt';
import { VoucherTypeEnum } from '../../../models/api-models/Sales';
import { ToasterService } from '../../../services/toaster.service';
import { ReceiptService } from '../../../services/receipt.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss']
})

export class PrintComponent implements OnInit, OnDestroy {
    @Input() public selectedItem: any;
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
        private toaster: ToasterService,
        private receiptService: ReceiptService,
        private domSanitizer: DomSanitizer
    ) { }

    public ngOnInit(): void {
        if (this.selectedItem) {
            this.downloadVoucher();
        }
    }

    public downloadVoucher(): void {
        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;

        let model: DownloadVoucherRequest = {
            voucherType: this.selectedItem?.type,
            voucherNumber: [this.selectedItem.number],
            uniqueName: this.selectedItem.uniqueName
        };

        this.receiptService.DownloadVoucher(model, this.selectedItem?.account?.uniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                if(result.status === "success") {
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
                    this.toaster.showSnackBar("error", result.message);
                }
            } else {
                this.isVoucherDownloadError = true;
                this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
            }
            this.isVoucherDownloading = false;
        }, (err) => {
            this.toaster.showSnackBar("error", err.message);
            this.isVoucherDownloading = false;
            this.isVoucherDownloadError = true;
        });
    }

    public printVoucher(): void {
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
     * @memberof PrintComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
