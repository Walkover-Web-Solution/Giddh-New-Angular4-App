# Agent knowledge — run Giddh via API (live company)

Share this folder with any agent that needs to operate Giddh for **Giddh Automation API DOC**.

## Absolute rules

1. **Auth:** Prefer **`Auth-Key`** from `secrets.local.json` (never commit; never log full key — redact like `dNYPuoiWrFz********go=`). Fall back to `Session-Id` only if Auth-Key is missing/fails. Optional block **`userSharedLive`**: prod `https://api.giddh.com`, company `nvlogiin165868912755901st49`, branch `goa` (user-shared; for live smoke only).
2. **Company voucherVersion is 2.** For **all accounting-microservice APIs**, append:

   `?voucherVersion=2` (and `branchUniqueName=giddhautomationapidoc` when the UI does).

3. Dates: `dd-MM-yyyy`, inside FY `01-04-2026`–`31-03-2027`.
4. Amounts on voucher v4: `AmountDetails` objects — `{ "amountForAccount": N, "amountForCompany": N }` — never bare numbers.
5. After **every** call (success **and** failure): write `requests/*.json` + `responses/*.json`. Index failures in `FAILURES.md`. Update `ENTITY-REGISTRY.json` on creates.
6. Prefer reusing existing uniqueNames from the registry before creating duplicates.
7. **HTTP client:** use curl (or any client) with a **browser User-Agent**. Default Python `urllib` is Cloudflare-banned (`1010`).
8. **Purchase** generate requires `number`. **Stock** create requires `stockUnitUniqueName` (company unit).
9. When an endpoint is the focus of work, patch Explorer/catalog Success from the live capture (see sales generate).
10. Session continuity: read `SESSION-HANDOFF.md` after any break. **DocStar sync:** read `DOCSTAR-SYNC-TARGET.md` before DocStar writes; default collection `-Jey39dCAAyx` (org `83427`). **Param docs on Draft_1:** **720/720 complete** (2026-10-28) — `docstar-param-doc-upload-summary.json`; re-apply via `_docstar_param_mcp_agent_instructions.md`. Legacy draft notes: `DOCSTAR-DRAFT-HANDOFF.md`. Do not change https://giddh.com/api unless explicitly asked.

## Base URL / IDs

See `CONTEXT.md` and `ENTITY-REGISTRY.json`.

```
BASE=https://api.giddh.com
C=giddhain1792673422178091xos
B=giddhautomationapidoc
VV=voucherVersion=2
```

## When to pass voucherVersion=2

Pass on **every** call that the Angular app wraps with `addVoucherVersion`, including (non-exhaustive):

- `POST/PUT/GET/DELETE` `/v4/company/{c}/.../vouchers*`
- Voucher get-all, adjust, cancel, mail, bulk, recurring
- Ledger create/update paths that use voucher version
- Receipt/sales/purchase-record services that call `addVoucherVersion`
- Inventory adjustment URLs that already hardcode `voucherVersion=2`

If unsure and path is under accounting voucher/ledger domain for this company → **pass `voucherVersion=2`**.

Symptom if forgotten on generate: `Entry date must be provided` / `INVALID_PARAMETERS`.

## Bootstrap masters (CreateAccountV2)

```
POST /v2/company/{C}/groups/sundrydebtors/accounts
POST /v2/company/{C}/groups/sundrycreditors/accounts
POST /company/{C}/stock-group
POST /company/{C}/stock-unit
POST /v2/company/{C}/stock-group/{group}/stock
```

Working customer/vendor bodies: `requests/20-create-customer.json`, `requests/21-create-vendor.json`.

Stock tip: create company stock-unit first (`pcs`); avoid `unitRates` until linked sales/purchase accounts are set correctly.

## Voucher generate

```
POST /v4/company/{C}/accounts/{party}/vouchers/generate?branchUniqueName={B}&voucherVersion=2
```

Templates:

