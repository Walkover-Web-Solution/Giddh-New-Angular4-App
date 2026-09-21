import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, debounceTime, delay, distinctUntilChanged, merge, Observable, ReplaySubject, takeUntil } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { VoucherTypeEnum } from "../utility/vouchers.const";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { ASIDE_PANE_CONFIG, FILE_ATTACHMENT_TYPE, PAGINATION_LIMIT, SubVoucher } from "../../app.constant";
import { cloneDeep } from "../../lodash-optimized";
import { FormControl } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { ProformaDownloadRequest, ProformaGetRequest, ProformaVersionItem } from "../../models/api-models/proforma";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ThermalService } from "../../services/thermal.service";
import { ToasterService } from "../../services/toaster.service";
import { AppState } from "../../store";
import { select, Store } from "@ngrx/store";
import { InvoiceReceiptActions } from "../../actions/invoice/receipt/receipt.actions";
import { saveAs } from 'file-saver';
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { AdjustAdvancePaymentModal, VoucherAdjustments } from "../../models/api-models/AdvanceReceiptsAdjust";
import { AdjustmentUtilityService } from "../../shared/advance-receipt-adjustment/services/adjustment-utility.service";
import { DownloadVoucherComponent } from "../download-voucher/download-voucher.component";
import { ServiceConfig } from "../../services/service.config";
import { DscSignDialogService } from "../../services/dsc-sign-dialog.service";
import { DscService } from "../../services/dsc.service";
import { VoucherService } from "../../services/voucher.service";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    providers: [VoucherComponentStore],
    standalone: false
})
export class VouchersPreviewComponent implements OnInit, OnDestroy {
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Instance of cdk scrollbar */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    /** Instance of Adjust Payment Dialog */
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    /** Instance of Version History Dialog */
    @ViewChild('historyAsideDialog', { static: true }) public historyAsideDialog: TemplateRef<any>;
    /** Holds send email dailog template reference send email */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /** Holds Payment template reference */
    @ViewChild('paymentDialog', { static: true }) public paymentDialog: TemplateRef<any>;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview', { static: false }) attachedDocumentPreview: ElementRef;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Voucher PDF for preview downloading is in progress Observable */
    public isVoucherDownloading$: Observable<boolean> = this.componentStore.isVoucherDownloading$;
    /** Voucher Download Error in PDF for preview downloading status Observable */
    public isVoucherDownloadError$: Observable<boolean> = this.componentStore.isVoucherDownloadError$;
    /** Get Vouchers is in progress Observable */
    public getVouchersInProgress$: Observable<any> = this.componentStore.getLastVouchersInProgress$;
    /** Voucher Versions response state Observable */
    public voucherVersionsResponse$: Observable<any> = this.componentStore.voucherVersionsResponse$;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold day js reference */
    public dayjs: any = dayjs;
    /** Holds advance Filters keys */
    public advanceFilters: any = {
        page: 1,
        count: PAGINATION_LIMIT,
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
    /** Hold url Voucher Type */
    public urlVoucherType: string = '';
    /** Holds Total Results Count */
    public totalPages: number = 0;
    /** Holds params value */
    public params: any = {};
    /** Holds true show Payment Details enable */
    public showPaymentDetails: boolean;
    /** Holds true if company mode */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
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
    /** Holds array of page numbers who date is present in list */
    private pageNumberHistory: any[] = [];
    /** Hold true when voucher is downloading */
    public isVoucherDownloading: boolean = false;
    /** Hold true when voucher is download failed */
    public isVoucherDownloadError: boolean = false;
    /** Holds true when File Uploading is in progress */
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
    /** Holds PDF file value */
    public pdfFileURL: string = '';
    /** This will hold the attached file in Purchase Bill */
    private attachedAttachmentBlob: Blob;
    /** This will use for default template */
    public defaultThermalTemplate: any;
    /** True if pdf is available */
    public isPdfAvailable: boolean = true;
    /* This will hold if pdf preview loaded */
    public pdfPreviewLoaded: boolean = false;
    /* This will hold if pdf preview has error */
    public pdfPreviewHasError: boolean = false;
    /** Hold true if searching */
    public isSearching: boolean;
    /** True while DSC certificates are being preloaded; disables signed-PDF download button. */
    public isDscPreloading: boolean = true;
    /** Holds true if invoice load more data is trigger */
    public isLoadMore: boolean;
    /** Holds Get all api call count */
    private getAllApiCallCount: number = 0;
    /** Holds current route query parameters */
    public queryParams: any = {};
    /** Holds voucher history of Estimates/Proforma */
    public voucherVersions: ProformaVersionItem[] = [];
    /** Holds history of Estimates/Proforma filtered data */
    public filteredVoucherVersions: ProformaVersionItem[] = [];
    /** Holds View More voucher history status used to toggle voucher history */
    public moreLogsDisplayed: boolean = true;
    /** Holds Image dynamic path for electron and web application */
    public imgPath: string = '';
    /** Holds voucher type enum to use Enum in html */
    public voucherTypeEnum: any = VoucherTypeEnum;
    /** Holds true when need to refresh page */
    private isRefresh: boolean = null;
    /** Voucher api version */
    public voucherApiVersion: number;
    /** True when store observables are already subscribed */
    private storeSubscribed: boolean = false;
    /** True during initial dual get-all load (lookup + page list) */
    public isInitialDualLoad: boolean = false;
    /** Lookup voucher item; undefined until lookup API completes */
    private lookupVoucherItem: any;
    /** Page list response during initial dual load */
    private initialPageListResponse: any;
    /** True when route voucher PDF load has been triggered */
    private initialPdfLoaded: boolean = false;
    /** True while first (route param lookup) get-all API is in progress */
    public isLookupVouchersInProgress: boolean = false;
    /** Skip one valueChanges emit matching route search (avoids duplicate get-all on page load) */
    private skipNextSearchEmit: string | null = null;
    /** True when get-all is triggered from user search input */
    private isUserSearchRequest: boolean = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private store: Store<AppState>,
        private componentStore: VoucherComponentStore,
        private activatedRoute: ActivatedRoute,
        private vouchersUtilityService: VouchersUtilityService,
        private generalService: GeneralService,
        private sanitizer: DomSanitizer,
        private domSanitizer: DomSanitizer,
        private thermalService: ThermalService,
        private toaster: ToasterService,
        @Inject(ServiceConfig) private serviceConfig,
        private changeDetection: ChangeDetectorRef,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private dscSignDialogService: DscSignDialogService,
        private dscService: DscService,
        private voucherService: VoucherService
    ) { }


