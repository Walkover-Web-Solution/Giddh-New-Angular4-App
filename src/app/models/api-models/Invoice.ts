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
  isSelected?: boolean;
}

export interface IGetAllInvoicesResponse extends IPagination {
  size: number;
  results: IInvoiceResult[];
}

export class GetAllInvoicesPaginatedResponse {
  public count: number;
  public page: number;
  // public results: ILedgersInvoiceResult[];
  public results: IInvoiceResult[];
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
  invoiceNumber?: string;
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
 * Preview Invoice
 * method: 'POST'
 * url: '/company/:companyUniqueName'accounts/:accountUniqueName/invoices/preview''
 */

export class PreviewInvoiceRequest {
  public uniqueNames: string[];
}

export class PreviewInvoiceResponseClass {
  public logo: string;
  public company: Company;
  public customerName: string;
  public account: Account;
  public signature: Signature;
  public templateUniqueName: string;
  public roundOff: RoundOff;
  public balanceStatus: string;
  public balanceStatusSealPath: string;
  public commonDiscounts: any[];
  public entries: GstEntry[];
  public totalTaxableValue: number;
  public grandTotal: number;
  public totalInWords?: any;
  public subTotal: number;
  public totalDiscount: number;
  public totaltaxBreakdown: TotaltaxBreakdown[];
  public totalTax?: any;
  public invoiceDetails: InvoiceDetails;
  public other?: any;
}

 export interface TotaltaxBreakdown {
  amount: number;
  visibleTaxRate: number;
  accountName: string;
  accountUniqueName: string;
  hasError: boolean;
  taxRate: number;
  errorMessage: string;
}

export interface RoundOff {
  transaction: Transaction;
  uniqueName: string;
  isTransaction: boolean;
  balanceType: string;
}

export interface Account {
  name: string;
  uniqueName: string;
  data: string[];
  attentionTo: string;
  email: string;
  mobileNumber?: any;
}

export interface ICommonItemOfTransaction {
  amount: number;
  accountUniqueName: string;
  accountName: string;
}

export interface Transaction extends ICommonItemOfTransaction {
  discount: any[];
  description: string;
}

export interface IInvoiceTransaction extends ICommonItemOfTransaction {
  hsnNumber?: any;
  sacNumber?: any;
  description: string;
  quantity?: any;
  stockUnit?: any;
  rate?: any;
}

export interface Tax extends ICommonItemOfTransaction {
  hasError: boolean;
  visibleTaxRate: number;
  taxRate: number;
  errorMessage: string;
}

export interface IInvoiceTax extends ICommonItemOfTransaction {
  rate: number;
}

export interface GstEntry {
  uniqueName: string;
  discounts: ICommonItemOfTransaction[];
  taxes: IInvoiceTax[];
  transactions: IInvoiceTransaction[];
  description: string;
  taxableValue: number;
  entryTotal: number;
}

export interface IGstDetails {
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
  companyGstDetails: IGstDetails;
  accountGstBillingDetails: IGstDetails;
  accountGstShippingDetails: IGstDetails;
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

/**
 * Generate Invoice model
 */
export class GenerateInvoiceRequestClass {
  public uniqueNames: string[];
  public validateTax: boolean;
  public invoice: any;
  public updateAccountDetails: boolean;
}

/*
*
*/

export class GenBulkInvoiceGroupByObj {
  public accUniqueName: string;
  public uniqueName: string;
}

export class GenBulkInvoiceFinalObj {
  public accountUniqueName: string;
  public entries: string[];
}

/*
* Get invoice template details response model
*/
export class GetInvoiceTemplateDetailsResponse {
  public sections: ISection[];
  public isDefault: boolean;
  public isSample: boolean;
  public uniqueName: string;
  public name: string;
}

// check if use other wise remove
export interface InvoiceTemplateDetailsResponse {
  sample?: any;
  color: string;
  sections: ISection[];
  isDefault: boolean;
  fontSize: string;
  font: string;
  topMargin: number;
  leftMargin: number;
  rightMargin: number;
  bottomMargin: number;
  logoPosition: string;
  logoSize: string;
  uniqueName: string;
  name: string;
}

export interface ISection {
  sectionName: string;
  content: IContent[];
}

export interface IContent {
  display: boolean;
  label: string;
  field: string;
  width?: string;
}
