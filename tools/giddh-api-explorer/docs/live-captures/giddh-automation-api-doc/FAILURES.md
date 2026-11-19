# Failed / useful error captures (keep these)

Do **not** delete. Failures teach the next agent what not to send.

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/30d-sales-no-vv.json` | 400 `INVALID_PARAMETERS` | Missing `voucherVersion=2` → `Entry date must be provided` |
| `responses/30-generate-missing-voucherVersion.json` | same | Canonical copy of above for docs/catalog |
| `responses/30b-sales-simple.json` | `INVALID_JSON` | Bare number for `amount` — must be AmountDetails |
| `responses/44-create-bank.json` | error | Bank details only allowed on sundry creditors — use simple bank create (`44b`) |
| `responses/47-create-stock-unit-kg.json` | error | `kg` unit already exists |
| `responses/48-create-stock-1.json` / `48-create-stock-2.json` | error | Stock unit invalid until `stockUnitUniqueName` set (`48c`/`48d` succeeded) |
| `responses/54-purchase-vendor-two.json` | `INVALID_REQUEST` | Purchase **number** mandatory for this company |
| `responses/55b-payment-vendor-two.json` | error | Adjustment amount > adjustable balance (PB-API-001 was PARTIAL-PAID) |
| Cloudflare 1010 (urllib) | 403 | Use browser User-Agent via curl |
| `responses/75-estimate.json` / `75b-proforma.json` | 406 | v4 generate does **not** support estimate/proforma types |
| `responses/83-estimate-v3-generate.json` | 406 | On `/v3/.../estimates/generate`, `type` must be `sales` (not `estimate`) — see `95-estimate-type-sales` |
| `responses/85-journal.json` | 412 | Particular cannot equal path account |
| `responses/94b-journal-company-path.json` | 406 | Company-level generate without usable entries |
| `responses/72-trial-balance.json` / `92b-tb-no-branch.json` | 404 | Use **`/v2/company/{c}/multibranch/trial-balance`** (`92-tb-multibranch`) |
| `responses/93-profit-loss.json` | 404 | Use **`/v2/company/{c}/multibranch/profit-loss`** (`100c-pl-mb`) |
| `responses/101-bs.json` | 404 | Use **`/v2/company/{c}/multibranch/balance-sheet`** (`101b-bs-mb`) |
| `responses/81-ledger-transactions.json` | 415/404 | Ledger transaction URL still unstable on apitest — balance API `86` works |
| `responses/104-daybook.json` | 404 | Daybook is **POST** (not GET) with `page/count/from/to/branchUniqueName` query — see `107-daybook-post` |
| `responses/105-giddh-ledger.json` / `106-ledger-transactions.json` | 404 | `giddh-ledger` + `ledgers/transactions` still 404 on apitest even with full query + `voucherVersion=2`. Working ledger paths: `ledgers-v2` create (`147`), get entry `ledgers/{entryUn}?baseRef=true` (`186`), account balance (`86`) |
| `responses/114-stock-unit-mappings.json` | 404 | GET treats `mappings` as unit uniqueName. Use **POST** `stock-unit/mappings` with body `[]` (`201`) |
| `responses/116-recipe-widget.json` / `169-recipe-post.json` | 405/406 | Recipe get is **POST** with variant uniqueNames array; empty manufacturing → `Manufacturing details not found` (OK for this company) |
| `responses/117-inventory-item-wise.json` | 405 | Item-wise / group-wise inventory balance reports are **POST** (`167`, `185b`) |
| `responses/120-invoice-setting.json` | 405 | `invoice-setting` is update path; use `company/.../settings` (`97`) for read |
| `responses/121-sales-register.json` / `122-purchase-register.json` | 405 | Register overview **v2** path is POST (`163`/`164`); **v1** overview with `interval=` is GET (`165`/`166`) |
| `responses/146-receipt-full-adjust.json` | 406 | Adjust amount must be ≤ `unadjustedAmount` from invoice-list (`108`) — 261022-5 had only 300 left, not 500 |
| `responses/151-tax-assign.json` / `202-tax-assign-account.json` | 400/404 | `tax/assign` body is **array** of `{uniqueName,taxes,isAccount}`; taxes only on Income/Expense — debtors/stocks invalid; stock uniqueName is not a group (`170`/`203`/`223`) |
| `responses/162-download-company.json` / `204-download-file.json` | 400/406 | Company download body needs **`uniqueName`** (singular) + `voucherType` — not `uniqueNames` / `voucherUniqueNames` (`221`) |
| `responses/173-get-estimate.json` / `175-generate-via-estimate.json` / `209-bd-convert.json` | 404 | Paths using **uniqueName only** / business-documents/convert 404. **Working:** list with query (`314`); get/download/convert with **`estimateNumber` / `proformaNumber`** (`373`/`357`/`358`/`359`/`360`) |
| `responses/180-voucher-adjust-endpoint.json` | 406 | Cannot adjust sales↔sales via `/vouchers/{un}/adjust`; use receipt/payment/CN generate with `adjustments[]` |
| `responses/191-make-recurring.json` / `205-make-recurring.json` | 406/400 | make-recurring needs correct `repeatOption` enum — still unresolved |
| `responses/206-bulk-update-post.json` | 406 | Bulk update needs `voucherType` in body (`222` succeeded with `dueDate` action) |

### Batch 4 (tags 226–313) — 2026-10-23

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/238-giddh-ledger-retry.json` / `239-ledgers-transactions-retry.json` | 404 | Still 404 on apitest; use merge advance-search (`228`), `ledgers/{entry}?baseRef=true` (`229`), `bulk-ledgers-v2` (`240`), `ledgers-v2` (`309`) |
| `responses/245-voucher-cancel-einvoice-alt.json` / `244-cancel-einvoice-safe.json` | 406/404 | Cancel e-invoice requires **`cnlRsn`** in body; safe path also 404 without proper e-invoice context |
| `responses/249-estimates-all.json` / `250-proformas-all.json` | 404 | Bare `vouchers/v3/estimates/all` (no query) 404 in batch 4 — later `314`/`315` with query succeeded |
| `responses/252-get-estimate-v3.json` … `257-bd-convert-estimate.json` / `312`/`313` | 404 | uniqueName-based get/convert 404; use **number** fields — see `373`/`358`/`360` |
| `responses/336-estimate-download.json` / `347-generate-via-estimate-full.json` | 406 | `Estimate number cannot be null/blank` — body must include **`estimateNumber`** (not only uniqueName) |
| `responses/260-inv-adjust-create.json` / `322` / `363` | 400/404/406 | Inv-adjust needs `entity`=`STOCK` + stock uniqueName + **`expenseAccountUniqueName` in otherindirectexpenses** (`376`); VARIANT entityUniqueName is not a stock-group (`377`) |
| `responses/311-inv-adjust-with-reason.json` | 403 | Adjust without proper expense/entity wiring → 403 |
| `responses/263-recipe-get-post.json` / `264-recipe-create.json` | 406/500 | Widget has no manufacturing details; recipe **create** returned 500 |
| `responses/265-branch-transfer-list.json` / `266-branch-transfer-generate.json` | 400/404 | List is **POST** with body (`320`); generate path still 404 |
| `responses/270-create-warehouse.json` / `321b` | 400 | Warehouse `address` must be object `{uniqueName}` (`321`) — bare string fails |
| `responses/227-ledger-merge-advance-search.json` | 405 | Merge with `voucherVersion=2` query → 405; working list is POST merge **without** vv (`228`) |
| `responses/241-voucher-status-count.json` | 405 | GET unsupported — use **POST** (`317`) |
| `responses/251-estimate-versions.json` / `316` | 405/406 | Versions need POST + **`estimateNumber`** (`356`) |
| `responses/248-bulk-generate.json` | 400 | Invalid key / empty value in bulk-generate body |
| `responses/287-gstr1-summary.json` | 404 | Placeholder GSTIN not on company — use company GSTIN `23AAACC1206D2ZN` (`365`/`367`) |
| `responses/292-dashboard-graph.json` / `327` / `401`–`403` / `520` | 403 | Wrong `type`/`uniqueName` → 403. **Working:** first `GET /ui/graph-types` (`399`), then graph with `type=category&uniqueName=income|expenses` or `type=voucher&uniqueName=payment|receipt` (`521`–`524`) |
| `responses/361-cancel-einvoice-query.json` / `433` | 406/404 | Body-only `cnlRsn` → `Must provide cnlRsn`. **UI pattern:** `cnlRsn`/`cnlRem` as **query**, body `{uniqueName, voucherType}` (`482`) — then `E-Invoice is not generated` on this company (path OK) |
| `responses/421-bt-generate.json` / `422` | 406 | `entity` must be **`deliverynote`/`DeliveryNote`** or **`receiptnote`/`ReceiptNote`** — not `branch-transfer` (`478`–`481` all 201) |
| `responses/388-export-acct-stmt.json` | 405 | Account-statement export is **POST** (`485`), not GET |
| `responses/380-gstr3b-summary.json` | 404 | Path `gstr3b-summary` 404 — use **`GET /v2/company/{c}/gstr3b?gstin&from&to`** (`490`) |
| `responses/407-ledgers-txns-bank.json` | 415 | `ledgers/transactions` needs **`Content-Type: application/json`** even on GET (`499` succeeded) |
| `responses/404-reconcile-get.json` | 405 | Reconcile is **POST** `.../ledgers-v2/reconcile` (`405`/`513`) — GET unsupported |
| `responses/430-dc-generate.json` / `431-rn-generate` | 400 | Inventory voucher `delivery-challan`/`receipt-note` generate blocked unless inventory settings allow; use **branch-transfer/generate** with DN/RN entity instead |
| `responses/423-make-recurring.json` / `451`/`452` | 403 | make-recurring still 403 on apitest even with `MONTHLY_DATE`/`WEEKLY`/`DAY` enums — list works (`424`/`519`) |
| `responses/471-search-ms-probe.json` / `472` | 000 | External `searchapi`/`importapi` hosts unreachable from this runner (DNS/network) |

