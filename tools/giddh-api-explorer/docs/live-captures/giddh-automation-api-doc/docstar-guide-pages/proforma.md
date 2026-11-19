# Proforma

Proforma invoices are **quotations with a formal proforma number** in Giddh. They sit in the same voucher pipeline as sales invoices but are used before a final tax invoice is issued. The panel uses these APIs with **`Auth-Key`** or **`Session-Id`**, base URL **`https://api.giddh.com`**, and usually **`branchUniqueName`** on the query string when working in a branch.

## When to use which API

| Step | What you need | API in this collection |
| --- | --- | --- |
| Create proforma from an estimate | You already have an estimate number | **Generate proforma via estimate** — `POST /v3/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas/generate-via-estimate` |
| Convert proforma to sales invoice | Proforma is approved; create invoice v3 | **Convert Proforma into Invoice version 3** — `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma` |

Related flows (see **Estimation** guide and **Voucher** menu): listing estimates/proformas often uses **`POST .../vouchers/v3/estimates/all`** or **`POST .../vouchers/get-all`** with voucher `type` and date filters; converting estimate → invoice directly uses **`generate-via-estimate`**.

## Authentication

Send **one** of:

- **`Auth-Key`** — company API key (integrations, automation).
- **`Session-Id`** — browser session from the Giddh panel.

Use placeholders `ENTER_YOUR_GIDDH_AUTH_KEY` / `ENTER_YOUR_GIDDH_SESSION_ID` in DocStar; never commit live keys.

## Common request patterns

### Generate proforma from estimate

- **Path:** `companyUniqueName`, `accountUniqueName` (customer).
- **Body (typical):** `estimateNumber`, optional `estimateVersionNumber`, `proformaNumber`, `voucherType`, `emailId[]`, `generateEInvoice`.
- **Accounting MS:** pass **`voucherVersion=2`** when the UI does (company default for automation doc company).

### Convert proforma to invoice (v3)

- **Path:** same account context as other voucher generate calls.
- **Body:** include **`proformaNumber`** (and fields required by your voucher template / multicurrency setup).
- Use the **API reference** entry for full query params and body field descriptions.

## Panel ↔ API map

| Panel area | API hint |
| --- | --- |
| Estimates / proforma list | Voucher get-all / v3 estimates list with date range |
| Proforma from estimate | `proformas/generate-via-estimate` |
| Invoice from proforma | `v3/generate-via-proforma` |
| Settings | Company settings include **proformaSettings** (numbering, templates) |

## Errors and testing

- Validate **`dd-MM-yyyy`** dates and financial year for the company.
- **`voucherVersion=2`** is required on many accounting-microservice routes; missing it often yields `INVALID_PARAMETERS`.
- Try requests in **Giddh API Explorer** (`tools/giddh-api-explorer`) with the same catalog paths, then open the matching endpoint here for published examples.

## See also

- [Estimation](./estimation) guide — estimate → invoice and shared list APIs.
- **Voucher** and **Invoice** menus in **API reference** — get-all, generate, mail, PDF.
