#!/usr/bin/env python3
"""FE-used pending backlog runner (tags 1100+). curl + browser UA. Do not commit secrets."""
from __future__ import annotations

import json
import re
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote

PACK = Path(__file__).resolve().parent
SECRETS = json.loads((PACK / "secrets.local.json").read_text())
REG = json.loads((PACK / "ENTITY-REGISTRY.json").read_text())
BASE = SECRETS["baseUrl"]
C = SECRETS["companyUniqueName"]
B = SECRETS["branchUniqueName"]
WH = SECRETS["warehouseUniqueName"]
ADDR = SECRETS.get("addressUniqueName") or REG.get("addressUniqueName")
SID = SECRETS.get("sessionId") or ""
AUTH_KEY = (SECRETS.get("authKey") or "").strip()
SUB = SECRETS["subscriptionId"]
USER = SECRETS.get("userUniqueName") or "divyanshu@whozzat.com"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
ORIGIN = SECRETS.get("origin") or "https://test.giddh.com"
FROM = "01-04-2026"
TO = "31-03-2027"
FROM3 = "01-08-2026"
TO3 = "23-10-2026"
DATE = "23-10-2026"
GSTIN = REG.get("companyGstin") or "23AAACC1206D2ZN"
CUST = "apidoc-customer-one"
VEND = "apidoc-vendor-one"
BANK = "apidoc-bank-hdfc"
STOCK = "apidoc-widget"
STOCK_G = "apidoc-products"
VARIANT = "apidocwidget1792693959876fk8uyv0enl"
STOCK_UNIT = "WfqOHXSFugRFzJ8HDrLT"
TAX = "apidocgst18"
DISC = "73m1792675076662"
GROUP = "apidoc-custom-assets"
LEDGER = "tpfal1792733167512"
SALES_V = "5zkmf1792674363694"
PO = "pze1792734608469"
PO_NUM = "PO-20261023-1"
BD = "zyu1792738825009"
ROLE = "aft1792738829523"
SP = "apidocsalesperson"
CF = "1792758792191n1ficygh8s7bfds"
TA = "apidoctaxauthoritymp"
MF = "u076wqodj05ihjcozc2f"
BT = "hsk1792734672951"
REASON = "0zn1792733816931"
BILLING = (REG.get("billingAccount") or {}).get("uniqueName") or "k2b1712141952375"
RECUR = "LUJYfC8PaG"
BRANCH2 = "apidocbranchtwo"
WH2 = "4gr1792733898078"

START_TAG = 1100
WORKERS = 10
# Resume: set PENDING_FILE + START_TAG via env or edit below
PENDING_FILE = PACK / "_fe_pending_remaining.json"
if not PENDING_FILE.exists():
    PENDING_FILE = PACK / "_fe_pending.json"
PENDING = json.loads(PENDING_FILE.read_text())
# Next free tag after aborted run (1225 last attempted)
if PENDING_FILE.name.endswith("remaining.json"):
    START_TAG = 1226

# Never call these — they invalidate Session-Id / Auth-Key mid-batch
SESSION_KILLERS = (
    "destroy-session",
    "generate-auth-key",
    "/sessions",
    "increment-session",
    "forgot-password",
    "logout",
    "revoke-token",
    "revoke-auth",
    "wipe-session",
)

# Destructive DELETEs we soft-skip (still record a probe on disposable / noop path where possible)
SKIP_DESTRUCTIVE = {
    ("DELETE", "company/{}/accounts/{}"),  # would wipe customer
    ("DELETE", "company/{}/stock/{}"),
    ("DELETE", "company/{}/stock-group/{}"),
    ("DELETE", "company/{}/groups/{}"),
    ("DELETE", "company/{}/tax/{}"),
    ("DELETE", "company/{}/branch/{}"),
    ("DELETE", "company/{}/warehouse/{}"),
    ("DELETE", "company/{}/address/{}"),
}


def clean_path_template(path: str) -> str:
    """Strip regex suffixes from Spring path vars: {name:.+} -> {name}"""
    return re.sub(r"\{([A-Za-z0-9_]+):[^}]+\}", r"{\1}", path or "")


