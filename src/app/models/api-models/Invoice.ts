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
  public combined: boolean;
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
    sectionsV2: any[];
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

/**
 * Preview and Generate Invoice
 * method: 'POST'
 * url: '/company/:companyUniqueName'accounts/:accountUniqueName/invoices/preview''
 */

export class PreviewAndGenerateInvoiceRequest {
  public uniqueNames: string[];
}

export class PreviewAndGenerateInvoiceResponse {
  public logo: Logo;
  public company: Company;
  public account: Account;
  public signature: Signature;
  public companyIdentities: CompanyIdentities;
  public terms: string[];
  public template: Template;
  public entries: Entry[];
  public taxes: Tax[];
  public totalAsWords?: any;
  public roundOff?: any;
  public balanceStatus: string;
  public sealPath: string;
  public commonDiscounts: any[];
  public gstDetails: GstDetails;
  public other?: any;
  public invoiceDetails: InvoiceDetails;
  public ledgerUniqueNames: string[];
  public taxTotal: number;
  public subTotal: number;
  public grandTotal: number;
  public discountTotal: number;
}

export interface Account {
    name: string;
    uniqueName: string;
    data: string[];
    attentionTo: string;
    email: string;
    mobileNumber?: any;
}

export interface Transaction {
    amount: number;
    accountUniqueName: string;
    discount: any[];
    accountName: string;
    description: string;
}

export interface Entry {
    uniqueName: string;
    transactions: Transaction[];
}

export interface Tax {
    hasError: boolean;
    amount: number;
    visibleTaxRate: number;
    taxRate: number;
    accountName: string;
    accountUniqueName: string;
    errorMessage: string;
}

export interface Tax2 {
    accountName: string;
    accountUniqueName: string;
    amount: number;
    rate: number;
}

export interface Transaction2 {
    accountName: string;
    accountUniqueName: string;
    amount: number;
    hsnNumber?: any;
    sacNumber?: any;
    description: string;
    quantity?: any;
    stockUnit?: any;
    rate?: any;
}

export interface GstEntry {
    uniqueName: string;
    discounts: any[];
    taxes: Tax2[];
    transactions: Transaction2[];
    description: string;
    taxableValue: number;
    entryTotal: number;
}

export interface CompanyGstDetails {
    gstNumber?: any;
    address: string[];
    stateCode?: any;
    panNumber?: any;
}

export interface AccountGstBillingDetails {
    gstNumber?: any;
    address: string[];
    stateCode?: any;
    panNumber?: any;
}

export interface AccountGstShippingDetails {
    gstNumber?: any;
    address: string[];
    stateCode?: any;
    panNumber?: any;
}

export interface GstTaxesTotal {
    uniqueName: string;
    name: string;
    total: number;
}

export interface GstDetails {
    gstEntries: GstEntry[];
    companyGstDetails: CompanyGstDetails;
    accountGstBillingDetails: AccountGstBillingDetails;
    accountGstShippingDetails: AccountGstShippingDetails;
    gstTaxableValueTotal: number;
    gstEntriesTotal: number;
    gstTaxesTotal: GstTaxesTotal[];
    showTaxes: boolean;
    showDiscount: boolean;
    showHsn: boolean;
    showSac: boolean;
    showQty: boolean;
    showRate: boolean;
}
