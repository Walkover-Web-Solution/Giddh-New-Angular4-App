# Why Giddh exists

Giddh is bookkeeping and accounting software. A person signs in, chooses a company and branch, records business transactions, and reviews the resulting accounts. This describes the current product, supported by the [login screen](../apps/web-giddh/src/app/login/login.component.html), [routes](../apps/web-giddh/src/app/app.routes.ts), and [journeys](FLOWS.md).

The likely users are people responsible for a business's books: owners, accountants, and finance staff. That is an inference from the workflows, not an approved ICP or market strategy. Company size, priority markets, and commercial success targets need product-owner confirmation; see [open questions](OPEN_QUESTIONS.md).

## Approved development direction

Pushpendra's preparation brief, 2026-10-23, establishes this working model: humans provide vision, problems, priorities, and feedback; AI understands the product, implements changes, verifies them, and maintains the knowledge the next agent needs.

The intended experience is concrete: a fresh agent can trace an invoice request from a screen to its API, identify the affected permissions, and find the checks without reconstructing an old conversation.

For this preparation, priorities are clearer responsibilities, evidence-backed cleanup, recoverable changes, and a trustworthy map. Preserve appearance, behavior, permissions, API contracts, analytics, saved preferences, and existing SEO. Framework migrations, redesigns, and new experiments are outside this change.

## Product direction still to confirm

The repository demonstrates invoicing, ledgers, inventory, reports, tax workflows, company administration, web, Electron, and white-label support. Existing functionality is not proof that every feature is a strategic priority.

No approved product roadmap, ranked customer problems, long-term non-goals, or numerical success measures were found in the reviewed repository documentation. Do not invent them. Until they are supplied, evaluate requests against the known accounting journeys and the explicit preservation boundaries above. Record proposals as proposals; change approved direction only with appropriate authorization.

For preparation itself, success means the next agent can find this purpose, trace a journey, choose the correct implementation area, and run relevant checks with their limitations understood. [Verification](VERIFICATION.md) records that assessment.
