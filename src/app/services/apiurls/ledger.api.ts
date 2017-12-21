
const UNIVERSAL_URI_LEDGER = 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/';

export const LEDGER_API = {
  // ledger methods get,create,delete,update
  GET: UNIVERSAL_URI_LEDGER + 'transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to',
  CREATE: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/',
  UNIVERSAL: UNIVERSAL_URI_LEDGER + ':entryUniqueName',
  // ledger utility related mail,share
  MAIL_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/mail-ledger?from=:from&to=:to&format=:format', // post call
  // get call
  RECONCILE: UNIVERSAL_URI_LEDGER + 'reconcile?from=:from&to=:to&chequeNumber=:chequeNumber',
  DOWNLOAD_INVOICE: 'v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/download', // post call
  DOWNLOAD_ATTACHMENT: 'company/:companyUniqueName/ledger/upload/:fileName', // post call
  UPLOAD_FILE: 'company/:companyUniqueName/ledger/upload',
  MAGIC_LINK: 'company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to',
  EXPORT_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger?from=:from&to=:to&type=:type',
  GET_BANK_TRANSACTIONS: 'company/:companyUniqueName/accounts/:accountUniqueName/eledgers?from=:from',
  // put call to map transaction
  MAP_BANK_TRANSACTIONS: 'company/:companyUniqueName/accounts/:accountUniqueName/eledgers/:transactionId',

  ADVANCE_SEARCH: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/merge?from=:fromDate&to=:toDate&sort=:sortingOrder&page=:page&count=:count',
};
