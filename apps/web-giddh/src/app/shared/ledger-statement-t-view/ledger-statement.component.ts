import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { shareReplay, take, takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, } from "rxjs";
import { LedgerStatementComponentStore } from "./utility/ledger-statement.store";
import { LedgerViewEnum, TLedgerView, TransactionsRequest } from "../../models/api-models/Ledger";
import { OrganizationType } from "../../models/user-login-state";
import { BreakpointObserver } from "@angular/cdk/layout";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { AdvanceSearchRequest } from "../../models/interfaces/advance-search-request";
import { BranchHierarchyType, RESTRICTED_VOUCHERS_FOR_DOWNLOAD } from "../../app.constant";
import { LedgerVM } from "../../ledger/ledger.vm";
import { ChangeDetectorRef } from "@angular/core";
import { GIDDH_DATE_FORMAT } from "../helpers/defaultDateFormat";
import * as dayjs from 'dayjs';
import { cloneDeep, uniq } from "../../lodash-optimized";
import { LedgerComponentStore } from "../../ledger/ledger.store";
import { LedgerActions } from "../../actions/ledger/ledger.actions";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { SettingIntegrationComponentStore } from "../../settings/integration/utility/setting.integration.store";
import { ICurrencyResponse } from "../../models/api-models/Company";
import { AccountResponse, AccountResponseV2 } from "../../models/api-models/Account";
import { LedgerService } from "../../services/ledger.service";
@Component({
    selector: 'ledger-statement',
    templateUrl: './ledger-statement.component.html',
    styleUrls: ['./ledger-statement.component.scss'],
    providers: [LedgerStatementComponentStore, LedgerComponentStore, SettingIntegrationComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LedgerStatementComponent implements OnInit, OnDestroy {
    /** True if the columnar report table is shown */
    public isShowLedgerColumnarReportTable: boolean = false;
    /** Stores the current ledger view type */
    public ledgerView: TLedgerView = LedgerViewEnum.TView;
    /** Stores the LedgerViewEnum reference */
    public ledgerViewEnum: typeof LedgerViewEnum = LedgerViewEnum;
    /** True if the device is a mobile screen */
    public isMobileScreen: boolean = true;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the static total columns count for the ledger grid */
    public ledgerGridTotalColumns: number = 4;
    /** Stores the column values for the ledger grid */
    public ledgerGridColumnsValue: number[] = [1, 2, 1];
    /** Stores the list of all transactions */
    public allTransactionsList: any[] = [];
    /** Stores the list of all transaction dates */
    public allTransactionDates: any[] = [];
    /** Observable of the current company's branches */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of the current company */
    public currentCompanyBranches: Array<any>;
    /** Stores the currently selected branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the currently active company */
    public activeCompany: any;
    /** True if the branch is consolidated */
    public isConsolidatedBranch: boolean;
    /** True if the user has permission to view the ledger */
    public hasLedgerPermission: boolean = true;
    /** True if data is loading */
    public isLoading: boolean = false;
    /** Stores the localized JSON data */
    public localeData: any = {};
    /** Stores common localized JSON data */
    public commonLocaleData: any = {};
    /** Stores the selected date range for API requests */
    public selectedDateRange: any;
    /** Stores the selected date range for UI display */
    public selectedDateRangeUi: any;
    /** Stores pagination information for the ledger */
    public paginationObject: any = {
        totalItems: 0,
        itemsPerPage: 0,
        page: 0,
        totalPages: 0,
        showPagination: false,
        prevToken: null,
        nextToken: null
    };
    /** Observable for post balance success response */
    public ledgerBalanceSuccess$: Observable<boolean> = this.ledgerComponentStore.select(state => state.ledgerBalance);
    /** Stores the currently selected transaction/item */
    public selectedItem: any;
    /** True if this is the default load of the ledger */
    public isDefaultLoad: boolean = true;
    /** True if the active account is a bank account */
    public get isBankAccount(): boolean {
        return this.lc.activeAccount?.parentGroups?.some(group => group.uniqueName === 'bankaccounts');
    }
    /** True if the active bank account is connected */
    public isBankAccountConnected: boolean = null;
    /** Stores the unique name of the selected bank account */
    public selectedAccountUniquename: any;
    /** Stores the voucher API version used by the current company */
    public voucherApiVersion: 1 | 2;
    /** Stores restricted voucher types for download */
    public restrictedVouchersForDownload: any[] = RESTRICTED_VOUCHERS_FOR_DOWNLOAD;
    /** Stores the ledger transaction balance */
    public ledgerTxnBalance: any = {};
    /** True if advanced search is implemented */
    public isAdvanceSearchImplemented: boolean = false;
    /** Stores the closing balance before bank reconciliation */
    public closingBalanceBeforeReconcile: { amount: number, type: string };
    /** Stores the closing balance for bank reconciliation */
    public reconcileClosingBalanceForBank: { amount: number, type: string };
    /** Stores the active account's unique name (input) */
    @Input() public activeAccountUniqueName: string;
    /** Stores the 'from' date for the ledger (input) */
    @Input() public from: string;
    /** Stores the 'to' date for the ledger (input) */
    @Input() public to: string;
    /** Stores the image path for attachments or icons */
    public imgPath: string = '';
    /** Stores the visible transaction type on mobile */
    public visibleTransactionTypeMobile: string = "all";
    /** Stores the ledger transactions data */
    public ledgerTransactions: any;
    /** ReplaySubject to manage component destruction and unsubscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the transactions request object */
    public trxRequest: TransactionsRequest;
    /** Stores the advanced search request object */
    public advanceSearchRequest: AdvanceSearchRequest;
    /** Stores the ledger view model */
    public lc: LedgerVM;
    /** True if 'Today' is selected in the date filter */
    public todaySelected: boolean = false;
    /** Observable for 'Today' selection state */
    public todaySelected$: Observable<boolean> = observableOf(false);
    /** Observable for universal date selection */
    public universalDate$: Observable<any>;
    /** Observable for transaction request processing state */
    public isTransactionRequestInProcess$: Observable<boolean>;
    /** Stores the search text for filtering transactions */
    public searchText: string = '';
    /** True if the loader should be shown */
    public needToShowLoader: boolean = true;
    /** True if the loader is currently visible */
    public showLoader: boolean = false;
    /** Observable for company creation state */
    public isCompanyCreated$: Observable<boolean>;
    /** True if prefix is applied for currency display */
    public isPrefixAppliedForCurrency: boolean = true;
    /** Stores the selected currency prefix */
    public selectedPrefixForCurrency: string;
    /** Stores the selected currency suffix */
    public selectedSuffixForCurrency: string;
    /** Stores the input mask format for currency fields */
    public inputMaskFormat: string;
    /** Stores the number of decimal places for balance display */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Stores the selected currency (0: base, 1: foreign) */
    public selectedCurrency: 0 | 1 = 0;
    /** Stores the details of the base currency */
    public baseCurrencyDetails: ICurrencyResponse;
    /** Stores the details of the foreign currency */
    public foreignCurrencyDetails: ICurrencyResponse;
    /** Stores the user profile object */
    public profileObj: any;
    /** Stores account unique name */
    public accountUniqueName: string;
    /** True if the ledger account supports multi-currency */
    public isLedgerAccountAllowsMultiCurrency: boolean = false;

    constructor(private generalService: GeneralService,
        private breakpointObserver: BreakpointObserver
        , private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions
        , private changeDetectorRef: ChangeDetectorRef,
        private ledgerComponentStore: LedgerComponentStore,
        private ledgerActions: LedgerActions,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private settingIntegrationComponentStore: SettingIntegrationComponentStore,
        private ledgerService: LedgerService,

    ) {
    }

    /**
    * Angular lifecycle hook: Called once after component initialization
    *
    * @memberof LedgerStatementComponent
    */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('ledger-body');
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        const mediumScreen: string = "(max-width: 1536px)";
        const smallScreen: string = "(max-width: 1366px)";

        this.breakpointObserver.observe([
            smallScreen, mediumScreen
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result?.matches) {
                if (result.breakpoints[smallScreen]) {
                    this.ledgerGridTotalColumns = 3
                    this.ledgerGridColumnsValue = [1, 1, 1]
                } else if (result.breakpoints[mediumScreen]) {
                    this.ledgerGridTotalColumns = 8;
                    this.ledgerGridColumnsValue = [2, 3, 3]
                } else {
                    this.ledgerGridTotalColumns = 4
                    this.ledgerGridColumnsValue = [1, 2, 1]
                }
            }
        });

        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        if (this.currentOrganizationType === OrganizationType.Company || this.isConsolidatedBranch) {
            // this.showBranchSwitcher = true;
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
                            this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
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
                } else {
                    if (this.generalService.companyUniqueName) {
                        // Avoid API call if new user is onboarded
                        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                    }
                }
            });
        }

        observableCombineLatest([this.lc.activeAccount$, this.lc.companyProfile$]).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data[0] && data[1]) {
                let profile = cloneDeep(data[1]);
                this.lc.activeAccount = data[0];
                if (data[0]?.ledgerView) {
                    this.ledgerView = data[0].ledgerView;
                }

                if (this.isBankAccount) {
                    this.getAllBankAccounts();
                }
                this.profileObj = profile;
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                this.needToShowLoader = true;
                this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
                let accountDetails: AccountResponse | AccountResponseV2 = data[0];
                this.lc.getUnderstandingText(accountDetails?.accountType, accountDetails?.name, accountDetails?.parentGroups, this.localeData);
                this.accountUniqueName = accountDetails?.uniqueName;

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

                // assign multi currency details to new ledger component
                this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
                this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
            }
            this.changeDetectorRef.detectChanges();
        });

        observableCombineLatest([
            this.lc.transactionData$.pipe(takeUntil(this.destroyed$)),
            this.store.pipe(select(p => p.ledger.ledgerTransactionsBalance), takeUntil(this.destroyed$)),
            this.ledgerBalanceSuccess$.pipe(takeUntil(this.destroyed$))
        ]).pipe(
            takeUntil(this.destroyed$) // Ensures the combined subscription is also cleaned up
        ).subscribe(([lt, txnBalance, ledgerBalanceResponse]: [any, any, any]) => {
            if (lt) {
                this.ledgerTransactions = lt;
                if (lt.periodClosingBalance) {
                    this.closingBalanceBeforeReconcile = { ...lt.periodClosingBalance }; // Clone for OnPush
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
                }
                if (lt.closingBalanceForBank) {
                    this.reconcileClosingBalanceForBank = { ...lt.closingBalanceForBank }; // Clone for OnPush
                    this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
                }

                if (this.ledgerView === LedgerViewEnum.TView) {
                    const debitTransactions = lt.debitTransactions ?? [];
                    const creditTransactions = lt.creditTransactions ?? [];
                    // The 'checkedEntriesName' variable was declared but not used in the original snippet.
                    // If you need this data, assign it to a class property: this.checkedEntriesName = uniq(...)
                    /* const calculatedCheckedEntries = */ uniq([
                        ...debitTransactions.filter(debitTransaction => debitTransaction.isChecked).map(debitTransaction => ({ uniqueName: debitTransaction.entryUniqueName, type: 'debit' })),
                        ...creditTransactions.filter(creditTransaction => creditTransaction.isChecked).map(creditTransaction => ({ uniqueName: creditTransaction.entryUniqueName, type: 'credit' })),
                    ]);
                }
                this.lc.currentPage = lt.page;
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

                    if (!this.changeDetectorRef['destroyed']) {
                        this.changeDetectorRef.detectChanges();
                    }
                }, 400);
            }

            // Logic from the second observable (store.select(p => p.ledger.ledgerTransactionsBalance))
            if (!this.isAdvanceSearchImplemented) {
                if (txnBalance) {
                    this.ledgerTxnBalance = txnBalance;
                    this.lc.calculateReckonging(txnBalance);
                }
                // If txnBalance is falsy, original code did nothing here.
            }

            // Logic from the third observable (this.ledgerBalanceSuccess$)
            if (ledgerBalanceResponse) {
                // Ensure this.ledgerTxnBalance is an object before assigning to it,
                // especially if it could be uninitialized or set to null/undefined by the store logic.
                if (typeof this.ledgerTxnBalance !== 'object' || this.ledgerTxnBalance === null) {
                    this.ledgerTxnBalance = {};
                }
                Object.assign(this.ledgerTxnBalance, ledgerBalanceResponse);
            }

            this.isLoading = false; // Set loading false after all combined observables have emitted
            // Call change detection once after all updates
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
    * Track by function for normal transactions
    *
    * @param {number} index Current normal transaction index
    * @param {*} transaction Normal transaction data
    * @return {*}  {string} Unique name
    * @memberof LedgerStatementComponent
    */
    public trackByTransactionUniqueName(index: number, transaction: any): string {
        return transaction?.entryUniqueName;
    }

    /**
    * Resets the blank ledger transaction object based on organization type and branches
    *
    * @memberof LedgerStatementComponent
    */
    public resetBlankTransaction() {
        this.lc.blankLedger = this.lc.getBlankLedger();
        this.lc.blankLedger.transactions =
            (this.currentOrganizationType === OrganizationType.Branch ||
                (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) ? [ // Add the blank transaction only if it is branch mode or company with single branch
                this.lc?.addNewTransaction('DEBIT'),
                this.lc?.addNewTransaction('CREDIT')
            ] : [];
        this.lc.blankLedger.voucherType = null;
        this.lc.blankLedger.entryDate = this.selectedDateRange?.endDate ? dayjs(this.selectedDateRange.endDate).format(GIDDH_DATE_FORMAT) : dayjs().format(GIDDH_DATE_FORMAT);
    }

    /**
    * Initializes the transaction request object
    *
    * @param {string} accountUnq Account unique name
    * @memberof LedgerStatementComponent
    */
    public initTrxRequest(accountUnq: string) {

    }

    /**
    * Shows the attachments popup dialog for a transaction
    *
    * @param {TemplateRef<any>} templateRef Reference to the template
    * @param {*} transaction Transaction data for which attachments are shown
    * @memberof LedgerStatementComponent
    */
    public openAttachmentsDialog(templateRef: TemplateRef<any>, transaction: any): void {
        this.selectedItem = transaction;
        let dialogRef = this.dialog.open(templateRef, {
            width: '70%',
            height: '790px',
            role: 'alertdialog',
            ariaLabel: 'template'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            this.getTransactionData();
        });
    }

    /**
    * Fetches all connected bank accounts
    *
    * @param {string} [accountUniqueName] Optional account unique name
    * @memberof LedgerStatementComponent
    */
    public getAllBankAccounts(accountUniqueName?: string): void {
        this.isBankAccountConnected = null;
        this.selectedAccountUniquename = accountUniqueName;
        this.settingIntegrationComponentStore.getAllBankAccounts();
    }



    /**
    * Angular lifecycle hook: Called once just before the component is destroyed
    *
    * @memberof LedgerStatementComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }


    /**
    * Angular lifecycle hook: Called when any data-bound property changes
    *
    * @param {SimpleChanges} changes Changes object
    * @memberof LedgerStatementComponent
    */
    public ngOnChanges(changes: SimpleChanges): void {
        this.lc = new LedgerVM();
        this.trxRequest = new TransactionsRequest();
        this.trxRequest.paginationToken = '';
        this.lc.blankLedger = this.lc.getBlankLedger();
        if (changes.activeAccountUniqueName && changes.activeAccountUniqueName.currentValue !== changes.activeAccountUniqueName.previousValue) {
            this.trxRequest.accountUniqueName = changes.activeAccountUniqueName.currentValue;
            this.trxRequest.from = this.from;
            this.trxRequest.to = this.to;
            this.trxRequest.accountCurrency = true;
            this.getTransactionData();
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
    * Fetches transaction data and updates ledger state
    *
    * @memberof LedgerStatementComponent
    */
    public getTransactionData() {
        this.isLoading = true; // Set loading true when data fetching starts
        this.closingBalanceBeforeReconcile = null;
        if (this.trxRequest?.accountUniqueName) {
            this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));
            this.store.dispatch(this.ledgerActions.GetLedgerAccount(this.trxRequest.accountUniqueName));

            const fromDate = this.from;
            const toDate = this.to;
            this.trxRequest.from = fromDate;
            this.trxRequest.to = toDate;
            this.store.dispatch(this.ledgerActions.GetTransactions({ ...this.trxRequest, from: fromDate, to: toDate }));
            this.lc.transactionData$ = this.store.pipe(select(p => p.ledger.transactionsResponse), takeUntil(this.destroyed$), shareReplay(1));
            this.lc.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
            this.lc.companyProfile$ = this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$));
            this.isTransactionRequestInProcess$ = this.store.pipe(select(p => p.ledger.transactionInprogress), takeUntil(this.destroyed$));
        }
    }

    /**
    * Fetches and sets the currency exchange rate for the ledger
    *
    * @param {string} [mode] Mode for currency calculation (optional)
    * @memberof LedgerStatementComponent
    */
    public getCurrencyRate(mode: string = null) {
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
                    this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: rate };
                }
            }, (error => {
                this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: 1 };
            }));
        }
    }

    /**
     * To change pagination page number
     *
     * @param {*} event Pagination change event
     * @memberof LedgerStatementComponent
     */
    public pageChanged(event: any): void {
        if (typeof event === 'string') {
            this.trxRequest.paginationToken = event;
            this.getTransactionData();
        }
    }
}
