# Company & Branches

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **66**

---

### `COMPANY_API.BULK_PAYMENT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/bank/payments`
- **Source:** `company.api.ts` · service: `company.service.ts#bulkVendorPayment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `bankTransferRequest` (see service `bulkVendorPayment`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as BulkPaymentResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/payments?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.BULK_PAYMENT_CONFIRM`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/bank/payments/confirm?urn=:urn&uniqueName=:uniqueName`
- **Source:** `company.api.ts` · service: `company.service.ts#bulkVendorPaymentConfirm`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `requestObject` (see service `bulkVendorPaymentConfirm`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as BulkPaymentResponse`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/payments/confirm?urn=SAMPLE_urn&uniqueName=SAMPLE_UNIQUE&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.BULK_PAYMENT_RESEND_OTP`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/bank/resend-otp?urn=:urn&uniqueName=:uniqueName&requestId=:requestId`
- **Source:** `company.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/resend-otp?urn=SAMPLE_urn&uniqueName=SAMPLE_UNIQUE&requestId=SAMPLE_requestId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.BUSINESS_NATURE_LIST`

- **Method:** `GET`
- **Path template:** `business-nature`
- **Source:** `company.api.ts` · service: `company.service.ts#GetAllBusinessNatureList`
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
  'https://api.giddh.com/business-nature?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.COMPANY_LIST`

