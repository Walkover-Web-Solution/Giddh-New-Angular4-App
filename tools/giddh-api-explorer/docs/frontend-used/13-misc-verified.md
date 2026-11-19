# Backend-Verified Frontend APIs: 13-misc.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /v2/company/:companyUniqueName/activity-logs`

- **Frontend id:** `ACTIVITY_LOGS_API.GET_ACTIVITY_LOGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/activity-logs.service.ts#getActivityLogs`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AuditLogControllerV3#getActivityLogs
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AuditLogControllerV3.java:85`
- **Deprecated:** No

Get Activity Logs

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `AuditLogFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entity` | `String` | not declared | unconstrained |
| `operation` | `String` | not declared | unconstrained |
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `entryFromDate` | `String` | not declared | unconstrained |
| `entryToDate` | `String` | not declared | unconstrained |
| `voucherFromDate` | `String` | not declared | unconstrained |
| `voucherToDate` | `String` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `version` | `Integer` | not declared | unconstrained |
| `entityId` | `String` | not declared | unconstrained |
| `accountUniqueNames` | `List<String>` | not declared | unconstrained |
| `groupUniqueNames` | `List<String>` | not declared | unconstrained |
| `userUniqueNames` | `List<String>` | not declared | unconstrained |
| `filterData` | `FilterData` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `entity` | `EntityType` | not declared | USER, GROUP, COMPANY, ACCOUNT, LEDGER, VOUCHER, PURCHASE_ORDER, LOGS, INVOICE, VOUCHER_DOC, PROFORMA, ESTIMATE, COMPANY_SETTINGS, STOCK, MANUFACTURING, STOCK_GROUP, INVENTORY_USER, INVENTORY_ENTRY, COMPANY_LEDGERS, SUBSCRIPTION, PLAN, BANK_INTEGRATION, BANK_PAYMENT, PURCHASE, PURCHASE_BILL, ENTRY, FLAT_TRIALBALANCE, MASTER_EXPORT, MASTER_IMPORT, SALES_OVERVIEW_REPORT_EXPORT, PURCHASE_OVERVIEW_REPORT_EXPORT, SALES_DETAILED_REPORT_EXPORT, PURCHASE_DETAILED_REPORT_EXPORT, INVENTORY_IMPORT, INVENTORY_EXPORT, AGING_REPORT_EXPORT |
| `fromDate` | `LocalDateTime` | not declared | unconstrained |
| `toDate` | `LocalDateTime` | not declared | unconstrained |
| `entryFromDate` | `LocalDateTime` | not declared | unconstrained |
| `entryToDate` | `LocalDateTime` | not declared | unconstrained |
| `voucherFromDate` | `LocalDateTime` | not declared | unconstrained |
| `voucherToDate` | `LocalDateTime` | not declared | unconstrained |
| `operations` | `List<String>` | not declared | unconstrained |
| `sort` | `SortDirection` | not declared | ASC, DESC |
| `userUniqueName` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "entity": "USER",
  "operation": "string",
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "entryFromDate": "01-04-2025",
  "entryToDate": "01-04-2025",
  "voucherFromDate": "01-04-2025",
  "voucherToDate": "01-04-2025",
  "page": 0,
  "count": 0,
  "sort": "ASC",
  "version": 0,
  "entityId": "string",
  "accountUniqueNames": [],
  "groupUniqueNames": [],
  "userUniqueNames": [],
  "filterData": "string",
  "operations": [],
  "userUniqueName": []
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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/activity-logs?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entity":"USER","operation":"string","fromDate":"01-04-2025","toDate":"01-04-2025","entryFromDate":"01-04-2025","entryToDate":"01-04-2025","voucherFromDate":"01-04-2025","voucherToDate":"01-04-2025","page":0,"count":0,"sort":"ASC","version":0,"entityId":"string","accountUniqueNames":[],"groupUniqueNames":[],"userUniqueNames":[],"filterData":"string","operations":[],"userUniqueName":[]}'
```

