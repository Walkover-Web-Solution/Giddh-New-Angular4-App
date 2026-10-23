# Important journeys

**Observed:** source trace at `970543b` on 2026-10-23. These describe implemented paths, not proof that a live backend or packaged desktop build passes them. Runtime evidence and gaps belong in [DEVELOPMENT](DEVELOPMENT.md); shared API and permission rules belong in [CONTRACTS](CONTRACTS.md).

## 1. Sign in and return to work

1. `/login` loads the login feature through [app.routes.ts](../apps/web-giddh/src/app/app.routes.ts). Password, OTP and Google requests go through [AuthenticationService](../apps/web-giddh/src/app/services/authentication.service.ts) and [LOGIN_API](../apps/web-giddh/src/app/services/apiurls/login.api.ts).
2. [LoginActions](../apps/web-giddh/src/app/actions/login.action.ts) handles responses. A two-way-auth response requires the OTP step; a verified login continues to `loginSuccess$`.
3. `loginSuccess$` fetches company list and saved state. `finalThingTodo` loads the company user, sets logged-in state and prefers `returnUrl`, then the recent saved page or home.
4. With no companies, the user goes to subscriptions or buy-plan according to `hasSubscriptionPermission`. [NeedsAuthentication](../apps/web-giddh/src/app/decorators/needsAuthentication.ts) sends signed-out users to login with a return URL.

**Failure/recovery:** login and OTP errors display their API message. An invalid/expired session dispatches logout; the user signs in again. Desktop Google login crosses `authenticate` → `take-your-gmail-token` in the [main process](../apps/electron-giddh/src/index.ts) and [preload](../apps/electron-giddh/src/preload.js). Exercise that path separately from browser login.

**Verify when changed:** valid and rejected login, two-way authentication, no-company redirect, return URL, expired session and logout.

## 2. Switch company or branch without mixing books

1. [CompanyBranchComponent.changeCompany / changeBranch](../apps/web-giddh/src/app/shared/primary-sidebar/company-branch/company-branch.component.ts) asks about unsaved edits. Cancel keeps the current context; confirm calls the switch method.
2. Switching company resets active-company and warehouse data, updates `GeneralService`, voucher API version and organization state, then dispatches `LoginActions.ChangeCompany`.
3. [CHANGE_COMPANY$](../apps/web-giddh/src/app/actions/login.action.ts) requests [CompanyService.getStateDetails](../apps/web-giddh/src/app/services/company.service.ts), restores a supported route and refreshes profile data. Same-company branch switches refresh invoice settings and navigate through `/dummy` to rebuild the view.
4. The [HTTP interceptor](../apps/web-giddh/src/app/services/http.interceptor.ts) adds branch context to subsequent eligible requests. [NeedsAuthorization](../apps/web-giddh/src/app/decorators/needAuthorization.ts) redirects branch-restricted routes to home; role-driven controls use separate permission data.

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

## 5. Filter a list or export with All selected

[VoucherListComponent.getAllVouchers](../apps/web-giddh/src/app/vouchers/list/list.component.ts) normalizes a copy of advanced filters before passing them to the relevant [VoucherComponentStore](../apps/web-giddh/src/app/vouchers/utility/vouchers.store.ts) effect and service. [DaybookComponent.getDaybook / hideExportDaybookModal](../apps/web-giddh/src/app/daybook/daybook.component.ts) uses the same wrapper for listing and export. The precise wire behavior has one home in [Select All contracts](CONTRACTS.md#select-all-filters).

**Verify when changed:** All versus subset versus empty selection, list totals/export agreement, API failure, existing role restrictions, and unchanged filter controls after copy-mode normalization. Focused payload tests pass; authenticated list/export behavior remains unverified because of the baseline build failure.
