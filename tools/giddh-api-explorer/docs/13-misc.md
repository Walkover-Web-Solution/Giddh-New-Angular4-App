# Platform / Misc

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **38**

---

### `ACTIVITY_LOGS_API.GET_ACTIVITY_LOGS`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/activity-logs`
- **Source:** `activity-logs.api.ts` · service: `activity-logs.service.ts#getActivityLogs`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `getActivityLogs`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/activity-logs?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMMON_API.BARCODE_SCAN`

- **Method:** `GET`
- **Path template:** `v4/company/:companyUniqueName/particular?customerUniqueName=:customerUniqueName&invoiceType=:invoiceType&barcode=:barcode`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/particular?customerUniqueName=SAMPLE_customerUniqueName&invoiceType=SAMPLE_invoiceType&barcode=SAMPLE_barcode&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.CALLING_CODES`

- **Method:** `GET`
- **Path template:** `ui/calling-code`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/ui/calling-code?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.COMMAND_K`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/cmdk?page=:page&q=:q&group=:group&refresh=false&isMobile=:isMobile`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/cmdk?page=1&q=&group=SAMPLE_group&refresh=false&isMobile=SAMPLE_isMobile&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.COUNTRY`

- **Method:** `GET`
- **Path template:** `country?formName=:formName&refresh=false`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/country?formName=SAMPLE_formName&refresh=false&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.CURRENCY`

- **Method:** `GET`
- **Path template:** `currency`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/currency?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.DOWNLOAD_FILE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/download-file?voucherVersion=2&fileType=:fileType&downloadOption=:downloadOption`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/download-file?voucherVersion=2&fileType=SAMPLE_fileType&downloadOption=SAMPLE_downloadOption&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.DOWNLOAD_FILE_V1`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=:fileType`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download-file?fileType=SAMPLE_fileType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.FORM`

- **Method:** `GET`
- **Path template:** `ui/forms?formName=:formName&country=:country&refresh=false`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/ui/forms?formName=SAMPLE_formName&country=SAMPLE_country&refresh=false&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.GST_INFORMATION`

- **Method:** `GET`
- **Path template:** `gst-info?gstin=:gstin`
- **Source:** `common.api.ts` · service: `common.service.ts#getGstInformationDetails`
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
  'https://api.giddh.com/gst-info?gstin=SAMPLE_gstin&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.GST_STOCK_UNITS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/gst/unit-mapping`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gst/unit-mapping?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.MODULE_WISE_COLUMNS`

- **Method:** `GET`
- **Path template:** `report-filters?module=:module&companyUniqueName=:companyUniqueName&customColumns=:customColumns`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/report-filters?module=SAMPLE_module&companyUniqueName=dcrcdiin17887749442630bsy43&customColumns=SAMPLE_customColumns&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.PARTY_TYPE`

- **Method:** `GET`
- **Path template:** `ui/party-types`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/ui/party-types?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.SAVE_MODULE_WISE_COLUMNS`

- **Method:** `GET`
- **Path template:** `report-filters?module=:module&companyUniqueName=:companyUniqueName&`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/report-filters?module=SAMPLE_module&companyUniqueName=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.STOCK_UNITS`

- **Method:** `GET`
- **Path template:** `stock-units`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/stock-units?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.SUBSCRIPTION_PAYPAL_CALL_BACK`

- **Method:** `GET`
- **Path template:** `v2/subscription/paypal-subscription-callback`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/v2/subscription/paypal-subscription-callback?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.TAXES`

- **Method:** `GET`
- **Path template:** `ui/taxes?country=:country`
- **Source:** `common.api.ts`
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
  'https://api.giddh.com/ui/taxes?country=SAMPLE_country&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMMON_API.UPLOAD_FILE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/ledger/upload`
- **Source:** `common.api.ts`
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

### `COMMON_API.UPLOAD_IMAGE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/images`
- **Source:** `common.api.ts`
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

