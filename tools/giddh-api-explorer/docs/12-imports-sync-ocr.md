# Imports / Sync / OCR

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **15**

---

### `AI_OCR_API.COMPLETED_COUNT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/completed-document-count?voucherVersion=2&branchUniqueName=:branchUniqueName&ocrType=:ocrType`
- **Source:** `ai-ocr.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/completed-document-count?voucherVersion=2&branchUniqueName=SAMPLE_branchUniqueName&ocrType=SAMPLE_ocrType' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `AI_OCR_API.EXTRACT_DOCUMENTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/ocr-data?currentToken=:currentToken&nextToken=:nextToken&voucherVersion=2&voucherType=:voucherType&requestId=:requestId&ocrType=:ocrType`
- **Source:** `ai-ocr.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ocr-data?currentToken=SAMPLE_currentToken&nextToken=SAMPLE_nextToken&voucherVersion=2&voucherType=sales&requestId=SAMPLE_requestId&ocrType=SAMPLE_ocrType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `AI_OCR_API.GET_ALL_DOCUMENTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/imports/all-document?branchUniqueName=:branchUniqueName&page=:page&count=:count&from=:from&to=:to&sort=:sort&sortBy=:sortBy&ocrType=:ocrType`
- **Source:** `ai-ocr.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/all-document?branchUniqueName=SAMPLE_branchUniqueName&page=1&count=50&from=01-04-2025&to=31-03-2026&sort=&sortBy=&ocrType=SAMPLE_ocrType' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `AI_OCR_API.IMPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/document/upload?type=DOCUMENT_IMPORT&branchUniqueName=:branchUniqueName&ocrType=:ocrType`
- **Source:** `ai-ocr.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/document/upload?type=DOCUMENT_IMPORT&branchUniqueName=SAMPLE_branchUniqueName&ocrType=SAMPLE_ocrType' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `AI_OCR_API.UPLOAD_DOCUMENTS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/signed-url?fileName=:fileName&branchUniqueName=:branchUniqueName`
- **Source:** `ai-ocr.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/signed-url?fileName=SAMPLE_fileName&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ECOMMERCE_API.SEND_EMAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ecommerce/email`
- **Source:** `ecommerce.api.ts` · service: `ecommerce.service.ts#sendEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `sendEmail`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ecommerce/email?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ECOMMERCE_API.SHOPIFY_VERIFY`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ecommerce/verify/:ecommerceUniqueName`
- **Source:** `ecommerce.api.ts` · service: `ecommerce.service.ts#isShopifyConnected`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `isShopifyConnected`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ecommerce/verify/SAMPLE_ecommerceUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `IMPORT_EXCEL_API.IMPORT_STATUS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/status?page=:page&count=:count`
- **Source:** `import-excel.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/status?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `IMPORT_EXCEL_API.PROCESS_IMPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/process?entity=:entity&isHeaderProvided=:isHeaderProvided`
- **Source:** `import-excel.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/process?entity=stock&isHeaderProvided=SAMPLE_isHeaderProvided&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `IMPORT_EXCEL_API.UPLOAD_FILE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/imports/upload?type=:entity`
- **Source:** `import-excel.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/upload?type=stock&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `IMPORTS_API.DOWNLOAD_SHEET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/download-import-logs?requestId=:requestId&status=:status`
- **Source:** `imports.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/download-import-logs?requestId=SAMPLE_requestId&status=SAMPLE_status&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `IMPORTS_API.IMPORTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/imports?from=:from&to=:to&page=:page&count=:count`
- **Source:** `imports.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports?from=01-04-2025&to=31-03-2026&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TALLY_SYNC_API.COMPLETED`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/tally_logs/completed`
- **Source:** `tally-sync.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tally_logs/completed?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TALLY_SYNC_API.ERROR_LOG`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/tally_logs/error_report`
- **Source:** `tally-sync.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tally_logs/error_report?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TALLY_SYNC_API.INPROGRESS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/tally_logs/current_day`
- **Source:** `tally-sync.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tally_logs/current_day?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