| Type | Request file |
| --- | --- |
| Sales | `requests/30-create-sales-invoice.json` |
| Sales + stock | `requests/74-sales-with-stock.json` |
| Receipt + adjust | `requests/31-create-receipt.json` |
| Purchase | `requests/54b-purchase-with-number.json` (needs `number`) |
| Purchase + stock | `requests/76-purchase-with-stock.json` |
| Payment + adjust | `requests/33-create-payment.json` |
| Journal | `requests/94-journal-cash-sales.json` (path account ≠ particular) |
| Estimate | `POST /v3/.../estimates/generate` with **`type: sales`** — `requests/95-estimate-type-sales.json` |
| Proforma | `POST /v3/.../proformas/generate` with **`type: sales`** — `requests/102-proforma-type-sales.json` |
| Trial balance | `GET /v2/company/{c}/multibranch/trial-balance` |
| P&L / BS | `GET /v2/company/{c}/multibranch/profit-loss` · `.../balance-sheet` |
| Daybook | `POST /company/{c}/daybook?page&count&from&to&branchUniqueName` (body `{}`) |
| Invoice-list (adjust) | `POST /company/{c}/vouchers/invoice-list?voucherDate&adjustmentRequest=true&voucherVersion=2` |
| Cancel sales | `POST /company/{c}/invoices/{voucherUn}/action?voucherVersion=2` body `{action:"cancel"}` |
| Download PDF/base64 | `POST /company/{c}/download-file?voucherVersion=2&fileType=base64` body `{uniqueName, voucherType}` |
| Mail voucher | `POST /company/{c}/accounts/{party}/vouchers/mail?voucherVersion=2` |
| Ledgers-v2 create | `POST /company/{c}/accounts/{acct}/ledgers-v2?voucherVersion=2` |
| Bulk ledgers-v2 | `POST /company/{c}/accounts/{acct}/bulk-ledgers-v2` — body array of ledger entries; returns entry uniqueNames (`240`) |
| Magic link | `POST /company/{c}/accounts/{acct}/magic-link` — returns `{magicLink}` short URL (`233`) |
| Inv-adjust | Reasons `258`/`259`; create with `entity=STOCK`, stock uniqueName, **`expenseAccountUniqueName`** in `otherindirectexpenses` (`376`) |
| Address / branch / warehouse | `POST .../address` → `POST .../branch` → `POST .../warehouse` with `address:{uniqueName}` (`272`/`273`/`321`) |
| Tax create | `POST /company/{c}/tax` — assign: `POST /company/{c}/tax/assign` **array** body, Income/Expense only |
| Sales/purchase register | GET `.../sales-register-overview?interval=monthly` or POST `.../v2/sales-register-overview` |
| Stock unit mappings | `POST /company/{c}/stock-unit/mappings` body `[]` |
| Stock report | `POST .../stock-group/{g}/stock/{s}/report-v2?from&to...` |
| Estimates/proformas list | `POST .../vouchers/v3/estimates/all?from&to&page&count&branchUniqueName` body `{}` (`314`/`315`) |
| Estimate get / →invoice | Body **`estimateNumber`**: POST `v3/.../estimates`, `.../download`, `.../generate-via-estimate` (`373`/`357`/`358`) |
| Proforma →invoice | Body **`proformaNumber`**: `.../generate-via-proforma` (`360`) |
| Ledger list / update / delete | Merge **without** `voucherVersion` (`228`); `PUT ledgers/{un}` / `DELETE entries/{un}` (`230`/`310`) |
| Voucher status count | **POST** `.../voucher-status-count?type&voucherVersion=2` (`317`) |
| Templates | `GET .../templates?type=invoice` (`318`) |
| GSTR1 | Company GSTIN `23AAACC1206D2ZN` (`365`) |
| GSTR2 | `GET /v2/company/{c}/gstr2-summary?gstin&from&to` (`379`); transactions/export similarly |
| GSTR3B | `GET /v2/company/{c}/gstr3b?gstin&from&to` (`490`) — not `gstr3b-summary` |
| Reconcile | **POST** `.../accounts/{acct}/ledgers-v2/reconcile?from&to&chequeNumber=` (`405`) — GET 405 |
| Ledgers transactions | GET `.../ledgers/transactions?...` **with Content-Type: application/json** (`499`) |
| View / export statement | GET view-statement (`386`); export-account-statement is **POST** (`485`) |
| Branch-transfer generate | `POST .../branch-transfer/generate` with `entity`=`deliverynote`\|`receiptnote` (case-insensitive) (`478`–`481`) |
| Recipe | POST `.../stock/{s}/recipe` body `{manufacturingDetails:[...]}` (`417`); get POST `.../recipe/get` variant UN array (`494`) |
| Purchase order | `POST .../accounts/{vendor}/purchase-order/generate` (`427`); get/preview/pdf (`495`/`497`/`498`) |
| Dashboard graph | `GET /ui/graph-types` then `.../dashboard/graph?type=category&uniqueName=income\|expenses` or `type=voucher&uniqueName=payment\|receipt` (`399`/`521`–`524`) |
| Cancel e-invoice | Query `cnlRsn`/`cnlRem`; body `{uniqueName,voucherType}` (`482`) — needs IRN on voucher |
| Account search | GET `.../v3/account-search?q=` / `.../account-search-2?q=` (`511`/`512`) |
| Subscription | `GET /v2/subscription/{id}` (`394`); companies `GET .../subscription/{id}/company-list` (`486`); plans `GET /v2/subscription/plans/all?regionCode=IND` (`657`); payment-methods (`571`) |
| Make-recurring | Nested body `{startDate, repeatOption, frequency:{interval,unit}, repeatOn?, end}` (`536`); preview POST (`535`); list `?voucherType=sales` (`640`); status `STOP`/`RESUME`/`EXPIRE` (`701`) |
| Tax authority | POST/GET `/company/{c}/tax/authority`; PATCH `.../tax/authority/{un}` — IN state codes (`531`/`642`/`689`) |
| Pending DC/RN | POST `.../business-documents/pending-report` body `{reportType: WITHOUT_CHALLAN or NOT_INVOICED, documentType: DC or RC}` (`627`) |
| PO ops | Update PUT with full body (`633`); status PATCH `{action,purchaseNumber}` (`681`); bulk PATCH `?action=duedate` + `purchaseNumbers` (`683`); warehouse bulk needs `warehouseUniqueName` (`703`); pending-numbers POST (`628`) |
| Columnar | Account POST `.../accounts/{acct}/columnar-report` (`580`); group `.../export/account-balances-v2` needs `financialYear=APR-2026-MAR-2027` (`692`) |
| Discount assign | POST `.../customer-vendor-discount/stock/{stock}/assign-discount` (`563`) |
| Template preview | GET `.../v2/.../templates/{un}?type=invoice&voucherVersion=2` (`650`) |
| Inventory settings | GET/PUT `.../inventory-settings` — set `voucherAutomation.inventoryViaBusinessDocument=true` before DC/RN generate (`711`) |
| DC / RN generate | `POST .../delivery-challan/generate` · `.../receipt-note/generate` (`731`/`732`); list POST `.../all` (`733`/`734`) |
| DC/RN → invoice | `POST .../business-documents/convert` body `{uniqueNames:[dcOrRnUn]}` → sales/purchase (`802`/`806`) |
| Manufacturing entry | `POST /v2/.../stock/{stock}/manufacture` body **`{manufacturingDetails:[{...}]}`** (`848`); get `GET /v2/.../manufacture/{un}` (`853`) |
| Recipe | Slim UI POST `.../recipe`; verify with POST `.../recipe/get` variant UN array (`717`/`718`). Manufactured list: `stocks?isManufactured=true` |
| Users / roles | GET `.../users`, `.../shared-with`, `.../role`, `/scope-v2`; create role POST `.../role` (server uniqueName) (`748`) |
| Custom fields | POST `.../customfield` **array** body; module `ACCOUNT`; STRING max ≤150 (`902`/`906`) |
| Currency rate | `GET /currency/rate?from&to&date` · `GET .../currency-converter/{from}/{to}` (`759`/`760`) |
| Activity / audit | POST `.../v2/.../activity-logs` (`762`); POST `.../logs` v1 (`765`); v2 logs may 500 |
| Estimate/proforma versions | POST `.../v2/.../estimates\|proformas/versions/all` body `{estimateNumber}` / `{proformaNumber}` (`770`/`771`) |
| Email template | GET/PUT `/v2/company/{c}/communication/email-template/{voucherType}` with `html`+`subject` (`877`/`900`) |
| Pending recon / BD | POST `.../business-documents/pending-report` body `{reportType,documentType:DC\|RC}` (`908`–`911`); list `POST .../business-documents/all?documentType=DC` (`1031`); get/versions/history `GET .../business-documents/{un}` (`1065`–`1067`). DC/RN `/all` **without** `voucherVersion` (`1032`) |
| Salesperson | CRUD `.../salesperson` (`975`–`977`); archive `POST .../salesperson/{un}/archive` `{action,archiveOnly?}` (`978`/`1052`) |
| Billing | `GET /v2/subscription/billing-account/get?billingAccountUnqiueName=` (typo in param) (`996`); charge **POST** (`1048`); generate-order (`1080`) |
| Currency history | `GET /currency/rate?from&to&date=` per date (`959`/`1055`–`1057`); multicompany TB with `currencyCode=USD` works (`1076`) |
| Activity filters | POST activity-logs with `entity`/`operation`/`userUniqueNames` (`943`/`944`); audit form `GET /ui/auditlogs-form` (`945`) |
| Reverse charge | **POST** `.../reverse-charge-report?...` (`1039`) — GET returns invalid JSON error |
| GoCardless | institutions `countryCode=GB` (`1044`); `IN`/`US` invalid |
| Tags | POST/GET `.../tags` — response has **name/description only**, no uniqueName (`981`) |
| Bank PDF import | multipart + `pdfpassword` query (`1046`/`1072`) — stub still fails |
| FE backlog runner | `_fe_pending_runner.py` + `_fe_pending_remaining.json` (tags 1226+); **never** call `users/*/destroy-session` / wipe-sessions / `generate-auth-key` mid-batch |
| Account PATCH | Prefer **`PATCH /v2/company/{c}/accounts/{un}`** (`1131`) over full PUT (`1103` → 500) |
| Stock-group v5 | `POST /v5/company/{c}/stock-group` creates (`1173`); do not PUT a different `uniqueName` or you rename the group (`1160`) |
| Subscription list | **`POST /v2/subscription/list`** works (`1150`); buy/change need `durationType` |
| Billing account | PATCH `.../billing-account/{un}` OK (`1146`) in addition to GET |
| Projects | `GET .../project/all` (`1202`); detail/CRUD need real project UN |
| Communication | `generate-email` OK (`1192`); campaign/trigger need MSG91 platform |

