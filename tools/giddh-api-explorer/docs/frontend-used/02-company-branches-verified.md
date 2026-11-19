# Backend-Verified Frontend APIs: 02-company-branches.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/bank/payments`

- **Frontend id:** `COMPANY_API.BULK_PAYMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#bulkVendorPayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#bulkPayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:236`
- **Deprecated:** No

Bulk Payment

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `BankPaymentRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `bankPaymentTransactions` | `List<BankPaymentTransactionRequest>` | NotEmpty(message = "Transactions cannot be empty.") | unconstrained |
| `bankName` | `String` | NotBlank(message = "Bank name cannot be empty.") | unconstrained |
| `urn` | `String` | NotBlank(message = "URN cannot be empty.") | unconstrained |
| `uniqueName` | `String` | NotBlank(message = "UniqueName cannot be empty.") | unconstrained |

Example:

```json
{
  "bankPaymentTransactions": [],
  "bankName": "string",
  "urn": "string",
  "uniqueName": "string"
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
- `body as BulkPaymentResponse`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/payments?lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"bankPaymentTransactions":[],"bankName":"string","urn":"string","uniqueName":"string"}'
```

---

### `POST /company/:companyUniqueName/bank/payments/confirm?urn=:urn&uniqueName=:uniqueName`

- **Frontend id:** `COMPANY_API.BULK_PAYMENT_CONFIRM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#bulkVendorPaymentConfirm`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#bulkPaymentConfirm
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:281`
- **Deprecated:** No

API : confirm payment with OTP and sent to bank for payment

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `urn` — type: `String`; required
- `uniqueName` — type: `String`; required
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

Type: `OtpSentResponse` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `success` | `boolean` | not declared | unconstrained |
| `message` | `String` | not declared | unconstrained |
| `requestId` | `String` | NotBlank(message = "Request Id cannot be empty.") | unconstrained |
| `otp` | `String` | NotBlank(message = "OTP cannot be empty.") | unconstrained |
| `token` | `String` | Size(max = 20, message = "Token cannot contain more than 20 characters.") | unconstrained |

Example:

```json
{
  "success": false,
  "message": "string",
  "requestId": "string",
  "otp": "string",
  "token": "string"
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
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `error.code.notPermitted` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `body as BulkPaymentResponse`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/payments/confirm?urn=SAMPLE_urn&uniqueName=SAMPLE_UNIQUE_NAME&lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"success":false,"message":"string","requestId":"string","otp":"string","token":"string"}'
```

---

### `GET /company/:companyUniqueName/bank/resend-otp?urn=:urn&uniqueName=:uniqueName&requestId=:requestId`

- **Frontend id:** `COMPANY_API.BULK_PAYMENT_RESEND_OTP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#resendOtp`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#resendOTP
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:354`
- **Deprecated:** No

API : resent OTP to user

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `urn` — type: `String`; required
- `uniqueName` — type: `String`; required
- `requestId` — type: `String`; required
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/resend-otp?urn=SAMPLE_urn&uniqueName=SAMPLE_UNIQUE_NAME&requestId=SAMPLE_requestId&lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /business-nature`

- **Frontend id:** `COMPANY_API.BUSINESS_NATURE_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#GetAllBusinessNatureList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: MainController#getBusinessNature
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:261`
- **Deprecated:** No

API to get all Business Nature

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `businessNature`

```json
{
  "status": "success",
  "body": {
    "reference": "businessNature"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/business-nature' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /users/:uniqueName/v2/companies`

- **Frontend id:** `COMPANY_API.COMPANY_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#CompanyList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#getAllCompaniesV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:166`
- **Deprecated:** No

