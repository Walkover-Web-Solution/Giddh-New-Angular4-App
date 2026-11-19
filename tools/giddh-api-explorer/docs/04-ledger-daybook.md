# Ledger & Daybook

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **61**

---

### `ADVANCE_RECEIPTS_API.GET_ALL_ADVANCE_RECEIPTS`

- **Method:** `GET`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/advance-receipt/all?invoiceDate=:invoiceDate`
- **Source:** `advance-receipt-adjustment.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/advance-receipt/all?invoiceDate=SAMPLE_invoiceDate&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ADVANCE_RECEIPTS_API.INVOICE_ADJUSTMENT_WITH_ADVANCE_RECEIPT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/advance-receipt/adjust?invoiceUniqueName=:invoiceUniqueName`
- **Source:** `advance-receipt-adjustment.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/advance-receipt/adjust?invoiceUniqueName=SAMPLE_invoiceUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ADVANCE_RECEIPTS_API.VOUCHER_ADJUSTMENT_WITH_ADVANCE_RECEIPT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/:voucherUniqueName/adjust`
- **Source:** `advance-receipt-adjustment.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/SAMPLE_VOUCHER/adjust?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `AGINGREPORT_API.EXPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/exports`
- **Source:** `aging-reporting.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/exports?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `BANK_RECONCILIATION_API.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/imports/reconciliation`
- **Source:** `bank-reconciliation.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `BANK_RECONCILIATION_API.PROCESS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/imports/reconciliation/process?accountUniqueName=:accountUniqueName`
- **Source:** `bank-reconciliation.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation/process?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `BANK_RECONCILIATION_API.UPLOAD`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/reconciliation/upload`
- **Source:** `bank-reconciliation.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation/upload?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CURRENT_DATE_API`

- **Method:** `GET`
- **Path template:** `time`
- **Source:** `accounting.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/time?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DAYBOOK_SEARCH_API.ENTRIES_EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/exports?output=:output`
- **Source:** `daybook.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/exports?output=SAMPLE_output&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `DAYBOOK_SEARCH_API.EXPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/export-settings/daybook-v2?page=:page&count=:count&from=:from&to=:to&format=:format&type=:type&sort=:sort`
- **Source:** `daybook.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-settings/daybook-v2?page=1&count=50&from=01-04-2025&to=31-03-2026&format=csv&type=all&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DAYBOOK_SEARCH_API.SEARCH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/daybook?page=:page&count=:count&from=:from&to=:to`
- **Source:** `daybook.api.ts` · service: `inventory.service.ts#searchInventory`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/daybook?page=1&count=50&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DUEAMOUNTREPORT_API_V2.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/due-amount-report?q=:q&page=:page&count=:count&sort=:sort&sortBy=:sortBy&rangeCol=:rangeCol&vendorCustomerType=:vendorCustomerType`
- **Source:** `aging-reporting.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/due-amount-report?q=&page=1&count=50&sort=&sortBy=&rangeCol=SAMPLE_rangeCol&vendorCustomerType=SAMPLE_vendorCustomerType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DUEDAYSRANGE_API_V2.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/due-days-range?vendorCustomerType=:vendorCustomerType`
- **Source:** `aging-reporting.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/due-days-range?vendorCustomerType=SAMPLE_vendorCustomerType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.ACCOUNT_SEARCH_PREDICTION`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/account-search-predicted?accountUniqueName=:accountUniqueName`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/account-search-predicted?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.ADVANCE_SEARCH`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers/merge?sort=asc`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#encodeURIComponent`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `encodeURIComponent`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ILedgerAdvanceSearchResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/merge?sort=asc&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.BULK_EXPORT_LEDGER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bulk-export?from=:from&to=:to`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/bulk-export?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.CREATE_BULK`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/bulk-ledgers-v2`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/bulk-ledgers-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.CURRENCY_CONVERTER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/currency-converter/:fromCurrency/:toCurrency`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#GetCurrencyRate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/currency-converter/INR/USD?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.DELETE_BANK_TRANSACTION`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/yodlee/eledgers?transactionId=:transactionId`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#DeleteBankTransaction`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/eledgers?transactionId=SAMPLE_transactionId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.DELETE_BANK_TRANSACTIONS`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/bank/accounts/:accountUniqueName/transactions`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/accounts/SAMPLE_ACCOUNT/transactions?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.DELETE_LEDGER_ENTRY`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/entries/:entryUniqueName`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/entries/SAMPLE_entryUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.DOWNLOAD_ATTACHMENT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ledger/upload/:fileName`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload/SAMPLE_fileName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.DOWNLOAD_INVOICE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=base64`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download-file?fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.EXPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/exports`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/exports?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.EXPORT_BILL_TO_BILL`

