import { IPeriodBalances } from '../interfaces/dashboard.interface';

/**
 * Model for Audit Dashboard api request
 * API:: (Dashboard) company/:companyUniqueName/dashboard?fromDate=:fromDate&toDate=:toDate&interval=:interval&refresh=refresh
  * In Request Payload 
 * A.   "fromDate" and "toDate" params will be sent 
 * interval values can be time unit we are seding monthly for now
 * NOTE:: we are sending an extra header called 'X-Forwarded-For': res.locales.remoteIp
 * NOTE:: its response will be a hash containing a key logs
 */
export class DashboardResponse {
  networth: IPeriodBalances[];
  profitLoss: IPeriodBalances[];
}