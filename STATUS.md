# Status

**Plan:** Preparation brief (Pushpendra, 2026-10-23), as recorded in [VISION](docs/VISION.md#approved-development-direction), [DECISIONS](docs/DECISIONS.md), [EXPERIMENTS](docs/EXPERIMENTS.md) and [VERIFICATION](docs/VERIFICATION.md) · **Last updated:** 2026-11-24 · **Reviewed up to commit:** `d92de88b2d`

The brief's original text is not in this repository. Rows below score what the repository records of it. Keep "Reviewed up to commit" on a commit that exists on `giddh-2.0`; `npm run status:check` lists every code commit after it.

**Legend:** ✅ works for real people · 🟡 built, not proven · ⛔ blocked · ⬜ not started · 🙈 hidden · ❌ dropped

## At a glance

| Area | Status | Notes |
| --- | --- | --- |
| Agent map and docs | 🟡 | Built and link-checked on every PR; [MAINTENANCE](docs/MAINTENANCE.md) holds coverage map and weekly review through `9c43124ff9`. Fresh-agent handoff recorded; no human user has confirmed it. |
| Repository checks on PRs | ✅ | [CI](.github/workflows/ai-foundation.yml) runs on teammates' PRs: run 41200593676 caught real doc-link drift, and later runs passed. |
| Refactors for clearer responsibilities | 🟡 | Code and focused tests exist; no live accounting journey verified. |
| Preservation of behavior, permissions, contracts | 🟡 | Login screenshot compared; authenticated flows unverified. |
| Legacy `npm test` / `npm run lint` | ⛔ | No Angular test target; Nx executable absent. |
| UI experiments | ⛔ | Policy written; no assignment/exposure/rollback service exists. |
| Product direction (ICP, roadmap, measures) | ⛔ | Needs a product-owner decision; see [open questions](docs/OPEN_QUESTIONS.md). |

## Phases

| Phase | Status | Notes |
| --- | --- | --- |
| Preparation: agent map, checks, evidence-backed refactors | 🟡 | Merged on `giddh-2.0` (commits `d60d6e08d7` to `787df2a2f6`). Checks pass; journeys not proven live. |
| Product direction confirmation | ⛔ | The brief leaves ICP, markets, non-goals and success measures open; no approved brief found. |
| UI experimentation | ⛔ | Blocked on infrastructure listed in [EXPERIMENTS](docs/EXPERIMENTS.md). |

## Scope items

### Working model and agent map

| Item | Status | Notes |
| --- | --- | --- |
| One entry point, [AGENTS.md](AGENTS.md), with one subject per linked doc | 🟡 | All mapped docs exist; `npm run check:docs` passes. |
| Thin tool adapters point to the same map | 🟡 | [CLAUDE.md](CLAUDE.md) imports AGENTS.md; [.cursor/rules/agent-entry.mdc](.cursor/rules/agent-entry.mdc) links it. Separate Cursor/Claude sessions not launched. |
| Existing Angular/CSS rules kept intact | 🟡 | [Rules file](.cursor/rules/angular-giddh-coding-rules.mdc) present and referenced from AGENTS.md. |
| A fresh agent can trace a voucher/invoice from screen to API, permissions and checks | 🟡 | [FLOWS](docs/FLOWS.md) traces voucher save to `VoucherService` and `SALES_API_V4`; handoff recorded in [VERIFICATION](docs/VERIFICATION.md#limits-and-handoff), not reproduced here. |
| Humans supply vision, problems, priorities and feedback | ⬜ | No ranked problems or roadmap in the repository. |

### Priorities

| Item | Status | Notes |
| --- | --- | --- |
| Clearer responsibilities | 🟡 | Select-all helper ([selected-all.ts](apps/web-giddh/src/app/shared/helpers/selected-all.ts)), report traversal, inventory adjustment, voucher delegation, HTTP finalizer, [permission state](apps/web-giddh/src/app/permissions/permission-data.service.ts), triggers and IPC lists. See [REVIEW](docs/REVIEW.md#refactors-made). Covered by [focused tests](scripts/tests). |
| Evidence-backed cleanup | 🟡 | Only unreachable reducer cases removed; no feature, dependency or asset deleted. |
| Recoverable changes | 🟡 | Small-commit and revert guidance in [DEVELOPMENT](docs/DEVELOPMENT.md#release-and-recovery); no production rollback exercised. |
| Trustworthy map | 🟡 | Docs link-checked; this STATUS.md and `status:check` keep progress current. |

### Preservation boundaries

| Item | Status | Notes |
| --- | --- | --- |
| Appearance | 🟡 | Login screenshot compared before and after refactors; other screens not certified. |
| Behavior and API contracts | 🟡 | Focused tests characterize request verbs, URLs and payloads; no backend verification. |
| Permissions | 🟡 | 192 transition comparison recorded; retained finding on stale scopes in [REVIEW](docs/REVIEW.md#existing-findings-retained-for-focused-follow-up). |
| Analytics, saved preferences, SEO | 🟡 | No templates, persisted shapes, tags or SEO markup changed by the preparation; not verified in a live session. |

### Verification

| Item | Status | Notes |
| --- | --- | --- |
| Docs and focused regression tests (`check:ai`) | ✅ | Run on every PR by CI and by developers; passes. |
| Whole-app type check and local build | 🟡 | `check:types` passes here; build and CI passes recorded. |
| Fixture browser checks | 🟡 | Six login/redirect checks in CI with external requests blocked; fixtures, not real authentication. |
| Legacy `npm test` / `npm run lint` | ⛔ | Missing Angular test target and Nx executable; replacement setup undecided. |
| Electron main-process and renderer compile | 🟡 | Recorded as passing; packaged desktop app not launched. |

### Out of scope for the brief

| Item | Status | Notes |
| --- | --- | --- |
| Framework migrations | ❌ | Excluded by the brief. |
| Redesigns | ❌ | Excluded by the brief. |
| Launching experiments | ❌ | Excluded by the brief; policy only. |

## Must-pass tests

| Command | Last result | Where it runs |
| --- | --- | --- |
| `npm run check:ai` | Pass (2026-11-02) | CI and local |
| `npm run check:types` | Pass (2026-11-02) | CI and local |
| `npm run build` | Pass on CI runs of 2026-10-31 | CI and local |
| `npm run check:browser` | Pass on CI runs of 2026-10-31 | CI and local |
| `npm run status:check` | Pass (2026-11-02) | CI ([workflow](.github/workflows/status-check.yml)) and local |

## Open questions

- Which document is the plan of record? This scorecard uses the brief as recorded in the repository docs because the brief itself is not checked in.
- Product direction, dependency baseline, test/lint replacement, active release pipeline, backend schemas, environment precedence, accessibility and experiment infrastructure: see [OPEN_QUESTIONS](docs/OPEN_QUESTIONS.md).

## Beyond the plan

Feature work merged after the brief, not scored against it:

| Item | Status | Notes |
| --- | --- | --- |
| Branch and warehouse sharing | 🟡 | `a4c4c94613`; not verified here. |
| Manufacturing batch details in payload | 🟡 | `239b5631e6`. |
| Stock create/edit warehouse handling | 🟡 | `28f1a838f4`. |
| Financial report CSV organization address | 🟡 | `171cf5a36a`. |
| Ledger create-aside selections | 🟡 | `a6daf2902f`. |
| CSP HTTP header + frame-ancestors on web app | 🟡 | PHP CSP / X-Frame-Options in [postbuild.js](tools/web/postbuild.js); merged policy in [content-security-policy.js](tools/web/content-security-policy.js) + index meta (OTP/hCaptcha + CookieYes/Clarity/Facebook/OpenAI CDN). |
| Ledger and permissions route paths restored | 🟡 | `66a7606b04` fixed misspelled `leondger`/`permissis` paths in [app.routes.ts](apps/web-giddh/src/app/app.routes.ts). |
| Living status tracker and `status:check` | 🟡 | [Script](scripts/status-check.mjs) and focused tests pass; CI workflow not yet seen on a teammate's PR. |
| Inventory Job Work create/update/report | 🟡 | Client wired to `v2/.../job-work-orders`. Stock search reuses Manufacturing `stocks/v2` once for default finished/raw/scrap options (per-field search still separate). Account-search-v2 groups: jobworker `sundrycreditors,sundrydebtors`; expense from/to match Manufacturing. Batch tracking via BatchChipList / BatchSelectDialog when batch management is enabled. Edit View maps GET `documentItems`/`jobWorkDetails`. Create Delivery Challan No. uses pending-report DC list by jobworker. Create header uses date-range picker (start → date/challanDate, end → expectedReturnDate) like list; universal date only seeds that local range, and pending DC / other create calls use the local range. Job Work Type dropdown offers Send and Receive. List has column search, Advance Filter (warehouse/jobworker/stock multi-select with All option + overdue/ITC toggles), filter restore, company/consolidated branch dropdown + `go-to-branch`, totals from parallel `job-work-orders/summary`, status filter Open / Dispatched / Partially Returned / Completed / Cancelled (+ All), status badges including DISPATCHED, GSTIN validation, and `mobile-number-input`. Create Delivery Challan No. is multi-select (`deliveryChallanUniqueNames`). Create payload includes `stockUnitUniqueName`. Record Return / Mark Scrap / Make Adjustment open action dialogs with checkboxes, combined Stock+Variant, clickable batch chips, and outlined qty inputs then post action. View Linked Challan table matches Return (Item Stock+Variant, clickable batch chips, qty with unit, Rate/Amount). Export / Revert / Preview UI deferred. Backend guarantees still unverified. |
| Estimate/Proforma on accounting voucher V2 | 🟡 | Voucher API v2 routes estimate/proforma through common invoice APIs with `type` (`estimates`/`proformas`): get-all, balances, create/update, download-file, action, delete, details, versions. V1 keeps dedicated proforma paths. PO still separate. Backend type/response support unverified. |
| Delivery Challan settings tab | 🟡 | Voucher API v2 Settings tab after Invoice in [voucher list](apps/web-giddh/src/app/vouchers/list/list.component.html): auto mail, auto WhatsApp (Giddh domain only, like Invoice), Custom Delivery Challan# (branch prefix / challan prefix / initial no.). `settingForm.deliveryChallanSettings` reads and writes `deliveryChallanSettings` in the same invoice-settings GET/PUT; tab hidden and field not sent when GET omits that object. V1 `app-invoice-setting` unchanged. Build passes; not exercised against a signed-in company. |
| Receipt Note settings tab | 🟡 | Voucher API v2 purchase Settings tab after Pur. Bill in [voucher list](apps/web-giddh/src/app/vouchers/list/list.component.html): auto mail, auto WhatsApp (Giddh domain only), Custom Receipt Note# (branch prefix / receipt note prefix / initial no.). `settingForm.receiptNoteSettings` reads and writes `receiptNoteSettings` in the same invoice-settings GET/PUT; tab hidden and field not sent when GET omits that object. Not exercised against a signed-in company. |
| Voucher list error responses | 🟡 | `e91fc17949`: last-vouchers, proforma/estimate and PO list stores stop reading `body` on error responses (special-character search). Not verified here. |
| Panel account search and report-comment API errors | 🟡 | Invoice/bill ([voucher.component.ts](apps/web-giddh/src/app/voucher/voucher.component.ts)), ledger and ledger entry panel show `ToasterService` error snackbar when account-search returns `status: error` (e.g. invalid HTML/script in `q`). Contact report-comment add/delete show the same. Not verified against production. |

## Change log

- 2026-11-24 · Cursor agent · Panel account-search (invoice/bill, ledger, ledger entry) and report-comment add/delete show API `message` when `GiddhErrorHandler` returns `status: error` · Panel account search and report-comment API errors 🟡
- 2026-11-23 · Cursor agent (docs maintenance) · Confirmed `giddh-2.0` unchanged since `9c43124ff9`; fixed MAINTENANCE coverage-map columns for Security, Performance, and Measurement · Agent map and docs 🟡
- 2026-11-22 · Cursor agent (docs maintenance) · FLOWS §2 branch-tab gate matches `showAllBranches` (`branchCount > 1` and `unarchivedBranchCount >= 1`); fix MAINTENANCE coverage table Infrastructure row · Agent map and docs 🟡
- 2026-11-22 · Cursor agent (docs maintenance) · Added [docs/MAINTENANCE.md](docs/MAINTENANCE.md), AGENTS task row, FLOWS §2 branch-tab timing; reviewed `giddh-2.0` through `9c43124ff9` · Agent map and docs  🟡
- 2026-11-22 · Cursor agent (docs maintenance) · Recorded `5298e5a7a3` company picker Branch tab after branch list load; `2d49a209e1` ledger create entry in consolidated branch · Company/branch UI 🟡
- 2026-11-21 · Claude agent · Subscription contact: "Registered Mobile Number (with country code)" label on one line when a mobile number exists; stays on two lines in the empty state · Subscription UI
- 2026-11-21 · Claude agent · Removed the email template editor row. The fix and its test were reverted in `2b6237d785`, but the merge in #17201 brought the row back. The editor's Backspace and paste-marker bug is open again · editor ⬜
- 2026-11-20 · Claude agent · Subscription contact: mobile number format hint spans both grid columns (one line) unless the OTP hint occupies column 2 · Subscription UI
- 2026-11-20 · Claude agent · User details contact: empty state for no mobile number (dashed box + Add Mobile Number → existing edit/OTP flow); round envelope/mobile icons before email and mobile (shown in view and edit), "(with country code)" on its own line; new `mobile_number` locale keys en/hi/mr · Subscription UI
- 2026-11-20 · Claude agent · User details email note (`email_auth_key_note`, en/hi/mr): changing email invalidates the existing Auth-Key; generate a new one · Subscription UI
- 2026-11-19 · Claude · Delivery Challan settings tab icon uses thin icon-font glyph `icon-share` (tray with outgoing arrow), like General / Email / Estimate / Proforma · Delivery Challan settings tab 🟡
- 2026-11-19 · Claude · Receipt Note settings tab icon uses thin icon-font glyph `icon-download1` (tray with down arrow), like Integration / Pur. Order · Receipt Note settings tab 🟡
- 2026-11-19 · Claude · Receipt Note settings tab (auto mail, WhatsApp, custom number) via `receiptNoteSettings` · Receipt Note settings tab 🟡
- 2026-11-19 · Claude · Delivery Challan settings tab (auto mail, WhatsApp, custom number) via `deliveryChallanSettings` · Delivery Challan settings tab 🟡
- 2026-11-19 · Claude · Recorded teammate commit `e91fc17949` voucher list error handling; reviewed up to `a29ff51e50` · Voucher list error responses 🟡
- 2026-11-17 · Cursor agent · Job Work Goods with Jobworker total also shows company currency · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work expense total right-aligned with company currency via amount-field · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work list totals from parallel `job-work-orders/summary` (same payload as list) · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work column search matches voucher list FormControls; shared `q`, clears siblings · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work list column searches share single `q`; typing one clears the other boxes · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work Advance Filter All uses selectAllFields (empty arrays + field names) · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work Advance Filter multi-selects support All; All maps to empty API filters · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work Advance Filter warehouse/jobworker/stock multi-select; create DC multi-select as deliveryChallanUniqueNames · Job Work 🟡
- 2026-11-17 · Cursor agent · Resolved STATUS.md merge conflict; Job Work list status filter includes Open · Job Work 🟡
- 2026-11-17 · Cursor agent · Slim Job Work action-dialog SCSS; theme vars only, padding/border via utilities · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work action dialog + list helpers: short var docs, public/private + JSDoc on methods · Job Work 🟡
- 2026-11-17 · Cursor agent · View Linked Challan shows Rate and Amount columns again · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work Return/Scrap/Linked Challan batch dialog uses fixedBatches (document batches only) · Job Work 🟡
- 2026-11-17 · Cursor agent · View Linked Challan keeps mat-table; look matches Return (item/batch/qty, no Rate/Amount) · Job Work 🟡
- 2026-11-17 · Cursor agent · Return dialog drops Rate/Amount; Scrap drops Rate/Amount/Scrap Retained By · Job Work 🟡
- 2026-11-17 · Cursor agent · Fix Return Qty unit suffix overlap (drop text-right on qty input) · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work action dialog table headers black/bold no fill; qty input shows unit suffix · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work Return/Scrap: row checkboxes, combined Stock+Variant, clickable batch chips · Job Work 🟡
- 2026-11-17 · Cursor agent · Restore outlined input-field (Return Qty / Amount / ITC) in Job Work action dialogs; mark-return was input hint only · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work action dialogs match Linked Challan table (bordered grey header, Type/Stock/Variant/Batch/Qty/Rate/Amount) · Job Work 🟡
- 2026-11-17 · Cursor agent · Replace mat-table in Job Work action dialog with plain HTML table so columns align and height fits content · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work RETURN dialog shows and posts both OUTPUT and INPUT lines · Job Work 🟡
- 2026-11-17 · Cursor agent · Polish Job Work action dialog layout (compact card, no float labels in table, visible Cancel/Save) · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work list Return / Scrap / Adjust open action dialogs (OUTPUT / scrap / expense) instead of confirm-only · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work list status filter: Open / Dispatched / Partially Returned / Completed / Cancelled · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work list column search icon uses cursor-pointer · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work create APIs use local date range; universal date only seeds initial values · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work Type dropdown offers Send and Receive on create · Job Work 🟡
- 2026-11-17 · Cursor agent · Job Work create uses date-range picker for date/challan/expected return · Job Work 🟡
- 2026-11-17 · Cursor agent · Resolved STATUS.md after pull from `giddh-2.0`; kept email-template editor row with Job Work and Estimate/Proforma · tracker 🟡
- 2026-11-16 · Job Work create account/stock search · Match Manufacturing from/to account groups; jobworker `sundrycreditors,sundrydebtors`; one default stocks/v2 shared across finished/raw/scrap · Job Work 🟡
- 2026-11-16 · Job Work list actions keep order GET · Return / Scrap / Adjust reload order GET; list API cannot carry all action keys · Job Work 🟡
- 2026-11-16 · Estimate/Proforma voucher V2 common APIs · Route list/create/update/download/action/delete/details onto invoice voucher APIs with `type`; keep V1 proforma paths · Estimate/Proforma V2 🟡
- 2026-11-13 · Resolve CSP merge conflict · Merge OTP/hCaptcha allowlist with CookieYes/Clarity/Facebook/OpenAI CDN · CSP 🟡
- 2026-11-12 · Allow MSG91 phone utils in CSP · Add cdnjs.cloudflare.com + *.msg91.com so OTP mobile validation works · CSP 🟡
- 2026-11-12 · Allow hCaptcha in CSP · MSG91 OTP login needs hcaptcha.com in script/style/frame-src · CSP 🟡
- 2026-11-12 · Restore CSP HTTP headers · Re-add PHP CSP + X-Frame-Options in postbuild for VAPT Clickjacking/CSP open items · CSP 🟡
- 2026-11-12 · Delivery Challan No. dropdown · Pending DC list from `business-documents/pending-report` by jobworker · Job Work 🟡
- 2026-11-12 · Keep Job Work list Action column in company/consolidated mode · Job Work 🟡
- 2026-11-12 · Fix Job Work create company-mode check · Match Manufacturing create: not Branch + branches length >= 2 · Job Work 🟡
- 2026-11-12 · Clear filters keeps selected branch · Do not reset branch dropdown to company/options[0] · Job Work 🟡
- 2026-11-12 · Keep filled column search boxes open when toggling another search icon · Job Work 🟡
- 2026-11-12 · Show Job Work list paginator only when totalItems > pageSizeOptions[0] · Job Work 🟡
- 2026-11-12 · Hide Job Work list Action column in company/consolidated mode · Job Work 🟡
- 2026-11-12 · Job Work list branch dropdown · Company/consolidated mode branch filter like Manufacturing report · Job Work 🟡
- 2026-11-12 · Fix Job Work list company-mode check · Match Manufacturing: Company org + branches length > 2 · Job Work 🟡
- 2026-11-12 · Trim Job Work SCSS · Drop utility-duplicated styles; keep feature-only rules · Job Work 🟡
- 2026-11-12 · View Linked Challan mat-table · Keep meta as grid; convert documentItems only to mat-table · Job Work 🟡
- 2026-11-12 · Record Return confirm copy · Use question text instead of menu label in confirmation dialog · Job Work 🟡
- 2026-11-12 · Fix Make Adjustment action payload · GET order then map expenses + increaseAssetValue/claimItc into ADJUST · Job Work 🟡
- 2026-11-12 · Fix Mark Scrap action payload · GET order then map SCRAP/`jobWorkDetails.scraps` + warehouse into MARK_SCRAP · Job Work 🟡
- 2026-11-12 · View Linked Challan polish · Remove header cross; keep Close button · Job Work 🟡
- 2026-11-12 · Polish View Linked Challan dialog · Compact meta grid, status badge, auto-height body, bordered items table · Job Work 🟡
- 2026-11-12 · View Linked Challan UI · Replace raw JSON dump with challan header + documentItems table from GET body array · Job Work 🟡
- 2026-11-12 · Fix Record Return action payload · GET order then map `documentItems` OUTPUT/INPUT (stock/variant/qty/batches) + warehouse into RETURN · Job Work 🟡
- 2026-11-11 · Cherry-pick Job Work onto test · Inventory Job Work create/list/report + batch support; STATUS folded into Beyond the plan · Job Work 🟡
- 2026-11-11: Prod readiness pass — preserve edit stock/unit options after search, send `stockUnitUniqueName`, tighten GSTIN/date/warehouse validation, restore list filters without date overwrite, bind list to `body.items`, scrap rate/unit seeding, mobile-number-input on create.
- 2026-11-07: Added Job Work create batch support (finished inbound, raw outbound, scrap inbound) via shared BatchChipList / BatchSelectDialog when inventory batch management is enabled.
- 2026-11-07: Migrated Job Work create to Angular 21 (`inject`, `signal`/`computed`, `toSignal`, `DestroyRef`/`takeUntilDestroyed`).
- 2026-11-07: Aligned Job Work create layout with Manufacturing (same card/table/button patterns; dropped one-off valuation/table classes).
- 2026-11-06: Added Inventory > Job Work module (create, edit, list/report + supported actions), `JobWorkService`, locales, and sidebar entry. Commit baseline `c91a081f830c7a6317d5d2f7475f468a55bc050e`.
- 2026-11-02 · Cursor agent · Created STATUS.md, `npm run status:check` and its PR workflow · Initial scorecard; tracker 🟡
