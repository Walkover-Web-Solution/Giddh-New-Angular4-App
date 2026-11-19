# Backend-Verified Frontend APIs: 08-gst-vat.md

Only exact HTTP method + normalized controller-path matches are included.

### `GET /v2/company/:companyUniqueName/gstr-reconcile/invoices?page=:page&count=:count&action=:action&refresh=:refresh&from=:from&to=:to&gstReturnType=:gstReturnType`

- **Frontend id:** `GST_RECONCILE_API.GET_INVOICES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#GstReconcileGetInvoices`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#getB2bInvoices
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:458`
- **Deprecated:** No

Get B2b Invoices

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `monthYear` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `gstin` — type: `String`; required
- `page` — type: `String`; optional; default: `1`
- `count` — type: `String`; optional; default: `20`
- `action` — type: `String`; optional; default: `NOT_ON_GIDDH`
- `refresh` — type: `Boolean`; optional; default: `false`
- `gstReturnType` — type: `String`; optional; default: ``
- `gsp` — type: `String`; optional; default: `whitebooks`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `b2BInvoicesData`

```json
{
  "status": "success",
  "body": {
    "reference": "b2BInvoicesData"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr-reconcile/invoices?branchUniqueName=aaaa&monthYear=SAMPLE_monthYear&from=01-04-2025&to=31-03-2026&gstin=SAMPLE_gstin&page=1&count=20&action=NOT_ON_GIDDH&refresh=false&gstReturnType=&gsp=whitebooks' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/save-gstr3b?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp&monthYear=:monthYear&currentDateTime=:currentDateTime`

- **Frontend id:** `GST_RETURN_API.FILE_GSTR3B`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-invoice.service.ts#FileGstr3B`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#saveGstr3BData
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:337`
- **Deprecated:** No

Save Gstr3BData

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `monthYear` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `gstin` — type: `String`; required
- `currentDateTime` — type: `String`; required
- `gsp` — type: `String`; optional; default: `whitebooks`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Initiated process to send data to GST Portal."`

```json
{
  "status": "success",
  "body": "Initiated process to send data to GST Portal."
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/save-gstr3b?monthYear=SAMPLE_monthYear&from=01-04-2025&to=31-03-2026&gstin=SAMPLE_gstin&currentDateTime=SAMPLE_currentDateTime&gsp=whitebooks&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/session?gstin=:company_gstin`

- **Frontend id:** `GST_RETURN_API.GET_GSP_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#GetGSPSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#getSession
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:397`
- **Deprecated:** No

Get Session

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `gstin` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `session`

```json
{
  "status": "success",
  "body": {
    "reference": "session"
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
- `body as GetGspSessionResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/session?gstin=SAMPLE_gstin&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/tax-numbers`

- **Frontend id:** `GST_RETURN_API.GET_TAX_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#getTaxDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllTaxNumbers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:947`
- **Deprecated:** No

Get All Tax Numbers

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
- Body evidence: `addressService.getAllTaxNumbers(company, branchUniqueName`

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax-numbers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/gst-setting`

- **Frontend id:** `GSTR_API.CREATE_LUT_NUMBER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#createLutNumber`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyGstSettingController#createGSTSetting
- **Backend source:** `src/main/java/com/giddh/api/controllers/CompanyGstSettingController.java:58`
- **Deprecated:** No

Create GSTSetting

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CompanyLUTInfoResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `lutNumber` | `String` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "lutNumber": "string"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","lutNumber":"string"}'
```

---

### `DELETE /company/:companyUniqueName/gst-setting/:lutNumberUniqueName`

- **Frontend id:** `GSTR_API.DELETE_LUT_NUMBER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#deleteLutNumber`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyGstSettingController#deleteGSTSetting
- **Backend source:** `src/main/java/com/giddh/api/controllers/CompanyGstSettingController.java:88`
- **Deprecated:** No

Delete GSTSetting

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
- Body evidence: `companyService.deleteGSTSetting(uniqueName`

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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/gstr1/download-v2?gstin=:gstIn&from=:from&to=:to&type=:type`

- **Frontend id:** `GSTR_API.DOWNLOAD_JSON`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#downloadGSTRJSON`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#downloadGstr1DataWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:727`
- **Deprecated:** No

Download Gstr1Data With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `monthYear` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `gstin` — type: `String`; required
- `saveToPortal` — type: `boolean`; optional; default: `true`

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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr1/download-v2?branchUniqueName=aaaa&monthYear=SAMPLE_monthYear&from=01-04-2025&to=31-03-2026&gstin=SAMPLE_gstin&saveToPortal=true' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/save-gstr1?gstin=:company_gstin&from=:from&to=:to&gsp=:gsp&currentDateTime=:currentDateTime`

- **Frontend id:** `GSTR_API.FILE_GSTR1`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#FileGstr1`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#saveGstr1Data
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:280`
- **Deprecated:** No

Save Gstr1Data

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `monthYear` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `gstin` — type: `String`; required
- `gsp` — type: `String`; optional; default: `whitebooks`
- `currentDateTime` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Initiated process to send data to GST Portal."`

```json
{
  "status": "success",
  "body": "Initiated process to send data to GST Portal."
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/save-gstr1?monthYear=SAMPLE_monthYear&from=01-04-2025&to=31-03-2026&gstin=SAMPLE_gstin&gsp=whitebooks&currentDateTime=SAMPLE_currentDateTime&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/gstr1-referenceIds?gstin=:gstIn&from=:from&to=:to&page=:page&count=:count&gsp=:gsp`

- **Frontend id:** `GSTR_API.GET_FILING_STATUS_REFERENCE_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#getFilingStatusReferenceIdList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#getGstr1ReferenceIds
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:317`
- **Deprecated:** No

Get Gstr1Reference Ids

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `gstin` — type: `String`; required
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `monthYear` — type: `String`; optional

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
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr1-referenceIds?gstin=SAMPLE_gstin&from=01-04-2025&to=31-03-2026&page=1&count=20&monthYear=SAMPLE_monthYear&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/save-gstr1-status?referenceId=:referenceId`

- **Frontend id:** `GSTR_API.GET_FILING_STATUS_RESPONSE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#getFilingStatus`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#saveGstr1Status
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:300`
- **Deprecated:** No

Save Gstr1Status

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `referenceId` — type: `String`; required
- `gsp` — type: `String`; optional; default: `whitebooks`
- `gstin` — type: `String`; optional
- `retPeriod` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `JsonUtil.parseJson(status, Object.class`

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
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/save-gstr1-status?referenceId=SAMPLE_referenceId&gsp=whitebooks&gstin=SAMPLE_gstin&retPeriod=SAMPLE_retPeriod&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/gst-setting/list`

- **Frontend id:** `GSTR_API.GET_LUT_NUMBER_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#getLutNumberList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyGstSettingController#getAllGSTSetting
- **Backend source:** `src/main/java/com/giddh/api/controllers/CompanyGstSettingController.java:69`
- **Deprecated:** No

Get All GSTSetting

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyService.getAllGSTSetting(company`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting/list?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/gstr1?gstin=:gstin&from=:from&to=:to`

- **Frontend id:** `GSTR_API.GSTR1_SUMMARY_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#GetGstr1SummaryDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#getGstr1Data
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:86`
- **Deprecated:** No

Get Gstr1Data

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `monthYear` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `gstin` — type: `String`; required
- `validate` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `gstr1Response`

```json
{
  "status": "success",
  "body": {
    "reference": "gstr1Response"
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
- `body as Gstr1SummaryResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr1?branchUniqueName=aaaa&monthYear=SAMPLE_monthYear&from=01-04-2025&to=31-03-2026&gstin=SAMPLE_gstin&validate=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP`

- **Frontend id:** `GSTR_API.SAVE_GSP_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#SaveGSPSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#createGspSession
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:357`
- **Deprecated:** No

Create Gsp Session

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `gstin` — type: `String`; required
- `userName` — type: `String`; required
- `gsp` — type: `String`; optional; default: `whitebooks`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Otp sent successfully."`

```json
{
  "status": "success",
  "body": "Otp sent successfully."
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gsp-session?gstin=SAMPLE_gstin&userName=SAMPLE_userName&gsp=whitebooks&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/authenticate-gsp-session?gstin=:company_gstin&userName=:USERNAME&gsp=:GSP&otp=:OTP`

- **Frontend id:** `GSTR_API.SAVE_GSP_SESSION_WITH_OTP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#SaveGSPSessionWithOTP`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#authenticateGspSession
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:370`
- **Deprecated:** No

Authenticate Gsp Session

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `gstin` — type: `String`; required
- `userName` — type: `String`; required
- `otp` — type: `String`; required
- `gsp` — type: `String`; optional; default: `whitebooks`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Session created successfully."`

```json
{
  "status": "success",
  "body": "Session created successfully."
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/authenticate-gsp-session?gstin=SAMPLE_gstin&userName=SAMPLE_userName&otp=SAMPLE_otp&gsp=whitebooks&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/gst-setting/:lutNumberUniqueName`

- **Frontend id:** `GSTR_API.UPDATE_LUT_NUMBER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/gst-reconcile.service.ts#updateLutNumber`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyGstSettingController#updateGSTSetting
- **Backend source:** `src/main/java/com/giddh/api/controllers/CompanyGstSettingController.java:46`
- **Deprecated:** No

Update GSTSetting

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CompanyLUTInfoResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `lutNumber` | `String` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "lutNumber": "string"
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gst-setting/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","lutNumber":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/gstr3b-excel-export/email?monthYear=:month&gstin=:company_gstin&detailedSheet=:isNeedDetailSheet&email=:userEmail`

- **Frontend id:** `PURCHASE_INVOICE_API.SEND_GSTR3B_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/purchase-invoice.service.ts#SendGSTR3BEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GstReturnV2Controller#emailGstr3ExcelSheet
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GstReturnV2Controller.java:561`
- **Deprecated:** No

API for send mail of GSTR3B excel file

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `monthYear` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `gstin` — type: `String`; required
- `email` — type: `String`; optional; default: ``
- `detailedSheet` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Request Accepted. Excel sheet will be sent via email shortly"`

```json
{
  "status": "success",
  "body": "Request Accepted. Excel sheet will be sent via email shortly"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/gstr3b-excel-export/email?branchUniqueName=aaaa&monthYear=SAMPLE_monthYear&from=01-04-2025&to=31-03-2026&gstin=SAMPLE_gstin&email=&detailedSheet=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/reverse-charge-report?from=:from&to=:to&sort=:sort&sortBy=:sortBy&page=:page&count=:count`

- **Frontend id:** `REVERSECHARGE_API.VIEW_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/reversecharge.service.ts#getReverseChargeReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getReverseChargeReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:449`
- **Deprecated:** No

Get Reverse Charge Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `date`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ReverseChargeSearchFilter` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `supplierCountry` | `String` | not declared | unconstrained |
| `invoiceNumber` | `String` | not declared | unconstrained |
| `supplierName` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |

Example:

```json
{
  "supplierCountry": "string",
  "invoiceNumber": "string",
  "supplierName": "string",
  "voucherType": "string"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reverse-charge-report?from=01-04-2025&to=31-03-2026&page=1&count=20&sort=desc&sortBy=date&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"supplierCountry":"string","invoiceNumber":"string","supplierName":"string","voucherType":"string"}'
```

---

### `GET /company/:companyUniqueName/authorize`

- **Frontend id:** `VAT_API.CHECK_HMRC_AUTHORIZATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getHMRCAuthorization`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: OAuthController#getMTDPortalAuthorizeUrl
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/OAuthController.java:54`
- **Deprecated:** No

MTD: Making Tax Digital

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `url`

```json
{
  "status": "success",
  "body": {
    "reference": "url"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/authorize?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/kenya/v2/vat-report-download?from=:from&to=:to&taxNumber=:taxNumber&fileType=base64`

- **Frontend id:** `VAT_API.DOWNLOAD_KENYA_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#downloadVatReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: KenyaVatReturnController#downloadKenyaVatReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/KenyaVatReturnController.java:81`
- **Deprecated:** No

Download Kenya Vat Report V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/kenya/v2/vat-report-download?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/zw/vat-report-download-v2?from=:from&to=:to&taxNumber=:taxNumber&currencyCode=:currencyCode&fileType=base64`

- **Frontend id:** `VAT_API.DOWNLOAD_ZW_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#downloadVatReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ZWVatReturnController#downloadVatReportWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/ZWVatReturnController.java:79`
- **Deprecated:** No

Download Vat Report With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `currencyCode` — type: `String`; optional

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report-download-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&currencyCode=SAMPLE_currencyCode' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/zw/vat-report-detailed-download-v2?from=:from&to=:to&taxNumber=:taxNumber&section=:section&currencyCode=:currencyCode&page=:page&count=:count`

- **Frontend id:** `VAT_API.DOWNLOAD_ZW_TRANSACTIONS_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#downloadVatLiabilityReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ZWVatReturnController#downloadVatReportCurrencyWiseWithExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/ZWVatReturnController.java:117`
- **Deprecated:** No

Download Vat Report Currency Wise With Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `currencyCode` — type: `String`; optional

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report-detailed-download-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&currencyCode=SAMPLE_currencyCode' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/uk/payment/initiate`

- **Frontend id:** `VAT_API.INITIATE_PAYMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#initiatePayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#initiatePayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:317`
- **Deprecated:** No

POST /company/{companyUniqueName}/uk/payment/initiate

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `HmrcPaymentInitiateRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxRegime` | `String` | not declared | unconstrained |
| `reference` | `String` | not declared | unconstrained |
| `amountInPence` | `Long` | not declared | unconstrained |
| `backURL` | `String` | not declared | unconstrained |
| `vrn` | `String` | not declared | unconstrained |
| `periodFrom` | `String` | not declared | unconstrained |
| `periodTo` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxRegime": "string",
  "reference": "string",
  "amountInPence": 0,
  "backURL": "string",
  "vrn": "string",
  "periodFrom": "string",
  "periodTo": "string"
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/payment/initiate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxRegime":"string","reference":"string","amountInPence":0,"backURL":"string","vrn":"string","periodFrom":"string","periodTo":"string"}'
```

---

### `POST /company/:companyUniqueName/uk/retrieve-vat-liabilities?taxNumber=:taxNumber&from=:from&to=:to&branchUniqueName=:branchUniqueName`

- **Frontend id:** `VAT_API.LIABILITIES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getPaymentLiabilityList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#retrieveVatLiabilities
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:297`
- **Deprecated:** No

Retrieve Vat Liabilities

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `taxNumber` — type: `String`; required
- `from` — type: `String`; required
- `to` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<?>`
- Body evidence: `ResponseEntity<?>`

```json
{}
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/retrieve-vat-liabilities?taxNumber=SAMPLE_taxNumber&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/uk/retrieve-vat-payments?taxNumber=:taxNumber&from=:from&to=:to&branchUniqueName=:branchUniqueName`

- **Frontend id:** `VAT_API.PAYMENTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getPaymentLiabilityList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#retrieveVatPayments
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:282`
- **Deprecated:** No

Retrieve Vat Payments

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `taxNumber` — type: `String`; required
- `from` — type: `String`; required
- `to` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<?>`
- Body evidence: `ResponseEntity<?>`

```json
{}
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/retrieve-vat-payments?taxNumber=SAMPLE_taxNumber&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/save-authorization-code`

- **Frontend id:** `VAT_API.SAVE_AUTHORIZATION_CODE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#saveAuthorizationCode`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: OAuthController#saveAuthorizationCode
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/OAuthController.java:78`
- **Deprecated:** No

Save Authorization Code

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `Map<String, String>` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
{}
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/save-authorization-code?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `POST /company/:companyUniqueName/uk/submit-vat-return?taxNumber=:taxNumber&periodKey=:periodKey&from=:from&to=:to&branchUniqueName=:branchUniqueName`

- **Frontend id:** `VAT_API.SUBMIT_VAT_RETURN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#fileVatReturn`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#submitVatReturn
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:241`
- **Deprecated:** No

Submit Vat Return

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `taxNumber` — type: `String`; required
- `periodKey` — type: `String`; required
- `from` — type: `String`; required
- `to` — type: `String`; required
- `branchUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<?>`
- Body evidence: `ResponseEntity<?>`

```json
{}
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/submit-vat-return?taxNumber=SAMPLE_taxNumber&periodKey=SAMPLE_periodKey&from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/uk/vat-obligations?branchUniqueName=:branchUniqueName&taxNumber=:taxNumber&status=:status&from=:from&to=:to`

- **Frontend id:** `VAT_API.VAT_OBLIGATIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getVatObligations`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#getVatObligations
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:211`
- **Deprecated:** No

Get Vat Obligations

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `status` — type: `String`; optional; default: ``
- `from` — type: `String`; optional
- `to` — type: `String`; optional

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/vat-obligations?branchUniqueName=aaaa&taxNumber=SAMPLE_taxNumber&status=&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/kenya/vat-report?from=:from&to=:to&taxNumber=:taxNumber`

- **Frontend id:** `VAT_API.VIEW_KENYA_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getCountryWiseVatReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: KenyaVatReturnController#getKenyaVatReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/KenyaVatReturnController.java:52`
- **Deprecated:** No

Get Kenya Vat Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/kenya/vat-report?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/uk/vat-report?from=:from&to=:to&taxNumber=:taxNumber`

- **Frontend id:** `VAT_API.VIEW_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getCountryWiseVatReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#getUKVatReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:72`
- **Deprecated:** No

Get UKVat Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/vat-report?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/vat-report?from=:from&to=:to&taxNumber=:taxNumber`

- **Frontend id:** `VAT_API.VIEW_REPORT_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getVatReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VatReturnController#getVatReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/VatReturnController.java:53`
- **Deprecated:** No

Get Vat Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `vatReport`

```json
{
  "status": "success",
  "body": {
    "reference": "vatReport"
  }
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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/vat-report?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&page=:page&count=:count`

- **Frontend id:** `VAT_API.VIEW_TRANSACTIONS_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getVatReportTransactions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: VatReturnController#getVatReportDetailed
- **Backend source:** `src/main/java/com/giddh/api/controllers/VatReturnController.java:106`
- **Deprecated:** No

Get Vat Report Detailed

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `section` — type: `String`; required
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`

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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/vat-report-detailed?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&section=SAMPLE_section&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/uk/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&page=:page&count=:count`

- **Frontend id:** `VAT_API.VIEW_UK_TRANSACTIONS_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getVatReportTransactions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#getDetailedUKVatReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:88`
- **Deprecated:** No

Get Detailed UKVat Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `section` — type: `String`; required
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/vat-report-detailed?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&section=SAMPLE_section&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/uk/view-vat-return?taxNumber=:taxNumber&periodKey=:periodKey&from=:from&to=:to`

- **Frontend id:** `VAT_API.VIEW_VAT_RETURN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#viewVatReturn`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UKVatReturnController#viewVatReturn
- **Backend source:** `src/main/java/com/giddh/api/controllers/ukvat/UKVatReturnController.java:266`
- **Deprecated:** No

View Vat Return

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `taxNumber` — type: `String`; required
- `from` — type: `String`; required
- `to` — type: `String`; required
- `periodKey` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<?>`
- Body evidence: `ResponseEntity<?>`

```json
{}
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uk/view-vat-return?taxNumber=SAMPLE_taxNumber&from=01-04-2025&to=31-03-2026&periodKey=SAMPLE_periodKey&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/zw/vat-report?from=:from&to=:to&taxNumber=:taxNumber&currencyCode=:currencyCode`

- **Frontend id:** `VAT_API.VIEW_ZW_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getCountryWiseVatReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ZWVatReturnController#getZWVatReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/ZWVatReturnController.java:45`
- **Deprecated:** No

Get ZWVat Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `currencyCode` — type: `String`; optional

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&currencyCode=SAMPLE_currencyCode' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/zw/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&currencyCode=:currencyCode&page=:page&count=:count`

- **Frontend id:** `VAT_API.VIEW_ZW_TRANSACTIONS_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/vat.service.ts#getVatLiabilityReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ZWVatReturnController#getDetailedZWVatReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/ZWVatReturnController.java:137`
- **Deprecated:** No

Get Detailed ZWVat Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `currencyCode` — type: `String`; optional
- `section` — type: `String`; required
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `detailedVatReport`

```json
{
  "status": "success",
  "body": {
    "reference": "detailedVatReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/zw/vat-report-detailed?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&currencyCode=SAMPLE_currencyCode&section=SAMPLE_section&page=1&count=20' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

