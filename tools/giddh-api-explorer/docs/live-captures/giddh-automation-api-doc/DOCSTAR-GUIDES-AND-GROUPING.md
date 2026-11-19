# DocStar guides and API reference grouping

Collection **Giddh API Draft_1** (`83427` / `-Jey39dCAAyx`) has two sidebar modes:

- **API reference** — 720 endpoint pages (type 4) under ~81 module pages (type 1), e.g. Account, Voucher, Auth.
- **Guides** — narrative pages (type 1 at collection root), e.g. **Proforma**, **Estimation**.

## Problem (Oct 2026)

- Guide **markdown is ready** in `docstar-guide-pages/` (Proforma ~3k chars, Estimation ~2.3k). DocStar pages still need **PUT + publish** once MCP is signed in (`_apply_docstar_guides.mjs` lists page ids).
- Some endpoints sit under the wrong module (e.g. proforma convert APIs under **Account** instead of **Proforma** / **Voucher**).
- Large modules (**Account** ~80 direct children) are hard to scan.

## Source of truth

| Artifact | Role |
| --- | --- |
| `docs/api/coverage/catalog.json` | Backend + frontend-used routes, param descriptions |
| `tools/giddh-api-explorer/public/data/catalog.json` | Same catalog (run `npm run enrich-params` + `npm run sync` in Explorer) |
| `_draft_docstar_all.py` | `menu_for(path)` rules for sidebar module names |
| `docstar-live-endpoint-index.json` | Live DocStar endpoint id → URL |
| `docstar-collection-pages-flat.json` | Snapshot of sidebar tree (`list_collection_pages`) |

## Refresh guides (Markdown)

1. Edit `docstar-guide-pages/*.md` (workflows, tables, links to API paths).
2. `node _apply_docstar_guides.mjs` — prints MCP `PUT` targets.
3. In Cursor with **DocStar MCP signed in**: `PUT /orgs/83427/pages/{pageId}` body `{ "contents": "<markdown>" }`.
4. `publish_pages` with guide `pageId` + root `u9XDYe5Zc_ds`.

## Regroup API reference

1. Refresh `docstar-collection-pages-flat.json` via `list_collection_pages`.
2. `python3 _plan_docstar_sidebar_regroup.py` → `docstar-sidebar-regroup-plan.json`.
3. For each misplaced endpoint, `POST /orgs/83427/collections/-Jey39dCAAyx/dragAndDrop` with `draggedId`, `droppedOnId`, `pageIds` (see [Move Page](https://developers.docstar.io/pages/move-page.openapi.yml)).
4. Empty guide modules: create a type-3 subpage under the guide (e.g. “Related endpoints”), then move endpoints under that parent.

## Proforma / Estimation (current catalog)

| Flow | Method + path |
| --- | --- |
| Proforma from estimate | `POST /v3/company/.../proformas/generate-via-estimate` |
| Invoice from proforma | `POST /company/.../v3/generate-via-proforma` |
| Invoice from estimate | `POST /company/.../v3/generate-via-estimate` |

Full guide text: `docstar-guide-pages/proforma.md`, `estimation.md`.
