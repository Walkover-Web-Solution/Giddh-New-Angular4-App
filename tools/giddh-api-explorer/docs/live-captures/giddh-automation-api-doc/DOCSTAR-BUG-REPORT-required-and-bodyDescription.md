# DocStar bugs to report — Required badges + bodyDescription UI

**Date:** 2026-10-29  
**Org:** `83427`  
**Collection:** `-Jey39dCAAyx` (Main)  
**Repro endpoint:** `zPXGO2aLVvVP` — [Get all vouchers](https://app.docstar.io/p/voucher/get-all-vouchers?collectionId=-Jey39dCAAyx)  
**Published version checked:** `43` (default)

MCP / REST **can write and persist** both `params.*.required: false` and rich `bodyDescription` (verified via GET endpoint + GET published-version). The **public docs UI does not render them correctly**. Please report these as DocStar product bugs (not Giddh content gaps).

---

## Bug 1 — Query / header params always show red “Required”

### Expected
When `params.<name>.required` is JSON boolean `false`, the REQUIRED column should show Optional (or blank), not Required.

### Actual
Public UI shows red **Required** for every query param (and typically headers), even when:

- Draft GET `/orgs/83427/endpoints/zPXGO2aLVvVP` has `"required": false` on all query params
- Default published snapshot version 43 has the same `"required": false`
- Descriptions correctly say “Optional.”

### Evidence (API store — published v43)

```json
"page": {
  "checked": "true",
  "value": "1",
  "description": "Page number (1-based). Default: 1. Optional.",
  "required": false
}
```

UI still labels `page` as **Required** while DESCRIPTION says Optional.

### Likely cause (hypothesis for DocStar)
Docs renderer ignores `required` and treats `checked: "true"` (include-in-example) as Required, **or** always paints Required for listed params.

### Impact
Affects essentially **all** endpoints in this collection after the param reapply (787/787) that set boolean `required: false` for optional query params.

### MCP note
Setting `required` via PUT works and persists. **MCP cannot fix the UI badge.** Dedicated `update_endpoint` tool also works for `params`, but the display bug remains after publish.

---

## Bug 2 — `bodyDescription` descriptions not shown in Request body table

### Expected
For each key in `bodyDescription`, the Description tab of **Request body `application/json`** should show `bodyDescription.<key>.description` (and enums / allowed values when provided).

### Actual
After PUT + `publish_pages`:

- Endpoint draft and published v43 both contain 34 `bodyDescription` entries with full text (e.g. `balanceStatus` lists `paid`, `unpaid`, `partial-paid`, `hold`, `cancel`)
- Public UI Description column still shows **—** for those keys
- Example JSON tab **does** show updated example (`balanceStatus: ["paid","partial-paid","unpaid","hold"]`, etc.)

### Evidence

**Published v43 includes:**

```json
"balanceStatus": {
  "type": "array",
  "description": "Payment/balance statuses to include. Case-insensitive; backend uppercases. Allowed: paid, unpaid, partial-paid (PARTIAL-PAID), hold, cancel. Panel Advance Search uses lowercase. Optional.",
  "value": ["paid", "partial-paid", "unpaid", "hold"]
}
```

**UI row (DOM):** `balanceStatus array<string> —` (description dash only).  
`document.body.innerText` does **not** contain the stored description string `"Payment/balance statuses"`.

### MCP notes

1. Dedicated MCP tool `update_endpoint` **input schema omits `bodyDescription`** (OpenAPI requestBody schema also omits it), even though the prose docs say the field is supported. Prefer raw PUT `call_any_api_of_docstar` → `PUT /orgs/:orgId/endpoints/:endpointId` with `bodyDescription`.
2. Earlier publish snapshots (v1–v42) had `bodyDescription: null` / missing; v43 has the object after a successful PUT + bulk publish. So persistence works; **UI rendering does not**.
3. Agents cannot “fix” empty description dashes by writing more content while the renderer ignores `bodyDescription.description`.

### Impact
All endpoints that rely on `bodyDescription` for field docs look undocumented in the UI (dashes), even when the API has correct copy. Example gap users notice: Advance Search statuses `paid` / `partial-paid` / `unpaid` / `hold` not visible in the table.

**Note:** Panel-only `amountOperator` is **not** a VoucherFilter body field; it maps to `balanceEqual` / `balanceMoreThan` / `balanceLessThan` (or `total*`). Document that in description text — do not invent it as an API key unless DocStar adds a freeform notes field.

---

## What we verified works (so this is not an auth / write failure)

| Action | Result |
|--------|--------|
| PUT params with `"required": false` (JSON boolean, not string `"false"`) | Persists on draft + publish |
| PUT `bodyDescription` with type/description/value | Persists on draft |
| `publish_pages` / bulkPublish | Creates new default published version including `bodyDescription` |
| Public docs Required column | Still wrong |
| Public docs body Description column | Still `—` |

---

## Suggested DocStar fix checklist

1. Render REQUIRED from `params.*.required` / `headers.*.required` (boolean), not from `checked`.
2. Render body Description from `bodyDescription.<key>.description` on the Description tab.
3. Align MCP `update_endpoint` schema + OpenAPI requestBody with the documented `bodyDescription` field so agents can update it without raw PUT.
4. Add a regression page: optional query param (`required: false`) must not show Required; body key with non-empty description must not show `—`.

---

## Minimal repro for DocStar eng

1. Open endpoint `zPXGO2aLVvVP` (or any endpoint with `params.page.required === false`).
2. GET `https://api.docstar.io/published-version/zPXGO2aLVvVP` → default version → confirm `required: false` and nonempty `bodyDescription.balanceStatus.description`.
3. Open https://app.docstar.io/p/voucher/get-all-vouchers?collectionId=-Jey39dCAAyx  
   - Query: `page` shows Required + “Optional.” in description.  
   - Request body → Description: `balanceStatus` shows `—`.
