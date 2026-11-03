# Working on Giddh

Giddh is an accounting workspace with shared web and Electron frontend code. Start with [vision](docs/VISION.md) and [architecture](docs/ARCHITECTURE.md). Then read only the context your change needs:

<!-- middleware:guidance:start -->
## Guidance for this kind of repository

Kept by the middleware (version 046fbf2131b2). Read these before changing anything here:
- [docs/guidance/product-ui.md](docs/guidance/product-ui.md)
<!-- middleware:guidance:end -->

| Task | Read next |
| --- | --- |
| Change a user journey | [Flows](docs/FLOWS.md), [contracts](docs/CONTRACTS.md) |
| Change a screen or shared control | [Design](docs/DESIGN.md), existing [Angular/CSS rules](.cursor/rules/angular-giddh-coding-rules.mdc) |
| Run, test, or prepare a release | [Development](docs/DEVELOPMENT.md), [verification](docs/VERIFICATION.md), [review findings](docs/REVIEW.md) |
| Propose a UI experiment | [Experiments](docs/EXPERIMENTS.md) |
| Understand a tradeoff or missing fact | [Decisions](docs/DECISIONS.md), [open questions](docs/OPEN_QUESTIONS.md) |

## Essential boundaries

- Preserve accounting payloads, company/branch scope, permissions, routes, saved preferences, analytics, appearance, and SEO unless the request explicitly changes them. Branch-route restrictions and role permissions are separate checks.
- Apply the existing [Angular/CSS rules](.cursor/rules/angular-giddh-coding-rules.mdc) to web changes. They remain authoritative for modern Angular, typed code, no new silent fallbacks, accessibility, and utility reuse; do not migrate working RxJS just to modernize it.
- Check [CSS utilities](apps/web-giddh/src/assets/styles/CSS_UTILITIES.md) before adding styles. Preserve tenant branding and desktop behavior.
- Client types describe frontend expectations, not verified backend guarantees. Confirm capabilities before relying on them. Never fabricate a working endpoint.
- Preserve unrelated staged, unstaged, and untracked work. Use a separate checkout when needed; do not auto-stash, reset, clean, or commit another person's edits.
- Before deleting code, dependencies, or assets, check registration, dynamic imports, routes, flags, styles, build configuration, and external consumers. Keep uncertain candidates.
- Never commit credentials or generated environment files. Local configuration can contact a production UK API; use an approved sandbox for data-changing checks.
- Follow the existing [contribution and release instructions](README.md#contributing-guide), with the [documented pipeline discrepancies](docs/DEVELOPMENT.md#release-and-recovery) resolved before release. Do not merge or deploy without authorization.

## Commands

From the repository root, after [setup](docs/DEVELOPMENT.md#setup-and-local-checks):

```sh
npm run check:ai
npm run check:types
npm run build
```

Focused checks, type checking, the local web build and fixture browser checks pass. Existing `npm test` and `npm run lint` still have known failures; [verification](docs/VERIFICATION.md) states exactly what is and is not covered. A docs check proves links resolve, not that every claim is true.

## Each future change

Treat the request as raw thoughts: infer the underlying problem and write concise acceptance criteria. Read the overview and relevant documents, check alignment with product direction, and explain conflicts with a better alternative when needed.

Trace effects across connected features, shared components, complete journeys, permissions, APIs, and analytics. Verify backend support; record missing contracts and continue work that does not depend on them.

Implement within existing authorization, verify affected behavior against its baseline, and update the owning docs and diagrams in the same change. Record evidence and lessons; change approved direction only with appropriate authorization. During substantial work, keep a short progress note in the task workspace with decisions, checks, and the next step so another agent can resume.
