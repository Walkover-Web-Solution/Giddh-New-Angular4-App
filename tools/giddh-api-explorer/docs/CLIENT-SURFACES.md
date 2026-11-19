# Client surfaces

One Spring backend (api-v2, accounting, import, search). Several UIs call it. Explorer tags each route with every UI that uses it.

| Tag | Repo | Who uses it |
| --- | --- | --- |
| Giddh Panel | `Giddh-New-Angular4-App` | Giddh clients (ABC) in the main web app |
| Customer Portal | `Giddh-Ex-Portal` | ABC’s customers (XYZ) |
| Magic Link | `Giddh-Ex-Portal` magic-link pages | Same end customers, via a shared link |
| Giddh Website | `Giddh-Website` | Public site: signup, login, plans, pay |

Admin-panel APIs are out of scope. They are not tagged and are not tested.

Filter in API Explorer by these tags. A route used by more than one UI shows every tag.

## Verified on backend

Matched `method` + normalized path to Spring catalog routes.

### Customer Portal (16)

- `GET portal/company/{}/accounts/{}/details`
- `GET portal/company/{}/accounts/{}/get-company-details`
- `GET portal/company/{}/accounts/{}/contacts`
- `GET portal/company/{}/accounts/{}/payment-method`
- `GET portal/company/{}/accounts/{}/payment-methods`
- `POST portal/company/{}/accounts/{}/invoice-pay-request`
- `POST portal/company/{}/accounts/{}/invoices/{}/pay`
- `POST portal/company/{}/accounts/{}/download-file`
- `POST portal/company/{}/accounts/{}/vouchers/get-all`
- `GET portal/company/{}/accounts/{}/vouchers/balance-summary`
- `GET portal/company/{}/accounts/{}/view-statement`
- `GET portal/company/{}/accounts/{}/export-account-statement`
- `GET portal/company/{}/accounts/{}/{}/comments`
- `POST portal/company/{}/accounts/{}/{}/add-comment`
- `POST v2/verify-portal-user`
- `POST v2/portal-user/save-session`

### Magic Link (5)

- `GET magic-link-ledger/{}`
- `GET magic-link-ledger-balance/{}`
- `POST magic-link/{}/download-voucher` (voucher version 2)
- `GET magic-link/{}/download-invoice/{}` (older voucher version)
- `GET magic-link/{}/ledger/upload/{}`

### Giddh Website (11)

- `POST verify-and-send`
- `POST v2/register`
- `GET v2/user`
- `GET v2/google-login`
- `POST v2/auth-login`
- `POST v2/login-with-password`
- `GET v2/subscription/plans/all`
- `GET invoice-pay-request/{}`
- `POST company/{}/invoices/{}/pay`
- `POST generate-otp`
- `POST v2/verify-number`

## Not on the Spring catalog

Shown in Explorer as Unmatched, with the UI tag:

- `GET portal/company/{}/accounts/{}/vouchers` — portal payment list. Backend has `GET .../voucher/{uniqueName}` and `POST .../vouchers/get-all`.
- `POST company/{}/proforma/{}/pay` — website proforma payment. No controller route in the catalog.
- `GET api/c/getDetails` — portal proxy (`PROXY_URL`), not a Giddh Spring controller.

External calls (Google, db-ip, Segmento, S3, Razorpay) are not Giddh APIs and are not in the catalog.

## Live captures

- Portal / Magic Link batch: `1500`–`1540` — `SURFACE-TEST-RESULTS.md`
- Giddh Website batch: `1600`–`1624` — `WEBSITE-TEST-RESULTS.md`
- Website login: `1630`–`1636` — `WEBSITE-LOGIN-FLOWS.md`
- Website signup → subscription → company: `1640`–`1657` — `WEBSITE-SIGNUP-FLOWS.md`

Both are in Explorer (`tools/giddh-api-explorer`) and `docs/api/coverage/catalog.json`.

Prod Customer Portal (`portal.giddh.com/10k`): login + welcome APIs captured `1700`–`1716` — `CUSTOMER-PORTAL-PROD-FLOWS.md`.  
Apitest/testportal MSG91 proxy still deferred (`INVALID_CF_IP`, `1540`).
