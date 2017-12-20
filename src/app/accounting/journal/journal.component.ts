import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { BlankLedgerVM } from './../../ledger/ledger.vm';
import { LedgerActions } from './../../actions/ledger/ledger.actions';
import { IOption } from './../../theme/ng-select/option.interface';
import { AccountService } from './../../services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})

export class JournalComponent implements OnInit, OnDestroy {

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;

  public accounts$: Observable<IOption[]>;
  public accounts: IOption[] = [];
  public allAccounts: IOption[] = [];
  public showLedgerAccountList: boolean = false;
  public selectedInput: 'by' | 'to' = null;
  public journalRequestObject: any = {};
  public isLedgerCreateSuccess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private _toaster: ToasterService) {
    this.journalRequestObject.transactions = [];
    this.isLedgerCreateSuccess$ = this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({ label: `${d.name} (${d.uniqueName})`, value: d.uniqueName });
        });
        this.accounts = this.allAccounts = accounts;
      }
    });

    // this._keyboardService.keyInformation.subscribe((key: KeyboardEvent) => {
    //   console.log('Hello the key is :', key);
    // });

    this.isLedgerCreateSuccess$.subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
      }
    });
  }

  public setAccount(acc: IOption) {
    console.log('the selected acc is :', acc);
    this.showLedgerAccountList = false;
    if (this.selectedInput === 'by') {
      this.journalRequestObject.by = acc.label;
    } else if (this.selectedInput === 'to') {
      this.journalRequestObject.to = acc.label;
    }
  }

  public searchInList(str: string) {
    let allData = _.cloneDeep(this.allAccounts);
    this.accounts =  _.filter(allData, (o) => _.includes(o.label, str));
  }

  public createEntry() {
    let data = {
      transactions: [{ amount: '20', particular: 'sales', type: 'debit' }, { amount: '20', particular: 'cash', type: 'debit' }],
      entryDate: '16-12-2017',
      description: 'Hello this is a sample entry in Journal',
    };
    let accUniqueName: string = null;
    // this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, 'generalreserves'));
  }

  public selectInputType(ev: KeyboardEvent) {
    if (ev.key === 'c') {
      this.selectedInput = 'to';
    } else if (ev.key === 'd') {
      this.selectedInput = 'by';
    } else {
      this.selectedInput = null;
    }
  }

  public detectEnterKey(ev: KeyboardEvent, inputAmount: number, selectedAccount: string) {
    let target: any = _.cloneDeep(ev.target);
    console.log('enter key is :', ev);
    if (ev.keyCode === 13) {
      if (this.selectedInput === 'to') {
        this.journalRequestObject.transactions.push({
          type: 'debit',
          amount: inputAmount,
          particular: selectedAccount
        });
      } else if (this.selectedInput === 'by') {
        this.journalRequestObject.transactions.push({
          type: 'credit',
          amount: inputAmount,
          particular: selectedAccount
        });
      }
      this.selectedInput = null;
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
