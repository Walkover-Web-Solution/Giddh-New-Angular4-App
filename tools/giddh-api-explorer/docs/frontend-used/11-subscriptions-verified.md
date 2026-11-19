# Backend-Verified Frontend APIs: 11-subscriptions.md

Only exact HTTP method + normalized controller-path matches are included.

### `GET /v2/subscription/:subscriptionId/activate?upgrade=true&billingRequestId=:billingRequestId`

- **Frontend id:** `SUBSCRIPTION_V2_API.ACTIVATE_PLAN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#activatePlan`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#activateSubscriptionAfterPayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:229`
- **Deprecated:** No

Activate Subscription After Payment

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
**Query parameters**
- `upgrade` — type: `boolean`; required
- `billingRequestId` — type: `String`; required

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
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/activate?upgrade=SAMPLE_upgrade&billingRequestId=SAMPLE_billingRequestId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/:subscriptionId/activate-prepaid`

- **Frontend id:** `SUBSCRIPTION_V2_API.ACTIVATE_PRE_PAID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#activateAdvancePayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#activatePrepaidSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:482`
- **Deprecated:** No

Activate Prepaid Subscription

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/activate-prepaid' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `POST /v2/subscription/buy-plan`

- **Frontend id:** `SUBSCRIPTION_V2_API.BUY_PLAN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#buyPlan`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#buyPlan
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:326`
- **Deprecated:** No

Buy Plan

#### Inputs



#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/buy-plan' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `POST /v2/subscription/get-amount`

- **Frontend id:** `SUBSCRIPTION_V2_API.CALCULATION_PLAN_AMOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getPlanAmountCalculation`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getSubscriptionAmount
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:395`
- **Deprecated:** No

Get Subscription Amount

#### Inputs



#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/get-amount' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `GET /v2/subscription/:subscriptionId/cancel`

- **Frontend id:** `SUBSCRIPTION_V2_API.CANCEL_SUBSCRIPTION_BY_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#cancelSubscriptionById`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#cancelSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:164`
- **Deprecated:** No

Cancel Subscription

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

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
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/cancel' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/:subscriptionId/create-pre-paid`

- **Frontend id:** `SUBSCRIPTION_V2_API.CREATE_PRE_PAID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#createAdvancePayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#createPrePaidOfSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:473`
- **Deprecated:** No

Create Pre Paid Of Subscription

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
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
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/create-pre-paid' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `POST /v2/subscription`

- **Frontend id:** `SUBSCRIPTION_V2_API.CREATE_SUBSCRIPTION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#createSubscription`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#createSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:142`
- **Deprecated:** No

Also it add plan info to subscription if user selects plan without selecting payment method and later

#### Inputs

**Query parameters**
- `companyUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 400 | `STRIPE` | `StripeException` | StripeException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription?companyUniqueName=dcrcdiin17887749442630bsy43' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `DELETE /v2/subscription/payment-method/:paymentUniqueName`

- **Frontend id:** `SUBSCRIPTION_V2_API.DELETE_PAYMENT_METHOD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#deletePaymentMethod`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#deleteSubscriptionPaymentInfo
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:204`
- **Deprecated:** No

Delete Subscription Payment Info

#### Inputs

**Path parameters**
- `paymentUniqueName` — type: `String`; required

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
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request DELETE \
  --url 'https://api.giddh.com/v2/subscription/payment-method/SAMPLE_paymentUniqueName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId/generate-order?promocode=:promocode`

- **Frontend id:** `SUBSCRIPTION_V2_API.GENERATE_ORDER_BY_SUBSCRIPTION_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#generateOrderBySubscriptionId`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#generateRazorpayOrder
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:295`
- **Deprecated:** No

Generate Razorpay Order

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
**Query parameters**
- `promocode` — type: `String`; optional

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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/generate-order?promocode=SAMPLE_promocode' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/plans/all?regionCode=:regionCode`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_ALL_PLANS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getAllPlans`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getAllPlans
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:182`
- **Deprecated:** No

Get All Plans

#### Inputs

