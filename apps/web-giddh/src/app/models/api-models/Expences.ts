

export interface PettyCashReportResponse {
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

export interface OpeningBalance {
  amount: number;
  type: string;
}

export interface ExpenseResults {
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

export interface CreatedBy {
  name: string;
  uniqueName: string;
}
export interface ActionPettycashRequest {
  actionType: string;
  uniqueName: string;
}
