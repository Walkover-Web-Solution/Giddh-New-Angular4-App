export const VOUCHER_TYPES = {
    SALES: 'sales',
    PURCHASE: 'purchase',
    RECEIPT: 'receipt',
    PAYMENT: 'payment',
    JOURNAL: 'journal',
    CONTRA: 'contra',
    DEBIT_NOTE: 'debit note',
    CREDIT_NOTE: 'credit note'
};

export const VOUCHER_STATUS = {
    DRAFT: 'draft',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const VOUCHER_CONSTANTS = {
    DEFAULT_CURRENCY: 'INR',
    MAX_ENTRIES: 100,
    MIN_ENTRIES: 2
};

export enum VoucherTypeEnum {
    SALES = 'sales',
    PURCHASE = 'purchase',
    RECEIPT = 'receipt',
    PAYMENT = 'payment',
    JOURNAL = 'journal',
    CONTRA = 'contra',
    DEBIT_NOTE = 'debit note',
    CREDIT_NOTE = 'credit note',
    generateEstimate = 'generate-estimate',
    generateProforma = 'generate-proforma',
    creditNote = 'credit note',
    debitNote = 'debit note',
    sales = 'sales',
    purchase = 'purchase',
    receipt = 'receipt',
    payment = 'payment',
    purchaseOrder = 'purchase-order'
}

export enum TaxType {
    GST = 'gst',
    VAT = 'vat',
    INCOME_TAX = 'income_tax',
    SERVICE_TAX = 'service_tax',
    TRN = 'trn'
}

export const TaxSupportedCountries = {
    INDIA: 'IN',
    UAE: 'AE',
    UK: 'GB',
    IN: 'IN'
};
