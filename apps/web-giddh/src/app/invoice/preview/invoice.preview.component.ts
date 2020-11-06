import { combineLatest, Observable, of as observableOf, of, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
    TemplateRef,
    EventEmitter,
    Output
} from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { cloneDeep, orderBy, uniqBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { InvoiceFilterClassForInvoicePreview, InvoicePreviewDetailsVm } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../services/invoice.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { createSelector } from 'reselect';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { DownloadOrSendInvoiceOnMailComponent } from 'apps/web-giddh/src/app/invoice/preview/models/download-or-send-mail/download-or-send-mail.component';
import { ElementViewContainerRef } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceReceiptFilter, ReceiptItem, ReciptResponse } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { ActiveFinancialYear, CompanyResponse, ValidateInvoice } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { InvoiceAdvanceSearchComponent } from './models/advanceSearch/invoiceAdvanceSearch.component';
import { ToasterService } from '../../services/toaster.service';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { VoucherTypeEnum, VoucherClass } from '../../models/api-models/Sales';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import { saveAs } from 'file-saver';
import { ReceiptService } from "../../services/receipt.service";
import { InvoicePaymentModelComponent } from './models/invoicePayment/invoice.payment.model.component';
import { PurchaseRecordService } from '../../services/purchase-record.service';
import { PAGINATION_LIMIT } from '../../app.constant';
import { PurchaseRecordUpdateModel } from '../../purchase/purchase-record/constants/purchase-record.interface';
import { InvoiceBulkUpdateService } from '../../services/invoice.bulkupdate.service';
import { PurchaseRecordActions } from '../../actions/purchase-record/purchase-record.action';
import { Location } from '@angular/common';
import { VoucherAdjustments, AdjustAdvancePaymentModal } from '../../models/api-models/AdvanceReceiptsAdjust';
import { SalesService } from '../../services/sales.service';
import { GeneralService } from '../../services/general.service';
const PARENT_GROUP_ARR = ['sundrydebtors', 'bankaccounts', 'revenuefromoperations', 'otherincome', 'cash'];

/** Multi currency modules includes Cash/Sales Invoice and CR/DR note */
const MULTI_CURRENCY_MODULES = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote];

const COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' }
];

@Component({
    selector: 'app-invoice-preview',
    templateUrl: './invoice.preview.component.html',
    styleUrls: ['./invoice.preview.component.scss'],
})

export class InvoicePreviewComponent implements OnInit, OnChanges, OnDestroy {
    public validateInvoiceobj: ValidateInvoice = { invoiceNumber: null };
    @ViewChild('invoiceConfirmationModel', {static: true}) public invoiceConfirmationModel: ModalDirective;
    @ViewChild('performActionOnInvoiceModel', {static: true}) public performActionOnInvoiceModel: ModalDirective;
    @ViewChild('downloadOrSendMailModel', {static: true}) public downloadOrSendMailModel: ModalDirective;
    @ViewChild('invoiceGenerateModel', {static: true}) public invoiceGenerateModel: ModalDirective;
    @ViewChild('downloadOrSendMailComponent', {static: true}) public downloadOrSendMailComponent: ElementViewContainerRef;
    @ViewChild('advanceSearch', {static: true}) public advanceSearch: ModalDirective;
    @ViewChild(DaterangePickerComponent, {static: true}) public dp: DaterangePickerComponent;
    @ViewChild('bulkUpdate', {static: true}) public bulkUpdate: ModalDirective;
    @ViewChild('eWayBill', {static: true}) public eWayBill: ModalDirective;
    @ViewChild('searchBox', {static: true}) public searchBox: ElementRef;
    @ViewChild('advanceSearchComponent', { read: InvoiceAdvanceSearchComponent, static: true }) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
    @Input() public selectedVoucher: VoucherTypeEnum = VoucherTypeEnum.sales;
    @ViewChild(InvoicePaymentModelComponent, {static: false}) public invoicePaymentModelComponent: InvoicePaymentModelComponent;
    /* Taking input to refresh purchase bill list */
    @Input() public refreshPurchaseBill: boolean = false;
    /* This will emit if purchase bill lists needs to be refreshed */
    @Output() public resetRefreshPurchaseBill: EventEmitter<any> = new EventEmitter();

