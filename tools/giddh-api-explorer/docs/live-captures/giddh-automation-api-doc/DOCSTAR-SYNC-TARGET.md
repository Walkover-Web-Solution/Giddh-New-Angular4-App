# DocStar sync target (primary)

When API docs or sample responses change in this repo, **also update DocStar** in the workspace below (unless the user names a different collection).

**Host rule:** every DocStar endpoint URL and every public doc/curl example uses **`https://api.giddh.com`** — never `apitest.giddh.com`.

**Auth header prefill:** when an endpoint documents `Auth-Key` and/or `Session-Id`, use **`ENTER_YOUR_GIDDH_AUTH_KEY`** and **`ENTER_YOUR_GIDDH_SESSION_ID`** (see `docstar-auth-placeholders.json`). Bulk-apply on Draft_1: `_bulk_fix_docstar_auth_prefill.py` then republish.

**JavaDoc `{@link …}`:** never use raw Javadoc in endpoint names/descriptions. Sanitize with `docs/api/coverage/sanitize_javadoc.py` / `scripts/sanitize-javadoc.mjs`. After renaming, also **PUT `/orgs/83427/pages/{pageId}`** with `name`, `urlName`, and `meta.title` (`update_endpoint` does not change `urlName`). Slugs: `docstar-javadoc-urlname-fixes.json`. Republish so sidebar + reader cache refresh.

**Display success JSON:** replace `{ "reference": "SomeJavaClass" }` placeholders with realistic doc examples via `docs/api/coverage/display_success_samples.py` and `_apply_display_success_bodies.py`; DocStar upload: `docstar-display-success-patches.json` + `_apply_docstar_display_patches.py`.

**Query/body parameter docs:** auto-enrich catalog (`docs/api/coverage/auto_param_hints.py`, `_enrich_catalog_parameter_docs.py`); overrides in `docs/api/coverage/parameter_doc_overrides.json`. **Use live endpoint IDs:** refresh `docstar-live-endpoints-raw.json` (MCP GET `.../collections/-Jey39dCAAyx/endpoints`) → `_refresh_docstar_live_index.py` → `_build_docstar_param_patches.py` → `.docstar-param-batches/` (**720** patches). Do **not** use stale `docstar-endpoint-index.json` from old JSON exports (638/656 ids 404).

**Param upload status (2026-10-28):** **complete** — **720/720** endpoints updated via Cursor MCP `update_endpoint`, published (`docstar-param-doc-upload-summary.json`, progress `.docstar-param-run-progress.mcp.json`). **Re-apply after catalog/enrichment changes:** `prepare-missing-batch` + `record-missing-results` loop in `_docstar_param_mcp_apply_all.mjs` (see `_docstar_param_mcp_agent_instructions.md`); completion when **`ok >= total`**, then `publish_pages`. Do **not** use `_run_docstar_param_updates.mjs` / disabled SDK runner unless REST `hm_` token is verified; MCP is canonical in Cursor.

**Query vs body mistakes:** If the panel sends a field on the query string (e.g. voucher `type`, `page`, `count`, `voucherVersion=2`), document it under **params**, not in the JSON body. Add or extend `docs/api/coverage/parameter_doc_overrides.json`, run `_enrich_catalog_parameter_docs.py` + `_build_docstar_param_patches.py`, then MCP `update_endpoint` + `publish_pages`. Example fix: `POST .../vouchers/get-all-vouchers-balances` (`aZeDr2gyW6Xo`).

**Guides + sidebar grouping:** Guide pages (e.g. **Proforma**, **Estimation**) are type-1 pages; source Markdown lives in `docstar-guide-pages/`. Regenerate plan from catalog + live tree: refresh `docstar-collection-pages-flat.json` (`list_collection_pages`), then `python3 _plan_docstar_sidebar_regroup.py` → `docstar-sidebar-regroup-plan.json` (~72 endpoints under wrong top-level menu, e.g. proforma APIs under **Account**). Apply guide text: `node _apply_docstar_guides.mjs` then MCP `PUT .../pages/{pageId}` with `contents` + `publish_pages`. Move endpoints: `POST .../collections/-Jey39dCAAyx/dragAndDrop` (see plan file). Menu rules match `_draft_docstar_all.py` / Giddh API Explorer catalog paths.

**Public descriptions:** customer-facing only — no `Verified from …`, `Thrown in …`, or `*Exception raised by controller`. Use `publicize_endpoint_description()` / `publicize_sample_response_description()` in `sanitize_javadoc.py`. Draft builder: `_draft_docstar_all.py`. Apply to live DocStar: `.docstar-batches/batch-*.json` + `_apply_docstar_batches.py`; endpoints with no catalog draft match: `docstar-missing-followup-queue.json` + `_apply_docstar_followup.py`. Status: `docstar-public-descriptions-summary.json` (720 endpoints: 627 batch + 30 + 63 follow-up, Oct 2026).

| Field | Value |
| --- | --- |
| Org | `83427` — **Giddh testing prod** |
| Collection | `-Jey39dCAAyx` — **Giddh API Draft_1** (slug `giddh_api_draft_1`, public) |
| Root page | `u9XDYe5Zc_ds` |
| MCP connector | `https://mcp.docstar.io/connector/giddh_api_draft_1` |

## Dual-write checklist (every doc/API change)

1. **Repo:** live capture under `requests/` + `responses/`, both `catalog.json` files, `tools/giddh-api-explorer/docs/backend/giddh-api-v2.md` when applicable.
2. **DocStar:** find endpoint by method + URL (or catalog name), `PUT /orgs/83427/endpoints/{endpointId}` with indexed `pathVariables` / query params where the UI needs `"key"`.
3. **Publish:** `PATCH .../collections/-Jey39dCAAyx/bulkPublish` with `rootParentId` + changed `pageIds` when the user wants live docs updated.
4. **Payload stash:** optional `docstar-*-endpoint-payload.json` next to this folder for repeat uploads.

## Legacy (do not use for new sync unless asked)

| Org | Collection | Notes |
| --- | --- | --- |
| `12427` | `Qu2nsC5BQofh` | Old 404119-dvking draft; partial work (e.g. `Group List` `NOCtF7nEpQEf` unpublished). |

## Chat sync: Send Lead Data To Slack (2026-10-26)

- **POST** `https://api.giddh.com/send-data` — no auth headers
- DocStar endpoint **`PD8-mHU09nub`** (Send Data menu)

## Chat sync: Group List (2026-10-26)

- **GET** `https://api.giddh.com/company/:companyUniqueName/groups`
- DocStar endpoint **`Ntji3_cwAxYx`** — name **Group List**, full sample from `company-groups-list-nvlogiin.json`

## Chat sync: Customer Portal (2026-10-26)

- Menu page **`zIqGK5BZ5fh6`** — **18** exclusive customer-portal catalog APIs
- Create/publish log: `customer-portal-docstar-create-results.json` (`catalogId` → `endpointId`)
- Verification: `CUSTOMER-PORTAL-API-VERIFICATION.md`
