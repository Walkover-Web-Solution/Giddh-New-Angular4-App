# APIs to finish manually (2026-11-21)

These pages have no real success example yet: it is built from the backend code, or missing. Each needs something the test accounts could not safely provide: a customer portal or magic-link session, an OTP or login, a real payment, a government filing, messages to real people, a bank connection, a company from another country, or version-1 vouchers. Every other page on the public docs uses real responses.

Total: 210 pages.

## Customer portal or magic-link session needed (19)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| GET | magic-link/get-ledgers-v2 | `/magic-link/{magicLink}` | from backend code |
| GET | magic-link/download-invoice | `/magic-link/{magicLink}/download-invoice/{invoiceNumber}` | from backend code |
| POST | customer-portal/download | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/download-file` | from backend code |
| POST | customer-portal/get-invoice-payment-request | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/invoice-pay-request` | from backend code |
| POST | customer-portal/process-voucher-payment | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/{paymentId}/pay` | from backend code |
| GET | customer-portal/get-payment-methods | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/payment-methods` | from backend code |
| GET | customer-portal/get-balance-summary | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/balance-summary` | from backend code |
| POST | customer-portal/get-all-vouchers | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/get-all` | from backend code |
| POST | customer-portal/add-comments | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/{voucherUniqueName}/add-comment` | from backend code |
| GET | customer-portal/get-comments | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/{voucherUniqueName}/comments` | from backend code |
| GET | customer-portal/customer-portal-proxy-helper-proxy_url-not-a-giddh-spring-controller- | `/api/c/getDetails` | none |
| GET | customer-portal/customer-portal-payment-list-uses-get-vouchers-type-receipt-backend-has-get-voucher-uniquename-and-post-vouchers-get-all-not-this-exact-route- | `/portal/company/{id}/accounts/{id}/vouchers` | none |
| GET | customer-portal/get-customer-vendor-contact | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/contacts` | from backend code |
| POST | customer-portal/save-session-for-portal-user | `/v2/portal-user/save-session` | from backend code |
| GET | customer-portal/get-account-details | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/details` | from backend code |
| GET | customer-portal/export-account-statement | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/export-account-statement` | from backend code |
| GET | customer-portal/get-company-details | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/get-company-details` | from backend code |
| GET | customer-portal/view-statement | `/portal/company/{companyUniqueName}/accounts/{accountUniqueName}/view-statement` | from backend code |
| POST | customer-portal/verify-portal-user | `/v2/verify-portal-user` | from backend code |

## Bank feed or bank payment (GoCardless, ICICI, Plaid, Yodlee) (21)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| DELETE | account/api-delete-multiple-transactions-by-transaction-unique-id | `/company/{companyUniqueName}/bank/accounts/{accountUniqueName}:.+/transactions` | from backend code |
| POST | banking/create-end-user-agreement-and-requisitions | `/company/{companyUniqueName}/gocardless/agreement-requisitions` | from backend code |
| DELETE | banking/delete-bank-integration-details | `/company/{companyUniqueName}/gocardless/{bankDetailsUniqueName}` | from backend code |
| POST | banking/fetch-account-details | `/company/{companyUniqueName}/gocardless/requisitions/{reference}` | from backend code |
| POST | banking/bank-registration | `/company/{companyUniqueName}/bank/registration` | from backend code |
| PUT | banking/update-details | `/company/{companyUniqueName}/bank/updateDetails` | from backend code |
| DELETE | banking/bank-de-registration | `/company/{companyUniqueName}/bank/deregistration` | from backend code |
| GET | banking/get-all-registration | `/company/{companyUniqueName}/bank` | from backend code |
| GET | banking/generate-otp | `/company/{companyUniqueName}/bank/generateotp` | from backend code |
| POST | banking/bulk-payment | `/company/{companyUniqueName}/bank/payments` | from backend code |
| POST | banking/api-confirm-payment-with-otp-and-sent-to-bank-for-payment | `/company/{companyUniqueName}/bank/payments/confirm` | from backend code |
| GET | banking/api-resent-otp-to-user | `/company/{companyUniqueName}/bank/resend-otp` | from backend code |
| GET | banking/create-link-token | `/company/{companyUniqueName}/plaid/create/link-token` | from backend code |
| POST | banking/set-access-token | `/company/{companyUniqueName}/plaid/create/access-token` | from backend code |
| POST | banking/bank-registration-for-icici | `/v2/company/{companyUniqueName}/bank` | from backend code |
| PUT | banking/update-bank-details | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName}:.+` | from backend code |
| POST | banking/in-once-icici-bank-account-integration---there-can-be-multiple-login-credenti- | `/v2/company/{companyUniqueName}/bank/multi-registration` | from backend code |
| PUT | banking/update-payor-details | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName}:.+/payor/{urn}:.+` | from backend code |
| GET | banking/api-get-registration-status-of-the-integrated-bank-account- | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName}:.+/payor/{urn}:.+/status` | from backend code |
| GET | banking/get-payors-for-payment | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName}:.+/payor` | from backend code |
| POST | banking/importpdf | `/company/{companyUniqueName}/imports/import-pdf/bank-statement` | from backend code |

