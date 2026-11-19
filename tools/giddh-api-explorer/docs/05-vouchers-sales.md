# Vouchers / Sales / Invoice / Receipt

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **113**

---

### `BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/vouchers/bulk-update?action=:actionType`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/bulk-update?action=SAMPLE_actionType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `BULK_VOUCHER_EXPORT_API.BULK_EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/vouchers/bulk-export?from=:from&to=:to&type=:type&mail=:mail&q=:q`
- **Source:** `bulkvoucherexport.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/bulk-export?from=01-04-2025&to=31-03-2026&type=all&mail=SAMPLE_mail&q=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CUSTOM_EMAIL_TEMPLATE.CREATE_EMAIL_TEMPLATE`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/communication/email-template`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/communication/email-template?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CUSTOM_EMAIL_TEMPLATE.CREATE_TRIGGERS`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/trigger`
- **Source:** `invoice.api.ts` · service: `campaign.integration.service.ts#createTrigger`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `requestObj` (see service `createTrigger`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CUSTOM_EMAIL_TEMPLATE.DELETE_TRIGGER`

- **Method:** `DELETE`
- **Path template:** `v2/company/:companyUniqueName/trigger/:uniqueName`
- **Source:** `invoice.api.ts` · service: `campaign.integration.service.ts#deleteTrigger`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_EMAIL_TEMPLATE.GET_ALL_TRIGGERS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/trigger/all?page=:page&count=:count`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/all?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONDITIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/condition-suggestion?triggerModule=:triggerModule`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/condition-suggestion?triggerModule=SAMPLE_triggerModule&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONTENT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/email-content-suggestion`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/email-content-suggestion?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_TEMPLATE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/communication/email-template/:voucherType`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/communication/email-template/sales?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_EMAIL_TEMPLATE.GET_TRIGGER_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/trigger/:uniqueName`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_EMAIL_TEMPLATE.UPDATE_EMAIL_TEMPLATE`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/communication/email-template/:voucherType`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/communication/email-template/sales?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CUSTOM_EMAIL_TEMPLATE.UPDATE_TRIGGERS`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/trigger/:uniqueName`
- **Source:** `invoice.api.ts` · service: `campaign.integration.service.ts#updateTrigger`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `requestObj` (see service `updateTrigger`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ESTIMATES_API.base`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#get`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `get`) | Request body: `request` (see service `update`) | Request body: `request` (see service `getEstimateProforma`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VoucherClass`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ESTIMATES_API.download`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/download?fileType=:fileType`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#download`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `download`)
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
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/download?fileType=SAMPLE_fileType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ESTIMATES_API.generate`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/generate`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#generate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `generate`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VoucherClass`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ESTIMATES_API.generateInvoice`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-estimate`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#generateInvoice`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `generateInvoice`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/accounts/SAMPLE_ACCOUNT/v3/generate-via-estimate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ESTIMATES_API.generateProforma`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/proformas/generate-via-estimate`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#generateProforma`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `generateProforma`)
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
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/proformas/generate-via-estimate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ESTIMATES_API.getAll`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/v3/:vouchers/all?`
- **Source:** `proforma.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/v3/SAMPLE_vouchers/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ESTIMATES_API.getVersions`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/versions/all?`
- **Source:** `proforma.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/versions/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ESTIMATES_API.updateAction`

- **Method:** `PUT`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/action`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#updateAction`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `updateAction`)
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
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/action?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.ADD_TRANSPORTER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/transporters`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#addEwayTransporter`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `addEwayTransporter`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.CANCEL_EWAY_BILL`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/ewb/cancel`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#cancelEwayBill`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `cancelEwayBill`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/cancel?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.DELETE_TRANSPORTER`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/transporters?transporterId=:transporterId`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?transporterId=SAMPLE_transporterId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EWAYBILL_API.DOWNLOAD_DETAILED_EWAY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/ewb/:ewaybillNumber/download-detailed-v2`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#DownloadDetailedEwayBills`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/SAMPLE_ewaybillNumber/download-detailed-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EWAYBILL_API.DOWNLOAD_EWAY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/ewb/:ewaybillNumber/download-v2`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#DownloadEwayBills`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/SAMPLE_ewaybillNumber/download-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EWAYBILL_API.EWAYBILL_FROM_PLACE`

