# Import Microservice Controller API

Generated from production Spring controllers in `/Users/divyanshu/Downloads/giddha-giddh-import-microservice-eb3f6ae25db5`. Values are finite only when supported by controller annotations, Java enums, DTO constraints, or explicit validation evidence; otherwise they are marked unconstrained.

| Metric | Count |
|---|---:|
| Controllers | 6 |
| Handler methods | 19 |
| Expanded routes | 20 |
| Deprecated routes | 0 |

### `GET /`

Ok

- **Controller:** `MainController#ok`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:29`
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

### `GET /company/{companyUniqueName}/download-import-logs`

Download Import Logs

- **Controller:** `ImportLogController#downloadImportLogs`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportLogController.java:40`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `requestId` — type: `String`; required
- `status` — type: `ImportLogStatus`; optional; allowed: `SUCCESS`, `FAILED`
- `output` — type: `String`; optional; default: `base64`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/download-import-logs?requestId=SAMPLE_requestId&status=SUCCESS&output=base64&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/imports`

View Import Requests

- **Controller:** `ImportController#viewImportRequests`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:64`
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
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/imports/all-document`

View Document Import Requests

- **Controller:** `ImportController#viewDocumentImportRequests`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:229`
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
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sort` — type: `String`; optional; default: `desc`

#### Request payload

Type: `DocumentUploadFilter` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fileName` | `String` | not declared | unconstrained |
| `uploadedBy` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `sortDirection` | `String` | not declared | unconstrained |
| `convertedStatus` | `String` | not declared | unconstrained |

Example:

```json
{
  "fileName": "string",
  "uploadedBy": "string",
  "status": "string",
  "sortDirection": "string",
  "convertedStatus": "string"
}
```

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/all-document?branchUniqueName=aaaa&ocrType=SAMPLE_ocrType&from=01-04-2025&to=31-03-2026&page=1&count=20&sort=desc' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fileName":"string","uploadedBy":"string","status":"string","sortDirection":"string","convertedStatus":"string"}'
```

---

### `ANY /company/{companyUniqueName}/imports/delete-documents`

Delete Selected Document Requests

- **Controller:** `ImportController#deleteSelectedDocumentRequests`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:251`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication) (mapping does not restrict the HTTP method)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

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
- Body evidence: `"Documents deleted successfully."`

```json
{
  "status": "success",
  "body": "Documents deleted successfully."
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/delete-documents?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `POST /company/{companyUniqueName}/imports/document/upload`

Upload Document

- **Controller:** `ImportController#uploadDocument`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:211`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `type` — type: `ImportType`; required; allowed: `TALLY_MASTERS`, `TALLY_ENTRIES`, `MASTER_IMPORT`, `ENTRIES_IMPORT`, `INVENTORY_IMPORT`, `BANK_TRANSACTIONS_IMPORT`, `CONVERT_FILE`, `ACCOUNT_WISE_VOUCHER_IMPORT`, `VOUCHER_WISE_VOUCHER_IMPORT`, `DOCUMENT_IMPORT`, `MAIL_BANK_TRANSACTIONS_IMPORT`
- `ocrType` — type: `String`; required

#### Request payload

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

### `POST /company/{companyUniqueName}/imports/import-pdf/bank-statement`

Importpdf

- **Controller:** `ImportController#importpdf`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:192`
- **Deprecated:** No
- **Consumes:** `("content-type=multipart/*")`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/import-pdf/bank-statement?entity=SAMPLE_entity&accountUniqueName=SAMPLE_ACCOUNT&pdfpassword=SAMPLE_pdfpassword&lang=en&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `POST /company/{companyUniqueName}/imports/process`

Process Data V2

- **Controller:** `ImportController#processDataV2`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:100`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Request payload

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

### `GET /company/{companyUniqueName}/imports/reconciliation`

Process a previously uploaded Excel/CSV reconciliation file with user-provided column mappings.

