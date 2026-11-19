# GST / VAT / Tax compliance

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **50**

---

### `GST_RECONCILE_API.GENERATE_OTP`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstr-reconcile/auth?userName=:userName`
- **Source:** `gst-reconcile.api.ts` · service: `gst-reconcile.service.ts#GstReconcileGenerateOtp`
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
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstr-reconcile/auth?userName=SAMPLE_userName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GST_RECONCILE_API.GET_INVOICES`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/gstr-reconcile/invoices?page=:page&count=:count&action=:action&refresh=:refresh&from=:from&to=:to&gstReturnType=:gstReturnType`
- **Source:** `gst-reconcile.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr-reconcile/invoices?page=1&count=50&action=SAMPLE_action&refresh=true&from=01-04-2025&to=31-03-2026&gstReturnType=SAMPLE_gstReturnType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GST_RECONCILE_API.VERIFY_OTP`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/gstr-reconcile/verify-otp`
- **Source:** `gst-reconcile.api.ts` · service: `gst-reconcile.service.ts#GstReconcileVerifyOtp`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GstReconcileVerifyOtp`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstr-reconcile/verify-otp?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GST_RETURN_API.FILE_GSTR3B`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/save-gstr3b?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp&monthYear=:monthYear&currentDateTime=:currentDateTime`
- **Source:** `purchase-invoice.api.ts` · service: `purchase-invoice.service.ts#FileGstr3B`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/save-gstr3b?gstin=SAMPLE_company_gstin&from=01-04-2025&to=31-03-2026&gsp=SAMPLE_gsp&monthYear=SAMPLE_monthYear&currentDateTime=SAMPLE_currentDateTime&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GST_RETURN_API.FILE_JIO_GST_RETURN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/post-data-to-jiogst?from=:from&to=:to&gstin=:company_gstin`
- **Source:** `purchase-invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/post-data-to-jiogst?from=01-04-2025&to=31-03-2026&gstin=SAMPLE_company_gstin&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GST_RETURN_API.FILE_TAX_PRO_RETURN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/taxpro/post-data-to-taxpro?gstin=:company_gstin&from=:from&to=:to`
- **Source:** `purchase-invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/taxpro/post-data-to-taxpro?gstin=SAMPLE_company_gstin&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GST_RETURN_API.FILE_VAYANA_RETURN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/vayana/post-data-to-vayana?gstin=:company_gstin&from=:from&to=:to`
- **Source:** `purchase-invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/vayana/post-data-to-vayana?gstin=SAMPLE_company_gstin&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GST_RETURN_API.GET_GSP_SESSION`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/session?gstin=:company_gstin`
- **Source:** `purchase-invoice.api.ts` · service: `gst-reconcile.service.ts#GetGSPSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GetGspSessionResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/session?gstin=SAMPLE_company_gstin&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GST_RETURN_API.GET_TAX_DETAILS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/tax-numbers`
- **Source:** `purchase-invoice.api.ts` · service: `gst-reconcile.service.ts#getTaxDetails`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax-numbers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.CREATE_LUT_NUMBER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/gst-setting`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#createLutNumber`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createLutNumber`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GSTR_API.DELETE_LUT_NUMBER`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/gst-setting/:lutNumberUniqueName`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting/SAMPLE_lutNumberUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.DOWNLOAD_JSON`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/gstr1/download-v2?gstin=:gstIn&from=:from&to=:to&type=:type`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr1/download-v2?gstin=SAMPLE_gstIn&from=01-04-2025&to=31-03-2026&type=all&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.DOWNLOAD_SHEET`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/:gstType-export-v2?gstin=:gstin&from=:from&to=:to&type=:sheetType`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/SAMPLE_gstType-export-v2?gstin=SAMPLE_gstin&from=01-04-2025&to=31-03-2026&type=SAMPLE_sheetType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.FILE_GSTR1`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/save-gstr1?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp&currentDateTime=:currentDateTime`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#FileGstr1`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/save-gstr1?gstin=SAMPLE_company_gstin&from=01-04-2025&to=31-03-2026&gsp=SAMPLE_gsp&currentDateTime=SAMPLE_currentDateTime&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GSTR_API.GET_DOCUMENT_ISSUED`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/gstr1-transactions/documents-issued?gstin=:gstin&from=:from&to=:to`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/gstr1-transactions/documents-issued?gstin=SAMPLE_gstin&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_FILING_STATUS_REFERENCE_ID`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/gstr1-referenceIds?gstin=:gstIn&from=:from&to=:to&page=:page&count=:count&gsp=:gsp`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr1-referenceIds?gstin=SAMPLE_gstIn&from=01-04-2025&to=31-03-2026&page=1&count=50&gsp=SAMPLE_gsp&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_FILING_STATUS_RESPONSE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/save-gstr1-status?referenceId=:referenceId`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/save-gstr1-status?referenceId=SAMPLE_referenceId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_LUT_NUMBER_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gst-setting/list`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting/list?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_OVERVIEW`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/:gstType-summary?gstin=:gstin&from=:from&to=:to`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#GetGstrOverview`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GstOverViewResult`
- `queryString (echoed by service)`
- `body as Gstr3bOverviewResult`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/SAMPLE_gstType-summary?gstin=SAMPLE_gstin&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_RETURN_SUMMARY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/:gstType-transactions/summary?page=:page&count=:count&gstin=:gstin&gstReturnType=:gstReturnType&from=:from&to=:to`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/SAMPLE_gstType-transactions/summary?page=1&count=50&gstin=SAMPLE_gstin&gstReturnType=SAMPLE_gstReturnType&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_TRANSACTIONS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/:gstType-transactions?gstin=:gstin&entityType=:entityType&type=:type&page=:page&count=:count&status=:status&from=:from&to=:to`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#GetSummaryTransaction`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GstTransactionResult`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/SAMPLE_gstType-transactions?gstin=SAMPLE_gstin&entityType=SAMPLE_entityType&type=all&page=1&count=50&status=SAMPLE_status&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GET_TRANSACTIONS_COUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/gstr-transaction-count?gstin=:gstin&from=:from&to=:to`
- **Source:** `gst-r.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/gstr-transaction-count?gstin=SAMPLE_gstin&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.GSTR1_SUMMARY_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/gstr1?gstin=:gstin&from=:from&to=:to`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#GetGstr1SummaryDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as Gstr1SummaryResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr1?gstin=SAMPLE_gstin&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GSTR_API.SAVE_GSP_SESSION`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#SaveGSPSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gsp-session?gstin=SAMPLE_company_gstin&userName=SAMPLE_USERNAME&gsp=SAMPLE_GSP&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GSTR_API.SAVE_GSP_SESSION_WITH_OTP`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/authenticate-gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP&otp=:OTP`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#SaveGSPSessionWithOTP`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/authenticate-gsp-session?gstin=SAMPLE_company_gstin&userName=SAMPLE_USERNAME&gsp=SAMPLE_GSP&otp=SAMPLE_OTP&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GSTR_API.UPDATE_LUT_NUMBER`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/gst-setting/:lutNumberUniqueName`
- **Source:** `gst-r.api.ts` · service: `gst-reconcile.service.ts#updateLutNumber`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateLutNumber`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting/SAMPLE_lutNumberUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_INVOICE_API.DOWNLOAD_GSTR2_ERROR_SHEET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/gstr2-error-export?monthYear=:month&gstin=:company_gstin`
- **Source:** `purchase-invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/gstr2-error-export?monthYear=SAMPLE_month&gstin=SAMPLE_company_gstin&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_INVOICE_API.DOWNLOAD_GSTR2_EXCEL_SHEET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/gstr2-excel-export?monthYear=:month&gstin=:company_gstin`
- **Source:** `purchase-invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/gstr2-excel-export?monthYear=SAMPLE_month&gstin=SAMPLE_company_gstin&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_INVOICE_API.DOWNLOAD_GSTR2_SHEET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gstreturn/gstr2_data/file?monthYear=:month&gstin=:company_gstin`
- **Source:** `purchase-invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gstreturn/gstr2_data/file?monthYear=SAMPLE_month&gstin=SAMPLE_company_gstin&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_INVOICE_API.SEND_GSTR3B_EMAIL`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/gstr3b-excel-export/email?monthYear=:month&gstin=:company_gstin&detailedSheet=:isNeedDetailSheet&email=:userEmail`
- **Source:** `purchase-invoice.api.ts` · service: `purchase-invoice.service.ts#SendGSTR3BEmail`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr3b-excel-export/email?monthYear=SAMPLE_month&gstin=SAMPLE_company_gstin&detailedSheet=SAMPLE_isNeedDetailSheet&email=user%40example.com&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `REVERSECHARGE_API.VIEW_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/reverse-charge-report?from=:from&to=:to&sort=:sort&sortBy=:sortBy&page=:page&count=:count`
- **Source:** `reversecharge.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reverse-charge-report?from=01-04-2025&to=31-03-2026&sort=&sortBy=&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.CHECK_HMRC_AUTHORIZATION`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/authorize`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/authorize?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.DOWNLOAD_KENYA_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/kenya/v2/vat-report-download?from=:from&to=:to&taxNumber=:taxNumber&fileType=base64`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/kenya/v2/vat-report-download?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.DOWNLOAD_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/vat-report-download-v2?from=:from&to=:to&taxNumber=:taxNumber&fileType=base64`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/vat-report-download-v2?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.DOWNLOAD_ZW_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/zw/vat-report-download-v2?from=:from&to=:to&taxNumber=:taxNumber&currencyCode=:currencyCode&fileType=base64`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report-download-v2?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&currencyCode=SAMPLE_currencyCode&fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.DOWNLOAD_ZW_TRANSACTIONS_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/zw/vat-report-detailed-download-v2?from=:from&to=:to&taxNumber=:taxNumber&section=:section&currencyCode=:currencyCode&page=:page&count=:count`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report-detailed-download-v2?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&section=SAMPLE_section&currencyCode=SAMPLE_currencyCode&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.INITIATE_PAYMENT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/payment/initiate`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/payment/initiate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.LIABILITIES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/retrieve-vat-liabilities?taxNumber=:taxNumber&from=:from&to=:to&branchUniqueName=:branchUniqueName`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/retrieve-vat-liabilities?taxNumber=SAMPLE_taxNumber&from=01-04-2025&to=31-03-2026&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.PAYMENTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/retrieve-vat-payments?taxNumber=:taxNumber&from=:from&to=:to&branchUniqueName=:branchUniqueName`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/retrieve-vat-payments?taxNumber=SAMPLE_taxNumber&from=01-04-2025&to=31-03-2026&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.SAVE_AUTHORIZATION_CODE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/save-authorization-code`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/save-authorization-code?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.SUBMIT_VAT_RETURN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/submit-vat-return?taxNumber=:taxNumber&periodKey=:periodKey&from=:from&to=:to&branchUniqueName=:branchUniqueName`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/submit-vat-return?taxNumber=SAMPLE_taxNumber&periodKey=SAMPLE_periodKey&from=01-04-2025&to=31-03-2026&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VAT_OBLIGATIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/vat-obligations?branchUniqueName=:branchUniqueName&taxNumber=:taxNumber&status=:status&from=:from&to=:to`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/vat-obligations?branchUniqueName=SAMPLE_branchUniqueName&taxNumber=SAMPLE_taxNumber&status=SAMPLE_status&from=01-04-2025&to=31-03-2026' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_KENYA_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/kenya/vat-report?from=:from&to=:to&taxNumber=:taxNumber`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/kenya/vat-report?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/vat-report?from=:from&to=:to&taxNumber=:taxNumber`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/vat-report?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_REPORT_V2`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/vat-report?from=:from&to=:to&taxNumber=:taxNumber`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/vat-report?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_TRANSACTIONS_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&page=:page&count=:count`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/vat-report-detailed?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&section=SAMPLE_section&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_UK_TRANSACTIONS_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&page=:page&count=:count`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/vat-report-detailed?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&section=SAMPLE_section&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_VAT_RETURN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/uk/view-vat-return?taxNumber=:taxNumber&periodKey=:periodKey&from=:from&to=:to`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/view-vat-return?taxNumber=SAMPLE_taxNumber&periodKey=SAMPLE_periodKey&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_ZW_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/zw/vat-report?from=:from&to=:to&taxNumber=:taxNumber&currencyCode=:currencyCode`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&currencyCode=SAMPLE_currencyCode&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `VAT_API.VIEW_ZW_TRANSACTIONS_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/zw/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&currencyCode=:currencyCode&page=:page&count=:count`
- **Source:** `vat.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report-detailed?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&section=SAMPLE_section&currencyCode=SAMPLE_currencyCode&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