def param_value(name: str, path_hint: str = "") -> str:
    n = name.lower().replace("_", "")
    ph = path_hint.lower()
    mapping = {
        "companyuniquename": C,
        "companyuniqueName": C,
        "branchuniquename": B,
        "warehouseuniquename": WH,
        "addressuniquename": ADDR,
        "accountuniquename": CUST if "vendor" not in ph and "purchase" not in ph and "bank" not in ph else (
            BANK if "bank" in ph else VEND
        ),
        "stockuniquename": STOCK,
        "stockgroupuniquename": STOCK_G,
        "stockunituniquename": STOCK_UNIT,
        "variantuniquename": VARIANT,
        "uniqueName": STOCK,  # fallback
        "uniquename": STOCK,
        "taxuniquename": TAX,
        "discountuniquename": DISC,
        "groupuniquename": GROUP,
        "groupuniqueName": GROUP,
        "entryuniquename": LEDGER,
        "ledgeruniquename": LEDGER,
        "voucheruniquename": SALES_V,
        "invoiceuniquename": SALES_V,
        "purchasenumber": PO_NUM,
        "purchaseorderuniquename": PO,
        "pouniquename": PO,
        "businessdocumentuniquename": BD,
        "documentuniquename": BD,
        "roleuniquename": ROLE,
        "salespersonuniquename": SP,
        "customfielduniquename": CF,
        "fielduniquename": CF,
        "taxauthorityuniquename": TA,
        "manufactureuniquename": MF,
        "manufacturinguniquename": MF,
        "branchtransferuniquename": BT,
        "reasonuniquename": REASON,
        "subscriptionid": SUB,
        "subscriptionuniquename": SUB,
        "billingaccountuniquename": BILLING,
        "billingaccountunqiuname": BILLING,  # typo variants
        "recurringvoucheruniquename": RECUR,
        "useruniquename": USER,
        "useremail": USER,
        "email": USER,
        "gstin": GSTIN,
        "fromcurrency": "USD",
        "tocurrency": "INR",
        "currency": "INR",
        "currencycode": "INR",
        "countrycode": "GB",
        "regioncode": "IND",
        "ordernumber": "ORDER-PLACEHOLDER",
        "orderid": "ORDER-PLACEHOLDER",
        "paypalorderid": "ORDER-PLACEHOLDER",
        "token": "token-placeholder",
        "otp": "000000",
        "id": SUB,
        "type": "sales",
        "vouchertype": "sales",
        "documenttype": "DC",
        "templatetype": "invoice",
        "templatename": "gst_template_a",
        "templateuniquename": "gst_template_a",
        "name": "apidoc-placeholder",
        "number": "261022-1",
        "estimatenumber": "EST-20261023-1",
        "proformanumber": "PR-20261023-1",
        "challanno": "DC-20261023-1",
        "entity": "deliverynote",
        "action": "cancel",
        "status": "OPEN",
        "lang": "en",
        "page": "1",
        "count": "50",
        "q": "api",
        "query": "api",
        "search": "api",
        "date": DATE,
        "from": FROM,
        "to": TO,
        "interval": "monthly",
        "financialyear": "APR-2026-MAR-2027",
        "reporttype": "WITHOUT_CHALLAN",
        "ocrtype": "invoice",
        "filetype": "base64",
        "cnlrsn": "1",
        "cnlrem": "api-doc-test",
    }
    # exact then fuzzy
    for k, v in mapping.items():
        if k.lower() == n:
            return str(v)
    # name-based heuristics
    if "account" in n:
        if "bank" in ph:
            return BANK
        if any(x in ph for x in ("purchase", "vendor", "payment", "debit")):
            return VEND
        return CUST
    if "stockgroup" in n:
        return STOCK_G
    if "stockunit" in n:
        return STOCK_UNIT
    if "stock" in n or "variant" in n:
        return STOCK if "variant" not in n else VARIANT
    if "voucher" in n or "invoice" in n:
        return SALES_V
    if "group" in n:
        return GROUP
    if "tax" in n and "authority" in n:
        return TA
    if "tax" in n:
        return TAX
    if "discount" in n:
        return DISC
    if "warehouse" in n:
        return WH
    if "branch" in n and "transfer" not in n:
        return B
    if "address" in n:
        return ADDR
    if "company" in n:
        return C
    if "subscription" in n:
        return SUB
    if "billing" in n:
        return BILLING
    if "role" in n:
        return ROLE
    if "sales" in n and "person" in n:
        return SP
    if "user" in n:
        return USER
    if "entry" in n or "ledger" in n:
        return LEDGER
    if "purchase" in n:
        return PO if "number" not in n else PO_NUM
    if "document" in n or "challan" in n:
        return BD
    if "manufacture" in n:
        return MF
    if "reason" in n:
        return REASON
    if "custom" in n or "field" in n:
        return CF
    if "template" in n:
        return "gst_template_a"
    if "order" in n:
        return "ORDER-PLACEHOLDER"
    if "currency" in n:
        return "INR"
    if "gstin" in n:
        return GSTIN
    return "placeholder"


