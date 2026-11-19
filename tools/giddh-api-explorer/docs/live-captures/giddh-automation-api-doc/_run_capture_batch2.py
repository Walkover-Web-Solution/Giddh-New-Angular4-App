#!/usr/bin/env python3
"""Follow-up captures: fix methods/bodies + more coverage."""
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
REQ = PACK / "requests"
RES = PACK / "responses"
LOG = PACK / "CALL-LOG-2026-10-23.json"


def curl(method: str, path: str, body=None):
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
    proc = subprocess.run(cmd, capture_output=True, text=True)
    out = proc.stdout
    if "__HTTP__" not in out:
        return "000", {"raw": out, "stderr": proc.stderr}
    raw, http = out.rsplit("__HTTP__", 1)
    http = http.strip()
    try:
        parsed = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        parsed = {"raw": raw[:8000]}
    return http, parsed


def save(tag, method, path, body, http, resp):
    req_payload = body if body is not None else {"method": method, "path": path}
    (REQ / f"{tag}.json").write_text(json.dumps(req_payload, indent=2))
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2) if not isinstance(resp, str) else resp)
    log = json.loads(LOG.read_text()) if LOG.exists() else []
    status = msg = ""
    if isinstance(resp, dict):
        status = str(resp.get("status") or resp.get("error") or "")
        msg = str(resp.get("message") or "")[:180]
    log.append({"tag": tag, "method": method, "path": path.split("?")[0], "http": http, "status": status, "message": msg})
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:220])


def call(tag, method, path, body=None):
    http, resp = curl(method, path, body)
    save(tag, method, path, body, http, resp)
    return resp


def company_addr():
    return {
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
    }


