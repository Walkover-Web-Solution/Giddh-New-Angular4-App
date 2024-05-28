import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FILE_ATTACHMENT_TYPE } from 'apps/web-giddh/src/app/app.constant';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { PurchaseRecordService } from 'apps/web-giddh/src/app/services/purchase-record.service';
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';
import { ThermalService } from 'apps/web-giddh/src/app/services/thermal.service';
import { saveAs } from 'file-saver';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { fromEvent, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { GeneralActions } from '../../../../actions/general/general.actions';
import { InvoiceReceiptActions } from '../../../../actions/invoice/receipt/receipt.actions';
import { ProformaActions } from '../../../../actions/proforma/proforma.actions';
import { InvoicePaymentRequest, InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { ProformaDownloadRequest, ProformaGetAllVersionRequest, ProformaVersionItem } from '../../../../models/api-models/proforma';
import { DownloadVoucherRequest } from '../../../../models/api-models/recipt';
import { ActionTypeAfterVoucherGenerateOrUpdate, VoucherTypeEnum } from '../../../../models/api-models/Sales';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';
import { ProformaService } from '../../../../services/proforma.service';
import { ReceiptService } from '../../../../services/receipt.service';
import { ToasterService } from '../../../../services/toaster.service';
import { AppState } from '../../../../store';
import { ProformaListComponent } from '../../../proforma/proforma-list.component';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { InvoiceTemplatesService } from 'apps/web-giddh/src/app/services/invoice.templates.service';
import { CommonActions } from 'apps/web-giddh/src/app/actions/common.actions';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'invoice-preview-details-component',
    templateUrl: './invoice-preview-details.component.html',
    styleUrls: [`./invoice-preview-details.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
    @ViewChild('showEmailSendModal', { static: true }) public showEmailSendModal: ModalDirective;
    @ViewChild('downloadVoucherModal', { static: true }) public downloadVoucherModal: ModalDirective;
    @ViewChild('invoiceDetailWrapper', { static: true }) invoiceDetailWrapperView: ElementRef;
    @ViewChild('invoicedetail', { static: true }) invoiceDetailView: ElementRef;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview', { static: true }) attachedDocumentPreview: ElementRef;
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** Instance of cdk scrollbar */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    @Input() public items: InvoicePreviewDetailsVm[];
    @Input() public selectedItem: InvoicePreviewDetailsVm;
    /** Emits the selected item to the parent for updating the current selected item in parent component */
    @Output() public selectedItemChange: EventEmitter<InvoicePreviewDetailsVm> = new EventEmitter<InvoicePreviewDetailsVm>();
    @Input() public appSideMenubarIsOpen: boolean;
    @Input() public invoiceSetting: InvoiceSetting;
    @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
    @Input() public voucherNoForDetail: string;
    @Input() public voucherDetailAction: string;
    @Input() public showPrinterDialogWhenPageLoad: boolean;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    @Input() public isCompany: boolean;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public deleteVoucher: EventEmitter<any> = new EventEmitter();
    @Output() public updateVoucherAction: EventEmitter<string> = new EventEmitter();
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    /** Event emmiter when user search voucher */
    @Output() public invoiceSearchEvent: EventEmitter<any> = new EventEmitter();
    @Output() public sendEmail: EventEmitter<string | { email: string, invoiceType: string[], invoiceNumber: string }> = new EventEmitter<string | { email: string, invoiceType: string[], invoiceNumber: string }>();
    @Output() public processPaymentEvent: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
    @Output() public refreshDataAfterVoucherUpdate: EventEmitter<boolean> = new EventEmitter();
    /** Event emmiter when advance receipt action selected */
    @Output() public onOpenAdvanceReceiptModal: EventEmitter<any> = new EventEmitter();
    modalRef: BsModalRef;
    public filteredData: InvoicePreviewDetailsVm[] = [];
    public showEditMode: boolean = false;
    public isSendSmsEnabled: boolean = false;
    public isVoucherDownloading: boolean = false;
    public isVoucherDownloadError: boolean = false;
    public only4ProformaEstimates: boolean;
    public emailList: string = '';
    public moreLogsDisplayed: boolean = true;
    public voucherVersions: ProformaVersionItem[] = [];
    public filteredVoucherVersions: ProformaVersionItem[] = [];
    public invoiceDetailWrapperHeight: number;
    public invoiceDetailViewHeight: number;
    public invoiceImageSectionViewHeight: number;
    public isMobileView = false;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public isFileUploading: boolean = false;
    /** True, if attachment upload is to be displayed */
    public shouldShowUploadAttachment: boolean = false;
    /** Source of image to be previewed */
    public imagePreviewSource: SafeUrl;
    /** Stores the type of attached document for Purchase Record */
    public attachedDocumentType: any;
    /** Stores the BLOB of attached document */
    private attachedDocumentBlob: Blob;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private isUpdateVoucherActionSuccess$: Observable<boolean>;
    public proformaListComponent: ProformaListComponent;
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
    /** This will hold the search value */
    @Input() public invoiceSearch: any = "";
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** Attached PDF file url created with blob */
    public attachedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /** This will hold the attached file in Purchase Bill */
    private attachedAttachmentBlob: Blob;
    /** True if left sidebar is expanded */
    private isSidebarExpanded: boolean = false;
    /** Observable to get observable store data of voucher */
    public voucherDetails$: Observable<any>;
    /** This will use for default template */
    public thermalTemplate: any;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** Holds selected item voucher */
    private selectedItemVoucher: any;
    /** True if pdf is available */
    public isPdfAvailable: boolean = true;
    /** False if template type is thermal */
    public showDownloadButton: boolean = true;

    constructor(
        private cdr: ChangeDetectorRef,
        private toaster: ToasterService,
        private proformaService: ProformaService,
        private receiptService: ReceiptService,
        private store: Store<AppState>,
        private proformaActions: ProformaActions,
        private breakPointObservar: BreakpointObserver,
        private router: Router,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceService: InvoiceService,
        private generalActions: GeneralActions,
        private generalService: GeneralService,
        private purchaseRecordService: PurchaseRecordService,
        private sanitizer: DomSanitizer,
        private salesService: SalesService,
        private modalService: BsModalService,
        private domSanitizer: DomSanitizer,
        private commonService: CommonService,
        private thermalService: ThermalService,
        private invoiceTemplatesService: InvoiceTemplatesService,
        private invoiceAction: InvoiceActions,
        private commonAction: CommonActions,
        private dialog: MatDialog) {
        this.breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result.matches;
        });
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.isUpdateVoucherActionSuccess$ = this.store.pipe(select(s => s.proforma.isUpdateProformaActionSuccess), takeUntil(this.destroyed$));
        this.voucherDetails$ = this.store.pipe(select((res) => res.receipt.voucher), takeUntil(this.destroyed$));
    }

    /**
     * Returns true if print button needs to be displayed
     *
     * @readonly
     * @type {boolean}
     * @memberof InvoicePreviewDetailsComponent
     */
    public get shouldShowPrintDocument(): boolean {
        return this.selectedItem && (this.selectedItem.voucherType !== VoucherTypeEnum.purchase ||
            (this.selectedItem.voucherType === VoucherTypeEnum.purchase && this.pdfPreviewLoaded) ||
            (this.selectedItem.voucherType === VoucherTypeEnum.purchase && this.attachedDocumentType &&
                (this.attachedDocumentType.type === 'pdf' || this.attachedDocumentType.type === 'image')));
    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.invoiceTemplatesService.getAllCreatedTemplates("sales").pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                const thermalTemplate = res.body?.filter(res => res.templateType === 'thermal_template');
                if (thermalTemplate?.length > 0) {
                    this.thermalTemplate = thermalTemplate[0];
                }
            }
        });
        if (document.getElementsByClassName("sidebar-collapse")?.length > 0) {
            this.isSidebarExpanded = false;
        } else {
            this.isSidebarExpanded = true;
            this.generalService.collapseSidebar();
        }
        document.querySelector('body').classList.add('setting-sidebar-open');
        document.querySelector('body').classList.add('update-scroll-hidden');
        document.querySelector('body').classList.add('voucher-preview-edit');
        if (this.selectedItem) {
            if (!this.isVoucherDownloading) {
                this.downloadVoucher('base64');
            }
            this.only4ProformaEstimates = [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType);

            if (this.only4ProformaEstimates) {
                this.getVoucherVersions();
            }

            this.getLinkedPurchaseOrders();
        }

        this.store.pipe(select(s => s.proforma.activeVoucherVersions), takeUntil(this.destroyed$)).subscribe((versions => {
            if (versions && versions) {
                this.voucherVersions = versions;
                this.filterVoucherVersions(false);
                this.detectChanges();
            }
        }));
        this.isUpdateVoucherActionSuccess$.subscribe(res => {
            if (res && this.proformaListComponent) {
                // get all data again because we are updating action in list page so we have to update data i.e we have to fire this
                this.proformaListComponent.getAll();
            }
        });

        this.companyName$.pipe(take(1)).subscribe(companyUniqueName => this.companyUniqueName = companyUniqueName);

        this.store.pipe(select(s => s.common?.selectPrinter), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.store.dispatch(this.commonAction.selectPrinter(null));
                const configuration = this.generalService.getPrinterSelectionConfiguration(response, this.commonLocaleData);

                let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                    width: '630px',
                    data: {
                        configuration: configuration
                    }
                });

                dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    document.querySelector('body').classList.remove('fixed');
                    if (response !== "Close") {
                        this.generalService.setParameterInLocalStorage("defaultPrinter", response);
                        this.printThermal();
                    }
                });
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('items' in changes && changes.items.currentValue?.filter(newItem => (!changes?.items?.previousValue || changes?.items?.previousValue?.every(oldItem => oldItem?.uniqueName !== newItem?.uniqueName)))?.length) {
            this.filteredData = changes.items.currentValue;
            if (this.selectedItem && this.selectedItem?.uniqueName) {
                this.selectedItem = this.filteredData?.filter(item => {
                    return item?.uniqueName === this.selectedItem?.uniqueName;
                })[0];
            }
            if (this.invoiceSearch && this.searchElement && this.searchElement.nativeElement) {
                this.searchElement.nativeElement.value = this.invoiceSearch;
                this.filterVouchers(this.invoiceSearch);
            }
            if (this.only4ProformaEstimates) {
                this.getVoucherVersions();
            }
            this.downloadVoucher('base64');
        }

        if ('invoiceSetting' in changes && changes.invoiceSetting.currentValue && changes.invoiceSetting.currentValue !== changes.invoiceSetting.previousValue) {
            this.isSendSmsEnabled = changes.invoiceSetting.currentValue.sendInvLinkOnSms;
        }

        if (changes.voucherNoForDetail && changes.voucherDetailAction) {
            if (changes.voucherNoForDetail.currentValue && changes.voucherDetailAction.currentValue) {

                if (changes.voucherDetailAction.currentValue === ActionTypeAfterVoucherGenerateOrUpdate.generateAndPrint) {
                    let interVal = setInterval(() => {
                        if (!this.isVoucherDownloading && !this.isVoucherDownloading) {
                            this.printVoucher();
                            clearInterval(interVal);
                        }
                    }, 1000);
                }

            }
        }
    }

    public ngAfterViewInit(): void {
        this.searchElement?.nativeElement.focus();
        fromEvent(this.searchElement?.nativeElement, 'input')
            ?.pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((ev: any) => ev.target?.value),
                takeUntil(this.destroyed$)
            )
            .subscribe((term => {
                this.filterVouchers(term);
            }))

        this.invoiceDetailWrapperHeight = this.invoiceDetailWrapperView?.nativeElement.offsetHeight;
        this.invoiceDetailViewHeight = this.invoiceDetailView?.nativeElement.offsetHeight;
        this.invoiceImageSectionViewHeight = this.invoiceDetailWrapperHeight - this.invoiceDetailViewHeight - 90;
        this.scrollToActiveItem();
    }

    /**
     * This will toggle aside popup for revision history
     *
     * @param {*} [event]
     * @memberof InvoicePreviewDetailsComponent
     */
    public toggleActivityHistoryAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.revisionHistoryAsideState = this.revisionHistoryAsideState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleEditMode() {
        if (this.voucherApiVersion === 1) { 
            if (!this.showEditMode) {
                this.selectedItemVoucher = this.selectedItem;
            } else {
                this.selectedItem = this.selectedItemVoucher;
            }
            this.store.dispatch(this.generalActions.setAppTitle('/pages/invoice/preview/' + this.voucherType));
            this.showEditMode = !this.showEditMode;

            if (this.searchElement && this.searchElement.nativeElement && this.searchElement.nativeElement.value) {
                this.filterVouchers(this.searchElement.nativeElement.value);
            }
        } else {
            if (this.voucherType === VoucherTypeEnum.generateEstimate) {
                this.router.navigate(['/pages/vouchers/estimates/' + this.selectedItem?.account?.uniqueName + '/' + this.selectedItem?.voucherNumber + '/edit']);
            } else if(this.voucherType === VoucherTypeEnum.generateProforma) {
                this.router.navigate(['/pages/vouchers/proformas/' + this.selectedItem?.account?.uniqueName + '/' + this.selectedItem?.voucherNumber + '/edit']);
            } else {
                this.router.navigate(['/pages/vouchers/' + this.voucherType.toString().replace(/-/g, " ") + '/' + this.selectedItem?.account?.uniqueName + '/' + this.selectedItem?.uniqueName + '/edit']);
            }
        }
    }

    public onCancel() {
        this.performActionAfterClose();
        this.invoiceSearchEvent.emit("");
        this.closeEvent.emit(true);
    }

    public toggleBodyClass() {
        if (!this.showEditMode || this.revisionHistoryAsideState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * To call when voucher change for preview
     *
     * @param {InvoicePreviewDetailsVm} item Selected voucher data
     * @memberof InvoicePreviewDetailsComponent
     */
    public selectVoucher(item: InvoicePreviewDetailsVm): void {
        this.selectedItemChange.emit(item);
        this.selectedItem = item;
        this.isAccountHaveAdvanceReceipts = false;
        this.downloadVoucher('base64');
        if (this.only4ProformaEstimates) {
            this.getVoucherVersions();
        }
        this.showEditMode = false;
        this.getLinkedPurchaseOrders();
    }

    public getVoucherVersions() {
        let request = new ProformaGetAllVersionRequest();
        request.accountUniqueName = this.selectedItem?.account?.uniqueName;
        request.page = 1;
        request.count = 15;

        if (this.voucherType === VoucherTypeEnum.generateProforma) {
            request.proformaNumber = this.selectedItem?.voucherNumber;
        } else {
            request.estimateNumber = this.selectedItem?.voucherNumber;
        }
        this.store.dispatch(this.proformaActions.getEstimateVersion(request, this.voucherType));
    }

    public filterVoucherVersions(showMore: boolean) {
        this.filteredVoucherVersions = this.voucherVersions.slice(0, showMore ? 14 : 2);
        this.moreLogsDisplayed = showMore;
    }

    public downloadVoucher(fileType: string = '') {
        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;
        this.shouldShowUploadAttachment = false;
        this.attachedPdfFileUrl = null;
        this.imagePreviewSource = null;
        if (this.selectedItem) {
            this.selectedItem.hasAttachment = false;
        }
        this.detectChanges();

        if (this.generalService.voucherApiVersion === 2 && ![VoucherTypeEnum.generateEstimate, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            let getRequest = {
                voucherType: this.selectedItem?.voucherType,
                uniqueName: this.selectedItem?.uniqueName
            };

            this.sanitizedPdfFileUrl = null;
            this.commonService.downloadFile(getRequest, "ALL").pipe(takeUntil(this.destroyed$)).subscribe(result => {
                if (result?.body) {
                    /** Creating voucher pdf start */
                    if (this.selectedItem && result.body.data) {
                        this.isPdfAvailable = true;
                        this.selectedItem.blob = this.generalService.base64ToBlob(result.body.data, 'application/pdf', 512);
                        const file = new Blob([this.selectedItem.blob], { type: 'application/pdf' });
                        this.attachedDocumentBlob = file;
                        URL.revokeObjectURL(this.pdfFileURL);
                        this.pdfFileURL = URL.createObjectURL(file);

                        this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                        this.isVoucherDownloadError = false;
                        this.pdfPreviewLoaded = true;
                    } else {
                        if (this.selectedItem?.voucherType === 'purchase') {
                            this.pdfPreviewLoaded = false;
                        }
                        this.isPdfAvailable = false;
                    }
                    /** Creating voucher pdf finish */

                    if (result.body.attachments?.length > 0) {
                        /** Creating attachment start */
                        if (this.selectedItem) {
                            this.selectedItem.hasAttachment = true;
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
                                if (this.selectedItem) {
                                    this.selectedItem.blob = this.attachedAttachmentBlob;
                                    const file = new Blob([this.attachedAttachmentBlob], { type: 'application/pdf' });
                                    URL.revokeObjectURL(this.pdfFileURL);
                                    this.pdfFileURL = URL.createObjectURL(file);
                                    this.attachedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                                }
                                this.detectChanges();
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
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
                this.isVoucherDownloading = false;
                this.detectChanges();
            }, (err) => {
                this.handleDownloadError(err);
            });
        } else {
            if ([VoucherTypeEnum.sales, VoucherTypeEnum.cash, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote].includes(this.voucherType)) {
                if (this.selectedItem) {
                    let model: DownloadVoucherRequest = {
                        voucherType: this.selectedItem?.voucherType === VoucherTypeEnum.cash ? VoucherTypeEnum.sales : this.selectedItem?.voucherType,
                        voucherNumber: [this.selectedItem.voucherNumber]
                    };

                    let accountUniqueName: string = this.selectedItem.account?.uniqueName;
                    this.sanitizedPdfFileUrl = null;
                    this.receiptService.DownloadVoucher(model, accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                        if (result) {
                            if (this.selectedItem) {
                                this.selectedItem.blob = result;
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
                        this.detectChanges();
                    }, (err) => {
                        this.handleDownloadError(err);
                    });
                    this.detectChanges();
                }
            } else if (this.voucherType === VoucherTypeEnum.purchase) {
                const requestObject: any = {
                    accountUniqueName: this.selectedItem?.account?.uniqueName,
                    purchaseRecordUniqueName: this.selectedItem?.uniqueName
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
                                    if (this.selectedItem) {
                                        this.selectedItem.blob = this.attachedAttachmentBlob;
                                        const file = new Blob([this.attachedAttachmentBlob], { type: 'application/pdf' });
                                        URL.revokeObjectURL(this.pdfFileURL);
                                        this.pdfFileURL = URL.createObjectURL(file);
                                        this.attachedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                                    }
                                    this.detectChanges();
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
                    this.detectChanges();
                }, (error) => {
                    this.handleDownloadError(error);
                });

                this.pdfPreviewHasError = false;
                this.pdfPreviewLoaded = false;

                let getRequest = { companyUniqueName: this.companyUniqueName, accountUniqueName: this.selectedItem?.account?.uniqueName, uniqueName: this.selectedItem?.uniqueName };

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
                        this.detectChanges();
                    } else {
                        this.pdfPreviewHasError = true;
                    }
                });
                this.detectChanges();
            } else {
                if (this.selectedItem) {
                    let request: ProformaDownloadRequest = new ProformaDownloadRequest();
                    request.fileType = fileType;
                    request.accountUniqueName = this.selectedItem.account?.uniqueName;

                    if (this.selectedItem?.voucherType === VoucherTypeEnum.generateProforma) {
                        request.proformaNumber = this.selectedItem.voucherNumber;
                    } else {
                        request.estimateNumber = this.selectedItem.voucherNumber;
                    }

                    this.sanitizedPdfFileUrl = null;
                    this.proformaService.download(request, this.selectedItem?.voucherType).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                        if (result && result.status === 'success') {
                            let blob: Blob = this.generalService.base64ToBlob(result.body, 'application/pdf', 512);
                            if (this.selectedItem) {
                                this.selectedItem.blob = blob;
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
                        this.detectChanges();
                    }, (err) => {
                        this.handleDownloadError(err);
                    });
                    this.detectChanges();
                }
            }
        }
    }

    public downloadPdf() {
        if (this.isVoucherDownloading || this.isVoucherDownloadError) {
            return;
        }

        if (this.only4ProformaEstimates) {
            if (this.selectedItem && this.selectedItem.blob) {
                return saveAs(this.selectedItem.blob, `${this.selectedItem.account.name} - ${this.selectedItem.voucherNumber}.pdf`);
            } else {
                return;
            }
        } else if (this.selectedItem?.voucherType === VoucherTypeEnum.creditNote || this.selectedItem?.voucherType === VoucherTypeEnum.debitNote) {
            if (this.generalService.voucherApiVersion === 2) {
                if (this.selectedItem?.hasAttachment) {
                    this.downloadVoucherModal?.show();
                } else {
                    if (this.selectedItem) {
                        return saveAs(this.selectedItem.blob, `${this.selectedItem.voucherNumber}.pdf`);
                    }
                }
            } else {
                this.downloadCreditDebitNotePdf();
            }
        } else {
            this.downloadVoucherModal?.show();
        }
    }

    /**
     * Downloads the file
     *
     * @returns {void}
     * @memberof InvoicePreviewDetailsComponent
     */
    public downloadFile(): void {
        if (this.isVoucherDownloading || this.isVoucherDownloadError) {
            return;
        }
        saveAs(this.attachedAttachmentBlob, `${this.attachedDocumentType.name}`);
    }

    public printVoucher() {
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
     * @memberof InvoicePreviewDetailsComponent
     */
    public printThermal(): void {
        let hasPrinted = false;
        this.voucherDetails$.subscribe((res) => {
            if (res && this.selectedItem?.uniqueName === res.uniqueName) {
                if (!hasPrinted) {
                    hasPrinted = true;
                    this.thermalService.print(this.thermalTemplate, res);
                }
            } else {
                this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.selectedItem?.account?.uniqueName, {
                    invoiceNumber: this.selectedItem?.voucherNumber,
                    voucherType: this.selectedItem?.voucherType,
                    uniqueName: this.selectedItem?.uniqueName
                }));
            }
        });
    }

    public goToInvoice(type?: string) {
        // remove fixed class because we are navigating to invoice generate page where user can scroll the page
        document.querySelector('body').classList.remove('fixed');
        if (this.voucherApiVersion === 1) {
            if (type === 'cash') {
                this.router.navigate(['/pages/proforma-invoice/invoice/', type]);
            } else {
                this.router.navigate(['/pages/proforma-invoice/invoice/', this.voucherType]);
            }
        } else {
            if (type === 'cash') {
                this.router.navigate(['/pages/vouchers/cash/create']);
            } else {
                this.router.navigate(['/pages/vouchers/'+ this.voucherType.replace(/\s+/g, "-") +'/create']);
            }
        }
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public ngOnDestroy(): void {
        if (this.isSidebarExpanded) {
            this.isSidebarExpanded = false;
            this.generalService.expandSidebar();
            document.querySelector('.nav-left-bar').classList.add('open');
        }
        document.querySelector('body').classList.remove('setting-sidebar-open');
        this.performActionAfterClose();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('fixed');
        document.querySelector('body').classList.remove('update-scroll-hidden');
        document.querySelector('body').classList.remove('voucher-preview-edit');
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

                        if (this.voucherApiVersion === 2) {
                            const requestObject = {
                                uniqueName: this.selectedItem?.uniqueName,
                                attachedFiles: [response?.body?.uniqueName]
                            };
                            this.salesService.updateAttachmentInVoucher(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(() => {
                                this.downloadVoucher('base64');
                            }, () => this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong));
                        } else {
                            const requestObject = {
                                account: {
                                    uniqueName: this.selectedItem?.account?.uniqueName
                                },
                                uniqueName: this.selectedItem?.uniqueName,
                                attachedFiles: [response?.body?.uniqueName]
                            };
                            this.purchaseRecordService.generatePurchaseRecord(requestObject, 'PATCH', true).pipe(takeUntil(this.destroyed$)).subscribe(() => {
                                this.downloadVoucher('base64');
                            }, () => this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong));
                        }

                        this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.toaster.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }

    private performActionAfterClose() {
        if (this.voucherNoForDetail && this.voucherDetailAction) {
            if (this.only4ProformaEstimates) {
                this.store.dispatch(this.proformaActions.resetVoucherForDetails());
            } else {
                this.store.dispatch(this.invoiceReceiptActions.resetVoucherForDetails());
            }
            this.refreshDataAfterVoucherUpdate.emit(true);
        }
    }

    private detectChanges() {
        if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
        }
    }

    public invokeLoadPaymentModes() {
        this.generalService.invokeEvent.next("loadPaymentModes");
    }

    /**
     * Download error handler
     *
     * @private
     * @param {*} error Error object
     * @memberof InvoicePreviewDetailsComponent
     */
    private handleDownloadError(error: any): void {
        this.toaster.errorToast(error.message);
        this.isVoucherDownloading = false;
        this.isVoucherDownloadError = true;
        this.detectChanges();
    }

    /**
     * To open advance receipt adjust modal
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public openInvoiceAdvanceReceiptModal(): void {
        if (this.onOpenAdvanceReceiptModal) {
            this.onOpenAdvanceReceiptModal.emit(this.selectedItem);
        }
    }

    /**
     * Call API to get all advance receipts of an invoice
     *
     * @param {*} customerUniquename Selected customer unique name
     * @param {*} voucherDate Voucher Date (GIDDH_DATE_FORMAT)
     * @memberof InvoicePreviewDetailsComponent
     */
    public getAllAdvanceReceipts(customerUniqueName: string, voucherDate: string): void {
        if (customerUniqueName && voucherDate) {
            let requestObject = {
                accountUniqueName: customerUniqueName,
                invoiceDate: voucherDate
            };
            this.salesService.getAllAdvanceReceiptVoucher(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res && res.status === 'success') {
                    if (res.body && res.body.length) {
                        this.isAccountHaveAdvanceReceipts = true;
                    } else {
                        this.isAccountHaveAdvanceReceipts = false;
                    }
                    this.detectChanges();
                } else {
                    this.isAccountHaveAdvanceReceipts = false;
                    this.detectChanges();
                }
            });
        }
    }

    /**
     * This will check if we need to show pipe symbol
     *
     * @param {number} loop
     * @returns {boolean}
     * @memberof InvoicePreviewDetailsComponent
     */
    public checkIfPipeSymbolRequired(loop: number): boolean {
        return loop < (this.purchaseOrderNumbers?.length - 1);
    }

    /**
     * This will open the purchase order preview popup
     *
     * @param {TemplateRef<any>} template
     * @param {*} purchaseOrderUniqueName
     * @memberof InvoicePreviewDetailsComponent
     */
    public openPurchaseOrderPreviewPopup(template: TemplateRef<any>, purchaseOrderUniqueName: any): void {
        this.purchaseOrderPreviewUniqueName = purchaseOrderUniqueName;

        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'po-preview-modal modal-lg' })
        );
    }

    /**
     * This will close the purchase order preview popup
     *
     * @param {*} event
     * @memberof InvoicePreviewDetailsComponent
     */
    public closePurchaseOrderPreviewPopup(event: any): void {
        if (event) {
            this.modalRef.hide();
        }
    }

    /**
     * This will open the send email modal
     *
     * @param {TemplateRef<any>} template
     * @memberof InvoicePreviewDetailsComponent
     */
    public openSendMailModal(template: TemplateRef<any>): void {
        this.sendEmailRequest.email = this.selectedItem?.account?.email;
        this.sendEmailRequest.uniqueName = this.selectedItem?.uniqueName;
        this.sendEmailRequest.accountUniqueName = this.selectedItem?.account?.uniqueName;
        this.sendEmailRequest.companyUniqueName = this.companyUniqueName;
        this.modalRef = this.modalService.show(template);
    }

    /**
     * This will close the send email popup
     *
     * @param {*} event
     * @memberof InvoicePreviewDetailsComponent
     */
    public closeSendMailPopup(event: any): void {
        if (event) {
            this.modalRef.hide();
        }
    }

    /**
     * This will download purchase bill PDF
     *
     * @returns {void}
     * @memberof InvoicePreviewDetailsComponent
     */
    public downloadPurchaseBillPDF(): void {
        if (this.pdfPreviewHasError || !this.pdfPreviewLoaded) {
            return;
        }
        if (this.generalService.voucherApiVersion === 2 && this.selectedItem?.hasAttachment) {
            this.downloadVoucherModal?.show();
        } else {
            let voucherNumber = (this.selectedItem?.voucherNumber) ? this.selectedItem?.voucherNumber : this.commonLocaleData?.app_not_available;
            saveAs(this.attachedDocumentBlob, voucherNumber + '.pdf');
        }
    }

    /**
     * This will get the linked purchase orders
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public getLinkedPurchaseOrders(): void {
        this.purchaseOrderNumbers = [];
        if (this.selectedItem?.voucherType === VoucherTypeEnum.purchase) {
            const apiCallObservable = this.generalService.voucherApiVersion === 2 ?
                this.receiptService.getVoucherDetailsV4(this.selectedItem?.account?.uniqueName, {
                    invoiceNumber: this.selectedItem?.voucherNumber,
                    voucherType: this.selectedItem?.voucherType,
                    uniqueName: this.selectedItem?.uniqueName
                }) :
                this.receiptService.GetPurchaseRecordDetails(this.selectedItem?.account?.uniqueName, this.selectedItem?.uniqueName);
            apiCallObservable.pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
                if (res && res.body) {
                    this.purchaseOrderNumbers = res.body.purchaseOrderDetails;
                }
            });
        }
    }

    /**
     * This will filter vouchers based on search
     *
     * @param {*} term
     * @memberof InvoicePreviewDetailsComponent
     */
    public filterVouchers(term): void {
        this.invoiceSearch = term;
        this.invoiceSearchEvent.emit(this.invoiceSearch);
        this.filteredData = this.items?.filter(item => {
            return item.voucherNumber?.toLowerCase().includes(term?.toLowerCase()) ||
                item.account.name?.toLowerCase().includes(term?.toLowerCase()) ||
                item.voucherDate.includes(term) ||
                item.grandTotal?.toString().includes(term);
        });
        this.detectChanges();
    }

    /**
     * This will return voucher log text
     *
     * @param {*} log
     * @returns {string}
     * @memberof InvoicePreviewDetailsComponent
     */
    public getVoucherLogText(log: any): string {
        let voucherLog = this.localeData?.voucher_log;
        voucherLog = voucherLog?.replace("[ACTION]", log.action)?.replace("[TOTAL]", log.grandTotal)?.replace("[USER]", log.user?.name);
        return voucherLog;
    }

    /**
     * This will return edit voucher text
     *
     * @param {string} voucherType
     * @returns {string}
     * @memberof InvoicePreviewDetailsComponent
     */
    public getEditVoucherText(voucherType: string): string {
        let editVoucher = this.localeData?.edit_voucher;
        editVoucher = editVoucher?.replace("[VOUCHER]", voucherType === 'Purchase' ? this.localeData?.bill : voucherType);
        return editVoucher;
    }

    /**
     * Downloads the CN/DN generated voucher PDF
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public downloadCreditDebitNotePdf(): void {
        let voucherType = this.selectedItem?.voucherType;
        let dataToSend = {
            voucherNumber: [this.selectedItem?.voucherNumber],
            voucherType
        };
        if (voucherType) {
            this.invoiceService.DownloadInvoice(this.selectedItem?.account?.uniqueName, dataToSend).pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    if (res) {
                        saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                    } else {
                        this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                    }
                }, (error => {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }));
        }
    }

    /**
     * Scrolls to active item in the list
     *
     * @private
     * @memberof PurchaseOrderPreviewComponent
     */
    private scrollToActiveItem(): void {
        setTimeout(() => {
            this.cdkScrollbar?.scrollToIndex(0);
        }, 200);
    }

    /**
     * Closes payment popup
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public closePerformActionPopup(): void {
        this.store.dispatch(this.invoiceAction.resetActionOnInvoice());
    }
}
