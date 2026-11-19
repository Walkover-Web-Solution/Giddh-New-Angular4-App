# Accounts & Groups

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **47**

---

### `ACCOUNT_STATEMENT_API.EXPORT_ACCOUNT_STATEMENT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/export-account-statement?from=:from&to=:to&q=:query`
- **Source:** `contact.api.ts` · service: `contact.service.ts#exportAccountStatement`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `exportAccountStatement` argument: `requestObj.payload`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/export-account-statement?from=01-04-2025&to=31-03-2026&q=SAMPLE_query&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNT_STATEMENT_API.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/view-statement?count=:count&lang=en&from=:from&to=:to&sort=:sort&page=:page&q=:q`
- **Source:** `contact.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/view-statement?count=50&lang=en&from=01-04-2025&to=31-03-2026&sort=&page=1&q=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API_V2.CREATE`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/accounts`
- **Source:** `account.api.ts` · service: `account.service.ts#CreateAccountV2`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateAccountV2`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/accounts?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API_V2.GET`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName?source=:source`
- **Source:** `account.api.ts` · service: `account.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?source=SAMPLE_source&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API_V2.UPDATE`

- **Method:** `PUT`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName/accounts/:accountUniqueName`
- **Source:** `account.api.ts` · service: `account.service.ts#UpdateAccountV2`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateAccountV2`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API_V2.UPDATE_WITH_ACCOUNT_UNIQUE_NAME`

- **Method:** `PATCH`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName`
- **Source:** `account.api.ts` · service: `account.service.ts#UpdateAccountWithoutGroupUniqueName`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateAccountWithoutGroupUniqueName`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API.CHANGE_PERMISSION`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/uer/:assignRoleEntryUniqueName`
- **Source:** `account.api.ts` · service: `account.service.ts#UpdateEntityPermission`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateEntityPermission`) | { user }
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uer/SAMPLE_assignRoleEntryUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API.CREATE_UPDATE_DELETE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/contacts`
- **Source:** `account.api.ts` · service: `account.service.ts#getPortalUsers`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/contacts?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API.DELETE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName`
- **Source:** `account.api.ts` · service: `account.service.ts#DeleteAccount`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API.FLATTEN_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/flatten-accounts?q=:q&page=:page&count=:count`
- **Source:** `account.api.ts` · service: `account.service.ts#if`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as FlattenAccountsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/flatten-accounts?q=&page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API.MERGE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/merge`
- **Source:** `account.api.ts` · service: `account.service.ts#MergeAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `MergeAccount`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/merge?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API.MOVE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/move`
- **Source:** `account.api.ts` · service: `account.service.ts#AccountMove`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `AccountMove`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/move?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API.SHARE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/role/:roleUniqueName/assign`
- **Source:** `account.api.ts` · service: `account.service.ts#Share`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `AccountShare`) | Request body: `model` (see service `Share`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role/SAMPLE_roleUniqueName/assign?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API.SHARED_WITH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/shared-with`
- **Source:** `account.api.ts` · service: `account.service.ts#AccountShareWith`
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
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/shared-with?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API.TAX_HIERARCHY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy`
- **Source:** `account.api.ts` · service: `account.service.ts#GetTaxHierarchy`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountsTaxHierarchyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/tax-hierarchy?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `ACCOUNTS_API.UNMERGE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName/un-merge`
- **Source:** `account.api.ts` · service: `account.service.ts#UnmergeAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UnmergeAccount`)
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/un-merge?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `ACCOUNTS_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/accounts/:accountUniqueName`
- **Source:** `account.api.ts` · service: `account.service.ts#UpdateAccount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateAccount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AccountResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `APPLY_DISCOUNT_API.APPLY_DISCOUNT`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/discount/assign`
- **Source:** `apply-discount.api.ts` · service: `account.service.ts#ApplyDiscount`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `ApplyDiscount`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/assign?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `APPLY_DISCOUNT_API.APPLY_DISCOUNTS_V2`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/discount/assign-v2`
- **Source:** `apply-discount.api.ts` · service: `account.service.ts#applyDiscounts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `applyDiscounts`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/assign-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `APPLY_DISCOUNT_API.GET_APPLY_DISCOUNT_API`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/discount/assign/list?accountUniqueName=:accountUniqueName`
- **Source:** `apply-discount.api.ts` · service: `account.service.ts#GetApplyDiscount`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/assign/list?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `APPLY_TAX_API.APPLY_TAX`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/tax/assign`
- **Source:** `apply-tax.api.ts` · service: `account.service.ts#ApplyTax`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `mod` (see service `ApplyTax`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/assign?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `CONTACT_API.ADD_COMMENT`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/accounts/:accountUniqueName/report-comment`
- **Source:** `contact.api.ts` · service: `contact.service.ts#addComment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ description }
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/report-comment?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ description }'
```

