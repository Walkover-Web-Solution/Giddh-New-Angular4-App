import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, delay, distinctUntilChanged, merge, Observable, ReplaySubject, takeUntil } from "rxjs";
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
import { ThermalService } from "../../services/thermal.service";
import { ToasterService } from "../../services/toaster.service";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { InvoiceReceiptActions } from "../../actions/invoice/receipt/receipt.actions";
import { saveAs } from 'file-saver';
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { AdjustAdvancePaymentModal, VoucherAdjustments } from "../../models/api-models/AdvanceReceiptsAdjust";
import { AdjustmentUtilityService } from "../../shared/advance-receipt-adjustment/services/adjustment-utility.service";
import { DownloadVoucherComponent } from "../download-voucher/download-voucher.component";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    providers: [VoucherComponentStore]
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
    public isVoucherDownloadError: boolean = false;;
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
        private changeDetection: ChangeDetectorRef,
        private invoiceReceiptActions: InvoiceReceiptActions,
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
                    this.isSearching = false;
                    this.urlVoucherType = params?.voucherType;
                    this.voucherType = this.vouchersUtilityService.parseVoucherType(params?.voucherType);
                    this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
                    this.showPaymentDetails = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote].includes(this.voucherType);
                    this.getCreatedTemplates();
                    this.subscribeStoreObservable();
                }
                if (params?.page) {
                    this.queryParams = params;
                    this.advanceFilters.page = Number(params.page);
                    this.advanceFilters.from = params.from ?? '';
                    this.advanceFilters.to = params.to ?? '';
                    this.getAllVouchers();
                }
            }
        });
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.search.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                // Reset Filter
                this.pageNumberHistory = [1];
                this.advanceFilters = {
                    page: 1,
                    from: this.advanceFilters.from,
                    to: this.advanceFilters.to,
                    count: this.advanceFilters.count,
                    q: '',
                    sort: '',
                    sortBy: ''
                };

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
                this.getAllVouchers();
            }
        });
    }

    /**
     * Set selected invoice and download PDF Preview
     *
     * @param {string} voucherUniqueName
     * @memberof VouchersPreviewComponent
     */
    public setSelectedInvoice(voucherUniqueName: string): void {
        if (this.selectedInvoice?.uniqueName === voucherUniqueName) {
            return;
        }

        this.selectedInvoice = this.invoiceList?.find(voucher => voucher?.uniqueName === voucherUniqueName);
        if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
            this.getVoucherVersions(this.selectedInvoice);
        }
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
        this.componentStore.getCreatedTemplates((this.invoiceType.isDebitNote || this.invoiceType.isCreditNote) ? 'voucher' : 'invoice');
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
                // Reset
                this.isSearching = false;
                this.isLoadMore = false;
                this.pageNumberHistory = [1];
                this.advanceFilters = {
                    page: 1,
                    from: dayjs(response[0]).format(GIDDH_DATE_FORMAT),
                    to: dayjs(response[1]).format(GIDDH_DATE_FORMAT),
                    count: this.advanceFilters.count,
                    q: '',
                    sort: '',
                    sortBy: ''
                };
                this.invoiceList = [];
                this.generalService.updateActivatedRouteQueryParams({ from: this.advanceFilters.from, to: this.advanceFilters.to });
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
            }
        });

        this.componentStore.convertToProformaIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toaster.showSnackBar("success", this.localeData?.proforma_generated);
            }
        });

        this.componentStore.createdTemplates$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const defaultThermalTemplate = response?.filter(response => response.templateType === 'thermal_template');
                if (defaultThermalTemplate?.length > 0) {
                    this.defaultThermalTemplate = defaultThermalTemplate[0];
                }
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
     * @param {boolean} [isLoadMore=false]
     * @param {boolean} [isScrollUp=false]
     * @return {*}  {void}
     * @memberof VouchersPreviewComponent
     */
    private getAllVouchers(isLoadMore: boolean = false, isScrollUp: boolean = false): void {
        if (this.isLoadMore) {
            return;
        }
        if (isLoadMore) {
            this.isLoadMore = true;
            if (this.totalPages >= this.advanceFilters.page) {
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
                return;
            }
            if (!isScrollUp && (this.totalPages < this.advanceFilters.page)) {
                return
            }

            if (isScrollUp && this.advanceFilters.page === 0) {
                this.advanceFilters.page = 1;
                return
            }
        }

        if (this.voucherType?.length) {
            if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                this.componentStore.getPreviousProformaEstimates({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                this.componentStore.getPurchaseOrders({ request: cloneDeep(this.advanceFilters) });
            } else {
                this.componentStore.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
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
            data: { model: model, localeData: this.localeData, commonLocaleData: this.commonLocaleData },
            position: {
                top: '0',
                right: '0'
            },
            maxWidth: 'var(--aside-pane-width)',
            width: '100%',
            height: '100vh',
            maxHeight: '100vh',
            disableClose: true
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
    * @memberof VoucherListComponent
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
            if (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) {
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
            const currentInvoiceList = [];
            if (this.pageNumberHistory[0] < response.page) {
                this.pageNumberHistory.push(response.page);
            } else if (!this.pageNumberHistory.includes(response.page)) {
                this.pageNumberHistory.unshift(response.page);
            }
            this.totalPages = response?.totalPages;

            if (this.totalPages === 0) {
                this.invoiceList = [];
                return;
            }

            // Handle page number is more than total pages in query params
            if (this.totalPages < this.advanceFilters.page) {
                this.advanceFilters.page = 1;
                this.getAllVouchers();
                return;
            }
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

            if (this.isSearching && (this.advanceFilters.page === 1) && (this.pageNumberHistory.length === 1)) {
                this.invoiceList = currentInvoiceList;
            } else {
                this.invoiceList = this.advanceFilters.page === this.pageNumberHistory[this.pageNumberHistory.length - 1] ? [...this.invoiceList, ...currentInvoiceList] : [...currentInvoiceList, ...this.invoiceList];
            }
            this.isLoadMore = false;
            this.getAllApiCallCount++;
            this.changeDetection.detectChanges();

            if (this.invoiceList?.length) {
                this.setSelectedInvoice(!this.selectedInvoice ? this.params.voucherUniqueName : this.invoiceList[0].uniqueName);
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
    public downloadPdf(): void {
        if (this.isVoucherDownloading || this.isVoucherDownloadError) {
            return;
        }

        if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            if (this.selectedInvoice && this.selectedInvoice.blob) {
                return saveAs(this.selectedInvoice.blob, `${this.selectedInvoice?.account?.name} - ${this.selectedInvoice.voucherNumber}.pdf`);
            } else {
                return;
            }
        } else if (this.voucherType === VoucherTypeEnum.creditNote || this.voucherType === VoucherTypeEnum.debitNote) {
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
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
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
        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            this.router.navigate([`/pages/vouchers/estimates/${this.selectedInvoice?.account?.uniqueName}/${this.selectedInvoice?.voucherNumber}/${actionType}`]);
        } else if (this.voucherType === VoucherTypeEnum.generateProforma) {
            this.router.navigate([`/pages/vouchers/proformas/${this.selectedInvoice?.account?.uniqueName}/${this.selectedInvoice?.voucherNumber}/${actionType}`]);
        } else {
            this.router.navigate([`/pages/vouchers/${this.urlVoucherType}/${this.selectedInvoice?.account?.uniqueName ?? this.selectedInvoice?.vendor?.uniqueName}/${this.selectedInvoice?.uniqueName}/${actionType}`]);
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
                this.componentStore.purchaseOrderStatusUpdate({ accountUniqueName: this.selectedInvoice?.vendor?.uniqueName, payload: { action: action, purchaseNumber: this.selectedInvoice?.voucherNumber } });
            } else {
                this.componentStore.actionVoucher({ voucherUniqueName: this.selectedInvoice?.uniqueName, payload: { action: action, voucherType: this.voucherType } });
            }
        } else {
            this.componentStore.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
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
        this.componentStore.actionEstimateProforma({
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

        this.componentStore.convertToInvoice({
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
        this.router.navigate([`/pages/vouchers/preview/${this.urlVoucherType}/list`], {
            queryParams: {
                page: this.queryParams.page ?? 1,
                from: this.advanceFilters.from,
                to: this.advanceFilters.to
            }
        });
    }

    /**
     * Return true when select invoice status will show
     *
     * @return {*}  {boolean}
     * @memberof VouchersPreviewComponent
     */
    public isShowInvoiceStatus(): boolean {
        if (((this.invoiceType.isSalesInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) && (this.selectedInvoice?.balanceStatus === 'CANCEL')) || (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice)) {
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
                accountUniqueName: selectedInvoice.account?.uniqueName,
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
