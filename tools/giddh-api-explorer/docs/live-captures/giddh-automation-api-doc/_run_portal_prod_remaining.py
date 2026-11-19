#!/usr/bin/env python3
"""Remaining Customer Portal prod APIs; destroy-session LAST."""
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
PROXY = P["proxyBase"].rstrip("/")
C = P["companyUniqueName"]
A = P["accountUniqueName"]  # raji1
SESSION = P["sessionId"]
TOKEN = P["proxyAuthToken"]
ORIGIN = P["origin"]
FROM, TO = "01-04-2025", "23-10-2026"
VOUCHER = "yktu41792755921064"
VENDOR = P["vendorContactUniqueName"]  # raji contact


def save(tag, method, path, body, status, raw, via="proxy"):
    req = {"method": method, "path": path, "env": "prod", "surface": "customer-portal", "via": via}
    if body is not None:
        # never write full proxy token
        b = json.loads(json.dumps(body))
        if isinstance(b, dict) and "proxyAuthToken" in b:
            b["proxyAuthToken"] = "<REDACTED>"
        req["body"] = b
    (ROOT / "requests" / f"{tag}.json").write_text(json.dumps(req, indent=2) + "\n")
    text = raw.decode("utf-8", errors="replace")
    try:
        parsed = json.loads(text) if text.strip() else {"_empty": True}
    except json.JSONDecodeError:
        parsed = {"bytes": len(raw), "preview": text[:150], "note": "non-json"}
    if isinstance(parsed, dict):
        parsed["httpStatus"] = status
        parsed["env"] = "prod"
        # redact session echoes
        for key in ("message",):
            if isinstance(parsed.get(key), str) and SESSION[:16] in parsed[key]:
                parsed[key] = parsed[key].replace(SESSION, SESSION[:8] + "********" + SESSION[-4:])
        # shrink big base64
        body_o = parsed.get("body")
        if isinstance(body_o, str) and len(body_o) > 400:
            parsed["body"] = f"<omitted {len(body_o)} chars>"
        if isinstance(body_o, dict):
            if isinstance(body_o.get("data"), str) and len(body_o["data"]) > 400:
                body_o["data"] = f"<omitted {len(body_o['data'])} chars>"
            for v in body_o.get("vouchers") or []:
                if isinstance(v, dict) and isinstance(v.get("content"), str) and len(v["content"]) > 200:
                    v["content"] = f"<omitted {len(v['content'])} chars>"
    (ROOT / "responses" / f"{tag}.json").write_text(json.dumps(parsed, indent=2) + "\n")
    summary = ""
    if isinstance(parsed, dict):
        summary = str(parsed.get("status") or parsed.get("code") or parsed.get("message") or "")[:140]
    print(f"{tag} HTTP {status} {summary}")
    return parsed


def call(tag, method, path, body=None, session=None, headers=None):
    url = PROXY + path
    body_file = ROOT / "responses" / f".{tag}.body"
    cmd = [
        "curl", "-sS", "-A", UA, "-X", method,
        "-H", "Accept: application/json",
        "-H", f"Origin: {ORIGIN}",
        "-H", f"Referer: {ORIGIN}/",
        "--max-time", "60",
        "-o", str(body_file),
        "-w", "%{http_code}",
    ]
    if session is None:
        sid = SESSION
    else:
        sid = session  # "" = omit Session-Id
    if sid:
        cmd += ["-H", f"Session-Id: {sid}"]
    if headers:
        for k, v in headers.items():
            cmd += ["-H", f"{k}: {v}"]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "--data", json.dumps(body)]
    cmd.append(url)
    proc = subprocess.run(cmd, capture_output=True)
    status = int(proc.stdout.decode().strip() or "0")
    raw = body_file.read_bytes() if body_file.exists() else (proc.stderr or b"")
    if body_file.exists():
        body_file.unlink()
    return save(tag, method, path, body, status, raw)