---

### `CONTACT_API.GOCARDLESS_BANK_TRANSACTIONS_REFRESH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gocardless/refresh?accountUniqueName=:accountUniqueName`
- **Source:** `contact.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/refresh?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `CONTACT_API.SEND_EMAIL_TEMPLATE`

- **Method:** `POST`
- **Path template:** `v2/company/:companyUniqueName/accounts/send-mail`
- **Source:** `contact.api.ts` · service: `contact.service.ts#sendBulkEmailTemplate`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `sendBulkEmailTemplate`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/send-mail?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GROUP_API.CREATE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/groups`
- **Source:** `group.api.ts` · service: `group.service.ts#CreateGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GROUP_API.CREATE_COMPANY_CUSTOM_FIELD`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/custom-fields`
- **Source:** `group.api.ts` · service: `group.service.ts#createCompanyCustomField`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createCompanyCustomField`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/custom-fields?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GROUP_API.DELETE_GROUP`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName`
- **Source:** `group.api.ts` · service: `group.service.ts#DeleteGroup`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.FLATTEN_GROUP_WITH_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/flatten-groups-with-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups`
- **Source:** `group.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/flatten-groups-with-accounts?q=&page=1&count=50&showEmptyGroups=SAMPLE_showEmptyGroups&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.FLATTEN_GROUPS_ACCOUNTS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/groups/flatten-groups-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups`
- **Source:** `group.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/flatten-groups-accounts?q=&page=1&count=50&showEmptyGroups=SAMPLE_showEmptyGroups&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.GET_GROUP_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupUniqueName`
- **Source:** `group.api.ts` · service: `group.service.ts#GetGroupDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.GET_MASTERS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName/masters?page=:page&count=:count`
- **Source:** `group.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/masters?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.GET_TOP_SHARED_GROUPS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/top-shared-groups`
- **Source:** `group.api.ts` · service: `group.service.ts#getTopSharedGroups`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupResponse`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/top-shared-groups?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.GROUPS_WITH_ACCOUNT`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/groups-with-accounts?q=:q`
- **Source:** `group.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups-with-accounts?q=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.MOVE_GROUP`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName/move`
- **Source:** `group.api.ts` · service: `group.service.ts#MoveGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `modele` (see service `MoveGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as MoveGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/move?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GROUP_API.SEARCH_GROUPS`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/group-search`
- **Source:** `group.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/group-search?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GROUP_API.SHARED_WITH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName/shared-with`
- **Source:** `group.api.ts` · service: `group.service.ts#ShareWithGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupSharedWithResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/shared-with?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.TAX_HIERARCHY`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy`
- **Source:** `group.api.ts` · service: `group.service.ts#GetTaxHierarchy`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupsTaxHierarchyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/tax-hierarchy?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GROUP_API.UNSHARE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName/unshare`
- **Source:** `group.api.ts` · service: `group.service.ts#UnShareGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ user }
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/unshare?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ user }'
```

---

### `GROUP_API.UPDATE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName`
- **Source:** `group.api.ts` · service: `group.service.ts#UpdateGroup`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `modele` (see service `UpdateGroup`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as GroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GROUP_API.UPDATE_GROUP`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/groups/:groupUniqueName`
- **Source:** `group.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SALES_PERSON_API`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/salesperson`
- **Source:** `sales.person.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/salesperson?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SALES_PERSON_ARCHIVE_API`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/salesperson/:uniqueName/archive`
- **Source:** `sales.person.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/salesperson/SAMPLE_UNIQUE/archive?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SEARCH_API.ACCOUNT_DETAIL`

- **Method:** `POST`
- **Path template:** `:version/company/:companyUniqueName/particular/:accountUniqueName`
- **Source:** `search.api.ts`
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
  'https://api.giddh.com/SAMPLE_version/company/dcrcdiin17887749442630bsy43/particular/SAMPLE_ACCOUNT?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SEARCH_API.ACCOUNT_SEARCH`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/:version/account-search`
- **Source:** `search.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/SAMPLE_version/account-search?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SEARCH_API.ACCOUNT_SEARCH_V2`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/account-search-2`
- **Source:** `search.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/account-search-2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SEARCH_API.ACCOUNT_SEARCH_V3`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/v3/account-search`
- **Source:** `search.api.ts`
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
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v3/account-search?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SEARCH_API.SEARCH`

- **Method:** `GET`
- **Path template:** `v2/company/:companyUniqueName/groups/:groupName/account-closing-balance?count=:count&from=:from&to=:to&refresh=:refresh&page=:page`
- **Source:** `search.api.ts` · service: `inventory.service.ts#searchInventory`
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
  'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_groupName/account-closing-balance?count=50&from=01-04-2025&to=31-03-2026&refresh=true&page=1&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

