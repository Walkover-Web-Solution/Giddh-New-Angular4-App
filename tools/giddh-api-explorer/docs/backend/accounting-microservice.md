# Accounting Microservice Controller API

Generated from production Spring controllers in `/Users/divyanshu/Downloads/giddha-giddh-accounting-microservice-21ec5e126986`. Values are finite only when supported by controller annotations, Java enums, DTO constraints, or explicit validation evidence; otherwise they are marked unconstrained.

| Metric | Count |
|---|---:|
| Controllers | 15 |
| Handler methods | 70 |
| Expanded routes | 77 |
| Deprecated routes | 0 |

### `GET /`

Ok

- **Controller:** `MainController#ok`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:28`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"ok"`

```json
{
  "status": "success",
  "body": "ok"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/convert-entry-to-voucher`

Convert Entry To Voucher For Auto Paid

- **Controller:** `EventSchedulerController#convertEntryToVoucherForAutoPaid`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:46`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/convert-entry-to-voucher' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/create-event-for-voucher-if-event-not-found`

Create Event For Voucher If Event Not Found

- **Controller:** `EventSchedulerController#createEventForVoucherIfEventNotFound`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:40`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/create-event-for-voucher-if-event-not-found' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/create-or-cancel-einvoice`

Create And Cancel EInvoice

- **Controller:** `EventSchedulerController#createAndCancelEInvoice`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:22`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/create-or-cancel-einvoice' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/generate-base64-in-trigger-event`

Generating Base64In Trigger Event

- **Controller:** `EventSchedulerController#generatingBase64InTriggerEvent`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:28`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/generate-base64-in-trigger-event' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/recurring-voucher-trigger`

Run Recurring Voucher Trigger

- **Controller:** `EventSchedulerController#runRecurringVoucherTrigger`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:58`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/recurring-voucher-trigger' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/update-einvoice-status`

Changing EInvoice Status From Push Initiated To Pushed

- **Controller:** `EventSchedulerController#changingEInvoiceStatusFromPushInitiatedToPushed`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:34`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/update-einvoice-status' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /accounting-scheduled/voucher-due-trigger`

Run Voucher Due Trigger

- **Controller:** `EventSchedulerController#runVoucherDueTrigger`
- **Source:** `src/main/java/com/giddh/api/controllers/EventSchedulerController.java:52`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `THROWABLE` | `Throwable` | Throwable raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "THROWABLE",
  "message": "Throwable"
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/accounting-scheduled/voucher-due-trigger' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `ANY /ai/voucher-ocr`

Update OCRDocument Upload Data Received From Gateway AI

- **Controller:** `VoucherController#updateOCRDocumentUploadDataReceivedFromGatewayAI`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:724`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication) (mapping does not restrict the HTTP method)

#### Inputs



#### Request payload

Type: `Map<String, Object>` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
{}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"Processed successfully"`

```json
{
  "status": "success",
  "body": "Processed successfully"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/ai/voucher-ocr' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `GET /company/{companyUniqueName}/accounts/{accountUniqueName}/autopaid`

Auto Adjust Vouchers

- **Controller:** `AutoPaidController#autoAdjustVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/AutoPaidController.java:47`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("autopaid.request.submitted"`

```json
{
  "status": "success",
  "body": "autopaid.request.submitted"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/autopaid?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/bulk-ledgers-v2`

Bulk Create

