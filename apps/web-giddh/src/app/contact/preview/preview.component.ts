import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, delay, distinctUntilChanged, merge, Observable, ReplaySubject, takeUntil } from "rxjs";      
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { PAGINATION_LIMIT } from "../../app.constant";
import { FormControl } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { OrganizationType } from "../../models/user-login-state";
import { SafeUrl } from "@angular/platform-browser";
import { ContactComponentStore } from "../utility/contact.store";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"],
    providers: [ContactComponentStore]
})
export class ContactPreviewComponent implements OnInit, OnDestroy {
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
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold day js reference */
    public dayjs: any = dayjs;
    /** Index of selected tab */
    public selectedTabIndex: number = 0;
    /** Active tab name */
    public activeTab: string;
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
    /** Holds Image dynamic path for electron and web application */
    public imgPath: string = '';
    /** Holds true when need to refresh page */
    private isRefresh: boolean = null;
    /** Last vouchers get in progress Observable */
    public getAccountsInProgress$: Observable<any> = this.componentStore.getLastAccountsInProgress$;
    public selectedTab: string = 'address';

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private componentStore: ContactComponentStore,
        private activatedRoute: ActivatedRoute,
        private generalService: GeneralService,
        private changeDetection: ChangeDetectorRef
    ) { }


    /**
    * Initializes the component
    *
    * @memberof ContactPreviewComponent
    */
    public ngOnInit(): void {
        merge(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                if (params?.voucherType) {
                    this.params = params;
                    this.isSearching = false;
                    this.urlVoucherType = params?.voucherType;
                    this.subscribeStoreObservable();
                }
                if (params?.page) {
                    this.queryParams = params;
                    this.advanceFilters.page = Number(params.page);
                    this.advanceFilters.count = params.count ? Number(params.count) : PAGINATION_LIMIT;
                    this.advanceFilters.from = params.from ?? '';
                    this.advanceFilters.to = params.to ?? '';
                    const searchString = params.search;
                    if (searchString) {
                        this.search.setValue(searchString);
                    } else {
                        this.getAllVouchers();
                    }
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
                    count: PAGINATION_LIMIT,
                    q: '',
                    sort: '',
                    sortBy: ''
                };
                this.isSearching = true;
                this.advanceFilters.q = search;
                this.getAllVouchers();
            }
        });
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof ContactPreviewComponent
    */
    public translationComplete(event: any): void {
        if (event) {
        }
    }

    /**
     * Subscribe all required store observable
     *
     * @private
     * @memberof ContactPreviewComponent
     */
    private subscribeStoreObservable(): void {
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
                    count: PAGINATION_LIMIT,
                    q: '',
                    sort: '',
                    sortBy: ''
                };
                this.invoiceList = [];
                this.generalService.updateActivatedRouteQueryParams({ from: this.advanceFilters.from, to: this.advanceFilters.to });
            }
        });

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

        // if (this.voucherType?.length) {
        //     if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
        //         this.componentStore.getPreviousProformaEstimates({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
        //     } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
        //         this.componentStore.getPurchaseOrders({ request: cloneDeep(this.advanceFilters) });
        //     } else {
        //         this.componentStore.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
        //     }
        // }
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

                // if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                //     item.isSelected = false;
                //     item.uniqueName = item.proformaNumber || item.estimateNumber;
                //     item.voucherNumber = item.proformaNumber || item.estimateNumber;
                //     item.voucherDate = item.proformaDate || item.estimateDate;
                //     item.account = { customerName: item.customerName, uniqueName: item.customerUniqueName };
                // }

                // if (this.voucherType === VoucherTypeEnum.purchase) {
                //     let dueDate = item.dueDate ? dayjs(item.dueDate, GIDDH_DATE_FORMAT) : null;
                //     if (dueDate) {
                //         if (dueDate.isAfter(dayjs()) || ['paid', 'cancel'].includes(item.balanceStatus)) {
                //             item.dueDays = null;
                //         } else {
                //             let dueDays = dueDate ? dayjs().diff(dueDate, 'day') : null;
                //             item.dueDays = dueDays;
                //         }
                //     } else {
                //         item.dueDays = null;
                //     }
                // }
                currentInvoiceList.push(item);
            });

            if ((this.isSearching || (this.advanceFilters.page === 1) && (this.pageNumberHistory.length === 1)) || this.isRefresh) {
                this.invoiceList = currentInvoiceList;
            } else {
                this.invoiceList = this.advanceFilters.page === this.pageNumberHistory[this.pageNumberHistory.length - 1] ? [...this.invoiceList, ...currentInvoiceList] : [...currentInvoiceList, ...this.invoiceList];
            }
            this.isLoadMore = false;
            this.getAllApiCallCount++;
            this.changeDetection.detectChanges();

            if (this.invoiceList?.length) {
                // this.setSelectedInvoice(!this.selectedInvoice ? this.params.voucherUniqueName : this.invoiceList[0].uniqueName);
            }
            this.isRefresh = false;
        }
    }

    /**
     * Back to last page
     *
     * @memberof ContactPreviewComponent
     */
    public redirectToGetAllPage(): void {
        this.router.navigate([`/pages/vouchers/preview/${this.urlVoucherType}/list`], {
            queryParams: {
                page: this.queryParams.page ?? 1,
                count: this.queryParams.count ?? PAGINATION_LIMIT,
                from: this.advanceFilters.from,
                to: this.advanceFilters.to
            }
        });
    }

    /**
     * Handle Tab Change event
     *
     * @param {*} activeTab
     * @memberof ContactPreviewComponent
     */
    public tabChanged(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof ContactPreviewComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
