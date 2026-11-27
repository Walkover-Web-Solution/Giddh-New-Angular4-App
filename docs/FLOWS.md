# Important journeys

**Observed:** source trace at `970543b` on 2026-10-23. These describe implemented paths, not proof that a live backend or packaged desktop build passes them. Runtime evidence and gaps belong in [DEVELOPMENT](DEVELOPMENT.md); shared API and permission rules belong in [CONTRACTS](CONTRACTS.md).

## 1. Sign in and return to work

1. `/login` loads the login feature through [app.routes.ts](../apps/web-giddh/src/app/app.routes.ts). Password, OTP and Google requests go through [AuthenticationService](../apps/web-giddh/src/app/services/authentication.service.ts) and [LOGIN_API](../apps/web-giddh/src/app/services/apiurls/login.api.ts).
2. [LoginActions](../apps/web-giddh/src/app/actions/login.action.ts) handles responses. A two-way-auth response requires the OTP step; a verified login continues to `loginSuccess$`.
3. `loginSuccess$` fetches company list and saved state. `finalThingTodo` loads the company user, sets logged-in state and prefers `returnUrl`, then the recent saved page or home.
4. With no companies, the user goes to subscriptions or buy-plan according to `hasSubscriptionPermission`. [NeedsAuthentication](../apps/web-giddh/src/app/decorators/needsAuthentication.ts) sends signed-out users to login with a return URL.

**Failure/recovery:** login and OTP errors display their API message. An invalid/expired session dispatches logout; the user signs in again. Desktop Google login crosses `authenticate` → `take-your-gmail-token` in the [main process](../apps/electron-giddh/src/index.ts) and [preload](../apps/electron-giddh/src/preload.js). Exercise that path separately from browser login.

### Partner Google login / signup (bridge token)

When `/login` or `/signup` is opened with `?redirect_url=<absolute-https-url>`:

1. [LoginComponent](../apps/web-giddh/src/app/login/login.component.ts) / [SignupComponent](../apps/web-giddh/src/app/signup/signup.component.ts) read `redirect_url` from the query and pass it with the Google access token.
2. Google still yields an access token in the UI (GIS or Electron OAuth).
3. [AuthenticationService.LoginWithGoogle](../apps/web-giddh/src/app/services/authentication.service.ts) uses the existing `GET v2/signup-with-google` with `Access-Token`, appending `?redirect_url=` when partner mode is active.
4. On success with `{ refresh_token, redirect_url }` (no session), [LoginActions.signupWithGoogleResponse](../apps/web-giddh/src/app/actions/login.action.ts) navigates to the response `redirect_url` with `refresh_token` in the query via `buildPartnerRedirectWithRefreshToken`. The session reducer does not store that body as a logged-in user.
5. Session exchange is outside this client path: the partner (expected `POST /v2/exchange-refresh-token` with `{ refresh_token }`) continues with a normal `session.id` / `Session-Id`. Existing `/token-verify` still handles `token` / `request` only; it does not consume `refresh_token` or call exchange.

Without `redirect_url`, Google auth keeps the existing session response on the same endpoint. Backend support for `redirect_url` / exchange is unverified; see [Contracts](CONTRACTS.md) and [Open questions](OPEN_QUESTIONS.md).

**Verify when changed:** valid and rejected login, two-way authentication, no-company redirect, return URL, expired session and logout. Partner mode: login vs signup with `redirect_url`, redirect appends `refresh_token` without creating a local session, missing/expired/reused bridge token on the partner side, and unchanged Google login when `redirect_url` is omitted.

## 2. Switch company or branch without mixing books

