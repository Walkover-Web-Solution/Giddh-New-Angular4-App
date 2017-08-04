import { Configuration } from '../../app.constant';
const UNIVERSAL_URI_LEDGER = Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/';

export const LEDGER_API = {
  // ledger methods get,create,delete,update
  GET: UNIVERSAL_URI_LEDGER + 'transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to',
  CREATE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/',
  UNIVERSAL: UNIVERSAL_URI_LEDGER + ':entryUniqueName',
  // ledger utility related mail,share
  MAIL_LEDGER: UNIVERSAL_URI_LEDGER + 'mail', // post call
  // get call
  RECONCILE: UNIVERSAL_URI_LEDGER + 'reconcile?from=:from&to=:to&chequeNumber=:chequeNumber',
  DOWNLOAD_INVOICE: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/:accountUniqueName/invoices/download', // post call
};
