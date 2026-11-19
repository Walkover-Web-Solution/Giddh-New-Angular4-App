#!/usr/bin/env python3
"""Batch 5: fixups + more coverage after batch 4 lessons."""
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
ADDR = SECRETS.get("addressUniqueName", "8rz1792673422372")
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
REQ, RES = PACK / "requests", PACK / "responses"
LOG = PACK / "CALL-LOG-2026-10-23.json"
FROM, TO = "01-04-2026", "31-03-2027"
DATE = "23-10-2026"
SALES_UN = "rrftm1792675101875"


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
    if body is not None:
        (REQ / f"{tag}.json").write_text(json.dumps(body, indent=2))
    else:
        (REQ / f"{tag}.json").write_text(json.dumps({"method": method, "path": path}, indent=2))
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2))
    log = json.loads(LOG.read_text())
    status = str(resp.get("status") or resp.get("error") or "") if isinstance(resp, dict) else ""
    msg = str(resp.get("message") or "")[:180] if isinstance(resp, dict) else ""
    log.append({"tag": tag, "method": method, "path": path.split("?")[0], "http": http, "status": status, "message": msg})
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:240])
    return http, resp


def main():
    # estimates/proformas: query params like 148/149 (no voucherVersion)
    call(
        "314-estimates-all-query",
        "POST",
        f"/company/{C}/vouchers/v3/estimates/all?from={FROM}&to={TO}&page=1&count=50&branchUniqueName={B}",
        {},
    )
    call(
        "315-proformas-all-query",
        "POST",
        f"/company/{C}/vouchers/v3/proformas/all?from={FROM}&to={TO}&page=1&count=50&branchUniqueName={B}",
        {},
    )
    # estimate versions POST
    call(
        "316-estimate-versions-post",
        "POST",
        f"/v2/company/{C}/accounts/apidoc-customer-three/estimates/versions/all?page=1&count=20",
        {"uniqueName": "su71792731047950"},
    )
    # voucher-status-count POST
    call(
        "317-voucher-status-count-post",
        "POST",
        f"/company/{C}/vouchers/voucher-status-count?from={FROM}&to={TO}&type=sales&voucherVersion=2&branchUniqueName={B}",
        {},
    )
    # templates type=invoice
    call("318-templates-invoice", "GET", f"/v2/company/{C}/templates?type=invoice")
    # cancel einvoice with cnlRsn
    call(
        "319-cancel-einvoice-cnlRsn",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-two/vouchers/cancel-einvoice?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": SALES_UN, "cnlRsn": "1", "cnlRem": "API capture — no e-invoice expected"},
    )
    # branch-transfer list POST
    call(
        "320-branch-transfer-list-post",
        "POST",
        f"/company/{C}/branch-transfer/all?from={FROM}&to={TO}&page=1&count=50&sort=desc&sortBy=date",
        {},
    )
    # warehouse with address uniqueName
    call(
        "321-create-warehouse-addr",
        "POST",
        f"/company/{C}/warehouse",
        {
            "name": "API Doc Warehouse Two",
            "address": {"uniqueName": "rs61792733820379"},
        },
    )
    call(
        "321b-create-warehouse-full",
        "POST",
        f"/company/{C}/warehouse",
        {
            "name": "API Doc Warehouse Two",
            "taxNumber": "",
            "stockName": "",
            "address": "API Doc Street 2",
            "countries": [{"countryName": "India", "countryCode": "IN"}],
            "stateCode": "KA",
            "pincode": "560001",
        },
    )
    # inventory adjust better body
    reasons = json.loads((RES / "258-inv-adjust-reasons.json").read_text())
    reason_un = None
    body = reasons.get("body")
    if isinstance(body, dict):
        items = body.get("results") or body.get("items") or body.get("reasons") or []
        if isinstance(items, list) and items:
            reason_un = items[-1].get("uniqueName") or items[0].get("uniqueName")
    elif isinstance(body, list) and body:
        reason_un = body[-1].get("uniqueName") if isinstance(body[-1], dict) else None
    print("picked reason", reason_un)
    call(
        "322-inv-adjust-v2",
        "POST",
        f"/company/{C}/inventory-adjustment?voucherVersion=2&branchUniqueName={B}",
        {
            "date": DATE,
            "refNo": "INV-ADJ-API-003",
            "expenseAccountUniqueName": "sales",
            "warehouseUniqueName": W,
            "description": "API inventory adjustment capture",
            "entity": "VARIANT",
            "entityUniqueName": "apidocwidget1792693959876fk8uyv0enl",
            "reasonUniqueName": reason_un,
            "adjustmentMethod": "QUANTITY_WISE",
            "calculationMethod": "VALUE",
            "changeInValue": 1,
            "variantUniqueNames": ["apidocwidget1792693959876fk8uyv0enl"],
        },
    )
    # ledger merge with body but path like 228 (confirmed working list)
    call(
        "323-ledger-merge-sales",
        "POST",
        f"/company/{C}/accounts/sales/ledgers/merge?from={FROM}&to={TO}&sort=asc&page=1&count=50&branchUniqueName={B}",
        {
            "cancelledEntries": False,
            "balanceTypeAsSign": False,
            "includeAmount": False,
            "includeDescription": False,
            "includeVouchers": False,
            "includeParticulars": False,
            "includeTag": False,
        },
    )
    # get bulk ledger entry + delete it (vpcpb)
    call(
        "324-get-bulk-ledger",
        "GET",
        f"/company/{C}/accounts/cash/ledgers/vpcpb1792733811111?baseRef=true&voucherVersion=2",
    )
    call(
        "325-delete-bulk-ledger",
        "DELETE",
        f"/company/{C}/accounts/cash/entries/vpcpb1792733811111?voucherVersion=2&branchUniqueName={B}",
    )
    # branches list to find new branch uniqueName
    call("326-branches-after-create", "GET", f"/company/{C}/branch?hierarchyType=flatten")
    # more dashboard / homepage-ish
    call(
        "327-dashboard-graph-networth",
        "GET",
        f"/company/{C}/dashboard/graph?currentFrom=01-10-2026&currentTo=23-10-2026&previousFrom=01-09-2026&previousTo=30-09-2026&interval=daily&type=expense&uniqueName=purchases&refresh=false&branchUniqueName={B}",
    )
    call(
        "328-pending-count-purchase",
        "POST",
        f"/company/{C}/vouchers/voucher-status-count?from={FROM}&to={TO}&type=purchase&voucherVersion=2&branchUniqueName={B}",
        {},
    )
    # account search variants
    call(
        "329-account-search-v1",
        "POST",
        f"/company/{C}/v2/account-search",
        {"query": "apidoc"},
    )
    call(
        "330-account-search-get",
        "GET",
        f"/company/{C}/v3/account-search?q=cash&page=1&count=20",
    )
    # GST with company tax number if any from address
    call("331-address-all-again", "GET", f"/company/{C}/address/all")
    # manufacturing report
    call(
        "332-mf-report",
        "GET",
        f"/company/{C}/stock/manufacture-report?from={FROM}&to={TO}&page=1&count=50&branchUniqueName={B}",
    )
    # recipe get GET method
    call(
        "333-recipe-get",
        "GET",
        f"/company/{C}/stock/apidoc-widget/recipe/get?withRate=true",
    )
    # inventory adjust reason list refresh
    call("334-inv-reasons-refresh", "GET", f"/company/{C}/inventory-adjustment/reason/get-all?count=2000")
    # mail ledger
    call(
        "335-mail-ledger",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/mail-ledger?from={FROM}&to={TO}&voucherVersion=2",
        {"email": {"to": ["apidoc-test@example.com"]}, "message": "API capture statement"},
    )
    # get estimate via versions list then try download
    call(
        "336-estimate-download",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates/download?fileType=base64",
        {"uniqueName": "su71792731047950"},
    )
    call(
        "337-proforma-download",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/proformas/download?fileType=base64",
        {"uniqueName": "q2c1792731068597"},
    )
    # estimate action
    call(
        "338-estimate-action",
        "PUT",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates/action?voucherVersion=2",
        {"uniqueName": "su71792731047950", "action": "accepted"},
    )
    # export ledger columnar POST?
    call(
        "339-columnar-post",
        "POST",
        f"/company/{C}/accounts/cash/columnar-report?from={FROM}&to={TO}&voucherVersion=2&branchUniqueName={B}",
        {},
    )
    # view-statement POST?
    call(
        "340-view-statement-post",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/view-statement?count=50&lang=en&from={FROM}&to={TO}&sort=asc&page=1&q=&voucherVersion=2",
        {},
    )
    # bill-to-bill POST
    call(
        "341-bill-to-bill-post",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers/bill-to-bill/export-v2?from={FROM}&to={TO}&voucherVersion=2",
        {},
    )
    # reconcile body with entries
    call(
        "342-reconcile-body",
        "POST",
        f"/company/{C}/accounts/apidoc-bank-hdfc/ledgers-v2/reconcile?from={FROM}&to={TO}&chequeNumber=&voucherVersion=2",
        {"transactions": []},
    )
    # get roles scopes detail already done; company auth key read if exists
    call("343-company-auth-keys", "GET", f"/company/{C}/company-auth-key")
    call("344-inventory-settings", "GET", f"/company/{C}/inventory-settings?branchUniqueName={B}")
    call("345-export-settings", "GET", f"/company/{C}/export-settings")
    # warehouses after create attempts
    call("346-warehouses-again", "GET", f"/company/{C}/warehouse")
    # generate via estimate with fuller body matching generate response shape — still expect fail
    call(
        "347-generate-via-estimate-full",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-estimate?branchUniqueName={B}",
        {
            "number": "FROM-EST-2",
            "voucherDate": DATE,
            "uniqueName": "su71792731047950",
            "type": "sales",
        },
    )
    # account statement magic link already 233; also try without body
    call(
        "348-magic-link-cash",
        "POST",
        f"/company/{C}/accounts/cash/magic-link?from={FROM}&to={TO}",
        None,
    )
    # fix: magic-link with empty body via POST needs body - retry with {}
    call(
        "349-magic-link-cash-empty",
        "POST",
        f"/company/{C}/accounts/cash/magic-link?from={FROM}&to={TO}",
        {},
    )
    # daybook again for catalog example freshness
    call(
        "350-daybook-post",
        "POST",
        f"/company/{C}/daybook?page=1&count=50&from={FROM}&to={TO}&branchUniqueName={B}",
        {},
    )
    # tax list already; cancel action pattern for catalog
    call(
        "351-invoice-action-get",
        "GET",
        f"/company/{C}/invoices/{SALES_UN}/action?voucherVersion=2",
    )
    # homepage widgets probe
    for tag, path in [
        ("352-homepage", f"/company/{C}/homepage"),
        ("353-dashboard", f"/company/{C}/dashboard"),
        ("354-widgets", f"/company/{C}/widgets"),
        ("355-company-details", f"/company/{C}"),
    ]:
        call(tag, "GET", path)

    print("\nBatch 5 complete.")


if __name__ == "__main__":
    main()
