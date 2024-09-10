import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, delay, distinctUntilChanged, Observable, ReplaySubject, Subject, takeUntil } from "rxjs";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { VoucherTypeEnum } from "../utility/vouchers.const";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { FILE_ATTACHMENT_TYPE, PAGINATION_LIMIT } from "../../app.constant";
import { cloneDeep } from "../../lodash-optimized";
import { FormControl } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { ProformaDownloadRequest, ProformaGetRequest, ProformaVersionItem } from "../../models/api-models/proforma";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { CommonService } from "../../services/common.service";
import { ThermalService } from "../../services/thermal.service";
import { InvoiceTemplatesService } from "../../services/invoice.templates.service";
import { ToasterService } from "../../services/toaster.service";
import { DownloadVoucherRequest } from "../../models/api-models/recipt";
import { ReceiptService } from "../../services/receipt.service";
import { ProformaService } from "../../services/proforma.service";
import { PurchaseRecordService } from "../../services/purchase-record.service";
import { VoucherPreviewComponentStore } from "../utility/vouhcers-preview.store";
import { PurchaseOrderService } from "../../services/purchase-order.service";
import { SalesService } from "../../services/sales.service";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    providers: [VoucherComponentStore, VoucherPreviewComponentStore]
})
export class VouchersPreviewComponent implements OnInit, OnDestroy {
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Instance of cdk scrollbar */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    // /**  */
    // @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    /**  */
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    /**  */
    @ViewChild('historyAsideDialog', { static: true }) public historyAsideDialog: TemplateRef<any>;
    /** Holds send email dailog template reference send email */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /** Holds Payment template reference */
    @ViewChild('paymentDialog', { static: true }) public paymentDialog: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** */
    public isVoucherDownloading$: Observable<boolean> = this.componentStorePreview.select(state => state.isVoucherDownloading);
    /** */
    public isVoucherDownloadError$: Observable<boolean> = this.componentStorePreview.select(state => state.isVoucherDownloadError);

    /** Last vouchers get in progress Observable */
    public getVouchersInProgress$: Observable<any> = this.componentStoreVoucher.getLastVouchersInProgress$;


    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold day js reference */
    public dayjs = dayjs;

    /** Holds advance Filters keys */
    public advanceFilters: any = {};
    /**  */
    public search: FormControl = new FormControl('');
    /**  */
    public invoiceList: any[];
    /**  */
    public filteredInvoiceList$: Subject<any[]> = new Subject<any[]>();
    /**  */
    public selectedInvoice: any;
    /** Hold invoice  type */
    public voucherType: any = '';
    /** Holds Total Results Count */
    public totalResults: number = 0;
    /**  */
    public params: any = {};
    /**  */
    public showPaymentDetails: boolean;
    /**  */
    public isCompany: boolean;
    public createNewVoucher: any = {
        text: '',
        link: ''
    };
    /** Holds invoice type */
    public invoiceType: any = {
        isSalesInvoice: true,
        isCashInvoice: false,
        isCreditNote: false,
        isDebitNote: false,
        isPurchaseInvoice: false,
        isProformaInvoice: false,
        isEstimateInvoice: false,
        isPurchaseOrder: false,
        isReceiptInvoice: false,
        isPaymentInvoice: false
    };
    /** Send Email Dialog Ref */
    public sendEmailModalDialogRef: MatDialogRef<any>;

