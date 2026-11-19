# Live API captures

Operational memory for agents that must **run Giddh via API** against a real test company, using both UI and API repos.

## Company pack (current)

[`giddh-automation-api-doc/`](giddh-automation-api-doc/) — **Giddh Automation API DOC**

Start here:

1. [`giddh-automation-api-doc/AGENT-KNOWLEDGE.md`](giddh-automation-api-doc/AGENT-KNOWLEDGE.md)
2. [`giddh-automation-api-doc/ENTITY-REGISTRY.json`](giddh-automation-api-doc/ENTITY-REGISTRY.json)
3. [`giddh-automation-api-doc/CONTEXT.md`](giddh-automation-api-doc/CONTEXT.md)

Copy `secrets.example.json` → `secrets.local.json` (gitignored) and paste Session-Id.

## Non-negotiable

For this company’s accounting microservice traffic: **`voucherVersion=2`** query param on every relevant call.

**DocStar Draft_1 param documentation:** full collection upload **complete** (720 endpoints) — see `giddh-automation-api-doc/docstar-param-doc-upload-summary.json` and `DOCSTAR-SYNC-TARGET.md` in that folder.

**Every API call** (success **and** failed) must be saved under the company pack `requests/` + `responses/`. See `FAILURES.md` and `.cursor/rules/giddh-live-api-captures.mdc`.

Handoff after breaks: [`giddh-automation-api-doc/SESSION-HANDOFF.md`](giddh-automation-api-doc/SESSION-HANDOFF.md).
