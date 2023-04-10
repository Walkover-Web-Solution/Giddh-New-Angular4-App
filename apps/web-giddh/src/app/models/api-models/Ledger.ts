import { IForwardBalance, ILedger, ILedgerTransactionItem, ITotalItem, ITransactionItem, ITransactions, IVoucherItem } from '../interfaces/ledger.interface';
import { INameUniqueName } from '../interfaces/name-unique-name.interface';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from './Sales';
import { PettyCashEntryStatus } from './Expences';
import { VoucherAdjustments } from './AdvanceReceiptsAdjust';
import { PAGINATION_LIMIT } from '../../app.constant';
import { ReferenceVoucher } from '../../ledger/ledger.vm';

/*
 * Model for ledger create api request
 * POST call
 * API:: ( ledger create) company/:companyUniqueName/accounts/:accountUniqueName/ledgers
 * in tranasaction there is a field isStock
 * if isStock is true we have to send inventory object inside it please see IInventory interface
 * its response wil be array of LedgerResponse
 */
export class LedgerRequest implements ILedger {
    public applyApplicableTaxes?: boolean;
    public attachedFile?: string;
    public attachedFileName?: string;
    public compoundTotal?: number;
    public chequeNumber?: string;
    public chequeClearanceDate?: string;
    public description?: string;
    public entryDate: string;
    public generateInvoice?: boolean;
    public isInclusiveTax?: boolean;
    public tag?: string;
    public taxes?: string[];
    public transactions: ILedgerTransactionItem[];
    public unconfirmedEntry?: boolean;
    public voucher: IVoucherItem;
    public voucherType?: string;
}

/*
 * Model for update ledger transaction api request
 * PUT call
 * API:: ( mail ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName
 * its response will be success message in body in single object of LedgerResponse
 */
export class LedgerUpdateRequest extends LedgerRequest {
    public invoiceNumber: string;
    public invoiceGenerated: boolean;
    public total: ITotalItem;
    public voucherNo: string;
}

export class LedgerResponseDiscountClass {
    public account: {
        accountType: string;
        uniqueName: string;
        name: string;
    };
    public amount: number;
    public discount: {
        uniqueName: string;
        name: string;
        discountType: 'FIX_AMOUNT' | 'PERCENTAGE';
        discountValue: number;
    };
}

/*
 * Model for Create, Update ledger entry api response
 * POST, PUT, GET call
 * Note:: while POST and GET LedgerResponse will be in array in body, and while put it will be a object in body
 * API:: ( Create ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers
 * API:: ( Update ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName
 * API:: ( Get single transaction detail in ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName
 */
export class LedgerResponse {
    public attachedFile?: string;
    public attachedFileName?: string;
    public chequeClearanceDate?: string;
    public chequeNumber?: string;
    public description?: string;
    public entryDate: string;
    public generateInvoice: boolean;
    public invoiceGenerated: boolean;
    public invoiceNumber: string;
    public invoiceNumberAgainstVoucher: string;
    public tag?: string;
    public taxes: string[];
    public total: IClosingBalance;
    public convertedTotal: IClosingBalance;
    public transactions: ILedgerTransactionItem[];
    public unconfirmedEntry: boolean;
    public uniqueName: string;
    public voucher: IVoucherItem = { name: '', shortCode: '' };
    public voucherNo: string;
    public voucherType?: string;
    public voucherNumber?: string;
    public tagNames?: string[];
    public voucherGenerated?: boolean;
    public voucherName?: string;
    public voucherGeneratedType?: string;
    public particular?: INameUniqueName;
    public particularType?: string;
    public actualAmount?: number;
    public actualRate?: number;
    public invoicesToBePaid?: string[];
    public linkedInvoices?: string[];
    public warning?: string;
    public availItc?: boolean;
    public sendToGstr2?: boolean;
    public discounts?: LedgerResponseDiscountClass[];
    public tcsCalculationMethod?: SalesOtherTaxesCalculationMethodEnum;
    public isOtherTaxesApplicable?: boolean;
    public otherTaxModal?: SalesOtherTaxesModal;
    public otherTaxesSum?: number;
    public tdsTcsTaxesSum?: number;
    public cessSum?: number;
    public tcsTaxes?: string[];
    public tdsTaxes?: string[];
    public otherTaxType?: 'tcs' | 'tds';
    public exchangeRate?: number = 1;
    public valuesInAccountCurrency?: boolean = false;
    public discountResources?: any[];
    public subVoucher?: string = '';
    public pettyCashEntryStatus?: PettyCashEntryStatus;
    public attachedFileUniqueNames?: string[];
    public itcAvailable?: string = '';
    public reverseChargeTaxableAmount?: number;
    public passportNumber?: string;
    public touristSchemeApplicable?: boolean;
    public invoiceLinkingRequest?: IInvoiceLinkingRequest;
    public voucherAdjustments?: VoucherAdjustments;
    public unitRates?: Array<any>;
    public entryVoucherTotals?: any;
    public voucherUniqueName?: string;
    public referenceVoucher?: ReferenceVoucher;
    public gainLoss?: number;
}