    //============================
    /**  */
    public showEditMode: boolean = false;
    /**  */
    public isSendSmsEnabled: boolean = false;
    /**  */
    public isVoucherDownloading: boolean = false;
    /**  */
    public isVoucherDownloadError: boolean = false;
    /**  */
    public only4ProformaEstimates: boolean;
    /**  */
    public emailList: string = '';
    /**  */
    public moreLogsDisplayed: boolean = true;
    /**  */
    public voucherVersions: ProformaVersionItem[] = [];
    /**  */
    public filteredVoucherVersions: ProformaVersionItem[] = [];
    /**  */
    public invoiceDetailWrapperHeight: number;
    /**  */
    public invoiceDetailViewHeight: number;
    /**  */
    public invoiceImageSectionViewHeight: number;
    /**  */
    public isMobileView = false;
    /**  */
    public sessionKey$: Observable<string>;
    /**  */
    public companyName$: Observable<string>;
    /**  */
    public isFileUploading: boolean = false;
    /** True, if attachment upload is to be displayed */
    public shouldShowUploadAttachment: boolean = false;
    /** Source of image to be previewed */
    public imagePreviewSource: SafeUrl;
    /** Stores the type of attached document for Purchase Record */
    public attachedDocumentType: any;
    /** Stores the BLOB of attached document */
    private attachedDocumentBlob: Blob;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: SafeUrl = null;
    /** Attached PDF file url created with blob */
    public attachedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: string = '';
    /** This will hold the attached file in Purchase Bill */
    private attachedAttachmentBlob: Blob;
    /** This will use for default template */
    public thermalTemplate: any;
    /** Holds selected item voucher */
    private selectedItemVoucher: any;
    /** True if pdf is available */
    public isPdfAvailable: boolean = true;
    /** False if template type is thermal */
    public showDownloadButton: boolean = true;
    /** To check is selected account/customer have advance receipts */
    public isAccountHaveAdvanceReceipts: boolean = false;
    /* This will hold revision history aside popup state */
    public revisionHistoryAsideState: string = 'out';
    /* This will hold company unique name */
    public companyUniqueName: string = '';
    /* This will hold PO numbers */
    public purchaseOrderNumbers: any[] = [];
    /* This will hold po unique name for preview */
    public purchaseOrderPreviewUniqueName: string = '';
    /* Send email request params object */
    public sendEmailRequest: any = {};
    /* This will hold if pdf preview loaded */
    public pdfPreviewLoaded: boolean = false;
    /* This will hold if pdf preview has error */
    public pdfPreviewHasError: boolean = false;
    // ============================

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private componentStoreVoucher: VoucherComponentStore,
        private componentStorePreview: VoucherPreviewComponentStore,
        private activatedRoute: ActivatedRoute,
        private vouchersUtilityService: VouchersUtilityService,
        private generalService: GeneralService,
        private sanitizer: DomSanitizer,
        private domSanitizer: DomSanitizer,
        private commonService: CommonService,
        private thermalService: ThermalService,
        private invoiceTemplatesService: InvoiceTemplatesService,
        private purchaseRecordService: PurchaseRecordService,
        private purchaseOrderService: PurchaseOrderService,
        private proformaService: ProformaService,
        private receiptService: ReceiptService,
        private salesService: SalesService,
        private toaster: ToasterService,
        private changeDetection: ChangeDetectorRef,
    ) {

        this.advanceFilters = {
            sortBy: '',
            sort: '',
            // from: dayjs(this.selectedDateRange?.startDate).format(GIDDH_DATE_FORMAT) ?? '',
            // to: dayjs(this.selectedDateRange?.endDate).format(GIDDH_DATE_FORMAT) ?? '',
            page: 1,
            count: PAGINATION_LIMIT,
            q: ''
        };
    }


    /**
    * Initializes the component
    *
    * @memberof VouchersPreviewComponent
    */
    public ngOnInit(): void {
        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                console.log(params?.voucherType, params?.voucherUniqueName);
                this.params = params;
                this.voucherType = params?.voucherType;
                this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
                console.log("invoiceType", this.invoiceType);

                this.showPaymentDetails = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote].includes(this.voucherType);
                const lastVouchers = this.vouchersUtilityService?.lastVouchers;
                if (lastVouchers) {
                    this.invoiceList = lastVouchers;
                    this.filteredInvoiceList$.next(lastVouchers);
                    this.changeDetection.detectChanges();
                }
                if (!this.invoiceList?.length) {
                    this.getAllVouchers();
                } else {
                    this.setSelectedInvoice(params?.voucherUniqueName);
                }
                this.subscribeStoreObservable();
            }
        });
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;

        // this.filteredInvoiceList$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
        //     console.log("filteredInvoiceList$", data);
        // });

        this.search.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                const filterSearchResult = this.invoiceList.filter(item => item?.voucherNumber.toLowerCase().includes(search.toLowerCase()));
                this.filteredInvoiceList$.next(filterSearchResult);
                this.changeDetection.detectChanges();
            }
        })
    }

    public setSelectedInvoice(voucherUniqueName: string): void {
        this.selectedInvoice = this.invoiceList?.find(voucher => voucher?.uniqueName === voucherUniqueName);

        if (this.selectedInvoice && !this.isVoucherDownloading) {
            this.downloadVoucherPdf('base64');
        }
    }


    /**
     * Check voucher type and assign create new invoice text 
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private getCreateNewVoucherText(): void {
        switch (this.voucherType) {
            // case VoucherTypeEnum.sales:
            //     break;
            case VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate:
                this.createNewVoucher.text = this.localeData?.new_estimate;
                this.createNewVoucher.link = "/pages/vouchers/estimates/create";
                break;
            case VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma:
                this.createNewVoucher.text = this.localeData?.new_proforma;
                this.createNewVoucher.link = "/pages/vouchers/proformas/create";
                break;
            case VoucherTypeEnum.purchaseOrder:
                this.createNewVoucher.text = this.localeData?.new_order;
                this.createNewVoucher.link = "/pages/vouchers/purchase-order/create";
                break;
            // case VoucherTypeEnum.receipt:
            //     break;
            // case VoucherTypeEnum.payment:
            //     break;
            case VoucherTypeEnum.creditNote:
                this.createNewVoucher.text = this.localeData?.new_cr_note;
                this.createNewVoucher.link = "/pages/vouchers/credit-note/create";
                break;
            case VoucherTypeEnum.debitNote:
                this.createNewVoucher.text = this.localeData?.new_dr_note;
                this.createNewVoucher.link = "/pages/vouchers/debit-note/create";
                break;
            case VoucherTypeEnum.purchase:
                this.createNewVoucher.text = this.localeData?.new_bill;
                this.createNewVoucher.link = "/pages/vouchers/purchase/create";
                break;
        }
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof VouchersPreviewComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.getCreateNewVoucherText();
        }
    }

    /**
     *
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private subscribeStoreObservable(): void {
        this.componentStoreVoucher.lastVouchers$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.handleGetAllVoucherResponse(response);
        });

        this.componentStoreVoucher.purchaseOrdersList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.handleGetAllVoucherResponse(response);
        });

        this.componentStoreVoucher.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
            }
        });

        this.componentStorePreview.downloadVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.handleDownloadVoucherPdf(response);
            }
        });

        this.isVoucherDownloadError$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (typeof response === 'boolean') {
                this.isVoucherDownloadError = response;
            }
        });

        this.isVoucherDownloading$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (typeof response === 'boolean') {
                this.isVoucherDownloading = response;
            }
        });

        this.componentStoreVoucher.sendEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.sendEmailModalDialogRef?.close();
            }
        });

        this.componentStoreVoucher.actionVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.dialog.closeAll();
                this.toaster.showSnackBar("success", (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) ? this.localeData?.status_updated : this.commonLocaleData?.app_messages?.invoice_updated);
            }
        });
    }

    /**
     * Handle Download Voucher PDF response
     *
     * @private
     * @param {*} response
     * @memberof VouchersPreviewComponent
     */
    private handleDownloadVoucherPdf(response: any): void {
        if (response) {
            if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase].includes(this.voucherType)) {
                /** Creating voucher pdf start */
                if (response.data) {
                    this.isPdfAvailable = true;
                    this.selectedInvoice.blob = this.generalService.base64ToBlob(response.data, 'application/pdf', 512);
                    const file = new Blob([this.selectedInvoice.blob], { type: 'application/pdf' });
                    this.attachedDocumentBlob = file;
                    URL.revokeObjectURL(this.pdfFileURL);
                    this.pdfFileURL = URL.createObjectURL(file);

                    this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                    this.isVoucherDownloadError = false;
                    this.pdfPreviewLoaded = true;
                } else {
                    if (this.voucherType === 'purchase') {
                        this.pdfPreviewLoaded = false;
                    }
                    this.isPdfAvailable = false;
                }
                /** Creating voucher pdf finish */
                console.log("response", response);

                if (response.attachments?.length > 0) {
                    /** Creating attachment start */
                    if (this.selectedInvoice) {
                        this.selectedInvoice.hasAttachment = true;
                    }
                    const fileExtention = response.attachments[0].type?.toLowerCase();
                    if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                        // Attached file type is image
                        this.attachedAttachmentBlob = this.generalService.base64ToBlob(response.attachments[0].encodedData, `image/${fileExtention}`, 512);
                        let objectURL = `data:image/${fileExtention};base64,` + response.attachments[0].encodedData;
                        this.imagePreviewSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        this.attachedDocumentType = { name: response.attachments[0].name, type: 'image', value: fileExtention };
                        this.isVoucherDownloadError = false;
                    } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                        // Attached file type is PDF
                        this.attachedDocumentType = { name: response.attachments[0].name, type: 'pdf', value: fileExtention };
                        this.attachedAttachmentBlob = this.generalService.base64ToBlob(response.attachments[0].encodedData, 'application/pdf', 512);
                        setTimeout(() => {
                            if (this.selectedInvoice) {
                                this.selectedInvoice.blob = this.attachedAttachmentBlob;
                                const file = new Blob([this.attachedAttachmentBlob], { type: 'application/pdf' });
                                URL.revokeObjectURL(this.pdfFileURL);
                                this.pdfFileURL = URL.createObjectURL(file);
                                this.attachedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                            }
                        }, 250);
                        this.isVoucherDownloadError = false;
                    } else {
                        // Unsupported type
                        this.attachedAttachmentBlob = this.generalService.base64ToBlob(response.attachments[0].encodedData, '', 512);
                        this.attachedDocumentType = { name: response.attachments[0].name, type: 'unsupported', value: fileExtention };
                    }
                } else {
                    if (this.voucherType === VoucherTypeEnum.purchase) {
                        this.shouldShowUploadAttachment = true;
                    }
                }
                /** Creating attachment finish */
            } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(this.voucherType)) {
                let blob: Blob = this.generalService.base64ToBlob(response, 'application/pdf', 512);
                this.selectedInvoice.blob = blob;
                const file = new Blob([blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                let blob: Blob = this.generalService.base64ToBlob(response, 'application/pdf', 512);
                this.attachedDocumentBlob = blob;
                const file = new Blob([blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                this.pdfPreviewLoaded = true;
            }

        }
        else {
            this.pdfPreviewHasError = true;
            if (this.voucherType === VoucherTypeEnum.purchase) {
                this.shouldShowUploadAttachment = true;
            }
            // this.toaster.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong); =========== NEED TO CHECK THIS ===========
        }
    }

    /**
    * API Call Get All Vouchers
    *
    * @private
    * @memberof VouchersPreviewComponent
    */
    private getAllVouchers(): void {
        if (this.voucherType?.length) {
            if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                this.componentStoreVoucher.getPreviousProformaEstimates({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                this.componentStoreVoucher.getPurchaseOrders({ request: cloneDeep(this.advanceFilters) });
            } else {
                this.componentStoreVoucher.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            }
        }
    }

    /**
     * Download Voucher PDF
     *
     * @param {string} [fileType='']
     * @memberof VouchersPreviewComponent
     */
    public downloadVoucherPdf(fileType: string = ''): void {
        if (this.selectedInvoice) {
            this.isVoucherDownloading = true;
            this.isVoucherDownloadError = false;
            this.shouldShowUploadAttachment = false;
            this.attachedPdfFileUrl = null;
            this.imagePreviewSource = null;
            let getRequest: any;
            this.sanitizedPdfFileUrl = null;
            this.selectedInvoice.hasAttachment = false;
            const fileType = "base64";

            if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase].includes(this.voucherType)) {
                getRequest = {
                    voucherType: this.voucherType,
                    uniqueName: this.selectedInvoice?.uniqueName
                };
            } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(this.voucherType)) {
                getRequest = new ProformaDownloadRequest();
                getRequest.fileType = fileType;
                getRequest.accountUniqueName = this.selectedInvoice.account?.uniqueName;;

                if (this.voucherType === VoucherTypeEnum.generateProforma) {
                    getRequest.proformaNumber = this.selectedInvoice.voucherNumber;
                } else {
                    getRequest.estimateNumber = this.selectedInvoice.voucherNumber;
                }
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                getRequest = {
                    accountUniqueName: this.selectedInvoice?.vendor?.uniqueName,
                    poUniqueName: this.selectedInvoice?.uniqueName
                };
            }
            this.componentStorePreview.downloadVoucherPdf({ model: getRequest, type: "ALL", fileType: fileType, voucherType: this.voucherType });
        }
    }


    private getVoucherVersions(): void {
        const model = {
            getRequestObject: {
                page: 1,
                count: PAGINATION_LIMIT,
                accountUniqueName: this.selectedInvoice.account?.uniqueName ?? this.selectedInvoice?.vendor?.uniqueName,
                voucherUniqueName: this.selectedInvoice.uniqueName
            },
            postRequestObject: {},
            voucherType: this.voucherType
        }
        if (this.invoiceType.isPurchaseOrder) {
            model.postRequestObject = {
                purchaseNumber: '',
                uniqueName: ''
            }
        } else if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.generateEstimate) {
            model.postRequestObject[this.voucherType === VoucherTypeEnum.generateProforma ? 'proformaNumber' : 'estimateNumber'] = this.selectedInvoice?.voucherNumber;
        }

        this.componentStorePreview.getVoucherVersions({ ...model });
    }

    // adjust payment dialog
    public adjustPayment(): void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }

    // history dialog
    public toggleActivityHistoryAsidePane(): void {
        this.getVoucherVersions();
        this.dialog.open(this.historyAsideDialog, {
            position: {
                top: '0',
                right: '0'
            },
            maxWidth: 'var(--aside-pane-width)',
            width: '100%',
            height: '100vh',
            maxHeight: '100vh'
        });
    }

    /**
    * Open Payment Dialog
    *
    * @param {*} voucher
    * @memberof VoucherListComponent
    */
    public showPaymentDialog(): void {
        // this.voucherDetails = voucher;
        this.dialog.open(this.paymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }

    /**
    * Open Send Email Dialog
    *
    * @param {*} voucher
    * @memberof VoucherListComponent
    */
    public openEmailSendDialog(): void {
        this.sendEmailModalDialogRef = this.dialog.open(this.sendEmailModal, {
            panelClass: ['mat-dialog-sm']
        });
    }

    /**
     * Send Email API Call
     *
     * @param {*} email
     * @memberof VoucherListComponent
     */
    public sendEmail(email: any): void {
        if (email && email.length) {
            if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                const request = {
                    accountUniqueName: this.selectedInvoice?.vendor?.uniqueName,
                    uniqueName: this.selectedInvoice?.uniqueName,
                    voucherType: this.voucherType
                };
                this.componentStoreVoucher.sendEmail({ request, model: { emailId: [email] } });
            } else if ([VoucherTypeEnum.purchase, VoucherTypeEnum.sales].includes(this.voucherType)) {
                this.componentStoreVoucher.sendVoucherOnEmail({
                    accountUniqueName: this.selectedInvoice?.account?.uniqueName,
                    payload: {
                        copyTypes: [],
                        email: {
                            to: email?.split(',').map(email => email.trim())
                        },
                        voucherType: this.voucherType,
                        uniqueName: this.selectedInvoice?.uniqueName
                    }
                });
            } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(this.voucherType)) {
                console.log("this.selectedInvoice", this.selectedInvoice);

                let req: ProformaGetRequest = new ProformaGetRequest();
                req.accountUniqueName = this.selectedInvoice?.account?.uniqueName;

                if (this.voucherType === VoucherTypeEnum.generateProforma) {
                    req.proformaNumber = this.selectedInvoice?.proformaNumber;
                } else {
                    req.estimateNumber = this.selectedInvoice?.estimateNumber;
                }
                req.emailId = email?.split(',').map(email => email.trim())
                this.componentStoreVoucher.sendProformaEstimateOnEmail({ request: req, voucherType: this.voucherType });

            }
        }
    }

    /**
     * Handle Get All Voucher Response
     * 
     * @private
     * @param {*} response
     * @memberof VouchersPreviewComponent
     */
    private handleGetAllVoucherResponse(response: any): void {
        if (response && response.voucherType === this.voucherType) {
            this.invoiceList = [];
            this.filteredInvoiceList$.next([]);
            this.changeDetection.detectChanges();
            this.totalResults = response?.totalItems;
            response.items?.forEach((item: any, index: number) => {
                item.index = index + 1;

                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    item.isSelected = false;
                    item.uniqueName = item.proformaNumber || item.estimateNumber;
                    item.voucherNumber = item.proformaNumber || item.estimateNumber;
                    item.voucherDate = item.proformaDate || item.estimateDate;
                    item.account = { customerName: item.customerName, uniqueName: item.customerUniqueName };
                }

                if (this.voucherType === VoucherTypeEnum.purchase) {
                    let dueDate = item.dueDate ? dayjs(item.dueDate, GIDDH_DATE_FORMAT) : null;
                    if (dueDate) {
                        if (dueDate.isAfter(dayjs()) || ['paid', 'cancel'].includes(item.balanceStatus)) {
                            item.dueDays = null;
                        } else {
                            let dueDays = dueDate ? dayjs().diff(dueDate, 'day') : null;
                            item.dueDays = dueDays;
                        }
                    } else {
                        item.dueDays = null;
                    }
                }
                this.invoiceList.push(item);
            });
            this.filteredInvoiceList$.next(this.invoiceList);
            this.changeDetection.detectChanges();
            this.setSelectedInvoice(this.params.voucherUniqueName);
        }
    }

    /**
     * Handle Payment Submit
     *
     * @param {*} event
     * @memberof VouchersPreviewComponent
     */
    public paymentSubmitted(event: any): void {
        console.log("paymentSubmitted", event);

        this.componentStoreVoucher.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
    }

    public uploadFile(): void {
        const selectedFile: any = document.getElementById("csv-upload-input");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob, file) => {
                this.isFileUploading = true;

                this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isFileUploading = false;
                    if (response?.status === 'success') {
                        const requestObject = {
                            uniqueName: this.selectedInvoice?.uniqueName,
                            attachedFiles: [response?.body?.uniqueName]
                        };
                        this.salesService.updateAttachmentInVoucher(requestObject).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                            console.log("updateAttachmentInVoucher", res);
                            if (res.status === "error") {
                                this.toaster.showSnackBar('error', res?.message);
                            }

                            this.downloadVoucherPdf('base64');
                        }, () => this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong));


                        this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.toaster.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }


    /**
     * Lifecycle hook for destroy
     *
     * @memberof VouchersPreviewComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}