- **Method:** `GET`
- **Path template:** `country/cities?pinCode=:pinCode`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/country/cities?pinCode=SAMPLE_pinCode&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EWAYBILL_API.GENERATE_EWAYBILL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ewb`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#GenerateNewEwaybill`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `GenerateNewEwaybill`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IEwayBillAllList`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.GET_ALL_TRANSPORTER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/transporters?page=:pageNo`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?page=SAMPLE_pageNo&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EWAYBILL_API.LOGIN_EWAYBILL_USER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ewb/user`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#LoginEwaybillUser`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `LoginEwaybillUser`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/user?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.UPDATE_EWAY_VEHICLE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/ewb/vehicle`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#updateEwayVehicle`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateEwayVehicle`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/vehicle?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.UPDATE_TRANSPORTER`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/transporters?transporterId=:transporterId`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#UpdateGeneratedTransporter`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateGeneratedTransporter`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?transporterId=SAMPLE_transporterId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EWAYBILL_API.VALIDATE_INVOICE_EWAYBILL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ewb/validate-invoice`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#validateInvoiceForEwaybill`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `validateInvoiceForEwaybill`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/validate-invoice?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API_2.CANCEL_E_INVOICE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/cancel-einvoice`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/cancel-einvoice?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.DELETE_VOUCHER`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.DOWNLOAD_INVOICE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=pdf`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download-file?fileType=pdf&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.DOWNLOAD_INVOICE_V3`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/:companyUniqueName/accounts/:accountUniqueName/vouchers/mail`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.GENERATE_BULK_INVOICE`

- **Method:** `POST`
- **Path template:** `v4/company/:companyUniqueName/vouchers/bulk-generate?combined`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers/bulk-generate?combined=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API_2.GENERATE_INVOICE`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/generate`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#GenerateInvoice`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GenerateInvoice`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GenerateInvoiceRequestClass`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API_2.GENERATED_INVOICE_PREVIEW`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/invoice/preview`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#GetGeneratedInvoicePreview`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ invoiceNumber }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as PreviewInvoiceResponseClass`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoice/preview?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ invoiceNumber }'
```

---

### `INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/templates/:templateUniqueName`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#GetInvoiceTemplateDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InvoiceTemplateDetailsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.PREVIEW_INVOICE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/preview`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/preview?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.PREVIEW_VOUCHERS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/preview`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/preview?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.PREVIEW_VOUCHERS_V4`

- **Method:** `GET`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API_2.SEND_INVOICE_ON_MAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/mail`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API_2.SEND_INVOICE_ON_SMS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/:voucherNumber/magic-link?expirey=1`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#SendInvoiceOnSms`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `SendInvoiceOnSms`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/SAMPLE_voucherNumber/magic-link?expirey=1&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API_2.UPDATE_GENERATED_INVOICE`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#UpdateGeneratedInvoice`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateGeneratedInvoice`)
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.ACTION_ON_INVOICE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/invoices/:invoiceUniqueName/action`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoices/SAMPLE_invoiceUniqueName/action?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.CANCEL_CN_DN_E_INVOICE_API`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/voucher/:voucherUniqueName/cancel-einvoice`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/voucher/SAMPLE_VOUCHER/cancel-einvoice?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.CANCEL_E_INVOICE_API`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/invoice/:invoiceUniqueName/cancel-einvoice`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoice/SAMPLE_invoiceUniqueName/cancel-einvoice?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.CREATE_NEW_TEMPLATE`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/templates`
- **Source:** `invoice.ts` · service: `invoice.templates.service.ts#saveTemplates`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `saveTemplates`)
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.DELETE_INVOICE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/invoices`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoices?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.DELETE_TEMPLATE`

