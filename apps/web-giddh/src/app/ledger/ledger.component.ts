import { BankIntegrationDialogComponent } from './../shared/bank-integration/bank-integration-popup/bank-integration-popup.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, QueryList, signal, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LoginActions } from 'apps/web-giddh/src/app/actions/login.action';
import { SearchResultText, GIDDH_DATE_RANGE_PICKER_RANGES, RATE_FIELD_PRECISION, API_BULK_FETCH_LIMIT, PAGINATION_LIMIT, RESTRICTED_VOUCHERS_FOR_DOWNLOAD, AdjustedVoucherType, BROADCAST_CHANNELS, BranchHierarchyType, BREAKPOINT_SCREEN_SIZE, TCS_TDS_TAXES_TYPES, PAGE_SIZE_OPTIONS, ASIDE_PANE_CONFIG } from 'apps/web-giddh/src/app/app.constant';
import { PageEvent } from '@angular/material/paginator';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT_MM_DD_YYYY } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { createSelector } from 'reselect';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, take, takeUntil, tap, filter as rxjsFilter } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CompanyActions } from '../actions/company.actions';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { LoaderService } from '../loader/loader.service';
import { clone, cloneDeep, filter, find, map as lodashMap, uniq, uniqBy } from '../lodash-optimized';
import { AccountResponse, AccountResponseV2 } from '../models/api-models/Account';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ICurrencyResponse, TaxResponse } from '../models/api-models/Company';
import { DownloadLedgerRequest, TransactionsRequest, TransactionsResponse, ExportLedgerRequest, TLedgerView, LedgerViewEnum, LedgerType, TransactionType, LedgerResponse } from '../models/api-models/Ledger';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../models/api-models/Sales';
import { AdvanceSearchRequest } from '../models/interfaces/advance-search-request';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import { GeneralService } from '../services/general.service';
import { UiSettingsService } from '../services/ui-settings.service';
import { LedgerService } from '../services/ledger.service';
import { ToasterService } from '../services/toaster.service';
import { WarehouseActions } from '../settings/warehouse/action/warehouse.action';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../store';
import { NewLedgerEntryPanelComponent } from './components/new-ledger-entry-panel/new-ledger-entry-panel.component';
import { UpdateLedgerEntryPanelComponent } from './components/update-ledger-entry-panel/update-ledger-entry-panel.component';
import { BlankLedgerVM, LedgerVM, TransactionVM } from './ledger.vm';
import { download } from "@giddh-workspaces/utils";
import { SearchService } from '../services/search.service';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImportStatementComponent } from './components/import-statement/import-statement.component';
import { ExportLedgerComponent } from './components/export-ledger/export-ledger.component';
import { ShareLedgerComponent } from './components/share-ledger/share-ledger.component';
import { ConfirmModalComponent } from '../theme/new-confirm-modal/confirm-modal.component';
import { GenerateVoucherConfirmationModalComponent } from './components/generate-voucher-confirm-modal/generate-voucher-confirm-modal.component';
import { CommonService } from '../services/common.service';
import { AdjustmentUtilityService } from '../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { CommonActions } from '../actions/common.actions';
import { PageLeaveUtilityService } from '../services/page-leave-utility.service';
import { saveAs } from 'file-saver';
import { InstitutionsListComponent } from '../shared/bank-integration/institutions-list/institutions-list.component';
import { BankIntegrationComponentStore } from '../shared/bank-integration/utility/bank-integration.store';
import { HomeComponentStore } from '../home/home.store';
import { BankLinkComponent } from '../shared/bank-integration/bank-link/bank-link.component';
import { SettingIntegrationComponentStore } from '../settings/integration/utility/setting.integration.store';
import { NewConfirmationModalComponent } from '../theme/new-confirmation-modal/confirmation-modal.component';
import { EWayBillCreateComponent } from '../shared/eWayBill/create/e-way-bill-create-component';
import { LedgerComponentStore } from './ledger.store';
import { ServiceConfig } from '../services/service.config';
import { ReactiveDropdownFieldComponent } from '../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LedgerDiscountClass } from '../models/api-models/SettingsDiscount';
import { OtherTaxTypeEnum } from '../vouchers/utility/vouchers.const';
import { LedgerDropdownTypeEnum } from '../models/api-models/Ledger';
import { AccountingGroupEnum } from '../shared/Enums/common.enum';
import { IOption } from '../app.constant';
import { SettingsDiscountService } from '../services/settings.discount.service';

