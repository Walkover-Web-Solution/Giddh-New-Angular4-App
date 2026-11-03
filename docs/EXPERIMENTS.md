# UI experiments

Policy approved in Pushpendra's preparation brief, 2026-10-23. No experiment is launched by this preparation.

Use an experiment when there is a meaningful UI hypothesis: for example, whether a clearer invoice validation message reduces failed submissions. Keep one baseline and at most two challengers for a tested flow. Three variants is a maximum, not a target.

Before launch, record the hypothesis, owner, explicit experiment version, success metric, guardrails, stable assignment unit, exposure event, evaluation criteria, and rollback. Choose assignment with company/branch boundaries in mind, and verify that analytics and backend capabilities actually exist.

Evaluate periodically with sufficient evidence. An inconclusive result is valid. Version changes explicitly; do not silently edit a running variant. When retiring a loser, check references and saved state, remove its implementation safely, and retain the result and rationale in [decisions](DECISIONS.md).

The reviewed frontend has analytics integrations described in [contracts](CONTRACTS.md). Feature flags, tenant configuration, and inventory product variants are not evidence of UI experimentation infrastructure.

## Recording through the middleware

Assignment and event recording use the middleware's experiment snippet, kept once in [middleware-experiments.ts](../apps/web-giddh/src/app/shared/helpers/middleware-experiments.ts) and covered by [its focused test](../scripts/tests/ui-middleware-experiments.test.cjs). No experiment is defined or started in code: the owner defines and starts each experiment (key, variants, goal) in the middleware, which refuses events for experiments that are not running. The middleware's allowed origins are `https://giddh.com` and `https://books.giddh.com`; Electron and local origins are not allowed, so do not expect their events to be recorded.

- `mwVariant(experiment, variants)` hashes a browser visitor id (`mw_visitor` in local storage) into a variant, synchronously. Pass the variants exactly as defined in the middleware, in order, control first; on any error it returns the control. Read it once when the component is created (for example a `readonly` field) and render from it immediately; never fetch it, hide content, or show a loader while deciding.
- `mwSend({ event: 'exposure', experiment, variant })` when the variant is actually shown, and `mwSend({ event: 'conversion', experiment, variant, goal })` when the goal is reached. It is fire-and-forget (beacon, then a 3 s fetch fallback that stops after a failure): never await it, never call it from a render loop or template, and call it after, not before, the user's own action such as navigation or submit.

```ts
import { mwSend, mwVariant } from '../shared/helpers/middleware-experiments';

readonly ctaVariant = mwVariant('hero-cta', [['control', 50], ['b', 50]]);

ngOnInit(): void {
    mwSend({ event: 'exposure', experiment: 'hero-cta', variant: this.ctaVariant });
}
```

The assignment unit is the browser, not the company, branch, or user; account for that when an experiment must respect company/branch boundaries. Evaluation and rollback remain the owner's work in the middleware.
