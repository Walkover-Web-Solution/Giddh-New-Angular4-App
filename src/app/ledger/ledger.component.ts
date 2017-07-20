import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnInit } from '@angular/core';
import { LedgerVM } from './ledger.vm';
import { LedgerActions } from '../services/actions/ledger/ledger.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ActivatedRoute } from '@angular/router';
import { DownloadLedgerRequest, TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { AccountResponse } from '../models/api-models/Account';
import { Observable } from 'rxjs/Observable';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LedgerService } from '../services/ledger.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  public lc: LedgerVM = new LedgerVM();
  public accountInprogress$: Observable<boolean>;
  public datePickerOptions: any = {
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    }
  };
  public trxRequest: TransactionsRequest;
  private ledgerSearchTerms = new Subject<string>();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private ledgerActions: LedgerActions, private route: ActivatedRoute, private _ledgerService: LedgerService) {
    this.lc = new LedgerVM();
    this.trxRequest = new TransactionsRequest();
    this.lc.activeAccount$ = this.store.select(p => p.ledger.account).takeUntil(this.destroyed$);
    this.accountInprogress$ = this.store.select(p => p.ledger.accountInprogress).takeUntil(this.destroyed$);
    this.lc.transactionData$ = this.store.select(p => p.ledger.transactionsResponse).takeUntil(this.destroyed$).shareReplay();
  }

  public selectCompoundEntry(txn: ITransactionItem) {
    this.lc.currentTxn = txn;
    this.lc.selectedTxnUniqueName = txn.entryUniqueName;
  }

  public selectedDate(value: any) {
    this.trxRequest.from = moment(value.start).format('DD-MM-YYYY');
    this.trxRequest.to = moment(value.end).format('DD-MM-YYYY');

    this.getTransactionData();
  }

  // Push a search term into the observable stream.
  public search(term: string): void {
    this.ledgerSearchTerms.next(term);
  }

  public pageChanged(event: any): void {
    this.trxRequest.page = event.page;

    this.getTransactionData();
  }

  public ngOnInit() {
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      if (params['accountUniqueName']) {
        this.trxRequest.page = 0;
        this.trxRequest.accountUniqueName = params['accountUniqueName'];
        this.trxRequest.count = 15;

        this.lc.accountUnq = params['accountUniqueName'];
        this.store.dispatch(this.ledgerActions.GetLedgerAccount(this.lc.accountUnq));
        this.getTransactionData();
      }
    });
    this.lc.transactionData$.subscribe(lc => {
      if (lc) {
        this.lc.currentPage = lc.page;
      }
    });

    // search
    this.ledgerSearchTerms
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(term => {
        this.trxRequest.q = term;
        this.getTransactionData();
      });
  }

  public getTransactionData() {
    this.store.dispatch(this.ledgerActions.GetTransactions(_.cloneDeep(this.trxRequest)));
  }

  public downloadInvoice(invoiceName: string, e: Event) {
    e.stopPropagation();
    let activeAccount = null;
    this.lc.activeAccount$.take(1).subscribe(p => activeAccount = p);
    let downloadRequest = new DownloadLedgerRequest();
    downloadRequest.invoiceNumber = [invoiceName];

    this._ledgerService.DownloadInvoice(downloadRequest, this.lc.accountUnq).subscribe(d => {
      let blob = this.base64ToBlob(d.body, 'application/pdf', 512);
      return saveAs(blob, `${activeAccount.name} - ${invoiceName}.pdf`);
    }, error => {
      console.log(error);
    });
  }

  public base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
