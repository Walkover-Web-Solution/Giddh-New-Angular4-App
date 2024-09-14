import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, delay, distinctUntilChanged, merge, Observable, ReplaySubject, Subject, takeUntil } from "rxjs";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { PAGE_SIZE_OPTIONS, VoucherTypeEnum } from "../utility/vouchers.const";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { FILE_ATTACHMENT_TYPE } from "../../app.constant";
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
import { VoucherPreviewComponentStore } from "../utility/vouhcers-preview.store";
import { SalesService } from "../../services/sales.service";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { InvoiceReceiptActions } from "../../actions/invoice/receipt/receipt.actions";
import { saveAs } from 'file-saver';
import { Location } from "@angular/common";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { AdjustAdvancePaymentModal, VoucherAdjustments } from "../../models/api-models/AdvanceReceiptsAdjust";
import { AdjustmentUtilityService } from "../../shared/advance-receipt-adjustment/services/adjustment-utility.service";

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
    // /** Instance of Paid Dialog */
    // @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    /** Instance of Adjust Payment Dialog */
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    /** Instance of Version History Dialog */
    @ViewChild('historyAsideDialog', { static: true }) public historyAsideDialog: TemplateRef<any>;
    /** Holds send email dailog template reference send email */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /** Holds Payment template reference */
    @ViewChild('paymentDialog', { static: true }) public paymentDialog: TemplateRef<any>;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview', { static: true }) attachedDocumentPreview: ElementRef;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Voucher PDF for preview downloading is in progress Observable */
    public isVoucherDownloading$: Observable<boolean> = this.componentStorePreview.select(state => state.isVoucherDownloading);
    /** Voucher Download Error in PDF for preview downloading status Observable */
    public isVoucherDownloadError$: Observable<boolean> = this.componentStorePreview.select(state => state.isVoucherDownloadError);
    /** Get Vouchers is in progress Observable */
    public getVouchersInProgress$: Observable<any> = this.componentStoreVoucher.getLastVouchersInProgress$;
    /** Holds Filtered Invoice List for invoice search */
    public filteredInvoiceList$: Subject<any[]> = new Subject<any[]>();
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold day js reference */
    public dayjs = dayjs;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Holds advance Filters keys */
    public advanceFilters: any = {
        page: 1,
        count: this.pageSizeOptions[0],
        q: '',
        sort: '',
        sortBy: ''
    };
    /** Holds search voucher form control */
    public search: FormControl = new FormControl('');
    /** Holds invoice list */
    public invoiceList: any[] = [];
    /** Holds Current selected invoice */
    public selectedInvoice: any;
    /** Hold invoice  type */
    public voucherType: any = '';
    /** Holds Total Results Count */
    public totalResults: number = 0;
    /** Holds params value */
    public params: any = {};
    /** Holds true show Payment Details enable */
    public showPaymentDetails: boolean;
    /** Holds true if company mode */
    public isCompany: boolean;
    /** Holds create new voucher text and url */
    public createNewVoucher: any = {
        text: '',
        link: ''
    };
    /** Holds invoice type boolean status */
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
    /** Holds Voucher Details Dialog Ref */
    public voucherDetails: any;
    /** Holds voucher totals */
    public voucherTotals: any = {
        totalAmount: 0,
        totalDiscount: 0,
        totalTaxableValue: 0,
        totalTaxWithoutCess: 0,
        totalCess: 0,
        grandTotal: 0,
        roundOff: 0,
        tcsTotal: 0,
        tdsTotal: 0,
        balanceDue: 0
    };
    /** Holds company specific data */
    public company: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: '',
        giddhBalanceDecimalPlaces: 0
    };
    /** Deposit Amount */
    public depositAmount: number = 0;
    /** Stores the adjustment data */
    public advanceReceiptAdjustmentData: VoucherAdjustments;
    /** Holds true if update mode */
    public isUpdateMode: boolean;
    /** True if round off will be applicable */
    public applyRoundOff: boolean = true;

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
        private salesService: SalesService,
        private toaster: ToasterService,
        private changeDetection: ChangeDetectorRef,
        private store: Store<AppState>,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private location: Location,
        private adjustmentUtilityService: AdjustmentUtilityService
    ) { }


    /**
    * Initializes the component
    *
    * @memberof VouchersPreviewComponent
    */
    public ngOnInit(): void {
        merge(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                if (params?.voucherType) {
                    this.params = params;
                    this.voucherType = params?.voucherType;
                    this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
                    this.showPaymentDetails = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote].includes(this.voucherType);

                    // const lastVouchers = this.vouchersUtilityService?.lastVouchers;
                    // if (lastVouchers) {
                        // this.invoiceList = lastVouchers;
                        // this.filteredInvoiceList$.next(lastVouchers);
                        // this.changeDetection.detectChanges();
                    // }
                    // if (this.invoiceList?.length) {
                    //     this.setSelectedInvoice(params?.voucherUniqueName);
                    // }
                    this.getCreatedTemplates();
                    this.subscribeStoreObservable();
                }
                if (params?.page) {
                    this.advanceFilters.page = params.page;
                    this.advanceFilters.count = params.count;

                    // if (!this.invoiceList?.length) {
                        this.getAllVouchers();
                    // } else {
                    //     this.setSelectedInvoice(params?.voucherUniqueName);
                    // }
                }
            }
        });
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.search.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                // const filterSearchResult = this.invoiceList.filter(item => item?.voucherNumber.toLowerCase().includes(search.toLowerCase()));

                // Reset Filter
                this.advanceFilters = {
                    page: 1,
                    count: this.advanceFilters.count,
                    q: '',
                    sort: '',
                    sortBy: ''
                };

                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    if (this.voucherType === VoucherTypeEnum.generateProforma) {
                        this.advanceFilters.proformaNumber = search;
                    } else {
                        this.advanceFilters.estimateNumber = search;
                    }
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.advanceFilters.purchaseOrderNumber = search;
                } else {
                    this.advanceFilters.q = search;
                }
                this.getAllVouchers();

                this.filteredInvoiceList$.next([]);
                this.changeDetection.detectChanges();
            }
        })
    }

    /**
     * Set selected invoice and download PDF Preview
     *
     * @param {string} voucherUniqueName
     * @memberof VouchersPreviewComponent
     */
    public setSelectedInvoice(voucherUniqueName: string): void {
        this.selectedInvoice = this.invoiceList?.find(voucher => voucher?.uniqueName === voucherUniqueName);

        if (this.selectedInvoice && !this.isVoucherDownloading) {
            this.downloadVoucherPdf('base64');
        }
    }

    /**
     * Get Created Templates
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private getCreatedTemplates(): void {
        this.componentStoreVoucher.getCreatedTemplates(this.invoiceType.isDebitNote || this.invoiceType.isCreditNote ? 'voucher' : 'invoice');
    }

    /**
     * Check voucher type and assign create new invoice text 
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private getCreateNewVoucherText(): void {
        switch (this.voucherType) {
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
     * Subscribe all required store observable
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private subscribeStoreObservable(): void {
        merge(this.componentStoreVoucher.lastVouchers$, this.componentStoreVoucher.purchaseOrdersList$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.handleGetAllVoucherResponse(response);
            });

        merge(this.componentStoreVoucher.deleteVoucherIsSuccess$, this.componentStoreVoucher.convertToInvoiceIsSuccess$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
                    this.getAllVouchers();
                }
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

        this.componentStoreVoucher.convertToProformaIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toaster.showSnackBar("success", this.localeData?.proforma_generated);
            }
        });

        this.componentStoreVoucher.createdTemplates$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const thermalTemplate = response?.filter(response => response.templateType === 'thermal_template');
                if (thermalTemplate?.length > 0) {
                    this.thermalTemplate = thermalTemplate[0];
                }
            }
        });

        merge(this.componentStoreVoucher.deleteVoucherIsSuccess$, this.componentStoreVoucher.bulkUpdateVoucherIsSuccess$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
                    this.backToOldLocation();
                }
            });

        this.componentStoreVoucher.voucherDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.voucherDetails = response;

                this.voucherTotals = this.vouchersUtilityService.getVoucherTotals(response?.entries, this.company.giddhBalanceDecimalPlaces, this.applyRoundOff, response?.exchangeRate);

                let tcsSum: number = 0;
                let tdsSum: number = 0;
                response.body?.entries.forEach(entry => {
                    entry.taxes?.forEach(tax => {
                        if (['tcsrc', 'tcspay'].includes(tax?.taxType)) {
                            tcsSum += tax.amount?.amountForAccount;
                        } else if (['tdsrc', 'tdspay'].includes(tax?.taxType)) {
                            tdsSum += tax.amount?.amountForAccount;
                        }
                    });
                });
                this.voucherTotals.tcsTotal = tcsSum;
                this.voucherTotals.tdsTotal = tdsSum;

                this.depositAmount = response.deposit?.amountForAccount ?? 0;

                this.advanceReceiptAdjustmentData = { adjustments: this.adjustmentUtilityService.formatAdjustmentsObject(response.adjustments) };
                this.isUpdateMode = (response?.body?.adjustments?.length) ? true : false;

                this.dialog.open(this.adjustPaymentDialog, {
                    panelClass: ['mat-dialog-md']
                });
            }
        });

        this.componentStoreVoucher.adjustVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toaster.showSnackBar("success", this.localeData?.amount_adjusted);
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

    /**
    * Close Advance Receipt Dialog
    *
    * @memberof VouchersPreviewComponent
    */
    public closeAdvanceReceiptDialog(): void {
        this.advanceReceiptAdjustmentData = null;
        this.dialog.closeAll();
    }

    /**
    * To get all advance adjusted data
    *
    * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }} advanceReceiptsAdjustEvent event that contains advance receipts adjusted data
    * @memberof VouchersPreviewComponent
    */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }) {
        this.closeAdvanceReceiptDialog();
        let advanceReceiptAdjustmentData = cloneDeep(advanceReceiptsAdjustEvent.adjustVoucherData);
        if (advanceReceiptAdjustmentData && advanceReceiptAdjustmentData.adjustments && advanceReceiptAdjustmentData.adjustments.length > 0) {
            advanceReceiptAdjustmentData.adjustments.map(item => {
                item.voucherDate = (item.voucherDate?.toString()?.includes('/')) ? item.voucherDate?.trim()?.replace(/\//g, '-') : item.voucherDate;
                item.voucherNumber = item.voucherNumber === '-' ? '' : item.voucherNumber;
                item.amount = item.adjustmentAmount;
                item.unadjustedAmount = item.balanceDue;

                delete item.adjustmentAmount;
                delete item.balanceDue;
            });
        }

        this.componentStoreVoucher.adjustVoucherWithAdvanceReceipts({ adjustments: advanceReceiptAdjustmentData.adjustments, voucherUniqueName: this.voucherDetails?.uniqueName });
    }

    /**
     * Open adjust payment dialog
     *
     * @memberof VouchersPreviewComponent
     */
    public adjustPayment(): void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }

    /**
     * Open history dialog
     *
     * @memberof VouchersPreviewComponent
     */
    public toggleActivityHistoryAsidePane(): void {
        const model = {
            getRequestObject: {
                accountUniqueName: this.selectedInvoice.account?.uniqueName ?? this.selectedInvoice?.vendor?.uniqueName,
                voucherUniqueName: this.selectedInvoice.uniqueName
            },
            postRequestObject: {},
            voucherType: this.voucherType
        }
        if (this.invoiceType.isPurchaseOrder) {
            model.postRequestObject = {
                purchaseNumber: this.selectedInvoice?.voucherNumber,
                uniqueName: this.selectedInvoice.uniqueName
            }
        } else if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.generateEstimate) {
            model.postRequestObject[this.voucherType === VoucherTypeEnum.generateProforma ? 'proformaNumber' : 'estimateNumber'] = this.selectedInvoice?.voucherNumber;
        }
        this.dialog.open(this.historyAsideDialog, {
            data: { model: model, localeData: this.localeData, commonLocaleData: this.commonLocaleData },
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
    * @memberof VouchersPreviewComponent
    */
    public showPaymentDialog(): void {
        this.dialog.open(this.paymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }

    /**
    * Open Adjust payment dialog
    *
    * @param {*} voucher
    * @memberof VoucherListComponent
    */
    public showAdjustmentDialog(voucher: any): void {
        this.componentStoreVoucher.getVoucherDetails({ isCopyVoucher: false, accountUniqueName: voucher?.account?.uniqueName, payload: { uniqueName: voucher?.uniqueName, voucherType: this.voucherType } });
    }

    /**
    * Open Send Email Dialog
    *
    * @param {*} voucher
    * @memberof VouchersPreviewComponent
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
     * @memberof VouchersPreviewComponent
     */
    public sendEmail(email: any): void {
        if (email && email.length) {
            if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                const request = {
                    accountUniqueName: this.selectedInvoice?.vendor?.uniqueName,
                    uniqueName: this.selectedInvoice?.uniqueName,
                    voucherType: this.voucherType
                };
                this.componentStoreVoucher.sendEmail({ request, model: { emailId: email } });
            } else if ([VoucherTypeEnum.purchase, VoucherTypeEnum.sales].includes(this.voucherType)) {
                this.componentStoreVoucher.sendVoucherOnEmail({
                    accountUniqueName: this.selectedInvoice?.account?.uniqueName,
                    payload: {
                        copyTypes: [],
                        email: {
                            to: email
                        },
                        voucherType: this.voucherType,
                        uniqueName: this.selectedInvoice?.uniqueName
                    }
                });
            } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(this.voucherType)) {
                let req: ProformaGetRequest = new ProformaGetRequest();
                req.accountUniqueName = this.selectedInvoice?.account?.uniqueName;

                if (this.voucherType === VoucherTypeEnum.generateProforma) {
                    req.proformaNumber = this.selectedInvoice?.proformaNumber;
                } else {
                    req.estimateNumber = this.selectedInvoice?.estimateNumber;
                }
                req.emailId = email
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
            const currentInvoiceList = [];
            // this.filteredInvoiceList$.next([]);
            // this.changeDetection.detectChanges();
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
                currentInvoiceList.push(item);
            });
            this.invoiceList = currentInvoiceList;
            console.log(this.invoiceList);
            
            this.invoiceList = [...this.invoiceList, ...currentInvoiceList];
            this.filteredInvoiceList$.next(this.invoiceList);
            this.changeDetection.detectChanges();
            
            if (this.invoiceList?.length && !this.selectedInvoice) {
                    this.setSelectedInvoice(this.params.voucherUniqueName);
            }
        }
    }

    /**
     * Handle Delete Voucher Dialog
     *
     * @memberof VouchersPreviewComponent
     */
    public deleteVoucherDialog(): void {
        let confirmationMessages = [];
        this.localeData?.confirmation_messages?.map(message => {
            confirmationMessages[message.module] = message;
        });

        const configuration = this.generalService.getVoucherDeleteConfiguration(confirmationMessages[this.voucherType]?.title, confirmationMessages[this.voucherType]?.message1, confirmationMessages[this.voucherType]?.message2, this.commonLocaleData);

        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: configuration
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response === this.commonLocaleData?.app_yes) {
                if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.componentStoreVoucher.deleteVoucher({
                        accountUniqueName: this.selectedInvoice?.account?.uniqueName, model: {
                            uniqueName: this.selectedInvoice?.uniqueName,
                            voucherType: this.voucherType
                        }
                    });
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    if (this.selectedInvoice?.uniqueName) {
                        this.componentStoreVoucher.deleteSinglePOVoucher(this.selectedInvoice?.uniqueName);
                    } else {
                        this.poBulkAction('delete');
                    }
                } else if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    const payload = {
                        accountUniqueName: this.selectedInvoice.customerUniqueName
                    }
                    if (this.voucherType === VoucherTypeEnum.generateEstimate) {
                        payload['estimateNumber'] = this.selectedInvoice?.estimateNumber;
                    } else {
                        payload['proformaNumber'] = this.selectedInvoice?.proformaNumber;
                    }
                    this.componentStoreVoucher.deleteEstimsteProformaVoucher({ payload: payload, voucherType: this.voucherType });
                } else {
                    const payload = {
                        voucherUniqueNames: [this.selectedInvoice?.uniqueName],
                        voucherType: this.voucherType
                    };
                    this.componentStoreVoucher.bulkUpdateInvoice({ payload: payload, actionType: 'delete' });
                }
            }
        });
    }

    /**
     * Handle Purchase Order Bulk Actions
     *
     * @param {string} actionType
     * @param {*} [event]
     * @memberof VouchersPreviewComponent
     */
    public poBulkAction(actionType: string, event?: any): void {
        if (actionType === 'delete' || actionType === 'expire') {
            const purchaseNumbers = [this.selectedInvoice?.voucherNumber];
            this.componentStoreVoucher.purchaseOrderBulkUpdateAction({ payload: { purchaseNumbers }, actionType: actionType });
        } else if (event?.purchaseOrders) {
            this.componentStoreVoucher.purchaseOrderBulkUpdateAction({ payload: event, actionType: actionType });
        }
    }

    /**
     * Handle upload file
     *
     * @memberof VouchersPreviewComponent
     */
    public uploadFile(): void {
        const selectedFile: any = document.getElementById("csv-upload-input");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob, file) => {
                this.isFileUploading = true;

                // =========== move in component store ========== //
                this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isFileUploading = false;
                    if (response?.status === 'success') {
                        const requestObject = {
                            uniqueName: this.selectedInvoice?.uniqueName,
                            attachedFiles: [response?.body?.uniqueName]
                        };
                        this.salesService.updateAttachmentInVoucher(requestObject).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
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
     * Download Invoice PDF
     *
     * @return {*}  {void}
     * @memberof VouchersPreviewComponent
     */
    public downloadPdf(): void {
        if (this.isVoucherDownloading || this.isVoucherDownloadError) {
            return;
        }

        if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            if (this.selectedInvoice && this.selectedInvoice.blob) {
                return saveAs(this.selectedInvoice.blob, `${this.selectedInvoice.account.name} - ${this.selectedInvoice.voucherNumber}.pdf`);
            } else {
                return;
            }
        } else if (this.voucherType === VoucherTypeEnum.creditNote || this.voucherType === VoucherTypeEnum.debitNote) {
            if (this.selectedInvoice?.hasAttachment) {
                // this.downloadVoucherModal?.show();
                // "download-voucher" this componnent is missing in design
            } else {
                if (this.selectedInvoice) {
                    return saveAs(this.selectedInvoice.blob, `${this.selectedInvoice.voucherNumber}.pdf`);
                }
            }
        } else if (this.voucherType === VoucherTypeEnum.purchase) {
            if (this.pdfPreviewHasError || !this.pdfPreviewLoaded) {
                return;
            }
            if (!this.selectedInvoice?.hasAttachment) {
                let voucherNumber = (this.selectedInvoice?.voucherNumber) ? this.selectedInvoice?.voucherNumber : this.commonLocaleData?.app_not_available;
                saveAs(this.attachedDocumentBlob, voucherNumber + '.pdf');
            } else {
                // this.downloadVoucherModal?.show();
                // "download-voucher" this componnent is missing in design
            }
        } else {
            // this.downloadVoucherModal?.show();
            // "download-voucher" this componnent is missing in design
        }
    }

    /**
     * Open Invoice Print
     *
     * @return {*}  {void}
     * @memberof VouchersPreviewComponent
     */
    public printInvoice(): void {
        if (this.isVoucherDownloading || this.isVoucherDownloadError) {
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
     * This will use for print thermal print
     *
     * @memberof VouchersPreviewComponent
     */
    public printThermal(): void {
        let hasPrinted = false;
        this.componentStorePreview.voucherDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && this.selectedInvoice?.uniqueName === response.uniqueName) {
                if (!hasPrinted) {
                    hasPrinted = true;
                    this.thermalService.print(this.thermalTemplate, response);
                }
            } else {
                this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.selectedInvoice?.account?.uniqueName ?? this.selectedInvoice?.vendor?.uniqueName, {
                    invoiceNumber: this.selectedInvoice?.voucherNumber,
                    voucherType: this.voucherType,
                    uniqueName: this.selectedInvoice?.uniqueName
                }));
            }
        });
    }

    /**
     * Handle Edit voucher redirect to voucher edit page with respective voucher
     *
     * @memberof VouchersPreviewComponent
     */
    public editVoucher(): void {
        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            this.router.navigate(['/pages/vouchers/estimates/' + this.selectedInvoice?.account?.uniqueName + '/' + this.selectedInvoice?.voucherNumber + '/edit']);
        } else if (this.voucherType === VoucherTypeEnum.generateProforma) {
            this.router.navigate(['/pages/vouchers/proformas/' + this.selectedInvoice?.account?.uniqueName + '/' + this.selectedInvoice?.voucherNumber + '/edit']);
        } else {
            this.router.navigate(['/pages/vouchers/' + this.voucherType.toString().replace(/-/g, " ") + '/' + this.selectedInvoice?.account?.uniqueName + '/' + this.selectedInvoice?.uniqueName + '/edit']);
        }
    }

    /**
     * Handle Voucher Actions API Call
     *
     * @param {*} voucher
     * @param {string} action
     * @memberof VouchersPreviewComponent
     */
    public actionVoucher(action: string, event?: any): void {
        if (action) {
            if (action === 'open') {
                console.log("Check", this.selectedInvoice?.vendor?.uniqueName);

                this.componentStoreVoucher.poStatusUpdate({ accountUniqueName: this.selectedInvoice?.vendor?.uniqueName, payload: { action: action, purchaseNumber: this.selectedInvoice?.voucherNumber } });
            } else {
                this.componentStoreVoucher.actionVoucher({ voucherUniqueName: this.selectedInvoice?.uniqueName, payload: { action: action, voucherType: this.voucherType } });
            }
        } else {
            this.componentStoreVoucher.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
        }
    }

    /**
     * Copy Invoice and redirect to respective page
     *
     * @memberof VouchersPreviewComponent
     */
    public copyInvoice(): void {
        if (this.voucherType === VoucherTypeEnum.purchase) {
            this.router.navigate([`/pages/proforma-invoice/invoice/purchase/${this.selectedInvoice?.account?.uniqueName}/${this.selectedInvoice?.uniqueName}/copy`]);
        } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
            this.router.navigate([`/pages/purchase-management/purchase-order/new/${this.selectedInvoice?.uniqueName}`]);
        }
    }

    /**
     * Handle Estimate Proforma Actions API Call
     *
     * @param {string} action
     * @memberof VoucherListComponent
     */
    public actionEstimateProforma(action: string): void {
        const model = {
            accountUniqueName: this.selectedInvoice.customerUniqueName,
            action: action
        };
        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            model['estimateNumber'] = this.selectedInvoice?.voucherNumber;
        } else {
            model['proformaNumber'] = this.selectedInvoice?.voucherNumber;
        }
        this.componentStoreVoucher.actionEstimateProforma({
            request: model,
            voucherType: this.selectedInvoice?.voucherType ?? this.voucherType
        });
    }

    /**
     * Convert To Invoice API Call
     *
     * @memberof VoucherListComponent
     */
    public convertToInvoice(): void {
        const model = {
            accountUniqueName: this.selectedInvoice?.customerUniqueName
        };

        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            model['estimateNumber'] = this.selectedInvoice?.voucherNumber;
        } else {
            model['proformaNumber'] = this.selectedInvoice?.voucherNumber;
        }

        this.componentStoreVoucher.convertToInvoice({
            request: model,
            voucherType: this.voucherType
        });
    }

    /**
     * Convert To Proforma API Call
     *
     * @memberof VoucherListComponent
     */
    public convertToProforma(): void {
        this.componentStoreVoucher.convertToProforma({
            request: {
                accountUniqueName: this.selectedInvoice?.customerUniqueName,
                estimateNumber: this.selectedInvoice?.voucherNumber,
            },
            voucherType: this.voucherType
        });
    }

    /**
     * Back to last page
     *
     * @memberof VouchersPreviewComponent
     */
    public backToOldLocation(): void {
        this.location.back();
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