/** Model adjusted amounts for invoices */
export class AdjustedAmount {
    amountForAccount: number;
    amountForCompany: number;
}

/** Model invoice linking request */
export class IInvoiceLinkingRequest {
    public linkedInvoices: ILinkedInvoice[];
}

/** Model linked invoice */
export class ILinkedInvoice {
    public invoiceUniqueName: string;
    public invoiceNumber?: string;
    public voucherType: string;
}

/*
 * Model for mail ledger api request
 * POST call
 * API:: ( mail ledger ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/mail
 * its response will be success message in body
 */
export class MailLedgerRequest {
    public recipients: string[] = [];
}

/*
 * Model for Download invoice api request
 * POST call
 * API:: ( Download invoice ) company/:companyUniqueName/accounts/:accountUniqueName/invoices/download
 * its response will be success message in body
 */
export class DownloadLedgerRequest {
    public invoiceNumber?: string[];
    public voucherType: string;
    public uniqueName?: string;
}

export interface DownloadLedgerAttachmentResponse {
    fileType: string;
    name: string;
    uniqueName: string;
    uploadedFile: any;
}

/*
 * Model for Export Ledger api request
 * GET call
 * API:: ( Export Ledger ) company/:companyUniqueName/accounts/:accountUniqueName/export-ledger
 * you can also pass three query arameters parameters as
 * 1) from: this will be starting date
 * 2) ltype: layout type values [ 'admin-detailed', 'admin-condensed', view-detailed]
 * 3) to: this will be ending date
 * Reponse will be base 64 encoded string in body
 */

/*
 * Model for transactions api response
 * GET call
 * API:: ( transactions ) company/:companyUniqueName/accounts/:accountUniqueName/ledgers/transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to
 * you can also pass query arameters parameters as
 * 1) from: this will be starting date
 * 2) count: number per page sent 15
 * 3) to: this will be ending date
 * 4) q: query
 * 5) reversePage: boolean
 * 6) sort= asc or desc
 * 7) page: number
 * Reponse will be hash containing TransactionsResponse
 */

export class TransactionsResponse implements ITransactions {
    public closingBalance: IClosingBalance;
    public convertedClosingBalance?: IClosingBalance;
    public count: number;
    public creditTotal: number;
    public convertedCreditTotal?: number;
    public creditTransactions: ITransactionItem[];
    public creditTransactionsCount: number;
    public debitTotal: number;
    public convertedDebitTotal?: number;
    public debitTransactions: ITransactionItem[];
    public debitTransactionsCount: number;
    public forwardedBalance: IForwardBalance;
    public convertedForwardedBalance?: IForwardBalance;
    public page: number;
    public totalItems: number;
    public totalPages: number;
    public currencySymbol?: string;
    public currencyCode?: string;
    public convertedCurrencySymbol?: string;
    public convertedCurrencyCode?: string;
    public periodClosingBalance?: { amount: number; type: string; };
}

export class TransactionsRequest {
    public q: string = '';
    public page: number = 0;
    public count: number = PAGINATION_LIMIT;
    public accountUniqueName: string = '';
    public from: string = '';
    public to: string = '';
    public sort: string = 'asc';
    public reversePage: boolean = false;
    public accountCurrency: boolean = false;
    public branchUniqueName?: string;
}

export interface ReconcileRequest {
    accountUniqueName?: string;
    from?: string;
    to?: string;
    chequeNumber?: string;
}

