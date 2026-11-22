# Documentation maintenance

**Repository role:** Angular web client and Electron shell for Giddh accounting; the API backend is outside this checkout.

**Last maintenance run:** 2026-11-22 (req_57252ad7) · **Reviewed `giddh-2.0` through commit:** `9c43124ff9`

Middleware-owned content stays under `docs/guidance/` and the `<!-- middleware:guidance -->` block in [AGENTS.md](../AGENTS.md); this file is the human/agent maintenance ledger for everything else in the map.

## Coverage map

Statuses: **verified** — spot-checked against code or CI this run; **partial** — guidance exists but baseline is stale or behavior is fixture-only; **missing** — no dedicated guidance; **n/a** — not this repo’s responsibility.

| Topic | Authoritative location | Status | Notes |
| --- | --- | --- | --- |
| Product purpose and preservation boundaries | [VISION.md](VISION.md), [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | partial | ICP, roadmap and success metrics still open (product owner). |
| Feature journeys | [FLOWS.md](FLOWS.md), [DSC-SIGNED-INVOICE-FLOW.md](DSC-SIGNED-INVOICE-FLOW.md) | partial | Six traced journeys; ledger CRUD and many settings screens are not journey-owned. |
| Build status and shipped work | [STATUS.md](../STATUS.md) | verified | Rows/changelog updated with teammate merges through `9c43124ff9`. |
| Architecture and ownership | [ARCHITECTURE.md](ARCHITECTURE.md) | partial | Deep review anchored at `970543b`; newer modules (Job Work, DC/RN settings) traced in STATUS/FLOWS. |
| API and client contracts | [CONTRACTS.md](CONTRACTS.md) | partial | Client expectations; server guarantees unverified. |
| Development and release | [DEVELOPMENT.md](DEVELOPMENT.md) | verified | Commands aligned with [package.json](../package.json); Electron doc notes stale aliases. |
| Verification limits | [VERIFICATION.md](VERIFICATION.md) | partial | CI and focused tests documented; full `check:ai` not re-run here (deps not installed in this agent VM). |
| Review findings / refactors | [REVIEW.md](REVIEW.md) | partial | Preparation-era evidence; follow STATUS for post-merge features. |
| UI design and utilities | [DESIGN.md](DESIGN.md), [CSS utilities](../apps/web-giddh/src/assets/styles/CSS_UTILITIES.md) | partial | Not re-audited screen-by-screen this run. |
| Experiments | [EXPERIMENTS.md](EXPERIMENTS.md) | verified | Policy only; no assignment service in repo. |
| Decisions | [DECISIONS.md](DECISIONS.md) | partial | Indexed; not exhaustively reconciled with November merges. |
| Agent entry and coding rules | [AGENTS.md](../AGENTS.md), [.cursor/rules](../.cursor/rules) | verified | Task map and links pass `npm run check:docs`. |
| White-label / Electron env | [white-label.md](white-label.md), [README-ELECTRON-BRANCH-ENV.md](README-ELECTRON-BRANCH-ENV.md) | partial | Cross-check DEVELOPMENT for command truth. |
| Marketing / public website SEO | n/a | n/a | This repo ships the signed-in app build, not the marketing site. |
| Backend / data platform | n/a | n/a | No server implementation in this repository. |
| Infrastructure / IaC | [.github/workflows](../.github/workflows) | partial | CI workflows described in VERIFICATION; no Terraform here. |
| Security / CSP | partial | [STATUS.md](../STATUS.md) (CSP rows), [postbuild](../tools/web/postbuild.js) | Client CSP headers; not a full security program doc. |
| Performance budgets | partial | [VERIFICATION.md](VERIFICATION.md) | Bundle warning recorded; no ongoing perf gate. |
| Measurement / analytics | partial | Preservation notes in VISION/STATUS | Event catalog not centralized. |
| `llms.txt` / public agent discovery | missing | — | Not used in this repo; AGENTS.md is the discovery entry. |

## Changes since `7f49fe07c9` (prior STATUS review)

Reviewed merge history on `giddh-2.0` (27 non-merge commits listed by `status:check`). Documentation impact:

| Change | Doc action this run |
| --- | --- |
| Company picker opens Branch tab after branch list loads (`5298e5a7a3`) | [FLOWS.md](FLOWS.md) §2 updated for `selectBranchTab`. |
| Job Work list/create/report enhancements (multiple) | Already in FLOWS §5 and STATUS; no duplicate edits. |
| Delivery Challan / Receipt Note voucher-list settings tabs | Documented in STATUS; source in voucher list settings UI. |
| Ledger create entry in consolidated branch (`2d49a209e1`) | UI guard removed; no FLOWS ledger journey—logged in STATUS changelog only. |
| Voucher list error handling (`e91fc17949`) | Already in STATUS. |
| Subscription contact / mobile hint copy | UI copy only; STATUS changelog already records hint layout work. |

## Unfinished work (next run)

1. Reconcile [ARCHITECTURE.md](ARCHITECTURE.md) baseline hash and “observed” date with current `giddh-2.0` without cosmetic churn.
2. Add a ledger journey (or explicit deferral) in FLOWS if ledger remains a frequent agent target.
3. Product direction blockers in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) still need owner answers.
4. Live authenticated verification gaps listed in [VERIFICATION.md](VERIFICATION.md#limits-and-handoff).
5. Legacy `npm test` / `npm run lint` replacement still undecided.
6. When `node_modules` is present, re-run `npm run check:ai` after doc edits and refresh VERIFICATION counts if the test total moved.

## Checks this run

| Check | Result |
| --- | --- |
| `npm run check:docs` | Passed (14 map documents including this file). |
| `npm run status:check` | Passed on branch (docs-only delta vs `9c43124ff9`). |
| `npm run check:ai` | Not run — `typescript` missing without install; docs link check substituted. |