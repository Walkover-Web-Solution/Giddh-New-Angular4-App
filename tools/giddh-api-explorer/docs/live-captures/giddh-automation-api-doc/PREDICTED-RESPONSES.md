# Predicted success and failure responses

Generated 2026-10-23 by `_predict_fe_responses.py`.

Predicted JSON is read from controller handlers and one level of service calls.
It is not a live capture. Live `successExample` values are left in place.
Shared auth failures (`INVALID_AUTH_KEY`, `INVALID_SESSION`, `INVALID_SESSION_ID`) are not copied onto every route.
At most 12 predicted errors are kept per API (controller throws, then the returned service call, then other calls).

## Counts

| | |
| --- | ---: |
| Frontend-used records | 655 |
| With prepared success | 655 |
| With at least one predicted error | 596 |
| No concrete throw site | 59 |
| Source file missing | 0 |
| Live error captures compared | 253 |
| Code + message agreed | 57 |
| Same code, different message | 34 (34 listed) |
| Live error code not in the predicted set | 162 |

A live error agrees when the code matches and the message matches, including `%s` / `{0}` templates.
Agreements set `liveVerified: true` on that predicted error only.
Success skeletons stay `liveVerified: false`.

## Message mismatches

| Capture | API | Code | Live message | Predicted message |
| --- | --- | --- | --- | --- |
| `1023-email-conditions` | `GET /company/{companyUniqueName}/communication/condition-suggestion` | `INVALID_REQUEST` | live `'invoice' is not a valid trigger module, Allowed values are (LEDGER_WITH_CLOSING` | predicted `Please provide either triggerModule or module` |
| `1043-email-cond-LEDGER` | `GET /company/{companyUniqueName}/communication/condition-suggestion` | `INVALID_REQUEST` | live `'LEDGER_WITH_CLOSING' is not a valid trigger module, Allowed values are (LEDGER_` | predicted `Please provide either triggerModule or module` |
| `1045-gocardless-US` | `GET /company/{companyUniqueName}/gocardless/institutions` | `INVALID_REQUEST` | live `Invalid country choice.'US' is not a valid choice.` | predicted `Invalid country choice.'%s' is not a valid choice.` |
| `1101-delete-company-accounts` | `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName:.+}` | `ACCOUNT_NOT_FOUND` | live `We apologize we cannot honor your request, Please make sure account with uniqueN` | predicted `We apologize we cannot honor your request, Please make sure account with uniqueN` |
| `1127-put-company-accounts-vouchers` | `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | `INVALID_REQUEST` | live `Request method not supported.` | predicted `EntryUniqueNames cannot be null/blank` |
| `1144-post-v2-subscription-add-payment-method` | `POST /v2/subscription/add-payment-method` | `INVALID_REQUEST` | live `Please provide subscription id.` | predicted `Please provide payment provider.` |
| `1155-post-v2-subscription-verify-ownership` | `POST /v2/subscription/verify/ownership` | `INVALID_REQUEST` | live `This invitation has expired and cannot be used anymore.` | predicted `Transfer request is already verified with request id {0}.` |
| `1166-delete-company-stock-group-stock` | `DELETE /company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | `INVALID_REQUEST` | live `Stock apidoc-widget doesnot belong to stockGroup apidoc-products` | predicted `Stock %s doesnot belong to stockGroup %s` |
| `1167-get-company-stock-group-stock` | `GET /company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | `INVALID_REQUEST` | live `Stock apidoc-widget doesnot belong to stockGroup apidoc-products` | predicted `Stock %s doesnot belong to stockGroup %s` |
| `1168-put-company-stock-group-stock` | `PUT /company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | `INVALID_REQUEST` | live `Stock apidoc-widget doesnot belong to stockGroup apidoc-products` | predicted `Stock %s doesnot belong to stockGroup %s` |
| `1171-delete-v2-company-stock-group-stock` | `DELETE /v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | `INVALID_PARAMETER` | live `Stock 'apidoc-widget' doesnot belong to stock group 'apidoc-products'.` | predicted `Stock '%s' doesnot belong to stock group '%s'.` |
| `1172-put-v2-company-stock-group-stock` | `PUT /v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | `INVALID_REQUEST` | live `Stock apidoc-widget doesnot belong to stockGroup apidoc-products` | predicted `Stock %s doesnot belong to stockGroup %s` |
| `1194-delete-company-communication-platform` | `DELETE /company/{companyUniqueName}/communication/platform/{uniqueName}` | `INVALID_REQUEST` | live `No platform found with unique name 'apidoc-widget'.` | predicted `No platform found with unique name '%s'.` |
| `1245-put-company-stock-move` | `PUT /company/{companyUniqueName}/stock/{stockUniqueName:.+}/move` | `STOCKGROUP_NOT_FOUND` | live `Stock Group not found with uniqueName apidoc-custom-assets` | predicted `Stock Group not found with uniqueName %s` |
| `1259-post-company-imports-document-upload` | `POST /company/{companyUniqueName}/imports/document/upload` | `INVALID_REQUEST` | live `One or more parameters provided are incorrect: type.` | predicted `Unsupported OCR type: %s` |
| `1260-post-company-imports-process` | `POST /company/{companyUniqueName}/imports/process` | `INVALID_REQUEST` | live `No request found with given requestId: null.` | predicted `Please provide mappings.` |
| `1262-post-company-imports-reconciliation-process` | `POST /company/{companyUniqueName}/imports/reconciliation/process` | `INVALID_REQUEST` | live `No request found with given requestId: null.` | predicted `No request found with given requestId: %s.` |
| `1266-post-company-imports-v2-upload` | `POST /company/{companyUniqueName}/imports/v2/upload` | `INVALID_REQUEST` | live `One or more parameters provided are incorrect: type.` | predicted `Voucher type provided is not supported. Supported voucher types are: %s.` |
| `1271-post-company-uk-vat-obligations` | `POST /company/{companyUniqueName}/uk/vat-obligations` | `INVALID_PARAMETER` | live `Provided tax number 'APIDOCGST18' not found.` | predicted `Please provide status as 'O' or provide 'from' and/or 'to' date.` |
| `1280-put-company-address` | `PUT /company/{companyUniqueName}/address/{addressUniqueName:.+}` | `INVALID_REQUEST` | live `At least one default address is required.` | predicted `State code "{0}" is invalid.` |
| `1286-put-company-auth-update` | `PUT /company/{companyUniqueName}/auth/{authUniqueName}/update` | `INVALID_REQUEST` | live `Provided auth key is not valid.` | predicted `Auth key by name '%s' already exists.` |
| `1298-post-company-discount-assign` | `POST /company/{companyUniqueName}/discount/assign` | `INVALID_REQUEST` | live `accountUniqueName cannot be null/blank.` | predicted `Discount can be assigned only to sundrydebtors/sundrycreditors account.` |
| `1302-patch-company-domain` | `PATCH /company/{companyUniqueName}/domain/{domainUniqueName}` | `INVALID_REQUEST` | live `Domain not found with uniqueName placeholder.` | predicted `Please provide valid operation - delete/set-primary` |
| `1316-post-company-gocardless-requisitions` | `POST /company/{companyUniqueName}/gocardless/requisitions/{reference}` | `INVALID_REQUEST` | live `Client reference:'placeholder' doesn't exists.` | predicted `Client reference:'%s' doesn't exists.` |
| `1318-delete-company-gst-setting` | `DELETE /company/{companyUniqueName}/gst-setting/{uniqueName}` | `NOT_FOUND.` | live `No data found for the uniqueName 'apidoc-widget'.` | predicted `No data found for the uniqueName '%s'.` |
| `1320-delete-company-inventory-adjustment` | `DELETE /company/{companyUniqueName}/inventory-adjustment/{refNo}` | `INVALID_REQUEST` | live `Inventory adjustment with reference no 'placeholder' not found.` | predicted `Inventory adjustment with reference no '%s' not found.` |
| `139-templates-sales` | `GET /v2/company/{companyUniqueName}/templates` | `INVALID_REQUEST` | live `Invalid template type provided.` | predicted `No template found for this company.` |
| `1407-delete-v2-company-templates` | `DELETE /v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` | `INVALID_REQUEST` | live `No template found with uniqueName gst_template_a` | predicted `No template found with uniqueName %s` |
| `1412-post-v2-login-with-password` | `POST /v2/login-with-password` | `INVALID_REQUEST` | live `Email or mobile number doesn't exist. Please create your account.` | predicted `Email and password not provided.` |
| `1420-patch-v4-company-vouchers` | `PATCH /v4/company/{companyUniqueName}/vouchers` | `INVALID_REQUEST` | live `Cannot search voucher with the given details. Please provide unique name to sear` | predicted `Operation cannot be completed as branch is archived.` |
| `1607-website-login-password-bad` | `POST /v2/login-with-password` | `INVALID_REQUEST` | live `Your max limit for using this API has exceeded.` | predicted `Email and password not provided.` |
| `1608-website-login-password-empty` | `POST /v2/login-with-password` | `INVALID_REQUEST` | live `Email or mobile number doesn't exist. Please create your account.` | predicted `Email and password not provided.` |
| `294-invoice-templates` | `GET /v2/company/{companyUniqueName}/templates` | `INVALID_REQUEST` | live `Invalid template type provided.` | predicted `No template found for this company.` |
| `941-gocardless-institutions` | `GET /company/{companyUniqueName}/gocardless/institutions` | `INVALID_REQUEST` | live `Invalid country choice.'IN' is not a valid choice.` | predicted `Invalid country choice.'%s' is not a valid choice.` |

