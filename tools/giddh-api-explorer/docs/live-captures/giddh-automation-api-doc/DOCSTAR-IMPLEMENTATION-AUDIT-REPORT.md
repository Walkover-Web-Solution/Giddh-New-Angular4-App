# DocStar ↔ Implementation Audit Report

Generated: 2026-10-29

## Scope

- DocStar org `83427`, collection `-Jey39dCAAyx` (Giddh API Draft_1)
- Repositories: giddh-api-v2, accounting-microservice, import-microservice, search-api
- Source of truth: Spring controllers in those repos + catalog route inventory

## Totals

| Metric | Count |
| --- | ---: |
| DocStar endpoints (live) | 787 |
| Catalog records (all) | 1556 |
| Catalog records in 4 repos | 1392 |
| Unique in-scope backend routes | 1362 |
| Verified — matches implementation | 397 |
| Needs correction | 382 |
| Unverified | 0 |
| Unmatched DocStar route | 6 |
| Requires investigation | 2 |
| Backend routes missing from DocStar | 684 |
| DocStar endpoints with query-param doc issues | 48 |
| DocStar endpoints with empty bodyDescription (JSON body) | 329 |

## Status breakdown

- **Verified — matches implementation**: 397
- **Needs correction**: 382
- **Missing from catalog / unmatched route**: 6
- **Requires investigation**: 2

## Limitations

- `@RequestParam` parsing covers explicit annotations on the controller method; query fields bound only via `@ModelAttribute` / DTO binders are verified via catalog request models, not re-inferred from bytecode.
- Response schemas and every error code are not exhaustively runtime-tested in this pass.
- `missingFromDocstar` includes admin/internal/frontend-unused routes present in the four repos; DocStar scope historically publishes a curated public subset (~787), not all ~1392 expanded routes.
- Generic DocStar REST `Authorization` header failed earlier; inventory refresh used `proxy_auth_token` via MCP `call_any_read_api_of_docstar`.

## Next correction queue (Needs correction — first 80)

- `-Rj3XPHsTqNZ` DELETE https://api.giddh.com/company/:companyUniqueName/bank/accounts/:accountUniqueName:.+/transactions — API : Delete multiple Transactions by transaction unique id
  - query `lang` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `Iy6v2hw7RpRi` GET https://api.giddh.com/v2/company/:companyUniqueName/bank/:bankDetailsUniqueName:.+/payor/:urn:.+/status — API : Get registration status of the integrated bank account .
  - query `lang` in catalog but missing from DocStar params
- `JaAOUKUHgsKS` POST https://api.giddh.com/company/:companyUniqueName/bank/payments/confirm — API : confirm payment with OTP and sent to bank for payment
  - JSON body present but DocStar bodyDescription empty
- `9ydRTt2g-NIH` POST https://api.giddh.com/company/:companyUniqueName/discount/assign-v2 — API to assign discounts on group / account
  - JSON body present but DocStar bodyDescription empty
- `Ea-uaQis_1p_` POST https://api.giddh.com/v2/company/:companyUniqueName/logs — API to fetch Audit Logs
  - JSON body present but DocStar bodyDescription empty
- `XpcW7fEURyLq` POST https://api.giddh.com/v2/auth-login — API to support login with otp
  - JSON body present but DocStar bodyDescription empty
- `Lxw8QyTylHjv` POST https://api.giddh.com/v2/signup-with-apple — API to support signup with apple
  - JSON body present but DocStar bodyDescription empty
- `0TPQSsQmFbd1` POST https://api.giddh.com/company/:companyUniqueName/account-search-predicted — Account Search Predicted
  - JSON body present but DocStar bodyDescription empty
- `qsMKfPZl9LOp` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName:.+/ledgers-v2/view-statement — Account Statement With Advance Search
  - query `lang` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `LX25ytiZ3AzX` POST https://api.giddh.com/v2/subscription/:subscriptionId/activate-prepaid — Activate Prepaid Subscription
  - JSON body present but DocStar bodyDescription empty
