

export class PettyCashReportResponse {
  page: number;
  count: number;
  totalPages: number;
  totalItems: number;
  results: ExpenseResults[];
  size: number;
  fromDate: string;
  toDate: string;
  openingBalance: OpeningBalance;
  closingBalance: OpeningBalance;
  debitTotal: number;
  creditTotal: number;
}

export class OpeningBalance {
  amount: number;
  type: string;
}

export class ExpenseResults {
  entryDate: string;
  uniqueName: string;
  createdBy: CreatedBy;
  currencySymbol: string;
  amount: number;
  baseAccount: CreatedBy;
  particularAccount: CreatedBy;
  fileNames?: any;
  description: string;
  status: string;
  statusMessage?: any;
}

export class CreatedBy {
  name: string;
  uniqueName: string;
}
export class ActionPettycashRequest {
  actionType: string;
  uniqueName: string;
}

export class ExpenseActionRequest {
  ledgerRequest?: LedgerRequest;
  message?: string;
}

export class LedgerRequest {
  transactions: Transaction[];
  entryDate: string;
  attachedFile: string;
  attachedFileName: string;
  description: string;
  generateInvoice: boolean;
  chequeNumber: string;
}

export class Transaction {
  amount: number;
  particular: string;
  type: string;
  taxes: any[];
  applyApplicableTaxes: boolean;
  isInclusiveTax: boolean;
  convertedAmount?: any;
}