1. [CompanyBranchComponent](../apps/web-giddh/src/app/shared/primary-sidebar/company-branch/company-branch.component.ts) loads accessible branches for the chosen company. Company vs Branch capability uses each company's true `branchCount` / `unarchivedBranchCount` from the companies list (`session.companies`), not `settings.branches.length` (which can be 1 when only a shared branch is accessible). When `showAllBranches` sees company `branchCount > 1` with at least one unarchived branch, it opens the branch tab, or if only one branch is accessible (shared permission) it enters Branch mode with that branch unique name; when company `branchCount === 1` it runs `changeCompany` in Company mode. `changeCompany` / `changeBranch` ask about unsaved edits; cancel keeps the current context; confirm calls the switch method.
2. Switching company resets active-company and warehouse data, updates `GeneralService`, voucher API version and organization state, then dispatches `LoginActions.ChangeCompany`. [PrimarySidebarComponent](../apps/web-giddh/src/app/shared/primary-sidebar/primary-sidebar.component.ts) sets `isCompanyWithoutBranch` / `hasMultipleBranches` from companies-list `branchCount`.
3. [CHANGE_COMPANY$](../apps/web-giddh/src/app/actions/login.action.ts) requests [CompanyService.getStateDetails](../apps/web-giddh/src/app/services/company.service.ts), restores a supported route and refreshes profile data. Same-company branch switches refresh invoice settings and navigate through `/dummy` to rebuild the view.
4. The [HTTP interceptor](../apps/web-giddh/src/app/services/http.interceptor.ts) adds `branchUniqueName` only in Branch organization mode. [NeedsAuthorization](../apps/web-giddh/src/app/decorators/needAuthorization.ts) redirects branch-restricted routes to home; role-driven controls use separate permission data.

**Alternative/failure:** query parameters can select a company/validated branch during [storage restoration](../apps/web-giddh/src/app/app.module.ts). A missing/error saved state in `CHANGE_COMPANY$` currently constructs a sales fallback. Branch state is updated before its state-details response, so failure does not demonstrate rollback to the previous context.

**Verify when changed:** two companies open in separate tabs, company versus branch requests, unsaved-edit cancellation, restricted routes, refresh and failed state lookup. Confirm the displayed company agrees with the request URL/branch parameter.

## 3. Create or edit a voucher

1. [VouchersRoutingModule](../apps/web-giddh/src/app/vouchers/vouchers.routing.module.ts) selects create/edit/preview from voucher type and account identifiers; create/edit routes use `PageLeaveConfirmationGuard`.
2. [VoucherCreateComponent.saveVoucher](../apps/web-giddh/src/app/vouchers/create/create.component.ts) collects entries/deposits, validates the form and formats the payload through [VouchersUtilityService](../apps/web-giddh/src/app/vouchers/utility/vouchers.utility.service.ts). Invalid input is marked and scrolled into view.
3. [VoucherService.generateVoucher / updateVoucher](../apps/web-giddh/src/app/services/voucher.service.ts) sends the request using [SALES_API_V4](../apps/web-giddh/src/app/services/apiurls/sales.api.ts) and the active voucher API version. Delivery challans/receipt notes use the inventory voucher methods; recurring vouchers add their own query/payload fields.
4. Success shows the saved number/message and resets the form, navigates to preview/list, or runs the requested callback. `einvoice-confirm` opens a confirmation and resubmits with the chosen setting.

**Permissions/failure:** `/pages` requires authentication; the vouchers route has the branch restriction guard. Feature controls also use permission/subscription state, but this trace does not establish comprehensive write authorization; the server contract needs confirmation. API errors display a snackbar. Do not assume a failed/absent response means no voucher was saved: idempotency is unverified.

**Verify when changed:** create and edit, invalid form, leave confirmation, cash/account variants, recurring vouchers, e-invoice confirmation, inventory document conversion and API failure. Inspect the saved record before manually repeating an uncertain submission.

## 4. Download a digitally signed invoice

The [DSC flow guide](DSC-SIGNED-INVOICE-FLOW.md) owns the detailed sequence and file map. [DscSignDialogService](../apps/web-giddh/src/app/services/dsc-sign-dialog.service.ts) opens immediately; [DscPinDialogComponent.loadCertificates](../apps/web-giddh/src/app/vouchers/dsc-pin-dialog/dsc-pin-dialog.component.ts) handles bridge/native-host availability inside the dialog.

The user selects a certificate and supplies a PIN. New/changed PINs re-read the token; dummy verification runs only when remembering the PIN. An unchanged remembered PIN signs directly. Then [DscService](../apps/web-giddh/src/app/services/dsc.service.ts) calls prepare → native `signHash` → finish through [DSC_API](../apps/web-giddh/src/app/services/apiurls/dsc.api.ts). The returned PDF is downloaded. “Save & Download Signed PDF” saves the voucher first; signing failure does not undo that save.

**Failure/recovery:** the dialog distinguishes missing extension/native host, disconnected token and signing/PIN errors, offering installation or retry actions where implemented. Remembered PIN retention is owned by [DscPinStorageService](../apps/web-giddh/src/app/services/dsc-pin-storage.service.ts), not the voucher form.

