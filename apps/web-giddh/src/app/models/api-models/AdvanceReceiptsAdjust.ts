/**
 * VoucherAdjustments class
 * Implements VoucherAdjustments functionality
 */
export class VoucherAdjustments {
    tdsTaxUniqueName?: string;
    tdsAmount?: TdsAmount;
    description?: string;
    adjustments: Adjustment[] = [new Adjustment()];
    totalAdjustmentAmount?: number;
    totalAdjustmentCompanyAmount?: number;
}

/** Due amount class used in voucher adjustment */
/**
 * DueAmount class
 * Implements DueAmount functionality
 */
export class DueAmount {
    amountForAccount: number;
    amountForCompany: number;
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.amountForAccount = 0;
        this.amountForCompany = 0;
    }
}

/**
 * Adjustment class
 * Implements Adjustment functionality
 */
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

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
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

/**
 * TdsAmount interface definition
 * Defines the structure and contract for TdsAmount objects
 */
export interface TdsAmount {
    amountForAccount?: number;
}

/**
 * AdjustAdvancePaymentModal class
 * Implements AdjustAdvancePaymentModal functionality
 */
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

/**
 * AdvanceReceiptRequest class
 * Implements AdvanceReceiptRequest functionality
 */
export class AdvanceReceiptRequest {
    invoiceDate: string;
    accountUniqueName: string;
}
