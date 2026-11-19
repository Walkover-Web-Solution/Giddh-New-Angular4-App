# Customer Portal — prod login & account APIs (2026-10-23)

URL: [https://portal.giddh.com/10k/in/welcome](https://portal.giddh.com/10k/in/welcome)

| | |
| --- | --- |
| API | `https://api.giddh.com` |
| Portal origin | `https://portal.giddh.com` |
| MSG91 proxy | `https://routes.msg91.com/api/proxy/117230/24yrfox2` |
| Company subdomain | `10k` |
| Company uniqueName | `10kin177424654546509z75a` |
| Accounts | `raji1` (Raji), `siddhi` (Siddhi Batra) |

Prod proxy works. Apitest/testportal previously failed with `INVALID_CF_IP` (`1540`).

Tokens / Session-Id are redacted in committed JSON. Full values only in gitignored `secrets.local.json` → `portalProd`.

## Login

| Step | Call | Capture |
| --- | --- | --- |
| White-label | `GET /white-label` (Origin portal) | `1700` |
| MSG91 user | `GET routes.msg91.com/api/c/getDetails` | `1701` (external) |
| Verify portal user | `POST …/v2/verify-portal-user` `{emailId, subDomain:"10k"}` | `1702` → multi-account list |
| Save session | `POST …/v2/portal-user/save-session` | `1703` → Session-Id + companyUniqueName |

Then redirect to `/10k/in/welcome` with portal Session-Id on subsequent calls.

## Welcome / account APIs (Session-Id)

All via MSG91 proxy path prefix; Giddh path after proxy:

| Step | Call | Capture | Result |
| --- | --- | --- | --- |
| Balance | `GET …/vouchers/balance-summary?voucherVersion=2` | `1704` | payable 15283, 1 invoice |
| Company | `GET …/get-company-details` | `1705` | name 10k, portalDomain 10k |
| Account | `GET …/details` | `1706` | Raji / sundrydebtors |
| Contacts | `GET …/contacts` | `1707` | success |
| Payment method | `GET …/payment-method` | `1708` | empty |
| Payment methods | `GET …/payment-methods?voucherVersion=2` | `1709` | PAYU/PAYPAL/RAZORPAY flags |
| Statement | `GET …/view-statement` | `1710` | success |
| Invoices | `POST …/vouchers/get-all?voucherVersion=2&type=sales` | `1711` | first `BE-1211` / `yktu41792755921064` |
| Comments | `GET …/{voucher}/comments` | `1712` | empty list |
| Download | `POST …/download-file?fileType=base64` | `1713` | PDF base64 (omitted in file) |
| Pay request | `POST …/invoice-pay-request` | `1714` | success (`canPay:false` — no gateway) |
| Add comment | `POST …/{voucher}/add-comment` | `1715` | success |
| Export PDF | `GET …/export-account-statement` | `1716` | success |

## Remaining account APIs (before logout)

| Step | Call | Capture | Result |
| --- | --- | --- | --- |
| Payment methods (no `voucherVersion`) | `GET …/payment-methods` | `1720` | 404 `USER_NOT_FOUND` — need `?voucherVersion=2` (`1709`/`1738`) |
| Export xlsx / xls | `GET …/export-account-statement&fileType=` | `1721` / `1721b` | success |
| Receipt vouchers list | `GET …/vouchers?type=receipt&…` | `1722` / `1739` | 404 `USER_NOT_FOUND` (FE path; no matching portal route) |
| Voucher get | `GET …/voucher/{un}?voucherVersion=2` | `1723` | success |
| Vendor contact | `GET …/vendor-contact/{vc}` | `1724` | success |
| Page count (wrong params) | get/set without `page=` / bad page | `1725`/`1726`/`1736` | 406/400 |
| Page count | `…/get-page-count?page=invoice` (+ `PAYMENTS`) | `1742` | success (default 50) |
| Set page count | `…/set-page-count?page=invoice&count=25` | `1743` | success |
| Invoice pay | `POST …/invoices/{paymentId}/pay` | `1727` | 406 — need payment provider / real paymentId |
| Increment session | `PUT /v2/portal-user/{vc}/increment-session` | `1728` | success |
| Switch account | `POST /v2/portal-user/switch` | `1729` / `1732` | 200 but returns `vendorContactUniqueName` only (no new Session-Id) |
| Switch via save-session | `POST /v2/portal-user/save-session` (other account) | `1729b` / `1732b` | **UI path** — new Session-Id |
| Siddhi balance/details | after switch | `1730` / `1731` | success |

## Stale session (user browser)

| Step | Call | Capture | Result |
| --- | --- | --- | --- |
| Company details | `GET …/get-company-details` | `1746` | 401 `UNAUTHORISED` — Session-Id from before destroy/switch |

## Logout (last)


| Step | Call | Capture | Result |
| --- | --- | --- | --- |
| Destroy session | `DELETE …/destroy-session` | `1733` / `1740` / `1744` | success |
| After logout | same Session-Id on balance | `1734` / `1741` / `1745` | 401 `INVALID_SESSION_ID` |

Portal UI logout only clears cookies/localStorage; backend logout is `DELETE …/destroy-session`. Session in `secrets.local.json` → `portalProd` is destroyed — re-login via `save-session` before more portal calls.

## Surfaces

Explorer tag: **Customer Portal**. Register these routes as verified on backend + live prod success.