**Verify when changed:** missing bridge, unplugged token, wrong and remembered PIN, prepare/finish failures and successful download using a supported device. A frontend-only check cannot establish device or server signing behavior.

## 5. Create or update job work (inventory)

1. Inventory sidebar opens **Job Work > Create New** at `/pages/inventory/v2/job-work/create` (edit: `/pages/inventory/v2/job-work/edit/:uniqueName`). Branch mode is required for create/edit, same pattern as Manufacturing.
2. Stock pickers call `InventoryService.getStocksV2` (`company/:companyUniqueName/stocks/v2`), variants via `LedgerService.loadStockVariants`, rates via `ManufacturingService.getRateForStockV2`.
3. When company batch management is enabled, create selects batches for finished (inbound), raw (outbound), and scrap (inbound) lines using the shared Manufacturing/voucher BatchSelectDialog; batches clear on stock/variant change and map to `{ uniqueName, quantity }` on save.
4. Delivery Challan No. loads pending DCs from `business-documents/pending-report` (`NOT_INVOICED` + `DC`, filtered by selected jobworker) via [VoucherService.getPendingBusinessDocumentsByAccounts](../apps/web-giddh/src/app/services/voucher.service.ts); the multi-select shows document numbers and posts `deliveryChallanUniqueNames`. [JobWorkService](../apps/web-giddh/src/app/services/job-work.service.ts) posts create to `v2/company/:companyUniqueName/job-work-orders` or puts update to `.../job-work-orders/:orderUniqueName`, appending `branchUniqueName` when needed. Empty `deliveryChallanUniqueNames` means auto-send on a new JOBWORK_DC.
5. Report at `/pages/inventory/v2/job-work/list` posts filters to `.../job-work-orders/list` (`from`/`to`, status, type, warehouse, free-text `q`, `onlyOverdue`, `onlyItcClaimed`) and the same payload in parallel to `.../job-work-orders/summary` for the totals cards. Column search on Job Work No / Jobworker / Output Stock maps into `q` and keeps the table visible while searching. Company/consolidated mode shows a branch dropdown (Manufacturing pattern: `branchUniqueName` query + `go-to-branch`). Advance Filter dialog covers warehouse, overdue, and ITC-claimed. Row actions call `.../job-work-orders/action` for RETURN, MARK_SCRAP, ADJUST, PRINT, CANCEL, DELETE. **Record Return**, **Mark Scrap**, and **Make Adjustment** open [JobWorkActionDialogComponent](../apps/web-giddh/src/app/new-inventory/component/job-work/job-work-action-dialog/job-work-action-dialog.component.ts) (same dialog pattern as voucher Adjust Inventory): GET the order, edit OUTPUT + INPUT quantities / scrap lines / expense lines in the dialog, then post RETURN (`isFinal: false`, OUTPUT and INPUT items), MARK_SCRAP (`scraps` + warehouse), or ADJUST (`increaseAssetValue`/`claimItc` + `expenses`). **View Linked Challan** GETs `.../job-work-orders/:uniqueName/challan` and shows each challan’s number/date/status/warehouse plus `documentItems` table (not raw JSON). Export, Revert/Undo remain out of scope.

**Verify when changed:** create with auto DC, create linking an existing DC uniqueName, open list View/edit and confirm warehouse, jobworker, finished/raw/scrap stocks, units, batches and dates populate from GET `documentItems`/`jobWorkDetails`, list filters by date/status/type/column search/advance filter, and each supported action against a sandbox company.

## 6. Filter a list or export with All selected

