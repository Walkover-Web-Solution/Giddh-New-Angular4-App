import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { TallyModuleService } from './../tally-service';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { LedgerActions } from './../../actions/ledger/ledger.actions';
import { IOption } from './../../theme/ng-select/option.interface';
import { AccountService } from './../../services/account.service';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { cloneDeep, forEach, isEqual, sumBy, concat, find, without, orderBy } from 'apps/web-giddh/src/app/lodash-optimized';
import * as dayjs from 'dayjs';
import { BlankLedgerVM } from 'apps/web-giddh/src/app/material-ledger/ledger.vm';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountResponse } from '../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { QuickAccountComponent } from '../../theme/quick-account-component/quickAccount.component';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { InventoryService } from '../../services/inventory.service';
import { InventoryAction } from '../../actions/inventory/inventory.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TaxResponse } from 'apps/web-giddh/src/app/models/api-models/Company';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';

const TransactionsType = [
    { label: 'By', value: 'Debit' },
    { label: 'To', value: 'Credit' },
];

const CustomShortcode = [
    { code: 'F9', route: 'purchase' }
];

@Component({
    selector: 'invoice-grid',
    templateUrl: './invoice-grid.component.html',
    styleUrls: ['./invoice-grid.component.scss', '../accounting.component.scss'],
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
})

