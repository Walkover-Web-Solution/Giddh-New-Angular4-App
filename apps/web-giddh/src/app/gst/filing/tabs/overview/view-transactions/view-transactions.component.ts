import { InvoiceReceiptActions } from '../../../../../actions/invoice/receipt/receipt.actions';
import { Component, Input, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { InvoiceActions } from '../../../../../actions/invoice/invoice.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../../../store';
import { takeUntil } from 'rxjs/operators';
import { GStTransactionRequest, GstTransactionResult, GstTransactionSummary } from '../../../../../models/api-models/GstReconcile';
import { GstReconcileActions } from '../../../../../actions/gst-reconcile/gst-reconcile.actions';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { saveAs } from 'file-saver';
import { GstReport } from '../../../../constants/gst.constant';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { DownloadVoucherRequest } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { ReceiptService } from 'apps/web-giddh/src/app/services/receipt.service';
import { Configuration, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VoucherTypeEnum } from 'apps/web-giddh/src/app/vouchers/utility/vouchers.const';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { PageEvent } from '@angular/material/paginator';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';
import { cloneDeep, find } from '../../../../../lodash-optimized';

export const filterTransaction = {
    entityType: '',
    type: '',
    status: '',
    page: 1,
    count: PAGINATION_LIMIT
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'view-transactions',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss'],
    standalone: false
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
    /** Holds download or send mail dialog template reference */
    @ViewChild('downloadOrSendMailDialog') downloadOrSendMailDialog: TemplateRef<any>;
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
    public viewTransactionInProgress$: Observable<boolean> = of(null);
    public selectedFilter: any = filterTransaction;
    /** PDF base 64date */
    public base64Data: string;
    /** selected Invoice object */
    public selectedInvoice: GstTransactionSummary;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Holds gst number */
    public selectedGstNumber: string = '';
    /** Holds table displayed columns name */
    public displayedColumns: string[] = [
        'invoiceDate',
        'invoiceNumber',
        'customerGSTIN',
        'customerName',
        'status',
        'actionOnGSTN',
        'placeOfSupply',
        'reverseCharge',
        'taxableAmount',
        'igst',
        'cgst',
        'sgst',
        'cess',
        'totalInvoiceValue'
    ];
    /** Hold table page index number */
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds download or send mail dialog reference */
    public downloadOrSendMailDialogRef: MatDialogRef<any>;
    /** Holds voucher type enum */
    public voucherTypeEnum: any = VoucherTypeEnum;

    constructor(private gstAction: GstReconcileActions,
        private store: Store<AppState>, private route: Router,
        private activatedRoute: ActivatedRoute,
        private invoiceActions: InvoiceActions,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceService: InvoiceService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private receiptService: ReceiptService,
        @Inject(ServiceConfig) private serviceConfig,
        private dialog: MatDialog) {
        this.viewTransaction$ = this.store.pipe(select(p => p.gstR.viewTransactionData), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.viewTransactionInProgress$ = this.store.pipe(select(p => p.gstR.viewTransactionInProgress), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.gstr1entityType = [
            { label: this.commonLocaleData?.app_all, value: '' },
            { label: this.commonLocaleData?.app_invoices, value: 'invoices' },
            { label: this.commonLocaleData?.app_credit_notes, value: 'credit-notes' },
            { label: this.commonLocaleData?.app_debit_notes, value: 'debit-notes' },
            // { label: this.localeData?.advance_receipt, value: 'advance-receipt' },
            // { label: this.localeData?.adjusted_advance_receipt, value: 'adjusted-advance-receipt' },
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

        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/gst/';
        this.filterParam.count = PAGINATION_LIMIT;
        this.filterParam.from = this.currentPeriod.from;
        this.filterParam.to = this.currentPeriod.to;
        this.filterParam.gstin = this.activeCompanyGstNumber;

        this.activatedRoute.firstChild.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.selectedGstNumber = params.selectedGst;
            if ((params?.entityType === 'registered-notes') || (params?.entityType === 'unregistered-notes')) {
                this.filterParam.entityType = '';
                this.filterParam.type = params.entityType;
            } else {
                this.filterParam.entityType = this.selectedGst === GstReport.Gstr2 ? params.entityType : '';
                this.filterParam.type = params.type;
            }
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

    /**
     * Redirect to gst filing return page
     *
     * @memberof ViewTransactionsComponent
     */
    public redirectToGstFilingReturn(): void {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, selectedGst: this.selectedGstNumber } });
    }



    /**
     * This will handle invoice selection
     *
     * @param {*} invoice
     * @memberof ViewTransactionsComponent
     */
    public onSelectInvoice(invoice: any): void {
        if (invoice?.voucherType !== this.voucherTypeEnum.purchase) {
            let downloadVoucherRequestObject;
            if (invoice && invoice.account) {
                this.selectedInvoice = invoice;
                this.selectedInvoice.uniqueName = invoice.voucherUniqueName;
            }
            this.openDownloadOrSendMailDialog();
        }
    }

    public closeDownloadOrSendMailPopup(userResponse: any) {
        this.downloadOrSendMailDialogRef?.close();
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
        let filters = cloneDeep(this.filterParam);
        if (this.selectedGst === GstReport.Gstr1) {
            this.displayedColumns.splice(4, 0, 'voucherType');
            let selected = find(this.gstr1entityType, o => o?.value === filters.entityType);
            if (selected) {
                this.selectedFilter.entityType = selected.label;
            }
        } else {
            let selected = find(this.gstr2entityType, o => o?.value === filters.entityType);
            if (selected) {
                this.selectedFilter.entityType = selected.label;
            }
        }

        if (this.filterParam.type) {
            let selected;
            if (this.selectedGst === GstReport.Gstr1) {
                if (this.filterParam.entityType === 'advance-receipt') {
                    selected = find(this.otherEntityType, o => o?.value === filters.type)
                } else {
                    selected = find(this.invoiceType, o => o?.value === filters.type);
                }
            } else {
                selected = find(this.gstr2InvoiceType, o => o?.value === filters.type);
            }
            if (selected) {
                this.selectedFilter.type = selected.label;
            }
        }
        return this.filterParam = cloneDeep(filters);

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
        if (this.voucherApiVersion === 2) {
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
                    this.toaster.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong);
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
                        this.toaster.showSnackBar('error', this.commonLocaleData?.app_something_went_wrong);
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

    /**
     * Open download or send mail dialog
     *
     * @returns {void}
     * @memberof ViewTransactionsComponent
     */
    public openDownloadOrSendMailDialog(): void {
        this.downloadOrSendMailDialogRef = this.dialog.open(this.downloadOrSendMailDialog, {
                    height: '80vh',
                    width: '80vw',
                    disableClose: true,
            autoFocus: false,
            panelClass: 'download-send-mail-dialog'
                });
    }

    /**
     * This will use for page change
     *
     * @param {*} event
     * @memberof ViewTransactionsComponent
     */
    public pageChanged(event: PageEvent): void {
        this.pageIndex = this.filterParam.count !== event.pageSize ? 0 : event.pageIndex;
        this.filterParam.count = event.pageSize;
        this.viewFilteredTxn('page', this.pageIndex + 1);
    }
}
