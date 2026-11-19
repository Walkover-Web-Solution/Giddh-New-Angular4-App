# Giddh Website API tests — 2026-10-23

Captures `1600`–`1624`. Origin for most calls: `https://web.giddh.com` or `https://test.giddh.com`. Wired into Explorer + `docs/api/coverage/catalog.json`.

Customer Portal login is deferred (`INVALID_CF_IP`). This batch is Website-only.

## Success

| Tag | Call | Result |
| --- | --- | --- |
| 1600 | `GET /v2/subscription/plans/all?regionCode=IND` | 200, plans list |
| 1602 | `GET /v2/user` (Auth-Key / Session) | 200 |
| 1620 | `GET /white-label` | 200 |
| 1630 | `GET /v2/google-login` (real Google Access-Token, prod) | 200, `AUTHENTICATE_TWO_WAY` |
| 1631 | `POST /v2/verify-number` (2FA OTP) | 200, session |
| 1632 | `GET /v2/user` after books redirect | 200 |
| 1633 | `DELETE /users/{email}/destroy-session` | 200 (logout; blacklist in runners) |
| 1634 | `POST /v2/auth-login` (MSG91 JWT) | 200, `AUTHENTICATE_TWO_WAY` |

Full Google + OTP login diagrams: `WEBSITE-LOGIN-FLOWS.md`.

## Live failures (documented)

| Tag | Call | Result |
| --- | --- | --- |
| 1601 | plans `regionCode=IN` | 406 Region not found |
| 1603 | `GET /v2/google-login` no token | 401 Access token is required |
| 1604 | google-login bad `Access-Token` | 401 Google verification failed |
| 1605 | `POST /v2/auth-login` `{}` | 400 ACCESS_TOKEN_NOT_PROVIDED |
| 1606 | auth-login bad token | 401 Invalid access token |
| 1607 | `POST /v2/login-with-password` wrong password | 406 IP max limit exceeded |
| 1608 | login-with-password empty | 404 Email or mobile doesn't exist |
| 1609–1610 | `POST /v2/register` empty / partial | 406 IP max limit (no user created) |
| 1611 | `POST /generate-otp` fake mobile | 404 No user found with this contact number |
| 1612 | `POST /v2/verify-number` fake OTP | 400 Enter valid verification code |
| 1613–1614 | `POST /verify-and-send` | 401 access-token field is required |
| 1615, 1621 | `GET /invoice-pay-request/{token}` | 400 MISSING_HEADER (apitest requires Auth-Key/Session despite interceptor exclude) |
| 1616, 1624 | `POST /company/{c}/invoices/{id}/pay` no auth | 400 MISSING_HEADER |
| 1617, 1623 | same with Auth-Key | 404 Not Found on apitest |
| 1618–1619 | `POST /company/{c}/proforma/{n}/pay` | 400 missing header / 404 (no Spring route) |

## Signup / subscription (recorded)

See `WEBSITE-SIGNUP-FLOWS.md` — captures `1640`–`1657` (register existing vs new, plans, get-amount ± promo, buy-now pending, generate-order, start trial, gst-info, create company, send-data, send-new-user-info).

## Needs you later

1. Real password for `POST /v2/login-with-password`.
2. Affiliate `POST /verify-and-send` with a valid MSG91 accessToken.
3. Complete Razorpay payment after `generate-order` (order created, payment skipped in test).
4. Google / OTP login success shapes: `1630`–`1634`.