- **Method:** `DELETE`
- **Path template:** `v2/company/:companyUniqueName/templates/:templateUniqueName`
- **Source:** `invoice.ts` · service: `invoice.templates.service.ts#deleteTemplate`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.DELETE_WEBHOOK`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/settings/webhooks/:webhookUniquename`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#DeleteInvoiceWebhook`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/settings/webhooks/SAMPLE_webhookUniquename?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/export-invoices-v2?from=:from&to=:to&fileType=:fileType`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-invoices-v2?from=01-04-2025&to=31-03-2026&fileType=SAMPLE_fileType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GENERATE_BULK_INVOICE`

- **Method:** `POST`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountuniquename/vouchers/bulk-generate?combined`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_accountuniquename/vouchers/bulk-generate?combined=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.GENERATE_INVOICE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/invoices/generate`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#GenerateInvoice`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GenerateInvoice`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GenerateInvoiceRequestClass`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/ledgers?`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledgers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GET_ALL_VERSIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/voucher/:voucherUniqueName/versions?page=:page&count=:count`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/voucher/SAMPLE_VOUCHER/versions?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GET_CREATED_TEMPLATES`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/templates?type=:voucherType`
- **Source:** `invoice.api.ts` · service: `invoice.templates.service.ts#getAllCreatedTemplates`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as CustomTemplateResponse[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates?type=sales&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GET_INVOICE_TEMPLATE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/templates-v2/templateUniqueName`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/templates-v2/templateUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GET_INVOICE_TEMPLATES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/templates/all`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/templates/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GET_RAZORPAY_DETAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/razorpay`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#SaveRazorPayDetail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `form` (see service `UpdateRazorPayDetail`) | Request body: `form` (see service `SaveRazorPayDetail`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as RazorPayDetailsResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.GET_TEMPLATE_PREVIEW`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/templates/:templateUniqueName?type=:voucherType&voucherVersion=2`
- **Source:** `invoice.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?type=sales&voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.GET_USER_TEMPLATES`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/sample-templates?type=:voucherType`
- **Source:** `invoice.ts` · service: `invoice.templates.service.ts#getTemplates`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as CustomTemplateResponse[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/sample-templates?type=sales&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.REMOVE_IMAGE_SIGNATURE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/delete-image?imgUniqueName=:imgUniqueName`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#removeSignature`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/delete-image?imgUniqueName=SAMPLE_imgUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INVOICE_API.SAVE_INVOICE_WEBHOOK`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/settings/webhooks`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#SaveInvoiceWebhook`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `webhook` (see service `SaveInvoiceWebhook`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/settings/webhooks?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.SAVE_TEMPLATE_SETTINGS`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/template-preview?voucherVersion=2`
- **Source:** `invoice.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/template-preview?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.SEND_INVOICE_ON_MAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/invoices/mail`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.SET_AS_DEFAULT`

- **Method:** `PATCH`
- **Path template:** `v2/company/:companyUniqueName/templates/:templateUniqueName/default?type=:voucherType`
- **Source:** `invoice.ts` · service: `invoice.templates.service.ts#setTemplateAsDefault`
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
curl -sS -X PATCH \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName/default?type=sales&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.SETTING_INVOICE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/settings`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#UpdateInvoiceSetting`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `form` (see service `UpdateInvoiceSetting`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as InvoiceSetting`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/settings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.UPDATE_INVOICE_EMAIL`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/invoice-setting`
- **Source:** `invoice.api.ts` · service: `invoice.service.ts#UpdateInvoiceEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ emailAddress }
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoice-setting?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ emailAddress }'
```

---

### `INVOICE_API.UPDATE_TEMPLATE`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/templates/:templateUniqueName`
- **Source:** `invoice.ts` · service: `invoice.templates.service.ts#updateTemplate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateTemplate`)
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.UPLOAD_LOGO`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/images`
- **Source:** `invoice.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/images?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `INVOICE_API.VERIFY_EMAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/invoice-setting/verify-email?emailAddress=:emailAddress&scope=:scope&branchUniqueName=:branchUniqueName`
- **Source:** `invoice.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoice-setting/verify-email?emailAddress=SAMPLE_emailAddress&scope=SAMPLE_scope&branchUniqueName=SAMPLE_branchUniqueName' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `NEWVSOLDINVOICE_API.GET`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/new-old-sales?type=:type&value=:value`
- **Source:** `new-vs-old-invocies.api.ts` · service: `new-vs-old-invoices.service.ts#GetNewVsOldInvoicesBySalesPerson`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `body` (see service `GetNewVsOldInvoicesBySalesPerson`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as NewVsOldInvoicesResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/new-old-sales?type=all&value=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PROFORMA_API.base`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#get`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `get`) | Request body: `request` (see service `update`) | Request body: `request` (see service `getEstimateProforma`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VoucherClass`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PROFORMA_API.download`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/download?fileType=:fileType`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#download`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `download`)
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
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/download?fileType=SAMPLE_fileType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PROFORMA_API.generate`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/generate`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#generate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `generate`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VoucherClass`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PROFORMA_API.generateInvoice`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-proforma`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#generateInvoice`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `generateInvoice`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/accounts/SAMPLE_ACCOUNT/v3/generate-via-proforma?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PROFORMA_API.getAll`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/v3/:vouchers/all?`
- **Source:** `proforma.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/v3/SAMPLE_vouchers/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PROFORMA_API.mailProforma`

- **Method:** `POST`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/mail`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#sendEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `sendEmail`) | Request body: `request` (see service `sendProformaEstimateOnEmail`)
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
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PROFORMA_API.updateAction`

- **Method:** `PUT`
- **Path template:** `v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/action`
- **Source:** `proforma.api.ts` · service: `proforma.service.ts#updateAction`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `updateAction`)
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
  'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_vouchers/action?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECEIPT_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.DOWNLOAD_VOUCHER`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=pdf`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download-file?fileType=pdf&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_ADVANCE_RECEIPTS_SUMMARY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/advance-receipt/summary?from=:from&to=:to`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/advance-receipt/summary?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/get-all?`
