import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SubVoucher, RATE_FIELD_PRECISION, SearchResultText, RESTRICTED_VOUCHERS_FOR_DOWNLOAD, AdjustedVoucherType, API_BULK_FETCH_LIMIT, BranchHierarchyType, ASIDE_PANE_CONFIG, IOption, BREAKPOINT_SCREEN_SIZE, Configuration } from 'apps/web-giddh/src/app/app.constant';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { saveAs } from 'file-saver';
import * as dayjs from 'dayjs';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, map, take, takeUntil, filter as rxjsFilter, tap } from 'rxjs/operators';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { ConfirmationModalConfiguration } from '../../../theme/confirmation-modal/confirmation-modal.interface';
import { LoaderService } from '../../../loader/loader.service';
import { cloneDeep, filter as lodashFilter, last, map as lodashMap, orderBy, union, uniqBy } from '../../../lodash-optimized';
import { AccountResponse } from '../../../models/api-models/Account';
import { AdjustAdvancePaymentModal, VoucherAdjustments } from '../../../models/api-models/AdvanceReceiptsAdjust';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';
import { DownloadLedgerRequest, IVariant, LedgerResponse } from '../../../models/api-models/Ledger';
import { IForceClear, SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal, VoucherTypeEnum } from '../../../models/api-models/Sales';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { ILedgerTransactionItem, ITransactionItem } from '../../../models/interfaces/ledger.interface';
import { AccountService } from '../../../services/account.service';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { AVAILABLE_ITC_LIST } from '../../ledger.vm';
import { UpdateLedgerDiscountComponent } from '../update-ledger-discount/update-ledger-discount.component';
import { UpdateLedgerVm } from './update-ledger.vm';
import { SearchService } from '../../../services/search.service';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { OrganizationType } from '../../../models/user-login-state';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../theme/new-confirm-modal/confirm-modal.component';
import { SettingsTagService } from '../../../services/settings.tag.service';
import { MatAccordion } from '@angular/material/expansion';
import { CommonService } from '../../../services/common.service';
import { AdjustmentUtilityService } from '../../../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { LedgerUtilityService } from '../../services/ledger-utility.service';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CreateDiscountComponent } from '../../../theme/create-discount/create-discount.component';
import { SettingsTaxesActions } from '../../../actions/settings/taxes/settings.taxes.action';
import { CompanyActions } from '../../../actions/company.actions';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectFieldComponent } from 'apps/web-giddh/src/app/theme/form-fields/select-field/select-field.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { ServiceConfig } from '../../../services/service.config';
import { SettingsDiscountService } from '../../../services/settings.discount.service';
import { SalesPersonComponentStore } from '../../../shared/sales-person/utility/sales-person.store';
import { SalesPersonComponent } from '../../../shared/sales-person/sales-person.component';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

/** Info message to be displayed during adjustment if the voucher is not generated */
const ADJUSTMENT_INFO_MESSAGE = 'Voucher should be generated in order to make adjustments';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'update-ledger-entry-panel',
    templateUrl: './update-ledger-entry-panel.component.html',
    styleUrls: ['./update-ledger-entry-panel.component.scss'],
    providers: [SalesPersonComponentStore],
    standalone:false
})
/**
 * UpdateLedgerEntryPanelComponent component
 * Handles updateledgerentrypanel functionality and user interactions
 */
export class UpdateLedgerEntryPanelComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    /** Instance of mat accordion */
    @ViewChild(MatAccordion) public accordion: MatAccordion;
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    public vm: UpdateLedgerVm;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Emits when update ledger modal is closed */
    @Output() public closeUpdateLedgerModal: EventEmitter<any> = new EventEmitter();
    @Output() public showQuickAccountModalFromUpdateLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public toggleOtherTaxesAsideMenu: EventEmitter<UpdateLedgerVm> = new EventEmitter();
    /** Emits when more detail is opened */
    @Output() public moreDetailOpen: EventEmitter<any> = new EventEmitter();
    @Input() public isPettyCash: boolean = false;
    @Input() public pettyCashEntry: any;
    @Input() public pettyCashBaseAccountTypeString: string;
    @Input() public pettyCashBaseAccountUniqueName: string;
    /** Stores the active company details */
    @Input() public activeCompany: any;
    @Input() public searchResultsPaginationPage: any;
    @Input() public searchResultsPaginationTotalPages: any;
    @Input() public generateEInvoice: boolean = null;
    /** Holds side of entry (dr/cr) */
    @Input() public entrySide: string;
    /** Holds transaction data*/
    @Input() public entryTransactionData: any;
    /** Holds carousel previous event*/
    @Input() public carouselPrevious: boolean;
    /** Holds carousel next event*/
    @Input() public carouselNext: boolean;
    /** Holds true if this component form daybook */
    @Input() public isDaybook: boolean = false;
    /** fileinput element ref for clear value after remove attachment **/
    @ViewChild('fileInputUpdate', { static: false }) public fileInputElement: ElementRef;
    @ViewChild('discount', { static: false }) public discountComponent: UpdateLedgerDiscountComponent;
    @ViewChild('tax', { static: false }) public taxControll: TaxControlComponent;
    /** Element ref for mat menu **/
    @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
    /** Element ref for mat autocomplete **/
    @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    /** Element ref for mat select **/
    @ViewChild(MatSelect) matSelect: MatSelect;
    /** Adjustment modal */
    @ViewChild('adjustPaymentModal', { static: true }) public adjustPaymentModal: TemplateRef<any>;
    /** Warehouse data for warehouse drop down */
    public warehouses: Array<any>;
    /** Currently selected warehouse */
    public selectedWarehouse: string;
    /** Currently selected warehouse name */
    public selectedWarehouseName: string;
    /** Default warehouse of a company */
    private defaultWarehouse: string;
    /** True, if stock item is present in any transaction */
    public isStockPresent: boolean;
    /** True, if subvoucher is RCM */
    public isRcmEntry: boolean = false;
    /** RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    /** True, if RCM should be displayed */
    public shouldShowRcmEntry: boolean;
    /** True, if advance receipt is enabled */
    public isAdvanceReceipt: boolean = false;
    /** True, if advance receipt checkbox is checked, will show the mandatory fields for Advance Receipt */
    public shouldShowAdvanceReceiptMandatoryFields: boolean = false;
    /** List of available ITC */
    public availableItcList: Array<any> = AVAILABLE_ITC_LIST;
    /** True, if RCM taxable amount needs to be displayed in create new ledger component as per criteria */
    public shouldShowRcmTaxableAmount: boolean = false;
    /** True, if ITC section needs to be displayed in create new ledger component as per criteria  */
    public shouldShowItcSection: boolean = false;
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    public tags: TagRequest[] = [];
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public isFileUploading: boolean = false;
    public accountUniqueName: string;
    public entryUniqueName$: Observable<string>;
    public editAccUniqueName$: Observable<string>;
    public entryUniqueName: string;
    public isDeleteTrxEntrySuccess$: Observable<boolean>;
    public isTxnUpdateInProcess$: Observable<boolean>;
    public isTxnUpdateSuccess$: Observable<boolean>;
    public selectedLedgerStream$: Observable<LedgerResponse>;
    public companyProfile$: Observable<any>;
    public activeAccount$: Observable<AccountResponse>;
    public activeAccount: AccountResponse;
    /** Emits the active ledger account data */
    public activeAccountSubject: Subject<any> = new Subject();
    /** Observable for total amount changes */
    public totalAmountChanged$: Subject<any> = new Subject();
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public baseCurrency: string = null;
    public isChangeAcc: boolean = false;
    public firstBaseAccountSelected: string;
    public existingTaxTxn: any[] = [];
    public baseAccount$: Observable<any> = observableOf(null);
    /** Stores the base account details */
    public baseAccountDetails: any;
    public baseAcc: string;
    public baseAccountChanged: boolean = false;
    public changedAccountUniq: any = null;
    public invoiceList: any[] = [];
    public openDropDown: boolean = false;
    public totalAmount: any;
    /** Hold base account name */
    public baseAccountName: string = '';
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public profileObj: any;
    public keydownClassAdded: boolean = false;
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public multiCurrencyAccDetails: any = null;
    /** Amount of invoice select for credit note */
    public selectedInvoiceAmount: number = 0;
    /** Selected invoice for credit note */
    public selectedInvoice: any = null;
    public accountPettyCashStream: any;
    /**To check tourist scheme applicable or not */
    public isTouristSchemeApplicable: boolean = false;
    public allowParentGroup = ['sales', 'cash', 'sundrydebtors', 'bankaccounts'];
    /** To check advance receipts adjusted invoice is there for trasaction */
    public isAdjustedInvoicesWithAdvanceReceipt: boolean = false;
    /** To check advance receipts adjustment is there for trasaction */
    public isAdjustedWithAdvanceReceipt: boolean = false;
    /** To check is advance receipt adjustment invoice list need to show  */
    public selectedAdvanceReceiptAdjustInvoiceEditMode: boolean = false;
    /** To check advance receipt/invoice amount is exceed by compound total */
    public isAdjustedAmountExcess: boolean = false;
    /** To check advance receipt/invoice amount is exceed by compound total */
    public adjustedExcessAmount: number = 0;
    /** To check advance receipt/invoice amount is exceed by compound total */
    public totalAdjustedAmount: number = 0;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** Rate should have precision up to 4 digits for better calculation */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Clear selected invoice */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** True when user checks the adjust advance receipt */
    public isAdjustAdvanceReceiptSelected: boolean;
    /** True when user checks the adjust receipt checkbox */
    public isAdjustReceiptSelected: boolean;
    /** True when user checks any voucher for adjustment (sales, purchase, payment, receipt & advance-receipt) checkbox */
    public isAdjustVoucherSelected: boolean;
    /** Stores the details for adjustment component */
    public adjustVoucherConfiguration: any;
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Default search suggestion list to be shown for search */
    public defaultSuggestions: Array<IOption> = [];
    /** Stores the search results pagination details */
    public searchResultsPaginationData = {
        page: 0,
        count: API_BULK_FETCH_LIMIT,
        query: ''
    };
    /** Stores the default search results pagination details (required only for passing
     * default search pagination details to Update ledger component) */
    public defaultResultsPaginationData = {
        page: 0,
        count: API_BULK_FETCH_LIMIT,
        query: ''
    };

    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;
    /** True, if all the transactions are of type 'Tax' or 'Reverse Charge' */
    private taxOnlyTransactions: boolean;
    /* This will hold the account unique name which is going to be in edit mode to get compared once updated */
    public entryAccountUniqueName: any = '';
    /** Stores the current organization type */
    public currentOrganizationType: string;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the current branches */
    public branches: Array<any>;
    /** Stores the adjustments as a backup that are present on the current opened entry */
    public originalVoucherAdjustments: VoucherAdjustments;
    public Shown: boolean = true;
    public isHide: boolean = false;
    public condition: boolean = true;
    public condition2: boolean = false;
    /** Stores the multi-lingual label of current voucher */
    public currentVoucherLabel: string;
    public companyTaxesList: TaxResponse[] = [];
    public otherTaxDialogRef: any;
    public adjustmentDialogRef: any;
    public advanceReceiptRemoveDialogRef: any;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** True if user itself checked the generate voucher  */
    public manualGenerateVoucherChecked: boolean = false;
    /** Holds input to get invoice list request params */
    public invoiceListRequestParams: any = {};
    /** Current page for reference vouchers */
    private referenceVouchersCurrentPage: number = 1;
    /** Total pages for reference vouchers */
    private referenceVouchersTotalPages: number = 1;
    /** Reference voucher search field */
    private searchReferenceVoucher: any = "";
    /** Invoice list observable */
    public invoiceList$: Observable<any[]>;
    /** Holds restricted voucher types for download */
    public restrictedVouchersForDownload: any[] = RESTRICTED_VOUCHERS_FOR_DOWNLOAD;
    /** True if einvoice is generated for the voucher */
    public isEinvoiceGenerated: boolean = false;
    /** Stores the stock variants */
    public stockVariants: BehaviorSubject<Array<IOption>> = new BehaviorSubject([]);
    /** Stores the selected stock variant */
    public selectedStockVariant: IVariant = { name: '', uniqueName: '' };
    /** Stores the stock uniquename */
    private selectedStockUniquenName: string;
    /** True if ledger account belongs to sundry debtor/creditor */
    private isSundryDebtorCreditor: boolean = false;
    /** account other applicable discount list which contains account's discount else immediate group's discount(inherited) */
    public accountOtherApplicableDiscount: any[] = [];
    /** False if there is no data in account search */
    public isAccountSearchData: boolean = true;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Boolean for tab screen or not  */
    public isTabScreen: boolean = false;
    /** Discount dialog ref */
    public discountDialogRef: MatDialogRef<any>;
    /** List of discounts */
    public discountsList: any[] = [];
    /** Template Reference for Create Tax aside menu */
    @ViewChild("createTax") public createTax: TemplateRef<any>;
    /** Create tax dialog ref  */
    public taxAsideMenuRef: MatDialogRef<any>;
    /** Hold ledger transactions */
    public transaction: ITransactionItem;
    /** Hold ledger transactions index */
    public index: number;
    /** Hold ledger transactions type cr/dr list */
    public transactionsList: ITransactionItem[];
    /** True if show no data found */
    public isShowNoDataFound: boolean = false;
    /** Holds images folder path */
    public imgPath: string = "";
    /** True if datepicker is open */
    public isDatepickerOpen: boolean = false;
    /** Hold last valid index */
    public lastValidIndex: number;
    /** Sales Person List */
    public salesPersonList$: Observable<any> = this.salesPersonStore.salesPersonList$;
    /** Holds transaction details */
    private transactionDetails: LedgerResponse;
    /** Selected entry details */
    public selectedItem: any;
    /** True if adjustment info is open */
    public isAdjustmentInfoOpen: boolean = false;
    /** True if last adjustment info is open */
    public isLastAdjustmentInfoOpen: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private accountService: AccountService,
        private breakPointObservar: BreakpointObserver,
        private settingsTaxesAction: SettingsTaxesActions,
        private companyActions: CompanyActions,
        private ledgerService: LedgerService,
        private generalService: GeneralService,
        private ledgerAction: LedgerActions,
        private loaderService: LoaderService,
        private settingsTagService: SettingsTagService,
        private settingsBranchAction: SettingsBranchActions,
        private settingsUtilityService: SettingsUtilityService,
        private store: Store<AppState>,
        private searchService: SearchService,
        private toaster: ToasterService,
        private warehouseActions: WarehouseActions,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private commonService: CommonService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private ledgerUtilityService: LedgerUtilityService,
        private invoiceAction: InvoiceActions,
        private renderer: Renderer2,
        @Inject(ServiceConfig) private serviceConfig,
        private settingsDiscountService: SettingsDiscountService,
        private salesPersonStore: SalesPersonComponentStore
    ) {
        this.breakPointObservar.observe([
            BREAKPOINT_SCREEN_SIZE.TABLET
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isTabScreen = result?.breakpoints[BREAKPOINT_SCREEN_SIZE.TABLET];
        });
        this.vm = new UpdateLedgerVm(this.generalService, this.ledgerUtilityService);

        this.entryUniqueName$ = this.store.pipe(select(p => p.ledger.selectedTxnForEditUniqueName), takeUntil(this.destroyed$));
        this.editAccUniqueName$ = this.store.pipe(select(p => p.ledger.selectedAccForEditUniqueName), takeUntil(this.destroyed$));
        this.selectedLedgerStream$ = this.store.pipe(select(p => p.ledger.transactionDetails), takeUntil(this.destroyed$));
        this.companyProfile$ = this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$));
        this.vm.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.isDeleteTrxEntrySuccess$ = this.store.pipe(select(p => p.ledger.isDeleteTrxEntrySuccessfull), takeUntil(this.destroyed$));
        this.isTxnUpdateInProcess$ = this.store.pipe(select(p => p.ledger.isTxnUpdateInProcess), takeUntil(this.destroyed$));
        this.isTxnUpdateSuccess$ = this.store.pipe(select(p => p.ledger.isTxnUpdateSuccess), takeUntil(this.destroyed$));
        this.closeUpdateLedgerModal.pipe(takeUntil(this.destroyed$));
        this.vm.currencyList$ = this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            document.querySelector('body').classList.add('ledger-body');
        }
        /**
         * Handles if functionality
         */
        if (this.searchResultsPaginationPage) {
            this.searchResultsPaginationData.page = this.searchResultsPaginationPage;
        }

        this.getAllDiscounts();
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            this.allowParentGroup.push("loanandoverdraft");
        }

        this.store.dispatch(this.invoiceAction.getInvoiceSetting());
        this.getPurchaseSettings();
        this.getSalesPersonList();

        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.status === "success" && response?.body?.length > 0) {
                /**
                 * Handles lodashMap functionality
                 */
                lodashMap(response?.body, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                this.tags = orderBy(response?.body, 'name');
            }
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.branches = response;
            } else {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
            }
        });
        this.store.pipe(select(appState => appState.ledger.refreshLedger), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response === true) {
                this.store.dispatch(this.ledgerAction.refreshLedger(false));
                this.entryAccountUniqueName = "";
                this.closeUpdateLedgerModal.emit();
            }
        });

        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            /**
             * Handles if functionality
             */
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });
        this.vm.selectedLedger = new LedgerResponse();
        this.vm.selectedLedger.voucher = { name: '', shortCode: '' };
        this.vm.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();

        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            /**
             * Handles if functionality
             */
            if (this.pettyCashEntry) {
                this.entryUniqueName = this.pettyCashEntry.uniqueName;
                this.accountUniqueName = this.pettyCashEntry.particular?.uniqueName;
                this.selectedLedgerStream$ = observableOf(this.pettyCashEntry as LedgerResponse);
            }
        }
        this.vm.companyTaxesList$.pipe(take(1)).subscribe(taxes => {
            /**
             * Handles if functionality
             */
            if (taxes) {
                (Array.isArray(taxes) ? taxes : []).forEach((tax) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                        this.allowedSelectionOfAType.type.push(tax.taxType);
                    }
                });
            } else {
                this.allowedSelectionOfAType.type = [];
            }
        });

        // get entry name and ledger account uniqueName
        /**
         * Handles observableCombineLatest functionality
         */
        observableCombineLatest([this.entryUniqueName$, this.editAccUniqueName$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            /**
             * Handles if functionality
             */
            if (resp[0] && resp[1]) {
                this.entryUniqueName = resp[0];
                this.accountUniqueName = resp[1];
                this.store.dispatch(this.ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
            }
        });

        /**
         * Handles observableCombineLatest functionality
         */
        observableCombineLatest([this.activeAccountSubject]).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            /**
             * Handles if functionality
             */
            if (response[0]) {
                // set account details for multi currency account
                this.prepareMultiCurrencyObject(this.vm.selectedLedger);
            }
        });

        this.totalAmountChanged$.pipe(debounceTime(500), takeUntil(this.destroyed$)).subscribe((response) => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.vm.inventoryTotalChanged();
            }
        });

        // check if delete entry is success
        this.isDeleteTrxEntrySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(del => {
            /**
             * Handles if functionality
             */
            if (del) {
                this.store.dispatch(this.ledgerAction.resetDeleteTrxEntryModal());
                this.closeUpdateLedgerModal.emit(true);
                this.baseAccountChanged = false;
            }
        });

        // check if update entry is success
        this.isTxnUpdateSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(upd => {
            /**
             * Handles if functionality
             */
            if (upd) {
                this.store.dispatch(this.ledgerAction.ResetUpdateLedger());
                this.resetPreviousSearchResults();
                this.baseAccountChanged = false;
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.store.dispatch(this.ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
                }, 50);
            }
        });
        /**
         * Handles if functionality
         */
        if (this.vm) {
            this.vm.compundTotalObserver.pipe(takeUntil(this.destroyed$))
                .subscribe(res => {
                    /**
                     * Handles if functionality
                     */
                    if (res || res === 0) {
                        this.checkAdvanceReceiptOrInvoiceAdjusted();
                    }
                });
        }
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body')?.classList?.add('update-ledger-entry-panel-popup');
        this.assignStockVariantDetails();
    }

    /**
     * Toggles show state
     */
    public toggleShow(): void {
        this.condition = !this.condition;
        this.condition2 = !this.condition;
        this.Shown = !this.Shown;
        this.isHide = !this.isHide;
    }

    /** Track by function for items */
    /**
     * Handles trackByFunction functionality
     */
    public trackByFunction(index: number, item: ILedgerTransactionItem): any {
        return item?.particular?.uniqueName;
    }

    /**
     * Handles prepareMultiCurrencyObject functionality
     */
    private prepareMultiCurrencyObject(accountDetails: any) {
        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            // In case of petty cash account unique name will be received
            this.multiCurrencyAccDetails = {
                currency: String(accountDetails?.currency || '')
            };
        } else {
            // In other cases account will be received
            this.multiCurrencyAccDetails = {
                currency: String(accountDetails?.particular?.currency?.code || '')
            };
        };

        this.vm.isMultiCurrencyAvailable = this.multiCurrencyAccDetails ?
            !!(this.multiCurrencyAccDetails?.currency && this.multiCurrencyAccDetails.currency !== this.profileObj?.baseCurrency)
            : false;

        this.vm.foreignCurrencyDetails = { code: this.profileObj?.baseCurrency, symbol: this.profileObj.baseCurrencySymbol };

        /**
         * Handles if functionality
         */
        if (this.vm.isMultiCurrencyAvailable) {
            let currencies: ICurrencyResponse[] = [];
            let multiCurrencyAccCurrency: ICurrencyResponse;

            this.vm.currencyList$.pipe(take(1)).subscribe(res => currencies = res);
            multiCurrencyAccCurrency = currencies.find(f => f?.code === this.multiCurrencyAccDetails?.currency);
            this.vm.baseCurrencyDetails = { code: multiCurrencyAccCurrency?.code, symbol: multiCurrencyAccCurrency?.symbol };
        } else {
            this.vm.baseCurrencyDetails = this.vm.foreignCurrencyDetails;
        }
        this.vm.selectedCurrency = 0;
        this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrency;
        this.assignPrefixAndSuffixForCurrency();
    }

    /**
     * Lifecycle hook that is called after a component's view has been fully initialized.
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public ngAfterViewInit(): void {
        this.vm.discountComponent = this.discountComponent;
        this.transaction = this.entryTransactionData?.transaction;
        this.index = this.entryTransactionData?.index;
        this.transactionsList = this.entryTransactionData?.transactionsList;
        /**
         * Handles if functionality
         */
        if (this.transaction?.entryUniqueName) {
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.hideTax();
                this.hideDiscount();
            }, 3000);
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if (changes['isPettyCash']) {
            this.isPettyCash = changes['isPettyCash'].currentValue;
        }

        /**
         * Handles if functionality
         */
        if (changes['carouselNext'] && changes['carouselNext'].currentValue) {
            this.moveToNextTransactions();
        }

        /**
         * Handles if functionality
         */
        if (changes['carouselPrevious'] && changes['carouselPrevious'].currentValue) {
            this.moveToPreviousTransactions();
        }
        /**
         * Handles if functionality
         */
        if (changes['pettyCashEntry'] && changes['pettyCashEntry'].currentValue !== changes['pettyCashEntry'].previousValue) {
            this.accountPettyCashStream = changes['pettyCashEntry'].currentValue.body;
        }

        // skip pettyCashBaseAccountUniqueName changes if its first time
        // because we have already done this in get transaction response observable
        // so no need to do this
        // we will just check for account change in petty cash entry details screen
        /**
         * Handles if functionality
         */
        if (changes['pettyCashBaseAccountUniqueName']
            && !changes['pettyCashBaseAccountUniqueName'].firstChange
            && changes['pettyCashBaseAccountUniqueName'].currentValue
            !== changes['pettyCashBaseAccountUniqueName'].previousValue) {
            /**
             * Handles if functionality
             */
            if (this.isPettyCash) {
                this.accountUniqueName = changes['pettyCashBaseAccountUniqueName'].currentValue;

                /**
                 * Handles if functionality
                 */
                if (this.accountUniqueName) {
                    this.pettyCashAccountChanged();
                }
            }
        }

        /**
         * Handles if functionality
         */
        if (changes['generateEInvoice'] && this.vm?.selectedLedger) {
            this.vm.selectedLedger.generateEInvoice = changes['generateEInvoice']?.currentValue;
            this.saveLedgerTransaction();
        }
    }

    /**
     * Handles addBlankTrx functionality
     */
    public addBlankTrx(type: string = 'DEBIT', txn: ILedgerTransactionItem, event: Event) {
        /**
         * Handles if functionality
         */
        if (this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1)) {
            /**
             * Handles if functionality
             */
            if (Number(txn.amount) === 0) {
                txn.amount = undefined;
            }
            let lastTxn = last(lodashFilter(this.vm.selectedLedger.transactions, p => p.type === type));
            /**
             * Handles if functionality
             */
            if (txn?.particular?.uniqueName && lastTxn?.particular?.uniqueName) {
                let blankTrxnRow = this.vm.blankTransactionItem(type);
                this.vm.selectedLedger.transactions.push(blankTrxnRow);
            }
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * Uploads attachment
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public uploadFile(): void {
        const selectedFile: any = document.getElementById("invoiceFile");
        /**
         * Handles if functionality
         */
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob, file) => {
                this.isFileUploading = true;
                this.loaderService.show();

                this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.loaderService.hide();
                    this.isFileUploading = false;
                    /**
                     * Handles if functionality
                     */
                    if (response?.status === 'success') {
                        this.vm.selectedLedger.attachedFile = response.body?.uniqueName;
                        this.vm.selectedLedger.attachedFileName = response.body?.name;
                        this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.vm.selectedLedger.attachedFile = '';
                        this.vm.selectedLedger.attachedFileName = '';
                        this.toaster.showSnackBar("error", response.message);
                    }
                    this.changeDetectorRef.detectChanges();
                });
            });
        }
    }

    /**
     * Handles selectAccount functionality
     */
    public selectAccount(e: IOption, txn: ILedgerTransactionItem, selectCmp?: SelectFieldComponent, clearAccount?: boolean, isVariantChanged?: boolean) {
        /**
         * Handles if functionality
         */
        if (!e.value || clearAccount) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            txn.inventory = null;
            txn.particular.name = undefined;
            txn.amount = txn.amount ?? 0;
            txn.particular.parentGroups = undefined;
            txn.particular.category = undefined;

            // check if need to showEntryPanel
            // first check with opened ledger
            /**
             * Handles if functionality
             */
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                this.vm.showNewEntryPanel = true;
            } else {
                // now check if we transactions array have any income/expense/fixed assets entry
                let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }
            return;
        } else {
            /**
             * Handles if functionality
             */
            if (!txn.isUpdated) {
                /**
                 * Handles if functionality
                 */
                if (this.vm.selectedLedger.taxes && this.vm.selectedLedger.taxes.length && !txn.isTax) {
                    txn.isUpdated = true;
                }
            }
            // check if txn.selectedAccount is already set so it means account name is changed without firing deselect event
            /**
             * Handles if functionality
             */
            if (txn?.selectedAccount) {
                // check if discount is added and update component as needed
                this.vm.discountArray.map(d => {
                    /**
                     * Handles if functionality
                     */
                    if (d.particular === txn.selectedAccount?.uniqueName) {
                        d.amount = 0;
                    }
                });
            }
            /**
             * Handles if functionality
             */
            if (e.label) {
                txn.particular.name = e.label;
                txn.particular.uniqueName = e.value;
            }
            // if there's stock entry
            /**
             * Handles if functionality
             */
            if (e.additional?.stock) {
                // check if we already have stock entry
                /**
                 * Handles if functionality
                 */
                if (this.vm.isThereStockEntry(e?.value)) {
                    txn.particular.uniqueName = null;
                    txn.particular.name = null;
                    txn.selectedAccount = null;
                    this.toaster.showSnackBar("warning", this.localeData?.multiple_stock_entry_error);
                    return;
                } else {
                    // add unitArrays in txn for stock entry
                    let requestObject;
                    /**
                     * Handles if functionality
                     */
                    if (e.additional.stock) {
                        requestObject = {
                            stockUniqueName: e.additional.stock?.uniqueName,
                            customerUniqueName: this.isSundryDebtorCreditor ? this.activeAccount?.uniqueName : this.baseAccountDetails.particular.uniqueName,
                            ...(isVariantChanged ? { variantUniqueName: this.selectedStockVariant?.uniqueName } : {})
                        };
                    }
                    this.assignStockDetails(e, txn, requestObject);
                }
            } else {
                this.searchService.loadDetails(e?.value).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    // directly assign additional property
                    /**
                     * Handles if functionality
                     */
                    if (data && data.body) {
                        // Take taxes of parent group
                        const taxes = this.generalService.fetchTaxesOnPriority(
                            data.body.stock?.taxes ?? [],
                            data.body.stock?.groupTaxes ?? [],
                            data.body.taxes ?? [],
                            data.body.groupTaxes ?? []);

                        txn.selectedAccount = {
                            ...e.additional,
                            label: e.label,
                            value: e?.value,
                            isHilighted: true,
                            applicableTaxes: taxes,
                            currency: data.body.currency,
                            currencySymbol: data.body.currencySymbol,
                            email: data.body.emails,
                            isFixed: data.body.isFixed,
                            mergedAccounts: data.body.mergedAccounts,
                            mobileNo: data.body.mobileNo,
                            nameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.name).join(', ') : '',
                            stocks: [],
                            uNameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.uniqueName).join(', ') : ''
                        };
                        delete txn.inventory;
                        // Non stock item got selected, search if there is any stock item along with non-stock item
                        // If none of the item were stock item, hide the warehouse & variant dropdown which is applicable only for stocks
                        this.isStockPresent = this.isStockItemPresent();

                        // check if need to showEntryPanel
                        // first check with opened lager
                        /**
                         * Handles if functionality
                         */
                        if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                            this.vm.showNewEntryPanel = true;
                        } else {
                            // now check if we transactions array have any income/expense/fixed assets entry
                            let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                            this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
                        }
                        this.vm.onTxnAmountChange(txn);
                    }
                });
            }
        }
    }

    /**
     * Handles txnamountchange event
     */
    public onTxnAmountChange(txn: ILedgerTransactionItem) {
        /**
         * Handles if functionality
         */
        if (txn) {
            txn.convertedAmount = this.vm.calculateConversionRate(txn.amount);
            txn.isUpdated = true;
            this.vm.onTxnAmountChange(txn);
        }
    }

    /**
     * Shows deleteattachedfilemodal element
     */
    public showDeleteAttachedFileModal() {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '630px',
                    data: {
                title: this.commonLocaleData?.app_delete,
                    body: this.localeData?.confirm_delete_file,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.deleteAttachedFile();
            }
        });
    }

    /**
     * Shows deleteentrymodal element
     */
    public showDeleteEntryModal() {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '630px',
                    data: {
                title: this.commonLocaleData?.app_delete,
                    body: this.localeData?.confirm_delete_entry,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no,
                    permanentlyDeleteMessage: this.localeData?.delete_entries_content
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.deleteTrxEntry();
            }
        });
    }

    /**
     * Deletes trxentry
     */
    public deleteTrxEntry() {
        let uniqueName = (this.vm.selectedLedger && this.vm.selectedLedger.particular) ? this.vm.selectedLedger.particular.uniqueName : undefined;
        /**
         * Handles if functionality
         */
        if (uniqueName) {
            this.store.dispatch(this.ledgerAction.deleteTrxEntry(uniqueName, this.entryUniqueName));
        }
    }

    /**
     * Deletes attachedfile
     */
    public deleteAttachedFile() {
        this.ledgerService.removeAttachment(this.vm.selectedLedger?.attachedFile).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            /**
             * Handles if functionality
             */
            if (response?.status === 'success') {
                this.vm.selectedLedger.attachedFile = '';
                this.vm.selectedLedger.attachedFileName = '';
                /**
                 * Handles if functionality
                 */
                if (this.fileInputElement && this.fileInputElement.nativeElement) {
                    this.fileInputElement.nativeElement.value = '';
                }
                this.toaster.showSnackBar("success", this.localeData?.remove_file);
            } else {
                this.toaster.showSnackBar("error", response?.message)
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     *This will select warehouse
     *
     * @param {*} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public selectWarehouse(event: any): void {
        this.selectedWarehouse = event?.value;
        this.selectedWarehouseName = event?.label;
    }

    /**
     * Saves ledgertransaction data
     */
    public saveLedgerTransaction() {
        /**
         * Handles if functionality
         */
        if (!this.validateDates()) {
            return;
        }

        /**
         * Handles if functionality
         */
        if (!this.validateStockVariant()) {
            return;
        }

        const requestObj = this.prepareRequestObject();
        /**
         * Handles if functionality
         */
        if (!requestObj) {
            return;
        }

        /**
         * Handles if functionality
         */
        if (!this.validatePettyCashTransactions(requestObj)) {
            return;
        }

        /**
         * Handles if functionality
         */
        if (!this.validateRcmTaxes(requestObj)) {
            return;
        }

        this.configureRequestObject(requestObj);
        this.filterTransactions(requestObj);
        this.updateInventoryDetails(requestObj);
        this.cleanupRequestObject(requestObj);
        this.handleVoucherAdjustments(requestObj);
        this.finalizeRequestObject(requestObj);

        return this.executeTransaction(requestObj);
    }

    /**
     * Validate entry and cheque clearance dates
     */
    private validateDates(): boolean {
        /**
         * Handles if functionality
         */
        if (!this.validateEntryDate()) {
            return false;
        }
        return this.validateChequeClearanceDate();
    }

    /**
     * Validate entry date format and value
     */
    private validateEntryDate(): boolean {
        /**
         * Handles if functionality
         */
        if (!this.vm.selectedLedger.entryDate) {
            return true;
        }

        const entryDate = this.parseDateValue(this.vm.selectedLedger.entryDate);
        /**
         * Handles if functionality
         */
        if (!entryDate.isValid()) {
            this.toaster.showSnackBar("error", this.localeData?.invalid_date);
            this.loaderService.hide();
            return false;
        }

        this.vm.selectedLedger.entryDate = this.formatDateValue(this.vm.selectedLedger.entryDate);
        return true;
    }

    /**
     * Validate cheque clearance date format and value
     */
    private validateChequeClearanceDate(): boolean {
        /**
         * Handles if functionality
         */
        if (!this.vm.selectedLedger.chequeClearanceDate) {
            return true;
        }

        const chequeClearanceDate = this.parseDateValue(this.vm.selectedLedger.chequeClearanceDate);
        /**
         * Handles if functionality
         */
        if (!chequeClearanceDate.isValid()) {
            this.toaster.showSnackBar("error", this.localeData?.invalid_cheque_clearance_date);
            this.loaderService.hide();
            return false;
        }

        this.vm.selectedLedger.chequeClearanceDate = this.formatDateValue(this.vm.selectedLedger.chequeClearanceDate);
        return true;
    }

    /**
     * Parse date value from object or string format
     */
    private parseDateValue(dateValue: any): any {
        /**
         * Handles return functionality
         */
        return (typeof dateValue === "object") ?
            /**
             * Handles dayjs functionality
             */
            dayjs(dateValue) :
            /**
             * Handles dayjs functionality
             */
            dayjs(dateValue, GIDDH_DATE_FORMAT);
    }

    /**
     * Format date value to standard format
     */
    private formatDateValue(dateValue: any): string {
        /**
         * Handles return functionality
         */
        return (typeof dateValue === "object") ?
            /**
             * Handles dayjs functionality
             */
            dayjs(dateValue).format(GIDDH_DATE_FORMAT) :
            /**
             * Handles dayjs functionality
             */
            dayjs(dateValue, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
    }

    /**
     * Validate stock variant selection
     */
    private validateStockVariant(): boolean {
        /**
         * Handles if functionality
         */
        if (this.vm.stockTrxEntry?.inventory && !this.selectedStockVariant.uniqueName) {
            return false;
        }
        return true;
    }

    /**
     * Prepare the request object for submission
     */
    private prepareRequestObject(): LedgerResponse | null {
        return this.vm.prepare4Submit();
    }

    /**
     * Validate petty cash transactions
     */
    private validatePettyCashTransactions(requestObj: LedgerResponse): boolean {
        /**
         * Handles if functionality
         */
        if (!this.isPettyCash) {
            return true;
        }

        const isThereOthersDummyAcc = this.vm.otherAccountList.some(d =>
            d?.uniqueName === 'others' && d?.isDummy
        );

        /**
         * Handles if functionality
         */
        if (isThereOthersDummyAcc) {
            const isThereDummyOtherTrx = requestObj.transactions.some(s =>
                s.particular?.uniqueName === 'others'
            );

            /**
             * Handles if functionality
             */
            if (isThereDummyOtherTrx) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_account_transaction_error);
                return false;
            }
        }
        return true;
    }

    /**
     * Validate RCM taxes requirement
     */
    private validateRcmTaxes(requestObj: LedgerResponse): boolean {
        /**
         * Handles if functionality
         */
        if (this.isRcmEntry && (!requestObj.taxes || requestObj.taxes?.length === 0)) {
            /**
             * Handles if functionality
             */
            if (this.taxControll?.taxInputElement?.nativeElement) {
                this.taxControll.taxInputElement.nativeElement?.classList?.add('error-box');
                return false;
            }
        }
        return true;
    }

    /**
     * Configure basic request object properties
     */
    private configureRequestObject(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (!requestObj) {
            return;
        }

        requestObj.valuesInAccountCurrency = this.vm.selectedCurrency === 0;
        requestObj.exchangeRate = this.calculateExchangeRate();
        requestObj.subVoucher = this.determineSubVoucher();
        requestObj.transactions = requestObj.transactions?.filter(f => !f.isDiscount);
    }

    /**
     * Calculate exchange rate based on currency selection
     */
    private calculateExchangeRate(): number {
        /**
         * Handles return functionality
         */
        return (this.vm.selectedCurrencyForDisplay !== this.vm.selectedCurrency) ?
            (1 / this.vm.selectedLedger?.exchangeRate) :
            this.vm.selectedLedger?.exchangeRate;
    }

    /**
     * Determine sub voucher type
     */
    private determineSubVoucher(): string {
        /**
         * Handles if functionality
         */
        if (this.isRcmEntry) {
            return SubVoucher.ReverseCharge;
        }
        /**
         * Handles if functionality
         */
        if (this.isAdvanceReceipt) {
            return SubVoucher.AdvanceReceipt;
        }
        return '';
    }

    /**
     * Filter transactions based on voucher type and settings
     */
    private filterTransactions(requestObj: LedgerResponse): void {
        this.filterTaxTransactions(requestObj);
        this.filterRoundoffTransactions(requestObj);
    }

    /**
     * Filter tax transactions if not tax-only mode
     */
    private filterTaxTransactions(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (!this.taxOnlyTransactions && requestObj.voucherType !== "jr") {
            requestObj.transactions = requestObj.transactions?.filter(tx => !tx.isTax);
        }
    }

    /**
     * Filter roundoff transactions for API v2
     */
    private filterRoundoffTransactions(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2 &&
            (requestObj.voucherGenerated || requestObj.generateInvoice) &&
            requestObj.voucherType !== "jr") {
            requestObj.transactions = requestObj.transactions?.filter(tx =>
                tx.particular?.uniqueName !== "roundoff"
            );
        }
    }

    /**
     * Update inventory details in transactions
     */
    private updateInventoryDetails(requestObj: LedgerResponse): void {
        requestObj.transactions.map((transaction: any) => {
            /**
             * Handles if functionality
             */
            if (transaction?.inventory && this.isStockPresent) {
                this.updateTransactionInventory(transaction);
            }
        });
    }

    /**
     * Update individual transaction inventory details
     */
    private updateTransactionInventory(transaction: any): void {
        transaction.inventory.variant = this.selectedStockVariant ?? transaction.inventory.variant;
        transaction.inventory.taxInclusive = this.vm.isInclusiveTax;

        this.updateWarehouseDetails(transaction);
    }

    /**
     * Update warehouse details in transaction inventory
     */
    private updateWarehouseDetails(transaction: any): void {
        /**
         * Handles if functionality
         */
        if (transaction?.inventory.warehouse) {
            transaction.inventory.warehouse.uniqueName = this.selectedWarehouse;
            transaction.inventory.warehouse.name = this.selectedWarehouseName;
        } else {
            transaction.inventory.warehouse = {
                name: this.selectedWarehouseName,
                uniqueName: this.selectedWarehouse
            };
        }
    }

    /**
     * Clean up request object by removing unnecessary properties
     */
    private cleanupRequestObject(requestObj: LedgerResponse): void {
        this.cleanupVoucherAdjustments(requestObj);
        this.removeTaxProperties(requestObj);
        this.handleReferenceVoucher(requestObj);
        this.removeSalesPerson(requestObj);
    }

    /**
     * Clean up voucher adjustments
     */
    private cleanupVoucherAdjustments(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (requestObj?.voucherAdjustments?.adjustments?.length > 0) {
            (Array.isArray(requestObj.voucherAdjustments.adjustments) ?
                requestObj.voucherAdjustments.adjustments : []
            ).forEach((adjustment: any) => {
                delete adjustment.balanceDue;
            });
        }
    }

    /**
     * Remove tax-related properties
     */
    private removeTaxProperties(requestObj: LedgerResponse): void {
        delete requestObj['tdsTaxes'];
        delete requestObj['tcsTaxes'];
    }

    /**
     * Handle reference voucher for specific voucher types
     */
    private handleReferenceVoucher(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (requestObj.voucherType !== VoucherTypeEnum.creditNote &&
            requestObj.voucherType !== VoucherTypeEnum.debitNote) {
            /**
             * Handles if functionality
             */
            if (this.voucherApiVersion === 2) {
                requestObj.referenceVoucher = null;
            }
        }

        /**
         * Handles if functionality
         */
        if (requestObj.referenceVoucher) {
            delete requestObj.referenceVoucher.number;
            delete requestObj.referenceVoucher.date;
            delete requestObj.referenceVoucher.voucherType;
        }
    }

    /**
     * Remove sales person property
     */
    private removeSalesPerson(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (requestObj.salesPerson) {
            delete requestObj.salesPerson;
        }
    }

    /**
     * Handle voucher adjustments based on selection flags
     */
    private handleVoucherAdjustments(requestObj: LedgerResponse): void {
        const shouldClearAdjustments =
            (this.isAdvanceReceipt && !this.isAdjustAdvanceReceiptSelected) ||
            (this.vm.selectedLedger?.voucher?.shortCode === 'rcpt' && !this.isAdjustReceiptSelected) ||
            !this.isAdjustVoucherSelected;

        /**
         * Handles if functionality
         */
        if (shouldClearAdjustments) {
            this.vm.selectedLedger.voucherAdjustments = undefined;
            requestObj.voucherAdjustments = undefined;
        }
    }

    /**
     * Finalize request object with advance receipt and API v2 adjustments
     */
    private finalizeRequestObject(requestObj: LedgerResponse): void {
        this.handleAdvanceReceipt(requestObj);
        this.applyApiV2Adjustments(requestObj);
    }

    /**
     * Handle advance receipt specific configurations
     */
    private handleAdvanceReceipt(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (this.isAdvanceReceipt) {
            requestObj.voucherType = 'rcpt';
            requestObj.transactions[0].amount = this.vm.advanceReceiptAmount;
        }
    }

    /**
     * Apply API v2 specific adjustments
     */
    private applyApiV2Adjustments(requestObj: LedgerResponse): LedgerResponse {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            return this.adjustmentUtilityService.getAdjustmentObject(requestObj);
        }
        return requestObj;
    }

    /**
     * Execute the transaction based on petty cash mode
     */
    private executeTransaction(requestObj: LedgerResponse): LedgerResponse | void {
        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            return requestObj;
        }

        this.configureNetworkHandling(requestObj);
        this.dispatchUpdateAction(requestObj);
    }

    /**
     * Configure network handling and refresh flags
     */
    private configureNetworkHandling(requestObj: LedgerResponse): void {
        requestObj['handleNetworkDisconnection'] = true;
        requestObj['refreshLedger'] = false;

        /**
         * Handles if functionality
         */
        if (this.entryAccountUniqueName && this.entryAccountUniqueName !== this.changedAccountUniq) {
            requestObj['refreshLedger'] = true;
        }
    }

    /**
     * Dispatch the appropriate update action
     */
    private dispatchUpdateAction(requestObj: LedgerResponse): void {
        /**
         * Handles if functionality
         */
        if (this.baseAccountChanged) {
            this.store.dispatch(this.ledgerAction.updateTxnEntry(
                requestObj,
                this.firstBaseAccountSelected,
                this.entryUniqueName + '?newAccountUniqueName=' + this.changedAccountUniq
            ));
        } else {
            this.store.dispatch(this.ledgerAction.updateTxnEntry(
                requestObj,
                this.firstBaseAccountSelected,
                this.entryUniqueName
            ));
        }
    }

    /**
     * Unsubscribe to all the listeners to avoid memory leaks
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public ngOnDestroy(): void {
        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            document.querySelector('body').classList.remove('ledger-body');
        }
        this.vm.resetVM();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.store.dispatch(this.ledgerAction.resetLedgerTrxDetails());
        document.querySelector('body')?.classList?.remove('update-ledger-entry-panel-popup');
    }

    /**
     * Handles downloadAttachedFile functionality
     */
    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this.ledgerService.downloadAttachement(fileName).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            /**
             * Handles if functionality
             */
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body?.uploadedFile, `image/${d.body?.fileType}`, 512);
                return saveAs(blob, d.body?.name);
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }

    /**
     * Handles downloadInvoice functionality
     */
    public downloadInvoice(transaction: any, e: Event) {
        e.stopPropagation();
        let downloadRequest = new DownloadLedgerRequest();
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            downloadRequest.uniqueName = transaction?.voucherUniqueName;
        }
        downloadRequest.voucherType = (transaction?.voucherGeneratedType) ? transaction?.voucherGeneratedType : transaction?.voucher?.name;
        this.ledgerService.DownloadInvoice(downloadRequest, this.activeAccount?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            /**
             * Handles if functionality
             */
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${this.activeAccount.name} - ${transaction?.voucherNumber}.pdf`);
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }

    /**
     * Shows quickaccountmodal element
     */
    public showQuickAccountModal() {
        this.showQuickAccountModalFromUpdateLedger.emit(true);
    }

    /**
     * Handles changeBaseAccount functionality
     */
    public changeBaseAccount(acc) {
        this.openDropDown = false;
        /**
         * Handles if functionality
         */
        if (!acc) {
            this.toaster.showSnackBar("error", this.localeData?.account_unchanged);
            return;
        }
        /**
         * Handles if functionality
         */
        if (acc === this.baseAcc) {
            this.toaster.showSnackBar("error", this.localeData?.account_unchanged);
            return;
        }

        this.changedAccountUniq = acc?.value;
        this.baseAccountChanged = true;
        this.accountUniqueName = acc?.value;

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            // get flatten_accounts list && get transactions list && get ledger account list
            /**
             * Handles observableCombineLatest functionality
             */
            observableCombineLatest([this.selectedLedgerStream$, this.accountService.GetAccountDetailsV2(this.accountUniqueName), this.companyProfile$])
                .pipe(takeUntil(this.destroyed$))
                .subscribe((resp: any[]) => {
                    /**
                     * Handles if functionality
                     */
                    if (resp[0] && resp[1] && resp[2]) {
                        this.initEntry(resp, true);
                    }
                });
        }
    }

    /**
     * Opens baseaccountmodal
     */
    public openBaseAccountModal() {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion !== 2 && this.vm.selectedLedger.voucherGenerated) {
            this.toaster.showSnackBar("error", this.localeData?.base_account_change_error);
            return;
        }
    }

    /**
     * Fetches the invoice list data for a voucher
     *
     * @param {*} event Contains the selected voucher details
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getInvoiceListsData(event: any): void {
        this.vm.selectedLedger.voucher = {
            name: event?.label,
            shortCode: event?.value,
        }
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            this.resetInvoiceList();
        }
        /**
         * Handles if functionality
         */
        if (event?.value === VoucherTypeEnum.creditNote || event?.value === VoucherTypeEnum.debitNote) {
            this.getInvoiceListsForCreditNote();
        }
        this.isAdvanceReceipt = (event?.value === 'advance-receipt');
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.vm.selectedLedger?.voucher?.shortCode, this.commonLocaleData);
        this.handleAdvanceReceiptChange();
    }

    /**
     * Advance Receipt adjustment handler
     *
     * @param {boolean} isUpdateMode True if adjustments are updated
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleVoucherAdjustment(isUpdateMode?: boolean): void {
        /**
         * Handles if functionality
         */
        if (!this.vm.selectedLedger?.voucherGenerated && this.vm.selectedLedger?.voucher?.shortCode !== 'pur') {
            // Voucher must be generated for all vouchers except purchase order
            this.toaster.showSnackBar("info", ADJUSTMENT_INFO_MESSAGE, this.localeData?.app_giddh);
            /**
             * Handles if functionality
             */
            if (this.isAdjustAdvanceReceiptSelected) {
                this.isAdjustAdvanceReceiptSelected = false;
            } else if (this.isAdjustReceiptSelected) {
                this.isAdjustReceiptSelected = false;
            } else if (this.isAdjustVoucherSelected) {
                this.isAdjustVoucherSelected = false;
            }
            return;
        }
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments && !this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments = [];
        }
        /**
         * Handles if functionality
         */
        if ((this.isAdjustAdvanceReceiptSelected || this.isAdjustReceiptSelected || this.isAdjustVoucherSelected) && (!this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length || isUpdateMode)) {
            this.prepareAdjustVoucherConfiguration();
            this.openAdjustPaymentModal();
        }
    }

    /**
     * Checks if the voucher is generated which is a required
     * condition for adjustment of voucher
     *
     * @param {*} event Click event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public checkForGeneratedVoucher(event: any): void {
        /**
         * Handles if functionality
         */
        if (event && this.vm.selectedLedger?.voucher?.shortCode !== 'pur' && !this.vm.selectedLedger?.voucherGenerated) {
            // Adjustment is not allowed until the voucher is generated
            this.toaster.showSnackBar("info", ADJUSTMENT_INFO_MESSAGE, this.localeData?.app_giddh);
            event.preventDefault();
        }
    }

    /**
     * Get Invoice list for credit note
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getInvoiceListsForCreditNote(): void {
        let request;

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            let particularAccount = (this.vm.selectedLedger?.transactions[0]?.particular?.uniqueName === this.activeAccount?.uniqueName) ? this.vm.selectedLedger?.particular : this.vm.selectedLedger?.transactions[0]?.particular;

            request = this.adjustmentUtilityService.getInvoiceListRequest({ particularAccount: particularAccount, voucherType: this.vm.selectedLedger?.voucher?.shortCode, ledgerAccount: this.activeAccount });
        }

        /**
         * Handles if functionality
         */
        if (!request) {
            return;
        }

        request.number = this.searchReferenceVoucher;

        /**
         * Handles if functionality
         */
        if (request.number) {
            this.resetInvoiceList();
        }

        request.page = this.referenceVouchersCurrentPage;

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2 && request.page > 1 && this.referenceVouchersTotalPages < request.page) {
            return;
        }

        this.referenceVouchersCurrentPage++;

        let date;
        /**
         * Handles if functionality
         */
        if (typeof this.vm.selectedLedger.entryDate === 'string') {
            date = this.vm.selectedLedger.entryDate;
        } else {
            date = dayjs(this.vm.selectedLedger.entryDate).format(GIDDH_DATE_FORMAT);
        }

        this.ledgerService.getInvoiceListsForCreditNote(request, date).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            /**
             * Handles if functionality
             */
            if (response && response.body) {
                this.referenceVouchersTotalPages = response.body.totalPages;

                /**
                 * Handles if functionality
                 */
                if (response.body.results || response.body.items) {
                    let items = [];
                    /**
                     * Handles if functionality
                     */
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    items?.forEach(invoice => {
                        invoice.voucherNumber = this.generalService.getVoucherNumberLabel(invoice?.voucherType, invoice?.voucherNumber, this.commonLocaleData);

                        this.invoiceList.push({ label: invoice?.voucherNumber ? invoice.voucherNumber : '-', value: invoice?.uniqueName, additional: invoice })
                    });
                } else {
                    this.forceClear$ = observableOf({ status: true });
                }
                let invoiceSelected;
                let selectedInvoice;
                /**
                 * Handles if functionality
                 */
                if (this.voucherApiVersion === 2) {
                    selectedInvoice = this.vm.selectedLedger?.referenceVoucher ? this.vm.selectedLedger?.referenceVoucher : false;
                }

                /**
                 * Handles if functionality
                 */
                if (selectedInvoice) {
                    /**
                     * Handles if functionality
                     */
                    if (this.voucherApiVersion === 2) {
                        selectedInvoice.number = this.generalService.getVoucherNumberLabel(selectedInvoice?.voucherType, selectedInvoice?.number, this.commonLocaleData);

                        invoiceSelected = {
                            label: selectedInvoice.number ? selectedInvoice.number : '-',
                            value: selectedInvoice.uniqueName,
                            additional: selectedInvoice
                        };

                        const linkedInvoice = this.invoiceList.find(invoice => invoice?.value === invoiceSelected?.value);
                        /**
                         * Handles if functionality
                         */
                        if (!linkedInvoice) {
                            this.invoiceList.push(invoiceSelected);
                        }

                    }
                }
                this.invoiceList = uniqBy(this.invoiceList, 'value');
                this.invoiceList$ = observableOf(this.invoiceList);
                this.selectedInvoice = (invoiceSelected) ? invoiceSelected.label : '';
            } else if (request.number) {
                this.resetInvoiceList();
            }
        });
    }

    /**
     * Removes the selected invoice for credit note
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public removeSelectedInvoice(): void {
        this.forceClear$ = observableOf({ status: true });
        this.selectedInvoice = '';

        /**
         * Handles if functionality
         */
        if (!this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            this.vm.selectedLedger.generateInvoice = this.manualGenerateVoucherChecked;
        }
    }

    /**
     * Retrieves invoicelists data
     */
    public getInvoiceLists() {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucher?.shortCode === 'rcpt') {
            /**
             * Handles if functionality
             */
            if (this.isPettyCash && !this.accountUniqueName) {
                let message = this.localeData?.account_entry_error;
                message = message?.replace("[ACCOUNT]", this.pettyCashBaseAccountTypeString);
                this.toaster.showSnackBar("error", message);
                return;
            }

            this.invoiceList = [];
        }
    }

    /**
     * Handles selectInvoice functionality
     */
    public selectInvoice(invoiceNo, ev) {
        invoiceNo.isSelected = ev.target?.checked;
        /**
         * Handles if functionality
         */
        if (ev.target?.checked) {
            this.vm.selectedLedger.invoicesToBePaid.push(invoiceNo.label);
        } else {
            let indx = this.vm.selectedLedger.invoicesToBePaid?.indexOf(invoiceNo.label);
            this.vm.selectedLedger.invoicesToBePaid.splice(indx, 1);
        }
    }

    /**
     * Selected invoice for credit note
     *
     * @param {any} event Selected invoice for credit note
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public creditNoteInvoiceSelected(event: any): void {
        /**
         * Handles if functionality
         */
        if (event && event.value && event.additional) {
            /**
             * Handles if functionality
             */
            if (this.vm.selectedLedger) {
                /**
                 * Handles if functionality
                 */
                if (this.voucherApiVersion === 2) {
                    this.vm.selectedLedger.referenceVoucher = {
                        uniqueName: event.value
                    }
                }
            }
            this.vm.selectedLedger.generateInvoice = true;
        } else {
            /**
             * Handles if functionality
             */
            if (this.vm.selectedLedger) {
                /**
                 * Handles if functionality
                 */
                if (this.voucherApiVersion === 2) {
                    this.vm.selectedLedger.referenceVoucher = null;
                }
            }
        }
    }

    /**
     * Opens headerdropdown
     */
    public openHeaderDropDown() {
        this.entryAccountUniqueName = "";

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2 || !this.vm.selectedLedger.voucherGenerated || this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.sales) {
            this.entryAccountUniqueName = this.vm.selectedLedger.particular?.uniqueName;
            this.openDropDown = true;
        }
    }

    /**
     * Handles keydownPressed functionality
     */
    public keydownPressed(e) {
        /**
         * Handles if functionality
         */
        if (e?.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e?.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePaneOpen();
        } else {
            this.keydownClassAdded = false;
        }

    }

    /**
     * Toggles asidepaneopen state
     */
    public toggleAsidePaneOpen() {
        /**
         * Handles if functionality
         */
        if (document.getElementById('createNewId')) {
            document.getElementById('createNewId').click();
            this.keydownClassAdded = false;
        }
        /**
         * Handles if functionality
         */
        if (document.getElementById('createNewId2')) {
            document.getElementById('createNewId2').click();
            this.keydownClassAdded = false;
        }
    }

    /**
     * Hides discounttax element
     */
    public hideDiscountTax(): void {
        /**
         * Handles if functionality
         */
        if (this.discountComponent) {
            this.discountComponent.discountMenu = false;
        }
    }

    /**
     * Hides discount element
     */
    public hideDiscount(): void {
        /**
         * Handles if functionality
         */
        if (this.discountComponent) {
            this.discountComponent?.change();
            this.discountComponent.discountMenu = false;
        }
    }

    /**
     * Hides tax element
     */
    public hideTax(): void {
        /**
         * Handles if functionality
         */
        if (this.taxControll) {
            this.taxControll?.change();
        }
    }

    /**
     * Toggles currency state
     */
    public async toggleCurrency() {
        this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrencyForDisplay === 1 ? 0 : 1;
        let rate = 0;
        /**
         * Handles if functionality
         */
        if (Number(this.vm.selectedLedger?.exchangeRate)) {
            rate = 1 / this.vm.selectedLedger?.exchangeRate;
        }
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger) {
            this.vm.selectedLedger = { ...this.vm.selectedLedger, exchangeRate: rate };
        }
    }

    /**
     * Handles exchangeRateChanged functionality
     */
    public exchangeRateChanged() {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger) {
            this.vm.selectedLedger.exchangeRate = Number(this.vm.selectedLedger?.exchangeRate) || 0;
        }
        /**
         * Handles if functionality
         */
        if (this.vm.stockTrxEntry && this.vm.stockTrxEntry.inventory && this.vm.stockTrxEntry.inventory.unit && this.vm.selectedLedger && this.vm.selectedLedger.unitRates) {
            const stock = this.vm.stockTrxEntry.unitRate.find(rate => {
                return rate.stockUnitCode === this.vm.stockTrxEntry.inventory.unit.code;
            });
            const stockRate = stock ? stock.rate : 0;
            this.vm.stockTrxEntry.inventory.rate = Number((stockRate / this.vm.selectedLedger?.exchangeRate).toFixed(this.ratePrecision));
            this.vm.inventoryPriceChanged(this.vm.stockTrxEntry.inventory.rate);
        } else {
            this.vm.inventoryAmountChanged();
        }
    }

    /**
     * This will reset the state of checkbox and ngModel to make sure we update it based on user confirmation later
     *
     * @param {*} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public changeRcmCheckboxState(event: any): void {
        /**
         * Handles if functionality
         */
        if (!this.isPettyCash && (this.currentOrganizationType === 'COMPANY' || this.isConsolidatedBranch) && (this.branches && this.branches.length > 1)) {
            return;
        }
        this.isRcmEntry = !this.isRcmEntry;
        this.toggleRcmCheckbox(event, 'checkbox');
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public toggleRcmCheckbox(event: any, element: string): void {
        /**
         * Handles if functionality
         */
        if (!this.isPettyCash && (this.currentOrganizationType === 'COMPANY' || this.isConsolidatedBranch) && (this.branches && this.branches.length > 1)) {
            return;
        }
        let isChecked;

        /**
         * Handles if functionality
         */
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

        dialogRef.afterClosed().subscribe(response => {
            this.handleRcmChange(response);
        });
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleRcmChange(action: string): void {
        /**
         * Handles if functionality
         */
        if (action === this.commonLocaleData?.app_yes) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
            this.vm.isRcmEntry = this.isRcmEntry;
            this.rcmCheckbox['checked'] = this.isRcmEntry;
            this.vm.generateGrandTotal();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Handles the advance receipt change
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleAdvanceReceiptChange(restrictPopup: boolean = false): void {
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        this.vm.isAdvanceReceipt = this.isAdvanceReceipt;
        this.vm.isAdvanceReceiptWithTds = cloneDeep(this.isAdvanceReceipt);
        /**
         * Handles if functionality
         */
        if (this.shouldShowAdvanceReceiptMandatoryFields) {
            this.vm.generatePanelAmount();
        }
        /**
         * Handles if functionality
         */
        if (!this.isAdvanceReceipt && !restrictPopup) {
            /**
             * Handles if functionality
             */
            if (this.isAdjustedInvoicesWithAdvanceReceipt && this.vm.selectedLedger && this.vm.selectedLedger.voucherGeneratedType === VoucherTypeEnum.receipt) {
                this.advanceReceiptRemoveDialogRef = this.dialog.open(ConfirmModalComponent, {
                            width: '630px',
                            data: {
                        title: this.commonLocaleData?.app_confirmation,
                            body: this.localeData?.confirm_proceed,
                            permanentlyDeleteMessage: this.localeData?.remove_advance_receipt,
                            ok: this.commonLocaleData?.app_yes,
                            cancel: this.commonLocaleData?.app_no
                        }
                });

                this.advanceReceiptRemoveDialogRef.afterClosed().subscribe(response => {
                    this.onAdvanceReceiptRemoveCloseConfirmationModal(response);
                });
            }
        }
        this.vm.generateGrandTotal();
        this.vm.generateCompoundTotal();
    }

    // petty cash account changes, change all things related to account uniquename
    // like multi currency account, base account etc...
    /**
     * Handles pettyCashAccountChanged functionality
     */
    private pettyCashAccountChanged() {
        // set account details for multi currency account
        this.prepareMultiCurrencyObject(this.accountUniqueName);
        // end multi currency assign
    }

    /**
     * Handles assignPrefixAndSuffixForCurrency functionality
     */
    private assignPrefixAndSuffixForCurrency() {
        this.vm.isPrefixAppliedForCurrency = this.vm.isPrefixAppliedForCurrency = !(['AED'].includes(this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails?.code : this.vm.foreignCurrencyDetails?.code));
        this.vm.selectedPrefixForCurrency = this.vm.isPrefixAppliedForCurrency ?
            this.vm.selectedCurrency === 0 ?
                (this.vm.baseCurrencyDetails) ? this.vm.baseCurrencyDetails.symbol : (this.vm.foreignCurrencyDetails) ? this.vm.foreignCurrencyDetails.symbol : '' :
                '' : '';
        this.vm.selectedSuffixForCurrency = this.vm.isPrefixAppliedForCurrency ?
            '' : this.vm.selectedCurrency === 0 ? (this.vm.baseCurrencyDetails) ? this.vm.baseCurrencyDetails.symbol :
                (this.vm.foreignCurrencyDetails) ? this.vm.foreignCurrencyDetails.symbol : '' :
                '';
    }

    /**
     * Quantity change handler
     *
     * @param {string} value Current value
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleQuantityChange(value: string): void {
        /**
         * Handles if functionality
         */
        if (this.vm && this.vm.stockTrxEntry && this.vm.stockTrxEntry.inventory) {
            this.vm.stockTrxEntry.inventory.quantity = Number(this.vm.stockTrxEntry.inventory.quantity);
        }
        this.vm.inventoryQuantityChanged(value);
    }

    /**
     * Scroll end handler
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.searchResultsPaginationData.page) {
            this.onSearchQueryChanged(
                this.searchResultsPaginationData.query,
                this.searchResultsPaginationData.page + 1,
                this.searchResultsPaginationData.query ? true : false,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.searchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                                label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
                                additional: result
                            }
                        }) || [];
                        this.defaultSuggestions = this.defaultSuggestions.concat(...results);
                        this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
                    }
                });
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1, withStocks: boolean = true, successCallback?: Function): void {
        /**
         * Handles if functionality
         */
        if (query || (this.defaultSuggestions && this.defaultSuggestions.length === 0) || successCallback) {
            this.searchResultsPaginationData.query = query;
            const currentLedgerCategory = this.activeAccount ? this.generalService.getAccountCategory(this.activeAccount, this.activeAccount?.uniqueName) : '';
            // If current ledger is of income or expense category then send current ledger as stockAccountUniqueName. Only required for ledger.
            const accountUniqueName = (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
                this.activeAccount ? this.activeAccount.uniqueName : '' :
                '';
            const requestObject = {
                q: encodeURIComponent(query),
                page,
                withStocks,
                accountUniqueName: encodeURIComponent(accountUniqueName),
                count: API_BULK_FETCH_LIMIT
            }
            /**
             * Handles if functionality
             */
            if (this.isAccountSearchData) {
                this.searchService.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    /**
                     * Handles if functionality
                     */
                    if (!data?.body?.results?.length || (data?.body?.results?.length && API_BULK_FETCH_LIMIT !== data?.body?.count)) {
                        this.isAccountSearchData = false;
                    }

                    /**
                     * Handles if functionality
                     */
                    if (data && data.body && data.body.results) {
                        const searchResults = data.body.results.map(result => {
                            return {
                                value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                                label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
                                additional: result
                            }
                        }) || [];
                        this.noResultsFoundLabel = SearchResultText.NotFound;
                        /**
                         * Handles if functionality
                         */
                        if (page === 1) {
                            this.searchResults = searchResults;
                        } else {
                            this.searchResults = [
                                ...this.searchResults,
                                ...searchResults
                            ];
                        }
                        this.searchResultsPaginationData.page = data.body.page;
                        /**
                         * Handles if functionality
                         */
                        if (successCallback) {
                            /**
                             * Handles successCallback functionality
                             */
                            successCallback(data.body.results);
                        } else {
                            this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
                        }
                        this.changeDetectorRef.detectChanges();
                    }
                });
            }
        } else {
            this.searchResults = [...this.defaultSuggestions];
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Resets the previous search result
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public resetPreviousSearchResults(): void {
        this.searchResults = [...this.defaultSuggestions];
        this.searchResultsPaginationData = {
            page: 0,
            count: API_BULK_FETCH_LIMIT,
            query: ''
        };
        this.noResultsFoundLabel = SearchResultText.NewSearch;
    }

    /**
     * Handler when search suggestions get hidden when user focuses the
     * pointer away
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public handleSuggestionHide(): void {
        this.noResultsFoundLabel = SearchResultText.NewSearch;
    }

    /**
     * Returns true, if any of the single item is stock
     *
     * @private
     * @returns {boolean} True, if item array contains stock item
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private isStockItemPresent(): boolean {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger.transactions) {
            /**
             * Handles for functionality
             */
            for (let index = 0; index < this.vm.selectedLedger.transactions.length; index++) {
                /**
                 * Handles if functionality
                 */
                if (this.vm.selectedLedger.transactions[index].inventory) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns true if anyone of the transactions satisfies the RCM checks
     *
     * @private
     * @param {*} transactions Transactions of the current ledger
     * @returns {boolean} True, if anyone of the transactions satisfies the RCM checks
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private isRcmEntryPresent(transactions: any): boolean {
        /**
         * Handles if functionality
         */
        if (transactions) {
            /**
             * Handles for functionality
             */
            for (let index = 0; index < transactions.length; index++) {
                const selectedAccountDetails = {
                    uniqueName: transactions[index].particular?.uniqueName || '',
                    parentGroups: transactions[index].particular ? transactions[index].particular?.parentGroups : []
                }
                const activeAccountDetails = {
                    uniqueName: this.baseAccountDetails.particular ? this.baseAccountDetails.particular?.uniqueName : '',
                    /**
                     * Handles parentGroups functionality
                     */
                    parentGroups: (this.baseAccountDetails && this.baseAccountDetails.parentGroups) ? this.baseAccountDetails.parentGroups : []
                }
                const isRcmEntry = this.generalService.shouldShowRcmSection(activeAccountDetails, selectedAccountDetails, this.activeCompany);
                /**
                 * Handles if functionality
                 */
                if (isRcmEntry) {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     *  To check tourist scheme applicable or not
     *
     * @private
     * @param {*} accountDetails Current ledger details
     * @returns {boolean} True if tourist scheme applicable
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private checkTouristSchemeApplicable(baseAccountDetails: any, selectedAccountDetails, companyProfile): boolean {
        /**
         * Handles if functionality
         */
        if (baseAccountDetails?.touristSchemeApplicable) {
            return true;
        } else if (baseAccountDetails?.voucher && (baseAccountDetails?.voucher?.name === 'sales' || baseAccountDetails?.voucher?.name === 'cash') && selectedAccountDetails && selectedAccountDetails.body && selectedAccountDetails.body.parentGroups && selectedAccountDetails.body.parentGroups.length > 1 && selectedAccountDetails.body?.parentGroups[1]?.uniqueName && this.allowParentGroup.includes(selectedAccountDetails.body.parentGroups[1]?.uniqueName) && companyProfile && companyProfile.countryV2 && companyProfile.countryV2.alpha2CountryCode && companyProfile.countryV2.alpha2CountryCode === 'AE') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Toggle Tourist scheme checkbox then reset passport number
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public touristSchemeApplicableToggle(event: MatCheckbox): void {
        this.vm.selectedLedger.passportNumber = '';
        this.vm.selectedLedger.touristSchemeApplicable = event?.checked;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * To make value alphanumeric
     *
     * @param {*} event Template ref to get value
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public allowAlphanumericChar(event: any): void {
        /**
         * Handles if functionality
         */
        if (event && event.value) {
            this.vm.selectedLedger.passportNumber = this.generalService.allowAlphanumericChar(event.value)
        }
    }

    /**
     * To check advance receipt adjusted invoice list's in edit mode
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public openAdjustInvoiceEditMode(): void {
        this.handleVoucherAdjustment(true);
    }

    /**
     * To open adjustment info
     *
     * @param {boolean} isOpen True if adjustment info is open
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public openAdjustmentInfo(isOpen: boolean): void {
        this.isLastAdjustmentInfoOpen = isOpen;
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.isAdjustmentInfoOpen = isOpen;
        } else {
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                /**
                 * Handles if functionality
                 */
                if (!this.isLastAdjustmentInfoOpen) {
                    this.isAdjustmentInfoOpen = isOpen;
                }
            }, 100);
        }
    }

    /**
     * To calculate total amount of adjusted Invoices.
     *
     * @param {*} event Change value of an Invoices
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public adjustedInvoiceAmountChange(): void {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            let totalAmount: number = 0;
            (Array.isArray(this.vm.selectedLedger.voucherAdjustments.adjustments) ? this.vm.selectedLedger.voucherAdjustments.adjustments : []).forEach(item => {
                totalAmount = Number(totalAmount) + (item.adjustmentAmount ? Number(item.adjustmentAmount.amountForAccount) : 0);
            });
            this.vm.selectedLedger.voucherAdjustments.totalAdjustmentAmount = totalAmount;
            this.checkAdjustedAmountExceed(Number(totalAmount));
            this.calculateInclusiveTaxesForAdvanceReceiptsInvoices();
        }
    }

    /**
     * To calculate inclusive taxes and assign to advance receipts adjusted invoice's tax object
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public calculateInclusiveTaxesForAdvanceReceiptsInvoices(): void {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments.map(item => {
                item.calculatedTaxAmount = this.generalService.calculateInclusiveOrExclusiveTaxes(true, item.adjustmentAmount.amountForAccount, item.taxRate, 0);
            });
        }
    }

    /**
    * To calculate total amount of adjusted receipts.
    *
    * @memberof UpdateLedgerEntryPanelComponent
    */
    public adjustedReceiptsAmountChange(): void {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            let totalAmount: number = 0;
            (Array.isArray(this.vm.selectedLedger.voucherAdjustments.adjustments) ? this.vm.selectedLedger.voucherAdjustments.adjustments : []).forEach(item => {
                totalAmount = Number(totalAmount) + (item.adjustmentAmount ? Number(item.adjustmentAmount.amountForAccount) : 0);
            });
            this.totalAdjustedAmount = totalAmount;
            this.checkAdjustedAmountExceed(Number(totalAmount));
            this.calculateInclusiveTaxesForAdvanceReceipts();
        }
    }

    /**
     * To calculate inclusive taxes and assign to advance receipts tax object
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public calculateInclusiveTaxesForAdvanceReceipts(): void {
        let totalAmount: number = 0;
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            this.vm.selectedLedger.voucherAdjustments.adjustments.map(item => {
                item.calculatedTaxAmount = this.generalService.calculateInclusiveOrExclusiveTaxes(true, item.adjustmentAmount.amountForAccount, item.taxRate, 0);
                totalAmount = Number(totalAmount) + Number(item.adjustmentAmount.amountForAccount);
            });
        }
        this.totalAdjustedAmount = totalAmount;
    }

    /**
     * To check adjusted advance amount is more  than advance receipt/invoice
     *
     * @param {number} totalAmount Total compound amount
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public checkAdjustedAmountExceed(totalAmount: number): void {
        /**
         * Handles if functionality
         */
        if (Number(this.vm.compoundTotal) < Number(totalAmount)) {
            this.isAdjustedAmountExcess = true;
            this.adjustedExcessAmount = Number(totalAmount) - Number(this.vm.compoundTotal);
        } else {
            this.isAdjustedAmountExcess = false;
            this.adjustedExcessAmount = 0;
        }
        this.selectedAdvanceReceiptAdjustInvoiceEditMode = false;
    }

    /**
     * To check advance Receipt/Invoice amount is exceed to adjusted amount when amount change
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public checkAdvanceReceiptOrInvoiceAdjusted(): void {
        /**
         * Handles if functionality
         */
        if (this.isAdjustedInvoicesWithAdvanceReceipt && this.vm.selectedLedger && this.vm.selectedLedger.voucherGeneratedType === 'receipt') {
            this.adjustedInvoiceAmountChange();
        } else if (this.isAdjustedWithAdvanceReceipt && this.vm.selectedLedger.voucherGeneratedType === 'sales') {
            this.adjustedReceiptsAmountChange();
        }
    }

    /**
     * Advance receipt adjustment remove model action response
     *
     * @param {*} userResponse  Action message
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public onAdvanceReceiptRemoveCloseConfirmationModal(userResponse: any): void {
        this.isAdvanceReceipt = !userResponse;
        this.handleAdvanceReceiptChange(true);
        /**
         * Handles if functionality
         */
        if (this.isAdvanceReceipt) {
            this.vm.selectedLedger.voucher.shortCode = "advance-receipt";
            this.vm.selectedLedger.voucher.name = this.commonLocaleData?.app_voucher_types?.advance_receipt;
        } else {
            this.vm.selectedLedger.voucher.shortCode = "rcpt";
            this.vm.selectedLedger.voucher.name = this.commonLocaleData?.app_voucher_types?.receipt;
        }
        this.advanceReceiptRemoveDialogRef.close();
    }

    /**
     * Payment adjustment handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Adjustment handler
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getAdjustedPaymentData(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
        /**
         * Handles if functionality
         */
        if (event && event.adjustPaymentData && event.adjustVoucherData) {
            const adjustments = cloneDeep(event.adjustVoucherData.adjustments);
            /**
             * Handles if functionality
             */
            if (adjustments) {
                (Array.isArray(adjustments) ? adjustments : []).forEach(adjustment => {
                    adjustment.voucherNumber = this.generalService.getVoucherNumberLabel(adjustment?.voucherType, adjustment?.voucherNumber, this.commonLocaleData);
                });

                this.vm.selectedLedger.voucherAdjustments = {
                    adjustments,
                    totalAdjustmentAmount: event.adjustPaymentData.totalAdjustedAmount,
                    tdsTaxUniqueName: null,
                    tdsAmount: null,
                    description: null
                };
                /**
                 * Handles if functionality
                 */
                if (!adjustments || !adjustments?.length) {
                    // No adjustments done clear the adjustment checkbox
                    this.isAdjustReceiptSelected = false;
                    this.isAdjustVoucherSelected = false;
                    this.isAdjustAdvanceReceiptSelected = false;
                    this.isAdjustVoucherSelected = false;

                    /**
                     * Handles if functionality
                     */
                    if (!this.selectInvoice) {
                        this.vm.selectedLedger.generateInvoice = this.manualGenerateVoucherChecked;
                    }
                } else {
                    this.vm.selectedLedger.generateInvoice = true;
                }
            }
        }
        this.makeAdjustmentCalculation();
        this.adjustmentDialogRef.close();
    }

    /**
     * Close voucher adjustment modal handler
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal}} event Close event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public closeAdjustmentModal(event: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments && !this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            // No adjustments done clear the adjustment checkbox
            this.isAdjustReceiptSelected = false;
            this.isAdjustVoucherSelected = false;
            this.isAdjustAdvanceReceiptSelected = false;

            /**
             * Handles if functionality
             */
            if (!this.vm.isInvoiceGeneratedAlready) {
                this.vm.selectedLedger.voucherGenerated = this.manualGenerateVoucherChecked;
            }
        }
        this.adjustmentDialogRef.close();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Prepares the voucher adjustment configuration
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private prepareAdjustVoucherConfiguration(): void {
        let customerUniqueName = [];
        this.vm.selectedLedger.transactions?.forEach(transaction => {
            /**
             * Handles if functionality
             */
            if (transaction?.particular && transaction?.particular?.uniqueName) {
                const uniqueName = transaction?.particular?.uniqueName.split('#')[0];
                customerUniqueName.push(uniqueName);
            }
        });
        /**
         * Handles if functionality
         */
        if (!this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length && this.originalVoucherAdjustments?.adjustments?.length) {
            // If length of voucher adjustment is 0 i.e., user has changed its original adjustments but has not performed update operation
            // and voucher already has original adjustments to it then show the
            // original adjustments in adjustment popup
            this.vm.selectedLedger.voucherAdjustments = cloneDeep(this.originalVoucherAdjustments);
        }
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments) {
            (Array.isArray(this.vm.selectedLedger.voucherAdjustments.adjustments) ? this.vm.selectedLedger.voucherAdjustments.adjustments : []).forEach(adjustment => {
                /**
                 * Handles if functionality
                 */
                if (!adjustment.balanceDue) {
                    adjustment.balanceDue = cloneDeep(adjustment.adjustmentAmount);
                } else if (!adjustment.adjustmentAmount) {
                    adjustment.adjustmentAmount = cloneDeep(adjustment.balanceDue);
                }
            });
        }
        customerUniqueName.push(this.baseAcc);
        customerUniqueName = union(customerUniqueName);

        let tcsTotal = (this.vm.selectedLedger.otherTaxType === "tcs") ? this.vm.selectedLedger.otherTaxesSum : 0;
        let tdsTotal = (this.vm.selectedLedger.otherTaxType === "tds") ? this.vm.selectedLedger.otherTaxesSum : 0;

        this.adjustVoucherConfiguration = {
            voucherDetails: {
                voucherDate: this.vm.selectedLedger.entryDate,
                tcsTotal: tcsTotal,
                tdsTotal: tdsTotal,
                balanceDue: this.vm.selectedLedger.total.amount,
                grandTotal: this.vm.selectedLedger?.entryVoucherTotals?.amountForAccount,
                customerName: this.vm.selectedLedger && this.vm.selectedLedger.particular ? this.vm.selectedLedger.particular.name : '',
                customerUniquename: customerUniqueName,
                totalTaxableValue: this.vm.selectedLedger.actualAmount,
                subTotal: this.vm.selectedLedger.total.amount,
                exchangeRate: this.vm.selectedLedger?.exchangeRate ?? 1,
                gainLoss: this.vm.selectedLedger.gainLoss,
                voucherUniqueName: this.vm.selectedLedger.voucherUniqueName
            },
            accountDetails: {
                currencySymbol: enableVoucherAdjustmentMultiCurrency ? this.vm.selectedLedger?.particular?.currency?.symbol ?? this.profileObj?.baseCurrencySymbol ?? '' : this.profileObj?.baseCurrencySymbol ?? '',
                currencyCode: enableVoucherAdjustmentMultiCurrency ? this.vm.selectedLedger?.particular?.currency?.code ?? this.profileObj?.baseCurrency ?? '' : this.profileObj?.baseCurrency ?? ''
            },
            activeAccountUniqueName: this.activeAccount?.uniqueName,
            type: this.entrySide
        };
    }

    /**
     * To open advance receipts adjustment pop up
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private openAdjustPaymentModal(): void {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            let particularAccount;

            const mainTransaction = this.vm.selectedLedger?.transactions?.filter(transaction => !transaction?.isDiscount && !transaction?.isTax && transaction?.particular?.uniqueName && transaction?.particular?.uniqueName !== 'roundoff');

            /**
             * Handles particularAccount functionality
             */
            particularAccount = (this.vm.selectedLedger?.particular?.uniqueName === this.activeAccount?.uniqueName) ? mainTransaction[0]?.particular : this.vm.selectedLedger?.particular;

            this.invoiceListRequestParams = { particularAccount: particularAccount, voucherType: this.vm.selectedLedger?.voucher?.name, ledgerAccount: this.activeAccount };
        }
        this.adjustmentDialogRef = this.dialog.open(this.adjustPaymentModal, {
                    width: "800px"
                });
    }

    /**
     * Initializes the variables based on adjustments made to show/hide sections on UI
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private makeAdjustmentCalculation(): void {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            this.isAdjustVoucherSelected = true;
            /**
             * Handles if functionality
             */
            if (this.vm.selectedLedger.voucherAdjustments.adjustments.every(adjustment => adjustment.voucherType === 'sales')) {
                this.isAdjustedInvoicesWithAdvanceReceipt = true;
                this.calculateInclusiveTaxesForAdvanceReceiptsInvoices();
            } else if (this.vm.selectedLedger.voucherAdjustments.adjustments.every(adjustment => adjustment.voucherType === 'receipt')) {
                this.isAdjustedWithAdvanceReceipt = true;
                this.calculateInclusiveTaxesForAdvanceReceipts();
            } else {
                this.isAdjustedWithAdvanceReceipt = false;
                this.isAdjustedInvoicesWithAdvanceReceipt = false;
            }
            /**
             * Handles if functionality
             */
            if (this.isAdvanceReceipt) {
                this.isAdjustAdvanceReceiptSelected = true;
            } else if (this.vm.selectedLedger?.voucher?.shortCode === 'rcpt') {
                this.isAdjustReceiptSelected = true;
            }
        }
    }

    /**
     * Loads the default search suggestion when petty cash is opened
     *
     * @public
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public loadDefaultSearchSuggestions(): void {
        this.onSearchQueryChanged('', 1, false, (response) => {
            this.defaultSuggestions = response.map(result => {
                return {
                    value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                    label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
                    additional: result
                }
            }) || [];
            this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
            this.searchResults = [...this.defaultSuggestions];
            this.noResultsFoundLabel = SearchResultText.NotFound;
        });
    }

    /**
     * Formats the adjustments to add '-' to voucher number if it is not found
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private formatAdjustments(): void {
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger?.voucherAdjustments?.adjustments?.length) {
            (Array.isArray(this.vm.selectedLedger.voucherAdjustments.adjustments) ? this.vm.selectedLedger.voucherAdjustments.adjustments : []).forEach(adjustment => {
                adjustment.voucherNumber = this.generalService.getVoucherNumberLabel(adjustment.voucherType, adjustment.voucherNumber, this.commonLocaleData);
                adjustment.accountCurrency = adjustment.accountCurrency ?? adjustment.currency ?? { symbol: this.activeCompany?.baseCurrencySymbol, code: this.activeCompany?.baseCurrency };
            });
        }
    }

    /**
     * Check for other account existence
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private checkForOtherAccount(): void {
        // check we already have others account in flatten account, then don't do anything
        this.searchService.searchAccountV2({ q: 'others' }).subscribe(response => {
            const isThereOthersAcc = !!response?.body?.results?.length;
            /**
             * Handles if functionality
             */
            if (!isThereOthersAcc) {
                // add new dummy account in flatten account array
                this.vm.otherAccountList.push({
                    name: 'Others', uniqueName: 'others', applicableTaxes: [],
                    parentGroups: [], isFixed: false, isDummy: true, mergedAccounts: ''
                });
            }
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public translationComplete(event: boolean): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.vm.voucherTypeList = [{
                label: this.commonLocaleData?.app_voucher_types?.sales,
                value: 'sal'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.purchases,
                value: 'pur'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.receipt,
                value: 'rcpt'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.payment,
                value: 'pay'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.journal,
                value: 'jr'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.contra,
                value: 'cntr'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.debit_note,
                value: 'debit note'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.credit_note,
                value: 'credit note'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.advance_receipt,
                value: 'advance-receipt',
                subVoucher: SubVoucher.AdvanceReceipt
            }];

            this.availableItcList[0].label = this.localeData?.import_goods;
            this.availableItcList[1].label = this.localeData?.import_services;
            this.availableItcList[2].label = this.localeData?.others;

            // get flatten_accounts list && get transactions list && get ledger account list
            /**
             * Handles observableCombineLatest functionality
             */
            observableCombineLatest([this.selectedLedgerStream$, this.accountService.GetAccountDetailsV2(this.accountUniqueName), this.companyProfile$])
                .pipe(takeUntil(this.destroyed$))
                .subscribe((resp: any[]) => {
                    /**
                     * Handles if functionality
                     */
                    if (resp[0] && resp[1] && resp[2]) {
                        this.initEntry(resp);
                    }
                });
        }
    }

    /**
     * This will set the entry data in edit mode
     *
     * @private
     * @param {any[]} resp
     * @param {boolean} [updateBaseAccountParticular]
     * @returns {void}
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private initEntry(resp: any[], updateBaseAccountParticular?: boolean): void {
        // insure we have account details, if we are normal ledger mode and not petty cash mode ( special case for others entry in petty cash )
        /**
         * Handles if functionality
         */
        if (this.isPettyCash && this.accountUniqueName && resp[1]?.status !== 'success') {
            return;
        }

        this.checkSundryDebtorCreditorStatus(resp[1]);

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            resp[0] = this.adjustmentUtilityService.getVoucherAdjustmentObject(resp[0], this.vm.selectedLedger.voucherGeneratedType);
            this.transactionDetails = cloneDeep(resp[0]);
        }

        this.isEinvoiceGenerated = resp[0].einvoiceGenerated;

        /**
         * Handles if functionality
         */
        if (updateBaseAccountParticular) {
            this.updateBaseAccountParticular(resp);
        }

        this.baseAccountDetails = resp[0];
        this.activeAccount = cloneDeep(resp[1].body);
        this.vm.activeAccount = this.activeAccount;
        // Decides whether to show the RCM entry
        this.shouldShowRcmEntry = this.isRcmEntryPresent(resp[0].transactions);
        this.isTouristSchemeApplicable = this.checkTouristSchemeApplicable(resp[0], resp[1], resp[2]);
        this.shouldShowRcmTaxableAmount = resp[0].reverseChargeTaxableAmount !== undefined && resp[0].reverseChargeTaxableAmount !== null;
        /**
         * Handles if functionality
         */
        if (this.shouldShowRcmTaxableAmount) {
            // Received taxable amount is a truthy value
            resp[0].reverseChargeTaxableAmount = this.generalService.convertExponentialToNumber(resp[0].reverseChargeTaxableAmount);
        }
        // Show the ITC section if value of ITC is received (itcAvailable) or it's an old transaction that is eligible for ITC (isItcEligible)
        this.shouldShowItcSection = !!resp[0].itcAvailable || resp[0].isItcEligible;
        this.taxOnlyTransactions = resp[0].taxOnlyTransactions;
        this.profileObj = resp[2];
        this.vm.giddhBalanceDecimalPlaces = resp[2].balanceDecimalPlaces;
        this.vm.inputMaskFormat = this.profileObj.balanceDisplayFormat ? this.profileObj.balanceDisplayFormat.toLowerCase() : '';

        this.setupActiveAccountAndDiscounts(resp);

        this.vm.getUnderstandingText(resp[0].particularType, resp[0].particular.name, this.localeData);

        //#region transaction assignment process
        this.vm.selectedLedger = resp[0];
        this.originalVoucherAdjustments = cloneDeep(this.vm.selectedLedger?.voucherAdjustments);
        this.formatAdjustments();
        const voucherGeneratedType = this.vm.selectedLedger.voucherGeneratedType || this.vm.selectedLedger.voucher?.shortCode;
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger && !this.invoiceList?.length && (voucherGeneratedType === VoucherTypeEnum.creditNote ||
            voucherGeneratedType === VoucherTypeEnum.debitNote)) {
            this.getInvoiceListsForCreditNote();
        }

        // Check the RCM checkbox if API returns subvoucher as Reverse charge
        this.isRcmEntry = (this.vm.selectedLedger.subVoucher === SubVoucher.ReverseCharge);
        this.isAdvanceReceipt = (this.vm.selectedLedger.subVoucher === SubVoucher.AdvanceReceipt);
        this.vm.isRcmEntry = this.isRcmEntry;
        this.vm.isAdvanceReceipt = this.isAdvanceReceipt;
        this.vm.isAdvanceReceiptWithTds = cloneDeep(this.isAdvanceReceipt);
        this.shouldShowAdvanceReceiptMandatoryFields = this.isAdvanceReceipt;
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger.voucher && this.vm.selectedLedger.voucher?.shortCode === 'rcpt' && this.isAdvanceReceipt) {
            this.vm.selectedLedger.voucher.shortCode = 'advance-receipt';
            this.vm.selectedLedger.voucher.name = this.commonLocaleData?.app_voucher_types?.advance_receipt;
        }
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.vm.selectedLedger?.voucher?.shortCode, this.commonLocaleData);
        this.makeAdjustmentCalculation();

        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            this.vm.selectedLedger.transactions?.forEach(item => {
                item.type = (item.type === 'cr' || item.type === 'CREDIT') ? 'CREDIT' : 'DEBIT';
            });
            // create missing property for petty cash
            this.vm.selectedLedger.transactions?.forEach(item => {
                item.type = (item.type === 'cr' || item.type === 'CREDIT') ? 'CREDIT' : 'DEBIT';
            });
            this.vm.selectedLedger.transactions?.forEach(f => {
                f.isDiscount = false;
                f.isTax = false;

                // special case in petty cash mode
                // others account entry
                // need to assign dummy particular, when we found particular uniquename as null
                /**
                 * Handles if functionality
                 */
                if (!f.particular?.uniqueName) {
                    f.particular.uniqueName = 'others';
                    f.particular.name = 'others';
                }

            });
            this.vm.selectedLedger.taxes = [];
            this.vm.selectedLedger.discounts = [];
            this.vm.selectedLedger.attachedFile = '';
            this.vm.selectedLedger.voucher = { name: '', shortCode: '' };
            this.vm.selectedLedger.invoicesToBePaid = [];
        }

        // divide actual amount with exchangeRate because currently we are getting actualAmount in company currency
        //this.vm.selectedLedger.actualAmount = giddhRoundOff(this.vm.selectedLedger.actualAmount / this.vm.selectedLedger.exchangeRate, this.vm.giddhBalanceDecimalPlaces);

        // other taxes assigning process
        let companyTaxes: TaxResponse[] = [];
        this.vm.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);

        let otherTaxesModal = new SalesOtherTaxesModal();
        otherTaxesModal.itemLabel = resp[0].particular.name;

        let tax: TaxResponse;
        /**
         * Handles if functionality
         */
        if (resp[0].tcsTaxes && resp[0].tcsTaxes.length) {
            tax = companyTaxes.find(f => f?.uniqueName === resp[0].tcsTaxes[0]);
            this.vm.selectedLedger.otherTaxType = 'tcs';
        } else if (resp[0].tdsTaxes && resp[0].tdsTaxes.length) {
            tax = companyTaxes.find(f => f?.uniqueName === resp[0].tdsTaxes[0]);
            this.vm.selectedLedger.otherTaxType = 'tds';
        }

        /**
         * Handles if functionality
         */
        if (tax) {
            otherTaxesModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
        }

        otherTaxesModal.tcsCalculationMethod = resp[0].tcsCalculationMethod || SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;

        this.vm.selectedLedger.isOtherTaxesApplicable = !!(tax);
        this.vm.selectedLedger.otherTaxModal = otherTaxesModal;

        this.baseAccount$ = observableOf(resp[0].particular);
        this.baseAccountName = resp[0].particular?.uniqueName;
        this.baseAcc = resp[0].particular?.uniqueName;
        this.firstBaseAccountSelected = resp[0].particular?.uniqueName;

        /**
         * Handles if functionality
         */
        if (resp[0].salesPerson) {
            this.vm.selectedLedger.salesPersonUniqueName = resp[0].salesPerson.uniqueName;
        } else {
            this.vm.selectedLedger.salesPersonUniqueName = null;
            this.vm.selectedLedger.salesPerson = this.resetSalesPerson();
        }

        const initialAccounts: Array<IOption> = [];
        this.vm.selectedLedger.transactions?.map((t, index) => {
            t.amount = giddhRoundOff(t.amount, this.vm.giddhBalanceDecimalPlaces);

            /**
             * Handles if functionality
             */
            if (this.vm.selectedLedger.discounts && this.vm.selectedLedger.discounts.length > 0 && !t?.isTax && t?.particular?.uniqueName !== 'roundoff') {
                let category = this.vm.getAccountCategory(t.particular, t.particular?.uniqueName);
                /**
                 * Handles if functionality
                 */
                if (this.vm.isValidCategory(category)) {
                    /**
                     * replace transaction amount with the actualAmount key that we got in response of get-ledger
                     * because of ui and api follow different calculation pattern,
                     * so transaction amount of income/ expenses account differ from both the side
                     * so overcome this issue api provides the actual amount which was added by user while creating entry
                     */
                    if (index === 0) {
                        t.amount = this.vm.selectedLedger.actualAmount;
                    }
                    // if transaction is stock transaction then also update inventory amount and recalculate inventory rate
                    /**
                     * Handles if functionality
                     */
                    if (t.inventory) {
                        t.inventory.amount = this.vm.selectedLedger.actualAmount;
                        t.inventory.rate = this.vm.selectedLedger.actualRate;
                    }
                }
            }
            /**
             * Handles if functionality
             */
            if (t.inventory) {
                this.selectedStockVariant = { name: t.inventory.variant?.name, uniqueName: t.inventory.variant?.uniqueName };
                /**
                 * Handles if functionality
                 */
                if (this.selectedStockUniquenName !== t.inventory.stock?.uniqueName) {
                    /** Load stock variant only when stock has changed (stock will not be changed if the
                     user only updates the entry) */
                    this.selectedStockUniquenName = t.inventory.stock?.uniqueName;
                    // Load stock's variants
                    this.loadStockVariants(t.inventory.stock?.uniqueName);
                }
                this.vm.isInclusiveEntry = t.inventory.taxInclusive;

                const unitRates = cloneDeep(this.vm.selectedLedger.unitRates);
                /**
                 * Handles if functionality
                 */
                if (unitRates && unitRates.length) {
                    (Array.isArray(unitRates) ? unitRates : []).forEach(rate => rate.code = rate?.stockUnitCode);
                    t.unitRate = unitRates;
                } else {
                    t.unitRate = [{
                        code: t.inventory.unit?.code,
                        rate: t.inventory.rate,
                        stockUnitCode: t.inventory.unit?.code,
                        stockUnitUniqueName: t.inventory.unit?.stockUnitUniqueName
                    }];
                }
                initialAccounts.push({
                    label: `${t.particular?.name} (${t.inventory.stock?.name})`,
                    value: `${t.particular?.uniqueName}#${t.inventory.stock?.uniqueName}`,
                    additional: {
                        stock: {
                            name: t.inventory.stock?.name,
                            uniqueName: t.inventory.stock?.uniqueName
                        },
                        uniqueName: t.particular?.uniqueName
                    }
                });
                t.particular.uniqueName = `${t.particular?.uniqueName}#${t.inventory.stock?.uniqueName}`;
                t.particular.name = t.particular?.name + ' (' + t.inventory.stock?.name + ')';
                // Show warehouse dropdown only for stock items
                const warehouseDetails = t.inventory.warehouse;
                /**
                 * Handles if functionality
                 */
                if (warehouseDetails) {
                    this.selectedWarehouse = warehouseDetails?.uniqueName;
                    this.selectedWarehouseName = warehouseDetails?.name;
                } else {
                    // If warehouse details are not received show default warehouse
                    this.selectedWarehouse = String(this.defaultWarehouse);
                    this.selectedWarehouseName = String(this.defaultWarehouse);
                }
                this.isStockPresent = true;
            } else {
                initialAccounts.push({
                    label: t.particular?.name,
                    value: t.particular?.uniqueName,
                    additional: {
                        ...t,
                        uniqueName: t.particular?.uniqueName
                    }
                });
                this.isStockPresent = false;
            }
        });
        initialAccounts.push(...this.defaultSuggestions);
        this.searchResults = orderBy(uniqBy(initialAccounts, 'value'), 'label');
        this.vm.isInvoiceGeneratedAlready = this.vm.selectedLedger.voucherGenerated;

        this.store.pipe(select(appState => appState.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            /**
             * Handles if functionality
             */
            if (warehouses) {
                let warehouseResults = cloneDeep(warehouses.results);
                /**
                 * Handles if functionality
                 */
                if (this.selectedWarehouse) {
                    warehouseResults = warehouseResults?.filter(warehouse => this.selectedWarehouse === warehouse?.uniqueName || !warehouse.isArchived);
                }
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.defaultWarehouse = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.uniqueName : '';
            } else {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            }
        });

        // check if entry allows to show discount and taxes box
        // first check with opened lager
        /**
         * Handles if functionality
         */
        if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
            this.vm.showNewEntryPanel = true;
        } else {
            // now check if we transactions array have any income/expense/fixed assets entry
            let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
            this.vm.showNewEntryPanel = incomeExpenseEntryLength > 0;
        }

        this.vm.reInitilizeDiscount(resp[0]);
        /**
         * Handles if functionality
         */
        if (!updateBaseAccountParticular && (this.isPettyCash || this.generalService.currentOrganizationType === OrganizationType.Branch || (this.branches && this.branches.length === 1))) {
            this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('CREDIT'));
            this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('DEBIT'));
        }

        /**
         * Handles if functionality
         */
        if (this.vm.stockTrxEntry) {
            this.vm.inventoryPriceChanged(this.vm.stockTrxEntry.inventory.rate);
        }
        this.existingTaxTxn = lodashFilter(this.vm.selectedLedger.transactions, (o) => o.isTax);
        //#endregion
        /**
         * Handles if functionality
         */
        if (!this.vm.showNewEntryPanel || this.isAdvanceReceipt) {
            // Calculate entry total for credit and debit transactions when UI panel at the bottom to update
            // transaction is not visible or current transaction is advance receipt as discount field is not displayed
            // for advance receipt. Update Ledger calculates entry total only when discount value is set or changes therefore
            // additional condition is required to check for advance receipt to calculate entry total
            this.vm.getEntryTotal();
            this.vm.generateCompoundTotal();
        }
        this.vm.generatePanelAmount();
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.vm.calculateOtherTaxes(this.vm.selectedLedger.otherTaxModal);
            }, 200);
        }
        /**
         * Handles if functionality
         */
        if (this.isAdvanceReceipt) {
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.handleAdvanceReceiptChange();
            }, 100);
        }

        /** Since we are not showing amount bar in case of journal voucher, calculation is not working automatically so we are calculating here */
        /**
         * Handles if functionality
         */
        if (this.vm.selectedLedger.voucher.shortCode === 'jr') {
            this.vm.inventoryAmountChanged();
        }

        this.activeAccountSubject.next(this.activeAccount);

        this.isStockPresent = this.vm.selectedLedger.transactions.some(item =>
            item.inventory && Object.keys(item.inventory).length > 0);
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Download files (voucher/attachment)
     *
     * @param {string} downloadOption
     * @param {*} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public downloadFiles(downloadOption: string, event: any): void {
        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            let dataToSend = {
                voucherType: this.vm.selectedLedger.voucherGeneratedType,
                /**
                 * Handles entryUniqueName functionality
                 */
                entryUniqueName: (this.vm.selectedLedger.voucherUniqueName) ? undefined : this.vm.selectedLedger?.uniqueName,
                /**
                 * Handles uniqueName functionality
                 */
                uniqueName: (this.vm.selectedLedger.voucherUniqueName) ? this.vm.selectedLedger.voucherUniqueName : undefined
            };

            let fileName = (downloadOption === "VOUCHER") ? this.vm.selectedLedger.voucherNumber + '.pdf' : this.vm.selectedLedger.attachedFile;

            this.commonService.downloadFile(dataToSend, downloadOption, 'pdf').pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
                if (response?.status !== "error") {
                    /**
                     * Saves as data
                     */
                    saveAs(response, fileName);
                } else {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }));
        }
    }

    /**
     * Shows the attachments popup
     *
     * @param {TemplateRef<any>} templateRef
     * @param {boolean} [isAttachment=false]
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public openAttachmentsDialog(templateRef: TemplateRef<any>, isAttachment: boolean = false): void {
        document.querySelector(".cdk-global-overlay-wrapper")?.classList?.add("double-popup-zindex");
        this.selectedItem = this.vm.selectedLedger;
        this.selectedItem['isAttachment'] = isAttachment;
        let dialogRef = this.dialog.open(templateRef, {
            width: '70%',
            height: '790px',
            maxHeight: '90vh',
            role: 'alertdialog',
            ariaLabel: 'template',
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(() => {
            document.querySelector(".cdk-global-overlay-wrapper")?.classList?.remove("double-popup-zindex");
        });
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public resetInvoiceList(): void {
        this.invoiceList = [];
        this.invoiceList$ = observableOf([]);
        this.referenceVouchersCurrentPage = 1;
        this.referenceVouchersTotalPages = 1;
    }

    /**
     * Other tax updated callback
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public calculateTax(): void {
        this.vm.generateGrandTotal();
    }

    /**
     * This function is used to get purchase settings from store
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getPurchaseSettings(): void {
        this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.purchaseBillSettings && !response?.purchaseBillSettings?.enableVoucherDownload) {
                this.restrictedVouchersForDownload.push(AdjustedVoucherType.PurchaseInvoice);
            } else {
                this.restrictedVouchersForDownload = this.restrictedVouchersForDownload?.filter(voucherType => voucherType !== AdjustedVoucherType.PurchaseInvoice);
            }
        });
    }

    /**
     * Variant change handler
     *
     * @param {IOption} event Variant change event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public variantChanged(event: IOption): void {
        this.selectedStockVariant = { name: event.label, uniqueName: event.value };
        const stockEntry = this.vm.selectedLedger.transactions.find(transaction => transaction.inventory);
        const stockLinkedAcccount = stockEntry?.particular?.uniqueName?.split('#')?.shift();
        const eventDetails = {
            label: stockEntry?.particular?.name,
            value: stockEntry?.particular?.uniqueName,
            additional: {
                stock: stockEntry?.inventory?.stock,
                uniqueName: stockLinkedAcccount
            }
        };
        this.selectAccount(eventDetails, stockEntry, null, false, true);
    }

    /**
     * Loads the stock's variants
     *
     * @private
     * @param {string} stockUniqueName Stock uniquename
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private loadStockVariants(stockUniqueName: string): void {
        this.ledgerService.loadStockVariants(stockUniqueName).pipe(
            /**
             * Handles map functionality
             */
            map((variants: IVariant[]) => (Array.isArray(variants) ? variants : []).map((variant: IVariant) => ({ label: variant.name, value: variant.uniqueName }))), takeUntil(this.destroyed$)).subscribe(res => {
                this.stockVariants.next(res);
                this.changeDetectorRef.detectChanges();
            });
    }

    /**
     * Assign stock variant details based on length
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private assignStockVariantDetails(): void {
        this.stockVariants.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            /**
             * Handles if functionality
             */
            if (res?.length && res.findIndex(variant => variant.value === this.selectedStockVariant.uniqueName) === -1) {
                // Only reset the stock variant when the stock is changed
                this.selectedStockVariant = { name: res[0].label, uniqueName: res[0].value };
            }
        });
    }

    /**
     * Assigns the stock details
     *
     * @private
     * @param {IOption} event Stock select event
     * @param {ILedgerTransactionItem} txn Current transaction
     * @param {*} [requestObject] Additional request object to be provided to the API
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private assignStockDetails(event: IOption, txn: ILedgerTransactionItem, requestObject?: any): void {
        const currentLedgerCategory = this.activeAccount ? this.generalService.getAccountCategory(this.activeAccount, this.activeAccount?.uniqueName) : '';
        // If current ledger is of income or expense category then send current ledger unique name else send particular account unique name
        const accountUniqueName = event.additional?.stock && (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
            this.activeAccount ? this.activeAccount?.uniqueName : '' :
            event.additional?.uniqueName;
        this.searchService.loadDetails(accountUniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            // directly assign additional property
            /**
             * Handles if functionality
             */
            if (data && data.body) {
                // Take taxes of parent group and stock's own taxes
                const taxes = this.generalService.fetchTaxesOnPriority(
                    data.body.stock?.taxes ?? [],
                    data.body.stock?.groupTaxes ?? [],
                    data.body.taxes ?? [],
                    data.body.groupTaxes ?? []);
                txn.selectedAccount = {
                    ...(event ? event.additional : {}),
                    label: event?.label ?? txn.selectedAccount?.label ?? '',
                    value: event?.value ?? txn.selectedAccount?.label ?? '',
                    isHilighted: true,
                    applicableTaxes: taxes,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    email: data.body.emails,
                    isFixed: data.body.isFixed,
                    mergedAccounts: data.body.mergedAccounts,
                    mobileNo: data.body.mobileNo,
                    nameStr: data.body.parentGroups.join(', '),
                    stock: data.body.stock,
                    uNameStr: data.body.parentGroups.join(', '),
                    category: data.body.category
                };
                /**
                 * Handles if functionality
                 */
                if (txn?.selectedAccount && txn.selectedAccount.stock) {
                    txn.selectedAccount.stock.rate = Number((txn.selectedAccount.stock.rate / this.vm.selectedLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                }
                let rate = 0;
                let unitCode = '';
                let stockName = '';
                let stockUniqueName = '';
                let stockUnitUniqueName = '';
                const stockDetails = txn?.selectedAccount.stock;
                /**
                 * Handles if functionality
                 */
                if (txn?.selectedAccount && stockDetails) {
                    const variantUnitRates = txn.selectedAccount?.stock?.variant?.unitRates;
                    const defaultUnit = {
                        stockUnitCode: variantUnitRates[0].stockUnitCode,
                        code: variantUnitRates[0].stockUnitCode,
                        rate: variantUnitRates[0].rate,
                        name: stockDetails.name,
                        stockUnitUniqueName: variantUnitRates[0].stockUnitUniqueName
                    };
                    // For V1 company, the unitRates is obtained in 'stock' and for v2 company, unitRates is obtained in 'stock.variant'
                    const unitRates = variantUnitRates
                    txn.unitRate = unitRates.map(unitRate => ({ ...unitRate, code: unitRate.stockUnitCode }));
                    rate = defaultUnit.rate;
                    unitCode = defaultUnit.code;
                    stockUnitUniqueName = defaultUnit.stockUnitUniqueName;
                    rate = Number((rate / this.vm.selectedLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                    stockName = defaultUnit.name;
                    stockUniqueName = stockDetails?.uniqueName;

                    const matchedUnit = txn.selectedAccount.stock.variant?.unitRates?.filter(variantDiscount => variantDiscount?.stockUnitUniqueName === stockUnitUniqueName);
                    /**
                     * Handles if functionality
                     */
                    if (matchedUnit?.length && txn.selectedAccount.stock.variant?.variantDiscount?.discounts?.length) {
                        rate = Number((matchedUnit[0].rate / this.vm.selectedLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));

                        this.vm.discountArray = this.vm.discountArray?.map((item, index) => { if (index > 0) { item.isActive = false; } return item; });

                        txn.selectedAccount.stock.variant?.variantDiscount?.discounts?.forEach(variantDiscount => {
                            this.vm.discountArray = this.vm.discountArray?.map(item => {
                                /**
                                 * Handles if functionality
                                 */
                                if (variantDiscount?.discount?.uniqueName === item?.discountUniqueName) {
                                    item.isActive = true;
                                }
                                return item;
                            });
                        });
                    } else {
                        this.vm.discountArray = this.vm.discountArray?.map((item, index) => { if (index > 0) { item.isActive = false; } return item; });

                        /**
                         * Handles if functionality
                         */
                        if (this.accountOtherApplicableDiscount && this.accountOtherApplicableDiscount.length) {
                            (Array.isArray(this.accountOtherApplicableDiscount) ? this.accountOtherApplicableDiscount : []).forEach(element => {
                                this.vm.discountArray = this.vm.discountArray?.map(item => {
                                    /**
                                     * Handles if functionality
                                     */
                                    if (element?.uniqueName === item?.discountUniqueName) {
                                        item.isActive = true;
                                    }
                                    return item;
                                });
                            });
                        }
                    }
                }

                /**
                 * Handles if functionality
                 */
                if (stockName && stockUniqueName) {
                    txn.inventory = {
                        stock: {
                            name: stockName,
                            uniqueName: stockUniqueName,
                        },
                        variant: { name: txn.selectedAccount.stock.variant?.name, uniqueName: txn.selectedAccount.stock.variant?.uniqueName, variantDiscount: txn.selectedAccount.stock.variant?.variantDiscount },
                        quantity: 1,
                        unit: {
                            stockUnitCode: unitCode,
                            code: unitCode,
                            rate: rate,
                            stockUnitUniqueName,
                            uniqueName: stockUnitUniqueName,
                        },
                        amount: 0,
                        rate
                    };
                    // Stock item, show the warehouse & variant drop down
                    /**
                     * Handles if functionality
                     */
                    if (!this.isStockPresent) {
                        this.isStockPresent = true;
                    }
                    /**
                     * Handles if functionality
                     */
                    if (this.selectedStockUniquenName !== stockUniqueName) {
                        // Load variants only when stock changes
                        this.selectedStockUniquenName = stockUniqueName;
                        this.loadStockVariants(stockUniqueName);
                    }
                }
                /**
                 * Handles if functionality
                 */
                if (rate > 0) {
                    txn.amount = rate;
                }
                // check if need to showEntryPanel
                // first check with opened lager
                /**
                 * Handles if functionality
                 */
                if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                    this.vm.showNewEntryPanel = true;
                } else {
                    // now check if we transactions array have any income/expense/fixed assets entry
                    let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                    this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
                }
                const category = txn?.selectedAccount.category;
                /**
                 * Handles if functionality
                 */
                if (stockDetails && ((stockDetails.variant?.salesTaxInclusive && category === 'income') ||
                    (stockDetails.variant?.purchaseTaxInclusive && category === 'expenses') ||
                    (stockDetails.variant?.fixedAssetTaxInclusive && category === 'fixedassets'))) {
                    // Calculate inclusively
                    this.vm.isInclusiveTax = true;
                    this.vm.grandTotal = this.vm.stockTrxEntry.inventory.quantity * this.vm.stockTrxEntry.inventory.rate;
                    this.vm.inventoryTotalChanged();
                } else {
                    this.vm.isInclusiveTax = false;
                    this.vm.onTxnAmountChange(txn);
                }
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Shows create new discount dialog
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public showCreateDiscountDialog(): void {
        this.discountDialogRef = this.dialog.open(CreateDiscountComponent, ASIDE_PANE_CONFIG);

        this.discountDialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.getAllDiscounts();
            }
            this.discountDialogRef = undefined;
        });
    }

    /**
     * Get all discounts API call
     *
     * @private
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private getAllDiscounts(): void {
        this.settingsDiscountService.GetDiscounts().pipe(take(1)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountsList = response?.body;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Shows create new tax dialog
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public showCreateTaxDialog(): void {
        this.store.dispatch(this.settingsTaxesAction.CreateTaxResponse(null));
        this.taxAsideMenuRef = this.dialog.open(this.createTax, ASIDE_PANE_CONFIG);
    }

    /**
     * Close tax modal
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public closeTaxModal(): void {
        this.store.dispatch(this.companyActions.getTax());
        this.taxAsideMenuRef.close();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Handle event for next transaction
     *
     * @return {*}  {void}
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public moveToNextTransactions(): void {
        let nextIndex = this.index + 1;

        /**
         * Handles while functionality
         */
        while (nextIndex < this.transactionsList.length) {
            /**
             * Handles if functionality
             */
            if (this.transactionsList[nextIndex]?.entryUniqueName !== this.transaction?.entryUniqueName) {
                this.index = nextIndex;
                this.transaction = this.transactionsList[this.index];
                this.sliderRefreshData();
                this.isShowNoDataFound = false;
                return;
            }
            nextIndex++;
        }

        // If no valid next entry, show "No Data Found"
        this.index = this.transactionsList.length; // Move index out of bounds
        this.isShowNoDataFound = true;
        this.transaction = null;
        this.closeAll();
    }

    /**
     * Handle event for previous transactions
     *
     * @return {*}  {void}
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public moveToPreviousTransactions(): void {
        // If currently at "No Data Found" state and moving back, restore the last valid entry
        /**
         * Handles if functionality
         */
        if (this.isShowNoDataFound && this.index === this.transactionsList.length) {
            this.index = this.transactionsList.length - 1; // Move to last entry
            this.transaction = this.transactionsList[this.index];
            this.sliderRefreshData();
            this.isShowNoDataFound = false;
            return;
        }

        let prevIndex = this.index - 1;

        /**
         * Handles while functionality
         */
        while (prevIndex >= 0) {
            /**
             * Handles if functionality
             */
            if (this.transactionsList[prevIndex]?.entryUniqueName !== this.transaction?.entryUniqueName) {
                this.index = prevIndex;
                this.transaction = this.transactionsList[this.index];
                this.sliderRefreshData();
                this.isShowNoDataFound = false;
                return;
            }
            prevIndex--;
        }

        // If no valid previous entry, show "No Data Found"
        this.index = -1; // Move index out of bounds
        this.isShowNoDataFound = true;
        this.transaction = null;
        this.closeAll();
    }




    /**
     *This will be use for close all open dropdowns when user using keyboard shortcuts
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public closeAll(): void {
        /**
         * Handles if functionality
         */
        if (this.menuTrigger) {
            this.menuTrigger.closeMenu();
        }
        /**
         * Handles if functionality
         */
        if (this.autocompleteTrigger) {
            this.autocompleteTrigger.closePanel();
        }
        /**
         * Handles if functionality
         */
        if (this.matSelect) {
            this.matSelect.close();
        }

        /**
         * Handles if functionality
         */
        if (this.isDatepickerOpen) {
            const overlayElement = document.querySelector('.cdk-overlay-pane.mat-datepicker-popup');
            /**
             * Handles if functionality
             */
            if (overlayElement) {
                this.renderer.setStyle(overlayElement, 'display', 'none');
            }
        }
    }

    /**
     * This will be use for slider refresh transactions
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public sliderRefreshData(): void {
        // get entry name and ledger account uniqueName
        /**
         * Handles observableCombineLatest functionality
         */
        observableCombineLatest([this.entryUniqueName$, this.editAccUniqueName$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            /**
             * Handles if functionality
             */
            if (resp[0] && resp[1]) {
                this.entryUniqueName = this.transaction?.entryUniqueName;
                this.accountUniqueName = resp[1];
                this.store.dispatch(this.ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
            }
        });
    }

    /**
     * This maintains state of datepicker (open/closed)
     *
     * @param {*} event
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public datepickerState(event: any): void {
        this.isDatepickerOpen = event;
    }

    /**
     * This will be use for duplicate entry
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public duplicateEntry(): void {
        this.closeUpdateLedgerModal.emit({
            transactionDetails: this.transactionDetails
        });
    }

    /**
     * Open sales person dialog
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public openSalesPersonDialog(): void {
        const dialogRef = this.dialog.open(SalesPersonComponent, ASIDE_PANE_CONFIG);
        dialogRef.afterClosed().pipe(rxjsFilter(Boolean), take(1), tap(() => this.getSalesPersonList())).subscribe();
    }

    /**
     * Get sales person list as label value
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: API_BULK_FETCH_LIMIT } });
    }

    /**
    * Handle sales person selection
    *
    * @param {IOption} event
    * @memberof UpdateLedgerEntryPanelComponent
    */
    public handleSalesPersonSelection(event: IOption): void {
        let defaultSalesPerson: string;
        let isPartOfMultiEntryVoucher: boolean;
        this.selectedLedgerStream$.pipe(take(1)).subscribe(response => {
            defaultSalesPerson = response?.salesPerson?.uniqueName
            isPartOfMultiEntryVoucher = response?.isPartOfMultiEntryVoucher
        });

        /**
         * Handles if functionality
         */
        if (!isPartOfMultiEntryVoucher) {
            this.vm.selectedLedger.salesPerson.name = event?.label;
            this.vm.selectedLedger.salesPersonUniqueName = event?.value;
            return;
        }

        /**
         * Handles if functionality
         */
        if ((defaultSalesPerson === event?.value) || (this.vm.selectedLedger.salesPersonUniqueName === event?.value)) {
            return;
        }
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(
                    this.localeData?.change_salesperson_confirmation,
                    this.commonLocaleData
                )
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response === this.commonLocaleData?.app_yes) {
                this.vm.selectedLedger.salesPerson.name = event?.label;
                this.vm.selectedLedger.salesPersonUniqueName = event?.value;
            } else {
                const lastSalesPersonName = this.vm.selectedLedger.salesPerson.name;
                this.vm.selectedLedger.salesPerson.name = null;
                this.changeDetectorRef.detectChanges();
                this.vm.selectedLedger.salesPerson.name = lastSalesPersonName;
                this.vm.selectedLedger.salesPersonUniqueName = this.vm.selectedLedger.salesPersonUniqueName;
            }
        });
    }

    /**
     * Clear sales person
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    public clearSalesPerson(): void {
        this.vm.selectedLedger.salesPerson.name = null;
        this.vm.selectedLedger.salesPersonUniqueName = null;
    }

    /**
     * Reset sales person
     *
     * @memberof UpdateLedgerEntryPanelComponent
     */
    private resetSalesPerson(): any {
        return {
            name: '',
            uniqueName: '',
            email: null
        };
    }

    /**
     * Check if account is sundry debtor or creditor
     */
    private checkSundryDebtorCreditorStatus(accountData: any): void {
        /**
         * Handles if functionality
         */
        if (accountData?.body?.parentGroups?.length && ["sundrycreditors", "sundrydebtors"].includes(accountData?.body?.parentGroups[1]?.uniqueName)) {
            this.isSundryDebtorCreditor = true;
        } else {
            this.isSundryDebtorCreditor = false;
        }
    }

    /**
     * Update base account particular details and handle currency exchange
     */
    private updateBaseAccountParticular(resp: any[]): void {
        resp[0].particular = {
            category: resp[1].body?.category,
            name: resp[1].body?.name,
            currency: {
                code: resp[1].body?.currency,
                symbol: resp[1].body?.currencySymbol
            },
            parentGroups: resp[1].body?.parentGroups,
            uniqueName: resp[1].body?.uniqueName
        };

        resp[0].particularType = resp[1].body?.accountType;

        /**
         * Handles if functionality
         */
        if (resp[1].body?.currency !== resp[2]?.baseCurrency) {
            let date = dayjs().format(GIDDH_DATE_FORMAT);
            this.ledgerService.GetCurrencyRateNewApi(resp[1].body?.currency, resp[2]?.baseCurrency, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
                if (this.vm.selectedLedger) {
                    this.vm.selectedLedger.exchangeRate = response.body;
                }
            });
        }
    }

    /**
     * Setup active account and applicable discounts
     */
    private setupActiveAccountAndDiscounts(resp: any[]): void {
        // Special check for petty cash mode
        /**
         * Handles if functionality
         */
        if (this.isPettyCash) {
            /**
             * Handles if functionality
             */
            if (resp[0].othersCategory) {
                this.checkForOtherAccount();
            }
            this.prepareMultiCurrencyObject(this.activeAccount);
        }

        /**
         * Handles if functionality
         */
        if (this.activeAccount) {
            /**
             * Handles if functionality
             */
            if (this.activeAccount.currency && this.vm.isMultiCurrencyAvailable) {
                this.baseCurrency = this.activeAccount.currency;
            }

            this.accountOtherApplicableDiscount = [];

            /**
             * Handles if functionality
             */
            if (this.activeAccount.applicableDiscounts && this.activeAccount.applicableDiscounts.length) {
                this.accountOtherApplicableDiscount = this.activeAccount.applicableDiscounts;
            } else if (this.activeAccount.inheritedDiscounts && this.activeAccount.inheritedDiscounts.length && (!this.accountOtherApplicableDiscount || !this.accountOtherApplicableDiscount?.length)) {
                this.accountOtherApplicableDiscount.push(...this.activeAccount.inheritedDiscounts[0].applicableDiscounts);
            }
        }
    }
}
