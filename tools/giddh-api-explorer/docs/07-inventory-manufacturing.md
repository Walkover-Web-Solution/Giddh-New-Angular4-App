# Inventory & Manufacturing

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **134**

---

### `INVENTORY_API.BATCH.ARCHIVE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/batch/:batchUniqueName/archive`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName/archive?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.BATCH.AVAILABILITY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/batch/availability?uniqueName=:uniqueName&isVariant=:isVariant&page=:page&count=:count&excludeBatchUniqueName=:excludeBatchUniqueName&sort=:sort&sortBy=:sortBy&q=:q&noStock=:noStock&warehouseUniqueName=:warehouseUniqueName&reportNature=:reportNature`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/availability?uniqueName=SAMPLE_UNIQUE&isVariant=SAMPLE_isVariant&page=1&count=50&excludeBatchUniqueName=SAMPLE_excludeBatchUniqueName&sort=&sortBy=&q=&noStock=SAMPLE_noStock&warehouseUniqueName=SAMPLE_warehouseUniqueName&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.BATCH.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/batch`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.BATCH.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/batch/:batchUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.BATCH.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/batch/:batchUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.BATCH.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/batch/all?page=:page&count=:count&from=:from&to=:to&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/all?page=1&count=50&from=01-04-2025&to=31-03-2026&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.BATCH.TRANSFER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/batch/transfer`
- **Source:** `inventory.api.ts` · service: `subscriptions.service.ts#transferSubscription`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `transferSubscription`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/transfer?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.BATCH.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/batch/:batchUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.BRANCH_TRANSFER.TRANSFER`

- **Method:** `POST`
- **Path template:** `inventory-transfer/`
- **Source:** `inventory.api.ts` · service: `subscriptions.service.ts#transferSubscription`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `transferSubscription`)
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
  'https://api.giddh.com/inventory-transfer/?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.BUSINESS_DOCUMENT_STATUSES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/business-documents/statuses?documentType=:documentType`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/statuses?documentType=SAMPLE_documentType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.CREATE_DISCOUNT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/customer-vendor-discount/stock/:stockUniqueName/assign-discount`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/stock/SAMPLE_STOCK/assign-discount?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.CREATE_NEW_BRANCH_TRANSFER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/branch-transfer/generate`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#createNewBranchTransfer`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `branchTransfer` (see service `createNewBranchTransfer`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as NewBranchTransferResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.CREATE_NEW_MANUFACTURING_STOCKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stocks?isManufactured=true`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetManufacturingStocksForCreateMF`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StocksResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks?isManufactured=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.CREATE_STOCK`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#CreateStock`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateStock`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.CREATE_STOCK_GROUP`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-group`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#CreateStockGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateStockGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockGroupResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.CREATE_STOCK_UNIT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-unit`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#CreateStockUnit`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateStockUnit`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockUnitResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.CREATE_STOCK_V2`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.DELETE_BRANCH_TRANSFER`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/branch-transfer/:branchTransferUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/SAMPLE_branchTransferUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DELETE_DISCOUNT_RECORD`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/customer-vendor-discount?stockUniqueName=:stockUniqueName&variantUniqueName=:variantUniqueName&userUniqueName=:userUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount?stockUniqueName=SAMPLE_STOCK&variantUniqueName=SAMPLE_variantUniqueName&userUniqueName=SAMPLE_USER&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DELETE_STOCK`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#DeleteStock`
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
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DELETE_STOCK_GROUP`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#DeleteStockGroup`
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
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DELETE_STOCK_UNIT`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/stock-unit/:uniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#DeleteStockUnit`
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
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DELETE_STOCK_V2`

- **Method:** `DELETE`
- **Path template:** `v2/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#deleteStock`
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
curl -sS -X DELETE \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DOWNLOAD_INVENTORY_ALL_GROUP_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/download-all-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-all-inventory-report-v2?format=csv&from=01-04-2025&to=31-03-2026&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DOWNLOAD_INVENTORY_GROUP_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniquename/download-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/download-inventory-report-v2?format=csv&from=01-04-2025&to=31-03-2026&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/download-all-inventory-hierarchy?from=:from&to=:to&format=:format&sortBy=:sortBy&sort=:sort&page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-all-inventory-hierarchy?from=01-04-2025&to=31-03-2026&format=csv&sortBy=&sort=&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DOWNLOAD_INVENTORY_STOCK_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/download-stock-inventory-report-v3?from=:from&to=:to&page=:page&count=:count&format=:format&sortBy=:sortBy&sort=:sort`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/download-stock-inventory-report-v3?from=01-04-2025&to=31-03-2026&page=1&count=50&format=csv&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/download-inventory-arrangedby-accounts?from=:from&to=:to&format=:format&sort=:sort&sortBy=:sortBy`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-inventory-arrangedby-accounts?from=01-04-2025&to=31-03-2026&format=csv&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.DOWNLOAD_NEW_BRANCH_TRANSFER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/branch-transfer/download?fileType=base64`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/download?fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.ENTRY.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory-users/:inventoryUserUniqueName/inventory-entries`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users/SAMPLE_INV_USER/inventory-entries?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GET_ALL_DISCOUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/customer-vendor-discount/get-all-discounts?uniqueName=:uniqueName&query=:query&page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/get-all-discounts?uniqueName=SAMPLE_UNIQUE&query=SAMPLE_query&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_ALL_STOCKS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock?query=:query&page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock?query=SAMPLE_query&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_BRANCH_TRANSFER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/branch-transfer/:branchTransferUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/SAMPLE_branchTransferUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_BRANCH_TRANSFER_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/branch-transfer/all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/all?from=01-04-2025&to=31-03-2026&page=1&count=50&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_BULK_STOCK_WITH_INVENTROY_TYPE`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/stock?page=:page&count=:count&inventoryType=:inventoryType`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock?page=1&count=50&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GET_CUSTOMER_VENDOR_DISCOUNT_USERS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/customer-vendor-discount/get-all-users?groupUniqueName=:group&page=:page&count=:count&query=:query&userType=:userType`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/get-all-users?groupUniqueName=SAMPLE_group&page=1&count=50&query=SAMPLE_query&userType=SAMPLE_userType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_FLATTEN_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/:group/flatten-accounts?query=:query&page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_group/flatten-accounts?query=SAMPLE_query&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_FLATTEN_GROUP_WITH_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/flatten-groups-with-accounts?query=:query&page=:page&count=:count&entity=:entity`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/flatten-groups-with-accounts?query=SAMPLE_query&page=1&count=50&entity=stock&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_RATE_FOR_STOCK`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/rate-for-stock`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetRateForStoke`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GetRateForStoke`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/rate-for-stock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GET_STOCK_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock/:stockUniqueName/details?userType=:userType`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/details?userType=SAMPLE_userType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_STOCK_GROUP`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_STOCK_MAPPED_UNIT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-unit/mappings`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getStockMappedUnit`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `unitGroupUniqueName` (see service `getStockMappedUnit`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockMappedUnitResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/mappings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GET_STOCK_UNIT_GROUPS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-unit-group`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#createStockUnitGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createStockUnitGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as any[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit-group?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GET_STOCK_UNIT_WITH_NAME`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-unit/:uName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetStockUnitByName`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockUnitResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/kg?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_STOCK_V2`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_STOCK_WITH_UNIQUENAME`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetStockUniqueNameWithDetail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GET_UNIT_CODE_REGEX`

- **Method:** `GET`
- **Path template:** `ui/forms?formName=:formName&country=:country`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/ui/forms?formName=SAMPLE_formName&country=SAMPLE_country&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GROUP_STOCK_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/report?from=:from&to=:to&entity=:entity&value=:value&condition=:condition&number=:number&stock=:stock&count=:count&page=:page`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/report?from=01-04-2025&to=31-03-2026&entity=stock&value=&condition=&number=&stock=&count=50&page=1&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GROUP_STOCK_REPORT_V2`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/inventory-report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/inventory-report-v2?from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GROUP_STOCK_REPORT_V3`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/inventory-report-v3?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/inventory-report-v3?from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.GROUPS_STOCKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetGroupsStock`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GROUPS_WITH_STOCKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/hierarchical-stock-groups?type=:type`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetGroupsWithStocksFlatten`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupsWithStocksHierarchyMin`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/hierarchical-stock-groups?type=all&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/flatten-stock-groups-with-stocks?count=:count&page=:page&q=:q`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#SearchStockGroupsWithStocks`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupsWithStocksFlatten`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/flatten-stock-groups-with-stocks?count=50&page=1&q=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.GROUPS_WITH_STOCKS_HIERARCHY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/hierarchical-stock-groups?q=:q&page=:page&count=:count`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetGroupsWithStocksHierarchyMin`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupsWithStocksHierarchyMin`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/hierarchical-stock-groups?q=&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.CREATE_INVENTORY`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory-adjustment?voucherVersion=2&branchUniqueName=:branchUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#createInventoryAdjustment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createInventoryAdjustment`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment?voucherVersion=2&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.CREATE_REASON`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory-adjustment/reason`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#createInventoryAdjustReason`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `reason` (see service `createInventoryAdjustReason`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/reason?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/inventory-adjustment/:referenceNo?voucherVersion=2`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#deleteInventoryAdjust`
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
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_referenceNo?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/inventory-adjustment/:referenceNo`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getInventoryAdjust`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_referenceNo?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.GET_REASON`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/inventory-adjustment/reason/get-all?count=2000`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getInventoryAdjustReasons`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/reason/get-all?count=2000&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.REPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory-adjustment/adjustment-report?page=:page&from=:from&to=:to&count=:count&sortBy=:sortBy&sort=:sort&q=:q&searchBy=:searchBy&inventoryType=:inventoryType`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/adjustment-report?page=1&from=01-04-2025&to=31-03-2026&count=50&sortBy=&sort=&q=&searchBy=SAMPLE_searchBy&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_ADJUST.UPDATE_INVENTORY`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/inventory-adjustment/:refNo?voucherVersion=2&branchUniqueName=:branchUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#updateInventoryAdjustment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateInventoryAdjustment`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_refNo?voucherVersion=2&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_GROUP_WISE_EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/export-balance-report/group-wise?from=:from&to=:to&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getGroupWiseReportExport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getGroupWiseReportExport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportRequestExport`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/export-balance-report/group-wise?from=01-04-2025&to=31-03-2026&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_GROUP_WISE_REPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/balance-report/group-wise?stockGroupUniqueName=:stockGroupUniqueName&from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getGroupWiseReport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getGroupWiseReport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/balance-report/group-wise?stockGroupUniqueName=SAMPLE_STOCK_GROUP&from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_ITEM_WISE_EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/export-balance-report/item-wise?from=:from&to=:to&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getItemWiseReportExport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getItemWiseReportExport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportRequestExport`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/export-balance-report/item-wise?from=01-04-2025&to=31-03-2026&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_ITEM_WISE_REPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/balance-report/item-wise?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getItemWiseReport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getItemWiseReport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/balance-report/item-wise?from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_SETTINGS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/inventory-settings`
- **Source:** `inventory.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body.voucherAutomation.inventoryViaBusinessDocument (and related voucherAutomation flags)`
- `body.batchManagement`
- `body.deliveryChallanStatusFlow`
- `body.receiptNoteStatusFlow`
- `body.defaultReportNature`
- `body.lookups`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-settings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.INVENTORY_SETTINGS (PUT update)`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/inventory-settings`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#updateInventorySettings`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "voucherAutomation": { "inventoryViaBusinessDocument": true, "autoGenerateDcOnInvoice": false, "autoGenerateRcOnBill": false }, "autoCreateOppositeOnDcRc": false, "batchManagement": { "enabled": false } }
```

**Response fields used**

- `status`
- `message`
- `body.voucherAutomation.inventoryViaBusinessDocument (and related voucherAutomation flags)`
- `body.batchManagement`
- `body.deliveryChallanStatusFlow`
- `body.receiptNoteStatusFlow`
- `body.defaultReportNature`
- `body.lookups`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-settings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "voucherAutomation": { "inventoryViaBusinessDocument": true, "autoGenerateDcOnInvoice": false, "autoGenerateRcOnBill": false }, "autoCreateOppositeOnDcRc": false, "batchManagement": { "enabled": false } }'
```

