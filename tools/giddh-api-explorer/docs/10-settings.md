# Settings

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **91**

---

### `EBANKS.ADD_GIDDH_ACCOUNT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/yodlee/ebanks/:itemAccountId`
- **Source:** `settings.linked.accounts.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/ebanks/SAMPLE_itemAccountId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EBANKS.DELETE_BANK_ACCOUNT`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/yodlee/yodlee-accounts?`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#if`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/yodlee-accounts?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EBANKS.LINK_ACCOUNT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/yodlee/ebanks/:accountId`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#LinkBankAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `LinkBankAccount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/ebanks/SAMPLE_accountId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EBANKS.RECONNECT_ACCOUNT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/login/:loginId/token/reconnect`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#ReconnectAccount`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/login/SAMPLE_loginId/token/reconnect?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EBANKS.REFRESH_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/ebanks/refresh`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#RefreshAllEbankAccounts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IGetAllEbankAccountResponse[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ebanks/refresh?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EBANKS.REFREST_ACCOUNT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/yodlee/refresh/:ebankItemId`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#RefreshBankAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `requestObj` (see service `RefreshBankAccount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/refresh/SAMPLE_ebankItemId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `EBANKS.REMOVE_GIDDH_ACCOUNT`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/yodlee/ebanks/:ItemAccountId/unlink`
- **Source:** `settings.linked.accounts.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/ebanks/SAMPLE_ItemAccountId/unlink?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EBANKS.UNLINK_ACCOUNT`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/yodlee/ebanks/:accountId?accountUniqueName=:accountUniqueName`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#UnlinkBankAccount`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/ebanks/SAMPLE_accountId?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `EBANKS.UPDATE_DATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/yodlee/:accountId/eledgers?from=:date`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#UpdateDate`
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
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/SAMPLE_accountId/eledgers?from=SAMPLE_date&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_DISCOUNT_API.COMMON`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/discount`
- **Source:** `settings.discount.ts` · service: `settings.discount.service.ts#CreateDiscount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateDiscount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IDiscountList[]`
- `body as IDiscountList`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_DISCOUNT_API.PUT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/discount/:discountUniqueName`
- **Source:** `settings.discount.ts` · service: `settings.discount.service.ts#UpdateDiscount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateDiscount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IDiscountList`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/SAMPLE_discountUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.ADD_FINANCIAL_YEAR`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/financial-year`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#AddFinancialYear`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ fromYear }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ fromYear }'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.ADD_FUTURE_FINANCIAL_YEAR`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/future-financial-year`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#addFutureFinancialYear`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ fromYear }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/future-financial-year?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ fromYear }'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/financial-year`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.GET_FINANCIAL_YEAR_LIMITS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/financial-year-limits`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#getFinancialYearLimits`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year-limits?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.LOCK_FINANCIAL_YEAR`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/financial-year-lock`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#LockFinancialYear`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `reqObj` (see service `LockFinancialYear`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year-lock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.UNLOCK_FINANCIAL_YEAR`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/financial-year-unlock`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#UnlockFinancialYear`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `reqObj` (see service `UnlockFinancialYear`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year-unlock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_FINANCIAL_YEAR_API.UPDATE_FY_PERIOD`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/financial-year`
- **Source:** `settings.financial-year.api.ts` · service: `settings.financial-year.service.ts#UpdateFinancialYearPeriod`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dataToSend` (see service `UpdateFinancialYearPeriod`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.AMAZON_SELLER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/amazon/seller`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#AddAmazonSeller`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `AddAmazonSeller`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/amazon/seller?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.AMAZON_SELLER_OPERATION`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/amazon/seller/:sellerId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#UpdateAmazonSeller`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateAmazonSeller`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/amazon/seller/SAMPLE_sellerId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.AUTOCOLLECT_USER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/cashfree/autocollect/users`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#AddAutoCollectUser`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `AddAutoCollectUser`) | Request body: `model` (see service `UpdateAutoCollectUser`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/cashfree/autocollect/users?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.BANK_ACCOUNT_MULTI_REGISTRATION`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/bank/multi-registration`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#bankAccountMultiRegistration`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `bankAccountMultiRegistration`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/multi-registration?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/bank`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#bankAccountRegistration`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `bankAccountRegistration`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.BANK_INTERATION_VALIDATION_FORM`

