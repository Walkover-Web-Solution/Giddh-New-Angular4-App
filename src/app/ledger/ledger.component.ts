import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlankLedgerVM, LedgerVM, TransactionVM } from './ledger.vm';
import { LedgerActions } from '../services/actions/ledger/ledger.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadLedgerRequest, TransactionsRequest } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { cloneDeep, filter, find, orderBy } from 'lodash';
import * as uuid from 'uuid';
import { LedgerService } from '../services/ledger.service';
import { saveAs } from 'file-saver';
import { AccountService } from '../services/account.service';
import { Select2OptionData } from '../shared/theme/select2/select2.interface';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit, OnDestroy {
  public lc: LedgerVM;
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
  public needToReCalculate: boolean = false;
  public accountsOptions: Select2Options = {
    multiple: true,
    width: '200px',
    placeholder: 'Select Accounts',
    allowClear: true,
    maximumSelectionLength: 1,
    templateSelection: (data) => data.text,
    templateResult: (data: any) => {
      if (data.text === 'Searching…') {
        return;
      }
      if (!data.additional.stock) {
        return $(`<a href="javascript:void(0)" class="account-list-item" style="border-bottom: 1px solid #e0e0e0;">
                        <span class="account-list-item" style="display: block;font-size:12px">${data.text}</span>
                        <span class="account-list-item" style="display: block;font-size:10px">${data.additional.uniqueName}</span>
                      </a>`);
      } else {
        return $(`<a href="javascript:void(0)" class="account-list-item" style="border-bottom: 1px solid #e0e0e0;">
                        <span class="account-list-item" style="display: block;font-size:12px">${data.text}</span>
                        <span class="account-list-item" style="display: block;font-size:10px">${data.additional.uniqueName}</span>
                        <span class="account-list-item" style="display: block;font-size:10px">
                            Stock: ${data.additional.stock.name}
                        </span>
                      </a>`);
      }

    }
  };
  public isLedgerCreateSuccess$: Observable<boolean>;

  private ledgerSearchTerms = new Subject<string>();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _ledgerActions: LedgerActions, private route: ActivatedRoute,
              private _ledgerService: LedgerService, private _accountService: AccountService, private _groupService: GroupService,
              private _router: Router) {
    this.lc = new LedgerVM();
    this.trxRequest = new TransactionsRequest();
    this.lc.activeAccount$ = this.store.select(p => p.ledger.account).takeUntil(this.destroyed$);
    this.accountInprogress$ = this.store.select(p => p.ledger.accountInprogress).takeUntil(this.destroyed$);
    this.lc.transactionData$ = this.store.select(p => p.ledger.transactionsResponse).takeUntil(this.destroyed$);
    this.isLedgerCreateSuccess$ = this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$);

    // get flatten_accounts list
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accountsArray: Select2OptionData[] = [];
        data.body.results.map(acc => {
          if (acc.stocks) {
            acc.stocks.map(as => {
              accountsArray.push({
                id: uuid.v4(),
                text: acc.name,
                additional: Object.assign({}, acc, {stock: as})
              });
            });
            accountsArray.push({id: uuid.v4(), text: acc.name, additional: acc});
          } else {
            accountsArray.push({id: uuid.v4(), text: acc.name, additional: acc});
          }
        });
        this.lc.flatternAccountList = Observable.of(orderBy(accountsArray, 'text'));
      }
    });

    // get discount accounts list
    this._groupService.GetFlattenGroupsAccounts('discount').subscribe(data => {
      if (data.status === 'success') {
        this.lc.discountAccountsList = data.body.results;
      } else {
        this.lc.discountAccountsList = [];
      }
    });
  }

  public selectCompoundEntry(txn: ITransactionItem) {
    this.lc.currentBlankTxn = null;
    this.lc.currentTxn = txn;
    this.lc.selectedTxnUniqueName = txn.entryUniqueName;
  }

  public selectBlankTxn(txn: TransactionVM) {
    this.lc.currentTxn = null;
    this.lc.currentBlankTxn = txn;
    this.lc.selectedTxnUniqueName = txn ? txn.id : null;
  }

  public selectedDate(value: any) {
    this.trxRequest.from = moment(value.start).format('DD-MM-YYYY');
    this.trxRequest.to = moment(value.end).format('DD-MM-YYYY');
    this.trxRequest.page = 0;

    this.getTransactionData();
  }

  public selectAccount(e: any, txn) {
    if (!e.value) {
      txn.selectedAccount = null;
      return;
    }
    this.lc.flatternAccountList.take(1).subscribe(data => {
      data.map(fa => {
          if (fa.id === e.value[0]) {
            txn.selectedAccount = fa.additional;
            return;
          }
        }
      );
    });
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
        this.store.dispatch(this._ledgerActions.GetLedgerAccount(this.lc.accountUnq));
        this.getTransactionData();
      }
    });
    this.lc.transactionData$.subscribe(lc => {
      if (lc) {
        this.lc.currentPage = lc.page;
      }
    });
    this.isLedgerCreateSuccess$.distinct().subscribe(s => {
      if (s) {
        this._router.navigate(['/pages/dummy'], {skipLocationChange: true}).then(() => {
          this._router.navigate(['/pages', 'ledger', this.lc.accountUnq]);
        });
      }
    });

    // search
    this.ledgerSearchTerms
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(term => {
        this.trxRequest.q = term;
        this.trxRequest.page = 0;
        this.getTransactionData();
      });
  }

  public getTransactionData() {
    this.store.dispatch(this._ledgerActions.GetTransactions(cloneDeep(this.trxRequest)));
  }

  public toggleTransactionType(event: string) {
    let allTrx: TransactionVM[] = filter(this.lc.blankLedger.transactions, bl => bl.type === event);
    let unAccountedTrx = find(allTrx, a => !a.selectedAccount);

    if (unAccountedTrx) {
      this.selectBlankTxn(unAccountedTrx);
    } else {
      let newTrx = this.lc.addNewTransaction(event);
      this.lc.blankLedger.transactions.push(newTrx);
      this.selectBlankTxn(newTrx);
    }
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

  public resetBlankTransaction() {
    this.lc.blankLedger = {
      transactions: [
        {
          id: uuid.v4(),
          amount: 0,
          tax: 0,
          total: 0,
          particular: '',
          type: 'DEBIT',
          taxes: [],
          discount: 0,
          discounts: [],
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true
        },
        {
          id: uuid.v4(),
          amount: 0,
          particular: '',
          tax: 0,
          total: 0,
          type: 'CREDIT',
          taxes: [],
          discount: 0,
          discounts: [],
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true
        }],
      voucherType: 'sal',
      entryDate: moment().format('DD-MM-YYYY'),
      unconfirmedEntry: false,
      attachedFile: '',
      attachedFileName: '',
      tag: null,
      description: '',
      generateInvoice: false,
      chequeNumber: '',
      chequeClearanceDate: ''
    };
    this.hideNewLedgerEntryPopup();
  }

  public showNewLedgerEntryPopup(trx: TransactionVM) {
    this.selectBlankTxn(trx);
    this.lc.showNewLedgerPanel = true;
  }

  public hideNewLedgerEntryPopup() {
    this.lc.showNewLedgerPanel = false;
  }

  public saveBlankTransaction() {
    let blankTransactionObj: BlankLedgerVM = this.lc.prepareBlankLedgerRequestObject();
    this.store.dispatch(this._ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
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
    return new Blob(byteArrays, {type: contentType});
  }

  public ngOnDestroy(): void {
    this.store.dispatch(this._ledgerActions.ResetLedger());
  }
}
