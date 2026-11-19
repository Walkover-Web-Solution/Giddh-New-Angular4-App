# Backend-Verified Frontend APIs: 03-accounts-groups.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/export-account-statement?from=:from&to=:to&q=:query`

- **Frontend id:** `ACCOUNT_STATEMENT_API.EXPORT_ACCOUNT_STATEMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#exportAccountStatement`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerControllerV2#exportAccountStatement
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerControllerV2.java:181`
- **Deprecated:** No

Export Account Statement

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `sort` — type: `String`; optional; default: `asc`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`
- `q` — type: `String`; optional; default: ``
- `fileType` — type: `String`; optional; default: `xlsx`

#### Controller-backed request payload

Type: `EntryFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `groupUniqueNames` | `Set<String>` | not declared | unconstrained |
| `accountUniqueNames` | `Set<String>` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `includeSalesPersons` | `Boolean` | not declared | unconstrained |
| `includeAmount` | `Boolean` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `amountGreaterThan` | `Boolean` | not declared | unconstrained |
| `amountLessThan` | `Boolean` | not declared | unconstrained |
| `amountEqualTo` | `Boolean` | not declared | unconstrained |
| `includeDescription` | `Boolean` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `vouchers` | `Set<String>` | not declared | unconstrained |
| `includeVouchers` | `Boolean` | not declared | unconstrained |
| `includeParticulars` | `Boolean` | not declared | unconstrained |
| `particulars` | `Set<String>` | not declared | unconstrained |
| `isInvoiceGenerated` | `Boolean` | not declared | unconstrained |
| `includeTag` | `Boolean` | not declared | unconstrained |
| `tags` | `Set<String>` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `dateOnCheque` | `String` | not declared | unconstrained |
| `inventory` | `InventoryReportFilter` | not declared | unconstrained |
| `cancelledEntries` | `Boolean` | not declared | unconstrained |
| `balanceTypeAsSign` | `Boolean` | not declared | unconstrained |
| `chequeDate` | `LocalDate` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "groupUniqueNames": [],
  "accountUniqueNames": [],
  "salesPersonUniqueNames": [],
  "includeSalesPersons": false,
  "includeAmount": false,
  "amount": 0,
  "amountGreaterThan": false,
  "amountLessThan": false,
  "amountEqualTo": false,
  "includeDescription": false,
  "description": "string",
  "vouchers": [],
  "includeVouchers": false,
  "includeParticulars": false,
  "particulars": [],
  "isInvoiceGenerated": false,
  "includeTag": false,
  "tags": [],
  "chequeNumber": "string",
  "dateOnCheque": "string",
  "inventory": "string",
  "cancelledEntries": false,
  "balanceTypeAsSign": false,
  "chequeDate": "01-04-2025",
  "selectAllFields": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `fileResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "fileResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `SQL` | `SQLException` | SQLException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EXECUTION",
  "message": "Execution"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/export-account-statement?branchUniqueName=aaaa&sort=asc&from=01-04-2025&to=31-03-2026&accountCurrency=true&lang=StaticMessageSource.DEFAULT_LANG&q=&fileType=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/view-statement?count=:count&lang=en&from=:from&to=:to&sort=:sort&page=:page&q=:q`

- **Frontend id:** `ACCOUNT_STATEMENT_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#getAccountStatementList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerControllerV2#accountStatementWithAdvanceSearch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerControllerV2.java:156`
- **Deprecated:** No