- **Method:** `GET`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bill-to-bill/export-v2?from=:from&to=:to`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/bill-to-bill/export-v2?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.EXPORT_LEDGER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/v3/export-ledger/file?from=:from&to=:to&type=:type&format=:format&sort=:sort`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/v3/export-ledger/file?from=01-04-2025&to=31-03-2026&type=all&format=csv&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.EXPORT_LEDGER_COLUMNAR_REPORT_TABLE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/columnar-report?from=:from&to=:to`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/columnar-report?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.EXPORT_LEDGER_WITH_INVOICE_NUMBER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger-with-invoice/file?from=:from&to=:to&type=:type&format=:format&sort=:sort`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/v2/export-ledger-with-invoice/file?from=01-04-2025&to=31-03-2026&type=all&format=csv&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers/transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/transactions?count=50&from=01-04-2025&page=1&q=&reversePage=SAMPLE_reversePage&sort=&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_BALANCE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/balance?q=:q&from=:from&to=:to&accountCurrency=:accountCurrency`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/balance?q=&from=01-04-2025&to=31-03-2026&accountCurrency=SAMPLE_accountCurrency&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_BANK_TRANSACTIONS`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/yodlee/accounts/:accountUniqueName/eledgers?refresh=true&from=:from&page=:page&count=:count`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/accounts/SAMPLE_ACCOUNT/eledgers?refresh=true&from=01-04-2025&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.GET_COLUMNAR_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/export/account-balances-v2`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/export/account-balances-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_CURRENCY_RATE`

- **Method:** `GET`
- **Path template:** `currency/rate?from=:from&to=:to&date=:date`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#GetCurrencyRateNewApi`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/currency/rate?from=01-04-2025&to=31-03-2026&date=SAMPLE_date&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_DOWNLOAD_ATTACHMENT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/imports/signed-url?fileName=:fileName`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#getSignedUrl`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/signed-url?fileName=SAMPLE_fileName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_GROUP_EXPORT_LEDGER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName/export-ledger/mail-v2?from=:from&to=:to&type=:type&format=:format`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/export-ledger/mail-v2?from=01-04-2025&to=31-03-2026&type=all&format=csv&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_MAGIC_LINK_DATA`

- **Method:** `GET`
- **Path template:** `magic-link/:id`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/magic-link/SAMPLE_id?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_MAGIC_LINK_DATA_WITH_DATE`

- **Method:** `GET`
- **Path template:** `magic-link/:id?from=:from&to=:to`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/magic-link/SAMPLE_id?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_STOCK_VARIANTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/variants`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/variants?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_TRANSACTION`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName?baseRef=true`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/SAMPLE_entryUniqueName?baseRef=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_UNPAID_INVOICE_LIST`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/invoices/list?accountUniqueName=:accountUniqueName&status=:accStatus`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#GetInvoiceList`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IUnpaidInvoiceListResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/invoices/list?accountUniqueName=SAMPLE_ACCOUNT&status=SAMPLE_accStatus&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.GET_VOUCHER_INVOICE_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&count=:count&page=:page&number=:number`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/invoice-list?voucherDate=01-04-2025&count=50&page=1&number=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.IMPORT_STATEMENT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/import-pdf/bank-statement?entity=pdf&accountUniqueName=:accountUniqueName`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/import-pdf/bank-statement?entity=pdf&accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.IMPORT_VOUCHER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/v2/upload?subType=:subType&accountUniqueName=:accountUniqueName&type=:type&isHeaderProvided=:isHeaderProvided&voucherType=:voucherType`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#importVoucher`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `data` (see service `importVoucher`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/v2/upload?subType=SAMPLE_subType&accountUniqueName=SAMPLE_ACCOUNT&type=all&isHeaderProvided=SAMPLE_isHeaderProvided&voucherType=sales&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.MAGIC_LINK`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/magic-link?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.MAGIC_LINK_DOWNLOAD_FILE`

- **Method:** `GET`
- **Path template:** `magic-link/:id/download-invoice/:invoiceNum`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/magic-link/SAMPLE_id/download-invoice/SAMPLE_invoiceNum?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.MAIL_LEDGER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/mail-ledger?`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#encodeURIComponent`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `encodeURIComponent`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/mail-ledger?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.MAP_BANK_TRANSACTIONS`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/eledgers/:transactionId`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#MapBankTransactions`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `MapBankTransactions`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/eledgers/SAMPLE_transactionId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.MULTIPLE_DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/entries`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/entries?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.NEW_GET_LEDGER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/giddh-ledger?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to&accountCurrency=:accountCurrency`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/giddh-ledger?count=50&from=01-04-2025&page=1&q=&reversePage=SAMPLE_reversePage&sort=&to=31-03-2026&accountCurrency=SAMPLE_accountCurrency&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.RECONCILE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile?from=:from&to=:to&chequeNumber=:chequeNumber`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/reconcile?from=01-04-2025&to=31-03-2026&chequeNumber=SAMPLE_chequeNumber&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.RECONCILIATION`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile`
- **Source:** `ledger.api.ts` · service: `ledger.service.ts#GetReconciliation`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GetReconciliation`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/reconcile?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LEDGER_API.RUN_AUTOPAID`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/autopaid`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/autopaid?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.UNIVERSAL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/SAMPLE_entryUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LEDGER_API.UPLOAD_FILE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ledger/upload`
- **Source:** `ledger.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `VOUCHERS.CONTRA`

- **Method:** `GET`
- **Path template:** `contra`
- **Source:** `accounting.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/contra?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VOUCHERS.JOURNAL`

- **Method:** `GET`
- **Path template:** `journal`
- **Source:** `accounting.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/journal?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VOUCHERS.PAYMENT`

- **Method:** `POST`
- **Path template:** `payment`
- **Source:** `accounting.constant.ts` · service: `settings.integration.service.ts#SavePaymentKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SavePaymentKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/payment?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `VOUCHERS.PURCHASE`

- **Method:** `GET`
- **Path template:** `purchase`
- **Source:** `accounting.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/purchase?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VOUCHERS.RECEIPT`

- **Method:** `GET`
- **Path template:** `receipt`
- **Source:** `accounting.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/receipt?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VOUCHERS.SALES`

- **Method:** `GET`
- **Path template:** `sales`
- **Source:** `accounting.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/sales?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

