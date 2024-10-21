import { PaypalDetailsResponse, RazorPayDetailsResponse } from '../api-models/SettingsIntegraion';

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
    paypalForm?: PaypalDetailsResponse;
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
    constructor(){
        this.sendThroughGmail = false;
    }
    sendThroughSendgrid: boolean;
    sendThroughGmail: boolean;
}

export class EstimateSettings {
    constructor() {
        this.autoMail = false;
        this.autoChangeStatusOnExp = false;
    }
    headerName: string;
    nextStepToEstimate: string;
    autoChangeStatusOnExp: boolean;
    sendSms?: any;
    duePeriod: number;
    autoMail: boolean;
    enableEstimate: boolean;
    autoWhatsApp: boolean;
}

export class ProformaSettings {
    constructor(){
        this.autoMail = false;
        this.autoChangeStatusOnExp = false;
    }
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
    poAutoWhatsApp: boolean;
}

export class InvoiceSettings {
    constructor(){
        this.showSeal = false;
        this.autoMail = false;
        this.useCustomInvoiceNumber = false;
        this.autoDeleteEntries = false;
        this.gstEInvoiceEnable = false;
        this.enableNarrationOnInvAndVoucher = false;
        this.salesRoundOff = false;
        this.purchaseRoundOff = false;
        this.debitNoteRoundOff = false;
        this.creditNoteRoundOff = false;     
        this.autoWhatsAppInvoice = true;
        this.autoWhatsAppCreditNote = true;
    }
    duePeriod?: any;
    autoMail: boolean;
    autoEntryAndInvoice: boolean;
    showSeal: boolean;
    autoPaid: any;
    autoGenerateVoucherFromEntry: boolean;
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
    salesRoundOff: boolean;
    purchaseRoundOff: boolean;
    debitNoteRoundOff: boolean;
    creditNoteRoundOff: boolean;
    autoWhatsAppInvoice: boolean;
    autoWhatsAppCreditNote: boolean;
    autoWhatsAppReceipt: boolean;
    autoWhatsAppDebitNote: boolean;
    autoWhatsAppPayment: boolean;
}
