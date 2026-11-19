# Surface API tests — 2026-10-23

Company `giddhain1792673422178091xos`, account `apidoc-customer-one`. Captures `1500`–`1540`.

Magic link created this run: `https://m.9m.io/lj792oo` → id `1792765161665hwg5th4vj7pifbd5zzl0`. The short code is not the API id.

Live success and failure JSON are wired into Explorer (`tools/giddh-api-explorer/public/data/catalog.json`) and `docs/api/coverage/catalog.json`. Hardcoded base64/PDF bodies are omitted in the catalog copies.

## Deferred

Portal login through MSG91 proxy:

`POST https://routes.msg91.com/api/proxy/117230/24lvqun1/v2/verify-portal-user`

returns `INVALID_CF_IP` / “Request did not originate from Cloudflare.” Capture `1540`. Work later.

## Passed

| Tag | Call | Result |
| --- | --- | --- |
| 1500 | `POST /company/{c}/accounts/apidoc-customer-one/magic-link` | 200, short URL |
| 1524 | `GET /magic-link-ledger/{id}` | 200, ledger page |
| 1525 | `GET /magic-link-ledger-balance/{id}` | 200, balances |
| 1527 | `POST /magic-link/{id}/download-voucher?voucherVersion=2` | 200, PDF 189312 bytes for `261022-2` |
| 1507 | `GET /v2/user` | 200, website session check |
| 1528 | `GET /v2/subscription/plans/all?regionCode=IND` | 200, 11 plans. `regionCode=IN` is 406 |
| 1513 | `GET portal/.../payment-method` | 200, empty object |
| 1514 | `GET portal/.../payment-methods?voucherVersion=2` | 200, Razorpay/PayU/PayPal all false |
| 1519 | `GET portal/.../{voucher}/comments?voucherVersion=2` | 200, empty list |
| 1520 | `POST portal/.../invoice-pay-request` for `261022-1` | 200, already paid |
| 1531 | same for `261022-2` | 200, UNPAID 100 INR, `canPay` false — no gateway |
| 1521 | `POST portal/.../download-file?voucherVersion=2&fileType=base64` | 200 |

## Called, not a product success

| Tag | Call | Result |
| --- | --- | --- |
| 1501–1505 | Magic link using short code `lj792oo` | 404 magic link not found |
| 1526, 1533 | `GET /magic-link/{id}/download-invoice/{number or uniqueName}` | 400 `VOUCHER_NOT_PROVIDED`. Version-2 PDF is the POST download-voucher route |
| 1534 | `GET /magic-link/{id}/ledger/upload/missing-attachment` | 404 `IMAGE_NOT_FOUND`. Ledger rows have no attachment |
| 1508 | `GET /v2/google-login` | 401 Access token is required |
| 1509 | `GET /invoice-pay-request/missing-token` | 400 missing auth header |
| 1510–1512, 1515–1516 | Portal details, contacts, statement, export | 404 `PORTAL_CONTACT_NOT_FOUND` |
| 1517–1518, 1532 | Portal voucher list, balance, add-comment | 401 session not found |
| 1529–1530 | Same list/balance with Auth-Key only | 400 missing Session-Id |
| 1522 | `GET portal/.../vouchers?type=receipt` | 500. This path is not a Spring route |
| 1523 | `POST /v2/verify-portal-user` without proxy token | 406 max limit exceeded |

## Not called (needs you)

Do these one by one. Do not send OTP, register a user, or pay until you are on that step.

1. Portal customer session for `apidoc-customer-one` (portal login URL `proxy_auth_token`, or the portal Session-Id after login). Unblocks details, contacts, statement, export, voucher list, balance summary, add-comment, `verify-portal-user`, `save-session`.
2. A fresh company Session-Id. The saved one is rejected by accounting routes that require Session-Id. Auth-Key still works for api-v2.
3. Turn on a test payment gateway (Razorpay/PayU/PayPal are all false). Then invoice pay, website `GET /invoice-pay-request/{token}`, and `POST .../invoices/{paymentId}/pay`.
4. A ledger attachment uniqueName on this magic link, for `GET /magic-link/{id}/ledger/upload/{file}`.
5. Google Access-Token for `GET /v2/google-login`.
6. Password for `POST /v2/login-with-password` and body for `POST /v2/auth-login`. No password guessing.
7. Phone you control for `POST /generate-otp` and `POST /v2/verify-number`.
8. Affiliate payload you want emailed for `POST /verify-and-send`.
9. Whether to create a real user with `POST /v2/register`.
