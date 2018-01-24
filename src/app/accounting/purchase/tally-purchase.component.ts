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
  templateUrl: './tally-purchase.component.html',
  styleUrls: ['./tally-purchase.component.css', '../accounting.component.css']
})

export class TallyPurchaseComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @ViewChild('particular') public accountField: any;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

  public showAccountList: boolean = true;
  public selectedInput: 'by' | 'to' = 'by';
  public inventoryItem: BlankLedgerVM = new BlankLedgerVM();
  public totalCreditAmount: number = 0;
  public totalDebitAmount: number = 0;
  public showConfirmationBox: boolean = false;
  public moment = moment;
  public accountSearch: string = '';
  public selectedIdx: any;
  public isSelectedRow: boolean;
  public selectedParticular: any;
  public showFromDatePicker: boolean = false;
  public purchaseDate: any;
  public navigateURL: any = CustomShortcode;
  public showInvoiceDate: boolean = false;
  public gridType: string = 'invoice';
  public groupFlattenAccount: string;
  public partyAccUniqName: string = '';
  public filterByGrp: boolean = false;
  public showStockList: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public stockSearch: string;
  public selectedAcc:object;
  public accountType: string;
  public accountsTransaction = [];
  public selectedAccIdx:any;
  public creditorAcc: any = {
    name: '',
    uniqueName: ''
  };
  public debtorAcc: any = {
    name: '',
    uniqueName: ''
  };
  
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private flyAccountActions: FlyAccountsActions,
    private _toaster: ToasterService, private _router: Router, private _salesActions: SalesActions) {
    this.inventoryItem.transactions = [];
    this._keyboardService.keyInformation.subscribe((key) => {
      this.watchKeyboardEvent(key);
    });
    
      // this.store.dispatch(this._salesActions.getFlattenAcOfPurchase({groupUniqueNames: ['purchases']}));
  }

  public ngOnInit() {

    this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$).subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.refreshEntry();
        // this.store.dispatch(this._ledgerActions.ResetLedger());
      }
    });


    this.refreshEntry();

  }

  /**
   * newEntryObj() to push new entry object
   */
  public newEntryObj(type) {
    let entryObj = {
      amount: 0,
      particular: '',
      applyApplicableTaxes: false,
      isInclusiveTax: false,
      type: 'DEBIT',
      taxes: [],
      total: 0,
      discounts: [],
      inventory: {
        unit: {
          stockUnitCode: '',
          code: '',
          rate: 0,
        },
        quantity: 0,
        stock: {
          uniqueName: '',
          name: '',
        }
      },
      selectedAccount: {
        name: '',
        uniqueName: ''
        // groupUniqueName: '',
        // account: ''
      }
    }
    if (type == 'stock') {
      this.inventoryItem.transactions.push(entryObj);
    } else if (type == 'account'){
      this.accountsTransaction.push(entryObj);
    }
   
  }

  /**
   * selectRow() on entryObj focus/blur
   */
  public selectRow(type: boolean, idx) {
    this.isSelectedRow = type;
    this.selectedIdx = idx;
  }

  /**
   * selectAccountRow() on entryObj focus/blur
   */
  public selectAccountRow(type: boolean, idx) {
    this.isSelectedRow = type;
    this.selectedAccIdx = idx;
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

  /**
   * onAccountFocus() to show accountList
   */
  public onAccountFocus() {
    this.showAccountList = true;
    // this.showStockList.next(false);
  }

  /**
   * onStockItemBlur() to hide accountList
   */
  public onStockItemBlur(ev, elem) {
    this.showAccountList = false;
    this.selectedParticular = elem;
    if (this.accountSearch) {
      this.searchAccount('');
      this.accountSearch = '';
    }
  }

  /**
   * setAccount` in particular, on accountList click
   */
  public setAccount(acc) {
    let idx = this.selectedIdx;
    // console.log(this.selectedIdx);
    console.log(acc);
    this.selectedAcc = acc;
    if (this.accountType === 'creditor') {
      this.creditorAcc = acc;
    } else if (this.accountType === 'debitor') {
      this.debtorAcc = acc;
    }
    this.accountType = null;
    let accModel = {
      name: acc.name,
      UniqueName: acc.uniqueName,
      groupUniqueName: acc.parentGroups[acc.parentGroups.length-1],
      account: acc.name
    };
    this.accountsTransaction[idx].particular = accModel.UniqueName;
    this.accountsTransaction[idx].selectedAccount = accModel;

    setTimeout(() => {
      this.selectedParticular.focus();
      console.log(this.selectedParticular.nextElementSibling);
      // this.showLedgerAccountList = false;
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
   * onAmountField() on amount, event => Blur, Enter, Tab
   */
  public addNewEntry(amount, transactionObj, idx) {
    let indx = idx;
    let lastIndx = this.inventoryItem.transactions.length - 1;

    if (amount) {
      transactionObj.amount = Number(amount);
      transactionObj.total = transactionObj.amount;
    }

    if (transactionObj.inventory.quantity) {
      this.inventoryItem.transactions[indx].inventory.quantity = _.cloneDeep(Number(transactionObj.inventory.quantity));
    }

    if (indx === lastIndx && this.inventoryItem.transactions[indx].inventory.stock.name) {
      this.newEntryObj('stock');
    } else {
      this.newEntryObj('account');
    }

    this.totalCreditAmount = _.sumBy(this.inventoryItem.transactions, (o) => Number(o.amount));
    this.totalDebitAmount = _.sumBy(this.inventoryItem.transactions, (o) => Number(o.amount));

    // let debitTransactions = _.filter(this.inventoryItem.transactions, (o) => o.type === 'by');
    // this.totalDebitAmount = _.sumBy(debitTransactions, (o) => Number(o.amount));
    // let creditTransactions = _.filter(this.inventoryItem.transactions, (o) => o.type === 'to');
    // this.totalCreditAmount = _.sumBy(creditTransactions, (o) => Number(o.amount));
  }

  /**
   * openConfirmBox() to save entry
   */
  public openConfirmBox(submitBtnEle: HTMLButtonElement) {
    this.showConfirmationBox = true;
    if (this.inventoryItem.description) {
      this.inventoryItem.description = this.inventoryItem.description.replace(/(?:\r\n|\r|\n)/g, '');
    }
    setTimeout(() => {
      submitBtnEle.focus();
    }, 100);
  }

  /**
   * saveEntry
   */
  public saveEntry() {
    let idx = 0;
    let data = _.cloneDeep(this.inventoryItem);
    if (!this.creditorAcc.uniqueName) {
      return this._toaster.errorToast("Party A/c Name can't be blank.");
    } else if (!this.debtorAcc.uniqueName) {
      return this._toaster.errorToast("Purchase Ledger can't be blank.");
    }
    // data.transactions = this.removeBlankTransaction(data.transactions);
    data.transactions = this.validateTransaction(data.transactions);
    if (!data.transactions) {
      return;
    }
    if (this.totalCreditAmount === this.totalDebitAmount) {
      // _.forEach(data.transactions, element => {
      //   element.type = (element.type === 'by') ? 'credit' : 'debit';
      // });

      let accUniqueName: string = this.creditorAcc.uniqueName;
      this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
      this.showStockList.next(false);
    } else {
      this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
    }
  }

  /**
   * refreshEntry
   */
  public refreshEntry() {
    this.inventoryItem.transactions = [];
    this.showConfirmationBox = false;
    this.showAccountList = false;
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;
    this.newEntryObj('stock');
    this.inventoryItem.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.purchaseDate = moment();
    this.inventoryItem.transactions[0].type = 'DEBIT';
    this.inventoryItem.voucherType = 'purchase';
    this.creditorAcc = {};
    this.debtorAcc = {};
  }

  /**
   * after init
   */
  public ngAfterViewInit() {

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
    this.inventoryItem.entryDate = moment(date).format(GIDDH_DATE_FORMAT);
  }

  /**
   * setInvoiceDate
   */
  public setInvoiceDate(date) {
    this.showInvoiceDate = !this.showInvoiceDate;
    // this.inventoryItem.entryDate = moment(date).format(GIDDH_DATE_FORMAT);
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
    _.forEach(transactions, function (obj: any, idx) {
      if (obj && !obj.inventory.stock.UniqueName && !obj.amount) {
        transactions = _.without(transactions, obj)
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
    _.forEach(validEntry, function (obj, idx) {
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
   * getFlattenGrpAccounts
   */
  public getFlattenGrpAccounts(groupUniqueName, filter) {
    this.showAccountList = true;
    this.groupFlattenAccount = groupUniqueName;
    this.filterByGrp = filter;
    this.showStockList.next(false);
  }
  
  /**
   * onSelectStock
   */
  public onSelectStock(item) {
    let idx = this.selectedIdx;
    let entryItem = _.cloneDeep(item);
    this.prepareEntry(entryItem, idx);
    this.showStockList.next(false);
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
      this.inventoryItem.transactions[idx].inventory.unit = item.accountStockDetails.unitRates[0];
      this.inventoryItem.transactions[idx].inventory.unit.code = item.accountStockDetails.unitRates[0].stockUnitCode;
      this.inventoryItem.transactions[idx].inventory.unit.stockUnitCode = item.stockUnit.name;
      
    } else if (!item.accountStockDetails.unitRates.length) {
      this.inventoryItem.transactions[idx].inventory.unit = defaultUnit;
    }
    this.inventoryItem.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
    this.inventoryItem.transactions[idx].inventory.stock = { name: item.name, uniqueName: item.uniqueName};
    this.inventoryItem.transactions[idx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
  }

  /**
   * calculateAmount
   */
  public changeQuantity(idx, val) {
    let entry = this.inventoryItem.transactions[idx];
    this.inventoryItem.transactions[idx].inventory.quantity = Number(val);
    this.inventoryItem.transactions[idx].amount = Number((this.inventoryItem.transactions[idx].inventory.unit.rate * this.inventoryItem.transactions[idx].inventory.quantity).toFixed(2));
    // this.calculateTotal();
    // this.calculateCompoundTotal();
  }


  /**
   * changePrice
   */
  public changePrice(idx, val) {
    this.inventoryItem.transactions[idx].inventory.unit.rate = Number(_.cloneDeep(val));
    this.inventoryItem.transactions[idx].amount = Number((this.inventoryItem.transactions[idx].inventory.unit.rate * this.inventoryItem.transactions[idx].inventory.quantity).toFixed(2));
  }

  /**
   * amountChanged
   */
  public amountChanged(idx) {
    if (this.inventoryItem.transactions[idx] && this.inventoryItem.transactions[idx].inventory.stock && this.inventoryItem.transactions[idx].inventory.quantity) {
      if (this.inventoryItem.transactions[idx].inventory.quantity) {
        this.inventoryItem.transactions[idx].inventory.unit.rate = Number((this.inventoryItem.transactions[idx].amount / this.inventoryItem.transactions[idx].inventory.quantity).toFixed(2));
      }
    }
  }
  

  /**
   * addAccountEntry
   */
  public addAccountEntry() {
    this.accountsTransaction.push
  }

}
