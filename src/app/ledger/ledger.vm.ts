import { TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../models/api-models/Account';
import { ILedger, ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment';

export class LedgerVM {
  public activeAccount$: Observable<AccountResponse>;
  public transactionData$: Observable<TransactionsResponse>;
  public selectedTxnUniqueName: string;
  public currentTxn: ITransactionItem;
  public currentPage: number;
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
  public blankLedger: any;
  public dBlankTxn: any;
  public cBlankTxn: any;

  constructor() {
    this.blankLedger = {
      isBlankLedger: true,
      attachedFileName: '',
      attachedFile: '',
      description: '',
      entryDate: moment().format('DD-MM-YYYY'),
      invoiceGenerated: false,
      isCompoundEntry: false,
      applyApplicableTaxes: false,
      tag: '',
      transactions: [],
      unconfirmedEntry: false,
      uniqueName: '',
      isInclusiveTax: true,
      voucher: {
        name: 'Sales',
        shortCode: 'sal'
      },
      tax: [],
      taxList: [],
      taxes: [],
      voucherNo: ''
    };

    this.dBlankTxn = {
      date: moment().format('DD-MM-YYYY'),
      particular: {
        name: '',
        uniqueName: ''
      },
      amount: '',
      type: 'DEBIT'
    };

    this.cBlankTxn = {
      date: moment().format('DD-MM-YYYY'),
      particular: {
        name: '',
        uniqueName: ''
      },
      amount: '',
      type: 'CREDIT'
    };

    this.blankLedger.transactions.push(this.dBlankTxn);
    this.blankLedger.transactions.push(this.cBlankTxn);
  }
}
