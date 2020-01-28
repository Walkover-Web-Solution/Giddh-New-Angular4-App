import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';
import { InvoicePaymentRequest, InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { ProformaService } from '../../../../services/proforma.service';
import { ProformaDownloadRequest, ProformaGetAllVersionRequest, ProformaVersionItem } from '../../../../models/api-models/proforma';
import { ActionTypeAfterVoucherGenerateOrUpdate, VoucherTypeEnum } from '../../../../models/api-models/Sales';
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
import { FILE_ATTACHMENT_TYPE } from 'apps/web-giddh/src/app/app.constant';

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
    /** Source of image to be previewed */
    public imagePreviewSource: SafeUrl;
    /** Stores the type of attached document for Purchase Record */
    public attachedDocumentType: any;
    /** Stores the BLOB of attached document */
    private attachedDocumentBlob: Blob;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
        private sanitizer: DomSanitizer) {
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileView = result.matches;
        });
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('items' in changes && changes.items.currentValue !== changes.items.previousValue) {
            this.filteredData = changes.items.currentValue;
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
            document.querySelector('body').classList.add('fixed', 'mailbox');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public selectVoucher(item: InvoicePreviewDetailsVm) {
        this.selectedItem = item;
        // this.performActionAfterClose();
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
                console.log(data);
                // if (data && data.body) {
                    data.body = {
                        name: '',
                        uniqueName: '',
                        fileType: 'png',
                        uploadedFile: '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'
                    }
                    if (data.body.fileType) {
                        const fileExtention = data.body.fileType.toLowerCase();
                        if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                            // Attached file type is image
                            let objectURL = `data:image/${fileExtention};base64,` + data.body.uploadedFile;
                            this.imagePreviewSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                            this.attachedDocumentType = { name: data.body.name, type: 'image', value: fileExtention };
                            this.isVoucherDownloadError = false;
                            this.attachedDocumentBlob = base64ToBlob(data.body.uploadedFile, `image/${fileExtention}`, 512);
                        } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                            // Attached file type is PDF
                            this.attachedDocumentBlob = base64ToBlob(data.body.uploadedFile, 'application/pdf', 512);
                            this.selectedItem.blob = this.attachedDocumentBlob;
                            this.pdfViewer.pdfSrc = this.attachedDocumentBlob;
                            this.pdfViewer.showSpinner = true;
                            this.attachedDocumentType = { name: data.body.name, type: 'pdf', value: fileExtention };
                            this.isVoucherDownloadError = false;
                            this.pdfViewer.refresh();
                        } else {
                            // Unsupported type
                            this.isVoucherDownloadError = true;
                            this.attachedDocumentType = { name: data.body.name, type: 'unsupported', value: fileExtention };
                        }
                    }
                    // }

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
            setTimeout(() => {
                printWindow.close();
            }, 0);
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
}
