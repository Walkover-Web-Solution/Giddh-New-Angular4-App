import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, TemplateRef, ViewContainerRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Observable, ReplaySubject, of as observableOf, combineLatest } from 'rxjs';
import { IOption } from '../../theme/ng-select/ng-select';
import { takeUntil, filter, take, delay, distinctUntilChanged } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { SalesActions } from '../../actions/sales/sales.action';
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { PurchaseOrder, StateCode, Address } from '../../models/api-models/Purchase';
import { SalesService } from '../../services/sales.service';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { WarehouseDetails } from '../../material-ledger/ledger.vm';
import { SettingsUtilityService } from '../../settings/services/settings-utility.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToasterService } from '../../services/toaster.service';
import { OnboardingFormRequest } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { VAT_SUPPORTED_COUNTRIES, SubVoucher, HIGH_RATE_FIELD_PRECISION, RATE_FIELD_PRECISION, SearchResultText, ENTRY_DESCRIPTION_LENGTH, EMAIL_REGEX_PATTERN } from '../../app.constant';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { IForceClear, SalesTransactionItemClass, SalesEntryClass, IStockUnit, SalesOtherTaxesModal, SalesOtherTaxesCalculationMethodEnum, VoucherClass, VoucherTypeEnum, SalesAddBulkStockItems, SalesEntryClassMulticurrency, TransactionClassMulticurrency, CodeStockMulticurrency, DiscountMulticurrency, AccountDetailsClass } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';
import { IContentCommon } from '../../models/api-models/Invoice';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { cloneDeep } from '../../lodash-optimized';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { DiscountListComponent } from '../../sales/discount-list/discountList.component';
import { TaxControlComponent } from '../../theme/tax-control/tax-control.component';
import { CompanyActions } from '../../actions/company.actions';
import { ConfirmationModalConfiguration, CONFIRMATION_ACTIONS } from '../../common/confirmation-modal/confirmation-modal.interface';
import { NgForm } from '@angular/forms';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { LoaderState } from '../../loader/loader';
import { LoaderService } from '../../loader/loader.service';
import { CurrentCompanyState } from '../../store/Company/company.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';
import { LedgerResponseDiscountClass } from '../../models/api-models/Ledger';
import { InvoiceService } from '../../services/invoice.service';
import { PURCHASE_ORDER_STATUS } from '../../shared/helpers/purchaseOrderStatus';
import { INameUniqueName } from '../../models/api-models/Inventory';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { OrganizationType } from '../../models/user-login-state';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { SearchService } from '../../services/search.service';
import { SalesShSelectComponent } from '../../theme/sales-ng-virtual-select/sh-select.component';
import { LedgerService } from '../../services/ledger.service';
import { SettingsDiscountService } from '../../services/settings.discount.service';

/** Type of search: vendor and item (product/service) search */
const SEARCH_TYPE = {
    VENDOR: 'vendor',
    ITEM: 'item'
}

@Component({
    selector: 'create-purchase-order',
    templateUrl: './create-purchase-order.component.html',
    styleUrls: ['./create-purchase-order.component.scss'],
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
    ]
})

