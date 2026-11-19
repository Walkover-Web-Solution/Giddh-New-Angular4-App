# Giddh Website — login flows (recorded 2026-10-23)

Host in the user’s capture: `https://api.giddh.com`, origin `https://giddh.com`, then books at `https://books.giddh.com`.  
Apitest equivalents: `https://api.giddh.com` + `https://test.giddh.com` / `https://web.giddh.com`.

Secrets (Google Bearer, MSG91 JWT, OTP, Session-Id) are **redacted** in saved JSON. Do not commit real tokens.

Signup → subscription → company: `WEBSITE-SIGNUP-FLOWS.md`. Destroy-session is documented for logout only — **never** call it in automation against a shared session.

## A. Google login

1. **External (not Giddh):** Google OAuth popup → `GET https://www.googleapis.com/oauth2/v1/userinfo` with `Authorization: Bearer <google_token>`  
   Capture note: `1635-external-google-userinfo`
2. **Giddh:** `GET /v2/google-login` with header `Access-Token: <google_token>` (same token)  
   Success: `1630-website-google-login-success`  
   Body often has `statusCode: "AUTHENTICATE_TWO_WAY"` when 2FA is on.
3. If 2FA: OTP modal → `POST /v2/verify-number`  
   Body: `{ "countryCode": "91", "mobileNumber": "9111525164", "oneTimePassword": "<otp>" }`  
   Success: `1631-website-verify-number-success` → returns `session.id`
4. Redirect to books → `GET /v2/user` with `Session-Id`  
   Success: `1632-website-to-panel-v2-user`
5. Logout → `DELETE /users/{email}/destroy-session` with `Session-Id`  
   Success: `1633-website-logout-destroy-session` → website region login

## B. Login with OTP (MSG91 widget)

1. **External (not Giddh):** MSG91 widget `sendOtp` then `verifyOtp` → JWT  
   Capture note: `1636-external-msg91-send-verify-otp`
2. **Giddh:** `POST /v2/auth-login` body `{ "accessToken": "<msg91_jwt>" }`  
   Success: `1634-website-auth-login-success`  
   Same `AUTHENTICATE_TWO_WAY` path when 2FA is on.
3. Then same as Google steps 3–5: `/v2/verify-number` → books `/v2/user` → optional destroy-session.

## Explorer tags

All Giddh steps above are tagged **Giddh Website** (panel `/v2/user` and destroy-session may also show **Giddh Panel**).