def fill_path(path: str) -> str:
    path = clean_path_template(path)
    def repl(m):
        return quote(str(param_value(m.group(1), path)), safe="")
    return re.sub(r"\{([^}]+)\}", repl, path)


def needs_voucher_version(path: str) -> bool:
    p = path.lower()
    # known exceptions
    if re.search(r"/(delivery-challan|receipt-note)/all(\?|$)", p):
        return False
    if "/ledgers/merge" in p or "/merge?" in p and "ledger" in p:
        return False
    if "ledgers/merge" in p:
        return False
    # accounting-ish
    keywords = (
        "voucher", "ledger", "invoice", "estimate", "proforma", "purchase-order",
        "purchase-record", "adjust", "daybook", "business-document", "delivery-challan",
        "receipt-note", "branch-transfer", "inv-adjust", "manufacture", "columnar",
        "make-recurring", "recurring", "download-file", "cancel-einvoice",
    )
    return any(k in p for k in keywords)


def default_query(path: str, method: str, params: dict | None) -> str:
    qs = []
    p = path.lower()
    # always useful
    if "company/" in p and "branchuniquename" not in p:
        # many list endpoints want branch
        if method in ("GET", "POST") and any(
            x in p for x in ("voucher", "ledger", "stock", "report", "register", "daybook", "all", "list")
        ):
            qs.append(f"branchUniqueName={B}")
    if any(x in p for x in ("report", "register", "daybook", "all", "summary", "gstr", "aged", "trial", "profit", "balance", "transactions", "reconcile", "statement", "pending", "activity", "logs", "graph", "columnar", "export")):
        if "from=" not in path and "{from}" not in path:
            qs.append(f"from={FROM3 if 'gstr' in p else FROM}")
            qs.append(f"to={TO3 if 'gstr' in p else TO}")
        if "page" not in path:
            qs.append("page=1")
            qs.append("count=50")
    if "gstin" in p or "gstr" in p:
        qs.append(f"gstin={GSTIN}")
    if "voucherType" not in path and "recurring" in p:
        qs.append("voucherType=sales")
    if "type=" not in path and ("template" in p or "graph" in p):
        if "template" in p:
            qs.append("type=invoice")
    if needs_voucher_version(path) and "voucherversion" not in path.lower():
        qs.append("voucherVersion=2")
    # catalog query params with defaults
    if params and isinstance(params.get("query"), list):
        for q in params["query"]:
            name = q.get("name") or ""
            if not name or name.lower() in ("lang",):
                continue
            already = name.lower() in ("&".join(qs)).lower() or name.lower() in path.lower()
            if already:
                continue
            nl = name.lower()
            if nl == "branchuniquename":
                qs.append(f"{name}={B}")
            elif nl in ("from",):
                qs.append(f"{name}={FROM}")
            elif nl in ("to",):
                qs.append(f"{name}={TO}")
            elif nl == "page":
                qs.append(f"{name}=1")
            elif nl == "count":
                qs.append(f"{name}=50")
            elif nl == "voucherversion":
                if needs_voucher_version(path):
                    qs.append(f"{name}=2")
            elif nl == "gstin":
                qs.append(f"{name}={GSTIN}")
            elif nl in ("date", "voucherdate", "asof", "entrydate"):
                qs.append(f"{name}={DATE}")
            elif nl in ("q", "query", "search"):
                qs.append(f"{name}=api")
            elif nl == "vouchertype" or nl == "type":
                if "template" in p:
                    qs.append(f"{name}=invoice")
                elif "graph" in p:
                    qs.append(f"{name}=category")
                else:
                    qs.append(f"{name}=sales")
            elif nl == "uniquename" and "graph" in p:
                qs.append(f"{name}=income")
            elif nl == "interval":
                qs.append(f"{name}=monthly")
            elif nl == "financialyear":
                qs.append(f"{name}=APR-2026-MAR-2027")
            elif nl == "regioncode":
                qs.append(f"{name}=IND")
            elif nl == "countrycode":
                qs.append(f"{name}=GB")
            elif nl == "filetype":
                qs.append(f"{name}=base64")
            elif nl == "billingaccountunqiuname" or nl == "billingaccountuniquename":
                qs.append(f"{name}={BILLING}")
            elif q.get("required"):
                qs.append(f"{name}={param_value(name, path)}")
    return ("&".join(qs)) if qs else ""


