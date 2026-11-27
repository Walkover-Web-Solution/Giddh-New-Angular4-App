# Status

**Plan:** Preparation brief (Pushpendra, 2026-10-23), as recorded in [VISION](docs/VISION.md#approved-development-direction), [DECISIONS](docs/DECISIONS.md), [EXPERIMENTS](docs/EXPERIMENTS.md) and [VERIFICATION](docs/VERIFICATION.md) · **Last updated:** 2026-11-27 · **Reviewed up to commit:** `8ea671e505`

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
| `npm run check:types` | Pass (2026-11-23) | CI and local |
| `npm run build` | Pass locally (2026-11-23); CI runs of 2026-10-31 | CI and local |
| `npm run check:browser` | Pass on CI runs of 2026-10-31 | CI and local |
| `npm run status:check` | Pass (2026-11-02) | CI ([workflow](.github/workflows/status-check.yml)) and local |

## Open questions

- Which document is the plan of record? This scorecard uses the brief as recorded in the repository docs because the brief itself is not checked in.
- Product direction, dependency baseline, test/lint replacement, active release pipeline, backend schemas, environment precedence, accessibility and experiment infrastructure: see [OPEN_QUESTIONS](docs/OPEN_QUESTIONS.md).

## Beyond the plan

Feature work merged after the brief, not scored against it:

| Item | Status | Notes |
| --- | --- | --- |
| Branch and warehouse sharing | 🟡 | Restored onto production from `giddh-2.0` (share-entity-modal, branch/warehouse/permission share UI) while keeping production Electron workflows, login token-verify/loginModels, and electron release docs/scripts. Company vs Branch mode uses companies-list `branchCount`; shared single accessible branch of a multi-branch company enters Branch mode. Permission Users list uses signals + OnPush. Not verified against a signed-in shared-branch user. |
| Manufacturing batch details in payload | 🟡 | `239b5631e6`. |
| Stock create/edit warehouse handling | 🟡 | `28f1a838f4`. |
| Financial report CSV organization address | 🟡 | `171cf5a36a`. |
| Ledger create-aside selections | 🟡 | `a6daf2902f`. |
| CSP HTTP header + frame-ancestors on web app | 🟡 | PHP CSP / X-Frame-Options in [postbuild.js](tools/web/postbuild.js); merged policy in [content-security-policy.js](tools/web/content-security-policy.js) + index meta (OTP/hCaptcha + CookieYes/Clarity/Facebook/OpenAI CDN). |
| Ledger and permissions route paths restored | 🟡 | `66a7606b04` fixed misspelled `leondger`/`permissis` paths in [app.routes.ts](apps/web-giddh/src/app/app.routes.ts). |
| Living status tracker and `status:check` | 🟡 | [Script](scripts/status-check.mjs) and focused tests pass; CI workflow not yet seen on a teammate's PR. |
| Inventory Job Work create/update/report | 🙈 | Code ships with production but is commented out until tested: Inventory sidebar entry, default-menus item, and lazy `job-work` route. Module stays independent (own service/API/models; shared BatchSelectDialog/BatchChipList only as consumers). Unrelated: e-Way Bill GST sub-supply label `job_work`, voucher Delivery Challan `JOBWORK` option already commented. Uncomment those three places to expose. Backend guarantees still unverified. |
| Estimate/Proforma on accounting voucher V2 | 🟡 | Voucher API v2 routes estimate/proforma through common invoice APIs with `type` (`estimates`/`proformas`): get-all, balances, create/update, download-file, action, delete, details, versions. V1 keeps dedicated proforma paths. PO still separate. Backend type/response support unverified. |
| Delivery Challan settings tab | 🟡 | Voucher API v2 Settings tab after Invoice in [voucher list](apps/web-giddh/src/app/vouchers/list/list.component.html): auto mail, auto WhatsApp (Giddh domain only, like Invoice), Custom Delivery Challan# (branch prefix / challan prefix / initial no.). `settingForm.deliveryChallanSettings` reads and writes `deliveryChallanSettings` in the same invoice-settings GET/PUT; tab hidden and field not sent when GET omits that object. V1 `app-invoice-setting` unchanged. Create page reads `deliveryChallanSettings.useCustomDeliveryChallanNumber` to unlock the voucher number field (typed on `InvoiceSetting`). Build passes; not exercised against a signed-in company. Cancel after a save keeps the saved values (store updated on save success). |
| Receipt Note settings tab | 🟡 | Voucher API v2 purchase Settings tab after Pur. Bill in [voucher list](apps/web-giddh/src/app/vouchers/list/list.component.html): auto mail, auto WhatsApp (Giddh domain only), Custom Receipt Note# (branch prefix / receipt note prefix / initial no.). `settingForm.receiptNoteSettings` reads and writes `receiptNoteSettings` in the same invoice-settings GET/PUT; tab hidden and field not sent when GET omits that object. Create page reads `receiptNoteSettings.useCustomReceiptNoteNumber` to unlock the voucher number field (typed on `InvoiceSetting`). Not exercised against a signed-in company. Cancel after a save keeps the saved values (store updated on save success). |
| Voucher list error responses | 🟡 | `e91fc17949`: last-vouchers, proforma/estimate and PO list stores stop reading `body` on error responses (special-character search). Not verified here. |
| Panel account search and report-comment API errors | 🟡 | Invoice/bill ([voucher.component.ts](apps/web-giddh/src/app/voucher/voucher.component.ts)), ledger and ledger entry panel show `ToasterService` error snackbar when account-search returns `status: error` (e.g. invalid HTML/script in `q`). Contact report-comment add/delete show the same. Command-K (`cmdk`) search shows API `message` on `INVALID_PARAMETERS` and similar errors. Not verified against production. |
| User details contact (email / mobile) | 🟡 | [User details](apps/web-giddh/src/app/subscription/subscription.
| User contact update replaces session | 🟡 | After a successful `POST users/{uniqueName}/contact` on [User details](apps/web-giddh/src/app/subscription/subscription.component.ts), the response `body.session` (`id`, `expiresAt`, `createdAt`) replaces the stored session via `LoginActions.UpdateUserContactSuccess` (also merges `email` / `contactNo` / `uniqueName` into the session user), so `Session-Id` on later calls and the header renewal check use the new session; the region session cookie is rewritten and the Session tab list reloads. Not exercised against a signed-in account. |component.html) Contact Details tab follows the sign-up verify pattern: email and mobile shown as read-only fields with **Change Email** / **Change Mobile** buttons (Add Mobile Number empty state kept). Changing a value → Send OTP → verify (MSG91) → **Save Changes** posts `users/{uniqueName}/contact`. Once the OTP is sent (and after it is verified) the field locks again and **Change Email** / **Change Mobile** stays directly beside the field, before the OTP box or the verified tick; clicking it discards that OTP/verification and unlocks the field; **Cancel** beside Save discards edits and OTP state. Locale keys `change_email` / `change_mobile` en/hi/mr. Not exercised against a signed-in account. |
| GST IMS invoice review | 🟡 | Sidebar **IMS** between GSTR-2 and E-way Bill → `/pages/gstfiling/ims`; **temporarily** shown only when the active company was created by an `INTERNAL_EMAILS_DOMAINS` email ([tax-sidebar](apps/web-giddh/src/app/shared/tax-sidebar/tax-sidebar.component.ts) `showImsMenu`, testing only; the route itself is not gated) ([ImsComponent](apps/web-giddh/src/app/gst/ims/ims.component.ts), [ImsService](apps/web-giddh/src/app/services/ims.service.ts), [Ims.ts](apps/web-giddh/src/app/models/api-models/Ims.ts)). Same layout as the GSTR-1/GSTR-2 filing pages (back link, icon, title with month picker, Authenticate/Authenticated button with the GSTR company/consolidated-branch, voucher v2 and Tax filing plan rules; summary count boxes (Total, Accepted, Rejected, Pending, No action) styled like the customer list, display only, with a separate **Status** dropdown (All / each status) that filters the list; `nofound` empty states). Gated on the existing GSP OTP session (reuses `gst-aside-menu`); month picker sends `monthYear` MM-yyyy; server pagination, bulk Accept/Reject/Pending/Reset via `save-ims` (`reset=true` for reset), ITC dialog (itcRedReq + remarks required on N) for ITC sections, single `save-ims` call that updates the saved rows' status and summary counts in place on success (no status polling), single `save-ims-status` call from History **Get status**, `ims-referenceIds` history aside, ITC disclaimer. Backend contract only from the IMS guide and Postman samples; not run against an API. No GSTVIEW/GSTFILING client gating (no client permission codes exist); GSTR-2B reconciliation, export and per-invoice history not built. See [CONTRACTS](docs/CONTRACTS.md#gst-ims) and [open questions](docs/OPEN_QUESTIONS.md). |
| Ledger entry in consolidated branch | 🟡 | `2d49a209e1` removed the go-to-branch banner and read-only blank entry in consolidated branch mode. Not verified here. |
| Contact / search group export errors | 🟡 | `3806e0eff9`, `5a84bf0188`: failed group export shows the API message (or generic error) instead of failing silently. Not verified here. |
| Subscription contact OTP after failed save | 🟡 | `7466c0fd50`: a failed contact save clears email/mobile OTP state so the user can correct and verify again. Not verified here. |

## Change log

- 2026-11-27 · Cursor agent · Hide Inventory Job Work by commenting sidebar, default menus, and route so production can ship code without user access · Inventory Job Work 🙈
- 2026-11-27 · Cursor agent · Production sync branch: restore `giddh-2.0` app/share UI onto production; keep production `.github/workflows`, `token-verify.component.ts`, `loginModels.ts`, electron release scripts/docs · Branch and warehouse sharing 🟡
- 2026-11-26 · Claude agent · Voucher create: Delivery Challan / Receipt Note number field follows their own Custom # setting instead of Custom Invoice#; `InvoiceSetting` gains optional `deliveryChallanSettings` / `receiptNoteSettings` types · Delivery Challan settings tab 🟡, Receipt Note settings tab 🟡
- 2026-11-26 · Claude agent · Contact update stores the new session (`id`, `expiresAt`) from the response, refreshes session cookie and Session tab · User contact update replaces session 🟡
- 2026-11-26 · Claude agent · User details contact: Change Email / Change Mobile also shown, directly beside the field, while an OTP is pending and after verification; field locks once the OTP is sent and Change discards that OTP; reviewed up to `c938657f61` · User details contact (email / mobile) 🟡
- 2026-11-26 · Cursor agent · Permission Users list: reactive fields → signals, entityOptions computed, OnPush · Branch and warehouse sharing 🟡
- 2026-11-25 · Cursor agent · Company-mode permission entity shown as small disabled dropdown (list + update); update preserves row entity · Branch and warehouse sharing 🟡
- 2026-11-25 · Cursor agent · Shared single branch: mode from companies-list `branchCount`; auto-enter Branch mode when only one branch is accessible on a multi-branch company · Branch and warehouse sharing 🟡
- 2026-11-25 · Claude agent · IMS sidebar menu temporarily limited to companies created by an `INTERNAL_EMAILS_DOMAINS` email (testing; remove later); reviewed up to `e6f6bd4cac` (`26b2d95577`, `9601a30fd4` already logged 2026-11-24) · GST IMS invoice review 🟡
- 2026-11-25 · Claude agent · User details contact: read-only email/mobile fields with Change Email / Change Mobile buttons (sign-up style) and Cancel beside Save Changes; reviewed up to `e6f6bd4cac` (`26b2d95577`, `9601a30fd4` already logged 2026-11-24) · User details contact (email / mobile) 🟡
- 2026-11-24 · Claude agent · Delivery Challan / Receipt Note settings: Cancel after Save no longer restores the pre-save values; the `UPDATE_INVOICE_SETTING_RESPONSE` reducer now stores `deliveryChallanSettings` and `receiptNoteSettings` like the other sections · Delivery Challan settings tab 🟡, Receipt Note settings tab 🟡
- 2026-11-24 · Cursor agent · Command-K `cmdk` search shows error snackbar when API returns `status: error` (e.g. `INVALID_PARAMETERS` for `<` in `q`) · Panel account search and report-comment API errors 🟡
- 2026-11-24 · Cursor agent · Panel account-search (invoice/bill, ledger, ledger entry) and report-comment add/delete show API `message` when `GiddhErrorHandler` returns `status: error` · Panel account search and report-comment API errors 🟡
- 2026-11-24 · Claude agent · IMS invoice list: IMS status column centred so its badge no longer touches the right-aligned Tax amount · GST IMS invoice review 🟡
- 2026-11-24 · Claude agent · IMS invoice list: removed the Sync column and its "Failed - Retry" button (and the unused sync locale keys); `syncState` stays in the client type · GST IMS invoice review 🟡
- 2026-11-24 · Claude agent · IMS: removed `save-ims-status` polling. Save calls `save-ims` once and updates row status and summary counts in place on success; History **Get status** calls `save-ims-status` once. Status is also read from `status_cd` directly on the response body (the shape seen on test), which previously looked "in progress" and kept polling · GST IMS invoice review 🟡
- 2026-11-24 · Claude agent · IMS Accept with ITC details dialog: title shows white on the blue header (removed `mat-dialog-title`, added close button like other GST dialogs) and Cancel/Accept no longer touch the Remarks field · GST IMS invoice review 🟡
- 2026-11-24 · Claude agent · IMS status filter: choosing **All** after a status filter now clears it (the "All" option had an empty value, which the dropdown re-created on reload treated as unchanged) · GST IMS invoice review 🟡
- 2026-11-24 · Claude agent · IMS summary: count table replaced by customer-list style count boxes (Total as a bordered white count box like the inventory Group Count, Accepted green, Rejected red, Pending orange, No action grey; not clickable) and a separate Status dropdown beside Invoice Details for filtering · GST IMS invoice review 🟡
- 2026-11-24 · Cursor agent · Command-K `cmdk` search shows error snackbar when API returns `status: error` (e.g. `INVALID_PARAMETERS` for `<` in `q`) · Panel account search and report-comment API errors 🟡
- 2026-11-24 · Cursor agent · Panel account-search (invoice/bill, ledger, ledger entry) and report-comment add/delete show API `message` when `GiddhErrorHandler` returns `status: error` · Panel account search and report-comment API errors 🟡
- 2026-11-23 · Claude agent · IMS page restyled to the GSTR-1/GSTR-2 filing layout: filing header with Authenticate button (GSTR gating), overall-summary table with count filters, GSTR empty states · GST IMS invoice review 🟡
- 2026-11-23 · Claude agent · GST IMS invoice review page and sidebar item (session gate, list/summary/filter, Accept/Reject/Pending/Reset, ITC dialog, status polling, history); IMS client contract and open questions recorded · GST IMS invoice review 🟡
- 2026-11-23 · Claude agent · Recorded teammate commits `2d49a209e1` (consolidated-branch ledger entry), `3806e0eff9`/`5a84bf0188` (group export error toast), `7466c0fd50` (contact OTP reset); reviewed up to `9c43124ff9` · tracker 🟡
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
- 2026-11-26: Lower chat launcher z-index below aside/dialog overlays so Select Batches Save/Cancel stays clickable · global styles · Vouchers/inventory batch pickers 🟡
- 2026-11-07: Added Job Work create batch support (finished inbound, raw outbound, scrap inbound) via shared BatchChipList / BatchSelectDialog when inventory batch management is enabled.
- 2026-11-07: Migrated Job Work create to Angular 21 (`inject`, `signal`/`computed`, `toSignal`, `DestroyRef`/`takeUntilDestroyed`).
- 2026-11-07: Aligned Job Work create layout with Manufacturing (same card/table/button patterns; dropped one-off valuation/table classes).
- 2026-11-06: Added Inventory > Job Work module (create, edit, list/report + supported actions), `JobWorkService`, locales, and sidebar entry. Commit baseline `c91a081f830c7a6317d5d2f7475f468a55bc050e`.
- 2026-11-02 · Cursor agent · Created STATUS.md, `npm run status:check` and its PR workflow · Initial scorecard; tracker 🟡
