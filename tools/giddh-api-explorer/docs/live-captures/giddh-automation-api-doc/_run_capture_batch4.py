#!/usr/bin/env python3
"""Batch 4: tags 226+ — ledger alts, vouchers, estimate, inventory, GST, dashboard, settings."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

PACK = Path(__file__).resolve().parent
SECRETS = json.loads((PACK / "secrets.local.json").read_text())
SID = SECRETS["sessionId"]
BASE = SECRETS.get("baseUrl", "https://apitest.giddh.com")
C = SECRETS["companyUniqueName"]
B = SECRETS["branchUniqueName"]
W = SECRETS.get("warehouseUniqueName", "xbq1792673424418")
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
REQ, RES = PACK / "requests", PACK / "responses"
LOG = PACK / "CALL-LOG-2026-10-23.json"
FROM, TO = "01-04-2026", "31-03-2027"
DATE = "23-10-2026"
LEDGER_ENTRY = "tpfal1792733167512"
EST = "su71792731047950"
PRO = "q2c1792731068597"
SALES_UN = "rrftm1792675101875"  # unpaid customer-two
GSTIN_SAMPLE = "29AAAAA0000A1Z5"


def curl(method, path, body=None):
    url = f"{BASE}{path}"
    cmd = [
        "curl", "-sS", "-X", method, url,
        "-H", f"Session-Id: {SID}",
        "-H", "Accept: application/json",
        "-H", "Content-Type: application/json",
        "-H", "Origin: https://test.giddh.com",
        "-H", f"User-Agent: {UA}",
        "-w", "\n__HTTP__%{http_code}",
        "--max-time", "60",
    ]
    if body is not None:
        cmd.extend(["--data-binary", json.dumps(body)])
    out = subprocess.run(cmd, capture_output=True, text=True)
    text = out.stdout or ""
    if out.returncode != 0 and not text:
        return "000", {"raw": (out.stderr or "")[:4000], "curlExit": out.returncode}
    if "__HTTP__" not in text:
        return "000", {"raw": text[:8000]}
    raw, http = text.rsplit("__HTTP__", 1)
    try:
        parsed = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        parsed = {"raw": raw[:8000]}
    return http.strip(), parsed


def call(tag, method, path, body=None):
    http, resp = curl(method, path, body)
    meta = {"method": method, "path": path, "body": body}
    (REQ / f"{tag}.json").write_text(json.dumps(meta if body is not None else {"method": method, "path": path}, indent=2))
    if body is not None:
        (REQ / f"{tag}.json").write_text(json.dumps(body, indent=2))
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2))
    log = json.loads(LOG.read_text())
    status = ""
    msg = ""
    if isinstance(resp, dict):
        status = str(resp.get("status") or resp.get("error") or "")
        msg = str(resp.get("message") or "")[:180]
        if not msg and isinstance(resp.get("body"), dict):
            msg = str(resp["body"].get("message") or "")[:180]
    log.append({
        "tag": tag,
        "method": method,
        "path": path.split("?")[0],
        "http": http,
        "status": status,
        "message": msg,
    })
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:240])
    return http, resp


def main():
    # --- session sanity (also saved) ---
    call("226-session-settings", "GET", f"/company/{C}/settings")

    # ========== 1. Ledger ==========
    # advance search / merge (often the working transactions list)
    merge_body = {
        "groupUniqueNames": [],
        "accountUniqueNames": [],
        "includeAmount": False,
        "amount": 0,
        "amountGreaterThan": False,
        "amountLessThan": False,
        "amountEqualTo": False,
        "includeDescription": False,
        "description": "",
        "vouchers": [],
        "includeVouchers": False,
        "includeParticulars": False,
        "particulars": [],
        "isInvoiceGenerated": False,
        "includeTag": False,
        "tags": [],
        "cancelledEntries": False,
        "balanceTypeAsSign": False,
    }
    call(
        "227-ledger-merge-advance-search",
        "POST",
        f"/company/{C}/accounts/cash/ledgers/merge?from={FROM}&to={TO}&sort=asc&page=1&count=50&q=&branchUniqueName={B}&voucherVersion=2",
        merge_body,
    )
    call(
        "228-ledger-merge-no-vv",
        "POST",
        f"/company/{C}/accounts/cash/ledgers/merge?from={FROM}&to={TO}&sort=asc&page=1&count=20&branchUniqueName={B}",
        merge_body,
    )
    call(
        "229-get-ledger-entry",
        "GET",
        f"/company/{C}/accounts/cash/ledgers/{LEDGER_ENTRY}?baseRef=true&voucherVersion=2&branchUniqueName={B}",
    )
    # update ledger entry (PUT universal)
    call(
        "230-update-ledger-entry",
        "PUT",
        f"/company/{C}/accounts/cash/ledgers/{LEDGER_ENTRY}?voucherVersion=2&branchUniqueName={B}",
        {
            "transactions": [
                {"amount": 25, "particular": "sales", "type": "DEBIT"}
            ],
            "voucherType": "sales",
            "entryDate": DATE,
            "description": "API capture ledger update",
        },
    )
    # reconcile
    call(
        "231-ledger-reconcile",
        "POST",
        f"/company/{C}/accounts/cash/ledgers-v2/reconcile?from={FROM}&to={TO}&chequeNumber=&voucherVersion=2&branchUniqueName={B}",
        {},
    )
    call(
        "232-ledger-reconcile-get",
        "GET",
        f"/company/{C}/accounts/cash/ledgers-v2/reconcile?from={FROM}&to={TO}&chequeNumber=&voucherVersion=2",
    )
    # magic link / statement / export / bill-to-bill
    call(
        "233-magic-link",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/magic-link?from={FROM}&to={TO}&branchUniqueName={B}",
        {},
    )
    call(
        "234-view-statement",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/view-statement?count=50&lang=en&from={FROM}&to={TO}&sort=asc&page=1&q=&voucherVersion=2&branchUniqueName={B}",
    )
    call(
        "235-export-ledger",
        "GET",
        f"/company/{C}/accounts/cash/v3/export-ledger/file?from={FROM}&to={TO}&type=admin-detailed&format=pdf&sort=asc&voucherVersion=2&branchUniqueName={B}",
    )
    call(
        "236-bill-to-bill-export",
        "GET",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers/bill-to-bill/export-v2?from={FROM}&to={TO}&voucherVersion=2&branchUniqueName={B}",
    )
    call(
        "237-account-search-predicted",
        "GET",
        f"/company/{C}/account-search-predicted?accountUniqueName=cash",
    )
    call(
        "238-giddh-ledger-retry",
        "GET",
        f"/company/{C}/accounts/cash/giddh-ledger?count=50&from={FROM}&page=1&q=&reversePage=false&sort=asc&to={TO}&accountCurrency=true&voucherVersion=2&branchUniqueName={B}",
    )
    call(
        "239-ledgers-transactions-retry",
        "GET",
        f"/company/{C}/accounts/cash/ledgers/transactions?count=50&from={FROM}&page=1&q=&reversePage=false&sort=asc&to={TO}&voucherVersion=2&branchUniqueName={B}",
    )
    # bulk ledger create
    call(
        "240-bulk-ledgers-v2",
        "POST",
        f"/company/{C}/accounts/cash/bulk-ledgers-v2?voucherVersion=2&branchUniqueName={B}",
        [
            {
                "transactions": [
                    {"amount": 10, "particular": "sales", "type": "DEBIT"}
                ],
                "voucherType": "sales",
                "entryDate": DATE,
                "description": "API bulk ledger 1",
            }
        ],
    )

    # ========== 2. Voucher ops ==========
    call(
        "241-voucher-status-count",
        "GET",
        f"/company/{C}/vouchers/voucher-status-count?from={FROM}&to={TO}&type=sales&voucherVersion=2&branchUniqueName={B}",
    )
    call(
        "242-pending-report",
        "POST",
        f"/company/{C}/business-documents/pending-report?voucherVersion=2&branchUniqueName={B}",
        {"from": FROM, "to": TO, "page": 1, "count": 20},
    )
    call(
        "243-bulk-export-vouchers",
        "POST",
        f"/company/{C}/vouchers/bulk-export?from={FROM}&to={TO}&type=sales&mail=false&q=&voucherVersion=2&branchUniqueName={B}",
        {"voucherUniqueNames": [SALES_UN]},
    )
    call(
        "244-cancel-einvoice-safe",
        "POST",
        f"/company/{C}/invoice/{SALES_UN}/cancel-einvoice?voucherVersion=2&branchUniqueName={B}",
        {"cancelReason": "API doc capture test — expect fail if no e-invoice"},
    )
    call(
        "245-voucher-cancel-einvoice-alt",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-two/vouchers/cancel-einvoice?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": SALES_UN},
    )
    call(
        "246-sms-magic-link",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-two/vouchers/261022-3/magic-link?expirey=1&voucherVersion=2",
        {},
    )
    call(
        "247-voucher-versions",
        "GET",
        f"/company/{C}/voucher/{SALES_UN}/versions?page=1&count=20&voucherVersion=2",
    )
    call(
        "248-bulk-generate",
        "POST",
        f"/v4/company/{C}/vouchers/bulk-generate?combined=false&voucherVersion=2&branchUniqueName={B}",
        [],
    )

    # ========== 3. Estimate / proforma ==========
    call(
        "249-estimates-all",
        "POST",
        f"/company/{C}/vouchers/v3/estimates/all?voucherVersion=2&branchUniqueName={B}",
        {"from": FROM, "to": TO, "page": 1, "count": 50, "type": "estimate"},
    )
    call(
        "250-proformas-all",
        "POST",
        f"/company/{C}/vouchers/v3/proformas/all?voucherVersion=2&branchUniqueName={B}",
        {"from": FROM, "to": TO, "page": 1, "count": 50, "type": "proforma"},
    )
    call(
        "251-estimate-versions",
        "GET",
        f"/v2/company/{C}/accounts/apidoc-customer-three/estimates/versions/all?page=1&count=20&voucherUniqueName={EST}",
    )
    call(
        "252-get-estimate-v3",
        "GET",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates/{EST}?voucherVersion=2",
    )
    call(
        "253-get-estimate-post",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates?voucherVersion=2",
        {"uniqueName": EST},
    )
    call(
        "254-generate-via-estimate",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-estimate?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": EST, "voucher": {"number": "FROM-EST-1", "date": DATE}},
    )
    call(
        "255-generate-via-proforma",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-proforma?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": PRO, "voucher": {"number": "FROM-PR-1", "date": DATE}},
    )
    call(
        "256-proforma-via-estimate",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/proformas/generate-via-estimate?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": EST},
    )
    call(
        "257-bd-convert-estimate",
        "POST",
        f"/company/{C}/business-documents/convert?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": EST, "type": "estimate", "convertTo": "sales"},
    )

    # ========== 4. Inventory ==========
    call(
        "258-inv-adjust-reasons",
        "GET",
        f"/company/{C}/inventory-adjustment/reason/get-all?count=2000",
    )
    call(
        "259-inv-adjust-create-reason",
        "POST",
        f"/company/{C}/inventory-adjustment/reason",
        {"reason": "API Doc shrinkage reason"},
    )
    # create inventory adjustment (quantity wise) — may fail; capture either way
    call(
        "260-inv-adjust-create",
        "POST",
        f"/company/{C}/inventory-adjustment?voucherVersion=2&branchUniqueName={B}",
        {
            "date": DATE,
            "refNo": "INV-ADJ-API-001",
            "warehouseUniqueName": W,
            "description": "API capture inventory adjustment",
            "entity": {
                "entity": "VARIANT",
                "uniqueName": "apidocwidget1792693959876fk8uyv0enl",
            },
            "variantUniqueNames": ["apidocwidget1792693959876fk8uyv0enl"],
            "adjustmentMethod": "QUANTITY_WISE",
            "calculationMethod": "VALUE",
            "changeInValue": 1,
            "reasonUniqueName": None,
        },
    )
    call(
        "261-inv-adjust-report",
        "POST",
        f"/company/{C}/inventory-adjustment/adjustment-report?page=1&from={FROM}&to={TO}&count=50&sortBy=&sort=&q=&searchBy=&inventoryType=PRODUCT",
        {},
    )
    call(
        "262-manufacturing-stocks",
        "GET",
        f"/company/{C}/stocks-manufacture?branchUniqueName={B}",
    )
    call(
        "263-recipe-get-post",
        "POST",
        f"/company/{C}/stock/apidoc-widget/recipe/get?withRate=true",
        ["apidocwidget1792693959876fk8uyv0enl"],
    )
    call(
        "264-recipe-create",
        "POST",
        f"/company/{C}/stock/apidoc-widget/recipe",
        {
            "manufacturingQuantity": 1,
            "manufacturingUnitCode": "pcs",
            "manufacturingUnitUniqueName": "WfqOHXSFugRFzJ8HDrLT",
            "variantUniqueName": "apidocwidget1792693959876fk8uyv0enl",
            "linkeds": [
                {
                    "stockUniqueName": "apidoc-gadget",
                    "variantUniqueName": "apidoc-gadget1792694923893w7fw4lbjd2",
                    "quantity": 1,
                    "stockUnitUniqueName": "WfqOHXSFugRFzJ8HDrLT",
                }
            ],
        },
    )
    call(
        "265-branch-transfer-list",
        "GET",
        f"/company/{C}/branch-transfer/all?from={FROM}&to={TO}&page=1&count=50&sort=desc&sortBy=date",
    )
    call(
        "266-branch-transfer-generate",
        "POST",
        f"/company/{C}/branch-transfer/generate?voucherVersion=2&branchUniqueName={B}",
        {
            "date": DATE,
            "products": [
                {
                    "stockUniqueName": "apidoc-widget",
                    "variantUniqueName": "apidocwidget1792693959876fk8uyv0enl",
                    "stockUnitUniqueName": "WfqOHXSFugRFzJ8HDrLT",
                    "quantity": 1,
                }
            ],
            "transfers": [
                {
                    "entityDetails": {
                        "uniqueName": W,
                        "entity": "warehouse",
                    },
                    "fromWarehouse": {"uniqueName": W},
                    "toWarehouse": {"uniqueName": W},
                }
            ],
        },
    )
    call(
        "267-bulk-stock-product",
        "POST",
        f"/v2/company/{C}/stock?page=1&count=50&inventoryType=PRODUCT&branchUniqueName={B}",
        {},
    )
    call(
        "268-inventory-search",
        "POST",
        f"/company/{C}/inventory-search?branchUniqueName={B}",
        {"q": "apidoc"},
    )

    # ========== 5. Branches / warehouses / address ==========
    call("269-get-branches", "GET", f"/company/{C}/branch?hierarchyType=hierarchical")
    call(
        "270-create-warehouse",
        "POST",
        f"/company/{C}/warehouse",
        {
            "name": "API Doc Warehouse Two",
            "address": "API Doc Road",
            "countries": [{"countryName": "India", "countryCode": "IN"}],
        },
    )
    call("271-address-all", "GET", f"/company/{C}/address/all")
    call(
        "272-create-address",
        "POST",
        f"/company/{C}/address",
        {
            "name": "API Doc Addr Two",
            "taxNumber": "",
            "stateCode": "29",
            "state": {"code": "29", "name": "Karnataka"},
            "address": "API Doc Street 2",
            "pincode": "560001",
            "isDefault": False,
        },
    )
    # careful: create branch may succeed — use distinct name
    call(
        "273-create-branch",
        "POST",
        f"/company/{C}/branch",
        {
            "name": "API Doc Branch Two",
            "alias": "apidoc-branch-two",
        },
    )

    # ========== 6. Permissions / users ==========
    call("274-company-users", "GET", f"/company/{C}/users")
    call("275-shared-with", "GET", f"/company/{C}/shared-with")
    call("276-roles", "GET", f"/company/{C}/role")
    call("277-scope-v2", "GET", "/scope-v2")
    user = SECRETS.get("userUniqueName", "")
    if user:
        call(
            "278-company-uer",
            "GET",
            f"/users/{user}/company-uer?companyUniqueName={C}",
        )

    # ========== 7. Search / import MS probes ==========
    call(
        "279-account-search-v3",
        "POST",
        f"/company/{C}/v3/account-search",
        {"query": "apidoc", "searchType": "account"},
    )
    call(
        "280-account-search-2",
        "POST",
        f"/company/{C}/account-search-2",
        {"q": "cash"},
    )
    call(
        "281-account-closing-balance",
        "POST",
        f"/v2/company/{C}/groups/sundrydebtors/account-closing-balance?count=50&from={FROM}&to={TO}&refresh=true&page=1&branchUniqueName={B}",
        {},
    )
    call(
        "282-import-ms-probe",
        "GET",
        f"/company/{C}/imports?page=1&count=20",
    )
    call(
        "283-search-api-probe",
        "GET",
        f"/v2/company/{C}/search?q=apidoc",
    )

    # ========== 8. GST / tax reports (read-safe) ==========
    call("284-gst-info", "GET", f"/gst-info?gstin={GSTIN_SAMPLE}")
    call("285-gst-unit-mapping", "GET", f"/v2/company/{C}/gst/unit-mapping")
    call("286-gst-setting-list", "GET", f"/company/{C}/gst-setting/list")
    call(
        "287-gstr1-summary",
        "GET",
        f"/v2/company/{C}/gstr1?gstin={GSTIN_SAMPLE}&from=01-10-2026&to=31-10-2026&branchUniqueName={B}",
    )
    call(
        "288-gstr-transaction-count",
        "GET",
        f"/company/{C}/gstreturn/gstr-transaction-count?gstin={GSTIN_SAMPLE}&from=01-10-2026&to=31-10-2026",
    )
    call("289-tax-get-all", "GET", f"/company/{C}/tax")

    # ========== 9. Dashboard ==========
    call(
        "290-ratio-analysis",
        "GET",
        f"/company/{C}/calculateRatios?date={DATE}&refresh=true&branchUniqueName={B}",
    )
    call("291-graph-types", "GET", "/ui/graph-types")
    call(
        "292-dashboard-graph",
        "GET",
        f"/company/{C}/dashboard/graph?currentFrom=01-10-2026&currentTo=23-10-2026&previousFrom=01-09-2026&previousTo=30-09-2026&interval=daily&type=revenue&uniqueName=sales&refresh=true&branchUniqueName={B}",
    )
    call(
        "293-compared-pl",
        "GET",
        f"/v2/company/{C}/multibranch/compared-profit-loss?tax=30&from={FROM}&to={TO}&refresh=true&branchUniqueName={B}",
    )

    # ========== 10. Settings / templates / FY read ==========
    call("294-invoice-templates", "GET", f"/v2/company/{C}/templates?type=sales")
    call("295-sample-templates", "GET", f"/v2/company/{C}/sample-templates?type=sales")
    call("296-templates-all", "GET", f"/company/{C}/templates/all")
    call(
        "297-email-template-sales",
        "GET",
        f"/v2/company/{C}/communication/email-template/sales",
    )
    call(
        "298-email-content-suggestion",
        "GET",
        f"/company/{C}/communication/email-content-suggestion",
    )
    call("299-financial-year", "GET", f"/company/{C}/financial-year")
    call("300-financial-year-limits", "GET", f"/company/{C}/financial-year-limits")
    call(
        "301-triggers-all",
        "GET",
        f"/v2/company/{C}/trigger/all?page=1&count=50",
    )

    # ========== 11. Extra useful reads ==========
    call(
        "302-export-account-statement",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/export-account-statement?from={FROM}&to={TO}&q=&voucherVersion=2",
    )
    call(
        "303-columnar-report",
        "GET",
        f"/company/{C}/accounts/cash/columnar-report?from={FROM}&to={TO}&voucherVersion=2&branchUniqueName={B}",
    )
    call(
        "304-currency-converter",
        "GET",
        f"/company/{C}/currency-converter/INR/USD",
    )
    call(
        "305-stock-groups-with-stocks",
        "GET",
        f"/company/{C}/stock-groups-with-stocks?inventoryType=PRODUCT&q=apidoc",
    )
    call(
        "306-get-warehouse-list",
        "GET",
        f"/company/{C}/warehouse",
    )
    call(
        "307-children-branches",
        "GET",
        f"/company/{C}/children?from={FROM}&to={TO}",
    )
    call(
        "308-entry-settings",
        "GET",
        f"/company/{C}/entry-settings?branchUniqueName={B}",
    )
    # delete ledger entry LAST (destructive) — only if update worked; try soft probe first via DELETE on a NEW entry from bulk if any
    # Create a disposable ledger then delete it
    http, resp = call(
        "309-ledgers-v2-disposable",
        "POST",
        f"/company/{C}/accounts/cash/ledgers-v2?voucherVersion=2&branchUniqueName={B}",
        {
            "transactions": [
                {"amount": 5, "particular": "sales", "type": "DEBIT"}
            ],
            "voucherType": "sales",
            "entryDate": DATE,
            "description": "API disposable for delete",
        },
    )
    disposable = None
    if isinstance(resp, dict) and resp.get("status") == "success":
        body = resp.get("body")
        if isinstance(body, list) and body:
            disposable = body[0]
        elif isinstance(body, str):
            disposable = body
    if disposable:
        call(
            "310-delete-ledger-entry",
            "DELETE",
            f"/company/{C}/accounts/cash/entries/{disposable}?voucherVersion=2&branchUniqueName={B}",
        )
    else:
        call(
            "310-delete-ledger-entry-skip",
            "GET",
            f"/company/{C}/accounts/cash/ledgers/{LEDGER_ENTRY}?baseRef=true",
        )

    # inv adjust with reason if we got one
    reason_un = None
    try:
        r = json.loads((RES / "259-inv-adjust-create-reason.json").read_text())
        if r.get("status") == "success":
            b = r.get("body")
            if isinstance(b, dict):
                reason_un = b.get("uniqueName")
            elif isinstance(b, str):
                reason_un = b
    except Exception:
        pass
    if reason_un:
        call(
            "311-inv-adjust-with-reason",
            "POST",
            f"/company/{C}/inventory-adjustment?voucherVersion=2&branchUniqueName={B}",
            {
                "date": DATE,
                "refNo": "INV-ADJ-API-002",
                "warehouseUniqueName": W,
                "description": "API adj with reason",
                "variantUniqueNames": ["apidocwidget1792693959876fk8uyv0enl"],
                "adjustmentMethod": "QUANTITY_WISE",
                "calculationMethod": "VALUE",
                "changeInValue": 1,
                "reasonUniqueName": reason_un,
            },
        )

    # estimate get via GET company vouchers path variants
    call(
        "312-estimate-get-company-path",
        "GET",
        f"/company/{C}/vouchers/v3/estimates/{EST}?voucherVersion=2",
    )
    call(
        "313-proforma-get-v3",
        "GET",
        f"/v3/company/{C}/accounts/apidoc-customer-three/proformas/{PRO}?voucherVersion=2",
    )

    print("\nBatch 4 complete.")


if __name__ == "__main__":
    main()
