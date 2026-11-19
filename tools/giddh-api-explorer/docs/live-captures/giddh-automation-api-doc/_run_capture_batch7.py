#!/usr/bin/env python3
"""Batch 7 (tags 527+): taxes/authorities, make-recurring nested UI payload,
DC/RN list+pending, PO ops, manufacturing entry, discounts assign, users/roles,
subscription payment-methods, statements/columnar, templates preview, tally/ecommerce.
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
GSTIN = "23AAACC1206D2ZN"
SALES_UN = "vitmq1792733952798"  # 261023-5 unpaid
PO_UN = "pze1792734608469"
WIDGET_VAR = "apidocwidget1792693959876fk8uyv0enl"
GADGET_VAR = "apidoc-gadget1792694923893w7fw4lbjd2"
PCS = "WfqOHXSFugRFzJ8HDrLT"
FLAT_DISC = "73m1792675076662"


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
        err = (out.stderr or "")[:500]
        return "000", {"raw": text[:8000], "stderr": err}
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
    log.append({
        "tag": tag,
        "method": method,
        "path": path,
        "http": http,
        "status": status,
        "message": msg,
    })
    LOG.write_text(json.dumps(log, indent=2))
    print(f"{tag} HTTP {http} status={status} msg={msg}"[:260])
    return http, resp


def main():
    # --- session probe ---
    http, resp = call("527-session-probe", "GET", f"/company/{C}/tax")
    if http in ("401", "403") or (
        isinstance(resp, dict)
        and resp.get("code") in ("SESSION_EXPIRED", "UNAUTHORIZED", "ACCESS_DENIED")
    ):
        print("SESSION EXPIRED/UNAUTHORIZED — stop.")
        return
    if http == "000":
        print("Network failure on probe — stop.")
        return

    # --- taxes / ui / authorities ---
    call("528-ui-taxes-in", "GET", "/ui/taxes?country=IN")
    call("529-tax-list", "GET", f"/company/{C}/tax")
    call("530-tax-authority-list", "GET", f"/company/{C}/tax/authority")
    call(
        "531-tax-authority-create",
        "POST",
        f"/company/{C}/tax/authority",
        {"name": "API Doc Tax Authority MP", "stateCode": "MP", "description": "Live capture authority"},
    )
    call(
        "532-create-tax-gst5",
        "POST",
        f"/company/{C}/tax",
        {
            "name": "API Doc GST 5",
            "taxNumber": "APIDOC-GST5",
            "taxType": "gst",
            "duration": "MONTHLY",
            "taxFileDate": 1,
            "taxDetail": [{"date": "01-04-2026", "taxValue": 5}],
            "accounts": [],
        },
    )
    call(
        "533-tax-assign-sales",
        "POST",
        f"/company/{C}/tax/assign",
        [{"uniqueName": "sales", "taxes": ["apidocgst18"], "isAccount": True}],
    )
    call("534-tax-hierarchy-sales", "GET", f"/company/{C}/tax/hierarchy/sales")

    # --- make-recurring: nested UI cleanFormValues shape + preview POST ---
    nested_monthly = {
        "startDate": "01-11-2026",
        "repeatOption": "MONTHLY_DATE",
        "frequency": {"interval": 1, "unit": "MONTH"},
        "repeatOn": {"type": "DAY_OF_MONTH", "dayOfMonth": 1},
        "end": {"type": "NEVER"},
    }
    call(
        "535-recurring-preview-nested",
        "POST",
        f"/company/{C}/recurring-vouchers/preview?voucherVersion=2",
        nested_monthly,
    )
    call(
        "536-make-recurring-nested",
        "POST",
        f"/v4/company/{C}/vouchers/{SALES_UN}/make-recurring?voucherVersion=2&branchUniqueName={B}",
        nested_monthly,
    )
    nested_weekly = {
        "startDate": "02-11-2026",
        "repeatOption": "WEEKLY",
        "frequency": {"interval": 1, "unit": "WEEK"},
        "repeatOn": {"type": "WEEK_DAYS", "weekdays": ["MONDAY"]},
        "end": {"type": "ON_DATE", "endDate": "01-03-2027"},
    }
    call(
        "537-make-recurring-weekly-nested",
        "POST",
        f"/v4/company/{C}/vouchers/{SALES_UN}/make-recurring?voucherVersion=2&branchUniqueName={B}",
        nested_weekly,
    )
    nested_day = {
        "startDate": "24-10-2026",
        "repeatOption": "DAY",
        "frequency": {"interval": 1, "unit": "DAY"},
        "end": {"type": "NEVER"},
    }
    call(
        "538-make-recurring-day-nested",
        "POST",
        f"/v4/company/{C}/vouchers/{SALES_UN}/make-recurring?voucherVersion=2&branchUniqueName={B}",
        nested_day,
    )
    # alternate path without branch
    call(
        "539-make-recurring-no-branch",
        "POST",
        f"/v4/company/{C}/vouchers/{SALES_UN}/make-recurring?voucherVersion=2",
        nested_monthly,
    )
    call(
        "540-recurring-list",
        "GET",
        f"/company/{C}/recurring-vouchers/get-all-recurring-voucher?voucherType=&page=1&count=50&q=&sort=&sortBy=&from={FROM}&to={FY_TO}&voucherVersion=2",
    )

    # --- delivery challan / receipt note list + pending report ---
    dc_body = {}
    call(
        "541-dc-all",
        "POST",
        f"/company/{C}/delivery-challan/all?page=1&count=50&from={FROM}&to={TO}&q=&sort=&sortBy=",
        dc_body,
    )
    call(
        "542-rn-all",
        "POST",
        f"/company/{C}/receipt-note/all?page=1&count=50&from={FROM}&to={TO}&q=&sort=&sortBy=",
        dc_body,
    )
    call(
        "543-pending-report-dc",
        "POST",
        f"/company/{C}/business-documents/pending-report?from={FROM}&to={TO}&page=1&count=50&q=&sort=&sortBy=",
        {"reportType": "pending", "documentType": "delivery-challan"},
    )
    call(
        "544-pending-report-rn",
        "POST",
        f"/company/{C}/business-documents/pending-report?from={FROM}&to={TO}&page=1&count=50&q=&sort=&sortBy=",
        {"reportType": "pending", "documentType": "receipt-note"},
    )
    call(
        "545-bd-statuses-dc",
        "GET",
        f"/company/{C}/business-documents/statuses?documentType=delivery-challan",
    )
    call(
        "546-bd-convert-empty",
        "POST",
        f"/company/{C}/business-documents/convert",
        {"uniqueNames": []},
    )
    call(
        "547-bd-convert-bt",
        "POST",
        f"/company/{C}/business-documents/convert",
        {"uniqueNames": ["hsk1792734672951"]},
    )

    # --- PO: versions, status, pending, email settings, get-all refresh ---
    call(
        "548-po-get-all",
        "POST",
        f"/company/{C}/purchase-order/get-all?from={FROM}&to={TO}&page=1&count=50&sort=&sortBy=",
        {},
    )
    call("549-po-get", "GET", f"/company/{C}/purchase-order/{PO_UN}")
    call(
        "550-po-versions",
        "POST",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/versions/all?page=1&count=20",
        {"purchaseNumber": "PO-20261023-1"},
    )
    call(
        "551-po-pending-numbers",
        "GET",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/pending-numbers?page=1&count=50&sort=&sortBy=&pendingItems=true",
    )
    call(
        "552-po-status-change",
        "POST",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order/status/change",
        {"uniqueName": PO_UN, "status": "open"},
    )
    call(
        "553-po-bulk-update",
        "POST",
        f"/company/{C}/purchase-order/bulk-update?action=dueDate",
        {"uniqueNames": [PO_UN], "dueDate": "15-11-2026"},
    )
    call("554-po-bill-setting-get", "GET", f"/company/{C}/purchase-bill-setting")

    # --- manufacturing ---
    mf_body = {
        "date": DATE,
        "stockUniqueName": "apidoc-widget",
        "quantity": 1,
        "manufacturingQuantity": 1,
        "manufacturingMultipleOf": 1,
        "manufacturingUnitCode": "pcs",
        "manufacturingUnitUniqueName": PCS,
        "warehouseUniqueName": W,
        "variant": {"uniqueName": WIDGET_VAR, "name": "API Doc Widget"},
        "linkedStocks": [
            {
                "stockUniqueName": "apidoc-gadget",
                "stockName": "API Doc Gadget",
                "quantity": 1,
                "manufacturingQuantity": 1,
                "stockUnitUniqueName": PCS,
                "stockUnitCode": "pcs",
                "rate": 0,
                "variant": {"uniqueName": GADGET_VAR, "name": "API Doc Gadget"},
            }
        ],
        "otherExpenses": [],
        "byProducts": [],
        "increaseAssetValue": True,
    }
    call(
        "555-mf-v2-create",
        "POST",
        f"/v2/company/{C}/stock/apidoc-widget/manufacture?branchUniqueName={B}",
        mf_body,
    )
    call(
        "556-mf-v1-create",
        "POST",
        f"/company/{C}/stock/apidoc-widget/manufacture?branchUniqueName={B}",
        mf_body,
    )
    call(
        "557-mf-report",
        "GET",
        f"/company/{C}/stock/manufacture-report?from={FROM}&to={TO}&page=1&count=50&branchUniqueName={B}",
    )
    call(
        "558-mf-stocks",
        "GET",
        f"/company/{C}/stocks-manufacture?branchUniqueName={B}",
    )
    call(
        "559-recipe-get-refresh",
        "POST",
        f"/company/{C}/stock/apidoc-widget/recipe/get?withRate=true",
        [WIDGET_VAR],
    )
    call(
        "560-link-with-rates",
        "GET",
        f"/company/{C}/stock/apidoc-widget/link-with-rates",
    )

    # --- discount assign to stock ---
    call(
        "561-cvd-users-customers",
        "GET",
        f"/company/{C}/customer-vendor-discount/get-all-users?groupUniqueName=sundrydebtors&page=1&count=20&query=&userType=customer",
    )
    call(
        "562-cvd-all-discounts",
        "GET",
        f"/company/{C}/customer-vendor-discount/get-all-discounts?uniqueName=apidoc-customer-one&query=&page=1&count=20",
    )
    call(
        "563-assign-discount-stock",
        "POST",
        f"/company/{C}/customer-vendor-discount/stock/apidoc-widget/assign-discount",
        {
            "customerVendorAccountUniqueName": "apidoc-customer-one",
            "customerVendorGroupUniqueName": "",
            "discountInfo": [
                {
                    "type": "PERCENTAGE",
                    "discountValue": 5,
                    "price": 100,
                    "quantity": 1,
                    "discountExclusive": False,
                    "stockUnitUniqueName": PCS,
                    "variantUniqueName": WIDGET_VAR,
                }
            ],
        },
    )

    # --- company users / permissions / roles ---
    call("564-company-users", "GET", f"/company/{C}/users")
    call("565-shared-with", "GET", f"/company/{C}/shared-with")
    call("566-role-list", "GET", f"/company/{C}/role")
    call("567-scope-v2", "GET", "/scope-v2")
    call(
        "568-company-uer",
        "GET",
        f"/users/divyanshu%40whozzat.com/company-uer?companyUniqueName={C}",
    )
    call("569-sidebar-items", "GET", f"/company/{C}/ui_side_bar_items")

    # --- subscription ---
    call("570-sub-by-id", "GET", f"/v2/subscription/{SUB}")
    call("571-sub-payment-methods", "GET", f"/v2/subscription/{SUB}/payment-methods")
    call("572-sub-plans-all", "GET", "/v2/subscription/plans/all?regionCode=IN")
    call(
        "573-sub-company-list",
        "GET",
        f"/v2/subscription/{SUB}/company-list?page=1&count=20&q=",
    )
    call("574-sub-list", "GET", "/v2/subscription/list?page=1&count=20&fromMoveCompany=false")
    call("575-users-subscriptions", "GET", "/users/subscriptions")

    # --- statements / columnar / export ledger ---
    call(
        "576-view-statement",
        "GET",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/view-statement?count=50&lang=en&from={FROM}&to={TO}&sort=asc&page=1&q=",
    )
    call(
        "577-export-stmt-xlsx",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/export-account-statement?from={FROM}&to={TO}&q=",
        {"exportType": "xlsx"},
    )
    call(
        "578-export-stmt-pdf",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/ledgers-v2/export-account-statement?from={FROM}&to={TO}&q=",
        {"exportType": "pdf"},
    )
    call(
        "579-columnar-v2-json",
        "POST",
        f"/v2/company/{C}/groups/sundrydebtors/export/account-balances-v2?fileType=json&page=1&count=50",
        {"from": FROM, "to": TO, "branchUniqueName": B},
    )
    call(
        "580-columnar-acct-post",
        "POST",
        f"/company/{C}/accounts/cash/columnar-report?from={FROM}&to={TO}&page=1&count=50&branchUniqueName={B}",
        {},
    )
    call(
        "581-export-ledger-admin",
        "GET",
        f"/company/{C}/accounts/cash/v3/export-ledger/file?from={FROM}&to={TO}&type=admin-consolidated&format=xlsx&sort=asc",
    )
    call(
        "582-export-ledger-account",
        "GET",
        f"/company/{C}/accounts/cash/v3/export-ledger/file?from={FROM}&to={TO}&type=account-wise&format=pdf&sort=asc",
    )

    # --- voucher preview / templates ---
    call(
        "583-templates-invoice",
        "GET",
        f"/v2/company/{C}/templates?type=invoice",
    )
    call(
        "584-sample-templates",
        "GET",
        f"/v2/company/{C}/sample-templates?type=sales",
    )
    call(
        "585-voucher-preview-post",
        "POST",
        f"/company/{C}/accounts/apidoc-customer-one/vouchers/preview?voucherVersion=2",
        {"uniqueName": SALES_UN, "voucherType": "sales"},
    )
    call(
        "586-v4-voucher-get",
        "POST",
        f"/v4/company/{C}/accounts/apidoc-customer-three/vouchers?voucherVersion=2&branchUniqueName={B}",
        {"uniqueName": SALES_UN},
    )
    call(
        "587-download-file-base64",
        "POST",
        f"/company/{C}/download-file?voucherVersion=2&fileType=base64&downloadOption=ALL",
        {"uniqueName": SALES_UN, "voucherType": "sales"},
    )

    # --- tally / ecommerce / integrations (expect fail-ok) ---
    call("588-tally-inprogress", "GET", f"/company/{C}/tally_logs/current_day")
    call("589-tally-completed", "GET", f"/company/{C}/tally_logs/completed")
    call("590-tally-errors", "GET", f"/company/{C}/tally_logs/error_report")
    call(
        "591-ecommerce-verify",
        "GET",
        f"/company/{C}/ecommerce/verify/shopify",
    )
    call("592-amazon-seller", "GET", f"/company/{C}/amazon/seller")
    call("593-razorpay-get", "GET", f"/company/{C}/razorpay")
    call("594-paypal-get", "GET", f"/company/{C}/paypal")
    call("595-gmail-token", "GET", f"/company/{C}/gmail-token")
    call("596-sms-key", "GET", f"/company/{C}/sms-key")
    call("597-email-key", "GET", f"/company/{C}/email-key")
    call("598-payu", "GET", f"/company/{C}/payu")

    # --- imports (apitest proxy) ---
    call(
        "599-imports-list",
        "GET",
        f"/company/{C}/imports?from={FROM}&to={TO}&page=1&count=50",
    )
    call("600-entry-settings", "GET", f"/company/{C}/entry-settings")
    call("601-financial-year", "GET", f"/company/{C}/financial-year")
    call("602-tags", "GET", f"/company/{C}/tags")
    call("603-customfield-account", "GET", f"/company/{C}/customfield/module/account?page=1&count=20")
    call("604-transporters", "GET", f"/company/{C}/transporters?page=1")
    call(
        "605-triggers-all",
        "GET",
        f"/company/{C}/trigger/all?page=1&count=20",
    )
    call("606-auth-keys", "GET", f"/company/{C}/auth/all")
    call("607-payment-banks", "GET", f"/company/{C}/payment/banks/accounts")
    call("608-business-nature", "GET", "/business-nature")
    call("609-account-countries", "GET", f"/country/company/{C}/account-countries")
    call("610-country-in", "GET", "/country/IN")

    # --- more reports / misc ---
    call(
        "611-aged-report",
        "POST",
        f"/company/{C}/aged-report?count=50&page=1&q=&sort=&sortBy=&from={FROM}&to={TO}&range=0-30&vendorCustomerType=customer",
        {},
    )
    call(
        "612-cash-flow",
        "GET",
        f"/company/{C}/cashflow-statement?from={FROM}&to={TO}&refresh=false",
    )
    call(
        "613-new-vs-old",
        "GET",
        f"/company/{C}/new-vs-old-invoices?type=monthly&from={FROM}&to={TO}",
    )
    call(
        "614-activity-logs",
        "POST",
        f"/company/{C}/activity-logs?page=1&count=20",
        {"fromDate": FROM, "toDate": TO, "entity": "VOUCHER"},
    )
    call(
        "615-logs",
        "GET",
        f"/company/{C}/logs?fromDate={FROM}&toDate={TO}&page=1&count=20&entity=",
    )
    call(
        "616-settings-profile",
        "GET",
        f"/company/{C}",
    )
    call("617-branches", "GET", f"/company/{C}/branch?hierarchyType=FLAT")
    call("618-warehouses", "GET", f"/company/{C}/warehouse")
    call("619-addresses", "GET", f"/company/{C}/address")
    call(
        "620-discounts-settings",
        "GET",
        f"/company/{C}/discount",
    )

    # tax update (if 532 created) — soft update of gst18 name description via PUT
    call(
        "621-tax-get-gst18",
        "GET",
        f"/company/{C}/tax/apidocgst18",
    )
    call(
        "622-tax-update-gst5-probe",
        "PUT",
        f"/company/{C}/tax/apidocgst5",
        {
            "name": "API Doc GST 5",
            "taxNumber": "APIDOC-GST5",
            "taxType": "gst",
            "duration": "MONTHLY",
            "taxFileDate": 1,
            "taxDetail": [{"date": "01-04-2026", "taxValue": 5}],
            "accounts": [],
        },
    )

    # PO update (PUT) with same shape as generate — light touch description
    call(
        "623-po-update-probe",
        "PUT",
        f"/company/{C}/accounts/apidoc-vendor-one/purchase-order",
        {
            "uniqueName": PO_UN,
            "number": "PO-20261023-1",
            "date": DATE,
            "dueDate": "15-11-2026",
            "type": "purchase",
            "account": {"uniqueName": "apidoc-vendor-one"},
            "entries": [],
        },
    )

    # voucher versions
    call(
        "624-voucher-versions",
        "GET",
        f"/company/{C}/voucher/{SALES_UN}/versions?page=1&count=20",
    )

    # advance receipts list
    call(
        "625-advance-receipts",
        "GET",
        f"/company/{C}/advance-receipt/get-all?page=1&count=50&from={FROM}&to={TO}&sort=&sortBy=",
    )

    # daybook refresh
    call(
        "626-daybook",
        "POST",
        f"/company/{C}/daybook?page=1&count=50&from={FROM}&to={TO}&branchUniqueName={B}",
        {},
    )

    print("\nBatch 7 complete.")


if __name__ == "__main__":
    main()
