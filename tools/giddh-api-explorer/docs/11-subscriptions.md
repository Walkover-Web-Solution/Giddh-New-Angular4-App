# Subscriptions

APIs for this domain. Base: `https://api.giddh.com/`. Company: `dcrcdiin17887749442630bsy43`. Branch: `aaaa`.

Auth header: `Auth-Key: YOUR_AUTH_KEY`.

Endpoints in this file: **38**

---

### `SUBSCRIPTION_V2_API.ACTIVATE_PLAN`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/activate?upgrade=true&billingRequestId=:billingRequestId`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#activatePlan`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/activate?upgrade=true&billingRequestId=SAMPLE_billingRequestId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.ACTIVATE_PRE_PAID`

- **Method:** `POST`
- **Path template:** `v2/subscription/:subscriptionId/activate-prepaid`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#activateAdvancePayment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `activateAdvancePayment`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/activate-prepaid?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.BUY_PLAN`

- **Method:** `POST`
- **Path template:** `v2/subscription/buy-plan`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#buyPlan`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `buyPlan`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/buy-plan?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.CALCULATION_PLAN_AMOUNT`

- **Method:** `POST`
- **Path template:** `v2/subscription/get-amount`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getPlanAmountCalculation`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `getPlanAmountCalculation`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/get-amount?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.CANCEL_SUBSCRIPTION_BY_ID`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/cancel`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#cancelSubscriptionById`
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

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/cancel?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.CREATE_PRE_PAID`

- **Method:** `POST`
- **Path template:** `v2/subscription/:subscriptionId/create-pre-paid`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#createAdvancePayment`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `createAdvancePayment` argument: `model.request`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/create-pre-paid?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.CREATE_SUBSCRIPTION`

- **Method:** `POST`
- **Path template:** `v2/subscription`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#createSubscription`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `createSubscription`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.DELETE_PAYMENT_METHOD`

- **Method:** `DELETE`
- **Path template:** `v2/subscription/payment-method/:paymentUniqueName`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#deletePaymentMethod`
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

**curl**

