/**
 * Created by ad on 07-07-2017.
 */

export interface ForwardedBalance {
  amount: number;
  type: string;
}

export interface ClosingBalance {
  amount: number;
  type: string;
}

export interface OpeningBalance {
  amount: number;
  type: string;
}

export interface Account {
  creditTotal: number;
  debitTotal: number;
  closingBalance: ClosingBalance;
  openingBalance: OpeningBalance;
  uniqueName: string;
  name: string;
}

export interface AccountFlat {
  creditTotal: number | string;
  debitTotal: number | string;
  closeBalType: string;
  openBalType: string;
  closingBalance: number | string;
  openingBalance: number | string;
  uniqueName: string;
  name: string;
  parent: string;
}

export interface ChildGroup {
  forwardedBalance: ForwardedBalance;
  creditTotal: number;
  debitTotal: number;
  closingBalance: ClosingBalance;
  childGroups: any[];
  accounts: Account[];
  uniqueName: string;
  category?: any;
  groupName: string;
}

export interface SearchResponse {
  forwardedBalance: ForwardedBalance;
  creditTotal: number;
  debitTotal: number;
  closingBalance: ClosingBalance;
  childGroups: ChildGroup[];
  accounts: any[];
  uniqueName: string;
  category: string;
  groupName: string;
}

export interface SearchRequest {
  groupName: string;
  fromDate: string;
  toDate: string;
  refresh: boolean;
}

export class SearchDataSet {
  public queryType: string = null;
  public balType: string = 'CREDIT';
  public queryDiffer: string = null;
  public amount: string = null;
}

export interface BulkEmailRequest {
  params: BulkEmailRequestParams;
  data: BulkEmailRequestData;
}
export interface BulkEmailRequestData {
  message: string;
  accounts: string[];
}

export interface BulkEmailRequestParams {
  from: string;
  to: string;
}
