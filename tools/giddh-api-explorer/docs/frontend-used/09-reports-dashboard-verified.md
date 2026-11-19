# Backend-Verified Frontend APIs: 09-reports-dashboard.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/project/:projectUniqueName/entry`

- **Frontend id:** `ACCOUNTING_API.CREATE_AND_DELETE_ENTRY`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#createEntry`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectEntryController#createProjectEntry
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectEntryController.java:48`
- **Deprecated:** No

Create Project Entry

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `List<ProjectEntryResource>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `account` | `NameUniqueNameImpl` | not declared | unconstrained |
| `entryUniqueName` | `String` | not declared | unconstrained |
| `particular` | `NameUniqueNameImpl` | not declared | unconstrained |
| `stock` | `NameUniqueNameImpl` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `category` | `String` | not declared | unconstrained |
| `calculationMethod` | `String` | not declared | unconstrained |
| `value` | `BigDecimal` | not declared | unconstrained |

Example:

```json
{
  "account": "string",
  "entryUniqueName": "string",
  "particular": "string",
  "stock": "string",
  "accountUniqueName": "string",
  "category": "string",
  "calculationMethod": "string",
  "value": 0
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `StaticMessageSource.getMessage("success.project.entry.created"`

```json
{
  "status": "success",
  "body": "success.project.entry.created"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/entry?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"account":"string","entryUniqueName":"string","particular":"string","stock":"string","accountUniqueName":"string","category":"string","calculationMethod":"string","value":0}'
```

---

### `POST /company/:companyUniqueName/project?branchUniqueName=:branchUniqueName`

- **Frontend id:** `ACCOUNTING_API.CREATE_PROJECT`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#createNewProject`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#createProject
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:46`
- **Deprecated:** No

Create Project

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ProjectResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `archiveStatus` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `projectEntries` | `List<ProjectEntryResource>` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "archiveStatus": "string",
  "status": "string",
  "projectEntries": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new ProjectResource(project`

```json
{
  "status": "success",
  "body": {
    "name": "string",
    "uniqueName": "string",
    "archiveStatus": "string",
    "status": "string",
    "projectEntries": []
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","archiveStatus":"string","status":"string","projectEntries":[]}'
```

---

### `DELETE /company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`

- **Frontend id:** `ACCOUNTING_API.DELETE_PROJECT`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#removeProject`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#deleteProject
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:130`
- **Deprecated:** No

Delete Project

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/accounts/:accountUniqueName/project-entries?from=:from&to=:to&page=:page&count=:count&branchUniqueName=:branchUniqueName&q=:q&categoryType=:category`

- **Frontend id:** `ACCOUNTING_API.ENTRY_SEARCH`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#searchEntry`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: EntryController#getProjectEntries
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/EntryController.java:81`
- **Deprecated:** No

Get Project Entries

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `accountUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `q` — type: `String`; optional; default: ``
- `categoryType` — type: `String`; optional; default: `income`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `projectEntries`

```json
{
  "status": "success",
  "body": {
    "reference": "projectEntries"
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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/accounts/SAMPLE_ACCOUNT/project-entries?from=01-04-2025&to=31-03-2026&page=1&count=50&q=&categoryType=income&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/project/:projectUniqueName/entries?category=:category&branchUniqueName=:branchUniqueName&page=:page&count=:count`

- **Frontend id:** `ACCOUNTING_API.GET_ALL_ENTRY`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#getAllEntryList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#getProjectEntries
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:86`
- **Deprecated:** No

Get Project Entries

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `category` — type: `String`; optional; default: `income`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `25`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/entries?category=income&page=1&count=25&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/project/all?branchUniqueName=:branchUniqueName&sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:searchQuery&queryColumn=:queryColumn`

- **Frontend id:** `ACCOUNTING_API.GET_ALL_PROJECTS`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#getAllProjects`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#getAllProject
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:112`
- **Deprecated:** No

Get All Project

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `STATUS`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `q` — type: `String`; optional; default: ``
- `queryColumn` — type: `String`; optional; default: `NAME`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/all?branchUniqueName=aaaa&sort=desc&sortBy=STATUS&page=1&count=20&q=&queryColumn=NAME' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/project/:projectUniqueName/net-profit?from=:from&to=:to`

- **Frontend id:** `ACCOUNTING_API.GET_NET_PROFIT`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#getProjectProfit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectReportController#profitLossForMultiBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectReportController.java:54`
- **Deprecated:** No

Profit Loss For Multi Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tax` — type: `String`; optional
- `considerOpeningBalance` — type: `boolean`; optional; default: `false`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/net-profit?from=01-04-2025&to=31-03-2026&tax=SAMPLE_tax&considerOpeningBalance=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`

- **Frontend id:** `ACCOUNTING_API.GET_PROJECT`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#getProjectById`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#getProject
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:73`
- **Deprecated:** No

Get Project

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new ProjectResource(project`

```json
{
  "status": "success",
  "body": {
    "name": "string",
    "uniqueName": "string",
    "archiveStatus": "string",
    "status": "string",
    "projectEntries": []
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/project/:projectUniqueName/profit-loss?from=:from&to=:to`

- **Frontend id:** `ACCOUNTING_API.GET_PROJECT_PROFIT_LOSS`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#getProjectProfitAndLoss`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectReportController#profitLossForMultiBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectReportController.java:54`
- **Deprecated:** No

Profit Loss For Multi Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tax` — type: `String`; optional
- `considerOpeningBalance` — type: `boolean`; optional; default: `false`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/profit-loss?from=01-04-2025&to=31-03-2026&tax=SAMPLE_tax&considerOpeningBalance=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/project/:projectUniqueName/category-total?category=:category`

- **Frontend id:** `ACCOUNTING_API.GET_TOTAL_REVENUE_EXPENSES`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#getTotalRevenueAndExpense`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#getRevenueOrExpenseTotalOfProject
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:100`
- **Deprecated:** No

Get Revenue Or Expense Total Of Project

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `category` — type: `String`; optional; default: `income`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `amounts`

```json
{
  "status": "success",
  "body": {
    "reference": "amounts"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/category-total?category=income&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/project/:projectUniqueName/entry/:entryUniqueName`

- **Frontend id:** `ACCOUNTING_API.UPDATE_ENTRY`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#updateEntry`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectEntryController#updateProjectEntry
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectEntryController.java:62`
- **Deprecated:** No

Update Project Entry

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
- `entryUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ProjectEntryResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `account` | `NameUniqueNameImpl` | not declared | unconstrained |
| `entryUniqueName` | `String` | not declared | unconstrained |
| `particular` | `NameUniqueNameImpl` | not declared | unconstrained |
| `stock` | `NameUniqueNameImpl` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `category` | `String` | not declared | unconstrained |
| `calculationMethod` | `String` | not declared | unconstrained |
| `value` | `BigDecimal` | not declared | unconstrained |

Example:

```json
{
  "account": "string",
  "entryUniqueName": "string",
  "particular": "string",
  "stock": "string",
  "accountUniqueName": "string",
  "category": "string",
  "calculationMethod": "string",
  "value": 0
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponseSuccess>`
- Body evidence: `StaticMessageSource.getMessage("success.project.entry.updated"`

```json
{
  "status": "success",
  "body": "success.project.entry.updated"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName/entry/SAMPLE_ENTRY?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"account":"string","entryUniqueName":"string","particular":"string","stock":"string","accountUniqueName":"string","category":"string","calculationMethod":"string","value":0}'
```

---

### `PATCH /company/:companyUniqueName/project/:projectUniqueName?branchUniqueName=:branchUniqueName`

- **Frontend id:** `ACCOUNTING_API.UPDATE_PROJECT`
- **Frontend evidence:** `apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#createNewProject; apps/web-giddh/src/app/project-wise-accounting/project-wise-accounting.service.ts#editProjectDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ProjectController#updateProject
- **Backend source:** `src/main/java/com/giddh/api/controllers/ProjectController.java:59`
- **Deprecated:** No

Update Project

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `projectUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ProjectResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `archiveStatus` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `projectEntries` | `List<ProjectEntryResource>` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "archiveStatus": "string",
  "status": "string",
  "projectEntries": []
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

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/project/SAMPLE_projectUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","archiveStatus":"string","status":"string","projectEntries":[]}'
```

---

### `GET /v2/company/:companyUniqueName/reports/all-reports`

- **Frontend id:** `ALL_REPORTS_API.GET_ALL`
- **Frontend evidence:** `apps/web-giddh/src/app/all-reports/utility/all-reports.service.ts#getAllReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getFavoriteReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:620`
- **Deprecated:** No

Get Favorite Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyReportService.getFavoriteReportData(company, principal, branch, refresh`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/all-reports?branchUniqueName=aaaa&refresh=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/reports/save-report-data`

- **Frontend id:** `ALL_REPORTS_API.SAVE_FAVORITES`
- **Frontend evidence:** `apps/web-giddh/src/app/all-reports/utility/all-reports.service.ts#saveFavoriteReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#saveFavoriteReportModule
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:608`
- **Deprecated:** No

Save Favorite Report Module

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `List<NameUniqueNameModel>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyReportService.saveFavoriteReportData(company, principal, branch, favoriteReportList`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/save-report-data?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string"}'
```

---

### `POST /company/:companyUniqueName/forecast`

- **Frontend id:** `BUDGET_FORECASTING_API.GET_FORECAST`
- **Frontend evidence:** `apps/web-giddh/src/app/budget-forecasting/utility/budget-forecasting.service.ts#getForecast`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#foreCastData
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:1011`
- **Deprecated:** No

Fore Cast Data

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/forecast?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `POST /company/:companyUniqueName/vouchers/voucher-status-count?from=:fromDate&to=:toDate&type=:type&voucherVersion=2`

- **Frontend id:** `DASHBOARD_API.GET_PENDING_VOUCHERS_COUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/dashboard.service.ts#getPendingVouchersCount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: VoucherController#getVoucherStatusCount
- **Backend source:** `src/main/java/com/giddh/api/controllers/VoucherController.java:185`
- **Deprecated:** No

Get Voucher Status Count

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `type` — type: `String`; optional; default: `sales`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/vouchers/voucher-status-count?from=01-04-2025&to=31-03-2026&type=sales&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/calculateRatios?date=:date&refresh=:refresh`

- **Frontend id:** `DASHBOARD_API.RATIO_ANALYSIS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/dashboard.service.ts#GetRationAnalysis`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportController#calculateRatios
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ReportController.java:321`
- **Deprecated:** No

Calculate Ratios

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `considerOpeningBalance` — type: `boolean`; optional; default: `true`
- `branchUniqueName` — type: `String`; optional
- `date` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyReportService.calculateRatios(company, date, request, principal, considerOpeningBalance, "", branch`

```json
{
  "status": "success",
  "body": ""
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
- `body as BankAccountsResponse[]`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/calculateRatios?considerOpeningBalance=true&branchUniqueName=aaaa&date=SAMPLE_date' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/dashboard/graph?currentFrom=:currentFrom&currentTo=:currentTo&previousFrom=:previousFrom&previousTo=:previousTo&interval=:interval&type=:type&uniqueName=:uniqueName&refresh=:refresh`

- **Frontend id:** `DASHBOARD_API.REVENUE_GRAPH_DATA`
- **Frontend evidence:** `apps/web-giddh/src/app/services/dashboard.service.ts#GetRevenueGraphData`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: DashboardController#createGraphBasedOnType
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/DashboardController.java:61`
- **Deprecated:** No

Create Graph Based On Type

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `currentFrom` — type: `String`; optional
- `currentTo` — type: `String`; optional
- `previousFrom` — type: `String`; optional
- `previousTo` — type: `String`; optional
- `type` — type: `String`; optional; default: `group`
- `uniqueName` — type: `String`; optional; default: `sales`
- `interval` — type: `String`; optional; default: `monthly`
- `refresh` — type: `boolean`; optional; default: `false`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `dashboardGraph`

```json
{
  "status": "success",
  "body": {
    "reference": "dashboardGraph"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/dashboard/graph?currentFrom=SAMPLE_currentFrom&currentTo=SAMPLE_currentTo&previousFrom=SAMPLE_previousFrom&previousTo=SAMPLE_previousTo&type=group&uniqueName=sales&interval=monthly&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/graph-types`

- **Frontend id:** `DASHBOARD_API.REVENUE_GRAPH_TYPES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/dashboard.service.ts#GetRevenueGraphTypes`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UIController#graphTypes
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UIController.java:90`
- **Deprecated:** No

Graph Types

#### Inputs

No request inputs.

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `JsonUtil.readJson("/db/seed/graph_types.json", new TypeReference<List<HashMap>>() { }`

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
- `body as GraphTypesResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/ui/graph-types' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/cash-flow-download-v2?from=:from&to=:to&fileType=base64`

- **Frontend id:** `Report`
- **Frontend evidence:** `cashflowstatement.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: ReportV2Controller#downloadCashFlowStatementV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:538`
- **Deprecated:** No

Download Cash Flow Statement V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `fileType` — type: `String`; optional; default: `base64`
- `branchUniqueName` — type: `String`; optional

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/cash-flow-download-v2?from=01-04-2025&to=31-03-2026&fileType=base64&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/new-old-sales/details?value=:value&type=:type&dataType=:dataType&page=:page&count=:count&q=:q&sort=:sort&sortBy=:sortBy&fromDate=:fromDate&toDate=:toDate&salesFrom=:salesFrom`

- **Frontend id:** `SALES_BIFURCATION_API`
- **Frontend evidence:** `sales-bifurcation-details.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: CompanyController#getDetailedSalesList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:979`
- **Deprecated:** No

Get Detailed Sales List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `type` — type: `String`; required
- `value` — type: `String`; required
- `dataType` — type: `String`; required
- `fromDate` — type: `String`; required
- `toDate` — type: `String`; required
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `q` — type: `String`; optional; default: ``
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `date`
- `salesFrom` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SalesPersonBifurcationRequest` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `duration` | `String` | not declared | unconstrained |
| `salesPersonUniqueNames` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "duration": "string",
  "salesPersonUniqueNames": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyService.getDetailedSalesList(company, branch, dataType, accountStart, accountEnd, type, value, page, count, q, sort, sortBy, salesFrom, salesPersonList`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/new-old-sales/details?type=SAMPLE_type&value=SAMPLE_value&dataType=SAMPLE_dataType&fromDate=SAMPLE_fromDate&toDate=SAMPLE_toDate&page=1&count=50&q=&sort=desc&sortBy=date&salesFrom=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"duration":"string","salesPersonUniqueNames":[]}'
```

---

### `GET /company/:companyUniqueName/v2/balance-sheet-collapsed-download-v2`

- **Frontend id:** `TB_PL_BS_API.DOWNLOAD_BALANCE_SHEET_EXCEL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#DownloadBalanceSheetExcel`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportController#balanceSheetCollapsedV2WithExportSetting
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ReportController.java:102`
- **Deprecated:** No

Balance Sheet Collapsed V2With Export Setting

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tagName` — type: `String`; optional
- `tax` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `true`
- `considerOpeningBalance` — type: `boolean`; optional; default: `true`
- `branchUniqueName` — type: `String`; optional
- `view` — type: `String`; optional; default: `collapsed`

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
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v2/balance-sheet-collapsed-download-v2?from=01-04-2025&to=31-03-2026&tagName=SAMPLE_tagName&tax=SAMPLE_tax&refresh=true&considerOpeningBalance=true&branchUniqueName=aaaa&view=collapsed' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/v2/profit-loss-collapsed-download-v2`

- **Frontend id:** `TB_PL_BS_API.DOWNLOAD_PROFIT_LOSS_EXCEL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#DownloadProfitLossExcel`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportController#profitAndLossCollapsedV2WithExportSetting
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ReportController.java:211`
- **Deprecated:** No

Profit And Loss Collapsed V2With Export Setting

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tagName` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `true`
- `considerOpeningBalance` — type: `boolean`; optional; default: `false`
- `fileType` — type: `String`; optional; default: `base64`
- `branchUniqueName` — type: `String`; optional
- `view` — type: `String`; optional; default: `collapsed`
- `tax` — type: `String`; optional
- `compareType` — type: `String`; optional
- `compareValue` — type: `String`; optional

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v2/profit-loss-collapsed-download-v2?from=01-04-2025&to=31-03-2026&tagName=SAMPLE_tagName&refresh=true&considerOpeningBalance=false&fileType=base64&branchUniqueName=aaaa&view=collapsed&tax=SAMPLE_tax&compareType=SAMPLE_compareType&compareValue=SAMPLE_compareValue' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/trial-balance-export-v2`

- **Frontend id:** `TB_PL_BS_API.DOWNLOAD_TRIAL_BALANCE_EXCEL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#DownloadTrialBalanceExcel`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportController#trialBalanceExportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ReportController.java:285`
- **Deprecated:** No

Trial Balance Export V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `export` — type: `String`; optional; default: `all`
- `q` — type: `String`; optional; default: ``
- `refresh` — type: `boolean`; optional; default: `true`
- `fileType` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional

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
| 400 | `ERROR` | `RuntimeException` | RuntimeException raised by controller or shared ExceptionHandler |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": "ERROR",
  "message": "Runtime"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/trial-balance-export-v2?from=01-04-2025&to=31-03-2026&export=all&q=&refresh=true&fileType=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/multibranch/balance-sheet`

- **Frontend id:** `TB_PL_BS_API.GET_BALANCE_SHEET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#GetBalanceSheet`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#balanceSheetForMultiBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:190`
- **Deprecated:** No

Balance Sheet For Multi Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`
- `tagName` — type: `String`; optional
- `considerOpeningBalance` — type: `boolean`; optional; default: `true`
- `tax` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `balanceSheetResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "balanceSheetResponse"
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
- `body as AccountDetails`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/balance-sheet?from=01-04-2025&to=31-03-2026&refresh=false&tagName=SAMPLE_tagName&considerOpeningBalance=true&tax=SAMPLE_tax&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/cogs`

- **Frontend id:** `TB_PL_BS_API.GET_COGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#GetCogs`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#calculateCogs
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:226`
- **Deprecated:** No

Calculate Cogs

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tagName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `cogs`

```json
{
  "status": "success",
  "body": {
    "reference": "cogs"
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
- `body as GetCogsResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/cogs?from=01-04-2025&to=31-03-2026&tagName=SAMPLE_tagName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/multibranch/compared-profit-loss?tax=30`

- **Frontend id:** `TB_PL_BS_API.GET_COMPARED_PROFIT_LOSS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#getComparedProfitLoss`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#comparedProfitLossForMultiBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:571`
- **Deprecated:** No

Compared Profit Loss For Multi Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `refresh` — type: `boolean`; optional; default: `false`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tax` — type: `String`; optional
- `tagName` — type: `String`; optional; default: ``
- `considerOpeningBalance` — type: `boolean`; optional; default: `false`
- `branchUniqueName` — type: `String`; optional
- `compareType` — type: `String`; optional
- `compareValue` — type: `String`; optional
- `projectUniqueName` — type: `String`; optional

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
- `body as AccountDetails`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/compared-profit-loss?refresh=false&from=01-04-2025&to=31-03-2026&tax=SAMPLE_tax&tagName=&considerOpeningBalance=false&branchUniqueName=aaaa&compareType=SAMPLE_compareType&compareValue=SAMPLE_compareValue&projectUniqueName=SAMPLE_projectUniqueName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/multicompany/:reportType`

- **Frontend id:** `TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#getMultiCurrencyReport; apps/web-giddh/src/app/services/tl-pl.service.ts#createMultiCurrencyReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getReportForMultipleCompanies
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:154`
- **Deprecated:** No

The purpose of this API is to fetch the Reports from mongo

#### Inputs

**Path parameters**
- `reportType` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `giddhReportsResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "giddhReportsResponse"
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
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multicompany/SAMPLE_reportType?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/multicompany/:reportType`

- **Frontend id:** `TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#getMultiCurrencyReport; apps/web-giddh/src/app/services/tl-pl.service.ts#createMultiCurrencyReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#createMultiCurrencyReportForMultipleCompanies
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:133`
- **Deprecated:** No

Create Multi Currency Report For Multiple Companies

#### Inputs

**Path parameters**
- `reportType` — type: `String`; required

#### Controller-backed request payload

Type: `ReportRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `reportCurrency` | `String` | not declared | unconstrained |
| `from` | `String` | not declared | unconstrained |
| `to` | `String` | not declared | unconstrained |
| `companies` | `List<CompanyDateRequest>` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `from` | `String` | not declared | unconstrained |
| `to` | `String` | not declared | unconstrained |

Example:

```json
{
  "reportCurrency": "string",
  "from": "string",
  "to": "string",
  "companies": [],
  "name": "string",
  "uniqueName": "string"
}
```

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multicompany/SAMPLE_reportType?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"reportCurrency":"string","from":"string","to":"string","companies":[],"name":"string","uniqueName":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/multibranch/profit-loss?tax=30`

- **Frontend id:** `TB_PL_BS_API.GET_PROFIT_LOSS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#GetProfitLoss`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#profitLossForMultiBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:165`
- **Deprecated:** No

Profit Loss For Multi Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `refresh` — type: `boolean`; optional; default: `false`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `tax` — type: `String`; optional
- `tagName` — type: `String`; optional; default: ``
- `considerOpeningBalance` — type: `boolean`; optional; default: `false`
- `branchUniqueName` — type: `String`; optional

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
- `body as AccountDetails`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/profit-loss?refresh=false&from=01-04-2025&to=31-03-2026&tax=SAMPLE_tax&tagName=&considerOpeningBalance=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/multibranch/trial-balance`

- **Frontend id:** `TB_PL_BS_API.GET_TRIAL_BALANCE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#GetTrailBalance`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#createTrialBalanceForMultipleBranch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:111`
- **Deprecated:** No

Create Trial Balance For Multiple Branch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `refresh` — type: `boolean`; optional; default: `false`
- `tagName` — type: `String`; optional; default: ``
- `branchUniqueName` — type: `String`; optional
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `trialBalanceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "trialBalanceResponse"
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
- `body as AccountDetails`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/multibranch/trial-balance?from=01-04-2025&to=31-03-2026&refresh=false&tagName=&branchUniqueName=aaaa&lang=StaticMessageSource.DEFAULT_LANG' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/reports/entity-status?from=:from&to=:to&reportType=:reportType`

- **Frontend id:** `TB_PL_BS_API.TAILED_REPORT_ACCOUNT_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#tailedReportAccountGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#updateReportsEntityStatus
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:97`
- **Deprecated:** No

Update Reports Entity Status

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `reportType` — type: `String`; required

#### Controller-backed request payload

Type: `List<CheckedColumnsRequest>` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueName` | `String` | not declared | unconstrained |
| `entityType` | `String` | not declared | unconstrained |
| `checked` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "uniqueName": "string",
  "entityType": "string",
  "checked": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyReportService.saveFinancialReportCheckedResponse(checkedColumnsRequest, company, principal, reportType, branch, from, to`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/entity-status?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&reportType=SAMPLE_reportType' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueName":"string","entityType":"string","checked":false}'
```

---

### `POST /v2/company/:companyUniqueName/reports/entity-selection?reportType=:reportType`

- **Frontend id:** `TB_PL_BS_API.TAILED_REPORT_DATE_RANGE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/tl-pl.service.ts#getReconcileDateRange`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ReportV2Controller#getReportModeStatus
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ReportV2Controller.java:597`
- **Deprecated:** No

Get Report Mode Status

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `reportType` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `companyReportService.getReportModeStatus(company, principal, reportType, branch`

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
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/reports/entity-selection?branchUniqueName=aaaa&reportType=SAMPLE_reportType' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

