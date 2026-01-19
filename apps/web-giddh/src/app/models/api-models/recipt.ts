import { ReferenceVoucher } from '../../ledger/ledger.vm';
import { InvoiceFilterClassForInvoicePreview } from './Invoice';
import { AmountClassMulticurrency, IInvoiceLinkingRequest } from "./Sales";

/**
 * InvoiceReceiptFilter class
 * Implements InvoiceReceiptFilter functionality
 */
export class InvoiceReceiptFilter extends InvoiceFilterClassForInvoicePreview {
    public q: any;
    public sort: any;
    public sortBy: any;
    public isLastInvoicesRequest?: boolean = false;
    public purchaseOrderNumber?: any;
    public balanceStatus?: any;
    public accountUniqueName?: string;
    public source?: string;
}

/**
 * ReciptDeleteRequest interface definition
 * Defines the structure and contract for ReciptDeleteRequest objects
 */
export interface ReciptDeleteRequest {
    invoiceNumber?: string;
    voucherType: string;
    uniqueName?: string;
}

/**
 * ReceiptVoucherDetailsRequest class
 * Implements ReceiptVoucherDetailsRequest functionality
 */
export class ReceiptVoucherDetailsRequest {
    public invoiceNumber?: string;
    public voucherType: string;
    public uniqueName?: string;
}

/**
 * ReceiptAccount interface definition
 * Defines the structure and contract for ReceiptAccount objects
 */
export interface ReceiptAccount {
    uniqueName: string;
    accountType?: any;
    name: string;
    currency?: CurrencyClass;
    customerName?: string;
}

/**
 * ReceiptItem interface definition
 * Defines the structure and contract for ReceiptItem objects
 */
export interface ReceiptItem {
    dueDays: number;
    voucherNumber: string;
    account: ReceiptAccount;
    uniqueName: string;
    balanceStatus: string;
    voucherDate: string;
    grandTotal: AmountClassMulticurrency;
    balanceDue: AmountClassMulticurrency;
    dueDate: string;
    isSelected?: boolean;
    cashInvoice: boolean;
    accountCurrencySymbol?: string;
    invoiceLinkingRequest?: IInvoiceLinkingRequest;
    totalBalance?: AmountClassMulticurrency;
    purchaseOrderNumbers?: number;
    grandTotalTooltipText?: string;
    balanceDueTooltipText?: string;
    status?: string;
    errorMessage?: string;
    eInvoiceStatusTooltip?: string;
    gainLoss?: number;
    exchangeRate?: number;
    referenceVoucher?: ReferenceVoucher;
    adjustments?: any;
}

/**
 * ReciptResponse interface definition
 * Defines the structure and contract for ReciptResponse objects
 */
export interface ReciptResponse {
    items: ReceiptItem[];
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
}

/**
 * VoucherDetails interface definition
 * Defines the structure and contract for VoucherDetails objects
 */
export interface VoucherDetails {
    voucherNumber: string;
    voucherDate: string;
    balance: number;
    balanceStatus: string;
    totalAsWords: string;
    grandTotal: number;
    subTotal: number;
    totalDiscount: number;
    taxesTotal?: {
        uniqueName?: string,
        name?: string,
        total?: number
    };
    customerName?: string;
}

/**
 * CompanyDetails interface definition
 * Defines the structure and contract for CompanyDetails objects
 */
export interface CompanyDetails {
    name: string;
    gstNumber: string;
    address: string[];
    stateCode: string;
    panNumber?: string;
}

/**
 * BillingDetails interface definition
 * Defines the structure and contract for BillingDetails objects
 */
export interface BillingDetails {
    gstNumber?: string;
    address: string[];
    stateCode: string;
    stateName: string;
    panNumber?: string;
}

/**
 * ShippingDetails interface definition
 * Defines the structure and contract for ShippingDetails objects
 */
export interface ShippingDetails {
    gstNumber?: string;
    address: string[];
    stateCode: string;
    stateName: string;
    panNumber?: string;
}

/**
 * AccountDetails interface definition
 * Defines the structure and contract for AccountDetails objects
 */
export interface AccountDetails {
    name: string;
    uniqueName: string;
    address: string[];
    attentionTo: string;
    email: string;
    mobileNumber: string;
    billingDetails: BillingDetails;
    shippingDetails: ShippingDetails;
}

/**
 * Other interface definition
 * Defines the structure and contract for Other objects
 */
export interface Other {
    message1: string;
    message2: string;
    shippingDate?: string;
    shippedVia?: string;
    trackingNumber?: string;
    customField1?: string;
    customField2?: string;
    customField3?: string;
    slogan?: string;
}

/**
 * TemplateDetails interface definition
 * Defines the structure and contract for TemplateDetails objects
 */
export interface TemplateDetails {
    logoPath: string;
    other: Other;
    templateUniqueName: string;
}

/**
 * Transaction interface definition
 * Defines the structure and contract for Transaction objects
 */
export interface Transaction {
    accountName: string;
    accountUniqueName: string;
    amount: number;
    hsnNumber: string;
    sacNumber?: string;
    description: string;
    quantity?: string;
    stockUnit: string;
    category: string;
    taxableValue: number;
    date?: any;
    isStockTxn?: boolean;
    stockDetails?: string;
    rate?: number;
}

/**
 * Entry interface definition
 * Defines the structure and contract for Entry objects
 */
export interface Entry {
    uniqueName: string;
    discounts: number[];
    taxes: number[];
    transactions: Transaction[];
    description: string;
    taxableValue: number;
    discountTotal: number;
    nonTaxableValue: number;
    entryDate: string;
    taxList: string[];
    voucherType: string;
    entryTotal: number;
}

/**
 * Voucher interface definition
 * Defines the structure and contract for Voucher objects
 */
export interface Voucher {
    voucherDetails: VoucherDetails;
    companyDetails: CompanyDetails;
    accountDetails: AccountDetails;
    templateDetails: TemplateDetails;
    entries: Entry[];
    deposit?: any;
}

/**
 * ReciptRequest interface definition
 * Defines the structure and contract for ReciptRequest objects
 */
export interface ReciptRequest {
    entryUniqueNames: string[];
    updateAccountDetails: boolean;
    voucher: Voucher;
}

/**
 * DownloadVoucherRequest interface definition
 * Defines the structure and contract for DownloadVoucherRequest objects
 */
export interface DownloadVoucherRequest {
    voucherNumber?: string[];
    voucherType: string;
    uniqueName?: string;
    typeOfInvoice?: string[];
    copyTypes?: string[];
}
/**
 * CurrencyClass class
 * Implements CurrencyClass functionality
 */
class CurrencyClass {
    public code: string;
    public symbol?: string;
}

/** Voucher request modal */
/**
 * VoucherRequest class
 * Implements VoucherRequest functionality
 */
export class VoucherRequest {
    public number: string;
    public type: string;
    public uniqueName: string;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(voucherNumber: string, type: string, uniqueName?: string) {
        this.number = voucherNumber ?? '';
        this.type = type ?? '';
        this.uniqueName = uniqueName;
    }
}
