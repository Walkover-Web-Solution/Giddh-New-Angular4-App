import { RazorPayDetailsResponse } from '../api-models/SettingsIntegraion';

export interface InvoiceSetting {
    invoiceSettings: InvoiceISetting;
    proformaSettings: InvoiceISetting;
    webhooks: InvoiceWebhooks[];
    razorPayform?: RazorPayDetailsResponse;
  companyCashFreeSettings?: CashFreeSetting;
}

export class InvoiceISetting {
    public autoEntryAndInvoice: boolean;
    public autoMail: boolean;
    public autoPaid: string;
    public createPaymentEntry?: boolean;
    public duePeriod?: number;
    public email: string;
    public emailVerified: boolean;
    public showSeal: boolean;
    public lockDate?: any;
    public useCustomInvoiceNumber: boolean;
    public invoiceNumberPrefix: string;
    public initialInvoiceNumber: string;
  public defaultPaymentGateway: string;
}
export interface InvoiceWebhooks {
    entity: string;
    operation?: string;
    triggerAt: number;
    uniqueName?: string;
    url: string;
}

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

export class CashFreeSetting {
  public autoCreateVirtualAccountsForDebtors: boolean;
  public noOfEntriesToEnableAutoCreateVirtualAccountForDebtors: boolean;
}