### Batch 6 (tags 378–526) — 2026-10-23

Success counterparts: reconcile `405`, recipe `417`/`494`, PO `427`/`495`, BT DN/RN `478`–`481`, GSTR2 `379`/`381`/`384`, GSTR3B `490`, statement `386`/`484`/`485`, dashboard `521`–`524`, ledgers/transactions `499`, account-search GET `511`/`512`, catalog patched PO/reconcile/recipe/BT/GSTR2/statement/dashboard/estimate-convert/inv-adjust.

Batch-4+ success counterparts: magic-link `233`, ledger merge `228`, update/delete `230`/`310`, estimate convert `358`/`360`, inv-adjust `376`, warehouse `321`, address `272`, branch `273`, GSTR1 `365`, daybook `350`.

Success counterparts live beside them under the same numeric prefix when applicable.

### Batch 7 (tags 527–706) — 2026-10-23

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/423`/`451`/`452` (prior) vs `536`–`539` | prior 403/500 | make-recurring needs **nested UI `cleanFormValues`**: `{startDate, repeatOption, frequency:{interval,unit}, repeatOn?, end:{type,endDate?}}` — flat payloads fail. Preview is **POST** (`535`). List needs **`voucherType=sales`** (`640`). Status PATCH enums **`STOP`/`RESUME`/`EXPIRE`** not ACTIVE/INACTIVE (`701`/`702`). |
| `responses/543`/`544` | 400 | pending-report `documentType` must be **`DC`/`RC`** (not delivery-challan); `reportType` **`WITHOUT_CHALLAN`/`NOT_INVOICED`** (`627-*`). |
| `responses/551`–`554` | 405 | PO pending-numbers is **POST** (`628`); status/bulk are **PATCH** (`681`/`683`); bill-setting GET unsupported here. Status body `{action, purchaseNumber}`; bulk `action=duedate` + `purchaseNumbers`; warehouse needs `warehouseUniqueName` (`703`). |
| `responses/555`/`634`/`635`/`637` | 406/422 | Manufacturing entry still blocked: `stocks-manufacture` empty even with recipe get; v2 `Manufacturing detail not found`; v1 wants manufacturing qty/unit on linked stock. Recipe POST often returns empty `manufacturingDetails` (`636`). |
| `responses/572`/`657-sub-plans-IN` | 406 | Subscription plans `regionCode` must be **`IND`** (not `IN`/`in`/`india`) — `657-sub-plans-IND`. |
| `responses/579`/`648` | 406 | Group columnar needs `financialYear` like **`APR-2026-MAR-2027`** (`692`); account columnar is **POST** `.../accounts/{acct}/columnar-report` (`580`). |
| `responses/585` | 404 | Legacy `vouchers/preview` 404 — use **v4 vouchers get** by uniqueName (`586`). |
| `responses/645` | 406 | Tax authority create with US `stateCode=CA` → state not found on IN company; MP authority works (`531`/`apidoctaxauthoritymp`). |
| `responses/665` | 406 | `tax/assign` rejects multiple tax types in one assign — one tax type per call. |
| `responses/652` | 200 | Empty `POST /address` **creates** an address — not a list endpoint. |
| `responses/588`–`590` / `591` | 404/405 | Tally logs 404; ecommerce verify is POST and needs valid source (`660`). |

Success counterparts: make-recurring `536`–`539`/`640`/`685`/`701`, tax authority `531`/`642`/`689`, tax `532`, pending-report `627-*`, PO update/status/bulk `633`/`681`–`683`/`703`, columnar `580`/`692`, discount assign `563`, plans `657-sub-plans-IND`, template preview `650`, statement export pdf/xlsx `577`/`578`. Catalog patched make-recurring + pending-report + tax/authority.

### Batch 8 (tags 707–906) — 2026-10-23

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/430` (prior) vs `711`/`731`/`732` | prior 400 | DC/RN generate needs **`PUT inventory-settings`** with `voucherAutomation.inventoryViaBusinessDocument=true` (`711`). Then `POST .../delivery-challan/generate` / `receipt-note/generate` (`731`/`732`). |
| `responses/555`/`637`/`726` vs `848`/`849` | prior 406 | MF v2 body must be **nested** `{manufacturingDetails:[{date, stockUniqueName, variant, linkedStocks, ...}]}` — flat body → `Manufacturing detail not found`. |
| `responses/717`/`723` vs `718`/`724` | 200 empty vs filled | Recipe **POST** often returns `manufacturingDetails:[]`; **GET** `recipe/get` with variant UN array returns saved recipe. Use GET to verify. |
| `responses/713`/`725`/`850` | 200 empty | `stocks-manufacture` can stay empty; use **`GET stocks?isManufactured=true`** (`714`/`851`) for recipe-enabled stocks. |
| `responses/739`–`742` | 404 | Branch-transfer uniqueNames are **not** business-documents; convert only real DC/RN UNs (`802`/`806`). |
| `responses/752`/`856`/`893` | 400/406 | Custom field create body is an **array**; STRING `dataRange.max` ≤ **150**; module uniqueName **`ACCOUNT`**. Working: `902` BOOLEAN, `906` STRING. |
| `responses/748`/`814` | 201/404 | Role create ignores client `uniqueName` — server returns e.g. `aft1792738829523`; update with that (`854`). |
| `responses/699`/`777`/`778` vs `877`/`900` | 404 | Email templates live under **`/v2/company/{c}/communication/email-template/{voucherType}`**; PUT needs **`html` + `subject`**. |
| `responses/781`/`861` | 404 | Multi-company currency report `currencyCode` not usable here (`Currency with currency code %s does not exist`) even for INR. |
| `responses/843`/`860` vs `882`/`883` | 400 | GSTR1 / gstr-reconcile need **≤3 months** from–to (`882`). Reconcile also needs **`gstin`**. |
| `responses/766`–`768` | 404 | Yodlee access-token / accounts / search 404 on apitest; eledgers GET returned 200 empty-ish (`769`). |

