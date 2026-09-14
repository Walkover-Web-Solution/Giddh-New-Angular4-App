# Inventory Settings Implementation

## Changes made

- Added the standalone Inventory Settings page at `/pages/inventory/v2/setting`.
- Added GET/PUT inventory settings integration and the business-document status lookup API.
- Added typed API models and categorized status multi-select controls with API-prefilled values.
- Added inventory sidebar and all-items navigation entries.
- Added English, Hindi, and Marathi translations.

## Files modified

- `inventory-settings.component.ts` and `inventory-settings.component.html`
- `new-inventory.routing.module.ts`
- `inventory-sidebar.component.ts`
- `inventory.service.ts` and `apiurls/inventory.api.ts`
- `models/api-models/InventorySettings.ts`
- Inventory, all-items, sidebar-menu, and inventory/settings locale JSON files

## Implementation decisions

- The business-document status endpoint uses the active company unique name and `documentType=DC`.
- Status options are grouped by `defaultStatusCategory`.
- GET status-stage category arrays are flattened in OPEN, IN_PROGRESS, COMPLETED order for the PUT payload.
- Cancel restores the last settings loaded from the API.

## Reused project elements

- `multi-select-dropdown`
- Angular Material form fields, selects, slide toggles, and buttons
- `appTranslate`, `giddh-page-loader`, Bootstrap grid, and existing utility classes

## Notes for the next AI agent

- No component-specific stylesheet was required.
- If the backend introduces a separate Receipt Note status endpoint, load its options independently instead of sharing the DC status list.