def minimal_body(method: str, path: str, request_body) -> object | None:
    if method in ("GET", "DELETE", "HEAD"):
        return None
    p = path.lower()
    # Prefer empty object for unknown POSTs; a few known shapes
    if "purchase-record/generate" in p:
        return {
            "number": f"PR-API-{int(time.time()) % 100000}",
            "date": DATE,
            "entries": [],
        }
    if "invoices/generate" in p or "vouchers/generate" in p:
        # reuse tiny invalid-but-structured body — accept failure
        return {
            "type": "sales",
            "date": DATE,
            "entries": [],
        }
    if "bulk-generate" in p:
        return []
    if "send-mail" in p or "/mail" in p:
        return {"to": ["apidoc@example.invalid"], "subject": "api doc", "message": "test"}
    if "report-comment" in p:
        return {"comment": "api-doc capture"}
    if "flatten-groups-with-accounts" in p:
        return {}
    if "balance" in p and method == "POST":
        return {}
    if "invoice/preview" in p:
        return {"uniqueName": SALES_V, "voucherType": "sales"}
    if "export-ledger" in p:
        return {}
    if "un-merge" in p or path.endswith("/merge") or "/merge" in p:
        return {"uniqueNames": [CUST]}
    if "/move" in p:
        return {"uniqueName": GROUP}
    if "contacts" in p and method == "PUT":
        return []
    if "autopaid" in p:
        return None
    if "subscription" in p:
        if "buy-plan" in p or "change-plan" in p:
            return {"planUniqueName": "placeholder", "paymentMethod": "PAYPAL"}
        if "get-amount" in p or "list" in p:
            return {}
        if "add-payment" in p or "add-wallet" in p:
            return {}
        return {}
    if "stock-aging" in p or "aging" in p:
        return {}
    if "stock-group" in p and method == "POST":
        return {"name": "API Doc Temp SG", "uniqueName": f"apidoc-temp-sg-{int(time.time())%10000}"}
    if "stock-group" in p and method == "PUT":
        # Do NOT change uniqueName — prior run renamed apidoc-products via PUT body
        return {"name": "API Doc Products"}
    if "/stock" in p and method in ("POST", "PUT") and "report" not in p and "recipe" not in p:
        return {"name": "temp", "stockUnitUniqueName": STOCK_UNIT}
    if "bank" in p:
        return {}
    if "communication" in p or "email-template" in p:
        return {"subject": "api", "html": "<p>api</p>"}
    if "project" in p:
        return {}
    if "users" in p or "shared" in p:
        return {}
    if "batch" in p:
        return {}
    if "groups" in p and method in ("POST", "PUT"):
        return {"name": "temp", "uniqueName": f"apidoc-temp-g-{int(time.time())%10000}", "parentGroupUniqueName": "currentassets"}
    if "ewb" in p or "e-way" in p:
        return {}
    if "import" in p:
        return {}
    if "trigger" in p:
        return {}
    if "signup" in p or "login" in p or "verify" in p:
        return {"email": "apidoc@example.invalid", "password": "InvalidPass1!"}
    if "save-gstr" in p:
        return {}
    if "sales-register" in p or "purchase-register" in p:
        return {}
    if method == "PATCH" and "purchase-record" in p:
        return {}
    if method == "PUT" and "/accounts/" in p and "vouchers" not in p and "contacts" not in p:
        return {"name": "API Doc Customer One", "uniqueName": CUST}
    if method == "PUT" and "vouchers" in p:
        return {"uniqueName": SALES_V, "type": "sales"}
    if method == "DELETE":
        return None
    # catalog fields → empty-ish object with required field names if present
    if isinstance(request_body, dict) and request_body.get("fields"):
        body = {}
        for f in request_body["fields"]:
            if not f.get("required"):
                continue
            fname = f.get("name") or ""
            ftype = (f.get("type") or "").lower()
            if "list" in ftype or "array" in ftype:
                body[fname] = []
            elif "boolean" in ftype:
                body[fname] = False
            elif "number" in ftype or "int" in ftype or "double" in ftype or "long" in ftype:
                body[fname] = 0
            else:
                body[fname] = param_value(fname, path)
        return body if body else {}
    return {}


