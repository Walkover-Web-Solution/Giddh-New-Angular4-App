#!/usr/bin/env python3
"""Batch 3: remaining fixes + a few more useful endpoints."""
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
    ]
    if body is not None:
        cmd.extend(["--data-binary", json.dumps(body)])
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    if "__HTTP__" not in out:
        return "000", {"raw": out}
    raw, http = out.rsplit("__HTTP__", 1)
    try:
        parsed = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        parsed = {"raw": raw[:8000]}
    return http.strip(), parsed


def call(tag, method, path, body=None):
    http, resp = curl(method, path, body)
    (REQ / f"{tag}.json").write_text(json.dumps(body if body is not None else {"method": method, "path": path}, indent=2))
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2))
    log = json.loads(LOG.read_text())
    status = str(resp.get("status") or resp.get("error") or "") if isinstance(resp, dict) else ""
    msg = str(resp.get("message") or "")[:180] if isinstance(resp, dict) else ""
    log.append({"tag": tag, "method": method, "path": path.split("?")[0], "http": http, "status": status, "message": msg})
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:220])
    return resp


def main():
    # 201 mappings empty array
    call("201-stock-unit-mappings", "POST", f"/company/{C}/stock-unit/mappings", [])

    # 202 tax assign to account
    call(
        "202-tax-assign-account",
        "POST",
        f"/company/{C}/tax/assign",
        [{"uniqueName": "apidoc-customer-one", "taxes": ["apidocgst18"], "isAccount": True}],
    )

    # 203 tax assign to sales group
    call(
        "203-tax-assign-group",
        "POST",
        f"/company/{C}/tax/assign",
        [{"uniqueName": "revenuefromoperations", "taxes": ["apidocgst18"], "isAccount": False}],
    )

    # 204 download without downloadOption
    call(
        "204-download-file",
        "POST",
        f"/company/{C}/download-file?voucherVersion=2&fileType=base64&branchUniqueName={B}",
        {
            "voucherUniqueNames": ["iiy341792675102708"],
            "typeOfInvoice": ["Original"],
            "voucherType": "sales",
        },
    )
    call(
        "204b-download-pdf-option",
        "POST",
        f"/company/{C}/download-file?voucherVersion=2&fileType=base64&downloadOption=pdf&branchUniqueName={B}",
        {"voucherUniqueNames": ["iiy341792675102708"], "voucherType": "sales"},
    )

    # 205 make-recurring with repeatEvery
    call(
        "205-make-recurring",
        "POST",
        f"/v4/company/{C}/vouchers/rrftm1792675101875/make-recurring?voucherVersion=2&branchUniqueName={B}",
        {
            "interval": 1,
            "period": "MONTHLY",
            "repeatEvery": 1,
            "repeatOption": "MONTHLY",
            "startDate": "01-11-2026",
            "endDate": "01-03-2027",
            "nextCronDate": "01-11-2026",
        },
    )

    # 206 bulk update POST
    call(
        "206-bulk-update-post",
        "POST",
        f"/company/{C}/vouchers/bulk-update?action=dueDate&voucherVersion=2&branchUniqueName={B}",
        {"voucherUniqueNames": ["rrftm1792675101875"], "dueDate": "20-11-2026"},
    )

    # 207 subscription companies POST
    sub = SECRETS.get("subscriptionId") or "SUB-20261022-5"
    call(
        "207-subscription-companies-post",
        "POST",
        f"/v2/subscription/company-list/{sub}?sort=asc&sortBy=&page=1&count=20&q=",
        {},
    )
    call("207b-subscription-companies-get", "GET", f"/subscriptions/{sub}/companies")

    # 208 estimate get via v3 list item path with estimateNumber in query?
    call(
        "208-estimate-get-v3",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates?voucherVersion=2&branchUniqueName={B}",
        {"estimateNumber": "EST-20261023-1"},
    )

    # 209 convert estimate via business-documents
    call(
        "209-bd-convert",
        "POST",
        f"/company/{C}/business-documents/convert?voucherVersion=2&branchUniqueName={B}",
        {
            "uniqueName": "su71792731047950",
            "from": "estimate",
            "to": "sales",
            "accountUniqueName": "apidoc-customer-three",
        },
    )

    # 210 CN adjust against unpaid sales via receipt-style adjust on CN
    # Create small unpaid sales for CN adjust demo first
    sales = call(
        "210-sales-for-cn-adjust",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-three/vouchers/generate?branchUniqueName={B}&voucherVersion=2",
        {
            "type": "sales",
            "date": "23-10-2026",
            "dueDate": "06-11-2026",
            "exchangeRate": 1,
            "applyApplicableTaxes": False,
            "roundOffApplicable": False,
            "updateAccountDetails": False,
            "company": {
                "name": "Giddh Automation API DOC",
                "uniqueName": C,
                "billingDetails": {
                    "name": "Default Address",
                    "address": ["My new address"],
                    "gstNumber": "23AAACC1206D2ZN",
                    "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                    "stateCode": "MP",
                    "pincode": "484224",
                    "countryCode": "IN",
                },
                "shippingDetails": {
                    "name": "Default Address",
                    "address": ["My new address"],
                    "gstNumber": "23AAACC1206D2ZN",
                    "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                    "stateCode": "MP",
                    "pincode": "484224",
                    "countryCode": "IN",
                },
            },
            "account": {
                "uniqueName": "apidoc-customer-three",
                "name": "API Doc Customer Three",
                "customerName": "API Doc Customer Three",
                "currency": {"code": "INR", "symbol": "₹"},
                "billingDetails": {
                    "name": "API Doc Customer Three",
                    "address": ["addr"],
                    "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                    "stateCode": "MP",
                    "countryCode": "IN",
                },
                "shippingDetails": {
                    "name": "API Doc Customer Three",
                    "address": ["addr"],
                    "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                    "stateCode": "MP",
                    "countryCode": "IN",
                },
            },
            "entries": [
                {
                    "date": "23-10-2026",
                    "description": "CN adjust target",
                    "voucherType": "sales",
                    "transactions": [
                        {
                            "account": {"uniqueName": "sales", "name": "Sales"},
                            "amount": {"amountForAccount": 80, "amountForCompany": 80},
                        }
                    ],
                    "taxes": [],
                    "discounts": [],
                }
            ],
        },
    )
    sales_un = (sales.get("body") or {}).get("uniqueName") if isinstance(sales, dict) else None
    sales_num = (sales.get("body") or {}).get("number") if isinstance(sales, dict) else None

    # 211 credit note with adjustment
    if sales_un:
        call(
            "211-credit-note-adjust",
            "POST",
            f"/v4/company/{C}/accounts/apidoc-customer-three/vouchers/generate?branchUniqueName={B}&voucherVersion=2",
            {
                "type": "credit note",
                "date": "23-10-2026",
                "exchangeRate": 1,
                "applyApplicableTaxes": False,
                "roundOffApplicable": False,
                "updateAccountDetails": False,
                "company": {
                    "name": "Giddh Automation API DOC",
                    "uniqueName": C,
                    "billingDetails": {
                        "name": "Default Address",
                        "address": ["My new address"],
                        "gstNumber": "23AAACC1206D2ZN",
                        "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                        "stateCode": "MP",
                        "pincode": "484224",
                        "countryCode": "IN",
                    },
                    "shippingDetails": {
                        "name": "Default Address",
                        "address": ["My new address"],
                        "gstNumber": "23AAACC1206D2ZN",
                        "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                        "stateCode": "MP",
                        "pincode": "484224",
                        "countryCode": "IN",
                    },
                },
                "account": {
                    "uniqueName": "apidoc-customer-three",
                    "name": "API Doc Customer Three",
                    "customerName": "API Doc Customer Three",
                    "currency": {"code": "INR", "symbol": "₹"},
                    "billingDetails": {
                        "name": "API Doc Customer Three",
                        "address": ["addr"],
                        "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                        "stateCode": "MP",
                        "countryCode": "IN",
                    },
                    "shippingDetails": {
                        "name": "API Doc Customer Three",
                        "address": ["addr"],
                        "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                        "stateCode": "MP",
                        "countryCode": "IN",
                    },
                },
                "entries": [
                    {
                        "date": "23-10-2026",
                        "description": "CN with adjust",
                        "voucherType": "credit note",
                        "transactions": [
                            {
                                "account": {"uniqueName": "sales", "name": "Sales"},
                                "amount": {"amountForAccount": 80, "amountForCompany": 80},
                            }
                        ],
                        "taxes": [],
                        "discounts": [],
                    }
                ],
                "adjustments": [
                    {
                        "uniqueName": sales_un,
                        "voucherNumber": sales_num,
                        "voucherType": "sales",
                        "voucherDate": "23-10-2026",
                        "amount": {"amountForAccount": 80, "amountForCompany": 80},
                        "exchangeRate": 1,
                    }
                ],
            },
        )

    # 212 payment adjust remaining PB-STOCK-001 or unpaid purchase
    call(
        "212-invoice-list-payment",
        "POST",
        f"/company/{C}/vouchers/invoice-list?voucherDate=23-10-2026&adjustmentRequest=true"
        f"&count=50&page=1&number=&voucherVersion=2&branchUniqueName={B}",
        {"accountUniqueName": "apidoc-vendor-three", "voucherType": "payment"},
    )

    # 213 get ledger entry via giddh? try search MS path used in UI with token header skip
    # try ledgers merge advance search POST
    call(
        "213-ledger-advance-search",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers/merge?sort=asc&from=01-04-2026&to=31-03-2027&page=1&count=50&q=&voucherVersion=2&branchUniqueName={B}",
        {},
    )

    # 214 autopaid
    call(
        "214-autopaid",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/autopaid?voucherVersion=2&branchUniqueName={B}",
        {},
    )

    # 215 stock variants
    call("215-stock-variants", "GET", f"/company/{C}/stock/apidoc-widget/variants")

    # 216 batch all
    call(
        "216-batch-all",
        "GET",
        f"/company/{C}/batch/all?page=1&count=50&from=01-04-2026&to=31-03-2027&reportNature=",
    )

    # 217 inventory adj report
    call(
        "217-inv-adj-report",
        "POST",
        f"/company/{C}/inventory-adjustment/adjustment-report?page=1&from=01-04-2026&to=31-03-2027"
        f"&count=50&sortBy=&sort=asc&q=&searchBy=&inventoryType=PRODUCT&branchUniqueName={B}",
        {},
    )

    # 218 linked sources
    call("218-linked-sources", "GET", f"/company/{C}/linked-sources")

    # 219 company users
    call("219-company-users", "GET", f"/company/{C}/users")

    # 220 currency rate
    call("220-currency-rate", "GET", f"/currency/rate?from=USD&to=INR&date=23-10-2026")

    print("BATCH3_COMPLETE")


if __name__ == "__main__":
    main()
