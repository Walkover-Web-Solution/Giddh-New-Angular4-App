import { TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../models/api-models/Account';
import { ILedgerDiscount, ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { Select2OptionData } from '../shared/theme/select2/select2.interface';
import { IFlattenGroupsAccountsDetail } from '../models/interfaces/flattenGroupsAccountsDetail.interface';
import * as uuid from 'uuid';

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
  public today: Date = new Date();
  public fromDate: Date;
  public toDate: Date;
  public format: string = 'dd-MM-yyyy';
  public accountUnq: string = ''; // $stateParams.unqName
  public blankLedger: BlankLedgerVM;

  constructor() {
    this.noAccountChosenForNewEntry = false;
    this.blankLedger = {
      transactions: [
        {
          id: uuid.v4(),
          amount: 0,
          particular: '',
          type: 'DEBIT',
          taxes: [],
          tax: 0,
          total: 0,
          discount: 0,
          discounts: [],
          selectedAccount: null
        },
        {
          id: uuid.v4(),
          amount: 0,
          particular: '',
          type: 'CREDIT',
          taxes: [],
          tax: 0,
          total: 0,
          discount: 0,
          discounts: [],
          selectedAccount: null
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
  public id?: string;
  public amount: number;
  public particular: string;
  public type: string;
  public taxes: string[];
  public tax?: number;
  public total: number;
  public discounts: ILedgerDiscount[];
  public discount?: number;
  public selectedAccount?: IFlattenAccountsResultItem | any;
}
