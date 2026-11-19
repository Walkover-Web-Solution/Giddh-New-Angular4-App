# Backend-Verified Frontend APIs: 10-settings.md

Only exact HTTP method + normalized controller-path matches are included.

### `GET /company/:companyUniqueName/discount`

- **Frontend id:** `SETTINGS_DISCOUNT_API.COMMON`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.discount.service.ts#GetDiscounts; apps/web-giddh/src/app/services/settings.discount.service.ts#CreateDiscount; apps/web-giddh/src/app/services/settings.discount.service.ts#DeleteDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DiscountController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DiscountController.java:64`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `variantDiscount` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `allDiscount`

```json
{
  "status": "success",
  "body": {
    "reference": "allDiscount"
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
- `body as IDiscountList[]`
- `body as IDiscountList`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount?variantDiscount=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/discount`

- **Frontend id:** `SETTINGS_DISCOUNT_API.COMMON`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.discount.service.ts#GetDiscounts; apps/web-giddh/src/app/services/settings.discount.service.ts#CreateDiscount; apps/web-giddh/src/app/services/settings.discount.service.ts#DeleteDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DiscountController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DiscountController.java:39`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `DiscountRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `discountValue` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `variantDiscount` | `boolean` | not declared | unconstrained |
| `price` | `BigDecimal` | not declared | unconstrained |
| `quantity` | `Double` | not declared | unconstrained |
| `taxInclusive` | `Boolean` | not declared | unconstrained |
| `discountExclusive` | `Boolean` | not declared | unconstrained |
| `stockUnitUniqueName` | `String` | not declared | unconstrained |
| `variantUniqueName` | `String` | not declared | unconstrained |
| `discounts` | `List<Discount>` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `value` | `BigDecimal` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "type": "string",
  "discountValue": 0,
  "accountUniqueName": "string",
  "variantDiscount": false,
  "price": 0,
  "quantity": 0,
  "taxInclusive": false,
  "discountExclusive": false,
  "stockUnitUniqueName": "string",
  "variantUniqueName": "string",
  "discounts": [],
  "value": 0,
  "uniqueName": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.discount.create"`

```json
{
  "status": "success",
  "body": "success.discount.create"
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
- `body as IDiscountList[]`
- `body as IDiscountList`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","type":"string","discountValue":0,"accountUniqueName":"string","variantDiscount":false,"price":0,"quantity":0,"taxInclusive":false,"discountExclusive":false,"stockUnitUniqueName":"string","variantUniqueName":"string","discounts":[],"value":0,"uniqueName":"string"}'
```

---

### `PUT /company/:companyUniqueName/discount/:discountUniqueName`

- **Frontend id:** `SETTINGS_DISCOUNT_API.PUT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.discount.service.ts#UpdateDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DiscountController#updateDiscount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DiscountController.java:51`
- **Deprecated:** No

Update Discount

#### Inputs

