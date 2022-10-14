export class VoucherAdjustments {
    tdsTaxUniqueName: string;
    tdsAmount: TdsAmount;
    description: string;
    adjustments: Adjustment[] = [new Adjustment()];
    totalAdjustmentAmount?: number;
    totalAdjustmentCompanyAmount?: number;
}

/** Due amount class used in voucher adjustment */
export class DueAmount {
    amountForAccount: number;
    amountForCompany: number;
    constructor() {
        this.amountForAccount = 0;
        this.amountForCompany = 0;
    }
}

export class Adjustment {
    voucherNumber: string;
    balanceDue: DueAmount;
    voucherDate: string;
    taxRate: number;
    uniqueName: string;
    taxUniqueName: string;
    accountCurrency?: { symbol: string, code: string };
    calculatedTaxAmount?: number;
    exchangeRate?: number;
    adjustmentAmount?: DueAmount;
    voucherType?: string;
    subVoucher?: string;
    linkingAdjustment?: boolean;
    amount?: DueAmount;
    unadjustedAmount?: DueAmount;
    currency?: { symbol: string; code: string; };
    voucherBalanceType?: string;

    constructor() {
        this.voucherNumber = '';
        this.voucherDate = '';
        this.taxRate = 0;
        this.uniqueName = '';
        this.taxUniqueName = '';
        // tslint:disable-next-line: no-use-before-declare
        this.balanceDue = new DueAmount();
        this.adjustmentAmount = new DueAmount();
        this.calculatedTaxAmount = 0;
        this.voucherBalanceType = '';
    }
}

export interface TdsAmount {
    amountForAccount?: number;
}

export class AdjustAdvancePaymentModal {
    customerName: string;
    customerUniquename: string;
    voucherDate: string;
    balanceDue: number;
    dueDate: string;
    grandTotal: number;
    gstTaxesTotal: number;
    subTotal: number;
    totalTaxableValue: number;
    totalAdjustedAmount: number;
    convertedTotalAdjustedAmount: number;
    currencySymbol?: string;
    tcsTotal?: number = 0;
    tdsTotal?: number = 0;
}

export class AdvanceReceiptRequest {
    invoiceDate: string;
    accountUniqueName: string;
}