Account Statement With Advance Search

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `sort` — type: `String`; optional; default: `asc`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `EntryFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `groupUniqueNames` | `Set<String>` | not declared | unconstrained |
| `accountUniqueNames` | `Set<String>` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `includeSalesPersons` | `Boolean` | not declared | unconstrained |
| `includeAmount` | `Boolean` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `amountGreaterThan` | `Boolean` | not declared | unconstrained |
| `amountLessThan` | `Boolean` | not declared | unconstrained |
| `amountEqualTo` | `Boolean` | not declared | unconstrained |
| `includeDescription` | `Boolean` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `vouchers` | `Set<String>` | not declared | unconstrained |
| `includeVouchers` | `Boolean` | not declared | unconstrained |
| `includeParticulars` | `Boolean` | not declared | unconstrained |
| `particulars` | `Set<String>` | not declared | unconstrained |
| `isInvoiceGenerated` | `Boolean` | not declared | unconstrained |
| `includeTag` | `Boolean` | not declared | unconstrained |
| `tags` | `Set<String>` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `dateOnCheque` | `String` | not declared | unconstrained |
| `inventory` | `InventoryReportFilter` | not declared | unconstrained |
| `cancelledEntries` | `Boolean` | not declared | unconstrained |
| `balanceTypeAsSign` | `Boolean` | not declared | unconstrained |
| `chequeDate` | `LocalDate` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "groupUniqueNames": [],
  "accountUniqueNames": [],
  "salesPersonUniqueNames": [],
  "includeSalesPersons": false,
  "includeAmount": false,
  "amount": 0,
  "amountGreaterThan": false,
  "amountLessThan": false,
  "amountEqualTo": false,
  "includeDescription": false,
  "description": "string",
  "vouchers": [],
  "includeVouchers": false,
  "includeParticulars": false,
  "particulars": [],
  "isInvoiceGenerated": false,
  "includeTag": false,
  "tags": [],
  "chequeNumber": "string",
  "dateOnCheque": "string",
  "inventory": "string",
  "cancelledEntries": false,
  "balanceTypeAsSign": false,
  "chequeDate": "01-04-2025",
  "selectAllFields": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedAccStatement`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedAccStatement"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `SQL` | `SQLException` | SQLException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EXECUTION",
  "message": "Execution"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/view-statement?branchUniqueName=aaaa&page=1&count=50&sort=asc&from=01-04-2025&to=31-03-2026&accountCurrency=true&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/view-statement?count=:count&lang=en&from=:from&to=:to&sort=:sort&page=:page&q=:q`

- **Frontend id:** `ACCOUNT_STATEMENT_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#getAccountStatementList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerControllerV2#viewStatement
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerControllerV2.java:129`
- **Deprecated:** No

View Statement

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `sort` — type: `String`; optional; default: `asc`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `q` — type: `String`; optional; default: ``
- `accountCurrency` — type: `boolean`; optional; default: `true`
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedAccStatement`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedAccStatement"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EXECUTION",
  "message": "Execution"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/view-statement?branchUniqueName=aaaa&page=1&count=50&sort=asc&from=01-04-2025&to=31-03-2026&q=&accountCurrency=true&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/groups/:groupUniqueName/accounts`

- **Frontend id:** `ACCOUNTS_API_V2.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#CreateAccountV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountWithGroupV2Controller#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountWithGroupV2Controller.java:52`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `groupUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `AccountResourceV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `applicableTaxesUniqueNames` | `List<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `accountEmail` | `String` | not declared | unconstrained |
| `accountMobileNo` | `String` | not declared | unconstrained |
| `accountAttentionTo` | `String` | not declared | unconstrained |
| `emailList` | `Set<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `mobileCode` | `String` | not declared | unconstrained |
| `importedAccountOpeningBalance` | `List<AccountOpeningBalance>` | not declared | unconstrained |
| `currentBranch` | `Branch` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `duePeriod` | `Long` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "applicableTaxesUniqueNames": [],
  "accountUniqueName": "string",
  "accountName": "string",
  "groupUniqueName": "string",
  "accountEmail": "string",
  "accountMobileNo": "string",
  "accountAttentionTo": "string",
  "emailList": [],
  "tagNames": [],
  "rowNum": "string",
  "mobileCode": "string",
  "importedAccountOpeningBalance": [],
  "currentBranch": "string",
  "ledgerView": "T_VIEW",
  "duePeriod": 0,
  "salesPersonUniqueName": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `ac`

```json
{
  "status": "success",
  "body": {
    "reference": "ac"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NO_PERMISSION` | `NoPermissionException` | NoPermissionException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/accounts?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"applicableTaxesUniqueNames":[],"accountUniqueName":"string","accountName":"string","groupUniqueName":"string","accountEmail":"string","accountMobileNo":"string","accountAttentionTo":"string","emailList":[],"tagNames":[],"rowNum":"string","mobileCode":"string","importedAccountOpeningBalance":[],"currentBranch":"string","ledgerView":"T_VIEW","duePeriod":0,"salesPersonUniqueName":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/accounts/:accountUniqueName?source=:source`

- **Frontend id:** `ACCOUNTS_API_V2.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#GetAccountDetailsV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#getActiveAccountV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:70`
- **Deprecated:** No

Get Active Account V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `invoiceType` — type: `String`; optional; default: ``
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `accountResourceV2`

```json
{
  "status": "success",
  "body": {
    "reference": "accountResourceV2"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "IO",
  "message": "IO"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa&invoiceType=&lang=StaticMessageSource.DEFAULT_LANG&source=APP' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /v2/company/:companyUniqueName/groups/:groupUniqueName/accounts/:accountUniqueName`

- **Frontend id:** `ACCOUNTS_API_V2.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#UpdateAccountV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountWithGroupV2Controller#updateAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountWithGroupV2Controller.java:99`
- **Deprecated:** No

Update Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `AccountResourceV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `applicableTaxesUniqueNames` | `List<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `accountEmail` | `String` | not declared | unconstrained |
| `accountMobileNo` | `String` | not declared | unconstrained |
| `accountAttentionTo` | `String` | not declared | unconstrained |
| `emailList` | `Set<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `mobileCode` | `String` | not declared | unconstrained |
| `importedAccountOpeningBalance` | `List<AccountOpeningBalance>` | not declared | unconstrained |
| `currentBranch` | `Branch` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `duePeriod` | `Long` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "applicableTaxesUniqueNames": [],
  "accountUniqueName": "string",
  "accountName": "string",
  "groupUniqueName": "string",
  "accountEmail": "string",
  "accountMobileNo": "string",
  "accountAttentionTo": "string",
  "emailList": [],
  "tagNames": [],
  "rowNum": "string",
  "mobileCode": "string",
  "importedAccountOpeningBalance": [],
  "currentBranch": "string",
  "ledgerView": "T_VIEW",
  "duePeriod": 0,
  "salesPersonUniqueName": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `Object (not statically resolved)`

```json
{
  "status": "success",
  "body": {
    "status": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"applicableTaxesUniqueNames":[],"accountUniqueName":"string","accountName":"string","groupUniqueName":"string","accountEmail":"string","accountMobileNo":"string","accountAttentionTo":"string","emailList":[],"tagNames":[],"rowNum":"string","mobileCode":"string","importedAccountOpeningBalance":[],"currentBranch":"string","ledgerView":"T_VIEW","duePeriod":0,"salesPersonUniqueName":"string"}'
```

---

### `PATCH /v2/company/:companyUniqueName/accounts/:accountUniqueName`

- **Frontend id:** `ACCOUNTS_API_V2.UPDATE_WITH_ACCOUNT_UNIQUE_NAME`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#UpdateAccountWithoutGroupUniqueName`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#updateAccountV2Patch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:110`
- **Deprecated:** No

Update Account V2Patch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `AccountRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `hsnNumber` | `String` | not declared | unconstrained |
| `sacNumber` | `String` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `accountOpeningBalances` | `List<AccountOpeningBalanceResource>` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `currency` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `openingBalanceDate` | `String` | not declared | unconstrained |
| `isActive` | `int` | not declared | unconstrained |
| `closingBalanceTriggerAmount` | `BigDecimal` | not declared | unconstrained |
| `closingBalanceTriggerAmountType` | `String` | not declared | unconstrained |
| `company` | `Company` | not declared | unconstrained |
| `attentionTo` | `String` | not declared | unconstrained |
| `mobileNo` | `String` | not declared | unconstrained |
| `city` | `String` | not declared | unconstrained |
| `companyName` | `String` | not declared | unconstrained |
| `pincode` | `String` | not declared | unconstrained |
| `archive` | `Boolean` | not declared | unconstrained |
| `country` | `Country` | not declared | unconstrained |
| `emails` | `Set<String>` | not declared | unconstrained |
| `addresses` | `List<AccountAddresses>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `accountBankDetails` | `List<AccountBankDetails>` | not declared | unconstrained |
| `mobileCode` | `String` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `duePeriod` | `Integer` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "hsnNumber": "string",
  "sacNumber": "string",
  "email": "string",
  "name": "string",
  "accountOpeningBalances": [],
  "uniqueName": "string",
  "currency": "string",
  "description": "string",
  "openingBalanceDate": "string",
  "isActive": 0,
  "closingBalanceTriggerAmount": 0,
  "closingBalanceTriggerAmountType": "string",
  "company": "string",
  "attentionTo": "string",
  "mobileNo": "string",
  "city": "string",
  "companyName": "string",
  "pincode": "string",
  "archive": false,
  "country": "string",
  "emails": [],
  "addresses": [],
  "tagNames": [],
  "accountBankDetails": [],
  "mobileCode": "string",
  "ledgerView": "T_VIEW",
  "duePeriod": 0,
  "salesPersonUniqueName": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new AccountResourceV2(account`

```json
{
  "status": "success",
  "body": {
    "applicableTaxesUniqueNames": [],
    "accountUniqueName": "string",
    "accountName": "string",
    "groupUniqueName": "string",
    "accountEmail": "string",
    "accountMobileNo": "string",
    "accountAttentionTo": "string",
    "emailList": [],
    "tagNames": [],
    "rowNum": "string",
    "mobileCode": "string",
    "importedAccountOpeningBalance": [],
    "currentBranch": "string",
    "ledgerView": "T_VIEW",
    "duePeriod": 0,
    "salesPersonUniqueName": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountResponseV2`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"hsnNumber":"string","sacNumber":"string","email":"string","name":"string","accountOpeningBalances":[],"uniqueName":"string","currency":"string","description":"string","openingBalanceDate":"string","isActive":0,"closingBalanceTriggerAmount":0,"closingBalanceTriggerAmountType":"string","company":"string","attentionTo":"string","mobileNo":"string","city":"string","companyName":"string","pincode":"string","archive":false,"country":"string","emails":[],"addresses":[],"tagNames":[],"accountBankDetails":[],"mobileCode":"string","ledgerView":"T_VIEW","duePeriod":0,"salesPersonUniqueName":"string"}'
```

---

### `DELETE /company/:companyUniqueName/uer/:assignRoleEntryUniqueName`

- **Frontend id:** `ACCOUNTS_API.CHANGE_PERMISSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#UnShare; apps/web-giddh/src/app/services/account.service.ts#UpdateEntityPermission; apps/web-giddh/src/app/services/account.service.ts#AccountUnshare`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserEntityRoleV2Controller#deleteUserEntityRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserEntityRoleV2Controller.java:70`
- **Deprecated:** No

Delete User Entity Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `entityRoleUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Role revoked successfully from user(s)."`

```json
{
  "status": "success",
  "body": "Role revoked successfully from user(s)."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uer/SAMPLE_entityRoleUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/uer/:assignRoleEntryUniqueName`

- **Frontend id:** `ACCOUNTS_API.CHANGE_PERMISSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#UnShare; apps/web-giddh/src/app/services/account.service.ts#UpdateEntityPermission; apps/web-giddh/src/app/services/account.service.ts#AccountUnshare`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserEntityRoleV2Controller#updateUserEntityRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserEntityRoleV2Controller.java:58`
- **Deprecated:** No

Update User Entity Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `entityRoleUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RoleV2AssignModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `emailId` | `String` | not declared | unconstrained |
| `from` | `String` | not declared | unconstrained |
| `to` | `String` | not declared | unconstrained |
| `duration` | `Integer` | not declared | unconstrained |
| `period` | `String` | not declared | unconstrained |
| `allowedIps` | `Set<String>` | not declared | unconstrained |
| `allowedCidrs` | `Set<String>` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `roleName` | `String` | not declared | unconstrained |
| `roleUniqueName` | `String` | not declared | unconstrained |
| `userName` | `String` | not declared | unconstrained |
| `userEmail` | `String` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `fromDateObj` | `LocalDate` | not declared | unconstrained |
| `toDateObj` | `LocalDate` | not declared | unconstrained |
| `mobileVerified` | `boolean` | not declared | unconstrained |
| `mobileNumber` | `String` | not declared | unconstrained |
| `userIsSubscriber` | `boolean` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `comingFromAdminPanel` | `boolean` | not declared | unconstrained |
| `reGenerateAuthKey` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "emailId": "string",
  "from": "string",
  "to": "string",
  "duration": 0,
  "period": "string",
  "allowedIps": [],
  "allowedCidrs": [],
  "entity": "string",
  "entityUniqueName": "string",
  "roleName": "string",
  "roleUniqueName": "string",
  "userName": "string",
  "userEmail": "string",
  "userUniqueName": "string",
  "uniqueName": "string",
  "fromDateObj": "01-04-2025",
  "toDateObj": "01-04-2025",
  "mobileVerified": false,
  "mobileNumber": "string",
  "userIsSubscriber": false,
  "companyUniqueName": "string",
  "comingFromAdminPanel": false,
  "reGenerateAuthKey": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uer`

```json
{
  "status": "success",
  "body": {
    "reference": "uer"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uer/SAMPLE_entityRoleUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"emailId":"string","from":"string","to":"string","duration":0,"period":"string","allowedIps":[],"allowedCidrs":[],"entity":"string","entityUniqueName":"string","roleName":"string","roleUniqueName":"string","userName":"string","userEmail":"string","userUniqueName":"string","uniqueName":"string","fromDateObj":"01-04-2025","toDateObj":"01-04-2025","mobileVerified":false,"mobileNumber":"string","userIsSubscriber":false,"companyUniqueName":"string","comingFromAdminPanel":false,"reGenerateAuthKey":false}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/contacts`

- **Frontend id:** `ACCOUNTS_API.CREATE_UPDATE_DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#getPortalUsers; apps/web-giddh/src/app/services/account.service.ts#createPortalUser`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#getCustomerVendorContact
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:326`
- **Deprecated:** No

Get Customer Vendor Contact

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `contactRequests`

```json
{
  "status": "success",
  "body": {
    "reference": "contactRequests"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/contacts?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/contacts`

- **Frontend id:** `ACCOUNTS_API.CREATE_UPDATE_DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#getPortalUsers; apps/web-giddh/src/app/services/account.service.ts#createPortalUser`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#addAndUpdateCustomerVendorContact
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:312`
- **Deprecated:** No

Add And Update Customer Vendor Contact

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `List<ContactRequest>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |
| `contactNo` | `String` | not declared | unconstrained |
| `operationType` | `OperationType` | not declared | SENT_OTP, RESENT_OTP, PAYMENT |
| `isDefault` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "email": "string",
  "contactNo": "string",
  "operationType": "SENT_OTP",
  "isDefault": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `response`

```json
{
  "status": "success",
  "body": {
    "reference": "response"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/contacts?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","email":"string","contactNo":"string","operationType":"SENT_OTP","isDefault":false}'
```

---

### `DELETE /company/:companyUniqueName/accounts/:accountUniqueName`

- **Frontend id:** `ACCOUNTS_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#DeleteAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#deleteAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:98`
- **Deprecated:** No

Delete Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.account.delete", StaticMessageSource.getLanguage(language`

```json
{
  "status": "success",
  "body": "success.account.delete"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/flatten-accounts?q=:q&page=:page&count=:count`

- **Frontend id:** `ACCOUNTS_API.FLATTEN_ACCOUNTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#getFlattenAccounts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getFlattenAccounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:255`
- **Deprecated:** No

Get Flatten Accounts

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResult`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResult"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as FlattenAccountsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/flatten-accounts?q=&page=1&count=0&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/merge`

- **Frontend id:** `ACCOUNTS_API.MERGE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#MergeAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#mergeAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:155`
- **Deprecated:** No

Merge Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `List<Account>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `openingBalanceType` | `String` | Pattern(regexp = "cr|dr", message = "Invalid opening balance type") | unconstrained |
| `uniqueName` | `String` | Pattern(regexp = "[a-z0-9!#@.$%&'*+=?^_`|\\[\\]~-]+", message = "Unique Name must contain only lowercase characters, numbers and special characters !#@.$%'*+=?^_`[]~-"), Size(min = 1, max = 100, message = "Account unique name can not be blank or more than 100 character"), NotNull(message = "Account unique name can not be null") | unconstrained |
| `name` | `String` | Size(min = 1, max = 100, message = "Account name can not be blank or more than 100 character"), NotNull(message = "Account name can not be null") | unconstrained |
| `closingBalanceTriggerAmount` | `BigDecimal` | not declared | unconstrained |
| `closingBalanceTriggerAmountType` | `String` | Pattern(regexp = "cr|dr", message = "Invalid Closing balance trigger amount type") | unconstrained |
| `archiveStatus` | `ArchiveStatus` | not declared | SYSTEM_ARCHIVED, ARCHIVED |
| `vendorContacts` | `List<VendorContact>` | not declared | unconstrained |
| `discounts` | `List<Discount>` | not declared | unconstrained |
| `applicableDiscounts` | `Set<Discount>` | not declared | unconstrained |
| `isFixed` | `Boolean` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `salesPerson` | `SalesPerson` | not declared | unconstrained |

Example:

```json
{
  "openingBalanceType": "string",
  "uniqueName": "string",
  "name": "string",
  "closingBalanceTriggerAmount": 0,
  "closingBalanceTriggerAmountType": "string",
  "archiveStatus": "SYSTEM_ARCHIVED",
  "vendorContacts": [],
  "discounts": [],
  "applicableDiscounts": [],
  "isFixed": false,
  "ledgerView": "T_VIEW",
  "salesPerson": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.account.merge", StaticMessageSource.getLanguage(language`

```json
{
  "status": "success",
  "body": "success.account.merge"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/merge?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"openingBalanceType":"string","uniqueName":"string","name":"string","closingBalanceTriggerAmount":0,"closingBalanceTriggerAmountType":"string","archiveStatus":"SYSTEM_ARCHIVED","vendorContacts":[],"discounts":[],"applicableDiscounts":[],"isFixed":false,"ledgerView":"T_VIEW","salesPerson":"string"}'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/move`

- **Frontend id:** `ACCOUNTS_API.MOVE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#AccountMove`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#moveAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:198`
- **Deprecated:** No

Move Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `Group` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | NotNull(message = "Group name can not be null."), Size(min = 1, max = 100, message = "size of name must be between 1 and 100") | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | Pattern(regexp = "[a-z0-9!#@.$%&'*+=?^_`|\\[\\]~-]+", message = "Unique Name must contain only lowercase characters, numbers and special characters !#@.$%'*+=?^_`[]~-"), Size(min = 1, max = 100), NotNull(message = "Group uniqueName can not be null.") | unconstrained |
| `synonyms` | `Synonym` | not declared | unconstrained |
| `isFixed` | `Boolean` | not declared | unconstrained |
| `ssnNumber` | `String` | not declared | unconstrained |
| `hsnNumber` | `String` | not declared | unconstrained |
| `closingBalanceTriggerAmount` | `BigDecimal` | not declared | unconstrained |
| `closingBalanceTriggerAmountType` | `String` | Pattern(regexp = "cr|dr", message = "Invalid Closing balance trigger amount type") | unconstrained |
| `applicableDiscounts` | `Set<Discount>` | not declared | unconstrained |
| `emails` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "description": "string",
  "uniqueName": "string",
  "synonyms": "string",
  "isFixed": false,
  "ssnNumber": "string",
  "hsnNumber": "string",
  "closingBalanceTriggerAmount": 0,
  "closingBalanceTriggerAmountType": "string",
  "applicableDiscounts": [],
  "emails": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.account.move", StaticMessageSource.getLanguage(language`

```json
{
  "status": "success",
  "body": "success.account.move"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/move?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","description":"string","uniqueName":"string","synonyms":"string","isFixed":false,"ssnNumber":"string","hsnNumber":"string","closingBalanceTriggerAmount":0,"closingBalanceTriggerAmountType":"string","applicableDiscounts":[],"emails":[]}'
```

---

### `POST /company/:companyUniqueName/role/:roleUniqueName/assign`

- **Frontend id:** `ACCOUNTS_API.SHARE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#AccountShare; apps/web-giddh/src/app/services/account.service.ts#Share`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleV2Controller#assignRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleV2Controller.java:102`
- **Deprecated:** No

Assign Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `roleUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RoleV2AssignModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `emailId` | `String` | not declared | unconstrained |
| `from` | `String` | not declared | unconstrained |
| `to` | `String` | not declared | unconstrained |
| `duration` | `Integer` | not declared | unconstrained |
| `period` | `String` | not declared | unconstrained |
| `allowedIps` | `Set<String>` | not declared | unconstrained |
| `allowedCidrs` | `Set<String>` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `roleName` | `String` | not declared | unconstrained |
| `roleUniqueName` | `String` | not declared | unconstrained |
| `userName` | `String` | not declared | unconstrained |
| `userEmail` | `String` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `fromDateObj` | `LocalDate` | not declared | unconstrained |
| `toDateObj` | `LocalDate` | not declared | unconstrained |
| `mobileVerified` | `boolean` | not declared | unconstrained |
| `mobileNumber` | `String` | not declared | unconstrained |
| `userIsSubscriber` | `boolean` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `comingFromAdminPanel` | `boolean` | not declared | unconstrained |
| `reGenerateAuthKey` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "emailId": "string",
  "from": "string",
  "to": "string",
  "duration": 0,
  "period": "string",
  "allowedIps": [],
  "allowedCidrs": [],
  "entity": "string",
  "entityUniqueName": "string",
  "roleName": "string",
  "roleUniqueName": "string",
  "userName": "string",
  "userEmail": "string",
  "userUniqueName": "string",
  "uniqueName": "string",
  "fromDateObj": "01-04-2025",
  "toDateObj": "01-04-2025",
  "mobileVerified": false,
  "mobileNumber": "string",
  "userIsSubscriber": false,
  "companyUniqueName": "string",
  "comingFromAdminPanel": false,
  "reGenerateAuthKey": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uer`

```json
{
  "status": "success",
  "body": {
    "reference": "uer"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role/SAMPLE_roleUniqueName/assign?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"emailId":"string","from":"string","to":"string","duration":0,"period":"string","allowedIps":[],"allowedCidrs":[],"entity":"string","entityUniqueName":"string","roleName":"string","roleUniqueName":"string","userName":"string","userEmail":"string","userUniqueName":"string","uniqueName":"string","fromDateObj":"01-04-2025","toDateObj":"01-04-2025","mobileVerified":false,"mobileNumber":"string","userIsSubscriber":false,"companyUniqueName":"string","comingFromAdminPanel":false,"reGenerateAuthKey":false}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/shared-with`

- **Frontend id:** `ACCOUNTS_API.SHARED_WITH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#AccountShareWith`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#getSharedList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:213`
- **Deprecated:** No

Get Shared List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `sharedUserList`

```json
{
  "status": "success",
  "body": {
    "reference": "sharedUserList"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountSharedWithResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/shared-with?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy`

- **Frontend id:** `ACCOUNTS_API.TAX_HIERARCHY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#GetTaxHierarchy`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#getTaxesAccountHierarchy
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:280`
- **Deprecated:** No

Get Taxes Account Hierarchy

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `accountService.getAllActiveTaxOfAccounts(principal, account, request`

```json
{
  "status": "success",
  "body": {
    "status": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountsTaxHierarchyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/tax-hierarchy?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/un-merge`

- **Frontend id:** `ACCOUNTS_API.UNMERGE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#UnmergeAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#unmergeAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:170`
- **Deprecated:** No

Unmerge Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `UnMergeRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueNames` | `List<String>` | not declared | unconstrained |
| `moveTo` | `String` | not declared | unconstrained |

Example:

```json
{
  "uniqueNames": [],
  "moveTo": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `Object (not statically resolved)`

```json
{
  "status": "success",
  "body": {
    "status": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/un-merge?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueNames":[],"moveTo":"string"}'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName`

- **Frontend id:** `ACCOUNTS_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#UpdateAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#updateAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:114`
- **Deprecated:** No

Update Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `AccountResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `applicableTaxesUniqueNames` | `List<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `accountEmail` | `String` | not declared | unconstrained |
| `accountMobileNo` | `String` | not declared | unconstrained |
| `accountAttentionTo` | `String` | not declared | unconstrained |
| `accounts` | `List<Account>` | not declared | unconstrained |
| `addresses` | `List<AccountAddresses>` | not declared | unconstrained |
| `address` | `AccountAddresses` | not declared | unconstrained |
| `emailList` | `Set<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `mobileCode` | `String` | not declared | unconstrained |

Example:

```json
{
  "applicableTaxesUniqueNames": [],
  "accountUniqueName": "string",
  "accountName": "string",
  "groupUniqueName": "string",
  "accountEmail": "string",
  "accountMobileNo": "string",
  "accountAttentionTo": "string",
  "accounts": [],
  "addresses": [],
  "address": "string",
  "emailList": [],
  "tagNames": [],
  "mobileCode": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new AccountResource(account`

```json
{
  "status": "success",
  "body": {
    "applicableTaxesUniqueNames": [],
    "accountUniqueName": "string",
    "accountName": "string",
    "groupUniqueName": "string",
    "accountEmail": "string",
    "accountMobileNo": "string",
    "accountAttentionTo": "string",
    "accounts": [],
    "addresses": [],
    "address": "string",
    "emailList": [],
    "tagNames": [],
    "mobileCode": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AccountResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"applicableTaxesUniqueNames":[],"accountUniqueName":"string","accountName":"string","groupUniqueName":"string","accountEmail":"string","accountMobileNo":"string","accountAttentionTo":"string","accounts":[],"addresses":[],"address":"string","emailList":[],"tagNames":[],"mobileCode":"string"}'
```

---

### `POST /company/:companyUniqueName/discount/assign`

- **Frontend id:** `APPLY_DISCOUNT_API.APPLY_DISCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#ApplyDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DiscountController#assignedDiscounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DiscountController.java:89`
- **Deprecated:** No

Assigned Discounts

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `AssignDiscountRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `assignedDiscounts`

```json
{
  "status": "success",
  "body": {
    "reference": "assignedDiscounts"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/assign?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /company/:companyUniqueName/discount/assign-v2`

- **Frontend id:** `APPLY_DISCOUNT_API.APPLY_DISCOUNTS_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#applyDiscounts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DiscountController#assignDiscountV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DiscountController.java:128`
- **Deprecated:** No

API to assign discounts on group / account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `List<AssignDiscountRequestV2>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `isAccount` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "discounts": [],
  "uniqueName": "string",
  "isAccount": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `appliedDiscounts`

```json
{
  "status": "success",
  "body": {
    "reference": "appliedDiscounts"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/assign-v2?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"discounts":[],"uniqueName":"string","isAccount":false}'
```

---

### `GET /company/:companyUniqueName/discount/assign/list?accountUniqueName=:accountUniqueName`

- **Frontend id:** `APPLY_DISCOUNT_API.GET_APPLY_DISCOUNT_API`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#GetApplyDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DiscountController#getAllAssignedDiscountList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DiscountController.java:100`
- **Deprecated:** No

Get All Assigned Discount List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `assignedDiscounts`

```json
{
  "status": "success",
  "body": {
    "reference": "assignedDiscounts"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/assign/list?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/tax/assign`

- **Frontend id:** `APPLY_TAX_API.APPLY_TAX`
- **Frontend evidence:** `apps/web-giddh/src/app/services/account.service.ts#ApplyTax`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#assignTaxesOnGroupsAndAccounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:92`
- **Deprecated:** No

Assign Taxes On Groups And Accounts

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `List<AssignTaxRequest>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueName` | `String` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `isAccount` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "uniqueName": "string",
  "taxes": [],
  "isAccount": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("tax.assign.success.message"`

```json
{
  "status": "success",
  "body": "tax.assign.success.message"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/assign?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueName":"string","taxes":[],"isAccount":false}'
```

---

### `POST /v2/company/:companyUniqueName/accounts/:accountUniqueName/report-comment`

- **Frontend id:** `CONTACT_API.ADD_COMMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#addComment; apps/web-giddh/src/app/services/contact.service.ts#deleteComment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#addComment
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:132`
- **Deprecated:** No

Add Comment

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `ReportCommentResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `reportCommentResource`

```json
{
  "status": "success",
  "body": {
    "reference": "reportCommentResource"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/report-comment?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /v2/company/:companyUniqueName/accounts/:accountUniqueName/report-comment`

- **Frontend id:** `CONTACT_API.ADD_COMMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#addComment; apps/web-giddh/src/app/services/contact.service.ts#deleteComment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#deleteComment
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:148`
- **Deprecated:** No

Delete Comment

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Comment deleted successfully."`

```json
{
  "status": "success",
  "body": "Comment deleted successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/report-comment?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/gocardless/refresh?accountUniqueName=:accountUniqueName`

- **Frontend id:** `CONTACT_API.GOCARDLESS_BANK_TRANSACTIONS_REFRESH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#refreshGoCardlessBankTransactions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoCardlessBankIntegrationController#fetchAccountTransactionsOnRefresh
- **Backend source:** `src/main/java/com/giddh/api/controllers/GoCardlessBankIntegrationController.java:103`
- **Deprecated:** No

Fetch Account Transactions On Refresh

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`
- `accountUniqueName` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.refresh.transaction"`

```json
{
  "status": "success",
  "body": "success.refresh.transaction"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/refresh?lang=DEFAULT_LANG&accountUniqueName=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/accounts/send-mail`

- **Frontend id:** `CONTACT_API.SEND_EMAIL_TEMPLATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/contact.service.ts#sendBulkEmailTemplate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#sendMailToCustomerVendor
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:206`
- **Deprecated:** No

Send Mail To Customer Vendor

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `CommunicationResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `title` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `entityUniqueNames` | `Set<String>` | not declared | unconstrained |
| `voucherTypes` | `Set<String>` | not declared | unconstrained |
| `emailSubject` | `String` | not declared | unconstrained |
| `triggerModule` | `TriggerModule` | not declared | VOUCHER_DUE, LEDGER_WITH_CLOSING_BALANCE, LEDGER_BALANCE |
| `to` | `Set<String>` | not declared | unconstrained |
| `cc` | `Set<String>` | not declared | unconstrained |
| `bcc` | `Set<String>` | not declared | unconstrained |
| `replyTo` | `Set<String>` | not declared | unconstrained |
| `conditions` | `Map<ConditionEnum, KeyValueImpl>` | not declared | unconstrained |
| `executionTime` | `TriggerExecutionTime` | not declared | unconstrained |
| `actions` | `Set<ActionEnum>` | not declared | ATTACH_VOUCHER_PDF, ATTACH_LEDGER, ADD_ATTACHMENT |
| `html` | `String` | not declared | unconstrained |
| `disabled` | `boolean` | not declared | unconstrained |
| `sendMail` | `boolean` | not declared | unconstrained |
| `templateOf` | `String` | not declared | unconstrained |

Example:

```json
{
  "title": "string",
  "entity": "string",
  "entityUniqueNames": [],
  "voucherTypes": [],
  "emailSubject": "string",
  "triggerModule": "VOUCHER_DUE",
  "to": [],
  "cc": [],
  "bcc": [],
  "replyTo": [],
  "conditions": {},
  "executionTime": "string",
  "actions": [
    "ATTACH_VOUCHER_PDF"
  ],
  "html": "string",
  "disabled": false,
  "sendMail": false,
  "templateOf": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("mail.delivery.notification"`

```json
{
  "status": "success",
  "body": "mail.delivery.notification"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/send-mail?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"title":"string","entity":"string","entityUniqueNames":[],"voucherTypes":[],"emailSubject":"string","triggerModule":"VOUCHER_DUE","to":[],"cc":[],"bcc":[],"replyTo":[],"conditions":{},"executionTime":"string","actions":["ATTACH_VOUCHER_PDF"],"html":"string","disabled":false,"sendMail":false,"templateOf":"string"}'
```

---

### `POST /company/:companyUniqueName/groups`

- **Frontend id:** `GROUP_API.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#CreateGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:91`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `GroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `applicableTaxesUniqueNames` | `List<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |

Example:

```json
{
  "applicableTaxesUniqueNames": [],
  "tagNames": [],
  "rowNum": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new GroupResource(createdGroup`

```json
{
  "status": "success",
  "body": {
    "applicableTaxesUniqueNames": [],
    "tagNames": [],
    "rowNum": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GroupResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"applicableTaxesUniqueNames":[],"tagNames":[],"rowNum":"string"}'
```

---

### `POST /company/:companyUniqueName/custom-fields`

- **Frontend id:** `GROUP_API.CREATE_COMPANY_CUSTOM_FIELD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#createCompanyCustomField; apps/web-giddh/src/app/services/group.service.ts#getCompanyCustomField`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#setCustomFields
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:916`
- **Deprecated:** No

Set Custom Fields

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `List<CompanyCustomFieldVersionResource>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `key` | `String` | not declared | unconstrained |
| `dataType` | `String` | not declared | unconstrained |
| `valueLength` | `int` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "key": "string",
  "dataType": "string",
  "valueLength": 0,
  "uniqueName": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `responseList`

```json
{
  "status": "success",
  "body": {
    "reference": "responseList"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/custom-fields?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"key":"string","dataType":"string","valueLength":0,"uniqueName":"string"}'
```

---

### `GET /company/:companyUniqueName/custom-fields`

- **Frontend id:** `GROUP_API.CREATE_COMPANY_CUSTOM_FIELD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#createCompanyCustomField; apps/web-giddh/src/app/services/group.service.ts#getCompanyCustomField`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getCustomFields
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:936`
- **Deprecated:** No

API to fetch custom fields on the company

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `resourceList`

```json
{
  "status": "success",
  "body": {
    "reference": "resourceList"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/custom-fields?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/groups/:groupUniqueName`

- **Frontend id:** `GROUP_API.DELETE_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#DeleteGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupController#deleteGroup
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:169`
- **Deprecated:** No

Delete Group

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.group.delete"`

```json
{
  "status": "success",
  "body": "success.group.delete"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "IO",
  "message": "IO"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/groups/:groupUniqueName`

- **Frontend id:** `GROUP_API.GET_GROUP_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#GetGroupDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#getGroupV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:356`
- **Deprecated:** No

Get Group V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new GroupResourceV2(group`

```json
{
  "status": "success",
  "body": {
    "applicableTaxesUniqueNames": [],
    "tagNames": [],
    "rowNum": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/groups/:groupUniqueName/masters?page=:page&count=:count`

- **Frontend id:** `GROUP_API.GET_MASTERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#getMasters`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: MastersController#groupMasters
- **Backend source:** `src/main/java/com/giddh/api/controllers/MastersController.java:46`
- **Deprecated:** No

Group Masters

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`
- `accountArchiveStatus` — type: `String`; optional; default: `UNARCHIVED`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/masters?page=1&count=10&accountArchiveStatus=UNARCHIVED&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/top-shared-groups`

- **Frontend id:** `GROUP_API.GET_TOP_SHARED_GROUPS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#getTopSharedGroups`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: MastersController#topSharedGroups
- **Backend source:** `src/main/java/com/giddh/api/controllers/MastersController.java:106`
- **Deprecated:** No

Top Shared Groups

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GroupResponse`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/top-shared-groups?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/groups-with-accounts?q=:q`

- **Frontend id:** `GROUP_API.GROUPS_WITH_ACCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#getGroupsWithAccounts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getGroupsWithAccountsNew
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:349`
- **Deprecated:** No

Get Groups With Accounts New

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `refresh` — type: `boolean`; optional; default: `false`
- `accountArchiveStatus` — type: `String`; optional; default: `UNARCHIVED`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyService.order(groups`

```json
{
  "status": "success",
  "body": {
    "status": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups-with-accounts?q=&refresh=false&accountArchiveStatus=UNARCHIVED&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/groups/:groupUniqueName/move`

- **Frontend id:** `GROUP_API.MOVE_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#MoveGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupController#moveGroups
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:186`
- **Deprecated:** No

Move Groups

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `Group` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | NotNull(message = "Group name can not be null."), Size(min = 1, max = 100, message = "size of name must be between 1 and 100") | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | Pattern(regexp = "[a-z0-9!#@.$%&'*+=?^_`|\\[\\]~-]+", message = "Unique Name must contain only lowercase characters, numbers and special characters !#@.$%'*+=?^_`[]~-"), Size(min = 1, max = 100), NotNull(message = "Group uniqueName can not be null.") | unconstrained |
| `synonyms` | `Synonym` | not declared | unconstrained |
| `isFixed` | `Boolean` | not declared | unconstrained |
| `ssnNumber` | `String` | not declared | unconstrained |
| `hsnNumber` | `String` | not declared | unconstrained |
| `closingBalanceTriggerAmount` | `BigDecimal` | not declared | unconstrained |
| `closingBalanceTriggerAmountType` | `String` | Pattern(regexp = "cr|dr", message = "Invalid Closing balance trigger amount type") | unconstrained |
| `applicableDiscounts` | `Set<Discount>` | not declared | unconstrained |
| `emails` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "description": "string",
  "uniqueName": "string",
  "synonyms": "string",
  "isFixed": false,
  "ssnNumber": "string",
  "hsnNumber": "string",
  "closingBalanceTriggerAmount": 0,
  "closingBalanceTriggerAmountType": "string",
  "applicableDiscounts": [],
  "emails": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new GroupAccountResource(group`

```json
{
  "status": "success",
  "body": {
    "type": "GroupAccountResource"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "IO",
  "message": "IO"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as MoveGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/move?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","description":"string","uniqueName":"string","synonyms":"string","isFixed":false,"ssnNumber":"string","hsnNumber":"string","closingBalanceTriggerAmount":0,"closingBalanceTriggerAmountType":"string","applicableDiscounts":[],"emails":[]}'
```

---

### `GET /company/:companyUniqueName/group-search`

- **Frontend id:** `GROUP_API.SEARCH_GROUPS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#searchGroups`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: SearchController#groupSearch
- **Backend source:** `src/main/java/com/giddh/api/controllers/SearchController.java:121`
- **Deprecated:** No

Group Search

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `removeTop` — type: `boolean`; optional; default: `false`
- `onlyTop` — type: `boolean`; optional; default: `false`
- `includeSearchedGroup` — type: `boolean`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/group-search?q=&group=&removeTop=false&onlyTop=false&includeSearchedGroup=false&page=1&count=20&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/groups/:groupUniqueName/shared-with`

- **Frontend id:** `GROUP_API.SHARED_WITH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#ShareWithGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupController#getSharedList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:204`
- **Deprecated:** No

Get Shared List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `sharedUserList`

```json
{
  "status": "success",
  "body": {
    "reference": "sharedUserList"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GroupSharedWithResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/shared-with?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy`

- **Frontend id:** `GROUP_API.TAX_HIERARCHY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#GetTaxHierarchy`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupController#getTaxesAccountHierarchy
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:228`
- **Deprecated:** No

Get Taxes Account Hierarchy

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `groupService.getAllActiveTaxOfGroup(principal, group, request`

```json
{
  "status": "success",
  "body": {
    "status": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GroupsTaxHierarchyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/tax-hierarchy?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/groups/:groupUniqueName`

- **Frontend id:** `GROUP_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/group.service.ts#UpdateGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupController#updateGroup
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:152`
- **Deprecated:** No

Update Group

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `GroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `applicableTaxesUniqueNames` | `List<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |

Example:

```json
{
  "applicableTaxesUniqueNames": [],
  "tagNames": [],
  "rowNum": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new GroupResource(updatedGroup`

```json
{
  "status": "success",
  "body": {
    "applicableTaxesUniqueNames": [],
    "tagNames": [],
    "rowNum": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"applicableTaxesUniqueNames":[],"tagNames":[],"rowNum":"string"}'
```

---

### `PUT /company/:companyUniqueName/groups/:groupUniqueName`

- **Frontend id:** `GROUP_API.UPDATE_GROUP`
- **Frontend evidence:** `group.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: GroupController#updateGroup
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GroupController.java:152`
- **Deprecated:** No

Update Group

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `GroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `applicableTaxesUniqueNames` | `List<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |

Example:

```json
{
  "applicableTaxesUniqueNames": [],
  "tagNames": [],
  "rowNum": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new GroupResource(updatedGroup`

```json
{
  "status": "success",
  "body": {
    "applicableTaxesUniqueNames": [],
    "tagNames": [],
    "rowNum": "string"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"applicableTaxesUniqueNames":[],"tagNames":[],"rowNum":"string"}'
```

---

### `GET /company/:companyUniqueName/salesperson`

- **Frontend id:** `SALES_PERSON_API`
- **Frontend evidence:** `sales.person.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: SalesPersonController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/SalesPersonController.java:72`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `archive` — type: `Boolean`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResult`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResult"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/salesperson?page=1&count=20&archive=SAMPLE_archive&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/account-search-2`

- **Frontend id:** `SEARCH_API.ACCOUNT_SEARCH_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/search.service.ts#searchAccountV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: SearchController#accountSearch2
- **Backend source:** `src/main/java/com/giddh/api/controllers/SearchController.java:148`
- **Deprecated:** No

Account Search2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `exceptGroups` — type: `String`; optional; default: ``
- `includeSearchedGroup` — type: `boolean`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/account-search-2?q=&group=&exceptGroups=&includeSearchedGroup=false&page=1&count=20&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/v3/account-search`

- **Frontend id:** `SEARCH_API.ACCOUNT_SEARCH_V3`
- **Frontend evidence:** `apps/web-giddh/src/app/services/search.service.ts#searchAccountV3`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: SearchController#accountSearchV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/SearchController.java:99`
- **Deprecated:** No

Account Search V3

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `withStocks` — type: `boolean`; optional; default: `false`
- `stockAccountUniqueName` — type: `String`; optional; default: ``
- `accountUniqueName` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EXECUTION",
  "message": "Execution"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v3/account-search?q=&group=&page=1&count=50&withStocks=false&stockAccountUniqueName=&accountUniqueName=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/groups/:groupName/account-closing-balance?count=:count&from=:from&to=:to&refresh=:refresh&page=:page`

- **Frontend id:** `SEARCH_API.SEARCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/search.service.ts#Search`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#calculateAccountBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:85`
- **Deprecated:** No

Calculate Account Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`

#### Controller-backed request payload

Type: `BalanceFilterParams` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `openingBalance` | `BigDecimal` | not declared | unconstrained |
| `openingBalanceType` | `String` | not declared | unconstrained |
| `openingBalanceGreaterThan` | `Boolean` | not declared | unconstrained |
| `openingBalanceLessThan` | `Boolean` | not declared | unconstrained |
| `openingBalanceEqual` | `Boolean` | not declared | unconstrained |
| `openingBalanceNotEqual` | `Boolean` | not declared | unconstrained |
| `closingBalance` | `BigDecimal` | not declared | unconstrained |
| `closingBalanceType` | `String` | not declared | unconstrained |
| `closingBalanceGreaterThan` | `Boolean` | not declared | unconstrained |
| `closingBalanceLessThan` | `Boolean` | not declared | unconstrained |
| `closingBalanceEqual` | `Boolean` | not declared | unconstrained |
| `closingBalanceNotEqual` | `Boolean` | not declared | unconstrained |
| `creditTotal` | `BigDecimal` | not declared | unconstrained |
| `creditTotalGreaterThan` | `Boolean` | not declared | unconstrained |
| `creditTotalLessThan` | `Boolean` | not declared | unconstrained |
| `creditTotalEqual` | `Boolean` | not declared | unconstrained |
| `creditTotalNotEqual` | `Boolean` | not declared | unconstrained |
| `debitTotal` | `BigDecimal` | not declared | unconstrained |
| `debitTotalGreaterThan` | `Boolean` | not declared | unconstrained |
| `debitTotalLessThan` | `Boolean` | not declared | unconstrained |
| `debitTotalEqual` | `Boolean` | not declared | unconstrained |
| `debitTotalNotEqual` | `Boolean` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `sortType` | `String` | not declared | unconstrained |
| `message` | `String` | not declared | unconstrained |
| `accounts` | `Set<String>` | not declared | unconstrained |
| `subject` | `String` | not declared | unconstrained |
| `includeParentGroup` | `Boolean` | not declared | unconstrained |
| `includeMobileNumber` | `Boolean` | not declared | unconstrained |
| `includeEmailId` | `Boolean` | not declared | unconstrained |
| `includeState` | `Boolean` | not declared | unconstrained |
| `includeTaxNumber` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "openingBalance": 0,
  "openingBalanceType": "string",
  "openingBalanceGreaterThan": false,
  "openingBalanceLessThan": false,
  "openingBalanceEqual": false,
  "openingBalanceNotEqual": false,
  "closingBalance": 0,
  "closingBalanceType": "string",
  "closingBalanceGreaterThan": false,
  "closingBalanceLessThan": false,
  "closingBalanceEqual": false,
  "closingBalanceNotEqual": false,
  "creditTotal": 0,
  "creditTotalGreaterThan": false,
  "creditTotalLessThan": false,
  "creditTotalEqual": false,
  "creditTotalNotEqual": false,
  "debitTotal": 0,
  "debitTotalGreaterThan": false,
  "debitTotalLessThan": false,
  "debitTotalEqual": false,
  "debitTotalNotEqual": false,
  "sort": "string",
  "sortBy": "string",
  "sortType": "string",
  "message": "string",
  "accounts": [],
  "subject": "string",
  "includeParentGroup": false,
  "includeMobileNumber": false,
  "includeEmailId": false,
  "includeState": false,
  "includeTaxNumber": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResult`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResult"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/account-closing-balance?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&refresh=false&page=1&count=0' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"openingBalance":0,"openingBalanceType":"string","openingBalanceGreaterThan":false,"openingBalanceLessThan":false,"openingBalanceEqual":false,"openingBalanceNotEqual":false,"closingBalance":0,"closingBalanceType":"string","closingBalanceGreaterThan":false,"closingBalanceLessThan":false,"closingBalanceEqual":false,"closingBalanceNotEqual":false,"creditTotal":0,"creditTotalGreaterThan":false,"creditTotalLessThan":false,"creditTotalEqual":false,"creditTotalNotEqual":false,"debitTotal":0,"debitTotalGreaterThan":false,"debitTotalLessThan":false,"debitTotalEqual":false,"debitTotalNotEqual":false,"sort":"string","sortBy":"string","sortType":"string","message":"string","accounts":[],"subject":"string","includeParentGroup":false,"includeMobileNumber":false,"includeEmailId":false,"includeState":false,"includeTaxNumber":false}'
```

