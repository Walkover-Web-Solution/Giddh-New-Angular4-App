# Open questions

These are known limits, not instructions to stop independent work. Ask only when the answer blocks the requested change.

| Question | Affected area | What resolves it |
| --- | --- | --- |
| Who is the approved ICP, and which customer problems, markets, outcomes, and non-goals come first? | [Vision](VISION.md) and feature priorities | A product-owner decision or approved product brief; code alone cannot establish strategy. |
| What dependency/runtime baseline should CI reproduce? | [package.json](../package.json), ignored lockfile, floating `.nvmrc` | Owner-approved lockfile and runtime policy, followed by a clean build. |
| What should replace the missing legacy Angular test/lint targets? | [Verification](VERIFICATION.md) | An agreed integration/lint setup. Export errors are fixed; local build and fixture checks pass. |
| Which web buildspec and branch promotion rules are active? | [Development](DEVELOPMENT.md#release-and-recovery) | Release-owner confirmation against actual CodePipeline configuration; repository instructions disagree. |
| Where are the backend schemas, permission guarantees, and sandbox accounts? | [Contracts](CONTRACTS.md) and authenticated journeys | Backend-owned specification and a safe company/account for successful, rejected, and unauthorized requests. |
| Which environment configuration is authoritative for generated TS and HTML, and which client-exposed credentials can be removed? | [Environment setup](DEVELOPMENT.md#environment-and-preview) | Frontend/backend owner review of both generators and OAuth/provider contracts. |
| Does the existing app meet its accessibility requirement, and are phone layouts supported? | [Design](DESIGN.md) | Working preview, AXE/keyboard evidence, and product/design-owner confirmation. |
| What service will own experiment assignment, exposure, evaluation, and rollback? | [Experiments](EXPERIMENTS.md) | Approved infrastructure and contracts before any experiment launch. |

The repository retains broad Electron, tenant, and dynamically loaded asset paths. This preparation has not established that any whole feature, dependency, or asset is unused; none was deleted on that assumption.

Concrete existing code findings are tracked in [REVIEW](REVIEW.md).
