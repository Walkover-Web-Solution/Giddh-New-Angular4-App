import { PaypalDetailsResponse, RazorPayDetailsResponse } from '../api-models/SettingsIntegraion';

/**
 * InvoiceWebhooks interface definition
 * Defines the structure and contract for InvoiceWebhooks objects
 */
export interface InvoiceWebhooks {
    entity: string;
    operation?: string;
    triggerAt: number;
    uniqueName?: string;
    url: string;
}

/**
 * InvoiceSetting interface definition
 * Defines the structure and contract for InvoiceSetting objects
 */
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

/**
 * CompanyInventorySettings class
 * Implements CompanyInventorySettings functionality
 */
export class CompanyInventorySettings {
    manageInventory: boolean;
}

/**
 * CompanyCashFreeSettings class
 * Implements CompanyCashFreeSettings functionality
 */
export class CompanyCashFreeSettings {
    autoCreateVirtualAccountsForDebtors: boolean;
    noOfEntriesToEnableAutoCreateVirtualAccountForDebtors?: any;
    enableCronForVAccCreation?: any;
}

/**
 * CompanyEmailSettings class
 * Implements CompanyEmailSettings functionality
 */
export class CompanyEmailSettings {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.sendThroughGmail = false;
    }
    sendThroughSendgrid: boolean;
    sendThroughGmail: boolean;
}

/**
 * EstimateSettings class
 * Implements EstimateSettings functionality
 */
export class EstimateSettings {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.autoMail = false;
        this.autoChangeStatusOnExp = false;
        this.estimateRoundOff = false;
    }
    headerName: string;
    nextStepToEstimate: string;
    autoChangeStatusOnExp: boolean;
    sendSms?: any;
    duePeriod: number;
    autoMail: boolean;
    enableEstimate: boolean;
    autoWhatsApp: boolean;
    estimateRoundOff: boolean;
}

/**
 * ProformaSettings class
 * Implements ProformaSettings functionality
 */
export class ProformaSettings {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.autoMail = false;
        this.autoChangeStatusOnExp = false;
        this.proformaRoundOff = false;
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
    autoWhatsApp: boolean;
    proformaRoundOff?: boolean;
}

/**
 * InvoiceSettings class
 * Implements InvoiceSettings functionality
 */
export class InvoiceSettings {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
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
        this.generateAutoEWayBill = false;
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
    generateAutoEWayBill?: boolean;
    generateEinvoiceShowPopUp: boolean;
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