def auth_headers() -> list[str]:
    """Prefer Auth-Key; fall back to Session-Id only if Auth-Key missing."""
    if AUTH_KEY:
        return ["-H", f"Auth-Key: {AUTH_KEY}"]
    if SID:
        return ["-H", f"Session-Id: {SID}"]
    return []


def curl_one(method: str, full_path: str, body: object | None) -> tuple[int, object]:
    url = f"{BASE}{full_path}"
    cmd = [
        "curl", "-sS", "-w", "\n%{http_code}",
        "-X", method if method != "ANY" else "GET",
        url,
        *auth_headers(),
        "-H", f"User-Agent: {UA}",
        "-H", f"Origin: {ORIGIN}",
        "-H", "Accept: application/json",
        "-H", "Content-Type: application/json",
        "--max-time", "60",
    ]
    if body is not None:
        cmd.extend(["--data-binary", json.dumps(body)])
    elif method not in ("GET", "DELETE", "HEAD", "ANY"):
        cmd.extend(["--data-binary", "{}"])
    proc = subprocess.run(cmd, capture_output=True, text=True)
    out = proc.stdout
    if not out.strip():
        return 0, {"empty": True, "stderr": (proc.stderr or "")[-500:]}
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
        data = {"raw": raw[:3000], "parseError": True}
    return http, data


