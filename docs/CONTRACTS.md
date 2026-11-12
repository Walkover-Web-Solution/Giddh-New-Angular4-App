# Contracts and persistence

**Observed:** frontend implementation at `970543b`, reviewed 2026-10-23. These are contracts the client currently uses. No backend schema or server implementation was verified; this document does not promise server authorization, atomicity or retry safety.

## API sources

Endpoint constants, request construction and models must be read together. `BaseResponse` is permissive (`body` is `any`); a TypeScript type is not runtime validation.

| Boundary | Source of client behavior |
| --- | --- |
| Shared response/pagination | [BaseResponse.ts](../apps/web-giddh/src/app/models/api-models/BaseResponse.ts): `status`, `body`, `message`, `code`; request/query metadata is also attached locally. |
| Sign-in/session | [LOGIN_API](../apps/web-giddh/src/app/services/apiurls/login.api.ts) + [AuthenticationService](../apps/web-giddh/src/app/services/authentication.service.ts); password, OTP, Google and session renewal/destruction. |
| Partner Google bridge auth | Optional query `redirect_url` on `/login` and `/signup`. Client models: `GoogleAuthRequest` / `PartnerGoogleAuthResponse` in [loginModels.ts](../apps/web-giddh/src/app/models/api-models/loginModels.ts). Same existing `GET v2/signup-with-google` + `Access-Token`; when `redirect_url` is present it is appended as a query param (`encodeURIComponent`). Partner success body is `{ refresh_token, redirect_url }` (no `session`); the client redirects to that URL with `refresh_token` set on the query and does not write session state. Expected partner exchange is `POST v2/exchange-refresh-token` with `{ refresh_token }` → normal `LoggedInUserV2` / session; that route is **not** in [LOGIN_API](../apps/web-giddh/src/app/services/apiurls/login.api.ts) and is **not** called from this checkout. Bridge token is one-time and short-lived (~5 min) per partner guide; **backend support is not verified here**. Without `redirect_url`, response shape stays the normal session login. |
| Company and saved navigation | [COMPANY_API](../apps/web-giddh/src/app/services/apiurls/company.api.ts) + [CompanyService](../apps/web-giddh/src/app/services/company.service.ts); company list, company user and `state-details`. |
| Vouchers | [sales.api.ts](../apps/web-giddh/src/app/services/apiurls/sales.api.ts) + [VoucherService](../apps/web-giddh/src/app/services/voucher.service.ts); preserve version selection, account/company identifiers and recurring/inventory variants. |
| Inventory Job Work | [job-work.api.ts](../apps/web-giddh/src/app/services/apiurls/job-work.api.ts) + [JobWorkService](../apps/web-giddh/src/app/services/job-work.service.ts) + [JobWork.ts](../apps/web-giddh/src/app/models/api-models/JobWork.ts). Create/Update bodies use `deliveryChallanUniqueName` (DC uniqueName, not document number). Dates `dd-MM-yyyy`. Stock search for finished/raw/scrap reuses `stocks/v2`; `stockUnits` map to Unit dropdown options (`label: code`, `value: uniqueName`) like Manufacturing. Optional `batches: [{ uniqueName, quantity }]` on finished/raw/scrap when company batch management is enabled. List POST may include `q`, `accountUniqueName`, `warehouseUniqueName`, `onlyOverdue`, `onlyItcClaimed` besides date/status/type/pagination; backend filter support is unverified. GET order body uses nested `warehouse`/`account`/`jobworker`, `documentDate`, `jobWorkDetails` (type, dates, flags, expenses, scraps), and `documentItems` with `lineRole` OUTPUT/INPUT/SCRAP (nested stock/variant/stockUnit/batches); edit `patchForm` maps that shape into the create form. List `body.items[]` uses `documentNo`, `documentDate`, nested `jobworker`/`warehouse`/`outputStock`, `jobWorkType`, `outputQuantity`, `status` (charges/ITC/return-due may be absent); list UI reads those keys. RETURN action body expects `items[]` with OUTPUT/INPUT `lineRole`, `stockUniqueName`, `variantUniqueName`, `quantity`, and optional `batches`; MARK_SCRAP expects `scraps[]` with `stockUniqueName`, `variantUniqueName`, `quantity`, `batches`, `retainedBy`; ADJUST expects `increaseAssetValue`, `claimItc`, and `expenses[]` with `fromAccountUniqueName`, `toAccountUniqueName`, `tax`, `amount`, `taxAmount`. List UI builds these from order GET (`documentItems` / `jobWorkDetails`); list rows alone are insufficient. List/action response shapes are client expectations from the Job Work Postman collection; backend guarantees are unverified. |
| Signed PDF | [DSC_API](../apps/web-giddh/src/app/services/apiurls/dsc.api.ts) + [DscService](../apps/web-giddh/src/app/services/dsc.service.ts); prepare produces signing data, finish returns a PDF Blob. See [DSC guide](DSC-SIGNED-INVOICE-FLOW.md). |
| Resolved environment/branding | [ServiceConfig](../apps/web-giddh/src/app/services/service.config.ts), [WhiteLabelService](../apps/web-giddh/src/app/services/white-label.service.ts) and [white-label guide](white-label.md). Treat values delivered to browser/Electron renderer as client-visible. |

For ordinary voucher creation, `VoucherService.generateVoucher` posts to `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`; editing puts to `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers`. It appends the active voucher version and handles recurring parameters before sending. These paths come from the constants above; keep those definitions authoritative.

