#!/usr/bin/env python3
"""Call every Giddh Website API once. Save request + response. No real signup/OTP send to production phones."""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("surf", ROOT / "_run_surface_tests.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

C = mod.COMPANY
ORIGIN_SITE = "https://web.giddh.com"
# Website public origin for white-label resolution
mod.SECRETS["origin"] = ORIGIN_SITE


def call(tag, method, path, body=None, auth=False, headers=None):
    return mod.call(tag, method, path, body=body, auth=auth, headers=headers)


def main():
    # Already known good / reconfirm
    call("1600-website-plans-ind", "GET", "/v2/subscription/plans/all?regionCode=IND", auth=False)
    call("1601-website-plans-in-fail", "GET", "/v2/subscription/plans/all?regionCode=IN", auth=False)
    call("1602-website-v2-user", "GET", "/v2/user", auth=True)

    # Google login — missing Access-Token
    call("1603-website-google-login-no-token", "GET", "/v2/google-login", auth=False)
    call(
        "1604-website-google-login-bad-token",
        "GET",
        "/v2/google-login",
        auth=False,
        headers={"Access-Token": "invalid-google-access-token"},
    )

    # Auth login — MSG91 / widget accessToken
    call("1605-website-auth-login-empty", "POST", "/v2/auth-login", {}, auth=False)
    call(
        "1606-website-auth-login-bad",
        "POST",
        "/v2/auth-login",
        {"accessToken": "invalid-msg91-access-token"},
        auth=False,
    )

    # Password login — wrong password, do not use real password
    call(
        "1607-website-login-password-bad",
        "POST",
        "/v2/login-with-password",
        {"uniqueKey": "divyanshu@whozzat.com", "password": "definitely-wrong-password-api-doc"},
        auth=False,
    )
    call(
        "1608-website-login-password-empty",
        "POST",
        "/v2/login-with-password",
        {},
        auth=False,
    )

    # Register — invalid / incomplete so no real user is created
    call("1609-website-register-empty", "POST", "/v2/register", {}, auth=False)
    call(
        "1610-website-register-partial",
        "POST",
        "/v2/register",
        {
            "emailId": "apidoc-website-no-create@example.com",
            "emailIdAccessToken": "invalid",
            "emailIdAuthType": "google",
            "mobileNo": "919999999999",
            "mobileNoAccessToken": "invalid",
        },
        auth=False,
    )

    # OTP — use clearly fake number; expect validation / not found, not a real SMS
    call(
        "1611-website-generate-otp",
        "POST",
        "/generate-otp",
        {"countryCode": "91", "mobileNumber": "9000000000"},
        auth=False,
    )
    call(
        "1612-website-verify-number",
        "POST",
        "/v2/verify-number",
        {"countryCode": "91", "mobileNumber": "9000000000", "oneTimePassword": "000000"},
        auth=False,
    )

    # Affiliate verify-and-send — no valid MSG91 accessToken
    call("1613-website-verify-and-send-empty", "POST", "/verify-and-send", {}, auth=False)
    call(
        "1614-website-verify-and-send-bad",
        "POST",
        "/verify-and-send",
        {
            "accessToken": "invalid",
            "website_url": "https://web.giddh.com/affiliate",
            "currency_code": "INR",
            "name": "API Doc Affiliate Test",
            "email": "apidoc-affiliate@example.com",
        },
        auth=False,
    )

    # Public invoice pay request — fake token
    call(
        "1615-website-invoice-pay-request-missing",
        "GET",
        "/invoice-pay-request/missing-token-apidoc?voucherVersion=2",
        auth=False,
    )

    # Invoice pay (website payment callback) — unpaid sales number if known
    call(
        "1616-website-invoice-pay",
        "POST",
        f"/company/{C}/invoices/261022-2/pay?voucherVersion=2",
        {"paymentId": "pay_fake_apidoc", "amount": 100, "date": "23-10-2026"},
        auth=False,
    )
    call(
        "1617-website-invoice-pay-auth",
        "POST",
        f"/company/{C}/invoices/261022-2/pay?voucherVersion=2",
        {"paymentId": "pay_fake_apidoc", "amount": 100, "date": "23-10-2026"},
        auth=True,
    )

    # Proforma pay — unmatched in Spring catalog; still call to document
    call(
        "1618-website-proforma-pay",
        "POST",
        f"/company/{C}/proforma/PR-20261023-1/pay",
        {"razorpay_payment_id": "pay_fake"},
        auth=False,
    )
    call(
        "1619-website-proforma-pay-auth",
        "POST",
        f"/company/{C}/proforma/PR-20261023-1/pay",
        {"razorpay_payment_id": "pay_fake"},
        auth=True,
    )

    # Website also hits white-label from origin
    call("1620-website-white-label", "GET", "/white-label", auth=False)

    print("website batch done")


if __name__ == "__main__":
    main()
