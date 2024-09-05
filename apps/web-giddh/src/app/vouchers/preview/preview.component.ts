import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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
import { ProformaDownloadRequest, ProformaVersionItem } from "../../models/api-models/proforma";
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
    /**  */
    @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    /**  */
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    /**  */
    @ViewChild('historyAsideDialog', { static: true }) public historyAsideDialog: TemplateRef<any>;
    /**  */
    @ViewChild('emailSendDialog', { static: true }) public emailSendDialog: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
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
    public sanitizedPdfFileUrl: any = '';
    /** Attached PDF file url created with blob */
    public attachedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
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
        private proformaService: ProformaService,
        private receiptService: ReceiptService,
        private toaster: ToasterService
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
                this.showPaymentDetails = !([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType) && VoucherTypeEnum.purchase !== this.voucherType);
                this.invoiceList = this.vouchersUtilityService?.lastVouchers;
                this.filteredInvoiceList$.next(this.vouchersUtilityService?.lastVouchers);
                if (!this.invoiceList?.length) {
                    this.getAllVouchers();
                } else {
                    this.setSelectedInvoice(params?.voucherUniqueName);
                }
                this.subscribeStoreObservable();
            }
        });
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;

        this.filteredInvoiceList$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            console.log("filteredInvoiceList$", data);
        });

        this.search.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search) {
                const filterSearchResult = this.invoiceList.filter(item => item?.voucherNumber.includes(search));
                this.filteredInvoiceList$.next(filterSearchResult);
            }
        })
    }

    public setSelectedInvoice(voucherUniqueName: string): void {
        this.selectedInvoice = this.invoiceList?.find(voucher => voucher?.uniqueName === voucherUniqueName);

        if (this.selectedInvoice && !this.isVoucherDownloading) {
            this.downloadVoucher('base64');
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

    public downloadVoucher(fileType: string = '') {
        console.log("downloadVoucher");

        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;
        this.shouldShowUploadAttachment = false;
        this.attachedPdfFileUrl = null;
        this.imagePreviewSource = null;
        if (this.selectedInvoice) {
            this.selectedInvoice.hasAttachment = false;
        }
        // this.detectChanges();

        if (this.generalService.voucherApiVersion === 2 && ![VoucherTypeEnum.generateEstimate, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            let getRequest = {
                voucherType: this.selectedInvoice?.voucherType,
                uniqueName: this.selectedInvoice?.uniqueName
            };

            this.sanitizedPdfFileUrl = null;
            this.commonService.downloadFile(getRequest, "ALL").pipe(takeUntil(this.destroyed$)).subscribe(result => {
                if (result?.body) {
                    /** Creating voucher pdf start */
                    if (this.selectedInvoice && result.body.data) {
                        this.isPdfAvailable = true;
                        this.selectedInvoice.blob = this.generalService.base64ToBlob(result.body.data, 'application/pdf', 512);
                        const file = new Blob([this.selectedInvoice.blob], { type: 'application/pdf' });
                        this.attachedDocumentBlob = file;
                        URL.revokeObjectURL(this.pdfFileURL);
                        this.pdfFileURL = URL.createObjectURL(file);

                        this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                        this.isVoucherDownloadError = false;
                        this.pdfPreviewLoaded = true;
                    } else {
                        if (this.selectedInvoice?.voucherType === 'purchase') {
                            this.pdfPreviewLoaded = false;
                        }
                        this.isPdfAvailable = false;
                    }
                    /** Creating voucher pdf finish */

                    if (result.body.attachments?.length > 0) {
                        /** Creating attachment start */
                        if (this.selectedInvoice) {
                            this.selectedInvoice.hasAttachment = true;
                        }
                        const fileExtention = result.body.attachments[0].type?.toLowerCase();
                        if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                            // Attached file type is image
                            this.attachedAttachmentBlob = this.generalService.base64ToBlob(result.body.attachments[0].encodedData, `image/${fileExtention}`, 512);
                            let objectURL = `data:image/${fileExtention};base64,` + result.body.attachments[0].encodedData;
                            this.imagePreviewSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                            this.attachedDocumentType = { name: result.body.attachments[0].name, type: 'image', value: fileExtention };
                            this.isVoucherDownloadError = false;
                        } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                            // Attached file type is PDF
                            this.attachedDocumentType = { name: result.body.attachments[0].name, type: 'pdf', value: fileExtention };
                            this.attachedAttachmentBlob = this.generalService.base64ToBlob(result.body.attachments[0].encodedData, 'application/pdf', 512);
                            setTimeout(() => {
                                if (this.selectedInvoice) {
                                    this.selectedInvoice.blob = this.attachedAttachmentBlob;
                                    const file = new Blob([this.attachedAttachmentBlob], { type: 'application/pdf' });
                                    URL.revokeObjectURL(this.pdfFileURL);
                                    this.pdfFileURL = URL.createObjectURL(file);
                                    this.attachedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                                }
                                // this.detectChanges();
                            }, 250);
                            this.isVoucherDownloadError = false;
                        } else {
                            // Unsupported type
                            this.attachedAttachmentBlob = this.generalService.base64ToBlob(result.body.attachments[0].encodedData, '', 512);
                            this.attachedDocumentType = { name: result.body.attachments[0].name, type: 'unsupported', value: fileExtention };
                        }
                    } else {
                        if (this.voucherType === VoucherTypeEnum.purchase) {
                            this.shouldShowUploadAttachment = true;
                        }
                    }
                    /** Creating attachment finish */
                } else {
                    this.isVoucherDownloadError = true;
                    this.pdfPreviewHasError = true;
                    if (this.voucherType === VoucherTypeEnum.purchase) {
                        this.shouldShowUploadAttachment = true;
                    }
                    this.toaster.showSnackBar('', this.commonLocaleData?.app_something_went_wrong);
                }
                this.isVoucherDownloading = false;
                // this.detectChanges();
            }, (err) => {
                this.handleDownloadError(err);
            });
        } else {
            if ([VoucherTypeEnum.sales, VoucherTypeEnum.cash, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote].includes(this.voucherType)) {
                if (this.selectedInvoice) {
                    let model: DownloadVoucherRequest = {
                        voucherType: this.selectedInvoice?.voucherType === VoucherTypeEnum.cash ? VoucherTypeEnum.sales : this.selectedInvoice?.voucherType,
                        voucherNumber: [this.selectedInvoice.voucherNumber]
                    };

                    let accountUniqueName: string = this.selectedInvoice.account?.uniqueName;
                    this.sanitizedPdfFileUrl = null;
                    this.receiptService.DownloadVoucher(model, accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                        if (result) {
                            if (this.selectedInvoice) {
                                this.selectedInvoice.blob = result;
                                const file = new Blob([result], { type: 'application/pdf' });
                                URL.revokeObjectURL(this.pdfFileURL);
                                this.pdfFileURL = URL.createObjectURL(file);
                                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                            }
                            this.isVoucherDownloadError = false;
                        } else {
                            this.isVoucherDownloadError = true;
                            this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                        }
                        this.isVoucherDownloading = false;
                        // this.detectChanges();
                    }, (err) => {
                        this.handleDownloadError(err);
                    });
                    // this.detectChanges();
                }
            } else if (this.voucherType === VoucherTypeEnum.purchase) {
                const requestObject: any = {
                    accountUniqueName: this.selectedInvoice?.account?.uniqueName,
                    purchaseRecordUniqueName: this.selectedInvoice?.uniqueName
                };
                this.purchaseRecordService.downloadAttachedFile(requestObject).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
                    if (data && data.body) {
                        this.shouldShowUploadAttachment = false;
                        this.attachedPdfFileUrl = null;
                        this.imagePreviewSource = null;
                        if (data.body.fileType) {
                            const fileExtention = data.body.fileType?.toLowerCase();
                            if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                                // Attached file type is image
                                this.attachedAttachmentBlob = this.generalService.base64ToBlob(data.body.uploadedFile, `image/${fileExtention}`, 512);
                                let objectURL = `data:image/${fileExtention};base64,` + data.body.uploadedFile;
                                this.imagePreviewSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                this.attachedDocumentType = { name: data.body.name, type: 'image', value: fileExtention };
                                this.isVoucherDownloadError = false;
                            } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                                // Attached file type is PDF
                                this.attachedDocumentType = { name: data.body.name, type: 'pdf', value: fileExtention };
                                this.attachedAttachmentBlob = this.generalService.base64ToBlob(data.body.uploadedFile, 'application/pdf', 512);
                                setTimeout(() => {
                                    if (this.selectedInvoice) {
                                        this.selectedInvoice.blob = this.attachedAttachmentBlob;
                                        const file = new Blob([this.attachedAttachmentBlob], { type: 'application/pdf' });
                                        URL.revokeObjectURL(this.pdfFileURL);
                                        this.pdfFileURL = URL.createObjectURL(file);
                                        this.attachedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                                    }
                                    // this.detectChanges();
                                }, 250);
                                this.isVoucherDownloadError = false;
                            } else {
                                // Unsupported type
                                this.attachedAttachmentBlob = this.generalService.base64ToBlob(data.body.uploadedFile, '', 512);
                                this.attachedDocumentType = { name: data.body.name, type: 'unsupported', value: fileExtention };
                            }
                        }
                    } else {
                        this.shouldShowUploadAttachment = true;
                        this.attachedPdfFileUrl = null;
                        this.imagePreviewSource = null;
                    }
                    this.isVoucherDownloading = false;
                    // this.detectChanges();
                }, (error) => {
                    this.handleDownloadError(error);
                });

                this.pdfPreviewHasError = false;
                this.pdfPreviewLoaded = false;

                let getRequest = { companyUniqueName: this.companyUniqueName, accountUniqueName: this.selectedInvoice?.account?.uniqueName, uniqueName: this.selectedInvoice?.uniqueName };

                this.sanitizedPdfFileUrl = null;
                this.purchaseRecordService.getPdf(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response && response.status === "success" && response.body) {
                        let blob: Blob = this.generalService.base64ToBlob(response.body, 'application/pdf', 512);
                        this.attachedDocumentBlob = blob;
                        const file = new Blob([blob], { type: 'application/pdf' });
                        URL.revokeObjectURL(this.pdfFileURL);
                        this.pdfFileURL = URL.createObjectURL(file);
                        this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                        this.pdfPreviewLoaded = true;
                        // this.detectChanges();
                    } else {
                        this.pdfPreviewHasError = true;
                    }
                });
                // this.detectChanges();
            } else {
                if (this.selectedInvoice) {
                    let request: ProformaDownloadRequest = new ProformaDownloadRequest();
                    request.fileType = fileType;
                    request.accountUniqueName = this.selectedInvoice.account?.uniqueName;

                    if (this.selectedInvoice?.voucherType === VoucherTypeEnum.generateProforma) {
                        request.proformaNumber = this.selectedInvoice.voucherNumber;
                    } else {
                        request.estimateNumber = this.selectedInvoice.voucherNumber;
                    }

                    this.sanitizedPdfFileUrl = null;
                    this.proformaService.download(request, this.selectedInvoice?.voucherType).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                        if (result && result.status === 'success') {
                            let blob: Blob = this.generalService.base64ToBlob(result.body, 'application/pdf', 512);
                            if (this.selectedInvoice) {
                                this.selectedInvoice.blob = blob;
                                const file = new Blob([blob], { type: 'application/pdf' });
                                URL.revokeObjectURL(this.pdfFileURL);
                                this.pdfFileURL = URL.createObjectURL(file);
                                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                            }
                            this.isVoucherDownloadError = false;
                        } else {
                            this.toaster.errorToast(result.message, result.code);
                            this.isVoucherDownloadError = true;
                        }
                        this.isVoucherDownloading = false;
                        // this.detectChanges();
                    }, (err) => {
                        this.handleDownloadError(err);
                    });
                    // this.detectChanges();
                }
            }
        }
    }

    /**
    * Download error handler
    *
    * @private
    * @param {*} error Error object
    * @memberof VouchersPreviewComponent
    */
    private handleDownloadError(error: any): void {
        this.toaster.showSnackBar('error', error.message);
        this.isVoucherDownloading = false;
        this.isVoucherDownloadError = true;
        // this.detectChanges();
    }

    // paid dialog
    public onPerformAction(): void {
        this.dialog.open(this.paidDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // adjust payment dialog
    public adjustPayment(): void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // email send dialog
    public openEmailSendDialog(): void {
        this.dialog.open(this.emailSendDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // history dialog
    public toggleActivityHistoryAsidePane(): void {
        this.dialog.open(this.historyAsideDialog, {
            position: {
                right: '0'
            },
            maxWidth: '760px',
            width: '100%',
            height: '100vh',
            maxHeight: '100vh'
        });
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
        this.componentStoreVoucher.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
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