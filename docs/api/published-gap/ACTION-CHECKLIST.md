# Published API Docs — Action Checklist

Update **119** published · Add **584** missing

## A. Update existing published

1. [ ] `POST` /account-apis/create-account → `POST /v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
   - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, emailList, tagNames, rowNum, mobileCode, importedAccountOpeningBalance, currentBranch, ledgerView, duePeriod (+1)
   - Review published-only fields: activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmount, closingBalanceTriggerAmountType (+4)
   - Set published path to real route: `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
2. [ ] `GET` /account-apis/get-account-balance → `GET /v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance`
   - Remove junk params (0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars (+10)
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance`
3. [ ] `PATCH` /account-apis/patch-account-api-v2 → `PATCH /v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
   - Remove junk params (Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: hsnNumber, sacNumber, email, name, accountOpeningBalances, uniqueName, currency, description, openingBalanceDate, isActive, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, company, attentionTo, mobileNo (+13)
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
4. [ ] `PUT` /account-apis/update-account-api-v2 → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, accounts, address, emailList, tagNames
   - Review published-only fields: activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, country, currency, closingBalanceTriggerAmountType, accountOpeningBalance, customFields (+2)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
5. [ ] `DELETE` /account-apis/delete-account-api → `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
6. [ ] `POST` /account-apis/create-group → `POST /company/{companyUniqueName}/groups`
   - Remove junk params (Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: applicableTaxesUniqueNames, tagNames, rowNum
   - Review published-only fields: name, uniqueName, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, parentGroupUniqueName, path
   - Set published path to real route: `/company/{companyUniqueName}/groups`
7. [ ] `DELETE` /account-apis/delete-group → `DELETE /company/{companyUniqueName}/groups/{groupUniqueName:.+}`
   - Remove junk params (0, 1)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Set published path to real route: `/company/{companyUniqueName}/groups/{groupUniqueName:.+}`
8. [ ] `PUT` /account-apis/update-group → `PUT /company/{companyUniqueName}/groups/{groupUniqueName:.+}`
   - Remove junk params (content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: applicableTaxesUniqueNames, tagNames, rowNum
   - Review published-only fields: name, uniqueName, closingBalanceTriggerAmount, closingBalanceTriggerAmountType
   - Set published path to real route: `/company/{companyUniqueName}/groups/{groupUniqueName:.+}`
9. [ ] `GET` /account-apis/update-group_copy → `GET /company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
   - Remove junk params (t, z, lang, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
   - Matched route is not used by current frontend
10. [ ] `POST` /entry-apis-v2/service/create-entry---with-tax-and-discount → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Add/update payload fields from backend: description, voucherDescription, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod, referenceId, sendToGstr2 (+14)
   - Review published-only fields: entryDate, chequeClearanceDate, tdsTcsTaxesSum, otherTaxesSum, otherTaxType
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
11. [ ] `PUT` /entry-apis-v2/service/update-entry → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
   - Remove junk params (t, z, lang, 0, 1, 2, Content-Type, content-type)
   - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, ewayBillDetails, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod, referenceId, sendToGstr2 (+14)
   - Review published-only fields: entryDate
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
12. [ ] `DELETE` /entry-apis-v2/service/delete-entry → `DELETE /v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
   - Remove junk params (t, z, lang)
   - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
   - Matched route is not used by current frontend
13. [ ] `GET` /entry-apis-v2/service/get-entry → `GET /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
   - Remove junk params (t, z, lang, 0, 1, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
14. [ ] `POST` /entry-apis-v2/service/advance-receipt-entry-with-gst-and-tds → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
   - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod (+16)
   - Review published-only fields: entryDate
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
15. [ ] `POST` /entry-apis-v2/service/advance-receipt-entry-with-tds → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
   - Remove junk params (lang, 0, 1, Content-Type)
   - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod (+16)
   - Review published-only fields: entryDate
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
16. [ ] `POST` /entry-apis-v2/service/advance-receipt-entry-with-gst → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
   - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod (+16)
   - Review published-only fields: entryDate
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
17. [ ] `POST` /entry-apis-v2/stock/create-entry → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
   - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: description, voucherDescription, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod, referenceId (+15)
   - Review published-only fields: entryDate, chequeClearanceDate, compoundTotal
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
18. [ ] `PUT` /entry-apis-v2/stock/update-entry → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
   - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: description, voucherDescription, voucherType, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson (+16)
   - Review published-only fields: total, particular, particularType, discounts, entryDate, chequeClearanceDate, taxes
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
19. [ ] `GET` /entry-apis-v2/stock/get-entry → `GET /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
   - Remove junk params (lang, Content-Type)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
20. [ ] `DELETE` /entry-apis-v2/stock/delete-entry → `DELETE /v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
   - Remove junk params (Content-Type)
   - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
   - Matched route is not used by current frontend
21. [ ] `DELETE` /entry-apis-v2/bulk-delete → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/bulk-ledgers-v2`
   - Remove junk params (t, z, lang, content-type)
   - Add/update payload fields from backend: description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName (+18)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/bulk-ledgers-v2`
22. [ ] `POST` /entry-apis-v2/attach-file → `POST /company/{companyUniqueName}/ledger/upload`
   - Remove junk params (lang, 0)
   - Set published path to real route: `/company/{companyUniqueName}/ledger/upload`
23. [ ] `POST` /voucher-apis-v2/service/create-voucher → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
   - Remove junk params (t, z, lang, 0, Content-Type, content-type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Review published-only fields: number, uniqueName, attachedFiles, attachedFileName, roundOffApplicable, updateAccountDetails, valuesInAccountCurrency, exchangeRate, dueDate, date, account, entries, warehouse, deposit
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
24. [ ] `PUT` /voucher-apis-v2/service/update-voucher → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Add/update payload fields from backend: entryUniqueNames, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, branch, salesPersonUniqueName, salesPerson
   - Review published-only fields: number, uniqueName, mergePB, passportNumber, subVoucher, attachedFiles, attachedFileName, templateDetails, status, referenceVoucher, valuesInAccountCurrency, exchangeRate, date, touristSchemeApplicable, company (+5)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
25. [ ] `DELETE` /voucher-apis-v2/service/delete-voucher → `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
   - Remove junk params (t, z, lang, 0, content-type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Review published-only fields: entryUniqueNames
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
26. [ ] `GET` /voucher-apis-v2/service/get-voucher → `GET /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
   - Remove junk params (lang, Content-Type, content-type)
   - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
27. [ ] `POST` /voucher-apis-v2/stock/create-voucher → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
   - Remove junk params (t, z, lang, 0, Content-Type, content-type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Review published-only fields: account, updateAccountDetails, entries, date, exchangeRate, dueDate, deposit, warehouse
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
28. [ ] `PUT` /voucher-apis-v2/stock/update-voucher → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Add/update payload fields from backend: entryUniqueNames, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, branch, salesPersonUniqueName, salesPerson
   - Review published-only fields: account, entries, date, exchangeRate, number, uniqueName, adjustments, warehouse
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
29. [ ] `GET` /voucher-apis-v2/stock/get-voucher → `GET /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
30. [ ] `DELETE` /voucher-apis-v2/stock/delete-voucher → `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
   - Remove junk params (lang, 0, Content-Type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Review published-only fields: uniqueName
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
31. [ ] `POST` /voucher-apis-v2/mail-voucher → `POST /v2/verify-email`
   - Remove junk params (lang, Content-Type, content-type)
   - Add/update payload fields from backend: email, verificationCode, retryCount
   - Set published path to real route: `/v2/verify-email`
32. [ ] `POST` /voucher-apis-v2/cancel-voucher → `POST /company/{companyUniqueName}/invoice/{invoiceUniqueName}/cancel-einvoice`
   - Remove junk params (lang, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/invoice/{invoiceUniqueName}/cancel-einvoice`
33. [ ] `POST` /voucher-apis-v2/paid-voucher → `POST /v2/subscription/add-payment-method`
   - Remove junk params (lang, Content-Type, content-type)
   - Add/update payload fields from backend: planUniqueName, balance, userUniqueName, expireDate, status, subscriptionId, duration, licenceKey, promoCode, addOnTransactions, paymentProvider, billingAccount, returnUrl, affiliateId, trialExtendedDays (+21)
   - Set published path to real route: `/v2/subscription/add-payment-method`
34. [ ] `POST` /voucher-apis-v2/get-all-vouchers → `POST /company/{companyUniqueName}/vouchers/get-all`
   - Remove junk params (lang, 0, content-type)
   - Add/update payload fields from backend: value, voucherCopyType, downloadCopyFileName, downloadCopyValue, downloadCopyTypeList, copyTypes, sendTo, voucherUniqueNames, balanceStatus, status, accountUniqueName, voucherNumber, proformaNumber, balanceDue, dueDate (+17)
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/get-all`
35. [ ] `POST` /voucher-apis-v2/bulk-delete-vouchers → `POST /company/{companyUniqueName}/vouchers/bulk-update`
   - Remove junk params (lang, 0, Content-Type, content-type)
   - Add/update payload fields from backend: voucherNumbers, voucherType, templateUniqueName, message1, message2, imageSignatureUniqueName, slogan, dueDate, shippingDetails, customField1, customField2, customField3
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/bulk-update`
36. [ ] `POST` /voucher-apis-v2/export-voucher → `POST /company/{companyUniqueName}/export-invoices-v2`
   - Remove junk params (lang, Content-Type, content-type)
   - Add/update payload fields from backend: type, noteVoucherType, fromDate, toDate, receiptType, source, attachmentExport, selectAllFields, voucherExport, fileNameFormat, showVoucherCustomFields, showAccountCustomFields, showBillingAddress, showShippingAddress, showTaxableValueBeforeDiscount (+53)
   - Set published path to real route: `/company/{companyUniqueName}/export-invoices-v2`
37. [ ] `POST` /voucher-apis-v2/generate-bulk-vouchers → `POST /company/{companyUniqueName}/vouchers/bulk-update`
   - Remove junk params (lang, Content-Type, content-type)
   - Add/update payload fields from backend: voucherNumbers, voucherType, templateUniqueName, message1, message2, imageSignatureUniqueName, slogan, dueDate, shippingDetails, customField1, customField2, customField3
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/bulk-update`
38. [ ] `POST` /proforma-apis/generate-proforma → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (0, 1, Content-Type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
39. [ ] `POST` /proforma-apis/get-proforma → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (0, 1, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
40. [ ] `DELETE` /proforma-apis/delete-proforma → `DELETE /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
   - Matched route is not used by current frontend
41. [ ] `POST` /proforma-apis/mail-proforma → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
42. [ ] `POST` /proforma-apis/get-all-proformas → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (Content-Type, content-type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
43. [ ] `PUT` /proforma-apis/update-proforma → `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
   - Remove junk params (0, 1, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
   - Matched route is not used by current frontend
44. [ ] `POST` /proforma-apis/generate-invoice-from-proforma → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (0, 1, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
45. [ ] `PUT` /proforma-apis/update-action-over-proforma → `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
   - Remove junk params (Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
   - Matched route is not used by current frontend
46. [ ] `POST` /proforma-apis/get-all-proforma-version → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (Content-Type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
47. [ ] `POST` /proforma-apis/get-all-proforma-versions-v2-api → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
48. [ ] `POST` /estimation-apis/generate-estimate → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (Content-Type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
49. [ ] `POST` /estimation-apis/get-estimate → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
50. [ ] `PUT` /estimation-apis/update-estimate → `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
   - Matched route is not used by current frontend
51. [ ] `DELETE` /estimation-apis/delete-estimate → `DELETE /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
   - Matched route is not used by current frontend
52. [ ] `POST` /estimation-apis/mail-estimate → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
53. [ ] `POST` /estimation-apis/get-all-estimates → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (0, Content-Type)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
54. [ ] `POST` /estimation-apis/generate-invoice-from-estimate → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
55. [ ] `POST` /estimation-apis/get-all-estimate-version → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
56. [ ] `PUT` /estimation-apis/update-action-over-estimate → `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
   - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
   - Matched route is not used by current frontend
57. [ ] `POST` /estimation-apis/get-estimate-version → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
58. [ ] `POST` /estimation-apis/generate-proforma-from-estimate → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
59. [ ] `POST` /estimation-apis/get-all-estimates-version-v2-api → `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
   - Remove junk params (0, 1, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
   - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
60. [ ] `POST` /tax-apis/asssign-tax → `POST /company/{companyUniqueName}/tax`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: taxNumber, name, accounts, taxDetail, duration, taxFileDate, taxType, isInputGst, isTallySync, countries, taxAuthorityRequest
   - Set published path to real route: `/company/{companyUniqueName}/tax`
61. [ ] `POST` /tax-apis/create-tax → `POST /company/{companyUniqueName}/tax`
   - Remove junk params (0, Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: taxNumber, name, accounts, taxDetail, duration, taxFileDate, taxType, isInputGst, isTallySync, countries, taxAuthorityRequest
   - Set published path to real route: `/company/{companyUniqueName}/tax`
62. [ ] `GET` /tax-apis/get-all-tax → `GET /ui/taxes`
   - Remove junk params (0)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Set published path to real route: `/ui/taxes`
63. [ ] `POST` /tax-apis/create-stock-group-and-assign-tax → `POST /company/{companyUniqueName}/stock-group`
   - Remove junk params (Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: taxes, discounts
   - Set published path to real route: `/company/{companyUniqueName}/stock-group`
64. [ ] `POST` /tax-apis/create-stock-and-assign-tax → `POST /v2/company/{companyUniqueName}/stock`
   - Remove junk params (0, Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Add/update payload fields from backend: search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters
   - Set published path to real route: `/v2/company/{companyUniqueName}/stock`
65. [ ] `GET` /report-apis/purchases-register-api/purchases-register-overview → `GET /v2/company/{companyUniqueName}/purchases-register-overview`
   - Set published path to real route: `/v2/company/{companyUniqueName}/purchases-register-overview`
66. [ ] `GET` /report-apis/purchases-register-api/purchases-register-detailed → `GET /v2/company/{companyUniqueName}/purchases-register-overview`
   - Set published path to real route: `/v2/company/{companyUniqueName}/purchases-register-overview`
67. [ ] `GET` /report-apis/sales-register-api/sales-register-overview → `GET /v2/company/{companyUniqueName}/sales-register-overview`
   - Set published path to real route: `/v2/company/{companyUniqueName}/sales-register-overview`
68. [ ] `GET` /report-apis/sales-register-api/sales-register-detailed → `GET /v2/company/{companyUniqueName}/sales-register-overview`
   - Set published path to real route: `/v2/company/{companyUniqueName}/sales-register-overview`
69. [ ] `GET` /report-apis/trial-balance-api → `GET /company/{companyUniqueName}/trial-balance-export-v2`
   - Set published path to real route: `/company/{companyUniqueName}/trial-balance-export-v2`
70. [ ] `GET` /report-apis/balance-sheet-api → `GET /v2/company/{companyUniqueName}/multibranch/balance-sheet`
   - Set published path to real route: `/v2/company/{companyUniqueName}/multibranch/balance-sheet`
71. [ ] `GET` /report-apis/export-invoice-api → `GET /company/{companyUniqueName}/export-invoices`
   - Add/update payload fields from backend: value, voucherCopyType, downloadCopyFileName, downloadCopyValue, downloadCopyTypeList, copyTypes, sendTo, voucherUniqueNames, balanceStatus, status, accountUniqueName, voucherNumber, proformaNumber, balanceDue, dueDate (+17)
   - Set published path to real route: `/company/{companyUniqueName}/export-invoices`
   - Matched route is not used by current frontend
72. [ ] `GET` /report-apis/customer-vendor-report-api → `GET /company/{companyUniqueName}/customer-vendor-discount/get-all-users`
   - Remove junk params (Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/customer-vendor-discount/get-all-users`
73. [ ] `POST` /report-apis/aging-report-api → `POST /v2/company/{companyUniqueName}/stock-aging-report`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: branchUniqueNames, warehouseUniqueNames, stockGroupUniqueNames, categoryUniqueNames, variantUniqueNames, asOnDate, page, count, sort, sortBy, searchText, refresh, interval
   - Set published path to real route: `/v2/company/{companyUniqueName}/stock-aging-report`
74. [ ] `POST` /report-apis/daybook-report-api → `POST /company/{companyUniqueName}/daybook`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars (+10)
   - Set published path to real route: `/company/{companyUniqueName}/daybook`
75. [ ] `POST` /inventory-apis-v2/stock-group/create-group → `POST /company/{companyUniqueName}/stock-group`
   - Remove junk params (lang, 0, Content-Type, content-type)
   - Add/update payload fields from backend: taxes, discounts
   - Set published path to real route: `/company/{companyUniqueName}/stock-group`
76. [ ] `PUT` /inventory-apis-v2/stock-group/update-group-api → `PUT /company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
   - Remove junk params (lang, 0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: taxes, discounts
   - Set published path to real route: `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
77. [ ] `GET` /inventory-apis-v2/stock-group/get-group-api → `GET /company/{companyUniqueName}/stock-groups-with-stocks`
   - Remove junk params (lang, 0, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/stock-groups-with-stocks`
78. [ ] `DELETE` /inventory-apis-v2/stock-group/delete-group-api → `DELETE /company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
   - Remove junk params (lang, 0, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
79. [ ] `POST` /inventory-apis-v2/stocks/create-stock → `POST /company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock`
   - Remove junk params (lang, 0, 1, content-type)
   - Add/update payload fields from backend: taxes, updateBranchCompStocks, rowNum, requestId
   - Set published path to real route: `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock`
80. [ ] `PUT` /inventory-apis-v2/stocks/update-stock → `PUT /v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
   - Remove junk params (lang, 0, 1, Content-Type, content-type)
   - Add/update payload fields from backend: taxes, discounts, updateBranchCompStocks, rowNum, requestId
   - Set published path to real route: `/v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
81. [ ] `GET` /inventory-apis-v2/stocks/get-stock → `GET /stock-units`
   - Remove junk params (lang, 0, Content-Type, content-type)
   - Set published path to real route: `/stock-units`
82. [ ] `DELETE` /inventory-apis-v2/stocks/delete-stock → `DELETE /v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
   - Remove junk params (lang, 0, 1, Content-Type, content-type)
   - Set published path to real route: `/v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
83. [ ] `POST` /inventory-apis-v2/stocks/get-all-stocks → `POST /company/{companyUniqueName}/sync-data/stocks`
   - Remove junk params (lang, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/sync-data/stocks`
   - Matched route is not used by current frontend
84. [ ] `POST` /inventory-apis-v2/inventory-report/group-wise-report → `POST /v2/company/{companyUniqueName}/stock`
   - Remove junk params (lang, Content-Type, content-type)
   - Add/update payload fields from backend: search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters
   - Set published path to real route: `/v2/company/{companyUniqueName}/stock`
85. [ ] `POST` /inventory-apis-v2/inventory-report/item-wise-report-api → `POST /v2/company/{companyUniqueName}/stock`
   - Remove junk params (lang, Content-Type, content-type)
   - Add/update payload fields from backend: search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters
   - Set published path to real route: `/v2/company/{companyUniqueName}/stock`
86. [ ] `POST` /inventory-apis-v2/inventory-report/variant-report-api → `POST /company/{companyUniqueName}/inventory-users`
   - Remove junk params (lang, 0, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/inventory-users`
87. [ ] `POST` /inventory-apis-v2/inventory-report/transaction-report-api → `POST /company/{companyUniqueName}/inventory-users`
   - Remove junk params (lang, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/inventory-users`
88. [ ] `POST` /inventory-apis-v2/inventory-report/balance-api- → `POST /company/{companyUniqueName}/inventory-users`
   - Remove junk params (lang, Content-Type, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/inventory-users`
89. [ ] `GET` /dashboard-apis/profit-loss → `GET /v2/company/{companyUniqueName}/multibranch/profit-loss`
   - Remove junk params (t, z, lang, Content-Type, content-type)
   - Set published path to real route: `/v2/company/{companyUniqueName}/multibranch/profit-loss`
90. [ ] `POST` /dashboard-apis/voucher-count-api- → `POST /company/{companyUniqueName}/discount`
   - Remove junk params (lang, 0, content-type)
   - Add/update payload fields from backend: name, type, discountValue, accountUniqueName, variantDiscount, price, quantity, taxInclusive, discountExclusive, stockUnitUniqueName, variantUniqueName, discounts, type, value, uniqueName
   - Set published path to real route: `/company/{companyUniqueName}/discount`
91. [ ] `POST` /dashboard-apis/voucher-balance-api → `POST /company/{companyUniqueName}/inventory/balance`
   - Remove junk params (lang, 0, content-type)
   - Add/update payload fields from backend: expression, param, val, accountName, voucherTypes, branchUniqueNames, warehouseUniqueNames, variantUniqueNames, batchUniqueNames, batchNumbers, stockUniqueNames, stockGroupUniqueNames, inventoryType, inventoryAdjustmentRefNo, archived (+1)
   - Set published path to real route: `/company/{companyUniqueName}/inventory/balance`
92. [ ] `POST` /petty-cash-manager-api-s/create-petty-cash-entry → `POST /company/{companyUniqueName}/pettycash-manager/report`
   - Remove junk params (Content-Type, content-type)
   - Add/update payload fields from backend: statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
   - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/report`
93. [ ] `POST` /petty-cash-manager-api-s/petty-cash-entry-action-api → `POST /company/{companyUniqueName}/pettycash-manager/report`
   - Remove junk params (t, z, lang, content-type)
   - Add/update payload fields from backend: statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
   - Review published-only fields: ledgerRequest
   - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/report`
94. [ ] `GET` /petty-cash-manager-api-s/get-pettycash-entry-api → `GET /company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`
95. [ ] `POST` /petty-cash-manager-api-s/get-all-petty-cash-entry-grid-view-for-admin → `POST /company/{companyUniqueName}/pettycash-manager/report`
   - Remove junk params (0, Content-Type)
   - Add/update payload fields from backend: statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
   - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/report`
96. [ ] `GET` /petty-cash-manager-api-s/client-get-all-petty-cash-entries → `GET /company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`
   - Remove junk params (0, Content-Type)
   - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`
97. [ ] `GET` /vat-apis/view-vat-report → `GET /v2/subscription/{subscriptionId}/activate`
   - Set published path to real route: `/v2/subscription/{subscriptionId}/activate`
98. [ ] `GET` /vat-apis/download-vat-report → `GET /v2/subscription/{subscriptionId}/activate`
   - Set published path to real route: `/v2/subscription/{subscriptionId}/activate`
99. [ ] `POST` /account-balances-report-apis/monthly-columnar-report-for-api → `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/columnar-report`
   - Remove junk params (0)
   - Add/update payload fields from backend: groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars (+10)
   - Review published-only fields: financialYear, showHideOpeningClosingBalance
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/columnar-report`
100. [ ] `POST` /account-balances-report-apis/monthly-columnar-report-for-api_copy → `POST /company/{companyUniqueName}/export-invoices-v2`
   - Remove junk params (t, z, lang, content-type)
   - Add/update payload fields from backend: type, noteVoucherType, fromDate, toDate, receiptType, source, attachmentExport, selectAllFields, voucherExport, fileNameFormat, showVoucherCustomFields, showAccountCustomFields, showBillingAddress, showShippingAddress, showTaxableValueBeforeDiscount (+53)
   - Review published-only fields: subject, message, accounts
   - Set published path to real route: `/company/{companyUniqueName}/export-invoices-v2`
101. [ ] `POST` /export-apis/ledger-export---excel → `POST /company/{companyUniqueName}/ledgers`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: accountUniqueName, particularUniqueName, description, entryTotal, totalIsEqual, totalIsLess, totalIsMore, entryDate, dateIsEqual, dateIsBefore, dateIsAfter
   - Set published path to real route: `/company/{companyUniqueName}/ledgers`
102. [ ] `GET` /export-apis/view-export-requests → `GET /company/{companyUniqueName}/export-settings`
   - Remove junk params (Content-Type)
   - Set published path to real route: `/company/{companyUniqueName}/export-settings`
103. [ ] `GET` /export-apis/bill-to-bill-export-api → `GET /company/{companyUniqueName}/export-settings`
   - Remove junk params (lang, 0, 1, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/export-settings`
104. [ ] `POST` /permission-apis/assign-role → `POST /company/{companyUniqueName}/role`
   - Remove junk params (Content-Type, content-type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Set published path to real route: `/company/{companyUniqueName}/role`
105. [ ] `POST` /audit-trail/activity-log → `POST /v2/company/{companyUniqueName}/activity-logs`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: entity, operation, fromDate, toDate, entryFromDate, entryToDate, voucherFromDate, voucherToDate, page, count, sort, version, entityId, accountUniqueNames, groupUniqueNames (+14)
   - Set published path to real route: `/v2/company/{companyUniqueName}/activity-logs`
106. [ ] `POST` /purchase-order/service/create-purchase-order → `POST /company/{companyUniqueName}/purchase-order/get-all`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount (+13)
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/get-all`
107. [ ] `PUT` /purchase-order/service/update-purchase-order → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: version, number, type, date, dueDate, uniqueName, balanceTotal, status, company, account, entries, grandTotal, subTotal, taxTotal, discountTotal (+19)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
108. [ ] `POST` /purchase-order/stock/create-purchase-order → `POST /company/{companyUniqueName}/purchase-order/get-all`
   - Remove junk params (lang, 0, 1, content-type)
   - Add/update payload fields from backend: purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount (+13)
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/get-all`
   - Add response examples
109. [ ] `PUT` /purchase-order/stock/update-purchase-order → `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
   - Remove junk params (lang, 0, 1, content-type)
   - Add/update payload fields from backend: version, number, type, date, dueDate, uniqueName, balanceTotal, status, company, account, entries, grandTotal, subTotal, taxTotal, discountTotal (+19)
   - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
   - Add response examples
110. [ ] `POST` /purchase-order/get-all-purchase-orders → `POST /company/{companyUniqueName}/purchase-order/get-all`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount (+13)
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/get-all`
111. [ ] `GET` /purchase-order/get-purchase-order → `GET /company/{companyUniqueName}/purchase-order/preview`
   - Remove junk params (lang, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/preview`
112. [ ] `DELETE` /purchase-order/delete-purchase-order → `DELETE /company/{companyUniqueName}/purchase-order`
   - Remove junk params (lang, 0, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order`
113. [ ] `PATCH` /purchase-order/bulk-purchase-orders → `PATCH /company/{companyUniqueName}/purchase-order/bulk-update`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/bulk-update`
114. [ ] `PATCH` /purchase-order/convert-to-purchase-bill → `PATCH /company/{companyUniqueName}/purchase-order/bulk-update`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/bulk-update`
115. [ ] `PATCH` /purchase-order/cancel-purchase-order → `PATCH /company/{companyUniqueName}/purchase-order/bulk-update`
   - Remove junk params (lang, content-type)
   - Add/update payload fields from backend: purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders
   - Set published path to real route: `/company/{companyUniqueName}/purchase-order/bulk-update`
116. [ ] `GET` /branch-apis/get-all-branches → `GET /company/{companyUniqueName}/branch`
   - Remove junk params (Content-Type)
   - Add real path/query params to OpenAPI (currently missing or only in markdown)
   - Set published path to real route: `/company/{companyUniqueName}/branch`
117. [ ] `GET` /customer-api/untitled → `GET /company/{companyUniqueName}/brief-accounts`
   - Remove junk params (t, z, lang, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/brief-accounts`
118. [ ] `POST` /customer-api/get-all-customers_copy → `POST /v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
   - Remove junk params (t, z, lang, content-type)
   - Add/update payload fields from backend: applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, emailList, tagNames, rowNum, mobileCode, importedAccountOpeningBalance, currentBranch, ledgerView, duePeriod (+1)
   - Review published-only fields: activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmount, closingBalanceTriggerAmountType (+4)
   - Set published path to real route: `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
119. [ ] `GET` /customer-api/create-customer_copy → `GET /company/{companyUniqueName}/top-shared-groups`
   - Remove junk params (t, z, lang, content-type)
   - Set published path to real route: `/company/{companyUniqueName}/top-shared-groups`

## B. Add missing

### 01-auth-login
- [ ] `DELETE` `/company/{companyUniqueName}/auth/{authUniqueName}/remove` (RoleAuthController#removeAuthKey)
- [ ] `PUT` `/company/{companyUniqueName}/auth/{authUniqueName}/update` (RoleAuthController#updateAuthUser)
- [ ] `GET` `/company/{companyUniqueName}/auth/{authUniqueName}` (RoleAuthController#unmaskAuthKey)
- [ ] `GET` `/company/{companyUniqueName}/auth/all` (RoleAuthController#getAllAuthKeys)
- [ ] `POST` `/company/{companyUniqueName}/auth/generate` (RoleAuthController#generateAuthKey)
- [ ] `GET` `/company/{companyUniqueName}/authorize` (OAuthController#getMTDPortalAuthorizeUrl)
- [ ] `GET` `/company/{companyUniqueName}/bank/generateotp` (ICICIBankController#generateOTP)
- [ ] `POST` `/company/{companyUniqueName}/bank/payments/confirm` (ICICIBankController#bulkPaymentConfirm)
- [ ] `GET` `/company/{companyUniqueName}/bank/resend-otp` (ICICIBankController#resendOTP)
- [ ] `POST` `/company/{companyUniqueName}/communication/platform/verify` (CommunicationController#verifyAuthKey)
- [ ] `POST` `/company/{companyUniqueName}/ecommerce/verify/{ecommerceUniqueName}` (EcommerceController#verifyEcommerceAccountStatus)
- [ ] `POST` `/company/{companyUniqueName}/ewb/user` (EWayBillController#authenticateUser)
- [ ] `GET` `/company/{companyUniqueName}/invoice-setting/verify-email` (InvoiceSettingController#verifyCompanyInvoiceEmail)
- [ ] `GET` `/company/{companyUniqueName}/payment/banks/accounts` (CompanyController#getPaymentBankAccounts)
- [ ] `GET` `/company/{companyUniqueName}/purchase-bill-setting/verify-email` (PurchaseBillSettingController#verifyCompanyInvoiceEmail)
- [ ] `POST` `/company/{companyUniqueName}/save-authorization-code` (OAuthController#saveAuthorizationCode)
- [ ] `DELETE` `/company/{companyUniqueName}/tax/authority/{taxAuthorityUniqueName}` (TaxController#deleteTaxAuthority)
- [ ] `PATCH` `/company/{companyUniqueName}/tax/authority/{taxAuthorityUniqueName}` (TaxController#updateTaxAuthority)
- [ ] `GET` `/company/{companyUniqueName}/tax/authority` (TaxController#getAllTaxAuthority)
- [ ] `POST` `/company/{companyUniqueName}/tax/authority` (TaxController#createTaxAuthority)
- [ ] `GET` `/company/{companyUniqueName}/us/export-sales-report-authority-wise` (USVatReturnController#downloadVatReportTaxAuthorityWise)
- [ ] `GET` `/company/{companyUniqueName}/us/sales-report-authority-wise` (USVatReturnController#getVatReportTaxAuthorityWise)
- [ ] `POST` `/generate-otp` (LoginController#generateOtp)
- [ ] `GET` `/login-with-number` (LoginController#loginWithNumber)
- [ ] `PUT` `/reset-password` (LoginController#resetPassword)
- [ ] `POST` `/signup-with-email` (LoginController#signUpWithEmail)
- [ ] `PUT` `/users/{uniqueKey}/forgot-password` (UserController#forgotPassword)
- [ ] `PUT` `/users/{uniqueName}/generate-auth-key` (UserController#generateAuthKey)
- [ ] `DELETE` `/users/{userUniqueName}/destroy-session` (UserController#destroyUserSession)
- [ ] `POST` `/users/{userUniqueName}/destroy-session` (UserController#destroyUserSession2)
- [ ] `GET` `/users/{userUniqueName}/get-auth-key` (UserController#generateAuthKeyV2)
- [ ] `PUT` `/users/{userUniqueName}/increment-session` (UserController#incrementUserSession)
- [ ] `DELETE` `/users/{userUniqueName}/sessions` (UserController#deleteAllSessions)
- [ ] `GET` `/users/{userUniqueName}/sessions` (UserController#getAllSessions)
- [ ] `POST` `/v2/auth-login` (LoginV2Controller#authLogin)
- [ ] `POST` `/v2/company/{companyUniqueName}/authenticate-gsp-session` (GstReturnV2Controller#authenticateGspSession)
- [ ] `POST` `/v2/company/{companyUniqueName}/bank/multi-registration` (ICICIBankControllerV2#addNewCorporateRegistration)
- [ ] `POST` `/v2/company/{companyUniqueName}/gsp-session` (GstReturnV2Controller#createGspSession)
- [ ] `POST` `/v2/company/{companyUniqueName}/purchases-register-detailed` (ReportV2Controller#getPurchasesRegisterDetailed)
- [ ] `POST` `/v2/company/{companyUniqueName}/sales-register-detailed` (ReportV2Controller#createSalesRegisterDetailed)
- [ ] `GET` `/v2/company/{companyUniqueName}/session` (GstReturnV2Controller#getSession)
- [ ] `POST` `/v2/company/{companyUniqueName}/v2/purchases-register-overview` (ReportV2Controller#getPurchasesRegisterOverview2)
- [ ] `POST` `/v2/company/{companyUniqueName}/v2/sales-register-overview` (ReportV2Controller#getSalesRegisterOverviewV2)
- [ ] `POST` `/v2/login-with-password` (LoginV2Controller#loginWithPassword)
- [ ] `POST` `/v2/signup-with-apple` (LoginV2Controller#signUpWithApple)
- [ ] `POST` `/v2/signup-with-google` (LoginV2Controller#signUpWithGoogleV2)
- [ ] `POST` `/v2/signup` (LoginV2Controller#signup)
- [ ] `GET` `/v2/user` (LoginV2Controller#getUser)
- [ ] `POST` `/v2/verify-number` (LoginV2Controller#verifyMobileV2)

### 02-company-branches
- [ ] `PATCH` `/company/{companyUniqueName:.+}/plan` (CompanyController#updateCompanyPlan)
- [ ] `GET` `/company/{companyUniqueName:.+}` (CompanyController#getCompany)
- [ ] `PATCH` `/company/{companyUniqueName:.+}` (CompanyController#updateCompanyV2)
- [ ] `PUT` `/company/{companyUniqueName:.+}` (CompanyController#updateCompany)
- [ ] `GET` `/company/{companyUniqueName}/branch/{branchUniqueName:.+}` (BranchController#getBranch)
- [ ] `PATCH` `/company/{companyUniqueName}/branch/{branchUniqueName:.+}` (BranchController#updateBranchV2)
- [ ] `PUT` `/company/{companyUniqueName}/branch/{branchUniqueName:.+}` (BranchController#updateBranch)
- [ ] `POST` `/company/{companyUniqueName}/branch` (BranchController#createBranch)
- [ ] `GET` `/company/{companyUniqueName}/cmdk` (CompanyController#cmdKSearch)
- [ ] `GET` `/company/{companyUniqueName}/custom-fields` (CompanyController#getCustomFields)
- [ ] `POST` `/company/{companyUniqueName}/custom-fields` (CompanyController#setCustomFields)
- [ ] `POST` `/company/{companyUniqueName}/due-amount-report` (CompanyController#getDebtorDueAmountReport)
- [ ] `GET` `/company/{companyUniqueName}/due-days-range` (CompanyController#getDueAmountRange)
- [ ] `POST` `/company/{companyUniqueName}/due-days-range` (CompanyController#addDueAmountRange)
- [ ] `GET` `/company/{companyUniqueName}/email-key` (CompanyController#getEmailVerificationKey)
- [ ] `POST` `/company/{companyUniqueName}/email-key` (CompanyController#emailVerificationKey)
- [ ] `GET` `/company/{companyUniqueName}/export-settings/daybook-v2` (CompanyController#getDaybookExportV3WithExportSettings)
- [ ] `POST` `/company/{companyUniqueName}/export-settings/daybook-v2` (CompanyController#getDaybookExportV3WithExportSettings)
- [ ] `GET` `/company/{companyUniqueName}/financial-year-limits` (FinancialYearController#financialYearLimits)
- [ ] `PATCH` `/company/{companyUniqueName}/financial-year-lock` (FinancialYearController#lockFinancialYear)
- [ ] `PATCH` `/company/{companyUniqueName}/financial-year-unlock` (FinancialYearController#unlockFinancialYear)
- [ ] `GET` `/company/{companyUniqueName}/financial-year` (FinancialYearController#getFinancialYear)
- [ ] `POST` `/company/{companyUniqueName}/financial-year` (FinancialYearController#createFinancialYear)
- [ ] `PUT` `/company/{companyUniqueName}/financial-year` (FinancialYearController#updateFinancialYear)
- [ ] `GET` `/company/{companyUniqueName}/flatten-accounts` (CompanyController#getFlattenAccounts)
- [ ] `GET` `/company/{companyUniqueName}/flatten-stock-groups-with-stocks` (CompanyController#getFlattenStockGroupsWithStocks)
- [ ] `POST` `/company/{companyUniqueName}/forecast` (CompanyController#foreCastData)
- [ ] `POST` `/company/{companyUniqueName}/future-financial-year` (FinancialYearController#createFutureFinancialYear)
- [ ] `GET` `/company/{companyUniqueName}/groups-with-accounts` (CompanyController#getGroupsWithAccountsNew)
- [ ] `GET` `/company/{companyUniqueName}/hierarchical-stock-groups` (CompanyController#getAllHierarchicalStockGroups)
- [ ] `POST` `/company/{companyUniqueName}/inventory-report` (CompanyController#inventoryReport)
- [ ] `GET` `/company/{companyUniqueName}/linked-sources` (CompanyController#getLinkedSources)
- [ ] `POST` `/company/{companyUniqueName}/logs` (CompanyController#getCompanyLogs)
- [ ] `GET` `/company/{companyUniqueName}/new-old-sales/details` (CompanyController#getDetailedSalesList)
- [ ] `GET` `/company/{companyUniqueName}/new-old-sales` (CompanyController#getNewOldSalesData)
- [ ] `POST` `/company/{companyUniqueName}/new-old-sales` (CompanyController#getNewOldSalesData)
- [ ] `GET` `/company/{companyUniqueName}/purchase-order/{uniqueName}` (PurchaseOrderCompanyController#get)
- [ ] `POST` `/company/{companyUniqueName}/purchase-record/get-all` (PurchaseCompanyController#getPurchaseRecords)
- [ ] `DELETE` `/company/{companyUniqueName}/purchase-record` (PurchaseCompanyController#deletePurchaseRecord)
- [ ] `GET` `/company/{companyUniqueName}/shared-with` (CompanyController#getSharedList)
- [ ] `GET` `/company/{companyUniqueName}/sms-key` (CompanyController#getSmsVerificationKey)
- [ ] `POST` `/company/{companyUniqueName}/sms-key` (CompanyController#smsVerificationKey)
- [ ] `GET` `/company/{companyUniqueName}/sources` (CompanyController#getSources)
- [ ] `GET` `/company/{companyUniqueName}/stocks-manufacture` (CompanyController#getAllManufacturedStocks)
- [ ] `GET` `/company/{companyUniqueName}/stocks/v2` (CompanyController#getAllStocksV2)
- [ ] `GET` `/company/{companyUniqueName}/stocks` (CompanyController#getAllStocks)
- [ ] `GET` `/company/{companyUniqueName}/tax-numbers` (CompanyController#getAllTaxNumbers)
- [ ] `GET` `/company/{companyUniqueName}/ui_side_bar_items` (CompanyController#uiSideBarMenuItems)
- [ ] `GET` `/company/{companyUniqueName}/users` (CompanyController#getUsers)
- [ ] `PATCH` `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}/default` (WarehouseController#setDefaultWarehouse)
- [ ] `GET` `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}` (WarehouseController#getWarehouse)
- [ ] `PATCH` `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}` (WarehouseController#updateWarehouseV2)
- [ ] `PUT` `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}` (WarehouseController#updateWarehouse)
- [ ] `GET` `/company/{companyUniqueName}/warehouse` (WarehouseController#getAllWarehouses)
- [ ] `POST` `/company/{companyUniqueName}/warehouse` (WarehouseController#createWarehouse)
- [ ] `POST` `/company` (CompanyController#create)

### 03-accounts-groups
- [ ] `GET` `/company/{companyUniqueName}/account-search-2` (SearchController#accountSearch2)
- [ ] `POST` `/company/{companyUniqueName}/account-search-predicted` (SearchController#accountSearchPredicted)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/contacts` (AccountController#getCustomerVendorContact)
- [ ] `PUT` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/contacts` (AccountController#addAndUpdateCustomerVendorContact)
- [ ] `DELETE` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/entries/{entryUniqueName:.+}` (EntryV1Controller#deleteEntry)
- [ ] `DELETE` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/entries` (EntryV1Controller#deleteMultipleEntries)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/export-account-statement` (LedgerControllerV2#exportAccountStatement)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/reconcile` (LedgerControllerV2#retrieveAllPendingTransactions)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/view-statement` (LedgerControllerV2#viewStatement)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/view-statement` (LedgerControllerV2#accountStatementWithAdvanceSearch)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/merge` (LedgerController#retrieveLedgers)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/transactions` (LedgerController#retrieveAllLedgerTransactions)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/magic-link` (AccountController#generateMagicLink)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/mail-ledger` (ImportExportController#mailLedgerAll)
- [ ] `PUT` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/merge` (AccountController#mergeAccount)
- [ ] `PUT` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/move` (AccountController#moveAccount)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/shared-with` (AccountController#getSharedList)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/tax-hierarchy` (AccountController#getTaxesAccountHierarchy)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/un-merge` (AccountController#unmergeAccount)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/v2/export-ledger-with-invoice/file` (ImportExportController#exportLedgerAndInvoiceDownloadFile)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/v3/export-ledger/file` (ImportExportController#exportLedgerDownloadFileV3)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}` (AccountController#getActiveAccount)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/autopaid` (AutoPaidController#autoAdjustVouchers)
- [ ] `DELETE` `/company/{companyUniqueName}/accounts/{accountUniqueName}/entries/{entryUniqueName:.+}` (LedgerController#delete)
- [ ] `DELETE` `/company/{companyUniqueName}/accounts/{accountUniqueName}/entries` (LedgerController#deleteMultiple)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/giddh-ledger` (EntryController#getGiddhLedger)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/generate` (InvoiceController#generateInvoice)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/project-entries` (EntryController#getProjectEntries)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/{uniqueName}/download` (PurchaseOrderAccountController#download)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/{uniqueName}/mail` (PurchaseOrderAccountController#mailPurchaseOrder)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/generate` (PurchaseOrderAccountController#create)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/pending-numbers` (PurchaseOrderAccountController#getPendingPurchaseNumbers)
- [ ] `PATCH` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/status/change` (PurchaseOrderAccountController#changeStatus)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/versions/all` (PurchaseOrderAccountController#getPOVersions)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}/download` (PurchaseAccountController#download)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}/mail` (PurchaseAccountController#mailPurchaseOrder)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}` (PurchaseAccountController#get)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/download-file` (PurchaseAccountController#downloadFile)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/generate` (PurchaseAccountController#create)
- [ ] `GET` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/validate` (PurchaseAccountController#validate)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/versions/all` (PurchaseAccountController#getPRVersions)
- [ ] `PATCH` `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record` (PurchaseAccountController#update)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/{voucherNumber}/magic-link` (VoucherController#generateMagicLink)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bulk-export` (VoucherController#bulkExport)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/cancel-einvoice` (VoucherController#cancelEInvoice)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/download-file` (VoucherController#download)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` (VoucherController#generate)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/mail` (VoucherController#mailInvoice)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/mail` (VoucherController#mail)
- [ ] `POST` `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/preview` (VoucherController#getInvoicePreview)
- [ ] `DELETE` `/company/{companyUniqueName}/bank/accounts/{accountUniqueName:.+}/transactions` (ICICIBankController#deleteEntries)
- [ ] `POST` `/company/{companyUniqueName}/discount/assign-v2` (DiscountController#assignDiscountV2)
- [ ] `GET` `/company/{companyUniqueName}/gocardless/refresh` (GoCardlessBankIntegrationController#fetchAccountTransactionsOnRefresh)
- [ ] `POST` `/company/{companyUniqueName}/gocardless/requisitions/{reference}` (GoCardlessBankIntegrationController#fetchAccountDetails)
- [ ] `GET` `/company/{companyUniqueName}/group-search` (SearchController#groupSearch)
- [ ] `GET` `/company/{companyUniqueName}/groups/{groupUniqueName}/masters` (MastersController#groupMasters)
- [ ] `PUT` `/company/{companyUniqueName}/groups/{groupUniqueName}/move` (GroupController#moveGroups)
- [ ] `GET` `/company/{companyUniqueName}/groups/{groupUniqueName}/shared-with` (GroupController#getSharedList)
- [ ] `GET` `/company/{companyUniqueName}/groups/{groupUniqueName}/tax-hierarchy` (GroupController#getTaxesAccountHierarchy)
- [ ] `DELETE` `/company/{companyUniqueName}/paypal` (PaypalController#deletePaypalAccountForCompany)
- [ ] `GET` `/company/{companyUniqueName}/paypal` (PaypalController#getPaypalAccount)
- [ ] `POST` `/company/{companyUniqueName}/paypal` (PaypalController#addPaypalAccount)
- [ ] `PUT` `/company/{companyUniqueName}/paypal` (PaypalController#updatePaypalAccount)
- [ ] `DELETE` `/company/{companyUniqueName}/razorpay` (RazorPayController#deleteRazorPayAccountForCompany)
- [ ] `GET` `/company/{companyUniqueName}/razorpay` (RazorPayController#getRazorPayAccount)
- [ ] `POST` `/company/{companyUniqueName}/razorpay` (RazorPayController#addRazorPayAccount)
- [ ] `PUT` `/company/{companyUniqueName}/razorpay` (RazorPayController#updateOrMapRazorPayAccount)
- [ ] `POST` `/company/{companyUniqueName}/tax/assign` (TaxController#assignTaxesOnGroupsAndAccounts)
- [ ] `GET` `/company/{companyUniqueName}/top-inventory-groups` (MastersController#topInventoryGroups)
- [ ] `GET` `/company/{companyUniqueName}/us/export-sales-report-account-wise` (USVatReturnController#downloadVatReportAccountWise)
- [ ] `GET` `/company/{companyUniqueName}/us/sales-report-account-wise` (USVatReturnController#getVatReportAccountWise)
- [ ] `GET` `/company/{companyUniqueName}/v3/account-search` (SearchController#accountSearchV3)
- [ ] `GET` `/company/{companyUniqueName}/yodlee/accounts/{accountUniqueName:.+}/eledgers` (YodleeControllerV2#getTransactions)
- [ ] `GET` `/country/company/{companyUniqueName}/account-countries` (CountryAndStateController#getAccountCountriesByCompany)
- [ ] `GET` `/ui/party-types` (UIController#formDataForPartyTypes)
- [ ] `POST` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance` (AccountV2Controller#calculateClosingBalance)
- [ ] `POST` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/invoice/preview` (InvoiceV2Controller#generatedInvoicePreview)
- [ ] `POST` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/invoices/generate` (InvoiceV2Controller#generateInvoice)
- [ ] `PUT` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/invoices` (InvoiceV2Controller#updateInvoice)
- [ ] `DELETE` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/report-comment` (AccountV2Controller#deleteComment)
- [ ] `POST` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/report-comment` (AccountV2Controller#addComment)
- [ ] `GET` `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}` (AccountV2Controller#getActiveAccountV2)
- [ ] `POST` `/v2/company/{companyUniqueName}/accounts/send-mail` (AccountV2Controller#sendMailToCustomerVendor)
- [ ] `GET` `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}/payor/{urn:.+}/status` (ICICIBankControllerV2#getRegistrationStatus)
- [ ] `GET` `/v2/company/{companyUniqueName}/groups/{groupUniqueName:.+}` (GroupV2Controller#getGroupV2)
- [ ] `POST` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/account-closing-balance` (GroupV2Controller#calculateAccountBalance)
- [ ] `PUT` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts/{accountUniqueName:.+}` (AccountWithGroupV2Controller#updateAccount)
- [ ] `GET` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/download-account-closing-balance` (GroupV2Controller#downloadAccountBalance)
- [ ] `POST` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/download-account-closing-balance` (GroupV2Controller#downloadAccountBalance)
- [ ] `POST` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/email-account-closing-balance` (GroupV2Controller#emailAccountBalance)
- [ ] `POST` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/export/account-balances-v2` (GroupV2Controller#exportAccountBalancesByGroupWithExportSettings)
- [ ] `GET` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/flatten-accounts` (GroupV2Controller#getFlattenGroupsAndAccountsOfGroup)
- [ ] `POST` `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/sms-account-closing-balance` (GroupV2Controller#smsAccountBalance)
- [ ] `POST` `/v2/company/{companyUniqueName}/groups/flatten-groups-with-accounts` (GroupV2Controller#getFlattenGroupsAndAccountsOfGroups)
- [ ] `PATCH` `/v2/subscription/billing-account/{billingAccountUniqueName}` (SubscriptionControllerV2#updateSubscriptionBillingAccount)
- [ ] `GET` `/v2/subscription/billing-account/get` (SubscriptionControllerV2#getSubscriptionBillingAccountByUser)
- [ ] `POST` `/v3/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas/generate-via-estimate` (ProformaV3Controller#generateProformaViaEstimate)
- [ ] `GET` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bill-to-bill/export-v2` (VoucherV4Controller#exportBillToBillReportWithExportSettings)
- [ ] `POST` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bulk-generate` (VoucherV4Controller#bulkGenerate)
- [ ] `POST` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` (VoucherV4Controller#generate)
- [ ] `POST` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` (VoucherController#create)
- [ ] `POST` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` (VoucherV4Controller#getVoucher)
- [ ] `POST` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` (VoucherController#get)
- [ ] `PUT` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` (VoucherV4Controller#updateVoucher)
- [ ] `PUT` `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` (VoucherController#update)
- [ ] `GET` `/v4/company/{companyUniqueName}/particular` (ParticularController#getActiveParticularAccountV3)

### 04-ledger-daybook
- [ ] `GET` `/company/{companyUniqueName}/ledger/upload/{attachedFileUniqueName}` (ImageController#getUploadedFile)
- [ ] `GET` `/magic-link/{magicLink}` (MagicLinkController#getLedgers)

### 05-vouchers-sales
- [ ] `POST` `/company/{companyUniqueName}/advance-receipt/adjust` (AdvanceReceiptController#adjustAdvanceReceiptEntryWithInvoice)
- [ ] `POST` `/company/{companyUniqueName}/advance-receipt/get-all` (AdvanceReceiptController#getReceipts)
- [ ] `GET` `/company/{companyUniqueName}/advance-receipt/summary` (AdvanceReceiptController#getReceiptSummary)
- [ ] `POST` `/company/{companyUniqueName}/bank/payments` (ICICIBankController#bulkPayment)
- [ ] `POST` `/company/{companyUniqueName}/batch/{batchUniqueName}/archive` (BatchController#archiveBatch)
- [ ] `GET` `/company/{companyUniqueName}/completed-document-count` (VoucherController#getCompletedDocument)
- [ ] `POST` `/company/{companyUniqueName}/download-file` (VoucherController#download)
- [ ] `POST` `/company/{companyUniqueName}/ewb/validate-invoice` (EWayBillController#validateInvoice)
- [ ] `PUT` `/company/{companyUniqueName}/invoice-setting` (InvoiceSettingController#updateInvoiceEmail)
- [ ] `POST` `/company/{companyUniqueName}/invoices/{invoiceUniqueName}/action` (InvoiceController#payInvoice)
- [ ] `POST` `/company/{companyUniqueName}/invoices/{voucherUniqueName}/action` (VoucherController#action)
- [ ] `DELETE` `/company/{companyUniqueName}/invoices` (InvoiceController#deleteInvoice)
- [ ] `GET` `/company/{companyUniqueName}/ocr-data` (VoucherController#getOcrUploadedData)
- [ ] `PUT` `/company/{companyUniqueName}/purchase-bill-setting` (PurchaseBillSettingController#updateInvoiceEmail)
- [ ] `DELETE` `/company/{companyUniqueName}/recurring-voucher/{recurringVoucherUniqueName}` (RecurringVoucherController#delete)
- [ ] `PATCH` `/company/{companyUniqueName}/recurring-voucher/{recurringVoucherUniqueName}` (RecurringVoucherController#updateRecurringVoucherPatch)
- [ ] `GET` `/company/{companyUniqueName}/recurring-voucher/get-all` (RecurringVoucherController#getAllRecurringVoucher)
- [ ] `POST` `/company/{companyUniqueName}/recurring-voucher/get-all` (RecurringVoucherController#getAllRecurringVoucher)
- [ ] `POST` `/company/{companyUniqueName}/recurring-voucher` (RecurringVoucherController#addRecurringVoucher)
- [ ] `GET` `/company/{companyUniqueName}/salesperson` (SalesPersonController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/uk/payment/initiate` (UKVatReturnController#initiatePayment)
- [ ] `POST` `/company/{companyUniqueName}/uk/retrieve-vat-payments` (UKVatReturnController#retrieveVatPayments)
- [ ] `GET` `/company/{companyUniqueName}/us/export-sales-report-tax-wise` (USVatReturnController#downloadVatReportTaxWise)
- [ ] `GET` `/company/{companyUniqueName}/us/sales-report-tax-wise` (USVatReturnController#getVatReportTaxWise)
- [ ] `POST` `/company/{companyUniqueName}/voucher/{voucherUniqueName}/cancel-einvoice` (VoucherDocController#cancelEInvoiceForVoucher)
- [ ] `GET` `/company/{companyUniqueName}/voucher/{voucherUniqueName}/versions` (VoucherController#getVoucherVersion)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/{voucherUniqueName}/adjust` (VoucherController#adjustVouchers)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/bulk-export` (CompanyVoucherController#bulkExportVouchers)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/bulk-export` (VoucherController#bulkExport)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/get-all-vouchers-balances` (CompanyVoucherController#getAllBalancesVouchers)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/get-all-vouchers-balances` (VoucherController#getAllBalancesVouchers)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/invoice-list` (CompanyVoucherController#getListOfInvoicesForLinking)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/invoice-list` (VoucherController#getUnAdjustedVouchers)
- [ ] `POST` `/company/{companyUniqueName}/vouchers/voucher-status-count` (VoucherController#getVoucherStatusCount)
- [ ] `POST` `/exception/invalid-json` (CustomExceptionController#generateInvoice)
- [ ] `GET` `/magic-link/{magicLink}/download-invoice/{invoiceNumber}` (MagicLinkController#downloadInvoice)
- [ ] `GET` `/subscription/generateOrder` (SubscriptionController#generateOrderForSubscriptionPayment)
- [ ] `GET` `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}/payor` (ICICIBankControllerV2#getPayorsForPayment)
- [ ] `GET` `/v2/company/{companyUniqueName}/gstr-reconcile/invoices` (GstReturnV2Controller#getB2bInvoices)
- [ ] `GET` `/v2/company/{companyUniqueName}/invoices/list` (InvoiceV2Controller#getAllInvoicesWithInvoiceNumber)
- [ ] `ANY` `/v2/company/{companyUniqueName}/template-preview` (VoucherController#getTemplatePreview)
- [ ] `ANY` `/v2/company/{companyUniqueName}/templates/{templateUniqueName}` (VoucherController#downloadTemplatePreview)
- [ ] `POST` `/v2/subscription/{subscriptionId}/capture-wallet-payment` (SubscriptionControllerV2#captureWalletPayment)
- [ ] `GET` `/v2/subscription/{subscriptionId}/payment-methods` (SubscriptionControllerV2#getAllSubscriptionPaymentMethods)
- [ ] `GET` `/v2/subscription/{subscriptionId}/payment/{paymentId}/save-razorpay-token` (SubscriptionControllerV2#saveRazorpayToken)
- [ ] `GET` `/v2/subscription/{subscriptionId}/payment/{paymentIntentId}/save-stripe-payment` (SubscriptionControllerV2#saveStripePaymentMethod)
- [ ] `DELETE` `/v2/subscription/payment-method/{paymentUniqueName}` (SubscriptionControllerV2#deleteSubscriptionPaymentInfo)
- [ ] `PATCH` `/v2/subscription/payment-method/{paymentUniqueName}` (SubscriptionControllerV2#updateDefaultSubscriptionPaymentInfo)
- [ ] `POST` `/v2/subscription/update` (SubscriptionControllerV2#updateSubscriptionAfterPayment)
- [ ] `POST` `/v2/subscription` (SubscriptionControllerV2#createSubscription)
- [ ] `POST` `/v4/company/{companyUniqueName}/vouchers/{voucherUniqueName}/make-recurring` (VoucherController#makeVoucherRecurring)
- [ ] `POST` `/v4/company/{companyUniqueName}/vouchers/bulk-generate` (VoucherController#bulkCreate)
- [ ] `PATCH` `/v4/company/{companyUniqueName}/vouchers` (VoucherController#updatePatch)

### 07-inventory-manufacturing
- [ ] `DELETE` `/company/{companyUniqueName}/batch/{batchUniqueName}` (BatchController#deleteBatch)
- [ ] `PUT` `/company/{companyUniqueName}/batch/{batchUniqueName}` (BatchController#updateBatch)
- [ ] `POST` `/company/{companyUniqueName}/batch/all` (BatchController#getAllBatches)
- [ ] `GET` `/company/{companyUniqueName}/customer-vendor-discount/get-all-discounts` (CustomerVendorVariantDiscountController#getDiscountInfoForForCustomer)
- [ ] `POST` `/company/{companyUniqueName}/customer-vendor-discount/stock/{stockUniqueName}/assign-discount` (CustomerVendorVariantDiscountController#createCustomerVariantDiscount)
- [ ] `PATCH` `/company/{companyUniqueName}/customer-vendor-discount/stock/{stockUniqueName}/variant/{variantUniqueName}/update-discount` (CustomerVendorVariantDiscountController#updateCustomerVariantDiscount)
- [ ] `DELETE` `/company/{companyUniqueName}/customer-vendor-discount` (CustomerVendorVariantDiscountController#deleteCustomerVariantDiscount)
- [ ] `DELETE` `/company/{companyUniqueName}/inventory-adjustment/{refNo}` (InventoryAdjustmentController#delete)
- [ ] `GET` `/company/{companyUniqueName}/inventory-adjustment/{refNo}` (InventoryAdjustmentController#get)
- [ ] `PUT` `/company/{companyUniqueName}/inventory-adjustment/{refNo}` (InventoryAdjustmentController#update)
- [ ] `POST` `/company/{companyUniqueName}/inventory-adjustment/adjustment-report` (InventoryAdjustmentController#getAdjustmentReport)
- [ ] `GET` `/company/{companyUniqueName}/inventory-adjustment/reason/get-all` (InventoryAdjustmentReasonController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/inventory-adjustment/reason` (InventoryAdjustmentReasonController#create)
- [ ] `POST` `/company/{companyUniqueName}/inventory-adjustment` (InventoryAdjustmentController#create)
- [ ] `POST` `/company/{companyUniqueName}/inventory-search` (SearchController#inventorySearch)
- [ ] `GET` `/company/{companyUniqueName}/inventory-settings` (InventorySettingsController#get)
- [ ] `PUT` `/company/{companyUniqueName}/inventory-settings` (InventorySettingsController#update)
- [ ] `PATCH` `/company/{companyUniqueName}/inventory-users/{inventoryUserUniqueName}/inventory-entries/{inventoryEntryUniqueName:.+}/description` (InventoryEntryController#updateInventoryEntryDescription)
- [ ] `POST` `/company/{companyUniqueName}/inventory-users/{inventoryUserUniqueName}/inventory-entries` (InventoryEntryController#createInventoryEntry)
- [ ] `GET` `/company/{companyUniqueName}/inventory-users` (InventoryUserController#getAllInventoryUsers)
- [ ] `GET` `/company/{companyUniqueName}/inventory/{stockGroupUniqueName}/masters` (MastersController#inventoryMasters)
- [ ] `POST` `/company/{companyUniqueName}/inventory/transaction-report` (InventoryReportController#getStockTransactionReport)
- [ ] `GET` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/download-inventory-report-v2` (StockGroupController#exportStockGroupInventoryReportV2)
- [ ] `POST` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/download-inventory-report-v2` (StockGroupController#exportStockGroupInventoryReportV2)
- [ ] `POST` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/inventory-report-v3` (StockGroupController#createStockGroupReport)
- [ ] `GET` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/report` (StockGroupController#getStockGroupReport)
- [ ] `GET` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}` (StockGroupController#get)
- [ ] `DELETE` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` (StockWithGroupController#delete)
- [ ] `GET` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` (StockWithGroupController#get)
- [ ] `PUT` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` (StockWithGroupController#update)
- [ ] `GET` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/download-stock-inventory-report-v3` (StockWithGroupController#downloadStockReportV3)
- [ ] `POST` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/download-stock-inventory-report-v3` (StockWithGroupController#downloadStockReportV3)
- [ ] `GET` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/report-v2` (StockWithGroupController#getStockReportV2)
- [ ] `POST` `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/report-v2` (StockWithGroupController#getStockReportV2)
- [ ] `DELETE` `/company/{companyUniqueName}/stock-unit-group/{stockUnitGroupUniqueName:.+}` (StockUnitGroupController#delete)
- [ ] `PUT` `/company/{companyUniqueName}/stock-unit-group/{stockUnitGroupUniqueName:.+}` (StockUnitGroupController#update)
- [ ] `GET` `/company/{companyUniqueName}/stock-unit-group` (StockUnitGroupController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/stock-unit-group` (StockUnitGroupController#create)
- [ ] `DELETE` `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName:.+}` (StockUnitController#delete)
- [ ] `GET` `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName:.+}` (StockUnitController#get)
- [ ] `PUT` `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName:.+}` (StockUnitController#update)
- [ ] `GET` `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName}/linked-stock-units` (StockUnitController#getAllMappedUnitOfStock)
- [ ] `POST` `/company/{companyUniqueName}/stock-unit/mappings` (StockUnitController#getAllMappings)
- [ ] `GET` `/company/{companyUniqueName}/stock-unit` (StockUnitController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/stock-unit` (StockUnitController#create)
- [ ] `PUT` `/company/{companyUniqueName}/stock/{stockUniqueName:.+}/move` (StockController#moveStock)
- [ ] `GET` `/company/{companyUniqueName}/stock/{stockUniqueName:.+}/variants` (StockController#getStockVariants)
- [ ] `GET` `/company/{companyUniqueName}/stock/{stockUniqueName:.+}` (StockController#get)
- [ ] `GET` `/company/{companyUniqueName}/stock/{stockUniqueName}/inventory-report` (StockController#inventoryReport)
- [ ] `POST` `/company/{companyUniqueName}/stock/{stockUniqueName}/inventory-report` (StockController#inventoryReport)
- [ ] `GET` `/company/{companyUniqueName}/stock/{stockUniqueName}/link-with-rates` (StockController#getLinkedStocksWithRates)
- [ ] `DELETE` `/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture/{manufactureUniqueName}` (ManufacturingController#deleteManufacturingDetails)
- [ ] `PUT` `/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture/{manufactureUniqueName}` (ManufacturingController#updateManufacturingStock)
- [ ] `POST` `/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture` (ManufacturingController#manufactureStock)
- [ ] `POST` `/company/{companyUniqueName}/stock/{stockUniqueName}/rate-for-stock-v2` (StockController#getRateForStockV2)
- [ ] `POST` `/company/{companyUniqueName}/stock/{stockUniqueName}/rate-for-stock` (StockController#getRateForStock)
- [ ] `POST` `/company/{companyUniqueName}/stock/{stockUniqueName}/recipe/get` (ManufacturingRecipeController#getManufacturingRecipe)
- [ ] `POST` `/company/{companyUniqueName}/stock/{stockUniqueName}/recipe` (ManufacturingRecipeController#createManufacturingRecipe)
- [ ] `GET` `/company/{companyUniqueName}/stock/manufacture-report` (ManufacturingController#getManufacturingReport)
- [ ] `GET` `/v2/company/{companyUniqueName}/download-all-inventory-hierarchy` (CompanyV2Controller#exportAllInventoryStocks)
- [ ] `POST` `/v2/company/{companyUniqueName}/download-all-inventory-hierarchy` (CompanyV2Controller#exportAllInventoryStocks)
- [ ] `GET` `/v2/company/{companyUniqueName}/download-all-inventory-report-v2` (CompanyV2Controller#exportAllStockGroupInventoryReportV2)
- [ ] `POST` `/v2/company/{companyUniqueName}/download-all-inventory-report-v2` (CompanyV2Controller#exportAllStockGroupInventoryReportV2)
- [ ] `GET` `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` (CompanyV2Controller#exportInventoryStocksArrangedByAccounts)
- [ ] `POST` `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` (CompanyV2Controller#exportInventoryStocksArrangedByAccounts)
- [ ] `DELETE` `/v2/company/{companyUniqueName}/manufacture/{manufactureUniqueName}` (ManufacturingV2Controller#deleteManufacturingDetails)
- [ ] `GET` `/v2/company/{companyUniqueName}/manufacture/{manufactureUniqueName}` (ManufacturingV2Controller#getManufacturingDetails)
- [ ] `PUT` `/v2/company/{companyUniqueName}/manufacture/{manufactureUniqueName}` (ManufacturingV2Controller#updateManufactureStock)
- [ ] `POST` `/v2/company/{companyUniqueName}/stock-aging-report/{stockUniqueName}/details` (StockAgingReportController#getStockAgingDrilldown)
- [ ] `POST` `/v2/company/{companyUniqueName}/stock-aging-report/{stockUniqueName}/variants` (StockAgingReportController#getStockAgingVariants)
- [ ] `POST` `/v2/company/{companyUniqueName}/stock-aging-report/totals` (StockAgingReportController#getStockAgingTotals)
- [ ] `POST` `/v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock` (StockWithGroupV2Controller#create)
- [ ] `POST` `/v2/company/{companyUniqueName}/stock-history` (StockHistoryController#getStockHistory)
- [ ] `GET` `/v2/company/{companyUniqueName}/stock/{stockUniqueName:.+}` (StockV2Controller#getV2)
- [ ] `GET` `/v2/company/{companyUniqueName}/stock/{stockUniqueName}/details` (StockV2Controller#getStockVariantsWithVariantUnitBasedOnUserType)
- [ ] `POST` `/v2/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture` (ManufacturingV2Controller#manufactureStock)
- [ ] `PATCH` `/v2/company/{companyUniqueName}/stock/{stockUniqueName}/variant/{variantUniqueName}` (StockV2Controller#updatePatch)
- [ ] `GET` `/v2/company/{companyUniqueName}/stock` (StockV2Controller#getStocks)
- [ ] `GET` `/v5/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}` (StockGroupV5Controller#get)
- [ ] `PUT` `/v5/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}` (StockGroupV5Controller#update)
- [ ] `POST` `/v5/company/{companyUniqueName}/stock-group` (StockGroupV5Controller#create)

### 08-gst-vat
- [ ] `GET` `/company/{companyUniqueName}/ewb/{ewbno}/download-detailed-v2` (EWayBillController#downloadEWBDetailedWithExportSettings)
- [ ] `GET` `/company/{companyUniqueName}/ewb/{ewbno}/download-v2` (EWayBillController#downloadEWBWithExportSettings)
- [ ] `PUT` `/company/{companyUniqueName}/ewb/cancel` (EWayBillController#cancelEwayBill)
- [ ] `GET` `/company/{companyUniqueName}/ewb/user` (EWayBillController#getUser)
- [ ] `PUT` `/company/{companyUniqueName}/ewb/vehicle` (EWayBillController#updateVehicleNumber)
- [ ] `GET` `/company/{companyUniqueName}/ewb` (EWayBillController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/ewb` (EWayBillController#generateEWayBill)
- [ ] `DELETE` `/company/{companyUniqueName}/gst-setting/{uniqueName}` (CompanyGstSettingController#deleteGSTSetting)
- [ ] `PUT` `/company/{companyUniqueName}/gst-setting/{uniqueName}` (CompanyGstSettingController#updateGSTSetting)
- [ ] `GET` `/company/{companyUniqueName}/gst-setting/list` (CompanyGstSettingController#getAllGSTSetting)
- [ ] `POST` `/company/{companyUniqueName}/gst-setting` (CompanyGstSettingController#createGSTSetting)
- [ ] `GET` `/company/{companyUniqueName}/kenya/v2/vat-report-download` (KenyaVatReturnController#downloadKenyaVatReportV2)
- [ ] `GET` `/company/{companyUniqueName}/kenya/vat-report` (KenyaVatReturnController#getKenyaVatReport)
- [ ] `GET` `/company/{companyUniqueName}/tax` (TaxController#get)
- [ ] `POST` `/company/{companyUniqueName}/uk/retrieve-vat-liabilities` (UKVatReturnController#retrieveVatLiabilities)
- [ ] `POST` `/company/{companyUniqueName}/uk/submit-vat-return` (UKVatReturnController#submitVatReturn)
- [ ] `POST` `/company/{companyUniqueName}/uk/vat-obligations` (UKVatReturnController#getVatObligations)
- [ ] `GET` `/company/{companyUniqueName}/uk/vat-report-detailed` (UKVatReturnController#getDetailedUKVatReport)
- [ ] `GET` `/company/{companyUniqueName}/uk/vat-report` (UKVatReturnController#getUKVatReport)
- [ ] `POST` `/company/{companyUniqueName}/uk/view-vat-return` (UKVatReturnController#viewVatReturn)
- [ ] `GET` `/company/{companyUniqueName}/zw/vat-report-detailed-download-v2` (ZWVatReturnController#downloadVatReportCurrencyWiseWithExportSettings)
- [ ] `GET` `/company/{companyUniqueName}/zw/vat-report-detailed` (ZWVatReturnController#getDetailedZWVatReport)
- [ ] `GET` `/company/{companyUniqueName}/zw/vat-report-download-v2` (ZWVatReturnController#downloadVatReportWithExportSettings)
- [ ] `GET` `/company/{companyUniqueName}/zw/vat-report` (ZWVatReturnController#getZWVatReport)
- [ ] `GET` `/gst-info` (MainController#getGstInfo)
- [ ] `GET` `/v2/company/{companyUniqueName}/gst/unit-mapping` (GstReturnV2Controller#getGstUnitMapping)
- [ ] `PATCH` `/v2/company/{companyUniqueName}/gst/unit-mapping` (GstReturnV2Controller#mapGstUnits)
- [ ] `GET` `/v2/company/{companyUniqueName}/vat-report-detailed` (VatReturnController#getVatReportDetailed)
- [ ] `GET` `/v2/company/{companyUniqueName}/vat-report` (VatReturnController#getVatReport)

### 09-reports-dashboard
- [ ] `POST` `/company/{companyUniqueName}/business-documents/pending-report` (BusinessDocumentController#pendingReport)
- [ ] `GET` `/company/{companyUniqueName}/calculateRatios` (ReportController#calculateRatios)
- [ ] `GET` `/company/{companyUniqueName}/dashboard/graph` (DashboardController#createGraphBasedOnType)
- [ ] `GET` `/company/{companyUniqueName}/project/{projectUniqueName}/net-profit` (ProjectReportController#profitLossForMultiBranch)
- [ ] `GET` `/company/{companyUniqueName}/project/{projectUniqueName}/profit-loss` (ProjectReportController#profitLossForMultiBranch)
- [ ] `GET` `/company/{companyUniqueName}/v2/balance-sheet-collapsed-download-v2` (ReportController#balanceSheetCollapsedV2WithExportSetting)
- [ ] `GET` `/company/{companyUniqueName}/v2/profit-loss-collapsed-download-v2` (ReportController#profitAndLossCollapsedV2WithExportSetting)
- [ ] `GET` `/report-filters` (ReportFilterController#getReportFilterColumns)
- [ ] `POST` `/report-filters` (ReportFilterController#saveReportFilterColumns)
- [ ] `GET` `/v2/company/{companyUniqueName}/cash-flow-download-v2` (ReportV2Controller#downloadCashFlowStatementV2)
- [ ] `GET` `/v2/company/{companyUniqueName}/cogs` (ReportV2Controller#calculateCogs)
- [ ] `GET` `/v2/company/{companyUniqueName}/multibranch/compared-profit-loss` (ReportV2Controller#comparedProfitLossForMultiBranch)
- [ ] `GET` `/v2/company/{companyUniqueName}/multibranch/trial-balance` (ReportV2Controller#createTrialBalanceForMultipleBranch)
- [ ] `GET` `/v2/company/{companyUniqueName}/multicompany/{reportType}` (ReportV2Controller#getReportForMultipleCompanies)
- [ ] `POST` `/v2/company/{companyUniqueName}/multicompany/{reportType}` (ReportV2Controller#createMultiCurrencyReportForMultipleCompanies)
- [ ] `GET` `/v2/company/{companyUniqueName}/reports/all-reports` (ReportV2Controller#getFavoriteReport)
- [ ] `POST` `/v2/company/{companyUniqueName}/reports/entity-selection` (ReportV2Controller#getReportModeStatus)
- [ ] `POST` `/v2/company/{companyUniqueName}/reports/entity-status` (ReportV2Controller#updateReportsEntityStatus)
- [ ] `POST` `/v2/company/{companyUniqueName}/reports/save-report-data` (ReportV2Controller#saveFavoriteReportModule)
- [ ] `POST` `/v2/company/{companyUniqueName}/reverse-charge-report` (ReportV2Controller#getReverseChargeReport)

### 10-settings
- [ ] `GET` `/company/{companyUniqueName}/entry-settings` (CompanySettingsController#getUserCompanyEntrySettings)
- [ ] `PUT` `/company/{companyUniqueName}/entry-settings` (CompanySettingsController#updateUserCompanyEntrySettings)
- [ ] `PATCH` `/company/{companyUniqueName}/export-settings` (CompanySettingsController#updateExportSettings)
- [ ] `POST` `/company/{companyUniqueName}/gocardless/agreement-requisitions` (GoCardlessBankIntegrationController#createEndUserAgreementAndRequisitions)
- [ ] `POST` `/company/{companyUniqueName}/imports/reconciliation/process` (ReconciliationController#process)
- [ ] `GET` `/company/{companyUniqueName}/imports/reconciliation` (ReconciliationController#list)
- [ ] `DELETE` `/company/{companyUniqueName}/payu` (PayuController#deletePayuUser)
- [ ] `GET` `/company/{companyUniqueName}/payu` (PayuController#getPayuUser)
- [ ] `POST` `/company/{companyUniqueName}/payu` (PayuController#addPayuUser)
- [ ] `POST` `/company/{companyUniqueName}/role/{roleUniqueName}/assign` (RoleV2Controller#assignRole)
- [ ] `DELETE` `/company/{companyUniqueName}/role/{roleUniqueName}` (RoleV2Controller#deleteRole)
- [ ] `PUT` `/company/{companyUniqueName}/role/{roleUniqueName}` (RoleV2Controller#updateRole)
- [ ] `GET` `/company/{companyUniqueName}/role` (RoleV2Controller#getAllRoles)
- [ ] `GET` `/company/{companyUniqueName}/settings` (CompanySettingsController#getCompanySettings)
- [ ] `PUT` `/company/{companyUniqueName}/settings` (CompanySettingsController#updateCompanySettings)
- [ ] `DELETE` `/company/{companyUniqueName}/tags/{tagUniqueName}` (TagController#deleteTag)
- [ ] `PUT` `/company/{companyUniqueName}/tags/{tagUniqueName}` (TagController#updateTag)
- [ ] `POST` `/company/{companyUniqueName}/tags` (TagController#createTag)
- [ ] `DELETE` `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` (UserEntityRoleV2Controller#deleteUserEntityRole)
- [ ] `PUT` `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` (UserEntityRoleV2Controller#updateUserEntityRole)
- [ ] `GET` `/users/{userUniqueName:.+}` (UserController#getUser)
- [ ] `GET` `/users/{userUniqueName}/company-uer` (UserController#getCompanyUserEntityRoles)
- [ ] `PUT` `/users/{userUniqueName}/settings` (UserController#updateUserSettings)
- [ ] `GET` `/users/{userUniqueName}/v2/companies` (UserController#getAllCompaniesV3)
- [ ] `POST` `/users/send-new-user-info` (UserController#sendNewUserInfo)
- [ ] `GET` `/users/subscriptions` (UserController#getAllUserSubscriptions)
- [ ] `GET` `/v2/company/{companyUniqueName}/communication/email-template/{templateOf}` (CommunicationControllerV2#getEmailTemplate)
- [ ] `PUT` `/v2/company/{companyUniqueName}/communication/email-template/{templateOf}` (CommunicationControllerV2#updateEmailTemplate)
- [ ] `GET` `/v2/company/{companyUniqueName}/gstr1/download-v2` (GstReturnV2Controller#downloadGstr1DataWithExportSettings)
- [ ] `GET` `/v2/company/{companyUniqueName}/sample-templates` (TemplateV2Controller#getSampleTemplates)
- [ ] `PATCH` `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}/default` (TemplateV2Controller#setDefaultTemplate)
- [ ] `DELETE` `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` (TemplateV2Controller#deleteTemplate)
- [ ] `GET` `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` (TemplateV2Controller#getTemplate)
- [ ] `PUT` `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` (TemplateV2Controller#updateTemplate)
- [ ] `GET` `/v2/company/{companyUniqueName}/templates` (TemplateV2Controller#getAllTemplatesV2)
- [ ] `POST` `/v2/company/{companyUniqueName}/templates` (TemplateV2Controller#createTemplate)

### 11-subscriptions
- [ ] `POST` `/subscription/paypal/order/{orderId}/capture` (PaypalSubscriptionController#captureOrder)
- [ ] `POST` `/v2/subscription/{subscriptionId}/activate-prepaid` (SubscriptionControllerV2#activatePrepaidSubscription)
- [ ] `GET` `/v2/subscription/{subscriptionId}/cancel` (SubscriptionControllerV2#cancelSubscription)
- [ ] `GET` `/v2/subscription/{subscriptionId}/company-list` (SubscriptionControllerV2#getCompanyListBySubscriptionRegion)
- [ ] `GET` `/v2/subscription/{subscriptionId}/country-list` (SubscriptionControllerV2#getCountryListBySubscriptionId)
- [ ] `POST` `/v2/subscription/{subscriptionId}/create-pre-paid` (SubscriptionControllerV2#createPrePaidOfSubscription)
- [ ] `GET` `/v2/subscription/{subscriptionId}/generate-order` (SubscriptionControllerV2#generateRazorpayOrder)
- [ ] `GET` `/v2/subscription/{subscriptionId}/wallet-logs` (SubscriptionControllerV2#getSubscriptionWalletLogs)
- [ ] `GET` `/v2/subscription/{subscriptionId}/wallet` (SubscriptionControllerV2#getWalletDetails)
- [ ] `GET` `/v2/subscription/{subscriptionId}` (SubscriptionControllerV2#getSubscription)
- [ ] `POST` `/v2/subscription/add-wallet-amount` (SubscriptionControllerV2#addWalletAmount)
- [ ] `POST` `/v2/subscription/buy-plan` (SubscriptionControllerV2#buyPlan)
- [ ] `POST` `/v2/subscription/change-plan` (SubscriptionControllerV2#changePlanOfSubscription)
- [ ] `POST` `/v2/subscription/charge/{subscriptionId}` (SubscriptionControllerV2#chargeSubscription)
- [ ] `POST` `/v2/subscription/company-list/{subscriptionId}` (SubscriptionControllerV2#getCompaniesBySubscriptionId)
- [ ] `POST` `/v2/subscription/get-amount` (SubscriptionControllerV2#getSubscriptionAmount)
- [ ] `POST` `/v2/subscription/list` (SubscriptionControllerV2#getSubscriptions)
- [ ] `GET` `/v2/subscription/plans/all` (SubscriptionControllerV2#getAllPlans)
- [ ] `POST` `/v2/subscription/transfer/ownership` (SubscriptionControllerV2#ownerShipTransfer)
- [ ] `POST` `/v2/subscription/verify/ownership` (SubscriptionControllerV2#verifyOwnerShip)

### 12-imports-sync-ocr
- [ ] `GET` `/company/{companyUniqueName}/download-import-logs` (ImportLogController#downloadImportLogs)
- [ ] `POST` `/company/{companyUniqueName}/imports/document/upload` (ImportController#uploadDocument)
- [ ] `POST` `/company/{companyUniqueName}/imports/import-pdf/bank-statement` (ImportController#importpdf)
- [ ] `POST` `/company/{companyUniqueName}/imports/process` (ImportController#processDataV2)
- [ ] `POST` `/company/{companyUniqueName}/imports/reconciliation/upload` (ReconciliationController#upload)
- [ ] `GET` `/company/{companyUniqueName}/imports/signed-url` (ImportController#generatePreSignedURL)
- [ ] `POST` `/company/{companyUniqueName}/imports/upload` (ImportController#createImportRequest)
- [ ] `POST` `/company/{companyUniqueName}/imports/v2/upload` (ImportController#getConfirmationOnUploadThroughSignedURL)
- [ ] `GET` `/company/{companyUniqueName}/imports` (ImportController#viewImportRequests)
- [ ] `GET` `/v2/company/{companyUniqueName}/gstr3b-excel-export/email` (GstReturnV2Controller#emailGstr3ExcelSheet)

### 13-misc
- [ ] `GET` `/business-nature` (MainController#getBusinessNature)
- [ ] `POST` `/company/{companyUniqueName}/add-domain` (PortalWhiteLabelController#addDomain)
- [ ] `DELETE` `/company/{companyUniqueName}/address/{addressUniqueName:.+}` (AddressController#delete)
- [ ] `PUT` `/company/{companyUniqueName}/address/{addressUniqueName:.+}` (AddressController#update)
- [ ] `GET` `/company/{companyUniqueName}/address/all` (AddressController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/address/all` (AddressController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/address` (AddressController#create)
- [ ] `DELETE` `/company/{companyUniqueName}/bank/deregistration` (ICICIBankController#bankDeRegistration)
- [ ] `POST` `/company/{companyUniqueName}/bank/registration` (ICICIBankController#bankRegistration)
- [ ] `PUT` `/company/{companyUniqueName}/bank/updateDetails` (ICICIBankController#updateDetails)
- [ ] `GET` `/company/{companyUniqueName}/bank` (ICICIBankController#getAllRegistration)
- [ ] `GET` `/company/{companyUniqueName}/batch/{batchUniqueName}` (BatchController#getBatch)
- [ ] `GET` `/company/{companyUniqueName}/batch/availability` (BatchController#getAvailability)
- [ ] `POST` `/company/{companyUniqueName}/batch/transfer` (BatchController#transferBatch)
- [ ] `POST` `/company/{companyUniqueName}/batch` (BatchController#createBatch)
- [ ] `DELETE` `/company/{companyUniqueName}/branch-transfer/{transferNoteUniqueName}` (BranchTransferController#deleteBranchTransferNote)
- [ ] `GET` `/company/{companyUniqueName}/branch-transfer/{transferNoteUniqueName}` (BranchTransferController#getTransferNote)
- [ ] `PUT` `/company/{companyUniqueName}/branch-transfer/{transferNoteUniqueName}` (BranchTransferController#updateBranchTransferNote)
- [ ] `POST` `/company/{companyUniqueName}/branch-transfer/all` (BranchTransferController#getAllBranchTransfers)
- [ ] `POST` `/company/{companyUniqueName}/branch-transfer/download` (BranchTransferController#download)
- [ ] `POST` `/company/{companyUniqueName}/branch-transfer/generate` (BranchTransferController#generateTransferNote)
- [ ] `POST` `/company/{companyUniqueName}/business-documents/{uniqueName}/action` (BusinessDocumentController#applyAction)
- [ ] `GET` `/company/{companyUniqueName}/business-documents/{uniqueName}/history` (BusinessDocumentController#getHistory)
- [ ] `GET` `/company/{companyUniqueName}/business-documents/{uniqueName}/versions` (BusinessDocumentController#getVersions)
- [ ] `DELETE` `/company/{companyUniqueName}/business-documents/{uniqueName}` (BusinessDocumentController#delete)
- [ ] `GET` `/company/{companyUniqueName}/business-documents/{uniqueName}` (BusinessDocumentController#getByUniqueName)
- [ ] `POST` `/company/{companyUniqueName}/business-documents/convert` (BusinessDocumentController#convert)
- [ ] `GET` `/company/{companyUniqueName}/business-documents/statuses` (BusinessDocumentController#getStatuses)
- [ ] `GET` `/company/{companyUniqueName}/communication/campaign/{slug}/fields` (CommunicationController#getCampaignFields)
- [ ] `GET` `/company/{companyUniqueName}/communication/campaign/list` (CommunicationController#getCampaignList)
- [ ] `GET` `/company/{companyUniqueName}/communication/condition-suggestion` (CommunicationController#getConditionSuggestion)
- [ ] `GET` `/company/{companyUniqueName}/communication/email-content-suggestion` (CommunicationController#getEmailContentSuggestion)
- [ ] `GET` `/company/{companyUniqueName}/communication/generate-email` (CommunicationController#generateEmail)
- [ ] `GET` `/company/{companyUniqueName}/communication/platform/{platformUniqueName}/trigger/form` (CommunicationController#getForm)
- [ ] `DELETE` `/company/{companyUniqueName}/communication/platform/{uniqueName}` (CommunicationController#deletePlatform)
- [ ] `GET` `/company/{companyUniqueName}/communication/suggestions/{platformUniqueName}/{entity}` (CommunicationController#getSuggestion)
- [ ] `DELETE` `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` (CommunicationController#deleteTrigger)
- [ ] `GET` `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` (CommunicationController#getTrigger)
- [ ] `PATCH` `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` (CommunicationController#updatePatch)
- [ ] `PUT` `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` (CommunicationController#update)
- [ ] `GET` `/company/{companyUniqueName}/communication/trigger` (CommunicationController#getTriggerList)
- [ ] `POST` `/company/{companyUniqueName}/communication/trigger` (CommunicationController#create)
- [ ] `GET` `/company/{companyUniqueName}/communication` (CommunicationController#getPlatform)
- [ ] `GET` `/company/{companyUniqueName}/currency-converter/{baseCurrency}/{toCurrency}` (CurrencyConverterController#getCurrencyRates)
- [ ] `DELETE` `/company/{companyUniqueName}/customfield/{customFieldUniqueName:.+}` (CustomFieldController#delete)
- [ ] `GET` `/company/{companyUniqueName}/customfield/{customFieldUniqueName:.+}` (CustomFieldController#get)
- [ ] `PATCH` `/company/{companyUniqueName}/customfield/{customFieldUniqueName:.+}` (CustomFieldController#update)
- [ ] `GET` `/company/{companyUniqueName}/customfield/module/{moduleUniqueName:.+}` (CustomFieldController#getAllByModule)
- [ ] `POST` `/company/{companyUniqueName}/customfield` (CustomFieldController#create)
- [ ] `DELETE` `/company/{companyUniqueName}/delete-image` (ImageController#deleteImageByUniueName)
- [ ] `PUT` `/company/{companyUniqueName}/discount/{discountUniqueName:.+}` (DiscountController#updateDiscount)
- [ ] `GET` `/company/{companyUniqueName}/discount/assign/list` (DiscountController#getAllAssignedDiscountList)
- [ ] `POST` `/company/{companyUniqueName}/discount/assign` (DiscountController#assignedDiscounts)
- [ ] `GET` `/company/{companyUniqueName}/discount` (DiscountController#getAll)
- [ ] `POST` `/company/{companyUniqueName}/domain/{domainUniqueName}/share` (PortalWhiteLabelController#shareDomain)
- [ ] `PATCH` `/company/{companyUniqueName}/domain/{domainUniqueName}` (PortalWhiteLabelController#updateDomain)
- [ ] `POST` `/company/{companyUniqueName}/dsc/finish` (DscController#finish)
- [ ] `POST` `/company/{companyUniqueName}/dsc/prepare` (DscController#prepare)
- [ ] `POST` `/company/{companyUniqueName}/ecommerce/email` (EcommerceController#sendEmail)
- [ ] `POST` `/company/{companyUniqueName}/generate-mail-token` (GoogleMailController#generateMailToken)
- [ ] `GET` `/company/{companyUniqueName}/get-domain-list` (PortalWhiteLabelController#getDomains)
- [ ] `DELETE` `/company/{companyUniqueName}/gmail-token` (GoogleMailController#deleteToken)
- [ ] `GET` `/company/{companyUniqueName}/gmail-token` (GoogleMailController#getToken)
- [ ] `DELETE` `/company/{companyUniqueName}/gocardless/{bankDetailsUniqueName}` (GoCardlessBankIntegrationController#deleteBankIntegrationDetails)
- [ ] `GET` `/company/{companyUniqueName}/gocardless/institutions` (GoCardlessBankIntegrationController#getAllInstitution)
- [ ] `POST` `/company/{companyUniqueName}/images` (ImageController#setCompanyImage)
- [ ] `POST` `/company/{companyUniqueName}/pettycash-manager/{entryUniqueName}` (PettyCashManagerController#action)
- [ ] `POST` `/company/{companyUniqueName}/pettycash-manager/{entryUniqueName}` (PettyCashManagerController#action)
- [ ] `POST` `/company/{companyUniqueName}/plaid/create/access-token` (PlaidController#setAccessToken)
- [ ] `GET` `/company/{companyUniqueName}/plaid/create/link-token` (PlaidController#createLinkToken)
- [ ] `GET` `/company/{companyUniqueName}/project/{projectUniqueName}/category-total` (ProjectController#getRevenueOrExpenseTotalOfProject)
- [ ] `GET` `/company/{companyUniqueName}/project/{projectUniqueName}/entries` (ProjectController#getProjectEntries)
- [ ] `PUT` `/company/{companyUniqueName}/project/{projectUniqueName}/entry/{entryUniqueName}` (ProjectEntryController#updateProjectEntry)
- [ ] `POST` `/company/{companyUniqueName}/project/{projectUniqueName}/entry` (ProjectEntryController#createProjectEntry)
- [ ] `DELETE` `/company/{companyUniqueName}/project/{projectUniqueName}` (ProjectController#deleteProject)
- [ ] `GET` `/company/{companyUniqueName}/project/{projectUniqueName}` (ProjectController#getProject)
- [ ] `PATCH` `/company/{companyUniqueName}/project/{projectUniqueName}` (ProjectController#updateProject)
- [ ] `GET` `/company/{companyUniqueName}/project/all` (ProjectController#getAllProject)
- [ ] `POST` `/company/{companyUniqueName}/project` (ProjectController#createProject)
- [ ] `POST` `/company/{companyUniqueName}/save-mail-token` (GoogleMailController#saveMailToken)
- [ ] `GET` `/company/{companyUniqueName}/tags` (TagController#getAllTags)
- [ ] `DELETE` `/company/{companyUniqueName}/transporters` (TransporterController#deleteTransporter)
- [ ] `GET` `/company/{companyUniqueName}/transporters` (TransporterController#getAllTransporter)
- [ ] `POST` `/company/{companyUniqueName}/transporters` (TransporterController#addTransporter)
- [ ] `PUT` `/company/{companyUniqueName}/transporters` (TransporterController#updateTransporter)
- [ ] `DELETE` `/company/{companyUniqueName}/triggers/{triggerUniqueName:.+}` (TriggerController#deleteTrigger)
- [ ] `PUT` `/company/{companyUniqueName}/triggers/{triggerUniqueName:.+}` (TriggerController#updateTrigger)
- [ ] `GET` `/company/{companyUniqueName}/triggers` (TriggerController#getAllTrigger)
- [ ] `POST` `/company/{companyUniqueName}/triggers` (TriggerController#createTrigger)
- [ ] `GET` `/company/{companyUniqueName}/verify-domain` (PortalWhiteLabelController#verifyDomain)
- [ ] `GET` `/country/{countryCode}` (CountryAndStateController#getCountryAndStateData)
- [ ] `GET` `/country/cities` (CountryAndStateController#getCityByPinCode)
- [ ] `GET` `/country/country-list` (CountryAndStateController#getCountryList)
- [ ] `GET` `/country` (CountryAndStateController#getCountryList)
- [ ] `GET` `/currency/rate` (MainController#getCurrencyRates)
- [ ] `GET` `/currency` (CurrencyController#getCurrencyList)
- [ ] `GET` `/scope-v2` (MainController#getScopes)
- [ ] `POST` `/send-data` (MainController#sendLeadDataToSlack)
- [ ] `GET` `/state-details` (LastStateDetailsController#getLastState)
- [ ] `POST` `/state-details` (LastStateDetailsController#updateLastState)
- [ ] `GET` `/time` (MainController#getServerTime)
- [ ] `GET` `/ui/auditlogs-form` (UIController#getAuditLogOperationFilterForm)
- [ ] `GET` `/ui/bank/integration/form` (UIController#getBankIntegrationForm)
- [ ] `GET` `/ui/calling-code` (UIController#formDataForCallingCodes)
- [ ] `GET` `/ui/forms` (UIController#formData)
- [ ] `GET` `/ui/graph-types` (UIController#graphTypes)
- [ ] `PUT` `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}/payor/{urn:.+}` (ICICIBankControllerV2#updatePayorDetails)
- [ ] `PUT` `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}` (ICICIBankControllerV2#updateBankDetails)
- [ ] `GET` `/v2/company/{companyUniqueName}/bank` (ICICIBankControllerV2#getAllRegistration)
- [ ] `POST` `/v2/company/{companyUniqueName}/bank` (ICICIBankControllerV2#bankRegistrationForICICI)
- [ ] `GET` `/v2/company/{companyUniqueName}/gstr1-referenceIds` (GstReturnV2Controller#getGstr1ReferenceIds)
- [ ] `GET` `/v2/company/{companyUniqueName}/gstr1` (GstReturnV2Controller#getGstr1Data)
- [ ] `POST` `/v2/company/{companyUniqueName}/logs` (AuditLogControllerV3#getLogs)
- [ ] `GET` `/v2/company/{companyUniqueName}/save-gstr1-status` (GstReturnV2Controller#saveGstr1Status)
- [ ] `POST` `/v2/company/{companyUniqueName}/save-gstr1` (GstReturnV2Controller#saveGstr1Data)
- [ ] `POST` `/v2/company/{companyUniqueName}/save-gstr3b` (GstReturnV2Controller#saveGstr3BData)
- [ ] `DELETE` `/v2/company/{companyUniqueName}/trigger/{uniqueName}` (TriggerControllerV2#deleteEmailTrigger)
- [ ] `GET` `/v2/company/{companyUniqueName}/trigger/{uniqueName}` (TriggerControllerV2#getEmailTrigger)
- [ ] `PUT` `/v2/company/{companyUniqueName}/trigger/{uniqueName}` (TriggerControllerV2#updateEmailTrigger)
- [ ] `GET` `/v2/company/{companyUniqueName}/trigger/all` (TriggerControllerV2#getAllEmailTrigger)
- [ ] `POST` `/v2/company/{companyUniqueName}/trigger` (TriggerControllerV2#createEmailTrigger)
- [ ] `GET` `/white-label` (GiddhWhiteLabelController#getWhiteLabelDetailsByOrigin)