def main():
    # 161 receipt full adjust remaining 300 on 261022-5
    call(
        "161-receipt-adjust-300",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers/generate?branchUniqueName={B}&voucherVersion=2",
        {
            "type": "receipt",
            "date": "23-10-2026",
            "exchangeRate": 1,
            "applyApplicableTaxes": False,
            "roundOffApplicable": False,
            "updateAccountDetails": False,
            "company": company_addr(),
            "account": {
                "uniqueName": "apidoc-customer-one",
                "name": "API Doc Customer One",
                "customerName": "API Doc Customer One",
                "currency": {"code": "INR", "symbol": "₹"},
                "billingDetails": {
                    "name": "API Doc Customer One",
                    "address": ["Address line 1"],
                    "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                    "stateCode": "MP",
                    "countryCode": "IN",
                    "gstNumber": "23AAACC1206D1ZM",
                },
                "shippingDetails": {
                    "name": "API Doc Customer One",
                    "address": ["Address line 1"],
                    "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                    "stateCode": "MP",
                    "countryCode": "IN",
                    "gstNumber": "23AAACC1206D1ZM",
                },
            },
            "entries": [
                {
                    "date": "23-10-2026",
                    "description": "Full remaining adjust 261022-5",
                    "voucherType": "receipt",
                    "transactions": [
                        {
                            "account": {"uniqueName": "apidoc-bank-hdfc", "name": "API Doc Bank HDFC"},
                            "amount": {"amountForAccount": 300, "amountForCompany": 300},
                        }
                    ],
                    "taxes": [],
                    "discounts": [],
                }
            ],
            "adjustments": [
                {
                    "uniqueName": "iiy341792675102708",
                    "voucherNumber": "261022-5",
                    "voucherType": "sales",
                    "voucherDate": "22-10-2026",
                    "amount": {"amountForAccount": 300, "amountForCompany": 300},
                    "exchangeRate": 1,
                }
            ],
        },
    )

    # 162 download via company download-file
    call(
        "162-download-company",
        "POST",
        f"/company/{C}/download-file?voucherVersion=2&fileType=base64&downloadOption=Original&branchUniqueName={B}",
        {
            "voucherUniqueNames": ["iiy341792675102708"],
            "typeOfInvoice": ["Original"],
            "voucherType": "sales",
        },
    )

    # 163 sales register POST v2
    call(
        "163-sales-register-post",
        "POST",
        f"/v2/company/{C}/v2/sales-register-overview?from=01-04-2026&to=31-03-2027&branchUniqueName={B}",
        {"interval": "monthly"},
    )

    # 164 purchase register POST v2
    call(
        "164-purchase-register-post",
        "POST",
        f"/v2/company/{C}/v2/purchases-register-overview?from=01-04-2026&to=31-03-2027&branchUniqueName={B}",
        {"interval": "monthly"},
    )

    # 165 sales register GET interval monthly (v1 path)
    call(
        "165-sales-register-get",
        "GET",
        f"/v2/company/{C}/sales-register-overview?from=01-04-2026&to=31-03-2027&interval=monthly&branchUniqueName={B}",
    )

    # 166 purchase register GET
    call(
        "166-purchase-register-get",
        "GET",
        f"/v2/company/{C}/purchases-register-overview?from=01-04-2026&to=31-03-2027&interval=monthly&branchUniqueName={B}",
    )

    # 167 inventory item-wise POST
    call(
        "167-inventory-item-wise-post",
        "POST",
        f"/company/{C}/inventory/balance-report/item-wise"
        f"?from=01-04-2026&to=31-03-2027&count=50&page=1&sort=asc&sortBy=&reportNature=&branchUniqueName={B}",
        {"stockGroupUniqueNames": [], "stockUniqueNames": [], "variantUniqueNames": [], "warehouseUniqueNames": []},
    )

    # 168 stock unit mappings POST
    call(
        "168-stock-unit-mappings-post",
        "POST",
        f"/company/{C}/stock-unit/mappings",
        "pcs",  # unit group uniqueName body as string? service posts unitGroupUniqueName
    )
    # also try object
    call(
        "168b-stock-unit-mappings",
        "POST",
        f"/company/{C}/stock-unit/mappings",
        {"uniqueName": "WfqOHXSFugRFzJ8HDrLT"},
    )

    # 169 recipe POST
    call(
        "169-recipe-post",
        "POST",
        f"/company/{C}/stock/apidoc-widget/recipe/get?withRate=true",
        ["apidocwidget1792693959876fk8uyv0enl"],
    )

    # 170 tax assign array body
    call(
        "170-tax-assign",
        "POST",
        f"/company/{C}/tax/assign",
        [{"uniqueName": "apidoc-widget", "taxes": ["apidocgst18"], "isAccount": False}],
    )

    # 171 get-all estimates POST
    call(
        "171-get-all-estimates",
        "POST",
        f"/company/{C}/vouchers/v3/estimates/all?from=01-04-2026&to=31-03-2027&page=1&count=50&branchUniqueName={B}",
        {"from": "01-04-2026", "to": "31-03-2027", "page": 1, "count": 50},
    )

    # 172 get-all proformas POST
    call(
        "172-get-all-proformas",
        "POST",
        f"/company/{C}/vouchers/v3/proformas/all?from=01-04-2026&to=31-03-2027&page=1&count=50&branchUniqueName={B}",
        {"from": "01-04-2026", "to": "31-03-2027", "page": 1, "count": 50},
    )

    # 173 get estimate by estimateNumber
    call(
        "173-get-estimate",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates?voucherVersion=2&branchUniqueName={B}",
        {"estimateNumber": "EST-20261023-1", "accountUniqueName": "apidoc-customer-three"},
    )

    # 174 get proforma
    call(
        "174-get-proforma",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/proformas?voucherVersion=2&branchUniqueName={B}",
        {"proformaNumber": "PR-20261023-1", "accountUniqueName": "apidoc-customer-three"},
    )

    # 175 generate via estimate
    call(
        "175-generate-via-estimate",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-estimate?voucherVersion=2&branchUniqueName={B}",
        {"estimateNumber": "EST-20261023-1", "accountUniqueName": "apidoc-customer-three"},
    )

    # 176 generate via proforma
    call(
        "176-generate-via-proforma",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-proforma?voucherVersion=2&branchUniqueName={B}",
        {"proformaNumber": "PR-20261023-1", "accountUniqueName": "apidoc-customer-three"},
    )

    # 177 templates invoice
    call("177-templates-invoice", "GET", f"/v2/company/{C}/templates?type=invoice")
    call("177b-templates-sales", "GET", f"/company/{C}/templates/all?type=sales")

    # 178 invoice-setting PUT noop read via settings already — try GET settings invoice section already have
    # settings webhooks
    call("178-settings-webhooks", "GET", f"/company/{C}/settings/webhooks")

    # 179 subscriptions companies
    sub = SECRETS.get("subscriptionId") or "SUB-20261022-5"
    call("179-subscription-companies", "GET", f"/v2/subscription/company-list/{sub}?sort=asc&sortBy=&page=1&count=20&q=")
    call("179b-users-subscriptions", "GET", "/users/subscriptions")

    # 180 voucher adjust endpoint separately (CN against sales) - use adjust API
    # create small credit note then adjust? Or adjust receipt against sales via adjust endpoint
    call(
        "180-voucher-adjust-endpoint",
        "POST",
        f"/company/{C}/vouchers/iiy341792675102708/adjust?voucherVersion=2&branchUniqueName={B}",
        [
            {
                "uniqueName": "llvtc1792674364760",
                "voucherNumber": "261022-2",
                "voucherType": "sales",
                "amount": {"amountForAccount": 10, "amountForCompany": 10},
            }
        ],
    )

    # 181 update sales voucher (PUT) - get then light update description
    getv = call(
        "181-get-sales-before-update",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-two/vouchers?branchUniqueName={B}&voucherVersion=2",
        {"uniqueName": "rrftm1792675101875", "type": "sales", "number": "261022-3"},
    )
    if isinstance(getv, dict) and getv.get("status") == "success" and getv.get("body"):
        body = getv["body"]
        body["entries"] = body.get("entries") or []
        # add description on first entry if present
        if body.get("entries"):
            body["entries"][0]["description"] = "Updated via API capture"
        call(
            "182-update-sales",
            "PUT",
            f"/v4/company/{C}/accounts/apidoc-customer-two/vouchers?branchUniqueName={B}&voucherVersion=2",
            body,
        )
    else:
        save("182-update-sales", "PUT", "skipped", {}, "000", {"status": "skipped"})

    # 183 stock report POST filter
    call(
        "183-stock-report-post",
        "POST",
        f"/company/{C}/stock-group/apidoc-products/stock/apidoc-widget/report-v2"
        f"?from=01-04-2026&to=31-03-2027&count=50&page=1&sort=asc&sortBy=&transaction_type=&branchUniqueName={B}",
        {},
    )

    # 184 inventory transaction report
    call(
        "184-inv-transaction-report",
        "POST",
        f"/company/{C}/inventory/transaction-report?from=01-04-2026&to=31-03-2027&count=50&page=1"
        f"&sort=asc&sortBy=&transaction_type=&reportNature=&branchUniqueName={B}",
        {},
    )

    # 185 inventory group-wise
    call(
        "185-inv-group-wise",
        "GET",
        f"/company/{C}/inventory/balance-report/group-wise"
        f"?stockGroupUniqueName=apidoc-products&from=01-04-2026&to=31-03-2027&count=50&page=1"
        f"&sort=asc&sortBy=&reportNature=&branchUniqueName={B}",
    )
    call(
        "185b-inv-group-wise-post",
        "POST",
        f"/company/{C}/inventory/balance-report/group-wise"
        f"?stockGroupUniqueName=apidoc-products&from=01-04-2026&to=31-03-2027&count=50&page=1"
        f"&sort=asc&sortBy=&reportNature=&branchUniqueName={B}",
        {},
    )

    # 186 ledgers-v2 get entry
    call(
        "186-get-ledger-entry",
        "GET",
        f"/company/{C}/accounts/cash/ledgers/tpfal1792733167512?baseRef=true&voucherVersion=2&branchUniqueName={B}",
    )

    # 187 view statement
    call(
        "187-view-statement",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/view-statement"
        f"?count=50&lang=en&from=01-04-2026&to=31-03-2027&sort=asc&page=1&q=&voucherVersion=2&branchUniqueName={B}",
    )

    # 188 flatten groups accounts
    call(
        "188-flatten-groups-accounts",
        "GET",
        f"/company/{C}/groups/flatten-groups-accounts?q=&page=1&count=50&showEmptyGroups=true",
    )

    # 189 tax hierarchy on group
    call("189-tax-hierarchy-group", "GET", f"/company/{C}/groups/sundrydebtors/tax-hierarchy")

    # 190 account tax hierarchy
    call(
        "190-tax-hierarchy-account",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/tax-hierarchy",
    )

    # 191 make-recurring attempt (may fail)
    call(
        "191-make-recurring",
        "POST",
        f"/v4/company/{C}/vouchers/rrftm1792675101875/make-recurring?voucherVersion=2&branchUniqueName={B}",
        {
            "interval": 1,
            "period": "MONTHLY",
            "startDate": "01-11-2026",
            "endDate": "01-03-2027",
        },
    )

    # 192 bulk update voucher action
    call(
        "192-bulk-update-voucher",
        "PUT",
        f"/company/{C}/vouchers/bulk-update?action=dueDate&voucherVersion=2&branchUniqueName={B}",
        {
            "voucherUniqueNames": ["rrftm1792675101875"],
            "dueDate": "15-11-2026",
        },
    )

    # 193 company address all
    call("193-address-all", "GET", f"/company/{C}/address/all")

    # 194 branch info
    call("194-branch-info", "GET", f"/company/{C}/branch/{B}")

    # 195 export settings
    call("195-export-settings", "GET", f"/company/{C}/export-settings")

    # 196 get stocks list
    call("196-stocks-list", "GET", f"/company/{C}/stocks")

    # 197 stocks v2
    call("197-stocks-v2", "GET", f"/company/{C}/stocks/v2")

    # 198 brief accounts
    call("198-brief-accounts", "GET", f"/company/{C}/brief-accounts?q=apidoc")

    # 199 purchase detailed register
    call(
        "199-purchase-register-detailed",
        "GET",
        f"/v2/company/{C}/purchases-register-detailed?from=01-04-2026&to=31-03-2027&page=1&count=50&branchUniqueName={B}",
    )

    # 200 ecommerce email (POST) fail ok
    call(
        "200-ecommerce-email",
        "POST",
        f"/company/{C}/ecommerce/email",
        {"email": "test@example.com", "ecommerceUniqueName": "shopify"},
    )

    print("BATCH2_COMPLETE")


if __name__ == "__main__":
    main()
