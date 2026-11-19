#!/usr/bin/env python3
"""One-shot live capture runner. Do not commit secrets. Delete after session if desired."""
from __future__ import annotations

import json
import subprocess
import sys
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
REQ.mkdir(exist_ok=True)
RES.mkdir(exist_ok=True)


def curl(method: str, path: str, body: dict | list | None = None) -> tuple[str, dict | str]:
    url = f"{BASE}{path}"
    cmd = [
        "curl",
        "-sS",
        "-X",
        method,
        url,
        "-H",
        f"Session-Id: {SID}",
        "-H",
        "Accept: application/json",
        "-H",
        "Content-Type: application/json",
        "-H",
        "Origin: https://test.giddh.com",
        "-H",
        f"User-Agent: {UA}",
        "-w",
        "\n__HTTP__%{http_code}",
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
        parsed = {"raw": raw[:5000]}
    return http, parsed


def save(tag: str, method: str, path: str, body: dict | list | None, http: str, resp) -> None:
    req_payload = body if body is not None else {"method": method, "path": path}
    (REQ / f"{tag}.json").write_text(json.dumps(req_payload, indent=2))
    (RES / f"{tag}.json").write_text(json.dumps(resp, indent=2) if not isinstance(resp, str) else resp)
    log = json.loads(LOG.read_text()) if LOG.exists() else []
    status = ""
    msg = ""
    if isinstance(resp, dict):
        status = str(resp.get("status") or resp.get("error") or "")
        msg = str(resp.get("message") or "")[:180]
    log.append(
        {
            "tag": tag,
            "method": method,
            "path": path.split("?")[0],
            "http": http,
            "status": status,
            "message": msg,
        }
    )
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:220])


def call(tag: str, method: str, path: str, body: dict | list | None = None) -> dict | str:
    http, resp = curl(method, path, body)
    save(tag, method, path, body, http, resp)
    return resp


