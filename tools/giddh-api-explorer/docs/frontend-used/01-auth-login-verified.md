# Backend-Verified Frontend APIs: 01-auth-login.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/dsc/finish?voucherVersion=2`

- **Frontend id:** `DSC_API.FINISH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/dsc.service.ts#finishDscSigning`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: DscController#finish
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DscController.java:83`
- **Deprecated:** No

Finish

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `POST /company/:companyUniqueName/dsc/prepare?voucherVersion=2`

- **Frontend id:** `DSC_API.PREPARE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/dsc.service.ts#prepareDscSigning`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: DscController#prepare
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DscController.java:67`
- **Deprecated:** No

Prepare

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `POST /company/:companyUniqueName/generate-mail-token`

- **Frontend id:** `GMAIL_API.GENERATE_GMAIL_TOKEN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#saveGmailAuthCode`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoogleMailController#generateMailToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GoogleMailController.java:54`
- **Deprecated:** No

Generate Mail Token

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `TokenRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `code` | `String` | not declared | unconstrained |
| `client_id` | `String` | not declared | unconstrained |
| `client_secret` | `String` | not declared | unconstrained |
| `redirect_uri` | `String` | not declared | unconstrained |
| `grant_type` | `String` | not declared | unconstrained |
| `scope` | `String` | not declared | unconstrained |
| `subject` | `String` | not declared | unconstrained |

Example:

```json
{
  "code": "string",
  "client_id": "string",
  "client_secret": "string",
  "redirect_uri": "string",
  "grant_type": "string",
  "scope": "string",
  "subject": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `token`

```json
{
  "status": "success",
  "body": {
    "reference": "token"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/generate-mail-token?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"code":"string","client_id":"string","client_secret":"string","redirect_uri":"string","grant_type":"string","scope":"string","subject":"string"}'
```

---

### `POST /company/:companyUniqueName/save-mail-token`

- **Frontend id:** `GMAIL_API.SAVE_GMAIL_TOKEN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#saveGmailToken`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoogleMailController#saveMailToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GoogleMailController.java:131`
- **Deprecated:** No

Save Mail Token

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `Token` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `access_token` | `String` | not declared | unconstrained |
| `refresh_token` | `String` | not declared | unconstrained |
| `token_type` | `String` | not declared | unconstrained |
| `expires_in` | `String` | not declared | unconstrained |
| `client_id` | `String` | not declared | unconstrained |
| `client_secret` | `String` | not declared | unconstrained |
| `scope` | `String` | not declared | unconstrained |
| `id_token` | `String` | not declared | unconstrained |
| `subject` | `String` | not declared | unconstrained |
| `code` | `String` | not declared | unconstrained |
| `redirect_uri` | `String` | not declared | unconstrained |
| `grant_type` | `String` | not declared | unconstrained |
| `ipAddress` | `String` | not declared | unconstrained |

Example:

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "string",
  "expires_in": "string",
  "client_id": "string",
  "client_secret": "string",
  "scope": "string",
  "id_token": "string",
  "subject": "string",
  "code": "string",
  "redirect_uri": "string",
  "grant_type": "string",
  "ipAddress": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `tokenSaved`

```json
{
  "status": "success",
  "body": {
    "reference": "tokenSaved"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/save-mail-token?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"access_token":"string","refresh_token":"string","token_type":"string","expires_in":"string","client_id":"string","client_secret":"string","scope":"string","id_token":"string","subject":"string","code":"string","redirect_uri":"string","grant_type":"string","ipAddress":"string"}'
```

---

### `DELETE /users/:userUniqueName/destroy-session`

- **Frontend id:** `LOGIN_API.CLEAR_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#ClearSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#destroyUserSession
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:225`
- **Deprecated:** No

Destroy User Session

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

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
curl --request DELETE \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/destroy-session' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /users/:userEmail/sessions`

- **Frontend id:** `LOGIN_API.DELETE_ALL_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#DeleteAllSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#deleteAllSessions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:288`
- **Deprecated:** No

Delete All Sessions

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"All sessions of this user are deleted"`

```json
{
  "status": "success",
  "body": "All sessions of this user are deleted"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "NOT_PERMITTED",
  "message": "Not Permitted"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/sessions' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /users/:userEmail/destroy-session`

- **Frontend id:** `LOGIN_API.DELETE_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#DeleteSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#destroyUserSession2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:234`
- **Deprecated:** No

Destroy User Session2

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `DeleteSessionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `sessionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "sessionId": "string"
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
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/destroy-session' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"sessionId":"string"}'
```

---

### `GET /users/:sessionId`

- **Frontend id:** `LOGIN_API.FETCH_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#FetchUserDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#getUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:105`
- **Deprecated:** No

Get User

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `resource`

```json
{
  "status": "success",
  "body": {
    "reference": "resource"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

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
- `body as UserDetails`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /users/:userEmail/forgot-password`

- **Frontend id:** `LOGIN_API.FORGOT_PASSWORD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#forgotPassword`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#forgotPassword
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:267`
- **Deprecated:** No

Forgot Password

#### Inputs

**Path parameters**
- `uniqueKey` — type: `String`; required

#### Controller-backed request payload

None.

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
curl --request PUT \
  --url 'https://api.giddh.com/users/SAMPLE_uniqueKey/forgot-password' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /users/:uniqueName/get-auth-key`

- **Frontend id:** `LOGIN_API.GET_AUTH_KEY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#GetAuthKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#generateAuthKeyV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:255`
- **Deprecated:** No

Generate Auth Key V2

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `newAuthKey`

```json
{
  "status": "success",
  "body": {
    "reference": "newAuthKey"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
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
- `body as AuthKeyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/get-auth-key' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /users/:userEmail/sessions`

- **Frontend id:** `LOGIN_API.GET_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#GetUserSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#getAllSessions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:275`
- **Deprecated:** No

Get All Sessions

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `sessions`

```json
{
  "status": "success",
  "body": {
    "reference": "sessions"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "NOT_PERMITTED",
  "message": "You are not authorized to perform this action."
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/sessions' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/user`

- **Frontend id:** `LOGIN_API.GET_USER_DETAILS_FROM_SESSION_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#getUserDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#getUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:108`
- **Deprecated:** No

Get User

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `user`

```json
{
  "status": "success",
  "body": {
    "reference": "user"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/user' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/signup-with-apple`

- **Frontend id:** `LOGIN_API.LOGIN_WITH_APPLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#loginWithApple`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#signUpWithApple
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:141`
- **Deprecated:** No

API to support signup with apple

#### Inputs



#### Controller-backed request payload

Type: `AppleUserResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `authorizationCode` | `String` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |
| `fullName` | `NSPersonNameComponents` | not declared | unconstrained |
| `identityToken` | `String` | not declared | unconstrained |
| `state` | `String` | not declared | unconstrained |
| `user` | `String` | not declared | unconstrained |
| `requestFromWeb` | `Boolean` | not declared | unconstrained |
| `requestFromPettyCash` | `Boolean` | not declared | unconstrained |
| `responseFromApple` | `String` | not declared | unconstrained |

Example:

```json
{
  "authorizationCode": "string",
  "email": "string",
  "fullName": "string",
  "identityToken": "string",
  "state": "string",
  "user": "string",
  "requestFromWeb": false,
  "requestFromPettyCash": false,
  "responseFromApple": "string"
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 401 | `APPLE_VERIFICATION` | `AppleVerificationException` | AppleVerificationException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/signup-with-apple' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"authorizationCode":"string","email":"string","fullName":"string","identityToken":"string","state":"string","user":"string","requestFromWeb":false,"requestFromPettyCash":false,"responseFromApple":"string"}'
```

---

### `POST /v2/signup-with-google`

- **Frontend id:** `LOGIN_API.LOGIN_WITH_GOOGLE`
- **Frontend evidence:** `login.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: LoginV2Controller#signUpWithGoogleV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:61`
- **Deprecated:** No

Sign Up With Google V2

#### Inputs



#### Controller-backed request payload

Type: `GoogleUser` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `kind` | `String` | not declared | unconstrained |
| `gender` | `String` | not declared | unconstrained |
| `given_name` | `String` | not declared | unconstrained |
| `family_name` | `String` | not declared | unconstrained |
| `profile` | `String` | not declared | unconstrained |
| `picture` | `String` | not declared | unconstrained |
| `locale` | `String` | not declared | unconstrained |
| `email_verified` | `Boolean` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "kind": "string",
  "gender": "string",
  "given_name": "string",
  "family_name": "string",
  "profile": "string",
  "picture": "string",
  "locale": "string",
  "email_verified": false,
  "email": "string"
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `GOOGLE_VERIFICATION` | `GoogleVerificationException` | GoogleVerificationException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/signup-with-google' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","kind":"string","gender":"string","given_name":"string","family_name":"string","profile":"string","picture":"string","locale":"string","email_verified":false,"email":"string"}'
```

---

### `POST /v2/auth-login`

- **Frontend id:** `LOGIN_API.LOGIN_WITH_OTP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#loginWithOtp`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#authLogin
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:232`
- **Deprecated:** No

API to support login with otp

#### Inputs

**Query parameters**
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `LoginModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `emailId` | `String` | not declared | unconstrained |
| `mobileNo` | `String` | not declared | unconstrained |
| `accessToken` | `String` | not declared | unconstrained |
| `emailIdAccessToken` | `String` | not declared | unconstrained |
| `mobileNoAccessToken` | `String` | not declared | unconstrained |
| `emailIdAuthType` | `String` | not declared | unconstrained |
| `subDomain` | `String` | not declared | unconstrained |
| `proxyAuthToken` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |

Example:

```json
{
  "emailId": "string",
  "mobileNo": "string",
  "accessToken": "string",
  "emailIdAccessToken": "string",
  "mobileNoAccessToken": "string",
  "emailIdAuthType": "string",
  "subDomain": "string",
  "proxyAuthToken": "string",
  "type": "string"
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
| 400 | `API` | `ApiException` | ApiException raised by controller or shared ExceptionHandler |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/auth-login?lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"emailId":"string","mobileNo":"string","accessToken":"string","emailIdAccessToken":"string","mobileNoAccessToken":"string","emailIdAuthType":"string","subDomain":"string","proxyAuthToken":"string","type":"string"}'
```

---

### `GET /login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber`

- **Frontend id:** `LOGIN_API.LoginWithNumber`
- **Frontend evidence:** `login.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: LoginController#loginWithNumber
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginController.java:48`
- **Deprecated:** No

Login With Number

#### Inputs

**Query parameters**
- `countryCode` — type: `String`; required
- `mobileNumber` — type: `String`; required

#### Controller-backed request payload

None.

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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/login-with-number?countryCode=SAMPLE_countryCode&mobileNumber=SAMPLE_mobileNumber' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/login-with-password`

- **Frontend id:** `LOGIN_API.LoginWithPassword`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#LoginWithPassword`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#loginWithPassword
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:100`
- **Deprecated:** No

Login With Password

#### Inputs



#### Controller-backed request payload

Type: `PasswordModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueKey` | `String` | not declared | unconstrained |
| `password` | `String` | not declared | unconstrained |
| `currentPassword` | `String` | not declared | unconstrained |

Example:

```json
{
  "uniqueKey": "string",
  "password": "string",
  "currentPassword": "string"
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
- `body as VerifyMobileResponseModel`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/login-with-password' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueKey":"string","password":"string","currentPassword":"string"}'
```

---

### `PUT /users/:userEmail/generate-auth-key`

- **Frontend id:** `LOGIN_API.REGENERATE_AUTH_KEY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#RegenerateAuthKey`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#generateAuthKey
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:78`
- **Deprecated:** No

Generate Auth Key

#### Inputs

**Path parameters**
- `uniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `newAuthKey`

```json
{
  "status": "success",
  "body": {
    "reference": "newAuthKey"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
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
  "code": "JSON_PROCESSING",
  "message": "Json Processing"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as AuthKeyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/users/SAMPLE_UNIQUE_NAME/generate-auth-key' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /users/:userUniqueName/increment-session`

- **Frontend id:** `LOGIN_API.RENEW_SESSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#renewSession`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#incrementUserSession
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:246`
- **Deprecated:** No

Increment User Session

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `loggedInUserV2`

```json
{
  "status": "success",
  "body": {
    "reference": "loggedInUserV2"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "NOT_PERMITTED",
  "message": "Not Permitted"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/increment-session' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /reset-password`

- **Frontend id:** `LOGIN_API.RESET_PASSWORD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#resetPassword`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginController#resetPassword
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginController.java:112`
- **Deprecated:** No

Reset Password

#### Inputs



#### Controller-backed request payload

Type: `ResetPasswordModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `verificationCode` | `String` | not declared | unconstrained |
| `uniqueKey` | `String` | not declared | unconstrained |
| `newPassword` | `String` | not declared | unconstrained |

Example:

```json
{
  "verificationCode": "string",
  "uniqueKey": "string",
  "newPassword": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Password updated successfully. Login again to continue."`

```json
{
  "status": "success",
  "body": "Password updated successfully. Login again to continue."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/reset-password' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"verificationCode":"string","uniqueKey":"string","newPassword":"string"}'
```

---

### `PUT /users/:userUniqueName/settings`

- **Frontend id:** `LOGIN_API.SET_SETTINGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#SetSettings`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#updateUserSettings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:211`
- **Deprecated:** No

Update User Settings

#### Inputs

**Path parameters**
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `UserSettingRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `authenticateTwoWay` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "authenticateTwoWay": false
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
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/users/SAMPLE_userUniqueName/settings' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"authenticateTwoWay":false}'
```

---

### `POST /signup-with-email`

- **Frontend id:** `LOGIN_API.SignupWithEmail`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#SignupWithEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginController#signUpWithEmail
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginController.java:64`
- **Deprecated:** No

Sign Up With Email

#### Inputs



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
- Body evidence: `"Verification code sent successfully."`

```json
{
  "status": "success",
  "body": "Verification code sent successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/signup-with-email' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","verificationCode":"string","retryCount":0}'
```

---

### `POST /generate-otp`

- **Frontend id:** `LOGIN_API.SignupWithMobile`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#SignupWithMobile`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginController#generateOtp
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginController.java:89`
- **Deprecated:** No

Generate Otp

#### Inputs



#### Controller-backed request payload

Type: `SendOtpRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `countryCode` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `mobileNumber` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `oneTimePassword` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `getGeneratedOTP` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "countryCode": "string",
  "mobileNumber": "string",
  "oneTimePassword": "string",
  "getGeneratedOTP": false
}
```

#### Success response

- HTTP status: `201 CREATED`
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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/generate-otp' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"countryCode":"string","mobileNumber":"string","oneTimePassword":"string","getGeneratedOTP":false}'
```

---

### `POST /v2/signup`

- **Frontend id:** `LOGIN_API.SignupWithPassword`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#SignupWithPassword`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#signup
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:117`
- **Deprecated:** No

Signup

#### Inputs



#### Controller-backed request payload

Type: `SignupRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `email` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `password` | `String` | not declared | unconstrained |
| `mobileNo` | `String` | not declared | unconstrained |

Example:

```json
{
  "email": "string",
  "uniqueName": "string",
  "name": "string",
  "password": "string",
  "mobileNo": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `user`

```json
{
  "status": "success",
  "body": {
    "reference": "user"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `body as VerifyMobileResponseModel`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/signup' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","uniqueName":"string","name":"string","password":"string","mobileNo":"string"}'
```

---

### `POST /v2/verify-email`

- **Frontend id:** `LOGIN_API.VerifyEmail`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#VerifyEmail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#verifyEmailV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:84`
- **Deprecated:** No

Verify Email V2

#### Inputs



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
- Body evidence: `user`

```json
{
  "status": "success",
  "body": {
    "reference": "user"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
- `body as VerifyEmailResponseModel`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/verify-email' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"email":"string","verificationCode":"string","retryCount":0}'
```

---

### `POST /v2/verify-number`

- **Frontend id:** `LOGIN_API.VerifyOTP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/authentication.service.ts#VerifyOTP`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: LoginV2Controller#verifyMobileV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/LoginV2Controller.java:92`
- **Deprecated:** No

Verify Mobile V2

#### Inputs



#### Controller-backed request payload

Type: `SendOtpRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `countryCode` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `mobileNumber` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `oneTimePassword` | `String` | NotNull, NotBlank, NotEmpty | unconstrained |
| `getGeneratedOTP` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "countryCode": "string",
  "mobileNumber": "string",
  "oneTimePassword": "string",
  "getGeneratedOTP": false
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `JSON` | `JSONException` | JSONException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
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
- `body as VerifyMobileResponseModel`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/verify-number' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"countryCode":"string","mobileNumber":"string","oneTimePassword":"string","getGeneratedOTP":false}'
```

---

### `POST /company/:companyUniqueName/role`

- **Frontend id:** `PERMISSION_API.CREATE_ROLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/permission.service.ts#CreateNewRole`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleV2Controller#createRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleV2Controller.java:69`
- **Deprecated:** No

Create Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RoleV2Resource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `roleV2Service.create(roleResource, company, principal`

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
- `body as CreateNewRoleResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/role/:roleUniqueName`

- **Frontend id:** `PERMISSION_API.DELETE_ROLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/permission.service.ts#DeleteRole`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleV2Controller#deleteRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleV2Controller.java:91`
- **Deprecated:** No

Delete Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `roleUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Role deleted successfully."`

```json
{
  "status": "success",
  "body": "Role deleted successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role/SAMPLE_roleUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /scope-v2`

- **Frontend id:** `PERMISSION_API.GET_ALL_PAGE_NAMES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/permission.service.ts#GetAllPageNames`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: MainController#getScopes
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/MainController.java:167`
- **Deprecated:** No

Get Scopes

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `scopes`

```json
{
  "status": "success",
  "body": {
    "reference": "scopes"
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
- `body as IPageStr[]`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/scope-v2' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/role`

- **Frontend id:** `PERMISSION_API.GET_ROLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/permission.service.ts#GetAllRoles`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleV2Controller#getAllRoles
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleV2Controller.java:59`
- **Deprecated:** No

Get All Roles

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `roles`

```json
{
  "status": "success",
  "body": {
    "reference": "roles"
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
- `body as IRoleCommonResponseAndRequest[]`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/role/:roleUniqueName`

- **Frontend id:** `PERMISSION_API.UPDATE_ROLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/permission.service.ts#UpdateRole`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: RoleV2Controller#updateRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/RoleV2Controller.java:80`
- **Deprecated:** No

Update Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `roleUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RoleV2Resource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `roleV2Service.update(roleUniqueName, roleResource, company, principal`

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
- `body as IRoleCommonResponseAndRequest`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role/SAMPLE_roleUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/gmail-token`

- **Frontend id:** `SETTINGS_INTEGRATION_API.GET_GMAIL_INTEGRATION_STATUS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#GetGmailIntegrationStatus`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoogleMailController#getToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GoogleMailController.java:67`
- **Deprecated:** No

Get Token

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `token`

```json
{
  "status": "success",
  "body": {
    "reference": "token"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gmail-token?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/gmail-token`

- **Frontend id:** `SETTINGS_INTEGRATION_API.REMOVE_GMAIL_INTEGRATION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.integration.service.ts#RemoveGmailIntegration`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GoogleMailController#deleteToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/GoogleMailController.java:95`
- **Deprecated:** No

Delete Token

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gmail-token?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/shared-with`

- **Frontend id:** `SETTINGS_PERMISSION_API.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.permission.service.ts#GetUsersWithCompanyPermissions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getSharedList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:160`
- **Deprecated:** No

Get Shared List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `sortBy` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `sharedList`

```json
{
  "status": "success",
  "body": {
    "reference": "sharedList"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/shared-with?sortBy=date&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/shared-with?sortBy=mobile_verified`

- **Frontend id:** `SETTINGS_PERMISSION_API.GET_APPROVAL_NAME`
- **Frontend evidence:** `settings.permission.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: CompanyController#getSharedList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:160`
- **Deprecated:** No

Get Shared List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `sortBy` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `sharedList`

```json
{
  "status": "success",
  "body": {
    "reference": "sharedList"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/shared-with?sortBy=date&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/uer/:ueruniquename`

- **Frontend id:** `SETTINGS_PERMISSION_API.UPDATE_PERMISSION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/settings.permission.service.ts#UpdatePermission`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserEntityRoleV2Controller#updateUserEntityRole
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserEntityRoleV2Controller.java:58`
- **Deprecated:** No

Update User Entity Role

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `entityRoleUniqueName` — type: `String`; required

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
- Body evidence: `uer`

```json
{
  "status": "success",
  "body": {
    "reference": "uer"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `body as IUpdatePermissionResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uer/SAMPLE_entityRoleUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"emailId":"string","from":"string","to":"string","duration":0,"period":"string","allowedIps":[],"allowedCidrs":[],"entity":"string","entityUniqueName":"string","roleName":"string","roleUniqueName":"string","userName":"string","userEmail":"string","userUniqueName":"string","uniqueName":"string","fromDateObj":"01-04-2025","toDateObj":"01-04-2025","mobileVerified":false,"mobileNumber":"string","userIsSubscriber":false,"companyUniqueName":"string","comingFromAdminPanel":false,"reGenerateAuthKey":false}'
```