Success counterparts: inventory-settings `711`, DC/RN `731`/`732`, convert `802`/`806`, MF nested `848`/`849`, recipe get `718`/`724`, finished stock `720`, role `748`/`854`, CF `902`/`906`, currency `759`/`760`, activity-logs `762`, estimate/proforma versions `770`/`771`, email tpl v2 `877`/`900`, GSTR1 3mo `882`. Catalog patched DC generate + convert + inventory-settings PUT + MF v2.

### Batch 9 (tags 907–1080) — 2026-10-23

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/915`/`916` vs `1032`/`1033` | 404 vs 200 | DC/RN `.../all` **omit `voucherVersion=2`** — with vv → 404; without → list OK. Prefer `POST .../business-documents/all?documentType=DC` (`1031`). |
| `responses/913`/`1061`/`1062` | 403 | `statuses?documentType=RN` / DeliveryNote spellings 403; use **`DC`** or **`RC`** (`912`/`914`). |
| `responses/929-permission-put-same` | 412 | Cannot update role assigned to **self** via `PUT .../uer/{uerun}`. |
| `responses/931`/`1036`/`1037`/`1075` | 404/405 | Company share/invite paths still unresolved on apitest (`/share`, `/v2/.../share`, POST `/users`). |
| `responses/933`–`935` | 404 | Yodlee access-token / accounts / search still 404; eledgers GET OK empty (`936`). |
| `responses/937`/`1046`/`1072` | 415/406/410 | Bank PDF import needs **multipart** + **`pdfpassword`** query (even empty); stub PDF still 410. |
| `responses/941`/`1045` vs `1044` | 406 vs 200 | GoCardless countryCode **`GB`** works; `IN`/`US` invalid. |
| `responses/947` | 500 | Audit logs **v2** still 500; use v1 `POST .../logs` (`946`) or activity-logs (`942`–`944`). |
| `responses/948`/`949` | 404 | `settings/webhooks` still 404 on apitest. |
| `responses/968` | 404 | `templates/all` 404 — use `GET /v2/.../templates?type=invoice` (`965`). |
| `responses/971`/`1053`/`1069` | 500/412 | Template create needs **`copyFrom`**; even with it may 500 on apitest. Preview GET works (`969`). |
| `responses/982` | 404 | Tags create/list return **no uniqueName** — cannot update by client uniqueName. |
| `responses/983`–`988` | 404 | Tally logs + company export/import-ledgers still 404. |
| `responses/993`/`1047` | 404 | `GET /v2/subscription/list` 404 here; use `users/subscriptions` (`995`) + `v2/subscription/{id}` (`989`). |
| `responses/997` vs `1048` | 405 vs 200 | Subscription charge is **POST** not GET. |
| `responses/1002`/`1040`/`1073-*` | 405/406 | OCR `all-document` is POST; `ocrType` enum still unknown (INVOICE/SALES/… all rejected). |
| `responses/1004` vs `1039` | 400 vs 200 | Reverse-charge report is **POST** (`1039`), not GET. |
| `responses/1020` | 406 | `report-filters` module must be allowed enum e.g. **`PAYMENT`** (`1042`). |
| `responses/1023` vs `1074` | 406 vs 200 | Email condition `triggerModule`: **`LEDGER_WITH_CLOSING_BALANCE`**, `LEDGER_BALANCE`, `VOUCHER_DUE`. |

Success counterparts: pending-report `908`–`911`, BD get/versions/history `1065`–`1068`, salesperson `975`–`979`/`1052`, billing `996`, currency rates `959`–`961`/`1055`–`1057`, multicompany TB **USD** `1076`, activity filters `943`/`944`, gocardless GB `1044`, generate-order `1080`, address/all `1012`. Catalog patched salesperson create + billing-account get + BD get.

### FE-pending backlog (tags 1100–1225) — 2026-10-23 — SESSION KILLED

Attempted **125** previously unmatched frontend-used APIs; **24** success; stopped when `1214-delete-users-destroy-session` invalidated Session-Id. Remaining **~196** in `_fe_pending_remaining.json`.

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/1214-delete-users-destroy-session` | 200 | **Kills Session-Id.** Never call destroy-session / wipe sessions / generate-auth-key in capture batches. |
| `responses/1160-put-company-stock-group` | 200 | PUT body with new `uniqueName` **renames** stock group (`apidoc-products` → `apidoc-temp-sg-342`). Prefer name-only updates. |
| `responses/1110-put-company-accounts-move` | 200 | Move with `{uniqueName: group}` relocates account — customer may leave `sundrydebtors`. |
| `responses/1143`–`1149`/`1154` | 400 | Subscription buy/change/get-amount need **`durationType`**. |
| `responses/1163`–`1168`/`1171`–`1175` | 400/404 | After rename, stock-group path `apidoc-products` 404; stock↔group mismatch errors. |
| `responses/1176`–`1189` | 404/412 | Bank registration/OTP/payor need real bank URN + account number (ICICI-style). |
| `responses/1190`–`1201` | 406/404 | Communication needs MSG91/platform integration; triggers 404 without setup. |
| `responses/1203`–`1211` | 404 | Project CRUD needs real project uniqueName (list `/project/all` is empty-OK). |
| `responses/1133`–`1135`/`1140` | 404 | Legacy v2 invoices generate / v4 bulk-generate paths 404 on this company shape. |
| `responses/1103` | 500 | Full PUT account (minimal body) → Internal Server Error; PATCH v2 (`1131`) works. |

