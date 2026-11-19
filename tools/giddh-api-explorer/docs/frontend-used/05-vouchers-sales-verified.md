# Backend-Verified Frontend APIs: 05-vouchers-sales.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/vouchers/bulk-update?action=:actionType`

- **Frontend id:** `BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.bulkupdate.service.ts#bulkUpdateInvoice; apps/web-giddh/src/app/services/voucher.service.ts#bulkUpdateInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BulkUpdateController#updateInvoices; accounting-microservice: VoucherController#bulkUpdate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BulkUpdateController.java:48`
- **Deprecated:** No

Update Invoices

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `action` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BulkUpdateInvoiceRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherNumbers` | `List<String>` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `templateUniqueName` | `String` | not declared | unconstrained |
| `message1` | `String` | not declared | unconstrained |
| `message2` | `String` | not declared | unconstrained |
| `imageSignatureUniqueName` | `String` | not declared | unconstrained |
| `slogan` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `shippingDetails` | `BillingShippingData` | not declared | unconstrained |
| `customField1` | `String` | not declared | unconstrained |
| `customField2` | `String` | not declared | unconstrained |
| `customField3` | `String` | not declared | unconstrained |

Example:

```json
{
  "voucherNumbers": [],
  "voucherType": "string",
  "templateUniqueName": "string",
  "message1": "string",
  "message2": "string",
  "imageSignatureUniqueName": "string",
  "slogan": "string",
  "dueDate": "string",
  "shippingDetails": "string",
  "customField1": "string",
  "customField2": "string",
  "customField3": "string"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/bulk-update?action=SAMPLE_action&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherNumbers":[],"voucherType":"string","templateUniqueName":"string","message1":"string","message2":"string","imageSignatureUniqueName":"string","slogan":"string","dueDate":"string","shippingDetails":"string","customField1":"string","customField2":"string","customField3":"string"}'
```

---

### `POST /company/:companyUniqueName/vouchers/bulk-export?from=:from&to=:to&type=:type&mail=:mail&q=:q`

- **Frontend id:** `BULK_VOUCHER_EXPORT_API.BULK_EXPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/bulkvoucherexport.service.ts#bulkExport; apps/web-giddh/src/app/services/voucher.service.ts#bulkExport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyVoucherController#bulkExportVouchers; accounting-microservice: VoucherController#bulkExport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyVoucherController.java:391`
- **Deprecated:** No

Bulk Export Vouchers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `invoice`
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional
- `mail` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `VoucherFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `value` | `String` | not declared | unconstrained |
| `voucherCopyType` | `VoucherFilter.VoucherCopyType` | not declared | unconstrained |
| `downloadCopyFileName` | `String` | not declared | unconstrained |
| `downloadCopyValue` | `String` | not declared | unconstrained |
| `downloadCopyTypeList` | `List<String>` | not declared | unconstrained |
| `copyTypes` | `Set<String>` | not declared | unconstrained |
| `sendTo` | `SendToOrCc` | not declared | unconstrained |
| `voucherUniqueNames` | `Set<String>` | not declared | unconstrained |
| `balanceStatus` | `Collection<String>` | not declared | unconstrained |
| `status` | `Collection<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `voucherNumber` | `String` | not declared | unconstrained |
| `proformaNumber` | `String` | not declared | unconstrained |
| `balanceDue` | `BigDecimal` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `invoiceDate` | `String` | not declared | unconstrained |
| `balanceMoreThan` | `Boolean` | not declared | unconstrained |
| `balanceEqual` | `Boolean` | not declared | unconstrained |
| `balanceLessThan` | `Boolean` | not declared | unconstrained |
| `dueDateBefore` | `Boolean` | not declared | unconstrained |
| `dueDateAfter` | `Boolean` | not declared | unconstrained |
| `dueDateEqual` | `Boolean` | not declared | unconstrained |
| `invoiceDateBefore` | `Boolean` | not declared | unconstrained |
| `invoiceDateAfter` | `Boolean` | not declared | unconstrained |
| `invoiceDateEqual` | `Boolean` | not declared | unconstrained |
| `companyName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `totalMoreThan` | `Boolean` | not declared | unconstrained |
| `totalLessThan` | `Boolean` | not declared | unconstrained |
| `totalEqual` | `Boolean` | not declared | unconstrained |
| `total` | `BigDecimal` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |

Example:

```json
{
  "value": "string",
  "voucherCopyType": "string",
  "downloadCopyFileName": "string",
  "downloadCopyValue": "string",
  "downloadCopyTypeList": [],
  "copyTypes": [],
  "sendTo": "string",
  "voucherUniqueNames": [],
  "balanceStatus": [],
  "status": [],
  "accountUniqueName": "string",
  "voucherNumber": "string",
  "proformaNumber": "string",
  "balanceDue": 0,
  "dueDate": "string",
  "invoiceDate": "string",
  "balanceMoreThan": false,
  "balanceEqual": false,
  "balanceLessThan": false,
  "dueDateBefore": false,
  "dueDateAfter": false,
  "dueDateEqual": false,
  "invoiceDateBefore": false,
  "invoiceDateAfter": false,
  "invoiceDateEqual": false,
  "companyName": "string",
  "groupUniqueName": "string",
  "totalMoreThan": false,
  "totalLessThan": false,
  "totalEqual": false,
  "total": 0,
  "description": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new FileResponse<>("Your request is being processed. Please check your mail after some time.", FileResponse.MESSAGE`

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
| 400 | `THROWABLE` | `Throwable` | Throwable raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "THROWABLE",
  "message": "Throwable"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/bulk-export?from=01-04-2025&to=31-03-2026&type=invoice&sort=desc&sortBy=voucherDate&q=&branchUniqueName=aaaa&mail=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"value":"string","voucherCopyType":"string","downloadCopyFileName":"string","downloadCopyValue":"string","downloadCopyTypeList":[],"copyTypes":[],"sendTo":"string","voucherUniqueNames":[],"balanceStatus":[],"status":[],"accountUniqueName":"string","voucherNumber":"string","proformaNumber":"string","balanceDue":0,"dueDate":"string","invoiceDate":"string","balanceMoreThan":false,"balanceEqual":false,"balanceLessThan":false,"dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"invoiceDateBefore":false,"invoiceDateAfter":false,"invoiceDateEqual":false,"companyName":"string","groupUniqueName":"string","totalMoreThan":false,"totalLessThan":false,"totalEqual":false,"total":0,"description":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/trigger`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.CREATE_TRIGGERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#createTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerControllerV2#createEmailTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/TriggerControllerV2.java:42`
- **Deprecated:** No

Create Email Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"title":"string","entity":"string","entityUniqueNames":[],"voucherTypes":[],"emailSubject":"string","triggerModule":"VOUCHER_DUE","to":[],"cc":[],"bcc":[],"replyTo":[],"conditions":{},"executionTime":"string","actions":["ATTACH_VOUCHER_PDF"],"html":"string","disabled":false,"sendMail":false,"templateOf":"string"}'
```

---

### `DELETE /v2/company/:companyUniqueName/trigger/:uniqueName`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.DELETE_TRIGGER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#deleteTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerControllerV2#deleteEmailTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/TriggerControllerV2.java:67`
- **Deprecated:** No

Delete Email Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required

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
curl --request DELETE \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/trigger/all?page=:page&count=:count`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.GET_ALL_TRIGGERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getTriggerList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerControllerV2#getAllEmailTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/TriggerControllerV2.java:86`
- **Deprecated:** No

Get All Email Trigger

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
- Body evidence: `communicationService.getAllEmailTriggers(company, page, count`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/all?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/condition-suggestion?triggerModule=:triggerModule`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONDITIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getEmailConditions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getConditionSuggestion
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:252`
- **Deprecated:** No

Get Condition Suggestion

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `triggerModule` — type: `String`; optional; default: ``
- `module` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.getConditionSuggestions(triggerModule`

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
| 406 | `error.code.invalidRequest` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/condition-suggestion?triggerModule=&module=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/email-content-suggestion`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONTENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getEmailContentSuggestions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getEmailContentSuggestion
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:240`
- **Deprecated:** No

Get Email Content Suggestion

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `isForCustomer` — type: `Boolean`; optional; default: `false`
- `isForVendor` — type: `Boolean`; optional; default: `false`
- `isForAccount` — type: `Boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.getEmailContentSuggestions(company, isForCustomer, isForVendor, isForAccount`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/email-content-suggestion?isForCustomer=false&isForVendor=false&isForAccount=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/communication/email-template/:voucherType`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_TEMPLATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getEmailTemplate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationControllerV2#getEmailTemplate
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationControllerV2.java:52`
- **Deprecated:** No

Get Email Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateOf` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.getEmailTemplate(templateOf, company`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/communication/email-template/SAMPLE_templateOf?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/trigger/:uniqueName`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.GET_TRIGGER_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getTriggerDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerControllerV2#getEmailTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/TriggerControllerV2.java:77`
- **Deprecated:** No

Get Email Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.getEmailTrigger(company, uniqueName`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /v2/company/:companyUniqueName/communication/email-template/:voucherType`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.UPDATE_EMAIL_TEMPLATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#updateCustomEmailTemplate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationControllerV2#updateEmailTemplate
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationControllerV2.java:39`
- **Deprecated:** No

Update Email Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateOf` — type: `String`; required

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
- Body evidence: `StaticMessageSource.getMessage("success.updated.email.template"`

```json
{
  "status": "success",
  "body": "success.updated.email.template"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/communication/email-template/SAMPLE_templateOf?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"title":"string","entity":"string","entityUniqueNames":[],"voucherTypes":[],"emailSubject":"string","triggerModule":"VOUCHER_DUE","to":[],"cc":[],"bcc":[],"replyTo":[],"conditions":{},"executionTime":"string","actions":["ATTACH_VOUCHER_PDF"],"html":"string","disabled":false,"sendMail":false,"templateOf":"string"}'
```

---

### `PUT /v2/company/:companyUniqueName/trigger/:uniqueName`

- **Frontend id:** `CUSTOM_EMAIL_TEMPLATE.UPDATE_TRIGGERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#updateTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerControllerV2#updateEmailTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/TriggerControllerV2.java:54`
- **Deprecated:** No

Update Email Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required

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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/trigger/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"title":"string","entity":"string","entityUniqueNames":[],"voucherTypes":[],"emailSubject":"string","triggerModule":"VOUCHER_DUE","to":[],"cc":[],"bcc":[],"replyTo":[],"conditions":{},"executionTime":"string","actions":["ATTACH_VOUCHER_PDF"],"html":"string","disabled":false,"sendMail":false,"templateOf":"string"}'
```

---

### `POST /company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-estimate`

- **Frontend id:** `ESTIMATES_API.generateInvoice`
- **Frontend evidence:** `apps/web-giddh/src/app/services/proforma.service.ts#generateInvoice; apps/web-giddh/src/app/services/voucher.service.ts#generateInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyVoucherController#generateVoucherViaEstimateV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyVoucherController.java:293`
- **Deprecated:** No

Convert Estimate into Invoice with multicurrency support.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/accounts/SAMPLE_ACCOUNT/v3/generate-via-estimate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /v3/company/:companyUniqueName/accounts/:accountUniqueName/proformas/generate-via-estimate`

- **Frontend id:** `ESTIMATES_API.generateProforma`
- **Frontend evidence:** `apps/web-giddh/src/app/services/proforma.service.ts#generateProforma; apps/web-giddh/src/app/services/voucher.service.ts#generateProforma`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProformaV3Controller#generateProformaViaEstimate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ProformaV3Controller.java:308`
- **Deprecated:** No

This function is used to generate proforma via estimate .

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

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

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `proforma`

```json
{
  "status": "success",
  "body": {
    "reference": "proforma"
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v3/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/proformas/generate-via-estimate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /company/:companyUniqueName/transporters`

- **Frontend id:** `EWAYBILL_API.ADD_TRANSPORTER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#addEwayTransporter; apps/web-giddh/src/app/services/invoice.service.ts#getAllTransporterList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TransporterController#addTransporter
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TransporterController.java:51`
- **Deprecated:** No

Add Transporter

#### Inputs

**Path parameters**
- `PARAMETER_COMPANY_UNIQUE_NAME` — type: `String`; required

#### Controller-backed request payload

Type: `TransporterRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
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
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/transporters`

- **Frontend id:** `EWAYBILL_API.ADD_TRANSPORTER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#addEwayTransporter; apps/web-giddh/src/app/services/invoice.service.ts#getAllTransporterList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TransporterController#getAllTransporter
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TransporterController.java:104`
- **Deprecated:** No

Get All Transporter

#### Inputs

**Path parameters**
- `PARAMETER_COMPANY_UNIQUE_NAME` — type: `String`; required
**Query parameters**
- `PARAMETER_QUERY` — type: `String`; optional; default: ``
- `PARAMETER_PAGE` — type: `String`; optional; default: `DEFAULT_VALUE_FOR_PAGE`
- `PARAMETER_COUNT` — type: `String`; optional; default: `10`
- `sort` — type: `String`; optional; default: `PARAMETER_ASC`
- `sortBy` — type: `String`; optional; default: `PARAMATER_TRANSPORTER_NAME`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `transporterResource`

```json
{
  "status": "success",
  "body": {
    "reference": "transporterResource"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?PARAMETER_QUERY=&PARAMETER_PAGE=DEFAULT_VALUE_FOR_PAGE&PARAMETER_COUNT=10&sort=PARAMETER_ASC&sortBy=PARAMATER_TRANSPORTER_NAME&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/ewb/cancel`

- **Frontend id:** `EWAYBILL_API.CANCEL_EWAY_BILL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#cancelEwayBill`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#cancelEwayBill
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:459`
- **Deprecated:** No

Cancel Eway Bill

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CancelEwayBill` (required).

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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/cancel?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/transporters?transporterId=:transporterId`

- **Frontend id:** `EWAYBILL_API.DELETE_TRANSPORTER`
- **Frontend evidence:** `invoice.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: TransporterController#deleteTransporter
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TransporterController.java:78`
- **Deprecated:** No

Delete Transporter

#### Inputs

**Path parameters**
- `PARAMETER_COMPANY_UNIQUE_NAME` — type: `String`; required
**Query parameters**
- `transporterId` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Transporter deleted successfully."`

```json
{
  "status": "success",
  "body": "Transporter deleted successfully."
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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?transporterId=SAMPLE_transporterId&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/ewb/:ewaybillNumber/download-detailed-v2`

- **Frontend id:** `EWAYBILL_API.DOWNLOAD_DETAILED_EWAY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#DownloadDetailedEwayBills`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#downloadEWBDetailedWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:319`
- **Deprecated:** No

Download EWBDetailed With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `ewbno` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `type` — type: `String`; optional; default: `base64`

#### Controller-backed request payload

None.

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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `URISYNTAX` | `URISyntaxException` | URISyntaxException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/SAMPLE_ewbno/download-detailed-v2?branchUniqueName=aaaa&type=base64' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/ewb/:ewaybillNumber/download-v2`

- **Frontend id:** `EWAYBILL_API.DOWNLOAD_EWAY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#DownloadEwayBills`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#downloadEWBWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:260`
- **Deprecated:** No

Download EWBWith Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `ewbno` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `base64`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `URISYNTAX` | `URISyntaxException` | URISyntaxException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/SAMPLE_ewbno/download-v2?type=base64&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /country/cities?pinCode=:pinCode`

- **Frontend id:** `EWAYBILL_API.EWAYBILL_FROM_PLACE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getEwayBillFromPlace`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CountryAndStateController#getCityByPinCode
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/CountryAndStateController.java:89`
- **Deprecated:** No

Get City By Pin Code

#### Inputs

**Query parameters**
- `pinCode` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `countryAndStateService.getCityByPinCode(pinCode`

```json
{
  "status": "success",
  "body": {
    "body": {}
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "JSON_PROCESSING",
  "message": "Json Processing"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/country/cities?pinCode=SAMPLE_pinCode' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/ewb`

- **Frontend id:** `EWAYBILL_API.GENERATE_EWAYBILL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GenerateNewEwaybill; apps/web-giddh/src/app/services/invoice.service.ts#getAllEwaybillsList; apps/web-giddh/src/app/services/invoice.service.ts#getAllEwaybillsfilterList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#generateEWayBill
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:66`
- **Deprecated:** No

Generate EWay Bill

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `EwayBillRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
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
| 400 | `EWAY_BILL` | `EwayBillException` | EwayBillException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EWAY_BILL",
  "message": "Eway Bill"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as IEwayBillAllList`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/ewb`

- **Frontend id:** `EWAYBILL_API.GENERATE_EWAYBILL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GenerateNewEwaybill; apps/web-giddh/src/app/services/invoice.service.ts#getAllEwaybillsList; apps/web-giddh/src/app/services/invoice.service.ts#getAllEwaybillsfilterList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:207`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `String`; optional; default: `1`
- `count` — type: `String`; optional; default: `10`
- `sort` — type: `String`; optional; default: `asc`
- `branchUniqueName` — type: `String`; optional
- `gstin` — type: `String`; optional; default: `gstin`
- `sortBy` — type: `String`; optional; default: `billingDate`
- `searchTerm` — type: `String`; optional
- `searchOn` — type: `String`; optional
- `fromDate` — type: `String`; optional
- `failedRequestLog` — type: `boolean`; optional
- `toDate` — type: `String`; optional

#### Controller-backed request payload

None.

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
- `body as IEwayBillAllList`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb?page=1&count=10&sort=asc&branchUniqueName=aaaa&gstin=gstin&sortBy=billingDate&searchTerm=SAMPLE_searchTerm&searchOn=SAMPLE_searchOn&fromDate=SAMPLE_fromDate&failedRequestLog=SAMPLE_failedRequestLog&toDate=SAMPLE_toDate' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/transporters?page=:pageNo`

- **Frontend id:** `EWAYBILL_API.GET_ALL_TRANSPORTER`
- **Frontend evidence:** `invoice.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: TransporterController#getAllTransporter
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TransporterController.java:104`
- **Deprecated:** No

Get All Transporter

#### Inputs

**Path parameters**
- `PARAMETER_COMPANY_UNIQUE_NAME` — type: `String`; required
**Query parameters**
- `PARAMETER_QUERY` — type: `String`; optional; default: ``
- `PARAMETER_PAGE` — type: `String`; optional; default: `DEFAULT_VALUE_FOR_PAGE`
- `PARAMETER_COUNT` — type: `String`; optional; default: `10`
- `sort` — type: `String`; optional; default: `PARAMETER_ASC`
- `sortBy` — type: `String`; optional; default: `PARAMATER_TRANSPORTER_NAME`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `transporterResource`

```json
{
  "status": "success",
  "body": {
    "reference": "transporterResource"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?PARAMETER_QUERY=&PARAMETER_PAGE=DEFAULT_VALUE_FOR_PAGE&PARAMETER_COUNT=10&sort=PARAMETER_ASC&sortBy=PARAMATER_TRANSPORTER_NAME&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/ewb/user`

- **Frontend id:** `EWAYBILL_API.LOGIN_EWAYBILL_USER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#LoginEwaybillUser; apps/web-giddh/src/app/services/invoice.service.ts#IsUserLoginEwayBill`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#authenticateUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:102`
- **Deprecated:** No

Authenticate User

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `EwayBillUserResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/user?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/ewb/user`

- **Frontend id:** `EWAYBILL_API.LOGIN_EWAYBILL_USER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#LoginEwaybillUser; apps/web-giddh/src/app/services/invoice.service.ts#IsUserLoginEwayBill`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#getUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:124`
- **Deprecated:** No

Returns true/false if E-way bill credentials are saved (no credential details exposed).

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `isConfigured`

```json
{
  "status": "success",
  "body": {
    "reference": "isConfigured"
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/user?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/ewb/vehicle`

- **Frontend id:** `EWAYBILL_API.UPDATE_EWAY_VEHICLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#updateEwayVehicle`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#updateVehicleNumber
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:476`
- **Deprecated:** No

Update Vehicle Number

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `VehicleUpdateRequest` (required).

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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/vehicle?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PUT /company/:companyUniqueName/transporters?transporterId=:transporterId`

- **Frontend id:** `EWAYBILL_API.UPDATE_TRANSPORTER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#UpdateGeneratedTransporter; apps/web-giddh/src/app/services/invoice.service.ts#deleteTransporterById`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TransporterController#updateTransporter
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TransporterController.java:64`
- **Deprecated:** No

Update Transporter

#### Inputs

**Path parameters**
- `PARAMETER_COMPANY_UNIQUE_NAME` — type: `String`; required
**Query parameters**
- `transporterId` — type: `String`; required

#### Controller-backed request payload

Type: `TransporterRequest` (required).

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
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |

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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?transporterId=SAMPLE_transporterId&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/transporters?transporterId=:transporterId`

- **Frontend id:** `EWAYBILL_API.UPDATE_TRANSPORTER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#UpdateGeneratedTransporter; apps/web-giddh/src/app/services/invoice.service.ts#deleteTransporterById`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TransporterController#deleteTransporter
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TransporterController.java:78`
- **Deprecated:** No

Delete Transporter

#### Inputs

**Path parameters**
- `PARAMETER_COMPANY_UNIQUE_NAME` — type: `String`; required
**Query parameters**
- `transporterId` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Transporter deleted successfully."`

```json
{
  "status": "success",
  "body": "Transporter deleted successfully."
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/transporters?transporterId=SAMPLE_transporterId&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/ewb/validate-invoice`

- **Frontend id:** `EWAYBILL_API.VALIDATE_INVOICE_EWAYBILL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#validateInvoiceForEwaybill`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EWayBillController#validateInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/EWayBillController.java:794`
- **Deprecated:** No

Validate Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `EwbFetch` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `responseMessage`

```json
{
  "status": "success",
  "body": {
    "reference": "responseMessage"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ewb/validate-invoice?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/cancel-einvoice`

- **Frontend id:** `INVOICE_API_2.CANCEL_E_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#cancelEInvoiceV2; apps/web-giddh/src/app/services/voucher.service.ts#cancelEInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#cancelEInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:393`
- **Deprecated:** No

Cancel EInvoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `cnlRsn` — type: `String`; required
- `cnlRem` — type: `String`; required

#### Controller-backed request payload

Type: `VoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `email` | `GiddhEmail` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `copyTypes` | `Set<String>` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `entryUniqueName` | `String` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `certId` | `String` | not declared | unconstrained |
| `certificateBase64` | `String` | not declared | unconstrained |
| `certificateChainBase64` | `java.util.List<String>` | not declared | unconstrained |
| `showSectionsInline` | `boolean` | not declared | unconstrained |
| `fileType` | `FileType` | not declared | PDF, XLS, XLSX, CSV, BASE64HTML, BASE64, JSON, ZIP, JPEG |
| `from` | `LocalDate` | not declared | unconstrained |
| `to` | `LocalDate` | not declared | unconstrained |

Example:

```json
{
  "email": "string",
  "voucherType": "string",
  "selectAllFields": [],
  "copyTypes": [],
  "uniqueName": "string",
  "entryUniqueName": "string",
  "paymentId": "string",
  "certId": "string",
  "certificateBase64": "string",
  "certificateChainBase64": [],
  "showSectionsInline": false,
  "fileType": "PDF",
  "from": "01-04-2025",
  "to": "01-04-2025"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("success.einvoice.irn.canceled.voucher"`

```json
{
  "status": "success",
  "body": "success.einvoice.irn.canceled.voucher"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/cancel-einvoice?branchUniqueName=aaaa&cnlRsn=SAMPLE_cnlRsn&cnlRem=SAMPLE_cnlRem' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","voucherType":"string","selectAllFields":[],"copyTypes":[],"uniqueName":"string","entryUniqueName":"string","paymentId":"string","certId":"string","certificateBase64":"string","certificateChainBase64":[],"showSectionsInline":false,"fileType":"PDF","from":"01-04-2025","to":"01-04-2025"}'
```

---

### `DELETE /company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `INVOICE_API_2.DELETE_VOUCHER`
- **Frontend evidence:** `invoice.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: VoucherController#deleteInvoice; accounting-microservice: VoucherController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:270`
- **Deprecated:** No

Delete Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
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
- Body evidence: `"Deleted Voucher Successfully!"`

```json
{
  "status": "success",
  "body": "Deleted Voucher Successfully!"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Voucher type must not be empty or null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=pdf`

- **Frontend id:** `INVOICE_API_2.DOWNLOAD_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#DownloadInvoice`
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

### `POST /v4/company/:companyUniqueName/vouchers/bulk-generate?combined`

- **Frontend id:** `INVOICE_API_2.GENERATE_BULK_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GenerateBulkInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#bulkCreate
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:370`
- **Deprecated:** No

Bulk Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `combined` — type: `boolean`; required

#### Controller-backed request payload

Type: `MultiVoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `combined` | `boolean` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "combined": false,
  "number": "string",
  "entryUniqueNames": [],
  "generateEInvoice": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Vouchers created successfully."`

```json
{
  "status": "success",
  "body": "Vouchers created successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `error.code.entry.notFound` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INTERRUPTED",
  "message": "Interrupted"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers/bulk-generate?branchUniqueName=aaaa&combined=SAMPLE_combined' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"combined":false,"number":"string","entryUniqueNames":[],"generateEInvoice":false}'
```

---

### `POST /v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/generate`

- **Frontend id:** `INVOICE_API_2.GENERATE_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GenerateInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceV2Controller#generateInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceV2Controller.java:81`
- **Deprecated:** No

Generate Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `GenerateInvoiceRequestV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueNames` | `Set<String>` | not declared | unconstrained |
| `templateUniqueName` | `String` | not declared | unconstrained |
| `imageSignatureUniqueName` | `String` | not declared | unconstrained |
| `invoice` | `InvoiceTemplatePreviewResponse` | not declared | unconstrained |
| `voucherDoc` | `VoucherResponse` | not declared | unconstrained |
| `validateTax` | `Boolean` | not declared | unconstrained |
| `invoiceDate` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `paymentAction` | `PaymentAction` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "uniqueNames": [],
  "templateUniqueName": "string",
  "imageSignatureUniqueName": "string",
  "invoice": "string",
  "voucherDoc": "string",
  "validateTax": false,
  "invoiceDate": "string",
  "dueDate": "string",
  "accountUniqueName": "string",
  "updateAccountDetails": false,
  "applyApplicableTaxes": false,
  "paymentAction": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "roundOffApplicable": false
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `String.format("Invoice generated successfully with invoice number: %s.", savedInvoice.getInvoiceNumber(`

```json
{
  "status": "success",
  "body": "Invoice generated successfully with invoice number: %s."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GenerateInvoiceRequestClass`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueNames":[],"templateUniqueName":"string","imageSignatureUniqueName":"string","invoice":"string","voucherDoc":"string","validateTax":false,"invoiceDate":"string","dueDate":"string","accountUniqueName":"string","updateAccountDetails":false,"applyApplicableTaxes":false,"paymentAction":"string","touristSchemeApplicable":false,"passportNumber":"string","roundOffApplicable":false}'
```

---

### `POST /v2/company/:companyUniqueName/accounts/:accountUniqueName/invoice/preview`

- **Frontend id:** `INVOICE_API_2.GENERATED_INVOICE_PREVIEW`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetGeneratedInvoicePreview`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceV2Controller#generatedInvoicePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceV2Controller.java:212`
- **Deprecated:** No

Generated Invoice Preview

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
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
- Body evidence: `invoiceTemplatePreviewResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "invoiceTemplatePreviewResponse"
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
- `body as PreviewInvoiceResponseClass`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoice/preview?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `GET /v2/company/:companyUniqueName/templates/:templateUniqueName`

- **Frontend id:** `INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetInvoiceTemplateDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#getTemplate; accounting-microservice: VoucherController#downloadTemplatePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:70`
- **Deprecated:** No

Get Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `invoice`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `templateServiceV2.getTemplate(company, templateUniqueName, type`

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
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
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
- `body as InvoiceTemplateDetailsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?type=invoice&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/preview`

- **Frontend id:** `INVOICE_API_2.PREVIEW_VOUCHERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#PreviewInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#getInvoicePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:322`
- **Deprecated:** No

Get Invoice Preview

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `InvoiceRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueNames` | `Set<String>` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `depositEntryTotal` | `BigDecimal` | not declared | unconstrained |

Example:

```json
{
  "uniqueNames": [],
  "dueDate": "string",
  "voucherType": "string",
  "depositEntryTotal": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherService.previewVoucherForGenerate(principal, company, invoiceRequest, request`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/preview?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueNames":[],"dueDate":"string","voucherType":"string","depositEntryTotal":0}'
```

---

### `POST /v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `INVOICE_API_2.PREVIEW_VOUCHERS_V4`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#PreviewInvoice; apps/web-giddh/src/app/services/voucher.service.ts#getEntriesByEntryUniqueNames`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#getVoucher; accounting-microservice: VoucherController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:169`
- **Deprecated:** No

This function is use to get the voucher by provide voucher number and voucher type.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

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
- Body evidence: `voucherService.getVoucher(company, account, customInvoiceNumberRequestBody.getVoucherType(`

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
| 400 | `error.code.invalidParameter` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "error.code.invalidParameter",
  "message": "error.company.account.not.null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/mail`

- **Frontend id:** `INVOICE_API_2.SEND_INVOICE_ON_MAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#SendInvoiceOnMail; apps/web-giddh/src/app/services/voucher.service.ts#sendVoucherOnEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#mailInvoice; accounting-microservice: VoucherController#mail
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:252`
- **Deprecated:** No

Mail Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

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
- Body evidence: `"Email sent successfully!"`

```json
{
  "status": "success",
  "body": "Email sent successfully!"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/mail?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherNumber":[],"emailId":[],"template":"string","cancel":false,"voucherType":"string","typeOfInvoice":[],"debugMode":false}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/:voucherNumber/magic-link?expirey=1`

- **Frontend id:** `INVOICE_API_2.SEND_INVOICE_ON_SMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#SendInvoiceOnSms`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#generateMagicLink
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:296`
- **Deprecated:** No

Generate Magic Link

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherNumber` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `expiry` — type: `int`; optional; default: `1`

#### Controller-backed request payload

Type: `MagicLinkVoucherRequest` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `numbers` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "numbers": []
}
```

#### Success response

- HTTP status: `201 CREATED`
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `UNSUPPORTED_ENCODING` | `UnsupportedEncodingException` | UnsupportedEncodingException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/SAMPLE_voucherNumber/magic-link?branchUniqueName=aaaa&expiry=1' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"numbers":[]}'
```

---

### `PUT /v2/company/:companyUniqueName/accounts/:accountUniqueName/invoices/`

- **Frontend id:** `INVOICE_API_2.UPDATE_GENERATED_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#UpdateGeneratedInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceV2Controller#updateInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceV2Controller.java:97`
- **Deprecated:** No

Update Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `GenerateInvoiceRequestV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueNames` | `Set<String>` | not declared | unconstrained |
| `templateUniqueName` | `String` | not declared | unconstrained |
| `imageSignatureUniqueName` | `String` | not declared | unconstrained |
| `invoice` | `InvoiceTemplatePreviewResponse` | not declared | unconstrained |
| `voucherDoc` | `VoucherResponse` | not declared | unconstrained |
| `validateTax` | `Boolean` | not declared | unconstrained |
| `invoiceDate` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `paymentAction` | `PaymentAction` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "uniqueNames": [],
  "templateUniqueName": "string",
  "imageSignatureUniqueName": "string",
  "invoice": "string",
  "voucherDoc": "string",
  "validateTax": false,
  "invoiceDate": "string",
  "dueDate": "string",
  "accountUniqueName": "string",
  "updateAccountDetails": false,
  "applyApplicableTaxes": false,
  "paymentAction": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "roundOffApplicable": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Invoice updated successfully."`

```json
{
  "status": "success",
  "body": "Invoice updated successfully."
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueNames":[],"templateUniqueName":"string","imageSignatureUniqueName":"string","invoice":"string","voucherDoc":"string","validateTax":false,"invoiceDate":"string","dueDate":"string","accountUniqueName":"string","updateAccountDetails":false,"applyApplicableTaxes":false,"paymentAction":"string","touristSchemeApplicable":false,"passportNumber":"string","roundOffApplicable":false}'
```

---

### `POST /company/:companyUniqueName/invoices/:invoiceUniqueName/action`

- **Frontend id:** `INVOICE_API.ACTION_ON_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#PerformActionOnInvoice; apps/web-giddh/src/app/services/voucher.service.ts#actionVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceController#payInvoice; accounting-microservice: VoucherController#action
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceController.java:217`
- **Deprecated:** No

Pay Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `invoiceUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `PaymentAction` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountName` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `amountForCompany` | `BigDecimal` | not declared | unconstrained |
| `paymentDate` | `String` | not declared | unconstrained |
| `tagUniqueName` | `String` | not declared | unconstrained |
| `chequeClearanceDate` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "accountName": "string",
  "accountUniqueName": "string",
  "chequeNumber": "string",
  "description": "string",
  "action": "string",
  "exchangeRate": 0,
  "amount": 0,
  "amountForCompany": 0,
  "paymentDate": "string",
  "tagUniqueName": "string",
  "chequeClearanceDate": "string",
  "voucherType": "string",
  "valuesInAccountCurrency": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Invoice Successfully Updated."`

```json
{
  "status": "success",
  "body": "Invoice Successfully Updated."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoices/SAMPLE_invoiceUniqueName/action?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountName":"string","accountUniqueName":"string","chequeNumber":"string","description":"string","action":"string","exchangeRate":0,"amount":0,"amountForCompany":0,"paymentDate":"string","tagUniqueName":"string","chequeClearanceDate":"string","voucherType":"string","valuesInAccountCurrency":false}'
```

---

### `POST /company/:companyUniqueName/voucher/:voucherUniqueName/cancel-einvoice`

- **Frontend id:** `INVOICE_API.CANCEL_CN_DN_E_INVOICE_API`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#cancelEInvoice; apps/web-giddh/src/app/services/invoice.service.ts#cancelEInvoiceV2; apps/web-giddh/src/app/services/voucher.service.ts#cancelEInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherDocController#cancelEInvoiceForVoucher
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherDocController.java:148`
- **Deprecated:** No

Cancel EInvoice For Voucher

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `voucherType` — type: `String`; required
- `cnlRsn` — type: `String`; required
- `cnlRem` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.einvoice.irn.cancelled.voucher"`

```json
{
  "status": "success",
  "body": "success.einvoice.irn.cancelled.voucher"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/voucher/SAMPLE_VOUCHER/cancel-einvoice?voucherType=SAMPLE_voucherType&cnlRsn=SAMPLE_cnlRsn&cnlRem=SAMPLE_cnlRem&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/invoice/:invoiceUniqueName/cancel-einvoice`

- **Frontend id:** `INVOICE_API.CANCEL_E_INVOICE_API`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#cancelEInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceController#cancelEInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceController.java:301`
- **Deprecated:** No

Cancel EInvoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `invoiceUniqueName` — type: `String`; required
**Query parameters**
- `cnlRsn` — type: `String`; required
- `cnlRem` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.einvoice.irn.cancelled.invoice"`

```json
{
  "status": "success",
  "body": "success.einvoice.irn.cancelled.invoice"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoice/SAMPLE_invoiceUniqueName/cancel-einvoice?cnlRsn=SAMPLE_cnlRsn&cnlRem=SAMPLE_cnlRem&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/templates`

- **Frontend id:** `INVOICE_API.CREATE_NEW_TEMPLATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#saveTemplates`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#createTemplate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:47`
- **Deprecated:** No

Create Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TemplateRequestV3` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `isSample` | `Boolean` | not declared | unconstrained |
| `sections` | `Map<String, Map<String, Map<String, TemplateContentV4>>>` | not declared | unconstrained |
| `templateColor` | `String` | not declared | unconstrained |
| `tableColor` | `String` | not declared | unconstrained |
| `font` | `String` | not declared | unconstrained |
| `fontDefault` | `int` | not declared | unconstrained |
| `topMargin` | `float` | not declared | unconstrained |
| `leftMargin` | `float` | not declared | unconstrained |
| `bottomMargin` | `float` | not declared | unconstrained |
| `rightMargin` | `float` | not declared | unconstrained |
| `logoPosition` | `String` | not declared | unconstrained |
| `logoSize` | `String` | not declared | unconstrained |
| `isDefault` | `Boolean` | not declared | unconstrained |
| `isDefaultForVoucher` | `Boolean` | not declared | unconstrained |
| `copyFrom` | `String` | not declared | unconstrained |
| `logoUniqueName` | `String` | not declared | unconstrained |
| `qrCodeId` | `String` | not declared | unconstrained |
| `showBankQrCode` | `Boolean` | not declared | unconstrained |
| `isActive` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `templateType` | `String` | not declared | unconstrained |
| `isThermal` | `Boolean` | not declared | unconstrained |
| `showSectionsInline` | `Boolean` | not declared | unconstrained |
| `accountCustomFieldUniqueNames` | `List<String>` | not declared | unconstrained |
| `enableSecondaryLanguage` | `Boolean` | not declared | unconstrained |
| `language1Code` | `String` | not declared | unconstrained |
| `language2Code` | `String` | not declared | unconstrained |
| `displayLanguage1` | `Boolean` | not declared | unconstrained |
| `displayLanguage2` | `Boolean` | not declared | unconstrained |
| `showLanguage2DisplayedFirst` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "isSample": false,
  "sections": {},
  "templateColor": "string",
  "tableColor": "string",
  "font": "string",
  "fontDefault": 0,
  "topMargin": 0,
  "leftMargin": 0,
  "bottomMargin": 0,
  "rightMargin": 0,
  "logoPosition": "string",
  "logoSize": "string",
  "isDefault": false,
  "isDefaultForVoucher": false,
  "copyFrom": "string",
  "logoUniqueName": "string",
  "qrCodeId": "string",
  "showBankQrCode": false,
  "isActive": "string",
  "type": "string",
  "templateType": "string",
  "isThermal": false,
  "showSectionsInline": false,
  "accountCustomFieldUniqueNames": [],
  "enableSecondaryLanguage": false,
  "language1Code": "string",
  "language2Code": "string",
  "displayLanguage1": false,
  "displayLanguage2": false,
  "showLanguage2DisplayedFirst": false
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `createTemplate`

```json
{
  "status": "success",
  "body": {
    "reference": "createTemplate"
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","isSample":false,"sections":{},"templateColor":"string","tableColor":"string","font":"string","fontDefault":0,"topMargin":0,"leftMargin":0,"bottomMargin":0,"rightMargin":0,"logoPosition":"string","logoSize":"string","isDefault":false,"isDefaultForVoucher":false,"copyFrom":"string","logoUniqueName":"string","qrCodeId":"string","showBankQrCode":false,"isActive":"string","type":"string","templateType":"string","isThermal":false,"showSectionsInline":false,"accountCustomFieldUniqueNames":[],"enableSecondaryLanguage":false,"language1Code":"string","language2Code":"string","displayLanguage1":false,"displayLanguage2":false,"showLanguage2DisplayedFirst":false}'
```

---

### `DELETE /company/:companyUniqueName/invoices`

- **Frontend id:** `INVOICE_API.DELETE_INVOICE`
- **Frontend evidence:** `invoice.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: InvoiceController#deleteInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceController.java:108`
- **Deprecated:** No

Delete Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

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
- Body evidence: `"Deleted Successfully!!"`

```json
{
  "status": "success",
  "body": "Deleted Successfully!!"
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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoices?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `DELETE /v2/company/:companyUniqueName/templates/:templateUniqueName`

- **Frontend id:** `INVOICE_API.DELETE_TEMPLATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#deleteTemplate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#deleteTemplate; accounting-microservice: VoucherController#downloadTemplatePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:96`
- **Deprecated:** No

Delete Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Template Deleted Successfully."`

```json
{
  "status": "success",
  "body": "Template Deleted Successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "JSON",
  "message": "JSON"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/export-invoices-v2?from=:from&to=:to&fileType=:fileType`

- **Frontend id:** `INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#exportCsvInvoiceDownload; apps/web-giddh/src/app/services/voucher.service.ts#exportVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#exportVouchersWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:613`
- **Deprecated:** No

Export Vouchers With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `noteType` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `voucherCount` — type: `int`; optional; default: `10`
- `q` — type: `String`; optional; default: ``
- `fileType` — type: `String`; optional; default: `xlsx`

#### Controller-backed request payload

Type: `VoucherFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `type` | `String` | not declared | unconstrained |
| `noteVoucherType` | `String` | not declared | unconstrained |
| `fromDate` | `LocalDate` | not declared | unconstrained |
| `toDate` | `LocalDate` | not declared | unconstrained |
| `receiptType` | `ReceiptType` | not declared | ADVANCE_RECEIPT, NORMAL_RECEIPT |
| `source` | `String` | not declared | unconstrained |
| `attachmentExport` | `Boolean` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `voucherExport` | `boolean` | not declared | unconstrained |
| `fileNameFormat` | `String` | not declared | unconstrained |
| `showVoucherCustomFields` | `boolean` | not declared | unconstrained |
| `showAccountCustomFields` | `boolean` | not declared | unconstrained |
| `showBillingAddress` | `boolean` | not declared | unconstrained |
| `showShippingAddress` | `boolean` | not declared | unconstrained |
| `showTaxableValueBeforeDiscount` | `boolean` | not declared | unconstrained |
| `showDiscountValue` | `boolean` | not declared | unconstrained |
| `showTaxValue` | `boolean` | not declared | unconstrained |
| `showShippingDetails` | `boolean` | not declared | unconstrained |
| `showVoucherNote` | `boolean` | not declared | unconstrained |
| `showEInvoiceDetails` | `boolean` | not declared | unconstrained |
| `showMobileNumber` | `boolean` | not declared | unconstrained |
| `showAttentionTo` | `boolean` | not declared | unconstrained |
| `showEmail` | `boolean` | not declared | unconstrained |
| `showOtherTaxValue` | `boolean` | not declared | unconstrained |
| `dueDate` | `LocalDate` | not declared | unconstrained |
| `dueDateBefore` | `Boolean` | not declared | unconstrained |
| `dueDateAfter` | `Boolean` | not declared | unconstrained |
| `dueDateEqual` | `Boolean` | not declared | unconstrained |
| `voucherDate` | `LocalDate` | not declared | unconstrained |
| `voucherDateBefore` | `Boolean` | not declared | unconstrained |
| `voucherDateAfter` | `Boolean` | not declared | unconstrained |
| `voucherDateEqual` | `Boolean` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `q` | `String` | not declared | unconstrained |
| `fileType` | `String` | not declared | unconstrained |
| `voucherCount` | `int` | not declared | unconstrained |
| `groupIds` | `Set<Long>` | not declared | unconstrained |
| `accountIds` | `Set<Long>` | not declared | unconstrained |
| `voucherIds` | `Set<Long>` | not declared | unconstrained |
| `uniqueNames` | `Set<String>` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `balanceDue` | `BigDecimal` | not declared | unconstrained |
| `balanceEqual` | `Boolean` | not declared | unconstrained |
| `balanceMoreThan` | `Boolean` | not declared | unconstrained |
| `balanceLessThan` | `Boolean` | not declared | unconstrained |
| `total` | `BigDecimal` | not declared | unconstrained |
| `totalEqual` | `Boolean` | not declared | unconstrained |
| `totalMoreThan` | `Boolean` | not declared | unconstrained |
| `totalLessThan` | `Boolean` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `copyTypes` | `Set<String>` | not declared | unconstrained |
| `eInvoiceStatus` | `Set<String>` | not declared | unconstrained |
| `balanceStatus` | `Set<String>` | not declared | unconstrained |
| `purchaseOrderNumber` | `String` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |
| `exportType` | `ExportType` | not declared | EXPORT_WITH_PAY, EXPORT_WITHOUT_PAY, BULK_INVOICE_EXPORT, ALL_VOUCHERS_EXPORT, MASTER_VOUCHERS_EXPORT |
| `totalVouchers` | `Long` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |
| `mergePdf` | `Boolean` | not declared | unconstrained |
| `exportFromLedger` | `boolean` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "type": "string",
  "noteVoucherType": "string",
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "receiptType": "ADVANCE_RECEIPT",
  "source": "string",
  "attachmentExport": false,
  "selectAllFields": [],
  "voucherExport": false,
  "fileNameFormat": "string",
  "showVoucherCustomFields": false,
  "showAccountCustomFields": false,
  "showBillingAddress": false,
  "showShippingAddress": false,
  "showTaxableValueBeforeDiscount": false,
  "showDiscountValue": false,
  "showTaxValue": false,
  "showShippingDetails": false,
  "showVoucherNote": false,
  "showEInvoiceDetails": false,
  "showMobileNumber": false,
  "showAttentionTo": false,
  "showEmail": false,
  "showOtherTaxValue": false,
  "dueDate": "01-04-2025",
  "dueDateBefore": false,
  "dueDateAfter": false,
  "dueDateEqual": false,
  "voucherDate": "01-04-2025",
  "voucherDateBefore": false,
  "voucherDateAfter": false,
  "voucherDateEqual": false,
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "q": "string",
  "fileType": "string",
  "voucherCount": 0,
  "groupIds": [],
  "accountIds": [],
  "voucherIds": [],
  "uniqueNames": [],
  "entryUniqueNames": [],
  "balanceDue": 0,
  "balanceEqual": false,
  "balanceMoreThan": false,
  "balanceLessThan": false,
  "total": 0,
  "totalEqual": false,
  "totalMoreThan": false,
  "totalLessThan": false,
  "description": "string",
  "accountUniqueName": "string",
  "groupUniqueName": "string",
  "copyTypes": [],
  "eInvoiceStatus": [],
  "balanceStatus": [],
  "purchaseOrderNumber": "string",
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "userId": 0,
  "exportType": "EXPORT_WITH_PAY",
  "totalVouchers": 0,
  "requestId": "string",
  "mergePdf": false,
  "exportFromLedger": false,
  "salesPersonUniqueNames": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `object`

```json
{
  "status": "success",
  "body": {
    "reference": "object"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-invoices-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&voucherCount=10&q=&fileType=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /v4/company/:companyUniqueName/accounts/:accountuniquename/vouchers/bulk-generate?combined`

- **Frontend id:** `INVOICE_API.GENERATE_BULK_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GenerateBulkInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#bulkGenerate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:188`
- **Deprecated:** No

Bulk Generate

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `combined` — type: `String`; required
- `refresh` — type: `boolean`; optional; default: `false`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `List<BulkVoucherRequest>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountUniqueName` | `String` | not declared | unconstrained |
| `entries` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "accountUniqueName": "string",
  "entries": []
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
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/bulk-generate?combined=SAMPLE_combined&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountUniqueName":"string","entries":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/invoices/generate`

- **Frontend id:** `INVOICE_API.GENERATE_INVOICE`
- **Frontend evidence:** `invoice.api.ts · invoice.service.ts#GenerateInvoice`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: InvoiceController#generateInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceController.java:91`
- **Deprecated:** No

Generate Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `GenerateInvoiceRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueNames` | `Set<String>` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `providedNumber` | `String` | not declared | unconstrained |
| `invoice` | `InvoiceTemplatePreviewResponse` | not declared | unconstrained |
| `voucherDoc` | `VoucherDoc` | not declared | unconstrained |
| `validateTax` | `Boolean` | not declared | unconstrained |
| `invoiceDate` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `templateUniqueName` | `String` | not declared | unconstrained |
| `imageSignatureUniqueName` | `String` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `availItc` | `Boolean` | not declared | unconstrained |
| `depositEntry` | `LedgerRequest` | not declared | unconstrained |
| `paymentAction` | `PaymentAction` | not declared | unconstrained |
| `depositAccountUniqueName` | `String` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "uniqueNames": [],
  "taxes": [],
  "providedNumber": "string",
  "invoice": "string",
  "voucherDoc": "string",
  "validateTax": false,
  "invoiceDate": "string",
  "dueDate": "string",
  "accountUniqueName": "string",
  "updateAccountDetails": false,
  "templateUniqueName": "string",
  "imageSignatureUniqueName": "string",
  "sendToGstr2": false,
  "availItc": false,
  "depositEntry": "string",
  "paymentAction": "string",
  "depositAccountUniqueName": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "roundOffApplicable": false
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `String.format("Invoice generated successfully with invoice number: %s.", savedInvoice.getInvoiceNumber(`

```json
{
  "status": "success",
  "body": "Invoice generated successfully with invoice number: %s."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as GenerateInvoiceRequestClass`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueNames":[],"taxes":[],"providedNumber":"string","invoice":"string","voucherDoc":"string","validateTax":false,"invoiceDate":"string","dueDate":"string","accountUniqueName":"string","updateAccountDetails":false,"templateUniqueName":"string","imageSignatureUniqueName":"string","sendToGstr2":false,"availItc":false,"depositEntry":"string","paymentAction":"string","depositAccountUniqueName":"string","touristSchemeApplicable":false,"passportNumber":"string","roundOffApplicable":false}'
```

---

### `POST /company/:companyUniqueName/ledgers?`

- **Frontend id:** `INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetAllLedgersForInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllLedgers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:364`
- **Deprecated:** No

Get All Ledgers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `date`
- `voucherType` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `EntrySearch` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountUniqueName` | `String` | not declared | unconstrained |
| `particularUniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `entryTotal` | `BigDecimal` | not declared | unconstrained |
| `totalIsEqual` | `Boolean` | not declared | unconstrained |
| `totalIsLess` | `Boolean` | not declared | unconstrained |
| `totalIsMore` | `Boolean` | not declared | unconstrained |
| `entryDate` | `String` | not declared | unconstrained |
| `dateIsEqual` | `Boolean` | not declared | unconstrained |
| `dateIsBefore` | `Boolean` | not declared | unconstrained |
| `dateIsAfter` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "accountUniqueName": "string",
  "particularUniqueName": "string",
  "description": "string",
  "entryTotal": 0,
  "totalIsEqual": false,
  "totalIsLess": false,
  "totalIsMore": false,
  "entryDate": "string",
  "dateIsEqual": false,
  "dateIsBefore": false,
  "dateIsAfter": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedLedgers`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedLedgers"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledgers?page=1&count=50&from=01-04-2025&to=31-03-2026&sort=desc&sortBy=date&voucherType=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountUniqueName":"string","particularUniqueName":"string","description":"string","entryTotal":0,"totalIsEqual":false,"totalIsLess":false,"totalIsMore":false,"entryDate":"string","dateIsEqual":false,"dateIsBefore":false,"dateIsAfter":false}'
```

---

### `GET /company/:companyUniqueName/voucher/:voucherUniqueName/versions?page=:page&count=:count`

- **Frontend id:** `INVOICE_API.GET_ALL_VERSIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#getVoucherVersions; apps/web-giddh/src/app/services/voucher.service.ts#getVoucherVersions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#getVoucherVersion
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:560`
- **Deprecated:** No

Get Voucher Version

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherService.getVoucherAllVersion(voucher, page, count`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/voucher/SAMPLE_VOUCHER/versions?page=1&count=10&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/templates?type=:voucherType`

- **Frontend id:** `INVOICE_API.GET_CREATED_TEMPLATES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#getAllCreatedTemplates; apps/web-giddh/src/app/services/voucher.service.ts#getAllCreatedTemplates`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#getAllTemplatesV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:59`
- **Deprecated:** No

Get All Templates V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `invoice`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `templateResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "templateResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "JSON",
  "message": "JSON"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as CustomTemplateResponse[]`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates?type=invoice&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/razorpay`

- **Frontend id:** `INVOICE_API.GET_RAZORPAY_DETAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#UpdateRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#DeleteRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#SaveRazorPayDetail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RazorPayController#getRazorPayAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RazorPayController.java:109`
- **Deprecated:** No

Get Razor Pay Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `savedRazorPayUser`

```json
{
  "status": "success",
  "body": {
    "reference": "savedRazorPayUser"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `UNSUPPORTED_ENCODING` | `UnsupportedEncodingException` | UnsupportedEncodingException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

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
- `body as RazorPayDetailsResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/razorpay`

- **Frontend id:** `INVOICE_API.GET_RAZORPAY_DETAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#UpdateRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#DeleteRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#SaveRazorPayDetail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RazorPayController#updateOrMapRazorPayAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RazorPayController.java:73`
- **Deprecated:** No

Update Or Map Razor Pay Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RazorPayUserResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `updatedRazorPayUser`

```json
{
  "status": "success",
  "body": {
    "reference": "updatedRazorPayUser"
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
- `body as RazorPayDetailsResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/razorpay`

- **Frontend id:** `INVOICE_API.GET_RAZORPAY_DETAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#UpdateRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#DeleteRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#SaveRazorPayDetail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RazorPayController#deleteRazorPayAccountForCompany
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RazorPayController.java:99`
- **Deprecated:** No

Delete Razor Pay Account For Company

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.razorPay.delete"`

```json
{
  "status": "success",
  "body": "success.razorPay.delete"
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
- `body as RazorPayDetailsResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/razorpay`

- **Frontend id:** `INVOICE_API.GET_RAZORPAY_DETAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#UpdateRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#DeleteRazorPayDetail; apps/web-giddh/src/app/services/invoice.service.ts#SaveRazorPayDetail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RazorPayController#addRazorPayAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RazorPayController.java:46`
- **Deprecated:** No

Add Razor Pay Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RazorPayUserResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `saveMessage`

```json
{
  "status": "success",
  "body": {
    "reference": "saveMessage"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `body as RazorPayDetailsResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /v2/company/:companyUniqueName/templates/:templateUniqueName?type=:voucherType&voucherVersion=2`

- **Frontend id:** `INVOICE_API.GET_TEMPLATE_PREVIEW`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#getTemplatePreview`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#getTemplate; accounting-microservice: VoucherController#downloadTemplatePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:70`
- **Deprecated:** No

Get Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `invoice`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `templateServiceV2.getTemplate(company, templateUniqueName, type`

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
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?type=invoice&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/sample-templates?type=:voucherType`

- **Frontend id:** `INVOICE_API.GET_USER_TEMPLATES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#getTemplates`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#getSampleTemplates
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:119`
- **Deprecated:** No

Get Sample Templates

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `invoice`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `TemplateServiceV2.getAllSampleTemplates(company, type`

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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
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
- `body as CustomTemplateResponse[]`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/sample-templates?type=invoice&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/delete-image?imgUniqueName=:imgUniqueName`

- **Frontend id:** `INVOICE_API.REMOVE_IMAGE_SIGNATURE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#removeSignature`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImageController#deleteImageByUniueName
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImageController.java:90`
- **Deprecated:** No

API - Deleting image by image unique name

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `imgUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Image deleted successfully."`

```json
{
  "status": "success",
  "body": "Image deleted successfully."
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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/delete-image?imgUniqueName=SAMPLE_imgUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/template-preview?voucherVersion=2`

- **Frontend id:** `INVOICE_API.SAVE_TEMPLATE_SETTINGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#saveTemplateSettings`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#getTemplatePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:707`
- **Deprecated:** No

Get Template Preview

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `debugMode` — type: `boolean`; optional

#### Controller-backed request payload

Type: `TemplateRequestV3` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `isSample` | `Boolean` | not declared | unconstrained |
| `sections` | `Map<String, Map<String, Map<String, TemplateContentV4>>>` | not declared | unconstrained |
| `templateColor` | `String` | not declared | unconstrained |
| `tableColor` | `String` | not declared | unconstrained |
| `font` | `String` | not declared | unconstrained |
| `fontDefault` | `int` | not declared | unconstrained |
| `fontSize` | `int` | not declared | unconstrained |
| `topMargin` | `float` | not declared | unconstrained |
| `leftMargin` | `float` | not declared | unconstrained |
| `bottomMargin` | `float` | not declared | unconstrained |
| `rightMargin` | `float` | not declared | unconstrained |
| `logoPosition` | `String` | not declared | unconstrained |
| `logoSize` | `String` | not declared | unconstrained |
| `isDefault` | `Boolean` | not declared | unconstrained |
| `isDefaultForVoucher` | `Boolean` | not declared | unconstrained |
| `copyFrom` | `String` | not declared | unconstrained |
| `logoUniqueName` | `String` | not declared | unconstrained |
| `qrCodeId` | `String` | not declared | unconstrained |
| `showBankQrCode` | `Boolean` | not declared | unconstrained |
| `isActive` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `templateType` | `String` | not declared | unconstrained |
| `isThermal` | `Boolean` | not declared | unconstrained |
| `showSectionsInline` | `Boolean` | not declared | unconstrained |
| `accountCustomFieldUniqueNames` | `Set<String>` | not declared | unconstrained |
| `enableSecondaryLanguage` | `Boolean` | not declared | unconstrained |
| `language1Code` | `String` | not declared | unconstrained |
| `language2Code` | `String` | not declared | unconstrained |
| `displayLanguage1` | `Boolean` | not declared | unconstrained |
| `displayLanguage2` | `Boolean` | not declared | unconstrained |
| `showLanguage2DisplayedFirst` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "isSample": false,
  "sections": {},
  "templateColor": "string",
  "tableColor": "string",
  "font": "string",
  "fontDefault": 0,
  "fontSize": 0,
  "topMargin": 0,
  "leftMargin": 0,
  "bottomMargin": 0,
  "rightMargin": 0,
  "logoPosition": "string",
  "logoSize": "string",
  "isDefault": false,
  "isDefaultForVoucher": false,
  "copyFrom": "string",
  "logoUniqueName": "string",
  "qrCodeId": "string",
  "showBankQrCode": false,
  "isActive": "string",
  "type": "string",
  "templateType": "string",
  "isThermal": false,
  "showSectionsInline": false,
  "accountCustomFieldUniqueNames": [],
  "enableSecondaryLanguage": false,
  "language1Code": "string",
  "language2Code": "string",
  "displayLanguage1": false,
  "displayLanguage2": false,
  "showLanguage2DisplayedFirst": false
}
```

#### Success response

- HTTP status: `500 INTERNAL_SERVER_ERROR`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/template-preview?debugMode=SAMPLE_debugMode&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","isSample":false,"sections":{},"templateColor":"string","tableColor":"string","font":"string","fontDefault":0,"fontSize":0,"topMargin":0,"leftMargin":0,"bottomMargin":0,"rightMargin":0,"logoPosition":"string","logoSize":"string","isDefault":false,"isDefaultForVoucher":false,"copyFrom":"string","logoUniqueName":"string","qrCodeId":"string","showBankQrCode":false,"isActive":"string","type":"string","templateType":"string","isThermal":false,"showSectionsInline":false,"accountCustomFieldUniqueNames":[],"enableSecondaryLanguage":false,"language1Code":"string","language2Code":"string","displayLanguage1":false,"displayLanguage2":false,"showLanguage2DisplayedFirst":false}'
```

---

### `PATCH /v2/company/:companyUniqueName/templates/:templateUniqueName/default?type=:voucherType`

- **Frontend id:** `INVOICE_API.SET_AS_DEFAULT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#setTemplateAsDefault`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#setDefaultTemplate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:107`
- **Deprecated:** No

Set Default Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `invoice`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `templateServiceV2.setDefaultTemplate(company, templateUniqueName, type`

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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName/default?type=invoice&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/settings`

- **Frontend id:** `INVOICE_API.SETTING_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetInvoiceSetting; apps/web-giddh/src/app/services/invoice.service.ts#UpdateInvoiceSetting; apps/web-giddh/src/app/services/voucher.service.ts#getInvoiceSettings`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanySettingsController#getCompanySettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanySettingsController.java:52`
- **Deprecated:** No

Get Company Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companySettings`

```json
{
  "status": "success",
  "body": {
    "reference": "companySettings"
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
- `body as InvoiceSetting`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/settings`

- **Frontend id:** `INVOICE_API.SETTING_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#GetInvoiceSetting; apps/web-giddh/src/app/services/invoice.service.ts#UpdateInvoiceSetting; apps/web-giddh/src/app/services/voucher.service.ts#getInvoiceSettings`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanySettingsController#updateCompanySettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanySettingsController.java:63`
- **Deprecated:** No

Update Company Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `CompanySettings` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `invoiceSettings` | `InvoiceSettings` | not declared | unconstrained |
| `proformaSettings` | `ProformaSettings` | not declared | unconstrained |
| `estimateSettings` | `EstimateSettings` | not declared | unconstrained |
| `purchaseBillSettings` | `PurchaseBillSettings` | not declared | unconstrained |
| `companyEmailSettings` | `CompanyEmailSettings` | not declared | unconstrained |
| `companyInventorySettings` | `CompanyInventorySettings` | not declared | unconstrained |

Example:

```json
{
  "invoiceSettings": [],
  "proformaSettings": [],
  "estimateSettings": [],
  "purchaseBillSettings": [],
  "companyEmailSettings": [],
  "companyInventorySettings": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Settings updated successfully."`

```json
{
  "status": "success",
  "body": "Settings updated successfully."
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
- `body as InvoiceSetting`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"invoiceSettings":[],"proformaSettings":[],"estimateSettings":[],"purchaseBillSettings":[],"companyEmailSettings":[],"companyInventorySettings":[]}'
```

---

### `PUT /company/:companyUniqueName/invoice-setting`

- **Frontend id:** `INVOICE_API.UPDATE_INVOICE_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#UpdateInvoiceEmail; apps/web-giddh/src/app/services/invoice.service.ts#DeleteInvoiceEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceSettingController#updateInvoiceEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceSettingController.java:41`
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoice-setting?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PUT /v2/company/:companyUniqueName/templates/:templateUniqueName`

- **Frontend id:** `INVOICE_API.UPDATE_TEMPLATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.templates.service.ts#updateTemplate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TemplateV2Controller#updateTemplate; accounting-microservice: VoucherController#downloadTemplatePreview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TemplateV2Controller.java:81`
- **Deprecated:** No

Update Template

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TemplateRequestV3` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `isSample` | `Boolean` | not declared | unconstrained |
| `sections` | `Map<String, Map<String, Map<String, TemplateContentV4>>>` | not declared | unconstrained |
| `templateColor` | `String` | not declared | unconstrained |
| `tableColor` | `String` | not declared | unconstrained |
| `font` | `String` | not declared | unconstrained |
| `fontDefault` | `int` | not declared | unconstrained |
| `topMargin` | `float` | not declared | unconstrained |
| `leftMargin` | `float` | not declared | unconstrained |
| `bottomMargin` | `float` | not declared | unconstrained |
| `rightMargin` | `float` | not declared | unconstrained |
| `logoPosition` | `String` | not declared | unconstrained |
| `logoSize` | `String` | not declared | unconstrained |
| `isDefault` | `Boolean` | not declared | unconstrained |
| `isDefaultForVoucher` | `Boolean` | not declared | unconstrained |
| `copyFrom` | `String` | not declared | unconstrained |
| `logoUniqueName` | `String` | not declared | unconstrained |
| `qrCodeId` | `String` | not declared | unconstrained |
| `showBankQrCode` | `Boolean` | not declared | unconstrained |
| `isActive` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `templateType` | `String` | not declared | unconstrained |
| `isThermal` | `Boolean` | not declared | unconstrained |
| `showSectionsInline` | `Boolean` | not declared | unconstrained |
| `accountCustomFieldUniqueNames` | `List<String>` | not declared | unconstrained |
| `enableSecondaryLanguage` | `Boolean` | not declared | unconstrained |
| `language1Code` | `String` | not declared | unconstrained |
| `language2Code` | `String` | not declared | unconstrained |
| `displayLanguage1` | `Boolean` | not declared | unconstrained |
| `displayLanguage2` | `Boolean` | not declared | unconstrained |
| `showLanguage2DisplayedFirst` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "isSample": false,
  "sections": {},
  "templateColor": "string",
  "tableColor": "string",
  "font": "string",
  "fontDefault": 0,
  "topMargin": 0,
  "leftMargin": 0,
  "bottomMargin": 0,
  "rightMargin": 0,
  "logoPosition": "string",
  "logoSize": "string",
  "isDefault": false,
  "isDefaultForVoucher": false,
  "copyFrom": "string",
  "logoUniqueName": "string",
  "qrCodeId": "string",
  "showBankQrCode": false,
  "isActive": "string",
  "type": "string",
  "templateType": "string",
  "isThermal": false,
  "showSectionsInline": false,
  "accountCustomFieldUniqueNames": [],
  "enableSecondaryLanguage": false,
  "language1Code": "string",
  "language2Code": "string",
  "displayLanguage1": false,
  "displayLanguage2": false,
  "showLanguage2DisplayedFirst": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `templateServiceV2.updateTemplate(company, principal, templateRequestV2, templateUniqueName`

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
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
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
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","isSample":false,"sections":{},"templateColor":"string","tableColor":"string","font":"string","fontDefault":0,"topMargin":0,"leftMargin":0,"bottomMargin":0,"rightMargin":0,"logoPosition":"string","logoSize":"string","isDefault":false,"isDefaultForVoucher":false,"copyFrom":"string","logoUniqueName":"string","qrCodeId":"string","showBankQrCode":false,"isActive":"string","type":"string","templateType":"string","isThermal":false,"showSectionsInline":false,"accountCustomFieldUniqueNames":[],"enableSecondaryLanguage":false,"language1Code":"string","language2Code":"string","displayLanguage1":false,"displayLanguage2":false,"showLanguage2DisplayedFirst":false}'
```

---

### `POST /company/:companyUniqueName/images`

- **Frontend id:** `INVOICE_API.UPLOAD_LOGO`
- **Frontend evidence:** `invoice.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: ImageController#setCompanyImage
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImageController.java:132`
- **Deprecated:** No

Set Company Image

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `logo`
**Multipart parts**
- `file` — type: `MultipartFile`; optional

#### Controller-backed request payload

Type: `BinaryData` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `format` | `String` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |

Example:

```json
{
  "format": "string",
  "base64": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `imageResource`

```json
{
  "status": "success",
  "body": {
    "reference": "imageResource"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/images?type=logo&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `GET /company/:companyUniqueName/invoice-setting/verify-email?emailAddress=:emailAddress&scope=:scope&branchUniqueName=:branchUniqueName`

- **Frontend id:** `INVOICE_API.VERIFY_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/invoice.service.ts#verifyEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceSettingController#verifyCompanyInvoiceEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceSettingController.java:55`
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
- Body evidence: `"Email verified successfully."`

```json
{
  "status": "success",
  "body": "Email verified successfully."
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoice-setting/verify-email?branchUniqueName=aaaa&emailAddress=SAMPLE_emailAddress&scope=SAMPLE_scope' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/new-old-sales?type=:type&value=:value`

- **Frontend id:** `NEWVSOLDINVOICE_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/new-vs-old-invoices.service.ts#GetNewVsOldInvoices; apps/web-giddh/src/app/services/new-vs-old-invoices.service.ts#GetNewVsOldInvoicesBySalesPerson`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getNewOldSalesData
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:672`
- **Deprecated:** No

Get New Old Sales Data

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; required
- `value` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SalesPersonBifurcationRequest` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `duration` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "duration": "string",
  "salesPersonUniqueNames": []
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
- `body as NewVsOldInvoicesResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/new-old-sales?type=SAMPLE_type&value=SAMPLE_value&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"duration":"string","salesPersonUniqueNames":[]}'
```

---

### `POST /company/:companyUniqueName/new-old-sales?type=:type&value=:value`

- **Frontend id:** `NEWVSOLDINVOICE_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/new-vs-old-invoices.service.ts#GetNewVsOldInvoices; apps/web-giddh/src/app/services/new-vs-old-invoices.service.ts#GetNewVsOldInvoicesBySalesPerson`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getNewOldSalesData
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:672`
- **Deprecated:** No

Get New Old Sales Data

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; required
- `value` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SalesPersonBifurcationRequest` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `duration` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "duration": "string",
  "salesPersonUniqueNames": []
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
- `body as NewVsOldInvoicesResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/new-old-sales?type=SAMPLE_type&value=SAMPLE_value&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"duration":"string","salesPersonUniqueNames":[]}'
```

---

### `POST /company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-proforma`

- **Frontend id:** `PROFORMA_API.generateInvoice`
- **Frontend evidence:** `apps/web-giddh/src/app/services/proforma.service.ts#generateInvoice; apps/web-giddh/src/app/services/voucher.service.ts#generateInvoice`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyVoucherController#generateVoucherViaProformaV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyVoucherController.java:270`
- **Deprecated:** No

Convert Proforma into Invoice version 3

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/accounts/SAMPLE_ACCOUNT/v3/generate-via-proforma?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `DELETE /company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `RECEIPT_API.DELETE`
- **Frontend evidence:** `receipt.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: VoucherController#deleteInvoice; accounting-microservice: VoucherController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:270`
- **Deprecated:** No

Delete Invoice

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
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
- Body evidence: `"Deleted Voucher Successfully!"`

```json
{
  "status": "success",
  "body": "Deleted Voucher Successfully!"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Voucher type must not be empty or null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=pdf`

- **Frontend id:** `RECEIPT_API.DOWNLOAD_VOUCHER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#DownloadVoucher`
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

### `GET /company/:companyUniqueName/advance-receipt/summary?from=:from&to=:to`

- **Frontend id:** `RECEIPT_API.GET_ADVANCE_RECEIPTS_SUMMARY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#fetchSummary`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AdvanceReceiptController#getReceiptSummary
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/advancereceipt/AdvanceReceiptController.java:152`
- **Deprecated:** No

Get Receipt Summary

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `advanceReceiptSummary`

```json
{
  "status": "success",
  "body": {
    "reference": "advanceReceiptSummary"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/advance-receipt/summary?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/vouchers/get-all?`

- **Frontend id:** `RECEIPT_API.GET_ALL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#GetAllReceipt; apps/web-giddh/src/app/services/voucher.service.ts#getAllVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyVoucherController#getAllVouchers; accounting-microservice: VoucherController#getAllVouchers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyVoucherController.java:110`
- **Deprecated:** No

Get All Vouchers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `25`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `invoice`
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `invoiceCount` — type: `int`; optional; default: `10`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `VoucherFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `value` | `String` | not declared | unconstrained |
| `voucherCopyType` | `VoucherFilter.VoucherCopyType` | not declared | unconstrained |
| `downloadCopyFileName` | `String` | not declared | unconstrained |
| `downloadCopyValue` | `String` | not declared | unconstrained |
| `downloadCopyTypeList` | `List<String>` | not declared | unconstrained |
| `copyTypes` | `Set<String>` | not declared | unconstrained |
| `sendTo` | `SendToOrCc` | not declared | unconstrained |
| `voucherUniqueNames` | `Set<String>` | not declared | unconstrained |
| `balanceStatus` | `Collection<String>` | not declared | unconstrained |
| `status` | `Collection<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `voucherNumber` | `String` | not declared | unconstrained |
| `proformaNumber` | `String` | not declared | unconstrained |
| `balanceDue` | `BigDecimal` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `invoiceDate` | `String` | not declared | unconstrained |
| `balanceMoreThan` | `Boolean` | not declared | unconstrained |
| `balanceEqual` | `Boolean` | not declared | unconstrained |
| `balanceLessThan` | `Boolean` | not declared | unconstrained |
| `dueDateBefore` | `Boolean` | not declared | unconstrained |
| `dueDateAfter` | `Boolean` | not declared | unconstrained |
| `dueDateEqual` | `Boolean` | not declared | unconstrained |
| `invoiceDateBefore` | `Boolean` | not declared | unconstrained |
| `invoiceDateAfter` | `Boolean` | not declared | unconstrained |
| `invoiceDateEqual` | `Boolean` | not declared | unconstrained |
| `companyName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `totalMoreThan` | `Boolean` | not declared | unconstrained |
| `totalLessThan` | `Boolean` | not declared | unconstrained |
| `totalEqual` | `Boolean` | not declared | unconstrained |
| `total` | `BigDecimal` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |

Example:

```json
{
  "value": "string",
  "voucherCopyType": "string",
  "downloadCopyFileName": "string",
  "downloadCopyValue": "string",
  "downloadCopyTypeList": [],
  "copyTypes": [],
  "sendTo": "string",
  "voucherUniqueNames": [],
  "balanceStatus": [],
  "status": [],
  "accountUniqueName": "string",
  "voucherNumber": "string",
  "proformaNumber": "string",
  "balanceDue": 0,
  "dueDate": "string",
  "invoiceDate": "string",
  "balanceMoreThan": false,
  "balanceEqual": false,
  "balanceLessThan": false,
  "dueDateBefore": false,
  "dueDateAfter": false,
  "dueDateEqual": false,
  "invoiceDateBefore": false,
  "invoiceDateAfter": false,
  "invoiceDateEqual": false,
  "companyName": "string",
  "groupUniqueName": "string",
  "totalMoreThan": false,
  "totalLessThan": false,
  "totalEqual": false,
  "total": 0,
  "description": "string"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/get-all?page=1&count=25&from=01-04-2025&to=31-03-2026&type=invoice&sort=desc&sortBy=voucherDate&invoiceCount=10&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"value":"string","voucherCopyType":"string","downloadCopyFileName":"string","downloadCopyValue":"string","downloadCopyTypeList":[],"copyTypes":[],"sendTo":"string","voucherUniqueNames":[],"balanceStatus":[],"status":[],"accountUniqueName":"string","voucherNumber":"string","proformaNumber":"string","balanceDue":0,"dueDate":"string","invoiceDate":"string","balanceMoreThan":false,"balanceEqual":false,"balanceLessThan":false,"dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"invoiceDateBefore":false,"invoiceDateAfter":false,"invoiceDateEqual":false,"companyName":"string","groupUniqueName":"string","totalMoreThan":false,"totalLessThan":false,"totalEqual":false,"total":0,"description":"string"}'
```

---

### `POST /company/:companyUniqueName/advance-receipt/get-all?page=:page&count=:count&from=:from&to=:to&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `RECEIPT_API.GET_ALL_ADVANCE_RECEIPTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#getAllAdvanceReceipts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AdvanceReceiptController#getReceipts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/advancereceipt/AdvanceReceiptController.java:112`
- **Deprecated:** No

Get Receipts

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `RECEIPT_DATE`
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `AdvanceReceiptFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `receiptNumber` | `String` | not declared | unconstrained |
| `receiptTypes` | `Set<String>` | not declared | unconstrained |
| `baseAccountName` | `String` | not declared | unconstrained |
| `particularName` | `String` | not declared | unconstrained |
| `invoiceNumber` | `String` | not declared | unconstrained |
| `totalAmountOperation` | `String` | not declared | unconstrained |
| `totalAmount` | `BigDecimal` | not declared | unconstrained |
| `unUsedAmountOperation` | `String` | not declared | unconstrained |
| `unUsedAmount` | `BigDecimal` | not declared | unconstrained |
| `mappingName` | `String` | not declared | unconstrained |
| `classFieldName` | `String` | not declared | unconstrained |
| `hasData` | `boolean` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `fromDate` | `LocalDate` | not declared | unconstrained |
| `toDate` | `LocalDate` | not declared | unconstrained |
| `receiptNumber` | `String` | not declared | unconstrained |
| `receiptTypes` | `Set<String>` | not declared | unconstrained |
| `baseAccountName` | `String` | not declared | unconstrained |
| `particularName` | `String` | not declared | unconstrained |
| `invoiceNumber` | `String` | not declared | unconstrained |
| `totalAmount` | `BigDecimal` | not declared | unconstrained |
| `totalAmountOperation` | `NumberOperations` | not declared | unconstrained |
| `unUsedAmount` | `BigDecimal` | not declared | unconstrained |
| `unUsedAmountOperation` | `NumberOperations` | not declared | unconstrained |
| `searchQuery` | `String` | not declared | unconstrained |
| `sortDirection` | `Sort.Direction` | not declared | unconstrained |
| `sortTypeEnum` | `AdvanceReceiptSortType` | not declared | RECEIPT_DATE, UNUSED_AMOUNT, TOTAL_AMOUNT |

Example:

```json
{
  "receiptNumber": "string",
  "receiptTypes": [],
  "baseAccountName": "string",
  "particularName": "string",
  "invoiceNumber": "string",
  "totalAmountOperation": "string",
  "totalAmount": 0,
  "unUsedAmountOperation": "string",
  "unUsedAmount": 0,
  "mappingName": "string",
  "classFieldName": "string",
  "hasData": false,
  "page": 0,
  "count": 0,
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "searchQuery": "string",
  "sortDirection": "string",
  "sortTypeEnum": "RECEIPT_DATE"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/advance-receipt/get-all?branchUniqueName=aaaa&page=1&count=50&from=01-04-2025&to=31-03-2026&sort=desc&sortBy=RECEIPT_DATE&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"receiptNumber":"string","receiptTypes":[],"baseAccountName":"string","particularName":"string","invoiceNumber":"string","totalAmountOperation":"string","totalAmount":0,"unUsedAmountOperation":"string","unUsedAmount":0,"mappingName":"string","classFieldName":"string","hasData":false,"page":0,"count":0,"fromDate":"01-04-2025","toDate":"01-04-2025","searchQuery":"string","sortDirection":"string","sortTypeEnum":"RECEIPT_DATE"}'
```

---

### `POST /company/:companyUniqueName/vouchers/get-all-vouchers-balances?`

- **Frontend id:** `RECEIPT_API.GET_ALL_BAL_SALE_DUE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#getAllReceiptBalanceDue; apps/web-giddh/src/app/services/voucher.service.ts#getVoucherBalances`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyVoucherController#getAllBalancesVouchers; accounting-microservice: VoucherController#getAllBalancesVouchers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyVoucherController.java:147`
- **Deprecated:** No

Get All Balances Vouchers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `invoice`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `VoucherFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `value` | `String` | not declared | unconstrained |
| `voucherCopyType` | `VoucherFilter.VoucherCopyType` | not declared | unconstrained |
| `downloadCopyFileName` | `String` | not declared | unconstrained |
| `downloadCopyValue` | `String` | not declared | unconstrained |
| `downloadCopyTypeList` | `List<String>` | not declared | unconstrained |
| `copyTypes` | `Set<String>` | not declared | unconstrained |
| `sendTo` | `SendToOrCc` | not declared | unconstrained |
| `voucherUniqueNames` | `Set<String>` | not declared | unconstrained |
| `balanceStatus` | `Collection<String>` | not declared | unconstrained |
| `status` | `Collection<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `voucherNumber` | `String` | not declared | unconstrained |
| `proformaNumber` | `String` | not declared | unconstrained |
| `balanceDue` | `BigDecimal` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `invoiceDate` | `String` | not declared | unconstrained |
| `balanceMoreThan` | `Boolean` | not declared | unconstrained |
| `balanceEqual` | `Boolean` | not declared | unconstrained |
| `balanceLessThan` | `Boolean` | not declared | unconstrained |
| `dueDateBefore` | `Boolean` | not declared | unconstrained |
| `dueDateAfter` | `Boolean` | not declared | unconstrained |
| `dueDateEqual` | `Boolean` | not declared | unconstrained |
| `invoiceDateBefore` | `Boolean` | not declared | unconstrained |
| `invoiceDateAfter` | `Boolean` | not declared | unconstrained |
| `invoiceDateEqual` | `Boolean` | not declared | unconstrained |
| `companyName` | `String` | not declared | unconstrained |
| `groupUniqueName` | `String` | not declared | unconstrained |
| `totalMoreThan` | `Boolean` | not declared | unconstrained |
| `totalLessThan` | `Boolean` | not declared | unconstrained |
| `totalEqual` | `Boolean` | not declared | unconstrained |
| `total` | `BigDecimal` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |

Example:

```json
{
  "value": "string",
  "voucherCopyType": "string",
  "downloadCopyFileName": "string",
  "downloadCopyValue": "string",
  "downloadCopyTypeList": [],
  "copyTypes": [],
  "sendTo": "string",
  "voucherUniqueNames": [],
  "balanceStatus": [],
  "status": [],
  "accountUniqueName": "string",
  "voucherNumber": "string",
  "proformaNumber": "string",
  "balanceDue": 0,
  "dueDate": "string",
  "invoiceDate": "string",
  "balanceMoreThan": false,
  "balanceEqual": false,
  "balanceLessThan": false,
  "dueDateBefore": false,
  "dueDateAfter": false,
  "dueDateEqual": false,
  "invoiceDateBefore": false,
  "invoiceDateAfter": false,
  "invoiceDateEqual": false,
  "companyName": "string",
  "groupUniqueName": "string",
  "totalMoreThan": false,
  "totalLessThan": false,
  "totalEqual": false,
  "total": 0,
  "description": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `invoiceTotals`

```json
{
  "status": "success",
  "body": {
    "reference": "invoiceTotals"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/get-all-vouchers-balances?from=01-04-2025&to=31-03-2026&type=invoice&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"value":"string","voucherCopyType":"string","downloadCopyFileName":"string","downloadCopyValue":"string","downloadCopyTypeList":[],"copyTypes":[],"sendTo":"string","voucherUniqueNames":[],"balanceStatus":[],"status":[],"accountUniqueName":"string","voucherNumber":"string","proformaNumber":"string","balanceDue":0,"dueDate":"string","invoiceDate":"string","balanceMoreThan":false,"balanceEqual":false,"balanceLessThan":false,"dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"invoiceDateBefore":false,"invoiceDateAfter":false,"invoiceDateEqual":false,"companyName":"string","groupUniqueName":"string","totalMoreThan":false,"totalLessThan":false,"totalEqual":false,"total":0,"description":"string"}'
```

---

### `POST /company/:companyUniqueName/purchase-record/get-all?`

- **Frontend id:** `RECEIPT_API.GET_ALL_PURCHASE_RECORDS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#GetAllReceipt`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseCompanyController#getPurchaseRecords
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseCompanyController.java:79`
- **Deprecated:** No

Get Purchase Records

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `25`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `purchaseDate`
- `invoiceCount` — type: `int`; optional; default: `10`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `PurchaseRecordFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `grandTotalOperation` | `String` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `balanceStatus` | `Collection<String>` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `purchaseNumber` | `String` | not declared | unconstrained |
| `purchaseOrderNumber` | `String` | not declared | unconstrained |
| `balanceDueOperation` | `String` | not declared | unconstrained |
| `balanceDue` | `BigDecimal` | not declared | unconstrained |
| `purchaseDateOperation` | `String` | not declared | unconstrained |
| `dueDateOperation` | `String` | not declared | unconstrained |
| `dueDateStr` | `String` | not declared | unconstrained |
| `purchaseDateStr` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `mappingName` | `String` | not declared | unconstrained |
| `classFieldName` | `String` | not declared | unconstrained |
| `hasData` | `boolean` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `invoiceCount` | `int` | not declared | unconstrained |
| `fromDate` | `LocalDate` | not declared | unconstrained |
| `toDate` | `LocalDate` | not declared | unconstrained |
| `sortDirection` | `Sort.Direction` | not declared | unconstrained |
| `sortTypeEnum` | `PurchaseRecordSortType` | not declared | PURCHASE_DATE, DUE_DATE, BALANCE_DUE, GRAND_TOTAL |
| `dueDate` | `LocalDate` | not declared | unconstrained |
| `purchaseDate` | `LocalDate` | not declared | unconstrained |
| `grandTotalOperation` | `NumberOperations` | not declared | unconstrained |
| `balanceDueOperation` | `NumberOperations` | not declared | unconstrained |
| `purchaseDateOperation` | `DateOperations` | not declared | ON, AFTER, BEFORE, BETWEEN |
| `dueDateOperation` | `DateOperations` | not declared | ON, AFTER, BEFORE, BETWEEN |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `balanceDue` | `BigDecimal` | not declared | unconstrained |
| `balanceStatus` | `Collection<String>` | not declared | unconstrained |
| `purchaseNumber` | `String` | not declared | unconstrained |
| `purchaseOrderNumber` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `searchQuery` | `String` | not declared | unconstrained |

Example:

```json
{
  "grandTotalOperation": "string",
  "grandTotal": 0,
  "balanceStatus": [],
  "accountUniqueName": "string",
  "purchaseNumber": "string",
  "purchaseOrderNumber": "string",
  "balanceDueOperation": "string",
  "balanceDue": 0,
  "purchaseDateOperation": "ON",
  "dueDateOperation": "ON",
  "dueDateStr": "string",
  "purchaseDateStr": "string",
  "description": "string",
  "mappingName": "string",
  "classFieldName": "string",
  "hasData": false,
  "page": 0,
  "count": 0,
  "invoiceCount": 0,
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "sortDirection": "string",
  "sortTypeEnum": "PURCHASE_DATE",
  "dueDate": "01-04-2025",
  "purchaseDate": "01-04-2025",
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/purchase-record/get-all?page=1&count=25&from=01-04-2025&to=31-03-2026&sort=desc&sortBy=purchaseDate&invoiceCount=10&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"grandTotalOperation":"string","grandTotal":0,"balanceStatus":[],"accountUniqueName":"string","purchaseNumber":"string","purchaseOrderNumber":"string","balanceDueOperation":"string","balanceDue":0,"purchaseDateOperation":"ON","dueDateOperation":"ON","dueDateStr":"string","purchaseDateStr":"string","description":"string","mappingName":"string","classFieldName":"string","hasData":false,"page":0,"count":0,"invoiceCount":0,"fromDate":"01-04-2025","toDate":"01-04-2025","sortDirection":"string","sortTypeEnum":"PURCHASE_DATE","dueDate":"01-04-2025","purchaseDate":"01-04-2025","searchQuery":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `RECEIPT_API.GET_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#GetVoucherDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:116`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `refresh` — type: `boolean`; optional; default: `false`

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
- Body evidence: `voucherService.get(company, account, customInvoiceNumberRequestBody.getVoucherType(`

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
| 400 | `INVALID_PARAMETER` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
- `body as Voucher`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `POST /v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `RECEIPT_API.GET_DETAILS_V4`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#getVoucherDetailsV4; apps/web-giddh/src/app/services/voucher.service.ts#getVoucherDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#getVoucher; accounting-microservice: VoucherController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:169`
- **Deprecated:** No

This function is use to get the voucher by provide voucher number and voucher type.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

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
- Body evidence: `voucherService.getVoucher(company, account, customInvoiceNumberRequestBody.getVoucherType(`

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
| 400 | `error.code.invalidParameter` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "error.code.invalidParameter",
  "message": "error.company.account.not.null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"proformaNumber":"string","estimateNumber":"string","invoiceNumber":"string","voucherType":"string","estimateVersionNumber":"string","debugMode":false,"generateEInvoice":false,"emailId":[]}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/purchase-record/:purchaseRecordUniqueNumber`

- **Frontend id:** `RECEIPT_API.GET_PURCHASE_RECORD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#GetPurchaseRecordDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PurchaseAccountController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/purchase/PurchaseAccountController.java:129`
- **Deprecated:** No

use to get purchase record

#### Inputs

**Path parameters**
- `accountUniqueName` — type: `String`; required
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
- `body as Voucher`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/purchase-record/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `RECEIPT_API.PUT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#UpdateReceipt`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:229`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `VoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `voucher` | `VoucherResponseV2` | not declared | unconstrained |
| `validateTax` | `Boolean` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `paymentAction` | `PaymentAction` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `depositAccountUniqueName` | `String` | not declared | unconstrained |
| `oldVersions` | `List<ProformaVersionResource>` | not declared | unconstrained |
| `oldEstimateVersions` | `List<EstimateVersionResource>` | not declared | unconstrained |
| `isEcommerceInvoice` | `boolean` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPerson` | not declared | unconstrained |

Example:

```json
{
  "entryUniqueNames": [],
  "dueDate": "string",
  "voucher": "string",
  "validateTax": false,
  "taxes": [],
  "applyApplicableTaxes": false,
  "paymentAction": "string",
  "updateAccountDetails": false,
  "depositAccountUniqueName": "string",
  "oldVersions": [],
  "oldEstimateVersions": [],
  "isEcommerceInvoice": false,
  "action": "string",
  "roundOffApplicable": false,
  "branch": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherService.get(company, account, voucherRequest.getVoucher().getVoucherDetails().getVoucherType(`

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
| 409 | `INVALID_TAX` | `InvalidTaxException` | InvalidTaxException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entryUniqueNames":[],"dueDate":"string","voucher":"string","validateTax":false,"taxes":[],"applyApplicableTaxes":false,"paymentAction":"string","updateAccountDetails":false,"depositAccountUniqueName":"string","oldVersions":[],"oldEstimateVersions":[],"isEcommerceInvoice":false,"action":"string","roundOffApplicable":false,"branch":"string","salesPersonUniqueName":"string","salesPerson":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/stock-history?branchUniqueName=:branchUniqueName&voucherVersion=2`

- **Frontend id:** `RECEIPT_API.STOCK_HISTORY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#getStockHistory`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: StockHistoryController#getStockHistory
- **Backend source:** `src/main/java/com/giddh/api/controllers/StockHistoryController.java:34`
- **Deprecated:** No

Get Stock History

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `StockHistoryRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `stockUniqueName` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `variantUniqueName` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `size` | `int` | not declared | unconstrained |

Example:

```json
{
  "stockUniqueName": "string",
  "accountUniqueName": "string",
  "variantUniqueName": "string",
  "voucherType": "string",
  "page": 0,
  "size": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `history`

```json
{
  "status": "success",
  "body": {
    "reference": "history"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-history?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"stockUniqueName":"string","accountUniqueName":"string","variantUniqueName":"string","voucherType":"string","page":0,"size":0}'
```

---

### `POST /v4/company/:companyUniqueName/vouchers/:voucherUniqueName/make-recurring?voucherVersion=2`

- **Frontend id:** `RECURRING_API.MAKE_RECURRING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/aside-recurring-voucher.service.ts#makeRecurring`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#makeVoucherRecurring
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:735`
- **Deprecated:** No

used to generate recurring

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `RecurrencePreviewRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `startDate` | `LocalDate` | NotNull | unconstrained |
| `frequency` | `Frequency` | not declared | unconstrained |
| `repeatOn` | `RepeatOn` | not declared | unconstrained |
| `end` | `EndCondition` | not declared | unconstrained |
| `repeatOption` | `RepeatOption` | not declared | unconstrained |
| `unit` | `Unit` | not declared | DAY, WEEK, MONTH, YEAR |
| `interval` | `int` | not declared | unconstrained |
| `type` | `Type` | not declared | VOUCHER_TOTAL, ACCOUNT_NAME, VOUCHER_DATE, DUE_DATE, ACCOUNT_BILLING_STATE, ACCOUNT_SHIPPING_STATE, COMPANY_BILLING_STATE, COMPANY_SHIPPING_STATE, STATUS |
| `dayOfMonth` | `Integer` | not declared | unconstrained |
| `weekdays` | `List<DayOfWeek>` | not declared | unconstrained |
| `nth` | `Integer` | not declared | unconstrained |
| `weekday` | `DayOfWeek` | not declared | unconstrained |
| `type` | `EndType` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |
| `endDate` | `LocalDate` | not declared | unconstrained |

Example:

```json
{
  "startDate": "01-04-2025",
  "frequency": "string",
  "repeatOn": "string",
  "end": "string",
  "repeatOption": "string",
  "unit": "DAY",
  "interval": 0,
  "type": "string",
  "dayOfMonth": 0,
  "weekdays": [],
  "nth": 0,
  "weekday": "string",
  "count": 0,
  "endDate": "01-04-2025"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Voucher made recurring successfully"`

```json
{
  "status": "success",
  "body": "Voucher made recurring successfully"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INTERRUPTED",
  "message": "Interrupted"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers/SAMPLE_VOUCHER/make-recurring?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"startDate":"01-04-2025","frequency":"string","repeatOn":"string","end":"string","repeatOption":"string","unit":"DAY","interval":0,"type":"string","dayOfMonth":0,"weekdays":[],"nth":0,"weekday":"string","count":0,"endDate":"01-04-2025"}'
```

---

### `POST /company/{{companyname}}/recurring-voucher/`

- **Frontend id:** `RECURRING_VOUCHER_API.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/recurring-voucher.service.ts#createRecurringVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RecurringVoucherController#addRecurringVoucher
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RecurringVoucherController.java:47`
- **Deprecated:** No

Add Recurring Voucher

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RecurringVoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherNumber` | `String` | not declared | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `nextCronDate` | `String` | not declared | unconstrained |
| `cronEndDate` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |

Example:

```json
{
  "voucherNumber": "string",
  "duration": "string",
  "nextCronDate": "string",
  "cronEndDate": "string",
  "voucherType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new RecurringVoucherDetailsResource(recurringVoucherDetails`

```json
{
  "status": "success",
  "body": {
    "type": "RecurringVoucherDetailsResource"
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
- `body as RecurringInvoice`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherNumber":"string","duration":"string","nextCronDate":"string","cronEndDate":"string","voucherType":"string"}'
```

---

### `DELETE /company/{{companyname}}/recurring-voucher/{{uniqueName}}`

- **Frontend id:** `RECURRING_VOUCHER_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/recurring-voucher.service.ts#deleteRecurringVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RecurringVoucherController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RecurringVoucherController.java:79`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `recurringVoucherUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Recurring-Voucher Details Deleted Successfully."`

```json
{
  "status": "success",
  "body": "Recurring-Voucher Details Deleted Successfully."
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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/SAMPLE_recurringVoucherUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{{companyname}}/recurring-voucher/get-all/?count=:count&page=:page&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `RECURRING_VOUCHER_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/recurring-voucher.service.ts#getRecurringVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RecurringVoucherController#getAllRecurringVoucher
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RecurringVoucherController.java:61`
- **Deprecated:** No

Get All Recurring Voucher

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sort` — type: `String`; optional; default: `asc`
- `sortBy` — type: `String`; optional; default: `createdAt`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `RecurringVoucherFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `status` | `String` | not declared | unconstrained |
| `customerName` | `String` | not declared | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `lastInvoiceDate` | `String` | not declared | unconstrained |
| `voucherNumber` | `String` | not declared | unconstrained |

Example:

```json
{
  "status": "string",
  "customerName": "string",
  "duration": "string",
  "lastInvoiceDate": "string",
  "voucherNumber": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `recurringVoucherDetailsView`

```json
{
  "status": "success",
  "body": {
    "reference": "recurringVoucherDetailsView"
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
- `body as RecurringInvoice[]`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/get-all?page=1&count=20&sort=asc&sortBy=createdAt&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"status":"string","customerName":"string","duration":"string","lastInvoiceDate":"string","voucherNumber":"string"}'
```

---

### `GET /company/{{companyname}}/recurring-voucher/get-all/?count=:count&page=:page&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `RECURRING_VOUCHER_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/recurring-voucher.service.ts#getRecurringVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RecurringVoucherController#getAllRecurringVoucher
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RecurringVoucherController.java:61`
- **Deprecated:** No

Get All Recurring Voucher

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sort` — type: `String`; optional; default: `asc`
- `sortBy` — type: `String`; optional; default: `createdAt`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `RecurringVoucherFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `status` | `String` | not declared | unconstrained |
| `customerName` | `String` | not declared | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `lastInvoiceDate` | `String` | not declared | unconstrained |
| `voucherNumber` | `String` | not declared | unconstrained |

Example:

```json
{
  "status": "string",
  "customerName": "string",
  "duration": "string",
  "lastInvoiceDate": "string",
  "voucherNumber": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `recurringVoucherDetailsView`

```json
{
  "status": "success",
  "body": {
    "reference": "recurringVoucherDetailsView"
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
- `body as RecurringInvoice[]`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/get-all?page=1&count=20&sort=asc&sortBy=createdAt&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"status":"string","customerName":"string","duration":"string","lastInvoiceDate":"string","voucherNumber":"string"}'
```

---

### `PATCH /company/{{companyname}}/recurring-voucher/{{uniqueName}}`

- **Frontend id:** `RECURRING_VOUCHER_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/recurring-voucher.service.ts#updateRecurringVouchers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RecurringVoucherController#updateRecurringVoucherPatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RecurringVoucherController.java:90`
- **Deprecated:** No

Update Recurring Voucher Patch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `recurringVoucherUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RecurringVoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherNumber` | `String` | not declared | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `nextCronDate` | `String` | not declared | unconstrained |
| `cronEndDate` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |

Example:

```json
{
  "voucherNumber": "string",
  "duration": "string",
  "nextCronDate": "string",
  "cronEndDate": "string",
  "voucherType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new RecurringVoucherDetailsResource(recurringVoucherDetails`

```json
{
  "status": "success",
  "body": {
    "type": "RecurringVoucherDetailsResource"
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
- `body as RecurringInvoice`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-voucher/SAMPLE_recurringVoucherUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherNumber":"string","duration":"string","nextCronDate":"string","cronEndDate":"string","voucherType":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`

- **Frontend id:** `SALES_API_V2.GENERATE_GENERIC_ITEMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#generateGenericItem`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#generate
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:92`
- **Deprecated:** No

Generate

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `VoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `voucher` | `VoucherResponseV2` | not declared | unconstrained |
| `validateTax` | `Boolean` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `paymentAction` | `PaymentAction` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `depositAccountUniqueName` | `String` | not declared | unconstrained |
| `oldVersions` | `List<ProformaVersionResource>` | not declared | unconstrained |
| `oldEstimateVersions` | `List<EstimateVersionResource>` | not declared | unconstrained |
| `isEcommerceInvoice` | `boolean` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPerson` | not declared | unconstrained |

Example:

```json
{
  "entryUniqueNames": [],
  "dueDate": "string",
  "voucher": "string",
  "validateTax": false,
  "taxes": [],
  "applyApplicableTaxes": false,
  "paymentAction": "string",
  "updateAccountDetails": false,
  "depositAccountUniqueName": "string",
  "oldVersions": [],
  "oldEstimateVersions": [],
  "isEcommerceInvoice": false,
  "action": "string",
  "roundOffApplicable": false,
  "branch": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherService.generate(company, account, principal, voucherRequest, request`

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
| 409 | `INVALID_TAX` | `InvalidTaxException` | InvalidTaxException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/generate?branchUniqueName=aaaa&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entryUniqueNames":[],"dueDate":"string","voucher":"string","validateTax":false,"taxes":[],"applyApplicableTaxes":false,"paymentAction":"string","updateAccountDetails":false,"depositAccountUniqueName":"string","oldVersions":[],"oldEstimateVersions":[],"isEcommerceInvoice":false,"action":"string","roundOffApplicable":false,"branch":"string","salesPersonUniqueName":"string","salesPerson":"string"}'
```

---

### `GET /company/:companyUniqueName/brief-accounts`

- **Frontend id:** `SALES_API_V2.GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#getAccountsWithCurrency; apps/web-giddh/src/app/services/voucher.service.ts#getBriefAccounts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: CompanyController#briefAccounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/CompanyController.java:50`
- **Deprecated:** No

Brief Accounts

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `group` — type: `String`; optional; default: ``
- `exceptGroups` — type: `String`; optional; default: ``
- `currency` — type: `String`; optional; default: ``
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/brief-accounts?group=&exceptGroups=&currency=&page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&adjustmentRequest=:adjustmentRequest&count=:count&page=:page&number=:number`

- **Frontend id:** `SALES_API_V2.GET_VOUCHER_INVOICE_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#getInvoiceList; apps/web-giddh/src/app/services/voucher.service.ts#getVouchersList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyVoucherController#getListOfInvoicesForLinking; accounting-microservice: VoucherController#getUnAdjustedVouchers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyVoucherController.java:202`
- **Deprecated:** No

Get List Of Invoices For Linking

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `voucherDate` — type: `String`; required
- `adjustmentRequest` — type: `boolean`; optional
- `branchUniqueName` — type: `String`; optional
- `page` — type: `String`; optional; default: `1`
- `count` — type: `String`; optional; default: `0`

#### Controller-backed request payload

Type: `InvoiceForLinkingRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountUniqueNames` | `Set<String>` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `subVoucher` | `String` | not declared | unconstrained |

Example:

```json
{
  "accountUniqueNames": [],
  "voucherType": "string",
  "subVoucher": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `invoiceList`

```json
{
  "status": "success",
  "body": {
    "reference": "invoiceList"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/invoice-list?voucherDate=SAMPLE_voucherDate&adjustmentRequest=SAMPLE_adjustmentRequest&branchUniqueName=aaaa&page=1&count=0' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountUniqueNames":[],"voucherType":"string","subVoucher":"string"}'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `SALES_API_V2.UPDATE_VOUCHER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#updateVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/VoucherController.java:229`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `VoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `voucher` | `VoucherResponseV2` | not declared | unconstrained |
| `validateTax` | `Boolean` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `paymentAction` | `PaymentAction` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `depositAccountUniqueName` | `String` | not declared | unconstrained |
| `oldVersions` | `List<ProformaVersionResource>` | not declared | unconstrained |
| `oldEstimateVersions` | `List<EstimateVersionResource>` | not declared | unconstrained |
| `isEcommerceInvoice` | `boolean` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPerson` | not declared | unconstrained |

Example:

```json
{
  "entryUniqueNames": [],
  "dueDate": "string",
  "voucher": "string",
  "validateTax": false,
  "taxes": [],
  "applyApplicableTaxes": false,
  "paymentAction": "string",
  "updateAccountDetails": false,
  "depositAccountUniqueName": "string",
  "oldVersions": [],
  "oldEstimateVersions": [],
  "isEcommerceInvoice": false,
  "action": "string",
  "roundOffApplicable": false,
  "branch": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherService.get(company, account, voucherRequest.getVoucher().getVoucherDetails().getVoucherType(`

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
| 409 | `INVALID_TAX` | `InvalidTaxException` | InvalidTaxException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entryUniqueNames":[],"dueDate":"string","voucher":"string","validateTax":false,"taxes":[],"applyApplicableTaxes":false,"paymentAction":"string","updateAccountDetails":false,"depositAccountUniqueName":"string","oldVersions":[],"oldEstimateVersions":[],"isEcommerceInvoice":false,"action":"string","roundOffApplicable":false,"branch":"string","salesPersonUniqueName":"string","salesPerson":"string"}'
```

---

### `POST /v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`

- **Frontend id:** `SALES_API_V4.GENERATE_GENERIC_ITEMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#generateGenericItem; apps/web-giddh/src/app/services/sales.service.ts#generatePendingVoucherGenericItem; apps/web-giddh/src/app/services/voucher.service.ts#generateVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#generate; accounting-microservice: VoucherController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:98`
- **Deprecated:** No
- **Live capture (2026-10-22):** company `giddhain1792673422178091xos` — success JSON in [`docs/api/live-captures/giddh-automation-api-doc/responses/30-create-sales-invoice.json`](../live-captures/giddh-automation-api-doc/responses/30-create-sales-invoice.json). **Requires `voucherVersion=2`.**

This function will create new voucher based on provided request

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `voucherVersion` — type: `Integer`; **required `2`** for accounting-microservice companies (this live company)

#### Controller-backed request payload

Type: `VoucherV4` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `number` | `String` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `balanceTotal` | `AmountDetails` | not declared | unconstrained |
| `balanceStatus` | `BalanceStatus` | not declared | PAID, UNPAID, CANCEL, CANCELLED, PARTIAL_PAID, HOLD, EMPTY, CREDIT_ISSUED |
| `company` | `VoucherCompanyData` | not declared | unconstrained |
| `account` | `VoucherAccountData` | not declared | unconstrained |
| `entries` | `List<VoucherEntryV4>` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `voucherTotal` | `AmountDetails` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `TaxTotal` | not declared | unconstrained |
| `otherTaxTotal` | `AmountDetails` | not declared | unconstrained |
| `discountTotal` | `DiscountTotal` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `deposit` | `AmountDeposit` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `isDefaultCompanyAddress` | `boolean` | not declared | unconstrained |
| `entryWithTaxSet` | `Map<String, Set<String>>` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonResource` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `oldProformaVersions` | `List<ProformaVersionResource>` | not declared | unconstrained |
| `oldEstimateVersions` | `List<EstimateVersionResource>` | not declared | unconstrained |
| `templateDetails` | `TemplateDetails` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `attachedFiles` | `Set<String>` | not declared | unconstrained |
| `attachedFileName` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `isEcommerceInvoice` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `multiCurrency` | `boolean` | not declared | unconstrained |
| `isCashInvoice` | `boolean` | not declared | unconstrained |
| `skipBusinessDocumentAutoCreate` | `Boolean` | not declared | unconstrained |
| `businessDocumentUniqueNames` | `List<String>` | not declared | unconstrained |
| `relationType` | `String` | not declared | unconstrained |
| `skipInventoryMovement` | `Boolean` | not declared | unconstrained |
| `linkedBusinessDocuments` | `List<LinkedBusinessDocumentResource>` | not declared | unconstrained |
| `ecommerceDetails` | `EcommerceDetails` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `forNewSubscription` | `boolean` | not declared | unconstrained |
| `voucherAdjustments` | `VoucherAdjustmentsForInvoice` | not declared | unconstrained |
| `invoiceLinkingRequest` | `InvoiceLinkingRequest` | not declared | unconstrained |
| `exportInvoice` | `boolean` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |
| `purchaseOrders` | `List<GenNameUniqueNameIdImpl<String>>` | not declared | unconstrained |

Example:

```json
{
  "number": "string",
  "generateEInvoice": false,
  "type": "string",
  "date": "string",
  "dueDate": "string",
  "uniqueName": "string",
  "balanceTotal": "string",
  "balanceStatus": "PAID",
  "company": "string",
  "account": "string",
  "entries": [],
  "grandTotal": "string",
  "voucherTotal": "string",
  "subTotal": "string",
  "taxTotal": "string",
  "otherTaxTotal": "string",
  "discountTotal": "string",
  "roundOffTotal": "string",
  "totalAsWords": "string",
  "deposit": "string",
  "base64": "string",
  "updateAccountDetails": false,
  "isDefaultCompanyAddress": false,
  "entryWithTaxSet": [],
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "action": "string",
  "oldProformaVersions": [],
  "oldEstimateVersions": [],
  "templateDetails": "string",
  "warehouse": "string",
  "attachedFiles": [],
  "attachedFileName": "string",
  "entryUniqueNames": [],
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "invoiceNumberAgainstVoucher": "string",
  "isEcommerceInvoice": false,
  "applyApplicableTaxes": false,
  "multiCurrency": false,
  "isCashInvoice": false,
  "skipBusinessDocumentAutoCreate": false,
  "businessDocumentUniqueNames": [],
  "relationType": "string",
  "skipInventoryMovement": false,
  "linkedBusinessDocuments": [],
  "ecommerceDetails": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "roundOffApplicable": false,
  "forNewSubscription": false,
  "voucherAdjustments": "string",
  "invoiceLinkingRequest": "string",
  "exportInvoice": false,
  "branch": "string",
  "purchaseOrders": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: live capture sales invoice generate (`apitest`, company `giddhain1792673422178091xos`, `voucherVersion=2`)
- Full file: [`../live-captures/giddh-automation-api-doc/responses/30-create-sales-invoice.json`](../live-captures/giddh-automation-api-doc/responses/30-create-sales-invoice.json)

```json
{
  "status": "success",
  "body": {
    "number": "261022-1",
    "type": "sales",
    "uniqueName": "5zkmf1792674363694",
    "status": "UNPAID",
    "date": "22-10-2026",
    "dueDate": "05-11-2026",
    "exchangeRate": 1.0,
    "balanceTotal": { "amountForAccount": 100.0, "amountForCompany": 100.0 },
    "subTotal": { "amountForAccount": 100.0, "amountForCompany": 100.0 },
    "voucherTotal": { "amountForAccount": 100.0, "amountForCompany": 100.0 },
    "grandTotal": { "amountForAccount": 100.0, "amountForCompany": 100.0 },
    "totalAsWords": {
      "amountForAccount": "One Hundred Only",
      "amountForCompany": "One Hundred Only"
    },
    "account": {
      "name": "API Doc Customer One",
      "uniqueName": "apidoc-customer-one"
    },
    "entries": [
      {
        "uniqueName": "7xdx51792674363621",
        "description": "Consulting service",
        "date": "22-10-2026",
        "transactions": [
          {
            "account": { "name": "Sales", "uniqueName": "sales" },
            "amount": { "amountForAccount": 100.0, "amountForCompany": 100.0 }
          }
        ]
      }
    ]
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `ConstraintViolation` | Missing `voucherVersion=2` for v2 company — live: `Entry date must be provided` |
| 400 | `error.code.invalidParameter` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
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
  "code": "error.code.invalidParameter",
  "message": "error.company.account.not.null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"number":"string","generateEInvoice":false,"type":"string","date":"string","dueDate":"string","uniqueName":"string","balanceTotal":"string","balanceStatus":"PAID","company":"string","account":"string","entries":[],"grandTotal":"string","voucherTotal":"string","subTotal":"string","taxTotal":"string","otherTaxTotal":"string","discountTotal":"string","roundOffTotal":"string","totalAsWords":"string","deposit":"string","base64":"string","updateAccountDetails":false,"isDefaultCompanyAddress":false,"entryWithTaxSet":[],"salesPersonUniqueName":"string","salesPerson":"string","action":"string","oldProformaVersions":[],"oldEstimateVersions":[],"templateDetails":"string","warehouse":"string","attachedFiles":[],"attachedFileName":"string","entryUniqueNames":[],"exchangeRate":0,"valuesInAccountCurrency":false,"invoiceNumberAgainstVoucher":"string","isEcommerceInvoice":false,"applyApplicableTaxes":false,"multiCurrency":false,"isCashInvoice":false,"skipBusinessDocumentAutoCreate":false,"businessDocumentUniqueNames":[],"relationType":"string","skipInventoryMovement":false,"linkedBusinessDocuments":[],"ecommerceDetails":"string","touristSchemeApplicable":false,"passportNumber":"string","roundOffApplicable":false,"forNewSubscription":false,"voucherAdjustments":"string","invoiceLinkingRequest":"string","exportInvoice":false,"branch":"string","purchaseOrders":[]}'
```

---

### `PATCH /v4/company/:companyUniqueName/vouchers`

- **Frontend id:** `SALES_API_V4.UPDATE_ATTACHMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#updateAttachmentInVoucher; apps/web-giddh/src/app/services/voucher.service.ts#updateAttachmentInVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#updatePatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:243`
- **Deprecated:** No

Update Patch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `VoucherResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `TCS_FUNCTION` | `static Function<VoucherEntryResource, Stream<? extends TaxDetails>>` | not declared | unconstrained |
| `TDS_FUNCTION` | `static Function<VoucherEntryResource, Stream<? extends TaxDetails>>` | not declared | unconstrained |
| `GST_TAX_FUNCTION` | `static Function<VoucherEntryResource, Stream<? extends TaxDetails>>` | not declared | unconstrained |
| `voucherId` | `Long` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `isCustomInvoiceNo` | `Boolean` | not declared | unconstrained |
| `companyDetails` | `VoucherCompanyData` | not declared | unconstrained |
| `accountDetails` | `VoucherAccountData` | not declared | unconstrained |
| `entryResources` | `List<VoucherEntryResource>` | not declared | unconstrained |
| `warehouseDetails` | `NameUniqueNameResource` | not declared | unconstrained |
| `isTouristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `mergePB` | `Boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `withPay` | `Boolean` | not declared | unconstrained |
| `forNewSubscription` | `boolean` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | REVERSE_CHARGE, ADVANCE_RECEIPT, EXPORT |
| `roundOffApplicable` | `Boolean` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `copyBillingAddressToShippingAddress` | `Boolean` | not declared | unconstrained |
| `readDetailsFromAccount` | `Boolean` | not declared | unconstrained |
| `tallyUniqueId` | `String` | not declared | unconstrained |
| `templateDetails` | `TemplateResource` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `discountTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `AmountDetails` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `otherTaxTotal` | `AmountDetails` | not declared | unconstrained |
| `voucherTotal` | `AmountDetails` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `ewayBillDetails` | `EwayBillDetails` | not declared | unconstrained |
| `roundOffAccount` | `NameUniqueNameResource` | not declared | unconstrained |
| `items` | `List<ItemInfo>` | not declared | unconstrained |
| `deposits` | `List<AccountAmountDetails>` | not declared | unconstrained |
| `voucherDate` | `LocalDate` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `purchaseOrders` | `List<GenNameUniqueNameIdImpl<String>>` | not declared | unconstrained |
| `purchaseOrderDetails` | `List<PurchaseOrderDetails>` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `multiCurrency` | `boolean` | not declared | unconstrained |
| `encodedData` | `String` | not declared | unconstrained |
| `token` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonModel` | not declared | unconstrained |
| `fileExtention` | `String` | not declared | unconstrained |
| `fileName` | `String` | not declared | unconstrained |
| `recurrencePreviewRequest` | `RecurrencePreviewRequest` | not declared | unconstrained |
| `recurringVoucherUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "TCS_FUNCTION": "string",
  "TDS_FUNCTION": "string",
  "GST_TAX_FUNCTION": "string",
  "voucherId": 0,
  "number": "string",
  "type": "string",
  "uniqueName": "string",
  "isCustomInvoiceNo": false,
  "companyDetails": "string",
  "accountDetails": "string",
  "entryResources": [],
  "warehouseDetails": "string",
  "isTouristSchemeApplicable": false,
  "mergePB": false,
  "passportNumber": "string",
  "withPay": false,
  "forNewSubscription": false,
  "subVoucher": "REVERSE_CHARGE",
  "roundOffApplicable": false,
  "updateAccountDetails": false,
  "copyBillingAddressToShippingAddress": false,
  "readDetailsFromAccount": false,
  "tallyUniqueId": "string",
  "templateDetails": "string",
  "subTotal": "string",
  "discountTotal": "string",
  "taxTotal": "string",
  "roundOffTotal": "string",
  "otherTaxTotal": "string",
  "voucherTotal": "string",
  "grandTotal": "string",
  "totalAsWords": "string",
  "ewayBillDetails": "string",
  "roundOffAccount": "string",
  "items": [],
  "deposits": [],
  "voucherDate": "01-04-2025",
  "exchangeRate": 0,
  "purchaseOrders": [],
  "purchaseOrderDetails": [],
  "generateEInvoice": false,
  "multiCurrency": false,
  "encodedData": "string",
  "token": "string",
  "salesPerson": "string",
  "fileExtention": "string",
  "fileName": "string",
  "recurrencePreviewRequest": "string",
  "recurringVoucherUniqueName": "string"
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
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
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
curl --request PATCH \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

---

### `PUT /v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`

- **Frontend id:** `SALES_API_V4.UPDATE_VOUCHER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#updateVoucherV4; apps/web-giddh/src/app/services/voucher.service.ts#updateVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#updateVoucher; accounting-microservice: VoucherController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:140`
- **Deprecated:** No

this function will update the voucher based on provided request

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `VoucherV4` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `number` | `String` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `dueDate` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `balanceTotal` | `AmountDetails` | not declared | unconstrained |
| `balanceStatus` | `BalanceStatus` | not declared | PAID, UNPAID, CANCEL, CANCELLED, PARTIAL_PAID, HOLD, EMPTY, CREDIT_ISSUED |
| `company` | `VoucherCompanyData` | not declared | unconstrained |
| `account` | `VoucherAccountData` | not declared | unconstrained |
| `entries` | `List<VoucherEntryV4>` | not declared | unconstrained |
| `grandTotal` | `AmountDetails` | not declared | unconstrained |
| `voucherTotal` | `AmountDetails` | not declared | unconstrained |
| `subTotal` | `AmountDetails` | not declared | unconstrained |
| `taxTotal` | `TaxTotal` | not declared | unconstrained |
| `otherTaxTotal` | `AmountDetails` | not declared | unconstrained |
| `discountTotal` | `DiscountTotal` | not declared | unconstrained |
| `roundOffTotal` | `AmountDetails` | not declared | unconstrained |
| `totalAsWords` | `AmountInWords` | not declared | unconstrained |
| `deposit` | `AmountDeposit` | not declared | unconstrained |
| `base64` | `String` | not declared | unconstrained |
| `updateAccountDetails` | `Boolean` | not declared | unconstrained |
| `isDefaultCompanyAddress` | `boolean` | not declared | unconstrained |
| `entryWithTaxSet` | `Map<String, Set<String>>` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonResource` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `oldProformaVersions` | `List<ProformaVersionResource>` | not declared | unconstrained |
| `oldEstimateVersions` | `List<EstimateVersionResource>` | not declared | unconstrained |
| `templateDetails` | `TemplateDetails` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `attachedFiles` | `Set<String>` | not declared | unconstrained |
| `attachedFileName` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `isEcommerceInvoice` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `multiCurrency` | `boolean` | not declared | unconstrained |
| `isCashInvoice` | `boolean` | not declared | unconstrained |
| `skipBusinessDocumentAutoCreate` | `Boolean` | not declared | unconstrained |
| `businessDocumentUniqueNames` | `List<String>` | not declared | unconstrained |
| `relationType` | `String` | not declared | unconstrained |
| `skipInventoryMovement` | `Boolean` | not declared | unconstrained |
| `linkedBusinessDocuments` | `List<LinkedBusinessDocumentResource>` | not declared | unconstrained |
| `ecommerceDetails` | `EcommerceDetails` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `forNewSubscription` | `boolean` | not declared | unconstrained |
| `voucherAdjustments` | `VoucherAdjustmentsForInvoice` | not declared | unconstrained |
| `invoiceLinkingRequest` | `InvoiceLinkingRequest` | not declared | unconstrained |
| `exportInvoice` | `boolean` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |
| `purchaseOrders` | `List<GenNameUniqueNameIdImpl<String>>` | not declared | unconstrained |

Example:

```json
{
  "number": "string",
  "generateEInvoice": false,
  "type": "string",
  "date": "string",
  "dueDate": "string",
  "uniqueName": "string",
  "balanceTotal": "string",
  "balanceStatus": "PAID",
  "company": "string",
  "account": "string",
  "entries": [],
  "grandTotal": "string",
  "voucherTotal": "string",
  "subTotal": "string",
  "taxTotal": "string",
  "otherTaxTotal": "string",
  "discountTotal": "string",
  "roundOffTotal": "string",
  "totalAsWords": "string",
  "deposit": "string",
  "base64": "string",
  "updateAccountDetails": false,
  "isDefaultCompanyAddress": false,
  "entryWithTaxSet": [],
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "action": "string",
  "oldProformaVersions": [],
  "oldEstimateVersions": [],
  "templateDetails": "string",
  "warehouse": "string",
  "attachedFiles": [],
  "attachedFileName": "string",
  "entryUniqueNames": [],
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "invoiceNumberAgainstVoucher": "string",
  "isEcommerceInvoice": false,
  "applyApplicableTaxes": false,
  "multiCurrency": false,
  "isCashInvoice": false,
  "skipBusinessDocumentAutoCreate": false,
  "businessDocumentUniqueNames": [],
  "relationType": "string",
  "skipInventoryMovement": false,
  "linkedBusinessDocuments": [],
  "ecommerceDetails": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "roundOffApplicable": false,
  "forNewSubscription": false,
  "voucherAdjustments": "string",
  "invoiceLinkingRequest": "string",
  "exportInvoice": false,
  "branch": "string",
  "purchaseOrders": []
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
| 400 | `error.code.invalidParameter` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "error.code.invalidParameter",
  "message": "error.company.account.not.null"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"number":"string","generateEInvoice":false,"type":"string","date":"string","dueDate":"string","uniqueName":"string","balanceTotal":"string","balanceStatus":"PAID","company":"string","account":"string","entries":[],"grandTotal":"string","voucherTotal":"string","subTotal":"string","taxTotal":"string","otherTaxTotal":"string","discountTotal":"string","roundOffTotal":"string","totalAsWords":"string","deposit":"string","base64":"string","updateAccountDetails":false,"isDefaultCompanyAddress":false,"entryWithTaxSet":[],"salesPersonUniqueName":"string","salesPerson":"string","action":"string","oldProformaVersions":[],"oldEstimateVersions":[],"templateDetails":"string","warehouse":"string","attachedFiles":[],"attachedFileName":"string","entryUniqueNames":[],"exchangeRate":0,"valuesInAccountCurrency":false,"invoiceNumberAgainstVoucher":"string","isEcommerceInvoice":false,"applyApplicableTaxes":false,"multiCurrency":false,"isCashInvoice":false,"skipBusinessDocumentAutoCreate":false,"businessDocumentUniqueNames":[],"relationType":"string","skipInventoryMovement":false,"linkedBusinessDocuments":[],"ecommerceDetails":"string","touristSchemeApplicable":false,"passportNumber":"string","roundOffApplicable":false,"forNewSubscription":false,"voucherAdjustments":"string","invoiceLinkingRequest":"string","exportInvoice":false,"branch":"string","purchaseOrders":[]}'
```

