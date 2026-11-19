# Search API Controller API

Generated from production Spring controllers in `/Users/divyanshu/Downloads/giddha-giddh-search-api-a9ab0faf66ed`. Values are finite only when supported by controller annotations, Java enums, DTO constraints, or explicit validation evidence; otherwise they are marked unconstrained.

| Metric | Count |
|---|---:|
| Controllers | 4 |
| Handler methods | 17 |
| Expanded routes | 17 |
| Deprecated routes | 1 |

### `GET /`

Ok

- **Controller:** `MainController#ok`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:25`
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

### `GET /company/{companyUniqueName}/account-search`

Account Search

- **Controller:** `SearchController#accountSearch`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:54`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `withStocks` — type: `boolean`; optional; default: `false`
- `stockAccountUniqueName` — type: `String`; optional; default: ``
- `accountUniqueName` — type: `String`; optional; default: ``

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/account-search?q=&group=&page=1&withStocks=false&stockAccountUniqueName=&accountUniqueName=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/account-search-2`

Account Search2

- **Controller:** `SearchController#accountSearch2`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:148`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `exceptGroups` — type: `String`; optional; default: ``
- `includeSearchedGroup` — type: `boolean`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `refresh` — type: `boolean`; optional; default: `false`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/account-search-2?q=&group=&exceptGroups=&includeSearchedGroup=false&page=1&count=20&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/account-search-predicted`

Account Search Predicted

- **Controller:** `SearchController#accountSearchPredicted`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:199`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `accountUniqueName` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Request payload

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

### `GET /company/{companyUniqueName}/brief-accounts`

Brief Accounts

- **Controller:** `CompanyController#briefAccounts`
- **Source:** `src/main/java/com/giddh/api/controllers/CompanyController.java:50`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `group` — type: `String`; optional; default: ``
- `exceptGroups` — type: `String`; optional; default: ``
- `currency` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/brief-accounts?group=&exceptGroups=&currency=&page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/cmdk`

Cmd KSearch

- **Controller:** `CompanyController#cmdKSearch`
- **Source:** `src/main/java/com/giddh/api/controllers/CompanyController.java:74`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

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

#### Request payload

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/cmdk?branchUniqueName=aaaa&q=&group=&page=1&count=20&refresh=false&isMobile=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/group-search`

Group Search

- **Controller:** `SearchController#groupSearch`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:121`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `removeTop` — type: `boolean`; optional; default: `false`
- `onlyTop` — type: `boolean`; optional; default: `false`
- `includeSearchedGroup` — type: `boolean`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `refresh` — type: `boolean`; optional; default: `false`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/group-search?q=&group=&removeTop=false&onlyTop=false&includeSearchedGroup=false&page=1&count=20&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/groups/{groupUniqueName}/masters`

Group Masters

- **Controller:** `MastersController#groupMasters`
- **Source:** `src/main/java/com/giddh/api/controllers/MastersController.java:46`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`
- `accountArchiveStatus` — type: `String`; optional; default: `UNARCHIVED`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/masters?page=1&count=10&accountArchiveStatus=UNARCHIVED&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/{companyUniqueName}/inventory-search`

Inventory Search

