# Backend-Verified Frontend APIs: 06-purchase.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/pettycash-manager/:uniqueName?action=:actionType&accountUniqueName=:accountUniqueName`

- **Frontend id:** `EXPENSE_API.ACTION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/expences.service.ts#actionPettycashReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PettyCashManagerController#action; accounting-microservice: PettyCashManagerController#action
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/pettycashmanager/PettyCashManagerController.java:66`
- **Deprecated:** No

Action

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `entryUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `accountUniqueName` — type: `String`; optional
- `action` — type: `String`; required

#### Controller-backed request payload

Type: `PettyCashEntryActionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `ledgerRequest` | `LedgerRequest` | not declared | unconstrained |
| `message` | `String` | not declared | unconstrained |

Example:

```json
{
  "ledgerRequest": "string",
  "message": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `message`

```json
{
  "status": "success",
  "body": {
    "reference": "message"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/SAMPLE_ENTRY?branchUniqueName=aaaa&accountUniqueName=SAMPLE_ACCOUNT&action=SAMPLE_action' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"ledgerRequest":"string","message":"string"}'
```

---

### `POST /company/:companyUniqueName/pettycash-manager/report`

- **Frontend id:** `EXPENSE_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/expences.service.ts#getPettycashReports; apps/web-giddh/src/app/services/expences.service.ts#getPettycashRejectedReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PettyCashManagerCompanyController#getPettyCashAdminReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/pettycashmanager/PettyCashManagerCompanyController.java:48`
- **Deprecated:** No

Get Petty Cash Admin Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `asc`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PettyCashAdminFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `statusStr` | `String` | not declared | unconstrained |
| `submittedBy` | `String` | not declared | unconstrained |
| `baseAccountName` | `String` | not declared | unconstrained |
| `particularAccountName` | `String` | not declared | unconstrained |
| `toDateStr` | `String` | not declared | unconstrained |
| `fromDateStr` | `String` | not declared | unconstrained |
| `mappingName` | `String` | not declared | unconstrained |
| `classFieldName` | `String` | not declared | unconstrained |

Example:

```json
{
  "statusStr": "string",
  "submittedBy": "string",
  "baseAccountName": "string",
  "particularAccountName": "string",
  "toDateStr": "string",
  "fromDateStr": "string",
  "mappingName": "string",
  "classFieldName": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `pettyCashAdminReport`

```json
{
  "status": "success",
  "body": {
    "reference": "pettyCashAdminReport"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/report?page=1&count=20&sortBy=entry_date&sort=asc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"statusStr":"string","submittedBy":"string","baseAccountName":"string","particularAccountName":"string","toDateStr":"string","fromDateStr":"string","mappingName":"string","classFieldName":"string"}'
```

---

### `GET /company/:companyUniqueName/pettycash-manager/ledger/:accountUniqueName`

- **Frontend id:** `EXPENSE_API.GETEntry`
- **Frontend evidence:** `apps/web-giddh/src/app/services/expences.service.ts#getPettycashEntry`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PettyCashManagerController#getCashEntryForAdminByUniqueName
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/pettycashmanager/PettyCashManagerController.java:83`
- **Deprecated:** No

Get Cash Entry For Admin By Unique Name

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `entryUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `pettyCashManagerService.getCashEntryForAdminByUniqueName(company, branch, entryUniqueName`

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
- `body as PettyCashResonse`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/ledger/SAMPLE_ENTRY?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/`

- **Frontend id:** `PURCHASE_ORDER`
- **Frontend evidence:** `purchase-order.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: CompanyController#getCompany
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:140`
- **Deprecated:** No

Get Company

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyService.getCompanyResourceWithHOAlias(company`

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
| 401 | `error.code.unAuthorize` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "error.code.unAuthorize",
  "message": "error.unAuthorize"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43?source=APP' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/purchase-order/bulk-update?action=:action`

- **Frontend id:** `PURCHASE_ORDER_API.BULK_UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#bulkUpdate; apps/web-giddh/src/app/services/voucher.service.ts#bulkUpdate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderCompanyController#performBulkAction
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderCompanyController.java:169`
- **Deprecated:** No

Perform Bulk Action

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `action` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BulkUpdateRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `purchaseNumbers` | `Set<String>` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `purchaseDate` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `purchaseOrders` | `Set<BulkPurchaseOrders>` | not declared | unconstrained |

Example:

```json
{
  "purchaseNumbers": [],
  "dueDate": "string",
  "purchaseDate": "string",
  "warehouseUniqueName": "string",
  "purchaseOrders": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `result`

```json
{
  "status": "success",
  "body": {
    "reference": "result"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `CLONE_NOT_SUPPORTED` | `CloneNotSupportedException` | CloneNotSupportedException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "CLONE_NOT_SUPPORTED",
  "message": "Clone Not Supported"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/bulk-update?action=SAMPLE_action&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"purchaseNumbers":[],"dueDate":"string","purchaseDate":"string","warehouseUniqueName":"string","purchaseOrders":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/generate`

- **Frontend id:** `PURCHASE_ORDER_API.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#create`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:107`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `accountUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseOrderDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `version` | `Long` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `balanceTotal` | `AmountDetails` | not declared | unconstrained |
| `status` | `PurchaseOrder.Status` | not declared | unconstrained |
| `company` | `VoucherCompanyData` | not declared | unconstrained |
| `account` | `VoucherAccountData` | not declared | unconstrained |
| `entries` | `List<VoucherEntryV4>` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `TaxTotal` | not declared | unconstrained |
| `discountTotal` | `DiscountTotal` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `deposit` | `AmountDeposit` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `templateDetails` | `TemplateDetails` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | unconstrained |
| `isEcommerceInvoice` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `attachedFiles` | `Set<String>` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `attachedFileName` | `String` | not declared | unconstrained |
| `branch` | `BranchModel` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonResource` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "version": 0,
  "number": "string",
  "type": "string",
  "date": "string",
  "dueDate": "string",
  "uniqueName": "string",
  "balanceTotal": "string",
  "status": "string",
  "company": "string",
  "account": "string",
  "entries": [],
  "grandTotal": "string",
  "subTotal": "string",
  "taxTotal": "string",
  "discountTotal": "string",
  "roundOffTotal": "string",
  "totalAsWords": "string",
  "deposit": "string",
  "base64": "string",
  "updateAccountDetails": false,
  "templateDetails": "string",
  "entryUniqueNames": [],
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "subVoucher": "string",
  "isEcommerceInvoice": false,
  "applyApplicableTaxes": false,
  "attachedFiles": [],
  "warehouse": "string",
  "attachedFileName": "string",
  "branch": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "roundOffApplicable": false
}
```

#### Success response

- HTTP status: `201 CREATED`
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"version":0,"number":"string","type":"string","date":"string","dueDate":"string","uniqueName":"string","balanceTotal":"string","status":"string","company":"string","account":"string","entries":[],"grandTotal":"string","subTotal":"string","taxTotal":"string","discountTotal":"string","roundOffTotal":"string","totalAsWords":"string","deposit":"string","base64":"string","updateAccountDetails":false,"templateDetails":"string","entryUniqueNames":[],"exchangeRate":0,"valuesInAccountCurrency":false,"subVoucher":"string","isEcommerceInvoice":false,"applyApplicableTaxes":false,"attachedFiles":[],"warehouse":"string","attachedFileName":"string","branch":"string","salesPersonUniqueName":"string","salesPerson":"string","roundOffApplicable":false}'
```

---

### `DELETE /company/:companyUniqueName/purchase-order?uniqueName=:poUniqueName`

- **Frontend id:** `PURCHASE_ORDER_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#delete; apps/web-giddh/src/app/services/voucher.service.ts#deleteSinglePOVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderCompanyController#deletePurchaseOrder
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderCompanyController.java:138`
- **Deprecated:** No

Delete Purchase Order

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `uniqueName` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Successfully Deleted Purchase Order"`

```json
{
  "status": "success",
  "body": "Successfully Deleted Purchase Order"
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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order?uniqueName=SAMPLE_UNIQUE_NAME&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/:poUniqueName/mail`

- **Frontend id:** `PURCHASE_ORDER_API.EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#sendEmail; apps/web-giddh/src/app/services/voucher.service.ts#sendEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#mailPurchaseOrder
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:376`
- **Deprecated:** No

Mail Purchase Order

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `CustomInvoiceNumberRequestBody` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `proformaNumber` | `String` | not declared | unconstrained |
| `estimateNumber` | `String` | not declared | unconstrained |
| `invoiceNumber` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `estimateVersionNumber` | `String` | not declared | unconstrained |
| `debugMode` | `boolean` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `emailId` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "proformaNumber": "string",
  "estimateNumber": "string",
  "invoiceNumber": "string",
  "voucherType": "string",
  "estimateVersionNumber": "string",
  "debugMode": false,
  "generateEInvoice": false,
  "emailId": []
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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
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
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as EmailKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/SAMPLE_UNIQUE_NAME/mail?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `GET /company/:companyUniqueName/purchase-order/:poUniqueName`

- **Frontend id:** `PURCHASE_ORDER_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#get; apps/web-giddh/src/app/services/voucher.service.ts#getPurchaseOrder`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderCompanyController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderCompanyController.java:213`
- **Deprecated:** No

/

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `response.getPurchaseOrderDetails().setResponseChanges(`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/purchase-order/get-all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `PURCHASE_ORDER_API.GET_ALL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#getAll; apps/web-giddh/src/app/services/voucher.service.ts#getPurchaseOrderList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderCompanyController#getPurchaseOrdersUIView
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderCompanyController.java:97`
- **Deprecated:** No

Get Purchase Orders UIView

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `purchaseDate`
- `invoiceCount` — type: `int`; optional; default: `10`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseOrderFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `purchaseOrderNumber` | `String` | not declared | unconstrained |
| `vendorName` | `String` | not declared | unconstrained |
| `statuses` | `Set<String>` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `grandTotalOperation` | `String` | not declared | unconstrained |
| `dueFromStr` | `String` | not declared | unconstrained |
| `dueToStr` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `mappingName` | `String` | not declared | unconstrained |
| `classFieldName` | `String` | not declared | unconstrained |
| `hasData` | `boolean` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `invoiceCount` | `int` | not declared | unconstrained |
| `fromDate` | `LocalDateTime` | not declared | unconstrained |
| `toDate` | `LocalDateTime` | not declared | unconstrained |
| `dueFromDate` | `LocalDate` | not declared | unconstrained |
| `dueToDate` | `LocalDate` | not declared | unconstrained |
| `sortDirection` | `Sort.Direction` | not declared | unconstrained |
| `sortTypeEnum` | `PurchaseOrderSortType` | not declared | CREATED_DATE, PURCHASE_DATE, DUE_DATE, GRAND_TOTAL |
| `grandTotalOperation` | `NumberOperations` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `statuses` | `Set<String>` | not declared | unconstrained |
| `purchaseNumber` | `String` | not declared | unconstrained |
| `searchQuery` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "purchaseOrderNumber": "string",
  "vendorName": "string",
  "statuses": [],
  "grandTotal": 0,
  "grandTotalOperation": "string",
  "dueFromStr": "string",
  "dueToStr": "string",
  "salesPersonUniqueNames": [],
  "selectAllFields": [],
  "mappingName": "string",
  "classFieldName": "string",
  "hasData": false,
  "page": 0,
  "count": 0,
  "invoiceCount": 0,
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "dueFromDate": "01-04-2025",
  "dueToDate": "01-04-2025",
  "sortDirection": "string",
  "sortTypeEnum": "CREATED_DATE",
  "purchaseNumber": "string",
  "searchQuery": "string"
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
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/get-all?page=1&count=50&from=01-04-2025&to=31-03-2026&sort=desc&sortBy=purchaseDate&invoiceCount=10&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"purchaseOrderNumber":"string","vendorName":"string","statuses":[],"grandTotal":0,"grandTotalOperation":"string","dueFromStr":"string","dueToStr":"string","salesPersonUniqueNames":[],"selectAllFields":[],"mappingName":"string","classFieldName":"string","hasData":false,"page":0,"count":0,"invoiceCount":0,"fromDate":"01-04-2025","toDate":"01-04-2025","dueFromDate":"01-04-2025","dueToDate":"01-04-2025","sortDirection":"string","sortTypeEnum":"CREATED_DATE","purchaseNumber":"string","searchQuery":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/pending-numbers?page=:page&count=:count&sort=:sort&sortBy=:sortBy&pendingItems=true`

- **Frontend id:** `PURCHASE_ORDER_API.GET_ALL_PENDING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#getAllPendingPo; apps/web-giddh/src/app/services/voucher.service.ts#getVendorPurchaseOrders; apps/web-giddh/src/app/services/voucher.service.ts#getAllPendingPo`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#getPendingPurchaseNumbers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:303`
- **Deprecated:** No

Get Pending Purchase Numbers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `count` — type: `int`; optional; default: `5`
- `sortBy` — type: `String`; optional; default: `createdAt`
- `sort` — type: `String`; optional; default: `desc`
- `pendingItems` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `PurchaseOrderFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `purchaseOrderNumber` | `String` | not declared | unconstrained |
| `vendorName` | `String` | not declared | unconstrained |
| `statuses` | `Set<String>` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `grandTotalOperation` | `String` | not declared | unconstrained |
| `dueFromStr` | `String` | not declared | unconstrained |
| `dueToStr` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `mappingName` | `String` | not declared | unconstrained |
| `classFieldName` | `String` | not declared | unconstrained |
| `hasData` | `boolean` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `invoiceCount` | `int` | not declared | unconstrained |
| `fromDate` | `LocalDateTime` | not declared | unconstrained |
| `toDate` | `LocalDateTime` | not declared | unconstrained |
| `dueFromDate` | `LocalDate` | not declared | unconstrained |
| `dueToDate` | `LocalDate` | not declared | unconstrained |
| `sortDirection` | `Sort.Direction` | not declared | unconstrained |
| `sortTypeEnum` | `PurchaseOrderSortType` | not declared | CREATED_DATE, PURCHASE_DATE, DUE_DATE, GRAND_TOTAL |
| `grandTotalOperation` | `NumberOperations` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `statuses` | `Set<String>` | not declared | unconstrained |
| `purchaseNumber` | `String` | not declared | unconstrained |
| `searchQuery` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "purchaseOrderNumber": "string",
  "vendorName": "string",
  "statuses": [],
  "grandTotal": 0,
  "grandTotalOperation": "string",
  "dueFromStr": "string",
  "dueToStr": "string",
  "salesPersonUniqueNames": [],
  "selectAllFields": [],
  "mappingName": "string",
  "classFieldName": "string",
  "hasData": false,
  "page": 0,
  "count": 0,
  "invoiceCount": 0,
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "dueFromDate": "01-04-2025",
  "dueToDate": "01-04-2025",
  "sortDirection": "string",
  "sortTypeEnum": "CREATED_DATE",
  "purchaseNumber": "string",
  "searchQuery": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `purchaseOrderService.getPendingPurchaseNumbers(company, branch, account, count, filter, pendingItems`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/pending-numbers?branchUniqueName=aaaa&count=5&sortBy=createdAt&sort=desc&pendingItems=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"purchaseOrderNumber":"string","vendorName":"string","statuses":[],"grandTotal":0,"grandTotalOperation":"string","dueFromStr":"string","dueToStr":"string","salesPersonUniqueNames":[],"selectAllFields":[],"mappingName":"string","classFieldName":"string","hasData":false,"page":0,"count":0,"invoiceCount":0,"fromDate":"01-04-2025","toDate":"01-04-2025","dueFromDate":"01-04-2025","dueToDate":"01-04-2025","sortDirection":"string","sortTypeEnum":"CREATED_DATE","purchaseNumber":"string","searchQuery":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/versions/all?page=:page&count=:count`

- **Frontend id:** `PURCHASE_ORDER_API.GET_ALL_VERSIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#getAllVersions; apps/web-giddh/src/app/services/voucher.service.ts#getVoucherVersions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#getPOVersions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:343`
- **Deprecated:** No

Get all versions of a particular purchase order with provided purchase number

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`

#### Controller-backed request payload

Type: `PurchaseOrderAction` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `purchaseOrderService.getPOVersions(company, branch, account, purchaseOrderAction, page, count`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/versions/all?branchUniqueName=aaaa&page=1&count=10' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/:poUniqueName/download?fileType=base64`

- **Frontend id:** `PURCHASE_ORDER_API.GET_PDF`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#getPdf`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#download
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:415`
- **Deprecated:** No

Download purchase order Version 3

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `debugMode` — type: `boolean`; optional
- `fileType` — type: `String`; optional; default: `base64`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `parser.parse(`

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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
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
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/SAMPLE_UNIQUE_NAME/download?branchUniqueName=aaaa&debugMode=SAMPLE_debugMode&fileType=base64' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/purchase-order/preview?uniqueName=:poUniqueName`

- **Frontend id:** `PURCHASE_ORDER_API.GET_PREVIEW`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#getPreview`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderCompanyController#preview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderCompanyController.java:195`
- **Deprecated:** No

Preview

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `uniqueName` — type: `String`; required

#### Controller-backed request payload

None.

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-order/preview?branchUniqueName=aaaa&uniqueName=SAMPLE_UNIQUE_NAME' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/status/change`

- **Frontend id:** `PURCHASE_ORDER_API.STATUS_UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#statusUpdate; apps/web-giddh/src/app/services/voucher.service.ts#purchaseOrderStatusUpdate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#changeStatus
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:271`
- **Deprecated:** No

Change Purchase order status API

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseOrderAction` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `result`

```json
{
  "status": "success",
  "body": {
    "reference": "result"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `CLONE_NOT_SUPPORTED` | `CloneNotSupportedException` | CloneNotSupportedException raised by controller or shared ExceptionHandler |
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
  "code": "CLONE_NOT_SUPPORTED",
  "message": "Clone Not Supported"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order/status/change?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/purchase-order`

- **Frontend id:** `PURCHASE_ORDER_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#update`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseOrderAccountController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/order/PurchaseOrderAccountController.java:150`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `accountUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseOrderDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `version` | `Long` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `balanceTotal` | `AmountDetails` | not declared | unconstrained |
| `status` | `PurchaseOrder.Status` | not declared | unconstrained |
| `company` | `VoucherCompanyData` | not declared | unconstrained |
| `account` | `VoucherAccountData` | not declared | unconstrained |
| `entries` | `List<VoucherEntryV4>` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `TaxTotal` | not declared | unconstrained |
| `discountTotal` | `DiscountTotal` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `deposit` | `AmountDeposit` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `templateDetails` | `TemplateDetails` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | unconstrained |
| `isEcommerceInvoice` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `attachedFiles` | `Set<String>` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `attachedFileName` | `String` | not declared | unconstrained |
| `branch` | `BranchModel` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonResource` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "version": 0,
  "number": "string",
  "type": "string",
  "date": "string",
  "dueDate": "string",
  "uniqueName": "string",
  "balanceTotal": "string",
  "status": "string",
  "company": "string",
  "account": "string",
  "entries": [],
  "grandTotal": "string",
  "subTotal": "string",
  "taxTotal": "string",
  "discountTotal": "string",
  "roundOffTotal": "string",
  "totalAsWords": "string",
  "deposit": "string",
  "base64": "string",
  "updateAccountDetails": false,
  "templateDetails": "string",
  "entryUniqueNames": [],
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "subVoucher": "string",
  "isEcommerceInvoice": false,
  "applyApplicableTaxes": false,
  "attachedFiles": [],
  "warehouse": "string",
  "attachedFileName": "string",
  "branch": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "roundOffApplicable": false
}
```

#### Success response

- HTTP status: `201 CREATED`
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

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-order?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"version":0,"number":"string","type":"string","date":"string","dueDate":"string","uniqueName":"string","balanceTotal":"string","status":"string","company":"string","account":"string","entries":[],"grandTotal":"string","subTotal":"string","taxTotal":"string","discountTotal":"string","roundOffTotal":"string","totalAsWords":"string","deposit":"string","base64":"string","updateAccountDetails":false,"templateDetails":"string","entryUniqueNames":[],"exchangeRate":0,"valuesInAccountCurrency":false,"subVoucher":"string","isEcommerceInvoice":false,"applyApplicableTaxes":false,"attachedFiles":[],"warehouse":"string","attachedFileName":"string","branch":"string","salesPersonUniqueName":"string","salesPerson":"string","roundOffApplicable":false}'
```

---

### `PUT /company/:companyUniqueName/purchase-bill-setting`

- **Frontend id:** `PURCHASE_ORDER_API.UPDATE_SETTINGS_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#updateSettingsEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseBillSettingController#updateInvoiceEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PurchaseBillSettingController.java:47`
- **Deprecated:** No

Update Invoice Email

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `CompanyEmail` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
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
| 400 | `FILE_NOT_FOUND` | `FileNotFoundException` | FileNotFoundException raised by controller or shared ExceptionHandler |
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
  "code": "FILE_NOT_FOUND",
  "message": "File Not Found"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-bill-setting?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/purchase-bill-setting/verify-email?emailAddress=:emailAddress&scope=:scope&branchUniqueName=:branchUniqueName`

- **Frontend id:** `PURCHASE_ORDER_API.VERIFY_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-order.service.ts#verifyEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseBillSettingController#verifyCompanyInvoiceEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PurchaseBillSettingController.java:61`
- **Deprecated:** No

Verify Company Invoice Email

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `emailAddress` — type: `String`; required
- `scope` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.email.verification"`

```json
{
  "status": "success",
  "body": "success.email.verification"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-bill-setting/verify-email?branchUniqueName=aaaa&emailAddress=SAMPLE_emailAddress&scope=SAMPLE_scope' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/`

- **Frontend id:** `PURCHASE_RECORD`
- **Frontend evidence:** `purchase-record.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: AccountController#getActiveAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:68`
- **Deprecated:** No

Get Active Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

None.

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG&source=APP' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/purchase-record?uniqueName=:uniqueName`

- **Frontend id:** `PURCHASE_RECORD_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#deletePurchaseRecord`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseCompanyController#deletePurchaseRecord
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseCompanyController.java:118`
- **Deprecated:** No

Delete Purchase Record

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `uniqueName` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Successfully Deleted Purchase bill"`

```json
{
  "status": "success",
  "body": "Successfully Deleted Purchase bill"
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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-record?uniqueName=SAMPLE_UNIQUE_NAME&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/download-file`

- **Frontend id:** `PURCHASE_RECORD_API.DOWNLOAD_ATTACHMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#downloadAttachedFile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#downloadFile
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:204`
- **Deprecated:** No

Download File

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `uniqueName` — type: `String`; required
- `fileType` — type: `String`; optional; default: `base64`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `fileAttachmentResource`

```json
{
  "status": "success",
  "body": {
    "reference": "fileAttachmentResource"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/download-file?uniqueName=SAMPLE_UNIQUE_NAME&fileType=base64&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/:uniqueName/mail`

- **Frontend id:** `PURCHASE_RECORD_API.EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#sendEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#mailPurchaseOrder
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:284`
- **Deprecated:** No

Mail Purchase Order

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CustomInvoiceNumberRequestBody` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `proformaNumber` | `String` | not declared | unconstrained |
| `estimateNumber` | `String` | not declared | unconstrained |
| `invoiceNumber` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `estimateVersionNumber` | `String` | not declared | unconstrained |
| `debugMode` | `boolean` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `emailId` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "proformaNumber": "string",
  "estimateNumber": "string",
  "invoiceNumber": "string",
  "voucherType": "string",
  "estimateVersionNumber": "string",
  "debugMode": false,
  "generateEInvoice": false,
  "emailId": []
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
- `body as EmailKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/SAMPLE_UNIQUE_NAME/mail?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/generate`

- **Frontend id:** `PURCHASE_RECORD_API.GENERATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#generatePurchaseRecord`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:95`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `accountUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseRecordDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `version` | `Long` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `balanceTotal` | `AmountDetails` | not declared | unconstrained |
| `balanceStatus` | `BalanceStatus` | not declared | PAID, UNPAID, CANCEL, CANCELLED, PARTIAL_PAID, HOLD, EMPTY, CREDIT_ISSUED |
| `gainLoss` | `BigDecimal` | not declared | unconstrained |
| `company` | `VoucherCompanyData` | not declared | unconstrained |
| `account` | `VoucherAccountData` | not declared | unconstrained |
| `entries` | `List<VoucherEntryV4>` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `TaxTotal` | not declared | unconstrained |
| `discountTotal` | `DiscountTotal` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `deposit` | `AmountDeposit` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `templateDetails` | `TemplateDetails` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `purchaseOrders` | `List<GenNameUniqueNameIdImpl<String>>` | not declared | unconstrained |
| `purchaseOrderDetails` | `List<PurchaseOrderDetails>` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | unconstrained |
| `isEcommerceInvoice` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `attachedFiles` | `Set<String>` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `attachedFileName` | `String` | not declared | unconstrained |
| `invoiceLinkingRequest` | `InvoiceLinkingRequest` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |

Example:

```json
{
  "version": 0,
  "number": "string",
  "type": "string",
  "date": "string",
  "dueDate": "string",
  "uniqueName": "string",
  "balanceTotal": "string",
  "balanceStatus": "PAID",
  "gainLoss": 0,
  "company": "string",
  "account": "string",
  "entries": [],
  "grandTotal": "string",
  "subTotal": "string",
  "taxTotal": "string",
  "discountTotal": "string",
  "roundOffTotal": "string",
  "totalAsWords": "string",
  "deposit": "string",
  "base64": "string",
  "updateAccountDetails": false,
  "templateDetails": "string",
  "entryUniqueNames": [],
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "purchaseOrders": [],
  "purchaseOrderDetails": [],
  "subVoucher": "string",
  "isEcommerceInvoice": false,
  "applyApplicableTaxes": false,
  "attachedFiles": [],
  "warehouse": "string",
  "attachedFileName": "string",
  "invoiceLinkingRequest": "string",
  "branch": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
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
| 400 | `DATE_PARSE` | `DateParseException` | DateParseException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_ACCESS` | `IllegalAccessException` | IllegalAccessException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `INVOCATION_TARGET` | `InvocationTargetException` | InvocationTargetException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `MESSAGING` | `MessagingException` | MessagingException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "DATE_PARSE",
  "message": "Date Parse"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"version":0,"number":"string","type":"string","date":"string","dueDate":"string","uniqueName":"string","balanceTotal":"string","balanceStatus":"PAID","gainLoss":0,"company":"string","account":"string","entries":[],"grandTotal":"string","subTotal":"string","taxTotal":"string","discountTotal":"string","roundOffTotal":"string","totalAsWords":"string","deposit":"string","base64":"string","updateAccountDetails":false,"templateDetails":"string","entryUniqueNames":[],"exchangeRate":0,"valuesInAccountCurrency":false,"purchaseOrders":[],"purchaseOrderDetails":[],"subVoucher":"string","isEcommerceInvoice":false,"applyApplicableTaxes":false,"attachedFiles":[],"warehouse":"string","attachedFileName":"string","invoiceLinkingRequest":"string","branch":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/versions/all?page=:page&count=:count`

- **Frontend id:** `PURCHASE_RECORD_API.GET_ALL_VERSIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#getAllVersions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#getPRVersions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:314`
- **Deprecated:** No

Get all versions of a particular purchase record with provided purchase record unique name

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`

#### Controller-backed request payload

Type: `PurchaseOrderAction` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `purchaseRecordService.getPRVersions(company, purchaseOrderAction, page, count`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/versions/all?page=1&count=10&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/:uniqueName/download?fileType=base64`

- **Frontend id:** `PURCHASE_RECORD_API.GET_PDF`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#getPdf`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#download
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:352`
- **Deprecated:** No

Download purchase order Version 3

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required
**Query parameters**
- `fileType` — type: `String`; optional; default: `base64`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `data`

```json
{
  "status": "success",
  "body": {
    "reference": "data"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/SAMPLE_UNIQUE_NAME/download?fileType=base64&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record`

- **Frontend id:** `PURCHASE_RECORD_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#generatePurchaseRecord`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:169`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `accountUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseRecordDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `version` | `Long` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `balanceTotal` | `AmountDetails` | not declared | unconstrained |
| `balanceStatus` | `BalanceStatus` | not declared | PAID, UNPAID, CANCEL, CANCELLED, PARTIAL_PAID, HOLD, EMPTY, CREDIT_ISSUED |
| `gainLoss` | `BigDecimal` | not declared | unconstrained |
| `company` | `VoucherCompanyData` | not declared | unconstrained |
| `account` | `VoucherAccountData` | not declared | unconstrained |
| `entries` | `List<VoucherEntryV4>` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `TaxTotal` | not declared | unconstrained |
| `discountTotal` | `DiscountTotal` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `deposit` | `AmountDeposit` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `templateDetails` | `TemplateDetails` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `purchaseOrders` | `List<GenNameUniqueNameIdImpl<String>>` | not declared | unconstrained |
| `purchaseOrderDetails` | `List<PurchaseOrderDetails>` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | unconstrained |
| `isEcommerceInvoice` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `attachedFiles` | `Set<String>` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `attachedFileName` | `String` | not declared | unconstrained |
| `invoiceLinkingRequest` | `InvoiceLinkingRequest` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |

Example:

```json
{
  "version": 0,
  "number": "string",
  "type": "string",
  "date": "string",
  "dueDate": "string",
  "uniqueName": "string",
  "balanceTotal": "string",
  "balanceStatus": "PAID",
  "gainLoss": 0,
  "company": "string",
  "account": "string",
  "entries": [],
  "grandTotal": "string",
  "subTotal": "string",
  "taxTotal": "string",
  "discountTotal": "string",
  "roundOffTotal": "string",
  "totalAsWords": "string",
  "deposit": "string",
  "base64": "string",
  "updateAccountDetails": false,
  "templateDetails": "string",
  "entryUniqueNames": [],
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "purchaseOrders": [],
  "purchaseOrderDetails": [],
  "subVoucher": "string",
  "isEcommerceInvoice": false,
  "applyApplicableTaxes": false,
  "attachedFiles": [],
  "warehouse": "string",
  "attachedFileName": "string",
  "invoiceLinkingRequest": "string",
  "branch": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"version":0,"number":"string","type":"string","date":"string","dueDate":"string","uniqueName":"string","balanceTotal":"string","balanceStatus":"PAID","gainLoss":0,"company":"string","account":"string","entries":[],"grandTotal":"string","subTotal":"string","taxTotal":"string","discountTotal":"string","roundOffTotal":"string","totalAsWords":"string","deposit":"string","base64":"string","updateAccountDetails":false,"templateDetails":"string","entryUniqueNames":[],"exchangeRate":0,"valuesInAccountCurrency":false,"purchaseOrders":[],"purchaseOrderDetails":[],"subVoucher":"string","isEcommerceInvoice":false,"applyApplicableTaxes":false,"attachedFiles":[],"warehouse":"string","attachedFileName":"string","invoiceLinkingRequest":"string","branch":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=base64`

- **Frontend id:** `PURCHASE_RECORD_API.V2.DOWNLOAD_ATTACHMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#downloadAttachedFile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#download
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:169`
- **Deprecated:** No

Download

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`
- `debugMode` — type: `boolean`; optional
- `fileType` — type: `String`; optional; default: `pdf`

#### Controller-backed request payload

Type: `DownloadVoucher` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherNumber` | `Set<String>` | not declared | unconstrained |
| `emailId` | `List<String>` | not declared | unconstrained |
| `template` | `String` | not declared | unconstrained |
| `cancel` | `Boolean` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `typeOfInvoice` | `List<String>` | not declared | unconstrained |
| `debugMode` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "voucherNumber": [],
  "emailId": [],
  "template": "string",
  "cancel": false,
  "voucherType": "string",
  "typeOfInvoice": [],
  "debugMode": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `objectMapper.readValue(arr, Object.class`

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
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Company unique name or Account unique name must not be empty or null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/download-file?branchUniqueName=aaaa&refresh=false&debugMode=SAMPLE_debugMode&fileType=pdf' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherNumber":[],"emailId":[],"template":"string","cancel":false,"voucherType":"string","typeOfInvoice":[],"debugMode":false}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/validate`

- **Frontend id:** `PURCHASE_RECORD_API.VALIDATE_RECORD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-record.service.ts#validatePurchaseRecord`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#validate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:252`
- **Deprecated:** No

same account unique name, same tax number, same purchase Date

#### Inputs

**Path parameters**
- `accountUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `taxNumber` — type: `String`; required
- `purchaseDate` — type: `String`; required
- `number` — type: `String`; required

#### Controller-backed request payload

None.

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/validate?taxNumber=SAMPLE_taxNumber&purchaseDate=SAMPLE_purchaseDate&number=SAMPLE_number&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

