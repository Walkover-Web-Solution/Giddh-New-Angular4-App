export class AdvanceReceiptAdjustment {
    tdsTaxUniqueName: string;
    tdsAmount: TdsAmount;
    description: string;
    adjustments: Adjustment[];
}

export interface Adjustment {
    voucherNumber: string;
    dueAmount: DueAmount;
    voucherDate: string;
    taxRate: number;
    uniqueName: string;
    taxUniqueName: string;
}

export interface DueAmount {
    amountForAccount: number;
    amountForCompany: number;
}

export interface TdsAmount {
    amountForAccount?: any;
}



export class AdjustAdvancePaymentModal {
    customerName: string;
    customerUniquename: string;
    voucherDate: string;
    balanceDue: any;
    dueDate: string;
    grandTotal: any = 0;
    gstTaxesTotal: number;
    subTotal: number;
    totalTaxableValue: number;
}

export class AdvanceReceiptRequest {
    invoiceDate: string;
    accountUniqueName: string;
}
