# UI experiments

Policy approved in Pushpendra's preparation brief, 2026-10-23. No experiment is launched by this preparation.

Use an experiment when there is a meaningful UI hypothesis: for example, whether a clearer invoice validation message reduces failed submissions. Keep one baseline and at most two challengers for a tested flow. Three variants is a maximum, not a target.

Before launch, record the hypothesis, owner, explicit experiment version, success metric, guardrails, stable assignment unit, exposure event, evaluation criteria, and rollback. Choose assignment with company/branch boundaries in mind, and verify that analytics and backend capabilities actually exist.

Evaluate periodically with sufficient evidence. An inconclusive result is valid. Version changes explicitly; do not silently edit a running variant. When retiring a loser, check references and saved state, remove its implementation safely, and retain the result and rationale in [decisions](DECISIONS.md).

The reviewed frontend has analytics integrations described in [contracts](CONTRACTS.md), but no verified experiment registry, stable assignment service, exposure schema, or evaluation/rollback system was found. These are future work, not working capabilities. Feature flags, tenant configuration, and inventory product variants are not evidence of UI experimentation infrastructure.
