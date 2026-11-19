# DocStar API Guides status

**Updated:** 2026-10-29 (singles complete + bulk publish)

## Live

- Hub: https://app.docstar.io/p/api-guides?collectionId=-Jey39dCAAyx
- Getting Started + one guide per API Reference module (Account, Auth, Voucher, GST, …)
- Estimation / Proforma guides nested under API Guides
- Hub index lists all module guides

## Cleanup

- Parallel creates produced duplicate slugs; **37** duplicates soft-deleted (see `.docstar-api-guides-dedupe-results.json`).

## Singles (call-any MCP batch)

- **48/48** module guides from `.docstar-api-guides-call-any-singles/` are present under hub `meihjCKoWw2i` (canonical `guide-*` slugs; some live URLs use `-1`/`-2` suffixes from earlier creates).
- **`publish_pages`** ran for hub + **155** `guide-*` children + collection root (`u9XDYe5Zc_ds`); see `.docstar-api-guides-singles-publish-result.json`.

## Notes

- Guides = orientation + endpoint lists with links into **API Reference** schemas.
- Prefer API Reference for exact query/body fields.
