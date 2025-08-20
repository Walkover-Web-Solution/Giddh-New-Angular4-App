import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import {
    ChangeDetectorRef,
    Component,
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
import { UntypedFormControl, NgForm } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { cloneDeep, map, uniqBy } from '../../lodash-optimized';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { InvoiceFilterClassForInvoicePreview, InvoicePreviewDetailsVm } from '../../models/api-models/Invoice';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PAGE_SIZE_OPTIONS } from '../../app.constant';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../services/invoice.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ElementViewContainerRef } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceReceiptFilter, ReceiptItem, ReciptResponse } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { CompanyResponse, ValidateInvoice } from 'apps/web-giddh/src/app/models/api-models/Company';
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
import { EInvoiceStatus, GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../app.constant';
import { PurchaseRecordUpdateModel } from '../../purchase/purchase-record/constants/purchase-record.interface';
import { InvoiceBulkUpdateService } from '../../services/invoice.bulkupdate.service';
import { PurchaseRecordActions } from '../../actions/purchase-record/purchase-record.action';
import { Location } from '@angular/common';
import { VoucherAdjustments, AdjustAdvancePaymentModal, Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';
import { SalesService } from '../../services/sales.service';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { CommonActions } from '../../actions/common.actions';
import { AdjustmentUtilityService } from '../../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { GeneralActions } from '../../actions/general/general.actions';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { PurchaseOrderActions } from '../../actions/purchase-order/purchase-order.action';

/** Multi currency modules includes Cash/Sales Invoice and CR/DR note */
const MULTI_CURRENCY_MODULES = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase];

@Component({
    selector: 'app-invoice-preview',
    templateUrl: './invoice.preview.component.html',
    styleUrls: ['./invoice.preview.component.scss'],
})

export class InvoicePreviewComponent implements OnInit, OnChanges, OnDestroy {
    public validateInvoiceobj: ValidateInvoice = { invoiceNumber: null };
    @ViewChild('invoiceConfirmationDialog', { static: true }) public invoiceConfirmationDialog: TemplateRef<any>;
    public invoiceConfirmationDialogRef: MatDialogRef<any>;
    @ViewChild('performActionOnInvoiceDialog', { static: true }) public performActionOnInvoiceDialog: TemplateRef<any>;
    public performActionOnInvoiceDialogRef: MatDialogRef<any>;
    @ViewChild('downloadOrSendMailDialog', { static: true }) public downloadOrSendMailDialog: TemplateRef<any>;
    public downloadOrSendMailDialogRef: MatDialogRef<any>;
    @ViewChild('downloadOrSendMailComponent', { static: true }) public downloadOrSendMailComponent: ElementViewContainerRef;
    @ViewChild('advanceSearchDialog', { static: true }) public advanceSearchDialog: TemplateRef<any>;
    public advanceSearchDialogRef: MatDialogRef<any>;
    @ViewChild(DaterangePickerComponent, { static: true }) public dp: DaterangePickerComponent;
    @ViewChild('bulkUpdateDialog', { static: true }) public bulkUpdateDialog: TemplateRef<any>;
    public bulkUpdateDialogRef: MatDialogRef<any>;
    @ViewChild('eWayBillDialog', { static: true }) public eWayBillDialog: TemplateRef<any>;
    private eWayBillDialogRef: MatDialogRef<any>;
    @ViewChild('searchBox', { static: true }) public searchBox: ElementRef;
    @ViewChild('advanceSearchComponent', { read: InvoiceAdvanceSearchComponent, static: true }) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
    @ViewChild('cancelEInvoiceTemplate', { static: false }) public cancelEInvoiceTemplate: TemplateRef<any>;
    @Input() public selectedVoucher: VoucherTypeEnum = VoucherTypeEnum.sales;
    @ViewChild(InvoicePaymentModelComponent, { static: false }) public invoicePaymentModelComponent: InvoicePaymentModelComponent;
    /* Taking input to refresh purchase bill list */
    @Input() public refreshPurchaseBill: boolean = false;
    /* This will emit if purchase bill lists needs to be refreshed */
    @Output() public resetRefreshPurchaseBill: EventEmitter<any> = new EventEmitter();
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** True if datepicker menu is open */
    public isDatepickerMenuOpen: boolean = false;

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
    public dayjs = dayjs;
    public modalRef: BsModalRef;
    @ViewChild('datePickerMenuTrigger') datePickerMenuTrigger: MatMenuTrigger;
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
    public selectedInvoiceForDetails: InvoicePreviewDetailsVm;
    public itemsListForDetails: InvoicePreviewDetailsVm[] = [];
    public innerWidth: any;
    public isMobileView = false;
    public isExported: boolean = false;
    public showCustomerSearch = false;
    public showProformaSearch = false;
    public selectedDateRange: any;
    public universalDate: Date[];
    public universalDate$: Observable<any>;
    public actionOnInvoiceSuccess$: Observable<boolean>;
    public isGetAllRequestInProcess$: Observable<boolean> = of(true);
    public templateType: any;
    public companies$: Observable<CompanyResponse[]>;
    public invoiceSetting: InvoiceSetting;
    public isDeleteSuccess$: Observable<boolean>;
    public allItemsSelected: boolean = false;
    public selectedItems: string[] = [];
    public voucherNumberInput: UntypedFormControl = new UntypedFormControl();
    public accountUniqueNameInput: UntypedFormControl = new UntypedFormControl();
    public ProformaPurchaseOrder: UntypedFormControl = new UntypedFormControl();
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
    public sortRequestForUi: { sortBy: string, sort: string } = { sortBy: '', sort: '' };
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
    public baseCurrencySymbol: string = '';
    public baseCurrency: string = '';
    public lastListingFilters: any;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Pagination limit */
    public paginationLimit: number = this.pageSizeOptions[2]; // 50
    public purchaseRecord: any = {};
    /**Adjust advance receipts */
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    private adjustPaymentDialogRef: MatDialogRef<any>;
    /** To add advance receipt modal in DOM */
    public showAdvanceReceiptAdjust: boolean = false;
    /** To check is advance receipts modal in update mode */
    public isUpdateMode = false;
    /** selected invoice adjust advance receipts data */
    public advanceReceiptAdjustmentData: any;
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
    public purchaseOrderNumbersInput: UntypedFormControl = new UntypedFormControl();
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
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Reference to bulk export template ref */
    @ViewChild('bulkExport', { static: true }) public bulkExport: TemplateRef<any>;
    /** Reference to bulk export dialog */
    private bulkExportDialogRef: MatDialogRef<any>;
    /** Reference to cancel E-invoice dialog */
    private cancelEInvoiceDialogRef: MatDialogRef<any>;
    @ViewChild('template', { static: true }) public template: TemplateRef<any>;
    /** Reference to search template dialog */
    private searchTemplateDialogRef: MatDialogRef<any>;
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: TemplateRef<any>;
    /** Reference to send email dialog */
    private sendEmailDialogRef: MatDialogRef<any>;
    /** True if datepicker menu is open */
    public isDatePickerOpen: boolean = false;
    /** Stores the voucher eligible for adjustment */
    public voucherForAdjustment: Array<Adjustment>;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** This will hold if updated is account in master to refresh the list of vouchers */
    public isAccountUpdated: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, if user has enable GST E-invoice */
    public gstEInvoiceEnable: boolean;
    /** True if selected items needs to be updated */
    public updateSelectedItems: boolean = false;
    /** This will hold comparision filters */
    public comparisionFilters: any[] = [];
    /** Stores the E-invoice cancellation reason */
    public eInvoiceCancel: { cancellationReason: string, cancellationRemarks?: string } = {
        cancellationReason: '',
        cancellationRemarks: '',
    };
    /** Stores the E-invoice cancellation options */
    public eInvoiceCancellationReasonOptions = [];
    /** True if user has voucher list permission */
    public hasVoucherListPermissions: boolean = true;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** This holds selected e-invoice for cancelation */
    public selectedEInvoice: any;
    /** True if dropdown menu needs to show upwards */
    public isDropUp: boolean = false;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Holds Voucher Name that suports csv file export */
    public csvSupportVoucherType: string[] = ['sales', 'debit note', 'credit note', 'purchase'];

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _invoiceService: InvoiceService,
        private _toaster: ToasterService,
        private _activatedRoute: ActivatedRoute,
        private generalActions: GeneralActions,
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
        private dialog: MatDialog,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private purchaseOrderActions: PurchaseOrderActions
    ) {
        this.advanceReceiptAdjustmentData = null;
        this.invoiceSearchRequest.page = 1;
        this.invoiceSearchRequest.count = PAGINATION_LIMIT;
        this.invoiceSearchRequest.entryTotalBy = '';
        this.invoiceSearchRequest.accountUniqueName = '';
        this.invoiceSearchRequest.invoiceNumber = '';
        this.actionOnInvoiceSuccess$ = this.store.pipe(select(p => p.receipt.actionOnInvoiceSuccess), takeUntil(this.destroyed$));
        this.isGetAllRequestInProcess$ = this.store.pipe(select(p => p.receipt.isGetAllRequestInProcess), takeUntil(this.destroyed$));
        this.exportInvoiceRequestInProcess$ = this.store.pipe(select(p => p.invoice.exportInvoiceInprogress), takeUntil(this.destroyed$));
        this.exportedInvoiceBase64res$ = this.store.pipe(select(p => p.invoice.exportInvoicebase64Data), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.voucherDetails$ = this.store.pipe(select(s => s.receipt.voucher), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    /**
     * Opens dialogs using Angular Material
     *
     * @param {TemplateRef<any>} template - Template reference for the dialog
     * @memberof InvoicePreviewComponent
     */
    public openModal(template: TemplateRef<any>): void {
        if (template === this.bulkExport) {
            this.bulkExportDialogRef = this.dialog.open(template, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        } else if (template === this.cancelEInvoiceTemplate) {
            this.cancelEInvoiceDialogRef = this.dialog.open(template, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        } else if (template === this.template) {
            this.searchTemplateDialogRef = this.dialog.open(template, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        } else if (template === this.sendEmailModal) {
            this.sendEmailDialogRef = this.dialog.open(template, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        } else {
            // Fallback for any remaining modals that haven't been migrated yet
            this.modalRef = this.modalService.show(template);
        }
    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector("body")?.classList?.add("invoice-preview-page");
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result.matches;
        });

        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.companyName$.pipe(take(1)).subscribe(companyUniqueName => this.companyUniqueName = companyUniqueName);
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
            }
        });
        this.advanceSearchFilter.page = 1;
        this.advanceSearchFilter.count = PAGINATION_LIMIT;

        this._activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a && a.accountUniqueName && a.voucherUniqueName) {
                this.getVoucherDetails(VoucherTypeEnum.sales, a.accountUniqueName, a.voucherUniqueName);
            }
        });

        this._activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a && a.accountUniqueName && a.purchaseRecordUniqueName) {
                this.getVoucherDetails(VoucherTypeEnum.purchase, a.accountUniqueName, a.purchaseRecordUniqueName);
            }

            if (!(a && a.voucherType)) {
                return;
            }
            if (a && a.voucherType === 'recurring') {
                return;
            }
            this.selectedVoucher = (a) ? a?.voucherType : "";
            if (this.selectedVoucher === 'credit note' || this.selectedVoucher === 'debit note') {
                this.templateType = 'voucher';
            } else {
                this.templateType = 'invoice';
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
                    let voucherIndex = voucherData.items.findIndex(item => item?.uniqueName === record.purchaseRecordUniqueName);
                    if (voucherIndex > -1) {
                        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
                        if (record.mergedRecordUniqueName) {
                            allItems = allItems?.filter(item => item?.uniqueName !== record.mergedRecordUniqueName);
                        }
                        if (allItems[voucherIndex]) {
                            allItems[voucherIndex].voucherNumber = record.invoiceNumber;
                        }
                        allItems = uniqBy([allItems[voucherIndex], ...allItems], 'uniqueName');
                        this.itemsListForDetails = allItems;
                        this.toggleBodyClass();
                        setTimeout(() => {
                            const itemIndex = this.itemsListForDetails?.findIndex(item => item?.uniqueName === record.purchaseRecordUniqueName);
                            this.selectedInvoiceForDetails = allItems[itemIndex];
                            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(null, null));
                            this.store.dispatch(this.purchaseRecordActions.resetUpdatePurchaseRecord());
                        }, 1000);
                    }
                }
            });

        this.store.pipe(select(s => s.invoice.settings), takeUntil(this.destroyed$)).subscribe(settings => {
            if (settings) {
                this.invoiceSetting = settings;
                this.gstEInvoiceEnable = settings.invoiceSettings?.gstEInvoiceEnable;
            } else {
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
            }
        });

        //--------------------- Refresh report data according to universal date--------------------------------
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                if (localStorage.getItem('universalSelectedDate')) {
                    let universalStorageData = localStorage.getItem('universalSelectedDate').split(',');
                    if ((dayjs(universalStorageData[0]).format(GIDDH_DATE_FORMAT) === dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT)) && (dayjs(universalStorageData[1]).format(GIDDH_DATE_FORMAT) === dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT))) {
                        if (window.localStorage && localStorage.getItem('invoiceSelectedDate')) {
                            let storedSelectedDate = JSON.parse(localStorage.getItem('invoiceSelectedDate'));
                            let dateRange = { fromDate: '', toDate: '' };
                            dateRange = this.generalService.dateConversionToSetComponentDatePicker(storedSelectedDate.fromDates, storedSelectedDate.toDates);
                            this.selectedDateRange = { startDate: dayjs(dateRange.fromDate), endDate: dayjs(dateRange.toDate) };
                            this.selectedDateRangeUi = dayjs(dateRange.fromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                            // assign dates
                            if (storedSelectedDate.fromDates && storedSelectedDate.toDates) {
                                this.invoiceSearchRequest.from = storedSelectedDate.fromDates;
                                this.invoiceSearchRequest.to = storedSelectedDate.toDates;
                                this.isUniversalDateApplicable = false;
                            }
                        } else {
                            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            // assign dates

                            this.invoiceSearchRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                            this.invoiceSearchRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                            this.isUniversalDateApplicable = true;
                        }
                    } else {
                        this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                        // assign dates

                        this.invoiceSearchRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                        this.invoiceSearchRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                        this.isUniversalDateApplicable = true;
                    }
                } else {
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    // assign dates

                    this.invoiceSearchRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                    this.invoiceSearchRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                    this.isUniversalDateApplicable = true;

                    if (window.localStorage) {
                        localStorage.setItem('universalSelectedDate', dateObj);
                    }
                }
                this.getVoucher(true);
            }
        });

        this.actionOnInvoiceSuccess$.subscribe((a) => {
            if (a) {
                this.selectedInvoiceForDetails = null;
                this.getVoucher(this.isUniversalDateApplicable);
            }
        });

        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            if (s !== null && s !== undefined) {
                this.showAdvanceSearchIcon = true;
                this.invoiceSearchRequest.q = s;
                this.getVoucher(this.isUniversalDateApplicable);
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            if (s !== null && s !== undefined) {
                this.showAdvanceSearchIcon = true;
                this.invoiceSearchRequest.q = s;
                this.getVoucher(this.isUniversalDateApplicable);
            }
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
                } else if (response.voucherAdjustments) {
                    this.advanceReceiptAdjustmentData = response.voucherAdjustments;
                } else if (response.adjustments) {
                    this.advanceReceiptAdjustmentData = { adjustments: this.adjustmentUtilityService.formatAdjustmentsObject(response.adjustments) };
                }
                if (response.taxTotal) {
                    if (response.taxTotal.taxBreakdown) {
                        response.taxTotal.taxBreakdown.forEach(item => {
                            if (item?.taxType === 'tcspay' && item?.amountForAccount) {
                                this.invFormData.voucherDetails.tcsTotal = item?.amountForAccount;
                            }
                            if (item?.taxType === 'tdspay' && item?.amountForAccount) {
                                this.invFormData.voucherDetails.tdsTotal = item?.amountForAccount;
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
                        this.openAdjustPaymentDialog();
                        this.selectedPerformAdjustPaymentAction = false;
                    } else {
                        if (response.account && response.date) {
                            this.getAllAdvanceReceipts(response.account?.uniqueName, response.date);
                            this.selectedPerformAdjustPaymentAction = false;
                        }
                    }
                }
            }
        });

        this.store.pipe(select(state => state.common.isAccountUpdated), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                if (this.isAccountUpdated) {
                    this.getVoucher(this.isUniversalDateApplicable);
                    this.isAccountUpdated = false;
                }
            }
            if (response) {
                this.isAccountUpdated = true;
                this.store.dispatch(this.commonActions.accountUpdated(false));
            }
        });

        this.store.pipe(select(state => state.invoice.isGenerateBulkInvoiceCompleted), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.updateSelectedItems = true;
                this.getVoucher(this.isUniversalDateApplicable);
                this.store.dispatch(this.invoiceActions.resetBulkEInvoice());
            }
        });

        this.store.pipe(select(state => state.receipt.hasVoucherListPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasVoucherListPermissions = response;
        });

        this.store.dispatch(this.purchaseOrderActions.setPurchaseOrderFilters({}));
    }

    private getVoucherDetails(voucherType: VoucherTypeEnum, accountUniqueName: string, voucherUniqueName: string): void {
        const apiCallObservable = this.voucherApiVersion === 2 ?
            this._receiptServices.getVoucherDetailsV4(accountUniqueName, {
                invoiceNumber: '',
                voucherType: voucherType,
                uniqueName: voucherUniqueName
            }) :
            this._receiptServices.GetPurchaseRecordDetails(accountUniqueName, voucherUniqueName);

        apiCallObservable.pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
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
                        uniqueName: (res.body.account) ? res.body.account?.uniqueName : null,
                        name: (res.body.account) ? res.body.account.name : null
                    },
                    uniqueName: res.body?.uniqueName,
                    voucherDate: res.body.date,
                    voucherNumber: res.body.number,
                    balanceDue: res.body.balanceTotal,
                    isSelected: false,
                    dueDays: null,
                    cashInvoice: false
                };
                this.selectedVoucher = voucherType;
                if (this.itemsListForDetails) {
                    this.onSelectInvoice(this.purchaseRecord);
                }

                if (voucherType === VoucherTypeEnum.sales) {
                    this.purchaseRecord = null;
                }
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedVoucher'] && changes['selectedVoucher'].currentValue !== changes['selectedVoucher'].previousValue && changes['selectedVoucher'].currentValue !== this.selectedVoucher) {
            this.selectedVoucher = changes['selectedVoucher'].currentValue;

            if (this.selectedVoucher === VoucherTypeEnum.creditNote || this.selectedVoucher === VoucherTypeEnum.debitNote) {
                this.templateType = 'voucher';
            } else {
                this.templateType = 'invoice';
            }
            this.getVoucher(false);
            this.selectedInvoice = null;
        }

        if (changes['refreshPurchaseBill'] && ((changes['refreshPurchaseBill'].currentValue && changes['refreshPurchaseBill'].currentValue !== changes['refreshPurchaseBill'].previousValue) || changes['refreshPurchaseBill'].firstChange)) {
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
     * Opens the advance search dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public toggleAdvanceSearchPopup(): void {
        if (!this.advanceSearchDialogRef) {
            this.advanceSearchDialogRef = this.dialog.open(this.advanceSearchDialog, {
                width: '70%',
                height: 'auto',
                panelClass: 'custom-dialog-container'
            });

            this.advanceSearchDialogRef.afterClosed().subscribe(() => {
                this.advanceSearchDialogRef = null;
            });
        } else {
            this.closeAdvanceSearchDialog();
        }
    }

    /**
     * Closes the advance search dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closeAdvanceSearchDialog(): void {
        if (this.advanceSearchDialogRef) {
            this.advanceSearchDialogRef.close();
        }
    }

    /**
     * Bulk update model show hide
     *
     * @param {boolean} isClose
     * @param {boolean} [refreshVouchers]
     * @memberof InvoicePreviewComponent
     */
    public toggleBulkUpdatePopup(isClose: boolean, refreshVouchers?: boolean): void {
        if (isClose) {
            this.closeBulkUpdateDialog(refreshVouchers);
        } else {
            if (!this.bulkUpdateDialogRef) {
                this.bulkUpdateDialogRef = this.dialog.open(this.bulkUpdateDialog, {
                    width: '70%',
                    height: 'auto',
                    panelClass: 'custom-dialog-container'
                });

                this.bulkUpdateDialogRef.afterClosed().subscribe(() => {
                    this.bulkUpdateDialogRef = null;
                });
            }
        }
    }

    /**
     * Closes the bulk update dialog
     *
     * @param {boolean} [refreshVouchers]
     * @memberof InvoicePreviewComponent
     */
    public closeBulkUpdateDialog(refreshVouchers?: boolean): void {
        if (this.bulkUpdateDialogRef) {
            this.bulkUpdateDialogRef.close();
        }
        if (refreshVouchers) {
            this.getVoucher(this.isUniversalDateApplicable);
        }
    }

    /**
     * Toggles the E-way bill dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public toggleEwayBillPopup() {
        if (!this.eWayBillDialogRef) {
            // Open the dialog if it's not already open
            this.eWayBillDialogRef = this.dialog.open(this.eWayBillDialog, {
                width: '500px',
                panelClass: 'invoice-eway-bill-dialog',
                disableClose: true
            });
            
            // Subscribe to dialog close event
            this.eWayBillDialogRef.afterClosed().subscribe(() => {
                this.eWayBillDialogRef = null;
            });
            
            if (this.selectedVoucher === VoucherTypeEnum.sales) {
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                // To get re-assign receipts voucher store
                if (this.selectedInvoicesList[0]?.account?.uniqueName) {
                    this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.selectedInvoicesList[0]?.account?.uniqueName, {
                        invoiceNumber: this.selectedInvoicesList[0]?.voucherNumber,
                        voucherType: VoucherTypeEnum.sales,
                        uniqueName: this.selectedInvoicesList[0]?.uniqueName
                    }));
                }
            }
        } else {
            this.closeEwayBillDialog();
        }
        this._invoiceService.selectedInvoicesLists = [];
    }
    
    /**
     * Closes the E-way bill dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closeEwayBillDialog(): void {
        if (this.eWayBillDialogRef) {
            this.eWayBillDialogRef.close();
        }
        this._invoiceService.VoucherType = this.selectedVoucher;
        this._invoiceService.setSelectedInvoicesList(this.selectedInvoicesList);
    }

    public getInvoiceTemplateDetails(templateUniqueName: string) {
        if (templateUniqueName) {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
        } else {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
        }
    }

    /**
     * Handles pagination events and updates API parameters
     * 
     * @param {PageEvent} event - Contains pagination details
     * @memberof InvoicePreviewComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.toggleAllItems(false);
        this.invoiceSearchRequest.page = this.invoiceSearchRequest.count !== event.pageSize? 1 : event.pageIndex + 1;
        this.invoiceSearchRequest.count = event.pageSize;
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
                this.selectedInvoice = objItem;
                this.openPerformActionOnInvoiceDialog();
                setTimeout(() => {
                    if (this.invoicePaymentModelComponent) {
                        this.invoicePaymentModelComponent.focusAmountField();
                    }
                }, 500);
            } else {
                if (actionToPerform === "cancel" && item?.irnNumber) {
                    this.selectedEInvoice = item;
                    this.openModal(this.cancelEInvoiceTemplate);
                } else {
                    this.store.dispatch(this.invoiceActions.ActionOnInvoice(objItem?.uniqueName, {
                        action: actionToPerform,
                        voucherType: objItem?.voucherType ?? this.selectedVoucher
                    }));
                }
            }
            this.selectedPerformAdjustPaymentAction = false;
        }
    }

    /**
     * Opens the invoice confirmation dialog using Angular Material
     *
     * @memberof InvoicePreviewComponent
     */
    public openInvoiceConfirmationDialog(): void {
        this.invoiceConfirmationDialogRef = this.dialog.open(this.invoiceConfirmationDialog, {
            width: '500px',
            panelClass: 'custom-dialog-container'
        });

        this.invoiceConfirmationDialogRef.afterClosed().subscribe(() => {
            this.invoiceConfirmationDialogRef = null;
        });
    }
    
    /**
     * Opens the perform action on invoice dialog using Angular Material
     *
     * @memberof InvoicePreviewComponent
     */
    public openPerformActionOnInvoiceDialog(): void {
        this.performActionOnInvoiceDialogRef = this.dialog.open(this.performActionOnInvoiceDialog, {
            width: '500px',
            panelClass: 'custom-dialog-container perform-payment'
        });

        this.performActionOnInvoiceDialogRef.afterClosed().subscribe(() => {
            this.performActionOnInvoiceDialogRef = null;
        });
    }

    public onDeleteBtnClick() {
        let allInvoices = cloneDeep(this.voucherData.items);
        this.selectedInvoice = allInvoices.find((o) => o?.uniqueName === this.selectedItems[0]);
        this.openInvoiceConfirmationDialog();
    }

    public deleteConfirmedInvoice(selectedVoucher?: any) {
        if (this.invoiceConfirmationDialogRef) {
            this.invoiceConfirmationDialogRef.close();
        }
        if (this.selectedVoucher === VoucherTypeEnum.purchase && this.voucherApiVersion !== 2) {
            const requestObject = {
                uniqueName: (selectedVoucher) ? encodeURIComponent(selectedVoucher?.uniqueName) : (this.selectedInvoice) ? encodeURIComponent(this.selectedInvoice?.uniqueName) : (this.selectedInvoiceForDetails) ? encodeURIComponent(this.selectedInvoiceForDetails?.uniqueName) : ''
            };
            this.purchaseRecordService.deletePurchaseRecord(requestObject).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.selectedItems = [];
                if (response?.status === 'success') {
                    this._toaster.successToast(response.body);
                    this.selectedInvoiceForDetails = null;
                    this.getVoucher(this.isUniversalDateApplicable);
                } else {
                    this._toaster.errorToast(response?.message);
                    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.lastListingFilters, this.selectedVoucher));
                    this._receiptServices.getAllReceiptBalanceDue(this.lastListingFilters, this.selectedVoucher).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                        this.parseBalRes(res);
                    });
                }
            });
        } else {
            //  It will execute when Bulk delete operation
            if (this.selectedInvoicesList?.length > 1) {
                let bulkDeleteModel;
                let selectedVouchers = [];

                if (this.voucherApiVersion === 2) {
                    this.selectedInvoicesList.forEach(item => {
                        selectedVouchers.push(item?.uniqueName);
                    });
                    bulkDeleteModel = {
                        voucherUniqueNames: selectedVouchers,
                        voucherType: this.selectedVoucher
                    }
                } else {
                    this.selectedInvoicesList.forEach(item => {
                        selectedVouchers.push(item?.voucherNumber);
                    });
                    bulkDeleteModel = {
                        voucherNumbers: selectedVouchers,
                        voucherType: this.selectedVoucher
                    }
                }
                if (selectedVouchers?.length && bulkDeleteModel?.voucherType) {
                    this._invoiceBulkUpdateService.bulkUpdateInvoice(bulkDeleteModel, 'delete').subscribe(response => {
                        if (response) {
                            if (response.status === "success") {
                                this._toaster.successToast(response.body);
                                this.getVoucher(false);
                                this.toggleAllItems(false);
                            } else {
                                this._toaster.errorToast(response.message);
                            }
                        }
                    });
                }
            } else {
                let model;
                if (this.voucherApiVersion === 2) {
                    model = {
                        uniqueName: (selectedVoucher) ? selectedVoucher.uniqueName : this.selectedInvoice?.uniqueName,
                        voucherType: this.selectedVoucher
                    }
                } else {
                    model = {
                        invoiceNumber: (selectedVoucher) ? selectedVoucher.voucherNumber : this.selectedInvoice?.voucherNumber,
                        voucherType: this.selectedVoucher
                    }
                }

                let account = (selectedVoucher) ? selectedVoucher.account?.uniqueName : this.selectedInvoice.account?.uniqueName;
                this.store.dispatch(this.invoiceReceiptActions.DeleteInvoiceReceiptRequest(model, account));
            }

        }
    }

    /**
     * Closes the invoice confirmation dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closeConfirmationPopup(): void {
        if (this.invoiceConfirmationDialogRef) {
            this.invoiceConfirmationDialogRef.close();
        }
    }

    public performActionPopup(data: any): void {
        if (data) {
            data.action = 'paid';
            this.store.dispatch(this.invoiceActions.ActionOnInvoice(data.uniqueName, data));
        }
    }

    /**
     * Closes payment popup
     *
     * @memberof InvoicePreviewComponent
     */
    /**
     * Closes the perform action on invoice dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closePerformActionPopup(): void {
        this.store.dispatch(this.invoiceActions.resetActionOnInvoice());
        if (this.performActionOnInvoiceDialogRef) {
            this.performActionOnInvoiceDialogRef.close();
        }
    }

    public goToInvoice(voucherType: string) {
        this._router.navigate(['/pages/proforma-invoice/invoice/', voucherType]);
    }

    /**
     * onSelectInvoice
     */
    public onSelectInvoice(invoice: ReceiptItem) {
        this.selectedInvoice = cloneDeep(invoice);
        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
        setTimeout(() => {
            this.selectedInvoiceForDetails = cloneDeep(invoice);
            this.itemsListForDetails = cloneDeep(allItems);
            this.toggleBodyClass();
        }, 200);
    }

    /**
     * Opens the download or send mail dialog using Angular Material
     *
     * @memberof InvoicePreviewComponent
     */
    public openDownloadOrSendMailDialog(): void {
        this.downloadOrSendMailDialogRef = this.dialog.open(this.downloadOrSendMailDialog, {
            width: '80%',
            panelClass: 'custom-dialog-container'
        });

        this.downloadOrSendMailDialogRef.afterClosed().subscribe(() => {
            this.downloadOrSendMailDialogRef = null;
        });
    }

    /**
     * Closes the download or send mail dialog
     *
     * @param {Object} userResponse Response from the dialog
     * @memberof InvoicePreviewComponent
     */
    public closeDownloadOrSendMailPopup(userResponse: { action: string }) {
        if (this.downloadOrSendMailDialogRef) {
            this.downloadOrSendMailDialogRef.close();
        }
        if (userResponse.action === 'closed') {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }
    }

    public closeInvoiceModel(e) {
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
        let blob = this.generalService.base64ToBlob(this.base64Data, 'application/pdf', 512);
        return saveAs(blob, `${this.commonLocaleData?.app_invoice}-${this.selectedInvoice.account?.uniqueName}.pdf`);
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        this.showAdvanceSearchIcon = true;
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
            this._receiptServices.getAllReceiptBalanceDue(this.advanceSearchFilter, this.selectedVoucher).pipe(takeUntil(this.destroyed$)).subscribe(res => {
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
        if (this.lastListingFilters) {
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(cloneDeep(this.lastListingFilters), this.selectedVoucher));
            this._receiptServices.getAllReceiptBalanceDue(cloneDeep(this.lastListingFilters), this.selectedVoucher).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                this.parseBalRes(res);
            });
        }
    }

    /**
     * This will get the list of vouchers after preview page closed
     *
     * @param {boolean} isUniversalDateSelected
     * @memberof InvoicePreviewComponent
     */
    public getVouchersList(isUniversalDateSelected: boolean): void {
        let request;
        if (this.lastListingFilters) {
            request = this.lastListingFilters;
        } else {
            request = this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected);
        }

        if (!request.invoiceDate && !request.dueDate) {
            request.from = this.invoiceSearchRequest.from;
            request.to = this.invoiceSearchRequest.to;
        }

        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.selectedVoucher));
        this._receiptServices.getAllReceiptBalanceDue(request, this.selectedVoucher).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.parseBalRes(res);
        });
    }

    public prepareModelForInvoiceReceiptApi(isUniversalDateSelected): InvoiceReceiptFilter {
        let model: any = {};
        let o = cloneDeep(this.invoiceSearchRequest);
        let advanceSearch = cloneDeep(this.advanceSearchFilter);

        if (o?.voucherNumber && model) {
            model.voucherNumber = o?.voucherNumber;
        }
        if (o.page) {
            advanceSearch.page = o.page;
        }
        model = { ...model, ...advanceSearch };

        if (o.balanceDue) {
            model.balanceDue = o.balanceDue;
        }
        if (o.description) {
            model.description = o.description;
        }
        if (o.entryTotalBy === this.comparisionFilters[0]?.value) {
            model.balanceMoreThan = true;
        } else if (o.entryTotalBy === this.comparisionFilters[1]?.value) {
            model.balanceLessThan = true;
        } else if (o.entryTotalBy === this.comparisionFilters[2]?.value) {
            model.balanceMoreThan = true;
            model.balanceEqual = true;
        } else if (o.entryTotalBy === this.comparisionFilters[3]?.value) {
            model.balanceLessThan = true;
            model.balanceEqual = true;
        } else if (o.entryTotalBy === this.comparisionFilters[4]?.value) {
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

        if (o?.invoiceNumber && model) {
            model.voucherNumber = o?.invoiceNumber;
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
            this.invoiceSearchRequest.from = dayjs(event.picker.startDate.$d).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = dayjs(event.picker.endDate.$d).format(GIDDH_DATE_FORMAT);
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
        } else if (fieldName === 'accountUniqueName') {
            this.showCustomerSearch = true;
            this.showInvoiceNoSearch = false;
            this.showProformaSearch = false;
            this.showPurchaseOrderSearch = false;
        } else if (fieldName === 'purchaseOrderNumbers') {
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
        this._invoiceService.DownloadInvoice(this.selectedInvoice.account?.uniqueName, dataToSend).pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res) {

                    if (dataToSend.typeOfInvoice.length > 1) {
                        return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                    }

                    return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                } else {
                    this._toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            });
    }

    public toggleAllItems(type: boolean, manualToggle: boolean = false) {
        this.allItemsSelected = type;
        this.selectedItems = [];
        if (this.voucherData && this.voucherData.items && this.voucherData.items.length) {
            this.voucherData.items = map(this.voucherData.items, (item: ReceiptItem) => {
                item.isSelected = this.allItemsSelected;
                let isAvailable = false;
                if (this.selectedInvoicesList && this.selectedInvoicesList.length > 0) {
                    this.selectedInvoicesList.forEach((ele) => {
                        if (ele?.uniqueName === item?.uniqueName) {
                            isAvailable = true;
                        }
                    });
                }
                if (!isAvailable) {
                    this.selectedInvoicesList.push(item);
                }

                if (manualToggle) {
                    if (this.allItemsSelected) {
                        this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item?.uniqueName);
                    } else {
                        this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item?.uniqueName);
                    }
                }
                this.selectedItems.push(item?.uniqueName);
                return item;
            });
        }
        if (!this.allItemsSelected) {
            this.selectedInvoicesList = this.selectedInvoicesList?.filter((ele) => {
                return ele.isSelected;
            });

            if (this.voucherData && this.voucherData.items) {
                this.voucherData.items.forEach((ele) => {
                    this.selectedInvoicesList = this.selectedInvoicesList?.filter((s) => {
                        return ele.uniqueName !== s?.uniqueName;
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
            this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item?.uniqueName);
            this.selectedItems.push(item?.uniqueName);
            if (this.voucherData.items.length === this.selectedItems.length) {
                this.allItemsSelected = true
            }
        } else {
            this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item?.uniqueName);
            this.selectedItems = this.selectedItems?.filter(selectedItem => selectedItem !== item?.uniqueName);
            this.allItemsSelected = false;
        }
        this.itemStateChanged(item);
    }

    public clickedOutside(event: Event, el, fieldName: string) {

        if (fieldName === 'invoiceNumber') {
            if (this.voucherNumberInput?.value !== null && this.voucherNumberInput?.value !== '') {
                return;
            }
        } else if (fieldName === 'accountUniqueName') {
            if (this.accountUniqueNameInput?.value !== null && this.accountUniqueNameInput?.value !== '') {
                return;
            }
        } else if (fieldName === 'ProformaPurchaseOrder') {
            if (this.ProformaPurchaseOrder?.value !== null && this.ProformaPurchaseOrder?.value !== '') {
                return;
            }
        } else if (fieldName === 'purchaseOrderNumbers') {
            if (this.purchaseOrderNumbersInput?.value !== null && this.purchaseOrderNumbersInput?.value !== '') {
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
        let indexInv = (this.selectedInvoicesList) ? this.selectedInvoicesList.findIndex(f => f?.uniqueName === item?.uniqueName) : -1;

        if (indexInv > -1 && !allSelected) {
            this.selectedInvoicesList = this.selectedInvoicesList?.filter(f => f?.uniqueName !== item?.uniqueName);
        } else {
            this.selectedInvoicesList.push(item);     // Array of checked seleted Items of the list
        }

        if (this.selectedInvoicesList?.length > 0) {
            this.isExported = true;
        }
        this.selectedInvoicesList = this.selectedInvoicesList?.filter(s => s.isSelected);
    }

    public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
        this.showAdvanceSearchIcon = true;
        request.from = this.invoiceSearchRequest.from;
        request.to = this.invoiceSearchRequest.to;
        this.lastListingFilters = request;
        if (this.invoiceSearchRequest && this.invoiceSearchRequest.q) {
            request.q = this.invoiceSearchRequest.q;
        }

        if (this.invoiceSearchRequest && this.invoiceSearchRequest.sort) {
            request.sort = this.invoiceSearchRequest.sort;
        }
        if (this.invoiceSearchRequest && this.invoiceSearchRequest.sortBy) {
            request.sortBy = this.invoiceSearchRequest.sortBy;
        }

        if (this.voucherApiVersion === 2) {
            request.voucherDate = request.invoiceDate;
            delete request['invoiceDate'];
        }
        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.selectedVoucher));
        this._receiptServices.getAllReceiptBalanceDue(request, this.selectedVoucher).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.parseBalRes(res);
        });

        if (this.voucherApiVersion === 2) {
            request.invoiceDate = request.voucherDate;
        }
    }

    public resetAdvanceSearch(): void {
        this.showAdvanceSearchIcon = false;
        if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
            this.advanceSearchComponent.allShSelect.forEach(f => {
                f?.clear();
            });
            this.voucherNumberInput.reset();
            this.invoiceSearchRequest.q = '';
            this.accountUniqueNameInput.reset();
        }

        if (this.advanceSearchComponent) {
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
        this.invoiceSearchRequest.page = 1;
        this.invoiceSearchRequest.count = PAGINATION_LIMIT;
        this.invoiceSearchRequest.voucherNumber = '';
        this.selectedRangeLabel = "";

        let universalDate;
        // get application date
        this.universalDate$.pipe(take(1)).subscribe(date => {
            universalDate = date;
        });

        // set date picker date as application date
        if (universalDate?.length > 1) {
            this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
            this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

            this.invoiceSearchRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
        }
        this.getVoucher(this.isUniversalDateApplicable);
    }

    public sendEmail(obj: any) {
        if (obj.email) {
            if (this.voucherApiVersion === 2) {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoiceForDetails.account?.uniqueName, {
                    email: { to: obj.email.split(',') },
                    uniqueName: obj?.uniqueName || this.selectedInvoiceForDetails?.uniqueName,
                    voucherType: this.selectedVoucher,
                    copyTypes: obj.invoiceType ? obj.invoiceType : []
                }));
            } else {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoiceForDetails.account?.uniqueName, {
                    emailId: obj.email.split(','),
                    voucherNumber: [obj.invoiceNumber || this.selectedInvoiceForDetails.voucherNumber],
                    voucherType: this.selectedVoucher,
                    typeOfInvoice: obj.invoiceType ? obj.invoiceType : []
                }));
            }
        } else {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoiceForDetails.account?.uniqueName, {
                numbers: obj.numbers.split(',')
            }, this.selectedVoucher));
        }
    }

    /**
     * called when someone closes invoice/ voucher preview page
     * it will call get all so we can have latest data every time someone updates invoice/ voucher
     */
    public invoicePreviewClosed() {
        this.updateSelectedItems = true;
        this.selectedInvoice = null;
        this.selectedInvoiceForDetails = null;
        this.toggleBodyClass();

        if (this.purchaseRecord?.uniqueName) {
            this.location.back();
        } else {
            this.getVouchersList(this.isUniversalDateApplicable);
        }

        setTimeout(() => {
            if (!document.getElementsByClassName("sidebar-collapse")?.length) {
                this.store.dispatch(this.generalActions.openSideMenu(true));
            }
        }, 200);
    }

    public ngOnDestroy() {
        if (window.localStorage) {
            localStorage.removeItem('universalSelectedDate');
            localStorage.removeItem('invoiceSelectedDate');
        }
        document.querySelector('body').classList.remove('fixed');
        document.querySelector('body').classList.remove('invoice-preview-page');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public validateInvoiceForEway() {
        let allInvoices = cloneDeep(this.voucherData.items);
        this.selectedInvoice = allInvoices.find((o) => o?.uniqueName === this.selectedItems[0]);
        this.validateInvoiceobj.invoiceNumber = this.selectedInvoice.voucherNumber;
        this._invoiceService.validateInvoiceForEwaybill(this.validateInvoiceobj).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                if (res.body?.errorMessage) {
                    this._toaster.warningToast(res.body?.errorMessage);
                }
            }
        });
    }

    public exportCsvDownload(type: string): any {
        const isAllItemsSelected = this.allItemsSelected;
        this.exportcsvRequest.from = this.invoiceSearchRequest.from;
        this.exportcsvRequest.to = this.invoiceSearchRequest.to;
        let dataTosend = { accountUniqueName: '', uniqueNames: [], type: type };
        if (this.selectedInvoicesList?.length === 1) {
            dataTosend.accountUniqueName = this.selectedInvoicesList[0].account?.uniqueName;
        } else {
            delete dataTosend.accountUniqueName;
        }
        if (this.selectedItems.length) {
            dataTosend.uniqueNames = this.selectedItems;
        }
        this.exportcsvRequest.dataToSend = dataTosend;
        this._invoiceService.exportCsvInvoiceDownload(this.exportcsvRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                if (response.status === 'success') {
                    this.selectedInvoicesList = [];
                    this.selectedItems = [];
                    this.allItemsSelected = false;
                    this.voucherData.items.forEach((item) => {
                        item.isSelected = false;
                    });
                    let blob = this.generalService.base64ToBlob(response.body.data, 'application/xls', 512);
                    return saveAs(blob, response.body.name);
                } else {
                    this._toaster.errorToast(response.message);
                }
            }
        });
    }

    /**
     * Get Translated file name respect to given voucher
     *
     * @private
     * @param {string} type
     * @param {boolean} isAllItemsSelected
     * @returns {string}
     * @memberof InvoicePreviewComponent
     */
    private getExportFileNameByVoucherType(type: string, isAllItemsSelected: boolean): string {
        switch (type) {
            case 'sales': return isAllItemsSelected ? this.localeData?.all_invoices : this.localeData?.invoices;
            case 'purchase': return isAllItemsSelected ? this.localeData?.all_purchases : this.localeData?.purchases;
            case 'credit note': return isAllItemsSelected ? this.localeData?.all_credit_notes : this.localeData?.credit_notes;
            case 'debit note': return isAllItemsSelected ? this.localeData?.all_debit_notes : this.localeData?.debit_notes;
        }
    }

    private parseItemForVm(invoice: ReceiptItem): InvoicePreviewDetailsVm {
        let obj: InvoicePreviewDetailsVm = new InvoicePreviewDetailsVm();
        obj.voucherDate = invoice?.voucherDate;
        obj.voucherNumber = invoice?.voucherNumber;
        obj.uniqueName = invoice?.uniqueName;
        obj.grandTotal = invoice?.grandTotal?.amountForAccount;
        obj.voucherType = this.selectedVoucher === VoucherTypeEnum.sales ? (invoice.cashInvoice ? VoucherTypeEnum.cash : VoucherTypeEnum.sales) : this.selectedVoucher;
        obj.account = invoice?.account;
        obj.voucherStatus = invoice?.balanceStatus;
        obj.accountCurrencySymbol = invoice?.accountCurrencySymbol;
        obj.balanceDue = invoice.balanceDue;
        return obj;
    }

    public checkSelectedInvoice(voucherData: ReciptResponse) {
        voucherData.items.forEach((v) => {
            this.selectedInvoicesList.forEach((s) => {
                if (v?.uniqueName === s?.uniqueName) {
                    v.isSelected = true;
                }
            });
        });
        return voucherData;
    }

    private parseBalRes(res) {
        if (res && res.body) {
            this.totalSale = giddhRoundOff(res.body.grandTotal, this.giddhBalanceDecimalPlaces);
            this.totalDue = giddhRoundOff(res.body.totalDue, this.giddhBalanceDecimalPlaces);
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
     * To adjust invoice with advance receipts
     *
     * @param {ReceiptItem} item invoice details object
     * @memberof InvoicePreviewComponent
     */
    public onPerformAdjustPaymentAction(item: ReceiptItem): void {
        let customerUniqueName = this.getUpdatedAccountUniquename(item.voucherNumber, item.account?.uniqueName);

        if (item && item.totalBalance && item.totalBalance.amountForAccount !== undefined) {
            this.invFormData.voucherDetails.balanceDue = item.totalBalance.amountForAccount;
        }
        this.invFormData.voucherDetails.grandTotal = item.grandTotal.amountForAccount;
        this.invFormData.voucherDetails.customerName = item.account?.name;
        this.invFormData.voucherDetails.customerUniquename = customerUniqueName;
        this.invFormData.voucherDetails.voucherDate = item.voucherDate;
        this.invFormData.voucherDetails.exchangeRate = item.exchangeRate ?? 1;
        this.invFormData.accountDetails.currencyCode = item.account?.currency?.code ?? this.baseCurrency ?? '';
        this.invFormData.accountDetails.currencySymbol = item.accountCurrencySymbol ?? this.baseCurrencySymbol ?? '';
        this.invFormData.voucherDetails.gainLoss = item.gainLoss;
        this.invFormData.voucherDetails.voucherUniqueName = item.uniqueName;
        this.changeStatusInvoiceUniqueName = item?.uniqueName;

        if (this.voucherApiVersion === 2) {
            this._receiptServices.getVoucherDetailsV4(item.account?.uniqueName, {
                invoiceNumber: item.voucherNumber,
                voucherType: VoucherTypeEnum.sales,
                uniqueName: item?.uniqueName
            }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response?.status === "success") {
                    let tcsSum: number = 0;
                    let tdsSum: number = 0;
                    response.body?.entries.forEach(entry => {
                        entry.taxes?.forEach(tax => {
                            if (['tcsrc', 'tcspay'].includes(tax?.taxType)) {
                                tcsSum += tax.amount?.amountForAccount;
                            } else if (['tdsrc', 'tdspay'].includes(tax?.taxType)) {
                                tdsSum += tax.amount?.amountForAccount;
                            }
                        });
                    });
                    this.invFormData.voucherDetails.tcsTotal = tcsSum;
                    this.invFormData.voucherDetails.tdsTotal = tdsSum;

                    this.updateNewAccountInVoucher(item.account);
                    this.advanceReceiptAdjustmentData = { adjustments: this.adjustmentUtilityService.formatAdjustmentsObject(response.body?.adjustments) };
                    this.isUpdateMode = (response?.body?.adjustments?.length) ? true : false;
                    this.showAdvanceReceiptAdjust = true;
                    this.openAdjustPaymentDialog();
                } else {
                    this._toaster.errorToast(response?.message);
                }
            });
        } else {
            this.selectedPerformAdjustPaymentAction = true;
            // To clear receipts voucher store
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            // To get re-assign receipts voucher store
            this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(customerUniqueName, {
                invoiceNumber: item.voucherNumber,
                voucherType: VoucherTypeEnum.sales,
                uniqueName: item?.uniqueName
            }));
        }
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
        if (this.adjustPaymentDialogRef) {
            this.adjustPaymentDialogRef.close();
        }
    }
    
    /**
     * Opens the adjust payment dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public openAdjustPaymentDialog(): void {
        if (!this.adjustPaymentDialogRef) {
            this.adjustPaymentDialogRef = this.dialog.open(this.adjustPaymentDialog, {
                width: '80%',
                height: 'auto',
                panelClass: 'custom-dialog-container'
            });

            this.adjustPaymentDialogRef.afterClosed().subscribe(() => {
                this.adjustPaymentDialogRef = null;
            });
        }
    }

    /**
    * To get all advance adjusted data
    *
    * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }} advanceReceiptsAdjustEvent event that contains advance receipts adjusted data
    * @memberof InvoicePreviewComponent
    */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }) {
        this.advanceReceiptAdjustmentData = advanceReceiptsAdjustEvent.adjustVoucherData;
        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments && this.advanceReceiptAdjustmentData.adjustments.length > 0) {
            this.advanceReceiptAdjustmentData.adjustments.map(item => {
                item.voucherDate = (item.voucherDate?.toString()?.includes('/')) ? item.voucherDate?.trim()?.replace(/\//g, '-') : item.voucherDate;
                item.voucherNumber = item.voucherNumber === '-' ? '' : item.voucherNumber;

                if (this.voucherApiVersion === 2) {
                    item.amount = item.adjustmentAmount;
                    item.unadjustedAmount = item.balanceDue;
                    delete item.adjustmentAmount;
                    delete item.balanceDue;
                }
            });
        }
        const apiCallObservable = (this.voucherApiVersion === 2) ? this.salesService.adjustAnInvoiceWithAdvanceReceipts(this.advanceReceiptAdjustmentData.adjustments, this.changeStatusInvoiceUniqueName) : this.salesService.adjustAnInvoiceWithAdvanceReceipts(this.advanceReceiptAdjustmentData, this.changeStatusInvoiceUniqueName);

        apiCallObservable.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this._toaster.successToast(this.localeData?.amount_adjusted);
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
    public openAdvanceReceiptModal(event: any): void {
        if (event) {
            const selectedVoucher = this.voucherData.items?.filter(voucher => voucher?.uniqueName === event?.uniqueName);
            if (selectedVoucher?.length > 0) {
                this.onPerformAdjustPaymentAction(selectedVoucher[0]);
            } else {
                this.onPerformAdjustPaymentAction(this.selectedInvoice);
            }
        }
    }

    /**
     * Call API to get all advance receipts of an invoice
     *
     * @param {*} customerUniquename Selected customer unique name
     * @param {*} voucherDate Voucher Date (GIDDH_DATE_FORMAT)
     * @memberof InvoicePreviewComponent
     */
    public getAllAdvanceReceipts(customerUniqueName: string, voucherDate: string): void {
        if (customerUniqueName && voucherDate) {
            this.isAccountHaveAdvanceReceipts = false;
            let apiCallObservable: Observable<any>;
            // if (this.voucherApiVersion !== 2) {
            //     const requestObject = {
            //         accountUniqueName: customerUniqueName,
            //         invoiceDate: voucherDate
            //     };
            //     apiCallObservable = this.salesService.getAllAdvanceReceiptVoucher(requestObject);
            // } else {
                const requestObject = {
                    accountUniqueName: customerUniqueName,
                    voucherType: this.selectedVoucher
                }
                apiCallObservable = this.salesService.getInvoiceList(requestObject, voucherDate);
            // }
            apiCallObservable.pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res && res.status === 'success') {
                    if (res.body && (res.body.length || res.body.results?.length || res.body.items?.length)) {
                        this.voucherForAdjustment = (res.body.items?.length) ? res.body.items : (res.body.results?.length) ? res.body.results : res.body;
                        this.isAccountHaveAdvanceReceipts = true;
                        this.showAdvanceReceiptAdjust = true;
                        this.openAdjustPaymentDialog();
                        this.selectedPerformAdjustPaymentAction = false;
                    } else {
                        this.isAccountHaveAdvanceReceipts = false;
                        // if (this.voucherApiVersion !== 2) {
                        //     this._toaster.warningToast(this.localeData?.no_advance_receipt);
                        // } else {
                            this._toaster.warningToast(this.commonLocaleData?.app_voucher_unavailable);
                        // }
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
                if (voucher?.voucherNumber === voucherUpdatedDetails.number) {
                    if (voucher?.account?.uniqueName !== voucherUpdatedDetails.account?.uniqueName) {
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
                    newAccountUniqueName = voucher.account?.uniqueName;
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
    /**
     * This will show confirmation modal for delete Purchase Bill
     *
     * @param {*} billUniqueName
     * @memberof InvoicePreviewComponent
     */
    public deletePurchaseBill(billUniqueName: any): void {
        let allInvoices = cloneDeep(this.voucherData.items);
        this.selectedInvoice = allInvoices.find((inv) => inv?.uniqueName === billUniqueName);
        this.openInvoiceConfirmationDialog();
    }

    /**
     * Opens the send email modal using Angular Material
     *
     * @param {TemplateRef<any>} template - Template reference for the dialog
     * @param {any} item - Item data for email request
     * @memberof InvoicePreviewComponent
     */
    public openSendMailModal(template: TemplateRef<any>, item: any): void {
        this.sendEmailRequest.email = item?.account?.email;
        this.sendEmailRequest.uniqueName = item?.uniqueName;
        this.sendEmailRequest.accountUniqueName = item.account?.uniqueName;
        this.sendEmailRequest.companyUniqueName = this.companyUniqueName;
        this.openModal(template);
    }

    /**
     * Closes the send email dialog
     *
     * @param {any} event - Event from the email modal component
     * @memberof InvoicePreviewComponent
     */
    public closeSendMailPopup(): void {
        this.sendEmailDialogRef?.close();
    }

    /**
    * This will show the datepicker
    *
    * @param {boolean} isOpen
    * @memberof VoucherListComponent
    */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {            
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Closes the bulk export dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closeBulkExportDialog(): void {
        if (this.bulkExportDialogRef) {
            this.bulkExportDialogRef.close();
        }
    }

    /**
     * Closes the cancel E-invoice dialog and resets form data
     *
     * @memberof InvoicePreviewComponent
     */
    public closeCancelEInvoiceDialog(): void {
        if (this.cancelEInvoiceDialogRef) {
            this.cancelEInvoiceDialogRef.close();
            this.resetCancelEInvoice();
        }
    }

    /**
     * Closes the search template dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closeSearchTemplateDialog(): void {
        if (this.searchTemplateDialogRef) {
            this.searchTemplateDialogRef.close();
        }
    }

    /**
     * Closes the send email dialog
     *
     * @memberof InvoicePreviewComponent
     */
    public closeSendEmailDialog(): void {
        if (this.sendEmailDialogRef) {
            this.sendEmailDialogRef.close();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof InvoicePreviewComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.invoiceSearchRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.showAdvanceSearchIcon = true;
            this.invoiceSelectedDate.fromDates = this.invoiceSearchRequest.from;
            this.invoiceSelectedDate.toDates = this.invoiceSearchRequest.to;

            if (window.localStorage) {
                localStorage.setItem('invoiceSelectedDate', JSON.stringify(this.invoiceSelectedDate));
            }
            this.getVoucher(this.isUniversalDateApplicable);
        }
    }

    /**
     * Returns the overdue days text
     *
     * @param {*} days
     * @returns {string}
     * @memberof InvoicePreviewComponent
     */
    public getOverdueDaysText(days: any): string {
        let overdueDays = this.localeData?.overdue_days;
        overdueDays = overdueDays?.replace("[DAYS]", days);
        return overdueDays;
    }

    /**
     * Returns the total text
     *
     * @returns {string}
     * @memberof InvoicePreviewComponent
     */
    public getTotalText(): string {
        return !(this.selectedVoucher === 'credit note' || this.selectedVoucher === 'debit note') ? (this.selectedVoucher === 'purchase') ? this.localeData?.total_purchases : this.localeData?.total_sale : this.commonLocaleData?.app_total + ':';
    }

    /**
     * Returns the search field text
     *
     * @param {*} title
     * @returns {string}
     * @memberof InvoicePreviewComponent
     */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }

    /**
     * Creates the E-invoice in bulk
     *
     * @memberof InvoicePreviewComponent
     */
    public createBulkEInvoice(): void {
        let requestObject;

        if (this.voucherApiVersion === 2) {
            requestObject = {
                model: {
                    voucherUniqueNames: this.selectedInvoicesList.map(item => item?.uniqueName),
                    voucherType: this.selectedVoucher
                },
                actionType: 'einvoice'
            };
        } else {
            requestObject = {
                model: {
                    voucherNumbers: this.selectedInvoicesList.map(item => item.voucherNumber),
                    voucherType: this.selectedVoucher
                },
                actionType: 'einvoice'
            };
        }

        this.store.dispatch(this.invoiceActions.generateBulkEInvoice(requestObject));
    }

    /**
     * Returns the E-invoice tooltip text
     *
     * @private
     * @param {ReceiptItem} item Current item
     * @return {string} E-invoice status
     * @memberof InvoicePreviewComponent
     */
    private getEInvoiceTooltipText(item: ReceiptItem): string {
        switch (item?.status?.toLowerCase()) {
            case EInvoiceStatus.YetToBePushed:
                return this.localeData?.e_invoice_statuses.yet_to_be_pushed;
            case EInvoiceStatus.Pushed:
                return this.localeData?.e_invoice_statuses.pushed;
            case EInvoiceStatus.PushInitiated:
                return this.localeData?.e_invoice_statuses.push_initiated;
            case EInvoiceStatus.Cancelled:
                // E-invoice got cancelled but invoice didn't cancel
                return item.balanceStatus !== 'cancel' ? this.localeData?.e_invoice_statuses.giddh_invoice_not_cancelled : this.localeData?.e_invoice_statuses.cancelled;
            case EInvoiceStatus.MarkedAsCancelled:
                return this.localeData?.e_invoice_statuses.mark_as_cancelled;
            case EInvoiceStatus.Failed:
                return item.errorMessage ?? this.localeData?.e_invoice_statuses.failed;
            case EInvoiceStatus.NA:
                // When invoice is B2C or B2B cancelled invoice
                return item.errorMessage ?? this.localeData?.e_invoice_statuses?.na;
            default: return '';
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof InvoicePreviewComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.comparisionFilters = [
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'greaterThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'lessThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' }
            ];
            this.eInvoiceCancellationReasonOptions = [
                { label: this.localeData?.cancel_e_invoice_reasons?.duplicate, value: '1' },
                { label: this.localeData?.cancel_e_invoice_reasons?.data_entry_mistake, value: '2' },
                { label: this.localeData?.cancel_e_invoice_reasons?.order_cancelled, value: '3' },
                { label: this.localeData?.cancel_e_invoice_reasons?.other, value: '4' }
            ];

            combineLatest([
                this.store.pipe(select(p => p.receipt.vouchers), takeUntil(this.destroyed$), publishReplay(1), refCount()),
                this.store.pipe(select(s => s.receipt.voucherNoForDetails)),
                this.store.pipe(select(s => s.receipt.voucherNoForDetailsAction))
            ])
                .pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    if (res[0]) {
                        this.itemsListForDetails = [];
                        let existingInvoices = [];
                        res[0].items = res[0].items?.map((item: ReceiptItem) => {

                            if (this.voucherApiVersion === 2) {
                                item.balanceStatus = item.balanceStatus?.toLocaleLowerCase();
                            }

                            if (this.selectedInvoiceForDetails?.uniqueName === item?.uniqueName) {
                                let updatedItem = cloneDeep(item);
                                updatedItem.voucherType = this.selectedInvoiceForDetails?.voucherType;
                                this.selectedInvoiceForDetails = updatedItem;
                            }

                            let dueDate = item.dueDate ? dayjs(item.dueDate, GIDDH_DATE_FORMAT) : null;

                            if (dueDate) {
                                if (dueDate.isAfter(dayjs()) || ['paid', 'cancel'].includes(item.balanceStatus)) {
                                    item.dueDays = null;
                                } else {
                                    let dueDays = dueDate ? dayjs().diff(dueDate, 'day') : null;
                                    item.dueDays = dueDays;
                                }
                            } else {
                                item.dueDays = null;
                            }
                            if (MULTI_CURRENCY_MODULES?.indexOf(this.selectedVoucher) > -1) {
                                // For CR/DR note and Cash/Sales invoice
                                item = this.generalService.addToolTipText(this.selectedVoucher, this.baseCurrency, item, this.localeData, this.commonLocaleData, this.giddhBalanceDecimalPlaces);

                                if (this.gstEInvoiceEnable) {
                                    item.eInvoiceStatusTooltip = this.getEInvoiceTooltipText(item);
                                }
                            }

                            item.isSelected = this.generalService.checkIfValueExistsInArray(this.selectedInvoices, item?.uniqueName);
                            if (item.isSelected) {
                                existingInvoices.push(item?.uniqueName);
                            }

                            this.itemsListForDetails.push(this.parseItemForVm(item));
                            return item;
                        });

                        let selectedInvoices = [];
                        if (this.selectedInvoices && this.selectedInvoices.length > 0) {
                            this.selectedInvoices.forEach(invoice => {
                                if (existingInvoices?.indexOf(invoice) > -1) {
                                    selectedInvoices.push(invoice);
                                }
                            });

                            this.selectedInvoices = selectedInvoices;
                        }

                        let voucherData = cloneDeep(res[0]);
                        if (voucherData.items?.length) {
                            // this.totalSale = voucherData.items.reduce((c, p) => {
                            //   return Number(c.grandTotal) + Number(p.grandTotal);
                            // }, 0);
                            this.showExportButton = voucherData.items.every(s => s.account?.uniqueName === voucherData.items[0].account?.uniqueName);
                        } else {
                            if (voucherData.page > 1) {
                                voucherData.totalItems = voucherData.count * (voucherData.page - 1);
                                this.advanceSearchFilter.page = Math.ceil(voucherData.totalItems / voucherData.count);
                                this.invoiceSearchRequest.page = Math.ceil(voucherData.totalItems / voucherData.count);
                                this.getVoucher(false);
                                this.cdr.detectChanges();
                            }
                            this.showExportButton = false;
                        }

                        if (this.selectedInvoices && this.selectedInvoices.length > 0) {
                            voucherData.items.forEach((v) => {
                                v.isSelected = this.generalService.checkIfValueExistsInArray(this.selectedInvoices, v?.uniqueName);
                            });
                            res[0] = voucherData;
                        }
                        this.selectedItems = (this.updateSelectedItems) ? this.selectedInvoices : [];
                        this.updateSelectedItems = false;
                    }

                    // get voucherDetailsNo so we can open that voucher in details mode
                    if (res[0] && res[1] && res[2]) {
                        this.selectedInvoiceForDetails = null;
                        let voucherIndex = (res[0] as ReciptResponse)?.items?.findIndex(f => f.voucherNumber === res[1]);
                        if (voucherIndex > -1) {
                            let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
                            const removedItem = allItems.splice(voucherIndex, 1)[0];
                            allItems.unshift(removedItem);
                            this.toggleBodyClass();
                            setTimeout(() => {
                                const itemIndex = allItems.findIndex(item => item.voucherNumber === res[1]);
                                this.selectedInvoiceForDetails = allItems[itemIndex];
                                this.itemsListForDetails = cloneDeep(allItems);
                                this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(null, null));
                            }, 1000);
                        }
                    }
                    setTimeout(() => {
                        this.voucherData = cloneDeep(res[0]);
                        if (!this.cdr['destroyed']) {
                            this.cdr.detectChanges();
                        }
                    }, 100);

                    if (this.purchaseRecord?.uniqueName) {
                        this.onSelectInvoice(this.purchaseRecord);
                    }
                });
        }
    }

    /**
     * Resets the canel e-invoice form data
     *
     * @memberof InvoicePreviewComponent
     */
    public resetCancelEInvoice(): void {
        this.eInvoiceCancel = {
            cancellationReason: '',
            cancellationRemarks: '',
        };
    }

    /**
     * Handler for e-invoice cancellation
     *
     * @memberof InvoicePreviewComponent
     */
    public submitEInvoiceCancellation(): void {
        const requestObject: any = {
            cnlRsn: this.eInvoiceCancel.cancellationReason,
            cnlRem: this.eInvoiceCancel.cancellationRemarks?.trim()
        };

        const postObject: any = {};
        let apiCallObservable;

        if (this.voucherApiVersion === 2) {
            postObject.uniqueName = this.selectedEInvoice?.uniqueName;
            postObject.voucherType = this.selectedVoucher;

            requestObject.accountUniqueName = this.selectedEInvoice?.account?.uniqueName
            requestObject.voucherVersion = 2;

            apiCallObservable = this._invoiceService.cancelEInvoiceV2(requestObject, postObject);
        } else {
            if (this.selectedVoucher === VoucherTypeEnum.creditNote || this.selectedVoucher === VoucherTypeEnum.debitNote) {
                requestObject.voucherType = this.selectedVoucher;
                requestObject.voucherUniqueName = this.selectedEInvoice?.uniqueName;
            } else if (this.selectedVoucher === VoucherTypeEnum.sales) {
                requestObject.invoiceUniqueName = this.selectedEInvoice?.uniqueName;
            }

            apiCallObservable = this._invoiceService.cancelEInvoice(requestObject);
        }

        apiCallObservable.pipe(take(1)).subscribe(response => {
            this.getVoucher(this.isUniversalDateApplicable);
            if (response?.status === 'success') {
                this._toaster.successToast(response.body);
                this.modalRef?.hide();
                this.resetCancelEInvoice();
            } else if (response?.status === 'error') {
                this._toaster.errorToast(response.message, response.code);
            }
        });
    }

    /**
     * Trims the cancellation remarks
     *
     * @memberof InvoicePreviewComponent
     */
    public handleBlurOnCancellationRemarks(): void {
        this.eInvoiceCancel.cancellationRemarks = this.eInvoiceCancel?.cancellationRemarks.trim();
    }

    /**
     * This will determine if dropdown menu needs to show downwards or upwards
     *
     * @param {*} event
     * @memberof InvoicePreviewComponent
     */
    public showActionsMenu(event: any) {
        const screenHeight = event?.view?.innerHeight;
        const clickedPosition = event?.y;
        const actionPopupHeight = 200;
        const calculatedPosition = screenHeight - clickedPosition;

        if (calculatedPosition > actionPopupHeight) {
            this.isDropUp = false;
        } else {
            this.isDropUp = true;
        }
    }

    /**
     * Create E-way bill handler
     *
     * @memberof InvoicePreviewComponent
     */
    public createEWayBill(): void {
        this.store.pipe(select(state => state.receipt.voucher), take(1)).subscribe((voucher: any) => {
            if (!voucher?.account?.billingDetails?.pincode) {
                this._toaster.errorToast(this.localeData?.pincode_required);
            } else {
                this._router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
            }
        });
    }
}