@Component({
    selector: 'ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.scss'],
    providers: [LedgerComponentStore, BankIntegrationComponentStore, HomeComponentStore, SettingIntegrationComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class LedgerComponent implements OnInit, OnDestroy {
    @ViewChild('updateledgercomponent', { static: false }) public updateledgercomponent: ElementViewContainerRef;
    @ViewChildren(ReactiveDropdownFieldComponent) public dropdowns: QueryList<ReactiveDropdownFieldComponent>;
    public imgPath: string = '';
    public lc: LedgerVM;
    public selectedInvoiceList: string[] = [];
    public accountInprogress$: Observable<boolean>;
    /** Holds the current blank ledger transaction */
    public activeAccount$: Observable<AccountResponse | AccountResponseV2>;
    public universalDate$: Observable<any>;
    public trxRequest: TransactionsRequest;
    public advanceSearchRequest: AdvanceSearchRequest;
    public isLedgerCreateSuccess$: Observable<boolean>;
    public needToReCalculate: BehaviorSubject<boolean> = new BehaviorSubject(false);
    @ViewChild('newLedPanel', { static: false }) public newLedgerComponent: NewLedgerEntryPanelComponent;
    /** Instance of advance search modal */
    @ViewChild('advanceSearchModal', { static: false }) public advanceSearchModal: any;
    /** Mobile datepicker trigger */
    @ViewChild('mobileUniversalDatepickerTrigger', { read: MatMenuTrigger }) public mobileUniversalDatepickerTrigger: MatMenuTrigger;
    /** iPad datepicker trigger */
    @ViewChild('ipadUniversalDatepickerTrigger', { read: MatMenuTrigger }) public ipadUniversalDatepickerTrigger: MatMenuTrigger;
    /** Desktop datepicker trigger */
    @ViewChild('desktopUniversalDatepickerTrigger', { read: MatMenuTrigger }) public desktopUniversalDatepickerTrigger: MatMenuTrigger;
    /** Holds of carousel template reference */
    @ViewChild('carousel', { static: false }) public carousel: TemplateRef<any>;
    /** Instance of entry confirmation modal */
    @ViewChild('entryConfirmModal', { static: false }) public entryConfirmModal: any;
    /** Instance of ledger aside pane modal */
    @ViewChild("ledgerAsidePane") public ledgerAsidePane: TemplateRef<any>;
    /** Instance of Aside Menu State For Other Taxes dialog */
    @ViewChild("asideMenuStateForOtherTaxes") public asideMenuStateForOtherTaxes: TemplateRef<any>;
    /** Holds Bank Integration dailog template reference */
    @ViewChild('bankIntegrationPopup', { static: true }) public bankIntegrationPopup: TemplateRef<any>;
    /** Holds update account dialog template reference */
    @ViewChild('updateAccount', { static: true }) public updateAccount: TemplateRef<any>;
    public isTransactionRequestInProcess$: Observable<boolean>;
    public ledgerBulkActionSuccess$: Observable<boolean>;
    public searchTermStream: Subject<string> = new Subject();
    public showLoader: boolean = false;
    public eLedgType: string;
    public eDrBalAmnt: number;
    public eCrBalAmnt: number;
    public isBankOrCashAccount: boolean;
    public failedBulkEntries$: Observable<string[]>;
    public isFileUploading: boolean = false;
    /** Boolean for tablet screen or not  */
    public isTabletScreen: boolean = true;
    public closingBalanceBeforeReconcile: { amount: number, type: string };
    public reconcileClosingBalanceForBank: { amount: number, type: string };
    public needToShowLoader: boolean = true;
    public entryUniqueNamesForBulkAction: string[] = [];
    public searchText: string = '';
    public isCompanyCreated$: Observable<boolean>;
    public debitSelectAll: boolean = false;
    public creditSelectAll: boolean = false;
    public debitCreditSelectAll: boolean = false;
    /** Holds true when all entries selected in statement view */
    public statementViewSelectAll: boolean = false;
    public isBankTransactionLoading: boolean = false;
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public selectedTrxWhileHovering: string;
    public checkedTrxWhileHovering: any[] = [];
    public ledgerTxnBalance: any = {};
    public isAdvanceSearchImplemented: boolean = false;
    public invoiceList: any[] = [];
    public keydownClassAdded: boolean = false;
    public isSelectOpen: boolean;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public profileObj: any;
    public createAccountIsSuccess$: Observable<boolean>;
    /** Observable to check if account is updated successfully */
    public updateAccountIsSuccess$: Observable<boolean>;
    public companyTaxesList: TaxResponse[] = [];
    public selectedTxnAccUniqueName: string = '';
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public tdsTcsTaxTypes: string[] = ['tcsrc', 'tcspay'];
    @ViewChild(UpdateLedgerEntryPanelComponent, { static: false }) public updateLedgerComponentInstance: UpdateLedgerEntryPanelComponent;
    public isLedgerAccountAllowsMultiCurrency: boolean = false;
    public baseCurrencyDetails: ICurrencyResponse;
    public foreignCurrencyDetails: ICurrencyResponse;
    public currencyTogglerModel: boolean = false;
    public selectedCurrency: 0 | 1 = 0;
    public isPrefixAppliedForCurrency: boolean = true;
    public selectedPrefixForCurrency: string;
    public selectedSuffixForCurrency: string;
    public inputMaskFormat: string;
    public giddhBalanceDecimalPlaces: number = 2;
    public activeAccountParentGroupsUniqueName: string = '';
    /** True, if RCM taxable amount needs to be displayed in create new ledger component as per criteria */
    public shouldShowRcmTaxableAmount: boolean;
    /** True, if ITC section needs to be displayed in create new ledger component as per criteria  */
    public shouldShowItcSection: boolean;
    /** True if company country will UAE and accounts involve Debtors/ Cash / bank / Sales */
    public isTouristSchemeApplicable: boolean;
    public allowParentGroup = ['sales', 'cash', 'sundrydebtors', 'bankaccounts'];
    public shareLedgerDates: any = {
        from: '',
        to: ''
    };
    /** True if columnar report show*/
    public isShowLedgerColumnarReportTable: boolean = false;
    /** Export ledger request object */
    public columnarReportExportRequest: ExportLedgerRequest;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores account unique name */
    public accountUniqueName: string;
    /** Transactions dates array */
    public allTransactionsList: any[] = [];
    public allTransactionDates: any[] = [];
    public Shown: boolean = true;
    public isHide: boolean = false;
    public visibleTransactionTypeMobile: string = "all";
    public ledgerTransactions: any;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerRanges: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Default search suggestion list to be shown for search */
    public defaultSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the search results pagination details */
    public searchResultsPaginationData = {
        page: 1,
        count: API_BULK_FETCH_LIMIT,
        query: ''
    };
    /** Stores the default search results pagination details (required only for passing
     * default search pagination details to Update ledger component) */
    public defaultResultsPaginationData = {
        page: 1,
        count: API_BULK_FETCH_LIMIT,
        query: '',
    };
    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;
    /** This will hold if it's default load */
    public isDefaultLoad: boolean = true;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** True if current organization type is company */
    public showBranchSwitcher: boolean;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** This will hold bank transactions api response */
    public bankTransactionsResponse: any = {
        totalItems: 0,
        totalPages: 0,
        page: 1,
        countPerPage: PAGINATION_LIMIT,
        creditTransactionsCount: 0,
        debitTransactionsCount: 0
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if user has ledger permission */
    public hasLedgerPermission: boolean = true;
    /** Dialog Ref for update ledger */
    public updateLedgerModalDialogRef: any;
    /** Instance of update ledger component */
    public updateLedgerComponentRef: any;
    /** Object of update ledger modal VM */
    public updateLedgerModalVm: any;
    /** True if datepicker is open */
    public isDatepickerOpen: boolean = false;
    /** Instance of advance search modal dialog */
    public advanceSearchDialogRef: any;
    /** Last touched transaction (for ipad and tablet) */
    public touchedTransaction: any;
    /** This is used to show hide bottom spacing when more detail is opened while CREATE/UPDATE ledger */
    public isMoreDetailsOpened: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Selected entry details */
    public selectedItem: any;
    /** Enum for dropdown types - exposed to template */
    public ledgerDropdownTypeEnum = LedgerDropdownTypeEnum;
    /** Pagination Object */
    public paginationObject: any = {
        totalItems: 0,
        itemsPerPage: 0,
        page: 1,
        totalPages: 0,
        showPagination: false,
        prevToken: null,
        nextToken: null
    };
    /** Holds restricted voucher types for download */
    public restrictedVouchersForDownload: any[] = RESTRICTED_VOUCHERS_FOR_DOWNLOAD;
    /** Holds side of entry (dr/cr) */
    public entrySide: string = "";
    /** This will show/hide for v2 for autopaid if ledger account is sundrydebtor and sundrycreditor*/
    public enableAutopaid: boolean = false;
    /** Selected account details to load the details after variant is selected */
    public selectedAccountDetails: IOption;
    /** Selected stock variant passed down to new-ledger-entry-panel, reset on account change */
    public selectedStockVariant: IOption = { label: '', value: '' };
    /** True, if the total was changed explicitly by the user in case of inclusive tax */
    public isTotalChanged: boolean;
    /* Observable to check if account prediction api call has completed */
    private accountPredictionSubject: Subject<boolean> = new Subject();
    /** Holds if we need bank ledger popup to be hidden */
    private isHideBankLedgerPopup: boolean = false;
    /** Ledger aside pan modal */
    public ledgerAsidePaneDialogRef: any;
    /** Total pages for reference vouchers */
    public referenceVouchersTotalPages: number = 1;
    /** Returns true if account is selected else false */
    public get showPageLeaveConfirmation(): boolean {
        let hasParticularSelected = this.lc.blankLedger.transactions?.filter(txn => txn?.particular);
        return (hasParticularSelected?.length) ? true : false;
    }
    /** Holds Aside Menu State For Other Taxes DialogRef */
    public asideMenuStateForOtherTaxesDialogRef: any;
    /** Holds true if branch is select in company mode */
    public isBranchTransactionSelected: boolean = false;
    /** Holds Invoice Setting for auto Generate Voucher From Entry */
    public autoGenerateVoucherFromEntryStatus: boolean;
    public bankAccount: any = {
        reLoginRequired: false,
        itemId: '',
        gocardlessMessage: ''
    };
    /** True if ledger account belongs to sundry debtor/creditor */
    private isSundryDebtorCreditor: boolean = false;
    /** True if need to generate einvoice in case of update ledger entry */
    public generateEInvoice: boolean = null;
    /** Holds response of bulk generate popup */
    private isCombined: boolean = null;
    /** Duplicate copy of entry unique names for bulk action variable */
    public entryUniqueNamesForBulkActionDuplicateCopy: string[] = [];
    /** False if there is no data in account search */
    public isAccountSearchData: boolean = true;
    /** Set of selected debit transaction IDs.*/
    public selectedDebitTransactionIds = new Set<string>();
    /**  Set of selected credit transaction IDs.*/
    public selectedCreditTransactionIds = new Set<string>();
    /** String representing the selected bank transaction while hovering. */
    public selectedBankTrxWhileHovering: string;
    /** Holds transaction count convert to entries */
    public transactionCountConvertToEntries: number = null;
    /** Holds bank transactions account name */
    private bankTransactionsWithAccountName: any[] = [];
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Hold reference number */
    public referenceNumber: string = null;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True, if is integration module are in scope  */
    public hasIntegrationScope: boolean = false;
    /** Holds true if current company country is gocardless supported country */
    public isGocardlessSupportedCountry: boolean;
    /** Holds Store Requisition API success state as observable*/
    public requisitionList$: Observable<any> = this.componentStore.select(state => state.requisitionList);
    /** Holds Store refresh bank success message as observable*/
    private bankMessage$: Observable<any> = this.homeComponentStore.select(state => state.bankMessage);
    /** Holds Store refresh bank loading as observable*/
    public isBankRefreshing$: Observable<any> = this.homeComponentStore.select(state => state.isBankRefreshing);
    /** Holds Store refresh bank error as observable */
    public isBankRefreshingError$: Observable<any> = this.homeComponentStore.select(state => state.isBankRefreshingError);
    /** True if active account is bank account */
    public isBankAccountConnected: boolean = null;
    /** Holds accountUniquename of get all bank-Account  */
    public selectedAccountUniquename: any;
    /** Holds the bank account which is not linked */
    public unlinkBankList: any[] = [];
    /** Holds list of connected banks */
    private bankList: any[] = [];
    /** Invoice Settings */
    public invoiceSettings: any;
    /** Hold ledger grid total columns static value */
    public ledgerGridTotalColumns: number = 4;
    /** Hold ledger grid total columns value */
    public ledgerGridColumnsValue: number[] = [1, 2, 1];
    /** Store ledger account response */
    public ledgerAccountResponse: AccountResponse | AccountResponseV2;
    /** Observable for post balance success response */
    public ledgerBalanceSuccess$: Observable<boolean> = this.ledgerComponentStore.select(state => state.ledgerBalance);
    /** Hold callback broadcast event */
    public callBackBroadcast: any;
    /** Holds Bank Integration Dialog Ref */
    public bankIntegrationDialogRef: any;
    /** Holds if use directly integrated bank account*/
    public isDirectlyIntegrated: boolean = false;
    /** Hold Transaction Object */
    public entryTransactionData: any = {
        transaction: null,
        index: null,
        transactionsList: null
    };
    /** Holds carousel previous event*/
    public carouselPrevious: boolean;
    /** Holds carousel next event*/
    public carouselNext: boolean;
    /** Holds ledger view */
    public ledgerView: TLedgerView | null = null;
    /** Holds ledger view enum */
    public ledgerViewEnum: typeof LedgerViewEnum = LedgerViewEnum;
    /** Hold ledger grid total columns value */
    public ledgerStatementViewGridColumnsValue: number[] = [1, 3, 2, 2, 3];
    /** Hold ledger grid total columns static value */
    public ledgerStatementViewGridTotalColumns: number = this.getLedgerStatementViewGridTotalColumns();
    /** True if update account is bank account */
    public isUpdateAccount: boolean = false;
    /** Holds transaction type */
    public transactionType: typeof TransactionType = TransactionType;
    /** Holds breakpoint screen size */
    public breakpointScreenSize: { mediumDesktopScreen: boolean, smallDesktopScreen: boolean, tabScreen: boolean } = {
        mediumDesktopScreen: false,
        smallDesktopScreen: false,
        tabScreen: false
    };
    /** Holds Update Account Dialog Ref */
    public updateAccountDialogRef: MatDialogRef<any>;
    /** True if particular currency differs from account currency, even when account and company currencies are same. */
    public particularMultiCurrency: boolean = false;
    /** To clear the dropdown list */
    public forceClear$: BehaviorSubject<boolean | null> = new BehaviorSubject(null);
    /** Tracks if account unique name should be shown in dropdowns */
    public showAccountUniqueName: boolean = false;
    /** List of discounts */
    public discountsList = signal<any[]>([]);

    constructor(
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private ledgerActions: LedgerActions,
        private route: ActivatedRoute,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private uiSettingsService: UiSettingsService,
        private loginActions: LoginActions,
        private loaderService: LoaderService,
        private warehouseActions: WarehouseActions,
        private cdRf: ChangeDetectorRef,
        private searchService: SearchService,
        private settingsBranchAction: SettingsBranchActions,
        private zone: NgZone,
        public dialog: MatDialog,
        private commonService: CommonService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private invoiceAction: InvoiceActions,
        private commonAction: CommonActions,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private router: Router,
        private settingIntegrationComponentStore: SettingIntegrationComponentStore,
        private componentStore: BankIntegrationComponentStore,
        private homeComponentStore: HomeComponentStore,
        private ledgerComponentStore: LedgerComponentStore,
        private breakpointObserver: BreakpointObserver,
        private settingsDiscountService: SettingsDiscountService
    ) {
        if (window.localStorage) {
            localStorage.setItem('refNo', null);
        }
        this.lc = new LedgerVM();
        this.advanceSearchRequest = new AdvanceSearchRequest();
        this.trxRequest = new TransactionsRequest();
        this.lc.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
        this.accountInprogress$ = this.store.pipe(select(p => p.ledger.accountInprogress), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
        this.updateAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.updateAccountIsSuccess), takeUntil(this.destroyed$));
        this.lc.transactionData$ = this.store.pipe(select(p => p.ledger.transactionsResponse), takeUntil(this.destroyed$), shareReplay(1));
        this.isLedgerCreateSuccess$ = this.store.pipe(select(p => p.ledger.ledgerCreateSuccess), takeUntil(this.destroyed$));
        this.lc.companyProfile$ = this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.isTransactionRequestInProcess$ = this.store.pipe(select(p => p.ledger.transactionInprogress), takeUntil(this.destroyed$));
        this.ledgerBulkActionSuccess$ = this.store.pipe(select(p => p.ledger.ledgerBulkActionSuccess), takeUntil(this.destroyed$));
        this.isCompanyCreated$ = this.store.pipe(select(s => s.session.isCompanyCreated), takeUntil(this.destroyed$));
        this.failedBulkEntries$ = this.store.pipe(select(p => p.ledger.ledgerBulkActionFailedEntries), takeUntil(this.destroyed$));
        this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(null));
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
    }
    /** True if active account is bank account */
    public get isBankAccount(): boolean {
        return this.lc.activeAccount?.parentGroups?.some(group => group.uniqueName === 'bankaccounts');
    }

    public toggleShow() {
        this.Shown = this.Shown ? false : true;
        this.isHide = this.isHide ? false : true;
    }

    public selectCompoundEntry(txn: ITransactionItem) {
        this.lc.currentBlankTxn = null;
        this.lc.currentTxn = txn;
        this.lc.selectedTxnUniqueName = txn.entryUniqueName;
    }

    public selectBlankTxn(txn: TransactionVM) {
        this.lc.currentTxn = null;
        this.lc.currentBlankTxn = txn;
        this.lc.selectedTxnUniqueName = txn ? txn.id : null;
    }

    public selectedDate(value: any) {
        this.selectedRangeLabel = "";
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);

        this.needToShowLoader = false;
        let from = dayjs(value.startDate, GIDDH_DATE_FORMAT).toDate();
        let to = dayjs(value.endDate, GIDDH_DATE_FORMAT).toDate();

        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
            page: 1,
            dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                bsRangeValue: [from, to]
            })
        });
        this.trxRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
        this.trxRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        this.todaySelected = true;
        this.lc.blankLedger.entryDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);

        if (this.isAdvanceSearchImplemented) {
            this.createLedgerBalance();
            this.store.dispatch(this.ledgerActions.doAdvanceSearch(cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, this.trxRequest.from, this.trxRequest.to, this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q, this.advanceSearchRequest.branchUniqueName));
        } else {
            this.getTransactionData();
        }
        // Después del éxito de la entrada. llamar para transacciones bancarias
        this.lc.activeAccount$.pipe(take(1)).subscribe((data: AccountResponse) => {
            this.getBankTransactions();
        });
    }

    /**
     * Create ledger balance
     *
     * @param {boolean} [resetSearch=false]
     * @memberof LedgerComponent
     */
    public createLedgerBalance(resetSearch: boolean = false): void {
        if (resetSearch) {
            // Reset Search in case of Advance Search
            this.searchText = '';
            this.trxRequest.q = '';
        }
        this.ledgerComponentStore.getLedgerBalance({
            payload: this.generalService.replaceSelectedAllOptions(this.advanceSearchRequest.dataToSend, true),
            trxRequest: { ...this.trxRequest, from: dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT), to: dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) }
        });
    }

    public selectAccount(e: IOption, txn: TransactionVM, clearAccount?: boolean, isBankTransaction?: boolean, allowChangeDetection?: boolean, transactionType?: string) {
        this.keydownClassAdded = false;
        this.selectedTxnAccUniqueName = '';
        this.selectedAccountDetails = e;
        this.selectedStockVariant = { label: '', value: '' };
        if (!e?.value || clearAccount) {
            if (clearAccount) {
                this.getTransactionCountConvertToEntries(txn);
            } else {
                this.getTransactionCountConvertToEntries();
            }
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            this.lc.currentBlankTxn = null;
            if (!isBankTransaction) {
                txn.amount = 0;
                txn.total = 0;
                // reset taxes and discount on selected account change
                txn.tax = 0;
                txn.taxes = [];
                txn.discount = 0;
                txn.discounts = [
                    this.lc.staticDefaultDiscount()
                ];
            }
            txn.particular = undefined;
            return;
        }

        txn.isStock = Boolean(e.additional?.stock);
        txn.stockUniqueName = e.additional?.stock?.uniqueName;
        txn.oppositeAccountUniqueName = e.additional?.uniqueName;
        if (txn.duplicateEntry) {
            this.handeLoadDetailsForDuplicateEntry(e, txn);
        } else if (!txn.isStock) {
            this.loadDetails(e, txn, '', allowChangeDetection, isBankTransaction, transactionType);
        }
        this.cdRf.markForCheck();
    }

    public hideEledgerWrap() {
        this.lc.showEledger = false;
        this.entryUniqueNamesForBulkAction = [];
    }

    /**
   * This function will use for get institutions details
   *
   * @param {*} element
   * @memberof LedgerComponent
   */
    public openInstitutionsDialog(): void {
        const data = {
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        }
        const dialogRef = this.dialog.open(InstitutionsListComponent, {
            data: data,
            panelClass: ['subscription-sidebar', 'mat-dialog-md'],
            role: 'alertdialog',
            ariaLabel: 'institutionsListDialog'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                localStorage.setItem('refNo', response);
                this.referenceNumber = cloneDeep(response);
            }
        });
    }

    public ngOnInit() {
        this.showAccountUniqueName = this.uiSettingsService.getShowAccountUniqueName();

        /* Here, we filtered the pagination size to a maximum of 50 to avoid performance issues. */
        this.pageSizeOptions = this.pageSizeOptions.filter(size => size <= 50);
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.requisitionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.router.url.includes('ledger') && this.lc.accountUnq) {
                this.getAllBankAccounts(this.lc.accountUnq);
                this.isDirectlyIntegrated = true;
                this.componentStore.setState(state => ({
                    ...state,
                    requisitionList: null
                }));
            }
        });

        this.callBackBroadcast = new BroadcastChannel("call-back-subscription");
        this.callBackBroadcast.onmessage = (event) => {
            if (event?.data?.success) {
                const referNo = localStorage.getItem('refNo');
                if (referNo !== null && referNo !== undefined) {
                    setTimeout(() => {
                        this.componentStore.getRequisition(referNo);
                    }, 100);
                }
            }
        };

        if (this.generalService.voucherApiVersion === 2) {
            this.lc.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(ledgerAccount => {
                this.ledgerAccountResponse = ledgerAccount;
                if (ledgerAccount?.parentGroups?.length && ["sundrycreditors", "sundrydebtors"].includes(ledgerAccount?.parentGroups[1]?.uniqueName)) {
                    this.enableAutopaid = true;
                    this.isSundryDebtorCreditor = true;
                } else {
                    this.enableAutopaid = false;
                    this.isSundryDebtorCreditor = false;
                }
            });
        } else {
            this.enableAutopaid = false;
        }

        if (!this.generalService.checkIfCssExists("./assets/styles/ledgerfont/ledgerfont.css")) {
            this.generalService.addLinkTag("./assets/styles/ledgerfont/ledgerfont.css");
        }
        document.querySelector('body').classList.add('ledger-body');

        if (this.generalService.voucherApiVersion === 2) {
            this.allowParentGroup.push("loanandoverdraft");
        }

        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        // get company taxes
        this.store.dispatch(this.companyActions.getTax());
        // reset redirect state from login action
        this.store.dispatch(this.loginActions.ResetRedirectToledger());
        this.store.dispatch(this.invoiceAction.getInvoiceSetting());
        this.getPurchaseSettings();

        this.imgPath = this.serviceConfig.IMG_PATH;
        this.currentOrganizationType = this.generalService.currentOrganizationType;

        this.breakpointObserver.observe([
            BREAKPOINT_SCREEN_SIZE.SMALL_DESKTOP,
            BREAKPOINT_SCREEN_SIZE.MEDIUM_DESKTOP,
            BREAKPOINT_SCREEN_SIZE.TABLET
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                // Reset all breakpoint screen size
                Object.keys(this.breakpointScreenSize).forEach(key => {
                    this.breakpointScreenSize[key] = false;
                });
                this.isTabletScreen = result.breakpoints[BREAKPOINT_SCREEN_SIZE.TABLET];
                if (result.breakpoints[BREAKPOINT_SCREEN_SIZE.SMALL_DESKTOP]) {
                    this.breakpointScreenSize.smallDesktopScreen = true;
                    this.ledgerGridTotalColumns = 3
                    this.ledgerGridColumnsValue = [1, 1, 1]
                    this.getLedgerStatementViewGridColumnsValue();
                } else if (result.breakpoints[BREAKPOINT_SCREEN_SIZE.MEDIUM_DESKTOP]) {
                    this.breakpointScreenSize.mediumDesktopScreen = true;
                    this.ledgerGridTotalColumns = 8;
                    this.ledgerGridColumnsValue = [2, 3, 3]
                    this.getLedgerStatementViewGridColumnsValue();
                } else if (result.breakpoints[BREAKPOINT_SCREEN_SIZE.TABLET]) {
                    this.arrangeLedgerTransactionsForMobile();
                } else {
                    this.ledgerGridTotalColumns = 4
                    this.ledgerGridColumnsValue = [1, 2, 1]
                    this.getLedgerStatementViewGridColumnsValue();
                }
                this.cdRf.detectChanges();
            }
        });
        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        if (this.currentOrganizationType === OrganizationType.Company || this.isConsolidatedBranch) {
            this.showBranchSwitcher = true;
            this.currentCompanyBranches$.subscribe(response => {
                if (response && response.length) {
                    this.currentCompanyBranches = response.map(branch => ({
                        label: branch?.name,
                        value: branch?.uniqueName,
                        name: branch?.name,
                        parentBranch: branch?.parentBranch,
                        consolidatedBranch: branch?.consolidatedBranch
                    }));
                    this.currentCompanyBranches.unshift({
                        label: this.activeCompany ? this.activeCompany.name : '',
                        name: this.activeCompany ? this.activeCompany.name : '',
                        value: this.activeCompany ? this.activeCompany.uniqueName : '',
                        isCompany: true
                    });
                    let currentBranchUniqueName;
                    if (!this.currentBranch?.uniqueName) {
                        // Assign the current branch only when it is not selected. This check is necessary as
                        // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                        // branches are loaded
                        if (this.currentOrganizationType === OrganizationType.Branch) {
                            currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                            this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                        } else {
                            currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                            this.currentBranch = {
                                name: this.activeCompany ? this.activeCompany.name : '',
                                alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                                uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                            };
                        }
                    }
                    this.trxRequest.branchUniqueName = this.currentBranch?.uniqueName;
                    this.advanceSearchRequest.branchUniqueName = this.currentBranch?.uniqueName;
                    if (this.currentOrganizationType === OrganizationType.Branch ||
                        (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) {
                        // Add the blank transaction only if it is branch mode or company with single branch
                        this.setBlankLedgerTransactions();
                    }
                } else {
                    if (this.generalService.companyUniqueName) {
                        // Avoid API call if new user is onboarded
                        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                    }
                }
            });
        } else {
            this.showBranchSwitcher = false;
        }
        this.shouldShowItcSection = false;
        this.shouldShowRcmTaxableAmount = false;
        observableCombineLatest([this.universalDate$, this.route.params, this.todaySelected$]).pipe(debounceTime(500), takeUntil(this.destroyed$)).subscribe((resp: any[]) => {

            if (!Array.isArray(resp[0])) {
                return;
            }
            if (this.advanceSearchRequest) {
                this.resetAdvanceSearch();
            }
            this.resetPreviousSearchResults();
            this.hideEledgerWrap();
            let dateObj = resp[0];
            let params = resp[1];
            this.todaySelected = resp[2];

            // check if params have from and to, this means ledger has been opened from other account-details-component
            if (params['from'] && params['to'] && this.isDefaultLoad) {
                let from = params['from'];
                let to = params['to'];
                // Set date range to component date picker
                let dateRange = { fromDate: '', toDate: '' };
                dateRange = this.generalService.dateConversionToSetComponentDatePicker(from, to);
                this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
                this.selectedDateRangeUi = dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                    dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                        bsRangeValue: [dayjs(from, GIDDH_DATE_FORMAT).toDate(), dayjs(to, GIDDH_DATE_FORMAT).toDate()]
                    })
                });
                this.advanceSearchRequest.to = to;
                this.advanceSearchRequest.page = 1;

                this.trxRequest.from = from;
                this.trxRequest.to = to;
                this.trxRequest.page = 1;
                this.isDefaultLoad = false;
            } else {
                // means ledger is opened normally
                if (dateObj && !this.todaySelected) {
                    let universalDate = cloneDeep(dateObj);

                    this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                    this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: [dayjs(universalDate[0], GIDDH_DATE_FORMAT).toDate(), dayjs(universalDate[1], GIDDH_DATE_FORMAT).toDate()]
                        })
                    });
                    this.advanceSearchRequest.to = universalDate[1];
                    this.advanceSearchRequest.page = 1;

                    this.trxRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.trxRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.trxRequest.page = 1;
                } else {
                    this.selectedDateRange = { startDate: dayjs(), endDate: dayjs() };
                    this.selectedDateRangeUi = dayjs().format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs().format(GIDDH_NEW_DATE_FORMAT_UI);

                    // set advance search bsRangeValue to blank, because we are depending api to give us from and to date
                    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: []
                        })
                    });
                    this.advanceSearchRequest.page = 1;
                    this.trxRequest.page = 1;

                    // set request from and to, '' because we are depending on api to give us from and to date
                    this.advanceSearchRequest.to = '';
                    this.trxRequest.from = '';
                    this.trxRequest.to = '';
                }
            }

            this.currencyTogglerModel = false;
            if (params['accountUniqueName']) {
                this.isShowLedgerColumnarReportTable = false;
                this.lc.accountUnq = params['accountUniqueName'];
                if (this.isBankAccount) {
                    this.getAllBankAccounts(params['accountUniqueName']);
                }
                this.needToShowLoader = true;
                this.searchText = '';
                this.trxRequest.paginationToken = '';
                this.resetBlankTransaction();

                this.isCompanyCreated$.pipe(take(1)).subscribe(s => {
                    if (!s) {
                        this.store.dispatch(this.ledgerActions.GetLedgerAccount(this.lc.accountUnq));
                        if (this.trxRequest && this.trxRequest.q) {
                            this.trxRequest.q = null;
                        }
                        this.initTrxRequest(params['accountUniqueName']);
                    }
                });
                this.store.dispatch(this.ledgerActions.setAccountForEdit(this.lc.accountUnq));
                this.creditSelectAll = false;
                this.debitSelectAll = false;
                this.debitCreditSelectAll = false;
            }
        });

        this.isTransactionRequestInProcess$.subscribe((s: boolean) => {
            if (this.needToShowLoader) {
                this.showLoader = clone(s);
            } else {
                this.showLoader = false;
            }
        });

        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.lc.currencies = res;
            }
        });

        this.settingIntegrationComponentStore.updateAccount$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.isBankAccountConnected = true;
                this.isUpdateAccount = true;
                this.getAllBankAccounts();
                this.getBankTransactions()
                this.cdRf.detectChanges();
            }
        });

        this.lc.transactionData$.pipe(takeUntil(this.destroyed$)).subscribe((lt: any) => {
            if (lt) {
                // set date picker to and from date, as what we got from api in case of today selected from universal date
                if (lt.from && lt.to && this.todaySelected) {
                    let dateRange = { fromDate: '', toDate: '' };
                    dateRange = this.generalService.dateConversionToSetComponentDatePicker(lt.from, lt.to);
                    this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
                    this.selectedDateRangeUi = dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
                }

                this.ledgerTransactions = lt;

                if (this.isTabletScreen) {
                    this.arrangeLedgerTransactionsForMobile();
                }

                if (lt.periodClosingBalance) {
                    this.closingBalanceBeforeReconcile = lt.periodClosingBalance;
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === TransactionType.Credit ? this.localeData?.cr : this.localeData?.dr;
                }
                if (lt.closingBalanceForBank) {
                    this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
                    this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === TransactionType.Credit ? this.localeData?.cr : this.localeData?.dr;
                }
                let checkedEntriesName: any[];
                if (this.ledgerView === LedgerViewEnum.TView) {
                    const debitTransactions = lt.debitTransactions ?? [];
                    const creditTransactions = lt.creditTransactions ?? [];
                    const debitEntries = Array.isArray(debitTransactions) ? debitTransactions.filter(debitTransaction => debitTransaction.isChecked).map(debitTransaction => ({ uniqueName: debitTransaction.entryUniqueName, type: 'debit' })) : [];
                    const creditEntries = Array.isArray(creditTransactions) ? creditTransactions.filter(creditTransaction => creditTransaction.isChecked).map(creditTransaction => ({ uniqueName: creditTransaction.entryUniqueName, type: 'credit' })) : [];
                    checkedEntriesName = uniq([
                        ...debitEntries,
                        ...creditEntries,
                    ]);
                } else {
                    const debitCreditEntries = (Array.isArray(lt?.debitCreditTransactions) ? lt.debitCreditTransactions : []).filter(f => f.isChecked).map(dt => ({ uniqueName: dt.entryUniqueName, type: dt.type }));
                    checkedEntriesName = uniq([
                        ...debitCreditEntries
                    ]);
                }

                if (checkedEntriesName && checkedEntriesName.length) {
                    (Array.isArray(checkedEntriesName) ? checkedEntriesName : []).forEach(f => {
                        let duplicate = this.checkedTrxWhileHovering.some(s => s?.uniqueName === f?.uniqueName);
                        if (!duplicate) {
                            this.checkedTrxWhileHovering.push(f);
                        }
                    });
                } else {
                    this.checkedTrxWhileHovering = [];
                }

                let failedEntries: string[] = [];
                this.failedBulkEntries$.pipe(take(1)).subscribe(ent => failedEntries = ent);

                if (failedEntries && failedEntries.length > 0) {
                    this.store.dispatch(this.ledgerActions.SelectGivenEntries(failedEntries));
                }
                this.lc.currentPage = lt.page;
                if (this.isAdvanceSearchImplemented) {
                    this.lc.calculateReckonging(lt);
                }
                setTimeout(() => {
                    this.paginationObject = {
                        totalItems: lt.totalPages * lt.count,
                        itemsPerPage: lt.count,
                        page: lt.page,
                        totalPages: lt.totalPages,
                        showPagination: (lt.totalPages > 1) ? true : false,
                        prevToken: lt.prevToken,
                        nextToken: lt.nextToken
                    };

                    if (!this.cdRf['destroyed']) {
                        this.cdRf.detectChanges();
                    }
                }, 400);
            }
        });

        this.store.pipe(
            select(p => p.ledger.ledgerTransactionsBalance),
            takeUntil(this.destroyed$)
        ).subscribe((txnBalance: any) => {
            if (txnBalance && !this.isAdvanceSearchImplemented) {
                this.ledgerTxnBalance = txnBalance;
                this.lc.calculateReckonging(txnBalance);
                this.cdRf.detectChanges();
            }
        });

        this.ledgerBalanceSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response) {
                Object.assign(this.ledgerTxnBalance, response);
            }
        });

        this.isLedgerCreateSuccess$.subscribe(s => {
            if (s) {
                this.generateEInvoice = null;
                this.toaster.showSnackBar("success", this.localeData?.entry_created, this.commonLocaleData?.app_success);
                this.lc.showNewLedgerPanel = false;
                this.lc.showBankLedgerPanel = false;
                this.needToReCalculate.next(false);
                if (this.isAdvanceSearchImplemented) {
                    this.getAdvanceSearchTxn();
                } else {
                    this.getTransactionData();
                }
                this.resetBlankTransaction();
                this.resetPreviousSearchResults();
                this.transactionCountConvertToEntries = null;
                this.bankTransactionsWithAccountName = [];
                // After the success of the entrance call for bank transactions
                this.lc.activeAccount$.pipe(take(1)).subscribe((data: AccountResponse) => {
                    this.loaderService.show();
                    this.getBankTransactions();
                });
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            }
        });

        this.searchTermStream.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
            .subscribe(term => {
                const searchCleared = (this.trxRequest.q && !term);
                this.trxRequest.q = term;
                this.trxRequest.page = 1;
                this.needToShowLoader = false;
                if (term || this.trxRequest.q || searchCleared) {
                    this.trxRequest.paginationToken = "";
                    this.getTransactionData();
                    this.getLedgerStatementViewGridColumnsValue();
                }
            });

        this.store.pipe(select(createSelector([(st: AppState) => st.general.addAndManageClosed], (yesOrNo: boolean) => {
            if (yesOrNo) {
                this.getTransactionData();
            } else if (this.trxRequest?.accountUniqueName) {
                this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));
            }
        })), debounceTime(300), takeUntil(this.destroyed$)).subscribe();

        this.ledgerBulkActionSuccess$.subscribe((yes: boolean) => {
            if (yes) {
                this.entryUniqueNamesForBulkAction = [];
                if (this.isAdvanceSearchImplemented) {
                    this.getAdvanceSearchTxn();
                } else {
                    this.getTransactionData();
                }
            }
        });

        this.store.pipe(select(state => state.ledger.showBulkGenerateVoucherConfirmation), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.message) {
                this.store.dispatch(this.ledgerActions.setBulkGenerateConfirm(null));

                let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    data: {
                        title: this.commonLocaleData?.app_confirm,
                        body: response?.message,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no,
                        permanentlyDeleteMessage: ' ',
                    },
                    role: 'alertdialog',
                    ariaLabel: 'confirmation'
                });

                dialogRef.afterClosed().subscribe(response => {
                    if (typeof response === "boolean") {
                        this.entryUniqueNamesForBulkAction = cloneDeep(this.entryUniqueNamesForBulkActionDuplicateCopy);
                        if (response) {
                            this.onSelectInvoiceGenerateOption(this.isCombined, true);
                        } else {
                            this.onSelectInvoiceGenerateOption(this.isCombined, false);
                        }
                    }
                });
            }
        });

        this.store.pipe(select(s => s.company && s.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });

        this.store.pipe(select(appState => appState.ledger.hasLedgerPermission), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasLedgerPermission = response;
            this.cdRf.detectChanges();
        });

        this.store.pipe(select(state => state.ledger.showDuplicateVoucherConfirmation), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "confirm") {
                let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    data: {
                        title: this.commonLocaleData?.app_confirm,
                        body: response?.message,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no,
                        permanentlyDeleteMessage: ' ',
                    },
                    role: 'alertdialog',
                    ariaLabel: 'confirmation'
                });

                dialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this.confirmMergeEntry();
                    } else {
                        this.cancelMergeEntry();
                    }
                });
            } else if (response?.status === "einvoice-confirm") {
                let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    data: {
                        title: this.commonLocaleData?.app_confirm,
                        body: response?.message,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no,
                        permanentlyDeleteMessage: ' ',
                    },
                    role: 'alertdialog',
                    ariaLabel: 'confirmation'
                });

                dialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        if (this.updateLedgerModalDialogRef && this.dialog.getDialogById(this.updateLedgerModalDialogRef.id)) {
                            this.generateEInvoice = true;
                        } else {
                            this.confirmEInvoiceEntry(true);
                        }
                    } else {
                        if (this.updateLedgerModalDialogRef && this.dialog.getDialogById(this.updateLedgerModalDialogRef.id)) {
                            this.generateEInvoice = false;
                        } else {
                            this.confirmEInvoiceEntry(false);
                        }
                    }
                });
            }
        });
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        this.accountPredictionSubject.pipe(debounceTime(2000), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isHideBankLedgerPopup = false;
                this.cdRf.detectChanges();
            }
        });

        const broadcast = new BroadcastChannel("tabs");
        broadcast.onmessage = (event) => {
            if (event?.data?.autoGenerateVoucherFromEntry !== undefined && event?.data?.autoGenerateVoucherFromEntry !== null) {
                this.store.dispatch(this.invoiceAction.getInvoiceSetting());
            }
        };

        const plaidBroadcast = new BroadcastChannel(BROADCAST_CHANNELS.REAUTH_PLAID_SUCCESS);
        plaidBroadcast.onmessage = (event) => {
            if (event?.data) {
                this.getBankTransactions();
            }
        };

        this.bankMessage$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getBankTransactions();
            }
        });

        this.isBankRefreshing$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.isBankAccount) {
                this.getAllBankAccounts(this.lc.accountUnq);
            }
        });

        /**
         * When refresh bank api getting error then this code works
         */
        this.isBankRefreshingError$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.openInstitutionsDialog();
            }
        });

        this.settingIntegrationComponentStore.getAllBankAccountsList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.length) {
                this.bankList = response.body;
                if (!this.isUpdateAccount) {
                    if (response.body.some(item => item.account?.uniqueName === (this.lc.accountUnq ?? this.selectedAccountUniquename))) {
                        this.isBankAccountConnected = true;
                    }
                    this.unlinkBankList = response.body.filter(bank => Object.keys(bank.account).length === 0);
                    const referNo = localStorage.getItem('refNo');
                    if (this.isDirectlyIntegrated && referNo !== null && referNo !== undefined) {
                        this.getLinkBankAccount();
                    }
                }
            }
        });

        this.ledgerComponentStore.isLedgerViewChange$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (this.isAdvanceSearchImplemented && !this.trxRequest.q?.length) {
                    this.getAdvanceSearchTxn();
                } else {
                    this.getTransactionData();
                }
                this.store.dispatch(this.ledgerActions.GetLedgerAccount(this.lc.accountUnq));
            }
        });

        this.updateAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response: boolean) => {
            if (response) {
                this.updateAccountDialogRef?.close();
            }
        });

        this.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.lc.activeAccount = response;
                this.lc.getUnderstandingText(this.lc.activeAccount?.accountType, this.lc.activeAccount?.name, this.lc.activeAccount?.parentGroups, this.localeData);
                this.cdRf.detectChanges();
            }
        });
        this.getAllDiscounts();
    }

    private assignPrefixAndSuffixForCurrency() {
        this.isPrefixAppliedForCurrency = this.isPrefixAppliedForCurrency = !(['AED'].includes(this.selectedCurrency === 0 ? this.baseCurrencyDetails?.code : this.foreignCurrencyDetails?.code));
        this.selectedPrefixForCurrency = this.isPrefixAppliedForCurrency ? this.selectedCurrency === 0 ? this.baseCurrencyDetails?.symbol : this.foreignCurrencyDetails?.symbol : '';
        this.selectedSuffixForCurrency = this.isPrefixAppliedForCurrency ? '' : this.selectedCurrency === 0 ? this.baseCurrencyDetails?.symbol : this.foreignCurrencyDetails?.symbol;
    }

    public initTrxRequest(accountUnq: string) {
        this.loaderService.show();
        this.advanceSearchRequest.accountUniqueName = accountUnq;
        this.trxRequest.accountUniqueName = accountUnq;
        // always send accountCurrency true when requesting for first time
        this.trxRequest.accountCurrency = true;
        this.getTransactionData();
    }

    /**
     * This will get the bank transactions of the account
     *
     * @memberof LedgerComponent
     */
    public getBankTransactions(isFocusOnLedgerHeader: boolean = false): void {
        this.entryUniqueNamesForBulkAction = [];
        if (this.trxRequest.accountUniqueName) {
            this.isBankTransactionLoading = true;

            let getRequest = { accountUniqueName: this.trxRequest.accountUniqueName, from: this.trxRequest.from, count: this.bankTransactionsResponse.countPerPage, page: this.bankTransactionsResponse.page }
            this.ledgerService.GetBankTransactionsForLedger(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                this.isBankTransactionLoading = false;
                if (res?.status === 'success') {
                    if (res.body) {
                        this.bankTransactionsResponse.totalItems = res.body.totalItems;
                        this.bankTransactionsResponse.totalPages = res.body.totalPages;
                        this.bankTransactionsResponse.creditTransactionsCount = res.body.creditTransactionsCount;
                        this.bankTransactionsResponse.debitTransactionsCount = res.body.debitTransactionsCount;
                        this.bankAccount.reLoginRequired = res.body.reLoginRequired;
                        this.bankAccount.gocardlessMessage = res.body.message;
                        this.bankAccount.itemId = res.body.itemId;
                        this.zone.runOutsideAngular(() => {
                            this.lc.getReadyBankTransactionsForUI(res.body.transactionsList, ((this.currentOrganizationType === OrganizationType.Company || this.isConsolidatedBranch) && (this.currentCompanyBranches && this.currentCompanyBranches.length > 2)));
                            this.getAccountSearchPrediction(this.lc.bankTransactionsCreditData);
                            this.getAccountSearchPrediction(this.lc.bankTransactionsDebitData);
                        });

                        if (isFocusOnLedgerHeader) {
                            this.focusOnLedgerHeader();
                        }
                        this.cdRf.detectChanges();
                    }
                }
            });
        }
    }

    /**
     * Prepare array and count the selected bank transaction to save.
     *
     * @param {*} [transaction]
     * @memberof LedgerComponent
     */
    public getTransactionCountConvertToEntries(transaction?: any): void {
        if (this.lc.bankTransactionsDebitData?.length || this.lc.bankTransactionsCreditData?.length) {
            if (!transaction) {
                let bankTransactions: any[] = [];

                this.lc.bankTransactionsDebitData?.forEach(transaction => {
                    if (transaction.transactions[0]?.selectedAccount?.name) {
                        bankTransactions.push(transaction);
                    }
                });
                this.lc.bankTransactionsCreditData?.forEach(transaction => {
                    if (transaction.transactions[0]?.selectedAccount?.name) {
                        bankTransactions.push(transaction);
                    }
                });
                this.transactionCountConvertToEntries = bankTransactions.length;
                this.bankTransactionsWithAccountName = bankTransactions;
            } else {
                const beforeFilterLength = this.bankTransactionsWithAccountName.length;
                this.bankTransactionsWithAccountName = this.bankTransactionsWithAccountName.filter(item => (transaction?.id !== item?.id));
                const afterFilterLength = this.bankTransactionsWithAccountName.length;
                if (afterFilterLength !== beforeFilterLength) {
                    this.transactionCountConvertToEntries--;
                }
            }
        }
    }

    /**
     * Loop through bank transactions and prepare model to send data to api
     *
     * @param {*} bankTransactions
     * @memberof LedgerComponent
     */
    public getAccountSearchPrediction(bankTransactions: any): void {
        if (bankTransactions?.length > 0) {
            let requestModel = [];

            (Array.isArray(bankTransactions) ? bankTransactions : []).forEach(transaction => {
                if (transaction?.transactionId && transaction?.description) {
                    requestModel.push({
                        uniqueName: transaction.transactionId,
                        description: transaction.description
                    });
                }

                if (requestModel?.length === 10) {
                    this.getAccountSearchPredictionData(requestModel, bankTransactions);
                    requestModel = [];
                }
            });

            if (requestModel?.length > 0) {
                this.getAccountSearchPredictionData(requestModel, bankTransactions);
                requestModel = [];
            }
        }
    }

    /**
     * This will send data to api and will map with transactions
     *
     * @private
     * @param {any[]} requestModel
     * @param {*} bankTransactions
     * @memberof LedgerComponent
     */
    private getAccountSearchPredictionData(requestModel: any[], bankTransactions: any): void {
        this.isHideBankLedgerPopup = true;
        this.ledgerService.getAccountSearchPrediction(this.trxRequest.accountUniqueName, requestModel).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                let mappedTransactions = response?.body?.filter(transaction => transaction?.account !== undefined && transaction?.account !== null);
                if (mappedTransactions?.length > 0) {
                    mappedTransactions?.forEach(transaction => {
                        let matchedTransaction = bankTransactions?.filter(bankTransaction => bankTransaction.transactionId === transaction?.uniqueName);
                        if (matchedTransaction?.length > 0) {
                            const account: IOption = { label: transaction.account?.name, value: transaction.account?.uniqueName, additional: { uniqueName: transaction?.account?.uniqueName } };
                            matchedTransaction[0].transactions[0].particular = transaction?.account?.name;
                            this.selectAccount(account, matchedTransaction[0]?.transactions[0], false, false, true);
                        }
                    });
                }
            }
            this.accountPredictionSubject.next(true);
        });
    }

    public selectBankTxn(txn: TransactionVM) {
        this.lc.currentTxn = null;
        this.lc.currentBlankTxn = txn;
        this.lc.selectedBankTxnUniqueName = txn.id;
    }

    public showBankLedgerPopup(txn: TransactionVM, item: BlankLedgerVM) {
        this.selectBankTxn(txn);
        this.lc.currentBankEntry = item;
        this.lc.showBankLedgerPanel = true;
    }

    public hideBankLedgerPopup(event?: any) {
        if (this.isDatepickerOpen) {
            return;
        }

        if (!event) {
            this.getBankTransactions();
            this.getTransactionData();
        }
        if (event && event.path) {
            let classList = event.path.map(element => {
                return element?.classList;
            });

            if (classList && classList instanceof Array) {
                const shouldNotClose = classList?.some((className: DOMTokenList) => {
                    if (!className) {
                        return;
                    }
                    return className.contains('entry-picker') || className.contains('currency-toggler') || className.contains('mat-calendar');
                });

                if (shouldNotClose) {
                    return;
                }
            }
        }
        if (this.lc.currentBlankTxn) {
            this.lc.currentBlankTxn.showDropdown = false;
        }
        this.selectedTrxWhileHovering = '';
        this.selectedBankTrxWhileHovering = '';
        this.lc.showBankLedgerPanel = false;
        this.needToReCalculate.next(false);
        this.lc.currentBlankTxn = null;
        this.lc.selectedBankTxnUniqueName = null;
    }

    public clickUnpaidInvoiceList(e?: boolean) {
        if (e) {
            if ((this.accountUniqueName === 'cash' || this.accountUniqueName === 'bankaccounts' || (this.generalService.voucherApiVersion === 2 && this.accountUniqueName === 'loanandoverdraft')) && this.selectedTxnAccUniqueName) {
                this.getInvoiceLists({ accountUniqueName: this.selectedTxnAccUniqueName, status: 'unpaid' });
            } else {
                this.getInvoiceLists({ accountUniqueName: this.accountUniqueName, status: 'unpaid' });
            }
        }
    }

    /**
     * Get Invoice list for credit note
     *
     * @param {any} current transaction and voucher type
     * @memberof LedgerComponent
     */
    public getInvoiceListsForCreditNote(event: any): void {
        const voucherType = (event) ? event[1] : "";
        if (voucherType && this.selectedTxnAccUniqueName && this.accountUniqueName) {
            let request;

            let activeAccount = null;
            this.lc.activeAccount$.pipe(take(1)).subscribe(account => activeAccount = account);

            if (this.voucherApiVersion === 2) {
                request = this.adjustmentUtilityService.getInvoiceListRequest({ particularAccount: event[0]?.selectedAccount, voucherType: voucherType, ledgerAccount: activeAccount });
            } else {
                request = {
                    accountUniqueNames: [this.selectedTxnAccUniqueName, this.accountUniqueName],
                    voucherType
                };
            }

            // don't call api if it's invalid case
            if (!request) {
                return;
            }

            if (this.voucherApiVersion === 2) {
                request.page = 1;
            }

            let date;
            if (this.lc && this.lc.blankLedger && this.lc.blankLedger.entryDate) {
                if (typeof this.lc.blankLedger.entryDate === 'string') {
                    date = this.lc.blankLedger.entryDate;
                } else {
                    date = dayjs(this.lc.blankLedger.entryDate).format(GIDDH_DATE_FORMAT);
                }
            }
            this.invoiceList = [];
            this.ledgerService.getInvoiceListsForCreditNote(request, date).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response && response.body) {
                    this.referenceVouchersTotalPages = response.body.totalPages;
                    let items = [];
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    items?.forEach(invoice => {
                        invoice.voucherNumber = this.generalService.getVoucherNumberLabel(invoice?.voucherType, invoice?.voucherNumber, this.commonLocaleData);

                        this.invoiceList.push({ label: invoice?.voucherNumber ? invoice?.voucherNumber : '-', value: invoice?.uniqueName, additional: invoice })
                    });
                }
            });
        }
    }

    /**
     * Open E-Way Bill dialog for creating or editing an E-Way Bill.
     *
     *  @returns {void}
     * @memberof LedgerComponent
     */
    public openEwayBillDialog(): void {
        this.dialog?.closeAll();
        const dialogRef = this.dialog.open(EWayBillCreateComponent, {
            panelClass: ['mat-dialog-md'],
            disableClose: true,
            data: { pincode: this.ledgerAccountResponse?.addresses?.[0]?.pincode, gstNumber: this.ledgerAccountResponse?.addresses?.[0]?.gstNumber }
        });
        dialogRef.afterClosed().subscribe(response => {
            this.saveBlankTransaction(response);
        });
    }

    /**
     * Generates a ledger entry. If conditions are met, it will open the e-Way Bill dialog; otherwise, it directly saves the blank transaction.
     * @returns {void}
     *
     * @memberof LedgerComponent
     */
    public generateLedger(): void {
        if ((this.lc.blankLedger.transactions[1]?.selectedAccount?.uniqueName === "sales" || this.lc.blankLedger.transactions[0]?.selectedAccount?.uniqueName === "sales") && this.invoiceSettings?.invoiceSettings?.generateAutoEWayBill && this.invoiceSettings?.invoiceSettings?.gstEInvoiceEnable) {
            this.openEwayBillDialog();
        } else {
            this.saveBlankTransaction();
        }
    }

    public saveBankTransaction() {
        let blankTransactionObj: BlankLedgerVM = this.lc.prepareBankLedgerRequestObject();
        blankTransactionObj.invoicesToBePaid = this.selectedInvoiceList;
        delete blankTransactionObj['voucherType'];
        if (blankTransactionObj && blankTransactionObj?.transactions && blankTransactionObj?.transactions.length > 0) {
            this.generalService.replaceSelectedAllOptions(blankTransactionObj);
            this.store.dispatch(this.ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
        } else {
            this.toaster.showSnackBar("error", this.localeData?.transaction_required, this.commonLocaleData?.app_error);
        }
    }

    /**
     * Save bulk bank transaction Dialog
     *
     * @returns {void}
     * @memberof LedgerComponent
     */
    public openBulkBankTransactionConfirmationDialog(): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.convert_entries_message, this.commonLocaleData)
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.saveBulkBankTransaction();
            }
        });
    }

    /**
     * Save bulk bank transaction
     *
     * @returns {void}
     * @memberof LedgerComponent
     */
    public saveBulkBankTransaction(): void {
        let blankTransactionsObjArray: BlankLedgerVM[] = [];

        this.bankTransactionsWithAccountName?.forEach(currentBankEntry => {
            let blankTransactionObj: BlankLedgerVM = this.lc.prepareBankLedgerRequestObject(currentBankEntry);
            blankTransactionObj.invoicesToBePaid = this.selectedInvoiceList;
            delete blankTransactionObj['voucherType'];

            if (blankTransactionObj && blankTransactionObj?.transactions && blankTransactionObj?.transactions.length > 0) {
                this.generalService.replaceSelectedAllOptions(blankTransactionObj);
                blankTransactionsObjArray.push(blankTransactionObj);
            }
        })

        if (blankTransactionsObjArray.length) {
            this.store.dispatch(this.ledgerActions.ResetBlankLedger());
            this.store.dispatch(this.ledgerActions.CreateBulkBlankLedgers(cloneDeep(blankTransactionsObjArray), this.lc.accountUnq));
        } else {
            this.toaster.showSnackBar("error", this.localeData?.transaction_required, this.commonLocaleData?.app_error);
        }
    }

    public getselectedInvoice(event: string[]) {
        this.selectedInvoiceList = event;
    }

    public getTransactionData() {
        this.closingBalanceBeforeReconcile = null;
        this.generateEInvoice = null;
        if (this.trxRequest?.accountUniqueName) {
            if (!this.isAdvanceSearchImplemented) {
                this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));
            } else {
                this.createLedgerBalance();
            }

            const fromDate = this.advanceSearchRequest?.dataToSend?.bsRangeValue?.[0] && dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).isValid()
                ? dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT)
                : this.trxRequest.from;

            const toDate = this.advanceSearchRequest?.dataToSend?.bsRangeValue?.[1] && dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).isValid()
                ? dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT)
                : this.trxRequest.to;

            this.store.dispatch(this.ledgerActions.GetTransactions({ ...this.trxRequest, from: fromDate, to: toDate }));
        }
    }

    public getCurrencyRate(mode: string = null, isBankTransaction?: boolean, bankTransaction?: any) {
        let from: string;
        let to: string;
        if (mode === 'blankLedger') {
            from = (this.lc.blankLedger.selectedCurrencyToDisplay === 0 ? this.lc.blankLedger.baseCurrencyToDisplay?.code : this.lc.blankLedger.foreignCurrencyToDisplay?.code);
            to = (this.lc.blankLedger.selectedCurrencyToDisplay === 0 ? this.lc.blankLedger.foreignCurrencyToDisplay?.code : this.lc.blankLedger.baseCurrencyToDisplay?.code);
        } else {
            from = this.selectedCurrency === 0 ? this.baseCurrencyDetails?.code : this.foreignCurrencyDetails?.code;
            to = this.selectedCurrency === 0 ? this.foreignCurrencyDetails?.code : this.baseCurrencyDetails?.code;
        }
        if (from && to) {
            let date = dayjs().format(GIDDH_DATE_FORMAT);
            this.ledgerService.GetCurrencyRateNewApi(from, to, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    if (isBankTransaction) {
                        bankTransaction.exchangeRate = rate;
                    } else {
                        this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: rate };
                    }
                }
            }, (error => {
                this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: 1 };
            }));
        }
        this.cdRf.detectChanges();
    }

    public toggleTransactionType(event: any) {
        this.lc.showNewLedgerPanel = false;
        let allTrx: TransactionVM[] = filter(this.lc.blankLedger?.transactions, bl => bl?.type === event?.type);
        let unAccountedTrx = find(allTrx, a => !a?.selectedAccount);

        if (unAccountedTrx) {
            this.selectBlankTxn(unAccountedTrx);
        } else {
            const currentlyAddedTransaction = this.lc.currentBlankTxn;
            if (currentlyAddedTransaction.inventory) {
                // Add the warehouse selected for an item
                currentlyAddedTransaction.inventory['warehouse'] = { name: '', uniqueName: event.warehouse };
            }
            let newTrx = this.lc.addNewTransaction(event.type);
            this.lc.blankLedger?.transactions.push(newTrx);
            this.selectBlankTxn(newTrx);
        }
        this.closeAllAccountDropdown();

        setTimeout(() => {
            this.focusDebitCreditDropdowns(event?.type);
        }, 0);
    }

    /**
     * Focus the debit or credit dropdown
     *
     * @param type The type of transaction
     * @memberof LedgerComponent
     */
    private focusDebitCreditDropdowns(type: TransactionType) {
        if (this.ledgerView === LedgerViewEnum.StatementView) {
            const debitCreditDropdowns = this.dropdowns.filter(dropdown => dropdown?.cssClass?.includes(TransactionType.Debit) || dropdown?.cssClass?.includes(TransactionType.Credit));
            debitCreditDropdowns[debitCreditDropdowns?.length - 1]?.openDropdownPanel();
        } else {
            if (type === TransactionType.Debit) {
                const debitDropdowns = this.dropdowns.filter(dropdown => dropdown?.cssClass?.includes(TransactionType.Debit));
                debitDropdowns[debitDropdowns?.length - 1]?.openDropdownPanel();
            } else {
                const creditDropdowns = this.dropdowns.filter(dropdown => dropdown?.cssClass?.includes(TransactionType.Credit));
                creditDropdowns[creditDropdowns?.length - 1]?.openDropdownPanel();
            }
        }
    }

    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this.ledgerService.downloadAttachement(fileName).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body?.uploadedFile, `image/${d.body?.fileType}`, 512);
                download(d.body?.name, blob, `image/${d.body?.fileType}`)
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }


    public downloadInvoice(transaction: any, e: Event) {
        e.stopPropagation();
        let activeAccount = null;
        this.lc.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let downloadRequest = new DownloadLedgerRequest();
        if (this.voucherApiVersion === 2) {
            downloadRequest.uniqueName = transaction?.voucherUniqueName;
        } else {
            downloadRequest.invoiceNumber = [transaction?.voucherNumber];
        }
        downloadRequest.voucherType = transaction?.voucherGeneratedType;

        this.ledgerService.DownloadInvoice(downloadRequest, this.lc.accountUnq).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body, 'application/pdf', 512);
                download(`${activeAccount.name} - ${transaction?.voucherNumber}.pdf`, blob, 'application/pdf');
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }

    /**
     * Set the blank ledger transactions
     *
     * @returns {void}
     */
    private setBlankLedgerTransactions(): void {
        if (this.ledgerView === LedgerViewEnum.StatementView) {
            this.lc.blankLedger.transactions = [
                this.lc?.addNewTransaction(TransactionType.Debit)
            ];
        } else {
            this.lc.blankLedger.transactions = [
                this.lc?.addNewTransaction(TransactionType.Debit),
                this.lc?.addNewTransaction(TransactionType.Credit)
            ];
        }
    }

    /**
     * Reset the blank transaction
     *
     * @returns {void}
     */
    public resetBlankTransaction(): void {
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.lc.blankLedger = this.lc.getBlankLedger();
        if (this.currentOrganizationType === OrganizationType.Branch || (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) {
            this.setBlankLedgerTransactions();
        } else {
            this.lc.blankLedger.transactions = [];
        }

        this.lc.blankLedger.voucherType = null;
        this.lc.blankLedger.entryDate = this.selectedDateRange?.endDate ? dayjs(this.selectedDateRange.endDate).format(GIDDH_DATE_FORMAT) : dayjs().format(GIDDH_DATE_FORMAT);
        this.lc.blankLedger.valuesInAccountCurrency = (this.selectedCurrency === 0);
        this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
        this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
        this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
        this.shouldShowRcmTaxableAmount = false;
        this.shouldShowItcSection = false;
        this.isMoreDetailsOpened = false;
        if (this.isLedgerAccountAllowsMultiCurrency) {
            this.getCurrencyRate('blankLedger');
        }
        this.resetPreviousSearchResults();
        this.needToReCalculate.next(false);
        this.closeAllAccountDropdown();
        this.forceClear$.next(true);
        setTimeout(() => {
            this.forceClear$.next(false);
        }, 100);
    }

    public showNewLedgerEntryPopup(trx: TransactionVM) {
        this.selectBlankTxn(trx);
        if (trx.particular) {
            this.lc.showNewLedgerPanel = true;
        } else {
            this.lc.showNewLedgerPanel = false;
        }
    }

    public onSelectHide() {
        // To Prevent Race condition
        setTimeout(() => this.isSelectOpen = false, 500);
        this.noResultsFoundLabel = SearchResultText.NewSearch;
    }

    public hideNewLedgerEntryPopup(event?) {
        this.selectedTrxWhileHovering = '';

        if (this.isDatepickerOpen) {
            return;
        }

        if (event && event.path) {
            let classList = event.path.map(m => {
                return m?.classList;
            });

            if (classList && classList instanceof Array) {
                const shouldNotClose = classList?.some((className: DOMTokenList) => {
                    if (!className) {
                        return;
                    }
                    return className.contains('currency-toggler') || className.contains('mat-calendar');
                });

                if (shouldNotClose) {
                    return;
                }
            }
        }
        this.isMoreDetailsOpened = false;
        this.lc.showNewLedgerPanel = false;
        this.needToReCalculate.next(false);
    }

    /**
     * Show update ledger panel
     *
     * @param {ITransactionItem} txn
     * @param {LedgerType} ledgerType
     * @memberof LedgerComponent
     */
    public showUpdateLedgerModal(txn: ITransactionItem, ledgerType: LedgerType): void {
        let transactionsList = [];
        if (this.ledgerTransactions?.debitCreditTransactions?.length) {
            transactionsList = this.ledgerTransactions.debitCreditTransactions;
        } else {
            transactionsList = ledgerType === 'cr' ? this.ledgerTransactions.creditTransactions : this.ledgerTransactions.debitTransactions;
        }
        const txnIndex = transactionsList.findIndex(t => t.entryUniqueName === txn.entryUniqueName);

        if (txn?.adjustmentEntry) {
            this.router.navigate([`/pages/inventory/v2/product/adjust/${txn?.description}`]);
        } else {
            let transactions: TransactionsResponse = null;
            this.store.pipe(select(t => t?.ledger?.transactionsResponse), take(1)).subscribe(trx => transactions = trx);
            if (transactions) {
                this.store.dispatch(this.ledgerActions.setAccountForEdit(this.lc.accountUnq));
            }
            this.store.dispatch(this.ledgerActions.setTxnForEdit(txn.entryUniqueName));
            this.lc.selectedTxnUniqueName = txn.entryUniqueName;
            this.entrySide = ledgerType;
            this.loadUpdateLedgerComponent(txn, txnIndex, transactionsList);
        }
    }

    /**
     * Hide update ledger modal
     *
     * @param {any} event
     * @memberof LedgerComponent
     */
    public hideUpdateLedgerModal(event: any): void {
        this.updateLedgerModalDialogRef?.close(event);
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof LedgerComponent
     */
    public handleScrollEnd(): void {
        if (this.searchResultsPaginationData.page) {
            this.onSearchQueryChanged(
                this.searchResultsPaginationData.query,
                this.searchResultsPaginationData.page + 1,
                this.searchResultsPaginationData.query ? true : false,
                (response) => {
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

    public showShareLedgerModal() {
        this.shareLedgerDates.from = dayjs(this.selectedDateRange?.startDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        this.shareLedgerDates.to = dayjs(this.selectedDateRange?.endDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

        this.dialog.open(ShareLedgerComponent, {
            data: {
                accountUniqueName: this.lc.accountUnq,
                advanceSearchRequest: this.advanceSearchRequest,
                from: this.shareLedgerDates?.from,
                to: this.shareLedgerDates?.to,
            },
            role: 'alertdialog',
            ariaLabel: 'share',
            panelClass: 'mat-dialog-md'
        });
    }

    /**
     * Displays the export ledger modal
     *
     * @memberof LedgerComponent
     */
    public showExportLedgerModal(): void {
        if (this.advanceSearchRequest && this.advanceSearchRequest.dataToSend && this.selectedDateRange && this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
            this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                page: 1,
                dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                    bsRangeValue: [this.selectedDateRange.startDate, this.selectedDateRange.endDate]
                })
            });
        }

        let dialogRef = this.dialog.open(ExportLedgerComponent, {
            data: {
                accountUniqueName: this.lc.accountUnq,
                advanceSearchRequest: this.advanceSearchRequest,
                selectEntryUniqueName: this.checkedTrxWhileHovering.map(((entry) => { return entry.uniqueName })),
                currencyTogglerModel: this.currencyTogglerModel,
                isLedgerAccountAllowsMultiCurrency: this.isLedgerAccountAllowsMultiCurrency
            },
            role: 'alertdialog',
            panelClass: ['mat-dialog-md'],
            ariaLabel: 'export'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.onShowColumnarReportTable(response);
            }
        });
    }

    /**
     * Handle save blank transaction
     *
     * @param eWayBillResponse
     * @returns
     */
    public saveBlankTransaction(eWayBillResponse?: any): void {
        this.loaderService.show();

        if (this.lc.blankLedger.entryDate) {
            if ((typeof this.lc.blankLedger.entryDate === "object") ? !dayjs(this.lc.blankLedger.entryDate).isValid() : !dayjs(this.lc.blankLedger.entryDate, GIDDH_DATE_FORMAT).isValid()) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_date);
                this.loaderService.hide();
                return;
            } else {
                this.lc.blankLedger.entryDate = (typeof this.lc.blankLedger.entryDate === "object") ? dayjs(this.lc.blankLedger.entryDate).format(GIDDH_DATE_FORMAT) : dayjs(this.lc.blankLedger.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }

        if (this.lc.blankLedger.chequeClearanceDate) {
            if ((typeof this.lc.blankLedger.chequeClearanceDate === "object") ? !dayjs(this.lc.blankLedger.chequeClearanceDate).isValid() : !dayjs(this.lc.blankLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).isValid()) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_cheque_clearance_date);
                this.loaderService.hide();
                return;
            } else {
                this.lc.blankLedger.chequeClearanceDate = (typeof this.lc.blankLedger.chequeClearanceDate === "object") ? dayjs(this.lc.blankLedger.chequeClearanceDate).format(GIDDH_DATE_FORMAT) : dayjs(this.lc.blankLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }

        let blankTransactionObj: BlankLedgerVM = this.lc.prepareBlankLedgerRequestObject();


        if (blankTransactionObj && blankTransactionObj?.transactions && blankTransactionObj?.transactions.length > 0) {
            if (this.voucherApiVersion === 2) {
                blankTransactionObj = this.adjustmentUtilityService.getAdjustmentObject(blankTransactionObj);
            }
            const model = cloneDeep(blankTransactionObj);
            if (model.transactions[0]?.subVoucher === "ADVANCE_RECEIPT" && !model.isOtherTaxesApplicable) {
                /** Here key 'taxInclusiveAmount' represents the amount of the advance receipt, exclusive of tax (if tax is applied) */
                model.transactions[0].amount = model.transactions[0].taxInclusiveAmount;
            }
            if (eWayBillResponse && Object.keys(eWayBillResponse).length > 0) {
                model.ewayBillDetails = eWayBillResponse;
            }
            this.generalService.replaceSelectedAllOptions(model);
            this.store.dispatch(this.ledgerActions.CreateBlankLedger(model, this.lc.accountUnq));
        } else {
            this.toaster.showSnackBar("error", this.localeData?.transaction_required, this.commonLocaleData?.app_error);
            this.loaderService.hide();
        }
    }

    public blankLedgerAmountClick() {
        if (this.lc.currentBlankTxn && Number(this.lc.currentBlankTxn.amount) === 0) {
            this.lc.currentBlankTxn.amount = undefined;
        }
    }

    public entryManipulated() {
        if (this.isAdvanceSearchImplemented) {
            this.getAdvanceSearchTxn();
        } else if (this.activeAccountParentGroupsUniqueName === 'bankaccounts' && this.closingBalanceBeforeReconcile) {
            this.getReconciliation();
        } else {
            this.getTransactionData();
        }
    }

    public resetAdvanceSearch() {
        this.searchText = "";
        this.isAdvanceSearchImplemented = false;
        this.trxRequest.page = 1;
        let accountUniqueName = this.advanceSearchRequest.accountUniqueName;
        this.advanceSearchRequest = new AdvanceSearchRequest();
        this.advanceSearchRequest.accountUniqueName = accountUniqueName;
        this.search("");
        this.universalDate$.pipe(take(1)).subscribe(date => {
            if (date) {
                this.selectedDateRangeUi = dayjs(date[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(date[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.getLedgerStatementViewGridColumnsValue();
    }

    public getCategoryNameFromAccountUniqueName(txn: TransactionVM): boolean {
        let activeAccount: AccountResponse | AccountResponseV2;
        this.lc.activeAccount$.pipe(take(1)).subscribe(a => activeAccount = a);

        let showDiscountAndTaxPopup: boolean = false;

        // check url account category
        if (activeAccount && (activeAccount.category === 'income' || activeAccount.category === 'expenses' || activeAccount.category === 'assets')) {
            if (activeAccount.category === 'assets') {
                showDiscountAndTaxPopup = activeAccount.parentGroups[0]?.uniqueName.includes('fixedassets');
            } else {
                showDiscountAndTaxPopup = true;
            }
        }

        // if url's account allows show discount and tax popup then don't check for selected account
        if (showDiscountAndTaxPopup) {
            return true;
        }

        // check selected account category
        if (txn?.selectedAccount) {
            const category = txn.selectedAccount ? txn.selectedAccount.category : "";
            if (category === 'income' || category === 'expenses' || category === 'assets') {
                if (category === 'assets') {
                    showDiscountAndTaxPopup = txn.selectedAccount.uNameStr.includes('fixedassets');
                } else {
                    showDiscountAndTaxPopup = true;
                }
            }
        }

        return showDiscountAndTaxPopup;
    }

    public showOtherTax(txn: TransactionVM): boolean {
        let activeAccount: AccountResponse | AccountResponseV2;
        this.lc.activeAccount$.pipe(take(1)).subscribe(a => activeAccount = a);

        let showOtherTaxOption: boolean = false;

        // check url account category
        if (activeAccount && (activeAccount.category === 'income' || activeAccount.category === 'expenses' || activeAccount.category === 'assets')) {
            if (activeAccount.category === 'assets') {
                showOtherTaxOption = activeAccount.parentGroups[0]?.uniqueName.includes('fixedassets');
            } else {
                showOtherTaxOption = true;
            }
        }

        if (this.generalService.isReceiptPaymentEntry(activeAccount, txn?.selectedAccount)) {
            showOtherTaxOption = true;
        }

        // if url's account allows show discount and tax popup then don't check for selected account
        if (showOtherTaxOption) {
            return true;
        }

        // check selected account category
        if (txn?.selectedAccount) {
            const category = txn.selectedAccount ? txn.selectedAccount.category : "";
            if (category === 'income' || category === 'expenses' || category === 'assets') {
                if (category === 'assets') {
                    showOtherTaxOption = txn.selectedAccount.uNameStr.includes('fixedassets');
                } else {
                    showOtherTaxOption = true;
                }
            }
        }

        return showOtherTaxOption;
    }

    public ngOnDestroy(): void {
        if (window.localStorage) {
            localStorage.removeItem('refNo');
        }
        document.querySelector('body').classList.remove('ledger-body');
        this.store.dispatch(this.ledgerActions.ResetLedger());
        this.forceClear$.next(null);
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will be use for load update ledger component
     *
     * @param {ITransactionItem} transaction
     * @param {number} index
     * @param {ITransactionItem[]} transactionsList
     * @memberof LedgerComponent
     */
    public loadUpdateLedgerComponent(transaction: ITransactionItem, index: number, transactionsList: ITransactionItem[]): void {
        this.entryTransactionData = { transaction, index, transactionsList }
        this.updateLedgerModalDialogRef = this.dialog.open(this.carousel, {
            panelClass: 'dialog-bg-transparent',
            role: 'alertdialog',
            ariaLabel: 'update'
        })

        this.updateLedgerModalDialogRef.afterClosed().subscribe((response) => {
            this.entryManipulated();
            if (this.isAdvanceSearchImplemented) {
                this.createLedgerBalance();
            }

            // For duplicate entry
            if (response?.transactionDetails) {
                this.prepareDuplicateTransaction(response?.transactionDetails);
            }
        });
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof LedgerComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1, withStocks: boolean = true, successCallback?: Function): void {

        this.searchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultSuggestions && this.defaultSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const currentLedgerCategory = this.lc.activeAccount ? this.generalService.getAccountCategory(this.lc.activeAccount, this.lc.activeAccount?.uniqueName) : '';
            // If current ledger is of income or expense category then send current ledger as stockAccountUniqueName. Only required for ledger.
            const accountUniqueName = (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses' || currentLedgerCategory === 'fixedassets') ?
                this.lc.activeAccount ? this.lc.activeAccount?.uniqueName : '' :
                '';
            const requestObject = {
                q: encodeURIComponent(query),
                page,
                withStocks,
                stockAccountUniqueName: encodeURIComponent(accountUniqueName) || undefined,
                count: API_BULK_FETCH_LIMIT
            }
            if (this.isAccountSearchData) {
                this.searchService.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (!data?.body?.results?.length || (data?.body?.results?.length && API_BULK_FETCH_LIMIT !== data?.body?.count)) {
                        this.isAccountSearchData = false;
                    }
                    if (data && data.body && data.body.results) {
                        const searchResults = data.body.results.map(result => {
                            return {
                                value: result.stock ? `${result?.uniqueName}#${result?.stock?.uniqueName}` : result?.uniqueName,
                                label: result.stock ? `${result?.name} (${result?.stock?.name})` : result?.name,
                                additional: result
                            }
                        }) || [];
                        this.noResultsFoundLabel = SearchResultText.NotFound;
                        if (page === 1) {
                            this.searchResults = searchResults;
                        } else {
                            this.searchResults = [
                                ...this.searchResults,
                                ...searchResults
                            ];
                        }
                        this.searchResultsPaginationData.page = data.body.page;
                        if (successCallback) {
                            successCallback(data.body.results);
                        } else {
                            this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
                        }
                        this.cdRf.detectChanges();
                    }
                });
            }
        } else {
            this.searchResults = [...this.defaultSuggestions];
            this.searchResultsPaginationData.page = this.defaultResultsPaginationData.page;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
            this.cdRf.detectChanges();
        }
    }

    /**
     * Resets the previous search result
     *
     * @memberof LedgerComponent
     */
    public resetPreviousSearchResults(): void {
        this.searchResults = [...this.defaultSuggestions];
        this.searchResultsPaginationData = {
            page: 1,
            count: 0,
            query: ''
        };
        this.noResultsFoundLabel = SearchResultText.NewSearch;
    }

    /**
     * To open advance search modal
     *
     * @memberof LedgerComponent
     */
    public onOpenAdvanceSearch(): void {
        if (this.advanceSearchRequest && this.advanceSearchRequest.dataToSend && this.selectedDateRange && this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
            this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                page: 1,
                dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                    bsRangeValue: [this.selectedDateRange.startDate, this.selectedDateRange.endDate]
                })
            });
        }

        this.advanceSearchDialogRef = this.dialog.open(this.advanceSearchModal, {
            width: '980px',
            role: 'alertdialog',
            ariaLabel: 'advance'
        });
    }

    public search(term: string): void {
        this.searchTermStream.next(term);
    }

    /**
     * closeAdvanceSearchPopup
     */
    public closeAdvanceSearchPopup(event: any) {
        this.advanceSearchDialogRef?.close();
        this.advanceSearchRequest.paginationToken = "";
        if (!event.isClose) {
            this.getLedgerStatementViewGridColumnsValue();
            this.createLedgerBalance(true);
            this.getAdvanceSearchTxn();
            if (event.advanceSearchData) {
                if (event.advanceSearchData['dataToSend']['bsRangeValue'] && event.advanceSearchData['dataToSend']['bsRangeValue'].length) {
                    this.selectedDateRange = { startDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]), endDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]) };
                    this.selectedDateRangeUi = dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                }
            }
        }
    }

    public getReconciliation() {
        this.lc.transactionData$.pipe(take(1)).subscribe((val) => {
            if (val) {
                this.closingBalanceBeforeReconcile = val.periodClosingBalance;
                if (this.closingBalanceBeforeReconcile) {
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === TransactionType.Credit ? this.localeData?.cr : this.localeData?.dr;
                }
            }
        });
        let dataToSend = {
            reconcileDate: null,
            closingBalance: 0,
            ClosingBalanceType: null,
            accountUniqueName: this.lc.accountUnq
        };
        this.store.dispatch(this.ledgerActions.GetReconciliation(dataToSend));
    }

    public performBulkAction(actionType: string, fileInput?) {
        this.entryUniqueNamesForBulkAction = [];
        let debitTrx: ITransactionItem[] = [];
        let creditTrx: ITransactionItem[] = [];
        let debitCreditTransactions: ITransactionItem[] = [];

        this.lc.transactionData$.pipe(take(1)).subscribe(s => {
            if (s) {
                debitTrx = s.debitTransactions;
                creditTrx = s.creditTransactions;
                debitCreditTransactions = s.debitCreditTransactions;
            }
        });

        let entryUniqueNames: string[] = [];
        if (debitCreditTransactions?.length) {
            entryUniqueNames = [...debitCreditTransactions?.filter(debitCreditTransaction => debitCreditTransaction.isChecked).map(debitCreditTransaction => debitCreditTransaction.entryUniqueName)];
        } else {
            entryUniqueNames = [
                ...debitTrx?.filter(f => f.isChecked).map(dt => dt.entryUniqueName),
                ...creditTrx?.filter(f => f.isChecked).map(ct => ct.entryUniqueName),
            ];
        }
        this.entryUniqueNamesForBulkAction.push(...entryUniqueNames);

        if (!this.entryUniqueNamesForBulkAction || !this.entryUniqueNamesForBulkAction.length) {
            this.toaster.showSnackBar("error", this.localeData?.select_one_entry, this.commonLocaleData?.app_error);
            return;
        }
        switch (actionType) {
            case 'delete':
                this.showBulkActionConfirmationModal();
                break;
            case 'generate':
                this.showBulkActionGenerateVoucherModal();
                break;
            case 'upload':
                fileInput.click();
                break;
            default:
                this.toaster.showSnackBar("warning", this.localeData?.select_valid_action, this.commonLocaleData?.app_warning);
        }
    }

    /**
     * Handle Select all entries
     *
     * @param {MatCheckboxChange} event
     * @param {('debit' | 'credit' | 'all')} type
     * @memberof LedgerComponent
     */
    public selectAllEntries(event: MatCheckboxChange, type: 'debit' | 'credit' | 'all'): void {
        if (!event?.checked) {
            if (type === 'all') {
                if (this.ledgerView === LedgerViewEnum.StatementView) {
                    this.statementViewSelectAll = false;
                } else {
                    this.debitCreditSelectAll = false;
                }
            } else if (type === 'debit') {
                this.debitSelectAll = false;
            } else {
                this.creditSelectAll = false;
            }
            this.selectedTrxWhileHovering = null;
        }
        this.checkedTrxWhileHovering = [];

        this.store.dispatch(this.ledgerActions.SelectDeSelectAllEntries(type, event?.checked));
    }

    /**
     * This will be use for select all bank entries
     *
     * @param {*} ev
     * @param {('debit' | 'credit' | 'all')} type
     * @memberof LedgerComponent
     */
    public selectAllBankEntries(event: any, type: 'debit' | 'credit' | 'all'): void {
        if (event?.checked) {
            if (type === 'debit') {
                this.lc.bankTransactionsDebitData?.forEach(response => {
                    this.selectedDebitTransactionIds.add(response.transactions[0]?.id);
                });
            } else {
                this.lc.bankTransactionsCreditData?.forEach(response => {
                    this.selectedCreditTransactionIds.add(response.transactions[0]?.id);
                });
            }
        } else {
            if (type === 'debit') {
                this.selectedDebitTransactionIds.clear();
            } else {
                this.selectedCreditTransactionIds.clear();
            }
        }
    }

    /**
     * This will be use for bank entry hovered
     *
     * @param {string} selectedBankTxnUniqueName
     * @memberof LedgerComponent
     */
    public bankEntryHovered(selectedBankTxnUniqueName: string): void {
        this.selectedBankTrxWhileHovering = selectedBankTxnUniqueName;
    }

    /**
     * This will be use for selecting bank entry
     *
     * @param {*} ev
     * @param {string} entryUniqueName
     * @param {*} id
     * @param {string} type
     * @memberof LedgerComponent
     */
    public selectEntryForBulkAction(event: any, entryUniqueName: string, id: any, type: string): void {
        if (entryUniqueName) {
            if (event?.checked) {
                if (type === 'credit') {
                    this.selectedCreditTransactionIds.add(id);
                } else if (type === 'debit') {
                    this.selectedDebitTransactionIds.add(id);
                }
            } else {
                if (type === 'credit') {
                    this.selectedCreditTransactionIds.delete(id);
                } else if (type === 'debit') {
                    this.selectedDebitTransactionIds.delete(id);
                }
            }
        }
    }

    public entryHovered(uniqueName: string) {
        this.selectedTrxWhileHovering = uniqueName;
    }


    /**
     * Handle entry select
     *
     * @param {MatCheckboxChange} event
     * @param {string} uniqueName
     * @param {string} type
     * @memberof LedgerComponent
     */
    public entrySelected(event: MatCheckboxChange, uniqueName: string, type: string) {
        if (this.ledgerTransactions?.debitCreditTransactions?.length) {
            const totalLength = this.ledgerTransactions?.debitCreditTransactions.length;
            if (event?.checked) {
                this.checkedTrxWhileHovering.push({ type, uniqueName });
                this.store.dispatch(this.ledgerActions.SelectGivenEntries([uniqueName]));
                this.statementViewSelectAll = this.ledgerTransactions.debitCreditTransactions.every(transaction => transaction?.isChecked);
            } else {
                let itemIndx = this.checkedTrxWhileHovering?.findIndex((item) => item?.uniqueName === uniqueName);
                this.checkedTrxWhileHovering.splice(itemIndx, 1);
                const currentLength = this.isTabletScreen ?
                    this.checkedTrxWhileHovering?.length
                    : this.checkedTrxWhileHovering?.filter(transaction => transaction?.type === type)?.length;
                if (this.checkedTrxWhileHovering && (currentLength === 0 || currentLength < totalLength)) {
                    this.statementViewSelectAll = false;
                    this.selectedTrxWhileHovering = '';
                }

                this.lc.selectedTxnUniqueName = null;
                this.store.dispatch(this.ledgerActions.DeSelectGivenEntries([uniqueName]));
            }

        } else {
            const totalLength = (type === 'debit') ? this.ledgerTransactions.debitTransactions?.length :
                (type === 'credit') ? this.ledgerTransactions.creditTransactions?.length :
                    (this.ledgerTransactions.debitTransactions?.length + this.ledgerTransactions.creditTransactions?.length);
            if (event?.checked) {
                this.checkedTrxWhileHovering.push({ type, uniqueName });
                this.store.dispatch(this.ledgerActions.SelectGivenEntries([uniqueName]));
                const currentLength = this.isTabletScreen ?
                    this.checkedTrxWhileHovering?.length
                    : this.checkedTrxWhileHovering.filter(transaction => transaction?.type === type)?.length;
                if (currentLength === totalLength) {
                    if (type === 'credit') {
                        this.creditSelectAll = true;
                    } else if (type === 'debit') {
                        this.debitSelectAll = true;
                    } else {
                        this.debitCreditSelectAll = true;
                    }
                } else {
                    if (type === 'credit') {
                        this.creditSelectAll = false;
                    } else if (type === 'debit') {
                        this.debitSelectAll = false;
                    } else {
                        this.debitCreditSelectAll = false;
                    }
                }
            } else {
                let itemIndx = this.checkedTrxWhileHovering?.findIndex((item) => item?.uniqueName === uniqueName);
                this.checkedTrxWhileHovering.splice(itemIndx, 1);
                const currentLength = this.isTabletScreen ?
                    this.checkedTrxWhileHovering?.length
                    : this.checkedTrxWhileHovering?.filter(transaction => transaction?.type === type)?.length;
                if (this.checkedTrxWhileHovering && (currentLength === 0 || currentLength < totalLength)) {
                    if (type === 'credit') {
                        this.creditSelectAll = false;
                    } else if (type === 'debit') {
                        this.debitSelectAll = false;
                    } else {
                        this.debitCreditSelectAll = false;
                    }
                    this.selectedTrxWhileHovering = '';
                }

                this.lc.selectedTxnUniqueName = null;
                this.store.dispatch(this.ledgerActions.DeSelectGivenEntries([uniqueName]));
            }
        }
    }

    public showBulkActionConfirmationModal(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_entries_title,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.delete_entries_content
            },
            width: '650px',
            role: 'alertdialog',
            ariaLabel: 'confirmation'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.onConfirmationBulkActionConfirmation();
            } else {
                this.entryUniqueNamesForBulkAction = [];
            }
        });
    }

    public onConfirmationBulkActionConfirmation() {
        this.store.dispatch(this.ledgerActions.DeleteMultipleLedgerEntries(this.lc.accountUnq, cloneDeep(this.entryUniqueNamesForBulkAction)));
        this.entryUniqueNamesForBulkAction = [];
    }

    public showBulkActionGenerateVoucherModal(): void {
        let dialogRef = this.dialog.open(GenerateVoucherConfirmationModalComponent, {
            panelClass: "mat-dialog-md",
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.select_voucher_generate,
                button1Text: this.commonLocaleData?.app_generate_multiple,
                button2Text: this.commonLocaleData?.app_generate_compound
            },
            role: 'alertdialog',
            ariaLabel: 'bulk'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (typeof response === "boolean") {
                this.onSelectInvoiceGenerateOption(response);
            }
        });
    }

    /**
     * Uploads attachment
     *
     * @memberof LedgerComponent
     */
    public uploadFile(): void {
        const selectedFile: any = document.getElementById("BulkUploadfileInput");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob, file) => {
                this.isFileUploading = true;
                this.loaderService.show();

                this.commonService.uploadFile({ file: blob, fileName: file.name, entries: cloneDeep(this.entryUniqueNamesForBulkAction).join() }, true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isFileUploading = false;
                    this.loaderService.hide();
                    if (response?.status === 'success') {
                        this.entryUniqueNamesForBulkAction = [];
                        this.getTransactionData();
                        this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.toaster.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }

    public onSelectInvoiceGenerateOption(isCombined: boolean, generateEInvoice?: boolean) {
        this.isCombined = isCombined;
        this.entryUniqueNamesForBulkAction = uniq(this.entryUniqueNamesForBulkAction);
        this.entryUniqueNamesForBulkActionDuplicateCopy = cloneDeep(this.entryUniqueNamesForBulkAction);
        if (this.voucherApiVersion === 2) {
            this.store.dispatch(this.ledgerActions.GenerateBulkLedgerInvoice({ combined: isCombined }, { entryUniqueNames: cloneDeep(this.entryUniqueNamesForBulkAction), generateEInvoice: generateEInvoice }, 'ledger'));
        } else {
            this.store.dispatch(this.ledgerActions.GenerateBulkLedgerInvoice({ combined: isCombined }, [{ accountUniqueName: this.lc.accountUnq, entries: cloneDeep(this.entryUniqueNamesForBulkAction), generateEInvoice: generateEInvoice }], 'ledger'));
        }
    }

    public openSelectFilePopup(fileInput: any) {
        if (!this.entryUniqueNamesForBulkAction || !this.entryUniqueNamesForBulkAction.length) {
            this.toaster.showSnackBar("error", this.localeData?.select_one_entry, this.commonLocaleData?.app_error);
            return;
        }
        fileInput.click();
    }

    /**
     * Open ledger aside pane
     *
     * @memberof LedgerComponent
     */
    public openLedgerAsidePaneDialog(): void {
        this.ledgerAsidePaneDialogRef = this.dialog.open(this.ledgerAsidePane, ASIDE_PANE_CONFIG);

        this.ledgerAsidePaneDialogRef.afterClosed().subscribe(() => {
            setTimeout(() => {
                if (this.showPageLeaveConfirmation) {
                    this.pageLeaveUtilityService.addBrowserConfirmationDialog();
                }
                this.ledgerAsidePaneDialogRef = undefined;
                if (this.ledgerView === LedgerViewEnum.StatementView) {
                    this.focusDebitCreditDropdowns(null);
                }
            }, 100);
        });

        this.cdRf.detectChanges();
    }

    public toggleOtherTaxesAsidePane(updateLedgerModalVm: any): void {
        if (updateLedgerModalVm) {
            this.updateLedgerModalVm = updateLedgerModalVm;
            this.asideMenuStateForOtherTaxesDialogRef = this.dialog.open(this.asideMenuStateForOtherTaxes, ASIDE_PANE_CONFIG);
            this.cdRf.detectChanges();
        } else {
            this.asideMenuStateForOtherTaxesDialogRef?.close();
        }
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal): void {
        if (this.updateLedgerComponentInstance) {
            this.updateLedgerComponentInstance.vm.calculateOtherTaxes(modal);
        }
    }

    /**
     * deleteBankTxn
     */
    public deleteBankTxn(transactionId) {
        this.ledgerService.DeleteBankTransaction(transactionId).pipe(takeUntil(this.destroyed$)).subscribe((res: BaseResponse<any, string>) => {
            if (res?.status === 'success') {
                this.toaster.showSnackBar("success", this.localeData?.bank_transaction_deleted);
            }
        });
    }

    // endregion

    public toggleCurrency(event) {
        let isThereBlankEntry = this.lc.blankLedger?.transactions.some(s => s?.selectedAccount);
        if (isThereBlankEntry) {
            this.toaster.showSnackBar("error", this.localeData?.save_unfinished_entry);
            return false;
        }
        this.selectedCurrency = event?.checked ? 1 : 0;
        this.currencyTogglerModel = this.selectedCurrency === 1;
        this.assignPrefixAndSuffixForCurrency();
        this.trxRequest.accountCurrency = this.selectedCurrency !== 1;
        this.getCurrencyRate();

        // assign multi currency details to new ledger component
        this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
        this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
        this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
        // If the currency toggle button is checked then it is not in account currency
        this.lc.blankLedger.valuesInAccountCurrency = !event?.checked;

        this.getTransactionData();
    }

    public toggleCurrencyForDisplayInNewLedger(res: string) {
        this.getCurrencyRate(res);
    }

    /**
     * Handle ledger view change
     *
     * @param {MatSlideToggleChange} event
     * @memberof LedgerComponent
     */
    public toggleLedgerView(event: MatSlideToggleChange): void {
        this.ledgerView = event.checked ? LedgerViewEnum.TView : LedgerViewEnum.StatementView;
        this.ledgerComponentStore.updateAccount({
            model: {
                ledgerView: this.ledgerView as TLedgerView
            },
            accountUniqueName: this.accountUniqueName
        });
        if (this.currentOrganizationType === OrganizationType.Branch ||
            (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) {
            this.setBlankLedgerTransactions();
        }
    }

    public getAdvanceSearchTxn() {
        this.isAdvanceSearchImplemented = true;
        if (!this.todaySelected) {
            this.store.dispatch(this.ledgerActions.doAdvanceSearch(cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
                dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT), dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT),
                this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q, this.currentBranch?.uniqueName, this.advanceSearchRequest.paginationToken));
        } else {
            let from = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[0] ? dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : '';
            let to = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[1] ? dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : '';
            this.store.dispatch(this.ledgerActions.doAdvanceSearch(cloneDeep(this.advanceSearchRequest.dataToSend),
                this.advanceSearchRequest.accountUniqueName, from, to, this.advanceSearchRequest.page, this.advanceSearchRequest.count, null, this.currentBranch?.uniqueName, this.advanceSearchRequest.paginationToken)
            );
        }
        this.getLedgerStatementViewGridColumnsValue();
        this.cdRf.detectChanges();
    }

    public getInvoiceLists(request) {
        this.invoiceList = [];
        this.ledgerService.GetInvoiceList(request).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            lodashMap(res?.body?.invoiceList, (o) => {
                this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
            });
            uniqBy(this.invoiceList, 'value');
        });
    }

    public keydownPressed(e) {
        if (e?.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e?.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.openLedgerAsidePaneDialog();
        } else {
            this.keydownClassAdded = false;
        }

    }

    public getReconciledBack() {
        this.closingBalanceBeforeReconcile = null;
        this.getBankTransactions();
        this.getTransactionData();
    }

    /**
     * Handle amount input
     *
     * @param {TransactionVM} transaction Current transaction
     * @memberof LedgerComponent
     */
    public handleAmountInput(transaction: TransactionVM, isStockInclusiveEntry?: boolean): void {
        if (isStockInclusiveEntry) {
            if (transaction?.total !== undefined) {
                transaction.total = Number(transaction.total);
            }
        } else {
            if (transaction?.amount !== undefined) {
                transaction.amount = Number(transaction.amount);
            }
        }
        this.needToReCalculate.next(true);
    }

    /**
     * Branch change handler
     *
     * @memberof LedgerComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.isBranchTransactionSelected = !(selectedEntity?.isCompany);
        this.currentBranch.name = selectedEntity.label;
        this.trxRequest.branchUniqueName = selectedEntity?.value;
        this.advanceSearchRequest.branchUniqueName = selectedEntity?.value;
        if (this.isAdvanceSearchImplemented) {
            this.getAdvanceSearchTxn();
        } else {
            this.getTransactionData();
        }
    }

    /**
     * Handles RCM section visinility based on provided transaction details
     *
     * @private
     * @param {*} transaction Transaction details which will decide if transaction is RCM applicable
     * @memberof LedgerComponent
     */
    private handleRcmVisibility(transaction: TransactionVM): void {
        let formattedCurrentLedgerAccountParentGroups = [];
        if (transaction?.selectedAccount && !transaction?.selectedAccount.parentGroups[0]?.uniqueName) {
            formattedCurrentLedgerAccountParentGroups = transaction?.selectedAccount.parentGroups.map(parent => ({ uniqueName: parent }));
        }
        const currentLedgerAccountDetails = {
            uniqueName: this.lc.activeAccount ? this.lc.activeAccount?.uniqueName : '',
            parentGroups: this.lc.activeAccount && this.lc.activeAccount.parentGroups ? this.lc.activeAccount.parentGroups : []
        };
        const selectedAccountDetails = {
            uniqueName: transaction?.selectedAccount ? transaction?.selectedAccount?.uniqueName : '',
            parentGroups: formattedCurrentLedgerAccountParentGroups?.length ? formattedCurrentLedgerAccountParentGroups : transaction?.selectedAccount ? transaction?.selectedAccount.parentGroups : []
        };
        const shouldShowRcmEntry = this.generalService.shouldShowRcmSection(currentLedgerAccountDetails, selectedAccountDetails, this.activeCompany);
        if (this.lc && this.lc.currentBlankTxn) {
            this.lc.currentBlankTxn['shouldShowRcmEntry'] = shouldShowRcmEntry;
        }
    }

    /**
     * Handles the taxable amount and ITC section visibility based on conditions
     *
     * @private
     * @param {TransactionVM} transaction Selected transaction
     * @returns {void}
     * @memberof LedgerComponent
     */
    private handleTaxableAmountVisibility(transaction: TransactionVM): void {
        this.shouldShowRcmTaxableAmount = false;
        this.shouldShowItcSection = false;
        if (!this.lc || !this.lc.activeAccount || !this.lc.activeAccount.parentGroups || this.lc.activeAccount.parentGroups?.length < 2) {
            return;
        }
        if (!transaction?.selectedAccount || !transaction?.selectedAccount.parentGroups || transaction?.selectedAccount.parentGroups.length < 2) {
            return;
        }
        const currentLedgerSecondParent: any = this.lc.activeAccount.parentGroups[1]?.uniqueName ?? this.lc.activeAccount.parentGroups[1];
        const selectedAccountSecondParent: any = transaction?.selectedAccount.parentGroups[1]?.uniqueName ?? transaction?.selectedAccount.parentGroups[1];
        this.checkTouristSchemeApplicable(currentLedgerSecondParent, selectedAccountSecondParent);
        if (currentLedgerSecondParent === 'reversecharge' && transaction?.type === TransactionType.Credit) {
            // Current ledger is of reverse charge and user has entered the transaction on the right side (CREDIT) of the ledger
            if (selectedAccountSecondParent === 'dutiestaxes') {
                /* Particular account belongs to the Duties and taxes then check the country based on which
                    respective sections will be displayed */
                if (this.activeCompany?.country === 'United Arab Emirates') {
                    this.shouldShowRcmTaxableAmount = true;
                }
                if (this.activeCompany?.country === 'India') {
                    this.shouldShowItcSection = true;
                }
            }
        } else if (currentLedgerSecondParent === 'dutiestaxes' && transaction?.type === TransactionType.Debit) {
            // Current ledger is of Duties and taxes and user has entered the transaction on the left side (DEBIT) of the ledger
            if (selectedAccountSecondParent === 'reversecharge') {
                /* Particular account belongs to the Reverse charge then check the country based on which
                    respective sections will be displayed */
                if (this.activeCompany?.country === 'United Arab Emirates') {
                    this.shouldShowRcmTaxableAmount = true;
                }
                if (this.activeCompany?.country === 'India') {
                    this.shouldShowItcSection = true;
                }
            }
        }
    }

    /**
     * To check tourist scheme applicable or not
     *
     * @param {string} [activeLedgerParentgroup] active ledger parent group unique name
     * @param {string} [selectedAccountParentGroup] selected account parent group unique name
     * @memberof LedgerComponent
     */
    public checkTouristSchemeApplicable(activeLedgerParentgroup: string, selectedAccountParentGroup: string): void {
        if (this.profileObj && this.profileObj.countryV2 && this.profileObj.countryV2.alpha2CountryCode && this.profileObj.countryV2.alpha2CountryCode === 'AE' && activeLedgerParentgroup && selectedAccountParentGroup && (this.allowParentGroup.includes(activeLedgerParentgroup)) && (this.allowParentGroup.includes(selectedAccountParentGroup))) {
            this.isTouristSchemeApplicable = true;
        } else {
            this.isTouristSchemeApplicable = false;
        }
    }

    /**
     * To show columnar report table
     *
     * @param {{ isShowColumnarTable: boolean, exportRequest: ExportLedgerRequest }} event Ccolumnar report emmiter event object
     * @memberof LedgerComponent
     */
    public onShowColumnarReportTable(event: { isShowColumnarTable: boolean, exportRequest: ExportLedgerRequest }): void {
        let advanceSearch = cloneDeep(this.advanceSearchRequest)
        if (!advanceSearch.dataToSend.bsRangeValue) {
            this.universalDate$.pipe(take(1)).subscribe(date => {
                if (date) {
                    advanceSearch.dataToSend.bsRangeValue = [dayjs(date[0], GIDDH_DATE_FORMAT).toDate(), dayjs(date[1], GIDDH_DATE_FORMAT).toDate()];
                }
            });
        }

        if (!event.isShowColumnarTable) {
            event.exportRequest.from = dayjs(advanceSearch.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? dayjs(advanceSearch.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : dayjs().add(-1, 'month').format(GIDDH_DATE_FORMAT);
            event.exportRequest.to = dayjs(advanceSearch.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? dayjs(advanceSearch.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : dayjs().format(GIDDH_DATE_FORMAT);
        }

        this.isShowLedgerColumnarReportTable = event.isShowColumnarTable;
        this.columnarReportExportRequest = event.exportRequest;

        this.cdRf.detectChanges();
    }

    /**
     * This will toggle transaction type for mobile
     *
     * @param {string} transactionType
     * @memberof LedgerComponent
     */
    public toggleMobileTransactionType(transactionType: string): void {
        this.visibleTransactionTypeMobile = transactionType;
        this.arrangeLedgerTransactionsForMobile();
    }

    /**
     * This will merge transactions of debit/credit based on visible transaction type for mobile
     *
     * @memberof LedgerComponent
     */
    public arrangeLedgerTransactionsForMobile(): void {
        if (this.ledgerTransactions) {
            this.allTransactionsList = [];
            this.allTransactionDates = [];
            let index = 0;

            if (this.visibleTransactionTypeMobile === "debit" && this.ledgerTransactions.debitTransactions) {
                this.ledgerTransactions.debitTransactions?.forEach(transaction => {
                    if (this.allTransactionsList[transaction?.entryDate] === undefined) {
                        this.allTransactionsList[transaction?.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction?.entryDate].push(transaction);
                    index++;
                });
            } else if (this.visibleTransactionTypeMobile === "credit" && this.ledgerTransactions.creditTransactions) {
                this.ledgerTransactions.creditTransactions?.forEach(transaction => {
                    if (this.allTransactionsList[transaction?.entryDate] === undefined) {
                        this.allTransactionsList[transaction?.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction?.entryDate].push(transaction);
                    index++;
                });
            } else {
                this.ledgerTransactions.debitTransactions?.forEach(transaction => {
                    if (this.allTransactionsList[transaction?.entryDate] === undefined) {
                        this.allTransactionsList[transaction?.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction?.entryDate].push(transaction);
                    index++;
                });
                this.ledgerTransactions.creditTransactions?.forEach(transaction => {
                    if (this.allTransactionsList[transaction?.entryDate] === undefined) {
                        this.allTransactionsList[transaction?.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction?.entryDate].push(transaction);
                    index++;
                });
            }

            if (this.allTransactionsList) {
                this.allTransactionDates = Object.keys(this.allTransactionsList);
            }
        }
    }

    /**
     * Toggles the universal datepicker menu based on screen size
     *
     * @param {boolean} isOpen - Whether to open or close the menu
     * @memberof LedgerComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        const activeTrigger = this.getActiveDatepickerTrigger();
        if (isOpen) {
            activeTrigger?.openMenu();
        } else {
            activeTrigger?.closeMenu();
        }
    }

    /**
     * Gets the appropriate datepicker trigger based on current screen size
     *
     * @private
     * @returns {MatMenuTrigger} The active trigger for current screen size
     * @memberof LedgerComponent
     */
    private getActiveDatepickerTrigger(): MatMenuTrigger {
        // Try to get the currently visible trigger based on screen size
        if (this.isTabletScreen && this.mobileUniversalDatepickerTrigger) {
            return this.mobileUniversalDatepickerTrigger;
        } else if (!this.isTabletScreen && this.desktopUniversalDatepickerTrigger) {
            return this.desktopUniversalDatepickerTrigger;
        } else if (this.ipadUniversalDatepickerTrigger) {
            return this.ipadUniversalDatepickerTrigger;
        }
        // Fallback to any available trigger
        return this.desktopUniversalDatepickerTrigger || this.mobileUniversalDatepickerTrigger || this.ipadUniversalDatepickerTrigger;
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof LedgerComponent
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

            this.selectedDate(value);
        }
    }

    /**
     * Loads the default search suggestion when ledger module is loaded and
     * when ledger is changed
     *
     * @private
     * @memberof LedgerComponent
     */
    private loadDefaultSearchSuggestions(): void {
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
     * This will save the other tax in ledger object
     *
     * @param {*} item
     * @param {*} event
     * @memberof LedgerComponent
     */
    public saveOtherTax(item: any, event: any): void {
        item.otherTaxesSum = event.otherTaxesSum;
        item.tdsTcsTaxesSum = event.tdsTcsTaxesSum;
        item.isOtherTaxesApplicable = event.isOtherTaxesApplicable;
        item.otherTaxModal = event.otherTaxModal;
        item.otherTaxType = event.otherTaxType;
    }

    /**
     * This will show the bank statement upload modal
     *
     * @memberof LedgerComponent
     */
    public showUploadBankStatementModal(): void {
        let dialogRef = this.dialog.open(ImportStatementComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                accountUniqueName: this.lc.accountUnq,
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData,
                returnUrl: this.router.url
            },
            role: 'alertdialog',
            ariaLabel: 'import',
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.getBankTransactions();
            }
        });
    }

    /**
     * Callback for date change
     *
     * @param {*} item
     * @memberof LedgerComponent
     */
    public onChangeEntryDate(item: any): void {
        if (item && item.entryDate) {
            if (typeof item.entryDate !== 'string') {
                item.entryDate = dayjs(item.entryDate).format(GIDDH_DATE_FORMAT);
            }
        }
    }

    /**
     * To change pagination page number
     *
     * @param {*} event Pagination change event
     * @memberof LedgerComponent
     */
    public pageChanged(event: any): void {
        if (typeof event === 'string') {
            if (this.isAdvanceSearchImplemented && !this.trxRequest.q?.length) {
                this.advanceSearchRequest.paginationToken = event;
                this.getAdvanceSearchTxn();
            } else {
                this.trxRequest.paginationToken = event;
                this.getTransactionData();
            }
        }
    }

    /**
     * This will change bank transactions pagination page number
     *
     * @param {*} event
     * @memberof LedgerComponent
     */
    /**
     * Handles pagination events for bank transactions
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof LedgerComponent
     */
    public handlePageEvent(event: PageEvent): void {
        if (this.bankTransactionsResponse.countPerPage !== event.pageSize) {
            this.bankTransactionsResponse.page = 1;
        } else {
            this.bankTransactionsResponse.page = event.pageIndex + 1;
        }
        this.bankTransactionsResponse.countPerPage = event.pageSize;
        this.getBankTransactions(true);
    }

    /**
     * Focuses on the ledger header element
     *
     * @private
     * @memberof LedgerComponent
     */
    private focusOnLedgerHeader(): void {
        setTimeout(() => {
            const element = document.getElementById('ledgerBankTransactionsHeader');
            if (element) {
                element.focus();
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof LedgerComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            observableCombineLatest([this.lc.activeAccount$, this.lc.companyProfile$]).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data[0] && data[1]) {
                    let profile = cloneDeep(data[1]);
                    this.lc.activeAccount = data[0];
                    if (this.isBankAccount) {
                        this.getAllBankAccounts();
                    }
                    if (data[0]?.ledgerView) {
                        this.ledgerView = data[0].ledgerView;
                        if (this.currentOrganizationType === OrganizationType.Branch ||
                            (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) {
                            this.setBlankLedgerTransactions();
                        }
                    }

                    this.loadDefaultSearchSuggestions();
                    this.profileObj = profile;
                    this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                    this.entryUniqueNamesForBulkAction = [];
                    this.needToShowLoader = true;
                    this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
                    this.getBankTransactions();
                    let accountDetails: AccountResponse | AccountResponseV2 = data[0];
                    let parentOfAccount = (accountDetails?.parentGroups?.length) ? accountDetails?.parentGroups[0] : null;

                    this.lc.getUnderstandingText(accountDetails?.accountType, accountDetails?.name, accountDetails?.parentGroups, this.localeData);
                    this.accountUniqueName = accountDetails?.uniqueName;

                    this.isBankOrCashAccount = accountDetails?.parentGroups?.some((grp) => grp?.uniqueName === 'bankaccounts' || grp?.uniqueName === 'loanandoverdraft');
                    if (accountDetails?.currency && profile?.baseCurrency) {
                        this.isLedgerAccountAllowsMultiCurrency = accountDetails.currency && accountDetails.currency !== profile?.baseCurrency;
                    } else {
                        this.isLedgerAccountAllowsMultiCurrency = false;
                    }
                    this.foreignCurrencyDetails = { code: profile?.baseCurrency, symbol: profile.baseCurrencySymbol };
                    if (this.isLedgerAccountAllowsMultiCurrency) {
                        this.baseCurrencyDetails = { code: accountDetails?.currency, symbol: accountDetails?.currencySymbol };
                        this.getCurrencyRate();
                    } else {
                        this.baseCurrencyDetails = this.foreignCurrencyDetails;
                        this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: 1 };
                    }
                    this.selectedCurrency = 0;
                    this.assignPrefixAndSuffixForCurrency();

                    // assign multi currency details to new ledger component
                    this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
                    this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                    this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);

                    // tcs tds identification
                    if (['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'currentassets', 'noncurrentassets', 'fixedassets'].includes(parentOfAccount?.uniqueName)) {
                        this.tcsOrTds = ['indirectexpenses', 'operatingcost'].includes(parentOfAccount?.uniqueName) ? 'tds' : 'tcs';

                        // for tcs and tds identification
                        if (this.tcsOrTds === 'tcs') {
                            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
                        } else {
                            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
                        }
                    }
                    profile.userEntityRoles?.forEach(role => {
                        const scopes = role.role.scopes;
                        if (scopes && scopes.some(scope => scope.name === 'INTEGRATION')) {
                            this.hasIntegrationScope = true;
                        }
                    });
                    if (profile && profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                        this.isGocardlessSupportedCountry = this.generalService.checkCompanySupportGoCardless(profile.countryV2.alpha2CountryCode);
                    }
                }
            });
        }
    }

    /**
     * This returns the transaction id of item
     *
     * @param {number} index
     * @param {*} item
     * @returns {*}
     * @memberof LedgerComponent
     */
    public trackByTransactionId(index: number, item: any): any {
        return item.transactionId;
    }

    /**
     * This will show bulk delete bank transactions modal
     *
     * @memberof LedgerComponent
     */
    public showBulkDeleteBankTransactionsConfirmationModal(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_bank_transactions_title,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            },
            role: 'alertdialog',
            ariaLabel: 'confirmation'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.deleteBankTransactions();
            }
        });
    }

    /**
     * This will call api to delete bank transactions
     *
     * @memberof LedgerComponent
     */
    public deleteBankTransactions(): void {
        let params = { transactionIds: [...this.selectedCreditTransactionIds, ...this.selectedDebitTransactionIds] };
        this.ledgerService.deleteBankTransactions(this.trxRequest.accountUniqueName, params).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.bankTransactionsResponse.page = this.generalService.adjustPageIndex(this.bankTransactionsResponse?.creditTransactionsCount + this.bankTransactionsResponse?.debitTransactionsCount, this.bankTransactionsResponse?.page, this.bankTransactionsResponse?.countPerPage, this.selectedCreditTransactionIds.size + this.selectedDebitTransactionIds.size);
                this.getBankTransactions();
                this.selectedCreditTransactionIds.clear();
                this.selectedDebitTransactionIds.clear();
                this.toaster.showSnackBar("success", response?.body);
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Track by function for normal transactions
     *
     * @param {number} index Current normal transaction index
     * @param {*} transaction Normal transaction data
     * @return {*}  {string} Unique name
     * @memberof LedgerComponent
     */
    public trackByTransactionUniqueName(index: number, transaction: any): string {
        return transaction?.entryUniqueName;
    }

    /**
     * Track by function for bank transactions
     *
     * @param {number} index Current bank transaction index
     * @param {*} transaction Bank transaction data
     * @return {*}  {string} Unique transaction ID
     * @memberof LedgerComponent
     */
    public trackById(index: number, transaction: any): string {
        return transaction?.id;
    }

    /**
     * This maintains state of datepicker (open/closed)
     *
     * @param {*} event
     * @memberof LedgerComponent
     */
    public datepickerState(event: any): void {
        this.isDatepickerOpen = event;
    }

    /**
     * This will keep the track of touch event and will check if double clicked on any transaction, it will open the update ledger modal
     *
     * @param {ITransactionItem} txn
     * @param {LedgerType} ledgerType
     * @memberof LedgerComponent
     */
    public showUpdateLedgerModalIpad(txn: ITransactionItem, ledgerType: LedgerType): void {
        if (this.touchedTransaction?.entryUniqueName === txn?.entryUniqueName) {
            this.showUpdateLedgerModal(txn, ledgerType);
        } else {
            this.touchedTransaction = txn;
        }

        setTimeout(() => {
            this.touchedTransaction = {};
        }, 200);
    }

    /**
     * Handler for more detail open in CREATE ledger
     *
     * @param {boolean} isOpened True, if more detail is opened while creating new ledger entry
     * @memberof LedgerComponent
     */
    public handleOpenMoreDetail(isOpened: boolean): void {
        this.isMoreDetailsOpened = isOpened;
    }

    /**
     * This will merge the duplicate voucher entry
     *
     * @memberof LedgerComponent
     */
    public confirmMergeEntry(): void {
        this.lc.blankLedger.mergePB = true;
        this.saveBlankTransaction();
    }

    /**
     * This will close the merge popup
     *
     * @memberof LedgerComponent
     */
    public cancelMergeEntry(): void {
        this.lc.showNewLedgerPanel = true;
    }

    /**
     * This will confirm E-Invoice voucher generation
     *
     * @memberof LedgerComponent
     */
    public confirmEInvoiceEntry(generateEInvoice: boolean): void {
        this.lc.blankLedger.generateEInvoice = generateEInvoice;
        this.saveBlankTransaction();
    }

    /**
     * Download files (voucher/attachment)
     *
     * @param {*} transaction
     * @param {string} downloadOption
     * @memberof LedgerComponent
     */
    public downloadFiles(transaction: any, downloadOption: string, event: any): void {
        if (this.voucherApiVersion === 2) {
            let dataToSend = {
                voucherType: transaction?.voucherGeneratedType,
                entryUniqueName: (transaction?.voucherUniqueName) ? undefined : transaction?.entryUniqueName,
                uniqueName: (transaction?.voucherUniqueName) ? transaction?.voucherUniqueName : undefined
            };

            let fileName = (downloadOption === "VOUCHER") ? transaction?.voucherNumber + '.pdf' : transaction?.attachedFileName;

            this.commonService.downloadFile(dataToSend, downloadOption, 'pdf').pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status !== "error") {
                    saveAs(response, fileName);
                } else {
                    this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
                }
            }, (error => {
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }));
        } else {
            if (downloadOption === "VOUCHER") {
                this.downloadInvoice(transaction, event);
            } else {
                this.downloadAttachedFile(transaction?.attachedFileUniqueName, event);
            }
        }
    }

    /**
     * Shows the attachments popup
     *
     * @param {TemplateRef<any>} templateRef
     * @param {*} transaction
     * @param {boolean} [isAttachment=false]
     * @memberof LedgerComponent
     */
    public openAttachmentsDialog(templateRef: TemplateRef<any>, transaction: any, isAttachment: boolean = false): void {
        transaction['isAttachment'] = isAttachment;
        this.selectedItem = transaction;
        let dialogRef = this.dialog.open(templateRef, {
            width: '70%',
            height: '790px',
            maxHeight: '90vh',
            role: 'alertdialog',
            ariaLabel: 'template',
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(response => {
            if (this.isAdvanceSearchImplemented) {
                this.createLedgerBalance();
                this.store.dispatch(this.ledgerActions.doAdvanceSearch(cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, this.trxRequest.from, this.trxRequest.to, this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q, this.advanceSearchRequest.branchUniqueName));
            } else {
                this.getTransactionData();
            }
        });
    }

    /**
     * This function is used to get purchase settings from store
     *
     * @memberof LedgerComponent
     */
    public getPurchaseSettings(): void {
        this.store.pipe(select(state => state.invoice.settings), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.invoiceSettings = response;
                this.autoGenerateVoucherFromEntryStatus = response?.invoiceSettings?.autoGenerateVoucherFromEntry;
                if (response?.purchaseBillSettings && !response?.purchaseBillSettings?.enableVoucherDownload) {
                    this.restrictedVouchersForDownload.push(AdjustedVoucherType.PurchaseInvoice);
                } else {
                    this.restrictedVouchersForDownload = this.restrictedVouchersForDownload?.filter(voucherType => voucherType !== AdjustedVoucherType.PurchaseInvoice);
                }
                this.cdRf.detectChanges();
            }
        });
    }

    /**
     * This will use for run autopaid only for sundrydebtor and sundrycreidtor accounts
     *
     * @memberof LedgerComponent
     */
    public showAutopaidModal(): void {
        let dialogRef = this.dialog?.open(ConfirmModalComponent, {
            width: '40%',
            panelClass: 'autopaid',
            data: {
                title: this.localeData?.autopaid_title,
                body: this.localeData?.autopaid_confirmation,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef?.afterClosed().subscribe(response => {
            if (response) {
                this.ledgerService.runAutopaid(this.trxRequest.accountUniqueName, this.trxRequest.branchUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toaster.showSnackBar("success", response?.body);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Load details of the selected account
     *
     * @private
     * @param {IOption} event Selection event
     * @param {TransactionVM} txn Transaction detauks
     * @param {string} [variantUniqueName] Uniquename of the variant
     * @memberof LedgerComponent
     */
    private loadDetails(event: IOption, txn: TransactionVM, variantUniqueName?: string, allowChangeDetection?: boolean, isBankTransaction?: boolean, transactionType?: string): void {
        let requestObject;
        if (event.additional?.stock) {
            this.selectedStockVariant.value = variantUniqueName;
            requestObject = {
                stockUniqueName: event.additional.stock?.uniqueName,
                oppositeAccountUniqueName: event.additional.uniqueName,
                customerUniqueName: this.isSundryDebtorCreditor ? this.lc.activeAccount?.uniqueName : event.additional.uniqueName,
                variantUniqueName
            };
        }
        const currentLedgerCategory = this.lc.activeAccount ? this.generalService.getAccountCategory(this.lc.activeAccount, this.lc.activeAccount?.uniqueName) : '';
        /** If current ledger is of income or expense category then send current ledger unique name else send particular account unique name
            to fetch the correct stock details as the first preference is always the current ledger account and then particular account
            This logic is only required in ledger.
        */
        const accountUniqueName = event.additional?.stock && (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses' || currentLedgerCategory === 'fixedassets') ?
            this.lc.activeAccount ? this.lc.activeAccount?.uniqueName : '' :
            event.additional?.uniqueName;
        this.searchService.loadDetails(accountUniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.body) {
                txn.showTaxationDiscountBox = false;
                const parentGroups = data.body.parentGroups;
                const isSundryDebtorCreditorGroup = parentGroups.includes(AccountingGroupEnum.SundryCreditors) || parentGroups.includes(AccountingGroupEnum.SundryDebtors);
                let taxes = [];
                let otherTax = new SalesOtherTaxesModal();
                
                const accountApplicableTaxes = this.lc.activeAccount.applicableTaxes ?? [];
                const accountOtherApplicableTaxes = this.lc.activeAccount.otherApplicableTaxes ?? [];
                const applicableTaxesExcludingOtherTaxes = accountApplicableTaxes.filter(applicableTax =>
                    !accountOtherApplicableTaxes.some(otherApplicableTax => (otherApplicableTax?.uniqueName ?? otherApplicableTax) === (applicableTax?.uniqueName ?? applicableTax))
                );
                const prioritizedApplicableTaxes = applicableTaxesExcludingOtherTaxes.length ? applicableTaxesExcludingOtherTaxes : accountOtherApplicableTaxes;

                if (!isSundryDebtorCreditorGroup) {
                    const stockGroupTax: string[] = [];
                    if (data.body?.stock?.groupTaxes) {
                        stockGroupTax.push(...this.companyTaxesList.filter(otherTax =>
                            data.body.stock?.groupTaxes?.includes(otherTax.uniqueName) && TCS_TDS_TAXES_TYPES.includes(otherTax.taxType)
                        ).map(tax => tax.uniqueName));
                        data.body.stock.groupTaxes = data.body.stock?.groupTaxes.filter(tax => !stockGroupTax.includes(tax));
                    }
                    const stockTax: string[] = [];
                    if (data.body?.stock?.taxes) {
                        stockTax.push(...this.companyTaxesList.filter(otherTax =>
                            data.body.stock?.taxes?.includes(otherTax.uniqueName) && TCS_TDS_TAXES_TYPES.includes(otherTax.taxType)
                        ).map(tax => tax.uniqueName));
                        data.body.stock.taxes = data.body.stock?.taxes.filter(tax => !stockTax.includes(tax));
                    }
                    
                    // Take taxes of parent group and stock's own taxes
                    taxes = this.generalService.fetchTaxesOnPriority(
                        data.body.stock?.taxes ?? [],
                        data.body.stock?.groupTaxes ?? [],
                        data.body.taxes ?? [],
                        data.body.groupTaxes ?? []);
                        const isSundryDebtorCreditorAccount = data.body.oppositeAccount?.parentGroups?.includes(AccountingGroupEnum.SundryCreditors) || data.body.oppositeAccount?.parentGroups?.includes(AccountingGroupEnum.SundryDebtors);
                        if (data.body.oppositeAccount && (isSundryDebtorCreditorAccount || stockGroupTax.length || stockTax.length)) {
                            const stockAccountOtherTax = this.generalService.fetchTaxesOnPriority(
                                                    stockGroupTax,
                                                    stockTax,
                                                    data.body.oppositeAccount.taxes ?? [],
                                                    data.body.oppositeAccount.groupTaxes ?? []);
                            otherTax.appliedOtherTax = {
                                name: '',
                                uniqueName: stockAccountOtherTax.length ? stockAccountOtherTax[0] : ''
                            };
                        }
                        const matchedTcsTdsTax = this.companyTaxesList.find(companyTax =>
                            prioritizedApplicableTaxes.some(tax => tax?.uniqueName === companyTax.uniqueName) && TCS_TDS_TAXES_TYPES.includes(companyTax.taxType));
                        if (prioritizedApplicableTaxes.length && !otherTax.appliedOtherTax?.uniqueName && matchedTcsTdsTax) {
                            otherTax.appliedOtherTax = {
                                name: matchedTcsTdsTax.name,
                                uniqueName: matchedTcsTdsTax.uniqueName
                            };
                        }
                } else {
                    taxes = prioritizedApplicableTaxes.map(tax => tax?.uniqueName);
                
                    const remainingBodyTaxes = data.body.taxes.filter(tax =>
                                    !data.body.groupTaxes.includes(tax));
                    if (remainingBodyTaxes.length) {
                        otherTax.appliedOtherTax = {
                            name: '',
                            uniqueName: remainingBodyTaxes[0]
                        };
                    } else if (data.body.applicableTaxes.length) {
                        otherTax.appliedOtherTax = {
                            name: data.body.applicableTaxes[0].name,
                            uniqueName: data.body.applicableTaxes[0].uniqueName
                        };
                    }
                }

                this.companyTaxesList.forEach(tax => {
                    if (tax.uniqueName === otherTax.appliedOtherTax?.uniqueName && TCS_TDS_TAXES_TYPES.includes(tax.taxType)) {
                        otherTax.appliedOtherTax.name = tax.name;
                    }
                })

                if (this.profileObj?.baseCurrency === this.lc.activeAccount?.currency) {
                    if (this.lc.activeAccount?.currency !== data.body?.currency.code) {
                        this.particularMultiCurrency = true;
                        this.baseCurrencyDetails = { code: this.lc.activeAccount?.currency, symbol: this.lc.activeAccount?.currencySymbol };
                        this.foreignCurrencyDetails = { code: data.body?.currency.code, symbol: data.body?.currency.symbol };
                        if (isBankTransaction) {
                            (transactionType === this.transactionType.Debit
                                ? this.lc.bankTransactionsDebitData
                                : this.lc.bankTransactionsCreditData)
                                .forEach((item) => {
                                    if (item.transactionId === txn.id) {
                                        item.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                                        item.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
                                        item.valuesInAccountCurrency = false;
                                        item.selectedCurrencyToDisplay = this.selectedCurrency;
                                        this.getCurrencyRate(null, isBankTransaction, item);
                                        this.cdRf.detectChanges();
                                        return item;
                                    } else {
                                        this.cdRf.detectChanges();
                                        return item;
                                    }
                                });
                        } else {
                            this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                            this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
                            this.lc.blankLedger.valuesInAccountCurrency = false;
                            this.getCurrencyRate();
                        }
                    } else {
                        this.particularMultiCurrency = false;
                        this.baseCurrencyDetails = { code: this.profileObj?.baseCurrency, symbol: this.profileObj?.baseCurrencySymbol };
                        this.foreignCurrencyDetails = this.baseCurrencyDetails;
                        if (isBankTransaction) {
                            (transactionType === this.transactionType.Debit
                                ? this.lc.bankTransactionsDebitData
                                : this.lc.bankTransactionsCreditData)
                                .forEach((item) => {
                                    if (item.transactionId === txn.id) {
                                        item.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                                        item.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
                                        item.valuesInAccountCurrency = true;
                                        item.selectedCurrencyToDisplay = this.selectedCurrency;
                                        item.exchangeRate = 1;
                                        this.cdRf.detectChanges();
                                        return item;
                                    } else {
                                        this.cdRf.detectChanges();
                                        return item;
                                    }
                                });
                        } else {
                            this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                            this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
                            this.lc.blankLedger.valuesInAccountCurrency = true;
                            this.lc.blankLedger.exchangeRate = 1;
                        }
                    }
                    setTimeout(() => {
                        this.cdRf.detectChanges();
                        this.needToReCalculate.next(true);
                    }, 500);
                }

                txn.selectedAccount = {
                    ...event.additional,
                    label: event.label,
                    name: event.label,
                    category: data.body.category,
                    value: event?.value,
                    isHilighted: true,
                    applicableTaxes: txn.duplicateEntry ? [] : taxes,
                    otherTax: txn?.duplicateEntry ? txn.selectedAccount?.otherTax : otherTax,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    email: data.body.emails,
                    isFixed: data.body.isFixed,
                    mergedAccounts: data.body.mergedAccounts,
                    mobileNo: data.body.mobileNo,
                    nameStr: event.additional?.stock ? data.body.oppositeAccount.parentGroups.join(', ') : (Array.isArray(data.body.parentGroups) ? data.body.parentGroups.map(parent => parent?.name).join(', ') : ''),
                    stock: txn.duplicateEntry ? txn?.inventory?.stock : data.body.stock,
                    uNameStr: event.additional?.stock ? data.body.oppositeAccount.parentGroups.join(', ') : (Array.isArray(data.body.parentGroups) ? data.body.parentGroups.map(parent => parent?.uniqueName ?? parent).join(', ') : ''),
                    accountApplicableDiscounts: txn.duplicateEntry ? txn?.discounts : data.body.applicableDiscounts,
                    parentGroups: event.additional?.stock ? data.body.oppositeAccount.parentGroups : data.body.parentGroups, // added due to parentGroups is getting null in search API
                };
                if (!txn?.duplicateEntry) {
                    this.lc.blankLedger.otherTaxModal = {
                        ...this.lc.blankLedger.otherTaxModal,
                        appliedOtherTax: {
                            name: otherTax?.appliedOtherTax?.name,
                            uniqueName: otherTax?.appliedOtherTax?.uniqueName
                        }
                    };
                    this.lc.blankLedger.isOtherTaxesApplicable = !!otherTax?.appliedOtherTax?.uniqueName;
                }
                if (txn?.selectedAccount && txn.selectedAccount.stock) {
                    txn.selectedAccount.stock.rate = Number((txn.selectedAccount.stock.rate / this.lc.blankLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                }
                if (!this.isHideBankLedgerPopup) {
                    this.lc.currentBlankTxn = txn;
                }
                let rate = 0;
                let quantity = 1;
                let unitCode = '';
                let stockName = '';
                let stockUniqueName = '';
                let stockUnitUniqueName = '';
                let variantUniqueName = '';
                let variantDiscount = '';

                txn.isMrpDiscountApplied = false;

                //#region unit rates logic
                if (txn?.selectedAccount?.stock) {
                    const stock = txn?.inventory?.stock;
                    if (txn?.duplicateEntry) {
                        const unitRate = stock.unitRates?.find(unitRate => unitRate.stockUnitUniqueName === txn?.inventory?.unit?.uniqueName) || stock.unitRates?.[0];
                        const defaultUnit = {
                            stockUnitCode: unitRate.stockUnitCode,
                            code: unitRate.stockUnitCode,
                            rate: unitRate.rate,
                            name: txn.selectedAccount.stock.name
                        };
                        txn.unitRate = stock.unitRates.map(unitRate => ({ ...unitRate, code: unitRate.stockUnitCode }));
                        stockName = defaultUnit.name;
                        rate = Number((defaultUnit.rate / this.lc.blankLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                        stockUniqueName = txn.selectedAccount.stock?.uniqueName;
                        unitCode = defaultUnit.code;
                        stockUnitUniqueName = unitRate.stockUnitUniqueName;

                        const hasMrpDiscount = stock.variant?.unitRates?.filter(variantDiscount => variantDiscount?.stockUnitUniqueName === stockUnitUniqueName);
                        if (hasMrpDiscount?.length) {
                            rate = Number((hasMrpDiscount[0].rate / this.lc.blankLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                        }
                        variantUniqueName = stock.variant?.uniqueName;
                        variantDiscount = stock.variant?.variantDiscount;
                        quantity = txn?.inventory?.quantity || 1;
                    } else {
                        stockUnitUniqueName = txn.selectedAccount.stock.stockUnitUniqueName;
                        const defaultUnitRates = (this.generalService.voucherApiVersion === 1 ? txn.selectedAccount?.stock?.unitRates : txn.selectedAccount?.stock?.variant?.unitRates).filter(unitRate => unitRate.stockUnitUniqueName === stockUnitUniqueName);
                        const defaultUnit = {
                            stockUnitCode: defaultUnitRates[0].stockUnitCode,
                            code: defaultUnitRates[0].stockUnitCode,
                            rate: defaultUnitRates[0].rate,
                            name: txn.selectedAccount.stock.name
                        };
                        const unitRates = this.generalService.voucherApiVersion === 1 ? txn.selectedAccount.stock?.unitRates : txn.selectedAccount.stock?.variant?.unitRates;
                        txn.unitRate = unitRates.map(unitRate => ({ ...unitRate, code: unitRate.stockUnitCode }));
                        stockName = defaultUnit.name;
                        rate = Number((defaultUnit.rate / this.lc.blankLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                        stockUniqueName = txn.selectedAccount.stock?.uniqueName;
                        unitCode = defaultUnit.code;

                        const hasMrpDiscount = txn.selectedAccount.stock.variant?.unitRates?.filter(variantDiscount => variantDiscount?.stockUnitUniqueName === stockUnitUniqueName);
                        if (hasMrpDiscount?.length) {
                            rate = Number((hasMrpDiscount[0].rate / this.lc.blankLedger?.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                        }
                        variantUniqueName = txn.selectedAccount.stock.variant?.uniqueName;
                        variantDiscount = txn.selectedAccount.stock.variant?.variantDiscount;
                    }
                }
                if (stockName && stockUniqueName) {
                    txn.inventory = {
                        stock: {
                            name: stockName,
                            uniqueName: stockUniqueName,
                        },
                        variant: {
                            uniqueName: variantUniqueName,
                            variantDiscount: variantDiscount
                        },
                        quantity: quantity,
                        unit: {
                            stockUnitCode: unitCode,
                            code: unitCode,
                            rate: rate,
                            stockUnitUniqueName: stockUnitUniqueName
                        }
                    };
                } else {
                    delete txn.inventory;
                }
                if (rate > 0 && !txn.duplicateEntry) {
                    txn.amount = rate;
                }
                if (!this.lc.blankLedger.transactions?.[0]?.duplicateEntry) {
                    if ((data.body?.salesPerson || data.body?.oppositeAccount?.salesPerson) && !this.isSundryDebtorCreditor) {
                        this.lc.blankLedger.salesPersonUniqueName = data.body.salesPerson?.uniqueName || data.body.oppositeAccount.salesPerson?.uniqueName || null;
                        this.lc.blankLedger.salesPersonName = data.body.salesPerson?.name || data.body.oppositeAccount.salesPerson?.name || '';
                    } else {
                        this.lc.blankLedger.salesPersonUniqueName = this.ledgerAccountResponse.salesPerson?.uniqueName || this.lc.blankLedger.salesPersonUniqueName || null;
                        this.lc.blankLedger.salesPersonName = this.ledgerAccountResponse.salesPerson?.name || this.lc.blankLedger.salesPersonName || '';
                    }
                }
                if (!txn?.duplicateEntry) { 
                    this.preparePreAppliedDiscounts(txn);
                }
                // check if selected account category allows to show taxationDiscountBox in newEntry popup
                txn.showTaxationDiscountBox = this.getCategoryNameFromAccountUniqueName(txn);
                txn.showOtherTax = this.showOtherTax(txn);
                this.handleRcmVisibility(txn);
                this.handleTaxableAmountVisibility(txn);
                this.selectedTxnAccUniqueName = txn?.selectedAccount?.uniqueName;
                this.isTotalChanged = false;
                this.needToReCalculate.next(true);
                if (allowChangeDetection) {
                    this.cdRf.detectChanges();
                }
                this.getTransactionCountConvertToEntries();
            }
        });
    }

    /**
     * To prepare pre applied discount for current transactions
     *
     * @memberof LedgerComponent
     */
    public preparePreAppliedDiscounts(txn: any): void {
        if (!txn?.duplicateEntry) {
            txn.discounts = [];
        }
        const stockDiscounts = txn.selectedAccount?.stock?.variant?.variantDiscount?.discounts
        if (stockDiscounts?.length && !txn.isMrpDiscountApplied) {
            stockDiscounts?.forEach(variantDiscount => {
                this.discountsList()?.forEach(item => {
                    if (variantDiscount?.discount?.uniqueName === item?.uniqueName) {
                        txn.discounts.push(item);
                    }
                    return item;
                });
            });
        } else {
            if (txn?.selectedAccount?.accountApplicableDiscounts?.length) {
                txn?.selectedAccount?.accountApplicableDiscounts?.map(item => item.isActive = true);
                (Array.isArray(txn?.selectedAccount.accountApplicableDiscounts) ? txn?.selectedAccount.accountApplicableDiscounts : []).forEach(element => {
                    this.discountsList()?.forEach(item => {
                        if (element?.uniqueName === item?.uniqueName) {
                            txn.discounts.push(item);
                        }
                    });
                });
            } else if (this.lc.activeAccount.applicableDiscounts.length) {
                this.lc.activeAccount.applicableDiscounts.forEach(element => {
                    this.discountsList()?.forEach(item => {
                        if (element?.uniqueName === item?.uniqueName) {
                            txn.discounts.push(item);
                        }
                    });
                });
            } else if (!txn?.duplicateEntry) {
                if (txn) {
                    txn.discount = 0;
                }
            }
        }
    }

    /**
     * Get all discounts API call
     *
     * @private
     * @memberof LedgerComponent
     */
    private getAllDiscounts(): void {
        this.settingsDiscountService.GetDiscounts().pipe(take(1)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                let discounts = response?.body;
                discounts.map((discount: any) => {
                    discount.amount = discount.discountValue;
                    discount.discountUniqueName = discount.uniqueName;
                })
                this.discountsList.set(discounts);
            }
        });
    }

    /**
     * Add browser confirmation dialog
     *
     * @memberof LedgerComponent
     */
    public addBrowserConfirmation(): void {
        this.pageLeaveUtilityService.addBrowserConfirmationDialog();
    }

    /**
     * Initiate request to open plaid popup
     *
     * @memberof LedgerComponent
     */
    public getPlaidLinkToken(itemId?: any): void {
        this.store.dispatch(this.commonAction.reAuthPlaid({ itemId: itemId, reauth: true }));
        this.getAllBankAccounts();
    }

    /**
    * This will get all connected bank accounts
    *
    * @memberof LedgerComponent
    */
    public getAllBankAccounts(accountUniqueName?: string): void {
        this.isBankAccountConnected = null;
        this.selectedAccountUniquename = accountUniqueName;
        this.settingIntegrationComponentStore.getAllBankAccounts();
    }

    /**
     * Refresh bank transactions
     *
     * @memberof LedgerComponent
     */
    public refreshBankTransactions(): void {
        this.homeComponentStore.refreshGoCardlessBankTransactions(this.lc.accountUnq);
    }

    /**
     * This will open the dialog to link a bank
     *
     * @memberof LedgerComponent
     */
    public openBankLinkDialog(): void {
        if (!this.unlinkBankList?.length) {
            this.openInstitutionsDialog();
        } else if (this.unlinkBankList?.length === 1 && !this.isBankAccountConnected) {
            this.linkBankAccount();
        } else if (this.unlinkBankList?.length > 1 || this.isBankAccountConnected) {
            this.bankIntegrationDialogRef = this.dialog.open(BankIntegrationDialogComponent, {
                data: {
                    commonLocaleData: this.commonLocaleData,
                    localeData: this.localeData
                },
                width: '600px',
                disableClose: true
            });
            this.bankIntegrationDialogRef.afterClosed().subscribe(response => {
                if (response) {
                    if (response === 'integrate') {
                        this.openInstitutionsDialog();
                    } else if (response === 'link') {
                        this.getLinkBankAccount();
                    }
                }
            });
        }
    }

    /**
     * This will be use for get link bank account
     *
     * @memberof LedgerComponent
     */
    public getLinkBankAccount(): void {
        if (this.unlinkBankList.length === 1 && !this.isBankAccountConnected) {
            this.linkBankAccount();
        } else {
            const data = {
                bankList: this.bankList ?? [],
                accountUniqueName: this.lc.accountUnq
            }
            const dialogRef = this.dialog.open(BankLinkComponent, {
                data: data,
                panelClass: ['mat-dialog-md'],
                disableClose: true
            });
            dialogRef.afterClosed().pipe(take(1), tap(response => {
                if (response && response !== 'closeDialog') {
                    this.isUpdateAccount = true;
                    this.isBankAccountConnected = true;
                    this.getBankTransactions();
                    this.referenceNumber = null;
                    localStorage.setItem('refNo', null);
                    this.getAllBankAccounts();
                }
            })).subscribe();
        }
    }

    /**
     * This will link the connected bank accounts
     *
     * @memberof LedgerComponent
     */
    public linkBankAccount(): void {
        let request = { bankAccountUniqueName: this.unlinkBankList[0]?.bankResource?.uniqueName };
        let accountForm = {
            accountNumber: this.unlinkBankList[0]?.bankResource?.accountNumber,
            accountUniqueName: this.lc.accountUnq,
            paymentAlerts: []
        }
        this.settingIntegrationComponentStore.updateAccount({ accountForm, request });
    }

    /**
     * This will be use for redirect to bank integration page
     *
     * @memberof LedgerComponent
     */
    public redirectToBankIntegration(): void {
        this.router.navigate(['pages', 'settings', 'integration', 'payment']);
    }

    /**
     * Close All Account Dropdown
     *
     * @memberof LedgerComponent
     */
    public closeAllAccountDropdown(): void {
        (this.dropdowns?.length ? this.dropdowns.toArray() : []).forEach((alertInstance, i) => alertInstance?.closeDropdownPanel());
    }

    /**
     * Handle carousel previous event
     *
     * @param {boolean} event
     * @memberof LedgerComponent
     */
    public handleCarouselPrevious(event: boolean): void {
        this.carouselPrevious = event;

        // Reset after processing
        setTimeout(() => {
            this.carouselPrevious = false;
        }, 100);
    }

    /**
     * Handle carousel next event
     *
     * @param {boolean} event
     * @memberof LedgerComponent
     */
    public handleCarouselNext(event: boolean): void {
        this.carouselNext = event;

        // Reset after processing
        setTimeout(() => {
            this.carouselNext = false;
        }, 100);
    }

    /**
     * Get ledger statement view grid columns value
     *
     * @memberof LedgerComponent
     */
    public getLedgerStatementViewGridColumnsValue(): void {
        if (this.ledgerView === LedgerViewEnum.TView) {
            return;
        }
        if (this.searchText || this.isAdvanceSearchImplemented) {
            if (this.breakpointScreenSize.tabScreen || this.breakpointScreenSize.smallDesktopScreen) {
                this.ledgerStatementViewGridColumnsValue = [2, 3, 2, 2];
            } else if (this.ledgerStatementViewGridColumnsValue.length > 4) {
                this.ledgerStatementViewGridColumnsValue.pop();
            }
        } else {
            if (this.breakpointScreenSize.tabScreen || this.breakpointScreenSize.smallDesktopScreen) {
                this.ledgerStatementViewGridColumnsValue = [2, 3, 2, 2, 3];
            } else {
                this.ledgerStatementViewGridColumnsValue = [2, 8, 2, 2, 3];
            }
        }
        this.ledgerStatementViewGridTotalColumns = this.getLedgerStatementViewGridTotalColumns();
    }

    /**
     * Get ledger statement view grid total columns
     *
     * @returns {number}
     * @memberof LedgerComponent
     */
    private getLedgerStatementViewGridTotalColumns(): number {
        return this.ledgerStatementViewGridColumnsValue.reduce((a, b) => a + b, 0);
    }

    /**
     * Handle close other dialog/menu
     *
     * @param {boolean} event
     * @memberof LedgerComponent
     */
    public handleCloseOtherDialogMenu(event: boolean): void {
        if (event) {
            this.closeAllAccountDropdown();
        }
    }

    /**
     * Open Create Account Aside Pane
     *
     * @memberof LedgerComponent
     */
    public openAccountAsidePane(): void {
        this.updateAccountDialogRef = this.dialog.open(this.updateAccount, ASIDE_PANE_CONFIG);
    }

    /**
     * Prepare duplicate transaction
     *
     * @param {any} res
     * @memberof LedgerComponent
     */
    private prepareDuplicateTransaction(res: any): void {
        if (!res) return;
        let isDebitTransaction: boolean;
        const isJournalVoucher = res?.voucher?.shortCode ? (res?.voucher?.shortCode === AdjustedVoucherType.Journal) : (res?.voucherGeneratedType === AdjustedVoucherType.JournalVoucher);
        const isActiveAccountAndParticularIsSame = res?.particular?.uniqueName === this.lc?.activeAccount?.uniqueName;
        const transaction: TransactionVM = new TransactionVM();

        transaction.duplicateEntry = true; // Use this to handle duplicate entry logic every where
        transaction.subVoucher = res?.subVoucher;
        let transactionsParticular: any;
        let sumOfTax = 0;
        if (res.transactions?.length) {
            (Array.isArray(res.transactions) ? res.transactions : []).forEach(item => {
                if (Object.hasOwn(item.particular, 'category') && (['income', 'expenses', 'assets'].includes(item.particular.category) || isJournalVoucher) && item.particular.uniqueName !== "roundoff" && !item.isTax) {
                    transactionsParticular = item.particular;
                    if (item.inventory) {
                        transactionsParticular['uniqueName'] = transactionsParticular?.uniqueName?.split('#')[0];
                        transactionsParticular = { ...transactionsParticular, stock: item.inventory?.stock, hasVariants: Boolean(item?.inventory?.variant) }
                    }
                }

                if (item.isTax && res.transactions?.length !== 1) { // This temporary logic we will fix in future with journal entry
                    sumOfTax += item.amount;
                }
            })
        }
        const transactionAmount = isJournalVoucher ? res?.total.amount - sumOfTax : res?.actualAmount;
        transaction.amount = transactionAmount;
        transaction.convertedAmount = transactionAmount;
        transaction.total = res?.total.amount;
        transaction.convertedTotal = res?.total.amount;

        if (isActiveAccountAndParticularIsSame) {
            isDebitTransaction = res?.total?.type === TransactionType.Debit ? true : false;
        } else {
            isDebitTransaction = res?.total?.type === TransactionType.Debit ? false : true;
        }
        const transactionType = isDebitTransaction ? TransactionType.Debit : TransactionType.Credit;
        if (isDebitTransaction) {
            transaction.debitAmount = transactionAmount
            transaction.debitTotal = res.total.amount;
        } else {
            transaction.creditAmount = transactionAmount
            transaction.creditTotal = res.total.amount;
        }
        let selectedAccountName = "";
        let selectedAccountUniqueName = "";

        if (isActiveAccountAndParticularIsSame) {
            if (transactionsParticular?.stock) {
                selectedAccountName = `${transactionsParticular?.name} (${transactionsParticular?.stock?.name})`;
            } else {
                selectedAccountName = transactionsParticular?.name;
            }
            selectedAccountUniqueName = transactionsParticular?.uniqueName;
        } else {
            selectedAccountName = `${res.particular?.name}${transactionsParticular?.stock ? ' (' + transactionsParticular?.stock?.name + ')' : ''}`;
            selectedAccountUniqueName = res.particular?.uniqueName;
        }

        let discounts: LedgerDiscountClass[] = [this.lc.staticDefaultDiscount()]; // Default discount use for fixed value and percentage by pnput
        if (res?.discounts?.length) {
            (Array.isArray(res.discounts) ? res.discounts : []).forEach(discount => {

                if (!discount?.discount?.uniqueName) {
                    discounts[0].isActive = true;
                    discounts[0].amount = discount?.discount?.discountValue;
                    discounts[0].discountValue = discount?.discount?.discountValue;
                    discounts[0].discountType = discount?.discount?.discountType;
                    return;
                }

                const discountObj: LedgerDiscountClass = discount?.discount;
                discounts.push({
                    amount: discount?.convertedAmount,
                    discountValue: discountObj?.discountValue,
                    discountType: discountObj?.discountType,
                    isActive: true,
                    particular: discount?.account?.uniqueName,
                    discountUniqueName: discountObj?.uniqueName,
                    name: discountObj?.name,
                    uniqueName: discountObj?.uniqueName
                });
            });
        }
        transaction.discounts = discounts;
        transaction.taxes = res?.taxes ?? [];
        transaction.reverseChargeTaxableAmount = res.reverseChargeTaxableAmount;
        transaction.itcAvailable = res.itcAvailable;
        transaction.particular = selectedAccountUniqueName;
        transaction.type = transactionType;
        let inventory;
        if (res.transactions?.length) {
            inventory = res.transactions.find(txn => Object.keys(txn?.inventory || {}).length > 0)?.inventory;
            if (inventory) {

                if (inventory.stock && res.unitRates?.length) {
                    inventory.stock['unitRates'] = res.unitRates;
                }

                if (inventory.stock && inventory.variant && res.unitRates?.length) {
                    inventory.stock['variant'] = inventory.variant;
                }

                res['inventory'] = inventory;
                transaction.inventory = inventory;
            }
        }
        this.selectBlankTxn(transaction);
        this.lc.blankLedger.isOtherTaxesApplicable = res.isOtherTaxesApplicable;
        this.lc.blankLedger.otherTaxesSum = res.otherTaxesSum;
        this.lc.blankLedger.voucherType = null;
        this.lc.blankLedger.chequeNumber = res.chequeNumber;
        this.lc.blankLedger.chequeClearanceDate = res.chequeClearanceDate;
        this.lc.blankLedger.tagNames = res.tagNames;
        this.lc.blankLedger.description = res.description;
        this.lc.blankLedger.generateInvoice = res.voucherGenerated;
        this.lc.blankLedger.touristSchemeApplicable = res.touristSchemeApplicable;
        this.lc.blankLedger.passportNumber = res.passportNumber;
        this.lc.blankLedger.salesPersonUniqueName = res.salesPerson?.uniqueName;
        this.lc.blankLedger.salesPersonName = res.salesPerson?.name;

        let txnIndex: number;

        if (this.ledgerView === LedgerViewEnum.TView) {
            let filterTypedTxn = this.lc.blankLedger.transactions?.filter(txn => txn.type === (transactionType));
            if (filterTypedTxn[filterTypedTxn.length - 1]?.particular) {
                const newTrx = this.lc.addNewTransaction(transactionType);
                this.lc.blankLedger?.transactions.push(newTrx);
                txnIndex = this.lc.blankLedger.transactions.length - 1;
            } else {
                txnIndex = this.lc.blankLedger.transactions.findIndex(txn => txn.id === filterTypedTxn[filterTypedTxn.length - 1].id);
            }
        } else {
            let filterTypedTxn = this.lc.blankLedger.transactions[this.lc.blankLedger.transactions?.length - 1];
            if (filterTypedTxn?.particular) {
                const newTrx = this.lc.addNewTransaction(transactionType);
                this.lc.blankLedger?.transactions.push(newTrx);
            } else {
                this.lc.blankLedger.transactions[this.lc.blankLedger.transactions?.length - 1].type = transactionType;
            }
            txnIndex = this.lc.blankLedger.transactions.length - 1;
        }


        if (this.lc.blankLedger.transactions[txnIndex].particular) {
            const newTrx = this.lc.addNewTransaction(transactionType);
            this.lc.blankLedger?.transactions.push(newTrx);
        }

        this.lc.blankLedger.transactions[txnIndex].duplicateEntry = true; // Use this to handle duplicate entry logic every where
        this.lc.blankLedger.transactions[txnIndex].subVoucher = res?.subVoucher;
        this.lc.blankLedger.transactions[txnIndex].inventory = inventory || null;
        if (isDebitTransaction) {
            this.lc.blankLedger.transactions[txnIndex].debitAmount = transactionAmount;
            this.lc.blankLedger.transactions[txnIndex].debitTotal = res.total.amount;
        } else {
            this.lc.blankLedger.transactions[txnIndex].creditAmount = transactionAmount;
            this.lc.blankLedger.transactions[txnIndex].creditTotal = res.total.amount;
        }

        this.lc.blankLedger.transactions[txnIndex].particular = selectedAccountUniqueName;
        const particular = (isActiveAccountAndParticularIsSame || transactionsParticular?.stock) ? transactionsParticular : res.particular;
        this.lc.blankLedger.transactions[txnIndex].selectedAccount = {
            label: selectedAccountName,
            value: selectedAccountUniqueName,
            name: selectedAccountName,
            uniqueName: selectedAccountUniqueName,
            category: particular?.category,
            parentGroups: particular?.parentGroups,
            uNameStr: Array.isArray(particular?.parentGroups) ? particular.parentGroups.map(parent => parent?.uniqueName ?? parent).join(', ') : '',
            additional: {
                name: selectedAccountName,
                uniqueName: selectedAccountUniqueName,
                stock: particular?.stock || null
            }
        };
        this.lc.blankLedger.transactions[txnIndex].amount = transactionAmount;
        this.lc.blankLedger.transactions[txnIndex].convertedAmount = transactionAmount;
        this.lc.blankLedger.transactions[txnIndex].total = res?.total.amount;
        this.lc.blankLedger.transactions[txnIndex].convertedTotal = res?.total.amount;
        this.lc.blankLedger.transactions[txnIndex].discounts = discounts;
        this.lc.blankLedger.transactions[txnIndex].taxes = res?.taxes ?? [];

        // Other Tax Logic
        let tax: TaxResponse;
        let otherTaxesModal = new SalesOtherTaxesModal();
        otherTaxesModal.itemLabel = res.particular?.name;
        if (res?.tcsTaxes && res?.tcsTaxes.length) {
            tax = this.companyTaxesList.find(item => item?.uniqueName === res?.tcsTaxes[0]);
            this.lc.blankLedger.otherTaxType = OtherTaxTypeEnum.TCS;
        } else if (res?.tdsTaxes && res?.tdsTaxes.length) {
            tax = this.companyTaxesList.find(item => item?.uniqueName === res?.tdsTaxes[0]);
            this.lc.blankLedger.otherTaxType = OtherTaxTypeEnum.TDS;
        }
        if (tax) {
            otherTaxesModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
            otherTaxesModal.tcsCalculationMethod = res.tcsCalculationMethod || SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
            this.lc.blankLedger.otherTaxModal = otherTaxesModal;
            this.lc.blankLedger.isOtherTaxesApplicable = true;
            this.lc.blankLedger.transactions[txnIndex].selectedAccount.otherTax = otherTaxesModal;
        }

        this.selectAccount(
            this.lc.blankLedger.transactions[txnIndex].selectedAccount,
            this.lc.blankLedger.transactions[txnIndex],
            false,
            false,
            false
        );
        setTimeout(() => {
            this.lc.showNewLedgerPanel = true;
        }, 200);
    }

    /**
     * Handle load details for duplicate entry
     *
     * @param event The event object
     * @param txn The transaction object
     * @memberof LedgerComponent
     */
    private handeLoadDetailsForDuplicateEntry(event: any, txn: any): void {
        txn.showTaxationDiscountBox = false;
        if (!this.isHideBankLedgerPopup) {
            this.lc.currentBlankTxn = txn;
        }
        txn.isMrpDiscountApplied = false;
        txn.showTaxationDiscountBox = this.getCategoryNameFromAccountUniqueName(txn);
        txn.showOtherTax = this.showOtherTax(txn);
        this.handleRcmVisibility(txn);
        this.handleTaxableAmountVisibility(txn);
        this.selectedTxnAccUniqueName = txn?.selectedAccount?.uniqueName;
        this.needToReCalculate.next(true);
        this.getTransactionCountConvertToEntries();
    }

    /**
     * Hide all dropdown tax panels in the new ledger entry panel
     *
     * @param exceptDropdown Optional parameter to exclude a specific dropdown from closing
     * @memberof LedgerComponent
     */
    public hideAllDropdown(exceptDropdown?: LedgerDropdownTypeEnum): void {
        if (this.newLedgerComponent && this.newLedgerComponent.hideAllDropdown) {
            this.newLedgerComponent.hideAllDropdown(exceptDropdown);
        }
    }
}