---

### `INVENTORY_API.INVENTORY_TRANSACTION_EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/export-balance-report/transaction-wise?from=:from&to=:to&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getTransactionReportExport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getTransactionReportExport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportRequestExport`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/export-balance-report/transaction-wise?from=01-04-2025&to=31-03-2026&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_VARIANT_UPDATE`

- **Method:** `PATCH`
- **Path template:** `v2/company/:companyUniqueName/stock/:stockUniqueName/variant/:variantUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#updateInventoryVariant`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateInventoryVariant`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/variant/SAMPLE_variantUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_VARIANT_WISE_EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/export-balance-report/variant-wise?from=:from&to=:to&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getVariantWiseReportExport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getVariantWiseReportExport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportRequestExport`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/export-balance-report/variant-wise?from=01-04-2025&to=31-03-2026&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.INVENTORY_VARIANT_WISE_REPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/balance-report/variant-wise?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getVariantWiseReport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getVariantWiseReport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InventoryReportResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/balance-report/variant-wise?from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.LINKED_STOCKS.LINKED_STOCKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/linked-sources`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/linked-sources?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.MANUFACTURING_STOCKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stocks-manufacture`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetManufacturingStocks`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StocksResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks-manufacture?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.MASTER.GET_MASTER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/inventory/:stockGroupUniqueName/masters?page=:page&count=:count`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getMasters`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/SAMPLE_STOCK_GROUP/masters?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.MASTER.SEARCH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-groups-with-stocks?inventoryType=:inventoryType&q=:q`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#searchInventory`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-groups-with-stocks?inventoryType=SAMPLE_inventoryType&q=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.MASTER.TOP_INVENTORY_GROUPS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/top-inventory-groups?inventoryType=:inventoryType&page=:page&count=:count`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getTopLevelGroups`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/top-inventory-groups?inventoryType=SAMPLE_inventoryType&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.MOVE_STOCK`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/move`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#MoveStock`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `objToSend` (see service `MoveStock`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/move?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.NEW.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.NEW.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.NEW.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/inventory-report?from=01-04-2025&to=31-03-2026&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.REPORT_ALL_V2`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-report?from=01-04-2025&to=31-03-2026&page=1&count=50&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.REPORT_V2`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/inventory-report?from=01-04-2025&to=31-03-2026&page=1&count=50&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.SEARCH_STOCK_TRANSACTION_FILTERS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory-search`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-search?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.STOCK_AGING_REPORT`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock-aging-report?page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCK_AGING_REPORT_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock-aging-report/:stockUniqueName/details?page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report/SAMPLE_STOCK/details?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCK_AGING_REPORT_TOTALS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock-aging-report/totals`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report/totals?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCK_AGING_REPORT_VARIANTS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock-aging-report/:stockUniqueName/variants?page=:page&count=:count`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report/SAMPLE_STOCK/variants?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCK_DETAIL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetStockDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCK_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetStocksReport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockReportResponse`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/report-v2?from=01-04-2025&to=31-03-2026&count=50&page=1&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCK_REPORT_V2`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetStocksReport_v2`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `GetStocksReport_v2`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockReportResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/report-v2?from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&transaction_type=SAMPLE_transactionType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.STOCK_UNIT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-unit`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#GetStockUnit`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockUnitResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stocks`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.STOCKS_V2`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stocks/v2`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks/v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.TRANSACTION_STOCK_REPORT_BALANCE_V2`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/balance?stockGroupUniqueName=:stockGroupUniqueName&entity=:entity&from=:from&to=:to&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getStockTransactionReportBalance`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stockReportRequest` (see service `getStockTransactionReportBalance`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockReportResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/balance?stockGroupUniqueName=SAMPLE_STOCK_GROUP&entity=stock&from=01-04-2025&to=31-03-2026&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.TRANSACTION_STOCK_REPORT_V2`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory/transaction-report?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType&reportNature=:reportNature`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#getStockTransactionReport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `updatedStockTransactionRequest` (see service `getStockTransactionReport`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/transaction-report?from=01-04-2025&to=31-03-2026&count=50&page=1&sort=&sortBy=&transaction_type=SAMPLE_transactionType&reportNature=SAMPLE_reportNature&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.TRANSFER_ENTRY.CREATE`

