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

const TransactionsType = [
  { label: 'By', value: 'Debit'},
  { label: 'To', value: 'Credit'},  
]

const CustomShortcode = [
  {code: 'F9', route: 'purchase'}
]
@Component({
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css','../accounting.component.css']
})

export class JournalComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @ViewChild('particular') accountField: any;

  public accounts$: Observable<IOption[]>;
  public accounts: IOption[] = [];
  public allAccounts: IOption[] = [];
  public showLedgerAccountList: boolean = false;
  public selectedInput: 'by' | 'to' = 'by';
  public journalObj: BlankLedgerVM = new BlankLedgerVM();
  public totalCreditAmount: number = 0;
  public totalDebitAmount: number = 0;
  public showConfirmationBox: boolean = false;
  public moment = moment;
  public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public isGroupToggle: boolean;
  public accountSearch:string = '';
  public selectedIdx: any;
  public isSelectedRow: boolean;
  public selectedParticular: any;
  public showFromDatePicker: boolean = false;
  public journalDate: any;
  public navigateURL: any = CustomShortcode;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private flyAccountActions: FlyAccountsActions,
    private _toaster: ToasterService, private _router: Router) {
    this.journalObj.transactions = [];
    this._keyboardService.keyInformation.subscribe((key) => { 
      this.watchKeyboardEvent(key); 
    });
  }

  public ngOnInit() {

    /********** commented due to unused 
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({ label: `${d.name} (${d.uniqueName})`, value: d.uniqueName });
        });
        this.accounts = this.allAccounts = accounts;
      }
    }); **********/

    this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$).subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.refreshEntry();
        this.store.dispatch(this._ledgerActions.ResetLedger());
      }
    });
    this.refreshEntry();
    // this.newEntryObj();
    // this.journalObj.entryDate = moment().format(GIDDH_DATE_FORMAT);    
    // this.journalObj.transactions[0].type = 'by';
  }

  
  /**
   * newEntryObj() to push new entry object
   */
  public newEntryObj() {
    this.journalObj.transactions.push({
      amount: 0,
      particular: '',
      applyApplicableTaxes: false,
      isInclusiveTax: false,
      type: 'to',
      taxes: [],
      total: 0,
      discounts: [],
      selectedAccount: null
    });
  }

  /**
   * selectRow() on entryObj focus/blur
   */
  public selectRow(type:boolean, idx) {
    this.isSelectedRow = type; 
    this.selectedIdx = idx;
  }

  /**
   * selectEntryType() to validate Type i.e BY/TO
   */
  public selectEntryType(transactionObj, val, idx) {
    if (val.length == 2 && (val.toLowerCase() !== "to" && val.toLowerCase() !== "by")) {
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
    this.isGroupToggle = true;
    this.flyAccounts.next(true)
  }

  /**
   * onAccountBlur() to hide accountList
   */
  public onAccountBlur(ev, elem) {
    this.showLedgerAccountList = false;
    this.isGroupToggle = false;
    this.flyAccounts.next(false)
    this.selectedParticular = elem;
    if (this.accountSearch) {
      this.searchAccount('');
      this.accountSearch = '';
    }
    // this.searchAccount('');
  }

  /**
   * setAccount in particular, on accountList click
   */
  public setAccount(acc) {
    let idx = this.selectedIdx;
    let accModel = {
      name: acc.Name,
      UniqueName: acc.UniqueName,
      groupUniqueName: acc.groupUniqueName
    }
    this.showLedgerAccountList = false;
    this.journalObj.transactions[idx].particular = accModel.UniqueName;
    this.journalObj.transactions[idx].selectedAccount = accModel;
    setTimeout(() => {
      this.selectedParticular.focus();
      this.showLedgerAccountList = false;
    }, 100);
  }
  
  /**
   * searchAccount in accountList
   */
  public searchAccount(str: string) {
    this.accountSearch = str;
    this.store.dispatch(this.flyAccountActions.GetflatAccountWGroups(str));
  }

  /**
   * validateTransation() on amount, event => Blur, Enter, Tab
   */
  public validateTransation(amount, transactionObj, idx) {
    let indx = idx;
    let lastIndx = this.journalObj.transactions.length-1;
    if (amount) {
      transactionObj.amount = Number(amount);
      transactionObj.total = transactionObj.amount;
    }

    let isLastEntry = this.validateEntry(this.journalObj.transactions[lastIndx]);
    if (indx === lastIndx && isLastEntry) {
      this.newEntryObj();
    }

    let debitTransactions = _.filter(this.journalObj.transactions, (o) => o.type === 'by');
    this.totalDebitAmount = _.sumBy(debitTransactions, (o) => o.amount);
    let creditTransactions = _.filter(this.journalObj.transactions, (o) => o.type === 'to');
    this.totalCreditAmount = _.sumBy(creditTransactions, (o) => o.amount);
  }

  /**
   * openConfirmBox() to save entry
   */
  public openConfirmBox(submitBtnEle: HTMLButtonElement) {
    if (this.journalObj.transactions.length > 2) {
      this.showConfirmationBox = true;
      if (this.journalObj.description) {
        this.journalObj.description = this.journalObj.description.replace(/(?:\r\n|\r|\n)/g, '');
      }
      setTimeout(() => {
        submitBtnEle.focus();
      }, 100);
    } else {
      this._toaster.errorToast('No transactions found.')
      return;
    }

  }

  /**
   * saveEntry
   */
  public saveEntry() {
    let idx = 0;
    if (this.totalCreditAmount === this.totalDebitAmount) {
      let data = _.cloneDeep(this.journalObj);
      
      _.forEach(data.transactions, element => {
        element.type = (element.type === 'by') ? 'credit' : 'debit';
        // element.particular = _.find(this.accounts, (el) => el.label === element.particular).value;
      });
      data.transactions.splice(data.transactions.length-1, 1);
      let accUniqueName: string = _.maxBy(data.transactions, (o: any) => o.amount).selectedAccount.UniqueName;
      let indexOfMaxAmountEntry = _.findIndex(data.transactions, (o: any) => o.selectedAccount.UniqueName === accUniqueName);
      data.transactions.splice(indexOfMaxAmountEntry, 1);
      this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
    } else {
      this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
    }
  }

  /**
   * refreshEntry
   */
  public refreshEntry() {
    this.journalObj.transactions = [];
    // this.journalObj = new BlankLedgerVM();
    // console.log(this.journalObj);
    this.showConfirmationBox = false;
    this.showLedgerAccountList = false;
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;
    this.newEntryObj();
    this.journalObj.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.journalDate = moment();    
    this.journalObj.transactions[0].type = 'by';
    this.journalObj.voucherType = 'journal';
  }
  
  /**
   * after init
   */
  public ngAfterViewInit() {
    setTimeout(() => {
      this.flyAccounts.next(true);      
    }, 200);
  }

  /**
   * validateEntry
   */
  public validateEntry(items) {
    if (items.particular && items.amount) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * ngOnDestroy() on component destroy
   */
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  /**
   * onSelectDate
   */
  public onSelectDate(date) {
    this.showFromDatePicker =! this.showFromDatePicker; 
    this.journalObj.entryDate = moment(date).format(GIDDH_DATE_FORMAT); 
  }

  /**
   * watchMenuEvent
   */
  public watchKeyboardEvent(event) {
    console.log(event);
    if (event) {
      let navigateTo =  _.find(this.navigateURL, (o) => o.code === event.key);
      //  this.navigateURL.find()
      if (navigateTo) {
        console.log()
        this._router.navigate(['accounting', navigateTo.route]);
      }
      console.log(navigateTo);
    }
  }
  
}
