import { InvoiceReceiptActions } from '../../../../../actions/invoice/receipt/receipt.actions';
import { Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { InvoiceActions } from '../../../../../actions/invoice/invoice.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementViewContainerRef } from '../../../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../../../store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { GStTransactionRequest, GstTransactionResult, GstTransactionSummary } from '../../../../../models/api-models/GstReconcile';
import { GstReconcileActions } from '../../../../../actions/gst-reconcile/gst-reconcile.actions';
import { DownloadOrSendInvoiceOnMailComponent } from '../../../../../invoice/preview/models/download-or-send-mail/download-or-send-mail.component';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { saveAs } from 'file-saver';
import { GstReport } from '../../../../constants/gst.constant';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DownloadVoucherRequest } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { ReceiptService } from 'apps/web-giddh/src/app/services/receipt.service';

export const filterTransaction = {
    entityType: '',
    type: '',
    status: '',
    page: 1,
    count: 20
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'view-transactions',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss'],
})
export class ViewTransactionsComponent implements OnInit, OnDestroy {
    @Input() public currentPeriod: any = null;
    @Input() public selectedGst: string = null;
    @Input() public activeCompanyGstNumber: string = null;
    @Input() public isTransactionSummary: boolean;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @ViewChild('downloadOrSendMailModel', { static: true }) public downloadOrSendMailModel: ModalDirective;
    @ViewChild('downloadOrSendMailComponent', { static: true }) public downloadOrSendMailComponent: ElementViewContainerRef;
    public viewTransaction$: Observable<GstTransactionResult> = of(null);
    public gstr1entityType = [];
    public invoiceType = [];
    public otherEntityType = [];
    public gstr2InvoiceType = [];
    public selectedEntityType: string = '';
    public companyGst$: Observable<string> = of('');
    public gstr2entityType = [];
    public filterParam: GStTransactionRequest = new GStTransactionRequest();
    public imgPath: string = '';
    public modalRef: BsModalRef;
    public modalConfig = {
        animated: true,
        keyboard: false,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public viewTransactionInProgress$: Observable<boolean> = of(null);
    public selectedFilter: any = filterTransaction;
    /** PDF base 64date */
    public base64Data: string;
    /** selected Invoice object */
    public selectedInvoice: GstTransactionSummary;
    /** Returns the enum to be used in template */
    /** It will store mobile size */
    public isMobileScreen: boolean = false;
    public get GstReport() {
        return GstReport;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Holds gst number */
    public selectedGstNumber: string = '';

    constructor(private gstAction: GstReconcileActions, private store: Store<AppState>, private route: Router, private activatedRoute: ActivatedRoute, private invoiceActions: InvoiceActions, private componentFactoryResolver: ComponentFactoryResolver,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceService: InvoiceService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private breakpointObserver: BreakpointObserver,
        private receiptService: ReceiptService) {
        this.viewTransaction$ = this.store.pipe(select(p => p.gstR.viewTransactionData), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.viewTransactionInProgress$ = this.store.pipe(select(p => p.gstR.viewTransactionInProgress), takeUntil(this.destroyed$));
        this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
            this.isMobileScreen = state.matches;
        });
    }

    public ngOnInit() {
        this.gstr1entityType = [
            { label: this.localeData?.all_transactions, value: '' },
            { label: this.commonLocaleData?.app_invoices, value: 'invoices' },
            { label: this.commonLocaleData?.app_credit_notes, value: 'credit-notes' },
            { label: this.commonLocaleData?.app_debit_notes, value: 'debit-notes' },
            { label: this.localeData?.advance_receipt, value: 'advance-receipt' },
            { label: this.localeData?.adjusted_advance_receipt, value: 'adjusted-advance-receipt' },
        ];

        this.gstr2entityType = [
            { label: this.localeData?.bills_expenses, value: 'billsAndExpenses' },
            { label: this.localeData?.credit_debit_notes, value: 'crdr' },
        ];

        this.invoiceType = [
            { label: this.localeData?.b2b, value: 'b2b' },
            { label: this.localeData?.b2cl, value: 'b2cl' },
            { label: this.localeData?.filing?.b2cs, value: 'b2cs' },
            { label: this.commonLocaleData?.app_export, value: 'export' },
            { label: this.localeData?.nil, value: 'nil' },
        ];

        this.gstr2InvoiceType = [
            { label: this.localeData?.b2b, value: 'b2b' },
            { label: this.localeData?.b2bur, value: 'b2bur' },
            { label: this.localeData?.impg, value: 'impg' },
            { label: this.localeData?.imps, value: 'imps' },
            { label: this.localeData?.nil, value: 'nil' },
        ];

        this.otherEntityType = [
            { label: this.commonLocaleData?.app_all, value: 'all' },
            { label: this.localeData?.registered, value: 'registered' },
            { label: this.localeData?.unregistered, value: 'unregistered' }
        ];

        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
        this.filterParam.from = this.currentPeriod.from;
        this.filterParam.to = this.currentPeriod.to;
        this.filterParam.gstin = this.activeCompanyGstNumber;

        this.activatedRoute.firstChild.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.selectedGstNumber = params.selectedGst;
        //  this.filterParam.entityType = params.entityType;
        //  give default value select all Transaction 
            this.filterParam.entityType = '';
            this.filterParam.type = params.type;
            this.filterParam.status = params?.status;
            this.filterParam.from = params.from;
            this.filterParam.to = params.to;
            this.viewFilteredTxn('page', 1);
        });
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    public viewFilteredTxn(filter, val) {
        this.filterParam[filter] = val;
        if (filter === 'entityType') {
            this.filterParam.type = this.filterParam.type ?? 'all';
            this.filterParam.status = 'all';
        }
        this.store.dispatch(this.gstAction.GetSummaryTransaction(this.selectedGst, this.filterParam));
        this.mapFilters();
    }

