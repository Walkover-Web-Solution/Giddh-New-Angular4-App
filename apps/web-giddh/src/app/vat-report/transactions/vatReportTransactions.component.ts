import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil, take, delay } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ComponentFactoryResolver, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VatReportTransactionsRequest } from '../../models/api-models/Vat';
import * as _ from '../../lodash-optimized';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { VatService } from "../../services/vat.service";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { saveAs } from "file-saver";
import { PAGINATION_LIMIT } from '../../app.constant';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { DownloadOrSendInvoiceOnMailComponent } from '../../invoice/preview/models/download-or-send-mail/download-or-send-mail.component';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';

@Component({
    selector: 'app-vat-report-transactions',
    styleUrls: ['./vatReportTransactions.component.scss'],
    templateUrl: './vatReportTransactions.component.html'
})

export class VatReportTransactionsComponent implements OnInit, OnDestroy {
    @ViewChild('downloadOrSendMailModel') public downloadOrSendMailModel: ModalDirective;
    @ViewChild('downloadOrSendMailComponent') public downloadOrSendMailComponent: ElementViewContainerRef;
    @ViewChild('invoiceGenerateModel') public invoiceGenerateModel: ModalDirective;

    public activeCompanyUniqueName$: Observable<string>;
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

    constructor(private store: Store<AppState>, private vatService: VatService, private _toasty: ToasterService, private cdRef: ChangeDetectorRef, public route: ActivatedRoute, private router: Router, private generalActions: GeneralActions, private invoiceReceiptActions: InvoiceReceiptActions, private invoiceActions: InvoiceActions, private _store: Store<AppState>, private componentFactoryResolver: ComponentFactoryResolver) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
    }

    /**
     * This function will initialize the component
     *
     * @memberof VatReportTransactionsComponent
     */
    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
			this.vatReportTransactionsRequest.from = params['from'];
            this.vatReportTransactionsRequest.to = params['to'];
            this.getVatReportTransactions(true);
        });
        
        this.route.params.pipe(takeUntil(this.destroyed$), delay(0)).subscribe(params => {
            if(params.section) {
                this.setCurrentPageTitle(params.section);
                this.vatReportTransactionsRequest.section = params.section;
                this.getVatReportTransactions(true);
            } else {
                this.router.navigate(['pages', 'vat-report']);
            }
        });
        
        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
                if (!res) {
                    return;
                }
                res.forEach(cmp => {
                    if (cmp.uniqueName === activeCompanyName) {
                        this.activeCompany = cmp;

                        if (this.activeCompany && this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
                            this.activeCompany.addresses = [_.find(this.activeCompany.addresses, (tax) => tax.isDefault)];
                            this.getVatReportTransactions(true);
                        }
                    }
                });
            });
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
    }

    /**
     * This function will get the data of vat detailed report
     *
     * @param {boolean} resetPage
     * @memberof VatReportTransactionsComponent
     */
    public getVatReportTransactions(resetPage: boolean): void {
        if (this.activeCompany && this.activeCompany.addresses && this.activeCompany.addresses.length > 0 && this.vatReportTransactionsRequest.section && !this.isLoading) {
            this.isLoading = true;

            if (resetPage) {
                this.vatReportTransactionsRequest.page = 1;
            }

            this.vatReportTransactionsRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

            this.vatReportTransactions = [];

            this.vatService.getVatReportTransactions(this.activeCompany.uniqueName, this.vatReportTransactionsRequest).subscribe((res) => {
                if (res.status === 'success') {
                    this.vatReportTransactions = res.body;
                    this.cdRef.detectChanges();
                } else {
                    this._toasty.errorToast(res.message);
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
        if(this.vatReportTransactionsRequest.page != event.page) {
            this.vatReportTransactions.results = [];
            this.vatReportTransactionsRequest.page = event.page;
            this.getVatReportTransactions(false);
        }
    }

    /**
     * This function will set the page heading
     *
     * @param {*} title
     * @memberof VatReportTransactionsComponent
     */
    public setCurrentPageTitle(title): void {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Vat Report > " + title;
        currentPageObj.url = this.router.url;
        this.store.dispatch(this.generalActions.setPageTitle(currentPageObj));
    }

    // public downloadVatReportTransactions(): void {
    //     let vatReportRequest = new VatReportRequest();
    //     vatReportRequest.from = this.fromDate;
    //     vatReportRequest.to = this.toDate;
    //     vatReportRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

    //     this.vatService.DownloadVatReport(vatReportRequest).subscribe((res) => {
    //         if (res.status === "success") {
    //             let blob = this._generalService.base64ToBlob(res.body, 'application/xls', 512);
    //             return saveAs(blob, `VatReport.xlsx`);
    //         } else {
    //             this._toasty.clearAllToaster();
    //             this._toasty.errorToast(res.message);
    //         }
    //     });
    // }

    public onSelectInvoice(invoice) {
        if(invoice.voucherNumber) {
            let downloadVoucherRequestObject = {
                voucherNumber: [invoice.voucherNumber],
                voucherType: invoice.voucherType,
                accountUniqueName: invoice.accountUniqueName
            };
            this._store.dispatch(this.invoiceReceiptActions.VoucherPreview(downloadVoucherRequestObject, downloadVoucherRequestObject.accountUniqueName));
            this.loadDownloadOrSendMailComponent();
            this.downloadOrSendMailModel.show();
        }
    }

    public loadDownloadOrSendMailComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DownloadOrSendInvoiceOnMailComponent);
        let viewContainerRef = this.downloadOrSendMailComponent.viewContainerRef;
        viewContainerRef.remove();

        let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
        viewContainerRef.insert(componentInstanceView.hostView);

        let componentInstance = componentInstanceView.instance as DownloadOrSendInvoiceOnMailComponent;
        componentInstance.closeModelEvent.subscribe(e => this.closeDownloadOrSendMailPopup(e));
    }

    public closeDownloadOrSendMailPopup(userResponse: { action: string }) {
        this.downloadOrSendMailModel.hide();
        if (userResponse.action === 'update') {
            this._store.dispatch(this.invoiceActions.VisitToInvoiceFromPreview());
            this.invoiceGenerateModel.show();
        } else if (userResponse.action === 'closed') {
            this._store.dispatch(this.invoiceActions.ResetInvoiceData());
        }
    }
}