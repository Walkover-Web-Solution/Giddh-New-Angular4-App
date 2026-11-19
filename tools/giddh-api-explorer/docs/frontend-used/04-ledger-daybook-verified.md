# Backend-Verified Frontend APIs: 04-ledger-daybook.md

Only exact HTTP method + normalized controller-path matches are included.

### `GET /v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/advance-receipt/all?invoiceDate=:invoiceDate`

- **Frontend id:** `ADVANCE_RECEIPTS_API.GET_ALL_ADVANCE_RECEIPTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#getAllAdvanceReceiptVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#getAllAdvanceReceipts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:218`
- **Deprecated:** No

This function is use to get all the advanced receipts for a company and account with balance due greater than

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `invoiceDate` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `voucherAdjustmentResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "voucherAdjustmentResponse"
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
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/advance-receipt/all?invoiceDate=SAMPLE_invoiceDate&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/advance-receipt/adjust?invoiceUniqueName=:invoiceUniqueName`

- **Frontend id:** `ADVANCE_RECEIPTS_API.INVOICE_ADJUSTMENT_WITH_ADVANCE_RECEIPT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#adjustAnInvoiceWithAdvanceReceipts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AdvanceReceiptController#adjustAdvanceReceiptEntryWithInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/advancereceipt/AdvanceReceiptController.java:79`
- **Deprecated:** No

