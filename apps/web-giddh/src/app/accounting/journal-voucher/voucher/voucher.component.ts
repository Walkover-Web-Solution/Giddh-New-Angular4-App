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
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TallyModuleService } from 'apps/web-giddh/src/app/accounting/tally-service';
import * as _ from 'apps/web-giddh/src/app/lodash-optimized';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import * as moment from 'moment';
import { BsDatepickerConfig, BsDatepickerDirective, ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { combineLatest, Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { GeneralActions } from '../../../actions/general/general.actions';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { SalesActions } from '../../../actions/sales/sales.action';
import { AccountResponse, AddAccountRequest, UpdateAccountRequest } from '../../../models/api-models/Account';
import { CurrentPage } from '../../../models/api-models/Common';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { AccountService } from '../../../services/account.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';
import { VsForDirective } from '../../../theme/ng2-vs-for/ng2-vs-for';
import { QuickAccountComponent } from '../../../theme/quick-account-component/quickAccount.component';
import { KeyboardService } from '../../keyboard.service';
import { KEYS, VOUCHERS } from '../journal-voucher.component';
import { adjustmentTypes } from "../../../shared/helpers/adjustmentTypes";
import { SalesService } from '../../../services/sales.service';
import { CompanyActions } from '../../../actions/company.actions';

const CustomShortcode = [
    { code: 'F9', route: 'purchase' }
];

@Component({
    selector: 'account-as-voucher',
    templateUrl: './voucher.component.html',
    styleUrls: ['../../accounting.component.css', './voucher.component.scss'],
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
    @Output() public showAccountList: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('quickAccountComponent') public quickAccountComponent: ElementViewContainerRef;
    @ViewChild('quickAccountModal') public quickAccountModal: ModalDirective;

    @ViewChild('chequeEntryModal') public chequeEntryModal: ModalDirective;

    @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
    @ViewChild('particular') public accountField: any;
    @ViewChild('dateField') public dateField: ElementRef;
    @ViewChild('narrationBox') public narrationBox: ElementRef;
    @ViewChild('chequeNumberInput') public chequeNumberInput: ElementRef;
    @ViewChild('chequeClearanceInputField') public chequeClearanceInputField: ElementRef;
    @ViewChild('chqFormSubmitBtn') public chqFormSubmitBtn: ElementRef;
    @ViewChild('submitButton') public submitButton: ElementRef;
    @ViewChild('resetButton') public resetButton: ElementRef;

    @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

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
    public moment = moment;
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
    private currentVoucher: string;

    public allAccounts: any;
    public previousVoucherType: string = "";
    public universalDate$: Observable<any>;
    public universalDate: any = '';

    public activeCompanyUniqueName$: Observable<string>;
    public activeCompany: any;
    /* Variable to store if modal is out/in */
    public accountAsideMenuState: string = 'out';
    /** Category of accounts to display based on voucher type */
    public categoryOfAccounts: string;
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
    public amountErrorMessage: string = "Amount can't be greater than Credit Amount.";
    /* Error message for comparision of adjusted amount with invoice */
    public invoiceAmountErrorMessage: string = "Amount can't be greater than Invoice Balance Due.";
    /* Error message for invalid adjustment amount */
    public invalidAmountErrorMessage: string = "Please enter valid amount.";
    /* This will hold list of tax */
    public taxList: any[] = [];
    /* Observable for list of tax */
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    /* Object for pending invoices list search params */
    public pendingInvoicesListParams: any = {
        accountUniqueNames: [],
        voucherType: "receipt"
    };
    /* List of adjustment entries */
    public receiptEntries: any[] = [];
    /* Object for active transaction for adjustment */
    public adjustmentTransaction: any = {};
    /* Selected transaction type */
    public selectedTransactionType: string = '';

    constructor(
        private _accountService: AccountService,
        private _ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private _keyboardService: KeyboardService,
        private _toaster: ToasterService, private router: Router,
        private tallyModuleService: TallyModuleService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private inventoryService: InventoryService,
        private generalAction: GeneralActions,
        private fb: FormBuilder, public bsConfig: BsDatepickerConfig,
        private salesAction: SalesActions,
        private modalService: BsModalService,
        private salesService: SalesService,
        private companyActions: CompanyActions) {

        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.activeCompanyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.createdAccountDetails$ = combineLatest([
            this.store.pipe(select(appState => appState.sales.createAccountSuccess)),
            this.store.pipe(select(appState => appState.sales.createdAccountDetails))
        ]).pipe(debounceTime(0), takeUntil(this.destroyed$));
        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;

        this.requestObj.transactions = [];
        this._keyboardService.keyInformation.subscribe((key) => {
            this.watchKeyboardEvent(key);
        });

        this.tallyModuleService.selectedPageInfo.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (_.isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe((data) => {
            if (data) {
                this.currentVoucher = data.page;
                this.setCurrentPageTitle(this.currentVoucher);
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
                    this.createAccountsList();
                    this.resetEntriesIfVoucherChanged();
                    setTimeout(() => {
                        this.dateField.nativeElement.focus();
                    }, 50);
                } else {
                    this.createAccountsList();
                    this.resetEntriesIfVoucherChanged();
                    this.tallyModuleService.requestData.next(this.requestObj);
                }

            }
        });
        this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.journalDate = moment(this.universalDate[1], GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.dateEntered();
            }
        });

        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
                if (!res) {
                    return;
                }
                const currentCompany = res.find((company) => company.uniqueName === activeCompanyName);
                if (currentCompany) {
                    this.activeCompany = currentCompany;
                    this.currentCompanyUniqueName = currentCompany.uniqueName;
                    this.createAccountsList();
                }
            });
        });

        this.chequeDetailForm = this.fb.group({
            chequeClearanceDate: [''],
            chequeNumber: ['', [Validators.required]]
        });

        this.tallyModuleService.requestData.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (_.isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe((data) => {
            if (data) {
                this.requestObj = _.cloneDeep(data);
            }
        });

        this.store.select(p => p.ledger.ledgerCreateSuccess).pipe(takeUntil(this.destroyed$)).subscribe((s: boolean) => {
            if (s) {
                this._toaster.successToast('Entry created successfully', 'Success');
                this.refreshEntry();
                this.store.dispatch(this._ledgerActions.ResetLedger());
                this.requestObj.description = '';
                this.dateField.nativeElement.focus();
            }
        });

        this.refreshEntry();

        this.tallyModuleService.filteredAccounts.subscribe((accounts) => {
            if (accounts) {
                this.allAccounts = accounts;
                this.createAccountsList();
            }
        });

        this.createStockSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(yesOrNo => {
            if (yesOrNo) {
                this.asideMenuStateForProductService = 'out';
                this.autoFocusStockGroupField = false;
                this.getStock(null, null, true);
                setTimeout(() => {
                    this.dateField.nativeElement.focus();
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
                    this.tallyModuleService.updateFlattenAccounts(createdAccountDetails);
                    this.setAccount(createdAccountDetails);
                }
            }
        });

        adjustmentTypes.map(type => {
            this.adjustmentTypes.push({ label: type.label, value: type.value });
        });
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
        val = val.trim();
        if (val.length === 2 && (val.toLowerCase() !== 'to' && val.toLowerCase() !== 'by')) {
            this._toaster.errorToast("Spell error, you can only use 'To/By'");
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
        this.inputForList = _.cloneDeep(this.flattenAccounts);
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
        const chequeDetails = this.chequeDetailForm.value;
        this.requestObj.chequeNumber = chequeDetails.chequeNumber;
        this.requestObj.chequeClearanceDate = moment(chequeDetails.chequeClearanceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
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
            this.chequeNumberInput.nativeElement.focus();
        }, 200);
    }

    /**
     * setAccount` in particular, on accountList click
     */
    public setAccount(acc) {
        let openChequePopup = false;
        if (acc.parentGroups.find((pg) => pg.uniqueName === 'bankaccounts')) {
            openChequePopup = true;
            this.openChequeDetailForm();
        }
        let idx = this.selectedIdx;
        let transaction = this.requestObj.transactions[idx];
        if (acc) {
            const formattedCurrentDate = moment(this.universalDate[1], GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.tallyModuleService.getCurrentBalance(this.currentCompanyUniqueName, acc.uniqueName, formattedCurrentDate, formattedCurrentDate).subscribe((data) => {
                if (data && data.body) {
                    this.setAccountCurrentBalance(data.body, idx);
                }
            }, () => { });
            let accModel = {
                name: acc.name,
                UniqueName: acc.uniqueName,
                groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1].uniqueName,
                account: acc.name,
                parentGroups: acc.parentGroups
            };
            transaction.particular = accModel.UniqueName;
            transaction.selectedAccount = accModel;
            transaction.stocks = acc.stocks;
            transaction.currentBalance = '';
            transaction.selectedAccount.type = '';

            if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
                this.pendingInvoicesListParams.accountUniqueNames = [];
                this.pendingInvoicesListParams.accountUniqueNames.push(transaction.selectedAccount.UniqueName);
                this.getInvoiceListForReceiptVoucher();
            }

            // tally difference amount
            transaction.amount = transaction.amount ? transaction.amount : this.calculateDiffAmount(transaction.type);
            transaction.amount = transaction.amount ? transaction.amount : null;

            if (acc) {
                this.groupUniqueName = accModel.groupUniqueName;
                this.selectAccUnqName = acc.uniqueName;

                let len = this.requestObj.transactions[idx].inventory ? this.requestObj.transactions[idx].inventory.length : 0;
                if (!len || this.requestObj.transactions[idx].inventory && this.requestObj.transactions[idx].inventory[len - 1].stock.uniqueName) {
                    this.requestObj.transactions[idx].inventory.push(this.initInventory());
                }
            }

            if (openChequePopup === false) {
                setTimeout(() => {
                    if (transaction.type === 'by') {
                        // this.byAmountField.nativeElement.focus();
                        this.byAmountFields.last.nativeElement.focus();
                    } else {
                        // this.toAmountField.nativeElement.focus();
                        this.toAmountFields.last.nativeElement.focus();
                    }
                }, 200);
            }
            this.calModAmt(transaction.amount, transaction, idx);

        } else {
            this.deleteRow(idx);
        }
    }

    /**
     * searchAccount in accountList
     */
    public searchAccount(event: KeyboardEvent, accountName: string) {
        if (event && !(event.shiftKey || event.key === 'Shift') && accountName) {
            this.filterByText = accountName;
            this.showLedgerAccountList = true;
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
        let reqField: any = document.getElementById(`first_element_${entryIndex - 1}`);
        if (amount === 0 || amount === '0') {
            if (entryIndex === 0) {
                this.isFirstRowDeleted = true;
            } else {
                this.isFirstRowDeleted = false;
            }
            this.requestObj.transactions[index].currentBalance = '';
            this.requestObj.transactions[index].selectedAccount.type = '';
            this.requestObj.transactions.splice(index, 1);
            if (reqField === null) {
                this.dateField.nativeElement.focus();
            } else {
                reqField.focus();
            }
            if (!this.requestObj.transactions.length) {
                if (this.requestObj.voucherType === VOUCHERS.CONTRA) {
                    this.newEntryObj('by');
                } else if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
                    this.newEntryObj('to');
                }
            }
        } else {
            this.calModAmt(amount, transactionObj, index);
        }
    }

    public calModAmt(amount, transactionObj, indx) {
        let lastIndx = this.requestObj.transactions.length - 1;
        transactionObj.amount = Number(amount);
        transactionObj.total = transactionObj.amount;

        let debitTransactions = _.filter(this.requestObj.transactions, (o: any) => o.type === 'by');
        this.totalDebitAmount = _.sumBy(debitTransactions, (o: any) => Number(o.amount));
        let creditTransactions = _.filter(this.requestObj.transactions, (o: any) => o.type === 'to');
        this.totalCreditAmount = _.sumBy(creditTransactions, (o: any) => Number(o.amount));
        if (indx === lastIndx && this.requestObj.transactions[indx].selectedAccount.name) {
            if (this.totalCreditAmount < this.totalDebitAmount) {
                this.newEntryObj('to');
            } else if (this.totalDebitAmount < this.totalCreditAmount) {
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
            if (this.requestObj.description.length > 1) {
                this.requestObj.description = this.requestObj.description.replace(/(?:\r\n|\r|\n)/g, '');
                setTimeout(() => {
                    submitBtnEle.focus();
                }, 100);
            }
        } else {
            this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
        }
    }

    /**
     * saveEntry
     */
    public saveEntry() {
        let data = _.cloneDeep(this.requestObj);
        data.entryDate = moment(this.journalDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        data.transactions = this.validateTransaction(data.transactions);

        if (!data.transactions) {
            return;
        }

        const foundContraEntry: boolean = this.validateForContraEntry(data);
        const foundSalesAndBankEntry: boolean = this.validateForSalesAndPurchaseEntry(data);

        if (foundContraEntry && data.voucherType !== 'Contra') {
            this._toaster.errorToast('Contra entry (Cash + Bank), not allowed in ' + data.voucherType, 'Error');
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
        }
        if (!foundContraEntry && data.voucherType === 'Contra') {
            this._toaster.errorToast('There should be Cash and Bank entry in contra.', 'Error');
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
        }

        // This suggestion was given by Sandeep
        if (foundSalesAndBankEntry && data.voucherType === 'Journal') {
            this._toaster.errorToast('Sales and Purchase entry not allowed in journal.', 'Error');
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
        }

        if (this.totalCreditAmount === this.totalDebitAmount) {
            if (this.validatePaymentAndReceipt(data)) {

                let hasAdvanceReceipt = false;

                if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
                    let adjustmentParentEntry = data.transactions[0];
                    let voucherAdjustments = this.receiptEntries;
                    let totalAdjustmentAmount = 0;
                    if (voucherAdjustments && voucherAdjustments.length > 0) {
                        data.voucherAdjustments = {};
                        data.voucherAdjustments.adjustments = [];
                        let byEntry = data.transactions[1];
                        let totalTransactions = data.transactions.length;
                        let adjustmentsCount = 0;

                        voucherAdjustments.forEach(adjustment => {
                            if(adjustment.type === "advanceReceipt") {
                                hasAdvanceReceipt = true;
                            }
                        });

                        voucherAdjustments.forEach(adjustment => {
                            totalAdjustmentAmount += Number(adjustment.amount);

                            if (adjustment.type === "receipt" || adjustment.type === "advanceReceipt") {
                                let taxAmount = 0;
                                let advanceReceiptAmount = 0;

                                if(adjustment.type === "advanceReceipt") {
                                    taxAmount = adjustment.tax.value;
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
                                    taxes: adjustment.tax.uniqueName ? [adjustment.tax.uniqueName] : [],
                                    total: Number(adjustment.amount),
                                    type: byEntry.type,
                                    subVoucher: (adjustment.type === "advanceReceipt") ? "ADVANCE_RECEIPT" : ""
                                };
                                totalTransactions++;
                            } else {
                                data.voucherAdjustments.adjustments[adjustmentsCount] = {
                                    uniqueName: adjustment.invoice.uniqueName,
                                    adjustmentAmount: {
                                        amountForAccount: Number(adjustment.amount),
                                        amountForCompany: Number(adjustment.amount)
                                    },
                                    voucherType: adjustment.invoice.type
                                };
                                adjustmentsCount++;
                            }
                        });
                    }

                    if(totalAdjustmentAmount !== this.totalCreditAmount) {
                        this._toaster.errorToast('Total credit amount and adjustment amount should be equal.', 'Error');
                        return false;
                    }
                }

                _.forEach(data.transactions, (element: any) => {
                    if(element) {
                        element.type = (element.type === 'by' || hasAdvanceReceipt) ? 'credit' : 'debit';
                    }
                });
                let accUniqueName: string = _.maxBy(data.transactions, (o: any) => o.amount).selectedAccount.UniqueName;
                let indexOfMaxAmountEntry = _.findIndex(data.transactions, (o: any) => o.selectedAccount.UniqueName === accUniqueName);
                data.transactions.splice(indexOfMaxAmountEntry, 1);
                data = this.tallyModuleService.prepareRequestForAPI(data);
                this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
            } else {
                const byOrTo = data.voucherType === 'Payment' ? 'to' : 'by';
                this._toaster.errorToast('Please select at least one cash or bank account in ' + byOrTo.toUpperCase(), 'Error');
                setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
            }
        } else {
            this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
            setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
        }
    }

    public validateForContraEntry(data) {
        const debitEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'by' && trxn.selectedAccount.parentGroups.find((pg) => (pg.uniqueName === 'bankaccounts' || pg.uniqueName === 'cash'))));
        const creditEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'to' && trxn.selectedAccount.parentGroups.find((pg) => (pg.uniqueName === 'bankaccounts' || pg.uniqueName === 'cash'))));

        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        } else {
            return false;
        }
    }

    public validateForSalesAndPurchaseEntry(data) {
        const debitEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'by' && trxn.selectedAccount.parentGroups.find((pg) => (pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities' || pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses'))));
        const creditEntryWithCashOrBank = data.transactions.find((trxn) => (trxn.type === 'to' && trxn.selectedAccount.parentGroups.find((pg) => (pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities' || pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses'))));

        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        } else {
            return false;
        }
    }

    public validatePaymentAndReceipt(data) {
        if (data.voucherType === 'Payment' || data.voucherType === 'Receipt') {
            const byOrTo = data.voucherType === 'Payment' ? 'to' : 'by';
            const toAccounts = data.transactions.filter((acc) => acc.type === byOrTo);
            const AccountOfCashOrBank = toAccounts.filter((acc) => {
                const indexOfCashOrBank = acc.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bankaccounts');
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
        this.requestObj.entryDate = moment().format(GIDDH_DATE_FORMAT);
        if (this.universalDate[1]) {
            this.journalDate = moment(this.universalDate[1], GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        } else {
            this.journalDate = moment().format(GIDDH_DATE_FORMAT);
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
        setTimeout(() => {
            if (this.currentVoucher) {
                this.setCurrentPageTitle(this.currentVoucher);
            }
        }, 200);
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
        this.requestObj.entryDate = moment(date).format(GIDDH_DATE_FORMAT);
    }

    /**
     * watchMenuEvent
     */
    public watchKeyboardEvent(event) {
        if (event) {
            let navigateTo = _.find(this.navigateURL, (o: any) => o.code === event.key);
            if (navigateTo) {
                this.router.navigate(['accounting', navigateTo.route]);
            }
        }
    }

    /**
     * removeBlankTransaction
     */
    public removeBlankTransaction(transactions) {
        _.forEach(transactions, function (obj: any, idx) {
            if (obj && !obj.particular && !obj.amount) {
                transactions = _.without(transactions, obj);
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
        _.forEach(validEntry, function (obj: any, idx) {
            if (obj.particular && !obj.amount) {
                obj.amount = 0;
            } else if (obj && !obj.particular) {
                this.entryIsValid = false;
                return false;
            }
        });

        if (entryIsValid) {
            return validEntry;
        } else {
            this._toaster.errorToast("Particular can't be blank");
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 500);
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
            let entryItem = _.cloneDeep(item);
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
            this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item.uniqueName };
            // this.requestObj.transactions[idx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
            this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
        }

    }

    /**
     * changePrice
     */
    public changePrice(idx, val) {
        let i = this.selectedIdx;
        this.requestObj.transactions[i].inventory[idx].unit.rate = !Number.isNaN(val) ? Number(_.cloneDeep(val)) : 0;
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
        let entry = this.requestObj.transactions[i];
        this.requestObj.transactions[i].inventory[idx].quantity = Number(val);
        this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(2));
        this.amountChanged(idx);
    }

    public validateAndAddNewStock(idx) {
        let i = this.selectedIdx;
        if (this.requestObj.transactions[i].inventory.length - 1 === idx && this.requestObj.transactions[i].inventory[idx].amount) {
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

    /**
     * hideListItems
     */
    public hideListItems() {
        // this.showLedgerAccountList = false;
        // this.showStockList = false;
    }

    public dateEntered() {
        const date = moment(this.journalDate, GIDDH_DATE_FORMAT);
        if (moment(date).format('dddd') !== 'Invalid date') {
            this.displayDay = moment(date).format('dddd');
        } else {
            this.displayDay = '';
        }
    }

    /**
     * validateAccount
     */
    public validateAccount(transactionObj, ev, idx) {
        if (!ev.shiftKey) {
            let lastIndx = this.requestObj.transactions.length - 1;
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
                this._toaster.errorToast('No account found with name ' + transactionObj.selectedAccount.account);
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
        if (ev.value === 'createnewitem') {
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
            // this.inputForList = _.cloneDeep(this.allStocks);
            this.sortStockItems(_.cloneDeep(this.allStocks));
        } else {
            const reqArray = parentGrpUnqName ? [parentGrpUnqName] : null;
            this.inventoryService.GetStocks().pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data.status === 'success') {
                    this.allStocks = _.cloneDeep(data.body.results);
                    this.sortStockItems(this.allStocks);
                    if (needToFocusStockInputField) {
                        this.selectedStockInputField.value = '';
                        this.selectedStockInputField.focus();
                    }
                    // this.inputForList = _.cloneDeep(this.allStocks);
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
        _.forEach(ItemArr, (obj: any) => {
            stockAccountArr.push({
                label: `${obj.name} (${obj.uniqueName})`,
                value: obj.uniqueName,
                additional: obj
            });
        });
        // console.log(stockAccountArr, 'stocks');
        this.stockList = stockAccountArr;
        this.inputForList = _.cloneDeep(this.stockList);
    }

    public loadQuickAccountComponent() {
        this.quickAccountModal.config.backdrop = false;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
        let viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let componentInstance = componentRef.instance as QuickAccountComponent;
        componentInstance.needAutoFocus = true;
        componentInstance.closeQuickAccountModal.subscribe((a) => {
            this.hideQuickAccountModal();
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
            this.isNoAccFound = false;
            this.dateField.nativeElement.focus();
        });
        componentInstance.isQuickAccountCreatedSuccessfully$.subscribe((status: boolean) => {
            if (status) {
                this.refreshAccountListData(true);
            }
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
        this.dateField.nativeElement.focus();
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
        this.dateField.nativeElement.focus();
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
                    this.chequeClearanceInputField.nativeElement.focus();
                } else if (fieldType === 'chqDate') {
                    datePickerField.hide();
                    if (!event.shiftKey) {
                        this.chqFormSubmitBtn.nativeElement.focus();
                    }
                }
            }, 100);
        }
    }

    public keyUpOnSubmitButton(e) {
        if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
            return setTimeout(() => this.resetButton.nativeElement.focus(), 50);
        }
        if (e && (e.keyCode === 8 || e.which === 8)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
        }
    }

    public keyUpOnResetButton(e) {
        if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
            return setTimeout(() => this.submitButton.nativeElement.focus(), 50);
        }
        if (e && (e.keyCode === 13 || e.which === 13)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
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

    private refreshAccountListData(needToFocusAccountInputField: boolean = false) {
        this.store.select(p => p.session.companyUniqueName).subscribe(a => {
            if (a && a !== '') {
                this._accountService.getFlattenAccounts('', '', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data.status === 'success') {
                        this.tallyModuleService.setFlattenAccounts(data.body.results);
                        if (needToFocusAccountInputField) {
                            this.selectedAccountInputField.value = '';
                            this.selectedAccountInputField.focus();
                        }
                    }
                });
            }
        });
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
            this.allAccounts.forEach((acc: IFlattenAccountsResultItem) => {
                if (this.activeCompany && acc.currency === this.activeCompany.baseCurrency) {
                    if (this.requestObj.voucherType === VOUCHERS.CONTRA) {
                        const isContraAccount = acc.parentGroups.find((pg) => (pg.uniqueName === 'bankaccounts' || pg.uniqueName === 'cash' || pg.uniqueName === 'currentliabilities'));
                        const isDisallowedAccount = acc.parentGroups.find((pg) => (pg.uniqueName === 'sundrycreditors' || pg.uniqueName === 'dutiestaxes'));
                        if (isContraAccount && !isDisallowedAccount) {
                            accList.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName, additional: acc });
                        }
                    } else if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
                        let isReceiptAccount;

                        if(this.selectedTransactionType === 'to') {
                            isReceiptAccount = acc.parentGroups.find((pg) => (pg.uniqueName === 'currentliabilities' || pg.uniqueName === 'sundrycreditors' || pg.uniqueName === 'sundrydebtors'));
                        } else {
                            isReceiptAccount = acc.parentGroups.find((pg) => (pg.uniqueName === 'bankaccounts' || pg.uniqueName === 'cash' || pg.uniqueName === 'currentliabilities' || pg.uniqueName === 'sundrycreditors' || pg.uniqueName === 'sundrydebtors'));
                        }

                        const isDisallowedAccount = acc.parentGroups.find((pg) => (pg.uniqueName === 'dutiestaxes'));
                        if (isReceiptAccount && !isDisallowedAccount) {
                            accList.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName, additional: acc });
                        }
                    } else {
                        accList.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName, additional: acc });
                    }
                }
            });
            this.flattenAccounts = accList;
            this.inputForList = _.cloneDeep(this.flattenAccounts);
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
        this.dateField.nativeElement.focus();
    }

    /**
     * Focuses on entry debit and credit amount
     *
     * @memberof AccountAsVoucherComponent
     */
    public focusDebitCreditAmount(): void {
        if (this.requestObj.transactions[this.selectedIdx].type === 'by') {
            this.byAmountFields.last.nativeElement.focus();
        } else {
            this.toAmountFields.last.nativeElement.focus();
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
     * This function will set the page heading
     *
     * @param {string} voucherType Currently selected voucher type
     * @memberof InvoiceComponent
     */
    private setCurrentPageTitle(voucherType: string): void {
        let currentPageObj = new CurrentPage();
        switch (this.currentVoucher) {
            case VOUCHERS.CONTRA:
                currentPageObj.name = `Journal Voucher * > ${voucherType}`;
                currentPageObj.url = '/pages/journal-voucher/contra';
                break;
            default:
                currentPageObj.name = 'Journal Voucher *';
                currentPageObj.url = '/pages/journal-voucher';
                break;
        }
        this.store.dispatch(this.generalAction.setPageTitle(currentPageObj));
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
        this.modalRef.hide();
    }

    /**
     * This will get tax list
     *
     * @memberof AccountAsVoucherComponent
     */
    public getTaxList(): void {
        this.store.pipe(select(state => state.company), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                let taxList: IOption[] = [];
                Object.keys(res.taxes).forEach(key => {
                    taxList.push({ label: res.taxes[key].name, value: res.taxes[key].uniqueName });

                    this.taxList[res.taxes[key].uniqueName] = [];
                    this.taxList[res.taxes[key].uniqueName] = res.taxes[key];
                });
                this.taxListSource$ = observableOf(taxList);
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
        this.salesService.getInvoiceListForReceiptVoucher(moment(this.journalDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT), this.pendingInvoicesListParams).subscribe(response => {
            if (response && response.status === "success" && response.body && response.body.results && response.body.results.length > 0) {
                let pendingInvoiceList: IOption[] = [];

                Object.keys(response.body.results).forEach(key => {
                    this.pendingInvoiceList[response.body.results[key].uniqueName] = [];
                    this.pendingInvoiceList[response.body.results[key].uniqueName] = response.body.results[key];

                    pendingInvoiceList.push({ label: response.body.results[key].voucherNumber + ", " + response.body.results[key].voucherDate + ", " + response.body.results[key].balanceDue.amountForAccount + " cr.", value: response.body.results[key].uniqueName });
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
                amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " cr.",
                uniqueName: event.value,
                type: this.pendingInvoiceList[event.value].voucherType
            };
        } else {
            entry.invoice = {
                number: '',
                date: '',
                amount: 0,
                uniqueName: '',
                type: ''
            };
        }
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

        this.validateEntries();
    }

    /**
     * This will validate all the adjustment entries
     *
     * @memberof AccountAsVoucherComponent
     */
    public validateEntries(): void {
        let receiptTotal = 0;
        let isValid = true;

        this.receiptEntries.forEach(receipt => {
            if(parseFloat(receipt.amount) === 0 || isNaN(parseFloat(receipt.amount))) {
                isValid = false;
            } else {
                receiptTotal += parseFloat(receipt.amount);
            }
        });

        if(isValid) {
            if (receiptTotal !== this.adjustmentTransaction.amount) {
                this.isValidForm = false;
            } else {
                this.isValidForm = true;
            }
        } else {
            this.isValidForm = false;
            this._toaster.clearAllToaster();
            this._toaster.errorToast(this.invalidAmountErrorMessage);
        }
    }

    /**
     * This will add new row for adjusment
     *
     * @memberof AccountAsVoucherComponent
     */
    public addNewAdjustmentEntry(): void {
        if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && parseFloat(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
            this.receiptEntries[this.totalEntries] = {
                type: 'receipt',
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
        if ((event.keyCode === 9 || event.keyCode === 13) && this.adjustmentTransaction && this.adjustmentTransaction.amount) {
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

        if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
            entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
        } else {
            entry.tax.value = 0;
        }

        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += parseFloat(receipt.amount);
        });

        if (receiptTotal < this.adjustmentTransaction.amount) {
            if (entry.type === "againstReference") {
                let invoiceBalanceDue = parseFloat(this.pendingInvoiceList[entry.invoice.uniqueName].balanceDue.amountForAccount);
                if (invoiceBalanceDue >= entry.amount) {
                    this.addNewAdjustmentEntry();
                } else if (invoiceBalanceDue < entry.amount) {
                    this._toaster.clearAllToaster();
                    this._toaster.errorToast(this.invoiceAmountErrorMessage);
                }
            } else {
                this.addNewAdjustmentEntry();
            }
        } else if (receiptTotal > this.adjustmentTransaction.amount) {
            this._toaster.clearAllToaster();
            this._toaster.errorToast(this.amountErrorMessage);
        } else {
            entry.amount = parseFloat(entry.amount);
            this.validateEntries();
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
        if (this.requestObj.voucherType === VOUCHERS.RECEIPT && transaction && transaction.type === "to" && transaction.amount && Number(transaction.amount) > 0 && !transaction.voucherAdjustments) {
            this.currentTransaction = transaction;

            if (event.keyCode === 9 || event.keyCode === 13) {
                this.modalRef = this.modalService.show(
                    template,
                    Object.assign({}, { class: 'modal-lg' })
                );
            }
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
}
