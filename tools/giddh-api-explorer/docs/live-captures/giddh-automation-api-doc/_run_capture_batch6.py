#!/usr/bin/env python3
"""Batch 6: estimate-by-number, inv-adjust, cancel-einvoice query, GST company gstin."""
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
GSTIN = "23AAACC1206D2ZN"  # from default address
REASON = "0zn1792733816931"
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
    (REQ / f"{tag}.json").write_text(
        json.dumps(body if body is not None else {"method": method, "path": path}, indent=2)
    )
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2))
    log = json.loads(LOG.read_text())
    status = str(resp.get("status") or resp.get("error") or "") if isinstance(resp, dict) else ""
    msg = str(resp.get("message") or "")[:180] if isinstance(resp, dict) else ""
    log.append({"tag": tag, "method": method, "path": path.split("?")[0], "http": http, "status": status, "message": msg})
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:240])
    return http, resp


def main():
    # estimate get/download/versions by estimateNumber
    call(
        "356-estimate-versions-by-number",
        "POST",
        f"/v2/company/{C}/accounts/apidoc-customer-three/estimates/versions/all?page=1&count=20",
        {"estimateNumber": "EST-20261023-1"},
    )
    call(
        "357-estimate-download-by-number",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates/download?fileType=base64",
        {"estimateNumber": "EST-20261023-1"},
    )
    call(
        "358-generate-via-estimate-number",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-estimate?branchUniqueName={B}",
        {"estimateNumber": "EST-20261023-1", "number": "FROM-EST-3", "voucherDate": DATE, "type": "sales"},
    )
    call(
        "359-proforma-download-by-number",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/proformas/download?fileType=base64",
        {"proformaNumber": "PR-20261023-1"},
    )
    call(
        "360-generate-via-proforma-number",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-proforma?branchUniqueName={B}",
        {"proformaNumber": "PR-20261023-1", "number": "FROM-PR-3", "voucherDate": DATE, "type": "sales"},
    )

    # cancel einvoice: cnlRsn as query param (UI pattern)
    call(
        "361-cancel-einvoice-query",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-two/vouchers/cancel-einvoice?voucherVersion=2&cnlRsn=1&cnlRem=API-capture",
        {"uniqueName": SALES_UN},
    )
    call(
        "362-cancel-einvoice-invoice-path",
        "POST",
        f"/company/{C}/invoice/{SALES_UN}/cancel-einvoice?voucherVersion=2&cnlRsn=1&cnlRem=API-capture",
        {},
    )

    # inventory adjust with STOCK entity + reason
    call(
        "363-inv-adjust-stock",
        "POST",
        f"/company/{C}/inventory-adjustment?voucherVersion=2&branchUniqueName={B}",
        {
            "date": DATE,
            "refNo": "INV-ADJ-API-004",
            "expenseAccountUniqueName": "sales",
            "warehouseUniqueName": W,
            "description": "API stock entity adjust",
            "entity": "STOCK",
            "entityUniqueName": "apidoc-widget",
            "reasonUniqueName": REASON,
            "adjustmentMethod": "QUANTITY_WISE",
            "calculationMethod": "VALUE",
            "changeInValue": 1,
            "variantUniqueNames": ["apidocwidget1792693959876fk8uyv0enl"],
        },
    )
    call(
        "364-inv-adjust-variant",
        "POST",
        f"/company/{C}/inventory-adjustment?voucherVersion=2&branchUniqueName={B}",
        {
            "date": DATE,
            "refNo": "INV-ADJ-API-005",
            "expenseAccountUniqueName": "sales",
            "warehouseUniqueName": W,
            "description": "API variant adjust",
            "entity": "VARIANT",
            "entityUniqueName": "apidocwidget1792693959876fk8uyv0enl",
            "reasonUniqueName": REASON,
            "adjustmentMethod": "QUANTITY_WISE",
            "calculationMethod": "QUANTITY",
            "changeInValue": 1,
            "variantUniqueNames": ["apidocwidget1792693959876fk8uyv0enl"],
        },
    )

    # GST with real company GSTIN
    call(
        "365-gstr1-company-gstin",
        "GET",
        f"/v2/company/{C}/gstr1?gstin={GSTIN}&from=01-10-2026&to=31-10-2026&branchUniqueName={B}",
    )
    call(
        "366-gstr-txn-count",
        "GET",
        f"/company/{C}/gstreturn/gstr-transaction-count?gstin={GSTIN}&from=01-10-2026&to=31-10-2026",
    )
    call(
        "367-gstr1-summary-overview",
        "GET",
        f"/v2/company/{C}/gstr1-summary?gstin={GSTIN}&from=01-10-2026&to=31-10-2026",
    )

    # ledger merge is the working transactions list — capture cash with fuller filters
    call(
        "368-ledger-merge-bank",
        "POST",
        f"/company/{C}/accounts/apidoc-bank-hdfc/ledgers/merge?from={FROM}&to={TO}&sort=asc&page=1&count=50&branchUniqueName={B}",
        {"cancelledEntries": False},
    )

    # warehouse get by uniqueName
    call("369-get-warehouse-two", "GET", f"/company/{C}/warehouse/4gr1792733898078")
    call("370-get-branch-two", "GET", f"/company/{C}/branch/apidocbranchtwo")
    call("371-get-address-two", "GET", f"/company/{C}/address/rs61792733820379")

    # estimate get by number variants
    call(
        "372-get-estimate-by-number-path",
        "GET",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates/EST-20261023-1",
    )
    call(
        "373-estimate-get-post-number",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates",
        {"estimateNumber": "EST-20261023-1"},
    )

    print("\nBatch 6 complete.")


if __name__ == "__main__":
    main()