- **Source:** `receipt.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/get-all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_ALL_ADVANCE_RECEIPTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/advance-receipt/get-all?page=:page&count=:count&from=:from&to=:to&sort=:sort&sortBy=:sortBy`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/advance-receipt/get-all?page=1&count=50&from=01-04-2025&to=31-03-2026&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_ALL_BAL_SALE_DUE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/get-all-vouchers-balances?`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/get-all-vouchers-balances?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_ALL_PURCHASE_RECORDS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/purchase-record/get-all?`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-record/get-all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_DETAILS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `receipt.api.ts` · service: `receipt.service.ts#GetVoucherDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GetVoucherDetails`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as Voucher`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECEIPT_API.GET_DETAILS_V4`

- **Method:** `GET`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.GET_PURCHASE_RECORD`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/:purchaseRecordUniqueNumber`
- **Source:** `receipt.api.ts` · service: `receipt.service.ts#GetPurchaseRecordDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as Voucher`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/SAMPLE_purchaseRecordUniqueNumber?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECEIPT_API.PUT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `receipt.api.ts` · service: `receipt.service.ts#UpdateReceipt`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateReceipt`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECEIPT_API.STOCK_HISTORY`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/stock-history?branchUniqueName=:branchUniqueName&voucherVersion=2`
- **Source:** `receipt.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-history?branchUniqueName=SAMPLE_branchUniqueName&voucherVersion=2' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECURRING_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName?voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts`
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
  'https://api.giddh.com/${COMMON_URL}recurring-vouchers/SAMPLE_recurringVoucherUniqueName?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECURRING_API.GET_ALL`

- **Method:** `GET`
- **Path template:** `${COMMON_URL}recurring-vouchers/get-all-recurring-voucher?voucherType=:voucherType&page=:page&count=:count&q=:q&sort=:sort&sortBy=:sortBy&from=:from&to=:to&voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/${COMMON_URL}recurring-vouchers/get-all-recurring-voucher?voucherType=sales&page=1&count=50&q=&sort=&sortBy=&from=01-04-2025&to=31-03-2026&voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECURRING_API.MAKE_RECURRING`

