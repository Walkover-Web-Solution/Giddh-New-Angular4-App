# Open questions

These are known limits, not instructions to stop independent work. Ask only when the answer blocks the requested change.

| Question | Affected area | What resolves it |
| --- | --- | --- |
| Who is the approved ICP, and which customer problems, markets, outcomes, and non-goals come first? | [Vision](VISION.md) and feature priorities | A product-owner decision or approved product brief; code alone cannot establish strategy. |
| What dependency/runtime baseline should CI reproduce? | [package.json](../package.json), ignored lockfile, floating `.nvmrc` | Owner-approved lockfile and runtime policy, followed by a clean build. |
| What should replace the missing legacy Angular test/lint targets? | [Verification](VERIFICATION.md) | An agreed integration/lint setup. Export errors are fixed; local build and fixture checks pass. |
| Which web buildspec and branch promotion rules are active? | [Development](DEVELOPMENT.md#release-and-recovery) | Release-owner confirmation against actual CodePipeline configuration; repository instructions disagree. |
| Where are the backend schemas, permission guarantees, and sandbox accounts? | [Contracts](CONTRACTS.md) and authenticated journeys | Backend-owned specification and a safe company/account for successful, rejected, and unauthorized requests. |
| Does `GET /v2/signup-with-google?redirect_url=` return `{ refresh_token, redirect_url }`, and is `POST /v2/exchange-refresh-token` live for partners? | Partner Google auth in [Flows](FLOWS.md) / [Contracts](CONTRACTS.md) | Backend confirmation. FE only adds optional `redirect_url` on the existing Google GET and redirects with `refresh_token`; exchange is not in `LOGIN_API`, and `/token-verify` does not consume `refresh_token`. |
| Which environment configuration is authoritative for generated TS and HTML, and which client-exposed credentials can be removed? | [Environment setup](DEVELOPMENT.md#environment-and-preview) | Frontend/backend owner review of both generators and OAuth/provider contracts. |
| Does the existing app meet its accessibility requirement, and are phone layouts supported? | [Design](DESIGN.md) | Working preview, AXE/keyboard evidence, and product/design-owner confirmation. |
| Who approves each middleware experiment's hypothesis, guardrails, and rollback, and is browser-level assignment acceptable for company/branch-scoped flows? | [Experiments](EXPERIMENTS.md) | Owner-defined experiment in the middleware with the launch record that page requires. |
| IMS: which inner `status_cd` means processed vs still processing (`P` is "processed" in GSTR-1 code but "processing" in the IMS guide), and is the save/status body the recorded GSTR-save shape or the guide's portal shape? | [GST IMS contract](CONTRACTS.md#gst-ims) | Backend confirmation or a sandbox save run to a terminal status. |
| IMS: which section codes does `ims-invoices` return (guide uses `CN`, the recorded save uses `B2BCN`), and which carry ITC fields? | `IMS_ITC_SECTIONS` in [gst.constant.ts](../apps/web-giddh/src/app/gst/constants/gst.constant.ts) | Backend section list from a refreshed sandbox period. |
| IMS: how should GSTVIEW / GSTFILING be checked on the client (hide the sidebar item and action buttons)? No client code reads these codes today, so the page relies on server enforcement. | [IMS page](FLOWS.md#7-review-ims-invoices-gst) | Role scope/permission shape from the backend or product owner. |
| IMS: should bulk actions span pages, and is GSTR-2B recompute/reconciliation, export and per-invoice history in scope next? | IMS page | Product-owner decision. |

The repository retains broad Electron, tenant, and dynamically loaded asset paths. This preparation has not established that any whole feature, dependency, or asset is unused; none was deleted on that assumption.

Concrete existing code findings are tracked in [REVIEW](REVIEW.md).
