# Auth / Login / Permission / DSC

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **38**

---

### `DSC_API.FINISH`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/dsc/finish?voucherVersion=2`
- **Source:** `dsc.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dsc/finish?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `DSC_API.PREPARE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/dsc/prepare?voucherVersion=2`
- **Source:** `dsc.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dsc/prepare?voucherVersion=2&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `GMAIL_API.GENERATE_GMAIL_TOKEN`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/generate-mail-token`
- **Source:** `login.api.ts` · service: `authentication.service.ts#saveGmailAuthCode`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `data` (see service `saveGmailAuthCode`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/generate-mail-token?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `GMAIL_API.SAVE_GMAIL_TOKEN`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/save-mail-token`
- **Source:** `login.api.ts` · service: `authentication.service.ts#saveGmailToken`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `data` (see service `saveGmailToken`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/save-mail-token?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.CLEAR_SESSION`

- **Method:** `DELETE`
- **Path template:** `users/:userUniqueName/destroy-session`
- **Source:** `login.api.ts` · service: `authentication.service.ts#ClearSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/users/SAMPLE_USER/destroy-session?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.DELETE_ALL_SESSION`

- **Method:** `DELETE`
- **Path template:** `users/:userEmail/sessions`
- **Source:** `login.api.ts` · service: `authentication.service.ts#DeleteAllSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/users/user%40example.com/sessions?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.DELETE_SESSION`

- **Method:** `POST`
- **Path template:** `users/:userEmail/destroy-session`
- **Source:** `login.api.ts` · service: `authentication.service.ts#DeleteSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `id` (see service `DeleteSession`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/users/user%40example.com/destroy-session?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.FETCH_DETAILS`

- **Method:** `GET`
- **Path template:** `users/:sessionId`
- **Source:** `login.api.ts` · service: `authentication.service.ts#FetchUserDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as UserDetails`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/users/YOUR_SESSION_ID?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.FORGOT_PASSWORD`

- **Method:** `PUT`
- **Path template:** `users/:userEmail/forgot-password`
- **Source:** `login.api.ts` · service: `authentication.service.ts#forgotPassword`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/users/user%40example.com/forgot-password?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.GET_AUTH_KEY`

- **Method:** `GET`
- **Path template:** `users/:uniqueName/get-auth-key`
- **Source:** `login.api.ts` · service: `authentication.service.ts#GetAuthKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AuthKeyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/users/SAMPLE_UNIQUE/get-auth-key?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.GET_SESSION`

- **Method:** `GET`
- **Path template:** `users/:userEmail/sessions`
- **Source:** `login.api.ts` · service: `authentication.service.ts#GetUserSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/users/user%40example.com/sessions?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.GET_USER_DETAILS_FROM_SESSION_ID`

- **Method:** `GET`
- **Path template:** `v2/user`
- **Source:** `login.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/user?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.GET_USER_SUBSCRIPTION_PLAN_API`

- **Method:** `GET`
- **Path template:** `subscriptions/all?countryCode=:countryCode`
- **Source:** `login.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/subscriptions/all?countryCode=IN&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.LOGIN_WITH_APPLE`

- **Method:** `POST`
- **Path template:** `v2/signup-with-apple`
- **Source:** `login.api.ts` · service: `authentication.service.ts#loginWithApple`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `data` (see service `loginWithApple`)
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/signup-with-apple?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.LOGIN_WITH_GOOGLE`

- **Method:** `POST`
- **Path template:** `v2/signup-with-google`
- **Source:** `login.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
JSON body — see matching service method (typed request model when available).
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/signup-with-google?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.LOGIN_WITH_OTP`

- **Method:** `POST`
- **Path template:** `v2/auth-login`
- **Source:** `login.api.ts` · service: `authentication.service.ts#loginWithOtp`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "email": "user@example.com", "otp": "123456" }
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/auth-login?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "email": "user@example.com", "otp": "123456" }'
```

---

### `LOGIN_API.LoginWithNumber`

- **Method:** `GET`
- **Path template:** `login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber`
- **Source:** `login.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/login-with-number?countryCode=IN&mobileNumber=9999999999&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `LOGIN_API.LoginWithPassword`

- **Method:** `POST`
- **Path template:** `v2/login-with-password`
- **Source:** `login.api.ts` · service: `authentication.service.ts#LoginWithPassword`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "email": "user@example.com", "password": "YOUR_PASSWORD" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VerifyMobileResponseModel`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/login-with-password?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "email": "user@example.com", "password": "YOUR_PASSWORD" }'
```

---

### `LOGIN_API.REGENERATE_AUTH_KEY`

- **Method:** `PUT`
- **Path template:** `users/:userEmail/generate-auth-key`
- **Source:** `login.api.ts` · service: `authentication.service.ts#RegenerateAuthKey`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{}
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as AuthKeyResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/users/user%40example.com/generate-auth-key?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.RENEW_SESSION`

- **Method:** `PUT`
- **Path template:** `users/:userUniqueName/increment-session`
- **Source:** `login.api.ts` · service: `authentication.service.ts#renewSession`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
null
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/users/SAMPLE_USER/increment-session?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.RESET_PASSWORD`

- **Method:** `PUT`
- **Path template:** `reset-password`
- **Source:** `login.api.ts` · service: `authentication.service.ts#resetPassword`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "uniqueName": "user@example.com", "password": "NEW_PASSWORD", "confirmPassword": "NEW_PASSWORD", "token": "RESET_TOKEN" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/reset-password?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "uniqueName": "user@example.com", "password": "NEW_PASSWORD", "confirmPassword": "NEW_PASSWORD", "token": "RESET_TOKEN" }'
```

---

### `LOGIN_API.SET_SETTINGS`

- **Method:** `PUT`
- **Path template:** `users/:userUniqueName/settings`
- **Source:** `login.api.ts` · service: `authentication.service.ts#SetSettings`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `SetSettings`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/users/SAMPLE_USER/settings?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.SignupWithEmail`

