# Giddh API Explorer

A self-contained local UI for the backend-verified Giddh API catalog.

## Features

- Search and filter all backend routes and frontend API usage.
- Edit path, query, header, JSON payload, and multipart file fields.
- Choose the HTTP verb for backend routes mapped to any method.
- Configure base URL, company, branch, `Auth-Key`, `Session-Id`, and `Origin` (persisted in local storage).
- Prefill environment from shareable query params (`base_url`, `companyUniqueName`, `branchUniqueName`, `origin`), then strip them from the URL. Auth keys are never accepted from the URL.
- Share an environment URL that excludes `Auth-Key` / `Session-Id`.
- Mobile-friendly catalog / request panels.
- Run requests through a local proxy, avoiding browser CORS restrictions.
- View status, timing, headers, JSON/text, and binary base64 responses.
- Copy live curl commands.
- Export one API or the current filtered result as a Postman Collection v2.1.
- Open the synchronized Markdown documentation.

## Run

Node.js 18 or newer is required. No package installation is needed.

```bash
npm start
```

Open:

```text
http://127.0.0.1:4310
```

Use another port:

```bash
PORT=4400 npm start
```

## Refresh documentation

From the frontend repository root:

```bash
node scripts/generate-backend-verified-api-docs.mjs
```

Enrich **query / body field descriptions** (backend + frontend hints, manual overrides in `docs/api/coverage/parameter_doc_overrides.json`). This updates both `docs/api/coverage/catalog.json` and this app’s `public/data/catalog.json`:

```bash
python3 docs/api/coverage/_enrich_catalog_parameter_docs.py
```

Then from this project:

```bash
npm run sync
```

`npm run sync` copies Markdown and the canonical catalog from `docs/api/` into `tools/giddh-api-explorer/`. Run enrich + sync after catalog or override changes, then restart the server.

**DocStar parity:** published param docs for **Giddh API Draft_1** (720 endpoints) were built from the same catalog enrichment pipeline — see `docs/api/live-captures/giddh-automation-api-doc/DOCSTAR-SYNC-TARGET.md`.

**DocStar guides & grouping:** Explorer catalog paths drive DocStar sidebar rules (`_draft_docstar_all.py` → `menu_for`). Guide copy for **Proforma** / **Estimation** is maintained in `docs/api/live-captures/giddh-automation-api-doc/docstar-guide-pages/` (workflows, auth, links to API reference). To refresh a guide after catalog changes: edit those Markdown files, run `node _apply_docstar_guides.mjs` in that folder, apply via DocStar MCP (signed-in), then `publish_pages`. To fix API reference grouping (endpoints under the wrong menu), run `_plan_docstar_sidebar_regroup.py` and apply `dragAndDrop` moves from `docstar-sidebar-regroup-plan.json`.

## Proxy safety

The local proxy accepts targets on:

- `localhost`
- `127.0.0.1`
- `::1`
- `giddh.com` and `*.giddh.com`

Allow another development hostname explicitly:

```bash
GIDDH_API_EXPLORER_ALLOWED_HOSTS=api.internal.example npm start
```

Sensitive headers are not logged. Browser environment values are saved only in local storage.

## Test

```bash
npm test
```