- **Method:** `GET`
- **Path template:** `ui/bank/integration/form?bankName=:bankName`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#getValidationFormForBank`
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
  'https://api.giddh.com/ui/bank/integration/form?bankName=SAMPLE_bankName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.CASHFREE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/cashfree`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#SaveCashFreeDetail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SaveCashFreeDetail`) | Request body: `model` (see service `UpdateCashFreeDetail`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/cashfree?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.EMAIL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/email-key`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#SaveEmailKey`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/email-key?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.GET_BANK_ACCOUNT_PAYORS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor?amount=:amount`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#getBankAccountPayorsList`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankAccountUniqueName/payor?amount=SAMPLE_amount&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.GET_PAYOR_REGISTRATION_STATUS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:bankUserId/status`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#getPayorRegistrationStatus`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankAccountUniqueName/payor/SAMPLE_bankUserId/status?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.GET_PLAID_LINK_TOKEN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/plaid/create/link-token?itemId=:itemId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#if`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/plaid/create/link-token?itemId=SAMPLE_itemId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.GOCARDLESS.CREATE_END_USER_AGREEMENT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/gocardless/agreement-requisitions?institutionId=:institutionId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#createEndUserAgreementByInstitutionId`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `createEndUserAgreementByInstitutionId` argument: `''`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/agreement-requisitions?institutionId=SAMPLE_institutionId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.GOCARDLESS.DELETE_END_USER_AGREEMENT`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/gocardless/:agreementId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#deleteEndUserAgreementDetails`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/SAMPLE_agreementId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.GOCARDLESS.GET_ALL_INSTITUTIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gocardless/institutions?countryCode=:countryCode&page=:page&count=:count&refresh=true`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#getAllInstitutions`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/institutions?countryCode=IN&page=1&count=50&refresh=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.GOCARDLESS.GET_REQUISITION`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/gocardless/requisitions/:requisitionId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#getRequisition`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `getRequisition` argument: `''`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/requisitions/SAMPLE_requisitionId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.PAYMENT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/bank/registration`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#SavePaymentKey`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/registration?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.PAYMENT_GATEWAY`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/cashfree/payment-gateway`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#AddPaymentGateway`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `AddPaymentGateway`) | Request body: `model` (see service `UpdatePaymentGateway`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/cashfree/payment-gateway?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.PAYPAL`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/paypal`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#savePaypalDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `savePaypalDetails`) | Request body: `model` (see service `updatePaypalDetails`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as PaypalDetailsResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/paypal?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.PAYU_CRUD`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/payu`
