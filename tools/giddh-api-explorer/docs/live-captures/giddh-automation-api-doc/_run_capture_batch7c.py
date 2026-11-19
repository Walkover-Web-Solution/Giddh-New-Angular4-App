#!/usr/bin/env python3
"""Batch 7c: PO status/bulk correct bodies, recurring rule/details, tax authority patch."""
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
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
REQ, RES = PACK / "requests", PACK / "responses"
LOG = PACK / "CALL-LOG-2026-10-23.json"
FROM, TO, FY_TO = "01-04-2026", "23-10-2026", "31-03-2027"
RV = "LUJYfC8PaG"


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
        return "000", {"raw": text[:8000], "stderr": (out.stderr or "")[:400]}
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
    log = [x for x in json.loads(LOG.read_text()) if x.get("tag") != tag]
    status = str(resp.get("status") or resp.get("error") or "") if isinstance(resp, dict) else ""
    msg = str(resp.get("message") or "")[:180] if isinstance(resp, dict) else ""
    log.append({"tag": tag, "method": method, "path": path, "http": http, "status": status, "message": msg})
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:260])
    return http, resp


def main():
    probe_http, _ = curl("GET", f"/company/{C}/tax")
    print("probe", probe_http)
    if probe_http == "000":
        print("network down")
        return

    call(
        "681-po-status-cancel",
        "PATCH",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/status/change",
        {"action": "cancelled", "purchaseNumber": "PO-20261023-1"},
    )
    call(
        "682-po-status-open",
        "PATCH",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/status/change",
        {"action": "open", "purchaseNumber": "PO-20261023-1"},
    )
    call(
        "683-po-bulk-duedate",
        "PATCH",
        f"/company/{C}/purchase-order/bulk-update?action=duedate",
        {"purchaseNumbers": ["PO-20261023-1"], "dueDate": "25-11-2026"},
    )
    call(
        "684-po-bulk-warehouse",
        "PATCH",
        f"/company/{C}/purchase-order/bulk-update?action=warehouse",
        {"purchaseNumbers": ["PO-20261023-1"], "warehouse": {"uniqueName": "xbq1792673424418"}},
    )
    call("685-recurring-rule", "GET", f"/company/{C}/recurring-vouchers/{RV}?voucherVersion=2")
    call("686-recurring-details", "GET", f"/company/{C}/recurring-vouchers/{RV}/details?voucherVersion=2")
    call(
        "687-recurring-status-inactive",
        "PATCH",
        f"/company/{C}/recurring-vouchers/{RV}?voucherVersion=2&status=INACTIVE&branchUniqueName={B}",
        {},
    )
    call(
        "688-recurring-status-active",
        "PATCH",
        f"/company/{C}/recurring-vouchers/{RV}?voucherVersion=2&status=ACTIVE&branchUniqueName={B}",
        {},
    )
    call(
        "689-tax-authority-patch",
        "PATCH",
        f"/company/{C}/tax/authority/apidoctaxauthoritymp",
        {"name": "API Doc Tax Authority MP", "description": "Updated via live capture", "stateCode": "MP"},
    )
    call("690-address-list-get", "GET", f"/company/{C}/address?page=1&count=50")
    call("691-address-list-post-filter", "POST", f"/company/{C}/address/get-all?page=1&count=50", {})
    for fy in ["APR-2026-MAR-2027", "2026-27"]:
        safe = fy.replace("/", "-")
        call(
            f"692-columnar-fy-{safe}",
            "POST",
            f"/v2/company/{C}/groups/sundrydebtors/export/account-balances-v2?fileType=json&page=1&count=20",
            {"from": FROM, "to": TO, "branchUniqueName": B, "financialYear": fy},
        )
    call(
        "693-batch-books",
        "GET",
        f"/company/{C}/batch/all?page=1&count=50&from={FROM}&to={TO}&reportNature=BOOKS",
    )
    call(
        "694-batch-inventory",
        "GET",
        f"/company/{C}/batch/all?page=1&count=50&from={FROM}&to={TO}&reportNature=INVENTORY",
    )
    call("696-get-addr-created", "GET", f"/company/{C}/address/vgv1792735015769")
    call(
        "697-cvd-vendors",
        "GET",
        f"/company/{C}/customer-vendor-discount/get-all-users?groupUniqueName=sundrycreditors&page=1&count=20&query=&userType=vendor",
    )
    call("698-stock-variants", "GET", f"/company/{C}/stock/apidoc-widget/variants")
    call("699-email-template-sales", "GET", f"/company/{C}/communication/email-template/sales")
    call(
        "700-recurring-list-final",
        "GET",
        f"/company/{C}/recurring-vouchers/get-all-recurring-voucher?voucherType=sales&page=1&count=50&q=&sort=&sortBy=&from={FROM}&to={FY_TO}&voucherVersion=2",
    )
    print("\nBatch 7c complete.")


if __name__ == "__main__":
    main()
