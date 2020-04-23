import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, take } from 'rxjs/operators';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';
import { InvoicePaymentRequest, InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { ProformaService } from '../../../../services/proforma.service';
import { ProformaDownloadRequest, ProformaGetAllVersionRequest, ProformaVersionItem } from '../../../../models/api-models/proforma';
import { ActionTypeAfterVoucherGenerateOrUpdate, VoucherTypeEnum, PurchaseRecordRequest } from '../../../../models/api-models/Sales';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { base64ToBlob } from '../../../../shared/helpers/helperFunctions';
import { DownloadVoucherRequest } from '../../../../models/api-models/recipt';
import { ReceiptService } from '../../../../services/receipt.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { ProformaActions } from '../../../../actions/proforma/proforma.actions';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { InvoiceReceiptActions } from '../../../../actions/invoice/receipt/receipt.actions';
import { GeneralActions } from '../../../../actions/general/general.actions';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { saveAs } from 'file-saver';
import { PurchaseRecordService } from 'apps/web-giddh/src/app/services/purchase-record.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FILE_ATTACHMENT_TYPE, Configuration } from 'apps/web-giddh/src/app/app.constant';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { LEDGER_API } from 'apps/web-giddh/src/app/services/apiurls/ledger.api';
import { BaseResponse } from 'apps/web-giddh/src/app/models/api-models/BaseResponse';
import { ProformaListComponent } from '../../../proforma/proforma-list.component';
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';

@Component({
    selector: 'invoice-preview-details-component',
    templateUrl: './invoice-preview-details.component.html',
    styleUrls: [`./invoice-preview-details.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('searchElement') public searchElement: ElementRef;
    @ViewChild(PdfJsViewerComponent) public pdfViewer: PdfJsViewerComponent;
    @ViewChild('showEmailSendModal') public showEmailSendModal: ModalDirective;
    @ViewChild('downloadVoucherModal') public downloadVoucherModal: ModalDirective;
    @ViewChild('invoiceDetailWrapper') invoiceDetailWrapperView: ElementRef;
    @ViewChild('invoicedetail') invoiceDetailView: ElementRef;
    /** Attached document preview container instance */
    @ViewChild('attachedDocumentPreview') attachedDocumentPreview: ElementRef;

    @Input() public items: InvoicePreviewDetailsVm[];
    @Input() public selectedItem: InvoicePreviewDetailsVm;
    @Input() public appSideMenubarIsOpen: boolean;
    @Input() public invoiceSetting: InvoiceSetting;
    @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
    @Input() public voucherNoForDetail: string;
    @Input() public voucherDetailAction: string;
    @Input() public showPrinterDialogWhenPageLoad: boolean;

    @Output() public deleteVoucher: EventEmitter<boolean> = new EventEmitter();
    @Output() public updateVoucherAction: EventEmitter<string> = new EventEmitter();
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() public sendEmail: EventEmitter<string | { email: string, invoiceType: string[], invoiceNumber: string }> = new EventEmitter<string | { email: string, invoiceType: string[], invoiceNumber: string }>();
    @Output() public processPaymentEvent: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
    @Output() public refreshDataAfterVoucherUpdate: EventEmitter<boolean> = new EventEmitter();
    /** Event emmiter when advance receipt action selected */
    @Output() public onOpenAdvanceReceiptModal: EventEmitter<boolean> = new EventEmitter();

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
    public ckeditorContent;
    public invoiceDetailWrapperHeight: number;
    public invoiceDetailViewHeight: number;
    public invoiceImageSectionViewHeight: number;
    public isMobileView = false;
    public pagecount: number = 0;
    public fileUploadOptions: UploaderOptions;
    public uploadInput: EventEmitter<UploadInput>;

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

    constructor(
        private _cdr: ChangeDetectorRef,
        private _toasty: ToasterService,
        private _proformaService: ProformaService,
        private _receiptService: ReceiptService,
        private store: Store<AppState>,
        private _proformaActions: ProformaActions,
        private _breakPointObservar: BreakpointObserver,
        private router: Router,
        private _invoiceReceiptActions: InvoiceReceiptActions,
        private _generalActions: GeneralActions,
        private _generalService: GeneralService,
        private purchaseRecordService: PurchaseRecordService,
        private sanitizer: DomSanitizer,
        private salesService: SalesService) {
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileView = result.matches;
        });
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.isUpdateVoucherActionSuccess$ = this.store.pipe(select(s => s.proforma.isUpdateProformaActionSuccess), takeUntil(this.destroyed$));
    }

    /**
     * Returns true if print button needs to be displayed
     *
     * @readonly
     * @type {boolean}
     * @memberof InvoicePreviewDetailsComponent
     */
    public get shouldShowPrintDocument(): boolean {
        return this.selectedItem.voucherType !== VoucherTypeEnum.purchase ||
            (this.selectedItem.voucherType === VoucherTypeEnum.purchase && this.attachedDocumentType &&
                (this.attachedDocumentType.type === 'pdf' || this.attachedDocumentType.type === 'image'));
    }

    ngOnInit() {
        if (this.selectedItem) {
            this.downloadVoucher('base64');
            this.only4ProformaEstimates = [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType);

            if (this.only4ProformaEstimates) {
                this.getVoucherVersions();
            }
        }

        this.store.pipe(select(s => s.proforma.activeVoucherVersions), takeUntil(this.destroyed$)).subscribe((versions => {
            if (versions && versions) {
                this.voucherVersions = versions;
                this.filterVoucherVersions(false);
                this.detectChanges();
            }
        }));
        this.isUpdateVoucherActionSuccess$.subscribe(res => {
            if (res) {
                // get all data again because we are updating action in list page so we have to update data i.e we have to fire this
                this.proformaListComponent.getAll();
            }
        });
        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('items' in changes && changes.items.currentValue !== changes.items.previousValue) {
            this.filteredData = changes.items.currentValue;
            if (this.selectedItem && this.selectedItem.uniqueName) {
                this.selectedItem = this.filteredData.filter(item => {
                    return item.uniqueName === this.selectedItem.uniqueName;
                })[0];
            }
            if (this.only4ProformaEstimates) {
                this.getVoucherVersions();
            }
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

    ngAfterViewInit(): void {
        this.searchElement.nativeElement.focus();
        fromEvent(this.searchElement.nativeElement, 'input')
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                map((ev: any) => ev.target.value)
            )
            .subscribe((term => {
                this.filteredData = this.items.filter(item => {
                    return item.voucherNumber.toLowerCase().includes(term.toLowerCase()) ||
                        item.account.name.toLowerCase().includes(term.toLowerCase()) ||
                        item.voucherDate.includes(term) ||
                        item.grandTotal.toString().includes(term);
                });
                this.detectChanges();
            }))

        this.invoiceDetailWrapperHeight = this.invoiceDetailWrapperView.nativeElement.offsetHeight;
        this.invoiceDetailViewHeight = this.invoiceDetailView.nativeElement.offsetHeight;
        this.invoiceImageSectionViewHeight = this.invoiceDetailWrapperHeight - this.invoiceDetailViewHeight - 90;
    }

    public toggleEditMode() {
        this.store.dispatch(this._generalActions.setAppTitle('/pages/invoice/preview/' + this.voucherType));
        this.showEditMode = !this.showEditMode;
    }

    public onCancel() {
        this.performActionAfterClose();
        this.closeEvent.emit(true);
    }

    public toggleBodyClass() {
        if (!this.showEditMode) {
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
        this.selectedItem = item;
        this.isAccountHaveAdvanceReceipts = false;
        this.downloadVoucher('base64');
        if (this.only4ProformaEstimates) {
            this.getVoucherVersions();
        }
        this.showEditMode = false;
    }

    public getVoucherVersions() {
        let request = new ProformaGetAllVersionRequest();
        request.accountUniqueName = this.selectedItem.account.uniqueName;
        request.page = 1;
        request.count = 15;

        if (this.voucherType === VoucherTypeEnum.generateProforma) {
            request.proformaNumber = this.selectedItem.voucherNumber;
        } else {
            request.estimateNumber = this.selectedItem.voucherNumber;
        }
        this.store.dispatch(this._proformaActions.getEstimateVersion(request, this.voucherType));
    }

    public filterVoucherVersions(showMore: boolean) {
        this.filteredVoucherVersions = this.voucherVersions.slice(0, showMore ? 14 : 2);
        this.moreLogsDisplayed = showMore;
    }

    public downloadVoucher(fileType: string = '') {
        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;

        if ([VoucherTypeEnum.sales, VoucherTypeEnum.cash, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote].includes(this.voucherType)) {
            let model: DownloadVoucherRequest = {
                voucherType: this.selectedItem.voucherType === VoucherTypeEnum.cash ? VoucherTypeEnum.sales : this.selectedItem.voucherType,
                voucherNumber: [this.selectedItem.voucherNumber]
            };
            let accountUniqueName: string = this.selectedItem.account.uniqueName;
            //
            this._receiptService.DownloadVoucher(model, accountUniqueName, false).subscribe(result => {
                if (result) {
                    this.selectedItem.blob = result;
                    this.pdfViewer.pdfSrc = result;
                    this.pdfViewer.showSpinner = true;
                    this.pdfViewer.refresh();
                    this.isVoucherDownloadError = false;
                } else {
                    this.isVoucherDownloadError = true;
                    this._toasty.errorToast('Something went wrong please try again!');
                }
                this.isVoucherDownloading = false;
                this.detectChanges();
            }, (err) => {
                this.handleDownloadError(err);
            });
        } else if (this.voucherType === VoucherTypeEnum.purchase) {
            const requestObject: any = {
                accountUniqueName: this.selectedItem.account.uniqueName,
                purchaseRecordUniqueName: this.selectedItem.uniqueName
            };
            this.purchaseRecordService.downloadAttachedFile(requestObject).subscribe((data) => {
                if (data && data.body) {
                    this.shouldShowUploadAttachment = false;
                    if (data.body.fileType) {
                        const fileExtention = data.body.fileType.toLowerCase();
                        if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                            // Attached file type is image
                            this.attachedDocumentBlob = base64ToBlob(data.body.uploadedFile, `image/${fileExtention}`, 512);
                            let objectURL = `data:image/${fileExtention};base64,` + data.body.uploadedFile;
                            this.imagePreviewSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                            this.attachedDocumentType = { name: data.body.name, type: 'image', value: fileExtention };
                            this.isVoucherDownloadError = false;
                        } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                            // Attached file type is PDF
                            this.attachedDocumentType = { name: data.body.name, type: 'pdf', value: fileExtention };
                            this.attachedDocumentBlob = base64ToBlob(data.body.uploadedFile, 'application/pdf', 512);
                            setTimeout(() => {
                                this.selectedItem.blob = this.attachedDocumentBlob;
                                this.pdfViewer.pdfSrc = this.attachedDocumentBlob;
                                this.pdfViewer.showSpinner = true;
                                this.pdfViewer.refresh();
                                this.detectChanges();
                            }, 250);
                            this.isVoucherDownloadError = false;
                        } else {
                            // Unsupported type
                            this.attachedDocumentBlob = base64ToBlob(data.body.uploadedFile, '', 512);
                            this.attachedDocumentType = { name: data.body.name, type: 'unsupported', value: fileExtention };
                        }
                    }
                } else {
                    this.shouldShowUploadAttachment = true;
                }
                this.isVoucherDownloading = false;
                this.detectChanges();
            }, (error) => {
                this.handleDownloadError(error);
            });
        } else {
            let request: ProformaDownloadRequest = new ProformaDownloadRequest();
            request.fileType = fileType;
            request.accountUniqueName = this.selectedItem.account.uniqueName;

            if (this.selectedItem.voucherType === VoucherTypeEnum.generateProforma) {
                request.proformaNumber = this.selectedItem.voucherNumber;
            } else {
                request.estimateNumber = this.selectedItem.voucherNumber;
            }

            this._proformaService.download(request, this.selectedItem.voucherType).subscribe(result => {
                if (result && result.status === 'success') {
                    let blob: Blob = base64ToBlob(result.body, 'application/pdf', 512);
                    this.pdfViewer.pdfSrc = blob;
                    this.selectedItem.blob = blob;
                    this.pdfViewer.showSpinner = true;
                    this.pdfViewer.refresh();
                    this.isVoucherDownloadError = false;
                } else {
                    this._toasty.errorToast(result.message, result.code);
                    this.isVoucherDownloadError = true;
                }
                this.isVoucherDownloading = false;
                this.detectChanges();
            }, (err) => {
                this.handleDownloadError(err);
            });
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
        } else {
            this.downloadVoucherModal.show();
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
        saveAs(this.attachedDocumentBlob, `${this.attachedDocumentType.name}`);
    }

    public printVoucher() {
        if (this.isVoucherDownloading || this.isVoucherDownloadError) {
            return;
        }
        if (this.pdfViewer && this.pdfViewer.pdfSrc) {
            this.pdfViewer.startPrint = true;
            this.pdfViewer.refresh();
            this.pdfViewer.startPrint = false;
        } else if (this.attachedDocumentPreview) {
            const windowWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth
                || 0;
            const left = (windowWidth / 2) - 450;
            const printWindow = window.open('', '', `left=${left},top=0,width=900,height=900`);
            printWindow.document.write((this.attachedDocumentPreview.nativeElement as HTMLElement).innerHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }

    public goToInvoice(type?: string) {
        // remove fixed class because we are navigating to invoice generate page where user can scroll the page
        document.querySelector('body').classList.remove('fixed');
        if (type === 'cash') {
            this.router.navigate(['/pages/proforma-invoice/invoice/', type]);
        } else {
            this.router.navigate(['/pages/proforma-invoice/invoice/', this.voucherType]);
        }
    }

    public ngOnDestroy(): void {
        this.performActionAfterClose();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('fixed');
    }

    public testPagesLoaded(count: number) {
        this.pagecount = count;
    }

    /**
     * Upload document handler
     *
     * @param {UploadOutput} output Upload output event
     * @memberof InvoicePreviewDetailsComponent
     */
    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
            this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this._toasty.successToast('File uploaded successfully');
                const response = output.file.response.body;
                this.isFileUploading = false;
                const requestObject = {
                    account: {
                        uniqueName: this.selectedItem.account.uniqueName
                    },
                    uniqueName: this.selectedItem.uniqueName,
                    attachedFiles: [response.uniqueName]
                };
                this.purchaseRecordService.generatePurchaseRecord(requestObject, 'PATCH', true).subscribe(() => {
                    this.downloadVoucher('base64');
                }, () => this._toasty.errorToast('Something went wrong! Try again'));
            } else {
                this.isFileUploading = false;
                this._toasty.errorToast(output.file.response.message);
            }
        }
    }

    private performActionAfterClose() {
        if (this.voucherNoForDetail && this.voucherDetailAction) {
            if (this.only4ProformaEstimates) {
                this.store.dispatch(this._proformaActions.resetVoucherForDetails());
            } else {
                this.store.dispatch(this._invoiceReceiptActions.resetVoucherForDetails());
            }
            this.refreshDataAfterVoucherUpdate.emit(true);
        }
    }

    private detectChanges() {
        if (!this._cdr['destroyed']) {
            this._cdr.detectChanges();
        }
    }

    public invokeLoadPaymentModes() {
        this._generalService.invokeEvent.next("loadPaymentModes");
    }

    /**
     * Download error handler
     *
     * @private
     * @param {*} error Error object
     * @memberof InvoicePreviewDetailsComponent
     */
    private handleDownloadError(error: any): void {
        this._toasty.errorToast(error.message);
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
            this.onOpenAdvanceReceiptModal.emit(true);
        }
    }

    /**
     * Call API to get all advance receipts of an invoice
     *
     * @param {*} customerUniquename Selected customer unique name
     * @param {*} voucherDate Voucher Date (DD-MM-YYYY)
     * @memberof InvoicePreviewDetailsComponent
     */
    public getAllAdvanceReceipts(customerUniqueName: string, voucherDate: string): void {
        if (customerUniqueName && voucherDate) {
            let requestObject = {
                accountUniqueName: customerUniqueName,
                invoiceDate: voucherDate
            };
            this.salesService.getAllAdvanceReceiptVoucher(requestObject).subscribe(res => {
                if (res && res.status === 'success') {
                    if (res.body && res.body.length) {
                        this.isAccountHaveAdvanceReceipts = true;
                    } else {
                        this.isAccountHaveAdvanceReceipts = false;
                    }
                    this.detectChanges();
                } else {
                    this.isAccountHaveAdvanceReceipts = false;
                }
            });
        }
    }
}
