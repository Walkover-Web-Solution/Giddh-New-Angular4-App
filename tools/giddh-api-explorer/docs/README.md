# Giddh Web App API Documentation

Short intro: this documents **every** HTTP API path template declared under `apps/web-giddh` `apiurls` (plus a few inline service URLs), as used by the Angular app.

| | |
|---|---|
| **API base** | `https://api.giddh.com/` (test UI is `https://test.giddh.com`; API host is `apitest`) |
| **companyUniqueName** | Live capture: `giddhain1792673422178091xos` (Giddh Automation API DOC). Older curls may still show `dcrcdiin17887749442630bsy43`. |
| **branchUniqueName** | Live capture HQ: `giddhautomationapidoc` |
| **Auth** | Header `Auth-Key` (preferred) or `Session-Id` (browser). Never commit secrets. |
| **Envelope** | Responses are `BaseResponse`: `status`, `code`, `message`, `body` |
| **Live captures** | Exact success bodies + Postman plan: [`live-captures/`](./live-captures/README.md) |

Runtime also adds `lang` and cache-bust `t` / `z` query params; curls below include `branchUniqueName` only.

**Total endpoints documented:** 754

## Domains

- [Auth / Login / Permission / DSC](./01-auth-login.md) (38)
- [Company & Branches](./02-company-branches.md) (66)
- [Accounts & Groups](./03-accounts-groups.md) (47)
- [Ledger & Daybook](./04-ledger-daybook.md) (61)
- [Vouchers / Sales / Invoice / Receipt](./05-vouchers-sales.md) (113)
- [Purchase](./06-purchase.md) (29)
- [Inventory & Manufacturing](./07-inventory-manufacturing.md) (134)
- [GST / VAT / Tax compliance](./08-gst-vat.md) (50)
- [Reports / Dashboard](./09-reports-dashboard.md) (34)
- [Settings](./10-settings.md) (91)
- [Subscriptions](./11-subscriptions.md) (38)
- [Imports / Sync / OCR](./12-imports-sync-ocr.md) (15)
- [Platform / Misc](./13-misc.md) (38)

## Regenerate

```bash
node scripts/generate-giddh-api-docs.mjs
```

Coverage snapshot: `docs/api/_coverage.json`.

## Backend-verified documentation

The following contracts are generated from the four Spring controller codebases. They are authoritative for method/path, controller inputs, finite allowed values, and deprecation evidence.

- [Giddh API v2](./backend/giddh-api-v2.md) (1278 expanded routes)
- [Accounting Microservice](./backend/accounting-microservice.md) (77 expanded routes)
- [Import Microservice](./backend/import-microservice.md) (20 expanded routes)
- [Search API](./backend/search-api.md) (17 expanded routes)

- [Backend-verified frontend APIs](./frontend-used/README.md) (672 exact matches)
- [Frontend/backend coverage](./coverage/README.md)
- [Frontend unmatched](./coverage/frontend-unmatched.md) (161)
- [Backend not used by frontend](./coverage/backend-not-used.md) (737)
- [Explicitly deprecated](./coverage/deprecated.md)

Regenerate:

```bash
node scripts/generate-backend-verified-api-docs.mjs
```