export class InvoiceGridComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @Input() public saveEntryOnCtrlA: boolean;
    @Input() public openDatePicker: boolean;
    @Input() public openCreateAccountPopup: boolean;
    @Input() public newSelectedAccount: AccountResponse;
    @Output() public showAccountList: EventEmitter<boolean> = new EventEmitter();
    @Output() public showStockList: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('quickAccountComponent', { static: true }) public quickAccountComponent: ElementViewContainerRef;
    @ViewChild('quickAccountModal', { static: true }) public quickAccountModal: ModalDirective;

    @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
    @ViewChild('particular', { static: true }) public accountField: any;
    @ViewChild('dateField', { static: true }) public dateField: ElementRef;
    @ViewChild('manageGroupsAccountsModal', { static: true }) public manageGroupsAccountsModal: ModalDirective;
    @ViewChild('partyAccNameInputField', { static: true }) public partyAccNameInputField: ElementRef;
    @ViewChild('submitButton', { static: true }) public submitButton: ElementRef;
    @ViewChild('resetButton', { static: true }) public resetButton: ElementRef;
    @ViewChild('narrationBox', { static: true }) public narrationBox: ElementRef;

    // public showAccountList: boolean = true;
    public TransactionType: 'by' | 'to' = 'by';
    public data: any = new BlankLedgerVM();
    public totalCreditAmount: number = 0;
    public totalDebitAmount: number = 0;
    public showConfirmationBox: boolean = false;
    public dayjs = dayjs;
    public accountSearch: string = '';
    public stockSearch: string;
    public selectedRowIdx: any;
    public isSelectedRow: boolean;
    public selectedInput: any;
    public entryDate: any;
    public navigateURL: any = CustomShortcode;
    public showInvoiceDate: boolean = false;
    // public purchaseType: string = 'invoice';
    public groupUniqueName: string = 'purchases';
    public filterByGrp: boolean = false;
    // public showStockList: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    public selectedAcc: object;
    public accountType: string;
    public accountsTransaction = [];
    public stocksTransaction = [];
    public selectedAccIdx: any;
    public creditorAcc: any = {};
    public debtorAcc: any = {};
    public stockTotal = null;
    public accountsTotal = null;
    public arrowInput: { key: number };
    public gridType: string = 'invoice';
    public isPartyACFocused: boolean = false;
    public displayDay: string = '';
    public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    public keyUpDownEvent: KeyboardEvent;
    public filterByText: string = '';
    public inputForList: IOption[];
    public flattenAccounts: IOption[];
    public stockList: IOption[];
    public showLedgerAccountList: boolean = false;
    public selectedField: 'account' | 'stock' | 'partyAcc';
    public focusedField: 'partyAcc' | 'ledgerName';
    public currentSelectedValue: string = '';
    public invoiceNoHeading: string = 'Supplier Invoice No';
    public isSalesInvoiceSelected: boolean = false; // need to hide `invoice no.` field in sales
    public isPurchaseInvoiceSelected: boolean = false; // need to show `Ledger name` field in purchase
    public asideMenuStateForProductService: string = 'out';
    public companyTaxesList$: Observable<TaxResponse[]>;
    public autoFocusStockGroupField: boolean = false;
    public createStockSuccess$: Observable<boolean>;
    public isCustomInvoice: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private allStocks: any[];
    private selectedStockInputField: any;
    private selectedAccountInputField: any;
    private taxesToRemember: any[] = [];
    private isAccountListFiltered: boolean = false;
    private allFlattenAccounts: any[] = [];
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    constructor(
        private _accountService: AccountService,
        private _ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private _keyboardService: KeyboardService,
        private _toaster: ToasterService,
        private _router: Router,
        private _tallyModuleService: TallyModuleService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private inventoryService: InventoryService,
        private inventoryAction: InventoryAction,
        private invoiceActions: InvoiceActions,
    ) {
        this._keyboardService.keyInformation.pipe(takeUntil(this.destroyed$)).subscribe((key) => {
            this.watchKeyboardEvent(key);
        });

        this._tallyModuleService.selectedPageInfo.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        }), takeUntil(this.destroyed$)).subscribe((d) => {
            if (d && d.gridType === 'invoice') {
                this.data.voucherType = d.page;
                this.gridType = d.gridType;
                setTimeout(() => {
                    this.dateField?.nativeElement.focus();
                }, 50);
                if (d.page === 'Debit note' || d.page === 'Credit note') {
                    this.invoiceNoHeading = 'Original invoice number';
                } else {
                    this.invoiceNoHeading = 'Supplier Invoice No';
                }
                if (d.page === 'Sales') {
                    this.isSalesInvoiceSelected = true;
                } else {
                    this.isSalesInvoiceSelected = false;
                }

                if (d.page === 'Purchase') {
                    this.isPurchaseInvoiceSelected = true;
                } else {
                    this.isPurchaseInvoiceSelected = false;
                }

            } else if (d && this.data.transactions) {
                this.gridType = d.gridType;
                this.data.transactions = this.prepareDataForVoucher();
                this._tallyModuleService.requestData.next(this.data);
            }
        });

        this._tallyModuleService.requestData.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        }), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data) {
                this.data = cloneDeep(data);
                if (this.gridType === 'invoice') {
                    this.prepareDataForInvoice(this.data);
                }
            }
        });

        this.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
    }

    public ngOnInit() {

        // dispatch stocklist request
        this.store.dispatch(this.inventoryAction.GetStock());

        this.store.pipe(select(p => p.ledger.ledgerCreateSuccess), takeUntil(this.destroyed$)).subscribe((s: boolean) => {
            if (s) {
                this._toaster.successToast('Entry created successfully', 'Success');
                this.refreshEntry();
                this.data.description = '';
                this.dateField?.nativeElement.focus();
                this.taxesToRemember = [];
            }
        });
        this.entryDate = dayjs().format(GIDDH_DATE_FORMAT);

        this._tallyModuleService.filteredAccounts.pipe(takeUntil(this.destroyed$)).subscribe((accounts) => {
            if (accounts) {
                let accList: IOption[] = [];
                accounts.forEach((acc: IFlattenAccountsResultItem) => {
                    accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
                });
                this.flattenAccounts = accList;
                this.inputForList = cloneDeep(this.flattenAccounts);
            }
        });

        this.createStockSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(yesOrNo => {
            if (yesOrNo) {
                this.closeCreateStock();
            }
        });

        this.store.pipe(select(s => s.invoice.settings), takeUntil(this.destroyed$)).subscribe(result => {
            if (result && result.invoiceSettings) {
                this.isCustomInvoice = result.invoiceSettings.useCustomInvoiceNumber;
            } else {
                this.isCustomInvoice = false;
            }
        });

    }

    public ngOnChanges(c: SimpleChanges) {
        if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
            this.dateField?.nativeElement.focus();
        }
        if ('newSelectedAccount' in c && c.newSelectedAccount.currentValue !== c.newSelectedAccount.previousValue) {
            this.setAccount(c.newSelectedAccount.currentValue);
        }
        if ('openCreateAccountPopup' in c && c.openCreateAccountPopup.currentValue !== c.openCreateAccountPopup.previousValue) {
            if (c.openCreateAccountPopup.currentValue) {
                if (this.focusedField) {
                    this.showQuickAccountModal();
                } else {
                    this.asideMenuStateForProductService = 'in';
                    this.autoFocusStockGroupField = true;
                }
            }
        }
        if ('saveEntryOnCtrlA' in c && c.saveEntryOnCtrlA.currentValue !== c.saveEntryOnCtrlA.previousValue) {
            if (c.saveEntryOnCtrlA.currentValue) {
                this.saveEntry();
            }
        }
    }

    /**
     * addNewRow() to push new object
     */
    public addNewRow(type) {
        let entryObj = {
            amount: null,
            particular: '',
            applyApplicableTaxes: false,
            isInclusiveTax: false,
            type: 'by',
            taxes: [],
            total: null,
            discounts: [],
            inventory: {},
            selectedAccount: {
                name: '',
                uniqueName: ''
            }
        };

        if (type === 'stock') {
            let stockEntry = entryObj;
            stockEntry.inventory = this.initInventory();
            this.stocksTransaction.push(stockEntry);
        } else if (type === 'account') {
            this.accountsTransaction.push(entryObj);
        }
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
    public selectRow(type: boolean, stkIdx) {
        this.isSelectedRow = type;
        this.selectedRowIdx = stkIdx;
        this.showLedgerAccountList = false;
        // this.selectedAccIdx = accIdx;
    }

    /**
     * selectAccountRow() on entryObj focus/blur
     */
    public selectAccountRow(type: boolean, idx) {
        // this.isSelectedRow = type;
        // this.selectedAccIdx = idx;
        // this.selectedRowIdx = null;
    }

    /**
     * getFlattenGrpAccounts
     */
    public getFlattenGrpAccounts(groupUniqueName, filter) {
        // this.showAccountList.emit(true);
        this.groupUniqueName = groupUniqueName ? groupUniqueName : this.groupUniqueName;
        this.filterByGrp = filter;
        this.showStockList.emit(false);
    }

    /**
     * selectEntryType() to validate Type i.e BY/TO
     */
    public selectEntryType(transactionObj, val, idx) {
        if (val.length === 2 && (val.toLowerCase() !== 'to' && val.toLowerCase() !== 'by')) {
            this._toaster.errorToast("Spell error, you can only use 'To/By'");
            transactionObj.type = 'DEBIT';
        } else {
            transactionObj.type = val;
        }
    }

    public onStockItemBlur(ev, elem) {
        // this.selectedInput = elem;
        // this.showLedgerAccountList = false;
        // if (!this.stockSearch) {
        //   this.searchStock('');
        //   this.stockSearch = '';
        // }
    }

    public onAccountFocus(ev, indx: number) {
        this.selectedAccountInputField = ev.target;
        this.showConfirmationBox = false;
        // this.selectedField = 'account';
        this.selectedAccIdx = indx;
        // this.showLedgerAccountList = true;

        this.inputForList = cloneDeep(this.flattenAccounts);
        this.selectedField = 'account';

        if (this.isAccountListFiltered) {
            this.refreshAccountListData();
        }
        // this.selectedParticular = elem;
        // this.selectRow(true, indx);
        // this.filterAccount(trxnType);
        setTimeout(() => {
            this.showLedgerAccountList = true;
        }, 200);
    }

    public onAccountBlur(ele) {
        this.selectedInput = ele;
        this.showLedgerAccountList = false;
        this.filterByText = '';
        // if (ev.target.value === 0) {
        //   ev.target.focus();
        //   ev.preventDefault();
        // }
    }

    /**
     * setAccount` in particular, on accountList click
     */
    public setAccount(acc) {
        let idx = this.selectedAccIdx;
        if (acc) {
            if (this.accountType === 'creditor') {
                setTimeout(() => {
                    if (this.focusedField === 'ledgerName') {
                        this.debtorAcc = acc;
                    } else if (this.focusedField === 'partyAcc') {
                        this.creditorAcc = acc;
                    }
                }, 10);
                return this.accountType = null;
            } else if (this.accountType === 'debitor') {
                this.debtorAcc = acc;
            }

            if (this.selectedAccIdx > -1) {
                let accModel = {
                    name: acc.name,
                    UniqueName: acc?.uniqueName,
                    groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1],
                    account: acc.name
                };
                this.accountsTransaction[idx].particular = accModel?.UniqueName;
                this.accountsTransaction[idx].selectedAccount = accModel;
                this.accountsTransaction[idx].stocks = acc.stocks;
            }

            setTimeout(() => {
                // this.selectedInput.focus();
                this.showAccountList.emit(false);
            }, 50);
        } else {
            this.accountsTransaction.splice(idx, 1);
            if (!idx) {
                this.addNewRow('account');
            }
        }
    }

    /**
     * searchAccount in accountList
     */
    public searchAccount(str) {
        this.filterByText = str;
    }

    /**
     * searchStock
     */
    public searchStock(str) {
        // this.stockSearch = str;
        this.filterByText = str;
    }

    /**
     * addNewStock
     */
    public addNewStock(amount, transactionObj, idx) {
        let lastIdx = this.stocksTransaction.length - 1;
        if (amount) {
            transactionObj.amount = Number(amount);
        }
        if (amount && !transactionObj.inventory.stock && !transactionObj.inventory.stock.name) {
            this._toaster.errorToast("Stock can't be blank");
            return;
        }
        if (idx === lastIdx) {
            this.addNewRow('stock');
        }
        //
    }

    /**
     * openConfirmBox() to save entry
     */
    public openConfirmBox(submitBtnEle: HTMLButtonElement) {
        this.showLedgerAccountList = false;
        this.showStockList.emit(false);
        this.showConfirmationBox = true;
        if (this.data.description.length > 1) {
            this.data.description = this.data.description?.replace(/(?:\r\n|\r|\n)/g, '');
            setTimeout(() => {
                submitBtnEle.focus();
            }, 100);
        }
    }

    /**
     * refreshEntry
     */
    public refreshEntry() {
        this.stocksTransaction = [];
        this.accountsTransaction = [];
        this.showConfirmationBox = false;
        this.showAccountList.emit(false);
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.addNewRow('stock');
        this.addNewRow('account');
        this.data.entryDate = dayjs().format(GIDDH_DATE_FORMAT);
        this.entryDate = dayjs().format(GIDDH_DATE_FORMAT);
        this.creditorAcc = {};
        this.debtorAcc = {};
        this.stockTotal = null;
        this.accountsTotal = null;
        this.data.description = '';
        this.dateField?.nativeElement.focus();
        this.data.invoiceNumberAgainstVoucher = null;
    }

    /**
     * after init
     */
    public ngAfterViewInit() {
        //
    }

    /**
     * ngOnDestroy() on component destroy
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * setInvoiceDate
     */
    public setInvoiceDate(date) {
        this.showInvoiceDate = !this.showInvoiceDate;
    }

    /**
     * watchMenuEvent
     */
    public watchKeyboardEvent(event) {
        if (event) {
            let navigateTo = find(this.navigateURL, (o: any) => o.code === event.key);
            if (navigateTo) {
                this._router.navigate(['accounting', navigateTo.route]);
            }
        }
    }

    /**
     * removeBlankTransaction
     */
    public removeBlankTransaction(transactions) {
        forEach(transactions, function (obj: any) {
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
        let transactionArr = this.removeBlankTransaction(transactions);
        return transactionArr;
    }

    /**
     * onSelectStock
     */
    public onSelectStock(item) {
        if (item) {
            let idx = this.selectedRowIdx;
            let entryItem = cloneDeep(item);
            this.prepareEntry(entryItem, idx);
            setTimeout(() => {
                // this.selectedInput.focus();
                this.showStockList.emit(false);
            }, 50);
        } else {
            this.stocksTransaction.splice(this.selectedRowIdx);
            if (!this.selectedRowIdx) {
                this.addNewRow('stock');
            }
        }
    }

    /**
     * prepareEntry
     */
    public prepareEntry(item, stkIdx) {
        let defaultUnit = {
            stockUnitCode: item.stockUnit.name,
            code: item.stockUnit.code,
            rate: 0
        };
        // if (item.accountStockDetails.unitRates.length) {
        // this.stocksTransaction[stkIdx].inventory.unit = item.accountStockDetails.unitRates[0];
        this.stocksTransaction[stkIdx].inventory.unit.rate = item.amount / item.openingQuantity;
        // this.stocksTransaction[stkIdx].inventory.unit.code = item.accountStockDetails.unitRates[0].stockUnitCode;
        this.stocksTransaction[stkIdx].inventory.unit.code = item.stockUnit.code;
        this.stocksTransaction[stkIdx].inventory.unit.stockUnitCode = item.stockUnit.name;

        // } else if (!item.accountStockDetails.unitRates.length) {
        //   this.stocksTransaction[stkIdx].inventory.unit = defaultUnit;
        // }
        // this.stocksTransaction[stkIdx].particular = item.accountStockDetails.accountUniqueName;
        this.stocksTransaction[stkIdx].inventory.stock = { name: item.name, uniqueName: item?.uniqueName };
        // this.stocksTransaction[stkIdx].selectedAccount?.uniqueName = item.accountStockDetails.accountUniqueName;
        // this.stocksTransaction[stkIdx].selectedAccount.name = item.accountStockDetails.name;
    }

    /**
     * calculateAmount
     */
    public changeQuantity(idx, val) {
        let i = this.selectedRowIdx;
        this.stocksTransaction[i].inventory.quantity = Number(val);
        this.stocksTransaction[i].inventory.amount = Number((this.stocksTransaction[i].inventory.unit.rate * this.stocksTransaction[i].inventory.quantity).toFixed(2));
        this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
        this.amountChanged(idx);
    }

    /**
     * changePrice
     */
    public changePrice(idx, val) {
        let i = this.selectedRowIdx;
        this.stocksTransaction[i].inventory.unit.rate = Number(cloneDeep(val));
        this.stocksTransaction[i].inventory.amount = Number((this.stocksTransaction[i].inventory.unit.rate * this.stocksTransaction[i].inventory.quantity).toFixed(2));
        this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
        this.amountChanged(idx);
    }

    /**
     * amountChanged
     */
    public amountChanged(idx) {
        let i = this.selectedRowIdx;
        if (this.stocksTransaction[i] && this.stocksTransaction[idx].inventory.stock && this.stocksTransaction[i].inventory.quantity) {
            if (this.stocksTransaction[i].inventory.quantity) {
                this.stocksTransaction[i].inventory.unit.rate = Number((this.stocksTransaction[i].inventory.amount / this.stocksTransaction[i].inventory.quantity).toFixed(2));
            }
        }
        this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
        let stockTotal = sumBy(this.stocksTransaction, (o: any) => Number(o.inventory.amount));
        this.stockTotal = stockTotal;
    }

    public calculateRate(idx, val) {
        if (val) {
            this.accountsTransaction[idx].amount = Number(this.stockTotal * val / 100);
        }
        this.calculateAmount();
    }

    public changeTotal(idx, val) {
        if (val) {
            this.accountsTransaction[idx].rate = null;
        }
        this.calculateAmount();
    }

    /**
     * calculateAmount
     */
    public calculateAmount() {
        let Total = sumBy(this.accountsTransaction, (o) => Number(o.amount));
        this.accountsTotal = Total;
    }

    /**
     * changeStock
     */
    public changeStock(idx, val) {
        let i = this.selectedRowIdx;
        if (!val) {
            if (this.stocksTransaction[i].inventory && this.stocksTransaction[i].inventory.length) {
                this.stocksTransaction[i].inventory.splice(idx, 1);
            }
            // this.showStockList.emit(false);
            // if (!this.data.transactions.length) {
            //   this.addNewRow('stock');
            // }
            this.amountChanged(idx);
        }
    }

    /**
     * saveEntry
     */
    public saveEntry() {
        if (!this.creditorAcc?.uniqueName) {
            this._toaster.errorToast("Party A/c Name can't be blank.");
            return setTimeout(() => this.partyAccNameInputField?.nativeElement.focus(), 200);
        }
        let data = cloneDeep(this.data);
        data.generateInvoice = data.invoiceNumberAgainstVoucher ? !!data.invoiceNumberAgainstVoucher.trim() : false;
        // let idx = 0;
        data.transactions = this.prepareDataForVoucher();
        data = this._tallyModuleService.prepareRequestForAPI(data);
        data.transactions = this.validateTransaction(data.transactions);

        let accUniqueName: string = this.creditorAcc?.uniqueName;

        forEach(data.transactions, (element: any) => {
            element.type = (element.type === 'by') ? 'debit' : 'credit';
        });

        if (data.voucherType === 'Sales') {
            forEach(data.transactions, (element: any) => {
                if (!element.particular) {
                    element.particular = 'sales';
                }
                element.type = 'debit';
            });
        } else if (data.voucherType === 'Purchase') {
            forEach(data.transactions, (element: any) => {
                if (!element.particular) {
                    element.particular = 'purchases';
                }
                element.type = 'credit';
            });
        } else if (data.voucherType === 'Credit note') {
            forEach(data.transactions, (element: any) => {
                if (!element.particular) {
                    element.particular = 'sales';
                }
                element.type = 'credit';
            });
        } else if (data.voucherType === 'Debit note') {
            forEach(data.transactions, (element: any) => {
                if (!element.particular) {
                    element.particular = 'purchases';
                }
                element.type = 'debit';
            });
        }

        this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
    }

    public prepareDataForInvoice(data) {
        let stocksTransaction = [];
        let accountsTransaction = [];
        let filterData = this._tallyModuleService.prepareRequestForAPI(data);

        if (filterData.transactions.length) {
            forEach(filterData.transactions, function (o, i) {
                if (o.inventory && o.inventory.amount) {
                    stocksTransaction.push(o);
                } else {
                    o.inventory = {};
                    accountsTransaction.push(o);
                }
            });
            this.accountsTransaction = accountsTransaction;
            this.stocksTransaction = stocksTransaction;

            if (!stocksTransaction.length) {
                this.addNewRow('stock');
            }
            if (!accountsTransaction.length) {
                this.addNewRow('account');
            }
        }
    }

    public prepareDataForVoucher() {
        let transactions = concat(cloneDeep(this.accountsTransaction), cloneDeep(this.stocksTransaction));
        //  let result = _.chain(transactions).groupBy('particular').value();
        transactions = orderBy(transactions, 'type');
        forEach(transactions, function (obj, idx) {
            let inventoryArr = [];
            if (obj.inventory && obj.inventory.amount) {
                inventoryArr.push(obj.inventory);
                obj.inventory = inventoryArr;
            } else {
                obj.inventory = inventoryArr;
            }
        });
        return transactions;
    }

    // public detectKey(ev) {
    //   if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
    //    this.arrowInput = { key: ev.keyCode };
    //   }
    // }

    public detectKey(ev, isFirstAccountField = false) {
        this.keyUpDownEvent = ev;
        if (ev && ev.which === 8 && isFirstAccountField) {
            if (ev.target && (ev.target.getAttribute('data-changed') === 'false' || ev.target.value === '')) {
                let indx = this.stocksTransaction.length - 1;
                let stockEle = document.getElementById(`stock_${indx - 1}`);
                return stockEle.focus();
            }
        }
        // if (ev.keyCode === 27) {
        //  this.deleteRow(this.selectedRowIdx);
        // }
        // if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
        //  this.arrowInput = { key: ev.keyCode };
        // }
    }

    /**
     * hideListItems
     */
    public hideListItems() {
        if (!this.isPartyACFocused) {
            this.showStockList.emit(false);
            this.showAccountList.emit(false);
        }
    }

    public dateEntered() {
        const date = dayjs(this.entryDate, GIDDH_DATE_FORMAT);
        if (dayjs(date).format('dddd') !== 'Invalid date') {
            this.displayDay = dayjs(date).format('dddd');
        } else {
            this.displayDay = '';
        }
    }

    public onStockFocus(ev, indx: number) {
        this.selectedStockInputField = ev.target;
        this.showConfirmationBox = false;
        this.selectRow(true, indx);
        this.selectedField = 'stock';
        this.getFlattenGrpofAccounts(this.groupUniqueName);
    }

    /**
     * getFlattenGrpofAccounts
     */
    public getFlattenGrpofAccounts(parentGrpUnqName, q?: string, forceRefresh: boolean = false, focusTargetElement: boolean = false) {
        if (this.allStocks && this.allStocks.length && !forceRefresh) {
            this.sortStockItems(cloneDeep(this.allStocks));
        } else {
            this.inventoryService.GetStocks().pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data.status === 'success') {
                    this.sortStockItems(data.body.results);
                    this.allStocks = cloneDeep(data.body.results);
                    if (focusTargetElement) {
                        this.selectedStockInputField.focus();
                    }
                }
            });
        }
    }

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
        setTimeout(() => {
            this.showLedgerAccountList = true;
        }, 200);
    }

    public onItemSelected(ev: IOption) {
        setTimeout(() => {
            this.currentSelectedValue = '';
            this.showLedgerAccountList = false;
        }, 200);

        if (ev.value === 'createnewitem') {
            return this.showQuickAccountModal();
        }

        if (this.selectedField === 'account') {
            this.setAccount(ev.additional);
            setTimeout(() => {
                let accIndx = this.accountsTransaction.findIndex((acc) => acc.selectedAccount?.UniqueName === ev.value);
                let indexInTaxesToRemember = this.taxesToRemember.findIndex((t) => t.taxUniqueName === ev.value);
                if (indexInTaxesToRemember > -1 && accIndx > -1) {
                    let rate = this.taxesToRemember[indexInTaxesToRemember].taxValue;
                    this.accountsTransaction[accIndx].rate = rate;
                    this.calculateRate(accIndx, rate);
                }
            }, 100);
        } else if (this.selectedField === 'stock') {
            let stockUniqueName = ev.value;
            let taxIndex = this.taxesToRemember.findIndex((i) => i.stockUniqueName === stockUniqueName);
            if (taxIndex === -1) {
                this.inventoryService.GetStockUniqueNameWithDetail(stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((stockFullDetails) => {
                    if (stockFullDetails && stockFullDetails.body.taxes && stockFullDetails.body.taxes.length) {
                        this.companyTaxesList$.pipe(take(1)).subscribe((taxes: TaxResponse[]) => {
                            stockFullDetails.body.taxes.forEach((tax: string) => {
                                // let selectedTaxAcc = this.allFlattenAccounts.find((acc) => acc?.uniqueName === tax);
                                // if (selectedTaxAcc) {
                                // let acc = selectedTaxAcc;
                                // let accModel = {
                                //   name: acc.name,
                                //   UniqueName: acc?.uniqueName,
                                //   groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1],
                                //   account: acc.name
                                // };
                                // this.accountsTransaction[0].particular = accModel?.UniqueName;
                                // this.accountsTransaction[0].selectedAccount = accModel;
                                // this.accountsTransaction[0].stocks = acc.stocks;
                                // }

                                let selectedTax = taxes.find((t) => t?.uniqueName === tax);
                                let taxTotalValue = 0;
                                if (selectedTax) {
                                    selectedTax.taxDetail.forEach((st) => {
                                        taxTotalValue += st.taxValue;
                                    });
                                }
                                let taxIndx = this.taxesToRemember.findIndex((i) => i.taxUniqueName === tax);
                                if (taxIndx === -1) {
                                    this.taxesToRemember.push({ stockUniqueName, taxUniqueName: tax, taxValue: taxTotalValue });
                                }
                            });
                        });
                    }
                });
            }

            this.onSelectStock(ev.additional);
        } else if (this.selectedField === 'partyAcc') {
            this.setAccount(ev.additional);
        }
    }

    public loadQuickAccountComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
        let viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let componentInstance = componentRef.instance as QuickAccountComponent;
        componentInstance.needAutoFocus = true;
        componentInstance.closeQuickAccountModal.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            this.hideQuickAccountModal();
            componentInstance.needAutoFocus = false;
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
            this.dateField?.nativeElement.focus();
            if (this.selectedAccountInputField) {
                this.selectedAccountInputField.value = '';
            }
        });
        componentInstance.isQuickAccountCreatedSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe((status: boolean) => {
            if (status) {
                this.refreshAccountListData(null, true);
            }
        });
    }

    public showQuickAccountModal() {
        if (this.selectedField === 'account') {
            this.loadQuickAccountComponent();
            this.quickAccountModal.show();
        } else if (this.selectedField === 'stock') {
            this.asideMenuStateForProductService = 'in'; // selectedEle.getAttribute('data-changed')
            // let selectedField = window.document.querySelector('input[onReturn][type="text"][data-changed="true"]');
            // this.selectedStockInputField = selectedField;
            this.autoFocusStockGroupField = true;
        }
    }

    public hideQuickAccountModal() {
        this.quickAccountModal.hide();
    }


    public onPartyAccFocusInput(ev, accCategory: string = null) {
        this.selectedAccountInputField = ev.target;
        this.showConfirmationBox = false;
        this.accountType = 'creditor';
        this.isPartyACFocused = true;
        this.selectedField = 'partyAcc';
        setTimeout(() => {
            this.currentSelectedValue = '';
            this.showLedgerAccountList = true;
            this.filterByText = '';
        }, 10);
    }

    public onPartyAccFocus(ev, accCategory: string = null) {
        this.selectedAccountInputField = ev.target;
        this.showConfirmationBox = false;
        this.getFlattenGrpAccounts(null, false);
        this.refreshAccountListData(accCategory);
        this.accountType = 'creditor';
        this.isPartyACFocused = true;
        this.selectedField = 'partyAcc';
        setTimeout(() => {
            this.currentSelectedValue = '';
            this.showLedgerAccountList = true;
            this.filterByText = '';
        }, 10);
    }

    public onPartyAccBlur(needRefreshAccounts: boolean = false) {
        // this.showAccountList.emit(false);
        // selectedInput=creditor;
        // this.isPartyACFocused = false;
        // setTimeout(() => {
        //   this.currentSelectedValue = '';
        //   this.showLedgerAccountList = false;
        // }, 200);
        this.filterByText = '';
        this.currentSelectedValue = '';
        this.showLedgerAccountList = false;
        if (needRefreshAccounts) {
            this.refreshAccountListData();
        }
    }

    public closeCreateStock() {
        this.asideMenuStateForProductService = 'out';
        this.autoFocusStockGroupField = false;
        // after creating stock, get all stocks again
        this.selectedStockInputField.value = '';
        this.filterByText = '';
        // this.partyAccNameInputField.nativeElement.focus();
        this.dateField?.nativeElement.focus();
        this.getFlattenGrpofAccounts(null, null, true, true);
    }

    public addNewAccount(val, lastIdx) {
        if (val && lastIdx) {
            this.addNewRow('account');
        }
    }

    public checkIfEnteredAmountIsZero(amount, indx, transactionType) {
        if (!Number(amount)) {
            if (transactionType === 'stock') {
                if (indx === 0) {
                    this.dateField?.nativeElement.focus();
                } else {
                    let stockEle = document.getElementById(`stock_${indx - 1}`);
                    stockEle.focus();
                }
                this.stocksTransaction.splice(indx, 1);
            } else if (transactionType === 'account') {
                if (indx === 0) {
                    this.dateField?.nativeElement.focus();
                } else {
                    let accountEle = document.getElementById(`account_${indx - 1}`);
                    accountEle.focus();
                }
                this.accountsTransaction.splice(indx, 1);
            }
        }
    }

    public keyUpOnSubmitButton(e) {
        if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
            return setTimeout(() => this.resetButton?.nativeElement.focus(), 50);
        }
        if (e && (e.keyCode === 8 || e.which === 8)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox?.nativeElement.focus(), 50);
        }
    }

    public keyUpOnResetButton(e) {
        if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
            return setTimeout(() => this.submitButton?.nativeElement.focus(), 50);
        }
        if (e && (e.keyCode === 13 || e.which === 13)) {
            this.showConfirmationBox = false;
            return setTimeout(() => this.narrationBox?.nativeElement.focus(), 50);
        }
    }

    // public keyUpOnSubmitButton(e) {
    //   if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
    //     return setTimeout(() => this.resetButton.nativeElement.focus(), 50);
    //   }
    //   if (e && (e.keyCode === 8 || e.which === 8)) {
    //     this.showConfirmationBox = false;
    //     return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
    //   }
    // }

    // public keyUpOnResetButton(e) {
    //   if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
    //     return setTimeout(() => this.submitButton.nativeElement.focus(), 50);
    //   }
    //   if (e && (e.keyCode === 13 || e.which === 13)) {
    //     this.showConfirmationBox = false;
    //     return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
    //   }
    // }

    private deleteRow(idx: number) {
        this.stocksTransaction.splice(idx, 1);
        if (!idx) {
            this.addNewRow('stock');
        }
    }

    private refreshAccountListData(groupUniqueName: string = null, needToFocusSelectedInputField: boolean = false) {
        this.store.pipe(select(p => p.session.companyUniqueName), take(1)).subscribe(a => {
            if (a && a !== '') {
                this._accountService.getFlattenAccounts('', '', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data.status === 'success') {
                        this.allFlattenAccounts = cloneDeep(data.body.results);
                        if (groupUniqueName) {
                            const filteredAccounts: IFlattenAccountsResultItem[] = data.body.results?.filter((acc) => acc.parentGroups.findIndex((g) => g?.uniqueName === groupUniqueName) > -1);
                            this._tallyModuleService.setFlattenAccounts(filteredAccounts);
                            this.isAccountListFiltered = true;
                        } else {
                            this._tallyModuleService.setFlattenAccounts(data.body.results);
                            this.isAccountListFiltered = false;
                        }
                        if (needToFocusSelectedInputField) {
                            this.selectedAccountInputField.focus();
                        }
                    }
                });
            }
        });
    }
}
