export enum TaxSupportedCountries {
    'IN' = 'IN',
    'UAE' = 'UAE',
    'UK' = 'UK'
};

export enum TaxType {
    'GST' = 'GST',
    'TRN' = 'TRN',
    'VAT' = 'VAT'
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

export enum BriedAccountsGroup {
    'V1' = 'cash, bankaccounts',
    'V2' = 'cash, bankaccounts, loanandoverdraft'
};