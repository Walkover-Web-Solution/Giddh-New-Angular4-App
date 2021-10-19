import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { InvoiceReceiptActions } from "../../../actions/invoice/receipt/receipt.actions";
import { VoucherTypeEnum } from "../../../models/api-models/Sales";
import { GeneralService } from "../../../services/general.service";
import { ReceiptService } from "../../../services/receipt.service";
import { AppState } from "../../../store";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() public voucherType: string;
    @Input() public allVouchers: any[] = [];
    @Input() public params: any;
    /* Search element */
    @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview') attachedDocumentPreview: ElementRef;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /* This will hold the filtered orders */
    public filteredData: any[] = [];
    /* This will hold if pdf preview loaded */
    public pdfPreviewLoaded: boolean = false;
    /* This will hold if pdf preview has error */
    public pdfPreviewHasError: boolean = false;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /** Holds receipt voucher type */
    public receiptVoucherType: string = VoucherTypeEnum.receipt;
    /** Holds payment voucher type */
    public paymentVoucherType: string = VoucherTypeEnum.payment;
    public search: any = "";
    public search$: ReplaySubject<any> = new ReplaySubject(1);
    /* This will hold if it's loading or not */
    public isLoading: boolean = false;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if left sidebar is expanded */
    private isSidebarExpanded: boolean = false;
    public voucherDetails: any;
    /** Stores the BLOB of attached document */
    private attachedDocumentBlob: Blob;

    constructor(
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private invoiceReceiptAction: InvoiceReceiptActions,
        private receiptService: ReceiptService,
        private changeDetectionRef: ChangeDetectorRef
    ) {

    }

    public ngOnInit(): void {
        if (document.getElementsByClassName("sidebar-collapse")?.length > 0) {
            this.isSidebarExpanded = false;
        } else {
            this.isSidebarExpanded = true;
            this.generalService.collapseSidebar();
        }
        document.querySelector('body').classList.add('setting-sidebar-open');

        if (this.allVouchers) {
            this.filteredData = this.allVouchers;
        }

        this.store.pipe(select(state => { return state.receipt.voucher as any; }), takeUntil(this.destroyed$)).subscribe(response => {
            this.voucherDetails = response;
        });

        this.getVoucherDetails();
        this.getPdf();
    }

    public ngOnDestroy(): void {
        if (this.isSidebarExpanded) {
            this.isSidebarExpanded = false;
            this.generalService.expandSidebar();
        }
        document.querySelector('body').classList.remove('setting-sidebar-open');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.allVouchers?.currentValue) {
            this.filteredData = changes.allVouchers.currentValue;
        }

        if (changes?.params?.currentValue && changes?.params?.currentValue !== this.params) {
            if (changes?.params?.currentValue?.uniqueName) {
                this.getVoucherDetails();
            }
            this.getPdf();
        }

        console.log(this.params);
    }

    /**
     * This will get called after component has initialized
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public ngAfterViewInit(): void {
        this.search$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((term => {
            this.filterVoucher(this.search);
        }));
    }

    /**
     * This will filter the purchase orders
     *
     * @param {*} term
     * @memberof PurchaseOrderPreviewComponent
     */
    public filterVoucher(term: any): void {
        this.search = term;
        this.filteredData = this.allVouchers.filter(item => {
            return item.voucherNumber.toLowerCase().includes(term.toLowerCase()) ||
                item.account.name.toLowerCase().includes(term.toLowerCase()) ||
                item.voucherDate.includes(term) ||
                item.grandTotal.amountForAccount.toString().includes(term);
        });
    }

    /**
     * This will get pdf preview
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public getPdf(): void {
        let model = {
            voucherType: this.voucherType,
            uniqueName: this.params.uniqueName
        };

        this.receiptService.DownloadVoucher(model, this.params.accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                let blob: Blob = this.generalService.base64ToBlob(response.body, 'application/pdf', 512);
                this.attachedDocumentBlob = blob;
                const file = new Blob([blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                this.pdfPreviewLoaded = true;
                this.changeDetectionRef.detectChanges();
            } else {
                this.pdfPreviewHasError = true;
            }
        });
    }

    private getVoucherDetails(): void {
        this.store.dispatch(this.invoiceReceiptAction.getVoucherDetailsV4(this.params.accountUniqueName, {
            voucherType: this.voucherType,
            uniqueName: this.params.uniqueName
        }));
    }

    /**
     * This will download the pdf
     *
     * @returns {void}
     * @memberof PurchaseOrderPreviewComponent
     */
    public downloadFile(): void {
        if (this.pdfPreviewHasError || !this.pdfPreviewLoaded) {
            return;
        }
        saveAs(this.attachedDocumentBlob, this.localeData?.download_po_filename);
    }

    /**
     * This will print the voucher
     *
     * @returns {void}
     * @memberof PurchaseOrderPreviewComponent
     */
    public printVoucher(): void {
        if (this.pdfPreviewHasError || !this.pdfPreviewLoaded) {
            return;
        }
        if (this.pdfContainer) {
            const window = this.pdfContainer?.nativeElement?.contentWindow;
            if (window) {
                window.focus();
                setTimeout(() => {
                    window.print();
                }, 200);
            }
        } else if (this.attachedDocumentPreview) {
            const windowWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth
                || 0;
            const left = (windowWidth / 2) - 450;
            const printWindow = window.open('', '', `left=${left},top=0,width=900,height=900`);
            printWindow.document.write((this.attachedDocumentPreview?.nativeElement as HTMLElement).innerHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }
}