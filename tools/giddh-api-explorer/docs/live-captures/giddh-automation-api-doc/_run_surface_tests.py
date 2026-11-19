#!/usr/bin/env python3
"""Live-call Customer Portal, Magic Link, and Website routes. Saves request + response JSON."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SECRETS = json.loads((ROOT / "secrets.local.json").read_text())
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)
BASE = SECRETS["baseUrl"].rstrip("/")
COMPANY = SECRETS["companyUniqueName"]
BRANCH = SECRETS["branchUniqueName"]
ACCOUNT = "apidoc-customer-one"
VOUCHER_UN = "5zkmf1792674363694"
VOUCHER_NO = "261022-1"
FROM = "01-04-2026"
TO = "23-10-2026"


def save(tag, method, path, body, status, raw, content_type):
    req = {"method": method, "path": path}
    if body is not None:
        req["body"] = body
    (ROOT / "requests" / f"{tag}.json").write_text(json.dumps(req, indent=2) + "\n")
    text = raw.decode("utf-8", errors="replace")
    try:
        parsed = json.loads(text) if text.strip() else {"_empty": True}
    except json.JSONDecodeError:
        parsed = {
            "contentType": content_type,
            "bytes": len(raw),
            "note": "Non-JSON body. Preview only.",
            "preview": text[:200],
        }
    if isinstance(parsed, dict):
        parsed["httpStatus"] = status
    else:
        parsed = {"httpStatus": status, "body": parsed}
    (ROOT / "responses" / f"{tag}.json").write_text(json.dumps(parsed, indent=2) + "\n")
    summary = ""
    if isinstance(parsed, dict):
        summary = str(parsed.get("status") or parsed.get("message") or parsed.get("error") or parsed.get("code") or "")[:140]
    print(f"{tag} HTTP {status} {summary}")
    return parsed


def call(tag, method, path, body=None, auth=True, headers=None):
    body_file = ROOT / "responses" / f".{tag}.body"
    cmd = [
        "curl", "-sS",
        "-A", UA,
        "-X", method,
        "-H", "Accept: application/json",
        "-H", f"Origin: {SECRETS['origin']}",
        "-H", f"Referer: {SECRETS['origin']}/",
        "--max-time", "90",
        "-o", str(body_file),
        "-w", "%{http_code} %{content_type}",
    ]
    if auth:
        if SECRETS.get("sessionId"):
            cmd += ["-H", f"Session-Id: {SECRETS['sessionId']}"]
        if SECRETS.get("authKey"):
            cmd += ["-H", f"Auth-Key: {SECRETS['authKey']}"]
    if headers:
        for key, value in headers.items():
            cmd += ["-H", f"{key}: {value}"]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "--data", json.dumps(body)]
    cmd.append(BASE + path)
    proc = subprocess.run(cmd, capture_output=True)
    meta = proc.stdout.decode().strip()
    status_text, _, content_type = meta.partition(" ")
    status = int(status_text or "0")
    raw = body_file.read_bytes() if body_file.exists() else (proc.stderr or b"")
    if body_file.exists():
        body_file.unlink()
    if proc.returncode != 0 and status == 0:
        raw = proc.stderr or raw
    return save(tag, method, path, body, status, raw, content_type)


def main():
    created = call(
        "1500-magic-link-create",
        "POST",
        f"/company/{COMPANY}/accounts/{ACCOUNT}/magic-link?from={FROM}&to=31-03-2027",
        {},
    )
    link = ""
    body = created.get("body") if isinstance(created, dict) else None
    if isinstance(body, dict) and body.get("magicLink"):
        link = str(body["magicLink"]).rstrip("/").split("/")[-1]
    elif isinstance(created, dict) and isinstance(created.get("body"), dict):
        link = str(created["body"].get("magicLink") or "").rstrip("/").split("/")[-1]
    # response may be the API envelope itself
    if not link and isinstance(created, dict):
        inner = created.get("body") or created
        if isinstance(inner, dict) and inner.get("magicLink"):
            link = str(inner["magicLink"]).rstrip("/").split("/")[-1]
        elif isinstance(inner, dict) and isinstance(inner.get("body"), dict) and inner["body"].get("magicLink"):
            link = str(inner["body"]["magicLink"]).rstrip("/").split("/")[-1]
    if not link:
        link = "ljcunuy"
    print("magic-link-id", link)

    ledger = call(
        "1501-magic-link-ledger",
        "GET",
        f"/magic-link-ledger/{link}?from={FROM}&to={TO}&sort=desc&count=20&ledgerView=customer",
        auth=False,
    )
    call(
        "1502-magic-link-ledger-balance",
        "GET",
        f"/magic-link-ledger-balance/{link}?from={FROM}&to={TO}",
        auth=False,
    )
    call(
        "1503-magic-link-download-invoice",
        "GET",
        f"/magic-link/{link}/download-invoice/{VOUCHER_NO}",
        auth=False,
    )
    call(
        "1504-magic-link-download-voucher",
        "POST",
        f"/magic-link/{link}/download-voucher?voucherVersion=2&downloadOption=VOUCHER",
        {"voucherType": "sales", "uniqueName": VOUCHER_UN},
        auth=False,
    )
    file_id = "missing-attachment"
    call(
        "1505-magic-link-ledger-upload",
        "GET",
        f"/magic-link/{link}/ledger/upload/{file_id}",
        auth=False,
    )

    call("1506-website-plans", "GET", "/v2/subscription/plans/all?regionCode=IN", auth=False)
    call("1507-website-v2-user", "GET", "/v2/user")
    call("1508-website-google-login", "GET", "/v2/google-login", auth=False)
    call(
        "1509-website-invoice-pay-request",
        "GET",
        "/invoice-pay-request/missing-token?voucherVersion=2",
        auth=False,
    )

    portal = f"/portal/company/{COMPANY}/accounts/{ACCOUNT}"
    call("1510-portal-details", "GET", f"{portal}/details")
    call("1511-portal-company-details", "GET", f"{portal}/get-company-details")
    call("1512-portal-contacts", "GET", f"{portal}/contacts")
    call("1513-portal-payment-method", "GET", f"{portal}/payment-method")
    call("1514-portal-payment-methods", "GET", f"{portal}/payment-methods?voucherVersion=2")
    call(
        "1515-portal-view-statement",
        "GET",
        f"{portal}/view-statement?page=1&count=10&from={FROM}&to={TO}&sort=desc",
    )
    call(
        "1516-portal-export-statement",
        "GET",
        f"{portal}/export-account-statement?page=1&count=10&from={FROM}&to={TO}&sort=desc&fileType=pdf",
    )
    call(
        "1517-portal-vouchers-get-all",
        "POST",
        f"{portal}/vouchers/get-all?voucherVersion=2&type=sales&page=1&count=20&sort=desc&sortBy=voucherDate&from={FROM}&to={TO}",
        {"companyUniqueName": COMPANY, "accountUniqueName": ACCOUNT, "balanceStatus": [], "uniqueNames": []},
    )
    call(
        "1518-portal-balance-summary",
        "GET",
        f"{portal}/vouchers/balance-summary?voucherVersion=2&type=sales",
    )
    call(
        "1519-portal-comments",
        "GET",
        f"{portal}/{VOUCHER_UN}/comments?voucherVersion=2",
    )
    call(
        "1520-portal-invoice-pay-request",
        "POST",
        f"{portal}/invoice-pay-request?voucherVersion=2",
        [VOUCHER_UN],
    )
    call(
        "1521-portal-download-file",
        "POST",
        f"{portal}/download-file?voucherVersion=2&fileType=base64",
        [VOUCHER_UN],
    )
    call(
        "1522-portal-vouchers-list",
        "GET",
        f"{portal}/vouchers?type=receipt&page=1&count=10&uniqueNames={VOUCHER_UN}&voucherVersion=2",
    )
    call(
        "1523-verify-portal-user",
        "POST",
        "/v2/verify-portal-user",
        {"emailId": SECRETS.get("userUniqueName") or "divyanshu@whozzat.com", "subDomain": "GiddhAutomationAPIDOC"},
        auth=False,
    )
    print("ledger-keys", list(ledger)[:8] if isinstance(ledger, dict) else type(ledger))


if __name__ == "__main__":
    main()
