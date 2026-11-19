#!/usr/bin/env python3
"""Batch 9 live captures (tags 907+). Do not commit secrets."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

PACK = Path(__file__).resolve().parent
SECRETS = json.loads((PACK / "secrets.local.json").read_text())
BASE = SECRETS["baseUrl"]
C = SECRETS["companyUniqueName"]
B = SECRETS["branchUniqueName"]
WH = SECRETS["warehouseUniqueName"]
SID = SECRETS["sessionId"]
SUB = SECRETS["subscriptionId"]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
ORIGIN = "https://test.giddh.com"
FROM = "01-04-2026"
TO = "31-03-2027"
FROM3 = "01-08-2026"
TO3 = "23-10-2026"
GSTIN = "23AAACC1206D2ZN"
DATE = "23-10-2026"

LOG: list[dict] = []


def curl(method: str, path: str, body: object | None = None) -> tuple[int, object]:
    url = f"{BASE}{path}"
    cmd = [
        "curl", "-sS", "-w", "\n%{http_code}",
        "-X", method, url,
        "-H", f"Session-Id: {SID}",
        "-H", f"User-Agent: {UA}",
        "-H", f"Origin: {ORIGIN}",
        "-H", "Accept: application/json",
        "-H", "Content-Type: application/json",
    ]
    if body is not None:
        cmd.extend(["--data-binary", json.dumps(body)])
    elif method not in ("GET", "DELETE", "HEAD"):
        cmd.extend(["--data-binary", "{}"])
    proc = subprocess.run(cmd, capture_output=True, text=True)
    out = proc.stdout
    if not out.strip():
        return 0, {"empty": True, "stderr": proc.stderr[-500:]}
    lines = out.rsplit("\n", 1)
    raw, code_s = lines[0], lines[1] if len(lines) > 1 else "000"
    try:
        http = int(code_s)
    except ValueError:
        http = 0
        raw = out
    try:
        data = json.loads(raw) if raw.strip() else {"empty": True}
    except json.JSONDecodeError:
        data = {"raw": raw[:2000], "parseError": True}
    return http, data


def save(tag: str, method: str, path: str, body: object | None, http: int, data: object) -> None:
    req = {"method": method, "path": path}
    if body is not None:
        req["body"] = body
    (PACK / "requests" / f"{tag}.json").write_text(json.dumps(req, indent=2) + "\n")
    (PACK / "responses" / f"{tag}.json").write_text(json.dumps(data, indent=2) + "\n")
    msg = ""
    st = "success" if 200 <= http < 300 else "error"
    if isinstance(data, dict):
        msg = str(data.get("message") or data.get("error") or data.get("status") or "")[:160]
        if data.get("status") == "error" and st == "success":
            st = "error"
        if data.get("status") == "success":
            st = "success"
    entry = {"tag": tag, "method": method, "path": path, "http": str(http), "status": st, "message": msg}
    LOG.append(entry)
    print(f"{tag} {http} {st} {msg[:80]}")


def call(tag: str, method: str, path: str, body: object | None = None) -> tuple[int, object]:
    http, data = curl(method, path, body)
    save(tag, method, path, body, http, data)
    return http, data


def first_un(data: object, *keys: str) -> str:
    if not isinstance(data, dict):
        return ""
    body = data.get("body")
    items = None
    if isinstance(body, dict):
        for k in ("items", "results", "list", "data"):
            if isinstance(body.get(k), list) and body[k]:
                items = body[k]
                break
        if items is None and body.get("uniqueName"):
            return str(body["uniqueName"])
    elif isinstance(body, list) and body:
        items = body
    if items and isinstance(items[0], dict):
        for k in keys or ("uniqueName",):
            if items[0].get(k):
                return str(items[0][k])
        return str(items[0].get("uniqueName") or "")
    return ""


def main() -> int:
    # 907 session
    http, data = call("907-session-company", "GET", f"/company/{C}")
    if http != 200 or (isinstance(data, dict) and data.get("status") == "error"):
        print("SESSION EXPIRED OR FAILED — stop")
        return 2

    # Pending reconciliation / BD
    for tag, doc, rtype in [
        ("908-pending-report-DC-WITHOUT", "DC", "WITHOUT_CHALLAN"),
        ("909-pending-report-DC-NOTINV", "DC", "NOT_INVOICED"),
        ("910-pending-report-RC-WITHOUT", "RC", "WITHOUT_CHALLAN"),
        ("911-pending-report-RC-NOTINV", "RC", "NOT_INVOICED"),
    ]:
        call(tag, "POST", f"/company/{C}/business-documents/pending-report?from={FROM}&to={TO}&page=1&count=20&branchUniqueName={B}",
             {"reportType": rtype, "documentType": doc})

    for tag, dt in [("912-bd-statuses-DC", "DC"), ("913-bd-statuses-RN", "RN"), ("914-bd-statuses-RC", "RC")]:
        call(tag, "GET", f"/company/{C}/business-documents/statuses?documentType={dt}")

    _, dc_list = call("915-dc-list", "POST",
                      f"/company/{C}/delivery-challan/all?from={FROM}&to={TO}&page=1&count=5&branchUniqueName={B}&voucherVersion=2", {})
    _, rn_list = call("916-rn-list", "POST",
                      f"/company/{C}/receipt-note/all?from={FROM}&to={TO}&page=1&count=5&branchUniqueName={B}&voucherVersion=2", {})
    dcun = first_un(dc_list)
    rnun = first_un(rn_list)
    if dcun:
        call("917-bd-get-dc", "GET", f"/company/{C}/business-documents/{dcun}")
        call("918-bd-versions-dc", "GET", f"/company/{C}/business-documents/{dcun}/versions")
        call("919-bd-history-dc", "GET", f"/company/{C}/business-documents/{dcun}/history")
    else:
        call("917-bd-get-dc-skip", "GET", f"/company/{C}/business-documents/missing")
    if rnun:
        call("922-bd-get-rn", "GET", f"/company/{C}/business-documents/{rnun}")

    call("920-reconcile-bank", "POST",
         f"/company/{C}/accounts/apidoc-bank-hdfc/ledgers-v2/reconcile?from={FROM3}&to={TO3}&chequeNumber=", {})
    call("921-reconcile-cash", "POST",
         f"/company/{C}/accounts/cash/ledgers-v2/reconcile?from={FROM3}&to={TO3}&chequeNumber=", {})

    # Users / permissions (safe reads + noop-ish permission get)
    call("923-company-users", "GET", f"/company/{C}/users")
    call("924-shared-with", "GET", f"/company/{C}/shared-with")
    call("925-shared-with-mobile", "GET", f"/company/{C}/shared-with?sortBy=mobile_verified")
    call("926-roles", "GET", f"/company/{C}/role")
    call("927-scope-v2", "GET", "/scope-v2")
    call("928-company-uer", "GET", f"/users/divyanshu%40whozzat.com/company-uer?companyUniqueName={C}")

    # Safe permission update: PUT same Super Admin role back
    uer = "tgig7awso7imt1h"
    perm_body = {
        "emailId": "divyanshu@whozzat.com",
        "entity": "COMPANY",
        "entityUniqueName": C,
        "roleUniqueName": "super_admin",
        "uniqueName": uer,
        "allowedIps": [],
        "allowedCidrs": [],
    }
    call("929-permission-put-same", "PUT", f"/company/{C}/uer/{uer}", perm_body)
    call("930-shared-with-after", "GET", f"/company/{C}/shared-with")

    # Invite probe (expect fail without real email invite flow — use obvious fake, save)
    call("931-invite-probe", "POST", f"/company/{C}/share", {
        "user": "apidoc-invite-probe@example.invalid",
        "role": "view_only",
        "entity": "company",
        "entityUniqueName": C,
    })
    call("932-send-new-user-info", "POST", "/users/send-new-user-info", {
        "email": "apidoc-invite-probe@example.invalid",
        "companyUniqueName": C,
    })

    # Yodlee / bank statement stubs
    call("933-yodlee-access-token", "GET", f"/company/{C}/yodlee/access-token")
    call("934-yodlee-accounts", "GET", f"/company/{C}/yodlee/yodlee-accounts")
    call("935-yodlee-search", "GET", f"/company/{C}/yodlee/search?name=hdfc")
    call("936-yodlee-eledgers", "GET",
         f"/company/{C}/yodlee/accounts/apidoc-bank-hdfc/eledgers?refresh=true&from={FROM3}&page=1&count=20")
    call("937-import-pdf-stmt-probe", "POST",
         f"/company/{C}/imports/import-pdf/bank-statement?entity=pdf&accountUniqueName=apidoc-bank-hdfc", {})
    call("938-imports-list", "GET", f"/company/{C}/imports?from={FROM3}&to={TO3}&page=1&count=20")
    call("939-import-status", "GET", f"/company/{C}/imports/status?page=1&count=20")
    call("940-plaid-link-token", "GET", f"/company/{C}/plaid/create/link-token?itemId=")
    call("941-gocardless-institutions", "GET",
         f"/company/{C}/gocardless/institutions?countryCode=IN&page=1&count=10&refresh=true")

    # Audit / activity deeper filters
    call("942-activity-logs", "POST", f"/v2/company/{C}/activity-logs", {
        "fromDate": FROM3, "toDate": TO3, "page": 1, "count": 20,
        "userUniqueNames": [], "entity": "", "operation": "",
    })
    call("943-activity-STOCK", "POST", f"/v2/company/{C}/activity-logs", {
        "fromDate": FROM3, "toDate": TO3, "page": 1, "count": 20,
        "userUniqueNames": [], "entity": "STOCK", "operation": "CREATE",
    })
    call("944-activity-VOUCHER", "POST", f"/v2/company/{C}/activity-logs", {
        "fromDate": FROM3, "toDate": TO3, "page": 1, "count": 20,
        "userUniqueNames": ["divyanshu@whozzat.com"], "entity": "VOUCHER", "operation": "",
    })
    call("945-auditlogs-form", "GET", "/ui/auditlogs-form")
    call("946-audit-logs-v1", "POST", f"/company/{C}/logs?page=1", {
        "fromDate": FROM3, "toDate": TO3, "operation": "", "userUniqueName": "", "accountUniqueName": "",
    })
    call("947-audit-logs-v2", "POST", f"/v2/company/{C}/logs?page=1", {
        "fromDate": FROM3, "toDate": TO3, "operation": "", "userUniqueName": "", "accountUniqueName": "",
    })

    # Webhooks / integrations
    call("948-webhooks-get", "GET", f"/company/{C}/settings/webhooks")
    call("949-webhooks-post", "POST", f"/company/{C}/settings/webhooks", {
        "url": "https://example.invalid/giddh-webhook",
        "entity": "sales",
        "triggerAt": 100,
    })
    call("950-razorpay-get", "GET", f"/company/{C}/razorpay")
    call("951-paypal-get", "GET", f"/company/{C}/paypal")
    call("952-cashfree-get", "GET", f"/company/{C}/cashfree")
    call("953-sms-key", "GET", f"/company/{C}/sms-key")
    call("954-email-key", "GET", f"/company/{C}/email-key")
    call("955-gmail-token", "GET", f"/company/{C}/gmail-token")
    call("956-payment-banks", "GET", f"/company/{C}/payment/banks/accounts")
    call("957-comm-platforms", "GET", f"/company/{C}/communication")

    # Multi-currency / exchange
    call("958-currency-list", "GET", "/currency")
    call("959-currency-rate-USD", "GET", f"/currency/rate?from=USD&to=INR&date={DATE}")
    call("960-currency-rate-EUR", "GET", f"/currency/rate?from=EUR&to=INR&date={DATE}")
    call("961-currency-rate-GBP", "GET", f"/currency/rate?from=GBP&to=INR&date={DATE}")
    call("962-currency-converter", "GET", f"/company/{C}/currency-converter/USD/INR")
    call("963-multicompany-tb", "GET",
         f"/v2/company/{C}/multicompany/trial-balance?from={FROM3}&to={TO3}&currencyCode=INR&refresh=true")
    call("964-multicompany-pl", "GET",
         f"/v2/company/{C}/multicompany/profit-loss?from={FROM3}&to={TO3}&currencyCode=INR&refresh=true")

    # Invoice templates
    call("965-templates-invoice", "GET", f"/v2/company/{C}/templates?type=invoice")
    call("966-templates-voucher", "GET", f"/v2/company/{C}/templates?type=voucher")
    call("967-sample-templates", "GET", f"/v2/company/{C}/sample-templates?type=invoice")
    call("968-templates-all", "GET", f"/company/{C}/templates/all")

    # pick template uniqueName
    _, tpls = curl("GET", f"/v2/company/{C}/templates?type=invoice")
    tpl_un = ""
    if isinstance(tpls, dict) and isinstance(tpls.get("body"), list) and tpls["body"]:
        tpl_un = tpls["body"][0].get("uniqueName") or ""
    elif isinstance(tpls, dict) and isinstance(tpls.get("body"), dict):
        arr = tpls["body"].get("templates") or tpls["body"].get("results") or []
        if arr:
            tpl_un = arr[0].get("uniqueName") or ""
    if not tpl_un:
        # from 965 file
        try:
            t965 = json.loads((PACK / "responses/965-templates-invoice.json").read_text())
            body = t965.get("body")
            if isinstance(body, list) and body:
                tpl_un = body[0].get("uniqueName") or ""
            elif isinstance(body, dict):
                for k in ("templates", "results", "items"):
                    if body.get(k):
                        tpl_un = body[k][0].get("uniqueName") or ""
                        break
        except Exception:
            pass

    if tpl_un:
        call("969-template-preview", "GET",
             f"/v2/company/{C}/templates/{tpl_un}?type=invoice&voucherVersion=2")
        call("970-template-details", "GET", f"/v2/company/{C}/templates/{tpl_un}")
        # Create a disposable copy via POST sample-ish — probe create with minimal body
        create_body = {
            "name": "API Doc Capture Template",
            "type": "invoice",
            "templateType": "gst_template_a",
            "uniqueName": "apidoc-capture-tpl",
        }
        http_c, data_c = call("971-template-create", "POST", f"/v2/company/{C}/templates", create_body)
        new_un = ""
        if isinstance(data_c, dict):
            b = data_c.get("body")
            if isinstance(b, dict):
                new_un = b.get("uniqueName") or ""
            elif isinstance(b, list) and b:
                new_un = b[0].get("uniqueName") or ""
        if new_un:
            call("972-template-get-created", "GET",
                 f"/v2/company/{C}/templates/{new_un}?type=invoice&voucherVersion=2")
            call("973-template-delete", "DELETE", f"/v2/company/{C}/templates/{new_un}")
        else:
            # try update existing preview path as POST template-preview
            call("972-template-preview-post", "POST",
                 f"/v2/company/{C}/template-preview?voucherVersion=2", {"uniqueName": tpl_un, "type": "invoice"})
    else:
        call("969-template-no-un", "GET", f"/v2/company/{C}/templates?type=invoice")

    # Salesperson
    call("974-salesperson-list", "GET", f"/company/{C}/salesperson?page=1&count=50&archive=false")
    http_sp, data_sp = call("975-salesperson-create", "POST", f"/company/{C}/salesperson", {
        "name": "API Doc Sales Person",
        "email": "apidoc.salesperson@example.invalid",
        "mobileNumber": "919999990907",
    })
    spun = first_un(data_sp) if isinstance(data_sp, dict) else ""
    if not spun and isinstance(data_sp, dict) and isinstance(data_sp.get("body"), dict):
        spun = data_sp["body"].get("uniqueName") or ""
    if spun:
        call("976-salesperson-get", "GET", f"/company/{C}/salesperson/{spun}")
        call("977-salesperson-update", "PUT", f"/company/{C}/salesperson/{spun}", {
            "name": "API Doc Sales Person Updated",
            "email": "apidoc.salesperson@example.invalid",
            "mobileNumber": "919999990907",
            "uniqueName": spun,
        })
        call("978-salesperson-archive", "POST", f"/company/{C}/salesperson/{spun}/archive", {
            "action": "UNASSIGNED",
            "archiveOnly": True,
        })
        call("979-salesperson-list-arch", "GET", f"/company/{C}/salesperson?page=1&count=50&archive=true")

    # Tags (cost-center-ish labels)
    call("980-tags-list", "GET", f"/company/{C}/tags")
    http_tg, data_tg = call("981-tag-create", "POST", f"/company/{C}/tags", {
        "name": "API Doc Project Tag",
        "description": "capture batch 9",
        "uniqueName": "apidoc-project-tag",
    })
    tgun = first_un(data_tg)
    if not tgun and isinstance(data_tg, dict) and isinstance(data_tg.get("body"), dict):
        tgun = data_tg["body"].get("uniqueName") or "apidoc-project-tag"
    if tgun or http_tg < 300:
        un = tgun or "apidoc-project-tag"
        call("982-tag-update", "PUT", f"/company/{C}/tags/{un}", {
            "name": "API Doc Project Tag",
            "description": "updated",
            "uniqueName": un,
        })

    # Tally
    call("983-tally-inprogress", "GET", f"/company/{C}/tally_logs/current_day")
    call("984-tally-completed", "GET", f"/company/{C}/tally_logs/completed")
    call("985-tally-errors", "GET", f"/company/{C}/tally_logs/error_report")
    call("986-company-export", "POST", f"/company/{C}/export", {})
    call("987-export-ledgers", "GET", f"/company/{C}/export-ledgers-v2?from={FROM3}&to={TO3}")
    call("988-company-import", "POST", f"/company/{C}/import", {})

    # Subscription / billing
    call("989-sub-by-id", "GET", f"/v2/subscription/{SUB}")
    call("990-sub-companies", "GET", f"/v2/subscription/{SUB}/company-list?page=1&count=20&q=")
    call("991-sub-payment-methods", "GET", f"/v2/subscription/{SUB}/payment-methods")
    call("992-sub-plans", "GET", "/v2/subscription/plans/all?regionCode=IND")
    call("993-sub-list", "GET", "/v2/subscription/list?page=1&count=20&fromMoveCompany=false")
    call("994-sub-transactions", "GET",
         f"/subscriptions/{SUB}/all-transactions?from={FROM3}&to={TO3}&interval=monthly")
    call("995-users-subscriptions", "GET", "/users/subscriptions")
    # billing account from sub response if present
    bill_un = ""
    try:
        s = json.loads((PACK / "responses/989-sub-by-id.json").read_text())
        b = s.get("body") or {}
        bill_un = (b.get("billingAccount") or {}).get("uniqueName") or b.get("billingAccountUniqueName") or ""
    except Exception:
        pass
    if bill_un:
        call("996-billing-get", "GET",
             f"/v2/subscription/billing-account/get?billingAccountUnqiueName={bill_un}")
    else:
        call("996-billing-get-probe", "GET",
             f"/v2/subscription/billing-account/get?billingAccountUnqiueName={SUB}")
    call("997-sub-charge", "GET", f"/v2/subscription/charge/{SUB}")
    call("998-sub-country-list", "GET", f"/v2/subscription/{SUB}/country-list")

    # Search / import path probes on apitest
    call("999-account-search-v3", "GET", f"/company/{C}/v3/account-search?q=apidoc")
    call("1000-account-search-2", "GET", f"/company/{C}/account-search-2?q=apidoc")
    call("1001-cmdk", "GET", f"/company/{C}/cmdk?page=1&q=apidoc&group=&refresh=false&isMobile=false")
    call("1002-imports-all-doc", "GET",
         f"/company/{C}/imports/all-document?branchUniqueName={B}&page=1&count=20&from={FROM3}&to={TO3}&sort=desc&sortBy=date&ocrType=")
    call("1003-ocr-completed-count", "GET",
         f"/company/{C}/completed-document-count?voucherVersion=2&branchUniqueName={B}&ocrType=")

    # Extra useful: reverse charge, aging, pettycash, triggers, FY, address list, eway, transporters
    call("1004-reverse-charge", "GET",
         f"/v2/company/{C}/reverse-charge-report?from={FROM3}&to={TO3}&sort=asc&sortBy=&page=1&count=20")
    call("1005-due-days-range", "GET", f"/company/{C}/due-days-range?vendorCustomerType=customer")
    call("1006-due-amount-report", "GET",
         f"/company/{C}/due-amount-report?q=&page=1&count=20&sort=asc&sortBy=&rangeCol=1&vendorCustomerType=customer")
    call("1007-pettycash-report", "POST", f"/company/{C}/pettycash-manager/report", {
        "from": FROM3, "to": TO3, "page": 1, "count": 20,
    })
    call("1008-triggers-get", "GET", f"/company/{C}/triggers")
    call("1009-comm-triggers", "GET", f"/company/{C}/communication/trigger")
    call("1010-fy-list", "GET", f"/company/{C}/financial-year")
    call("1011-fy-limits", "GET", f"/company/{C}/financial-year-limits")
    call("1012-address-all", "GET", f"/company/{C}/address/all")
    call("1013-branch-list", "GET", f"/company/{C}/branch?hierarchyType=")
    call("1014-warehouse-list", "GET", f"/company/{C}/warehouse")
    call("1015-transporters", "GET", f"/company/{C}/transporters?page=1")
    call("1016-ewb-validate", "POST", f"/company/{C}/ewb/validate-invoice", {})
    call("1017-entry-settings", "GET", f"/company/{C}/entry-settings")
    call("1018-ui-sidebar", "GET", f"/company/{C}/ui_side_bar_items")
    call("1019-party-types", "GET", "/ui/party-types")
    call("1020-report-filters", "GET", f"/report-filters?module=sales&companyUniqueName={C}&customColumns=true")

    # CF assign probe + email content suggestions
    call("1021-cf-list", "GET", f"/company/{C}/customfield/module/ACCOUNT?page=1&count=50")
    call("1022-email-suggestions", "GET", f"/company/{C}/communication/email-content-suggestion")
    call("1023-email-conditions", "GET",
         f"/company/{C}/communication/condition-suggestion?triggerModule=invoice")
    call("1024-v2-triggers-all", "GET", f"/v2/company/{C}/trigger/all?page=1&count=20")

    # Inventory settings read + BD cancel probe (safe cancel only if we use a copy — skip destructive)
    call("1025-inventory-settings", "GET", f"/company/{C}/inventory-settings")
    call("1026-stocks-manufactured", "GET",
         f"/company/{C}/stocks?isManufactured=true&page=1&count=20")
    call("1027-bank-accounts-int", "GET", f"/v2/company/{C}/bank")

    # Write log fragment
    log_path = PACK / "CALL-LOG-BATCH9.json"
    log_path.write_text(json.dumps(LOG, indent=2) + "\n")
    ok = sum(1 for e in LOG if e["status"] == "success")
    print(f"\nDONE calls={len(LOG)} success={ok} fail={len(LOG)-ok}")
    print(f"salesperson={spun!r} tag={tgun!r} template={tpl_un!r} billing={bill_un!r} dc={dcun!r}")
    # persist registry hints
    hints = {
        "salespersonUniqueName": spun,
        "tagUniqueName": tgun or "apidoc-project-tag",
        "templateUniqueName": tpl_un,
        "billingAccountUniqueName": bill_un,
        "dcUniqueName": dcun,
        "rnUniqueName": rnun,
        "calls": len(LOG),
        "success": ok,
    }
    (PACK / "_batch9_hints.json").write_text(json.dumps(hints, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
