import { INameUniqueName } from './nameUniqueName.interface';
import { IPagination } from './paginatedResponse.interface';

export interface ILedgerTransactionItem {
  amount: string;
  particular: string;
  type: string;
  isStock?: boolean;
  inventory?: IInventory;
}

export interface IInventory {
  stock?: INameUniqueName;
  quantity: number;
  unit: IUnit;
}

export interface IUnit {
  name?: string;
  code: string;
}

export interface IInvoiceRequest {
  invoice: IInvoice;
}

export interface IInvoiceTransactionItem {
  accountUniqueName: string;
  description?: string;
}

export interface IInvoiceEntryItem {
  transactions: IInvoiceTransactionItem[];
}

export interface IInvoice {
  entries: IInvoiceEntryItem[];
}

export interface ILedger {
  transactions: ILedgerTransactionItem[];
  voucherType: string;
  entryDate: string;
  taxes?: string[];
  applyApplicableTaxes?: boolean;
  isInclusiveTax?: boolean;
  unconfirmedEntry?: boolean;
  attachedFile?: string;
  tag?: string;
  description?: string;
  generateInvoice?: boolean;
  chequeNumber?: string;
  clearanceDate?: string;
  invoiceRequest?: IInvoiceRequest;
}


export interface ITransactions extends IPagination {
  closingBalance: IClosingBalance;
  creditTotal: number;
  creditTransactions: ITransactionItem[];
  creditTransactionsCount: number;
  debitTotal: number;
  debitTransactions: ITransactionItem[];
  debitTransactionsCount: number;
  forwardedBalance: IForwardBalance;
}

export interface IClosingBalance {
  amount: number;
  type: string;
}

export interface IForwardBalance extends IClosingBalance {
  description?: string;
}

export interface ITransactionItem {
  amount: number;
  attachedFileName: string;
  attachedFileUniqueName: string;
  chequeClearanceDate: string;
  chequeNumber: string;
  description: string;
  entryCreatedAt: string;
  entryDate: string;
  entryUniqueName: string;
  inventory?: IInventory;
  invoiceNumber: string;
  isBaseAccount: boolean;
  isCompoundEntry: boolean;
  isInvoiceGenerated: boolean;
  isTax: boolean;
  particular: INameUniqueName;
  type: string;
  unconfirmedEntry: boolean;
}

/**
 * interface used in reconcile api's response
 * keeping inventory as "any" because I am not ure about the structure of inventory object
 */
export interface IReconcileTransaction {
  particular: INameUniqueName;
  amount: number;
  type: string;
  inventory?: any;
  isTax: boolean;
  isBaseAccount: boolean;
}
