# Backend-Verified Frontend APIs: 12-imports-sync-ocr.md

Only exact HTTP method + normalized controller-path matches are included.

### `GET /company/:companyUniqueName/completed-document-count?voucherVersion=2&branchUniqueName=:branchUniqueName&ocrType=:ocrType`

- **Frontend id:** `AI_OCR_API.COMPLETED_COUNT`
- **Frontend evidence:** `ai-ocr.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** accounting-microservice: VoucherController#getCompletedDocument
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:675`
- **Deprecated:** No

Get Completed Document

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `ocrType` — type: `String`; required

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/completed-document-count?branchUniqueName=aaaa&ocrType=SAMPLE_ocrType' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/ocr-data?currentToken=:currentToken&nextToken=:nextToken&voucherVersion=2&voucherType=:voucherType&requestId=:requestId&ocrType=:ocrType`

- **Frontend id:** `AI_OCR_API.EXTRACT_DOCUMENTS`
- **Frontend evidence:** `ai-ocr.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** accounting-microservice: VoucherController#getOcrUploadedData
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:659`
- **Deprecated:** No

Get Ocr Uploaded Data

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

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ocr-data?branchUniqueName=aaaa&requestId=&voucherType=&nextToken=&currentToken=&ocrType=income' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/imports/document/upload?type=DOCUMENT_IMPORT&branchUniqueName=:branchUniqueName&ocrType=:ocrType`

- **Frontend id:** `AI_OCR_API.IMPORT`
- **Frontend evidence:** `ai-ocr.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** import-microservice: ImportController#uploadDocument
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:211`
- **Deprecated:** No

Upload Document

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `type` — type: `ImportType`; required; allowed: `TALLY_MASTERS`, `TALLY_ENTRIES`, `MASTER_IMPORT`, `ENTRIES_IMPORT`, `INVENTORY_IMPORT`, `BANK_TRANSACTIONS_IMPORT`, `CONVERT_FILE`, `ACCOUNT_WISE_VOUCHER_IMPORT`, `VOUCHER_WISE_VOUCHER_IMPORT`, `DOCUMENT_IMPORT`, `MAIL_BANK_TRANSACTIONS_IMPORT`
- `ocrType` — type: `String`; required

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/document/upload?branchUniqueName=aaaa&type=TALLY_MASTERS&ocrType=SAMPLE_ocrType' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"requestId":"string","signedUrl":"string","filePath":"string"}'
```

---

### `POST /company/:companyUniqueName/ecommerce/email`

- **Frontend id:** `ECOMMERCE_API.SEND_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ecommerce.service.ts#sendEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EcommerceController#sendEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/EcommerceController.java:119`
- **Deprecated:** No

*

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `EmailRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `email` | `String` | not declared | unconstrained |
| `verificationCode` | `String` | not declared | unconstrained |
| `retryCount` | `int` | not declared | unconstrained |

Example:

```json
{
  "email": "string",
  "verificationCode": "string",
  "retryCount": 0
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ecommerce/email?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","verificationCode":"string","retryCount":0}'
```

---

### `POST /company/:companyUniqueName/ecommerce/verify/:ecommerceUniqueName`

- **Frontend id:** `ECOMMERCE_API.SHOPIFY_VERIFY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/ecommerce.service.ts#isShopifyConnected`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EcommerceController#verifyEcommerceAccountStatus
- **Backend source:** `src/main/java/com/giddh/api/controllers/EcommerceController.java:79`
- **Deprecated:** No

This function is used register ecommerce user.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `ecommerceUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `ZencommerceUserLoginRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `authKey` | `String` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |
| `password` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `domain` | `String` | not declared | unconstrained |

Example:

```json
{
  "authKey": "string",
  "email": "string",
  "password": "string",
  "source": "string",
  "domain": "string"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ecommerce/verify/SAMPLE_ecommerceUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"authKey":"string","email":"string","password":"string","source":"string","domain":"string"}'
```

---

### `POST /company/:companyUniqueName/imports/process?entity=:entity&isHeaderProvided=:isHeaderProvided`

- **Frontend id:** `IMPORT_EXCEL_API.PROCESS_IMPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/import-excel.service.ts#processImport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportController#processDataV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:100`
- **Deprecated:** No

Process Data V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `FileImportRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `mappings` | `List<ImportMappings>` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "mappings": [],
  "requestId": "string"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/process?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"mappings":[],"requestId":"string"}'
```

---

### `POST /company/:companyUniqueName/imports/upload?type=:entity`

- **Frontend id:** `IMPORT_EXCEL_API.UPLOAD_FILE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/import-excel.service.ts#uploadFile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportController#createImportRequest
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:81`
- **Deprecated:** No

Create Import Request

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `type` — type: `ImportType`; required; allowed: `TALLY_MASTERS`, `TALLY_ENTRIES`, `MASTER_IMPORT`, `ENTRIES_IMPORT`, `INVENTORY_IMPORT`, `BANK_TRANSACTIONS_IMPORT`, `CONVERT_FILE`, `ACCOUNT_WISE_VOUCHER_IMPORT`, `VOUCHER_WISE_VOUCHER_IMPORT`, `DOCUMENT_IMPORT`, `MAIL_BANK_TRANSACTIONS_IMPORT`
- `isHeaderProvided` — type: `boolean`; optional; default: `true`
- `accountUniqueName` — type: `String`; optional
- `sameDebitCreditAmountColumn` — type: `boolean`; optional
**Multipart parts**
- `file` — type: `MultipartFile`; required

#### Controller-backed request payload

None.

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/upload?branchUniqueName=aaaa&type=TALLY_MASTERS&isHeaderProvided=true&accountUniqueName=SAMPLE_ACCOUNT&sameDebitCreditAmountColumn=SAMPLE_sameDebitCreditAmountColumn' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `GET /company/:companyUniqueName/download-import-logs?requestId=:requestId&status=:status`

- **Frontend id:** `IMPORTS_API.DOWNLOAD_SHEET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/imports.service.ts#downloadImportsSheet`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportLogController#downloadImportLogs
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportLogController.java:40`
- **Deprecated:** No

Download Import Logs

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `requestId` — type: `String`; required
- `status` — type: `ImportLogStatus`; optional; allowed: `SUCCESS`, `FAILED`
- `output` — type: `String`; optional; default: `base64`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/download-import-logs?requestId=SAMPLE_requestId&status=SUCCESS&output=base64&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/imports?from=:from&to=:to&page=:page&count=:count`

- **Frontend id:** `IMPORTS_API.IMPORTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/imports.service.ts#getImports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** import-microservice: ImportController#viewImportRequests
- **Backend source:** `src/main/java/com/giddh/api/controllers/ImportController.java:64`
- **Deprecated:** No

View Import Requests

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
- Body evidence: `imports`

```json
{
  "status": "success",
  "body": {
    "reference": "imports"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

