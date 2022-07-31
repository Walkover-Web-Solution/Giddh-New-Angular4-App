import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LoginActions } from 'apps/web-giddh/src/app/actions/login.action';
import { Configuration, SearchResultText, GIDDH_DATE_RANGE_PICKER_RANGES, RATE_FIELD_PRECISION, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT_MM_DD_YYYY } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import * as moment from 'moment/moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { createSelector } from 'reselect';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject, } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, take, takeUntil } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CompanyActions } from '../actions/company.actions';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { LoaderService } from '../loader/loader.service';
import { cloneDeep, filter, find, uniq } from '../lodash-optimized';
import { AccountResponse, AccountResponseV2 } from '../models/api-models/Account';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ICurrencyResponse, TaxResponse } from '../models/api-models/Company';
import { DownloadLedgerRequest, TransactionsRequest, TransactionsResponse, ExportLedgerRequest, } from '../models/api-models/Ledger';
import { SalesOtherTaxesModal } from '../models/api-models/Sales';
import { AdvanceSearchRequest } from '../models/interfaces/AdvanceSearchRequest';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import { LEDGER_API } from '../services/apiurls/ledger.api';
import { GeneralService } from '../services/general.service';
import { LedgerService } from '../services/ledger.service';
import { ToasterService } from '../services/toaster.service';
import { WarehouseActions } from '../settings/warehouse/action/warehouse.action';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../store';
import { BorderConfiguration, IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { NewLedgerEntryPanelComponent } from './components/new-ledger-entry-panel/new-ledger-entry-panel.component';
import { UpdateLedgerEntryPanelComponent } from './components/update-ledger-entry-panel/update-ledger-entry-panel.component';
import { BlankLedgerVM, LedgerVM, TransactionVM } from './ledger.vm';
import { download } from "@giddh-workspaces/utils";
import { SearchService } from '../services/search.service';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { MatDialog } from '@angular/material/dialog';
import { ImportStatementComponent } from './components/import-statement/import-statement.component';
import { ExportLedgerComponent } from './components/export-ledger/export-ledger.component';
import { ShareLedgerComponent } from './components/share-ledger/share-ledger.component';
import { ConfirmModalComponent } from '../theme/new-confirm-modal/confirm-modal.component';
import { GenerateVoucherConfirmationModalComponent } from './components/generate-voucher-confirm-modal/generate-voucher-confirm-modal.component';
import { CommonService } from '../services/common.service';
import { AdjustmentUtilityService } from '../shared/advance-receipt-adjustment/services/adjustment-utility.service';

@Component({
    selector: 'ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.scss'],
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

export class LedgerComponent implements OnInit, OnDestroy {
    @ViewChild('updateledgercomponent', { static: false }) public updateledgercomponent: ElementViewContainerRef;
    @ViewChildren(ShSelectComponent) public dropDowns: QueryList<ShSelectComponent>;
    public imgPath: string = '';
    public lc: LedgerVM;
    public selectedInvoiceList: string[] = [];
    public accountInprogress$: Observable<boolean>;
    public universalDate$: Observable<any>;
    public trxRequest: TransactionsRequest;
    public advanceSearchRequest: AdvanceSearchRequest;
    public isLedgerCreateSuccess$: Observable<boolean>;
    public needToReCalculate: BehaviorSubject<boolean> = new BehaviorSubject(false);
    @ViewChild('newLedPanel', { static: false }) public newLedgerComponent: NewLedgerEntryPanelComponent;
    @ViewChild('updateLedgerModal', { static: false }) public updateLedgerModal: any;
    /** Instance of advance search modal */
    @ViewChild('advanceSearchModal', { static: false }) public advanceSearchModal: any;
    /** datepicker element reference  */
    @ViewChild('datepickerTemplate', { static: false }) public datepickerTemplate: ElementRef;
    /** Instance of entry confirmation modal */
    @ViewChild('entryConfirmModal', { static: false }) public entryConfirmModal: any;
    public isTransactionRequestInProcess$: Observable<boolean>;
    public ledgerBulkActionSuccess$: Observable<boolean>;
    public searchTermStream: Subject<string> = new Subject();
    public showLoader: boolean = false;
    public eLedgType: string;
    public eDrBalAmnt: number;
    public eCrBalAmnt: number;
    public isBankOrCashAccount: boolean;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public failedBulkEntries$: Observable<string[]>;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public isFileUploading: boolean = false;
    /** Boolean for mobile screen or not  */
    public isMobileScreen: boolean = true;
    public closingBalanceBeforeReconcile: { amount: number, type: string };
    public reconcileClosingBalanceForBank: { amount: number, type: string };
    // aside menu properties
    public asideMenuState: string = 'out';
    public needToShowLoader: boolean = true;
    public entryUniqueNamesForBulkAction: string[] = [];
    public searchText: string = '';
    public isCompanyCreated$: Observable<boolean>;
    public debitSelectAll: boolean = false;
    public creditSelectAll: boolean = false;
    public debitCreditSelectAll: boolean = false;
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
    public companyTaxesList: TaxResponse[] = [];
    public selectedTxnAccUniqueName: string = '';
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public asideMenuStateForOtherTaxes: string = 'out';
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
    public accountUniquename: any;
    /** Transactions dates array */
    public allTransactionsList: any[] = [];
    public allTransactionDates: any[] = [];
    public Shown: boolean = true;
    public isHide: boolean = false;
    public condition: boolean = true;
    public condition2: boolean = false;
    public visibleTransactionTypeMobile: string = "all";
    public ledgerTransactions: any;

    /* New Datepicker Variables */

    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerRanges: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Default search suggestion list to be shown for search */
    public defaultSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the search results pagination details */
    public searchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the default search results pagination details (required only for passing
     * default search pagination details to Update ledger component) */
    public defaultResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
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
    /** Border configuration for branch dropdown */
    public branchDropdownBorderConfiguration: BorderConfiguration = { style: 'border-radius: 5px !important' };
    /** True if current organization type is company */
    public showBranchSwitcher: boolean;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** This will hold bank transactions api response */
    public bankTransactionsResponse: any = { totalItems: 0, totalPages: 0, page: 1, countPerPage: PAGINATION_LIMIT };
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
    public voucherApiVersion: 1 | 2;
    /** Selected entry details */
    public selectedItem: any;
    /** Pagination Object */
    public paginationObject: any = {
        totalItems: 0,
        itemsPerPage: 0,
        page: 0,
        totalPages: 0,
        showPagination: false
    };

    constructor(
        private store: Store<AppState>,
        private ledgerActions: LedgerActions,
        private route: ActivatedRoute,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private loginActions: LoginActions,
        private loaderService: LoaderService,
        private warehouseActions: WarehouseActions,
        private cdRf: ChangeDetectorRef,
        private breakPointObservar: BreakpointObserver,
        private modalService: BsModalService,
        private searchService: SearchService,
        private settingsBranchAction: SettingsBranchActions,
        private zone: NgZone,
        public dialog: MatDialog,
        private commonService: CommonService,
        private adjustmentUtilityService: AdjustmentUtilityService
    ) {
        this.lc = new LedgerVM();
        this.advanceSearchRequest = new AdvanceSearchRequest();
        this.trxRequest = new TransactionsRequest();
        this.lc.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
        this.accountInprogress$ = this.store.pipe(select(p => p.ledger.accountInprogress), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
        this.lc.transactionData$ = this.store.pipe(select(p => p.ledger.transactionsResponse), takeUntil(this.destroyed$), shareReplay(1));
        this.isLedgerCreateSuccess$ = this.store.pipe(select(p => p.ledger.ledgerCreateSuccess), takeUntil(this.destroyed$));
        this.lc.companyProfile$ = this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.isTransactionRequestInProcess$ = this.store.pipe(select(p => p.ledger.transactionInprogress), takeUntil(this.destroyed$));
        this.ledgerBulkActionSuccess$ = this.store.pipe(select(p => p.ledger.ledgerBulkActionSuccess), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.isCompanyCreated$ = this.store.pipe(select(s => s.session.isCompanyCreated), takeUntil(this.destroyed$));
        this.failedBulkEntries$ = this.store.pipe(select(p => p.ledger.ledgerBulkActionFailedEntries), takeUntil(this.destroyed$));
    }

    public toggleShow() {
        this.condition = this.condition ? false : true;
        this.condition2 = this.condition ? false : true;
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
        this.hideGiddhDatepicker();

        this.needToShowLoader = false;
        let from = moment(value.startDate, GIDDH_DATE_FORMAT).toDate();
        let to = moment(value.endDate, GIDDH_DATE_FORMAT).toDate();

        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
            page: 0,
            dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                bsRangeValue: [from, to]
            })
        });
        this.trxRequest.from = moment(value.startDate).format(GIDDH_DATE_FORMAT);
        this.trxRequest.to = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        this.todaySelected = true;
        this.lc.blankLedger.entryDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);

        if (this.isAdvanceSearchImplemented) {
            this.store.dispatch(this.ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, this.trxRequest.from, this.trxRequest.to, this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q, this.advanceSearchRequest.branchUniqueName));
        } else {
            this.getTransactionData();
        }
        // Después del éxito de la entrada. llamar para transacciones bancarias
        this.lc.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe((data: AccountResponse) => {
            this.getBankTransactions();
        });
    }

    public selectAccount(e: IOption, txn: TransactionVM, clearAccount?: boolean) {
        this.keydownClassAdded = false;
        this.selectedTxnAccUniqueName = '';
        if (!e.value || clearAccount) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            this.lc.currentBlankTxn = null;
            txn.amount = 0;
            txn.total = 0;
            // reset taxes and discount on selected account change
            txn.tax = 0;
            txn.taxes = [];
            txn.discount = 0;
            txn.discounts = [
                this.lc.staticDefaultDiscount()
            ];
            txn.particular = undefined;
            return;
        }
        let requestObject;
        if (e.additional.stock) {
            requestObject = {
                stockUniqueName: e.additional.stock.uniqueName,
                oppositeAccountUniqueName: e.additional?.uniqueName
            };
        }
        const currentLedgerCategory = this.lc.activeAccount ? this.generalService.getAccountCategory(this.lc.activeAccount, this.lc.activeAccount.uniqueName) : '';
        /** If current ledger is of income or expense category then send current ledger unique name else send particular account unique name
            to fetch the correct stock details as the first preference is always the current ledger account and then particular account
            This logic is only required in ledger.
        */
        const accountUniqueName = e.additional.stock && (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
            this.lc.activeAccount ? this.lc.activeAccount.uniqueName : '' :
            e.additional?.uniqueName;
        this.searchService.loadDetails(accountUniqueName, requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.body) {
                txn.showTaxationDiscountBox = false;
                // Take taxes of parent group and stock's own taxes
                const taxes = this.generalService.fetchTaxesOnPriority(
                    data.body.stock?.taxes ?? [],
                    data.body.stock?.groupTaxes ?? [],
                    data.body.taxes ?? [],
                    data.body.groupTaxes ?? []);
                if (txn.taxesVm) {
                    txn.taxesVm.forEach(tax => {
                        tax.isChecked = false;
                        tax.isDisabled = false;
                    });
                }
                txn.selectedAccount = {
                    ...e.additional,
                    label: e.label,
                    category: data.body.category,
                    value: e.value,
                    isHilighted: true,
                    applicableTaxes: taxes,
                    currency: data.body.currency,
                    currencySymbol: data.body.currencySymbol,
                    email: data.body.emails,
                    isFixed: data.body.isFixed,
                    mergedAccounts: data.body.mergedAccounts,
                    mobileNo: data.body.mobileNo,
                    nameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.name).join(', ') : '',
                    stock: data.body.stock,
                    uNameStr: e.additional && e.additional.parentGroups ? e.additional.parentGroups.map(parent => parent?.uniqueName).join(', ') : '',
                    accountApplicableDiscounts: data.body.applicableDiscounts,
                    parentGroups: e.additional.stock ? data.body.oppositeAccount.parentGroups : data.body.parentGroups
                    // added due to parentGroups is getting null in search API
                };
                if (txn.selectedAccount && txn.selectedAccount.stock) {
                    txn.selectedAccount.stock.rate = Number((txn.selectedAccount.stock.rate / this.lc.blankLedger.exchangeRate).toFixed(RATE_FIELD_PRECISION));
                }
                this.lc.currentBlankTxn = txn;
                let rate = 0;
                let unitCode = '';
                let stockName = '';
                let stockUniqueName = '';

                //#region unit rates logic
                if (txn.selectedAccount && txn.selectedAccount.stock) {
                    let defaultUnit = {
                        stockUnitCode: txn.selectedAccount.stock.stockUnitCode,
                        code: txn.selectedAccount.stock.stockUnitCode,
                        rate: txn.selectedAccount.stock.rate,
                        name: txn.selectedAccount.stock.name
                    };
                    txn.unitRate = txn.selectedAccount.stock.unitRates.map(unitRate => ({ ...unitRate, code: unitRate.stockUnitCode }));
                    stockName = defaultUnit.name;
                    rate = defaultUnit.rate;
                    stockUniqueName = txn.selectedAccount.stock.uniqueName;
                    unitCode = defaultUnit.code;
                }
                if (stockName && stockUniqueName) {
                    txn.inventory = {
                        stock: {
                            name: stockName,
                            uniqueName: stockUniqueName
                        },
                        quantity: 1,
                        unit: {
                            stockUnitCode: unitCode,
                            code: unitCode,
                            rate
                        }
                    };
                } else {
                    delete txn.inventory;
                }
                if (rate > 0) {
                    txn.amount = rate;
                }
                // check if selected account category allows to show taxationDiscountBox in newEntry popup
                this.needToReCalculate.next(true);
                txn.showTaxationDiscountBox = this.getCategoryNameFromAccountUniqueName(txn);
                txn.showOtherTax = this.showOtherTax(txn);
                if (this.newLedgerComponent) {
                    this.newLedgerComponent.preparePreAppliedDiscounts();
                }
                this.handleRcmVisibility(txn);
                this.handleTaxableAmountVisibility(txn);
                if (this.newLedgerComponent) {
                    this.newLedgerComponent.calculatePreAppliedTax();
                    this.newLedgerComponent.calculateTax();
                    this.newLedgerComponent.calculateTotal();
                }
                this.selectedTxnAccUniqueName = txn.selectedAccount?.uniqueName;
                this.cdRf.detectChanges();
            }
        });
    }

    public hideEledgerWrap() {
        this.lc.showEledger = false;
        this.entryUniqueNamesForBulkAction = [];
    }
    /**
     * To change pagination page number
     *
     * @param {*} event Pagination change event
     * @memberof LedgerComponent
     */
    public pageChanged(event: any): void {
        this.trxRequest.page = event.page;

        if (this.isAdvanceSearchImplemented) {
            this.advanceSearchRequest.page = event.page;
            this.getAdvanceSearchTxn();
        } else {
            this.getTransactionData();
        }
    }

    public ngOnInit() {
        document.querySelector('body').classList.add('ledger-body');
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        // get company taxes
        this.store.dispatch(this.companyActions.getTax());
        // reset redirect state from login action
        this.store.dispatch(this.loginActions.ResetRedirectToledger());

        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.breakPointObservar.observe([
            '(max-width: 991px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
            if (this.isMobileScreen) {
                this.arrangeLedgerTransactionsForMobile();
            }
        });
        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        if (this.currentOrganizationType === OrganizationType.Company) {
            this.showBranchSwitcher = true;
            this.currentCompanyBranches$.subscribe(response => {
                if (response && response.length) {
                    this.currentCompanyBranches = response.map(branch => ({
                        label: branch?.alias,
                        value: branch?.uniqueName,
                        name: branch?.name,
                        parentBranch: branch?.parentBranch
                    }));
                    this.currentCompanyBranches.unshift({
                        label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
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
                                alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                                uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                            };
                        }
                    }
                    this.trxRequest.branchUniqueName = this.currentBranch?.uniqueName;
                    this.advanceSearchRequest.branchUniqueName = this.currentBranch?.uniqueName;
                    if (this.currentOrganizationType === OrganizationType.Branch ||
                        (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) {
                        // Add the blank transaction only if it is branch mode or company with single branch
                        this.lc.blankLedger.transactions = [
                            this.lc.addNewTransaction('DEBIT'),
                            this.lc.addNewTransaction('CREDIT')
                        ]
                    }
                } else {
                    if (this.generalService.companyUniqueName) {
                        // Avoid API call if new user is onboarded
                        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                    }
                }
            });
        } else {
            this.showBranchSwitcher = false;
        }
        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };
        this.shouldShowItcSection = false;
        this.shouldShowRcmTaxableAmount = false;
        observableCombineLatest([this.universalDate$, this.route.params, this.todaySelected$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
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
                this.selectedDateRange = { startDate: moment(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: moment(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
                this.selectedDateRangeUi = moment(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                    dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                        bsRangeValue: [moment(from, GIDDH_DATE_FORMAT).toDate(), moment(to, GIDDH_DATE_FORMAT).toDate()]
                    })
                });
                this.advanceSearchRequest.to = to;
                this.advanceSearchRequest.page = 0;

                this.trxRequest.from = from;
                this.trxRequest.to = to;
                this.trxRequest.page = 0;
                this.isDefaultLoad = false;
            } else {
                // means ledger is opened normally
                if (dateObj && !this.todaySelected) {
                    let universalDate = _.cloneDeep(dateObj);

                    this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                    this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: [moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(), moment(universalDate[1], GIDDH_DATE_FORMAT).toDate()]
                        })
                    });
                    this.advanceSearchRequest.to = universalDate[1];
                    this.advanceSearchRequest.page = 0;

                    this.trxRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.trxRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.trxRequest.page = 0;
                } else {
                    this.selectedDateRange = { startDate: moment(), endDate: moment() };
                    this.selectedDateRangeUi = moment().format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment().format(GIDDH_NEW_DATE_FORMAT_UI);

                    // set advance search bsRangeValue to blank, because we are depending api to give us from and to date
                    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: []
                        })
                    });
                    this.advanceSearchRequest.page = 0;
                    this.trxRequest.page = 0;

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
                this.needToShowLoader = true;
                this.searchText = '';
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
                this.showLoader = _.clone(s);
            } else {
                this.showLoader = false;
            }
        });

        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.lc.currencies = res;
            }
        });

        this.lc.transactionData$.pipe(takeUntil(this.destroyed$)).subscribe((lt: any) => {
            if (lt) {
                // set date picker to and from date, as what we got from api in case of today selected from universal date
                if (lt.from && lt.to && this.todaySelected) {
                    let dateRange = { fromDate: '', toDate: '' };
                    dateRange = this.generalService.dateConversionToSetComponentDatePicker(lt.from, lt.to);
                    this.selectedDateRange = { startDate: moment(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: moment(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
                    this.selectedDateRangeUi = moment(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
                }

                this.ledgerTransactions = lt;

                if (this.isMobileScreen) {
                    this.arrangeLedgerTransactionsForMobile();
                }

                if (lt.periodClosingBalance) {
                    this.closingBalanceBeforeReconcile = lt.periodClosingBalance;
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
                }
                if (lt.closingBalanceForBank) {
                    this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
                    this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
                }

                let checkedEntriesName: any[] = uniq([
                    ...lt.debitTransactions.filter(f => f.isChecked).map(dt => ({ uniqueName: dt.entryUniqueName, type: 'debit' })),
                    ...lt.creditTransactions.filter(f => f.isChecked).map(ct => ({ uniqueName: ct.entryUniqueName, type: 'credit' })),
                ]);

                if (checkedEntriesName && checkedEntriesName.length) {
                    checkedEntriesName.forEach(f => {
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
                        showPagination: true
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
            if (txnBalance) {
                this.ledgerTxnBalance = txnBalance;
                this.lc.calculateReckonging(txnBalance);
                this.cdRf.detectChanges();
            }
        });

        this.isLedgerCreateSuccess$.subscribe(s => {
            if (s) {
                this.toaster.showSnackBar("success", this.localeData?.entry_created, this.commonLocaleData?.app_success);
                this.lc.showNewLedgerPanel = false;
                this.lc.showBankLedgerPanel = false;
                this.getTransactionData();
                this.resetBlankTransaction();
                this.resetPreviousSearchResults();
                // After the success of the entrance call for bank transactions
                this.lc.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe((data: AccountResponse) => {
                    this.loaderService.show();
                    this.getBankTransactions();
                });
            }
        });

        this.searchTermStream.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
            .subscribe(term => {
                this.trxRequest.q = term;
                this.trxRequest.page = 0;
                this.needToShowLoader = false;
                this.getTransactionData();
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
                this.getTransactionData();
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
                        permanentlyDeleteMessage: ' '
                    }
                });

                dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    if (response) {
                        this.confirmMergeEntry();
                    } else {
                        this.cancelMergeEntry();
                    }
                });
            }
        });
        this.voucherApiVersion = this.generalService.voucherApiVersion;
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
    public getBankTransactions(): void {
        this.entryUniqueNamesForBulkAction = [];
        if (this.trxRequest.accountUniqueName) {
            this.isBankTransactionLoading = true;

            let getRequest = { accountUniqueName: this.trxRequest.accountUniqueName, from: this.trxRequest.from, count: this.bankTransactionsResponse.countPerPage, page: this.bankTransactionsResponse.page }
            this.ledgerService.GetBankTransactionsForLedger(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                this.isBankTransactionLoading = false;
                if (res.status === 'success') {
                    if (res.body) {
                        this.bankTransactionsResponse.totalItems = res.body.totalItems;
                        this.bankTransactionsResponse.totalPages = res.body.totalPages;
                        this.bankTransactionsResponse.page = res.body.page;
                        this.zone.runOutsideAngular(() => {
                            this.lc.getReadyBankTransactionsForUI(res.body.transactionsList, (this.currentOrganizationType === OrganizationType.Company && (this.currentCompanyBranches && this.currentCompanyBranches.length > 2)));
                        });
                        this.cdRf.detectChanges();
                    }
                }
            });
        }
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
        this.lc.showBankLedgerPanel = false;
        this.lc.currentBlankTxn = null;
        this.lc.selectedBankTxnUniqueName = null;
    }

    public clickUnpaidInvoiceList(e?: boolean) {
        if (e) {
            if (this.accountUniquename === 'cash' || this.accountUniquename === 'bankaccounts' && this.selectedTxnAccUniqueName) {
                this.getInvoiceLists({ accountUniqueName: this.selectedTxnAccUniqueName, status: 'unpaid' });
            } else {
                this.getInvoiceLists({ accountUniqueName: this.accountUniquename, status: 'unpaid' });
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
        if (voucherType && this.selectedTxnAccUniqueName && this.accountUniquename) {
            let request;

            let activeAccount = null;
            this.lc.activeAccount$.pipe(take(1)).subscribe(account => activeAccount = account);

            if (this.voucherApiVersion === 2) {
                request = this.adjustmentUtilityService.getInvoiceListRequest({ particularAccount: event[0]?.selectedAccount, voucherType: voucherType, ledgerAccount: activeAccount });
            } else {
                request = {
                    accountUniqueNames: [this.selectedTxnAccUniqueName, this.accountUniquename],
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
                    date = moment(this.lc.blankLedger.entryDate).format(GIDDH_DATE_FORMAT);
                }
            }
            this.invoiceList = [];
            this.ledgerService.getInvoiceListsForCreditNote(request, date).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response && response.body) {
                    let items = [];
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    items?.forEach(invoice => {
                        invoice.voucherNumber = this.generalService.getVoucherNumberLabel(invoice?.voucherType, invoice?.voucherNumber, this.commonLocaleData);

                        this.invoiceList.push({ label: invoice?.voucherNumber ? invoice.voucherNumber : '-', value: invoice?.uniqueName, additional: invoice })
                    });
                }
            });
        }
    }

    public saveBankTransaction() {
        let blankTransactionObj: BlankLedgerVM = this.lc.prepareBankLedgerRequestObject();
        blankTransactionObj.invoicesToBePaid = this.selectedInvoiceList;
        delete blankTransactionObj['voucherType'];
        if (blankTransactionObj && blankTransactionObj.transactions && blankTransactionObj.transactions.length > 0) {
            this.store.dispatch(this.ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
        } else {
            this.toaster.showSnackBar("error", this.localeData?.transaction_required, this.commonLocaleData?.app_error);
        }
    }

    public getselectedInvoice(event: string[]) {
        this.selectedInvoiceList = event;
    }

    public getTransactionData() {
        this.closingBalanceBeforeReconcile = null;
        this.store.dispatch(this.ledgerActions.GetLedgerBalance(this.trxRequest));
        this.store.dispatch(this.ledgerActions.GetTransactions(this.trxRequest));
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
            let date = moment().format(GIDDH_DATE_FORMAT);
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

    public toggleTransactionType(event: any) {
        this.lc.showNewLedgerPanel = false;
        let allTrx: TransactionVM[] = filter(this.lc.blankLedger.transactions, bl => bl.type === event.type);
        let unAccountedTrx = find(allTrx, a => !a.selectedAccount);

        if (unAccountedTrx) {
            this.selectBlankTxn(unAccountedTrx);

            this.dropDowns.filter(dd => dd.idEl === unAccountedTrx.id).forEach(dd => {
                setTimeout(() => {
                    dd.show(null);
                }, 0);
            });
        } else {
            const currentlyAddedTransaction = this.lc.currentBlankTxn;
            if (currentlyAddedTransaction.inventory) {
                // Add the warehouse selected for an item
                currentlyAddedTransaction.inventory['warehouse'] = { name: '', uniqueName: event.warehouse };
            }
            let newTrx = this.lc.addNewTransaction(event.type);
            this.lc.blankLedger.transactions.push(newTrx);
            this.selectBlankTxn(newTrx);
            setTimeout(() => {
                this.dropDowns.filter(dd => dd.idEl === newTrx.id).forEach(dd => {
                    dd.show(null);
                });
            }, 0);
        }
    }

    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this.ledgerService.DownloadAttachement(fileName).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d?.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body.uploadedFile, `image/${d.body.fileType}`, 512);
                download(d.body.name, blob, `image/${d.body.fileType}`)
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
            downloadRequest.uniqueName = transaction.voucherUniqueName;
        } else {
            downloadRequest.invoiceNumber = [transaction.voucherNumber];
        }
        downloadRequest.voucherType = transaction.voucherGeneratedType;

        this.ledgerService.DownloadInvoice(downloadRequest, this.lc.accountUnq).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d.status === 'success') {
                let blob = this.generalService.base64ToBlob(d.body, 'application/pdf', 512);
                download(`${activeAccount.name} - ${transaction.voucherNumber}.pdf`, blob, 'application/pdf');
            } else {
                this.toaster.showSnackBar("error", d.message);
            }
        });
    }

    public resetBlankTransaction() {
        this.lc.blankLedger = this.lc.getBlankLedger();
        this.lc.blankLedger.transactions =
            (this.currentOrganizationType === OrganizationType.Branch ||
                (this.currentCompanyBranches && this.currentCompanyBranches.length === 2)) ? [ // Add the blank transaction only if it is branch mode or company with single branch
                this.lc.addNewTransaction('DEBIT'),
                this.lc.addNewTransaction('CREDIT')
            ] : [];
        this.lc.blankLedger.voucherType = null;
        this.lc.blankLedger.entryDate = this.selectedDateRange?.endDate ? moment(this.selectedDateRange.endDate).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);
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

    public onEnter(se, txn) {
        if (!this.isSelectOpen) {
            this.isSelectOpen = true;
            se.show();
            this.showNewLedgerEntryPopup(txn);
        }
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
    }

    public showUpdateLedgerModal(txn: ITransactionItem) {
        let transactions: TransactionsResponse = null;
        this.store.pipe(select(t => t.ledger.transactionsResponse), take(1)).subscribe(trx => transactions = trx);
        if (transactions) {
            this.store.dispatch(this.ledgerActions.setAccountForEdit(this.lc.accountUnq));
        }
        this.store.dispatch(this.ledgerActions.setTxnForEdit(txn.entryUniqueName));
        this.lc.selectedTxnUniqueName = txn.entryUniqueName;

        this.loadUpdateLedgerComponent();
    }

    public hideUpdateLedgerModal() {
        this.updateLedgerModalDialogRef?.close();
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof LedgerComponent
     */
    public handleScrollEnd(): void {
        if (this.searchResultsPaginationData.page < this.searchResultsPaginationData.totalPages) {
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
                        this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    public showShareLedgerModal() {
        this.shareLedgerDates.from = moment(this.selectedDateRange.startDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        this.shareLedgerDates.to = moment(this.selectedDateRange.endDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

        this.dialog.open(ShareLedgerComponent, {
            width: '630px',
            data: {
                accountUniqueName: this.lc.accountUnq,
                advanceSearchRequest: this.advanceSearchRequest,
                from: this.shareLedgerDates?.from,
                to: this.shareLedgerDates?.to
            }
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
                page: 0,
                dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                    bsRangeValue: [this.selectedDateRange.startDate, this.selectedDateRange.endDate]
                })
            });
        }

        let dialogRef = this.dialog.open(ExportLedgerComponent, {
            width: '630px',
            data: {
                accountUniqueName: this.lc.accountUnq,
                advanceSearchRequest: this.advanceSearchRequest
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.onShowColumnarReportTable(response);
            }
        });
    }

    public saveBlankTransaction() {
        this.loaderService.show();

        if (this.lc.blankLedger.entryDate) {
            if (!moment(this.lc.blankLedger.entryDate, GIDDH_DATE_FORMAT).isValid()) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_date);
                this.loaderService.hide();
                return;
            } else {
                this.lc.blankLedger.entryDate = moment(this.lc.blankLedger.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }

        if (this.lc.blankLedger.chequeClearanceDate) {
            if (!moment(this.lc.blankLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).isValid()) {
                this.toaster.showSnackBar("error", this.localeData?.invalid_cheque_clearance_date);
                this.loaderService.hide();
                return;
            } else {
                this.lc.blankLedger.chequeClearanceDate = moment(this.lc.blankLedger.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }

        let blankTransactionObj: BlankLedgerVM = this.lc.prepareBlankLedgerRequestObject();


        if (blankTransactionObj && blankTransactionObj.transactions && blankTransactionObj.transactions.length > 0) {
            if (this.voucherApiVersion === 2) {
                blankTransactionObj = this.adjustmentUtilityService.getAdjustmentObject(blankTransactionObj);
            }

            this.store.dispatch(this.ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
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
        this.trxRequest.page = 0;
        let accountUniqueName = this.advanceSearchRequest.accountUniqueName;
        this.advanceSearchRequest = new AdvanceSearchRequest();
        this.advanceSearchRequest.accountUniqueName = accountUniqueName;
        this.search("");
        this.getTransactionData();
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
        if (txn.selectedAccount) {
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

        if (this.generalService.isReceiptPaymentEntry(activeAccount, txn.selectedAccount)) {
            showOtherTaxOption = true;
        }

        // if url's account allows show discount and tax popup then don't check for selected account
        if (showOtherTaxOption) {
            return true;
        }

        // check selected account category
        if (txn.selectedAccount) {
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
        document.querySelector('body').classList.remove('ledger-body');
        this.store.dispatch(this.ledgerActions.ResetLedger());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public loadUpdateLedgerComponent() {
        this.updateLedgerModalDialogRef = this.dialog.open(this.updateLedgerModal, {
            width: '70%',
            height: '650px'
        });

        this.updateLedgerModalDialogRef.afterClosed().pipe(take(1)).subscribe(() => {
            this.hideUpdateLedgerModal();
            this.entryManipulated();
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
            const currentLedgerCategory = this.lc.activeAccount ? this.generalService.getAccountCategory(this.lc.activeAccount, this.lc.activeAccount.uniqueName) : '';
            // If current ledger is of income or expense category then send current ledger as stockAccountUniqueName. Only required for ledger.
            const accountUniqueName = (currentLedgerCategory === 'income' || currentLedgerCategory === 'expenses') ?
                this.lc.activeAccount ? this.lc.activeAccount.uniqueName : '' :
                '';
            const requestObject = {
                q: encodeURIComponent(query),
                page,
                withStocks,
                stockAccountUniqueName: encodeURIComponent(accountUniqueName) || undefined
            }
            this.searchService.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
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
                    this.searchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultResultsPaginationData.page = this.searchResultsPaginationData.page;
                        this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
                    }
                    this.cdRf.detectChanges();
                }
            });
        } else {
            this.searchResults = [...this.defaultSuggestions];
            this.searchResultsPaginationData.page = this.defaultResultsPaginationData.page;
            this.searchResultsPaginationData.totalPages = this.defaultResultsPaginationData.totalPages;
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
            page: 0,
            totalPages: 0,
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
                page: 0,
                dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                    bsRangeValue: [this.selectedDateRange.startDate, this.selectedDateRange.endDate]
                })
            });
        }

        this.advanceSearchDialogRef = this.dialog.open(this.advanceSearchModal, {
            width: '980px'
        });
    }

    public search(term: string): void {
        this.searchTermStream.next(term);
    }

    /**
     * closeAdvanceSearchPopup
     */
    public closeAdvanceSearchPopup(event) {
        this.advanceSearchDialogRef?.close();
        if (!event.isClose) {
            this.getAdvanceSearchTxn();
            if (event.advanceSearchData) {
                if (event.advanceSearchData['dataToSend']['bsRangeValue'] && event.advanceSearchData['dataToSend']['bsRangeValue'].length) {
                    this.selectedDateRange = { startDate: moment(event.advanceSearchData.dataToSend.bsRangeValue[0]), endDate: moment(event.advanceSearchData.dataToSend.bsRangeValue[1]) };
                    this.selectedDateRangeUi = moment(event.advanceSearchData.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(event.advanceSearchData.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                }
            }
        }
    }

    public getReconciliation() {
        this.lc.transactionData$.pipe(take(1)).subscribe((val) => {
            if (val) {
                this.closingBalanceBeforeReconcile = val.periodClosingBalance;
                if (this.closingBalanceBeforeReconcile) {
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? this.localeData?.cr : this.localeData?.dr;
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

        this.lc.transactionData$.pipe(take(1)).subscribe(s => {
            if (s) {
                debitTrx = s.debitTransactions;
                creditTrx = s.creditTransactions;
            }
        });

        this.entryUniqueNamesForBulkAction.push(
            ...[
                ...debitTrx.filter(f => f.isChecked).map(dt => dt.entryUniqueName),
                ...creditTrx.filter(f => f.isChecked).map(ct => ct.entryUniqueName),
            ]);

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

    public selectAllEntries(ev: any, type: 'debit' | 'credit' | 'all') {
        if (!ev.checked) {
            if (type === 'all') {
                this.debitCreditSelectAll = false;
            } else if (type === 'debit') {
                this.debitSelectAll = false;
            } else {
                this.creditSelectAll = false;
            }
            this.selectedTrxWhileHovering = null;
        }
        this.checkedTrxWhileHovering = [];

        this.store.dispatch(this.ledgerActions.SelectDeSelectAllEntries(type, ev.checked));
    }

    public selectEntryForBulkAction(ev: any, entryUniqueName: string) {
        if (entryUniqueName) {
            if (ev.checked) {
                this.entryUniqueNamesForBulkAction.push(entryUniqueName);
            } else {
                let itemIndx = this.entryUniqueNamesForBulkAction.findIndex((item) => item === entryUniqueName);
                this.entryUniqueNamesForBulkAction.splice(itemIndx, 1);
            }
        }
    }

    public entryHovered(uniqueName: string) {
        this.selectedTrxWhileHovering = uniqueName;
    }

    public entrySelected(ev: any, uniqueName: string, type: string) {
        const totalLength = (type === 'debit') ? this.ledgerTransactions.debitTransactions.length :
            (type === 'credit') ? this.ledgerTransactions.creditTransactions.length :
                (this.ledgerTransactions.debitTransactions.length + this.ledgerTransactions.creditTransactions.length);
        if (ev.checked) {
            this.checkedTrxWhileHovering.push({ type, uniqueName });
            this.store.dispatch(this.ledgerActions.SelectGivenEntries([uniqueName]));
            const currentLength = this.isMobileScreen ?
                this.checkedTrxWhileHovering.length
                : this.checkedTrxWhileHovering.filter(transaction => transaction.type === type).length;
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
            let itemIndx = this.checkedTrxWhileHovering.findIndex((item) => item?.uniqueName === uniqueName);
            this.checkedTrxWhileHovering.splice(itemIndx, 1);
            const currentLength = this.isMobileScreen ?
                this.checkedTrxWhileHovering.length
                : this.checkedTrxWhileHovering.filter(transaction => transaction.type === type).length;
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

    public showBulkActionConfirmationModal(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_entries_title,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.localeData?.delete_entries_content
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.onConfirmationBulkActionConfirmation();
            } else {
                this.entryUniqueNamesForBulkAction = [];
            }
        });
    }

    public onConfirmationBulkActionConfirmation() {
        this.store.dispatch(this.ledgerActions.DeleteMultipleLedgerEntries(this.lc.accountUnq, _.cloneDeep(this.entryUniqueNamesForBulkAction)));
        this.entryUniqueNamesForBulkAction = [];
    }

    public showBulkActionGenerateVoucherModal(): void {
        let dialogRef = this.dialog.open(GenerateVoucherConfirmationModalComponent, {
            width: '630px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.select_voucher_generate,
                button1Text: this.commonLocaleData?.app_generate_multiple,
                button2Text: this.commonLocaleData?.app_generate_compound
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (typeof response === "boolean") {
                this.onSelectInvoiceGenerateOption(response);
            }
        });
    }

    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            let branchUniqueName = this.generalService.currentBranchUniqueName;
            this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
            this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            let url = Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName);
            if (this.generalService.voucherApiVersion === 2) {
                url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
                url = url.concat(`&branchUniqueName=${branchUniqueName}`);
            }
            const event: UploadInput = {
                type: 'uploadAll',
                url: url,
                method: 'POST',
                fieldName: 'file',
                data: { entries: _.cloneDeep(this.entryUniqueNamesForBulkAction).join() },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
            this.loaderService.show();
        } else if (output.type === 'done') {
            this.loaderService.hide();
            if (output.file.response.status === 'success') {
                this.entryUniqueNamesForBulkAction = [];
                this.getTransactionData();
                this.isFileUploading = false;
                this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.toaster.showSnackBar("error", output.file.response.message);
            }
        }
    }

    public onSelectInvoiceGenerateOption(isCombined: boolean) {
        this.entryUniqueNamesForBulkAction = _.uniq(this.entryUniqueNamesForBulkAction);
        if (this.voucherApiVersion === 2) {
            this.store.dispatch(this.ledgerActions.GenerateBulkLedgerInvoice({ combined: isCombined }, { entryUniqueNames: _.cloneDeep(this.entryUniqueNamesForBulkAction) }, 'ledger'));
        } else {
            this.store.dispatch(this.ledgerActions.GenerateBulkLedgerInvoice({ combined: isCombined }, [{ accountUniqueName: this.lc.accountUnq, entries: _.cloneDeep(this.entryUniqueNamesForBulkAction) }], 'ledger'));
        }
    }

    public openSelectFilePopup(fileInput: any) {
        if (!this.entryUniqueNamesForBulkAction || !this.entryUniqueNamesForBulkAction.length) {
            this.toaster.showSnackBar("error", this.localeData?.select_one_entry, this.commonLocaleData?.app_error);
            return;
        }
        fileInput.click();
    }

    public toggleBodyClass() {
        if (this.asideMenuState === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body')?.classList?.add('fixed');
        } else {
            document.querySelector('body')?.classList?.remove('fixed');
        }
    }

    public toggleAsidePane(event?, shSelectElement?: ShSelectComponent): void {
        if (event) {
            event.preventDefault();
        }
        if (shSelectElement) {
            this.closeActiveEntry(shSelectElement);
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleOtherTaxesAsidePane(updateLedgerModalVm: any): void {
        this.updateLedgerModalVm = updateLedgerModalVm;
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
        this.cdRf.detectChanges();
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
            if (res.status === 'success') {
                this.toaster.showSnackBar("success", this.localeData?.bank_transaction_deleted);
            }
        });
    }

    // endregion

    public toggleCurrency(event) {
        let isThereBlankEntry = this.lc.blankLedger.transactions.some(s => s.selectedAccount);
        if (isThereBlankEntry) {
            this.toaster.showSnackBar("error", this.localeData?.save_unfinished_entry);
            return false;
        }
        this.selectedCurrency = event.checked ? 1 : 0;
        this.currencyTogglerModel = this.selectedCurrency === 1;
        this.assignPrefixAndSuffixForCurrency();
        this.trxRequest.accountCurrency = this.selectedCurrency !== 1;
        this.getCurrencyRate();

        // assign multi currency details to new ledger component
        this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
        this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
        this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
        // If the currency toggle button is checked then it is not in account currency
        this.lc.blankLedger.valuesInAccountCurrency = !event.checked;

        this.getTransactionData();
    }

    public toggleCurrencyForDisplayInNewLedger(res: string) {
        this.getCurrencyRate(res);
    }

    public getAdvanceSearchTxn() {
        this.isAdvanceSearchImplemented = true;
        if (!this.todaySelected) {
            this.store.dispatch(this.ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
                moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT),
                this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q, this.advanceSearchRequest.branchUniqueName));
        } else {
            let from = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[0] ? moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : '';
            let to = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[1] ? moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : '';
            this.store.dispatch(this.ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend),
                this.advanceSearchRequest.accountUniqueName, from, to, this.advanceSearchRequest.page, this.advanceSearchRequest.count, null, this.advanceSearchRequest.branchUniqueName)
            );
        }
        this.cdRf.detectChanges();
    }

    public getInvoiceLists(request) {
        this.invoiceList = [];
        this.ledgerService.GetInvoiceList(request).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            _.map(res.body.invoiceList, (o) => {
                this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
            });
            _.uniqBy(this.invoiceList, 'value');
        });
    }

    public keydownPressed(e) {
        if (e?.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e?.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePane();
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
    public handleAmountInput(transaction: TransactionVM): void {
        if (transaction.amount !== undefined) {
            transaction.amount = Number(transaction.amount);
            this.needToReCalculate.next(true);
        }
    }

    /**
     * Branch change handler
     *
     * @memberof LedgerComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.trxRequest.branchUniqueName = selectedEntity.value;
        this.advanceSearchRequest.branchUniqueName = selectedEntity.value;
        this.getTransactionData();
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
        if (transaction.selectedAccount && !transaction.selectedAccount.parentGroups[0]?.uniqueName) {
            formattedCurrentLedgerAccountParentGroups = transaction.selectedAccount.parentGroups.map(parent => ({ uniqueName: parent }));
        }
        const currentLedgerAccountDetails = {
            uniqueName: this.lc.activeAccount ? this.lc.activeAccount.uniqueName : '',
            parentGroups: this.lc.activeAccount && this.lc.activeAccount.parentGroups ? this.lc.activeAccount.parentGroups : []
        };
        const selectedAccountDetails = {
            uniqueName: transaction.selectedAccount ? transaction.selectedAccount.uniqueName : '',
            parentGroups: formattedCurrentLedgerAccountParentGroups.length ? formattedCurrentLedgerAccountParentGroups : transaction.selectedAccount ? transaction.selectedAccount.parentGroups : []
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
        if (!this.lc || !this.lc.activeAccount || !this.lc.activeAccount.parentGroups || this.lc.activeAccount.parentGroups.length < 2) {
            return;
        }
        if (!transaction.selectedAccount || !transaction.selectedAccount.parentGroups || transaction.selectedAccount.parentGroups.length < 2) {
            return;
        }
        const currentLedgerSecondParent: any = this.lc.activeAccount.parentGroups[1]?.uniqueName ?? this.lc.activeAccount.parentGroups[1];
        const selectedAccountSecondParent: any = transaction.selectedAccount.parentGroups[1]?.uniqueName ?? transaction.selectedAccount.parentGroups[1];
        this.checkTouristSchemeApplicable(currentLedgerSecondParent, selectedAccountSecondParent);
        if (currentLedgerSecondParent === 'reversecharge' && transaction.type === 'CREDIT') {
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
        } else if (currentLedgerSecondParent === 'dutiestaxes' && transaction.type === 'DEBIT') {
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
     * Closes the active incomplete entry in ledger if user
     * presses the shortcut key 'Alt + C'
     *
     * @private
     * @param {ShSelectComponent} shSelectElement Current Sh select element instance
     * @memberof LedgerComponent
     */
    private closeActiveEntry(shSelectElement: ShSelectComponent): void {
        if (shSelectElement) {
            shSelectElement.hide();
        }
        this.hideBankLedgerPopup(true);
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
                    advanceSearch.dataToSend.bsRangeValue = [moment(date[0], GIDDH_DATE_FORMAT).toDate(), moment(date[1], GIDDH_DATE_FORMAT).toDate()];
                }
            });
        }
        event.exportRequest.from = moment(advanceSearch.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(advanceSearch.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
        event.exportRequest.to = moment(advanceSearch.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(advanceSearch.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);

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
                this.ledgerTransactions.debitTransactions.forEach(transaction => {
                    if (this.allTransactionsList[transaction.entryDate] === undefined) {
                        this.allTransactionsList[transaction.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction.entryDate].push(transaction);
                    index++;
                });
            } else if (this.visibleTransactionTypeMobile === "credit" && this.ledgerTransactions.creditTransactions) {
                this.ledgerTransactions.creditTransactions.forEach(transaction => {
                    if (this.allTransactionsList[transaction.entryDate] === undefined) {
                        this.allTransactionsList[transaction.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction.entryDate].push(transaction);
                    index++;
                });
            } else {
                this.ledgerTransactions.debitTransactions.forEach(transaction => {
                    if (this.allTransactionsList[transaction.entryDate] === undefined) {
                        this.allTransactionsList[transaction.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction.entryDate].push(transaction);
                    index++;
                });
                this.ledgerTransactions.creditTransactions.forEach(transaction => {
                    if (this.allTransactionsList[transaction.entryDate] === undefined) {
                        this.allTransactionsList[transaction.entryDate] = [];
                    }
                    transaction.index = index;
                    this.allTransactionsList[transaction.entryDate].push(transaction);
                    index++;
                });
            }

            if (this.allTransactionsList) {
                this.allTransactionDates = Object.keys(this.allTransactionsList);
            }
        }
    }

    /**
     * This will show the datepicker
     *
     * @memberof LedgerComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof LedgerComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof LedgerComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }

        this.hideGiddhDatepicker();

        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);

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
            this.defaultResultsPaginationData.totalPages = this.searchResultsPaginationData.totalPages;
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
            width: '630px',
            data: {
                accountUniqueName: this.lc.accountUnq,
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
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
                item.entryDate = moment(item.entryDate).format(GIDDH_DATE_FORMAT);
            }
        }
    }

    /**
     * This will change bank transactions pagination page number
     *
     * @param {*} event
     * @memberof LedgerComponent
     */
    public bankTransactionPageChanged(event: any): void {
        if (this.bankTransactionsResponse.page !== event.page) {
            this.bankTransactionsResponse.page = event.page;
            this.getBankTransactions();
        }
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
                    this.loadDefaultSearchSuggestions();
                    this.profileObj = profile;
                    this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                    this.entryUniqueNamesForBulkAction = [];
                    this.needToShowLoader = true;
                    this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';

                    let accountDetails: AccountResponse | AccountResponseV2 = data[0];
                    let parentOfAccount = accountDetails.parentGroups[0];

                    this.lc.getUnderstandingText(accountDetails?.accountType, accountDetails?.name, accountDetails?.parentGroups, this.localeData);
                    this.accountUniquename = accountDetails?.uniqueName;

                    this.getBankTransactions();

                    this.isBankOrCashAccount = accountDetails.parentGroups.some((grp) => grp?.uniqueName === 'bankaccounts');
                    if (accountDetails.currency && profile.baseCurrency) {
                        this.isLedgerAccountAllowsMultiCurrency = accountDetails.currency && accountDetails.currency !== profile.baseCurrency;
                    } else {
                        this.isLedgerAccountAllowsMultiCurrency = false;
                    }
                    this.foreignCurrencyDetails = { code: profile.baseCurrency, symbol: profile.baseCurrencySymbol };
                    if (this.isLedgerAccountAllowsMultiCurrency) {
                        this.baseCurrencyDetails = { code: accountDetails.currency, symbol: accountDetails.currencySymbol };
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
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
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
        let transactionIds = this.entryUniqueNamesForBulkAction.map((transaction: any) => transaction.transactionId);
        let params = { transactionIds: transactionIds };
        this.ledgerService.deleteBankTransactions(this.trxRequest.accountUniqueName, params).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.getBankTransactions();
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
     * @memberof LedgerComponent
     */
    public showUpdateLedgerModalIpad(txn: ITransactionItem): void {
        if (this.touchedTransaction?.entryUniqueName === txn?.entryUniqueName) {
            this.showUpdateLedgerModal(txn);
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
     * Download files (voucher/attachment)
     *
     * @param {*} transaction
     * @param {string} downloadOption
     * @memberof LedgerComponent
     */
    public downloadFiles(transaction: any, downloadOption: string, event: any): void {
        if (this.voucherApiVersion === 2) {
            let dataToSend = {
                voucherType: transaction.voucherGeneratedType,
                entryUniqueName: (transaction.voucherUniqueName) ? undefined : transaction.entryUniqueName,
                uniqueName: (transaction.voucherUniqueName) ? transaction.voucherUniqueName : undefined
            };

            let fileName = (downloadOption === "VOUCHER") ? transaction.voucherNumber + '.pdf' : transaction.attachedFileName;

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
                this.downloadAttachedFile(transaction.attachedFileUniqueName, event);
            }
        }
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
            height: '650px'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            this.getTransactionData();
        });
    }
}
