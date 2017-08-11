/**
 * Model for get invoices request
 * POST call
 * API:: company/:companyUniqueName/invoices?from,to
 * used to draw ui on invoice page
 */

import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
import { ILedgerTransactionItem, ITotalItem } from '../interfaces/ledger.interface';
import { IPagination } from '../interfaces/paginatedResponse.interface';

export interface IInvoiceResult {
  companyName: string;
  uniqueName: string;
  balanceStatus: string;
  invoiceNumber: string;
  invoiceDate: string;
  sealPath?: any;
  grandTotal: number;
  account: INameUniqueName;
  balanceDue: number;
}

export interface GetAllInvoicesResponse extends IPagination {
  size: number;
  results: IInvoiceResult[];
}

export class CommonPaginatedRequest {
  public from?: string;
  public to?: string;
  public count?: number;
  public page?: number;
}

export class InvoiceFilterClass extends CommonPaginatedRequest {
  public totalIsMore?: string;
  public totalIsLess?: string;
  public totalIsEqual?: string;
  public description?: string;
  public accountUniqueName?: string;
  public entryTotal?: string;
}

export interface ILedgersInvoiceResult {
  account: INameUniqueName;
  transactions: ILedgerTransactionItem[];
  description: string;
  total: ITotalItem;
  entryDate: string;
  uniqueName: string;
}

export interface GetAllLedgersForInvoiceResponse extends IPagination {
  size: number;
  results: ILedgersInvoiceResult[];
}
