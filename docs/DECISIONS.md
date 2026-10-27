# Decisions and evidence

## 2026-10-23 — One maintained agent map

Use [AGENTS.md](../AGENTS.md) as the entry point and keep each subject in its linked document. Existing CSS, signing, white-label, and DSC references remain available. They contain useful context; known drift is called out rather than silently presenting old guidance as verified. Source: Pushpendra's preparation brief and repository inspection at `970543b`.

Keep the existing Angular/CSS rules intact. Modern conventions apply to new work, while working legacy paths are not automatically migrated. Thin tool adapters point to the same entry point so product direction is not copied into several instruction files.

## 2026-10-23 — Isolate the select-all request contract

Move selected-all normalization out of the large general service into a focused helper, preserving the service entry point and existing constant imports. This makes the payload rule testable without booting Angular. Preserve mutation/copy behavior, root `selectAllFields`, nested-object traversal, and the existing environment-selected clone adapter's semantics; the behavior is contractual even where a different implementation might look cleaner.

Do not combine similar query builders: their encoding and delimiter behavior differ. No dependency or asset is removed without evidence across runtime registration, imports, routes, flags, styles, build configuration, and external consumers. [Verification](VERIFICATION.md) records the checks and limits.

## 2026-10-23 — Keep baseline failures visible

Add focused tests and a lightweight local-link check without weakening or replacing existing build/test/lint commands. The expanded review repaired the build with type imports and added fixture browser checks. Legacy test/lint targets still need repair. Successful focused tests cannot prove the whole app works. No performance improvement is claimed and no experiment is launched.

## 2026-10-23 — Refactor from whole-codebase evidence

Review every area, then change boundaries whose behavior can be characterized. Share repeated feature logic, delegate identical API operations to existing owners, and remove only unreachable reducer cases. Keep ambiguous payments, tenant configuration and desktop callback changes as findings in [REVIEW](REVIEW.md). The user chose local checks and fixtures; no live-accounting verification is claimed.
