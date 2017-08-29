import { RazorPayDetailsResponse } from "../api-models/SettingsIntegraion";

export interface InvoiceSetting {
    invoiceSettings: InvoiceISetting;
    proformaSettings: InvoiceISetting;
    webhooks: InvoiceWebhooks[];
    razorPayform?: RazorPayDetailsResponse;
}

export class InvoiceISetting {
    public autoEntryAndInvoice: boolean;
    public autoMail: boolean;
    public autoPaid: string;
    public createPaymentEntry?: boolean;
    public duePeriod?: string;
    public email: string;
    public emailVerified: boolean;
    public showSeal: boolean;
}
export interface InvoiceWebhooks {
    entity: string;
    operation?: string;
    triggerAt: number;
    uniqueName?: string;
    url: string; 
}