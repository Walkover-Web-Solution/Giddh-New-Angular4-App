import { INameUniqueName } from './nameUniqueName.interface';

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
  name: string;
  code: string;
}

export interface IInvoiceRequest {
  invoice: IInvoice;
}

export interface IInvoiceTransactionItem {
  accountUniqueName: string;
  description: string;
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
  isInclusiveTax: boolean;
  unconfirmedEntry: boolean;
  attachedFile: string;
  tag?: string;
  description?: string;
  generateInvoice: boolean;
  chequeNumber?: string;
  clearanceDate?: string;
  invoiceRequest: IInvoiceRequest;
}
