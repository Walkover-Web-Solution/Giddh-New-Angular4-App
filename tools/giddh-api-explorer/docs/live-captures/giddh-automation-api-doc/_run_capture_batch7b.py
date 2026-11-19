#!/usr/bin/env python3
"""Batch 7b follow-ups: pending DC/RC enums, PO PATCH, MF v1 units, recurring list,
tax authority refresh, columnar with FY, template preview, address POST, plans region.
"""
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
SUB = SECRETS.get("subscriptionId", "SUB-20261022-5")
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
REQ, RES = PACK / "requests", PACK / "responses"
LOG = PACK / "CALL-LOG-2026-10-23.json"
FROM, TO = "01-04-2026", "23-10-2026"
FY_TO = "31-03-2027"
DATE = "23-10-2026"
SALES_UN = "vitmq1792733952798"
PO_UN = "pze1792734608469"
WIDGET_VAR = "apidocwidget1792693959876fk8uyv0enl"
GADGET_VAR = "apidoc-gadget1792694923893w7fw4lbjd2"
PCS = "WfqOHXSFugRFzJ8HDrLT"


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
        "--max-time", "90",
    ]
    if body is not None:
        cmd.extend(["--data-binary", json.dumps(body)])
    out = subprocess.run(cmd, capture_output=True, text=True)
    text = out.stdout or ""
    if "__HTTP__" not in text:
        return "000", {"raw": text[:8000], "stderr": (out.stderr or "")[:500]}
    raw, http = text.rsplit("__HTTP__", 1)
    try:
        parsed = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        parsed = {"raw": raw[:8000]}
    return http.strip(), parsed


def call(tag, method, path, body=None):
    http, resp = curl(method, path, body)
    (REQ / f"{tag}.json").write_text(
        json.dumps(body if body is not None else {"method": method, "path": path}, indent=2)
    )
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2))
    log = json.loads(LOG.read_text())
    status = str(resp.get("status") or resp.get("error") or "") if isinstance(resp, dict) else ""
    msg = str(resp.get("message") or "")[:180] if isinstance(resp, dict) else ""
    log.append({"tag": tag, "method": method, "path": path, "http": http, "status": status, "message": msg})
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:260])
    return http, resp