- **Method:** `POST`
- **Path template:** `inventory-transfer`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/inventory-transfer?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_BRANCH_TRANSFER`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/branch-transfer/:branchTransferUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/SAMPLE_branchTransferUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_DESCRIPTION`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/inventory-users/:companyUniqueName/inventory-entries/:uniqueName/description`
- **Source:** `inventory.api.ts`
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
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users/dcrcdiin17887749442630bsy43/inventory-entries/SAMPLE_UNIQUE/description?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_DISCOUNT`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/customer-vendor-discount/stock/:stockUniqueName/variant/:variantUniqueName/update-discount`
- **Source:** `inventory.api.ts`
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
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/stock/SAMPLE_STOCK/variant/SAMPLE_variantUniqueName/update-discount?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_STOCK`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#UpdateStock`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateStock`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_STOCK_GROUP`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock-group/:stockGroupUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#UpdateStockGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateStockGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_STOCK_UNIT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock-unit/:uniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#UpdateStockUnit`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateStockUnit`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockMappedUnitResponse`
- `queryString (echoed by service)`
- `body as StockUnitResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_STOCK_UNIT_GROUP`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock-unit-group/:groupUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#updateStockUnitGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateStockUnitGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as any[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit-group/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.UPDATE_STOCK_V2`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.USER.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/inventory-users`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.USER.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/inventory-users?q=:q&refresh=:refresh&page=:page&count=:count`
- **Source:** `inventory.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users?q=&refresh=true&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.USER.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/inventory-users/:inventoryUserUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users/SAMPLE_INV_USER?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.V5.CREATE_STOCK_GROUP`

