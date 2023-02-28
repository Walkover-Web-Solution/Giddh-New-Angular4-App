import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    TemplateRef,
    Component,
    ComponentFactoryResolver,
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TallyModuleService } from 'apps/web-giddh/src/app/accounting/tally-service';
import { cloneDeep, forEach, isEqual, sumBy, filter, find, without, maxBy, findIndex } from 'apps/web-giddh/src/app/lodash-optimized';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import * as dayjs from 'dayjs';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, ReplaySubject, of as observableOf, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { SalesActions } from '../../../actions/sales/sales.action';
import { AccountResponse, AddAccountRequest, UpdateAccountRequest } from '../../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';
import { QuickAccountComponent } from '../../../theme/quick-account-component/quickAccount.component';
import { KeyboardService } from '../../keyboard.service';
import { KEYS } from '../journal-voucher.component';
import { adjustmentTypes, AdjustmentTypesEnum } from "../../../shared/helpers/adjustmentTypes";
import { SalesService } from '../../../services/sales.service';
import { CompanyActions } from '../../../actions/company.actions';
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
    public requestObj: any = {};
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

    public chequeDetailForm: FormGroup;
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

    constructor(
        private _ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private _keyboardService: KeyboardService,
        private _toaster: ToasterService,
        private router: Router,
        private tallyModuleService: TallyModuleService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private inventoryService: InventoryService,
        private fb: FormBuilder,
        public bsConfig: BsDatepickerConfig,
        private salesAction: SalesActions,
        private modalService: BsModalService,
        private salesService: SalesService,
        private searchService: SearchService,
        private companyActions: CompanyActions,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService) {

        this.universalDate$ = this.store.pipe(select(sessionStore => sessionStore.session.applicationDate), takeUntil(this.destroyed$));

        this.createdAccountDetails$ = combineLatest([
            this.store.pipe(select(appState => appState.sales.createAccountSuccess)),
            this.store.pipe(select(appState => appState.sales.createdAccountDetails))
        ]).pipe(debounceTime(0), takeUntil(this.destroyed$));

        this.store.pipe(select(profileStore => profileStore.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });
        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;

        this.requestObj.transactions = [];
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
                this.currentVoucher = data.page;
                switch (this.currentVoucher) {
                    case VOUCHERS.CONTRA:
                        // Contra allows cash or bank so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    case VOUCHERS.RECEIPT:
                        // Receipt allows cash/bank/sundry debtors/sundry creditors so selecting default category as currentassets
                        this.categoryOfAccounts = 'currentassets';
                        break;
                    default:
                        // TODO: Add other category cases as they are developed
                        break;
                }
                if (data.gridType === 'voucher') {
                    this.requestObj.voucherType = this.currentVoucher;
                    this.resetEntriesIfVoucherChanged();
                    setTimeout(() => {
                        this.dateField?.nativeElement?.focus();
                    }, 50);
                } else {
                    this.resetEntriesIfVoucherChanged();
                    this.tallyModuleService.requestData.next(this.requestObj);
                }

            }
        });
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.requestObj.voucherType = this.currentVoucher;
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
            if (data) {
                this.requestObj = cloneDeep(data);
            }
        });

        this.store.pipe(select(state => state?.ledger?.ledgerCreateInProcess), takeUntil(this.destroyed$)).subscribe((response:boolean) => {
                this.isLoading = (response) ? true : false;
        });

        this.store.pipe(select(p => p?.ledger?.ledgerCreateSuccess), takeUntil(this.destroyed$)).subscribe((s: boolean) => {
            if (s) {
                this._toaster.successToast(this.localeData?.entry_created, this.commonLocaleData?.app_success);
                this.refreshEntry();
                this.store.dispatch(this._ledgerActions.ResetLedger());
                this.requestObj.description = '';
                this.dateField?.nativeElement?.focus();
            }
        });

        this.refreshEntry();

        this.createStockSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(yesOrNo => {
            if (yesOrNo) {
                this.asideMenuStateForProductService = 'out';
                this.autoFocusStockGroupField = false;
                this.getStock(null, null, true);
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
            this.searchAccount(event, event.target?.value);
        });

        this.amountErrorMessage = this.localeData?.total_amount_error;
        this.invoiceAmountErrorMessage = this.localeData?.invoice_amount_error;
        this.invalidAmountErrorMessage = this.localeData?.invalid_amount_error;
        this.invoiceErrorMessage = this.localeData?.invoice_error;
        this.entryAmountErrorMessage = this.localeData?.entry_amount_error;
    }

    public ngOnChanges(c: SimpleChanges) {
        if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
            this.showFromDatePicker = c.openDatePicker.currentValue;
            if (this.bsDatePickers) {
                this.bsDatePickers.first.show();
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
    public newEntryObj(byOrTo = 'to') {
        this.requestObj.transactions.push({
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

    public onStockFocus(ev, stockIndx: number, indx: number) {
        this.selectedStockInputField = ev.target;
        this.showConfirmationBox = false;
        this.selectedStockIdx = stockIndx;
        this.selectedIdx = indx;
        this.getStock(this.groupUniqueName);
        this.getStock();
        this.showLedgerAccountList = true;
        setTimeout(() => {
            this.selectedField = 'stock';
        }, 100);
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

    public openCreateAccountPopupIfRequired(e) {
        if (e && this.isNoAccFound) {
            // this.showQuickAccountModal();
        }
    }

    public onDateFieldFocus() {
        setTimeout(() => {
            this.showLedgerAccountList = false;
            this.showStockList = false;
        }, 100);
    }

    public onAmountFieldBlur(ev) {
        //
    }

    public onSubmitChequeDetail() {
        const chequeDetails = this.chequeDetailForm?.value;
        this.requestObj.chequeNumber = chequeDetails.chequeNumber;
        this.requestObj.chequeClearanceDate = (chequeDetails.chequeClearanceDate) ? (typeof chequeDetails.chequeClearanceDate === "object") ? dayjs(chequeDetails.chequeClearanceDate).format(GIDDH_DATE_FORMAT) : dayjs(chequeDetails.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT) : "";
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
        this.chequeEntryModal.show();
        setTimeout(() => {
            this.chequeNumberInput?.nativeElement?.focus();
        }, 200);
    }

    /**
     * setAccount` in particular, on accountList click
     */
    public setAccount(acc) {
        this.searchService.loadDetails(acc?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if ((response?.body?.currency?.code || this.activeCompany?.baseCurrency) === this.activeCompany?.baseCurrency) {
                let openChequePopup = false;
                if (acc && acc.parentGroups.find((pg) => pg?.uniqueName === 'bankaccounts')) {
                    openChequePopup = true;
                    this.openChequeDetailForm();
                }
                let idx = this.selectedIdx;
                let transaction = this.requestObj.transactions[idx];
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
                    transaction.particular = accModel?.UniqueName;
                    transaction.selectedAccount = accModel;
                    transaction.stocks = acc.stocks;
                    transaction.currentBalance = '';
                    transaction.selectedAccount.type = '';

                    // tally difference amount
                    transaction.amount = transaction.amount ? transaction.amount : this.calculateDiffAmount(transaction.type);
                    transaction.amount = transaction.amount ? transaction.amount : null;

                    if (acc) {
                        this.groupUniqueName = accModel?.groupUniqueName;
                        this.selectAccUnqName = acc?.uniqueName;

                        let len = this.requestObj.transactions[idx].inventory ? this.requestObj.transactions[idx].inventory.length : 0;
                        if (!len || this.requestObj.transactions[idx].inventory && this.requestObj.transactions[idx].inventory[len - 1].stock?.uniqueName) {
                            this.requestObj.transactions[idx].inventory.push(this.initInventory());
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
                this.requestObj.transactions[this.selectedIdx] = {
                    amount: null,
                    particular: '',
                    currentBalance: '',
                    applyApplicableTaxes: false,
                    isInclusiveTax: false,
                    type: this.requestObj.transactions[this.selectedIdx].type,
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
                }
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
        let lastIndx = this.requestObj.transactions?.length - 1;
        transactionObj.amount = Number(amount);
        transactionObj.total = transactionObj.amount;

        let debitTransactions = filter(this.requestObj.transactions, (o: any) => o.type === 'by');
        this.totalDebitAmount = sumBy(debitTransactions, (o: any) => Number(o.amount));
        let creditTransactions = filter(this.requestObj.transactions, (o: any) => o.type === 'to');
        this.totalCreditAmount = sumBy(creditTransactions, (o: any) => Number(o.amount));
        if (indx === lastIndx && this.requestObj.transactions[indx].selectedAccount.name) {
            if (this.totalCreditAmount < this.totalDebitAmount || (this.totalCreditAmount === 0 && this.totalDebitAmount === 0)) {
                if (this.requestObj.voucherType !== VOUCHERS.RECEIPT) {
                    this.newEntryObj('to');
                } else {
                    if (this.requestObj.transactions?.length === 1) {
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
    public openConfirmBox(submitBtnEle: HTMLButtonElement) {
        this.showLedgerAccountList = false;
        this.showStockList = false;
        if (this.totalDebitAmount === this.totalCreditAmount) {
            this.showConfirmationBox = true;
            if (this.requestObj.description?.length > 1) {
                this.requestObj.description = this.requestObj.description?.replace(/(?:\r\n|\r|\n)/g, '');
                setTimeout(() => {
                    submitBtnEle.focus();
                }, 100);
            }
        } else {
            this._toaster.errorToast(this.localeData?.credit_debit_equal_error, this.commonLocaleData?.app_error);
            return setTimeout(() => this.narrationBox?.nativeElement?.focus(), 500);
        }
    }

    /**
     * saveEntry
     */
    public saveEntry() {
        let data = cloneDeep(this.requestObj);
        data.entryDate = (typeof this.journalDate === "object") ? dayjs(this.journalDate).format(GIDDH_DATE_FORMAT) : dayjs(this.journalDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
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

                if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
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
                if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
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
                const byOrTo = data.voucherType === 'Payment' ? 'to' : 'by';
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

    public validatePaymentAndReceipt(data) {
        if (data.voucherType === VOUCHERS.PAYMENT || data.voucherType === VOUCHERS.RECEIPT) {
            const byOrTo = data.voucherType === VOUCHERS.PAYMENT ? 'to' : 'by';
            const toAccounts = data.transactions?.filter((acc) => acc.type === byOrTo);
            const AccountOfCashOrBank = toAccounts?.filter((acc) => {
                const indexOfCashOrBank = acc.selectedAccount?.parentGroups?.findIndex((pg) => pg?.uniqueName === 'cash' || pg?.uniqueName === 'bankaccounts' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft'));
                return indexOfCashOrBank !== -1 ? true : false;
            });
            return (AccountOfCashOrBank && AccountOfCashOrBank.length) ? true : false;
        } else {
            return true; // By pass all other
        }
    }

    /**
     * refreshEntry
     */
    public refreshEntry() {
        this.requestObj.transactions = [];
        this.showConfirmationBox = false;
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.receiptEntries = [];
        this.totalEntries = 0;
        this.adjustmentTransaction = {};
        this.requestObj.entryDate = dayjs().format(GIDDH_DATE_FORMAT);
        if (this.universalDate[1]) {
            this.journalDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        } else {
            this.journalDate = dayjs().format(GIDDH_DATE_FORMAT);
        }
        this.dateEntered();
        this.requestObj.description = '';
        setTimeout(() => {
            this.newEntryObj();

            switch (this.currentVoucher) {
                case VOUCHERS.CONTRA:
                    this.requestObj.transactions[0].type = 'by';
                    break;

                case VOUCHERS.RECEIPT:
                    this.requestObj.transactions[0].type = 'to';
                    break;

                default:
                    this.requestObj.transactions[0].type = 'by';
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
        this.requestObj.entryDate = dayjs(date).format(GIDDH_DATE_FORMAT);
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

    /**
     * openStockList
     */
    public openStockList() {
        this.showLedgerAccountList = false;
        this.showStockList = true;
        // this.showStockList.next(true);
    }

    /**
     * onSelectStock
     */
    public onSelectStock(item) {
        if (item) {
            let idx = this.selectedStockIdx;
            let entryItem = cloneDeep(item);
            this.prepareEntry(entryItem, this.selectedIdx);
            // setTimeout(() => {
            //   this.selectedStk.focus();
            //   this.showStockList = false;
            // }, 50);
        } else {
            this.requestObj.transactions[this.selectedIdx].inventory.splice(this.selectedStockIdx, 1);
        }
    }

    /**
     * prepareEntry
     */
    public prepareEntry(item, idx) {
        let i = this.selectedStockIdx;
        if (item && item.stockUnit) {
            let defaultUnit = {
                stockUnitCode: item.stockUnit.name,
                code: item.stockUnit.code,
                rate: 0
            };

            // this.requestObj.transactions[idx].inventory[i].unit.rate = item.rate;

            //Check if the Unit is initialized

            if (this.requestObj.transactions[idx].inventory[i].unit) {
                this.requestObj.transactions[idx].inventory[i].unit.rate = item.amount / item.openingQuantity; // Kunal
                this.requestObj.transactions[idx].inventory[i].unit.code = item.stockUnit.code;
                this.requestObj.transactions[idx].inventory[i].unit.stockUnitCode = item.stockUnit.name;
            }

            // this.requestObj.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
            this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item?.uniqueName };
            // this.requestObj.transactions[idx].selectedAccount?.uniqueName = item.accountStockDetails.accountUniqueName;
            this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
        }

    }

    /**
     * changePrice
     */
    public changePrice(idx, val) {
        let i = this.selectedIdx;
        this.requestObj.transactions[i].inventory[idx].unit.rate = !Number.isNaN(val) ? Number(cloneDeep(val)) : 0;
        this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(2));
        this.amountChanged(idx);
    }

    public amountChanged(invIdx) {
        let i = this.selectedIdx;
        if (this.requestObj.transactions && this.requestObj.transactions[i].inventory[invIdx].stock && this.requestObj.transactions[i].inventory[invIdx].quantity) {
            this.requestObj.transactions[i].inventory[invIdx].unit.rate = Number((this.requestObj.transactions[i].inventory[invIdx].amount / this.requestObj.transactions[i].inventory[invIdx].quantity).toFixed(2));
        }
        let total = this.calculateTransactionTotal(this.requestObj.transactions[i].inventory);
        this.requestObj.transactions[i].total = total;
        this.requestObj.transactions[i].amount = total;
    }

    /**
     * calculateTransactionTotal
     */
    public calculateTransactionTotal(inventory) {
        let total = 0;
        inventory.forEach((inv) => {
            total = total + Number(inv.amount);
        });
        return total;
    }

    public changeQuantity(idx, val) {
        let i = this.selectedIdx;
        this.requestObj.transactions[i].inventory[idx].quantity = Number(val);
        this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(2));
        this.amountChanged(idx);
    }

    public validateAndAddNewStock(idx) {
        let i = this.selectedIdx;
        if (this.requestObj.transactions[i]?.inventory?.length - 1 === idx) {
            this.requestObj.transactions[i].inventory.push(this.initInventory());
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

    /**
     * validateAccount
     */
    public validateAccount(transactionObj, ev, idx) {
        if (!ev.shiftKey) {
            let lastIndx = this.requestObj.transactions?.length - 1;
            if (idx === lastIndx) {
                return;
            }
            if (!transactionObj.selectedAccount.account) {
                transactionObj.selectedAccount = {};
                transactionObj.amount = 0;
                transactionObj.inventory = [];
                if (idx) {
                    this.requestObj.transactions.splice(idx, 1);
                } else {
                    ev.preventDefault();
                }
                return;
            }
            if (transactionObj.selectedAccount.account !== transactionObj.selectedAccount.name) {
                let message = this.localeData?.no_account_found;
                message = message?.replace("[ACCOUNT]", transactionObj.selectedAccount.account);
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
        } else if (this.selectedField === 'stock') {
            this.onSelectStock(ev.additional);
        }
    }

    /**
     * getStock
     */
    public getStock(parentGrpUnqName?, q?: string, forceRefresh: boolean = false, needToFocusStockInputField: boolean = false) {
        if (this.allStocks && this.allStocks.length && !forceRefresh) {
            // this.inputForList = cloneDeep(this.allStocks);
            this.sortStockItems(cloneDeep(this.allStocks));
        } else {
            this.inventoryService.GetStocks().pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data?.status === 'success') {
                    this.allStocks = cloneDeep(data.body.results);
                    this.sortStockItems(this.allStocks);
                    if (needToFocusStockInputField) {
                        this.selectedStockInputField.value = '';
                        this.selectedStockInputField.focus();
                    }
                    // this.inputForList = cloneDeep(this.allStocks);
                } else {
                    // this.noResult = true;
                }
            });
        }
    }

    /**
     * sortStockItems
     */
    public sortStockItems(ItemArr) {
        let stockAccountArr: IOption[] = [];
        forEach(ItemArr, (obj: any) => {
            stockAccountArr.push({
                label: `${obj.name} (${obj?.uniqueName})`,
                value: obj?.uniqueName,
                additional: obj
            });
        });
        this.stockList = stockAccountArr;
        this.inputForList = cloneDeep(this.stockList);
    }

    public loadQuickAccountComponent() {
        if (this.quickAccountModal && this.quickAccountModal.config) {
            this.quickAccountModal.config.backdrop = false;
        }
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
        let viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let componentInstance = componentRef.instance as QuickAccountComponent;
        componentInstance.needAutoFocus = true;
        componentInstance.closeQuickAccountModal.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            this.hideQuickAccountModal();
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
            this.isNoAccFound = false;
            this.dateField?.nativeElement?.focus();
        });
    }

    public showQuickAccountModal() {
        // let selectedField = window.document.querySelector('input[onReturn][type="text"][data-changed="true"]');
        // this.selectedAccountInputField = selectedField;
        if (this.selectedField === 'account') {
            this.loadQuickAccountComponent();
            this.quickAccountModal.show();
        } else if (this.selectedField === 'stock') {
            this.asideMenuStateForProductService = 'in';
            this.autoFocusStockGroupField = true;
        }
    }

    public hideQuickAccountModal() {
        this.quickAccountModal.hide();
        this.dateField?.nativeElement?.focus();
        return setTimeout(() => {
            this.selectedAccountInputField.value = '';
            this.selectedAccountInputField.focus();
        }, 200);
    }

    public closeCreateStock() {
        this.asideMenuStateForProductService = 'out';
        this.autoFocusStockGroupField = false;
        // after creating stock, get all stocks again
        this.filterByText = '';
        this.dateField?.nativeElement?.focus();
        this.getStock(null, null, true, true);
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
                    datePickerField.show();
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
        this.requestObj.transactions.splice(idx, 1);
        if (!idx) {
            this.newEntryObj();
            this.requestObj.transactions[0].type = 'by';
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
     * This will create list of accounts depending on voucher type
     *
     * @memberof AccountAsVoucherComponent
     */
    public createAccountsList(): void {
        if (this.allAccounts) {
            let accList: IOption[] = [];
            let accountList = [];
            this.allAccounts.forEach((acc: IFlattenAccountsResultItem) => {
                if (!accountList[acc?.uniqueName] && this.activeCompany && acc.currency === this.activeCompany?.baseCurrency) {
                    if (this.requestObj.voucherType === VOUCHERS.CONTRA) {
                        const isContraAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || pg?.uniqueName === 'currentliabilities' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft')));
                        const isDisallowedAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'dutiestaxes'));
                        if (isContraAccount && !isDisallowedAccount) {
                            accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
                            accountList[acc?.uniqueName] = true;
                        }
                    } else if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
                        let isReceiptAccount;

                        if (this.selectedTransactionType === 'to') {
                            isReceiptAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'sundrydebtors'));
                        } else {
                            isReceiptAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft') || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'sundrydebtors'));
                        }

                        const isDisallowedAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'dutiestaxes'));
                        if (isReceiptAccount && !isDisallowedAccount) {
                            accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
                            accountList[acc?.uniqueName] = true;
                        }
                    } else {
                        accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
                        accountList[acc?.uniqueName] = true;
                    }
                }
            });
            this.flattenAccounts = accList;
            this.inputForList = cloneDeep(this.flattenAccounts);
        }
    }

    /**
     * This will reset the entries if voucher type changed
     *
     * @memberof AccountAsVoucherComponent
     */
    public resetEntriesIfVoucherChanged(): void {
        if (this.requestObj && this.previousVoucherType !== this.requestObj.voucherType) {
            this.previousVoucherType = this.requestObj.voucherType;
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
        if (this.requestObj?.transactions[this.selectedIdx]?.type === 'by') {
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
        if (balanceData.closingBalance) {
            this.requestObj.transactions[index].currentBalance = balanceData.closingBalance.amount;
            this.requestObj.transactions[index].selectedAccount.type = balanceData.closingBalance.type;
        }
    }

    /**
     * Callback for adjusment popup close event
     *
     * @param {*} event
     * @memberof AccountAsVoucherComponent
     */
    public handleEntries(event): void {
        this.receiptEntries = event.voucherAdjustments;
        this.totalEntries = (this.receiptEntries) ? this.receiptEntries.length : 0;
        this.adjustmentTransaction = event;
        this.getTaxList();
        this.updateAdjustmentTypes("update");
        this.modalRef.hide();
    }

    /**
     * This will get tax list
     *
     * @memberof AccountAsVoucherComponent
     */
    public getTaxList(): void {
        this.store.pipe(select(companyStore => companyStore.company), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.taxes) {
                    let taxList: IOption[] = [];
                    Object.keys(res.taxes).forEach(key => {
                        taxList.push({ label: res.taxes[key].name, value: res.taxes[key]?.uniqueName });

                        this.taxList[res.taxes[key]?.uniqueName] = [];
                        this.taxList[res.taxes[key]?.uniqueName] = res.taxes[key];
                    });
                    this.taxListSource$ = observableOf(taxList);
                }
            } else {
                this.store.dispatch(this.companyActions.getTax());
            }
        });
    }

    /**
     * This will get list of all pending invoices
     *
     * @memberof AccountAsVoucherComponent
     */
    public getInvoiceListForReceiptVoucher(): void {
        let pendingInvoiceList: IOption[] = [];
        this.pendingInvoiceList = [];
        this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);

        this.salesService.getInvoiceList(this.pendingInvoicesListParams, dayjs(this.journalDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body && response.body.results && response.body.results.length > 0) {
                Object.keys(response.body.results).forEach(key => {
                    this.pendingInvoiceList[response.body.results[key]?.uniqueName] = [];
                    this.pendingInvoiceList[response.body.results[key]?.uniqueName] = response.body.results[key];

                    pendingInvoiceList.push({ label: response.body.results[key].voucherNumber + ", " + response.body.results[key].voucherDate + ", " + response.body.results[key].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr, value: response.body.results[key]?.uniqueName });
                });
                this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);
            }
        });
    }

    /**
     * Callback for select tax in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    public onSelectTax(event: any, entry: any): void {
        if (event && event.value) {
            entry.tax.name = this.taxList[event.value].name;
            entry.tax.percent = this.taxList[event.value].taxDetail[0].taxValue;

            if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
                entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
            } else {
                entry.tax.value = 0;
            }
        } else {
            entry.tax = {
                name: '',
                uniqueName: '',
                percent: 0,
                value: 0
            }
        }
    }

    /**
     * Callback for select invoice in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    public onSelectInvoice(event: any, entry: any): void {
        if (event && event.value) {
            entry.invoice = {
                number: this.pendingInvoiceList[event.value].voucherNumber,
                date: this.pendingInvoiceList[event.value].voucherDate,
                amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr,
                uniqueName: event.value,
                type: this.pendingInvoiceList[event.value].voucherType
            };
            if (this.pendingInvoiceList[event.value].balanceDue.amountForAccount < entry.amount) {
                this._toaster.clearAllToaster();
                this._toaster.errorToast(this.invoiceAmountErrorMessage);
            }
        } else {
            entry.invoice = {
                number: '',
                date: '',
                amount: 0,
                uniqueName: '',
                type: ''
            };
        }

        this.validateEntries(false);
    }

    /**
     * This will remove the adjustment entry
     *
     * @param {number} index
     * @memberof AccountAsVoucherComponent
     */
    public removeReceiptEntry(index: number): void {
        let receiptEntries = [];
        let loop = 0;
        this.receiptEntries.forEach(entry => {
            if (loop !== index) {
                receiptEntries.push(entry);
            }
            loop++;
        });

        this.receiptEntries = receiptEntries;
        this.totalEntries--;
        this.validateEntries(false);
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
     * This will add new row for adjusment
     *
     * @memberof AccountAsVoucherComponent
     */
    public addNewAdjustmentEntry(): void {
        if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && parseFloat(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
            let getAdjustmentTypes = this.prepareAdjustmentTypes(this.totalEntries);

            this.receiptEntries[this.totalEntries] = {
                allowedTypes: getAdjustmentTypes,
                type: (this.advanceReceiptExists) ? AdjustmentTypesEnum.advanceReceipt : AdjustmentTypesEnum.receipt,
                //note: '',
                tax: {
                    name: '',
                    uniqueName: '',
                    percent: 0,
                    value: 0
                },
                invoice: {
                    number: '',
                    date: '',
                    amount: 0,
                    uniqueName: '',
                    type: ''
                },
                amount: 0
            }
            this.totalEntries++;
        }
    }

    /**
     * This will get called on enter/tab in adjustment amount field
     *
     * @param {KeyboardEvent} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    public validateAmount(event: KeyboardEvent, entry: any): void {
        if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB) && this.adjustmentTransaction && this.adjustmentTransaction.amount) {
            this.validateEntry(entry);
        }
    }

    /**
     * This will validate the adjustment entry
     *
     * @param {*} entry
     * @returns {*}
     * @memberof AccountAsVoucherComponent
     */
    public validateEntry(entry: any): any {
        if (!entry.amount) {
            this._toaster.clearAllToaster();
            this._toaster.errorToast(this.invalidAmountErrorMessage);
            this.isValidForm = false;
            return;
        } else if (isNaN(parseFloat(entry.amount)) || entry.amount <= 0) {
            this._toaster.clearAllToaster();
            this._toaster.errorToast(this.invalidAmountErrorMessage);
            this.isValidForm = false;
            return;
        }

        if (entry.type === AdjustmentTypesEnum.receipt || entry.type === AdjustmentTypesEnum.advanceReceipt) {
            if (parseFloat(entry.amount) !== this.adjustmentTransaction.amount) {
                this._toaster.clearAllToaster();
                this._toaster.errorToast(this.entryAmountErrorMessage);
                this.isValidForm = false;
                return;
            }
        }

        if (entry.type === AdjustmentTypesEnum.againstReference && !entry.invoice?.uniqueName) {
            this._toaster.clearAllToaster();
            this._toaster.errorToast(this.invoiceErrorMessage);
            this.isValidForm = false;
            return;
        }

        if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
            entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
        } else {
            entry.tax.value = 0;
        }

        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            if (receipt.type === AdjustmentTypesEnum.againstReference) {
                receiptTotal += parseFloat(receipt.amount);
            }
        });

        if (receiptTotal < this.adjustmentTransaction.amount) {
            if (entry.type === AdjustmentTypesEnum.againstReference) {
                let invoiceBalanceDue = parseFloat(this.pendingInvoiceList[entry.invoice?.uniqueName].balanceDue.amountForAccount);
                if (invoiceBalanceDue >= entry.amount) {
                    this.addNewAdjustmentEntry();
                    this.validateEntries(false);
                } else if (invoiceBalanceDue < entry.amount) {
                    this._toaster.clearAllToaster();
                    this._toaster.errorToast(this.invoiceAmountErrorMessage);
                    this.isValidForm = false;
                }
            } else {
                this.addNewAdjustmentEntry();
                this.validateEntries(false);
            }
        } else if (receiptTotal > this.adjustmentTransaction.amount) {
            this._toaster.clearAllToaster();
            this._toaster.errorToast(this.amountErrorMessage);
            this.isValidForm = false;
        } else {
            entry.amount = parseFloat(entry.amount);
            this.validateEntries(true);
        }
    }

    /**
     * This will open the adjustment popup if voucher is receipt and transaction is To/Cr
     *
     * @param {KeyboardEvent} event
     * @param {*} transaction
     * @param {TemplateRef<any>} template
     * @memberof AccountAsVoucherComponent
     */
    public openAdjustmentModal(event: KeyboardEvent, transaction: any, template: TemplateRef<any>): void {
        if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB)) {
            this.validateAndOpenAdjustmentPopup(transaction, template);
        }
    }

    /**
     * This will format the amount
     *
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    public formatAmount(entry: any): void {
        entry.amount = Number(entry.amount);
    }

    /**
     * This will prepare the list of adjusment types
     *
     * @returns {IOption[]}
     * @memberof AccountAsVoucherComponent
     */
    public prepareAdjustmentTypes(index: number, entry?: any): IOption[] {
        let adjustmentTypesOptions: IOption[] = [];

        adjustmentTypes.map(type => {
            if ((index === 0 && (type?.value === AdjustmentTypesEnum.receipt || type?.value === AdjustmentTypesEnum.advanceReceipt)) || (index > 0 && type?.value === AdjustmentTypesEnum.againstReference) || (entry && type?.value === entry.type)) {
                adjustmentTypesOptions.push({ label: type.label, value: type?.value });
            }
        });

        return adjustmentTypesOptions;
    }

    /**
     * This will initiate update of adjustment types of all adjustments
     *
     * @param {string} action
     * @memberof AccountAsVoucherComponent
     */
    public updateAdjustmentTypes(action: string): void {
        if (this.receiptEntries && this.receiptEntries.length > 0) {
            let loop = 0;
            this.receiptEntries.forEach(entry => {
                entry.allowedTypes = this.prepareAdjustmentTypes(loop, action);
                loop++;
            });
        }
    }

    /**
     * Callback for select type in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof AccountAsVoucherComponent
     */
    public onSelectAdjustmentType(event: any, entry: any): void {
        if (event && event?.value === AdjustmentTypesEnum.receipt) {
            entry.tax = {
                name: '',
                uniqueName: '',
                percent: 0,
                value: 0
            };
            this.forceClear$ = observableOf({ status: true });
        }
    }

    /**
     * This will validate the transaction and adjustments and will open popup if required
     *
     * @param {*} transaction
     * @param {TemplateRef<any>} template
     * @memberof AccountAsVoucherComponent
     */
    public validateAndOpenAdjustmentPopup(transaction: any, template: TemplateRef<any>): void {
        if (this.requestObj.voucherType === VOUCHERS.RECEIPT && transaction && transaction.type === "to" && !transaction.voucherAdjustments) {
            if (transaction.amount && Number(transaction.amount) > 0) {
                if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
                    this.pendingInvoicesListParams.accountUniqueNames = [];
                    this.pendingInvoicesListParams.accountUniqueNames.push(transaction.selectedAccount?.UniqueName);
                }

                this.getInvoiceListForReceiptVoucher();
                this.currentTransaction = transaction;
                this.modalRef = this.modalService.show(
                    template,
                    Object.assign({}, { class: 'modal-lg', ignoreBackdropClick: true })
                );
            }
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
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            const { group, exceptGroups } = this.tallyModuleService.getGroupByVoucher(this.requestObj.voucherType, this.selectedTransactionType);
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
}