**Query parameters**
- `regionCode` — type: `String`; optional; default: `IND`

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
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/plans/all?regionCode=IND' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/list?page=:page&count=:count&fromMoveCompany=:fromMoveCompany`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_ALL_SUBSCRIPTIONS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getAllSubscriptions`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getSubscriptions
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:120`
- **Deprecated:** No

Get Subscriptions

#### Inputs

**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`
- `fromMoveCompany` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `Map<String, String>` (optional).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
{}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscriptions`

```json
{
  "status": "success",
  "body": {
    "reference": "subscriptions"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/list?page=1&count=50&fromMoveCompany=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

---

### `GET /v2/subscription/billing-account/get?billingAccountUnqiueName=:billingAccountUnqiueName`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_BILLING_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getBillingDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getSubscriptionBillingAccountByUser
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:103`
- **Deprecated:** No

Get Subscription Billing Account By User

#### Inputs

**Query parameters**
- `billingAccountUniqueName` — type: `String`; optional

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/billing-account/get?billingAccountUniqueName=SAMPLE_billingAccountUniqueName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/change-plan`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_CHANGE_PLAN_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getChangePlanDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#changePlanOfSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:316`
- **Deprecated:** No

Change Plan Of Subscription

#### Inputs



#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/change-plan' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `GET /v2/subscription/:subscriptionId/company-list?page=:page&count=:count&q=:q`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_COMPANIES_BY_SUBSCRIPTION_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getCompaniesBySubscriptionId`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getCompanyListBySubscriptionRegion
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:388`
- **Deprecated:** No

Get Company List By Subscription Region

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `20`
- `q` — type: `String`; optional; default: ``

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscriptionServiceV2.getCompanyListBySubscriptionRegion(subscriptionId, principal, page, count, q.trim(`

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
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/company-list?page=1&count=20&q=' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/company-list/:subscriptionId?sort=:sort&sortBy=:sortBy&page=:page&count=:count&q=:query`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_COMPANIES_LIST_BY_SUBSCRIPTION_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getCompaniesListBySubscriptionID`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getCompaniesBySubscriptionId
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:244`
- **Deprecated:** No

Get Companies By Subscription Id

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
**Query parameters**
- `sortBy` — type: `String`; optional; default: `NAME`
- `sort` — type: `String`; optional; default: `asc`
- `q` — type: `String`; optional; default: ``
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`

#### Controller-backed request payload

Type: `CompanyFilter` (optional).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `invoiceCount` | `BigInteger` | not declared | unconstrained |
| `billCount` | `BigInteger` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionStatus` | `String` | not declared | unconstrained |
| `lastInvoiceCreatedFrom` | `String` | not declared | unconstrained |
| `lastInvoiceCreatedTo` | `String` | not declared | unconstrained |
| `lastBillCreatedFrom` | `String` | not declared | unconstrained |
| `lastBillCreatedTo` | `String` | not declared | unconstrained |
| `lastLoginDateFrom` | `String` | not declared | unconstrained |
| `lastLoginDateTo` | `String` | not declared | unconstrained |
| `subId` | `String` | not declared | unconstrained |
| `page` | `int` | not declared | unconstrained |
| `count` | `int` | not declared | unconstrained |
| `sort` | `String` | not declared | unconstrained |
| `sortBy` | `String` | not declared | unconstrained |
| `q` | `String` | not declared | unconstrained |
| `region` | `String` | not declared | unconstrained |
| `giddhWhiteLabel` | `GiddhWhiteLabel` | not declared | unconstrained |

Example:

```json
{
  "invoiceCount": 0,
  "billCount": 0,
  "status": "string",
  "subscriptionStatus": "string",
  "lastInvoiceCreatedFrom": "string",
  "lastInvoiceCreatedTo": "string",
  "lastBillCreatedFrom": "string",
  "lastBillCreatedTo": "string",
  "lastLoginDateFrom": "string",
  "lastLoginDateTo": "string",
  "subId": "string",
  "page": 0,
  "count": 0,
  "sort": "string",
  "sortBy": "string",
  "q": "string",
  "region": "string",
  "giddhWhiteLabel": "string"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/company-list/SAMPLE_subscriptionId?sortBy=NAME&sort=asc&q=&page=1&count=50' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"invoiceCount":0,"billCount":0,"status":"string","subscriptionStatus":"string","lastInvoiceCreatedFrom":"string","lastInvoiceCreatedTo":"string","lastBillCreatedFrom":"string","lastBillCreatedTo":"string","lastLoginDateFrom":"string","lastLoginDateTo":"string","subId":"string","page":0,"count":0,"sort":"string","sortBy":"string","q":"string","region":"string","giddhWhiteLabel":"string"}'
```

---

### `GET /country/country-list`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_COUNTRY_LIST`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getCountryList`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: CountryAndStateController#getCountryList
- **Backend source:** `src/main/java/com/giddh/api/controllers/v4/CountryAndStateController.java:82`
- **Deprecated:** No

Get Country List

#### Inputs

No request inputs.

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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/country/country-list' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId/payment-methods`

- **Frontend id:** `SUBSCRIPTION_V2_API.GET_PAYMENT_METHODS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getPaymentProviderListBySubscriptionID`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getAllSubscriptionPaymentMethods
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:189`
- **Deprecated:** No

Get All Subscription Payment Methods

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/payment-methods' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /subscription/paypal/order/:orderId/capture?subscriptionId=:subscriptionId`

- **Frontend id:** `SUBSCRIPTION_V2_API.PAYPAL_CAPTURE_PLAN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#paypalCaptureOrder`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: PaypalSubscriptionController#captureOrder
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/PaypalSubscriptionController.java:39`
- **Deprecated:** No

Capture Order

#### Inputs

**Path parameters**
- `orderId` — type: `String`; required
**Query parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

None.

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
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/subscription/paypal/order/SAMPLE_orderId/capture?subscriptionId=SAMPLE_subscriptionId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/add-payment-method`

- **Frontend id:** `SUBSCRIPTION_V2_API.SAVE_PAYMENT_METHOD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#savePaymentProviderBySubscriptionID`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#addPaymentMethod
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:381`
- **Deprecated:** No

Add Payment Method

#### Inputs



#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/add-payment-method' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `GET /v2/subscription/:subscriptionId/payment/:paymentId/save-razorpay-token?orderId=:orderId`

- **Frontend id:** `SUBSCRIPTION_V2_API.SAVE_RAZORPAY_TOKEN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#saveRazorpayToken`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#saveRazorpayToken
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:279`
- **Deprecated:** No

Save Razorpay Token

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
- `paymentId` — type: `String`; required
**Query parameters**
- `orderId` — type: `String`; required

#### Controller-backed request payload

None.

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
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

Example error:

```json
{
  "status": "error",
  "code": "RAZORPAY",
  "message": "Razorpay"
}
```

**Frontend-consumed response evidence**

- `status`
- `message`
- `body`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/payment/SAMPLE_paymentId/save-razorpay-token?orderId=SAMPLE_orderId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId/payment/:paymentIntentId/save-stripe-payment`

- **Frontend id:** `SUBSCRIPTION_V2_API.SAVE_STRIPE_PAYMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#saveStripePayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#saveStripePaymentMethod
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:287`
- **Deprecated:** No

Save Stripe Payment Method

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
- `paymentIntentId` — type: `String`; required

#### Controller-backed request payload

None.

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
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/payment/SAMPLE_paymentIntentId/save-stripe-payment' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `PATCH /company/:companyUniqueName`

- **Frontend id:** `SUBSCRIPTION_V2_API.SET_ARCHIVE_UNARCHIVE_COMPANY`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#setArchiveUnarchiveCompany`
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

### `PATCH /v2/subscription/payment-method/:paymentUniqueName`

- **Frontend id:** `SUBSCRIPTION_V2_API.SET_DEFAULT_PAYMENT_METHOD`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#setDetaultPaymentMethod`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#updateDefaultSubscriptionPaymentInfo
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:196`
- **Deprecated:** No

Update Default Subscription Payment Info

#### Inputs

**Path parameters**
- `paymentUniqueName` — type: `String`; required

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

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/v2/subscription/payment-method/SAMPLE_paymentUniqueName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId`

- **Frontend id:** `SUBSCRIPTION_V2_API.SUBSCRIPTION_BY_ID`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#viewSubscriptionById`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:220`
- **Deprecated:** No

Get Subscription

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscription`

```json
{
  "status": "success",
  "body": {
    "reference": "subscription"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/transfer/ownership?subscriptionId=:subscriptionId`

- **Frontend id:** `SUBSCRIPTION_V2_API.TRANSFER`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#transferSubscription`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#ownerShipTransfer
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:78`
- **Deprecated:** No

Owner Ship Transfer

#### Inputs

**Query parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

Type: `OwnerShipRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `name` | `String` | not declared | unconstrained |
| `lastName` | `String` | not declared | unconstrained |
| `email` | `String` | not declared | unconstrained |

Example:

```json
{
  "name": "string",
  "lastName": "string",
  "email": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `StaticMessageSource.getMessage("subscription.ownership.transfer.mail", ownerShipRequest.getEmail(`

```json
{
  "status": "success",
  "body": "subscription.ownership.transfer.mail"
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/transfer/ownership?subscriptionId=SAMPLE_subscriptionId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"name":"string","lastName":"string","email":"string"}'
```

---

### `PATCH /v2/subscription/billing-account/:billingAccountUnqiueName`

- **Frontend id:** `SUBSCRIPTION_V2_API.UPDATE_BILLING_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#updateBillingDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#updateSubscriptionBillingAccount
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:111`
- **Deprecated:** No

Update Subscription Billing Account

#### Inputs

**Path parameters**
- `billingAccountUniqueName` — type: `String`; required

#### Controller-backed request payload

Type: `SubscriptionBillingAccountResource` (required).

Model fields could not be statically resolved; inspect the cited controller/model before integration.

Example:

```json
"string"
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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`

#### curl

```bash
curl --request PATCH \
  --url 'https://api.giddh.com/v2/subscription/billing-account/SAMPLE_billingAccountUniqueName' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `POST /v2/subscription/update`

- **Frontend id:** `SUBSCRIPTION_V2_API.UPDATE_PLAN`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#updatePlan`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#updateSubscriptionAfterPayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:334`
- **Deprecated:** No

Update Subscription After Payment

#### Inputs



#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
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
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/update' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `POST /v2/subscription?company=:company`

- **Frontend id:** `SUBSCRIPTION_V2_API.UPDATE_SUBSCRIPTION`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#updateSubscription`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#createSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:142`
- **Deprecated:** No

Also it add plan info to subscription if user selects plan without selecting payment method and later

#### Inputs

**Query parameters**
- `companyUniqueName` — type: `String`; optional

#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `GENERAL_SECURITY` | `GeneralSecurityException` | GeneralSecurityException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_DATE_FORMAT` | `InvalidDateFormatException` | InvalidDateFormatException raised by controller or shared ExceptionHandler |
| 400 | `INVALID_PARAMETERS` | `InvalidParameterException` | InvalidParameterException raised by controller or shared ExceptionHandler |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 400 | `STRIPE` | `StripeException` | StripeException raised by controller or shared ExceptionHandler |
| 400 | `TIMEOUT` | `TimeoutException` | TimeoutException raised by controller or shared ExceptionHandler |
| 401 | `ENCRYPTION` | `EncryptionException` | EncryptionException raised by controller or shared ExceptionHandler |
| 401 | `UNAUTHORIZED` | `UnAuthorizeException` | UnAuthorizeException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 409 | `ALREADY_EXIST` | `AlreadyExistException` | AlreadyExistException raised by controller or shared ExceptionHandler |
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
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription?companyUniqueName=dcrcdiin17887749442630bsy43' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `POST /v2/subscription/verify/ownership?requestId=:requestId&reject=:reject`

- **Frontend id:** `SUBSCRIPTION_V2_API.VERIFY_OWNERSHIP`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#verifyOwnership`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#verifyOwnerShip
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:86`
- **Deprecated:** No

Verify Owner Ship

#### Inputs

**Query parameters**
- `requestId` — type: `String`; required
- `reject` — type: `boolean`; optional; default: `false`

#### Controller-backed request payload

Type: `String` (optional).

No finite field/value contract is declared by the controller.

Example:

```json
"string"
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
- `request (echoed by service)`

#### curl

```bash
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/verify/ownership?requestId=SAMPLE_requestId&reject=false' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '"string"'
```

---

### `GET /users/subscriptions`

- **Frontend id:** `SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES`
- **Frontend evidence:** `apps/web-giddh/src/app/services/subscriptions.service.ts#getSubScribedCompanies`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: UserController#getAllUserSubscriptions
- **Backend source:** `src/main/java/com/giddh/api/controllers/v1/UserController.java:306`
- **Deprecated:** No

Get All User Subscriptions

#### Inputs

**Query parameters**
- `scope` — type: `String`; optional

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscriptionResources`

```json
{
  "status": "success",
  "body": {
    "reference": "subscriptionResources"
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
- `body as SubscriptionsUser`
- `request (echoed by service)`
- `queryString (echoed by service)`

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/users/subscriptions?scope=SAMPLE_scope' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `POST /v2/subscription/add-wallet-amount`

- **Frontend id:** `WALLET_API.ADD_WALLET_AMOUNT`
- **Frontend evidence:** `apps/web-giddh/src/app/subscription/services/wallet.service.ts#addWalletAmount`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#addWalletAmount
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:445`
- **Deprecated:** No

Add Wallet Amount

#### Inputs



#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
}
```

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscriptionServiceV2.addWalletAmount(subscriptionRequest, principal, request`

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
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

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
curl --request POST \
  --url 'https://api.giddh.com/v2/subscription/add-wallet-amount' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `POST /v2/subscription/:subscriptionId/capture-wallet-payment`

- **Frontend id:** `WALLET_API.CAPTURE_WALLET_PAYMENT`
- **Frontend evidence:** `apps/web-giddh/src/app/subscription/services/wallet.service.ts#captureWalletPayment`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#captureWalletPayment
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:451`
- **Deprecated:** No

Capture Wallet Payment

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

Type: `SubscriptionRequest` (required).

| Field | Type | Validation | Allowed values |
|---|---|---|---|
| `planUniqueName` | `String` | not declared | unconstrained |
| `balance` | `BigDecimal` | not declared | unconstrained |
| `userUniqueName` | `String` | not declared | unconstrained |
| `expireDate` | `String` | not declared | unconstrained |
| `status` | `String` | not declared | unconstrained |
| `subscriptionId` | `String` | not declared | unconstrained |
| `duration` | `DurationType` | NotNull(message = "Duration type must be specified.") | unconstrained |
| `licenceKey` | `String` | not declared | unconstrained |
| `promoCode` | `String` | not declared | unconstrained |
| `addOnTransactions` | `BigInteger` | not declared | unconstrained |
| `paymentProvider` | `PaymentProvider` | not declared | CASHFREE, STRIPE, RAZORPAY, GOCARDLESS, PAYPAL, APPLE, GOOGLEPAY_ANDROID, PAYU |
| `billingAccount` | `SubscriptionBillingAccountResource` | not declared | unconstrained |
| `returnUrl` | `String` | not declared | unconstrained |
| `affiliateId` | `String` | not declared | unconstrained |
| `trialExtendedDays` | `Integer` | not declared | unconstrained |
| `paymentId` | `String` | not declared | unconstrained |
| `amountPaid` | `BigDecimal` | not declared | unconstrained |
| `razorpaySignature` | `String` | not declared | unconstrained |
| `razorpayOrderId` | `String` | not declared | unconstrained |
| `payuTransactionId` | `String` | not declared | unconstrained |
| `paymentIntentId` | `String` | not declared | unconstrained |
| `paypalOrderId` | `String` | not declared | unconstrained |
| `payNow` | `boolean` | not declared | unconstrained |
| `taxTotal` | `BigDecimal` | not declared | unconstrained |
| `bankDetails` | `RazorpayBankDetails` | not declared | unconstrained |
| `razorpayAuthType` | `RazorpayAuthType` | not declared | CARD, NETBANKING, AADHAAR, UPI |
| `countryCode` | `String` | not declared | unconstrained |
| `prePaid` | `boolean` | not declared | unconstrained |
| `prepaidUniqueName` | `String` | not declared | unconstrained |
| `includeNextBill` | `boolean` | not declared | unconstrained |
| `googlePayPurchaseToken` | `String` | not declared | unconstrained |
| `providerPlanName` | `String` | not declared | unconstrained |
| `autoPay` | `boolean` | not declared | unconstrained |
| `renew` | `boolean` | not declared | unconstrained |
| `walletAmount` | `BigDecimal` | not declared | unconstrained |
| `reactivateFromSubscriptionId` | `String` | not declared | unconstrained |

Example:

```json
{
  "planUniqueName": "string",
  "balance": 0,
  "userUniqueName": "string",
  "expireDate": "string",
  "status": "string",
  "subscriptionId": "string",
  "duration": "string",
  "licenceKey": "string",
  "promoCode": "string",
  "addOnTransactions": 0,
  "paymentProvider": "CASHFREE",
  "billingAccount": "string",
  "returnUrl": "string",
  "affiliateId": "string",
  "trialExtendedDays": 0,
  "paymentId": "string",
  "amountPaid": 0,
  "razorpaySignature": "string",
  "razorpayOrderId": "string",
  "payuTransactionId": "string",
  "paymentIntentId": "string",
  "paypalOrderId": "string",
  "payNow": false,
  "taxTotal": 0,
  "bankDetails": "string",
  "razorpayAuthType": "CARD",
  "countryCode": "string",
  "prePaid": false,
  "prepaidUniqueName": "string",
  "includeNextBill": false,
  "googlePayPurchaseToken": "string",
  "providerPlanName": "string",
  "autoPay": false,
  "renew": false,
  "walletAmount": 0,
  "reactivateFromSubscriptionId": "string"
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
| 400 | `JSON_PROCESSING` | `JsonProcessingException` | JsonProcessingException raised by controller or shared ExceptionHandler |
| 400 | `RAZORPAY` | `RazorpayException` | RazorpayException raised by controller or shared ExceptionHandler |
| 404 | `NOT_FOUND` | `NotFoundException` | NotFoundException raised by controller or shared ExceptionHandler |
| 406 | `INVALID_REQUEST` | `InvalidRequestException` | InvalidRequestException raised by controller or shared ExceptionHandler |
| 422 | `UNEXPECTED` | `UnexpectedException` | UnexpectedException raised by controller or shared ExceptionHandler |

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
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/capture-wallet-payment' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"planUniqueName":"string","balance":0,"userUniqueName":"string","expireDate":"string","status":"string","subscriptionId":"string","duration":"string","licenceKey":"string","promoCode":"string","addOnTransactions":0,"paymentProvider":"CASHFREE","billingAccount":"string","returnUrl":"string","affiliateId":"string","trialExtendedDays":0,"paymentId":"string","amountPaid":0,"razorpaySignature":"string","razorpayOrderId":"string","payuTransactionId":"string","paymentIntentId":"string","paypalOrderId":"string","payNow":false,"taxTotal":0,"bankDetails":"string","razorpayAuthType":"CARD","countryCode":"string","prePaid":false,"prepaidUniqueName":"string","includeNextBill":false,"googlePayPurchaseToken":"string","providerPlanName":"string","autoPay":false,"renew":false,"walletAmount":0,"reactivateFromSubscriptionId":"string"}'
```

---

### `GET /v2/subscription/:subscriptionId`

- **Frontend id:** `WALLET_API.GET_SUBSCRIPTION_DATA`
- **Frontend evidence:** `apps/web-giddh/src/app/subscription/services/wallet.service.ts#getSubscriptionData`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getSubscription
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:220`
- **Deprecated:** No

Get Subscription

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscription`

```json
{
  "status": "success",
  "body": {
    "reference": "subscription"
  }
}
```

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
| 400 | `IO` | `IOException` | IOException raised by controller or shared ExceptionHandler |
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
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId/wallet`

- **Frontend id:** `WALLET_API.GET_WALLET_DETAILS`
- **Frontend evidence:** `apps/web-giddh/src/app/subscription/services/wallet.service.ts#getWalletDetails`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getWalletDetails
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:458`
- **Deprecated:** No

Get Wallet Details

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `subscriptionServiceV2.getWalletDetails(subscriptionId, principal`

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

#### curl

```bash
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/wallet' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

---

### `GET /v2/subscription/:subscriptionId/wallet-logs?page=:page&count=:count`

- **Frontend id:** `WALLET_API.GET_WALLET_LOGS`
- **Frontend evidence:** `apps/web-giddh/src/app/subscription/services/wallet.service.ts#getWalletLogs`
- **Method evidence:** actual frontend HTTP call
- **Backend match:** giddh-api-v2: SubscriptionControllerV2#getSubscriptionWalletLogs
- **Backend source:** `src/main/java/com/giddh/api/controllers/SubscriptionControllerV2.java:464`
- **Deprecated:** No

Get Subscription Wallet Logs

#### Inputs

**Path parameters**
- `subscriptionId` — type: `String`; required
**Query parameters**
- `page` — type: `int`; optional; default: `1`
- `count` — type: `int`; optional; default: `50`

#### Controller-backed request payload

None.

#### Success response

- HTTP status: `200 OK`
- Envelope: `ApiResponse`
- Declared return: `ResponseEntity<ApiResponse>`
- Body evidence: `logs`

```json
{
  "status": "success",
  "body": {
    "reference": "logs"
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
curl --request GET \
  --url 'https://api.giddh.com/v2/subscription/SAMPLE_subscriptionId/wallet-logs?page=1&count=50' \
  --header 'Auth-Key: dNYPuoiWrFz********go=' \
  --header 'Accept: application/json'
```