- **Method:** `POST`
- **Path template:** `signup-with-email`
- **Source:** `login.api.ts` · service: `authentication.service.ts#SignupWithEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "email": "user@example.com" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/signup-with-email?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "email": "user@example.com" }'
```

---

### `LOGIN_API.SignupWithMobile`

- **Method:** `POST`
- **Path template:** `generate-otp`
- **Source:** `login.api.ts` · service: `authentication.service.ts#SignupWithMobile`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "mobileNumber": "9999999999", "countryCode": "91" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/generate-otp?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "mobileNumber": "9999999999", "countryCode": "91" }'
```

---

### `LOGIN_API.SignupWithPassword`

- **Method:** `POST`
- **Path template:** `v2/signup`
- **Source:** `login.api.ts` · service: `authentication.service.ts#SignupWithPassword`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "email": "user@example.com", "password": "YOUR_PASSWORD", "mobileNumber": "9999999999", "countryCode": "91" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VerifyMobileResponseModel`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/signup?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "email": "user@example.com", "password": "YOUR_PASSWORD", "mobileNumber": "9999999999", "countryCode": "91" }'
```

---

### `LOGIN_API.VerifyEmail`

- **Method:** `POST`
- **Path template:** `v2/verify-email`
- **Source:** `login.api.ts` · service: `authentication.service.ts#VerifyEmail`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "email": "user@example.com", "verificationCode": "123456" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VerifyEmailResponseModel`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/verify-email?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "email": "user@example.com", "verificationCode": "123456" }'
```

---

### `LOGIN_API.VerifyNumber`

- **Method:** `POST`
- **Path template:** `users/system_admin/verify-number`
- **Source:** `login.api.ts` · service: `authentication.service.ts#VerifyNumber`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `modele` (see service `VerifyNumber`) | Request body: `modele` (see service `VerifyNumberOTP`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/users/system_admin/verify-number?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `LOGIN_API.VerifyOTP`

- **Method:** `POST`
- **Path template:** `v2/verify-number`
- **Source:** `login.api.ts` · service: `authentication.service.ts#VerifyOTP`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
{ "mobileNumber": "9999999999", "countryCode": "91", "verificationCode": "123456" }
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as VerifyMobileResponseModel`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/verify-number?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "mobileNumber": "9999999999", "countryCode": "91", "verificationCode": "123456" }'
```

---

### `PERMISSION_API.CREATE_ROLE`

- **Method:** `POST`
- **Path template:** `company/:companyUniqueName/role`
- **Source:** `permission.api.ts` · service: `permission.service.ts#CreateNewRole`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `CreateNewRole`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as CreateNewRoleResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `PERMISSION_API.DELETE_ROLE`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/role/:roleUniqueName`
- **Source:** `permission.api.ts` · service: `permission.service.ts#DeleteRole`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role/SAMPLE_roleUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PERMISSION_API.GET_ALL_PAGE_NAMES`

- **Method:** `GET`
- **Path template:** `scope-v2`
- **Source:** `permission.api.ts` · service: `permission.service.ts#GetAllPageNames`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IPageStr[]`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/scope-v2?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PERMISSION_API.GET_ROLE`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/role`
- **Source:** `permission.api.ts` · service: `permission.service.ts#GetAllRoles`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IRoleCommonResponseAndRequest[]`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `PERMISSION_API.UPDATE_ROLE`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/role/:roleUniqueName`
- **Source:** `permission.api.ts` · service: `permission.service.ts#UpdateRole`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdateRole`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IRoleCommonResponseAndRequest`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/role/SAMPLE_roleUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SETTINGS_INTEGRATION_API.GET_GMAIL_INTEGRATION_STATUS`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/gmail-token`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#GetGmailIntegrationStatus`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gmail-token?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_INTEGRATION_API.REMOVE_GMAIL_INTEGRATION`

- **Method:** `DELETE`
- **Path template:** `company/:companyUniqueName/gmail-token`
- **Source:** `settings.integration.api.ts` · service: `settings.integration.service.ts#RemoveGmailIntegration`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/gmail-token?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PERMISSION_API.GET`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/shared-with`
- **Source:** `settings.permission.api.ts` · service: `settings.permission.service.ts#GetUsersWithCompanyPermissions`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/shared-with?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PERMISSION_API.GET_APPROVAL_NAME`

- **Method:** `GET`
- **Path template:** `company/:companyUniqueName/shared-with?sortBy=mobile_verified`
- **Source:** `settings.permission.api.ts`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/shared-with?sortBy=mobile_verified&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SETTINGS_PERMISSION_API.UPDATE_PERMISSION`

- **Method:** `PUT`
- **Path template:** `company/:companyUniqueName/uer/:ueruniquename`
- **Source:** `settings.permission.api.ts` · service: `settings.permission.service.ts#UpdatePermission`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `UpdatePermission`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as IUpdatePermissionResponse`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PUT \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/uer/SAMPLE_ueruniquename?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

