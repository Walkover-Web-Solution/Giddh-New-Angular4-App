import { Component, OnInit, TemplateRef, Input, OnChanges, SimpleChanges, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal'
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { Router, NavigationStart } from '@angular/router';
import { GIDDH_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { ReplaySubject, fromEvent } from 'rxjs';
import { OnboardingFormRequest } from '../../models/api-models/Common';
import { VAT_SUPPORTED_COUNTRIES } from '../../app.constant';
import { CommonActions } from '../../actions/common.actions';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { saveAs } from 'file-saver';
import { PurchaseOrderActions } from '../../actions/purchase-order/purchase-order.action';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from '../../services/general.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
    selector: 'purchase-order-preview',
    templateUrl: './purchase-order-preview.component.html',
    styleUrls: ['./purchase-order-preview.component.scss']
})

export class PurchaseOrderPreviewComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    /* Taking input of all purchase orders */
    @Input() public purchaseOrders: any;
    /* Taking input of company unique name */
    @Input() public companyUniqueName: any;
    /* Taking input of purchase order unique name */
    @Input() public purchaseOrderUniqueName: any;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    @Input() public isCompany: boolean;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Search element */
    @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
    /* Confirm box */
    @ViewChild('poConfirmationModel') public poConfirmationModel: ModalDirective;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview') attachedDocumentPreview: ElementRef;
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Instance of perfect scrollbar */
    @ViewChild('perfectScrollbar', { static: false }) public perfectScrollbar: PerfectScrollbarComponent;
    /* Modal instance */
    public modalRef: BsModalRef;
    /* This will hold state of activity history aside pan */
    public revisionHistoryAsideState: string = 'out';
    /* This will hold purchase order data */
    public purchaseOrder: any = {};
    /* Send email request params object */
    public sendEmailRequest: any = {};
    /* This will hold if it's loading or not */
    public isLoading: boolean = false;
    /* This will hold giddh date format */
    public giddhDateFormat: any = GIDDH_DATE_FORMAT_UI;
    /* This will hold inventory settings */
    public inventorySettings: any;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold the filtered orders */
    public filteredData: any[] = [];
    /* This will hold if we need to show GST */
    public showGSTINNo: boolean;
    /* This will hold if we need to show TRN */
    public showTRNNo: boolean;
    /* This will hold selected company details */
    public selectedCompany: any;
    /* This will hold list of vat supported countries */
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    /* This will hold form fields */
    public formFields: any[] = [];
    /* True, if the Giddh supports the taxation of the country (not supported now: UK, US, Nepal, Australia) */
    public shouldShowTrnGstField: boolean = false;
    /* Onboarding params object */
    public onboardingFormRequest: OnboardingFormRequest = { formName: 'onboarding', country: '' };
    /* This will hold if pdf preview loaded */
    public pdfPreviewLoaded: boolean = false;
    /* This will hold if pdf preview has error */
    public pdfPreviewHasError: boolean = false;
    /** Stores the BLOB of attached document */
    private attachedDocumentBlob: Blob;
    /** This will hold the search value */
    public poSearch: any = "";
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /** True if left sidebar is expanded */
    private isSidebarExpanded: boolean = false;

    constructor(
        private store: Store<AppState>,
        private modalService: BsModalService,
        public purchaseOrderService: PurchaseOrderService,
        private toaster: ToasterService,
        public router: Router,
        private commonActions: CommonActions,
        private invoiceActions: InvoiceActions,
        private purchaseOrderActions: PurchaseOrderActions,
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService
    ) {
        
    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public ngOnInit(): void {
        if(document.getElementsByClassName("sidebar-collapse")?.length > 0) {
            this.isSidebarExpanded = false;
        } else {
            this.isSidebarExpanded = true;
            this.generalService.collapseSidebar();
        }
        document.querySelector('body').classList.add('setting-sidebar-open');
        this.getInventorySettings();
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());

        this.getPurchaseOrder();

        if (this.purchaseOrders && this.purchaseOrders.items) {
            this.filteredData = this.purchaseOrders.items;

            if (this.poSearch) {
                this.filterPo(this.poSearch);
            }
            this.scrollToActiveItem();
        }

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
            }
        });

        this.store.pipe(select(state => state.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
                if (this.formFields && this.formFields['taxName']) {
                    this.shouldShowTrnGstField = true;
                } else {
                    this.shouldShowTrnGstField = false;
                }
            }
        });

        this.store.pipe(select(state => state.purchaseOrder.poSearch), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.poSearch = res;
                if (this.searchElement && this.searchElement.nativeElement) {
                    this.searchElement.nativeElement.value = this.poSearch;
                }
            }
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                if (!event.url.includes('/purchase-order/edit')) {
                    this.store.dispatch(this.purchaseOrderActions.serPurchaseOrderPreviewSearch(null));
                }
            }
        });
    }

    /**
     * This will update the value of input variables on change
     *
     * @param {SimpleChanges} changes
     * @memberof PurchaseOrderPreviewComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.purchaseOrders && changes.purchaseOrders.currentValue && changes.purchaseOrders.currentValue.items) {
            this.filteredData = changes.purchaseOrders.currentValue.items;
            if (this.poSearch) {
                this.filterPo(this.poSearch);
            }
            this.scrollToActiveItem();
        }

        if (changes.purchaseOrderUniqueName && changes.purchaseOrderUniqueName.currentValue && changes.purchaseOrderUniqueName.currentValue !== this.purchaseOrder?.uniqueName) {
            this.purchaseOrderUniqueName = changes.purchaseOrderUniqueName.currentValue;
            this.getPurchaseOrder();
        }
    }

    /**
     * This will get called after component has initialized
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public ngAfterViewInit(): void {
        this.searchElement?.nativeElement.focus();
        fromEvent(this.searchElement?.nativeElement, 'input')
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((event: any) => event.target?.value),
                takeUntil(this.destroyed$)
            )
            .subscribe((term => {
                this.filterPo(term);
                this.store.dispatch(this.purchaseOrderActions.serPurchaseOrderPreviewSearch(term));
            }))
    }

    /**
     * This will get the purchase order details
     *
     * @returns {void}
     * @memberof PurchaseOrderPreviewComponent
     */
    public getPurchaseOrder(): void {
        if (this.isLoading) {
            return;
        }

        this.pdfPreviewHasError = false;
        this.pdfPreviewLoaded = false;
        this.isLoading = true;
        let getRequest = { companyUniqueName: this.companyUniqueName, poUniqueName: this.purchaseOrderUniqueName };
        this.purchaseOrderService.get(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response) {
                if (response.status === "success") {
                    this.purchaseOrder = response.body;

                    this.getPdf();

                    if (this.purchaseOrder && this.purchaseOrder.account && this.purchaseOrder.account.billingDetails?.country) {
                        this.showGstAndTrnUsingCountry(this.purchaseOrder.account.billingDetails?.country.countryCode, this.purchaseOrder.account.billingDetails?.country.countryName);
                    } else {
                        this.showGstAndTrnUsingCountry('', '');
                    }
                } else {
                    this.toaster.errorToast(response.message);
                }
            } else {
                this.router.navigate(['/pages/purchase-management/purchase']);
            }
        });
    }

    /**
     * This will toggle the activity history aside pan
     *
     * @param {*} [event]
     * @memberof PurchaseOrderPreviewComponent
     */
    public toggleActivityHistoryAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.revisionHistoryAsideState = this.revisionHistoryAsideState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * This will toggle the fixed class on body
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public toggleBodyClass(): void {
        if (this.revisionHistoryAsideState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * This will open the send email modal
     *
     * @param {TemplateRef<any>} template
     * @memberof PurchaseOrderPreviewComponent
     */
    public openSendMailModal(template: TemplateRef<any>): void {
        this.sendEmailRequest.email = this.purchaseOrder.account.email;
        this.sendEmailRequest.uniqueName = this.purchaseOrder?.uniqueName;
        this.sendEmailRequest.accountUniqueName = this.purchaseOrder.account?.uniqueName;
        this.sendEmailRequest.companyUniqueName = this.companyUniqueName;
        this.modalRef = this.modalService.show(template);
    }

    /**
     * This will change the selected purchase order
     *
     * @param {*} poUniqueName
     * @memberof PurchaseOrderPreviewComponent
     */
    public showPurchaseOrderPreview(poUniqueName: any): void {
        this.router.navigate(['/pages/purchase-management/purchase-orders/preview/' + poUniqueName]);
    }

    /**
     * This will close the send email popup
     *
     * @param {*} event
     * @memberof PurchaseOrderPreviewComponent
     */
    public closeSendMailPopup(event: any): void {
        if (event) {
            this.modalRef.hide();
        }
    }

    /**
     * This will close the confirmation modal
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public closeConfirmationPopup(): void {
        this.poConfirmationModel.hide();
    }

    /**
     * This will delete the purchase order
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public deleteItem(): void {
        let getRequest = { companyUniqueName: this.companyUniqueName, poUniqueName: this.purchaseOrder?.uniqueName };

        this.purchaseOrderService.delete(getRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                if (res.status === 'success') {
                    this.closeConfirmationPopup();
                    this.toaster.successToast(res.body);
                    this.router.navigate(['/pages/purchase-management/purchase']);
                } else {
                    this.closeConfirmationPopup();
                    this.toaster.errorToast(res.message);
                }
            }
        });
    }

    /**
     * This will show the confirmation modal
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public confirmDelete(): void {
        this.poConfirmationModel?.show();
    }

    /**
     * This will update the status of purchase order
     *
     * @param {*} action
     * @memberof PurchaseOrderPreviewComponent
     */
    public statusUpdate(action: any): void {
        if (this.purchaseOrder && this.purchaseOrder.number) {
            let getRequest = { companyUniqueName: this.companyUniqueName, accountUniqueName: this.purchaseOrder.account?.uniqueName };
            let postRequest = { purchaseNumber: this.purchaseOrder.number, action: action };

            this.purchaseOrderService.statusUpdate(getRequest, postRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        this.getPurchaseOrder();
                        this.toaster.successToast(res.body);
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                }
            });
        } else {
            this.toaster.errorToast(this.localeData?.invalid_po);
        }
    }

    /**
     * This function is used to get inventory settings from store
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public getInventorySettings(): void {
        this.store.pipe(select((s: AppState) => s.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings && settings.companyInventorySettings) {
                this.inventorySettings = settings.companyInventorySettings;
            }
        });
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public ngOnDestroy() {
        if(this.isSidebarExpanded) {
            this.isSidebarExpanded = false;
            this.generalService.expandSidebar();
        }
        document.querySelector('body').classList.remove('setting-sidebar-open');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will show/hide GST/TRN based on country
     *
     * @private
     * @param {string} code
     * @param {string} name
     * @memberof PurchaseOrderPreviewComponent
     */
    private showGstAndTrnUsingCountry(code: string, name: string): void {
        if (this.selectedCompany?.country === name) {
            if (name === 'India') {
                this.showGSTINNo = true;
                this.showTRNNo = false;
                this.getOnboardingForm('IN')
            } else if (this.vatSupportedCountries.includes(code)) {
                this.showGSTINNo = false;
                this.showTRNNo = true;
                this.getOnboardingForm(code);
            }
        } else {
            this.showGSTINNo = false;
            this.showTRNNo = false;
        }
    }

    /**
     * To fetch regex call for onboarding countries (gulf)
     *
     * @param {*} countryCode
     * @memberof PurchaseOrderPreviewComponent
     */
    public getOnboardingForm(countryCode): void {
        this.onboardingFormRequest.country = countryCode;
        this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
    }

    /**
     * This will convert the purchase order to bill
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public convertToBill(): void {
        let purchaseNumbers = [this.purchaseOrder.number];
        let bulkUpdateGetParams = { action: "create_purchase_bill", companyUniqueName: this.purchaseOrder.company?.uniqueName };
        let bulkUpdatePostParams = { purchaseNumbers: purchaseNumbers };

        this.purchaseOrderService.bulkUpdate(bulkUpdateGetParams, bulkUpdatePostParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                if (res.status === 'success') {
                    this.toaster.successToast(res.body);
                } else {
                    this.toaster.errorToast(res.message);
                }
            }
        });
    }

    /**
     * This will get pdf preview
     *
     * @memberof PurchaseOrderPreviewComponent
     */
    public getPdf(): void {
        let getRequest = { companyUniqueName: this.companyUniqueName, accountUniqueName: this.purchaseOrder.account?.uniqueName, poUniqueName: this.purchaseOrderUniqueName };

        this.purchaseOrderService.getPdf(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                let blob: Blob = this.generalService.base64ToBlob(response.body, 'application/pdf', 512);
                this.attachedDocumentBlob = blob;
                const file = new Blob([blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                this.pdfPreviewLoaded = true;
            } else {
                this.pdfPreviewHasError = true;
            }
        });
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

    /**
     * This will filter the purchase orders
     *
     * @param {*} term
     * @memberof PurchaseOrderPreviewComponent
     */
    public filterPo(term): void {
        this.poSearch = term;
        this.filteredData = this.purchaseOrders.items?.filter(item => {
            return item.voucherNumber?.toLowerCase().includes(term?.toLowerCase()) ||
                item.vendor.name?.toLowerCase().includes(term?.toLowerCase()) ||
                item.voucherDate.includes(term) ||
                item.grandTotal.amountForAccount?.toString()?.includes(term);
        });
    }

    /**
     * Scrolls to active item in the list
     *
     * @private
     * @memberof PurchaseOrderPreviewComponent
     */
    private scrollToActiveItem(): void {
        setTimeout(() => {
            this.perfectScrollbar?.directiveRef?.scrollToElement(".single-invoice-detail.activeItem");
        }, 200);
    }
}
