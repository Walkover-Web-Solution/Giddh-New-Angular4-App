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