Get All Companies V3

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyResources`

```json
{
  "status": "success",
  "body": {
    "reference": "companyResources"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Un Authorize"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as CompanyResponse[]`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/v2/companies' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company`

- **Frontend id:** `COMPANY_API.CREATE_COMPANY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#CreateNewCompany`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:128`
- **Deprecated:** No

Create

#### Inputs



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

- HTTP status: `201 CREATED` (live capture also observed `200` with same envelope)
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new CompanyResourceV2(company`
- **Live capture (2026-10-22):** company `giddhain1792673422178091xos` — full JSON in [`docs/api/live-captures/giddh-automation-api-doc/responses/00-create-company.json`](../live-captures/giddh-automation-api-doc/responses/00-create-company.json)

```json
{
  "status": "success",
  "body": {
    "planVersion": 2,
    "name": "Giddh Automation API DOC",
    "address": "My new address",
    "country": "India",
    "subscription": {
      "subscriptionId": "SUB-20261022-5",
      "status": "active",
      "planDetails": {
        "name": "WhiteLabelPlan",
        "uniqueName": "ltv1768484147685",
        "currency": { "code": "INR", "symbol": "₹" }
      }
    },
    "contactNo": "919111525164",
    "voucherVersion": 2,
    "uniqueName": "giddhain1792673422178091xos",
    "baseCurrency": "INR",
    "addresses": [
      {
        "name": "Default Address",
        "address": "My new address",
        "taxNumber": "23AAACC1206D2ZN",
        "pincode": "484224",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "isDefault": true,
        "taxType": "GSTIN",
        "uniqueName": "8rz1792673422372"
      }
    ],
    "businessNature": "Retail",
    "businessType": "Registered",
    "archiveStatus": "UNARCHIVED",
    "ledgerView": "T_VIEW",
    "financialYears": [
      {
        "financialYearStarts": "01-04-2026",
        "financialYearEnds": "31-03-2027",
        "isLocked": false,
        "uniqueName": "FY-APR2026-MAR2027"
      }
    ],
    "portalDomain": "GiddhAutomationAPIDOC",
    "baseCurrencySymbol": "₹",
    "countryV2": {
      "alpha2CountryCode": "IN",
      "countryName": "India",
      "currency": { "code": "INR", "symbol": "₹" },
      "india": true
    }
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `DATE_PARSE` | `DateParseException` | DateParseException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JIO_GST` | `JioGstException` | JioGstException raised by controller or shared ExceptionHandler |
| 400 | `NO_PERMISSION` | `NoPermissionException` | NoPermissionException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
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
- `body as CompanyResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"subscriptionRequest":"string","businessNature":"string","businessType":"string","taxes":[],"userBillingDetails":"string","paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","industry":"string","prevSoft":"string","phoneCode":"string","headQuarterAlias":"string","permission":[],"creatorSuperAdmin":false,"fromDate":"string","toDate":"string","lut":"string","ledgerView":"T_VIEW","ref":"string"}'
```

---

### `POST /company/:companyUniqueName/branch`

- **Frontend id:** `COMPANY_API.CREATE_NEW_BRANCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#createNewBranch; apps/web-giddh/src/app/services/company.service.ts#updateBranch`
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

### `POST /company/:companyUniqueName/tax/authority`

- **Frontend id:** `COMPANY_API.CREATE_TAX_AUTHORITY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#createTaxAuthority`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#createTaxAuthority
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:107`
- **Deprecated:** No

Create Tax Authority

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TaxAuthorityRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `stateCode` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "stateCode": "string",
  "uniqueName": "string",
  "description": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","stateCode":"string","uniqueName":"string","description":"string"}'
```

---

### `DELETE /company/:companyUniqueName/tax/authority/:uniqueName`

- **Frontend id:** `COMPANY_API.DELETE_TAX_AUTHORITY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#deleteTaxAuthority`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#deleteTaxAuthority
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:138`
- **Deprecated:** No

Delete Tax Authority

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `taxAuthorityUniqueName` — type: `String`; required

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority/SAMPLE_taxAuthorityUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/groups/:groupUniqueName/download-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `COMPANY_API.DOWNLOAD_CSV`
- **Frontend evidence:** `company.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: GroupV2Controller#downloadAccountBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:109`
- **Deprecated:** No

Download Account Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `format` — type: `String`; optional; default: `xlsx`
- `from` — type: `String`; required
- `to` — type: `String`; required

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/download-account-closing-balance?branchUniqueName=aaaa&format=xlsx&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"openingBalance":0,"openingBalanceType":"string","openingBalanceGreaterThan":false,"openingBalanceLessThan":false,"openingBalanceEqual":false,"openingBalanceNotEqual":false,"closingBalance":0,"closingBalanceType":"string","closingBalanceGreaterThan":false,"closingBalanceLessThan":false,"closingBalanceEqual":false,"closingBalanceNotEqual":false,"creditTotal":0,"creditTotalGreaterThan":false,"creditTotalLessThan":false,"creditTotalEqual":false,"creditTotalNotEqual":false,"debitTotal":0,"debitTotalGreaterThan":false,"debitTotalLessThan":false,"debitTotalEqual":false,"debitTotalNotEqual":false,"sort":"string","sortBy":"string","sortType":"string","message":"string","accounts":[],"subject":"string","includeParentGroup":false,"includeMobileNumber":false,"includeEmailId":false,"includeState":false,"includeTaxNumber":false}'
```

---

### `POST /v2/company/:companyUniqueName/groups/:groupUniqueName/download-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `COMPANY_API.DOWNLOAD_XLSX`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#downloadXlsx`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#downloadAccountBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:109`
- **Deprecated:** No

Download Account Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `format` — type: `String`; optional; default: `xlsx`
- `from` — type: `String`; required
- `to` — type: `String`; required

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
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/download-account-closing-balance?branchUniqueName=aaaa&format=xlsx&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"openingBalance":0,"openingBalanceType":"string","openingBalanceGreaterThan":false,"openingBalanceLessThan":false,"openingBalanceEqual":false,"openingBalanceNotEqual":false,"closingBalance":0,"closingBalanceType":"string","closingBalanceGreaterThan":false,"closingBalanceLessThan":false,"closingBalanceEqual":false,"closingBalanceNotEqual":false,"creditTotal":0,"creditTotalGreaterThan":false,"creditTotalLessThan":false,"creditTotalEqual":false,"creditTotalNotEqual":false,"debitTotal":0,"debitTotalGreaterThan":false,"debitTotalLessThan":false,"debitTotalEqual":false,"debitTotalNotEqual":false,"sort":"string","sortBy":"string","sortType":"string","message":"string","accounts":[],"subject":"string","includeParentGroup":false,"includeMobileNumber":false,"includeEmailId":false,"includeState":false,"includeTaxNumber":false}'
```

---

### `GET /company/:companyUniqueName/us/export-sales-report-account-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName&taxUniqueName=:taxUniqueName`

- **Frontend id:** `COMPANY_API.EXPORT_SALES_ACCOUNT_WISE_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getExportSaleTaxReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: USVatReturnController#downloadVatReportAccountWise
- **Backend source:** `src/main/java/com/giddh/api/controllers/USVatReturnController.java:162`
- **Deprecated:** No

Download Vat Report Account Wise

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `taxAuthorityUniqueName` — type: `String`; optional
- `taxUniqueName` — type: `String`; optional
- `taxAuthorityQuery` — type: `String`; optional
- `taxQuery` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.export.background"`

```json
{
  "status": "success",
  "body": "success.export.background"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/export-sales-report-account-wise?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&taxUniqueName=SAMPLE_taxUniqueName&taxAuthorityQuery=SAMPLE_taxAuthorityQuery&taxQuery=SAMPLE_taxQuery' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/us/export-sales-report-authority-wise?from=:from&to=:to&taxNumber=:taxNumber`

