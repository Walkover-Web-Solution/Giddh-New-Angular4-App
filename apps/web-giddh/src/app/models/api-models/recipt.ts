import { ReferenceVoucher } from '../../material-ledger/ledger.vm';
import { InvoiceFilterClassForInvoicePreview } from './Invoice';
import { AmountClassMulticurrency, IInvoiceLinkingRequest } from "./Sales";

export class InvoiceReceiptFilter extends InvoiceFilterClassForInvoicePreview {
    public q: any;
    public sort: any;
    public sortBy: any;
    public isLastInvoicesRequest?: boolean = false;
    public purchaseOrderNumber?: any;
}

export interface ReciptDeleteRequest {
    invoiceNumber?: string;
    voucherType: string;
    uniqueName?: string;
}

export class ReceiptVoucherDetailsRequest {
    public invoiceNumber?: string;
    public voucherType: string;
    public uniqueName?: string;
}

export interface ReceiptAccount {
    uniqueName: string;
    accountType?: any;
    name: string;
    currency?: CurrencyClass;
    customerName?: string;
}

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

export interface ReciptResponse {
    items: ReceiptItem[];
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
}

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

export interface CompanyDetails {
    name: string;
    gstNumber: string;
    address: string[];
    stateCode: string;
    panNumber?: string;
}

export interface BillingDetails {
    gstNumber?: string;
    address: string[];
    stateCode: string;
    stateName: string;
    panNumber?: string;
}

export interface ShippingDetails {
    gstNumber?: string;
    address: string[];
    stateCode: string;
    stateName: string;
    panNumber?: string;
}

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

export interface TemplateDetails {
    logoPath: string;
    other: Other;
    templateUniqueName: string;
}

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

export interface Voucher {
    voucherDetails: VoucherDetails;
    companyDetails: CompanyDetails;
    accountDetails: AccountDetails;
    templateDetails: TemplateDetails;
    entries: Entry[];
    deposit?: any;
}

export interface ReciptRequest {
    entryUniqueNames: string[];
    updateAccountDetails: boolean;
    voucher: Voucher;
}

export interface DownloadVoucherRequest {
    voucherNumber?: string[];
    voucherType: string;
    uniqueName?: string;
    typeOfInvoice?: string[];
    copyTypes?: string[];
}
class CurrencyClass {
    public code: string;
    public symbol?: string;
}

/** Voucher request modal */
export class VoucherRequest {
    public number: string;
    public type: string;
    public uniqueName: string;
    constructor(voucherNumber: string, type: string, uniqueName?: string) {
        this.number = voucherNumber ?? '';
        this.type = type ?? '';
        this.uniqueName = uniqueName;
    }
}