- **Method:** `GET`
- **Path template:** `users/:uniqueName/v2/companies`
- **Source:** `company.api.ts` · service: `company.service.ts#CompanyList`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as CompanyResponse[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/users/SAMPLE_UNIQUE/v2/companies?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.CREATE_COMPANY`

- **Method:** `POST`
- **Path template:** `company`
- **Source:** `company.api.ts` · service: `company.service.ts#CreateNewCompany`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `company` (see service `CreateNewCompany`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as CompanyResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.CREATE_NEW_BRANCH`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/branch`
- **Source:** `company.api.ts` · service: `company.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `requestPayload` (see service `if`)
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

### `COMPANY_API.CREATE_TAX_AUTHORITY`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/tax/authority`
- **Source:** `company.api.ts` · service: `settings.taxes.service.ts#createTaxAuthority`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createTaxAuthority`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.DELETE_TAX_AUTHORITY`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/tax/authority/:uniqueName`
- **Source:** `company.api.ts` · service: `settings.taxes.service.ts#deleteTaxAuthority`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.DOWNLOAD_CSV`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/download-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/download-account-closing-balance?from=01-04-2025&to=31-03-2026&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.DOWNLOAD_XLSX`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/download-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/download-account-closing-balance?from=01-04-2025&to=31-03-2026&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.EXPORT_SALES_ACCOUNT_WISE_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/us/export-sales-report-account-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName&taxUniqueName=:taxUniqueName`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/export-sales-report-account-wise?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&taxUniqueName=SAMPLE_taxUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.EXPORT_SALES_TAX_AUTHORITY_WISE_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/us/export-sales-report-authority-wise?from=:from&to=:to&taxNumber=:taxNumber`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/export-sales-report-authority-wise?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.EXPORT_SALES_TAX_WISE_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/us/export-sales-report-tax-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/export-sales-report-tax-wise?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_ACCOUNT_COUNTRIES`

- **Method:** `GET`
- **Path template:** `country/company/:companyUniqueName/account-countries`
- **Source:** `company.api.ts` · service: `company.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as any[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/country/company/dcrcdiin17887749442630bsy43/account-countries?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_ALL_BRANCHES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/branch?hierarchyType=:hierarchyType`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch?hierarchyType=SAMPLE_hierarchyType&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_ALL_STATES`

- **Method:** `GET`
- **Path template:** `country/:country`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/country/SAMPLE_country?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_ALL_TAX_AUTHORITIES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/tax/authority`
- **Source:** `company.api.ts` · service: `settings.taxes.service.ts#getTaxAuthorityList`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_ALL_TAXES`

- **Method:** `GET`
- **Path template:** `ui/taxes?country=:country`
- **Source:** `company.api.ts` · service: `settings.taxes.service.ts#getTaxList`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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

### `COMPANY_API.GET_COMPANY_INTEGRATED_BANK_LIST`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/payment/banks/accounts`
- **Source:** `company.api.ts` · service: `company.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/payment/banks/accounts?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_COMPANY_USER`

- **Method:** `GET`
- **Path template:** `users/:userUniqueName/company-uer?companyUniqueName=:companyUniqueName`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/users/SAMPLE_USER/company-uer?companyUniqueName=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_COMPANY_USERS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/users`
- **Source:** `company.api.ts` · service: `company.service.ts#getComapnyUsers`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountSharedWithResponse[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/users?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_COUNTRY_LIST_BY_SUBSCRIPTION_ID`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/country-list`
- **Source:** `company.api.ts` · service: `company.service.ts#countryListBySubscriptionId`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as CompanyResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/country-list?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_DETAILED_REGISTERED_PURCHASE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/purchases-register-detailed?`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/purchases-register-detailed?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_DETAILED_REGISTERED_SALES`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/sales-register-detailed?`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/sales-register-detailed?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_OTP`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/bank/generateotp?bankUserId=:bankUserId`
- **Source:** `company.api.ts` · service: `company.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IRegistration`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/generateotp?bankUserId=SAMPLE_bankUserId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_REGISTERED_PURCHASE`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/purchases-register-overview?from=:fromDate&to=:toDate&interval=:interval`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/purchases-register-overview?from=SAMPLE_fromDate&to=SAMPLE_toDate&interval=SAMPLE_interval&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_REGISTERED_PURCHASE_V2`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/v2/purchases-register-overview?from=:from&to=:to`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/v2/purchases-register-overview?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_REGISTERED_SALES`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/sales-register-overview?from=:fromDate&to=:toDate&interval=:interval`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/sales-register-overview?from=SAMPLE_fromDate&to=SAMPLE_toDate&interval=SAMPLE_interval&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_REGISTERED_SALES_V2`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/v2/sales-register-overview?from=:from&to=:to`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/v2/sales-register-overview?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_SALES_TAX_ACCOUNT_WISE_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/us/sales-report-account-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName&taxUniqueName=:taxUniqueName&page=:page&count=:count`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/sales-report-account-wise?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&taxUniqueName=SAMPLE_taxUniqueName&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_SALES_TAX_AUTHORITY_WISE_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/us/sales-report-authority-wise?from=:from&to=:to&taxNumber=:taxNumber&page=:page&count=:count`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/sales-report-authority-wise?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_SALES_TAX_WISE_REPORT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/us/sales-report-tax-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName&page=:page&count=:count`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/sales-report-tax-wise?from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_SIDE_BAR_ITEM`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/ui_side_bar_items`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ui_side_bar_items?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.GET_STATE_DETAILS`

- **Method:** `GET`
- **Path template:** `state-details?companyUniqueName=:companyUniqueName`
- **Source:** `company.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/state-details?companyUniqueName=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.RAZORPAY_ORDERID`

- **Method:** `GET`
- **Path template:** `subscription/generateOrder?amount=:amount&currency=:currency`
- **Source:** `company.api.ts` · service: `company.service.ts#getRazorPayOrderId`
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
  'https://api.giddh.com/subscription/generateOrder?amount=SAMPLE_amount&currency=SAMPLE_currency&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.REGISTER_ACCOUNT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/bank/`
- **Source:** `company.api.ts` · service: `company.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IRegistration`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `COMPANY_API.SEND_DATA`

- **Method:** `POST`
- **Path template:** `send-data`
- **Source:** `company.api.ts` · service: `company.service.ts#SocketCreateCompany`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `company` (see service `SocketCreateCompany`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/send-data?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.SEND_EMAIL`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/email-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`
- **Source:** `company.api.ts` · service: `company.service.ts#sendEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `sendEmail` argument: `request.data`
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/email-account-closing-balance?from=01-04-2025&to=31-03-2026&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.SEND_NEW_USER_INFO`

- **Method:** `POST`
- **Path template:** `users/send-new-user-info`
- **Source:** `company.api.ts` · service: `company.service.ts#sendNewUserInfo`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `sendNewUserInfo`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/users/send-new-user-info?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.SEND_SMS`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/sms-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`
- **Source:** `company.api.ts` · service: `company.service.ts#sendSms`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `sendSms` argument: `request.data`
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/sms-account-closing-balance?from=01-04-2025&to=31-03-2026&sortBy=&sort=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.SET_STATE_DETAILS`

- **Method:** `POST`
- **Path template:** `state-details`
- **Source:** `company.api.ts` · service: `company.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `stateDetails` (see service `if`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/state-details?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.TAX`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/tax`
- **Source:** `company.api.ts` · service: `settings.taxes.service.ts#CreateTax`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateTax`) | Request body: `model` (see service `UpdateTax`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as TaxResponse[]`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.UNIVERSAL_DATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/entry-settings`
- **Source:** `company.api.ts` · service: `company.service.ts#setApplicationDate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `dateObj` (see service `setApplicationDate`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/entry-settings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_API.UPDATE_TAX_AUTHORITY`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/tax/authority/:uniqueName`
- **Source:** `company.api.ts` · service: `settings.taxes.service.ts#updateTaxAuthority`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateTaxAuthority`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority/SAMPLE_UNIQUE?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_IMPORT_EXPORT_API.EXPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/export`
- **Source:** `company-import-export.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_IMPORT_EXPORT_API.EXPORT_LEDGERS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/export-ledgers-v2?from=:from&to=:to`
- **Source:** `company-import-export.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-ledgers-v2?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_IMPORT_EXPORT_API.IMPORT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/import`
- **Source:** `company-import-export.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/import?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `COMPANY_IMPORT_EXPORT_API.IMPORT_LEDGERS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/import-ledgers`
- **Source:** `company-import-export.api.ts` · service: `company-import-export-service.ts#ImportLedgersRequest`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `formData` (see service `ImportLedgersRequest`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/import-ledgers?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_BRANCH_API.CREATE_BRANCHES`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/set-branches`
- **Source:** `settings.branch.api.ts` · service: `settings.branch.service.ts#CreateBranches`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateBranches`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/set-branches?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_BRANCH_API.GET_ALL_BRANCHES`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/children?from=:from&to=:to`
- **Source:** `settings.branch.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/children?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_BRANCH_API.GET_PARENT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/parent`
- **Source:** `settings.branch.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/parent?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_BRANCH_API.REMOVE_BRANCH`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/child/:childUniqueName`
- **Source:** `settings.branch.api.ts` · service: `settings.branch.service.ts#RemoveBranch`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/child/SAMPLE_childUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_BRANCH_API.UPDATE_BRANCH_STATUS`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/branch/:branchUniqueName`
- **Source:** `settings.branch.api.ts` · service: `settings.branch.service.ts#updateBranchStatus`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateBranchStatus`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch/SAMPLE_branchUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_COMPANY_AUTH_KEY_API.COMMON`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName`
- **Source:** `settings.company-auth-key.ts` · service: `settings.discount.service.ts#CreateDiscount`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_COMPANY_AUTH_KEY_API.CREATE_AUTH_KEY`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/auth/generate`
- **Source:** `settings.company-auth-key.ts` · service: `settings.company-auth-key.service.ts#createAuthKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createAuthKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICompanyAuthKey`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/generate?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_COMPANY_AUTH_KEY_API.DELETE_AUTH_KEY`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/auth/:authKeyUniqueName/remove`
- **Source:** `settings.company-auth-key.ts` · service: `settings.company-auth-key.service.ts#deleteAuthKey`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/SAMPLE_authKeyUniqueName/remove?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_COMPANY_AUTH_KEY_API.GET_ALL_AUTH_KEYS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/auth/all`
- **Source:** `settings.company-auth-key.ts` · service: `settings.company-auth-key.service.ts#getAllAuthKeys`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICompanyAuthKey[]`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/all?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_COMPANY_AUTH_KEY_API.GET_AUTH_KEY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/auth/:authKeyUniqueName`
- **Source:** `settings.company-auth-key.ts` · service: `settings.company-auth-key.service.ts#getAuthKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICompanyAuthKey`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/SAMPLE_authKeyUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_COMPANY_AUTH_KEY_API.UPDATE_AUTH_KEY`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/auth/:authKeyUniqueName/update`
- **Source:** `settings.company-auth-key.ts` · service: `settings.company-auth-key.service.ts#updateAuthKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateAuthKey`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as ICompanyAuthKey`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/SAMPLE_authKeyUniqueName/update?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `WAREHOUSE_API.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/warehouse`
- **Source:** `warehouse.constant.ts` · service: `settings.warehouse.service.ts#createWarehouse`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `params` (see service `createWarehouse`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

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

### `WAREHOUSE_API.FETCH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/warehouse?page=:page&refresh=true`
- **Source:** `warehouse.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse?page=1&refresh=true&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `WAREHOUSE_API.GET_WAREHOUSE_DETAILS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/warehouse/:warehouseUniqueName`
- **Source:** `warehouse.constant.ts` · service: `settings.warehouse.service.ts#getWarehouseDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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

### `WAREHOUSE_API.SET_DEFAULT_WAREHOUSE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/warehouse/:warehouseUniqueName/default`
- **Source:** `warehouse.constant.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName/default?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `WAREHOUSE_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/warehouse/:warehouseUniqueName`
- **Source:** `warehouse.constant.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `WAREHOUSE_API.UPDATE_WAREHOUSE_STATUS`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName/warehouse/:warehouseUniqueName`
- **Source:** `warehouse.constant.ts` · service: `settings.warehouse.service.ts#updateWarehouseStatus`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateWarehouseStatus`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

