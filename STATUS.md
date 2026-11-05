# Status

**Plan:** Preparation brief (Pushpendra, 2026-10-23), as recorded in [VISION](docs/VISION.md#approved-development-direction), [DECISIONS](docs/DECISIONS.md), [EXPERIMENTS](docs/EXPERIMENTS.md) and [VERIFICATION](docs/VERIFICATION.md) · **Last updated:** 2026-11-05 · **Reviewed up to commit:** `e5245d216e`

The brief's original text is not in this repository. Rows below score what the repository records of it. Keep "Reviewed up to commit" on a commit that exists on `giddh-2.0`; `npm run status:check` lists every code commit after it.

**Legend:** ✅ works for real people · 🟡 built, not proven · ⛔ blocked · ⬜ not started · 🙈 hidden · ❌ dropped

## At a glance

| Area | Status | Notes |
| --- | --- | --- |
| Agent map and docs | 🟡 | Built and link-checked on every PR. A recorded fresh-agent handoff exists; no human user has confirmed it. |
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
| CSP allows blob sources for frames | 🟡 | `37b2314ec9`, `399d2ba3d7`. |
| Ledger and permissions route paths restored | 🟡 | `66a7606b04` fixed misspelled `leondger`/`permissis` paths in [app.routes.ts](apps/web-giddh/src/app/app.routes.ts). |
| Living status tracker and `status:check` | 🟡 | [Script](scripts/status-check.mjs) and focused tests pass; CI workflow not yet seen on a teammate's PR. |
| Petty cash description rejects HTML/script | 🟡 | Pending detail and the ledger description it saves show `app_html_script_not_allowed` and block approve. Focused helper test passes. Not checked in a signed-in company. Voucher, new-ledger, account and group descriptions are unchanged. |

## Change log

- 2026-11-02 · Cursor agent · Created STATUS.md, `npm run status:check` and its PR workflow · Initial scorecard; tracker 🟡
- 2026-11-05 · Cursor agent · Pending petty-cash descriptions reject HTML/script and block approve · Helper and template wiring covered by [html-script-validation.test.cjs](scripts/tests/html-script-validation.test.cjs); live company not available