```bash
curl -sS -X DELETE \
  'https://api.giddh.com/v2/subscription/payment-method/SAMPLE_paymentUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.GENERATE_ORDER_BY_SUBSCRIPTION_ID`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/generate-order?promocode=:promocode`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#generateOrderBySubscriptionId`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/generate-order?promocode=SAMPLE_promocode&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.GET_ALL_PLANS`

- **Method:** `GET`
- **Path template:** `v2/subscription/plans/all?regionCode=:regionCode`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getAllPlans`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/plans/all?regionCode=SAMPLE_regionCode&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.GET_ALL_SUBSCRIPTIONS`

- **Method:** `POST`
- **Path template:** `v2/subscription/list?page=:page&count=:count&fromMoveCompany=:fromMoveCompany`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getAllSubscriptions`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `reqObj` (see service `getAllSubscriptions`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/list?page=1&count=50&fromMoveCompany=SAMPLE_fromMoveCompany&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.GET_BILLING_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/subscription/billing-account/get?billingAccountUnqiueName=:billingAccountUnqiueName`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getBillingDetails`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/billing-account/get?billingAccountUnqiueName=SAMPLE_billingAccountUnqiueName&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.GET_CHANGE_PLAN_DETAILS`

- **Method:** `POST`
- **Path template:** `v2/subscription/change-plan`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getChangePlanDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `getChangePlanDetails`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/change-plan?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.GET_COMPANIES_BY_SUBSCRIPTION_ID`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/company-list?page=:page&count=:count&q=:q`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getCompaniesBySubscriptionId`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/company-list?page=1&count=50&q=&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.GET_COMPANIES_LIST_BY_SUBSCRIPTION_ID`

- **Method:** `POST`
- **Path template:** `v2/subscription/company-list/:subscriptionId?sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:query`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getCompaniesListBySubscriptionID`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `getCompaniesListBySubscriptionID`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/company-list/SAMPLE_subscriptionId?sort=&sortBy=&page=1&count=50&q=SAMPLE_query&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.GET_COUNTRY_LIST`

- **Method:** `GET`
- **Path template:** `country/country-list`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getCountryList`
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
curl -sS -X GET \
  'https://api.giddh.com/country/country-list?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.GET_PAYMENT_METHODS`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/payment-methods`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getPaymentProviderListBySubscriptionID`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/payment-methods?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.PAYPAL_CAPTURE_PLAN`

- **Method:** `POST`
- **Path template:** `subscription/paypal/order/:orderId/capture?subscriptionId=:subscriptionId`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#paypalCaptureOrder`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `paypalCaptureOrder` argument: `''`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/subscription/paypal/order/SAMPLE_orderId/capture?subscriptionId=SAMPLE_subscriptionId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.SAVE_PAYMENT_METHOD`

- **Method:** `POST`
- **Path template:** `v2/subscription/add-payment-method`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#savePaymentProviderBySubscriptionID`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `savePaymentProviderBySubscriptionID`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/add-payment-method?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.SAVE_RAZORPAY_TOKEN`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/payment/:paymentId/save-razorpay-token?orderId=:orderId`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#saveRazorpayToken`
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
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/payment/SAMPLE_paymentId/save-razorpay-token?orderId=SAMPLE_orderId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.SAVE_STRIPE_PAYMENT`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/payment/:paymentIntentId/save-stripe-payment`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#saveStripePayment`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/payment/SAMPLE_paymentIntentId/save-stripe-payment?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.SET_ARCHIVE_UNARCHIVE_COMPANY`

- **Method:** `PATCH`
- **Path template:** `company/:companyUniqueName`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#setArchiveUnarchiveCompany`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `setArchiveUnarchiveCompany` argument: `model?.status`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/company/dcrcdiin17887749442630bsy43?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.SET_DEFAULT_PAYMENT_METHOD`

- **Method:** `PATCH`
- **Path template:** `v2/subscription/payment-method/:paymentUniqueName`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#setDetaultPaymentMethod`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `setDetaultPaymentMethod` argument: `''`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/v2/subscription/payment-method/SAMPLE_paymentUniqueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.SUBSCRIPTION_BY_ID`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#viewSubscriptionById`
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
curl -sS -X GET \
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTION_V2_API.TRANSFER`

- **Method:** `POST`
- **Path template:** `v2/subscription/transfer/ownership?subscriptionId=:subscriptionId`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#transferSubscription`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `transferSubscription`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/transfer/ownership?subscriptionId=SAMPLE_subscriptionId&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.UPDATE_BILLING_DETAILS`

- **Method:** `PATCH`
- **Path template:** `v2/subscription/billing-account/:billingAccountUnqiueName`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#updateBillingDetails`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateBillingDetails`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X PATCH \
  'https://api.giddh.com/v2/subscription/billing-account/SAMPLE_billingAccountUnqiueName?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.UPDATE_PLAN`

- **Method:** `POST`
- **Path template:** `v2/subscription/update`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#updatePlan`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `request` (see service `updatePlan`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/update?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.UPDATE_SUBSCRIPTION`

- **Method:** `POST`
- **Path template:** `v2/subscription?company=:company`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#updateSubscription`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
Request body: `model` (see service `updateSubscription`)
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription?company=dcrcdiin17887749442630bsy43&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTION_V2_API.VERIFY_OWNERSHIP`

- **Method:** `POST`
- **Path template:** `v2/subscription/verify/ownership?requestId=:requestId&reject=:reject`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#verifyOwnership`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
See service method `verifyOwnership` argument: `model?.reason`
```

**Response fields used**

- `status`
- `message`
- `body`
- `request (echoed by service)`

**curl**

```bash
curl -sS -X POST \
  'https://api.giddh.com/v2/subscription/verify/ownership?requestId=SAMPLE_requestId&reject=SAMPLE_reject&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES`

- **Method:** `GET`
- **Path template:** `users/subscriptions`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#getSubScribedCompanies`
- **Query (auto):** `branchUniqueName=aaaa` (plus `lang`, cache-bust `t`/`z` at runtime)

**Expected payload**

```
none
```

**Response fields used**

- `status`
- `message`
- `body`
- `body as SubscriptionsUser`
- `request (echoed by service)`
- `queryString (echoed by service)`

**curl**

```bash
curl -sS -X GET \
  'https://api.giddh.com/users/subscriptions?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES_LIST`

- **Method:** `GET`
- **Path template:** `subscriptions/:subscriptionId/companies`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#GetSubscribedCompaniesList`
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
curl -sS -X GET \
  'https://api.giddh.com/subscriptions/SAMPLE_subscriptionId/companies?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTIONS_API.SUBSCRIBED_COMPANY_TRANSACTIONS`

- **Method:** `GET`
- **Path template:** `subscriptions/company/:company/transactions?from=:from&to=:to&interval=:interval`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#if`
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
curl -sS -X GET \
  'https://api.giddh.com/subscriptions/company/dcrcdiin17887749442630bsy43/transactions?from=01-04-2025&to=31-03-2026&interval=SAMPLE_interval&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `SUBSCRIPTIONS_API.SUBSCRIBED_USER_TRANSACTIONS`

- **Method:** `GET`
- **Path template:** `subscriptions/:subscriptionId/all-transactions?from=:from&to=:to&interval=:interval`
- **Source:** `subscriptions.api.ts` · service: `subscriptions.service.ts#if`
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
curl -sS -X GET \
  'https://api.giddh.com/subscriptions/SAMPLE_subscriptionId/all-transactions?from=01-04-2025&to=31-03-2026&interval=SAMPLE_interval&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `WALLET_API.ADD_WALLET_AMOUNT`

- **Method:** `POST`
- **Path template:** `v2/subscription/add-wallet-amount`
- **Source:** `wallet.api.ts`
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
  'https://api.giddh.com/v2/subscription/add-wallet-amount?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

### `WALLET_API.CAPTURE_WALLET_PAYMENT`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/capture-wallet-payment`
- **Source:** `wallet.api.ts`
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
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/capture-wallet-payment?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `WALLET_API.GET_SUBSCRIPTION_DATA`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId`
- **Source:** `wallet.api.ts`
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
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `WALLET_API.GET_WALLET_DETAILS`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/wallet`
- **Source:** `wallet.api.ts`
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
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/wallet?branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

---

### `WALLET_API.GET_WALLET_LOGS`

- **Method:** `GET`
- **Path template:** `v2/subscription/:subscriptionId/wallet-logs?page=:page&count=:count`
- **Source:** `wallet.api.ts`
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
  'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/wallet-logs?page=1&count=50&branchUniqueName=aaaa' \
  -H 'Auth-Key: YOUR_AUTH_KEY' \
  -H 'Accept: application/json'
```

