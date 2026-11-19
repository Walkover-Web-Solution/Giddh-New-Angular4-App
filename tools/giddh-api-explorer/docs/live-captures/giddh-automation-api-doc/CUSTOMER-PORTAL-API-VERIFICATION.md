# Customer Portal API verification (2026-10-26)

## Catalog rule

APIs tagged **Customer Portal** in the explorer use `surfaces: ["customer-portal"]` only (no Giddh Panel / Website / Magic Link on the same record).

**Count:** **18** endpoints (all exclusive to Customer Portal).

| # | Service | Method | Path | Ex-Portal reference |
| --- | --- | --- | --- | --- |
| 1 | giddh-api-v2 | GET | `/portal/company/…/contacts` | `API_PATHS.contacts` |
| 2 | giddh-api-v2 | GET | `/portal/company/…/details` | `API_PATHS.accountDetails` |
| 3 | giddh-api-v2 | GET | `/portal/company/…/get-company-details` | `API_PATHS.companyDetails` |
| 4 | giddh-api-v2 | GET | `/portal/company/…/view-statement` | `API_PATHS.viewStatement` |
| 5 | giddh-api-v2 | GET | `/portal/company/…/export-account-statement` | `API_PATHS.exportAccountStatement` |
| 6 | giddh-api-v2 | GET | `/portal/company/…/payment-method` | `API_PATHS.paymentMethodList` |
| 7 | giddh-api-v2 | POST | `/v2/verify-portal-user` | `PROXY_API_PATHS.VERIFY_PORTAL_USER` |
| 8 | giddh-api-v2 | POST | `/v2/portal-user/save-session` | `PROXY_API_PATHS.SAVE_SESSION` |
| 9 | accounting-ms | POST | `/portal/company/…/vouchers/get-all` | `API_PATHS.vouchersGetAll` |
| 10 | accounting-ms | POST | `/portal/company/…/download-file` | `API_PATHS.downloadFile` |
| 11 | accounting-ms | GET | `/portal/company/…/vouchers/balance-summary` | `API_PATHS.vouchersBalanceSummary` |
| 12 | accounting-ms | POST | `/portal/company/…/invoice-pay-request` | `API_PATHS.invoicePayRequest` |
| 13 | accounting-ms | POST | `/portal/company/…/invoices/{paymentId}/pay` | `API_PATHS.invoicePay` |
| 14 | accounting-ms | POST | `/portal/company/…/{voucherUniqueName}/add-comment` | `API_PATHS.voucherAddComment` |
| 15 | accounting-ms | GET | `/portal/company/…/{voucherUniqueName}/comments` | `API_PATHS.voucherComments` |
| 16 | accounting-ms | GET | `/portal/company/…/payment-methods` | `API_PATHS.paymentMethods` |
| 17 | client-unmatched | GET | `/portal/company/{id}/accounts/{id}/vouchers` | `paymentVouchersList` (query-style; not 1:1 Spring route) |
| 18 | client-unmatched | GET | `/api/c/getDetails` | Proxy on `PROXY_URL`, not `api.giddh.com` |

Source of truth for client usage: [Giddh-Ex-Portal `src/constants/apiPaths.ts`](../../../../Giddh-Ex-Portal/src/constants/apiPaths.ts).

Explorer catalog: filter **Classification → Customer Portal** (same 18).

## DocStar (Giddh API Draft_1)

| Item | Value |
| --- | --- |
| Org | `83427` (Giddh testing prod) |
| Collection | `-Jey39dCAAyx` |
| **Customer Portal** menu page | `zIqGK5BZ5fh6` |

**Sync (2026-10-26):** **18** endpoints under `zIqGK5BZ5fh6` — **16** created, **2** refreshed (Download, Invoice Payment Request). Published. Mapping: `customer-portal-docstar-create-results.json`.

Payloads: `customer-portal-docstar-create-payloads.json` (host `https://api.giddh.com`). Authenticated `/portal/…` routes should document **`Session-Id`** prefill `ENTER_YOUR_GIDDH_SESSION_ID` (login routes `save-session` / `verify-portal-user` and proxy `GET /api/c/getDetails` do not).