export interface IReconcileTotal {
    amount: number;
    type: string;
}

export interface IReconcileVoucher {
    name: string;
    shortCode: string;
}

export class ReconcileResponse {
    public transactions: ILedgerTransactionItem[];
    public total: IReconcileTotal;
    public attachedFile: string;
    public invoiceGenerated: boolean;
    public attachedFileName?: string;
    public chequeNumber: string;
    public invoiceNumber: string;
    public entryDate: string;
    public taxes: string[];
    public uniqueName: string;
    public unconfirmedEntry: boolean;
    public purchaseInvoiceNumber: string;
    public sendToGstr2: boolean;
    public availItc: boolean;
    public invoiceNumberAgainstVoucher?: any;
    public warning?: any;
    public voucher: IReconcileVoucher;
    public voucherNo: number;
    public chequeClearanceDate: string;
    public tag?: any;
    public description: string;
}

export class MagicLinkRequest {
    public from: string = '';
    public to: string = '';
    public branchUniqueName?: string = '';
}

export class MagicLinkResponse {
    public magicLink: string;
}

export class ExportLedgerRequest {
    public from: string = '';
    public to: string = '';
    public type: string = '';
    public format?: string = 'excel';
    public sort?: string = 'asc';
    public withInvoice?: boolean = false;
    public balanceTypeAsSign?: boolean = false;
    public branchUniqueName?: string = '';
}

/**
 * model for eledger response
 */

export interface IELedgerResponse {
    transactions: IELedgerTransaction[];
    transactionId: string;
    date: string;
}

export interface IELedgerTransaction {
    remarks: IELedgerRemarks;
    amount: number;
    type: string;
}

export interface IELedgerRemarks {
    description: string;
    method: string;
    email?: any;
    name?: any;
    chequeNumber?: any;
}

/**
 * Ledger Advance Search Request and Response
 */

export interface ILedgerAdvanceSearchRequest {
    uniqueNames: string[];
    includeAmount: boolean;
    amount?: any;
    amountLessThan: boolean;
    amountEqualTo: boolean;
    amountGreaterThan: boolean;
    includeDescription?: any;
    description: string;
    isInvoiceGenerated: boolean;
    includeTag?: any;
    tags: string[];
    includeParticulars?: any;
    particulars: string[];
    chequeNumber: string;
    dateOnCheque: string;
    inventory: Inventory;
}

export interface ILedgerAdvanceSearchResponse {
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    debitTransactionsCount: number;
    creditTransactionsCount: number;
    forwardedBalance: IForwardedBalance;
    closingBalance: IClosingBalance;
    debitTotal: number;
    creditTotal: number;
    debitTransactions: DebitTransaction[];
    creditTransactions: any[];
}

export interface Inventory {
    includeInventory?: any;
    inventories: string[];
    quantity?: any;
    includeQuantity: boolean;
    quantityLessThan: boolean;
    quantityEqualTo: boolean;
    quantityGreaterThan: boolean;
    includeItemValue: boolean;
    itemValue: number;
    includeItemLessThan: boolean;
    includeItemEqualTo: boolean;
    includeItemGreaterThan: boolean;
}

export interface IForwardedBalance {
    amount: number;
    type: string;
    description: string;
}

export interface IClosingBalance {
    amount: number;
    type: string;
}

export interface IParticular {
    name: string;
    uniqueName: string;
}

export interface DebitTransaction {
    particular: IParticular;
    amount: number;
    type: string;
    inventory?: any;
    isTax: boolean;
    entryUniqueName: string;
    entryDate: string;
    isInvoiceGenerated: boolean;
    invoiceNumber: string;
    unconfirmedEntry: boolean;
    attachedFileName: string;
    attachedFileUniqueName: string;
    chequeNumber: string;
    chequeClearanceDate: string;
    entryCreatedAt: string;
    isBaseAccount: boolean;
    isCompoundEntry: boolean;
    description: string;
    voucherName: string;
    tag: string;
    convertedAmount?: string;
}

export interface InvoiceList {
    invoiceNumber: string;
    status: string;
}

export interface IUnpaidInvoiceListResponse {
    invoiceList: InvoiceList[];
    size: number;
}