    public advanceSearchFilter: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
    public bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
        dateInputFormat: GIDDH_DATE_FORMAT,
        rangeInputFormat: GIDDH_DATE_FORMAT,
        containerClass: 'theme-green myDpClass'
    };
    public base64Data: string;
    public selectedInvoice: ReceiptItem;
    public invoiceSearchRequest: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
    public voucherData: ReciptResponse;
    public accounts$: Observable<IOption[]>;
    public moment = moment;
    public modalRef: BsModalRef;
    public showInvoiceNoSearch = false;
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public modalUniqueName: string;
    public startDate: Date;
    public endDate: Date;
    public activeFinancialYear: ActiveFinancialYear;
    public selectedInvoiceForDetails: InvoicePreviewDetailsVm;
    public itemsListForDetails: InvoicePreviewDetailsVm[] = [];
    public innerWidth: any;
    public isMobileView = false;
    public isExported: boolean = false;

    public showCustomerSearch = false;
    public showProformaSearch = false;
    public selectedDateRange: any;
    public datePickerOptions: any = {
        hideOnEsc: true,
        // parentEl: '#dateRangePickerParent',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year').subtract(9, 'year'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quater': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                moment().startOf('year').subtract(10, 'year'),
                moment().endOf('year').subtract(10, 'year')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public universalDate: Date[];
    public universalDate$: Observable<any>;
    public actionOnInvoiceSuccess$: Observable<boolean>;
    public isGetAllRequestInProcess$: Observable<boolean> = of(true);
    public templateType: any;
    public companies$: Observable<CompanyResponse[]>;
    public selectedCompany$: Observable<CompanyResponse>;
    public invoiceSetting: InvoiceSetting;
    public isDeleteSuccess$: Observable<boolean>;
    public allItemsSelected: boolean = false;
    public selectedItems: string[] = [];
    public voucherNumberInput: FormControl = new FormControl();
    public accountUniqueNameInput: FormControl = new FormControl();
    public ProformaPurchaseOrder: FormControl = new FormControl();
    public showAdvanceSearchIcon: boolean = false;
    public hoveredItemForAction: string = '';
    public clickedHoveredItemForAction: string = '';
    public showExportButton: boolean = false;
    public totalSale: number = 0;
    public totalDue: number = 0;
    public selectedInvoicesList: any[] = [];
    public isExportedInvoices: any[] = [];
    public showMoreBtn: boolean = false;
    public selectedItemForMoreBtn = '';
    public exportInvoiceRequestInProcess$: Observable<boolean> = of(false);
    public exportedInvoiceBase64res$: Observable<any>;
    public isFabclicked: boolean = false;
    public exportInvoiceType: string = '';

    public sortRequestForUi: { sortBy: string, sort: string } = { sortBy: '', sort: '' };
    public showInvoiceGenerateModal: boolean = false;
    public appSideMenubarIsOpen: boolean;

    public invoiceSelectedDate: any = {
        fromDates: '',
        toDates: '',
        dataToSend: {}
    };
    public isUniversalDateApplicable: boolean = false;
    private exportcsvRequest: any = {
        from: '',
        to: '',
        dataToSend: {}
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public baseCurrencySymbol: string = '';
    public baseCurrency: string = '';
    public lastListingFilters: any;
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    public purchaseRecord: any = {};
    /**Adjust advance receipts */
    @ViewChild('adjustPaymentModal', {static: true}) public adjustPaymentModal: ModalDirective;
    /** To add advance receipt modal in DOM */
    public showAdvanceReceiptAdjust: boolean = false;
    /** To check is advance receipts modal in update mode */
    public isUpdateMode = false;
    /** selected invoice adjust advance receipts data */
    public advanceReceiptAdjustmentData: VoucherAdjustments;
    /** Observable to get observable store data of voucher */
    public voucherDetails$: Observable<any>;
    /** selected invoice details data  */
    public invFormData: VoucherClass = new VoucherClass();
    /** selected invoice unique name for change status */
    public changeStatusInvoiceUniqueName: string = '';
    /** Total deposit amount of invoice */
    public depositAmount: number = 0;
    /** True, if select perform adjust payment action for an invoice  */
    public selectedPerformAdjustPaymentAction: boolean = false;
    /** To check is selected account/customer have advance receipts */
    public isAccountHaveAdvanceReceipts: boolean = false;
    /* This will hold if we need to show/hide PO search */
    public showPurchaseOrderSearch: boolean = false;
    /* Field for search */
    public purchaseOrderNumbersInput: FormControl = new FormControl();
    /* Send email request params object */
    public sendEmailRequest: any = {};
    /* Company name observable */
    public companyName$: Observable<string>;
    /* This will hold company unique name */
    public companyUniqueName: string = '';
    /** This will hold checked invoices */
    public selectedInvoices: any[] = [];
    /** This will hold the search value */
    public invoiceSearch: any = "";

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _invoiceService: InvoiceService,
        private _toaster: ToasterService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _activatedRoute: ActivatedRoute,
        private companyActions: CompanyActions,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private cdr: ChangeDetectorRef,
        private _breakPointObservar: BreakpointObserver,
        private _router: Router,
        private _receiptServices: ReceiptService,
        private purchaseRecordActions: PurchaseRecordActions,
        private purchaseRecordService: PurchaseRecordService,
        private _invoiceBulkUpdateService: InvoiceBulkUpdateService,
        private location: Location,
        private salesService: SalesService,
        private modalService: BsModalService,
        private generalService: GeneralService
    ) {
        this.advanceReceiptAdjustmentData = null;
        this.invoiceSearchRequest.page = 1;
        this.invoiceSearchRequest.count = PAGINATION_LIMIT;
        this.invoiceSearchRequest.entryTotalBy = '';
        this.invoiceSearchRequest.from = moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT);
        this.invoiceSearchRequest.to = moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT);
        this.invoiceSearchRequest.accountUniqueName = '';
        this.invoiceSearchRequest.invoiceNumber = '';
        this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.actionOnInvoiceSuccess$ = this.store.select(p => p.receipt.actionOnInvoiceSuccess).pipe(takeUntil(this.destroyed$));
        this.isGetAllRequestInProcess$ = this.store.select(p => p.receipt.isGetAllRequestInProcess).pipe(takeUntil(this.destroyed$));
        this.exportInvoiceRequestInProcess$ = this.store.select(p => p.invoice.exportInvoiceInprogress).pipe(takeUntil(this.destroyed$));
        this.exportedInvoiceBase64res$ = this.store.select(p => p.invoice.exportInvoicebase64Data).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
        this.voucherDetails$ = this.store.pipe(select(s => s.receipt.voucher), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        //this._invoiceService.getTotalAndBalDue();
    }

    /**
     * This will open the search modal
     *
     * @param {TemplateRef<any>} template
     * @memberof InvoicePreviewComponent
     */
    public openModal(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template);
    }

    public ngOnInit() {
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result.matches;
        });

        this.companyName$.pipe(take(1)).subscribe(companyUniqueName => this.companyUniqueName = companyUniqueName);

        this.advanceSearchFilter.page = 1;
        this.advanceSearchFilter.count = PAGINATION_LIMIT;
        this._activatedRoute.params.subscribe(a => {
            if (a && a.accountUniqueName && a.purchaseRecordUniqueName) {
                this._receiptServices.GetPurchaseRecordDetails(a.accountUniqueName, a.purchaseRecordUniqueName).subscribe((res: any) => {
                    if (res && res.body) {
                        if (res.body.date) {
                            this.invoiceSearchRequest.from = res.body.date;
                            this.invoiceSearchRequest.to = res.body.date;
                            this.getVoucher(false);
                        }

                        this.purchaseRecord = {
                            balanceStatus: '',
                            dueDate: res.body.dueDate,
                            grandTotal: res.body.grandTotal,
                            account: {
                                accountType: (res.body.account) ? res.body.account.type : null,
                                uniqueName: (res.body.account) ? res.body.account.uniqueName : null,
                                name: (res.body.account) ? res.body.account.name : null
                            },
                            uniqueName: res.body.uniqueName,
                            voucherDate: res.body.date,
                            voucherNumber: res.body.number,
                            balanceDue: res.body.balanceTotal,
                            isSelected: false,
                            dueDays: null,
                            cashInvoice: false
                        };
                        this.selectedVoucher = VoucherTypeEnum.purchase;
                        if (this.itemsListForDetails) {
                            this.onSelectInvoice(this.purchaseRecord);
                        }
                    }
                });
            }

            if (!(a && a.voucherType)) {
                return;
            }
            if (a.voucherType === 'recurring') {
                return;
            }
            this.selectedVoucher = a.voucherType;
            if (this.selectedVoucher === 'credit note' || this.selectedVoucher === 'debit note') {
                this.templateType = 'voucher';
            } else {
                this.templateType = 'invoice';
            }
        });

        // Get accounts
        this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
            let accounts: IOption[] = [];
            _.forEach(data, (item) => {
                if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1)) {
                    accounts.push({ label: item.name, value: item.uniqueName });
                }
            });
            this.accounts$ = observableOf(orderBy(accounts, 'label'));
        });

        combineLatest([
            this.store.select(p => p.receipt.vouchers).pipe(takeUntil(this.destroyed$), publishReplay(1), refCount()),
            this.store.pipe(select(s => s.receipt.voucherNoForDetails)),
            this.store.pipe(select(s => s.receipt.voucherNoForDetailsAction))
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res[0]) {
                    this.itemsListForDetails = [];
                    res[0].items = res[0].items.map((item: ReceiptItem) => {
                        let dueDate = item.dueDate ? moment(item.dueDate, GIDDH_DATE_FORMAT) : null;

                        if (dueDate) {
                            if (dueDate.isAfter(moment()) || ['paid', 'cancel'].includes(item.balanceStatus)) {
                                item.dueDays = null;
                            } else {
                                let dueDays = dueDate ? moment().diff(dueDate, 'days') : null;
                                item.dueDays = dueDays;
                            }
                        } else {
                            item.dueDays = null;
                        }
                        if (MULTI_CURRENCY_MODULES.indexOf(this.selectedVoucher) > -1) {
                            // For CR/DR note and Cash/Sales invoice
                            item = this.addToolTiptext(item);
                        }

                        item.isSelected = this.generalService.checkIfValueExistsInArray(this.selectedInvoices, item.uniqueName);

                        this.itemsListForDetails.push(this.parseItemForVm(item));
                        return item;
                    });

                    let voucherData = _.cloneDeep(res[0]);
                    if (voucherData.items.length) {
                        // this.totalSale = voucherData.items.reduce((c, p) => {
                        //   return Number(c.grandTotal) + Number(p.grandTotal);
                        // }, 0);
                        this.showExportButton = voucherData.items.every(s => s.account.uniqueName === voucherData.items[0].account.uniqueName);
                    } else {
                        // this.totalSale = 0;
                        if (voucherData.page > 1) {
                            voucherData.totalItems = voucherData.count * (voucherData.page - 1);
                            this.advanceSearchFilter.page = Math.ceil(voucherData.totalItems / voucherData.count);
                            this.invoiceSearchRequest.page = Math.ceil(voucherData.totalItems / voucherData.count);
                            this.getVoucher(false);
                            this.cdr.detectChanges();
                        }
                        this.showExportButton = false;
                    }

                    //this.selectedInvoicesList = []; // Commented Due to clearing after page changed
                    if (this.selectedInvoicesList && this.selectedInvoicesList.length > 0) {
                        res[0] = this.checkSelectedInvoice(voucherData);
                    }
                    this.selectedItems = [];
                }

                // get voucherDetailsNo so we can open that voucher in details mode
                if (res[0] && res[1] && res[2]) {
                    this.selectedInvoiceForDetails = null;
                    let voucherIndex = (res[0] as ReciptResponse).items.findIndex(f => f.voucherNumber === res[1]);
                    if (voucherIndex > -1) {
                        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
                        allItems = uniqBy([allItems[voucherIndex], ...allItems], 'voucherNumber');
                        this.itemsListForDetails = allItems;
                        this.toggleBodyClass();
                        setTimeout(() => {
                            this.selectedInvoiceForDetails = allItems[0];
                            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(null, null));
                        }, 1000);
                    }
                }
                setTimeout(() => {
                    this.voucherData = _.cloneDeep(res[0]);
                    if (!this.cdr['destroyed']) {
                        this.cdr.detectChanges();
                    }
                }, 100);

                if (this.purchaseRecord && this.purchaseRecord.uniqueName) {
                    this.onSelectInvoice(this.purchaseRecord);
                }
            });

        combineLatest([
            this.store.pipe(select(store => store.receipt.vouchers), publishReplay(1), refCount()),
            this.store.pipe(select(store => store.purchaseRecord.updatedRecordDetails))
        ]).pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                const voucherData: ReciptResponse = response[0];
                const record: PurchaseRecordUpdateModel = response[1];
                if (voucherData && voucherData.items && record) {
                    this.selectedInvoiceForDetails = null;
                    let voucherIndex = voucherData.items.findIndex(item => item.uniqueName === record.purchaseRecordUniqueName);
                    if (voucherIndex > -1) {
                        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
                        if (record.mergedRecordUniqueName) {
                            allItems = allItems.filter(item => item.uniqueName !== record.mergedRecordUniqueName);
                        }
                        allItems[voucherIndex].voucherNumber = record.invoiceNumber;
                        allItems = uniqBy([allItems[voucherIndex], ...allItems], 'uniqueName');
                        this.itemsListForDetails = allItems;
                        this.toggleBodyClass();
                        setTimeout(() => {
                            this.selectedInvoiceForDetails = allItems[0];
                            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(null, null));
                            this.store.dispatch(this.purchaseRecordActions.resetUpdatePurchaseRecord());
                        }, 1000);
                    }
                }
            });

        this.store.pipe(select(s => s.invoice.settings), takeUntil(this.destroyed$)).subscribe(settings => {
            this.invoiceSetting = settings;
        });

        //--------------------- Refresh report data according to universal date--------------------------------
        this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (a) => {

            if (a) {
                if (localStorage.getItem('universalSelectedDate')) {

                    let universalStorageData = localStorage.getItem('universalSelectedDate').split(',');
                    if ((moment(universalStorageData[0]).format(GIDDH_DATE_FORMAT) === moment(a[0]).format(GIDDH_DATE_FORMAT)) && (moment(universalStorageData[1]).format(GIDDH_DATE_FORMAT) === moment(a[1]).format(GIDDH_DATE_FORMAT))) {
                        if (window.localStorage && localStorage.getItem('invoiceSelectedDate')) {
                            let storedSelectedDate = JSON.parse(localStorage.getItem('invoiceSelectedDate'));
                            // this.showAdvanceSearchIcon = true;
                            this.datePickerOptions = {
                                ...this.datePickerOptions,
                                startDate: moment(storedSelectedDate.fromDates, GIDDH_DATE_FORMAT).toDate(),
                                endDate: moment(storedSelectedDate.toDates, GIDDH_DATE_FORMAT).toDate(),
                                chosenLabel: undefined  // Let the library handle the highlighted filter label for range picker
                            };
                            // assign dates
                            // this.assignStartAndEndDateForDateRangePicker(storedSelectedDate.fromDates, storedSelectedDate.toDates);
                            if (storedSelectedDate.fromDates && storedSelectedDate.toDates) {
                                this.invoiceSearchRequest.from = storedSelectedDate.fromDates;
                                this.invoiceSearchRequest.to = storedSelectedDate.toDates;
                                this.isUniversalDateApplicable = false;
                            }

                        } else {
                            this.datePickerOptions = {
                                ...this.datePickerOptions, startDate: moment(a[0], GIDDH_DATE_FORMAT).toDate(),
                                endDate: moment(a[1], GIDDH_DATE_FORMAT).toDate(),
                                chosenLabel: a[2]
                            };

                            // assign dates
                            // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                            this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                            this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                            this.isUniversalDateApplicable = true;
                        }
                    } else {
                        this.datePickerOptions = {
                            ...this.datePickerOptions, startDate: moment(a[0], GIDDH_DATE_FORMAT).toDate(),
                            endDate: moment(a[1], GIDDH_DATE_FORMAT).toDate(),
                            chosenLabel: a[2]
                        };

                        // assign dates
                        // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                        this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                        this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                        this.isUniversalDateApplicable = true;
                    }
                } else {
                    this.datePickerOptions = {
                        ...this.datePickerOptions, startDate: moment(a[0], GIDDH_DATE_FORMAT).toDate(),
                        endDate: moment(a[1], GIDDH_DATE_FORMAT).toDate(),
                        chosenLabel: a[2]
                    };

                    // assign dates
                    // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                    this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                    this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                    this.isUniversalDateApplicable = true;
                }
            }
            //  this.getVoucherCount++;
            //     if (this.getVoucherCount > 1) {
            //       this.getVoucher(true);
            //     }
            this.getVoucher(true);
        })).pipe(takeUntil(this.destroyed$)).subscribe();

        this.actionOnInvoiceSuccess$.subscribe((a) => {
            if (a) {
                this.selectedInvoiceForDetails = null;
                this.getVoucher(this.isUniversalDateApplicable);
            }
        });
        // this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(''), this.selectedVoucher));

        this.selectedCompany$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }

            let selectedCmp = companies.find(cmp => {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                } else {
                    return false;
                }
            });
            if (!selectedCmp) {
                return;
            }
            if (selectedCmp) {
                this.activeFinancialYear = selectedCmp.activeFinancialYear;
                this.store.dispatch(this.companyActions.setActiveFinancialYear(this.activeFinancialYear));
                if (this.activeFinancialYear) {
                    this.datePickerOptions.ranges['This Financial Year to Date'] = [
                        moment(this.activeFinancialYear.financialYearStarts, GIDDH_DATE_FORMAT).startOf('day'),
                        moment()
                    ];
                    this.datePickerOptions.ranges['Last Financial Year'] = [
                        moment(this.activeFinancialYear.financialYearStarts, GIDDH_DATE_FORMAT).subtract(1, 'year'),
                        moment(this.activeFinancialYear.financialYearEnds, GIDDH_DATE_FORMAT).subtract(1, 'year')
                    ];
                }
            }
            return selectedCmp;
        })).pipe(takeUntil(this.destroyed$));
        this.selectedCompany$.subscribe(cmp => {
            if (cmp) {
                this.activeFinancialYear = cmp.activeFinancialYear;
            }
        });

        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.invoiceSearchRequest.q = s;
            this.getVoucher(this.isUniversalDateApplicable);
        });

        this.accountUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.invoiceSearchRequest.q = s;
            this.getVoucher(this.isUniversalDateApplicable);
        });

        this.purchaseOrderNumbersInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.advanceSearchFilter.purchaseOrderNumber = s;
            this.getVoucher(this.isUniversalDateApplicable);
        });

        this.store.pipe(select(s => s.general.sideMenuBarOpen), takeUntil(this.destroyed$))
            .subscribe(result => this.appSideMenubarIsOpen = result);

        this.store.pipe(select(s => s.receipt.isDeleteSuccess), takeUntil(this.destroyed$))
            .subscribe(result => {
                this.selectedItems = [];
                this.selectedInvoicesList = [];
                if (result && this.selectedInvoiceForDetails) {
                    this.selectedInvoiceForDetails = null;
                    this.getVoucher(this.isUniversalDateApplicable);
                }

                this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.lastListingFilters, this.selectedVoucher));
                this._receiptServices.getAllReceiptBalanceDue(this.lastListingFilters, this.selectedVoucher).subscribe(res => {
                    this.parseBalRes(res);
                });
            });

        this.voucherDetails$.subscribe(response => {
            if (response) {
                this.updateNewAccountInVoucher(response);
                if (response.subTotal) {
                    this.invFormData.voucherDetails.totalTaxableValue = response.subTotal.amountForAccount
                    this.invFormData.voucherDetails.subTotal = response.subTotal.amountForAccount;
                }

                if (response.advanceReceiptAdjustment) {
                    this.advanceReceiptAdjustmentData = response.advanceReceiptAdjustment;
                }
                if (response.taxTotal) {
                    if (response.taxTotal.taxBreakdown) {
                        response.taxTotal.taxBreakdown.forEach(item => {
                            if (item.taxType === 'tcspay' && item.amountForAccount) {
                                this.invFormData.voucherDetails.tcsTotal = item.amountForAccount;
                            }
                            if (item.taxType === 'tdspay' && item.amountForAccount) {
                                this.invFormData.voucherDetails.tdsTotal = item.amountForAccount;
                            }
                        });
                    } else {
                        this.invFormData.voucherDetails.tcsTotal = response.taxTotal.cumulativeAmountForAccount;
                    }
                }
                if (response['deposit']) {
                    this.depositAmount = response.deposit.amountForAccount;
                }
                if (this.selectedPerformAdjustPaymentAction) {
                    if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments && this.advanceReceiptAdjustmentData.adjustments.length) {
                        this.showAdvanceReceiptAdjust = true;
                        this.adjustPaymentModal.show();
                        this.selectedPerformAdjustPaymentAction = false;
                    } else {
                        if (response.account && response.date) {
                            this.getAllAdvanceReceipts(response.account.uniqueName, response.date);
                        }
                    }
                }
            }
        })
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedVoucher'] && changes['selectedVoucher'].currentValue !== changes['selectedVoucher'].previousValue) {
            this.selectedVoucher = changes['selectedVoucher'].currentValue;

            if (this.selectedVoucher === VoucherTypeEnum.creditNote || this.selectedVoucher === VoucherTypeEnum.debitNote) {
                this.templateType = 'voucher';
            } else {
                this.templateType = 'invoice';
            }
            this.getVoucher(false);
            this.selectedInvoice = null;
        }

        if(changes['refreshPurchaseBill'] && ((changes['refreshPurchaseBill'].currentValue && changes['refreshPurchaseBill'].currentValue !== changes['refreshPurchaseBill'].previousValue) || changes['refreshPurchaseBill'].firstChange)) {
            this.resetRefreshPurchaseBill.emit(false);
            this.getVoucher(false);
        }
    }

    public toggleBodyClass() {
        if (this.selectedInvoice) {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * Advance search model show hide
     *
     * @param {boolean} isClosed  Boolean to check model need to close or not
     * @memberof InvoicePreviewComponent
     */
    public toggleAdvanceSearchPopup(isClosed: boolean): void {
        if (isClosed) {
            this.toggleAllItems(false);
        }
        this.advanceSearch.toggle();
    }

    /**
     * Bulk update model show hide
     *
     * @param {boolean} isClose Boolean to check model need to close or not
     * @memberof InvoicePreviewComponent
     */
    public toggleBulkUpdatePopup(isClose: boolean): void {
        if (isClose) {
            this.getVoucher(false);
            this.toggleAllItems(false);
            this.bulkUpdate.hide();
        } else {
            this.bulkUpdate.show();
        }

    }

    public toggleEwayBillPopup() {
        this.eWayBill.toggle();
        this._invoiceService.selectedInvoicesLists = [];
        this._invoiceService.VoucherType = this.selectedVoucher;
        this._invoiceService.setSelectedInvoicesList(this.selectedInvoicesList);
    }

    public loadDownloadOrSendMailComponent() {
        let transactionData = null;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DownloadOrSendInvoiceOnMailComponent);
        let viewContainerRef = this.downloadOrSendMailComponent.viewContainerRef;
        viewContainerRef.remove();

        let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
        viewContainerRef.insert(componentInstanceView.hostView);

        let componentInstance = componentInstanceView.instance as DownloadOrSendInvoiceOnMailComponent;
        componentInstance.closeModelEvent.subscribe(e => this.closeDownloadOrSendMailPopup(e));
        componentInstance.downloadOrSendMailEvent.subscribe(e => this.onDownloadOrSendMailEvent(e));
        componentInstance.downloadInvoiceEvent.subscribe(e => this.ondownloadInvoiceEvent(e));
        componentInstance.showPdfWrap = false;
    }

    public getInvoiceTemplateDetails(templateUniqueName: string) {
        if (templateUniqueName) {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
        } else {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
        }
    }

    public pageChanged(ev: any): void {
        if (ev.page === this.invoiceSearchRequest.page) {
            return;
        }
        this.toggleAllItems(false);
        this.invoiceSearchRequest.page = ev.page;
        this.getVoucher(this.isUniversalDateApplicable);
    }

    public getVoucherByFilters(f: NgForm) {
        if (f.valid) {
            this.isUniversalDateApplicable = false;
            this.getVoucher(false);
        }
    }

    public onPerformAction(item, ev: string) {
        if (ev) {
            this.showMoreBtn = false;
            let objItem = item || this.selectedInvoiceForDetails;
            let actionToPerform = ev;
            if (actionToPerform === 'paid') {
                this.performActionOnInvoiceModel.show();
                setTimeout(() => {
                    this.invoicePaymentModelComponent.loadPaymentModes();
                    this.selectedInvoice = objItem;
                    this.invoicePaymentModelComponent.focusAmountField();
                }, 500);
            } else {
                this.store.dispatch(this.invoiceActions.ActionOnInvoice(objItem.uniqueName, {
                    action: actionToPerform,
                    voucherType: objItem.voucherType
                }));
            }
            this.selectedPerformAdjustPaymentAction = false;
        }
    }

    public onDeleteBtnClick() {
        let allInvoices = _.cloneDeep(this.voucherData.items);
        this.selectedInvoice = allInvoices.find((o) => o.uniqueName === this.selectedItems[0]);
        this.invoiceConfirmationModel.show();
    }

    public deleteConfirmedInvoice(selectedVoucher?: any) {
        this.invoiceConfirmationModel.hide();
        if (this.selectedVoucher === VoucherTypeEnum.purchase) {
            const requestObject = {
                uniqueName: (selectedVoucher) ? encodeURIComponent(selectedVoucher.uniqueName) : (this.selectedInvoice) ? encodeURIComponent(this.selectedInvoice.uniqueName) : (this.selectedInvoiceForDetails) ? encodeURIComponent(this.selectedInvoiceForDetails.uniqueName) : ''
            };
            this.purchaseRecordService.deletePurchaseRecord(requestObject).subscribe((response) => {
                this.selectedItems = [];
                if (response.status === 'success') {
                    this._toaster.successToast(response.body);
                    this.selectedInvoiceForDetails = null;
                    this.getVoucher(this.isUniversalDateApplicable);
                } else {
                    this._toaster.errorToast(response.message);
                    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.lastListingFilters, this.selectedVoucher));
                    this._receiptServices.getAllReceiptBalanceDue(this.lastListingFilters, this.selectedVoucher).subscribe(res => {
                        this.parseBalRes(res);
                    });
                }
            });
        } else {
            //  It will execute when Bulk delete operation
            if (this.selectedInvoicesList.length > 1) {
                let selectedinvoicesName = [];
                this.selectedInvoicesList.forEach(item => {
                    selectedinvoicesName.push(item.voucherNumber);
                });
                let bulkDeleteModel = {
                    voucherNumbers: selectedinvoicesName,
                    voucherType: this.selectedVoucher
                }
                if (bulkDeleteModel.voucherNumbers && bulkDeleteModel.voucherType) {
                    this._invoiceBulkUpdateService.bulkUpdateInvoice(bulkDeleteModel, 'delete').subscribe(response => {
                        if (response) {
                            if (response.status === "success") {
                                this._toaster.successToast(response.body);
                            } else {
                                this._toaster.errorToast(response.message);
                            }
                            this.getVoucher(false);
                            this.toggleAllItems(false);
                        }
                    });
                }

            } else {
                let model = {
                    invoiceNumber: (selectedVoucher) ? selectedVoucher.voucherNumber : this.selectedInvoice.voucherNumber,
                    voucherType: this.selectedVoucher
                };

                let account = (selectedVoucher) ? encodeURIComponent(selectedVoucher.account.uniqueName) : encodeURIComponent(this.selectedInvoice.account.uniqueName);

                this.store.dispatch(this.invoiceReceiptActions.DeleteInvoiceReceiptRequest(model, account));
            }

        }
    }

    public closeConfirmationPopup() {
        this.invoiceConfirmationModel.hide();
    }

    public closePerformActionPopup(data) {
        this.performActionOnInvoiceModel.hide();
        if (data) {
            data.action = 'paid';
            this.store.dispatch(this.invoiceActions.ActionOnInvoice(this.selectedInvoice.uniqueName, data));
        }
    }

    public goToInvoice(voucherType: string) {
        this._router.navigate(['/pages/proforma-invoice/invoice/', voucherType]);
    }

    /**
     * onSelectInvoice
     */
    public onSelectInvoice(invoice: ReceiptItem) {
        this.selectedInvoice = _.cloneDeep(invoice);

        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
        let newIndex;
        if (this.selectedVoucher === VoucherTypeEnum.purchase) {
            newIndex = allItems.findIndex(item => item.uniqueName === invoice.uniqueName);
        } else {
            newIndex = allItems.findIndex(f => f.voucherNumber === invoice.voucherNumber);
        }
        let removedItem = allItems.splice(newIndex, 1);
        allItems = [...removedItem, ...allItems];
        this.itemsListForDetails = allItems;

        setTimeout(() => {
            this.selectedInvoiceForDetails = cloneDeep(allItems[0]);
            this.toggleBodyClass();
        }, 200);
    }

    public closeDownloadOrSendMailPopup(userResponse: { action: string }) {
        this.downloadOrSendMailModel.hide();
        this.showInvoiceGenerateModal = userResponse.action === 'update';
        if (userResponse.action === 'update') {
            this.store.dispatch(this.invoiceActions.VisitToInvoiceFromPreview());
            this.invoiceGenerateModel.show();
        } else if (userResponse.action === 'closed') {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }
    }

    public closeInvoiceModel(e) {
        this.invoiceGenerateModel.hide();
        this.showInvoiceGenerateModal = false;
        setTimeout(() => {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }, 2000);
    }

    /**
     * download file as pdf
     * @param data
     * @param invoiceUniqueName
     */
    public downloadFile() {
        let blob = this.base64ToBlob(this.base64Data, 'application/pdf', 512);
        return saveAs(blob, `Invoice-${this.selectedInvoice.account.uniqueName}.pdf`);
    }

    public base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        let offset = 0;
        while (offset < byteCharacters.length) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            let i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    }

    /**
     * onDownloadOrSendMailEvent
     */
    public onDownloadOrSendMailEvent(userResponse: { action: string, emails: string[], numbers: string[], typeOfInvoice: string[] }) {
        if (userResponse.action === 'download') {
            this.downloadFile();
        } else if (userResponse.action === 'send_mail' && userResponse.emails && userResponse.emails.length) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account.uniqueName, {
                emailId: userResponse.emails,
                voucherNumber: [this.selectedInvoice.voucherNumber],
                typeOfInvoice: userResponse.typeOfInvoice,
                voucherType: this.selectedVoucher
            }));
        } else if (userResponse.action === 'send_sms' && userResponse.numbers && userResponse.numbers.length) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account.uniqueName, { numbers: userResponse.numbers }, this.selectedInvoice.voucherNumber));
        }
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        if (this.showAdvanceSearchIcon) {
            this.advanceSearchFilter.sort = type;
            this.advanceSearchFilter.sortBy = columnName;
            this.advanceSearchFilter.from = this.invoiceSearchRequest.from;
            this.advanceSearchFilter.to = this.invoiceSearchRequest.to;
            if (this.invoiceSearchRequest.page) {
                this.advanceSearchFilter.page = this.invoiceSearchRequest.page;
            }
            this.lastListingFilters = this.advanceSearchFilter;
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.advanceSearchFilter, this.selectedVoucher));
            this._receiptServices.getAllReceiptBalanceDue(this.advanceSearchFilter, this.selectedVoucher).subscribe(res => {
                this.parseBalRes(res);
            });
        } else {
            if (this.invoiceSearchRequest.sort !== type || this.invoiceSearchRequest.sortBy !== columnName) {
                this.invoiceSearchRequest.sort = type;
                this.invoiceSearchRequest.sortBy = columnName;
                this.getVoucher(this.isUniversalDateApplicable);
            }
        }

        this.sortRequestForUi.sort = type;
        this.sortRequestForUi.sortBy = columnName;
    }

    public getVoucher(isUniversalDateSelected: boolean) {
        this.lastListingFilters = this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected);
        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected), this.selectedVoucher));
        this._receiptServices.getAllReceiptBalanceDue(this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected), this.selectedVoucher).subscribe(res => {
            this.parseBalRes(res);
        });
    }

    /**
     * This will get the list of vouchers after preview page closed
     *
     * @param {boolean} isUniversalDateSelected
     * @memberof InvoicePreviewComponent
     */
    public getVouchersList(isUniversalDateSelected: boolean): void {
        let request;

        if(this.lastListingFilters) {
            request = this.lastListingFilters;
        } else {
            request = this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected);
        }

        if (!request.invoiceDate && !request.dueDate) {
            request.from = this.invoiceSearchRequest.from;
            request.to = this.invoiceSearchRequest.to;
        }

        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.selectedVoucher));
        this._receiptServices.getAllReceiptBalanceDue(request, this.selectedVoucher).subscribe(res => {
            this.parseBalRes(res);
        });
    }

    public prepareModelForInvoiceReceiptApi(isUniversalDateSelected): InvoiceReceiptFilter {
        let model: any = {};
        let o = _.cloneDeep(this.invoiceSearchRequest);
        let advanceSearch = _.cloneDeep(this.advanceSearchFilter);

        if (o.voucherNumber) {
            model.voucherNumber = o.voucherNumber;
        }
        if (o.page) {
            advanceSearch.page = o.page;
        }

        if (o.balanceDue) {
            model.balanceDue = o.balanceDue;
        }
        if (o.description) {
            model.description = o.description;
        }
        if (o.entryTotalBy === COMPARISON_FILTER[0].value) {
            model.balanceMoreThan = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[1].value) {
            model.balanceLessThan = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[2].value) {
            model.balanceMoreThan = true;
            model.balanceEqual = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[3].value) {
            model.balanceLessThan = true;
            model.balanceEqual = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[4].value) {
            model.balanceEqual = true;
        }

        model.from = o.from;
        model.to = o.to;
        model.count = o.count;
        model.page = o.page;
        if (isUniversalDateSelected || this.showAdvanceSearchIcon) {
            if (!model.invoiceDate && !model.dueDate) {
                model.from = this.invoiceSearchRequest.from;
                model.to = this.invoiceSearchRequest.to;
            }
        }
        model.sort = o.sort;
        model.sortBy = o.sortBy;
        if (o.invoiceNumber) {
            model.voucherNumber = o.invoiceNumber;
        }

        if (o.q) {
            model.q = o.q;
        }

        if (advanceSearch.purchaseOrderNumber) {
            model.purchaseOrderNumber = advanceSearch.purchaseOrderNumber;
        }

        if (advanceSearch && advanceSearch.sortBy) {
            model.sortBy = advanceSearch.sortBy;
        }
        if (advanceSearch && advanceSearch.sort) {
            model.sort = advanceSearch.sort;
        }
        return model;
    }

    public bsValueChange(event: any) {
        this.showAdvanceSearchIcon = true;
        if (event) {
            this.invoiceSearchRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
            this.invoiceSelectedDate.fromDates = this.invoiceSearchRequest.from;
            this.invoiceSelectedDate.toDates = this.invoiceSearchRequest.to;
        }

        if (window.localStorage) {
            localStorage.setItem('invoiceSelectedDate', JSON.stringify(this.invoiceSelectedDate));
        }
        this.getVoucher(this.isUniversalDateApplicable);
    }

    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'invoiceNumber') {
            this.showInvoiceNoSearch = true;
            this.showCustomerSearch = false;
            this.showProformaSearch = false;
            this.showPurchaseOrderSearch = false;
        } else if (fieldName === 'ProformaPurchaseOrder') {
            this.showInvoiceNoSearch = false;
            this.showCustomerSearch = false;
            this.showProformaSearch = true;
            this.showPurchaseOrderSearch = false;
        } else if(fieldName === 'accountUniqueName') {
            this.showCustomerSearch = true;
            this.showInvoiceNoSearch = false;
            this.showProformaSearch = false;
            this.showPurchaseOrderSearch = false;
        } else if(fieldName === 'purchaseOrderNumbers') {
            this.showCustomerSearch = false;
            this.showInvoiceNoSearch = false;
            this.showProformaSearch = false;
            this.showPurchaseOrderSearch = true;
        }

        setTimeout(() => {
            el.focus();
        }, 200);
    }

    public ondownloadInvoiceEvent(invoiceCopy) {
        let dataToSend = {
            voucherNumber: [this.selectedInvoice.voucherNumber],
            typeOfInvoice: invoiceCopy,
            voucherType: this.selectedVoucher
        };
        this._invoiceService.DownloadInvoice(this.selectedInvoice.account.uniqueName, dataToSend)
            .subscribe(res => {
                if (res) {

                    if (dataToSend.typeOfInvoice.length > 1) {
                        return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                    }

                    return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                } else {
                    this._toaster.errorToast('Something went wrong! Please try again');
                }
            });
    }

    public toggleAllItems(type: boolean, manualToggle: boolean = false) {
        this.allItemsSelected = type;
        this.selectedItems = [];
        if (this.voucherData && this.voucherData.items && this.voucherData.items.length) {
            this.voucherData.items = _.map(this.voucherData.items, (item: ReceiptItem) => {
                item.isSelected = this.allItemsSelected;
                let isAvailable = false;
                if (this.selectedInvoicesList && this.selectedInvoicesList.length > 0) {
                    this.selectedInvoicesList.forEach((ele) => {
                        if (ele.uniqueName === item.uniqueName) {
                            isAvailable = true;
                        }
                    });
                }
                if (!isAvailable) {
                    this.selectedInvoicesList.push(item);
                }

                if(manualToggle) {
                    if (this.allItemsSelected) {
                        this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item.uniqueName);
                    } else {
                        this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item.uniqueName);
                    }
                }

                this.selectedItems.push(item.uniqueName);
                return item;
            });
        }
        if (!this.allItemsSelected) {
            this.selectedInvoicesList = this.selectedInvoicesList.filter((ele) => {
                return ele.isSelected;
            });

            if (this.voucherData && this.voucherData.items) {
                this.voucherData.items.forEach((ele) => {
                    this.selectedInvoicesList = this.selectedInvoicesList.filter((s) => {
                        return ele.uniqueName !== s.uniqueName;
                    });
                });
            }

            this.selectedItems = [];
            this.isExported = false;
        } else {
            this.isExported = true;
        }
    }

    public toggleItem(item: any, action: boolean) {
        item.isSelected = action;
        if (action) {
            this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item.uniqueName);
        } else {
            this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item.uniqueName);
            this.allItemsSelected = false;
        }
        this.itemStateChanged(item);
    }

    public clickedOutside(event: Event, el, fieldName: string) {

        if (fieldName === 'invoiceNumber') {
            if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
                return;
            }
        } else if (fieldName === 'accountUniqueName') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
        } else if (fieldName === 'ProformaPurchaseOrder') {
            if (this.ProformaPurchaseOrder.value !== null && this.ProformaPurchaseOrder.value !== '') {
                return;
            }
        } else if (fieldName === 'purchaseOrderNumbers') {
            if (this.purchaseOrderNumbersInput.value !== null && this.purchaseOrderNumbersInput.value !== '') {
                return;
            }
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'invoiceNumber') {
                this.showInvoiceNoSearch = false;
            } else if (fieldName === 'accountUniqueName') {
                this.showCustomerSearch = false;
            } else if (fieldName === 'purchaseOrderNumbers') {
                this.showPurchaseOrderSearch = false;
            }
            // else {
            //   if (fieldName === 'accountUniqueName') {
            //     this.accountUniqueNameInput.value ? this.showCustomerSearch = true : this.showCustomerSearch = false;
            //   } else {
            //     this.showCustomerSearch = false;
            //   }
            // }
        }
    }

    public fabBtnclicked() {
        this.isFabclicked = !this.isFabclicked;
        if (this.isFabclicked) {
            document.querySelector('body').classList.add('overlayBg');
        } else {
            document.querySelector('body').classList.remove('overlayBg');
        }

    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    public itemStateChanged(item: any, allSelected: boolean = false) {
        let index = this.selectedItems.findIndex(f => f === item.uniqueName);
        let indexInv = this.selectedInvoicesList.findIndex(f => f.uniqueName === item.uniqueName);

        if (indexInv > -1 && !allSelected) {
            this.selectedInvoicesList = this.selectedInvoicesList.filter(f => f.uniqueName !== item.uniqueName);
        } else {
            this.selectedInvoicesList.push(item);     // Array of checked seleted Items of the list
        }

        if (index > -1 && !allSelected) {
            this.selectedItems = this.selectedItems.filter(f => f !== item.uniqueName);
        } else {
            this.selectedItems.push(item.uniqueName);  // Array of checked seleted Items uniqueName of the list
        }
        if (this.selectedInvoicesList.length === 1) {
            this.exportInvoiceType = this.selectedInvoicesList[0].account.uniqueName;
            this.isExported = true;
        }
        this.isExported = this.selectedInvoicesList.every(ele => {
            return ele.account.uniqueName === this.exportInvoiceType;
        });
        this.selectedInvoicesList = this.selectedInvoicesList.filter(s => s.isSelected);
        this.voucherData = this.checkSelectedInvoice(this.voucherData);
    }

    public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
        this.showAdvanceSearchIcon = true;
        if (!request.invoiceDate && !request.dueDate) {
            request.from = this.invoiceSearchRequest.from;
            request.to = this.invoiceSearchRequest.to;
        }
        this.lastListingFilters = request;
        
        if(this.invoiceSearchRequest && this.invoiceSearchRequest.q) {
            request.q = this.invoiceSearchRequest.q;
        }

        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.selectedVoucher));
        this._receiptServices.getAllReceiptBalanceDue(request, this.selectedVoucher).subscribe(res => {
            this.parseBalRes(res);
        });
    }

    public resetAdvanceSearch() {
        this.showAdvanceSearchIcon = false;
        if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
            this.advanceSearchComponent.allShSelect.forEach(f => {
                f.clear();
            });
        }

        if(this.advanceSearchComponent) {
            this.advanceSearchComponent.request.invoiceDate = "";
        }
        if (window.localStorage) {
            localStorage.removeItem('invoiceSelectedDate');
        }
        this.advanceSearchFilter = new InvoiceFilterClassForInvoicePreview();
        this.advanceSearchFilter.page = 1;
        this.advanceSearchFilter.count = PAGINATION_LIMIT;

        this.sortRequestForUi = { sortBy: '', sort: '' };
        this.invoiceSearchRequest.sort = '';
        this.invoiceSearchRequest.sortBy = '';
        this.invoiceSearchRequest.q = '';
        this.invoiceSearchRequest.page = 1;
        this.invoiceSearchRequest.count = PAGINATION_LIMIT;
        this.invoiceSearchRequest.voucherNumber = '';

        let universalDate;
        // get application date
        this.universalDate$.pipe(take(1)).subscribe(date => {
            universalDate = date;
        });

        // set date picker date as application date
        if (universalDate.length > 1) {
            this.invoiceSearchRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            this.datePickerOptions = {
                ...this.datePickerOptions,
                startDate: moment(new Date(universalDate[0]), GIDDH_DATE_FORMAT).toDate(),
                endDate: moment(new Date(universalDate[1]), GIDDH_DATE_FORMAT).toDate(),
                chosenLabel: universalDate[2]
            };
            // this.assignStartAndEndDateForDateRangePicker(universalDate[0], universalDate[1]);
        }
        this.getVoucher(this.isUniversalDateApplicable);
    }

    public sendEmail(obj: any) {
        if (obj.email) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account.uniqueName, {
                emailId: obj.email.split(','),
                voucherNumber: [obj.invoiceNumber || this.selectedInvoice.voucherNumber],
                voucherType: this.selectedVoucher,
                typeOfInvoice: obj.invoiceType ? obj.invoiceType : []
            }));
        } else {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account.uniqueName, {
                numbers: obj.numbers.split(',')
            }, this.selectedVoucher));
        }
    }

    /**
     * called when someone closes invoice/ voucher preview page
     * it will call get all so we can have latest data every time someone updates invoice/ voucher
     */
    public invoicePreviewClosed() {
        this.selectedInvoice = null;
        this.selectedInvoiceForDetails = null;
        this.toggleBodyClass();

        if (this.purchaseRecord && this.purchaseRecord.uniqueName) {
            this.location.back();
        } else {
            this.getVouchersList(this.isUniversalDateApplicable);
        }
    }

    public ngOnDestroy() {
        // this.dp.destroyPicker();
        this.universalDate$.pipe(take(1)).subscribe(a => {
            if (a && window.localStorage) {
                localStorage.setItem('universalSelectedDate', a);
            }
        });
        document.querySelector('body').classList.remove('fixed');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public validateInvoiceForEway() {
        let allInvoices = _.cloneDeep(this.voucherData.items);
        this.selectedInvoice = allInvoices.find((o) => o.uniqueName === this.selectedItems[0]);
        this.validateInvoiceobj.invoiceNumber = this.selectedInvoice.voucherNumber;
        this._invoiceService.validateInvoiceForEwaybill(this.validateInvoiceobj).subscribe(res => {
            if (res.status === 'success') {
                if (res.body.errorMessage) {
                    this._toaster.warningToast(res.body.errorMessage);
                }
            }
        });
    }

    public exportCsvDownload() {
        this.exportcsvRequest.from = this.invoiceSearchRequest.from;
        this.exportcsvRequest.to = this.invoiceSearchRequest.to;
        let dataTosend = { accountUniqueName: '' };
        if (this.selectedInvoicesList.length > 0) {

            dataTosend.accountUniqueName = this.allItemsSelected ? '' : this.selectedInvoicesList[0].account.uniqueName;
        } else {
            dataTosend.accountUniqueName = '';
        }
        this.exportcsvRequest.dataToSend = dataTosend;
        this.store.dispatch(this.invoiceActions.DownloadExportedInvoice(this.exportcsvRequest));
        this.exportedInvoiceBase64res$.pipe(debounceTime(800), take(1)).subscribe(res => {
            if (res) {
                if (res.status === 'success') {
                    let blob = this.base64ToBlob(res.body, 'application/xls', 512);
                    this.selectedInvoicesList = [];
                    return saveAs(blob, `${dataTosend.accountUniqueName}All-invoices.xls`);
                } else {
                    this._toaster.errorToast(res.message);
                }
            }
        });
    }

    private parseItemForVm(invoice: ReceiptItem): InvoicePreviewDetailsVm {
        let obj: InvoicePreviewDetailsVm = new InvoicePreviewDetailsVm();
        obj.voucherDate = invoice.voucherDate;
        obj.voucherNumber = invoice.voucherNumber;
        obj.uniqueName = invoice.uniqueName;
        obj.grandTotal = invoice.grandTotal.amountForAccount;
        obj.voucherType = this.selectedVoucher === VoucherTypeEnum.sales ? (invoice.cashInvoice ? VoucherTypeEnum.cash : VoucherTypeEnum.sales) : this.selectedVoucher;
        obj.account = invoice.account;
        obj.voucherStatus = invoice.balanceStatus;
        obj.accountCurrencySymbol = invoice.accountCurrencySymbol;
        return obj;
    }

    public checkSelectedInvoice(voucherData: ReciptResponse) {
        voucherData.items.forEach((v) => {
            this.selectedInvoicesList.forEach((s) => {
                if (v.uniqueName === s.uniqueName) {
                    v.isSelected = true;
                }
            });
        });
        return voucherData;
    }

    private parseBalRes(res) {
        if (res && res.body) {
            this.totalSale = res.body.grandTotal;
            this.totalDue = res.body.totalDue;
        }
        // get user country from his profile
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.baseCurrency = profile.baseCurrency;
            }
        });
    }

    /**
     * assign date to start and end date for date range picker
     * @param from
     * @param to
     */
    private assignStartAndEndDateForDateRangePicker(from, to) {
        from = from || moment().subtract(30, 'd');
        to = to || moment();
        this.selectedDateRange = {
            startDate: moment(from, GIDDH_DATE_FORMAT),
            endDate: moment(to, GIDDH_DATE_FORMAT)
        };
    }

    /**
     * Adds tooltip text for grand total and total due amount
     * to item supplied (for Cash/Sales Invoice and CR/DR note)
     *
     * @private
     * @param {ReceiptItem} item Receipt item received from service
     * @returns {*} Modified item with tooltup text for grand total and total due amount
     * @memberof InvoicePreviewComponent
     */
    private addToolTiptext(item: ReceiptItem): any {
        try {
            let balanceDueAmountForCompany, balanceDueAmountForAccount, grandTotalAmountForCompany,
                grandTotalAmountForAccount;

            if (this.selectedVoucher === VoucherTypeEnum.sales && item && item.totalBalance && item.totalBalance.amountForCompany !== undefined && item.totalBalance.amountForAccount !== undefined) {
                balanceDueAmountForCompany = Number(item.totalBalance.amountForCompany) || 0;
                balanceDueAmountForAccount = Number(item.totalBalance.amountForAccount) || 0;
            }
            if (MULTI_CURRENCY_MODULES.indexOf(this.selectedVoucher) > -1 &&
                item.grandTotal) {
                grandTotalAmountForCompany = Number(item.grandTotal.amountForCompany) || 0;
                grandTotalAmountForAccount = Number(item.grandTotal.amountForAccount) || 0;
            }

            let grandTotalConversionRate = 0, balanceDueAmountConversionRate = 0;
            if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(2);
            }
            if (balanceDueAmountForCompany && balanceDueAmountForAccount) {
                balanceDueAmountConversionRate = +((balanceDueAmountForCompany / balanceDueAmountForAccount) || 0).toFixed(2);
            }
            item['grandTotalTooltipText'] = `In ${this.baseCurrency}: ${grandTotalAmountForCompany}<br />(Conversion Rate: ${grandTotalConversionRate})`;
            item['balanceDueTooltipText'] = `In ${this.baseCurrency}: ${balanceDueAmountForCompany}<br />(Conversion Rate: ${balanceDueAmountConversionRate})`;

        } catch (error) {
        }
        return item;
    }

    /**
     * To adjust invoice with advance receipts
     *
     * @param {ReceiptItem} item invoice details object
     * @memberof InvoicePreviewComponent
     */
    public onPerformAdjustPaymentAction(item: ReceiptItem): void {
        let customerUniqueName = this.getUpdatedAccountUniquename(item.voucherNumber, item.account.uniqueName);

        if (item && item.totalBalance &&  item.totalBalance.amountForAccount !== undefined) {
            this.invFormData.voucherDetails.balanceDue = item.totalBalance.amountForAccount;
        }
        this.invFormData.voucherDetails.grandTotal = item.grandTotal.amountForAccount;
        this.invFormData.voucherDetails.customerName = item.account.name;
        this.invFormData.voucherDetails.customerUniquename = customerUniqueName;
        this.invFormData.voucherDetails.voucherDate = item.voucherDate
        this.invFormData.accountDetails.currencySymbol = item.accountCurrencySymbol;
        this.changeStatusInvoiceUniqueName = item.uniqueName;
        this.selectedPerformAdjustPaymentAction = true;
        // To clear receipts voucher store
        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        // To get re-assign receipts voucher store
        this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(customerUniqueName, {
            invoiceNumber: item.voucherNumber,
            voucherType: VoucherTypeEnum.sales
        }));
    }

    /**
    * To close advance receipt modal
    *
    * @memberof InvoicePreviewComponent
    */
    public closeAdvanceReceiptModal(): void {
        this.showAdvanceReceiptAdjust = false;
        this.advanceReceiptAdjustmentData = null;
        this.changeStatusInvoiceUniqueName = '';
        this.adjustPaymentModal.hide();
    }

    /**
    * To get all advance adjusted data
    *
    * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }} advanceReceiptsAdjustEvent event that contains advance receipts adjusted data
    * @memberof InvoicePreviewComponent
    */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }) {
        this.advanceReceiptAdjustmentData = advanceReceiptsAdjustEvent.adjustVoucherData;
        this.advanceReceiptAdjustmentData.adjustments.map(item => {
            item.voucherDate = (item.voucherDate.toString().includes('/')) ? item.voucherDate.trim().replace(/\//g, '-') : item.voucherDate;
        });
        this.salesService.adjustAnInvoiceWithAdvanceReceipts(this.advanceReceiptAdjustmentData, this.changeStatusInvoiceUniqueName).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this._toaster.successToast(response.body);
                    this.changeStatusInvoiceUniqueName = ''
                    this.closeAdvanceReceiptModal();
                    this.getVoucher(this.isUniversalDateApplicable);
                } else {
                    this._toaster.errorToast(response.message);
                }
                this.cdr.detectChanges();
            }
        });
        this.closeAdvanceReceiptModal();
    }

    /**
     * To open advance receipt adjust modal requested from invoice detailed component
     *
     * @param {*} event emmiter event
     * @memberof InvoicePreviewComponent
     */
    public openAdvanceReceiptModal(event): void {
        if (event) {
            this.onPerformAdjustPaymentAction(this.selectedInvoice);
        }
    }

    /**
     * To toggle change status container
     *
     * @param {ReciptResponse} item selected row item data
     * @memberof InvoicePreviewComponent
     */
    // public clickChangeStatusToggle(item: any): void {
    //     this.isAccountHaveAdvanceReceipts = false;
    //     if (item && item.account && item.account.uniqueName && item.voucherDate) {
    //         this.getAllAdvanceReceipts(item.account.uniqueName, item.voucherDate);
    //     }
    // }

    /**
     * Call API to get all advance receipts of an invoice
     *
     * @param {*} customerUniquename Selected customer unique name
     * @param {*} voucherDate Voucher Date (DD-MM-YYYY)
     * @memberof InvoicePreviewComponent
     */
    public getAllAdvanceReceipts(customerUniqueName: string, voucherDate: string): void {
        if (customerUniqueName && voucherDate) {
            let requestObject = {
                accountUniqueName: customerUniqueName,
                invoiceDate: voucherDate
            };
            this.isAccountHaveAdvanceReceipts = false;
            this.salesService.getAllAdvanceReceiptVoucher(requestObject).subscribe(res => {
                if (res && res.status === 'success') {
                    if (res.body && res.body.length) {
                        this.isAccountHaveAdvanceReceipts = true;
                        this.showAdvanceReceiptAdjust = true;
                        this.adjustPaymentModal.show();
                        this.selectedPerformAdjustPaymentAction = false;
                    } else {
                        this.isAccountHaveAdvanceReceipts = false;
                        this._toaster.warningToast('There is no advanced receipt for adjustment.');
                    }
                }
            });
        }
    }

    /**
     * This will update the updated account in voucher list of item
     *
     * @param {*} voucherUpdatedDetails
     * @memberof InvoicePreviewComponent
     */
    public updateNewAccountInVoucher(voucherUpdatedDetails: any): void {
        if (this.voucherData && this.voucherData.items && voucherUpdatedDetails) {
            let loop = 0;
            this.voucherData.items.forEach(voucher => {
                if (voucher.voucherNumber === voucherUpdatedDetails.number) {
                    if (voucher.account.uniqueName !== voucherUpdatedDetails.account.uniqueName) {
                        this.voucherData.items[loop].account = voucherUpdatedDetails.account;
                    }
                }
                loop++;
            });
        }
    }

    /**
     * This will give the updated account uniquename
     *
     * @param {string} voucherNo
     * @param {string} currentAccountUniqueName
     * @returns {string}
     * @memberof InvoicePreviewComponent
     */
    public getUpdatedAccountUniquename(voucherNo: string, currentAccountUniqueName: string): string {
        let newAccountUniqueName = currentAccountUniqueName;
        if (this.voucherData && this.voucherData.items && voucherNo) {
            this.voucherData.items.forEach(voucher => {
                if (voucher.voucherNumber === voucherNo) {
                    newAccountUniqueName = voucher.account.uniqueName;
                }
            });
        }
        return newAccountUniqueName;
    }

    /**
     * This will show confirmation modal for delete PB
     *
     * @param {*} billUniqueName
     * @memberof InvoicePreviewComponent
     */
    public deletePurchaseBill(billUniqueName: any): void {
        let allInvoices = _.cloneDeep(this.voucherData.items);
        this.selectedInvoice = allInvoices.find((inv) => inv.uniqueName === billUniqueName);
        this.invoiceConfirmationModel.show();
    }

    /**
     * This will open the send email modal
     *
     * @param {TemplateRef<any>} template
     * @memberof InvoicePreviewComponent
     */
    public openSendMailModal(template: TemplateRef<any>, item: any): void {
        this.sendEmailRequest.email = item.account.email;
        this.sendEmailRequest.uniqueName = item.uniqueName;
        this.sendEmailRequest.accountUniqueName = item.account.uniqueName;
        this.sendEmailRequest.companyUniqueName = this.companyUniqueName;
        this.modalRef = this.modalService.show(template);
    }

    /**
     * This will close the send email popup
     *
     * @param {*} event
     * @memberof InvoicePreviewComponent
     */
    public closeSendMailPopup(event: any): void {
        if (event) {
            this.modalRef.hide();
        }
    }
}
