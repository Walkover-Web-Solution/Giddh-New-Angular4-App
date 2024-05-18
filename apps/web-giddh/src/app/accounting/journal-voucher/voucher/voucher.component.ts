import { animate, state, style, transition, trigger } from '@angular/animations';
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
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, ReplaySubject, of as observableOf, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { SalesActions } from '../../../actions/sales/sales.action';
import { AccountResponse, AddAccountRequest, UpdateAccountRequest } from '../../../models/api-models/Account';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';
import { KeyboardService } from '../../keyboard.service';
import { KEYS } from '../journal-voucher.component';
import { AdjustmentTypesEnum } from "../../../shared/helpers/adjustmentTypes";
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { IForceClear } from '../../../models/api-models/Sales';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { SearchService } from '../../../services/search.service';
import { VOUCHERS } from '../../constants/accounting.constant';
import { GeneralService } from '../../../services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDiscountService } from '../../../services/settings.discount.service';
import { CompanyActions } from '../../../actions/company.actions';

const CustomShortcode = [
    { code: 'F9', route: 'purchase' }
];

@Component({
    selector: 'account-as-voucher',
    templateUrl: './voucher.component.html',
    styleUrls: ['../../accounting.component.scss', './voucher.component.scss'],
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

export class AccountAsVoucherComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @Input() public saveEntryOnCtrlA: boolean;
    @Input() public openDatePicker: boolean;
    @Input() public openCreateAccountPopup: boolean;
    @Input() public newSelectedAccount: AccountResponse;
    /** Current date to show the balance till date */
    @Input() public currentDate: string;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    @Input() public isCompany: boolean;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public showAccountList: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('quickAccountComponent', { static: true }) public quickAccountComponent: ElementViewContainerRef;
    @ViewChild('quickAccountModal', { static: true }) public quickAccountModal: ModalDirective;

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
    @ViewChild('manageGroupsAccountsModal', { static: true }) public manageGroupsAccountsModal: ModalDirective;
    /* Selector for receipt entry modal */
    @ViewChild('receiptEntry', { static: true }) public receiptEntry: TemplateRef<any>;
    /* Selector for adjustment type field */
    @ViewChildren('adjustmentTypesField') public adjustmentTypesField: ShSelectComponent;
    /** List of all 'DEBIT' amount fields when 'By' entries are made  */
    @ViewChildren('byAmountField') public byAmountFields: QueryList<ElementRef>;

    /** List of all 'CREDIT' amount fields when 'To' entries are made  */
    @ViewChildren('toAmountField') public toAmountFields: QueryList<ElementRef>;
    /** List of both date picker used (one in voucher date and other in check clearance date) */
    @ViewChildren(BsDatepickerDirective) bsDatePickers: QueryList<BsDatepickerDirective>;
    public showLedgerAccountList: boolean = false;
    public selectedInput: 'by' | 'to' = 'by';

    public totalCreditAmount: number = 0;
    public totalDebitAmount: number = 0;
    public showConfirmationBox: boolean = false;
    public dayjs = dayjs;
    public accountSearch: string;
    public selectedIdx: any;
    public isSelectedRow: boolean;
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
    public asideMenuStateForProductService: string = 'out';
    public isFirstRowDeleted: boolean = false;
    public autoFocusStockGroupField: boolean = false;
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
    /* Variable to store if modal is out/in */
    public accountAsideMenuState: string = 'out';
    /** Category of accounts to display based on voucher type */
    public categoryOfAccounts: string = 'currentassets';
    /* Object of bootstrap modal */
    public modalRef: BsModalRef;
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
    /** Config for bs datepicker */
    public config: Partial<BsDatepickerConfig> = { dateInputFormat: GIDDH_DATE_FORMAT };
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
    /** Emits the value if it is sales entry */
    @Output() public salesEntry: EventEmitter<boolean> = new EventEmitter();

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
        public bsConfig: BsDatepickerConfig,
        private salesAction: SalesActions,
        private searchService: SearchService,
        private changeDetectionRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private eleRef: ElementRef) {
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
        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;

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
        this.activeRow(true, 0);
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
                this.activeRow(true, 0);
                this.activeRowIndex = 0;
                this.activeRowType = "account";
                this._toaster.successToast(this.localeData?.entry_created, this.commonLocaleData?.app_success);
                this.refreshEntry();
                this.store.dispatch(this._ledgerActions.ResetLedger());
                this.journalVoucherForm.patchValue({
                    description: ''
                });
                this.dateField?.nativeElement?.focus();
                this.salesEntry.emit(false);
            }
        });

        this.refreshEntry();
        this.getDiscounts();
        this.store.dispatch(this.companyActions.getTax());
        this.getTaxes();

        this.createStockSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(yesOrNo => {
            if (yesOrNo) {
                this.asideMenuStateForProductService = 'out';
                this.autoFocusStockGroupField = false;
                // this.getStock(null, null, true);
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
                if (isAccountSuccessfullyCreated && this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                }
                if (createdAccountDetails) {
                    this.setAccount(createdAccountDetails);
                }
            }
        });

        this.searchedAccountQuery.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event?.code === 'Enter') {
                return;
            } else if (event?.target?.value === 'ð') {
                this.showDiscountSidebar = true;
                return;
            } else if (event?.target?.value === 'þ') {
                this.showTaxSidebar = true;
                return;
            } else {
                this.searchAccount(event, event.target?.value);
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
        if (event.key === 'F6') {
            event.preventDefault(); // Prevent default F6 behavior
            this.customFunctionForF6();
        } else if (event.key === 'F7') {
            event.preventDefault(); // Prevent default F7 behavior
            this.customFunctionForF7();
        } else if (event.key === 'ð') {
            event.preventDefault();
            this.customFunctionForDiscountSidebar();
        } else if (event.key === 'þ') {
            event.preventDefault();
            this.customFunctionForTaxSidebar();
        }
        else if (event.key === 'Escape') {
            if (this.showDiscountSidebar) {
                this.closeDiscountSidebar();
                this.closeTaxSidebar();
            }
            if (this.showTaxSidebar) {
                this.closeDiscountSidebar();
                this.closeTaxSidebar();
            }
            if (this.showLedgerAccountList) {
                this.showLedgerAccountList = false;
            }
        }
        if (this.showDiscountSidebar) {
            this.keydownUp(event);
        }
        if (this.showTaxSidebar) {
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
            this.showDiscountSidebar = true;
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
            this.showTaxSidebar = true;
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
            if (this.bsDatePickers) {
                this.bsDatePickers.first?.show();
            }
        }
        if ('openCreateAccountPopup' in changes && changes.openCreateAccountPopup.currentValue !== changes.openCreateAccountPopup.previousValue) {
            if (changes.openCreateAccountPopup.currentValue) {
                this.addNewAccount();
            }
        }
        if (changes?.showDiscount?.currentValue) {
            this.showDiscountSidebar = true;
        }
        if (changes?.showTax?.currentValue) {
            this.showTaxSidebar = true;
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
                amount: this.calculateDiscount(discountObj?.additional?.discountType, discountObj?.additional?.discountValue ?? 0),
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
            this.selectAccUnqName = discountObj?.additional?.uniqueName;
        } else if (taxData) {
            let filteredTaxData = this.companyTaxesList.filter((item) => {
                return item.additional.name === (taxData.name ? taxData.name : taxData.label) && item.additional.uniqueName === (taxData.uniqueName ? taxData.uniqueName : taxData?.value);
            });

            newTransactionFormGroup.patchValue({
                amount: this.calculateTax(filteredTaxData[0]?.additional?.taxDetail[0]?.taxValue),
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
        } else {
            newTransactionFormGroup.patchValue({
                amount: null,
                actualAmount: null,
                particular: '',
                currentBalance: '',
                applyApplicableTaxes: false,
                isInclusiveTax: false,
                type: byOrTo,
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
        // Push the new transaction FormGroup into the form array
        formArray.push(newTransactionFormGroup);
        const index = formArray.controls.findIndex(formGroup => formGroup === newTransactionFormGroup);
        this.calculateAmount(Number(newTransactionFormGroup.get('amount').value), newTransactionFormGroup, index);
    }

    public updateTransactionActualAmount(transaction: FormGroup): void {
        transaction.get('actualAmount')?.patchValue(Number(transaction.get('amount')?.value));
    }

    public removeAmountIfAccountRemoved(transaction: FormGroup, index: number): void {
        if (!transaction.get('account')?.value && (transaction?.get('isDiscountApplied')?.value || transaction?.get('isTaxApplied')?.value)) {
            const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
            transactionsFormArray.removeAt(index);

            const { totalCredit, totalDebit } = this.calculateTotalCreditAndDebit();
            this.totalCreditAmount = totalCredit;
            this.totalDebitAmount = totalDebit;
        }
    }

    public calculateTaxDiscount(): void {
        this.calculateDiscount(); 
        this.calculateTax();
    }

    public calculateDiscount(discountType?: string, discountValue?: number): number {
        let discountAmount = 0;
        let discountEntryControl;

        let amount = 0;
        (this.journalVoucherForm.get('transactions') as FormArray).controls?.forEach((control: FormGroup) => {
            if (control.value.particular && control.value.type === "to" && !control.value.isTaxApplied && !control.value.isDiscountApplied) {
                amount += control.value.actualAmount;
            }
            if (control.value.particular && control.value.type === "by" && control.value.isDiscountApplied) {
                discountEntryControl = control;
                discountType = control.value.discountType;
                discountValue = control.value.discountValue;
            }
        });

        if (amount) {
            discountAmount = (discountType === 'PERCENTAGE') ? discountValue / 100 * amount : discountValue;
            discountEntryControl?.get('amount')?.patchValue(discountAmount);
        } else {
            discountAmount = 0;
        }

        return discountAmount;
    }

    public calculateTax(taxAmount?: number) {
        let amount = 0;
        let toEntryControl;
        let byEntryControl;
        let taxEntryControl;

        (this.journalVoucherForm.get('transactions') as FormArray).controls?.forEach((control: FormGroup) => {
            if (control.value.particular && control.value.type === "to" && !control.value.isTaxApplied && !control.value.isDiscountApplied) {
                toEntryControl = control;
                amount += control.value.actualAmount;
            }
            if (control.value.particular && control.value.type === "by" && !control.value.isTaxApplied && !control.value.isDiscountApplied) {
                byEntryControl = control;
            }
            if (control.value.particular && control.value.type === "by" && control.value.isDiscountApplied) {
                amount -= control.value.amount;
            }
            if (!taxAmount && control.value.particular && control.value.type === "to" && control.value.isTaxApplied) {
                taxEntryControl = control;
                taxAmount = control.value.taxValue;
            }
        });

        if (amount) {
            if (taxAmount) {
                taxAmount = taxAmount / 100 * amount;
            } else {
                taxAmount = 0;
            }
            taxEntryControl?.get('amount')?.patchValue(taxAmount);
            toEntryControl.get('amount')?.patchValue(amount + taxAmount);
            byEntryControl.get('amount')?.patchValue(amount + taxAmount);
        } else {
            taxAmount = 0;
        }
        return taxAmount;
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
     * Updates the selected row state and index based on user interaction.
     *
     * @param {boolean} type
     * @param {*} idx
     * @memberof AccountAsVoucherComponent
     */
    public selectRow(type: boolean, index: number, transaction?: FormGroup): void {
        this.isSelectedRow = type;
        this.selectedIdx = index;
        this.showLedgerAccountList = false;
        this.closeDiscountSidebar();
        this.closeTaxSidebar();
        setTimeout(() => {
            transaction?.get('selectedAccount.name')?.patchValue("");
        }, 100);
        this.changeDetectionRef.detectChanges();
    }

    /**
     * This will be use for active row
     *
     * @param {boolean} type
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    public activeRow(type: boolean, index: number): void {
        this.isSelectedRow = type;
        this.selectedIdx = index;
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
     * Handles the focus event on an account input field.
     *
     * @param {*} event
     * @param {*} element
     * @param {*} trxnType
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    public onAccountFocus(event: any, element: any, trxnType: any, index: number): void {
        this.selectedAccountInputField = event.target;

        this.selectedField = 'account';
        this.showConfirmationBox = false;
        this.selectedTransactionType = trxnType;
        this.selectedParticular = element;
        this.selectRow(true, index);

        this.filterAccount(trxnType);
        this.inputForList = cloneDeep(this.flattenAccounts);
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

        // setTimeout(() => {
        //     this.selectedParticular.focus();
        // }, 10);
    }

    /**
     * Close the cheque details dialog
     *
     * @memberof AccountAsVoucherComponent
     */
    public closeChequeDetailForm(): void {
        this.dialog.closeAll();
        this.changeTab('enter', 'account', true);
    }
    /**
     *
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
    public setAccount(acc: any, event?: any): void {
        this.searchService.loadDetails(acc?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            let transactionsFormArray;
            let transactionAtIndex;
            let transaction;
            if (response?.body && (response?.body?.currency?.code || this.activeCompany?.baseCurrency) === this.activeCompany?.baseCurrency) {
                let idx = this.selectedIdx;
                transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
                transactionAtIndex = transactionsFormArray.at(idx) as FormGroup;
                if (acc && acc.parentGroups.find((pg) => pg?.uniqueName === 'bankaccounts')) {
                    this.openChequeDetailForm();
                } else {
                    let parentGroups = ['revenuefromoperations', 'otherincome', 'fixedassets'];
                    let matchedGroup = response?.body?.parentGroups.some((group: string) => parentGroups.includes(group));
                    if (matchedGroup) {
                        this.salesEntry.emit(true);
                        this.isSalesEntry = true;
                    }
                }

                if (acc) {
                    const formattedCurrentDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.tallyModuleService.getCurrentBalance(this.currentCompanyUniqueName, acc?.uniqueName, formattedCurrentDate, formattedCurrentDate).subscribe((data) => {
                        if (data && data.body) {
                            this.setAccountCurrentBalance(data.body, idx);
                        }
                    }, () => { });

                    let accModel = {
                        name: acc.name,
                        UniqueName: acc?.uniqueName,
                        groupUniqueName: acc.parentGroups[acc.parentGroups?.length - 1]?.uniqueName,
                        account: acc.name,
                    };

                    // Update transaction form group with received data
                    transactionAtIndex?.patchValue({
                        amount: !this.isSalesEntry ? this.calculateDiffAmount(transactionAtIndex.get('type')?.value?.toLowerCase()) : 0,
                        actualAmount: !this.isSalesEntry ? this.calculateDiffAmount(transactionAtIndex.get('type')?.value?.toLowerCase()) : 0,
                        particular: accModel?.UniqueName,
                        currentBalance: '',
                        selectedAccount: {
                            name: accModel.name,
                            UniqueName: accModel.UniqueName,
                            groupUniqueName: accModel.groupUniqueName,
                            account: accModel.account,
                            type: '',
                            parentGroup: response?.body?.parentGroups
                        }
                    });
                    // Check and push to inventory
                    if (acc) {
                        this.groupUniqueName = accModel?.groupUniqueName;
                        this.selectAccUnqName = acc?.uniqueName;
                    }

                    if (!response.body.applicableDiscounts?.length || !response.body.applicableTaxes?.length) {
                        this.changeTab('enter', 'account', true);
                    }

                    this.calculateAmount(Number(transactionAtIndex.get('amount').value), transactionAtIndex, idx);

                    if (response.body.applicableDiscounts?.length) {
                        let index = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
                        transactionAtIndex = transactionsFormArray.at(index) as FormGroup;
                        response.body.applicableDiscounts.forEach(discount => {
                            let discountArray = this.discountsList?.filter(response => response?.additional?.uniqueName === discount?.uniqueName);
                            if (index !== -1) {
                                let discountObj = discountArray[0];
                                transactionAtIndex = transactionsFormArray.at(index) as FormGroup;
                                transactionAtIndex.patchValue({
                                    amount: this.calculateDiscount(discountObj?.additional?.discountType, discountObj?.additional?.discountValue ?? 0),
                                    particular: discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discount?.uniqueName,
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
                                        UniqueName: discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discountObj?.unqiueName,
                                        groupUniqueName: '',
                                        account: discountObj?.additional?.name ? (discountObj?.additional?.name + ' (' + discountObj?.additional?.discountType + ')') : discountObj?.name,
                                        type: discountObj?.additional?.discountType,
                                        parentGroup: ''
                                    },
                                    discountType: discountObj?.additional?.discountType,
                                    discountValue: discountObj?.additional?.discountValue ?? 0
                                });
                                this.selectAccUnqName = discountObj?.additional?.uniqueName ? discountObj?.additional?.uniqueName : discount?.uniqueName;
                                this.calculateAmount(Number(transactionAtIndex.get('amount').value), transactionAtIndex, index);
                            } else {
                                this.newEntryObj('by', discount, 'discount');
                            }
                        });
                    }
                    if (response.body.applicableTaxes?.length) {
                        let index = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
                        transactionAtIndex = transactionsFormArray.at(index) as FormGroup;
                        response.body.applicableTaxes.forEach(tax => {
                            if (index !== -1) {
                                let filteredTaxData = this.companyTaxesList.filter((item) => {
                                    return item.additional.uniqueName === tax.uniqueName;
                                });
                                transactionAtIndex.patchValue({
                                    amount: this.calculateTax(filteredTaxData[0]?.additional?.taxDetail[0]?.taxValue),
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
     * This will be use or search accounts
     *
     * @param {KeyboardEvent} event
     * @param {string} accountName
     * @memberof AccountAsVoucherComponent
     */
    public searchAccount(event: KeyboardEvent, accountName: string): void {
        if (event && accountName) {
            this.filterByText = accountName;
            this.showLedgerAccountList = true;
            this.onAccountSearchQueryChanged(this.filterByText);
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
        this.calculateAmount(amount, transactionObj, index);
    }

    /**
     * This will calculate the total amount
     *
     * @param {*} amount
     * @param {*} transactionObj
     * @param {number} indx
     * @memberof AccountAsVoucherComponent
     */
    public calculateAmount(amount: any, transactionObj: any, indx: number): any {
        let lastIndx = (this.journalVoucherForm.get('transactions') as FormArray).length - 1;
        // Update amount in transaction object
        transactionObj.get('amount').setValue(Number(amount));
        transactionObj.get('total').setValue(transactionObj.get('amount').value);
        const { totalCredit, totalDebit } = this.calculateTotalCreditAndDebit();
        this.totalCreditAmount = totalCredit;
        this.totalDebitAmount = totalDebit;

        if (indx === lastIndx && transactionObj.get('selectedAccount.name').value) {
            const voucherTypeControl = this.journalVoucherForm.get('voucherType');
            // Setting the value of voucherType FormControl to currentVoucher
            voucherTypeControl.setValue(this.currentVoucher);
            let voucherType = cloneDeep(VOUCHERS);
            this.checkVoucherTypeNewEntries(this.currentVoucher, voucherType);
        }
    }

    /**
     * This will be use for check voucher type new entries
     *
     * @param {*} currentVoucher
     * @param {*} voucherType
     * @memberof AccountAsVoucherComponent
     */
    public checkVoucherTypeNewEntries(currentVoucher: any, voucherType: any): void {
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
        if (this.isSalesEntry) { 
            this.calculateTaxDiscount();
        }
        
        let totalCredit = 0;
        let totalDebit = 0;

        (this.journalVoucherForm.get('transactions') as FormArray).controls?.forEach((control: FormGroup) => {
            if (control.get('type').value.toLowerCase() === 'to') {
                if (!control.get('isDiscountApplied')?.value) {
                    totalCredit += control.get('amount').value;
                }
                if (control.get('isTaxApplied').value) {
                    totalCredit -= control.get('amount').value;
                }
            } else {
                if (!control.get('isDiscountApplied')?.value) {
                    totalDebit += control.get('amount').value;
                }
            }
        });

        return { totalCredit, totalDebit };
    }

    /**
     * This will handle keyboard events
     *
     * @param {KeyboardEvent} event
     * @param {HTMLButtonElement} submitButton
     * @memberof AccountAsVoucherComponent
     */
    public handleEnterKeyPress(event: KeyboardEvent, submitButton: HTMLButtonElement): void {
        if (event.key === 'Enter') {
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

                    // let voucherAdjustments = this.receiptEntries;
                    // if (voucherAdjustments && voucherAdjustments.length > 0) {
                    //     let dataVoucherAdjustments = [];
                    //     let byEntry = data.transactions[1];
                    //     let totalTransactions = data.transactions?.length;
                    //     let adjustmentsCount = 0;

                    //     voucherAdjustments.forEach(adjustment => {
                    //         if (adjustment.type === AdjustmentTypesEnum.receipt || adjustment.type === AdjustmentTypesEnum.advanceReceipt) {
                    //             let taxAmount = 0;
                    //             let advanceReceiptAmount = 0;

                    //             if (adjustment.type === AdjustmentTypesEnum.advanceReceipt) {
                    //                 taxAmount = adjustment.tax?.value;
                    //                 advanceReceiptAmount = Number(adjustment.amount) - Number(taxAmount);
                    //             }

                    //             data.transactions[totalTransactions] = {
                    //                 advanceReceiptAmount: advanceReceiptAmount,
                    //                 amount: Number(adjustment.amount),
                    //                 applyApplicableTaxes: byEntry.applyApplicableTaxes,
                    //                 currentBalance: byEntry.applyApplicableTaxes,
                    //                 discounts: [],
                    //                 inventory: [],
                    //                 isInclusiveTax: byEntry.isInclusiveTax,
                    //                 particular: byEntry.particular,
                    //                 selectedAccount: byEntry.selectedAccount,
                    //                 stocks: null,
                    //                 tax: taxAmount,
                    //                 taxes: adjustment.tax?.uniqueName ? [adjustment.tax?.uniqueName] : [],
                    //                 total: Number(adjustment.amount),
                    //                 type: byEntry.type,
                    //                 subVoucher: (adjustment.type === AdjustmentTypesEnum.advanceReceipt) ? SubVoucher.AdvanceReceipt : ""
                    //             };
                    //             totalTransactions++;
                    //         } else {
                    //             dataVoucherAdjustments[adjustmentsCount] = this.pendingInvoiceList[adjustment.invoice?.uniqueName];
                    //             dataVoucherAdjustments[adjustmentsCount].adjustmentAmount = {
                    //                 amountForAccount: Number(adjustment.amount),
                    //                 amountForCompany: Number(adjustment.amount)
                    //             };
                    //             adjustmentsCount++;
                    //         }
                    //     });

                    //     if (dataVoucherAdjustments && dataVoucherAdjustments.length > 0) {
                    //         if (data.transactions[2]) {
                    //             data.transactions[2].voucherAdjustments = { adjustments: [] };
                    //             data.transactions[2].voucherAdjustments.adjustments = dataVoucherAdjustments;
                    //         }
                    //     }
                    // }

                    // data.transactions[1].type = "to"; // changing it to "to" so that it becomes debit in loop below
                }

                data.transactions.forEach((element: any) => {
                    if (element) {
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
                if (voucherTypeControl.value === VOUCHERS.SALES) {

                    let filteredDiscountData = data?.transactions?.filter(transaction => transaction?.isDiscountApplied);
                    let filteredTaxData = data?.transactions?.filter(transaction => transaction?.isTaxApplied);

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
                    firstTransaction.patchValue({ type: 'by' });
                    break;

                default:
                    firstTransaction.patchValue({ type: 'by' });
                    break;
            }
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
        // this.dialog.afterAllClosed.pipe(takeUntil(this.destroyed$)).subscribe(() => {
        //     this.focusDebitCreditAmount();
        // });
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
        return transactions.filter(obj => obj && obj.particular);
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
     * This will be use for filter accounts
     *
     * @param {string} byOrTo
     * @memberof AccountAsVoucherComponent
     */
    public filterAccount(byOrTo: string): void {
        if (byOrTo) {
            this.tallyModuleService.selectedFieldType.next(byOrTo);
        }
    }

    /**
     * This will be use for detect key
     *
     * @param {KeyboardEvent} ev
     * @memberof AccountAsVoucherComponent
     */
    public detectKey(ev: KeyboardEvent): void {
        this.keyUpDownEvent = ev;
        //  if (ev.keyCode === 27) {
        //   this.deleteRow(this.selectedIdx);
        //  }
        //  if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
        //   this.arrowInput = { key: ev.keyCode };
        //  }
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
    public onItemSelected(event: IOption): void {
        setTimeout(() => {
            this.currentSelectedValue = '';
            this.showLedgerAccountList = false;
            this.changeTab('enter', 'account', true);
        }, 100);
        if (event?.value === 'createnewitem') {
            return this.addNewAccount();
        }
        // this.activeParticularAccountIndex = null;
        if (this.selectedField === 'account') {
            this.setAccount(event.additional, event);
        }

        this.changeDetectionRef.detectChanges();
        //else if (this.selectedField === 'stock') {
        //     this.onSelectStock(ev.additional);
        // }
    }


    /**
     * This function will be use for on check number field
     *
     * @param {*} event
     * @param {string} fieldType
     * @param {BsDatepickerDirective} datePickerField
     * @return {*}
     * @memberof AccountAsVoucherComponent
     */
    public onCheckNumberFieldKeyDown(event: any, fieldType: string, datePickerField: BsDatepickerDirective) {
        if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB || event.key === KEYS.ESC)) {
            if (event.key === KEYS.ESC) {
                datePickerField.hide();
                this.closeChequeDetailForm();
                this.focusDebitCreditAmount();
                return;
            }
            return setTimeout(() => {
                if (fieldType === 'chqNumber') {
                    datePickerField?.show();
                    this.chequeClearanceInputField?.nativeElement?.focus();
                } else if (fieldType === 'chqDate') {
                    datePickerField.hide();
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
     * Aside pane togglere
     *
     * @param {*} [event] Toggle event
     * @memberof AccountAsVoucherComponent
     */
    public toggleAccountAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Body class toggler
     *
     * @memberof AccountAsVoucherComponent
     */
    public toggleBodyClass(): void {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            this.showLedgerAccountList = false;
            this.closeDiscountSidebar();
            this.closeTaxSidebar();
            document.querySelector('body').classList.remove('fixed');
        }
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
     * @param {AddAccountRequest} item Account details
     * @memberof AccountAsVoucherComponent
     */
    public updateSidebarAccount(item: UpdateAccountRequest): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    /**
     * Toggles the aside pane when new account request is submitted
     *
     * @memberof AccountAsVoucherComponent
     */
    public addNewAccount(): void {
        this.toggleAccountAsidePane();
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
        const selectedTransaction = transactionsArray.at(this.selectedIdx);
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
     * Scroll end handler for expense account
     *
     * @returns null
     * @memberof AccountAsVoucherComponent
     */
    public handleScrollEnd(): void {
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.accountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: `${result.name} (${result?.uniqueName})`,
                                additional: result
                            }
                        }) || [];
                        this.defaultAccountSuggestions = this.defaultAccountSuggestions.concat(...results);
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Search query change handler for expense account
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AccountAsVoucherComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            const { group, exceptGroups } = this.tallyModuleService.getGroupByVoucher(voucherTypeControl.value, this.selectedTransactionType);
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group,
                exceptGroups,
                count: PAGINATION_LIMIT
            };
            // Loaded accounts will be of groups -> (Groups - Except Groups)
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result.name} (${result?.uniqueName})`,
                            additional: result
                        }
                    }) || [];
                    if (page === 1) {
                        this.inputForList = searchResults;
                    } else {
                        this.inputForList = [
                            ...this.inputForList,
                            ...searchResults
                        ];
                    }
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                }
                this.changeDetectionRef.detectChanges();
            });
        } else {
            this.inputForList = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
            this.changeDetectionRef.detectChanges();
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
    public changeTab(mode: any, type: any, againAccountSelect?: boolean, discountTaxApplied?: any): void {
        let transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        if (againAccountSelect) {
            this.activeRowIndex = this.selectedIdx;
        }
        if (mode === 'enter') {
            if (type === 'amount') {
                if (this.totalCreditAmount === this.totalDebitAmount) {
                    if (this.activeRowIndex === transactionsFormArray.length - 1) {
                        this.narrationBox?.nativeElement?.focus();
                        this.showConfirmationBox = false;
                    } else {
                        this.activeRowIndex = this.activeRowIndex + 1;
                        this.activeRowType = "type";
                    }
                } else {
                    if (transactionsFormArray.length === this.activeRowIndex) {
                        this.narrationBox?.nativeElement?.focus();
                        this.showConfirmationBox = false;
                    } else {
                        this.activeRowIndex = this.activeRowIndex + 1;
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
                this.activeRowIndex = this.activeRowIndex - 1;
                this.activeRowType = "amount";
            } else if (type === 'amount') {
                this.activeRowType = "account";
            } else if (type === 'account') {
                this.activeRowType = "type";
            }
        } else if (mode === "tab") {
            if (type === 'amount') {
                this.activeRowIndex = discountTaxApplied ? this.activeRowIndex + 2 : this.activeRowIndex + 1;
                this.activeRowType = "type";
            } else if (type === 'type') {
                this.activeRowType = "account";
            } else if (type === 'account') {
                this.activeRowType = "amount";
            }
        }

        this.changeDetectionRef.detectChanges();
    }

    /**
     * This will be use for get type event
     *
     * @param {string} event
     * @memberof AccountAsVoucherComponent
     */
    public getTypeEvent(event: string): void {
        if (event) {
            document.getElementById(`transactionAccount_` + this.selectedInputFieldIndex).focus();
        }
    }

    /**
     * Keydown handler event
     *
     * @param {*} event
     * @memberof AccountAsVoucherComponent
     */
    public keydownUp(event): void {
        const elements = this.eleRef?.nativeElement?.querySelectorAll('.list-item');
        let key = event.which;
        if (this.showDiscountSidebar || this.showTaxSidebar) {
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
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.showDiscountSidebar ? this.discountsList.length - 1 : this.companyTaxesList?.length - 1);
            }
            if (elements.length > 0) {
                elements.forEach((element, index) => {
                    if (index === this.selectedIndex) {
                        element.classList.add('hilighted');
                    } else {
                        element.classList.remove('hilighted');
                    }
                });
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
            this.showDiscountSidebar = false;
            let transactionsFormArray = (this.journalVoucherForm.get('transactions') as FormArray);
            let discountTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.isDiscountApplied);
            if (discountTransactionIndex === -1) {
                discountTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
            }
            if (discountTransactionIndex !== -1) {
                let transactionAtIndex = transactionsFormArray.at(discountTransactionIndex) as FormGroup;
                transactionAtIndex.patchValue({
                    amount: this.calculateDiscount(discountObj?.additional?.discountType, discountObj?.additional?.discountValue ?? 0),
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
            this.changeTab('enter', 'account', true);
            this.closeDiscountSidebar();
            this.changeDetectionRef.detectChanges();
        }
    }

    /**
     * This will be use for selecting the tax from sidebar list
     *
     * @param {*} tax
     * @memberof AccountAsVoucherComponent
     */
    public toggleTaxSelected(tax: any): void {
        if (tax) {
            this.showTaxSidebar = false;
            let transactionsFormArray = (this.journalVoucherForm.get('transactions') as FormArray);
            let taxTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.isTaxApplied);
            if (taxTransactionIndex === -1) {
                taxTransactionIndex = transactionsFormArray?.value?.findIndex(obj => obj.particular === '');
            }
            if (taxTransactionIndex !== -1) {
                let transactionAtIndex = transactionsFormArray.at(taxTransactionIndex) as FormGroup;
                transactionAtIndex.patchValue({
                    amount: this.calculateTax(tax?.additional?.taxDetail[0]?.taxValue),
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
            this.changeTab('enter', 'account', true);
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
                        this.companyTaxesList = response.map(item => {
                            return {
                                label: item?.name,
                                value: item?.uniqueName,
                                additional: item
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
                this.discountsList = response?.body.map(item => {
                    return {
                        label: item?.name,
                        value: item?.uniqueName,
                        additional: item
                    }
                });
            }
        });
    }


    /**
    * This will add new row for adjusment
    *
    * @memberof AccountAsVoucherComponent
    */
    // public addNewAdjustmentEntry(): void {
    //     if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && parseFloat(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
    //         let getAdjustmentTypes = this.prepareAdjustmentTypes(this.totalEntries);

    //         this.receiptEntries[this.totalEntries] = {
    //             allowedTypes: getAdjustmentTypes,
    //             type: (this.advanceReceiptExists) ? AdjustmentTypesEnum.advanceReceipt : AdjustmentTypesEnum.receipt,
    //             //note: '',
    //             tax: {
    //                 name: '',
    //                 uniqueName: '',
    //                 percent: 0,
    //                 value: 0
    //             },
    //             invoice: {
    //                 number: '',
    //                 date: '',
    //                 amount: 0,
    //                 uniqueName: '',
    //                 type: ''
    //             },
    //             amount: 0
    //         }
    //         this.totalEntries++;
    //     }
    // }

    /**
     * This will get called on enter/tab in adjustment amount field
     *
     * @param {KeyboardEvent} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    // public validateAmount(event: KeyboardEvent, entry: any): void {
    //     if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB) && this.adjustmentTransaction && this.adjustmentTransaction.amount) {
    //         this.validateEntry(entry);
    //     }
    // }

    /**
     * This will validate the adjustment entry
     *
     * @param {*} entry
     * @returns {*}
     * @memberof AccountAsVoucherComponent
     */
    // public validateEntry(entry: any): any {
    //     if (!entry.amount) {
    //         this._toaster.clearAllToaster();
    //         this._toaster.errorToast(this.invalidAmountErrorMessage);
    //         this.isValidForm = false;
    //         return;
    //     } else if (isNaN(parseFloat(entry.amount)) || entry.amount <= 0) {
    //         this._toaster.clearAllToaster();
    //         this._toaster.errorToast(this.invalidAmountErrorMessage);
    //         this.isValidForm = false;
    //         return;
    //     }

    //     if (entry.type === AdjustmentTypesEnum.receipt || entry.type === AdjustmentTypesEnum.advanceReceipt) {
    //         if (parseFloat(entry.amount) !== this.adjustmentTransaction.amount) {
    //             this._toaster.clearAllToaster();
    //             this._toaster.errorToast(this.entryAmountErrorMessage);
    //             this.isValidForm = false;
    //             return;
    //         }
    //     }

    //     if (entry.type === AdjustmentTypesEnum.againstReference && !entry.invoice?.uniqueName) {
    //         this._toaster.clearAllToaster();
    //         this._toaster.errorToast(this.invoiceErrorMessage);
    //         this.isValidForm = false;
    //         return;
    //     }

    //     if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
    //         entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
    //     } else {
    //         entry.tax.value = 0;
    //     }

    //     let receiptTotal = 0;

    //     this.receiptEntries.forEach(receipt => {
    //         if (receipt.type === AdjustmentTypesEnum.againstReference) {
    //             receiptTotal += parseFloat(receipt.amount);
    //         }
    //     });

    //     if (receiptTotal < this.adjustmentTransaction.amount) {
    //         if (entry.type === AdjustmentTypesEnum.againstReference) {
    //             let invoiceBalanceDue = parseFloat(this.pendingInvoiceList[entry.invoice?.uniqueName].balanceDue.amountForAccount);
    //             if (invoiceBalanceDue >= entry.amount) {
    //                 this.addNewAdjustmentEntry();
    //                 this.validateEntries(false);
    //             } else if (invoiceBalanceDue < entry.amount) {
    //                 this._toaster.clearAllToaster();
    //                 this._toaster.errorToast(this.invoiceAmountErrorMessage);
    //                 this.isValidForm = false;
    //             }
    //         } else {
    //             this.addNewAdjustmentEntry();
    //             this.validateEntries(false);
    //         }
    //     } else if (receiptTotal > this.adjustmentTransaction.amount) {
    //         this._toaster.clearAllToaster();
    //         this._toaster.errorToast(this.amountErrorMessage);
    //         this.isValidForm = false;
    //     } else {
    //         entry.amount = parseFloat(entry.amount);
    //         this.validateEntries(true);
    //     }
    // }

    /**
     * This will open the adjustment popup if voucher is receipt and transaction is To/Cr
     *
     * @param {KeyboardEvent} event
     * @param {*} transaction
     * @param {TemplateRef<any>} template
     * @memberof AccountAsVoucherComponent
     */
    // public openAdjustmentModal(event: KeyboardEvent, transaction: any, template: TemplateRef<any>): void {
    //     if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB)) {
    //         this.validateAndOpenAdjustmentPopup(transaction, template);
    //     }
    // }

    /**
     * This will format the amount
     *
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    // public formatAmount(entry: any): void {
    //     entry.amount = Number(entry.amount);
    // }

    /**
     * This will prepare the list of adjusment types
     *
     * @returns {IOption[]}
     * @memberof AccountAsVoucherComponent
     */
    // public prepareAdjustmentTypes(index: number, entry?: any): IOption[] {
    //     let adjustmentTypesOptions: IOption[] = [];

    //     adjustmentTypes.map(type => {
    //         if ((index === 0 && (type?.value === AdjustmentTypesEnum.receipt || type?.value === AdjustmentTypesEnum.advanceReceipt)) || (index > 0 && type?.value === AdjustmentTypesEnum.againstReference) || (entry && type?.value === entry.type)) {
    //             adjustmentTypesOptions.push({ label: type.label, value: type?.value });
    //         }
    //     });

    //     return adjustmentTypesOptions;
    // }

    /**
     * This will initiate update of adjustment types of all adjustments
     *
     * @param {string} action
     * @memberof AccountAsVoucherComponent
     */
    // public updateAdjustmentTypes(action: string): void {
    //     if (this.receiptEntries && this.receiptEntries.length > 0) {
    //         let loop = 0;
    //         this.receiptEntries.forEach(entry => {
    //             entry.allowedTypes = this.prepareAdjustmentTypes(loop, action);
    //             loop++;
    //         });
    //     }
    // }

    /**
     * Callback for select type in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    // public onSelectAdjustmentType(event: any, entry: any): void {
    //     if (event && event?.value === AdjustmentTypesEnum.receipt) {
    //         entry.tax = {
    //             name: '',
    //             uniqueName: '',
    //             percent: 0,
    //             value: 0
    //         };
    //         this.forceClear$ = observableOf({ status: true });
    //     }
    // }

    /**
     * This will validate the transaction and adjustments and will open popup if required
     *
     * @param {*} transaction
     * @param {TemplateRef<any>} template
     * @memberof AccountAsVoucherComponent
     */
    // public validateAndOpenAdjustmentPopup(transaction: any, template: TemplateRef<any>): void {
    //     if (this.requestObj.voucherType === VOUCHERS.RECEIPT && transaction && transaction.type === "to" && !transaction.voucherAdjustments) {
    //         if (transaction.amount && Number(transaction.amount) > 0) {
    //             if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
    //                 this.pendingInvoicesListParams.accountUniqueNames = [];
    //                 this.pendingInvoicesListParams.accountUniqueNames.push(transaction.selectedAccount?.UniqueName);
    //             }

    //             this.getInvoiceListForReceiptVoucher();
    //             this.currentTransaction = transaction;
    //             this.modalRef = this.modalService.show(
    //                 template,
    //                 Object.assign({}, { class: 'modal-lg', ignoreBackdropClick: true })
    //             );
    //         }
    //     }
    // }

    /**
    * openStockList
    */
    // public openStockList() {
    //     this.showLedgerAccountList = false;
    //     this.showStockList = true;
    //     // this.showStockList.next(true);
    // }

    /**
     * onSelectStock
     */
    // public onSelectStock(item) {
    //     if (item) {
    //         let idx = this.selectedStockIdx;
    //         let entryItem = cloneDeep(item);
    //         this.prepareEntry(entryItem, this.selectedIdx);
    //         // setTimeout(() => {
    //         //   this.selectedStk.focus();
    //         //   this.showStockList = false;
    //         // }, 50);
    //     } else {
    //         this.requestObj.transactions[this.selectedIdx].inventory.splice(this.selectedStockIdx, 1);
    //     }
    // }

    /**
     * prepareEntry
     */
    // public prepareEntry(item, idx) {
    //     let i = this.selectedStockIdx;
    //     if (item && item.stockUnit) {
    //         let defaultUnit = {
    //             stockUnitCode: item.stockUnit.name,
    //             code: item.stockUnit.code,
    //             rate: 0
    //         };

    //         // this.requestObj.transactions[idx].inventory[i].unit.rate = item.rate;

    //         //Check if the Unit is initialized

    //         if (this.requestObj.transactions[idx].inventory[i].unit) {
    //             this.requestObj.transactions[idx].inventory[i].unit.rate = item.amount / item.openingQuantity; // Kunal
    //             this.requestObj.transactions[idx].inventory[i].unit.code = item.stockUnit.code;
    //             this.requestObj.transactions[idx].inventory[i].unit.stockUnitCode = item.stockUnit.name;
    //         }

    //         // this.requestObj.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
    //         this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item?.uniqueName };
    //         // this.requestObj.transactions[idx].selectedAccount?.uniqueName = item.accountStockDetails.accountUniqueName;
    //         this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
    //     }

    // }

    /**
     * changePrice
     */
    // public changePrice(idx, val) {
    //     let i = this.selectedIdx;
    //     this.requestObj.transactions[i].inventory[idx].unit.rate = !Number.isNaN(val) ? Number(cloneDeep(val)) : 0;
    //     this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(this.giddhBalanceDecimalPlaces));
    //     this.amountChanged(idx);
    // }

    // public amountChanged(invIdx) {
    //     let i = this.selectedIdx;
    //     if (this.requestObj.transactions && this.requestObj.transactions[i].inventory[invIdx].stock && this.requestObj.transactions[i].inventory[invIdx].quantity) {
    //         this.requestObj.transactions[i].inventory[invIdx].unit.rate = Number((this.requestObj.transactions[i].inventory[invIdx].amount / this.requestObj.transactions[i].inventory[invIdx].quantity).toFixed(this.giddhBalanceDecimalPlaces));
    //     }
    //     let total = this.calculateTransactionTotal(this.requestObj.transactions[i].inventory);
    //     this.requestObj.transactions[i].total = total;
    //     this.requestObj.transactions[i].amount = total;
    // }

    /**
     * calculateTransactionTotal
     */
    // public calculateTransactionTotal(inventory) {
    //     let total = 0;
    //     inventory.forEach((inv) => {
    //         total = total + Number(inv.amount);
    //     });
    //     return total;
    // }

    // public changeQuantity(idx, val) {
    //     let i = this.selectedIdx;
    //     this.requestObj.transactions[i].inventory[idx].quantity = Number(val);
    //     this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(this.giddhBalanceDecimalPlaces));
    //     this.amountChanged(idx);
    // }

    // public validateAndAddNewStock(idx) {
    //     let i = this.selectedIdx;
    //     if (this.requestObj.transactions[i]?.inventory?.length - 1 === idx) {
    //         this.requestObj.transactions[i].inventory.push(this.initInventory());
    //     }
    // }

    // public onStockFocus(ev, stockIndx: number, indx: number) {
    //     this.selectedStockInputField = ev.target;
    //     this.showConfirmationBox = false;
    //     this.selectedStockIdx = stockIndx;
    //     this.selectedIdx = indx;
    //     this.getStock(this.groupUniqueName);
    //     this.getStock();
    //     this.showLedgerAccountList = true;
    //     setTimeout(() => {
    //         this.selectedField = 'stock';
    //     }, 100);
    // }

    // public openCreateAccountPopupIfRequired(e) {
    //     if (e && this.isNoAccFound) {
    //         // this.showQuickAccountModal();
    //     }
    // }

    /**
    * getStock
    */
    // public getStock(parentGrpUnqName?, q?: string, forceRefresh: boolean = false, needToFocusStockInputField: boolean = false) {
    //     if (this.allStocks && this.allStocks.length && !forceRefresh) {
    //         // this.inputForList = cloneDeep(this.allStocks);
    //         this.sortStockItems(cloneDeep(this.allStocks));
    //     } else {
    //         this.inventoryService.GetStocks().pipe(takeUntil(this.destroyed$)).subscribe(data => {
    //             if (data?.status === 'success') {
    //                 this.allStocks = cloneDeep(data?.body?.results);
    //                 this.sortStockItems(this.allStocks);
    //                 if (needToFocusStockInputField) {
    //                     this.selectedStockInputField.value = '';
    //                     this.selectedStockInputField.focus();
    //                 }
    //                 // this.inputForList = cloneDeep(this.allStocks);
    //             } else {
    //                 // this.noResult = true;
    //             }
    //         });
    //     }
    // }

    /**
     * sortStockItems
     */
    // public sortStockItems(ItemArr) {
    //     let stockAccountArr: IOption[] = [];
    //     forEach(ItemArr, (obj: any) => {
    //         stockAccountArr.push({
    //             label: `${obj.name} (${obj?.uniqueName})`,
    //             value: obj?.uniqueName,
    //             additional: obj
    //         });
    //     });
    //     this.stockList = stockAccountArr;
    //     this.inputForList = cloneDeep(this.stockList);
    // }

    // public loadQuickAccountComponent() {
    //     if (this.quickAccountModal && this.quickAccountModal.config) {
    //         this.quickAccountModal.config.backdrop = false;
    //     }
    //     let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
    //     let viewContainerRef = this.quickAccountComponent.viewContainerRef;
    //     viewContainerRef.remove();
    //     let componentRef = viewContainerRef.createComponent(componentFactory);
    //     let componentInstance = componentRef.instance as QuickAccountComponent;
    //     componentInstance.needAutoFocus = true;
    //     componentInstance.closeQuickAccountModal.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
    //         this.hideQuickAccountModal();
    //         componentInstance.newAccountForm.reset();
    //         componentInstance.destroyed$.next(true);
    //         componentInstance.destroyed$.complete();
    //         this.isNoAccFound = false;
    //         this.dateField?.nativeElement?.focus();
    //     });
    // }

    // public showQuickAccountModal() {
    //     // let selectedField = window.document.querySelector('input[onReturn][type="text"][data-changed="true"]');
    //     // this.selectedAccountInputField = selectedField;
    //     if (this.selectedField === 'account') {
    //         this.loadQuickAccountComponent();
    //         this.quickAccountModal?.show();
    //     } else if (this.selectedField === 'stock') {
    //         this.asideMenuStateForProductService = 'in';
    //         this.autoFocusStockGroupField = true;
    //     }
    // }

    // public hideQuickAccountModal() {
    //     this.quickAccountModal.hide();
    //     this.dateField?.nativeElement?.focus();
    //     return setTimeout(() => {
    //         this.selectedAccountInputField.value = '';
    //         this.selectedAccountInputField.focus();
    //     }, 200);
    // }

    // public closeCreateStock() {
    //     this.asideMenuStateForProductService = 'out';
    //     this.autoFocusStockGroupField = false;
    //     // after creating stock, get all stocks again
    //     this.filterByText = '';
    //     this.dateField?.nativeElement?.focus();
    //     this.getStock(null, null, true, true);
    // }

    /**
    * This will create list of accounts depending on voucher type
    *
    * @memberof AccountAsVoucherComponent
    */
    // public createAccountsList(): void {
    //     if (this.allAccounts) {
    //         let accList: IOption[] = [];
    //         let accountList = [];
    //         this.allAccounts.forEach((acc: IFlattenAccountsResultItem) => {
    //             if (!accountList[acc?.uniqueName] && this.activeCompany && acc.currency === this.activeCompany?.baseCurrency) {
    //                 if (this.requestObj.voucherType === VOUCHERS.CONTRA) {
    //                     const isContraAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || pg?.uniqueName === 'currentliabilities' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft')));
    //                     const isDisallowedAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'dutiestaxes'));
    //                     if (isContraAccount && !isDisallowedAccount) {
    //                         accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
    //                         accountList[acc?.uniqueName] = true;
    //                     }
    //                 } else if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
    //                     let isReceiptAccount;

    //                     if (this.selectedTransactionType === 'to') {
    //                         isReceiptAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'sundrydebtors'));
    //                     } else {
    //                         isReceiptAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft') || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'sundrydebtors'));
    //                     }

    //                     const isDisallowedAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'dutiestaxes'));
    //                     if (isReceiptAccount && !isDisallowedAccount) {
    //                         accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
    //                         accountList[acc?.uniqueName] = true;
    //                     }
    //                 } else {
    //                     accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
    //                     accountList[acc?.uniqueName] = true;
    //                 }
    //             }
    //         });
    //         this.flattenAccounts = accList;
    //         this.inputForList = cloneDeep(this.flattenAccounts);
    //     }
    // }

    /**
     * Callback for adjusment popup close event
     *
     * @param {*} event
     * @memberof AccountAsVoucherComponent
     */
    // public handleEntries(event): void {
    //     this.receiptEntries = event.voucherAdjustments;
    //     this.totalEntries = (this.receiptEntries) ? this.receiptEntries.length : 0;
    //     this.adjustmentTransaction = event;
    //     // this.getTaxList();
    //     this.updateAdjustmentTypes("update");
    //     this.modalRef.hide();
    // }

    /**
     * This will get tax list
     *
     * @memberof AccountAsVoucherComponent
     */
    // public getTaxList(): void {
    //     this.store.pipe(select(companyStore => companyStore.company), takeUntil(this.destroyed$)).subscribe(res => {
    //         if (res) {
    //             if (res.taxes) {
    //                 let taxList: IOption[] = [];
    //                 Object.keys(res.taxes).forEach(key => {
    //                     taxList.push({ label: res.taxes[key].name, value: res.taxes[key]?.uniqueName });

    //                     this.taxList[res.taxes[key]?.uniqueName] = [];
    //                     this.taxList[res.taxes[key]?.uniqueName] = res.taxes[key];
    //                 });
    //                 this.taxListSource$ = observableOf(taxList);
    //             }
    //         } else {
    //             this.store.dispatch(this.companyActions.getTax());
    //         }
    //     });
    // }

    /**
     * This will get list of all pending invoices
     *
     * @memberof AccountAsVoucherComponent
     */
    // public getInvoiceListForReceiptVoucher(): void {
    //     let pendingInvoiceList: IOption[] = [];
    //     this.pendingInvoiceList = [];
    //     this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);

    //     this.salesService.getInvoiceList(this.pendingInvoicesListParams, dayjs(this.journalDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
    //         if (response && response.status === "success" && response.body && response.body.results && response.body.results.length > 0) {
    //             Object.keys(response.body.results).forEach(key => {
    //                 this.pendingInvoiceList[response.body.results[key]?.uniqueName] = [];
    //                 this.pendingInvoiceList[response.body.results[key]?.uniqueName] = response.body.results[key];

    //                 pendingInvoiceList.push({ label: response.body.results[key].voucherNumber + ", " + response.body.results[key].voucherDate + ", " + response.body.results[key].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr, value: response.body.results[key]?.uniqueName });
    //             });
    //             this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);
    //         }
    //     });
    // }

    /**
     * Callback for select tax in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    // public onSelectTax(event: any, entry: any): void {
    //     if (event && event.value) {
    //         entry.tax.name = this.taxList[event.value].name;
    //         entry.tax.percent = this.taxList[event.value].taxDetail[0].taxValue;

    //         if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
    //             entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
    //         } else {
    //             entry.tax.value = 0;
    //         }
    //     } else {
    //         entry.tax = {
    //             name: '',
    //             uniqueName: '',
    //             percent: 0,
    //             value: 0
    //         }
    //     }
    // }

    /**
     * Callback for select invoice in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    // public onSelectInvoice(event: any, entry: any): void {
    //     if (event && event.value) {
    //         entry.invoice = {
    //             number: this.pendingInvoiceList[event.value].voucherNumber,
    //             date: this.pendingInvoiceList[event.value].voucherDate,
    //             amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr,
    //             uniqueName: event.value,
    //             type: this.pendingInvoiceList[event.value].voucherType
    //         };
    //         if (this.pendingInvoiceList[event.value].balanceDue.amountForAccount < entry.amount) {
    //             this._toaster.clearAllToaster();
    //             this._toaster.errorToast(this.invoiceAmountErrorMessage);
    //         }
    //     } else {
    //         entry.invoice = {
    //             number: '',
    //             date: '',
    //             amount: 0,
    //             uniqueName: '',
    //             type: ''
    //         };
    //     }

    //     this.validateEntries(false);
    // }

    /**
     * This will remove the adjustment entry
     *
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    // public removeReceiptEntry(index: number): void {
    //     let receiptEntries = [];
    //     let loop = 0;
    //     this.receiptEntries.forEach(entry => {
    //         if (loop !== index) {
    //             receiptEntries.push(entry);
    //         }
    //         loop++;
    //     });

    //     this.receiptEntries = receiptEntries;
    //     this.totalEntries--;
    //     this.validateEntries(false);
    // }


    // public searchStock(str) {
    //     this.filterByText = str;
    //     // this.accountSearch = str;
    // }

    // public onStockBlur(qty) {
    //     this.selectedStk = qty;
    //     this.filterByText = '';
    //     this.showLedgerAccountList = false;
    // }

}