- **Method:** `POST`
- **Path template:** `v4/company/:companyUniqueName/vouchers/:voucherUniqueName/make-recurring?voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers/SAMPLE_VOUCHER/make-recurring?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECURRING_API.PREVIEW`

- **Method:** `POST`
- **Path template:** `${COMMON_URL}recurring-vouchers/preview?voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts` · service: `aside-recurring-voucher.service.ts#preview`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `payload` (see service `preview`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/${COMMON_URL}recurring-vouchers/preview?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECURRING_API.RULE_DETAILS`

- **Method:** `GET`
- **Path template:** `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName?voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts`
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
  'https://api.giddh.com/${COMMON_URL}recurring-vouchers/SAMPLE_recurringVoucherUniqueName?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECURRING_API.STATUS_UPDATE`

- **Method:** `PATCH`
- **Path template:** `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName?voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts`
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
  'https://api.giddh.com/${COMMON_URL}recurring-vouchers/SAMPLE_recurringVoucherUniqueName?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECURRING_API.VOUCHER_DETAILS`

- **Method:** `GET`
- **Path template:** `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName/details?voucherVersion=2`
- **Source:** `aside-recurring-voucher.api.ts`
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
  'https://api.giddh.com/${COMMON_URL}recurring-vouchers/SAMPLE_recurringVoucherUniqueName/details?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECURRING_VOUCHER_API.CREATE`

- **Method:** `POST`
- **Path template:** `company/{{companyname}}/recurring-voucher/`
- **Source:** `recurring-voucher.api.ts` · service: `recurring-voucher.service.ts#createRecurringVouchers`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createRecurringVouchers`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as RecurringInvoice`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECURRING_VOUCHER_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/{{companyname}}/recurring-voucher/{{uniqueName}}`
- **Source:** `recurring-voucher.api.ts` · service: `recurring-voucher.service.ts#deleteRecurringVouchers`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `RECURRING_VOUCHER_API.GET`

- **Method:** `POST`
- **Path template:** `company/{{companyname}}/recurring-voucher/get-all/?count=:count&page=:page&sort=:sort&sortBy=:sortBy`
- **Source:** `recurring-voucher.api.ts` · service: `recurring-voucher.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `filter` (see service `if`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as RecurringInvoice[]`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/get-all/?count=50&page=1&sort=&sortBy=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `RECURRING_VOUCHER_API.UPDATE`

- **Method:** `PATCH`
- **Path template:** `company/{{companyname}}/recurring-voucher/{{uniqueName}}`
- **Source:** `recurring-voucher.api.ts` · service: `recurring-voucher.service.ts#updateRecurringVouchers`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `req` (see service `updateRecurringVouchers`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as RecurringInvoice`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_API_V2.GENERATE_GENERIC_ITEMS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_API_V2.GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/brief-accounts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/brief-accounts?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SALES_API_V2.GET_VOUCHER_INVOICE_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&adjustmentRequest=:adjustmentRequest&count=:count&page=:page&number=:number`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/invoice-list?voucherDate=01-04-2025&adjustmentRequest=false&count=50&page=1&number=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SALES_API_V2.UPDATE_VOUCHER`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `sales.api.ts` · service: `sales.service.ts#updateVoucher`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateVoucher`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_API_V4.GENERATE_GENERIC_ITEMS`

- **Method:** `POST`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_API_V4.GENERATE_SALES`

- **Method:** `POST`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/invoices/generate-sales`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/generate-sales?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_API_V4.UPDATE_ATTACHMENT`

- **Method:** `PUT`
- **Path template:** `v4/company/:companyUniqueName/vouchers`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_API_V4.UPDATE_VOUCHER`

- **Method:** `PUT`
- **Path template:** `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`
- **Source:** `sales.api.ts` · service: `sales.service.ts#updateVoucher`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateVoucher`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

