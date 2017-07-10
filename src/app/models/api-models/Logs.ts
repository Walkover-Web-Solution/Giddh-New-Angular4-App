import { ILogRequest, ILogsItem } from '../interfaces/logs.interface';
/**
 * Model for Audit Logs api request
 * API:: (Audit Logs) company/:companyUniqueName/logs?page=:page
 * Audit Logs API details
 * In Request Payload, either
 * A.   "fromDate" and "toDate" params will be sent    OR
 * B.   "logDate"   OR
 * C.   "entryDate"
 * NOTE:: entity options value can be  [ group, company, account, ledger, voucher, logs, invoice, proforma, company_settings ]
 * NOTE:: its response will be a hash containing a key logs
 */

export class LogsRequest implements ILogRequest {
  public fromDate?: string;
  public toDate?: string;
  public operation: string;
  public userUniqueName: string;
  public accountUniqueName: string;
  public groupUniqueName: string;
  public entryDate?: string;
  public logDate?: string;
  public entity: string;
}

/**
 * Model for Audit Logs api response
 * API:: (Audit Logs) company/:companyUniqueName/logs?page=:page
 */
export class LogsResponse {
  public logs: ILogsItem[];
  public totalPages: number;
  public size: number;
  public totalElements: number;
}
