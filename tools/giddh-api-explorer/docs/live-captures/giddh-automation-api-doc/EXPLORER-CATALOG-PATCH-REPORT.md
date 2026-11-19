# Explorer catalog patch report

Generated: **2026-10-23**  
Company: `giddhain1792673422178091xos`  
Script: `_patch_explorer_catalog_from_captures.py`

## Targets updated

1. `tools/giddh-api-explorer/public/data/catalog.json`
2. `docs/api/coverage/catalog.json`

## Counts

| Metric | Count |
| --- | ---: |
| Live captures loaded (tag + response file) | 1493 |
| Captures matched to ≥1 catalog record | 1409 |
| Captures unmatched to catalog | 84 |
| Response files with no call-log/request meta (orphans) | 71 |
| Call-log tags missing response file | 0 |
| Catalog records in patch plan | 728 |
| Records patched (any) | 416 |
| Records patched with **success** example | 414 |
| Records patched with **error** example(s) | 6 |
| Frontend-used records patched | 342 |
| Other records patched | 74 |

## Spot-check

- `POST v4/company/{}/accounts/{}/vouchers/generate` (accounting-microservice): **PASS** — success body type=`sales`, has real voucher fields (not `reference: response`).

## How to refresh local Explorer

1. Serve Explorer from `tools/giddh-api-explorer` (static `public/`).
2. Hard-refresh the browser (`Cmd+Shift+R`) so `/data/catalog.json` reloads (`cache: "no-store"` is already set).
3. No separate rebuild/copy step — Explorer reads `public/data/catalog.json` directly.

## Sample frontend-used patches (first 25)

| Method | Path | Service | Success | Errors | Tag |
| --- | --- | --- | ---: | ---: | --- |
| ANY | `v2/company/{}/template-preview` | accounting-microservice | Y | 1 | `651-template-preview-post` |
| ANY | `v2/company/{}/templates/{}` | accounting-microservice | Y | 2 | `650-template-preview` |
| DELETE | `company/{}/accounts/{}/entries/{}` | accounting-microservice | Y | 0 | `310-delete-ledger-entry` |
| DELETE | `company/{}/accounts/{}/entries` | accounting-microservice | - | 1 | `1107-delete-company-accounts-entries` |
| DELETE | `company/{}/accounts/{}/vouchers` | accounting-microservice | - | 1 | `1125-delete-company-accounts-vouchers` |
| DELETE | `company/{}/inventory-adjustment/{}` | accounting-microservice | - | 1 | `1320-delete-company-inventory-adjustment` |
| GET | `company/{}/accounts/{}/autopaid` | accounting-microservice | - | 1 | `1104-get-company-accounts-autopaid` |
| GET | `company/{}/accounts/{}/ledgers/{}` | accounting-microservice | Y | 2 | `499-ledgers-txns-ct` |
| GET | `company/{}/completed-document-count` | accounting-microservice | - | 5 | `1073-ocr-PURCHASE` |
| GET | `company/{}/voucher/{}/versions` | accounting-microservice | Y | 1 | `247-voucher-versions` |
| PATCH | `v4/company/{}/vouchers` | accounting-microservice | - | 1 | `1420-patch-v4-company-vouchers` |
| POST | `company/{}/accounts/{}/bulk-ledgers-v2` | accounting-microservice | Y | 0 | `240-bulk-ledgers-v2` |
| POST | `company/{}/accounts/{}/ledgers-v2` | accounting-microservice | Y | 0 | `147-ledgers-v2-create` |
| POST | `company/{}/accounts/{}/vouchers/bulk-export` | accounting-microservice | Y | 0 | `446-bulk-export-ledger` |
| POST | `company/{}/accounts/{}/vouchers/cancel-einvoice` | accounting-microservice | - | 3 | `482-cancel-einvoice-ui` |
| POST | `company/{}/accounts/{}/vouchers/mail` | accounting-microservice | Y | 0 | `111-mail-sales` |
| POST | `company/{}/download-file` | accounting-microservice | Y | 2 | `587-download-file-base64` |
| POST | `company/{}/dsc/finish` | accounting-microservice | - | 1 | `1304-post-company-dsc-finish` |
| POST | `company/{}/dsc/prepare` | accounting-microservice | - | 1 | `1305-post-company-dsc-prepare` |
| POST | `company/{}/inventory-adjustment` | accounting-microservice | Y | 5 | `376-inv-adjust-stock-expense` |
| POST | `company/{}/invoices/{}/action` | accounting-microservice | Y | 0 | `145-cancel-sales` |
| POST | `company/{}/ledger/upload` | accounting-microservice | - | 1 | `1327-post-company-ledger-upload` |
| POST | `company/{}/pettycash-manager/{}` | accounting-microservice | Y | 0 | `437-pettycash` |
| POST | `company/{}/vouchers/bulk-export` | accounting-microservice | Y | 0 | `243-bulk-export-vouchers` |
| POST | `company/{}/vouchers/bulk-update` | accounting-microservice | Y | 1 | `222-bulk-update-dueDate` |