- **Controller:** `SearchController#inventorySearch`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:212`
- **Deprecated:** No
- **Consumes:** `MediaType.APPLICATION_JSON_VALUE`
- **Produces:** not declared
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Request payload

Type: `InventorySearchFilter` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `stockGroupUniqueNames` | `List<String>` | not declared | unconstrained |
| `stockUniqueNames` | `List<String>` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `q` | `String` | not declared | unconstrained |
| `page` | `Integer` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |
| `companyId` | `Long` | not declared | unconstrained |
| `searchPage` | `String` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |

Example:

```json
{
  "stockGroupUniqueNames": [],
  "stockUniqueNames": [],
  "variantUniqueNames": [],
  "q": "string",
  "page": 0,
  "count": 0,
  "companyId": 0,
  "searchPage": "string",
  "inventoryType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `searchResult`

```json
{
  "status": "success",
  "body": {
    "reference": "searchResult"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-search?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"stockGroupUniqueNames":[],"stockUniqueNames":[],"variantUniqueNames":[],"q":"string","page":0,"count":0,"companyId":0,"searchPage":"string","inventoryType":"string"}'
```

---

### `GET /company/{companyUniqueName}/inventory/{stockGroupUniqueName}/masters`

Inventory Masters

- **Controller:** `MastersController#inventoryMasters`
- **Source:** `src/main/java/com/giddh/api/controllers/MastersController.java:63`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `100`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<?>`
- Body evidence: `paginatedResponse`

```json
{
  "reference": "paginatedResponse"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/SAMPLE_STOCK_GROUP/masters?page=1&count=100&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/particular-search`

Particular Search

- **Controller:** `SearchController#particularSearch`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:175`
- **Deprecated:** **Yes**
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `exceptGroups` — type: `String`; optional; default: ``
- `searchKey` — type: `SearchKey`; optional; default: `ALL`; allowed: `STOCK`, `ACCOUNT`, `ALL`
- `includeSearchedGroup` — type: `boolean`; optional; default: `false`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`
- `refresh` — type: `boolean`; optional; default: `false`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/particular-search?q=&group=&exceptGroups=&searchKey=ALL&includeSearchedGroup=false&page=1&count=10&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/stock-groups-with-stocks`

Stock Groups With Stocks

- **Controller:** `MastersController#stockGroupsWithStocks`
- **Source:** `src/main/java/com/giddh/api/controllers/MastersController.java:92`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `refresh` — type: `boolean`; optional; default: `false`
- `inventoryType` — type: `String`; optional

#### Request payload

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-groups-with-stocks?q=&refresh=false&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/top-inventory-groups`

Top Inventory Groups

- **Controller:** `MastersController#topInventoryGroups`
- **Source:** `src/main/java/com/giddh/api/controllers/MastersController.java:78`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `100`
- `inventoryType` — type: `String`; optional

#### Request payload

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/top-inventory-groups?page=1&count=100&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/top-shared-groups`

Top Shared Groups

- **Controller:** `MastersController#topSharedGroups`
- **Source:** `src/main/java/com/giddh/api/controllers/MastersController.java:106`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/top-shared-groups?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/v2/account-search`

Account Search V2

- **Controller:** `SearchController#accountSearchV2`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:77`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `withStocks` — type: `boolean`; optional; default: `false`
- `stockAccountUniqueName` — type: `String`; optional; default: ``
- `accountUniqueName` — type: `String`; optional; default: ``

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EXECUTION",
  "message": "Execution"
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v2/account-search?q=&group=&page=1&count=50&withStocks=false&stockAccountUniqueName=&accountUniqueName=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/{companyUniqueName}/v3/account-search`

Account Search V3

- **Controller:** `SearchController#accountSearchV3`
- **Source:** `src/main/java/com/giddh/api/controllers/SearchController.java:99`
- **Deprecated:** No
- **Consumes:** not declared
- **Produces:** `MediaType.APPLICATION_JSON_VALUE`
- **Authentication:** `Auth-Key` (or service-supported session authentication)

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `group` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `withStocks` — type: `boolean`; optional; default: `false`
- `stockAccountUniqueName` — type: `String`; optional; default: ``
- `accountUniqueName` — type: `String`; optional; default: ``

#### Request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `paginatedResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "paginatedResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "EXECUTION",
  "message": "Execution"
}
```

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/v3/account-search?q=&group=&page=1&count=50&withStocks=false&stockAccountUniqueName=&accountUniqueName=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /env`

Env

- **Controller:** `MainController#env`
- **Source:** `src/main/java/com/giddh/api/controllers/MainController.java:30`
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
    "message": "string",
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

