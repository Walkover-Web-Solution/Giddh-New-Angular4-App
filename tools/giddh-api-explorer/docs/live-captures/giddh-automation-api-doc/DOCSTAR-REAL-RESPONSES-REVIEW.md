# Real request and response examples for the public Giddh API docs (2026-11-20/21)

All 787 endpoint pages of Giddh API Draft_1 were re-documented from real calls to the Giddh test server (apitest, test company) where safe, earlier real captures otherwise, and backend code only where a live call would move money, send messages, file with a government portal or change ownership/permissions.

| | Count |
| --- | --- |
| Success examples from live calls | 554 |
| Success examples from earlier real captures | 49 |
| Success examples built from backend code (call not allowed or needs another company) | 208 |
| Pages with no success example (cannot be produced) | 8 |
| Error examples (all real: live or captured) | 981 |
| Request bodies replaced (placeholders or wrong field names) | 348 |

Every response has a plain description of when it is returned; the generic notes ("Saved success example from the API catalog capture.", "Example error response for this request.") are gone. Secrets are redacted, personal data replaced, arrays trimmed to two items, and the host shown as api.giddh.com.

## Built from backend code

- PUT account/update-account: Live calls to this v1 update route returned HTTP 500 for every body tried, so the success body is taken from the v1 account read (same AccountResource shape the handler returns). Prefer PATCH /v2/comp
- DELETE account/api-delete-multiple-transactions-by-transaction-unique-id: Success response built from the backend (ICICIBankController.deleteEntries): no bank-feed transactions exist on the test company to delete. The API returns the resolved message text, not the key succe
- POST account/mail-ledger-all: Not called live (sends email). Success message from mail.delivery.notification in ImportExportController.mailLedgerAll. requestExample left as is.
- POST account/generate-invoice: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a 
- POST account/generate-invoice-1: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a 
- PUT account/update-invoice: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a 
- POST account/generated-invoice-preview: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a 
- POST account/mail-purchase-order: Not called live with real recipients because it sends email; success body from the backend (PurchaseOrderService.mailPurchaseOrder returns message success.purchase.order.mail.sent).
- POST account/download: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a 
- PUT account/update-account-3: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a 
- GET account/auto-adjust-vouchers: Send voucherVersion=2 (without it the route returns a plain 404); voucher-version-1 companies get an error. Success not called live because it sends an email; message key autopaid.request.submitted re
- PATCH export/update-export-settings: Success not called live to avoid changing the shared company's export settings; message from success.company.exportSetting.update.
- GET magic-link/get-ledgers-v2: Public endpoint, no Auth-Key needed. Success body built from MagicLinkResponseResource with ledgerTransactions taken from a live ledger-transactions response of the same account; no live magic link wa
- GET magic-link/download-invoice: Public endpoint, no Auth-Key needed. Body is the base64 PDF string (MagicLinkController.downloadInvoice).
- POST e-invoice/cancel-einvoice: Not called with a real IRN (files to the e-invoice portal). Needs an e-invoice-enabled GST company with a generated IRN. The API returns the resolved message text, not the key success.einvoice.irn.can
- POST e-invoice/cancel-einvoice-for-voucher: Not called with a real IRN (files to the e-invoice portal). Needs an e-invoice-enabled GST company with an IRN on a credit/debit note. Returns resolved message text, not a message key.
- POST e-invoice/cancel-einvoice-for-account-voucher: cnlRsn (1 duplicate, 2 data entry mistake, 3 order cancelled, 4 other) and cnlRem are query parameters. Success not called live (portal filing); needs an e-invoice-enabled GST company. Success text fr
- POST business-documents/generate-via-estimate: Document uniqueNames in examples are server-generated (DC/RN numbers cannot carry the apidoc-2 prefix); all test documents, invoices, bills and estimates were deleted afterwards. Live success not repr
- POST business-documents/generate-business-document-via-estimate: Document uniqueNames in examples are server-generated (DC/RN numbers cannot carry the apidoc-2 prefix); all test documents, invoices, bills and estimates were deleted afterwards. Same as Generate Via 
- POST payment/add-payu-user: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls). Message text from the backend message bundle (success.message.payu).
- POST payment/initiate-uk-payment: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls). Success shape from HmrcPaymentJourneyResponses.Initiate (journeyId, nextUrl, status=SUBMITTED); values are
- POST payment/add-paypal-account: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls).
- DELETE payment/delete-paypal-account-for-company: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls).
- PUT payment/update-paypal-account: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls).
- POST payment/capture-order: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls).
- POST payment/add-razor-pay-account: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls).
- PUT payment/update-or-map-razor-pay-account: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls). The update returns the same message key as create (success.message.razorpay).
- DELETE payment/delete-razor-pay-account-for-company: Payment-gateway endpoint: not called live (payment gateways are out of scope for test calls).
- POST financial-year/create-financial-year: Changes company financial years, so not called live with a valid body; success body is the FinancialYearResponse shape (same as Get Financial Year) built from the live company data.
- PUT financial-year/update-financial-year: Changes company financial years, so not called live with a valid body; success body is the FinancialYearResponse shape (same as Get Financial Year) built from the live company data.
- PATCH financial-year/lock-financial-year: Changes company financial years, so not called live with a valid body; success body is the FinancialYearResponse shape (same as Get Financial Year) built from the live company data.
- PATCH financial-year/unlock-financial-year: Changes company financial years, so not called live with a valid body; success body is the FinancialYearResponse shape (same as Get Financial Year) built from the live company data.
- POST financial-year/create-future-financial-year: Creates a company financial year, so not called live; shape is FinancialYearResource, matching items of Get Financial Year.
- PATCH financial-year/unlock-financial-year-1: Changes company financial years, so not called live with a valid body; success body is the FinancialYearResponse shape (same as Get Financial Year) built from the live company data.
- POST financial-year/create-future-financial-year-1: Creates a company financial year, so not called live; shape is FinancialYearResource, matching items of Get Financial Year.
- PUT settings/update-user-company-entry-settings: Success not called live (changes user settings); body is EntrySettingResource, the same shape as Get Entry Settings.
- PUT settings/update-user-settings: Changes user security settings, so not called live. Message text from UserController.updateUserSettings.
- POST entry/mail-ledger-all: Sends email, so not called live. Message format from UtilService.createXlsResponse.
- POST inventory/create-inventory-user: On apitest the create call returned 410 INTERNAL_SERVER_ERROR although the inventory user was created (twice when retried). The 201 body is built from the controller (ApiResponseSuccess(InventoryUserR
- POST inventory/inventory-report: On apitest every valid call (GET or POST, empty or filtered body) returned HTTP 500. The 200 body is built from InventoryReport with JsonViews.inventoryReport (page, count, totalPages, totalItems, tra
- GET inventory/download-inventory-arranged-by-accounts: The route accepts both GET and POST. Success was not called live because it emails the export; the body is the same SUCCESS_INVENTORY_REPORT_MESSAGE response the sibling export endpoints returned live
- POST inventory/download-inventory-arranged-by-accounts-with-filters: The route accepts both GET and POST. Success was not called live because it emails the export; the body is the same SUCCESS_INVENTORY_REPORT_MESSAGE response the sibling export endpoints returned live
- GET inventory/stock-inventory-export-arrangedby-accounts-get: The route accepts both GET and POST. Success was not called live because it emails the export; the body is the same SUCCESS_INVENTORY_REPORT_MESSAGE response the sibling export endpoints returned live
- POST inventory/stock-inventory-export-arrangedby-accounts-post: The route accepts both GET and POST. Success was not called live because it emails the export; the body is the same SUCCESS_INVENTORY_REPORT_MESSAGE response the sibling export endpoints returned live
- POST customer-portal/download: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- POST customer-portal/get-invoice-payment-request: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- POST customer-portal/process-voucher-payment: Not called live: it records a customer payment from a payment gateway callback. Body text is the literal string from PortalController.processVoucherPayment. Error codes were not reproduced and are not
- GET customer-portal/get-payment-methods: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- GET customer-portal/get-balance-summary: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- POST customer-portal/get-all-vouchers: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- POST customer-portal/add-comments: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- GET customer-portal/get-comments: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- GET customer-portal/get-customer-vendor-contact: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- POST customer-portal/save-session-for-portal-user: Success not called live (creates a login session). Body shape from LoginService.saveSessionForPortalUser. An unknown vendorContactUniqueName returns 406 INVALID_REQUEST per code.
- GET customer-portal/get-account-details: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- GET customer-portal/export-account-statement: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- GET customer-portal/get-company-details: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- GET customer-portal/view-statement: Customer-portal endpoint: authenticate with the Session-Id returned by POST /v2/verify-portal-user or /v2/portal-user/save-session (not an Auth-Key). A portal session could not be created for this run
- POST customer-portal/verify-portal-user: Success not called live (it creates a login session). Shape from LoginService.verifyPortalUser. Per code: 406 when neither email nor mobile is given, 404 when no contact has that email or mobile.
- GET user/get-user: Needs a Session-Id header; it cannot be called with an Auth-Key alone, so the success body is built from LoggedInUserV2 (user, session, isNewUser, isSystemUser, contactNumber, countryCode, loggedInReg
- PUT user/generate-auth-key: Not called live: it rotates the user's Auth-Key. Success shape is AuthKeyModel (uniqueName, authKey, role when set), the same object GET /users/{u}/get-auth-key returned live. The session id in the ca
- POST user/destroy-one-user-session: Not called live with a real session id (it logs that session out). Success body is the literal message in UserController.destroyUserSession2. Calling for another user returns 412 NOT_PERMITTED per cod
- PUT user/increment-user-session: Not called live (session change). Success is LoggedInUserV2 like GET /v2/user. For another user's uniqueName it returns 412 NOT_PERMITTED per code.
- DELETE user/delete-all-sessions: Success not called live (it would log the test user out everywhere); body is the literal message in UserController.deleteAllSessions.
- POST user/destroy-user-session2: Not called live with a real session id (it logs that session out). Success body is the literal message in UserController.destroyUserSession2. Calling for another user returns 412 NOT_PERMITTED per cod
- POST company/share-domain: Success not called live (sends email). The body is the message returned by the mail provider (msg91 SendEmailResponse.message), so the exact text may differ. A user whose white label has no details ge
- POST company/create-company: Not created live (it would add a company and subscription usage to the test user). Success shape is CompanyResourceV2 (HttpStatus.CREATED) with values modelled on the test company's GET response. Vali
- POST company/create-gsp-session: Not called live (GST portal session). Needs a company with a GSTIN registered on the GST portal and a GSP account. The success message is the literal string in GstReturnV2Controller; gsp defaults to w
- POST advance-receipt/adjust-advance-receipt-entry-with-invoice: Not run live: the test company has no advance receipts (get-all is empty), so there was nothing of ours to adjust. Success text is the resolved success.advance.receipt.adjust message.
- POST website/process-proforma-payment: Not called live (records a payment). Success is the literal string in InvoiceController.processProformaPayment; only paymentId is read from the body. Errors were not reproduced.
- POST communication/verify-auth-key: Success shape from CommunicationService.verify (CommunicationMapping name/value); not run live because it needs a real MSG91 key. An empty authFields array currently causes a bare 500.
- DELETE communication/delete-platform: Success message from messages.properties (success.msg91.platform.delete); not run live because the company has no connected platform of ours to delete.
- GET communication/get-campaign-list: Success needs a connected MSG91 account; shape from CommunicationCampaignListResource. The live error really returns message and code swapped (message 'error.code.invalidRequest', code 'Please add aut
- GET communication/get-campaign-fields: Success needs a connected MSG91 account; shape from CampaignFieldsDataObject / CampaignMappingData.
- GET communication/get-email-verification-key: Configured shape from CompanyService.getEmailVerificationKey (SendGridCredentials); the real auth key is returned decrypted, shown here redacted.
- GET communication/get-sms-verification-key: Configured shape from SmsCredentials; auth key redacted.
- POST communication/email-verification-key: Success not run live: saving sends a test email. Message from CompanyController.emailVerificationKey.
- POST communication/sms-verification-key: Not run live: the route saves without validation and would change the shared test company's SMS settings. No validation error exists in code.
- POST communication/generate-mail-token: Success shape from the Token entity; not run live (needs a real Google OAuth code). A token that already exists for the company returns an already-exists error.
- GET communication/get-token: Connected shape from the Token entity; secrets redacted.
- DELETE communication/delete-token: Success string from GoogleMailService.deleteToken; not run live (no token of ours to delete).
- POST communication/save-mail-token: Success shape from GoogleMailService.saveMailToken; not run live (needs a real Google refresh token).
- GET vat/get-kenya-vat-report: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a Kenya VAT company. Query: from, to (dd-M
- GET vat/download-kenya-vat-report-v2: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a Kenya VAT company. The 500 is real behav
- GET vat/activate-subscription-after-payment: Not called (payments/subscriptions are out of bounds). Success body from SubscriptionControllerV2.activateSubscriptionAfterPayment; used only for GoCardless. Query: upgrade (boolean, required), billin
- GET vat/get-ukvat-report: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a UK VAT (MTD) company. UVATReportResponse
- POST vat/get-vat-obligations: Success is HMRC's obligations response passed through; needs a UK company connected to HMRC. Query: taxNumber, from, to, status (O/F), branchUniqueName.
- POST vat/submit-vat-return: Not called live (filing to a government portal is forbidden). Success is HMRC's submit-return receipt; needs a UK company connected to HMRC. Query: taxNumber, periodKey, from, to, branchUniqueName (al
- POST vat/view-vat-return: Success is HMRC's view-return response passed through; needs a UK company connected to HMRC.
- POST vat/retrieve-vat-payments: Success is HMRC's payments response passed through; needs a UK company connected to HMRC.
- POST vat/retrieve-vat-liabilities: Success is HMRC's liabilities response passed through; needs a UK company connected to HMRC.
- GET vat/get-vat-report: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a UAE/GCC VAT company. Query: taxNumber (r
- GET vat/get-vat-report-detailed: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a UAE/GCC VAT company. Result row shape fr
- GET vat/get-zwvat-report: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a Zimbabwe VAT company. Optional currencyC
- GET vat/download-vat-report-with-export-settings: The test company is an Indian GST company, so this report returns an empty body for it; the success example is built from the backend response type and needs a Zimbabwe VAT company.
- POST e-way-bill/generate-eway-bill: Not called with valid data: generating, cancelling or updating an e-way bill files with the government portal. Needs a GST company with e-way bill credentials. Success shape from EwayBillResponse.
- POST e-way-bill/authenticate-user: Not called with real credentials (government portal session). Success string from EwayBillService.saveCredentials.
- GET e-way-bill/download-ewbwith-export-settings: Success needs a company with e-way bills; shape from the FileResponse returned by download-v2. Query: type (base64), branchUniqueName.
- GET e-way-bill/download-ewbdetailed-with-export-settings: Success needs a company with e-way bills; shape from FileResponse.
- PUT e-way-bill/cancel-eway-bill: Not called with valid data: generating, cancelling or updating an e-way bill files with the government portal. Needs a GST company with e-way bill credentials. Success string from EwayBillService.canc
- PUT e-way-bill/update-vehicle-number: Not called with valid data: generating, cancelling or updating an e-way bill files with the government portal. Needs a GST company with e-way bill credentials. Success shape from VehicleUpdateResponse
- POST e-way-bill/validate-invoice: Live lookup of an existing voucher number still returned 'not found' (likely needs a GST invoice with e-way bill data); success shape from EwayBillInvoiceValidationModel.
- DELETE invoice/delete-invoice: Success not run (would delete a voucher not created in this run); message from InvoiceController.deleteInvoice.
- POST invoice/pay-invoice: Success not run (records a payment on an invoice not created in this run); message from InvoiceController.payInvoice. An earlier capture on another route returned 'Voucher updated.'.
- PUT invoice/update-invoice-email: Success with an address not run (sends an email); message from messages.properties company.email.invoice.confirmation.
- POST petty-cash/petty-cash-action: Success not run: no petty cash entry of ours existed. Messages from messages.properties (approve returns 'Petty Cash Entry is approved successfully.'). Query: action (approve/reject), accountUniqueNam
- POST reports/create-multi-currency-report-for-multiple-companies: Success not called live: a slow build emails the report to the user. Success bodies are built from the backend response types; the trial-balance body has the same shape as the multibranch trial balanc
- POST reports/create-multi-currency-report-for-multiple-companies: Success not called live: a slow build emails the report to the user. Success bodies are built from the backend response types; the trial-balance body has the same shape as the multibranch trial balanc
- POST other-apis/change-plan-of-subscription: Not called live (changes a billing subscription). Success body built from the SubscriptionResource type using a real subscription read from GET /users/subscriptions.
- POST other-apis/buy-plan: Not called live (buys a plan). Success body built from the SubscriptionResource type.
- PUT other-apis/generate-auth-key: Not called live (would invalidate the current key). Success body built from AuthKeyModel (uniqueName, authKey; role and user are not serialised in normal responses - unverified).
- POST other-apis/update-subscription-after-payment: Not called live (payment confirmation). The success body is the literal string success, per the controller.
- PUT other-apis/update-user-entity-role: Not called live (changes user permissions). Success body built from the user-entity-role resource shape seen in GET /users/{user}/company-uer; exact field set unverified.
- DELETE other-apis/delete-user-entity-role: Not called live (removes user access). Revoking your own role returns 412 NOT_PERMITTED (Cannot revoke role from self.).
- GET sales-register/download-vat-report-tax-authority-wise: Success not called live: a large export is emailed. Success bodies follow the controller (FileResponse with type, name and base64 data, or the success.export.background message); the file name is illu
- GET sales-register/download-vat-report-tax-authority-wise: Success not called live: a large export is emailed. Success bodies follow the controller (FileResponse with type, name and base64 data, or the success.export.background message); the file name is illu
- GET sales-register/get-vat-report-tax-authority-wise: Needs a US company with sales tax authorities to return data; the test company is Indian, so the success body is built from the USVatReport type with illustrative values. Called with from, to, page, c
- GET sales-register/get-vat-report-tax-wise: Needs a US company with sales tax authorities to return data; the test company is Indian, so the success body is built from the USVatReport type with illustrative values. Called with from, to, page, c
- GET sales-register/download-vat-report-tax-wise: Success not called live: a large export is emailed. Success bodies follow the controller (FileResponse with type, name and base64 data, or the success.export.background message); the file name is illu
- GET sales-register/download-vat-report-tax-wise: Success not called live: a large export is emailed. Success bodies follow the controller (FileResponse with type, name and base64 data, or the success.export.background message); the file name is illu
- GET sales-register/download-vat-report-account-wise: Success not called live: a large export is emailed. Success bodies follow the controller (FileResponse with type, name and base64 data, or the success.export.background message); the file name is illu
- GET sales-register/download-vat-report-account-wise: Success not called live: a large export is emailed. Success bodies follow the controller (FileResponse with type, name and base64 data, or the success.export.background message); the file name is illu
- POST custom-field/set-custom-fields: Success not called live because saving applies the fields to every existing customer and vendor account. Success body built from CompanyCustomFieldVersionResource (key, dataType, valueLength, uniqueNa
- POST e-commerce/send-email: Success not called live (sends an email). The old example fields email, verificationCode and retryCount are not used by this endpoint; the body is an EmailRequest.
- POST exception/generate-invoice-invalid-json: Not called live (posts to an external notification webhook). Internal client-diagnostics endpoint; success body is the literal OK per the controller.
- PUT purchase-bill/update-invoice-email: Setting an email was not called live because it sends a confirmation email; the success text comes from the backend message company.email.purchase.bill.confirmation.
- POST subscription/owner-ship-transfer: Not called live (sends email). Success message from the backend message bundle (subscription.ownership.transfer.mail).
- POST subscription/verify-owner-ship: Not called live (changes subscription ownership). Body is an optional plain-text rejection reason, used only with reject=true.
- POST subscription/also-it-add-plan-info-to-subscription-if-user-selects-plan-without-selecting-: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- GET subscription/cancel-subscription: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values. The 404 is the same lookup error returned live
- PATCH subscription/update-default-subscription-payment-info: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- DELETE subscription/delete-subscription-payment-info: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- GET subscription/save-stripe-payment-method: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST subscription/change-plan-of-subscription: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST subscription/buy-plan: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST subscription/update-subscription-after-payment: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST subscription/add-payment-method: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST subscription/add-wallet-amount: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values. Response keys depend on provider (orderId, pay
- POST subscription/capture-wallet-payment: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST subscription/create-pre-paid-of-subscription: Not called live: this endpoint moves money or changes a subscription/payment. Success example built from the backend response type with realistic values.
- POST gst/save-gstr1data: Not called live (files to the GST portal). Needs a company with active GSP credentials.
- GET gst/save-gstr1status: Not called live (queries the GST portal). Body is the portal's status JSON passed through; shown fields follow the GSTN return-status format (status_cd P=processed, PE=processed with error, IP=in prog
- POST gst/prepare: Not deployed on the test server (route returns 404), so not callable live. Success built from the backend response type.
- POST gst/finish: Not deployed on the test server (route returns 404), so not callable live. Success built from the backend response type.
- POST gst/prepare-dsc: Not deployed on the test server (route returns 404), so not callable live. Success built from the backend response type.
- POST gst/finish-dsc: Not deployed on the test server (route returns 404), so not callable live. Success built from the backend response type.
- POST permission/assign-role: Not called live (changes roles or user access). Sends an invitation email. Success built from the backend type and the live company users list shape.
- PUT permission/update-user-entity-role: Not called live (changes roles or user access). Success built from the backend type.
- DELETE permission/delete-user-entity-role: Not called live (changes roles or user access). Revoking your own role returns 412 NOT_PERMITTED (not reproduced).
- POST save-authorization-code/save-authorization-code: Not called live (UK MTD VAT / HMRC). Needs a UK VAT company and Super Admin role. Invalid codes return 406 INVALID_REQUEST with HMRC's message (not reproduced).
- POST banking/create-end-user-agreement-and-requisitions: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- DELETE banking/delete-bank-integration-details: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- POST banking/fetch-account-details: Not called live: this endpoint touches a bank-feed or bank-payment integration. Success fields follow the GoCardless requisition object returned by the backend.
- POST banking/bank-registration: Not called live: this endpoint touches a bank-feed or bank-payment integration. Only a company super admin can call it.
- PUT banking/update-details: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- DELETE banking/bank-de-registration: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- GET banking/get-all-registration: Called live: the test server answered with a plain 404 Not Found for this v1 route, so the success example is built from the backend. Use GET /v2/company/{companyUniqueName}/bank instead.
- GET banking/generate-otp: Not called live: it sends an OTP. Not called live: this endpoint touches a bank-feed or bank-payment integration.
- POST banking/bulk-payment: Not called live: it moves money. Not called live: this endpoint touches a bank-feed or bank-payment integration.
- POST banking/api-confirm-payment-with-otp-and-sent-to-bank-for-payment: Not called live: it moves money. Success body shape is approximate.
- GET banking/api-resent-otp-to-user: Not called live: it sends an OTP.
- GET banking/create-link-token: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- POST banking/set-access-token: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- POST banking/bank-registration-for-icici: Not called live: this endpoint touches a bank-feed or bank-payment integration. Super admin only.
- PUT banking/update-bank-details: Not called live: this endpoint touches a bank-feed or bank-payment integration. Super admin only.
- POST banking/in-once-icici-bank-account-integration---there-can-be-multiple-login-credenti-: Not called live: this endpoint touches a bank-feed or bank-payment integration. Super admin only.
- PUT banking/update-payor-details: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- GET banking/api-get-registration-status-of-the-integrated-bank-account-: Not called live: this endpoint touches a bank-feed or bank-payment integration.
- GET banking/get-payors-for-payment: Not called live: this endpoint touches a bank-feed or bank-payment integration. Payor item fields are approximate.
- POST banking/importpdf: Send the PDF as multipart field file. Success body is approximate; the import runs asynchronously. Not created live because it posts entries to a bank account.
- GET trigger/get-trigger: The test company has no MSG91 communication platform connected (connecting one needs a third-party auth key), so no communication trigger could be created; the success example is built from the backen
- PATCH trigger/update-patch: No request body: each call toggles the trigger. Returns "Trigger activated successfully." or "Trigger deactivated successfully.". The test company has no MSG91 communication platform connected (connec
- DELETE trigger/delete-trigger: The test company has no MSG91 communication platform connected (connecting one needs a third-party auth key), so no communication trigger could be created; the success example is built from the backen
- GET auth/verify-company-invoice-email: Success not run live: verification is completed from the link sent by email. Success message text not confirmed in code (previous docs showed the key success.email.verification).
- GET auth/login-with-number: Not called live (sends SMS). Success text from LoginService.loginWithNumber.
- POST auth/sign-up-with-email: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/generate-otp: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- PUT auth/reset-password: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/sign-up-with-google-v2: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/verify-email-v2: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/verify-mobile-v2: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/login-with-password: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/signup: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/api-to-support-signup-with-apple: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- POST auth/api-to-support-login-with-otp: Not called live: login, signup, OTP and password endpoints are excluded from live testing. Success shape follows earlier real login responses with session id and hashes redacted.
- GET auth/verify-company-invoice-email-1: Success not run live (email verification link flow). Success message text not confirmed in code.
- POST auth/generate-auth-key: Not called live: auth key generation, update and removal are excluded from live testing. Success shape built from RoleAuthController; key value redacted.
- PUT auth/update-auth-user: Not called live: auth key generation, update and removal are excluded from live testing. Success shape built from RoleAuthController; key value redacted.
- DELETE auth/remove-auth-key: Not called live: auth key generation, update and removal are excluded from live testing. Success shape built from RoleAuthController; key value redacted. Success message not confirmed in code.
- GET auth/unmask-auth-key: Success not called live: it reveals a secret key. Success shape built from RoleAuthController.unmaskAuthKey; field names uncertain.
- POST voucher/generate-invoice: Legacy (voucherVersion 1) route. On the v2 test company it returns 500 for valid entries, so success is from InvoiceController.generateInvoice. Use Bulk Generate Vouchers for v2 companies.
- POST voucher/cancel-einvoice: Not called live (government portal). Needs an e-invoice enabled company and an invoice with an IRN. Query cnlRsn (reason code) is required.
- PUT voucher/update-invoice-email: Not called live (changes company settings and sends email). Messages from CompanySettingsService.updateInvoiceEmail.
- POST voucher/generate-invoice-1: Legacy route; returns 500 on the v2 test company. Success from InvoiceV2Controller.generateInvoice.
- POST voucher/add-recurring-voucher: Legacy (voucherVersion 1) invoices only; companies on voucherVersion 2 should use Make Recurring Voucher V4. Success built from RecurringVoucherDetailsResource (status value uncertain).
- DELETE voucher/delete-recurring-voucher: No legacy recurring voucher could be created on the v2 test company; success from RecurringVoucherController.delete.
- PATCH voucher/update-recurring-voucher: Success built from RecurringVoucherDetailsResource.
- POST group/email-account-balance: Not sent live (it emails customers). Success from GroupV2Controller.emailAccountBalance.
- POST group/sms-account-balance: Not sent live (sends SMS). Success from GroupV2Controller.smsAccountBalance.
- POST purchase-register/create-purchase-register: The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could be created; success shapes are from PurchaseAccountContro
- GET purchase-register/use-to-get-purchase-record: The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could be created; success shapes are from PurchaseAccountContro
- PATCH purchase-register/update-purchase-register: The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could be created; success shapes are from PurchaseAccountContro
- GET purchase-register/download-file: The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could be created; success shapes are from PurchaseAccountContro
- POST purchase-register/mail-purchase-order: Not called live (sends email). Success text not confirmed in code. Error shown is from the GET of the same record. The test auth key has no BILL permission and the legacy create rejected bodies with '
- POST purchase-register/get-all-versions-of-a-particular-purchase-record-with-provided-purchase-recor-: Success shape follows the live voucher-versions response. The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could
- GET purchase-register/download-purchase-order-version-3: The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could be created; success shapes are from PurchaseAccountContro
- DELETE purchase-register/delete-purchase-record: The test auth key has no BILL permission and the legacy create rejected bodies with 'Entry date must be provided', so no purchase record could be created; success shapes are from PurchaseAccountContro
- POST images/set-company-image: Success not run live (changes the company logo). Shape from ImageResource; other fields may be present.

## No success example

- POST account/generate: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a voucher-version-1 co
- POST account/get-account: Legacy invoice API for companies on voucher version 1. On the test company (voucher version 2) the live success call failed as shown, so the success body is built from the backend handler; it needs a voucher-version-1 co
- GET customer-portal/customer-portal-proxy-helper-proxy_url-not-a-giddh-spring-controller-: Not a Giddh API endpoint: it is a helper on the customer-portal web app (PROXY_URL). Consider removing it from the public API docs.
- GET customer-portal/customer-portal-payment-list-uses-get-vouchers-type-receipt-backend-has-get-voucher-uniquename-and-post-vouchers-get-all-not-this-exact-route-: No GET handler exists for /portal/company/{c}/accounts/{a}/vouchers in the backend; the portal list uses POST .../vouchers/get-all. Consider removing this page.
- PUT user/forgot-password: Not called live: it sends a password-reset code to the user. On success the body is a message string from userService.forgotPassword; an unknown user returns 404 USER_NOT_FOUND ('User not found.') per code. No success bo
- POST vat/activate-prepaid-subscription: Not called (payments/subscriptions are out of bounds). Success returns the activated SubscriptionResource (subscription, plan and company details); its full shape was not verified, so no success example is given. Error m
- GET subscription/generate-order-for-subscription-payment: Not called live (creates a payment order). No success response is available; on success the body contains the Razorpay order.
- GET india-tax/get-vat-report: Needs a VAT company (UK/UAE etc.); the test company is Indian GST, so no success response is available.

## Not real API routes (recommend removing from the public docs)

- customer-portal/customer-portal-proxy-helper-… (a web-app proxy helper, 404 on the API)
- customer-portal/customer-portal-payment-list-… (no GET handler; the portal uses POST …/vouchers/get-all)
- voucher/patch-voucher-v4 documents `/vouchers/{voucherUniqueName}`; the real route is `PATCH /v4/company/{c}/vouchers` with `uniqueName` in the body

## Left on the test company

- Branch `giddhautomationapidoc1` (alias `apidoc-8-x`) created by a validation probe; no delete endpoint.
- GST unit mapping `a6kg→KGS`, two 1x1 PNG attachments, an OCR document request, import/reconciliation history entries.
- Due-days range for vendors reset to 30/60/90.

Per-endpoint data: `docstar-real-responses.json`. Publish with `_apply_real_responses.py`.