- **Method:** `POST`
- **Path template:** `v5/company/:companyUniqueName/stock-group?type=:type`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#CreateStockGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateStockGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockGroupResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v5/company/dcrcdiin17887749442630bsy43/stock-group?type=all&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_API.V5.GET_STOCK_GROUP`

- **Method:** `GET`
- **Path template:** `v5/company/:companyUniqueName/stock-group/:groupUniqueName`
- **Source:** `inventory.api.ts`
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
  'https://api.giddh.com/v5/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_API.V5.UPDATE_STOCK_GROUP`

- **Method:** `PUT`
- **Path template:** `v5/company/:companyUniqueName/stock-group/:groupUniqueName`
- **Source:** `inventory.api.ts` · service: `inventory.service.ts#UpdateStockGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateStockGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as StockGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v5/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_VOUCHER_API.CANCEL`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/business-documents/:voucherUniqueName/action`
- **Source:** `sales.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "action": "cancel", "businessDocumentType": "DC" }
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_VOUCHER/action?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "action": "cancel", "businessDocumentType": "DC" }'
```

---

### `INVENTORY_VOUCHER_API.CONVERT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/business-documents/convert`
- **Source:** `sales.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "uniqueNames": ["SAMPLE_VOUCHER"] }
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/convert?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "uniqueNames": ["SAMPLE_VOUCHER"] }'
```

---

### `INVENTORY_VOUCHER_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/business-documents/:voucherUniqueName`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_VOUCHER?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.EVENT_RESOLUTIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/:voucherType/:voucherUniqueName/event-resolutions`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sales/SAMPLE_VOUCHER/event-resolutions?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.EVENTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/:voucherType/:voucherUniqueName/events`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sales/SAMPLE_VOUCHER/events?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.GENERATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/:voucherType/generate`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sales/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVENTORY_VOUCHER_API.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/:voucherType/all`
- **Source:** `sales.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sales/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.GET_SINGLE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/business-documents/:voucherUniqueName`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_VOUCHER?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.HISTORY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/business-documents/:voucherUniqueName/versions`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_VOUCHER/versions?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.LINKED_INVOICE_HISTORY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/business-documents/:voucherUniqueName/history`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_VOUCHER/history?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVENTORY_VOUCHER_API.PENDING_REPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/business-documents/pending-report`
- **Source:** `sales.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "reportType": "NOT_INVOICED", "documentType": "DC" }
```

