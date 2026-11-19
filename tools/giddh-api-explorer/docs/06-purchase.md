# Purchase

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **29**

---

### `EXPENSE_API.ACTION`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/pettycash-manager/:uniqueName?action=:actionType&accountUniqueName=:accountUniqueName`
- **Source:** `expense.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/SAMPLE_UNIQUE?action=SAMPLE_actionType&accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EXPENSE_API.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/pettycash-manager/report`
- **Source:** `expense.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/report?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EXPENSE_API.GETEntry`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/pettycash-manager/ledger/:accountUniqueName`
- **Source:** `expense.api.ts` · service: `expences.service.ts#getPettycashEntry`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as PettyCashResonse`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/ledger/SAMPLE_ACCOUNT?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.BULK_UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/purchase-order/bulk-update?action=:action`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/bulk-update?action=SAMPLE_action&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_ORDER_API.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/generate`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_ORDER_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/purchase-order?uniqueName=:poUniqueName`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order?uniqueName=SAMPLE_poUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.EMAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/:poUniqueName/mail`
- **Source:** `purchase-order.api.ts` · service: `settings.integration.service.ts#SaveEmailKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SaveEmailKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as EmailKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/SAMPLE_poUniqueName/mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_ORDER_API.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/purchase-order/:poUniqueName`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/SAMPLE_poUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/purchase-order/get-all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`
- **Source:** `purchase-order.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/get-all?from=01-04-2025&to=31-03-2026&page=1&count=50&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.GET_ALL_PENDING`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/pending-numbers?page=:page&count=:count&sort=:sort&sortBy=:sortBy&pendingItems=true`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/pending-numbers?page=1&count=50&sort=&sortBy=&pendingItems=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.GET_ALL_VERSIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/versions/all?page=:page&count=:count`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/versions/all?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.GET_PDF`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/:poUniqueName/download?fileType=base64`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/SAMPLE_poUniqueName/download?fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.GET_PREVIEW`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/purchase-order/preview?uniqueName=:poUniqueName`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/preview?uniqueName=SAMPLE_poUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_ORDER_API.STATUS_UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/status/change`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/status/change?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_ORDER_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-order`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_ORDER_API.UPDATE_SETTINGS_EMAIL`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/purchase-bill-setting`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-bill-setting?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_ORDER_API.VERIFY_EMAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/purchase-bill-setting/verify-email?emailAddress=:emailAddress&scope=:scope&branchUniqueName=:branchUniqueName`
- **Source:** `purchase-order.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-bill-setting/verify-email?emailAddress=SAMPLE_emailAddress&scope=SAMPLE_scope&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_RECORD`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/purchase-record?uniqueName=:uniqueName`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-record?uniqueName=SAMPLE_UNIQUE&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.DOWNLOAD_ATTACHMENT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/download-file`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/download-file?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.EMAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/:uniqueName/mail`
- **Source:** `purchase-record.api.ts` · service: `settings.integration.service.ts#SaveEmailKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SaveEmailKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as EmailKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/SAMPLE_UNIQUE/mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_RECORD_API.GENERATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/generate`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_RECORD_API.GET_ALL_VERSIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/versions/all?page=:page&count=:count`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/versions/all?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.GET_PDF`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/:uniqueName/download?fileType=base64`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/SAMPLE_UNIQUE/download?fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PURCHASE_RECORD_API.V2.DOWNLOAD_ATTACHMENT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=base64`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download-file?fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.V2.GET_PDF`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download?fileType=base64`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download?fileType=base64&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PURCHASE_RECORD_API.VALIDATE_RECORD`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/validate`
- **Source:** `purchase-record.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/validate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