Party path account = customer for sales/receipt, vendor for purchase/payment.  
Cash/bank particular sits in `entries[].transactions[0].account` (`cash`).  
Before adjusting, read `unadjustedAmount` from invoice-list — do not send grandTotal if already partially paid.

## UI ↔ API

- Explorer / docs: `docs/api/`, `tools/giddh-api-explorer`
- UI voucher client: `apps/web-giddh/src/app/services/voucher.service.ts` (`addVoucherVersion`)
- Accounting MS controller: `VoucherController` generate path same as UI `/v4/.../vouchers/generate`

## Client surfaces

- **Giddh Panel** = Angular app. **Customer Portal** / **Magic Link** = `Giddh-Ex-Portal`. **Giddh Website** = `Giddh-Website`.
- Tags in Explorer. Admin panel APIs are out of scope.
- Website login (Google + MSG91 OTP + 2FA): `WEBSITE-LOGIN-FLOWS.md` (`1630`–`1636`).
- Website signup → plan → trial/buy → company: `WEBSITE-SIGNUP-FLOWS.md` (`1640`–`1657`).
- Never automate `DELETE .../destroy-session` or logout against a **shared panel** session.
- Customer Portal **prod**: `CUSTOMER-PORTAL-PROD-FLOWS.md` (`1700`–`1745`). MSG91 proxy + portal Session-Id. Account switch UI uses **`save-session`** (new Session-Id); `portal-user/switch` does not. Logout last: `DELETE …/destroy-session` → 401 on reuse. `payment-methods` needs `voucherVersion=2`. Page count: `page=invoice|payments`.
- Apitest/testportal portal proxy still `INVALID_CF_IP` (`1540`).

## Predicted responses

Frontend-used Explorer records include `response.preparedSuccess` and `response.preparedErrors` (`source: backend-predicted`), built by `_predict_fe_responses.py` from handler throws and `messages.properties`. Predicted is not a live capture. A live `successExample` stays in the success panel. `liveVerified: true` is set only when a saved failure capture matches that predicted code and message. Report: `PREDICTED-RESPONSES.md`.

## Pair-debug

On failure: save full response JSON; compare to a working `requests/*` template; confirm `voucherVersion=2` and AmountDetails/date shape before changing business fields.