- `rckkguq5RXBl` PUT https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName:.+/contacts — Add And Update Customer Vendor Contact
  - query `lang` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `91Qs-985R7My` POST https://api.giddh.com/v2/company/:companyUniqueName/accounts/:accountUniqueName:.+/report-comment — Add Comment
  - query `lang` in catalog but missing from DocStar params
- `AXqbQT4VB0H1` POST https://api.giddh.com/portal/company/:companyUniqueName/accounts/:accountUniqueName/:voucherUniqueName/add-comment — Add Comments
  - JSON body present but DocStar bodyDescription empty
- `flR22HEZNRfR` POST https://api.giddh.com/company/:companyUniqueName/add-domain — Add Domain
  - JSON body present but DocStar bodyDescription empty
- `dMYl-XuflTAt` POST https://api.giddh.com/v2/subscription/add-payment-method — Add Payment Method
  - JSON body present but DocStar bodyDescription empty
- `MvZUlDOnU1UJ` POST https://api.giddh.com/company/:companyUniqueName/recurring-voucher — Add Recurring Voucher
  - JSON body present but DocStar bodyDescription empty
- `BTUcw19frMWw` POST https://api.giddh.com/v2/subscription/add-wallet-amount — Add Wallet Amount
  - JSON body present but DocStar bodyDescription empty
- `YRWaWqt69hWr` POST https://api.giddh.com/company/:companyUniqueName/advance-receipt/adjust — Adjust Advance Receipt Entry With Invoice
  - JSON body present but DocStar bodyDescription empty
- `_ri7g9jTPGBx` POST https://api.giddh.com/company/:companyUniqueName/vouchers/:voucherUniqueName/adjust — Adjust Voucher
  - JSON body present but DocStar bodyDescription empty
- `kftm_fbrSEtD` POST https://api.giddh.com/v2/subscription — Also it add plan info to subscription if user selects plan without selecting …
  - JSON body present but DocStar bodyDescription empty
- `jKX9v5VSDTet` POST https://api.giddh.com/company/:companyUniqueName/business-documents/:uniqueName/action — Apply Action
  - JSON body present but DocStar bodyDescription empty
- `7QOkuSQwUHDS` POST https://api.giddh.com/company/:companyUniqueName/business-documents/:uniqueName/events — Apply Business Document Event
  - JSON body present but DocStar bodyDescription empty
- `sxgleQpNct3S` POST https://api.giddh.com/company/:companyUniqueName/business-documents/:uniqueName/status — Apply Business Document Status
  - param branchUniqueName: missing required boolean
  - JSON body present but DocStar bodyDescription empty
- `mR5aGg6VSqEr` POST https://api.giddh.com/company/:companyUniqueName/delivery-challan/:uniqueName/events — Apply Delivery Challan Event
  - param branchUniqueName: missing required boolean
  - JSON body present but DocStar bodyDescription empty
- `oZ_ldx6KCPwV` POST https://api.giddh.com/company/:companyUniqueName/delivery-challan/:uniqueName/events — Apply Delivery Challan Event
  - JSON body present but DocStar bodyDescription empty
- `ZCt5NQPNRPwB` POST https://api.giddh.com/company/:companyUniqueName/receipt-note/:uniqueName/events — Apply Receipt Note Event
  - JSON body present but DocStar bodyDescription empty
- `tt0rq4FrucAj` POST https://api.giddh.com/company/:companyUniqueName/receipt-note/:uniqueName/events — Apply Receipt Note Event
  - param branchUniqueName: missing required boolean
  - JSON body present but DocStar bodyDescription empty
- `R_441kH4J5rH` POST https://api.giddh.com/company/:companyUniqueName/batch/:batchUniqueName/archive — Archive Batch
  - JSON body present but DocStar bodyDescription empty
- `1EpWWk16sW7M` POST https://api.giddh.com/company/:companyUniqueName/salesperson/:uniqueName/archive — Archive Sales Person
  - JSON body present but DocStar bodyDescription empty