Success counterparts: account GET/contacts/shared-with `1102`/`1105`/`1121`, PATCH account `1131`, balance `1132`, send-mail `1130`, billing PATCH `1146`, subscription list POST `1150`, stock-group GET/downloads `1159`/`1161`/`1162`/`1169`/`1170`, **v5 stock-group create** `1173` → `apidoc-temp-sg-3421`, project/all `1202`, communication generate-email `1192`, bank integration form `1183`.

### FE-pending resume (tags 1226–1421) — 2026-10-23 — Auth-Key — backlog exhausted

Auth-Key resume: restored `apidoc-products` + customer→`sundrydebtors`; attempted remaining **196**; **63** success / **133** soft-fail; **0** FE-used pending left. Blacklisted session-killers (none matched remaining list).

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `responses/1226-post-company-batch-transfer` | 400 | Batch transfer needs `fromBatchUniqueName` + `toBatchUniqueName`. |
| `responses/1229-post-company-batch-archive` | 400 | Archive action required: `TRANSFER` or `UNARCHIVED`. |
| `responses/1237` | 500 | customer-vendor-discount stock-variant update needs richer payload. |
| `responses/1240-delete-company-stock-unit` | 412 | Cannot delete stock unit while stocks still reference it. |
| `responses/1253`–`1258` | 406/404 | EWB needs integrated user + non-blank EWB no / cancel reason. |
| `responses/1259`/`1265`/`1266` | 400/415 | Imports upload wants multipart + valid `type` (not raw JSON). |
| `responses/1267`–`1274` | 406/400/500 | UK VAT/HMRC paths need HMRC connect + real tax number (not GST uniqueName). |
| `responses/1279`/`1280` | 400/406 | Cannot delete default address; PUT address needs ≥1 default. |
| `responses/1284`–`1286` | 406 | Company auth generate needs **role uniqueName**; remove/update need valid auth key. |
| `responses/1294`/`1295`/`1346`/`1350` | 200 | Destructive DELETEs succeeded — CVD / CF / role / tax-authority wiped; recreate before reuse. |
| `responses/1331`/`1342` | 401 | PayPal/Razorpay PUT need real gateway credentials. |
| `responses/1377-post-report-filters` | 406 | Module must be allowed enum (e.g. `PAYMENT`, `VARIANT_WISE…`). |
| `responses/1389` | 400 | GSP session needs valid GSP credentials (`WB_ERR_9001`). |
| `responses/1407`/`1408` | 404/500 | Template delete/put with `gst_template_a` fails on this company. |
| `responses/1416-get-v2-user` | 400 | This path still wants Session-Id even when Auth-Key works elsewhere. |

