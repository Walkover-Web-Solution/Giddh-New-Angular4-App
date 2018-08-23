export interface DueRangeRequest {
  range: string[];
}


export interface DueAmountReportRequest {
  totalDueAmountGreaterThan: boolean;
  totalDueAmountLessThan: boolean;
  totalDueAmountEqualTo: boolean;
  totalDueAmount: number;
  includeName: boolean;
  name: string[];
}

export interface CurrentAndPastDueAmount {
  dueAmount: number;
  range: string;
}

export interface Result {
  name: string;
  totalDueAmount: number;
  futureDueAmount: number;
  currentAndPastDueAmount: CurrentAndPastDueAmount[];
}

export interface DueAmountReportResponse {
  page: number;
  count: number;
  totalPages: number;
  totalItems: number;
  results: Result[];
  size: number;
}

export interface AgingDropDownoptions { fourth: number; fifth: number;  sixth: number; }