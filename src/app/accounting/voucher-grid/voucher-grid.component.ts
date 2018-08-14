import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InventoryService } from 'app/services/inventory.service';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { setTimeout } from 'timers';
import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { LedgerActions } from './../../actions/ledger/ledger.actions';
import { IOption } from './../../theme/ng-select/option.interface';
import { AccountService } from './../../services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import * as _ from 'app/lodash-optimized';
import * as moment from 'moment';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { TallyModuleService } from 'app/accounting/tally-service';
import { AccountResponse } from '../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { QuickAccountComponent } from '../../theme/quick-account-component/quickAccount.component';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';

const TransactionsType = [
  { label: 'By', value: 'Debit' },
  { label: 'To', value: 'Credit' },
];

const CustomShortcode = [
  { code: 'F9', route: 'purchase' }
];

@Component({
  selector: 'account-as-voucher',
  templateUrl: './voucher-grid.component.html',
  styleUrls: ['../accounting.component.css']
})

export class AccountAsVoucherComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() public openDatePicker: boolean;
  @Input() public openCreateAccountPopup: boolean;
  @Input() public newSelectedAccount: AccountResponse;
  @Output() public showAccountList: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('quickAccountComponent') public quickAccountComponent: ElementViewContainerRef;
  @ViewChild('quickAccountModal') public quickAccountModal: ModalDirective;

  @ViewChild('chequeEntryModal') public chequeEntryModal: ModalDirective;

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @ViewChild('particular') public accountField: any;
  @ViewChild('dateField') public dateField: ElementRef;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private allStocks: any[];

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private flyAccountActions: FlyAccountsActions,
    private _toaster: ToasterService, private _router: Router,
    private _tallyModuleService: TallyModuleService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private inventoryService: InventoryService,
    private fb: FormBuilder) {
    this.requestObj.transactions = [];
    this._keyboardService.keyInformation.subscribe((key) => {
      this.watchKeyboardEvent(key);
    });

    this._tallyModuleService.selectedPageInfo.distinctUntilChanged((p, q) => {
      if (p && q) {
        return (_.isEqual(p, q));
      }
      if ((p && !q) || (!p && q)) {
        return false;
      }
      return true;
     }).subscribe((d) => {
      if (d && d.gridType === 'voucher') {
        this.requestObj.voucherType = d.page;
        setTimeout(() => {
          // document.getElementById('first_element_0').focus();
          this.dateField.nativeElement.focus();
        }, 50);
      } else if (d) {
        this._tallyModuleService.requestData.next(this.requestObj);
      }
    });
  }

  public ngOnInit() {

    this.chequeDetailForm = this.fb.group({
      chequeClearanceDate: ['', [Validators.required]],
      chequeNumber: ['', [Validators.required]]
    }),

    this._tallyModuleService.requestData.distinctUntilChanged((p, q) => {
      if (p && q) {
        return (_.isEqual(p, q));
      }
      if ((p && !q) || (!p && q)) {
        return false;
      }
      return true;
     }).subscribe((data) => {
      if (data) {
        this.requestObj = _.cloneDeep(data);
      }
    });

    this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$).subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.refreshEntry();
        this.store.dispatch(this._ledgerActions.ResetLedger());
        this.requestObj.description = '';
        this.dateField.nativeElement.focus();
      }
    });

    this.refreshEntry();

    // this._tallyModuleService.selectedPageInfo.distinctUntilChanged((p, q) => {
    //   if (p && q) {
    //     return (_.isEqual(p, q));
    //   }
    //   if ((p && !q) || (!p && q)) {
    //     return false;
    //   }
    //   return true;
    //  }).subscribe(() => {

    // });

    this._tallyModuleService.filteredAccounts.subscribe((accounts) => {
      if (accounts) {
        let accList: IOption[] = [];
        accounts.forEach((acc: IFlattenAccountsResultItem) => {
          accList.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName, additional: acc });
        });
        this.flattenAccounts = accList;
        this.inputForList = _.cloneDeep(this.flattenAccounts);
      }
    });
  }

  public ngOnChanges(c: SimpleChanges) {
    if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
      this.showFromDatePicker = c.openDatePicker.currentValue;
      this.dateField.nativeElement.focus();
    }
    if ('openCreateAccountPopup' in c && c.openCreateAccountPopup.currentValue !== c.openCreateAccountPopup.previousValue) {
      if (c.openCreateAccountPopup.currentValue) {
        this.showQuickAccountModal();
      }
      // else {
      //   this.hideQuickAccountModal();
      // }
    }
  }

  /**
   * newEntryObj() to push new entry object
   */
  public newEntryObj() {
    this.requestObj.transactions.push({
      amount: null,
      particular: '',
      applyApplicableTaxes: false,
      isInclusiveTax: false,
      type: 'to',
      taxes: [],
      total: null,
      discounts: [],
      inventory: [],
      selectedAccount: {
        name: '',
        UniqueName: '',
        groupUniqueName: '',
        account: ''
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
  }

  /**
   * selectEntryType() to validate Type i.e BY/TO
   */
  public selectEntryType(transactionObj, val, idx) {
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
  public onAccountFocus(elem, trxnType, indx) {
    this.selectedField = 'account';
    this.showConfirmationBox = false;
    this.inputForList = _.cloneDeep(this.flattenAccounts);
    this.selectedParticular = elem;
    this.selectRow(true, indx);
    this.filterAccount(trxnType);
    setTimeout(() => {
      this.showLedgerAccountList = true;
    }, 200);
  }

  public onStockFocus(stockIndx: number, indx: number) {
    this.selectedField = 'stock';
    this.showConfirmationBox = false;
    this.selectedStockIdx = stockIndx;
    this.selectedIdx = indx;
    // this.getStock(this.groupUniqueName);
    this.getStock();
    this.showLedgerAccountList = true;
  }

  /**
   * onAccountBlur to hide accountList
   */
  public onAccountBlur(ev) {
    this.arrowInput = { key: 0 };
    // this.showStockList = false;
    // this.showStockList.next(true);
    if (this.accountSearch) {
      this.searchAccount('');
      this.accountSearch = '';
    }
    this.showLedgerAccountList = false;
    // this.showAccountList.emit(false);
  }

  public onAmountFieldBlur(ev) {
    //
  }

  public onSubmitChequeDetail() {
    const chequeDetails = this.chequeDetailForm.value;
    this.requestObj.chequeNumber = chequeDetails.chequeNumber;
    this.requestObj.chequeClearanceDate = chequeDetails.chequeClearanceDate;
    this.closeChequeDetailForm();
    setTimeout(() => {
      this.selectedParticular.focus();
    }, 10);
  }

  public closeChequeDetailForm() {
    this.chequeEntryModal.hide();
  }

  public openChequeDetailForm(account) {
    this.chequeEntryModal.show();
  }

  /**
   * setAccount` in particular, on accountList click
   */
  public setAccount(acc) {
    if (acc.parentGroups.find((pg) => pg.uniqueName === 'bankaccounts') && (!this.requestObj.chequeNumber && !this.requestObj.chequeClearanceDate)) {
      this.openChequeDetailForm(acc);
    }
    let idx = this.selectedIdx;
    let transaction = this.requestObj.transactions[idx];
    if (acc) {
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

      // tally difference amount
      transaction.amount = this.calculateDiffAmount(transaction.type);
      transaction.amount = transaction.amount ? transaction.amount : null;

      if (acc) {
        this.groupUniqueName = accModel.groupUniqueName;
        this.selectAccUnqName = acc.uniqueName;

        let len = this.requestObj.transactions[idx].inventory ? this.requestObj.transactions[idx].inventory.length : 0;
        if (!len || this.requestObj.transactions[idx].inventory && this.requestObj.transactions[idx].inventory[len - 1].stock.uniqueName) {
          this.requestObj.transactions[idx].inventory.push(this.initInventory());
        }
      }

      // Alok Sir
      // if (acc && acc.stocks) {
      //   this.groupUniqueName = accModel.groupUniqueName;
      //   this.selectAccUnqName = acc.uniqueName;
      //   this.requestObj.transactions[idx].inventory.push(this.initInventory());
      // } else if (!acc.stocks) {
      //   setTimeout(() => {
      //     this.selectedParticular.focus();
      //   }, 200);
      // }

    } else {
      this.deleteRow(idx);
    }
  }

  /**
   * searchAccount in accountList
   */
  public searchAccount(str) {
    this.filterByText = str;
    // this.accountSearch = str;
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
   * onAmountField() on amount, event => Blur, Enter, Tab
   */
  public addNewEntry(amount, transactionObj, idx) {
    let indx = idx;
    let lastIndx = this.requestObj.transactions.length - 1;

    if (amount) {
      transactionObj.amount = Number(amount);
      transactionObj.total = transactionObj.amount;
    }

    if (indx === lastIndx && this.requestObj.transactions[indx].selectedAccount.name) {
      this.newEntryObj();
    }

    let debitTransactions = _.filter(this.requestObj.transactions, (o: any) => o.type === 'by');
    this.totalDebitAmount = _.sumBy(debitTransactions, (o: any) => Number(o.amount));
    let creditTransactions = _.filter(this.requestObj.transactions, (o: any) => o.type === 'to');
    this.totalCreditAmount = _.sumBy(creditTransactions, (o: any) => Number(o.amount));
  }

  /**
   * openConfirmBox() to save entry
   */
  public openConfirmBox(submitBtnEle: HTMLButtonElement) {
    if (this.requestObj.transactions.length > 2) {
      this.showConfirmationBox = true;
      if (this.requestObj.description) {
        this.requestObj.description = this.requestObj.description.replace(/(?:\r\n|\r|\n)/g, '');
      }
      setTimeout(() => {
        submitBtnEle.focus();
      }, 100);
    } else {
      this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
      return;
    }
  }

  /**
   * saveEntry
   */
  public saveEntry() {
    let idx = 0;
    let data = _.cloneDeep(this.requestObj);
    const voucherType = _.clone(data.voucherType);
    data.entryDate = this.journalDate;
    // data.transactions = this.removeBlankTransaction(data.transactions);
    data.transactions = this.validateTransaction(data.transactions);

    if (!data.transactions) {
      return;
    }

    const foundContraEntry: boolean = this.validateForContraEntry(data);
    const foundSalesAndBankEntry: boolean = this.validateForSalesAndPurchaseEntry(data);

    if (foundContraEntry && data.voucherType !== 'Contra') {
      this._toaster.errorToast('Contra entry (Cash + Bank), not allowed in ' + data.voucherType, 'Error');
      return;
    }
    if (!foundContraEntry && data.voucherType === 'Contra') {
      this._toaster.errorToast('There should be Cash and Bank entry in contra.', 'Error');
      return;
    }

    // This suggestion was given by Sandeep
    if (foundSalesAndBankEntry && data.voucherType === 'Journal') {
      this._toaster.errorToast('Sales and Purchase entry not allowed in journal.', 'Error');
      return;
    }

    if (this.totalCreditAmount === this.totalDebitAmount) {
      if (this.validatePaymentAndReceipt(data)) {
        _.forEach(data.transactions, (element: any) => {
          element.type = (element.type === 'by') ? 'credit' : 'debit';
        });
        let accUniqueName: string = _.maxBy(data.transactions, (o: any) => o.amount).selectedAccount.UniqueName;
        let indexOfMaxAmountEntry = _.findIndex(data.transactions, (o: any) => o.selectedAccount.UniqueName === accUniqueName);
        data.transactions.splice(indexOfMaxAmountEntry, 1);
        data = this._tallyModuleService.prepareRequestForAPI(data);
        this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
      } else {
        const byOrTo = data.voucherType === 'Payment' ? 'to' : 'by';
        this._toaster.errorToast('Please select at least one cash or bank account in ' + byOrTo.toUpperCase(), 'Error');
      }
    } else {
      this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
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
    this.newEntryObj();
    this.requestObj.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.journalDate = moment().format(GIDDH_DATE_FORMAT);
    this.requestObj.transactions[0].type = 'by';
    this.requestObj.description = '';
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
        this._router.navigate(['accounting', navigateTo.route]);
      }
    }
  }

  /**
   * removeBlankTransaction
   */
  public removeBlankTransaction(transactions) {
    _.forEach(transactions, function(obj: any, idx) {
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
    _.forEach(validEntry, function(obj: any, idx) {
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
      return false;
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
      // console.log(item);
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
      this.requestObj.transactions[idx].inventory[i].unit.rate = item.amount / item.openingQuantity; // Kunal
      this.requestObj.transactions[idx].inventory[i].unit.code = item.stockUnit.code;
      this.requestObj.transactions[idx].inventory[i].unit.stockUnitCode = item.stockUnit.name;

      // this.requestObj.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
      this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item.uniqueName};
      // this.requestObj.transactions[idx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
      this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
    }

  }

    /**
   * changePrice
   */
  public changePrice(idx, val) {
    let i = this.selectedIdx;
    this.requestObj.transactions[i].inventory[idx].unit.rate = Number(_.cloneDeep(val));
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
      this._tallyModuleService.selectedFieldType.next(byOrTo);
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
    const date = moment(this.journalDate, 'DD-MM-YYYY');
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
    // console.log(transactionObj, ev);
  }

  public onItemSelected(ev: IOption) {
    if (this.selectedField === 'account') {
      this.setAccount(ev.additional);
    } else if (this.selectedField === 'stock') {
      this.onSelectStock(ev.additional);
    }
    setTimeout(() => {
      this.currentSelectedValue = '';
      this.showLedgerAccountList = false;
    }, 200);
  }

  /**
   * getStock
   */
  public getStock(parentGrpUnqName?, q?: string) {
    if (this.allStocks && this.allStocks.length) {
      // this.inputForList = _.cloneDeep(this.allStocks);
      this.sortStockItems(_.cloneDeep(this.allStocks));
    } else {
      const reqArray = parentGrpUnqName ? [parentGrpUnqName] : null;
      this.inventoryService.GetStocks().takeUntil(this.destroyed$).subscribe(data => {
        if (data.status === 'success') {
          this.allStocks = _.cloneDeep(data.body.results);
          this.sortStockItems(this.allStocks);
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
    componentInstance.closeQuickAccountModal.subscribe((a) => {
      this.hideQuickAccountModal();
      componentInstance.newAccountForm.reset();
      componentInstance.destroyed$.next(true);
      componentInstance.destroyed$.complete();
    });
    componentInstance.isQuickAccountCreatedSuccessfully$.subscribe((status: boolean) => {
      if (status) {
        this.refreshAccountListData();
      }
    });
  }

  public showQuickAccountModal() {
    this.loadQuickAccountComponent();
    this.quickAccountModal.show();
  }

  public hideQuickAccountModal() {
    this.quickAccountModal.hide();
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

  private refreshAccountListData() {
    this.store.select(p => p.session.companyUniqueName).subscribe(a => {
      if (a && a !== '') {
        this._accountService.GetFlattenAccounts('', '', '').takeUntil(this.destroyed$).subscribe(data => {
        if (data.status === 'success') {
          this._tallyModuleService.setFlattenAccounts(data.body.results);
        }
      });
      }
    });
  }
}
