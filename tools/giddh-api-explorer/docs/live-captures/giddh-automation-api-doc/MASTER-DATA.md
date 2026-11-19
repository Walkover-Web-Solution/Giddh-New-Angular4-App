# Live API captures — Giddh Automation API DOC

Company: `giddhain1792673422178091xos`  
Auth: `Session-Id` in local `secrets.local.json` only  

## Hard rules (read first)

1. **`voucherVersion=2` on every accounting-microservice API** for this company (vouchers, get-all, adjust, ledger paths the UI versions). Missing it → `Entry date must be provided`.
2. Call with **browser User-Agent** (curl). Python `urllib` default UA → Cloudflare **1010**.
3. Amounts: `{ "amountForAccount", "amountForCompany" }`. Dates: `dd-MM-yyyy` in FY `01-04-2026`–`31-03-2027`.
4. Purchase bills need a **`number`**. Stock create needs **`stockUnitUniqueName`** (e.g. pcs `WfqOHXSFugRFzJ8HDrLT`).

Machine index: [`ENTITY-REGISTRY.json`](ENTITY-REGISTRY.json) · Agent playbook: [`AGENT-KNOWLEDGE.md`](AGENT-KNOWLEDGE.md)

## Masters (created)

| Kind | uniqueNames |
| --- | --- |
| Customers | `apidoc-customer-one`, `apidoc-customer-two`, `apidoc-customer-three`, `apidoc-customer-b2c` |
| Vendors | `apidoc-vendor-one`, `apidoc-vendor-two`, `apidoc-vendor-three` |
| Bank | `apidoc-bank-hdfc` |
| Stock groups | `apidoc-products`, `apidoc-services` |
| Stock units | `pcs` → `WfqOHXSFugRFzJ8HDrLT`, `kg` → `kg` |
| Stocks | `apidoc-widget`, `apidoc-gadget`, `apidoc-service-hour` |
| Discounts | see registry (flat + %) |
| System | `sales`, `purchases`, `cash` |

Request/response pairs under `requests/` + `responses/` (`20`–`48`, `40`–`47`).

## Vouchers (sample)

Sales `261022-1`…`261022-5`, receipts adjusted, purchases `PB-API-001`/`002`, payments, credit notes `CR-*`, debit notes `DR-*`.

Full list with uniqueNames: `ENTITY-REGISTRY.json` → `vouchers`.

## Working generate URL

```
POST /v4/company/{c}/accounts/{party}/vouchers/generate?branchUniqueName={b}&voucherVersion=2
```

Templates: `requests/30-create-sales-invoice.json`, `31-create-receipt.json`, `54b-purchase-with-number.json`, `33-create-payment.json`, `56-credit-note.json`, `57-debit-note.json`.

## Docs / Explorer success example

Live `201` body from sales generate is wired into:

- `docs/api/coverage/catalog.json` (and Explorer `tools/giddh-api-explorer/public/data/catalog.json`)
- `docs/api/frontend-used/05-vouchers-sales-verified.md` → Success response for `POST /v4/.../vouchers/generate`

Hard-refresh Explorer after catalog change to see Success panel (number `261022-1`, not placeholder `reference: response`).