/

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `invoiceUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `VoucherAdjustmentsForInvoice` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `adjustments` | `List<VoucherAdjustmentResponse>` | not declared | unconstrained |
| `tdsTaxUniqueName` | `String` | not declared | unconstrained |
| `tdsAmount` | `AmountDetails` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `totalAdjustmentAmount` | `BigDecimal` | not declared | unconstrained |

Example:

```json
{
  "adjustments": [],
  "tdsTaxUniqueName": "string",
  "tdsAmount": "string",
  "description": "string",
  "totalAdjustmentAmount": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.advance.receipt.adjust"`

```json
{
  "status": "success",
  "body": "success.advance.receipt.adjust"
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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/advance-receipt/adjust?invoiceUniqueName=SAMPLE_invoiceUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"adjustments":[],"tdsTaxUniqueName":"string","tdsAmount":"string","description":"string","totalAdjustmentAmount":0}'
```

---

### `POST /company/:companyUniqueName/vouchers/:voucherUniqueName/adjust`

- **Frontend id:** `ADVANCE_RECEIPTS_API.VOUCHER_ADJUSTMENT_WITH_ADVANCE_RECEIPT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/sales.service.ts#adjustAnInvoiceWithAdvanceReceipts; apps/web-giddh/src/app/services/voucher.service.ts#adjustAnInvoiceWithAdvanceReceipts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#adjustVouchers
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:489`
- **Deprecated:** No

Adjust Vouchers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `voucherUniqueName` — type: `String`; required

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `GET /company/:companyUniqueName/imports/reconciliation`

- **Frontend id:** `BANK_RECONCILIATION_API.GET_ALL`
- **Frontend evidence:** `apps/web-giddh/src/app/bank-reconciliation/utility/bank-reconciliation.service.ts#getAll`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ReconciliationController#list
- **Backend source:** `src/main/java/com/giddh/api/controllers/ReconciliationController.java:107`
- **Deprecated:** No

Process a previously uploaded Excel/CSV reconciliation file with user-provided column mappings.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/imports/reconciliation/process?accountUniqueName=:accountUniqueName`

- **Frontend id:** `BANK_RECONCILIATION_API.PROCESS`
- **Frontend evidence:** `apps/web-giddh/src/app/bank-reconciliation/utility/bank-reconciliation.service.ts#process`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ReconciliationController#process
- **Backend source:** `src/main/java/com/giddh/api/controllers/ReconciliationController.java:91`
- **Deprecated:** No

Process a previously uploaded Excel/CSV reconciliation file with user-provided column mappings.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ReconciliationProcessRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `requestId` | `String` | not declared | unconstrained |
| `sameDebitCreditColumn` | `boolean` | not declared | unconstrained |
| `mappings` | `List<ImportMappings>` | not declared | unconstrained |

Example:

```json
{
  "requestId": "string",
  "sameDebitCreditColumn": false,
  "mappings": []
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
| 400 | `CSV_VALIDATION` | `CsvValidationException` | CsvValidationException raised by controller or shared ExceptionHandler |
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
  "code": "CSV_VALIDATION",
  "message": "Csv Validation"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation/process?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"requestId":"string","sameDebitCreditColumn":false,"mappings":[]}'
```

---

### `POST /company/:companyUniqueName/imports/reconciliation/upload`

- **Frontend id:** `BANK_RECONCILIATION_API.UPLOAD`
- **Frontend evidence:** `apps/web-giddh/src/app/bank-reconciliation/utility/bank-reconciliation.service.ts#upload`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ReconciliationController#upload
- **Backend source:** `src/main/java/com/giddh/api/controllers/ReconciliationController.java:66`
- **Deprecated:** No

Upload a bank statement file (PDF or Excel/CSV) to initiate reconciliation.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `accountUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `password` — type: `String`; optional
- `lang` — type: `String`; optional; default: `en`
- `sameDebitCreditColumn` — type: `boolean`; optional
**Multipart parts**
- `file` — type: `MultipartFile`; required

#### Controller-backed request payload

None.

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
| 400 | `CSV_VALIDATION` | `CsvValidationException` | CsvValidationException raised by controller or shared ExceptionHandler |
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
  "code": "CSV_VALIDATION",
  "message": "Csv Validation"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation/upload?branchUniqueName=aaaa&accountUniqueName=SAMPLE_ACCOUNT&from=01-04-2025&to=31-03-2026&password=SAMPLE_password&lang=en&sameDebitCreditColumn=SAMPLE_sameDebitCreditColumn' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `GET /time`

- **Frontend id:** `CURRENT_DATE_API`
- **Frontend evidence:** `accounting.constant.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: MainController#getServerTime
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:279`
- **Deprecated:** No

Get Server Time

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `time`

```json
{
  "status": "success",
  "body": {
    "reference": "time"
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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/time' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/export-settings/daybook-v2?page=:page&count=:count&from=:from&to=:to&format=:format&type=:type&sort=:sort`

- **Frontend id:** `DAYBOOK_SEARCH_API.EXPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/daybook.service.ts#ExportDaybook; apps/web-giddh/src/app/services/daybook.service.ts#ExportDaybookPost`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getDaybookExportV3WithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:722`
- **Deprecated:** No

Get Daybook Export V3With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `format` — type: `String`; optional; default: `xlsx`
- `type` — type: `String`; optional; default: `view-detailed`
- `fileType` — type: `String`; optional; default: `base64`
- `sort` — type: `String`; optional; default: `desc`
- `branchUniqueName` — type: `String`; optional

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-settings/daybook-v2?from=01-04-2025&to=31-03-2026&format=xlsx&type=view-detailed&fileType=base64&sort=desc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/export-settings/daybook-v2?page=:page&count=:count&from=:from&to=:to&format=:format&type=:type&sort=:sort`

- **Frontend id:** `DAYBOOK_SEARCH_API.EXPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/daybook.service.ts#ExportDaybook; apps/web-giddh/src/app/services/daybook.service.ts#ExportDaybookPost`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getDaybookExportV3WithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:722`
- **Deprecated:** No

Get Daybook Export V3With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `format` — type: `String`; optional; default: `xlsx`
- `type` — type: `String`; optional; default: `view-detailed`
- `fileType` — type: `String`; optional; default: `base64`
- `sort` — type: `String`; optional; default: `desc`
- `branchUniqueName` — type: `String`; optional

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-settings/daybook-v2?from=01-04-2025&to=31-03-2026&format=xlsx&type=view-detailed&fileType=base64&sort=desc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/daybook?page=:page&count=:count&from=:from&to=:to`

- **Frontend id:** `DAYBOOK_SEARCH_API.SEARCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/daybook.service.ts#GetDaybook`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getDaybookV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:503`
- **Deprecated:** No

Get Daybook V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `branchUniqueName` — type: `String`; optional

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
- Body evidence: `daybookView`

```json
{
  "status": "success",
  "body": {
    "reference": "daybookView"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/daybook?page=1&count=20&from=01-04-2025&to=31-03-2026&sort=desc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/due-amount-report?q=:q&page=:page&count=:count&sort=:sort&sortBy=:sortBy&rangeCol=:rangeCol&vendorCustomerType=:vendorCustomerType`

- **Frontend id:** `DUEAMOUNTREPORT_API_V2.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/agingreporting.service.ts#GetDueAmountReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getDebtorDueAmountReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:696`
- **Deprecated:** No

Get Debtor Due Amount Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sort` — type: `String`; optional; default: `asc`
- `sortBy` — type: `String`; optional; default: `name`
- `rangeCol` — type: `String`; optional; default: `0`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional
- `vendorCustomerType` — type: `String`; optional; default: `CUSTOMER`

#### Controller-backed request payload

Type: `DueAmountReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `includeTotalDueAmount` | `Boolean` | not declared | unconstrained |
| `totalDueAmountGreaterThan` | `Boolean` | not declared | unconstrained |
| `totalDueAmountLessThan` | `Boolean` | not declared | unconstrained |
| `totalDueAmountEqualTo` | `Boolean` | not declared | unconstrained |
| `totalDueAmountNotEqualTo` | `Boolean` | not declared | unconstrained |
| `totalDueAmount` | `BigDecimal` | not declared | unconstrained |
| `includeName` | `Boolean` | not declared | unconstrained |
| `names` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "includeTotalDueAmount": false,
  "totalDueAmountGreaterThan": false,
  "totalDueAmountLessThan": false,
  "totalDueAmountEqualTo": false,
  "totalDueAmountNotEqualTo": false,
  "totalDueAmount": 0,
  "includeName": false,
  "names": []
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/due-amount-report?page=1&count=20&sort=asc&sortBy=name&rangeCol=0&q=&branchUniqueName=aaaa&vendorCustomerType=CUSTOMER' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"includeTotalDueAmount":false,"totalDueAmountGreaterThan":false,"totalDueAmountLessThan":false,"totalDueAmountEqualTo":false,"totalDueAmountNotEqualTo":false,"totalDueAmount":0,"includeName":false,"names":[]}'
```

---

### `POST /company/:companyUniqueName/due-days-range?vendorCustomerType=:vendorCustomerType`

- **Frontend id:** `DUEDAYSRANGE_API_V2.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/agingreporting.service.ts#CreateDueDaysRange; apps/web-giddh/src/app/services/agingreporting.service.ts#GetDueDaysRange`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#addDueAmountRange
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:792`
- **Deprecated:** No

Add Due Amount Range

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `vendorCustomerType` — type: `String`; optional; default: `CUSTOMER`

#### Controller-backed request payload

Type: `DueAmountRange` (optional).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Due date range created successfully"`

```json
{
  "status": "success",
  "body": "Due date range created successfully"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/due-days-range?branchUniqueName=aaaa&vendorCustomerType=CUSTOMER' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/due-days-range?vendorCustomerType=:vendorCustomerType`

- **Frontend id:** `DUEDAYSRANGE_API_V2.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/agingreporting.service.ts#CreateDueDaysRange; apps/web-giddh/src/app/services/agingreporting.service.ts#GetDueDaysRange`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getDueAmountRange
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:808`
- **Deprecated:** No

Get Due Amount Range

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `vendorCustomerType` — type: `String`; optional; default: `CUSTOMER`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `range`

```json
{
  "status": "success",
  "body": {
    "reference": "range"
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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/due-days-range?branchUniqueName=aaaa&vendorCustomerType=CUSTOMER' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/account-search-predicted?accountUniqueName=:accountUniqueName`

- **Frontend id:** `LEDGER_API.ACCOUNT_SEARCH_PREDICTION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#getAccountSearchPrediction`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: SearchController#accountSearchPredicted
- **Backend source:** `src/main/java/com/giddh/api/controllers/SearchController.java:199`
- **Deprecated:** No

Account Search Predicted

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `List<EntryAccountPredictionRequest>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |

Example:

```json
{
  "uniqueName": "string",
  "description": "string"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/account-search-predicted?accountUniqueName=SAMPLE_ACCOUNT&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueName":"string","description":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/ledgers/merge?sort=asc`

- **Frontend id:** `LEDGER_API.ADVANCE_SEARCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#AdvanceSearch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerController#retrieveLedgers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerController.java:279`
- **Deprecated:** No

Retrieve Ledgers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `count` — type: `int`; optional; default: `50`
- `q` — type: `String`; optional; default: ``
- `sort` — type: `String`; optional; default: `desc`
- `branchUniqueName` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`

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
- Body evidence: `ledgerService.retrieveLedgers(entrySearchHelper`

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
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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
  "code": "EXECUTION",
  "message": "Execution"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as ILedgerAdvanceSearchResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/merge?from=01-04-2025&to=31-03-2026&count=50&q=&sort=desc&branchUniqueName=aaaa&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bulk-export?from=:from&to=:to`

- **Frontend id:** `LEDGER_API.BULK_EXPORT_LEDGER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#bulkExport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#bulkExport
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:435`
- **Deprecated:** No

Bulk Export

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2`

- **Frontend id:** `LEDGER_API.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#CreateLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerControllerV2#create; accounting-microservice: LedgerController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerControllerV2.java:67`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `validateTax` — type: `boolean`; optional; default: `true`

#### Controller-backed request payload

Type: `LedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `description` | `String` | not declared | unconstrained |
| `tag` | `String` | not declared | unconstrained |
| `entryDate` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `referenceId` | `String` | not declared | unconstrained |
| `unconfirmedEntry` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `applyApplicableDiscount` | `Boolean` | not declared | unconstrained |
| `isInclusiveTax` | `Boolean` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `specialTaxes` | `Set<String>` | not declared | unconstrained |
| `entry` | `Entry` | not declared | unconstrained |
| `isRecurring` | `Boolean` | not declared | unconstrained |
| `isSubscription` | `Boolean` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `chequeClearanceDate` | `String` | not declared | unconstrained |
| `isV2Invoice` | `Boolean` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `linkedInvoices` | `Set<String>` | not declared | unconstrained |
| `invoicesToBePaid` | `Set<String>` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `proratedDate` | `String` | not declared | unconstrained |
| `recurringFrom` | `String` | not declared | unconstrained |
| `attachedFile` | `String` | not declared | unconstrained |
| `tags` | `Set<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `transactions` | `List<TransactionInput>` | not declared | unconstrained |
| `entryTotalForAccount` | `BigDecimal` | not declared | unconstrained |
| `entryTotalForCompany` | `BigDecimal` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `ledgerDate` | `LocalDate` | not declared | unconstrained |
| `transactionId` | `String` | not declared | unconstrained |
| `generateInvoice` | `Boolean` | not declared | unconstrained |
| `invoiceAction` | `EntryInvoiceAction` | not declared | unconstrained |
| `discounts` | `Set<TransactionInput>` | not declared | unconstrained |
| `baseAccountName` | `String` | not declared | unconstrained |
| `rowNoForImport` | `int` | not declared | unconstrained |
| `errorMessage` | `String` | not declared | unconstrained |
| `applyApplicableDiscounts` | `Boolean` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `comingFromGenerateVoucher` | `Boolean` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `tcsCalculationMethod` | `TcsCalculationMethod` | not declared | unconstrained |
| `purchaseInvoiceNumber` | `String` | not declared | unconstrained |
| `reverseChargeTaxableAmount` | `BigDecimal` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `invoiceRequest` | `GenerateInvoiceRequest` | not declared | unconstrained |
| `itcAvailable` | `ITCAvailableType` | not declared | IMPORT_OF_GOODS, IMPORT_OF_SERVICES, ALL_OTHER_ITC |
| `subVoucher` | `SubVoucher` | not declared | unconstrained |
| `invoiceLinkingRequest` | `InvoiceLinkingRequest` | not declared | unconstrained |
| `voucherAdjustments` | `VoucherAdjustmentsForInvoice` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `giddhImportRefId` | `String` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |

Example:

```json
{
  "description": "string",
  "tag": "string",
  "entryDate": "string",
  "voucherType": "string",
  "referenceId": "string",
  "unconfirmedEntry": false,
  "applyApplicableTaxes": false,
  "applyApplicableDiscount": false,
  "isInclusiveTax": false,
  "taxes": [],
  "specialTaxes": [],
  "entry": "string",
  "isRecurring": false,
  "isSubscription": false,
  "chequeNumber": "string",
  "chequeClearanceDate": "string",
  "isV2Invoice": false,
  "sendToGstr2": false,
  "linkedInvoices": [],
  "invoicesToBePaid": [],
  "invoiceNumberAgainstVoucher": "string",
  "proratedDate": "string",
  "recurringFrom": "string",
  "attachedFile": "string",
  "tags": [],
  "tagNames": [],
  "transactions": [],
  "entryTotalForAccount": 0,
  "entryTotalForCompany": 0,
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "ledgerDate": "01-04-2025",
  "transactionId": "string",
  "generateInvoice": false,
  "invoiceAction": "string",
  "discounts": [],
  "baseAccountName": "string",
  "rowNoForImport": 0,
  "errorMessage": "string",
  "applyApplicableDiscounts": false,
  "uniqueName": "string",
  "comingFromGenerateVoucher": false,
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "tcsCalculationMethod": "string",
  "purchaseInvoiceNumber": "string",
  "reverseChargeTaxableAmount": 0,
  "roundOffApplicable": false,
  "invoiceRequest": "string",
  "itcAvailable": "IMPORT_OF_GOODS",
  "subVoucher": "string",
  "invoiceLinkingRequest": "string",
  "voucherAdjustments": "string",
  "entryUniqueNames": [],
  "giddhImportRefId": "string",
  "branch": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `ledgerCrudServiceV2.create(principal, company, ledgerRequest, account, baseAccount, ledgerRequest.getUnconfirmedEntry(`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2?branchUniqueName=aaaa&validateTax=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"description":"string","tag":"string","entryDate":"string","voucherType":"string","referenceId":"string","unconfirmedEntry":false,"applyApplicableTaxes":false,"applyApplicableDiscount":false,"isInclusiveTax":false,"taxes":[],"specialTaxes":[],"entry":"string","isRecurring":false,"isSubscription":false,"chequeNumber":"string","chequeClearanceDate":"string","isV2Invoice":false,"sendToGstr2":false,"linkedInvoices":[],"invoicesToBePaid":[],"invoiceNumberAgainstVoucher":"string","proratedDate":"string","recurringFrom":"string","attachedFile":"string","tags":[],"tagNames":[],"transactions":[],"entryTotalForAccount":0,"entryTotalForCompany":0,"exchangeRate":0,"valuesInAccountCurrency":false,"ledgerDate":"01-04-2025","transactionId":"string","generateInvoice":false,"invoiceAction":"string","discounts":[],"baseAccountName":"string","rowNoForImport":0,"errorMessage":"string","applyApplicableDiscounts":false,"uniqueName":"string","comingFromGenerateVoucher":false,"touristSchemeApplicable":false,"passportNumber":"string","tcsCalculationMethod":"string","purchaseInvoiceNumber":"string","reverseChargeTaxableAmount":0,"roundOffApplicable":false,"invoiceRequest":"string","itcAvailable":"IMPORT_OF_GOODS","subVoucher":"string","invoiceLinkingRequest":"string","voucherAdjustments":"string","entryUniqueNames":[],"giddhImportRefId":"string","branch":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/bulk-ledgers-v2`

- **Frontend id:** `LEDGER_API.CREATE_BULK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#createBulkLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: LedgerController#bulkCreate
- **Backend source:** `src/main/java/com/giddh/api/controllers/LedgerController.java:78`
- **Deprecated:** No

Bulk Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `GET /company/:companyUniqueName/currency-converter/:fromCurrency/:toCurrency`

- **Frontend id:** `LEDGER_API.CURRENCY_CONVERTER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetCurrencyRate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CurrencyConverterController#getCurrencyRates
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CurrencyConverterController.java:41`
- **Deprecated:** No

Get Currency Rates

#### Inputs

**Path parameters**
- `baseCurrency` — type: `String`; required
- `toCurrency` — type: `String`; required
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `convertedRate`

```json
{
  "status": "success",
  "body": {
    "reference": "convertedRate"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/currency-converter/SAMPLE_baseCurrency/SAMPLE_toCurrency?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/bank/accounts/:accountUniqueName/transactions`

- **Frontend id:** `LEDGER_API.DELETE_BANK_TRANSACTIONS`
- **Frontend evidence:** `ledger.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: ICICIBankController#deleteEntries
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:395`
- **Deprecated:** No

API : Delete multiple Transactions by transaction unique id

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `MultipleLedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountUniqueName` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `transactionIds` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "accountUniqueName": "string",
  "entryUniqueNames": [],
  "transactionIds": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.transaction.delete"`

```json
{
  "status": "success",
  "body": "success.transaction.delete"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/accounts/SAMPLE_ACCOUNT/transactions?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountUniqueName":"string","entryUniqueNames":[],"transactionIds":[]}'
```

---

### `DELETE /company/:companyUniqueName/accounts/:accountUniqueName/entries/:entryUniqueName`

- **Frontend id:** `LEDGER_API.DELETE_LEDGER_ENTRY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#DeleteLedgerTransaction`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EntryV1Controller#deleteEntry; accounting-microservice: LedgerController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/EntryV1Controller.java:60`
- **Deprecated:** No

Delete Entry

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `entryUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.ledger.delete"`

```json
{
  "status": "success",
  "body": "success.ledger.delete"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/entries/SAMPLE_ENTRY?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/ledger/upload/:fileName`

- **Frontend id:** `LEDGER_API.DOWNLOAD_ATTACHMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#downloadAttachement`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImageController#getUploadedFile
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImageController.java:162`
- **Deprecated:** No

Get Uploaded File

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `attachedFileUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `imageService.downloadFileFromAws(company, attachedFileUniqueName`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload/SAMPLE_attachedFileUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=base64`

- **Frontend id:** `LEDGER_API.DOWNLOAD_INVOICE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#DownloadInvoice`
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

### `GET /v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bill-to-bill/export-v2?from=:from&to=:to`

- **Frontend id:** `LEDGER_API.EXPORT_BILL_TO_BILL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#exportBillToBillLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VoucherV4Controller#exportBillToBillReportWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/VoucherV4Controller.java:310`
- **Deprecated:** No

Export Bill To Bill Report With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
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
- Body evidence: `new FileResponse<>(StaticMessageSource.getMessage("mail.delivery.notification"`

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
| 400 | `error.code.notAllowed` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `THROWABLE` | `Throwable` | Throwable raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "error.code.notAllowed",
  "message": "error.account.notSundryCreditorDebtor"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/vouchers/bill-to-bill/export-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/v3/export-ledger/file?from=:from&to=:to&type=:type&format=:format&sort=:sort`

- **Frontend id:** `LEDGER_API.EXPORT_LEDGER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#ExportLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImportExportController#exportLedgerDownloadFileV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImportExportController.java:82`
- **Deprecated:** No

Export Ledger Download File V3

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `withInvoice` — type: `boolean`; optional; default: `false`
- `type` — type: `String`; optional; default: `view-detailed`
- `format` — type: `String`; optional; default: `excel`
- `sort` — type: `String`; optional; default: `asc`
- `fileType` — type: `String`; optional; default: `base64`
- `branchUniqueName` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`

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
- Body evidence: `apiResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "apiResponse"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/v3/export-ledger/file?from=01-04-2025&to=31-03-2026&withInvoice=false&type=view-detailed&format=excel&sort=asc&fileType=base64&branchUniqueName=aaaa&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/columnar-report?from=:from&to=:to`

- **Frontend id:** `LEDGER_API.EXPORT_LEDGER_COLUMNAR_REPORT_TABLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#exportLedgerColumnarReportTable`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImportExportController#columnarReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImportExportController.java:267`
- **Deprecated:** No

This function is used to get columnar report.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `asc`
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `branchUniqueName` — type: `String`; optional

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/columnar-report?from=01-04-2025&to=31-03-2026&sort=asc&page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/v2/export-ledger-with-invoice/file?from=:from&to=:to&type=:type&format=:format&sort=:sort`

- **Frontend id:** `LEDGER_API.EXPORT_LEDGER_WITH_INVOICE_NUMBER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#ExportLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImportExportController#exportLedgerAndInvoiceDownloadFile
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImportExportController.java:125`
- **Deprecated:** No

Export Ledger And Invoice Download File

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `view-detailed`
- `format` — type: `String`; optional; default: `xlsx`
- `sort` — type: `String`; optional; default: `asc`
- `fileType` — type: `String`; optional; default: `base64`
- `branchUniqueName` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`

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
- Body evidence: `apiResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "apiResponse"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/v2/export-ledger-with-invoice/file?from=01-04-2025&to=31-03-2026&type=view-detailed&format=xlsx&sort=asc&fileType=base64&branchUniqueName=aaaa&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/ledgers/transactions?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to`

- **Frontend id:** `LEDGER_API.GET`
- **Frontend evidence:** `ledger.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: LedgerController#retrieveAllLedgerTransactions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerController.java:422`
- **Deprecated:** No

the pagination requirements are specific to Giddh and may work

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `q` — type: `String`; optional; default: ``
- `sort` — type: `String`; optional; default: `desc`
- `branchUniqueName` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`

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
- Body evidence: `paginatedEntryTransactions`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedEntryTransactions"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/transactions?from=01-04-2025&to=31-03-2026&page=1&count=0&q=&sort=desc&branchUniqueName=aaaa&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `POST /v2/company/:companyUniqueName/accounts/:accountUniqueName/balance?q=:q&from=:from&to=:to&accountCurrency=:accountCurrency`

- **Frontend id:** `LEDGER_API.GET_BALANCE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#getLedgerBalance`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#calculateClosingBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:162`
- **Deprecated:** No

Calculate Closing Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `q` — type: `String`; optional; default: ``
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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/balance?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&q=&accountCurrency=true&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `GET /v2/company/:companyUniqueName/accounts/:accountUniqueName/balance?q=:q&from=:from&to=:to&accountCurrency=:accountCurrency`

- **Frontend id:** `LEDGER_API.GET_BALANCE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#getLedgerBalance`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountV2Controller#calculateClosingBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountV2Controller.java:162`
- **Deprecated:** No

Calculate Closing Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `q` — type: `String`; optional; default: ``
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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/balance?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&q=&accountCurrency=true&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"groupUniqueNames":[],"accountUniqueNames":[],"salesPersonUniqueNames":[],"includeSalesPersons":false,"includeAmount":false,"amount":0,"amountGreaterThan":false,"amountLessThan":false,"amountEqualTo":false,"includeDescription":false,"description":"string","vouchers":[],"includeVouchers":false,"includeParticulars":false,"particulars":[],"isInvoiceGenerated":false,"includeTag":false,"tags":[],"chequeNumber":"string","dateOnCheque":"string","inventory":"string","cancelledEntries":false,"balanceTypeAsSign":false,"chequeDate":"01-04-2025","selectAllFields":[]}'
```

---

### `GET /company/:companyUniqueName/yodlee/accounts/:accountUniqueName/eledgers?refresh=true&from=:from&page=:page&count=:count`

- **Frontend id:** `LEDGER_API.GET_BANK_TRANSACTIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetBankTransactionsForLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: YodleeControllerV2#getTransactions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/YodleeControllerV2.java:53`
- **Deprecated:** No

Get Transactions

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `bankTransactions`

```json
{
  "status": "success",
  "body": {
    "reference": "bankTransactions"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/yodlee/accounts/SAMPLE_ACCOUNT/eledgers?page=1&count=50&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/groups/:groupUniqueName/export/account-balances-v2`

- **Frontend id:** `LEDGER_API.GET_COLUMNAR_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#downloadColumnarReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#exportAccountBalancesByGroupWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:304`
- **Deprecated:** No

Export Account Balances By Group With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `fileType` — type: `String`; optional; default: `base64`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `LedgerColumnarAccountBalanceRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `showHideOpeningClosingBalance` | `boolean` | not declared | unconstrained |
| `balanceTypeAsSign` | `boolean` | not declared | unconstrained |
| `monthYear` | `List<String>` | not declared | unconstrained |
| `financialYear` | `String` | not declared | unconstrained |

Example:

```json
{
  "showHideOpeningClosingBalance": false,
  "balanceTypeAsSign": false,
  "monthYear": [],
  "financialYear": "string"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/export/account-balances-v2?fileType=base64&page=1&count=50&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"showHideOpeningClosingBalance":false,"balanceTypeAsSign":false,"monthYear":[],"financialYear":"string"}'
```

---

### `GET /currency/rate?from=:from&to=:to&date=:date`

- **Frontend id:** `LEDGER_API.GET_CURRENCY_RATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetCurrencyRateNewApi`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: MainController#getCurrencyRates
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:242`
- **Deprecated:** No

API : This API will give conversion rate of a currency to other

#### Inputs

**Query parameters**
- `from` — type: `String`; required
- `to` — type: `String`; required
- `date` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `rate`

```json
{
  "status": "success",
  "body": {
    "reference": "rate"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/currency/rate?from=01-04-2025&to=31-03-2026&date=SAMPLE_date' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/imports/signed-url?fileName=:fileName`

- **Frontend id:** `LEDGER_API.GET_DOWNLOAD_ATTACHMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#getSignedUrl`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportController#generatePreSignedURL
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:140`
- **Deprecated:** No

confirmation is received.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `fileName` — type: `String`; required

#### Controller-backed request payload

None.

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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/signed-url?fileName=SAMPLE_fileName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /magic-link/:id`

- **Frontend id:** `LEDGER_API.GET_MAGIC_LINK_DATA`
- **Frontend evidence:** `ledger.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: MagicLinkController#getLedgers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MagicLinkController.java:51`
- **Deprecated:** **Yes**

<p> Use {@link MagicLinkController getLedgersV2(String, String, String, int, int, String, String, boolean, HttpServletRequest)}

#### Inputs

**Path parameters**
- `magicLink` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `accountCurrency` — type: `boolean`; optional; default: `true`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `ledgerService.getTransactionsForMagicLink(entrySearchHelper, magicLink`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/magic-link/SAMPLE_magicLink?from=01-04-2025&to=31-03-2026&sort=desc&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /magic-link/:id?from=:from&to=:to`

- **Frontend id:** `LEDGER_API.GET_MAGIC_LINK_DATA_WITH_DATE`
- **Frontend evidence:** `ledger.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: MagicLinkController#getLedgers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MagicLinkController.java:51`
- **Deprecated:** **Yes**

<p> Use {@link MagicLinkController getLedgersV2(String, String, String, int, int, String, String, boolean, HttpServletRequest)}

#### Inputs

**Path parameters**
- `magicLink` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `accountCurrency` — type: `boolean`; optional; default: `true`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `ledgerService.getTransactionsForMagicLink(entrySearchHelper, magicLink`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/magic-link/SAMPLE_magicLink?from=01-04-2025&to=31-03-2026&sort=desc&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock/:stockUniqueName/variants`

- **Frontend id:** `LEDGER_API.GET_STOCK_VARIANTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#loadStockVariants`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#getStockVariants
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:288`
- **Deprecated:** No

Get Stock Variants

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `variants`

```json
{
  "status": "success",
  "body": {
    "reference": "variants"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/variants?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName?baseRef=true`

- **Frontend id:** `LEDGER_API.GET_TRANSACTION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetLedgerTransactionDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerController#getLedger; accounting-microservice: LedgerController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerController.java:106`
- **Deprecated:** No

Get Ledger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `ledgerUniqueName` — type: `String`; required
**Query parameters**
- `baseRef` — type: `String`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `entry`

```json
{
  "status": "success",
  "body": {
    "reference": "entry"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/SAMPLE_LEDGER?baseRef=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/invoices/list?accountUniqueName=:accountUniqueName&status=:accStatus`

- **Frontend id:** `LEDGER_API.GET_UNPAID_INVOICE_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetInvoiceList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InvoiceV2Controller#getAllInvoicesWithInvoiceNumber
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InvoiceV2Controller.java:263`
- **Deprecated:** No

Get All Invoices With Invoice Number

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; optional
- `status` — type: `String`; required; default: `unpaid`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `invoiceService.getAllInvoicesOfCompany(accountUniqueName, company, status`

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
- `body as IUnpaidInvoiceListResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/invoices/list?accountUniqueName=SAMPLE_ACCOUNT&status=unpaid&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&count=:count&page=:page&number=:number`

- **Frontend id:** `LEDGER_API.GET_VOUCHER_INVOICE_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#getInvoiceListsForCreditNote`
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

### `POST /company/:companyUniqueName/imports/import-pdf/bank-statement?entity=pdf&accountUniqueName=:accountUniqueName`

- **Frontend id:** `LEDGER_API.IMPORT_STATEMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#importStatement`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportController#importpdf
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:192`
- **Deprecated:** No

Importpdf

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `entity` — type: `String`; optional
- `accountUniqueName` — type: `String`; required
- `pdfpassword` — type: `String`; required
- `lang` — type: `String`; optional; default: `en`
**Multipart parts**
- `file` — type: `MultipartFile`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `apiResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "apiResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PASSWORD` | `InvalidPasswordException` | InvalidPasswordException raised by controller or shared ExceptionHandler |
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
  "code": "INVALID_PASSWORD",
  "message": "Invalid Password"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/import-pdf/bank-statement?entity=SAMPLE_entity&accountUniqueName=SAMPLE_ACCOUNT&pdfpassword=SAMPLE_pdfpassword&lang=en&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `POST /company/:companyUniqueName/imports/v2/upload?subType=:subType&accountUniqueName=:accountUniqueName&type=:type&isHeaderProvided=:isHeaderProvided&voucherType=:voucherType`

- **Frontend id:** `LEDGER_API.IMPORT_VOUCHER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#importVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportController#getConfirmationOnUploadThroughSignedURL
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:171`
- **Deprecated:** No

Get Confirmation On Upload Through Signed URL

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional; default: ``
- `type` — type: `ImportType`; required; allowed: `TALLY_MASTERS`, `TALLY_ENTRIES`, `MASTER_IMPORT`, `ENTRIES_IMPORT`, `INVENTORY_IMPORT`, `BANK_TRANSACTIONS_IMPORT`, `CONVERT_FILE`, `ACCOUNT_WISE_VOUCHER_IMPORT`, `VOUCHER_WISE_VOUCHER_IMPORT`, `DOCUMENT_IMPORT`, `MAIL_BANK_TRANSACTIONS_IMPORT`
- `isHeaderProvided` — type: `boolean`; optional; default: `true`
- `voucherType` — type: `String`; optional
- `accountUniqueName` — type: `String`; optional
- `sameDebitCreditAmountColumn` — type: `boolean`; optional

#### Controller-backed request payload

Type: `SignedUrlModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `requestId` | `String` | not declared | unconstrained |
| `signedUrl` | `String` | not declared | unconstrained |
| `filePath` | `String` | not declared | unconstrained |

Example:

```json
{
  "requestId": "string",
  "signedUrl": "string",
  "filePath": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `importRequest`

```json
{
  "status": "success",
  "body": {
    "reference": "importRequest"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `CSV_VALIDATION` | `CsvValidationException` | CsvValidationException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": "CSV_VALIDATION",
  "message": "Csv Validation"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/v2/upload?branchUniqueName=&type=TALLY_MASTERS&isHeaderProvided=true&voucherType=SAMPLE_voucherType&accountUniqueName=SAMPLE_ACCOUNT&sameDebitCreditAmountColumn=SAMPLE_sameDebitCreditAmountColumn' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"requestId":"string","signedUrl":"string","filePath":"string"}'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to`

- **Frontend id:** `LEDGER_API.MAGIC_LINK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GenerateMagicLink`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AccountController#generateMagicLink
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AccountController.java:253`
- **Deprecated:** No

Generate Magic Link

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; required
- `to` — type: `String`; required
- `expiry` — type: `String`; optional; default: `1`
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `accountService.generateMagicLink(principal, account, from, to, request, expiryInt, branch`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/magic-link?from=01-04-2025&to=31-03-2026&expiry=1&branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /magic-link/:id/download-invoice/:invoiceNum`

- **Frontend id:** `LEDGER_API.MAGIC_LINK_DOWNLOAD_FILE`
- **Frontend evidence:** `ledger.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: MagicLinkController#downloadInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MagicLinkController.java:126`
- **Deprecated:** No

Download Invoice

#### Inputs

**Path parameters**
- `magicLink` — type: `String`; required
- `invoiceNumber` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `base64Resp`

```json
{
  "status": "success",
  "body": {
    "reference": "base64Resp"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/magic-link/SAMPLE_magicLink/download-invoice/SAMPLE_invoiceNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/mail-ledger?`

- **Frontend id:** `LEDGER_API.MAIL_LEDGER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#MailLedger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImportExportController#mailLedgerAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImportExportController.java:207`
- **Deprecated:** No

Mail Ledger All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `withInvoice` — type: `boolean`; optional; default: `false`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `view-detailed`
- `format` — type: `String`; optional; default: `excel`
- `sort` — type: `String`; optional; default: `asc`
- `branchUniqueName` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`

#### Controller-backed request payload

Type: `SendToOrCc` (required).

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/mail-ledger?withInvoice=false&from=01-04-2025&to=31-03-2026&type=view-detailed&format=excel&sort=asc&branchUniqueName=aaaa&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/accounts/:accountUniqueName/entries`

- **Frontend id:** `LEDGER_API.MULTIPLE_DELETE`
- **Frontend evidence:** `ledger.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: EntryV1Controller#deleteMultipleEntries; accounting-microservice: LedgerController#deleteMultiple
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/EntryV1Controller.java:78`
- **Deprecated:** No

Delete Multiple Entries

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `MultipleLedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountUniqueName` | `String` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `transactionIds` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "accountUniqueName": "string",
  "entryUniqueNames": [],
  "transactionIds": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `entryV1Service.deleteMultipleEntries(company, principal, requestedLedger, request, Boolean.FALSE,branchUniqueName`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/entries?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountUniqueName":"string","entryUniqueNames":[],"transactionIds":[]}'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/giddh-ledger?count=:count&from=:from&page=:page&q=:q&reversePage=:reversePage&sort=:sort&to=:to&accountCurrency=:accountCurrency`

- **Frontend id:** `LEDGER_API.NEW_GET_LEDGER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetLedgerTransactions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EntryController#getGiddhLedger
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/EntryController.java:54`
- **Deprecated:** No

Get Giddh Ledger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `count` — type: `int`; optional; default: `50`
- `sort` — type: `String`; optional; default: `desc`
- `q` — type: `String`; optional; default: ``
- `isTView` — type: `Boolean`; optional
- `branchUniqueName` — type: `String`; optional
- `accountCurrency` — type: `boolean`; optional; default: `true`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedGiddhLedger`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedGiddhLedger"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/giddh-ledger?from=01-04-2025&to=31-03-2026&count=50&sort=desc&q=&isTView=SAMPLE_isTView&branchUniqueName=aaaa&accountCurrency=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile?from=:from&to=:to&chequeNumber=:chequeNumber`

- **Frontend id:** `LEDGER_API.RECONCILE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetReconcile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerControllerV2#retrieveAllPendingTransactions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerControllerV2.java:109`
- **Deprecated:** No

Retrieve All Pending Transactions

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `String`; optional; default: `1`
- `count` — type: `String`; optional; default: `0`
- `q` — type: `String`; optional; default: ``
- `sort` — type: `String`; optional; default: `desc`

#### Controller-backed request payload

Type: `ReconcileLedger` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedEntryTransactions`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedEntryTransactions"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/reconcile?page=1&count=0&q=&sort=desc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/reconcile`

- **Frontend id:** `LEDGER_API.RECONCILIATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#GetReconciliation`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerControllerV2#retrieveAllPendingTransactions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerControllerV2.java:109`
- **Deprecated:** No

Retrieve All Pending Transactions

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `String`; optional; default: `1`
- `count` — type: `String`; optional; default: `0`
- `q` — type: `String`; optional; default: ``
- `sort` — type: `String`; optional; default: `desc`

#### Controller-backed request payload

Type: `ReconcileLedger` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedEntryTransactions`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedEntryTransactions"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers-v2/reconcile?page=1&count=0&q=&sort=desc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/autopaid`

- **Frontend id:** `LEDGER_API.RUN_AUTOPAID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#runAutopaid`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: AutoPaidController#autoAdjustVouchers
- **Backend source:** `src/main/java/com/giddh/api/controllers/AutoPaidController.java:47`
- **Deprecated:** No

Auto Adjust Vouchers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/autopaid?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/accounts/:accountUniqueName/ledgers/:entryUniqueName`

- **Frontend id:** `LEDGER_API.UNIVERSAL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ledger.service.ts#UpdateLedgerTransactions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LedgerController#updateLedger; accounting-microservice: LedgerController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LedgerController.java:144`
- **Deprecated:** No

API to update Ledger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
- `ledgerUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `newAccountUniqueName` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `LedgerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `description` | `String` | not declared | unconstrained |
| `tag` | `String` | not declared | unconstrained |
| `entryDate` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `referenceId` | `String` | not declared | unconstrained |
| `unconfirmedEntry` | `Boolean` | not declared | unconstrained |
| `applyApplicableTaxes` | `Boolean` | not declared | unconstrained |
| `applyApplicableDiscount` | `Boolean` | not declared | unconstrained |
| `isInclusiveTax` | `Boolean` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `specialTaxes` | `Set<String>` | not declared | unconstrained |
| `entry` | `Entry` | not declared | unconstrained |
| `isRecurring` | `Boolean` | not declared | unconstrained |
| `isSubscription` | `Boolean` | not declared | unconstrained |
| `chequeNumber` | `String` | not declared | unconstrained |
| `chequeClearanceDate` | `String` | not declared | unconstrained |
| `isV2Invoice` | `Boolean` | not declared | unconstrained |
| `sendToGstr2` | `Boolean` | not declared | unconstrained |
| `linkedInvoices` | `Set<String>` | not declared | unconstrained |
| `invoicesToBePaid` | `Set<String>` | not declared | unconstrained |
| `invoiceNumberAgainstVoucher` | `String` | not declared | unconstrained |
| `proratedDate` | `String` | not declared | unconstrained |
| `recurringFrom` | `String` | not declared | unconstrained |
| `attachedFile` | `String` | not declared | unconstrained |
| `tags` | `Set<String>` | not declared | unconstrained |
| `tagNames` | `List<String>` | not declared | unconstrained |
| `transactions` | `List<TransactionInput>` | not declared | unconstrained |
| `entryTotalForAccount` | `BigDecimal` | not declared | unconstrained |
| `entryTotalForCompany` | `BigDecimal` | not declared | unconstrained |
| `exchangeRate` | `BigDecimal` | not declared | unconstrained |
| `valuesInAccountCurrency` | `Boolean` | not declared | unconstrained |
| `ledgerDate` | `LocalDate` | not declared | unconstrained |
| `transactionId` | `String` | not declared | unconstrained |
| `generateInvoice` | `Boolean` | not declared | unconstrained |
| `invoiceAction` | `EntryInvoiceAction` | not declared | unconstrained |
| `discounts` | `Set<TransactionInput>` | not declared | unconstrained |
| `baseAccountName` | `String` | not declared | unconstrained |
| `rowNoForImport` | `int` | not declared | unconstrained |
| `errorMessage` | `String` | not declared | unconstrained |
| `applyApplicableDiscounts` | `Boolean` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `comingFromGenerateVoucher` | `Boolean` | not declared | unconstrained |
| `touristSchemeApplicable` | `boolean` | not declared | unconstrained |
| `passportNumber` | `String` | not declared | unconstrained |
| `tcsCalculationMethod` | `TcsCalculationMethod` | not declared | unconstrained |
| `purchaseInvoiceNumber` | `String` | not declared | unconstrained |
| `reverseChargeTaxableAmount` | `BigDecimal` | not declared | unconstrained |
| `roundOffApplicable` | `boolean` | not declared | unconstrained |
| `invoiceRequest` | `GenerateInvoiceRequest` | not declared | unconstrained |
| `itcAvailable` | `ITCAvailableType` | not declared | IMPORT_OF_GOODS, IMPORT_OF_SERVICES, ALL_OTHER_ITC |
| `subVoucher` | `SubVoucher` | not declared | unconstrained |
| `invoiceLinkingRequest` | `InvoiceLinkingRequest` | not declared | unconstrained |
| `voucherAdjustments` | `VoucherAdjustmentsForInvoice` | not declared | unconstrained |
| `entryUniqueNames` | `Set<String>` | not declared | unconstrained |
| `giddhImportRefId` | `String` | not declared | unconstrained |
| `branch` | `BranchResource` | not declared | unconstrained |

Example:

```json
{
  "description": "string",
  "tag": "string",
  "entryDate": "string",
  "voucherType": "string",
  "referenceId": "string",
  "unconfirmedEntry": false,
  "applyApplicableTaxes": false,
  "applyApplicableDiscount": false,
  "isInclusiveTax": false,
  "taxes": [],
  "specialTaxes": [],
  "entry": "string",
  "isRecurring": false,
  "isSubscription": false,
  "chequeNumber": "string",
  "chequeClearanceDate": "string",
  "isV2Invoice": false,
  "sendToGstr2": false,
  "linkedInvoices": [],
  "invoicesToBePaid": [],
  "invoiceNumberAgainstVoucher": "string",
  "proratedDate": "string",
  "recurringFrom": "string",
  "attachedFile": "string",
  "tags": [],
  "tagNames": [],
  "transactions": [],
  "entryTotalForAccount": 0,
  "entryTotalForCompany": 0,
  "exchangeRate": 0,
  "valuesInAccountCurrency": false,
  "ledgerDate": "01-04-2025",
  "transactionId": "string",
  "generateInvoice": false,
  "invoiceAction": "string",
  "discounts": [],
  "baseAccountName": "string",
  "rowNoForImport": 0,
  "errorMessage": "string",
  "applyApplicableDiscounts": false,
  "uniqueName": "string",
  "comingFromGenerateVoucher": false,
  "touristSchemeApplicable": false,
  "passportNumber": "string",
  "tcsCalculationMethod": "string",
  "purchaseInvoiceNumber": "string",
  "reverseChargeTaxableAmount": 0,
  "roundOffApplicable": false,
  "invoiceRequest": "string",
  "itcAvailable": "IMPORT_OF_GOODS",
  "subVoucher": "string",
  "invoiceLinkingRequest": "string",
  "voucherAdjustments": "string",
  "entryUniqueNames": [],
  "giddhImportRefId": "string",
  "branch": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `updatedEntry`

```json
{
  "status": "success",
  "body": {
    "reference": "updatedEntry"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `error.code.invalid.operationType` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/ledgers/SAMPLE_LEDGER?branchUniqueName=aaaa&newAccountUniqueName=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"description":"string","tag":"string","entryDate":"string","voucherType":"string","referenceId":"string","unconfirmedEntry":false,"applyApplicableTaxes":false,"applyApplicableDiscount":false,"isInclusiveTax":false,"taxes":[],"specialTaxes":[],"entry":"string","isRecurring":false,"isSubscription":false,"chequeNumber":"string","chequeClearanceDate":"string","isV2Invoice":false,"sendToGstr2":false,"linkedInvoices":[],"invoicesToBePaid":[],"invoiceNumberAgainstVoucher":"string","proratedDate":"string","recurringFrom":"string","attachedFile":"string","tags":[],"tagNames":[],"transactions":[],"entryTotalForAccount":0,"entryTotalForCompany":0,"exchangeRate":0,"valuesInAccountCurrency":false,"ledgerDate":"01-04-2025","transactionId":"string","generateInvoice":false,"invoiceAction":"string","discounts":[],"baseAccountName":"string","rowNoForImport":0,"errorMessage":"string","applyApplicableDiscounts":false,"uniqueName":"string","comingFromGenerateVoucher":false,"touristSchemeApplicable":false,"passportNumber":"string","tcsCalculationMethod":"string","purchaseInvoiceNumber":"string","reverseChargeTaxableAmount":0,"roundOffApplicable":false,"invoiceRequest":"string","itcAvailable":"IMPORT_OF_GOODS","subVoucher":"string","invoiceLinkingRequest":"string","voucherAdjustments":"string","entryUniqueNames":[],"giddhImportRefId":"string","branch":"string"}'
```

