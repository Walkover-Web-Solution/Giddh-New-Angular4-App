import { Configuration } from '../../app.constant';

export const LEDGER_API = {
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers', // post call
  MAIL_LEDGER: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/mail', // post call
  DOWNLOAD_INVOICE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/invoices/download', // post call
  TRANSACTIONS: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/transactions?count=:count&fromDate=:fromDate&page=:page&q=:q&reversePage=:reversePage&sort=:sort&toDate=:toDate', // get call
  RECONCILE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/reconcile', // get call
};