## Login, OTP, password, session or auth key (43)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| PUT | settings/update-user-settings | `/users/{userUniqueName}/settings` | from backend code |
| PUT | user/generate-auth-key | `/users/{uniqueName}/generate-auth-key` | from backend code |
| POST | user/destroy-one-user-session | `/users/{userUniqueName}/destroy-session` | from backend code |
| PUT | user/increment-user-session | `/users/{userUniqueName}/increment-session` | from backend code |
| PUT | user/forgot-password | `/users/{uniqueKey}/forgot-password` | none |
| DELETE | user/delete-all-sessions | `/users/{userUniqueName}/sessions` | from backend code |
| POST | user/destroy-user-session2 | `/users/{userUniqueName}/destroy-session` | from backend code |
| POST | communication/verify-auth-key | `/company/{companyUniqueName}/communication/platform/verify` | from backend code |
| GET | communication/get-campaign-list | `/company/{companyUniqueName}/communication/campaign/list` | from backend code |
| GET | communication/get-email-verification-key | `/company/{companyUniqueName}/email-key` | from backend code |
| GET | communication/get-sms-verification-key | `/company/{companyUniqueName}/sms-key` | from backend code |
| POST | other-apis/change-plan-of-subscription | `/v2/subscription/change-plan` | from backend code |
| PUT | other-apis/generate-auth-key | `/users/{uniqueName}/generate-auth-key` | from backend code |
| PUT | other-apis/update-user-entity-role | `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` | from backend code |
| POST | subscription/verify-owner-ship | `/v2/subscription/verify/ownership` | from backend code |
| GET | trigger/get-trigger | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | from backend code |
| PATCH | trigger/update-patch | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | from backend code |
| DELETE | trigger/delete-trigger | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | from backend code |
| GET | auth/verify-company-invoice-email | `/company/{companyUniqueName}/invoice-setting/verify-email` | from backend code |
| GET | auth/login-with-number | `/login-with-number` | from backend code |
| POST | auth/sign-up-with-email | `/signup-with-email` | from backend code |
| POST | auth/generate-otp | `/generate-otp` | from backend code |
| PUT | auth/reset-password | `/reset-password` | from backend code |
| POST | auth/sign-up-with-google-v2 | `/v2/signup-with-google` | from backend code |
| POST | auth/verify-email-v2 | `/v2/verify-email` | from backend code |
| POST | auth/verify-mobile-v2 | `/v2/verify-number` | from backend code |
| POST | auth/login-with-password | `/v2/login-with-password` | from backend code |
| POST | auth/signup | `/v2/signup` | from backend code |
| POST | auth/api-to-support-signup-with-apple | `/v2/signup-with-apple` | from backend code |
| POST | auth/api-to-support-login-with-otp | `/v2/auth-login` | from backend code |
| GET | auth/verify-company-invoice-email-1 | `/company/{companyUniqueName}/purchase-bill-setting/verify-email` | from backend code |
| POST | auth/generate-auth-key | `/company/{companyUniqueName}/auth/generate` | from backend code |
| PUT | auth/update-auth-user | `/company/{companyUniqueName}/auth/{authUniqueName}/update` | from backend code |
| DELETE | auth/remove-auth-key | `/company/{companyUniqueName}/auth/{authUniqueName}/remove` | from backend code |
| GET | auth/unmask-auth-key | `/company/{companyUniqueName}/auth/{authUniqueName}` | from backend code |
| POST | purchase-register/create-purchase-register | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/generate` | from backend code |
| GET | purchase-register/use-to-get-purchase-record | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}` | from backend code |
| PATCH | purchase-register/update-purchase-register | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record` | from backend code |
| GET | purchase-register/download-file | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/download-file` | from backend code |
| POST | purchase-register/mail-purchase-order | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}/mail` | from backend code |
| POST | purchase-register/get-all-versions-of-a-particular-purchase-record-with-provided-purchase-recor- | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/versions/all` | from backend code |
| GET | purchase-register/download-purchase-order-version-3 | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}/download` | from backend code |
| DELETE | purchase-register/delete-purchase-record | `/company/{companyUniqueName}/purchase-record` | from backend code |

## Payments, subscriptions and gateways (31)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| POST | payment/add-payu-user | `/company/{companyUniqueName}/payu` | from backend code |
| POST | payment/initiate-uk-payment | `/company/{companyUniqueName}/uk/payment/initiate` | from backend code |
| POST | payment/add-paypal-account | `/company/{companyUniqueName}/paypal` | from backend code |
| DELETE | payment/delete-paypal-account-for-company | `/company/{companyUniqueName}/paypal` | from backend code |
| PUT | payment/update-paypal-account | `/company/{companyUniqueName}/paypal` | from backend code |
| POST | payment/capture-order | `/subscription/paypal/order/{orderId}/capture` | from backend code |
| POST | payment/add-razor-pay-account | `/company/{companyUniqueName}/razorpay` | from backend code |
| PUT | payment/update-or-map-razor-pay-account | `/company/{companyUniqueName}/razorpay` | from backend code |
| DELETE | payment/delete-razor-pay-account-for-company | `/company/{companyUniqueName}/razorpay` | from backend code |
| POST | company/create-company | `/company` | from backend code |
| POST | website/process-proforma-payment | `/company/{companyUniqueName}/invoices/{invoiceUniqueName}/pay` | from backend code |
| GET | vat/activate-subscription-after-payment | `/v2/subscription/{subscriptionId}/activate` | from backend code |
| POST | vat/activate-prepaid-subscription | `/v2/subscription/{subscriptionId}/activate-prepaid` | none |
| POST | vat/retrieve-vat-payments | `/company/{companyUniqueName}/uk/retrieve-vat-payments` | from backend code |
| POST | invoice/pay-invoice | `/company/{companyUniqueName}/invoices/{invoiceUniqueName}/action` | from backend code |
| POST | other-apis/buy-plan | `/v2/subscription/buy-plan` | from backend code |
| POST | other-apis/update-subscription-after-payment | `/v2/subscription/update` | from backend code |
| POST | subscription/owner-ship-transfer | `/v2/subscription/transfer/ownership` | from backend code |
| POST | subscription/also-it-add-plan-info-to-subscription-if-user-selects-plan-without-selecting- | `/v2/subscription` | from backend code |
| GET | subscription/cancel-subscription | `/v2/subscription/{subscriptionId}/cancel` | from backend code |
| PATCH | subscription/update-default-subscription-payment-info | `/v2/subscription/payment-method/{paymentUniqueName}` | from backend code |
| DELETE | subscription/delete-subscription-payment-info | `/v2/subscription/payment-method/{paymentUniqueName}` | from backend code |
| GET | subscription/save-stripe-payment-method | `/v2/subscription/{subscriptionId}/payment/{paymentIntentId}/save-stripe-payment` | from backend code |
| POST | subscription/change-plan-of-subscription | `/v2/subscription/change-plan` | from backend code |
| POST | subscription/buy-plan | `/v2/subscription/buy-plan` | from backend code |
| POST | subscription/update-subscription-after-payment | `/v2/subscription/update` | from backend code |
| POST | subscription/add-payment-method | `/v2/subscription/add-payment-method` | from backend code |
| POST | subscription/add-wallet-amount | `/v2/subscription/add-wallet-amount` | from backend code |
| POST | subscription/capture-wallet-payment | `/v2/subscription/{subscriptionId}/capture-wallet-payment` | from backend code |
| POST | subscription/create-pre-paid-of-subscription | `/v2/subscription/{subscriptionId}/create-pre-paid` | from backend code |
| GET | subscription/generate-order-for-subscription-payment | `/subscription/generateOrder` | none |

## Government filing (GST, e-invoice, e-way bill, HMRC) (45)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| POST | account/generate-invoice | `/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/generate` | from backend code |
| POST | account/generate-invoice-1 | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}:.+/invoices/generate` | from backend code |
| PUT | account/update-invoice | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}:.+/invoices` | from backend code |
| POST | e-invoice/cancel-einvoice | `/company/{companyUniqueName}/invoice/{invoiceUniqueName}/cancel-einvoice` | from backend code |
| POST | e-invoice/cancel-einvoice-for-voucher | `/company/{companyUniqueName}/voucher/{voucherUniqueName}/cancel-einvoice` | from backend code |
| POST | e-invoice/cancel-einvoice-for-account-voucher | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/cancel-einvoice` | from backend code |
| POST | company/create-gsp-session | `/v2/company/{companyUniqueName}/gsp-session` | from backend code |
| GET | vat/get-kenya-vat-report | `/company/{companyUniqueName}/kenya/vat-report` | from backend code |
| GET | vat/download-kenya-vat-report-v2 | `/company/{companyUniqueName}/kenya/v2/vat-report-download` | from backend code |
| POST | vat/get-vat-obligations | `/company/{companyUniqueName}/uk/vat-obligations` | from backend code |
| POST | vat/submit-vat-return | `/company/{companyUniqueName}/uk/submit-vat-return` | from backend code |
| POST | vat/view-vat-return | `/company/{companyUniqueName}/uk/view-vat-return` | from backend code |
| POST | vat/retrieve-vat-liabilities | `/company/{companyUniqueName}/uk/retrieve-vat-liabilities` | from backend code |
| GET | vat/get-vat-report | `/v2/company/{companyUniqueName}/vat-report` | from backend code |
| GET | vat/get-vat-report-detailed | `/v2/company/{companyUniqueName}/vat-report-detailed` | from backend code |
| GET | vat/get-zwvat-report | `/company/{companyUniqueName}/zw/vat-report` | from backend code |
| GET | vat/download-vat-report-with-export-settings | `/company/{companyUniqueName}/zw/vat-report-download-v2` | from backend code |
| POST | e-way-bill/generate-eway-bill | `/company/{companyUniqueName}/ewb` | from backend code |
| POST | e-way-bill/authenticate-user | `/company/{companyUniqueName}/ewb/user` | from backend code |
| GET | e-way-bill/download-ewbwith-export-settings | `/company/{companyUniqueName}/ewb/{ewbno}/download-v2` | from backend code |
| GET | e-way-bill/download-ewbdetailed-with-export-settings | `/company/{companyUniqueName}/ewb/{ewbno}/download-detailed-v2` | from backend code |
| PUT | e-way-bill/cancel-eway-bill | `/company/{companyUniqueName}/ewb/cancel` | from backend code |
| PUT | e-way-bill/update-vehicle-number | `/company/{companyUniqueName}/ewb/vehicle` | from backend code |
| POST | e-way-bill/validate-invoice | `/company/{companyUniqueName}/ewb/validate-invoice` | from backend code |
| DELETE | invoice/delete-invoice | `/company/{companyUniqueName}/invoices` | from backend code |
| PUT | invoice/update-invoice-email | `/company/{companyUniqueName}/invoice-setting` | from backend code |
| GET | sales-register/download-vat-report-tax-authority-wise | `/company/{companyUniqueName}/us/export-sales-report-authority-wise` | from backend code |
| GET | sales-register/get-vat-report-tax-authority-wise | `/company/{companyUniqueName}/us/sales-report-authority-wise` | from backend code |
| GET | sales-register/get-vat-report-tax-wise | `/company/{companyUniqueName}/us/sales-report-tax-wise` | from backend code |
| GET | sales-register/download-vat-report-tax-wise | `/company/{companyUniqueName}/us/export-sales-report-tax-wise` | from backend code |
| GET | sales-register/download-vat-report-account-wise | `/company/{companyUniqueName}/us/export-sales-report-account-wise` | from backend code |
| POST | exception/generate-invoice-invalid-json | `/exception/invalid-json` | from backend code |
| PUT | purchase-bill/update-invoice-email | `/company/{companyUniqueName}/purchase-bill-setting` | from backend code |
| POST | gst/save-gstr1data | `/v2/company/{companyUniqueName}/save-gstr1` | from backend code |
| GET | gst/save-gstr1status | `/v2/company/{companyUniqueName}/save-gstr1-status` | from backend code |
| POST | gst/prepare | `/company/{companyUniqueName}/dsc/prepare` | from backend code |
| POST | gst/finish | `/company/{companyUniqueName}/dsc/finish` | from backend code |
| POST | gst/prepare-dsc | `/company/{companyUniqueName}/dsc/prepare` | from backend code |
| POST | gst/finish-dsc | `/company/{companyUniqueName}/dsc/finish` | from backend code |
| GET | india-tax/get-vat-report | `/v2/company/{companyUniqueName}/vat-report` | none |
| POST | save-authorization-code/save-authorization-code | `/company/{companyUniqueName}/save-authorization-code` | from backend code |
| POST | voucher/generate-invoice | `/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/generate` | from backend code |
| POST | voucher/cancel-einvoice | `/company/{companyUniqueName}/invoice/{invoiceUniqueName}/cancel-einvoice` | from backend code |
| PUT | voucher/update-invoice-email | `/company/{companyUniqueName}/invoice-setting` | from backend code |
| POST | voucher/generate-invoice-1 | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}:.+/invoices/generate` | from backend code |

## Sends email, SMS or WhatsApp (23)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| POST | account/mail-ledger-all | `/company/{companyUniqueName}/accounts/{accountUniqueName}:.+/mail-ledger` | from backend code |
| POST | account/mail-purchase-order | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/{uniqueName}/mail` | from backend code |
| POST | account/download | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/download-file` | from backend code |
| GET | account/auto-adjust-vouchers | `/company/{companyUniqueName}/accounts/{accountUniqueName}/autopaid` | from backend code |
| POST | entry/mail-ledger-all | `/company/{companyUniqueName}/accounts/{accountUniqueName}:.+/mail-ledger` | from backend code |
| GET | inventory/download-inventory-arranged-by-accounts | `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` | from backend code |
| POST | inventory/download-inventory-arranged-by-accounts-with-filters | `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` | from backend code |
| GET | inventory/stock-inventory-export-arrangedby-accounts-get | `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` | from backend code |
| POST | inventory/stock-inventory-export-arrangedby-accounts-post | `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` | from backend code |
| POST | company/share-domain | `/company/{companyUniqueName}/domain/{domainUniqueName}/share` | from backend code |
| DELETE | communication/delete-platform | `/company/{companyUniqueName}/communication/platform/{uniqueName}` | from backend code |
| GET | communication/get-campaign-fields | `/company/{companyUniqueName}/communication/campaign/{slug}/fields` | from backend code |
| POST | communication/email-verification-key | `/company/{companyUniqueName}/email-key` | from backend code |
| POST | communication/sms-verification-key | `/company/{companyUniqueName}/sms-key` | from backend code |
| POST | communication/generate-mail-token | `/company/{companyUniqueName}/generate-mail-token` | from backend code |
| GET | communication/get-token | `/company/{companyUniqueName}/gmail-token` | from backend code |
| DELETE | communication/delete-token | `/company/{companyUniqueName}/gmail-token` | from backend code |
| POST | communication/save-mail-token | `/company/{companyUniqueName}/save-mail-token` | from backend code |
| POST | reports/create-multi-currency-report-for-multiple-companies | `/v2/company/{companyUniqueName}/multicompany/{reportType}` | from backend code |
| POST | e-commerce/send-email | `/company/{companyUniqueName}/ecommerce/email` | from backend code |
| POST | permission/assign-role | `/company/{companyUniqueName}/role/{roleUniqueName}/assign` | from backend code |
| POST | group/email-account-balance | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/email-account-closing-balance` | from backend code |
| POST | group/sms-account-balance | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/sms-account-closing-balance` | from backend code |

## Legacy version-1 vouchers (test companies are version 2) (7)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| POST | account/generated-invoice-preview | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}:.+/invoice/preview` | from backend code |
| POST | account/generate | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` | none |
| POST | account/get-account | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | none |
| PUT | account/update-account-3 | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | from backend code |
| POST | voucher/add-recurring-voucher | `/company/{companyUniqueName}/recurring-voucher` | from backend code |
| DELETE | voucher/delete-recurring-voucher | `/company/{companyUniqueName}/recurring-voucher/{recurringVoucherUniqueName}` | from backend code |
| PATCH | voucher/update-recurring-voucher | `/company/{companyUniqueName}/recurring-voucher/{recurringVoucherUniqueName}` | from backend code |

## Other (see note in docstar-real-responses.json) (21)

| Method | Page | Route | Success example now |
| --- | --- | --- | --- |
| PUT | account/update-account | `/company/{companyUniqueName}/accounts/{accountUniqueName}:.+` | from backend code |
| PATCH | export/update-export-settings | `/company/{companyUniqueName}/export-settings` | from backend code |
| POST | business-documents/generate-via-estimate | `/company/{companyUniqueName}/business-documents/generate-via-estimate` | from backend code |
| POST | business-documents/generate-business-document-via-estimate | `/company/{companyUniqueName}/business-documents/generate-via-estimate` | from backend code |
| POST | financial-year/create-financial-year | `/company/{companyUniqueName}/financial-year` | from backend code |
| PUT | financial-year/update-financial-year | `/company/{companyUniqueName}/financial-year` | from backend code |
| PATCH | financial-year/lock-financial-year | `/company/{companyUniqueName}/financial-year-lock` | from backend code |
| PATCH | financial-year/unlock-financial-year | `/company/{companyUniqueName}/financial-year-unlock` | from backend code |
| POST | financial-year/create-future-financial-year | `/company/{companyUniqueName}/future-financial-year` | from backend code |
| PATCH | financial-year/unlock-financial-year-1 | `/company/{companyUniqueName}/financial-year-unlock` | from backend code |
| POST | financial-year/create-future-financial-year-1 | `/company/{companyUniqueName}/future-financial-year` | from backend code |
| PUT | settings/update-user-company-entry-settings | `/company/{companyUniqueName}/entry-settings` | from backend code |
| POST | inventory/create-inventory-user | `/company/{companyUniqueName}/inventory-users` | from backend code |
| POST | inventory/inventory-report | `/company/{companyUniqueName}/inventory-report` | from backend code |
| POST | advance-receipt/adjust-advance-receipt-entry-with-invoice | `/company/{companyUniqueName}/advance-receipt/adjust` | from backend code |
| POST | petty-cash/petty-cash-action | `/company/{companyUniqueName}/pettycash-manager/{entryUniqueName}` | from backend code |
| DELETE | other-apis/delete-user-entity-role | `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` | from backend code |
| POST | custom-field/set-custom-fields | `/company/{companyUniqueName}/custom-fields` | from backend code |
| PUT | permission/update-user-entity-role | `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` | from backend code |
| DELETE | permission/delete-user-entity-role | `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` | from backend code |
| POST | images/set-company-image | `/company/{companyUniqueName}/images` | from backend code |

