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

export interface IGetAllInvoicesResponse extends IPagination {
  size: number;
  results: IInvoiceResult[];
}

export class GetAllInvoicesPaginatedResponse {
  public count: number;
  public page: number;
  public results: ILedgersInvoiceResult[];
  public size: number;
  public totalItems: number;
  public totalPages: number;
}

export class CommonPaginatedRequest {
  public from?: string;
  public to?: string;
  public count?: number;
  public page?: number;
}

export class InvoiceFilterClass extends CommonPaginatedRequest {
  public totalIsMore?: boolean;
  public totalIsLess?: boolean;
  public totalIsEqual?: boolean;
  public description?: string;
  public accountUniqueName?: string;
  public entryTotal?: string;
  public entryTotalBy?: string;
}

export interface ILedgersInvoiceResult {
  account: INameUniqueName;
  transactions: ILedgerTransactionItem[];
  description: string;
  total: ITotalItem;
  entryDate: string;
  uniqueName: string;
  isSelected?: boolean;
}

export interface GetAllLedgersForInvoiceResponse extends IPagination {
  size: number;
  results: ILedgersInvoiceResult[];
}

export class GetAllLedgersOfInvoicesResponse {
  public count: number;
  public page: number;
  public results: ILedgersInvoiceResult[];
  public size: number;
  public totalItems: number;
  public totalPages: number;
}

/**
 * Generate Bulk Invoice Request
 * method: 'POST'
 * url: '/company/:companyUniqueName/invoices/bulk-generate?combined=:combined'
 */

export class GenerateBulkInvoiceRequest {
  public accountUniqueName: string;
  public entries: string[];
}

/**
 * Action On Invoice Request
 * method: 'POST'
 * url: '/company/:companyUniqueName/invoices/action'
 */

export class ActionOnInvoiceRequest {
  public amount: number;
  public action: string;
}

/**
 * Get Template Response
 * method: 'GET'
 * url: '/company/:companyUniqueName/invoices/proforma/templates'
 */

export class GetTemplateResponse {
  public templates: Template[];
  public templateData: TemplateData;
}

export interface Template {
    uniqueName: string;
    template: string;
    sections: Sections;
    isDefault: boolean;
    name: string;
}

export interface TemplateData {
    email?: any;
    emailVerified?: any;
    account: Account;
    companyIdentities: CompanyIdentities;
    company: Company;
    terms: any[];
    taxes?: any;
    template?: any;
    invoiceDetails: InvoiceDetails;
    logo: Logo;
    totalAmount: TotalAmount;
    signature: Signature;
    entries?: any;
}

export interface Sections {
    logo: boolean;
    company: boolean;
    invoiceDetails: boolean;
    companyIdentities: boolean;
    account: boolean;
    signature: boolean;
    terms: boolean;
    entries: boolean;
    taxes: boolean;
    signatureType: string;
}

export interface Account {
    name: string;
    data: any[];
    attentionTo?: any;
}

export interface CompanyIdentities {
    data: string;
}

export interface Company {
    name: string;
    data: any[];
}

export interface InvoiceDetails {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
}

export interface Logo {
    path: string;
}

export interface TotalAmount {
    subTotal?: any;
    taxTotal?: any;
    grandTotal?: any;
}

export interface Signature {
    name: string;
    data: string;
    path: string;
}

/**
 * Send Mail Request
 * method: 'POST'
 * url: '/company/:companyUniqueName/invoices/proforma/mail'
 */

export class SendMailRequest {
  public emailId: string[];
  public invoiceNumber: string[];
}