- `9oZbalVVf5uT` POST https://api.giddh.com/company/:companyUniqueName/role/:roleUniqueName/assign — Assign Role
  - JSON body present but DocStar bodyDescription empty
- `K-Hpu0r9QLYu` POST https://api.giddh.com/company/:companyUniqueName/tax/assign — Assign Taxes On Groups And Accounts
  - JSON body present but DocStar bodyDescription empty
- `TSWF99SY7wqW` POST https://api.giddh.com/company/:companyUniqueName/bank/registration — Bank Registration
  - JSON body present but DocStar bodyDescription empty
- `8EIssnkI4NYq` POST https://api.giddh.com/v2/company/:companyUniqueName/bank — Bank Registration For ICICI
  - JSON body present but DocStar bodyDescription empty
- `A5JPNIeSN5E1` GET https://api.giddh.com/company/:companyUniqueName/batch/stock/:stockUniqueName/availability — Batch-wise availability for a stock (all variants' batches). Prefer {@code GE…
  - param warehouseUniqueName: missing required boolean
  - param page: missing required boolean
  - param count: missing required boolean
  - param sortBy: missing required boolean
  - param sort: missing required boolean
  - param reportNature: missing required boolean
- `6r2QOJhg-_2v` GET https://api.giddh.com/company/:companyUniqueName/batch/variant/:variantUniqueName/availability — Batch-wise availability for a variant (batch stock report / picker). Paginate…
  - param warehouseUniqueName: missing required boolean
  - param page: missing required boolean
  - param count: missing required boolean
  - param sortBy: missing required boolean
  - param sort: missing required boolean
  - param reportNature: missing required boolean
- `xazABCZ3huNT` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName/bulk-ledgers-v2 — Bulk Create
  - JSON body present but DocStar bodyDescription empty
- `yX6FB3jOHZtD` POST https://api.giddh.com/company/:companyUniqueName/business-documents/bulk-delete — Bulk Delete Business Documents
  - param branchUniqueName: missing required boolean
  - JSON body present but DocStar bodyDescription empty
- `0PvzrdIKfUnj` POST https://api.giddh.com/company/:companyUniqueName/delivery-challan/bulk-delete — Bulk Delete Delivery Challans
  - param branchUniqueName: missing required boolean
  - JSON body present but DocStar bodyDescription empty
- `eVF6LHoDZ1C1` POST https://api.giddh.com/company/:companyUniqueName/receipt-note/bulk-delete — Bulk Delete Receipt Notes
  - param branchUniqueName: missing required boolean
  - JSON body present but DocStar bodyDescription empty
- `3tyrj-0-n2gP` POST https://api.giddh.com/company/:companyUniqueName/vouchers/bulk-export — Bulk Export
  - JSON body present but DocStar bodyDescription empty
- `pV0ToInFrMYV` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bulk-export — Bulk Export
  - JSON body present but DocStar bodyDescription empty
- `RImgW_voQqLQ` POST https://api.giddh.com/company/:companyUniqueName/vouchers/bulk-export — Bulk Export Vouchers
  - JSON body present but DocStar bodyDescription empty
- `CRkeJbkDtFpr` POST https://api.giddh.com/v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/bulk-generate — Bulk Generate
  - JSON body present but DocStar bodyDescription empty
- `Ix6CzhPiBOvg` POST https://api.giddh.com/company/:companyUniqueName/bank/payments — Bulk Payment
  - JSON body present but DocStar bodyDescription empty
- `3lmWLglXBRE2` POST https://api.giddh.com/company/:companyUniqueName/vouchers/bulk-update — Bulk Update Vouchers
  - JSON body present but DocStar bodyDescription empty
- `A9hbgwDTsZp3` POST https://api.giddh.com/v2/subscription/buy-plan — Buy Plan
  - JSON body present but DocStar bodyDescription empty
