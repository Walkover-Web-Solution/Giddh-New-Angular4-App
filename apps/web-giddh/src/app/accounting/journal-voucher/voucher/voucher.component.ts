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
} from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TallyModuleService } from 'apps/web-giddh/src/app/accounting/tally-service';
import { cloneDeep, forEach, isEqual, sumBy, filter, find, without, maxBy, findIndex } from 'apps/web-giddh/src/app/lodash-optimized';
import * as dayjs from 'dayjs';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
import { PAGINATION_LIMIT, SubVoucher } from '../../../app.constant';
import { SearchService } from '../../../services/search.service';
import { VOUCHERS } from '../../constants/accounting.constant';
import { GeneralService } from '../../../services/general.service';

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

    @ViewChild('chequeEntryModal', { static: true }) public chequeEntryModal: ModalDirective;

    @ViewChild('particular', { static: false }) public accountField: ElementRef;
    @ViewChild('dateField', { static: true }) public dateField: ElementRef;
    @ViewChild('narrationBox', { static: true }) public narrationBox: ElementRef;
    @ViewChild('chequeNumberInput', { static: true }) public chequeNumberInput: ElementRef;
    @ViewChild('chequeClearanceInputField', { static: true }) public chequeClearanceInputField: ElementRef;
    @ViewChild('chqFormSubmitBtn', { static: true }) public chqFormSubmitBtn: ElementRef;
    @ViewChild('submitButton', { static: true }) public submitButton: ElementRef;
    @ViewChild('resetButton', { static: true }) public resetButton: ElementRef;

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

    constructor(
        private _ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private _keyboardService: KeyboardService,
        private _toaster: ToasterService,
        private router: Router,
        private tallyModuleService: TallyModuleService,
        private fb: UntypedFormBuilder,
        public bsConfig: BsDatepickerConfig,
        private salesAction: SalesActions,
        private searchService: SearchService,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService) {
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

        // this.requestObj.transactions = [];
        // const newTransactionFormGroup = this.initTransactionFormGroup();
        // (this.journalVoucherForm.get('transactions') as FormArray).push(newTransactionFormGroup);
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
                    default:
                        // TODO: Add other category cases as they are developed
                        break;
                }
                if (data.gridType === 'voucher') {
                    const voucherTypeControl = this.journalVoucherForm.get('voucherType');
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

    public ngOnInit() {
        const voucherTypeControl = this.journalVoucherForm.get('voucherType');
        voucherTypeControl.setValue(this.currentVoucher);
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.journalDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.dateEntered();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.currentCompanyUniqueName = activeCompany?.uniqueName;
            }
        });

        this.chequeDetailForm = this.fb.group({
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
            console.log(data);
            if (data) {
                // this.requestObj = cloneDeep(data);
            }
        });

        this.store.pipe(select(state => state?.ledger?.ledgerCreateInProcess), takeUntil(this.destroyed$)).subscribe((response: boolean) => {
            this.isLoading = (response) ? true : false;
        });

        this.store.pipe(select(p => p?.ledger?.ledgerCreateSuccess), takeUntil(this.destroyed$)).subscribe((s: boolean) => {
            if (s) {
                this._toaster.successToast(this.localeData?.entry_created, this.commonLocaleData?.app_success);
                this.refreshEntry();
                this.store.dispatch(this._ledgerActions.ResetLedger());
                this.journalVoucherForm.patchValue({
                    description: ''
                });
                this.dateField?.nativeElement?.focus();
            }
        });

        this.refreshEntry();

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
        this.createdAccountDetails$.subscribe((accountDetails) => {
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

    private initJournalVoucherForm(): void {
        // Initialize the form group with FormBuilder
        this.journalVoucherForm = this.fb.group({
            transactions: this.fb.array([
                this.initTransactionFormGroup()
            ]),
            voucherType: [null],
            entryDate: [null],
            description: [null]
        });

    }

    public initTransactionFormGroup(): FormGroup {
        return this.fb.group({
            amount: [null],
            particular: [null],
            currentBalance: [null],
            applyApplicableTaxes: [false],
            isInclusiveTax: [false],
            type: [null], // Provide a default value for 'type'
            taxes: [[]],
            total: [null],
            discounts: [[]],
            inventory: [[]],
            selectedAccount: this.fb.group({
                name: [null],
                UniqueName: [null],
                groupUniqueName: [null],
                account: [null],
                type: [null]
            })
        });
    }

    public ngOnChanges(c: SimpleChanges): void {
        if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
            this.showFromDatePicker = c.openDatePicker.currentValue;
            if (this.bsDatePickers) {
                this.bsDatePickers.first?.show();
            }
        }
        if ('openCreateAccountPopup' in c && c.openCreateAccountPopup.currentValue !== c.openCreateAccountPopup.previousValue) {
            if (c.openCreateAccountPopup.currentValue) {
                this.addNewAccount();
            }
        }
        if ('saveEntryOnCtrlA' in c && c.saveEntryOnCtrlA.currentValue !== c.saveEntryOnCtrlA.previousValue) {
            if (c.saveEntryOnCtrlA.currentValue) {
                this.saveEntry();
            }
        }
    }

    /**
     * newEntryObj() to push new entry object
     */
    public newEntryObj(byOrTo = 'to'): void {
        const newTransactionFormGroup = this.initTransactionFormGroup();
        newTransactionFormGroup.patchValue({
            amount: null,
            particular: '',
            currentBalance: '',
            applyApplicableTaxes: false,
            isInclusiveTax: false,
            type: byOrTo,
            taxes: [],
            total: null,
            discounts: [],
            inventory: [],
            selectedAccount: {
                name: '',
                UniqueName: '',
                groupUniqueName: '',
                account: '',
                type: ''
            }
        });

        // Push the new transaction FormGroup into the form array
        (this.journalVoucherForm.get('transactions') as FormArray).push(newTransactionFormGroup);

    }

    /**
     * initInventory
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
     * selectRow() on entryObj focus/blur
     */
    public selectRow(type: boolean, idx) {
        this.isSelectedRow = type;
        this.selectedIdx = idx;
        this.showLedgerAccountList = false;
    }

    /**
     * selectEntryType() to validate Type i.e BY/TO
     */
    public selectEntryType(transactionObj, val, idx) {
        val = val?.trim();
        if (val?.length === 2 && (val?.toLowerCase() !== 'to' && val?.toLowerCase() !== 'by')) {
            this._toaster.errorToast(this.localeData?.entry_type_error);
            transactionObj.type = 'to';
        } else {
            transactionObj.type = val;
        }
    }

    /**
     * onAccountFocus() to show accountList
     */
    public onAccountFocus(ev, elem, trxnType, indx) {
        this.selectedAccountInputField = ev.target;
        this.selectedField = 'account';
        this.showConfirmationBox = false;
        this.selectedTransactionType = trxnType;
        this.selectedParticular = elem;
        this.selectRow(true, indx);
        this.filterAccount(trxnType);
        this.inputForList = cloneDeep(this.flattenAccounts);
    }

    /**
     * onAccountBlur to hide accountList
     */
    public onAccountBlur(ev) {
        this.arrowInput = { key: 0 };
        // this.showStockList.next(true);
        if (this.accountSearch) {
            this.accountSearch = '';
        }

        // if (ev.type === 'blur') {
        //   this.showLedgerAccountList = false;
        //   this.showStockList = false;
        // }

        // this.showAccountList.emit(false);
    }



    public onDateFieldFocus() {
        setTimeout(() => {
            this.showLedgerAccountList = false;
            this.showStockList = false;
        }, 100);
    }


    public onSubmitChequeDetail() {
        const chequeDetails = this.chequeDetailForm?.value;

        // Update form group values
        this.journalVoucherForm.patchValue({
            chequeNumber: chequeDetails.chequeNumber,
            chequeClearanceDate: chequeDetails.chequeClearanceDate ?
                (typeof chequeDetails.chequeClearanceDate === "object" ?
                    dayjs(chequeDetails.chequeClearanceDate).format(GIDDH_DATE_FORMAT) :
                    dayjs(chequeDetails.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)) :
                ""
        });

        this.closeChequeDetailForm();

        setTimeout(() => {
            this.selectedParticular.focus();
        }, 10);
    }


    public closeChequeDetailForm() {
        this.chequeEntryModal.hide();
        this.focusDebitCreditAmount();
    }

    public openChequeDetailForm() {
        this.chequeEntryModal?.show();
        setTimeout(() => {
            this.chequeNumberInput?.nativeElement?.focus();
        }, 200);
    }

    public setAccount(acc) {
        this.searchService.loadDetails(acc?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            let transactionsFormArray;
            let transactionAtIndex;
            let transaction;
            if ((response?.body?.currency?.code || this.activeCompany?.baseCurrency) === this.activeCompany?.baseCurrency) {
                let openChequePopup = false;
                if (acc && acc.parentGroups.find((pg) => pg?.uniqueName === 'bankaccounts')) {
                    openChequePopup = true;
                    this.openChequeDetailForm();
                }
                let idx = this.selectedIdx;
                transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
                transactionAtIndex = transactionsFormArray.at(idx) as FormGroup;
                transaction = transactionAtIndex.value;

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
                        parentGroups: acc.parentGroups
                    };

                    // Update transaction form group with received data
                    transactionAtIndex.patchValue({
                        particular: accModel?.UniqueName,
                        currentBalance: '',
                        selectedAccount: {
                            name: accModel.name,
                            UniqueName: accModel.UniqueName,
                            groupUniqueName: accModel.groupUniqueName,
                            account: accModel.account,
                            type: ''
                        }
                    });

                    // Update other properties of 'transaction' if needed
                    transaction.particular = accModel?.UniqueName;
                    transaction.selectedAccount = accModel;
                    transaction.stocks = acc.stocks;
                    transaction.currentBalance = '';
                    transaction.selectedAccount.type = '';

                    // Tally difference amount
                    transaction.amount = transaction.amount ? transaction.amount : this.calculateDiffAmount(transaction.type);
                    transaction.amount = transaction.amount ? transaction.amount : null;

                    // Check and push to inventory
                    if (acc) {
                        this.groupUniqueName = accModel?.groupUniqueName;
                        this.selectAccUnqName = acc?.uniqueName;

                        let len = transaction.inventory ? transaction.inventory.length : 0;
                        if (!len || (transaction.inventory && transaction.inventory[len - 1].stock?.uniqueName)) {
                            transaction.inventory.push(this.initInventory());
                        }
                    }

                    if (openChequePopup === false) {
                        setTimeout(() => {
                            if (transaction.type === 'by') {
                                this.byAmountFields?.last?.nativeElement?.focus();
                            } else {
                                this.toAmountFields?.last?.nativeElement?.focus();
                            }
                        }, 200);
                    }
                    this.calModAmt(transaction.amount, transaction, idx);

                } else {
                    this.deleteRow(idx);
                }
            } else {
                this._toaster.infoToast(this.localeData?.foreign_account_error);
                // Reset transaction data in case of error
                transactionAtIndex.patchValue({
                    amount: null,
                    particular: '',
                    currentBalance: '',
                    applyApplicableTaxes: false,
                    isInclusiveTax: false,
                    type: transaction.type,
                    taxes: [],
                    total: null,
                    discounts: [],
                    inventory: [],
                    selectedAccount: {
                        name: '',
                        UniqueName: '',
                        groupUniqueName: '',
                        account: '',
                        type: ''
                    }
                });
            }
        });
    }


    /**
     * searchAccount in accountList
     */
    public searchAccount(event: KeyboardEvent, accountName: string) {
        if (event && !(event.shiftKey || event.key === 'Shift') && accountName) {
            this.filterByText = accountName;
            this.showLedgerAccountList = true;
            this.onAccountSearchQueryChanged(this.filterByText);
            // setTimeout(() => {
            //     this.showLedgerAccountList = true;
            // }, 200);
        }
    }

    public searchStock(str) {
        this.filterByText = str;
        // this.accountSearch = str;
    }

    public onStockBlur(qty) {
        this.selectedStk = qty;
        this.filterByText = '';
        this.showLedgerAccountList = false;
    }

    /**
     * Adds new entry
     *
     * @param {*} amount Amount of immediate previous entry
     * @param {*} transactionObj Transaction object of immediate previous entry
     * @param {number} entryIndex Entry index
     * @memberof AccountAsVoucherComponent
     */
    public addNewEntry(amount: any, transactionObj: any, entryIndex: number) {
        let index = entryIndex;
        // let reqField: any = document.getElementById(`first_element_${entryIndex - 1}`);
        // if (amount === 0 || amount === '0') {
        //     if (entryIndex === 0) {
        //         this.isFirstRowDeleted = true;
        //     } else {
        //         this.isFirstRowDeleted = false;
        //     }
        //     this.requestObj.transactions[index].currentBalance = '';
        //     this.requestObj.transactions[index].selectedAccount.type = '';
        //     this.requestObj.transactions.splice(index, 1);
        //     if (reqField === null) {
        //         this.dateField.nativeElement.focus();
        //     } else {
        //         reqField.focus();
        //     }
        //     if (!this.requestObj.transactions.length) {
        //         if (this.requestObj.voucherType === VOUCHERS.CONTRA) {
        //             this.newEntryObj('by');
        //         } else if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
        //             this.newEntryObj('to');
        //         }
        //     }
        // } else {
        this.calModAmt(amount, transactionObj, index);
        //}
    }

    public calModAmt(amount, transactionObj, indx) {
        transactionObj = transactionObj.value;
        let lastIndx = (this.journalVoucherForm.get('transactions') as FormArray).length - 1;

        // Update amount in transaction object
        transactionObj.amount = Number(amount);
        transactionObj.total = transactionObj.amount;

        let debitTransactions = (this.journalVoucherForm.get('transactions') as FormArray).controls.filter((control: AbstractControl) => control.get('type').value === 'by');
        this.totalDebitAmount = debitTransactions.reduce((acc: number, control: AbstractControl) => acc + Number(control.get('amount').value), 0);

        let creditTransactions = (this.journalVoucherForm.get('transactions') as FormArray).controls.filter((control: AbstractControl) => control.get('type').value === 'to');
        this.totalCreditAmount = creditTransactions.reduce((acc: number, control: AbstractControl) => acc + Number(control.get('amount').value), 0);

        if (indx === lastIndx && transactionObj.selectedAccount.name) {
            const voucherTypeControl = this.journalVoucherForm.get('voucherType');

            // Setting the value of voucherType FormControl to currentVoucher
            voucherTypeControl.setValue(this.currentVoucher);

            if (this.totalCreditAmount < this.totalDebitAmount || (this.totalCreditAmount === 0 && this.totalDebitAmount === 0)) {
                if (voucherTypeControl.value !== VOUCHERS.RECEIPT) {
                    this.newEntryObj('to');
                } else if (voucherTypeControl.value !== VOUCHERS.PAYMENT) {
                    this.newEntryObj('by');
                } else {
                    if ((this.journalVoucherForm.get('transactions') as FormArray).length === 1) {
                        this.newEntryObj('by');
                    }
                }
            } else if (this.totalDebitAmount < this.totalCreditAmount || (this.totalCreditAmount === 0 && this.totalDebitAmount === 0)) {
                this.newEntryObj('by');
            }
        }
    }



    /**
     * openConfirmBox() to save entry
     */
    public openConfirmBox(submitBtnEle: HTMLButtonElement): void {
        this.showLedgerAccountList = false;
        this.showStockList = false;

        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
        const totalDebitAmount = transactionsFormArray.controls.reduce((acc: number, control: AbstractControl) => {
            return control.get('type').value === 'by' ? acc + Number(control.get('amount').value) : acc;
        }, 0);

        const totalCreditAmount = transactionsFormArray.controls.reduce((acc: number, control: AbstractControl) => {
            return control.get('type').value === 'to' ? acc + Number(control.get('amount').value) : acc;
        }, 0);

        if (totalDebitAmount === totalCreditAmount) {
            this.showConfirmationBox = true;
            const descriptionControl = this.journalVoucherForm.get('description');
            if (descriptionControl?.value?.length > 1) {
                descriptionControl.setValue(descriptionControl.value.replace(/(?:\r\n|\r|\n)/g, ''));
                setTimeout(() => {
                    submitBtnEle.focus();
                }, 100);
            }
        } else {
            this._toaster.errorToast(this.localeData?.credit_debit_equal_error, this.commonLocaleData?.app_error);
            setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
    }


    /**
     * saveEntry
     */
    public saveEntry() {
        let data = cloneDeep(this.journalVoucherForm.value);
        console.log(this.journalVoucherForm.get('entryDate').value);
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
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
        if (!foundContraEntry && data.voucherType === VOUCHERS.CONTRA) {
            this._toaster.errorToast(this.localeData?.contra_entry_error, this.commonLocaleData?.app_error);
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }

        // This suggestion was given by Sandeep
        if (foundSalesAndBankEntry && data.voucherType === VOUCHERS.JOURNAL) {
            this._toaster.errorToast(this.localeData?.sales_purchase_entry_error, this.commonLocaleData?.app_error);
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

                    let voucherAdjustments = this.receiptEntries;
                    if (voucherAdjustments && voucherAdjustments.length > 0) {
                        let dataVoucherAdjustments = [];
                        let byEntry = data.transactions[1];
                        let totalTransactions = data.transactions?.length;
                        let adjustmentsCount = 0;

                        voucherAdjustments.forEach(adjustment => {
                            if (adjustment.type === AdjustmentTypesEnum.receipt || adjustment.type === AdjustmentTypesEnum.advanceReceipt) {
                                let taxAmount = 0;
                                let advanceReceiptAmount = 0;

                                if (adjustment.type === AdjustmentTypesEnum.advanceReceipt) {
                                    taxAmount = adjustment.tax?.value;
                                    advanceReceiptAmount = Number(adjustment.amount) - Number(taxAmount);
                                }

                                data.transactions[totalTransactions] = {
                                    advanceReceiptAmount: advanceReceiptAmount,
                                    amount: Number(adjustment.amount),
                                    applyApplicableTaxes: byEntry.applyApplicableTaxes,
                                    currentBalance: byEntry.applyApplicableTaxes,
                                    discounts: [],
                                    inventory: [],
                                    isInclusiveTax: byEntry.isInclusiveTax,
                                    particular: byEntry.particular,
                                    selectedAccount: byEntry.selectedAccount,
                                    stocks: null,
                                    tax: taxAmount,
                                    taxes: adjustment.tax?.uniqueName ? [adjustment.tax?.uniqueName] : [],
                                    total: Number(adjustment.amount),
                                    type: byEntry.type,
                                    subVoucher: (adjustment.type === AdjustmentTypesEnum.advanceReceipt) ? SubVoucher.AdvanceReceipt : ""
                                };
                                totalTransactions++;
                            } else {
                                dataVoucherAdjustments[adjustmentsCount] = this.pendingInvoiceList[adjustment.invoice?.uniqueName];
                                dataVoucherAdjustments[adjustmentsCount].adjustmentAmount = {
                                    amountForAccount: Number(adjustment.amount),
                                    amountForCompany: Number(adjustment.amount)
                                };
                                adjustmentsCount++;
                            }
                        });

                        if (dataVoucherAdjustments && dataVoucherAdjustments.length > 0) {
                            if (data.transactions[2]) {
                                data.transactions[2].voucherAdjustments = { adjustments: [] };
                                data.transactions[2].voucherAdjustments.adjustments = dataVoucherAdjustments;
                            }
                        }
                    }

                    data.transactions[1].type = "to"; // changing it to "to" so that it becomes debit in loop below
                }

                forEach(data.transactions, (element: any) => {
                    if (element) {
                        element.type = (element.type === 'by') ? 'credit' : 'debit';
                    }
                });
                let accUniqueName: string = maxBy(data.transactions, (o: any) => o.amount).selectedAccount?.UniqueName;
                let indexOfMaxAmountEntry = findIndex(data.transactions, (o: any) => o.selectedAccount?.UniqueName === accUniqueName);
                if (voucherTypeControl.value === VOUCHERS.RECEIPT) {
                    if (this.receiptEntries && this.receiptEntries.length > 0) {
                        data.transactions.splice(0, 2);
                    } else {
                        data.transactions.splice(0, 1);
                    }
                } else {
                    data.transactions.splice(indexOfMaxAmountEntry, 1);
                }
                data = this.tallyModuleService.prepareRequestForAPI(data);
                this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
            } else {
                const byOrTo = data.voucherType === 'Payment' ? 'by' : 'to';
                let message = this.localeData?.blank_account_error;
                message = message?.replace("[BY_TO]", byOrTo.toUpperCase());
                this._toaster.errorToast(message, this.commonLocaleData?.app_error);
                setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
            }
        } else {
            this._toaster.errorToast(this.localeData?.credit_debit_equal_error, this.commonLocaleData?.app_error);
            setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
    }
    public validateForContraEntry(data) {
        const debitEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'by' && trxn.selectedAccount && trxn.selectedAccount?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft')))));
        const creditEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'to' && trxn.selectedAccount && trxn.selectedAccount?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft')))));

        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        } else {
            return false;
        }
    }

    public validateForSalesAndPurchaseEntry(data) {
        const debitEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'by' && trxn.selectedAccount && trxn.selectedAccount?.parentGroups.find((pg) => (pg?.uniqueName === 'revenuefromoperations' || pg?.uniqueName === 'currentassets' || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'purchases' || pg?.uniqueName === 'directexpenses'))));
        const creditEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'to' && trxn.selectedAccount && trxn.selectedAccount?.parentGroups.find((pg) => (pg?.uniqueName === 'revenuefromoperations' || pg?.uniqueName === 'currentassets' || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'purchases' || pg?.uniqueName === 'directexpenses'))));

        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        } else {
            return false;
        }
    }

    public validatePaymentAndReceipt(data): boolean {
        if (data.voucherType === 'payment' || data.voucherType === 'receipt') {
            const byAccounts = data.transactions?.filter(acc => acc.type === 'by');
            const toAccounts = data.transactions?.filter(acc => acc.type === 'to');

            let isValid = false;

            if (data.voucherType === 'payment') {
                isValid = byAccounts?.some(acc => {
                    const indexOfAccountParentGroups = acc.selectedAccount?.parentGroups?.findIndex(pg => ['sundrydebtors', 'sundrycreditors', 'tdsreceivable'].includes(pg?.uniqueName));
                    return indexOfAccountParentGroups !== -1;
                });

                if (!isValid) {
                    isValid = toAccounts?.some(acc => {
                        const indexOfAccountParentGroups = acc.selectedAccount?.parentGroups?.findIndex(pg => ['cash', 'bankaccounts', 'loanandoverdraft', 'tdspayable'].includes(pg?.uniqueName));
                        return indexOfAccountParentGroups !== -1;
                    });
                }
            }

            if (data.voucherType === 'receipt') {
                isValid = byAccounts?.some(acc => {
                    const indexOfAccountParentGroups = acc.selectedAccount?.parentGroups?.findIndex(pg => ['bankaccounts', 'cash', 'loanandoverdraft', 'tdsreceivable'].includes(pg?.uniqueName));
                    return indexOfAccountParentGroups !== -1;
                });

                if (!isValid) {
                    isValid = toAccounts?.some(acc => {
                        const indexOfAccountParentGroups = acc.selectedAccount?.parentGroups?.findIndex(pg => ['tcspayable', 'sundrycreditors', 'sundrydebtors'].includes(pg?.uniqueName));
                        return indexOfAccountParentGroups !== -1;
                    });
                }
            }

            return isValid;
        } else {
            return true; // Bypass all other cases
        }
    }


    public refreshEntry() {
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

        // Set entry date
        this.journalVoucherForm.patchValue({
            entryDate: dayjs().format(GIDDH_DATE_FORMAT),
            description: ''
        });

        // Set journal date
        if (this.universalDate[1]) {
            this.journalDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        } else {
            this.journalDate = dayjs().format(GIDDH_DATE_FORMAT);
        }
        this.dateEntered();

        // Add new entry object
        this.newEntryObj();

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

                default:
                    firstTransaction.patchValue({ type: 'by' });
                    break;
            }
        }, 100);
    }


    /**
     * after init
     */
    public ngAfterViewInit() {
        this.isComponentLoaded = true;
        this.chequeEntryModal.onHidden.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.focusDebitCreditAmount();
        });
        setTimeout(() => {
            this.isNoAccFound = false;
        }, 3000);
    }

    /**
     * ngOnDestroy() on component destroy
     */
    public ngOnDestroy() {
        if (this.modalRef) {
            this.modalRef.hide();
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * setDate
     */
    public setDate(date) {
        this.showFromDatePicker = !this.showFromDatePicker;
        this.journalVoucherForm.patchValue({
            entryDate: dayjs(date).format(GIDDH_DATE_FORMAT)
        });
    }

    /**
     * watchMenuEvent
     */
    public watchKeyboardEvent(event) {
        if (event) {
            let navigateTo = find(this.navigateURL, (o: any) => o.code === event.key);
            if (navigateTo) {
                this.router.navigate(['accounting', navigateTo.route]);
            }
        }
    }

    /**
     * removeBlankTransaction
     */
    public removeBlankTransaction(transactions) {
        forEach(transactions, function (obj: any, idx) {
            if (obj && !obj.particular && !obj.amount) {
                transactions = without(transactions, obj);
            }
        });
        return transactions;
    }

    /**
     * validateTransaction
     */
    public validateTransaction(transactions) {
        let validEntry = this.removeBlankTransaction(transactions);
        let entryIsValid = true;
        validEntry.forEach(obj => {
            if (obj.particular && !obj.amount) {
                obj.amount = 0;
            } else if (obj && !obj.particular) {
                entryIsValid = false;
                return false;
            }
        });

        if (entryIsValid) {
            return validEntry;
        } else {
            this._toaster.errorToast(this.localeData?.blank_particular_error);
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }

    }

    public filterAccount(byOrTo: string) {
        if (byOrTo) {
            this.tallyModuleService.selectedFieldType.next(byOrTo);
        }
    }

    public detectKey(ev: KeyboardEvent) {
        this.keyUpDownEvent = ev;
        //  if (ev.keyCode === 27) {
        //   this.deleteRow(this.selectedIdx);
        //  }
        //  if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
        //   this.arrowInput = { key: ev.keyCode };
        //  }
    }

    public dateEntered() {
        const date = (typeof this.journalDate === "object") ? dayjs(this.journalDate).format("dddd") : dayjs(this.journalDate, GIDDH_DATE_FORMAT).format("dddd");
        this.displayDay = (date !== 'Invalid date') ? date : '';
        this.changeDetectionRef.detectChanges();
    }

    public validateAccount(transactionObj: FormGroup, ev: KeyboardEvent, idx: number) {
        if (!ev.shiftKey) {
            const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;
            const lastIndx = transactionsFormArray.length - 1;

            if (idx === lastIndx) {
                return;
            }

            if (!transactionObj.get('selectedAccount.account').value) {
                transactionObj.patchValue({
                    selectedAccount: {},
                    amount: 0,
                    inventory: []
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
    }


    public onItemSelected(ev: IOption) {
        setTimeout(() => {
            this.currentSelectedValue = '';
            this.showLedgerAccountList = false;
        }, 200);
        if (ev?.value === 'createnewitem') {
            return this.addNewAccount();
        }
        if (this.selectedField === 'account') {
            this.setAccount(ev.additional);
        }
        //else if (this.selectedField === 'stock') {
        //     this.onSelectStock(ev.additional);
        // }
    }



    public onCheckNumberFieldKeyDown(event, fieldType: string, datePickerField: BsDatepickerDirective) {
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
                    if (!event.shiftKey) {
                        this.chqFormSubmitBtn?.nativeElement?.focus();
                    }
                }
            }, 100);
        }
    }

    public keyUpOnSubmitButton(e) {
        if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
            return setTimeout(() => this.resetButton?.nativeElement?.focus(), 50);
        }
        if (e && (e.keyCode === 8 || e.which === 8)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 50);
        }
    }

    public keyUpOnResetButton(e) {
        if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
            return setTimeout(() => this.submitButton?.nativeElement?.focus(), 50);
        }
        if (e && (e.keyCode === 13 || e.which === 13)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 50);
        }
    }

    public onNoAccountFound(ev: boolean) {
        if (ev && this.isComponentLoaded) {
            this.isNoAccFound = true;
        }
    }

    private deleteRow(idx: number) {
        const transactionsFormArray = this.journalVoucherForm.get('transactions') as FormArray;

        // Remove transaction at the specified index from the form array
        transactionsFormArray.removeAt(idx);

        if (!idx) {
            // If the deleted row was the first row, add a new entry object and set its type to 'by'
            this.newEntryObj();
            const firstTransaction = transactionsFormArray.at(0) as FormGroup;
            firstTransaction.patchValue({ type: 'by' });
        }
    }


    private calculateDiffAmount(type) {
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
            });
        } else {
            this.inputForList = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
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
    // Iske bd k functions accounting.component.ts file m h
}