def slug(method: str, np: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", f"{method}-{np}").strip("-").lower()
    return s[:80]


def classify(http: int, data: object) -> tuple[str, str]:
    msg = ""
    st = "success" if 200 <= http < 300 else "error"
    if isinstance(data, dict):
        msg = str(data.get("message") or data.get("error") or data.get("status") or "")[:200]
        if data.get("status") == "error" and st == "success":
            st = "error"
        if data.get("status") == "success":
            st = "success"
    return st, msg


def main() -> int:
    # session check
    http, data = curl_one("GET", f"/company/{C}", None)
    tag0 = f"{START_TAG}-session-check"
    (PACK / "requests" / f"{tag0}.json").write_text(
        json.dumps({"method": "GET", "path": f"/company/{C}"}, indent=2) + "\n"
    )
    (PACK / "responses" / f"{tag0}.json").write_text(json.dumps(data, indent=2) + "\n")
    st, msg = classify(http, data)
    print(f"{tag0} {http} {st} {msg[:80]}")
    if http != 200 or (isinstance(data, dict) and data.get("status") == "error"):
        print("AUTH FAILED — stop")
        print("Update secrets.local.json authKey (preferred) or sessionId, then re-run: python3 _fe_pending_runner.py")
        fail_entry = {"tag": tag0, "method": "GET", "path": f"/company/{C}", "http": str(http), "status": "error", "message": msg}
        prior = []
        if (PACK / "CALL-LOG-FE-PENDING.json").exists():
            prior = json.loads((PACK / "CALL-LOG-FE-PENDING.json").read_text())
            if not isinstance(prior, list):
                prior = []
        prior.append(fail_entry)
        (PACK / "CALL-LOG-FE-PENDING.json").write_text(json.dumps(prior, indent=2) + "\n")
        return 2

    # Restore masters damaged by earlier PUT bodies (best-effort)
    # Stock group may still be apidoc-temp-sg-342, or already apidoc-products
    sg_check_http, sg_check = curl_one("GET", f"/company/{C}/stock-group/apidoc-products", None)
    if sg_check_http == 200 and isinstance(sg_check, dict) and sg_check.get("status") != "error":
        print(f"fix-sg-rename skip (apidoc-products already OK) {sg_check_http}")
    else:
        fh, fd = curl_one(
            "PUT",
            f"/company/{C}/stock-group/apidoc-temp-sg-342",
            {"name": "API Doc Products", "uniqueName": "apidoc-products"},
        )
        print(f"fix-sg-rename {fh} {classify(fh, fd)[0]}")
    fh, fd = curl_one("PUT", f"/company/{C}/accounts/{CUST}/move", {"uniqueName": "sundrydebtors"})
    print(f"fix-customer-group {fh} {classify(fh, fd)[0]}")

    log: list[dict] = [
        {"tag": tag0, "method": "GET", "path": f"/company/{C}", "http": str(http), "status": st, "message": msg}
    ]
    # Merge prior FE-pending log on resume
    prior_log_path = PACK / "CALL-LOG-FE-PENDING.json"
    if prior_log_path.exists() and PENDING_FILE.name.endswith("remaining.json"):
        prior = json.loads(prior_log_path.read_text())
        if isinstance(prior, list):
            log = prior + log

    jobs = []
    tag_n = START_TAG if PENDING_FILE.name.endswith("remaining.json") else START_TAG + 1
    skipped_killers = []
    for item in PENDING:
        method = item["method"].upper()
        np = item["normalizedPath"]
        path_l = (item.get("path") or np).lower()
        if any(k in path_l for k in SESSION_KILLERS):
            tag = f"{tag_n}-SKIP-session-killer-{slug(method, np)}"
            req = {"method": method, "path": item.get("path"), "skipped": True, "reason": "session-killer"}
            (PACK / "requests" / f"{tag}.json").write_text(json.dumps(req, indent=2) + "\n")
            (PACK / "responses" / f"{tag}.json").write_text(
                json.dumps({"skipped": True, "reason": "Would invalidate Session-Id; not called"}, indent=2) + "\n"
            )
            log.append({
                "tag": tag, "method": method, "path": item.get("path") or np,
                "http": "000", "status": "skipped", "message": "session-killer blacklisted",
            })
            skipped_killers.append(tag)
            tag_n += 1
            continue
        if (method, np) in SKIP_DESTRUCTIVE:
            path_tmpl = clean_path_template(item.get("path") or "")
            filled = fill_path(path_tmpl).replace(CUST, "apidoc-disposable-missing-xx").replace(STOCK, "apidoc-disposable-missing-xx")
            q = default_query(filled, method, item.get("parameters"))
            full = filled + (("?" + q) if q else "")
            jobs.append((tag_n, method, full, None, item))
            tag_n += 1
            continue
        path_tmpl = clean_path_template(item.get("path") or ("/" + np.replace("{}", "{x}")))
        if "{x}" in path_tmpl or path_tmpl.count("{}") > 0:
            path_tmpl = clean_path_template(item.get("path") or "")
        filled = fill_path(path_tmpl)
        if "/purchase" in filled.lower() or "/vendor" in filled.lower() or "/payment" in filled.lower():
            if f"/accounts/{CUST}" in filled:
                filled = filled.replace(f"/accounts/{CUST}", f"/accounts/{VEND}", 1)
        if "/bank/" in filled.lower() and f"/accounts/{CUST}" in filled:
            filled = filled.replace(f"/accounts/{CUST}", f"/accounts/{BANK}", 1)

        q = default_query(filled, method, item.get("parameters"))
        full = filled + (("?" + q) if q else "")
        body = minimal_body(method, filled, item.get("requestBody"))
        jobs.append((tag_n, method, full, body, item))
        tag_n += 1

    print(f"Prepared {len(jobs)} calls; skipped session-killers={len(skipped_killers)}")
    session_dead = False

    def run_job(job):
        tag_i, method, full, body, item = job
        slug_s = slug(method, item["normalizedPath"])
        tag = f"{tag_i}-{slug_s}"
        http_c, data_c = curl_one(method, full, body)
        return tag, method, full, body, http_c, data_c

    # Run in waves so we can detect session expiry
    wave = 25
    for i in range(0, len(jobs), wave):
        if session_dead:
            break
        batch = jobs[i : i + wave]
        results = []
        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            futs = [ex.submit(run_job, j) for j in batch]
            for fut in as_completed(futs):
                results.append(fut.result())
        # save in tag order
        results.sort(key=lambda x: int(x[0].split("-", 1)[0]))
        auth_fails = 0
        for tag, method, full, body, http_c, data_c in results:
            req = {"method": method, "path": full}
            if body is not None:
                req["body"] = body
            (PACK / "requests" / f"{tag}.json").write_text(json.dumps(req, indent=2) + "\n")
            (PACK / "responses" / f"{tag}.json").write_text(json.dumps(data_c, indent=2) + "\n")
            st_c, msg_c = classify(http_c, data_c)
            entry = {
                "tag": tag,
                "method": method,
                "path": full,
                "http": str(http_c),
                "status": st_c,
                "message": msg_c,
            }
            log.append(entry)
            print(f"{tag} {http_c} {st_c} {msg_c[:70]}")
            if http_c in (401, 403) or (
                isinstance(data_c, dict)
                and data_c.get("status") == "error"
                and "session" in str(data_c.get("message") or "").lower()
            ):
                auth_fails += 1
            if http_c == 0 and isinstance(data_c, dict) and "Cloudflare" in str(data_c):
                auth_fails += 1
        # mid-run session probe every wave
        sh, sd = curl_one("GET", f"/company/{C}", None)
        if sh != 200 or (isinstance(sd, dict) and sd.get("status") == "error"):
            print("SESSION EXPIRED mid-run — saving progress and stopping")
            session_dead = True
        if auth_fails >= max(8, len(batch) // 2):
            # verify
            sh, sd = curl_one("GET", f"/company/{C}", None)
            if sh != 200 or (isinstance(sd, dict) and sd.get("status") == "error"):
                print("Many auth failures + session dead — stop")
                session_dead = True

    (PACK / "CALL-LOG-FE-PENDING.json").write_text(json.dumps(log, indent=2) + "\n")

    # append to day log (idempotent by tag)
    day = PACK / "CALL-LOG-2026-10-23.json"
    day_data = json.loads(day.read_text())
    if isinstance(day_data, list):
        existing_tags = {e.get("tag") for e in day_data if isinstance(e, dict)}
        for e in log:
            if e["tag"] not in existing_tags:
                day_data.append(e)
        day.write_text(json.dumps(day_data, indent=2) + "\n")

    ok = sum(1 for e in log if e["status"] == "success")
    err = sum(1 for e in log if e["status"] != "success")
    print(f"\nDONE attempted={len(log)} success={ok} fail={err} session_dead={session_dead}")
    return 1 if session_dead else 0


if __name__ == "__main__":
    raise SystemExit(main())