- **Controller:** `LedgerController#bulkCreate`
- **Source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:78`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

Type: `List<LedgerRequest>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `description` | `String` | not declared | unconstrained |
| `voucherDescription` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `generateInvoice` | `Boolean` | not declared | unconstrained |
| `copyBillingAddressToShippingAddress` | `Boolean` | not declared | unconstrained |
| `readDetailsFromAccount` | `Boolean` | not declared | unconstrained |
| `attachedFile` | `String` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `ewayBillDetails` | `EwayBillDetails` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `tagNames` | `Set<String>` | not declared | unconstrained |
| `transactionId` | `String` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonModel` | not declared | unconstrained |
| `transactions` | `List<TransactionResource>` | not declared | unconstrained |
| `tcsCalculationMethod` | `TaxCalculationMethod` | not declared | unconstrained |
| `referenceId` | `String` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `mergePB` | `Boolean` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `entryClass` | `EntryClass` | not declared | ANNEXURE |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `applyApplicableDiscounts` | `Boolean` | not declared | unconstrained |
| `isInclusiveTax` | `Boolean` | not declared | unconstrained |
| `tallyUniqueId` | `String` | not declared | unconstrained |
| `oldAccountUniqueName` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `giddhImportRefId` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "description": "string",
  "voucherDescription": "string",
  "voucherType": "string",
  "chequeNumber": "string",
  "generateInvoice": false,
  "copyBillingAddressToShippingAddress": false,
  "readDetailsFromAccount": false,
  "attachedFile": "string",
  "exchangeRate": 0,
  "ewayBillDetails": "string",
  "valuesInAccountCurrency": false,
  "selectAllFields": [],
  "tagNames": [],
  "transactionId": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "transactions": [],
  "tcsCalculationMethod": "string",
  "referenceId": "string",
  "sendToGstr2": false,
  "invoiceNumberAgainstVoucher": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "mergePB": false,
  "generateEInvoice": false,
  "entryClass": "ANNEXURE",
  "applyApplicableTaxes": false,
  "applyApplicableDiscounts": false,
  "isInclusiveTax": false,
  "tallyUniqueId": "string",
  "oldAccountUniqueName": "string",
  "uniqueName": "string",
  "giddhImportRefId": "string",
  "entryUniqueNames": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `entries.stream().map(Entry::getUniqueName).collect(Collectors.toSet(`

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/bulk-ledgers-v2?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"description":"string","voucherDescription":"string","voucherType":"string","chequeNumber":"string","generateInvoice":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"attachedFile":"string","exchangeRate":0,"ewayBillDetails":"string","valuesInAccountCurrency":false,"selectAllFields":[],"tagNames":[],"transactionId":"string","salesPersonUniqueName":"string","salesPerson":"string","transactions":[],"tcsCalculationMethod":"string","referenceId":"string","sendToGstr2":false,"invoiceNumberAgainstVoucher":"string","touristSchemeApplicable":false,"passportNumber":"string","mergePB":false,"generateEInvoice":false,"entryClass":"ANNEXURE","applyApplicableTaxes":false,"applyApplicableDiscounts":false,"isInclusiveTax":false,"tallyUniqueId":"string","oldAccountUniqueName":"string","uniqueName":"string","giddhImportRefId":"string","entryUniqueNames":[]}'
```

---

### `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/entries`

Delete Multiple

- **Controller:** `LedgerController#deleteMultiple`
- **Source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:140`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

Type: `LedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `description` | `String` | not declared | unconstrained |
| `voucherDescription` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `generateInvoice` | `Boolean` | not declared | unconstrained |
| `copyBillingAddressToShippingAddress` | `Boolean` | not declared | unconstrained |
| `readDetailsFromAccount` | `Boolean` | not declared | unconstrained |
| `attachedFile` | `String` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `ewayBillDetails` | `EwayBillDetails` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `tagNames` | `Set<String>` | not declared | unconstrained |
| `transactionId` | `String` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonModel` | not declared | unconstrained |
| `transactions` | `List<TransactionResource>` | not declared | unconstrained |
| `tcsCalculationMethod` | `TaxCalculationMethod` | not declared | unconstrained |
| `referenceId` | `String` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `mergePB` | `Boolean` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `entryClass` | `EntryClass` | not declared | ANNEXURE |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `applyApplicableDiscounts` | `Boolean` | not declared | unconstrained |
| `isInclusiveTax` | `Boolean` | not declared | unconstrained |
| `tallyUniqueId` | `String` | not declared | unconstrained |
| `oldAccountUniqueName` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `giddhImportRefId` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "description": "string",
  "voucherDescription": "string",
  "voucherType": "string",
  "chequeNumber": "string",
  "generateInvoice": false,
  "copyBillingAddressToShippingAddress": false,
  "readDetailsFromAccount": false,
  "attachedFile": "string",
  "exchangeRate": 0,
  "ewayBillDetails": "string",
  "valuesInAccountCurrency": false,
  "selectAllFields": [],
  "tagNames": [],
  "transactionId": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "transactions": [],
  "tcsCalculationMethod": "string",
  "referenceId": "string",
  "sendToGstr2": false,
  "invoiceNumberAgainstVoucher": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "mergePB": false,
  "generateEInvoice": false,
  "entryClass": "ANNEXURE",
  "applyApplicableTaxes": false,
  "applyApplicableDiscounts": false,
  "isInclusiveTax": false,
  "tallyUniqueId": "string",
  "oldAccountUniqueName": "string",
  "uniqueName": "string",
  "giddhImportRefId": "string",
  "entryUniqueNames": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("success.entries.delete"`

```json
{
  "status": "success",
  "body": "success.entries.delete"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
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
  "code": "INTERRUPTED",
  "message": "Interrupted"
}
```

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/entries?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"description":"string","voucherDescription":"string","voucherType":"string","chequeNumber":"string","generateInvoice":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"attachedFile":"string","exchangeRate":0,"ewayBillDetails":"string","valuesInAccountCurrency":false,"selectAllFields":[],"tagNames":[],"transactionId":"string","salesPersonUniqueName":"string","salesPerson":"string","transactions":[],"tcsCalculationMethod":"string","referenceId":"string","sendToGstr2":false,"invoiceNumberAgainstVoucher":"string","touristSchemeApplicable":false,"passportNumber":"string","mergePB":false,"generateEInvoice":false,"entryClass":"ANNEXURE","applyApplicableTaxes":false,"applyApplicableDiscounts":false,"isInclusiveTax":false,"tallyUniqueId":"string","oldAccountUniqueName":"string","uniqueName":"string","giddhImportRefId":"string","entryUniqueNames":[]}'
```

---

### `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/entries/{entryUniqueName:.+}`

Delete

- **Controller:** `LedgerController#delete`
- **Source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:125`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `entryUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("success.entries.delete"`

```json
{
  "status": "success",
  "body": "success.entries.delete"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
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
  "code": "INTERRUPTED",
  "message": "Interrupted"
}
```

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/entries/SAMPLE_ENTRY?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`

Create

- **Controller:** `LedgerController#create`
- **Source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:63`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

Type: `LedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `description` | `String` | not declared | unconstrained |
| `voucherDescription` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `generateInvoice` | `Boolean` | not declared | unconstrained |
| `copyBillingAddressToShippingAddress` | `Boolean` | not declared | unconstrained |
| `readDetailsFromAccount` | `Boolean` | not declared | unconstrained |
| `attachedFile` | `String` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `ewayBillDetails` | `EwayBillDetails` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `tagNames` | `Set<String>` | not declared | unconstrained |
| `transactionId` | `String` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonModel` | not declared | unconstrained |
| `transactions` | `List<TransactionResource>` | not declared | unconstrained |
| `tcsCalculationMethod` | `TaxCalculationMethod` | not declared | unconstrained |
| `referenceId` | `String` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `mergePB` | `Boolean` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `entryClass` | `EntryClass` | not declared | ANNEXURE |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `applyApplicableDiscounts` | `Boolean` | not declared | unconstrained |
| `isInclusiveTax` | `Boolean` | not declared | unconstrained |
| `tallyUniqueId` | `String` | not declared | unconstrained |
| `oldAccountUniqueName` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `giddhImportRefId` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "description": "string",
  "voucherDescription": "string",
  "voucherType": "string",
  "chequeNumber": "string",
  "generateInvoice": false,
  "copyBillingAddressToShippingAddress": false,
  "readDetailsFromAccount": false,
  "attachedFile": "string",
  "exchangeRate": 0,
  "ewayBillDetails": "string",
  "valuesInAccountCurrency": false,
  "selectAllFields": [],
  "tagNames": [],
  "transactionId": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "transactions": [],
  "tcsCalculationMethod": "string",
  "referenceId": "string",
  "sendToGstr2": false,
  "invoiceNumberAgainstVoucher": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "mergePB": false,
  "generateEInvoice": false,
  "entryClass": "ANNEXURE",
  "applyApplicableTaxes": false,
  "applyApplicableDiscounts": false,
  "isInclusiveTax": false,
  "tallyUniqueId": "string",
  "oldAccountUniqueName": "string",
  "uniqueName": "string",
  "giddhImportRefId": "string",
  "entryUniqueNames": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `entries.stream().map(Entry::getUniqueName).collect(Collectors.toSet(`

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"description":"string","voucherDescription":"string","voucherType":"string","chequeNumber":"string","generateInvoice":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"attachedFile":"string","exchangeRate":0,"ewayBillDetails":"string","valuesInAccountCurrency":false,"selectAllFields":[],"tagNames":[],"transactionId":"string","salesPersonUniqueName":"string","salesPerson":"string","transactions":[],"tcsCalculationMethod":"string","referenceId":"string","sendToGstr2":false,"invoiceNumberAgainstVoucher":"string","touristSchemeApplicable":false,"passportNumber":"string","mergePB":false,"generateEInvoice":false,"entryClass":"ANNEXURE","applyApplicableTaxes":false,"applyApplicableDiscounts":false,"isInclusiveTax":false,"tallyUniqueId":"string","oldAccountUniqueName":"string","uniqueName":"string","giddhImportRefId":"string","entryUniqueNames":[]}'
```

---

### `GET /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`

Get

- **Controller:** `LedgerController#get`
- **Source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:109`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `ledgerUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `baseRef` — type: `boolean`; optional; default: `false`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `ledgerResource`

```json
{
  "status": "success",
  "body": {
    "reference": "ledgerResource"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/SAMPLE_LEDGER?branchUniqueName=aaaa&baseRef=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`

Update

- **Controller:** `LedgerController#update`
- **Source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:93`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `ledgerUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `newAccountUniqueName` — type: `String`; optional; default: ``

#### Request payload

Type: `LedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `description` | `String` | not declared | unconstrained |
| `voucherDescription` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `generateInvoice` | `Boolean` | not declared | unconstrained |
| `copyBillingAddressToShippingAddress` | `Boolean` | not declared | unconstrained |
| `readDetailsFromAccount` | `Boolean` | not declared | unconstrained |
| `attachedFile` | `String` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `ewayBillDetails` | `EwayBillDetails` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `tagNames` | `Set<String>` | not declared | unconstrained |
| `transactionId` | `String` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `salesPerson` | `SalesPersonModel` | not declared | unconstrained |
| `transactions` | `List<TransactionResource>` | not declared | unconstrained |
| `tcsCalculationMethod` | `TaxCalculationMethod` | not declared | unconstrained |
| `referenceId` | `String` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `mergePB` | `Boolean` | not declared | unconstrained |
| `generateEInvoice` | `Boolean` | not declared | unconstrained |
| `entryClass` | `EntryClass` | not declared | ANNEXURE |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `applyApplicableDiscounts` | `Boolean` | not declared | unconstrained |
| `isInclusiveTax` | `Boolean` | not declared | unconstrained |
| `tallyUniqueId` | `String` | not declared | unconstrained |
| `oldAccountUniqueName` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `giddhImportRefId` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "description": "string",
  "voucherDescription": "string",
  "voucherType": "string",
  "chequeNumber": "string",
  "generateInvoice": false,
  "copyBillingAddressToShippingAddress": false,
  "readDetailsFromAccount": false,
  "attachedFile": "string",
  "exchangeRate": 0,
  "ewayBillDetails": "string",
  "valuesInAccountCurrency": false,
  "selectAllFields": [],
  "tagNames": [],
  "transactionId": "string",
  "salesPersonUniqueName": "string",
  "salesPerson": "string",
  "transactions": [],
  "tcsCalculationMethod": "string",
  "referenceId": "string",
  "sendToGstr2": false,
  "invoiceNumberAgainstVoucher": "string",
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "mergePB": false,
  "generateEInvoice": false,
  "entryClass": "ANNEXURE",
  "applyApplicableTaxes": false,
  "applyApplicableDiscounts": false,
  "isInclusiveTax": false,
  "tallyUniqueId": "string",
  "oldAccountUniqueName": "string",
  "uniqueName": "string",
  "giddhImportRefId": "string",
  "entryUniqueNames": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `ledgerService.get(updatedEntry`

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

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/SAMPLE_LEDGER?branchUniqueName=aaaa&newAccountUniqueName=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"description":"string","voucherDescription":"string","voucherType":"string","chequeNumber":"string","generateInvoice":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"attachedFile":"string","exchangeRate":0,"ewayBillDetails":"string","valuesInAccountCurrency":false,"selectAllFields":[],"tagNames":[],"transactionId":"string","salesPersonUniqueName":"string","salesPerson":"string","transactions":[],"tcsCalculationMethod":"string","referenceId":"string","sendToGstr2":false,"invoiceNumberAgainstVoucher":"string","touristSchemeApplicable":false,"passportNumber":"string","mergePB":false,"generateEInvoice":false,"entryClass":"ANNEXURE","applyApplicableTaxes":false,"applyApplicableDiscounts":false,"isInclusiveTax":false,"tallyUniqueId":"string","oldAccountUniqueName":"string","uniqueName":"string","giddhImportRefId":"string","entryUniqueNames":[]}'
```

---

### `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`

Delete

- **Controller:** `VoucherController#delete`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:309`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
- Body evidence: `"Voucher deleted."`

```json
{
  "status": "success",
  "body": "Voucher deleted."
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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","voucherType":"string","selectAllFields":[],"copyTypes":[],"uniqueName":"string","entryUniqueName":"string","paymentId":"string","certId":"string","certificateBase64":"string","certificateChainBase64":[],"showSectionsInline":false,"fileType":"PDF","from":"01-04-2025","to":"01-04-2025"}'
```

---

### `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bulk-export`

Bulk Export

- **Controller:** `VoucherController#bulkExport`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:435`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; optional
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `noteType` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
- Body evidence: `new FileResponse<>(message, FileResponse.MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/bulk-export?from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/cancel-einvoice`

Cancel EInvoice

- **Controller:** `VoucherController#cancelEInvoice`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:393`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `cnlRsn` — type: `String`; required
- `cnlRem` — type: `String`; required

#### Request payload

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

### `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/mail`

Mail

- **Controller:** `VoucherController#mail`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:420`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
- Body evidence: `"Email sent successfully."`

```json
{
  "status": "success",
  "body": "Email sent successfully."
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/mail?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","voucherType":"string","selectAllFields":[],"copyTypes":[],"uniqueName":"string","entryUniqueName":"string","paymentId":"string","certId":"string","certificateBase64":"string","certificateChainBase64":[],"showSectionsInline":false,"fileType":"PDF","from":"01-04-2025","to":"01-04-2025"}'
```

---

### `GET /company/{companyUniqueName}/completed-document-count`

Get Completed Document

- **Controller:** `VoucherController#getCompletedDocument`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:675`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `ocrType` — type: `String`; required

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/completed-document-count?branchUniqueName=aaaa&ocrType=SAMPLE_ocrType' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/download-file`

Download

- **Controller:** `VoucherController#download`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:258`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `fileType` — type: `String`; optional; default: `pdf`
- `debugMode` — type: `boolean`; optional
- `downloadOption` — type: `DownloadOption`; optional; default: `ALL`; allowed: `VOUCHER`, `ATTACHMENT`, `ALL`

#### Request payload

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
- Body evidence: `voucherFacadeService.getVoucherDataForPDF(voucherRequest, true`

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `error.code.invalidRequest` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/download-file?branchUniqueName=aaaa&fileType=pdf&debugMode=SAMPLE_debugMode&downloadOption=ALL' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","voucherType":"string","selectAllFields":[],"copyTypes":[],"uniqueName":"string","entryUniqueName":"string","paymentId":"string","certId":"string","certificateBase64":"string","certificateChainBase64":[],"showSectionsInline":false,"fileType":"PDF","from":"01-04-2025","to":"01-04-2025"}'
```

---

### `POST /company/{companyUniqueName}/dsc/finish`

Finish

- **Controller:** `DscController#finish`
- **Source:** `src/main/java/com/giddh/api/controllers/v1/DscController.java:83`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_PDF_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Request payload

Type: `FinishSignRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `nonce` | `String` | not declared | unconstrained |
| `signature` | `String` | not declared | unconstrained |

Example:

```json
{
  "nonce": "string",
  "signature": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<byte[]>`
- Body evidence: `ResponseEntity<byte[]>`

```json
"[binary]"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dsc/finish?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/pdf' \
  --header 'Content-Type: application/json' \
  --data '{"nonce":"string","signature":"string"}'
```

---

### `POST /company/{companyUniqueName}/dsc/prepare`

Prepare

- **Controller:** `DscController#prepare`
- **Source:** `src/main/java/com/giddh/api/controllers/v1/DscController.java:67`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
| 400 | `DSC_STORAGE` | `DscStorageException` | DscStorageException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PDF` | `InvalidPdfException` | InvalidPdfException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PDF_PROCESSING` | `PdfProcessingException` | PdfProcessingException raised by controller or shared ExceptionHandler |
| 400 | `SIGNING` | `SigningException` | SigningException raised by controller or shared ExceptionHandler |
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
  "code": "DSC_STORAGE",
  "message": "Dsc Storage"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dsc/prepare?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","voucherType":"string","selectAllFields":[],"copyTypes":[],"uniqueName":"string","entryUniqueName":"string","paymentId":"string","certId":"string","certificateBase64":"string","certificateChainBase64":[],"showSectionsInline":false,"fileType":"PDF","from":"01-04-2025","to":"01-04-2025"}'
```

---

### `GET /company/{companyUniqueName}/export-invoices`

Export Vouchers

- **Controller:** `VoucherController#exportVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:575`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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
- Body evidence: `voucherExportService.exportVouchersIntoExcelORCsv(filter, response, fileType`

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
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-invoices?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&voucherCount=10&q=&fileType=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /company/{companyUniqueName}/export-invoices`

Export Vouchers

- **Controller:** `VoucherController#exportVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:575`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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
- Body evidence: `voucherExportService.exportVouchersIntoExcelORCsv(filter, response, fileType`

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
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-invoices?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&voucherCount=10&q=&fileType=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `GET /company/{companyUniqueName}/export-invoices-v2`

Export Vouchers With Export Settings

- **Controller:** `VoucherController#exportVouchersWithExportSettings`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:613`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-invoices-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&voucherCount=10&q=&fileType=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /company/{companyUniqueName}/export-invoices-v2`

Export Vouchers With Export Settings

- **Controller:** `VoucherController#exportVouchersWithExportSettings`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:613`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

### `POST /company/{companyUniqueName}/inventory-adjustment`

Create

- **Controller:** `InventoryAdjustmentController#create`
- **Source:** `src/main/java/com/giddh/api/controllers/InventoryAdjustmentController.java:39`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

Type: `InventoryAdjustmentModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entity` | `String` | not declared | unconstrained |
| `entityName` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `reasonUniqueName` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `refNo` | `String` | not declared | unconstrained |
| `expenseAccountUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `adjustmentMethod` | `InventoryAdjustmentMethod` | not declared | QUANTITY_WISE, VALUE_WISE |
| `calculationMethod` | `CalculationMethod` | not declared | PERCENTAGE, VALUE |
| `changeInValue` | `BigDecimal` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `adjustmentId` | `Long` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `update` | `boolean` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |

Example:

```json
{
  "entity": "string",
  "entityName": "string",
  "entityUniqueName": "string",
  "reasonUniqueName": "string",
  "date": "string",
  "refNo": "string",
  "expenseAccountUniqueName": "string",
  "warehouseUniqueName": "string",
  "description": "string",
  "adjustmentMethod": "QUANTITY_WISE",
  "calculationMethod": "PERCENTAGE",
  "changeInValue": 0,
  "variantUniqueNames": [],
  "adjustmentId": 0,
  "userId": 0,
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "update": false,
  "inventoryType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("inventory.adjustment.request.submitted"`

```json
{
  "status": "success",
  "body": "inventory.adjustment.request.submitted"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entity":"string","entityName":"string","entityUniqueName":"string","reasonUniqueName":"string","date":"string","refNo":"string","expenseAccountUniqueName":"string","warehouseUniqueName":"string","description":"string","adjustmentMethod":"QUANTITY_WISE","calculationMethod":"PERCENTAGE","changeInValue":0,"variantUniqueNames":[],"adjustmentId":0,"userId":0,"companyUniqueName":"string","branchUniqueName":"string","update":false,"inventoryType":"string"}'
```

---

### `DELETE /company/{companyUniqueName}/inventory-adjustment/{refNo}`

Delete

- **Controller:** `InventoryAdjustmentController#delete`
- **Source:** `src/main/java/com/giddh/api/controllers/InventoryAdjustmentController.java:51`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `refNo` — type: `String`; required

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryAdjustmentService.deleteAdjustment(company, principal, refNo, request, new LinkedList<>() {{ add(RequestSource.API); }}`

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
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
  "code": "INTERRUPTED",
  "message": "Interrupted"
}
```

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_refNo?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/{companyUniqueName}/inventory-adjustment/{refNo}`

Update

- **Controller:** `InventoryAdjustmentController#update`
- **Source:** `src/main/java/com/giddh/api/controllers/InventoryAdjustmentController.java:60`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `refNo` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

Type: `InventoryAdjustmentModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entity` | `String` | not declared | unconstrained |
| `entityName` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `reasonUniqueName` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `refNo` | `String` | not declared | unconstrained |
| `expenseAccountUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `adjustmentMethod` | `InventoryAdjustmentMethod` | not declared | QUANTITY_WISE, VALUE_WISE |
| `calculationMethod` | `CalculationMethod` | not declared | PERCENTAGE, VALUE |
| `changeInValue` | `BigDecimal` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `adjustmentId` | `Long` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `update` | `boolean` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |

Example:

```json
{
  "entity": "string",
  "entityName": "string",
  "entityUniqueName": "string",
  "reasonUniqueName": "string",
  "date": "string",
  "refNo": "string",
  "expenseAccountUniqueName": "string",
  "warehouseUniqueName": "string",
  "description": "string",
  "adjustmentMethod": "QUANTITY_WISE",
  "calculationMethod": "PERCENTAGE",
  "changeInValue": 0,
  "variantUniqueNames": [],
  "adjustmentId": 0,
  "userId": 0,
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "update": false,
  "inventoryType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("inventory.adjustment.request.submitted"`

```json
{
  "status": "success",
  "body": "inventory.adjustment.request.submitted"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
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
  "code": "INVALID_DATE_FORMAT",
  "message": "Invalid Date Format"
}
```

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_refNo?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entity":"string","entityName":"string","entityUniqueName":"string","reasonUniqueName":"string","date":"string","refNo":"string","expenseAccountUniqueName":"string","warehouseUniqueName":"string","description":"string","adjustmentMethod":"QUANTITY_WISE","calculationMethod":"PERCENTAGE","changeInValue":0,"variantUniqueNames":[],"adjustmentId":0,"userId":0,"companyUniqueName":"string","branchUniqueName":"string","update":false,"inventoryType":"string"}'
```

---

### `POST /company/{companyUniqueName}/invoices/{voucherUniqueName}/action`

Action

- **Controller:** `VoucherController#action`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:534`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required

#### Request payload

Type: `AccountAmountDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountName` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `tagNames` | `Set<String>` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `cancelReason` | `String` | not declared | unconstrained |
| `cancelRemarks` | `String` | not declared | unconstrained |
| `deposits` | `List<AccountAmountDetails>` | not declared | unconstrained |

Example:

```json
{
  "accountName": "string",
  "accountUniqueName": "string",
  "chequeNumber": "string",
  "description": "string",
  "tagNames": [],
  "action": "string",
  "exchangeRate": 0,
  "cancelReason": "string",
  "cancelRemarks": "string",
  "deposits": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Voucher updated."`

```json
{
  "status": "success",
  "body": "Voucher updated."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `error.code.invalidRequest` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/invoices/SAMPLE_VOUCHER/action?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountName":"string","accountUniqueName":"string","chequeNumber":"string","description":"string","tagNames":[],"action":"string","exchangeRate":0,"cancelReason":"string","cancelRemarks":"string","deposits":[]}'
```

---

### `POST /company/{companyUniqueName}/ledger/upload`

Upload File For Ledger

- **Controller:** `AttachmentController#uploadFileForLedger`
- **Source:** `src/main/java/com/giddh/api/controllers/AttachmentController.java:53`
- **Deprecated:** No
- **Consumes:** `("content-type=multipart/*")`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `entries` — type: `String`; optional
**Multipart parts**
- `file` — type: `MultipartFile`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Attachment uploaded successfully."`

```json
{
  "status": "success",
  "body": "Attachment uploaded successfully."
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload?branchUniqueName=aaaa&entries=SAMPLE_entries' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `DELETE /company/{companyUniqueName}/ledger/upload/{attachedFileUniqueName}`

Delete Attachment

- **Controller:** `VoucherController#deleteAttachment`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:409`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `attachedFileUniqueName` — type: `String`; required

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Attachment deleted."`

```json
{
  "status": "success",
  "body": "Attachment deleted."
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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload/SAMPLE_attachedFileUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/ocr-data`

Get Ocr Uploaded Data

- **Controller:** `VoucherController#getOcrUploadedData`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:659`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `requestId` — type: `String`; optional; default: ``
- `voucherType` — type: `String`; optional; default: ``
- `nextToken` — type: `String`; optional; default: ``
- `currentToken` — type: `String`; optional; default: ``
- `ocrType` — type: `String`; optional; default: `income`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherFacadeService.getOcrExtractedData(company, branch, requestId, voucherType, nextToken, currentToken, ocrType`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ocr-data?branchUniqueName=aaaa&requestId=&voucherType=&nextToken=&currentToken=&ocrType=income' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/pettycash-manager/{entryUniqueName}`

Action

- **Controller:** `PettyCashManagerController#action`
- **Source:** `src/main/java/com/giddh/api/controllers/PettyCashManagerController.java:34`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `entryUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; optional
- `action` — type: `String`; required

#### Request payload

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/pettycash-manager/SAMPLE_ENTRY?accountUniqueName=SAMPLE_ACCOUNT&action=SAMPLE_action&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"ledgerRequest":"string","message":"string"}'
```

---

### `DELETE /company/{companyUniqueName}/recurring-vouchers/{recurringVoucherUniqueName}`

Updates the status of a recurring voucher rule.

- **Controller:** `RecurringVoucherController#deleteRecurringVoucher`
- **Source:** `src/main/java/com/giddh/api/controllers/RecurringVoucherController.java:69`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `recurringVoucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Recurring voucher deleted successfully"`

```json
{
  "status": "success",
  "body": "Recurring voucher deleted successfully"
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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-vouchers/SAMPLE_recurringVoucherUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/recurring-vouchers/{recurringVoucherUniqueName}`

Returns detailed information about a specific recurring voucher rule,

- **Controller:** `RecurringVoucherController#getRecurringRuleDetails`
- **Source:** `src/main/java/com/giddh/api/controllers/RecurringVoucherController.java:119`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `recurringVoucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-vouchers/SAMPLE_recurringVoucherUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/{companyUniqueName}/recurring-vouchers/{recurringVoucherUniqueName}`

Updates the status of a recurring voucher rule.

- **Controller:** `RecurringVoucherController#updateRecurringVoucherStatus`
- **Source:** `src/main/java/com/giddh/api/controllers/RecurringVoucherController.java:54`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `recurringVoucherUniqueName` — type: `String`; required
**Query parameters**
- `status` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Recurring voucher status updated successfully"`

```json
{
  "status": "success",
  "body": "Recurring voucher status updated successfully"
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

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-vouchers/SAMPLE_recurringVoucherUniqueName?status=SAMPLE_status&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/recurring-vouchers/{recurringVoucherUniqueName}/details`

Returns detailed information about a specific recurring voucher rule,

- **Controller:** `RecurringVoucherController#getRecurringVoucherDetails`
- **Source:** `src/main/java/com/giddh/api/controllers/RecurringVoucherController.java:134`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `recurringVoucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-vouchers/SAMPLE_recurringVoucherUniqueName/details?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/recurring-vouchers/get-all-recurring-voucher`

Provides a preview of upcoming dates on which vouchers

- **Controller:** `RecurringVoucherController#getAllRecurringRules`
- **Source:** `src/main/java/com/giddh/api/controllers/RecurringVoucherController.java:93`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `sortBy` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `voucherType` — type: `String`; required
- `q` — type: `String`; optional; default: ``

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-vouchers/get-all-recurring-voucher?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=50&sortBy=date&sort=desc&voucherType=SAMPLE_voucherType&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/recurring-vouchers/preview`

Deletes a recurring voucher rule.

- **Controller:** `RecurringVoucherController#getPreview`
- **Source:** `src/main/java/com/giddh/api/controllers/RecurringVoucherController.java:83`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Request payload

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
- Body evidence: `recurringVoucherTriggerService.preview(previewRequest`

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
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_AUTH_KEY",
  "message": "Invalid Auth-Key."
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/recurring-vouchers/preview?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"startDate":"01-04-2025","frequency":"string","repeatOn":"string","end":"string","repeatOption":"string","unit":"DAY","interval":0,"type":"string","dayOfMonth":0,"weekdays":[],"nth":0,"weekday":"string","count":0,"endDate":"01-04-2025"}'
```

---

### `GET /company/{companyUniqueName}/voucher/{voucherUniqueName}/versions`

Get Voucher Version

- **Controller:** `VoucherController#getVoucherVersion`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:560`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/voucher/SAMPLE_VOUCHER/versions?page=1&count=10&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/vouchers/{voucherUniqueName}/adjust`

Adjust Vouchers

- **Controller:** `VoucherController#adjustVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:489`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required

#### Request payload

Type: `LinkedList<VoucherAdjustmentResource>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherType` | `String` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | REVERSE_CHARGE, ADVANCE_RECEIPT, EXPORT |
| `voucherNumber` | `String` | not declared | unconstrained |
| `unadjustedAmount` | `AmountDetails` | not declared | unconstrained |
| `voucherTotal` | `AmountDetails` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `currency` | `CodeSymbolModel` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `amount` | `AmountDetails` | not declared | unconstrained |
| `voucherBalanceType` | `String` | not declared | unconstrained |

Example:

```json
{
  "voucherType": "string",
  "subVoucher": "REVERSE_CHARGE",
  "voucherNumber": "string",
  "unadjustedAmount": "string",
  "voucherTotal": "string",
  "uniqueName": "string",
  "currency": "string",
  "exchangeRate": 0,
  "amount": "string",
  "voucherBalanceType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucher.getAdjustmentsAsResource(`

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `error.code.invalidRequest` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INTERRUPTED",
  "message": "Interrupted"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/SAMPLE_VOUCHER/adjust?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherType":"string","subVoucher":"REVERSE_CHARGE","voucherNumber":"string","unadjustedAmount":"string","voucherTotal":"string","uniqueName":"string","currency":"string","exchangeRate":0,"amount":"string","voucherBalanceType":"string"}'
```

---

### `POST /company/{companyUniqueName}/vouchers/bulk-export`

Bulk Export

- **Controller:** `VoucherController#bulkExport`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:435`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; optional
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `noteType` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
- Body evidence: `new FileResponse<>(message, FileResponse.MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/bulk-export?from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /company/{companyUniqueName}/vouchers/bulk-update`

Bulk Update

- **Controller:** `VoucherController#bulkUpdate`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:356`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `action` — type: `String`; required

#### Request payload

Type: `BulkUpdateVoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherUniqueNames` | `Set<String>` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `templateUniqueName` | `String` | not declared | unconstrained |
| `message1` | `String` | not declared | unconstrained |
| `message2` | `String` | not declared | unconstrained |
| `imageSignatureUniqueName` | `String` | not declared | unconstrained |
| `slogan` | `String` | not declared | unconstrained |
| `voucherDueDate` | `LocalDate` | not declared | unconstrained |
| `shippingDetails` | `AddressResource` | not declared | unconstrained |
| `customField1` | `String` | not declared | unconstrained |
| `customField2` | `String` | not declared | unconstrained |
| `customField3` | `String` | not declared | unconstrained |

Example:

```json
{
  "voucherUniqueNames": [],
  "voucherType": "string",
  "templateUniqueName": "string",
  "message1": "string",
  "message2": "string",
  "imageSignatureUniqueName": "string",
  "slogan": "string",
  "voucherDueDate": "01-04-2025",
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/bulk-update?action=SAMPLE_action&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherUniqueNames":[],"voucherType":"string","templateUniqueName":"string","message1":"string","message2":"string","imageSignatureUniqueName":"string","slogan":"string","voucherDueDate":"01-04-2025","shippingDetails":"string","customField1":"string","customField2":"string","customField3":"string"}'
```

---

### `POST /company/{companyUniqueName}/vouchers/get-all`

Get All Vouchers

- **Controller:** `VoucherController#getAllVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:108`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `noteType` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `voucherCount` — type: `int`; optional; default: `50`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/get-all?page=1&count=50&from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&voucherCount=50&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /company/{companyUniqueName}/vouchers/get-all-vouchers-balances`

Get All Balances Vouchers

- **Controller:** `VoucherController#getAllBalancesVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:152`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `noteType` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
- Body evidence: `voucherTotals`

```json
{
  "status": "success",
  "body": {
    "reference": "voucherTotals"
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

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/get-all-vouchers-balances?from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /company/{companyUniqueName}/vouchers/invoice-list`

Get Un Adjusted Vouchers

- **Controller:** `VoucherController#getUnAdjustedVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:338`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `number` — type: `String`; optional
- `adjustmentRequest` — type: `boolean`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Request payload

Type: `VoucherAdjustmentResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherType` | `String` | not declared | unconstrained |
| `subVoucher` | `SubVoucher` | not declared | REVERSE_CHARGE, ADVANCE_RECEIPT, EXPORT |
| `voucherNumber` | `String` | not declared | unconstrained |
| `unadjustedAmount` | `AmountDetails` | not declared | unconstrained |
| `voucherTotal` | `AmountDetails` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `currency` | `CodeSymbolModel` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `amount` | `AmountDetails` | not declared | unconstrained |
| `voucherBalanceType` | `String` | not declared | unconstrained |

Example:

```json
{
  "voucherType": "string",
  "subVoucher": "REVERSE_CHARGE",
  "voucherNumber": "string",
  "unadjustedAmount": "string",
  "voucherTotal": "string",
  "uniqueName": "string",
  "currency": "string",
  "exchangeRate": 0,
  "amount": "string",
  "voucherBalanceType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `vouchers`

```json
{
  "status": "success",
  "body": {
    "reference": "vouchers"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/invoice-list?branchUniqueName=aaaa&number=SAMPLE_number&adjustmentRequest=SAMPLE_adjustmentRequest&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherType":"string","subVoucher":"REVERSE_CHARGE","voucherNumber":"string","unadjustedAmount":"string","voucherTotal":"string","uniqueName":"string","currency":"string","exchangeRate":0,"amount":"string","voucherBalanceType":"string"}'
```

---

### `POST /company/{companyUniqueName}/vouchers/voucher-status-count`

Get Voucher Status Count

- **Controller:** `VoucherController#getVoucherStatusCount`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:185`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `branchUniqueName` — type: `String`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherStatusCounter`

```json
{
  "status": "success",
  "body": {
    "reference": "voucherStatusCounter"
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

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/voucher-status-count?from=01-04-2025&to=31-03-2026&type=sales&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /env`

Get Env

- **Controller:** `MainController#getEnv`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:38`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `serverProps.getEnvironment(`

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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/env' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /magic-link/{magicLink}/download-voucher`

Download

- **Controller:** `MagicLinkController#download`
- **Source:** `src/main/java/com/giddh/api/controllers/MagicLinkController.java:49`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `magicLink` — type: `String`; required
**Query parameters**
- `downloadOption` — type: `DownloadOption`; optional; default: `ALL`; allowed: `VOUCHER`, `ATTACHMENT`, `ALL`

#### Request payload

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `error.code.magicLinkExpired` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `error.code.invalidRequest` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/magic-link/SAMPLE_magicLink/download-voucher?downloadOption=ALL' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","voucherType":"string","selectAllFields":[],"copyTypes":[],"uniqueName":"string","entryUniqueName":"string","paymentId":"string","certId":"string","certificateBase64":"string","certificateChainBase64":[],"showSectionsInline":false,"fileType":"PDF","from":"01-04-2025","to":"01-04-2025"}'
```

---

### `GET /ping`

Ping

- **Controller:** `MainController#ping`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:33`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"pong"`

```json
{
  "status": "success",
  "body": "pong"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED_ERROR` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid request parameters."
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/ping' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/{voucherUniqueName}/add-comment`

Add Comments

- **Controller:** `PortalController#addComments`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:158`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

Type: `Comment` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `userName` | `String` | not declared | unconstrained |
| `date` | `LocalDate` | not declared | unconstrained |

Example:

```json
{
  "uniqueName": "string",
  "description": "string",
  "userName": "string",
  "date": "01-04-2025"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"success"`

```json
{
  "status": "success",
  "body": "success"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_VOUCHER/add-comment?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueName":"string","description":"string","userName":"string","date":"01-04-2025"}'
```

---

### `GET /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/{voucherUniqueName}/comments`

Get Comments

- **Controller:** `PortalController#getComments`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:174`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `commentList`

```json
{
  "status": "success",
  "body": {
    "reference": "commentList"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/SAMPLE_VOUCHER/comments?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/download-file`

Download

- **Controller:** `PortalController#download`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:96`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `fileType` — type: `String`; optional; default: `pdf`
- `downloadOption` — type: `DownloadOption`; optional; default: `ALL`; allowed: `VOUCHER`, `ATTACHMENT`, `ALL`

#### Request payload

Type: `List<String>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `items` | `string[]` | required | unconstrained |

Example:

```json
{
  "items": []
}
```

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `error.code.invalidRequest` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/download-file?branchUniqueName=aaaa&fileType=pdf&downloadOption=ALL' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `POST /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/invoice-pay-request`

Get Invoice Payment Request

- **Controller:** `PortalController#getInvoicePaymentRequest`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:135`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

#### Request payload

Type: `JsonNode` (required).

No finite field/value contract is declared by the controller.

Example:

```json
{}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherPaymentRequest`

```json
{
  "status": "success",
  "body": {
    "reference": "voucherPaymentRequest"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoice-pay-request?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `POST /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/{paymentId}/pay`

Process Voucher Payment

- **Controller:** `PortalController#processVoucherPayment`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:146`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `paymentId` — type: `String`; required

#### Request payload

Type: `String` (required).

No finite field/value contract is declared by the controller.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"Payment accepted successfully."`

```json
{
  "status": "success",
  "body": "Payment accepted successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/SAMPLE_paymentId/pay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/{paymentId}/paypal/ipn`

Process Voucher Payment

- **Controller:** `PortalController#processVoucherPayment`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:146`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `paymentId` — type: `String`; required

#### Request payload

Type: `String` (required).

No finite field/value contract is declared by the controller.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `"Payment accepted successfully."`

```json
{
  "status": "success",
  "body": "Payment accepted successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/invoices/SAMPLE_paymentId/paypal/ipn?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/payment-methods`

Get Payment Methods

- **Controller:** `PortalController#getPaymentMethods`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:205`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `enabledPaymentMethods`

```json
{
  "status": "success",
  "body": {
    "reference": "enabledPaymentMethods"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/payment-methods?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/voucher/{voucherUniqueName}`

Get Voucher

- **Controller:** `PortalController#getVoucher`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:187`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/voucher/SAMPLE_VOUCHER?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/balance-summary`

Get Balance Summary

- **Controller:** `PortalController#getBalanceSummary`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:120`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; optional; default: `sales`
- `branchUniqueName` — type: `String`; optional

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherBalanceSummary`

```json
{
  "status": "success",
  "body": {
    "reference": "voucherBalanceSummary"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/balance-summary?type=sales&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /portal/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/get-all`

Get All Vouchers

- **Controller:** `PortalController#getAllVouchers`
- **Source:** `src/main/java/com/giddh/api/controllers/PortalController.java:57`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `noteType` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `voucherDate`
- `voucherCount` — type: `int`; optional; default: `20`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/portal/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/get-all?page=1&count=20&from=01-04-2025&to=31-03-2026&type=sales&noteType=SAMPLE_noteType&sort=desc&sortBy=voucherDate&voucherCount=20&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"type":"string","noteVoucherType":"string","fromDate":"01-04-2025","toDate":"01-04-2025","receiptType":"ADVANCE_RECEIPT","source":"string","attachmentExport":false,"selectAllFields":[],"voucherExport":false,"fileNameFormat":"string","showVoucherCustomFields":false,"showAccountCustomFields":false,"showBillingAddress":false,"showShippingAddress":false,"showTaxableValueBeforeDiscount":false,"showDiscountValue":false,"showTaxValue":false,"showShippingDetails":false,"showVoucherNote":false,"showEInvoiceDetails":false,"showMobileNumber":false,"showAttentionTo":false,"showEmail":false,"showOtherTaxValue":false,"dueDate":"01-04-2025","dueDateBefore":false,"dueDateAfter":false,"dueDateEqual":false,"voucherDate":"01-04-2025","voucherDateBefore":false,"voucherDateAfter":false,"voucherDateEqual":false,"page":0,"count":0,"sort":"string","sortBy":"string","q":"string","fileType":"string","voucherCount":0,"groupIds":[],"accountIds":[],"voucherIds":[],"uniqueNames":[],"entryUniqueNames":[],"balanceDue":0,"balanceEqual":false,"balanceMoreThan":false,"balanceLessThan":false,"total":0,"totalEqual":false,"totalMoreThan":false,"totalLessThan":false,"description":"string","accountUniqueName":"string","groupUniqueName":"string","copyTypes":[],"eInvoiceStatus":[],"balanceStatus":[],"purchaseOrderNumber":"string","companyUniqueName":"string","branchUniqueName":"string","userId":0,"exportType":"EXPORT_WITH_PAY","totalVouchers":0,"requestId":"string","mergePdf":false,"exportFromLedger":false,"salesPersonUniqueNames":[]}'
```

---

### `POST /seed/einvoice-bulk-planter`

Rabbit Mq Planter

- **Controller:** `SeedController#rabbitMqPlanter`
- **Source:** `src/main/java/com/giddh/api/controllers/SeedController.java:29`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

No request inputs.

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<String>`
- Body evidence: `ResponseEntity<String>`

```json
"string"
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "IO",
  "message": "IO"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/seed/einvoice-bulk-planter' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/{companyUniqueName}/stock-history`

Get Stock History

- **Controller:** `StockHistoryController#getStockHistory`
- **Source:** `src/main/java/com/giddh/api/controllers/StockHistoryController.java:34`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

### `ANY /v2/company/{companyUniqueName}/template-preview`

Get Template Preview

- **Controller:** `VoucherController#getTemplatePreview`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:707`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication) (mapping does not restrict the HTTP method)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `debugMode` — type: `boolean`; optional

#### Request payload

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

### `ANY /v2/company/{companyUniqueName}/templates/{templateUniqueName}`

Download Template Preview

- **Controller:** `VoucherController#downloadTemplatePreview`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:690`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication) (mapping does not restrict the HTTP method)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `templateUniqueName` — type: `String`; required
**Query parameters**
- `debugMode` — type: `boolean`; optional
- `type` — type: `String`; optional

#### Request payload

None.

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/templates/SAMPLE_templateUniqueName?debugMode=SAMPLE_debugMode&type=SAMPLE_type&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`

Get

- **Controller:** `VoucherController#get`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:203`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `isRecurringVoucher` — type: `boolean`; optional; default: `false`

#### Request payload

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
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa&isRecurringVoucher=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

---

### `PUT /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`

Update

- **Controller:** `VoucherController#update`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:220`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `isRecurringVoucher` — type: `boolean`; optional; default: `false`

#### Request payload

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
- Body evidence: `isRecurringVoucher ? "Recurring voucher updated successfully" : response`

```json
{
  "status": "success",
  "body": "Recurring voucher updated successfully"
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

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers?branchUniqueName=aaaa&isRecurringVoucher=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

---

### `POST /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate`

Create

- **Controller:** `VoucherController#create`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:89`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `isRecurringVoucher` — type: `boolean`; optional; default: `false`

#### Request payload

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

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `isRecurringVoucher ? "Recurring voucher created successfully" : response`

```json
{
  "status": "success",
  "body": "Recurring voucher created successfully"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/generate?branchUniqueName=aaaa&isRecurringVoucher=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

---

### `GET /v4/company/{companyUniqueName}/subscriptions/{subscriptionId}/wallet/transactions`

Get Wallet Transactions

- **Controller:** `WalletController#getWalletTransactions`
- **Source:** `src/main/java/com/giddh/api/controllers/WalletController.java:45`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `subscriptionId` — type: `Long`; required
**Query parameters**
- `page` — type: `int`; optional; default: `0`
- `size` — type: `int`; optional; default: `10`

#### Request payload

None.

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/subscriptions/SAMPLE_subscriptionId/wallet/transactions?page=0&size=10&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /v4/company/{companyUniqueName}/vouchers`

Update Patch

- **Controller:** `VoucherController#updatePatch`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:243`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Request payload

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

### `POST /v4/company/{companyUniqueName}/vouchers`

Get

- **Controller:** `VoucherController#get`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:203`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `isRecurringVoucher` — type: `boolean`; optional; default: `false`

#### Request payload

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
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_PARAMETERS",
  "message": "Invalid Parameter"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers?branchUniqueName=aaaa&isRecurringVoucher=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

---

### `PUT /v4/company/{companyUniqueName}/vouchers`

Update

- **Controller:** `VoucherController#update`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:220`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `isRecurringVoucher` — type: `boolean`; optional; default: `false`

#### Request payload

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
- Body evidence: `isRecurringVoucher ? "Recurring voucher updated successfully" : response`

```json
{
  "status": "success",
  "body": "Recurring voucher updated successfully"
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

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers?branchUniqueName=aaaa&isRecurringVoucher=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

---

### `POST /v4/company/{companyUniqueName}/vouchers/{voucherUniqueName}/make-recurring`

used to generate recurring

- **Controller:** `VoucherController#makeVoucherRecurring`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:735`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

### `POST /v4/company/{companyUniqueName}/vouchers/bulk-generate`

Bulk Create

- **Controller:** `VoucherController#bulkCreate`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:370`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `combined` — type: `boolean`; required

#### Request payload

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

### `POST /v4/company/{companyUniqueName}/vouchers/generate`

Create

- **Controller:** `VoucherController#create`
- **Source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:89`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `isRecurringVoucher` — type: `boolean`; optional; default: `false`

#### Request payload

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

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `isRecurringVoucher ? "Recurring voucher created successfully" : response`

```json
{
  "status": "success",
  "body": "Recurring voucher created successfully"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/vouchers/generate?branchUniqueName=aaaa&isRecurringVoucher=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"TCS_FUNCTION":"string","TDS_FUNCTION":"string","GST_TAX_FUNCTION":"string","voucherId":0,"number":"string","type":"string","uniqueName":"string","isCustomInvoiceNo":false,"companyDetails":"string","accountDetails":"string","entryResources":[],"warehouseDetails":"string","isTouristSchemeApplicable":false,"mergePB":false,"passportNumber":"string","withPay":false,"forNewSubscription":false,"subVoucher":"REVERSE_CHARGE","roundOffApplicable":false,"updateAccountDetails":false,"copyBillingAddressToShippingAddress":false,"readDetailsFromAccount":false,"tallyUniqueId":"string","templateDetails":"string","subTotal":"string","discountTotal":"string","taxTotal":"string","roundOffTotal":"string","otherTaxTotal":"string","voucherTotal":"string","grandTotal":"string","totalAsWords":"string","ewayBillDetails":"string","roundOffAccount":"string","items":[],"deposits":[],"voucherDate":"01-04-2025","exchangeRate":0,"purchaseOrders":[],"purchaseOrderDetails":[],"generateEInvoice":false,"multiCurrency":false,"encodedData":"string","token":"string","salesPerson":"string","fileExtention":"string","fileName":"string","recurrencePreviewRequest":"string","recurringVoucherUniqueName":"string"}'
```