    public goBack() {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, selectedGst: this.selectedGstNumber } });
    }

    public pageChanged(event) {
        this.viewFilteredTxn('page', event.page);
    }

    public onSelectInvoice(invoice) {
        let downloadVoucherRequestObject;
        if (invoice && invoice.account) {
            this.selectedInvoice = invoice;
            this.selectedInvoice.uniqueName = invoice.voucherUniqueName;

            if(this.voucherApiVersion !== 2) {
                downloadVoucherRequestObject = {
                    voucherNumber: [invoice.voucherNumber],
                    voucherType: invoice.voucherType,
                    accountUniqueName: invoice.account?.uniqueName
                };

                this.store.dispatch(this.invoiceReceiptActions.VoucherPreview(downloadVoucherRequestObject, downloadVoucherRequestObject.accountUniqueName));
            }
        }
        this.loadDownloadOrSendMailComponent();
        this.downloadOrSendMailModel?.show();
    }

    public loadDownloadOrSendMailComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DownloadOrSendInvoiceOnMailComponent);
        let viewContainerRef = this.downloadOrSendMailComponent.viewContainerRef;
        viewContainerRef.remove();

        let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
        viewContainerRef.insert(componentInstanceView.hostView);

        let componentInstance = componentInstanceView.instance as DownloadOrSendInvoiceOnMailComponent;
        componentInstance.selectedVoucher = this.selectedInvoice;
        componentInstance.closeModelEvent.subscribe(e => this.closeDownloadOrSendMailPopup(e));
        componentInstance.downloadOrSendMailEvent.subscribe(e => this.onDownloadOrSendMailEvent(e));
        componentInstance.downloadInvoiceEvent.subscribe(e => this.onDownloadInvoiceEvent(e));
        componentInstance.currentVoucherFilter = this.filterParam.entityType;
    }

    public closeDownloadOrSendMailPopup(userResponse: any) {
        this.downloadOrSendMailModel.hide();
        if (userResponse.action === 'closed') {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }
    }

    public closeInvoiceModel(e) {
        setTimeout(() => {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }, 2000);
    }

    public mapFilters() {
        let filters = _.cloneDeep(this.filterParam);
        if (this.selectedGst === GstReport.Gstr1) {
            let selected = _.find(this.gstr1entityType, o => o?.value === filters.entityType);
            if (selected) {
                this.selectedFilter.entityType = selected.label;
            }
        } else {
            let selected = _.find(this.gstr2entityType, o => o?.value === filters.entityType);
            if (selected) {
                this.selectedFilter.entityType = selected.label;
            }
        }

        if (this.filterParam.type) {
            let selected;
            if (this.selectedGst === GstReport.Gstr1) {
                if (this.filterParam.entityType === 'advance-receipt') {
                    selected = _.find(this.otherEntityType, o => o?.value === filters.type)
                } else {
                    selected = _.find(this.invoiceType, o => o?.value === filters.type);
                }
            } else {
                selected = _.find(this.gstr2InvoiceType, o => o?.value === filters.type);
            }
            if (selected) {
                this.selectedFilter.type = selected.label;
            }
        }
        return this.filterParam = _.cloneDeep(filters);

    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * download file as pdf
     *
     * @returns {void}
     * @memberof ViewTransactionsComponent
     */
    public downloadFile(): void {
        let blob = this.generalService.base64ToBlob(this.base64Data, 'application/pdf', 512);
        return saveAs(blob, `${this.commonLocaleData?.app_invoice}-${this.selectedInvoice.account?.uniqueName}.pdf`);
    }

    /**
     * To send mail or download voucher
     *
     * @param {{ action: string, emails: string[], numbers: string[], typeOfInvoice: string[] }} userResponse API call object body
     * @memberof ViewTransactionsComponent
     */
    public onDownloadOrSendMailEvent(userResponse: any): void {
        if (userResponse.action === 'download') {
            this.downloadFile();
        } else if (userResponse.action === 'send_mail' && userResponse.emails && userResponse.emails.length) {
            if (this.voucherApiVersion === 2) {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account?.uniqueName, {
                    email: { to: userResponse.emails },
                    uniqueName: this.selectedInvoice?.uniqueName,
                    copyTypes: userResponse.typeOfInvoice,
                    voucherType: this.selectedInvoice.voucherType
                }));
            } else {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account?.uniqueName, {
                    emailId: userResponse.emails,
                    voucherNumber: [this.selectedInvoice.voucherNumber],
                    typeOfInvoice: userResponse.typeOfInvoice,
                    voucherType: this.selectedInvoice.voucherType
                }));
            }
        } else if (userResponse.action === 'send_sms' && userResponse.numbers && userResponse.numbers.length) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account?.uniqueName, { numbers: userResponse.numbers }, this.selectedInvoice.voucherNumber));
        }
    }

    /**
     * To download invoice service call
     *
     * @param {*} invoiceCopy
     * @memberof ViewTransactionsComponent
     */
    public onDownloadInvoiceEvent(invoiceCopy): void {
        if(this.voucherApiVersion === 2) {
            let model: DownloadVoucherRequest = {
                voucherType: this.selectedInvoice.voucherType,
                voucherNumber: [this.selectedInvoice.voucherNumber],
                copyTypes: invoiceCopy,
                uniqueName: this.selectedInvoice.voucherUniqueName
            };

            let accountUniqueName: string = this.selectedInvoice.account?.uniqueName;
            this.receiptService.DownloadVoucher(model, accountUniqueName, false).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    if (model.typeOfInvoice?.length > 1) {
                        return saveAs(res, `${model.voucherNumber[0]}.` + 'zip');
                    }
                    return saveAs(res, `${this.selectedInvoice.voucherNumber}.` + 'pdf');
                } else {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            });
        } else {
            let dataToSend = {
                voucherNumber: [this.selectedInvoice.voucherNumber],
                typeOfInvoice: invoiceCopy,
                voucherType: this.selectedInvoice.voucherType
            };
            this.invoiceService.DownloadInvoice(this.selectedInvoice.account?.uniqueName, dataToSend).pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    if (res) {
                        if (dataToSend.typeOfInvoice?.length > 1) {
                            return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                        }
                        return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                    } else {
                        this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                    }
                });
        }
    }

    /**
     * This will return filter type text
     *
     * @returns {string}
     * @memberof ViewTransactionsComponent
     */
    public getFilterTypeText(): string {
        let text = this.localeData?.filing?.filter_type;
        text = text?.replace("[FILTER]", this.selectedFilter?.entityType);
        return text;
    }
}
