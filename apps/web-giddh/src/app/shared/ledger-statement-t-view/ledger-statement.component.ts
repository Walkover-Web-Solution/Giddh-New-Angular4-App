import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { Store, createSelector, select } from '@ngrx/store';
import { AppState } from '../../store';
import { shareReplay, take, takeUntil, debounceTime } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, } from "rxjs";
import { LedgerStatementComponentStore } from "./utility/ledger-statement.store";
import { LedgerViewEnum, TLedgerView, TransactionsRequest } from "../../models/api-models/Ledger";
import { OrganizationType } from "../../models/user-login-state";
import { BreakpointObserver } from "@angular/cdk/layout";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { AdvanceSearchRequest } from "../../models/interfaces/advance-search-request";
import { BranchHierarchyType } from "../../app.constant";
import { LedgerVM } from "../../ledger/ledger.vm";
import { ChangeDetectorRef } from "@angular/core";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from "../helpers/defaultDateFormat";
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
    /** True if columnar report show*/
    public isShowLedgerColumnarReportTable: boolean = false;
    /** Holds ledger view */
    public ledgerView: TLedgerView = LedgerViewEnum.TView;
    /** Holds ledger view enum */
    public ledgerViewEnum: typeof LedgerViewEnum = LedgerViewEnum;
    /** Boolean for mobile screen or not  */
    public isMobileScreen: boolean = true;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Hold ledger grid total columns static value */
    public ledgerGridTotalColumns: number = 4;
    /** Hold ledger grid total columns value */
    public ledgerGridColumnsValue: number[] = [1, 2, 1];
    /** Transactions dates array */
    public allTransactionsList: any[] = [];
    public allTransactionDates: any[] = [];
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** True if user has ledger permission */
    public hasLedgerPermission: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Pagination Object */
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
    /** Selected entry details */
    public selectedItem: any;
    /** This will hold if it's default load */
    public isDefaultLoad: boolean = true;
    /** True if active account is bank account */
    public get isBankAccount(): boolean {
        return this.lc.activeAccount?.parentGroups?.some(group => group.uniqueName === 'bankaccounts');
    }
    /** True if active account is bank account */
    public isBankAccountConnected: boolean = null;
    /** Holds accountUniquename of get all bank-Account  */
    public selectedAccountUniquename: any;
    public ledgerTxnBalance: any = {};
    public isAdvanceSearchImplemented: boolean = false;
    public closingBalanceBeforeReconcile: { amount: number, type: string };
    public reconcileClosingBalanceForBank: { amount: number, type: string };
    @Input() public activeAccountUniqueName: string;
    @Input() public from: string;
    @Input() public to: string;
    public imgPath: string = '';
    public visibleTransactionTypeMobile: string = "all";
    public ledgerTransactions: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public trxRequest: TransactionsRequest;
    public advanceSearchRequest: AdvanceSearchRequest;
    public lc: LedgerVM;
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public universalDate$: Observable<any>;
    public isTransactionRequestInProcess$: Observable<boolean>;
    public searchText: string = '';
    public needToShowLoader: boolean = true;
    public showLoader: boolean = false;
    public isCompanyCreated$: Observable<boolean>;
    public isPrefixAppliedForCurrency: boolean = true;
    public selectedPrefixForCurrency: string;
    public selectedSuffixForCurrency: string;
    public inputMaskFormat: string;
    public giddhBalanceDecimalPlaces: number = 2;
    public selectedCurrency: 0 | 1 = 0;
    public baseCurrencyDetails: ICurrencyResponse;
    public foreignCurrencyDetails: ICurrencyResponse;
    public profileObj: any;
    /** Stores account unique name */
    public accountUniqueName: string;
    public isLedgerAccountAllowsMultiCurrency: boolean = false;
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public tdsTcsTaxTypes: string[] = ['tcsrc', 'tcspay'];
    public isLoading: boolean = false;
    constructor(private generalService: GeneralService, private breakpointObserver: BreakpointObserver
        , private store: Store<AppState>, private settingsBranchAction: SettingsBranchActions
        , private changeDetectorRef: ChangeDetectorRef, private ledgerComponentStore: LedgerComponentStore,
        private ledgerActions: LedgerActions, private dialog: MatDialog, private route: ActivatedRoute,
        private settingIntegrationComponentStore: SettingIntegrationComponentStore, private ledgerService: LedgerService,

    ) {
        console.log("constr")
        // if (this.activeAccountUniqueName) {
        //     this.lc.accountUnq = this.activeAccountUniqueName;
        //     this.getTransactionData();
        //     this.store.dispatch(this.ledgerActions.GetLedgerAccount(this.lc.accountUnq));

        // }
        // this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
        // this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        // this.isTransactionRequestInProcess$ = this.store.pipe(select(p => p.ledger.transactionInprogress), takeUntil(this.destroyed$));
        // this.isCompanyCreated$ = this.store.pipe(select(s => s.session.isCompanyCreated), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        console.log("ngOnInt")
        document.querySelector('body').classList.add('ledger-body');
        this.lc.transactionData$ = this.store.pipe(select(p => p.ledger.transactionsResponse), takeUntil(this.destroyed$), shareReplay(1));
        this.lc.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.breakpointObserver.observe([
            '(max-width: 991px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
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

        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
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

        // this.lc.transactionData$.pipe(takeUntil(this.destroyed$)).subscribe((lt: any) => {
        //     this.isLoading = false;
        //     console.log(lt);
        //     if (lt) {
        //         this.ledgerTransactions = lt;
        //         if (lt.periodClosingBalance) {
        //             this.closingBalanceBeforeReconcile = lt.periodClosingBalance;
        //             this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
        //         }
        //         if (lt.closingBalanceForBank) {
        //             this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
        //             this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
        //         }
        //         let checkedEntriesName: any[];
        //         console.log('ledgerView', this.ledgerView);
                
        //         if (this.ledgerView === LedgerViewEnum.TView) {
        //             const debitTransactions = lt.debitTransactions ?? [];
        //             const creditTransactions = lt.creditTransactions ?? [];
        //             checkedEntriesName = uniq([
        //                 ...debitTransactions.filter(debitTransaction => debitTransaction.isChecked).map(debitTransaction => ({ uniqueName: debitTransaction.entryUniqueName, type: 'debit' })),
        //                 ...creditTransactions.filter(creditTransaction => creditTransaction.isChecked).map(creditTransaction => ({ uniqueName: creditTransaction.entryUniqueName, type: 'credit' })),
        //             ]);
        //         } 
        //         this.lc.currentPage = lt.page;
        //     }
        // });

        // this.store.pipe(
        //     select(p => p.ledger.ledgerTransactionsBalance),
        //     takeUntil(this.destroyed$)
        // ).subscribe((txnBalance: any) => {
        //     if (txnBalance && !this.isAdvanceSearchImplemented) {
        //         console.log('ledgerTransactionsBalance', txnBalance);
        //         this.ledgerTxnBalance = txnBalance;
        //         this.lc.calculateReckonging(txnBalance);
        //         this.changeDetectorRef.detectChanges();
        //     }
        // });

        // this.ledgerBalanceSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
        //     console.log('ledgerBalanceSuccess', response);
            
        //     if (response) {
        //         Object.assign(this.ledgerTxnBalance, response);
        //     }
        // });

        // this.store.pipe(select(createSelector([(st: AppState) => st.general.addAndManageClosed], (yesOrNo: boolean) => {
        //     if (yesOrNo) {
        //         console.log('addAndManageClosed', yesOrNo);
        //         this.getTransactionData();
        //     } else if (this.trxRequest?.accountUniqueName) {
        //         this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));
        //     }
        // })), debounceTime(300), takeUntil(this.destroyed$)).subscribe();
    }

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

    public initTrxRequest(accountUnq: string) {

    }

    /**
 * Shows the attachments popup
 *
 * @param {TemplateRef<any>} templateRef
 * @param {*} transaction
 * @memberof LedgerComponent
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
 * This will toggle transaction type for mobile
 *
 * @param {string} transactionType
 * @memberof LedgerComponent
 */
    public toggleMobileTransactionType(transactionType: string): void {
        this.visibleTransactionTypeMobile = transactionType;
        this.arrangeLedgerTransactionsForMobile();
    }

    // public getTransactionData() {
    //     console.log('getTransactionData');

    //     this.trxRequest.from = this.from;
    //     this.trxRequest.accountUniqueName = this.activeAccountUniqueName;
    //     this.trxRequest.to = this.to;
    //     this.trxRequest.page = 0;
    //     this.trxRequest.paginationToken = '';
    //     if (this.trxRequest?.accountUniqueName) {
    //         this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));

    //         this.store.dispatch(this.ledgerActions.GetTransactions({ ...this.trxRequest, from: this.from, to: this.to }));

    //         observableCombineLatest([this.lc.activeAccount$, this.lc.companyProfile$]).pipe(takeUntil(this.destroyed$)).subscribe(data => {
    //             console.log(data);
    //             if (data[0] && data[1]) {
    //                 let profile = cloneDeep(data[1]);
    //                 this.lc.activeAccount = data[0];
    //                 if (data[0]?.ledgerView) {
    //                     this.ledgerView = data[0].ledgerView;
    //                 }
    //                 this.profileObj = profile;
    //                 this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
    //                 this.needToShowLoader = true;
    //                 this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
    //                 let accountDetails: AccountResponse | AccountResponseV2 = data[0];
    //                 let parentOfAccount = (accountDetails?.parentGroups?.length) ? accountDetails?.parentGroups[0] : null;

    //                 this.lc.getUnderstandingText(accountDetails?.accountType, accountDetails?.name, accountDetails?.parentGroups, this.localeData);
    //                 this.accountUniqueName = accountDetails?.uniqueName;

    //                 // this.isBankOrCashAccount = accountDetails?.parentGroups?.some((grp) => grp?.uniqueName === 'bankaccounts' || grp?.uniqueName === 'loanandoverdraft');
    //                 if (accountDetails?.currency && profile?.baseCurrency) {
    //                     this.isLedgerAccountAllowsMultiCurrency = accountDetails.currency && accountDetails.currency !== profile?.baseCurrency;
    //                 } else {
    //                     this.isLedgerAccountAllowsMultiCurrency = false;
    //                 }
    //                 this.foreignCurrencyDetails = { code: profile?.baseCurrency, symbol: profile.baseCurrencySymbol };
    //                 if (this.isLedgerAccountAllowsMultiCurrency) {
    //                     this.baseCurrencyDetails = { code: accountDetails?.currency, symbol: accountDetails?.currencySymbol };
    //                     this.getCurrencyRate();
    //                 } else {
    //                     this.baseCurrencyDetails = this.foreignCurrencyDetails;
    //                     this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: 1 };
    //                 }
    //                 this.selectedCurrency = 0;
    //                 this.assignPrefixAndSuffixForCurrency();

    //                 // assign multi currency details to new ledger component
    //                 this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
    //                 this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
    //                 this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);

    //                 // tcs tds identification
    //                 if (['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'currentassets', 'noncurrentassets', 'fixedassets'].includes(parentOfAccount?.uniqueName)) {
    //                     this.tcsOrTds = ['indirectexpenses', 'operatingcost'].includes(parentOfAccount?.uniqueName) ? 'tds' : 'tcs';

    //                     // for tcs and tds identification
    //                     if (this.tcsOrTds === 'tcs') {
    //                         this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
    //                     } else {
    //                         this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // }

    /**
 * Create ledger balance
 *
 * @param {boolean} [resetSearch=false]
 * @memberof LedgerComponent
 */
    public createLedgerBalance(resetSearch: boolean = false): void {
        if (resetSearch) {
            // Reset Search in case of Advance Search
            this.trxRequest.q = '';
        }
        this.ledgerComponentStore.getLedgerBalance({
            payload: this.advanceSearchRequest.dataToSend, trxRequest: { ...this.trxRequest, from: dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT), to: dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) }
        });
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

    ngOnDestroy(): void {
    }

    private assignPrefixAndSuffixForCurrency() {
        this.isPrefixAppliedForCurrency = this.isPrefixAppliedForCurrency = !(['AED'].includes(this.selectedCurrency === 0 ? this.baseCurrencyDetails?.code : this.foreignCurrencyDetails?.code));
        this.selectedPrefixForCurrency = this.isPrefixAppliedForCurrency ? this.selectedCurrency === 0 ? this.baseCurrencyDetails?.symbol : this.foreignCurrencyDetails?.symbol : '';
        this.selectedSuffixForCurrency = this.isPrefixAppliedForCurrency ? '' : this.selectedCurrency === 0 ? this.baseCurrencyDetails?.symbol : this.foreignCurrencyDetails?.symbol;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // this.isLoading = true;
        this.lc = new LedgerVM();
        this.trxRequest = new TransactionsRequest();
        this.lc.blankLedger = this.lc.getBlankLedger();
        if (changes.activeAccountUniqueName && changes.activeAccountUniqueName.currentValue && changes.activeAccountUniqueName.currentValue !== changes.activeAccountUniqueName.previousValue) {
            this.trxRequest.accountUniqueName = changes.activeAccountUniqueName.currentValue;
            this.trxRequest.from = changes.from.currentValue;
            this.trxRequest.to = changes.to.currentValue;
            this.trxRequest.accountCurrency = true;
            this.getTransactionData();
        }
    }

    public getTransactionData() {
        this.closingBalanceBeforeReconcile = null;
        if (this.trxRequest?.accountUniqueName) {
            this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));
            const fromDate = this.trxRequest.from;
            const toDate = this.trxRequest.to;
            this.store.dispatch(this.ledgerActions.GetTransactions({ ...this.trxRequest, from: fromDate, to: toDate }));
        }
    }

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

    translationComplete(event: any) {
    }
}
