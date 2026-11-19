# Backend-Verified Frontend APIs: 07-inventory-manufacturing.md

Only exact HTTP method + normalized controller-path matches are included.

### `POST /company/:companyUniqueName/batch/:batchUniqueName/archive`

- **Frontend id:** `INVENTORY_API.BATCH.ARCHIVE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#archiveBatch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#archiveBatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:262`
- **Deprecated:** No

Soft-delete ({@code isActive = 1}) only if the batch is not on a voucher or DC/RC.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `batchUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `SalesPersonResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | NotNull | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `email` | `String` | NotNull | unconstrained |
| `mobileNumber` | `String` | NotNull | unconstrained |
| `archiveStatus` | `String` | not declared | unconstrained |
| `linkedEntities` | `List<String>` | not declared | unconstrained |
| `archiveOnly` | `boolean` | not declared | unconstrained |
| `action` | `ApiCommonEnums` | not declared | PRINCIPAL, COMPANY_UNIQUE_NAME_PATH_PARAM, DUEPERIOD, PAGE, COUNT, RAZORPAY, TRANSFER, UNASSIGNED, UNARCHIVED, CONTENT_TYPE, MESSAGING_PRODUCT, TYPE, POLICY, LANGUAGE_CODE |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "email": "string",
  "mobileNumber": "string",
  "archiveStatus": "string",
  "linkedEntities": [],
  "archiveOnly": false,
  "action": "PRINCIPAL"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.archiveBatch(company, batchUniqueName, archiveRequest, principal`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName/archive?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","email":"string","mobileNumber":"string","archiveStatus":"string","linkedEntities":[],"archiveOnly":false,"action":"PRINCIPAL"}'
```

---

### `GET /company/:companyUniqueName/batch/availability?uniqueName=:uniqueName&isVariant=:isVariant&page=:page&count=:count&excludeBatchUniqueName=:excludeBatchUniqueName&sort=:sort&sortBy=:sortBy&q=:q&noStock=:noStock&warehouseUniqueName=:warehouseUniqueName&reportNature=:reportNature`

- **Frontend id:** `INVENTORY_API.BATCH.AVAILABILITY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getBatchAvailability`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#getAvailability
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:59`
- **Deprecated:** No

Unified batch availability for picker / batch-to-batch transfer.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `uniqueName` — type: `String`; optional
- `isVariant` — type: `boolean`; optional; default: `false`
- `noStock` — type: `boolean`; optional; default: `false`
- `warehouseUniqueName` — type: `String`; optional
- `excludeBatchUniqueName` — type: `String`; optional
- `q` — type: `String`; optional
- `page` — type: `Integer`; optional
- `count` — type: `Integer`; optional
- `sortBy` — type: `String`; optional; default: `expiryDate`
- `sort` — type: `String`; optional; default: `asc`
- `reportNature` — type: `String`; optional
- `inventoryMode` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.getAvailability(company, uniqueName, isVariant, warehouseUniqueName, excludeBatchUniqueName, page, count, sortBy, sort, noStock, q, physical`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/availability?uniqueName=SAMPLE_UNIQUE_NAME&isVariant=false&noStock=false&warehouseUniqueName=SAMPLE_warehouseUniqueName&excludeBatchUniqueName=SAMPLE_excludeBatchUniqueName&q=&page=1&count=20&sortBy=expiryDate&sort=asc&reportNature=SAMPLE_reportNature&inventoryMode=SAMPLE_inventoryMode&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/batch`

- **Frontend id:** `INVENTORY_API.BATCH.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createBatch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#createBatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:168`
- **Deprecated:** No

Create batch. Mandatory: name (uniqueName generated if omitted).

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BatchResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueName` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `batchNumber` | `String` | not declared | unconstrained |
| `archive` | `Boolean` | not declared | unconstrained |
| `manufacturingDate` | `String` | not declared | unconstrained |
| `expiryDate` | `String` | not declared | unconstrained |
| `createdAt` | `String` | not declared | unconstrained |
| `availableQuantity` | `BigDecimal` | not declared | unconstrained |
| `openingQuantity` | `BigDecimal` | not declared | unconstrained |
| `inwardQuantity` | `BigDecimal` | not declared | unconstrained |
| `outwardQuantity` | `BigDecimal` | not declared | unconstrained |
| `daysRemaining` | `Integer` | not declared | unconstrained |
| `stock` | `NameUniqueNameModel` | not declared | unconstrained |
| `variant` | `NameUniqueNameModel` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameModel` | not declared | unconstrained |
| `belongsToVariant` | `Boolean` | not declared | unconstrained |
| `linkedEntities` | `List<String>` | not declared | unconstrained |
| `isUsed` | `Boolean` | not declared | unconstrained |
| `archiveStatus` | `String` | not declared | unconstrained |
| `archiveOnly` | `boolean` | not declared | unconstrained |
| `warehouses` | `List<BatchWarehouseBalanceResource>` | not declared | unconstrained |
| `openingAmount` | `BigDecimal` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |

Example:

```json
{
  "uniqueName": "string",
  "name": "string",
  "batchNumber": "string",
  "archive": false,
  "manufacturingDate": "string",
  "expiryDate": "string",
  "createdAt": "string",
  "availableQuantity": 0,
  "openingQuantity": 0,
  "inwardQuantity": 0,
  "outwardQuantity": 0,
  "daysRemaining": 0,
  "stock": "string",
  "variant": "string",
  "warehouse": "string",
  "belongsToVariant": false,
  "linkedEntities": [],
  "isUsed": false,
  "archiveStatus": "string",
  "archiveOnly": false,
  "warehouses": [],
  "openingAmount": 0,
  "amount": 0,
  "quantity": 0
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.createBatch(company, batchResource, principal`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueName":"string","name":"string","batchNumber":"string","archive":false,"manufacturingDate":"string","expiryDate":"string","createdAt":"string","availableQuantity":0,"openingQuantity":0,"inwardQuantity":0,"outwardQuantity":0,"daysRemaining":0,"stock":"string","variant":"string","warehouse":"string","belongsToVariant":false,"linkedEntities":[],"isUsed":false,"archiveStatus":"string","archiveOnly":false,"warehouses":[],"openingAmount":0,"amount":0,"quantity":0}'
```

---

### `DELETE /company/:companyUniqueName/batch/:batchUniqueName`

- **Frontend id:** `INVENTORY_API.BATCH.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#deleteBatch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#deleteBatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:245`
- **Deprecated:** No

Update batch details (name, manufacturing/expiry dates, optional rename via newBatchNumber,

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `batchUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.deleteBatch(company, batchUniqueName, principal`

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
| 406 | `CUSTOM_EXCEPTION_WITH_ERROR_DETAILS` | `CustomExceptionWithErrorDetails` | CustomExceptionWithErrorDetails raised by controller or shared ExceptionHandler |
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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/batch/:batchUniqueName`

- **Frontend id:** `INVENTORY_API.BATCH.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getBatch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#getBatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:182`
- **Deprecated:** No

Create batch. Mandatory: name (uniqueName generated if omitted).

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `batchUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.getBatchDetails(company, batchUniqueName`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/batch/all?page=:page&count=:count&from=:from&to=:to&reportNature=:reportNature`

- **Frontend id:** `INVENTORY_API.BATCH.GET_ALL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getAllBatches`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#getAllBatches
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:199`
- **Deprecated:** No

Get single batch details by uniqueName: stock/variant, mfg/expiry, days remaining,

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional
- `count` — type: `Integer`; optional
- `inventoryType` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `createdAt`
- `sort` — type: `String`; optional; default: `desc`
- `reportNature` — type: `String`; optional
- `inventoryMode` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BatchListFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `stockUniqueNames` | `Set<String>` | not declared | unconstrained |
| `variantUniqueNames` | `Set<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `Set<String>` | not declared | unconstrained |
| `batchUniqueNames` | `Set<String>` | not declared | unconstrained |
| `batchNames` | `Set<String>` | not declared | unconstrained |
| `batchNumbers` | `Set<String>` | not declared | unconstrained |
| `available` | `Boolean` | not declared | unconstrained |
| `expiryFrom` | `String` | not declared | unconstrained |
| `expiryTo` | `String` | not declared | unconstrained |
| `manufacturingFrom` | `String` | not declared | unconstrained |
| `manufacturingTo` | `String` | not declared | unconstrained |
| `withinDays` | `Integer` | not declared | unconstrained |
| `expiredOnly` | `Boolean` | not declared | unconstrained |
| `archive` | `Boolean` | not declared | unconstrained |
| `includeArchived` | `Boolean` | not declared | unconstrained |
| `inventoryType` | `InventoryType` | not declared | PRODUCT, SERVICE, FIXED_ASSETS |
| `reportNature` | `String` | not declared | unconstrained |

Example:

```json
{
  "stockUniqueNames": [],
  "variantUniqueNames": [],
  "warehouseUniqueNames": [],
  "batchUniqueNames": [],
  "batchNames": [],
  "batchNumbers": [],
  "available": false,
  "expiryFrom": "string",
  "expiryTo": "string",
  "manufacturingFrom": "string",
  "manufacturingTo": "string",
  "withinDays": 0,
  "expiredOnly": false,
  "archive": false,
  "includeArchived": false,
  "inventoryType": "PRODUCT",
  "reportNature": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.getAllBatchesPaginated(company, filter`

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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/all?q=&from=01-04-2025&to=31-03-2026&page=1&count=20&inventoryType=SAMPLE_inventoryType&sortBy=createdAt&sort=desc&reportNature=SAMPLE_reportNature&inventoryMode=SAMPLE_inventoryMode&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"stockUniqueNames":[],"variantUniqueNames":[],"warehouseUniqueNames":[],"batchUniqueNames":[],"batchNames":[],"batchNumbers":[],"available":false,"expiryFrom":"string","expiryTo":"string","manufacturingFrom":"string","manufacturingTo":"string","withinDays":0,"expiredOnly":false,"archive":false,"includeArchived":false,"inventoryType":"PRODUCT","reportNature":"string"}'
```

---

### `POST /company/:companyUniqueName/batch/transfer`

- **Frontend id:** `INVENTORY_API.BATCH.TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#transferBatch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#transferBatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:278`
- **Deprecated:** No

Batch transfer. Minimal body: {@code fromBatchUniqueName} + {@code toBatchUniqueName}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BatchTransferRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `fromBatchUniqueName` | `String` | not declared | unconstrained |
| `toBatchUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameModel` | not declared | unconstrained |
| `fromBatch` | `BatchResource` | not declared | unconstrained |
| `toBatch` | `BatchResource` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `transferDate` | `String` | not declared | unconstrained |

Example:

```json
{
  "fromBatchUniqueName": "string",
  "toBatchUniqueName": "string",
  "variant": "string",
  "fromBatch": "string",
  "toBatch": "string",
  "quantity": 0,
  "transferDate": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.transferBatch(company, transferRequest, principal`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/transfer?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"fromBatchUniqueName":"string","toBatchUniqueName":"string","variant":"string","fromBatch":"string","toBatch":"string","quantity":0,"transferDate":"string"}'
```

---

### `PUT /company/:companyUniqueName/batch/:batchUniqueName`

- **Frontend id:** `INVENTORY_API.BATCH.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateBatch`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BatchController#updateBatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/BatchController.java:229`
- **Deprecated:** No

Update batch details (name, manufacturing/expiry dates, optional rename via newBatchNumber,

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `batchUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BatchResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueName` | `String` | not declared | unconstrained |
| `name` | `String` | not declared | unconstrained |
| `batchNumber` | `String` | not declared | unconstrained |
| `archive` | `Boolean` | not declared | unconstrained |
| `manufacturingDate` | `String` | not declared | unconstrained |
| `expiryDate` | `String` | not declared | unconstrained |
| `createdAt` | `String` | not declared | unconstrained |
| `availableQuantity` | `BigDecimal` | not declared | unconstrained |
| `openingQuantity` | `BigDecimal` | not declared | unconstrained |
| `inwardQuantity` | `BigDecimal` | not declared | unconstrained |
| `outwardQuantity` | `BigDecimal` | not declared | unconstrained |
| `daysRemaining` | `Integer` | not declared | unconstrained |
| `stock` | `NameUniqueNameModel` | not declared | unconstrained |
| `variant` | `NameUniqueNameModel` | not declared | unconstrained |
| `warehouse` | `NameUniqueNameModel` | not declared | unconstrained |
| `belongsToVariant` | `Boolean` | not declared | unconstrained |
| `linkedEntities` | `List<String>` | not declared | unconstrained |
| `isUsed` | `Boolean` | not declared | unconstrained |
| `archiveStatus` | `String` | not declared | unconstrained |
| `archiveOnly` | `boolean` | not declared | unconstrained |
| `warehouses` | `List<BatchWarehouseBalanceResource>` | not declared | unconstrained |
| `openingAmount` | `BigDecimal` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |

Example:

```json
{
  "uniqueName": "string",
  "name": "string",
  "batchNumber": "string",
  "archive": false,
  "manufacturingDate": "string",
  "expiryDate": "string",
  "createdAt": "string",
  "availableQuantity": 0,
  "openingQuantity": 0,
  "inwardQuantity": 0,
  "outwardQuantity": 0,
  "daysRemaining": 0,
  "stock": "string",
  "variant": "string",
  "warehouse": "string",
  "belongsToVariant": false,
  "linkedEntities": [],
  "isUsed": false,
  "archiveStatus": "string",
  "archiveOnly": false,
  "warehouses": [],
  "openingAmount": 0,
  "amount": 0,
  "quantity": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `batchService.updateBatch(company, batchUniqueName, updates, principal`

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
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/batch/SAMPLE_batchUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueName":"string","name":"string","batchNumber":"string","archive":false,"manufacturingDate":"string","expiryDate":"string","createdAt":"string","availableQuantity":0,"openingQuantity":0,"inwardQuantity":0,"outwardQuantity":0,"daysRemaining":0,"stock":"string","variant":"string","warehouse":"string","belongsToVariant":false,"linkedEntities":[],"isUsed":false,"archiveStatus":"string","archiveOnly":false,"warehouses":[],"openingAmount":0,"amount":0,"quantity":0}'
```

---

### `GET /company/:companyUniqueName/business-documents/statuses?documentType=:documentType`

- **Frontend id:** `INVENTORY_API.BUSINESS_DOCUMENT_STATUSES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getBusinessDocumentStatuses`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#getStatuses
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:360`
- **Deprecated:** No

Get Statuses

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `documentType` — type: `BusinessDocumentType`; required; allowed: `DC`, `RC`, `TRANSFER_DC`, `TRANSFER_RC`, `JOBWORK_DC`, `JOBWORK_RC`, `MANUFACTURING_ISSUE`, `MANUFACTURING_RECEIPT`, `ADJUSTMENT`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `documentStatusService.getStatuses(company, documentType`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/statuses?documentType=DC&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/customer-vendor-discount/stock/:stockUniqueName/assign-discount`

- **Frontend id:** `INVENTORY_API.CREATE_DISCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomerVendorVariantDiscountController#createCustomerVariantDiscount
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomerVendorVariantDiscountController.java:49`
- **Deprecated:** No

Create Customer Variant Discount

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CustomerVariantDiscountRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `customerVendorAccountUniqueName` | `String` | not declared | unconstrained |
| `customerVendorGroupUniqueName` | `String` | not declared | unconstrained |
| `discountInfo` | `List<DiscountRequest>` | not declared | unconstrained |

Example:

```json
{
  "customerVendorAccountUniqueName": "string",
  "customerVendorGroupUniqueName": "string",
  "discountInfo": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Discount assigned to variant successfully."`

```json
{
  "status": "success",
  "body": "Discount assigned to variant successfully."
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
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/stock/SAMPLE_STOCK/assign-discount?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"customerVendorAccountUniqueName":"string","customerVendorGroupUniqueName":"string","discountInfo":[]}'
```

---

### `POST /company/:companyUniqueName/branch-transfer/generate`

- **Frontend id:** `INVENTORY_API.CREATE_NEW_BRANCH_TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createNewBranchTransfer`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchTransferController#generateTransferNote
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/branchTransfer/BranchTransferController.java:80`
- **Deprecated:** No

Generate Transfer Note

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BranchTransferV1` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `dateOfSupply` | `String` | not declared | unconstrained |
| `challanNo` | `String` | not declared | unconstrained |
| `note` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `sources` | `List<SourceDestination>` | not declared | unconstrained |
| `destinations` | `List<SourceDestination>` | not declared | unconstrained |
| `products` | `List<ProductDetails>` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `transporterDetails` | `TransporterDetails` | not declared | unconstrained |
| `totalAmount` | `BigDecimal` | not declared | unconstrained |
| `transferType` | `String` | not declared | unconstrained |
| `autoGenerateNote` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "dateOfSupply": "string",
  "challanNo": "string",
  "note": "string",
  "uniqueName": "string",
  "sources": [],
  "destinations": [],
  "products": [],
  "entity": "string",
  "transporterDetails": "string",
  "totalAmount": 0,
  "transferType": "string",
  "autoGenerateNote": false
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
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
- `body as NewBranchTransferResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/generate?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"dateOfSupply":"string","challanNo":"string","note":"string","uniqueName":"string","sources":[],"destinations":[],"products":[],"entity":"string","transporterDetails":"string","totalAmount":0,"transferType":"string","autoGenerateNote":false}'
```

---

### `GET /company/:companyUniqueName/stocks?isManufactured=true`

- **Frontend id:** `INVENTORY_API.CREATE_NEW_MANUFACTURING_STOCKS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetManufacturingStocksForCreateMF`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:394`
- **Deprecated:** No

Get All Stocks

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `refresh` — type: `boolean`; optional; default: `true`
- `isManufactured` — type: `boolean`; optional; default: `false`

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
- `body as StocksResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks?q=&page=1&count=0&refresh=true&isManufactured=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock`

- **Frontend id:** `INVENTORY_API.CREATE_STOCK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#CreateStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:102`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

Type: `StockResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `updateBranchCompStocks` | `boolean` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxes": [],
  "updateBranchCompStocks": false,
  "rowNum": "string",
  "requestId": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock?source=APP&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"updateBranchCompStocks":false,"rowNum":"string","requestId":"string"}'
```

---

### `POST /company/:companyUniqueName/stock-group`

- **Frontend id:** `INVENTORY_API.CREATE_STOCK_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#CreateStockGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:70`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockGroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |

Example:

```json
{
  "taxes": [],
  "discounts": []
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
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `body as StockGroupResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"discounts":[]}'
```

---

### `POST /company/:companyUniqueName/stock-unit`

- **Frontend id:** `INVENTORY_API.CREATE_STOCK_UNIT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#CreateStockUnit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:46`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockUnitResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockUnitResource(stockUnit`

```json
{
  "status": "success",
  "body": {
    "type": "StockUnitResource"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `body as StockUnitResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /v2/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock`

- **Frontend id:** `INVENTORY_API.CREATE_STOCK_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupV2Controller#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockWithGroupV2Controller.java:87`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

Type: `StockResourceV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |
| `updateBranchCompStocks` | `boolean` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxes": [],
  "discounts": [],
  "updateBranchCompStocks": false,
  "rowNum": "string",
  "requestId": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock?source=APP&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"discounts":[],"updateBranchCompStocks":false,"rowNum":"string","requestId":"string"}'
```

---

### `DELETE /company/:companyUniqueName/branch-transfer/:branchTransferUniqueName`

- **Frontend id:** `INVENTORY_API.DELETE_BRANCH_TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#deleteNewBranchTransfer`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchTransferController#deleteBranchTransferNote
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/branchTransfer/BranchTransferController.java:174`
- **Deprecated:** No

Delete Branch Transfer Note

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `transferNoteUniqueName` — type: `String`; required
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

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/SAMPLE_transferNoteUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/customer-vendor-discount?stockUniqueName=:stockUniqueName&variantUniqueName=:variantUniqueName&userUniqueName=:userUniqueName`

- **Frontend id:** `INVENTORY_API.DELETE_DISCOUNT_RECORD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#deleteDiscountRecord`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomerVendorVariantDiscountController#deleteCustomerVariantDiscount
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomerVendorVariantDiscountController.java:81`
- **Deprecated:** No

Delete Customer Variant Discount

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `stockUniqueName` — type: `String`; optional
- `variantUniqueName` — type: `String`; optional
- `userUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Record deleted successfully."`

```json
{
  "status": "success",
  "body": "Record deleted successfully."
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount?stockUniqueName=SAMPLE_STOCK&variantUniqueName=SAMPLE_variantUniqueName&userUniqueName=SAMPLE_userUniqueName&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.DELETE_STOCK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#DeleteStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:156`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

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
| 400 | ` doesnot belong to stockGroup ` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": " doesnot belong to stockGroup ",
  "message": "Stock "
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/stock-group/:stockGroupUniqueName`

- **Frontend id:** `INVENTORY_API.DELETE_STOCK_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#DeleteStockGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:149`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Stock group deleted successfully."`

```json
{
  "status": "success",
  "body": "Stock group deleted successfully."
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /company/:companyUniqueName/stock-unit/:uniqueName`

- **Frontend id:** `INVENTORY_API.DELETE_STOCK_UNIT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#DeleteStockUnit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:95`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Stock unit deleted successfully."`

```json
{
  "status": "success",
  "body": "Stock unit deleted successfully."
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_stockUnitUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /v2/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.DELETE_STOCK_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#deleteStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupV2Controller#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockWithGroupV2Controller.java:160`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Stock deleted successfully."`

```json
{
  "status": "success",
  "body": "Stock deleted successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `error.code.invalidParameter` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": "error.code.invalidParameter",
  "message": "error.stock.doesnot.belongs.to.stockgroup"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/download-all-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_ALL_GROUP_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyV2Controller#exportAllStockGroupInventoryReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/CompanyV2Controller.java:214`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_GROUP_STOCK_REPORT_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `TEXT_DEFAULT_SORTBY_VALUE`
- `sort` — type: `String`; optional; default: `TEXT_DEFAULT_SORT_VALUE`
- `format` — type: `String`; optional; default: `xlsx`

#### Controller-backed request payload

Type: `StockGroupReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `transactionType` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `condition` | `String` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `totalCount` | `Integer` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |

Example:

```json
{
  "transactionType": "string",
  "stockName": "string",
  "entity": "string",
  "value": "string",
  "condition": "string",
  "number": "string",
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "totalCount": 0,
  "variant": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-all-inventory-report-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&sortBy=TEXT_DEFAULT_SORTBY_VALUE&sort=TEXT_DEFAULT_SORT_VALUE&format=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"transactionType":"string","stockName":"string","entity":"string","value":"string","condition":"string","number":"string","branchUniqueName":"string","warehouseUniqueName":"string","totalCount":0,"variant":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/download-all-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_ALL_GROUP_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyV2Controller#exportAllStockGroupInventoryReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/CompanyV2Controller.java:214`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_GROUP_STOCK_REPORT_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `TEXT_DEFAULT_SORTBY_VALUE`
- `sort` — type: `String`; optional; default: `TEXT_DEFAULT_SORT_VALUE`
- `format` — type: `String`; optional; default: `xlsx`

#### Controller-backed request payload

Type: `StockGroupReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `transactionType` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `condition` | `String` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `totalCount` | `Integer` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |

Example:

```json
{
  "transactionType": "string",
  "stockName": "string",
  "entity": "string",
  "value": "string",
  "condition": "string",
  "number": "string",
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "totalCount": 0,
  "variant": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-all-inventory-report-v2?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&sortBy=TEXT_DEFAULT_SORTBY_VALUE&sort=TEXT_DEFAULT_SORT_VALUE&format=xlsx' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"transactionType":"string","stockName":"string","entity":"string","value":"string","condition":"string","number":"string","branchUniqueName":"string","warehouseUniqueName":"string","totalCount":0,"variant":"string"}'
```

---

### `POST /company/:companyUniqueName/stock-group/:stockGroupUniquename/download-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_GROUP_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#exportStockGroupInventoryReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:258`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_GROUP_STOCK_REPORT_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `PARAMETER_SORTBY_STOCK_NAME`
- `sort` — type: `String`; optional; default: `PARAMATER_SORT_ASC`
- `format` — type: `String`; optional; default: `PARAMETER_FORMAT_XLSX`

#### Controller-backed request payload

Type: `StockGroupReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `transactionType` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `condition` | `String` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `totalCount` | `Integer` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |

Example:

```json
{
  "transactionType": "string",
  "stockName": "string",
  "entity": "string",
  "value": "string",
  "condition": "string",
  "number": "string",
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "totalCount": 0,
  "variant": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/download-inventory-report-v2?from=01-04-2025&to=31-03-2026&sortBy=PARAMETER_SORTBY_STOCK_NAME&sort=PARAMATER_SORT_ASC&format=PARAMETER_FORMAT_XLSX&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"transactionType":"string","stockName":"string","entity":"string","value":"string","condition":"string","number":"string","branchUniqueName":"string","warehouseUniqueName":"string","totalCount":0,"variant":"string"}'
```

---

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniquename/download-inventory-report-v2?format=:format&from=:from&to=:to&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_GROUP_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#exportStockGroupInventoryReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:258`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_GROUP_STOCK_REPORT_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `PARAMETER_SORTBY_STOCK_NAME`
- `sort` — type: `String`; optional; default: `PARAMATER_SORT_ASC`
- `format` — type: `String`; optional; default: `PARAMETER_FORMAT_XLSX`

#### Controller-backed request payload

Type: `StockGroupReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `transactionType` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `condition` | `String` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `totalCount` | `Integer` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |

Example:

```json
{
  "transactionType": "string",
  "stockName": "string",
  "entity": "string",
  "value": "string",
  "condition": "string",
  "number": "string",
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "totalCount": 0,
  "variant": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/download-inventory-report-v2?from=01-04-2025&to=31-03-2026&sortBy=PARAMETER_SORTBY_STOCK_NAME&sort=PARAMATER_SORT_ASC&format=PARAMETER_FORMAT_XLSX&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"transactionType":"string","stockName":"string","entity":"string","value":"string","condition":"string","number":"string","branchUniqueName":"string","warehouseUniqueName":"string","totalCount":0,"variant":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/download-all-inventory-hierarchy?from=:from&to=:to&format=:format&sortBy=:sortBy&sort=:sort&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyV2Controller#exportAllInventoryStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/CompanyV2Controller.java:267`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_STOCK_IN_HIERARCHY_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `TEXT_DEFAULT_SORTBY_VALUE`
- `sort` — type: `String`; optional; default: `TEXT_DEFAULT_SORT_VALUE`
- `page` — type: `Integer`; optional; default: `TEXT_DEFAULT_PAGE_COUNT_VALUE`
- `count` — type: `Integer`; optional; default: `TEXT_DEFAULT_ITEM_COUNT_VALUE`
- `format` — type: `String`; optional
- `transaction_type` — type: `String`; optional; default: ``
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-all-inventory-hierarchy?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&sortBy=TEXT_DEFAULT_SORTBY_VALUE&sort=TEXT_DEFAULT_SORT_VALUE&page=TEXT_DEFAULT_PAGE_COUNT_VALUE&count=TEXT_DEFAULT_ITEM_COUNT_VALUE&format=SAMPLE_format&transaction_type=&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/download-all-inventory-hierarchy?from=:from&to=:to&format=:format&sortBy=:sortBy&sort=:sort&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyV2Controller#exportAllInventoryStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/CompanyV2Controller.java:267`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_STOCK_IN_HIERARCHY_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `TEXT_DEFAULT_SORTBY_VALUE`
- `sort` — type: `String`; optional; default: `TEXT_DEFAULT_SORT_VALUE`
- `page` — type: `Integer`; optional; default: `TEXT_DEFAULT_PAGE_COUNT_VALUE`
- `count` — type: `Integer`; optional; default: `TEXT_DEFAULT_ITEM_COUNT_VALUE`
- `format` — type: `String`; optional
- `transaction_type` — type: `String`; optional; default: ``
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-all-inventory-hierarchy?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&sortBy=TEXT_DEFAULT_SORTBY_VALUE&sort=TEXT_DEFAULT_SORT_VALUE&page=TEXT_DEFAULT_PAGE_COUNT_VALUE&count=TEXT_DEFAULT_ITEM_COUNT_VALUE&format=SAMPLE_format&transaction_type=&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `POST /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/download-stock-inventory-report-v3?from=:from&to=:to&page=:page&count=:count&format=:format&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_STOCK_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#downloadStockReportV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:274`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_STOCK_REPORT_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `PARAMETER_STOCK_UNIQUE_NAME_VALUE` — type: `String`; required
- `PARAMETER_STOCK_GROUP_UNIQUE_NAME_VALUE` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `PARAMETER_PAGE_1`
- `count` — type: `Integer`; optional; default: `PARAMETER_COUNT_20`
- `format` — type: `String`; optional; default: `PARAMETER_FORMAT_XLSX`
- `sortBy` — type: `String`; optional; default: `PARAMETER_ENTRY_DATE`
- `sort` — type: `String`; optional; default: `PARAMETER_SORT_ASC`

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/download-stock-inventory-report-v3?from=01-04-2025&to=31-03-2026&page=PARAMETER_PAGE_1&count=PARAMETER_COUNT_20&format=PARAMETER_FORMAT_XLSX&sortBy=PARAMETER_ENTRY_DATE&sort=PARAMETER_SORT_ASC&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/download-stock-inventory-report-v3?from=:from&to=:to&page=:page&count=:count&format=:format&sortBy=:sortBy&sort=:sort`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_STOCK_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#downloadStockReportV3
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:274`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_STOCK_REPORT_API}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `PARAMETER_STOCK_UNIQUE_NAME_VALUE` — type: `String`; required
- `PARAMETER_STOCK_GROUP_UNIQUE_NAME_VALUE` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `PARAMETER_PAGE_1`
- `count` — type: `Integer`; optional; default: `PARAMETER_COUNT_20`
- `format` — type: `String`; optional; default: `PARAMETER_FORMAT_XLSX`
- `sortBy` — type: `String`; optional; default: `PARAMETER_ENTRY_DATE`
- `sort` — type: `String`; optional; default: `PARAMETER_SORT_ASC`

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/download-stock-inventory-report-v3?from=01-04-2025&to=31-03-2026&page=PARAMETER_PAGE_1&count=PARAMETER_COUNT_20&format=PARAMETER_FORMAT_XLSX&sortBy=PARAMETER_ENTRY_DATE&sort=PARAMETER_SORT_ASC&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/download-inventory-arrangedby-accounts?from=:from&to=:to&format=:format&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyV2Controller#exportInventoryStocksArrangedByAccounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/CompanyV2Controller.java:316`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ARRANGEDBY_ACCOUNTS}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `TEXT_DEFAULT_SORTBY_VALUE`
- `sort` — type: `String`; optional; default: `TEXT_DEFAULT_SORT_VALUE`
- `format` — type: `String`; optional

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-inventory-arrangedby-accounts?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&sortBy=TEXT_DEFAULT_SORTBY_VALUE&sort=TEXT_DEFAULT_SORT_VALUE&format=SAMPLE_format' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `GET /v2/company/:companyUniqueName/download-inventory-arrangedby-accounts?from=:from&to=:to&format=:format&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadAllInventoryReports`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyV2Controller#exportInventoryStocksArrangedByAccounts
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/CompanyV2Controller.java:316`
- **Deprecated:** No

API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ARRANGEDBY_ACCOUNTS}

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sortBy` — type: `String`; optional; default: `TEXT_DEFAULT_SORTBY_VALUE`
- `sort` — type: `String`; optional; default: `TEXT_DEFAULT_SORT_VALUE`
- `format` — type: `String`; optional

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage(SUCCESS_INVENTORY_REPORT_MESSAGE`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/download-inventory-arrangedby-accounts?branchUniqueName=aaaa&from=01-04-2025&to=31-03-2026&sortBy=TEXT_DEFAULT_SORTBY_VALUE&sort=TEXT_DEFAULT_SORT_VALUE&format=SAMPLE_format' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `POST /company/:companyUniqueName/branch-transfer/download?fileType=base64`

- **Frontend id:** `INVENTORY_API.DOWNLOAD_NEW_BRANCH_TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#downloadBranchTransfer`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchTransferController#download
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/branchTransfer/BranchTransferController.java:230`
- **Deprecated:** No

Download

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `fileType` — type: `String`; optional; default: `pdf`

#### Controller-backed request payload

Type: `BranchTransferDownloadRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `noteNumber` | `String` | not declared | unconstrained |

Example:

```json
{
  "noteNumber": "string"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/download?fileType=pdf&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"noteNumber":"string"}'
```

---

### `POST /company/:companyUniqueName/inventory-users/:inventoryUserUniqueName/inventory-entries`

- **Frontend id:** `INVENTORY_API.ENTRY.CREATE`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: InventoryEntryController#createInventoryEntry
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InventoryEntryController.java:66`
- **Deprecated:** No

Create Inventory Entry

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `inventoryUserUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `InventoryEntryResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryEntryResource`

```json
{
  "status": "success",
  "body": {
    "reference": "inventoryEntryResource"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users/SAMPLE_inventoryUserUniqueName/inventory-entries?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/customer-vendor-discount/get-all-discounts?uniqueName=:uniqueName&query=:query&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.GET_ALL_DISCOUNTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getAllDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomerVendorVariantDiscountController#getDiscountInfoForForCustomer
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomerVendorVariantDiscountController.java:113`
- **Deprecated:** No

Get Discount Info For For Customer

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `uniqueName` — type: `String`; required
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `query` — type: `String`; optional; default: ``

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/get-all-discounts?uniqueName=SAMPLE_UNIQUE_NAME&page=1&count=20&query=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/stock?query=:query&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.GET_ALL_STOCKS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockV2Controller#getStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockV2Controller.java:107`
- **Deprecated:** No

Get Stocks

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `query` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockService.getStocks(company, query, page, count`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock?page=1&count=50&query=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/branch-transfer/:branchTransferUniqueName`

- **Frontend id:** `INVENTORY_API.GET_BRANCH_TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getNewBranchTransfer`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchTransferController#getTransferNote
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/branchTransfer/BranchTransferController.java:107`
- **Deprecated:** No

Get Transfer Note

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `transferNoteUniqueName` — type: `String`; required

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/SAMPLE_transferNoteUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/branch-transfer/all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `INVENTORY_API.GET_BRANCH_TRANSFER_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getBranchTransferList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchTransferController#getAllBranchTransfers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/branchTransfer/BranchTransferController.java:140`
- **Deprecated:** No

Get All Branch Transfers

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; required
- `to` — type: `String`; required
- `sort` — type: `String`; optional; default: `desc`
- `sortBy` — type: `String`; optional; default: `dateOfSupply`
- `page` — type: `String`; optional; default: `1`
- `count` — type: `String`; optional; default: `50`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BranchTransferFilters` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `amount` | `BigDecimal` | not declared | unconstrained |
| `amountOperator` | `String` | not declared | unconstrained |
| `voucherType` | `String` | not declared | unconstrained |
| `voucherNo` | `String` | not declared | unconstrained |
| `senderReceiver` | `String` | not declared | unconstrained |
| `sender` | `String` | not declared | unconstrained |
| `receiver` | `String` | not declared | unconstrained |
| `fromWarehouse` | `String` | not declared | unconstrained |
| `toWarehouse` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "amount": 0,
  "amountOperator": "string",
  "voucherType": "string",
  "voucherNo": "string",
  "senderReceiver": "string",
  "sender": "string",
  "receiver": "string",
  "fromWarehouse": "string",
  "toWarehouse": "string",
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `branchTransferListPageModel`

```json
{
  "status": "success",
  "body": {
    "reference": "branchTransferListPageModel"
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
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/all?from=01-04-2025&to=31-03-2026&sort=desc&sortBy=dateOfSupply&page=1&count=50&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"amount":0,"amountOperator":"string","voucherType":"string","voucherNo":"string","senderReceiver":"string","sender":"string","receiver":"string","fromWarehouse":"string","toWarehouse":"string","value":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/stock?page=:page&count=:count&inventoryType=:inventoryType`

- **Frontend id:** `INVENTORY_API.GET_BULK_STOCK_WITH_INVENTROY_TYPE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getBulkStockList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockV2Controller#getDataForInventoryTable
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockV2Controller.java:72`
- **Deprecated:** No

Get Data For Inventory Table

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `inventoryType` — type: `String`; required
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `InventoryTableFilter` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `search` | `String` | not declared | unconstrained |
| `searchBy` | `String` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `filterBy` | `String` | not declared | unconstrained |
| `expression` | `String` | not declared | unconstrained |
| `rate` | `BigDecimal` | not declared | unconstrained |
| `searchParameters` | `Set<String>` | not declared | unconstrained |
| `sortParameters` | `Set<String>` | not declared | unconstrained |
| `filterParameters` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "search": "string",
  "searchBy": "string",
  "sort": "string",
  "sortBy": "string",
  "filterBy": "string",
  "expression": "string",
  "rate": 0,
  "searchParameters": [],
  "sortParameters": [],
  "filterParameters": []
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock?page=1&count=50&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"search":"string","searchBy":"string","sort":"string","sortBy":"string","filterBy":"string","expression":"string","rate":0,"searchParameters":[],"sortParameters":[],"filterParameters":[]}'
```

---

### `GET /company/:companyUniqueName/customer-vendor-discount/get-all-users?groupUniqueName=:group&page=:page&count=:count&query=:query&userType=:userType`

- **Frontend id:** `INVENTORY_API.GET_CUSTOMER_VENDOR_DISCOUNT_USERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getCustomerVendorDiscountUserList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomerVendorVariantDiscountController#getCustomerVendorList
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomerVendorVariantDiscountController.java:96`
- **Deprecated:** No

Get Customer Vendor List

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `groupUniqueName` — type: `String`; required
- `query` — type: `String`; optional; default: ``
- `userType` — type: `String`; optional; default: `all`
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/get-all-users?groupUniqueName=SAMPLE_GROUP&query=&userType=all&page=1&count=50&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/groups/:group/flatten-accounts?query=:query&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.GET_FLATTEN_ACCOUNTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getFlattenAccountsList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#getFlattenGroupsAndAccountsOfGroup
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:368`
- **Deprecated:** No

Get Flatten Groups And Accounts Of Group

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `groupUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `query` — type: `String`; optional; default: ``
- `count` — type: `int`; optional; default: `50`
- `entity` — type: `String`; optional; default: `BOTH`
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `flatAccountsAndGroups`

```json
{
  "status": "success",
  "body": {
    "reference": "flatAccountsAndGroups"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/SAMPLE_GROUP/flatten-accounts?page=1&query=&count=50&entity=BOTH&lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/company/:companyUniqueName/groups/flatten-groups-with-accounts?query=:query&page=:page&count=:count&entity=:entity`

- **Frontend id:** `INVENTORY_API.GET_FLATTEN_GROUP_WITH_ACCOUNTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getFlattenGroupWithAccountsList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: GroupV2Controller#getFlattenGroupsAndAccountsOfGroups
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/GroupV2Controller.java:383`
- **Deprecated:** No

Get Flatten Groups And Accounts Of Groups

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `query` — type: `String`; optional; default: ``
- `count` — type: `int`; optional; default: `50`
- `entity` — type: `String`; optional; default: `BOTH`
- `lang` — type: `String`; optional; default: `StaticMessageSource.DEFAULT_LANG`

#### Controller-backed request payload

Type: `Set<String>` (required).

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
- Body evidence: `flatAccountsAndGroups`

```json
{
  "status": "success",
  "body": {
    "reference": "flatAccountsAndGroups"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/groups/flatten-groups-with-accounts?page=1&query=&count=50&entity=BOTH&lang=StaticMessageSource.DEFAULT_LANG&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `POST /company/:companyUniqueName/stock/:stockUniqueName/rate-for-stock`

- **Frontend id:** `INVENTORY_API.GET_RATE_FOR_STOCK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetRateForStoke`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#getRateForStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:134`
- **Deprecated:** No

Get Rate For Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `LinkStock` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `stockName` | `String` | not declared | unconstrained |
| `stockUniqueName` | `String` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `stockUnitCode` | `String` | not declared | unconstrained |
| `stockUnitUniqueName` | `String` | not declared | unconstrained |
| `rate` | `BigDecimal` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `manufacturingRateCategory` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `BatchResource` | not declared | unconstrained |
| `batches` | `List<BatchResource>` | not declared | unconstrained |
| `stockUnits` | `LinkedList<StockUnitResource>` | not declared | unconstrained |
| `finishedStockUniqueName` | `String` | not declared | unconstrained |
| `finishedVariantUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `branchId` | `Long` | not declared | unconstrained |
| `finishedVariantId` | `Long` | not declared | unconstrained |
| `warehouseId` | `Long` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |

Example:

```json
{
  "stockName": "string",
  "stockUniqueName": "string",
  "quantity": 0,
  "stockUnitCode": "string",
  "stockUnitUniqueName": "string",
  "rate": 0,
  "amount": 0,
  "manufacturingRateCategory": "string",
  "variant": "string",
  "batch": "string",
  "batches": [],
  "stockUnits": [],
  "finishedStockUniqueName": "string",
  "finishedVariantUniqueName": "string",
  "warehouseUniqueName": "string",
  "branchId": 0,
  "finishedVariantId": 0,
  "warehouseId": 0,
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "date": "string",
  "userId": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockService.getRateForStock(company, principal, stockUniqueName, linkStock, request`

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
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/rate-for-stock?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"stockName":"string","stockUniqueName":"string","quantity":0,"stockUnitCode":"string","stockUnitUniqueName":"string","rate":0,"amount":0,"manufacturingRateCategory":"string","variant":"string","batch":"string","batches":[],"stockUnits":[],"finishedStockUniqueName":"string","finishedVariantUniqueName":"string","warehouseUniqueName":"string","branchId":0,"finishedVariantId":0,"warehouseId":0,"companyUniqueName":"string","branchUniqueName":"string","date":"string","userId":0}'
```

---

### `GET /v2/company/:companyUniqueName/stock/:stockUniqueName/details?userType=:userType`

- **Frontend id:** `INVENTORY_API.GET_STOCK_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockV2Controller#getStockVariantsWithVariantUnitBasedOnUserType
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockV2Controller.java:123`
- **Deprecated:** No

Get Stock Variants With Variant Unit Based On User Type

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `userType` — type: `String`; optional; default: `all`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockService.getStockVariantsWithVariantUnitBasedOnUserType(stock, userType`

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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/details?userType=all&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniqueName`

- **Frontend id:** `INVENTORY_API.GET_STOCK_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:84`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/stock-unit/mappings`

- **Frontend id:** `INVENTORY_API.GET_STOCK_MAPPED_UNIT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockMappedUnit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#getAllMappings
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:107`
- **Deprecated:** No

Get All Mappings

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `Set<String>` (required).

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
- Body evidence: `mappings`

```json
{
  "status": "success",
  "body": {
    "reference": "mappings"
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
- `body as StockMappedUnitResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/mappings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `GET /company/:companyUniqueName/stock-unit-group`

- **Frontend id:** `INVENTORY_API.GET_STOCK_UNIT_GROUPS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockUnitGroups; apps/web-giddh/src/app/services/inventory.service.ts#createStockUnitGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitGroupController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitGroupController.java:81`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockUnitGroups`

```json
{
  "status": "success",
  "body": {
    "reference": "stockUnitGroups"
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
- `body as any[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit-group?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/stock-unit-group`

- **Frontend id:** `INVENTORY_API.GET_STOCK_UNIT_GROUPS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockUnitGroups; apps/web-giddh/src/app/services/inventory.service.ts#createStockUnitGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitGroupController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitGroupController.java:44`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockUnitGroupResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockUnitGroupResource(stockUnitGroup`

```json
{
  "status": "success",
  "body": {
    "type": "StockUnitGroupResource"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `body as any[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit-group?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/stock-unit/:uName`

- **Frontend id:** `INVENTORY_API.GET_STOCK_UNIT_WITH_NAME`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStockUnitByName`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:72`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockUnitResource(stockUnit`

```json
{
  "status": "success",
  "body": {
    "type": "StockUnitResource"
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
- `body as StockUnitResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_stockUnitUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.GET_STOCK_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockV2Controller#getV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockV2Controller.java:57`
- **Deprecated:** No

Get V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.GET_STOCK_WITH_UNIQUENAME`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStockUniqueNameWithDetail`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:163`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
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
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /ui/forms?formName=:formName&country=:country`

- **Frontend id:** `INVENTORY_API.GET_UNIT_CODE_REGEX`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getUnitCodeRegex`
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

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniqueName/report?from=:from&to=:to&entity=:entity&value=:value&condition=:condition&number=:number&stock=:stock&count=:count&page=:page`

- **Frontend id:** `INVENTORY_API.GROUP_STOCK_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetGroupStocksReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#getStockGroupReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:164`
- **Deprecated:** No

Get Stock Group Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `asc`
- `sort` — type: `String`; optional; default: `asc`
- `stock` — type: `String`; optional
- `entity` — type: `String`; optional
- `value` — type: `String`; optional
- `condition` — type: `String`; optional
- `number` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockGroupReport`

```json
{
  "status": "success",
  "body": {
    "reference": "stockGroupReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/report?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=asc&sort=asc&stock=SAMPLE_stock&entity=SAMPLE_entity&value=SAMPLE_value&condition=SAMPLE_condition&number=SAMPLE_number&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/stock-group/:stockGroupUniqueName/inventory-report-v3?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `INVENTORY_API.GROUP_STOCK_REPORT_V3`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetGroupStocksReport_V3`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#createStockGroupReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:195`
- **Deprecated:** No

Create Stock Group Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `stock_name`
- `sort` — type: `String`; optional; default: `asc`

#### Controller-backed request payload

Type: `StockGroupReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `transactionType` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `condition` | `String` | not declared | unconstrained |
| `number` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `totalCount` | `Integer` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |

Example:

```json
{
  "transactionType": "string",
  "stockName": "string",
  "entity": "string",
  "value": "string",
  "condition": "string",
  "number": "string",
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "totalCount": 0,
  "variant": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockGroupReport`

```json
{
  "status": "success",
  "body": {
    "reference": "stockGroupReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/inventory-report-v3?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=stock_name&sort=asc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"transactionType":"string","stockName":"string","entity":"string","value":"string","condition":"string","number":"string","branchUniqueName":"string","warehouseUniqueName":"string","totalCount":0,"variant":"string"}'
```

---

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniqueName`

- **Frontend id:** `INVENTORY_API.GROUPS_STOCKS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetGroupsStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:84`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required

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
- `body as StockGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/hierarchical-stock-groups?type=:type`

- **Frontend id:** `INVENTORY_API.GROUPS_WITH_STOCKS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetGroupsWithStocksFlatten`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllHierarchicalStockGroups
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:454`
- **Deprecated:** No

Get All Hierarchical Stock Groups

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `refresh` — type: `boolean`; optional; default: `false`
- `type` — type: `String`; optional

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
- `body as GroupsWithStocksHierarchyMin`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/hierarchical-stock-groups?q=&page=1&count=0&refresh=false&type=SAMPLE_type&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/flatten-stock-groups-with-stocks?count=:count&page=:page&q=:q`

- **Frontend id:** `INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#SearchStockGroupsWithStocks`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getFlattenStockGroupsWithStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:470`
- **Deprecated:** No

Get Flatten Stock Groups With Stocks

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
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
- `body as GroupsWithStocksFlatten`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/flatten-stock-groups-with-stocks?q=&page=1&count=0&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/hierarchical-stock-groups?q=:q&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.GROUPS_WITH_STOCKS_HIERARCHY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetGroupsWithStocksHierarchyMin`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllHierarchicalStockGroups
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:454`
- **Deprecated:** No

Get All Hierarchical Stock Groups

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `refresh` — type: `boolean`; optional; default: `false`
- `type` — type: `String`; optional

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
- `body as GroupsWithStocksHierarchyMin`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/hierarchical-stock-groups?q=&page=1&count=0&refresh=false&type=SAMPLE_type&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/inventory-adjustment?voucherVersion=2&branchUniqueName=:branchUniqueName`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.CREATE_INVENTORY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createInventoryAdjustment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: InventoryAdjustmentController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/InventoryAdjustmentController.java:39`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `InventoryAdjustmentModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entity` | `String` | not declared | unconstrained |
| `entityName` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `reasonUniqueName` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `refNo` | `String` | not declared | unconstrained |
| `expenseAccountUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `adjustmentMethod` | `InventoryAdjustmentMethod` | not declared | QUANTITY_WISE, VALUE_WISE |
| `calculationMethod` | `CalculationMethod` | not declared | PERCENTAGE, VALUE |
| `changeInValue` | `BigDecimal` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `adjustmentId` | `Long` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `update` | `boolean` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |

Example:

```json
{
  "entity": "string",
  "entityName": "string",
  "entityUniqueName": "string",
  "reasonUniqueName": "string",
  "date": "string",
  "refNo": "string",
  "expenseAccountUniqueName": "string",
  "warehouseUniqueName": "string",
  "description": "string",
  "adjustmentMethod": "QUANTITY_WISE",
  "calculationMethod": "PERCENTAGE",
  "changeInValue": 0,
  "variantUniqueNames": [],
  "adjustmentId": 0,
  "userId": 0,
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "update": false,
  "inventoryType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("inventory.adjustment.request.submitted"`

```json
{
  "status": "success",
  "body": "inventory.adjustment.request.submitted"
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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entity":"string","entityName":"string","entityUniqueName":"string","reasonUniqueName":"string","date":"string","refNo":"string","expenseAccountUniqueName":"string","warehouseUniqueName":"string","description":"string","adjustmentMethod":"QUANTITY_WISE","calculationMethod":"PERCENTAGE","changeInValue":0,"variantUniqueNames":[],"adjustmentId":0,"userId":0,"companyUniqueName":"string","branchUniqueName":"string","update":false,"inventoryType":"string"}'
```

---

### `POST /company/:companyUniqueName/inventory-adjustment/reason`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.CREATE_REASON`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createInventoryAdjustReason`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventoryAdjustmentReasonController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/inventory/adjustment/InventoryAdjustmentReasonController.java:38`
- **Deprecated:** No

Create

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

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryAdjustmentReasonService.createInventoryAdjustmentReason(reason, company`

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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/reason?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `DELETE /company/:companyUniqueName/inventory-adjustment/:referenceNo?voucherVersion=2`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#deleteInventoryAdjust`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: InventoryAdjustmentController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/InventoryAdjustmentController.java:51`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `refNo` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryAdjustmentService.deleteAdjustment(company, principal, refNo, request, new LinkedList<>() {{ add(RequestSource.API); }}`

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
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
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
  "code": "INTERRUPTED",
  "message": "Interrupted"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_refNo?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/inventory-adjustment/:referenceNo`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getInventoryAdjust`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventoryAdjustmentController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/inventory/adjustment/InventoryAdjustmentController.java:39`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `refNo` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryAdjustmentService.getAdjustmentInfoByRefNo(refNo, company`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_refNo?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/inventory-adjustment/reason/get-all?count=2000`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.GET_REASON`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getInventoryAdjustReasons`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventoryAdjustmentReasonController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/inventory/adjustment/InventoryAdjustmentReasonController.java:64`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `sort` — type: `String`; optional; default: `asc`
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/reason/get-all?page=1&count=20&sort=asc&q=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/inventory-adjustment/adjustment-report?page=:page&from=:from&to=:to&count=:count&sortBy=:sortBy&sort=:sort&q=:q&searchBy=:searchBy&inventoryType=:inventoryType`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getAdjustmentInventoryReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventoryAdjustmentController#getAdjustmentReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/inventory/adjustment/InventoryAdjustmentController.java:47`
- **Deprecated:** No

Get Adjustment Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `inventoryType` — type: `String`; optional; default: ``
- `sortBy` — type: `String`; optional; default: `date`
- `sort` — type: `String`; optional; default: `desc`
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `q` — type: `String`; optional; default: ``
- `searchBy` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryAdjustmentService.getAdjustmentReportByCompanyAndBranch(company, branch, inventoryType, q.trim(`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/adjustment-report?branchUniqueName=aaaa&page=1&count=20&inventoryType=&sortBy=date&sort=desc&from=01-04-2025&to=31-03-2026&q=&searchBy=SAMPLE_searchBy' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/inventory-adjustment/:refNo?voucherVersion=2&branchUniqueName=:branchUniqueName`

- **Frontend id:** `INVENTORY_API.INVENTORY_ADJUST.UPDATE_INVENTORY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateInventoryAdjustment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** accounting-microservice: InventoryAdjustmentController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/InventoryAdjustmentController.java:60`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `refNo` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `InventoryAdjustmentModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `entity` | `String` | not declared | unconstrained |
| `entityName` | `String` | not declared | unconstrained |
| `entityUniqueName` | `String` | not declared | unconstrained |
| `reasonUniqueName` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `refNo` | `String` | not declared | unconstrained |
| `expenseAccountUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `description` | `String` | not declared | unconstrained |
| `adjustmentMethod` | `InventoryAdjustmentMethod` | not declared | QUANTITY_WISE, VALUE_WISE |
| `calculationMethod` | `CalculationMethod` | not declared | PERCENTAGE, VALUE |
| `changeInValue` | `BigDecimal` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `adjustmentId` | `Long` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `update` | `boolean` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |

Example:

```json
{
  "entity": "string",
  "entityName": "string",
  "entityUniqueName": "string",
  "reasonUniqueName": "string",
  "date": "string",
  "refNo": "string",
  "expenseAccountUniqueName": "string",
  "warehouseUniqueName": "string",
  "description": "string",
  "adjustmentMethod": "QUANTITY_WISE",
  "calculationMethod": "PERCENTAGE",
  "changeInValue": 0,
  "variantUniqueNames": [],
  "adjustmentId": 0,
  "userId": 0,
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "update": false,
  "inventoryType": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `MessageUtils.getMessage("inventory.adjustment.request.submitted"`

```json
{
  "status": "success",
  "body": "inventory.adjustment.request.submitted"
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `UN_SUPPORTED_OPERATION` | `UnSupportedOperationException` | UnSupportedOperationException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-adjustment/SAMPLE_refNo?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"entity":"string","entityName":"string","entityUniqueName":"string","reasonUniqueName":"string","date":"string","refNo":"string","expenseAccountUniqueName":"string","warehouseUniqueName":"string","description":"string","adjustmentMethod":"QUANTITY_WISE","calculationMethod":"PERCENTAGE","changeInValue":0,"variantUniqueNames":[],"adjustmentId":0,"userId":0,"companyUniqueName":"string","branchUniqueName":"string","update":false,"inventoryType":"string"}'
```

---

### `GET /company/:companyUniqueName/inventory-settings`

- **Frontend id:** `INVENTORY_API.INVENTORY_SETTINGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getInventorySettings; apps/web-giddh/src/app/services/inventory.service.ts#updateInventorySettings`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventorySettingsController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/InventorySettingsController.java:47`
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
- Body evidence: `inventorySettingsService.get(company`

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
- `body.voucherAutomation.inventoryViaBusinessDocument (and related voucherAutomation flags)`
- `body.batchManagement`
- `body.deliveryChallanStatusFlow`
- `body.receiptNoteStatusFlow`
- `body.defaultReportNature`
- `body.lookups`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/inventory-settings`

- **Frontend id:** `INVENTORY_API.INVENTORY_SETTINGS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getInventorySettings; apps/web-giddh/src/app/services/inventory.service.ts#updateInventorySettings`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventorySettingsController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/InventorySettingsController.java:57`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `InventorySettingsResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `voucherAutomation` | `VoucherAutomation` | not declared | unconstrained |
| `batchManagement` | `BatchManagement` | not declared | unconstrained |
| `deliveryChallanStatusFlow` | `DocumentStatusFlow` | not declared | unconstrained |
| `receiptNoteStatusFlow` | `DocumentStatusFlow` | not declared | unconstrained |
| `autoCreateOppositeOnDcRc` | `Boolean` | not declared | unconstrained |
| `lookups` | `Lookups` | not declared | unconstrained |
| `autoCloseWhen` | `List<Option>` | not declared | unconstrained |
| `batchNumberFormat` | `List<Option>` | not declared | unconstrained |
| `batchAllocationMethod` | `List<Option>` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `label` | `String` | not declared | unconstrained |
| `inventoryViaBusinessDocument` | `Boolean` | not declared | unconstrained |
| `autoGenerateDcOnInvoice` | `Boolean` | not declared | unconstrained |
| `autoGenerateRcOnBill` | `Boolean` | not declared | unconstrained |
| `enabled` | `Boolean` | not declared | unconstrained |
| `numberFormat` | `String` | not declared | unconstrained |
| `allocationMethod` | `String` | not declared | unconstrained |
| `expiryAlertDays` | `Integer` | not declared | unconstrained |
| `mandatoryBatchOnOutward` | `Boolean` | not declared | unconstrained |
| `allowNegativeBatchStock` | `Boolean` | not declared | unconstrained |
| `start` | `List<String>` | not declared | unconstrained |
| `inProgress` | `List<String>` | not declared | unconstrained |
| `end` | `List<String>` | not declared | unconstrained |
| `defaultOnCreate` | `String` | not declared | unconstrained |
| `autoCloseWhen` | `String` | not declared | unconstrained |
| `allowSkipStages` | `Boolean` | not declared | unconstrained |
| `autoCloseAfterDays` | `Integer` | not declared | unconstrained |

Example:

```json
{
  "voucherAutomation": "string",
  "batchManagement": "string",
  "deliveryChallanStatusFlow": "string",
  "receiptNoteStatusFlow": "string",
  "autoCreateOppositeOnDcRc": false,
  "lookups": "string",
  "autoCloseWhen": "string",
  "batchNumberFormat": [],
  "batchAllocationMethod": [],
  "value": "string",
  "label": "string",
  "inventoryViaBusinessDocument": false,
  "autoGenerateDcOnInvoice": false,
  "autoGenerateRcOnBill": false,
  "enabled": false,
  "numberFormat": "string",
  "allocationMethod": "string",
  "expiryAlertDays": 0,
  "mandatoryBatchOnOutward": false,
  "allowNegativeBatchStock": false,
  "start": [],
  "inProgress": [],
  "end": [],
  "defaultOnCreate": "string",
  "allowSkipStages": false,
  "autoCloseAfterDays": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventorySettingsService.update(company, request, principal`

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
- `body.voucherAutomation.inventoryViaBusinessDocument (and related voucherAutomation flags)`
- `body.batchManagement`
- `body.deliveryChallanStatusFlow`
- `body.receiptNoteStatusFlow`
- `body.defaultReportNature`
- `body.lookups`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-settings?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"voucherAutomation":"string","batchManagement":"string","deliveryChallanStatusFlow":"string","receiptNoteStatusFlow":"string","autoCreateOppositeOnDcRc":false,"lookups":"string","autoCloseWhen":"string","batchNumberFormat":[],"batchAllocationMethod":[],"value":"string","label":"string","inventoryViaBusinessDocument":false,"autoGenerateDcOnInvoice":false,"autoGenerateRcOnBill":false,"enabled":false,"numberFormat":"string","allocationMethod":"string","expiryAlertDays":0,"mandatoryBatchOnOutward":false,"allowNegativeBatchStock":false,"start":[],"inProgress":[],"end":[],"defaultOnCreate":"string","allowSkipStages":false,"autoCloseAfterDays":0}'
```

---

### `PATCH /v2/company/:companyUniqueName/stock/:stockUniqueName/variant/:variantUniqueName`

- **Frontend id:** `INVENTORY_API.INVENTORY_VARIANT_UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateInventoryVariant`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockV2Controller#updatePatch
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockV2Controller.java:89`
- **Deprecated:** No

Update Patch

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
- `variantUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `InventoryTableModel` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `customFields` | `List<CustomFieldResource>` | not declared | unconstrained |
| `variantName` | `String` | not declared | unconstrained |
| `variantUniqueName` | `String` | not declared | unconstrained |
| `discountName` | `String` | not declared | unconstrained |
| `discountUniqueName` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `stockUniqueName` | `String` | not declared | unconstrained |
| `stockGroupName` | `String` | not declared | unconstrained |
| `stockGroupUniqueName` | `String` | not declared | unconstrained |
| `stockUnitName` | `String` | not declared | unconstrained |
| `stockUnitCode` | `String` | not declared | unconstrained |
| `stockUnitUniqueName` | `String` | not declared | unconstrained |
| `unitGroupName` | `String` | not declared | unconstrained |
| `unitGroupUniqueName` | `String` | not declared | unconstrained |
| `hsnNo` | `String` | not declared | unconstrained |
| `sacNo` | `String` | not declared | unconstrained |
| `skuCode` | `String` | not declared | unconstrained |
| `isSystemGenerated` | `boolean` | not declared | unconstrained |
| `salesRate` | `BigDecimal` | not declared | unconstrained |
| `purchaseRate` | `BigDecimal` | not declared | unconstrained |
| `fixedAssetRate` | `BigDecimal` | not declared | unconstrained |
| `taxes` | `Set<String>` | not declared | unconstrained |
| `salesUnits` | `List<StockUnitResource>` | not declared | unconstrained |
| `purchaseUnits` | `List<StockUnitResource>` | not declared | unconstrained |
| `fixedAssetUnits` | `List<StockUnitResource>` | not declared | unconstrained |
| `purchaseAccountName` | `String` | not declared | unconstrained |
| `purchaseAccountUniqueName` | `String` | not declared | unconstrained |
| `salesAccountName` | `String` | not declared | unconstrained |
| `salesAccountUniqueName` | `String` | not declared | unconstrained |
| `fixedAssetAccountName` | `String` | not declared | unconstrained |
| `fixedAssetAccountUniqueName` | `String` | not declared | unconstrained |
| `salesTaxInclusive` | `Boolean` | not declared | unconstrained |
| `purchaseTaxInclusive` | `Boolean` | not declared | unconstrained |
| `fixedAssetTaxInclusive` | `Boolean` | not declared | unconstrained |
| `archive` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "customFields": [],
  "variantName": "string",
  "variantUniqueName": "string",
  "discountName": "string",
  "discountUniqueName": "string",
  "stockName": "string",
  "stockUniqueName": "string",
  "stockGroupName": "string",
  "stockGroupUniqueName": "string",
  "stockUnitName": "string",
  "stockUnitCode": "string",
  "stockUnitUniqueName": "string",
  "unitGroupName": "string",
  "unitGroupUniqueName": "string",
  "hsnNo": "string",
  "sacNo": "string",
  "skuCode": "string",
  "isSystemGenerated": false,
  "salesRate": 0,
  "purchaseRate": 0,
  "fixedAssetRate": 0,
  "taxes": [],
  "salesUnits": [],
  "purchaseUnits": [],
  "fixedAssetUnits": [],
  "purchaseAccountName": "string",
  "purchaseAccountUniqueName": "string",
  "salesAccountName": "string",
  "salesAccountUniqueName": "string",
  "fixedAssetAccountName": "string",
  "fixedAssetAccountUniqueName": "string",
  "salesTaxInclusive": false,
  "purchaseTaxInclusive": false,
  "fixedAssetTaxInclusive": false,
  "archive": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Field saved successfully"`

```json
{
  "status": "success",
  "body": "Field saved successfully"
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
curl --request PATCH \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/variant/SAMPLE_variantUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"customFields":[],"variantName":"string","variantUniqueName":"string","discountName":"string","discountUniqueName":"string","stockName":"string","stockUniqueName":"string","stockGroupName":"string","stockGroupUniqueName":"string","stockUnitName":"string","stockUnitCode":"string","stockUnitUniqueName":"string","unitGroupName":"string","unitGroupUniqueName":"string","hsnNo":"string","sacNo":"string","skuCode":"string","isSystemGenerated":false,"salesRate":0,"purchaseRate":0,"fixedAssetRate":0,"taxes":[],"salesUnits":[],"purchaseUnits":[],"fixedAssetUnits":[],"purchaseAccountName":"string","purchaseAccountUniqueName":"string","salesAccountName":"string","salesAccountUniqueName":"string","fixedAssetAccountName":"string","fixedAssetAccountUniqueName":"string","salesTaxInclusive":false,"purchaseTaxInclusive":false,"fixedAssetTaxInclusive":false,"archive":false}'
```

---

### `GET /company/:companyUniqueName/linked-sources`

- **Frontend id:** `INVENTORY_API.LINKED_STOCKS.LINKED_STOCKS`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: CompanyController#getLinkedSources
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:605`
- **Deprecated:** No

Will return list of linked companies (self included) and also the linked warehouses.

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/linked-sources?q=&page=1&count=0&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stocks-manufacture`

- **Frontend id:** `INVENTORY_API.MANUFACTURING_STOCKS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetManufacturingStocks`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllManufacturedStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:436`
- **Deprecated:** No

Get All Manufactured Stocks

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
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
- `body as StocksResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks-manufacture?q=&page=1&count=0&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/inventory/:stockGroupUniqueName/masters?page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.MASTER.GET_MASTER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getMasters`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: MastersController#inventoryMasters
- **Backend source:** `src/main/java/com/giddh/api/controllers/MastersController.java:63`
- **Deprecated:** No

Inventory Masters

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `100`

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/SAMPLE_STOCK_GROUP/masters?page=1&count=100&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock-groups-with-stocks?inventoryType=:inventoryType&q=:q`

- **Frontend id:** `INVENTORY_API.MASTER.SEARCH`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#searchInventory`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: MastersController#stockGroupsWithStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/MastersController.java:92`
- **Deprecated:** No

Stock Groups With Stocks

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `refresh` — type: `boolean`; optional; default: `false`
- `inventoryType` — type: `String`; optional

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-groups-with-stocks?q=&refresh=false&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/top-inventory-groups?inventoryType=:inventoryType&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.MASTER.TOP_INVENTORY_GROUPS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getTopLevelGroups`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: MastersController#topInventoryGroups
- **Backend source:** `src/main/java/com/giddh/api/controllers/MastersController.java:78`
- **Deprecated:** No

Top Inventory Groups

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `100`
- `inventoryType` — type: `String`; optional

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/top-inventory-groups?page=1&count=100&inventoryType=SAMPLE_inventoryType&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/stock/:stockUniqueName/move`

- **Frontend id:** `INVENTORY_API.MOVE_STOCK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#MoveStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#moveStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:211`
- **Deprecated:** No

Move Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockGroup` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | NotNull, Size(min = 1, max = 100, message = "Name is too long.") | unconstrained |
| `uniqueName` | `String` | Pattern(regexp = "[a-z0-9!#@.$%&'*+=?^_`|\\[\\]~-]+", message = "Unique Name must not contain Capitals, forwardSlashes(/), NotNull, Size(min = 1, max = 100, message = "Unique name is too long.") | unconstrained |
| `hsnNumber` | `String` | not declared | unconstrained |
| `sacNumber` | `String` | not declared | unconstrained |
| `taxes` | `Set<Tax>` | not declared | unconstrained |
| `discounts` | `Set<Discount>` | not declared | unconstrained |
| `type` | `String` | Pattern(regexp = "^(PRODUCT|SERVICE|FIXED_ASSETS) | unconstrained |
| `runtimeManufacturing` | `Boolean` | not declared | unconstrained |
| `outOfStockSelling` | `Boolean` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "uniqueName": "string",
  "hsnNumber": "string",
  "sacNumber": "string",
  "taxes": [],
  "discounts": [],
  "type": "string",
  "runtimeManufacturing": false,
  "outOfStockSelling": false
}
```

#### Success response

- HTTP status: `404 NOT_FOUND`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Stock moved successfully."`

```json
{
  "status": "success",
  "body": "Stock moved successfully."
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
| 404 | `STOCKGROUP_NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/move?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","uniqueName":"string","hsnNumber":"string","sacNumber":"string","taxes":[],"discounts":[],"type":"string","runtimeManufacturing":false,"outOfStockSelling":false}'
```

---

### `POST /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock`

- **Frontend id:** `INVENTORY_API.NEW.CREATE`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: StockWithGroupController#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:102`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
**Query parameters**
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

Type: `StockResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `updateBranchCompStocks` | `boolean` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxes": [],
  "updateBranchCompStocks": false,
  "rowNum": "string",
  "requestId": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `PARSE` | `ParseException` | ParseException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock?source=APP&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"updateBranchCompStocks":false,"rowNum":"string","requestId":"string"}'
```

---

### `GET /company/:companyUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.NEW.GET`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:163`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.NEW.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:125`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `updateBranchCompStocks` | `boolean` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxes": [],
  "updateBranchCompStocks": false,
  "rowNum": "string",
  "requestId": "string"
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
| 400 | ` doesnot belong to stockGroup ` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": " doesnot belong to stockGroup ",
  "message": "Stock "
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"updateBranchCompStocks":false,"rowNum":"string","requestId":"string"}'
```

---

### `GET /company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.REPORT`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: StockController#inventoryReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:193`
- **Deprecated:** No

Inventory Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `asc`

#### Controller-backed request payload

Type: `InventoryReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `includeInventory` | `Boolean` | not declared | unconstrained |
| `inventories` | `Set<String>` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `includeQuantity` | `Boolean` | not declared | unconstrained |
| `quantityGreaterThan` | `Boolean` | not declared | unconstrained |
| `quantityLessThan` | `Boolean` | not declared | unconstrained |
| `quantityNotEquals` | `Boolean` | not declared | unconstrained |
| `quantityEqualTo` | `Boolean` | not declared | unconstrained |
| `itemValue` | `BigDecimal` | not declared | unconstrained |
| `includeItemValue` | `Boolean` | not declared | unconstrained |
| `itemValueGreaterThan` | `Boolean` | not declared | unconstrained |
| `itemValueLessThan` | `Boolean` | not declared | unconstrained |
| `itemValueEqualTo` | `Boolean` | not declared | unconstrained |
| `includeSenders` | `Boolean` | not declared | unconstrained |
| `senders` | `Set<String>` | not declared | unconstrained |
| `includeReceivers` | `Boolean` | not declared | unconstrained |
| `receivers` | `Set<String>` | not declared | unconstrained |
| `senderName` | `String` | not declared | unconstrained |
| `receiverName` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `jobWorkTransactionType` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "includeInventory": false,
  "inventories": [],
  "quantity": 0,
  "includeQuantity": false,
  "quantityGreaterThan": false,
  "quantityLessThan": false,
  "quantityNotEquals": false,
  "quantityEqualTo": false,
  "itemValue": 0,
  "includeItemValue": false,
  "itemValueGreaterThan": false,
  "itemValueLessThan": false,
  "itemValueEqualTo": false,
  "includeSenders": false,
  "senders": [],
  "includeReceivers": false,
  "receivers": [],
  "senderName": "string",
  "receiverName": "string",
  "stockName": "string",
  "jobWorkTransactionType": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryReport`

```json
{
  "status": "success",
  "body": {
    "reference": "inventoryReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/inventory-report?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=entry_date&sort=asc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"includeInventory":false,"inventories":[],"quantity":0,"includeQuantity":false,"quantityGreaterThan":false,"quantityLessThan":false,"quantityNotEquals":false,"quantityEqualTo":false,"itemValue":0,"includeItemValue":false,"itemValueGreaterThan":false,"itemValueLessThan":false,"itemValueEqualTo":false,"includeSenders":false,"senders":[],"includeReceivers":false,"receivers":[],"senderName":"string","receiverName":"string","stockName":"string","jobWorkTransactionType":[]}'
```

---

### `POST /company/:companyUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `INVENTORY_API.REPORT_ALL_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetInventoryReport_v2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#inventoryReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:531`
- **Deprecated:** No

Inventory Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `asc`

#### Controller-backed request payload

Type: `InventoryReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `includeInventory` | `Boolean` | not declared | unconstrained |
| `inventories` | `Set<String>` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `includeQuantity` | `Boolean` | not declared | unconstrained |
| `quantityGreaterThan` | `Boolean` | not declared | unconstrained |
| `quantityLessThan` | `Boolean` | not declared | unconstrained |
| `quantityNotEquals` | `Boolean` | not declared | unconstrained |
| `quantityEqualTo` | `Boolean` | not declared | unconstrained |
| `itemValue` | `BigDecimal` | not declared | unconstrained |
| `includeItemValue` | `Boolean` | not declared | unconstrained |
| `itemValueGreaterThan` | `Boolean` | not declared | unconstrained |
| `itemValueLessThan` | `Boolean` | not declared | unconstrained |
| `itemValueEqualTo` | `Boolean` | not declared | unconstrained |
| `includeSenders` | `Boolean` | not declared | unconstrained |
| `senders` | `Set<String>` | not declared | unconstrained |
| `includeReceivers` | `Boolean` | not declared | unconstrained |
| `receivers` | `Set<String>` | not declared | unconstrained |
| `senderName` | `String` | not declared | unconstrained |
| `receiverName` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `jobWorkTransactionType` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "includeInventory": false,
  "inventories": [],
  "quantity": 0,
  "includeQuantity": false,
  "quantityGreaterThan": false,
  "quantityLessThan": false,
  "quantityNotEquals": false,
  "quantityEqualTo": false,
  "itemValue": 0,
  "includeItemValue": false,
  "itemValueGreaterThan": false,
  "itemValueLessThan": false,
  "itemValueEqualTo": false,
  "includeSenders": false,
  "senders": [],
  "includeReceivers": false,
  "receivers": [],
  "senderName": "string",
  "receiverName": "string",
  "stockName": "string",
  "jobWorkTransactionType": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryReport`

```json
{
  "status": "success",
  "body": {
    "reference": "inventoryReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-report?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=entry_date&sort=asc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"includeInventory":false,"inventories":[],"quantity":0,"includeQuantity":false,"quantityGreaterThan":false,"quantityLessThan":false,"quantityNotEquals":false,"quantityEqualTo":false,"itemValue":0,"includeItemValue":false,"itemValueGreaterThan":false,"itemValueLessThan":false,"itemValueEqualTo":false,"includeSenders":false,"senders":[],"includeReceivers":false,"receivers":[],"senderName":"string","receiverName":"string","stockName":"string","jobWorkTransactionType":[]}'
```

---

### `POST /company/:companyUniqueName/stock/:stockUniqueName/inventory-report?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`

- **Frontend id:** `INVENTORY_API.REPORT_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetInventoryReport_v2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#inventoryReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:193`
- **Deprecated:** No

Inventory Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `asc`

#### Controller-backed request payload

Type: `InventoryReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `includeInventory` | `Boolean` | not declared | unconstrained |
| `inventories` | `Set<String>` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `includeQuantity` | `Boolean` | not declared | unconstrained |
| `quantityGreaterThan` | `Boolean` | not declared | unconstrained |
| `quantityLessThan` | `Boolean` | not declared | unconstrained |
| `quantityNotEquals` | `Boolean` | not declared | unconstrained |
| `quantityEqualTo` | `Boolean` | not declared | unconstrained |
| `itemValue` | `BigDecimal` | not declared | unconstrained |
| `includeItemValue` | `Boolean` | not declared | unconstrained |
| `itemValueGreaterThan` | `Boolean` | not declared | unconstrained |
| `itemValueLessThan` | `Boolean` | not declared | unconstrained |
| `itemValueEqualTo` | `Boolean` | not declared | unconstrained |
| `includeSenders` | `Boolean` | not declared | unconstrained |
| `senders` | `Set<String>` | not declared | unconstrained |
| `includeReceivers` | `Boolean` | not declared | unconstrained |
| `receivers` | `Set<String>` | not declared | unconstrained |
| `senderName` | `String` | not declared | unconstrained |
| `receiverName` | `String` | not declared | unconstrained |
| `stockName` | `String` | not declared | unconstrained |
| `jobWorkTransactionType` | `Set<String>` | not declared | unconstrained |

Example:

```json
{
  "includeInventory": false,
  "inventories": [],
  "quantity": 0,
  "includeQuantity": false,
  "quantityGreaterThan": false,
  "quantityLessThan": false,
  "quantityNotEquals": false,
  "quantityEqualTo": false,
  "itemValue": 0,
  "includeItemValue": false,
  "itemValueGreaterThan": false,
  "itemValueLessThan": false,
  "itemValueEqualTo": false,
  "includeSenders": false,
  "senders": [],
  "includeReceivers": false,
  "receivers": [],
  "senderName": "string",
  "receiverName": "string",
  "stockName": "string",
  "jobWorkTransactionType": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryReport`

```json
{
  "status": "success",
  "body": {
    "reference": "inventoryReport"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/inventory-report?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=entry_date&sort=asc&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"includeInventory":false,"inventories":[],"quantity":0,"includeQuantity":false,"quantityGreaterThan":false,"quantityLessThan":false,"quantityNotEquals":false,"quantityEqualTo":false,"itemValue":0,"includeItemValue":false,"itemValueGreaterThan":false,"itemValueLessThan":false,"itemValueEqualTo":false,"includeSenders":false,"senders":[],"includeReceivers":false,"receivers":[],"senderName":"string","receiverName":"string","stockName":"string","jobWorkTransactionType":[]}'
```

---

### `POST /company/:companyUniqueName/inventory-search`

- **Frontend id:** `INVENTORY_API.SEARCH_STOCK_TRANSACTION_FILTERS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#searchStockTransactionReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** search-api: SearchController#inventorySearch
- **Backend source:** `src/main/java/com/giddh/api/controllers/SearchController.java:212`
- **Deprecated:** No

Inventory Search

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

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

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

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

### `POST /v2/company/:companyUniqueName/stock-aging-report?page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.STOCK_AGING_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockAgingReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockAgingReportController#getStockAgingReport
- **Backend source:** `src/main/java/com/giddh/api/controller/StockAgingReportController.java:36`
- **Deprecated:** No

Get Stock Aging Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `StockAgingReportRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `branchUniqueNames` | `List<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `List<String>` | not declared | unconstrained |
| `stockGroupUniqueNames` | `List<String>` | not declared | unconstrained |
| `categoryUniqueNames` | `List<String>` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `asOnDate` | `String` | not declared | unconstrained |
| `page` | `Integer` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `searchText` | `String` | not declared | unconstrained |
| `refresh` | `Boolean` | not declared | unconstrained |
| `interval` | `String` | not declared | unconstrained |

Example:

```json
{
  "branchUniqueNames": [],
  "warehouseUniqueNames": [],
  "stockGroupUniqueNames": [],
  "categoryUniqueNames": [],
  "variantUniqueNames": [],
  "asOnDate": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "searchText": "string",
  "refresh": false,
  "interval": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<StockAgingReportResponse>`
- Body evidence: `ResponseEntity<StockAgingReportResponse>`

```json
{
  "totals": "string",
  "items": "string"
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
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report?page=1&count=50&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"branchUniqueNames":[],"warehouseUniqueNames":[],"stockGroupUniqueNames":[],"categoryUniqueNames":[],"variantUniqueNames":[],"asOnDate":"string","page":0,"count":0,"sort":"string","sortBy":"string","searchText":"string","refresh":false,"interval":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/stock-aging-report/:stockUniqueName/details?page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.STOCK_AGING_REPORT_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockAgingReportDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockAgingReportController#getStockAgingDrilldown
- **Backend source:** `src/main/java/com/giddh/api/controller/StockAgingReportController.java:64`
- **Deprecated:** No

Get Stock Aging Drilldown

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `StockAgingReportRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `branchUniqueNames` | `List<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `List<String>` | not declared | unconstrained |
| `stockGroupUniqueNames` | `List<String>` | not declared | unconstrained |
| `categoryUniqueNames` | `List<String>` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `asOnDate` | `String` | not declared | unconstrained |
| `page` | `Integer` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `searchText` | `String` | not declared | unconstrained |
| `refresh` | `Boolean` | not declared | unconstrained |
| `interval` | `String` | not declared | unconstrained |

Example:

```json
{
  "branchUniqueNames": [],
  "warehouseUniqueNames": [],
  "stockGroupUniqueNames": [],
  "categoryUniqueNames": [],
  "variantUniqueNames": [],
  "asOnDate": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "searchText": "string",
  "refresh": false,
  "interval": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<StockAgingDrilldown>`
- Body evidence: `ResponseEntity<StockAgingDrilldown>`

```json
{
  "itemCode": "string",
  "itemName": "string",
  "totalStockQty": 0,
  "totalStockValue": 0,
  "bucketSummary": [],
  "transactions": "string"
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
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report/SAMPLE_STOCK/details?page=1&count=50&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"branchUniqueNames":[],"warehouseUniqueNames":[],"stockGroupUniqueNames":[],"categoryUniqueNames":[],"variantUniqueNames":[],"asOnDate":"string","page":0,"count":0,"sort":"string","sortBy":"string","searchText":"string","refresh":false,"interval":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/stock-aging-report/totals`

- **Frontend id:** `INVENTORY_API.STOCK_AGING_REPORT_TOTALS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockAgingReportTotals`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockAgingReportController#getStockAgingTotals
- **Backend source:** `src/main/java/com/giddh/api/controller/StockAgingReportController.java:51`
- **Deprecated:** No

Get Stock Aging Totals

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `StockAgingReportRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `branchUniqueNames` | `List<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `List<String>` | not declared | unconstrained |
| `stockGroupUniqueNames` | `List<String>` | not declared | unconstrained |
| `categoryUniqueNames` | `List<String>` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `asOnDate` | `String` | not declared | unconstrained |
| `page` | `Integer` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `searchText` | `String` | not declared | unconstrained |
| `refresh` | `Boolean` | not declared | unconstrained |
| `interval` | `String` | not declared | unconstrained |

Example:

```json
{
  "branchUniqueNames": [],
  "warehouseUniqueNames": [],
  "stockGroupUniqueNames": [],
  "categoryUniqueNames": [],
  "variantUniqueNames": [],
  "asOnDate": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "searchText": "string",
  "refresh": false,
  "interval": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<StockAgingReportResponse>`
- Body evidence: `ResponseEntity<StockAgingReportResponse>`

```json
{
  "totals": "string",
  "items": "string"
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
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report/totals?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"branchUniqueNames":[],"warehouseUniqueNames":[],"stockGroupUniqueNames":[],"categoryUniqueNames":[],"variantUniqueNames":[],"asOnDate":"string","page":0,"count":0,"sort":"string","sortBy":"string","searchText":"string","refresh":false,"interval":"string"}'
```

---

### `POST /v2/company/:companyUniqueName/stock-aging-report/:stockUniqueName/variants?page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.STOCK_AGING_REPORT_VARIANTS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockAgingReportVariants`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockAgingReportController#getStockAgingVariants
- **Backend source:** `src/main/java/com/giddh/api/controller/StockAgingReportController.java:80`
- **Deprecated:** No

Get Stock Aging Variants

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `StockAgingReportRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `branchUniqueNames` | `List<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `List<String>` | not declared | unconstrained |
| `stockGroupUniqueNames` | `List<String>` | not declared | unconstrained |
| `categoryUniqueNames` | `List<String>` | not declared | unconstrained |
| `variantUniqueNames` | `List<String>` | not declared | unconstrained |
| `asOnDate` | `String` | not declared | unconstrained |
| `page` | `Integer` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `searchText` | `String` | not declared | unconstrained |
| `refresh` | `Boolean` | not declared | unconstrained |
| `interval` | `String` | not declared | unconstrained |

Example:

```json
{
  "branchUniqueNames": [],
  "warehouseUniqueNames": [],
  "stockGroupUniqueNames": [],
  "categoryUniqueNames": [],
  "variantUniqueNames": [],
  "asOnDate": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "searchText": "string",
  "refresh": false,
  "interval": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `raw`
- Declared return: `ResponseEntity<StockAgingVariantResponse>`
- Body evidence: `ResponseEntity<StockAgingVariantResponse>`

```json
{
  "totals": "string",
  "items": "string"
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
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-aging-report/SAMPLE_STOCK/variants?page=1&count=20&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"branchUniqueNames":[],"warehouseUniqueNames":[],"stockGroupUniqueNames":[],"categoryUniqueNames":[],"variantUniqueNames":[],"asOnDate":"string","page":0,"count":0,"sort":"string","sortBy":"string","searchText":"string","refresh":false,"interval":"string"}'
```

---

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.STOCK_DETAIL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStockDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:141`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

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
| 400 | ` doesnot belong to stockGroup ` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
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
  "code": " doesnot belong to stockGroup ",
  "message": "Stock "
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page`

- **Frontend id:** `INVENTORY_API.STOCK_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStocksReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#getStockReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:169`
- **Deprecated:** No

Get Stock Report V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `asc`
- `q` — type: `String`; optional; default: ``
- `newApi` — type: `boolean`; optional; default: `false`
- `transaction_type` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockReport`

```json
{
  "status": "success",
  "body": {
    "reference": "stockReport"
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
- `body as StockReportResponse`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/report-v2?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=entry_date&sort=asc&q=&newApi=false&transaction_type=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `POST /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType`

- **Frontend id:** `INVENTORY_API.STOCK_REPORT_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStocksReport_v2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#getStockReportV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:169`
- **Deprecated:** No

Get Stock Report V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `asc`
- `q` — type: `String`; optional; default: ``
- `newApi` — type: `boolean`; optional; default: `false`
- `transaction_type` — type: `String`; optional; default: ``

#### Controller-backed request payload

Type: `StockReportFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `String` | not declared | unconstrained |
| `param` | `String` | not declared | unconstrained |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountUniqueName` | `String` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `source` | `String` | not declared | unconstrained |
| `destination` | `String` | not declared | unconstrained |
| `voucherTypes` | `List<String>` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `NameUniqueNameImpl` | not declared | unconstrained |
| `newApi` | `boolean` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |
| `value` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "string",
  "val": 0,
  "accountUniqueName": "string",
  "accountName": "string",
  "source": "string",
  "destination": "string",
  "voucherTypes": [],
  "branchUniqueName": "string",
  "warehouseUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "newApi": false,
  "value": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockReport`

```json
{
  "status": "success",
  "body": {
    "reference": "stockReport"
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
- `body as StockReportResponse`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK/report-v2?from=01-04-2025&to=31-03-2026&page=1&count=20&sortBy=entry_date&sort=asc&q=&newApi=false&transaction_type=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"string","val":0,"accountUniqueName":"string","accountName":"string","source":"string","destination":"string","voucherTypes":[],"branchUniqueName":"string","warehouseUniqueName":"string","variant":"string","batch":"string","newApi":false,"value":"string"}'
```

---

### `GET /company/:companyUniqueName/stock-unit`

- **Frontend id:** `INVENTORY_API.STOCK_UNIT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStockUnit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#getAll
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:84`
- **Deprecated:** No

Get All

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

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
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `body as StockUnitResponse[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stocks`

- **Frontend id:** `INVENTORY_API.STOCKS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#GetStocks`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllStocks
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:394`
- **Deprecated:** No

Get All Stocks

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `refresh` — type: `boolean`; optional; default: `true`
- `isManufactured` — type: `boolean`; optional; default: `false`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks?q=&page=1&count=0&refresh=true&isManufactured=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stocks/v2`

- **Frontend id:** `INVENTORY_API.STOCKS_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStocksV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CompanyController#getAllStocksV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/CompanyController.java:419`
- **Deprecated:** No

Get All Stocks V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `20`
- `refresh` — type: `boolean`; optional; default: `false`
- `inventoryType` — type: `String`; optional; default: ``

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stocks/v2?q=&page=1&count=20&refresh=false&inventoryType=&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/inventory/balance?stockGroupUniqueName=:stockGroupUniqueName&entity=:entity&from=:from&to=:to&reportNature=:reportNature`

- **Frontend id:** `INVENTORY_API.TRANSACTION_STOCK_REPORT_BALANCE_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockTransactionReportBalance`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventoryReportController#getInventoryBalance
- **Backend source:** `src/main/java/com/giddh/api/controllers/InventoryReportController.java:78`
- **Deprecated:** No

Get Inventory Balance

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `count` — type: `Integer`; optional; default: `50`
- `stockGroupUniqueName` — type: `String`; optional; default: ``
- `entity` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional
- `reportNature` — type: `String`; optional

#### Controller-backed request payload

Type: `InventoryReportsFilter` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `FilterExpression` | not declared | unconstrained |
| `param` | `FilterParams` | not declared | CLOSING_QTY, QTY_CR, QTY_DR, RATE, AMT_CR, AMT_DR |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `voucherTypes` | `Set<InventoryVoucherType2>` | not declared | PURCHASE, PURCHASE_DEBIT_NOTE, PURCHASE_CREDIT_NOTE, SALES, SALES_DEBIT_NOTE, SALES_CREDIT_NOTE, MANUFACTURED, RAW_MATERIAL, RECEIPT_NOTE, DELIVERY_NOTE, CREDIT_NOTE, DEBIT_NOTE, JOURNAL |
| `branchUniqueNames` | `Set<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `Set<String>` | not declared | unconstrained |
| `variantUniqueNames` | `Set<String>` | not declared | unconstrained |
| `batchUniqueNames` | `Set<String>` | not declared | unconstrained |
| `batchNumbers` | `Set<String>` | not declared | unconstrained |
| `stockUniqueNames` | `Set<String>` | not declared | unconstrained |
| `stockGroupUniqueNames` | `Set<String>` | not declared | unconstrained |
| `inventoryType` | `InventoryType` | not declared | PRODUCT, SERVICE, FIXED_ASSETS |
| `inventoryAdjustmentRefNo` | `String` | not declared | unconstrained |
| `archived` | `Boolean` | not declared | unconstrained |
| `reportNature` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "CLOSING_QTY",
  "val": 0,
  "accountName": "string",
  "voucherTypes": [
    "PURCHASE"
  ],
  "branchUniqueNames": [],
  "warehouseUniqueNames": [],
  "variantUniqueNames": [],
  "batchUniqueNames": [],
  "batchNumbers": [],
  "stockUniqueNames": [],
  "stockGroupUniqueNames": [],
  "inventoryType": "PRODUCT",
  "inventoryAdjustmentRefNo": "string",
  "archived": false,
  "reportNature": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryBalance`

```json
{
  "status": "success",
  "body": {
    "reference": "inventoryBalance"
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
- `body as StockReportResponse`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/balance?from=01-04-2025&to=31-03-2026&count=50&stockGroupUniqueName=&entity=SAMPLE_entity&branchUniqueName=aaaa&reportNature=SAMPLE_reportNature' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"CLOSING_QTY","val":0,"accountName":"string","voucherTypes":["PURCHASE"],"branchUniqueNames":[],"warehouseUniqueNames":[],"variantUniqueNames":[],"batchUniqueNames":[],"batchNumbers":[],"stockUniqueNames":[],"stockGroupUniqueNames":[],"inventoryType":"PRODUCT","inventoryAdjustmentRefNo":"string","archived":false,"reportNature":"string"}'
```

---

### `POST /company/:companyUniqueName/inventory/transaction-report?from=:from&to=:to&count=:count&page=:page&sort=:sort&sortBy=:sortBy&transaction_type=:transactionType&reportNature=:reportNature`

- **Frontend id:** `INVENTORY_API.TRANSACTION_STOCK_REPORT_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockTransactionReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: InventoryReportController#getStockTransactionReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/InventoryReportController.java:48`
- **Deprecated:** No

Get Stock Transaction Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `page` — type: `Integer`; optional; default: `1`
- `count` — type: `Integer`; optional; default: `50`
- `sortBy` — type: `String`; optional; default: `entry_date`
- `sort` — type: `String`; optional; default: `desc`
- `branchUniqueName` — type: `String`; optional
- `reportNature` — type: `String`; optional

#### Controller-backed request payload

Type: `InventoryReportsFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `expression` | `FilterExpression` | not declared | unconstrained |
| `param` | `FilterParams` | not declared | CLOSING_QTY, QTY_CR, QTY_DR, RATE, AMT_CR, AMT_DR |
| `val` | `BigDecimal` | not declared | unconstrained |
| `accountName` | `String` | not declared | unconstrained |
| `voucherTypes` | `Set<InventoryVoucherType2>` | not declared | PURCHASE, PURCHASE_DEBIT_NOTE, PURCHASE_CREDIT_NOTE, SALES, SALES_DEBIT_NOTE, SALES_CREDIT_NOTE, MANUFACTURED, RAW_MATERIAL, RECEIPT_NOTE, DELIVERY_NOTE, CREDIT_NOTE, DEBIT_NOTE, JOURNAL |
| `branchUniqueNames` | `Set<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `Set<String>` | not declared | unconstrained |
| `variantUniqueNames` | `Set<String>` | not declared | unconstrained |
| `batchUniqueNames` | `Set<String>` | not declared | unconstrained |
| `batchNumbers` | `Set<String>` | not declared | unconstrained |
| `stockUniqueNames` | `Set<String>` | not declared | unconstrained |
| `stockGroupUniqueNames` | `Set<String>` | not declared | unconstrained |
| `inventoryType` | `InventoryType` | not declared | PRODUCT, SERVICE, FIXED_ASSETS |
| `inventoryAdjustmentRefNo` | `String` | not declared | unconstrained |
| `archived` | `Boolean` | not declared | unconstrained |
| `reportNature` | `String` | not declared | unconstrained |

Example:

```json
{
  "expression": "string",
  "param": "CLOSING_QTY",
  "val": 0,
  "accountName": "string",
  "voucherTypes": [
    "PURCHASE"
  ],
  "branchUniqueNames": [],
  "warehouseUniqueNames": [],
  "variantUniqueNames": [],
  "batchUniqueNames": [],
  "batchNumbers": [],
  "stockUniqueNames": [],
  "stockGroupUniqueNames": [],
  "inventoryType": "PRODUCT",
  "inventoryAdjustmentRefNo": "string",
  "archived": false,
  "reportNature": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockReport`

```json
{
  "status": "success",
  "body": {
    "reference": "stockReport"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `SQL` | `SQLException` | SQLException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory/transaction-report?from=01-04-2025&to=31-03-2026&page=1&count=50&sortBy=entry_date&sort=desc&branchUniqueName=aaaa&reportNature=SAMPLE_reportNature' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"expression":"string","param":"CLOSING_QTY","val":0,"accountName":"string","voucherTypes":["PURCHASE"],"branchUniqueNames":[],"warehouseUniqueNames":[],"variantUniqueNames":[],"batchUniqueNames":[],"batchNumbers":[],"stockUniqueNames":[],"stockGroupUniqueNames":[],"inventoryType":"PRODUCT","inventoryAdjustmentRefNo":"string","archived":false,"reportNature":"string"}'
```

---

### `PUT /company/:companyUniqueName/branch-transfer/:branchTransferUniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_BRANCH_TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateNewBranchTransfer`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BranchTransferController#updateBranchTransferNote
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/branchTransfer/BranchTransferController.java:201`
- **Deprecated:** No

Update Branch Transfer Note

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BranchTransferV1` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `dateOfSupply` | `String` | not declared | unconstrained |
| `challanNo` | `String` | not declared | unconstrained |
| `note` | `String` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `sources` | `List<SourceDestination>` | not declared | unconstrained |
| `destinations` | `List<SourceDestination>` | not declared | unconstrained |
| `products` | `List<ProductDetails>` | not declared | unconstrained |
| `entity` | `String` | not declared | unconstrained |
| `transporterDetails` | `TransporterDetails` | not declared | unconstrained |
| `totalAmount` | `BigDecimal` | not declared | unconstrained |
| `transferType` | `String` | not declared | unconstrained |
| `autoGenerateNote` | `boolean` | not declared | unconstrained |

Example:

```json
{
  "dateOfSupply": "string",
  "challanNo": "string",
  "note": "string",
  "uniqueName": "string",
  "sources": [],
  "destinations": [],
  "products": [],
  "entity": "string",
  "transporterDetails": "string",
  "totalAmount": 0,
  "transferType": "string",
  "autoGenerateNote": false
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `response.get(0`

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
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/branch-transfer/SAMPLE_transferNoteUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"dateOfSupply":"string","challanNo":"string","note":"string","uniqueName":"string","sources":[],"destinations":[],"products":[],"entity":"string","transporterDetails":"string","totalAmount":0,"transferType":"string","autoGenerateNote":false}'
```

---

### `PATCH /company/:companyUniqueName/inventory-users/:companyUniqueName/inventory-entries/:uniqueName/description`

- **Frontend id:** `INVENTORY_API.UPDATE_DESCRIPTION`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: InventoryEntryController#updateInventoryEntryDescription
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InventoryEntryController.java:131`
- **Deprecated:** No

Api for updates Job work inventory entry description

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `inventoryUserUniqueName` — type: `String`; required
- `inventoryEntryUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `InventoryEntryResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Success"`

```json
{
  "status": "success",
  "body": "Success"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users/SAMPLE_inventoryUserUniqueName/inventory-entries/SAMPLE_inventoryEntryUniqueName/description?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PATCH /company/:companyUniqueName/customer-vendor-discount/stock/:stockUniqueName/variant/:variantUniqueName/update-discount`

- **Frontend id:** `INVENTORY_API.UPDATE_DISCOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateDiscount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CustomerVendorVariantDiscountController#updateCustomerVariantDiscount
- **Backend source:** `src/main/java/com/giddh/api/controllers/CustomerVendorVariantDiscountController.java:64`
- **Deprecated:** No

Update Customer Variant Discount

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
- `variantUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `CustomerVariantDiscountRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `customerVendorAccountUniqueName` | `String` | not declared | unconstrained |
| `customerVendorGroupUniqueName` | `String` | not declared | unconstrained |
| `discountInfo` | `List<DiscountRequest>` | not declared | unconstrained |

Example:

```json
{
  "customerVendorAccountUniqueName": "string",
  "customerVendorGroupUniqueName": "string",
  "discountInfo": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Record updated successfully."`

```json
{
  "status": "success",
  "body": "Record updated successfully."
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `EXECUTION` | `ExecutionException` | ExecutionException raised by controller or shared ExceptionHandler |
| 400 | `INTERRUPTED` | `InterruptedException` | InterruptedException raised by controller or shared ExceptionHandler |
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
curl --request PATCH \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/customer-vendor-discount/stock/SAMPLE_STOCK/variant/SAMPLE_variantUniqueName/update-discount?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"customerVendorAccountUniqueName":"string","customerVendorGroupUniqueName":"string","discountInfo":[]}'
```

---

### `PUT /company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#UpdateStock`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockWithGroupController.java:125`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `updateBranchCompStocks` | `boolean` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxes": [],
  "updateBranchCompStocks": false,
  "rowNum": "string",
  "requestId": "string"
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
| 400 | ` doesnot belong to stockGroup ` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": " doesnot belong to stockGroup ",
  "message": "Stock "
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`
- `body as StockDetailResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"updateBranchCompStocks":false,"rowNum":"string","requestId":"string"}'
```

---

### `PUT /company/:companyUniqueName/stock-group/:stockGroupUniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#UpdateStockGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockGroupController.java:137`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockGroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |

Example:

```json
{
  "taxes": [],
  "discounts": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `updatedStockGroupResource`

```json
{
  "status": "success",
  "body": {
    "reference": "updatedStockGroupResource"
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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `body as StockGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"discounts":[]}'
```

---

### `GET /company/:companyUniqueName/stock-unit/:uniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK_UNIT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockMappedUnitByUniqueName; apps/web-giddh/src/app/services/inventory.service.ts#UpdateStockUnit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:72`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockUnitResource(stockUnit`

```json
{
  "status": "success",
  "body": {
    "type": "StockUnitResource"
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
- `body as StockMappedUnitResponse`
- `queryString (echoed by service)`
- `body as StockUnitResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_stockUnitUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/stock-unit/:uniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK_UNIT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#getStockMappedUnitByUniqueName; apps/web-giddh/src/app/services/inventory.service.ts#UpdateStockUnit`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:58`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockUnitResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockUnitResource(stockUnit`

```json
{
  "status": "success",
  "body": {
    "type": "StockUnitResource"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
- `body as StockMappedUnitResponse`
- `queryString (echoed by service)`
- `body as StockUnitResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_stockUnitUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `PUT /company/:companyUniqueName/stock-unit-group/:groupUniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK_UNIT_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateStockUnitGroup; apps/web-giddh/src/app/services/inventory.service.ts#deleteStockUnitGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitGroupController#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitGroupController.java:56`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitGroupUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockUnitGroupResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockUnitGroupResource(stockUnitGroup`

```json
{
  "status": "success",
  "body": {
    "type": "StockUnitGroupResource"
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
- `body as any[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit-group/SAMPLE_stockUnitGroupUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `DELETE /company/:companyUniqueName/stock-unit-group/:groupUniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK_UNIT_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateStockUnitGroup; apps/web-giddh/src/app/services/inventory.service.ts#deleteStockUnitGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitGroupController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitGroupController.java:92`
- **Deprecated:** No

Delete

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitGroupUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Stock Unit Group deleted successfully."`

```json
{
  "status": "success",
  "body": "Stock Unit Group deleted successfully."
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
- `body as any[]`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit-group/SAMPLE_stockUnitGroupUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /v2/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName`

- **Frontend id:** `INVENTORY_API.UPDATE_STOCK_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateStockV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockWithGroupV2Controller#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/StockWithGroupV2Controller.java:110`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `source` — type: `RequestSource`; optional; allowed: `APP`, `API`, `ELECTRON`, `WEBSITE`, `SERVICE`, `TALLY`, `IMPORT`, `ZENCOMMERCE`, `ECOMMERCE`, `ICICI_BANK`, `SHOPIFY`, `MASTER`, `PLAID`, `GOCARDLESS`

#### Controller-backed request payload

Type: `StockResourceV2` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |
| `updateBranchCompStocks` | `boolean` | not declared | unconstrained |
| `rowNum` | `String` | not declared | unconstrained |
| `requestId` | `String` | not declared | unconstrained |

Example:

```json
{
  "taxes": [],
  "discounts": [],
  "updateBranchCompStocks": false,
  "rowNum": "string",
  "requestId": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockResourceResponse`

```json
{
  "status": "success",
  "body": {
    "reference": "stockResourceResponse"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | ` doesnot belong to stockGroup ` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": " doesnot belong to stockGroup ",
  "message": "Stock "
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP/stock/SAMPLE_STOCK?source=APP&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"discounts":[],"updateBranchCompStocks":false,"rowNum":"string","requestId":"string"}'
```

---

### `POST /company/:companyUniqueName/inventory-users`

- **Frontend id:** `INVENTORY_API.USER.CREATE`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: InventoryUserController#createInventoryUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InventoryUserController.java:69`
- **Deprecated:** No

Create Inventory User

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `InventoryUserResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `inventoryUserResource`

```json
{
  "status": "success",
  "body": {
    "reference": "inventoryUserResource"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_AUTH_KEY` | `InvalidAuthKeyException` | InvalidAuthKeyException raised by controller or shared ExceptionHandler |
| 401 | `INVALID_SESSION` | `InvalidSessionIdException` | InvalidSessionIdException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /company/:companyUniqueName/inventory-users?q=:q&refresh=:refresh&page=:page&count=:count`

- **Frontend id:** `INVENTORY_API.USER.GET_ALL`
- **Frontend evidence:** `inventory.api.ts · aside-recurring-voucher.service.ts#getAll`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: InventoryUserController#getAllInventoryUsers
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/InventoryUserController.java:118`
- **Deprecated:** No

Get All Inventory Users

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/inventory-users?q=&page=1&count=0&refresh=false&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v5/company/:companyUniqueName/stock-group?type=:type`

- **Frontend id:** `INVENTORY_API.V5.CREATE_STOCK_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#createStockGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupV5Controller#create
- **Backend source:** `src/main/java/com/giddh/api/controllers/v5/StockGroupV5Controller.java:81`
- **Deprecated:** No

Create

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockGroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |

Example:

```json
{
  "taxes": [],
  "discounts": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `new StockGroupResource(stockGroup`

```json
{
  "status": "success",
  "body": {
    "taxes": [],
    "discounts": []
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
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `body as StockGroupResponse`
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v5/company/dcrcdiin17887749442630bsy43/stock-group?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"discounts":[]}'
```

---

### `GET /v5/company/:companyUniqueName/stock-group/:groupUniqueName`

- **Frontend id:** `INVENTORY_API.V5.GET_STOCK_GROUP`
- **Frontend evidence:** `inventory.api.ts`
- **Method evidence:** frontend declaration inference
- **Backend match:** giddh-api-v2: StockGroupV5Controller#get
- **Backend source:** `src/main/java/com/giddh/api/controllers/v5/StockGroupV5Controller.java:107`
- **Deprecated:** No

Get

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required

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
  --url 'https://api.giddh.com/v5/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /v5/company/:companyUniqueName/stock-group/:groupUniqueName`

- **Frontend id:** `INVENTORY_API.V5.UPDATE_STOCK_GROUP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/inventory.service.ts#updateStockGroup`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockGroupV5Controller#update
- **Backend source:** `src/main/java/com/giddh/api/controllers/v5/StockGroupV5Controller.java:183`
- **Deprecated:** No

Update

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockGroupUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `StockGroupResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `taxes` | `Set<String>` | not declared | unconstrained |
| `discounts` | `Set<String>` | Size(max = 1, message = "Multiple discounts cannot be applied.") | unconstrained |

Example:

```json
{
  "taxes": [],
  "discounts": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `updatedStockGroupResource`

```json
{
  "status": "success",
  "body": {
    "reference": "updatedStockGroupResource"
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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
| 412 | `NOT_PERMITTED` | `NotPermittedException` | NotPermittedException raised by controller or shared ExceptionHandler |
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
- `body as StockGroupResponse`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/v5/company/dcrcdiin17887749442630bsy43/stock-group/SAMPLE_STOCK_GROUP?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"taxes":[],"discounts":[]}'
```

---

### `POST /company/:companyUniqueName/business-documents/:voucherUniqueName/action`

- **Frontend id:** `INVENTORY_VOUCHER_API.CANCEL`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#cancelInventoryVoucher`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#applyAction
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:171`
- **Deprecated:** No

Apply Action

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BusinessDocumentActionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `action` | `String` | not declared | unconstrained |
| `status` | `DocumentStatusResource` | not declared | unconstrained |
| `statusCode` | `String` | not declared | unconstrained |
| `businessDocumentType` | `BusinessDocumentType` | not declared | DC, RC, TRANSFER_DC, TRANSFER_RC, JOBWORK_DC, JOBWORK_RC, MANUFACTURING_ISSUE, MANUFACTURING_RECEIPT, ADJUSTMENT |
| `reason` | `String` | not declared | unconstrained |
| `remarks` | `String` | not declared | unconstrained |
| `uniqueNames` | `List<String>` | not declared | unconstrained |

Example:

```json
{
  "action": "string",
  "status": "string",
  "statusCode": "string",
  "businessDocumentType": "DC",
  "reason": "string",
  "remarks": "string",
  "uniqueNames": []
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `businessDocumentService.applyAction(company, uniqueName, request, principal, null`

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_UNIQUE_NAME/action?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"action":"string","status":"string","statusCode":"string","businessDocumentType":"DC","reason":"string","remarks":"string","uniqueNames":[]}'
```

---

### `POST /company/:companyUniqueName/business-documents/convert`

- **Frontend id:** `INVENTORY_VOUCHER_API.CONVERT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#convertInventoryDocuments`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#convert
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:222`
- **Deprecated:** No

Convert

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `BusinessDocumentConvertToVoucherRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `uniqueNames` | `List<String>` | not declared | unconstrained |
| `documents` | `List<DocumentContribution>` | not declared | unconstrained |
| `voucher` | `VoucherV4` | not declared | unconstrained |
| `uniqueName` | `String` | not declared | unconstrained |
| `items` | `List<ItemContribution>` | not declared | unconstrained |
| `businessDocumentItemId` | `Long` | not declared | unconstrained |
| `stockUniqueName` | `String` | not declared | unconstrained |
| `variantUniqueName` | `String` | not declared | unconstrained |
| `batchUniqueName` | `String` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `voucherEntryIndex` | `Integer` | not declared | unconstrained |
| `voucherItemId` | `Long` | not declared | unconstrained |

Example:

```json
{
  "uniqueNames": [],
  "documents": [],
  "voucher": "string",
  "uniqueName": "string",
  "items": [],
  "businessDocumentItemId": 0,
  "stockUniqueName": "string",
  "variantUniqueName": "string",
  "batchUniqueName": "string",
  "quantity": 0,
  "voucherEntryIndex": 0,
  "voucherItemId": 0
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `businessDocumentService.convertToVoucher(company, request, principal, httpRequest`

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
| 400 | `NOTIFICATION` | `NotificationException` | NotificationException raised by controller or shared ExceptionHandler |
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

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/convert?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"uniqueNames":[],"documents":[],"voucher":"string","uniqueName":"string","items":[],"businessDocumentItemId":0,"stockUniqueName":"string","variantUniqueName":"string","batchUniqueName":"string","quantity":0,"voucherEntryIndex":0,"voucherItemId":0}'
```

---

### `DELETE /company/:companyUniqueName/business-documents/:voucherUniqueName`

- **Frontend id:** `INVENTORY_VOUCHER_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#deleteInventoryDocument`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#delete
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:198`
- **Deprecated:** No

Delete

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
- Body evidence: `businessDocumentService.delete(company, uniqueName, principal, null`

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
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/business-documents/:voucherUniqueName`

- **Frontend id:** `INVENTORY_VOUCHER_API.GET_SINGLE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#getInventoryVoucherDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#getByUniqueName
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:160`
- **Deprecated:** No

Get By Unique Name

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
- Body evidence: `businessDocumentService.getByUniqueName(company, uniqueName, null`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_UNIQUE_NAME?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/business-documents/:voucherUniqueName/versions`

- **Frontend id:** `INVENTORY_VOUCHER_API.HISTORY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#getVoucherVersions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#getVersions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:323`
- **Deprecated:** No

Get Versions

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `uniqueName` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `10`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `businessDocumentService.getVersions(company, uniqueName, page, count`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_UNIQUE_NAME/versions?page=1&count=10&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/business-documents/:voucherUniqueName/history`

- **Frontend id:** `INVENTORY_VOUCHER_API.LINKED_INVOICE_HISTORY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#getBusinessDocumentLinkedInvoiceHistory`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#getHistory
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:312`
- **Deprecated:** No

Get History

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
- Body evidence: `businessDocumentService.getHistory(company, uniqueName, null`

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
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/SAMPLE_UNIQUE_NAME/history?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /company/:companyUniqueName/business-documents/pending-report`

- **Frontend id:** `INVENTORY_VOUCHER_API.PENDING_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/voucher.service.ts#getPendingBusinessDocumentReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: BusinessDocumentController#pendingReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/businessdocument/BusinessDocumentController.java:137`
- **Deprecated:** No

Pending Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `q` — type: `String`; optional
- `page` — type: `Integer`; optional
- `count` — type: `Integer`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `sort` — type: `String`; optional
- `sortBy` — type: `String`; optional
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `BusinessDocumentListFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `from` | `String` | not declared | unconstrained |
| `to` | `String` | not declared | unconstrained |
| `documentType` | `BusinessDocumentType` | not declared | DC, RC, TRANSFER_DC, TRANSFER_RC, JOBWORK_DC, JOBWORK_RC, MANUFACTURING_ISSUE, MANUFACTURING_RECEIPT, ADJUSTMENT |
| `reportType` | `PendingLinkReportType` | not declared | NOT_INVOICED, PARTIALLY_INVOICED, FULLY_INVOICED, WITHOUT_CHALLAN, PARTIALLY_WITHOUT_CHALLAN |
| `statusCategories` | `Set<DocumentStatusCategory>` | not declared | OPEN, IN_PROGRESS, COMPLETED, CANCELLED |
| `statuses` | `Set<String>` | not declared | unconstrained |
| `invoiceStatuses` | `Set<InvoiceLinkStatus>` | not declared | NOT_INVOICED, PARTIALLY_INVOICED, FULLY_INVOICED, NOT_APPLICABLE, NOT_BILLED, PARTIALLY_BILLED, FULLY_BILLED |
| `accountUniqueNames` | `Set<String>` | not declared | unconstrained |
| `warehouseUniqueNames` | `Set<String>` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `selectAllFields` | `List<String>` | not declared | unconstrained |
| `search` | `String` | not declared | unconstrained |
| `amountMin` | `BigDecimal` | not declared | unconstrained |
| `amountMax` | `BigDecimal` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `amountOperator` | `String` | not declared | unconstrained |
| `hasLinkedInvoice` | `Boolean` | not declared | unconstrained |
| `linkableOnly` | `Boolean` | not declared | unconstrained |
| `linkedVoucherNumber` | `String` | not declared | unconstrained |
| `overdueOnly` | `Boolean` | not declared | unconstrained |
| `challanTypes` | `Set<ChallanType>` | not declared | STOCK_TRANSFER, JOBWORK |
| `sortBy` | `String` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `page` | `Integer` | not declared | unconstrained |
| `count` | `Integer` | not declared | unconstrained |

Example:

```json
{
  "from": "string",
  "to": "string",
  "documentType": "DC",
  "reportType": "NOT_INVOICED",
  "statusCategories": [
    "OPEN"
  ],
  "statuses": [],
  "invoiceStatuses": [
    "NOT_INVOICED"
  ],
  "accountUniqueNames": [],
  "warehouseUniqueNames": [],
  "warehouseUniqueName": "string",
  "branchUniqueName": "string",
  "selectAllFields": [],
  "search": "string",
  "amountMin": 0,
  "amountMax": 0,
  "amount": 0,
  "amountOperator": "string",
  "hasLinkedInvoice": false,
  "linkableOnly": false,
  "linkedVoucherNumber": "string",
  "overdueOnly": false,
  "challanTypes": [
    "STOCK_TRANSFER"
  ],
  "sortBy": "string",
  "sort": "string",
  "page": 0,
  "count": 0
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `businessDocumentService.pendingReport(company, filter`

```json
{
  "status": "success",
  "body": {
    "status": "string",
    "number": "string",
    "date": "string",
    "source": "string",
    "voucherType": "string",
    "challanType": "string",
    "account.name": "string",
    "account.uniqueName": "string",
    "grandTotal": "string",
    "invoiceStatus": "string",
    "linkedInvoiceCount": "string",
    "linkedInvoiceNumber": "string",
    "accountCurrencySymbol": "string",
    "totalAmount": "string",
    "notInvoicedCount": "string"
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
- `body.results[] (uniqueName, number, date, source, voucherType, challanType, account.name, account.uniqueName, grandTotal, invoiceStatus, statusName/status.statusName, linkedInvoiceCount, linkedInvoiceNumber, linkedInvoiceNumbers/linkedVoucherNumbers, accountCurrencySymbol, accountCurrencyCode)`
- `body.totalItems`
- `body.balances (totalCount, totalAmount, notInvoicedCount, notInvoicedAmount)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/business-documents/pending-report?q=&page=1&count=20&from=01-04-2025&to=31-03-2026&sort=desc&sortBy=date&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"from":"string","to":"string","documentType":"DC","reportType":"NOT_INVOICED","statusCategories":["OPEN"],"statuses":[],"invoiceStatuses":["NOT_INVOICED"],"accountUniqueNames":[],"warehouseUniqueNames":[],"warehouseUniqueName":"string","branchUniqueName":"string","selectAllFields":[],"search":"string","amountMin":0,"amountMax":0,"amount":0,"amountOperator":"string","hasLinkedInvoice":false,"linkableOnly":false,"linkedVoucherNumber":"string","overdueOnly":false,"challanTypes":["STOCK_TRANSFER"],"sortBy":"string","sort":"string","page":0,"count":0}'
```

---

### `POST /company/:companyUniqueName/stock/:stockUniqueName/manufacture`

- **Frontend id:** `MANUFACTURING_API.CREATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#CreateManufacturingItem`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingController#manufactureStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ManufacturingController.java:59`
- **Deprecated:** No

Manufacture Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ManufacturingDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `byProducts` | `Set<LinkStock>` | not declared | unconstrained |
| `increaseAssetValue` | `boolean` | not declared | unconstrained |
| `manufacturingQuantity` | `BigDecimal` | not declared | unconstrained |
| `manufacturingUnitCode` | `String` | not declared | unconstrained |
| `manufacturingUnitUniqueName` | `String` | not declared | unconstrained |
| `linkedStocks` | `Set<LinkStock>` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `otherExpenses` | `Set<ManufacturingExpenses>` | not declared | unconstrained |
| `manufacturingMultipleOf` | `BigDecimal` | not declared | unconstrained |
| `manufacturingUniqueName` | `String` | not declared | unconstrained |
| `branchResource` | `BranchResource` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `stockUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `BatchResource` | not declared | unconstrained |
| `batches` | `List<BatchResource>` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |

Example:

```json
{
  "byProducts": [],
  "increaseAssetValue": false,
  "manufacturingQuantity": 0,
  "manufacturingUnitCode": "string",
  "manufacturingUnitUniqueName": "string",
  "linkedStocks": [],
  "date": "string",
  "grandTotal": 0,
  "otherExpenses": [],
  "manufacturingMultipleOf": 0,
  "manufacturingUniqueName": "string",
  "branchResource": "string",
  "warehouseUniqueName": "string",
  "stockUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "batches": [],
  "inventoryType": "string",
  "type": "string"
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `manufacturingService.manufactureStock(principal, company, manufacturingDetails, stockUniqueName, request`

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
- `body as ICommonResponseOfManufactureItem`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"byProducts":[],"increaseAssetValue":false,"manufacturingQuantity":0,"manufacturingUnitCode":"string","manufacturingUnitUniqueName":"string","linkedStocks":[],"date":"string","grandTotal":0,"otherExpenses":[],"manufacturingMultipleOf":0,"manufacturingUniqueName":"string","branchResource":"string","warehouseUniqueName":"string","stockUniqueName":"string","variant":"string","batch":"string","batches":[],"inventoryType":"string","type":"string"}'
```

---

### `POST /company/:companyUniqueName/stock/:stockUniqueName/recipe`

- **Frontend id:** `MANUFACTURING_API.CREATE_RECIPE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#saveRecipe`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingRecipeController#createManufacturingRecipe
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ManufacturingRecipeController.java:59`
- **Deprecated:** No

Create Manufacturing Recipe

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `RecipeResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `date` | `String` | not declared | unconstrained |
| `stock` | `NameUniqueNameImpl` | not declared | unconstrained |
| `manufacturingDetails` | `List<ManufacturingDetails>` | not declared | unconstrained |

Example:

```json
{
  "date": "string",
  "stock": "string",
  "manufacturingDetails": []
}
```

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/recipe?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"date":"string","stock":"string","manufacturingDetails":[]}'
```

---

### `POST /v2/company/:companyUniqueName/stock/:stockUniqueName/manufacture`

- **Frontend id:** `MANUFACTURING_API.CREATE_V2`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#saveManufacturing`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingV2Controller#manufactureStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/ManufacturingV2Controller.java:48`
- **Deprecated:** No

Manufacture Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `RecipeResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `date` | `String` | not declared | unconstrained |
| `stock` | `NameUniqueNameImpl` | not declared | unconstrained |
| `manufacturingDetails` | `List<ManufacturingDetails>` | not declared | unconstrained |

Example:

```json
{
  "date": "string",
  "stock": "string",
  "manufacturingDetails": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `manufacturingService.manufactureStock(manufacturingRecipeResource, stockUniqueName`

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
curl --request POST \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"date":"string","stock":"string","manufacturingDetails":[]}'
```

---

### `DELETE /company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName`

- **Frontend id:** `MANUFACTURING_API.DELETE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#DeleteManufacturingItem`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingController#deleteManufacturingDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ManufacturingController.java:102`
- **Deprecated:** No

Delete Manufacturing Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
- `manufactureUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `"Deleted Successfully."`

```json
{
  "status": "success",
  "body": "Deleted Successfully."
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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture/SAMPLE_manufactureUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/company/:companyUniqueName/manufacture/:manufactureUniqueName`

- **Frontend id:** `MANUFACTURING_API.GET_MANUFACTURING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#getManufacturingDetails; apps/web-giddh/src/app/services/manufacturing.service.ts#deleteManufacturing; apps/web-giddh/src/app/services/manufacturing.service.ts#updateManufacturing`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingV2Controller#getManufacturingDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/ManufacturingV2Controller.java:79`
- **Deprecated:** No

Get Manufacturing Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `manufactureUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `manufacturingService.getManufacturingDetails(manufactureUniqueName`

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
| 409 | `INVALID_OPERATION` | `InvalidOperationException` | InvalidOperationException raised by controller or shared ExceptionHandler |
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
curl --request GET \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/manufacture/SAMPLE_manufactureUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `DELETE /v2/company/:companyUniqueName/manufacture/:manufactureUniqueName`

- **Frontend id:** `MANUFACTURING_API.GET_MANUFACTURING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#getManufacturingDetails; apps/web-giddh/src/app/services/manufacturing.service.ts#deleteManufacturing; apps/web-giddh/src/app/services/manufacturing.service.ts#updateManufacturing`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingV2Controller#deleteManufacturingDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/ManufacturingV2Controller.java:91`
- **Deprecated:** No

Delete Manufacturing Details

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `manufactureUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("success.manufacturing.delete"`

```json
{
  "status": "success",
  "body": "success.manufacturing.delete"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/manufacture/SAMPLE_manufactureUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /v2/company/:companyUniqueName/manufacture/:manufactureUniqueName`

- **Frontend id:** `MANUFACTURING_API.GET_MANUFACTURING`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#getManufacturingDetails; apps/web-giddh/src/app/services/manufacturing.service.ts#deleteManufacturing; apps/web-giddh/src/app/services/manufacturing.service.ts#updateManufacturing`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingV2Controller#updateManufactureStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/ManufacturingV2Controller.java:64`
- **Deprecated:** No

Update Manufacture Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `manufactureUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `RecipeResource` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `date` | `String` | not declared | unconstrained |
| `stock` | `NameUniqueNameImpl` | not declared | unconstrained |
| `manufacturingDetails` | `List<ManufacturingDetails>` | not declared | unconstrained |

Example:

```json
{
  "date": "string",
  "stock": "string",
  "manufacturingDetails": []
}
```

#### Success response

- HTTP status: `201 CREATED`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `manufacturingService.updateManufactureStock(resource, manufactureUniqueName`

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
curl --request PUT \
  --url 'https://api.giddh.com/v2/company/dcrcdiin17887749442630bsy43/manufacture/SAMPLE_manufactureUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"date":"string","stock":"string","manufacturingDetails":[]}'
```

---

### `POST /company/:companyUniqueName/stock/:stockUniqueName/rate-for-stock-v2`

- **Frontend id:** `MANUFACTURING_API.GET_RATE_FOR_STOCK`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#getRateForStockV2`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#getRateForStockV2
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:300`
- **Deprecated:** No

Get Rate For Stock V2

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `LinkStock` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `stockName` | `String` | not declared | unconstrained |
| `stockUniqueName` | `String` | not declared | unconstrained |
| `quantity` | `BigDecimal` | not declared | unconstrained |
| `stockUnitCode` | `String` | not declared | unconstrained |
| `stockUnitUniqueName` | `String` | not declared | unconstrained |
| `rate` | `BigDecimal` | not declared | unconstrained |
| `amount` | `BigDecimal` | not declared | unconstrained |
| `manufacturingRateCategory` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `BatchResource` | not declared | unconstrained |
| `batches` | `List<BatchResource>` | not declared | unconstrained |
| `stockUnits` | `LinkedList<StockUnitResource>` | not declared | unconstrained |
| `finishedStockUniqueName` | `String` | not declared | unconstrained |
| `finishedVariantUniqueName` | `String` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `branchId` | `Long` | not declared | unconstrained |
| `finishedVariantId` | `Long` | not declared | unconstrained |
| `warehouseId` | `Long` | not declared | unconstrained |
| `companyUniqueName` | `String` | not declared | unconstrained |
| `branchUniqueName` | `String` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `userId` | `Long` | not declared | unconstrained |

Example:

```json
{
  "stockName": "string",
  "stockUniqueName": "string",
  "quantity": 0,
  "stockUnitCode": "string",
  "stockUnitUniqueName": "string",
  "rate": 0,
  "amount": 0,
  "manufacturingRateCategory": "string",
  "variant": "string",
  "batch": "string",
  "batches": [],
  "stockUnits": [],
  "finishedStockUniqueName": "string",
  "finishedVariantUniqueName": "string",
  "warehouseUniqueName": "string",
  "branchId": 0,
  "finishedVariantId": 0,
  "warehouseId": 0,
  "companyUniqueName": "string",
  "branchUniqueName": "string",
  "date": "string",
  "userId": 0
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/rate-for-stock-v2?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"stockName":"string","stockUniqueName":"string","quantity":0,"stockUnitCode":"string","stockUnitUniqueName":"string","rate":0,"amount":0,"manufacturingRateCategory":"string","variant":"string","batch":"string","batches":[],"stockUnits":[],"finishedStockUniqueName":"string","finishedVariantUniqueName":"string","warehouseUniqueName":"string","branchId":0,"finishedVariantId":0,"warehouseId":0,"companyUniqueName":"string","branchUniqueName":"string","date":"string","userId":0}'
```

---

### `POST /company/:companyUniqueName/stock/:stockUniqueName/recipe/get?withRate=:withRate`

- **Frontend id:** `MANUFACTURING_API.GET_RECIPE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#getVariantRecipe`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingRecipeController#getManufacturingRecipe
- **Backend source:** `src/main/java/com/giddh/api/controllers/v2/ManufacturingRecipeController.java:86`
- **Deprecated:** No

CASE a). WHEN variantUniqueNames is empty then all the variant of the given stock which has info related to manufacturing will be returned

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
**Query parameters**
- `withRate` — type: `boolean`; optional

#### Controller-backed request payload

Type: `Set<String>` (required).

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/recipe/get?withRate=SAMPLE_withRate&branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"items":[]}'
```

---

### `GET /company/:companyUniqueName/stock-unit/:stockUnitUniqueName/linked-stock-units`

- **Frontend id:** `MANUFACTURING_API.GET_STOCK_UNITS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#loadStockUnits`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockUnitController#getAllMappedUnitOfStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockUnitController.java:118`
- **Deprecated:** No

Get All Mapped Unit Of Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUnitUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `resources`

```json
{
  "status": "success",
  "body": {
    "reference": "resources"
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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock-unit/SAMPLE_stockUnitUniqueName/linked-stock-units?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock/:stockUniqueName/link-with-rates`

- **Frontend id:** `MANUFACTURING_API.GET_STOCK_WITH_RATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#GetStockWithRate`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: StockController#getLinkedStocksWithRates
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/StockController.java:123`
- **Deprecated:** No

Get Linked Stocks With Rates

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `stockService.getAllLinkedStocksWithRates(company, principal, stockUniqueName, request`

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
- `body as ICommonResponseOfManufactureItem`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/link-with-rates?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /company/:companyUniqueName/stock/manufacture-report?`

- **Frontend id:** `MANUFACTURING_API.MF_REPORT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#GetMfReport`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingController#getManufacturingReport
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ManufacturingController.java:118`
- **Deprecated:** No

Get Manufacturing Report

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional
- `warehouseUniqueName` — type: `String`; optional
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `0`
- `sort` — type: `String`; optional; default: `desc`
- `product` — type: `String`; optional
- `productVariant` — type: `String`; optional
- `from` — type: `String`; optional
- `to` — type: `String`; optional
- `searchBy` — type: `String`; optional; default: ``
- `searchOperation` — type: `String`; optional; default: ``
- `searchValue` — type: `String`; optional; default: `0`
- `inventoryType` — type: `String`; optional; default: ``

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
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/manufacture-report?branchUniqueName=aaaa&warehouseUniqueName=SAMPLE_warehouseUniqueName&page=1&count=0&sort=desc&product=SAMPLE_product&productVariant=SAMPLE_productVariant&from=01-04-2025&to=31-03-2026&searchBy=&searchOperation=&searchValue=0&inventoryType=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PUT /company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName`

- **Frontend id:** `MANUFACTURING_API.UPDATE`
- **Frontend evidence:** `apps/web-giddh/src/app/services/manufacturing.service.ts#UpdateManufacturingItem`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: ManufacturingController#updateManufacturingStock
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/ManufacturingController.java:74`
- **Deprecated:** No

Update Manufacturing Stock

#### Inputs

**Path parameters**
- `companyUniqueName` — type: `String`; required
- `stockUniqueName` — type: `String`; required
- `manufactureUniqueName` — type: `String`; required
**Query parameters**
- `branchUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `ManufacturingDetails` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `byProducts` | `Set<LinkStock>` | not declared | unconstrained |
| `increaseAssetValue` | `boolean` | not declared | unconstrained |
| `manufacturingQuantity` | `BigDecimal` | not declared | unconstrained |
| `manufacturingUnitCode` | `String` | not declared | unconstrained |
| `manufacturingUnitUniqueName` | `String` | not declared | unconstrained |
| `linkedStocks` | `Set<LinkStock>` | not declared | unconstrained |
| `date` | `String` | not declared | unconstrained |
| `grandTotal` | `BigDecimal` | not declared | unconstrained |
| `otherExpenses` | `Set<ManufacturingExpenses>` | not declared | unconstrained |
| `manufacturingMultipleOf` | `BigDecimal` | not declared | unconstrained |
| `manufacturingUniqueName` | `String` | not declared | unconstrained |
| `branchResource` | `BranchResource` | not declared | unconstrained |
| `warehouseUniqueName` | `String` | not declared | unconstrained |
| `stockUniqueName` | `String` | not declared | unconstrained |
| `variant` | `NameUniqueNameImpl` | not declared | unconstrained |
| `batch` | `BatchResource` | not declared | unconstrained |
| `batches` | `List<BatchResource>` | not declared | unconstrained |
| `inventoryType` | `String` | not declared | unconstrained |
| `type` | `String` | not declared | unconstrained |

Example:

```json
{
  "byProducts": [],
  "increaseAssetValue": false,
  "manufacturingQuantity": 0,
  "manufacturingUnitCode": "string",
  "manufacturingUnitUniqueName": "string",
  "linkedStocks": [],
  "date": "string",
  "grandTotal": 0,
  "otherExpenses": [],
  "manufacturingMultipleOf": 0,
  "manufacturingUniqueName": "string",
  "branchResource": "string",
  "warehouseUniqueName": "string",
  "stockUniqueName": "string",
  "variant": "string",
  "batch": "string",
  "batches": [],
  "inventoryType": "string",
  "type": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `manufacturingService.updateManufacturedStock(principal, company, manufacturingDetails, stockUniqueName, manufactureUniqueName, request,branch`

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
- `body as ICommonResponseOfManufactureItem`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request PUT \
  --url 'https://api.giddh.com/company/dcrcdiin17887749442630bsy43/stock/SAMPLE_STOCK/manufacture/SAMPLE_manufactureUniqueName?branchUniqueName=aaaa' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"byProducts":[],"increaseAssetValue":false,"manufacturingQuantity":0,"manufacturingUnitCode":"string","manufacturingUnitUniqueName":"string","linkedStocks":[],"date":"string","grandTotal":0,"otherExpenses":[],"manufacturingMultipleOf":0,"manufacturingUniqueName":"string","branchResource":"string","warehouseUniqueName":"string","stockUniqueName":"string","variant":"string","batch":"string","batches":[],"inventoryType":"string","type":"string"}'
```

