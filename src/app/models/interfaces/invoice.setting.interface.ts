export interface InvoiceSetting {
    invoiceSettings: InvoiceISetting;
    proformaSettings: InvoiceISetting;
    webhooks: InvoiceWebhooks[];
}

export interface InvoiceISetting {
    autoEntryAndInvoice: boolean;
    autoMail: boolean;
    autoPaid: string;
    createPaymentEntry?: boolean;
    duePeriod?: string;
    email: string;
    emailVerified: boolean;
    showSeal: boolean;
}
export interface InvoiceWebhooks {
    entity: string;
    operation?: string;
    triggerAt: number;
    uniqueName: string;
    url: string; 
}