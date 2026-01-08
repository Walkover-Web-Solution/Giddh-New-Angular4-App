import { ReplaySubject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal, ViewChild, ComponentFactoryResolver, TemplateRef, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VatReportTransactionsRequest } from '../../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { VatService } from "../../services/vat.service";
import { saveAs } from "file-saver";
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../app.constant';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { InvoiceService } from '../../services/invoice.service';
import { GeneralService } from '../../services/general.service';
import { ReceiptService } from '../../services/receipt.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-vat-report-transactions',
    styleUrls: ['./vat-report-transactions.component.scss'],
    templateUrl: './vat-report-transactions.component.html',
    standalone:false
})

export class VatReportTransactionsComponent implements OnInit, OnDestroy {
    @ViewChild('downloadOrSendMailModel', { static: true }) public downloadOrSendMailModel: TemplateRef<any>;
    @ViewChild('downloadOrSendMailComponent', { static: true }) public downloadOrSendMailComponent: ElementViewContainerRef;

    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public vatReportTransactions: any = {};
    /** Holds page size options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    public vatReportTransactionsRequest: VatReportTransactionsRequest = {
        from: '',
        to: '',
        taxNumber: '',
        page: 1,
        count: PAGINATION_LIMIT,
        section: '',
        country: '',
    };
    public isLoading = signal<boolean>(false);
    public selectedInvoice: any;
    public base64Data: string;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /*-- mat-table --*/
    displayedColumns: string[] = ['date', 'number', 'name', 'taxamt', 'vat_amt', 'reverse_charge', 'trn_number', 'place_supply'];

    constructor(
        private store: Store<AppState>,
        private vatService: VatService,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        public route: ActivatedRoute,
        private router: Router,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceActions: InvoiceActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private invoiceService: InvoiceService,
        private generalService: GeneralService,
        private receiptService: ReceiptService,
        public dialog: MatDialog
    ) {
    }

    /**
     * This function will initialize the component
     *
     * @memberof VatReportTransactionsComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body').classList.add('gst-sidebar-open');
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
        this.asideGstSidebarMenuState = false;
    }

    /**
     * This function will get the data of vat detailed report
     *
     * @param {boolean} resetPage
     * @memberof VatReportTransactionsComponent
     */
    public getVatReportTransactions(resetPage: boolean): void {
        if (this.activeCompany && this.vatReportTransactionsRequest.section && !this.isLoading()) {
            this.isLoading.set(true);
            this.vatReportTransactionsRequest.country = this.activeCompany.countryV2?.alpha2CountryCode;

            if (resetPage) {
                this.vatReportTransactionsRequest.page = 1;
            }

            this.vatReportTransactions = [];

            this.vatService.getVatReportTransactions(this.activeCompany.uniqueName, this.vatReportTransactionsRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this.vatReportTransactions = res.body;
                    this.cdRef.detectChanges();
                } else {
                    this.toasty.showSnackBar('error', res?.message);
                }
                this.isLoading.set(false);
            });
        }
    }



    /**
     * This will get called and open the invoice in popup if we click on any invoice number
     *
     * @param {*} invoice
     * @memberof VatReportTransactionsComponent
     */
    public onSelectInvoice(invoice: any): void {
        const uniqueName = invoice.voucherUniqueName;
        if (invoice.voucherNumber) {
            this.selectedInvoice = invoice;
            this.selectedInvoice.uniqueName = uniqueName;
            this.dialog.open(this.downloadOrSendMailModel, {
                        height: '80vh',
                        width: '80vw',
                        disableClose: true,
                        autoFocus: false
                    });
        }
    }

    /**
     * This will get called on close model event
     *
     * @param {{ action: string }} userResponse
     * @memberof VatReportTransactionsComponent
     */
    public closeDownloadOrSendMailPopup(userResponse: any): void {
        if (userResponse.action === 'closed') {
            this.dialog.closeAll();
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
    public ondownloadInvoiceEvent(invoiceCopy: any): void {
        if (this.voucherApiVersion === 2) {
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
                    this.toasty.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong);
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
                        this.toasty.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong);
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

    /**
     * This will use for page change
     *
     * @param {*} event
     * @memberof VatReportTransactionsComponent
     */
    public pageChanged(event: PageEvent): void {
        this.vatReportTransactionsRequest.page = this.vatReportTransactionsRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.vatReportTransactionsRequest.count = event.pageSize;
        this.getVatReportTransactions(false);
    }
}