- **Frontend id:** `COMPANY_API.EXPORT_SALES_TAX_AUTHORITY_WISE_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getExportSaleTaxReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: USVatReturnController#downloadVatReportTaxAuthorityWise
- **Backend source:** `src/main/java/com/giddh/api/controllers/USVatReturnController.java:44`
- **Deprecated:** No

Download Vat Report Tax Authority Wise

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
- Body evidence: `StaticMessageSource.getMessage("success.export.background"`

```json
{
  "status": "success",
  "body": "success.export.background"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/export-sales-report-authority-wise?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/us/export-sales-report-tax-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName`

- **Frontend id:** `COMPANY_API.EXPORT_SALES_TAX_WISE_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getExportSaleTaxReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: USVatReturnController#downloadVatReportTaxWise
- **Backend source:** `src/main/java/com/giddh/api/controllers/USVatReturnController.java:112`
- **Deprecated:** No

Download Vat Report Tax Wise

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `taxNumber` — type: `String`; required
- `taxAuthorityUniqueName` — type: `String`; optional
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.export.background"`

```json
{
  "status": "success",
  "body": "success.export.background"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/export-sales-report-tax-wise?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /country/company/:companyUniqueName/account-countries`

- **Frontend id:** `COMPANY_API.GET_ACCOUNT_COUNTRIES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getAccountCountries`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CountryAndStateController#getAccountCountriesByCompany
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/CountryAndStateController.java:94`
- **Deprecated:** No

Get Account Countries By Company

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `accountCountries`

```json
{
  "status": "success",
  "body": {
    "reference": "accountCountries"
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
- `body as any[]`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/country/company/dcrcdiin17887749442630bsy43/account-countries?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/branch?hierarchyType=:hierarchyType`

- **Frontend id:** `COMPANY_API.GET_ALL_BRANCHES`
- **Frontend evidence:** `company.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: BranchController#getAllBranches
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BranchController.java:55`
- **Deprecated:** No

Get All Branches

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `includeArchived` — type: `boolean`; optional; default: `true`
- `hierarchyType` — type: `String`; optional; default: `flatten`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `Object (not statically resolved)`
- **Live capture (2026-10-22):** [`docs/api/live-captures/giddh-automation-api-doc/responses/01-branch-flatten.json`](../live-captures/giddh-automation-api-doc/responses/01-branch-flatten.json)

```json
{
  "status": "success",
  "body": [
    {
      "businessType": "Registered",
      "businessNature": "Retail",
      "uniqueName": "giddhautomationapidoc",
      "alias": "Gidd",
      "defaultBranch": true,
      "taxType": "GSTIN",
      "consolidatedBranch": false,
      "isArchived": false,
      "addresses": [
        {
          "name": "Default Address",
          "taxNumber": "23AAACC1206D2ZN",
          "stateCode": "MP",
          "uniqueName": "8rz1792673422372",
          "isDefault": true,
          "taxType": "GSTIN"
        }
      ],
      "warehouseResource": [
        {
          "name": "Gidd warehouse",
          "uniqueName": "xbq1792673424418",
          "isDefault": true,
          "countryCode": "IN",
          "currencyCode": "INR"
        }
      ]
    }
  ]
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
  --url 'https://api.giddh.com/company/giddhain1792673422178091xos/branch?hierarchyType=flatten' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /country/:country`

- **Frontend id:** `COMPANY_API.GET_ALL_STATES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getAllStates`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CountryAndStateController#getCountryAndStateData
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/CountryAndStateController.java:72`
- **Deprecated:** No

This function is used to get country list.

#### Inputs

**Path parameters**
- `countryCode` — type: `String`; required
**Query parameters**
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyAndStateDetails`

```json
{
  "status": "success",
  "body": {
    "reference": "companyAndStateDetails"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/country/SAMPLE_countryCode?refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/tax/authority`

- **Frontend id:** `COMPANY_API.GET_ALL_TAX_AUTHORITIES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getTaxAuthorityList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#getAllTaxAuthority
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:118`
- **Deprecated:** No

Get All Tax Authority

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `taxService.getAllTaxAuthorityOfACompany(company`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/taxes?country=:country`

- **Frontend id:** `COMPANY_API.GET_ALL_TAXES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getTaxList`
- **Method evidence:** actual frontend HTTP call
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

### `GET /company/:companyUniqueName/payment/banks/accounts`

- **Frontend id:** `COMPANY_API.GET_COMPANY_INTEGRATED_BANK_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getIntegratedBankInCompany`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getPaymentBankAccounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:904`
- **Deprecated:** No

Get all the registered accounts of integrated banks with Giddh.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `iciciBankService.getPaymentBankAccounts(company, logs, language`

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
| 400 | `BAD_PADDING` | `BadPaddingException` | BadPaddingException raised by controller or shared ExceptionHandler |
| 400 | `CERTIFICATE` | `CertificateException` | CertificateException raised by controller or shared ExceptionHandler |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `ILLEGAL_BLOCK_SIZE` | `IllegalBlockSizeException` | IllegalBlockSizeException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/payment/banks/accounts?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /users/:userUniqueName/company-uer?companyUniqueName=:companyUniqueName`

- **Frontend id:** `COMPANY_API.GET_COMPANY_USER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getCompanyUser`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#getCompanyUserEntityRoles
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:144`
- **Deprecated:** No

API for getting user entity roles for given companyUniqueName and user.

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required
**Query parameters**
- `companyUniqueName` — type: `String`; optional
- `scope` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyResourceV3`

```json
{
  "status": "success",
  "body": {
    "reference": "companyResourceV3"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/company-uer?companyUniqueName=dcrcdiin17887749442630bsy43&scope=SAMPLE_scope' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/users`

- **Frontend id:** `COMPANY_API.GET_COMPANY_USERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getComapnyUsers`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getUsers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:521`
- **Deprecated:** No

Get Users

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `userPermissions`

```json
{
  "status": "success",
  "body": {
    "reference": "userPermissions"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/users?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId/country-list`

- **Frontend id:** `COMPANY_API.GET_COUNTRY_LIST_BY_SUBSCRIPTION_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#countryListBySubscriptionId`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getCountryListBySubscriptionId
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:368`
- **Deprecated:** No

Get Country List By Subscription Id

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

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
- `body as CompanyResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/country-list' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/purchases-register-detailed?`

- **Frontend id:** `COMPANY_API.GET_DETAILED_REGISTERED_PURCHASE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#getDetailedPurchaseRegister`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getPurchasesRegisterDetailed
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:408`
- **Deprecated:** No

The purpose of this API is to create the Detailed Purchases Register Report of a company.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sort` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `date`
- `q` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SalesRegisterDetailedRequest` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `accountUniqueNames` | `List<String>` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `country` | `NameCodeImpl` | not declared | unconstrained |
| `stateCode` | `String` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `q` | `String` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "accountUniqueNames": [],
  "salesPersonUniqueName": "string",
  "country": "string",
  "stateCode": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "q": "string"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/purchases-register-detailed?from=01-04-2025&to=31-03-2026&page=1&count=20&sort=desc&sortBy=date&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","accountUniqueNames":[],"salesPersonUniqueName":"string","country":"string","stateCode":"string","page":0,"count":0,"sort":"string","sortBy":"string","q":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/sales-register-detailed?`

- **Frontend id:** `COMPANY_API.GET_DETAILED_REGISTERED_SALES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/receipt.service.ts#getDetailedSalesRegister`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#createSalesRegisterDetailed
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:311`
- **Deprecated:** No

The purpose of this API is to create the Detailed Sales Register Report of a company.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sort` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `date`
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `SalesRegisterDetailedRequest` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `accountUniqueNames` | `List<String>` | not declared | unconstrained |
| `salesPersonUniqueName` | `String` | not declared | unconstrained |
| `country` | `NameCodeImpl` | not declared | unconstrained |
| `stateCode` | `String` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `q` | `String` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "accountUniqueNames": [],
  "salesPersonUniqueName": "string",
  "country": "string",
  "stateCode": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "q": "string"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/sales-register-detailed?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa&page=1&count=20&sort=desc&sortBy=date&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","accountUniqueNames":[],"salesPersonUniqueName":"string","country":"string","stateCode":"string","page":0,"count":0,"sort":"string","sortBy":"string","q":"string"}'
```

---

### `GET /company/:companyUniqueName/bank/generateotp?bankUserId=:bankUserId`

- **Frontend id:** `COMPANY_API.GET_OTP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getOTP`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#generateOTP
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:146`
- **Deprecated:** No

Generate OTP

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`
- `urn` — type: `String`; required

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
- `body as IRegistration`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank/generateotp?lang=DEFAULT_LANG&urn=SAMPLE_urn&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/purchases-register-overview?from=:fromDate&to=:toDate&interval=:interval`

- **Frontend id:** `COMPANY_API.GET_REGISTERED_PURCHASE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getPurchaseRegister`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getPurchasesRegisterOverview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:354`
- **Deprecated:** No

The purpose of this API is to create the Purchases Register Overview of a company.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `interval` — type: `String`; optional; default: `monthly`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `intervalBalances`

```json
{
  "status": "success",
  "body": {
    "reference": "intervalBalances"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/purchases-register-overview?from=01-04-2025&to=31-03-2026&interval=monthly&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/v2/purchases-register-overview?from=:from&to=:to`

- **Frontend id:** `COMPANY_API.GET_REGISTERED_PURCHASE_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getSalesRegisterV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getPurchasesRegisterOverview2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:373`
- **Deprecated:** No

Get Purchases Register Overview2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SalesRegisterOverviewRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `groupBy` | `String` | not declared | unconstrained |
| `interval` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `accountUniqueNames` | `List<String>` | not declared | unconstrained |
| `countryCodes` | `List<String>` | not declared | unconstrained |
| `country` | `NameCodeImpl` | not declared | unconstrained |
| `stateCodes` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "groupBy": "string",
  "interval": "string",
  "salesPersonUniqueNames": [],
  "accountUniqueNames": [],
  "countryCodes": [],
  "country": "string",
  "stateCodes": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `intervalBalances`

```json
{
  "status": "success",
  "body": {
    "reference": "intervalBalances"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/v2/purchases-register-overview?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","groupBy":"string","interval":"string","salesPersonUniqueNames":[],"accountUniqueNames":[],"countryCodes":[],"country":"string","stateCodes":[]}'
```

---

### `GET /v2/company/:companyUniqueName/sales-register-overview?from=:fromDate&to=:toDate&interval=:interval`

- **Frontend id:** `COMPANY_API.GET_REGISTERED_SALES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getSalesRegister`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#createSalesRegisterOverview
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:257`
- **Deprecated:** No

The purpose of this API is to create the Sales Register Overview of a company.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional
- `interval` — type: `String`; optional; default: `monthly`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `intervalBalances`

```json
{
  "status": "success",
  "body": {
    "reference": "intervalBalances"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/sales-register-overview?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa&interval=monthly' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/v2/sales-register-overview?from=:from&to=:to`

- **Frontend id:** `COMPANY_API.GET_REGISTERED_SALES_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getSalesRegisterV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getSalesRegisterOverviewV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:276`
- **Deprecated:** No

Get Sales Register Overview V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SalesRegisterOverviewRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `groupBy` | `String` | not declared | unconstrained |
| `interval` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |
| `accountUniqueNames` | `List<String>` | not declared | unconstrained |
| `countryCodes` | `List<String>` | not declared | unconstrained |
| `country` | `NameCodeImpl` | not declared | unconstrained |
| `stateCodes` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "groupBy": "string",
  "interval": "string",
  "salesPersonUniqueNames": [],
  "accountUniqueNames": [],
  "countryCodes": [],
  "country": "string",
  "stateCodes": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `intervalBalances`

```json
{
  "status": "success",
  "body": {
    "reference": "intervalBalances"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/v2/sales-register-overview?from=01-04-2025&to=31-03-2026&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","groupBy":"string","interval":"string","salesPersonUniqueNames":[],"accountUniqueNames":[],"countryCodes":[],"country":"string","stateCodes":[]}'
```

---

### `GET /company/:companyUniqueName/us/sales-report-account-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName&taxUniqueName=:taxUniqueName&page=:page&count=:count`

- **Frontend id:** `COMPANY_API.GET_SALES_TAX_ACCOUNT_WISE_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getExportSaleTaxReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: USVatReturnController#getVatReportAccountWise
- **Backend source:** `src/main/java/com/giddh/api/controllers/USVatReturnController.java:133`
- **Deprecated:** No

Get Vat Report Account Wise

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `taxNumber` — type: `String`; required
- `taxAuthorityUniqueName` — type: `String`; optional
- `taxUniqueName` — type: `String`; optional
- `taxAuthorityQuery` — type: `String`; optional; default: ``
- `taxQuery` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `usVatReport`

```json
{
  "status": "success",
  "body": {
    "reference": "usVatReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/sales-report-account-wise?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&taxUniqueName=SAMPLE_taxUniqueName&taxAuthorityQuery=&taxQuery=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/us/sales-report-authority-wise?from=:from&to=:to&taxNumber=:taxNumber&page=:page&count=:count`

- **Frontend id:** `COMPANY_API.GET_SALES_TAX_AUTHORITY_WISE_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getExportSaleTaxReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: USVatReturnController#getVatReportTaxAuthorityWise
- **Backend source:** `src/main/java/com/giddh/api/controllers/USVatReturnController.java:63`
- **Deprecated:** No

Get Vat Report Tax Authority Wise

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `q` — type: `String`; optional; default: ``
- `taxNumber` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `usVatReport`

```json
{
  "status": "success",
  "body": {
    "reference": "usVatReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/sales-report-authority-wise?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20&q=&taxNumber=SAMPLE_taxNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/us/sales-report-tax-wise?from=:from&to=:to&taxNumber=:taxNumber&taxAuthorityUniqueName=:taxAuthorityUniqueName&page=:page&count=:count`

- **Frontend id:** `COMPANY_API.GET_SALES_TAX_WISE_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#getExportSaleTaxReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: USVatReturnController#getVatReportTaxWise
- **Backend source:** `src/main/java/com/giddh/api/controllers/USVatReturnController.java:87`
- **Deprecated:** No

Get Vat Report Tax Wise

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `taxNumber` — type: `String`; required
- `taxAuthorityUniqueName` — type: `String`; optional
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `usVatReport`

```json
{
  "status": "success",
  "body": {
    "reference": "usVatReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/us/sales-report-tax-wise?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&page=1&count=20&taxNumber=SAMPLE_taxNumber&taxAuthorityUniqueName=SAMPLE_taxAuthorityUniqueName&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/ui_side_bar_items`

- **Frontend id:** `COMPANY_API.GET_SIDE_BAR_ITEM`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getMenuItems`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#uiSideBarMenuItems
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:870`
- **Deprecated:** No

Ui Side Bar Menu Items

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`
- `isMobile` — type: `boolean`; optional; default: `false`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/ui_side_bar_items?branchUniqueName=aaaa&refresh=false&isMobile=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /state-details?companyUniqueName=:companyUniqueName`

- **Frontend id:** `COMPANY_API.GET_STATE_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getStateDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LastStateDetailsController#getLastState
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LastStateDetailsController.java:54`
- **Deprecated:** No

Get Last State

#### Inputs

**Query parameters**
- `companyUniqueName` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional
- `fetchLastState` — type: `boolean`; optional

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
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

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
curl --request GET \
  --url 'https://api.giddh.com/state-details?companyUniqueName=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa&fetchLastState=SAMPLE_fetchLastState' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /subscription/generateOrder?amount=:amount&currency=:currency`

- **Frontend id:** `COMPANY_API.RAZORPAY_ORDERID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getRazorPayOrderId`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionController#generateOrderForSubscriptionPayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/SubscriptionController.java:44`
- **Deprecated:** No

Generate Order For Subscription Payment

#### Inputs

**Query parameters**
- `amount` — type: `BigDecimal`; required
- `currency` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `razorPayOrderReponse`

```json
{
  "status": "success",
  "body": {
    "reference": "razorPayOrderReponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/subscription/generateOrder?amount=SAMPLE_amount&currency=SAMPLE_currency' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/bank/`

- **Frontend id:** `COMPANY_API.REGISTER_ACCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getRegisteredAccount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ICICIBankController#getAllRegistration
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ICICIBankController.java:133`
- **Deprecated:** No

Get All Registration

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `bankName` — type: `String`; optional; default: `ICICI`
- `lang` — type: `String`; optional; default: `DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `bankDetailsRespons`

```json
{
  "status": "success",
  "body": {
    "reference": "bankDetailsRespons"
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
- `body as IRegistration`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/bank?bankName=ICICI&lang=DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /send-data`

- **Frontend id:** `COMPANY_API.SEND_DATA`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#SocketCreateCompany`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: MainController#sendLeadDataToSlack
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:337`
- **Deprecated:** No

Send signup data to Slack (new signup flow). Triggers on first company creation after signup; sends signup and UTM fields to the Giddh new-signup Slack channel. **No authentication.**

#### Inputs



#### Controller-backed request payload

Type: `NewSignupRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `companyName` | `String` | not declared | unconstrained |
| `timestamp` | `Long` | not declared | unconstrained |
| `loggedInEmailId` | `String` | not declared | unconstrained |
| `mobileNo` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `utmSource` | `String` | not declared | unconstrained |
| `utmMedium` | `String` | not declared | unconstrained |
| `utmCampaign` | `String` | not declared | unconstrained |
| `utmTerm` | `String` | not declared | unconstrained |
| `utmContent` | `String` | not declared | unconstrained |
| `businessNature` | `String` | not declared | unconstrained |
| `ref` | `String` | not declared | unconstrained |
| `source` | `Object` | not declared | unconstrained |

Example:

```json
{
  "companyName": "string",
  "timestamp": 0,
  "loggedInEmailId": "string",
  "mobileNo": "string",
  "name": "string",
  "utmSource": "string",
  "utmMedium": "string",
  "utmCampaign": "string",
  "utmTerm": "string",
  "utmContent": "string",
  "businessNature": "string",
  "ref": "string",
  "source": {}
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<Object>`
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
| 400 | `API` | `ApiException` | ApiException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "API",
  "message": "Api"
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
  --url 'https://api.giddh.com/send-data' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"companyName":"string","timestamp":0,"loggedInEmailId":"string","mobileNo":"string","name":"string","utmSource":"string","utmMedium":"string","utmCampaign":"string","utmTerm":"string","utmContent":"string","businessNature":"string","ref":"string","source":{}}'
```

---

### `POST /v2/company/:companyUniqueName/groups/:groupUniqueName/email-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `COMPANY_API.SEND_EMAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#sendEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#emailAccountBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:128`
- **Deprecated:** No

Email Account Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; required
- `to` — type: `String`; required

#### Controller-backed request payload

Type: `BalanceFilterParams` (required).

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
- Body evidence: `"Mail sent successfully."`

```json
{
  "status": "success",
  "body": "Mail sent successfully."
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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/email-account-closing-balance?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"openingBalance":0,"openingBalanceType":"string","openingBalanceGreaterThan":false,"openingBalanceLessThan":false,"openingBalanceEqual":false,"openingBalanceNotEqual":false,"closingBalance":0,"closingBalanceType":"string","closingBalanceGreaterThan":false,"closingBalanceLessThan":false,"closingBalanceEqual":false,"closingBalanceNotEqual":false,"creditTotal":0,"creditTotalGreaterThan":false,"creditTotalLessThan":false,"creditTotalEqual":false,"creditTotalNotEqual":false,"debitTotal":0,"debitTotalGreaterThan":false,"debitTotalLessThan":false,"debitTotalEqual":false,"debitTotalNotEqual":false,"sort":"string","sortBy":"string","sortType":"string","message":"string","accounts":[],"subject":"string","includeParentGroup":false,"includeMobileNumber":false,"includeEmailId":false,"includeState":false,"includeTaxNumber":false}'
```

---

### `POST /users/send-new-user-info`

- **Frontend id:** `COMPANY_API.SEND_NEW_USER_INFO`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#sendNewUserInfo`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#sendNewUserInfo
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:314`
- **Deprecated:** No

Send New User Info

#### Inputs



#### Controller-backed request payload

Type: `NewUserInfoRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `currency` | `String` | not declared | unconstrained |
| `contactNo` | `String` | not declared | unconstrained |
| `country` | `String` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `medium` | `String` | not declared | unconstrained |
| `campaign` | `String` | not declared | unconstrained |
| `term` | `String` | not declared | unconstrained |
| `content` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "currency": "string",
  "contactNo": "string",
  "country": "string",
  "email": "string",
  "source": "string",
  "medium": "string",
  "campaign": "string",
  "term": "string",
  "content": "string"
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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/users/send-new-user-info' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","currency":"string","contactNo":"string","country":"string","email":"string","source":"string","medium":"string","campaign":"string","term":"string","content":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/groups/:groupUniqueName/sms-account-closing-balance?from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `COMPANY_API.SEND_SMS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#sendSms`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#smsAccountBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:146`
- **Deprecated:** No

Sms Account Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional

#### Controller-backed request payload

Type: `BalanceFilterParams` (required).

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
- Body evidence: `"Sms sent successfully."`

```json
{
  "status": "success",
  "body": "Sms sent successfully."
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/sms-account-closing-balance?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"openingBalance":0,"openingBalanceType":"string","openingBalanceGreaterThan":false,"openingBalanceLessThan":false,"openingBalanceEqual":false,"openingBalanceNotEqual":false,"closingBalance":0,"closingBalanceType":"string","closingBalanceGreaterThan":false,"closingBalanceLessThan":false,"closingBalanceEqual":false,"closingBalanceNotEqual":false,"creditTotal":0,"creditTotalGreaterThan":false,"creditTotalLessThan":false,"creditTotalEqual":false,"creditTotalNotEqual":false,"debitTotal":0,"debitTotalGreaterThan":false,"debitTotalLessThan":false,"debitTotalEqual":false,"debitTotalNotEqual":false,"sort":"string","sortBy":"string","sortType":"string","message":"string","accounts":[],"subject":"string","includeParentGroup":false,"includeMobileNumber":false,"includeEmailId":false,"includeState":false,"includeTaxNumber":false}'
```

---

### `POST /state-details`

- **Frontend id:** `COMPANY_API.SET_STATE_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#setStateDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LastStateDetailsController#updateLastState
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LastStateDetailsController.java:92`
- **Deprecated:** No

Update Last State

#### Inputs

**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `LastStateDetailsResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"state details saved"`

```json
{
  "status": "success",
  "body": "state details saved"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/state-details?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/tax`

- **Frontend id:** `COMPANY_API.TAX`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getCompanyTaxes; apps/web-giddh/src/app/services/settings.taxes.service.ts#CreateTax; apps/web-giddh/src/app/services/settings.taxes.service.ts#UpdateTax; apps/web-giddh/src/app/services/settings.taxes.service.ts#DeleteTax`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:70`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `allTax`

```json
{
  "status": "success",
  "body": {
    "reference": "allTax"
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
- `body as TaxResponse[]`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/tax`

- **Frontend id:** `COMPANY_API.TAX`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getCompanyTaxes; apps/web-giddh/src/app/services/settings.taxes.service.ts#CreateTax; apps/web-giddh/src/app/services/settings.taxes.service.ts#UpdateTax; apps/web-giddh/src/app/services/settings.taxes.service.ts#DeleteTax`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:41`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `updateEntries` — type: `String`; optional; default: `false`

#### Controller-backed request payload

Type: `TaxRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxNumber` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `accounts` | `Set<MinimalAccountResource>` | not declared | unconstrained |
| `taxDetail` | `List<TaxDetailRequest>` | not declared | unconstrained |
| `duration` | `DurationType` | not declared | unconstrained |
| `taxFileDate` | `Integer` | not declared | unconstrained |
| `taxType` | `String` | not declared | unconstrained |
| `isInputGst` | `Boolean` | not declared | unconstrained |
| `isTallySync` | `Boolean` | not declared | unconstrained |
| `countries` | `Set<String>` | not declared | unconstrained |
| `taxAuthorityRequest` | `TaxAuthorityRequest` | not declared | unconstrained |

Example:

```json
{
  "taxNumber": "string",
  "name": "string",
  "accounts": [],
  "taxDetail": [],
  "duration": "string",
  "taxFileDate": 0,
  "taxType": "string",
  "isInputGst": false,
  "isTallySync": false,
  "countries": [],
  "taxAuthorityRequest": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new TaxResource(tax`

```json
{
  "status": "success",
  "body": {
    "type": "TaxResource"
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
- `body as TaxResponse[]`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax?updateEntries=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxNumber":"string","name":"string","accounts":[],"taxDetail":[],"duration":"string","taxFileDate":0,"taxType":"string","isInputGst":false,"isTallySync":false,"countries":[],"taxAuthorityRequest":"string"}'
```

---

### `GET /company/:companyUniqueName/entry-settings`

- **Frontend id:** `COMPANY_API.UNIVERSAL_DATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getApplicationDate; apps/web-giddh/src/app/services/company.service.ts#setApplicationDate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanySettingsController#getUserCompanyEntrySettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanySettingsController.java:77`
- **Deprecated:** No

Get User Company Entry Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new EntrySettingResource(entrySetting`

```json
{
  "status": "success",
  "body": {
    "type": "EntrySettingResource"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/entry-settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/entry-settings`

- **Frontend id:** `COMPANY_API.UNIVERSAL_DATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/company.service.ts#getApplicationDate; apps/web-giddh/src/app/services/company.service.ts#setApplicationDate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanySettingsController#updateUserCompanyEntrySettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanySettingsController.java:86`
- **Deprecated:** No

Update User Company Entry Settings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `EntrySetting` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromDate` | `String` | not declared | unconstrained |
| `toDate` | `String` | not declared | unconstrained |
| `period` | `String` | not declared | unconstrained |
| `duration` | `Integer` | not declared | unconstrained |
| `ledgerCount` | `Integer` | not declared | unconstrained |
| `status` | `Boolean` | not declared | unconstrained |
| `noOfTransactions` | `Integer` | not declared | unconstrained |

Example:

```json
{
  "fromDate": "string",
  "toDate": "string",
  "period": "string",
  "duration": 0,
  "ledgerCount": 0,
  "status": false,
  "noOfTransactions": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new EntrySettingResource(entrySetting`

```json
{
  "status": "success",
  "body": {
    "type": "EntrySettingResource"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `DATE_PARSE` | `DateParseException` | DateParseException raised by controller or shared ExceptionHandler |
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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/entry-settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromDate":"string","toDate":"string","period":"string","duration":0,"ledgerCount":0,"status":false,"noOfTransactions":0}'
```

---

### `PATCH /company/:companyUniqueName/tax/authority/:uniqueName`

- **Frontend id:** `COMPANY_API.UPDATE_TAX_AUTHORITY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.taxes.service.ts#updateTaxAuthority`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: TaxController#updateTaxAuthority
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/TaxController.java:126`
- **Deprecated:** No

Update Tax Authority

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `taxAuthorityUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TaxAuthorityRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `stateCode` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "stateCode": "string",
  "uniqueName": "string",
  "description": "string"
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
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/tax/authority/SAMPLE_taxAuthorityUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","stateCode":"string","uniqueName":"string","description":"string"}'
```

---

### `PATCH /company/:companyUniqueName/branch/:branchUniqueName`

- **Frontend id:** `SETTINGS_BRANCH_API.UPDATE_BRANCH_STATUS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.branch.service.ts#updateBranchStatus`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchController#updateBranchV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BranchController.java:88`
- **Deprecated:** No

Update Branch V2

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
- Body evidence: `branchService.updateBranchV2(company, branchUniqueName, branchResource, principal`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch/aaaa?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"parentBranchUniqueName":"string","businessType":"string","businessNature":"string","addresses":[],"parentBranch":"string","linkAddresses":[],"warehouseResource":[],"defaultWarehouse":"string","isArchived":false,"nodeId":"string","parentNodeId":"string","childBranches":[]}'
```

---

### `POST /company/:companyUniqueName/auth/generate`

- **Frontend id:** `SETTINGS_COMPANY_AUTH_KEY_API.CREATE_AUTH_KEY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.company-auth-key.service.ts#createAuthKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleAuthController#generateAuthKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleAuthController.java:46`
- **Deprecated:** No

Generate Auth Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

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
- Body evidence: `authKey`

```json
{
  "status": "success",
  "body": {
    "reference": "authKey"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 400 | `UNSUPPORTED_ENCODING` | `UnsupportedEncodingException` | UnsupportedEncodingException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as ICompanyAuthKey`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"emailId":"string","from":"string","to":"string","duration":0,"period":"string","allowedIps":[],"allowedCidrs":[],"entity":"string","entityUniqueName":"string","roleName":"string","roleUniqueName":"string","userName":"string","userEmail":"string","userUniqueName":"string","uniqueName":"string","fromDateObj":"01-04-2025","toDateObj":"01-04-2025","mobileVerified":false,"mobileNumber":"string","userIsSubscriber":false,"companyUniqueName":"string","comingFromAdminPanel":false,"reGenerateAuthKey":false}'
```

---

### `DELETE /company/:companyUniqueName/auth/:authKeyUniqueName/remove`

- **Frontend id:** `SETTINGS_COMPANY_AUTH_KEY_API.DELETE_AUTH_KEY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.company-auth-key.service.ts#deleteAuthKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleAuthController#removeAuthKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleAuthController.java:66`
- **Deprecated:** No

Remove Auth Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `authUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Auth key removed successfully."`

```json
{
  "status": "success",
  "body": "Auth key removed successfully."
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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/SAMPLE_authUniqueName/remove?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/auth/all`

- **Frontend id:** `SETTINGS_COMPANY_AUTH_KEY_API.GET_ALL_AUTH_KEYS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.company-auth-key.service.ts#getAllAuthKeys`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleAuthController#getAllAuthKeys
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleAuthController.java:75`
- **Deprecated:** No

Get All Auth Keys

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `roleV2AssignModels`

```json
{
  "status": "success",
  "body": {
    "reference": "roleV2AssignModels"
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
- `body as ICompanyAuthKey[]`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/all?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/auth/:authKeyUniqueName`

- **Frontend id:** `SETTINGS_COMPANY_AUTH_KEY_API.GET_AUTH_KEY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.company-auth-key.service.ts#getAuthKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleAuthController#unmaskAuthKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleAuthController.java:84`
- **Deprecated:** No

Unmask Auth Key

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `authUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `unMaskedAuthKey`

```json
{
  "status": "success",
  "body": {
    "reference": "unMaskedAuthKey"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 400 | `UNSUPPORTED_ENCODING` | `UnsupportedEncodingException` | UnsupportedEncodingException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

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
- `body as ICompanyAuthKey`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/SAMPLE_authUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/auth/:authKeyUniqueName/update`

- **Frontend id:** `SETTINGS_COMPANY_AUTH_KEY_API.UPDATE_AUTH_KEY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.company-auth-key.service.ts#updateAuthKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleAuthController#updateAuthUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleAuthController.java:56`
- **Deprecated:** No

Update Auth User

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `authUniqueName` — type: `String`; required

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
- Body evidence: `authKey`

```json
{
  "status": "success",
  "body": {
    "reference": "authKey"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 400 | `UNSUPPORTED_ENCODING` | `UnsupportedEncodingException` | UnsupportedEncodingException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
  "code": "GENERAL_SECURITY",
  "message": "General Security"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as ICompanyAuthKey`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/auth/SAMPLE_authUniqueName/update?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"emailId":"string","from":"string","to":"string","duration":0,"period":"string","allowedIps":[],"allowedCidrs":[],"entity":"string","entityUniqueName":"string","roleName":"string","roleUniqueName":"string","userName":"string","userEmail":"string","userUniqueName":"string","uniqueName":"string","fromDateObj":"01-04-2025","toDateObj":"01-04-2025","mobileVerified":false,"mobileNumber":"string","userIsSubscriber":false,"companyUniqueName":"string","comingFromAdminPanel":false,"reGenerateAuthKey":false}'
```

---

### `POST /company/:companyUniqueName/warehouse`

- **Frontend id:** `WAREHOUSE_API.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.warehouse.service.ts#createWarehouse`
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
- `request (echoed by service)`

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

### `GET /company/:companyUniqueName/warehouse?page=:page&refresh=true`

- **Frontend id:** `WAREHOUSE_API.FETCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.warehouse.service.ts#fetchAllWarehouse`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: WarehouseController#getAllWarehouses
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/WarehouseController.java:164`
- **Deprecated:** No

Get All Warehouses

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `branchUniqueName` — type: `String`; optional
- `includeArchived` — type: `boolean`; optional; default: `true`
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse?q=&page=1&count=20&branchUniqueName=aaaa&includeArchived=true&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/warehouse/:warehouseUniqueName`

- **Frontend id:** `WAREHOUSE_API.GET_WAREHOUSE_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.warehouse.service.ts#getWarehouseDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: WarehouseController#getWarehouse
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/WarehouseController.java:139`
- **Deprecated:** No

Get Warehouse

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `warehouseUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName/warehouse/:warehouseUniqueName/default`

- **Frontend id:** `WAREHOUSE_API.SET_DEFAULT_WAREHOUSE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.warehouse.service.ts#setAsDefaultWarehouse`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: WarehouseController#setDefaultWarehouse
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/WarehouseController.java:119`
- **Deprecated:** No

Set Default Warehouse

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `warehouseUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `warehouseService.setDefaultWarehouse(warehouseUniqueName, company, principal`

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
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName/default?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/warehouse/:warehouseUniqueName`

- **Frontend id:** `WAREHOUSE_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.warehouse.service.ts#updateWarehouse`
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

### `PATCH /company/:companyUniqueName/warehouse/:warehouseUniqueName`

- **Frontend id:** `WAREHOUSE_API.UPDATE_WAREHOUSE_STATUS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.warehouse.service.ts#updateWarehouseStatus`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: WarehouseController#updateWarehouseV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/WarehouseController.java:195`
- **Deprecated:** No

Update Warehouse V2

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/warehouse/SAMPLE_warehouseUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"countryCode":"string","currencyCode":"string","stateCode":"string","isDefault":false,"callingCode":"string","addresses":[],"linkAddresses":[],"isArchived":false}'
```