def main() -> None:
    # 105 giddh-ledger full query
    call(
        "105-giddh-ledger",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/giddh-ledger"
        f"?count=50&from=01-04-2026&page=1&q=&reversePage=false&sort=asc"
        f"&to=31-03-2027&accountCurrency=true&branchUniqueName={B}&voucherVersion=2",
    )

    # 106 ledger transactions
    call(
        "106-ledger-transactions",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers/transactions"
        f"?count=50&from=01-04-2026&page=1&q=&reversePage=false&sort=asc"
        f"&to=31-03-2027&branchUniqueName={B}&voucherVersion=2",
    )

    # 107 daybook POST
    call(
        "107-daybook-post",
        "POST",
        f"/company/{C}/daybook?page=1&count=50&from=01-04-2026&to=31-03-2027&branchUniqueName={B}",
        {},
    )

    # 108 invoice-list
    call(
        "108-invoice-list",
        "POST",
        f"/company/{C}/vouchers/invoice-list?voucherDate=23-10-2026&adjustmentRequest=true"
        f"&count=50&page=1&number=&voucherVersion=2&branchUniqueName={B}",
        {"accountUniqueName": "apidoc-customer-one", "voucherType": "receipt"},
    )

    # 109 get sales 261022-5
    call(
        "109-get-sales-261022-5",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers?branchUniqueName={B}&voucherVersion=2",
        {"uniqueName": "iiy341792675102708", "type": "sales", "number": "261022-5"},
    )

    # 110 download
    call(
        "110-download-sales",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/vouchers/download-file"
        f"?fileType=base64&voucherVersion=2&branchUniqueName={B}",
        {
            "uniqueNames": ["iiy341792675102708"],
            "voucherType": "sales",
            "copyTypes": ["Original"],
        },
    )

    # 111 mail (expect fail or success)
    call(
        "111-mail-sales",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/vouchers/mail?voucherVersion=2&branchUniqueName={B}",
        {
            "uniqueName": "iiy341792675102708",
            "voucherNumber": ["261022-5"],
            "type": "sales",
            "email": {"to": ["divyanshu@whozzat.com"]},
            "sendTo": {"to": ["divyanshu@whozzat.com"]},
        },
    )

    # 112 voucher versions
    call(
        "112-voucher-versions",
        "GET",
        f"/company/{C}/voucher/iiy341792675102708/versions?page=1&count=20&voucherVersion=2&branchUniqueName={B}",
    )

    # 113 stock report correct path
    call(
        "113-stock-report",
        "GET",
        f"/company/{C}/stock-group/apidoc-products/stock/apidoc-widget/report-v2"
        f"?from=01-04-2026&to=31-03-2027&count=50&page=1&branchUniqueName={B}",
    )

    # 114 stock unit mappings
    call("114-stock-unit-mappings", "GET", f"/company/{C}/stock-unit/mappings")

    # 115 manufacturing stocks
    call("115-manufacturing-stocks", "GET", f"/company/{C}/stocks-manufacture")

    # 116 recipe widget
    call(
        "116-recipe-widget",
        "GET",
        f"/company/{C}/stock/apidoc-widget/recipe/get?withRate=true",
    )

    # 117 inventory item-wise balance
    call(
        "117-inventory-item-wise",
        "GET",
        f"/company/{C}/inventory/balance-report/item-wise"
        f"?from=01-04-2026&to=31-03-2027&count=50&page=1&sort=asc&sortBy=&reportNature=",
    )

    # 118 inventory-settings (refresh)
    call("118-inventory-settings", "GET", f"/company/{C}/inventory-settings")

    # 119 entry-settings
    call("119-entry-settings", "GET", f"/company/{C}/entry-settings")

    # 120 invoice-setting
    call("120-invoice-setting", "GET", f"/company/{C}/invoice-setting")

    # 121 sales register
    call(
        "121-sales-register",
        "GET",
        f"/v2/company/{C}/v2/sales-register-overview?from=01-04-2026&to=31-03-2027&branchUniqueName={B}",
    )

    # 122 purchase register
    call(
        "122-purchase-register",
        "GET",
        f"/v2/company/{C}/v2/purchases-register-overview?from=01-04-2026&to=31-03-2027&branchUniqueName={B}",
    )

    # 123 due-amount-report aged (POST body empty/common)
    call(
        "123-due-amount-report",
        "POST",
        f"/company/{C}/due-amount-report?q=&page=1&count=50&sort=asc&sortBy=&rangeCol=1"
        f"&vendorCustomerType=customer&branchUniqueName={B}",
        {"from": "01-04-2026", "to": "31-03-2027"},
    )

    # 124 due-days-range GET
    call(
        "124-due-days-range",
        "GET",
        f"/company/{C}/due-days-range?vendorCustomerType=customer&branchUniqueName={B}",
    )

    # 125 tax create
    tax_body = {
        "name": "API Doc GST 18",
        "taxNumber": "APIDOC-GST18",
        "taxType": "gst",
        "duration": "MONTHLY",
        "taxFileDate": 1,
        "taxDetail": [{"date": "01-04-2026", "taxValue": 18}],
        "accounts": [],
    }
    call("125-create-tax-gst18", "POST", f"/company/{C}/tax", tax_body)

    # 126 list taxes
    call("126-list-taxes", "GET", f"/company/{C}/tax")

    # 127 create custom group under currentassets
    call(
        "127-create-group",
        "POST",
        f"/company/{C}/groups",
        {
            "name": "API Doc Custom Assets",
            "uniqueName": "apidoc-custom-assets",
            "parentGroupUniqueName": "currentassets",
            "description": "Live capture custom group",
        },
    )

    # 128 get group details
    call("128-get-group", "GET", f"/v2/company/{C}/groups/apidoc-custom-assets")

    # 129 account get + light update description via v2
    call(
        "129-get-account",
        "GET",
        f"/v2/company/{C}/accounts/apidoc-customer-b2c?source=",
    )

    # 130 update account (keep same shape, bump description)
    acct = None
    try:
        acct_resp = json.loads((RES / "129-get-account.json").read_text())
        acct = acct_resp.get("body") if isinstance(acct_resp, dict) else None
    except Exception:
        acct = None
    if acct:
        # minimal update: name unchanged
        update_body = {
            "name": acct.get("name"),
            "uniqueName": acct.get("uniqueName"),
            "description": "Updated via API capture 23-10-2026",
            "addresses": acct.get("addresses") or [],
            "country": acct.get("country"),
            "currency": acct.get("currency"),
            "mobileNo": acct.get("mobileNo"),
            "email": acct.get("email"),
        }
        call(
            "130-update-account",
            "PUT",
            f"/v2/company/{C}/groups/sundrydebtors/accounts/apidoc-customer-b2c",
            update_body,
        )
    else:
        call(
            "130-update-account",
            "PUT",
            f"/v2/company/{C}/groups/sundrydebtors/accounts/apidoc-customer-b2c",
            {
                "name": "API Doc Walk-in Customer",
                "uniqueName": "apidoc-customer-b2c",
                "description": "Updated via API capture 23-10-2026",
            },
        )

    # 131 recurring get-all
    call(
        "131-recurring-get-all",
        "GET",
        f"/company/{C}/recurring-vouchers/get-all-recurring-voucher"
        f"?voucherType=sales&page=1&count=50&q=&sort=asc&sortBy=&from=01-04-2026&to=31-03-2027&voucherVersion=2",
    )

    # 132 subscription by id (read-only)
    sub = SECRETS.get("subscriptionId") or "SUB-20261022-5"
    call("132-subscription-by-id", "GET", f"/v2/subscription/{sub}")

    # 133 subscriptions list
    call("133-subscriptions-list", "GET", f"/v2/subscription/list?page=1&count=20&fromMoveCompany=false")

    # 134 portal domain list
    call("134-domain-list", "GET", f"/company/{C}/get-domain-list")

    # 135 company sources / linked entities
    call("135-company-sources", "GET", f"/company/{C}/sources")

    # 136 get estimate with number
    call(
        "136-get-estimate",
        "POST",
        f"/v3/company/{C}/accounts/apidoc-customer-three/estimates?voucherVersion=2&branchUniqueName={B}",
        {"number": "EST-20261023-1", "type": "sales", "uniqueName": "su71792731047950"},
    )

    # 137 convert estimate -> invoice attempt
    call(
        "137-generate-via-estimate",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-estimate"
        f"?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": "su71792731047950", "number": "EST-20261023-1", "type": "sales"},
    )

    # 138 get-all journal
    call(
        "138-get-all-journal",
        "POST",
        f"/company/{C}/vouchers/get-all?voucherVersion=2&branchUniqueName={B}",
        {"from": "01-04-2026", "to": "31-03-2027", "type": "journal", "count": 50, "page": 1},
    )

    # 139 templates sales
    call("139-templates-sales", "GET", f"/v2/company/{C}/templates?type=sales")

    # 140 warehouse get
    wh = SECRETS.get("warehouseUniqueName", "xbq1792673424418")
    call("140-get-warehouse", "GET", f"/company/{C}/warehouse/{wh}")

    # 141 flatten hierarchical stock groups
    call(
        "141-hierarchical-stock-groups",
        "GET",
        f"/company/{C}/hierarchical-stock-groups?type=PRODUCT",
    )

    # 142 inventory adjustment reasons
    call(
        "142-inv-adj-reasons",
        "GET",
        f"/company/{C}/inventory-adjustment/reason/get-all?count=2000",
    )

    # 143 unpaid invoices list v2 with account
    call(
        "143-unpaid-invoices",
        "GET",
        f"/v2/company/{C}/invoices/list?accountUniqueName=apidoc-customer-one&status=unpaid",
    )

    # 144 sales unpaid for cancel target - create small sales then cancel
    sales_body = {
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
            "uniqueName": "apidoc-customer-b2c",
            "name": "API Doc Walk-in Customer",
            "customerName": "API Doc Walk-in Customer",
            "currency": {"code": "INR", "symbol": "₹"},
            "billingDetails": {
                "name": "API Doc Walk-in Customer",
                "address": ["addr"],
                "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                "stateCode": "MP",
                "countryCode": "IN",
            },
            "shippingDetails": {
                "name": "API Doc Walk-in Customer",
                "address": ["addr"],
                "state": {"code": "MP", "name": "Madhya Pradesh", "stateGstCode": "23"},
                "stateCode": "MP",
                "countryCode": "IN",
            },
        },
        "entries": [
            {
                "date": "23-10-2026",
                "description": "Cancel-target sales",
                "voucherType": "sales",
                "transactions": [
                    {
                        "account": {"uniqueName": "sales", "name": "Sales"},
                        "amount": {"amountForAccount": 50, "amountForCompany": 50},
                    }
                ],
                "taxes": [],
                "discounts": [],
            }
        ],
    }
    cancel_sales = call(
        "144-sales-for-cancel",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-b2c/vouchers/generate?branchUniqueName={B}&voucherVersion=2",
        sales_body,
    )

    cancel_un = None
    cancel_num = None
    if isinstance(cancel_sales, dict) and cancel_sales.get("status") == "success":
        body = cancel_sales.get("body") or {}
        cancel_un = body.get("uniqueName")
        cancel_num = body.get("number")

    if cancel_un:
        call(
            "145-cancel-sales",
            "POST",
            f"/company/{C}/invoices/{cancel_un}/action?voucherVersion=2&branchUniqueName={B}",
            {"action": "cancel", "comments": "API capture cancel"},
        )
    else:
        save(
            "145-cancel-sales",
            "POST",
            f"/company/{C}/invoices/SKIPPED/action",
            {"skipped": True},
            "000",
            {"status": "skipped", "message": "no cancel target"},
        )

    # 146 full pay unpaid 261022-5 via receipt adjust
    # remaining balance should be ~500 (or less if partial); use invoice-list first if needed
    receipt_body = {
        "type": "receipt",
        "date": "23-10-2026",
        "exchangeRate": 1,
        "applyApplicableTaxes": False,
        "roundOffApplicable": False,
        "updateAccountDetails": False,
        "company": sales_body["company"],
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
                "description": "Full adjust 261022-5",
                "voucherType": "receipt",
                "transactions": [
                    {
                        "account": {"uniqueName": "apidoc-bank-hdfc", "name": "API Doc Bank HDFC"},
                        "amount": {"amountForAccount": 500, "amountForCompany": 500},
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
                "amount": {"amountForAccount": 500, "amountForCompany": 500},
                "exchangeRate": 1,
            }
        ],
    }
    call(
        "146-receipt-full-adjust",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers/generate?branchUniqueName={B}&voucherVersion=2",
        receipt_body,
    )

    # 147 ledgers-v2 create (simple cash -> sales journal-like entry on cash account)
    ledger_entry = {
        "transactions": [
            {
                "amount": 25,
                "particular": "sales",
                "type": "DEBIT",
            }
        ],
        "voucherType": "sales",
        "entryDate": "23-10-2026",
        "description": "API capture ledger-v2 entry",
    }
    call(
        "147-ledgers-v2-create",
        "POST",
        f"/company/{C}/accounts/cash/ledgers-v2?voucherVersion=2&branchUniqueName={B}",
        ledger_entry,
    )

    # 148 get-all estimates
    call(
        "148-get-all-estimates",
        "GET",
        f"/company/{C}/vouchers/v3/estimates/all?from=01-04-2026&to=31-03-2027&page=1&count=50&branchUniqueName={B}",
    )

    # 149 get-all proformas
    call(
        "149-get-all-proformas",
        "GET",
        f"/company/{C}/vouchers/v3/proformas/all?from=01-04-2026&to=31-03-2027&page=1&count=50&branchUniqueName={B}",
    )

    # 150 ecommerce verify fail path
    call(
        "150-ecommerce-verify",
        "GET",
        f"/company/{C}/ecommerce/verify/shopify-nonexistent",
    )

    # 151 tax assign (if tax created)
    tax_un = None
    try:
        t = json.loads((RES / "125-create-tax-gst18.json").read_text())
        if t.get("status") == "success":
            tax_un = (t.get("body") or {}).get("uniqueName")
    except Exception:
        pass
    if tax_un:
        call(
            "151-tax-assign",
            "POST",
            f"/company/{C}/tax/assign",
            {
                "uniqueName": "apidoc-widget",
                "taxes": [tax_un],
                "isAccount": False,
            },
        )
    else:
        # try list taxes for any uniqueName
        try:
            taxes = json.loads((RES / "126-list-taxes.json").read_text()).get("body") or []
            if taxes:
                tax_un = taxes[0].get("uniqueName")
        except Exception:
            pass
        call(
            "151-tax-assign",
            "POST",
            f"/company/{C}/tax/assign",
            {
                "uniqueName": "apidoc-widget",
                "taxes": [tax_un] if tax_un else [],
                "isAccount": False,
            },
        )

    # 152 ui taxes country IN
    call("152-ui-taxes", "GET", f"/ui/taxes?country=IN")

    # 153 voucher balances get-all
    call(
        "153-voucher-balances",
        "POST",
        f"/company/{C}/vouchers/get-all-vouchers-balances?voucherVersion=2&branchUniqueName={B}",
        {"from": "01-04-2026", "to": "31-03-2027", "type": "sales", "count": 50, "page": 1},
    )

    # 154 advance receipts all
    call(
        "154-advance-receipts",
        "GET",
        f"/v4/company/{C}/accounts/apidoc-customer-one/vouchers/advance-receipt/all"
        f"?invoiceDate=23-10-2026&voucherVersion=2&branchUniqueName={B}",
    )

    # 155 sales register detailed
    call(
        "155-sales-register-detailed",
        "GET",
        f"/v2/company/{C}/sales-register-detailed?from=01-04-2026&to=31-03-2027&page=1&count=50&branchUniqueName={B}",
    )

    # 156 branch flatten / warehouse list refresh
    call("156-warehouse-list", "GET", f"/company/{C}/warehouse?page=1&count=50")

    # 157 cogs
    call(
        "157-cogs",
        "GET",
        f"/v2/company/{C}/cogs?from=01-04-2026&to=31-03-2027&branchUniqueName={B}",
    )

    # 158 delete voucher attempt (use cancelled if any) - safer: delete estimate? skip destructive delete of paid
    # Instead: business-document get
    if cancel_un:
        call(
            "158-business-document-get",
            "GET",
            f"/company/{C}/business-documents/{cancel_un}?voucherVersion=2&branchUniqueName={B}",
        )
    else:
        call(
            "158-business-document-get",
            "GET",
            f"/company/{C}/business-documents/iiy341792675102708?voucherVersion=2&branchUniqueName={B}",
        )

    # 159 generate-via-proforma
    call(
        "159-generate-via-proforma",
        "POST",
        f"/company/{C}/vouchers/accounts/apidoc-customer-three/v3/generate-via-proforma"
        f"?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": "q2c1792731068597", "number": "PR-20261023-1", "type": "sales"},
    )

    # 160 stock aging report
    call(
        "160-stock-aging",
        "POST",
        f"/v2/company/{C}/stock-aging-report?page=1&count=50&branchUniqueName={B}",
        {},
    )

    print("BATCH_COMPLETE", file=sys.stderr)


if __name__ == "__main__":
    main()
