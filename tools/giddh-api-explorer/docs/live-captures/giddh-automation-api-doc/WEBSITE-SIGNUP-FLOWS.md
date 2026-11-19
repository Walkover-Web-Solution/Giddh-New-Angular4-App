# Giddh Website — signup → subscription → company (recorded 2026-10-23)

Host: `https://api.giddh.com`. Website origin `https://giddh.com`; after register, books `https://books.giddh.com`.  
Apitest: `apitest.giddh.com` / `test.giddh.com`. Tokens and Session-Ids are redacted in captures `1640`–`1657`.

Login-only flows: `WEBSITE-LOGIN-FLOWS.md`.

## 1. Website register (MSG91)

Same MSG91 `sendOtp` / `verifyOtp` as OTP login (external). Then:

`POST /v2/register`

```json
{
  "emailId": "...",
  "emailIdAccessToken": "<msg91_jwt>",
  "emailIdAuthType": "giddh",
  "mobileNo": "91...",
  "mobileNoAccessToken": "<msg91_jwt>"
}
```

| Case | Capture | Result |
| --- | --- | --- |
| Existing user | `1640` | `statusCode: AUTHENTICATE_TWO_WAY` → same 2FA as login (`/v2/verify-number`) |
| New user | `1641` | `isNewUser: true` + `session.id` |

New user redirect:

`https://books.giddh.com/token-verify?request={session.id}&region=IN` (+ UTM/ref query params)

## 2. Books session bootstrap

| Step | API | Capture |
| --- | --- | --- |
| Session user | `GET /v2/user` | `1642` |
| User profile | `GET /users/{email}` | `1643` (`isNewUser`, `hasSubscriptionPermission: false`) |

## 3. Buy plan UI

| Step | API | Capture |
| --- | --- | --- |
| List plans | `GET /v2/subscription/plans/all?regionCode=IND` | `1644` (Oak / Vine / Sequoia / Free) |
| Price | `POST /v2/subscription/get-amount` | `1645` no promo → ₹4720 with 18% GST |
| Bad promo | same | `1646` `NOT_FOUND` Promo code not found |
| Promo `GIDDH20` | same | `1647` → ₹3776 after 20% + GST |

`get-amount` body:

```json
{
  "planUniqueName": "dmg1715623569079",
  "promoCode": "GIDDH20",
  "duration": "YEARLY",
  "countryCode": "IND"
}
```

## 4a. Buy now (payment started, not completed)

| Step | API | Capture |
| --- | --- | --- |
| Create pending sub | `POST /v2/subscription` `payNow: true` | `1648` → `SUB-20261023-7` `status: pending` |
| Razorpay order | `GET /v2/subscription/{id}/generate-order?promocode=GIDDH20` | `1649` → `razorpayOrderId` |

Payment UI was not finished in this capture.

## 4b. Start trial (path used to finish onboarding)

| Step | API | Capture |
| --- | --- | --- |
| Create trial | `POST /v2/subscription` `payNow: false` | `1650` → `SUB-20261023-8` `status: trial` |
| Get sub | `GET /v2/subscription/SUB-20261023-8` | `1651` |
| Countries | `GET /v2/subscription/{id}/country-list` | `1652` |

Billing account is in the POST body (`billingName`, GSTIN, address, state MP, etc.).

## 5. New company onboarding

| Step | API | Capture |
| --- | --- | --- |
| Onboarding form | `GET /ui/forms?formName=onboarding&country=IN` | `1653` |
| GST lookup | `GET /gst-info?gstin=23AAACC1206D2ZN` | `1654` (addresses trimmed) |
| Create company | `POST /company` with `subscriptionId: SUB-20261023-8` | `1655` → `centrain17927583331800zu6km`, `voucherVersion: 2` |
| Lead Slack | `POST /send-data` | `1656` |
| New-user notify | `POST /users/send-new-user-info` | `1657` |

Company create attaches subscription via:

```json
"subscriptionRequest": {
  "subscriptionId": "SUB-20261023-8",
  "userUniqueName": "shristi@viasocket.com"
}
```

## Surfaces

- Website: MSG91 + `POST /v2/register`
- Giddh Panel (books): everything after `token-verify` (plans, subscription, company, send-data)

## Example entities from this run

- User: `shristi@viasocket.com`
- Trial sub: `SUB-20261023-8` (pending paid attempt: `SUB-20261023-7`)
- Plan: Oak `dmg1715623569079`
- Promo: `GIDDH20`
- Company: `centrain17927583331800zu6km` / portalDomain `CENTRALWAREHOUSINGCORPORATION3`
