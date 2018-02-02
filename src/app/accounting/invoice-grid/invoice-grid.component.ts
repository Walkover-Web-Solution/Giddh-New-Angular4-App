import { TallyModuleService } from './../tally-service';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { CreatedBy } from './../../models/api-models/Invoice';
import { IParticular, LedgerRequest } from './../../models/api-models/Ledger';
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
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList, transition, ElementRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { LedgerVM, BlankLedgerVM } from 'app/ledger/ledger.vm';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { SalesActions } from 'app/actions/sales/sales.action';

const TransactionsType = [
  { label: 'By', value: 'Debit' },
  { label: 'To', value: 'Credit' },
];

const CustomShortcode = [
  { code: 'F9', route: 'purchase' }
];

@Component({
  selector: 'account-as-invoice',
  templateUrl: './invoice-grid.component.html',
  styleUrls: ['./invoice-grid.component.css', '../accounting.component.css']
})

export class AccountAsInvoiceComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @ViewChild('particular') public accountField: any;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

  public showAccountList: boolean = true;
  public TransactionType: 'by' | 'to' = 'by';
  public data: any = new BlankLedgerVM();
  public totalCreditAmount: number = 0;
  public totalDebitAmount: number = 0;
  public showConfirmationBox: boolean = false;
  public moment = moment;
  public accountSearch: string = '';
  public stockSearch: string;
  public selectedStockIdx: any;
  public isSelectedRow: boolean;
  public selectedInput: any;
  public showFromDatePicker: boolean = false;
  public entryDate: any;
  public navigateURL: any = CustomShortcode;
  public showInvoiceDate: boolean = false;
  public purchaseType: string = 'invoice';
  public groupUniqueName: string;
  public filterByGrp: boolean = false;
  public showStockList: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public selectedAcc: object;
  public accountType: string;
  public accountsTransaction = [];
  public selectedAccIdx: any;
  public creditorAcc: any = {};
  public debtorAcc: any = {};
  public stockTotal = null;
  public accountsTotal = null;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private flyAccountActions: FlyAccountsActions,
    private _toaster: ToasterService,
    private _router: Router,
    private _salesActions: SalesActions,
    private _tallyModuleService: TallyModuleService,
  ) {
    this.data.transactions = [];
    this.data.transactions.inventory = [];
    this._keyboardService.keyInformation.subscribe((key) => {
      this.watchKeyboardEvent(key);
    });
      // this.store.dispatch(this._salesActions.getFlattenAcOfPurchase({groupUniqueNames: ['purchases']}));
  }

  public ngOnInit() {

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
        this.data = _.cloneDeep(data);
      }
    });

    this._tallyModuleService.selectedPageInfo.subscribe((d) => {
      if (d) {
        this.data.voucherType = d.page;
      }
    });

    this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$).subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.refreshEntry();
      }
    });
    this.refreshEntry();
    // this.data.transactions[this.data.transactions.length - 1].inventory.push(this.initInventory());

    this._tallyModuleService.selectedPageInfo.subscribe(() => {
      this._tallyModuleService.requestData.next(this.data);
    });
  }

  /**
   * newRowType() to push new object
   */
  public newRowType(type) {
    let entryObj = {
      amount: null,
      particular: '',
      applyApplicableTaxes: false,
      isInclusiveTax: false,
      type: 'By',
      taxes: [],
      total: null,
      discounts: [],
      inventory: [this.initInventory()],
      selectedAccount: {
        name: '',
        uniqueName: ''
      }
    };

    if (type === 'stock') {
      this.data.transactions.push(entryObj);
    } else if (type === 'account') {
      this.accountsTransaction.push(entryObj);
    }
  }

  /**
   * selectRow() on entryObj focus/blur
   */
  public selectRow(type: boolean, idx) {
    this.isSelectedRow = type;
    this.selectedStockIdx = idx;
    this.selectedAccIdx = null;
  }

  /**
   * selectAccountRow() on entryObj focus/blur
   */
  public selectAccountRow(type: boolean, idx) {
    this.isSelectedRow = type;
    this.selectedAccIdx = idx;
    this.selectedStockIdx = null;
  }

  /**
   * getFlattenGrpAccounts
   */
  public getFlattenGrpAccounts(groupUniqueName, filter) {
    this.showAccountList = true;
    this.groupUniqueName = groupUniqueName;
    this.filterByGrp = filter;
    this.showStockList.next(false);
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
    this.selectedInput = elem;
    // if (!this.stockSearch) {
    //   this.searchStock('');
    //   this.stockSearch = '';
    // }
  }

  /**
   * setAccount` in particular, on accountList click
   */
  public setAccount(acc) {
    let idx = this.selectedAccIdx;

    if (this.accountType === 'creditor') {
      this.creditorAcc = acc;
      return this.accountType = null;
    } else if (this.accountType === 'debitor') {
      this.debtorAcc = acc;
    }

    if (this.selectedAccIdx > -1) {
      let accModel = {
        name: acc.name,
        UniqueName: acc.uniqueName,
        groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1],
        account: acc.name
      };
      this.accountsTransaction[idx].particular = accModel.UniqueName;
      this.accountsTransaction[idx].selectedAccount = accModel;
    }
    setTimeout(() => {
      this.selectedInput.focus();
      this.showAccountList = false;
    }, 50);
  }

  /**
   * searchAccount in accountList
   */
  public searchAccount(str) {
    this.accountSearch = str;
  }

  /**
   * searchStock
   */
  public searchStock(str) {
    this.stockSearch = str;
  }

  /**
   * addNewStock
   */
  public addNewStock(amount, transactionObj, idx) {
    let indx = idx;
    let lastIndx = this.data.transactions.length - 1;

    if (amount) {
      transactionObj.amount = Number(amount);
      transactionObj.total = transactionObj.amount;
    }

    if (transactionObj.inventory.quantity) {
      this.data.transactions[indx].inventory.quantity = _.cloneDeep(Number(transactionObj.inventory.quantity));
    }

    if (indx === lastIndx && this.data.transactions[indx].inventory.stock.name) {
      this.newRowType('stock');
    } else if (indx === lastIndx && !this.data.transactions[indx].inventory.stock.name) {
      this.newRowType('account');
    }
  }

  /**
   * openConfirmBox() to save entry
   */
  public openConfirmBox(submitBtnEle: HTMLButtonElement) {
    this.showConfirmationBox = true;
    if (this.data.description) {
      this.data.description = this.data.description.replace(/(?:\r\n|\r|\n)/g, '');
    }
    setTimeout(() => {
      submitBtnEle.focus();
    }, 100);
  }

  /**
   * refreshEntry
   */
  public refreshEntry() {
    this.data.transactions = [];
    this.accountsTransaction = [];
    this.showConfirmationBox = false;
    this.showAccountList = false;
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;
    this.newRowType('stock');
    this.newRowType('account');
    this.data.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.entryDate = moment();
    this.creditorAcc = {};
    this.debtorAcc = {};
    this.stockTotal = null;
    this.accountsTotal = null;
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
    this.data.entryDate = moment(date).format(GIDDH_DATE_FORMAT);
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
      let navigateTo = _.find(this.navigateURL, (o: any) => o.code === event.key);
      if (navigateTo) {
        this._router.navigate(['accounting', navigateTo.route]);
      }
    }
  }

  /**
   * removeBlankTransaction
   */
  public removeBlankTransaction(transactions, type) {
    if (type === 'stock') {
      _.forEach(transactions, function(obj: any, idx) {
        if (obj && !obj.inventory.stock.name && !obj.amount) {
          transactions = _.without(transactions, obj);
        }
      });
    } else if (type === 'account') {
      _.forEach(transactions, function(obj: any, idx) {
        if (obj && !obj.particular && !obj.amount) {
          transactions = _.without(transactions, obj);
        }
      });
    }
    return transactions;
  }

  /**
   * validateTransaction
   */
  public validateTransaction(transactions, type) {
    let validEntry = this.removeBlankTransaction(transactions, type);
    return validEntry;
  }

  /**
   * onSelectStock
   */
  public onSelectStock(item) {
    let idx = this.selectedStockIdx;
    let entryItem = _.cloneDeep(item);
    this.prepareEntry(entryItem, idx);
    setTimeout(() => {
      this.selectedInput.focus();
      this.showStockList.next(false);
    }, 50);
  }

  /**
   * prepareEntry
   */
  public prepareEntry(item, idx) {
    let defaultUnit = {
      stockUnitCode: item.stockUnit.name,
      code: item.stockUnit.code,
      rate: 0
    };
    if (item.accountStockDetails.unitRates.length) {
      this.data.transactions[idx].inventory.unit = item.accountStockDetails.unitRates[0];
      this.data.transactions[idx].inventory.unit.code = item.accountStockDetails.unitRates[0].stockUnitCode;
      this.data.transactions[idx].inventory.unit.stockUnitCode = item.stockUnit.name;

    } else if (!item.accountStockDetails.unitRates.length) {
      this.data.transactions[idx].inventory.unit = defaultUnit;
    }
    this.data.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
    this.data.transactions[idx].inventory.stock = { name: item.name, uniqueName: item.uniqueName};
    this.data.transactions[idx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
  }

  /**
   * calculateAmount
   */
  public changeQuantity(idx, val) {
    let entry = this.data.transactions[idx];
    this.data.transactions[idx].inventory.quantity = Number(val);
    this.data.transactions[idx].amount = Number((this.data.transactions[idx].inventory.unit.rate * this.data.transactions[idx].inventory.quantity).toFixed(2));
    this.amountChanged(idx);
  }

  /**
   * changePrice
   */
  public changePrice(idx, val) {
    this.data.transactions[idx].inventory.unit.rate = Number(_.cloneDeep(val));
    this.data.transactions[idx].amount = Number((this.data.transactions[idx].inventory.unit.rate * this.data.transactions[idx].inventory.quantity).toFixed(2));
    this.amountChanged(idx);
  }

  /**
   * amountChanged
   */
  public amountChanged(idx) {
    if (this.data.transactions[idx] && this.data.transactions[idx].inventory.stock && this.data.transactions[idx].inventory.quantity) {
      if (this.data.transactions[idx].inventory.quantity) {
        this.data.transactions[idx].inventory.unit.rate = Number((this.data.transactions[idx].amount / this.data.transactions[idx].inventory.quantity).toFixed(2));
      }
    }
    let stockTotal = _.sumBy(this.data.transactions,  (o: any) => Number(o.amount));
    this.stockTotal = stockTotal;
  }

  public calculateRate(idx, val) {
    if (val) {
      this.accountsTransaction[idx].amount = Number( this.stockTotal * val / 100);
    }
    this.calculateAmount();
  }

  public changeTotal(idx, val) {
    if (val) {
      this.accountsTransaction[idx].inventory.unit.rate = null;
    }
    this.calculateAmount();
  }

  /**
   * calculateAmount
   */
  public calculateAmount() {
    let Total = _.sumBy(this.accountsTransaction,  (o) => Number(o.amount));
    this.accountsTotal = Total;
  }

  /**
   * changeStock
   */
  public changeStock(idx, val) {
    if (!val) {
      this.data.transactions.splice(idx, 1);
      this.showStockList.next(false);
      if (!this.data.transactions.length) {
        this.newRowType('stock');
      }
      this.amountChanged(idx);
    }
  }

  /**
   * saveEntry
   */
  public saveEntry() {
    if (!this.creditorAcc.uniqueName) {
      return this._toaster.errorToast("Party A/c Name can't be blank.");
    }

    let idx = 0;
    let data = _.cloneDeep(this.data);

    data.transactions = this.validateTransaction(data.transactions, 'stock');
    let accountsTransaction = this.validateTransaction(this.accountsTransaction, 'account');

    if (!data.transactions.length) {
      return this._toaster.errorToast('Atleast 1 stock entry required.');
    }

    let transactions = _.concat(data.transactions, accountsTransaction);
    console.log(transactions);

    if (this.totalCreditAmount === this.totalDebitAmount) {
      let accUniqueName: string = this.creditorAcc.uniqueName;
      this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
      this.showStockList.next(false);
    } else {
      this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
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
}
