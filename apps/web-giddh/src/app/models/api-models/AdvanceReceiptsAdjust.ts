export class AdvanceReceiptAdjustment {
  tdsTaxUniqueName: string;
  tdsAmount: TdsAmount;
  description: string;
  adjustments: Adjustment[];
}

interface Adjustment {
  voucherNumber: string;
  dueAmount: DueAmount;
  voucherDate: string;
  taxRate: number;
  uniqueName: string;
  taxUniqueName: string;
}

interface DueAmount {
  amountForAccount: number;
  amountForCompany: number;
}

interface TdsAmount {
  amountForAccount?: any;
}