**Path parameters**
- `discountUniqueName` — type: `String`; required
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `DiscountRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `discountValue` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `variantDiscount` | `boolean` | not declared | unconstrained |
| `price` | `BigDecimal` | not declared | unconstrained |
| `quantity` | `Double` | not declared | unconstrained |
| `taxInclusive` | `Boolean` | not declared | unconstrained |
| `discountExclusive` | `Boolean` | not declared | unconstrained |
| `stockUnitUniqueName` | `String` | not declared | unconstrained |
| `variantUniqueName` | `String` | not declared | unconstrained |
| `discounts` | `List<Discount>` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |
| `value` | `BigDecimal` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "type": "string",
  "discountValue": 0,
  "accountUniqueName": "string",
  "variantDiscount": false,
  "price": 0,
  "quantity": 0,
  "taxInclusive": false,
  "discountExclusive": false,
  "stockUnitUniqueName": "string",
  "variantUniqueName": "string",
  "discounts": [],
  "value": 0,
  "uniqueName": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `discountResource`

```json
{
  "status": "success",
  "body": {
    "reference": "discountResource"
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
- `body as IDiscountList`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/discount/SAMPLE_discountUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","type":"string","discountValue":0,"accountUniqueName":"string","variantDiscount":false,"price":0,"quantity":0,"taxInclusive":false,"discountExclusive":false,"stockUnitUniqueName":"string","variantUniqueName":"string","discounts":[],"value":0,"uniqueName":"string"}'
```

---

### `POST /company/:companyUniqueName/financial-year`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.ADD_FINANCIAL_YEAR`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#AddFinancialYear`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#createFinancialYear
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:47`
- **Deprecated:** No

Create Financial Year

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `FinancialYearCreateRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `createdFinancialYears`

```json
{
  "status": "success",
  "body": {
    "reference": "createdFinancialYears"
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
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /company/:companyUniqueName/future-financial-year`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.ADD_FUTURE_FINANCIAL_YEAR`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#addFutureFinancialYear`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#createFutureFinancialYear
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:103`
- **Deprecated:** No

Create Future Financial Year

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new FinancialYearResource(financialYear`

```json
{
  "status": "success",
  "body": {
    "type": "FinancialYearResource"
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
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/future-financial-year?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/financial-year`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#GetAllFinancialYears`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#getFinancialYear
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:58`
- **Deprecated:** No

Get Financial Year

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `allFinancialYears`

```json
{
  "status": "success",
  "body": {
    "reference": "allFinancialYears"
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
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/financial-year-limits`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.GET_FINANCIAL_YEAR_LIMITS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#getFinancialYearLimits`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#financialYearLimits
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:113`
- **Deprecated:** No

Financial Year Limits

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `dateLimits`

```json
{
  "status": "success",
  "body": {
    "reference": "dateLimits"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year-limits?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/financial-year-lock`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.LOCK_FINANCIAL_YEAR`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#LockFinancialYear`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#lockFinancialYear
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:79`
- **Deprecated:** No

Lock Financial Year

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `FinancialYearLockRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `lockedFinancialYears`

```json
{
  "status": "success",
  "body": {
    "reference": "lockedFinancialYears"
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
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year-lock?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PATCH /company/:companyUniqueName/financial-year-unlock`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.UNLOCK_FINANCIAL_YEAR`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#UnlockFinancialYear`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#unlockFinancialYear
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:91`
- **Deprecated:** No

Unlock Financial Year

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `FinancialYearUnlockRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `unlockedFinancialYears`

```json
{
  "status": "success",
  "body": {
    "reference": "unlockedFinancialYears"
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
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year-unlock?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PUT /company/:companyUniqueName/financial-year`

- **Frontend id:** `SETTINGS_FINANCIAL_YEAR_API.UPDATE_FY_PERIOD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.financial-year.service.ts#UpdateFinancialYearPeriod`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: FinancialYearController#updateFinancialYear
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/FinancialYearController.java:67`
- **Deprecated:** No

Update Financial Year

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `FinancialYearUpdateRequest` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `updatedFinancialYears`

```json
{
  "status": "success",
  "body": {
    "reference": "updatedFinancialYears"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
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
- `body as IFinancialYearResponse`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/financial-year?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /v2/company/:companyUniqueName/bank/multi-registration`

- **Frontend id:** `SETTINGS_INTEGRATION_API.BANK_ACCOUNT_MULTI_REGISTRATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#bankAccountMultiRegistration`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#addNewCorporateRegistration
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:189`
- **Deprecated:** No

In Once ICICI Bank Account Integration - There can be multiple login credentials can be added . This API will add login credentials , for already integrated bank account.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `ICICICorporateDetailsV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `bankName` | `String` | not declared | unconstrained |
| `accountNumber` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `corpId` | `String` | not declared | unconstrained |
| `bankUserId` | `String` | not declared | unconstrained |
| `aggrId` | `String` | not declared | unconstrained |
| `aggrName` | `String` | not declared | unconstrained |
| `urn` | `String` | not declared | unconstrained |
| `loginId` | `String` | not declared | unconstrained |
| `aliasId` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | NotNull(message = "Unique Name can not be null") | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `maxAmount` | `BigDecimal` | not declared | unconstrained |
| `paymentAlerts` | `List<String>` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "bankName": "string",
  "accountNumber": "string",
  "accountUniqueName": "string",
  "corpId": "string",
  "bankUserId": "string",
  "aggrId": "string",
  "aggrName": "string",
  "urn": "string",
  "loginId": "string",
  "aliasId": "string",
  "uniqueName": "string",
  "duration": "string",
  "maxAmount": 0,
  "paymentAlerts": [],
  "userUniqueName": "string"
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
| 400 | `BAD_PADDING` | `BadPaddingException` | BadPaddingException raised by controller or shared ExceptionHandler |
| 400 | `CERTIFICATE` | `CertificateException` | CertificateException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_BLOCK_SIZE` | `IllegalBlockSizeException` | IllegalBlockSizeException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY` | `InvalidKeyException` | InvalidKeyException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY_SPEC` | `InvalidKeySpecException` | InvalidKeySpecException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_ALGORITHM` | `NoSuchAlgorithmException` | NoSuchAlgorithmException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_PADDING` | `NoSuchPaddingException` | NoSuchPaddingException raised by controller or shared ExceptionHandler |
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
  "code": "BAD_PADDING",
  "message": "Bad Padding"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/multi-registration?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"bankName":"string","accountNumber":"string","accountUniqueName":"string","corpId":"string","bankUserId":"string","aggrId":"string","aggrName":"string","urn":"string","loginId":"string","aliasId":"string","uniqueName":"string","duration":"string","maxAmount":0,"paymentAlerts":[],"userUniqueName":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/bank`

- **Frontend id:** `SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#bankAccountRegistration; apps/web-giddh/src/app/services/settings.integration.service.ts#getAllBankAccounts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#bankRegistrationForICICI
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:90`
- **Deprecated:** No

Bank Registration For ICICI

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `ICICICorporateDetailsV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `bankName` | `String` | not declared | unconstrained |
| `accountNumber` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `corpId` | `String` | not declared | unconstrained |
| `bankUserId` | `String` | not declared | unconstrained |
| `aggrId` | `String` | not declared | unconstrained |
| `aggrName` | `String` | not declared | unconstrained |
| `urn` | `String` | not declared | unconstrained |
| `loginId` | `String` | not declared | unconstrained |
| `aliasId` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | NotNull(message = "Unique Name can not be null") | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `maxAmount` | `BigDecimal` | not declared | unconstrained |
| `paymentAlerts` | `List<String>` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "bankName": "string",
  "accountNumber": "string",
  "accountUniqueName": "string",
  "corpId": "string",
  "bankUserId": "string",
  "aggrId": "string",
  "aggrName": "string",
  "urn": "string",
  "loginId": "string",
  "aliasId": "string",
  "uniqueName": "string",
  "duration": "string",
  "maxAmount": 0,
  "paymentAlerts": [],
  "userUniqueName": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `iciciBankResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "iciciBankResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `BAD_PADDING` | `BadPaddingException` | BadPaddingException raised by controller or shared ExceptionHandler |
| 400 | `CERTIFICATE` | `CertificateException` | CertificateException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_BLOCK_SIZE` | `IllegalBlockSizeException` | IllegalBlockSizeException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY` | `InvalidKeyException` | InvalidKeyException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY_SPEC` | `InvalidKeySpecException` | InvalidKeySpecException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_ALGORITHM` | `NoSuchAlgorithmException` | NoSuchAlgorithmException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_PADDING` | `NoSuchPaddingException` | NoSuchPaddingException raised by controller or shared ExceptionHandler |
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
  "code": "BAD_PADDING",
  "message": "Bad Padding"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"bankName":"string","accountNumber":"string","accountUniqueName":"string","corpId":"string","bankUserId":"string","aggrId":"string","aggrName":"string","urn":"string","loginId":"string","aliasId":"string","uniqueName":"string","duration":"string","maxAmount":0,"paymentAlerts":[],"userUniqueName":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/bank`

- **Frontend id:** `SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#bankAccountRegistration; apps/web-giddh/src/app/services/settings.integration.service.ts#getAllBankAccounts`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#getAllRegistration
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:220`
- **Deprecated:** No

Only super Admin can perform the operation on this .

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `bankName` — type: `String`; optional; default: ``
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `bankDetailsResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "bankDetailsResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank?bankName=&lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/bank/integration/form?bankName=:bankName`

- **Frontend id:** `SETTINGS_INTEGRATION_API.BANK_INTERATION_VALIDATION_FORM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getValidationFormForBank`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UIController#getBankIntegrationForm
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:198`
- **Deprecated:** No

/

#### Inputs

**Query parameters**
- `bankName` — type: `String`; required
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `uiService.getBankIntegrationForm(bankName, refresh`

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
  --url 'https://api.giddh.com/ui/bank/integration/form?bankName=SAMPLE_bankName&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/email-key`

- **Frontend id:** `SETTINGS_INTEGRATION_API.EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetEmailKey; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveEmailKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getEmailVerificationKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:297`
- **Deprecated:** No

Get Email Verification Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyService.getEmailVerificationKey(principal, company, request`

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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
- `body as EmailKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/email-key?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/email-key`

- **Frontend id:** `SETTINGS_INTEGRATION_API.EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetEmailKey; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveEmailKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#emailVerificationKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:313`
- **Deprecated:** No

Email Verification Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `SendGridCredentials` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `authKey` | `String` | not declared | unconstrained |
| `subject` | `String` | not declared | unconstrained |

Example:

```json
{
  "authKey": "string",
  "subject": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Added Successfully!"`

```json
{
  "status": "success",
  "body": "Added Successfully!"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/email-key?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"authKey":"string","subject":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor?amount=:amount`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GET_BANK_ACCOUNT_PAYORS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getBankAccountPayorsList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#getPayorsForPayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:347`
- **Deprecated:** No

Get Payors For Payment

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `bankDetailsUniqueName` — type: `String`; required
**Query parameters**
- `amount` — type: `String`; required
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankDetailsUniqueName/payor?amount=SAMPLE_amount&lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:bankUserId/status`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GET_PAYOR_REGISTRATION_STATUS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getPayorRegistrationStatus`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#getRegistrationStatus
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:318`
- **Deprecated:** No

API : Get registration status of the integrated bank account .

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `bankDetailsUniqueName` — type: `String`; required
- `urn` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

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
| 400 | `BAD_PADDING` | `BadPaddingException` | BadPaddingException raised by controller or shared ExceptionHandler |
| 400 | `CERTIFICATE` | `CertificateException` | CertificateException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_BLOCK_SIZE` | `IllegalBlockSizeException` | IllegalBlockSizeException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_ALGORITHM_PARAMETER` | `InvalidAlgorithmParameterException` | InvalidAlgorithmParameterException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY` | `InvalidKeyException` | InvalidKeyException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY_SPEC` | `InvalidKeySpecException` | InvalidKeySpecException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_ALGORITHM` | `NoSuchAlgorithmException` | NoSuchAlgorithmException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_PADDING` | `NoSuchPaddingException` | NoSuchPaddingException raised by controller or shared ExceptionHandler |
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
  "code": "BAD_PADDING",
  "message": "Bad Padding"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankDetailsUniqueName/payor/SAMPLE_urn/status?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/plaid/create/link-token?itemId=:itemId`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GET_PLAID_LINK_TOKEN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getPlaidLinkToken`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PlaidController#createLinkToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PlaidController.java:45`
- **Deprecated:** No

Create Link Token

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`
- `itemId` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `linkTokenResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "linkTokenResponse"
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/plaid/create/link-token?lang=DEFAULT_LANG&itemId=SAMPLE_itemId&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/gocardless/agreement-requisitions?institutionId=:institutionId`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GOCARDLESS.CREATE_END_USER_AGREEMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#createEndUserAgreementByInstitutionId`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoCardlessBankIntegrationController#createEndUserAgreementAndRequisitions
- **Backend source:** `src/main/java/com/giddh/api/controllers/GoCardlessBankIntegrationController.java:69`
- **Deprecated:** No

Create End User Agreement And Requisitions

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`
- `institutionId` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `gocardlessBankIntegrationService.createEndUserAgreementAndRequisitions(company, request, language, principal, institutionId`

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/agreement-requisitions?lang=DEFAULT_LANG&institutionId=SAMPLE_institutionId&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/gocardless/:agreementId`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GOCARDLESS.DELETE_END_USER_AGREEMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#deleteEndUserAgreementDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoCardlessBankIntegrationController#deleteBankIntegrationDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/GoCardlessBankIntegrationController.java:80`
- **Deprecated:** No

Delete Bank Integration Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `bankDetailsUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`
- `bankName` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `gocardlessBankIntegrationService.deleteBankIntegrationDetails(company, bankDetailsUniqueName, bankName, request, language, principal`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/SAMPLE_bankDetailsUniqueName?lang=DEFAULT_LANG&bankName=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/gocardless/institutions?countryCode=:countryCode&page=:page&count=:count&refresh=true`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GOCARDLESS.GET_ALL_INSTITUTIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getAllInstitutions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoCardlessBankIntegrationController#getAllInstitution
- **Backend source:** `src/main/java/com/giddh/api/controllers/GoCardlessBankIntegrationController.java:43`
- **Deprecated:** No

Get All Institution

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`
- `countryCode` — type: `String`; required
- `refresh` — type: `String`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `q` — type: `String`; optional; default: ``

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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/institutions?lang=DEFAULT_LANG&countryCode=SAMPLE_countryCode&refresh=false&page=1&count=20&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/gocardless/requisitions/:requisitionId`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GOCARDLESS.GET_REQUISITION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getRequisition`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoCardlessBankIntegrationController#fetchAccountDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/GoCardlessBankIntegrationController.java:92`
- **Deprecated:** No

Fetch Account Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `reference` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `gocardlessBankIntegrationService.fetchAccountDetails(company, request, language, principal, reference`

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gocardless/requisitions/SAMPLE_reference?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/bank/registration`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#SavePaymentKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#bankRegistration
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:69`
- **Deprecated:** No

Bank Registration

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `ICICICorporateDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountNo` | `String` | NotNull(message = "Account Number can not be null") | unconstrained |
| `corpId` | `String` | not declared | unconstrained |
| `userId` | `String` | not declared | unconstrained |
| `aggrId` | `String` | not declared | unconstrained |
| `urn` | `String` | NotNull(message = "URN can not be null") | unconstrained |
| `aliasId` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `emailIds` | `List<String>` | not declared | unconstrained |
| `userNames` | `List<String>` | not declared | unconstrained |
| `loginId` | `String` | NotNull(message = "Login Id can not be null") | unconstrained |

Example:

```json
{
  "accountNo": "string",
  "corpId": "string",
  "userId": "string",
  "aggrId": "string",
  "urn": "string",
  "aliasId": "string",
  "status": "string",
  "emailIds": [],
  "userNames": [],
  "loginId": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `iciciBankResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "iciciBankResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `BAD_PADDING` | `BadPaddingException` | BadPaddingException raised by controller or shared ExceptionHandler |
| 400 | `CERTIFICATE` | `CertificateException` | CertificateException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_BLOCK_SIZE` | `IllegalBlockSizeException` | IllegalBlockSizeException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY` | `InvalidKeyException` | InvalidKeyException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY_SPEC` | `InvalidKeySpecException` | InvalidKeySpecException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_ALGORITHM` | `NoSuchAlgorithmException` | NoSuchAlgorithmException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_PADDING` | `NoSuchPaddingException` | NoSuchPaddingException raised by controller or shared ExceptionHandler |
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
  "code": "BAD_PADDING",
  "message": "Bad Padding"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/registration?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountNo":"string","corpId":"string","userId":"string","aggrId":"string","urn":"string","aliasId":"string","status":"string","emailIds":[],"userNames":[],"loginId":"string"}'
```

---

### `GET /company/:companyUniqueName/paypal`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYPAL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getPaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#savePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#updatePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#deletePaypalDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PaypalController#getPaypalAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PaypalController.java:53`
- **Deprecated:** No

Get Paypal Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paypalResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paypalResponse"
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
- `body as PaypalDetailsResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/paypal?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/paypal`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYPAL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getPaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#savePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#updatePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#deletePaypalDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PaypalController#addPaypalAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PaypalController.java:44`
- **Deprecated:** No

Add Paypal Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `PaypalUserResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
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
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
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
- `body as PaypalDetailsResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/paypal?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PUT /company/:companyUniqueName/paypal`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYPAL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getPaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#savePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#updatePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#deletePaypalDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PaypalController#updatePaypalAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PaypalController.java:71`
- **Deprecated:** No

Update Paypal Account

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `PaypalUserResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
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
- `body as PaypalDetailsResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/paypal?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/paypal`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYPAL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#getPaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#savePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#updatePaypalDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#deletePaypalDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PaypalController#deletePaypalAccountForCompany
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PaypalController.java:62`
- **Deprecated:** No

Delete Paypal Account For Company

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.paypal.delete"`

```json
{
  "status": "success",
  "body": "success.paypal.delete"
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
- `body as PaypalDetailsResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/paypal?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/payu`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYU_CRUD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#payuCrudOperation`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PayuController#getPayuUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/PayuController.java:55`
- **Deprecated:** No

Get Payu User

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `payuUserResource`

```json
{
  "status": "success",
  "body": {
    "reference": "payuUserResource"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/payu?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/payu`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYU_CRUD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#payuCrudOperation`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PayuController#addPayuUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/PayuController.java:45`
- **Deprecated:** No

Add Payu User

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `JsonNode` (required).

No finite field/value contract is declared by the controller.

Example:

```json
{}
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/payu?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `DELETE /company/:companyUniqueName/payu`

- **Frontend id:** `SETTINGS_INTEGRATION_API.PAYU_CRUD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#payuCrudOperation`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PayuController#deletePayuUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/PayuController.java:64`
- **Deprecated:** No

Delete Payu User

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `deleteMessage`

```json
{
  "status": "success",
  "body": {
    "reference": "deleteMessage"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/payu?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/razorpay`

- **Frontend id:** `SETTINGS_INTEGRATION_API.RAZORPAY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#UpdateRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#DeleteRazorPayDetails`
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
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/razorpay`

- **Frontend id:** `SETTINGS_INTEGRATION_API.RAZORPAY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#UpdateRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#DeleteRazorPayDetails`
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
- `request (echoed by service)`

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

### `PUT /company/:companyUniqueName/razorpay`

- **Frontend id:** `SETTINGS_INTEGRATION_API.RAZORPAY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#UpdateRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#DeleteRazorPayDetails`
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
- `request (echoed by service)`

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

- **Frontend id:** `SETTINGS_INTEGRATION_API.RAZORPAY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#UpdateRazorPayDetails; apps/web-giddh/src/app/services/settings.integration.service.ts#DeleteRazorPayDetails`
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
- `request (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/razorpay?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/bank/deregistration?bankUserId=:bankUserId`

- **Frontend id:** `SETTINGS_INTEGRATION_API.REMOVE_ICICI_REQUEST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#RemoveICICI`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#bankDeRegistration
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:115`
- **Deprecated:** No

Bank De Registration

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `urn` — type: `String`; required
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `iciciBankResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "iciciBankResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `BAD_PADDING` | `BadPaddingException` | BadPaddingException raised by controller or shared ExceptionHandler |
| 400 | `CERTIFICATE` | `CertificateException` | CertificateException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_BLOCK_SIZE` | `IllegalBlockSizeException` | IllegalBlockSizeException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY` | `InvalidKeyException` | InvalidKeyException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_KEY_SPEC` | `InvalidKeySpecException` | InvalidKeySpecException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_ALGORITHM` | `NoSuchAlgorithmException` | NoSuchAlgorithmException raised by controller or shared ExceptionHandler |
| 400 | `NO_SUCH_PADDING` | `NoSuchPaddingException` | NoSuchPaddingException raised by controller or shared ExceptionHandler |
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
  "code": "BAD_PADDING",
  "message": "Bad Padding"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/deregistration?urn=SAMPLE_urn&lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/plaid/create/access-token`

- **Frontend id:** `SETTINGS_INTEGRATION_API.SAVE_PLAID_ACCESS_TOKEN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#savePlaidAccessToken`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PlaidController#setAccessToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PlaidController.java:57`
- **Deprecated:** No

Set Access Token

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `PlaidRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `client_name` | `String` | not declared | unconstrained |
| `country_codes` | `List<String>` | not declared | unconstrained |
| `language` | `String` | not declared | unconstrained |
| `user` | `User` | not declared | unconstrained |
| `products` | `List<String>` | not declared | unconstrained |
| `publicToken` | `String` | not declared | unconstrained |
| `institution` | `Institution` | not declared | unconstrained |
| `accounts` | `List<PlaidAccount>` | not declared | unconstrained |
| `accessToken` | `String` | not declared | unconstrained |
| `startDate` | `String` | not declared | unconstrained |
| `endDate` | `String` | not declared | unconstrained |
| `client_user_id` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `institutionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "client_name": "string",
  "country_codes": [],
  "language": "string",
  "user": "string",
  "products": [],
  "publicToken": "string",
  "institution": "string",
  "accounts": [],
  "accessToken": "string",
  "startDate": "string",
  "endDate": "string",
  "client_user_id": "string",
  "name": "string",
  "institutionId": "string"
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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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
  "code": "INTERRUPTED",
  "message": "Interrupted"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/plaid/create/access-token?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"client_name":"string","country_codes":[],"language":"string","user":"string","products":[],"publicToken":"string","institution":"string","accounts":[],"accessToken":"string","startDate":"string","endDate":"string","client_user_id":"string","name":"string","institutionId":"string"}'
```

---

### `GET /company/:companyUniqueName/sms-key`

- **Frontend id:** `SETTINGS_INTEGRATION_API.SMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetSMSKey; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveSMSKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getSmsVerificationKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:305`
- **Deprecated:** No

Get Sms Verification Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyService.getSmsVerificationKey(principal, company, request`

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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sms-key?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/sms-key`

- **Frontend id:** `SETTINGS_INTEGRATION_API.SMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetSMSKey; apps/web-giddh/src/app/services/settings.integration.service.ts#SaveSMSKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#smsVerificationKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:324`
- **Deprecated:** No

Sms Verification Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `SmsCredentials` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `authKey` | `String` | not declared | unconstrained |
| `senderId` | `String` | not declared | unconstrained |

Example:

```json
{
  "authKey": "string",
  "senderId": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Added Successfully!"`

```json
{
  "status": "success",
  "body": "Added Successfully!"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sms-key?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"authKey":"string","senderId":"string"}'
```

---

### `PUT /v2/company/:companyUniqueName/bank/:bankAccountUniqueName`

- **Frontend id:** `SETTINGS_INTEGRATION_API.UPDATE_ACCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#updateAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#updateBankDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:137`
- **Deprecated:** No

Update Bank Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `bankDetailsUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `ICICICorporateDetailsV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `bankName` | `String` | not declared | unconstrained |
| `accountNumber` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `corpId` | `String` | not declared | unconstrained |
| `bankUserId` | `String` | not declared | unconstrained |
| `aggrId` | `String` | not declared | unconstrained |
| `aggrName` | `String` | not declared | unconstrained |
| `urn` | `String` | not declared | unconstrained |
| `loginId` | `String` | not declared | unconstrained |
| `aliasId` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | NotNull(message = "Unique Name can not be null") | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `maxAmount` | `BigDecimal` | not declared | unconstrained |
| `paymentAlerts` | `List<String>` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "bankName": "string",
  "accountNumber": "string",
  "accountUniqueName": "string",
  "corpId": "string",
  "bankUserId": "string",
  "aggrId": "string",
  "aggrName": "string",
  "urn": "string",
  "loginId": "string",
  "aliasId": "string",
  "uniqueName": "string",
  "duration": "string",
  "maxAmount": 0,
  "paymentAlerts": [],
  "userUniqueName": "string"
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
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `error.login.message.invalidRequest` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankDetailsUniqueName?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"bankName":"string","accountNumber":"string","accountUniqueName":"string","corpId":"string","bankUserId":"string","aggrId":"string","aggrName":"string","urn":"string","loginId":"string","aliasId":"string","uniqueName":"string","duration":"string","maxAmount":0,"paymentAlerts":[],"userUniqueName":"string"}'
```

---

### `PUT /company/:companyUniqueName/bank/updateDetails`

- **Frontend id:** `SETTINGS_INTEGRATION_API.UPDATE_PAYMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#updatePaymentKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#updateDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:93`
- **Deprecated:** No

Update Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `ICICICorporateDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `accountNo` | `String` | NotNull(message = "Account Number can not be null") | unconstrained |
| `corpId` | `String` | not declared | unconstrained |
| `userId` | `String` | not declared | unconstrained |
| `aggrId` | `String` | not declared | unconstrained |
| `urn` | `String` | NotNull(message = "URN can not be null") | unconstrained |
| `aliasId` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `emailIds` | `List<String>` | not declared | unconstrained |
| `userNames` | `List<String>` | not declared | unconstrained |
| `loginId` | `String` | NotNull(message = "Login Id can not be null") | unconstrained |

Example:

```json
{
  "accountNo": "string",
  "corpId": "string",
  "userId": "string",
  "aggrId": "string",
  "urn": "string",
  "aliasId": "string",
  "status": "string",
  "emailIds": [],
  "userNames": [],
  "loginId": "string"
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/updateDetails?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"accountNo":"string","corpId":"string","userId":"string","aggrId":"string","urn":"string","aliasId":"string","status":"string","emailIds":[],"userNames":[],"loginId":"string"}'
```

---

### `PUT /v2/company/:companyUniqueName/bank/:bankAccountUniqueName/payor/:bankUserId`

- **Frontend id:** `SETTINGS_INTEGRATION_API.UPDATE_PAYOR_ACCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#updatePayorAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankControllerV2#updatePayorDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ICICIBankControllerV2.java:245`
- **Deprecated:** No

Update Payor Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `bankDetailsUniqueName` — type: `String`; required
- `urn` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `ICICICorporateDetailsV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `bankName` | `String` | not declared | unconstrained |
| `accountNumber` | `String` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `corpId` | `String` | not declared | unconstrained |
| `bankUserId` | `String` | not declared | unconstrained |
| `aggrId` | `String` | not declared | unconstrained |
| `aggrName` | `String` | not declared | unconstrained |
| `urn` | `String` | not declared | unconstrained |
| `loginId` | `String` | not declared | unconstrained |
| `aliasId` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | NotNull(message = "Unique Name can not be null") | unconstrained |
| `duration` | `String` | not declared | unconstrained |
| `maxAmount` | `BigDecimal` | not declared | unconstrained |
| `paymentAlerts` | `List<String>` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "bankName": "string",
  "accountNumber": "string",
  "accountUniqueName": "string",
  "corpId": "string",
  "bankUserId": "string",
  "aggrId": "string",
  "aggrName": "string",
  "urn": "string",
  "loginId": "string",
  "aliasId": "string",
  "uniqueName": "string",
  "duration": "string",
  "maxAmount": 0,
  "paymentAlerts": [],
  "userUniqueName": "string"
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/bank/SAMPLE_bankDetailsUniqueName/payor/SAMPLE_urn?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"bankName":"string","accountNumber":"string","accountUniqueName":"string","corpId":"string","bankUserId":"string","aggrId":"string","aggrName":"string","urn":"string","loginId":"string","aliasId":"string","uniqueName":"string","duration":"string","maxAmount":0,"paymentAlerts":[],"userUniqueName":"string"}'
```

---

### `POST /company/:companyUniqueName/communication/trigger`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.CREATE_TRIGGERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#createTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:151`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `TriggerDetailsRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `title` | `String` | not declared | unconstrained |
| `condition` | `ConditionRequest` | not declared | unconstrained |
| `communicationPlatform` | `String` | not declared | unconstrained |
| `campaignDetails` | `CampaignDetails` | not declared | unconstrained |

Example:

```json
{
  "title": "string",
  "condition": "string",
  "communicationPlatform": "string",
  "campaignDetails": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.createTrigger(company, triggerDetailsRequest, language, principal`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"title":"string","condition":"string","communicationPlatform":"string","campaignDetails":"string"}'
```

---

### `DELETE /company/:companyUniqueName/communication/platform/:platformUniqueName`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_PLATFORM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#deleteCommunicationPlatform`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#deletePlatform
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:77`
- **Deprecated:** No

Delete Platform

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.msg91.platform.delete", StaticMessageSource.getLanguage(language`

```json
{
  "status": "success",
  "body": "success.msg91.platform.delete"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/platform/SAMPLE_UNIQUE_NAME?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/communication/trigger/:triggerUniqueName`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_TRIGGER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#deleteTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#deleteTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:215`
- **Deprecated:** No

Delete Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `triggerUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.deleteTrigger(company, triggerUniqueName, language`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/campaign/:slug/fields`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_FIELDS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getCampaignFields`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getCampaignFields
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:126`
- **Deprecated:** No

Get Campaign Fields

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `slug` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `campaignFieldsDataObject`

```json
{
  "status": "success",
  "body": {
    "reference": "campaignFieldsDataObject"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/campaign/SAMPLE_slug/fields?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/campaign/list`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getCampaignList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getCampaignList
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:114`
- **Deprecated:** No

Get Campaign List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `campaignList`

```json
{
  "status": "success",
  "body": {
    "reference": "campaignList"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/campaign/list?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/suggestions/:platform/:entity`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_FIELD_SUGGESTIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getFieldSuggestions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getSuggestion
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:227`
- **Deprecated:** No

Get Suggestion

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `platformUniqueName` — type: `String`; required
- `entity` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.getSuggestions(platformUniqueName, entity, language`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/suggestions/SAMPLE_platformUniqueName/SAMPLE_entity?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_PLATFORMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getCommunicationPlatforms`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getPlatform
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:53`
- **Deprecated:** No

Get Platform

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `platformResource`

```json
{
  "status": "success",
  "body": {
    "reference": "platformResource"
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/platform/:platform/trigger/form`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGER_FORM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getTriggerForm`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getForm
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:90`
- **Deprecated:** No

Get Form

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `platformUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `communicationService.getTriggerForm(platformUniqueName, language`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/platform/SAMPLE_platformUniqueName/trigger/form?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/trigger`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getTriggersList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getTriggerList
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:176`
- **Deprecated:** No

Get Trigger List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`
- `page` — type: `int`; optional; default: `1`
- `q` — type: `String`; optional; default: ``
- `count` — type: `int`; optional; default: `20`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.getTriggerList(company, language, page, count, q.trim(`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger?lang=StaticMessageSource.DEFAULT_LANG&page=1&q=&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/communication/trigger/:triggerUniqueName`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS_BY_UNIQUENAME`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#getTriggerByUniqueName`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#getTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:190`
- **Deprecated:** No

Get Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `triggerUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `triggerDetails`

```json
{
  "status": "success",
  "body": {
    "reference": "triggerDetails"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/communication/trigger/:triggerUniqueName`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGER_STATUS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#updateTriggerStatus`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#updatePatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:203`
- **Deprecated:** No

Update Patch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `triggerUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.activateDeactivateTrigger(company, triggerUniqueName, language`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/communication/trigger/:triggerUniqueName`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#updateTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:163`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `triggerUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `TriggerDetailsRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `title` | `String` | not declared | unconstrained |
| `condition` | `ConditionRequest` | not declared | unconstrained |
| `communicationPlatform` | `String` | not declared | unconstrained |
| `campaignDetails` | `CampaignDetails` | not declared | unconstrained |

Example:

```json
{
  "title": "string",
  "condition": "string",
  "communicationPlatform": "string",
  "campaignDetails": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.updateTrigger(company, triggerDetailsRequest, triggerUniqueName, language, principal`

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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/trigger/SAMPLE_triggerUniqueName?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"title":"string","condition":"string","communicationPlatform":"string","campaignDetails":"string"}'
```

---

### `POST /company/:companyUniqueName/communication/platform/verify`

- **Frontend id:** `SETTINGS_INTEGRATION_COMMUNICATION_API.VERIFY_PLATFORM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/campaign.integration.service.ts#verifyCommunicationPlatform`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CommunicationController#verifyAuthKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/CommunicationController.java:65`
- **Deprecated:** No

Verify Auth Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `PlatformVerifyRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `platform` | `Platforms` | not declared | MSG91, GMAIL |
| `authFields` | `List<CommunicationMapping>` | not declared | unconstrained |

Example:

```json
{
  "platform": "MSG91",
  "authFields": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `communicationService.verify(company, principal, verifyRequest, language`

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/communication/platform/verify?lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"platform":"MSG91","authFields":[]}'
```

---

### `POST /company/:companyUniqueName/add-domain`

- **Frontend id:** `SETTINGS_PROFILE_API.ADD_PORTAL_DOMAIN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#addPortalDomain`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PortalWhiteLabelController#addDomain
- **Backend source:** `src/main/java/com/giddh/api/controllers/PortalWhiteLabelController.java:52`
- **Deprecated:** No

Add Domain

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/add-domain?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `POST /company/:companyUniqueName/branch`

- **Frontend id:** `SETTINGS_PROFILE_API.CREATE_BRANCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#createNewBranch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchController#createBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BranchController.java:43`
- **Deprecated:** No

Create Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BranchResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `parentBranchUniqueName` | `String` | not declared | unconstrained |
| `businessType` | `String` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `addresses` | `List<BranchAddressResource>` | not declared | unconstrained |
| `parentBranch` | `BranchResource` | not declared | unconstrained |
| `linkAddresses` | `List<UniqueNameBooleanImpl>` | not declared | unconstrained |
| `warehouseResource` | `List<WarehouseResource>` | not declared | unconstrained |
| `defaultWarehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `isArchived` | `Boolean` | not declared | unconstrained |
| `nodeId` | `String` | not declared | unconstrained |
| `parentNodeId` | `String` | not declared | unconstrained |
| `childBranches` | `List<BranchResource>` | not declared | unconstrained |

Example:

```json
{
  "parentBranchUniqueName": "string",
  "businessType": "string",
  "businessNature": "string",
  "addresses": [],
  "parentBranch": "string",
  "linkAddresses": [],
  "warehouseResource": [],
  "defaultWarehouse": "string",
  "isArchived": false,
  "nodeId": "string",
  "parentNodeId": "string",
  "childBranches": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Branch created successfully."`

```json
{
  "status": "success",
  "body": "Branch created successfully."
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"parentBranchUniqueName":"string","businessType":"string","businessNature":"string","addresses":[],"parentBranch":"string","linkAddresses":[],"warehouseResource":[],"defaultWarehouse":"string","isArchived":false,"nodeId":"string","parentNodeId":"string","childBranches":[]}'
```

---

### `POST /company/:companyUniqueName/address`

- **Frontend id:** `SETTINGS_PROFILE_API.CREATE_NEW_ADDRESS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#createNewAddress`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AddressController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AddressController.java:54`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `CompanyGstAddressResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `county` | `NameCodeImpl` | not declared | unconstrained |
| `branches` | `List<BranchResourceV2>` | not declared | unconstrained |
| `warehouses` | `List<WarehouseResourceV2>` | not declared | unconstrained |
| `linkEntity` | `List<UniqueNameBooleanEntityImpl>` | not declared | unconstrained |

Example:

```json
{
  "county": "string",
  "branches": [],
  "warehouses": [],
  "linkEntity": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `addressService.saveCompanyAddress(company, companyGstAddressResource, principal, request, branch`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"county":"string","branches":[],"warehouses":[],"linkEntity":[]}'
```

---

### `POST /company/:companyUniqueName/warehouse`

- **Frontend id:** `SETTINGS_PROFILE_API.CREATE_NEW_WAREHOUSE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#createNewWarehouse`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: WarehouseController#createWarehouse
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/WarehouseController.java:59`
- **Deprecated:** No

Create Warehouse

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `WarehouseResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `countryCode` | `String` | not declared | unconstrained |
| `currencyCode` | `String` | not declared | unconstrained |
| `stateCode` | `String` | not declared | unconstrained |
| `isDefault` | `boolean` | not declared | unconstrained |
| `callingCode` | `String` | not declared | unconstrained |
| `addresses` | `Set<WarehouseAddressResource>` | not declared | unconstrained |
| `linkAddresses` | `List<UniqueNameBooleanImpl>` | not declared | unconstrained |
| `isArchived` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "countryCode": "string",
  "currencyCode": "string",
  "stateCode": "string",
  "isDefault": false,
  "callingCode": "string",
  "addresses": [],
  "linkAddresses": [],
  "isArchived": false
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `warehouse`

```json
{
  "status": "success",
  "body": {
    "reference": "warehouse"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"countryCode":"string","currencyCode":"string","stateCode":"string","isDefault":false,"callingCode":"string","addresses":[],"linkAddresses":[],"isArchived":false}'
```

---

### `DELETE /company/:companyUniqueName/address/:addressUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.DELETE_ADDRESS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#deleteAddress`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AddressController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AddressController.java:78`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `addressUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `addressService.delete(company, addressUniqueName`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/SAMPLE_addressUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/warehouse/:warehouseUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.EDIT_WAREHOUSE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#updatWarehouseInfo`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: WarehouseController#updateWarehouse
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/WarehouseController.java:85`
- **Deprecated:** No

Update Warehouse

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `warehouseUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `WarehouseResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `countryCode` | `String` | not declared | unconstrained |
| `currencyCode` | `String` | not declared | unconstrained |
| `stateCode` | `String` | not declared | unconstrained |
| `isDefault` | `boolean` | not declared | unconstrained |
| `callingCode` | `String` | not declared | unconstrained |
| `addresses` | `Set<WarehouseAddressResource>` | not declared | unconstrained |
| `linkAddresses` | `List<UniqueNameBooleanImpl>` | not declared | unconstrained |
| `isArchived` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "countryCode": "string",
  "currencyCode": "string",
  "stateCode": "string",
  "isDefault": false,
  "callingCode": "string",
  "addresses": [],
  "linkAddresses": [],
  "isArchived": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `warehouse`

```json
{
  "status": "success",
  "body": {
    "reference": "warehouse"
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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"countryCode":"string","currencyCode":"string","stateCode":"string","isDefault":false,"callingCode":"string","addresses":[],"linkAddresses":[],"isArchived":false}'
```

---

### `GET /company/:companyUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#GetProfileInfo; apps/web-giddh/src/app/services/settings.profile.service.ts#UpdateProfile; apps/web-giddh/src/app/services/settings.profile.service.ts#PatchProfile; apps/web-giddh/src/app/services/settings.profile.service.ts#GetInventoryInfo; apps/web-giddh/src/app/services/settings.profile.service.ts#UpdateInventory; apps/web-giddh/src/app/services/settings.profile.service.ts#getCompanyDetails`
- **Method evidence:** actual frontend HTTP call
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
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43?source=APP' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#GetProfileInfo; apps/web-giddh/src/app/services/settings.profile.service.ts#UpdateProfile; apps/web-giddh/src/app/services/settings.profile.service.ts#PatchProfile; apps/web-giddh/src/app/services/settings.profile.service.ts#GetInventoryInfo; apps/web-giddh/src/app/services/settings.profile.service.ts#UpdateInventory; apps/web-giddh/src/app/services/settings.profile.service.ts#getCompanyDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#updateCompany
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:170`
- **Deprecated:** No

Update Company

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CompanyResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `subscriptionRequest` | `SubscriptionRequest` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `businessType` | `String` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `userBillingDetails` | `UserBillingDetailsResource` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `industry` | `String` | not declared | unconstrained |
| `prevSoft` | `String` | not declared | unconstrained |
| `phoneCode` | `String` | not declared | unconstrained |
| `headQuarterAlias` | `String` | not declared | unconstrained |
| `permission` | `List<RoleV2AssignModel>` | not declared | unconstrained |
| `creatorSuperAdmin` | `boolean` | not declared | unconstrained |
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `lut` | `String` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `ref` | `String` | not declared | unconstrained |

Example:

```json
{
  "subscriptionRequest": "string",
  "businessNature": "string",
  "businessType": "string",
  "taxes": [],
  "userBillingDetails": "string",
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "industry": "string",
  "prevSoft": "string",
  "phoneCode": "string",
  "headQuarterAlias": "string",
  "permission": [],
  "creatorSuperAdmin": false,
  "fromDate": "string",
  "toDate": "string",
  "lut": "string",
  "ledgerView": "T_VIEW",
  "ref": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.company.updated"`

```json
{
  "status": "success",
  "body": "success.company.updated"
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
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"subscriptionRequest":"string","businessNature":"string","businessType":"string","taxes":[],"userBillingDetails":"string","paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","industry":"string","prevSoft":"string","phoneCode":"string","headQuarterAlias":"string","permission":[],"creatorSuperAdmin":false,"fromDate":"string","toDate":"string","lut":"string","ledgerView":"T_VIEW","ref":"string"}'
```

---

### `PATCH /company/:companyUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#GetProfileInfo; apps/web-giddh/src/app/services/settings.profile.service.ts#UpdateProfile; apps/web-giddh/src/app/services/settings.profile.service.ts#PatchProfile; apps/web-giddh/src/app/services/settings.profile.service.ts#GetInventoryInfo; apps/web-giddh/src/app/services/settings.profile.service.ts#UpdateInventory; apps/web-giddh/src/app/services/settings.profile.service.ts#getCompanyDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#updateCompanyV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:181`
- **Deprecated:** No

Update Company V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CompanyResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `subscriptionRequest` | `SubscriptionRequest` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `businessType` | `String` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `userBillingDetails` | `UserBillingDetailsResource` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `industry` | `String` | not declared | unconstrained |
| `prevSoft` | `String` | not declared | unconstrained |
| `phoneCode` | `String` | not declared | unconstrained |
| `headQuarterAlias` | `String` | not declared | unconstrained |
| `permission` | `List<RoleV2AssignModel>` | not declared | unconstrained |
| `creatorSuperAdmin` | `boolean` | not declared | unconstrained |
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `lut` | `String` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `ref` | `String` | not declared | unconstrained |

Example:

```json
{
  "subscriptionRequest": "string",
  "businessNature": "string",
  "businessType": "string",
  "taxes": [],
  "userBillingDetails": "string",
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "industry": "string",
  "prevSoft": "string",
  "phoneCode": "string",
  "headQuarterAlias": "string",
  "permission": [],
  "creatorSuperAdmin": false,
  "fromDate": "string",
  "toDate": "string",
  "lut": "string",
  "ledgerView": "T_VIEW",
  "ref": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.company.updated"`

```json
{
  "status": "success",
  "body": "success.company.updated"
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
- `body as SmsKeyClass`
- `queryString (echoed by service)`
- `request (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"subscriptionRequest":"string","businessNature":"string","businessType":"string","taxes":[],"userBillingDetails":"string","paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","industry":"string","prevSoft":"string","phoneCode":"string","headQuarterAlias":"string","permission":[],"creatorSuperAdmin":false,"fromDate":"string","toDate":"string","lut":"string","ledgerView":"T_VIEW","ref":"string"}'
```

---

### `GET /company/:companyUniqueName/branch/:branchUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_BRANCH_INFO`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getBranchInfo`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchController#getBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BranchController.java:66`
- **Deprecated:** No

Get Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `branchUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `branchService.getBranchWithWarehouse(company, branchUniqueName`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch/aaaa?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/address/all`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getCompanyAddresses`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AddressController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AddressController.java:87`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Controller-backed request payload

Type: `CompanyGstAddressFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `address` | `String` | not declared | unconstrained |
| `state` | `String` | not declared | unconstrained |
| `pincode` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "address": "string",
  "state": "string",
  "pincode": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `addressService.getAll(company, filter, page, count`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/all?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","address":"string","state":"string","pincode":"string"}'
```

---

### `POST /company/:companyUniqueName/address/all`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getCompanyAddresses`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AddressController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AddressController.java:87`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Controller-backed request payload

Type: `CompanyGstAddressFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `address` | `String` | not declared | unconstrained |
| `state` | `String` | not declared | unconstrained |
| `pincode` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "address": "string",
  "state": "string",
  "pincode": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `addressService.getAll(company, filter, page, count`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/all?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","address":"string","state":"string","pincode":"string"}'
```

---

### `GET /company/:companyUniqueName/get-domain-list`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_DOMAIN_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getDomainList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PortalWhiteLabelController#getDomains
- **Backend source:** `src/main/java/com/giddh/api/controllers/PortalWhiteLabelController.java:94`
- **Deprecated:** No

/

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `domainUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `portalService.getDomains(company, domainUniqueName`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/get-domain-list?domainUniqueName=SAMPLE_domainUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/get-domain-list?domainUniqueName=:domainUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_DOMAIN_LIST_DATA`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getDomainListTableData`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PortalWhiteLabelController#getDomains
- **Backend source:** `src/main/java/com/giddh/api/controllers/PortalWhiteLabelController.java:94`
- **Deprecated:** No

/

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `domainUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `portalService.getDomains(company, domainUniqueName`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/get-domain-list?domainUniqueName=SAMPLE_domainUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/sources`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_LINKED_ENTITIES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getAllLinkedEntities`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getSources
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:625`
- **Deprecated:** No

Get Sources

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companySources`

```json
{
  "status": "success",
  "body": {
    "reference": "companySources"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/sources?q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/export-settings`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_UPDATE_MODULE_EXPORT_SETTING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getModuleExportSetting; apps/web-giddh/src/app/services/settings.profile.service.ts#updateModuleExportSetting`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanySettingsController#getAllExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanySettingsController.java:116`
- **Deprecated:** No

Get All Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `exportSettingResponses`

```json
{
  "status": "success",
  "body": {
    "reference": "exportSettingResponses"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/export-settings`

- **Frontend id:** `SETTINGS_PROFILE_API.GET_UPDATE_MODULE_EXPORT_SETTING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#getModuleExportSetting; apps/web-giddh/src/app/services/settings.profile.service.ts#updateModuleExportSetting`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanySettingsController#updateExportSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanySettingsController.java:126`
- **Deprecated:** No

Update Export Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `ExportSettingRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `exportName` | `String` | not declared | unconstrained |
| `format` | `String` | not declared | unconstrained |

Example:

```json
{
  "exportName": "string",
  "format": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `messgae`

```json
{
  "status": "success",
  "body": {
    "reference": "messgae"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/export-settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"exportName":"string","format":"string"}'
```

---

### `PATCH /company/:companyUniqueName/domain/:domainUniqueName?operation=:operation`

- **Frontend id:** `SETTINGS_PROFILE_API.PRIMARY_DELETE_DOMAIN_SET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#setPrimaryDeleteDomain`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PortalWhiteLabelController#updateDomain
- **Backend source:** `src/main/java/com/giddh/api/controllers/PortalWhiteLabelController.java:112`
- **Deprecated:** No

/

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `domainUniqueName` — type: `String`; required
**Query parameters**
- `operation` — type: `String`; required

#### Controller-backed request payload

None.

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/domain/SAMPLE_domainUniqueName?operation=SAMPLE_operation&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/domain/:domainUniqueName/share`

- **Frontend id:** `SETTINGS_PROFILE_API.SHARE_PORTAL_DOMAIN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#sharedDomainEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PortalWhiteLabelController#shareDomain
- **Backend source:** `src/main/java/com/giddh/api/controllers/PortalWhiteLabelController.java:133`
- **Deprecated:** No

Share Domain

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `domainUniqueName` — type: `String`; required

#### Controller-backed request payload

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/domain/SAMPLE_domainUniqueName/share?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `POST /v2/subscription/charge/:subscriptionId`

- **Frontend id:** `SETTINGS_PROFILE_API.SUBSCRIPTION_CHARGE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#updateSubscriptionPayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#chargeSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:212`
- **Deprecated:** No

Charge Subscription

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

Type: `CompanyResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `subscriptionRequest` | `SubscriptionRequest` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `businessType` | `String` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `userBillingDetails` | `UserBillingDetailsResource` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `industry` | `String` | not declared | unconstrained |
| `prevSoft` | `String` | not declared | unconstrained |
| `phoneCode` | `String` | not declared | unconstrained |
| `headQuarterAlias` | `String` | not declared | unconstrained |
| `permission` | `List<RoleV2AssignModel>` | not declared | unconstrained |
| `creatorSuperAdmin` | `boolean` | not declared | unconstrained |
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `lut` | `String` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `ref` | `String` | not declared | unconstrained |

Example:

```json
{
  "subscriptionRequest": "string",
  "businessNature": "string",
  "businessType": "string",
  "taxes": [],
  "userBillingDetails": "string",
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "industry": "string",
  "prevSoft": "string",
  "phoneCode": "string",
  "headQuarterAlias": "string",
  "permission": [],
  "creatorSuperAdmin": false,
  "fromDate": "string",
  "toDate": "string",
  "lut": "string",
  "ledgerView": "T_VIEW",
  "ref": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/charge/SAMPLE_subscriptionId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"subscriptionRequest":"string","businessNature":"string","businessType":"string","taxes":[],"userBillingDetails":"string","paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","industry":"string","prevSoft":"string","phoneCode":"string","headQuarterAlias":"string","permission":[],"creatorSuperAdmin":false,"fromDate":"string","toDate":"string","lut":"string","ledgerView":"T_VIEW","ref":"string"}'
```

---

### `PUT /company/:companyUniqueName/address/:addressUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.UPDATE_ADDRESS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#updateAddress`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: AddressController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/AddressController.java:66`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `addressUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `CompanyGstAddressResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `county` | `NameCodeImpl` | not declared | unconstrained |
| `branches` | `List<BranchResourceV2>` | not declared | unconstrained |
| `warehouses` | `List<WarehouseResourceV2>` | not declared | unconstrained |
| `linkEntity` | `List<UniqueNameBooleanEntityImpl>` | not declared | unconstrained |

Example:

```json
{
  "county": "string",
  "branches": [],
  "warehouses": [],
  "linkEntity": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `addressService.update(company, addressUniqueName, companyGstAddressResource, principal, request, branch`

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
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/address/SAMPLE_addressUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"county":"string","branches":[],"warehouses":[],"linkEntity":[]}'
```

---

### `PUT /company/:companyUniqueName/branch/:branchUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.UPDATE_BRANCH_INFO`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#updateBranchInfo`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchController#updateBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BranchController.java:76`
- **Deprecated:** No

Update Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `branchUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BranchResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `parentBranchUniqueName` | `String` | not declared | unconstrained |
| `businessType` | `String` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `addresses` | `List<BranchAddressResource>` | not declared | unconstrained |
| `parentBranch` | `BranchResource` | not declared | unconstrained |
| `linkAddresses` | `List<UniqueNameBooleanImpl>` | not declared | unconstrained |
| `warehouseResource` | `List<WarehouseResource>` | not declared | unconstrained |
| `defaultWarehouse` | `NameUniqueNameImpl` | not declared | unconstrained |
| `isArchived` | `Boolean` | not declared | unconstrained |
| `nodeId` | `String` | not declared | unconstrained |
| `parentNodeId` | `String` | not declared | unconstrained |
| `childBranches` | `List<BranchResource>` | not declared | unconstrained |

Example:

```json
{
  "parentBranchUniqueName": "string",
  "businessType": "string",
  "businessNature": "string",
  "addresses": [],
  "parentBranch": "string",
  "linkAddresses": [],
  "warehouseResource": [],
  "defaultWarehouse": "string",
  "isArchived": false,
  "nodeId": "string",
  "parentNodeId": "string",
  "childBranches": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `branchService.updateBranch(company, branchUniqueName, branchResource, principal`

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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch/aaaa?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"parentBranchUniqueName":"string","businessType":"string","businessNature":"string","addresses":[],"parentBranch":"string","linkAddresses":[],"warehouseResource":[],"defaultWarehouse":"string","isArchived":false,"nodeId":"string","parentNodeId":"string","childBranches":[]}'
```

---

### `PATCH /company/:companyUniqueName/plan`

- **Frontend id:** `SETTINGS_PROFILE_API.UPDATE_COMPANY_PLAN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#PatchProfile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#updateCompanyPlan
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:193`
- **Deprecated:** No

Update Company Plan

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CompanyResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `subscriptionRequest` | `SubscriptionRequest` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `businessType` | `String` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `userBillingDetails` | `UserBillingDetailsResource` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `industry` | `String` | not declared | unconstrained |
| `prevSoft` | `String` | not declared | unconstrained |
| `phoneCode` | `String` | not declared | unconstrained |
| `headQuarterAlias` | `String` | not declared | unconstrained |
| `permission` | `List<RoleV2AssignModel>` | not declared | unconstrained |
| `creatorSuperAdmin` | `boolean` | not declared | unconstrained |
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `lut` | `String` | not declared | unconstrained |
| `ledgerView` | `LedgerView` | not declared | T_VIEW, STATEMENT_VIEW |
| `ref` | `String` | not declared | unconstrained |

Example:

```json
{
  "subscriptionRequest": "string",
  "businessNature": "string",
  "businessType": "string",
  "taxes": [],
  "userBillingDetails": "string",
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "industry": "string",
  "prevSoft": "string",
  "phoneCode": "string",
  "headQuarterAlias": "string",
  "permission": [],
  "creatorSuperAdmin": false,
  "fromDate": "string",
  "toDate": "string",
  "lut": "string",
  "ledgerView": "T_VIEW",
  "ref": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyResourceV2`

```json
{
  "status": "success",
  "body": {
    "reference": "companyResourceV2"
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
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/plan' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"subscriptionRequest":"string","businessNature":"string","businessType":"string","taxes":[],"userBillingDetails":"string","paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","industry":"string","prevSoft":"string","phoneCode":"string","headQuarterAlias":"string","permission":[],"creatorSuperAdmin":false,"fromDate":"string","toDate":"string","lut":"string","ledgerView":"T_VIEW","ref":"string"}'
```

---

### `GET /company/:companyUniqueName/verify-domain?domainUniqueName=:domainUniqueName`

- **Frontend id:** `SETTINGS_PROFILE_API.VERIFY_PORTAL_WHITE_LABEL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.profile.service.ts#verifyPortalWhilteLabel`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PortalWhiteLabelController#verifyDomain
- **Backend source:** `src/main/java/com/giddh/api/controllers/PortalWhiteLabelController.java:74`
- **Deprecated:** No

Verify Domain

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `domainUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Verification in progress"`

```json
{
  "status": "success",
  "body": "Verification in progress"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/verify-domain?domainUniqueName=SAMPLE_domainUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/tags`

- **Frontend id:** `SETTINGS_TAG_API.CREATE_TAG`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.tag.service.ts#CreateTag`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TagController#createTag
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TagController.java:35`
- **Deprecated:** No

Create Tag

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TagResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `tagService.addNewTag(principal, company, entityTagResource, request`

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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |

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
- `body as TagRequest`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/tags/:tagUniqueName`

- **Frontend id:** `SETTINGS_TAG_API.DELETE_TAG`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.tag.service.ts#DeleteTag`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TagController#deleteTag
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TagController.java:69`
- **Deprecated:** No

Delete Tag

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `tagUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Deleted Successfully!"`

```json
{
  "status": "success",
  "body": "Deleted Successfully!"
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
- `body as TagRequest`
- `request (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags/SAMPLE_tagUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/tags`

- **Frontend id:** `SETTINGS_TAG_API.GET_ALL_TAGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.tag.service.ts#GetAllTags`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TagController#getAllTags
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TagController.java:62`
- **Deprecated:** No

Get All Tags

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `tagService.getAllTagsOfCompany(principal, company, request`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/tags/:tagUniqueName`

- **Frontend id:** `SETTINGS_TAG_API.UPDATE_TAG`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.tag.service.ts#UpdateTag`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TagController#updateTag
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TagController.java:53`
- **Deprecated:** No

Update Tag

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `tagUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TagResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `tagService.updateTag(principal, company, tagUniqueName, entityTagResource, request`

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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |

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
- `body as TagRequest`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tags/SAMPLE_tagUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/triggers/:triggerUniqueName`

- **Frontend id:** `TRIGGER_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.triggers.service.ts#DeleteTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerController#deleteTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TriggerController.java:94`
- **Deprecated:** No

Delete Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `triggerUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Trigger deleted successfully. "`

```json
{
  "status": "success",
  "body": "Trigger deleted successfully. "
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/triggers`

- **Frontend id:** `TRIGGER_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.triggers.service.ts#GetTriggers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerController#getAllTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TriggerController.java:82`
- **Deprecated:** No

Get All Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `fetchedTriggers`

```json
{
  "status": "success",
  "body": {
    "reference": "fetchedTriggers"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/triggers`

- **Frontend id:** `TRIGGER_API.POST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.triggers.service.ts#CreateTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerController#createTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TriggerController.java:42`
- **Deprecated:** No

Create Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TriggerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `scope` | `String` | not declared | unconstrained |
| `filter` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `url` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "description": "string",
  "entity": "string",
  "entityUniqueName": "string",
  "scope": "string",
  "filter": "string",
  "value": "string",
  "action": "string",
  "url": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `trigger`

```json
{
  "status": "success",
  "body": {
    "reference": "trigger"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","description":"string","entity":"string","entityUniqueName":"string","scope":"string","filter":"string","value":"string","action":"string","url":"string"}'
```

---

### `PUT /company/:companyUniqueName/triggers/:triggerUniqueName`

- **Frontend id:** `TRIGGER_API.PUT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.triggers.service.ts#UpdateTrigger`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TriggerController#updateTrigger
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TriggerController.java:55`
- **Deprecated:** No

Update Trigger

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `triggerUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TriggerRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `scope` | `String` | not declared | unconstrained |
| `filter` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `action` | `String` | not declared | unconstrained |
| `url` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "description": "string",
  "entity": "string",
  "entityUniqueName": "string",
  "scope": "string",
  "filter": "string",
  "value": "string",
  "action": "string",
  "url": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `updatedTrigger`

```json
{
  "status": "success",
  "body": {
    "reference": "updatedTrigger"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |

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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/triggers/SAMPLE_triggerUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","description":"string","entity":"string","entityUniqueName":"string","scope":"string","filter":"string","value":"string","action":"string","url":"string"}'
```