export class CreatePurchaseOrderComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('vendorNameDropDown', { static: false }) public vendorNameDropDown: SalesShSelectComponent;
    /* Billing state instance */
    @ViewChild('vendorBillingState') vendorBillingState: ElementRef;
    /* Shipping state instance */
    @ViewChild('vendorShippingState') vendorShippingState: ElementRef;
    /* Billing state instance */
    @ViewChild('companyBillingState') companyBillingState: ElementRef;
    /* Shipping state instance */
    @ViewChild('companyShippingState') companyShippingState: ElementRef;
    /* RCM popup instance */
    @ViewChild('rcmPopup') public rcmPopup: PopoverDirective;
    /* PO Form instance */
    @ViewChild('poForm', { read: NgForm }) public poForm: NgForm;
    /* Bulk item modal instance */
    @ViewChild('bulkItemsModal') public bulkItemsModal: ModalDirective;
    /* Bootstrap directive instance */
    @ViewChildren(BsDatepickerDirective) public datePickers: QueryList<BsDatepickerDirective>;
    /* Select account instance */
    @ViewChildren('selectAccount') public selectAccount: QueryList<ShSelectComponent>;
    /* Entry description instance */
    @ViewChildren('description') public description: QueryList<ElementRef>;
    /* Discount component instance */
    @ViewChild('discountComponent') public discountComponent: DiscountListComponent;
    /* Discount component instance */
    @ViewChild('createGroupModal') public createGroupModal: ModalDirective;
    /* Tax Control instance */
    @ViewChild(TaxControlComponent) public taxControlComponent: TaxControlComponent;
    /** Container element for all the entries */
    @ViewChild('itemsContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
    /** Template reference for each entry */
    @ViewChild('entry', { read: TemplateRef, static: false }) template: TemplateRef<any>;
    /* Modal instance */
    public modalRef: BsModalRef;
    /* This will hold if it's multi currency account */
    public isMulticurrencyAccount: boolean = false;
    /* This will hold if it's mobile device*/
    public isMobileScreen: boolean = false;
    /* Observable for list of vendors */
    public vendorAcList$: Observable<IOption[]>;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* Object for purchase order */
    public purchaseOrder: PurchaseOrder = new PurchaseOrder();
    /* This will hold if it's update mode */
    public isUpdateMode: boolean = false;
    /* Observable for list of selected account */
    private selectedAccountDetails$: Observable<AccountResponseV2>;
    /* This will hold vendor country */
    public vendorCountry: any = '';
    /* This will hold autofill vendor shipping is enabled */
    public autoFillVendorShipping: boolean = true;
    /* This will hold autofill company shipping is enabled */
    public autoFillCompanyShipping: boolean = false;
    /* This will hold list of vendor country states */
    public statesSource: IOption[] = [];
    /* This will hold list of company country states */
    public companyStatesSource: IOption[] = [];
    /* This will hold if we need to show loader */
    public showLoader: boolean = true;
    /* Stores warehouses for a company */
    public warehouses: Array<any>;
    /* True, if warehouse drop down should be displayed */
    public shouldShowWarehouse: boolean;
    /* This will hold the company country name */
    public companyCountryName: string = '';
    /* This will hold the company country code */
    public companyCountryCode: string = '';
    /* This will hold the vendor not found text */
    public vendorNotFoundText: string = '';
    /* This will hold state of account aside popup */
    public accountAsideMenuState: string = 'out';
    /* This will hold state of product/service aside popup */
    public asideMenuStateForProductService: string = 'out';
    /* This will hold state of account aside popup */
    public asideMenuStateForOtherTaxes: string = 'out';
    /* Variable for checking do we really need to show loader, issue ref :- when we open aside pan loader is displayed unnecessary */
    private shouldShowLoader: boolean = true;
    /* Default group unique name for account create/edit */
    public selectedGroupUniqueNameForAddEditAccountModal: string = 'sundrycreditors';
    /* This will hold selected vendor */
    public selectedVendorForDetails: string = '';
    /* This will hold if vendor is selected */
    public isVendorSelected = false;
    /* Observable for create account success */
    private createAccountIsSuccess$: Observable<boolean>;
    /* Observable for update account success */
    private updateAccountSuccess$: Observable<boolean>;
    /* Observable for created account details */
    private createdAccountDetails$: Observable<AccountResponseV2>;
    /* Observable for updated account details */
    private updatedAccountDetails$: Observable<AccountResponseV2>;
    /* This will hold form fields */
    public formFields: any[] = [];
    /* True, if the Giddh supports the taxation of the country (not supported now: UK, US, Nepal, Australia) */
    public shouldShowTrnGstField: boolean = false;
    /* This will hold selected company details */
    public selectedCompany: any;
    /* This will hold if we need to show GST */
    public showGSTINNo: boolean;
    /* This will hold if we need to show TRN */
    public showTRNNo: boolean;
    /* This will hold if tax is valid */
    public isValidTaxNumber: boolean = false;
    /* This will hold list of vat supported countries */
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    /* This will hold giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /* Observable for sales account */
    public salesAccounts$: Observable<IOption[]> = observableOf(null);
    /* Observable for force clear sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will hold if we need to show hsn/sac popup */
    public hsnSacDropdownShow: boolean = false;
    /* This will hold inventory settings */
    public inventorySettings: any;
    /* This will hold the currently editing hsn/sac code */
    public editingHsnSac: any = "";
    /* This will hold company taxes list */
    public companyTaxesList: TaxResponse[] = [];
    /* This will hold list of all columns of entry table */
    public theadArrReadOnly: IContentCommon[] = [];
    /* This will hold list of all tax types */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    /* This will hold active index of entry */
    public activeIndex: number;
    /* Rate should have precision up to 4 digits for better calculation */
    public ratePrecision = RATE_FIELD_PRECISION;
    /* Rate should have precision up to 4 digits for better calculation */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /* This will hold if we need to apply round off */
    public applyRoundOff: boolean = true;
    /* This will hold if we need to hide total tax and have to exclude tax amount from total invoice amount */
    public excludeTax: boolean = false;
    /* This will hold round off calculation */
    public calculatedRoundOff: number = 0;
    /** Ng model of exchange rate field */
    public newExchangeRate = 1;
    /* This will hold exchange rate */
    public exchangeRate = 1;
    /* This will hold grand total */
    public grandTotalMulDum: any;
    /** True, when user wants to see switched currency rate */
    public showSwitchedCurr = false;
    /** If true, then shows the company currency in currency switcher as main currency of conversion*/
    public showCurrencyValue: boolean = false;
    /** If true, will show save icon on exchange rate switcher */
    public autoSaveIcon: boolean = false;
    /** Stores the previous exchange rate of previous debtor */
    public previousExchangeRate = 1;
    /** Holds the reversed exchange rate edited by the user */
    public reverseExchangeRate: number;
    /** Holds the original reverse exchange rate */
    public originalReverseExchangeRate: number;
    /** Stores the account currency name for exchange rate switcher */
    public customerCurrencyCode: string;
    /* This will hold entries list before applying tax */
    private entriesListBeforeTax: SalesEntryClass[];
    /* True, if the entry contains RCM applicable taxes */
    public isRcmEntry: boolean = false;
    /* This will hold universal date */
    public universalDate: any;
    /* dayjs object */
    public dayjs = dayjs;
    /* This will hold currency symbol of company */
    public baseCurrencySymbol: string = '';
    /* Object for selected vendor */
    public customerAccount: any = { email: '' };
    /* This will hold company currency */
    public companyCurrency: string;
    /* RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    /* This will hold suffix for currency */
    public selectedSuffixForCurrency: string = '';
    /* Fetched converted rate */
    public fetchedConvertedRate: number = 0;
    /* Stores the unique name of default warehouse of a company */
    public defaultWarehouse: string;
    /* Stores the unique name of selected warehouse */
    public selectedWarehouse: string;
    /* Array of company addresses */
    public companyAddresses: any[] = [];
    /* True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /* This will hold po unique name for copy/edit */
    public purchaseOrderUniqueName: string = '';
    /* This will hold purchase order details */
    public purchaseOrderDetails: any = {};
    /* This will hold if get account api is called */
    public getAccountInProgress: boolean = false;
    /* This will hold if account details are copied */
    public copiedAccountDetails: boolean = false;
    /* This will hold if vendor accounts are loaded */
    public vendorAccountsLoaded: boolean = false;
    /* This will hold the url params */
    public urlParams: any;
    /* This will hold all the accounts */
    public flattenAccounts: any;
    /* This will hold if we have prefilled all the data for edit */
    public showLoaderUntilDataPrefilled: boolean = false;
    /* Onboarding params object */
    public onboardingFormRequest: OnboardingFormRequest = { formName: 'onboarding', country: '' };
    /* This will hold invoice settings */
    public invoiceSettings: any = {};
    /* This will hold input mask format */
    public inputMaskFormat: string = '';
    /* This is to hide few tax types */
    public exceptTaxTypes: string[];
    /* This holds if other details is collapsed */
    public isOthrDtlCollapsed: boolean = false;
    /* This holds exchange rate */
    public originalExchangeRate: any = 1;
    /* This will hold object for time interval */
    public interval: any;
    /* This will hold the purchase orders */
    public purchaseOrders: any[] = [];
    /* This will hold po unique name for preview */
    public purchaseOrderPreviewUniqueName: string = '';
    /* This will hold po account unique name for preview */
    public purchaseOrderPreviewAccountUniqueName: string = '';
    /* Voucher type */
    public invoiceType: VoucherTypeEnum = VoucherTypeEnum.purchase;
    /* Index for inner entry */
    private innerEntryIndex: number;
    /* Observable for new stock created */
    public newlyCreatedStockAc$: Observable<INameUniqueName>;
    /* This will hold the transaction amount */
    public transactionAmount: number = 0;
    /** Stores the current index of entry whose TCS/TDS are entered */
    public tcsTdsIndex: number = 0;
    /** This will hold if order date is manually changed */
    public isOrderDateChanged: boolean = false;
    /** This will hold account addresses */
    public accountAddressList: any[] = [];
    /** This will hold company addresses */
    public companyAddressList: any[] = [];
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Stores the search results pagination details */
    public searchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for searching vendor */
    public defaultVendorSuggestions: Array<IOption> = [];
    /** Default search suggestion list to be shown for searching stock or services */
    public defaultItemSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the search results pagination details for vendor */
    public searchVendorResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details for stock or service  */
    public searchItemResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the default search results pagination details for vendor */
    public defaultVendorResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the default search results pagination details for stock or service */
    public defaultItemResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;
    /** True, when bulk items are added */
    public showBulkLoader: boolean;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Length of entry description */
    public entryDescriptionLength: number = ENTRY_DESCRIPTION_LENGTH;
    /** True if form save in progress */
    public isFormSaveInProgress: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** List of discounts */
    public discountsList: any[] = [];

    constructor(
        private store: Store<AppState>,
        private breakPointObservar: BreakpointObserver,
        private salesAction: SalesActions,
        private salesService: SalesService,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService,
        private settingsProfileActions: SettingsProfileActions,
        private toaster: ToasterService,
        private commonActions: CommonActions,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private purchaseOrderService: PurchaseOrderService,
        private loaderService: LoaderService,
        private route: ActivatedRoute,
        private router: Router,
        private ledgerService: LedgerService,
        private invoiceService: InvoiceService,
        private modalService: BsModalService,
        private settingsBranchAction: SettingsBranchActions,
        private searchService: SearchService,
        private ngZone: NgZone,
        private changeDetection: ChangeDetectorRef,
        private settingsDiscountService: SettingsDiscountService
    ) {
        this.selectedAccountDetails$ = this.store.pipe(select(state => state.sales.acDtl), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.sales.createAccountSuccess), takeUntil(this.destroyed$));
        this.createdAccountDetails$ = this.store.pipe(select(state => state.sales.createdAccountDetails), takeUntil(this.destroyed$));
        this.updatedAccountDetails$ = this.store.pipe(select(state => state.sales.updatedAccountDetails), takeUntil(this.destroyed$));
        this.updateAccountSuccess$ = this.store.pipe(select(state => state.sales.updateAccountSuccess), takeUntil(this.destroyed$));
        this.newlyCreatedStockAc$ = this.store.pipe(select(state => state.sales.newlyCreatedStockAc), takeUntil(this.destroyed$));
        this.exceptTaxTypes = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
    }

    /**
     * Initializes the component
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.getInvoiceSettings();
        this.getDiscounts();
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.store.dispatch(this.companyActions.getTax());

        this.breakPointObservar.observe([
            '(max-width: 1024px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
            if (!this.isMobileScreen && !this.container?.length && this.purchaseOrder?.account?.uniqueName) {
                this.buildBulkData(this.purchaseOrder.entries.length, 0);
            }
        });

        this.loaderService.loaderState.pipe(delay(500), takeUntil(this.destroyed$)).subscribe((stateLoader: LoaderState) => {
            // check if we really need to show a loader
            if (!this.shouldShowLoader) {
                return;
            }
        });

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.urlParams = params;

                if (params['action'] === "new") {
                    this.resetForm();
                    this.isUpdateMode = false;
                    this.autoFillVendorShipping = true;
                }

                if (params['action'] === "edit") {
                    this.isUpdateMode = true;
                    this.autoFillVendorShipping = false;
                }
                if (!this.isUpdateMode) {
                    setTimeout(() => {
                        this.createEmbeddedViewAtIndex(0);
                    });
                }
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
                this.companyAddressList = activeCompany.addresses;
                if (this.urlParams['purchaseOrderUniqueName'] && !this.purchaseOrderUniqueName) {
                    this.showLoaderUntilDataPrefilled = true;
                    this.purchaseOrderUniqueName = this.urlParams['purchaseOrderUniqueName'];
                    this.getPurchaseOrder();
                }
            }
        });
        this.loadDefaultSearchSuggestions();
        this.initializeWarehouse();

        this.selectedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(async accountDetails => {
            if (accountDetails) {
                if (accountDetails.country) {
                    await this.getUpdatedStateCodes(accountDetails.country.countryCode, false);
                }
                this.updateVendorDetails(accountDetails);
                this.prepareSearchLists([{
                    name: accountDetails.name,
                    uniqueName: accountDetails.uniqueName
                }], 1, SEARCH_TYPE.VENDOR);
                if (this.purchaseOrderDetails && this.purchaseOrderDetails.account && !this.copiedAccountDetails) {
                    let billingDetails = this.purchaseOrderDetails.account.billingDetails;

                    this.purchaseOrder.account.billingDetails.address = billingDetails.address;
                    this.purchaseOrder.account.billingDetails.gstNumber = billingDetails.gstNumber;
                    if (billingDetails.stateCode) {
                        this.purchaseOrder.account.billingDetails.state.name = billingDetails.stateName;
                        this.purchaseOrder.account.billingDetails.state.code = (billingDetails.stateCode) ? billingDetails.stateCode : billingDetails.stateGstCode;
                        this.purchaseOrder.account.billingDetails.stateCode = billingDetails.stateCode;
                        this.purchaseOrder.account.billingDetails.stateName = billingDetails.stateName;
                    } else {
                        this.purchaseOrder.account.billingDetails.state.name = "";
                        this.purchaseOrder.account.billingDetails.state.code = "";
                        this.purchaseOrder.account.billingDetails.stateCode = "";
                        this.purchaseOrder.account.billingDetails.stateName = "";
                    }

                    this.purchaseOrder.account.billingDetails.panNumber = "";
                    this.purchaseOrder.account.billingDetails.pincode = billingDetails.pincode;

                    let shippingDetails = this.purchaseOrderDetails.account.shippingDetails;

                    this.purchaseOrder.account.shippingDetails.address = shippingDetails.address;
                    this.purchaseOrder.account.shippingDetails.gstNumber = shippingDetails.gstNumber;
                    if (shippingDetails.stateCode) {
                        this.purchaseOrder.account.shippingDetails.state.name = shippingDetails.stateName;
                        this.purchaseOrder.account.shippingDetails.state.code = (shippingDetails.stateCode) ? shippingDetails.stateCode : shippingDetails.stateGstCode;
                        this.purchaseOrder.account.shippingDetails.stateCode = shippingDetails.stateCode;
                        this.purchaseOrder.account.shippingDetails.stateName = shippingDetails.stateName;
                    } else {
                        this.purchaseOrder.account.shippingDetails.state.name = "";
                        this.purchaseOrder.account.shippingDetails.state.code = "";
                        this.purchaseOrder.account.shippingDetails.stateCode = "";
                        this.purchaseOrder.account.shippingDetails.stateName = "";
                    }
                    this.purchaseOrder.account.shippingDetails.panNumber = "";
                    this.purchaseOrder.account.shippingDetails.pincode = shippingDetails.pincode;
                    this.checkForAutoFillShippingAddress('account');
                    this.copiedAccountDetails = true;
                }
                this.loadTaxesAndDiscounts(0);
                this.openProductDropdown();
            }
        });

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile) {
                this.companyCountryName = profile.country;
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.companyCurrency = profile.baseCurrency || 'INR';
                this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';

                if (profile.addresses && profile.addresses.length > 0) {
                    this.companyAddresses = profile.addresses;
                    this.fillCompanyAddress("fill");
                }

                if (profile.countryV2) {
                    this.companyCountryCode = profile.countryV2.alpha2CountryCode;
                    this.getUpdatedStateCodes(profile.countryV2.alpha2CountryCode, true);
                }

                this.changeDetection.detectChanges();
            } else {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });

        // create account success then hide aside pane
        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((accountDetails) => {
            if (accountDetails && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
        });

        this.createdAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(async accountDetails => {
            if (accountDetails) {
                if (accountDetails.country) {
                    await this.getUpdatedStateCodes(accountDetails.country.countryCode, false);
                }
                this.updateVendorDetails(accountDetails);
                this.getVendorPurchaseOrders(accountDetails.uniqueName);
            }
        });

        this.updatedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(accountDetails => {
            if (accountDetails) {
                this.updateVendorDetails(accountDetails);
            }
        });

        this.updateAccountSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
        });

        this.store.pipe(select(state => state.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
                if (this.formFields && this.formFields['taxName']) {
                    this.shouldShowTrnGstField = true;
                } else {
                    this.shouldShowTrnGstField = false;
                }
            }
        });

        // listen for universal date
        this.store.pipe(select((state: AppState) => state.session.applicationDate)).pipe(takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    const universalDate: any = dayjs(dateObj[1]);
                    this.universalDate = universalDate.$d;
                    this.assignDates();
                } catch (e) {
                    this.universalDate = new Date();
                }
            }
        });

        // listen for newly added stock and assign value
        combineLatest(this.newlyCreatedStockAc$, this.salesAccounts$).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            let stock = resp[0];
            let acData = resp[1];
            if (stock && acData) {
                let result: IOption = _.find(acData, (item: IOption) => item.additional.uniqueName === stock.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === stock.uniqueName);
                if (result && !_.isUndefined(this.innerEntryIndex)) {
                    this.purchaseOrder.entries[this.innerEntryIndex].transactions[0].fakeAccForSelect2 = result.value;
                    this.onSelectSalesAccount(result, this.purchaseOrder.entries[this.innerEntryIndex].transactions[0], this.purchaseOrder.entries[this.innerEntryIndex], false, this.innerEntryIndex);
                }
            }
        });
    }

    public ngAfterViewInit(): void {
        this.selectAccount.changes.pipe(distinctUntilChanged((firstItem, nextItem) => {
            return firstItem?.first?.filter === nextItem?.first?.filter;
        }), takeUntil(this.destroyed$)).subscribe((queryChanges: QueryList<ShSelectComponent>) => {
            if (this.purchaseOrder?.account?.uniqueName) {
                queryChanges?.first?.show();
            }
        });
    }

    /**
     * This will assign the universal date in entry date of transactions
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public assignDates(): void {
        if (!this.isOrderDateChanged) {
            let date = _.cloneDeep(this.universalDate);
            this.purchaseOrder.voucherDetails.voucherDate = date;

            if (this.invoiceSettings && this.invoiceSettings.purchaseBillSettings) {
                this.assignDueDate();
            }
        }
    }

    /**
     * This will update the selected vendor details
     *
     * @param {*} accountDetails
     * @memberof CreatePurchaseOrderComponent
     */
    public updateVendorDetails(accountDetails: any): void {
        if (accountDetails) {
            accountDetails.currency = accountDetails.currency || this.companyCurrency;
            this.isMulticurrencyAccount = accountDetails.currency !== this.companyCurrency;
            if (this.isMulticurrencyAccount) {
                this.customerCurrencyCode = accountDetails.currency;
                let voucherDate = (typeof this.purchaseOrder.voucherDetails.voucherDate === "object") ? dayjs(this.purchaseOrder.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT) : this.purchaseOrder.voucherDetails.voucherDate;
                this.getCurrencyRate(this.companyCurrency, accountDetails.currency, voucherDate);
            } else {
                this.customerCurrencyCode = this.companyCurrency;
                this.previousExchangeRate = this.exchangeRate;
                this.originalExchangeRate = 1;
                this.exchangeRate = 1;
                this.recalculateEntriesTotal();
            }
            this.purchaseOrder.voucherDetails.customerUniquename = accountDetails.uniqueName;
            this.purchaseOrder.voucherDetails.customerName = accountDetails.name;
            this.purchaseOrder.account.uniqueName = accountDetails.uniqueName;
            this.purchaseOrder.account.customerName = accountDetails.name;
            this.purchaseOrder.account.name = accountDetails.name;
            this.purchaseOrder.account.email = accountDetails.email;
            this.purchaseOrder.account.mobileNumber = accountDetails.mobileNo;
            this.purchaseOrder.account.currency.code = accountDetails.currency;
            this.purchaseOrder.accountDetails.currencySymbol = accountDetails.currencySymbol || '';
            this.purchaseOrder.accountDetails.uniqueName = accountDetails.uniqueName;

            this.isMulticurrencyAccount = accountDetails.currencySymbol !== this.baseCurrencySymbol;

            this.vendorCountry = "";

            if (accountDetails.country) {
                this.showGstAndTrnUsingCountry(accountDetails.country.countryCode, accountDetails.country.countryName);
                this.vendorCountry = accountDetails.country.countryName;
            } else {
                this.showGstAndTrnUsingCountry('', '');
            }

            if (accountDetails.addresses && accountDetails.addresses.length > 0) {
                this.accountAddressList = accountDetails.addresses;

                accountDetails.addresses.forEach(defaultAddress => {
                    if (defaultAddress && defaultAddress.isDefault) {
                        this.purchaseOrder.account.billingDetails.address = [];
                        this.purchaseOrder.account.billingDetails.address.push(defaultAddress.address);
                        this.purchaseOrder.account.billingDetails.gstNumber = defaultAddress.gstNumber;
                        if (defaultAddress.state) {
                            this.purchaseOrder.account.billingDetails.state.name = defaultAddress.state.name;
                            this.purchaseOrder.account.billingDetails.state.code = (defaultAddress.state) ? (defaultAddress.state.code) ? defaultAddress.state.code : defaultAddress.state.stateGstCode : defaultAddress.stateCode;
                            this.purchaseOrder.account.billingDetails.stateCode = this.purchaseOrder.account.billingDetails.state.code;
                            this.purchaseOrder.account.billingDetails.stateName = defaultAddress.state.name;
                        } else {
                            this.purchaseOrder.account.billingDetails.state.name = "";
                            this.purchaseOrder.account.billingDetails.state.code = "";
                            this.purchaseOrder.account.billingDetails.stateCode = "";
                            this.purchaseOrder.account.billingDetails.stateName = "";
                        }

                        this.purchaseOrder.account.billingDetails.panNumber = "";
                        this.purchaseOrder.account.billingDetails.pincode = defaultAddress.pincode;

                        this.purchaseOrder.account.shippingDetails.address = [];
                        this.purchaseOrder.account.shippingDetails.address.push(defaultAddress.address);
                        this.purchaseOrder.account.shippingDetails.gstNumber = defaultAddress.gstNumber;
                        if (defaultAddress.state) {
                            this.purchaseOrder.account.shippingDetails.state.name = defaultAddress.state.name;
                            this.purchaseOrder.account.shippingDetails.state.code = (defaultAddress.state) ? (defaultAddress.state.code) ? defaultAddress.state.code : defaultAddress.state.stateGstCode : defaultAddress.stateCode;
                            this.purchaseOrder.account.shippingDetails.stateCode = this.purchaseOrder.account.shippingDetails.state.code;
                            this.purchaseOrder.account.shippingDetails.stateName = defaultAddress.state.name;
                        } else {
                            this.purchaseOrder.account.shippingDetails.state.name = "";
                            this.purchaseOrder.account.shippingDetails.state.code = "";
                            this.purchaseOrder.account.shippingDetails.stateCode = "";
                            this.purchaseOrder.account.shippingDetails.stateName = "";
                        }
                        this.purchaseOrder.account.shippingDetails.pincode = defaultAddress.pincode;
                        this.purchaseOrder.account.shippingDetails.panNumber = "";
                    }
                });
            }
            this.checkForAutoFillShippingAddress('account');
        }
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
    }

    /**
     * Custom filter
     *
     * @param {string} term
     * @param {IOption} item
     * @returns {boolean}
     * @memberof CreatePurchaseOrderComponent
     */
    public customMoveGroupFilter(term: string, item: IOption): boolean {
        let newItem = { ...item };
        if (!newItem.additional) {
            newItem.additional = { email: '', mobileNo: '' };
        } else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 || item.additional.email.toLocaleLowerCase().indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase().indexOf(term) > -1);
    }

    /**
     * Callback for select vendor
     *
     * @param {IOption} item
     * @memberof CreatePurchaseOrderComponent
     */
    public onSelectVendor(item: IOption): void {
        if (item.value) {
            this.purchaseOrder.voucherDetails.customerName = item.label;
            this.purchaseOrder.accountDetails.name = '';

            if (item.additional) {
                this.customerAccount.email = item.additional.email;
                // If currency of item is null or undefined then treat it to be equivalent of company currency
                item.additional['currency'] = item.additional.currency || this.companyCurrency;
                this.isMulticurrencyAccount = item.additional.currency !== this.companyCurrency;
            }
            this.getAccountDetails(item.value);
        }
    }

    /**
     * This will reset the selected vendor
     *
     * @param {*} [event]
     * @memberof CreatePurchaseOrderComponent
     */
    public resetVendor(event?: any): void {
        if (event) {
            if (!event.target.value) {
                this.purchaseOrder.voucherDetails.customerName = null;
                this.purchaseOrder.voucherDetails.customerUniquename = null;
                this.purchaseOrder.accountDetails = new AccountDetailsClass();
                this.purchaseOrder.accountDetails.uniqueName = '';
                this.purchaseOrder.account.uniqueName = '';
                this.purchaseOrder.account.name = '';
                this.purchaseOrder.account.billingDetails = new Address();
                this.purchaseOrder.account.billingDetails.address = [];
                this.purchaseOrder.account.billingDetails.state = new StateCode();
                this.purchaseOrder.account.shippingDetails = new Address();
                this.purchaseOrder.account.shippingDetails.state = new StateCode();
                this.purchaseOrder.account.shippingDetails.address = [];
            }
        } else {
            this.purchaseOrder.voucherDetails.customerName = null;
            this.purchaseOrder.voucherDetails.customerUniquename = null;
            this.purchaseOrder.accountDetails = new AccountDetailsClass();
            this.purchaseOrder.accountDetails.uniqueName = '';
            this.purchaseOrder.account.uniqueName = '';
            this.purchaseOrder.account.name = '';
            this.purchaseOrder.account.billingDetails = new Address();
            this.purchaseOrder.account.billingDetails.address = [];
            this.purchaseOrder.account.billingDetails.state = new StateCode();
            this.purchaseOrder.account.shippingDetails = new Address();
            this.purchaseOrder.account.shippingDetails.state = new StateCode();
            this.purchaseOrder.account.shippingDetails.address = [];
        }
    }

    /**
     * This will get the selected vendor account details
     *
     * @param {string} accountUniqueName
     * @memberof CreatePurchaseOrderComponent
     */
    public getAccountDetails(accountUniqueName: string): void {
        this.getVendorPurchaseOrders(accountUniqueName);
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    /**
     * This will autofill billing and shipping details
     *
     * @param {*} event
     * @param {boolean} isBilling
     * @param {string} addressType
     * @memberof CreatePurchaseOrderComponent
     */
    public fillShippingBillingDetails(event: any, isBilling: boolean, addressType: string): void {
        let stateName = event.label;
        let stateCode = event.value;

        if (isBilling) {
            if (addressType === "vendor") {
                // update account details address if it's billing details
                if (this.vendorBillingState && this.vendorBillingState.nativeElement) {
                    this.vendorBillingState.nativeElement.classList.remove('error-box');
                }
                this.purchaseOrder.account.billingDetails.state.name = stateName;
                this.purchaseOrder.account.billingDetails.stateName = stateName;
                this.purchaseOrder.account.billingDetails.stateCode = stateCode;
            } else {
                // update account details address if it's billing details
                if (this.companyBillingState && this.companyBillingState.nativeElement) {
                    this.companyBillingState.nativeElement.classList.remove('error-box');
                }
                this.purchaseOrder.company.billingDetails.state.name = stateName;
                this.purchaseOrder.company.billingDetails.stateName = stateName;
                this.purchaseOrder.company.billingDetails.stateCode = stateCode;
            }
        } else {
            if (addressType === "vendor") {
                if (this.vendorShippingState && this.vendorShippingState.nativeElement) {
                    this.vendorShippingState.nativeElement.classList.remove('error-box');
                }
                // if it's not billing address then only update shipping details
                // check if it's not auto fill shipping address from billing address then and then only update shipping details
                if (!this.autoFillVendorShipping) {
                    this.purchaseOrder.account.shippingDetails.stateName = stateName;
                    this.purchaseOrder.account.shippingDetails.stateCode = stateCode;
                    this.purchaseOrder.account.shippingDetails.state.name = stateName;
                }
            } else {
                if (this.companyBillingState && this.companyBillingState.nativeElement) {
                    this.companyBillingState.nativeElement.classList.remove('error-box');
                }
                // if it's not billing address then only update shipping details
                // check if it's not auto fill shipping address from billing address then and then only update shipping details
                if (!this.autoFillCompanyShipping) {
                    this.purchaseOrder.company.shippingDetails.stateName = stateName;
                    this.purchaseOrder.company.shippingDetails.stateCode = stateCode;
                    this.purchaseOrder.company.shippingDetails.state.code = stateCode;
                    this.purchaseOrder.company.shippingDetails.state.name = stateName;
                }
            }
        }
    }

    /**
     * This will autofill billing details into shipping
     *
     * @param {string} addressType
     * @memberof CreatePurchaseOrderComponent
     */
    public autoFillShippingDetails(addressType: string): void {
        if (addressType === "vendor") {
            // auto fill shipping address
            if (this.autoFillVendorShipping) {
                this.purchaseOrder.account.shippingDetails = _.cloneDeep(this.purchaseOrder.account.billingDetails);
                if (this.vendorShippingState && this.vendorShippingState.nativeElement) {
                    this.vendorShippingState.nativeElement.classList.remove('error-box');
                }
            }
        } else {
            // auto fill shipping address
            if (this.autoFillCompanyShipping) {
                this.purchaseOrder.company.shippingDetails = _.cloneDeep(this.purchaseOrder.company.billingDetails);
                if (this.companyShippingState && this.companyShippingState.nativeElement) {
                    this.companyShippingState.nativeElement.classList.remove('error-box');
                }
            }
        }
    }

    /**
     * Returns the promise once the state list is successfully
     * fetched to carry out further operations
     *
     * @private
     * @param {*} countryCode Country code for the user
     * @returns Promise to carry out further operations
     * @memberof CreatePurchaseOrderComponent
     */
    private getUpdatedStateCodes(countryCode: any, isCompanyStates: boolean): Promise<any> {
        this.startLoader(true);
        return new Promise((resolve: Function) => {
            if (countryCode) {
                this.salesService.getStateCode(countryCode).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                    this.startLoader(false);
                    if (!isCompanyStates) {
                        this.statesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : []);
                    } else {
                        this.companyStatesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : []);
                    }
                    resolve();
                }, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Shows or hides the loader
     *
     * @param {boolean} shouldStartLoader True, if loader is to be shown
     * @memberof CreatePurchaseOrderComponent
     */
    public startLoader(shouldStartLoader: boolean): void {
        if (this.showLoaderUntilDataPrefilled) {
            this.showLoader = true;
        } else {
            this.showLoader = shouldStartLoader;
        }
    }

    /**
     * This will update the state list
     *
     * @private
     * @param {StateCode[]} stateList
     * @returns {IOption[]}
     * @memberof CreatePurchaseOrderComponent
     */
    private modifyStateResp(stateList: StateCode[]): IOption[] {
        let stateListRet: IOption[] = [];
        stateList.forEach(stateR => {
            stateListRet.push({ label: stateR.name, value: stateR.code ? stateR.code : stateR.stateGstCode, stateGstCode: stateR.stateGstCode ? stateR.stateGstCode : stateR.code });
        });
        return stateListRet;
    }

    /**
     * Intializes the warehouse
     *
     * @private
     * @param {WarehouseDetails} [warehouse] Warehouse to show pre-filled in drop down
     * @memberof CreatePurchaseOrderComponent
     */
    private initializeWarehouse(warehouse?: WarehouseDetails): void {
        this.store.pipe(select(appState => appState.warehouse.warehouses), filter((warehouses) => !!warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses) {
                let warehouseResults = cloneDeep(warehouses.results);
                warehouseResults = warehouseResults?.filter(wh => warehouse?.uniqueName === wh.uniqueName || !wh.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                let defaultWarehouseUniqueName;
                let defaultWarehouseName;
                if (warehouseData) {
                    this.warehouses = warehouseData.formattedWarehouses;
                    defaultWarehouseUniqueName = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.uniqueName : '';
                    defaultWarehouseName = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.name : '';
                    this.defaultWarehouse = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.uniqueName : '';
                    if (warehouseData.defaultWarehouse) {
                        this.autoFillWarehouseAddress(warehouseData.defaultWarehouse);
                    }
                }

                if (warehouse) {
                    // Update flow is carried out and we have received warehouse details
                    this.selectedWarehouse = warehouse.uniqueName;
                    this.purchaseOrder.warehouse.uniqueName = warehouse.uniqueName;
                    this.purchaseOrder.warehouse.name = warehouse.name;
                    if (!this.isUpdateMode) {
                        this.shouldShowWarehouse = true;
                    }
                } else {
                    if (!this.isUpdateMode) {
                        // Create flow is carried out
                        this.selectedWarehouse = String(this.defaultWarehouse);
                        this.purchaseOrder.warehouse.uniqueName = String(defaultWarehouseUniqueName);
                        this.purchaseOrder.warehouse.name = String(defaultWarehouseName);
                        this.shouldShowWarehouse = true;
                    }
                }
            }
        });
    }

    /**
     * Callback for warehouse
     *
     * @param {*} warehouse
     * @memberof CreatePurchaseOrderComponent
     */
    public onSelectWarehouse(warehouse: any): void {
        this.autoFillCompanyShipping = false;
        this.autoFillWarehouseAddress(warehouse);
        this.autoFillCompanyShipping = false;

        this.checkForAutoFillShippingAddress('company');
    }

    /**
     * This will autofill warehouse address
     *
     * @param {*} warehouse
     * @memberof CreatePurchaseOrderComponent
     */
    public autoFillWarehouseAddress(warehouse: any): void {
        if (warehouse) {
            if (warehouse.addresses && warehouse.addresses.length) {
                // Search the default linked address of warehouse
                const defaultAddress = warehouse.addresses.find(address => address.isDefault);
                if (defaultAddress) {
                    this.purchaseOrder.company.shippingDetails.address = [];
                    this.purchaseOrder.company.shippingDetails.address.push(defaultAddress.address);
                    this.purchaseOrder.company.shippingDetails.state.code = defaultAddress.stateCode;
                    this.purchaseOrder.company.shippingDetails.stateCode = defaultAddress.stateCode;
                    this.purchaseOrder.company.shippingDetails.state.name = defaultAddress.stateName;
                    this.purchaseOrder.company.shippingDetails.stateName = defaultAddress.stateName;
                    this.purchaseOrder.company.shippingDetails.gstNumber = defaultAddress.taxNumber;
                    this.purchaseOrder.company.shippingDetails.pincode = defaultAddress.pincode;
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
     * Resets the shipping address if no default linked address is
     * found in a warehouse
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public resetShippingAddress(): void {
        this.purchaseOrder.company.shippingDetails.address = [];
        this.purchaseOrder.company.shippingDetails.state.code = "";
        this.purchaseOrder.company.shippingDetails.stateCode = "";
        this.purchaseOrder.company.shippingDetails.state.name = "";
        this.purchaseOrder.company.shippingDetails.stateName = "";
        this.purchaseOrder.company.shippingDetails.gstNumber = "";
        this.purchaseOrder.company.shippingDetails.pincode = "";
    }

    /**
     * This will open account aside pan
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public addNewAccount(): void {
        this.selectedVendorForDetails = null;
        this.isVendorSelected = false;
        this.toggleAccountAsidePane();
    }

    /**
     * This will toggle account sidebar
     *
     * @param {*} [event]
     * @memberof CreatePurchaseOrderComponent
     */
    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * This will toggle fixed class in body
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public toggleBodyClass(): void {
        if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            // don't show loader when aside menu is opened
            this.shouldShowLoader = false;

            /* add fixed class only in crete mode not in update mode
                - because fixed class is already added in update mode due to double scrolling issue
             */
            if (!this.isUpdateMode) {
                document.querySelector('body').classList.add('fixed');
            }
        } else {
            // reset show loader variable because no aside pane is open
            this.shouldShowLoader = true;

            /* remove fixed class only in crete mode not in update mode
                - because fixed class is needed in update mode due to double scrolling issue
            */

            if (!this.isUpdateMode) {
                document.querySelector('body').classList.remove('fixed');
            }
        }
    }

    /**
     * Callback for add account
     *
     * @param {AddAccountRequest} item
     * @memberof CreatePurchaseOrderComponent
     */
    public addNewSidebarAccount(item: AddAccountRequest): void {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    /**
     * Callback for account update
     *
     * @param {UpdateAccountRequest} item
     * @memberof CreatePurchaseOrderComponent
     */
    public updateSidebarAccount(item: UpdateAccountRequest): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    /**
     * get state code using Tax number to prefill state
     *
     * @param {string} type billingDetails || shipping
     * @memberof CreatePurchaseOrderComponent
     */
    public getStateCode(type: string, addressType: string): void {
        let gstVal;
        if (addressType === "vendor") {
            gstVal = _.cloneDeep(this.purchaseOrder.account[type].gstNumber).toString();
        } else {
            gstVal = _.cloneDeep(this.purchaseOrder.company[type].gstNumber).toString();
        }

        if (gstVal && gstVal.length >= 2) {
            const selectedState = this.statesSource.find(item => item.stateGstCode === gstVal.substring(0, 2));
            if (selectedState) {
                if (addressType === "vendor") {
                    this.purchaseOrder.account[type].stateCode = selectedState.value;
                    this.purchaseOrder.account[type].state.code = selectedState.value;
                } else {
                    this.purchaseOrder.company[type].stateCode = selectedState.value;
                    this.purchaseOrder.company[type].state.code = selectedState.value;
                }
            } else {
                this.checkGstNumValidation(gstVal);
                if (!this.isValidTaxNumber) {
                    /* Check for valid pattern such as 9918IND29061OSS through which state can't be determined
                        and clear the state only when valid number is not provided */
                    if (addressType === "vendor") {
                        this.purchaseOrder.account[type].stateCode = null;
                        this.purchaseOrder.account[type].state.code = null;
                    } else {
                        this.purchaseOrder.company[type].stateCode = null;
                        this.purchaseOrder.company[type].state.code = null;
                    }
                }
                this.toaster.clearAllToaster();
            }
        }
        this.checkGstNumValidation(gstVal);
    }

    /**
     * To check Tax number validation using regex get by API
     *
     * @param {*} value Value to be validated
     * @param {string} fieldName Field name for which the value is validated
     * @memberof CreatePurchaseOrderComponent
     */
    public checkGstNumValidation(value, fieldName: string = ''): void {
        this.isValidTaxNumber = false;
        if (value) {
            if (this.formFields['taxName']['regex'] && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(value)) {
                        this.isValidTaxNumber = true;
                    }
                }
            } else {
                this.isValidTaxNumber = true;
            }
            if (!this.isValidTaxNumber) {
                this.startLoader(false);
                if (fieldName) {
                    let invalidTax = this.localeData?.invalid_tax_field;
                    invalidTax = invalidTax.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                    invalidTax = invalidTax.replace("[FIELD_NAME]", fieldName);
                    this.toaster.errorToast(invalidTax);
                } else {
                    let invalidTax = this.localeData?.invalid_tax_field;
                    invalidTax = invalidTax.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                    this.toaster.errorToast(invalidTax);
                }
            }
        }
    }

    /**
     * This will show/hide GST/TRN based on country
     *
     * @private
     * @param {string} code
     * @param {string} name
     * @memberof CreatePurchaseOrderComponent
     */
    private showGstAndTrnUsingCountry(code: string, name: string): void {
        if (this.selectedCompany.country === name) {
            if (name === 'India') {
                this.showGSTINNo = true;
                this.showTRNNo = false;
                this.getOnboardingForm('IN')
            } else if (this.vatSupportedCountries.includes(code)) {
                this.showGSTINNo = false;
                this.showTRNNo = true;
                this.getOnboardingForm(code);
            }
        } else {
            this.showGSTINNo = false;
            this.showTRNNo = false;
        }
    }

    /**
     *
     * To fetch regex call for onboarding countries (gulf)
     * @param {*} countryCode
     * @memberof CreatePurchaseOrderComponent
     */
    public getOnboardingForm(countryCode): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    /**
     * Callback for account selection
     *
     * @param {*} selectedAcc
     * @param {SalesTransactionItemClass} txn
     * @param {SalesEntryClass} entry
     * @param {boolean} isBulkItem True, if bulk item entry is performed
     * @param {number} entryIndex Index of current entry
     * @returns {*}
     * @memberof CreatePurchaseOrderComponent
     */
    public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass, entry: SalesEntryClass, isBulkItem: boolean = false, entryIndex: number): any {
        this.purchaseOrder.entries[entryIndex] = entry;
        this.purchaseOrder.entries[entryIndex].transactions[0] = txn;
        if ((selectedAcc.value || isBulkItem) && selectedAcc.additional.uniqueName) {
            let requestObject;
            if (selectedAcc.additional.stock) {
                requestObject = {
                    stockUniqueName: selectedAcc.additional.stock.uniqueName
                };
            }
            if (isBulkItem) {
                txn = this.calculateItemValues(selectedAcc, txn, entry, false, true);
            } else {
                this.searchService.loadDetails(selectedAcc.additional.uniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data && data.body) {
                        // Take taxes of parent group and stock's own taxes
                        const taxes = this.generalService.fetchTaxesOnPriority(
                            data.body.stock?.taxes ?? [],
                            data.body.stock?.groupTaxes ?? [],
                            data.body.taxes ?? [],
                            data.body.groupTaxes ?? []);

                        // directly assign additional property
                        selectedAcc.additional = {
                            ...selectedAcc.additional,
                            label: selectedAcc.label,
                            value: selectedAcc.value,
                            applicableTaxes: taxes,
                            currency: data.body.currency,
                            currencySymbol: data.body.currencySymbol,
                            email: data.body.emails,
                            isFixed: data.body.isFixed,
                            mergedAccounts: data.body.mergedAccounts,
                            mobileNo: data.body.mobileNo,
                            nameStr: selectedAcc.additional && selectedAcc.additional.parentGroups ? selectedAcc.additional.parentGroups.map(parent => parent.name).join(', ') : '',
                            stock: (data.body.stock) ? data.body.stock : '',
                            hsnNumber: (data.body.stock) ? data.body.stock.hsnNumber : "",
                            sacNumber: (data.body.stock) ? data.body.sacNumber : "",
                            uNameStr: selectedAcc.additional && selectedAcc.additional.parentGroups ? selectedAcc.additional.parentGroups.map(parent => parent.uniqueName).join(', ') : '',
                        };
                        txn = this.calculateItemValues(selectedAcc, txn, entry);
                        this.focusOnDescription();
                    }
                }, () => {
                    txn.isStockTxn = false;
                    txn.amount = 0;
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
        }
    }

    /**
     * This will set the transaction values to null on clear sales account
     *
     * @param {*} transaction
     * @memberof CreatePurchaseOrderComponent
     */
    public onClearSalesAccount(transaction: any): void {
        transaction.applicableTaxes = [];
        transaction.quantity = null;
        transaction.isStockTxn = false;
        transaction.stockUnit = null;
        transaction.stockDetails = null;
        transaction.stockList = [];
        transaction.rate = null;
        transaction.quantity = null;
        transaction.amount = null;
        transaction.taxableValue = null;
        transaction.sacNumber = null;
        transaction.hsnNumber = null;
        transaction.sacNumberExists = false;
        transaction.showCodeType = "";
    }

    /**
     * Toggle hsn/sac dropdown and hide all open date-pickers because it's overlapping hsn/sac dropdown
     *
     * @param {*} transaction
     * @memberof CreatePurchaseOrderComponent
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

        this.hsnSacDropdownShow = !this.hsnSacDropdownShow;
    }

    /**
     * This will hide the edit hsn/sac popup
     *
     * @param {*} transaction
     * @memberof CreatePurchaseOrderComponent
     */
    public hideHsnSacEditPopup(transaction: any): void {
        if (transaction.showCodeType === "hsn") {
            transaction.hsnNumber = this.editingHsnSac;
        } else if (transaction.showCodeType === "sac") {
            transaction.sacNumber = this.editingHsnSac;
        }

        this.hsnSacDropdownShow = !this.hsnSacDropdownShow;
    }

    /**
     * Returns true, if any of the single item is stock
     *
     * @private
     * @returns {boolean} True, if item entries contains stock item
     * @memberof CreatePurchaseOrderComponent
     */
    private isStockItemPresent(): boolean {
        const entries = this.purchaseOrder.entries;
        for (let entry = 0; entry < entries.length; entry++) {
            const transactions = entries[entry].transactions;
            for (let transaction = 0; transaction < transactions.length; transaction++) {
                const item = transactions[transaction];
                if (item.isStockTxn) {
                    return true;
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
     * @memberof CreatePurchaseOrderComponent
     */
    private handleWarehouseVisibility(): void {
        // Non stock item got selected, search if there is any stock item along with non-stock item
        const isStockItemPresent = this.isStockItemPresent();
        if (!isStockItemPresent) {
            // None of the item were stock item, hide the warehouse section which is applicable only for stocks
            this.shouldShowWarehouse = false;
        } else {
            this.shouldShowWarehouse = true;
        }
    }

    /**
     * This will prepare the stock units
     *
     * @param {*} unitArr
     * @returns {*}
     * @memberof CreatePurchaseOrderComponent
     */
    public prepareUnitArr(unitArr): any {
        let unitArray = [];
        _.forEach(unitArr, (item) => {
            unitArray.push({ id: item.stockUnitCode, text: item.stockUnitCode, rate: item.rate });
        });
        return unitArray;
    }

    /**
     * This will calculate stock entry amount
     *
     * @param {SalesTransactionItemClass} trx
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateStockEntryAmount(trx: SalesTransactionItemClass): void {
        trx.amount = Number(trx.quantity) * Number(trx.rate);
    }

    /**
     * This will calculate discount/tax/total
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @param {SalesTransactionItemClass} fromTransactionField
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateWhenTrxAltered(entry: SalesEntryClass, trx: SalesTransactionItemClass, fromTransactionField: boolean = false): void {
        if (fromTransactionField && this.transactionAmount === trx.amount) {
            this.transactionAmount = 0;
            return;
        }

        trx.amount = Number(trx.amount);
        if (trx.isStockTxn) {
            trx.rate = giddhRoundOff((trx.amount / trx.quantity), this.ratePrecision);
        }

        this.calculateConvertedAmount(trx);
        this.calculateTotalDiscountOfEntry(entry, trx, false);
        this.calculateEntryTaxSum(entry, trx, false);
        this.calculateEntryTotal(entry, trx);
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();

        this.transactionAmount = 0;
    }

    /**
     * Calculates the converted amount
     *
     * @param {SalesTransactionItemClass} transaction Current edited transaction
     * @memberof CreatePurchaseOrderComponent
     */
     public calculateConvertedAmount(transaction: SalesTransactionItemClass): void {
        if (this.isMulticurrencyAccount) {
            if (transaction.isStockTxn) {
                transaction.convertedAmount = giddhRoundOff(transaction.quantity * ((transaction.rate * this.exchangeRate) ? transaction.rate * this.exchangeRate : 0), 2);
            } else {
                transaction.convertedAmount = giddhRoundOff(transaction.amount * this.exchangeRate, 2);
            }
        }
    }

    /**
     * This will calculate discount of entry
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @param {boolean} [calculateEntryTotal=true]
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateTotalDiscountOfEntry(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true): void {
        let percentageListTotal = entry.discounts.filter(f => f.isActive)
            .filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedListTotal = entry.discounts.filter(f => f.isActive)
            .filter(s => s.discountType === 'FIX_AMOUNT')
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

    /**
     * This will calculate entry tax sum
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @param {boolean} [calculateEntryTotal=true]
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateEntryTaxSum(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true): void {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        entry.taxes.filter(f => f.isChecked).forEach(tax => {
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            } else {
                taxPercentage += tax.amount;
            }
        });

        entry.taxSum = giddhRoundOff(((taxPercentage * (trx.amount - entry.discountSum)) / 100), 2);
        entry.cessSum = giddhRoundOff(((cessPercentage * (trx.amount - entry.discountSum)) / 100), 2);

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

    /**
     * This will calculate entry total
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateEntryTotal(entry: SalesEntryClass, trx: SalesTransactionItemClass): void {
        this.calculateConvertedTotal(entry, trx);
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
    }

    /**
     * Calculate the complete transaction values inclusively
     *
     * @param {SalesEntryClass} entry Entry value
     * @param {SalesTransactionItemClass} transaction Current transaction
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateTransactionValueInclusively(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        // Calculate discount
        let percentageDiscountTotal = entry.discounts.filter(discount => discount.isActive)
            .filter(activeDiscount => activeDiscount.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedDiscountTotal = entry.discounts.filter(discount => discount.isActive)
            .filter(activeDiscount => activeDiscount.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        // Calculate tax
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        let taxTotal: number = 0;
        entry.taxes.filter(tax => tax.isChecked).forEach(selectedTax => {
            if (selectedTax.type === 'gstcess') {
                cessPercentage += selectedTax.amount;
            } else {
                taxPercentage += selectedTax.amount;
            }
            taxTotal += selectedTax.amount;
        });

        // Calculate amount with inclusive tax
        transaction.amount = giddhRoundOff(((Number(transaction.total) + fixedDiscountTotal + 0.01 * fixedDiscountTotal * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscountTotal + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscountTotal * Number(taxTotal))), 2);
        let perFromAmount = giddhRoundOff(((percentageDiscountTotal * transaction.amount) / 100), 2);
        entry.discountSum = giddhRoundOff(perFromAmount + fixedDiscountTotal, 2);
        if (isNaN(entry.discountSum)) {
            entry.discountSum = 0;
        }
        transaction.taxableValue = Number(transaction.amount) - entry.discountSum;
        if (isNaN(transaction.taxableValue)) {
            transaction.taxableValue = 0;
        }
        entry.taxSum = giddhRoundOff(((taxPercentage * (transaction.amount - entry.discountSum)) / 100), 2);
        entry.cessSum = giddhRoundOff(((cessPercentage * (transaction.amount - entry.discountSum)) / 100), 2);
        if (isNaN(entry.taxSum)) {
            entry.taxSum = 0;
        }

        if (isNaN(entry.cessSum)) {
            entry.cessSum = 0;
        }
        // Calculate stock unit rate with amount
        if (transaction.isStockTxn) {
            transaction.rate = giddhRoundOff((transaction.amount / transaction.quantity), this.ratePrecision);
        }
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();
    }

    /**
     * This will calculate total discount
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateTotalDiscount(): void {
        let discount = 0;
        this.purchaseOrder.entries.forEach(entry => {
            discount += entry.discountSum;
        });
        this.purchaseOrder.voucherDetails.totalDiscount = discount;
    }

    /**
     * This will calculate tax sum
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateTotalTaxSum(): void {
        let taxes = 0;
        let cess = 0;

        this.purchaseOrder.entries.forEach(entry => {
            taxes += entry.taxSum;
        });

        this.purchaseOrder.entries.forEach(entry => {
            cess += entry.cessSum;
        });

        this.purchaseOrder.voucherDetails.gstTaxesTotal = taxes;
        this.purchaseOrder.voucherDetails.cessTotal = cess;
        this.purchaseOrder.voucherDetails.totalTaxableValue = this.purchaseOrder.voucherDetails.subTotal - this.purchaseOrder.voucherDetails.totalDiscount;
    }

    /**
     * This will calculate tcs/tds
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateTcsTdsTotal(): void {
        let tcsSum: number = 0;
        let tdsSum: number = 0;

        this.purchaseOrder.entries.forEach(entry => {
            tcsSum += entry.otherTaxType === 'tcs' ? entry.otherTaxSum : 0;
            tdsSum += entry.otherTaxType === 'tds' ? entry.otherTaxSum : 0;
        });

        this.purchaseOrder.voucherDetails.tcsTotal = tcsSum;
        this.purchaseOrder.voucherDetails.tdsTotal = tdsSum;
    }

    /**
     * This will calculate sub total
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateSubTotal(): void {
        let count: number = 0;
        this.purchaseOrder.entries.forEach(f => {
            count += f.transactions.reduce((pv, cv) => {
                return pv + Number(cv.amount);
            }, 0);
        });

        if (isNaN(count)) {
            count = 0;
        }
        this.purchaseOrder.voucherDetails.subTotal = count;
    }

    /**
     * This will calculate grand total
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateGrandTotal(): void {
        let calculatedGrandTotal = 0;
        calculatedGrandTotal = this.purchaseOrder.voucherDetails.grandTotal = this.purchaseOrder.entries.reduce((pv, cv) => {
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
                this.calculatedRoundOff = Number((Math.round(calculatedGrandTotal) - calculatedGrandTotal).toFixed(2));
            } else {
                this.calculatedRoundOff = Number((calculatedGrandTotal - calculatedGrandTotal).toFixed(2));
            }

            calculatedGrandTotal = Number((calculatedGrandTotal + this.calculatedRoundOff).toFixed(2));
        } else if (calculatedGrandTotal === 0) {
            this.calculatedRoundOff = 0;
        }
        this.purchaseOrder.voucherDetails.grandTotal = calculatedGrandTotal;
        this.grandTotalMulDum = giddhRoundOff(calculatedGrandTotal * this.exchangeRate, 2);
    }

    /**
     * This will calculate other taxes
     *
     * @param {SalesOtherTaxesModal} modal
     * @param {SalesEntryClass} [entryObj]
     * @returns
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateOtherTaxes(modal: SalesOtherTaxesModal, entryObj?: SalesEntryClass): void {
        let entry: SalesEntryClass;
        entry = entryObj ? entryObj : this.purchaseOrder.entries[this.activeIndex];

        let taxableValue = 0;
        let totalTaxes = 0;

        if (!entry) {
            return;
        }
        if (modal && modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            let tax = this.companyTaxesList.find(ct => ct.uniqueName === modal.appliedOtherTax.uniqueName);
            if (tax) {
                if (!modal.appliedOtherTax?.name) {
                    entry.otherTaxModal.appliedOtherTax.name = tax.name;
                }
                if (['tcsrc', 'tcspay'].includes(tax.taxType)) {
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

                totalTaxes += tax.taxDetail[0].taxValue;
            }

            entry.otherTaxSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), 2);
            entry.otherTaxModal = modal;
        } else {
            entry.otherTaxSum = 0;
            entry.isOtherTaxApplicable = false;
            entry.otherTaxModal = new SalesOtherTaxesModal();
            entry.tcsTaxList = [];
            entry.tdsTaxList = [];
        }
        if (this.activeIndex !== undefined && this.activeIndex !== null && !entryObj) {
            this.purchaseOrder.entries = cloneDeep(this.entriesListBeforeTax);
            this.purchaseOrder.entries[this.activeIndex] = entry;
        }
    }

    /**
     * Outside click handler for transaction row
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public handleOutsideClick(): void {
        this.activeIndex = null;
    }

    /**
     * This will set the active index of transaction
     *
     * @param {number} index
     * @memberof CreatePurchaseOrderComponent
     */
    public setActiveIndex(index: number): void {
        this.activeIndex = index;
        try {
            if (this.isRcmEntry) {
                this.purchaseOrder.entries[index].transactions[0]['requiredTax'] = false;
            }
        } catch (error) {

        }
    }

    /**
     * This will set the transaction amount to undefined if 0
     *
     * @param {SalesTransactionItemClass} transaction
     * @memberof CreatePurchaseOrderComponent
     */
    public transactionAmountClicked(transaction: SalesTransactionItemClass): void {
        if (Number(transaction.amount) === 0) {
            transaction.amount = undefined;
        }
        this.transactionAmount = transaction.amount;
    }

    /**
     * This will add the blank transaction
     *
     * @param {SalesTransactionItemClass} txn
     * @returns {void}
     * @memberof CreatePurchaseOrderComponent
     */
    public addBlankRow(txn: SalesTransactionItemClass): void {
        if (!txn) {
            let entry: SalesEntryClass = new SalesEntryClass();
            if (this.isUpdateMode) {
                entry.isNewEntryInUpdateMode = true;
            }
            this.purchaseOrder.entries.push(entry);
            setTimeout(() => {
                this.activeIndex = this.purchaseOrder.entries.length ? this.purchaseOrder.entries.length - 1 : 0;
            }, 200);
        } else {
            // if transaction is valid then add new row else show toasty
            if (!txn.isValid()) {
                this.toaster.warningToast(this.localeData?.no_product_error);
                return;
            }
            let entry: SalesEntryClass = new SalesEntryClass();
            this.purchaseOrder.entries.push(entry);
            setTimeout(() => {
                this.activeIndex = this.purchaseOrder.entries.length ? this.purchaseOrder.entries.length - 1 : 0;
            }, 200);
        }
        this.createEmbeddedViewAtIndex(this.purchaseOrder.entries.length - 1);
        this.openProductDropdown();
    }

    /**
     * This will remove the transaction
     *
     * @param {number} entryIdx
     * @memberof CreatePurchaseOrderComponent
     */
    public removeTransaction(entryIdx: number): void {
        if (this.activeIndex === entryIdx) {
            this.activeIndex = null;
        }
        if (this.container) {
            for (let index = entryIdx + 1; index < this.purchaseOrder.entries.length; index++) {
                const viewRef: any = this.container.get(index);
                if(viewRef) {
                    viewRef.context.entryIdx -= 1;
                }
            }
            this.container.remove(entryIdx);
        }
        this.purchaseOrder.entries.splice(entryIdx, 1);
        this.calculateAffectedThingsFromOtherTaxChanges();
        if (this.purchaseOrder.entries.length === 0) {
            this.addBlankRow(null);
        }
        this.handleWarehouseVisibility();
    }

    /**
     * This will calculate the tax and grand total
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public calculateAffectedThingsFromOtherTaxChanges(): void {
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateTcsTdsTotal();
        this.calculateGrandTotal();
    }

    /**
     * This will close the discount popup
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public closeDiscountPopup(): void {
        if (this.discountComponent) {
            this.discountComponent.hideDiscountMenu();
        }
    }

    /**
     * This will close the tax popup
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public closeTaxControlPopup(): void {
        if (this.taxControlComponent) {
            this.taxControlComponent.showTaxPopup = false;
        }
    }

    /**
     * This will open the account edit aside pan
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public getVendorDetails(): void {
        this.selectedVendorForDetails = this.purchaseOrder.accountDetails.uniqueName;
        this.toggleAccountAsidePane();
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof CreatePurchaseOrderComponent
     */
    public toggleRcmCheckbox(event: any): void {
        event.preventDefault();
        this.rcmConfiguration = this.generalService.getRcmConfiguration(event.target.checked, this.commonLocaleData);
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof CreatePurchaseOrderComponent
     */
    public handleRcmChange(action: string): void {
        if (action === CONFIRMATION_ACTIONS.YES) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
        }
        if (this.rcmPopup) {
            this.rcmPopup.hide();
        }
    }

    /**
     * This will open the account create aside pan on alt+c
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public addAccountFromShortcut(): void {
        if (this.purchaseOrder && this.purchaseOrder.voucherDetails && !this.purchaseOrder.voucherDetails.customerName) {
            this.selectedVendorForDetails = null;
            this.toggleAccountAsidePane();
        }
    }

    /**
     * This will save/update the purchase order
     *
     * @param {NgForm} poForm
     * @param {string} type
     * @returns {*}
     * @memberof CreatePurchaseOrderComponent
     */
    public savePurchaseOrder(type: string): void {
        if(this.isFormSaveInProgress) {
            return;
        }

        let data: VoucherClass = _.cloneDeep(this.purchaseOrder);

        // special check if gst no filed is visible then and only then check for gst validation
        if (data.accountDetails && data.accountDetails.billingDetails && data.accountDetails.shippingDetails && data.accountDetails.billingDetails.gstNumber && this.showGSTINNo) {
            this.checkGstNumValidation(data.accountDetails.billingDetails.gstNumber, this.localeData?.billing_address);
            if (!this.isValidTaxNumber) {
                this.startLoader(false);
                return;
            }
            this.checkGstNumValidation(data.accountDetails.shippingDetails.gstNumber, this.localeData?.shipping_address);
            if (!this.isValidTaxNumber) {
                this.startLoader(false);
                return;
            }
        }

        if (dayjs(data.voucherDetails.dueDate, GIDDH_DATE_FORMAT).isBefore(dayjs(data.voucherDetails.voucherDate, GIDDH_DATE_FORMAT), 'd')) {
            this.startLoader(false);
            this.toaster.errorToast(this.localeData?.delivery_date_error);
            return;
        }

        data.entries = data.entries.filter((entry, indx) => {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                this.purchaseOrder.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });

        data.entries = data.entries.map(entry => {
            // filter active discounts
            entry.discounts = entry.discounts.filter(dis => dis.isActive);

            // filter active taxes
            entry.taxes = entry.taxes.filter(tax => tax.isChecked);
            return entry;
        });

        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                this.toaster.warningToast(this.localeData?.no_vendor_error);
                this.startLoader(false);
                return;
            }
            if (data.accountDetails.email) {
                if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
                    this.startLoader(false);
                    this.toaster.warningToast(this.localeData?.invalid_email);
                    return;
                }
            }
        }

        // replace /n to br for (shipping and billing)

        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].trim();
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].trim();
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }

        // convert date object
        data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

        let txnErr: boolean;

        // check for valid entries and transactions
        if (data.entries && data.entries.length > 0) {
            _.forEach(data.entries, (entry) => {
                _.forEach(entry.transactions, (txn: SalesTransactionItemClass) => {
                    txn.convertedAmount = this.fetchedConvertedRate > 0 ? giddhRoundOff((Number(txn.amount) * this.fetchedConvertedRate), 2) : 0;

                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        this.toaster.warningToast(this.localeData?.no_product_error);
                        txnErr = true;
                        return false;
                    } else {
                        txnErr = false;
                    }
                });
            });
        } else {
            this.startLoader(false);
            this.toaster.warningToast(this.localeData?.no_entry_error);
            return;
        }

        // if txn has errors
        if (txnErr) {
            this.startLoader(false);
            return;
        }

        // set voucher type
        data.entries = data.entries.map((entry) => {
            if (!this.isRcmEntry) {
                entry.transactions[0]['requiredTax'] = false;
            }

            entry.voucherType = VoucherTypeEnum.purchase;
            entry.taxList = entry.taxes.map(tax => tax.uniqueName);
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;

            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }
            return entry;
        });

        if (this.isRcmEntry && !this.validateTaxes(cloneDeep(data))) {
            this.startLoader(false);
            return;
        }

        this.isFormSaveInProgress = true;

        let postRequestObject = {
            type: "purchase",
            date: data.voucherDetails.voucherDate,
            dueDate: data.voucherDetails.dueDate,
            number: this.purchaseOrder.number || '',
            exchangeRate: this.exchangeRate,
            account: this.purchaseOrder.account,
            entries: data.entries,
            company: this.purchaseOrder.company,
            warehouse: this.purchaseOrder.warehouse,
            templateDetails: data.templateDetails,
            subVoucher: (this.isRcmEntry) ? SubVoucher.ReverseCharge : ''
        };

        let updatedData = this.updateData(postRequestObject, data);

        let getRequestObject = {
            companyUniqueName: this.selectedCompany.uniqueName,
            accountUniqueName: data.accountDetails.uniqueName
        };

        if (type === "create") {
            this.purchaseOrderService.create(getRequestObject, updatedData).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isFormSaveInProgress = false;
                this.toaster.clearAllToaster();
                if (response && response.status === "success") {
                    this.vendorAcList$ = observableOf(_.orderBy(this.defaultVendorSuggestions, 'label'));
                    this.salesAccounts$ = observableOf(_.orderBy(this.defaultItemSuggestions, 'label'));
                    this.resetForm();

                    let poCreated = this.localeData?.po_created;
                    poCreated = poCreated?.replace("[PO_NUMBER]", response.body.number);
                    this.toaster.successToast(poCreated);
                } else {
                    this.toaster.errorToast(response.message);
                }
            });
        } else {
            this.purchaseOrderService.update(getRequestObject, updatedData).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isFormSaveInProgress = false;
                this.toaster.clearAllToaster();
                if (response && response.status === "success") {
                    this.toaster.successToast(this.localeData?.po_updated);
                    this.router.navigate(['/pages/purchase-management/purchase-orders/preview/' + this.purchaseOrderUniqueName]);
                } else {
                    this.toaster.errorToast(response.message);
                }
            });
        }
    }

    /**
     * This will process the data and will arrange in desired format
     *
     * @param {*} obj
     * @param {VoucherClass} data
     * @returns {*}
     * @memberof CreatePurchaseOrderComponent
     */
    public updateData(obj: any, data: VoucherClass): any {
        if (obj.voucher) {
            delete obj.voucher;
        }

        let salesEntryClassArray: SalesEntryClassMulticurrency[] = [];
        let entries = data.entries;

        entries.forEach(entry => {
            let salesEntryClass = new SalesEntryClassMulticurrency();
            salesEntryClass.voucherType = entry.voucherType;
            salesEntryClass.uniqueName = entry.uniqueName;
            salesEntryClass.description = entry.description;
            let calculationMethod = (entry.otherTaxModal && entry.otherTaxModal.tcsCalculationMethod) ? entry.otherTaxModal.tcsCalculationMethod : "";
            entry.taxList.forEach(t => {
                salesEntryClass.taxes.push({ uniqueName: t, calculationMethod: calculationMethod });
            });
            entry.transactions.forEach(transaction => {
                let transactionClassMul = new TransactionClassMulticurrency();
                transactionClassMul.account.uniqueName = transaction.accountUniqueName;
                transactionClassMul.account.name = transaction.accountName;
                transactionClassMul.amount.amountForAccount = transaction.amount;
                salesEntryClass.hsnNumber = (transaction.showCodeType === "hsn") ? transaction.hsnNumber : "";
                salesEntryClass.sacNumber = (transaction.showCodeType === "sac") ? transaction.sacNumber : "";
                salesEntryClass.description = transaction.description;
                if (transaction.isStockTxn) {
                    let salesAddBulkStockItems = new SalesAddBulkStockItems();
                    salesAddBulkStockItems.name = transaction.stockDetails.name;
                    salesAddBulkStockItems.uniqueName = transaction.stockDetails.uniqueName;
                    salesAddBulkStockItems.quantity = transaction.quantity;
                    salesAddBulkStockItems.rate = {};
                    salesAddBulkStockItems.rate.amountForAccount = transaction.rate;
                    salesAddBulkStockItems.sku = transaction.stockDetails.skuCode;
                    salesAddBulkStockItems.stockUnit = new CodeStockMulticurrency();
                    salesAddBulkStockItems.stockUnit.code = transaction.stockUnit;

                    transactionClassMul.stock = salesAddBulkStockItems;
                }
                salesEntryClass.transactions.push(transactionClassMul);
            });

            entry.discounts.forEach(discount => {
                salesEntryClass.discounts.push(new DiscountMulticurrency(discount));
            });

            salesEntryClassArray.push(salesEntryClass);
        });

        obj.templateDetails = data.templateDetails;
        obj.entries = salesEntryClassArray;

        obj.account.billingDetails.countryName = this.vendorCountry;
        obj.account.billingDetails.stateCode = obj.account.billingDetails.state.code;
        obj.account.billingDetails.stateName = obj.account.billingDetails.state.name;

        obj.account.shippingDetails.countryName = this.vendorCountry;
        obj.account.shippingDetails.stateCode = obj.account.shippingDetails.state.code;
        obj.account.shippingDetails.stateName = obj.account.shippingDetails.state.name;

        if (this.isUpdateMode) {
            obj.uniqueName = this.purchaseOrderUniqueName;
        }

        delete obj.account.customerName;

        return obj;
    }

    /**
     * This will convert the data into giddh format
     *
     * @param {*} val
     * @returns {string}
     * @memberof CreatePurchaseOrderComponent
     */
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

    /**
     * Callback for add bulk items
     *
     * @param {SalesAddBulkStockItems[]} items
     * @memberof CreatePurchaseOrderComponent
     */
    public addBulkStockItems(items: SalesAddBulkStockItems[]): void {
        const startIndex = this.purchaseOrder.entries.length;
        let isBlankItemPresent;
        this.ngZone.runOutsideAngular(() => {
            for (const item of items) {
                // add quantity to additional because we are using quantity from bulk modal so we have to pass it to onSelectSalesAccount
                item.additional['quantity'] = item.quantity;
                let lastIndex = -1;
                let blankItemIndex = this.purchaseOrder.entries.findIndex(sItem => !sItem.transactions[0].accountUniqueName);
                let isBlankItemInBetween;
                if (blankItemIndex > -1) {
                    lastIndex = blankItemIndex;
                    this.purchaseOrder.entries[lastIndex] = new SalesEntryClass();
                    isBlankItemInBetween = true;
                    isBlankItemPresent = true;
                } else {
                    this.purchaseOrder.entries.push(new SalesEntryClass());
                    lastIndex = this.purchaseOrder.entries.length - 1;
                    isBlankItemInBetween = false;
                }

                this.activeIndex = lastIndex;
                this.purchaseOrder.entries[lastIndex].transactions[0].fakeAccForSelect2 = item.uniqueName;
                this.purchaseOrder.entries[lastIndex].isNewEntryInUpdateMode = true;
                if (isBlankItemInBetween) {
                    // Update the context of blank items found in between of list of entries
                    const viewRef: any = this.container.get(lastIndex);
                    viewRef.context.$implicit = this.purchaseOrder.entries[lastIndex];
                    viewRef.context.transaction = this.purchaseOrder.entries[lastIndex].transactions[0];
                }
                this.onSelectSalesAccount(item, this.purchaseOrder.entries[lastIndex].transactions[0], this.purchaseOrder.entries[lastIndex], true, lastIndex);
            }
        });
        this.buildBulkData(this.purchaseOrder.entries.length, isBlankItemPresent ? 0 : startIndex, isBlankItemPresent);
    }

    /**
     * This will be called on change of stock unit
     *
     * @param {*} transaction
     * @param {*} selectedUnit
     * @returns {void}
     * @memberof CreatePurchaseOrderComponent
     */
    public onChangeUnit(transaction: any, selectedUnit: any): void {
        if (!event) {
            return;
        }
        _.find(transaction.stockList, (txn) => {
            if (txn.id === selectedUnit) {
                return transaction.rate = txn.rate;
            }
        });
    }

    /**
     * This will reset the form
     *
     * @param {NgForm} poForm
     * @memberof CreatePurchaseOrderComponent
     */
    public resetForm(): void {
        if (this.container) {
            this.container.clear();
        }
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.purchaseOrder = new PurchaseOrder();
        this.resetVendor();
        if (this.vendorNameDropDown) {
            this.vendorNameDropDown.clear();
        }
        this.purchaseOrders = [];
        this.activeIndex = 0;
        this.isRcmEntry = false;
        this.initializeWarehouse();
        this.fillCompanyAddress("reset");
        this.assignDates();
        this.createEmbeddedViewAtIndex(0);
    }

    /**
     * This will fill the company address in billing details
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public fillCompanyAddress(event: string): void {
        if (this.purchaseOrderUniqueName && event === "fill") {
            return;
        }
        let branches = [];
        let currentBranch;
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            if (response && response.length) {
                branches = response;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
            }
        });
        if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
            // Find the current checked out branch
            currentBranch = branches.find(branch => branch.uniqueName === this.generalService.currentBranchUniqueName);
        } else {
            // Find the HO branch
            currentBranch = branches.find(branch => !branch.parentBranch);
        }
        if (currentBranch && currentBranch.addresses) {
            const defaultAddress = currentBranch.addresses.find(address => (address && address.isDefault));
            this.purchaseOrder.company.billingDetails.address = [];
            this.purchaseOrder.company.billingDetails.address.push(defaultAddress ? defaultAddress.address : '');
            this.purchaseOrder.company.billingDetails.state.code = defaultAddress ? defaultAddress.stateCode : '';
            this.purchaseOrder.company.billingDetails.state.name = defaultAddress ? defaultAddress.stateName : '';
            this.purchaseOrder.company.billingDetails.stateCode = defaultAddress ? defaultAddress.stateCode : '';
            this.purchaseOrder.company.billingDetails.stateName = defaultAddress ? defaultAddress.stateName : '';
            this.purchaseOrder.company.billingDetails.gstNumber = defaultAddress ? defaultAddress.taxNumber : '';
            this.purchaseOrder.company.billingDetails.pincode = defaultAddress ? defaultAddress.pincode : '';
        }
    }

    /**
     * This will put focus in vendor field
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public focusInVendorName(): void {
        setTimeout(() => {
            let firstElementToFocus: any = document.getElementsByClassName('firstElementToFocus');
            if (firstElementToFocus[0]) {
                firstElementToFocus[0].focus();
                if (this.vendorNameDropDown && !this.isUpdateMode) {
                    this.vendorNameDropDown.show();
                }
            }
        }, 200);
    }

    /**
     * This will toggle other tax aside pane
     *
     * @param {boolean} modalBool
     * @param {number} [index=null]
     * @returns {void}
     * @memberof CreatePurchaseOrderComponent
     */
    public toggleOtherTaxesAsidePane(modalBool: boolean, index: number = null): void {
        if (!modalBool) {
            let entry = this.purchaseOrder.entries[this.activeIndex];
            if (entry) {
                entry.otherTaxModal = new SalesOtherTaxesModal();
                entry.otherTaxSum = 0;
            }
            return;
        } else {
            if (index !== null) {
                this.entriesListBeforeTax = cloneDeep(this.purchaseOrder.entries);
            }
        }
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Closes the other taxes side menu panel on click of overlay
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public closeAsideMenuStateForOtherTaxes(): void {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            this.toggleOtherTaxesAsidePane(true, null);
            if (this.purchaseOrder.entries[this.tcsTdsIndex]) {
                this.purchaseOrder.entries[this.tcsTdsIndex].isOtherTaxApplicable = false;
            }
        }
    }

    /**
     * This will update the entry amount on quantity blur
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} transaction
     * @memberof CreatePurchaseOrderComponent
     */
    public handleQuantityBlur(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        if (transaction.quantity !== undefined) {
            transaction.quantity = Number(transaction.quantity);
            this.calculateStockEntryAmount(transaction);
            this.calculateWhenTrxAltered(entry, transaction);
        }
    }

    /**
     * Releases the memory
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public ngOnDestroy(): void {
        this.resetForm();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will get the purchase order by uniquename
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public getPurchaseOrder(): void {
        this.startLoader(true);

        let getRequest = { companyUniqueName: this.selectedCompany.uniqueName, poUniqueName: this.purchaseOrderUniqueName };

        this.purchaseOrderService.get(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === "success") {
                    this.purchaseOrderDetails = response.body;
                    let entriesUpdated = false;

                    if (this.purchaseOrderDetails && this.purchaseOrderDetails.account && !this.copiedAccountDetails && !this.getAccountInProgress) {
                        this.getAccountInProgress = true;
                        this.getAccountDetails(this.purchaseOrderDetails.account.uniqueName);
                    }
                    this.interval = setInterval(() => {
                        if (this.purchaseOrderDetails && this.purchaseOrderDetails.entries && this.vendorAccountsLoaded && !entriesUpdated && this.copiedAccountDetails) {
                            entriesUpdated = true;
                            clearInterval(this.interval);
                            this.purchaseOrder.entries = this.modifyEntries(this.purchaseOrderDetails.entries);
                            this.showLoaderUntilDataPrefilled = false;
                            this.buildBulkData(this.purchaseOrder.entries.length, 0);
                            this.handleWarehouseVisibility();
                        }
                    }, 500);

                    this.purchaseOrder.templateDetails = this.purchaseOrderDetails.templateDetails;

                    if (this.purchaseOrderDetails.warehouse) {
                        this.initializeWarehouse(this.purchaseOrderDetails.warehouse);
                    }

                    this.isRcmEntry = (this.purchaseOrderDetails.subVoucher && this.purchaseOrderDetails.subVoucher === SubVoucher.ReverseCharge) ? true : false;

                    this.purchaseOrder.company = this.purchaseOrderDetails.company;

                    this.purchaseOrder.company.billingDetails.state = { name: '', code: '' };
                    this.purchaseOrder.company.shippingDetails.state = { name: '', code: '' };

                    this.purchaseOrder.company.billingDetails.state.code = this.purchaseOrderDetails.company.billingDetails.stateCode;
                    this.purchaseOrder.company.billingDetails.state.name = this.purchaseOrderDetails.company.billingDetails.stateName;

                    this.purchaseOrder.company.shippingDetails.state.code = this.purchaseOrderDetails.company.shippingDetails.stateCode;
                    this.purchaseOrder.company.shippingDetails.state.name = this.purchaseOrderDetails.company.shippingDetails.stateName;

                    this.checkForAutoFillShippingAddress('company');

                    if (this.isUpdateMode) {
                        this.purchaseOrder.voucherDetails.voucherDate = this.purchaseOrderDetails.date;
                        this.purchaseOrder.voucherDetails.dueDate = this.purchaseOrderDetails.dueDate;
                    } else {
                        this.purchaseOrder.voucherDetails.voucherDate = this.universalDate || new Date();
                        this.assignDueDate();
                    }
                } else {
                    this.toaster.errorToast(response.message);
                }
            }
        });
    }

    /**
     * This will modify the entries and adapt it into the desired format
     *
     * @param {any[]} entries
     * @returns {*}
     * @memberof CreatePurchaseOrderComponent
     */
    public modifyEntries(entries: any[]): any {
        let convertedEntries = [];
        this.activeIndex = 0;
        let entryTaxes = this.companyTaxesList;

        entries.forEach(entry => {
            let salesEntryClass = new SalesEntryClass();
            let salesTransactionItemClass = new SalesTransactionItemClass();
            salesEntryClass.tcsTaxList = [];
            salesEntryClass.tdsTaxList = [];
            salesEntryClass.transactions = [];

            entry.transactions.forEach(transaction => {
                salesTransactionItemClass = new SalesTransactionItemClass();
                salesTransactionItemClass.accountUniqueName = transaction.account.uniqueName;
                salesTransactionItemClass.accountName = transaction.account.name;
                salesTransactionItemClass.amount = transaction.amount.amountForAccount;
                salesTransactionItemClass.hsnNumber = transaction.hsnNumber;
                salesTransactionItemClass.sacNumber = transaction.sacNumber;
                salesTransactionItemClass.sacNumberExists = (transaction.sacNumber) ? true : false;
                salesTransactionItemClass.showCodeType = transaction.hsnNumber ? "hsn" : "sac";
                salesTransactionItemClass.fakeAccForSelect2 = transaction.account.uniqueName;
                salesTransactionItemClass.description = entry.description;
                salesTransactionItemClass.date = transaction.date;

                let usedTaxes = [];

                entry.taxes.forEach(tax => {
                    let taxTypeArr = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
                    if (taxTypeArr.indexOf(tax.taxType) > -1) {
                        salesEntryClass.isOtherTaxApplicable = true;
                        let otherTaxModal = new SalesOtherTaxesModal();
                        otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                        otherTaxModal.tcsCalculationMethod = tax.calculationMethod;
                        salesEntryClass.otherTaxModal = otherTaxModal;

                        if (tax.taxType === 'tdsrc' || tax.taxType === 'tdspay') {
                            salesEntryClass.tdsTaxList.push(tax.uniqueName);
                        } else {
                            salesEntryClass.tcsTaxList.push(tax.uniqueName);
                        }
                    } else {
                        let selectedTax;
                        if (usedTaxes.indexOf(tax.uniqueName) === -1) {
                            usedTaxes.push(tax.uniqueName);

                            if (entryTaxes && entryTaxes.length > 0) {
                                entryTaxes.forEach(entryTax => {
                                    if (entryTax.uniqueName === tax.uniqueName) {
                                        selectedTax = entryTax;
                                    }
                                });
                            }

                            salesEntryClass.taxes.push({
                                amount: tax.taxPercent,
                                uniqueName: tax.uniqueName,
                                isChecked: true,
                                isDisabled: false,
                                type: tax.taxType,
                                name: tax.name || (selectedTax && selectedTax.name) || ''
                            });
                        }
                    }
                });

                if (transaction.stock) {
                    salesTransactionItemClass.isStockTxn = true;
                    salesTransactionItemClass.stockDetails = {};
                    salesTransactionItemClass.stockDetails.name = transaction.stock.name;
                    salesTransactionItemClass.stockDetails.uniqueName = transaction.stock.uniqueName;
                    salesTransactionItemClass.stockDetails.customField1 = transaction.stock.customField1;
                    salesTransactionItemClass.stockDetails.customField2 = transaction.stock.customField2;
                    salesTransactionItemClass.stockDetails.stockUnit = transaction.stock.stockUnit;
                    salesTransactionItemClass.stockDetails.unitRates = transaction.stock.unitRates;
                    salesTransactionItemClass.stockDetails.uniqueName = transaction.stock.uniqueName;
                    salesTransactionItemClass.stockDetails.skuCodeHeading = transaction.stock.skuCodeHeading;
                    salesTransactionItemClass.quantity = transaction.stock.quantity;
                    salesTransactionItemClass.rate = transaction.stock.rate.amountForAccount;
                    salesTransactionItemClass.stockDetails.skuCode = transaction.stock.sku;
                    salesTransactionItemClass.stockUnit = transaction.stock.stockUnit.code;
                    salesTransactionItemClass.fakeAccForSelect2 = transaction.account.uniqueName + '#' + transaction.stock.uniqueName;

                    let stock = salesTransactionItemClass.stockDetails;

                    if (stock) {
                        // description with sku and custom fields
                        salesTransactionItemClass.sku_and_customfields = null;
                        let description = [];
                        let skuCodeHeading = stock.skuCodeHeading ? stock.skuCodeHeading : this.commonLocaleData?.app_sku_code;

                        if (stock.skuCode) {
                            description.push(skuCodeHeading + ':' + stock.skuCode);
                        }

                        let customField1Heading = stock.customField1Heading ? stock.customField1Heading : this.localeData?.custom_field1;
                        if (stock.customField1Value) {
                            description.push(customField1Heading + ':' + stock.customField1Value);
                        }

                        let customField2Heading = stock.customField2Heading ? stock.customField2Heading : this.localeData?.custom_field2;
                        if (stock.customField2Value) {
                            description.push(customField2Heading + ':' + stock.customField2Value);
                        }

                        salesTransactionItemClass.sku_and_customfields = description.join(', ');
                    }
                    stock.unitRates = stock.unitRates || [];
                    const unitRate = stock.unitRates.find(rate => rate.code === stock.stockUnit.code);
                    let stockUnit: IStockUnit = {
                        id: stock.stockUnit.code,
                        text: unitRate ? unitRate.stockUnitName : ''
                    };
                    salesTransactionItemClass.stockList = [];
                    if (stock.unitRates && stock.unitRates.length) {
                        salesTransactionItemClass.stockList = this.prepareUnitArr(stock.unitRates);
                    } else {
                        salesTransactionItemClass.stockList.push(stockUnit);
                    }
                }
                salesEntryClass.transactions.push(salesTransactionItemClass);

            });

            if (entry.discounts && entry.discounts.length) {
                let discountArray = [];
                let tradeDiscountArray = [];
                entry.discounts.forEach(discount => {
                    let discountLedger = new LedgerDiscountClass();

                    discountLedger.amount = discount.discountValue;
                    discountLedger.discountType = discount.calculationMethod;
                    discountLedger.discountValue = discount.discountValue;
                    discountLedger.isActive = true;
                    discountLedger.discountUniqueName = discount.uniqueName;
                    discountLedger.name = discount.name;
                    discountLedger.particular = discount.particular;
                    discountLedger.uniqueName = discountLedger.discountUniqueName;
                    let tradeDiscount = new LedgerResponseDiscountClass();
                    tradeDiscount.discount = {
                        uniqueName: '',
                        name: '',
                        discountType: "PERCENTAGE",
                        discountValue: 0
                    };
                    tradeDiscount.account = {
                        accountType: '',
                        uniqueName: entry.uniqueName,
                        name: ''
                    };
                    tradeDiscount.discount.uniqueName = discountLedger.discountUniqueName;
                    tradeDiscount.discount.discountValue = discountLedger.discountValue;
                    tradeDiscount.discount.discountType = discountLedger.discountType;
                    tradeDiscount.discount.name = discountLedger.name;
                    tradeDiscountArray.push(tradeDiscount);
                });
                salesEntryClass.discounts = discountArray;
                salesEntryClass.tradeDiscounts = tradeDiscountArray;
            } else {
                salesEntryClass.discounts = [new LedgerDiscountClass()];
            }

            salesEntryClass.discounts = this.parseDiscountFromResponse(salesEntryClass);
            salesEntryClass.voucherType = entry.voucherType;
            salesEntryClass.uniqueName = entry.uniqueName;
            salesEntryClass.description = entry.description;
            this.calculateOtherTaxes(salesEntryClass.otherTaxModal, salesEntryClass);
            convertedEntries.push(salesEntryClass);
            this.activeIndex++;
        });
        this.exchangeRate = this.purchaseOrderDetails.exchangeRate;
        this.originalExchangeRate = this.exchangeRate;
        this.previousExchangeRate = this.exchangeRate;

        return convertedEntries;
    }

    /**
     * This will modify the entry discount and adapt it into the desired format
     *
     * @private
     * @param {*} entry
     * @returns {LedgerDiscountClass[]}
     * @memberof CreatePurchaseOrderComponent
     */
    private parseDiscountFromResponse(entry: any): LedgerDiscountClass[] {
        let discountArray: LedgerDiscountClass[] = [];

        if (entry.tradeDiscounts) {
            let isDefaultDiscountThere = entry.tradeDiscounts.some(s => !s.discount.uniqueName);

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
            }

            entry.tradeDiscounts.forEach((tradeDiscount) => {
                discountArray.push({
                    discountType: tradeDiscount.discount.discountType,
                    amount: tradeDiscount.discount.discountValue,
                    name: tradeDiscount.discount.name,
                    particular: tradeDiscount.account.uniqueName,
                    isActive: true,
                    discountValue: tradeDiscount.discount.discountValue,
                    discountUniqueName: tradeDiscount.discount.uniqueName
                });

            });
        }

        return discountArray;
    }

    /**
     * This will cancel the update
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public cancelUpdate(): void {
        this.router.navigate(['/pages/purchase-management/purchase-orders/preview/' + this.purchaseOrderUniqueName]);
    }

    /**
     * This will validate tax in case of RCM enabled
     *
     * @param {*} data
     * @returns {boolean}
     * @memberof CreatePurchaseOrderComponent
     */
    public validateTaxes(data: any): boolean {
        let validEntries = true;
        data.entries.forEach((entry: any, index: number) => {
            const transaction = (this.purchaseOrder && this.purchaseOrder.entries && this.purchaseOrder.entries[index].transactions) ?
                this.purchaseOrder.entries[index].transactions[0] : '';
            if (transaction) {
                transaction['requiredTax'] = (entry.taxes && entry.taxes.length === 0);
                validEntries = !(entry.taxes.length === 0); // Entry is invalid if tax length is zero
            }
        });
        return validEntries;
    }

    /**
     * This will get the invoice/purchase settings
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public getInvoiceSettings(): void {
        this.invoiceService.GetInvoiceSetting().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                this.invoiceSettings = _.cloneDeep(response.body);
                this.inventorySettings = this.invoiceSettings.companyInventorySettings;
                this.assignDueDate();
            }
        });
    }

    /**
     * This will update the exchange rate
     *
     * @param {*} val
     * @memberof CreatePurchaseOrderComponent
     */
    public updateExchangeRate(val: any): void {
        val = (val) ? val.replace(this.baseCurrencySymbol, '') : '';
        let total = (val) ? (parseFloat(this.generalService.removeSpecialCharactersFromAmount(val)) || 0) : 0;
        if (this.isMulticurrencyAccount) {
            this.exchangeRate = total / this.purchaseOrder.voucherDetails.grandTotal || 0;
            this.originalExchangeRate = this.exchangeRate;
            this.previousExchangeRate = this.exchangeRate;
        }
    }

    /**
     * This will update the due date based on settings
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public assignDueDate(): void {
        let duePeriod: number;
        duePeriod = this.invoiceSettings.purchaseBillSettings ? this.invoiceSettings.purchaseBillSettings.poDuePeriod : 0;
        this.purchaseOrder.voucherDetails.dueDate = duePeriod > 0 ? dayjs(this.purchaseOrder.voucherDetails.voucherDate).add(duePeriod, 'day').toDate() : dayjs(this.purchaseOrder.voucherDetails.voucherDate).toDate();
    }

    /**
     * This will get the list of PO by vendor
     *
     * @param {*} vendorName
     * @memberof CreatePurchaseOrderComponent
     */
    public getVendorPurchaseOrders(vendorName: any): void {
        if (this.selectedCompany) {
            let purchaseOrderGetRequest = { companyUniqueName: this.selectedCompany.uniqueName, accountUniqueName: vendorName, page: 1, count: 10, sort: '', sortBy: '' };
            let purchaseOrderPostRequest = { statuses: [PURCHASE_ORDER_STATUS.open, PURCHASE_ORDER_STATUS.partiallyReceived, PURCHASE_ORDER_STATUS.expired, PURCHASE_ORDER_STATUS.cancelled] };

            if (purchaseOrderGetRequest.companyUniqueName && vendorName) {
                this.purchaseOrders = [];

                this.purchaseOrderService.getAllPendingPo(purchaseOrderGetRequest, purchaseOrderPostRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res) {
                        if (res.status === 'success') {
                            if (res.body && res.body.length > 0) {
                                this.purchaseOrders = res.body;
                            }
                        } else {
                            this.toaster.errorToast(res.message);
                        }
                    }
                });
            }
        }
    }

    /**
     * This will check if we need to show pipe symbol
     *
     * @param {number} loop
     * @returns {boolean}
     * @memberof CreatePurchaseOrderComponent
     */
    public checkIfPipeSymbolRequired(loop: number): boolean {
        return loop < (this.purchaseOrders.length - 1);
    }

    /**
     * This will open the purchase order preview popup
     *
     * @param {TemplateRef<any>} template
     * @param {*} purchaseOrderUniqueName
     * @memberof CreatePurchaseOrderComponent
     */
    public openPurchaseOrderPreviewPopup(template: TemplateRef<any>, purchaseOrderUniqueName: any, accountUniqueName: any): void {
        this.purchaseOrderPreviewUniqueName = purchaseOrderUniqueName;
        this.purchaseOrderPreviewAccountUniqueName = accountUniqueName;

        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-xl' })
        );
    }

    /**
     * This will close the purchase order preview popup
     *
     * @param {*} event
     * @memberof CreatePurchaseOrderComponent
     */
    public closePurchaseOrderPreviewPopup(event: any): void {
        if (event) {
            this.modalRef.hide();
        }
    }

    /**
     * This will toggle the create new stock/service aside pan
     *
     * @param {number} [index]
     * @memberof CreatePurchaseOrderComponent
     */
    public onNoResultsClicked(index?: number): void {
        if (!_.isUndefined(index)) {
            this.innerEntryIndex = index;
        }
        this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Callback for on blur event of order date
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public onUpdateOrderDate(): void {
        this.isOrderDateChanged = true;
        if (this.isMulticurrencyAccount && this.purchaseOrder.voucherDetails.voucherDate) {
            let voucherDate = (typeof this.purchaseOrder.voucherDetails.voucherDate === "object") ? dayjs(this.purchaseOrder.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT) : this.purchaseOrder.voucherDetails.voucherDate;
            this.getCurrencyRate(this.companyCurrency, this.customerCurrencyCode, voucherDate);
        }
        if (this.invoiceSettings && this.invoiceSettings.purchaseBillSettings) {
            setTimeout(() => {
                this.assignDueDate();
            }, 200);
        }
    }

    /**
     * This will fill the selected address
     *
     * @param {*} data
     * @param {*} address
     * @param {false} isCompanyAddress
     * @memberof CreatePurchaseOrderComponent
     */
    public selectAddress(data: any, address: any, isCompanyAddress: false): void {
        if (data && address) {
            data.address[0] = address.address;

            if (!data.state) {
                data.state = {};
            }

            data.state.code = (isCompanyAddress) ? address.stateCode : (address.state) ? address.state.code : "";
            data.gstNumber = (isCompanyAddress) ? address.taxNumber : address.gstNumber;
            data.pincode = address.pincode;

            if (isCompanyAddress) {
                this.autoFillShippingDetails('company');
            } else {
                this.autoFillShippingDetails('vendor');
            }
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {string} searchType Type of search to make
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof CreatePurchaseOrderComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1, searchType: string, successCallback?: Function): void {
        if (!this.preventDefaultScrollApiCall &&
            (query || (searchType === SEARCH_TYPE.VENDOR && this.defaultVendorSuggestions && this.defaultVendorSuggestions.length === 0) ||
                (searchType === SEARCH_TYPE.ITEM && this.defaultItemSuggestions && this.defaultItemSuggestions.length === 0) || successCallback)) {
            if (searchType === SEARCH_TYPE.VENDOR) {
                this.searchVendorResultsPaginationData.query = query;
            } else if (searchType === SEARCH_TYPE.ITEM) {
                this.searchItemResultsPaginationData.query = query;
            }
            const requestObject = this.getSearchRequestObject(query, page, searchType);
            this.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    this.prepareSearchLists(data.body.results, page, searchType);
                    this.noResultsFoundLabel = SearchResultText.NotFound;
                    if (searchType === SEARCH_TYPE.VENDOR) {
                        this.searchVendorResultsPaginationData.page = data.body.page;
                        this.searchVendorResultsPaginationData.totalPages = data.body.totalPages;
                    } else if (searchType === SEARCH_TYPE.ITEM) {
                        this.searchItemResultsPaginationData.page = data.body.page;
                        this.searchItemResultsPaginationData.totalPages = data.body.totalPages;
                    }
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        if (searchType === SEARCH_TYPE.VENDOR) {
                            this.defaultVendorResultsPaginationData.page = data.body.page;
                            this.defaultVendorResultsPaginationData.totalPages = data.body.totalPages;
                        } else if (searchType === SEARCH_TYPE.ITEM) {
                            this.defaultItemResultsPaginationData.page = data.body.page;
                            this.defaultItemResultsPaginationData.totalPages = data.body.totalPages;
                        }
                    }
                }
            });
        } else {
            if (searchType === SEARCH_TYPE.VENDOR) {
                this.searchResults = [...this.defaultVendorSuggestions];
                this.searchVendorResultsPaginationData.page = this.defaultVendorResultsPaginationData.page;
                this.searchVendorResultsPaginationData.totalPages = this.defaultVendorResultsPaginationData.totalPages;
            } else if (searchType === SEARCH_TYPE.ITEM) {
                this.searchResults = [...this.defaultItemSuggestions];
                this.searchItemResultsPaginationData.page = this.defaultItemResultsPaginationData.page;
                this.searchItemResultsPaginationData.totalPages = this.defaultItemResultsPaginationData.totalPages;
            }
            this.assignSearchResultToList(searchType);
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll to bottom handler
     *
     * @param {string} searchType Search type
     * @memberof CreatePurchaseOrderComponent
     */
    public handleScrollEnd(searchType: string): void {
        const query = searchType === SEARCH_TYPE.VENDOR ? this.searchVendorResultsPaginationData.query :
            searchType === SEARCH_TYPE.ITEM ? this.searchItemResultsPaginationData.query : '';
        const page = searchType === SEARCH_TYPE.VENDOR ? this.searchVendorResultsPaginationData.page :
            searchType === SEARCH_TYPE.ITEM ? this.searchItemResultsPaginationData.page : 1;
        if (
            (searchType === SEARCH_TYPE.VENDOR && this.searchVendorResultsPaginationData.page < this.searchVendorResultsPaginationData.totalPages) ||
            (searchType === SEARCH_TYPE.ITEM && this.searchItemResultsPaginationData.page < this.searchItemResultsPaginationData.totalPages)) {
            this.onSearchQueryChanged(
                query,
                page + 1,
                searchType,
                (response) => {
                    if (!query) {
                        const results = response.map(result => {
                            return {
                                value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                                label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                                additional: result
                            }
                        }) || [];
                        if (searchType === SEARCH_TYPE.VENDOR) {
                            this.defaultVendorSuggestions = this.defaultVendorSuggestions.concat(...results);
                            this.defaultVendorResultsPaginationData.page = this.searchVendorResultsPaginationData.page;
                            this.defaultVendorResultsPaginationData.totalPages = this.searchVendorResultsPaginationData.totalPages;
                            this.searchResults = [...this.defaultVendorSuggestions];
                            this.assignSearchResultToList(SEARCH_TYPE.VENDOR);
                        } else if (searchType === SEARCH_TYPE.ITEM) {
                            this.defaultItemSuggestions = this.defaultItemSuggestions.concat(...results);
                            this.defaultItemResultsPaginationData.page = this.searchItemResultsPaginationData.page;
                            this.defaultItemResultsPaginationData.totalPages = this.searchItemResultsPaginationData.totalPages;
                            this.searchResults = [...this.defaultItemSuggestions];
                            this.assignSearchResultToList(SEARCH_TYPE.ITEM);
                        }
                    }
                });
        }
    }

    /**
     * Returns the search request object
     *
     * @param {string} query Query to be searched
     * @param {number} [page=1] Page for which search is to be made
     * @param {string} searchType Type of search to be performed
     * @returns {*} Search request object
     * @memberof CreatePurchaseOrderComponent
     */
    public getSearchRequestObject(query: string, page: number = 1, searchType: string): any {
        let withStocks: boolean;
        let group: string;
        if (searchType === SEARCH_TYPE.VENDOR) {
            this.searchVendorResultsPaginationData.query = query;
            group = 'sundrycreditors';
            this.selectedGroupUniqueNameForAddEditAccountModal = 'sundrycreditors';
        } else if (searchType === SEARCH_TYPE.ITEM) {
            group = 'operatingcost, indirectexpenses';
            withStocks = !!query;

            if(this.voucherApiVersion === 2) {
                group += ", fixedassets";
            }
        }
        const requestObject = {
            q: encodeURIComponent(query),
            page,
            group: encodeURIComponent(group)
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
     * @memberof CreatePurchaseOrderComponent
     */
    public searchAccount(requestObject: any): Observable<any> {
        return this.searchService.searchAccount(requestObject);
    }

    /**
     * Prepares the search list when the data is received
     *
     * @param {*} results Search results
     * @param {number} [currentPage=1] Current page requested
     * @param {string} searchType Search type of the searched item
     * @memberof CreatePurchaseOrderComponent
     */
    public prepareSearchLists(results: any, currentPage: number = 1, searchType: string): void {
        const searchResults = results.map(result => {
            return {
                value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
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
            this.searchResults = _.uniqBy(results, 'value');
        }
        this.assignSearchResultToList(searchType);
    }

    /**
     * Loads the default search suggestion for vendor and item when voucher module is loaded and
     * when voucher is changed
     *
     * @private
     * @memberof CreatePurchaseOrderComponent
     */
    private loadDefaultSearchSuggestions(): void {
        this.onSearchQueryChanged('', 1, SEARCH_TYPE.VENDOR, (response) => {
            let selectedAccountDetails;
            if (this.isUpdateMode) {
                this.selectedAccountDetails$.pipe(take(1)).subscribe(accountDetails => {
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
                    value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                    label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                    additional: result
                }
            }) || [];
            this.defaultVendorSuggestions = _.uniqBy(results, 'value');
            this.noResultsFoundLabel = SearchResultText.NotFound;
            this.searchResults = [
                ...this.defaultVendorSuggestions
            ];
            this.assignSearchResultToList(SEARCH_TYPE.VENDOR);
            this.vendorAccountsLoaded = true;
            if (this.purchaseOrderDetails && this.purchaseOrderDetails.account && !this.copiedAccountDetails && !this.getAccountInProgress) {
                this.getAccountInProgress = true;
                this.getAccountDetails(this.purchaseOrderDetails.account.uniqueName);
            }
            this.focusInVendorName();
        });
        this.onSearchQueryChanged('', 1, SEARCH_TYPE.ITEM, (response) => {
            this.defaultItemSuggestions = response.map(result => {
                return {
                    value: result.stock ? `${result.uniqueName}#${result.stock.uniqueName}` : result.uniqueName,
                    label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
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
     * @memberof CreatePurchaseOrderComponent
     */
    private assignSearchResultToList(searchType: string): void {
        if (searchType === SEARCH_TYPE.VENDOR) {
            this.vendorAcList$ = observableOf(_.orderBy(this.searchResults, 'label'));
        } else if (searchType === SEARCH_TYPE.ITEM) {
            this.salesAccounts$ = observableOf(_.orderBy(this.searchResults, 'label'));
        }
    }

    /**
     * Calculates the entry value
     *
     * @param {*} selectedAcc Currently selected account
     * @param {SalesTransactionItemClass} transaction Current transaction of entry
     * @param {SalesEntryClass} entry Entry
     * @returns {SalesTransactionItemClass} Returns the complete transaction instance
     * @memberof CreatePurchaseOrderComponent
     */
    private calculateItemValues(selectedAcc: any, transaction: SalesTransactionItemClass, entry: SalesEntryClass, calculateTransaction: boolean = true, isBulkItem?: boolean): SalesTransactionItemClass {
        let additional = _.cloneDeep(selectedAcc.additional);
        transaction.quantity = additional.quantity ? additional.quantity : (additional.stock) ? 1 : null;
        transaction.applicableTaxes = [];
        transaction.sku_and_customfields = null;
        // description with sku and custom fields
        if ((additional.stock)) {
            let description = [];
            let skuCodeHeading = additional.stock.skuCodeHeading ? additional.stock.skuCodeHeading : this.commonLocaleData?.app_sku_code;
            if (additional.stock.skuCode) {
                description.push(skuCodeHeading + ':' + additional.stock.skuCode);
            }

            let customField1Heading = additional.stock.customField1Heading ? additional.stock.customField1Heading : this.localeData?.custom_field1;
            if (additional.stock.customField1Value) {
                description.push(customField1Heading + ':' + additional.stock.customField1Value);
            }

            let customField2Heading = additional.stock.customField2Heading ? additional.stock.customField2Heading : this.localeData?.custom_field2;
            if (additional.stock.customField2Value) {
                description.push(customField2Heading + ':' + additional.stock.customField2Value);
            }

            transaction.sku_and_customfields = description.join(', ');
        }

        // assign taxes and create fluctuation
        if (additional.stock && additional.stock.taxes && additional.stock.taxes.length) {
            additional.stock.taxes.forEach(stockTax => {
                let tax = this.companyTaxesList.find(tax => tax.uniqueName === stockTax);
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
                            transaction.applicableTaxes.push(stockTax);
                            break;
                    }
                }
            });
        } else {
            // assign taxes for non stock accounts
            if (isBulkItem) {
                transaction.applicableTaxes = additional.stock?.groupTaxes ? additional.stock?.groupTaxes : additional.applicableTaxes;
            } else {
                transaction.applicableTaxes = additional.applicableTaxes;
            }
        }

        transaction.accountName = additional.name;
        transaction.accountUniqueName = additional.uniqueName;

        if (additional.stock) {
            // set rate auto
            transaction.rate = null;
            let obj: IStockUnit = {
                id: additional.stock.stockUnitCode,
                text: additional.stock.stockUnitName
            };
            transaction.stockList = [];
            if (additional.stock && additional.stock.unitRates && additional.stock.unitRates.length) {
                transaction.stockList = this.prepareUnitArr(additional.stock.unitRates);
                transaction.stockUnit = transaction.stockList[0].id;
                transaction.rate = Number((transaction.stockList[0].rate / this.exchangeRate).toFixed(this.highPrecisionRate));
            } else {
                transaction.stockList.push(obj);
                transaction.stockUnit = additional.stock.stockUnit.code;
            }
            transaction.stockDetails = _.omit(additional.stock, ['accountStockDetails', 'stockUnit']);
            transaction.isStockTxn = true;
        } else {
            transaction.isStockTxn = false;
            transaction.stockUnit = null;
            transaction.stockDetails = null;
            transaction.stockList = [];
            // reset fields
            transaction.rate = null;
            transaction.quantity = null;
            transaction.amount = 0;
            transaction.taxableValue = 0;
        }
        this.handleWarehouseVisibility();
        transaction.sacNumber = null;
        transaction.sacNumberExists = false;
        transaction.hsnNumber = null;

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

        if (!additional.stock && additional.hsnNumber && additional.sacNumber) {
            if (this.inventorySettings?.manageInventory) {
                transaction.hsnNumber = additional.hsnNumber;
                transaction.hsnOrSac = 'hsn';
                transaction.showCodeType = "hsn";
            } else {
                transaction.sacNumber = additional.sacNumber;
                transaction.sacNumberExists = true;
                transaction.hsnOrSac = 'sac';
                transaction.showCodeType = "sac";
            }
        } else if (!additional.stock && additional.hsnNumber && !additional.sacNumber) {
            transaction.hsnNumber = additional.hsnNumber;
            transaction.hsnOrSac = 'hsn';
            transaction.showCodeType = "hsn";
        } else if (!additional.stock && !additional.hsnNumber && additional.sacNumber) {
            transaction.sacNumber = additional.sacNumber;
            transaction.sacNumberExists = true;
            transaction.hsnOrSac = 'sac';
            transaction.showCodeType = "sac";
        } else if (!additional.stock && !additional.hsnNumber && !additional.sacNumber) {
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
        this.focusOnDescription();
        this.calculateStockEntryAmount(transaction);
        this.calculateWhenTrxAltered(entry, transaction);
        return transaction;
    }

    /**
     * Creates the view progressively for bulk entries
     *
     * @private
     * @param {number} length Total length of the entries formed after bulk items are added
     * @param {number} startIndex Start index of the bulk items (the index from which progressive rendering will start)
     * @param {boolean} [isBlankItemInBetween] True, if any blank item is found in between
     * @memberof CreatePurchaseOrderComponent
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
                    this.activeIndex = null;
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
     * @memberof CreatePurchaseOrderComponent
     */
    private loadTaxesAndDiscounts(startIndex: number): void {
        this.showBulkLoader = true;
        for (let index = startIndex; index < this.purchaseOrder.entries.length; index++) {
            setTimeout(() => {
                this.activeIndex = index;
                if (index === (this.purchaseOrder.entries.length - 1)) {
                    this.showBulkLoader = false;
                }
            }, 30 * index);
        }
    }

    /**
     * Creates the embedded view at specific index
     *
     * @private
     * @params entryIndex {number} Index of current entry
     * @memberof CreatePurchaseOrderComponent
     */
    private createEmbeddedViewAtIndex(entryIndex: number): void {
        const context = {
            $implicit: this.purchaseOrder.entries[entryIndex],
            transaction: this.purchaseOrder.entries[entryIndex].transactions[0],
            entryIdx: entryIndex
        };
        if (this.template) {
            const view = this.template.createEmbeddedView(context);
            this.container.insert(view);
        }
    }

    /**
     * Opens product dropdown
     *
     * @private
     * @memberof CreatePurchaseOrderComponent
     */
    private openProductDropdown(): void {
        if (this.purchaseOrder?.account?.uniqueName) {
            setTimeout(() => {
                const shSelectField: ShSelectComponent = !this.isMobileScreen ? this.selectAccount?.first : this.selectAccount?.last;
                if (shSelectField) {
                    shSelectField.show();
                }
            }, 200);
        }
    }

    /**
     * Focuses on description field
     *
     * @private
     * @memberof CreatePurchaseOrderComponent
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
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof CreatePurchaseOrderComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;

            // get tax list and assign values to local vars
            this.store.pipe(select(state => state.company && state.company.isGetTaxesSuccess), takeUntil(this.destroyed$)).subscribe(isGetTaxes => {
                if (isGetTaxes) {
                    this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$)).subscribe((tax: TaxResponse[]) => {
                        if (tax) {
                            this.companyTaxesList = tax;
                            this.theadArrReadOnly.forEach((item: IContentCommon) => {
                                // show tax label
                                if (item.label === this.commonLocaleData?.app_tax) {
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
                    display: true,
                    label: this.commonLocaleData?.app_quantity_unit
                },
                {
                    display: true,
                    label: this.commonLocaleData?.app_rate
                },
                {
                    display: true,
                    label: this.commonLocaleData?.app_amount
                },
                {
                    display: true,
                    label: this.commonLocaleData?.app_discount
                },
                {
                    display: true,
                    label: this.commonLocaleData?.app_tax
                },
                {
                    display: true,
                    label: this.commonLocaleData?.app_total
                }
            ];

            this.vendorNotFoundText = this.localeData?.add_vendor;
        }
    }

    /**
     * Fetches the currency exchange rate between two countries
     *
     * @param {string} to Converted to currency symbol
     * @param {string} from Converted from currency symbol
     * @param {string} [date=dayjs().format(GIDDH_DATE_FORMAT)] Date on which currency rate is required, default is today's date
     * @memberof CreatePurchaseOrderComponent
     */
    public getCurrencyRate(to: string, from: string, date = dayjs().format(GIDDH_DATE_FORMAT)): void {
        if (from && to) {
            this.ledgerService.GetCurrencyRateNewApi(from, to, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    this.previousExchangeRate = this.exchangeRate;
                    this.originalExchangeRate = rate;
                    this.exchangeRate = rate;
                    if (from !== to) {
                        // Multi currency case
                        this.recalculateEntriesTotal();
                    }
                }
            }, (error => { }));
        }
    }

    /**
     * Updates the value of stocks in entries according to the changed ER (Exchange Rate)
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public updateStockEntries(): void {
        if (this.purchaseOrder.entries && this.purchaseOrder.entries.length) {
            this.purchaseOrder.entries.forEach(entry => {
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
        }
    }

    /**
     * Switch currency handler
     *
     * @param {boolean} switchCurr True, if currency exchange should be reversed
     * @memberof CreatePurchaseOrderComponent
     */
    public switchCurrencyImg(switchCurr: boolean): void {
        this.showSwitchedCurr = switchCurr;
        if (switchCurr) {
            this.reverseExchangeRate = this.exchangeRate ? 1 / this.exchangeRate : 0;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    /**
     * Saves the edited exchange rate
     *
     * @param {boolean} toSave True, if need to save the updated rate
     * @memberof CreatePurchaseOrderComponent
     */
    public saveCancelExcRate(toSave: boolean): void {
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
     * Recalculates the entries total value
     *
     * @private
     * @memberof CreatePurchaseOrderComponent
     */
    private recalculateEntriesTotal(): void {
        this.updateStockEntries();
        this.loadTaxesAndDiscounts(0);
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
    }

    /**
     * Calculates converted total
     *
     * @private
     * @param {SalesEntryClass} entry Entry instance
     * @param {SalesTransactionItemClass} transaction Transaction instance
     * @memberof CreatePurchaseOrderComponent
     */
    private calculateConvertedTotal(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        if (this.excludeTax) {
            transaction.total = giddhRoundOff((transaction.amount - entry.discountSum), 2);
            if (transaction.isStockTxn) {
                transaction.convertedTotal = giddhRoundOff((transaction.quantity * transaction.rate * this.exchangeRate) - entry.discountSum, 2);
            } else {
                transaction.convertedTotal = giddhRoundOff(transaction.total * this.exchangeRate, 2);
            }
        } else {
            transaction.total = giddhRoundOff((transaction.amount - entry.discountSum) + (entry.taxSum + entry.cessSum), 2);
            if (transaction.isStockTxn) {
                transaction.convertedTotal = giddhRoundOff(((transaction.quantity * transaction.rate * this.exchangeRate) - entry.discountSum) + (entry.taxSum + entry.cessSum), 2);
            } else {
                transaction.convertedTotal = giddhRoundOff(transaction.total * this.exchangeRate, 2);
            }
        }
    }

    /**
     * Checks for auto fill shipping address for account and company shipping address
     *
     * @private
     * @param {string} sectionName Section name: company/account
     * @memberof CreatePurchaseOrderComponent
     */
    private checkForAutoFillShippingAddress(sectionName: string): void {
        if (sectionName === 'account') {
            if (this.purchaseOrder?.account?.billingDetails?.address[0] === this.purchaseOrder?.account?.shippingDetails?.address[0] &&
                this.purchaseOrder?.account?.billingDetails?.stateCode === this.purchaseOrder?.account?.shippingDetails?.stateCode &&
                this.purchaseOrder?.account?.billingDetails?.gstNumber === this.purchaseOrder?.account?.shippingDetails?.gstNumber &&
                this.purchaseOrder?.account?.billingDetails?.pincode === this.purchaseOrder?.account?.shippingDetails?.pincode) {
                this.autoFillVendorShipping = true;
            } else {
                this.autoFillVendorShipping = false;
            }
        } else if (sectionName === 'company') {
            if (this.purchaseOrder?.company?.billingDetails?.address[0] === this.purchaseOrder?.company?.shippingDetails?.address[0] &&
                this.purchaseOrder?.company?.billingDetails?.stateCode === this.purchaseOrder?.company?.shippingDetails?.stateCode &&
                this.purchaseOrder?.company?.billingDetails?.gstNumber === this.purchaseOrder?.company?.shippingDetails?.gstNumber &&
                this.purchaseOrder?.company?.billingDetails?.pincode === this.purchaseOrder?.company?.shippingDetails?.pincode) {
                this.autoFillCompanyShipping = true;
            } else {
                this.autoFillCompanyShipping = false;
            }
        }
    }

    /**
     * Get list of discounts
     *
     * @private
     * @memberof CreatePurchaseOrderComponent
     */
     private getDiscounts(): void {
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountsList = response?.body;
            }
        });
    }
}