---

### `GET /v4/company/:companyUniqueName/particular?customerUniqueName=:customerUniqueName&invoiceType=:invoiceType&barcode=:barcode`

- **Frontend id:** `COMMON_API.BARCODE_SCAN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getBarcodeScanData`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ParticularController#getActiveParticularAccountV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ParticularController.java:72`
- **Deprecated:** No

Get Active Particular Account V3

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `invoiceType` — type: `String`; optional; default: `sales`
- `accountUniqueName` — type: `String`; optional; default: ``
- `stockUniqueName` — type: `String`; optional
- `variantUniqueName` — type: `String`; optional
- `barcode` — type: `String`; optional; default: ``
- `customerUniqueName` — type: `String`; optional
- `oppositeAccountUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `particularAccount`

```json
{
  "status": "success",
  "body": {
    "reference": "particularAccount"
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
  --url 'https://api.giddh.com/v4/company/dcrcdiin17887749442630bsy43/particular?invoiceType=sales&accountUniqueName=&stockUniqueName=SAMPLE_STOCK&variantUniqueName=SAMPLE_variantUniqueName&barcode=&customerUniqueName=SAMPLE_customerUniqueName&oppositeAccountUniqueName=SAMPLE_oppositeAccountUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/calling-code`

- **Frontend id:** `COMMON_API.CALLING_CODES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#GetCallingCodes`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UIController#formDataForCallingCodes
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:72`
- **Deprecated:** No

/

#### Inputs

**Query parameters**
- `formName` — type: `String`; optional; default: `all`
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uiService.formDataForCallingCodes(formName, refresh`

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
  --url 'https://api.giddh.com/ui/calling-code?formName=all&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/cmdk?page=:page&q=:q&group=:group&refresh=false&isMobile=:isMobile`

- **Frontend id:** `COMMON_API.COMMAND_K`
- **Frontend evidence:** `apps/web-giddh/src/app/services/commandk.service.ts#searchCommandK`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: CompanyController#cmdKSearch
- **Backend source:** `src/main/java/com/giddh/api/controllers/CompanyController.java:74`
- **Deprecated:** No

Cmd KSearch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `refresh` — type: `boolean`; optional; default: `false`
- `isMobile` — type: `boolean`; optional; default: `false`

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
  "body": {}
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/cmdk?branchUniqueName=aaaa&q=&group=&page=1&count=20&refresh=false&isMobile=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /country?formName=:formName&refresh=false`

- **Frontend id:** `COMMON_API.COUNTRY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#GetCountry`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CountryAndStateController#getCountryList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/CountryAndStateController.java:57`
- **Deprecated:** No

/

#### Inputs

**Query parameters**
- `formName` — type: `String`; optional; default: `all`
- `region` — type: `String`; optional; default: `GL`
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `countryList`

```json
{
  "status": "success",
  "body": {
    "reference": "countryList"
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
  --url 'https://api.giddh.com/country?formName=all&region=GL&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /currency`

- **Frontend id:** `COMMON_API.CURRENCY`
- **Frontend evidence:** `common.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: CurrencyController#getCurrencyList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CurrencyController.java:25`
- **Deprecated:** No

Get Currency List

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `all`

```json
{
  "status": "success",
  "body": {
    "reference": "all"
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
  --url 'https://api.giddh.com/currency' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/download-file?voucherVersion=2&fileType=:fileType&downloadOption=:downloadOption`

- **Frontend id:** `COMMON_API.DOWNLOAD_FILE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#downloadFile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#download
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:258`
- **Deprecated:** No

Download

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `fileType` — type: `String`; optional; default: `pdf`
- `debugMode` — type: `boolean`; optional
- `downloadOption` — type: `DownloadOption`; optional; default: `ALL`; allowed: `VOUCHER`, `ATTACHMENT`, `ALL`

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `GET /ui/forms?formName=:formName&country=:country&refresh=false`

- **Frontend id:** `COMMON_API.FORM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getOnboardingForm`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UIController#formData
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:57`
- **Deprecated:** No

/

#### Inputs

**Query parameters**
- `country` — type: `String`; required
- `formName` — type: `String`; required
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uiService.formData(country, formName, refresh`

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
  --url 'https://api.giddh.com/ui/forms?country=SAMPLE_country&formName=SAMPLE_formName&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /gst-info?gstin=:gstin`

- **Frontend id:** `COMMON_API.GST_INFORMATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getGstInformationDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: MainController#getGstInfo
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:291`
- **Deprecated:** No

Get Gst Info

#### Inputs

**Query parameters**
- `gstin` — type: `String`; required
- `gsp` — type: `String`; optional; default: `whitebooks`

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
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "INVALID_REQUEST",
  "message": "Invalid Request"
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
  --url 'https://api.giddh.com/gst-info?gstin=SAMPLE_gstin&gsp=whitebooks' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/gst/unit-mapping`

- **Frontend id:** `COMMON_API.GST_STOCK_UNITS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getGstUnits; apps/web-giddh/src/app/services/common.service.ts#updateStockUnits`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#getGstUnitMapping
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:674`
- **Deprecated:** No

Get Gst Unit Mapping

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
- Body evidence: `mappingsDTO`

```json
{
  "status": "success",
  "body": {
    "reference": "mappingsDTO"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gst/unit-mapping?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /v2/company/:companyUniqueName/gst/unit-mapping`

- **Frontend id:** `COMMON_API.GST_STOCK_UNITS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getGstUnits; apps/web-giddh/src/app/services/common.service.ts#updateStockUnits`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#mapGstUnits
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:661`
- **Deprecated:** No

Map Gst Units

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `List<GstUnitMapping>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `giddhUnit` | `String` | not declared | unconstrained |
| `mappedGstUnit` | `String` | not declared | unconstrained |
| `code` | `String` | not declared | unconstrained |

Example:

```json
{
  "giddhUnit": "string",
  "mappedGstUnit": "string",
  "code": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.gst.unit.mapping"`

```json
{
  "status": "success",
  "body": "success.gst.unit.mapping"
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
curl --request PATCH \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gst/unit-mapping?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"giddhUnit":"string","mappedGstUnit":"string","code":"string"}'
```

---

### `GET /report-filters?module=:module&companyUniqueName=:companyUniqueName&customColumns=:customColumns`

- **Frontend id:** `COMMON_API.MODULE_WISE_COLUMNS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getSelectedTableColumns`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportFilterController#getReportFilterColumns
- **Backend source:** `src/main/java/com/giddh/api/controllers/ReportFilterController.java:49`
- **Deprecated:** No

Get Report Filter Columns

#### Inputs

**Query parameters**
- `companyUniqueName` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional
- `module` — type: `String`; required
- `reportNature` — type: `String`; optional
- `customColumns` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ApiResponse`
- Body evidence: `reportFilterService.getReportFilterColumns(company, branch, principal, module, customColumns, reportNature`

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
| 401 | `error.code.invalidSessionId` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "error.code.invalidSessionId",
  "message": "error.admin.not.found"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/report-filters?companyUniqueName=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa&module=SAMPLE_module&reportNature=SAMPLE_reportNature&customColumns=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/party-types`

- **Frontend id:** `COMMON_API.PARTY_TYPE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#GetPartyType`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UIController#formDataForPartyTypes
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:123`
- **Deprecated:** No

API to fetch party types for account

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uiService.formDataForPartyTypes(`

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
  --url 'https://api.giddh.com/ui/party-types' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /report-filters?module=:module&companyUniqueName=:companyUniqueName&`

- **Frontend id:** `COMMON_API.SAVE_MODULE_WISE_COLUMNS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#saveSelectedTableColumns`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportFilterController#saveReportFilterColumns
- **Backend source:** `src/main/java/com/giddh/api/controllers/ReportFilterController.java:36`
- **Deprecated:** No

Save Report Filter Columns

#### Inputs

**Query parameters**
- `companyUniqueName` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ReportFilterResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `module` | `String` | NotNull(message = "Module name cannot be null.") | unconstrained |
| `columns` | `Set<String>` | not declared | unconstrained |
| `reportFilterColumns` | `List<ReportFilterColumns>` | not declared | unconstrained |
| `headerColumns` | `List<ReportFilterColumns>` | not declared | unconstrained |
| `vatReportCurrency` | `String` | not declared | unconstrained |
| `liabilityReportCurrency` | `String` | not declared | unconstrained |
| `reportNature` | `String` | not declared | unconstrained |
| `showReportNature` | `Boolean` | not declared | unconstrained |
| `label` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `checked` | `Boolean` | not declared | unconstrained |
| `dataType` | `String` | not declared | unconstrained |

Example:

```json
{
  "module": "string",
  "columns": [],
  "reportFilterColumns": [],
  "headerColumns": [],
  "vatReportCurrency": "string",
  "liabilityReportCurrency": "string",
  "reportNature": "string",
  "showReportNature": false,
  "label": "string",
  "value": "string",
  "checked": false,
  "dataType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ApiResponse`
- Body evidence: `reportFilterService.saveReportFilterColumns(requestBody, company, branch, principal, module`

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
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Not Found"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/report-filters?companyUniqueName=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"module":"string","columns":[],"reportFilterColumns":[],"headerColumns":[],"vatReportCurrency":"string","liabilityReportCurrency":"string","reportNature":"string","showReportNature":false,"label":"string","value":"string","checked":false,"dataType":"string"}'
```

---

### `GET /stock-units`

- **Frontend id:** `COMMON_API.STOCK_UNITS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#getStockUnits`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: MainController#getStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:179`
- **Deprecated:** No

Get Stocks

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockUnits`

```json
{
  "status": "success",
  "body": {
    "reference": "stockUnits"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/stock-units' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/taxes?country=:country`

- **Frontend id:** `COMMON_API.TAXES`
- **Frontend evidence:** `common.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: UIController#formDataForTaxes
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:85`
- **Deprecated:** No

API to fetch Form Data based on country and form name

#### Inputs

**Query parameters**
- `country` — type: `String`; required
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uiService.formDataForTaxes(country, refresh`

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
  --url 'https://api.giddh.com/ui/taxes?country=SAMPLE_country&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/ledger/upload`

- **Frontend id:** `COMMON_API.UPLOAD_FILE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#uploadFile; apps/web-giddh/src/app/services/voucher.service.ts#uploadFile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ImageController#uploadFileForLedger; accounting-microservice: AttachmentController#uploadFileForLedger; import-microservice: AttachmentController#uploadFileForLedger
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ImageController.java:145`
- **Deprecated:** No

Upload File For Ledger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `entries` — type: `String`; optional
- `type` — type: `String`; optional; default: `ledger`
**Multipart parts**
- `file` — type: `MultipartFile`; optional

#### Controller-backed request payload

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
| 400 | `INVALID_REQUEST` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": "INVALID_REQUEST",
  "message": "Attach file in request."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ledger/upload?entries=SAMPLE_entries&type=ledger&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --form 'file=@/path/to/file'
```

---

### `POST /company/:companyUniqueName/images`

- **Frontend id:** `COMMON_API.UPLOAD_IMAGE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/common.service.ts#uploadImage; apps/web-giddh/src/app/services/common.service.ts#uploadImageBase64`
- **Method evidence:** actual frontend HTTP call
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

### `POST /company/:companyUniqueName/customfield`

- **Frontend id:** `CUSTOM_FIELDS.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/custom-fields.service.ts#create`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomFieldController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomFieldController.java:55`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `List<CustomFieldResourceV2>` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
[]
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `customFields.stream().map(CustomFieldResourceV2::new).collect(Collectors.toList(`

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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '[]'
```

---

### `DELETE /company/:companyUniqueName/customfield/:customFieldUniqueName`

- **Frontend id:** `CUSTOM_FIELDS.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/custom-fields.service.ts#delete`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomFieldController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomFieldController.java:101`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `customFieldUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.customField.delete"`

```json
{
  "status": "success",
  "body": "success.customField.delete"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/SAMPLE_customFieldUniqueName?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/customfield/:customFieldUniqueName`

- **Frontend id:** `CUSTOM_FIELDS.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/custom-fields.service.ts#get`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomFieldController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomFieldController.java:87`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `customFieldUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `customFieldResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "customFieldResponse"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/SAMPLE_customFieldUniqueName?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/customfield/module/:moduleUniqueName?page=:page&count=:count`

- **Frontend id:** `CUSTOM_FIELDS.GET_ALL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/custom-fields.service.ts#list`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomFieldController#getAllByModule
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomFieldController.java:116`
- **Deprecated:** No

Get All By Module

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `moduleUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/module/SAMPLE_moduleUniqueName?page=1&count=0&lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/customfield/:customFieldUniqueName`

- **Frontend id:** `CUSTOM_FIELDS.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/custom-fields.service.ts#update`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomFieldController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomFieldController.java:70`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `customFieldUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `CustomFieldResourceV2` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `customFieldResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "customFieldResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

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
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customfield/SAMPLE_customFieldUniqueName?branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/communication/generate-email`

- **Frontend id:** `EMAIL_FORWARDING_API.GENERATE_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/email-forwarding/services/email-forwarding.service.ts#generateEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#generateEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:272`
- **Deprecated:** No

This function is used to generate mailId for mail forwarding

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.generateEmailIdForUserV2(company`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/generate-email?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /white-label`

- **Frontend id:** `INLINE.app.whiteLabel`
- **Frontend evidence:** `app.module.ts · app.module.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: GiddhWhiteLabelController#getWhiteLabelDetailsByOrigin
- **Backend source:** `src/main/java/com/giddh/api/controllers/GiddhWhiteLabelController.java:35`
- **Deprecated:** No

Get White Label Details By Origin

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `giddhWhiteLabelDetails`

```json
{
  "status": "success",
  "body": {
    "reference": "giddhWhiteLabelDetails"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `MALFORMED_URL` | `MalformedURLException` | MalformedURLException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "MALFORMED_URL",
  "message": "Malformed URL"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/white-label' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /exception/invalid-json`

- **Frontend id:** `INLINE.auth.invalidJson`
- **Frontend evidence:** `authentication.service.ts · authentication.service.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: CustomExceptionController#generateInvoice
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CustomExceptionController.java:33`
- **Deprecated:** No

Generate Invoice

#### Inputs



#### Controller-backed request payload

Type: `CustomExceptionRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"OK"`

```json
{
  "status": "success",
  "body": "OK"
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
curl --request POST \
  --url 'https://api.giddh.com/exception/invalid-json' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /company/:companyUniqueName/logs?page=:page`

- **Frontend id:** `LOGS_API.AUDIT_LOGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/logs.service.ts#GetAuditLogs`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getCompanyLogs
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:226`
- **Deprecated:** No

Get Company Logs

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `0`

#### Controller-backed request payload

Type: `FilterRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `auditLogResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "auditLogResponse"
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
- `body as LogsResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/logs?page=0&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /ui/auditlogs-form`

- **Frontend id:** `LOGS_API.GET_AUDIT_LOG_FORM_FILTERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/logs.service.ts#getAuditLogFormFilters`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UIController#getAuditLogOperationFilterForm
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:212`
- **Deprecated:** No

/

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `JsonUtil.readJson(AUDIT_LOGS_FORM_JSON_PATH, new TypeReference<List<HashMap>>() {}`

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
  --url 'https://api.giddh.com/ui/auditlogs-form' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/logs?page=:page`

- **Frontend id:** `LOGS_API.GET_AUDIT_LOGS_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/logs.service.ts#getAuditLogs`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AuditLogControllerV3#getLogs
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AuditLogControllerV3.java:68`
- **Deprecated:** No

API to fetch Audit Logs

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `AuditLogFilter` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entity` | `String` | not declared | unconstrained |
| `operation` | `String` | not declared | unconstrained |
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `entryFromDate` | `String` | not declared | unconstrained |
| `entryToDate` | `String` | not declared | unconstrained |
| `voucherFromDate` | `String` | not declared | unconstrained |
| `voucherToDate` | `String` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `version` | `Integer` | not declared | unconstrained |
| `entityId` | `String` | not declared | unconstrained |
| `accountUniqueNames` | `List<String>` | not declared | unconstrained |
| `groupUniqueNames` | `List<String>` | not declared | unconstrained |
| `userUniqueNames` | `List<String>` | not declared | unconstrained |
| `filterData` | `FilterData` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `entity` | `EntityType` | not declared | USER, GROUP, COMPANY, ACCOUNT, LEDGER, VOUCHER, PURCHASE_ORDER, LOGS, INVOICE, VOUCHER_DOC, PROFORMA, ESTIMATE, COMPANY_SETTINGS, STOCK, MANUFACTURING, STOCK_GROUP, INVENTORY_USER, INVENTORY_ENTRY, COMPANY_LEDGERS, SUBSCRIPTION, PLAN, BANK_INTEGRATION, BANK_PAYMENT, PURCHASE, PURCHASE_BILL, ENTRY, FLAT_TRIALBALANCE, MASTER_EXPORT, MASTER_IMPORT, SALES_OVERVIEW_REPORT_EXPORT, PURCHASE_OVERVIEW_REPORT_EXPORT, SALES_DETAILED_REPORT_EXPORT, PURCHASE_DETAILED_REPORT_EXPORT, INVENTORY_IMPORT, INVENTORY_EXPORT, AGING_REPORT_EXPORT |
| `fromDate` | `LocalDateTime` | not declared | unconstrained |
| `toDate` | `LocalDateTime` | not declared | unconstrained |
| `entryFromDate` | `LocalDateTime` | not declared | unconstrained |
| `entryToDate` | `LocalDateTime` | not declared | unconstrained |
| `voucherFromDate` | `LocalDateTime` | not declared | unconstrained |
| `voucherToDate` | `LocalDateTime` | not declared | unconstrained |
| `operations` | `List<String>` | not declared | unconstrained |
| `sort` | `SortDirection` | not declared | ASC, DESC |
| `userUniqueName` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "entity": "USER",
  "operation": "string",
  "fromDate": "01-04-2025",
  "toDate": "01-04-2025",
  "entryFromDate": "01-04-2025",
  "entryToDate": "01-04-2025",
  "voucherFromDate": "01-04-2025",
  "voucherToDate": "01-04-2025",
  "page": 0,
  "count": 0,
  "sort": "ASC",
  "version": 0,
  "entityId": "string",
  "accountUniqueNames": [],
  "groupUniqueNames": [],
  "userUniqueNames": [],
  "filterData": "string",
  "operations": [],
  "userUniqueName": []
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
- `body as AuditLogsResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/logs?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entity":"USER","operation":"string","fromDate":"01-04-2025","toDate":"01-04-2025","entryFromDate":"01-04-2025","entryToDate":"01-04-2025","voucherFromDate":"01-04-2025","voucherToDate":"01-04-2025","page":0,"count":0,"sort":"ASC","version":0,"entityId":"string","accountUniqueNames":[],"groupUniqueNames":[],"userUniqueNames":[],"filterData":"string","operations":[],"userUniqueName":[]}'
```

