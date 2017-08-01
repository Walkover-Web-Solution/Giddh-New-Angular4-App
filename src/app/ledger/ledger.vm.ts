import { TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../models/api-models/Account';
import { ILedgerDiscount, ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { Select2OptionData } from '../shared/theme/select2/select2.interface';
import { IFlattenGroupsAccountsDetail } from '../models/interfaces/flattenGroupsAccountsDetail.interface';
import { INameUniqueName } from '../models/interfaces/nameUniqueName.interface';

export class LedgerVM {
  public activeAccount$: Observable<AccountResponse>;
  public transactionData$: Observable<TransactionsResponse>;
  public selectedTxnUniqueName: string;
  public currentTxn: ITransactionItem;
  public currentBlankTxn: TransactionVM;
  public currentPage: number;
  public flatternAccountList: Observable<Select2OptionData[]>;
  public discountAccountsList: IFlattenGroupsAccountsDetail[] = [];
  public showNewLedgerPanel: boolean = false;
  public noAccountChosenForNewEntry: boolean;
  public selectedAccount: IFlattenAccountsResultItem = null;
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
  public showLedgerPopover: boolean;
  public adjustHeight = 0;
  public dLedgerLimit = 10;
  public cLedgerLimit = 10;
  public entrySettings = {};
  public firstLoad: boolean = true;
  public showTaxList: boolean = true;
  public hasTaxTransactions: boolean = true;
  public blankLedger: BlankLedgerVM;
  public dBlankTxn: any;
  public cBlankTxn: any;

  constructor() {
    this.noAccountChosenForNewEntry = false;
    this.blankLedger = {
      transactions: [
        {
          amount: 0,
          particular: '',
          type: 'DEBIT',
          taxes: [],
          discounts: []
        },
        {
          amount: 0,
          particular: '',
          type: 'CREDIT',
          taxes: [],
          discounts: []
        }],
      voucherType: 'Purchases',
      entryDate: moment().format('DD-MM-YYYY'),
      applyApplicableTaxes: true,
      isInclusiveTax: true,
      unconfirmedEntry: false,
      attachedFile: '',
      tag: null,
      description: '',
      generateInvoice: false,
      chequeNumber: '',
      chequeClearanceDate: moment().format('DD-MM-YYYY')
    };
  }
}

export class BlankLedgerVM {
  public transactions: TransactionVM[];
  public voucherType: string;
  public entryDate: string;
  public applyApplicableTaxes: boolean;
  public isInclusiveTax: boolean;
  public unconfirmedEntry: boolean;
  public attachedFile: string;
  public tag: any;
  public description: string;
  public generateInvoice: boolean;
  public chequeNumber: string;
  public chequeClearanceDate: string;
}

export class TransactionVM {
  public amount: number;
  public particular: string;
  public type: string;
  public taxes: string[];
  public tax?: number;
  public discounts: ILedgerDiscount[];
}
