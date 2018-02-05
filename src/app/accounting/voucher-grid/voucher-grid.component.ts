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
import { TallyModuleService } from 'app/accounting/tally-service';

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

export class AccountAsVoucherComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @ViewChild('particular') public accountField: any;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

  public showLedgerAccountList: boolean;
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
  // public groupFlattenAccount: string = '';

  public voucherType: string = null;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private flyAccountActions: FlyAccountsActions,
    private _toaster: ToasterService, private _router: Router,
    private _tallyModuleService: TallyModuleService) {
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
      } else if (d) {
        this._tallyModuleService.requestData.next(this.requestObj);
      }
    });

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
        this.requestObj = _.cloneDeep(data);
        this.requestObj.voucherType = 'Journal';
        this.voucherType = 'Journal';
      }
    });

    this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$).subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.refreshEntry();
        this.store.dispatch(this._ledgerActions.ResetLedger());
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

  }

  /**
   * newEntryObj() to push new entry object
   */
  public newEntryObj() {
    this.requestObj.transactions.push({
      amount: 0,
      particular: '',
      applyApplicableTaxes: false,
      isInclusiveTax: false,
      type: 'to',
      taxes: [],
      total: 0,
      discounts: [],
      inventory: [this.initInventory()],
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
  public onAccountFocus() {
    this.showLedgerAccountList = true;
    this.showStockList = false;
    // this.showStockList.next(false);
  }

  /**
   * onAccountBlur() to hide accountList
   */
  public onAccountBlur(ev, elem) {
    this.showLedgerAccountList = false;
    this.selectedParticular = elem;
    this.showStockList = false;
    // this.showStockList.next(true);
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
    let accModel = {
      name: acc.name,
      UniqueName: acc.uniqueName,
      groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1].uniqueName,
      account: acc.name,
      parentGroups: acc.parentGroups
    };
    this.requestObj.transactions[idx].particular = accModel.UniqueName;
    this.requestObj.transactions[idx].selectedAccount = accModel;
    this.requestObj.transactions[idx].stocks = acc.stocks;

    setTimeout(() => {
      this.selectedParticular.focus();
      // console.log(this.selectedParticular.nextElementSibling);
      this.showLedgerAccountList = false;
    }, 50);

    if (acc && acc.stocks) {
      this.groupUniqueName = accModel.groupUniqueName;
      this.selectAccUnqName = acc.uniqueName;
      if (!this.requestObj.transactions[idx].inventory.length) {
        this.requestObj.transactions[idx].inventory.push(this.initInventory());
      }
    }
    // this.requestObj.transactions[idx].inventory.push(this.initInventory());
    // this.groupUniqueName = acc.uniqueName;
  }

  /**
   * searchAccount in accountList
   */
  public searchAccount(str) {
    this.accountSearch = str;
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

    let debitTransactions = _.filter(this.requestObj.transactions, (o) => o.type === 'by');
    this.totalDebitAmount = _.sumBy(debitTransactions, (o) => Number(o.amount));
    let creditTransactions = _.filter(this.requestObj.transactions, (o) => o.type === 'to');
    this.totalCreditAmount = _.sumBy(creditTransactions, (o) => Number(o.amount));
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
    // data.transactions = this.removeBlankTransaction(data.transactions);
    data.transactions = this.validateTransaction(data.transactions);

    if (!data.transactions) {
      return;
    }
    if (this.totalCreditAmount === this.totalDebitAmount) {
      _.forEach(data.transactions, element => {
        element.type = (element.type === 'by') ? 'credit' : 'debit';
      });
      let accUniqueName: string = _.maxBy(data.transactions, (o: any) => o.amount).selectedAccount.UniqueName;
      let indexOfMaxAmountEntry = _.findIndex(data.transactions, (o: any) => o.selectedAccount.UniqueName === accUniqueName);
      data.transactions.splice(indexOfMaxAmountEntry, 1);
      data = this._tallyModuleService.prepareRequestForAPI(data);
      this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
    } else {
      this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
    }
  }

  /**
   * refreshEntry
   */
  public refreshEntry() {
    this.requestObj.transactions = [];
    this.showConfirmationBox = false;
    this.showLedgerAccountList = false;
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;
    this.newEntryObj();
    this.requestObj.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.journalDate = moment();
    this.requestObj.transactions[0].type = 'by';
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
    _.forEach(validEntry, function(obj, idx) {
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
    console.log(item);
    let idx = this.selectedStockIdx;
    let entryItem = _.cloneDeep(item);
    this.prepareEntry(entryItem, this.selectedIdx);
    setTimeout(() => {
      this.selectedStk.focus();
      this.showStockList = false;
    }, 50);
  }

  /**
   * prepareEntry
   */
  public prepareEntry(item, idx) {
    let i = this.selectedStockIdx;
    let defaultUnit = {
      stockUnitCode: item.stockUnit.name,
      code: item.stockUnit.code,
      rate: 0
    };
    if (item.accountStockDetails.unitRates.length) {
      this.requestObj.transactions[idx].inventory[i].unit = item.accountStockDetails.unitRates[0];
      this.requestObj.transactions[idx].inventory[i].unit.code = item.accountStockDetails.unitRates[0].stockUnitCode;
      this.requestObj.transactions[idx].inventory[i].unit.stockUnitCode = item.stockUnit.name;

    } else if (!item.accountStockDetails.unitRates.length) {
      this.requestObj.transactions[idx].inventory[i].unit = defaultUnit;
    }
    this.requestObj.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
    this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item.uniqueName};
    this.requestObj.transactions[idx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
    this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
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
    console.log('The env we got is :', inventory);
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
}
