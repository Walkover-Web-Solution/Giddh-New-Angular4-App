import { TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../models/api-models/Account';
import { ITransactionItem } from '../models/interfaces/ledger.interface';

export class LedgerVM {
  public activeAccount$: Observable<AccountResponse>;
  public transactionData$: Observable<TransactionsResponse>;
  public selectedTxnUniqueName: string;
  public currentTxn: ITransactionItem;
  public pageLoader: boolean = false;
  public today: Date = new Date();
  public fromDate: Date;
  public toDate: Date;
  public fromDatePickerIsOpen: boolean = false;
  public toDatePickerIsOpen: boolean = false;
  public format: string = 'dd-MM-yyyy';
  public showPanel: boolean = false;
  public accountUnq: string = ''; // $stateParams.unqName
  public accountToShow = {};
  public mergeTransaction: boolean = false;
  public showEledger: boolean = true;
  public pageAccount = {};
  public showLoader: boolean = true;
  public showExportOption: boolean = false;
  public showLedgerPopover: boolean = false;
  public adjustHeight = 0;
  public dLedgerLimit = 10;
  public cLedgerLimit = 10;
  public entrySettings = {};
  public firstLoad: boolean = true;
  public showTaxList: boolean = true;
  public hasTaxTransactions: boolean = true;
}