def main():
    portal = f"/portal/company/{C}/accounts/{A}"
    # variants / remaining routes
    call("1720-portal-prod-payment-methods-base", "GET", f"{portal}/payment-methods")
    call(
        "1721-portal-prod-export-xlsx",
        "GET",
        f"{portal}/export-account-statement?page=1&count=10&from={FROM}&to={TO}&sort=desc&fileType=xlsx",
    )
    call(
        "1721b-portal-prod-export-xls",
        "GET",
        f"{portal}/export-account-statement?page=1&count=10&from={FROM}&to={TO}&sort=desc&fileType=xls",
    )
    call(
        "1722-portal-prod-vouchers-receipt-list",
        "GET",
        f"{portal}/vouchers?type=receipt&page=1&count=10&uniqueNames={VOUCHER}&voucherVersion=2",
    )
    call("1723-portal-prod-voucher-get", "GET", f"{portal}/voucher/{VOUCHER}?voucherVersion=2")
    call("1724-portal-prod-vendor-contact", "GET", f"{portal}/vendor-contact/{VENDOR}")
    call("1725-portal-prod-vendor-contact-page-count", "GET", f"{portal}/vendor-contact/{VENDOR}/get-page-count")
    call(
        "1726-portal-prod-vendor-contact-set-page",
        "GET",
        f"{portal}/vendor-contact/{VENDOR}/set-page-count?count=20",
    )
    # pay without real paymentId (expect error; no gateway on company)
    call(
        "1727-portal-prod-invoice-pay",
        "POST",
        f"{portal}/invoices/fake-payment-id/pay?voucherVersion=2",
        {"paymentId": "fake-payment-id", "amount": 1, "date": "23-10-2026"},
    )
    # increment session
    call(
        "1728-portal-prod-increment-session",
        "PUT",
        f"/v2/portal-user/{VENDOR}/increment-session",
        None,
    )
    siddhi = next(a for a in P["accounts"] if a["uniqueName"] == "siddhi")
    # portal-user/switch (needs active Session-Id)
    switched = call(
        "1729-portal-prod-portal-user-switch-siddhi",
        "POST",
        "/v2/portal-user/switch",
        {
            "account": {"name": siddhi["name"], "uniqueName": siddhi["uniqueName"]},
            "vendorContactUniqueName": siddhi["vendorContactUniqueName"],
            "proxyAuthToken": TOKEN,
            "subDomain": P["subDomain"],
        },
    )
    new_session = None
    body = switched.get("body") if isinstance(switched, dict) else None
    if isinstance(body, dict) and isinstance(body.get("session"), dict):
        new_session = body["session"].get("id")
    # fallback: UI path uses save-session for switch
    if not new_session:
        switched = call(
            "1729b-portal-prod-save-session-siddhi",
            "POST",
            "/v2/portal-user/save-session",
            {
                "account": {"name": siddhi["name"], "uniqueName": siddhi["uniqueName"]},
                "vendorContactUniqueName": siddhi["vendorContactUniqueName"],
                "proxyAuthToken": TOKEN,
                "subDomain": P["subDomain"],
            },
            session="",
            headers={"proxy_auth_token": TOKEN},
        )
        body = switched.get("body") if isinstance(switched, dict) else None
        if isinstance(body, dict) and isinstance(body.get("session"), dict):
            new_session = body["session"].get("id")
            tag_redact = "1729b-portal-prod-save-session-siddhi"
        else:
            tag_redact = None
    else:
        tag_redact = "1729-portal-prod-portal-user-switch-siddhi"
    if new_session and tag_redact:
        secrets = json.loads((ROOT / "secrets.local.json").read_text())
        secrets["portalProd"]["sessionId"] = new_session
        secrets["portalProd"]["accountUniqueName"] = "siddhi"
        secrets["portalProd"]["vendorContactUniqueName"] = siddhi["vendorContactUniqueName"]
        (ROOT / "secrets.local.json").write_text(json.dumps(secrets, indent=2) + "\n")
        resp_path = ROOT / "responses" / f"{tag_redact}.json"
        raw = resp_path.read_text().replace(new_session, new_session[:8] + "********" + new_session[-4:])
        resp_path.write_text(raw)
        print("switched-session-stored-redacted")
    if new_session:
        call(
            "1730-portal-prod-siddhi-balance",
            "GET",
            f"/portal/company/{C}/accounts/siddhi/vouchers/balance-summary?voucherVersion=2",
            session=new_session,
        )
        call(
            "1731-portal-prod-siddhi-details",
            "GET",
            f"/portal/company/{C}/accounts/siddhi/details",
            session=new_session,
        )
        # switch back to raji for logout on raji1 path
        back = call(
            "1732-portal-prod-switch-back-raji",
            "POST",
            "/v2/portal-user/switch",
            {
                "account": {"name": "Raji", "uniqueName": "raji1"},
                "vendorContactUniqueName": VENDOR,
                "proxyAuthToken": TOKEN,
                "subDomain": P["subDomain"],
            },
            session=new_session,
        )
        final_session = new_session
        b2 = back.get("body") if isinstance(back, dict) else None
        if isinstance(b2, dict) and isinstance(b2.get("session"), dict) and b2["session"].get("id"):
            final_session = b2["session"]["id"]
            resp_path = ROOT / "responses" / "1732-portal-prod-switch-back-raji.json"
            raw = resp_path.read_text().replace(final_session, final_session[:8] + "********" + final_session[-4:])
            resp_path.write_text(raw)
        else:
            # save-session fallback
            back = call(
                "1732b-portal-prod-save-session-raji",
                "POST",
                "/v2/portal-user/save-session",
                {
                    "account": {"name": "Raji", "uniqueName": "raji1"},
                    "vendorContactUniqueName": VENDOR,
                    "proxyAuthToken": TOKEN,
                    "subDomain": P["subDomain"],
                },
                session="",
                headers={"proxy_auth_token": TOKEN},
            )
            b2 = back.get("body") if isinstance(back, dict) else None
            if isinstance(b2, dict) and isinstance(b2.get("session"), dict) and b2["session"].get("id"):
                final_session = b2["session"]["id"]
                resp_path = ROOT / "responses" / "1732b-portal-prod-save-session-raji.json"
                raw = resp_path.read_text().replace(
                    final_session, final_session[:8] + "********" + final_session[-4:]
                )
                resp_path.write_text(raw)
        secrets = json.loads((ROOT / "secrets.local.json").read_text())
        secrets["portalProd"]["sessionId"] = final_session
        secrets["portalProd"]["accountUniqueName"] = "raji1"
        secrets["portalProd"]["vendorContactUniqueName"] = VENDOR
        (ROOT / "secrets.local.json").write_text(json.dumps(secrets, indent=2) + "\n")
        logout_session = final_session
    else:
        logout_session = SESSION

    # LAST: logout destroy-session
    call(
        "1733-portal-prod-destroy-session",
        "DELETE",
        f"/portal/company/{C}/accounts/raji1/destroy-session",
        session=logout_session,
    )
    # prove session dead
    call(
        "1734-portal-prod-after-logout-balance",
        "GET",
        f"/portal/company/{C}/accounts/raji1/vouchers/balance-summary?voucherVersion=2",
        session=logout_session,
    )
    print("remaining portal APIs done; logout last")


if __name__ == "__main__":
    main()
