import { IUserInfo } from './userInfo.interface';
import { IReconcileTransaction } from './ledger.interface';

/**
 * interface for logs request
 */
export interface ILogRequest {
  fromDate?: string;
  toDate?: string;
  operation: string;
  userUniqueName: string;
  accountUniqueName: string;
  groupUniqueName: string;
  entryDate?: string;
  logDate?: string;
  entity: string;
}

/**
 * interface for logs response
 */
export interface ILogsItem {
  createdAt: string;
  accountName: string;
  accountUniqueName: string;
  groupUniqueName: string;
  user: IUserInfo;
  operationType: string;
  entityType: string;
  ledgerUniqueName: string;
  companyUniqueName:  string;
  companyName: string;
  log: ILogConcise;
  groupName: string;
}

export interface ILogConcise {
  uniqueName: string;
  description?: string;
  tag?: string;
  voucherType: string;
  voucherNo: number;
  entryDate: string;
  transactions: IReconcileTransaction[];
}