- **Controller:** `ReconciliationController#list`
- **Source:** `src/main/java/com/giddh/api/controllers/ReconciliationController.java:107`
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
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/imports/reconciliation/process`

Process a previously uploaded Excel/CSV reconciliation file with user-provided column mappings.

- **Controller:** `ReconciliationController#process`
- **Source:** `src/main/java/com/giddh/api/controllers/ReconciliationController.java:91`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; optional

#### Request payload

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

### `POST /company/{companyUniqueName}/imports/reconciliation/upload`

Upload a bank statement file (PDF or Excel/CSV) to initiate reconciliation.

- **Controller:** `ReconciliationController#upload`
- **Source:** `src/main/java/com/giddh/api/controllers/ReconciliationController.java:66`
- **Deprecated:** No
- **Consumes:** `"content-type=multipart/*"`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/reconciliation/upload?branchUniqueName=aaaa&accountUniqueName=SAMPLE_ACCOUNT&from=01-04-2025&to=31-03-2026&password=SAMPLE_password&lang=en&sameDebitCreditColumn=SAMPLE_sameDebitCreditColumn' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `GET /company/{companyUniqueName}/imports/signed-url`

confirmation is received.

- **Controller:** `ImportController#generatePreSignedURL`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:140`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `fileName` — type: `String`; required

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/signed-url?fileName=SAMPLE_fileName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/imports/tally-import`

Tally Import

- **Controller:** `ImportController#tallyImport`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:111`
- **Deprecated:** No
- **Consumes:** `{ MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_XML_VALUE, MediaType.TEXT_PLAIN_VALUE, MediaType.APPLICATION_JSON_VALUE }`
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional; default: ``

#### Request payload

Type: `String` (required).

No finite field/value contract is declared by the controller.

Example:

```json
"string"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/tally-import?branchUniqueName=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /company/{companyUniqueName}/imports/upload`

Create Import Request

- **Controller:** `ImportController#createImportRequest`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:81`
- **Deprecated:** No
- **Consumes:** `("content-type=multipart/*")`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/imports/upload?branchUniqueName=aaaa&type=TALLY_MASTERS&isHeaderProvided=true&accountUniqueName=SAMPLE_ACCOUNT&sameDebitCreditAmountColumn=SAMPLE_sameDebitCreditAmountColumn' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `POST /company/{companyUniqueName}/imports/v2/upload`

Get Confirmation On Upload Through Signed URL

- **Controller:** `ImportController#getConfirmationOnUploadThroughSignedURL`
- **Source:** `src/main/java/com/giddh/api/controllers/ImportController.java:171`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

### `POST /company/{companyUniqueName}/ledger/upload`

Upload File For Ledger

- **Controller:** `AttachmentController#uploadFileForLedger`
- **Source:** `src/main/java/com/giddh/api/controllers/AttachmentController.java:65`
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
- `type` — type: `String`; optional; default: `ledger`
**Multipart parts**
- `file` — type: `MultipartFile`; optional

#### Request payload

None.

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
| 400 | `error.code.invalidRequest` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": "error.code.invalidRequest",
  "message": "error.file.empty"
}
```

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload?branchUniqueName=aaaa&entries=SAMPLE_entries&type=ledger' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `GET /env`

Get Env

- **Controller:** `MainController#getEnv`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:39`
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

### `GET /import-scheduled/import-bank-statements`

Import Bank Statements

- **Controller:** `ScheduledTasksController#importBankStatements`
- **Source:** `src/main/java/com/giddh/api/controllers/ScheduledTasksController.java:21`
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
  --url 'https://api.giddh.com/import-scheduled/import-bank-statements' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /logo/upload`

Upload File For Ledger

- **Controller:** `AttachmentController#uploadFileForLedger`
- **Source:** `src/main/java/com/giddh/api/controllers/AttachmentController.java:87`
- **Deprecated:** No
- **Consumes:** `("content-type=multipart/*")`
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Query parameters**
- `domainName` — type: `String`; required
**Multipart parts**
- `file` — type: `MultipartFile`; required

#### Request payload

None.

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
  --url 'https://api.giddh.com/logo/upload?domainName=SAMPLE_domainName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `GET /ping`

Ping

- **Controller:** `MainController#ping`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:34`
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

