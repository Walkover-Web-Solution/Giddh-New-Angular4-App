import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { InvoiceActions } from "../../../actions/invoice/invoice.actions";
import { InvoiceReceiptActions } from "../../../actions/invoice/receipt/receipt.actions";
import { FILE_ATTACHMENT_TYPE } from "../../../app.constant";
import { VoucherTypeEnum } from "../../../models/api-models/Sales";
import { CommonService } from "../../../services/common.service";
import { GeneralService } from "../../../services/general.service";
import { ReceiptService } from "../../../services/receipt.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { ConfirmModalComponent } from "../../../theme/new-confirm-modal/confirm-modal.component";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    /** Holds voucher type */
    @Input() public voucherType: string;
    /** List of all vouchers */
    @Input() public allVouchers: any[] = [];
    /** Voucher params */
    @Input() public params: any;
    /* Search element */
    @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview') attachedDocumentPreview: ElementRef;
    /** Instance of send email modal */
    @ViewChild('sendEmail', { static: false }) public sendEmail: any;
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
    /** Holds receipt voucher type */
    public receiptVoucherType: string = VoucherTypeEnum.receipt;
    /** Holds payment voucher type */
    public paymentVoucherType: string = VoucherTypeEnum.payment;
    /** Holds search term */
    public search: any = "";
    /** Observable for search */
    public search$: ReplaySubject<any> = new ReplaySubject(1);
    /* This will hold if it's loading or not */
    public isLoading: boolean = false;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if left sidebar is expanded */
    private isSidebarExpanded: boolean = false;
    /** Holds selected voucher details */
    public voucherDetails: any;
    /** Stores the BLOB of attached document */
    private attachedDocumentBlob: Blob;
    /** Holds translation file */
    public translationFile: string = "";
    /** Stores the type of attached document */
    public attachedDocumentType: any;
    /** Source of image to be previewed */
    public imagePreviewSource: SafeUrl;
    /** Attached PDF file url created with blob */
    public attachedPdfFileUrl: any = '';
    /* This will hold if attachment is expanded */
    public isAttachmentExpanded: boolean = false;
    /** This will hold the attached file */
    private attachedAttachmentBlob: Blob;
    /** This will hold pdf and attachment */
    public selectedItem: any = {};

    constructor(
        private sanitizer: DomSanitizer,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private invoiceReceiptAction: InvoiceReceiptActions,
        private receiptService: ReceiptService,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private toaster: ToasterService,
        private route: Router,
        private invoiceAction: InvoiceActions,
        private commonService: CommonService
    ) {
        document.querySelector("body")?.classList.add("update-scroll-hidden");
    }

    /**
     * Initializes the component
     *
     * @memberof PreviewComponent
     */
    public ngOnInit(): void {
        if (this.voucherType === this.receiptVoucherType) {
            this.translationFile = "advance-receipt";
        } else if (this.voucherType === this.paymentVoucherType) {
            this.translationFile = "payment";
        }

        if (document.getElementsByClassName("sidebar-collapse")?.length > 0) {
            this.isSidebarExpanded = false;
        } else {
            this.isSidebarExpanded = true;
            this.generalService.collapseSidebar();
        }
        document.querySelector('body')?.classList?.add('setting-sidebar-open');

        if (this.allVouchers) {
            this.filteredData = this.allVouchers;
        }

        this.store.pipe(select(state => { return state.receipt.voucher as any; }), takeUntil(this.destroyed$)).subscribe(response => {
            this.voucherDetails = response;
            this.changeDetectionRef.detectChanges();
        });

        this.getVoucherDetails();
        this.getPdf();
    }

    /**
     * Releases the memory
     *
     * @memberof PreviewComponent
     */
    public ngOnDestroy(): void {
        if (this.isSidebarExpanded) {
            this.isSidebarExpanded = false;
            this.generalService.expandSidebar();
        }
        document.querySelector("body")?.classList.remove("update-scroll-hidden");
        document.querySelector('body')?.classList.remove('setting-sidebar-open');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Updates the data if input value changes
     *
     * @param {SimpleChanges} changes
     * @memberof PreviewComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.allVouchers?.currentValue) {
            this.filteredData = changes.allVouchers.currentValue;
        }

        if (changes?.params?.currentValue && !changes?.params?.firstChange && changes?.params?.currentValue !== changes?.params?.previousValue) {
            if (changes?.params?.currentValue?.uniqueName) {
                this.getVoucherDetails();
            }
            this.getPdf();
        }
    }

    /**
     * This will get called after component has initialized
     *
     * @memberof PreviewComponent
     */
    public ngAfterViewInit(): void {
        this.search$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((term => {
            this.filterVoucher(term);
            this.changeDetectionRef.detectChanges();
        }));
    }

    /**
     * This will filter the vouchers
     *
     * @param {*} term
     * @memberof PreviewComponent
     */
    public filterVoucher(term: any): void {
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
     * @memberof PreviewComponent
     */
    public getPdf(): void {
        let model = {
            voucherType: this.voucherType,
            uniqueName: this.params.uniqueName
        };

        if (!this.selectedItem) {
            this.selectedItem.hasAttachment = false;
        }
        this.isAttachmentExpanded = false;
        this.attachedAttachmentBlob = null;
        this.attachedDocumentType = {};

        this.commonService.downloadFile(model, "ALL").pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.pdfPreviewLoaded = true;

            if (result?.body) {
                if (result.body.data) {
                    /** Creating voucher pdf start */
                    this.selectedItem.blob = this.generalService.base64ToBlob(result.body.data, 'application/pdf', 512);
                    const file = new Blob([this.selectedItem.blob], { type: 'application/pdf' });
                    this.attachedDocumentBlob = file;
                    let pdfFileURL;
                    URL.revokeObjectURL(pdfFileURL);
                    pdfFileURL = URL.createObjectURL(file);
                    this.sanitizedPdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfFileURL);
                    this.pdfPreviewHasError = false;
                    /** Creating voucher pdf finish */
                } else {
                    this.pdfPreviewHasError = true;
                }

                if (result.body.attachments?.length > 0) {
                    /** Creating attachment start */
                    this.selectedItem.hasAttachment = true;
                    this.isAttachmentExpanded = false;
                    const fileExtention = result.body.attachments[0].type.toLowerCase();
                    if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                        // Attached file type is image
                        this.attachedAttachmentBlob = this.generalService.base64ToBlob(result.body.attachments[0].encodedData, `image/${fileExtention}`, 512);
                        let objectURL = `data:image/${fileExtention};base64,` + result.body.attachments[0].encodedData;
                        this.imagePreviewSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        this.attachedDocumentType = { name: result.body.attachments[0].name, type: 'image', value: fileExtention };
                    } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                        // Attached file type is PDF
                        this.attachedDocumentType = { name: result.body.attachments[0].name, type: 'pdf', value: fileExtention };
                        this.attachedAttachmentBlob = this.generalService.base64ToBlob(result.body.attachments[0].encodedData, 'application/pdf', 512);
                        setTimeout(() => {
                            const file = new Blob([this.attachedAttachmentBlob], { type: 'application/pdf' });
                            let pdfFileURL;
                            URL.revokeObjectURL(pdfFileURL);
                            pdfFileURL = URL.createObjectURL(file);
                            this.attachedPdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfFileURL);
                            this.changeDetectionRef.detectChanges();
                        }, 250);
                    } else {
                        // Unsupported type
                        this.attachedAttachmentBlob = this.generalService.base64ToBlob(result.body.attachments[0].encodedData, '', 512);
                        this.attachedDocumentType = { name: result.body.attachments[0].name, type: 'unsupported', value: fileExtention };
                    }
                    /** Creating attachment finish */
                }
                this.changeDetectionRef.detectChanges();
            } else {
                this.pdfPreviewHasError = true;
                this.toaster.showSnackBar("error", result?.message ?? this.commonLocaleData?.app_something_went_wrong);
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Gets voucher details
     *
     * @private
     * @memberof PreviewComponent
     */
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
     * @memberof PreviewComponent
     */
    public downloadPdf(): void {
        if (this.pdfPreviewHasError || !this.pdfPreviewLoaded) {
            return;
        }
        saveAs(this.attachedDocumentBlob, this.voucherType + '-' + this.voucherDetails?.number + '.pdf');
    }

    /**
     * This will download the attachment
     *
     * @returns {void}
     * @memberof PreviewComponent
     */
    public downloadFile(): void {
        if (!this.selectedItem?.hasAttachment) {
            return;
        }
        saveAs(this.attachedAttachmentBlob, this.attachedDocumentType?.name);
    }

    /**
     * This will print the voucher
     *
     * @returns {void}
     * @memberof PreviewComponent
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

    /**
     * Deletes the voucher
     *
     * @memberof PreviewComponent
     */
    public deleteVoucher(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirm,
                body: this.localeData?.delete_voucher,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                let model = {
                    uniqueName: this.voucherDetails?.uniqueName,
                    voucherType: this.voucherType
                }
                this.receiptService.DeleteReceipt(this.voucherDetails.account?.uniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === 'success') {
                        this.toaster.showSnackBar("success", response.body);
                        this.route.navigate(["/pages/reports/" + this.voucherType]);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Opens send email modal
     *
     * @memberof PreviewComponent
     */
    public openSendEmailModal(): void {
        this.dialog.open(this.sendEmail, {
            width: '500px'
        });
    }

    /**
     * Sends the selected download copy of vouchers
     *
     * @param {*} event
     * @memberof PreviewComponent
     */
    public sendVoucherEmail(event: any): void {
        if (event) {
            this.store.dispatch(this.invoiceAction.SendInvoiceOnMail(this.voucherDetails?.account?.uniqueName, {
                emailId: event.email?.split(','),
                voucherNumber: [this.voucherDetails?.number],
                voucherType: this.voucherDetails?.type,
                typeOfInvoice: event.downloadCopy ? event.downloadCopy : [],
                uniqueName: this.voucherDetails?.uniqueName
            }));
        }
    }
}