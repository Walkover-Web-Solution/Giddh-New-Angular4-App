import { ReplaySubject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ComponentFactoryResolver, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VatReportTransactionsRequest } from '../../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { VatService } from "../../services/vat.service";
import { saveAs } from "file-saver";
import { PAGINATION_LIMIT } from '../../app.constant';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DownloadOrSendInvoiceOnMailComponent } from '../../invoice/preview/models/download-or-send-mail/download-or-send-mail.component';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { InvoiceService } from '../../services/invoice.service';
import { GeneralService } from '../../services/general.service';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ReceiptService } from '../../services/receipt.service';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-vat-report-transactions',
    styleUrls: ['./vatReportTransactions.component.scss'],
    templateUrl: './vatReportTransactions.component.html'
})

export class VatReportTransactionsComponent implements OnInit, OnDestroy {
    @ViewChild('downloadOrSendMailModel', { static: true }) public downloadOrSendMailModel: ModalDirective;
    @ViewChild('downloadOrSendMailComponent', { static: true }) public downloadOrSendMailComponent: ElementViewContainerRef;

    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public vatReportTransactions: any = {};
    public vatReportTransactionsRequest: VatReportTransactionsRequest = {
        from: '',
        to: '',
        taxNumber: '',
        page: 1,
        count: PAGINATION_LIMIT,
        section: ''
    };
    public isLoading: boolean = false;
    public modalConfig = {
        animated: true,
        keyboard: false,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public selectedInvoice: any;
    public base64Data: string;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;

    constructor(private store: Store<AppState>, private vatService: VatService, private toasty: ToasterService, private cdRef: ChangeDetectorRef, public route: ActivatedRoute, private router: Router, private invoiceReceiptActions: InvoiceReceiptActions, private invoiceActions: InvoiceActions, private componentFactoryResolver: ComponentFactoryResolver, private invoiceService: InvoiceService, private generalService: GeneralService, private breakpointObserver: BreakpointObserver, private receiptService: ReceiptService, private commonService: CommonService) {

    }

    /**
     * This function will initialize the component
     *
     * @memberof VatReportTransactionsComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.breakpointObserver
        .observe(['(max-width: 767px)'])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
            this.isMobileScreen = state.matches;
            if (!this.isMobileScreen) {
                this.asideGstSidebarMenuState = 'in';
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.vatReportTransactionsRequest.from = params['from'];
            this.vatReportTransactionsRequest.to = params['to'];
            this.vatReportTransactionsRequest.taxNumber = params['taxNumber'];

            this.getVatReportTransactions(true);
        });

        this.route.params.pipe(takeUntil(this.destroyed$), delay(0)).subscribe(params => {
            if (params.section) {
                this.vatReportTransactionsRequest.section = params.section;
                this.getVatReportTransactions(true);
            } else {
                this.router.navigate(['pages', 'vat-report']);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof VatReportTransactionsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out';
    }

    /**
     * This function will get the data of vat detailed report
     *
     * @param {boolean} resetPage
     * @memberof VatReportTransactionsComponent
     */
    public getVatReportTransactions(resetPage: boolean): void {
        if (this.activeCompany && this.vatReportTransactionsRequest.section && !this.isLoading) {
            this.isLoading = true;

            if (resetPage) {
                this.vatReportTransactionsRequest.page = 1;
            }

            this.vatReportTransactions = [];

            this.vatService.getVatReportTransactions(this.activeCompany.uniqueName, this.vatReportTransactionsRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this.vatReportTransactions = res.body;
                    this.cdRef.detectChanges();
                } else {
                    this.toasty.errorToast(res?.message);
                }
                this.isLoading = false;
            });
        }
    }

    /**
     * This function will change the page of vat report
     *
     * @param {*} event
     * @memberof VatReportTransactionsComponent
     */
    public pageChanged(event: any): void {
        if (this.vatReportTransactionsRequest.page !== event.page) {
            this.vatReportTransactions.results = [];
            this.vatReportTransactionsRequest.page = event.page;
            this.getVatReportTransactions(false);
        }
    }

    /**
     * This will get called and open the invoice in popup if we click on any invoice number
     *
     * @param {*} invoice
     * @memberof VatReportTransactionsComponent
     */
    public onSelectInvoice(invoice): void {
        const uniqueName = (this.voucherApiVersion !== 2) ? invoice.purchaseRecordUniqueName : invoice.voucherUniqueName;
        if (invoice.voucherType === VoucherTypeEnum.purchase) {
            if(uniqueName) {
                this.router.navigate(['pages', 'proforma-invoice', 'invoice', 'purchase', invoice.accountUniqueName, uniqueName, 'edit']);
            }
        } else {
            if (invoice.voucherNumber) {
                this.selectedInvoice = invoice;
                this.selectedInvoice.uniqueName = uniqueName;

                if(this.voucherApiVersion !== 2) {
                    let downloadVoucherRequestObject = {
                        voucherNumber: [invoice.voucherNumber],
                        voucherType: invoice.voucherType,
                        accountUniqueName: invoice.accountUniqueName
                    };
                    this.store.dispatch(this.invoiceReceiptActions.VoucherPreview(downloadVoucherRequestObject, downloadVoucherRequestObject.accountUniqueName));
                }

                this.loadDownloadOrSendMailComponent();
                this.downloadOrSendMailModel?.show();
            }
        }
    }

    /**
     * This will open the download/send email popup
     *
     * @memberof VatReportTransactionsComponent
     */
    public loadDownloadOrSendMailComponent(): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DownloadOrSendInvoiceOnMailComponent);
        let viewContainerRef = this.downloadOrSendMailComponent.viewContainerRef;
        viewContainerRef.remove();

        let componentInstanceView = componentFactory.create(viewContainerRef.injector);
        viewContainerRef.insert(componentInstanceView.hostView);

        let componentInstance = componentInstanceView.instance as DownloadOrSendInvoiceOnMailComponent;
        componentInstance.selectedVoucher = this.selectedInvoice;
        componentInstance.downloadOrSendMailEvent.subscribe(e => this.onDownloadOrSendMailEvent(e));
        componentInstance.downloadInvoiceEvent.subscribe(e => this.ondownloadInvoiceEvent(e));
        componentInstance.closeModelEvent.subscribe(e => this.closeDownloadOrSendMailPopup(e));
    }

    /**
     * This will get called on close model event
     *
     * @param {{ action: string }} userResponse
     * @memberof VatReportTransactionsComponent
     */
    public closeDownloadOrSendMailPopup(userResponse: any): void {
        this.downloadOrSendMailModel.hide();
        if (userResponse.action === 'closed') {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }
    }

    /**
     * This will get call on close of invoice popup
     *
     * @param {*} e
     * @memberof VatReportTransactionsComponent
     */
    public closeInvoiceModel(e): void {
        setTimeout(() => {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }, 2000);
    }

    /**
     * This will get called on download/send email
     *
     * @param {{ action: string, emails: string[], numbers: string[], typeOfInvoice: string[] }} userResponse
     * @memberof VatReportTransactionsComponent
     */
    public onDownloadOrSendMailEvent(userResponse: any): void {
        if (userResponse.action === 'download') {
            this.downloadFile();
        } else if (userResponse.action === 'send_mail' && userResponse.emails && userResponse.emails.length) {
            if (this.voucherApiVersion === 2) {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice?.accountUniqueName, {
                    email: { to: userResponse.emails },
                    uniqueName: this.selectedInvoice?.uniqueName,
                    copyTypes: userResponse.typeOfInvoice,
                    voucherType: this.selectedInvoice?.voucherType
                }));
            } else {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice?.accountUniqueName, {
                    emailId: userResponse.emails,
                    voucherNumber: [this.selectedInvoice?.voucherNumber],
                    typeOfInvoice: userResponse.typeOfInvoice,
                    voucherType: this.selectedInvoice?.voucherType
                }));
            }
        } else if (userResponse.action === 'send_sms' && userResponse.numbers && userResponse.numbers.length) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice?.account?.uniqueName, { numbers: userResponse.numbers }, this.selectedInvoice?.voucherNumber));
        }
    }

    /**
     * This will get called on download invoice
     *
     * @param {*} invoiceCopy
     * @memberof VatReportTransactionsComponent
     */
    public ondownloadInvoiceEvent(invoiceCopy): void {
        if(this.voucherApiVersion === 2) {
            let dataToSend = {
                voucherType: this.selectedInvoice?.voucherType,
                voucherNumber: [this.selectedInvoice?.voucherNumber],
                typeOfInvoice: invoiceCopy,
                uniqueName: this.selectedInvoice?.voucherUniqueName
            };

            let accountUniqueName: string = this.selectedInvoice?.account?.uniqueName;
            this.receiptService.DownloadVoucher(dataToSend, accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    if (dataToSend.typeOfInvoice?.length > 1) {
                        return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                    }
                    return saveAs(res, `${this.selectedInvoice?.voucherNumber}.` + 'pdf');
                } else {
                    this.toasty.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            });
        } else {
            let dataToSend = {
                voucherNumber: [this.selectedInvoice?.voucherNumber],
                typeOfInvoice: invoiceCopy,
                voucherType: this.selectedInvoice?.voucherType
            };

            this.invoiceService.DownloadInvoice(this.selectedInvoice?.accountUniqueName, dataToSend)
                .subscribe(res => {
                    if (res) {
                        if (dataToSend.typeOfInvoice?.length > 1) {
                            return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                        }
                        return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                    } else {
                        this.toasty.errorToast(this.commonLocaleData?.app_something_went_wrong);
                    }
                });
        }
    }

    /**
     * This will download the selected type of invoice
     *
     * @returns
     * @memberof VatReportTransactionsComponent
     */
    public downloadFile() {
        let blob = this.generalService.base64ToBlob(this.base64Data, 'application/pdf', 512);
        return saveAs(blob, `${this.commonLocaleData?.app_invoice}-${this.selectedInvoice?.account?.uniqueName}.pdf`);
    }

    /**
     * Navigates to the previous page of VAT report
     *
     * @memberof VatReportTransactionsComponent
     */
    public navigateToPreviousPage(): void {
        this.router.navigate(['/pages/vat-report'], { state: { taxNumber: this.vatReportTransactionsRequest.taxNumber, from: this.vatReportTransactionsRequest.from, to: this.vatReportTransactionsRequest.to } })
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof VatReportTransactionsComponent
     */
     public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }
}
