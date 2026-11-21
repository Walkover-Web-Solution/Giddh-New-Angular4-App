# QA report — Giddh API documentation (ClickUp 14zkq6bd63b)

**Collection:** [Giddh API Draft_1](https://app.docstar.io/p?collectionId=-Jey39dCAAyx) (`-Jey39dCAAyx`, org `83427`)  
**Checked against:** published pages on 2026-11-20/21, repo artifacts on branch `cursor/giddh-panel-angular-fix-the-api-documentation-so-post-requests-include-their-req-f68b`  
**Evidence:** screenshots on Create Tag (`/p/tags/create-tag`); automated reviews in [DOCSTAR-MISSING-BODY-REVIEW.md](DOCSTAR-MISSING-BODY-REVIEW.md), [DOCSTAR-REAL-RESPONSES-REVIEW.md](DOCSTAR-REAL-RESPONSES-REVIEW.md)

## Summary

| Issue from QA | Status | Notes |
| --- | --- | --- |
| POST requests missing request body (e.g. Create Tag) | **Fixed on DocStar** (2026-11-20) | 64 write endpoints updated; Create Tag `IKqWuu9To2sn` published with JSON body + `Content-Type: application/json`. See [docstar-missing-body-apply.json](docstar-missing-body-apply.json). |
| Auth-Key / company unique name not shared across pages | **Open** | Per-endpoint path params and header prefills; readers re-enter on every page. Fix: published [DocStar environment](https://docstar.io/help/api-documentation/environments) + header/URL `{{variables}}`. Script: [_setup_docstar_giddh_public_environment.py](_setup_docstar_giddh_public_environment.py). |
| (New) cURL / TRY URL missing path after `companyUniqueName` | **Open — verify live** | On Create Tag, cURL shows `…/company/:companyUniqueName/` but the route is `POST /company/{companyUniqueName}/tags`. Request body is present; URL in the snippet may be wrong or a DocStar export bug. Audit: [_audit_docstar_published_urls.py](_audit_docstar_published_urls.py) (needs `hm_` token). |
| (New) Sidebar scroll position vs active page | **Cosmetic** | Screenshots show Voucher section highlighted while viewing Tags/Create Tag; confirm reader routing only. |
| (New) 210 endpoints still manual-only examples | **Tracked** | [DOCSTAR-MANUAL-FOLLOWUP.md](DOCSTAR-MANUAL-FOLLOWUP.md) (OTP, portal session, payments, gov filing, etc.). |

## Original issues — detail

### Missing POST bodies

Before 2026-11-20, 96 of 399 write pages had no body; many also lacked `Content-Type`, so TRY/cURL sent form data and Giddh returned `UNSUPPORTED_MEDIA_TYPE`.

**Create Tag**

- Expected: `POST https://api.giddh.com/company/{companyUniqueName}/tags` with `{"name","description?"}`.  
- Repo fix row: `tags/create-tag`, endpoint id `IKqWuu9To2sn`, verdict `json` in [docstar-missing-body-apply.json](docstar-missing-body-apply.json).  
- **Current published UI:** request body table and JSON example are visible (QA screenshots 2026-11-20).

### Repeated Auth-Key and company name

DocStar stores `Auth-Key`, `Session-Id`, and path placeholders **per endpoint**. `_bulk_fix_docstar_auth_prefill.py` only sets the same **static** placeholders (`ENTER_YOUR_GIDDH_*`) on every page; it does **not** sync values when a reader fills one page and moves to another.

**Intended fix (aligned with DocStar docs):**

1. Global environment `Giddh API (Try it)` — [docstar-giddh-try-environment.json](docstar-giddh-try-environment.json).  
2. Publish a **public environment** on the collection (Settings → Public Environment): `companyUniqueName`, `Auth-Key`, `Session-Id` marked editable; never publish real secrets.  
3. Wire endpoints to `{{companyUniqueName}}` in URLs and `{{Auth-Key}}` / `{{Session-Id}}` in headers where applicable (`_wire_docstar_try_variables.py`).

## New issues (beyond the ClickUp card)

1. **Truncated cURL URL on Create Tag** — Confirm stored `URL` on `IKqWuu9To2sn` ends with `/tags`. If correct in API but wrong in cURL, escalate to DocStar support with collection/page ids.  
2. **Mixed auth guidance** — Some routes need portal `Session-Id` only; pages document this in notes but the TRY panel still lists both headers; consider hiding `Auth-Key` on customer-portal endpoints when republishing.  
3. **Duplicate / legacy routes** — e.g. Patch Voucher V4 path corrected in repo; spot-check other voucher v1/v2 duplicates listed in manual follow-up.

## Acceptance criteria (for closing QA)

- [x] Create Tag (and other fixed write endpoints) show JSON request body and `Content-Type: application/json` on published docs.  
- [ ] Public environment visible on published collection; one entry for `companyUniqueName` and editable auth headers reused on TRY across pages.  
- [ ] cURL for Create Tag uses full path including `/tags` (or DocStar ticket filed with evidence).  
- [ ] QA sign-off recorded on ClickUp with link to this file.

## Apply checklist (maintainer)

```bash
export DOCSTAR_HM_TOKEN_FILE=/path/outside/repo/hm_token.txt   # never commit

# 1) Create/update global environment
python3 _setup_docstar_giddh_public_environment.py --publish-env

# 2) Optional: re-apply static header hints (legacy)
python3 _bulk_fix_docstar_auth_prefill.py

# 3) Wire {{variables}} on endpoints (dry-run first)
python3 _wire_docstar_try_variables.py --dry-run
python3 _wire_docstar_try_variables.py --publish

# 4) Audit URLs vs catalog paths
python3 _audit_docstar_published_urls.py > docstar-url-audit.json

# 5) Publish collection pages touched by steps 2–3
#    (scripts call bulkPublish when --publish is passed)
```

Manual step: DocStar UI → collection **Settings → Public Environment** → select **Giddh API (Try it)** → tick `companyUniqueName`, `Auth-Key`, `Session-Id` (editable, empty defaults) → **Publish Environment**.