    /**
    * Initializes the component
    *
    * @memberof VouchersPreviewComponent
    */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        combineLatest([
            this.activatedRoute.params,
            this.activatedRoute.queryParams
        ]).pipe(
            delay(0),
            distinctUntilChanged((prev, curr) =>
                this.getRouteLoadKey(prev[0], prev[1]) === this.getRouteLoadKey(curr[0], curr[1])
            ),
            takeUntil(this.destroyed$)
        ).subscribe(([routeParams, queryParams]) => {
            if (!routeParams?.voucherType || !queryParams?.page) {
                return;
            }
            if (this.params?.voucherUniqueName !== routeParams?.voucherUniqueName) {
                this.initialPdfLoaded = false;
                this.isInitialDualLoad = false;
                this.isLookupVouchersInProgress = false;
                this.lookupVoucherItem = undefined;
                this.initialPageListResponse = undefined;
                this.skipNextSearchEmit = null;
                this.isUserSearchRequest = false;
            }
            this.params = { ...routeParams, ...queryParams };
            this.queryParams = queryParams;
            this.isSearching = false;
            this.urlVoucherType = routeParams.voucherType;
            this.voucherType = this.vouchersUtilityService.parseVoucherType(routeParams.voucherType);
            this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
            this.showPaymentDetails = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote].includes(this.voucherType);
            this.getCreatedTemplates();
            this.getCreateNewVoucherText();
            this.subscribeStoreObservable();
            this.setPageListFiltersFromQuery(queryParams);
            this.skipNextSearchEmit = queryParams.search ?? '';
            this.search.setValue(this.skipNextSearchEmit, { emitEvent: false });
            this.loadPreviewPage();
        });
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.search.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (this.skipNextSearchEmit !== null && search === this.skipNextSearchEmit) {
                this.skipNextSearchEmit = null;
                return;
            }
            this.skipNextSearchEmit = null;
            if (search || search === '') {
                this.isUserSearchRequest = true;
                this.isSearching = true;
                this.isInitialDualLoad = false;
                this.isLoadMore = false;
                this.applySearchFilters(search);
                this.getAllVouchers();
            }
        });
        if (this.shouldShowDownloadSignedPdf()) {
            this.isDscPreloading = !this.dscService.hasCachedCertificates();
            this.dscService.preloadCertificates().pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                    this.isDscPreloading = false;
                    this.changeDetection.detectChanges();
                })
            ).subscribe();
        }
    }
    /**
     * True when Download Signed PDF is allowed for the current voucher type.
     *
     * @protected
     * @returns {boolean} True if signed PDF action should be displayed
     * @memberof VouchersPreviewComponent
     */
    protected shouldShowDownloadSignedPdf(): boolean {
        return !this.invoiceType.isPurchaseOrder &&
            !this.invoiceType.isEstimateInvoice &&
            !this.invoiceType.isProformaInvoice &&
            !this.invoiceType.isReceiptInvoice &&
            !this.invoiceType.isPaymentInvoice &&
            !this.invoiceType.isDeliveryChallan &&
            !this.invoiceType.isReceiptNote;
    }

    /**
     * Set selected invoice and download PDF Preview
     *
     * @param {string} voucherUniqueName
     * @memberof VouchersPreviewComponent
     */
    public setSelectedInvoice(voucherUniqueName: string, isNewInvoiceSelected: boolean = false, skipPdfDownload: boolean = false): void {
        if (isNewInvoiceSelected && this.selectedInvoice?.uniqueName === voucherUniqueName) {
            return;
        }
        this.selectedInvoice = this.invoiceList?.find(voucher => voucher?.uniqueName === voucherUniqueName);
        if (!this.selectedInvoice) {
            return;
        }
        if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
            this.getVoucherVersions(this.selectedInvoice);
        }
        if (!skipPdfDownload && !this.isVoucherDownloading && this.canDownloadPdf(this.selectedInvoice)) {
            if (voucherUniqueName === this.params?.voucherUniqueName) {
                this.initialPdfLoaded = true;
            }
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
        this.componentStore.getCreatedTemplates((this.invoiceType.isDebitNote || this.invoiceType.isCreditNote) ? 'voucher' : this.invoiceType.isEstimateInvoice ? this.voucherTypeEnum.estimate : this.invoiceType.isProformaInvoice ? this.voucherTypeEnum.proforma : 'invoice');
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
            case VoucherTypeEnum.receipt:
                this.createNewVoucher.text = this.localeData?.new_receipt;
                this.createNewVoucher.link = "/pages/vouchers/receipt/create";
                break;
            case VoucherTypeEnum.payment:
                this.createNewVoucher.text = this.localeData?.new_payment;
                this.createNewVoucher.link = "/pages/vouchers/payment/create";
                break;
            case VoucherTypeEnum.deliveryChallan:
                this.createNewVoucher.text = this.localeData?.new_delivery_challan;
                this.createNewVoucher.link = "/pages/vouchers/delivery-challan/create";
                break;
            case VoucherTypeEnum.receiptNote:
                this.createNewVoucher.text = this.localeData?.new_receipt_note;
                this.createNewVoucher.link = "/pages/vouchers/receipt-note/create";
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
        if (this.storeSubscribed) {
            return;
        }
        this.storeSubscribed = true;
        merge(this.componentStore.lastVouchers$, this.componentStore.purchaseOrdersList$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.handleGetAllVoucherResponse(response);
            });

        merge(this.componentStore.deleteVoucherIsSuccess$, this.componentStore.convertToInvoiceIsSuccess$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
                    this.getAllVouchers();
                }
            });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.getAllApiCallCount > 0) {
                const from = dayjs(response[0]).format(GIDDH_DATE_FORMAT);
                const to = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                if (this.advanceFilters.from === from && this.advanceFilters.to === to) {
                    return;
                }
                // Reset
                this.isSearching = false;
                this.isLoadMore = false;
                this.pageNumberHistory = [1];
                this.advanceFilters = {
                    page: 1,
                    from,
                    to,
                    count: PAGINATION_LIMIT,
                    sort: '',
                    sortBy: ''
                };
                delete this.advanceFilters.q;
                delete this.advanceFilters.proformaNumber;
                delete this.advanceFilters.estimateNumber;
                delete this.advanceFilters.purchaseOrderNumber;
                this.invoiceList = [];
                this.generalService.updateActivatedRouteQueryParams({ from, to });
            }
        });

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
            }
        });

        this.componentStore.downloadVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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

        this.componentStore.sendEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.sendEmailModalDialogRef?.close();
            }
        });

        this.componentStore.actionVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.dialog.closeAll();
                this.toaster.showSnackBar("success", (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) ? this.localeData?.status_updated : this.commonLocaleData?.app_messages?.invoice_updated);
                this.getAllVouchers();
            }
        });

        this.componentStore.convertToProformaIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toaster.showSnackBar("success", this.localeData?.proforma_generated);
            }
        });

        this.componentStore.createdTemplates$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.defaultThermalTemplate = response?.find(response => response.isDefault && (response.templateType === 'thermal_template'));
            }
        });

        merge(this.componentStore.deleteVoucherIsSuccess$, this.componentStore.bulkUpdateVoucherIsSuccess$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
                    this.redirectToGetAllPage();
                }
            });

        this.componentStore.voucherDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.voucherDetails = response;

                let tcsSum: number = 0;
                let tcsGrandTotalAdjustment: number = 0;
                let tdsSum: number = 0;
                (Array.isArray(response.body?.entries) ? response.body?.entries : []).forEach(entry => {
                    entry.taxes?.forEach(tax => {
                        if (['tcsrc', 'tcspay'].includes(tax?.taxType)) {
                            tcsSum += tax.amount?.amountForAccount;
                            tcsGrandTotalAdjustment += tax.amount?.amountForAccount;
                        } else if (['tdsrc', 'tdspay'].includes(tax?.taxType)) {
                            tdsSum += tax.amount?.amountForAccount;
                        }
                    });
                });

                this.voucherTotals = this.vouchersUtilityService.getVoucherTotals(response?.entries, this.company.giddhBalanceDecimalPlaces, this.applyRoundOff, response?.exchangeRate);
                if (response?.body?.subVoucher !== SubVoucher.AdvanceReceipt && !this.invoiceType.isReceiptInvoice && !this.invoiceType.isPaymentInvoice) {
                    this.voucherTotals.grandTotal += tcsGrandTotalAdjustment;
                }
                this.voucherTotals.tcsTotal = tcsSum;
                this.voucherTotals.tdsTotal = tdsSum;

                this.depositAmount = response.deposit?.amountForAccount ?? 0;

                this.advanceReceiptAdjustmentData = { adjustments: this.adjustmentUtilityService.formatAdjustmentsObject(response.adjustments) };
                this.isUpdateMode = (response?.body?.adjustments?.length) ? true : false;

                this.dialog.open(this.adjustPaymentDialog, {
                    panelClass: "mat-dialog-md",
                    disableClose: true
                });
            }
        });

        this.componentStore.adjustVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toaster.showSnackBar("success", this.localeData?.amount_adjusted);
            }
        });

        this.componentStore.uploadFileIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isFileUploading = false;
                const requestObject = {
                    uniqueName: this.selectedInvoice?.uniqueName,
                    attachedFiles: [response?.uniqueName]
                };
                this.componentStore.updateAttachmentInVoucher({ postRequestObject: requestObject });
            }
        });

        this.componentStore.updateAttachmentInVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.downloadVoucherPdf('base64');
            }
        });

        this.voucherVersionsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice)) {
                this.voucherVersions = response?.results;
                this.filterVoucherVersions(false);
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
        if (typeof response === 'string' || (response?.hasOwnProperty('data') && response.data)) {
            if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.payment, VoucherTypeEnum.receipt].includes(this.voucherType)) {
                /** Creating voucher pdf start */
                if (response) {
                    this.isPdfAvailable = true;
                    this.selectedInvoice.blob = this.generalService.base64ToBlob(response.data || response, 'application/pdf', 512);
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
     * @param {boolean} [isLoadMore=false]
     * @param {boolean} [isScrollUp=false]
     * @return {*}  {void}
     * @memberof VouchersPreviewComponent
     */
    private getAllVouchers(isLoadMore: boolean = false, isScrollUp: boolean = false): void {
        if (this.isLoadMore && isLoadMore) {
            return;
        }
        if (!isLoadMore) {
            this.isLoadMore = false;
        }
        if (isLoadMore) {
            this.isLoadMore = true;
            if (this.totalPages > this.advanceFilters.page) {
                if (isScrollUp) {
                    this.advanceFilters.page = this.pageNumberHistory[0] - 1;
                } else {
                    let lastIndex = this.pageNumberHistory.length - 1;
                    if (this.pageNumberHistory[lastIndex] === this.advanceFilters.page) {
                        this.advanceFilters.page = this.advanceFilters.page + 1;
                    } else {
                        this.advanceFilters.page = this.pageNumberHistory[lastIndex] + 1;
                    }
                }
            } else {
                this.isLoadMore = false;
                return;
            }
            if (!isScrollUp && (this.totalPages < this.advanceFilters.page)) {
                this.isLoadMore = false;
                return;
            }

            if (isScrollUp && this.advanceFilters.page === 0) {
                this.advanceFilters.page = 1;
                this.isLoadMore = false;
                return;
            }
        }

        const inventoryVoucherType = this.getInventoryVoucherType();
        if (inventoryVoucherType) {
            this.componentStore.getInventoryVouchers({
                model: cloneDeep(this.advanceFilters),
                type: inventoryVoucherType
            });
            return;
        }

        if (this.voucherType?.length) {
            if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                this.componentStore.getPreviousProformaEstimates({ model: this.buildProformaEstimateRequestModel(), type: this.voucherType });
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                this.componentStore.getPurchaseOrders({ request: cloneDeep(this.advanceFilters) });
            } else {
                this.componentStore.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            }
        }
    }

    /**
     * Returns delivery challan/receipt note type from the current route
     *
     * @private
     * @return {string}
     * @memberof VouchersPreviewComponent
     */
    private getInventoryVoucherType(): string {
        const routeVoucherType = this.activatedRoute.snapshot.params?.voucherType
            || this.urlVoucherType
            || this.voucherType;
        const parsedVoucherType = this.vouchersUtilityService.parseVoucherType(routeVoucherType);
        return [VoucherTypeEnum.deliveryChallan, VoucherTypeEnum.receiptNote].includes(parsedVoucherType as VoucherTypeEnum)
            ? parsedVoucherType
            : '';
    }

    /**
     * Download Voucher PDF
     *
     * @param {string} [fileType='']
     * @memberof VouchersPreviewComponent
     */
    public downloadVoucherPdf(fileType: string = ''): void {
        if (this.selectedInvoice && this.canDownloadPdf(this.selectedInvoice)) {
            this.isVoucherDownloading = true;
            this.isVoucherDownloadError = false;
            this.shouldShowUploadAttachment = false;
            this.attachedPdfFileUrl = null;
            this.imagePreviewSource = null;
            let getRequest: any;
            this.sanitizedPdfFileUrl = null;
            this.selectedInvoice.hasAttachment = false;
            const fileType = "base64";
            const accountUniqueName = this.getInvoiceAccountUniqueName(this.selectedInvoice);

            if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.payment, VoucherTypeEnum.receipt, VoucherTypeEnum.deliveryChallan, VoucherTypeEnum.receiptNote].includes(this.voucherType)) {
                getRequest = {
                    voucherType: this.voucherType,
                    uniqueName: this.selectedInvoice?.uniqueName
                };
            } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(this.voucherType)) {
                getRequest = new ProformaDownloadRequest();
                getRequest.fileType = fileType;
                getRequest.accountUniqueName = accountUniqueName;

                if (this.voucherType === VoucherTypeEnum.generateProforma) {
                    getRequest.proformaNumber = this.selectedInvoice.voucherNumber ?? this.selectedInvoice.proformaNumber;
                } else {
                    getRequest.estimateNumber = this.selectedInvoice.voucherNumber ?? this.selectedInvoice.estimateNumber;
                }
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                getRequest = {
                    accountUniqueName,
                    poUniqueName: this.selectedInvoice?.uniqueName
                };
            }
            if (this.generalService.voucherApiVersion === 1 && [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.payment, VoucherTypeEnum.receipt].includes(this.voucherType)) {
                getRequest = {
                    accountUniqueName: this.selectedInvoice.account?.uniqueName,
                    voucherNumber: [this.selectedInvoice.voucherNumber],
                    voucherType: this.voucherType,
                    fileType: fileType
                };
            }
            this.componentStore.downloadVoucherPdf({ model: getRequest, type: "ALL", fileType: fileType, voucherType: this.voucherType, isDownloadFromDialog: false });
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
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
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
        this.componentStore.adjustVoucherWithAdvanceReceipts({ adjustments: advanceReceiptAdjustmentData.adjustments, voucherUniqueName: this.voucherDetails?.uniqueName });
    }

    /**
     * Open Download Voucher Dailog
     *
     * @memberof VouchersPreviewComponent
     */
    public openDownloadVoucher(): void {
        this.dialog.open(DownloadVoucherComponent, {
            data: {
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData,
                selectedItem: this.selectedInvoice,
                voucherType: this.voucherType
            },
            panelClass: "mat-dialog-md",
            disableClose: true
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
            ...ASIDE_PANE_CONFIG,
            data: { model: model, localeData: this.localeData, commonLocaleData: this.commonLocaleData }
        });
    }

    /**
    * Open Payment Dialog
    *
    * @memberof VouchersPreviewComponent
    */
    public showPaymentDialog(): void {
        this.dialog.open(this.paymentDialog, {
            panelClass: "mat-dialog-md",
            disableClose: true
        });
    }

    /**
    * Open Adjust payment dialog
    *
    * @memberof VouchersPreviewComponent
    */
    public showAdjustmentDialog(): void {
        this.componentStore.getVoucherDetails({ isCopyVoucher: false, accountUniqueName: this.selectedInvoice?.account?.uniqueName, payload: { uniqueName: this.selectedInvoice?.uniqueName, voucherType: this.voucherType } });
    }

    /**
    * Open Send Email Dialog
    *
    * @memberof VouchersPreviewComponent
    */
    public openEmailSendDialog(): void {
        this.sendEmailModalDialogRef = this.dialog.open(this.sendEmailModal, {
            panelClass: ['mat-dialog-sm'],
            disableClose: true
        });
    }

    /**
     * Send Email API Call
     *
     * @param {*} response
     * @memberof VouchersPreviewComponent
     */
    public sendEmail(response: any): void {
        if (response) {
            if (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote || this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
                this.componentStore.sendVoucherOnEmail({
                    accountUniqueName: this.selectedInvoice?.account?.uniqueName ?? this.selectedInvoice?.vendor?.uniqueName,
                    payload: {
                        copyTypes: response.invoiceType ?? [],
                        email: {
                            to: response.email ?? response
                        },
                        voucherType: this.voucherType,
                        uniqueName: this.selectedInvoice?.uniqueName
                    }
                });
            } else {
                if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(this.voucherType)) {
                    let req: ProformaGetRequest = new ProformaGetRequest();
                    req.accountUniqueName = this.selectedInvoice?.account?.uniqueName;

                    if (this.voucherType === VoucherTypeEnum.generateProforma) {
                        req.proformaNumber = this.selectedInvoice?.proformaNumber;
                    } else {
                        req.estimateNumber = this.selectedInvoice?.estimateNumber;
                    }
                    req.emailId = response;
                    this.componentStore.sendProformaEstimateOnEmail({ request: req, voucherType: this.voucherType });
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    const request = {
                        accountUniqueName: this.selectedInvoice?.vendor?.uniqueName,
                        uniqueName: this.selectedInvoice?.uniqueName,
                        voucherType: this.voucherType
                    };
                    this.componentStore.sendEmailOnPurchaseOrder({ request, model: { emailId: response } });
                }
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
            if (this.isInitialDualLoad) {
                if (response.totalPages < this.advanceFilters.page) {
                    this.advanceFilters.page = 1;
                    this.initialPageListResponse = undefined;
                    this.getAllVouchers();
                    return;
                }
                this.initialPageListResponse = response;
                this.tryCompleteInitialDualLoad();
                return;
            }

            if (this.pageNumberHistory[0] < response.page) {
                this.pageNumberHistory.push(response.page);
            } else if (!this.pageNumberHistory.includes(response.page)) {
                this.pageNumberHistory.unshift(response.page);
            }
            this.totalPages = response?.totalPages
                ?? (response?.totalItems && this.advanceFilters.count
                    ? Math.ceil(response.totalItems / this.advanceFilters.count)
                    : response?.items?.length ? 1 : 0);

            if (this.totalPages === 0) {
                this.invoiceList = [];
                if (this.isUserSearchRequest) {
                    this.isUserSearchRequest = false;
                } else if (this.params?.voucherUniqueName && !this.initialPdfLoaded) {
                    this.loadPdfForRouteVoucher();
                }
                return;
            }

            // Handle page number is more than total pages in query params
            if (this.totalPages < this.advanceFilters.page) {
                this.advanceFilters.page = 1;
                this.getAllVouchers();
                return;
            }

            const currentInvoiceList = this.normalizeVoucherListItems(response.items);

            if ((this.isSearching || (this.advanceFilters.page === 1) && (this.pageNumberHistory.length === 1)) || this.isRefresh) {
                this.invoiceList = currentInvoiceList;
            } else {
                this.invoiceList = this.advanceFilters.page === this.pageNumberHistory[this.pageNumberHistory.length - 1] ? [...this.invoiceList, ...currentInvoiceList] : [...currentInvoiceList, ...this.invoiceList];
            }
            this.isLoadMore = false;
            this.getAllApiCallCount++;
            this.changeDetection.detectChanges();

            this.selectInvoiceAfterListLoad(this.isUserSearchRequest);
            this.isUserSearchRequest = false;
            this.isRefresh = false;
        }
    }

    /**
     * Build unique key for route load deduplication
     *
     * @private
     * @param {*} routeParams
     * @param {*} queryParams
     * @returns {string}
     * @memberof VouchersPreviewComponent
     */
    private getRouteLoadKey(routeParams: any, queryParams: any): string {
        return [
            routeParams?.voucherType ?? '',
            routeParams?.voucherUniqueName ?? '',
            queryParams?.page ?? '',
            queryParams?.count ?? '',
            queryParams?.from ?? '',
            queryParams?.to ?? ''
        ].join('|');
    }

    /**
     * Set page list filters from queryParams (without search)
     *
     * @private
     * @param {*} queryParams
     * @memberof VouchersPreviewComponent
     */
    private setPageListFiltersFromQuery(queryParams: any): void {
        this.pageNumberHistory = [Number(queryParams.page) || 1];
        this.advanceFilters.page = Number(queryParams.page);
        this.advanceFilters.count = queryParams.count ? Number(queryParams.count) : PAGINATION_LIMIT;
        this.advanceFilters.from = queryParams.from ?? '';
        this.advanceFilters.to = queryParams.to ?? '';
        delete this.advanceFilters.q;
        this.advanceFilters.sort = '';
        this.advanceFilters.sortBy = '';
        delete this.advanceFilters.proformaNumber;
        delete this.advanceFilters.estimateNumber;
        delete this.advanceFilters.purchaseOrderNumber;
    }

    /**
     * Build proforma/estimate get-all request (uses proformaNumber/estimateNumber, not q)
     *
     * @private
     * @param {*} [overrides={}]
     * @returns {*}
     * @memberof VouchersPreviewComponent
     */
    private buildProformaEstimateRequestModel(overrides: any = {}): any {
        const model: any = {
            page: overrides.page ?? this.advanceFilters.page ?? 1,
            count: overrides.count ?? this.advanceFilters.count ?? PAGINATION_LIMIT,
            from: overrides.from ?? this.advanceFilters.from ?? '',
            to: overrides.to ?? this.advanceFilters.to ?? '',
            sort: overrides.sort ?? this.advanceFilters.sort ?? '',
            sortBy: overrides.sortBy ?? this.advanceFilters.sortBy ?? '',
            ...overrides
        };
        if (this.voucherType === VoucherTypeEnum.generateProforma) {
            if (model.proformaNumber === undefined && this.advanceFilters.proformaNumber !== undefined) {
                model.proformaNumber = this.advanceFilters.proformaNumber;
            }
            delete model.estimateNumber;
        } else {
            if (model.estimateNumber === undefined && this.advanceFilters.estimateNumber !== undefined) {
                model.estimateNumber = this.advanceFilters.estimateNumber;
            }
            delete model.proformaNumber;
        }
        delete model.q;
        return model;
    }

    /**
     * Apply search filters to advanceFilters
     *
     * @private
     * @param {string} search
     * @param {boolean} [resetPage=true]
     * @memberof VouchersPreviewComponent
     */
    private applySearchFilters(search: string, resetPage: boolean = true): void {
        if (resetPage) {
            this.pageNumberHistory = [1];
            this.advanceFilters.page = 1;
        }
        delete this.advanceFilters.q;
        this.advanceFilters.sort = '';
        this.advanceFilters.sortBy = '';
        delete this.advanceFilters.proformaNumber;
        delete this.advanceFilters.estimateNumber;
        delete this.advanceFilters.purchaseOrderNumber;
        this.isSearching = true;
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
    }

    /**
     * Page entry: param get-all + queryParams get-all + download-file
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private loadPreviewPage(): void {
        if (this.isInitialDualLoad) {
            return;
        }
        if (!this.params?.voucherUniqueName || !this.voucherType?.length) {
            this.getAllVouchers();
            return;
        }
        this.isInitialDualLoad = true;
        this.isUserSearchRequest = false;
        this.isSearching = false;
        this.isLookupVouchersInProgress = true;
        this.lookupVoucherItem = undefined;
        this.initialPageListResponse = undefined;
        this.initialPdfLoaded = false;
        this.loadPdfForRouteVoucher();
        this.fetchLookupVoucher(this.params.voucherUniqueName);
        this.getAllVouchers();
    }

    /**
     * Load PDF for route voucher without waiting for list response
     *
     * @private
     * @param {*} [voucherItem]
     * @memberof VouchersPreviewComponent
     */
    private loadPdfForRouteVoucher(voucherItem?: any): void {
        const uniqueName = this.params?.voucherUniqueName;
        if (!uniqueName) {
            return;
        }
        if (voucherItem) {
            this.selectedInvoice = voucherItem;
        } else if (!this.selectedInvoice || this.selectedInvoice.uniqueName === uniqueName) {
            this.selectedInvoice = { uniqueName };
        }
        if (this.needsFullDataForPdf() && !voucherItem) {
            return;
        }
        if (!this.initialPdfLoaded && !this.isVoucherDownloading && this.canDownloadPdf(this.selectedInvoice)) {
            this.initialPdfLoaded = true;
            this.downloadVoucherPdf('base64');
        }
    }

    /**
     * True when PDF download needs full voucher row data
     *
     * @private
     * @returns {boolean}
     * @memberof VouchersPreviewComponent
     */
    private needsFullDataForPdf(): boolean {
        return this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice || this.invoiceType.isPurchaseOrder;
    }

    /**
     * Resolve account unique name from list/lookup item shape
     *
     * @private
     * @param {*} invoice
     * @returns {string}
     * @memberof VouchersPreviewComponent
     */
    private getInvoiceAccountUniqueName(invoice: any): string {
        return invoice?.account?.uniqueName
            ?? invoice?.customerUniqueName
            ?? invoice?.accountUniqueName
            ?? invoice?.vendor?.uniqueName
            ?? '';
    }

    /**
     * True when selected row has data required for PDF download
     *
     * @private
     * @param {*} invoice
     * @returns {boolean}
     * @memberof VouchersPreviewComponent
     */
    private canDownloadPdf(invoice: any): boolean {
        if (!invoice?.uniqueName) {
            return false;
        }
        if (!this.needsFullDataForPdf()) {
            return true;
        }
        if (!this.getInvoiceAccountUniqueName(invoice)) {
            return false;
        }
        if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
            return !!(invoice.voucherNumber ?? invoice.proformaNumber ?? invoice.estimateNumber);
        }
        return true;
    }

    /**
     * Fetch single voucher by uniqueName for initial sidebar selection
     *
     * @private
     * @param {string} uniqueName
     * @memberof VouchersPreviewComponent
     */
    private fetchLookupVoucher(uniqueName: string): void {
        if (!uniqueName) {
            this.lookupVoucherItem = null;
            this.handleLookupVoucherComplete();
            return;
        }

        let lookupRequest$: Observable<any[]>;
        const inventoryVoucherType = this.getInventoryVoucherType();
        if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
            const model = this.buildProformaEstimateRequestModel({
                page: 1,
                count: 1,
                ...(this.voucherType === VoucherTypeEnum.generateProforma
                    ? { proformaNumber: uniqueName }
                    : { estimateNumber: uniqueName })
            });
            lookupRequest$ = this.voucherService.getAllProformaEstimate(model, this.voucherType).pipe(
                map((res) => res?.body?.items ?? [])
            );
        } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
            lookupRequest$ = this.voucherService.getPurchaseOrder(uniqueName).pipe(
                map((res) => res?.body ? [res.body] : [])
            );
        } else if (inventoryVoucherType) {
            const model = cloneDeep(this.advanceFilters);
            model.page = 1;
            model.count = 1;
            model.q = uniqueName;
            lookupRequest$ = this.voucherService.getAllInventoryVouchers(inventoryVoucherType, model).pipe(
                map((res) => {
                    const response = res?.body ?? {};
                    return Array.isArray(response)
                        ? response
                        : response.items ?? response.results ?? response.content ?? [];
                })
            );
        } else {
            const model = cloneDeep(this.advanceFilters);
            model.page = 1;
            model.count = 1;
            model.q = uniqueName;
            lookupRequest$ = this.voucherService.getAllVouchers(model, this.voucherType).pipe(
                map((res) => res?.body?.items ?? [])
            );
        }

        lookupRequest$.pipe(takeUntil(this.destroyed$)).subscribe({
            next: (items) => {
                const normalizedItems = this.normalizeVoucherListItems(items);
                this.lookupVoucherItem = normalizedItems[0] ?? null;
                if (this.lookupVoucherItem && this.needsFullDataForPdf() && !this.initialPdfLoaded) {
                    this.loadPdfForRouteVoucher(this.lookupVoucherItem);
                }
                this.handleLookupVoucherComplete();
            },
            error: () => {
                this.lookupVoucherItem = null;
                this.handleLookupVoucherComplete();
            }
        });
    }

    /**
     * Show lookup result early and hide loader after first (param) get-all API
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private handleLookupVoucherComplete(): void {
        this.isLookupVouchersInProgress = false;
        if (this.isInitialDualLoad) {
            this.invoiceList = this.lookupVoucherItem ? [this.lookupVoucherItem] : [];
            if (this.params?.voucherUniqueName) {
                this.setSelectedInvoice(this.params.voucherUniqueName, false, true);
            }
            this.changeDetection.detectChanges();
        }
        this.tryCompleteInitialDualLoad();
    }

    /**
     * Merge lookup item with page list after both initial APIs complete
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private tryCompleteInitialDualLoad(): void {
        if (!this.isInitialDualLoad || this.lookupVoucherItem === undefined || !this.initialPageListResponse) {
            return;
        }

        const response = this.initialPageListResponse;
        const routeUniqueName = this.params?.voucherUniqueName;
        this.totalPages = response?.totalPages ?? 0;

        if (this.pageNumberHistory[0] < response.page) {
            this.pageNumberHistory.push(response.page);
        } else if (!this.pageNumberHistory.includes(response.page)) {
            this.pageNumberHistory.unshift(response.page);
        }

        const pageItems = this.normalizeVoucherListItems(response.items);
        const filteredPageList = routeUniqueName
            ? pageItems.filter(item => item?.uniqueName !== routeUniqueName)
            : pageItems;
        this.invoiceList = this.lookupVoucherItem
            ? [this.lookupVoucherItem, ...filteredPageList]
            : filteredPageList;

        this.isLoadMore = false;
        this.getAllApiCallCount++;
        this.isInitialDualLoad = false;
        this.initialPageListResponse = undefined;
        this.changeDetection.detectChanges();

        if (routeUniqueName) {
            this.setSelectedInvoice(routeUniqueName, false, true);
        } else if (this.invoiceList?.length) {
            this.setSelectedInvoice(this.invoiceList[0].uniqueName, false, true);
        }
        this.isRefresh = false;
    }

    /**
     * Normalize voucher list items from API response
     *
     * @private
     * @param {any[]} items
     * @param {number} [startIndex=0]
     * @returns {any[]}
     * @memberof VouchersPreviewComponent
     */
    private normalizeVoucherListItems(items: any[] = [], startIndex: number = 0): any[] {
        const currentInvoiceList = [];
        items?.forEach((item: any, index: number) => {
            item.index = startIndex + index + 1;
                const isInventoryDocument = [VoucherTypeEnum.deliveryChallan, VoucherTypeEnum.receiptNote].includes(this.voucherType);
                
                if (isInventoryDocument) {
                    item.uniqueName = item.uniqueName ?? item.documentUniqueName;
                    item.voucherNumber = item.voucherNumber ?? item.documentNo ?? item.number;
                    item.voucherDate = item.voucherDate ?? item.documentDate ?? item.date;
                    item.account = item.account ?? item.party;
                    item.account = {
                        ...item.account,
                        customerName: item.account?.customerName ?? item.account?.name
                    };
                }

                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    item.isSelected = false;
                    item.uniqueName = item.proformaNumber || item.estimateNumber;
                    item.voucherNumber = item.proformaNumber || item.estimateNumber;
                    item.voucherDate = item.proformaDate || item.estimateDate;
                    const accountUniqueName = item.customerUniqueName ?? item.accountUniqueName ?? item.account?.uniqueName;
                    item.account = {
                        customerName: item.customerName ?? item.account?.customerName ?? item.account?.name,
                        uniqueName: accountUniqueName,
                        name: item.customerName ?? item.account?.name
                    };
                    if (accountUniqueName) {
                        item.customerUniqueName = accountUniqueName;
                    }
                }

                if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    item.uniqueName = item.uniqueName ?? item.poUniqueName;
                    item.voucherNumber = item.voucherNumber ?? item.number ?? item.purchaseOrderNumber;
                    if (item.account?.uniqueName && !item.vendor?.uniqueName) {
                        item.vendor = {
                            name: item.account.name ?? item.vendor?.name,
                            uniqueName: item.account.uniqueName
                        };
                    } else if (!item.vendor?.uniqueName && item.vendorUniqueName) {
                        item.vendor = {
                            name: item.vendor?.name ?? item.vendorName,
                            uniqueName: item.vendorUniqueName
                        };
                    }
                    if (!item.account?.uniqueName && item.vendor?.uniqueName) {
                        item.account = {
                            name: item.vendor.name,
                            uniqueName: item.vendor.uniqueName
                        };
                    }
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
        return currentInvoiceList;
    }

    /**
     * Select invoice after list get-all; download PDF only for user search
     *
     * @private
     * @param {boolean} fromUserSearch
     * @memberof VouchersPreviewComponent
     */
    private selectInvoiceAfterListLoad(fromUserSearch: boolean): void {
        const routeUniqueName = this.params?.voucherUniqueName;
        if (!this.invoiceList?.length) {
            return;
        }
        const targetUniqueName = routeUniqueName && this.invoiceList.some(voucher => voucher?.uniqueName === routeUniqueName)
            ? routeUniqueName
            : this.invoiceList[0]?.uniqueName;
        if (!targetUniqueName) {
            return;
        }
        if (fromUserSearch) {
            this.initialPdfLoaded = false;
            this.setSelectedInvoice(targetUniqueName);
            return;
        }
        this.setSelectedInvoice(targetUniqueName, false, this.initialPdfLoaded && !this.isRefresh);
    }

    /**
     * Handle Delete Voucher Dialog
     *
     * @memberof VouchersPreviewComponent
     */
    public deleteVoucherDialog(): void {
        if (this.getInventoryVoucherType()) {
            this.deleteInventoryDocument();
            return;
        }

        let confirmationMessages = [];
        this.localeData?.confirmation_messages?.map(message => {
            confirmationMessages[message.module] = message;
        });

        const configuration = this.generalService.getVoucherDeleteConfiguration(confirmationMessages[this.voucherType]?.title, confirmationMessages[this.voucherType]?.message1, confirmationMessages[this.voucherType]?.message2, this.commonLocaleData);

        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: "mat-dialog-md",
            data: {
                configuration: configuration
            },
            disableClose: true
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response === this.commonLocaleData?.app_yes) {
                if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.componentStore.deleteVoucher({
                        accountUniqueName: this.selectedInvoice?.account?.uniqueName, model: {
                            uniqueName: this.selectedInvoice?.uniqueName,
                            voucherType: this.voucherType
                        }
                    });
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    if (this.selectedInvoice?.uniqueName) {
                        this.componentStore.deleteSinglePOVoucher(this.selectedInvoice?.uniqueName);
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
                    this.componentStore.deleteEstimsteProformaVoucher({ payload: payload, voucherType: this.voucherType });
                } else {
                    const payload = {
                        voucherUniqueNames: [this.selectedInvoice?.uniqueName],
                        voucherType: this.voucherType
                    };
                    this.componentStore.bulkUpdateInvoice({ payload: payload, actionType: 'delete' });
                }
            }
        });
    }

    /**
     * Deletes delivery challan/receipt note
     *
     * @private
     * @memberof VouchersPreviewComponent
     */
    private deleteInventoryDocument(): void {
        if (!this.selectedInvoice?.uniqueName) {
            return;
        }

        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(
                    this.localeData?.delete_voucher,
                    this.commonLocaleData
                )
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response === this.commonLocaleData?.app_yes) {
                this.voucherService.deleteInventoryDocument(this.selectedInvoice.uniqueName)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((apiResponse) => {
                        if (apiResponse?.status === "success") {
                            this.toaster.showSnackBar("success", apiResponse?.message || this.commonLocaleData?.messages?.voucher_deleted);
                            this.redirectToGetAllPage();
                        } else {
                            this.toaster.showSnackBar("error", apiResponse?.message || this.commonLocaleData?.app_something_went_wrong);
                        }
                    });
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
            this.componentStore.purchaseOrderBulkUpdateAction({ payload: { purchaseNumbers }, actionType: actionType });
        } else if (event?.purchaseOrders) {
            this.componentStore.purchaseOrderBulkUpdateAction({ payload: event, actionType: actionType });
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
                this.componentStore.uploadFile({ postRequestObject: { file: blob, fileName: file.name } });
            });
        }
    }

    /**
     * Download Invoice PDF
     *
     * @return {*}  {void}
     * @memberof VouchersPreviewComponent
     */
    public downloadSignedInvoicePdf(): void {
        if (!this.selectedInvoice) {
            return;
        }
        this.dscSignDialogService.openDownloadSignedInvoiceDialog({
            voucher: this.selectedInvoice,
            voucherType: this.voucherType
        });
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
                return saveAs(this.selectedInvoice.blob, `${this.selectedInvoice?.account?.name ?? this.selectedInvoice?.account?.customerName} - ${this.selectedInvoice.voucherNumber}.pdf`);
            } else {
                return;
            }
        } else if ([VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.payment, VoucherTypeEnum.receipt].includes(this.voucherType)) {
            if (this.selectedInvoice?.hasAttachment) {
                this.openDownloadVoucher();
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
                this.openDownloadVoucher();
            }
        } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
            saveAs(this.attachedDocumentBlob, this.localeData?.download_po_filename);
        } else {
            this.openDownloadVoucher();
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
            printWindow.document?.close();
            printWindow?.focus();
            printWindow?.print();
        }
    }

    /**
     * This will use for thermal print
     *
     * @memberof VouchersPreviewComponent
     */
    public printThermal(): void {
        let hasPrinted = false;
        this.componentStore.createEwayBill$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && this.selectedInvoice?.uniqueName === response.uniqueName) {
                if (!hasPrinted) {
                    hasPrinted = true;
                    this.thermalService.print(this.defaultThermalTemplate, response);
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
     * Handle Edit/Copy voucher redirect to voucher edit/create page with respective voucher
     *
     * @memberof VouchersPreviewComponent
     */
    public editCopyVoucher(actionType: 'edit' | 'copy' = 'edit'): void {
        const queryParams = {
            from: this.advanceFilters.from,
            to: this.advanceFilters.to,
            page: this.advanceFilters.page,
            count: this.advanceFilters.count ?? PAGINATION_LIMIT
        }

        const searchString = this.advanceFilters.q ?? this.advanceFilters.proformaNumber ?? this.advanceFilters.estimateNumber ?? this.advanceFilters.purchaseOrderNumber;
        if (actionType === 'edit' && searchString?.length) {
            queryParams['search'] = searchString;
        }

        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            this.router.navigate([`/pages/vouchers/estimates/${this.selectedInvoice?.account?.uniqueName}/${this.selectedInvoice?.voucherNumber}/${actionType}`], { queryParams: queryParams });
        } else if (this.voucherType === VoucherTypeEnum.generateProforma) {
            this.router.navigate([`/pages/vouchers/proformas/${this.selectedInvoice?.account?.uniqueName}/${this.selectedInvoice?.voucherNumber}/${actionType}`], { queryParams: queryParams });
        } else {
            this.router.navigate([`/pages/vouchers/${this.urlVoucherType}/${this.selectedInvoice?.account?.uniqueName ?? this.selectedInvoice?.vendor?.uniqueName}/${this.selectedInvoice?.uniqueName}/${actionType}`], { queryParams: queryParams });
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
        this.isRefresh = true;
        if (action) {
            if (this.invoiceType.isPurchaseOrder) {
                action = action === "cancel" ? "cancelled" : action;
                this.componentStore.purchaseOrderStatusUpdate({ accountUniqueName: this.selectedInvoice?.vendor?.uniqueName, payload: { action: action, purchaseNumber: this.selectedInvoice?.voucherNumber } });
            } else {
                this.componentStore.actionVoucher({ voucherUniqueName: this.selectedInvoice?.uniqueName, payload: { action: action } });
            }
        } else {
            this.componentStore.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
        }
    }

    /**
     * Handle Cancel Voucher Dialog
     *
     * @param {*} voucher
     * @memberof VouchersPreviewComponent
     */
    public openCancelVoucherDialog(action: any): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.cancel_voucher_confirmation_message, this.commonLocaleData)
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.actionVoucher(action);
            }
        });
    }


    /**
     * Handle Estimate Proforma Actions API Call
     *
     * @param {string} action
     * @memberof VouchersPreviewComponent
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
        this.componentStore.actionEstimateProforma({
            request: model,
            voucherType: this.selectedInvoice?.voucherType ?? this.voucherType
        });
    }

    /**
     * Convert To Invoice API Call
     *
     * @memberof VouchersPreviewComponent
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

        this.componentStore.convertToInvoice({
            request: model,
            voucherType: this.voucherType
        });
    }

    /**
     * Convert To Proforma API Call
     *
     * @memberof VouchersPreviewComponent
     */
    public convertToProforma(): void {
        this.componentStore.convertToProforma({
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
    public redirectToGetAllPage(): void {
        if (!this.queryParams.isRecurringVoucher) {
            const isInventoryDocument = !!this.getInventoryVoucherType();
            this.router.navigate([`/pages/vouchers/preview/${this.urlVoucherType}/list`], {
                queryParams: isInventoryDocument
                    ? { required: 'module', module: 'list' }
                    : {
                        page: this.queryParams.page ?? 1,
                        count: this.queryParams.count ?? PAGINATION_LIMIT,
                        from: this.advanceFilters.from,
                        to: this.advanceFilters.to
                    }
            });
        } else {
            this.router.navigate([`/pages/vouchers/view/${this.urlVoucherType}/recurring/${this.queryParams.recurringVoucherUniqueName}`], {
                queryParams: {
                    page: this.queryParams.page ?? 1,
                    count: this.queryParams.count ?? PAGINATION_LIMIT,
                    from: this.advanceFilters.from,
                    to: this.advanceFilters.to,
                    recurringVoucherUniqueName: this.queryParams.recurringVoucherUniqueName
                }
            });
        }
    }

    /**
     * Return true when select invoice status will show
     *
     * @return {*}  {boolean}
     * @memberof VouchersPreviewComponent
     */
    public isShowInvoiceStatus(): boolean {
        if (((this.invoiceType.isSalesInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) && (this.selectedInvoice?.balanceStatus === 'CANCEL')) || (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) || (this.invoiceType.isPurchaseOrder && this.selectedInvoice?.status === 'cancelled')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This will return voucher log text
     *
     * @param {*} log
     * @returns {string}
     * @memberof VouchersPreviewComponent
     */
    public getVoucherLogText(log: any): string {
        let voucherLog = this.localeData?.voucher_log;
        voucherLog = voucherLog?.replace("[ACTION]", log.action)?.replace("[TOTAL]", log.grandTotal)?.replace("[USER]", log.user?.name);
        return voucherLog;
    }

    /**
     * Get Voucher Versions list API call
     *
     * @private
     * @param {*} selectedInvoice
     * @memberof VouchersPreviewComponent
     */
    private getVoucherVersions(selectedInvoice: any): void {
        const model = {
            getRequestObject: {
                accountUniqueName: this.getInvoiceAccountUniqueName(selectedInvoice),
                voucherUniqueName: selectedInvoice.uniqueName
            },
            postRequestObject: {},
            voucherType: this.voucherType,
            page: 1,
            count: 15
        };

        model.postRequestObject[this.voucherType === VoucherTypeEnum.generateProforma ? 'proformaNumber' : 'estimateNumber'] = selectedInvoice?.voucherNumber;
        this.componentStore.getVoucherVersions({ ...model });
    }

    /**
     * Filter Voucher Versions
     *
     * @param {boolean} showMore
     * @memberof VouchersPreviewComponent
     */
    public filterVoucherVersions(showMore: boolean): void {
        this.filteredVoucherVersions = this.voucherVersions?.slice(0, showMore ? 14 : 2);
        this.moreLogsDisplayed = showMore;
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
