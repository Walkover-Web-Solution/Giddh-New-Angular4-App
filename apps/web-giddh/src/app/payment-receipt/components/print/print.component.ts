import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DownloadVoucherRequest } from '../../../models/api-models/recipt';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit, OnDestroy {
    @Input() public selectedItem: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This will emit boolean on cancel */
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** True if voucher download in progress */
    public isVoucherDownloading: boolean = false;
    /** True if voucher download has error */
    public isVoucherDownloadError: boolean = false;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private toaster: ToasterService,
        private commonService: CommonService,
        private domSanitizer: DomSanitizer,
        private changeDetectionRef: ChangeDetectorRef
    ) { }

    /**
     * Initializes the component
     *
     * @memberof PrintComponent
     */
    public ngOnInit(): void {
        if (this.selectedItem) {
            this.downloadVoucher();
        }
    }

    /**
     * Downloads the voucher
     *
     * @memberof PrintComponent
     */
    public downloadVoucher(): void {
        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;

        let model: DownloadVoucherRequest = {
            voucherType: this.selectedItem?.type,
            uniqueName: this.selectedItem?.uniqueName
        };

        this.commonService.downloadFile(model, "VOUCHER", "pdf").pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                if (result.status === "success") {
                    this.selectedItem.blob = result;
                    const file = new Blob([result], { type: 'application/pdf' });
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                    setTimeout(() => {
                        this.printVoucher();
                        this.changeDetectionRef.detectChanges();
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
            this.changeDetectionRef.detectChanges();
        }, (err) => {
            this.toaster.showSnackBar("error", err.message);
            this.isVoucherDownloading = false;
            this.isVoucherDownloadError = true;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Prints the voucher
     *
     * @memberof PrintComponent
     */
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
