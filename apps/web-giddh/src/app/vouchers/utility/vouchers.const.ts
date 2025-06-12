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

export const MULTI_CURRENCY_MODULES = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.purchaseOrder, VoucherTypeEnum.receipt, VoucherTypeEnum.payment];

/**
 * Enum for Other tax types
 */
export enum OtherTaxTypeEnum {
    'TDS' = 'tds',
    'TCS' = 'tcs'
};

/** Enum for Tax Collection Deduction Types */
export enum TaxCollectionDeductionType {
    TCS_RECEIVABLE = 'tcsrc',
    TDS_RECEIVABLE = 'tdsrc',
    TCS_PAYABLE = 'tcspay',
    TDS_PAYABLE = 'tdspay',
    GST_CESS = 'gstcess'
}

/** Enum for voucher report filter module  */
export const VoucherReportFilterModuleEnum = {
    Sales: 'SALES',
    Proforma: 'PROFORMA',
    Estimate: 'ESTIMATE',
    CreditNote: 'CREDIT_NOTE',
    DebitNote: 'DEBIT_NOTE',
    Receipt: 'RECEIPT',
    Payment: 'PAYMENT',
    Purchase: 'PURCHASE',
    PurchaseOrder: 'PURCHASE_ORDER'
}

/** Enum for Estimate Table Columns */
export enum EstimateTableColumnsEnum {
    EstimateNo = 'estimate_no',
    EstimateDate = 'estimate_date',
    Customer = 'customer',
    TotalAmount = 'total_amt',
    ExpiryDate = 'expiry_date',
    Status = 'status',
    Action = 'action',
    CustomField1 = 'custom_field_1',
    CustomField2 = 'custom_field_2',
    CustomField3 = 'custom_field_3'
};

/** Enum for Proforma Table Columns */
export enum ProformaTableColumnsEnum {
    ProformaNo ='proforma_no',
    ProformaDate ='proforma_date',
    Customer = 'customer',
    TotalAmount = 'total_amt',
    ExpiryDate = 'expiry_date',
    Status = 'status',
    Action = 'action',
    CustomField1 = 'custom_field_1',
    CustomField2 = 'custom_field_2',
    CustomField3 = 'custom_field_3'
};

/** Enum for Sales Table Columns */
export enum SalesTableColumnsEnum {
    InvoiceNo = 'invoice_no',
    Customer = 'customer',
    InvoiceDate = 'invoice_date',
    Amount = 'amount',
    BalanceDue = 'balance_due',
    DueDate = 'due_date',
    Status = 'status',
    EInvoiceStatus = 'e_invoice_status',
    CustomField1 = 'custom_field_1',
    CustomField2 = 'custom_field_2',
    CustomField3 = 'custom_field_3'
}

/** Enum for Credit/Debit Note Table Columns */
export enum CreditDebitNoteTableColumnsEnum {
    CreditNoteNo = 'cr_note_no',
    DebitNoteNo = 'dr_note_no',
    Customer = 'customer',
    Date = 'date',
    LinkedInvoice = 'linked_invoice',
    TotalAmount = 'total_amt',
    Status = 'status',
    EInvoiceStatus = 'e_invoice_status',
    CustomField1 = 'custom_field_1',
    CustomField2 = 'custom_field_2',
    CustomField3 = 'custom_field_3'
};

/** Enum for Purchase order Table Columns */
export enum PurchaseOrderTableColumnsEnum {
    OrderNo = 'order_no',
    VendorName = 'vendor_name',
    Date = 'date',
    ExpectedDelivery = 'expected_delivery',
    TotalAmount = 'total_amt',
    Status = 'status'
};

/** Enum for Purchase Bill Table Columns */
export enum PurchaseBillTableColumnsEnum {
    BillNo = 'bill_no',
    Vendor = 'vendor',
    LinkedOrders = 'linked_orders',
    Date = 'date',
    DueDate = 'due_date',
    Amount = 'amount',
    Status = 'status',
    CustomField1 = 'custom_field_1',
    CustomField2 = 'custom_field_2',
    CustomField3 = 'custom_field_3'
};

/** Enum for Receipt Table Columns */
export enum ReceiptTableColumnsEnum {
    Receipt = 'receipt',
    Date = 'date',
    Type = 'type',
    CustomerName = 'customer_name',
    PaymentMode = 'payment_mode',
    Invoice = 'invoice',
    TotalAmount = 'total_amt',
    BalanceDue = 'balance_due'
};

/** Enum for Payment Table Columns */
export enum PaymentTableColumnsEnum {
    Payment = 'payment',
    Date = 'date',
    VendorName = 'vendor_name',
    PaymentMode = 'payment_mode',
    Invoice = 'invoice',
    TotalAmount = 'total_amt',
    BalanceDue = 'balance_due'
};