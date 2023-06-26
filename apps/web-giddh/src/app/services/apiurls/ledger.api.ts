const UNIVERSAL_URI_LEDGER = 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/';

export const LEDGER_API = {
    // ledger methods get,create,delete,update
    GET: UNIVERSAL_URI_LEDGER + 'transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to',
    CREATE: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/',
    RECONCILIATION: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile',
    UNIVERSAL: UNIVERSAL_URI_LEDGER + ':entryUniqueName',
    // A New API Endpoint Added to Differenciate for Get Transactions
    GET_TRANSACTION: UNIVERSAL_URI_LEDGER + ':entryUniqueName?baseRef=true',
    DELETE_LEDGER_ENTRY: 'company/:companyUniqueName/accounts/:accountUniqueName/entries/' + ':entryUniqueName',
    // ledger utility related mail,share
    MAIL_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/mail-ledger?', // post call
    // get call
    RECONCILE: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile?from=:from&to=:to&chequeNumber=:chequeNumber',
    DOWNLOAD_INVOICE: 'company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=base64', // post call
    DOWNLOAD_ATTACHMENT: 'company/:companyUniqueName/ledger/upload/:fileName', // post call
    UPLOAD_FILE: 'company/:companyUniqueName/ledger/upload',
    MAGIC_LINK: 'company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to',
    EXPORT_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/v3/export-ledger/file?from=:from&to=:to&type=:type&format=:format&sort=:sort',
    EXPORT_LEDGER_WITH_INVOICE_NUMBER: 'company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger-with-invoice/file?from=:from&to=:to&type=:type&format=:format&sort=:sort',
    GET_BANK_TRANSACTIONS: 'company/:companyUniqueName/yodlee/accounts/:accountUniqueName/eledgers?refresh=true&from=:from&page=:page&count=:count',
    // put call to map transaction
    MAP_BANK_TRANSACTIONS: 'company/:companyUniqueName/accounts/:accountUniqueName/eledgers/:transactionId',
    GET_MAGIC_LINK_DATA: 'magic-link/:id', // Method: GET
    GET_MAGIC_LINK_DATA_WITH_DATE: 'magic-link/:id?from=:from&to=:to', // Method: GET
    MAGIC_LINK_DOWNLOAD_FILE: 'magic-link/:id/download-invoice/:invoiceNum', // Method: GET
    ADVANCE_SEARCH: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers/merge?sort=asc', // from=:fromDate&to=:toDate&sort=asc&page=:page&count=:count&q=:q
    GET_GROUP_EXPORT_LEDGER: 'company/:companyUniqueName/groups/:groupUniqueName/export-ledger/mail-v2?from=:from&to=:to&type=:type&format=:format',
    MULTIPLE_DELETE: 'company/:companyUniqueName/accounts/:accountUniqueName/entries',
    CURRENCY_CONVERTER: 'company/:companyUniqueName/currency-converter/:fromCurrency/:toCurrency',
    DELETE_BANK_TRANSACTION: 'company/:companyUniqueName/yodlee/eledgers?transactionId=:transactionId',
    NEW_GET_LEDGER: 'company/:companyUniqueName/accounts/:accountUniqueName/giddh-ledger?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to&accountCurrency=:accountCurrency',
    GET_BALANCE: 'v2/company/:companyUniqueName/accounts/:accountUniqueName/balance?from=:from&to=:to&accountCurrency=:accountCurrency',
    GET_CURRENCY_RATE: 'currency/rate?from=:from&to=:to&date=:date',

    GET_UNPAID_INVOICE_LIST: 'v2/company/:companyUniqueName/invoices/list?accountUniqueName=:accountUniqueName&status=:accStatus',
    GET_VOUCHER_INVOICE_LIST: 'company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&count=:count&page=:page&number=:number',
    GET_COLUMNAR_REPORT: 'v2/company/:companyUniqueName/groups/:groupUniqueName/export/account-balances',
    // Export Ledger get columnar report table
    EXPORT_LEDGER_COLUMNAR_REPORT_TABLE: 'company/:companyUniqueName/accounts/:accountUniqueName/columnar-report?from=:from&to=:to',
    IMPORT_STATEMENT: 'company/:companyUniqueName/import-pdf/bank-statement/?entity=pdf&accountUniqueName=:accountUniqueName',
    DELETE_BANK_TRANSACTIONS: 'company/:companyUniqueName/bank/accounts/:accountUniqueName/transactions',

    // Export Ledger Entry and Group Ledger entry
    EXPORT: 'company/:companyUniqueName/exports',

    //Export Bill to Bill Report
    EXPORT_BILL_TO_BILL: 'v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bill-to-bill/export?from=:from&to=:to',
    ACCOUNT_SEARCH_PREDICTION: 'company/:companyUniqueName/account-search-predicted?accountUniqueName=:accountUniqueName',

    // Run Auto-paid
    RUN_AUTOPAID: 'company/:companyUniqueName/accounts/:accountUniqueName/autopaid',

    // Load stock variant
    GET_STOCK_VARIANTS: 'company/:companyUniqueName/stock/:stockUniqueName/variants'
};
