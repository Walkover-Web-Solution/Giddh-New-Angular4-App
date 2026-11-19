# Session handoff — pause 2026-10-28 (resume tomorrow)

## Resume tomorrow — quick checklist

| Done | Item |
| --- | --- |
| ✅ | **720/720** production v2 params on DocStar **Giddh API Draft_1** (`83427` / `-Jey39dCAAyx`) + **publish_pages** |
| ✅ | Explorer/catalog enriched (`catalog_production_rules.py`, `get-all` / `get-all-vouchers-balances` query vs body) |
| ⏳ | **Proforma + Estimation guides** — markdown in `docstar-guide-pages/`; publish needs **DocStar MCP sign-in** (403 JWT without it) |
| ⏳ | **Sidebar regroup** — `DOCSTAR-GUIDES-AND-GROUPING.md`, `_plan_docstar_sidebar_regroup.py` |
| ⏳ | **Live prod smoke** — `secrets.local.json` → `userSharedLive` (`nvlogiin165868912755901st49`, branch `goa`); captures: company, get-all, get-all-vouchers-balances |

**DocStar lookup example:** `…/accounts/sales/ledgers/merge` → **Retrieve Ledgers** (`POST`, id `Z5ECSZ0hYb7h`, under **Account**).

**Say in chat:** “Continue from SESSION-HANDOFF” + DocStar signed in if publishing guides.

---

## DocStar Giddh API Draft_1 — query/body param docs (2026-10-28)

**Production v2 param reapply complete (2026-10-28).** Org `83427`, collection `-Jey39dCAAyx`: **720/720** MCP `update_endpoint` + **`publish_pages`**. Summaries: `docstar-param-reapply-summary.json`, `docstar-param-doc-upload-summary.json`; progress `.docstar-param-reapply-v2.mcp.json` (`nextIndex` 720). Catalog rules: `docs/api/coverage/catalog_production_rules.py`; regenerate patches via `_enrich_catalog_parameter_docs.py` + `_build_docstar_param_patches.py`. Agent loop: `_docstar_param_mcp_agent_instructions.md` (orchestrator: `_docstar_param_mcp_reapply_orchestrator.mjs`).

**Next (after param reapply):**

1. **Guides** — `docstar-guide-pages/proforma.md` + `estimation.md` ready; run `node _apply_docstar_guides.mjs`, then DocStar MCP signed in: `PUT /orgs/83427/pages/{0M0j2julTA_A|qpclmChA8TAL}` with `{ "contents": "<md>" }` + `publish_pages` (root `u9XDYe5Zc_ds`). `call_any_api_of_docstar` returns **403 Invalid JWT** until sign-in.
2. **Sidebar regroup** — `DOCSTAR-GUIDES-AND-GROUPING.md` + `_plan_docstar_sidebar_regroup.py` (not applied on DocStar yet).
3. **Live smoke (read-only)** — `userSharedLive` in `secrets.local.json` (`nvlogiin…` / branch `goa`): verified `get-all` + `get-all-vouchers-balances` on prod; captures under `requests/` / `responses/`.

**Paused for shutdown.** Docstar client docs are a private draft only. Full resume steps: `DOCSTAR-DRAFT-HANDOFF.md`.

- Live https://giddh.com/api was **not** changed (org `11326` collection `MzcxumU2s93K` is SSO; writes return “Write operations are not allowed for users in SSO organizations”).
- Private draft collection **Giddh API Draft** `Qu2nsC5BQofh` in org `12427` (404119-dvking). `isPublic: false`. About **37** endpoints, all `state` 1, not published.
- Payload source: `docstar-draft-payloads.json` (678 frontend endpoints: 72 matched updates + 606 creates). Builder: `_build_docstar_drafts.py`.
- Do not import a second collection (`SSO_SINGLE_COLLECTION_RESTRICTION`). Do not publish. Do not send `t`, `z`, or `lang`.
- One-by-one MCP creates work; four parallel upload slices stalled after a handful. `/tmp/docstar-slices` will not survive reboot — regenerate from the JSON in this folder.

**Customer Portal prod (`10k`):** captures `1700`–`1745` — see `CUSTOMER-PORTAL-PROD-FLOWS.md`. Session destroyed (`1744`); re-`save-session` before more portal calls. Apitest portal still `INVALID_CF_IP`.

**Customer Portal prod (`10k`):** captures `1700`–`1745` — see `CUSTOMER-PORTAL-PROD-FLOWS.md`. Session destroyed (`1744`); re-`save-session` before more portal calls. Apitest portal still `INVALID_CF_IP`.

## Auth — OK (Session-Id refreshed 2026-10-23; Auth-Key primary)

Permanent **Auth-Key** in `secrets.local.json` (gitignored) remains primary for long capture runs. Session-Id was refreshed on **2026-10-23** (redacted `in3f3af1********HbI=`); use for short UI-aligned calls when needed.

Auth-Key redacted: `dNYPuoiWrFz********go=`

Verified: `GET /company/{c}` → 200 success (both headers).

## Masters restored — OK

