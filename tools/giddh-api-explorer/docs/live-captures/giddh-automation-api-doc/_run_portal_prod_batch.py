#!/usr/bin/env python3
"""Call remaining Customer Portal APIs on prod using portalProd session in secrets.local.json."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SECRETS = json.loads((ROOT / "secrets.local.json").read_text())
P = SECRETS["portalProd"]
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36"
)
BASE = P["baseUrl"].rstrip("/")
PROXY = P["proxyBase"].rstrip("/")
C = P["companyUniqueName"]
A = P["accountUniqueName"]
SESSION = P["sessionId"]
ORIGIN = P["origin"]
FROM, TO = "01-04-2025", "23-10-2026"


def save(tag, method, path, body, status, raw, content_type, via):
    req = {"method": method, "path": path, "env": "prod", "surface": "customer-portal", "via": via}
    if body is not None:
        req["body"] = body
    (ROOT / "requests" / f"{tag}.json").write_text(json.dumps(req, indent=2) + "\n")
    text = raw.decode("utf-8", errors="replace")
    try:
        parsed = json.loads(text) if text.strip() else {"_empty": True}
    except json.JSONDecodeError:
        parsed = {"contentType": content_type, "bytes": len(raw), "preview": text[:200]}
    if isinstance(parsed, dict):
        parsed["httpStatus"] = status
        parsed["env"] = "prod"
        # redact session if echoed
        msg = str(parsed.get("message") or "")
        if SESSION[:20] in msg:
            parsed["message"] = msg.replace(SESSION, SESSION[:8] + "********" + SESSION[-4:])
    else:
        parsed = {"httpStatus": status, "body": parsed, "env": "prod"}
    (ROOT / "responses" / f"{tag}.json").write_text(json.dumps(parsed, indent=2) + "\n")
    summary = ""
    if isinstance(parsed, dict):
        summary = str(parsed.get("status") or parsed.get("code") or parsed.get("message") or "")[:120]
    print(f"{tag} HTTP {status} {summary}")
    return parsed


def call(tag, method, path, body=None, use_proxy=True):
    url = (PROXY if use_proxy else BASE) + path
    body_file = ROOT / "responses" / f".{tag}.body"
    cmd = [
        "curl", "-sS", "-A", UA, "-X", method,
        "-H", "Accept: application/json",
        "-H", f"Origin: {ORIGIN}",
        "-H", f"Referer: {ORIGIN}/",
        "-H", f"Session-Id: {SESSION}",
        "--max-time", "60",
        "-o", str(body_file),
        "-w", "%{http_code} %{content_type}",
    ]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "--data", json.dumps(body)]
    cmd.append(url)
    proc = subprocess.run(cmd, capture_output=True)
    meta = proc.stdout.decode().strip()
    status_text, _, content_type = meta.partition(" ")
    status = int(status_text or "0")
    raw = body_file.read_bytes() if body_file.exists() else b""
    if body_file.exists():
        body_file.unlink()
    return save(tag, method, path, body, status, raw, content_type, "proxy" if use_proxy else "direct")


def main():
    portal = f"/portal/company/{C}/accounts/{A}"
    call("1707-portal-prod-contacts", "GET", f"{portal}/contacts")
    call("1708-portal-prod-payment-method", "GET", f"{portal}/payment-method")
    call("1709-portal-prod-payment-methods", "GET", f"{portal}/payment-methods?voucherVersion=2")
    call(
        "1710-portal-prod-view-statement",
        "GET",
        f"{portal}/view-statement?page=1&count=10&from={FROM}&to={TO}&sort=desc",
    )
    call(
        "1711-portal-prod-vouchers-get-all",
        "POST",
        f"{portal}/vouchers/get-all?voucherVersion=2&type=sales&page=1&count=20&sort=desc&sortBy=voucherDate",
        {"companyUniqueName": C, "accountUniqueName": A, "balanceStatus": [], "uniqueNames": []},
    )
    # if get-all succeeds, pull first voucher for comments/download
    get_all = json.loads((ROOT / "responses" / "1711-portal-prod-vouchers-get-all.json").read_text())
    voucher_un = None
    body = get_all.get("body")
    if isinstance(body, dict):
        items = body.get("results") or body.get("items") or body.get("pageItems") or []
        if not items and isinstance(body.get("data"), list):
            items = body["data"]
        if isinstance(items, list) and items and isinstance(items[0], dict):
            voucher_un = items[0].get("uniqueName")
            print("first-voucher", voucher_un, items[0].get("voucherNumber") or items[0].get("number"))
    if voucher_un:
        call("1712-portal-prod-comments", "GET", f"{portal}/{voucher_un}/comments?voucherVersion=2")
        call(
            "1713-portal-prod-download-file",
            "POST",
            f"{portal}/download-file?voucherVersion=2&fileType=base64",
            [voucher_un],
        )
        call(
            "1714-portal-prod-invoice-pay-request",
            "POST",
            f"{portal}/invoice-pay-request?voucherVersion=2",
            [voucher_un],
        )
        call(
            "1715-portal-prod-add-comment",
            "POST",
            f"{portal}/{voucher_un}/add-comment?voucherVersion=2",
            {"description": "API doc portal prod test comment"},
        )
    else:
        print("no voucher uniqueName from get-all; skip comment/download/pay")
    call(
        "1716-portal-prod-export-statement",
        "GET",
        f"{portal}/export-account-statement?page=1&count=10&from={FROM}&to={TO}&sort=desc&fileType=pdf",
    )
    print("portal prod batch done")


if __name__ == "__main__":
    main()