`HttpWrapperService.prepareOptions` adds `Session-Id`, JSON headers and loader handling. Multipart and URL-encoded requests have special handling; preserve it. [GiddhHttpInterceptor](../apps/web-giddh/src/app/services/http.interceptor.ts) adds language, timestamp/timezone and branch context, expires sessions and handles offline requests. It retries once when a `retry-after` header exists, without waiting for its advertised delay. This behavior does not establish that write requests are idempotent.

[GiddhErrorHandler.HandleCatch](../apps/web-giddh/src/app/services/catchManager/catchmanger.ts) often converts HTTP errors into emitted response objects, so consumers check `status`, not only the RxJS error channel. `SESSION_EXPIRED_OR_INVALID` dispatches logout. Offline handling can complete without a response, or emit `status: 'no-network'` when requested by the body. Preserve these distinctions when changing service return types or loaders.

## Select All filters

[selected-all.ts](../apps/web-giddh/src/app/shared/helpers/selected-all.ts) owns the sentinel and normalization. `GeneralService.replaceSelectedAllOptions` and the `app.constant` exports remain the public entry points. For example:

```ts
// Before
{ accounts: ['SELECTED_ALL_OPTION'] }
// After
{ accounts: [], selectAllFields: ['accounts'] }
```

Only a singleton sentinel array means All; an empty or mixed selection remains unchanged. Traversal visits own enumerable object properties in order, records duplicate leaf names, skips array contents, and replaces root `selectAllFields`. Normalize a fresh request once: a second pass clears the previous metadata. The service mutates by default; `createCopy: true` uses the existing environment-selected [clone adapter](../apps/web-giddh/src/app/lodash-optimized.ts), whose fallback uses JSON serialization.

## Authentication and permissions

[NeedsAuthentication](../apps/web-giddh/src/app/decorators/needsAuthentication.ts) checks login state. [NeedsAuthorization](../apps/web-giddh/src/app/decorators/needAuthorization.ts) only checks branch-restricted routes. [PermissionDataService](../apps/web-giddh/src/app/permissions/permission-data.service.ts) derives scopes from the active company user; [CheckPermissionDirective](../apps/web-giddh/src/app/permissions/check-permission.directive.ts) hides menus and [ValidateSectionPermissionDirective](../apps/web-giddh/src/app/shared/validate-section-permission/validate-section-permission.directive.ts) marks restricted sections. These UI controls do not prove backend authorization.

Changing a company, role, subscription or route can affect both visibility and API context. Keep session identifiers and credentials out of documentation, fixtures and logs added by future changes.

## Saved state

| Location | Current owner and contents |
| --- | --- |
| `sessionStorage` | [createHybridStorage](../apps/web-giddh/src/app/app.module.ts): tab-specific company, branch, company user, application date and consolidated-branch state. |
| `localStorage` | Same adapter: persistent user, company list, login state, currency, locale, theme and permissions. It also retains last company/branch selection for new tabs. Query parameters and tab data influence restoration; the [interceptor](../apps/web-giddh/src/app/services/http.interceptor.ts) has a second restore implementation. |
| White-label cache | `whiteLabel` in [AppModule](../apps/web-giddh/src/app/app.module.ts); cached configuration can affect startup/API selection. |
| IndexedDB | [AppDatabase](../apps/web-giddh/src/app/models/db/db.ts): Dexie database `_giddh`, version 1, `companies` keyed by `uniqueName`, containing navigation/account history. It is not evidence of offline accounting writes. |
| DSC memory | [DscPinStorageService](../apps/web-giddh/src/app/services/dsc-pin-storage.service.ts): encrypted PIN entries and a device secret in local storage, with expiry/device checks. This is client storage, not a hardware-backed secret vault. |
| Desktop window preferences | [StateManager](../apps/electron-giddh/src/StateManager.ts): Configstore-backed window metadata, with platform-specific location handling. |

Do not rename storage keys or clear saved state as a refactoring shortcut. Define migration and rollback behavior before changing stored shapes.

## Analytics, diagnostics and desktop messages

Web entry HTML installs Google Tag Manager: [index.prod.html](../apps/web-giddh/src/index.prod.html) and [index.test.html](../apps/web-giddh/src/index.test.html) use different containers. Their tag/event definitions are outside this checkout; preserve loading and establish event/exposure requirements before changing measured flows. Experiment assignment and exposure/conversion events go through the middleware snippet described in [experiments](EXPERIMENTS.md#recording-through-the-middleware); no other event schema was established here.

[Angular21CompatibilityErrorHandler](../apps/web-giddh/src/app/angular21-compatibility.ts) sends UI exception payloads containing user/company context, page and stack to the API outside excluded local domains; `GiddhErrorHandler.logApiError` sends API-error diagnostics. Compatibility code also suppresses selected errors and reloads on chunk failures, so a quiet console alone is insufficient verification.

Electron IPC is defined jointly by [preload allowlists](../apps/electron-giddh/src/preload.js), [main handlers](../apps/electron-giddh/src/index.ts) and [WindowManager](../apps/electron-giddh/src/WindowManager.ts). Preserve channel names and payload expectations across both sides. Main handlers alone do not prove a channel is exposed to the renderer. Window configuration currently enables context isolation and disables Node integration, while disabling sandboxing and web security; changes need a dedicated desktop compatibility review.

## Unverified backend capabilities

Before relying on them, obtain backend evidence for write idempotency/retries, permission enforcement, company/branch isolation, response schemas, signing nonce lifetime/reuse and atomicity of voucher/accounting updates. Confirm telemetry ownership, consent/retention and experiment exposure semantics before adding events. Track answers in [OPEN_QUESTIONS](OPEN_QUESTIONS.md); continue independent frontend work without inventing guarantees.
