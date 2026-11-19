# Estimation

**Estimates** (quotations) in Giddh are voucher types used before invoicing. The panel lists, creates, versions, and converts them through voucher APIs. Integrations should call **`https://api.giddh.com`** with **`Auth-Key`** or **`Session-Id`**.

## Core conversion API

| Goal | API in this collection |
| --- | --- |
| Convert estimate → sales invoice (v3, multicurrency-aware) | **Convert Estimate into Invoice with multicurrency support** — `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate` |

## Typical workflow

1. **List estimates** — `POST .../vouchers/v3/estimates/all` (query: `from`, `to`, `page`, `count`, `branchUniqueName`; body often `{}` or filter object). See **Voucher** menu for the exact published endpoint.
2. **Optional: version history** — `POST .../v2/.../estimates/versions/all` with `estimateNumber` in the body when the panel shows versions.
3. **Convert to invoice** — `v3/generate-via-estimate` with estimate identifiers in the body.
4. **Optional: proforma first** — use the **Proforma** guide (`proformas/generate-via-estimate`) if the business flow is estimate → proforma → invoice.

## Authentication

Same as the rest of Giddh API Draft_1:

- **`Auth-Key`** or **`Session-Id`** (one required).
- **`branchUniqueName`** query param when the company uses branches.

## Request tips

- Dates in API payloads are usually **`dd-MM-yyyy`** unless the endpoint documents otherwise.
- For voucher generate/update paths on the automation API doc company, include **`voucherVersion=2`** on accounting-microservice URLs when the Angular app sends it.
- Body fields for conversion often include **`estimateNumber`**, **`voucherType`**, currency / exchange fields for multicurrency companies — see the endpoint’s **params** and **body** tabs in API reference.

## Panel ↔ API map

| Panel | API hint |
| --- | --- |
| Estimate list / filters | `estimates/all`, voucher get-all with type |
| Estimate → invoice | `v3/generate-via-estimate` |
| Estimate → proforma | Proforma guide |
| Numbering / PDF | Company **estimateSettings** under Settings APIs |

## See also

- [Proforma](./proforma) — proforma generation and invoice from proforma.
- **Voucher** menu — get-all, generate, adjust, mail, export.
