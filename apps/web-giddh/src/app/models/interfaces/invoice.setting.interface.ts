import { RazorPayDetailsResponse } from '../api-models/SettingsIntegraion';

export interface InvoiceWebhooks {
    entity: string;
    operation?: string;
    triggerAt: number;
    uniqueName?: string;
    url: string;
}

export interface InvoiceSetting {
    purchaseBillSettings?: any;
    invoiceSettings: InvoiceSettings;
    proformaSettings: ProformaSettings;
    estimateSettings: EstimateSettings;
    webhooks: any[];
    razorPayform?: RazorPayDetailsResponse;
    companyEmailSettings: CompanyEmailSettings;
    companyCashFreeSettings: CompanyCashFreeSettings;
    companyInventorySettings: CompanyInventorySettings;
}

export class CompanyInventorySettings {
    manageInventory: boolean;
}

export class CompanyCashFreeSettings {
    autoCreateVirtualAccountsForDebtors: boolean;
    noOfEntriesToEnableAutoCreateVirtualAccountForDebtors?: any;
    enableCronForVAccCreation?: any;
}

export class CompanyEmailSettings {
    sendThroughSendgrid: boolean;
    sendThroughGmail: boolean;
}

export class EstimateSettings {
    headerName: string;
    nextStepToEstimate: string;
    autoChangeStatusOnExp: boolean;
    sendSms?: any;
    duePeriod: number;
    autoMail: boolean;
    enableEstimate: boolean;
}

export class ProformaSettings {
    duePeriod?: any;
    autoMail: boolean;
    autoEntryAndInvoice: boolean;
    showSeal: boolean;
    autoPaid: string;
    createPaymentEntry: boolean;
    email?: any;
    emailVerified?: any;
    headerName: string;
    autoChangeStatusOnExp?: any;
    sendSms: boolean;
    enableProforma: boolean;
}

export class InvoiceSettings {
    duePeriod?: any;
    autoMail: boolean;
    autoEntryAndInvoice: boolean;
    showSeal: boolean;
    autoPaid: any;
    branchInvoiceNumberPrefix: any;
    createPaymentEntry: boolean;
    email?: any;
    emailVerified?: any;
    autoEntryVoucherAndEmail: boolean;
    lockDate: string;
    useCustomInvoiceNumber: boolean;
    useCustomCreditNoteNumber: boolean;
    useCustomDebitNoteNumber: boolean;
    useCustomReceiptNumber: boolean;
    useCustomPaymentNumber: boolean;
    useCustomContraNumber: boolean;
    useCustomPurchaseNumber: boolean;
    invoiceNumberPrefix?: any;
    creditNoteNumberPrefix?: any;
    debitNoteNumberPrefix?: any;
    receiptNumberPrefix?: any;
    paymentNumberPrefix?: any;
    contraNumberPrefix?: any;
    purchaseNumberPrefix?: any;
    initialInvoiceNumber?: any;
    initialCreditNoteNumber?: any;
    initialDebitNoteNumber?: any;
    initialReceiptNumber?: any;
    initialPaymentNumber?: any;
    initialContraNumber?: any;
    initialPurchaseNumber?: any;
    defaultPaymentGateway: string;
    enableNarrationOnInvAndVoucher: boolean;
    sendInvLinkOnSms: boolean;
    smsContent?: any;
    autoDeleteEntries?: any;
    gstEInvoiceEnable?: boolean;
    gstEInvoiceGstin?: string;
    gstEInvoiceUserName?: string;
    gstEInvoiceUserPassword?: string;
}