def main():
    # pending reconciliation correct enums DC/RC + WITHOUT_CHALLAN/NOT_INVOICED
    for report in ("WITHOUT_CHALLAN", "NOT_INVOICED"):
        for doc, tag_suffix in (("DC", "dc"), ("RC", "rn")):
            call(
                f"627-pending-{tag_suffix}-{report.lower().replace('_','-')}",
                "POST",
                f"/company/{C}/business-documents/pending-report?from={FROM}&to={TO}&page=1&count=50&q=&sort=&sortBy=",
                {"reportType": report, "documentType": doc},
            )

    # PO correct verbs
    call(
        "628-po-pending-post",
        "POST",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/pending-numbers?page=1&count=50&sort=&sortBy=&pendingItems=true",
        {},
    )
    call(
        "629-po-status-patch",
        "PATCH",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/status/change",
        {"uniqueNames": [PO_UN], "status": "open"},
    )
    call(
        "630-po-bulk-patch",
        "PATCH",
        f"/company/{C}/purchase-order/bulk-update?action=dueDate",
        {"purchaseNumbers": ["PO-20261023-1"], "dueDate": "20-11-2026"},
    )
    call(
        "631-po-bulk-patch-un",
        "PATCH",
        f"/company/{C}/purchase-order/bulk-update?action=dueDate",
        {"uniqueNames": [PO_UN], "dueDate": "20-11-2026"},
    )
    # get full PO for update body
    http, po = call("632-po-get-full", "GET", f"/company/{C}/purchase-order/{PO_UN}")
    po_body = po.get("body") if isinstance(po, dict) else None
    if isinstance(po_body, dict):
        # light update: bump dueDate only keeping entries
        upd = json.loads(json.dumps(po_body))
        upd["dueDate"] = "20-11-2026"
        # strip response-only noise if present
        for k in ("createdAt", "updatedAt", "grandTotal", "entriesTotal", "voucherDate"):
            upd.pop(k, None)
        call(
            "633-po-update-put",
            "PUT",
            f"/company/{C}/accounts/apidoc-vendor-one/purchase-order?branchUniqueName={B}",
            upd,
        )

    # manufacturing v1 with manufacturingUnit on linked stocks (UI pattern)
    mf_v1 = {
        "date": DATE,
        "stockUniqueName": "apidoc-widget",
        "manufacturingMultipleOf": 1,
        "manufacturingQuantity": 1,
        "manufacturingUnitCode": "pcs",
        "manufacturingUnitUniqueName": PCS,
        "warehouseUniqueName": W,
        "variant": {"uniqueName": WIDGET_VAR},
        "linkedStocks": [
            {
                "stockUniqueName": "apidoc-gadget",
                "stockName": "API Doc Gadget",
                "quantity": 1,
                "manufacturingQuantity": 1,
                "manufacturingUnit": "pcs",
                "stockUnitCode": "pcs",
                "stockUnitUniqueName": PCS,
                "rate": 0,
                "amount": 0,
                "variant": {"uniqueName": GADGET_VAR},
            }
        ],
        "otherExpenses": [],
    }
    call(
        "634-mf-v1-with-unit",
        "POST",
        f"/company/{C}/stock/apidoc-widget/manufacture?branchUniqueName={B}",
        mf_v1,
    )
    # v2 with type=inside matching recipe
    mf_v2 = dict(mf_v1)
    mf_v2["type"] = "inside"
    mf_v2["inventoryType"] = "PRODUCT"
    mf_v2["increaseAssetValue"] = True
    mf_v2["byProducts"] = []
    call(
        "635-mf-v2-typed",
        "POST",
        f"/v2/company/{C}/stock/apidoc-widget/manufacture?branchUniqueName={B}",
        mf_v2,
    )
    # re-save recipe then manufacture
    call(
        "636-recipe-resave",
        "POST",
        f"/company/{C}/stock/apidoc-widget/recipe",
        {
            "manufacturingDetails": [
                {
                    "manufacturingQuantity": 1,
                    "manufacturingUnitCode": "pcs",
                    "manufacturingUnitUniqueName": PCS,
                    "manufacturingMultipleOf": 1,
                    "type": "inside",
                    "inventoryType": "PRODUCT",
                    "increaseAssetValue": True,
                    "variant": {"uniqueName": WIDGET_VAR, "name": "API Doc Widget"},
                    "linkedStocks": [
                        {
                            "stockUniqueName": "apidoc-gadget",
                            "stockName": "API Doc Gadget",
                            "quantity": 1,
                            "stockUnitUniqueName": PCS,
                            "stockUnitCode": "pcs",
                            "variant": {"uniqueName": GADGET_VAR, "name": "API Doc Gadget"},
                            "rate": 0,
                        }
                    ],
                    "otherExpenses": [],
                    "byProducts": [],
                }
            ]
        },
    )
    call(
        "637-mf-v2-after-recipe",
        "POST",
        f"/v2/company/{C}/stock/apidoc-widget/manufacture?branchUniqueName={B}",
        mf_v2,
    )
    call(
        "638-mf-stocks-refresh",
        "GET",
        f"/company/{C}/stocks-manufacture?page=1&count=50",
    )
    call(
        "639-mf-report-refresh",
        "GET",
        f"/company/{C}/stock/manufacture-report?from={FROM}&to={TO}&page=1&count=50",
    )

    # recurring list with voucherType=sales + alternate path
    call(
        "640-recurring-sales",
        "GET",
        f"/company/{C}/recurring-vouchers/get-all-recurring-voucher?voucherType=sales&page=1&count=50&q=&sort=&sortBy=&from={FROM}&to={FY_TO}&voucherVersion=2",
    )
    call(
        "641-recurring-legacy",
        "GET",
        f"/company/{C}/recurring-voucher/get-all/?count=50&page=1&sort=&sortBy=",
    )

    # tax authority list after create + tax list
    call("642-tax-authority-refresh", "GET", f"/company/{C}/tax/authority")
    call("643-tax-list-refresh", "GET", f"/company/{C}/tax")
    # ui taxes US (authority feature is US-oriented)
    call("644-ui-taxes-us", "GET", "/ui/taxes?country=US")
    call(
        "645-tax-authority-create-us-state",
        "POST",
        f"/company/{C}/tax/authority",
        {"name": "API Doc CA Authority", "stateCode": "CA", "description": "US-style capture"},
    )
    call("646-tax-authority-after-us", "GET", f"/company/{C}/tax/authority")

    # columnar with financialYear / month
    call(
        "647-columnar-fy",
        "POST",
        f"/v2/company/{C}/groups/sundrydebtors/export/account-balances-v2?fileType=json&page=1&count=50",
        {"from": FROM, "to": TO, "branchUniqueName": B, "financialYear": "2026-2027"},
    )
    call(
        "648-columnar-month",
        "POST",
        f"/v2/company/{C}/groups/sundrydebtors/export/account-balances-v2?fileType=json&page=1&count=50",
        {"from": FROM, "to": TO, "branchUniqueName": B, "month": "10-2026"},
    )
    call(
        "649-columnar-acct-excel",
        "POST",
        f"/company/{C}/accounts/cash/columnar-report?from={FROM}&to={TO}&page=1&count=50&branchUniqueName={B}",
        {"exportType": "xlsx"},
    )

    # template preview
    call(
        "650-template-preview",
        "GET",
        f"/v2/company/{C}/templates/gst_template_a?type=invoice&voucherVersion=2",
    )
    call(
        "651-template-preview-post",
        "POST",
        f"/v2/company/{C}/template-preview?voucherVersion=2",
        {"uniqueName": "gst_template_a", "type": "invoice"},
    )

    # address list POST (GET was 405)
    call("652-address-post", "POST", f"/company/{C}/address", {})
    call("653-address-get-all", "GET", f"/company/{C}/addresses")
    call("654-address-get-all2", "GET", f"/company/{C}/company-addresses")

    # logs POST / activity
    call(
        "655-logs-post",
        "POST",
        f"/company/{C}/logs?fromDate={FROM}&toDate={TO}&page=1&count=20",
        {"entity": ""},
    )
    call(
        "656-activity-get",
        "GET",
        f"/v2/company/{C}/activity-logs?from={FROM}&to={TO}&page=1&count=20",
    )

    # subscription plans region variants
    for region in ("in", "india", "IND", "IN ", "gl"):
        safe = region.strip().replace(" ", "_")
        call("657-sub-plans-" + safe, "GET", f"/v2/subscription/plans/all?regionCode={region.strip()}")

    call(
        "658-sub-companies-legacy",
        "GET",
        f"/subscriptions/{SUB}/companies",
    )
    call(
        "659-sub-country-list",
        "GET",
        f"/v2/subscription/{SUB}/country-list",
    )

    # ecommerce verify POST
    call(
        "660-ecommerce-verify-post",
        "POST",
        f"/company/{C}/ecommerce/verify/shopify",
        {},
    )
    call(
        "661-ecommerce-email",
        "POST",
        f"/company/{C}/ecommerce/email",
        {"email": "divyanshu@whozzat.com"},
    )

    # voucher get-all sales for preview data
    call(
        "662-vouchers-get-all-sales",
        "POST",
        f"/company/{C}/vouchers/get-all?page=1&count=20&from={FROM}&to={TO}&type=sales&voucherVersion=2&branchUniqueName={B}",
        {},
    )
    call(
        "663-v4-preview-alt",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-three/vouchers?voucherVersion=2",
        {"number": "261023-5"},
    )

    # discount list after assign
    call(
        "664-cvd-discounts-after",
        "GET",
        f"/company/{C}/customer-vendor-discount/get-all-discounts?uniqueName=apidoc-customer-one&query=&page=1&count=20",
    )

    # tax assign gst5 to sales
    call(
        "665-tax-assign-gst5",
        "POST",
        f"/company/{C}/tax/assign",
        [{"uniqueName": "sales", "taxes": ["apidocgst5", "apidocgst18"], "isAccount": True}],
    )

    # aged dues working path (previous 611 404)
    call(
        "666-aged-dues",
        "POST",
        f"/v2/company/{C}/groups/sundrydebtors/aged-dues?from={FROM}&to={TO}&count=50&page=1",
        {},
    )
    call(
        "667-contact-customer",
        "POST",
        f"/v2/company/{C}/groups/sundrydebtors/account-closing-balance?count=50&page=1&from={FROM}&to={TO}&q=&sort=&sortBy=",
        {},
    )

    # cashflow / new-vs-old alternate paths
    call(
        "668-cashflow-v2",
        "GET",
        f"/v2/company/{C}/cashflow-statement?from={FROM}&to={TO}",
    )
    call(
        "669-new-vs-old-post",
        "POST",
        f"/company/{C}/new-vs-old-invoices?type=monthly&from={FROM}&to={TO}",
        {},
    )

    # bill-to-bill export
    call(
        "670-bill-to-bill",
        "GET",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers/bill-to-bill/export-v2?from={FROM}&to={TO}",
    )

    # inventory users / batch
    call(
        "671-inventory-users",
        "GET",
        f"/company/{C}/inventory-users?q=&refresh=true&page=1&count=20",
    )
    call(
        "672-batch-all",
        "GET",
        f"/company/{C}/batch/all?page=1&count=50&from={FROM}&to={TO}&reportNature=INWARD",
    )

    # custom fields modules
    call("673-cf-stock", "GET", f"/company/{C}/customfield/module/stock?page=1&count=20")
    call("674-cf-voucher", "GET", f"/company/{C}/customfield/module/voucher?page=1&count=20")

    # settings discount create already exists — get one
    call("675-discount-list", "GET", f"/company/{C}/discount")

    # role scopes detail
    call("676-role-superadmin", "GET", f"/company/{C}/role")

    # get recurring preview dates again after make
    call(
        "677-recurring-preview-day",
        "POST",
        f"/company/{C}/recurring-vouchers/preview?voucherVersion=2",
        {
            "startDate": "24-10-2026",
            "repeatOption": "DAY",
            "frequency": {"interval": 1, "unit": "DAY"},
            "end": {"type": "ON_DATE", "endDate": "31-10-2026"},
        },
    )

    # statuses with documentType DC
    call(
        "678-bd-statuses-DC",
        "GET",
        f"/company/{C}/business-documents/statuses?documentType=DC",
    )
    call(
        "679-bd-statuses-RC",
        "GET",
        f"/company/{C}/business-documents/statuses?documentType=RC",
    )

    # export ledger admin pdf
    call(
        "680-export-ledger-admin-pdf",
        "GET",
        f"/company/{C}/accounts/cash/v3/export-ledger/file?from={FROM}&to={TO}&type=admin-consolidated&format=pdf&sort=asc",
    )

    print("\nBatch 7b complete.")


if __name__ == "__main__":
    main()