## No throw site found

59 frontend-used APIs had no resolvable `throw new` message in the handler or one service call.

- `POST /v2/subscription/transfer/ownership`
- `POST /v2/subscription/list`
- `GET /v2/subscription/{subscriptionId}/cancel`
- `GET /v2/subscription/{subscriptionId}/payment-methods`
- `PATCH /v2/subscription/payment-method/{paymentUniqueName}`
- `POST /v2/subscription/charge/{subscriptionId}`
- `GET /v2/subscription/{subscriptionId}`
- `POST /v2/subscription/company-list/{subscriptionId}`
- `GET /v2/subscription/{subscriptionId}/generate-order`
- `POST /v2/subscription/buy-plan`
- `POST /v2/subscription/update`
- `GET /v2/subscription/{subscriptionId}/country-list`
- `GET /v2/subscription/{subscriptionId}/company-list`
- `GET /v2/subscription/{subscriptionId}/wallet`
- `GET /v2/subscription/{subscriptionId}/wallet-logs`
- `GET /v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance`
- `POST /v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance`
- `PUT /v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts/{accountUniqueName:.+}`
- `GET /currency`
- `POST /exception/invalid-json`
- `POST /signup-with-email`
- `POST /v2/signup`
- `POST /v2/auth-login`
- `GET /scope-v2`
- `GET /stock-units`
- `GET /time`
- `GET /gst-info`
- `POST /send-data`
- `POST /subscription/paypal/order/{orderId}/capture`
- `GET /company/{companyUniqueName}/purchase-order/preview`
- `GET /subscription/generateOrder`
- `GET /ui/forms`
- `GET /ui/calling-code`
- `GET /ui/taxes`
- `GET /ui/graph-types`
- `GET /ui/party-types`
- `GET /ui/bank/integration/form`
- `GET /ui/auditlogs-form`
- `GET /users/{userUniqueName}/v2/companies`
- `DELETE /users/{userUniqueName}/destroy-session`
- `PUT /users/{uniqueKey}/forgot-password`
- `GET /users/subscriptions`
- `POST /users/send-new-user-info`
- `GET /country`
- `GET /country/{countryCode}`
- `GET /country/country-list`
- `GET /country/cities`
- `GET /company/{companyUniqueName}/brief-accounts`
- `GET /company/{companyUniqueName}/cmdk`
- `GET /company/{companyUniqueName}/groups/{groupUniqueName}/masters`
- `GET /company/{companyUniqueName}/inventory/{stockGroupUniqueName}/masters`
- `GET /company/{companyUniqueName}/top-inventory-groups`
- `GET /company/{companyUniqueName}/stock-groups-with-stocks`
- `GET /company/{companyUniqueName}/top-shared-groups`
- `GET /company/{companyUniqueName}/v3/account-search`
- `GET /company/{companyUniqueName}/group-search`
- `GET /company/{companyUniqueName}/account-search-2`
- `POST /company/{companyUniqueName}/account-search-predicted`
- `POST /company/{companyUniqueName}/inventory-search`