- `nrERwFAkAQxi` POST https://api.giddh.com/v2/subscription/buy-plan — Buy Plan
  - JSON body present but DocStar bodyDescription empty
- `AXC9qVYMsbpr` POST https://api.giddh.com/company/:companyUniqueName/stock/:stockUniqueName/recipe/get — CASE a). WHEN variantUniqueNames is empty then all the variant of the given s…
  - JSON body present but DocStar bodyDescription empty
- `IP4YYNRNh28X` POST https://api.giddh.com/v2/company/:companyUniqueName/groups/:groupUniqueName/account-closing-balance — Calculate Account Balance
  - JSON body present but DocStar bodyDescription empty
- `cID-ACZxWiQG` GET https://api.giddh.com/v2/company/:companyUniqueName/accounts/:accountUniqueName:.+/balance — Calculate Closing Balance
  - query `lang` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `mX4ZZTedcbQP` POST https://api.giddh.com/v2/company/:companyUniqueName/accounts/:accountUniqueName:.+/balance — Calculate Closing Balance
  - query `lang` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `hGW_RuSWCz8F` POST https://api.giddh.com/company/:companyUniqueName/business-documents/:uniqueName/cancel — Cancel Business Document
  - param branchUniqueName: missing required boolean
- `cpz9o9UkTBwr` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/cancel-einvoice — Cancel Einvoice For Account Voucher
  - JSON body present but DocStar bodyDescription empty
- `MLqSG0UXcEUH` POST https://api.giddh.com/v2/subscription/:subscriptionId/capture-wallet-payment — Capture Wallet Payment
  - JSON body present but DocStar bodyDescription empty
- `MzuG6vDzk-ji` POST https://api.giddh.com/v2/subscription/change-plan — Change Plan Of Subscription
  - JSON body present but DocStar bodyDescription empty
- `ZrCMSCy8eLax` POST https://api.giddh.com/v2/subscription/change-plan — Change Plan Of Subscription
  - JSON body present but DocStar bodyDescription empty
- `6yv2DAMgSCMv` POST https://api.giddh.com/v2/subscription/charge/:subscriptionId — Charge Subscription
  - JSON body present but DocStar bodyDescription empty
- `S1ZGtNcS6jYl` POST https://api.giddh.com/company/:companyUniqueName/business-documents/convert — Convert
  - JSON body present but DocStar bodyDescription empty
- `S4nRE-UteCmz` POST https://api.giddh.com/company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-estimate — Convert Estimate into Invoice with multicurrency support.
  - JSON body present but DocStar bodyDescription empty
- `JHcSRhSJEpBo` POST https://api.giddh.com/company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-proforma — Convert Proforma into Invoice version 3
  - JSON body present but DocStar bodyDescription empty
- `2lxdy7ALye2b` POST https://api.giddh.com/v2/company/:companyUniqueName/groups/:groupUniqueName/accounts — Create
  - JSON body present but DocStar bodyDescription empty
- `0EWpfSxijAMU` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2 — Create Account
  - query `validateTax` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `2oTReg7IOlIA` POST https://api.giddh.com/v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate — Create Account
  - JSON body present but DocStar bodyDescription empty
- `MUYCqySCFYac` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName/purchase-order/generate — Create Account
  - JSON body present but DocStar bodyDescription empty
- `S90l7ttRZ1EY` POST https://api.giddh.com/company/:companyUniqueName/accounts/:accountUniqueName:.+/ledgers-v2 — Create Account
  - query `validateTax` in catalog but missing from DocStar params
  - JSON body present but DocStar bodyDescription empty
- `joqNLkayh9hj` POST https://api.giddh.com/v2/company/:companyUniqueName/groups/:groupUniqueName/accounts — Create Account
  - JSON body present but DocStar bodyDescription empty
- `j1Cvr-qSbWRj` POST https://api.giddh.com/company/:companyUniqueName/address — Create Address
  - JSON body present but DocStar bodyDescription empty
