import { TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../models/api-models/Account';
import { ILedgerDiscount, ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { Select2OptionData } from '../shared/theme/select2/select2.interface';
import { IFlattenGroupsAccountsDetail } from '../models/interfaces/flattenGroupsAccountsDetail.interface';
import * as uuid from 'uuid';
import { cloneDeep } from 'lodash';
import { createAutoCorrectedDatePipe } from '../shared/helpers/autoCorrectedDatePipe';

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
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public datePipe = createAutoCorrectedDatePipe('dd-mm-yyyy');

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
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true
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
  }

  /**
   * prepare blankLedger request object from vm
   * @returns {BlankLedgerVM}
   */
  public prepareBlankLedgerRequestObject(): BlankLedgerVM {
    let requestObj: BlankLedgerVM;
    requestObj = cloneDeep(this.blankLedger);

    // filter transactions which have selected account
    requestObj.transactions = requestObj.transactions.filter(bl => bl.particular);

    // map over transactions array
    requestObj.transactions.map((bl: any) => {
      // set transaction.particular to selectedAccount uniqueName
      bl.particular = bl.selectedAccount.uniqueName;
      // filter taxes uniqueNames
      bl.taxes = bl.taxes.filter(p => p.isChecked).map(p => p.uniqueName);
      // filter discount
      bl.discounts = bl.discounts.filter(p => p.amount > 0);
      // delete local id
      delete bl['id'];
    });
    return requestObj;
  }

  /**
   * add new transaction object of given type
   * @param {string} type
   * @returns {TransactionVM}
   */
  public addNewTransaction(type: string = 'DEBIT'): TransactionVM {
    return {
      id: uuid.v4(),
      amount: 0,
      tax: 0,
      total: 0,
      particular: '',
      type,
      taxes: [],
      discount: 0,
      discounts: [],
      selectedAccount: null,
      applyApplicableTaxes: true,
      isInclusiveTax: true
    };
  }
}

export class BlankLedgerVM {
  public transactions: TransactionVM[];
  public voucherType: string;
  public entryDate: string;
  public unconfirmedEntry: boolean;
  public attachedFile: string;
  public attachedFileName?: string;
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
  public applyApplicableTaxes: boolean;
  public isInclusiveTax: boolean;
  public type: string;
  public taxes: string[];
  public tax?: number;
  public total: number;
  public discounts: ILedgerDiscount[];
  public discount?: number;
  public selectedAccount?: IFlattenAccountsResultItem | any;
}