### `CUSTOM_FIELDS.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/customfield`
- **Source:** `custom-fields.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CUSTOM_FIELDS.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/customfield/:customFieldUniqueName`
- **Source:** `custom-fields.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/SAMPLE_customFieldUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_FIELDS.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/customfield/:customFieldUniqueName`
- **Source:** `custom-fields.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/SAMPLE_customFieldUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_FIELDS.GET_ALL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/customfield/module/:moduleUniqueName?page=:page&count=:count`
- **Source:** `custom-fields.api.ts` · service: `aside-recurring-voucher.service.ts#getAll`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/module/SAMPLE_moduleUniqueName?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CUSTOM_FIELDS.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/customfield/:customFieldUniqueName`
- **Source:** `custom-fields.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/SAMPLE_customFieldUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EMAIL_FORWARDING_API.CREATE_EMAIL_FORWARDING`

- **Method:** `POST`
- **Path template:** `${COMPANY_BASE_URL}/email-forwarding`
- **Source:** `email-forwarding.api.ts`
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
  'https://api.giddh.com/${COMPANY_BASE_URL}/email-forwarding?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EMAIL_FORWARDING_API.DELETE_EMAIL_FORWARDING`

- **Method:** `DELETE`
- **Path template:** `${COMPANY_BASE_URL}/email-forwarding/:uniqueName`
- **Source:** `email-forwarding.api.ts`
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
  'https://api.giddh.com/${COMPANY_BASE_URL}/email-forwarding/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EMAIL_FORWARDING_API.GENERATE_EMAIL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/generate-email`
- **Source:** `email-forwarding.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/generate-email?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EMAIL_FORWARDING_API.GET_ALL_EMAIL_FORWARDING`

- **Method:** `DELETE`
- **Path template:** `${COMPANY_BASE_URL}/email-forwarding/get-all`
- **Source:** `email-forwarding.api.ts`
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
  'https://api.giddh.com/${COMPANY_BASE_URL}/email-forwarding/get-all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EMAIL_FORWARDING_API.GET_EMAIL_FORWARDING`

- **Method:** `GET`
- **Path template:** `${COMPANY_BASE_URL}/email-forwarding/:uniqueName`
- **Source:** `email-forwarding.api.ts`
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
  'https://api.giddh.com/${COMPANY_BASE_URL}/email-forwarding/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EMAIL_FORWARDING_API.UPDATE_EMAIL_FORWARDING`

- **Method:** `PUT`
- **Path template:** `${COMPANY_BASE_URL}/email-forwarding/:uniqueName`
- **Source:** `email-forwarding.api.ts`
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
  'https://api.giddh.com/${COMPANY_BASE_URL}/email-forwarding/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ERROR_LOG_API`

- **Method:** `GET`
- **Path template:** `ui/error-recorder`
- **Source:** `exception-log.api.ts`
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
  'https://api.giddh.com/ui/error-recorder?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EXCEPTION_API`

- **Method:** `GET`
- **Path template:** `ui/exception`
- **Source:** `exception-log.api.ts`
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
  'https://api.giddh.com/ui/exception?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INLINE.app.whiteLabel`

- **Method:** `GET`
- **Path template:** `white-label`
- **Source:** `app.module.ts` · service: `app.module.ts`
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
  'https://api.giddh.com/white-label?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `INLINE.auth.invalidJson`

- **Method:** `POST`
- **Path template:** `exception/invalid-json`
- **Source:** `authentication.service.ts` · service: `authentication.service.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ environment, ...exceptionPayload }
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/exception/invalid-json?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ environment, ...exceptionPayload }'
```

---

### `INLINE.contact.accountBalances`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/account-balances`
- **Source:** `contact.service.ts` · service: `contact.service.ts`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/account-balances?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGS_API.AUDIT_LOGS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/logs?page=:page`
- **Source:** `logs.api.ts` · service: `logs.service.ts#GetAuditLogs`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `GetAuditLogs`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as LogsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/logs?page=1&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGS_API.GET_AUDIT_LOG_FORM_FILTERS`

- **Method:** `GET`
- **Path template:** `ui/auditlogs-form`
- **Source:** `logs.api.ts` · service: `logs.service.ts#getAuditLogFormFilters`
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
  'https://api.giddh.com/ui/auditlogs-form?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGS_API.GET_AUDIT_LOGS_V2`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/logs?page=:page`
- **Source:** `logs.api.ts` · service: `logs.service.ts#getAuditLogs`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `getAuditLogs`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AuditLogsResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/logs?page=1&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

