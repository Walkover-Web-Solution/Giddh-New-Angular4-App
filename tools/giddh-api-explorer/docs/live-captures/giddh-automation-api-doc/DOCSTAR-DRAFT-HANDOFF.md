# Docstar draft handoff — paused 2026-10-23

Resume this before any new Docstar writes. Nothing here is published. https://giddh.com/api is unchanged.

## Goal

Update client-facing Giddh API docs in Docstar as **draft only**, for APIs used by the Giddh panel, website, customer portal, and magic link. Short instructions. No `t`, `z`, or `lang` query params. Client and agent friendly.

## What exists

| Item | Value |
| --- | --- |
| Owner workspace | org `12427` (404119-dvking) |
| Draft collection | `Qu2nsC5BQofh` — **Giddh API Draft**, slug `giddh_api_draft` |
| Public | `isPublic: false`. No custom domain. |
| Root page | `UaD_rrskJXGB` |
| Endpoints created | about **37**, all `state` 1, `isPublished` false |
| Live site | org `11326`, collection `MzcxumU2s93K`, https://giddh.com/api — **do not write** |

Draft section pages (all `state` 1):

| Section | Page id |
| --- | --- |
| Voucher | `3ZbfQExiaTWU` |
| Master | `eCwvzd6AImAg` |
| Inventory | `qYHSi8R8nFgy` |
| Reports | `u5gKNMlRl-3w` |
| Entry | `2C8cYtBs0cvY` |
| India Tax | `-d3uEbvFXG3N` |
| Purchase Order | `Tzbf9HQc0xXn` |
| Proforma | `xwzlMhVUcCUI` |
| Estimation | `X__hfNxx0erg` |
| Customer Portal | `VgAmTJbqjWpa` |
| Magic Link | `So3xwl7_76Qn` |
| Website | `R4zC68ikZEIH` |
| Other APIs | `ddCMUoxiBODF` |

## Files

- `docstar-draft-payloads.json` — 678 bodies (`updates` 72, `creates` 606). This is the source of truth.
- `_build_docstar_drafts.py` — rebuilds that JSON from `docs/api/coverage/catalog.json` and `Giddh API Reference (1).json`.
- `/tmp/docstar-slices/slice-*.json` — temporary. Lost on reboot. Do not depend on them.

Scope in the builder: `classification == frontend-used`, plus any record tagged `giddh-panel`, `giddh-website`, `customer-portal`, or `magic-link`.

## How a create works

`POST https://api.docstar.io/orgs/12427/pages/{pageId}/endpoints`

Header `proxy_auth_token` empty so the Docstar MCP fills the token. Body from the payload. Force `state: 1`. Never send `state: 2`. Never call Update Endpoint State.

List what is already there before creating more:

`GET https://api.docstar.io/orgs/12427/collections/Qu2nsC5BQofh/endpoints`

Skip a payload when method + URL already exist (one duplicate “Perform Bulk Action” and one duplicate “Generate Invoice” were created).

## Blockers

- Org `11326` rejects every write: “Write operations are not allowed for users in SSO organizations.”
- A second collection or JSON import returns `SSO_SINGLE_COLLECTION_RESTRICTION`. Add endpoints only to `Qu2nsC5BQofh`.
- Four parallel upload slices stalled (“Connection stalled repeatedly”) after roughly 36 creates. Small sequential batches are safer than parallel agents.
- Switching company via MSG91 can be auto-review blocked. Direct creates on `/orgs/12427/pages/.../endpoints` still succeeded while the session company was the SSO org.

## Next session

1. List collection endpoints and skip ones already created.
2. Create the remaining payloads into the section pages above, draft only, a few at a time.
3. Keep `isPublic` false. Do not publish. Do not attach `giddh.com`.
4. Copying this draft onto the live giddh.com/api collection needs a non-SSO admin on org `11326`.