- **Source:** `settings.integration.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/payu?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.RAZORPAY`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/razorpay`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#SaveRazorPayDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SaveRazorPayDetails`) | Request body: `model` (see service `UpdateRazorPayDetails`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as RazorPayDetailsResponse`
- `request (echoed by service)`

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

### `SETTINGS_INTEGRATION_API.REMOVE_ICICI_REQUEST`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/bank/deregistration?bankUserId=:bankUserId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#RemoveICICI`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/deregistration?bankUserId=SAMPLE_bankUserId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.SAVE_PLAID_ACCESS_TOKEN`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/plaid/create/access-token`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#savePlaidAccessToken`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `savePlaidAccessToken`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/plaid/create/access-token?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.SMS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/sms-key`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#SaveSMSKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SaveSMSKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sms-key?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.UPDATE_ACCOUNT`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/bank/:bankAccountUniqueName`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#updateAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateAccount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankAccountUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.UPDATE_PAYMENT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/bank/updateDetails`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#updatePaymentKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updatePaymentKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/updateDetails?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.UPDATE_PAYOR_ACCOUNT`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:bankUserId`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#updatePayorAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updatePayorAccount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankAccountUniqueName/payor/SAMPLE_bankUserId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.CREATE_TRIGGERS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/communication/trigger`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#createTrigger`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_PLATFORM`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/communication/platform/:platformUniqueName`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#deleteCommunicationPlatform`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/platform/SAMPLE_platformUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_TRIGGER`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/communication/trigger/:triggerUniqueName`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#deleteTrigger`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_FIELDS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/campaign/:slug/fields`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getCampaignFields`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/campaign/SAMPLE_slug/fields?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/campaign/list`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getCampaignList`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/campaign/list?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_FIELD_SUGGESTIONS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/suggestions/:platform/:entity`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getFieldSuggestions`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/suggestions/SAMPLE_platform/stock?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_PLATFORMS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getCommunicationPlatforms`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGER_FORM`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/platform/:platform/trigger/form`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getTriggerForm`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/platform/SAMPLE_platform/trigger/form?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/trigger`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getTriggersList`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS_BY_UNIQUENAME`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/communication/trigger/:triggerUniqueName`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#getTriggerByUniqueName`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGER_STATUS`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/communication/trigger/:triggerUniqueName`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#updateTriggerStatus`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `updateTriggerStatus`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGERS`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/communication/trigger/:triggerUniqueName`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#updateTrigger`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_COMMUNICATION_API.VERIFY_PLATFORM`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/communication/platform/verify`
- **Source:** `settings.integration.api.ts` · service: `campaign.integration.service.ts#verifyCommunicationPlatform`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `verifyCommunicationPlatform`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/platform/verify?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.ADD_PORTAL_DOMAIN`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/add-domain`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#addPortalDomain`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `addPortalDomain`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/add-domain?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.CREATE_BRANCH`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/branch`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.CREATE_NEW_ADDRESS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/address`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.CREATE_NEW_WAREHOUSE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/warehouse`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.DELETE_ADDRESS`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/address/:addressUniqueName`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/SAMPLE_addressUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.EDIT_WAREHOUSE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/warehouse/:warehouseUniqueName`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.GET`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#UpdateProfile`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateProfile`) | Request body: `model` (see service `UpdateInventory`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.GET_BRANCH_INFO`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/branch/:branchUniqueName`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#getBranchInfo`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch/SAMPLE_branchUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/address/all`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.GET_DOMAIN_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/get-domain-list`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#getDomainList`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/get-domain-list?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.GET_DOMAIN_LIST_DATA`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/get-domain-list?domainUniqueName=:domainUniqueName`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#getDomainListTableData`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/get-domain-list?domainUniqueName=SAMPLE_domainUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.GET_LINKED_ENTITIES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/sources`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sources?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PROFILE_API.GET_UPDATE_MODULE_EXPORT_SETTING`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/export-settings`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#updateModuleExportSetting`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateModuleExportSetting`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-settings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.PRIMARY_DELETE_DOMAIN_SET`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/domain/:domainUniqueName?operation=:operation`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#setPrimaryDeleteDomain`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `setPrimaryDeleteDomain` argument: `''`
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/domain/SAMPLE_domainUniqueName?operation=SAMPLE_operation&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.SHARE_PORTAL_DOMAIN`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/domain/:domainUniqueName/share`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#sharedDomainEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `sharedDomainEmail`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/domain/SAMPLE_domainUniqueName/share?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.SUBSCRIPTION_CHARGE`

- **Method:** `POST`
- **Path template:** `v2/subscription/charge/:subscriptionId`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#updateSubscriptionPayment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateSubscriptionPayment`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/charge/SAMPLE_subscriptionId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.UPDATE_ADDRESS`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/address/:addressUniqueName`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/SAMPLE_addressUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.UPDATE_BRANCH_INFO`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/branch/:branchUniqueName`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch/SAMPLE_branchUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.UPDATE_COMPANY_PLAN`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/plan`
- **Source:** `settings.profile.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/plan?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_PROFILE_API.VERIFY_PORTAL_WHITE_LABEL`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/verify-domain?domainUniqueName=:domainUniqueName`
- **Source:** `settings.profile.api.ts` · service: `settings.profile.service.ts#verifyPortalWhilteLabel`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/verify-domain?domainUniqueName=SAMPLE_domainUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_TAG_API.CREATE_TAG`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/tags`
- **Source:** `settings.tag.api.ts` · service: `settings.tag.service.ts#CreateTag`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateTag`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as TagRequest`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_TAG_API.DELETE_TAG`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/tags/:tagUniqueName`
- **Source:** `settings.tag.api.ts` · service: `settings.tag.service.ts#DeleteTag`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as TagRequest`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags/SAMPLE_tagUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_TAG_API.GET_ALL_TAGS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/tags`
- **Source:** `settings.tag.api.ts` · service: `settings.tag.service.ts#GetAllTags`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_TAG_API.UPDATE_TAG`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/tags/:tagUniqueName`
- **Source:** `settings.tag.api.ts` · service: `settings.tag.service.ts#UpdateTag`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `body` (see service `UpdateTag`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as TagRequest`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags/SAMPLE_tagUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `TRIGGER_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/triggers/:triggerUniqueName`
- **Source:** `settings.trigger.api.ts` · service: `settings.triggers.service.ts#DeleteTrigger`
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
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TRIGGER_API.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/triggers`
- **Source:** `settings.trigger.api.ts` · service: `settings.triggers.service.ts#GetTriggers`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `TRIGGER_API.POST`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/triggers`
- **Source:** `settings.trigger.api.ts` · service: `settings.triggers.service.ts#CreateTrigger`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateTrigger`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `TRIGGER_API.PUT`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/triggers/:triggerUniqueName`
- **Source:** `settings.trigger.api.ts` · service: `settings.triggers.service.ts#UpdateTrigger`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateTrigger`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `YODLEE_FASTLINK.ACCESS_TOKEN`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/yodlee/access-token`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#GetYodleeToken`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IAccessTokenResponse`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/access-token?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `YODLEE_FASTLINK.ADD_PROVIDER`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/yodlee/add-provider-account?providerId=:providerId`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#AddProvider`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `objToSend` (see service `AddProvider`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/add-provider-account?providerId=SAMPLE_providerId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `YODLEE_FASTLINK.GET_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/yodlee/yodlee-accounts`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#GetYodleeAccounts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/yodlee-accounts?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `YODLEE_FASTLINK.GET_BANK_SYNC_STATUS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/yodlee/status/:providerId`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#GetBankSyncStatus`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/status/SAMPLE_providerId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `YODLEE_FASTLINK.GET_LOGIN_FORM`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/yodlee/login-form/:providerId`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#GetLoginForm`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/login-form/SAMPLE_providerId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `YODLEE_FASTLINK.SEARCH_BANKS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/yodlee/search?name=:queryString`
- **Source:** `settings.linked.accounts.api.ts` · service: `settings.linked.accounts.service.ts#SearchBank`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/search?name=SAMPLE_queryString&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

