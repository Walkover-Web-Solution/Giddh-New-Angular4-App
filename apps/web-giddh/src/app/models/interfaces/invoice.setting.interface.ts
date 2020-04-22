import { RazorPayDetailsResponse } from '../api-models/SettingsIntegraion';

// export interface InvoiceSetting {
//   invoiceSettings: InvoiceISetting;
//   proformaSettings: InvoiceISetting;
//   webhooks: InvoiceWebhooks[];
//   razorPayform?: RazorPayDetailsResponse;
//   companyCashFreeSettings?: CashFreeSetting;
//   companyEmailSettings?: {
//     sendThroughGmail: boolean,
//     sendThroughSendgrid: boolean
//   };
// }

// export class InvoiceISetting {
//   public autoEntryAndInvoice: boolean;
//   public autoEntryVoucherAndEmail: boolean;
//   public autoMail: boolean;
//   public autoPaid: string;
//   public createPaymentEntry?: boolean;
//   public duePeriod?: number;
//   public email: string;
//   public emailVerified: boolean;
//   public showSeal: boolean;
//   public lockDate?: any;
//   public useCustomInvoiceNumber: boolean;
//   public invoiceNumberPrefix: string;
//   public initialInvoiceNumber: string;
//   public defaultPaymentGateway: string;
//   public enableNarrationOnInvAndVoucher: boolean;
//   public sendInvLinkOnSms: boolean;
//   public smsContent: string;
//   public sendThroughGmail: boolean;
// }
//

export interface InvoiceWebhooks {
	entity: string;
	operation?: string;
	triggerAt: number;
	uniqueName?: string;
	url: string;
}

//
export class EmailSettingObjDefinition {
	public isEmailTabSelected: boolean;
	public subject?: string = '';
	public form: string = 'abcd@walkover.in';
	public body?: string = `Here’s your invoice! We appreciate your prompt payment.
Thanks for your business!
Walkover Test11343`;
	public useGreeting?: boolean;
	public greeting?: string;
	public username?: string;
}

// export class CashFreeSetting {
//   public autoCreateVirtualAccountsForDebtors: boolean;
//   public noOfEntriesToEnableAutoCreateVirtualAccountForDebtors: boolean;
// }

export interface InvoiceSetting {
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
}
