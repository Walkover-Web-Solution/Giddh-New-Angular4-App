const UNIVERSAL_URI_LEDGER = 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/';

export const LEDGER_API = {
  // ledger methods get,create,delete,update
  GET: UNIVERSAL_URI_LEDGER + 'transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to',
  CREATE: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/',
  RECONCILIATION: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile',
  UNIVERSAL: UNIVERSAL_URI_LEDGER + ':entryUniqueName',
  DELETE_LEDGER_ENTRY: 'company/:companyUniqueName/accounts/:accountUniqueName/entries/' + ':entryUniqueName',
  // ledger utility related mail,share
  MAIL_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/mail-ledger?from=:from&to=:to&format=:format', // post call
  // get call
  RECONCILE: UNIVERSAL_URI_LEDGER + 'reconcile?from=:from&to=:to&chequeNumber=:chequeNumber',
  // DOWNLOAD_INVOICE: 'v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/download', // post call
  DOWNLOAD_INVOICE: 'company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=base64', // post call
  DOWNLOAD_ATTACHMENT: 'company/:companyUniqueName/ledger/upload/:fileName', // post call
  UPLOAD_FILE: 'company/:companyUniqueName/ledger/upload',
  MAGIC_LINK: 'company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to',
  // EXPORT_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger?from=:from&to=:to&type=:type',
  // EXPORT_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger/file?from=:from&to=:to&type=:type&format=:format&sort=:sort',
  EXPORT_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/v3/export-ledger/file?from=:from&to=:to&type=:type&format=:format&sort=:sort',
  EXPORT_LEDGER_WITH_INVOICE_NUMBER: 'company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger-with-invoice/file?from=:from&to=:to&type=:type&format=:format&sort=:sort',
  GET_BANK_TRANSACTIONS: 'company/:companyUniqueName/yodlee/accounts/:accountUniqueName/eledgers?refresh=true&from=:from',
  // put call to map transaction
  MAP_BANK_TRANSACTIONS: 'company/:companyUniqueName/accounts/:accountUniqueName/eledgers/:transactionId',

  GET_MAGIC_LINK_DATA: 'magic-link/:id', // Method: GET
  GET_MAGIC_LINK_DATA_WITH_DATE: 'magic-link/:id?from=:from&to=:to', // Method: GET
  MAGIC_LINK_DOWNLOAD_FILE: 'magic-link/:id/download-invoice/:invoiceNum', // Method: GET
  ADVANCE_SEARCH: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/merge?sort=asc', // from=:fromDate&to=:toDate&sort=asc&page=:page&count=:count&q=:q
  // GET_GROUP_EXPORT_LEDGER: 'company/:companyUniqueName/groups/:groupUniqueName/export-ledger/mail?from=:from&to=:to&type=:type&format=:format',
  GET_GROUP_EXPORT_LEDGER: 'company/:companyUniqueName/groups/:groupUniqueName/export-ledger/mail-v2?from=:from&to=:to&type=:type&format=:format',
  // MULTIPLE_DELETE: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2',
  MULTIPLE_DELETE: 'company/:companyUniqueName/accounts/:accountUniqueName/entries',
  CURRENCY_CONVERTER: 'company/:companyUniqueName/currency-converter/:fromCurrency/:toCurrency',
  DELETE_BANK_TRANSACTION: 'company/:companyUniqueName/yodlee/eledgers?transactionId=:transactionId'
};
