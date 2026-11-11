# Status

Working map of features touched by agents. Update the affected row, append a change-log line, and set **Reviewed up to commit** in the same change.

| Item | State | Notes |
| --- | --- | --- |
| Inventory Job Work create/update/report | 🟡 | Client wired to `v2/.../job-work-orders` from Postman collection. Stock search reuses Manufacturing `stocks/v2`. Batch tracking reuses Manufacturing chip list + Select Batches dialog for finished/raw/scrap when company batch management is enabled. Edit View maps GET `documentItems`/`jobWorkDetails` into the create form. List has column search (Job Work No / Jobworker / Output Stock → `q`), Advance Filter, filter restore via `JobWorkListStateService`, `go-to-branch`, status badges including DISPATCHED, GSTIN format validation, and `mobile-number-input`. Create payload includes `stockUnitUniqueName`. Export / Revert / Preview&Record Return deferred. Backend list/action response guarantees still unverified. |

## Change log

- 2026-11-11: Prod readiness pass — preserve edit stock/unit options after search, send `stockUnitUniqueName`, tighten GSTIN/date/warehouse validation, restore list filters without date overwrite, bind list to `body.items`, scrap rate/unit seeding, mobile-number-input on create.
- 2026-11-07: Added Job Work create batch support (finished inbound, raw outbound, scrap inbound) via shared BatchChipList / BatchSelectDialog when inventory batch management is enabled.
- 2026-11-07: Migrated Job Work create to Angular 21 (`inject`, `signal`/`computed`, `toSignal`, `DestroyRef`/`takeUntilDestroyed`).
- 2026-11-07: Aligned Job Work create layout with Manufacturing (same card/table/button patterns; dropped one-off valuation/table classes).
- 2026-11-06: Added Inventory > Job Work module (create, edit, list/report + supported actions), `JobWorkService`, locales, and sidebar entry. Commit baseline `c91a081f830c7a6317d5d2f7475f468a55bc050e`.

## Reviewed up to commit

`uncommitted` (staged Job Work feature on `14zkq6bdpth-prod`; update after merge commit)