## Unmatched capture sample (first 40)

| Tag | Method | Path | Kind |
| --- | --- | --- | --- |
| `100-pl-v2` | GET | `/v2/company/giddhain1792673422178091xos/profit-loss-v2` | error |
| `101-bs` | GET | `/v2/company/giddhain1792673422178091xos/balance-sheet` | error |
| `102-proforma-type-sales` | GET | `/v3/company/giddhain1792673422178091xos/accounts/apidoc-customer-three/proformas/generate` | success |
| `1028-dc-all-v2` | POST | `/v2/company/giddhain1792673422178091xos/delivery-challan/all?from=01-04-2026&to=31-03-2027&page=1&count=5&branchUniqueName=giddhautomationapidoc` | error |
| `1029-rn-all-v2` | POST | `/v2/company/giddhain1792673422178091xos/receipt-note/all?from=01-04-2026&to=31-03-2027&page=1&count=5&branchUniqueName=giddhautomationapidoc` | error |
| `103-get-estimate` | GET | `/v3/company/giddhain1792673422178091xos/accounts/apidoc-customer-three/estimates` | error |
| `1030-dc-get-all` | POST | `/company/giddhain1792673422178091xos/vouchers/delivery-challan/all?from=01-04-2026&to=31-03-2027&page=1&count=5&branchUniqueName=giddhautomationapidoc&voucherVersion=2` | error |
| `1036-share-company` | PUT | `/company/giddhain1792673422178091xos/share` | error |
| `1037-share-post-v2` | POST | `/v2/company/giddhain1792673422178091xos/share` | error |
| `1054-autopaid` | POST | `/company/giddhain1792673422178091xos/accounts/apidoc-customer-one/autopaid` | error |
| `116-recipe-widget` | GET | `/company/giddhain1792673422178091xos/stock/apidoc-widget/recipe/get` | error |
| `117-inventory-item-wise` | GET | `/company/giddhain1792673422178091xos/inventory/balance-report/item-wise` | error |
| `121-sales-register` | GET | `/v2/company/giddhain1792673422178091xos/v2/sales-register-overview` | error |
| `122-purchase-register` | GET | `/v2/company/giddhain1792673422178091xos/v2/purchases-register-overview` | error |
| `150-ecommerce-verify` | GET | `/company/giddhain1792673422178091xos/ecommerce/verify/shopify-nonexistent` | error |
| `1635-external-google-userinfo` | GET | `https://www.googleapis.com/oauth2/v1/userinfo?alt=json` | success |
| `1636-external-msg91-send-verify-otp` | POST | `MSG91 widget sendOtp + verifyOtp` | success |
| `1701-portal-prod-msg91-getDetails` | GET | `https://routes.msg91.com/api/c/getDetails` | success |
| `179-subscription-companies` | GET | `/v2/subscription/company-list/SUB-20261022-5` | error |
| `185-inv-group-wise` | GET | `/company/giddhain1792673422178091xos/inventory/balance-report/group-wise` | error |
| `214-autopaid` | POST | `/company/giddhain1792673422178091xos/accounts/apidoc-customer-one/autopaid` | error |
| `232-ledger-reconcile-get` | GET | `/company/giddhain1792673422178091xos/accounts/cash/ledgers-v2/reconcile` | error |
| `252-get-estimate-v3` | GET | `/v3/company/giddhain1792673422178091xos/accounts/apidoc-customer-three/estimates/su71792731047950` | error |
| `279-account-search-v3` | POST | `/company/giddhain1792673422178091xos/v3/account-search` | error |
| `283-search-api-probe` | GET | `/v2/company/giddhain1792673422178091xos/search` | error |
| `302-export-account-statement` | GET | `/company/giddhain1792673422178091xos/accounts/apidoc-customer-one/ledgers-v2/export-account-statement` | error |
| `312-estimate-get-company-path` | GET | `/company/giddhain1792673422178091xos/vouchers/v3/estimates/su71792731047950` | error |
| `313-proforma-get-v3` | GET | `/v3/company/giddhain1792673422178091xos/accounts/apidoc-customer-three/proformas/q2c1792731068597` | error |
| `329-account-search-v1` | POST | `/company/giddhain1792673422178091xos/v2/account-search` | error |
| `333-recipe-get` | GET | `/company/giddhain1792673422178091xos/stock/apidoc-widget/recipe/get` | error |
| `341-bill-to-bill-post` | POST | `/v4/company/giddhain1792673422178091xos/accounts/apidoc-customer-one/vouchers/bill-to-bill/export-v2` | error |
| `351-invoice-action-get` | GET | `/company/giddhain1792673422178091xos/invoices/rrftm1792675101875/action` | error |
| `372-get-estimate-by-number-path` | GET | `/v3/company/giddhain1792673422178091xos/accounts/apidoc-customer-three/estimates/EST-20261023-1` | error |
| `380-gstr3b-summary` | GET | `/v2/company/giddhain1792673422178091xos/gstr3b-summary?gstin=23AAACC1206D2ZN&from=01-10-2026&to=31-10-2026` | error |
| `385-gstr3b-excel` | GET | `/v2/company/giddhain1792673422178091xos/gstr3b-excel-export?monthYear=10-2026&gstin=23AAACC1206D2ZN` | error |
| `388-export-acct-stmt` | GET | `/company/giddhain1792673422178091xos/accounts/apidoc-customer-one/ledgers-v2/export-account-statement?from=01-04-2026&to=23-10-2026&q=` | error |
| `395-sub-companies` | GET | `/v2/subscription/company-list/SUB-20261022-5?sort=&sortBy=&page=1&count=20&q=` | error |
| `404-reconcile-get` | GET | `/company/giddhain1792673422178091xos/accounts/apidoc-bank-hdfc/ledgers-v2/reconcile?from=01-04-2026&to=23-10-2026&chequeNumber=` | error |
| `445-autopaid` | POST | `/company/giddhain1792673422178091xos/accounts/apidoc-customer-one/autopaid` | error |
| `473-search-apitest-probe` | GET | `/search/company/giddhain1792673422178091xos` | error |

… and 44 more.

## Notes

- Success examples set to full live JSON envelopes when `status: success` / HTTP 2xx.
- Live errors prepended to `response.errorExamples`, deduped by `code` + `message` (existing exception-derived examples kept).
- Up to 5 distinct live errors per record.
- `liveCapture` written on both `record` and `record.response`.
- Request-body patching skipped (Explorer uses `requestBody.example` only; no `liveRequestExample` UI).
- Orphan response files without method/path metadata were not matched (71).