| Master | Status |
| --- | --- |
| Stock group `apidoc-products` | Restored from `apidoc-temp-sg-342` (PUT rename undo) |
| Customer `apidoc-customer-one` | Back under `sundrydebtors` (parentGroups includes it) |

## FE-pending backlog — COMPLETE (attempted)

| Metric | Value |
| --- | --- |
| This resume (tags **1226–1421**) attempted | **196** FE-used pending |
| This resume success (HTTP 2xx + status success) | **63** |
| This resume fail / soft-fail | **133** |
| Prior batch 1100–1225 | 125 attempted / 24 success (then session killed) |
| FE-used unique attempted | **~636 / 636 (~100%)** |
| Remaining FE-used pending | **0** (`_fe_pending_remaining.json` emptied) |
| Soft success across FE batches | **~87** (many remaining need real bodies/integrations) |

Runner: `_fe_pending_runner.py` (Auth-Key headers + session-killer blacklist).  
Logs: `CALL-LOG-FE-PENDING.json` · `CALL-LOG-2026-10-23.json` · `_fe_pending_run_authkey.log`

### Collateral deletes this run (recreate if needed)

- Role `aft1792738829523` — `1346`
- Tax authority `apidoctaxauthoritymp` — `1350`
- Custom field `1792758792191n1ficygh8s7bfds` — `1295`
- Customer-vendor-discount assignment — `1294`

### Notable successes (1226+)

- Groups: masters, shared-with, download closing-balance, PUT group
- Stock: unit PUT, inventory-report, v2 aging totals/details/variants, stock details, variant PATCH
- Imports: reconciliation GET, signed-url
- VAT reports: UK / Kenya / ZW GET paths; company PATCH; address/all
- Advance-receipt get-all/summary; GoCardless refresh; inventory balance
- Settings/plan/purchase-bill-setting; warehouse PATCH/PUT/default
- Country + cities; white-label; GSTR1 download; save GSTR3B
- Sales/purchase register detailed; multibranch BS/PL downloads; inventory hierarchy download

## Absolute rules

1. Every API call → save **request + response (success AND fail)** under this folder.
2. Accounting MS → always `voucherVersion=2` (except documented exceptions e.g. DC/RN `/all`).
3. curl + browser User-Agent (not Python urllib).
4. Secrets only in `secrets.local.json` (gitignored). Prefer **Auth-Key**.
5. Wire real success JSON into Explorer catalog when working an endpoint.
6. **Never call** destroy-session, logout, revoke-token, wipe-sessions, generate-auth-key, DELETE/GET users/*/sessions, increment-session during capture batches.

## Company

| Field | Value |
| --- | --- |
| Name | Giddh Automation API DOC |
| uniqueName | `giddhain1792673422178091xos` |
| branch | `giddhautomationapidoc` (+ `apidocbranchtwo`) |
| warehouse | `xbq1792673424418` (+ `4gr1792733898078`) |
| GSTIN | `23AAACC1206D2ZN` (default address) |
| FY | 01-04-2026 → 31-03-2027 |
| baseUrl | `https://api.giddh.com` |
| UI | `https://test.giddh.com` |
| Auth | **Auth-Key** primary (redacted `dNYPuoiWrFz********go=`); Session-Id refreshed 2026-10-23 (`in3f3af1********HbI=`) |
| billingAccount | `k2b1712141952375` |
| salesperson | `apidocsalesperson` |

## Explorer catalog — refreshed from live captures (2026-10-23)

Both catalogs patched from `responses/*.json` + `CALL-LOG*.json`:

- `tools/giddh-api-explorer/public/data/catalog.json`
- `docs/api/coverage/catalog.json`

| Metric | Count |
| --- | ---: |
| Records patched (any) | **693** |
| Success examples set | **379** |
| Error examples merged | **402** |
| Captures matched / unmatched | 1275 / 81 |

Report: `EXPLORER-CATALOG-PATCH-REPORT.md` · Script: `_patch_explorer_catalog_from_captures.py`  
Local Explorer: hard-refresh after `npm start` in `tools/giddh-api-explorer` (or `npm run sync` then hard-refresh — sync now preserves `liveCapture` / error `when`).

## Next work (priority)

1. Recreate deleted role / tax authority / custom field if later tests need them.
2. Re-probe soft-fails with richer bodies (batch/EWB/HMRC/PayPal/Razorpay/OCR/import multipart).
3. Company invite/share path still unknown (404/405).
4. Invoice template **create** (`copyFrom` still 500 on apitest).
5. Postman chaining; admin/portal repos when available. Optional: rematch 81 unmatched captures / 71 orphan response files.

## Do not

- Deploy Embarko unless asked
- Commit secrets / print full Auth-Key
- Call accounting voucher APIs without `voucherVersion=2`
- Call DC/RN generate without `inventoryViaBusinessDocument=true`
- Send flat manufacturing create body (must nest `manufacturingDetails`)
- Pass `voucherVersion=2` on DC/RN **`/all`** list (causes 404)
- Call **session-killers** during capture batches
- PUT stock-group / account with a **new uniqueName** unless intentionally renaming
