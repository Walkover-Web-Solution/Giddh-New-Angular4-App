# Whole-codebase review

The expanded review covered all **3,429 tracked files** present at `9528a2e`: business features, core state/services, shared UI, Electron, local libraries, assets and build tooling. Every file was inventoried; parsable code/templates/configuration received structural checks. Source reading followed meaningful entry points and state/API boundaries in every feature area. This is not a claim that every line or every possible journey was manually verified. [Verification](VERIFICATION.md) separates executed checks from source evidence.

## Refactors made

| Area | Change and preserved behavior |
| --- | --- |
| Build | Mark 124 erased symbols as type imports; keep runtime classes and injection tokens intact. |
| Financial reports | Share checked-row traversal across three grids; preserve order, duplicates, scope and delayed requests. |
| Inventory adjustments | Share create/edit request preparation; preserve mutation, selected variants and dispatch gates. |
| Voucher services | Delegate identical proforma/estimate/pending-order calls to existing services; preserve public wrappers, request metadata and company state. |
| HTTP | One loader finalizer for six verbs; preserve headers, options and completion/error/cancellation handling. |
| Permissions | One subscription owns company/role state; preserve role precedence and empty-role behavior. |
| Reducers | Remove unreachable duplicate cases/labels; preserve the first reachable handler. |
| Triggers and Electron | Share identical validation and IPC channel lists; preserve first-error order, payloads and modern/legacy callback differences. |

The earlier select-all extraction remains covered. No feature, route, dependency, asset or public entry point was deleted. Similar query builders, old/new inventory and voucher paths, tenant assets and compatibility code were retained where equivalence or lack of consumers could not be established.

## Existing findings retained for focused follow-up

These findings predate the refactors; none establishes backend exploitability or a production incident.

| Evidence | What needs resolving |
| --- | --- |
| [Wallet popup listener](../apps/web-giddh/src/app/subscription/wallet/wallet.component.ts) accepts success messages without origin/source checks. | Confirm the provider callback contract before restricting messages. |
| [Billing setup](../apps/web-giddh/src/app/billing-details/billing-details.component.ts) shadows the selected company; [DNS screen](../apps/web-giddh/src/app/dns-records/dns-records.component.ts) emits a literal portal placeholder. | Confirm fallback currency and authoritative DNS target. Current outcomes were reproduced locally. |
| [Signup](../apps/web-giddh/src/app/signup/signup.component.ts) expects token-first callbacks from the legacy bridge; [preload](../apps/electron-giddh/src/preload.js) forwards the event first and omits a Gmail reply channel. | Verify native OAuth/email contracts before changing the bridge. |
| [Bank reconciliation](../apps/web-giddh/src/app/bank-reconciliation/utility/bank-reconciliation.service.ts) includes PDF passwords in URL queries. | Agree different transport with the backend. |
| [Stock creation](../apps/web-giddh/src/app/inventory/components/add-stock-components/inventory.addstock.component.ts) adds a group-success observer per missing-parent submission. | Test repeated submissions before changing lifecycle. |
| [Permission state](../apps/web-giddh/src/app/permissions/permission-data.service.ts) retains previous scopes and super-admin state when company-user roles are missing or empty, including after a company switch. | Agree the authorization-state policy before changing this preserved behavior. |
| Import processing treats non-error emissions as success; multi-currency filtering can emit with an invalid form. | Confirm response statuses and filter validity requirements. |
| [Environment generation](DEVELOPMENT.md#environment-and-preview), duplicate session restoration and broad compatibility error suppression remain inconsistent. | Establish intended precedence with representative tenant/session fixtures. |
| [Legacy optimizer](../scripts/tree-shaking-optimizer.js) can drop unmapped imports; [Electron builder](../scripts/build-electron-env.js) writes source even with `--dry-run`. | These are mutating legacy tools, not verification commands. They were inspected, not applied. |

No experiment or live external flow was launched. Start future fixes from the relevant finding and concrete contract.
