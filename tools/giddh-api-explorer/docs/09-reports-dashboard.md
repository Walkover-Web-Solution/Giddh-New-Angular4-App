# Reports / Dashboard

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **34**

---

### `ACCOUNTING_API.CREATE_AND_DELETE_ENTRY`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName/entry`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/entry?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.CREATE_PROJECT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/project?branchUniqueName=:branchUniqueName`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project?branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTING_API.DELETE_PROJECT`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName?branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.ENTRY_SEARCH`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/project-entries?from=:from&to=:to&page=:page&count=:count&branchUniqueName=:branchUniqueName&q=:q&categoryType=:category`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/project-entries?from=01-04-2025&to=31-03-2026&page=1&count=50&branchUniqueName=SAMPLE_branchUniqueName&q=&categoryType=SAMPLE_category' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTING_API.GET_ALL_ENTRY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName/entries?category=:category&branchUniqueName=:branchUniqueName&page=:page&count=:count`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/entries?category=SAMPLE_category&branchUniqueName=SAMPLE_branchUniqueName&page=1&count=50' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.GET_ALL_PROJECTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/project/all?branchUniqueName=:branchUniqueName&sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:searchQuery&queryColumn=:queryColumn`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/all?branchUniqueName=SAMPLE_branchUniqueName&sort=&sortBy=&page=1&count=50&q=SAMPLE_searchQuery&queryColumn=SAMPLE_queryColumn' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.GET_NET_PROFIT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName/net-profit?from=:from&to=:to`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/net-profit?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.GET_PROJECT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName?branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.GET_PROJECT_PROFIT_LOSS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName/profit-loss?from=:from&to=:to`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/profit-loss?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.GET_TOTAL_REVENUE_EXPENSES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName/category-total?category=:category`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/category-total?category=SAMPLE_category&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTING_API.UPDATE_ENTRY`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName/entry/:entryUniqueName`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/entry/SAMPLE_entryUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTING_API.UPDATE_PROJECT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`
- **Source:** `project-wise-accounting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName?branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ALL_REPORTS_API.GET_ALL`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/reports/all-reports`
- **Source:** `all-reports.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/all-reports?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ALL_REPORTS_API.SAVE_FAVORITES`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/reports/save-report-data`
- **Source:** `all-reports.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/save-report-data?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `BUDGET_FORECASTING_API.GET_FORECAST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/forecast`
- **Source:** `budget-forecasting.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/forecast?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DASHBOARD_API.GET_PENDING_VOUCHERS_COUNT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/vouchers/voucher-status-count?from=:fromDate&to=:toDate&type=:type&voucherVersion=2`
- **Source:** `dashboard.api.ts` · service: `dashboard.service.ts#getPendingVouchersCount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/voucher-status-count?from=SAMPLE_fromDate&to=SAMPLE_toDate&type=all&voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `DASHBOARD_API.RATIO_ANALYSIS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/calculateRatios?date=:date&refresh=:refresh`
- **Source:** `dashboard.api.ts` · service: `dashboard.service.ts#GetRationAnalysis`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as BankAccountsResponse[]`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/calculateRatios?date=SAMPLE_date&refresh=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DASHBOARD_API.REVENUE_GRAPH_DATA`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/dashboard/graph?currentFrom=:currentFrom&currentTo=:currentTo&previousFrom=:previousFrom&previousTo=:previousTo&interval=:interval&type=:type&uniqueName=:uniqueName&refresh=:refresh`
- **Source:** `dashboard.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dashboard/graph?currentFrom=SAMPLE_currentFrom&currentTo=SAMPLE_currentTo&previousFrom=SAMPLE_previousFrom&previousTo=SAMPLE_previousTo&interval=SAMPLE_interval&type=all&uniqueName=SAMPLE_UNIQUE&refresh=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DASHBOARD_API.REVENUE_GRAPH_TYPES`

- **Method:** `GET`
- **Path template:** `ui/graph-types`
- **Source:** `dashboard.api.ts` · service: `dashboard.service.ts#GetRevenueGraphTypes`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GraphTypesResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/ui/graph-types?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DOWNLOADS_API.DOWNLOADS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/exports?from=:from&to=:to&page=:page&count=:count`
- **Source:** `download.api.ts` · service: `downloads.service.ts#getDownloads`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as DownloadsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/exports?from=01-04-2025&to=31-03-2026&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `Report`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/cash-flow-download-v2?from=:from&to=:to&fileType=base64`
- **Source:** `cashflowstatement.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/cash-flow-download-v2?from=01-04-2025&to=31-03-2026&fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SALES_BIFURCATION_API`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/new-old-sales/details?value=:value&type=:type&dataType=:dataType&page=:page&count=:count&q=:q&sort=:sort&sortBy=:sortBy&fromDate=:fromDate&toDate=:toDate&salesFrom=:salesFrom`
- **Source:** `sales-bifurcation-details.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/new-old-sales/details?value=&type=all&dataType=SAMPLE_dataType&page=1&count=50&q=&sort=&sortBy=&fromDate=SAMPLE_fromDate&toDate=SAMPLE_toDate&salesFrom=SAMPLE_salesFrom&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.DOWNLOAD_BALANCE_SHEET_EXCEL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/v2/balance-sheet-collapsed-download-v2`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v2/balance-sheet-collapsed-download-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.DOWNLOAD_PROFIT_LOSS_EXCEL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/v2/profit-loss-collapsed-download-v2`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v2/profit-loss-collapsed-download-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.DOWNLOAD_TRIAL_BALANCE_EXCEL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/trial-balance-export-v2`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#DownloadTrialBalanceExcel`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/trial-balance-export-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.GET_BALANCE_SHEET`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/multibranch/balance-sheet`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountDetails`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/balance-sheet?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.GET_COGS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/cogs`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#GetCogs`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GetCogsResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/cogs?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.GET_COMPARED_PROFIT_LOSS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/multibranch/compared-profit-loss?tax=30`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountDetails`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/compared-profit-loss?tax=30&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/multicompany/:reportType`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#createMultiCurrencyReport`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `payload` (see service `createMultiCurrencyReport`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multicompany/SAMPLE_reportType?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `TB_PL_BS_API.GET_PROFIT_LOSS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/multibranch/profit-loss?tax=30`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountDetails`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/profit-loss?tax=30&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.GET_TRIAL_BALANCE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/multibranch/trial-balance`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountDetails`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/trial-balance?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.GET_V2_TRIAL_BALANCE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/trial-balance`
- **Source:** `tl-pl.api.ts` · service: `tl-pl.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountDetails`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trial-balance?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.TAILED_REPORT_ACCOUNT_GROUP`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/reports/entity-status?from=:from&to=:to&reportType=:reportType`
- **Source:** `tl-pl.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/entity-status?from=01-04-2025&to=31-03-2026&reportType=SAMPLE_reportType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TB_PL_BS_API.TAILED_REPORT_DATE_RANGE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/reports/entity-selection?reportType=:reportType`
- **Source:** `tl-pl.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/entity-selection?reportType=SAMPLE_reportType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

