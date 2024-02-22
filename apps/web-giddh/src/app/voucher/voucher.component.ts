import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { SalesActions } from '../actions/sales/sales.action';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, ActivationStart, Router } from '@angular/router';
import { SalesService } from '../services/sales.service';
import { ToasterService } from '../services/toaster.service';
import { GeneralActions } from '../actions/general/general.actions';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { InvoiceReceiptActions } from '../actions/invoice/receipt/receipt.actions';
import { AccountDetailsClass, ActionTypeAfterVoucherGenerateOrUpdate, AmountClassMulticurrency, CodeStockMulticurrency, DiscountMulticurrency, GenericRequestForGenerateSCD, GstDetailsClass, IForceClear, IStockUnit, PurchaseRecordRequest, SalesAddBulkStockItems, SalesEntryClass, SalesEntryClassMulticurrency, SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal, SalesTransactionItemClass, StateCode, TemplateDetailsClass, TransactionClassMulticurrency, VOUCHER_TYPE_LIST, VoucherClass, VoucherDetailsClass, VoucherTypeEnum } from '../models/api-models/Sales';
import { auditTime, debounceTime, delay, filter, map, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../theme/ng-select/option.interface';
import { BehaviorSubject, combineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { UntypedFormControl, NgForm } from '@angular/forms';
import { DiscountListComponent } from '../sales/discount-list/discountList.component';
import { IContentCommon, InvoicePreviewDetailsVm } from '../models/api-models/Invoice';
import { TaxResponse } from '../models/api-models/Company';
import { INameUniqueName } from '../models/interfaces/name-unique-name.interface';
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../models/api-models/Account';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { cloneDeep, find, forEach, isEqual, isUndefined, omit, orderBy, uniqBy } from '../lodash-optimized';
import { InvoiceSetting } from '../models/interfaces/invoice.setting.interface';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { LedgerDiscountClass } from '../models/api-models/SettingsDiscount';
import { SubVoucher, RATE_FIELD_PRECISION, HIGH_RATE_FIELD_PRECISION, SearchResultText, TCS_TDS_TAXES_TYPES, ENTRY_DESCRIPTION_LENGTH, EMAIL_REGEX_PATTERN, AdjustedVoucherType, MOBILE_NUMBER_UTIL_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_ADDRESS_JSON_URL, ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT } from '../app.constant';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ProformaActions } from '../actions/proforma/proforma.actions';
import { PreviousInvoicesVm, ProformaFilter, ProformaGetRequest, ProformaResponse } from '../models/api-models/proforma';
import { giddhRoundOff } from '../shared/helpers/helperFunctions';
import { InvoiceReceiptFilter, ReciptResponse } from '../models/api-models/recipt';
import { LedgerService } from '../services/ledger.service';
import { TaxControlComponent } from '../theme/tax-control/tax-control.component';
import { IVariant, LedgerResponseDiscountClass } from "../models/api-models/Ledger";
import { OnboardingFormRequest } from '../models/api-models/Common';
import { WarehouseActions } from '../settings/warehouse/action/warehouse.action';
import { SettingsUtilityService } from '../settings/services/settings-utility.service';
import { WarehouseDetails } from '../ledger/ledger.vm';
import { ConfirmationModalConfiguration } from '../theme/confirmation-modal/confirmation-modal.interface';
import { GeneralService } from '../services/general.service';
import { VoucherUtilityService } from './services/voucher-utility.service';
import { PurchaseRecordService } from '../services/purchase-record.service';
import { CommonActions } from '../actions/common.actions';
import { PurchaseRecordActions } from '../actions/purchase-record/purchase-record.action';
import { AdvanceReceiptAdjustmentComponent } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.component';
import { VoucherAdjustments, AdjustAdvancePaymentModal, Adjustment } from '../models/api-models/AdvanceReceiptsAdjust';
import { CurrentCompanyState } from '../store/company/company.reducer';
import { CustomTemplateState } from '../store/invoice/invoice.template.reducer';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { SearchService } from '../services/search.service';
import { PURCHASE_ORDER_STATUS } from '../shared/helpers/purchaseOrderStatus';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { AccountsAction } from '../actions/accounts.actions';
import { VoucherTypeToNamePipe } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.pipe';
import { Location, TitleCasePipe } from '@angular/common';
import { VoucherForm } from '../models/api-models/Voucher';
import { AdjustmentUtilityService } from '../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { GstReconcileActions } from '../actions/gst-reconcile/gst-reconcile.actions';
import { SettingsDiscountService } from '../services/settings.discount.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NewConfirmationModalComponent } from '../theme/new-confirmation-modal/confirmation-modal.component';
import { SelectFieldComponent } from '../theme/form-fields/select-field/select-field.component';
import { DropdownFieldComponent } from '../theme/form-fields/dropdown-field/dropdown-field.component';
import { PageLeaveUtilityService } from '../services/page-leave-utility.service';
import { CommonService } from '../services/common.service';
import { ConfirmModalComponent } from '../theme/new-confirm-modal/confirm-modal.component';

/** Type of search: customer and item (product/service) search */
const SEARCH_TYPE = {
    CUSTOMER: 'customer',
    ITEM: 'item',
    BANK: 'bank'
}

/** Declare of window */
declare var window;

@Component({
    selector: 'voucher-component',
    templateUrl: './voucher.component.html',
    styleUrls: [`./voucher.component.scss`],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    /** True if it is purchase invoice */
    @Input() public isPurchaseInvoice: boolean = false;
    /** Hold the account number */
    @Input() public accountUniqueName: string = '';
    /** Hold the invoice number */
    @Input() public invoiceNo = '';
    /** Hold the invoice type */
    @Input() public invoiceType: VoucherTypeEnum = VoucherTypeEnum.sales;
    /** Hold the selected items */
    @Input() public selectedItem: InvoicePreviewDetailsVm;
    /** True if this component is called directly */
    @Input() public callFromOutside: boolean = true;
    /** Element View Container instance */
    @ViewChild(ElementViewContainerRef, { static: true }) public elementViewContainerRef: ElementViewContainerRef;
    /** Copy from previous instance */
    @ViewChild('copyPreviousEstimate', { static: true }) public copyPreviousEstimate: ElementRef;
    /** Invoice Form instance */
    @ViewChild('invoiceForm', { static: false }) public invoiceForm: NgForm;
    /** Open Account Selection Dropdown instance */
    @ViewChild('openAccountSelectionDropdown', { static: false }) public openAccountSelectionDropdown: DropdownFieldComponent;
    /** Discount Compomnent instance */
    @ViewChildren('discountComponent') public discountComponent: QueryList<DiscountListComponent>;
    /** Tax Compomnent instance */
    @ViewChildren('taxControlComponent') public taxControlComponent: QueryList<TaxControlComponent>;
    /** Service dropdown instance */
    @ViewChildren('selectAccount') public selectAccount: QueryList<ElementRef>;
    /** Description instance */
    @ViewChildren('description') public description: QueryList<ElementRef>;
    /** Input customer name instance */
    @ViewChild('inputCustomerName', { static: true }) public inputCustomerName: ElementRef;
    /** Customer billing address instance */
    @ViewChild('customerBillingAddress', { static: true }) public customerBillingAddress: ElementRef;
    /** Datepicker instance */
    @ViewChildren(BsDatepickerDirective) public datePickers: QueryList<BsDatepickerDirective>;
    /** RCM popup instance */
    @ViewChild('rcmPopup', { static: false }) public rcmPopup: PopoverDirective;
    /** Billing state instance */
    @ViewChild('billingState', { static: true }) billingState: ElementRef;
    /** Shipping state instance */
    @ViewChild('shippingState', { static: true }) shippingState: ElementRef;
    /** Billing state instance */
    @ViewChild('billingStateCompany', { static: false }) billingStateCompany: ElementRef;
    /** Shipping state instance */
    @ViewChild('shippingStateCompany', { static: false }) shippingStateCompany: ElementRef;
    /** Advance Receipt Compomnent instance */
    @ViewChild('advanceReceiptComponent', { static: true }) public advanceReceiptComponent: AdvanceReceiptAdjustmentComponent;
    /** Container element for all the entries */
    @ViewChild('itemsContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
    /** Template reference for each entry */
    @ViewChild('entry', { read: TemplateRef, static: false }) template: TemplateRef<any>;
    /** Instance of aside Menu Product Service modal */
    @ViewChild('asideMenuProductService') asideMenuProductService: TemplateRef<any>;
    /** Billing state field instance */
    @ViewChild('statesBilling', { static: false }) statesBilling: SelectFieldComponent;
    /** Billing state field instance */
    @ViewChild('statesShipping', { static: false }) statesShipping: SelectFieldComponent;
    /** Mobile Number state instance */
    @ViewChild('initContactProforma', { static: false }) initContactProforma: ElementRef;
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    /* Selector for send email  modal */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /* Selector for print  modal */
    @ViewChild('printVoucherModal', { static: true }) public printVoucherModal: any;
    /* Selector for bulk items  modal */
    @ViewChild('bulkItemsModal', { static: true }) public bulkItemsModal: any;
    /**Adjust advance receipts */
    @ViewChild('adjustPaymentModal', { static: true }) public adjustPaymentModal: any;
    /** Purchase record modal instance */
    @ViewChild('purchaseRecordConfirmationPopup', { static: true }) public purchaseRecordConfirmationPopup: any;
    /** Date change confirmation modal */
    @ViewChild('dateChangeConfirmationModel', { static: true }) public dateChangeConfirmationModel: any;
    /** Delete attachment modal */
    @ViewChild('attachmentDeleteConfirmationModel', { static: true }) public attachmentDeleteConfirmationModel: any;
    // This will use for instance of warehouse
    @ViewChild('selectWarehouse', { static: false }) public selectWarehouse: DropdownFieldComponent;
    // This will use for instance of linking dropdown
    @ViewChild('linkingDropdown', { static: false }) public linkingDropdown: DropdownFieldComponent;
    // This will use for instance of invoice list
    @ViewChild('invoiceListDropdown', { static: false }) public invoiceListDropdown: DropdownFieldComponent;
    // This will use for instance of deposit dropdown
    @ViewChild('depositDropdown', { static: false }) public depositDropdown: DropdownFieldComponent;
    // This will use for instance of customer shipping state
    @ViewChild('customerShippingState', { static: false }) public customerShippingState: SelectFieldComponent;
    // This will use for instance of company billing state
    @ViewChild('companyBillingState', { static: false }) public companyBillingState: SelectFieldComponent;
    // This will use for instance of company shipping state
    @ViewChild('companyShippingState', { static: false }) public companyShippingState: SelectFieldComponent;
    /** This will reload voucher pdf and attachments on preview page */
    @Output() public reloadFiles: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** This will hold cancel voucher update */
    @Output() public cancelVoucherUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
    /* This will hold if it's mobile/desktop */
    public isMobileScreen: boolean = true;
    /** Stores the customer country code */
    public customerCountryCode: string = '';
    /** Invoice list array */
    public invoiceList: any[];
    /** Invoice list observable */
    public invoiceList$: Observable<any[]>;
    /** Selected invoice for credit note */
    public selectedInvoice: any = null;
    /** Show gst number */
    public showGSTINNo: boolean;
    /** Show TRN number */
    public showTRNNo: boolean;
    /** Show vat number */
    public showVATNo: boolean;
    /** Show other details collapsed */
    public isOthrDtlCollapsed: boolean = false;
    /** Show type head number of results */
    public typeaheadNoResultsOfCustomer: boolean = false;
    /** Show is sales invoice */
    public isSalesInvoice: boolean = true;
    /** Show is cash invoice */
    public isCashInvoice: boolean = false;
    /** Show is proforma invoice */
    public isProformaInvoice: boolean = false;
    /** Show is estimate invoice */
    public isEstimateInvoice: boolean = false;
    /** Show is credit note */
    public isCreditNote: boolean = false;
    /** Show is debit note */
    public isDebitNote: boolean = false;
    /** Show is update mode */
    public isUpdateMode = false;
    /** Show is last invoice copied */
    public isLastInvoiceCopied: boolean = false;
    /** Show advance receipts adjust */
    public showAdvanceReceiptAdjust: boolean = false;
    /** Show edit currency input field */
    public editCurrencyInputField: boolean = false;
    /** Show currency value */
    public showCurrencyValue: boolean = false;
    /** Show auto save icon */
    public autoSaveIcon: boolean = false;
    /** Show hsn dropdown */
    public hsnDropdownShow: boolean = false;
    /** Show edit pencil icon */
    public editPencilIcon: boolean = true;
    /** Hold customer country name */
    public customerCountryName: string = '';
    /** Hold customer placeholder */
    public customerPlaceHolder: string = '';
    /** Hold customer not found */
    public customerNotFoundText: string = '';
    /** Hold invoice label  */
    public invoiceNoLabel: string = '';
    /** Hold invoice date label */
    public invoiceDateLabel: string = '';
    /** Hold invoice due date label */
    public invoiceDueDateLabel: string = '';
    /** Instance of invoice form data */
    public invFormData: VoucherClass;
    /** Hold customer account list */
    public customerAcList$: Observable<IOption[]>;
    /** Hold bank account list observable  */
    public bankAccounts$: Observable<IOption[]>;
    /** Hold sales account list observable  */
    public salesAccounts$: Observable<IOption[]> = observableOf(null);
    /** Hold account aside menu state  */
    public accountAsideMenuState: string = 'out';
    /** Hold aside menu state for product service  */
    public asideMenuStateForProductService: any;
    /** Hold aside menu state for recurring entry  */
    public asideMenuStateForRecurringEntry: string = 'out';
    /** Hold aside menu state for other tax  */
    public asideMenuStateForOtherTaxes: string = 'out';
    /**This will use for thead array read only */
    public theadArrReadOnly: IContentCommon[] = [];
    /** Hold company tax list  */
    public companyTaxesList: TaxResponse[] = [];
    /** Hold newly create account observable  */
    public newlyCreatedAc$: Observable<INameUniqueName>;
    /** Hold newly create stock account */
    public newlyCreatedStockAc$: Observable<INameUniqueName>;
    /** Hold country source */
    public countrySource: IOption[] = [];
    /** Hold state source array  */
    public statesSource: IOption[] = [];
    /** Hold active account observable */
    public activeAccount$: Observable<AccountResponseV2>;
    /** This will use for auto fill shipping */
    public autoFillShipping: boolean = true;
    /**  This will use for toggle field for sales  */
    public toggleFieldForSales: boolean = true;
    /**  This will use for deposit amount  */
    public depositAmount: number = 0;
    /**  This will use for deposit amount after update  */
    public depositAmountAfterUpdate: number = 0;
    /**  This will use for giddh date format  */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /**  This will use for voucher details observable */
    public voucherDetails$: Observable<VoucherClass | GenericRequestForGenerateSCD>;
    /**  This will use for forcely clear */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /**  This will use for calculated round off */
    public calculatedRoundOff: number = 0;
    /**  This will use for select voucher type  */
    public selectedVoucherType: string = 'sales';
    /**  This will use for template params */
    public tempDateParams: any = {};
    /**  This will use for page list array  */
    public pageList: IOption[] = VOUCHER_TYPE_LIST;
    /**  This will use for universal date */
    public universalDate: any;
    /**  This will use for dayjs */
    public dayjs = dayjs;
    public GIDDH_DATE_FORMAT = GIDDH_DATE_FORMAT;
    public activeIndx: number;
    public isCustomerSelected = false;
    public voucherNumber: string;
    public depositAccountUniqueName: string;
    public lastInvoices$: Observable<ReciptResponse>;
    public lastProformaInvoices$: Observable<ProformaResponse>;
    public lastInvoices: PreviousInvoicesVm[] = [];
    public isFileUploading: boolean = false;
    public selectedFileName: string = '';
    public file: any = null;
    public invoiceDataFound: boolean = false;
    public isUpdateDataInProcess: boolean = false;
    public showLastEstimateModal: boolean = false;
    public selectedCustomerForDetails: string = null;
    public selectedGrpUniqueNameForAddEditAccountModal: string = '';
    public actionAfterGenerateORUpdate: ActionTypeAfterVoucherGenerateOrUpdate = ActionTypeAfterVoucherGenerateOrUpdate.generate;
    public companyCurrency: string;
    public fetchedConvertedRate: number = 0;
    public message: string;
    public exceptTaxTypes: string[];
    /** this is showing pending sales page **/
    public isPendingSales: boolean = false;
    /** Stores warehouses for a company */
    public warehouses: Array<any>;
    /** Stores the unique name of default warehouse of a company */
    public defaultWarehouse: string;
    /** Stores the name of default warehouse of a company */
    public defaultWarehouseName: string;
    /** Stores the unique name of selected warehouse */
    public selectedWarehouse: string;
    /** Stores the name of selected warehouse */
    public selectedWarehouseName: string;
    /** True, if warehouse drop down should be displayed */
    public shouldShowWarehouse: boolean;
    /** True, if the entry contains RCM applicable taxes */
    public isRcmEntry: boolean = false;
    /** RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    /** Purchase record confirmation popup configuration */
    public purchaseRecordConfirmationConfiguration: ConfirmationModalConfiguration;
    /** Prevents double click on generate button */
    public generateUpdateButtonClicked = new Subject<NgForm>();
    /** True, if the Giddh supports the taxation of the country (not supported now: UK, US, Nepal, Australia) */
    public shouldShowTrnGstVatField: boolean = false;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** Placeholder text for template */
    public templatePlaceholder: any = {
        customField1Label: '',
        customField2Label: '',
        customField3Label: '',
        shippedViaLabel: '',
        shippedDateLabel: '',
        trackingNumber: ''
    };
    /** Rate precision value that will be visible on UI */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Rate precision value that will be sent to API */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** Force clear for invoice drop down */
    public invoiceForceClearReactive$: Observable<IForceClear> = observableOf({ status: false });
    //Multi-currency changes
    /** Ng model of exchange rate field */
    public newExchangeRate = 1;
    public exchangeRate = 1;
    public selectedCompany: any;
    public formFields: any[] = [];
    public originalExchangeRate = 1;
    /** Stores the previous exchange rate of previous debtor */
    public previousExchangeRate = 1;
    public isMulticurrencyAccount = false;
    public invoiceUniqueName: string;
    public showLoader: boolean = true;
    public inputMaskFormat: string = '';
    public isPrefixAppliedForCurrency: boolean;
    public selectedSuffixForCurrency: string = '';
    public companyCurrencyName: string;
    public customerCurrencyCode: string;
    public baseCurrencySymbol: string = '';
    public depositCurrSymbol: string = '';
    public grandTotalMulDum;
    public showSwitchedCurr = false;
    public reverseExchangeRate: number;
    public adjustPaymentBalanceDueData: number = 0;
    public totalAdvanceReceiptsAdjustedAmount: number = 0;
    public isAdjustAmount = false;
    public adjustPaymentData: AdjustAdvancePaymentModal = {
        customerName: '',
        customerUniquename: '',
        voucherDate: '',
        balanceDue: 0,
        dueDate: '',
        grandTotal: 0,
        gstTaxesTotal: 0,
        subTotal: 0,
        totalTaxableValue: 0,
        totalAdjustedAmount: 0,
        convertedTotalAdjustedAmount: 0
    }
    public applyRoundOff: boolean = true;
    public customerAccount: any = { email: '' };
    public companyCountryCode: string = '';
    public originalReverseExchangeRate: number;
    /** to check is tourist scheme applicable(Note true if voucher type will be sales invoice)  */
    public isTouristScheme: boolean = false;
    public isValidGstinNumber: boolean = false;
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    /** Type of invoice status (pending ,invoice, CN/DN) */
    public isPendingVoucherType: boolean = false;
    // private members
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private selectedAccountDetails$: Observable<AccountResponseV2>;
    private innerEntryIdx: number;
    private updateAccount: boolean = false;
    private sundryDebtorsAcList: IOption[] = [];
    private sundryCreditorsAcList: IOption[] = [];
    private prdSerAcListForDeb: IOption[] = [];
    private prdSerAcListForCred: IOption[] = [];
    private createAccountIsSuccess$: Observable<boolean>;
    private updateAccountSuccess$: Observable<boolean>;
    private createdAccountDetails$: Observable<AccountResponseV2>;
    private updatedAccountDetails$: Observable<AccountResponseV2>;
    private generateVoucherSuccess$: Observable<any>;
    private updateVoucherSuccess$: Observable<boolean>;
    /* This will hold (true/false) once proforma voucher add/edit is in process and processed */
    private updateProformaVoucherInProcess$: Observable<boolean>;
    private lastGeneratedVoucherNo$: Observable<{ voucherNo: string, accountUniqueName: string }>;
    /** Observable if getOnboarding API call in progress */
    private getOnboardingFormInProcess$: Observable<boolean>;
    private entriesListBeforeTax: SalesEntryClass[];
    /** True, if user has selected custom invoice in Invoice Setting */
    private useCustomInvoiceNumber: boolean;
    /** True, if the invoice generation request is received from previous page's modal */
    private isInvoiceRequestedFromPreviousPage: boolean;
    /** Stores matching purchase record details */
    private matchingPurchaseRecord: any;
    /** Purchase Record customer unique name */
    private purchaseRecordCustomerUniqueName: string = '';
    /** Purchase Record tax number */
    private purchaseRecordTaxNumber: string = '';
    /** Purchase Record invoice date */
    private purchaseRecordInvoiceDate: string = '';
    /** Purchase Record invoice number */
    private purchaseRecordInvoiceNumber: string = '';
    /** Inventory Settings */
    public inventorySettings: any;
    /** Stores the adjustment data */
    public advanceReceiptAdjustmentData: VoucherAdjustments;
    /** To check is selected account/customer have advance receipts */
    public isAccountHaveAdvanceReceipts: boolean = false;
    /** To check is selected invoice already adjusted with at least one advance receipts  */
    public isInvoiceAdjustedWithAdvanceReceipts: boolean = false;
    /* This will hold the currently editing hsn/sac code */
    public editingHsnSac: any = "";
    /* This will hold if voucher type changed to make sure we don't destroy the data */
    public voucherTypeChanged: boolean = false;
    /* This will hold if we need to hide total tax and have to exclude tax amount from total invoice amount */
    public excludeTax: boolean = false;
    /* This will hold the company country name */
    public companyCountryName: string = '';
    /** this property is return whether invoice have at least on correct entry or not **/
    public hasVoucherEntry: boolean;
    /* This will hold the purchase orders */
    public purchaseOrders: IOption[] = [];
    /* This will hold linked PO */
    public linkedPo: any[] = [];
    /* This will hold linked PO items*/
    public linkedPoNumbers: any[] = [];
    /* This will hold filter dates for PO */
    public poFilterDates: any = { from: '', to: '' };
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Default search suggestion list to be shown for searching customer */
    public defaultCustomerSuggestions: Array<IOption> = [];
    /** Default search suggestion list to be shown for searching stock or services */
    public defaultItemSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Holds images folder path */
    public imgPath: string = "";
    /** Stores the search results pagination details for customer */
    public searchCustomerResultsPaginationData = {
        page: 0,
        count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
        query: ''
    };
    /** Stores the search results pagination details for stock or service  */
    public searchItemResultsPaginationData = {
        page: 0,
        count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
        query: ''
    };
    /** Stores the search results pagination details for bank */
    public searchBankResultsPaginationData = {
        page: 0,
        count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
        query: ''
    };
    /** Stores the default search results pagination details for customer */
    public defaultCustomerResultsPaginationData = {
        page: 0,
        count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
        query: ''
    };
    /** Stores the default search results pagination details for stock or service */
    public defaultItemResultsPaginationData = {
        page: 0,
        count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
        query: ''
    };
    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;
    /* This will hold selected PO */
    public selectedPoItems: any[] = [];
    /* Object for billing/shipping of company */
    public purchaseBillCompany: any = {
        billingDetails: {
            index: '',
            address: [],
            state: { code: '', name: '' },
            county: { code: '', name: '' },
            gstNumber: '',
            stateName: '',
            stateCode: '',
            pincode: ''
        },
        shippingDetails: {
            index: '',
            address: [],
            state: { code: '', name: '' },
            county: { code: '', name: '' },
            gstNumber: '',
            stateName: '',
            stateCode: '',
            pincode: ''
        }
    };
    /* This will hold autofill state of company billing/shipping */
    public autoFillCompanyShipping: boolean = true;
    /* This will hold company's country states */
    public companyStatesSource: IOption[] = [];
    /* This will hold if copy purchase bill is done */
    public copyPurchaseBill: boolean = false;
    /* This will hold if PO linking is updated */
    public poLinkUpdated: boolean = false;
    /* This will hold if copy purchase bill is done */
    public copyPurchaseBillInitialized: boolean = false;
    /* This will hold the existing PO entries with quantity */
    public existingPoEntries: any[] = [];
    /* This will hold the transaction amount */
    public transactionAmount: number = 0;
    /** account's applied tax list */
    public tcsTdsTaxesAccount: any[] = [];
    /** account's applied discounts list */
    public accountAssignedApplicableDiscounts: any[] = [];
    /** Stores the current invoice selected */
    public invoiceSelected: any;
    /** Stores the current index of entry whose TCS/TDS are entered */
    public tcsTdsIndex: number = 0;
    /** This will hold if deliver address filled **/
    public isDeliverAddressFilled: boolean = false;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    /** This will hold states list with respect to country */
    public countryStates: any[] = [];
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** This will hold if voucher date is manually changed */
    public isVoucherDateChanged: boolean = false;
    /** Date Change modal configuration */
    public dateChangeConfiguration: ConfirmationModalConfiguration;
    /** This will hold which date got changed (voucher/entry) */
    public dateChangeType: string = '';
    /** This will hold updated entry index */
    public updatedEntryIndex: number;
    /** This will hold voucher date on focus */
    public voucherDateBeforeUpdate: any;
    /** This will hold if confirmation popup from entry date is displayed to not display again */
    public isEntryDateChangeConfirmationDisplayed: boolean = false;
    /** This will hold account addresses */
    public accountAddressList: any[] = [];
    /** This will hold company addresses */
    public companyAddressList: any[] = [];
    /** Stores the voucher eligible for adjustment */
    public voucherForAdjustment: Array<Adjustment>;
    /** True, when bulk items are added */
    public showBulkLoader: boolean;
    /** This will hold how many linked po items added */
    public linkedPoItemsAdded: number = 0;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold copy previous invoice text */
    public copyPreviousInvoiceText: string = "";
    /** This will hold generate invoice text */
    public generateInvoiceText: string = "";
    /** This will hold update invoice text */
    public updateInvoiceText: string = "";
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True, if user has opted to show notes at the last page of sales invoice */
    public showNotesAtLastPage: boolean;
    /** This will hold account unique name which is in edit  */
    public accountEditingUniqueName: string = "";
    /** Stores the adjustments as a backup that are present on the current opened entry */
    public originalVoucherAdjustments: VoucherAdjustments;
    /** Length of entry description */
    public entryDescriptionLength: number = ENTRY_DESCRIPTION_LENGTH;
    /** Force clear for billing-shipping dropdown */
    public billingShippingForceClearReactive$: Observable<IForceClear> = observableOf({ status: false });
    /** True, if multi-currency support to voucher adjustment is enabled */
    public enableVoucherAdjustmentMultiCurrency: boolean;
    /** True if left sidebar is expanded */
    private isSidebarExpanded: boolean = false;
    /** Stores the current voucher form detail */
    public currentVoucherFormDetails: VoucherForm;
    /** True, if at least a single TCS type (payable or receivable) tax is present */
    public isTcsPresent: boolean;
    /** True, if at least a single TDS type (payable or receivable) tax is present */
    public isTdsPresent: boolean;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** This holds the voucher uniquename which needs to be copied */
    public voucherUniqueName: string = "";
    /** User filled deposit amount */
    private userDeposit: number = null;
    /** This will hold previous deposit (in case of update only) */
    private previousDeposit: any;
    /** True if we need to hide deposit section */
    public hideDepositSection: boolean = false;
    /** Holds created voucher unique name */
    public newVoucherUniqueName: string = '';
    /** Selected payment mode */
    public selectedPaymentMode: any;
    /** True if default load in update mode */
    private isDefaultLoad: boolean = true;
    /** True if selected customer is of cash/bank */
    public isCashBankAccount: boolean = false;
    /** Current page for reference vouchers */
    private referenceVouchersCurrentPage: number = 1;
    /** Total pages for reference vouchers */
    private referenceVouchersTotalPages: number = 1;
    /** Reference voucher search field */
    private searchReferenceVoucher: any = "";
    /** List of discounts */
    public discountsList: any[] = [];
    /** This will hold mobile number field input  */
    public intl: any;
    /** This will hold updatedNumber */
    public selectedCustomerNumber: any = '';
    /** This will hold isMobileNumberInvalid */
    public isMobileNumberInvalid: boolean = false;
    /** Attachment modal configuration */
    public attachmentDeleteConfiguration: ConfirmationModalConfiguration;
    /** This will hold selected cash account */
    public selectedBankAccount: any = 'Cash';
    /** This will use for instance of linkPO Dropdown */
    public linkPoDropdown: UntypedFormControl = new UntypedFormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: IOption[] = [];
    /** Compare function of link PO reference list */
    public compareFn = (a, b) => a && b && a.id === b.id;
    /** This will hold selected payment account value */
    public selectPaymentValue: string = '';
    /** This will hold dropdown is active */
    public openCustomerDropdown: boolean = false;
    /** Stores the current invoice selected */
    public invoiceSelectedLabel: any = '';
    /** Stores the current invoice selected */
    public selectedInvoiceLabel: any = '';
    /** Stores the current active entry */
    public activeEntry: any;
    /** Stores the purchase order number value mapping */
    public purchaseOrderNumberValueMapping: any[] = [];
    /** This will hold show loader */
    public isShowLoader: boolean = false;
    /** This will hold true if creating new account */
    private isCreatingNewAccount: boolean = false;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Giddh round off method to use in html */
    public giddhRoundOff: any = giddhRoundOff;
    /** True if einvoice is generated for the voucher */
    public isEinvoiceGenerated: boolean = false;
    /** Stores the stock variants */
    public stockVariants: BehaviorSubject<Array<Observable<Array<IOption>>>> = new BehaviorSubject([]);
    /** True, if bulk items are added to the voucher list, required to prevent repetitive stock variants processing
     * when bulk entries are added
     */
    private isBulkEntryInProgress: boolean;
    /** Stores the current transaction request obj for the API */
    private currentTxnRequestObject: Array<any> = [];
    /** Stores the index of current stock variants being loaded */
    private currentlyLoadedStockVariantIndex: number;
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    /** True if entry datepicker is open */
    public isEntryDatepickerOpen: boolean = false;
    /** True, if the linking with PO is in progress */
    private isPoLinkingInProgress: boolean = false;
    /**Hold voucher type */
    public voucherTypes: any[] = [VoucherTypeEnum.cashCreditNote, VoucherTypeEnum.cash, VoucherTypeEnum.cashDebitNote, VoucherTypeEnum.cashBill];
    /** This will hold invoice text */
    public invoiceTypeLabel: string = "";
    /** Hold regions source array  */
    public regionsSource: IOption[] = [];
    /* This will hold company's country regions */
    public companyRegionsSource: IOption[] = [];
    /** This will hold barcode value*/
    public barcodeValue: string = "";
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 0,
        count: 0,
        moduleUniqueName: 'variant'
    };
    /**Hold barcode scan start time */
    public startTime: number = 0;
    /**Hold barcode scan end time */
    public endTime: number = 0;
    /**Hold barcode scan total time */
    public totalTime: number = 0;
    /**Hold barcode last scanned key */
    public lastScannedKey: string = '';
    /** True if barcode maching is typing */
    public isBarcodeMachineTyping: boolean = false;
    /** False if there is no data in account search */
    public isAccountSearchData: boolean = true;
    /** True if there is initial call */
    public initialApiCall: boolean = false;
    /** Holds true if table entry has at least single stock is selected  */
    public hasStock: boolean = true;
    /** Hold account billing index  */
    public accountBillingIndex: number = 0;
    /** Hold account shipping index  */
    public accountShippingIndex: number = 0;
    /** Hold purchase billing index  */
    public purchaseBillingIndex: number = 0;
    /** Hold purchase shipping index  */
    public purchaseShippingIndex: number = 0;

    /**
     * Returns true, if invoice type is sales, proforma or estimate, for these vouchers we
     * need to apply max characters limit on Notes/notes2/messsage2
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherComponent
     */
    public get shouldApplyMaxLengthOnNotes(): boolean {
        return (this.isSalesInvoice || this.isProformaInvoice || this.isEstimateInvoice);
    }
    /** Returns true if account is selected else false */
    public get showPageLeaveConfirmation(): boolean {
        return (!this.isUpdateMode && (this.invFormData.voucherDetails.customerUniquename || this.invFormData.voucherDetails.customerName)) ? true : false;
    }

    /**
     * Returns true, if Purchase Record creation record is broken
     *
     * @readonly
     * @private
     * @type {boolean}
     * @memberof VoucherComponent
     */
    private get isPurchaseRecordContractBroken(): boolean {
        return (this.purchaseRecordCustomerUniqueName !== this.invFormData.voucherDetails.customerUniquename) ||
            (this.purchaseRecordInvoiceDate !== dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT)) ||
            (this.purchaseRecordTaxNumber !== this.invFormData.accountDetails.shippingDetails.gstNumber ||
                (this.purchaseRecordInvoiceNumber !== this.invFormData.voucherDetails.voucherNumber));
    }

    constructor(
        private store: Store<AppState>,
        private salesAction: SalesActions,
        private companyActions: CompanyActions,
        private router: Router,
        private salesService: SalesService,
        private toaster: ToasterService,
        private generalActions: GeneralActions,
        private generalService: GeneralService,
        public route: ActivatedRoute,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceActions: InvoiceActions,
        private breakpointObserver: BreakpointObserver,
        private changeDetectorRef: ChangeDetectorRef,
        private proformaActions: ProformaActions,
        private ledgerService: LedgerService,
        private voucherUtilityService: VoucherUtilityService,
        private purchaseRecordService: PurchaseRecordService,
        private settingsUtilityService: SettingsUtilityService,
        private warehouseActions: WarehouseActions,
        private commonActions: CommonActions,
        private purchaseRecordAction: PurchaseRecordActions,
        private purchaseOrderService: PurchaseOrderService,
        private searchService: SearchService,
        private settingsBranchAction: SettingsBranchActions,
        private ngZone: NgZone,
        private accountActions: AccountsAction,
        private voucherTypeToNamePipe: VoucherTypeToNamePipe,
        private titleCasePipe: TitleCasePipe,
        private location: Location,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private gstAction: GstReconcileActions,
        private settingsDiscountService: SettingsDiscountService,
        private http: HttpClient,
        public dialog: MatDialog,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private commonService: CommonService
    ) {
        this.advanceReceiptAdjustmentData = new VoucherAdjustments();
        this.advanceReceiptAdjustmentData.adjustments = [];
        this.enableVoucherAdjustmentMultiCurrency = enableVoucherAdjustmentMultiCurrency;
        this.invFormData = new VoucherClass();
        this.activeAccount$ = this.store.pipe(select(p => p.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.newlyCreatedAc$ = this.store.pipe(select(p => p.groupwithaccounts.newlyCreatedAccount), takeUntil(this.destroyed$));
        this.newlyCreatedStockAc$ = this.store.pipe(select(p => p.sales.newlyCreatedStockAc), takeUntil(this.destroyed$));
        this.selectedAccountDetails$ = this.store.pipe(select(p => p.sales.acDtl), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(p => p.sales.createAccountSuccess), takeUntil(this.destroyed$));
        this.createdAccountDetails$ = this.store.pipe(select(p => p.sales.createdAccountDetails), takeUntil(this.destroyed$));
        this.updatedAccountDetails$ = this.store.pipe(select(p => p.sales.updatedAccountDetails), takeUntil(this.destroyed$));
        this.updateAccountSuccess$ = this.store.pipe(select(p => p.sales.updateAccountSuccess), takeUntil(this.destroyed$));
        this.updateProformaVoucherInProcess$ = this.store.pipe(select(state => state.proforma.isUpdateProformaInProcess), takeUntil(this.destroyed$));
        this.generateVoucherSuccess$ = combineLatest([this.store.pipe(select(appState => appState.proforma.isGenerateSuccess)),
        this.store.pipe(select(appState => appState.proforma.isGenerateInProcess))]).pipe(debounceTime(0), takeUntil(this.destroyed$));
        this.updateVoucherSuccess$ = this.store.pipe(select(p => p.proforma.isUpdateProformaSuccess), takeUntil(this.destroyed$));
        this.lastGeneratedVoucherNo$ = this.store.pipe(select(p => p.proforma.lastGeneratedVoucherDetails), takeUntil(this.destroyed$));
        this.lastInvoices$ = this.store.pipe(select(p => p.receipt.lastVouchers), takeUntil(this.destroyed$));
        this.lastProformaInvoices$ = this.store.pipe(select(p => p.proforma.lastVouchers), takeUntil(this.destroyed$));
        this.voucherDetails$ = this.store.pipe(
            select(s => {
                if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                    return s.receipt.voucher as VoucherClass;
                } else {
                    return s.proforma.activeVoucher as VoucherClass;
                }
            }),
            takeUntil(this.destroyed$)
        );
        this.getOnboardingFormInProcess$ = this.store.pipe(select(s => s.common.getOnboardingFormInProcess), takeUntil(this.destroyed$));
        this.exceptTaxTypes = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    public ngOnInit() {
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
        /** This will use for filter link purchase orders  */
        this.linkPoDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterPurchaseOrder(search);
        });

        if (this.callFromOutside) {
            if (document.getElementsByClassName("sidebar-collapse")?.length > 0) {
                this.isSidebarExpanded = false;
            } else {
                this.isSidebarExpanded = true;
                this.generalService.collapseSidebar();
            }
            document.querySelector('body').classList.add('setting-sidebar-open');
            document.querySelector('body').classList.add('voucher-preview-edit');
        }

        this.getInventorySettings();
        this.getDiscounts();
        this.getProfile();
        this.store.dispatch(this.companyActions.getTax());
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));

        this.generateUpdateButtonClicked.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((form: NgForm) => {
            this.startLoader(true);
            if (this.isUpdateMode) {
                this.handleUpdateInvoiceForm(form);
            } else {
                this.onSubmitInvoiceForm(form);
            }
        });

        this.isPendingSales = this.router.url.includes('/pages/invoice/preview/pending/sales' && '/pages/purchase-management/purchase/bill');
        this.autoFillShipping = true;
        this.isUpdateMode = false;
        this.getAllDiscounts();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
                this.companyAddressList = activeCompany.addresses;
                this.initializeCurrentVoucherForm();
            }
        });

        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
            }
        });

        this.activeAccount$.subscribe(data => {
            if (data) {
                this.checkIfNeedToExcludeTax(data);
            }
        });

        this.fillDeliverToAddress();

        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });

        this.route.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(async params => {
            this.voucherTypeChanged = false;
            this.copyPurchaseBill = false;
            this.isDefaultLoad = true;

            if (params['invoiceType']) {
                if (this.voucherTypes.includes(params['invoiceType'])) {
                    this.isCashInvoice = true;
                    this.isCashBankAccount = true;
                }
                // Close account side bar when create from cmd + k
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                }
                if (this.asideMenuStateForOtherTaxes === 'in') {
                    this.toggleOtherTaxesAsidePane(true);
                }

                if (this.asideMenuStateForRecurringEntry === 'in') {
                    this.openAccountSelectionDropdown?.closeDropdownPanel();
                    this.openCustomerDropdown = false;
                }

                // Reset voucher due to advance receipt model set voucher in invoice management
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                this.selectedVoucherType = params['invoiceType'];
                if (this.invoiceType !== params['invoiceType']) {
                    this.invoiceType = decodeURI(params['invoiceType']) as VoucherTypeEnum;
                    this.prepareInvoiceTypeFlags();
                    this.resetInvoiceForm(this.invoiceForm);
                    this.getInventorySettings();

                    // reset customer company when invoice type changes, re-check for company currency and country
                    this.store.pipe(select(s => s.settings.profile), take(1)).subscribe(profile => {
                        setTimeout(() => {
                            this.openAccountSelectionDropdown?.openDropdownPanel();
                        }, 500);
                        this.changeDetectorRef.detectChanges();
                        this.prepareCompanyCountryAndCurrencyFromProfile(profile);
                    });

                    this.getAllLastInvoices();
                }
                this.invoiceType = decodeURI(params['invoiceType']) as VoucherTypeEnum;
                this.getDefaultTemplateData();
                this.prepareInvoiceTypeFlags();
                this.initializeCurrentVoucherForm();
                if (this.isCashInvoice || this.currentVoucherFormDetails?.depositAllowed) {
                    this.loadBankCashAccounts('');
                }
            } else if (params['voucherType']) {
                this.selectedVoucherType = params['voucherType'];
            }

            if (params['invoiceType'] && params['accUniqueName']) {
                this.accountUniqueName = params['accUniqueName'];
                this.isUpdateMode = false;
                this.invoiceType = decodeURI(params['invoiceType']) as VoucherTypeEnum;
                this.getDefaultTemplateData();
                this.prepareInvoiceTypeFlags();
                this.isInvoiceRequestedFromPreviousPage = true;
                this.getAccountDetails(params['accUniqueName']);
            }

            if (params['invoiceAction']) {
                this.accountUniqueName = params['accUniqueName'];
                this.invoiceNo = params['invoiceNo'];
                this.isPurchaseInvoice = true;
                this.copyPurchaseBill = (params['invoiceAction'] === "edit") ? false : true;

                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                if (this.accountUniqueName && this.invoiceType && this.invoiceNo) {
                    this.store.dispatch(this.generalActions.setAppTitle('/pages/proforma-invoice/invoice/' + this.invoiceType));
                    this.getVoucherDetailsFromInputs();
                    this.getDefaultTemplateData();
                }
                this.isUpdateMode = (params['invoiceAction'] === "edit") ? true : false;

                if (params['invoiceAction'] === "edit") {
                    this.selectedItem = {
                        uniqueName: params.invoiceNo,
                        voucherNumber: undefined,
                        account: { name: params.accUniqueName, uniqueName: params.accUniqueName },
                        grandTotal: undefined,
                        voucherDate: undefined,
                        voucherType: this.invoiceType
                    };
                }
            } else {
                if (params['invoiceNo'] && params['accUniqueName'] && params['invoiceType']) {
                    // for edit mode from url
                    this.accountUniqueName = params['accUniqueName'];
                    this.invoiceNo = params['invoiceNo'];
                    this.isUpdateMode = true;
                    this.isUpdateDataInProcess = true;
                    this.prepareInvoiceTypeFlags();

                    if (this.callFromOutside) {
                        await this.setSelectedItem();
                    }

                    this.toggleFieldForSales = (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.creditNote));
                    if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                        if (this.isSalesInvoice || this.isCashInvoice || this.isCreditNote || this.isDebitNote) {
                            this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.accountUniqueName, {
                                invoiceNumber: this.invoiceNo,
                                voucherType: this.voucherUtilityService.parseVoucherType(this.invoiceType),
                                uniqueName: (this.voucherApiVersion === 2) ? this.selectedItem?.uniqueName : undefined
                            }));
                        }
                        // TODO: Add purchase record get API call once advance receipt is complete
                    } else {
                        let obj: ProformaGetRequest = new ProformaGetRequest();
                        obj.accountUniqueName = this.accountUniqueName;
                        if (this.isProformaInvoice) {
                            obj.proformaNumber = this.invoiceNo;
                        } else {
                            obj.estimateNumber = this.invoiceNo;
                        }
                        this.store.dispatch(this.proformaActions.getProformaDetails(obj, this.invoiceType));
                    }
                    this.getDefaultTemplateData();
                } else {
                    // for edit mode direct from @Input
                    if (params['voucherType'] && params['voucherType'] === 'pending' && params['selectedType']) {
                        this.isPendingVoucherType = true;
                    } else {
                        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                        if (this.accountUniqueName && this.invoiceType && this.invoiceNo) {
                            this.store.dispatch(this.generalActions.setAppTitle('/pages/proforma-invoice/invoice/' + this.invoiceType));
                            this.getVoucherDetailsFromInputs();
                            this.getDefaultTemplateData();
                        }
                    }
                }
            }

            if (!this.isUpdateMode) {
                if (!this.isPendingVoucherType) {
                    this.resetInvoiceForm(this.invoiceForm);
                    if (!this.isMultiCurrencyModule() && !this.isPurchaseInvoice) {
                        // Hide the warehouse section if the module is other than multi-currency supported modules
                        this.shouldShowWarehouse = false;
                    } else {
                        this.shouldShowWarehouse = true;
                        if (this.isCashInvoice) {
                            // Load default warehouse for Cash Invoice
                            this.initializeWarehouse();
                        }
                    }
                }
                if (!this.isPendingVoucherType) {
                    this.openCustomerDropdown = true;
                }
            } else {
                this.openCustomerDropdown = false;
            }

            if (this.isPurchaseInvoice) {
                this.selectedVoucherType = VoucherTypeEnum.purchase;
            }

            if (!this.isPendingVoucherType) {
                this.preventDefaultScrollApiCall = false;
                this.defaultCustomerSuggestions = [];
                this.loadDefaultSearchSuggestions();
            }
            this.getAllLastInvoices();

            if (!this.isUpdateMode) {
                this.fillDeliverToAddress();
            }

            this.initiateVoucherModule();

            if (this.translationLoaded) {
                this.translationComplete(true);
            }
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((event) => {
            if (event instanceof ActivationStart) {
                // Unsubscribe the moment user is navigating away from this route
                // Current implementation causes issue when user navigates to CN & DN with CMD + K
                // in UPDATE voucher flow as the URLs are the same and only params
                // change therefore the params subscription of current page are also fired which is
                // not required and loads incorrect data
                //  not allowing for pending type voucher on preview sales invoice on click customer name this block was calling which was wrong
                if (!this.isPendingVoucherType) {
                    if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                    } else {
                        this.store.dispatch(this.proformaActions.resetActiveVoucher());
                    }
                }

                if (!this.voucherTypeChanged && event.snapshot.params.invoiceType === this.invoiceType) {
                    this.destroyed$.next(true);
                    this.destroyed$.complete();
                }
            }
        });

        // get account details and set it to local var
        this.selectedAccountDetails$.subscribe(accountDetails => {
            if (accountDetails) {
                this.hideDepositSectionForCashBankGroups(accountDetails);
                this.assignAccountDetailsValuesInForm(accountDetails);
                this.openProductDropdown();
            }
        });

        this.updatedAccountDetails$.subscribe(accountDetails => {
            if (accountDetails) {
                this.hideDepositSectionForCashBankGroups(accountDetails);
                this.accountAddressList = accountDetails.addresses;
                this.updateAccountDetails(accountDetails, true);
            }
        });
        this.getOnboardingFormInProcess$.subscribe(inProcess => {
            this.startLoader(inProcess);
        });

        // listen for new add account utils
        this.newlyCreatedAc$.pipe(takeUntil(this.destroyed$)).subscribe((o: INameUniqueName) => {
            if (o && this.accountAsideMenuState === 'in') {
                let item: IOption = {
                    label: o.name,
                    value: o.uniqueName
                };
                this.onSelectCustomer(item);
            }

            if (o) {
                if (this.invFormData?.accountDetails?.currency?.code) {
                    this.loadBankCashAccounts(this.invFormData?.accountDetails?.currency?.code, false);
                } else {
                    this.loadBankCashAccounts("", false);
                }
            }
        });

        // create account success then hide aside pane
        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
            if (o) {
                if (this.invFormData?.accountDetails?.currency?.code) {
                    this.loadBankCashAccounts(this.invFormData?.accountDetails?.currency?.code, false);
                } else {
                    this.loadBankCashAccounts("", false);
                }
            }
        });

        // listen for universal date
        this.store.pipe(select((p: AppState) => p.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    this.poFilterDates = { from: dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT), to: dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT) }
                    this.universalDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                    if (!this.isUpdateMode) {
                        this.assignDates();
                    }
                } catch (e) {
                    this.universalDate = dayjs().format(GIDDH_DATE_FORMAT);
                }
            }
        });

        if (!this.isUpdateMode) {
            this.addBlankRow(null);
            this.selectedWarehouse = String(this.defaultWarehouse);
            this.selectedWarehouseName = String(this.defaultWarehouseName);
        }

        //region combine get voucher details && all flatten A/c's && create account and update account success from sidebar
        combineLatest([this.voucherDetails$, this.createAccountIsSuccess$, this.updateAccountSuccess$])
            .pipe(takeUntil(this.destroyed$), auditTime(700))
            .subscribe(async results => {
                // update mode because voucher details is available
                /** results[1] :- get voucher details response */
                if (results[0]) {
                    let obj;
                    this.invFormData.accountDetails.billingDetails = results[0].account?.billingDetails;
                    this.invFormData.accountDetails.shippingDetails = results[0].account?.shippingDetails;
                    if (this.voucherApiVersion === 2) {
                        results[0] = this.adjustmentUtilityService.getVoucherAdjustmentObject(results[0], this.selectedVoucherType);

                        if (!this.isLastInvoiceCopied) {
                            this.previousExchangeRate = results[0].exchangeRate;
                            this.originalExchangeRate = results[0].exchangeRate;
                            this.exchangeRate = results[0].exchangeRate;
                        }
                    }

                    if (this.isLastInvoiceCopied) {
                        obj = {
                            accountDetails: null,
                            voucherDetails: null,
                            templateDetails: null,
                            entries: null,
                            companyDetails: null,
                            depositEntry: null,
                            depositEntryToBeUpdated: null,
                            depositAccountUniqueName: '',
                            templateUniqueName: null,
                            number: ''
                        };

                        let tempObj;
                        let voucherDate = this.invFormData.voucherDetails.voucherDate;
                        let dueDate = this.invFormData.voucherDetails.dueDate;

                        //if last invoice is copied then create new Voucher and copy only needed things not all things
                        obj.accountDetails = cloneDeep(this.invFormData.accountDetails);
                        obj.account = cloneDeep(this.invFormData.accountDetails);
                        obj.voucherDetails = cloneDeep(this.invFormData.voucherDetails);
                        obj.templateDetails = cloneDeep(this.invFormData.templateDetails);
                        obj.companyDetails = cloneDeep(this.invFormData.companyDetails);
                        obj.depositEntry = cloneDeep(this.invFormData.depositEntry);
                        obj.depositEntryToBeUpdated = cloneDeep(this.invFormData.depositEntryToBeUpdated);
                        obj.depositAccountUniqueName = cloneDeep(this.invFormData.depositAccountUniqueName);
                        obj.templateUniqueName = cloneDeep(this.invFormData.templateUniqueName);
                        obj.number = cloneDeep(this.invFormData.number);
                        obj.entries = cloneDeep(results[0].entries);
                        obj.exchangeRate = cloneDeep(this.exchangeRate);

                        if (this.isMultiCurrencyModule()) {
                            // parse normal response to multi currency response
                            let convertedRes1 = await this.modifyMulticurrencyRes(obj);
                            tempObj = cloneDeep(convertedRes1) as VoucherClass;
                        } else {
                            tempObj = cloneDeep((obj as GenericRequestForGenerateSCD).voucher);
                        }

                        tempObj.entries.forEach((entry, index) => {
                            let entryDate = voucherDate || this.universalDate || dayjs().format(GIDDH_DATE_FORMAT);

                            if (typeof (entryDate) === "object") {
                                tempObj.entries[index].entryDate = dayjs(entryDate).format(GIDDH_DATE_FORMAT);
                            } else {
                                tempObj.entries[index].entryDate = entryDate;
                            }

                            tempObj.entries[index].uniqueName = undefined;
                        });

                        obj = cloneDeep(tempObj);
                        obj.voucherDetails.voucherDate = cloneDeep(voucherDate);
                        obj.voucherDetails.dueDate = cloneDeep(dueDate);
                    } else {
                        this.isEinvoiceGenerated = results[0].einvoiceGenerated;
                        this.previousDeposit = results[0]?.deposit;
                        if (this.isMultiCurrencyModule()) {
                            // parse normal response to multi currency response
                            let convertedRes1 = await this.modifyMulticurrencyRes(results[0]);
                            this.initializeWarehouse(results[0].warehouse);
                            if (results[0].account?.currency) {
                                this.companyCurrencyName = results[0].account.currency.code;
                            }
                            obj = cloneDeep(convertedRes1) as VoucherClass;

                            if (this.isPendingVoucherType) {
                                obj.accountDetails.currency = results[0].account?.currency;
                                obj.accountDetails.currencySymbol = results[0].account?.currency?.symbol;
                                obj.accountDetails.currencyCode = results[0].account?.currency?.code;
                            }

                            this.selectedAccountDetails$.pipe(take(1)).subscribe(acc => {
                                if (acc) {
                                    obj.accountDetails.currencySymbol = acc.currencySymbol ?? this.baseCurrencySymbol;
                                    obj.accountDetails.currencyCode = acc.currency ?? this.companyCurrency;
                                }
                            });
                            if (this.isPurchaseInvoice) {
                                if (this.voucherApiVersion !== 2) {
                                    if (!obj.companyDetails?.billingDetails) {
                                        obj.companyDetails.billingDetails = {};
                                    }
                                    if (!obj.companyDetails?.shippingDetails) {
                                        obj.companyDetails.shippingDetails = {};
                                    }
                                    obj.companyDetails.billingDetails.state = { code: obj.companyDetails.billingDetails?.stateCode, name: obj.companyDetails.billingDetails?.state?.name };
                                    obj.companyDetails.shippingDetails.state = { code: obj.companyDetails.shippingDetails?.stateCode, name: obj.companyDetails.shippingDetails?.state?.name };
                                    obj.companyDetails.billingDetails.county = { code: obj.companyDetails.billingDetails?.county?.code, name: obj.companyDetails.billingDetails?.county?.name };
                                    obj.companyDetails.shippingDetails.county = { code: obj.companyDetails.shippingDetails?.county?.code, name: obj.companyDetails.shippingDetails?.county?.name };

                                }
                                this.assignCompanyBillingShipping(obj.companyDetails);

                                if (this.copyPurchaseBill) {
                                    if (obj && obj.entries) {
                                        obj.entries.forEach((entry, index) => {
                                            let entryDate = this.universalDate || dayjs().format(GIDDH_DATE_FORMAT);

                                            if (typeof (entryDate) === "object") {
                                                obj.entries[index].entryDate = dayjs(entryDate).format(GIDDH_DATE_FORMAT);
                                            } else {
                                                obj.entries[index].entryDate = entryDate;
                                            }

                                            obj.entries[index].uniqueName = "";
                                        });
                                        obj.entries = obj.entries;
                                    }

                                    let date = cloneDeep(this.universalDate);
                                    obj.voucherDetails.voucherDate = date;
                                    obj.voucherDetails.dueDate = date;
                                    obj.voucherDetails.voucherNumber = "";
                                }
                            }
                            this.isRcmEntry = results[0]?.subVoucher === SubVoucher.ReverseCharge;
                        } else {
                            let convertedRes1 = await this.modifyMulticurrencyRes(results[0]);
                            if (results[0].account?.currency) {
                                this.companyCurrencyName = results[0].account.currency.code;
                            }
                            obj = cloneDeep(convertedRes1) as VoucherClass;
                        }
                    }
                    /** Tourist scheme added in case of sales invoice  */
                    if (this.isSalesInvoice || this.isCashInvoice) {
                        if (results[0] && results[0].touristSchemeApplicable) {
                            obj.touristSchemeApplicable = results[0].touristSchemeApplicable;
                            obj.passportNumber = results[0].passportNumber;
                        } else {
                            obj.touristSchemeApplicable = false;
                            obj.passportNumber = '';
                        }
                    }
                    //  If last invoice copied then no need to add voucherAdjustments as pre-fill ref:- G0-5554
                    if (this.isSalesInvoice || (results[0] && results[0].voucherAdjustments)) {
                        if (results[0] && results[0].voucherAdjustments && results[0].voucherAdjustments.adjustments && results[0].voucherAdjustments.adjustments.length && !this.isLastInvoiceCopied && !this.copyPurchaseBill) {
                            this.isInvoiceAdjustedWithAdvanceReceipts = true;
                            this.calculateAdjustedVoucherTotal(results[0].voucherAdjustments.adjustments);
                            this.advanceReceiptAdjustmentData = results[0].voucherAdjustments;
                            this.originalVoucherAdjustments = cloneDeep(results[0].voucherAdjustments);
                            if (this.enableVoucherAdjustmentMultiCurrency) {
                                if (this.isMulticurrencyAccount) {
                                    this.adjustPaymentData.convertedTotalAdjustedAmount = results[0].voucherAdjustments.totalAdjustmentCompanyAmount;
                                }
                            } else {
                                this.adjustPaymentData.convertedTotalAdjustedAmount = results[0].voucherAdjustments.totalAdjustmentCompanyAmount;
                                this.adjustPaymentData.totalAdjustedAmount = results[0].voucherAdjustments.totalAdjustmentAmount;
                            }
                            this.isAdjustAmount = true;
                        } else {
                            this.isInvoiceAdjustedWithAdvanceReceipts = false;
                        }
                        this.changeDetectorRef.detectChanges();
                    }

                    if (obj.voucherDetails) {

                        // if last invoice is copied then don't copy customer/vendor name and it's details
                        if (!this.isLastInvoiceCopied && !this.isUpdateMode) {
                            // assign account details uniqueName because we are using accounts uniqueName not name
                            if (obj.accountDetails?.uniqueName !== 'cash') {
                                obj.voucherDetails.customerUniquename = obj.accountDetails?.uniqueName;
                            } else {
                                obj.voucherDetails.customerUniquename = obj.voucherDetails.customerName;
                            }
                        }

                        //added update mode as causing trouble in multicurrency
                        if (obj.entries && obj.entries.length) {
                            obj.entries = this.parseEntriesFromResponse(obj.entries);
                        }

                        this.autoFillShipping = isEqual(obj.accountDetails.billingDetails, obj.accountDetails.shippingDetails);

                        /**
                         * depositAmountAfterUpdate :- amount that has been already paid, so we need to minus balance due from grand total
                         * so we can get how much amount of money is paid
                         * only applicable in sales invoice
                         */
                        if (!this.isLastInvoiceCopied) {
                            if (this.isSalesInvoice) {
                                this.depositAmountAfterUpdate = obj.voucherDetails.deposit;
                            } else {
                                this.depositAmountAfterUpdate = 0;
                            }
                        }

                        // if last invoice is copied then don't copy voucherDate and dueDate
                        if (!this.isLastInvoiceCopied) {
                            // convert date object
                            if (this.isProformaInvoice) {
                                obj.voucherDetails.voucherDate = dayjs(obj.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).toDate();
                                obj.voucherDetails.voucherNumber = obj.voucherDetails.proformaNumber || obj.voucherDetails.voucherNumber;
                            } else if (this.isEstimateInvoice) {
                                obj.voucherDetails.voucherDate = dayjs(obj.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).toDate();
                                obj.voucherDetails.voucherNumber = obj.voucherDetails.estimateNumber || obj.voucherDetails.voucherNumber;
                            } else {
                                obj.voucherDetails.voucherDate = dayjs(obj.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).toDate();
                            }

                            if (obj.voucherDetails.dueDate) {
                                obj.voucherDetails.dueDate = dayjs(obj.voucherDetails.dueDate, GIDDH_DATE_FORMAT).toDate();
                            }
                        }

                        if (!this.isLastInvoiceCopied && (!obj.accountDetails.billingDetails.state || !obj.accountDetails.billingDetails.county)) {
                            obj.accountDetails.billingDetails.state = {};
                            obj.accountDetails.billingDetails.county = {};
                            if (this.isEstimateInvoice || this.isProformaInvoice) {
                                obj.accountDetails.billingDetails.state.code = this.getNewStateCode(obj.accountDetails.billingDetails.stateCode);
                            } else {
                                obj.accountDetails.billingDetails.state.code = obj.accountDetails.billingDetails.stateCode;
                                obj.accountDetails.billingDetails.county.code = obj.accountDetails.billingDetails?.county?.code;
                            }
                            obj.accountDetails.billingDetails.state.name = obj.accountDetails.billingDetails.stateName;
                            obj.accountDetails.billingDetails.county.name = obj.accountDetails.billingDetails?.county?.name;

                        }

                        if (!this.isLastInvoiceCopied && (!obj.accountDetails.shippingDetails.state || !obj.accountDetails.shippingDetails.county)) {
                            obj.accountDetails.shippingDetails.state = {};
                            obj.accountDetails.shippingDetails.county = {};
                            if (this.isEstimateInvoice || this.isProformaInvoice) {
                                obj.accountDetails.shippingDetails.state.code = this.getNewStateCode(obj.accountDetails.shippingDetails.stateCode);
                            } else {
                                obj.accountDetails.shippingDetails.state.code = obj.accountDetails.shippingDetails.stateCode;
                                obj.accountDetails.shippingDetails.county.code = obj.accountDetails.shippingDetails?.county?.code;
                            }
                            obj.accountDetails.shippingDetails.state.name = obj.accountDetails.shippingDetails.stateName;
                            obj.accountDetails.shippingDetails.county.name = obj.accountDetails.shippingDetails?.county?.name;
                        }

                        if (!this.isLastInvoiceCopied && !obj.voucherDetails.customerUniquename) {
                            obj.voucherDetails.customerUniquename = obj.accountDetails?.uniqueName;
                        }
                        if (!this.isCashInvoice) {
                            this.isCustomerSelected = true;
                        }
                        this.invoiceDataFound = true;
                        if (!obj.accountDetails.currencySymbol) {
                            obj.accountDetails.currencySymbol = '';
                        }
                        if (this.currentVoucherFormDetails?.depositAllowed || (this.isPendingVoucherType && obj.accountDetails && obj.voucherDetails)) {
                            if (!this.isLastInvoiceCopied) {
                                obj.accountDetails.name = (this.voucherApiVersion === 2 && this.isCashInvoice && results[0].account?.customerName) ? results[0].account?.customerName : results[0].account?.name;
                                obj.voucherDetails.customerName = (this.voucherApiVersion === 2 && this.isCashInvoice && results[0].account?.customerName) ? results[0].account?.customerName : results[0].account?.name;
                            }
                            this.loadBankCashAccounts(obj?.accountDetails?.currency?.code);
                        }
                        this.invFormData = obj;
                        this.buildBulkData(this.invFormData.entries?.length, 0);
                        this.checkVoucherEntries();
                        if (this.isCreditNote || this.isDebitNote) {
                            this.getInvoiceListsForCreditNote();
                        }

                    } else {
                        this.invoiceDataFound = false;
                    }
                    this.isUpdateDataInProcess = false;
                    if (this.isPurchaseInvoice || this.currentVoucherFormDetails?.attachmentAllowed) {
                        if (!this.copyPurchaseBill) {
                            this.selectedFileName = results[0].attachedFileName;
                            if (this.invFormData && this.invFormData.entries && this.invFormData.entries[0]) {
                                this.invFormData.entries[0].attachedFile = (results[0]?.attachedFiles) ? results[0]?.attachedFiles[0] : '';
                            }
                        }
                        this.saveCurrentPurchaseRecordDetails();
                    }

                    if (this.voucherApiVersion === 2) {
                        this.invFormData.voucherDetails.voucherUniqueName = (results[0] as any)?.uniqueName;
                    }
                }
                if (this.isEinvoiceGenerated || (this.invFormData.accountDetails.billingDetails?.gstNumber && this.purchaseBillCompany.billingDetails
                    .gstNumber)) {
                    this.makeFieldReadonly("billingState", true);
                } else {
                    this.makeFieldReadonly("billingState", false);
                }
                // create account success then close sidebar, and add customer details
                if (results[1] && this.isCreatingNewAccount) {
                    // toggle sidebar if it's open
                    if (this.accountAsideMenuState === 'in') {
                        this.toggleAccountAsidePane();
                        this.openAccountSelectionDropdown?.closeDropdownPanel();
                    }

                    let tempSelectedAcc: AccountResponseV2;
                    this.createdAccountDetails$.pipe(take(1)).subscribe(acc => tempSelectedAcc = acc);

                    if (tempSelectedAcc) {
                        this.customerAcList$ = observableOf([{ label: tempSelectedAcc.name, value: tempSelectedAcc.uniqueName, additional: tempSelectedAcc }]);
                        this.invFormData.voucherDetails.customerName = tempSelectedAcc.name;
                        let selectedCustomerNumber = tempSelectedAcc.mobileNo ? "+" + tempSelectedAcc.mobileNo : '';
                        this.intl?.setNumber(selectedCustomerNumber);
                        this.invFormData.voucherDetails.customerUniquename = tempSelectedAcc.uniqueName;
                        this.isCustomerSelected = true;
                        this.isMulticurrencyAccount = tempSelectedAcc.currencySymbol !== this.baseCurrencySymbol;
                        this.customerCountryName = tempSelectedAcc.country.countryName;
                        this.customerCountryCode = tempSelectedAcc?.country?.countryCode || 'IN';
                        this.checkIfNeedToExcludeTax(tempSelectedAcc);
                        this.getUpdatedStateCodes(tempSelectedAcc.country?.countryCode).then(() => {
                            this.invFormData.accountDetails = new AccountDetailsClass(tempSelectedAcc);
                        });
                        this.accountAddressList = tempSelectedAcc.addresses;
                        this.showGstAndTrnUsingCountryName(this.customerCountryName);
                        if (this.isMulticurrencyAccount) {
                            this.getCurrencyRate(this.companyCurrency, tempSelectedAcc.currency, this.invFormData.voucherDetails.voucherDate);
                            this.companyCurrencyName = tempSelectedAcc.currency;
                        } else {
                            this.invFormData.accountDetails = new AccountDetailsClass(tempSelectedAcc);
                        }
                        if (this.isEinvoiceGenerated || (this.invFormData.accountDetails.billingDetails?.gstNumber && this.purchaseBillCompany.billingDetails.gstNumber)) {
                            this.makeFieldReadonly("billingState", true);
                        } else {
                            this.makeFieldReadonly("billingState", false);
                        }
                    } else {
                        this.isCustomerSelected = false;
                    }
                    if (this.isMultiCurrencyModule() || this.isPurchaseInvoice) {
                        this.initializeWarehouse();
                    }

                    if (this.currentVoucherFormDetails?.depositAllowed || this.isSalesInvoice || this.isPendingVoucherType) {
                        this.loadBankCashAccounts(tempSelectedAcc.currency);
                    }
                    this.store.dispatch(this.accountActions.resetActiveAccount());
                }

                // update account success then close sidebar, and update customer details
                if (results[2]) {
                    // toggle sidebar if it's open
                    if (this.accountAsideMenuState === 'in') {
                        this.toggleAccountAsidePane();
                    }

                    let tempSelectedAcc: AccountResponseV2;
                    this.updatedAccountDetails$.pipe(take(1)).subscribe(acc => tempSelectedAcc = acc);
                    if (tempSelectedAcc) {
                        this.customerAcList$ = observableOf([{ label: tempSelectedAcc.name, value: tempSelectedAcc.uniqueName, additional: tempSelectedAcc }]);
                        if (tempSelectedAcc.addresses && tempSelectedAcc.addresses.length) {
                            tempSelectedAcc.addresses = [find(tempSelectedAcc.addresses, (tax) => tax.isDefault)];
                        }
                        let selectedCustomerNumber = tempSelectedAcc.mobileNo ? "+" + tempSelectedAcc.mobileNo : '';
                        this.intl?.setNumber(selectedCustomerNumber);
                        this.invFormData.voucherDetails.customerUniquename = null;
                        this.invFormData.voucherDetails.customerName = tempSelectedAcc.name;
                        this.invFormData.accountDetails = new AccountDetailsClass(tempSelectedAcc);
                        this.isCustomerSelected = true;

                        setTimeout(() => this.invFormData.voucherDetails.customerUniquename = tempSelectedAcc.uniqueName, 500);
                        this.store.dispatch(this.accountActions.resetActiveAccount());
                    } else {
                        this.isCustomerSelected = false;
                    }
                }

                if (this.invFormData.voucherDetails.customerUniquename && this.invFormData.voucherDetails.voucherDate && !this.isLastInvoiceCopied && !(this.isProformaInvoice || this.isEstimateInvoice)) {
                    this.getAllAdvanceReceipts(this.invFormData.voucherDetails.customerUniquename, this.invFormData.voucherDetails.voucherDate)
                }

                this.calculateBalanceDue();
                this.calculateTotalDiscount();
                this.calculateTotalTaxSum();
                this.changeDetectorRef.detectChanges();
            });
        // endregion

        // listen for newly added stock and assign value
        combineLatest([this.newlyCreatedStockAc$, this.salesAccounts$]).subscribe((resp: any[]) => {
            let o = resp[0];
            let acData = resp[1];
            if (o && acData) {
                let result: IOption = find(acData, (item: IOption) => item.additional?.uniqueName === o.linkedAc && item.additional && item.additional.stock && item.additional.stock?.uniqueName === o.uniqueName);
                if (result && !isUndefined(this.innerEntryIdx)) {
                    this.invFormData.entries[this.innerEntryIdx].transactions[0].fakeAccForSelect2 = result.value;
                    this.onSelectSalesAccount(result, this.invFormData.entries[this.innerEntryIdx].transactions[0], this.invFormData.entries[this.innerEntryIdx], false, false, this.innerEntryIdx);
                }
            }
        });

        this.breakpointObserver
            .observe(['(max-width: 1024px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((st: BreakpointState) => {
                this.isMobileScreen = st.matches;
                if (!this.isMobileScreen && !this.container?.length &&
                    (this.invFormData?.voucherDetails?.customerUniquename || this.invFormData?.voucherDetails?.customerName)) {
                    this.buildBulkData(this.invFormData.entries?.length, 0);
                }
            });

        this.generateVoucherSuccess$.subscribe((result: any) => {
            if (result) {
                const isGenerateSuccess = result[0];
                const isGenerateInProcess = result[1];
                if (isGenerateSuccess) {
                    this.resetInvoiceForm(this.invoiceForm);

                    let lastGenVoucher: { voucherNo: string, accountUniqueName: string } = {
                        voucherNo: '',
                        accountUniqueName: ''
                    };
                    this.lastGeneratedVoucherNo$.pipe(take(1)).subscribe(s => lastGenVoucher = s);
                    this.invoiceNo = lastGenVoucher.voucherNo;
                    this.accountUniqueName = lastGenVoucher.accountUniqueName;
                    this.postResponseAction(this.invoiceNo);
                    if (!this.isUpdateMode) {
                        this.getAllLastInvoices();
                    }
                } else if (!isGenerateInProcess) {
                    this.startLoader(false);
                }
            }
        });

        this.updateVoucherSuccess$.subscribe(result => {
            if (result) {
                this.doAction(ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess);
                this.postResponseAction(this.invoiceNo);
            }
        });

        this.updateProformaVoucherInProcess$.subscribe(result => {
            if (!result) {
                this.startLoader(false);
            }
        });

        combineLatest([
            this.lastInvoices$, this.lastProformaInvoices$
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(result => {
                let arr: PreviousInvoicesVm[] = [];
                if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                    if (result[0]) {
                        result[0] = result[0] as ReciptResponse;
                        result[0]?.items.forEach(item => {
                            arr.push({
                                versionNumber: item.voucherNumber, date: item.voucherDate, grandTotal: item.grandTotal,
                                account: { name: item.account?.name, uniqueName: item.account?.uniqueName },
                                uniqueName: item?.uniqueName
                            });
                        });
                    }
                } else {
                    if (result[1]) {
                        result[1] = result[1] as ProformaResponse;
                        if (result[1] && result[1].items) {
                            result[1].items.forEach(item => {
                                arr.push({
                                    versionNumber: this.isProformaInvoice ? item.proformaNumber : item.estimateNumber,
                                    date: item.voucherDate,
                                    grandTotal: item.grandTotal,
                                    account: { name: item.customerName, uniqueName: item.customerUniqueName },
                                    uniqueName: item?.uniqueName
                                });
                            });
                        }
                    }
                }
                this.lastInvoices = [...arr];
                this.startLoader(false);
            }, () => {
                this.startLoader(false);
            });
        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res?.fields[key]) {
                            this.formFields[res.fields[key]?.name] = [];
                            this.formFields[res.fields[key]?.name] = res.fields[key];
                        }
                    });
                }
                if (this.formFields && this.formFields['taxName']) {
                    this.shouldShowTrnGstVatField = true;
                } else {
                    this.shouldShowTrnGstVatField = false;
                }
            }
        });
        this.store.pipe(select(appState => appState.invoiceTemplate), takeUntil(this.destroyed$)).subscribe((templateData: CustomTemplateState) => {
            this.setTemplatePlaceholder(templateData);
        });
        this.prepareInvoiceTypeFlags();

        this.generalService.invokeEvent.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value && value[0] === "accountEditing") {
                this.accountEditingUniqueName = value[1]?.uniqueName;
            }
            if (value && value[0] === "accountUpdated") {
                if (this.accountEditingUniqueName === this.invFormData.voucherDetails.customerUniquename) {
                    this.invFormData.voucherDetails.customerUniquename = value[1]?.body?.uniqueName;
                    this.invFormData.voucherDetails.customerName = value[1]?.body?.name;

                    this.invFormData.accountDetails.uniqueName = value[1]?.body?.uniqueName;
                    this.invFormData.accountDetails.name = value[1]?.body?.name;
                }
                this.defaultCustomerSuggestions = [];
                this.onSearchQueryChanged(value[1]?.body?.name, 1, 'customer');
            }
        });

        this.stockVariants.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.length && !this.isBulkEntryInProgress) {
                const currentlyLoadedVariantRequest = this.currentTxnRequestObject[this.currentlyLoadedStockVariantIndex ?? this.activeIndx];
                if (!currentlyLoadedVariantRequest) {
                    // Deletion case, item was deleted and no current entry is active
                    return;
                }
                const currentEntryStockVariantUniqueName = currentlyLoadedVariantRequest.params?.variantUniqueName;
                let stockAllVariants;
                res[this.currentlyLoadedStockVariantIndex ?? this.activeIndx].pipe(take(1)).subscribe(variants => stockAllVariants = variants);
                if (stockAllVariants.findIndex(variant => variant.value === currentEntryStockVariantUniqueName) === -1) {
                    // Only reset the stock variant when the stock is changed
                    if (currentlyLoadedVariantRequest.txn) {
                        /* If transaction is present then it means the user has changed the stock of any entry
                            otherwise the user has opened the invoice for edit flow
                        */
                        currentlyLoadedVariantRequest.txn.variant = { name: stockAllVariants[0].label, uniqueName: stockAllVariants[0].value };
                        if (currentlyLoadedVariantRequest.params) {
                            // include the variant unique name for the API call
                            currentlyLoadedVariantRequest.params.variantUniqueName = stockAllVariants[0].value;
                        }
                        this.loadDetails(currentlyLoadedVariantRequest);
                    }
                }
            }
            this.currentlyLoadedStockVariantIndex = null;
        });

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasUnsavedChanges = response;
        });
    }

    public ngAfterViewInit() {
        let interval = setInterval(() => {
            if (this.initContactProforma) {
                this.onlyPhoneNumber();
                clearInterval(interval);
            }
        }, 500);
        if (!this.isUpdateMode) {
            this.toggleBodyClass();
        }
    }

    /**
     * Initializes voucher module
     *
     * @private
     * @memberof VoucherComponent
     */
    private initiateVoucherModule(): void {
        this.sundryDebtorsAcList = [];
        this.sundryCreditorsAcList = [];
        this.prdSerAcListForDeb = [];
        this.prdSerAcListForCred = [];
        /**
            find and select customer from accountUniqueName basically for account-details-modal popup. only applicable when invoice no
            is not available. if invoice no is there then it should be update mode
        */
        if (this.accountUniqueName && !this.invoiceNo) {
            if (!this.isCashInvoice) {
                const requestObject = this.getSearchRequestObject(this.accountUniqueName, 1, SEARCH_TYPE.CUSTOMER);
                if (this.isAccountSearchData) {
                    this.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                        if (data?.body?.results?.length && (this.searchItemResultsPaginationData.count || this.defaultCustomerResultsPaginationData.count || this.defaultItemResultsPaginationData.count || this.defaultItemResultsPaginationData.count) !== data?.body?.count) {
                            this.isAccountSearchData = false;
                        }
                        if (data && data.body && data.body.results) {
                            this.prepareSearchLists(data.body.results, 1, SEARCH_TYPE.CUSTOMER);
                            this.makeCustomerList();
                            const item = data.body.results.find(result => result?.uniqueName === this.accountUniqueName);
                            if (item) {
                                this.invFormData.voucherDetails.customerName = item.name;
                                this.invFormData.voucherDetails.customerUniquename = item.accountUniqueName;
                                this.isCustomerSelected = true;
                                this.invFormData.accountDetails.name = '';
                            }
                        }
                    });
                }
            } else {
                this.prepareSearchLists([{
                    name: this.invFormData.accountDetails?.name,
                    uniqueName: this.invFormData.accountDetails?.uniqueName
                }], 1, SEARCH_TYPE.CUSTOMER);
                this.makeCustomerList();
                this.invFormData.voucherDetails.customerName = this.invFormData.accountDetails?.name;
                this.invFormData.voucherDetails.customerUniquename = this.invFormData.accountDetails?.uniqueName;
            }
        }
        /** voucher type pending will not be allow as cash type*/
        if (this.invFormData.accountDetails && !this.isPendingVoucherType) {
            if (!this.invFormData.accountDetails?.uniqueName) {
                this.invFormData.accountDetails.uniqueName = 'cash';
            }
        }
        this.startLoader(false);
    }

    private async prepareCompanyCountryAndCurrencyFromProfile(profile) {
        if (profile && Object.keys(profile).length) {
            this.customerCountryName = profile.country;

            this.showGstAndTrnUsingCountryName(profile.country);

            this.companyCurrency = profile.baseCurrency || 'INR';
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.depositCurrSymbol = this.baseCurrencySymbol;
            this.companyCurrencyName = profile.baseCurrency;

            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            if (profile.countryCode) {
                this.companyCountryCode = profile.countryCode;
            } else if (profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.companyCountryCode = profile.countryV2.alpha2CountryCode;
            }
            if (!this.isUpdateMode) {
                await this.getUpdatedStateCodes(this.companyCountryCode);
                if (this.isPurchaseInvoice) {
                    await this.getUpdatedStateCodes(this.companyCountryCode, true);
                }
            }
        } else {
            this.customerCountryName = '';
            this.showGstAndTrnUsingCountryName('');
            this.companyCurrency = 'INR';
        }
    }

    /**
     * To fetch regex call for onboarding countries (gulf)
     *
     * @param {string} countryCode
     * @memberof VoucherComponent
     */
    public getOnboardingForm(countryCode: string): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.formName = 'onboarding';
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    public assignDates() {
        if (!this.isVoucherDateChanged) {
            let date = cloneDeep(this.universalDate);
            this.invFormData.voucherDetails.voucherDate = date;
            // get exchange rate when application date is changed
            if (this.isMultiCurrencyModule() && this.isMulticurrencyAccount && date) {
                this.getCurrencyRate(this.companyCurrency, this.customerCurrencyCode, date);
            }

            this.invFormData.entries.forEach((entry: SalesEntryClass) => {
                entry.entryDate = date;
                if (typeof (entry?.entryDate) === "object") {
                    entry.entryDate = dayjs(entry?.entryDate).format(GIDDH_DATE_FORMAT);
                } else {
                    entry.entryDate = dayjs(entry?.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                }
            });
        }
    }

    /**
     * Shows or hides the loader
     *
     * @param {boolean} shouldStartLoader True, if loader is to be shown
     * @memberof VoucherComponent
     */
    public startLoader(shouldStartLoader: boolean): void {
        this.showLoader = shouldStartLoader;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Returns new state codes from old state codes
     *
     * @private
     * @param {string} oldStatusCode Old state code
     * @returns {string} Returns new state code
     * @memberof VoucherComponent
     */
    private getNewStateCode(oldStatusCode: string): string {
        if (this.statesSource?.length) {
            const currentState = this.statesSource.find((st: any) => (oldStatusCode === st?.value || oldStatusCode === st.stateGstCode));
            return (currentState) ? currentState?.value : '';
        } else {
            return oldStatusCode;
        }
    }

    public makeCustomerList() {
        if (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase)) {
            this.customerAcList$ = observableOf(orderBy(this.sundryDebtorsAcList, 'label'));
            this.salesAccounts$ = observableOf(orderBy(this.prdSerAcListForDeb, 'label'));
            this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrydebtors';
        } else {
            this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrycreditors';
            this.customerAcList$ = observableOf(orderBy(this.sundryCreditorsAcList, 'label'));
            this.salesAccounts$ = observableOf(orderBy(this.prdSerAcListForCred, 'label'));
        }
    }

    public pageChanged(val: string, label: string) {
        this.voucherTypeChanged = true;
        this.resetPreviousSearchResults();
        this.sundryCreditorsAcList = [];
        this.sundryDebtorsAcList = [];
        this.customerAcList$ = observableOf([]);
        this.salesAccounts$ = observableOf([]);
        this.router.navigate(['pages', 'proforma-invoice', 'invoice', val]);
        this.selectedVoucherType = val;
        if (this.selectedVoucherType) {
            setTimeout(() => {
                this.openAccountSelectionDropdown?.openDropdownPanel();
            }, 500);
            this.changeDetectorRef.detectChanges();
        }
        if (this.selectedVoucherType === VoucherTypeEnum.creditNote || this.selectedVoucherType === VoucherTypeEnum.debitNote) {
            this.getInvoiceListsForCreditNote();
            setTimeout(() => {
                this.openAccountSelectionDropdown?.openDropdownPanel();
            }, 500);
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Get Invoice list for credit note
     *
     * @param {string} voucherDate Date of voucher
     * @memberof ProformaComponent
     */
    public getInvoiceListsForCreditNote(voucherDate?: string): void {
        if (this.invFormData && this.invFormData.voucherDetails && this.invFormData.voucherDetails.customerUniquename) {
            let request;

            if (this.voucherApiVersion === 2) {
                request = {
                    accountUniqueName: this.invFormData.voucherDetails.customerUniquename,
                    voucherType: this.isCreditNote ? VoucherTypeEnum.creditNote : VoucherTypeEnum.debitNote,
                    number: '',
                    page: 1
                }

                request.number = this.searchReferenceVoucher;
                request.page = this.referenceVouchersCurrentPage;

                if (request.page > 1 && this.referenceVouchersTotalPages < request.page) {
                    return;
                }

                this.referenceVouchersCurrentPage++;
            } else {
                request = {
                    accountUniqueNames: [this.invFormData.voucherDetails.customerUniquename, 'sales'],
                    voucherType: this.isCreditNote ? VoucherTypeEnum.creditNote : VoucherTypeEnum.debitNote
                }
            }

            if (this.voucherApiVersion === 2 && request.page === 1) {
                this.invoiceList = [];
            }

            let date;
            if (voucherDate) {
                date = voucherDate;
            } else if (typeof this.invFormData.voucherDetails.voucherDate === 'string') {
                date = this.invFormData.voucherDetails.voucherDate;
            } else {
                date = dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
            }

            if (this.voucherApiVersion !== 2) {
                this.invoiceList = [];
            }

            this.ledgerService.getInvoiceListsForCreditNote(request, date).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (this.voucherApiVersion !== 2) {
                    this.invoiceList = [];
                }
                if (response && response.body) {
                    this.referenceVouchersTotalPages = response.body.totalPages;
                    if (response.body.results || response.body.items) {
                        let items = [];
                        if (response.body.results) {
                            items = response.body.results;
                        } else if (response.body.items) {
                            items = response.body.items;
                        }

                        items?.forEach(invoice => this.invoiceList?.push({ label: invoice.voucherNumber ? invoice.voucherNumber : this.commonLocaleData?.app_not_available, value: invoice?.uniqueName, additional: invoice }));
                    } else {
                        this.invoiceSelected = '';
                        this.invoiceSelectedLabel = '';
                    }
                    let invoiceSelected;
                    if (this.isUpdateMode) {
                        if (this.voucherApiVersion === 2) {
                            const selectedInvoice = this.invFormData.voucherDetails.referenceVoucher;
                            if (selectedInvoice) {
                                selectedInvoice['voucherDate'] = selectedInvoice['invoiceDate'] || selectedInvoice['date'];
                                invoiceSelected = {
                                    label: selectedInvoice.number ? selectedInvoice.number : this.commonLocaleData?.app_not_available,
                                    value: selectedInvoice.uniqueName,
                                    additional: selectedInvoice
                                };
                                const linkedInvoice = this.invoiceList.find(invoice => invoice?.value === invoiceSelected?.value);
                                if (!linkedInvoice) {
                                    this.invoiceList.push(invoiceSelected);
                                }
                            }
                        } else {
                            const selectedInvoice = this.invFormData.voucherDetails && this.invFormData.voucherDetails.invoiceLinkingRequest ?
                                this.invFormData.voucherDetails.invoiceLinkingRequest.linkedInvoices[0] : '';
                            if (selectedInvoice) {
                                selectedInvoice['voucherDate'] = selectedInvoice['invoiceDate'];
                                invoiceSelected = {
                                    label: selectedInvoice.invoiceNumber ? selectedInvoice.invoiceNumber : this.commonLocaleData?.app_not_available,
                                    value: selectedInvoice.invoiceUniqueName,
                                    additional: selectedInvoice
                                };
                                const linkedInvoice = this.invoiceList.find(invoice => invoice?.value === invoiceSelected?.value);
                                if (!linkedInvoice) {
                                    this.invoiceList.push(invoiceSelected);
                                }
                            }
                        }
                        if (invoiceSelected) {
                            this.invoiceSelected = invoiceSelected;
                            this.invoiceSelectedLabel = invoiceSelected?.label;
                            this.selectedInvoice = (invoiceSelected) ? invoiceSelected.value : '';
                            this.selectedInvoiceLabel = (invoiceSelected) ? invoiceSelected.label : '';
                        }
                    }
                    uniqBy(this.invoiceList, 'value');
                    this.invoiceList$ = observableOf(this.invoiceList);
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    /**
     * Removes the selected invoice for credit note
     *
     * @memberof VoucherComponent
     */
    public removeSelectedInvoice(): void {
        this.invoiceSelectedLabel = '';
        this.selectedInvoiceLabel = '';
        this.selectedInvoice = '';
        this.invoiceSelected = '';

        if (this.voucherApiVersion === 2) {
            this.invFormData.voucherDetails.referenceVoucher = null;
        } else {
            this.invFormData.voucherDetails.invoiceLinkingRequest = null;
        }
    }

    /**
     * This will use for prepare invoice type flags
     *
     * @memberof VoucherComponent
     */
    public prepareInvoiceTypeFlags() {
        this.isSalesInvoice = this.invoiceType === VoucherTypeEnum.sales;
        this.isCashInvoice = this.voucherTypes.includes(this.invoiceType);
        this.isCreditNote = this.invoiceType === VoucherTypeEnum.creditNote;
        this.isDebitNote = this.invoiceType === VoucherTypeEnum.debitNote;
        this.isPurchaseInvoice = this.invoiceType === VoucherTypeEnum.purchase;
        this.isProformaInvoice = this.invoiceType === VoucherTypeEnum.proforma || this.invoiceType === VoucherTypeEnum.generateProforma;
        this.isEstimateInvoice = this.invoiceType === VoucherTypeEnum.estimate || this.invoiceType === VoucherTypeEnum.generateEstimate;

        // special case when we double click on account name and that accountUniqueName is cash then we have to mark as Cash Invoice
        if (this.isSalesInvoice && !this.isLastInvoiceCopied) {
            if (this.accountUniqueName === 'cash') {
                this.isSalesInvoice = false;
                this.isCashInvoice = true;
            }
        }

        if (!this.isCashInvoice) {
            this.customerPlaceHolder = !this.isPurchaseInvoice && !this.isDebitNote ? this.localeData?.select_customer : this.localeData?.select_vendor;
            this.customerNotFoundText = !this.isPurchaseInvoice && !this.isDebitNote ? this.localeData?.add_customer : this.localeData?.add_vendor;
        }

        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.invoiceNoLabel = this.isProformaInvoice ? this.localeData?.proforma_no : this.localeData?.estimate_no;
            this.invoiceDateLabel = this.isProformaInvoice ? this.localeData?.proforma_date : this.localeData?.estimate_date;
            this.invoiceDueDateLabel = this.localeData?.expiry_date;
        } else if (this.isCreditNote) {
            this.invoiceDateLabel = this.localeData?.cr_note_date;
        } else if (this.isDebitNote) {
            this.invoiceNoLabel = this.localeData?.bill_number;
            this.invoiceDateLabel = this.localeData?.dr_note_date;
        } else if (this.isPurchaseInvoice) {
            this.invoiceDateLabel = this.localeData?.bill_date;
        } else {
            if (this.voucherApiVersion === 2) {
                this.invoiceNoLabel = (this.isDebitNote || this.isCreditNote) ? this.commonLocaleData?.app_reference_invoice : this.commonLocaleData?.app_number;
            } else {
                this.invoiceNoLabel = !this.isPurchaseInvoice ? this.localeData?.invoice_no : this.localeData?.purchase_bill_no;
            }
            this.invoiceDateLabel = this.commonLocaleData?.app_invoice_date;
            this.invoiceDueDateLabel = !this.isPurchaseInvoice ? this.localeData?.due_date : this.localeData?.balance_due_date;
        }

        //---------------------//
        // if sales,cash,estimate,proforma invoice then apply 'GST' taxes remove 'InputGST'
        if (this.isSalesInvoice || this.isCashInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            this.exceptTaxTypes.push('InputGST');
            this.exceptTaxTypes = this.exceptTaxTypes?.filter(ele => {
                return ele !== 'GST';
            });
        }

        // if purchase invoice then apply 'InputGST' taxes remove 'GST'
        if (this.isPurchaseInvoice) {
            this.exceptTaxTypes.push('GST');
            this.exceptTaxTypes = this.exceptTaxTypes?.filter(ele => {
                return ele !== 'InputGST';
            });
        }
    }

    /**
     * Selected invoice for credit note
     *
     * @param {any} event Selected invoice for credit note
     * @memberof VoucherComponent
     */
    public creditNoteInvoiceSelected(event: any): void {
        if (event && event.additional && event.value) {
            if (this.voucherApiVersion === 2) {
                this.selectedInvoiceLabel = event.label;
                this.selectedInvoice = event.value;
                this.invFormData.voucherDetails.referenceVoucher = {
                    uniqueName: event.value,
                    voucherType: event.additional?.voucherType,
                    number: event.additional?.voucherNumber,
                    date: event.additional?.voucherDate
                }
            } else {
                this.invoiceSelectedLabel = event?.label;
                this.selectedInvoice = event?.value;
                this.invFormData.voucherDetails.invoiceLinkingRequest = {
                    linkedInvoices: [
                        {
                            invoiceUniqueName: event?.value,
                            voucherType: event.additional?.voucherType
                        }
                    ]
                }
            }
        }
    }

    public assignAccountDetailsValuesInForm(data: AccountResponseV2) {
        if (data?.mobileNo) {
            let newSelectedMobileNumber = "+" + data?.mobileNo;
            this.intl?.setNumber(newSelectedMobileNumber);
        }
        this.isCashBankAccount = false;

        data?.parentGroups?.forEach(parentGroup => {
            if (parentGroup?.uniqueName === "cash" || parentGroup?.uniqueName === "bankaccounts" || (this.voucherApiVersion === 2 && parentGroup?.uniqueName === "loanandoverdraft")) {
                this.isCashBankAccount = true;
            }
        });

        this.accountAddressList = data.addresses;

        this.customerCountryName = data.country.countryName;
        this.customerCountryCode = data?.country?.countryCode || 'IN';
        this.initializeAccountCurrencyDetails(data);
        this.showGstAndTrnUsingCountryName(this.customerCountryName);
        this.prepareSearchLists([{
            name: data?.name,
            uniqueName: data?.uniqueName
        }], 1, SEARCH_TYPE.CUSTOMER);
        this.makeCustomerList();
        if (this.isSalesInvoice || this.currentVoucherFormDetails?.depositAllowed) {
            this.loadBankCashAccounts(data?.currency);
        }
        if (this.isInvoiceRequestedFromPreviousPage) {
            this.invFormData.voucherDetails.customerUniquename = data?.uniqueName;
            this.invFormData.voucherDetails.customerName = data?.name;
        }
        // toggle all collapse
        this.isOthrDtlCollapsed = false;
        if (this.isMultiCurrencyModule()) {
            this.initializeWarehouse();
        }

        this.checkIfNeedToExcludeTax(data);

        const forceUpdateAddress = data?.uniqueName !== this.invFormData.accountDetails?.uniqueName;

        this.updateAccountDetails(data, forceUpdateAddress);
    }

    /**
     * Initializes acounnt currency details
     *
     * @param {AccountResponseV2} item Account details
     * @memberof VoucherComponent
     */
    public initializeAccountCurrencyDetails(item: AccountResponseV2): void {
        // If currency of item is null or undefined then treat it to be equivalent of company currency
        item.currency = item.currency || this.companyCurrency;
        this.isMulticurrencyAccount = item?.currency !== this.companyCurrency;
        if (item.addresses && item.addresses.length > 0) {
            item.addresses.forEach(address => {
                if (address && address.isDefault) {
                    const defaultAddress: any = address;
                    this.invFormData.accountDetails.billingDetails.pincode = defaultAddress?.pincode;
                    this.invFormData.accountDetails.shippingDetails.pincode = defaultAddress?.pincode;
                }
            });
        }
        if (this.isMulticurrencyAccount) {
            this.customerCurrencyCode = item?.currency;
            this.companyCurrencyName = item?.currency;
        } else {
            this.customerCurrencyCode = this.companyCurrency;
        }

        if (item && item.currency && item.currency !== this.companyCurrency) {
            if (this.isUpdateMode) {
                if (!this.isDefaultLoad) {
                    this.getCurrencyRate(this.companyCurrency, item.currency, this.invFormData.voucherDetails.voucherDate);
                }
            } else {
                this.getCurrencyRate(this.companyCurrency, item.currency, this.invFormData.voucherDetails.voucherDate);
            }
        } else {
            this.previousExchangeRate = this.exchangeRate;
            this.originalExchangeRate = 1;
            this.exchangeRate = 1;
            this.recalculateEntriesTotal();
        }

        if (this.isSalesInvoice && this.isMulticurrencyAccount) {
            this.bankAccounts$ = observableOf([]);
        }
        this.isDefaultLoad = false;
    }

    /**
     * get state code using Tax number to prefill state
     *
     * @param {string} type billingDetails || shipping
     * @param {SalesShSelectComponent} statesEle state input box
     * @memberof VoucherComponent
     */
    public getStateCode(type: string) {
        let gstVal = cloneDeep(this.invFormData.accountDetails[type].gstNumber)?.toString();
        if (gstVal && gstVal.length >= 2) {
            const selectedState = this.statesSource.find(item => item.stateGstCode === gstVal.substring(0, 2));
            if (selectedState) {
                this.invFormData.accountDetails[type].stateCode = selectedState.value;
                this.invFormData.accountDetails[type].state.code = selectedState.value;
                this.invFormData.accountDetails[type].state.name = selectedState.label;
                if (type === 'billingDetails') {
                    this.makeFieldReadonly("billingState", true);
                }
                if (type === 'shippingDetails') {
                    this.makeFieldReadonly("shippingState", true);
                }

            } else {
                this.checkGstNumValidation(gstVal);
                if (!this.isValidGstinNumber) {
                    /* Check for valid pattern such as 9918IND29061OSS through which state can't be determined
                        and clear the state only when valid number is not provided */
                    this.invFormData.accountDetails[type].stateCode = null;
                    this.invFormData.accountDetails[type].state.code = null;
                    this.invFormData.accountDetails[type].state.name = null;
                }
                if (this.isEinvoiceGenerated) {
                    this.makeFieldReadonly("stateEle", true);
                } else {
                    this.makeFieldReadonly("stateEle", false);
                }
            }
        } else {
            if (this.isEinvoiceGenerated) {
                this.makeFieldReadonly("stateEle", true);
            } else {
                this.makeFieldReadonly("stateEle", false);
            }

        }
        this.checkGstNumValidation(gstVal);
    }

    /**
     * To check Tax number validation using regex get by API
     * @param {*} value Value to be validated
     * @param {string} fieldName Field name for which the value is validated
     * @memberof VoucherComponent
     */
    public checkGstNumValidation(value, fieldName: string = '') {
        this.isValidGstinNumber = false;
        if (value) {
            if (this.formFields['taxName'] && this.formFields['taxName']['regex'] && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(value)) {
                        this.isValidGstinNumber = true;
                    }
                }
            } else {
                this.isValidGstinNumber = true;
            }
            if (!this.isValidGstinNumber) {
                this.startLoader(false);
                if (fieldName) {
                    let invalidTax = this.localeData?.invalid_tax_field;
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                    invalidTax = invalidTax?.replace("[FIELD_NAME]", fieldName);
                    this.toaster.showSnackBar("error", invalidTax);
                } else {
                    let invalidTax = this.localeData?.invalid_tax;
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                    this.toaster.showSnackBar("error", invalidTax);
                }
            }
        }
    }

    public resetInvoiceForm(f: NgForm) {
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        if (f) {
            this.intl?.setNumber("");
            f.form.reset();
        }
        if (this.container) {
            this.container.clear();
        }
        this.showSwitchedCurr = false;
        this.autoSaveIcon = false;
        this.autoFillShipping = true;
        this.showCurrencyValue = false;
        this.invFormData = new VoucherClass();
        this.depositAccountUniqueName = '';
        this.accountUniqueName = "";
        this.invoiceNo = "";
        this.selectPaymentValue = "";
        this.selectedBankAccount = 'Cash';
        this.typeaheadNoResultsOfCustomer = false;
        // toggle all collapse
        this.isOthrDtlCollapsed = false;
        if (this.statesBilling?.readonly) {
            this.statesBilling.readonly = false;
        }
        if (this.statesShipping?.readonly) {
            this.statesShipping.readonly = false;
        }
        this.invoiceSelectedLabel = '';
        this.selectedInvoiceLabel = '';
        this.invoiceSelected = '';
        this.isCustomerSelected = false;
        this.selectedFileName = '';
        this.selectedWarehouse = '';
        this.selectedWarehouseName = '';
        this.isRcmEntry = false;
        this.matchingPurchaseRecord = null;
        this.purchaseRecordCustomerUniqueName = '';
        this.purchaseRecordInvoiceDate = '';
        this.purchaseRecordTaxNumber = '';
        this.purchaseRecordInvoiceNumber = '';
        this.adjustPaymentBalanceDueData = 0;
        this.depositAmount = 0;
        this.selectedPoItems = [];
        this.linkedPo = [];
        this.linkedPoNumbers = [];
        this.purchaseOrders = [];
        this.purchaseBillCompany = {
            billingDetails: {
                index: 0,
                address: [],
                state: { code: '', name: '' },
                county: { code: '', name: '' },
                gstNumber: '',
                stateName: '',
                stateCode: ''
            },
            shippingDetails: {
                index: 0,
                address: [],
                state: { code: '', name: '' },
                county: { code: '', name: '' },
                gstNumber: '',
                stateName: '',
                stateCode: ''
            }
        };
        this.previousExchangeRate = 1;
        this.isShowLoader = false;
        this.startLoader(false);
        this.isEntryDateChangeConfirmationDisplayed = false;
        this.isVoucherDateChanged = false;
        this.assignDates();
        this.updateDueDate();
        if (!this.isUpdateMode) {
            this.toggleBodyClass();
        }
        this.clickAdjustAmount(false);
        this.autoFillCompanyShipping = true;
        this.userDeposit = null;
        this.fillDeliverToAddress();
        this.createEmbeddedViewAtIndex(0);
        this.onSearchQueryChanged('', 1, 'customer');
        this.invFormData.voucherDetails.customerName = "";

        if (this.actionAfterGenerateORUpdate !== ActionTypeAfterVoucherGenerateOrUpdate.generateAndPrint && this.actionAfterGenerateORUpdate !== ActionTypeAfterVoucherGenerateOrUpdate.generateAndRecurring && this.actionAfterGenerateORUpdate !== ActionTypeAfterVoucherGenerateOrUpdate.generateAndSend && !this.isUpdateMode) {
            setTimeout(() => {
                this.openAccountSelectionDropdown?.openDropdownPanel();
            }, 500);
        }
    }

    public triggerSubmitInvoiceForm(form: NgForm, isUpdate) {
        this.updateAccount = isUpdate;
        if (this.isPendingVoucherType) {
            this.startLoader(true);
            this.onSubmitInvoiceForm(form);
        } else {
            this.generateUpdateButtonClicked.next(form);
        }
    }

    public autoFillShippingDetails() {
        if (this.autoFillShipping) {
            this.invFormData.accountDetails.shippingDetails = cloneDeep(this.invFormData.accountDetails.billingDetails);
            if (this.shippingState && this.shippingState.nativeElement) {
                this.shippingState.nativeElement.classList.remove('error-box');
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    public convertDateForAPI(val: any): string {
        if (val) {
            // To check val is DD-MM-YY format already so it will be string then return val
            if (typeof val === 'string') {
                if (val.includes('-')) {
                    return val;
                } else {
                    return '';
                }
            } else {
                try {
                    return dayjs(val).format(GIDDH_DATE_FORMAT);
                } catch (error) {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    public onSubmitInvoiceForm(form?: NgForm) {
        this.isShowLoader = true;
        this.changeDetectorRef.detectChanges();
        let invoiceType = this.getVoucherType(this.invoiceType);

        if ((this.isSalesInvoice || this.isPurchaseInvoice) && this.depositAccountUniqueName && (this.userDeposit === null || this.userDeposit === undefined)) {
            this.userDeposit = 0;
        }
        let data: VoucherClass = cloneDeep(this.invFormData);
        // special check if gst no filed is visible then and only then check for gst validation
        if (data.accountDetails && data.accountDetails.billingDetails && data.accountDetails.billingDetails.gstNumber && this.showGSTINNo) {
            this.checkGstNumValidation(data.accountDetails.billingDetails.gstNumber, this.localeData?.billing_address);
            if (!this.isValidGstinNumber) {
                this.isShowLoader = false;
                this.startLoader(false);
                return;
            }
        }
        if (data.accountDetails && data.accountDetails.shippingDetails && data.accountDetails.shippingDetails.gstNumber && this.showGSTINNo) {
            this.checkGstNumValidation(data.accountDetails.shippingDetails.gstNumber, this.localeData?.shipping_address);
            if (!this.isValidGstinNumber) {
                this.isShowLoader = false;
                this.startLoader(false);
                return;
            }
        }

        if (this.isPurchaseInvoice) {
            if (this.purchaseBillCompany && this.purchaseBillCompany.billingDetails && this.purchaseBillCompany.billingDetails.gstNumber && this.showGSTINNo) {
                this.checkGstNumValidation(this.purchaseBillCompany.billingDetails.gstNumber, this.localeData?.billing_address);
                if (!this.isValidGstinNumber) {
                    this.isShowLoader = false;
                    this.startLoader(false);
                    return;
                }
            }
            if (this.purchaseBillCompany && this.purchaseBillCompany.shippingDetails && this.purchaseBillCompany.shippingDetails.gstNumber && this.showGSTINNo) {
                this.checkGstNumValidation(this.purchaseBillCompany.shippingDetails.gstNumber, this.localeData?.shipping_address);
                if (!this.isValidGstinNumber) {
                    this.isShowLoader = false;
                    this.startLoader(false);
                    return;
                }
            }
        }

        if (this.isSalesInvoice || this.isPurchaseInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
            if (dayjs(data.voucherDetails.dueDate, GIDDH_DATE_FORMAT).isBefore(dayjs(data.voucherDetails.voucherDate, GIDDH_DATE_FORMAT), 'd')) {
                this.isShowLoader = false;
                this.startLoader(false);
                let dateText = this.commonLocaleData?.app_invoice;

                if (this.isProformaInvoice) {
                    dateText = this.localeData?.invoice_types?.proforma;
                }

                if (this.isEstimateInvoice) {
                    dateText = this.localeData?.invoice_types?.estimate;
                }

                let dueDateError = this.localeData?.due_date_error;
                dueDateError = dueDateError?.replace("[INVOICE_TYPE]", dateText);
                this.toaster.showSnackBar("error", dueDateError);
                return;
            }
        } else {
            delete data.voucherDetails.dueDate;
        }

        if ((this.isPurchaseInvoice || this.isSalesInvoice || this.isCashInvoice || this.isCreditNote || this.isDebitNote) && this.isRcmEntry && !this.validateTaxes(cloneDeep(data))) {
            this.isShowLoader = false;
            this.startLoader(false);
            return;
        }

        let transactionError: boolean = false;
        let entries = [];
        // check for valid entries and transactions
        if (data.entries) {
            data.entries.forEach((entry, indx) => {
                if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                    this.invFormData.entries.splice(indx, 1);
                }
                if (!transactionError) {
                    // filter active discounts
                    entry.discounts = entry.discounts?.filter(dis => dis.isActive);

                    // filter active taxes
                    entry.taxes = entry.taxes?.filter(tax => tax.isChecked);
                    entry.voucherType = this.voucherUtilityService.parseVoucherType(invoiceType);
                    entry.taxList = entry.taxes?.map(m => m?.uniqueName);
                    entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;
                    if (entry.isOtherTaxApplicable) {
                        entry.taxList.push(entry.otherTaxModal.appliedOtherTax?.uniqueName);
                    }

                    entry.transactions = entry.transactions.map((txn: SalesTransactionItemClass) => {
                        if (!transactionError) {
                            // convert date object
                            // txn.date = this.convertDateForAPI(txn.date);
                            entry.entryDate = dayjs(this.convertDateForAPI(entry?.entryDate), GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                            txn.convertedAmount = this.fetchedConvertedRate > 0 ? giddhRoundOff((Number(txn.amount) * this.fetchedConvertedRate), this.highPrecisionRate) : 0;

                            // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess (allowing for pending type voucher)
                            if (this.isLastInvoiceCopied || this.isPendingVoucherType) {
                                if (txn.stockList && txn.stockList.length) {
                                    txn.accountUniqueName = txn.accountUniqueName?.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName?.indexOf('#')) : txn.accountUniqueName;
                                    txn.fakeAccForSelect2 = txn.accountUniqueName?.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2?.indexOf('#')) : txn.fakeAccForSelect2;
                                }
                            }

                            if (this.isPurchaseInvoice) {
                                txn.accountUniqueName = txn.accountUniqueName?.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName?.indexOf('#')) : txn.accountUniqueName;

                                if (txn.stockDetails && !txn.stockDetails?.uniqueName && txn.stockDetails.stock && txn.stockDetails.stock?.uniqueName) {
                                    txn.stockDetails.uniqueName = txn.stockDetails.stock?.uniqueName;
                                }
                            }

                            // will get errors of string and if not error then true boolean
                            if (!txn.isValid()) {
                                this.isShowLoader = false;
                                this.startLoader(false);
                                this.toaster.showSnackBar("warning", this.localeData?.no_product_error);
                                transactionError = true;
                            }
                        }
                        return txn;
                    });
                }

                if (entry.transactions[0]?.accountUniqueName || indx === 0) {
                    entries.push(entry);
                }

                if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                    this.invFormData.entries.splice(indx, 1);
                }
            });
        } else {
            this.isShowLoader = false;
            this.startLoader(false);
            this.toaster.showSnackBar("warning", this.localeData?.no_entry_error);
            return;
        }

        // if txn has errors
        if (transactionError) {
            this.isShowLoader = false;
            this.startLoader(false);
            return false;
        } else {
            data.entries = cloneDeep(entries);
        }

        if (!data.accountDetails?.uniqueName) {
            data.accountDetails.uniqueName = 'cash';
        }
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails?.email) {
            if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
                this.isShowLoader = false;
                this.startLoader(false);
                this.toaster.showSnackBar("warning", this.localeData?.invalid_email);
                return;
            }
        }

        // replace /n to br for (shipping and billing)

        if (data?.accountDetails?.shippingDetails?.address?.length && data?.accountDetails?.shippingDetails?.address[0]?.length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0]?.trim();
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0]?.replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0]?.split('<br />');
        }
        if (data?.accountDetails?.billingDetails?.address?.length && data?.accountDetails?.billingDetails?.address[0]?.length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0]?.trim();
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0]?.replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0]?.split('<br />');
        }

        // convert date object
        if (this.invoiceType === VoucherTypeEnum.generateProforma || this.invoiceType === VoucherTypeEnum.proforma) {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        } else if (this.invoiceType === VoucherTypeEnum.generateEstimate || this.invoiceType === VoucherTypeEnum.estimate) {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        } else {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }

        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

        let exRate = this.originalExchangeRate;
        let requestObject: any;
        let voucherDate: any;
        const deposit = this.getDeposit();
        data.accountDetails.mobileNumber = this.intl?.getNumber();
        if (!this.isPurchaseInvoice) {
            voucherDate = data.voucherDetails.voucherDate;
            requestObject = {
                account: data.accountDetails,
                updateAccountDetails: this.updateAccount,
                voucher: data,
                entries: [],
                date: data.voucherDetails.voucherDate,
                type: invoiceType,
                exchangeRate: exRate,
                dueDate: data.voucherDetails.dueDate,
                deposit: (!this.currentVoucherFormDetails || this.currentVoucherFormDetails?.depositAllowed) ? deposit : undefined,
                subVoucher: (this.isRcmEntry) ? SubVoucher.ReverseCharge : undefined,
                attachedFiles: (this.invFormData.entries[0] && this.invFormData.entries[0].attachedFile) ? [this.invFormData.entries[0].attachedFile] : [],
                generateEInvoice: this.invFormData.generateEInvoice
            } as GenericRequestForGenerateSCD;
            // set voucher type
            requestObject.voucher.voucherDetails.voucherType = this.voucherUtilityService.parseVoucherType(invoiceType);
            // set state details as new request
            requestObject.account.billingDetails.countryName = this.customerCountryName;
            requestObject.account.billingDetails.countryCode = this.customerCountryCode;
            requestObject.account.billingDetails.stateCode = requestObject.account.billingDetails.state?.code;
            requestObject.account.billingDetails.stateName = requestObject.account.billingDetails.state?.name;
            // set state details as new request
            requestObject.account.shippingDetails.countryName = this.customerCountryName;
            requestObject.account.shippingDetails.countryCode = this.customerCountryCode;
            requestObject.account.shippingDetails.stateCode = requestObject.account.shippingDetails.state?.code;
            requestObject.account.shippingDetails.stateName = requestObject.account.shippingDetails.state?.name;
            /** Tourist scheme is applicable only for voucher type 'sales invoice' and 'Cash Invoice' and company country code 'AE'   */
            if (this.isSalesInvoice || this.isCashInvoice) {
                if (this.invFormData.touristSchemeApplicable) {
                    requestObject.touristSchemeApplicable = this.invFormData.touristSchemeApplicable;
                    requestObject.passportNumber = this.invFormData.passportNumber;
                }
            }
            /** Advance receipts adjustment for sales invoice*/
            if ((this.isSalesInvoice || this.isCreditNote || this.isDebitNote) && this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
                if (this.advanceReceiptAdjustmentData.adjustments.length) {
                    const adjustments = cloneDeep(this.advanceReceiptAdjustmentData.adjustments);
                    if (adjustments) {
                        adjustments.forEach(adjustment => {
                            if (adjustment.balanceDue !== undefined) {
                                delete adjustment.balanceDue;
                            }
                        });
                        requestObject.voucherAdjustments = {
                            adjustments
                        };

                        if (requestObject.voucherAdjustments && requestObject.voucherAdjustments.adjustments && requestObject.voucherAdjustments.adjustments.length > 0) {
                            requestObject.voucherAdjustments.adjustments.map(item => {
                                if (item && item.voucherDate) {
                                    item.voucherDate = item.voucherDate?.replace(/\//g, '-');
                                }
                            });
                        }
                    }
                } else {
                    this.advanceReceiptAdjustmentData.adjustments = [];
                    requestObject.voucherAdjustments = this.advanceReceiptAdjustmentData;
                }
            }
        } else {
            let purchaseOrders = [];
            if (this.selectedPoItems && this.selectedPoItems.length > 0) {
                this.selectedPoItems.forEach(order => {
                    purchaseOrders.push({ name: this.linkedPoNumbers[order]?.voucherNumber, uniqueName: order });
                });
            }
            requestObject = {
                account: data.accountDetails,
                number: this.invFormData.voucherDetails.voucherNumber || '',
                entries: data.entries,
                exchangeRate: exRate,
                date: data.voucherDetails.voucherDate,
                dueDate: data.voucherDetails.dueDate,
                type: invoiceType,
                attachedFiles: (this.invFormData.entries[0]?.attachedFile) ? [this.invFormData.entries[0]?.attachedFile] : [],
                templateDetails: data.templateDetails,
                deposit: (this.currentVoucherFormDetails?.depositAllowed) ? deposit : undefined,
                subVoucher: (this.isRcmEntry) ? SubVoucher.ReverseCharge : undefined,
                purchaseOrders: purchaseOrders,
                company: this.purchaseBillCompany,
                generateEInvoice: this.invFormData.generateEInvoice
            } as PurchaseRecordRequest;
            /** Advance receipts adjustment */
            if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
                if (this.advanceReceiptAdjustmentData.adjustments.length) {
                    const adjustments = cloneDeep(this.advanceReceiptAdjustmentData.adjustments);
                    if (adjustments) {
                        adjustments.forEach(adjustment => {
                            if (adjustment.balanceDue !== undefined) {
                                delete adjustment.balanceDue;
                            }
                        });
                        requestObject.voucherAdjustments = {
                            adjustments
                        };

                        if (requestObject.voucherAdjustments && requestObject.voucherAdjustments.adjustments && requestObject.voucherAdjustments.adjustments.length > 0) {
                            requestObject.voucherAdjustments.adjustments.map(item => {
                                if (item && item.voucherDate) {
                                    item.voucherDate = item.voucherDate?.replace(/\//g, '-');
                                }
                            });
                        }
                    }
                } else {
                    this.advanceReceiptAdjustmentData.adjustments = [];
                    requestObject.voucherAdjustments = this.advanceReceiptAdjustmentData;
                }
            }
        }

        if (this.isProformaInvoice || this.isEstimateInvoice) {
            if (this.depositAmount && this.depositAmount > 0) {
                requestObject.paymentAction = {
                    action: 'paid',
                    amount: Number(this.depositAmount) + this.depositAmountAfterUpdate
                };
                if (this.isCustomerSelected) {
                    requestObject.depositAccountUniqueName = this.depositAccountUniqueName;
                } else {
                    requestObject.depositAccountUniqueName = data.accountDetails?.uniqueName;
                }
            } else {
                requestObject.depositAccountUniqueName = '';
            }
            requestObject.date = dayjs(voucherDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            requestObject.type = VoucherTypeEnum.sales;
            let updatedData = requestObject;
            updatedData = this.updateData(requestObject, data);
            if (!updatedData.voucherDetails) {
                updatedData.voucherDetails = {};
            }
            if (!updatedData.accountDetails) {
                updatedData.accountDetails = {};
            }
            updatedData.voucherDetails.voucherNumber = data.voucherDetails.voucherNumber;
            updatedData.voucherDetails.voucherType = this.voucherUtilityService.parseVoucherType(invoiceType);
            updatedData.accountDetails.uniqueName = data.accountDetails?.uniqueName;

            if (this.voucherApiVersion === 2) {
                updatedData = this.voucherUtilityService.cleanObject(updatedData);
            }
            updatedData = this.deleteUnusedVoucherUpdateObjectKey(updatedData);

            this.store.dispatch(this.proformaActions.generateProforma(updatedData));
        } else {
            let updatedData = requestObject;
            let isVoucherV4 = false;
            if (this.isSalesInvoice || this.isCashInvoice || this.isCreditNote || this.isDebitNote || this.isPurchaseInvoice) {
                updatedData = this.updateData(requestObject, data);
                isVoucherV4 = true;
                if (this.useCustomInvoiceNumber) {
                    updatedData['number'] = this.invFormData.voucherDetails.voucherNumber;
                }
                if (this.isCreditNote || this.isDebitNote) {
                    updatedData['invoiceNumberAgainstVoucher'] = this.invFormData.voucherDetails.voucherNumber;
                    if (this.voucherApiVersion === 2) {
                        updatedData['referenceVoucher'] = data.voucherDetails.referenceVoucher;
                    } else {
                        updatedData['invoiceLinkingRequest'] = data.voucherDetails.invoiceLinkingRequest;
                    }
                }
                if (this.voucherApiVersion === 2 && !this.isPurchaseInvoice) {
                    updatedData = this.voucherUtilityService.getVoucherRequestObjectForInvoice(updatedData);
                }

                if (this.voucherApiVersion === 2) {
                    updatedData = this.adjustmentUtilityService.getAdjustmentObjectVoucherModule(updatedData);
                }
            }
            if (this.isPurchaseInvoice) {
                if (this.voucherApiVersion === 2 || ((this.invFormData.accountDetails.shippingDetails.state.code && this.invFormData.accountDetails.billingDetails.state.code) || (this.invFormData.accountDetails.shippingDetails?.county?.code && this.invFormData.accountDetails.billingDetails?.county?.code))) {
                    if (this.voucherApiVersion === 2) {
                        updatedData = this.voucherUtilityService.getVoucherRequestObjectForInvoice(updatedData);
                    }

                    if (this.voucherApiVersion === 2) {
                        updatedData = this.voucherUtilityService.cleanObject(updatedData);
                    }
                    this.generatePurchaseRecord(updatedData);
                } else {
                    if (this.shippingState && this.shippingState.nativeElement && (!this.invFormData.accountDetails.shippingDetails.state.code || !this.invFormData.accountDetails.shippingDetails?.county?.code)) {
                        this.shippingState.nativeElement.classList.add('error-box');
                    }
                    if (this.billingState && this.billingState.nativeElement && (!this.invFormData.accountDetails.billingDetails.state.code || !this.invFormData.accountDetails.shippingDetails?.county?.code)) {
                        this.billingState.nativeElement.classList.add('error-box');
                    }
                    this.isShowLoader = false;
                    this.startLoader(false);
                    this.toaster.showSnackBar("error", this.localeData?.no_state_error);
                    return;
                }
            } else {
                if (this.isPendingVoucherType) {
                    let apiCallObservable;
                    updatedData = this.deleteUnusedVoucherUpdateObjectKey(updatedData);

                    if (this.voucherApiVersion === 2) {
                        updatedData = this.voucherUtilityService.cleanObject(updatedData);
                    }

                    if (this.voucherApiVersion === 2) {
                        updatedData = this.voucherUtilityService.getVoucherRequestObjectForInvoice(updatedData);
                        if (this.isDebitNote || this.isCreditNote || this.isSalesInvoice) {
                            if (updatedData.account.billingDetails) {
                                updatedData.account.billingDetails.taxNumber = requestObject.account.billingDetails.taxNumber;
                            }
                            if (updatedData.account.shippingDetails) {
                                updatedData.account.shippingDetails.taxNumber = requestObject.account.shippingDetails.taxNumber;
                            }
                        }
                        apiCallObservable = this.salesService.generateGenericItem(updatedData, isVoucherV4);
                    } else {
                        apiCallObservable = this.salesService.generatePendingVoucherGenericItem(updatedData);
                    }

                    apiCallObservable.pipe(take(1)).subscribe((response: BaseResponse<any, GenericRequestForGenerateSCD>) => {
                        this.handleGenerateResponse(response, form);
                    }, () => {
                        this.isShowLoader = false;
                        this.startLoader(false);
                        this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
                    });
                } else {
                    if (this.voucherApiVersion === 2) {
                        updatedData = this.voucherUtilityService.cleanObject(updatedData);
                    }
                    updatedData = this.deleteUnusedVoucherUpdateObjectKey(updatedData);

                    this.salesService.generateGenericItem(updatedData, isVoucherV4).pipe(takeUntil(this.destroyed$)).subscribe((response: BaseResponse<any, GenericRequestForGenerateSCD>) => {
                        this.handleGenerateResponse(response, form);
                    }, () => {
                        this.isShowLoader = false;
                        this.startLoader(false);
                        this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
                    });
                }
            }
        }
    }

    public onNoResultsClicked(idx?: number) {
        if (!isUndefined(idx)) {
            this.innerEntryIdx = idx;
        }
        this.asideMenuStateForProductService = this.dialog.open(this.asideMenuProductService, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important',
            disableClose: true
        });

        this.asideMenuStateForProductService.afterClosed().pipe(take(1)).subscribe(response => {
            setTimeout(() => {
                if (this.showPageLeaveConfirmation) {
                    this.pageLeaveUtilityService.addBrowserConfirmationDialog();
                }
            }, 100);
        });
    }

    /**
     * This Function is used to close Aside Menu Sidebar
     *
     * @memberof VoucherComponent
     */
    public closeAsideMenuProductServiceModal(): void {
        this.asideMenuStateForProductService?.close();
    }

    public toggleBodyClass() {
        if (this.accountAsideMenuState === 'in'
            || this.asideMenuStateForRecurringEntry === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            /* add fixed class only in crete mode not in update mode
                - because fixed class is already added in update mode due to double scrolling issue
             */
            if (!this.isUpdateMode) {
                document.querySelector('body').classList.add('fixed');
                this.openAccountSelectionDropdown?.closeDropdownPanel();
                this.openCustomerDropdown = false;
            }
        } else {
            /* remove fixed class only in crete mode not in update mode
                - because fixed class is needed in update mode due to double scrolling issue
            */
            if (!this.isUpdateMode) {
                document.querySelector('body').classList.remove('fixed');
            }
        }
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('.invoice-modal-content')?.classList?.add('aside-account-create');
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('.invoice-modal-content')?.classList?.remove('aside-account-create');
            document.querySelector('body').classList.remove('fixed');
        }
    }


    public toggleOtherTaxesAsidePane(modalBool: boolean, index: number = null) {
        this.closeAllDropdown(true);
        this.activeEntry = this.invFormData.entries[index];
        if (!modalBool) {
            let entry = this.invFormData.entries[this.activeIndx];
            if (entry) {
                entry.otherTaxModal = new SalesOtherTaxesModal();
                entry.otherTaxSum = 0;
            }
            return;
        } else {
            if (index !== null) {
                this.entriesListBeforeTax = cloneDeep(this.invFormData.entries);
            }
        }
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Closes the other taxes side menu panel on click of overlay
     *
     * @memberof VoucherComponent
     */
    public closeAsideMenuStateForOtherTaxes(): void {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            let entry = this.invFormData.entries[this.activeIndx];
            if (entry.otherTaxSum > 0) {
                entry.isOtherTaxApplicable = true;
            } else {
                entry.isOtherTaxApplicable = false;
            }
            this.toggleOtherTaxesAsidePane(true, null);
        }
    }

    public checkForInfinity(value): number {
        return (value === Infinity) ? 0 : value;
    }

    /**
     * This will be use for calculation of discount
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @param {boolean} [calculateEntryTotal=true]
     * @memberof VoucherComponent
     */
    public calculateTotalDiscountOfEntry(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true) {
        let percentageListTotal: number = 0;
        let fixedListTotal: number = 0;
        percentageListTotal = entry.discounts?.filter(f => f.isActive)
            ?.filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
        fixedListTotal = entry.discounts?.filter(f => f.isActive)
            ?.filter(s => s.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let perFromAmount = ((percentageListTotal * trx.amount) / 100);
        entry.discountSum = perFromAmount + fixedListTotal;
        if (isNaN(entry.discountSum)) {
            entry.discountSum = 0;
        }

        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
        trx.taxableValue = Number(trx.amount) - entry.discountSum;
        if (isNaN(trx.taxableValue)) {
            trx.taxableValue = 0;
        }
    }

    public calculateEntryTaxSum(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true) {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        entry.taxes?.filter(f => f.isChecked).forEach(tax => {
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            } else {
                taxPercentage += tax.amount;
            }
        });

        entry.taxSum = giddhRoundOff(((taxPercentage * (trx.amount - entry.discountSum)) / 100), this.giddhBalanceDecimalPlaces);
        entry.cessSum = giddhRoundOff(((cessPercentage * (trx.amount - entry.discountSum)) / 100), this.giddhBalanceDecimalPlaces);

        if (isNaN(entry.taxSum)) {
            entry.taxSum = 0;
        }

        if (isNaN(entry.cessSum)) {
            entry.cessSum = 0;
        }

        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
    }

    public calculateStockEntryAmount(trx: SalesTransactionItemClass) {
        const qtyRate = Number(trx.quantity) * Number(trx.rate);
        trx.amount = giddhRoundOff(qtyRate, this.giddhBalanceDecimalPlaces);
        trx.highPrecisionAmount = trx.amount;
    }

    public calculateEntryTotal(entry: SalesEntryClass, trx: SalesTransactionItemClass) {
        this.calculateConvertedAmount(trx);
        this.calculateConvertedTotal(entry, trx);
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
    }

    /**
     * This will be use for calculating when transaction altered
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @param {boolean} [fromTransactionField=false]
     * @param {*} [event]
     * @return {*}
     * @memberof VoucherComponent
     */
    public calculateWhenTrxAltered(entry: SalesEntryClass, trx: SalesTransactionItemClass, fromTransactionField: boolean = false, event?: any) {
        if (trx?.accountName || trx?.accountUniqueName) {
            if (fromTransactionField) {
                trx.highPrecisionAmount = trx.amount;
                if (this.transactionAmount === trx.amount) {
                    this.transactionAmount = 0;
                    return;
                }
            }
            if (event || !this.isUpdateMode || !entry['initiallyCall']) {
                if (!entry['initiallyCall']) {
                    entry.discounts = entry.discounts.map(item => {
                        item.isActive = false;
                        return item;
                    });

                    entry.discountFixedValueModal = 0;
                    entry.discountPercentageModal = 0;
                    entry.discountSum = 0;

                    trx?.stockDetails?.variant?.unitRates?.forEach(unitRate => {
                        let matchedUnit = unitRate?.stockUnitUniqueName === trx?.stockUnit;
                        if (matchedUnit && !this.isBulkEntryInProgress) {
                            trx.rate = Number((unitRate.rate / this.exchangeRate).toFixed(this.highPrecisionRate));
                        }
                        this.calculateStockEntryAmount(trx);
                    });
                    this.applyMrpDiscount(false, trx, entry, event);
                } else if (event && entry.discounts[0]) {
                    entry.discounts[0].isActive = true;
                }
            }

            if (trx.amount) {
                let transactionAmount = trx.amount?.toString();

                if (this.invFormData.accountDetails.currencySymbol && transactionAmount) {
                    transactionAmount = transactionAmount?.replace(this.invFormData.accountDetails.currencySymbol, "");
                }

                if (this.selectedSuffixForCurrency && transactionAmount) {
                    transactionAmount = transactionAmount?.replace(this.selectedSuffixForCurrency, "");
                }

                if (!isNaN(Number(transactionAmount))) {
                    trx.amount = Number(transactionAmount);
                }
            }

            if (!isNaN(Number(trx.amount))) {
                trx.amount = Number(trx.amount);
            } else {
                trx.amount = 0;
            }

            if (trx.isStockTxn && fromTransactionField) {
                trx.rate = Number(((trx.highPrecisionAmount ?? 0) / trx.quantity).toFixed(this.highPrecisionRate));
            }

            if (this.isUpdateMode && (this.isEstimateInvoice || this.isProformaInvoice)) {
                this.applyRoundOff = true;
            }
            this.calculateTotalDiscountOfEntry(entry, trx, false);
            this.calculateEntryTaxSum(entry, trx, false);
            this.calculateEntryTotal(entry, trx);
            this.calculateOtherTaxes(entry.otherTaxModal, entry);
            this.calculateTcsTdsTotal();
            this.calculateBalanceDue();
            this.checkVoucherEntries();
            this.transactionAmount = 0;
        }
    }

    /**
     * This will be use for apply mrp discount
     *
     * @private
     * @param {*} trx
     * @param {*} entry
     * @param {*} event
     * @memberof VoucherComponent
     */
    private applyMrpDiscount(isTaxInclusive: boolean, trx: any, entry: any, event: any): void {
        if (trx?.stockDetails?.variant?.variantDiscount?.discounts?.length) {
            let discountApplied = false;
            trx?.stockDetails?.variant?.variantDiscount?.discounts.forEach(discount => {
                if (discount) {
                    let matchedUnit = trx?.stockDetails?.variant?.variantDiscount?.unit?.uniqueName === trx?.stockUnit;
                    if (matchedUnit) {
                        entry.discounts = entry.discounts.map(item => {
                            if (item.discountUniqueName === discount?.discount?.uniqueName) {
                                item.isActive = true;
                            }
                            return item;
                        });
                        if (!isTaxInclusive) {
                            this.calculateStockEntryAmount(trx);
                        }

                        discountApplied = true;
                    }
                }
            });

            if (!discountApplied) {
                if (event && event.discount && event.isActive) {
                    this.accountAssignedApplicableDiscounts.forEach(item => {
                        if (item && event.discount && item.uniqueName === event.discount.discountUniqueName) {
                            item.isActive = event.isActive?.target?.checked;
                        }
                    });
                }

                if (entry && entry.discounts && entry.discounts.length && this.accountAssignedApplicableDiscounts && this.accountAssignedApplicableDiscounts.length) {
                    entry.discounts.map(item => {
                        let discountItem = this.accountAssignedApplicableDiscounts.find(element => element?.uniqueName === item.discountUniqueName);
                        if (discountItem && discountItem.uniqueName) {
                            item.isActive = discountItem.isActive;
                        }
                    });
                }
            }
        } else {
            if (event && event.discount && event.isActive) {
                this.accountAssignedApplicableDiscounts.forEach(item => {
                    if (item && event.discount && item.uniqueName === event.discount.discountUniqueName) {
                        item.isActive = event.isActive?.target?.checked;
                    }
                });
            }
            if (entry && entry.discounts && entry.discounts.length && this.accountAssignedApplicableDiscounts && this.accountAssignedApplicableDiscounts.length) {
                entry.discounts.map(item => {
                    let discountItem = this.accountAssignedApplicableDiscounts.find(element => element?.uniqueName === item.discountUniqueName);
                    if (discountItem && discountItem.uniqueName) {
                        item.isActive = discountItem.isActive;
                    }
                });
            }
        }
        entry['initiallyCall'] = true;
    }

    /**
     * Calculate the complete transaction values inclusively
     *
     * @param {SalesEntryClass} entry Entry value
     * @param {SalesTransactionItemClass} transaction Current transaction
     * @memberof VoucherComponent
     */
    public calculateTransactionValueInclusively(entry: SalesEntryClass, transaction: SalesTransactionItemClass, updateTransactionRate: boolean = true): void {
        // Calculate discount
        entry.discounts = entry.discounts?.length ? entry.discounts : this.generalService.getDiscountValues({
            discountAccountsDetails: entry.discounts ?? [],
            discountsList: this.discountsList
        });
        let percentageDiscountTotal = entry.discounts?.filter(discount => discount.isActive)
            ?.filter(activeDiscount => activeDiscount.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedDiscountTotal = entry.discounts?.filter(discount => discount.isActive)
            ?.filter(activeDiscount => activeDiscount.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        // Calculate tax
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        let taxTotal: number = 0;
        entry.taxes = entry.taxes?.length ? entry.taxes : this.generalService.getTaxValues({
            taxRenderData: entry.taxes ?? [],
            date: entry.entryDate,
            applicableTaxes: transaction.applicableTaxes,
            taxes: this.companyTaxesList,
            exceptTaxTypes: this.exceptTaxTypes,
        });
        entry.taxes?.filter(tax => tax.isChecked).forEach(selectedTax => {
            if (selectedTax.type === 'gstcess') {
                cessPercentage += selectedTax.amount;
            } else {
                taxPercentage += selectedTax.amount;
            }
            taxTotal += selectedTax.amount;
        });
        // Calculate amount with inclusive tax
        transaction.amount = giddhRoundOff(((Number(transaction.total) + fixedDiscountTotal + 0.01 * fixedDiscountTotal * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscountTotal + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscountTotal * Number(taxTotal))), this.giddhBalanceDecimalPlaces);
        transaction.highPrecisionAmount = giddhRoundOff(((Number(transaction.total) + fixedDiscountTotal + 0.01 * fixedDiscountTotal * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscountTotal + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscountTotal * Number(taxTotal))), this.highPrecisionRate);
        transaction.convertedAmount = giddhRoundOff(transaction.amount * this.exchangeRate, this.giddhBalanceDecimalPlaces);
        let perFromAmount = giddhRoundOff(((percentageDiscountTotal * transaction.amount) / 100), this.highPrecisionRate);
        entry.discountSum = giddhRoundOff(perFromAmount + fixedDiscountTotal, this.highPrecisionRate);
        if (isNaN(entry.discountSum)) {
            entry.discountSum = 0;
        }
        transaction.taxableValue = Number(transaction.amount) - entry.discountSum;
        if (isNaN(transaction.taxableValue)) {
            transaction.taxableValue = 0;
        }
        entry.taxSum = giddhRoundOff(((taxPercentage * (transaction.amount - entry.discountSum)) / 100), this.highPrecisionRate);
        entry.cessSum = giddhRoundOff(((cessPercentage * (transaction.amount - entry.discountSum)) / 100), this.highPrecisionRate);
        if (isNaN(entry.taxSum)) {
            entry.taxSum = 0;
        }

        if (isNaN(entry.cessSum)) {
            entry.cessSum = 0;
        }
        // Calculate stock unit rate with amount
        if (updateTransactionRate && transaction.isStockTxn) {
            transaction.rate = Number((transaction.amount / transaction.quantity).toFixed(this.highPrecisionRate));
        }
        transaction.convertedTotal = giddhRoundOff(transaction.total * this.exchangeRate, this.giddhBalanceDecimalPlaces);
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();
        this.calculateBalanceDue();
        this.checkVoucherEntries();
    }

    public calculateTotalDiscount() {
        let discount = 0;
        this.invFormData.entries.forEach(f => {
            discount += f.discountSum;
        });
        this.invFormData.voucherDetails.totalDiscount = discount;
    }

    public calculateTotalTaxSum() {
        let taxes = 0;
        let cess = 0;

        this.invFormData.entries.forEach(f => {
            taxes += f.taxSum;
        });

        this.invFormData.entries.forEach(f => {
            cess += f.cessSum;
        });

        this.invFormData.voucherDetails.gstTaxesTotal = taxes;
        this.invFormData.voucherDetails.cessTotal = cess;
        this.invFormData.voucherDetails.totalTaxableValue = this.invFormData.voucherDetails.subTotal - this.invFormData.voucherDetails.totalDiscount;
    }

    public calculateTcsTdsTotal() {
        let tcsSum: number = 0;
        let tdsSum: number = 0;
        let isTcsPresent: boolean;
        let isTdsPresent: boolean;
        this.invFormData.entries.forEach(entry => {
            if (entry.otherTaxType === 'tcs') {
                tcsSum += entry.otherTaxSum;
                isTcsPresent = true;
            } else if (entry.otherTaxType === 'tds') {
                tdsSum += entry.otherTaxSum;
                isTdsPresent = true;
            }
        });
        this.isTcsPresent = isTcsPresent;
        this.isTdsPresent = isTdsPresent;
        this.invFormData.voucherDetails.tcsTotal = tcsSum;
        this.invFormData.voucherDetails.tdsTotal = tdsSum;
        /** Call calculateBalanceDue if advance receipt adjusted for balance due added TDS TCS taxes  */
        if (this.adjustPaymentData.totalAdjustedAmount) {
            this.calculateBalanceDue();
        }
    }

    public calculateBalanceDue() {
        let count: number = 0;
        let depositAmount = Number(this.depositAmount);
        if (this.isMulticurrencyAccount) {
            if (this.depositCurrSymbol === this.invFormData.accountDetails.currencySymbol) {
                depositAmount = depositAmount * this.exchangeRate;
            }
            depositAmount = depositAmount / this.exchangeRate || 0;
        }
        this.invFormData.entries.forEach(f => {
            count += f.transactions.reduce((pv, cv) => {
                return pv + cv.total;
            }, 0);
        });

        if (isNaN(count)) {
            count = 0;
        }

        if ((this.isAccountHaveAdvanceReceipts || this.isInvoiceAdjustedWithAdvanceReceipts) && this.adjustPaymentData.totalAdjustedAmount) {
            this.adjustPaymentBalanceDueData = this.getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment();
        } else {
            this.adjustPaymentBalanceDueData = 0;
        }
        this.invFormData.voucherDetails.balanceDue =
            giddhRoundOff((((count + this.invFormData.voucherDetails.tcsTotal + this.calculatedRoundOff) - this.invFormData.voucherDetails.tdsTotal) - depositAmount - Number(this.depositAmountAfterUpdate) - this.totalAdvanceReceiptsAdjustedAmount), this.giddhBalanceDecimalPlaces);
        if (this.isUpdateMode && this.isInvoiceAdjustedWithAdvanceReceipts && !this.adjustPaymentData.totalAdjustedAmount) {
            this.invFormData.voucherDetails.balanceDue =
                giddhRoundOff((((count + this.invFormData.voucherDetails.tcsTotal + this.calculatedRoundOff) - this.invFormData.voucherDetails.tdsTotal) - Number(this.depositAmountAfterUpdate) - this.totalAdvanceReceiptsAdjustedAmount), this.giddhBalanceDecimalPlaces);
        }
        this.invFormData.voucherDetails.convertedBalanceDue = giddhRoundOff(this.invFormData.voucherDetails.balanceDue * this.exchangeRate, this.giddhBalanceDecimalPlaces);
    }

    /**
     * Returns remaining due in company currency after adjustment with advance receipts
     *
     * @param {boolean} returnModValue True, if only absolute value is required
     * @returns {number} Balance due
     * @memberof VoucherComponent
     */
    public getConvertedBalanceDue(returnModValue?: boolean): number {
        const convertedBalanceDue = parseFloat(Number(
            this.grandTotalMulDum - this.adjustPaymentData.convertedTotalAdjustedAmount - Number((this.depositAmountAfterUpdate * this.exchangeRate).toFixed(this.giddhBalanceDecimalPlaces)) - this.invFormData.voucherDetails.tdsTotal).toFixed(this.giddhBalanceDecimalPlaces));
        return returnModValue ? Math.abs(convertedBalanceDue) : convertedBalanceDue;
    }

    public calculateSubTotal() {
        let count: number = 0;
        this.invFormData.entries.forEach(f => {
            count += f.transactions.reduce((pv, cv) => {
                return pv + Number(cv.amount);
            }, 0);
        });

        if (isNaN(count)) {
            count = 0;
        }
        this.invFormData.voucherDetails.subTotal = count;
    }

    /**
     * Updates the value of stocks in entries according to the changed ER (Exchange Rate)
     *
     * @memberof VoucherComponent
     */
    public updateStockEntries(): void {
        if (this.invFormData.entries && this.invFormData.entries.length) {
            this.invFormData.entries.forEach(entry => {
                const transaction = entry.transactions[0];
                if (transaction.isStockTxn) {
                    const rate = this.previousExchangeRate >= 1 ? transaction.rate * this.previousExchangeRate : Number((transaction.rate / this.previousExchangeRate).toFixed(this.highPrecisionRate));
                    transaction.rate = Number((rate / this.exchangeRate).toFixed(this.highPrecisionRate));
                    this.calculateStockEntryAmount(transaction);
                    this.calculateWhenTrxAltered(entry, transaction)
                } else {
                    this.calculateConvertedAmount(transaction);
                    this.calculateConvertedTotal(entry, transaction);
                }
            });
        }
    }

    /**
     * Updates the value of stocks in entries according to the changed ER (Exchange Rate)
     *
     * @memberof VoucherComponent
     */
    public exchangeRateChanged(): void {
        if (this.invFormData.entries && this.invFormData.entries.length) {
            this.invFormData.entries.forEach(entry => {
                const transaction = entry.transactions[0];
                if (transaction.isStockTxn) {
                    let rate = (transaction?.stockDetails?.rate) ? (transaction?.stockDetails?.rate) : transaction?.stockDetails?.unitRates[0]?.rate;
                    transaction.rate = Number((rate / this.exchangeRate).toFixed(this.highPrecisionRate));
                    this.calculateStockEntryAmount(transaction);
                    this.calculateWhenTrxAltered(entry, transaction)
                } else {
                    this.calculateConvertedAmount(transaction);
                    this.calculateConvertedTotal(entry, transaction);
                }
            });
            this.calculateBalanceDue();
        }
    }

    public calculateGrandTotal() {

        let calculatedGrandTotal = 0;
        calculatedGrandTotal = this.invFormData.voucherDetails.grandTotal = this.invFormData.entries.reduce((pv, cv) => {
            return pv + cv.transactions.reduce((pvt, cvt) => pvt + cvt.total, 0);
        }, 0);

        if (isNaN(calculatedGrandTotal)) {
            calculatedGrandTotal = 0;
        } else {
            calculatedGrandTotal = +calculatedGrandTotal;
        }

        //Save the Grand Total for Edit
        if (calculatedGrandTotal > 0) {
            if (this.applyRoundOff) {
                this.calculatedRoundOff = Number((Math.round(calculatedGrandTotal) - calculatedGrandTotal).toFixed(this.giddhBalanceDecimalPlaces));
            } else {
                this.calculatedRoundOff = Number((calculatedGrandTotal - calculatedGrandTotal).toFixed(this.giddhBalanceDecimalPlaces));
            }

            calculatedGrandTotal = Number((calculatedGrandTotal + this.calculatedRoundOff).toFixed(this.giddhBalanceDecimalPlaces));
        } else if (calculatedGrandTotal === 0) {
            this.calculatedRoundOff = 0;
        }
        this.invFormData.voucherDetails.grandTotal = calculatedGrandTotal;
        this.grandTotalMulDum = giddhRoundOff(calculatedGrandTotal * this.exchangeRate, this.giddhBalanceDecimalPlaces);
    }

    /**
     * To check invoice amount less with advance receipts adjusted amount then open Advane receipts adjust modal
     *
     * @memberof VoucherComponent
     */
    public isAdjustAdvanceReceiptModalOpen() {
        this.openAdjustPaymentModal();
    }

    public generateTotalAmount(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        forEach(txns, (txn: SalesTransactionItemClass) => {
            if (txn.quantity && txn.rate) {
                res += this.checkForInfinity(txn.rate) * this.checkForInfinity(txn.quantity);
            } else {
                res += Number(this.checkForInfinity(txn.amount));
            }
        });
        return res;
    }

    public generateTotalTaxAmount(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        forEach(txns, (txn: SalesTransactionItemClass) => {
            if (txn.total === 0) {
                res += 0;
            } else {
                res += this.checkForInfinity((txn.total - txn.taxableValue));
            }
        });
        return res;
    }

    /**
     * This will be use for on select any sales account or stock
     *
     * @param {*} selectedAcc
     * @param {SalesTransactionItemClass} txn
     * @param {SalesEntryClass} entry
     * @param {boolean} [isBulkItem=false]
     * @param {boolean} [isLinkedPoItem=false]
     * @param {number} entryIndex
     * @param {boolean} [fromBarcode=false]
     * @return {*}  {*}
     * @memberof VoucherComponent
     */
    public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass, entry: SalesEntryClass, isBulkItem: boolean = false, isLinkedPoItem: boolean = false, entryIndex: number, fromBarcode: boolean = false): any {
        if (this.isBarcodeMachineTyping) {
            this.removeTransaction(entryIndex);
            return;
        }

        if (!fromBarcode) {
            this.invFormData.entries[entryIndex] = entry;
            this.invFormData.entries[entryIndex].transactions[0] = txn;
        }
        if ((selectedAcc?.value || isBulkItem) && selectedAcc.additional && selectedAcc.additional?.uniqueName) {
            let params;
            if (selectedAcc.additional.stock) {
                params = {
                    stockUniqueName: selectedAcc.additional.stock?.uniqueName,
                    customerUniqueName: this.invFormData.accountDetails.uniqueName
                };
            }
            this.currentTxnRequestObject[this.activeIndx] = {
                selectedAcc: selectedAcc,
                isLinkedPoItem: isLinkedPoItem,
                txn: txn,
                entry: entry,
                params: params,
                entryIndex: entryIndex
            };

            if (fromBarcode) {
                this.currentTxnRequestObject[this.activeIndx].params.variantUniqueName = selectedAcc.additional?.stock?.variant?.uniqueName;
            }

            if (isBulkItem) {
                const allStockVariants = this.stockVariants.getValue();
                allStockVariants[this.activeIndx] = observableOf(selectedAcc.variants);
                this.stockVariants.next(allStockVariants);
                txn = this.calculateItemValues(selectedAcc, txn, entry, true, true);
            } else {
                if (selectedAcc.additional.stock) {
                    txn.isStockTxn = true;
                    this.loadStockVariants(selectedAcc.additional.stock.uniqueName, isLinkedPoItem ? entryIndex : undefined);
                    this.hasStock = true;
                } else {
                    this.loadDetails(this.currentTxnRequestObject[this.activeIndx]);
                }
            }
        } else {
            this.checkIfEntryHasStock();
            txn.isStockTxn = false;
            txn.amount = 0;
            txn.highPrecisionAmount = txn.amount;
            txn.accountName = null;
            txn.accountUniqueName = null;
            txn.hsnOrSac = 'sac';
            txn.total = null;
            txn.rate = null;
            txn.sacNumber = null;
            txn.sacNumberExists = false;
            txn.taxableValue = 0;
            txn.applicableTaxes = [];
            this.focusOnDescription();
            return txn;
        }
    }

    /**
     * Calculates the entry value
     *
     * @param {*} selectedAcc Currently selected account
     * @param {SalesTransactionItemClass} transaction Current transaction of entry
     * @param {SalesEntryClass} entry Entry
     * @param {boolean} calculateTransaction True, if calculation needs to be calculated
     * @param {boolean} isBulkItem True, if bulk item entry is entered
     * @returns {SalesTransactionItemClass} Returns the complete transaction instance
     * @memberof VoucherComponent
     */

    public calculateItemValues(
        selectedAcc: any,
        transaction: SalesTransactionItemClass,
        entry: SalesEntryClass,
        calculateTransaction: boolean = true,
        isBulkItem?: boolean,
        isLinkedPoItem?: boolean
    ): SalesTransactionItemClass {
        let o = cloneDeep(selectedAcc.additional);
        const variant = o.stock?.variant;
        let isInclusiveEntry = (variant?.purchaseTaxInclusive && o.category === 'expenses') || (variant?.salesTaxInclusive && o.category === 'income') || (variant?.fixedAssetTaxInclusive && o.category === 'fixedassets');

        transaction.taxInclusive = isInclusiveEntry;
        // check if we have quantity in additional object. it's for only bulk add mode
        transaction.quantity = o.quantity ? o.quantity : (o.stock) ? 1 : null;
        transaction.applicableTaxes = [];
        transaction.sku_and_customfields = null;

        // description with sku and custom fields
        if ((o.stock) && (this.isCashInvoice || this.isSalesInvoice || this.isPurchaseInvoice)) {
            let description = [];
            let skuCodeHeading = o.stock.skuCodeHeading ? o.stock.skuCodeHeading : this.commonLocaleData?.app_sku_code;
            if (o.stock.skuCode) {
                description.push(skuCodeHeading + ':' + o.stock.skuCode);
            }

            let customField1Heading = o.stock.customField1Heading ? o.stock.customField1Heading : this.localeData?.custom_field1;
            if (o.stock.customField1Value) {
                description.push(customField1Heading + ':' + o.stock.customField1Value);
            }

            let customField2Heading = o.stock.customField2Heading ? o.stock.customField2Heading : this.localeData?.custom_field2;
            if (o.stock.customField2Value) {
                description.push(customField2Heading + ':' + o.stock.customField2Value);
            }

            transaction.sku_and_customfields = description.join(', ');
        }
        //------------------------

        // assign taxes and create fluctuation
        if (o.stock && o.stock.taxes && o.stock.taxes.length) {
            o.stock.taxes.forEach(t => {
                let tax = this.companyTaxesList.find(f => f?.uniqueName === t);
                if (tax) {
                    switch (tax.taxType) {
                        case 'tcsrc':
                        case 'tcspay':
                        case 'tdsrc':
                        case 'tdspay':
                            entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                            entry.isOtherTaxApplicable = true;
                            break;
                        default:
                            transaction.applicableTaxes.push(t);
                            break;
                    }
                }
            });
        } else if (!entry.isOtherTaxApplicable && this.tcsTdsTaxesAccount && this.tcsTdsTaxesAccount.length) {
            entry.otherTaxModal.appliedOtherTax = this.tcsTdsTaxesAccount[this.tcsTdsTaxesAccount.length - 1];
            entry.isOtherTaxApplicable = true;
        } else {
            // assign taxes for non stock accounts
            if (isBulkItem) {
                transaction.applicableTaxes = o.stock?.groupTaxes ? o.stock?.groupTaxes : o.applicableTaxes;
            } else {
                transaction.applicableTaxes = o.applicableTaxes;
            }
        }

        transaction.accountName = o?.name;
        transaction.accountUniqueName = o?.uniqueName;

        if (o.stock) {
            // set rate auto
            transaction.rate = null;
            let obj: IStockUnit = {
                id: o.stock.stockUnitUniqueName,
                text: o.stock.stockUnitCode
            };
            transaction.stockList = [];
            /*
                From API, in get voucher API, unit rates are received within stock key.
                And in particular API, the unit rates are received within stock.variant key.
                This method is common for both the flows therefore we are searching the unitRates
                in both the keys
            */
            const unitRates = o.stock?.unitRates ?? o.stock?.variant?.unitRates ?? [];
            if (o.stock && unitRates.length) {
                transaction.stockList = this.prepareUnitArr(unitRates);
                transaction.stockUnit = transaction.stockList[0].id;
                transaction.stockUnitCode = transaction.stockList[0].text;
                if (!isInclusiveEntry) {
                    /* For inclusive entry we calculate the rate at the time of amount calculation,
                        this is done to avoid the fluctuation of rate from exclusive to inclusive
                    */
                    transaction.rate = Number((transaction.stockList[0].rate / this.exchangeRate).toFixed(this.highPrecisionRate));
                }
            } else {
                transaction.stockList.push(obj);
                transaction.stockUnit = o.stock.stockUnit.uniqueName;
                transaction.stockUnitCode = o.stock.stockUnit.code;
            }
            transaction.stockDetails = omit(o.stock, ['accountStockDetails', 'stockUnit']);
            transaction.isStockTxn = true;
            if (isBulkItem) {
                transaction.variant = selectedAcc.variant;
            } else if (isLinkedPoItem && this.isPoLinkingInProgress) {
                // Only re-assign the variant when user has added the linked PO entries with the current PB successfully, if the
                // addition is in progress then do nothing
                transaction.variant = o.stock.variant;
            }
            // Stock item, show the warehouse drop down if it is hidden
            if ((this.isMultiCurrencyModule()) && !this.shouldShowWarehouse) {
                this.shouldShowWarehouse = true;
                this.selectedWarehouse = String(this.defaultWarehouse);
                this.selectedWarehouseName = String(this.defaultWarehouseName);
            }
        } else {
            transaction.isStockTxn = false;
            transaction.stockUnit = null;
            transaction.stockUnitCode = null;
            transaction.stockDetails = null;
            transaction.stockList = [];
            // reset fields
            transaction.rate = null;
            transaction.quantity = null;
            transaction.amount = 0;
            transaction.highPrecisionAmount = transaction.amount;
            transaction.taxableValue = 0;
            transaction.variant = null;
            this.handleWarehouseVisibility();
        }
        transaction.sacNumber = null;
        transaction.sacNumberExists = false;
        transaction.hsnNumber = null;

        const matchedUnit = variant?.unitRates?.filter(ur => ur.stockUnitUniqueName === transaction.stockUnit);
        if (matchedUnit?.length && !entry['initiallyCall']) {
            transaction.rate = Number((matchedUnit[0].rate / this.exchangeRate).toFixed(this.highPrecisionRate));
            entry.discounts = entry.discounts.map(item => {
                item.isActive = false;
                return item;
            });
            entry.discounts[0].isActive = true;
            entry.discountFixedValueModal = 0;
            entry.discountPercentageModal = 0;
            entry.discountSum = 0;
            this.applyMrpDiscount(true, transaction, entry, false);
        }

        if (transaction.stockDetails?.hsnNumber && transaction.stockDetails?.sacNumber) {
            if (this.inventorySettings?.manageInventory) {
                transaction.hsnNumber = transaction.stockDetails.hsnNumber;
                transaction.hsnOrSac = 'hsn';
                transaction.showCodeType = "hsn";
            } else {
                transaction.sacNumber = transaction.stockDetails.sacNumber;
                transaction.sacNumberExists = true;
                transaction.hsnOrSac = 'sac';
                transaction.showCodeType = "sac";
            }
        } else if (transaction.stockDetails?.hsnNumber && !transaction.stockDetails?.sacNumber) {
            transaction.hsnNumber = transaction.stockDetails.hsnNumber;
            transaction.hsnOrSac = 'hsn';
            transaction.showCodeType = "hsn";
        } else if (transaction.stockDetails?.sacNumber && !transaction.stockDetails?.hsnNumber) {
            transaction.sacNumber = transaction.stockDetails.sacNumber;
            transaction.sacNumberExists = true;
            transaction.hsnOrSac = 'sac';
            transaction.showCodeType = "sac";
        } else if (!transaction.stockDetails?.sacNumber && !transaction.stockDetails?.hsnNumber) {
            if (this.inventorySettings?.manageInventory) {
                transaction.hsnNumber = "";
                transaction.hsnOrSac = 'hsn';
                transaction.showCodeType = "hsn";
            } else {
                transaction.sacNumber = "";
                transaction.sacNumberExists = true;
                transaction.hsnOrSac = 'sac';
                transaction.showCodeType = "sac";
            }
        }

        if (!transaction.hsnNumber && !transaction.sacNumber) {
            if (o.hsnNumber && o.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    transaction.hsnNumber = o.hsnNumber;
                    transaction.hsnOrSac = 'hsn';
                    transaction.showCodeType = "hsn";
                } else {
                    transaction.sacNumber = o.sacNumber;
                    transaction.sacNumberExists = true;
                    transaction.hsnOrSac = 'sac';
                    transaction.showCodeType = "sac";
                }
            } else if (o.hsnNumber && !o.sacNumber) {
                transaction.hsnNumber = o.hsnNumber;
                transaction.hsnOrSac = 'hsn';
                transaction.showCodeType = "hsn";
            } else if (!o.hsnNumber && o.sacNumber) {
                transaction.sacNumber = o.sacNumber;
                transaction.sacNumberExists = true;
                transaction.hsnOrSac = 'sac';
                transaction.showCodeType = "sac";
            } else if (!o.hsnNumber && !o.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    transaction.hsnNumber = "";
                    transaction.hsnOrSac = 'hsn';
                    transaction.showCodeType = "hsn";
                } else {
                    transaction.sacNumber = "";
                    transaction.sacNumberExists = true;
                    transaction.hsnOrSac = 'sac';
                    transaction.showCodeType = "sac";
                }
            }
        }

        this.focusOnDescription();

        if (calculateTransaction) {
            if (isInclusiveEntry) {
                setTimeout(() => {
                    if (!matchedUnit?.length || !matchedUnit[0].rate) {
                        transaction.rate = Number((transaction.stockList[0]?.rate / this.exchangeRate).toFixed(this.highPrecisionRate));
                    }
                    transaction.total = transaction.quantity * transaction.rate;
                    this.calculateTransactionValueInclusively(entry, transaction);
                });
            } else {
                this.calculateStockEntryAmount(transaction);
                this.calculateWhenTrxAltered(entry, transaction);
            }
        }

        this.checkIfEntryHasStock();

        if (!isBulkItem) {
            this.changeDetectorRef.detectChanges();
        }
        return transaction;
    }

    public onClearSalesAccount(txn: SalesTransactionItemClass) {
        txn.applicableTaxes = [];
        txn.quantity = null;
        txn.isStockTxn = false;
        txn.stockUnit = null;
        txn.stockUnitCode = null;
        txn.stockDetails = null;
        txn.stockList = [];
        txn.rate = null;
        txn.quantity = null;
        txn.amount = null;
        txn.highPrecisionAmount = txn.amount;
        txn.taxableValue = null;
        txn.sacNumber = null;
        txn.hsnNumber = null;
        txn.sacNumberExists = false;
    }

    public noResultsForCustomer(e: boolean): void {
        this.typeaheadNoResultsOfCustomer = e;
    }

    public onSelectCustomer(item: any): void {
        this.resetMobileNumberValidation();
        this.intl?.setNumber("");
        this.typeaheadNoResultsOfCustomer = false;
        this.referenceVouchersCurrentPage = 1;
        this.referenceVouchersTotalPages = 1;
        if (item && item?.value) {
            this.invFormData.voucherDetails.customerName = item.label;
            this.invFormData.voucherDetails.customerUniquename = item.value;
            this.getAccountDetails(item.value);
            if (this.invFormData.voucherDetails.customerUniquename && this.invFormData.voucherDetails.voucherDate && !(this.isProformaInvoice || this.isEstimateInvoice)) {
                this.getAllAdvanceReceipts(this.invFormData.voucherDetails.customerUniquename, this.invFormData.voucherDetails.voucherDate)
            }

            this.isCustomerSelected = true;
            this.invFormData.accountDetails.mobileNumber = this.intl?.getNumber();
            this.invFormData.accountDetails.name = '';
            if (item.additional) {
                this.customerAccount.email = item.additional.email;
            }

            if (this.selectedVoucherType === VoucherTypeEnum.creditNote || this.selectedVoucherType === VoucherTypeEnum.debitNote) {
                this.removeSelectedInvoice();
                this.getInvoiceListsForCreditNote();
            }
        }
        /** To reset advance receipt data */
        this.resetAdvanceReceiptAdjustData();
        this.clickAdjustAmount(false);
        if (this.isCustomerSelected) {
            this.toggleAccountSelectionDropdown(false);
        }
        if (this.isPurchaseInvoice) {
            this.fieldFilteredOptions = [];
            this.linkedPo = [];
            this.removePoItem();

            this.invFormData.entries?.forEach(entry => {
                entry.purchaseOrderItemMapping = null;
            });
        }
        this.pageLeaveUtilityService.addBrowserConfirmationDialog();
    }

    public onSelectBankCash(item: IOption) {
        if (item && item.value && this.invFormData.accountDetails) {
            this.invFormData.accountDetails.name = item.label;
            this.getAccountDetails(item.value);
        }
    }

    public getAccountDetails(accountUniqueName: string) {
        if (this.isPurchaseInvoice) {
            this.getVendorPurchaseOrders(accountUniqueName);
        }
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();

        setTimeout(() => {
            if (this.accountAsideMenuState === "out" && this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        }, 100);
    }

    public toggleRecurringAsidePane(toggle?: string): void {
        if (toggle) {
            if (toggle === 'out' && this.asideMenuStateForRecurringEntry !== 'out') {
                this.router.navigate(['/pages/proforma-invoice', 'invoice', 'sales']);
            }
            this.asideMenuStateForRecurringEntry = toggle;
        } else {
            this.asideMenuStateForRecurringEntry = this.asideMenuStateForRecurringEntry === 'out' ? 'in' : 'out';
        }
        this.toggleBodyClass();

        if (toggle === 'out') {
            this.showInvoicePending();
        }
    }

    public addBlankRow(txn: SalesTransactionItemClass) {
        if (!txn) {
            let entry: SalesEntryClass = new SalesEntryClass();
            let entryDiscounts = this.generalService.getDiscountValues({
                discountAccountsDetails: entry.discounts ?? [],
                discountsList: this.discountsList
            });
            entry.discounts = entryDiscounts;
            if (this.isUpdateMode) {
                entry.entryDate = this.invFormData.entries[0] ? this.invFormData.entries[0]?.entryDate : this.universalDate || new Date();
                if (typeof (entry.entryDate) === "object") {
                    entry.entryDate = dayjs(entry?.entryDate).format(GIDDH_DATE_FORMAT);
                } else {
                    entry.entryDate = dayjs(entry?.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                }
                entry.isNewEntryInUpdateMode = true;
            } else {
                if (typeof (this.invFormData.voucherDetails.voucherDate) === "object") {
                    entry.entryDate = dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
                } else {
                    entry.entryDate = dayjs(this.invFormData.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                }
            }
            this.invFormData.entries.push(entry);
        } else {
            // if transaction is valid then add new row else show toasty
            if (!txn.isValid()) {
                this.toaster.showSnackBar("warning", this.localeData?.no_product_error);
                return;
            }
            let entry: SalesEntryClass = new SalesEntryClass();
            let entryDiscounts = this.generalService.getDiscountValues({
                discountAccountsDetails: entry.discounts ?? [],
                discountsList: this.discountsList
            });
            entry.discounts = entryDiscounts;
            this.invFormData.entries.push(entry);
        }
        this.createEmbeddedViewAtIndex(this.invFormData.entries?.length - 1);
        this.activeIndx = (this.invFormData.entries && this.invFormData.entries.length) ? this.invFormData.entries.length - 1 : 0;
        setTimeout(() => {
            if (this.activeIndx > 0) {
                this.onSearchQueryChanged('', 1, 'item');
            }
            this.openProductDropdown();
        }, 200);
    }

    public removeTransaction(entryIdx: number) {
        if (this.activeIndx === entryIdx) {
            this.activeIndx = null;
        }
        if (this.container) {
            for (let index = entryIdx + 1; index < this.invFormData.entries?.length; index++) {
                const viewRef: any = this.container.get(index);
                if (viewRef) {
                    viewRef.context.entryIdx -= 1;
                }
            }
            this.container.remove(entryIdx);
        }
        this.invFormData.entries.splice(entryIdx, 1);
        this.calculateAffectedThingsFromOtherTaxChanges();
        if (!this.invFormData.entries || this.invFormData.entries?.length === 0) {
            this.addBlankRow(null);
        }
        this.handleWarehouseVisibility();
        const stockVariants = this.stockVariants.getValue();
        stockVariants.splice(entryIdx, 1);
        this.stockVariants.next(stockVariants);
        this.checkIfEntryHasStock();
    }

    public taxAmountEvent(txn: SalesTransactionItemClass, entry: SalesEntryClass) {
        txn.setAmount(entry);
        this.calculateBalanceDue();
    }

    public selectedDiscountEvent(txn: SalesTransactionItemClass, entry: SalesEntryClass) {
        // call taxableValue method
        txn.setAmount(entry);
        this.calculateBalanceDue();
    }

    public customMoveGroupFilter(term: string, item: IOption): boolean {
        let newItem = { ...item };
        if (!newItem.additional) {
            newItem.additional = { email: '', mobileNo: '' };
        } else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase()?.indexOf(term) > -1 || item?.value.toLocaleLowerCase()?.indexOf(term) > -1 || item.additional.email.toLocaleLowerCase()?.indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase()?.indexOf(term) > -1);
    }

    public closeDiscountPopup() {
        if (this.discountComponent) {
            this.discountComponent.forEach(disComp => {
                disComp.hideDiscountMenu();
            });
        }
    }

    public closeTaxControlPopup() {
        if (this.taxControlComponent) {
            this.taxControlComponent.forEach(taxComp => {
                taxComp.showTaxPopup = false;
            });
        }
    }

    public setActiveIndx(indx: number) {
        this.activeIndx = indx;
        try {
            if (this.isPurchaseInvoice && this.isRcmEntry) {
                this.invFormData.entries[indx].transactions[0]['requiredTax'] = false;
            }
        } catch (error) {
        }
    }

    public doAction(action: ActionTypeAfterVoucherGenerateOrUpdate) {
        this.actionAfterGenerateORUpdate = action;
    }

    public postResponseAction(voucherNo: string) {
        switch (this.actionAfterGenerateORUpdate) {

            case ActionTypeAfterVoucherGenerateOrUpdate.generate: {

                this.getAllLastInvoices();
                this.depositAccountUniqueName = '';
                this.depositAmount = 0;
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndClose: {
                this.router.navigate(['/pages', 'invoice', 'preview']);
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndPrint: {
                this.startLoader(false);
                this.dialog.open(this.printVoucherModal, {
                    width: '100%',
                    maxHeight: '80vh'
                });
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndSend: {
                this.startLoader(false);
                this.dialog.open(this.sendEmailModal, {
                    width: '650px'
                });
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess: {
                this.updateVoucherSuccess();
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndRecurring: {
                this.startLoader(false);
                this.toggleRecurringAsidePane("in");
                break;
            }
        }
    }

    /**
     * This will use for reset mobile number validations
     *
     * @memberof VoucherComponent
     */
    public resetMobileNumberValidation(): void {
        let input = document.getElementById('init-contact-proforma');
        const errorMsg = document.querySelector("#init-contact-proforma-error-msg");
        const validMsg = document.querySelector("#init-contact-proforma-valid-msg");
        input?.classList?.remove("error");
        if (errorMsg && validMsg) {
            errorMsg.innerHTML = "";
            errorMsg.classList.add("d-none");
            validMsg.classList.add("d-none");
        }
    }

    public resetCustomerName(event) {
        if (event) {
            if (!event?.value) {
                this.resetMobileNumberValidation();
                this.intl?.setNumber("");
                this.invFormData.voucherDetails.customerName = null;
                this.invFormData.voucherDetails.customerUniquename = null;
                this.isCustomerSelected = false;
                this.invFormData.accountDetails = new AccountDetailsClass();
                this.invFormData.accountDetails.uniqueName = 'cash';

                // if we are in update mode and someone changes customer name then we should reset the voucher details
                if (this.isUpdateMode) {
                    this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                }
            }
        } else {
            this.resetMobileNumberValidation();
            this.intl?.setNumber("");
            this.invFormData.voucherDetails.customerName = null;
            this.invFormData.voucherDetails.customerUniquename = null;
            this.invFormData.voucherDetails.tempCustomerName = null;
            this.isCustomerSelected = false;
            this.invFormData.accountDetails = new AccountDetailsClass();
            this.invFormData.accountDetails.uniqueName = 'cash';

            // if we are in update mode and someone changes customer name then we should reset the voucher details
            if (this.isUpdateMode) {
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            }
        }

        this.selectedPoItems = [];
        this.linkedPo = [];
        this.linkedPoNumbers = [];
        this.purchaseOrders = [];
    }

    public ngOnChanges(s: SimpleChanges) {
        if (s && s['isPurchaseInvoice'] && s['isPurchaseInvoice'].currentValue) {
            this.pageChanged(VoucherTypeEnum.purchase, this.commonLocaleData?.app_purchase);
            this.isSalesInvoice = false;

        }

        if ('accountUniqueName' in s && s.accountUniqueName.currentValue && (s.accountUniqueName.currentValue !== s.accountUniqueName.previousValue)) {
            this.isCashInvoice = s.accountUniqueName.currentValue === 'cash';
        }

    }

    public onSelectPaymentMode(event: any, isCleared: boolean = false) {
        if (this.isCashInvoice) {
            this.updateDepositAmount(0);
        }
        if (event && event.value && !isCleared) {
            if (this.isCashInvoice && this.invFormData.accountDetails) {
                this.invFormData.accountDetails.name = event.label;
                this.invFormData.accountDetails.uniqueName = event.value;
            }
            this.selectedBankAccount = event.label;
            this.selectPaymentValue = event.label;
            this.depositAccountUniqueName = event?.value;

            if (event.additional) {
                if (event.additional.additional) {
                    event.additional = event.additional.additional;
                }
                // If currency of item is null or undefined then treat it to be equivalent of company currency
                event.additional['currency'] = event.additional.currency || this.companyCurrency;
                // only for cash invoice
                // check if selected payment account currency is different then company currency
                // also get rates for selected account currency if it's multi-currency
                if (this.isCashInvoice) {
                    this.isMulticurrencyAccount = event.additional.currency.code !== this.companyCurrency;
                    if (this.isMulticurrencyAccount) {
                        this.getCurrencyRate(this.companyCurrency, event.additional && event.additional.currency ? event.additional.currency.code : '',
                            this.invFormData.voucherDetails.voucherDate);
                    }
                }
            }

            this.selectedPaymentMode = event;

            if (this.isMulticurrencyAccount) {
                if (this.isCashInvoice) {
                    this.invFormData.accountDetails.currencySymbol = event.additional?.currency.symbol || this.baseCurrencySymbol;
                    this.depositCurrSymbol = this.invFormData.accountDetails.currencySymbol;
                }
                if (this.isSalesInvoice || (this.voucherApiVersion === 2 && this.isPurchaseInvoice)) {

                    this.depositCurrSymbol = event.additional && event.additional?.currency.symbol || this.baseCurrencySymbol;
                }
            } else {
                this.invFormData.accountDetails.currencySymbol = this.baseCurrencySymbol;
            }

            if (this.isCashInvoice) {
                this.companyCurrencyName = event.additional?.currency.code;
            }
        } else {
            this.depositAccountUniqueName = '';
        }

        this.calculateBalanceDue();
    }

    public clickedInside($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();  // <- that will stop propagation on lower layers
    }

    @HostListener('document:click', ['$event'])
    public clickedOutside(event) {
        if (this.copyPreviousEstimate && this.copyPreviousEstimate.nativeElement && !this.copyPreviousEstimate.nativeElement.contains(event?.target)) {
            this.showLastEstimateModal = false;
        }
    }

    public prepareUnitArr(unitArr) {
        let unitArray = [];
        forEach(unitArr, (item) => {
            unitArray.push({ id: item.stockUnitUniqueName, text: item.stockUnitCode, rate: item.rate });
        });
        return unitArray;
    }

    public onChangeUnit(entry, txn, selectedUnit) {
        entry['initiallyCall'] = undefined;
        find(txn.stockList, (o) => {
            if (o.id === selectedUnit?.value) {
                txn.stockUnitCode = o.text;
                return txn.rate = giddhRoundOff(o.rate / this.exchangeRate, this.highPrecisionRate);
            }
        });
    }

    /**
     * Uploads attachment
     *
     * @memberof VoucherComponent
     */
    public uploadFile(): void {
        const selectedFile: any = document.getElementById("invoiceFile");
        this.selectedFileName = '';
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob, file) => {
                this.isFileUploading = true;
                this.selectedFileName = file.name;

                this.changeDetectorRef.detectChanges();

                this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isFileUploading = false;

                    if (response?.status === 'success') {
                        this.invFormData.entries[0].attachedFile = response.body?.uniqueName;
                        this.invFormData.entries[0].attachedFileName = response.body?.name;
                        this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.invFormData.entries[0].attachedFile = '';
                        this.invFormData.entries[0].attachedFileName = '';
                        this.toaster.showSnackBar("error", response.message);
                    }

                    this.changeDetectorRef.detectChanges();
                });
            });
        }
    }

    /**
     * Triggered when user clicks the 'Cancel' button of update flow
     *
     * @memberof VoucherComponent
     */
    public cancelUpdate(): void {
        this.openCustomerDropdown = false;
        if (this.callFromOutside) {
            this.location?.back();
        } else {
            if (this.invoiceForm) {
                this.resetInvoiceForm(this.invoiceForm);
                this.isUpdateMode = false;
            }
            this.cancelVoucherUpdate.emit(true);
        }
    }

    /**
     * Adds the bulk stock items
     *
     * @memberof VoucherComponent
     */
    public addBulkStockItems(items: SalesAddBulkStockItems[]) {
        const startIndex = this.invFormData.entries?.length;
        let isBlankItemPresent;
        this.isBulkEntryInProgress = true;
        this.ngZone.runOutsideAngular(() => {
            for (const item of items) {
                // add quantity to additional because we are using quantity from bulk modal so we have to pass it to onSelectSalesAccount
                item.additional['quantity'] = item.quantity;
                let lastIndex = -1;
                let blankItemIndex = this.invFormData.entries?.findIndex(f => !f.transactions[0].accountUniqueName);
                let isBlankItemInBetween;

                let entry = new SalesEntryClass();
                let entryDiscounts = this.generalService.getDiscountValues({
                    discountAccountsDetails: entry.discounts ?? [],
                    discountsList: this.discountsList
                });

                entry.discounts = entryDiscounts;

                if (blankItemIndex > -1) {
                    lastIndex = blankItemIndex;
                    this.invFormData.entries[lastIndex] = entry;
                    isBlankItemInBetween = true;
                    isBlankItemPresent = true;
                } else {
                    this.invFormData.entries.push(entry);
                    lastIndex = this.invFormData.entries?.length - 1;
                    isBlankItemInBetween = false;
                }

                this.activeIndx = lastIndex;
                if (typeof (this.invFormData.voucherDetails.voucherDate) === "object") {
                    this.invFormData.entries[lastIndex].entryDate = dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
                } else {
                    this.invFormData.entries[lastIndex].entryDate = this.invFormData.voucherDetails.voucherDate;
                }
                this.invFormData.entries[lastIndex].transactions[0].fakeAccForSelect2 = item?.uniqueName;
                this.invFormData.entries[lastIndex].isNewEntryInUpdateMode = true;
                if (isBlankItemInBetween) {
                    // Update the context of blank items found in between of list of entries
                    const viewRef: any = this.container.get(lastIndex);
                    if (viewRef) {
                        viewRef.context.$implicit = this.invFormData.entries[lastIndex];
                        viewRef.context.transaction = this.invFormData.entries[lastIndex].transactions[0];
                    }
                }
                this.onSelectSalesAccount(item, this.invFormData.entries[lastIndex].transactions[0], this.invFormData.entries[lastIndex], true, false, lastIndex);
            }
            this.isBulkEntryInProgress = false;
        });
        this.buildBulkData(this.invFormData.entries?.length, isBlankItemPresent ? 0 : startIndex, isBlankItemPresent);
    }

    public addNewSidebarAccount(item: AddAccountRequest) {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    public updateSidebarAccount(item: UpdateAccountRequest) {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    public addNewAccount() {
        this.isCreatingNewAccount = true;
        this.selectedCustomerForDetails = null;
        this.toggleAccountAsidePane();
    }

    public getCustomerDetails() {
        this.selectedCustomerForDetails = this.invFormData.accountDetails?.uniqueName;
        this.toggleAccountAsidePane();
    }

    public addAccountFromShortcut() {
        this.isCreatingNewAccount = true;
        this.toggleAccountSelectionDropdown(false);
        if (!this.isCustomerSelected) {
            this.selectedCustomerForDetails = null;
        }
        this.toggleAccountAsidePane();
    }

    /**
     * update invoice function
     * @param form
     */
    public submitUpdateForm(form: NgForm) {
        this.generateUpdateButtonClicked.next(form);
    }

    /**
     * Handles the update operation of invoice form
     *
     * @private
     * @param {NgForm} form Form instance for values
     * @memberof VoucherComponent
     */
    private handleUpdateInvoiceForm(form: NgForm): void {
        let requestObject: any = this.prepareDataForApi();
        if (!requestObject) {
            this.startLoader(false);
            return;
        }
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            let data = requestObject.voucher;
            let exRate = this.originalExchangeRate;
            let unqName = this.invoiceUniqueName || this.accountUniqueName;
            let salesEntryClassArray: SalesEntryClassMulticurrency[] = [];
            let entries = data.entries;
            entries.forEach(entry => {
                let salesEntryClass = new SalesEntryClassMulticurrency();
                salesEntryClass.voucherType = entry?.voucherType;
                salesEntryClass.uniqueName = entry?.uniqueName;
                salesEntryClass.description = entry.description;
                salesEntryClass.date = dayjs(entry?.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                let calculationMethod = (entry.otherTaxModal && entry.otherTaxModal.tcsCalculationMethod) ? entry.otherTaxModal.tcsCalculationMethod : "";
                entry.taxList.forEach(t => {
                    salesEntryClass.taxes.push({ uniqueName: t, calculationMethod: calculationMethod });
                });
                entry.transactions.forEach(tr => {
                    let transactionClassMul = new TransactionClassMulticurrency();
                    transactionClassMul.account.uniqueName = tr.accountUniqueName;
                    transactionClassMul.account.name = tr.accountName;
                    transactionClassMul.amount.amountForAccount = tr.amount;
                    salesEntryClass.hsnNumber = tr.hsnNumber;
                    salesEntryClass.sacNumber = tr.sacNumber;
                    salesEntryClass.description = tr.description;
                    if (tr.isStockTxn) {
                        let salesAddBulkStockItems = new SalesAddBulkStockItems();
                        salesAddBulkStockItems.name = tr.stockDetails?.name;
                        salesAddBulkStockItems.uniqueName = tr.stockDetails?.uniqueName;
                        salesAddBulkStockItems.quantity = tr.quantity;
                        salesAddBulkStockItems.rate = {};
                        salesAddBulkStockItems.rate.amountForAccount = tr.rate;
                        salesAddBulkStockItems.sku = tr.stockDetails.skuCode;
                        salesAddBulkStockItems.stockUnit = new CodeStockMulticurrency();
                        salesAddBulkStockItems.stockUnitCode = tr.stockUnitCode;
                        salesAddBulkStockItems.stockUnit.uniqueName = tr.stockUnit;
                        salesAddBulkStockItems.variant = tr.variant;
                        salesAddBulkStockItems.taxInclusive = tr.taxInclusive;

                        transactionClassMul.stock = salesAddBulkStockItems;
                    }
                    salesEntryClass.transactions.push(transactionClassMul);
                });
                entry.discounts.forEach(ds => {
                    if (!ds.discountValue) {
                        ds.discountValue = 0;
                    }
                    salesEntryClass.discounts.push(new DiscountMulticurrency(ds));
                });

                salesEntryClassArray.push(salesEntryClass);
            });
            requestObject = {
                account: data.accountDetails,
                updateAccountDetails: this.updateAccount,
                entries: salesEntryClassArray,
                date: this.convertDateForAPI(data.voucherDetails.voucherDate),
                type: VoucherTypeEnum.sales,
                exchangeRate: exRate,
                dueDate: data.voucherDetails.dueDate,
                number: this.invoiceNo,
                uniqueName: unqName,
                roundOffApplicable: this.applyRoundOff,
                templateDetails: data.templateDetails
            } as GenericRequestForGenerateSCD;

            if (!requestObject.voucherDetails) {
                requestObject.voucherDetails = {};
            }
            if (!requestObject.accountDetails) {
                requestObject.accountDetails = {};
            }

            requestObject.voucherDetails.voucherType = this.voucherUtilityService.parseVoucherType(this.invoiceType);
            requestObject.accountDetails.uniqueName = requestObject.account?.uniqueName;

            if (this.voucherApiVersion === 2) {
                requestObject = this.voucherUtilityService.cleanObject(requestObject);
            }

            this.store.dispatch(this.proformaActions.updateProforma(requestObject));
        } else {
            let data = requestObject.voucher;
            let exRate = this.originalExchangeRate;
            let unqName = this.invoiceUniqueName || this.accountUniqueName;
            // sales and cash invoice uses v4 api so need to parse main object to regarding that
            if (this.isSalesInvoice || this.isCashInvoice || this.isCreditNote || this.isDebitNote) {
                if (this.isRcmEntry && !this.validateTaxes(cloneDeep(data))) {
                    this.startLoader(false);
                    return;
                }
                data.accountDetails.mobileNumber = this.intl?.getNumber();
                const deposit = this.getDeposit();
                requestObject = {
                    account: data.accountDetails,
                    updateAccountDetails: this.updateAccount,
                    voucher: data,
                    entries: [],
                    date: data.voucherDetails.voucherDate,
                    type: this.voucherUtilityService.parseVoucherType(this.invoiceType),
                    exchangeRate: exRate,
                    dueDate: data.voucherDetails.dueDate,
                    number: (this.isPurchaseInvoice) ? this.invFormData.voucherDetails.voucherNumber : this.invoiceNo,
                    uniqueName: unqName,
                    roundOffApplicable: this.applyRoundOff,
                    subVoucher: (this.isRcmEntry) ? SubVoucher.ReverseCharge : undefined,
                    attachedFiles: (this.invFormData.entries[0] && this.invFormData.entries[0].attachedFile) ? [this.invFormData.entries[0].attachedFile] : [],
                    deposit
                } as GenericRequestForGenerateSCD;
                if (this.isCreditNote || this.isDebitNote) {
                    requestObject['invoiceNumberAgainstVoucher'] = this.invFormData.voucherDetails.voucherNumber;
                }
                if (((this.isCreditNote || this.isDebitNote) && this.selectedInvoice) || this.isSalesInvoice) {
                    if (this.isSalesInvoice) {
                        if (this.voucherApiVersion === 2) {
                            requestObject['referenceVoucher'] = cloneDeep(this.invFormData?.voucherDetails?.referenceVoucher);
                        } else {
                            requestObject['invoiceLinkingRequest'] = cloneDeep(this.invFormData?.voucherDetails?.invoiceLinkingRequest);
                        }
                    } else {
                        const selectedLinkedVoucherType = this.invoiceList.find(invoice => invoice?.value === this.selectedInvoice);
                        if (this.voucherApiVersion === 2) {
                            requestObject['referenceVoucher'] = {
                                uniqueName: this.selectedInvoice,
                                voucherType: selectedLinkedVoucherType && selectedLinkedVoucherType.additional ?
                                    selectedLinkedVoucherType.additiona?.voucherType : 'sales'
                            };
                        } else {
                            requestObject['invoiceLinkingRequest'] = {
                                linkedInvoices: [{
                                    invoiceUniqueName: this.selectedInvoice,
                                    voucherType: selectedLinkedVoucherType && selectedLinkedVoucherType.additional ?
                                        selectedLinkedVoucherType.additional?.voucherType : 'sales'
                                }]
                            };
                        }
                    }
                }

                /** Tourist scheme is applicable only for voucher type 'sales invoice' and 'cash invoice' and company country code 'AE'   */
                if (this.isSalesInvoice || this.isCashInvoice) {
                    if (this.invFormData.touristSchemeApplicable) {
                        requestObject.touristSchemeApplicable = this.invFormData.touristSchemeApplicable;
                        requestObject.passportNumber = this.invFormData.passportNumber;
                    }
                }
                /** Advance receipts adjustment for sales invoice or if other voucher adjustments then send the data as is */
                if (this.isSalesInvoice || this.advanceReceiptAdjustmentData) {
                    if (!this.advanceReceiptAdjustmentData) {
                        this.advanceReceiptAdjustmentData.adjustments = [];
                    } else if (this.isSalesInvoice) {
                        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
                            this.advanceReceiptAdjustmentData.adjustments.forEach(adjustment => {
                                delete adjustment.balanceDue;
                            });
                        }
                    }
                    requestObject.voucherAdjustments = this.advanceReceiptAdjustmentData;
                    if (this.voucherApiVersion === 2) {
                        requestObject = this.adjustmentUtilityService.getAdjustmentObjectVoucherModule(requestObject);
                    }
                }
                let updatedData = <GenericRequestForGenerateSCD>this.updateData(requestObject, requestObject.voucher);
                if (this.voucherApiVersion === 2) {
                    updatedData = this.voucherUtilityService.getVoucherRequestObjectForInvoice(updatedData);
                    updatedData = this.voucherUtilityService.cleanObject(updatedData);
                }
                let updatedNewData = this.deleteUnusedVoucherUpdateObjectKey(updatedData);

                this.salesService.updateVoucherV4(updatedNewData).pipe(takeUntil(this.destroyed$))
                    .subscribe((response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD>) => {
                        this.actionsAfterVoucherUpdate(response, form);
                    }, (err) => {
                        this.startLoader(false);
                        this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
                    });
            } else if (this.isPurchaseInvoice) {
                if (this.isRcmEntry && !this.validateTaxes(cloneDeep(data))) {
                    this.openAccountSelectionDropdown?.closeDropdownPanel();
                    this.openCustomerDropdown = false;
                    this.startLoader(false);
                    return;
                }

                let purchaseOrders = [];

                if (this.selectedPoItems && this.selectedPoItems.length > 0) {
                    this.selectedPoItems.forEach(order => {
                        purchaseOrders.push({ name: this.linkedPoNumbers[order]?.voucherNumber, uniqueName: order });
                    });
                }

                requestObject = {
                    account: data.accountDetails,
                    number: this.invFormData.voucherDetails.voucherNumber,
                    entries: data.entries,
                    date: data.voucherDetails.voucherDate,
                    dueDate: data.voucherDetails.dueDate,
                    exchangeRate: exRate,
                    type: this.invoiceType,
                    attachedFiles: (this.invFormData.entries[0]?.attachedFile) ? [this.invFormData.entries[0]?.attachedFile] : [],
                    templateDetails: data.templateDetails,
                    uniqueName: (this.selectedItem) ? this.selectedItem.uniqueName : (this.matchingPurchaseRecord) ? this.matchingPurchaseRecord.uniqueName : '',
                    subVoucher: (this.isRcmEntry) ? SubVoucher.ReverseCharge : undefined,
                    purchaseOrders: purchaseOrders,
                    company: this.purchaseBillCompany
                } as PurchaseRecordRequest;
                if (this.voucherApiVersion === 2) {
                    requestObject = <GenericRequestForGenerateSCD>this.updateData(requestObject, data);
                    requestObject = this.voucherUtilityService.getVoucherRequestObjectForInvoice(requestObject);
                } else {
                    requestObject = this.updateData(requestObject, data);
                }
                if (this.advanceReceiptAdjustmentData) {
                    requestObject.voucherAdjustments = this.advanceReceiptAdjustmentData;
                }
                if (this.voucherApiVersion === 2) {
                    requestObject = this.adjustmentUtilityService.getAdjustmentObjectVoucherModule(requestObject);
                    requestObject = this.voucherUtilityService.cleanObject(requestObject);
                }
                this.generatePurchaseRecord(requestObject);
            } else {
                if (this.voucherApiVersion === 2) {
                    requestObject = this.voucherUtilityService.cleanObject(requestObject);
                }
                requestObject = this.deleteUnusedVoucherUpdateObjectKey(requestObject);
                this.salesService.updateVoucher(requestObject).pipe(takeUntil(this.destroyed$))
                    .subscribe((response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD>) => {
                        this.actionsAfterVoucherUpdate(response, form);
                    }, (err) => {
                        this.startLoader(false);
                        this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
                    });
            }
        }
    }

    /**
     * This will delete key of unused in voucher object
     *
     * @param {*} data
     * @return {*}  {void}
     * @memberof VoucherComponent
     */
    public deleteUnusedVoucherUpdateObjectKey(data: any): void {
        if (this.showGSTINNo) {
            if (data?.account) {
                delete data.account?.billingDetails?.county;
                delete data.account?.shippingDetails?.county;
            }
            if (data?.accountDetails) {
                delete data.accountDetails?.billingDetails?.county;
                delete data.accountDetails?.shippingDetails?.county;
            }

            if (data?.company) {
                delete data.company?.billingDetails?.county;
                delete data.company?.shippingDetails?.county;
            }
            if (data?.companyDetails) {
                delete data.companyDetails?.billingDetails?.county;
                delete data.companyDetails?.shippingDetails?.county;
            }
        }
        if (this.showVATNo) {
            if (data?.account) {
                delete data.account?.billingDetails?.state;
                delete data.account?.billingDetails?.stateCode;
                delete data.account?.billingDetails?.stateName;
                delete data.account?.billingDetails?.gstNumber;

                delete data.account?.shippingDetails?.state;
                delete data.account?.shippingDetails?.stateCode;
                delete data.account?.shippingDetails?.stateName;
                delete data.account?.shippingDetails?.gstNumber;
            }
            if (data?.accountDetails) {
                delete data.accountDetails?.billingDetails?.state;
                delete data.accountDetails?.billingDetails?.stateCode;
                delete data.accountDetails?.billingDetails?.stateName;
                delete data.accountDetails?.billingDetails?.gstNumber;

                delete data.accountDetails?.shippingDetails?.state;
                delete data.accountDetails?.shippingDetails?.stateCode;
                delete data.accountDetails?.shippingDetails?.stateName;
                delete data.accountDetails?.shippingDetails?.gstNumber;
            }

            if (data?.company) {
                delete data.company?.billingDetails?.state;
                delete data.company?.billingDetails?.stateCode;
                delete data.company?.billingDetails?.stateName;
                delete data.company?.billingDetails?.gstNumber;

                delete data.company?.shippingDetails?.state;
                delete data.company?.shippingDetails?.stateCode;
                delete data.company?.shippingDetails?.stateName;
                delete data.company?.shippingDetails?.gstNumber;
            }
            if (data?.companyDetails) {
                delete data.companyDetails?.billingDetails?.state;
                delete data.companyDetails?.billingDetails?.stateCode;
                delete data.companyDetails?.billingDetails?.stateName;
                delete data.companyDetails?.billingDetails?.gstNumber;

                delete data.companyDetails?.shippingDetails?.state;
                delete data.companyDetails?.shippingDetails?.stateCode;
                delete data.companyDetails?.shippingDetails?.stateName;
                delete data.companyDetails?.shippingDetails?.gstNumber;
            }
        }
        return data;
    }

    /**
     * used for re-sating invoice form as well as showing appropriate toaster
     * and performing post update actions
     * thing after sales/ cash or credit / debit note voucher updates
     * @param response
     * @param form
     */
    private actionsAfterVoucherUpdate(response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD> | BaseResponse<any, PurchaseRecordRequest>, form: NgForm) {
        if (response?.status === 'success' && response?.body) {
            // To clear receipts voucher store
            if (this.isSalesInvoice || this.isCashInvoice) {
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            }
            // reset form and other
            this.resetInvoiceForm(form);
            this.toaster.showSnackBar("success", this.localeData?.voucher_updated);
            this.store.dispatch(this.invoiceReceiptActions.updateVoucherDetailsAfterVoucherUpdate(response));
            this.voucherNumber = response.body.number;
            this.invoiceNo = this.voucherNumber;
            this.doAction(ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess);
            this.postResponseAction(this.invoiceNo);
            if (this.isPurchaseInvoice) {
                this.store.dispatch(this.purchaseRecordAction.getUpdatePurchaseRecordSuccessAction(
                    {
                        invoiceNumber: response.body?.number,
                        purchaseRecordUniqueName: response.body?.uniqueName,
                        mergedRecordUniqueName: (this.matchingPurchaseRecord) ? this.matchingPurchaseRecord.uniqueName : ''
                    }));
            }
            this.depositAccountUniqueName = '';
            this.depositAmount = 0;
            this.isUpdateMode = false;

            if (this.callFromOutside) {
                this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(null, null));
                this.store.dispatch(this.gstAction.resetGstr3BOverViewResponse());
                this.location?.back();
            }
        } else {
            this.advanceReceiptAdjustmentData = this.adjustmentUtilityService.getVoucherAdjustmentObject(this.advanceReceiptAdjustmentData, this.selectedVoucherType);
            this.startLoader(false);
            this.toaster.showSnackBar("error", response?.message, response?.code);
        }
        this.updateAccount = false;
    }

    public prepareDataForApi(): GenericRequestForGenerateSCD | PurchaseRecordRequest {
        let data: VoucherClass = cloneDeep(this.invFormData);

        // special check if gst no filed is visible then and only then check for gst validation
        if (data.accountDetails.billingDetails.gstNumber && this.showGSTINNo) {
            this.checkGstNumValidation(data.accountDetails.billingDetails.gstNumber, this.localeData?.billing_address);
            if (!this.isValidGstinNumber) {
                this.startLoader(false);
                return;
            }
        }
        if (data.accountDetails.shippingDetails.gstNumber && !this.autoFillShipping) {
            this.checkGstNumValidation(data.accountDetails.shippingDetails.gstNumber, this.localeData?.shipping_address);
            if (!this.isValidGstinNumber) {
                this.startLoader(false);
                return;
            }
        }

        if (this.isSalesInvoice || this.isPurchaseInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
            if (dayjs(data.voucherDetails.dueDate, GIDDH_DATE_FORMAT).isBefore(dayjs(data.voucherDetails.voucherDate, GIDDH_DATE_FORMAT), 'd')) {
                this.startLoader(false);
                this.showLoader = false;
                let dateText = this.commonLocaleData?.app_invoice;

                if (this.isProformaInvoice) {
                    dateText = this.localeData?.invoice_types?.proforma;
                }

                if (this.isEstimateInvoice) {
                    dateText = this.localeData?.invoice_types?.estimate;
                }

                let dueDateError = this.localeData?.due_date_error;
                dueDateError = dueDateError?.replace("[INVOICE_TYPE]", dateText);
                this.toaster.showSnackBar("error", dueDateError);
                return;
            }
        } else {
            delete data.voucherDetails.dueDate;
        }

        data.entries = data.entries?.filter((entry, indx) => {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });

        data.entries = data.entries.map(entry => {
            // filter active discounts
            entry.discounts = entry.discounts?.filter(dis => dis.isActive);

            // filter active taxes
            entry.taxes = entry.taxes?.filter(tax => tax.isChecked);
            return entry;
        });
        let txnErr: boolean;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails?.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this.toaster.showSnackBar("warning", this.localeData?.no_account_error);
                } else {
                    this.toaster.showSnackBar("warning", this.localeData?.no_customer_error);
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
                    this.toaster.showSnackBar("warning", this.localeData?.invalid_email);
                    return;
                }
            }
        }

        // replace /n to br for (shipping and billing)

        if (data?.accountDetails?.shippingDetails?.address?.length && data?.accountDetails?.shippingDetails?.address[0]?.length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0]?.trim();
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0]?.replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0]?.split('<br />');
        }
        if (data?.accountDetails?.billingDetails?.address?.length && data?.accountDetails?.billingDetails?.address[0]?.length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0]?.trim();
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0]?.replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0]?.split('<br />');
        }

        // convert date object
        data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);

        if (this.isProformaInvoice || this.isEstimateInvoice) {
            if (data.accountDetails && data.accountDetails.billingDetails && data.accountDetails.billingDetails.state) {
                data.accountDetails.billingDetails.stateCode = data.accountDetails.billingDetails.state.code;
            }
            if (data.accountDetails && data.accountDetails.shippingDetails && data.accountDetails.shippingDetails.state) {
                data.accountDetails.shippingDetails.stateCode = data.accountDetails.shippingDetails.state.code;
            }
        }

        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

        // check for valid entries and transactions
        if (data.entries) {
            data.entries.forEach((entry) => {
                entry.transactions.forEach((txn: SalesTransactionItemClass) => {
                    // convert date object
                    entry.entryDate = dayjs(entry?.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

                    // allowing below block of code for pending voucher to create because no need # in caseof pending voucher
                    if (this.isUpdateMode || this.isPendingVoucherType) {
                        // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess
                        if (txn.stockList && txn.stockList.length) {
                            txn.accountUniqueName = txn.accountUniqueName?.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName?.indexOf('#')) : txn.accountUniqueName;
                            txn.fakeAccForSelect2 = txn.accountUniqueName?.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2?.indexOf('#')) : txn.fakeAccForSelect2;
                        }
                    }

                    if (this.isPurchaseInvoice && this.selectedPoItems && this.selectedPoItems.length > 0) {
                        txn.accountUniqueName = txn.accountUniqueName?.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName?.indexOf('#')) : txn.accountUniqueName;

                        if (txn.stockDetails && !txn.stockDetails.uniqueName && txn.stockDetails.stock && txn.stockDetails.stock.uniqueName) {
                            txn.stockDetails.uniqueName = txn.stockDetails.stock.uniqueName;
                        }
                    }

                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        this.toaster.showSnackBar("warning", this.localeData?.no_product_error);
                        txnErr = true;
                        return false;
                    } else {
                        txnErr = false;
                    }
                });
            });
        } else {
            this.toaster.showSnackBar("warning", this.localeData?.no_entry_error);
            return;
        }

        // if txn has errors
        if (txnErr) {
            return null;
        }
        // set voucher type
        data.entries = data.entries.map((entry) => {
            entry.voucherType = this.voucherUtilityService.parseVoucherType(this.invoiceType);
            entry.taxList = entry.taxes.map(m => m?.uniqueName);
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;

            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax?.uniqueName);
            }
            return entry;
        });

        let obj: GenericRequestForGenerateSCD = {
            voucher: data,
            updateAccountDetails: this.updateAccount
        };

        if (this.isUpdateMode) {
            obj.entryUniqueNames = data.entries.map(m => m?.uniqueName);
        }

        if (this.depositAmount && this.depositAmount > 0) {
            obj.paymentAction = {
                amount: Number(this.depositAmount) + this.depositAmountAfterUpdate
            };
            if (this.isCustomerSelected) {
                obj.depositAccountUniqueName = this.depositAccountUniqueName;
            } else {
                obj.depositAccountUniqueName = data.accountDetails?.uniqueName;
            }
        } else {
            obj.depositAccountUniqueName = '';
        }
        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.voucherUtilityService.parseVoucherType(this.invoiceType);
        return obj;
    }

    public getAllLastInvoices() {
        let invoiceType = this.getVoucherType(this.invoiceType);
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            let filterRequest: ProformaFilter = new ProformaFilter();
            filterRequest.sortBy = this.isProformaInvoice ? 'proformaDate' : 'estimateDate';
            filterRequest.sort = 'desc';
            filterRequest.count = 5;
            filterRequest.isLastInvoicesRequest = true;
            this.store.dispatch(this.proformaActions.getAll(filterRequest, this.isProformaInvoice ? 'proformas' : 'estimates'));
        } else if (!this.isPurchaseInvoice) {
            let request: InvoiceReceiptFilter = new InvoiceReceiptFilter();
            request.sortBy = 'voucherDate';
            request.sort = 'desc';
            request.count = 5;
            request.isLastInvoicesRequest = true;
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.voucherUtilityService.parseVoucherType(invoiceType)));
        }
    }

    public getLastInvoiceDetails(obj: { accountUniqueName: string, invoiceNo: string, uniqueName?: string }) {
        this.accountUniqueName = obj.accountUniqueName;

        this.invoiceNo = obj.invoiceNo;
        this.voucherUniqueName = obj?.uniqueName
        this.isLastInvoiceCopied = true;
        this.showLastEstimateModal = false;
        this.getVoucherDetailsFromInputs();
        this.resetAdvanceReceiptAdjustData();
        this.clickAdjustAmount(false);
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal, entryObj?: SalesEntryClass) {
        let entry: SalesEntryClass;
        entry = entryObj ? entryObj : this.invFormData.entries[this.activeIndx];
        let taxableValue = 0;
        let totalTaxes = 0;

        if (!entry) {
            return;
        }
        if (modal && modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            let tax = this.companyTaxesList.find(ct => ct?.uniqueName === modal.appliedOtherTax.uniqueName);
            if ((!modal.appliedOtherTax || !modal.appliedOtherTax?.name) && entry.otherTaxModal && entry.otherTaxModal.appliedOtherTax) {
                entry.otherTaxModal.appliedOtherTax.name = tax?.name;
            }
            if (['tcsrc', 'tcspay'].includes(tax?.taxType)) {
                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                    taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                    taxableValue = (rawAmount + entry.taxSum + entry.cessSum);
                }
                entry.otherTaxType = 'tcs';
            } else {
                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                    taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                    taxableValue = (rawAmount + entry.taxSum + entry.cessSum);
                }
                entry.otherTaxType = 'tds';
            }

            totalTaxes += tax?.taxDetail[0]?.taxValue;

            entry.otherTaxSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), this.highPrecisionRate);
            entry.otherTaxModal = modal;
        } else {
            entry.otherTaxType = undefined;
            entry.otherTaxSum = 0;
            entry.isOtherTaxApplicable = false;
            entry.otherTaxModal = new SalesOtherTaxesModal();
            entry.tcsTaxList = [];
            entry.tdsTaxList = [];
        }
        if (this.activeIndx !== undefined && this.activeIndx !== null && !entryObj) {
            this.invFormData.entries = cloneDeep(this.entriesListBeforeTax);
            this.invFormData.entries[this.activeIndx] = entry;
        }
    }

    public calculateAffectedThingsFromOtherTaxChanges() {
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateTcsTdsTotal();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
        this.checkVoucherEntries();
    }

    public sendEmail(request: string | { email: string, invoiceType: string[] }) {
        if (this.isEstimateInvoice || this.isProformaInvoice) {
            let req: ProformaGetRequest = new ProformaGetRequest();

            req.accountUniqueName = this.accountUniqueName;

            if (this.isProformaInvoice) {
                req.proformaNumber = this.invoiceNo;
            } else {
                req.estimateNumber = this.invoiceNo;
            }
            req.emailId = (request as string).split(',');
            this.store.dispatch(this.proformaActions.sendMail(req, this.invoiceType));
        } else {
            request = request as { email: string, invoiceType: string[] };

            if (this.voucherApiVersion === 2) {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.accountUniqueName, {
                    email: { to: request.email.split(',') },
                    voucherType: this.invoiceType,
                    copyTypes: request.invoiceType ? request.invoiceType : [],
                    uniqueName: this.newVoucherUniqueName
                }));
            } else {
                this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.accountUniqueName, {
                    emailId: request.email.split(','),
                    voucherNumber: [this.invoiceNo],
                    voucherType: this.invoiceType,
                    typeOfInvoice: request.invoiceType ? request.invoiceType : [],
                    uniqueName: undefined
                }));
            }
        }
        this.cancelEmailModal();
    }

    /**
     * This will use for cancel email modal
     *
     * @memberof VoucherComponent
     */
    public cancelEmailModal(): void {
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.newVoucherUniqueName = '';
        this.dialog.closeAll();
        this.showInvoicePending();
    }

    /**
     * This will use for cancel print modal
     *
     * @memberof VoucherComponent
     */
    public cancelPrintModal(): void {
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.newVoucherUniqueName = '';
        this.dialog.closeAll();
        this.showInvoicePending();
    }

    private getVoucherDetailsFromInputs() {
        let invoiceType = this.getVoucherType(this.invoiceType);
        if (!this.isLastInvoiceCopied) {
            this.getAccountDetails(this.accountUniqueName);
        }

        this.isUpdateMode = !this.isLastInvoiceCopied;

        // add fixed class to body because double scroll showing in invoice update mode
        if (this.isUpdateMode) {
            document.querySelector('body').classList.add('fixed');
        }

        this.isUpdateDataInProcess = true;

        this.prepareInvoiceTypeFlags();
        this.toggleFieldForSales = (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.creditNote));

        if (!this.isProformaInvoice && !this.isEstimateInvoice) {
            if (this.isSalesInvoice || this.isCashInvoice || this.isCreditNote || this.isDebitNote) {
                this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.accountUniqueName, {
                    invoiceNumber: this.invoiceNo,
                    voucherType: this.voucherUtilityService.parseVoucherType(invoiceType),
                    uniqueName: (this.voucherApiVersion === 2) ? (this.selectedItem?.uniqueName || this.voucherUniqueName) : undefined
                }));
            } else if (this.isPurchaseInvoice) {
                const accountUniqueName = (this.selectedItem) ? this.selectedItem.account?.uniqueName : this.accountUniqueName;
                const purchaseRecordUniqueName = this.selectedItem?.uniqueName || this.voucherUniqueName || this.invoiceNo;
                if (this.voucherApiVersion === 2) {
                    this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.accountUniqueName, {
                        invoiceNumber: this.selectedItem?.voucherNumber,
                        voucherType: this.voucherUtilityService.parseVoucherType(invoiceType),
                        uniqueName: purchaseRecordUniqueName
                    }));
                } else {
                    this.store.dispatch(this.invoiceReceiptActions.GetPurchaseRecordDetails(accountUniqueName, purchaseRecordUniqueName));
                }
            } else {
                this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(this.accountUniqueName, {
                    invoiceNumber: this.invoiceNo,
                    voucherType: this.voucherUtilityService.parseVoucherType(invoiceType)
                }));
            }
        } else {
            let obj: ProformaGetRequest = new ProformaGetRequest();
            obj.accountUniqueName = this.accountUniqueName;
            if (this.isProformaInvoice) {
                obj.proformaNumber = this.invoiceNo;
            } else {
                obj.estimateNumber = this.invoiceNo;
            }
            this.store.dispatch(this.proformaActions.getProformaDetails(obj, this.invoiceType));
        }
    }

    private parseEntriesFromResponse(entries: SalesEntryClass[]) {
        return entries.map((entry, index) => {
            this.activeIndx = index;
            if (!entry.otherTaxModal) {
                entry.otherTaxModal = new SalesOtherTaxesModal();
            }
            entry.entryDate = entry?.entryDate || this.universalDate || dayjs().format(GIDDH_DATE_FORMAT);

            if (typeof (entry?.entryDate) === "object") {
                entry.entryDate = dayjs(entry?.entryDate).format(GIDDH_DATE_FORMAT);
            } else {
                entry.entryDate = entry?.entryDate;
            }

            entry.discounts = this.parseDiscountFromResponse(entry);
            entry.taxList = entry.taxes.map(m => m?.uniqueName);

            entry.transactions = entry.transactions.map(trx => {
                entry.otherTaxModal.itemLabel = trx.stockDetails?.name ? trx.accountName + '(' + trx.stockDetails?.name + ')' : trx.accountName;
                let newTrxObj: SalesTransactionItemClass = new SalesTransactionItemClass();

                newTrxObj.accountName = trx.accountName;
                newTrxObj.amount = trx.amount;
                newTrxObj.highPrecisionAmount = trx.amount;
                newTrxObj.description = trx.description;
                newTrxObj.stockDetails = trx.stockDetails;
                newTrxObj.taxableValue = trx.taxableValue;
                newTrxObj.hsnNumber = trx.hsnNumber;
                newTrxObj.sacNumber = trx.sacNumber;
                newTrxObj.sacNumberExists = (trx.sacNumber) ? true : false;
                newTrxObj.showCodeType = trx.hsnNumber ? "hsn" : "sac";
                newTrxObj.isStockTxn = trx.isStockTxn;
                newTrxObj.applicableTaxes = entry.taxList;
                newTrxObj.variant = trx.variant;
                newTrxObj.taxInclusive = trx.taxInclusive;

                // check if stock details is available then assign uniquename as we have done while creating option
                if (trx.isStockTxn) {
                    newTrxObj.accountUniqueName = `${trx.accountUniqueName}#${trx.stockDetails?.uniqueName}`;
                    newTrxObj.fakeAccForSelect2 = `${trx.accountUniqueName}#${trx.stockDetails?.uniqueName}`;

                    let stock = trx.stockDetails;

                    if (stock && newTrxObj) {
                        // description with sku and custom fields
                        newTrxObj.sku_and_customfields = null;
                        if (this.isCashInvoice || this.isSalesInvoice || this.isPurchaseInvoice) {
                            let description = [];
                            let skuCodeHeading = stock.skuCodeHeading ? stock.skuCodeHeading : this.commonLocaleData?.app_sku_code;
                            if (stock.skuCode) {
                                description.push(skuCodeHeading + ':' + stock.skuCode);
                            }
                            let customField1Heading = stock.customField1 ? stock.customField1.key : this.localeData?.custom_field1;
                            if (stock.customField1?.value) {
                                description.push(customField1Heading + ':' + stock.customField1.value);
                            }
                            let customField2Heading = stock.customField2 ? stock.customField2.key : this.localeData?.custom_field2;
                            if (stock.customField2?.value) {
                                description.push(customField2Heading + ':' + stock.customField2.value);
                            }
                            newTrxObj.sku_and_customfields = description.join(', ');
                        }
                        /*
                            From API, in get voucher API, unit rates are received within stock key.
                            And in particular API, the unit rates are received within stock.variant key.
                            This method is common for both the flows therefore we are searching the unitRates
                            in both the keys
                        */
                        const unitRates = stock?.unitRates ?? stock?.variant?.unitRates ?? [];
                        stock.unitRates = unitRates || [];
                        const unitRate = stock.unitRates.find(rate => rate.stockUnitCode === stock.stockUnit.code);

                        let stockUnit: IStockUnit = {
                            id: stock.stockUnit.uniqueName,
                            text: unitRate ? unitRate.stockUnitCode : stock.stockUnit.code
                        };
                        newTrxObj.stockList = [];
                        if (stock.unitRates && stock.unitRates.length) {
                            newTrxObj.stockList = this.prepareUnitArr(stock.unitRates);
                        } else {
                            newTrxObj.stockList.push(stockUnit);
                        }
                    }

                    newTrxObj.quantity = trx.quantity;
                    newTrxObj.rate = trx.rate;
                    newTrxObj.stockUnit = trx.stockUnit;
                    newTrxObj.stockUnitCode = trx.stockUnitCode;

                    if (trx.maxQuantity) {
                        newTrxObj.maxQuantity = trx.maxQuantity;
                    }
                } else {
                    newTrxObj.accountUniqueName = trx.accountUniqueName;
                    newTrxObj.fakeAccForSelect2 = trx.accountUniqueName;
                }

                this.calculateTotalDiscountOfEntry(entry, newTrxObj, false);
                this.calculateEntryTaxSum(entry, newTrxObj);
                return newTrxObj;
            });

            // tcs tax calculation
            if (entry.tcsTaxList && entry.tcsTaxList.length) {
                entry.isOtherTaxApplicable = true;
                entry.otherTaxType = 'tcs';

                let tax = this.companyTaxesList.find(f => f?.uniqueName === entry.tcsTaxList[0]);
                if (tax) {
                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax?.uniqueName };
                    let taxableValue = 0;
                    if (entry.otherTaxModal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                        taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                    } else if (entry.otherTaxModal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                        let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                        taxableValue = (rawAmount + entry.taxSum + entry.cessSum);
                    }

                    entry.otherTaxSum = giddhRoundOff(((taxableValue * tax.taxDetail[0].taxValue) / 100), this.highPrecisionRate);
                }
            } else if (entry.tdsTaxList && entry.tdsTaxList.length) {
                // tds tax calculation
                entry.isOtherTaxApplicable = true;
                entry.otherTaxType = 'tds';

                let tax = this.companyTaxesList.find(f => f?.uniqueName === entry.tdsTaxList[0]);
                if (tax) {
                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                    let taxableValue = 0;
                    if (entry.otherTaxModal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                        taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                    } else if (entry.otherTaxModal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                        let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                        taxableValue = (rawAmount + entry.taxSum + entry.cessSum);
                    }

                    entry.otherTaxSum = giddhRoundOff(((taxableValue * tax.taxDetail[0].taxValue) / 100), this.highPrecisionRate);
                }
            }
            entry.taxes = [];
            entry.cessSum = 0;
            return entry;
        });
    }

    private parseDiscountFromResponse(entry: SalesEntryClass): LedgerDiscountClass[] {
        let discountArray: LedgerDiscountClass[] = [];

        if (entry.tradeDiscounts) {
            let isDefaultDiscountThere = entry.tradeDiscounts.some(s => !s.discount?.uniqueName);

            // now we are adding every discounts in tradeDiscounts so have to only check in trade discounts
            if (!isDefaultDiscountThere) {
                discountArray.push({
                    discountType: 'FIX_AMOUNT',
                    amount: 0,
                    name: '',
                    particular: '',
                    isActive: true,
                    discountValue: 0
                });
            } else {
                let activeDiscountIndex = -1;
                entry.tradeDiscounts.forEach((res, loop) => {
                    if (!res.discount?.uniqueName) {
                        activeDiscountIndex = loop;
                    }
                });
                entry.tradeDiscounts = this.generalService.changeElementPositionInArray(entry.tradeDiscounts, activeDiscountIndex, 0);
            }

            entry.tradeDiscounts.forEach((f) => {
                discountArray.push({
                    discountType: f?.discount.discountType,
                    amount: f?.discount.discountValue,
                    name: f?.discount.name,
                    particular: f?.account?.uniqueName,
                    isActive: true,
                    discountValue: f?.discount.discountValue,
                    discountUniqueName: f?.discount?.uniqueName
                });
            });
        }

        return discountArray;
    }

    private updateVoucherSuccess() {
        this.startLoader(false);
        this.fireActionAfterGenOrUpdVoucher(this.invoiceNo, ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess);
        this.cancelVoucherUpdate.emit(true);
    }

    private fireActionAfterGenOrUpdVoucher(voucherNo: string, action: ActionTypeAfterVoucherGenerateOrUpdate) {
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.store.dispatch(this.proformaActions.setVoucherForDetails(voucherNo, action));
        } else if (!this.isPurchaseInvoice) {
            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(voucherNo, action));
        }
    }

    public ngOnDestroy() {
        if (this.callFromOutside) {
            if (this.isSidebarExpanded) {
                this.isSidebarExpanded = false;
                this.generalService.expandSidebar();
                document.querySelector('.nav-left-bar').classList.add('open');
            }
            document.querySelector('body').classList.remove('setting-sidebar-open');
            document.querySelector('body').classList.remove('voucher-preview-edit');
        }

        if (!this.isProformaInvoice && !this.isEstimateInvoice && this.isPendingVoucherType) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        } else {
            this.store.dispatch(this.proformaActions.resetActiveVoucher());
        }

        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public updateData(obj: GenericRequestForGenerateSCD | PurchaseRecordRequest, data: VoucherClass) {
        if ((<GenericRequestForGenerateSCD>obj).voucher) {
            delete (<GenericRequestForGenerateSCD>obj).voucher;
        }
        if ((<GenericRequestForGenerateSCD>obj).depositAccountUniqueName) {
            delete (<GenericRequestForGenerateSCD>obj).depositAccountUniqueName;
        }

        let salesEntryClassArray: SalesEntryClassMulticurrency[] = [];
        let entries = data.entries;

        entries.forEach(e => {
            let salesEntryClass = new SalesEntryClassMulticurrency();
            salesEntryClass.voucherType = e?.voucherType;
            salesEntryClass.uniqueName = e?.uniqueName;
            salesEntryClass.description = e.description;
            salesEntryClass.date = e?.entryDate;
            let calculationMethod = (e.otherTaxModal && e.otherTaxModal.tcsCalculationMethod) ? e.otherTaxModal.tcsCalculationMethod : "";
            e.taxList.forEach(t => {
                salesEntryClass.taxes.push({ uniqueName: t, calculationMethod: calculationMethod });
            });
            if (this.isPurchaseInvoice) {
                salesEntryClass.purchaseOrderItemMapping = e.purchaseOrderItemMapping;
            }
            e.transactions.forEach(tr => {
                let transactionClassMul = new TransactionClassMulticurrency();
                transactionClassMul.account.uniqueName = tr.accountUniqueName;
                transactionClassMul.account.name = tr.accountName;
                transactionClassMul.amount.amountForAccount = tr.amount;
                salesEntryClass.hsnNumber = (tr.showCodeType === 'hsn') ? tr.hsnNumber : "";
                salesEntryClass.sacNumber = (tr.showCodeType === 'sac') ? tr.sacNumber : "";
                salesEntryClass.description = tr.description;
                if (tr.isStockTxn) {
                    let salesAddBulkStockItems = new SalesAddBulkStockItems();
                    salesAddBulkStockItems.name = tr.stockDetails?.name;
                    salesAddBulkStockItems.uniqueName = tr.stockDetails?.uniqueName;
                    salesAddBulkStockItems.quantity = tr.quantity;
                    salesAddBulkStockItems.rate = {};
                    salesAddBulkStockItems.rate.amountForAccount = tr.rate;
                    salesAddBulkStockItems.sku = tr.stockDetails.skuCode;
                    salesAddBulkStockItems.stockUnit = new CodeStockMulticurrency();
                    salesAddBulkStockItems.stockUnit.uniqueName = tr.stockUnit;
                    salesAddBulkStockItems.stockUnit.code = tr.stockUnitCode;
                    salesAddBulkStockItems.variant = tr.variant;
                    salesAddBulkStockItems.taxInclusive = tr.taxInclusive;

                    transactionClassMul.stock = salesAddBulkStockItems;
                }
                salesEntryClass.transactions.push(transactionClassMul);
            });
            e.discounts.forEach(ds => {
                salesEntryClass.discounts.push(new DiscountMulticurrency(ds));
            });

            salesEntryClassArray.push(salesEntryClass);
        });

        obj.templateDetails = data.templateDetails;
        obj.entries = salesEntryClassArray;
        obj.account.billingDetails.countryName = this.customerCountryName;
        obj.account.billingDetails.countryCode = this.customerCountryCode;
        obj.account.billingDetails.stateCode = obj.account.billingDetails.state?.code;
        obj.account.billingDetails.stateName = obj.account.billingDetails.state?.name;

        obj.account.shippingDetails.countryName = this.customerCountryName;
        obj.account.shippingDetails.countryCode = this.customerCountryCode;
        obj.account.shippingDetails.stateCode = obj.account.shippingDetails.state?.code;
        obj.account.shippingDetails.stateName = obj.account.shippingDetails.state?.name;

        if (this.isCashInvoice && obj.account) {
            obj.account.customerName = data.voucherDetails.customerName;
            obj.account.name = data.voucherDetails.customerName;
        } else {
            delete obj.account.customerName;
        }
        if (this.shouldShowWarehouse) {
            obj['warehouse'] = { name: this.selectedWarehouseName, uniqueName: this.selectedWarehouse };
        }
        return obj;
    }

    public async modifyMulticurrencyRes(result: any, shouldLoadState: boolean = true) {
        let voucherClassConversion = new VoucherClass();
        let voucherDetails = new VoucherDetailsClass();
        if (!this.isLastInvoiceCopied && shouldLoadState) {
            await this.getUpdatedStateCodes(result.account.billingDetails?.countryCode);
        }
        voucherClassConversion.entries = [];
        result.entries.forEach(entry => {
            let salesEntryClass = new SalesEntryClass();
            let salesTransactionItemClass = new SalesTransactionItemClass();
            salesEntryClass.tcsTaxList = [];
            salesEntryClass.tdsTaxList = [];
            salesEntryClass.transactions = [];
            salesEntryClass['initiallyCall'] = true;

            if (entry.purchaseOrderItemMapping) {
                if (this.copyPurchaseBill) {
                    if (this.copyPurchaseBillInitialized) {
                        salesEntryClass.purchaseOrderItemMapping = entry.purchaseOrderItemMapping;
                    }
                } else {
                    salesEntryClass.purchaseOrderItemMapping = entry.purchaseOrderItemMapping;
                }
            }

            entry.transactions.forEach(t => {
                salesTransactionItemClass = new SalesTransactionItemClass();
                salesTransactionItemClass.accountUniqueName = t.account?.uniqueName;
                salesTransactionItemClass.accountName = t.account?.name;
                salesTransactionItemClass.amount = t?.amount?.amountForAccount ?? 0;
                salesTransactionItemClass.highPrecisionAmount = t?.amount?.amountForAccount ?? 0;
                salesTransactionItemClass.hsnNumber = t.hsnNumber ?? entry.hsnNumber;
                salesTransactionItemClass.sacNumber = t.sacNumber ?? entry.sacNumber;
                salesTransactionItemClass.sacNumberExists = (t.sacNumber ?? entry.sacNumber) ? true : false;
                salesTransactionItemClass.showCodeType = (t.hsnNumber ?? entry.hsnNumber) ? "hsn" : "sac";
                salesTransactionItemClass.fakeAccForSelect2 = t.account?.uniqueName;
                salesTransactionItemClass.description = entry.description;
                salesTransactionItemClass.date = t?.date;

                entry.taxes?.forEach(ta => {
                    let taxTypeArr = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
                    if (taxTypeArr?.indexOf(ta.taxType) > -1) {
                        salesEntryClass.isOtherTaxApplicable = true;
                        let otherTaxModal = new SalesOtherTaxesModal();
                        otherTaxModal.appliedOtherTax = { name: ta?.name, uniqueName: ta?.uniqueName };
                        otherTaxModal.tcsCalculationMethod = ta?.calculationMethod;
                        salesEntryClass.otherTaxModal = otherTaxModal;

                        if (ta.taxType === 'tdsrc' || ta.taxType === 'tdspay') {
                            salesEntryClass.tdsTaxList.push(ta?.uniqueName);
                        } else {
                            salesEntryClass.tcsTaxList.push(ta?.uniqueName);
                        }

                    } else {
                        const selectedTax = this.companyTaxesList.find(tax => tax?.uniqueName === ta?.uniqueName);
                        salesEntryClass.taxes.push({
                            amount: ta.taxPercent,
                            uniqueName: ta?.uniqueName,
                            isChecked: true,
                            isDisabled: false,
                            type: ta?.taxType,
                            name: ta?.name || (selectedTax?.name) || ''
                        });
                    }
                });
                if (t.stock) {
                    this.currentTxnRequestObject[voucherClassConversion.entries.length] = {
                        ...this.currentTxnRequestObject[voucherClassConversion.entries.length],
                        params: {
                            variantUniqueName: t.stock?.variant?.uniqueName
                        },
                        isLinkedPoItem: t.additional?.maxQuantity > 0,
                        selectedAcc: {
                            stock: {
                                name: t.stock.name,
                                uniqueName: t.stock.uniqueName,
                            },
                            additional: {
                                name: t.account.name,
                                uniqueName: t.account.uniqueName,
                            }
                        }
                    };
                    this.loadStockVariants(t.stock.uniqueName, voucherClassConversion.entries.length);
                    const unitRates = t.stock?.unitRates ?? [];
                    if (!t.stock.stockUnit?.uniqueName && t.stock.stockUnit?.code) {
                        const unitFound = unitRates?.filter(unit => unit?.stockUnitCode === t.stock.stockUnit?.code);
                        if (unitFound?.length) {
                            t.stock.stockUnit.uniqueName = unitFound[0]?.stockUnitUniqueName;
                        }
                    }

                    salesTransactionItemClass.isStockTxn = true;
                    salesTransactionItemClass.stockDetails = {};
                    salesTransactionItemClass.stockDetails.name = t.stock.name;
                    salesTransactionItemClass.stockDetails.customField1 = t.stock.customField1;
                    salesTransactionItemClass.stockDetails.customField2 = t.stock.customField2;
                    salesTransactionItemClass.stockDetails.stockUnit = t.stock.stockUnit;
                    salesTransactionItemClass.stockDetails.stockUnitCode = t.stock.stockUnitCode;
                    salesTransactionItemClass.stockDetails.unitRates = unitRates;
                    salesTransactionItemClass.stockDetails.uniqueName = t.stock.uniqueName;
                    salesTransactionItemClass.stockDetails.skuCodeHeading = t.stock.skuCodeHeading;
                    salesTransactionItemClass.quantity = t.stock.quantity;
                    salesTransactionItemClass.rate = t.stock.rate?.amountForAccount ?? t.stock.rate?.rateForAccount;
                    salesTransactionItemClass.stockDetails.skuCode = t.stock.sku;
                    salesTransactionItemClass.stockUnit = t.stock.stockUnit.uniqueName;
                    salesTransactionItemClass.stockUnitCode = t.stock.stockUnit.code;
                    salesTransactionItemClass.fakeAccForSelect2 = t.account.uniqueName + '#' + t.stock.uniqueName;
                    salesTransactionItemClass.variant = t.stock?.variant;
                    salesTransactionItemClass.taxInclusive = t?.stock.taxInclusive;
                }

                if (this.isPurchaseInvoice && entry.purchaseOrderLinkSummaries && entry.purchaseOrderLinkSummaries.length > 0) {
                    entry.purchaseOrderLinkSummaries.forEach(summary => {
                        if (!isNaN(Number(summary.unUsedQuantity))) {
                            if (t.stock) {
                                salesTransactionItemClass.maxQuantity = summary.unUsedQuantity + salesTransactionItemClass.quantity;
                            } else {
                                salesTransactionItemClass.maxQuantity = summary.usedQuantity;
                            }

                            this.existingPoEntries[summary.entryUniqueName] = salesTransactionItemClass.maxQuantity;
                        }
                    });
                }

                salesEntryClass.transactions.push(salesTransactionItemClass);
            });

            if (entry.discounts && entry.discounts.length) {
                let discountArray = [];
                let tradeDiscountArray = [];
                entry.discounts.forEach(discount => {

                    let discountLedger = new LedgerDiscountClass();
                    discountLedger.amount = discount?.discountValue;
                    discountLedger.discountType = discount?.calculationMethod;
                    discountLedger.discountValue = discount?.discountValue;
                    discountLedger.discountUniqueName = discount?.uniqueName || discount?.discountUniqueName;
                    discountLedger.name = discount?.name;
                    discountLedger.particular = discount?.particular;
                    discountLedger.uniqueName = discountLedger?.discountUniqueName;
                    let tradeDiscount = new LedgerResponseDiscountClass();
                    tradeDiscount.discount = {
                        uniqueName: '',
                        name: '',
                        discountType: "PERCENTAGE",
                        discountValue: 0
                    };
                    tradeDiscount.account = {
                        accountType: '',
                        uniqueName: entry?.uniqueName,
                        name: ''
                    };
                    tradeDiscount.discount.uniqueName = discountLedger?.discountUniqueName;
                    tradeDiscount.discount.discountValue = discountLedger?.discountValue;
                    tradeDiscount.discount.discountType = discountLedger?.discountType;
                    tradeDiscount.discount.name = discountLedger?.name;
                    tradeDiscountArray.push(tradeDiscount);
                });
                salesEntryClass.discounts = discountArray;
                salesEntryClass.tradeDiscounts = tradeDiscountArray;
            } else {
                salesEntryClass.discounts = [new LedgerDiscountClass()];
            }
            salesEntryClass.discounts = this.parseDiscountFromResponse(salesEntryClass);
            salesEntryClass.voucherType = entry?.voucherType;
            salesEntryClass.uniqueName = entry?.uniqueName;
            salesEntryClass.description = entry.description;

            if (typeof (entry?.date) === "object") {
                salesEntryClass.entryDate = dayjs(entry?.date).format(GIDDH_DATE_FORMAT);
            } else {
                salesEntryClass.entryDate = entry?.date;
            }
            this.calculateOtherTaxes(salesEntryClass.otherTaxModal, salesEntryClass);
            voucherClassConversion.entries.push(salesEntryClass);
        });

        this.entriesListBeforeTax = voucherClassConversion.entries;
        voucherClassConversion.companyDetails = result.company;

        voucherClassConversion.accountDetails.billingDetails = new GstDetailsClass();
        voucherClassConversion.accountDetails.billingDetails.panNumber = result?.account?.billingDetails?.panNumber;

        voucherClassConversion.accountDetails.billingDetails.pincode = result.account.billingDetails?.pincode;
        voucherClassConversion.accountDetails.billingDetails.address = cloneDeep(result?.account?.billingDetails?.address);
        voucherClassConversion.accountDetails.billingDetails.gstNumber = result.account.billingDetails?.gstNumber ?? result?.account?.billingDetails?.taxNumber;
        voucherClassConversion.accountDetails.billingDetails.state.code = this.getNewStateCode(result.account.billingDetails?.stateCode ?? result?.account?.billingDetails?.state?.code);
        voucherClassConversion.accountDetails.billingDetails.state.name = result.account.billingDetails?.stateName ?? result?.account?.billingDetails?.state?.name;
        voucherClassConversion.accountDetails.billingDetails.county.name = result?.account?.billingDetails?.county?.name;
        voucherClassConversion.accountDetails.billingDetails.county.code = result?.account?.billingDetails?.county?.code;
        let selectedCustomerNumber = result?.account?.mobileNumber ? "+" + result?.account?.mobileNumber : '';
        this.intl?.setNumber(selectedCustomerNumber);
        voucherClassConversion.accountDetails.mobileNumber = result.account.mobileNumber;

        voucherClassConversion.accountDetails.shippingDetails = new GstDetailsClass();
        if (result?.account?.shippingDetails) {
            voucherClassConversion.accountDetails.shippingDetails.panNumber = result?.account?.shippingDetails?.panNumber;

            voucherClassConversion.accountDetails.shippingDetails.pincode = result.account.shippingDetails.pincode;
            voucherClassConversion.accountDetails.shippingDetails.address = cloneDeep(result?.account?.shippingDetails?.address);
            voucherClassConversion.accountDetails.shippingDetails.gstNumber = result.account.shippingDetails.gstNumber ?? result?.account?.shippingDetails?.taxNumber;
            voucherClassConversion.accountDetails.shippingDetails.state.code = this.getNewStateCode(result.account.shippingDetails.stateCode ?? result?.account?.shippingDetails?.state?.code);
            voucherClassConversion.accountDetails.shippingDetails.state.name = result.account.shippingDetails.stateName ?? result?.account?.shippingDetails?.state?.name;
            voucherClassConversion.accountDetails.shippingDetails.county.name = result?.account?.shippingDetails?.county?.name;
            voucherClassConversion.accountDetails.shippingDetails.county.code = result?.account?.shippingDetails?.county?.code;

            voucherClassConversion.accountDetails.shippingDetails = this.updateAddressShippingBilling(voucherClassConversion.accountDetails.shippingDetails);
        }
        voucherClassConversion.accountDetails.billingDetails = this.updateAddressShippingBilling(voucherClassConversion.accountDetails.billingDetails);

        voucherClassConversion.accountDetails.attentionTo = result.account.attentionTo;
        voucherClassConversion.accountDetails.email = result.account.email;
        voucherClassConversion.accountDetails.uniqueName = result.account?.uniqueName;

        voucherClassConversion.accountDetails.currencySymbol = result.account?.currency?.symbol;
        voucherClassConversion.accountDetails.currencyCode = result.account?.currency?.code;

        //code for voucher details
        voucherDetails.voucherDate = result?.date ? result?.date : '';
        if (this.voucherApiVersion === 2) {
            voucherDetails.referenceVoucher = result.referenceVoucher;
        } else {
            voucherDetails.invoiceLinkingRequest = result.invoiceLinkingRequest;
        }
        if (this.isPendingVoucherType) {
            result.balanceTotal = result.grandTotal;
        } else {
            voucherDetails.balanceDue = giddhRoundOff(result.balanceTotal?.amountForAccount ?? 0, this.giddhBalanceDecimalPlaces);
        }
        voucherDetails.deposit = result.deposit ? result.deposit.amountForAccount : 0;

        //need to check usage
        voucherDetails.dueDate = result.dueDate ? dayjs(result.dueDate, GIDDH_DATE_FORMAT) : '';
        voucherDetails.balanceStatus = result.balanceStatus;

        voucherDetails.customerUniquename = result.account?.uniqueName;
        voucherDetails.grandTotal = result.grandTotal?.amountForAccount;
        voucherDetails.grantTotalAmountForCompany = result.grandTotal?.amountForCompany;
        if ([VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote]?.indexOf(this.invoiceType) > -1) {
            // Credit note and Debit note
            voucherDetails.voucherNumber = result.invoiceNumberAgainstVoucher || (this.voucherApiVersion === 2 ? result.number : '') || '';
        } else if (!this.copyPurchaseBill) {
            voucherDetails.voucherNumber = result.number;
        }
        voucherDetails.subTotal = result.subTotal?.amountForAccount;
        voucherDetails.taxesTotal = result.taxTotal?.cumulativeAmountForAccount ?? result.taxTotal?.amountForAccount ?? 0;
        voucherDetails.totalAsWords = (result.totalAsWords) ? result.totalAsWords.amountForAccount : '';
        voucherDetails.gainLoss = result.gainLoss;

        voucherClassConversion.voucherDetails = voucherDetails;
        voucherClassConversion.templateDetails = (result.templateDetails) ? result.templateDetails : new TemplateDetailsClass();

        if (!this.isLastInvoiceCopied) {
            if (!this.isPurchaseInvoice) {
                this.isMulticurrencyAccount = result.multiCurrency;
            }
            this.customerCountryName = result.account.billingDetails?.countryName ?? result?.account?.billingDetails?.country?.name;
            this.customerCountryCode = result?.account?.billingDetails?.countryCode ?? result?.account?.billingDetails?.country?.code ?? 'IN';
        }
        this.showGstAndTrnUsingCountryName(this.customerCountryName);

        this.exchangeRate = result.exchangeRate;
        this.originalExchangeRate = this.exchangeRate;
        this.previousExchangeRate = this.exchangeRate;

        this.invoiceUniqueName = result?.uniqueName;
        this.prepareInvoiceTypeFlags();
        if (result.cashInvoice || result.cashVoucher) {
            this.isCashInvoice = true;
            this.isSalesInvoice = false;
        }

        if (this.isCashInvoice || result?.type?.toString()?.toUpperCase() === VoucherTypeEnum.cash.toString().toUpperCase()) {
            voucherDetails.customerName = result.account.customerName;
            this.depositAccountUniqueName = result.account?.uniqueName;
            this.selectedBankAccount = result.account.name;
        } else {
            voucherDetails.customerName = result.account?.name || result.voucherDetails?.customerName;
        }

        if (this.isPurchaseInvoice && !this.copyPurchaseBill) {
            voucherClassConversion.purchaseOrderDetails = result.purchaseOrderDetails;

            if (voucherClassConversion.purchaseOrderDetails && voucherClassConversion.purchaseOrderDetails.length > 0) {
                voucherClassConversion.purchaseOrderDetails.forEach(order => {
                    this.linkedPo.push(order?.uniqueName);
                    this.selectedPoItems.push(order?.uniqueName);

                    if (!this.linkedPoNumbers[order?.uniqueName]) {
                        this.purchaseOrders.push({ label: order?.number, value: order?.uniqueName, additional: { amount: order?.grandTotal?.amountForAccount, totalPending: order?.entries?.length } });
                        this.filterPurchaseOrder('');
                    }

                    this.linkedPoNumbers[order?.uniqueName] = [];
                    this.linkedPoNumbers[order?.uniqueName]['voucherNumber'] = order?.number;
                    this.linkedPoNumbers[order?.uniqueName]['items'] = order?.entries;
                });
            }

            this.poLinkUpdated = true;
        }

        this.copyPurchaseBillInitialized = true;

        return voucherClassConversion;
    }

    public updateExchangeRate(val: any): void {
        val = (val) ? String(val)?.replace(this.baseCurrencySymbol, '') : '';
        let total = (val) ? (parseFloat(this.generalService.removeSpecialCharactersFromAmount(val)) || 0) : 0;
        if (this.isMulticurrencyAccount) {
            this.exchangeRate = total / this.invFormData.voucherDetails.grandTotal || 0;
            this.originalExchangeRate = this.exchangeRate;
            this.previousExchangeRate = this.exchangeRate;
        }
    }

    /**
     * get currency rate on voucher date changed
     * @param selectedDate: Date ( date that is selected by user )
     * @param modelDate: Date ( date that was already selected by user )
     */
    public onVoucherDateChanged(selectedDate, modelDate) {
        if (this.isMultiCurrencyModule() && this.isMulticurrencyAccount && selectedDate && this.voucherDateBeforeUpdate && dayjs(selectedDate).format(GIDDH_DATE_FORMAT) !== dayjs(this.voucherDateBeforeUpdate).format(GIDDH_DATE_FORMAT)) {
            this.getCurrencyRate(this.companyCurrency, this.customerCurrencyCode, selectedDate);
        }
        if (selectedDate && modelDate && selectedDate !== modelDate && this.invFormData &&
            this.invFormData.voucherDetails && this.invFormData.voucherDetails.voucherDate &&
            this.invFormData.accountDetails && this.invFormData.accountDetails?.uniqueName) {
            this.getAllAdvanceReceipts(this.invFormData.voucherDetails.customerUniquename, selectedDate);
        }
        if (selectedDate && modelDate && selectedDate !== modelDate && (this.isCreditNote || this.isDebitNote)) {
            this.getInvoiceListsForCreditNote(dayjs(selectedDate).format(GIDDH_DATE_FORMAT));
        }

        if (this.voucherDateBeforeUpdate && this.invFormData.voucherDetails.voucherDate && this.voucherDateBeforeUpdate !== this.invFormData.voucherDetails.voucherDate && (!this.isUpdateMode || (this.isUpdateMode && this.invoiceType !== VoucherTypeEnum.purchase))) {
            this.isVoucherDateChanged = true;
            this.dateChangeType = "voucher";
            this.dateChangeConfiguration = this.generalService.getDateChangeConfiguration(this.localeData, this.commonLocaleData, true);
            this.dialog.open(this.dateChangeConfirmationModel, {
                width: '650px',
            });
        }

        if (this.voucherDateBeforeUpdate) {
            this.voucherDateBeforeUpdate = "";
            this.updateDueDate();
        }
    }



    /**
     * Fetches the currency exchange rate between two countries
     *
     * @param {*} to Converted to currency symbol
     * @param {*} from Converted from currency symbol
     * @param {string} date on which currency rate is required, default is today's date
     * @memberof VoucherComponent
     */
    public getCurrencyRate(to, from, date: any): void {
        if (from && to) {
            let voucherDate;
            if (typeof date === 'string') {
                voucherDate = date;
            } else {
                voucherDate = dayjs(date).format(GIDDH_DATE_FORMAT);
            }
            this.ledgerService.GetCurrencyRateNewApi(from, to, voucherDate).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    this.previousExchangeRate = this.exchangeRate;
                    this.originalExchangeRate = rate;
                    this.exchangeRate = rate;
                    this.changeDetectorRef.detectChanges();
                    if (from !== to) {
                        // Multi currency case
                        this.recalculateEntriesTotal();
                    }
                }
            }, (error => {

            }));
        }
    }

    /**
     * Creates the bank/cash account list from API data
     *
     * @param {*} data Data of bank/cash account from API response
     * @returns
     * @memberof VoucherComponent
     */
    public updateBankAccountObject(data: any) {
        let bankAccounts: IOption[] = [];
        if (data && data.body && data.body.results) {
            data.body.results.forEach(account => {
                bankAccounts.push({ label: account?.name, value: account?.uniqueName, additional: account });
            });
        }
        return orderBy(bankAccounts, 'label');
    }

    public switchCurrencyImg(switchCurr) {
        this.showSwitchedCurr = switchCurr;
        if (switchCurr) {
            this.reverseExchangeRate = this.exchangeRate ? 1 / this.exchangeRate : 0;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    public saveCancelExcRate(toSave) {
        if (toSave) {
            if (this.showSwitchedCurr) {
                this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            } else {
                this.originalExchangeRate = this.exchangeRate;
            }
            this.autoSaveIcon = !this.autoSaveIcon;
            this.showCurrencyValue = !this.showCurrencyValue;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
            this.calculateGrandTotal();
        } else {
            this.showCurrencyValue = !this.showCurrencyValue;
            this.autoSaveIcon = !this.autoSaveIcon;
            this.exchangeRate = this.originalExchangeRate;
            this.reverseExchangeRate = this.originalReverseExchangeRate;
        }
    }

    /**
     * Returns the promise once the state list is successfully
     * fetched to carry outn further operations
     *
     * @private
     * @param {*} countryCode Country code for the user
     * @param {boolean} isCompanyStates
     * @returns Promise to carry out further operations
     * @memberof VoucherComponent
     */
    private getUpdatedStateCodes(countryCode: any, isCompanyStates?: boolean): Promise<any> {
        if (!countryCode) {
            return;
        }
        this.statesSource = [];
        this.regionsSource = [];
        this.startLoader(true);
        return new Promise((resolve: Function) => {
            if (countryCode) {
                if (this.countryStates[countryCode]) {
                    if (!isCompanyStates) {
                        if (countryCode !== 'GB') {
                            this.statesSource = this.countryStates[countryCode];
                        } else {
                            this.regionsSource = this.countryStates[countryCode];
                        }
                    } else {
                        if (countryCode !== 'GB') {
                            this.companyStatesSource = this.countryStates[countryCode];
                        } else {
                            this.companyRegionsSource = this.countryStates[countryCode];
                        }
                    }
                    this.startLoader(false);
                    resolve();
                } else {
                    this.salesService.getStateCode(countryCode).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                        this.startLoader(false);
                        if (!isCompanyStates) {
                            if (countryCode !== 'GB') {
                                this.statesSource = this.modifyStateResp((resp.body) ? resp.body?.stateList : [], countryCode);
                            } else {
                                this.regionsSource = this.modifyStateResp((resp.body) ? resp.body?.countyList : [], countryCode);
                            }
                        } else {
                            if (countryCode !== 'GB') {
                                this.companyStatesSource = this.modifyStateResp((resp.body) ? resp.body?.stateList : [], countryCode);
                            } else {
                                this.companyRegionsSource = this.modifyStateResp((resp.body) ? resp.body?.countyList : [], countryCode);
                            }
                        }
                        resolve();
                    }, () => {
                        resolve();
                    });
                }
            } else {
                resolve();
            }
        });
    }

    private modifyStateResp(stateList: StateCode[], countryCode: string) {
        let stateListRet: IOption[] = [];
        stateList?.forEach(stateR => {
            stateListRet.push({
                label: stateR?.name,
                value: stateR?.code ? stateR?.code : stateR?.stateGstCode,
                stateGstCode: stateR?.stateGstCode ? stateR?.stateGstCode : stateR?.code
            });
        });

        this.countryStates[countryCode] = stateListRet;

        return stateListRet;
    }

    public fillShippingBillingDetails(event: any, isBilling?: boolean): void {
        let stateName = event.label;
        let stateCode = event?.value;
        if (isBilling) {
            // update account details address if it's billing details
            if (this.billingState && this.billingState.nativeElement) {
                this.billingState.nativeElement.classList.remove('error-box');
            }
            if (this.isCashInvoice || this.customerCountryCode === 'IN') {
                this.invFormData.accountDetails.billingDetails.state.name = stateName;
                this.invFormData.accountDetails.billingDetails.stateName = stateName;
                this.invFormData.accountDetails.billingDetails.stateCode = stateCode;
                this.invFormData.accountDetails.billingDetails.state.code = stateCode;
            } else {
                this.invFormData.accountDetails.billingDetails.county.name = stateName;
                this.invFormData.accountDetails.billingDetails.county.code = stateCode;
            }
        } else {
            if (this.shippingState && this.shippingState.nativeElement) {
                this.shippingState.nativeElement.classList.remove('error-box');
            }
            // if it's not billing address then only update shipping details
            // check if it's not auto fill shipping address from billing address then and then only update shipping details
            if (!this.autoFillShipping) {
                if (this.isCashInvoice || this.customerCountryCode === 'IN') {
                    this.invFormData.accountDetails.shippingDetails.stateName = stateName;
                    this.invFormData.accountDetails.shippingDetails.stateCode = stateCode;
                    this.invFormData.accountDetails.shippingDetails.state.name = stateName;
                    this.invFormData.accountDetails.shippingDetails.state.code = stateCode;
                } else {
                    this.invFormData.accountDetails.shippingDetails.county.name = stateName;
                    this.invFormData.accountDetails.shippingDetails.county.code = stateCode;
                }
            }
        }
    }

    private updateAddressShippingBilling(obj) {
        if (obj) {
            let shippigAddress = '';
            if (obj.address) {
                obj.address.forEach(res => {
                    shippigAddress = shippigAddress + res + '\n';
                });
                obj.address[0] = shippigAddress;
            } else {
                obj.address = [shippigAddress];
            }
        }
        return obj;
    }

    private showGstAndTrnUsingCountryName(name: string) {
        if (this.selectedCompany && this.selectedCompany.country === name) {
            if (name === 'India') {
                this.showGSTINNo = true;
                this.showTRNNo = false;
                this.showVATNo = false;
                this.getOnboardingForm('IN')
            } else if (name === 'United Arab Emirates') {
                this.showGSTINNo = false;
                this.showTRNNo = true;
                this.showVATNo = false;
                this.getOnboardingForm('AE')
            } else if (name === 'United Kingdom') {
                this.showGSTINNo = false;
                this.showTRNNo = false;
                this.showVATNo = true;
                this.getOnboardingForm('GB')
            }
        } else {
            this.showGSTINNo = false;
            this.showTRNNo = false;
            this.showVATNo = false;
        }
    }

    /**
     * Handles the customer name change for Cash Invoice
     *
     * @param {*} event Input change event
     * @memberof VoucherComponent
     */
    public handleCustomerChange(event: any): void {
        if (!event?.value) {
            // Input is cleared reset to default warehouse
            this.selectedWarehouse = String(this.defaultWarehouse);
            this.selectedWarehouseName = String(this.defaultWarehouseName);
        }

        if (this.showPageLeaveConfirmation) {
            this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        } else {
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        }
    }

    public onBlurDueDate(index) {
        if (this.invFormData.voucherDetails.customerUniquename || this.invFormData.voucherDetails.customerName) {
            this.setActiveIndx(index);
        }
    }

    /**
     * on click of transaction amount
     * if amount is zero then remove it for better user experiance
     * @param transaction
     */
    public transactionAmountClicked(transaction: SalesTransactionItemClass) {
        if (Number(transaction.amount) === 0) {
            transaction.amount = undefined;
            transaction.highPrecisionAmount = transaction.amount;
        }
        this.transactionAmount = transaction.amount;
    }

    public onBlurInvoiceDate(index) {
        if (!this.isSalesInvoice && !this.isPurchaseInvoice && !this.isProformaInvoice && !this.isEstimateInvoice) {
            // FOR CASH INVOICE, DEBIT NOTE AND CREDIT NOTE
            this.setActiveIndx(index);
            this.openProductDropdown();
        }
    }

    public focusInCustomerName() {

        if (this.isCashInvoice) {
            setTimeout(() => {
                if (this.inputCustomerName && this.inputCustomerName.nativeElement) {
                    this.inputCustomerName.nativeElement.focus();
                }
            }, 200);
        } else {
            if (!this.isPendingVoucherType && !this.isUpdateMode) {
                this.toggleAccountSelectionDropdown(true);
            }
        }
    }

    /**
     * toggle hsn/sac dropdown
     * and hide all open date-pickers because it's overlapping
     * hsn/sac dropdown
     */
    public toggleHsnSacDropDown(transaction: any): void {
        if (this.datePickers && this.datePickers.length) {
            this.datePickers.forEach(datePicker => {
                if (datePicker.isOpen) {
                    datePicker.hide();
                }
            });
        }

        if (transaction.showCodeType === "hsn") {
            this.editingHsnSac = transaction.hsnNumber;
        } else if (transaction.showCodeType === "sac") {
            this.editingHsnSac = transaction.sacNumber;
        }

        this.hsnDropdownShow = !this.hsnDropdownShow;
    }

    /**
     * Outside click handler for transaction row
     *
     * @memberof VoucherComponent
     */
    public handleOutsideClick(event: any): void {
        if ((typeof event?.target?.className === "string" && event?.target?.className?.indexOf("option") === -1) && event?.currentTarget?.activeElement?.className?.indexOf("select-field-input") === -1 && this.accountAsideMenuState === 'out' && this.asideMenuStateForRecurringEntry === 'out' && this.asideMenuStateForOtherTaxes === 'out' && !this.isEntryDatepickerOpen) {
            this.activeIndx = null;
            this.checkVoucherEntries();
        }
    }

    /**
     * Check valid entry if have any then enable save button
     *
     * @memberof VoucherComponent
     */
    checkVoucherEntries(): void {
        if (this.invFormData.entries && this.invFormData.entries.length) {
            let validLineItem;
            for (let i = 0; i < this.invFormData.entries.length; i++) {
                validLineItem = this.invFormData.entries[i]?.transactions.find(transaction => (transaction.accountUniqueName));
                if (validLineItem) {
                    break;
                }
            }
            this.hasVoucherEntry = !!validLineItem;
        } else {
            this.hasVoucherEntry = false;
        }
    }
    /**
     * Validates the taxes entry and returns false if anyone of the entry
     * has no taxes
     *
     * @param {*} data Data to be checked
     * @returns {boolean} True, if all the entries have atleast single tax
     * @memberof VoucherComponent
     */
    validateTaxes(data: any): boolean {
        let validEntries = true;
        data.entries.forEach((entry: any, index: number) => {
            const transaction = (this.invFormData && this.invFormData.entries && this.invFormData.entries[index].transactions) ?
                this.invFormData.entries[index].transactions[0] : '';
            if (transaction) {
                entry.taxes = entry.taxes?.filter(tax => tax.isChecked);
                transaction['requiredTax'] = (entry.taxes && entry.taxes.length === 0);
                validEntries = !(!entry.taxes || entry.taxes?.length === 0); // Entry is invalid if tax length is zero
            }
        });
        return validEntries;
    }

    /**
     * Purchase record confirmation change handler, triggerreed when the user performs any
     * action with the confirmation popup
     *
     * @param {string} action Action performed by user
     * @memberof VoucherComponent
     */
    public handlePurchaseRecordConfirmation(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            // User confirmed to merge the purchase record, update the length of the found records
            this.saveCurrentPurchaseRecordDetails();
            this.mergePurchaseRecord();
            this.isUpdateMode = true;
        } else {
            // User denied the permission or closed the popup
            this.toaster.showSnackBar("error", this.localeData?.purchase_record_error, this.localeData?.purchase_bill);
        }
        if (this.purchaseRecordConfirmationPopup) {
            this.dialog.closeAll();
        }
    }

    /**
     * Quantity field blur handler
     *
     * @param {SalesEntryClass} entry Current entry
     * @param {SalesTransactionItemClass} transaction Current transaction
     * @memberof VoucherComponent
     */
    public handleQuantityBlur(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        if (transaction.quantity !== undefined) {
            transaction.quantity = Number(transaction.quantity);

            if (this.isPurchaseInvoice && transaction.maxQuantity !== undefined && !this.copyPurchaseBill) {
                if (transaction.quantity > transaction.maxQuantity) {
                    transaction.quantity = transaction.maxQuantity;
                    this.toaster.showSnackBar("error", this.localeData?.quantity_error + " (" + transaction.maxQuantity + ")");
                }
            }

            this.calculateStockEntryAmount(transaction);
            this.calculateWhenTrxAltered(entry, transaction);
        }
    }

    /**
     * Stores the purchase record data
     *
     * @private
     * @memberof VoucherComponent
     */
    private saveCurrentPurchaseRecordDetails(): void {
        try {
            this.purchaseRecordCustomerUniqueName = String(this.invFormData.voucherDetails.customerUniquename);
            this.purchaseRecordInvoiceDate = dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
            this.purchaseRecordTaxNumber = String(this.invFormData.accountDetails.shippingDetails.gstNumber);
            this.purchaseRecordInvoiceNumber = String(this.invFormData.voucherDetails.voucherNumber);
        } catch (error) {
        }
    }

    /**
     * Intializes the warehouse
     *
     * @private
     * @param {WarehouseDetails} [warehouse] Warehouse to show pre-filled in drop down
     * @memberof VoucherComponent
     */
    private initializeWarehouse(warehouse?: WarehouseDetails): void {
        this.store.pipe(select(appState => appState.warehouse.warehouses), filter((warehouses) => !!warehouses), take(1)).subscribe((warehouses: any) => {
            if (warehouses) {
                let warehouseResults = cloneDeep(warehouses.results);
                warehouseResults = warehouseResults?.filter(wh => warehouse?.uniqueName === wh?.uniqueName || !wh.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.defaultWarehouse = (warehouseData.defaultWarehouse?.uniqueName) ? warehouseData.defaultWarehouse?.uniqueName : '';
                this.defaultWarehouseName = (warehouseData.defaultWarehouse?.name) ? warehouseData.defaultWarehouse?.name : '';

                if ((!this.isUpdateMode || (this.isUpdateMode && warehouse))) {
                    if (this.isPurchaseInvoice && warehouseData && warehouseData.defaultWarehouse && !this.isUpdateMode) {
                        this.autoFillDeliverToWarehouseAddress(warehouseData.defaultWarehouse);
                    }

                    if (warehouse) {
                        // Update flow is carried out and we have received warehouse details
                        this.selectedWarehouse = warehouse.uniqueName;
                        this.selectedWarehouseName = warehouse.name;
                        this.shouldShowWarehouse = true;
                    } else {
                        if (this.isUpdateMode) {
                            // Update flow is carried out
                            // Hide the warehouse drop down as the API has not returned warehouse
                            // details in response which means user has updated the item to non-stock
                            this.shouldShowWarehouse = false;
                        } else {
                            // Create flow is carried out
                            this.selectedWarehouse = String(this.defaultWarehouse);
                            this.selectedWarehouseName = String(this.defaultWarehouseName);
                            this.shouldShowWarehouse = true;
                        }
                    }
                }
            } else {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            }
        });
    }

    /**
     * Returns true, if module is one of the multi-currency supported module
     *
     * @private
     * @returns {boolean} True, if module is one of the multi-currency supported module
     * @memberof VoucherComponent
     */
    private isMultiCurrencyModule(): boolean {
        return [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.cash, VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.purchase, VoucherTypeEnum.cashDebitNote, VoucherTypeEnum.cashBill, VoucherTypeEnum.cashCreditNote].includes(this.invoiceType);
    }

    /**
     * Returns true, if any of the single item is stock
     *
     * @private
     * @returns {boolean} True, if item entries contains stock item
     * @memberof VoucherComponent
     */
    private isStockItemPresent(): boolean {
        if (this.isMultiCurrencyModule() && this.invFormData.entries) {
            const entries = this.invFormData.entries;
            for (let entry = 0; entry < entries.length; entry++) {
                const transactions = entries[entry].transactions;
                for (let transaction = 0; transaction < transactions?.length; transaction++) {
                    const item = transactions[transaction];
                    if (item.isStockTxn) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Handles the warehouse visibility when items in the list
     * changes from stock to non-stock or vice-versa
     *
     * @private
     * @memberof VoucherComponent
     */
    private handleWarehouseVisibility(): void {
        // Non stock item got selected, search if there is any stock item along with non-stock item
        const isStockItemPresent = this.isStockItemPresent();
        if (!isStockItemPresent) {
            // None of the item were stock item, hide the warehouse section which is applicable only for stocks
            this.shouldShowWarehouse = false;
        }
    }

    /**
     * Generates a purchase record
     *
     * @private
     * @param {PurchaseRecordRequest} requestObject Request object required from the service
     * @memberof VoucherComponent
     */
    private generatePurchaseRecord(requestObject: PurchaseRecordRequest): void {
        this.purchaseRecordConfirmationConfiguration = this.voucherUtilityService.getPurchaseRecordConfirmationConfiguration(this.localeData, this.commonLocaleData);
        if (this.isPurchaseRecordContractBroken) {
            this.validatePurchaseRecord().pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
                if (data && data.body) {
                    this.isShowLoader = false;
                    this.startLoader(false);
                    this.matchingPurchaseRecord = data.body;
                    if (this.isUpdateMode) {
                        /* Delete the unique name entry of old record if the user is in
                         UPDATE flow of a purchase record and changes the record such that
                         an existing entry is found. In this case, if the user accepts to merge
                         with previous record then those entries of older record will be again recreated
                         for current purchase record and hence old entries' OLD unique names should be deleted */
                        this.matchingPurchaseRecord.entries.forEach((entry => delete entry?.uniqueName));
                    }
                    this.dialog.open(this.purchaseRecordConfirmationPopup, {
                        width: 'auto'
                    });
                } else {
                    this.matchingPurchaseRecord = null;
                    if (this.isUpdateMode) {
                        this.updatePurchaseRecord(requestObject);
                    } else {
                        this.createPurchaseRecord(requestObject);
                    }
                }
            }, () => {
                this.isShowLoader = false;
                this.startLoader(false);
                this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong)
            });
        } else {
            if (this.copyPurchaseBill) {
                this.createPurchaseRecord(requestObject);
            } else {
                this.updatePurchaseRecord(requestObject);
            }
        }
    }

    /**
     * Creates a new purchase record
     *
     * @private
     * @param {PurchaseRecordRequest} request Request object required by the service
     * @memberof VoucherComponent
     */
    private createPurchaseRecord(request: PurchaseRecordRequest): void {
        // Create a new puchase record with voucher API for voucher version 2 else create a new purchase record with its own API
        if (this.showVATNo) {
            delete request['company'].billingDetails.gstNumber;
            delete request['company'].shippingDetails.gstNumber;
        }
        const apiCallObservable = this.voucherApiVersion === 2 ?
            this.salesService.generateGenericItem(request, true) : this.purchaseRecordService.generatePurchaseRecord(request);
        apiCallObservable.pipe(takeUntil(this.destroyed$)).subscribe((response: BaseResponse<any, GenericRequestForGenerateSCD>) => {
            this.handleGenerateResponse(response, this.invoiceForm);
        }, () => {
            this.isShowLoader = false;
            this.startLoader(false);
            this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
        });
    }

    /**
     * Updates a purchase record
     *
     * @private
     * @param {PurchaseRecordRequest} request Request object required by the service
     * @memberof VoucherComponent
     */
    private updatePurchaseRecord(request: any): void {
        // Update the puchase record with voucher API for voucher version 2 else merge the purchase record (PATCH method, UPDATE flow)
        if (this.voucherApiVersion === 2) {
            this.salesService.updateVoucherV4(request)
                .subscribe((response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD>) => {
                    this.actionsAfterVoucherUpdate(response, this.invoiceForm);
                }, () => {
                    this.startLoader(false);
                    this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
                });
        } else {
            this.purchaseRecordService.generatePurchaseRecord(request, 'PATCH').pipe(takeUntil(this.destroyed$)).subscribe((response: BaseResponse<VoucherClass, PurchaseRecordRequest>) => {
                this.actionsAfterVoucherUpdate(response, this.invoiceForm);
            }, () => {
                this.startLoader(false);
                this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
            });
        }
    }

    /**
     * Handles the operation to be carried out once the generic generate API responds
     *
     * @private
     * @param {BaseResponse<any, GenericRequestForGenerateSCD | PurchaseRecordRequest>} response Response received from the API
     * @param {NgForm} form Invoice form instance
     * @memberof VoucherComponent
     */
    private handleGenerateResponse(response: BaseResponse<any, GenericRequestForGenerateSCD | PurchaseRecordRequest>, form: NgForm): void {
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        if (response?.status === 'success') {
            this.customerAcList$ = observableOf(orderBy(this.defaultCustomerSuggestions, 'label'));
            this.salesAccounts$ = observableOf(orderBy(this.defaultItemSuggestions, 'label'));
            // reset form and other
            this.resetInvoiceForm(form);

            this.newVoucherUniqueName = response?.body?.uniqueName;

            if (response.body?.account) {
                this.voucherNumber = response.body?.number;
                this.invoiceNo = this.voucherNumber;
                this.accountUniqueName = response.body?.account?.uniqueName;
            } else {
                this.voucherNumber = response.body?.voucherDetails.voucherNumber;
                this.invoiceNo = this.voucherNumber;
                this.accountUniqueName = response.body?.accountDetails?.uniqueName;
            }

            if (this.isPurchaseInvoice) {
                this.toaster.showSnackBar("success", this.localeData?.purchase_bill_created);
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            } else {
                let message = (this.voucherNumber) ? `${this.localeData?.entry_created}: ${this.voucherNumber}` : this.commonLocaleData?.app_messages?.voucher_saved;
                this.toaster.showSnackBar("success", message);
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            }

            /** For pending type need to navigate to get all module of voucher type   */
            if (this.isPendingVoucherType && this.actionAfterGenerateORUpdate === 0) {
                this.cancelUpdate();
            } else {
                this.postResponseAction(this.invoiceNo);
            }
        } else if (response?.status === "einvoice-confirm") {
            this.isShowLoader = false;
            this.startLoader(false);

            let dialogRef = this.dialog.open(ConfirmModalComponent, {
                data: {
                    title: this.commonLocaleData?.app_confirm,
                    body: response?.message,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no,
                    permanentlyDeleteMessage: ' '
                }
            });

            dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                if (response) {
                    this.invFormData.generateEInvoice = true;
                } else {
                    this.invFormData.generateEInvoice = false;
                }
                this.onSubmitInvoiceForm(form);
            });
        } else {
            this.isShowLoader = false;
            this.startLoader(false);
            this.toaster.showSnackBar("error", response?.message, response?.code);
            return;
        }
        this.updateAccount = false;

        if (!this.isPendingVoucherType) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        }
    }

    /**
     * Validates the purchase record being created to avoid redundant data
     * Returns data of the old purchase record if it matches with the newly created
     * purchase record according to the contract policy (account unique name, tax number,
     * invoice date and invoice number) else returns null
     *
     * @private
     * @returns {Observable<BaseResponse<any, any>>} Returns data of previous record if found else null
     * @memberof VoucherComponent
     */
    private validatePurchaseRecord(): Observable<BaseResponse<any, any>> {
        const requestObject = {
            accountUniqueName: this.invFormData.voucherDetails.customerUniquename,
            taxNumber: this.invFormData.accountDetails.billingDetails.gstNumber || this.invFormData.accountDetails.shippingDetails.gstNumber || '',
            purchaseDate: dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT),
            number: this.invFormData.voucherDetails.voucherNumber || ''
        }
        return this.purchaseRecordService.validatePurchaseRecord(requestObject);
    }

    /**
     * Merges the record by removing old merged records
     *
     * @private
     * @returns {Promise<any>} Promise to carry out further operations
     * @memberof VoucherComponent
     */
    private async mergePurchaseRecord(): Promise<any> {
        // Confirmation received, delete old merged entries
        this.invFormData.entries = this.invFormData.entries?.filter(entry => !entry['isMergedPurchaseEntry'])
        const result = (await this.modifyMulticurrencyRes(this.matchingPurchaseRecord, false)) as VoucherClass;
        if (result.voucherDetails) {
            if (result.entries && result.entries.length > 0) {
                result.entries = this.parseEntriesFromResponse(result.entries);
                result.entries.forEach((entry) => {
                    entry['isMergedPurchaseEntry'] = true;
                    this.invFormData.entries.push(entry);
                });
            }
        }
        this.buildBulkData(this.invFormData.entries?.length, 0);
    }

    /**
     * This function is used to get inventory settings from store
     *
     * @memberof VoucherComponent
     */
    public getInventorySettings(): void {
        this.store.pipe(select((s: AppState) => s.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings) {
                if (settings.companyInventorySettings) {
                    this.inventorySettings = settings.companyInventorySettings;
                }
                if (settings?.invoiceSettings) {
                    this.useCustomInvoiceNumber = settings.invoiceSettings.useCustomInvoiceNumber;
                }
                if (this.voucherApiVersion === 2) {
                    if (this.invoiceType === VoucherTypeEnum.sales || this.invoiceType === VoucherTypeEnum.cash) {
                        this.applyRoundOff = settings.invoiceSettings.salesRoundOff;
                    } else if (this.invoiceType === VoucherTypeEnum.purchase) {
                        this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                    } else if (this.invoiceType === VoucherTypeEnum.debitNote) {
                        this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                    } else if (this.invoiceType === VoucherTypeEnum.creditNote) {
                        this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                    } else if (this.invoiceType === VoucherTypeEnum.estimate || this.invoiceType === VoucherTypeEnum.generateEstimate || this.invoiceType === VoucherTypeEnum.proforma || this.invoiceType === VoucherTypeEnum.generateProforma) {
                        this.applyRoundOff = true;
                    }
                } else {
                    this.applyRoundOff = true;
                }
            }
        });
    }

    /**
     * Toggle Tourist scheme checkbox then reset passport number
     *
     * @param {*} event Click event
     * @memberof VoucherComponent
     */
    public touristSchemeApplicableToggle(): void {
        this.invFormData.passportNumber = '';
    }

    /**
     *
     *
     * @param {*} event
     * @memberof VoucherComponent
     */
    public allowAlphanumericChar(): void {
        this.generalService.allowAlphanumericChar(this.invFormData.passportNumber);
    }

    // Advance receipts adjustment start

    /**
     * To reset advance receipt adjusted data
     *
     * @memberof VoucherComponent
     */
    public resetAdvanceReceiptAdjustData(): void {
        this.adjustPaymentData.customerName = '';
        this.adjustPaymentData.customerUniquename = '';
        this.adjustPaymentData.voucherDate = '';
        this.adjustPaymentData.balanceDue = 0;
        this.adjustPaymentData.dueDate = '';
        this.adjustPaymentData.grandTotal = 0;
        this.adjustPaymentData.gstTaxesTotal = 0;
        this.adjustPaymentData.subTotal = 0;
        this.adjustPaymentData.totalTaxableValue = 0;
        this.adjustPaymentData.totalAdjustedAmount = 0;
    }

    /**
     * To close advance reciipt modal
     *
     * @memberof VoucherComponent
     */
    public closeAdvanceReceiptModal() {
        this.showAdvanceReceiptAdjust = false;
        this.dialog.closeAll();
        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
            this.isAdjustAmount = this.advanceReceiptAdjustmentData.adjustments.length ? true : false;
        } else {
            this.isAdjustAmount = false;
        }
    }


    /**
     * To open advance receipts adjustment pop up
     *
     * @memberof VoucherComponent
     */
    public openAdjustPaymentModal() {
        this.showAdvanceReceiptAdjust = true;
        this.isAdjustAmount = true;
        this.invFormData.voucherDetails.exchangeRate = this.exchangeRate;
        this.dialog.open(this.adjustPaymentModal, {
            width: '1000px'
        });
    }

    /**
     * Toggle advance receipts option
     *
     * @param {*} event True, if Advance receipt adjust option enabled
     * @memberof VoucherComponent
     */
    public clickAdjustAmount(event) {
        if (event) {
            this.isAdjustAmount = true;
            if (!this.advanceReceiptAdjustmentData?.adjustments?.length && this.originalVoucherAdjustments?.adjustments?.length) {
                // If length of voucher adjustment is 0 i.e., user has changed its original adjustments but has not performed update operation
                // and voucher already has original adjustments to it then show the
                // original adjustments in adjustment popup
                this.advanceReceiptAdjustmentData = cloneDeep(this.originalVoucherAdjustments);
                this.calculateAdjustedVoucherTotal(this.originalVoucherAdjustments?.adjustments);
            }
            this.openAdjustPaymentModal();
        } else {
            this.isAdjustAmount = false;
            this.adjustPaymentBalanceDueData = 0;
            this.adjustPaymentData.totalAdjustedAmount = 0;
            this.totalAdvanceReceiptsAdjustedAmount = 0;
            this.advanceReceiptAdjustmentData.adjustments = [];
            this.calculateBalanceDue();
        }
    }

    /**
     * To get all advance adjusted data
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }} advanceReceiptsAdjustEvent event that contains advance receipts adjusted data
     * @memberof VoucherComponent
     */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }) {
        this.advanceReceiptAdjustmentData = advanceReceiptsAdjustEvent.adjustVoucherData;
        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
            this.advanceReceiptAdjustmentData.adjustments.forEach(adjustment => {
                adjustment.voucherNumber = adjustment.voucherNumber === this.commonLocaleData?.app_not_available ? '' : adjustment.voucherNumber;
            });
        }
        this.adjustPaymentData = advanceReceiptsAdjustEvent.adjustPaymentData;
        if (this.adjustPaymentData.totalAdjustedAmount) {
            this.isAdjustAmount = true;
        } else {
            this.isAdjustAmount = false;
        }
        if (this.isUpdateMode) {
            this.calculateAdjustedVoucherTotal(advanceReceiptsAdjustEvent.adjustVoucherData.adjustments)
        }
        this.adjustPaymentBalanceDueData = this.getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment();
        this.closeAdvanceReceiptModal();
    }

    /**
     * To calculate advance receipt adjusted amount is case of update invoice
     *
     * @param {*} voucherObject voucher response in case of update
     * @memberof VoucherComponent
     */
    public calculateAdjustedVoucherTotal(voucherObjectArray: any[]): void {
        this.totalAdvanceReceiptsAdjustedAmount = 0;
        if (voucherObjectArray) {
            let adjustments = cloneDeep(voucherObjectArray);
            let totalAmount = 0;
            if (adjustments) {
                adjustments.forEach((item) => {
                    if (this.voucherApiVersion === 2 && ((this.selectedVoucherType === AdjustedVoucherType.SalesInvoice && item?.voucherType === AdjustedVoucherType.DebitNote) || (this.selectedVoucherType === AdjustedVoucherType.PurchaseInvoice && item?.voucherType === AdjustedVoucherType.CreditNote) ||
                        (this.selectedVoucherType === AdjustedVoucherType.DebitNote && item?.voucherType === AdjustedVoucherType.OpeningBalance && item.voucherBalanceType === "dr") ||
                        ((this.selectedVoucherType === AdjustedVoucherType.DebitNote || this.selectedVoucherType === AdjustedVoucherType.SalesInvoice || this.selectedVoucherType === AdjustedVoucherType.Sales || this.selectedVoucherType === AdjustedVoucherType.Payment) && (item?.voucherType === AdjustedVoucherType.Journal || item?.voucherType === AdjustedVoucherType.JournalVoucher) && item?.voucherBalanceType === "dr") ||
                        (this.selectedVoucherType === AdjustedVoucherType.CreditNote && item?.voucherType === AdjustedVoucherType.OpeningBalance && item.voucherBalanceType === "cr") ||
                        ((this.selectedVoucherType === AdjustedVoucherType.CreditNote || this.selectedVoucherType === AdjustedVoucherType.Purchase || this.selectedVoucherType === AdjustedVoucherType.Receipt || this.selectedVoucherType === AdjustedVoucherType.AdvanceReceipt) && (item?.voucherType === AdjustedVoucherType.Journal || item?.voucherType === AdjustedVoucherType.JournalVoucher) && item?.voucherBalanceType === "cr") ||
                        ((this.selectedVoucherType === AdjustedVoucherType.Purchase || this.selectedVoucherType === AdjustedVoucherType.PurchaseInvoice) && (item?.voucherType === AdjustedVoucherType.Journal || item?.voucherType === AdjustedVoucherType.JournalVoucher) && item?.voucherBalanceType === "cr"))) {
                        totalAmount -= Number(item.adjustmentAmount ? item.adjustmentAmount.amountForAccount : 0);
                    } else {
                        totalAmount += Number(item.adjustmentAmount ? item.adjustmentAmount.amountForAccount : 0);
                    }
                });
            }
            this.totalAdvanceReceiptsAdjustedAmount = totalAmount;
            this.adjustPaymentData.totalAdjustedAmount = this.totalAdvanceReceiptsAdjustedAmount;
            if (this.adjustPaymentData.totalAdjustedAmount > 0) {
                this.isAdjustAmount = true;
            } else {
                this.isAdjustAmount = false;
            }
        } else {
            this.advanceReceiptAdjustmentData.adjustments = [];
        }
    }

    /**
     * To calculate balance due amount after adjustment of advance receipts
     *
     * @returns {number} Balance due amount
     * @memberof VoucherComponent
     */
    public getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment(): number {
        return parseFloat(Number(this.invFormData.voucherDetails.grandTotal + this.invFormData.voucherDetails.tcsTotal - this.adjustPaymentData.totalAdjustedAmount - this.depositAmount - this.invFormData.voucherDetails.tdsTotal).toFixed(this.giddhBalanceDecimalPlaces));
    }

    /**
     * Call API to get all advance receipts of an invoice
     *
     * @param {*} customerUniquename Selected customer unique name
     * @param {*} voucherDate  Voucher Date (GIDDH_DATE_FORMAT) of selected invoice
     * @memberof VoucherComponent
     */
    public getAllAdvanceReceipts(customerUniqueName: string, voucherDate: any): void {
        let date;
        if (typeof voucherDate === 'string') {
            date = voucherDate;
        } else {
            date = dayjs(voucherDate).format(GIDDH_DATE_FORMAT);
        }
        if (customerUniqueName && date) {
            let apiCallObservable: Observable<any>;
            if (this.voucherApiVersion !== 2) {
                const requestObject = {
                    accountUniqueName: customerUniqueName,
                    invoiceDate: date
                };
                apiCallObservable = this.salesService.getAllAdvanceReceiptVoucher(requestObject);
            } else {
                const requestObject = {
                    accountUniqueName: customerUniqueName,
                    voucherType: (this.voucherApiVersion === 2 && this.isPurchaseInvoice) ? VoucherTypeEnum.purchase : (this.voucherApiVersion === 2 && this.isPendingVoucherType) ? this.invoiceType : this.selectedVoucherType
                }
                apiCallObservable = this.salesService.getInvoiceList(requestObject, date);
            }

            apiCallObservable.pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res && res.status === 'success') {
                    const results = (res.body?.results || res.body?.items || res.body);
                    this.voucherForAdjustment = results?.map(result => ({ ...result, adjustmentAmount: { amountForAccount: result.balanceDue?.amountForAccount, amountForCompany: result.balanceDue?.amountForCompany } }));;
                    if (results?.length) {
                        this.isAccountHaveAdvanceReceipts = true;
                    } else {
                        this.isAccountHaveAdvanceReceipts = false;
                    }
                } else {
                    this.isAccountHaveAdvanceReceipts = false;
                }
                this.changeDetectorRef.detectChanges();
            });
        } else {
            this.isAccountHaveAdvanceReceipts = false;
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Scroll to bottom handler
     *
     * @param {string} searchType Search type
     * @memberof VoucherComponent
     */
    public handleScrollEnd(searchType: string): void {
        const query = searchType === SEARCH_TYPE.CUSTOMER ? this.searchCustomerResultsPaginationData.query :
            searchType === SEARCH_TYPE.ITEM ? this.searchItemResultsPaginationData.query :
                searchType === SEARCH_TYPE.BANK ? this.searchBankResultsPaginationData.query : '';
        const page = searchType === SEARCH_TYPE.CUSTOMER ? this.searchCustomerResultsPaginationData.page :
            searchType === SEARCH_TYPE.ITEM ? this.searchItemResultsPaginationData.page :
                searchType === SEARCH_TYPE.BANK ? this.searchBankResultsPaginationData.page : 1;
        if (
            (searchType === SEARCH_TYPE.CUSTOMER) ||
            (searchType === SEARCH_TYPE.ITEM) ||
            (searchType === SEARCH_TYPE.BANK)) {
            this.onSearchQueryChanged(
                query,
                page + 1,
                searchType,
                (response) => {
                    if (!query) {
                        const results = response.map(result => {
                            return {
                                value: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                                label: result.stock ? `${result.name} (${result.stock?.name})` : result.name,
                                additional: result
                            }
                        }) || [];
                        if (searchType === SEARCH_TYPE.CUSTOMER) {
                            this.defaultCustomerSuggestions = this.defaultCustomerSuggestions.concat(...results);
                            this.defaultCustomerResultsPaginationData.page = this.searchCustomerResultsPaginationData.page;
                            this.searchResults = [...this.defaultCustomerSuggestions];
                            this.assignSearchResultToList(SEARCH_TYPE.CUSTOMER);
                            this.makeCustomerList();
                        } else if (searchType === SEARCH_TYPE.ITEM) {
                            this.defaultItemSuggestions = this.defaultItemSuggestions.concat(...results);
                            this.defaultItemResultsPaginationData.page = this.searchItemResultsPaginationData.page;
                            this.searchResults = [...this.defaultItemSuggestions];
                            this.assignSearchResultToList(SEARCH_TYPE.ITEM);
                            this.makeCustomerList();
                        }
                    }
                });
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {string} searchType Type of search to make
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof VoucherComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1, searchType: string, successCallback?: Function): void {
        if (query === undefined || query === null) {
            query = "";
        }
        if (!this.preventDefaultScrollApiCall &&
            (query || (searchType === SEARCH_TYPE.CUSTOMER && this.defaultCustomerSuggestions?.length === 0) ||
                (searchType === SEARCH_TYPE.ITEM && this.defaultItemSuggestions?.length === 0) || successCallback)) {
            if (searchType === SEARCH_TYPE.CUSTOMER) {
                this.searchCustomerResultsPaginationData.query = query;
            } else if (searchType === SEARCH_TYPE.ITEM) {
                this.searchItemResultsPaginationData.query = query;
            } else if (searchType === SEARCH_TYPE.BANK) {
                this.searchBankResultsPaginationData.query = query;
            }
            const requestObject = this.getSearchRequestObject(query, page, searchType);
            if (!this.initialApiCall) {
                this.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data && data.body && data.body.results) {
                        this.initialApiCall = true;
                        this.prepareSearchLists(data.body.results, page, searchType);
                        this.makeCustomerList();
                        this.noResultsFoundLabel = SearchResultText.NotFound;
                        this.changeDetectorRef.detectChanges();
                        if (searchType === SEARCH_TYPE.CUSTOMER) {
                            this.searchCustomerResultsPaginationData.page = data.body.page;
                        } else if (searchType === SEARCH_TYPE.ITEM) {
                            this.searchItemResultsPaginationData.page = data.body.page;
                        } else if (searchType === SEARCH_TYPE.BANK) {
                            this.searchBankResultsPaginationData.page = data.body.page;
                        }
                        if (successCallback) {
                            successCallback(data.body.results);
                        } else {
                            if (searchType === SEARCH_TYPE.CUSTOMER) {
                                this.defaultCustomerResultsPaginationData.page = data.body.page;
                            } else if (searchType === SEARCH_TYPE.ITEM) {
                                this.defaultItemResultsPaginationData.page = data.body.page;
                            }
                        }
                    }
                });
            } else {
                if (this.isAccountSearchData) {
                    this.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                        if (!data?.body?.results?.length || (data?.body?.results?.length && ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT !== data?.body?.count)) {
                            this.isAccountSearchData = false;
                        }
                        if (data && data.body && data.body.results) {
                            this.prepareSearchLists(data.body.results, page, searchType);
                            this.makeCustomerList();
                            this.noResultsFoundLabel = SearchResultText.NotFound;
                            this.changeDetectorRef.detectChanges();
                            if (searchType === SEARCH_TYPE.CUSTOMER) {
                                this.searchCustomerResultsPaginationData.page = data.body.page;
                            } else if (searchType === SEARCH_TYPE.ITEM) {
                                this.searchItemResultsPaginationData.page = data.body.page;
                            } else if (searchType === SEARCH_TYPE.BANK) {
                                this.searchBankResultsPaginationData.page = data.body.page;
                            }
                            if (successCallback) {
                                successCallback(data.body.results);
                            } else {
                                if (searchType === SEARCH_TYPE.CUSTOMER) {
                                    this.defaultCustomerResultsPaginationData.page = data.body.page;
                                } else if (searchType === SEARCH_TYPE.ITEM) {
                                    this.defaultItemResultsPaginationData.page = data.body.page;
                                }
                            }
                        }
                    });
                }
            }

        } else {
            if (searchType === SEARCH_TYPE.CUSTOMER) {
                this.searchResults = [...this.defaultCustomerSuggestions];
                this.searchCustomerResultsPaginationData.page = this.defaultCustomerResultsPaginationData.page;
            } else if (searchType === SEARCH_TYPE.ITEM) {
                this.searchResults = [...this.defaultItemSuggestions];
                this.searchItemResultsPaginationData.page = this.defaultItemResultsPaginationData.page;
            }
            this.assignSearchResultToList(searchType);
            this.makeCustomerList();
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Prepares the search list when the data is received
     *
     * @param {*} results Search results
     * @param {number} [currentPage=1] Current page requested
     * @param {string} searchType Search type of the searched item
     * @memberof VoucherComponent
     */
    public prepareSearchLists(results: any, currentPage: number = 1, searchType: string): void {

        const searchResults = results.map(result => {
            return {
                value: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                label: result.stock ? `${result.name} (${result.stock?.name})` : result.name,
                additional: result
            };
        }) || [];
        if (currentPage === 1) {
            this.searchResults = searchResults;
        } else {
            const results = [
                ...this.searchResults,
                ...searchResults
            ];
            this.searchResults = uniqBy(results, 'value');
        }
        this.assignSearchResultToList(searchType);
    }

    /**
     * Returns the search request object
     *
     * @param {string} query Query to be searched
     * @param {number} [page=1] Page for which search is to be made
     * @param {string} searchType Type of search to be performed
     * @returns {*} Search request object
     * @memberof VoucherComponent
     */
    public getSearchRequestObject(query: string, page: number = 1, searchType: string): any {
        let withStocks: boolean;
        let group: string;
        if (searchType === SEARCH_TYPE.CUSTOMER) {
            this.searchCustomerResultsPaginationData.query = query;
            group = (this.invoiceType === VoucherTypeEnum.debitNote) ? 'sundrycreditors' :
                (this.invoiceType === VoucherTypeEnum.purchase) ?
                    (this.voucherApiVersion === 2) ? 'sundrycreditors' : 'sundrycreditors, bankaccounts, cash' : 'sundrydebtors';
            this.selectedGrpUniqueNameForAddEditAccountModal = (this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase || this.invoiceType === VoucherTypeEnum.cashBill || this.invoiceType === VoucherTypeEnum.cashDebitNote) ?
                'sundrycreditors' : 'sundrydebtors';
        } else if (searchType === SEARCH_TYPE.ITEM) {
            group = (this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase || this.invoiceType === VoucherTypeEnum.cashBill || this.invoiceType === VoucherTypeEnum.cashDebitNote) ?
                'operatingcost, indirectexpenses' : 'otherincome, revenuefromoperations';
            withStocks = !!query;

            if (this.voucherApiVersion === 2) {
                group += ", fixedassets";
            }
        } else if (searchType === SEARCH_TYPE.BANK) {
            group = 'bankaccounts, cash';
            if (this.voucherApiVersion === 2) {
                group += ", loanandoverdraft";
            }
        }
        const requestObject = {
            q: encodeURIComponent(query),
            page,
            group: encodeURIComponent(group),
            count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT
        };
        if (withStocks) {
            requestObject['withStocks'] = withStocks;
        }
        return requestObject;
    }

    /**
     * Searches account
     *
     * @param {*} requestObject Request object
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof VoucherComponent
     */
    public searchAccount(requestObject: any): Observable<any> {
        return this.searchService.searchAccount(requestObject);
    }

    /**
     * Resets the previous search result
     *
     * @param {boolean} shouldShowDefaultList True, if default list should be shown
     * @param {string} searchType Search type made by the user
     * @memberof VoucherComponent
     */
    public resetPreviousSearchResults(shouldShowDefaultList: boolean = false, searchType?: string): void {
        if (shouldShowDefaultList && searchType) {
            this.searchResults = (searchType === SEARCH_TYPE.CUSTOMER) ? [...this.defaultCustomerSuggestions] :
                (searchType === SEARCH_TYPE.ITEM) ? [...this.defaultItemSuggestions] : [];
            if (searchType === SEARCH_TYPE.CUSTOMER) {
                this.searchCustomerResultsPaginationData = {
                    page: 0,
                    count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                    query: ''
                };
            } else if (searchType === SEARCH_TYPE.ITEM) {
                this.searchItemResultsPaginationData = {
                    page: 0,
                    count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                    query: ''
                };
            }
            this.noResultsFoundLabel = SearchResultText.NotFound;
        } else {
            this.searchResults = [];
            this.defaultCustomerSuggestions = [];
            this.defaultItemSuggestions = [];
            this.searchCustomerResultsPaginationData = {
                page: 0,
                count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                query: ''
            };
            this.searchItemResultsPaginationData = {
                page: 0,
                count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                query: ''
            };
            this.searchBankResultsPaginationData = {
                page: 0,
                count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                query: ''
            };
            this.defaultCustomerResultsPaginationData = {
                page: 0,
                count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                query: ''
            };
            this.defaultItemResultsPaginationData = {
                page: 0,
                count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
                query: ''
            };
            this.noResultsFoundLabel = SearchResultText.NewSearch;
        }
    }

    /**
     * Fetches the default template configuration to show placeholder text for template
     * section
     *
     * @private
     * @memberof VoucherComponent
     */
    private getDefaultTemplateData(): void {
        const templateType = [VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote].includes(this.invoiceType) ? 'voucher' : 'invoice';
        this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(templateType));
    }

    /**
     * Sets the template placeholder text based on API response
     *
     * @private
     * @param {CustomTemplateState} templateData Template data received from API
     * @memberof VoucherComponent
     */
    private setTemplatePlaceholder(templateData: CustomTemplateState): void {
        if (templateData && templateData.customCreatedTemplates && templateData.customCreatedTemplates.length > 0) {
            const defaultTemplate = templateData.customCreatedTemplates.find(template => (template.isDefault || template.isDefaultForVoucher));
            if (defaultTemplate && defaultTemplate.sections) {
                const sections = defaultTemplate.sections;
                if (sections.header && sections.header.data) {
                    const {
                        customField1: { label: customField1Label },
                        customField2: { label: customField2Label },
                        customField3: { label: customField3Label },
                        shippedVia: { label: shippedViaLabel },
                        shippingDate: { label: shippedDateLabel },
                        trackingNumber: { label: trackingNumber }
                    } = sections.header.data;
                    this.templatePlaceholder = {
                        customField1Label,
                        customField2Label,
                        customField3Label,
                        shippedViaLabel,
                        shippedDateLabel,
                        trackingNumber
                    };
                }
                if (sections?.footer?.data) {
                    this.showNotesAtLastPage = sections.footer.data.showNotesAtLastPage?.display;
                }
            }
        }
    }

    /**
     * Loads bank and cash account of given currency
     *
     * @private
     * @param {string} customerCurrency Currency of the customer selected
     * @memberof VoucherComponent
     */
    private loadBankCashAccounts(customerCurrency: string, resetDeposit: boolean = true): void {
        if (resetDeposit) {
            this.depositAccountUniqueName = '';
            this.selectedPaymentMode = null;
            this.userDeposit = null;
        }
        let groups = "cash, bankaccounts";
        if (this.voucherApiVersion === 2) {
            groups += ", loanandoverdraft";
        }
        this.salesService.getAccountsWithCurrency(groups, `${customerCurrency}, ${this.companyCurrency}`).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            const bankAccounts = data?.body?.results?.filter(response => response?.uniqueName == this.selectedBankAccount?.toLowerCase());
            if (this.invoiceType == VoucherTypeEnum.cash || this.invoiceType == VoucherTypeEnum.cashBill || this.invoiceType == VoucherTypeEnum.cashDebitNote || this.invoiceType == VoucherTypeEnum.cashCreditNote) {
                if (bankAccounts.length > 0) {
                    this.onSelectPaymentMode({ label: bankAccounts[0]?.name, value: bankAccounts[0]?.uniqueName, additional: bankAccounts[0] });
                }
            }
            this.bankAccounts$ = observableOf(this.updateBankAccountObject(data));
        });
    }

    /**
     * This will hide the edit hsn/sac popup
     *
     * @param {*} transaction
     * @memberof VoucherComponent
     */
    public hideHsnSacEditPopup(transaction: any): void {
        if (transaction.showCodeType === "hsn") {
            transaction.hsnNumber = this.editingHsnSac;
        } else if (transaction.showCodeType === "sac") {
            transaction.sacNumber = this.editingHsnSac;
        }

        this.hsnDropdownShow = !this.hsnDropdownShow;
    }

    /**
     * This will check if we need to exclude tax from total
     *
     * @param {*} data
     * @memberof VoucherComponent
     */
    public checkIfNeedToExcludeTax(data: any): void {
        this.excludeTax = false;
        let isPartyTypeSez = false;
        this.tcsTdsTaxesAccount = [];
        this.accountAssignedApplicableDiscounts = [];
        if (this.isSalesInvoice || this.isCashInvoice || (this.voucherApiVersion === 2 && this.isCreditNote)) {
            if (data && data.addresses && data.addresses.length > 0) {
                data.addresses.forEach(address => {
                    if (address.partyType && address.partyType.toLowerCase() === "sez") {
                        isPartyTypeSez = true;
                    }
                });
            }

            if ((this.companyCountryName === "India" && data.country.countryName !== "India") || isPartyTypeSez) {
                this.excludeTax = true;
            }
        }
        if (data && data.otherApplicableTaxes) {
            data.otherApplicableTaxes.forEach(item => {
                let tax = this.companyTaxesList.find(element => element?.uniqueName === item?.uniqueName);
                if (tax && TCS_TDS_TAXES_TYPES?.indexOf(tax.taxType) > -1) {
                    this.tcsTdsTaxesAccount.push(item);
                }
            });
        }
        // applicableDiscounts: accounts applicable discounts list and inheritedDiscounts: parent group's discount list
        if (data && data.applicableDiscounts && data.applicableDiscounts.length) {
            this.accountAssignedApplicableDiscounts = [...data.applicableDiscounts];
        } else if (data.inheritedDiscounts && data.inheritedDiscounts.length) {
            data.inheritedDiscounts.forEach(element => {
                this.accountAssignedApplicableDiscounts.push(...element.applicableDiscounts)
            });
        }
        this.accountAssignedApplicableDiscounts.map(item => item.isActive = true);
    }

    /**
     * This will get the list of PO by vendor
     *
     * @param {*} vendorName
     * @memberof VoucherComponent
     */
    public getVendorPurchaseOrders(vendorName: any): void {
        let purchaseOrderGetRequest = { companyUniqueName: this.selectedCompany?.uniqueName, accountUniqueName: vendorName, page: 1, count: 100, sort: '', sortBy: '' };
        let purchaseOrderPostRequest = { statuses: [PURCHASE_ORDER_STATUS.open, PURCHASE_ORDER_STATUS.partiallyConverted] };

        if (purchaseOrderGetRequest.companyUniqueName && vendorName) {
            this.purchaseOrders = [];
            this.linkedPoNumbers = [];

            this.purchaseOrderService.getAllPendingPo(purchaseOrderGetRequest, purchaseOrderPostRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    this.purchaseOrders = [];
                    if (res.status === 'success') {
                        if (res.body && res.body && res.body.length > 0) {
                            res.body.forEach(item => {
                                let pending = [];
                                let totalPending = 0;

                                if (item.pendingDetails.stocks) {
                                    pending.push(item.pendingDetails.stocks + ((item.pendingDetails.stocks === 1) ? " " + this.commonLocaleData?.app_product : " " + this.commonLocaleData?.app_products));
                                    totalPending += item.pendingDetails.stocks;
                                }
                                if (item.pendingDetails.services) {
                                    pending.push(item.pendingDetails.services + ((item.pendingDetails.services === 1) ? " " + this.commonLocaleData?.app_service : " " + this.commonLocaleData?.app_services));
                                    totalPending += item.pendingDetails.services;
                                }

                                this.purchaseOrders.push({ label: item.number, value: item?.uniqueName, additional: { grandTotal: item.pendingDetails.grandTotal, pending: pending.join(", "), totalPending: totalPending } });
                                this.filterPurchaseOrder('');
                                this.linkedPoNumbers[item?.uniqueName] = [];
                                this.linkedPoNumbers[item?.uniqueName]['voucherNumber'] = item.number;
                                this.linkedPoNumbers[item?.uniqueName]['items'] = [];
                            });
                        }
                    } else {
                        this.toaster.showSnackBar("error", res.message);
                    }
                }
            });
        }
    }
    /**
     * This will get the PO details
     *
     * @param {*} event
     * @memberof VoucherComponent
     */
    public getPurchaseOrder(event: any, addRemove: boolean): void {
        if (event) {
            let newPo = this.linkedPo?.filter(po => !this.selectedPoItems?.includes(po));
            let selectedOption = this.fieldFilteredOptions?.filter(option => option?.value === newPo[0]);
            let order = selectedOption[0];
            if (order && !this.selectedPoItems.includes(order?.value)) {
                this.startLoader(true);
                let getRequest = { companyUniqueName: this.selectedCompany?.uniqueName, poUniqueName: order?.value };
                this.purchaseOrderService.get(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response) {
                        if (response.status === "success" && response.body) {
                            if (this.linkedPo.includes(response.body.uniqueName)) {
                                if (response.body && response.body.entries && response.body.entries.length > 0) {
                                    this.selectedPoItems.push(response.body.uniqueName);
                                    this.linkedPoNumbers[order?.value]['items'] = response.body.entries;
                                    if (addRemove) {
                                        this.addPoItems(response.body.uniqueName, response.body.entries, order?.additional?.totalPending);
                                    } else {
                                        this.startLoader(false);
                                    }
                                } else {
                                    this.startLoader(false);
                                    this.linkedPoNumbers[order?.value]['items'] = [];
                                }
                            } else {
                                this.startLoader(false);
                            }
                        } else {
                            this.startLoader(false);
                            this.toaster.showSnackBar("error", response.message);
                        }
                    }
                });
            } else {
                if (addRemove) {
                    this.removePoItem();
                }
            }
        } else {
            if (addRemove) {
                this.removePoItem();
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will add the items if linked PO is selected
     *
     * @param {*} entries
     * @memberof VoucherComponent
     */
    public addPoItems(poUniqueName: string, entries: any, totalPending: number): void {
        this.startLoader(true);
        this.linkedPoItemsAdded = 0;
        this.isPoLinkingInProgress = true;
        let blankItemIndex = this.invFormData.entries?.findIndex(entry => !entry.transactions[0].accountUniqueName);
        let isBlankItemPresent;
        let startIndex = this.invFormData.entries?.length;
        if (blankItemIndex > -1) {
            isBlankItemPresent = true;
        } else {
            isBlankItemPresent = false;
        }

        entries?.forEach(entry => {
            let transactionLoop = 0;

            if (entry.totalQuantity && entry.usedQuantity && entry.transactions && entry.transactions[0] && entry.transactions[0].stock) {
                if (this.existingPoEntries[entry.uniqueName]) {
                    entry.transactions[0].stock.quantity = entry.usedQuantity;
                } else {
                    entry.transactions[0].stock.quantity = entry.totalQuantity - entry.usedQuantity;
                }
            }

            entry.transactions?.forEach(item => {
                if (item.stock) {
                    let stockUniqueName = item.stock.uniqueName;
                    item.stock.uniqueName = "purchases#" + item.stock.uniqueName;
                    item.uniqueName = item.stock.uniqueName;
                    item.value = item.stock.uniqueName;
                    item.additional = item.stock;
                    item.additional.uniqueName = "purchases";
                    item.additional.stock = {};
                    item.additional.stock.uniqueName = stockUniqueName;
                    if (this.existingPoEntries[entry.uniqueName]) {
                        item.additional.maxQuantity = this.existingPoEntries[entry?.uniqueName];
                    } else {
                        item.additional.maxQuantity = item.stock.quantity;
                    }
                } else {
                    item.stock = undefined;
                    item.uniqueName = item.account?.uniqueName;
                    item.value = item.account?.uniqueName;
                    item.additional = item.account;
                    if (this.existingPoEntries[entry?.uniqueName]) {
                        item.additional.maxQuantity = this.existingPoEntries[entry?.uniqueName];
                    } else {
                        item.additional.maxQuantity = entry.totalQuantity - entry.usedQuantity;
                    }
                }

                if (item.additional.maxQuantity > 0) {
                    let lastIndex = -1;
                    let blankItemIndex = this.invFormData.entries?.findIndex(f => !f.transactions[transactionLoop].accountUniqueName);

                    if (blankItemIndex > -1) {
                        lastIndex = blankItemIndex;
                        this.invFormData.entries[lastIndex] = new SalesEntryClass();
                    } else {
                        this.invFormData.entries.push(new SalesEntryClass());
                        lastIndex = this.invFormData.entries?.length - 1;
                    }

                    this.activeIndx = lastIndex;
                    const entryDate = this.invFormData.voucherDetails.voucherDate || this.universalDate;

                    if (typeof (entryDate) === "object") {
                        this.invFormData.entries[lastIndex].entryDate = dayjs(entryDate).format(GIDDH_DATE_FORMAT);
                    } else {
                        this.invFormData.entries[lastIndex].entryDate = dayjs(entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    }
                    this.invFormData.entries[lastIndex].transactions[transactionLoop].accountUniqueName = item?.uniqueName;
                    this.invFormData.entries[lastIndex].transactions[transactionLoop].fakeAccForSelect2 = item?.uniqueName;
                    this.invFormData.entries[lastIndex].isNewEntryInUpdateMode = true;
                    this.invFormData.entries[lastIndex].transactions[transactionLoop].description = entry.description;
                    this.invFormData.entries[lastIndex].discounts = this.parsePoDiscountFromResponse(entry);
                    this.invFormData.entries[lastIndex].taxList = entry.taxes.map(tax => tax?.uniqueName);
                    this.invFormData.entries[lastIndex].purchaseOrderItemMapping = { uniqueName: poUniqueName, entryUniqueName: entry?.uniqueName };

                    this.onSelectSalesAccount(item, this.invFormData.entries[lastIndex].transactions[transactionLoop], this.invFormData.entries[lastIndex], false, true, lastIndex);

                    transactionLoop++;
                }
            });
        });

        let buildBulkDataStarted = false;
        let interval = setInterval(() => {
            if (this.linkedPoItemsAdded === totalPending) {
                if (!buildBulkDataStarted) {
                    this.linkedPoItemsAdded = 0;
                    this.isPoLinkingInProgress = false;
                    buildBulkDataStarted = true;
                    clearInterval(interval);
                    this.startLoader(false);
                    this.buildBulkData(this.invFormData.entries?.length, isBlankItemPresent ? 0 : startIndex, isBlankItemPresent);
                }
            }
        }, 500);
    }

    /**
     * This will remove the Items if linked PO is removed
     *
     * @memberof VoucherComponent
     */
    public removePoItem(): void {
        if (this.selectedPoItems && this.selectedPoItems.length > 0) {
            this.startLoader(true);
            setTimeout(() => {
                let selectedPoItems = [];
                this.selectedPoItems?.forEach(order => {
                    if (!this.linkedPo.includes(order)) {
                        let entries = (this.linkedPoNumbers[order]) ? this.linkedPoNumbers[order]['items'] : [];

                        if (entries && entries.length > 0 && this.invFormData.entries && this.invFormData.entries.length > 0) {
                            entries.forEach(entry => {
                                entry.transactions.forEach(item => {
                                    let entryLoop = 0;
                                    let remainingQuantity = (item.stock && item.stock.quantity !== undefined && item.stock.quantity !== null) ? item.stock.quantity : 1;

                                    this.invFormData.entries.forEach(entry => {
                                        let entryRemoved = false;
                                        if (entry && entry.transactions && entry.transactions.length > 0 && remainingQuantity > 0 && entry.purchaseOrderItemMapping && entry.purchaseOrderItemMapping.uniqueName === order) {
                                            let transactionLoop = 0;
                                            entry.transactions.forEach(transaction => {
                                                if (remainingQuantity > 0) {
                                                    let accountUniqueName = transaction.accountUniqueName;
                                                    if (accountUniqueName) {
                                                        accountUniqueName = accountUniqueName?.replace("purchases#", "");
                                                    }

                                                    let stockUniqueName = (item.stock && item.stock.uniqueName) ? item.stock.uniqueName : "";
                                                    if (stockUniqueName) {
                                                        stockUniqueName = stockUniqueName?.replace("purchases#", "");
                                                    }

                                                    if (item.stock && item.stock.uniqueName && accountUniqueName) {
                                                        if (stockUniqueName === accountUniqueName) {
                                                            if (transaction.quantity > remainingQuantity) {
                                                                this.invFormData.entries[entryLoop].transactions[transactionLoop].quantity = transaction.quantity - remainingQuantity;
                                                                remainingQuantity -= remainingQuantity;
                                                            } else {
                                                                remainingQuantity -= transaction.quantity;
                                                                entryRemoved = true;
                                                                this.removeTransaction(entryLoop);
                                                            }
                                                        }
                                                    } else if (item.account && item.account.uniqueName && accountUniqueName) {
                                                        if (item.account.uniqueName === accountUniqueName) {
                                                            remainingQuantity = 0;
                                                            entryRemoved = true;
                                                            this.removeTransaction(entryLoop);
                                                        }
                                                    }
                                                }
                                                transactionLoop++;
                                            });
                                        }
                                        if (!entryRemoved) {
                                            entryLoop++;
                                        }
                                    });
                                });
                            });
                        }
                    } else {
                        selectedPoItems.push(order);
                    }
                });

                this.selectedPoItems = selectedPoItems;

                this.startLoader(false);
            }, 100);
        }
    }

    /**
     * This will autofill billing details into shipping for company
     *
     * @memberof VoucherComponent
     */
    public autoFillCompanyShippingDetails(): void {
        if (this.autoFillCompanyShipping) {
            this.purchaseBillCompany.shippingDetails = cloneDeep(this.purchaseBillCompany.billingDetails);
            if (this.shippingStateCompany && this.shippingStateCompany.nativeElement) {
                this.shippingStateCompany.nativeElement.classList.remove('error-box');
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will assign data into state object
     *
     * @param {*} event
     * @param {boolean} isBilling
     * @memberof VoucherComponent
     */
    public fillShippingBillingCompanyDetails(event: any, isBilling: boolean): void {
        let stateName = event.label;
        let stateCode = event?.value;

        if (isBilling) {
            // update account details address if it's billing details
            if (this.billingStateCompany && this.billingStateCompany.nativeElement) {
                this.billingStateCompany.nativeElement.classList.remove('error-box');
            }
            if (this.isCashInvoice || this.customerCountryCode === 'IN') {
                this.purchaseBillCompany.billingDetails.state.name = stateName;
                this.purchaseBillCompany.billingDetails.stateName = stateName;
                this.purchaseBillCompany.billingDetails.stateCode = stateCode;
                this.purchaseBillCompany.billingDetails.state.code = stateCode;
            } else {
                this.purchaseBillCompany.billingDetails.county.name = stateName;
                this.purchaseBillCompany.billingDetails.county.code = stateCode;
            }
        } else {
            if (this.shippingStateCompany && this.shippingStateCompany.nativeElement) {
                this.shippingStateCompany.nativeElement.classList.remove('error-box');
            }
            // if it's not billing address then only update shipping details
            // check if it's not auto fill shipping address from billing address then and then only update shipping details
            if (!this.autoFillCompanyShipping) {
                if (this.isCashInvoice || this.customerCountryCode === 'IN') {
                    this.purchaseBillCompany.shippingDetails.stateName = stateName;
                    this.purchaseBillCompany.shippingDetails.stateCode = stateCode;
                    this.purchaseBillCompany.shippingDetails.state.name = stateName;
                    this.purchaseBillCompany.shippingDetails.state.code = stateCode;
                } else {
                    this.purchaseBillCompany.shippingDetails.county.name = stateName;
                    this.purchaseBillCompany.shippingDetails.county.code = stateCode;
                }
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will assign state based on GST/TRN
     *
     * @param {string} type
     * @memberof VoucherComponent
     */
    public getStateCodeCompany(type: string): void {
        let gstVal = cloneDeep(this.purchaseBillCompany[type].gstNumber)?.toString();
        if (gstVal && gstVal.length >= 2) {
            const selectedState = this.companyStatesSource.find(item => item.stateGstCode === gstVal.substring(0, 2));
            if (selectedState) {
                this.purchaseBillCompany[type].stateCode = selectedState.value;
                this.purchaseBillCompany[type].state.code = selectedState.value;
            } else {
                this.purchaseBillCompany[type].stateCode = null;
                this.purchaseBillCompany[type].state.code = null;
            }
        } else {
            this.purchaseBillCompany[type].stateCode = null;
            this.purchaseBillCompany[type].state.code = null;
        }
        this.checkGstNumValidation(gstVal);
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will assign company billing/shipping in deliver to
     *
     * @param {*} company
     * @memberof VoucherComponent
     */
    public assignCompanyBillingShipping(company: any): void {
        if (company.billingDetails && company.shippingDetails) {
            this.purchaseBillCompany = {
                billingDetails: {
                    index: 0,
                    address: company?.billingDetails?.address,
                    state: { code: company?.billingDetails?.state?.code, name: company?.billingDetails?.state?.name },
                    county: { code: company?.billingDetails?.county?.code, name: company?.billingDetails?.county?.name },
                    gstNumber: company?.billingDetails?.gstNumber ?? company?.billingDetails?.taxNumber,
                    stateName: company?.billingDetails?.state?.name,
                    stateCode: company?.billingDetails?.state?.code,
                    pincode: company?.billingDetails?.pincode
                },
                shippingDetails: {
                    index: 0,
                    address: company?.shippingDetails?.address,
                    state: { code: company?.shippingDetails?.state?.code, name: company?.shippingDetails?.state?.name },
                    county: { code: company?.shippingDetails?.county?.code, name: company?.shippingDetails?.county?.name },
                    gstNumber: company?.shippingDetails?.gstNumber ?? company?.shippingDetails?.taxNumber,
                    stateName: company?.shippingDetails?.state?.name,
                    stateCode: company?.shippingDetails?.state?.code,
                    pincode: company?.shippingDetails?.pincode
                }
            }
            this.autoFillCompanyShipping = isEqual(this.purchaseBillCompany.billingDetails, this.purchaseBillCompany.shippingDetails);
        }
    }

    /**
     * This will autofill the
     *
     * @memberof VoucherComponent
     */
    public fillDeliverToAddress(): void {
        let branches = [];
        let currentBranch;
        this.isDeliverAddressFilled = false;
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.length && !this.isDeliverAddressFilled) {
                branches = response;

                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    currentBranch = branches.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
                } else {
                    // Find the HO branch
                    currentBranch = branches.find(branch => !branch.parentBranch);
                }
                if (currentBranch && currentBranch.addresses) {
                    const defaultAddress = currentBranch.addresses.find(address => (address && address.isDefault));
                    if (defaultAddress) {
                        this.purchaseBillCompany.billingDetails.address = [];
                        this.purchaseBillCompany.billingDetails.address.push(defaultAddress.address);
                        this.purchaseBillCompany.billingDetails.state.code = defaultAddress.stateCode;
                        this.purchaseBillCompany.billingDetails.state.name = defaultAddress.stateName;
                        this.purchaseBillCompany.billingDetails.stateCode = defaultAddress.stateCode;
                        this.purchaseBillCompany.billingDetails.stateName = defaultAddress.stateName;
                        this.purchaseBillCompany.billingDetails.gstNumber = defaultAddress.gstNumber ?? defaultAddress.taxNumber;
                        this.purchaseBillCompany.billingDetails.pincode = defaultAddress.pincode;
                        this.purchaseBillCompany.billingDetails.county.code = defaultAddress?.county?.code;
                        this.purchaseBillCompany.billingDetails.county.name = defaultAddress?.county?.name;
                        this.isDeliverAddressFilled = true;
                    }
                }
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will autofill warehouse address
     *
     * @param {*} warehouse
     * @memberof VoucherComponent
     */
    public autoFillDeliverToWarehouseAddress(warehouse: any): void {
        if (warehouse) {
            if (warehouse.addresses && warehouse.addresses.length) {
                // Search the default linked address of warehouse
                const defaultAddress = warehouse.addresses.find(address => address.isDefault);
                if (defaultAddress) {
                    this.purchaseBillCompany.shippingDetails.address = [];
                    this.purchaseBillCompany.shippingDetails.address.push(defaultAddress.address);
                    this.purchaseBillCompany.shippingDetails.state.code = defaultAddress.stateCode;
                    this.purchaseBillCompany.shippingDetails.state.name = defaultAddress.stateName;
                    this.purchaseBillCompany.shippingDetails.stateCode = defaultAddress.stateCode;
                    this.purchaseBillCompany.shippingDetails.stateName = defaultAddress.stateName;
                    this.purchaseBillCompany.shippingDetails.gstNumber = defaultAddress.gstNumber ?? defaultAddress.taxNumber;
                    this.purchaseBillCompany.shippingDetails.pincode = defaultAddress.pincode;
                    this.purchaseBillCompany.shippingDetails.county.code = defaultAddress?.county?.code;
                    this.purchaseBillCompany.shippingDetails.county.name = defaultAddress?.county?.name;
                } else {
                    this.resetShippingAddress();
                }
            } else {
                this.resetShippingAddress();
            }
        } else {
            this.resetShippingAddress();
        }
    }

    /**
     Resets the shipping address if no default linked address is
     * found in a warehouse
     *
     * @memberof VoucherComponent
     */
    public resetShippingAddress(): void {
        this.purchaseBillCompany.shippingDetails.address = [];
        this.purchaseBillCompany.shippingDetails.state.code = "";
        this.purchaseBillCompany.shippingDetails.stateCode = "";
        this.purchaseBillCompany.shippingDetails.state.name = "";
        this.purchaseBillCompany.shippingDetails.stateName = "";
        this.purchaseBillCompany.shippingDetails.gstNumber = "";
        this.purchaseBillCompany.shippingDetails.county.code = "";
        this.purchaseBillCompany.shippingDetails.county.code = "";
    }

    /**
     * Callback for warehouse
     *
     * @param {*} warehouse
     * @memberof VoucherComponent
     */
    public onSelectWarehouse(warehouse: any): void {
        this.selectedWarehouse = warehouse?.value;
        this.selectedWarehouseName = warehouse?.label;
        if (this.isPurchaseInvoice) {
            this.autoFillDeliverToWarehouseAddress(warehouse);
        }
    }

    /**
     * To get tax list and assign values to local variables
     *
     * @memberof VoucherComponent
     */
    public getAllDiscounts(): void {
        this.store.pipe(select(p => p.company && p.company.isGetTaxesSuccess), takeUntil(this.destroyed$)).subscribe(isGetTaxes => {
            if (isGetTaxes) {
                this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$)).subscribe((o: TaxResponse[]) => {
                    if (o) {
                        this.companyTaxesList = o;
                        this.theadArrReadOnly.forEach((item: IContentCommon) => {
                            // show tax label
                            if (item.label === 'Tax') {
                                item.display = true;
                            }
                            return item;
                        });
                        this.companyTaxesList.forEach((tax) => {
                            if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                                this.allowedSelectionOfAType.type.push(tax.taxType);
                            }
                        });
                    } else {
                        this.companyTaxesList = [];
                        this.allowedSelectionOfAType.type = [];
                    }
                });
            }
        });
    }

    /**
     * Loads the default search suggestion for customer and item when voucher module is loaded and
     * when voucher is changed
     *
     * @private
     * @memberof VoucherComponent
     */
    private loadDefaultSearchSuggestions(): void {
        this.onSearchQueryChanged('', 1, SEARCH_TYPE.CUSTOMER, (response) => {
            let selectedAccountDetails;
            if (this.isUpdateMode) {
                this.selectedAccountDetails$?.pipe(take(1)).subscribe(accountDetails => {
                    selectedAccountDetails = accountDetails;
                });
                if (selectedAccountDetails) {
                    response.unshift({
                        name: selectedAccountDetails.name,
                        uniqueName: selectedAccountDetails.uniqueName
                    });
                }
            }
            const results = response.map(result => {
                return {
                    value: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                    label: result.stock ? `${result.name} (${result.stock?.name})` : result.name,
                    additional: result
                }
            }) || [];
            this.defaultCustomerSuggestions = uniqBy(results, 'value');
            this.noResultsFoundLabel = SearchResultText.NotFound;
            this.searchResults = [
                ...this.defaultCustomerSuggestions
            ];
            this.assignSearchResultToList(SEARCH_TYPE.CUSTOMER);
            this.makeCustomerList();
        });
        this.onSearchQueryChanged('', 1, SEARCH_TYPE.ITEM, (response) => {
            this.defaultItemSuggestions = response.map(result => {
                return {
                    value: result.stock ? `${result?.uniqueName}#${result.stock?.uniqueName}` : result?.uniqueName,
                    label: result.stock ? `${result.name} (${result.stock?.name})` : result.name,
                    additional: result
                }
            }) || [];
            this.noResultsFoundLabel = SearchResultText.NotFound;
        });
    }

    /**
     * Assigns the search results based on invoice type and search type
     *
     * @private
     * @param {string} searchType Search type made by the user
     * @memberof VoucherComponent
     */
    private assignSearchResultToList(searchType: string): void {

        if (searchType === SEARCH_TYPE.CUSTOMER) {
            if (this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase) {
                this.sundryCreditorsAcList = this.searchResults;
            } else {
                this.sundryDebtorsAcList = this.searchResults;
            }
        } else if (searchType === SEARCH_TYPE.ITEM) {
            if (this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase) {
                this.prdSerAcListForCred = this.searchResults;
            } else {
                this.prdSerAcListForDeb = this.searchResults;
            }
        } else if (searchType === SEARCH_TYPE.BANK) {
            const searchResultsOfSameCurrency = this.searchResults ? this.searchResults?.filter(result =>
                !result.additional?.currency || result.additional?.currency === this.customerCurrencyCode || result.additional?.currency === this.companyCurrency
            ) : [];
            this.bankAccounts$ = observableOf(orderBy(searchResultsOfSameCurrency, 'label'));
        }
    }

    /**
     * This will parse the discount response from PO and will return discount response required
     *
     * @private
     * @param {SalesEntryClass} entry
     * @returns {LedgerDiscountClass[]}
     * @memberof VoucherComponent
     */
    private parsePoDiscountFromResponse(entry: SalesEntryClass): LedgerDiscountClass[] {
        let discountArray: LedgerDiscountClass[] = [];

        if (entry.discounts) {
            entry.discounts.forEach((discount) => {
                discountArray.push({
                    discountType: discount?.calculationMethod,
                    amount: discount?.discountValue,
                    name: discount?.name,
                    particular: discount?.uniqueName,
                    isActive: true,
                    discountValue: discount?.discountValue,
                    discountUniqueName: discount?.uniqueName
                });

            });
        }

        return discountArray;
    }

    /**
     * This will handle date change modal confirmation
     *
     * @param {string} action
     * @memberof VoucherComponent
     */
    public handleDateChangeConfirmation(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            if (this.dateChangeType === "voucher") {
                this.invFormData.entries.forEach(entry => {
                    entry.entryDate = dayjs(this.invFormData.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
                });
            } else if (this.dateChangeType === "entry") {
                let entryLoop = 0;
                this.invFormData.entries.forEach(entry => {
                    if (entryLoop !== this.updatedEntryIndex) {
                        if (typeof (this.invFormData.entries[this.updatedEntryIndex].entryDate) === "object") {
                            entry.entryDate = dayjs(this.invFormData.entries[this.updatedEntryIndex]?.entryDate).format(GIDDH_DATE_FORMAT);
                        } else {
                            entry.entryDate = dayjs(this.invFormData.entries[this.updatedEntryIndex]?.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                        }
                    }
                    entryLoop++;
                });
            }
        }

        this.dialog.closeAll();
    }

    /**
     * Callback for entry date change
     *
     * @param {number} entryIdx
     * @memberof VoucherComponent
     */
    public onBlurEntryDate(entryIdx: number, isDatepickerOpen: boolean): void {
        if (typeof (this.invFormData.entries[entryIdx]?.entryDate) === "object") {
            this.invFormData.entries[entryIdx].entryDate = dayjs(this.invFormData.entries[entryIdx]?.entryDate).format(GIDDH_DATE_FORMAT);
        } else {
            this.invFormData.entries[entryIdx].entryDate = this.invFormData.entries[entryIdx]?.entryDate;
        }

        if (!this.isEntryDateChangeConfirmationDisplayed && isDatepickerOpen && this.invFormData.entries && this.invFormData.entries.length > 1) {
            this.isEntryDateChangeConfirmationDisplayed = true;
            this.dateChangeType = "entry";
            this.updatedEntryIndex = entryIdx;
            this.dateChangeConfiguration = this.generalService.getDateChangeConfiguration(this.localeData, this.commonLocaleData, false);
            this.dialog.open(this.dateChangeConfirmationModel, {
                width: '650px',
            });
        }
    }

    /**
     * This will update due date based on invoice date
     *
     * @memberof VoucherComponent
     */
    public updateDueDate(): void {
        this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$)).subscribe(invoiceSettings => {
            if (invoiceSettings) {
                let duePeriod: number;
                if (this.isEstimateInvoice) {
                    duePeriod = invoiceSettings.estimateSettings ? invoiceSettings.estimateSettings.duePeriod : 0;
                } else if (this.isProformaInvoice) {
                    duePeriod = invoiceSettings.proformaSettings ? invoiceSettings.proformaSettings.duePeriod : 0;
                } else {
                    duePeriod = invoiceSettings.invoiceSettings ? invoiceSettings.invoiceSettings.duePeriod : 0;
                    this.useCustomInvoiceNumber = invoiceSettings.invoiceSettings ? invoiceSettings.invoiceSettings.useCustomInvoiceNumber : false;
                }

                if (this.invFormData.voucherDetails.voucherDate) {
                    if (typeof (this.invFormData.voucherDetails.voucherDate) === "object") {
                        this.invFormData.voucherDetails.dueDate = duePeriod > 0 ? dayjs(this.invFormData.voucherDetails.voucherDate).add(duePeriod, 'day').toDate() : dayjs(this.invFormData.voucherDetails.voucherDate).toDate();
                    } else {
                        this.invFormData.voucherDetails.dueDate = duePeriod > 0 ? dayjs(this.invFormData.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).add(duePeriod, 'day').toDate() : dayjs(this.invFormData.voucherDetails.voucherDate, GIDDH_DATE_FORMAT).toDate();
                    }
                }
            }
        });
    }

    /**
     * This will hold voucher date for comparision after change
     *
     * @memberof VoucherComponent
     */
    public onFocusInvoiceDate(): void {
        this.voucherDateBeforeUpdate = this.invFormData.voucherDetails.voucherDate;
    }

    /**
     * This will be use for set index according billing shipping for account and company
     *
     * @param {*} type
     * @param {number} index
     * @memberof VoucherComponent
     */
    public setIndex(type: any, index: number): void {
        if (type === 'accountBilling') {
            this.accountBillingIndex = index + 1;
        }
        if (type === 'accountShipping') {
            this.accountShippingIndex = index + 1;
        }
        if (type === 'purchaseBilling') {
            this.purchaseBillingIndex = index + 1;
        }
        if (type === 'purchaseShipping') {
            this.purchaseShippingIndex = index + 1;
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will fill the selected address
     *
     * @param {*} data
     * @param {*} address
     * @param {boolean} isCompanyAddress
     * @memberof VoucherComponent
     */
    public selectAddress(type: any, data: any, address: any, isCompanyAddress: boolean = false, index: number): void {
        if (data && address) {
            data.address[0] = address.address;
            this.setIndex(type, index);
            if (!data.state) {
                data.state = {};
            }
            data.state.code = (isCompanyAddress) ? address.stateCode : (address.state) ? address.state.code : "";
            if (data.county) {
                data.county.code = address.county ? address.county?.code : "";
                data.county.name = address.county ? address.county?.name : "";
            }
            data.stateCode = data.state.code;
            data.state.name = (isCompanyAddress) ? address.stateName : (address.state) ? address.state.name : "";
            data.stateName = data.state.name;
            data.gstNumber = (isCompanyAddress) ? (address.gstNumber ?? address.taxNumber) : address.gstNumber;
            data.pincode = address.pincode;
            if (isCompanyAddress) {
                this.autoFillCompanyShippingDetails();
            } else {
                this.autoFillShippingDetails();
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Recalculates the entries total value
     *
     * @private
     * @memberof VoucherComponent
     */
    private recalculateEntriesTotal(): void {
        this.updateStockEntries();
        this.loadTaxesAndDiscounts(0);
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
    }

    /**
     * Creates the view progressively for bulk entries
     *
     * @private
     * @param {number} length Total length of the entries formed after bulk items are added
     * @param {number} startIndex Start index of the bulk items (the index from which progressive rendering will start)
     * @param {boolean} [isBlankItemInBetween] True, if any blank item is found in between
     * @memberof VoucherComponent
     */
    private buildBulkData(length: number, startIndex: number, isBlankItemInBetween?: boolean): void {
        if (startIndex === 0 && this.container?.length) {
            this.container.clear();
        }
        const ITEMS_RENDERED_AT_ONCE = 20;
        const INTERVAL_IN_MS = 50;

        let currentIndex = startIndex;

        const interval = setInterval(() => {
            const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

            for (let entryIndex = currentIndex; entryIndex <= nextIndex; entryIndex++) {
                if (entryIndex >= length) {
                    // Last element is rendered, stop the loader
                    this.startLoader(false);
                    this.activeIndx = null;
                    clearInterval(interval);
                    if (isBlankItemInBetween) {
                        this.loadTaxesAndDiscounts(0);
                    } else {
                        this.loadTaxesAndDiscounts(startIndex);
                    }
                    break;
                }
                this.createEmbeddedViewAtIndex(entryIndex);
            }
            currentIndex += (ITEMS_RENDERED_AT_ONCE + 1);
        }, INTERVAL_IN_MS);
    }

    /**
     * Loads the taxes and discounts for each entry for progressive calculation
     * loops around the item to fetch the values in template
     *
     * @private
     * @param {number} startIndex Start index for the calculation
     * @memberof VoucherComponent
     */
    private loadTaxesAndDiscounts(startIndex: number): void {
        if (startIndex < this.invFormData.entries?.length) {
            this.showBulkLoader = true;
        }
        for (let index = startIndex; index < this.invFormData.entries?.length; index++) {
            setTimeout(() => {
                this.activeIndx = index;
                if (index === (this.invFormData.entries?.length - 1)) {
                    this.showBulkLoader = false;
                }
                this.changeDetectorRef.detectChanges();
            }, 30 * index);
        }
    }

    /**
     * Creates the embedded view at specific index
     *
     * @private
     * @params entryIndex {number} Index of current entry
     * @memberof VoucherComponent
     */
    private createEmbeddedViewAtIndex(entryIndex: number): void {
        const context = {
            $implicit: this.invFormData.entries[entryIndex],
            transaction: this.invFormData.entries[entryIndex].transactions[0],
            entryIdx: entryIndex
        };
        if (this.template) {
            const view = this.template?.createEmbeddedView(context);
            this.container.insert(view);
        }
    }

    /**
     * Opens product dropdown
     *
     * @private
     * @memberof VoucherComponent
     */
    public openProductDropdown(): void {
        if ((this.invFormData?.voucherDetails?.customerUniquename || this.invFormData?.voucherDetails?.customerName) && !this.isEinvoiceGenerated) {
            setTimeout(() => {
                const salesSelect: any = !this.isMobileScreen ? this.selectAccount?.first : this.selectAccount?.last;
                if (salesSelect) {
                    salesSelect.openDropdownPanel();
                }
            }, 200);
        }
    }

    /**
     * Focuses on description field
     *
     * @private
     * @memberof VoucherComponent
     */
    private focusOnDescription(): void {
        setTimeout(() => {
            let description = !this.isMobileScreen ? this.description?.first : this.description?.last;
            if (description) {
                description?.nativeElement?.focus();
            }
        }, 200);
    }

    /**
     * Calculates converted total
     *
     * @private
     * @param {SalesEntryClass} entry Entry instance
     * @param {SalesTransactionItemClass} transaction Transaction instance
     * @memberof VoucherComponent
     */
    private calculateConvertedTotal(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        if (this.excludeTax || this.isRcmEntry) {
            transaction.total = giddhRoundOff((transaction.amount - entry.discountSum), this.giddhBalanceDecimalPlaces);
            if (transaction.isStockTxn) {
                transaction.convertedTotal = giddhRoundOff((transaction.quantity * transaction.rate * this.exchangeRate) - (entry.discountSum * this.exchangeRate), this.giddhBalanceDecimalPlaces);
            } else {
                transaction.convertedTotal = giddhRoundOff(transaction.total * this.exchangeRate, this.giddhBalanceDecimalPlaces);
            }
        } else {
            transaction.total = giddhRoundOff((transaction.amount - entry.discountSum) + (entry.taxSum + entry.cessSum), this.giddhBalanceDecimalPlaces);
            if (transaction.isStockTxn) {
                transaction.convertedTotal = giddhRoundOff(((transaction.quantity * transaction.rate * this.exchangeRate) - (entry.discountSum * this.exchangeRate)) + ((entry.taxSum * this.exchangeRate) + (entry.cessSum * this.exchangeRate)), this.giddhBalanceDecimalPlaces);
            } else {
                transaction.convertedTotal = giddhRoundOff(transaction.total * this.exchangeRate, this.giddhBalanceDecimalPlaces);
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof VoucherComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.customerPlaceHolder = this.localeData?.select_customer;
            this.customerNotFoundText = this.localeData?.add_customer;
            if (this.voucherApiVersion === 2) {
                if (this.isDebitNote || this.isCreditNote) {
                    this.invoiceNoLabel = this.commonLocaleData?.app_reference_invoice;
                } else {
                    this.invoiceNoLabel = this.commonLocaleData.app_number;
                }
            } else {
                this.invoiceNoLabel = this.localeData?.invoice_no;
            }
            this.invoiceDateLabel = this.commonLocaleData?.app_invoice_date;
            this.invoiceDueDateLabel = this.localeData?.invoice_due_date;
            this.pageList[0].label = this.localeData?.invoice_types?.sales;
            this.pageList[1].label = this.localeData?.invoice_types?.credit_note;
            this.pageList[2].label = this.localeData?.invoice_types?.debit_note;
            this.pageList[3].label = this.localeData?.invoice_types?.purchase;
            this.pageList[4].label = this.localeData?.invoice_types?.proforma;
            this.pageList[5].label = this.localeData?.invoice_types?.estimate;

            this.pageList[0].additional.label = this.localeData?.invoice_types?.sales;
            this.pageList[1].additional.label = this.localeData?.invoice_types?.credit_note;
            this.pageList[2].additional.label = this.localeData?.invoice_types?.debit_note;
            this.pageList[3].additional.label = this.localeData?.invoice_types?.purchase;
            this.pageList[4].additional.label = this.localeData?.invoice_types?.proforma;
            this.pageList[5].additional.label = this.localeData?.invoice_types?.estimate;

            this.getItemColumns();
            this.getCopyPreviousInvoiceText();
            this.getGenerateInvoiceText();
            this.getUpdateInvoiceText();
            this.prepareInvoiceTypeFlags();
            this.getInvoiceType();
            if (this.isDebitNote) {
                this.invoiceNoLabel = this.localeData?.bill_number;
            }
        }
    }

    /**
     * This will use for get voucher type
     *
     * @param {*} type
     * @return {*}  {*}
     * @memberof VoucherComponent
     */
    public getVoucherType(type: any): any {
        if (type === VoucherTypeEnum.cashBill) {
            return VoucherTypeEnum.purchase;
        }
        if (type === VoucherTypeEnum.cashCreditNote) {
            return VoucherTypeEnum.creditNote;
        }
        if (type === VoucherTypeEnum.cashDebitNote) {
            return VoucherTypeEnum.debitNote;
        }
        return type;
    }

    /**
     * This will get copy previous invoice text
     *
     * @memberof VoucherComponent
     */
    public getCopyPreviousInvoiceText(): void {
        let invoiceTypeObj = this.getVoucherType(this.invoiceType);
        this.copyPreviousInvoiceText = (this.isCreditNote || this.isDebitNote) ? this.localeData?.copy_previous_dr_cr : this.localeData?.copy_previous_invoices;
        let invoiceType = this.voucherTypeToNamePipe.transform(invoiceTypeObj);
        invoiceType = this.titleCasePipe.transform(invoiceType);
        this.copyPreviousInvoiceText = this.copyPreviousInvoiceText?.replace("[INVOICE_TYPE]", invoiceType);
    }

    /**
     * This will get generate invoice text
     *
     * @memberof VoucherComponent
     */
    public getGenerateInvoiceText(): void {
        this.generateInvoiceText = this.localeData?.generate_invoice;
        let invoiceType = ((this.invoiceType === 'proforma' || this.invoiceType === 'proformas') ? this.localeData?.invoice_types?.proforma
            : (this.invoiceType === 'estimate' || this.invoiceType === 'estimates') ? this.localeData?.invoice_types?.estimate
                : (this.invoiceType === 'sales') ? this.localeData?.invoice_types?.sales : (this.invoiceType === 'credit note') ? this.localeData?.invoice_types?.credit_note : (this.invoiceType === 'debit note') ? this.localeData?.invoice_types?.debit_note : (this.invoiceType === 'purchase') ? this.localeData?.invoice_types?.purchase : (this.invoiceType === 'cash') ? this.localeData?.invoice_types?.cash
                    : (this.invoiceType === 'cash bill') ? this.localeData?.invoice_types?.cash_bill : (this.invoiceType === 'cash credit note') ? this.localeData?.invoice_types?.cash_credit_note : (this.invoiceType === 'cash debit note') ? this.localeData?.invoice_types?.cash_debit_note : this.invoiceType);
        invoiceType = this.titleCasePipe.transform(invoiceType);
        this.generateInvoiceText = this.generateInvoiceText?.replace("[INVOICE_TYPE]", invoiceType);
        this.invoiceTypeLabel = invoiceType;
    }

    /**
     * This will get update invoice text
     *
     * @memberof VoucherComponent
     */
    public getUpdateInvoiceText(): void {
        this.updateInvoiceText = this.localeData?.update_invoice;
        let invoiceType = ((this.invoiceType === 'proforma' || this.invoiceType === 'proformas') ? this.localeData?.invoice_types?.proforma
            : (this.invoiceType === 'estimate' || this.invoiceType === 'estimates') ? this.localeData?.invoice_types?.estimate
                : (this.invoiceType === 'sales') ? this.localeData?.invoice_types?.sales : (this.invoiceType === 'credit note') ? this.localeData?.invoice_types?.credit_note : (this.invoiceType === 'debit note') ? this.localeData?.invoice_types?.debit_note : (this.invoiceType === 'purchase') ? this.localeData?.invoice_types?.purchase : (this.invoiceType === 'cash') ? this.localeData?.invoice_types?.cash
                    : (this.invoiceType === 'cash bill') ? this.localeData?.invoice_types?.cash_bill : (this.invoiceType === 'cash credit note') ? this.localeData?.invoice_types?.cash_credit_note : (this.invoiceType === 'cash debit note') ? this.localeData?.invoice_types?.cash_debit_note : this.invoiceType);
        invoiceType = this.titleCasePipe.transform(invoiceType);
        this.updateInvoiceText = this.updateInvoiceText?.replace("[INVOICE_TYPE]", invoiceType);
        this.invoiceTypeLabel = invoiceType;
    }

    /**
     * This will get text for item table
     *
     * @memberof VoucherComponent
     */
    public getItemColumns(): void {
        this.theadArrReadOnly = [
            {
                display: true,
                label: '#'
            },
            {
                display: true,
                label: this.localeData?.product_service_description
            },
            {
                display: !this.currentVoucherFormDetails || this.currentVoucherFormDetails?.quantityAllowed,
                label: this.commonLocaleData?.app_quantity_unit
            },
            {
                display: !this.currentVoucherFormDetails || this.currentVoucherFormDetails?.rateAllowed,
                label: this.commonLocaleData?.app_rate
            },
            {
                display: true,
                label: this.commonLocaleData?.app_amount
            },
            {
                display: !this.currentVoucherFormDetails || this.currentVoucherFormDetails?.discountAllowed,
                label: this.commonLocaleData?.app_discount
            },
            {
                display: !this.currentVoucherFormDetails || this.currentVoucherFormDetails?.taxesAllowed,
                label: this.commonLocaleData?.app_tax
            },
            {
                display: true,
                label: this.commonLocaleData?.app_total
            },
            {
                display: false,
                label: ''
            }
        ];
    }

    /**
     * Recalculates the converted total amount for each entry when
     * the grand total amount in company currency is updated
     *
     * @memberof VoucherComponent
     */
    public recalculateConvertedTotal(): void {
        if (this.invFormData.entries && this.invFormData.entries.length) {
            this.invFormData.entries.forEach(entry => {
                const transaction = entry.transactions[0];
                this.calculateConvertedTotal(entry, transaction);
            });
        }
    }

    /**
     * This function will redirect to invoice pending after once after voucher process has been completed
     *
     * @memberof VoucherComponent
     */
    public showInvoicePending(): void {
        if (this.isPendingVoucherType) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            this.cancelVoucherUpdate.emit(true);
            this.router.navigate(['/pages', 'invoice', 'preview', 'pending', 'sales']);
        }
    }

    /**
     * This will return selected voucher type
     *
     * @returns {string}
     * @memberof VoucherComponent
     */
    public getInvoiceType(): string {
        let invoiceType = "";
        switch (this.invoiceType) {
            case VoucherTypeEnum.proforma:
                invoiceType = this.localeData?.invoice_types?.proforma;
                break;

            case VoucherTypeEnum.generateProforma:
                invoiceType = this.localeData?.invoice_types?.proforma;
                break;

            case VoucherTypeEnum.estimate:
                invoiceType = this.localeData?.invoice_types?.estimate;
                break;

            case VoucherTypeEnum.generateEstimate:
                invoiceType = this.localeData?.invoice_types?.estimate;
                break;

            case VoucherTypeEnum.sales:
                invoiceType = this.localeData?.invoice_types?.sales;
                break;

            case VoucherTypeEnum.creditNote:
                invoiceType = this.localeData?.invoice_types?.credit_note;
                break;

            case VoucherTypeEnum.debitNote:
                invoiceType = this.localeData?.invoice_types?.debit_note;
                break;

            case VoucherTypeEnum.purchase:
                invoiceType = this.localeData?.invoice_types?.purchase;
                break;
            case VoucherTypeEnum.cashBill:
                invoiceType = this.localeData?.invoice_types?.cash_bill;
                break;
            case VoucherTypeEnum.cashCreditNote:
                invoiceType = this.localeData?.invoice_types?.cash_credit_note;
                break;
            case VoucherTypeEnum.cashDebitNote:
                invoiceType = this.localeData?.invoice_types?.cash_debit_note;
                break;

            default:
                invoiceType = this.invoiceType;
                break;
        }

        return invoiceType;
    }

    /**
     * Initializes current voucher form
     *
     * @private
     * @memberof VoucherComponent
     */
    private initializeCurrentVoucherForm(): void {

        if (this.voucherApiVersion === 2) {
            // Load the voucher form only for company that supports new voucher APIs
            this.currentVoucherFormDetails = this.voucherUtilityService.prepareVoucherForm(this.invoiceType);

            this.getItemColumns();
        } else {
            this.currentVoucherFormDetails = undefined;
        }
    }

    /**
     * Calculates the converted amount
     *
     * @param {SalesTransactionItemClass} transaction Current edited transaction
     * @memberof VoucherComponent
     */
    public calculateConvertedAmount(transaction: SalesTransactionItemClass): void {
        if (this.isMulticurrencyAccount) {
            if (transaction.isStockTxn) {
                transaction.convertedAmount = giddhRoundOff(transaction.quantity * ((transaction.rate * this.exchangeRate) ? transaction.rate * this.exchangeRate : 0), this.giddhBalanceDecimalPlaces);
            } else {
                transaction.convertedAmount = giddhRoundOff(transaction.amount * this.exchangeRate, this.giddhBalanceDecimalPlaces);
            }
        }
    }

    /**
     * This will set the data in selected item if user is editing voucher from outside module
     *
     * @private
     * @memberof VoucherComponent
     */
    private setSelectedItem(): void {
        this.route.queryParams.pipe(take(1)).subscribe((params) => {
            if (params.uniqueName) {
                this.selectedItem = {
                    uniqueName: params.uniqueName,
                    voucherNumber: params.invoiceNo,
                    account: { name: params.accUniqueName, uniqueName: params.accUniqueName },
                    grandTotal: undefined,
                    voucherDate: undefined,
                    voucherType: this.invoiceType
                };
            }
        });
    }

    /**
     * Deletes the attached file
     *
     * @memberof VoucherComponent
     */
    public deleteAttachment(): void {
        this.ledgerService.removeAttachment(this.invFormData.entries[0].attachedFile).subscribe((response) => {
            if (response?.status === 'success') {
                this.selectedFileName = '';
                this.invFormData.entries[0].attachedFile = '';
                this.toaster.showSnackBar("success", response?.body);
                if (!this.callFromOutside) {
                    this.reloadFiles.emit(true);
                }
                if (this.attachmentDeleteConfirmationModel) {
                    this.dialog.closeAll();
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.toaster.showSnackBar("error", response?.message)
            }
        });
    }

    /**
     * This will update the deposit amount updated by user
     *
     * @memberof VoucherComponent
     */
    public updateDepositAmount(depositAmount: any): void {
        depositAmount = String(depositAmount)?.replace(/[^0-9]/g, '');
        this.userDeposit = depositAmount ? Number(depositAmount) : null;
    }

    /**
     * This will return deposit object
     *
     * @private
     * @returns {AmountClassMulticurrency}
     * @memberof VoucherComponent
     */
    private getDeposit(): AmountClassMulticurrency {
        let deposit = new AmountClassMulticurrency();
        if ((this.userDeposit !== null && this.userDeposit !== undefined) || this.voucherApiVersion !== 2) {
            deposit.accountUniqueName = this.depositAccountUniqueName;

            if (this.voucherApiVersion === 2) {
                if (this.selectedPaymentMode?.additional?.currency?.code === this.invFormData?.accountDetails?.currency?.code) {
                    deposit.amountForAccount = this.depositAmount;
                } else {
                    deposit.amountForCompany = this.depositAmount;
                }
            } else {
                deposit.amountForAccount = this.depositAmount;
            }
        } else {
            if (this.isUpdateMode) {
                deposit = this.previousDeposit;
            } else {
                deposit = null;
            }
        }
        return deposit;
    }

    /**
     * We don't have to show deposit section for cash/bank accounts currently for purchase invoice
     *
     * @private
     * @param {*} accountDetails
     * @memberof VoucherComponent
     */
    private hideDepositSectionForCashBankGroups(accountDetails: any): void {
        this.hideDepositSection = false;
        if (this.voucherApiVersion === 2 && this.isPurchaseInvoice && accountDetails?.parentGroups?.length > 0) {
            accountDetails?.parentGroups.forEach(group => {
                if (group?.uniqueName === "cash" || group?.uniqueName === "bankaccounts" || (this.voucherApiVersion === 2 && group?.uniqueName === "loanandoverdraft")) {
                    this.hideDepositSection = true;
                }
            });
        }
    }

    /**
    * Updates account details
    *
    * @private
    * @param {*} data
    * @memberof VoucherComponent
    */
    private updateAccountDetails(data: any, forceUpdateAddress: boolean = false): void {
        this.getUpdatedStateCodes(data.country.countryCode).then(() => {
            if (data.addresses && data.addresses.length) {
                data.addresses = [find(data.addresses, (tax) => tax.isDefault)];
            }
            if (forceUpdateAddress) {
                // auto fill all the details
                this.invFormData.accountDetails = new AccountDetailsClass(data);
            }

            if (this.invFormData.accountDetails) {
                this.getStateCode('billingDetails');
                this.autoFillShippingDetails();
            } else {
                if (this.isEinvoiceGenerated) {
                    this.makeFieldReadonly("billingState", true);
                } else {
                    this.makeFieldReadonly("billingState", false);
                }
                this.changeDetectorRef.detectChanges();
            }
            if (this.invFormData.accountDetails.shippingDetails?.gstNumber) {
                this.getStateCode('shippingDetails');
            } else {
                if (this.isEinvoiceGenerated) {
                    this.makeFieldReadonly("shippingState", true);
                } else {
                    this.makeFieldReadonly("shippingState", false);
                }
                this.changeDetectorRef.detectChanges();
            }

            setTimeout(() => {
                if (this.customerBillingAddress && this.customerBillingAddress.nativeElement) {
                    this.customerBillingAddress.nativeElement.focus();
                }
                this.changeDetectorRef.detectChanges();
            }, 500);
        });
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof VoucherComponent
     */
    public resetInvoiceList(): void {
        this.invoiceList = [];
        this.invoiceList$ = observableOf([]);
        this.referenceVouchersCurrentPage = 1;
        this.referenceVouchersTotalPages = 1;
    }

    /**
     * Gets profile information
     *
     * @private
     * @memberof VoucherComponent
     */
    private getProfile(): void {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile && Object.keys(profile).length) {
                this.companyCountryName = profile.country;
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                await this.prepareCompanyCountryAndCurrencyFromProfile(profile);
            }
        });
    }

    /**
     * Get list of discounts
     *
     * @private
     * @memberof VoucherComponent
     */
    private getDiscounts(): void {
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountsList = response?.body;
            }
        });
    }

    /**
    *This will use for  fetch mobile number
    *
    * @memberof VoucherComponent
    */
    public onlyPhoneNumber(): void {
        let input = document.getElementById('init-contact-proforma');
        const errorMsg = document.querySelector("#init-contact-proforma-error-msg");
        const validMsg = document.querySelector("#init-contact-proforma-valid-msg");
        let errorMap = [this.localeData?.invalid_contact_number, this.commonLocaleData?.app_invalid_country_code, this.commonLocaleData?.app_invalid_contact_too_short, this.commonLocaleData?.app_invalid_contact_too_long, this.localeData?.invalid_contact_number];
        const intlTelInput = !isElectron ? window['intlTelInput'] : window['intlTelInputGlobals']['electron'];
        if (intlTelInput && input) {
            this.intl = intlTelInput(input, {
                nationalMode: true,
                utilsScript: MOBILE_NUMBER_UTIL_URL,
                autoHideDialCode: false,
                separateDialCode: false,
                initialCountry: 'auto',
                geoIpLookup: (success, failure) => {
                    let countryCode = 'in';
                    const fetchIPApi = this.http.get<any>(MOBILE_NUMBER_SELF_URL);
                    fetchIPApi.subscribe(
                        (res) => {
                            if (res?.ipAddress) {
                                const fetchCountryByIpApi = this.http.get<any>(MOBILE_NUMBER_IP_ADDRESS_URL + `${res.ipAddress}`);
                                fetchCountryByIpApi.subscribe(
                                    (fetchCountryByIpApiRes) => {
                                        if (fetchCountryByIpApiRes?.countryCode) {
                                            return success(fetchCountryByIpApiRes.countryCode);
                                        } else {
                                            return success(countryCode);
                                        }
                                    },
                                    (fetchCountryByIpApiErr) => {
                                        const fetchCountryByIpInfoApi = this.http.get<any>(MOBILE_NUMBER_ADDRESS_JSON_URL + `${res?.ipAddress}`);

                                        fetchCountryByIpInfoApi.subscribe(
                                            (fetchCountryByIpInfoApiRes) => {
                                                if (fetchCountryByIpInfoApiRes?.country) {
                                                    return success(fetchCountryByIpInfoApiRes.country);
                                                } else {
                                                    return success(countryCode);
                                                }
                                            },
                                            (fetchCountryByIpInfoApiErr) => {
                                                return success(countryCode);
                                            }
                                        );
                                    }
                                );
                            } else {
                                return success(countryCode);
                            }
                        },
                        (err) => {
                            return success(countryCode);
                        }
                    );
                },
            });

            let reset = () => {
                input?.classList?.remove("error");
                if (errorMsg && validMsg) {
                    errorMsg.innerHTML = "";
                    errorMsg.classList.add("d-none");
                    validMsg.classList.add("d-none");
                }
            };
            input.addEventListener('blur', () => {
                let phoneNumber = this.intl?.getNumber();
                reset();
                if (input) {
                    if (phoneNumber?.length) {
                        if (this.intl?.isValidNumber()) {

                            validMsg?.classList?.remove("d-none");
                            this.isMobileNumberInvalid = false;
                        } else {
                            input?.classList?.add("error");
                            this.isMobileNumberInvalid = true;
                            let errorCode = this.intl?.getValidationError();
                            if (errorMsg && errorMap[errorCode]) {
                                this.toaster.showSnackBar("error", this.localeData?.invalid_contact_number);
                                errorMsg.innerHTML = errorMap[errorCode];
                                errorMsg.classList.remove("d-none");
                            }
                        }
                    } else {
                        this.isMobileNumberInvalid = false;
                    }
                }
            });
        }
    }

    /**
     * Callback function for getLastInvoiceDetails function
     *
     * @param {PreviousInvoicesVm} item
     * @memberof VoucherComponent
     */
    public copyInvoice(item: PreviousInvoicesVm): void {
        this.getLastInvoiceDetails({ accountUniqueName: item.account?.uniqueName, invoiceNo: item.versionNumber, uniqueName: item?.uniqueName });
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof VoucherComponent
     */
    public toggleRcmCheckbox(event: any, element: string): void {
        let isChecked;
        if (element === "checkbox") {
            isChecked = event?.checked;
            this.rcmCheckbox['checked'] = !isChecked;
        } else {
            isChecked = !event?._checked;
        }
        this.rcmConfiguration = this.generalService.getRcmConfiguration(isChecked, this.commonLocaleData);
        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.rcmConfiguration
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            document.querySelector('body').classList.remove('fixed');
            this.handleRcmChange(response);
        });
    }

    /**
     * This will use for open add bulk item modal
     *
     * @memberof VoucherComponent
     */
    public addBulkItems(): void {
        this.dialog.open(this.bulkItemsModal, {
        });
    }
    /**
     * This will use for cancel bulk item modal
     *
     * @memberof VoucherComponent
     */
    public cancelBulkItemsModal(): void {
        this.dialog.closeAll();
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof VoucherComponent
     */
    public handleRcmChange(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
            this.rcmCheckbox['checked'] = this.isRcmEntry;
            this.recalculateConvertedTotal();
            this.calculateGrandTotal();
            this.calculateBalanceDue();
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will reset the state of checkbox and ngModel to make sure we update it based on user confirmation later
     *
     * @param {*} event
     * @memberof VoucherComponent
     */
    public changeRcmCheckboxState(event: any): void {
        this.closeAllDropdown(true);
        this.isRcmEntry = !this.isRcmEntry;
        this.toggleRcmCheckbox(event, 'checkbox');
    }

    /**
     * This will use for filter purchase orders
     *
     * @param {*} search
     * @memberof VoucherComponent
     */
    public filterPurchaseOrder(search: any): void {
        let filteredOptions: IOption[] = [];
        this.purchaseOrderNumberValueMapping = [];
        this.purchaseOrders.forEach(option => {
            if (typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredOptions.push({ label: option.label, value: option?.value, additional: option?.additional });
                this.purchaseOrderNumberValueMapping[option?.value] = option.label;
            }
        });
        this.fieldFilteredOptions = filteredOptions;
    }

    /**
     * This will use for set hsn/sac value default
     *
     * @param {*} transaction
     * @memberof VoucherComponent
     */
    public onChangeHsnSacType(transaction: any): void {
        setTimeout(() => {
            if (transaction.showCodeType === 'hsn') {
                transaction.hsnNumber = cloneDeep(transaction.sacNumber);
                transaction.sacNumber = null;
            } else {
                transaction.sacNumber = cloneDeep(transaction.hsnNumber);;
                transaction.hsnNumber = null;
            }
            this.changeDetectorRef.detectChanges();
        }, 100);
    }

    /**
     * This will use for delete attachment confirmation
     *
     * @memberof VoucherComponent
     */
    public deleteAttachementConfirmation(): void {
        this.attachmentDeleteConfiguration = this.generalService.getAttachmentDeleteConfiguration(this.localeData, this.commonLocaleData);
        let dialogRef = this.dialog.open(this.attachmentDeleteConfirmationModel, {
            width: '630px',
            data: {
                configuration: this.attachmentDeleteConfiguration
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            this.handleAttachmentDelete(response);
        });
    }

    /**
     * Delete attachment handler, triggerreed when the user performs any
     * action with the RCM popup
     * @param {string} action
     * @memberof VoucherComponent
     */
    public handleAttachmentDelete(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            this.deleteAttachment();
        }
        else {
            this.dialog.closeAll();
        }
    }

    /**
     * This will toggle account selection dropdown
     *
     * @private
     * @param {boolean} status
     * @memberof VoucherComponent
     */
    private toggleAccountSelectionDropdown(status: boolean): void {
        if (status) {
            this.openAccountSelectionDropdown?.openDropdownPanel();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * This will use for closs all dropdown
     *
     * @param {boolean} event
     * @memberof VoucherComponent
     */
    public closeAllDropdown(event: boolean): void {
        if (event) {
            const salesSelect: any = !this.isMobileScreen ? this.selectAccount?.first : this.selectAccount?.last;
            salesSelect?.closeDropdownPanel();
            this.openAccountSelectionDropdown?.closeDropdownPanel();
            this.selectWarehouse?.closeDropdownPanel();
            this.linkingDropdown?.closeDropdownPanel();
            this.invoiceListDropdown?.closeDropdownPanel();
            this.customerShippingState?.closeDropdownPanel();
            this.companyBillingState?.closeDropdownPanel();
            this.companyShippingState?.closeDropdownPanel();
            this.depositDropdown?.closeDropdownPanel();
        }
    }

    /**
     * This will open the first entry dropdown on tab change of due date
     *
     * @memberof VoucherComponent
     */
    public openFirstEntry(): void {
        if (!this.isEinvoiceGenerated) {
            this.setActiveIndx(0);

            setTimeout(() => {
                const firstEntry: any = this.selectAccount?.first;
                firstEntry?.openDropdownPanel();
            });
        }
    }

    /**
     * Set barcode machine typing to false if user clicked on dropdown
     *
     * @memberof VoucherComponent
     */
    public setUserManuallyClicked(): void {
        this.isBarcodeMachineTyping = false;
    }

    // CMD + G functionality
    @HostListener('document:keydown', ['$event'])
    public handleKeyboardDownEvent(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && (event.which === 75 || event.which === 71)) {
            this.isCreatingNewAccount = false;
        }
        this.startTime = event.timeStamp;
    }

    // detecting keyup event for barcode scan
    @HostListener('document:keyup', ['$event'])
    public handleKeyboardUpEvent(event: KeyboardEvent): void {
        let uniqueName = this.detectBarcode(event);

        if (event.timeStamp - this.startTime < 2) {
            this.isBarcodeMachineTyping = true;
        } else {
            this.isBarcodeMachineTyping = false;
        }

        if (uniqueName && this.startTime) {
            this.endTime = event.timeStamp;
            const scanTime = this.endTime - this.startTime;
            this.totalTime += scanTime;
            if (scanTime < 8) {
                this.isBarcodeMachineTyping = false;
                this.getStockByBarcode();
            }
            this.startTime = null;
            this.barcodeValue = '';
        }

        if (!this.isBarcodeMachineTyping) {
            this.barcodeValue = "";
        }

        setTimeout(() => {
            this.isBarcodeMachineTyping = false;
            this.barcodeValue = "";
        }, 1000);
    }

    /**
     * Returns the string when barcode machine finishes typing the word
     *
     * @param {KeyboardEvent} event
     * @returns {(string | null)}
     * @memberof VoucherComponent
     */
    public detectBarcode(event: KeyboardEvent): string | null {
        let ignoreKeyList = ['Shift', 'Meta', 'Backspace'];
        const key = event.key;
        if (key === 'Enter') {
            if (this.barcodeValue.length) {
                return this.barcodeValue;
            } else {
                return null;
            }
        } else {
            if (!ignoreKeyList.includes(key)) {
                this.barcodeValue += (this.lastScannedKey === 'Shift') ? key.toUpperCase() : key;
            }
            this.lastScannedKey = key;
            return null;
        }
    }

    /**
     * Get stock details by barcode and create transaction for it
     *
     * @returns {void}
     * @memberof VoucherComponent
     */
    public getStockByBarcode(): void {
        if (!this.barcodeValue) {
            return;
        }
        let params = {
            barcode: this.barcodeValue,
            customerUniqueName: this.invFormData.accountDetails.uniqueName ?? "",
            invoiceType: this.invoiceType,
        }
        this.commonService.getBarcodeScanData(this.barcodeValue, params).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.barcodeValue = '';
                let stockObj = response.body?.stock;
                let variantObj = stockObj?.variant;

                let group = response.body?.parentGroups[1];
                let unitRates = response.body?.stock?.variant?.unitRates;

                let accountUniqueName = response.body?.uniqueName;
                let accountName = response.body?.name;

                let isInclusiveTax = group === 'purchase' ? variantObj?.purchaseTaxInclusive ?? variantObj?.fixedAssetTaxInclusive : variantObj?.salesTaxInclusive ?? variantObj?.fixedAssetTaxInclusive;

                if (!accountUniqueName) {
                    this.toaster.showSnackBar("warning", group + " " + this.localeData?.account_missing_in_stock);
                    return;
                }
                let selectedAcc = {
                    value: group + stockObj?.uniqueName,
                    label: stockObj?.name,
                    additional: {
                        type: "ACCOUNT",
                        name: accountName,
                        uniqueName: accountUniqueName,
                        stock: {
                            name: stockObj?.name,
                            uniqueName: stockObj?.uniqueName,
                            stockUnitCode: stockObj?.stockUnitCode,
                            rate: 1,
                            stockUnitName: stockObj?.stockUnitName,
                            stockUnitUniqueName: stockObj?.stockUnitUniqueName,
                            taxes: stockObj?.taxes,
                            groupTaxes: [],
                            skuCodeHeading: stockObj?.skuCodeHeading,
                            customField1Heading: stockObj?.customField1Heading,
                            customField1Value: stockObj?.customField1Value,
                            customField2Heading: stockObj?.customField2Heading,
                            customField2Value: stockObj?.customField2Value,
                            variant: {
                                uniqueName: variantObj?.uniqueName,
                                salesTaxInclusive: variantObj?.salesTaxInclusive,
                                purchaseTaxInclusive: variantObj?.purchaseTaxInclusive,
                                unitRates: [],
                                variantDiscount: variantObj?.variantDiscount
                            }
                        },
                        parentGroups: [],
                        route: '',
                        label: stockObj?.name,
                        value: group + stockObj?.uniqueName,
                        applicableTaxes: [],
                        currency: {
                            code: "",
                            symbol: ""
                        },
                        nameStr: "",
                        hsnNumber: stockObj?.hsnNumber,
                        sacNumber: stockObj?.sacNumber,
                        uNameStr: "",
                        category: ""
                    }
                };

                this.salesAccounts$.pipe(takeUntil(this.destroyed$)).subscribe(accounts => {
                    const stockExists = accounts?.filter(account => account.value === selectedAcc.value);
                    if (!stockExists?.length) {
                        accounts.unshift(selectedAcc);
                    }
                });

                let isExistingEntry = -1;
                this.invFormData.entries?.forEach((entry, index) => {
                    if (isExistingEntry === -1 && entry.transactions[0]?.stockDetails?.variant?.uniqueName === variantObj?.uniqueName) {
                        entry.transactions[0].quantity = entry.transactions[0].quantity + 1;
                        isExistingEntry = index;
                    }
                });

                if (isExistingEntry === -1) {
                    if (this.invFormData.entries[this.invFormData.entries.length - 1].transactions[0].fakeAccForSelect2) {
                        this.addBlankRow(null);
                    }
                    let activeEntryIndex = this.invFormData.entries.length - 1;
                    this.invFormData.entries[activeEntryIndex].transactions[0].sku_and_customfields = null;
                    let description = [];
                    let skuCodeHeading = stockObj?.skuCodeHeading ? stockObj?.skuCodeHeading : this.commonLocaleData?.app_sku_code;
                    if (stockObj?.skuCode) {
                        description.push(skuCodeHeading + ':' + stockObj?.skuCode);
                    }

                    let customField1Heading = stockObj?.customField1Heading ? stockObj?.customField1Heading : this.localeData?.custom_field1;
                    if (stockObj?.customField1Value) {
                        description.push(customField1Heading + ':' + stockObj?.customField1Value);
                    }

                    let customField2Heading = stockObj?.customField2Heading ? stockObj?.customField2Heading : this.localeData?.custom_field2;
                    if (stockObj?.customField2Value) {
                        description.push(customField2Heading + ':' + stockObj?.customField2Value);
                    }

                    if (stockObj) {
                        let obj: IStockUnit = {
                            id: stockObj.stockUnitUniqueName,
                            text: stockObj.stockUnitCode
                        };
                        this.invFormData.entries[activeEntryIndex].transactions[0].stockList = [];
                        if (unitRates.length) {
                            this.invFormData.entries[activeEntryIndex].transactions[0].stockList = this.prepareUnitArr(unitRates);
                            this.invFormData.entries[activeEntryIndex].transactions[0].stockUnit = this.invFormData.entries[activeEntryIndex].transactions[0].stockList[0].id;
                            this.invFormData.entries[activeEntryIndex].transactions[0].stockUnitCode = this.invFormData.entries[activeEntryIndex].transactions[0].stockList[0].text;
                        } else {
                            this.invFormData.entries[activeEntryIndex].transactions[0].stockList.push(obj);
                            this.invFormData.entries[activeEntryIndex].transactions[0].stockUnit = stockObj.stockUnitUniqueName;
                            this.invFormData.entries[activeEntryIndex].transactions[0].stockUnitCode = stockObj.stockUnitCode;
                        }
                    }
                    this.invFormData.entries[activeEntryIndex].transactions[0].sku_and_customfields = description.join(', ');
                    this.invFormData.entries[activeEntryIndex].transactions[0].fakeAccForSelect2 = selectedAcc.value;
                    this.invFormData.entries[activeEntryIndex].transactions[0].accountName = accountName;
                    this.invFormData.entries[activeEntryIndex].transactions[0].accountUniqueName = accountUniqueName;
                    this.invFormData.entries[activeEntryIndex].transactions[0].quantity = 1;
                    this.invFormData.entries[activeEntryIndex].transactions[0].rate = unitRates?.length ? unitRates[0]?.rate : 1;
                    this.invFormData.entries[activeEntryIndex].transactions[0].isStockTxn = true;
                    this.invFormData.entries[activeEntryIndex].transactions[0].applicableTaxes = stockObj.taxes;
                    this.invFormData.entries[activeEntryIndex].transactions[0].showCodeType = stockObj.hsnNumber ? 'hsn' : 'sac';
                    this.invFormData.entries[activeEntryIndex].transactions[0].hsnNumber = stockObj.hsnNumber;
                    this.invFormData.entries[activeEntryIndex].transactions[0].sacNumber = stockObj.sacNumber;
                    this.invFormData.entries[activeEntryIndex].transactions[0].stockDetails =
                    {
                        name: stockObj.name,
                        uniqueName: stockObj.uniqueName,
                        stockUnitCode: stockObj.stockUnitCode,
                        rate: unitRates?.length ? unitRates[0].rate : [],
                        quantity: 1,
                        stockUnitName: stockObj.stockUnitName,
                        stockUnitUniqueName: stockObj.stockUnitUniqueName,
                        taxes: stockObj.taxes,
                        groupTaxes: [],
                        skuCodeHeading: stockObj.skuCodeHeading,
                        customField1Heading: stockObj.customField1Heading,
                        customField1Value: stockObj.customField1Value,
                        customField2Heading: stockObj.customField2Heading,
                        customField2Value: stockObj.customField2Value,
                        variant: {
                            uniqueName: variantObj?.uniqueName,
                            salesTaxInclusive: variantObj?.salesTaxInclusive,
                            purchaseTaxInclusive: variantObj?.purchaseTaxInclusive,
                            unitRates: unitRates,
                            variantDiscount: variantObj?.variantDiscount
                        }
                    };
                    this.invFormData.entries[activeEntryIndex].transactions[0].variant = {
                        name: variantObj?.name,
                        uniqueName: variantObj?.uniqueName
                    };

                    this.activeIndx = activeEntryIndex;
                    if (isInclusiveTax) {
                        setTimeout(() => {
                            this.invFormData.entries[activeEntryIndex].transactions[0].total = this.invFormData.entries[activeEntryIndex].transactions[0].quantity * this.invFormData.entries[activeEntryIndex].transactions[0].rate;
                            this.calculateTransactionValueInclusively(this.invFormData.entries[activeEntryIndex], this.invFormData.entries[activeEntryIndex].transactions[0]);
                        });
                    } else {
                        this.invFormData.entries[activeEntryIndex].transactions[0].setAmount(this.invFormData.entries[activeEntryIndex]);
                        this.invFormData.entries[activeEntryIndex]['initiallyCall'] = undefined;
                        this.calculateWhenTrxAltered(this.invFormData.entries[activeEntryIndex], this.invFormData.entries[activeEntryIndex].transactions[0]);
                        this.calculateStockEntryAmount(this.invFormData.entries[activeEntryIndex].transactions[0]);
                    }
                    this.invFormData.entries[activeEntryIndex]['initiallyCall'] = undefined;
                    this.onSelectSalesAccount(selectedAcc, this.invFormData.entries[activeEntryIndex].transactions[0], this.invFormData.entries[activeEntryIndex], false, false, 0, true);
                } else {
                    this.activeIndx = isExistingEntry;
                    this.handleQuantityBlur(this.invFormData.entries[isExistingEntry], this.invFormData.entries[isExistingEntry].transactions[0]);
                }
            } else {
                this.toaster.showSnackBar("error", response.message);
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * Loads the stock variants
     *
     * @private
     * @param {string} stockUniqueName Uniquename of the stock
     * @memberof VoucherComponent
     */
    private loadStockVariants(stockUniqueName: string, index?: number): void {
        this.ledgerService.loadStockVariants(stockUniqueName).pipe(
            map((variants: IVariant[]) => variants.map((variant: IVariant) => ({ label: variant.name, value: variant.uniqueName })))).subscribe(res => {
                const allStockVariants = this.stockVariants.getValue();
                this.currentlyLoadedStockVariantIndex = index;
                allStockVariants[this.currentlyLoadedStockVariantIndex ?? this.activeIndx] = observableOf(res);
                this.stockVariants.next(allStockVariants);
            });
    }

    /**
     * Variant change handler
     *
     * @param {IOption} event Change event
     * @param {SalesTransactionItemClass} transaction Current transaction
     * @param {SalesEntryClass} entry Current entry
     * @memberof VoucherComponent
     */
    public variantChanged(event: IOption, transaction: SalesTransactionItemClass, entry: SalesEntryClass): void {
        entry['initiallyCall'] = undefined;
        transaction.variant.name = event.label;
        this.currentTxnRequestObject[this.activeIndx].txn = transaction;
        this.currentTxnRequestObject[this.activeIndx].entry = entry;
        if (this.currentTxnRequestObject[this.activeIndx]?.params) {
            this.currentTxnRequestObject[this.activeIndx].params.variantUniqueName = event.value;
            this.currentTxnRequestObject[this.activeIndx].params.customerUniqueName = this.invFormData.accountDetails.uniqueName;
            this.loadDetails(this.currentTxnRequestObject[this.activeIndx]);
        }
    }

    /**
     * Loads the details of selected entry
     *
     * @private
     * @param {*} requestObject Request object for the API
     * @memberof VoucherComponent
     */
    private loadDetails(requestObject: any): void {
        let {
            selectedAcc,
            isLinkedPoItem,
            txn,
            entry,
            params,
            entryIndex
        } = requestObject;
        this.searchService.loadDetails(selectedAcc.additional?.uniqueName, params).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.body) {
                // Take taxes of parent group and stock's own taxes
                const taxes = this.generalService.fetchTaxesOnPriority(
                    data.body.stock?.taxes ?? [],
                    data.body.stock?.groupTaxes ?? [],
                    data.body.taxes ?? [],
                    data.body.groupTaxes ?? []);
                const taxComponent = this.taxControlComponent?.find((item, index) => index === entryIndex);
                if (taxComponent) {
                    taxComponent.enableAllTheTaxes();
                }
                let maxQuantity = 0;

                if (isLinkedPoItem) {
                    maxQuantity = selectedAcc.additional.maxQuantity;
                }

                // directly assign additional property
                selectedAcc.additional = {
                    ...selectedAcc.additional,
                    label: selectedAcc.label,
                    value: selectedAcc?.value,
                    applicableTaxes: taxes,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    email: data.body.emails,
                    isFixed: data.body.isFixed,
                    mergedAccounts: data.body.mergedAccounts,
                    mobileNo: data.body.mobileNo,
                    nameStr: selectedAcc.additional && selectedAcc.additional.parentGroups ? selectedAcc.additional.parentGroups.map(parent => parent?.name).join(', ') : data.body.parentGroups.join(', '),
                    stock: (isLinkedPoItem && this.isPoLinkingInProgress && selectedAcc.stock) ? selectedAcc.stock : data.body.stock,
                    hsnNumber: selectedAcc.stock?.hsnNumber ? selectedAcc.stock.hsnNumber : data.body.hsnNumber,
                    sacNumber: selectedAcc.stock?.sacNumber ? selectedAcc.stock.sacNumber : data.body.sacNumber,
                    uNameStr: selectedAcc.additional && selectedAcc.additional.parentGroups ? selectedAcc.additional.parentGroups.map(parent => parent?.uniqueName).join(', ') : data.body.parentGroups.join(', '),
                    category: data.body.category
                };
                txn = this.calculateItemValues(selectedAcc, txn, entry, !this.isPoLinkingInProgress, false, isLinkedPoItem);

                if (isLinkedPoItem) {
                    txn.applicableTaxes = entry.taxList;

                    if (selectedAcc.stock) {
                        txn.stockDetails = selectedAcc.stock;

                        if (txn.stockDetails?.uniqueName) {
                            let stockUniqueName = txn.stockDetails?.uniqueName.split('#');
                            txn.stockDetails.uniqueName = stockUniqueName[1];
                        }

                        if (selectedAcc.stock.quantity) {
                            txn.quantity = selectedAcc.stock.quantity;
                        }
                        if (selectedAcc.stock.rate) {
                            txn.rate = selectedAcc.stock.rate.amountForAccount;
                            txn.isStockTxn = true;
                        }
                    }

                    if (selectedAcc.stock && selectedAcc.stock.quantity && selectedAcc.stock.rate) {
                        this.calculateStockEntryAmount(txn);
                    } else {
                        if (selectedAcc.amount) {
                            txn.amount = selectedAcc.amount.amountForAccount;
                            txn.highPrecisionAmount = txn.amount;
                        }
                    }

                    txn.maxQuantity = maxQuantity;

                    this.calculateWhenTrxAltered(entry, txn);
                    if (this.isPoLinkingInProgress) {
                        this.linkedPoItemsAdded++;
                    }
                }
                this.focusOnDescription();
            }
        }, () => {
            txn.isStockTxn = false;
            txn.amount = 0;
            txn.highPrecisionAmount = txn.amount;
            txn.accountName = null;
            txn.accountUniqueName = null;
            txn.hsnOrSac = 'sac';
            txn.total = null;
            txn.rate = null;
            txn.sacNumber = null;
            txn.sacNumberExists = false;
            txn.taxableValue = 0;
            txn.applicableTaxes = [];
            this.focusOnDescription();
            return txn;
        });
    }

    /**
     * Handle price calculation on unit change
     *
     * @param {SalesEntryClass} entry Entry details
     * @param {SalesTransactionItemClass} transaction Transaction details
     * @memberof VoucherComponent
     */
    public handlePriceCalculationOnUnitChange(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        let isInclusiveTax;
        if (transaction?.stockDetails?.variant) {
            // Unit is changed in create flow by changing the stock
            isInclusiveTax = transaction.stockDetails.variant.salesTaxInclusive ||
                transaction.stockDetails.variant.purchaseTaxInclusive ||
                transaction.stockDetails.variant.fixedAssetTaxInclusive;
        } else {
            // Unit is changed in update flow without changing the stock
            isInclusiveTax = transaction?.taxInclusive;
        }
        if (isInclusiveTax) {
            transaction.total = transaction.quantity * transaction.rate;
            this.calculateTransactionValueInclusively(entry, transaction);
        } else {
            transaction.setAmount(entry);
            this.calculateWhenTrxAltered(entry, transaction);
        }
    }

    /**
     * Callback for entry datepicker
     *
     * @param {*} event
     * @memberof VoucherComponent
     */
    public onFocusEntryDate(event: any): void {
        this.isEntryDatepickerOpen = event;
    }

    /**
     * This will be use for field read only
     *
     * @param {string} fieldType
     * @param {boolean} isReadonly
     * @memberof VoucherComponent
     */
    public makeFieldReadonly(fieldType: string, isReadonly: boolean): void {
        let interval = setInterval(() => {
            if (fieldType === "billingState" && this.statesBilling) {
                clearInterval(interval);
                this.statesBilling.readonly = isReadonly;
            }
            if (fieldType === "shippingState" && this.statesShipping) {
                clearInterval(interval);
                this.statesShipping.readonly = isReadonly;
            }
            if (fieldType === "stateEle" && (this.statesShipping || this.statesBilling)) {
                clearInterval(interval);
                this.statesShipping.readonly = isReadonly;
                this.statesBilling.readonly = isReadonly;
            }
        }, 300);
    }

    /**
     * Check table entry has any stock and assign status to 'hasStock' variable
     *
     * @memberof VoucherComponent
     */
    public checkIfEntryHasStock(): void {
        this.hasStock = false;

        this.invFormData.entries.forEach(entry => {
            if (entry.transactions[0]?.isStockTxn) {
                this.hasStock = true;
            }
        })
    }
}