[VoucherListComponent.getAllVouchers](../apps/web-giddh/src/app/vouchers/list/list.component.ts) normalizes a copy of advanced filters before passing them to the relevant [VoucherComponentStore](../apps/web-giddh/src/app/vouchers/utility/vouchers.store.ts) effect and service. [DaybookComponent.getDaybook / hideExportDaybookModal](../apps/web-giddh/src/app/daybook/daybook.component.ts) uses the same wrapper for listing and export. The precise wire behavior has one home in [Select All contracts](CONTRACTS.md#select-all-filters).

**Verify when changed:** All versus subset versus empty selection, list totals/export agreement, API failure, existing role restrictions, and unchanged filter controls after copy-mode normalization. Focused payload tests pass; authenticated list/export behavior remains unverified without a live test account.

## 7. Approve a pending petty-cash entry

1. Pending petty cash opens from the expenses route into [PendingListComponent](../apps/web-giddh/src/app/expenses/components/pending-list/pending-list.component.ts). Choosing a row loads [ExpenseDetailsComponent](../apps/web-giddh/src/app/expenses/components/expense-details/expense-details.component.ts).
2. [ExpenseService.getPettycashEntry](../apps/web-giddh/src/app/services/expences.service.ts) reads `GET company/:companyUniqueName/pettycash-manager/ledger/:accountUniqueName`. The detail screen shows that entry's description twice: the top field and the description inside [UpdateLedgerEntryPanelComponent](../apps/web-giddh/src/app/ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component.ts). Both edit `description` on the same entry.
3. HTML tags, script tags and `javascript:` URLs fail [containsHtmlOrScript](../apps/web-giddh/src/app/shared/helpers/html-script-validation.ts) on both fields. The message is `app_html_script_not_allowed`. Approve stays closed, and [saveLedgerTransaction](../apps/web-giddh/src/app/ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component.ts) does not build a request.
4. A plain description, including comparisons such as `5 < 10`, continues to [ExpenseService.actionPettycashReports](../apps/web-giddh/src/app/services/expences.service.ts) as the existing approve payload. The description property is unchanged aside from the text the user edited.

**Verify when changed:** pending entry whose description is plain text, a tag, a script, and a comparison; the top field and the ledger field show the same text; approve is blocked only for markup; rejection and the entry-against account check still run. Voucher, new-ledger, account and group descriptions are separate fields and are not covered here.

## 8. Review IMS invoices (GST)

1. Tax sidebar **IMS** (between GSTR-2 and E-way Bill) opens `/pages/gstfiling/ims` ([ImsComponent](../apps/web-giddh/src/app/gst/ims/ims.component.ts)). The active GSTIN comes from `gstR.activeCompanyGst` (set by the tax sidebar); with no GSTIN on any address the page shows the existing "add GSTIN" message.
2. The page uses the GSTR-1/GSTR-2 filing layout (header with back link, title, month picker and **Authenticate**/**Authenticated**). The page dispatches the existing `GetGSPSession`. **Authenticate** follows the GSTR header rule: shown for a company or consolidated branch on voucher API v2, disabled when the plan restricts Tax filing. Without a session the body shows the connect message and **Authenticate**, which opens the shared [gst-aside-menu](../apps/web-giddh/src/app/gst/modals/gst-aside-menu/gst-aside-menu.component.ts) OTP flow (`gsp-session` → `authenticate-gsp-session`). For `returnType` `ims` the aside closes once authenticated and the list loads.
3. The month picker (same `giddh-datepicker` month mode as Filing Status) sends `monthYear` MM-yyyy. **Refresh from GST portal** calls `ims-invoices` with `refresh=true`; an empty snapshot (`error.ims.data.notFound`) shows a refresh prompt.
4. Summary count boxes (customer-list style) show Total, Accepted, Rejected, Pending and No action; they are display only. The **Status** dropdown beside Invoice Details filters the invoice list (`status`; All clears it). Selecting rows on the current page shows the bulk bar. Accept on ITC sections opens the ITC dialog (`itcRedReq` N/Y, remarks required for N); plain B2B is sent directly. Reset asks for confirmation and posts `save-ims?reset=true` without `status`.
5. `save-ims` is called once; there is no status polling. On success the saved rows show the new IMS status and the summary counts move in place (no list reload); actions are blocked only while the request is in flight. **History** lists `ims-referenceIds`; **Get status** calls `save-ims-status` once for that reference, shows the result as a toast and reloads the list on a processed or failed result (`IP` only shows "still processing").
6. A failed refresh or save re-checks the GSP session so an expired session returns the page to **Not connected**.

**Verify when changed:** sidebar placement and active state, OTP connect and reload, MM-yyyy on every call, summary/filter/pagination, Accept on B2B (no dialog) and CN (dialog, remarks on N), Reject/Pending/Reset payloads, polling stop and resume after reload, retry of a failed row, empty-snapshot and error messages, the ITC disclaimer. Use an approved sandbox GSTIN; save and reset write to the GST portal.