**Response fields used**

- `status`
- `message`
- `body.results[] (uniqueName, number, date, source, voucherType, challanType, account.name, account.uniqueName, grandTotal, invoiceStatus, statusName/status.statusName, linkedInvoiceCount, linkedInvoiceNumber, linkedInvoiceNumbers/linkedVoucherNumbers, accountCurrencySymbol, accountCurrencyCode)`
- `body.totalItems`
- `body.balances (totalCount, totalAmount, notInvoicedCount, notInvoicedAmount)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/pending-report?from=01-04-2025&to=31-03-2026&q=&page=1&count=50&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "reportType": "NOT_INVOICED", "documentType": "DC" }'
```

---

### `INVENTORY_VOUCHER_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/:voucherType/:voucherUniqueName`
- **Source:** `sales.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sales/SAMPLE_VOUCHER?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/manufacture`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#CreateManufacturingItem`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateManufacturingItem`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICommonResponseOfManufactureItem`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.CREATE_RECIPE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/recipe`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#saveRecipe`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `saveRecipe`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/recipe?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.CREATE_V2`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/stock/:stockUniqueName/manufacture`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#saveManufacturing`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `saveManufacturing`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#DeleteManufacturingItem`
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
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture/SAMPLE_manufacturingUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `MANUFACTURING_API.GET_MANUFACTURING`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/manufacture/:manufactureUniqueName`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#updateManufacturing`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateManufacturing`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/manufacture/SAMPLE_manufactureUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.GET_RATE_FOR_STOCK`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/rate-for-stock-v2`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#getRateForStockV2`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `getRateForStockV2`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/rate-for-stock-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.GET_RECIPE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/recipe/get?withRate=:withRate`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#getVariantRecipe`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `variantUniqueNames` (see service `getVariantRecipe`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/recipe/get?withRate=SAMPLE_withRate&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `MANUFACTURING_API.GET_STOCK_UNITS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock-unit/:stockUnitUniqueName/linked-stock-units`
- **Source:** `manufacturing.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_stockUnitUniqueName/linked-stock-units?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `MANUFACTURING_API.GET_STOCK_WITH_RATE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/link-with-rates`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#GetStockWithRate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICommonResponseOfManufactureItem`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/link-with-rates?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `MANUFACTURING_API.MF_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/stock/manufacture-report?`
- **Source:** `manufacturing.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/manufacture-report?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `MANUFACTURING_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName`
- **Source:** `manufacturing.api.ts` · service: `manufacturing.service.ts#UpdateManufacturingItem`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateManufacturingItem`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICommonResponseOfManufactureItem`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture/SAMPLE_manufacturingUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

