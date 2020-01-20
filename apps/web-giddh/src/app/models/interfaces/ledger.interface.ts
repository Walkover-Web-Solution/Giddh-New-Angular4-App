import { INameUniqueName } from '../api-models/Inventory';
import { IPagination } from './paginatedResponse.interface';
import { IFlattenAccountsResultItem } from './flattenAccountsResultItem.interface';
import { IInventoryUnit, WarehouseDetails } from '../../ledger/ledger.vm';

/**
 * interface used in transaction item everywhere
 */
export interface ILedgerTransactionItem {
    amount: number;
    amountSymbol?: string;
    amountCurrency?: string;
    amountForCompany?: any;
    date?: string;
    isStock?: boolean;
    inventory?: IInventory;
    isTax?: boolean;
    isDiscount?: boolean;
    isBaseAccount?: boolean;
    particular: INameUniqueName;
    type: string;
    selectedAccount?: IFlattenAccountsResultItem | any;
    unitRate?: IInventoryUnit[];
    isUpdated?: boolean;
    convertedAmount?: number;
    convertedAmountCurrency?: string;
    convertedAmountSymbol?: string;
}

export interface IInventory {
    amount: number;
    quantity: number;
    rate: number;
    stock?: INameUniqueName;
    unit: IInventoryUnit;
    warehouse?: WarehouseDetails;
}

export interface IUnit {
    name?: string;
    code?: string;
    hierarchicalQuantity?: number;
    parentStockUnit?: any;
    quantityPerUnit?: number;
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
    applyApplicableTaxes?: boolean;
    attachedFile?: string;
    attachedFileName?: string;
    compoundTotal?: number;
    chequeNumber?: string;
    chequeClearanceDate?: string;
    description?: string;
    entryDate: string;
    generateInvoice?: boolean;
    isInclusiveTax?: boolean;
    tag?: string;
    taxes?: string[];
    transactions: ILedgerTransactionItem[];
    unconfirmedEntry?: boolean;
    voucher: IVoucherItem;
    voucherType?: string;
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
    code?: string;
    symbol?: string;
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
    // invoiceNumber: string;
    voucherNumber: string;
    isBaseAccount: boolean;
    isCompoundEntry: boolean;
    // isInvoiceGenerated: boolean;
    voucherGenerated: boolean;
    isTax: boolean;
    particular: INameUniqueName;
    type: string;
    unconfirmedEntry: boolean;
    selectedAccount?: IFlattenAccountsResultItem | any;
    convertedAmount?: number;
    isChecked?: boolean;
    voucherName?: string;
    currencyCode?: string;
    currencySymbol?: string;
    convertedCurrencyCode?: string;
    convertedCurrencySymbol: string;
    companyCurrencyCode?: string;
    companyCurrencySymbol: string;
}

/**
 * interface used in create ledger request and response
 */
export interface IVoucherItem {
    name: string;
    shortCode: string;
}

/**
 * interface used in create ledger entry request and response
 */
export interface ITotalItem {
    amount: number;
    type: string;
}

export interface ILedgerDiscount {
    name: string;
    particular: string;
    amount: number;
    type?: string;
}
