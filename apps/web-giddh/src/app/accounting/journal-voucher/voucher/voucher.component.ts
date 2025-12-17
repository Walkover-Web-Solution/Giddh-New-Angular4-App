import {
    AfterViewInit,
    TemplateRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ChangeDetectorRef,
    HostListener
} from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TallyModuleService } from 'apps/web-giddh/src/app/accounting/tally-service';
import { cloneDeep, isEqual, find, maxBy, findIndex } from 'apps/web-giddh/src/app/lodash-optimized';
import * as dayjs from 'dayjs';
import { combineLatest, Observable, ReplaySubject, of as observableOf, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { SalesActions } from '../../../actions/sales/sales.action';
import { AccountResponse, AddAccountRequest, UpdateAccountRequest } from '../../../models/api-models/Account';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { API_BULK_FETCH_LIMIT, IOption } from '../../../app.constant';
import { KeyboardService } from '../../keyboard.service';
import { KEYS } from '../journal-voucher.component';
import { AdjustmentTypesEnum } from "../../../shared/helpers/adjustmentTypes";
import { IForceClear } from '../../../models/api-models/Sales';
import { KeyCodesEnum, PAGINATION_LIMIT } from '../../../app.constant';
import { SearchService } from '../../../services/search.service';
import { VOUCHERS } from '../../constants/accounting.constant';
import { GeneralService } from '../../../services/general.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsDiscountService } from '../../../services/settings.discount.service';
import { CompanyActions } from '../../../actions/company.actions';
import { ASIDE_PANE_CONFIG } from 'apps/web-giddh/src/app/app.constant';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

const CustomShortcode = [
    { code: 'F9', route: 'purchase' }
];

@Component({
    selector: 'account-as-voucher',
    templateUrl: './voucher.component.html',
    styleUrls: ['../../accounting.component.scss', './voucher.component.scss']
})

export class AccountAsVoucherComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @Input() public saveEntryOnCtrlA: boolean;
    @Input() public openDatePicker: boolean;
    @Input() public openCreateAccountPopup: boolean;
    @Input() public newSelectedAccount: AccountResponse;
    /** Current date to show the balance till date */
    @Input() public currentDate: string;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    @Input() public isCompany: boolean;
    /** True if consolidated branch */
    @Input() public isConsolidatedBranch: boolean;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public showAccountList: EventEmitter<boolean> = new EventEmitter();
    /** Instance of all items dialog */
    @ViewChild("chequeEntryModal") public dialogBox: TemplateRef<any>;
    @ViewChild('particular', { static: false }) public accountField: ElementRef;
    @ViewChild('dateField', { static: true }) public dateField: ElementRef;
    @ViewChild('chequeNumberInput', { static: true }) public chequeNumberInput: ElementRef;
    @ViewChild('chequeClearanceInputField', { static: true }) public chequeClearanceInputField: ElementRef;
    @ViewChild('chqFormSubmitBtn', { static: true }) public chqFormSubmitBtn: ElementRef;
    @ViewChild('submitButton', { static: false }) public submitButton: ElementRef;
    @ViewChild('resetButton', { static: true }) public resetButton: ElementRef;
    /* Instance of narration box */
    @ViewChild('narrationBox') public narrationBox: any;
    /* Selector for receipt entry modal */
    @ViewChild('receiptEntry', { static: true }) public receiptEntry: TemplateRef<any>;
    /** List of all 'DEBIT' amount fields when 'By' entries are made  */
    @ViewChildren('byAmountField') public byAmountFields: QueryList<ElementRef>;

    /** List of all 'CREDIT' amount fields when 'To' entries are made  */
    @ViewChildren('toAmountField') public toAmountFields: QueryList<ElementRef>;
    /** Template reference for aside menu account modal */
    @ViewChild('genericAsideMenuAccountTemplate', { static: true }) public genericAsideMenuAccountTemplate: TemplateRef<any>;
    /** Dialog reference for aside menu account modal */
    public genericAsideMenuAccountDialogRef: MatDialogRef<any>;
    public showLedgerAccountList: boolean = false;
    public selectedInput: 'by' | 'to' = 'by';

    public totalCreditAmount: number = 0;
    public totalDebitAmount: number = 0;
    /** Flag to track if initial calculation has been done */
    private isInitialCalculationDone: boolean = false;
    /** Previous total debit value to track changes */
    private previousTotalDebit: number = 0;
    /** Previous total credit value to track changes */
    private previousTotalCredit: number = 0;
    public showConfirmationBox: boolean = false;
    public dayjs = dayjs;
    public accountSearch: string;
    public selectedParticular: any;
    public showFromDatePicker: boolean = false;
    public journalDate: any;
    public navigateURL: any = CustomShortcode;
    public showStockList: boolean = false;
    public groupUniqueName: string;
    public selectedStockIdx: any;
    public selectedStk: any;
    public selectAccUnqName: string;
    public activeIndex: number = 0;
    public arrowInput: { key: number };
    public winHeight: number;
    public displayDay: string = '';
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public totalDiffAmount: number = 0;

    public voucherType: string = null;
    public flattenAccounts: IOption[];
    public stockList: IOption[];
    public currentSelectedValue: string = '';
    public filterByText: string = '';
    public keyUpDownEvent: KeyboardEvent;
    public inputForList: IOption[];
    public selectedField: 'account' | 'stock';

    public chequeDetailForm: UntypedFormGroup;
    public isFirstRowDeleted: boolean = false;
    public createStockSuccess$: Observable<boolean>;
    /** Observable to listen for new account creation */
    private createdAccountDetails$: Observable<any>;

    private selectedAccountInputField: any;
    private selectedStockInputField: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private allStocks: any[];
    private isNoAccFound: boolean = false;
    private isComponentLoaded: boolean = false;
    /** Current company unique name */
    private currentCompanyUniqueName: string;
    /** Current voucher selected */
    private currentVoucher: string = VOUCHERS.CONTRA;

    public allAccounts: any;
    public previousVoucherType: string = "";
    public universalDate$: Observable<any>;
    public universalDate: any = '';

    public activeCompany: any;
    /** Category of accounts to display based on voucher type */
    public categoryOfAccounts: string = 'currentassets';
    /* This will hold the transaction details to use in adjustment popup */
    public currentTransaction: any;
    /* This will hold list of pending invoices */
    public pendingInvoiceList: any[] = [];
    /* Observable for list of pending invoices */
    public pendingInvoiceListSource$: Observable<IOption[]> = observableOf([]);
    /* This will hold list of adjustment types */
    public adjustmentTypes: IOption[] = [];
    /* Total number of adjusment entries */
    public totalEntries: number = 0;
    /* Will check if form is valid */
    public isValidForm: boolean = false;
    /* Error message for amount comparision with transaction amount */
    public amountErrorMessage: string = "";
    /* Error message for comparision of adjusted amount with invoice */
    public invoiceAmountErrorMessage: string = "";
    /* Error message for invalid adjustment amount */
    public invalidAmountErrorMessage: string = "";
    /* Error message for invalid adjustment amount */
    public invoiceErrorMessage: string = "";
    /* Error message for amount comparision with transaction amount */
    public entryAmountErrorMessage: string = "";
    /* This will hold list of tax */
    public taxList: any[] = [];
    /* Observable for list of tax */
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    /* Object for pending invoices list search params */
    public pendingInvoicesListParams: any = {
        accountUniqueNames: [],
        voucherType: VOUCHERS.RECEIPT
    };
    /* List of adjustment entries */
    public receiptEntries: any[] = [];
    /* Object for active transaction for adjustment */
    public adjustmentTransaction: any = {};
    /* Selected transaction type */
    public selectedTransactionType: string = '';
    /* This will hold if receipt option is choosen */
    public receiptExists: boolean = false;
    /* This will hold if advance receipt option is choosen */
    public advanceReceiptExists: boolean = false;
    /* This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** selected base currency symbol */
    public baseCurrencySymbol: string;
    /** Input mast for number format */
    public inputMaskFormat: string = '';
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the current searched account keyboard event */
    public searchedAccountQuery: Subject<any> = new Subject();
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** From Group for jv */
    public journalVoucherForm: FormGroup;
    /** From Group for jv */
    public mergedFormGroup: FormGroup
    /** False if you want particular group*/
    public allGroups: boolean = true;
    /** Skip single event of enter in narration box*/
    public isFirstEnterKeyPress: boolean = true;
    /** Active index for current fields*/
    public activeRowIndex: number = null;
    /** Active row for current fields*/
    public activeRowType: string = null;
    /** Active row for current fields*/
    public selectedInputFieldIndex: number = null;
    /** True if show discount sidebar*/
    public showDiscountSidebar: boolean = false;
    /** True if show tax sidebar */
    public showTaxSidebar: boolean = false;
    /** List of discounts */
    public discountsList: any[] = [];
    /** Keys **/
    private KEYS: any = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        UP: 38,
        DOWN: 40
    };
    /** Hold selected index  */
    public selectedIndex: number = 0;
    /** Holds active company decimal place 2 or 4 */
    private companyDecimalPlaces: number = 2;
    /**Hold show discount sidebar state*/
    @Input() public showDiscount: boolean;
    /**Emits the discount sidebar event*/
    @Output() public hideDiscountSidebar: EventEmitter<boolean> = new EventEmitter();
    /** Hold company tax list  */
    public companyTaxesList: any[] = [];
    /** Hold show tax sidebar event */
    @Input() public showTax: boolean;
    /**Emits the tax sidebar event*/
    @Output() public hideTaxSidebar: EventEmitter<boolean> = new EventEmitter();
    /** True if it is sales entry*/
    public isSalesEntry: boolean = false;
    /** Emits when show discount and tax event */
    @Output() public showDiscountAndTax: EventEmitter<boolean> = new EventEmitter();
    /** True if api call in progress  */
    public loadMoreInProgress: boolean = false;
    /** Holds voucher api version */
    public voucherApiVersion: number;
    
    /** Global variables for account search with count management */
    /** Initial load count for both 'by' and 'to' accounts */
    private readonly INITIAL_ACCOUNT_LOAD_COUNT: number = API_BULK_FETCH_LIMIT;
    /** Search and load more count for both 'by' and 'to' accounts */
    private readonly SEARCH_LOAD_MORE_COUNT: number = PAGINATION_LIMIT;
    
    /** Global account search data for 'by' accounts */
    public byAccountSearchData = {
        accounts: [],
        isInitialLoaded: false,
        searchQuery: '',
        page: 0,
        totalPages: 0,
        isLoading: false
    };
    
    /** Global account search data for 'to' accounts */
    public toAccountSearchData = {
        accounts: [],
        isInitialLoaded: false,
        searchQuery: '',
        page: 0,
        totalPages: 0,
        isLoading: false
    };
    
    /** Display variable for HTML - separate from search logic */
    public displayAccountList: any[] = [];

    constructor(
        private _ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private _keyboardService: KeyboardService,
        private _toaster: ToasterService,
        private companyActions: CompanyActions,
        private router: Router,
        private tallyModuleService: TallyModuleService,
        private formBuilder: UntypedFormBuilder,
        private settingsDiscountService: SettingsDiscountService,
        private salesAction: SalesActions,
        private searchService: SearchService,
        private changeDetectionRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private eleRef: ElementRef,
        private scrollDispatcher: ScrollDispatcher) {
        this.initJournalVoucherForm();
        this.universalDate$ = this.store.pipe(select(sessionStore => sessionStore.session.applicationDate), takeUntil(this.destroyed$));

        this.createdAccountDetails$ = combineLatest([
            this.store.pipe(select(appState => appState.sales.createAccountSuccess)),
            this.store.pipe(select(appState => appState.sales.createdAccountDetails))
        ]).pipe(debounceTime(0), takeUntil(this.destroyed$));

        this.store.pipe(select(profileStore => profileStore.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
        });

        this._keyboardService.keyInformation.pipe(takeUntil(this.destroyed$)).subscribe((key) => {
            this.watchKeyboardEvent(key);
        });
        this.tallyModuleService.selectedPageInfo.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        }), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data) {
                this.currentVoucher = data.page.toLowerCase();           
                switch (this.currentVoucher) {
                    case VOUCHERS.CONTRA:
                        // Contra allows cash or bank so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    case VOUCHERS.RECEIPT:
                        // Receipt allows cash/bank/sundry debtors/sundry creditors so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    case VOUCHERS.PAYMENT:
                        // Receipt allows cash/bank/sundry debtors/sundry creditors so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    case VOUCHERS.JOURNAL:
                        // Receipt allows cash/bank/sundry debtors/sundry creditors so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    case VOUCHERS.SALES:
                        // Receipt allows cash/bank/sundry debtors/sundry creditors so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    default:
                        // TODO: Add other category cases as they are developed
                        break;
                }
                if (data.gridType === 'voucher') {
                    const voucherTypeControl = this.journalVoucherForm.get('voucherType');
                    this.activeRowIndex = 0;
                    this.activeRowType = "account";
                    this.showLedgerAccountList = false;
                    this.closeDiscountSidebar();
                    this.closeTaxSidebar();
                    voucherTypeControl.setValue(this.currentVoucher);
                    this.resetEntriesIfVoucherChanged();
                    setTimeout(() => {
                        this.dateField?.nativeElement?.focus();
                    }, 50);
                } else {
                    this.resetEntriesIfVoucherChanged();
                    this.tallyModuleService.requestData.next(this.journalVoucherForm.value);
                }

            }
        });
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
    }

    /**
     * This will be use for component initialization
     *
     * @memberof AccountAsVoucherComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        voucherTypeControl.setValue(this.currentVoucher);

        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.journalVoucherForm.get('entryDate').patchValue(dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT));
                this.dateEntered();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.companyDecimalPlaces = activeCompany?.balanceDecimalPlaces;
                this.currentCompanyUniqueName = activeCompany?.uniqueName;
            }
        });

        this.chequeDetailForm = this.formBuilder.group({
            chequeClearanceDate: [''],
            chequeNumber: ['', [Validators.required]]
        });


        this.tallyModuleService.requestData.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        }), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data) {
                // this.requestObj = cloneDeep(data);
            }
        });

        this.store.pipe(select(state => state?.ledger?.ledgerCreateInProcess), takeUntil(this.destroyed$)).subscribe((response: boolean) => {
            this.isLoading = (response) ? true : false;
        });

        this.store.pipe(select(p => p?.ledger?.ledgerCreateSuccess), takeUntil(this.destroyed$)).subscribe((response: boolean) => {
            if (response) {
                this.activeRow(0);
                this.activeRowIndex = 0;
                this.activeRowType = "account";
                this._toaster.successToast(this.localeData?.entry_created, this.commonLocaleData?.app_success);
                this.refreshEntry();
                this.store.dispatch(this._ledgerActions.ResetLedger());
                this.journalVoucherForm.patchValue({
                    description: ''
                });
                this.dateField?.nativeElement?.focus();
                this.isInitialCalculationDone = false;
                this.previousTotalDebit = 0;
                this.previousTotalCredit = 0;
                this.showDiscountAndTax.emit(false);
            }
        });
        this.getDiscounts();
        this.store.dispatch(this.companyActions.getTax());
        this.getTaxes();

        this.createStockSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(yesOrNo => {
            if (yesOrNo) {
                this.genericAsideMenuAccountDialogRef?.close();
                setTimeout(() => {
                    this.dateField?.nativeElement?.focus();
                }, 1000);
            }
        });

        // create account success then hide aside pane
        this.createdAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(accountDetails => {
            if (accountDetails) {
                const isAccountSuccessfullyCreated = accountDetails[0];
                const createdAccountDetails = accountDetails[1];
                if (isAccountSuccessfullyCreated) {
                    this.closeAccountAsidePane();
                }
                if (createdAccountDetails) {
                    // Add the new account to the appropriate dropdown list
                    this.addNewAccountToDropdown(createdAccountDetails);
                    this.setAccount(createdAccountDetails);
                }
            }
        });

        this.searchedAccountQuery.pipe(debounceTime(100), takeUntil(this.destroyed$)).subscribe((event: any) => {
                   
            const inputValue = event.event.target.value;
            const transaction = event.transaction;
            
            // Check if transaction already has discount or tax applied
            const isDiscountApplied = transaction.get('isDiscountApplied')?.value;
            const isTaxApplied = transaction.get('isTaxApplied')?.value;
            const accountType = transaction.get('type')?.value;
            this.selectedIndex = 0;

            if (isDiscountApplied || this.showDiscountSidebar) {
                // Search in discount list
                this.searchInDiscountList(inputValue);
            } else if (isTaxApplied || this.showTaxSidebar) {
                // Search in tax list
                this.searchInTaxList(inputValue);
            } else {
                // Default: search in account list based on account type
                this.searchAccount(inputValue, accountType);
            }
        });

        this.amountErrorMessage = this.localeData?.total_amount_error;
        this.invoiceAmountErrorMessage = this.localeData?.invoice_amount_error;
        this.invalidAmountErrorMessage = this.localeData?.invalid_amount_error;
        this.invoiceErrorMessage = this.localeData?.invoice_error;
        this.entryAmountErrorMessage = this.localeData?.entry_amount_error;
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.keyUpDownEvent = event;
        if (event.key === 'F6') {
            event.preventDefault(); // Prevent default F6 behavior
            this.customFunctionForF6();
        } else if (event.key === 'F7') {
            event.preventDefault(); // Prevent default F7 behavior
            this.customFunctionForF7();
        } else if (event.altKey && (event.key === 'd' || event.code === 'KeyD')) {
            event.preventDefault();
            this.customFunctionForDiscountSidebar();
        } else if (event.altKey && (event.key === 't' || event.code === 'KeyT')) {
            event.preventDefault();
            this.customFunctionForTaxSidebar();
        }
        else if (event.key === 'Escape') {
            this.closeDiscountSidebar();
            this.closeTaxSidebar();
            this.showLedgerAccountList = false;
        }
        else if (this.showDiscountSidebar || this.showTaxSidebar || this.showLedgerAccountList) {
            // Handle all keyboard navigation for open sidebars
            this.keydownUp(event);
        }
    }

    /**
     *This will be use for call custom keys functionality for windows
     *
     * @memberof AccountAsVoucherComponent
     */
    public customFunctionForF6(): void {
        // Define your custom functionality for F6 key here
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        voucherTypeControl.setValue(VOUCHERS.RECEIPT);
    }

    /**
    *This will be use for call custom keys functionality for windows
    *
    * @memberof AccountAsVoucherComponent
    */
    public customFunctionForF7(): void {
        // Define your custom functionality for F7 key here
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        voucherTypeControl.setValue(VOUCHERS.JOURNAL);
    }

    /**
    *This will be use for call custom keys functionality for discount sidebar
    *
    * @memberof AccountAsVoucherComponent
    */
    public customFunctionForDiscountSidebar(): void {
        if (this.isSalesEntry) {
            this.searchInDiscountList("");
            this.selectedIndex = 0;
            this.showLedgerAccountList = false;
            this.closeTaxSidebar();
        }
    }

    /**
    *This will be use for call custom keys functionality for tax sidebar
    *
    * @memberof AccountAsVoucherComponent
    */
    public customFunctionForTaxSidebar(): void {
        if (this.isSalesEntry) {
            this.searchInTaxList("");
            this.selectedIndex = 0;
            this.showLedgerAccountList = false;
            this.closeDiscountSidebar();
        }
    }

    /**
     * This will be use for form group initialization
     *
     * @private
     * @memberof AccountAsVoucherComponent
     */
    private initJournalVoucherForm(): void {
        this.journalVoucherForm = this.formBuilder.group({
            transactions: this.formBuilder.array([
                this.initTransactionFormGroup()
            ]),
            voucherType: [null],
            entryDate: [null],
            description: [null]
        });
    }

    /**
     *This will be use for form array initialization of transaction
     *
     * @return {*}  {FormGroup}
     * @memberof AccountAsVoucherComponent
     */
    public initTransactionFormGroup(): FormGroup {
        return this.formBuilder.group({
            amount: [null],
            actualAmount: [null],
            particular: [null],
            currentBalance: [null],
            applyApplicableTaxes: [false],
            isInclusiveTax: [false],
            type: [null],
            taxes: [[]],
            total: [null],
            discounts: [[]],
            inventory: [null],
            isDiscountApplied: [false],
            isTaxApplied: [false],
            selectedAccount: this.formBuilder.group({
                name: [null],
                UniqueName: [null],
                groupUniqueName: [null],
                account: [null],
                type: [null],
                parentGroup: [[]],
            }),
            taxValue: [null],
            discountType: [null],
            discountValue: [null]
        });
    }

    /**
     * This hook will be use for component on changes
     *
     * @param {SimpleChanges} c
     * @memberof AccountAsVoucherComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if ('openDatePicker' in changes && changes.openDatePicker.currentValue !== changes.openDatePicker.previousValue) {
            this.showFromDatePicker = changes.openDatePicker.currentValue;
        }
        if ('openCreateAccountPopup' in changes && changes.openCreateAccountPopup.currentValue !== changes.openCreateAccountPopup.previousValue) {
            if (changes.openCreateAccountPopup.currentValue) {
                this.addNewAccount();
            }
        }
        if ('showDiscount' in changes && changes?.showDiscount?.currentValue !== changes?.showDiscount?.previousValue) {
            if (changes?.showDiscount?.currentValue) {
                this.searchInDiscountList("");
            }
        }
        if ('showTax' in changes && changes?.showTax?.currentValue !== changes?.showTax?.previousValue) {
            if (changes?.showTax?.currentValue) {
                this.searchInTaxList("");
            }
        }
    }

    /**
     * This will be use for close discount sidebar
     *
     * @memberof AccountAsVoucherComponent
     */
    public closeDiscountSidebar(): void {
        this.showDiscountSidebar = false;
        this.hideDiscountSidebar.emit(true);
    }

    /**
     * This will be use for close tax sidebar
     *
     * @memberof AccountAsVoucherComponent
     */
    public closeTaxSidebar(): void {
        this.showTaxSidebar = false;
        this.hideTaxSidebar.emit(true);
    }

    /**
     * Creates and initializes a new transaction object within a journal voucher form
     *
     * @param {string} [byOrTo='to']
     * @memberof AccountAsVoucherComponent
     */
    public newEntryObj(byOrTo?: string, typeData?: any, type?: any): void {
        let formArray = this.journalVoucherForm.get('transactions') as FormArray;
        const newTransactionFormGroup = this.initTransactionFormGroup();
        let discountObj = null;
        let taxData = null;
        if (type === 'discount') {
            discountObj = typeData;
        } else if (type === 'tax') {
            taxData = typeData;
        }

        if (discountObj) {
            newTransactionFormGroup.patchValue({
                amount: 0,
                particular: discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discountObj?.value,
                currentBalance: '',
                applyApplicableTaxes: false,
                isDiscountApplied: true,
                isTaxApplied: false,
                isInclusiveTax: false,
                type: 'by',
                taxes: [],
                total: 0,
                discounts: [],
                inventory: null,
                selectedAccount: {
                    name: discountObj?.additional?.name ? (discountObj?.additional?.name + ' (' + discountObj?.additional?.discountType + ')') : discountObj?.name,
                    UniqueName: discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discountObj?.value,
                    groupUniqueName: '',
                    account: discountObj?.additional?.name ? (discountObj?.additional?.name + ' (' + discountObj?.additional?.discountType + ')') : discountObj?.name,
                    type: discountObj?.additional?.discountType,
                    parentGroup: ''
                },
                discountType: discountObj?.additional?.discountType,
                discountValue: discountObj?.additional?.discountValue ?? 0
            });
            this.selectAccUnqName = discountObj?.additional?.uniqueName;
        } else if (taxData) {
            let filteredTaxData = this.companyTaxesList?.filter((item) => {
                return item.additional.name === (taxData.name ? taxData.name : taxData.label) && item.additional.uniqueName === (taxData.uniqueName ? taxData.uniqueName : taxData?.value);
            });
            newTransactionFormGroup.patchValue({
                amount: filteredTaxData[0]?.additional?.taxDetail[0]?.taxValue,
                particular: filteredTaxData[0]?.additional?.uniqueName,
                currentBalance: '',
                applyApplicableTaxes: false,
                isDiscountApplied: false,
                isTaxApplied: true,
                isInclusiveTax: false,
                type: 'to',
                taxes: [],
                total: 0,
                discounts: [],
                inventory: null,
                selectedAccount: {
                    name: filteredTaxData[0]?.additional?.name,
                    UniqueName: filteredTaxData[0]?.additional?.uniqueName,
                    groupUniqueName: '',
                    account: filteredTaxData[0]?.additional?.name,
                    type: '',
                    parentGroup: ''
                },
                taxValue: filteredTaxData[0]?.additional?.taxDetail[0]?.taxValue
            });

            this.selectAccUnqName = filteredTaxData[0]?.additional?.name;
        } else {
            newTransactionFormGroup.patchValue({
                amount: 0,
                actualAmount: 0,
                particular: '',
                currentBalance: '',
                applyApplicableTaxes: false,
                isInclusiveTax: false,
                type: byOrTo,
                taxes: [],
                total: 0,
                discounts: [],
                inventory: null,
                selectedAccount: {
                    name: '',
                    UniqueName: '',
                    groupUniqueName: '',
                    account: '',
                    type: '',
                    parentGroups: []
                }
            });
        }
        // Push the new transaction FormGroup into the form array
        formArray.push(newTransactionFormGroup);
        const index = formArray.controls.findIndex(formGroup => formGroup === newTransactionFormGroup);
        this.calculateAmount(Number(newTransactionFormGroup.get('amount').value), newTransactionFormGroup, index);
    }

    /**
     * This will be use for update transaction actual amount
     *
     * @param {FormGroup} transaction
     * @memberof AccountAsVoucherComponent
     */
    public updateTotalCreditDebit(): void {
        const totalCreditAndDebit = this.calculateTotalCreditAndDebit();
        this.totalCreditAmount = totalCreditAndDebit.totalCredit;
        this.totalDebitAmount = totalCreditAndDebit.totalDebit;
    }

    /**
     * Update amount in number and remove 0 from starting
     *
     * @param {FormGroup} transaction
     * @memberof AccountAsVoucherComponent
     */
    public updateTransactionActualAmount(transaction: FormGroup): void {
        if (transaction) {
            const value = transaction.get('amount')?.value?.toString();
            const removeSpaceValue = value?.replace(' ', '');
            transaction.get('amount')?.patchValue(removeSpaceValue);
            if (+transaction.get('amount')?.value > 9 && transaction.get('amount')?.value?.startsWith('0')) {
                transaction.get('amount')?.patchValue(+transaction.get('amount')?.value?.replace(/^0+/, ''));
            }
            const amount = this.generalService.roundOffValueByCompanyDecimalPlace(transaction.get('amount')?.value, this.companyDecimalPlaces);
            transaction.get('amount')?.patchValue(amount);
            transaction.get('actualAmount')?.patchValue(amount);
            transaction.get('total')?.patchValue(amount);
            this.updateTotalCreditDebit();
        }
    }

    /**
     * This will be use for remove amount if account removed
     *
     * @param {FormGroup} transaction
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    public removeAmountIfAccountRemoved(transaction: FormGroup, index: number): void {
        if (!transaction.get('account')?.value && (transaction?.get('isDiscountApplied')?.value || transaction?.get('isTaxApplied')?.value)) {
            const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
            transactionsFormArray.removeAt(index);

            const firstTransaction = transactionsFormArray.at(0) as FormGroup;
            firstTransaction.get('amount')?.patchValue(firstTransaction.get('actualAmount').value);
            this.calculateAmount(firstTransaction.get('amount').value, firstTransaction, 0);
        }
    }

    /**
     * Calculate and update Tax, Discount and Amount value
     *
     * @param {boolean} [isSalesChanged=false]
     * @memberof AccountAsVoucherComponent
     */
    public calculateTaxDiscountAmount(isSalesChanged: boolean = false): void {
        let { byAmount, toEntryControl, byEntryControl, taxEntryControl, discountEntryControl } = this.getUniqueAccountDetail();

        if (discountEntryControl || taxEntryControl) {
            const cash: number = byAmount ?? 0;
            const taxRate: number = taxEntryControl?.value?.taxValue ?? 0;
            const discountRate: number = discountEntryControl?.value?.discountType === "PERCENTAGE" ? discountEntryControl?.value?.discountValue ?? 0 : null;
            const discountFixedValue: number = discountEntryControl?.value?.discountType === "FIX_AMOUNT" ? discountEntryControl?.value?.discountValue ?? 0 : null;
            const discountRateValue: number = discountFixedValue !== null ? 0 : discountRate;

            let newCash = cash;
            let newSales = (cash / (1 - (discountRateValue / 100)) / (1 + (taxRate / 100))) + (isSalesChanged ? discountFixedValue : 0);
            let newDiscount = discountFixedValue !== null ? discountFixedValue : newSales * (discountRate / 100);
            let salesAfterDiscount = newSales - newDiscount;
            let newTax = salesAfterDiscount * (taxRate / 100);


            if (byEntryControl) {
                byEntryControl?.get('amount')?.patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(discountFixedValue !== null && !isSalesChanged ? newCash - newDiscount : newCash));
            }
            if (toEntryControl) {
                toEntryControl?.get('amount')?.patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(newSales));
            }
            if (discountEntryControl) {
                discountEntryControl?.get('amount')?.patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(newDiscount));
            }
            if (taxEntryControl) {
                taxEntryControl?.get('amount')?.patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(newTax));
            }
            const totalCreditAndDebit = this.calculateTotalCreditAndDebit();
            this.totalCreditAmount = totalCreditAndDebit.totalCredit;
            this.totalDebitAmount = totalCreditAndDebit.totalDebit;
        }
    }


    /**
     * Get Each transaction control
     *
     * @private
     * @returns {{ toAmount: number, byAmount: number, actualTaxAmount: number, taxAmount: number, toEntryControl: FormGroup, byEntryControl: FormGroup, taxEntryControl: FormGroup }}
     * @memberof AccountAsVoucherComponent
     */
    private getUniqueAccountDetail(): { toAmount: number, byAmount: number, actualTaxAmount: number, taxAmount: number, toEntryControl: FormGroup, byEntryControl: FormGroup, taxEntryControl: FormGroup, discountEntryControl: FormGroup } {
        let toAmount = 0;
        let byAmount = 0;
        let actualTaxAmount;
        let taxAmount;
        let toEntryControl;
        let byEntryControl;
        let taxEntryControl;
        let discountEntryControl;

        (this.journalVoucherForm.get('transactions') as FormArray).controls?.forEach((control: FormGroup) => {
            // Get Sales Row Data
            if (control.value.particular && control.value.type === "to" && !control.value.isTaxApplied && !control.value.isDiscountApplied) {
                toEntryControl = control;
                toAmount += control.value.actualAmount;
            }

            // Get Cash Row Data
            if (control.value.particular && control.value.type === "by" && !control.value.isTaxApplied && !control.value.isDiscountApplied) {
                byEntryControl = control;
                byAmount += control.value.actualAmount;
            }

            // Get Discount Row Data
            if (control.value.particular && control.value.type === "by" && control.value.isDiscountApplied) {
                discountEntryControl = control;
                byAmount += control.value.actualAmount;
            }

            // Get Tax Row Data
            if (!taxAmount && control.value.particular && control.value.type === "to" && control.value.isTaxApplied) {
                taxEntryControl = control;
                taxAmount = control.value.taxValue;
                actualTaxAmount = control.value.taxValue;
            }
        });

        return { toAmount, byAmount, actualTaxAmount, taxAmount, toEntryControl, byEntryControl, taxEntryControl, discountEntryControl };
    }

    /**
     * This function returns an inventory object with fields for unit details, quantity, stock details, and amount.
     *
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public initInventory() {
        return {
            unit: {
                stockUnitCode: '',
                code: '',
                rate: null,
            },
            quantity: null,
            stock: {
                uniqueName: '',
                name: '',
            },
            amount: null
        };
    }

    /**
     * Resets account details when account type changes
     *
     * @param {FormGroup} transaction - The transaction form group
     * @param {number} index - The index of the transaction
     * @param {string} newType - The new account type ('by' or 'to')
     * @memberof AccountAsVoucherComponent
     */
    public resetAccountOnTypeChange(transaction: FormGroup): void {
        if (!transaction || !transaction.get('selectedAccount.name')) {
            return;
        }

        // Reset account-related fields
        const selectedAccountGroup = transaction.get('selectedAccount');
        if (selectedAccountGroup) {
            selectedAccountGroup.patchValue({
                name: null,
                UniqueName: null,
                groupUniqueName: null,
                account: null,
                type: null,
                parentGroup: []
            });
        }

        // Reset other account-dependent fields
        transaction.patchValue({
            particular: null,
            currentBalance: null,
            amount: null,
            actualAmount: null,
            total: null,
            taxes: [],
            discounts: [],
            inventory: null,
            isDiscountApplied: false,
            isTaxApplied: false,
            taxValue: null,
            discountType: null,
            discountValue: null,
            selectedAccountIndex: 0
        });
        
        // Recalculate totals
        this.updateTotalCreditDebit();
        
        // Trigger change detection
        this.changeDetectionRef.detectChanges();
        
    }

    /**
     * Updates the selected row state and index based on user interaction.
     *
     * @param {boolean} type
     * @param {*} idx
     * @memberof AccountAsVoucherComponent
     */
    public selectRow(type: string, index: number): void {
        this.activeRowIndex = index;
        this.activeRowType = type;

        this.showLedgerAccountList = false;
        this.closeDiscountSidebar();
        this.closeTaxSidebar();
        this.changeDetectionRef.detectChanges();
    }

    /**
     * This will be use for active row
     *
     * @param {boolean} type
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    public activeRow(index: number): void {
        this.activeRowIndex = index; 
    }

    /**
     * Updates the entry type of a transaction object based on user input.
     *
     * @param {*} transactionObj
     * @param {*} val
     * @param {*} idx
     * @memberof AccountAsVoucherComponent
     */
    public selectEntryType(transactionObj: any, value: any, index: number) {
        value = value?.trim();
        if (value?.length === 2 && (value?.toLowerCase() !== 'to' && value?.toLowerCase() !== 'by')) {
            this._toaster.errorToast(this.localeData?.entry_type_error);
            transactionObj.type = 'to';
        } else {
            transactionObj.type = value;
        }
    }


    /**
     * Search in discount list based on input value
     *
     * @param {string} searchValue - The search term
     * @memberof AccountAsVoucherComponent
     */
    private searchInDiscountList(searchValue: string): void {
        this.showDiscountSidebar = true;
        this.closeTaxSidebar();
        this.showLedgerAccountList = false;
        if (!searchValue) {
            this.displayAccountList = this.discountsList
            return;
        }
        
        const filteredDiscounts = this.discountsList.filter(discount => 
            discount.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
            discount.value?.toLowerCase().includes(searchValue.toLowerCase())
        );
        
        // Update the discount list display
        this.displayAccountList = filteredDiscounts;
    }
    
    /**
     * Search in tax list based on input value
     *
     * @param {string} searchValue - The search term
     * @memberof AccountAsVoucherComponent
     */
    private searchInTaxList(searchValue: string): void {
        this.showTaxSidebar = true;
        this.closeDiscountSidebar();
        this.showLedgerAccountList = false;
        if (!searchValue) {
            this.displayAccountList = this.companyTaxesList;
            return;
        }
        
        const filteredTaxes = this.companyTaxesList.filter(tax => 
            tax.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
            tax.value?.toLowerCase().includes(searchValue.toLowerCase())
        );
        
        // Update the tax list display
        this.displayAccountList = filteredTaxes;
    }

    /**
     * Optimized function to handle account/discount/tax focus based on transaction flags
     *
     * @param {number} index - The index of the transaction row
     * @memberof AccountAsVoucherComponent
     */
    public handleTransactionFocus(index: number): void {
        
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        const transaction = transactionsFormArray.at(index) as FormGroup;
        
        if (!transaction) {
            return;
        }
        
        // Get stored selected account index from form for this row
        const storedIndex = transaction.get('selectedAccountIndex')?.value;
        
        // Set selectedIndex from form if available, otherwise default to 0
        this.selectedIndex = storedIndex ? storedIndex : 0;
        this.activeRowType = "account";
        
        // Check flags to determine what to open
        if (transaction.get('isDiscountApplied')?.value || this.showDiscountSidebar) {
            // Get stored selected discount index from form
            const storedDiscountIndex = transaction.get('selectedDiscountIndex')?.value;
            this.selectedIndex = storedDiscountIndex ? storedDiscountIndex : 0;
            this.searchInDiscountList("");
        } else if (transaction.get('isTaxApplied')?.value || this.showTaxSidebar) {
            // Get stored selected tax index from form
            const storedTaxIndex = transaction.get('selectedTaxIndex')?.value;
            this.selectedIndex = storedTaxIndex ? storedTaxIndex : 0;
            this.searchInTaxList("");
        } else {
            // Default to account selection
            this.onAccountFocus(transaction);
        }
        
        this.changeDetectionRef.detectChanges();
    }
    

    /**
     * Handles the focus event on an account input field.
     *
     * @param {*} event
     * @param {*} element
     * @param {*} trxnType
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    public onAccountFocus(transaction: FormGroup): void {
        this.selectedField = 'account';
        this.showConfirmationBox = false;
        this.selectedTransactionType = transaction.get('type')?.value;    
        this.closeDiscountSidebar();
        this.closeTaxSidebar();
        this.showLedgerAccountList = true;
            
        // Determine account type based on actual form field value
        const accountType = this.selectedTransactionType?.toLowerCase() === 'by' ? 'by' : 'to';
        this.selectedInput = accountType;

        // Get appropriate search data based on account type
        const searchData = accountType === 'by' ? this.byAccountSearchData : this.toAccountSearchData;
        
        // Show account list with data from global variables
        this.displayAccountList = searchData.accounts;
    }

    /**
     * Handles the blur event on an account input field.
     *
     * @param {*} ev
     * @memberof AccountAsVoucherComponent
     */
    public onAccountBlur(event: any): void {
        this.arrowInput = { key: 0 };
        // this.showStockList.next(true);
        if (this.accountSearch) {
            this.accountSearch = '';
        }

        if (event.type === 'blur') {
            this.showLedgerAccountList = false;
            this.closeDiscountSidebar();
            this.closeTaxSidebar();
            this.showStockList = false;
        }
        this.showAccountList.emit(false);
    }

    /**
     * Handles the focus event on a date field.
     *
     * @memberof AccountAsVoucherComponent
     */
    public onDateFieldFocus(): void {
        setTimeout(() => {
            this.showLedgerAccountList = false;
            this.closeDiscountSidebar();
            this.closeTaxSidebar();
            this.showStockList = false;
            this.activeRowIndex = null;
            this.activeRowType = null;
        }, 100);
    }

    /**
     * Submits the cheque details form.
     *
     * @memberof AccountAsVoucherComponent
     */
    public onSubmitChequeDetail(): void {
        const chequeDetails = this.chequeDetailForm?.value;

        this.chequeDetailForm.patchValue({
            chequeNumber: chequeDetails.chequeNumber,
            chequeClearanceDate: chequeDetails.chequeClearanceDate ?
                (typeof chequeDetails.chequeClearanceDate === "object" ?
                    dayjs(chequeDetails.chequeClearanceDate).format(GIDDH_DATE_FORMAT) :
                    dayjs(chequeDetails.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)) :
                ""
        });

        this.closeChequeDetailForm();
    }

    /**
     * Close the cheque details dialog
     *
     * @memberof AccountAsVoucherComponent
     */
    public closeChequeDetailForm(): void {
        this.dialog.closeAll();
        this.changeTab('enter', 'account');
    }

    /**
     * Open Cheque Detail Form Dialog
     *
     * @memberof AccountAsVoucherComponent
     */
    public openChequeDetailForm(): void {
        this.dialog.open(this.dialogBox);
        setTimeout(() => {
            this.chequeNumberInput?.nativeElement?.focus();
        }, 200);
    }

    /**
     * This will be use for set account
     *
     * @param {*} acc
     * @memberof AccountAsVoucherComponent
     */
    public setAccount(acc: any): void {
        this.showLedgerAccountList = false;
        const idx = this.activeRowIndex
        let transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        let transactionAtIndex = transactionsFormArray.at(idx) as FormGroup;
        const currentSelectedAccount = transactionAtIndex.get('selectedAccount')?.value;
        // If same account is selected again, skip setAccount to avoid unnecessary code execution
        if (currentSelectedAccount?.UniqueName === acc.uniqueName) {
            this.changeTab("enter", "account")
            return;
        }
        
        this.searchService.loadDetails(acc?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            let transaction;
            if (response?.body && (response?.body?.currency?.code || this.activeCompany?.baseCurrency) === this.activeCompany?.baseCurrency) {
                if (acc && acc.parentGroups.find((pg) => pg?.uniqueName === 'bankaccounts')) {
                    this.openChequeDetailForm();
                }

                if (acc) {
                    const formattedCurrentDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.tallyModuleService.getCurrentBalance(this.currentCompanyUniqueName, acc?.uniqueName, formattedCurrentDate, formattedCurrentDate).subscribe((data) => {
                        if (data && data.body) {
                            this.setAccountCurrentBalance(data.body, this.activeRowIndex);
                        }
                    }, () => { });

                    let accModel = {
                        name: acc.name,
                        UniqueName: acc?.uniqueName,
                        groupUniqueName: acc.parentGroups[acc.parentGroups?.length - 1]?.uniqueName,
                        account: acc.name,
                    };
                    const byControlValue = transactionsFormArray.value.find(item => item?.type === "by");

                    // Update transaction form group with received data
                    const amount = !this.isSalesEntry ? this.calculateDiffAmount(transactionAtIndex.get('type')?.value?.toLowerCase()) : byControlValue?.amount ?? 0;
                    transactionAtIndex?.patchValue({
                        amount: Number(amount),
                        actualAmount: Number(amount),
                        particular: accModel?.UniqueName,
                        currentBalance: '',
                        selectedAccount: {
                            name: accModel.name,
                            UniqueName: accModel.UniqueName,
                            groupUniqueName: accModel.groupUniqueName,
                            account: accModel.account,
                            type: '',
                            parentGroup: response?.body?.parentGroups
                        },
                        total: Number(amount)
                    });
                    // Check and push to inventory
                    if (acc) {
                        this.groupUniqueName = accModel?.groupUniqueName;
                        this.selectAccUnqName = acc?.uniqueName;
                    }

                    if (!response.body.applicableDiscounts?.length || !response.body.applicableTaxes?.length) {
                        this.changeTab('enter', 'account');
                    }

                    this.calculateAmount(Number(transactionAtIndex?.get('amount').value), transactionAtIndex, idx);

                    if (response.body.applicableDiscounts?.length) {
                        response.body.applicableDiscounts.forEach(discount => {
                            let discountArray = this.discountsList?.filter(response => response?.additional?.uniqueName === discount?.uniqueName);
                            this.newEntryObj('by', discountArray[0], 'discount');
                        });
                    }
                    if (response.body.applicableTaxes?.length) {
                        let index = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
                        transactionAtIndex = transactionsFormArray.at(index) as FormGroup;
                        response.body.applicableTaxes.forEach(tax => {
                            if (index !== -1) {
                                let filteredTaxData = this.companyTaxesList?.filter((item) => {
                                    return item.additional.uniqueName === tax.uniqueName;
                                });
                                transactionAtIndex.patchValue({
                                    amount: filteredTaxData[0]?.additional?.taxDetail[0]?.taxValue,
                                    particular: filteredTaxData[0]?.additional?.uniqueName,
                                    currentBalance: '',
                                    applyApplicableTaxes: false,
                                    isDiscountApplied: false,
                                    isTaxApplied: true,
                                    isInclusiveTax: false,
                                    type: 'to',
                                    taxes: [],
                                    total: null,
                                    discounts: [],
                                    inventory: null,
                                    selectedAccount: {
                                        name: filteredTaxData[0]?.additional?.name,
                                        UniqueName: filteredTaxData[0]?.additional?.uniqueName,
                                        groupUniqueName: '',
                                        account: filteredTaxData[0]?.additional?.name,
                                        type: '',
                                        parentGroup: ''
                                    },
                                    taxValue: filteredTaxData[0]?.additional?.taxDetail[0]?.taxValue
                                });
                                this.selectAccUnqName = filteredTaxData[0]?.additional?.name;
                                this.calculateAmount(Number(transactionAtIndex.get('amount').value), transactionAtIndex, index);
                            } else {
                                this.newEntryObj('to', tax, 'tax');
                            }
                        });
                    }
                } else {
                    this.deleteRow(idx);
                }
            } else {
                this._toaster.infoToast(this.localeData?.foreign_account_error);
                // Reset transaction data in case of error
                transactionAtIndex?.patchValue({
                    amount: null,
                    actualAmount: null,
                    particular: '',
                    currentBalance: '',
                    applyApplicableTaxes: false,
                    isInclusiveTax: false,
                    type: transaction.type,
                    taxes: [],
                    total: null,
                    discounts: [],
                    inventory: null,
                    selectedAccount: {
                        name: '',
                        UniqueName: '',
                        groupUniqueName: '',
                        account: '',
                        type: '',
                        parentGroups: []
                    }
                });
            }
        });
    }


    /**
     *This will be use for sales account
     *
     * @param {FormGroup} control
     * @param {string[]} parentGroups
     * @return {*}  {boolean}
     * @memberof AccountAsVoucherComponent
     */
    public checkIfSalesAccount(control: FormGroup, parentGroups: string[]): boolean {
        const selectedAccount = control?.get('selectedAccount.parentGroup')?.value;
        return Array.isArray(selectedAccount) && selectedAccount.some(group => parentGroups.includes(group));
    }

    /**
     * Reset account search data for both 'by' and 'to' accounts
     *
     * @memberof AccountAsVoucherComponent
     */
    public resetAccountSearchData(): void {
        // Reset 'by' account search data
        this.byAccountSearchData = {
            accounts: [],
            isInitialLoaded: false,
            searchQuery: '',
            page: 0,
            totalPages: 0,
            isLoading: false
        };
        
        // Reset 'to' account search data
        this.toAccountSearchData = {
            accounts: [],
            isInitialLoaded: false,
            searchQuery: '',
            page: 0,
            totalPages: 0,
            isLoading: false
        };
        
        // Reset display variable
        this.displayAccountList = [];
    }

    /**
     * Initialize account search data for both 'by' and 'to' accounts with initial load count (200)
     *
     * @memberof AccountAsVoucherComponent
     */
    public initializeAccountSearchData(): void {
        // Reset existing data first
        this.resetAccountSearchData();
        
        // Load initial accounts for 'by' type
        this.loadAccountsForType('by', '', 1, this.INITIAL_ACCOUNT_LOAD_COUNT, true);
        
        // Load initial accounts for 'to' type  
        this.loadAccountsForType('to', '', 1, this.INITIAL_ACCOUNT_LOAD_COUNT, true);
    }

    /**
     * Load accounts for specific type ('by' or 'to') with specified count
     *
     * @param {string} accountType - 'by' or 'to'
     * @param {string} query - Search query
     * @param {number} page - Page number
     * @param {number} count - Number of records to fetch
     * @param {boolean} isInitialLoad - Whether this is initial load
     * @memberof AccountAsVoucherComponent
     */
    public loadAccountsForType(accountType: 'by' | 'to', query: string = '', page: number = 1, count: number = this.SEARCH_LOAD_MORE_COUNT, isInitialLoad: boolean = false): void {
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        const searchData = accountType === 'by' ? this.byAccountSearchData : this.toAccountSearchData;
        
        if (searchData.isLoading) {
            return;
        }
        
        searchData.isLoading = true;
        searchData.searchQuery = query;
        
        const { group, exceptGroups } = this.tallyModuleService.getGroupByVoucher(voucherTypeControl.value, accountType);
        
        const requestObject: any = {
            q: encodeURIComponent(query),
            page,
            group,
            exceptGroups,
            count
        };
        
        this.searchService.searchAccountV2(requestObject).subscribe(data => {
            if (data && data.body && data.body.results) {
                const searchResults = data.body.results.map((result, i) => {
                    return {
                        value: result?.uniqueName,
                        label: `${result.name} (${result?.uniqueName})`,
                        additional: result,
                        index: i
                    }
                }) || [];
                
                if (page === 1) {
                    searchData.accounts = searchResults;
                } else {
                    searchData.accounts = [
                        ...searchData.accounts,
                        ...searchResults
                    ];
                }
                
                searchData.page = data.body.page;
                searchData.totalPages = data.body.totalPages;
                
                // Update display variables whenever data is loaded
                if (isInitialLoad) {
                    searchData.isInitialLoaded = true;
                    // Auto-show dropdown for 'by' type when initial data is loaded
                    if (accountType === 'by') {
                        this.handleTransactionFocus(0);
                    }
                }
                
            }
            searchData.isLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Handle scroll events in account list for load more functionality
     *
     * @param {number} scrolledIndex Current scrolled index
     * @memberof AccountAsVoucherComponent
     */
    public onAccountListScroll(scrolledIndex: number): void {
        const totalItems = this.displayAccountList?.length || 0;
        const remainingItems = totalItems - scrolledIndex;
        
        // Trigger load more when near the end (within 20 items)
        if (remainingItems < 20 && !this.loadMoreInProgress) {
            this.loadMoreInProgress = true;
            this.handleScrollEnd();
            this.changeDetectionRef.detectChanges();
        }
    }

    /**
     * Local search function to filter accounts from existing data
     *
     * @param {any[]} accounts - Array of accounts to search in
     * @param {string} query - Search query
     * @returns {any[]} Filtered accounts
     * @memberof AccountAsVoucherComponent
     */
    private searchLocalAccounts(accounts: any[], query: string): any[] {
        if (!query || !accounts?.length) {
            return accounts || [];
        }
        
        const searchTerm = query.toLowerCase();
        return accounts.filter(account => 
            account.label?.toLowerCase().includes(searchTerm) ||
            account.value?.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Smart search with API call only when needed, otherwise local search
     *
     * @param {KeyboardEvent} event
     * @param {string} accountName
     * @memberof AccountAsVoucherComponent
     */
    public searchAccount(accountName: string, currentAccountType: 'by' | 'to'): void {
        if (accountName) {
            this.filterByText = accountName;
            this.showLedgerAccountList = true;
            this.selectedIndex = 0;
            
            // Determine account type based on current selection
            // const currentAccountType = this.selectedInput || 'by';
            const searchData = currentAccountType === 'by' ? this.byAccountSearchData : this.toAccountSearchData;
            
            // Smart search logic: API call only when total items > current result length
            if (searchData.isInitialLoaded && searchData.page >= searchData.totalPages) {
                // Local search - sufficient data exists
                const filteredAccounts = this.searchLocalAccounts(searchData.accounts, accountName);
                this.displayAccountList = filteredAccounts;
            } else {
                // API call needed - not enough data loaded
                this.loadAccountsForType(currentAccountType, accountName, 1, this.SEARCH_LOAD_MORE_COUNT, false);
                
                // Update display variables
                this.displayAccountList = searchData.accounts;
            }
        }
    }

    /**
     * Adds new entry
     *
     * @param {*} amount Amount of immediate previous entry
     * @param {*} transactionObj Transaction object of immediate previous entry
     * @param {number} entryIndex Entry index
     * @memberof AccountAsVoucherComponent
     */
    public addNewEntry(amount: any, transactionObj: any, entryIndex: number): void {
        let index = entryIndex;
        setTimeout(() => {
            this.calculateAmount(amount, transactionObj, index, true);
        }, 50);
    }

    /**
     * This will calculate the total amount
     *
     * @param {*} amount
     * @param {*} transactionObj
     * @param {number} indx
     * @memberof AccountAsVoucherComponent
     */
    public calculateAmount(amount: any, transactionObj: any, currentIndex: number, manualChangeValue: boolean = false): any {
        let transactionsFormArray = (this.journalVoucherForm.get('transactions') as FormArray);
        let lastIndx = transactionsFormArray.length - 1;

        if (!this.isSalesEntry) {
            // Update amount in transaction object
            transactionObj.get('amount').patchValue(Number(amount));
            transactionObj.get('total').patchValue(transactionObj.get('amount').value);
        }

        if (manualChangeValue && (this.isSalesEntry || VOUCHERS.JOURNAL === this.journalVoucherForm.get('voucherType').value)) {
            let { toAmount, byAmount, toEntryControl, byEntryControl, taxEntryControl, discountEntryControl } = this.getUniqueAccountDetail();

            if (toAmount >= 0 && byAmount >= 0) {
                this.updateTotalCreditDebit();

                if (!taxEntryControl && discountEntryControl && (this.totalCreditAmount !== this.totalDebitAmount)) {
                    if ((transactionsFormArray.at(currentIndex) as FormGroup).value.type === 'by') {
                        this.updateAllAmountOfControl(toEntryControl, byAmount);
                    } else {
                        this.updateCashEntryBySales(toAmount, discountEntryControl?.value?.discountValue ?? 0, discountEntryControl?.value?.discountType, taxEntryControl?.value?.taxValue ?? 0, byEntryControl);
                    }
                    setTimeout(() => {
                        this.calculateTaxDiscountAmount(true);
                    }, 50);
                } else if (taxEntryControl && !discountEntryControl && (this.totalCreditAmount !== this.totalDebitAmount)) {
                    if ((transactionsFormArray.at(currentIndex) as FormGroup).value.type === 'by') {
                        this.updateAllAmountOfControl(toEntryControl, byAmount);
                    } else {
                        this.updateCashEntryBySales(toAmount, discountEntryControl?.value?.discountValue ?? 0, discountEntryControl?.value?.discountType, taxEntryControl?.value?.taxValue ?? 0, byEntryControl);
                    }
                    this.calculateTaxDiscountAmount(true);
                } else if (taxEntryControl && discountEntryControl && (this.totalCreditAmount !== this.totalDebitAmount)) {
                    if ((transactionsFormArray.at(currentIndex) as FormGroup).value.type === 'by') {
                        this.updateAllAmountOfControl(toEntryControl, byAmount);
                    } else {
                        this.updateCashEntryBySales(toAmount, discountEntryControl?.value?.discountValue, discountEntryControl?.value?.discountType, taxEntryControl?.value?.taxValue, byEntryControl);
                    }
                    setTimeout(() => {
                        this.calculateTaxDiscountAmount(true);
                    }, 50);
                }
            }
        } else {
            this.calculateTaxDiscountAmount();
        }

        if (!this.isSalesEntry) {
            this.updateTotalCreditDebit();
        }

        if (this.journalVoucherForm.get('description').value?.length === 1) {
            this.journalVoucherForm.get('description').patchValue(null);
        }

        if (currentIndex === lastIndx && transactionObj.get('selectedAccount.name').value) {
            const voucherTypeControl = this.journalVoucherForm.get('voucherType');
            // Setting the value of voucherType FormControl to currentVoucher
            voucherTypeControl.setValue(this.currentVoucher);
            let voucherType = cloneDeep(VOUCHERS);
            this.checkVoucherTypeNewEntries(this.currentVoucher, voucherType, transactionObj);
        }
    }

    /**
     * Update single transaction amount, actualAmount and total key
     *
     * @private
     * @param {FormGroup} controltoUpdate
     * @param {number} amount
     * @memberof AccountAsVoucherComponent
     */
    private updateAllAmountOfControl(controltoUpdate: FormGroup, amount: number): void {
        controltoUpdate?.get('amount').patchValue(amount);
        controltoUpdate?.get('actualAmount').patchValue(amount);
        controltoUpdate?.get('total').patchValue(amount);
    }

    /**
     * In case of sales ( i.e To ) row update manually then
     * calculate and update cash ( i.e. By ) value
     *
     * @private
     * @param {number} salesAmount
     * @param {number} discountRateValue
     * @param {string} discountType
     * @param {number} taxRate
     * @param {FormGroup} byAmountControl
     * @memberof AccountAsVoucherComponent
     */
    private updateCashEntryBySales(salesAmount: number, discountRateValue: number, discountType: string, taxRate: number, byAmountControl: FormGroup): void {
        const discountAmount: number = (discountType === 'PERCENTAGE' ? Math.round(salesAmount * (discountRateValue / 100)) : discountRateValue) ?? 0;
        const salesAfterDiscount = salesAmount - discountAmount;
        const taxAmount = Math.floor(salesAfterDiscount * (taxRate / 100));
        const cash = Math.round(salesAfterDiscount + taxAmount);
        this.updateAllAmountOfControl(byAmountControl, cash);
    }

    /**
     * This will be use for check voucher type new entries
     *
     * @param {*} currentVoucher
     * @param {*} voucherType
     * @memberof AccountAsVoucherComponent
     */
    public checkVoucherTypeNewEntries(currentVoucher: any, voucherType: any, transactionObj?: any): void {
        if (this.totalCreditAmount < this.totalDebitAmount || (this.totalCreditAmount === 0 && this.totalDebitAmount === 0)) {
            if (currentVoucher === voucherType.RECEIPT) {
                this.newEntryObj('by');
            } else {
                this.newEntryObj('to');
            }
        } else if (this.totalDebitAmount < this.totalCreditAmount || (this.totalCreditAmount === 0 && this.totalDebitAmount === 0)) {
            if (currentVoucher === voucherType.PAYMENT || currentVoucher === voucherType.CONTRA || currentVoucher === voucherType.JOURNAL) {
                this.newEntryObj('by');
            } else {
                this.newEntryObj('to');
            }
        }
    }

    /**
     *This will be use for open confirmation by shortcuts
     *
     * @param {HTMLButtonElement} submitButton
     * @memberof AccountAsVoucherComponent
     */
    public openConfirmBoxFromShortcut(submitButton: HTMLButtonElement) {
        this.openConfirmBox(submitButton);
    }

    /**
     * openConfirmBox() to save entry
     *
     * @param {HTMLButtonElement} submitBtnEle
     * @memberof AccountAsVoucherComponent
     */
    public openConfirmBox(submitButton: HTMLButtonElement): void {
        this.showLedgerAccountList = false;
        this.closeDiscountSidebar();
        this.closeTaxSidebar();
        this.showStockList = false;
        const { totalCredit, totalDebit } = this.calculateTotalCreditAndDebit();
        if (totalCredit === totalDebit) {
            this.showConfirmationBox = true;
            const descriptionControl = this.journalVoucherForm.get('description');
            if (descriptionControl?.value?.length > 1) {
                descriptionControl.setValue(descriptionControl.value.replace(/(?:\r\n|\r|\n)/g, ''));
            }

            setTimeout(() => {
                submitButton?.focus();
            }, 300);
        } else {
            this._toaster.errorToast(this.localeData?.credit_debit_equal_error, this.commonLocaleData?.app_error);
            this.activeRowIndex = null;
            this.activeRowType = null;
            setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
    }

    /**
     *This will be use for calculating the number of total credit and total debit  amount
     *
     * @return {*}  {{ totalCredit: number, totalDebit: number }}
     * @memberof AccountAsVoucherComponent
     */
    public calculateTotalCreditAndDebit(): { totalCredit: number, totalDebit: number } {
        let totalCredit: number = 0;
        let totalDebit: number = 0;

        (this.journalVoucherForm.get('transactions') as FormArray).controls?.forEach((control: FormGroup) => {
            if (control.get('type').value.toLowerCase() === 'to' && !control.get('isDiscountApplied')?.value) {
                totalCredit += Number(control.get('amount').value) ?? 0;
            } else {
                totalDebit += Number(control.get('amount').value) ?? 0;
            }
        });

        totalCredit = this.generalService.roundOffValueByCompanyDecimalPlace(totalCredit);
        totalDebit = this.generalService.roundOffValueByCompanyDecimalPlace(totalDebit);
        // Count the number of 'by' and 'to' entries (excluding discount applied entries)
        let byEntryCount = 0;
        let toEntryCount = 0;

        (this.journalVoucherForm.get('transactions') as FormArray).controls?.forEach((control: FormGroup) => {
            if (!control.get('isDiscountApplied')?.value) {
                if (control.get('type').value.toLowerCase() === 'to') {
                    toEntryCount++;
                } else {
                    byEntryCount++;
                }
            }
        });
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');

        // Apply the business logic only if there's exactly one 'by' and one 'to' entry
        if (byEntryCount === 1 && toEntryCount === 1) {
            if (!this.isInitialCalculationDone) {
                // First time calculation - if both have values, don't change anything
                if (totalCredit > 0 && totalDebit > 0) {
                    this.isInitialCalculationDone = true;
                    if (voucherTypeControl.value === VOUCHERS.RECEIPT) {
                        this.previousTotalCredit = totalCredit;
                    } else {
                        this.previousTotalDebit = totalDebit;
                    }
                }
            } else {
                if (voucherTypeControl.value === VOUCHERS.RECEIPT) {
                    // After first time - if totalCredit has changed, set totalDebit to same value as totalCredit
                    if (totalCredit !== this.previousTotalCredit && totalCredit >= 0) {
                        totalDebit = totalCredit;
                        this.previousTotalCredit = totalCredit;

                        // Update the form controls for 'by' (debit) entries to match the new totalDebit
                        this.updateDebitControlsToMatchTotal(totalDebit);
                    }
                } else {
                    // After first time - if totalDebit has changed, set totalCredit to same value as totalDebit
                    if (totalDebit !== this.previousTotalDebit && totalDebit >= 0) {
                        totalCredit = totalDebit;
                        this.previousTotalDebit = totalDebit;

                        // Update the form controls for 'to' (credit) entries to match the new totalCredit
                        this.updateCreditControlsToMatchTotal(totalCredit);
                    }
                }
            }
        }
        return { totalCredit, totalDebit };
    }

    /**
     * Updates the debit (BY) form controls to match the new total debit amount
     * Distributes the total debit amount proportionally among all 'by' entries
     *
     * @private
     * @param {number} newTotalDebit
     * @memberof AccountAsVoucherComponent
     */
    private updateDebitControlsToMatchTotal(newTotalDebit: number): void {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        const debitControls: FormGroup[] = [];

        // Find all debit (BY) controls that are not discount applied
        transactionsFormArray.controls.forEach((control: FormGroup) => {
            if (control.get('type').value.toLowerCase() === 'by' && !control.get('isDiscountApplied')?.value) {
                debitControls.push(control);
            }
        });

        if (debitControls.length > 0) {
            // Distribute the new total debit amount equally among all debit entries
            const amountPerEntry = this.generalService.roundOffValueByCompanyDecimalPlace(newTotalDebit / debitControls.length);

            debitControls.forEach((control, index) => {
                // For the last entry, adjust for any rounding differences
                if (index === debitControls.length - 1) {
                    const remainingAmount = newTotalDebit - (amountPerEntry * (debitControls.length - 1));
                    control.get('amount').patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(remainingAmount));
                    control.get('total').patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(remainingAmount));
                } else {
                    control.get('amount').patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(amountPerEntry));
                    control.get('total').patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(amountPerEntry));
                }
            });
        }
    }

    /**
     * Updates the credit (TO) form controls to match the new total credit amount
     * Distributes the total credit amount proportionally among all 'to' entries
     *
     * @private
     * @param {number} newTotalCredit
     * @memberof AccountAsVoucherComponent
     */
    private updateCreditControlsToMatchTotal(newTotalCredit: number): void {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        const creditControls: FormGroup[] = [];

        // Find all credit (TO) controls that are not discount applied
        transactionsFormArray.controls.forEach((control: FormGroup) => {
            if (control.get('type').value.toLowerCase() === 'to' && !control.get('isDiscountApplied')?.value) {
                creditControls.push(control);
            }
        });

        if (creditControls.length > 0) {
            // Distribute the new total credit amount equally among all credit entries
            const amountPerEntry = this.generalService.roundOffValueByCompanyDecimalPlace(newTotalCredit / creditControls.length);

            creditControls.forEach((control, index) => {
                // For the last entry, adjust for any rounding differences
                if (index === creditControls.length - 1) {
                    const remainingAmount = newTotalCredit - (amountPerEntry * (creditControls.length - 1));
                    control.get('amount').patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(remainingAmount));
                    control.get('total').patchValue(this.generalService.roundOffValueByCompanyDecimalPlace(remainingAmount));
                } else {
                    control.get('amount').patchValue(amountPerEntry);
                    control.get('total').patchValue(amountPerEntry);
                }
            });
        }
    }

    /**
     * This will handle keyboard events
     *
     * @param {KeyboardEvent} event
     * @param {HTMLButtonElement} submitButton
     * @memberof AccountAsVoucherComponent
     */
    public handleEnterAndTabKeyPress(event: KeyboardEvent, submitButton: HTMLButtonElement): void {
        if ((event.key === KeyCodesEnum.ENTER || event.key === KeyCodesEnum.TAB) && !this.showDiscountSidebar && !this.showTaxSidebar) {
            const descriptionControl = this.journalVoucherForm.get('description');
            if (!descriptionControl?.value || descriptionControl.value.trim() === '') {
                event.preventDefault();
                this.openConfirmBox(submitButton);
            } else if (event.shiftKey) {
                // Handle shift + enter if needed
            } else {
                this.openConfirmBox(submitButton);
            }
        }
    }

    /**
     * This will be use for save entry
     *
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public saveEntry(): any {
        let data = cloneDeep({ ...this.journalVoucherForm.value, ...this.chequeDetailForm.value });
        data.entryDate = (typeof this.journalVoucherForm.get('entryDate').value === "object") ? dayjs(this.journalVoucherForm.get('entryDate').value).format(GIDDH_DATE_FORMAT) : dayjs(this.journalVoucherForm.get('entryDate').value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

        data.transactions = this.validateTransaction(data.transactions);

        if (!data.transactions) {
            return;
        }

        const foundContraEntry: boolean = this.validateForContraEntry(data);
        const foundSalesAndBankEntry: boolean = this.validateForSalesAndPurchaseEntry(data);
        if (foundContraEntry && data.voucherType !== VOUCHERS.CONTRA) {
            let message = this.localeData?.contra_entry_notallowed;
            message = message?.replace("[VOUCHER_TYPE]", data.voucherType);
            this._toaster.errorToast(message, this.commonLocaleData?.app_error);
            this.activeRowIndex = null;
            this.activeRowType = null;
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }

        // This suggestion was given by Sandeep
        if (foundSalesAndBankEntry && data.voucherType === VOUCHERS.JOURNAL) {
            this._toaster.errorToast(this.localeData?.sales_purchase_entry_error, this.commonLocaleData?.app_error);
            this.activeRowIndex = null;
            this.activeRowType = null;
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
        if (this.totalCreditAmount === this.totalDebitAmount) {
            if (this.validatePaymentAndReceipt(data)) {
                const voucherTypeControl = this.journalVoucherForm.get('voucherType');
                if (voucherTypeControl.value === VOUCHERS.RECEIPT) {
                    this.validateEntries(true);

                    if (!this.isValidForm) {
                        return false;
                    }
                }
                let salesAmount;
                data.transactions.forEach((element: any) => {
                    if (element) {
                        if (element.type === 'to' && !element.isDiscountApplied && !element.isTaxApplied) {
                            salesAmount = element.amount;
                        }
                        element.type = (element.type === 'by') ? 'credit' : 'debit';
                    }
                });
                let accUniqueName: string = maxBy(data.transactions, (o: any) => o.amount)?.selectedAccount?.UniqueName;
                let indexOfMaxAmountEntry = findIndex(data.transactions, (o: any) => o?.selectedAccount?.UniqueName === accUniqueName);
                if (voucherTypeControl.value === VOUCHERS.RECEIPT) {
                    if (this.receiptEntries && this.receiptEntries.length > 0) {
                        data.transactions.splice(0, 2);
                    } else {
                        data.transactions.splice(0, 1);
                    }
                } else {
                    data.transactions.splice(indexOfMaxAmountEntry, 1);
                }
                let filteredWithoutTaxDiscountData = [];
                let filteredDiscountData = data?.transactions?.filter(transaction => transaction?.isDiscountApplied);
                let filteredTaxData = data?.transactions?.filter(transaction => transaction?.isTaxApplied);
                if (voucherTypeControl.value === VOUCHERS.SALES || voucherTypeControl.value === VOUCHERS.JOURNAL || voucherTypeControl.value === VOUCHERS.PURCHASE) {
                    filteredWithoutTaxDiscountData = data?.transactions?.filter(transaction => !transaction?.isDiscountApplied && !transaction?.isTaxApplied);
                    if (filteredDiscountData?.length) {
                        filteredDiscountData?.forEach(discount => {
                            let discountData = this.discountsList?.filter(response => response?.additional?.uniqueName === discount?.particular);
                            filteredWithoutTaxDiscountData[0].discounts?.push({
                                amount: discountData[0]?.additional?.discountValue,
                                discountType: discountData[0]?.additional?.discountType,
                                discountUniqueName: discountData[0]?.additional?.uniqueName,
                                discountValue: discountData[0]?.additional?.discountValue,
                                name: discountData[0]?.additional?.name,
                                particular: "discount"
                            });
                        });
                    }
                    if (filteredTaxData?.length) {
                        filteredTaxData?.forEach(tax => {
                            filteredWithoutTaxDiscountData[0].taxes?.push(tax?.particular);
                        });
                    }
                    filteredWithoutTaxDiscountData?.forEach(transaction => {
                        delete transaction?.isDiscountApplied;
                        delete transaction?.isTaxApplied;
                    });
                    data.transactions = filteredWithoutTaxDiscountData;
                    if (data.transactions?.length) {
                        data.transactions[0].amount = this.isSalesEntry ? salesAmount : (data.transactions[0]?.actualAmount - (filteredTaxData[0]?.amount ?? 0));
                        data.transactions[0].total = data.transactions[0].actualAmount + (filteredDiscountData[0]?.amount ?? 0);
                        data.transactions[0].isInclusiveTax = false;
                    }
                }

                if (data.transactions.length > 1) {
                    data.transactions.forEach((transaction, i) => {
                        delete data.transactions[i].actualAmount;
                    });
                } else {
                    delete data.transactions[0].actualAmount;
                }
                this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
            } else {
                const byOrTo = data.voucherType === 'Payment' ? 'by' : 'to';
                let message = this.localeData?.blank_account_error;
                message = message?.replace("[BY_TO]", byOrTo.toUpperCase());
                this._toaster.errorToast(message, this.commonLocaleData?.app_error);
                this.activeRowIndex = null;
                this.activeRowType = null;
                setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
            }
        } else {
            this._toaster.errorToast(this.localeData?.credit_debit_equal_error, this.commonLocaleData?.app_error);
            this.activeRowIndex = null;
            this.activeRowType = null;
            setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
    }

    /**
     * This will be use for validate for contra entry
     *
     * @param {*} data
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public validateForContraEntry(data: any): boolean {
        if (data.voucherType === 'contra') {
            const byAccounts = data.transactions?.filter(acc => acc.type === 'by');
            const toAccounts = data.transactions?.filter(acc => acc.type === 'to');

            let isValid = false;

            isValid = byAccounts?.some(acc => {
                const indexOfAccountParentGroups = acc?.selectedAccount?.parentGroups?.findIndex(pg => ['bankaccounts', 'cash', 'loanandoverdraft'].includes(pg?.uniqueName));
                return indexOfAccountParentGroups !== -1;
            });

            if (!isValid) {
                isValid = toAccounts?.some(acc => {
                    const indexOfAccountParentGroups = acc?.selectedAccount?.parentGroups?.findIndex(pg => ['bankaccounts', 'cash', 'loanandoverdraft'].includes(pg?.uniqueName));
                    return indexOfAccountParentGroups !== -1;
                });
            }

            return isValid;
        } else {
            return false;
        }
    }

    /**
     * his will be use for validate for sales and purchase entry
     *
     * @param {*} data
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public validateForSalesAndPurchaseEntry(data: any) {
        const debitEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'by' && trxn?.selectedAccount && trxn.selectedAccount?.parentGroups?.find((pg) => (pg?.uniqueName === 'revenuefromoperations' || pg?.uniqueName === 'currentassets' || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'purchases' || pg?.uniqueName === 'directexpenses'))));
        const creditEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'to' && trxn?.selectedAccount && trxn.selectedAccount?.parentGroups?.find((pg) => (pg?.uniqueName === 'revenuefromoperations' || pg?.uniqueName === 'currentassets' || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'purchases' || pg?.uniqueName === 'directexpenses'))));

        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This will be use for validate for payment and receipt entry
     *
     * @param {*} data
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public validatePaymentAndReceipt(data: any): boolean {
        if (data.voucherType === 'payment' || data.voucherType === 'receipt') {
            const byAccounts = data.transactions?.filter(acc => acc.type === 'by');
            const toAccounts = data.transactions?.filter(acc => acc.type === 'to');

            let isValid = false;

            if (data.voucherType === 'payment') {
                isValid = byAccounts?.some(acc => {
                    const indexOfAccountParentGroups = acc?.selectedAccount?.parentGroups?.findIndex(pg => ['sundrydebtors', 'sundrycreditors', 'tdsreceivable'].includes(pg?.uniqueName));
                    return indexOfAccountParentGroups !== -1;
                });

                if (!isValid) {
                    isValid = toAccounts?.some(acc => {
                        const indexOfAccountParentGroups = acc?.selectedAccount?.parentGroups?.findIndex(pg => ['cash', 'bankaccounts', 'loanandoverdraft', 'tdspayable'].includes(pg?.uniqueName));
                        return indexOfAccountParentGroups !== -1;
                    });
                }
            }

            if (data.voucherType === 'receipt') {
                isValid = byAccounts?.some(acc => {
                    const indexOfAccountParentGroups = acc?.selectedAccount?.parentGroups?.findIndex(pg => ['bankaccounts', 'cash', 'loanandoverdraft', 'tdsreceivable'].includes(pg?.uniqueName));
                    return indexOfAccountParentGroups !== -1;
                });

                if (!isValid) {
                    isValid = toAccounts?.some(acc => {
                        const indexOfAccountParentGroups = acc?.selectedAccount?.parentGroups?.findIndex(pg => ['tcspayable', 'sundrycreditors', 'sundrydebtors'].includes(pg?.uniqueName));
                        return indexOfAccountParentGroups !== -1;
                    });
                }
            }

            return isValid;
        } else {
            return true;
        }
    }

    /**
     * This will be use for refresh entry
     *
     * @memberof AccountAsVoucherComponent
     */
    public refreshEntry(): void {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;

        // Clear transactions FormArray
        while (transactionsFormArray.length !== 0) {
            transactionsFormArray.removeAt(0);
        }
        // Reset other variables and properties
        this.showConfirmationBox = false;
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.receiptEntries = [];
        this.totalEntries = 0;
        this.adjustmentTransaction = {};
        this.chequeDetailForm?.reset();
        this.isSalesEntry = false;
        this.showDiscountAndTax.emit(this.isSalesEntry);

        // Set entry date
        this.journalVoucherForm.patchValue({
            entryDate: dayjs().format(GIDDH_DATE_FORMAT),
            description: ''
        });

        // Set journal date
        if (this.universalDate[1]) {
            this.journalVoucherForm.get('entryDate').patchValue(dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT));
        } else {
            this.journalVoucherForm.get('entryDate').patchValue(dayjs().format(GIDDH_DATE_FORMAT));
        }
        this.dateEntered();

        // Add new entry object
        this.checkVoucherTypeNewEntries(this.currentVoucher, cloneDeep(VOUCHERS));

        // Set type based on current voucher
        setTimeout(() => {
            const firstTransaction = transactionsFormArray.at(0) as FormGroup;
            switch (this.currentVoucher.toLowerCase()) {
                case VOUCHERS.CONTRA:
                    firstTransaction.patchValue({ type: 'by' });
                    break;

                case VOUCHERS.RECEIPT:
                    firstTransaction.patchValue({ type: 'to' });
                    break;

                case VOUCHERS.PAYMENT:
                    firstTransaction.patchValue({ type: 'by' });
                    break;

                case VOUCHERS.SALES:
                case VOUCHERS.PURCHASE:
                    firstTransaction.patchValue({ type: 'by' });
                    this.isSalesEntry = true;
                    this.showDiscountAndTax.emit(this.isSalesEntry);
                    break;

                default:
                    firstTransaction.patchValue({ type: 'by' });
                    break;
            }
            this.initializeAccountSearchData();
        }, 100);
    }


    /**
     * This hook will be use for component after initialization
     *
     * @memberof AccountAsVoucherComponent
     */
    public ngAfterViewInit(): void {
        this.isComponentLoaded = true;
        this.activeRowIndex = 0;
        this.activeRowType = "account";
        setTimeout(() => {
            this.isNoAccFound = false;
        }, 3000);
    }

    /**
     * This hook will be use for component destroyed
     *
     * @memberof AccountAsVoucherComponent
     */
    public ngOnDestroy(): void {
        if (this.dialog) {
            this.dialog.closeAll();
        }
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
    * This will be use for set date
    *
    * @param {*} date
    * @memberof AccountAsVoucherComponent
    */
    public setDate(date: any): void {
        this.showFromDatePicker = !this.showFromDatePicker;
        this.journalVoucherForm.patchValue({
            entryDate: dayjs(date).format(GIDDH_DATE_FORMAT)
        });
    }

    /**
     * This will be use for watch key events
     *
     * @param {*} event
     * @memberof AccountAsVoucherComponent
     */
    public watchKeyboardEvent(event: any) {
        if (event) {
            let navigateTo = find(this.navigateURL, (o: any) => o.code === event.key);
            if (navigateTo) {
                this.router.navigate(['accounting', navigateTo.route]);
            }
        }
    }

    /**
     * This will be use for remove blank transactions
     *
     * @param {*} transactions
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public removeBlankTransaction(transactions: any[]) {
        return transactions?.filter(obj => obj && obj.particular);
    }

    /**
     * This will be use for validate transactions
     *
     * @param {*} transactions
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public validateTransaction(transactions: any[]) {
        const validEntries = this.removeBlankTransaction(transactions);

        for (const obj of validEntries) {
            if (!obj.particular) {
                this._toaster.errorToast(this.localeData?.blank_particular_error);
                setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
                return null; // Returning null as an indication of error
            } else if (!obj.amount) {
                obj.amount = 0;
            }
        }

        return validEntries;
    }

    /**
     * This will be use for data entered
     *
     * @memberof AccountAsVoucherComponent
     */
    public dateEntered(): void {
        const date = (typeof this.journalVoucherForm.get('entryDate').value === "object") ? dayjs(this.journalVoucherForm.get('entryDate').value).format("dddd")
            : dayjs(this.journalVoucherForm.get('entryDate').value, GIDDH_DATE_FORMAT).format("dddd");
        this.displayDay = (date !== 'Invalid date') ? date : '';
    }


    /**
     * This will be use for select date
     *
     * @param {*} date
     * @param {*} dateField
     * @memberof AccountAsVoucherComponent
     */
    public selectDate(date: any, dateField: any): void {
        if (date) {
            let formatDate = dayjs(date).format(GIDDH_DATE_FORMAT);
            if (dateField === 'dateOfSupply') {
                this.chequeDetailForm.get('chequeClearanceDate').patchValue(formatDate);
            }
        }
    }

    /**
     * This will be use for validation accounts
     *
     * @param {FormGroup} transactionObj
     * @param {KeyboardEvent} ev
     * @param {number} idx
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public validateAccount(transactionObj: FormGroup, ev: KeyboardEvent, idx: number): void {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        const lastIndx = transactionsFormArray.length - 1;

        if (idx === lastIndx) {
            return;
        }

        if (!transactionObj.get('selectedAccount.account').value) {
            transactionObj.patchValue({
                selectedAccount: {},
                amount: 0,
                inventory: null
            });
            if (idx) {
                transactionsFormArray.removeAt(idx);
            } else {
                ev.preventDefault();
            }
            return;
        }

        if (transactionObj.get('selectedAccount.account').value !== transactionObj.get('selectedAccount.name').value) {
            let message = this.localeData?.no_account_found;
            message = message?.replace("[ACCOUNT]", transactionObj.get('selectedAccount.account').value);
            this._toaster.errorToast(message);
            ev.preventDefault();
            return;
        }
    }

    /**
     * This will be use for on item selection
     *
     * @param {IOption} event
     * @return {*}  {void}
     * @memberof AccountAsVoucherComponent
     */
    public onItemSelected(event: any): void {
        const dropdownIndex = event.index;
        // Store the selected account's index in the form array for current row
        if (dropdownIndex !== undefined && this.activeRowIndex !== undefined) {
            const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
            const currentTransaction = transactionsFormArray.at(this.activeRowIndex) as FormGroup;
            
            // Add or update selectedAccountIndex in the form
            if (currentTransaction.get('selectedAccountIndex')) {
                currentTransaction.get('selectedAccountIndex').setValue(dropdownIndex);
            } else {
                currentTransaction.addControl('selectedAccountIndex', this.formBuilder.control(dropdownIndex));
            }
        }
        
        this.showLedgerAccountList = false;
            
        if (event?.value === 'createnewitem') {
            return this.addNewAccount();
        }
        
        this.setAccount(event.additional);

        this.changeDetectionRef.detectChanges();
    }


    /**
     * This function will be use for on check number field
     *
     * @param {*} event
     * @param {string} fieldType
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public onCheckNumberFieldKeyDown(event: any, fieldType: string) {
        if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB || event.key === KEYS.ESC)) {
            if (event.key === KEYS.ESC) {
                this.closeChequeDetailForm();
                this.focusDebitCreditAmount();
                return;
            }
            return setTimeout(() => {
                if (fieldType === 'chqNumber') {
                    this.chequeClearanceInputField?.nativeElement?.focus();
                } else if (fieldType === 'chqDate') {
                    this.chqFormSubmitBtn?.nativeElement?.focus();
                }
            }, 100);
        }
    }
    /**
     * This will be use for key on submit button
     *
     * @param {*} e
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public keyUpOnSubmitButton(event: any) {
        if (event && (event.keyCode === 39 || event.which === 39) || (event.keyCode === 78 || event.which === 78)) {
            return setTimeout(() => this.resetButton?.nativeElement?.focus(), 50);
        }
        if (event && (event.keyCode === 8 || event.which === 8)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 50);
        }
    }

    /**
     * This will be use for key on reset button
     *
     * @param {*} event
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public keyUpOnResetButton(event: any) {
        if (event && (event.keyCode === 37 || event.which === 37) || (event.keyCode === 89 || event.which === 89)) {
            return setTimeout(() => this.submitButton?.nativeElement?.focus(), 50);
        }
        if (event && (event.keyCode === 13 || event.which === 13)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 50);
        }
    }

    /**
     * This will be use for on no account found
     *
     * @param {boolean} ev
     * @memberof AccountAsVoucherComponent
     */
    public onNoAccountFound(event: boolean): void {
        if (event && this.isComponentLoaded) {
            this.isNoAccFound = true;
        }
    }

    /**
     * This will be use for deleting row
     *
     * @private
     * @param {number} idx
     * @memberof AccountAsVoucherComponent
     */
    private deleteRow(idx: number): void {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;

        // Remove transaction at the specified index from the form array
        transactionsFormArray.removeAt(idx);

        if (!idx) {
            // If the deleted row was the first row, add a new entry object and set its type to 'by'
            this.checkVoucherTypeNewEntries(this.currentVoucher, cloneDeep(VOUCHERS));
            const firstTransaction = transactionsFormArray.at(0) as FormGroup;
            firstTransaction.patchValue({ type: 'by' });
        }
    }

    /**
     * Add newly created account to the appropriate dropdown list
     *
     * @private
     * @param {*} accountDetails
     * @memberof AccountAsVoucherComponent
     */
    private addNewAccountToDropdown(accountDetails: any): void {
        
        if (!accountDetails) {
            return;
        }
        
        // Create the account item in the same format as search results
        const newAccountItem = {
            value: accountDetails.uniqueName,
            label: `${accountDetails.name} (${accountDetails.uniqueName})`,
            additional: accountDetails,
            index: 0
        };
        
        // Determine which account type list to add to based on current selectedInput
        const targetAccountType = this.selectedInput || 'by'; // Default to 'by' if not set
        const searchData = targetAccountType === 'by' ? this.byAccountSearchData : this.toAccountSearchData;
        
        // Add to the end of the accounts list
        newAccountItem.index = searchData.accounts.length;
        searchData.accounts.push(newAccountItem);
        
        // Update display list
        this.displayAccountList = [...searchData.accounts];
        
    }

    /**
     * This will be use for calculating differences among transactions
     *
     * @private
     * @param {*} type
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    private calculateDiffAmount(type: any) {
        if (type === 'by') {
            if (this.totalDebitAmount < this.totalCreditAmount) {
                return this.totalDiffAmount = this.totalCreditAmount - this.totalDebitAmount;
            } else {
                return this.totalDiffAmount = 0;
            }
        } else if (type === 'to') {
            if (this.totalCreditAmount < this.totalDebitAmount) {
                return this.totalDiffAmount = this.totalDebitAmount - this.totalCreditAmount;
            } else {
                return this.totalDiffAmount = 0;
            }
        }
    }

    /**
    * This function will close the confirmation popup on click of No
    *
    * @memberof AccountAsVoucherComponent
    */
    public acceptCancel(): void {
        this.showConfirmationBox = false;
    }

    /**
     * This will reset the entries if voucher type changed
     *
     * @memberof AccountAsVoucherComponent
     */
    public resetEntriesIfVoucherChanged(): void {
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        if (this.previousVoucherType !== voucherTypeControl.value) {
            this.previousVoucherType = voucherTypeControl.value;
            this.refreshEntry();
        }
    }

    /**
     * Opens the account aside pane dialog
     *
     * @memberof AccountAsVoucherComponent
     */
    public openAccountAsidePaneDialog(): void {
        this.genericAsideMenuAccountDialogRef = this.dialog.open(this.genericAsideMenuAccountTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Body class toggler
     *
     * @memberof AccountAsVoucherComponent
     */
    public closeAccountAsidePane(): void {
        this.genericAsideMenuAccountDialogRef.close();
        this.showLedgerAccountList = false;
        this.closeDiscountSidebar();
        this.closeTaxSidebar();
    }

    /**
     * Add new account event handler
     *
     * @param {AddAccountRequest} item Account details
     * @memberof AccountAsVoucherComponent
     */
    public addNewSidebarAccount(item: AddAccountRequest): void {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    /**
     * Update account event handler
     *
     * @param {UpdateAccountRequest} item Account details
     * @param {boolean} [usePatchApi=false]
     * @memberof AccountAsVoucherComponent
     */
    public updateSidebarAccount(item: UpdateAccountRequest, usePatchApi: boolean = false): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item, usePatchApi));
    }

    /**
     * Toggles the aside pane when new account request is submitted
     *
     * @memberof AccountAsVoucherComponent
     */
    public addNewAccount(): void {
        this.openAccountAsidePaneDialog();
    }

    /**
     * Puts focus on date input field when voucher date
     * is changed from date picker component
     *
     * @memberof AccountAsVoucherComponent
     */
    public handleVoucherDateChange(): void {
        this.dateField?.nativeElement?.focus();
    }

    /**
     * Focuses on entry debit and credit amount
     *
     * @memberof AccountAsVoucherComponent
     */
    public focusDebitCreditAmount(): void {
        const transactionsArray = this.journalVoucherForm.get('transactions') as FormArray;
        const selectedTransaction = transactionsArray.at(this.activeRowIndex);
        const type = selectedTransaction.get('type')?.value;
        if (type === 'by') {
            this.byAmountFields?.last?.nativeElement?.focus();
        } else {
            this.toAmountFields?.last?.nativeElement?.focus();
        }


    }

    /**
     * Sets the current balance of account based on credit and debit total
     *
     * @private
     * @param {*} balanceData Response received from API
     * @param {number} index Current index of account in entry
     * @memberof AccountAsVoucherComponent
     */
    private setAccountCurrentBalance(balanceData: any, index: number): void {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        const transactionAtIndex = transactionsFormArray.at(index) as FormGroup;

        if (balanceData.closingBalance) {
            transactionAtIndex.get('currentBalance').setValue(balanceData.closingBalance.amount);
            transactionAtIndex.get('selectedAccount.type').setValue(balanceData.closingBalance.type);
        }
    }

    /**
     * Scroll end handler with global variable management
     *
     * @returns null
     * @memberof AccountAsVoucherComponent
     */
    public handleScrollEnd(): void {
        const currentAccountType = this.selectedInput || 'by';
        const searchData = currentAccountType === 'by' ? this.byAccountSearchData : this.toAccountSearchData;
        
        if (searchData.page < searchData.totalPages && !searchData.isLoading) {
            // Use search count (50) for load more operations
            this.loadAccountsForType(
                currentAccountType,
                searchData.searchQuery,
                searchData.page + 1,
                this.SEARCH_LOAD_MORE_COUNT,
                false
            );
        } else {
            this.loadMoreInProgress = false;
        }
    }

    /**
     * This will validate all the adjustment entries
     *
     * @memberof AccountAsVoucherComponent
     */
    public validateEntries(showErrorMessage: boolean): void {
        let receiptTotal = 0;
        let adjustmentTotal = 0;
        let isValid = true;
        let invoiceRequired = false;
        let invoiceAmountError = false;

        if (this.receiptEntries?.length > 0) {
            this.receiptEntries.forEach(receipt => {
                if (isValid) {
                    if (isNaN(parseFloat(receipt.amount))) {
                        isValid = false;
                    } else {
                        if (receipt.type === AdjustmentTypesEnum.againstReference) {
                            adjustmentTotal += parseFloat(receipt.amount);
                        } else {
                            receiptTotal += parseFloat(receipt.amount);
                        }
                    }

                    if (isValid && receipt.type === AdjustmentTypesEnum.againstReference && !receipt.invoice?.uniqueName) {
                        isValid = false;
                        invoiceRequired = true;
                    } else if (isValid && receipt.type === AdjustmentTypesEnum.againstReference && receipt.invoice?.uniqueName && parseFloat(receipt.invoice.amount) < parseFloat(receipt.amount)) {
                        isValid = false;
                        invoiceAmountError = true;
                    }
                }
            });
        }

        if (isValid) {
            if (this.adjustmentTransaction.amount && (receiptTotal != this.adjustmentTransaction.amount || adjustmentTotal > this.adjustmentTransaction.amount)) {
                this.isValidForm = false;

                if (showErrorMessage) {
                    this._toaster.errorToast(this.amountErrorMessage);
                }
            } else {
                this.isValidForm = true;
            }
        } else {
            this.isValidForm = false;

            if (showErrorMessage) {
                this._toaster.clearAllToaster();

                if (invoiceRequired) {
                    this._toaster.errorToast(this.invoiceErrorMessage);
                } else if (invoiceAmountError) {
                    this._toaster.errorToast(this.invoiceAmountErrorMessage);
                } else {
                    this._toaster.errorToast(this.invalidAmountErrorMessage);
                }
            }
        }
    }

    /**
    * This will be use for change tabs to type field
    *
    * @memberof AccountAsVoucherComponent
    */
    public changeTab(mode: any, type: any): void {
        // Safe FormArray access with null checks
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;

        if (!transactionsFormArray) {
            return;
        }
        
        // Ensure activeRowIndex is within valid bounds
        const maxRowIndex = transactionsFormArray.length - 1;
        if (this.activeRowIndex < 0) {
            this.activeRowIndex = 0;
        } else if (this.activeRowIndex > maxRowIndex) {
            this.activeRowIndex = maxRowIndex;
        }
        if (mode === 'enter') {
            if (type === 'amount') {
                if (this.totalCreditAmount === this.totalDebitAmount) {
                    if (this.activeRowIndex === maxRowIndex) {
                        this.activeRowType = '';
                        this.showLedgerAccountList = false;
                        this.narrationBox?.nativeElement?.focus();
                        this.showConfirmationBox = false;
                    } else {
                        this.activeRowIndex = Math.min(this.activeRowIndex + 1, maxRowIndex);
                        this.activeRowType = "type";
                    }
                } else {
                    if (this.activeRowIndex === maxRowIndex) {
                        this.narrationBox?.nativeElement?.focus();
                        this.showConfirmationBox = false;
                    } else {
                        this.activeRowIndex = Math.min(this.activeRowIndex + 1, maxRowIndex);
                        this.activeRowType = "type";
                    }
                }
            } else if (type === 'type') {
                this.activeRowType = "account";
            } else if (type === 'account') {
                this.activeRowType = "amount";
            }
        } else if (mode === "shift") {
            if (type === 'type') {
                this.activeRowIndex = Math.max(this.activeRowIndex - 1, 0);
                this.activeRowType = "amount";
            } else if (type === 'amount') {
                this.activeRowType = "account";
            } else if (type === 'account') {
                this.activeRowType = "type";
            }
        } else if (mode === "tab") {
            if (type === 'amount') {
                if (this.activeRowIndex === maxRowIndex) {
                    this.activeRowType = '';
                    this.showLedgerAccountList = false;
                } else {
                    this.activeRowIndex = Math.min(this.activeRowIndex + 1, maxRowIndex);
                    this.activeRowType = "type";
                }
            } else if (type === 'type') {
                this.activeRowType = "account";
            } else if (type === 'account') {
                this.activeRowType = "amount";
            }
        }

        // Validate activeRowIndex after navigation
        if (this.activeRowIndex < 0 || this.activeRowIndex > maxRowIndex) {
            this.activeRowIndex = Math.max(0, Math.min(this.activeRowIndex, maxRowIndex));
        }

        if (this.activeRowType === "account") {
            this.handleTransactionFocus(this.activeRowIndex);
        }

        this.changeDetectionRef.detectChanges();
    }

    /**
     *  Key up/down event handler
     *
     * @param {*} event
     * @memberof AccountAsVoucherComponent
     */
    public keydownUp(event): void {
        const elements = this.eleRef?.nativeElement?.querySelectorAll('.list-item');
        let key = event.which;
        if (this.showDiscountSidebar || this.showTaxSidebar || this.showLedgerAccountList) {
            if (key === this.KEYS.ESC || key === this.KEYS.TAB || (key === this.KEYS.UP && event.altKey)) {
                this.closeDiscountSidebar();
                this.closeTaxSidebar();
            } else if (key === this.KEYS.ENTER) {
                const selectedElement = elements[this.selectedIndex];
                const anchorElement = selectedElement?.firstChild as HTMLElement;
                anchorElement?.click();
            } else if (key === this.KEYS.UP) {
                event.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            } else if (key === this.KEYS.DOWN) {
                event.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.showDiscountSidebar ? this.discountsList.length - 1 : this.showLedgerAccountList ? this.displayAccountList?.length - 1 : this.companyTaxesList?.length - 1);
            }
            if (elements.length > 0) {
                elements[this.selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        }
        this.changeDetectionRef.detectChanges();
    }

    /**
     * This will use for selecting the discount from sidebar list
     *
     * @param {*} discount
     * @memberof AccountAsVoucherComponent
     */
    public toggleDiscountSelected(discountObj: any): void {
        if (discountObj) {
            let transactionsFormArray = (this.journalVoucherForm.get('transactions') as FormArray);
            let discountTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.isDiscountApplied);
            if (discountTransactionIndex === -1) {
                discountTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
            }
            if (discountTransactionIndex !== -1) {
                let transactionAtIndex = transactionsFormArray.at(discountTransactionIndex) as FormGroup;
                
                // Store the selected discount index in the form
                const selectedDiscountIndex = discountObj.index;
                if (selectedDiscountIndex !== undefined) {
                    if (transactionAtIndex.get('selectedDiscountIndex')) {
                        transactionAtIndex.get('selectedDiscountIndex').setValue(selectedDiscountIndex);
                    } else {
                        transactionAtIndex.addControl('selectedDiscountIndex', this.formBuilder.control(selectedDiscountIndex));
                    }
                }
                
                transactionAtIndex.patchValue({
                    amount: 0,
                    particular: discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discountObj?.value,
                    currentBalance: '',
                    applyApplicableTaxes: false,
                    isDiscountApplied: true,
                    isTaxApplied: false,
                    isInclusiveTax: false,
                    type: 'by',
                    taxes: [],
                    total: null,
                    discounts: [],
                    inventory: null,
                    selectedAccount: {
                        name: discountObj?.additional?.name ? (discountObj?.additional?.name + ' (' + discountObj?.additional?.discountType + ')') : discountObj?.name,
                        UniqueName: discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discountObj?.value,
                        groupUniqueName: '',
                        account: discountObj?.additional?.name ? (discountObj?.additional?.name + ' (' + discountObj?.additional?.discountType + ')') : discountObj?.name,
                        type: discountObj?.additional?.discountType,
                        parentGroup: ''
                    },
                    discountType: discountObj?.additional?.discountType,
                    discountValue: discountObj?.additional?.discountValue ?? 0
                });
                this.selectAccUnqName = discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discountObj?.value;
                this.calculateAmount(Number(transactionAtIndex.get('amount').value), transactionAtIndex, discountTransactionIndex);
            } else {
                this.newEntryObj('by', discountObj, 'discount');
            }
            this.changeTab('enter', 'account');
            this.closeDiscountSidebar();
        }
        this.changeDetectionRef.detectChanges();
    }

    /**
     * This will be use for selecting the tax from sidebar list
     *
     * @param {*} tax
     * @memberof AccountAsVoucherComponent
     */
    public toggleTaxSelected(tax: any): void {
        if (tax) {
            let transactionsFormArray = (this.journalVoucherForm.get('transactions') as FormArray);
            let taxTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.isTaxApplied);
            if (taxTransactionIndex === -1) {
                taxTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
            }
            if (taxTransactionIndex !== -1) {
                let transactionAtIndex = transactionsFormArray.at(taxTransactionIndex) as FormGroup;
                
                // Store the selected tax index in the form
                const selectedTaxIndex = tax.index;
                if (selectedTaxIndex !== undefined) {
                    if (transactionAtIndex.get('selectedTaxIndex')) {
                        transactionAtIndex.get('selectedTaxIndex').setValue(selectedTaxIndex);
                    } else {
                        transactionAtIndex.addControl('selectedTaxIndex', this.formBuilder.control(selectedTaxIndex));
                    }
                }
                
                transactionAtIndex.patchValue({
                    amount: tax?.additional?.taxDetail[0]?.taxValue,
                    particular: tax?.additional?.uniqueName,
                    currentBalance: '',
                    applyApplicableTaxes: false,
                    isDiscountApplied: false,
                    isTaxApplied: true,
                    isInclusiveTax: false,
                    type: 'to',
                    taxes: [],
                    total: null,
                    discounts: [],
                    inventory: null,
                    selectedAccount: {
                        name: tax?.additional?.name,
                        UniqueName: tax?.additional?.uniqueName,
                        groupUniqueName: '',
                        account: tax?.additional?.name,
                        type: '',
                        parentGroup: ''
                    },
                    taxValue: tax?.additional?.taxDetail[0]?.taxValue
                });
                this.selectAccUnqName = tax?.additional?.name;
                this.calculateAmount(Number(transactionAtIndex.get('amount').value), transactionAtIndex, taxTransactionIndex);
            } else {
                this.newEntryObj('to', tax, 'tax');
            }
            this.changeTab('enter', 'account');
            this.closeTaxSidebar();
            this.changeDetectionRef.detectChanges();
        }
    }

    /**
     * This wil be use for get taxes
     *
     * @memberof AccountAsVoucherComponent
     */
    public getTaxes(): void {
        this.store.pipe(select(response => response.company && response.company.isGetTaxesSuccess), takeUntil(this.destroyed$)).subscribe(isGetTaxes => {
            if (isGetTaxes) {
                this.store.pipe(select(response => response.company && response.company.taxes), takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response) {
                        this.companyTaxesList = response.map((item, index) => {
                            return {
                                label: item?.name,
                                value: item?.uniqueName,
                                additional: item,
                                index: index
                            }
                        });
                    } else {
                        this.companyTaxesList = [];
                    }
                });
            }
        });
    }

    /**
     * This will be use for get discounts
     *
     * @private
     * @memberof AccountAsVoucherComponent
     */
    private getDiscounts(): void {
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountsList = response?.body.map((item, index) => {
                    return {
                        label: item?.name,
                        value: item?.uniqueName,
                        additional: item,
                        index: index
                    }
                });
            }
        });
    }
}