- `TFy45YbtVVyZ` POST https://api.giddh.com/company/:companyUniqueName/batch — Create Batch
  - JSON body present but DocStar bodyDescription empty
- `nLNqXkR7Dg3G` POST https://api.giddh.com/company/:companyUniqueName/branch — Create Branch
  - JSON body present but DocStar bodyDescription empty
- `oNy10zZZowG0` POST https://api.giddh.com/company — Create Company
  - JSON body present but DocStar bodyDescription empty
- `EGcLHSz1DUrd` POST https://api.giddh.com/company/:companyUniqueName/customer-vendor-discount/stock/:stockUniqueName/assign-discount — Create Customer Variant Discount
  - JSON body present but DocStar bodyDescription empty
- `n_hh-5F1Awpi` POST https://api.giddh.com/company/:companyUniqueName/discount — Create Discount
  - JSON body present but DocStar bodyDescription empty
- `Mtotz3OLv0q0` POST https://api.giddh.com/v2/company/:companyUniqueName/trigger — Create Email Trigger
  - JSON body present but DocStar bodyDescription empty
- `gqpzKbc35-vp` GET https://api.giddh.com/company/:companyUniqueName/dashboard/graph — Create Graph Based On Type
  - query `type` required mismatch: Java=False catalog=True
  - query `uniqueName` required mismatch: Java=False catalog=True
  - query `interval` required mismatch: Java=False catalog=True
  - query `branchUniqueName` required mismatch: Java=False catalog=True
- `Fjobzhc8-XLC` POST https://api.giddh.com/company/:companyUniqueName/groups — Create Group
  - JSON body present but DocStar bodyDescription empty
- `DLxYq8nWNEnX` POST https://api.giddh.com/company/:companyUniqueName/gst-setting — Create Gstsetting
  - JSON body present but DocStar bodyDescription empty
- `U9Yq_-1HRUO9` POST https://api.giddh.com/company/:companyUniqueName/imports/upload — Create Import Request
  - query `file` in Java @RequestParam but missing from catalog
- `pGhmkwC1FNWr` POST https://api.giddh.com/company/:companyUniqueName/tax — Create India Tax
  - JSON body present but DocStar bodyDescription empty
- `d5dcpNSO9T9V` POST https://api.giddh.com/company/:companyUniqueName/stock/:stockUniqueName/recipe — Create Manufacturing Recipe
  - JSON body present but DocStar bodyDescription empty
- `V-aX4-ST-yGb` POST https://api.giddh.com/v2/company/:companyUniqueName/multicompany/:reportType — Create Multi Currency Report For Multiple Companies
  - JSON body present but DocStar bodyDescription empty
- … and 302 more (see JSON)

## Machine-readable detail

See `docstar-implementation-audit.json` for per-endpoint evidence (controller, handler, Java query params, issues).


## Unmatched DocStar routes (6) — investigation notes

See `docstar-unmatched-route-fixes.json`.

| EndpointId | Finding |
| --- | --- |
| dVsKwEExfZBV | Wrong path (missing `/v4`); use accounting MS bulk-generate |
| RoiAENnABQ2U | Catalog method ANY; GET is valid for template-preview |
| S2fQ0lJbWWvR | Exact versions route not in catalog — Requires investigation |
| 6DlKV44KYgAd | Likely invoices/.../action not vouchers/.../action |
| 0tmPAgiTWhVW | Patch V4 route not matched — Requires investigation |
| mIevdhqen3Zw | Should be PATCH not PUT for recurring-voucher update |

## DocStar bodyDescription limitation

MCP `update_endpoint` accepts `bodyDescription` in the API, but responses often return `bodyDescription: {}` after update (known DocStar persistence/UI quirk). Query `params.*.required` boolean corrections do persist. Body field docs remain in catalog + Explorer; re-check DocStar UI for body field panels after publish.

## Correction reapply progress

Tracked in `.docstar-param-reapply-v2.mcp.json` (target 787). Explorer catalogs dual-written via `_enrich_catalog_parameter_docs.py`.