Success counterparts: groups masters/shared/download `1232`/`1234`/`1235`, stock unit PUT `1241`, inventory-report `1242`, stock aging `1247`–`1249`, stock details/variant `1251`/`1252`, imports reconciliation/signed-url `1261`/`1264`, UK/ZW VAT GETs `1272`/`1273`/`1365`–`1367`, company PATCH `1276`, address/all `1278`, advance-receipt `1282`/`1283`, gocardless refresh `1315`, inventory balance `1322`, warehouse `1362`–`1364`, country `1369`–`1371`, GSTR1 download `1391`, save GSTR3B `1404`, register detailed `1397`/`1402`, multibranch BS/PL `1395`/`1396`, white-label `1421`.

### Customer Portal prod remaining (1720–1745) — 2026-10-23

| Tag / file | HTTP / code | Lesson |
| --- | --- | --- |
| `1720-portal-prod-payment-methods-base` | 404 `USER_NOT_FOUND` | Portal `payment-methods` needs `?voucherVersion=2` (`1709`/`1738`). |
| `1722`/`1739` vouchers receipt list | 404 `USER_NOT_FOUND` | FE `GET …/vouchers?type=receipt` unmatched on portal gateway. |
| `1725`/`1726` page-count | 406 `INSUFFICIENT_PARAMETERS` | Require `page=` query (`INVOICE` or `PAYMENTS`). |
| `1736` page=invoices | 400 `INVALID_PARAMETER_PROVIDED` | Valid pages: `invoice`, `payments` (enum `Pages`). |
| `1727-portal-prod-invoice-pay` | 406 `INVALID_REQUEST` | Need payment provider + real `paymentId` from pay-request when `canPay`. |
| `1734`/`1741`/`1745` after logout | 401 `INVALID_SESSION_ID` | Expected after `DELETE …/destroy-session`. |
| `1746-portal-prod-get-company-details-unauthorised` | 401 `UNAUTHORISED` | Stale/wrong portal Session-Id (or session after switch/destroy) on `get-company-details`. Fresh Session-Id from `save-session` works (`1705`). |
