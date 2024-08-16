export enum TaxSupportedCountries {
    'IN' = 'IN',
    'UAE' = 'UAE',
    'GB' = 'GB',
    'ZW' = 'ZW',
    'KE' = 'KE',
    'UK' = 'UK',
    'US' = 'US'
};

export enum TaxType {
    'GST' = 'GST',
    'TRN' = 'TRN',
    'VAT' = 'VAT',
    'SALES_TAX' = 'SALES_TAX'
};

export enum VoucherTypeEnum {
    'sales' = 'sales',
    'purchase' = 'purchase',
    'debitNote' = 'debit note',
    'creditNote' = 'credit note',
    'proforma' = 'proforma',
    'generateProforma' = 'proformas',
    'estimate' = 'estimate',
    'generateEstimate' = 'estimates',
    'cash' = 'cash',
    'receipt' = 'receipt',
    'payment' = 'payment',
    'cashDebitNote' = 'cash debit note',
    'cashCreditNote' = 'cash credit note',
    'cashBill' = 'cash bill',
    'purchaseOrder' = 'purchase-order'
};

export const SearchType = {
    CUSTOMER: 'customer',
    ITEM: 'item',
    BANK: 'bank'
};

export const BriedAccountsGroup = 'cash, bankaccounts, loanandoverdraft';

export enum AccountType {
    'customer' = 'customer',
    'bank' = 'bank'
};

export const OtherTaxTypes = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];

export const MULTI_CURRENCY_MODULES = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.purchaseOrder];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];