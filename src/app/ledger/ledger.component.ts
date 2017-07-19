import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';
import { LedgerVM } from './ledger.vm';
import { LedgerActions } from '../services/actions/ledger/ledger.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ActivatedRoute } from '@angular/router';
import { TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { AccountResponse } from '../models/api-models/Account';
import { Observable } from 'rxjs/Observable';
import { ITransactionItem } from '../models/interfaces/ledger.interface';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  public lc: LedgerVM;
  public accountInprogress$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private ledgerActions: LedgerActions, private route: ActivatedRoute) {
    this.lc = new LedgerVM();
    this.lc.activeAccount$ = this.store.select(p => p.ledger.account).takeUntil(this.destroyed$);
    this.accountInprogress$ = this.store.select(p => p.ledger.accountInprogress).takeUntil(this.destroyed$);
    this.lc.transactionData$ = this.store.select(p => p.ledger.transactionsResponse).takeUntil(this.destroyed$).shareReplay();
  }

  public selectCompoundEntry(txn: ITransactionItem) {
    this.lc.currentTxn = txn;
    this.lc.selectedTxnUniqueName = txn.entryUniqueName;
  }

  public ngOnInit() {
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      if (params['accountUniqueName']) {
        let trxRequest = new TransactionsRequest();
        trxRequest.page = 0;
        trxRequest.accountUniqueName = params['accountUniqueName'];
        trxRequest.count = 15;

        this.lc.accountUnq = params['accountUniqueName'];
        this.store.dispatch(this.ledgerActions.GetLedgerAccount(this.lc.accountUnq));
        this.store.dispatch(this.ledgerActions.GetTransactions(trxRequest));
      }
    });
  }
}
