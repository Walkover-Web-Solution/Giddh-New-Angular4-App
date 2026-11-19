# Published Giddh API Docs — Update & Missing List

Compares exported public OpenAPI (`Giddh API Reference.json`, **119** operations) with **frontend-used** APIs that exist in backend controllers.

Use this folder to update existing published docs and upload missing ones.

## Summary

| Metric | Count |
| --- | ---: |
| Published operations | 119 |
| Published needing update | 119 |
| Published unresolved to backend route | 0 |
| Frontend-used + backend-matched | 655 |
| Missing from published | 584 |

## How to use

1. **Section A** — fix already published pages.
2. **Section B** — create new pages for missing frontend+backend APIs.
3. **ACTION-CHECKLIST.md** — checkbox tracker.
4. **gap-analysis.json** — machine-readable params/payloads for upload.

Regenerate:

```bash
node scripts/generate-published-api-gap-docs.mjs "/path/to/Giddh API Reference.json"
```

## Common update rules

- Replace alias path (`/account-apis/...`) with real route.
- Remove junk params: `t`, `z`, `lang`, `0`, `1`, duplicate `content-type`, HTML spans.
- Model real path/query params (`companyUniqueName`, `branchUniqueName`, ...).
- Auth header: `Auth-Key`.
- Align body + response with backend controller and frontend usage.

## A. Published APIs that need modify / update

### A1. POST `/account-apis/create-account`

- **Published title:** Create Account
- **Real API:** `POST /v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
- **Backend:** giddh-api-v2 · `AccountWithGroupV2Controller#create`
- **Frontend ids:** ACCOUNTS_API_V2.CREATE
- **Path params:** groupUniqueName, companyUniqueName
- **Query params:** lang
- **Body type:** `AccountResourceV2`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, emailList, tagNames, rowNum, mobileCode, importedAccountOpeningBalance, currentBranch, ledgerView, duePeriod (+1)
  - Review published-only fields: activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmount, closingBalanceTriggerAmountType (+4)
  - Set published path to real route: `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
- **Backend fields:** applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, emailList, tagNames, rowNum, mobileCode, importedAccountOpeningBalance, currentBranch, ledgerView, duePeriod, salesPersonUniqueName
- **Published fields:** activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, customFields, accountOpeningBalance, hsnNumber, sacNumber

### A2. GET `/account-apis/get-account-balance`

- **Published title:** Get Account Balance
- **Real API:** `GET /v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance`
- **Backend:** giddh-api-v2 · `AccountV2Controller#calculateClosingBalance`
- **Frontend ids:** LEDGER_API.GET_BALANCE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName, from, to, q, accountCurrency, lang
- **Body type:** `EntryFilter`
- **Updates needed:**
  - Remove junk params (0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars (+10)
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance`
- **Backend fields:** groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars, isInvoiceGenerated, includeTag, tags, chequeNumber, dateOnCheque, inventory, cancelledEntries, balanceTypeAsSign, chequeDate, selectAllFields

### A3. PATCH `/account-apis/patch-account-api-v2`

- **Published title:** patch account api v2
- **Real API:** `PATCH /v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
- **Backend:** giddh-api-v2 · `AccountV2Controller#updateAccountV2Patch`
- **Frontend ids:** ACCOUNTS_API_V2.UPDATE_WITH_ACCOUNT_UNIQUE_NAME
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName, lang
- **Body type:** `AccountRequest`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: hsnNumber, sacNumber, email, name, accountOpeningBalances, uniqueName, currency, description, openingBalanceDate, isActive, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, company, attentionTo, mobileNo (+13)
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
- **Backend fields:** hsnNumber, sacNumber, email, name, accountOpeningBalances, uniqueName, currency, description, openingBalanceDate, isActive, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, company, attentionTo, mobileNo, city, companyName, pincode, archive, country, emails, addresses, tagNames, accountBankDetails, mobileCode, ledgerView, duePeriod, salesPersonUniqueName

### A4. PUT `/account-apis/update-account-api-v2`

- **Published title:** Update account api v2
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
- **Backend:** giddh-api-v2 · `AccountController#updateAccount`
- **Frontend ids:** ACCOUNTS_API.UPDATE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName, lang
- **Body type:** `AccountResource`
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, accounts, address, emailList, tagNames
  - Review published-only fields: activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, country, currency, closingBalanceTriggerAmountType, accountOpeningBalance, customFields (+2)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
- **Backend fields:** applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, accounts, addresses, address, emailList, tagNames, mobileCode
- **Published fields:** activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, mobileCode, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmountType, accountOpeningBalance, customFields, hsnNumber, sacNumber

### A5. DELETE `/account-apis/delete-account-api`

- **Published title:** Delete account api
- **Real API:** `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName:.+}`
- **Backend:** giddh-api-v2 · `AccountController#deleteAccount`
- **Frontend ids:** ACCOUNTS_API.DELETE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** lang
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}`

### A6. POST `/account-apis/create-group`

- **Published title:** Create Group
- **Real API:** `POST /company/{companyUniqueName}/groups`
- **Backend:** giddh-api-v2 · `GroupController#create`
- **Frontend ids:** GROUP_API.CREATE
- **Path params:** companyUniqueName
- **Body type:** `GroupResource`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: applicableTaxesUniqueNames, tagNames, rowNum
  - Review published-only fields: name, uniqueName, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, parentGroupUniqueName, path
  - Set published path to real route: `/company/{companyUniqueName}/groups`
- **Backend fields:** applicableTaxesUniqueNames, tagNames, rowNum
- **Published fields:** name, uniqueName, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, parentGroupUniqueName, path

### A7. DELETE `/account-apis/delete-group`

- **Published title:** Delete Group
- **Real API:** `DELETE /company/{companyUniqueName}/groups/{groupUniqueName:.+}`
- **Backend:** giddh-api-v2 · `GroupController#deleteGroup`
- **Frontend ids:** GROUP_API.DELETE_GROUP
- **Path params:** companyUniqueName, groupUniqueName
- **Updates needed:**
  - Remove junk params (0, 1)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Set published path to real route: `/company/{companyUniqueName}/groups/{groupUniqueName:.+}`

### A8. PUT `/account-apis/update-group`

- **Published title:** Update Group
- **Real API:** `PUT /company/{companyUniqueName}/groups/{groupUniqueName:.+}`
- **Backend:** giddh-api-v2 · `GroupController#updateGroup`
- **Frontend ids:** GROUP_API.UPDATE, GROUP_API.UPDATE_GROUP
- **Path params:** companyUniqueName, groupUniqueName
- **Body type:** `GroupResource`
- **Updates needed:**
  - Remove junk params (content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: applicableTaxesUniqueNames, tagNames, rowNum
  - Review published-only fields: name, uniqueName, closingBalanceTriggerAmount, closingBalanceTriggerAmountType
  - Set published path to real route: `/company/{companyUniqueName}/groups/{groupUniqueName:.+}`
- **Backend fields:** applicableTaxesUniqueNames, tagNames, rowNum
- **Published fields:** name, uniqueName, closingBalanceTriggerAmount, closingBalanceTriggerAmountType

### A9. GET `/account-apis/update-group_copy`

- **Published title:** group-accounts-list
- **Real API:** `GET /company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
- **Backend:** giddh-api-v2 · `AccountWithGroupController#getActiveAccountsByGroup`
- **Frontend ids:** n/a
- **Path params:** groupUniqueName, companyUniqueName
- **Query params:** lang
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
  - Matched route is not used by current frontend

### A10. POST `/entry-apis-v2/service/create-entry---with-tax-and-discount`

- **Published title:** Create Entry - with tax and discount
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend:** accounting-microservice · `LedgerController#create`
- **Frontend ids:** LEDGER_API.CREATE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Add/update payload fields from backend: description, voucherDescription, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod, referenceId, sendToGstr2 (+14)
  - Review published-only fields: entryDate, chequeClearanceDate, tdsTcsTaxesSum, otherTaxesSum, otherTaxType
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, voucherType, entryDate, generateInvoice, chequeNumber, chequeClearanceDate, tdsTcsTaxesSum, otherTaxesSum, otherTaxType, exchangeRate

### A11. PUT `/entry-apis-v2/service/update-entry`

- **Published title:** Update Entry
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
- **Backend:** accounting-microservice · `LedgerController#update`
- **Frontend ids:** LEDGER_API.UNIVERSAL
- **Path params:** companyUniqueName, accountUniqueName, ledgerUniqueName
- **Query params:** branchUniqueName, newAccountUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, 2, Content-Type, content-type)
  - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, ewayBillDetails, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod, referenceId, sendToGstr2 (+14)
  - Review published-only fields: entryDate
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, voucherType, entryDate, generateInvoice, exchangeRate, valuesInAccountCurrency

### A12. DELETE `/entry-apis-v2/service/delete-entry`

- **Published title:** Delete Entry
- **Real API:** `DELETE /v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
- **Backend:** giddh-api-v2 · `LedgerV4Controller#deleteLedger`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName, ledgerUniqueName
- **Updates needed:**
  - Remove junk params (t, z, lang)
  - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
  - Matched route is not used by current frontend

### A13. GET `/entry-apis-v2/service/get-entry`

- **Published title:** Get Entry
- **Real API:** `GET /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
- **Backend:** accounting-microservice · `LedgerController#get`
- **Frontend ids:** LEDGER_API.GET_TRANSACTION
- **Path params:** companyUniqueName, accountUniqueName, ledgerUniqueName
- **Query params:** branchUniqueName, baseRef
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`

### A14. POST `/entry-apis-v2/service/advance-receipt-entry-with-gst-and-tds`

- **Published title:** Advance Receipt Entry with GST and TDS
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend:** accounting-microservice · `LedgerController#create`
- **Frontend ids:** LEDGER_API.CREATE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod (+16)
  - Review published-only fields: entryDate
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, voucherType, entryDate, generateInvoice

### A15. POST `/entry-apis-v2/service/advance-receipt-entry-with-tds`

- **Published title:** Advance Receipt Entry with TDS
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend:** accounting-microservice · `LedgerController#create`
- **Frontend ids:** LEDGER_API.CREATE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (lang, 0, 1, Content-Type)
  - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod (+16)
  - Review published-only fields: entryDate
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, voucherType, entryDate, generateInvoice

### A16. POST `/entry-apis-v2/service/advance-receipt-entry-with-gst`

- **Published title:** Advance Receipt Entry with GST
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend:** accounting-microservice · `LedgerController#create`
- **Frontend ids:** LEDGER_API.CREATE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: description, voucherDescription, chequeNumber, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod (+16)
  - Review published-only fields: entryDate
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, voucherType, entryDate, generateInvoice

### A17. POST `/entry-apis-v2/stock/create-entry`

- **Published title:** Create Entry
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend:** accounting-microservice · `LedgerController#create`
- **Frontend ids:** LEDGER_API.CREATE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: description, voucherDescription, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, tcsCalculationMethod, referenceId (+15)
  - Review published-only fields: entryDate, chequeClearanceDate, compoundTotal
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers-v2`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, voucherType, entryDate, generateInvoice, chequeNumber, chequeClearanceDate, compoundTotal

### A18. PUT `/entry-apis-v2/stock/update-entry`

- **Published title:** Update Entry
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
- **Backend:** accounting-microservice · `LedgerController#update`
- **Frontend ids:** LEDGER_API.UNIVERSAL
- **Path params:** companyUniqueName, accountUniqueName, ledgerUniqueName
- **Query params:** branchUniqueName, newAccountUniqueName
- **Body type:** `LedgerRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: description, voucherDescription, voucherType, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson (+16)
  - Review published-only fields: total, particular, particularType, discounts, entryDate, chequeClearanceDate, taxes
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** transactions, total, particular, particularType, discounts, entryDate, chequeNumber, chequeClearanceDate, uniqueName, taxes

### A19. GET `/entry-apis-v2/stock/get-entry`

- **Published title:** Get Entry
- **Real API:** `GET /company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`
- **Backend:** accounting-microservice · `LedgerController#get`
- **Frontend ids:** LEDGER_API.GET_TRANSACTION
- **Path params:** companyUniqueName, accountUniqueName, ledgerUniqueName
- **Query params:** branchUniqueName, baseRef
- **Updates needed:**
  - Remove junk params (lang, Content-Type)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/ledgers/{ledgerUniqueName:.+}`

### A20. DELETE `/entry-apis-v2/stock/delete-entry`

- **Published title:** Delete Entry
- **Real API:** `DELETE /v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
- **Backend:** giddh-api-v2 · `LedgerV4Controller#deleteLedger`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName, ledgerUniqueName
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/{ledgerUniqueName:.+}`
  - Matched route is not used by current frontend

### A21. DELETE `/entry-apis-v2/bulk-delete`

- **Published title:** Bulk delete
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/bulk-ledgers-v2`
- **Backend:** accounting-microservice · `LedgerController#bulkCreate`
- **Frontend ids:** LEDGER_API.CREATE_BULK
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `List<LedgerRequest>`
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Add/update payload fields from backend: description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName (+18)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/bulk-ledgers-v2`
- **Backend fields:** description, voucherDescription, voucherType, chequeNumber, generateInvoice, copyBillingAddressToShippingAddress, readDetailsFromAccount, attachedFile, exchangeRate, ewayBillDetails, valuesInAccountCurrency, selectAllFields, tagNames, transactionId, salesPersonUniqueName, salesPerson, transactions, tcsCalculationMethod, referenceId, sendToGstr2, invoiceNumberAgainstVoucher, touristSchemeApplicable, passportNumber, mergePB, generateEInvoice, entryClass, applyApplicableTaxes, applyApplicableDiscounts, isInclusiveTax, tallyUniqueId, oldAccountUniqueName, uniqueName, giddhImportRefId, entryUniqueNames
- **Published fields:** entryUniqueNames

### A22. POST `/entry-apis-v2/attach-file`

- **Published title:** Attach file
- **Real API:** `POST /company/{companyUniqueName}/ledger/upload`
- **Backend:** giddh-api-v2 · `ImageController#uploadFileForLedger`
- **Frontend ids:** COMMON_API.UPLOAD_FILE
- **Path params:** companyUniqueName
- **Query params:** entries, type
- **Updates needed:**
  - Remove junk params (lang, 0)
  - Set published path to real route: `/company/{companyUniqueName}/ledger/upload`

### A23. POST `/voucher-apis-v2/service/create-voucher`

- **Published title:** Create voucher
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend:** giddh-api-v2 · `VoucherController#get`
- **Frontend ids:** RECEIPT_API.GET_DETAILS
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** refresh
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, Content-Type, content-type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Review published-only fields: number, uniqueName, attachedFiles, attachedFileName, roundOffApplicable, updateAccountDetails, valuesInAccountCurrency, exchangeRate, dueDate, date, account, entries, warehouse, deposit
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
- **Published fields:** number, uniqueName, attachedFiles, attachedFileName, roundOffApplicable, updateAccountDetails, valuesInAccountCurrency, exchangeRate, dueDate, date, account, entries, warehouse, deposit

### A24. PUT `/voucher-apis-v2/service/update-voucher`

- **Published title:** Update Voucher
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend:** giddh-api-v2 · `VoucherController#update`
- **Frontend ids:** RECEIPT_API.PUT, SALES_API_V2.UPDATE_VOUCHER
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** refresh
- **Body type:** `VoucherRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Add/update payload fields from backend: entryUniqueNames, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, branch, salesPersonUniqueName, salesPerson
  - Review published-only fields: number, uniqueName, mergePB, passportNumber, subVoucher, attachedFiles, attachedFileName, templateDetails, status, referenceVoucher, valuesInAccountCurrency, exchangeRate, date, touristSchemeApplicable, company (+5)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend fields:** entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch, salesPersonUniqueName, salesPerson
- **Published fields:** number, uniqueName, mergePB, passportNumber, subVoucher, attachedFiles, attachedFileName, roundOffApplicable, updateAccountDetails, templateDetails, status, referenceVoucher, valuesInAccountCurrency, exchangeRate, dueDate, date, touristSchemeApplicable, company, account, entries, warehouse, deposit, adjustments

### A25. DELETE `/voucher-apis-v2/service/delete-voucher`

- **Published title:** Delete Voucher
- **Real API:** `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend:** giddh-api-v2 · `VoucherController#deleteInvoice`
- **Frontend ids:** INVOICE_API_2.DELETE_VOUCHER, RECEIPT_API.DELETE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, content-type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Review published-only fields: entryUniqueNames
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
- **Published fields:** entryUniqueNames

### A26. GET `/voucher-apis-v2/service/get-voucher`

- **Published title:** Get Voucher
- **Real API:** `GET /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
- **Backend:** giddh-api-v2 · `VoucherV4Controller#getAllAdvanceReceipts`
- **Frontend ids:** ADVANCE_RECEIPTS_API.GET_ALL_ADVANCE_RECEIPTS
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** invoiceDate, branchUniqueName
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
- **Published fields:** number, uniqueName

### A27. POST `/voucher-apis-v2/stock/create-voucher`

- **Published title:** Create voucher
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend:** giddh-api-v2 · `VoucherController#get`
- **Frontend ids:** RECEIPT_API.GET_DETAILS
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** refresh
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (t, z, lang, 0, Content-Type, content-type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Review published-only fields: account, updateAccountDetails, entries, date, exchangeRate, dueDate, deposit, warehouse
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
- **Published fields:** account, updateAccountDetails, entries, date, exchangeRate, dueDate, deposit, warehouse

### A28. PUT `/voucher-apis-v2/stock/update-voucher`

- **Published title:** Update Voucher
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend:** giddh-api-v2 · `VoucherController#update`
- **Frontend ids:** RECEIPT_API.PUT, SALES_API_V2.UPDATE_VOUCHER
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** refresh
- **Body type:** `VoucherRequest`
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Add/update payload fields from backend: entryUniqueNames, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, branch, salesPersonUniqueName, salesPerson
  - Review published-only fields: account, entries, date, exchangeRate, number, uniqueName, adjustments, warehouse
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend fields:** entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch, salesPersonUniqueName, salesPerson
- **Published fields:** account, updateAccountDetails, entries, date, exchangeRate, dueDate, number, uniqueName, roundOffApplicable, adjustments, warehouse

### A29. GET `/voucher-apis-v2/stock/get-voucher`

- **Published title:** Get Voucher
- **Real API:** `GET /v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`
- **Backend:** giddh-api-v2 · `VoucherV4Controller#getAllAdvanceReceipts`
- **Frontend ids:** ADVANCE_RECEIPTS_API.GET_ALL_ADVANCE_RECEIPTS
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** invoiceDate, branchUniqueName
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Set published path to real route: `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/advance-receipt/all`

### A30. DELETE `/voucher-apis-v2/stock/delete-voucher`

- **Published title:** Delete Voucher
- **Real API:** `DELETE /company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend:** giddh-api-v2 · `VoucherController#deleteInvoice`
- **Frontend ids:** INVOICE_API_2.DELETE_VOUCHER, RECEIPT_API.DELETE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** branchUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Review published-only fields: uniqueName
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
- **Published fields:** voucherType, uniqueName

### A31. POST `/voucher-apis-v2/mail-voucher`

- **Published title:** Mail voucher
- **Real API:** `POST /v2/verify-email`
- **Backend:** giddh-api-v2 · `LoginV2Controller#verifyEmailV2`
- **Frontend ids:** LOGIN_API.VerifyEmail
- **Body type:** `EmailRequest`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Add/update payload fields from backend: email, verificationCode, retryCount
  - Set published path to real route: `/v2/verify-email`
- **Backend fields:** email, verificationCode, retryCount

### A32. POST `/voucher-apis-v2/cancel-voucher`

- **Published title:** Cancel voucher
- **Real API:** `POST /company/{companyUniqueName}/invoice/{invoiceUniqueName}/cancel-einvoice`
- **Backend:** giddh-api-v2 · `InvoiceController#cancelEInvoice`
- **Frontend ids:** INVOICE_API.CANCEL_E_INVOICE_API
- **Path params:** companyUniqueName, invoiceUniqueName
- **Query params:** cnlRsn, cnlRem
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/invoice/{invoiceUniqueName}/cancel-einvoice`

### A33. POST `/voucher-apis-v2/paid-voucher`

- **Published title:** Paid voucher
- **Real API:** `POST /v2/subscription/add-payment-method`
- **Backend:** giddh-api-v2 · `SubscriptionControllerV2#addPaymentMethod`
- **Frontend ids:** SUBSCRIPTION_V2_API.SAVE_PAYMENT_METHOD
- **Body type:** `SubscriptionRequest`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Add/update payload fields from backend: planUniqueName, balance, userUniqueName, expireDate, status, subscriptionId, duration, licenceKey, promoCode, addOnTransactions, paymentProvider, billingAccount, returnUrl, affiliateId, trialExtendedDays (+21)
  - Set published path to real route: `/v2/subscription/add-payment-method`
- **Backend fields:** planUniqueName, balance, userUniqueName, expireDate, status, subscriptionId, duration, licenceKey, promoCode, addOnTransactions, paymentProvider, billingAccount, returnUrl, affiliateId, trialExtendedDays, paymentId, amountPaid, razorpaySignature, razorpayOrderId, payuTransactionId, paymentIntentId, paypalOrderId, payNow, taxTotal, bankDetails, razorpayAuthType, countryCode, prePaid, prepaidUniqueName, includeNextBill, googlePayPurchaseToken, providerPlanName, autoPay, renew, walletAmount, reactivateFromSubscriptionId

### A34. POST `/voucher-apis-v2/get-all-vouchers`

- **Published title:** Get all vouchers
- **Real API:** `POST /company/{companyUniqueName}/vouchers/get-all`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#getAllVouchers`
- **Frontend ids:** RECEIPT_API.GET_ALL
- **Path params:** companyUniqueName
- **Query params:** page, count, from, to, type, sort, sortBy, invoiceCount, q, branchUniqueName
- **Body type:** `VoucherFilter`
- **Updates needed:**
  - Remove junk params (lang, 0, content-type)
  - Add/update payload fields from backend: value, voucherCopyType, downloadCopyFileName, downloadCopyValue, downloadCopyTypeList, copyTypes, sendTo, voucherUniqueNames, balanceStatus, status, accountUniqueName, voucherNumber, proformaNumber, balanceDue, dueDate (+17)
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/get-all`
- **Backend fields:** value, voucherCopyType, downloadCopyFileName, downloadCopyValue, downloadCopyTypeList, copyTypes, sendTo, voucherUniqueNames, balanceStatus, status, accountUniqueName, voucherNumber, proformaNumber, balanceDue, dueDate, invoiceDate, balanceMoreThan, balanceEqual, balanceLessThan, dueDateBefore, dueDateAfter, dueDateEqual, invoiceDateBefore, invoiceDateAfter, invoiceDateEqual, companyName, groupUniqueName, totalMoreThan, totalLessThan, totalEqual, total, description

### A35. POST `/voucher-apis-v2/bulk-delete-vouchers`

- **Published title:** Bulk delete vouchers
- **Real API:** `POST /company/{companyUniqueName}/vouchers/bulk-update`
- **Backend:** giddh-api-v2 · `BulkUpdateController#updateInvoices`
- **Frontend ids:** BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION
- **Path params:** companyUniqueName
- **Query params:** action, branchUniqueName
- **Body type:** `BulkUpdateInvoiceRequest`
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type, content-type)
  - Add/update payload fields from backend: voucherNumbers, voucherType, templateUniqueName, message1, message2, imageSignatureUniqueName, slogan, dueDate, shippingDetails, customField1, customField2, customField3
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/bulk-update`
- **Backend fields:** voucherNumbers, voucherType, templateUniqueName, message1, message2, imageSignatureUniqueName, slogan, dueDate, shippingDetails, customField1, customField2, customField3

### A36. POST `/voucher-apis-v2/export-voucher`

- **Published title:** Export voucher
- **Real API:** `POST /company/{companyUniqueName}/export-invoices-v2`
- **Backend:** accounting-microservice · `VoucherController#exportVouchersWithExportSettings`
- **Frontend ids:** INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV
- **Path params:** companyUniqueName
- **Query params:** branchUniqueName, from, to, type, noteType, sort, sortBy, voucherCount, q, fileType
- **Body type:** `VoucherFilter`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Add/update payload fields from backend: type, noteVoucherType, fromDate, toDate, receiptType, source, attachmentExport, selectAllFields, voucherExport, fileNameFormat, showVoucherCustomFields, showAccountCustomFields, showBillingAddress, showShippingAddress, showTaxableValueBeforeDiscount (+53)
  - Set published path to real route: `/company/{companyUniqueName}/export-invoices-v2`
- **Backend fields:** type, noteVoucherType, fromDate, toDate, receiptType, source, attachmentExport, selectAllFields, voucherExport, fileNameFormat, showVoucherCustomFields, showAccountCustomFields, showBillingAddress, showShippingAddress, showTaxableValueBeforeDiscount, showDiscountValue, showTaxValue, showShippingDetails, showVoucherNote, showEInvoiceDetails, showMobileNumber, showAttentionTo, showEmail, showOtherTaxValue, dueDate, dueDateBefore, dueDateAfter, dueDateEqual, voucherDate, voucherDateBefore, voucherDateAfter, voucherDateEqual, page, count, sort, sortBy, q, fileType, voucherCount, groupIds, accountIds, voucherIds, uniqueNames, entryUniqueNames, balanceDue, balanceEqual, balanceMoreThan, balanceLessThan, total, totalEqual, totalMoreThan, totalLessThan, description, accountUniqueName, groupUniqueName, copyTypes, eInvoiceStatus, balanceStatus, purchaseOrderNumber, companyUniqueName, branchUniqueName, userId, exportType, totalVouchers, requestId, mergePdf, exportFromLedger, salesPersonUniqueNames

### A37. POST `/voucher-apis-v2/generate-bulk-vouchers`

- **Published title:** Generate bulk vouchers
- **Real API:** `POST /company/{companyUniqueName}/vouchers/bulk-update`
- **Backend:** giddh-api-v2 · `BulkUpdateController#updateInvoices`
- **Frontend ids:** BULK_UPDATE_VOUCHER.BULK_UPDATE_VOUCHER_ACTION
- **Path params:** companyUniqueName
- **Query params:** action, branchUniqueName
- **Body type:** `BulkUpdateInvoiceRequest`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Add/update payload fields from backend: voucherNumbers, voucherType, templateUniqueName, message1, message2, imageSignatureUniqueName, slogan, dueDate, shippingDetails, customField1, customField2, customField3
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/bulk-update`
- **Backend fields:** voucherNumbers, voucherType, templateUniqueName, message1, message2, imageSignatureUniqueName, slogan, dueDate, shippingDetails, customField1, customField2, customField3

### A38. POST `/proforma-apis/generate-proforma`

- **Published title:** Generate Proforma
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, 1, Content-Type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A39. POST `/proforma-apis/get-proforma`

- **Published title:** Get Proforma
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, 1, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A40. DELETE `/proforma-apis/delete-proforma`

- **Published title:** Delete Proforma
- **Real API:** `DELETE /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
- **Backend:** giddh-api-v2 · `ProformaV2Controller#deleteProforma`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
  - Matched route is not used by current frontend
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A41. POST `/proforma-apis/mail-proforma`

- **Published title:** Mail Proforma
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A42. POST `/proforma-apis/get-all-proformas`

- **Published title:** Get All Proformas
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A43. PUT `/proforma-apis/update-proforma`

- **Published title:** Update Proforma
- **Real API:** `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
- **Backend:** giddh-api-v2 · `ProformaV2Controller#updateProforma`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `VoucherRequest`
- **Updates needed:**
  - Remove junk params (0, 1, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
  - Matched route is not used by current frontend
- **Backend fields:** entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch, salesPersonUniqueName, salesPerson

### A44. POST `/proforma-apis/generate-invoice-from-proforma`

- **Published title:** Generate Invoice From Proforma
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, 1, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A45. PUT `/proforma-apis/update-action-over-proforma`

- **Published title:** Update Action Over Proforma
- **Real API:** `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
- **Backend:** giddh-api-v2 · `ProformaV2Controller#updateProforma`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `VoucherRequest`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas`
  - Matched route is not used by current frontend
- **Backend fields:** entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch, salesPersonUniqueName, salesPerson

### A46. POST `/proforma-apis/get-all-proforma-version`

- **Published title:** Get All Proforma Version
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A47. POST `/proforma-apis/get-all-proforma-versions-v2-api`

- **Published title:** Get all proforma versions v2 api
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A48. POST `/estimation-apis/generate-estimate`

- **Published title:** Generate Estimate
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A49. POST `/estimation-apis/get-estimate`

- **Published title:** Get Estimate
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A50. PUT `/estimation-apis/update-estimate`

- **Published title:** Update Estimate
- **Real API:** `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
- **Backend:** giddh-api-v2 · `EstimateController#updateEstimate`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `VoucherRequest`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
  - Matched route is not used by current frontend
- **Backend fields:** entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch, salesPersonUniqueName, salesPerson

### A51. DELETE `/estimation-apis/delete-estimate`

- **Published title:** Delete Estimate
- **Real API:** `DELETE /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
- **Backend:** giddh-api-v2 · `EstimateController#deleteEstimate`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
  - Matched route is not used by current frontend
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A52. POST `/estimation-apis/mail-estimate`

- **Published title:** Mail Estimate
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A53. POST `/estimation-apis/get-all-estimates`

- **Published title:** Get All Estimates
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A54. POST `/estimation-apis/generate-invoice-from-estimate`

- **Published title:** Generate Invoice From Estimate
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A55. POST `/estimation-apis/get-all-estimate-version`

- **Published title:** Get All Estimate Version
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A56. PUT `/estimation-apis/update-action-over-estimate`

- **Published title:** Update Action Over Estimate
- **Real API:** `PUT /v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
- **Backend:** giddh-api-v2 · `EstimateController#updateEstimate`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `VoucherRequest`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch (+2)
  - Set published path to real route: `/v2/company/{companyUniqueName}/accounts/{accountUniqueName}/estimates`
  - Matched route is not used by current frontend
- **Backend fields:** entryUniqueNames, dueDate, voucher, validateTax, taxes, applyApplicableTaxes, paymentAction, updateAccountDetails, depositAccountUniqueName, oldVersions, oldEstimateVersions, isEcommerceInvoice, action, roundOffApplicable, branch, salesPersonUniqueName, salesPerson

### A57. POST `/estimation-apis/get-estimate-version`

- **Published title:** Get Estimate Version
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A58. POST `/estimation-apis/generate-proforma-from-estimate`

- **Published title:** Generate Proforma From Estimate
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaProformaV3`
- **Frontend ids:** PROFORMA_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-proforma`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A59. POST `/estimation-apis/get-all-estimates-version-v2-api`

- **Published title:** Get all estimates version v2 api
- **Real API:** `POST /company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend:** giddh-api-v2 · `CompanyVoucherController#generateVoucherViaEstimateV3`
- **Frontend ids:** ESTIMATES_API.generateInvoice
- **Path params:** companyUniqueName, accountUniqueName
- **Body type:** `CustomInvoiceNumberRequestBody`
- **Updates needed:**
  - Remove junk params (0, 1, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId
  - Set published path to real route: `/company/{companyUniqueName}/vouchers/accounts/{accountUniqueName}/v3/generate-via-estimate`
- **Backend fields:** proformaNumber, estimateNumber, invoiceNumber, voucherType, estimateVersionNumber, debugMode, generateEInvoice, emailId

### A60. POST `/tax-apis/asssign-tax`

- **Published title:** asssign tax
- **Real API:** `POST /company/{companyUniqueName}/tax`
- **Backend:** giddh-api-v2 · `TaxController#create`
- **Frontend ids:** COMPANY_API.TAX
- **Path params:** companyUniqueName
- **Query params:** updateEntries
- **Body type:** `TaxRequest`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: taxNumber, name, accounts, taxDetail, duration, taxFileDate, taxType, isInputGst, isTallySync, countries, taxAuthorityRequest
  - Set published path to real route: `/company/{companyUniqueName}/tax`
- **Backend fields:** taxNumber, name, accounts, taxDetail, duration, taxFileDate, taxType, isInputGst, isTallySync, countries, taxAuthorityRequest

### A61. POST `/tax-apis/create-tax`

- **Published title:** Create tax
- **Real API:** `POST /company/{companyUniqueName}/tax`
- **Backend:** giddh-api-v2 · `TaxController#create`
- **Frontend ids:** COMPANY_API.TAX
- **Path params:** companyUniqueName
- **Query params:** updateEntries
- **Body type:** `TaxRequest`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: taxNumber, name, accounts, taxDetail, duration, taxFileDate, taxType, isInputGst, isTallySync, countries, taxAuthorityRequest
  - Set published path to real route: `/company/{companyUniqueName}/tax`
- **Backend fields:** taxNumber, name, accounts, taxDetail, duration, taxFileDate, taxType, isInputGst, isTallySync, countries, taxAuthorityRequest

### A62. GET `/tax-apis/get-all-tax`

- **Published title:** get all tax
- **Real API:** `GET /ui/taxes`
- **Backend:** giddh-api-v2 · `UIController#formDataForTaxes`
- **Frontend ids:** COMPANY_API.GET_ALL_TAXES, COMMON_API.TAXES
- **Query params:** country, refresh
- **Updates needed:**
  - Remove junk params (0)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Set published path to real route: `/ui/taxes`

### A63. POST `/tax-apis/create-stock-group-and-assign-tax`

- **Published title:** Create stock group and assign tax
- **Real API:** `POST /company/{companyUniqueName}/stock-group`
- **Backend:** giddh-api-v2 · `StockGroupController#create`
- **Frontend ids:** INVENTORY_API.CREATE_STOCK_GROUP
- **Path params:** companyUniqueName
- **Body type:** `StockGroupResource`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: taxes, discounts
  - Set published path to real route: `/company/{companyUniqueName}/stock-group`
- **Backend fields:** taxes, discounts

### A64. POST `/tax-apis/create-stock-and-assign-tax`

- **Published title:** create stock and assign tax
- **Real API:** `POST /v2/company/{companyUniqueName}/stock`
- **Backend:** giddh-api-v2 · `StockV2Controller#getDataForInventoryTable`
- **Frontend ids:** INVENTORY_API.GET_BULK_STOCK_WITH_INVENTROY_TYPE
- **Path params:** companyUniqueName
- **Query params:** page, count, inventoryType, branchUniqueName
- **Body type:** `InventoryTableFilter`
- **Updates needed:**
  - Remove junk params (0, Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Add/update payload fields from backend: search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters
  - Set published path to real route: `/v2/company/{companyUniqueName}/stock`
- **Backend fields:** search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters

### A65. GET `/report-apis/purchases-register-api/purchases-register-overview`

- **Published title:** Purchases Register Overview
- **Real API:** `GET /v2/company/{companyUniqueName}/purchases-register-overview`
- **Backend:** giddh-api-v2 · `ReportV2Controller#getPurchasesRegisterOverview`
- **Frontend ids:** COMPANY_API.GET_REGISTERED_PURCHASE
- **Path params:** companyUniqueName
- **Query params:** from, to, interval, branchUniqueName
- **Updates needed:**
  - Set published path to real route: `/v2/company/{companyUniqueName}/purchases-register-overview`

### A66. GET `/report-apis/purchases-register-api/purchases-register-detailed`

- **Published title:** Purchases Register Detailed
- **Real API:** `GET /v2/company/{companyUniqueName}/purchases-register-overview`
- **Backend:** giddh-api-v2 · `ReportV2Controller#getPurchasesRegisterOverview`
- **Frontend ids:** COMPANY_API.GET_REGISTERED_PURCHASE
- **Path params:** companyUniqueName
- **Query params:** from, to, interval, branchUniqueName
- **Updates needed:**
  - Set published path to real route: `/v2/company/{companyUniqueName}/purchases-register-overview`

### A67. GET `/report-apis/sales-register-api/sales-register-overview`

- **Published title:** Sales Register Overview
- **Real API:** `GET /v2/company/{companyUniqueName}/sales-register-overview`
- **Backend:** giddh-api-v2 · `ReportV2Controller#createSalesRegisterOverview`
- **Frontend ids:** COMPANY_API.GET_REGISTERED_SALES
- **Path params:** companyUniqueName
- **Query params:** from, to, branchUniqueName, interval
- **Updates needed:**
  - Set published path to real route: `/v2/company/{companyUniqueName}/sales-register-overview`

### A68. GET `/report-apis/sales-register-api/sales-register-detailed`

- **Published title:** Sales Register Detailed
- **Real API:** `GET /v2/company/{companyUniqueName}/sales-register-overview`
- **Backend:** giddh-api-v2 · `ReportV2Controller#createSalesRegisterOverview`
- **Frontend ids:** COMPANY_API.GET_REGISTERED_SALES
- **Path params:** companyUniqueName
- **Query params:** from, to, branchUniqueName, interval
- **Updates needed:**
  - Set published path to real route: `/v2/company/{companyUniqueName}/sales-register-overview`

### A69. GET `/report-apis/trial-balance-api`

- **Published title:** Trial Balance Api
- **Real API:** `GET /company/{companyUniqueName}/trial-balance-export-v2`
- **Backend:** giddh-api-v2 · `ReportController#trialBalanceExportV2`
- **Frontend ids:** TB_PL_BS_API.DOWNLOAD_TRIAL_BALANCE_EXCEL
- **Path params:** companyUniqueName
- **Query params:** from, to, export, q, refresh, fileType, branchUniqueName
- **Updates needed:**
  - Set published path to real route: `/company/{companyUniqueName}/trial-balance-export-v2`

### A70. GET `/report-apis/balance-sheet-api`

- **Published title:** Balance Sheet Api
- **Real API:** `GET /v2/company/{companyUniqueName}/multibranch/balance-sheet`
- **Backend:** giddh-api-v2 · `ReportV2Controller#balanceSheetForMultiBranch`
- **Frontend ids:** TB_PL_BS_API.GET_BALANCE_SHEET
- **Path params:** companyUniqueName
- **Query params:** from, to, refresh, tagName, considerOpeningBalance, tax, branchUniqueName
- **Updates needed:**
  - Set published path to real route: `/v2/company/{companyUniqueName}/multibranch/balance-sheet`

### A71. GET `/report-apis/export-invoice-api`

- **Published title:** Export Invoice Api
- **Real API:** `GET /company/{companyUniqueName}/export-invoices`
- **Backend:** giddh-api-v2 · `ImportExportController#exportInvoices`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName
- **Query params:** branchUniqueName, from, to, fileType
- **Body type:** `VoucherFilter`
- **Updates needed:**
  - Add/update payload fields from backend: value, voucherCopyType, downloadCopyFileName, downloadCopyValue, downloadCopyTypeList, copyTypes, sendTo, voucherUniqueNames, balanceStatus, status, accountUniqueName, voucherNumber, proformaNumber, balanceDue, dueDate (+17)
  - Set published path to real route: `/company/{companyUniqueName}/export-invoices`
  - Matched route is not used by current frontend
- **Backend fields:** value, voucherCopyType, downloadCopyFileName, downloadCopyValue, downloadCopyTypeList, copyTypes, sendTo, voucherUniqueNames, balanceStatus, status, accountUniqueName, voucherNumber, proformaNumber, balanceDue, dueDate, invoiceDate, balanceMoreThan, balanceEqual, balanceLessThan, dueDateBefore, dueDateAfter, dueDateEqual, invoiceDateBefore, invoiceDateAfter, invoiceDateEqual, companyName, groupUniqueName, totalMoreThan, totalLessThan, totalEqual, total, description

### A72. GET `/report-apis/customer-vendor-report-api`

- **Published title:** Customer / Vendor Report Api
- **Real API:** `GET /company/{companyUniqueName}/customer-vendor-discount/get-all-users`
- **Backend:** giddh-api-v2 · `CustomerVendorVariantDiscountController#getCustomerVendorList`
- **Frontend ids:** INVENTORY_API.GET_CUSTOMER_VENDOR_DISCOUNT_USERS
- **Path params:** companyUniqueName
- **Query params:** groupUniqueName, query, userType, page, count
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/customer-vendor-discount/get-all-users`

### A73. POST `/report-apis/aging-report-api`

- **Published title:** Aging report api
- **Real API:** `POST /v2/company/{companyUniqueName}/stock-aging-report`
- **Backend:** giddh-api-v2 · `StockAgingReportController#getStockAgingReport`
- **Frontend ids:** INVENTORY_API.STOCK_AGING_REPORT
- **Path params:** companyUniqueName
- **Query params:** page, count, branchUniqueName
- **Body type:** `StockAgingReportRequest`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: branchUniqueNames, warehouseUniqueNames, stockGroupUniqueNames, categoryUniqueNames, variantUniqueNames, asOnDate, page, count, sort, sortBy, searchText, refresh, interval
  - Set published path to real route: `/v2/company/{companyUniqueName}/stock-aging-report`
- **Backend fields:** branchUniqueNames, warehouseUniqueNames, stockGroupUniqueNames, categoryUniqueNames, variantUniqueNames, asOnDate, page, count, sort, sortBy, searchText, refresh, interval

### A74. POST `/report-apis/daybook-report-api`

- **Published title:** Daybook report api
- **Real API:** `POST /company/{companyUniqueName}/daybook`
- **Backend:** giddh-api-v2 · `CompanyController#getDaybookV2`
- **Frontend ids:** DAYBOOK_SEARCH_API.SEARCH
- **Path params:** companyUniqueName
- **Query params:** page, count, from, to, sort, branchUniqueName
- **Body type:** `EntryFilter`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars (+10)
  - Set published path to real route: `/company/{companyUniqueName}/daybook`
- **Backend fields:** groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars, isInvoiceGenerated, includeTag, tags, chequeNumber, dateOnCheque, inventory, cancelledEntries, balanceTypeAsSign, chequeDate, selectAllFields

### A75. POST `/inventory-apis-v2/stock-group/create-group`

- **Published title:** create group
- **Real API:** `POST /company/{companyUniqueName}/stock-group`
- **Backend:** giddh-api-v2 · `StockGroupController#create`
- **Frontend ids:** INVENTORY_API.CREATE_STOCK_GROUP
- **Path params:** companyUniqueName
- **Body type:** `StockGroupResource`
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type, content-type)
  - Add/update payload fields from backend: taxes, discounts
  - Set published path to real route: `/company/{companyUniqueName}/stock-group`
- **Backend fields:** taxes, discounts

### A76. PUT `/inventory-apis-v2/stock-group/update-group-api`

- **Published title:** Update group api
- **Real API:** `PUT /company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
- **Backend:** giddh-api-v2 · `StockGroupController#update`
- **Frontend ids:** INVENTORY_API.UPDATE_STOCK_GROUP
- **Path params:** companyUniqueName, stockGroupUniqueName
- **Body type:** `StockGroupResource`
- **Updates needed:**
  - Remove junk params (lang, 0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: taxes, discounts
  - Set published path to real route: `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
- **Backend fields:** taxes, discounts

### A77. GET `/inventory-apis-v2/stock-group/get-group-api`

- **Published title:** get group api
- **Real API:** `GET /company/{companyUniqueName}/stock-groups-with-stocks`
- **Backend:** search-api · `MastersController#stockGroupsWithStocks`
- **Frontend ids:** INVENTORY_API.MASTER.SEARCH
- **Path params:** companyUniqueName
- **Query params:** q, refresh, inventoryType
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/stock-groups-with-stocks`

### A78. DELETE `/inventory-apis-v2/stock-group/delete-group-api`

- **Published title:** delete group api
- **Real API:** `DELETE /company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`
- **Backend:** giddh-api-v2 · `StockGroupController#delete`
- **Frontend ids:** INVENTORY_API.DELETE_STOCK_GROUP
- **Path params:** companyUniqueName, stockGroupUniqueName
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}`

### A79. POST `/inventory-apis-v2/stocks/create-stock`

- **Published title:** create stock
- **Real API:** `POST /company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock`
- **Backend:** giddh-api-v2 · `StockWithGroupController#create`
- **Frontend ids:** INVENTORY_API.CREATE_STOCK, INVENTORY_API.NEW.CREATE
- **Path params:** companyUniqueName, stockGroupUniqueName
- **Query params:** source
- **Body type:** `StockResource`
- **Updates needed:**
  - Remove junk params (lang, 0, 1, content-type)
  - Add/update payload fields from backend: taxes, updateBranchCompStocks, rowNum, requestId
  - Set published path to real route: `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock`
- **Backend fields:** taxes, updateBranchCompStocks, rowNum, requestId

### A80. PUT `/inventory-apis-v2/stocks/update-stock`

- **Published title:** Update stock
- **Real API:** `PUT /v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
- **Backend:** giddh-api-v2 · `StockWithGroupV2Controller#update`
- **Frontend ids:** INVENTORY_API.UPDATE_STOCK_V2
- **Path params:** companyUniqueName, stockGroupUniqueName, stockUniqueName
- **Query params:** source
- **Body type:** `StockResourceV2`
- **Updates needed:**
  - Remove junk params (lang, 0, 1, Content-Type, content-type)
  - Add/update payload fields from backend: taxes, discounts, updateBranchCompStocks, rowNum, requestId
  - Set published path to real route: `/v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
- **Backend fields:** taxes, discounts, updateBranchCompStocks, rowNum, requestId

### A81. GET `/inventory-apis-v2/stocks/get-stock`

- **Published title:** get stock
- **Real API:** `GET /stock-units`
- **Backend:** giddh-api-v2 · `MainController#getStocks`
- **Frontend ids:** COMMON_API.STOCK_UNITS
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type, content-type)
  - Set published path to real route: `/stock-units`

### A82. DELETE `/inventory-apis-v2/stocks/delete-stock`

- **Published title:** delete stock
- **Real API:** `DELETE /v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`
- **Backend:** giddh-api-v2 · `StockWithGroupV2Controller#delete`
- **Frontend ids:** INVENTORY_API.DELETE_STOCK_V2
- **Path params:** companyUniqueName, stockGroupUniqueName, stockUniqueName
- **Updates needed:**
  - Remove junk params (lang, 0, 1, Content-Type, content-type)
  - Set published path to real route: `/v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}`

### A83. POST `/inventory-apis-v2/stocks/get-all-stocks`

- **Published title:** get all stocks
- **Real API:** `POST /company/{companyUniqueName}/sync-data/stocks`
- **Backend:** giddh-api-v2 · `EcommerceDataController#processQueue`
- **Frontend ids:** n/a
- **Path params:** companyUniqueName
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/sync-data/stocks`
  - Matched route is not used by current frontend

### A84. POST `/inventory-apis-v2/inventory-report/group-wise-report`

- **Published title:** Group wise report
- **Real API:** `POST /v2/company/{companyUniqueName}/stock`
- **Backend:** giddh-api-v2 · `StockV2Controller#getDataForInventoryTable`
- **Frontend ids:** INVENTORY_API.GET_BULK_STOCK_WITH_INVENTROY_TYPE
- **Path params:** companyUniqueName
- **Query params:** page, count, inventoryType, branchUniqueName
- **Body type:** `InventoryTableFilter`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Add/update payload fields from backend: search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters
  - Set published path to real route: `/v2/company/{companyUniqueName}/stock`
- **Backend fields:** search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters

### A85. POST `/inventory-apis-v2/inventory-report/item-wise-report-api`

- **Published title:** item wise report api
- **Real API:** `POST /v2/company/{companyUniqueName}/stock`
- **Backend:** giddh-api-v2 · `StockV2Controller#getDataForInventoryTable`
- **Frontend ids:** INVENTORY_API.GET_BULK_STOCK_WITH_INVENTROY_TYPE
- **Path params:** companyUniqueName
- **Query params:** page, count, inventoryType, branchUniqueName
- **Body type:** `InventoryTableFilter`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Add/update payload fields from backend: search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters
  - Set published path to real route: `/v2/company/{companyUniqueName}/stock`
- **Backend fields:** search, searchBy, sort, sortBy, filterBy, expression, rate, searchParameters, sortParameters, filterParameters

### A86. POST `/inventory-apis-v2/inventory-report/variant-report-api`

- **Published title:** Variant report api
- **Real API:** `POST /company/{companyUniqueName}/inventory-users`
- **Backend:** giddh-api-v2 · `InventoryUserController#createInventoryUser`
- **Frontend ids:** INVENTORY_API.USER.CREATE
- **Path params:** companyUniqueName
- **Body type:** `InventoryUserResource`
- **Updates needed:**
  - Remove junk params (lang, 0, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/inventory-users`

### A87. POST `/inventory-apis-v2/inventory-report/transaction-report-api`

- **Published title:** transaction report api
- **Real API:** `POST /company/{companyUniqueName}/inventory-users`
- **Backend:** giddh-api-v2 · `InventoryUserController#createInventoryUser`
- **Frontend ids:** INVENTORY_API.USER.CREATE
- **Path params:** companyUniqueName
- **Body type:** `InventoryUserResource`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/inventory-users`

### A88. POST `/inventory-apis-v2/inventory-report/balance-api-`

- **Published title:** balance api 
- **Real API:** `POST /company/{companyUniqueName}/inventory-users`
- **Backend:** giddh-api-v2 · `InventoryUserController#createInventoryUser`
- **Frontend ids:** INVENTORY_API.USER.CREATE
- **Path params:** companyUniqueName
- **Body type:** `InventoryUserResource`
- **Updates needed:**
  - Remove junk params (lang, Content-Type, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/inventory-users`
- **Published fields:** stockGroupUniqueNames, stockUniqueNames, accountName, param, expression, val, warehouseUniqueNames, branchUniqueNames, variantUniqueNames, voucherTypes, inventoryType

### A89. GET `/dashboard-apis/profit-loss`

- **Published title:** Profit-loss
- **Real API:** `GET /v2/company/{companyUniqueName}/multibranch/profit-loss`
- **Backend:** giddh-api-v2 · `ReportV2Controller#profitLossForMultiBranch`
- **Frontend ids:** TB_PL_BS_API.GET_PROFIT_LOSS
- **Path params:** companyUniqueName
- **Query params:** refresh, from, to, tax, tagName, considerOpeningBalance, branchUniqueName
- **Updates needed:**
  - Remove junk params (t, z, lang, Content-Type, content-type)
  - Set published path to real route: `/v2/company/{companyUniqueName}/multibranch/profit-loss`

### A90. POST `/dashboard-apis/voucher-count-api-`

- **Published title:** voucher count api 
- **Real API:** `POST /company/{companyUniqueName}/discount`
- **Backend:** giddh-api-v2 · `DiscountController#create`
- **Frontend ids:** SETTINGS_DISCOUNT_API.COMMON
- **Path params:** companyUniqueName
- **Body type:** `DiscountRequest`
- **Updates needed:**
  - Remove junk params (lang, 0, content-type)
  - Add/update payload fields from backend: name, type, discountValue, accountUniqueName, variantDiscount, price, quantity, taxInclusive, discountExclusive, stockUnitUniqueName, variantUniqueName, discounts, type, value, uniqueName
  - Set published path to real route: `/company/{companyUniqueName}/discount`
- **Backend fields:** name, type, discountValue, accountUniqueName, variantDiscount, price, quantity, taxInclusive, discountExclusive, stockUnitUniqueName, variantUniqueName, discounts, type, value, uniqueName

### A91. POST `/dashboard-apis/voucher-balance-api`

- **Published title:** voucher balance api
- **Real API:** `POST /company/{companyUniqueName}/inventory/balance`
- **Backend:** giddh-api-v2 · `InventoryReportController#getInventoryBalance`
- **Frontend ids:** INVENTORY_API.TRANSACTION_STOCK_REPORT_BALANCE_V2
- **Path params:** companyUniqueName
- **Query params:** from, to, count, stockGroupUniqueName, entity, branchUniqueName, reportNature
- **Body type:** `InventoryReportsFilter`
- **Updates needed:**
  - Remove junk params (lang, 0, content-type)
  - Add/update payload fields from backend: expression, param, val, accountName, voucherTypes, branchUniqueNames, warehouseUniqueNames, variantUniqueNames, batchUniqueNames, batchNumbers, stockUniqueNames, stockGroupUniqueNames, inventoryType, inventoryAdjustmentRefNo, archived (+1)
  - Set published path to real route: `/company/{companyUniqueName}/inventory/balance`
- **Backend fields:** expression, param, val, accountName, voucherTypes, branchUniqueNames, warehouseUniqueNames, variantUniqueNames, batchUniqueNames, batchNumbers, stockUniqueNames, stockGroupUniqueNames, inventoryType, inventoryAdjustmentRefNo, archived, reportNature

### A92. POST `/petty-cash-manager-api-s/create-petty-cash-entry`

- **Published title:** create petty cash entry
- **Real API:** `POST /company/{companyUniqueName}/pettycash-manager/report`
- **Backend:** giddh-api-v2 · `PettyCashManagerCompanyController#getPettyCashAdminReport`
- **Frontend ids:** EXPENSE_API.GET
- **Path params:** companyUniqueName
- **Query params:** page, count, sortBy, sort, branchUniqueName
- **Body type:** `PettyCashAdminFilter`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add/update payload fields from backend: statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
  - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/report`
- **Backend fields:** statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName

### A93. POST `/petty-cash-manager-api-s/petty-cash-entry-action-api`

- **Published title:** petty cash entry action api
- **Real API:** `POST /company/{companyUniqueName}/pettycash-manager/report`
- **Backend:** giddh-api-v2 · `PettyCashManagerCompanyController#getPettyCashAdminReport`
- **Frontend ids:** EXPENSE_API.GET
- **Path params:** companyUniqueName
- **Query params:** page, count, sortBy, sort, branchUniqueName
- **Body type:** `PettyCashAdminFilter`
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Add/update payload fields from backend: statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
  - Review published-only fields: ledgerRequest
  - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/report`
- **Backend fields:** statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
- **Published fields:** ledgerRequest

### A94. GET `/petty-cash-manager-api-s/get-pettycash-entry-api`

- **Published title:** Get pettycash entry api
- **Real API:** `GET /company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`
- **Backend:** giddh-api-v2 · `PettyCashManagerController#getCashEntryForAdminByUniqueName`
- **Frontend ids:** EXPENSE_API.GETEntry
- **Path params:** companyUniqueName, entryUniqueName
- **Query params:** branchUniqueName
- **Updates needed:**
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`

### A95. POST `/petty-cash-manager-api-s/get-all-petty-cash-entry-grid-view-for-admin`

- **Published title:** Get All Petty cash entry grid view for admin
- **Real API:** `POST /company/{companyUniqueName}/pettycash-manager/report`
- **Backend:** giddh-api-v2 · `PettyCashManagerCompanyController#getPettyCashAdminReport`
- **Frontend ids:** EXPENSE_API.GET
- **Path params:** companyUniqueName
- **Query params:** page, count, sortBy, sort, branchUniqueName
- **Body type:** `PettyCashAdminFilter`
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Add/update payload fields from backend: statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName
  - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/report`
- **Backend fields:** statusStr, submittedBy, baseAccountName, particularAccountName, toDateStr, fromDateStr, mappingName, classFieldName

### A96. GET `/petty-cash-manager-api-s/client-get-all-petty-cash-entries`

- **Published title:** Client-get all petty cash entries
- **Real API:** `GET /company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`
- **Backend:** giddh-api-v2 · `PettyCashManagerController#getCashEntryForAdminByUniqueName`
- **Frontend ids:** EXPENSE_API.GETEntry
- **Path params:** companyUniqueName, entryUniqueName
- **Query params:** branchUniqueName
- **Updates needed:**
  - Remove junk params (0, Content-Type)
  - Set published path to real route: `/company/{companyUniqueName}/pettycash-manager/ledger/{entryUniqueName}`

### A97. GET `/vat-apis/view-vat-report`

- **Published title:** View VAT Report
- **Real API:** `GET /v2/subscription/{subscriptionId}/activate`
- **Backend:** giddh-api-v2 · `SubscriptionControllerV2#activateSubscriptionAfterPayment`
- **Frontend ids:** SUBSCRIPTION_V2_API.ACTIVATE_PLAN
- **Path params:** subscriptionId
- **Query params:** upgrade, billingRequestId
- **Updates needed:**
  - Set published path to real route: `/v2/subscription/{subscriptionId}/activate`

### A98. GET `/vat-apis/download-vat-report`

- **Published title:** Download VAT Report
- **Real API:** `GET /v2/subscription/{subscriptionId}/activate`
- **Backend:** giddh-api-v2 · `SubscriptionControllerV2#activateSubscriptionAfterPayment`
- **Frontend ids:** SUBSCRIPTION_V2_API.ACTIVATE_PLAN
- **Path params:** subscriptionId
- **Query params:** upgrade, billingRequestId
- **Updates needed:**
  - Set published path to real route: `/v2/subscription/{subscriptionId}/activate`

### A99. POST `/account-balances-report-apis/monthly-columnar-report-for-api`

- **Published title:** monthly columnar report for API
- **Real API:** `POST /company/{companyUniqueName}/accounts/{accountUniqueName}/columnar-report`
- **Backend:** giddh-api-v2 · `ImportExportController#columnarReport`
- **Frontend ids:** LEDGER_API.EXPORT_LEDGER_COLUMNAR_REPORT_TABLE
- **Path params:** companyUniqueName, accountUniqueName
- **Query params:** from, to, sort, page, count, branchUniqueName
- **Body type:** `EntryFilter`
- **Updates needed:**
  - Remove junk params (0)
  - Add/update payload fields from backend: groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars (+10)
  - Review published-only fields: financialYear, showHideOpeningClosingBalance
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/columnar-report`
- **Backend fields:** groupUniqueNames, accountUniqueNames, salesPersonUniqueNames, includeSalesPersons, includeAmount, amount, amountGreaterThan, amountLessThan, amountEqualTo, includeDescription, description, vouchers, includeVouchers, includeParticulars, particulars, isInvoiceGenerated, includeTag, tags, chequeNumber, dateOnCheque, inventory, cancelledEntries, balanceTypeAsSign, chequeDate, selectAllFields
- **Published fields:** financialYear, showHideOpeningClosingBalance

### A100. POST `/account-balances-report-apis/monthly-columnar-report-for-api_copy`

- **Published title:** download-account-closing-balance api
- **Real API:** `POST /company/{companyUniqueName}/export-invoices-v2`
- **Backend:** accounting-microservice · `VoucherController#exportVouchersWithExportSettings`
- **Frontend ids:** INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV
- **Path params:** companyUniqueName
- **Query params:** branchUniqueName, from, to, type, noteType, sort, sortBy, voucherCount, q, fileType
- **Body type:** `VoucherFilter`
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Add/update payload fields from backend: type, noteVoucherType, fromDate, toDate, receiptType, source, attachmentExport, selectAllFields, voucherExport, fileNameFormat, showVoucherCustomFields, showAccountCustomFields, showBillingAddress, showShippingAddress, showTaxableValueBeforeDiscount (+53)
  - Review published-only fields: subject, message, accounts
  - Set published path to real route: `/company/{companyUniqueName}/export-invoices-v2`
- **Backend fields:** type, noteVoucherType, fromDate, toDate, receiptType, source, attachmentExport, selectAllFields, voucherExport, fileNameFormat, showVoucherCustomFields, showAccountCustomFields, showBillingAddress, showShippingAddress, showTaxableValueBeforeDiscount, showDiscountValue, showTaxValue, showShippingDetails, showVoucherNote, showEInvoiceDetails, showMobileNumber, showAttentionTo, showEmail, showOtherTaxValue, dueDate, dueDateBefore, dueDateAfter, dueDateEqual, voucherDate, voucherDateBefore, voucherDateAfter, voucherDateEqual, page, count, sort, sortBy, q, fileType, voucherCount, groupIds, accountIds, voucherIds, uniqueNames, entryUniqueNames, balanceDue, balanceEqual, balanceMoreThan, balanceLessThan, total, totalEqual, totalMoreThan, totalLessThan, description, accountUniqueName, groupUniqueName, copyTypes, eInvoiceStatus, balanceStatus, purchaseOrderNumber, companyUniqueName, branchUniqueName, userId, exportType, totalVouchers, requestId, mergePdf, exportFromLedger, salesPersonUniqueNames
- **Published fields:** subject, message, accounts

### A101. POST `/export-apis/ledger-export---excel`

- **Published title:** Ledger export - Excel
- **Real API:** `POST /company/{companyUniqueName}/ledgers`
- **Backend:** giddh-api-v2 · `CompanyController#getAllLedgers`
- **Frontend ids:** INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE
- **Path params:** companyUniqueName
- **Query params:** page, count, from, to, sort, sortBy, voucherType, branchUniqueName
- **Body type:** `EntrySearch`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: accountUniqueName, particularUniqueName, description, entryTotal, totalIsEqual, totalIsLess, totalIsMore, entryDate, dateIsEqual, dateIsBefore, dateIsAfter
  - Set published path to real route: `/company/{companyUniqueName}/ledgers`
- **Backend fields:** accountUniqueName, particularUniqueName, description, entryTotal, totalIsEqual, totalIsLess, totalIsMore, entryDate, dateIsEqual, dateIsBefore, dateIsAfter

### A102. GET `/export-apis/view-export-requests`

- **Published title:** View Export Requests
- **Real API:** `GET /company/{companyUniqueName}/export-settings`
- **Backend:** giddh-api-v2 · `CompanySettingsController#getAllExportSettings`
- **Frontend ids:** SETTINGS_PROFILE_API.GET_UPDATE_MODULE_EXPORT_SETTING
- **Path params:** companyUniqueName
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Set published path to real route: `/company/{companyUniqueName}/export-settings`

### A103. GET `/export-apis/bill-to-bill-export-api`

- **Published title:** Bill to bill export api
- **Real API:** `GET /company/{companyUniqueName}/export-settings`
- **Backend:** giddh-api-v2 · `CompanySettingsController#getAllExportSettings`
- **Frontend ids:** SETTINGS_PROFILE_API.GET_UPDATE_MODULE_EXPORT_SETTING
- **Path params:** companyUniqueName
- **Updates needed:**
  - Remove junk params (lang, 0, 1, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/export-settings`

### A104. POST `/permission-apis/assign-role`

- **Published title:** Assign Role
- **Real API:** `POST /company/{companyUniqueName}/role`
- **Backend:** giddh-api-v2 · `RoleV2Controller#createRole`
- **Frontend ids:** PERMISSION_API.CREATE_ROLE
- **Path params:** companyUniqueName
- **Body type:** `RoleV2Resource`
- **Updates needed:**
  - Remove junk params (Content-Type, content-type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Set published path to real route: `/company/{companyUniqueName}/role`
- **Published fields:** emailId, entity, roleUniqueName, periodOptions, from, to, duration, period, ipOptions, allowedIps, allowedCidrs

### A105. POST `/audit-trail/activity-log`

- **Published title:** Activity log
- **Real API:** `POST /v2/company/{companyUniqueName}/activity-logs`
- **Backend:** giddh-api-v2 · `AuditLogControllerV3#getActivityLogs`
- **Frontend ids:** ACTIVITY_LOGS_API.GET_ACTIVITY_LOGS
- **Path params:** companyUniqueName
- **Query params:** branchUniqueName
- **Body type:** `AuditLogFilter`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: entity, operation, fromDate, toDate, entryFromDate, entryToDate, voucherFromDate, voucherToDate, page, count, sort, version, entityId, accountUniqueNames, groupUniqueNames (+14)
  - Set published path to real route: `/v2/company/{companyUniqueName}/activity-logs`
- **Backend fields:** entity, operation, fromDate, toDate, entryFromDate, entryToDate, voucherFromDate, voucherToDate, page, count, sort, version, entityId, accountUniqueNames, groupUniqueNames, userUniqueNames, filterData, page, count, entity, fromDate, toDate, entryFromDate, entryToDate, voucherFromDate, voucherToDate, operations, sort, userUniqueName

### A106. POST `/purchase-order/service/create-purchase-order`

- **Published title:** Create Purchase order
- **Real API:** `POST /company/{companyUniqueName}/purchase-order/get-all`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#getPurchaseOrdersUIView`
- **Frontend ids:** PURCHASE_ORDER_API.GET_ALL
- **Path params:** companyUniqueName
- **Query params:** page, count, from, to, sort, sortBy, invoiceCount, branchUniqueName
- **Body type:** `PurchaseOrderFilter`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount (+13)
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/get-all`
- **Backend fields:** purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount, fromDate, toDate, dueFromDate, dueToDate, sortDirection, sortTypeEnum, grandTotalOperation, grandTotal, statuses, purchaseNumber, searchQuery, salesPersonUniqueNames, selectAllFields

### A107. PUT `/purchase-order/service/update-purchase-order`

- **Published title:** Update Purchase Order
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
- **Backend:** giddh-api-v2 · `PurchaseOrderAccountController#update`
- **Frontend ids:** PURCHASE_ORDER_API.UPDATE
- **Path params:** accountUniqueName, companyUniqueName
- **Query params:** branchUniqueName
- **Body type:** `PurchaseOrderDetails`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: version, number, type, date, dueDate, uniqueName, balanceTotal, status, company, account, entries, grandTotal, subTotal, taxTotal, discountTotal (+19)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
- **Backend fields:** version, number, type, date, dueDate, uniqueName, balanceTotal, status, company, account, entries, grandTotal, subTotal, taxTotal, discountTotal, roundOffTotal, totalAsWords, deposit, base64, updateAccountDetails, templateDetails, entryUniqueNames, exchangeRate, valuesInAccountCurrency, subVoucher, isEcommerceInvoice, applyApplicableTaxes, attachedFiles, warehouse, attachedFileName, branch, salesPersonUniqueName, salesPerson, roundOffApplicable

### A108. POST `/purchase-order/stock/create-purchase-order`

- **Published title:** Create Purchase order
- **Real API:** `POST /company/{companyUniqueName}/purchase-order/get-all`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#getPurchaseOrdersUIView`
- **Frontend ids:** PURCHASE_ORDER_API.GET_ALL
- **Path params:** companyUniqueName
- **Query params:** page, count, from, to, sort, sortBy, invoiceCount, branchUniqueName
- **Body type:** `PurchaseOrderFilter`
- **Updates needed:**
  - Remove junk params (lang, 0, 1, content-type)
  - Add/update payload fields from backend: purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount (+13)
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/get-all`
  - Add response examples
- **Backend fields:** purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount, fromDate, toDate, dueFromDate, dueToDate, sortDirection, sortTypeEnum, grandTotalOperation, grandTotal, statuses, purchaseNumber, searchQuery, salesPersonUniqueNames, selectAllFields

### A109. PUT `/purchase-order/stock/update-purchase-order`

- **Published title:** Update Purchase Order
- **Real API:** `PUT /company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
- **Backend:** giddh-api-v2 · `PurchaseOrderAccountController#update`
- **Frontend ids:** PURCHASE_ORDER_API.UPDATE
- **Path params:** accountUniqueName, companyUniqueName
- **Query params:** branchUniqueName
- **Body type:** `PurchaseOrderDetails`
- **Updates needed:**
  - Remove junk params (lang, 0, 1, content-type)
  - Add/update payload fields from backend: version, number, type, date, dueDate, uniqueName, balanceTotal, status, company, account, entries, grandTotal, subTotal, taxTotal, discountTotal (+19)
  - Set published path to real route: `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order`
  - Add response examples
- **Backend fields:** version, number, type, date, dueDate, uniqueName, balanceTotal, status, company, account, entries, grandTotal, subTotal, taxTotal, discountTotal, roundOffTotal, totalAsWords, deposit, base64, updateAccountDetails, templateDetails, entryUniqueNames, exchangeRate, valuesInAccountCurrency, subVoucher, isEcommerceInvoice, applyApplicableTaxes, attachedFiles, warehouse, attachedFileName, branch, salesPersonUniqueName, salesPerson, roundOffApplicable

### A110. POST `/purchase-order/get-all-purchase-orders`

- **Published title:** Get all Purchase orders
- **Real API:** `POST /company/{companyUniqueName}/purchase-order/get-all`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#getPurchaseOrdersUIView`
- **Frontend ids:** PURCHASE_ORDER_API.GET_ALL
- **Path params:** companyUniqueName
- **Query params:** page, count, from, to, sort, sortBy, invoiceCount, branchUniqueName
- **Body type:** `PurchaseOrderFilter`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount (+13)
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/get-all`
- **Backend fields:** purchaseOrderNumber, vendorName, statuses, grandTotal, grandTotalOperation, dueFromStr, dueToStr, salesPersonUniqueNames, selectAllFields, mappingName, classFieldName, hasData, page, count, invoiceCount, fromDate, toDate, dueFromDate, dueToDate, sortDirection, sortTypeEnum, grandTotalOperation, grandTotal, statuses, purchaseNumber, searchQuery, salesPersonUniqueNames, selectAllFields

### A111. GET `/purchase-order/get-purchase-order`

- **Published title:** Get Purchase Order
- **Real API:** `GET /company/{companyUniqueName}/purchase-order/preview`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#preview`
- **Frontend ids:** PURCHASE_ORDER_API.GET_PREVIEW
- **Path params:** companyUniqueName
- **Query params:** branchUniqueName, uniqueName
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/preview`

### A112. DELETE `/purchase-order/delete-purchase-order`

- **Published title:** Delete Purchase order
- **Real API:** `DELETE /company/{companyUniqueName}/purchase-order`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#deletePurchaseOrder`
- **Frontend ids:** PURCHASE_ORDER_API.DELETE
- **Path params:** companyUniqueName
- **Query params:** uniqueName, branchUniqueName
- **Updates needed:**
  - Remove junk params (lang, 0, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order`

### A113. PATCH `/purchase-order/bulk-purchase-orders`

- **Published title:** Bulk Purchase Orders
- **Real API:** `PATCH /company/{companyUniqueName}/purchase-order/bulk-update`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#performBulkAction`
- **Frontend ids:** PURCHASE_ORDER_API.BULK_UPDATE
- **Path params:** companyUniqueName
- **Query params:** action, branchUniqueName
- **Body type:** `BulkUpdateRequest`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/bulk-update`
- **Backend fields:** purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders

### A114. PATCH `/purchase-order/convert-to-purchase-bill`

- **Published title:** Convert to Purchase Bill
- **Real API:** `PATCH /company/{companyUniqueName}/purchase-order/bulk-update`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#performBulkAction`
- **Frontend ids:** PURCHASE_ORDER_API.BULK_UPDATE
- **Path params:** companyUniqueName
- **Query params:** action, branchUniqueName
- **Body type:** `BulkUpdateRequest`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/bulk-update`
- **Backend fields:** purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders

### A115. PATCH `/purchase-order/cancel-purchase-order`

- **Published title:** Cancel Purchase Order
- **Real API:** `PATCH /company/{companyUniqueName}/purchase-order/bulk-update`
- **Backend:** giddh-api-v2 · `PurchaseOrderCompanyController#performBulkAction`
- **Frontend ids:** PURCHASE_ORDER_API.BULK_UPDATE
- **Path params:** companyUniqueName
- **Query params:** action, branchUniqueName
- **Body type:** `BulkUpdateRequest`
- **Updates needed:**
  - Remove junk params (lang, content-type)
  - Add/update payload fields from backend: purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders
  - Set published path to real route: `/company/{companyUniqueName}/purchase-order/bulk-update`
- **Backend fields:** purchaseNumbers, dueDate, purchaseDate, warehouseUniqueName, purchaseOrders

### A116. GET `/branch-apis/get-all-branches`

- **Published title:** get all branches
- **Real API:** `GET /company/{companyUniqueName}/branch`
- **Backend:** giddh-api-v2 · `BranchController#getAllBranches`
- **Frontend ids:** COMPANY_API.GET_ALL_BRANCHES
- **Path params:** companyUniqueName
- **Query params:** includeArchived, hierarchyType
- **Updates needed:**
  - Remove junk params (Content-Type)
  - Add real path/query params to OpenAPI (currently missing or only in markdown)
  - Set published path to real route: `/company/{companyUniqueName}/branch`
- **Published fields:** name, alias, linkAddresses

### A117. GET `/customer-api/untitled`

- **Published title:** get all customers
- **Real API:** `GET /company/{companyUniqueName}/brief-accounts`
- **Backend:** search-api · `CompanyController#briefAccounts`
- **Frontend ids:** SALES_API_V2.GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY
- **Path params:** companyUniqueName
- **Query params:** group, exceptGroups, currency, page, count
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/brief-accounts`

### A118. POST `/customer-api/get-all-customers_copy`

- **Published title:** create customer
- **Real API:** `POST /v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
- **Backend:** giddh-api-v2 · `AccountWithGroupV2Controller#create`
- **Frontend ids:** ACCOUNTS_API_V2.CREATE
- **Path params:** groupUniqueName, companyUniqueName
- **Query params:** lang
- **Body type:** `AccountResourceV2`
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Add/update payload fields from backend: applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, emailList, tagNames, rowNum, mobileCode, importedAccountOpeningBalance, currentBranch, ledgerView, duePeriod (+1)
  - Review published-only fields: activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmount, closingBalanceTriggerAmountType (+4)
  - Set published path to real route: `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts`
- **Backend fields:** applicableTaxesUniqueNames, accountUniqueName, accountName, groupUniqueName, accountEmail, accountMobileNo, accountAttentionTo, emailList, tagNames, rowNum, mobileCode, importedAccountOpeningBalance, currentBranch, ledgerView, duePeriod, salesPersonUniqueName
- **Published fields:** activeGroupUniqueName, name, uniqueName, openingBalanceType, foreignOpeningBalance, openingBalance, mobileNo, email, companyName, attentionTo, addresses, country, currency, closingBalanceTriggerAmount, closingBalanceTriggerAmountType, customFields, accountOpeningBalance, hsnNumber, sacNumber

### A119. GET `/customer-api/create-customer_copy`

- **Published title:** create-customer-group-list
- **Real API:** `GET /company/{companyUniqueName}/top-shared-groups`
- **Backend:** search-api · `MastersController#topSharedGroups`
- **Frontend ids:** GROUP_API.GET_TOP_SHARED_GROUPS
- **Path params:** companyUniqueName
- **Query params:** page, count
- **Updates needed:**
  - Remove junk params (t, z, lang, content-type)
  - Set published path to real route: `/company/{companyUniqueName}/top-shared-groups`

## B. Missing from published (frontend used + backend exists)

Total missing: **584**

### 01-auth-login (49)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| DELETE | `/company/{companyUniqueName}/auth/{authUniqueName}/remove` | RoleAuthController#removeAuthKey | SETTINGS_COMPANY_AUTH_KEY_API.DELETE_AUTH_KEY | Remove Auth Key |
| PUT | `/company/{companyUniqueName}/auth/{authUniqueName}/update` | RoleAuthController#updateAuthUser | SETTINGS_COMPANY_AUTH_KEY_API.UPDATE_AUTH_KEY | Update Auth User |
| GET | `/company/{companyUniqueName}/auth/{authUniqueName}` | RoleAuthController#unmaskAuthKey | SETTINGS_COMPANY_AUTH_KEY_API.GET_AUTH_KEY | Unmask Auth Key |
| GET | `/company/{companyUniqueName}/auth/all` | RoleAuthController#getAllAuthKeys | SETTINGS_COMPANY_AUTH_KEY_API.GET_ALL_AUTH_KEYS | Get All Auth Keys |
| POST | `/company/{companyUniqueName}/auth/generate` | RoleAuthController#generateAuthKey | SETTINGS_COMPANY_AUTH_KEY_API.CREATE_AUTH_KEY | Generate Auth Key |
| GET | `/company/{companyUniqueName}/authorize` | OAuthController#getMTDPortalAuthorizeUrl | VAT_API.CHECK_HMRC_AUTHORIZATION | MTD: Making Tax Digital |
| GET | `/company/{companyUniqueName}/bank/generateotp` | ICICIBankController#generateOTP | COMPANY_API.GET_OTP | Generate OTP |
| POST | `/company/{companyUniqueName}/bank/payments/confirm` | ICICIBankController#bulkPaymentConfirm | COMPANY_API.BULK_PAYMENT_CONFIRM | API : confirm payment with OTP and sent to bank for payment |
| GET | `/company/{companyUniqueName}/bank/resend-otp` | ICICIBankController#resendOTP | COMPANY_API.BULK_PAYMENT_RESEND_OTP | API : resent OTP to user |
| POST | `/company/{companyUniqueName}/communication/platform/verify` | CommunicationController#verifyAuthKey | SETTINGS_INTEGRATION_COMMUNICATION_API.VERIFY_PLATFORM | Verify Auth Key |
| POST | `/company/{companyUniqueName}/ecommerce/verify/{ecommerceUniqueName}` | EcommerceController#verifyEcommerceAccountStatus | ECOMMERCE_API.SHOPIFY_VERIFY | This function is used register ecommerce user. |
| POST | `/company/{companyUniqueName}/ewb/user` | EWayBillController#authenticateUser | EWAYBILL_API.LOGIN_EWAYBILL_USER | Authenticate User |
| GET | `/company/{companyUniqueName}/invoice-setting/verify-email` | InvoiceSettingController#verifyCompanyInvoiceEmail | INVOICE_API.VERIFY_EMAIL | Verify Company Invoice Email |
| GET | `/company/{companyUniqueName}/payment/banks/accounts` | CompanyController#getPaymentBankAccounts | COMPANY_API.GET_COMPANY_INTEGRATED_BANK_LIST | Get all the registered accounts of integrated banks with Giddh. |
| GET | `/company/{companyUniqueName}/purchase-bill-setting/verify-email` | PurchaseBillSettingController#verifyCompanyInvoiceEmail | PURCHASE_ORDER_API.VERIFY_EMAIL | Verify Company Invoice Email |
| POST | `/company/{companyUniqueName}/save-authorization-code` | OAuthController#saveAuthorizationCode | VAT_API.SAVE_AUTHORIZATION_CODE | Save Authorization Code |
| DELETE | `/company/{companyUniqueName}/tax/authority/{taxAuthorityUniqueName}` | TaxController#deleteTaxAuthority | COMPANY_API.DELETE_TAX_AUTHORITY | Delete Tax Authority |
| PATCH | `/company/{companyUniqueName}/tax/authority/{taxAuthorityUniqueName}` | TaxController#updateTaxAuthority | COMPANY_API.UPDATE_TAX_AUTHORITY | Update Tax Authority |
| GET | `/company/{companyUniqueName}/tax/authority` | TaxController#getAllTaxAuthority | COMPANY_API.GET_ALL_TAX_AUTHORITIES | Get All Tax Authority |
| POST | `/company/{companyUniqueName}/tax/authority` | TaxController#createTaxAuthority | COMPANY_API.CREATE_TAX_AUTHORITY | Create Tax Authority |
| GET | `/company/{companyUniqueName}/us/export-sales-report-authority-wise` | USVatReturnController#downloadVatReportTaxAuthorityWise | COMPANY_API.EXPORT_SALES_TAX_AUTHORITY_WISE_REPORT | Download Vat Report Tax Authority Wise |
| GET | `/company/{companyUniqueName}/us/sales-report-authority-wise` | USVatReturnController#getVatReportTaxAuthorityWise | COMPANY_API.GET_SALES_TAX_AUTHORITY_WISE_REPORT | Get Vat Report Tax Authority Wise |
| POST | `/generate-otp` | LoginController#generateOtp | LOGIN_API.SignupWithMobile | Generate Otp |
| GET | `/login-with-number` | LoginController#loginWithNumber | LOGIN_API.LoginWithNumber | Login With Number |
| PUT | `/reset-password` | LoginController#resetPassword | LOGIN_API.RESET_PASSWORD | Reset Password |
| POST | `/signup-with-email` | LoginController#signUpWithEmail | LOGIN_API.SignupWithEmail | Sign Up With Email |
| PUT | `/users/{uniqueKey}/forgot-password` | UserController#forgotPassword | LOGIN_API.FORGOT_PASSWORD | Forgot Password |
| PUT | `/users/{uniqueName}/generate-auth-key` | UserController#generateAuthKey | LOGIN_API.REGENERATE_AUTH_KEY | Generate Auth Key |
| DELETE | `/users/{userUniqueName}/destroy-session` | UserController#destroyUserSession | LOGIN_API.CLEAR_SESSION | Destroy User Session |
| POST | `/users/{userUniqueName}/destroy-session` | UserController#destroyUserSession2 | LOGIN_API.DELETE_SESSION | Destroy User Session2 |
| GET | `/users/{userUniqueName}/get-auth-key` | UserController#generateAuthKeyV2 | LOGIN_API.GET_AUTH_KEY | Generate Auth Key V2 |
| PUT | `/users/{userUniqueName}/increment-session` | UserController#incrementUserSession | LOGIN_API.RENEW_SESSION | Increment User Session |
| DELETE | `/users/{userUniqueName}/sessions` | UserController#deleteAllSessions | LOGIN_API.DELETE_ALL_SESSION | Delete All Sessions |
| GET | `/users/{userUniqueName}/sessions` | UserController#getAllSessions | LOGIN_API.GET_SESSION | Get All Sessions |
| POST | `/v2/auth-login` | LoginV2Controller#authLogin | LOGIN_API.LOGIN_WITH_OTP | API to support login with otp |
| POST | `/v2/company/{companyUniqueName}/authenticate-gsp-session` | GstReturnV2Controller#authenticateGspSession | GSTR_API.SAVE_GSP_SESSION_WITH_OTP | Authenticate Gsp Session |
| POST | `/v2/company/{companyUniqueName}/bank/multi-registration` | ICICIBankControllerV2#addNewCorporateRegistration | SETTINGS_INTEGRATION_API.BANK_ACCOUNT_MULTI_REGISTRATION | In Once ICICI Bank Account Integration - There can be multiple login credentials can be added . This API will add login credentials , for already integrated bank account. |
| POST | `/v2/company/{companyUniqueName}/gsp-session` | GstReturnV2Controller#createGspSession | GSTR_API.SAVE_GSP_SESSION | Create Gsp Session |
| POST | `/v2/company/{companyUniqueName}/purchases-register-detailed` | ReportV2Controller#getPurchasesRegisterDetailed | COMPANY_API.GET_DETAILED_REGISTERED_PURCHASE | The purpose of this API is to create the Detailed Purchases Register Report of a company. |
| POST | `/v2/company/{companyUniqueName}/sales-register-detailed` | ReportV2Controller#createSalesRegisterDetailed | COMPANY_API.GET_DETAILED_REGISTERED_SALES | The purpose of this API is to create the Detailed Sales Register Report of a company. |
| GET | `/v2/company/{companyUniqueName}/session` | GstReturnV2Controller#getSession | GST_RETURN_API.GET_GSP_SESSION | Get Session |
| POST | `/v2/company/{companyUniqueName}/v2/purchases-register-overview` | ReportV2Controller#getPurchasesRegisterOverview2 | COMPANY_API.GET_REGISTERED_PURCHASE_V2 | Get Purchases Register Overview2 |
| POST | `/v2/company/{companyUniqueName}/v2/sales-register-overview` | ReportV2Controller#getSalesRegisterOverviewV2 | COMPANY_API.GET_REGISTERED_SALES_V2 | Get Sales Register Overview V2 |
| POST | `/v2/login-with-password` | LoginV2Controller#loginWithPassword | LOGIN_API.LoginWithPassword | Login With Password |
| POST | `/v2/signup-with-apple` | LoginV2Controller#signUpWithApple | LOGIN_API.LOGIN_WITH_APPLE | API to support signup with apple |
| POST | `/v2/signup-with-google` | LoginV2Controller#signUpWithGoogleV2 | LOGIN_API.LOGIN_WITH_GOOGLE | Sign Up With Google V2 |
| POST | `/v2/signup` | LoginV2Controller#signup | LOGIN_API.SignupWithPassword | Signup |
| GET | `/v2/user` | LoginV2Controller#getUser | LOGIN_API.GET_USER_DETAILS_FROM_SESSION_ID | Get User |
| POST | `/v2/verify-number` | LoginV2Controller#verifyMobileV2 | LOGIN_API.VerifyOTP | Verify Mobile V2 |

### 02-company-branches (56)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| PATCH | `/company/{companyUniqueName:.+}/plan` | CompanyController#updateCompanyPlan | SETTINGS_PROFILE_API.UPDATE_COMPANY_PLAN | Update Company Plan |
| GET | `/company/{companyUniqueName:.+}` | CompanyController#getCompany | PURCHASE_ORDER<br>SETTINGS_PROFILE_API.GET | Get Company |
| PATCH | `/company/{companyUniqueName:.+}` | CompanyController#updateCompanyV2 | SETTINGS_PROFILE_API.GET<br>SUBSCRIPTION_V2_API.SET_ARCHIVE_UNARCHIVE_COMPANY | Update Company V2 |
| PUT | `/company/{companyUniqueName:.+}` | CompanyController#updateCompany | SETTINGS_PROFILE_API.GET | Update Company |
| GET | `/company/{companyUniqueName}/branch/{branchUniqueName:.+}` | BranchController#getBranch | SETTINGS_PROFILE_API.GET_BRANCH_INFO | Get Branch |
| PATCH | `/company/{companyUniqueName}/branch/{branchUniqueName:.+}` | BranchController#updateBranchV2 | SETTINGS_BRANCH_API.UPDATE_BRANCH_STATUS | Update Branch V2 |
| PUT | `/company/{companyUniqueName}/branch/{branchUniqueName:.+}` | BranchController#updateBranch | SETTINGS_PROFILE_API.UPDATE_BRANCH_INFO | Update Branch |
| POST | `/company/{companyUniqueName}/branch` | BranchController#createBranch | COMPANY_API.CREATE_NEW_BRANCH<br>SETTINGS_PROFILE_API.CREATE_BRANCH | Create Branch |
| GET | `/company/{companyUniqueName}/cmdk` | CompanyController#cmdKSearch | COMMON_API.COMMAND_K | Cmd KSearch |
| GET | `/company/{companyUniqueName}/custom-fields` | CompanyController#getCustomFields | GROUP_API.CREATE_COMPANY_CUSTOM_FIELD | API to fetch custom fields on the company |
| POST | `/company/{companyUniqueName}/custom-fields` | CompanyController#setCustomFields | GROUP_API.CREATE_COMPANY_CUSTOM_FIELD | Set Custom Fields |
| POST | `/company/{companyUniqueName}/due-amount-report` | CompanyController#getDebtorDueAmountReport | DUEAMOUNTREPORT_API_V2.GET | Get Debtor Due Amount Report |
| GET | `/company/{companyUniqueName}/due-days-range` | CompanyController#getDueAmountRange | DUEDAYSRANGE_API_V2.CREATE | Get Due Amount Range |
| POST | `/company/{companyUniqueName}/due-days-range` | CompanyController#addDueAmountRange | DUEDAYSRANGE_API_V2.CREATE | Add Due Amount Range |
| GET | `/company/{companyUniqueName}/email-key` | CompanyController#getEmailVerificationKey | SETTINGS_INTEGRATION_API.EMAIL | Get Email Verification Key |
| POST | `/company/{companyUniqueName}/email-key` | CompanyController#emailVerificationKey | SETTINGS_INTEGRATION_API.EMAIL | Email Verification Key |
| GET | `/company/{companyUniqueName}/export-settings/daybook-v2` | CompanyController#getDaybookExportV3WithExportSettings | DAYBOOK_SEARCH_API.EXPORT | Get Daybook Export V3With Export Settings |
| POST | `/company/{companyUniqueName}/export-settings/daybook-v2` | CompanyController#getDaybookExportV3WithExportSettings | DAYBOOK_SEARCH_API.EXPORT | Get Daybook Export V3With Export Settings |
| GET | `/company/{companyUniqueName}/financial-year-limits` | FinancialYearController#financialYearLimits | SETTINGS_FINANCIAL_YEAR_API.GET_FINANCIAL_YEAR_LIMITS | Financial Year Limits |
| PATCH | `/company/{companyUniqueName}/financial-year-lock` | FinancialYearController#lockFinancialYear | SETTINGS_FINANCIAL_YEAR_API.LOCK_FINANCIAL_YEAR | Lock Financial Year |
| PATCH | `/company/{companyUniqueName}/financial-year-unlock` | FinancialYearController#unlockFinancialYear | SETTINGS_FINANCIAL_YEAR_API.UNLOCK_FINANCIAL_YEAR | Unlock Financial Year |
| GET | `/company/{companyUniqueName}/financial-year` | FinancialYearController#getFinancialYear | SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS | Get Financial Year |
| POST | `/company/{companyUniqueName}/financial-year` | FinancialYearController#createFinancialYear | SETTINGS_FINANCIAL_YEAR_API.ADD_FINANCIAL_YEAR | Create Financial Year |
| PUT | `/company/{companyUniqueName}/financial-year` | FinancialYearController#updateFinancialYear | SETTINGS_FINANCIAL_YEAR_API.UPDATE_FY_PERIOD | Update Financial Year |
| GET | `/company/{companyUniqueName}/flatten-accounts` | CompanyController#getFlattenAccounts | ACCOUNTS_API.FLATTEN_ACCOUNTS | Get Flatten Accounts |
| GET | `/company/{companyUniqueName}/flatten-stock-groups-with-stocks` | CompanyController#getFlattenStockGroupsWithStocks | INVENTORY_API.GROUPS_WITH_STOCKS_FLATTEN | Get Flatten Stock Groups With Stocks |
| POST | `/company/{companyUniqueName}/forecast` | CompanyController#foreCastData | BUDGET_FORECASTING_API.GET_FORECAST | Fore Cast Data |
| POST | `/company/{companyUniqueName}/future-financial-year` | FinancialYearController#createFutureFinancialYear | SETTINGS_FINANCIAL_YEAR_API.ADD_FUTURE_FINANCIAL_YEAR | Create Future Financial Year |
| GET | `/company/{companyUniqueName}/groups-with-accounts` | CompanyController#getGroupsWithAccountsNew | GROUP_API.GROUPS_WITH_ACCOUNT | Get Groups With Accounts New |
| GET | `/company/{companyUniqueName}/hierarchical-stock-groups` | CompanyController#getAllHierarchicalStockGroups | INVENTORY_API.GROUPS_WITH_STOCKS<br>INVENTORY_API.GROUPS_WITH_STOCKS_HIERARCHY | Get All Hierarchical Stock Groups |
| POST | `/company/{companyUniqueName}/inventory-report` | CompanyController#inventoryReport | INVENTORY_API.REPORT_ALL_V2 | Inventory Report |
| GET | `/company/{companyUniqueName}/linked-sources` | CompanyController#getLinkedSources | INVENTORY_API.LINKED_STOCKS.LINKED_STOCKS | Will return list of linked companies (self included) and also the linked warehouses. |
| POST | `/company/{companyUniqueName}/logs` | CompanyController#getCompanyLogs | LOGS_API.AUDIT_LOGS | Get Company Logs |
| GET | `/company/{companyUniqueName}/new-old-sales/details` | CompanyController#getDetailedSalesList | SALES_BIFURCATION_API | Get Detailed Sales List |
| GET | `/company/{companyUniqueName}/new-old-sales` | CompanyController#getNewOldSalesData | NEWVSOLDINVOICE_API.GET | Get New Old Sales Data |
| POST | `/company/{companyUniqueName}/new-old-sales` | CompanyController#getNewOldSalesData | NEWVSOLDINVOICE_API.GET | Get New Old Sales Data |
| GET | `/company/{companyUniqueName}/purchase-order/{uniqueName}` | PurchaseOrderCompanyController#get | PURCHASE_ORDER_API.GET | / |
| POST | `/company/{companyUniqueName}/purchase-record/get-all` | PurchaseCompanyController#getPurchaseRecords | RECEIPT_API.GET_ALL_PURCHASE_RECORDS | Get Purchase Records |
| DELETE | `/company/{companyUniqueName}/purchase-record` | PurchaseCompanyController#deletePurchaseRecord | PURCHASE_RECORD_API.DELETE | Delete Purchase Record |
| GET | `/company/{companyUniqueName}/shared-with` | CompanyController#getSharedList | SETTINGS_PERMISSION_API.GET<br>SETTINGS_PERMISSION_API.GET_APPROVAL_NAME | Get Shared List |
| GET | `/company/{companyUniqueName}/sms-key` | CompanyController#getSmsVerificationKey | SETTINGS_INTEGRATION_API.SMS | Get Sms Verification Key |
| POST | `/company/{companyUniqueName}/sms-key` | CompanyController#smsVerificationKey | SETTINGS_INTEGRATION_API.SMS | Sms Verification Key |
| GET | `/company/{companyUniqueName}/sources` | CompanyController#getSources | SETTINGS_PROFILE_API.GET_LINKED_ENTITIES | Get Sources |
| GET | `/company/{companyUniqueName}/stocks-manufacture` | CompanyController#getAllManufacturedStocks | INVENTORY_API.MANUFACTURING_STOCKS | Get All Manufactured Stocks |
| GET | `/company/{companyUniqueName}/stocks/v2` | CompanyController#getAllStocksV2 | INVENTORY_API.STOCKS_V2 | Get All Stocks V2 |
| GET | `/company/{companyUniqueName}/stocks` | CompanyController#getAllStocks | INVENTORY_API.CREATE_NEW_MANUFACTURING_STOCKS<br>INVENTORY_API.STOCKS | Get All Stocks |
| GET | `/company/{companyUniqueName}/tax-numbers` | CompanyController#getAllTaxNumbers | GST_RETURN_API.GET_TAX_DETAILS | Get All Tax Numbers |
| GET | `/company/{companyUniqueName}/ui_side_bar_items` | CompanyController#uiSideBarMenuItems | COMPANY_API.GET_SIDE_BAR_ITEM | Ui Side Bar Menu Items |
| GET | `/company/{companyUniqueName}/users` | CompanyController#getUsers | COMPANY_API.GET_COMPANY_USERS | Get Users |
| PATCH | `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}/default` | WarehouseController#setDefaultWarehouse | WAREHOUSE_API.SET_DEFAULT_WAREHOUSE | Set Default Warehouse |
| GET | `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}` | WarehouseController#getWarehouse | WAREHOUSE_API.GET_WAREHOUSE_DETAILS | Get Warehouse |
| PATCH | `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}` | WarehouseController#updateWarehouseV2 | WAREHOUSE_API.UPDATE_WAREHOUSE_STATUS | Update Warehouse V2 |
| PUT | `/company/{companyUniqueName}/warehouse/{warehouseUniqueName}` | WarehouseController#updateWarehouse | WAREHOUSE_API.UPDATE<br>SETTINGS_PROFILE_API.EDIT_WAREHOUSE | Update Warehouse |
| GET | `/company/{companyUniqueName}/warehouse` | WarehouseController#getAllWarehouses | WAREHOUSE_API.FETCH | Get All Warehouses |
| POST | `/company/{companyUniqueName}/warehouse` | WarehouseController#createWarehouse | WAREHOUSE_API.CREATE<br>SETTINGS_PROFILE_API.CREATE_NEW_WAREHOUSE | Create Warehouse |
| POST | `/company` | CompanyController#create | COMPANY_API.CREATE_COMPANY | Create |

### 03-accounts-groups (106)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| GET | `/company/{companyUniqueName}/account-search-2` | SearchController#accountSearch2 | SEARCH_API.ACCOUNT_SEARCH_V2 | Account Search2 |
| POST | `/company/{companyUniqueName}/account-search-predicted` | SearchController#accountSearchPredicted | LEDGER_API.ACCOUNT_SEARCH_PREDICTION | Account Search Predicted |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/contacts` | AccountController#getCustomerVendorContact | ACCOUNTS_API.CREATE_UPDATE_DELETE | Get Customer Vendor Contact |
| PUT | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/contacts` | AccountController#addAndUpdateCustomerVendorContact | ACCOUNTS_API.CREATE_UPDATE_DELETE | Add And Update Customer Vendor Contact |
| DELETE | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/entries/{entryUniqueName:.+}` | EntryV1Controller#deleteEntry | LEDGER_API.DELETE_LEDGER_ENTRY | Delete Entry |
| DELETE | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/entries` | EntryV1Controller#deleteMultipleEntries | LEDGER_API.MULTIPLE_DELETE | Delete Multiple Entries |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/export-account-statement` | LedgerControllerV2#exportAccountStatement | ACCOUNT_STATEMENT_API.EXPORT_ACCOUNT_STATEMENT | Export Account Statement |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/reconcile` | LedgerControllerV2#retrieveAllPendingTransactions | LEDGER_API.RECONCILE<br>LEDGER_API.RECONCILIATION | Retrieve All Pending Transactions |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/view-statement` | LedgerControllerV2#viewStatement | ACCOUNT_STATEMENT_API.GET | View Statement |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers-v2/view-statement` | LedgerControllerV2#accountStatementWithAdvanceSearch | ACCOUNT_STATEMENT_API.GET | Account Statement With Advance Search |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/merge` | LedgerController#retrieveLedgers | LEDGER_API.ADVANCE_SEARCH | Retrieve Ledgers |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/ledgers/transactions` | LedgerController#retrieveAllLedgerTransactions | LEDGER_API.GET | the pagination requirements are specific to Giddh and may work |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/magic-link` | AccountController#generateMagicLink | LEDGER_API.MAGIC_LINK | Generate Magic Link |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/mail-ledger` | ImportExportController#mailLedgerAll | LEDGER_API.MAIL_LEDGER | Mail Ledger All |
| PUT | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/merge` | AccountController#mergeAccount | ACCOUNTS_API.MERGE | Merge Account |
| PUT | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/move` | AccountController#moveAccount | ACCOUNTS_API.MOVE | Move Account |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/shared-with` | AccountController#getSharedList | ACCOUNTS_API.SHARED_WITH | Get Shared List |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/tax-hierarchy` | AccountController#getTaxesAccountHierarchy | ACCOUNTS_API.TAX_HIERARCHY | Get Taxes Account Hierarchy |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/un-merge` | AccountController#unmergeAccount | ACCOUNTS_API.UNMERGE | Unmerge Account |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/v2/export-ledger-with-invoice/file` | ImportExportController#exportLedgerAndInvoiceDownloadFile | LEDGER_API.EXPORT_LEDGER_WITH_INVOICE_NUMBER | Export Ledger And Invoice Download File |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/v3/export-ledger/file` | ImportExportController#exportLedgerDownloadFileV3 | LEDGER_API.EXPORT_LEDGER | Export Ledger Download File V3 |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName:.+}` | AccountController#getActiveAccount | PURCHASE_RECORD | Get Active Account |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/autopaid` | AutoPaidController#autoAdjustVouchers | LEDGER_API.RUN_AUTOPAID | Auto Adjust Vouchers |
| DELETE | `/company/{companyUniqueName}/accounts/{accountUniqueName}/entries/{entryUniqueName:.+}` | LedgerController#delete | LEDGER_API.DELETE_LEDGER_ENTRY | Delete |
| DELETE | `/company/{companyUniqueName}/accounts/{accountUniqueName}/entries` | LedgerController#deleteMultiple | LEDGER_API.MULTIPLE_DELETE | Delete Multiple |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/giddh-ledger` | EntryController#getGiddhLedger | LEDGER_API.NEW_GET_LEDGER | Get Giddh Ledger |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/generate` | InvoiceController#generateInvoice | INVOICE_API.GENERATE_INVOICE | Generate Invoice |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/project-entries` | EntryController#getProjectEntries | ACCOUNTING_API.ENTRY_SEARCH | Get Project Entries |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/{uniqueName}/download` | PurchaseOrderAccountController#download | PURCHASE_ORDER_API.GET_PDF | Download purchase order Version 3 |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/{uniqueName}/mail` | PurchaseOrderAccountController#mailPurchaseOrder | PURCHASE_ORDER_API.EMAIL | Mail Purchase Order |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/generate` | PurchaseOrderAccountController#create | PURCHASE_ORDER_API.CREATE | Create |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/pending-numbers` | PurchaseOrderAccountController#getPendingPurchaseNumbers | PURCHASE_ORDER_API.GET_ALL_PENDING | Get Pending Purchase Numbers |
| PATCH | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/status/change` | PurchaseOrderAccountController#changeStatus | PURCHASE_ORDER_API.STATUS_UPDATE | Change Purchase order status API |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-order/versions/all` | PurchaseOrderAccountController#getPOVersions | PURCHASE_ORDER_API.GET_ALL_VERSIONS | Get all versions of a particular purchase order with provided purchase number |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}/download` | PurchaseAccountController#download | PURCHASE_RECORD_API.GET_PDF | Download purchase order Version 3 |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}/mail` | PurchaseAccountController#mailPurchaseOrder | PURCHASE_RECORD_API.EMAIL | Mail Purchase Order |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/{uniqueName}` | PurchaseAccountController#get | RECEIPT_API.GET_PURCHASE_RECORD | use to get purchase record |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/download-file` | PurchaseAccountController#downloadFile | PURCHASE_RECORD_API.DOWNLOAD_ATTACHMENT | Download File |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/generate` | PurchaseAccountController#create | PURCHASE_RECORD_API.GENERATE | Create |
| GET | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/validate` | PurchaseAccountController#validate | PURCHASE_RECORD_API.VALIDATE_RECORD | same account unique name, same tax number, same purchase Date |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record/versions/all` | PurchaseAccountController#getPRVersions | PURCHASE_RECORD_API.GET_ALL_VERSIONS | Get all versions of a particular purchase record with provided purchase record unique name |
| PATCH | `/company/{companyUniqueName}/accounts/{accountUniqueName}/purchase-record` | PurchaseAccountController#update | PURCHASE_RECORD_API.UPDATE | Update |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/{voucherNumber}/magic-link` | VoucherController#generateMagicLink | INVOICE_API_2.SEND_INVOICE_ON_SMS | Generate Magic Link |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bulk-export` | VoucherController#bulkExport | LEDGER_API.BULK_EXPORT_LEDGER | Bulk Export |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/cancel-einvoice` | VoucherController#cancelEInvoice | INVOICE_API_2.CANCEL_E_INVOICE | Cancel EInvoice |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/download-file` | VoucherController#download | LEDGER_API.DOWNLOAD_INVOICE<br>INVOICE_API_2.DOWNLOAD_INVOICE<br>RECEIPT_API.DOWNLOAD_VOUCHER | Download |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` | VoucherController#generate | SALES_API_V2.GENERATE_GENERIC_ITEMS | Generate |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/mail` | VoucherController#mailInvoice | INVOICE_API_2.SEND_INVOICE_ON_MAIL | Mail Invoice |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/mail` | VoucherController#mail | INVOICE_API_2.SEND_INVOICE_ON_MAIL | Mail |
| POST | `/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/preview` | VoucherController#getInvoicePreview | INVOICE_API_2.PREVIEW_VOUCHERS | Get Invoice Preview |
| DELETE | `/company/{companyUniqueName}/bank/accounts/{accountUniqueName:.+}/transactions` | ICICIBankController#deleteEntries | LEDGER_API.DELETE_BANK_TRANSACTIONS | API : Delete multiple Transactions by transaction unique id |
| POST | `/company/{companyUniqueName}/discount/assign-v2` | DiscountController#assignDiscountV2 | APPLY_DISCOUNT_API.APPLY_DISCOUNTS_V2 | API to assign discounts on group / account |
| GET | `/company/{companyUniqueName}/gocardless/refresh` | GoCardlessBankIntegrationController#fetchAccountTransactionsOnRefresh | CONTACT_API.GOCARDLESS_BANK_TRANSACTIONS_REFRESH | Fetch Account Transactions On Refresh |
| POST | `/company/{companyUniqueName}/gocardless/requisitions/{reference}` | GoCardlessBankIntegrationController#fetchAccountDetails | SETTINGS_INTEGRATION_API.GOCARDLESS.GET_REQUISITION | Fetch Account Details |
| GET | `/company/{companyUniqueName}/group-search` | SearchController#groupSearch | GROUP_API.SEARCH_GROUPS | Group Search |
| GET | `/company/{companyUniqueName}/groups/{groupUniqueName}/masters` | MastersController#groupMasters | GROUP_API.GET_MASTERS | Group Masters |
| PUT | `/company/{companyUniqueName}/groups/{groupUniqueName}/move` | GroupController#moveGroups | GROUP_API.MOVE_GROUP | Move Groups |
| GET | `/company/{companyUniqueName}/groups/{groupUniqueName}/shared-with` | GroupController#getSharedList | GROUP_API.SHARED_WITH | Get Shared List |
| GET | `/company/{companyUniqueName}/groups/{groupUniqueName}/tax-hierarchy` | GroupController#getTaxesAccountHierarchy | GROUP_API.TAX_HIERARCHY | Get Taxes Account Hierarchy |
| DELETE | `/company/{companyUniqueName}/paypal` | PaypalController#deletePaypalAccountForCompany | SETTINGS_INTEGRATION_API.PAYPAL | Delete Paypal Account For Company |
| GET | `/company/{companyUniqueName}/paypal` | PaypalController#getPaypalAccount | SETTINGS_INTEGRATION_API.PAYPAL | Get Paypal Account |
| POST | `/company/{companyUniqueName}/paypal` | PaypalController#addPaypalAccount | SETTINGS_INTEGRATION_API.PAYPAL | Add Paypal Account |
| PUT | `/company/{companyUniqueName}/paypal` | PaypalController#updatePaypalAccount | SETTINGS_INTEGRATION_API.PAYPAL | Update Paypal Account |
| DELETE | `/company/{companyUniqueName}/razorpay` | RazorPayController#deleteRazorPayAccountForCompany | INVOICE_API.GET_RAZORPAY_DETAIL<br>SETTINGS_INTEGRATION_API.RAZORPAY | Delete Razor Pay Account For Company |
| GET | `/company/{companyUniqueName}/razorpay` | RazorPayController#getRazorPayAccount | INVOICE_API.GET_RAZORPAY_DETAIL<br>SETTINGS_INTEGRATION_API.RAZORPAY | Get Razor Pay Account |
| POST | `/company/{companyUniqueName}/razorpay` | RazorPayController#addRazorPayAccount | INVOICE_API.GET_RAZORPAY_DETAIL<br>SETTINGS_INTEGRATION_API.RAZORPAY | Add Razor Pay Account |
| PUT | `/company/{companyUniqueName}/razorpay` | RazorPayController#updateOrMapRazorPayAccount | INVOICE_API.GET_RAZORPAY_DETAIL<br>SETTINGS_INTEGRATION_API.RAZORPAY | Update Or Map Razor Pay Account |
| POST | `/company/{companyUniqueName}/tax/assign` | TaxController#assignTaxesOnGroupsAndAccounts | APPLY_TAX_API.APPLY_TAX | Assign Taxes On Groups And Accounts |
| GET | `/company/{companyUniqueName}/top-inventory-groups` | MastersController#topInventoryGroups | INVENTORY_API.MASTER.TOP_INVENTORY_GROUPS | Top Inventory Groups |
| GET | `/company/{companyUniqueName}/us/export-sales-report-account-wise` | USVatReturnController#downloadVatReportAccountWise | COMPANY_API.EXPORT_SALES_ACCOUNT_WISE_REPORT | Download Vat Report Account Wise |
| GET | `/company/{companyUniqueName}/us/sales-report-account-wise` | USVatReturnController#getVatReportAccountWise | COMPANY_API.GET_SALES_TAX_ACCOUNT_WISE_REPORT | Get Vat Report Account Wise |
| GET | `/company/{companyUniqueName}/v3/account-search` | SearchController#accountSearchV3 | SEARCH_API.ACCOUNT_SEARCH_V3 | Account Search V3 |
| GET | `/company/{companyUniqueName}/yodlee/accounts/{accountUniqueName:.+}/eledgers` | YodleeControllerV2#getTransactions | LEDGER_API.GET_BANK_TRANSACTIONS | Get Transactions |
| GET | `/country/company/{companyUniqueName}/account-countries` | CountryAndStateController#getAccountCountriesByCompany | COMPANY_API.GET_ACCOUNT_COUNTRIES | Get Account Countries By Company |
| GET | `/ui/party-types` | UIController#formDataForPartyTypes | COMMON_API.PARTY_TYPE | API to fetch party types for account |
| POST | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/balance` | AccountV2Controller#calculateClosingBalance | LEDGER_API.GET_BALANCE | Calculate Closing Balance |
| POST | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/invoice/preview` | InvoiceV2Controller#generatedInvoicePreview | INVOICE_API_2.GENERATED_INVOICE_PREVIEW | Generated Invoice Preview |
| POST | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/invoices/generate` | InvoiceV2Controller#generateInvoice | INVOICE_API_2.GENERATE_INVOICE | Generate Invoice |
| PUT | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/invoices` | InvoiceV2Controller#updateInvoice | INVOICE_API_2.UPDATE_GENERATED_INVOICE | Update Invoice |
| DELETE | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/report-comment` | AccountV2Controller#deleteComment | CONTACT_API.ADD_COMMENT | Delete Comment |
| POST | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}/report-comment` | AccountV2Controller#addComment | CONTACT_API.ADD_COMMENT | Add Comment |
| GET | `/v2/company/{companyUniqueName}/accounts/{accountUniqueName:.+}` | AccountV2Controller#getActiveAccountV2 | ACCOUNTS_API_V2.GET | Get Active Account V2 |
| POST | `/v2/company/{companyUniqueName}/accounts/send-mail` | AccountV2Controller#sendMailToCustomerVendor | CONTACT_API.SEND_EMAIL_TEMPLATE | Send Mail To Customer Vendor |
| GET | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}/payor/{urn:.+}/status` | ICICIBankControllerV2#getRegistrationStatus | SETTINGS_INTEGRATION_API.GET_PAYOR_REGISTRATION_STATUS | API : Get registration status of the integrated bank account . |
| GET | `/v2/company/{companyUniqueName}/groups/{groupUniqueName:.+}` | GroupV2Controller#getGroupV2 | GROUP_API.GET_GROUP_DETAILS | Get Group V2 |
| POST | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/account-closing-balance` | GroupV2Controller#calculateAccountBalance | SEARCH_API.SEARCH | Calculate Account Balance |
| PUT | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/accounts/{accountUniqueName:.+}` | AccountWithGroupV2Controller#updateAccount | ACCOUNTS_API_V2.UPDATE | Update Account |
| GET | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/download-account-closing-balance` | GroupV2Controller#downloadAccountBalance | COMPANY_API.DOWNLOAD_CSV | Download Account Balance |
| POST | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/download-account-closing-balance` | GroupV2Controller#downloadAccountBalance | COMPANY_API.DOWNLOAD_XLSX | Download Account Balance |
| POST | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/email-account-closing-balance` | GroupV2Controller#emailAccountBalance | COMPANY_API.SEND_EMAIL | Email Account Balance |
| POST | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/export/account-balances-v2` | GroupV2Controller#exportAccountBalancesByGroupWithExportSettings | LEDGER_API.GET_COLUMNAR_REPORT | Export Account Balances By Group With Export Settings |
| GET | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/flatten-accounts` | GroupV2Controller#getFlattenGroupsAndAccountsOfGroup | INVENTORY_API.GET_FLATTEN_ACCOUNTS | Get Flatten Groups And Accounts Of Group |
| POST | `/v2/company/{companyUniqueName}/groups/{groupUniqueName}/sms-account-closing-balance` | GroupV2Controller#smsAccountBalance | COMPANY_API.SEND_SMS | Sms Account Balance |
| POST | `/v2/company/{companyUniqueName}/groups/flatten-groups-with-accounts` | GroupV2Controller#getFlattenGroupsAndAccountsOfGroups | INVENTORY_API.GET_FLATTEN_GROUP_WITH_ACCOUNTS | Get Flatten Groups And Accounts Of Groups |
| PATCH | `/v2/subscription/billing-account/{billingAccountUniqueName}` | SubscriptionControllerV2#updateSubscriptionBillingAccount | SUBSCRIPTION_V2_API.UPDATE_BILLING_DETAILS | Update Subscription Billing Account |
| GET | `/v2/subscription/billing-account/get` | SubscriptionControllerV2#getSubscriptionBillingAccountByUser | SUBSCRIPTION_V2_API.GET_BILLING_DETAILS | Get Subscription Billing Account By User |
| POST | `/v3/company/{companyUniqueName}/accounts/{accountUniqueName}/proformas/generate-via-estimate` | ProformaV3Controller#generateProformaViaEstimate | ESTIMATES_API.generateProforma | This function is used to generate proforma via estimate . |
| GET | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bill-to-bill/export-v2` | VoucherV4Controller#exportBillToBillReportWithExportSettings | LEDGER_API.EXPORT_BILL_TO_BILL | Export Bill To Bill Report With Export Settings |
| POST | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/bulk-generate` | VoucherV4Controller#bulkGenerate | INVOICE_API.GENERATE_BULK_INVOICE | Bulk Generate |
| POST | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` | VoucherV4Controller#generate | SALES_API_V4.GENERATE_GENERIC_ITEMS | This function will create new voucher based on provided request |
| POST | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers/generate` | VoucherController#create | SALES_API_V4.GENERATE_GENERIC_ITEMS | Create |
| POST | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | VoucherV4Controller#getVoucher | INVOICE_API_2.PREVIEW_VOUCHERS_V4<br>RECEIPT_API.GET_DETAILS_V4 | This function is use to get the voucher by provide voucher number and voucher type. |
| POST | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | VoucherController#get | INVOICE_API_2.PREVIEW_VOUCHERS_V4<br>RECEIPT_API.GET_DETAILS_V4 | Get |
| PUT | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | VoucherV4Controller#updateVoucher | SALES_API_V4.UPDATE_VOUCHER | this function will update the voucher based on provided request |
| PUT | `/v4/company/{companyUniqueName}/accounts/{accountUniqueName}/vouchers` | VoucherController#update | SALES_API_V4.UPDATE_VOUCHER | Update |
| GET | `/v4/company/{companyUniqueName}/particular` | ParticularController#getActiveParticularAccountV3 | COMMON_API.BARCODE_SCAN | Get Active Particular Account V3 |

### 04-ledger-daybook (2)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| GET | `/company/{companyUniqueName}/ledger/upload/{attachedFileUniqueName}` | ImageController#getUploadedFile | LEDGER_API.DOWNLOAD_ATTACHMENT | Get Uploaded File |
| GET | `/magic-link/{magicLink}` | MagicLinkController#getLedgers | LEDGER_API.GET_MAGIC_LINK_DATA<br>LEDGER_API.GET_MAGIC_LINK_DATA_WITH_DATE | <p> Use {@link MagicLinkController getLedgersV2(String, String, String, int, int, String, String, boolean, HttpServletRequest)} |

### 05-vouchers-sales (53)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| POST | `/company/{companyUniqueName}/advance-receipt/adjust` | AdvanceReceiptController#adjustAdvanceReceiptEntryWithInvoice | ADVANCE_RECEIPTS_API.INVOICE_ADJUSTMENT_WITH_ADVANCE_RECEIPT | / |
| POST | `/company/{companyUniqueName}/advance-receipt/get-all` | AdvanceReceiptController#getReceipts | RECEIPT_API.GET_ALL_ADVANCE_RECEIPTS | Get Receipts |
| GET | `/company/{companyUniqueName}/advance-receipt/summary` | AdvanceReceiptController#getReceiptSummary | RECEIPT_API.GET_ADVANCE_RECEIPTS_SUMMARY | Get Receipt Summary |
| POST | `/company/{companyUniqueName}/bank/payments` | ICICIBankController#bulkPayment | COMPANY_API.BULK_PAYMENT | Bulk Payment |
| POST | `/company/{companyUniqueName}/batch/{batchUniqueName}/archive` | BatchController#archiveBatch | INVENTORY_API.BATCH.ARCHIVE | Soft-delete ({@code isActive = 1}) only if the batch is not on a voucher or DC/RC. |
| GET | `/company/{companyUniqueName}/completed-document-count` | VoucherController#getCompletedDocument | AI_OCR_API.COMPLETED_COUNT | Get Completed Document |
| POST | `/company/{companyUniqueName}/download-file` | VoucherController#download | COMMON_API.DOWNLOAD_FILE | Download |
| POST | `/company/{companyUniqueName}/ewb/validate-invoice` | EWayBillController#validateInvoice | EWAYBILL_API.VALIDATE_INVOICE_EWAYBILL | Validate Invoice |
| PUT | `/company/{companyUniqueName}/invoice-setting` | InvoiceSettingController#updateInvoiceEmail | INVOICE_API.UPDATE_INVOICE_EMAIL | Update Invoice Email |
| POST | `/company/{companyUniqueName}/invoices/{invoiceUniqueName}/action` | InvoiceController#payInvoice | INVOICE_API.ACTION_ON_INVOICE | Pay Invoice |
| POST | `/company/{companyUniqueName}/invoices/{voucherUniqueName}/action` | VoucherController#action | INVOICE_API.ACTION_ON_INVOICE | Action |
| DELETE | `/company/{companyUniqueName}/invoices` | InvoiceController#deleteInvoice | INVOICE_API.DELETE_INVOICE | Delete Invoice |
| GET | `/company/{companyUniqueName}/ocr-data` | VoucherController#getOcrUploadedData | AI_OCR_API.EXTRACT_DOCUMENTS | Get Ocr Uploaded Data |
| PUT | `/company/{companyUniqueName}/purchase-bill-setting` | PurchaseBillSettingController#updateInvoiceEmail | PURCHASE_ORDER_API.UPDATE_SETTINGS_EMAIL | Update Invoice Email |
| DELETE | `/company/{companyUniqueName}/recurring-voucher/{recurringVoucherUniqueName}` | RecurringVoucherController#delete | RECURRING_VOUCHER_API.DELETE | Delete |
| PATCH | `/company/{companyUniqueName}/recurring-voucher/{recurringVoucherUniqueName}` | RecurringVoucherController#updateRecurringVoucherPatch | RECURRING_VOUCHER_API.UPDATE | Update Recurring Voucher Patch |
| GET | `/company/{companyUniqueName}/recurring-voucher/get-all` | RecurringVoucherController#getAllRecurringVoucher | RECURRING_VOUCHER_API.GET | Get All Recurring Voucher |
| POST | `/company/{companyUniqueName}/recurring-voucher/get-all` | RecurringVoucherController#getAllRecurringVoucher | RECURRING_VOUCHER_API.GET | Get All Recurring Voucher |
| POST | `/company/{companyUniqueName}/recurring-voucher` | RecurringVoucherController#addRecurringVoucher | RECURRING_VOUCHER_API.CREATE | Add Recurring Voucher |
| GET | `/company/{companyUniqueName}/salesperson` | SalesPersonController#getAll | SALES_PERSON_API | Get All |
| POST | `/company/{companyUniqueName}/uk/payment/initiate` | UKVatReturnController#initiatePayment | VAT_API.INITIATE_PAYMENT | POST /company/{companyUniqueName}/uk/payment/initiate |
| POST | `/company/{companyUniqueName}/uk/retrieve-vat-payments` | UKVatReturnController#retrieveVatPayments | VAT_API.PAYMENTS | Retrieve Vat Payments |
| GET | `/company/{companyUniqueName}/us/export-sales-report-tax-wise` | USVatReturnController#downloadVatReportTaxWise | COMPANY_API.EXPORT_SALES_TAX_WISE_REPORT | Download Vat Report Tax Wise |
| GET | `/company/{companyUniqueName}/us/sales-report-tax-wise` | USVatReturnController#getVatReportTaxWise | COMPANY_API.GET_SALES_TAX_WISE_REPORT | Get Vat Report Tax Wise |
| POST | `/company/{companyUniqueName}/voucher/{voucherUniqueName}/cancel-einvoice` | VoucherDocController#cancelEInvoiceForVoucher | INVOICE_API.CANCEL_CN_DN_E_INVOICE_API | Cancel EInvoice For Voucher |
| GET | `/company/{companyUniqueName}/voucher/{voucherUniqueName}/versions` | VoucherController#getVoucherVersion | INVOICE_API.GET_ALL_VERSIONS | Get Voucher Version |
| POST | `/company/{companyUniqueName}/vouchers/{voucherUniqueName}/adjust` | VoucherController#adjustVouchers | ADVANCE_RECEIPTS_API.VOUCHER_ADJUSTMENT_WITH_ADVANCE_RECEIPT | Adjust Vouchers |
| POST | `/company/{companyUniqueName}/vouchers/bulk-export` | CompanyVoucherController#bulkExportVouchers | BULK_VOUCHER_EXPORT_API.BULK_EXPORT | Bulk Export Vouchers |
| POST | `/company/{companyUniqueName}/vouchers/bulk-export` | VoucherController#bulkExport | BULK_VOUCHER_EXPORT_API.BULK_EXPORT | Bulk Export |
| POST | `/company/{companyUniqueName}/vouchers/get-all-vouchers-balances` | CompanyVoucherController#getAllBalancesVouchers | RECEIPT_API.GET_ALL_BAL_SALE_DUE | Get All Balances Vouchers |
| POST | `/company/{companyUniqueName}/vouchers/get-all-vouchers-balances` | VoucherController#getAllBalancesVouchers | RECEIPT_API.GET_ALL_BAL_SALE_DUE | Get All Balances Vouchers |
| POST | `/company/{companyUniqueName}/vouchers/invoice-list` | CompanyVoucherController#getListOfInvoicesForLinking | LEDGER_API.GET_VOUCHER_INVOICE_LIST<br>SALES_API_V2.GET_VOUCHER_INVOICE_LIST | Get List Of Invoices For Linking |
| POST | `/company/{companyUniqueName}/vouchers/invoice-list` | VoucherController#getUnAdjustedVouchers | LEDGER_API.GET_VOUCHER_INVOICE_LIST<br>SALES_API_V2.GET_VOUCHER_INVOICE_LIST | Get Un Adjusted Vouchers |
| POST | `/company/{companyUniqueName}/vouchers/voucher-status-count` | VoucherController#getVoucherStatusCount | DASHBOARD_API.GET_PENDING_VOUCHERS_COUNT | Get Voucher Status Count |
| POST | `/exception/invalid-json` | CustomExceptionController#generateInvoice | INLINE.auth.invalidJson | Generate Invoice |
| GET | `/magic-link/{magicLink}/download-invoice/{invoiceNumber}` | MagicLinkController#downloadInvoice | LEDGER_API.MAGIC_LINK_DOWNLOAD_FILE | Download Invoice |
| GET | `/subscription/generateOrder` | SubscriptionController#generateOrderForSubscriptionPayment | COMPANY_API.RAZORPAY_ORDERID | Generate Order For Subscription Payment |
| GET | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}/payor` | ICICIBankControllerV2#getPayorsForPayment | SETTINGS_INTEGRATION_API.GET_BANK_ACCOUNT_PAYORS | Get Payors For Payment |
| GET | `/v2/company/{companyUniqueName}/gstr-reconcile/invoices` | GstReturnV2Controller#getB2bInvoices | GST_RECONCILE_API.GET_INVOICES | Get B2b Invoices |
| GET | `/v2/company/{companyUniqueName}/invoices/list` | InvoiceV2Controller#getAllInvoicesWithInvoiceNumber | LEDGER_API.GET_UNPAID_INVOICE_LIST | Get All Invoices With Invoice Number |
| ANY | `/v2/company/{companyUniqueName}/template-preview` | VoucherController#getTemplatePreview | INVOICE_API.SAVE_TEMPLATE_SETTINGS | Get Template Preview |
| ANY | `/v2/company/{companyUniqueName}/templates/{templateUniqueName}` | VoucherController#downloadTemplatePreview | INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS<br>INVOICE_API.DELETE_TEMPLATE<br>INVOICE_API.GET_TEMPLATE_PREVIEW | Download Template Preview |
| POST | `/v2/subscription/{subscriptionId}/capture-wallet-payment` | SubscriptionControllerV2#captureWalletPayment | WALLET_API.CAPTURE_WALLET_PAYMENT | Capture Wallet Payment |
| GET | `/v2/subscription/{subscriptionId}/payment-methods` | SubscriptionControllerV2#getAllSubscriptionPaymentMethods | SUBSCRIPTION_V2_API.GET_PAYMENT_METHODS | Get All Subscription Payment Methods |
| GET | `/v2/subscription/{subscriptionId}/payment/{paymentId}/save-razorpay-token` | SubscriptionControllerV2#saveRazorpayToken | SUBSCRIPTION_V2_API.SAVE_RAZORPAY_TOKEN | Save Razorpay Token |
| GET | `/v2/subscription/{subscriptionId}/payment/{paymentIntentId}/save-stripe-payment` | SubscriptionControllerV2#saveStripePaymentMethod | SUBSCRIPTION_V2_API.SAVE_STRIPE_PAYMENT | Save Stripe Payment Method |
| DELETE | `/v2/subscription/payment-method/{paymentUniqueName}` | SubscriptionControllerV2#deleteSubscriptionPaymentInfo | SUBSCRIPTION_V2_API.DELETE_PAYMENT_METHOD | Delete Subscription Payment Info |
| PATCH | `/v2/subscription/payment-method/{paymentUniqueName}` | SubscriptionControllerV2#updateDefaultSubscriptionPaymentInfo | SUBSCRIPTION_V2_API.SET_DEFAULT_PAYMENT_METHOD | Update Default Subscription Payment Info |
| POST | `/v2/subscription/update` | SubscriptionControllerV2#updateSubscriptionAfterPayment | SUBSCRIPTION_V2_API.UPDATE_PLAN | Update Subscription After Payment |
| POST | `/v2/subscription` | SubscriptionControllerV2#createSubscription | SUBSCRIPTION_V2_API.CREATE_SUBSCRIPTION<br>SUBSCRIPTION_V2_API.UPDATE_SUBSCRIPTION | Also it add plan info to subscription if user selects plan without selecting payment method and later |
| POST | `/v4/company/{companyUniqueName}/vouchers/{voucherUniqueName}/make-recurring` | VoucherController#makeVoucherRecurring | RECURRING_API.MAKE_RECURRING | used to generate recurring |
| POST | `/v4/company/{companyUniqueName}/vouchers/bulk-generate` | VoucherController#bulkCreate | INVOICE_API_2.GENERATE_BULK_INVOICE | Bulk Create |
| PATCH | `/v4/company/{companyUniqueName}/vouchers` | VoucherController#updatePatch | SALES_API_V4.UPDATE_ATTACHMENT | Update Patch |

### 07-inventory-manufacturing (81)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| DELETE | `/company/{companyUniqueName}/batch/{batchUniqueName}` | BatchController#deleteBatch | INVENTORY_API.BATCH.DELETE | Update batch details (name, manufacturing/expiry dates, optional rename via newBatchNumber, |
| PUT | `/company/{companyUniqueName}/batch/{batchUniqueName}` | BatchController#updateBatch | INVENTORY_API.BATCH.UPDATE | Update batch details (name, manufacturing/expiry dates, optional rename via newBatchNumber, |
| POST | `/company/{companyUniqueName}/batch/all` | BatchController#getAllBatches | INVENTORY_API.BATCH.GET_ALL | Get single batch details by uniqueName: stock/variant, mfg/expiry, days remaining, |
| GET | `/company/{companyUniqueName}/customer-vendor-discount/get-all-discounts` | CustomerVendorVariantDiscountController#getDiscountInfoForForCustomer | INVENTORY_API.GET_ALL_DISCOUNTS | Get Discount Info For For Customer |
| POST | `/company/{companyUniqueName}/customer-vendor-discount/stock/{stockUniqueName}/assign-discount` | CustomerVendorVariantDiscountController#createCustomerVariantDiscount | INVENTORY_API.CREATE_DISCOUNT | Create Customer Variant Discount |
| PATCH | `/company/{companyUniqueName}/customer-vendor-discount/stock/{stockUniqueName}/variant/{variantUniqueName}/update-discount` | CustomerVendorVariantDiscountController#updateCustomerVariantDiscount | INVENTORY_API.UPDATE_DISCOUNT | Update Customer Variant Discount |
| DELETE | `/company/{companyUniqueName}/customer-vendor-discount` | CustomerVendorVariantDiscountController#deleteCustomerVariantDiscount | INVENTORY_API.DELETE_DISCOUNT_RECORD | Delete Customer Variant Discount |
| DELETE | `/company/{companyUniqueName}/inventory-adjustment/{refNo}` | InventoryAdjustmentController#delete | INVENTORY_API.INVENTORY_ADJUST.DELETE | Delete |
| GET | `/company/{companyUniqueName}/inventory-adjustment/{refNo}` | InventoryAdjustmentController#get | INVENTORY_API.INVENTORY_ADJUST.GET | Get |
| PUT | `/company/{companyUniqueName}/inventory-adjustment/{refNo}` | InventoryAdjustmentController#update | INVENTORY_API.INVENTORY_ADJUST.UPDATE_INVENTORY | Update |
| POST | `/company/{companyUniqueName}/inventory-adjustment/adjustment-report` | InventoryAdjustmentController#getAdjustmentReport | INVENTORY_API.INVENTORY_ADJUST.REPORT | Get Adjustment Report |
| GET | `/company/{companyUniqueName}/inventory-adjustment/reason/get-all` | InventoryAdjustmentReasonController#getAll | INVENTORY_API.INVENTORY_ADJUST.GET_REASON | Get All |
| POST | `/company/{companyUniqueName}/inventory-adjustment/reason` | InventoryAdjustmentReasonController#create | INVENTORY_API.INVENTORY_ADJUST.CREATE_REASON | Create |
| POST | `/company/{companyUniqueName}/inventory-adjustment` | InventoryAdjustmentController#create | INVENTORY_API.INVENTORY_ADJUST.CREATE_INVENTORY | Create |
| POST | `/company/{companyUniqueName}/inventory-search` | SearchController#inventorySearch | INVENTORY_API.SEARCH_STOCK_TRANSACTION_FILTERS | Inventory Search |
| GET | `/company/{companyUniqueName}/inventory-settings` | InventorySettingsController#get | INVENTORY_API.INVENTORY_SETTINGS | Get |
| PUT | `/company/{companyUniqueName}/inventory-settings` | InventorySettingsController#update | INVENTORY_API.INVENTORY_SETTINGS | Update |
| PATCH | `/company/{companyUniqueName}/inventory-users/{inventoryUserUniqueName}/inventory-entries/{inventoryEntryUniqueName:.+}/description` | InventoryEntryController#updateInventoryEntryDescription | INVENTORY_API.UPDATE_DESCRIPTION | Api for updates Job work inventory entry description |
| POST | `/company/{companyUniqueName}/inventory-users/{inventoryUserUniqueName}/inventory-entries` | InventoryEntryController#createInventoryEntry | INVENTORY_API.ENTRY.CREATE | Create Inventory Entry |
| GET | `/company/{companyUniqueName}/inventory-users` | InventoryUserController#getAllInventoryUsers | INVENTORY_API.USER.GET_ALL | Get All Inventory Users |
| GET | `/company/{companyUniqueName}/inventory/{stockGroupUniqueName}/masters` | MastersController#inventoryMasters | INVENTORY_API.MASTER.GET_MASTER | Inventory Masters |
| POST | `/company/{companyUniqueName}/inventory/transaction-report` | InventoryReportController#getStockTransactionReport | INVENTORY_API.TRANSACTION_STOCK_REPORT_V2 | Get Stock Transaction Report |
| GET | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/download-inventory-report-v2` | StockGroupController#exportStockGroupInventoryReportV2 | INVENTORY_API.DOWNLOAD_INVENTORY_GROUP_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_GROUP_STOCK_REPORT_API} |
| POST | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/download-inventory-report-v2` | StockGroupController#exportStockGroupInventoryReportV2 | INVENTORY_API.DOWNLOAD_INVENTORY_GROUP_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_GROUP_STOCK_REPORT_API} |
| POST | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/inventory-report-v3` | StockGroupController#createStockGroupReport | INVENTORY_API.GROUP_STOCK_REPORT_V3 | Create Stock Group Report |
| GET | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}/report` | StockGroupController#getStockGroupReport | INVENTORY_API.GROUP_STOCK_REPORT | Get Stock Group Report |
| GET | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}` | StockGroupController#get | INVENTORY_API.GET_STOCK_GROUP<br>INVENTORY_API.GROUPS_STOCKS | Get |
| DELETE | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | StockWithGroupController#delete | INVENTORY_API.DELETE_STOCK | Delete |
| GET | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | StockWithGroupController#get | INVENTORY_API.STOCK_DETAIL | Get |
| PUT | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName:.+}` | StockWithGroupController#update | INVENTORY_API.NEW.UPDATE<br>INVENTORY_API.UPDATE_STOCK | Update |
| GET | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/download-stock-inventory-report-v3` | StockWithGroupController#downloadStockReportV3 | INVENTORY_API.DOWNLOAD_INVENTORY_STOCK_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_STOCK_REPORT_API} |
| POST | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/download-stock-inventory-report-v3` | StockWithGroupController#downloadStockReportV3 | INVENTORY_API.DOWNLOAD_INVENTORY_STOCK_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_STOCK_REPORT_API} |
| GET | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/report-v2` | StockWithGroupController#getStockReportV2 | INVENTORY_API.STOCK_REPORT | Get Stock Report V2 |
| POST | `/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock/{stockUniqueName}/report-v2` | StockWithGroupController#getStockReportV2 | INVENTORY_API.STOCK_REPORT_V2 | Get Stock Report V2 |
| DELETE | `/company/{companyUniqueName}/stock-unit-group/{stockUnitGroupUniqueName:.+}` | StockUnitGroupController#delete | INVENTORY_API.UPDATE_STOCK_UNIT_GROUP | Delete |
| PUT | `/company/{companyUniqueName}/stock-unit-group/{stockUnitGroupUniqueName:.+}` | StockUnitGroupController#update | INVENTORY_API.UPDATE_STOCK_UNIT_GROUP | Update |
| GET | `/company/{companyUniqueName}/stock-unit-group` | StockUnitGroupController#getAll | INVENTORY_API.GET_STOCK_UNIT_GROUPS | Get All |
| POST | `/company/{companyUniqueName}/stock-unit-group` | StockUnitGroupController#create | INVENTORY_API.GET_STOCK_UNIT_GROUPS | Create |
| DELETE | `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName:.+}` | StockUnitController#delete | INVENTORY_API.DELETE_STOCK_UNIT | Delete |
| GET | `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName:.+}` | StockUnitController#get | INVENTORY_API.GET_STOCK_UNIT_WITH_NAME<br>INVENTORY_API.UPDATE_STOCK_UNIT | Get |
| PUT | `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName:.+}` | StockUnitController#update | INVENTORY_API.UPDATE_STOCK_UNIT | Update |
| GET | `/company/{companyUniqueName}/stock-unit/{stockUnitUniqueName}/linked-stock-units` | StockUnitController#getAllMappedUnitOfStock | MANUFACTURING_API.GET_STOCK_UNITS | Get All Mapped Unit Of Stock |
| POST | `/company/{companyUniqueName}/stock-unit/mappings` | StockUnitController#getAllMappings | INVENTORY_API.GET_STOCK_MAPPED_UNIT | Get All Mappings |
| GET | `/company/{companyUniqueName}/stock-unit` | StockUnitController#getAll | INVENTORY_API.STOCK_UNIT | Get All |
| POST | `/company/{companyUniqueName}/stock-unit` | StockUnitController#create | INVENTORY_API.CREATE_STOCK_UNIT | Create |
| PUT | `/company/{companyUniqueName}/stock/{stockUniqueName:.+}/move` | StockController#moveStock | INVENTORY_API.MOVE_STOCK | Move Stock |
| GET | `/company/{companyUniqueName}/stock/{stockUniqueName:.+}/variants` | StockController#getStockVariants | LEDGER_API.GET_STOCK_VARIANTS | Get Stock Variants |
| GET | `/company/{companyUniqueName}/stock/{stockUniqueName:.+}` | StockController#get | INVENTORY_API.GET_STOCK_WITH_UNIQUENAME<br>INVENTORY_API.NEW.GET | Get |
| GET | `/company/{companyUniqueName}/stock/{stockUniqueName}/inventory-report` | StockController#inventoryReport | INVENTORY_API.REPORT | Inventory Report |
| POST | `/company/{companyUniqueName}/stock/{stockUniqueName}/inventory-report` | StockController#inventoryReport | INVENTORY_API.REPORT_V2 | Inventory Report |
| GET | `/company/{companyUniqueName}/stock/{stockUniqueName}/link-with-rates` | StockController#getLinkedStocksWithRates | MANUFACTURING_API.GET_STOCK_WITH_RATE | Get Linked Stocks With Rates |
| DELETE | `/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture/{manufactureUniqueName}` | ManufacturingController#deleteManufacturingDetails | MANUFACTURING_API.DELETE | Delete Manufacturing Details |
| PUT | `/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture/{manufactureUniqueName}` | ManufacturingController#updateManufacturingStock | MANUFACTURING_API.UPDATE | Update Manufacturing Stock |
| POST | `/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture` | ManufacturingController#manufactureStock | MANUFACTURING_API.CREATE | Manufacture Stock |
| POST | `/company/{companyUniqueName}/stock/{stockUniqueName}/rate-for-stock-v2` | StockController#getRateForStockV2 | MANUFACTURING_API.GET_RATE_FOR_STOCK | Get Rate For Stock V2 |
| POST | `/company/{companyUniqueName}/stock/{stockUniqueName}/rate-for-stock` | StockController#getRateForStock | INVENTORY_API.GET_RATE_FOR_STOCK | Get Rate For Stock |
| POST | `/company/{companyUniqueName}/stock/{stockUniqueName}/recipe/get` | ManufacturingRecipeController#getManufacturingRecipe | MANUFACTURING_API.GET_RECIPE | CASE a). WHEN variantUniqueNames is empty then all the variant of the given stock which has info related to manufacturing will be returned |
| POST | `/company/{companyUniqueName}/stock/{stockUniqueName}/recipe` | ManufacturingRecipeController#createManufacturingRecipe | MANUFACTURING_API.CREATE_RECIPE | Create Manufacturing Recipe |
| GET | `/company/{companyUniqueName}/stock/manufacture-report` | ManufacturingController#getManufacturingReport | MANUFACTURING_API.MF_REPORT | Get Manufacturing Report |
| GET | `/v2/company/{companyUniqueName}/download-all-inventory-hierarchy` | CompanyV2Controller#exportAllInventoryStocks | INVENTORY_API.DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_STOCK_IN_HIERARCHY_API} |
| POST | `/v2/company/{companyUniqueName}/download-all-inventory-hierarchy` | CompanyV2Controller#exportAllInventoryStocks | INVENTORY_API.DOWNLOAD_INVENTORY_HIERARCHICAL_STOCKS_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_STOCK_IN_HIERARCHY_API} |
| GET | `/v2/company/{companyUniqueName}/download-all-inventory-report-v2` | CompanyV2Controller#exportAllStockGroupInventoryReportV2 | INVENTORY_API.DOWNLOAD_INVENTORY_ALL_GROUP_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_GROUP_STOCK_REPORT_API} |
| POST | `/v2/company/{companyUniqueName}/download-all-inventory-report-v2` | CompanyV2Controller#exportAllStockGroupInventoryReportV2 | INVENTORY_API.DOWNLOAD_INVENTORY_ALL_GROUP_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ALL_GROUP_STOCK_REPORT_API} |
| GET | `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` | CompanyV2Controller#exportInventoryStocksArrangedByAccounts | INVENTORY_API.DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ARRANGEDBY_ACCOUNTS} |
| POST | `/v2/company/{companyUniqueName}/download-inventory-arrangedby-accounts` | CompanyV2Controller#exportInventoryStocksArrangedByAccounts | INVENTORY_API.DOWNLOAD_INVENTORY_STOCKS_ARRANGED_BY_ACCOUNT_REPORT | API : {@link ApiConstants.StockInventory#STOCK_INVENTORY_EXPORT_ARRANGEDBY_ACCOUNTS} |
| DELETE | `/v2/company/{companyUniqueName}/manufacture/{manufactureUniqueName}` | ManufacturingV2Controller#deleteManufacturingDetails | MANUFACTURING_API.GET_MANUFACTURING | Delete Manufacturing Details |
| GET | `/v2/company/{companyUniqueName}/manufacture/{manufactureUniqueName}` | ManufacturingV2Controller#getManufacturingDetails | MANUFACTURING_API.GET_MANUFACTURING | Get Manufacturing Details |
| PUT | `/v2/company/{companyUniqueName}/manufacture/{manufactureUniqueName}` | ManufacturingV2Controller#updateManufactureStock | MANUFACTURING_API.GET_MANUFACTURING | Update Manufacture Stock |
| POST | `/v2/company/{companyUniqueName}/stock-aging-report/{stockUniqueName}/details` | StockAgingReportController#getStockAgingDrilldown | INVENTORY_API.STOCK_AGING_REPORT_DETAILS | Get Stock Aging Drilldown |
| POST | `/v2/company/{companyUniqueName}/stock-aging-report/{stockUniqueName}/variants` | StockAgingReportController#getStockAgingVariants | INVENTORY_API.STOCK_AGING_REPORT_VARIANTS | Get Stock Aging Variants |
| POST | `/v2/company/{companyUniqueName}/stock-aging-report/totals` | StockAgingReportController#getStockAgingTotals | INVENTORY_API.STOCK_AGING_REPORT_TOTALS | Get Stock Aging Totals |
| POST | `/v2/company/{companyUniqueName}/stock-group/{stockGroupUniqueName}/stock` | StockWithGroupV2Controller#create | INVENTORY_API.CREATE_STOCK_V2 | Create |
| POST | `/v2/company/{companyUniqueName}/stock-history` | StockHistoryController#getStockHistory | RECEIPT_API.STOCK_HISTORY | Get Stock History |
| GET | `/v2/company/{companyUniqueName}/stock/{stockUniqueName:.+}` | StockV2Controller#getV2 | INVENTORY_API.GET_STOCK_V2 | Get V2 |
| GET | `/v2/company/{companyUniqueName}/stock/{stockUniqueName}/details` | StockV2Controller#getStockVariantsWithVariantUnitBasedOnUserType | INVENTORY_API.GET_STOCK_DETAILS | Get Stock Variants With Variant Unit Based On User Type |
| POST | `/v2/company/{companyUniqueName}/stock/{stockUniqueName}/manufacture` | ManufacturingV2Controller#manufactureStock | MANUFACTURING_API.CREATE_V2 | Manufacture Stock |
| PATCH | `/v2/company/{companyUniqueName}/stock/{stockUniqueName}/variant/{variantUniqueName}` | StockV2Controller#updatePatch | INVENTORY_API.INVENTORY_VARIANT_UPDATE | Update Patch |
| GET | `/v2/company/{companyUniqueName}/stock` | StockV2Controller#getStocks | INVENTORY_API.GET_ALL_STOCKS | Get Stocks |
| GET | `/v5/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}` | StockGroupV5Controller#get | INVENTORY_API.V5.GET_STOCK_GROUP | Get |
| PUT | `/v5/company/{companyUniqueName}/stock-group/{stockGroupUniqueName:.+}` | StockGroupV5Controller#update | INVENTORY_API.V5.UPDATE_STOCK_GROUP | Update |
| POST | `/v5/company/{companyUniqueName}/stock-group` | StockGroupV5Controller#create | INVENTORY_API.V5.CREATE_STOCK_GROUP | Create |

### 08-gst-vat (29)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| GET | `/company/{companyUniqueName}/ewb/{ewbno}/download-detailed-v2` | EWayBillController#downloadEWBDetailedWithExportSettings | EWAYBILL_API.DOWNLOAD_DETAILED_EWAY | Download EWBDetailed With Export Settings |
| GET | `/company/{companyUniqueName}/ewb/{ewbno}/download-v2` | EWayBillController#downloadEWBWithExportSettings | EWAYBILL_API.DOWNLOAD_EWAY | Download EWBWith Export Settings |
| PUT | `/company/{companyUniqueName}/ewb/cancel` | EWayBillController#cancelEwayBill | EWAYBILL_API.CANCEL_EWAY_BILL | Cancel Eway Bill |
| GET | `/company/{companyUniqueName}/ewb/user` | EWayBillController#getUser | EWAYBILL_API.LOGIN_EWAYBILL_USER | Returns true/false if E-way bill credentials are saved (no credential details exposed). |
| PUT | `/company/{companyUniqueName}/ewb/vehicle` | EWayBillController#updateVehicleNumber | EWAYBILL_API.UPDATE_EWAY_VEHICLE | Update Vehicle Number |
| GET | `/company/{companyUniqueName}/ewb` | EWayBillController#getAll | EWAYBILL_API.GENERATE_EWAYBILL | Get All |
| POST | `/company/{companyUniqueName}/ewb` | EWayBillController#generateEWayBill | EWAYBILL_API.GENERATE_EWAYBILL | Generate EWay Bill |
| DELETE | `/company/{companyUniqueName}/gst-setting/{uniqueName}` | CompanyGstSettingController#deleteGSTSetting | GSTR_API.DELETE_LUT_NUMBER | Delete GSTSetting |
| PUT | `/company/{companyUniqueName}/gst-setting/{uniqueName}` | CompanyGstSettingController#updateGSTSetting | GSTR_API.UPDATE_LUT_NUMBER | Update GSTSetting |
| GET | `/company/{companyUniqueName}/gst-setting/list` | CompanyGstSettingController#getAllGSTSetting | GSTR_API.GET_LUT_NUMBER_LIST | Get All GSTSetting |
| POST | `/company/{companyUniqueName}/gst-setting` | CompanyGstSettingController#createGSTSetting | GSTR_API.CREATE_LUT_NUMBER | Create GSTSetting |
| GET | `/company/{companyUniqueName}/kenya/v2/vat-report-download` | KenyaVatReturnController#downloadKenyaVatReportV2 | VAT_API.DOWNLOAD_KENYA_REPORT | Download Kenya Vat Report V2 |
| GET | `/company/{companyUniqueName}/kenya/vat-report` | KenyaVatReturnController#getKenyaVatReport | VAT_API.VIEW_KENYA_REPORT | Get Kenya Vat Report |
| GET | `/company/{companyUniqueName}/tax` | TaxController#get | COMPANY_API.TAX | Get |
| POST | `/company/{companyUniqueName}/uk/retrieve-vat-liabilities` | UKVatReturnController#retrieveVatLiabilities | VAT_API.LIABILITIES | Retrieve Vat Liabilities |
| POST | `/company/{companyUniqueName}/uk/submit-vat-return` | UKVatReturnController#submitVatReturn | VAT_API.SUBMIT_VAT_RETURN | Submit Vat Return |
| POST | `/company/{companyUniqueName}/uk/vat-obligations` | UKVatReturnController#getVatObligations | VAT_API.VAT_OBLIGATIONS | Get Vat Obligations |
| GET | `/company/{companyUniqueName}/uk/vat-report-detailed` | UKVatReturnController#getDetailedUKVatReport | VAT_API.VIEW_UK_TRANSACTIONS_REPORT | Get Detailed UKVat Report |
| GET | `/company/{companyUniqueName}/uk/vat-report` | UKVatReturnController#getUKVatReport | VAT_API.VIEW_REPORT | Get UKVat Report |
| POST | `/company/{companyUniqueName}/uk/view-vat-return` | UKVatReturnController#viewVatReturn | VAT_API.VIEW_VAT_RETURN | View Vat Return |
| GET | `/company/{companyUniqueName}/zw/vat-report-detailed-download-v2` | ZWVatReturnController#downloadVatReportCurrencyWiseWithExportSettings | VAT_API.DOWNLOAD_ZW_TRANSACTIONS_REPORT | Download Vat Report Currency Wise With Export Settings |
| GET | `/company/{companyUniqueName}/zw/vat-report-detailed` | ZWVatReturnController#getDetailedZWVatReport | VAT_API.VIEW_ZW_TRANSACTIONS_REPORT | Get Detailed ZWVat Report |
| GET | `/company/{companyUniqueName}/zw/vat-report-download-v2` | ZWVatReturnController#downloadVatReportWithExportSettings | VAT_API.DOWNLOAD_ZW_REPORT | Download Vat Report With Export Settings |
| GET | `/company/{companyUniqueName}/zw/vat-report` | ZWVatReturnController#getZWVatReport | VAT_API.VIEW_ZW_REPORT | Get ZWVat Report |
| GET | `/gst-info` | MainController#getGstInfo | COMMON_API.GST_INFORMATION | Get Gst Info |
| GET | `/v2/company/{companyUniqueName}/gst/unit-mapping` | GstReturnV2Controller#getGstUnitMapping | COMMON_API.GST_STOCK_UNITS | Get Gst Unit Mapping |
| PATCH | `/v2/company/{companyUniqueName}/gst/unit-mapping` | GstReturnV2Controller#mapGstUnits | COMMON_API.GST_STOCK_UNITS | Map Gst Units |
| GET | `/v2/company/{companyUniqueName}/vat-report-detailed` | VatReturnController#getVatReportDetailed | VAT_API.VIEW_TRANSACTIONS_REPORT | Get Vat Report Detailed |
| GET | `/v2/company/{companyUniqueName}/vat-report` | VatReturnController#getVatReport | VAT_API.VIEW_REPORT_V2 | Get Vat Report |

### 09-reports-dashboard (20)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| POST | `/company/{companyUniqueName}/business-documents/pending-report` | BusinessDocumentController#pendingReport | INVENTORY_VOUCHER_API.PENDING_REPORT | Pending Report |
| GET | `/company/{companyUniqueName}/calculateRatios` | ReportController#calculateRatios | DASHBOARD_API.RATIO_ANALYSIS | Calculate Ratios |
| GET | `/company/{companyUniqueName}/dashboard/graph` | DashboardController#createGraphBasedOnType | DASHBOARD_API.REVENUE_GRAPH_DATA | Create Graph Based On Type |
| GET | `/company/{companyUniqueName}/project/{projectUniqueName}/net-profit` | ProjectReportController#profitLossForMultiBranch | ACCOUNTING_API.GET_NET_PROFIT | Profit Loss For Multi Branch |
| GET | `/company/{companyUniqueName}/project/{projectUniqueName}/profit-loss` | ProjectReportController#profitLossForMultiBranch | ACCOUNTING_API.GET_PROJECT_PROFIT_LOSS | Profit Loss For Multi Branch |
| GET | `/company/{companyUniqueName}/v2/balance-sheet-collapsed-download-v2` | ReportController#balanceSheetCollapsedV2WithExportSetting | TB_PL_BS_API.DOWNLOAD_BALANCE_SHEET_EXCEL | Balance Sheet Collapsed V2With Export Setting |
| GET | `/company/{companyUniqueName}/v2/profit-loss-collapsed-download-v2` | ReportController#profitAndLossCollapsedV2WithExportSetting | TB_PL_BS_API.DOWNLOAD_PROFIT_LOSS_EXCEL | Profit And Loss Collapsed V2With Export Setting |
| GET | `/report-filters` | ReportFilterController#getReportFilterColumns | COMMON_API.MODULE_WISE_COLUMNS | Get Report Filter Columns |
| POST | `/report-filters` | ReportFilterController#saveReportFilterColumns | COMMON_API.SAVE_MODULE_WISE_COLUMNS | Save Report Filter Columns |
| GET | `/v2/company/{companyUniqueName}/cash-flow-download-v2` | ReportV2Controller#downloadCashFlowStatementV2 | Report | Download Cash Flow Statement V2 |
| GET | `/v2/company/{companyUniqueName}/cogs` | ReportV2Controller#calculateCogs | TB_PL_BS_API.GET_COGS | Calculate Cogs |
| GET | `/v2/company/{companyUniqueName}/multibranch/compared-profit-loss` | ReportV2Controller#comparedProfitLossForMultiBranch | TB_PL_BS_API.GET_COMPARED_PROFIT_LOSS | Compared Profit Loss For Multi Branch |
| GET | `/v2/company/{companyUniqueName}/multibranch/trial-balance` | ReportV2Controller#createTrialBalanceForMultipleBranch | TB_PL_BS_API.GET_TRIAL_BALANCE | Create Trial Balance For Multiple Branch |
| GET | `/v2/company/{companyUniqueName}/multicompany/{reportType}` | ReportV2Controller#getReportForMultipleCompanies | TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT | The purpose of this API is to fetch the Reports from mongo |
| POST | `/v2/company/{companyUniqueName}/multicompany/{reportType}` | ReportV2Controller#createMultiCurrencyReportForMultipleCompanies | TB_PL_BS_API.GET_MULTI_CURRENCY_REPORT | Create Multi Currency Report For Multiple Companies |
| GET | `/v2/company/{companyUniqueName}/reports/all-reports` | ReportV2Controller#getFavoriteReport | ALL_REPORTS_API.GET_ALL | Get Favorite Report |
| POST | `/v2/company/{companyUniqueName}/reports/entity-selection` | ReportV2Controller#getReportModeStatus | TB_PL_BS_API.TAILED_REPORT_DATE_RANGE | Get Report Mode Status |
| POST | `/v2/company/{companyUniqueName}/reports/entity-status` | ReportV2Controller#updateReportsEntityStatus | TB_PL_BS_API.TAILED_REPORT_ACCOUNT_GROUP | Update Reports Entity Status |
| POST | `/v2/company/{companyUniqueName}/reports/save-report-data` | ReportV2Controller#saveFavoriteReportModule | ALL_REPORTS_API.SAVE_FAVORITES | Save Favorite Report Module |
| POST | `/v2/company/{companyUniqueName}/reverse-charge-report` | ReportV2Controller#getReverseChargeReport | REVERSECHARGE_API.VIEW_REPORT | Get Reverse Charge Report |

### 10-settings (36)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| GET | `/company/{companyUniqueName}/entry-settings` | CompanySettingsController#getUserCompanyEntrySettings | COMPANY_API.UNIVERSAL_DATE | Get User Company Entry Settings |
| PUT | `/company/{companyUniqueName}/entry-settings` | CompanySettingsController#updateUserCompanyEntrySettings | COMPANY_API.UNIVERSAL_DATE | Update User Company Entry Settings |
| PATCH | `/company/{companyUniqueName}/export-settings` | CompanySettingsController#updateExportSettings | SETTINGS_PROFILE_API.GET_UPDATE_MODULE_EXPORT_SETTING | Update Export Settings |
| POST | `/company/{companyUniqueName}/gocardless/agreement-requisitions` | GoCardlessBankIntegrationController#createEndUserAgreementAndRequisitions | SETTINGS_INTEGRATION_API.GOCARDLESS.CREATE_END_USER_AGREEMENT | Create End User Agreement And Requisitions |
| POST | `/company/{companyUniqueName}/imports/reconciliation/process` | ReconciliationController#process | BANK_RECONCILIATION_API.PROCESS | Process a previously uploaded Excel/CSV reconciliation file with user-provided column mappings. |
| GET | `/company/{companyUniqueName}/imports/reconciliation` | ReconciliationController#list | BANK_RECONCILIATION_API.GET_ALL | Process a previously uploaded Excel/CSV reconciliation file with user-provided column mappings. |
| DELETE | `/company/{companyUniqueName}/payu` | PayuController#deletePayuUser | SETTINGS_INTEGRATION_API.PAYU_CRUD | Delete Payu User |
| GET | `/company/{companyUniqueName}/payu` | PayuController#getPayuUser | SETTINGS_INTEGRATION_API.PAYU_CRUD | Get Payu User |
| POST | `/company/{companyUniqueName}/payu` | PayuController#addPayuUser | SETTINGS_INTEGRATION_API.PAYU_CRUD | Add Payu User |
| POST | `/company/{companyUniqueName}/role/{roleUniqueName}/assign` | RoleV2Controller#assignRole | ACCOUNTS_API.SHARE | Assign Role |
| DELETE | `/company/{companyUniqueName}/role/{roleUniqueName}` | RoleV2Controller#deleteRole | PERMISSION_API.DELETE_ROLE | Delete Role |
| PUT | `/company/{companyUniqueName}/role/{roleUniqueName}` | RoleV2Controller#updateRole | PERMISSION_API.UPDATE_ROLE | Update Role |
| GET | `/company/{companyUniqueName}/role` | RoleV2Controller#getAllRoles | PERMISSION_API.GET_ROLE | Get All Roles |
| GET | `/company/{companyUniqueName}/settings` | CompanySettingsController#getCompanySettings | INVOICE_API.SETTING_INVOICE | Get Company Settings |
| PUT | `/company/{companyUniqueName}/settings` | CompanySettingsController#updateCompanySettings | INVOICE_API.SETTING_INVOICE | Update Company Settings |
| DELETE | `/company/{companyUniqueName}/tags/{tagUniqueName}` | TagController#deleteTag | SETTINGS_TAG_API.DELETE_TAG | Delete Tag |
| PUT | `/company/{companyUniqueName}/tags/{tagUniqueName}` | TagController#updateTag | SETTINGS_TAG_API.UPDATE_TAG | Update Tag |
| POST | `/company/{companyUniqueName}/tags` | TagController#createTag | SETTINGS_TAG_API.CREATE_TAG | Create Tag |
| DELETE | `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` | UserEntityRoleV2Controller#deleteUserEntityRole | ACCOUNTS_API.CHANGE_PERMISSION | Delete User Entity Role |
| PUT | `/company/{companyUniqueName}/uer/{entityRoleUniqueName}` | UserEntityRoleV2Controller#updateUserEntityRole | SETTINGS_PERMISSION_API.UPDATE_PERMISSION<br>ACCOUNTS_API.CHANGE_PERMISSION | Update User Entity Role |
| GET | `/users/{userUniqueName:.+}` | UserController#getUser | LOGIN_API.FETCH_DETAILS | Get User |
| GET | `/users/{userUniqueName}/company-uer` | UserController#getCompanyUserEntityRoles | COMPANY_API.GET_COMPANY_USER | API for getting user entity roles for given companyUniqueName and user. |
| PUT | `/users/{userUniqueName}/settings` | UserController#updateUserSettings | LOGIN_API.SET_SETTINGS | Update User Settings |
| GET | `/users/{userUniqueName}/v2/companies` | UserController#getAllCompaniesV3 | COMPANY_API.COMPANY_LIST | Get All Companies V3 |
| POST | `/users/send-new-user-info` | UserController#sendNewUserInfo | COMPANY_API.SEND_NEW_USER_INFO | Send New User Info |
| GET | `/users/subscriptions` | UserController#getAllUserSubscriptions | SUBSCRIPTIONS_API.SUBSCRIBED_COMPANIES | Get All User Subscriptions |
| GET | `/v2/company/{companyUniqueName}/communication/email-template/{templateOf}` | CommunicationControllerV2#getEmailTemplate | CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_TEMPLATE | Get Email Template |
| PUT | `/v2/company/{companyUniqueName}/communication/email-template/{templateOf}` | CommunicationControllerV2#updateEmailTemplate | CUSTOM_EMAIL_TEMPLATE.UPDATE_EMAIL_TEMPLATE | Update Email Template |
| GET | `/v2/company/{companyUniqueName}/gstr1/download-v2` | GstReturnV2Controller#downloadGstr1DataWithExportSettings | GSTR_API.DOWNLOAD_JSON | Download Gstr1Data With Export Settings |
| GET | `/v2/company/{companyUniqueName}/sample-templates` | TemplateV2Controller#getSampleTemplates | INVOICE_API.GET_USER_TEMPLATES | Get Sample Templates |
| PATCH | `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}/default` | TemplateV2Controller#setDefaultTemplate | INVOICE_API.SET_AS_DEFAULT | Set Default Template |
| DELETE | `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` | TemplateV2Controller#deleteTemplate | INVOICE_API.DELETE_TEMPLATE | Delete Template |
| GET | `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` | TemplateV2Controller#getTemplate | INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS<br>INVOICE_API.GET_TEMPLATE_PREVIEW | Get Template |
| PUT | `/v2/company/{companyUniqueName}/templates/{templateUniqueName:.+}` | TemplateV2Controller#updateTemplate | INVOICE_API.UPDATE_TEMPLATE | Update Template |
| GET | `/v2/company/{companyUniqueName}/templates` | TemplateV2Controller#getAllTemplatesV2 | INVOICE_API.GET_CREATED_TEMPLATES | Get All Templates V2 |
| POST | `/v2/company/{companyUniqueName}/templates` | TemplateV2Controller#createTemplate | INVOICE_API.CREATE_NEW_TEMPLATE | Create Template |

### 11-subscriptions (20)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| POST | `/subscription/paypal/order/{orderId}/capture` | PaypalSubscriptionController#captureOrder | SUBSCRIPTION_V2_API.PAYPAL_CAPTURE_PLAN | Capture Order |
| POST | `/v2/subscription/{subscriptionId}/activate-prepaid` | SubscriptionControllerV2#activatePrepaidSubscription | SUBSCRIPTION_V2_API.ACTIVATE_PRE_PAID | Activate Prepaid Subscription |
| GET | `/v2/subscription/{subscriptionId}/cancel` | SubscriptionControllerV2#cancelSubscription | SUBSCRIPTION_V2_API.CANCEL_SUBSCRIPTION_BY_ID | Cancel Subscription |
| GET | `/v2/subscription/{subscriptionId}/company-list` | SubscriptionControllerV2#getCompanyListBySubscriptionRegion | SUBSCRIPTION_V2_API.GET_COMPANIES_BY_SUBSCRIPTION_ID | Get Company List By Subscription Region |
| GET | `/v2/subscription/{subscriptionId}/country-list` | SubscriptionControllerV2#getCountryListBySubscriptionId | COMPANY_API.GET_COUNTRY_LIST_BY_SUBSCRIPTION_ID | Get Country List By Subscription Id |
| POST | `/v2/subscription/{subscriptionId}/create-pre-paid` | SubscriptionControllerV2#createPrePaidOfSubscription | SUBSCRIPTION_V2_API.CREATE_PRE_PAID | Create Pre Paid Of Subscription |
| GET | `/v2/subscription/{subscriptionId}/generate-order` | SubscriptionControllerV2#generateRazorpayOrder | SUBSCRIPTION_V2_API.GENERATE_ORDER_BY_SUBSCRIPTION_ID | Generate Razorpay Order |
| GET | `/v2/subscription/{subscriptionId}/wallet-logs` | SubscriptionControllerV2#getSubscriptionWalletLogs | WALLET_API.GET_WALLET_LOGS | Get Subscription Wallet Logs |
| GET | `/v2/subscription/{subscriptionId}/wallet` | SubscriptionControllerV2#getWalletDetails | WALLET_API.GET_WALLET_DETAILS | Get Wallet Details |
| GET | `/v2/subscription/{subscriptionId}` | SubscriptionControllerV2#getSubscription | SUBSCRIPTION_V2_API.SUBSCRIPTION_BY_ID<br>WALLET_API.GET_SUBSCRIPTION_DATA | Get Subscription |
| POST | `/v2/subscription/add-wallet-amount` | SubscriptionControllerV2#addWalletAmount | WALLET_API.ADD_WALLET_AMOUNT | Add Wallet Amount |
| POST | `/v2/subscription/buy-plan` | SubscriptionControllerV2#buyPlan | SUBSCRIPTION_V2_API.BUY_PLAN | Buy Plan |
| POST | `/v2/subscription/change-plan` | SubscriptionControllerV2#changePlanOfSubscription | SUBSCRIPTION_V2_API.GET_CHANGE_PLAN_DETAILS | Change Plan Of Subscription |
| POST | `/v2/subscription/charge/{subscriptionId}` | SubscriptionControllerV2#chargeSubscription | SETTINGS_PROFILE_API.SUBSCRIPTION_CHARGE | Charge Subscription |
| POST | `/v2/subscription/company-list/{subscriptionId}` | SubscriptionControllerV2#getCompaniesBySubscriptionId | SUBSCRIPTION_V2_API.GET_COMPANIES_LIST_BY_SUBSCRIPTION_ID | Get Companies By Subscription Id |
| POST | `/v2/subscription/get-amount` | SubscriptionControllerV2#getSubscriptionAmount | SUBSCRIPTION_V2_API.CALCULATION_PLAN_AMOUNT | Get Subscription Amount |
| POST | `/v2/subscription/list` | SubscriptionControllerV2#getSubscriptions | SUBSCRIPTION_V2_API.GET_ALL_SUBSCRIPTIONS | Get Subscriptions |
| GET | `/v2/subscription/plans/all` | SubscriptionControllerV2#getAllPlans | SUBSCRIPTION_V2_API.GET_ALL_PLANS | Get All Plans |
| POST | `/v2/subscription/transfer/ownership` | SubscriptionControllerV2#ownerShipTransfer | SUBSCRIPTION_V2_API.TRANSFER | Owner Ship Transfer |
| POST | `/v2/subscription/verify/ownership` | SubscriptionControllerV2#verifyOwnerShip | SUBSCRIPTION_V2_API.VERIFY_OWNERSHIP | Verify Owner Ship |

### 12-imports-sync-ocr (10)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| GET | `/company/{companyUniqueName}/download-import-logs` | ImportLogController#downloadImportLogs | IMPORTS_API.DOWNLOAD_SHEET | Download Import Logs |
| POST | `/company/{companyUniqueName}/imports/document/upload` | ImportController#uploadDocument | AI_OCR_API.IMPORT | Upload Document |
| POST | `/company/{companyUniqueName}/imports/import-pdf/bank-statement` | ImportController#importpdf | LEDGER_API.IMPORT_STATEMENT | Importpdf |
| POST | `/company/{companyUniqueName}/imports/process` | ImportController#processDataV2 | IMPORT_EXCEL_API.PROCESS_IMPORT | Process Data V2 |
| POST | `/company/{companyUniqueName}/imports/reconciliation/upload` | ReconciliationController#upload | BANK_RECONCILIATION_API.UPLOAD | Upload a bank statement file (PDF or Excel/CSV) to initiate reconciliation. |
| GET | `/company/{companyUniqueName}/imports/signed-url` | ImportController#generatePreSignedURL | LEDGER_API.GET_DOWNLOAD_ATTACHMENT | confirmation is received. |
| POST | `/company/{companyUniqueName}/imports/upload` | ImportController#createImportRequest | IMPORT_EXCEL_API.UPLOAD_FILE | Create Import Request |
| POST | `/company/{companyUniqueName}/imports/v2/upload` | ImportController#getConfirmationOnUploadThroughSignedURL | LEDGER_API.IMPORT_VOUCHER | Get Confirmation On Upload Through Signed URL |
| GET | `/company/{companyUniqueName}/imports` | ImportController#viewImportRequests | IMPORTS_API.IMPORTS | View Import Requests |
| GET | `/v2/company/{companyUniqueName}/gstr3b-excel-export/email` | GstReturnV2Controller#emailGstr3ExcelSheet | PURCHASE_INVOICE_API.SEND_GSTR3B_EMAIL | API for send mail of GSTR3B excel file |

### 13-misc (122)

| Method | Real path | Controller | Frontend ids | Title |
| --- | --- | --- | --- | --- |
| GET | `/business-nature` | MainController#getBusinessNature | COMPANY_API.BUSINESS_NATURE_LIST | API to get all Business Nature |
| POST | `/company/{companyUniqueName}/add-domain` | PortalWhiteLabelController#addDomain | SETTINGS_PROFILE_API.ADD_PORTAL_DOMAIN | Add Domain |
| DELETE | `/company/{companyUniqueName}/address/{addressUniqueName:.+}` | AddressController#delete | SETTINGS_PROFILE_API.DELETE_ADDRESS | Delete |
| PUT | `/company/{companyUniqueName}/address/{addressUniqueName:.+}` | AddressController#update | SETTINGS_PROFILE_API.UPDATE_ADDRESS | Update |
| GET | `/company/{companyUniqueName}/address/all` | AddressController#getAll | SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES | Get All |
| POST | `/company/{companyUniqueName}/address/all` | AddressController#getAll | SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES | Get All |
| POST | `/company/{companyUniqueName}/address` | AddressController#create | SETTINGS_PROFILE_API.CREATE_NEW_ADDRESS | Create |
| DELETE | `/company/{companyUniqueName}/bank/deregistration` | ICICIBankController#bankDeRegistration | SETTINGS_INTEGRATION_API.REMOVE_ICICI_REQUEST | Bank De Registration |
| POST | `/company/{companyUniqueName}/bank/registration` | ICICIBankController#bankRegistration | SETTINGS_INTEGRATION_API.PAYMENT | Bank Registration |
| PUT | `/company/{companyUniqueName}/bank/updateDetails` | ICICIBankController#updateDetails | SETTINGS_INTEGRATION_API.UPDATE_PAYMENT | Update Details |
| GET | `/company/{companyUniqueName}/bank` | ICICIBankController#getAllRegistration | COMPANY_API.REGISTER_ACCOUNT | Get All Registration |
| GET | `/company/{companyUniqueName}/batch/{batchUniqueName}` | BatchController#getBatch | INVENTORY_API.BATCH.GET | Create batch. Mandatory: name (uniqueName generated if omitted). |
| GET | `/company/{companyUniqueName}/batch/availability` | BatchController#getAvailability | INVENTORY_API.BATCH.AVAILABILITY | Unified batch availability for picker / batch-to-batch transfer. |
| POST | `/company/{companyUniqueName}/batch/transfer` | BatchController#transferBatch | INVENTORY_API.BATCH.TRANSFER | Batch transfer. Minimal body: {@code fromBatchUniqueName} + {@code toBatchUniqueName} |
| POST | `/company/{companyUniqueName}/batch` | BatchController#createBatch | INVENTORY_API.BATCH.CREATE | Create batch. Mandatory: name (uniqueName generated if omitted). |
| DELETE | `/company/{companyUniqueName}/branch-transfer/{transferNoteUniqueName}` | BranchTransferController#deleteBranchTransferNote | INVENTORY_API.DELETE_BRANCH_TRANSFER | Delete Branch Transfer Note |
| GET | `/company/{companyUniqueName}/branch-transfer/{transferNoteUniqueName}` | BranchTransferController#getTransferNote | INVENTORY_API.GET_BRANCH_TRANSFER | Get Transfer Note |
| PUT | `/company/{companyUniqueName}/branch-transfer/{transferNoteUniqueName}` | BranchTransferController#updateBranchTransferNote | INVENTORY_API.UPDATE_BRANCH_TRANSFER | Update Branch Transfer Note |
| POST | `/company/{companyUniqueName}/branch-transfer/all` | BranchTransferController#getAllBranchTransfers | INVENTORY_API.GET_BRANCH_TRANSFER_LIST | Get All Branch Transfers |
| POST | `/company/{companyUniqueName}/branch-transfer/download` | BranchTransferController#download | INVENTORY_API.DOWNLOAD_NEW_BRANCH_TRANSFER | Download |
| POST | `/company/{companyUniqueName}/branch-transfer/generate` | BranchTransferController#generateTransferNote | INVENTORY_API.CREATE_NEW_BRANCH_TRANSFER | Generate Transfer Note |
| POST | `/company/{companyUniqueName}/business-documents/{uniqueName}/action` | BusinessDocumentController#applyAction | INVENTORY_VOUCHER_API.CANCEL | Apply Action |
| GET | `/company/{companyUniqueName}/business-documents/{uniqueName}/history` | BusinessDocumentController#getHistory | INVENTORY_VOUCHER_API.LINKED_INVOICE_HISTORY | Get History |
| GET | `/company/{companyUniqueName}/business-documents/{uniqueName}/versions` | BusinessDocumentController#getVersions | INVENTORY_VOUCHER_API.HISTORY | Get Versions |
| DELETE | `/company/{companyUniqueName}/business-documents/{uniqueName}` | BusinessDocumentController#delete | INVENTORY_VOUCHER_API.DELETE | Delete |
| GET | `/company/{companyUniqueName}/business-documents/{uniqueName}` | BusinessDocumentController#getByUniqueName | INVENTORY_VOUCHER_API.GET_SINGLE | Get By Unique Name |
| POST | `/company/{companyUniqueName}/business-documents/convert` | BusinessDocumentController#convert | INVENTORY_VOUCHER_API.CONVERT | Convert |
| GET | `/company/{companyUniqueName}/business-documents/statuses` | BusinessDocumentController#getStatuses | INVENTORY_API.BUSINESS_DOCUMENT_STATUSES | Get Statuses |
| GET | `/company/{companyUniqueName}/communication/campaign/{slug}/fields` | CommunicationController#getCampaignFields | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_FIELDS | Get Campaign Fields |
| GET | `/company/{companyUniqueName}/communication/campaign/list` | CommunicationController#getCampaignList | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_CAMPAIGN_LIST | Get Campaign List |
| GET | `/company/{companyUniqueName}/communication/condition-suggestion` | CommunicationController#getConditionSuggestion | CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONDITIONS | Get Condition Suggestion |
| GET | `/company/{companyUniqueName}/communication/email-content-suggestion` | CommunicationController#getEmailContentSuggestion | CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONTENT | Get Email Content Suggestion |
| GET | `/company/{companyUniqueName}/communication/generate-email` | CommunicationController#generateEmail | EMAIL_FORWARDING_API.GENERATE_EMAIL | This function is used to generate mailId for mail forwarding |
| GET | `/company/{companyUniqueName}/communication/platform/{platformUniqueName}/trigger/form` | CommunicationController#getForm | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGER_FORM | Get Form |
| DELETE | `/company/{companyUniqueName}/communication/platform/{uniqueName}` | CommunicationController#deletePlatform | SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_PLATFORM | Delete Platform |
| GET | `/company/{companyUniqueName}/communication/suggestions/{platformUniqueName}/{entity}` | CommunicationController#getSuggestion | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_FIELD_SUGGESTIONS | Get Suggestion |
| DELETE | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | CommunicationController#deleteTrigger | SETTINGS_INTEGRATION_COMMUNICATION_API.DELETE_TRIGGER | Delete Trigger |
| GET | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | CommunicationController#getTrigger | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS_BY_UNIQUENAME | Get Trigger |
| PATCH | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | CommunicationController#updatePatch | SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGER_STATUS | Update Patch |
| PUT | `/company/{companyUniqueName}/communication/trigger/{triggerUniqueName}` | CommunicationController#update | SETTINGS_INTEGRATION_COMMUNICATION_API.UPDATE_TRIGGERS | Update |
| GET | `/company/{companyUniqueName}/communication/trigger` | CommunicationController#getTriggerList | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_TRIGGERS | Get Trigger List |
| POST | `/company/{companyUniqueName}/communication/trigger` | CommunicationController#create | SETTINGS_INTEGRATION_COMMUNICATION_API.CREATE_TRIGGERS | Create |
| GET | `/company/{companyUniqueName}/communication` | CommunicationController#getPlatform | SETTINGS_INTEGRATION_COMMUNICATION_API.GET_PLATFORMS | Get Platform |
| GET | `/company/{companyUniqueName}/currency-converter/{baseCurrency}/{toCurrency}` | CurrencyConverterController#getCurrencyRates | LEDGER_API.CURRENCY_CONVERTER | Get Currency Rates |
| DELETE | `/company/{companyUniqueName}/customfield/{customFieldUniqueName:.+}` | CustomFieldController#delete | CUSTOM_FIELDS.DELETE | Delete |
| GET | `/company/{companyUniqueName}/customfield/{customFieldUniqueName:.+}` | CustomFieldController#get | CUSTOM_FIELDS.GET | Get |
| PATCH | `/company/{companyUniqueName}/customfield/{customFieldUniqueName:.+}` | CustomFieldController#update | CUSTOM_FIELDS.UPDATE | Update |
| GET | `/company/{companyUniqueName}/customfield/module/{moduleUniqueName:.+}` | CustomFieldController#getAllByModule | CUSTOM_FIELDS.GET_ALL | Get All By Module |
| POST | `/company/{companyUniqueName}/customfield` | CustomFieldController#create | CUSTOM_FIELDS.CREATE | Create |
| DELETE | `/company/{companyUniqueName}/delete-image` | ImageController#deleteImageByUniueName | INVOICE_API.REMOVE_IMAGE_SIGNATURE | API - Deleting image by image unique name |
| PUT | `/company/{companyUniqueName}/discount/{discountUniqueName:.+}` | DiscountController#updateDiscount | SETTINGS_DISCOUNT_API.PUT | Update Discount |
| GET | `/company/{companyUniqueName}/discount/assign/list` | DiscountController#getAllAssignedDiscountList | APPLY_DISCOUNT_API.GET_APPLY_DISCOUNT_API | Get All Assigned Discount List |
| POST | `/company/{companyUniqueName}/discount/assign` | DiscountController#assignedDiscounts | APPLY_DISCOUNT_API.APPLY_DISCOUNT | Assigned Discounts |
| GET | `/company/{companyUniqueName}/discount` | DiscountController#getAll | SETTINGS_DISCOUNT_API.COMMON | Get All |
| POST | `/company/{companyUniqueName}/domain/{domainUniqueName}/share` | PortalWhiteLabelController#shareDomain | SETTINGS_PROFILE_API.SHARE_PORTAL_DOMAIN | Share Domain |
| PATCH | `/company/{companyUniqueName}/domain/{domainUniqueName}` | PortalWhiteLabelController#updateDomain | SETTINGS_PROFILE_API.PRIMARY_DELETE_DOMAIN_SET | / |
| POST | `/company/{companyUniqueName}/dsc/finish` | DscController#finish | DSC_API.FINISH | Finish |
| POST | `/company/{companyUniqueName}/dsc/prepare` | DscController#prepare | DSC_API.PREPARE | Prepare |
| POST | `/company/{companyUniqueName}/ecommerce/email` | EcommerceController#sendEmail | ECOMMERCE_API.SEND_EMAIL | * |
| POST | `/company/{companyUniqueName}/generate-mail-token` | GoogleMailController#generateMailToken | GMAIL_API.GENERATE_GMAIL_TOKEN | Generate Mail Token |
| GET | `/company/{companyUniqueName}/get-domain-list` | PortalWhiteLabelController#getDomains | SETTINGS_PROFILE_API.GET_DOMAIN_LIST<br>SETTINGS_PROFILE_API.GET_DOMAIN_LIST_DATA | / |
| DELETE | `/company/{companyUniqueName}/gmail-token` | GoogleMailController#deleteToken | SETTINGS_INTEGRATION_API.REMOVE_GMAIL_INTEGRATION | Delete Token |
| GET | `/company/{companyUniqueName}/gmail-token` | GoogleMailController#getToken | SETTINGS_INTEGRATION_API.GET_GMAIL_INTEGRATION_STATUS | Get Token |
| DELETE | `/company/{companyUniqueName}/gocardless/{bankDetailsUniqueName}` | GoCardlessBankIntegrationController#deleteBankIntegrationDetails | SETTINGS_INTEGRATION_API.GOCARDLESS.DELETE_END_USER_AGREEMENT | Delete Bank Integration Details |
| GET | `/company/{companyUniqueName}/gocardless/institutions` | GoCardlessBankIntegrationController#getAllInstitution | SETTINGS_INTEGRATION_API.GOCARDLESS.GET_ALL_INSTITUTIONS | Get All Institution |
| POST | `/company/{companyUniqueName}/images` | ImageController#setCompanyImage | INVOICE_API.UPLOAD_LOGO<br>COMMON_API.UPLOAD_IMAGE | Set Company Image |
| POST | `/company/{companyUniqueName}/pettycash-manager/{entryUniqueName}` | PettyCashManagerController#action | EXPENSE_API.ACTION | Action |
| POST | `/company/{companyUniqueName}/pettycash-manager/{entryUniqueName}` | PettyCashManagerController#action | EXPENSE_API.ACTION | Action |
| POST | `/company/{companyUniqueName}/plaid/create/access-token` | PlaidController#setAccessToken | SETTINGS_INTEGRATION_API.SAVE_PLAID_ACCESS_TOKEN | Set Access Token |
| GET | `/company/{companyUniqueName}/plaid/create/link-token` | PlaidController#createLinkToken | SETTINGS_INTEGRATION_API.GET_PLAID_LINK_TOKEN | Create Link Token |
| GET | `/company/{companyUniqueName}/project/{projectUniqueName}/category-total` | ProjectController#getRevenueOrExpenseTotalOfProject | ACCOUNTING_API.GET_TOTAL_REVENUE_EXPENSES | Get Revenue Or Expense Total Of Project |
| GET | `/company/{companyUniqueName}/project/{projectUniqueName}/entries` | ProjectController#getProjectEntries | ACCOUNTING_API.GET_ALL_ENTRY | Get Project Entries |
| PUT | `/company/{companyUniqueName}/project/{projectUniqueName}/entry/{entryUniqueName}` | ProjectEntryController#updateProjectEntry | ACCOUNTING_API.UPDATE_ENTRY | Update Project Entry |
| POST | `/company/{companyUniqueName}/project/{projectUniqueName}/entry` | ProjectEntryController#createProjectEntry | ACCOUNTING_API.CREATE_AND_DELETE_ENTRY | Create Project Entry |
| DELETE | `/company/{companyUniqueName}/project/{projectUniqueName}` | ProjectController#deleteProject | ACCOUNTING_API.DELETE_PROJECT | Delete Project |
| GET | `/company/{companyUniqueName}/project/{projectUniqueName}` | ProjectController#getProject | ACCOUNTING_API.GET_PROJECT | Get Project |
| PATCH | `/company/{companyUniqueName}/project/{projectUniqueName}` | ProjectController#updateProject | ACCOUNTING_API.UPDATE_PROJECT | Update Project |
| GET | `/company/{companyUniqueName}/project/all` | ProjectController#getAllProject | ACCOUNTING_API.GET_ALL_PROJECTS | Get All Project |
| POST | `/company/{companyUniqueName}/project` | ProjectController#createProject | ACCOUNTING_API.CREATE_PROJECT | Create Project |
| POST | `/company/{companyUniqueName}/save-mail-token` | GoogleMailController#saveMailToken | GMAIL_API.SAVE_GMAIL_TOKEN | Save Mail Token |
| GET | `/company/{companyUniqueName}/tags` | TagController#getAllTags | SETTINGS_TAG_API.GET_ALL_TAGS | Get All Tags |
| DELETE | `/company/{companyUniqueName}/transporters` | TransporterController#deleteTransporter | EWAYBILL_API.DELETE_TRANSPORTER<br>EWAYBILL_API.UPDATE_TRANSPORTER | Delete Transporter |
| GET | `/company/{companyUniqueName}/transporters` | TransporterController#getAllTransporter | EWAYBILL_API.ADD_TRANSPORTER<br>EWAYBILL_API.GET_ALL_TRANSPORTER | Get All Transporter |
| POST | `/company/{companyUniqueName}/transporters` | TransporterController#addTransporter | EWAYBILL_API.ADD_TRANSPORTER | Add Transporter |
| PUT | `/company/{companyUniqueName}/transporters` | TransporterController#updateTransporter | EWAYBILL_API.UPDATE_TRANSPORTER | Update Transporter |
| DELETE | `/company/{companyUniqueName}/triggers/{triggerUniqueName:.+}` | TriggerController#deleteTrigger | TRIGGER_API.DELETE | Delete Trigger |
| PUT | `/company/{companyUniqueName}/triggers/{triggerUniqueName:.+}` | TriggerController#updateTrigger | TRIGGER_API.PUT | Update Trigger |
| GET | `/company/{companyUniqueName}/triggers` | TriggerController#getAllTrigger | TRIGGER_API.GET | Get All Trigger |
| POST | `/company/{companyUniqueName}/triggers` | TriggerController#createTrigger | TRIGGER_API.POST | Create Trigger |
| GET | `/company/{companyUniqueName}/verify-domain` | PortalWhiteLabelController#verifyDomain | SETTINGS_PROFILE_API.VERIFY_PORTAL_WHITE_LABEL | Verify Domain |
| GET | `/country/{countryCode}` | CountryAndStateController#getCountryAndStateData | COMPANY_API.GET_ALL_STATES | This function is used to get country list. |
| GET | `/country/cities` | CountryAndStateController#getCityByPinCode | EWAYBILL_API.EWAYBILL_FROM_PLACE | Get City By Pin Code |
| GET | `/country/country-list` | CountryAndStateController#getCountryList | SUBSCRIPTION_V2_API.GET_COUNTRY_LIST | Get Country List |
| GET | `/country` | CountryAndStateController#getCountryList | COMMON_API.COUNTRY | / |
| GET | `/currency/rate` | MainController#getCurrencyRates | LEDGER_API.GET_CURRENCY_RATE | API : This API will give conversion rate of a currency to other |
| GET | `/currency` | CurrencyController#getCurrencyList | COMMON_API.CURRENCY | Get Currency List |
| GET | `/scope-v2` | MainController#getScopes | PERMISSION_API.GET_ALL_PAGE_NAMES | Get Scopes |
| POST | `/send-data` | MainController#sendLeadDataToSlack | COMPANY_API.SEND_DATA | Send Lead Data To Slack |
| GET | `/state-details` | LastStateDetailsController#getLastState | COMPANY_API.GET_STATE_DETAILS | Get Last State |
| POST | `/state-details` | LastStateDetailsController#updateLastState | COMPANY_API.SET_STATE_DETAILS | Update Last State |
| GET | `/time` | MainController#getServerTime | CURRENT_DATE_API | Get Server Time |
| GET | `/ui/auditlogs-form` | UIController#getAuditLogOperationFilterForm | LOGS_API.GET_AUDIT_LOG_FORM_FILTERS | / |
| GET | `/ui/bank/integration/form` | UIController#getBankIntegrationForm | SETTINGS_INTEGRATION_API.BANK_INTERATION_VALIDATION_FORM | / |
| GET | `/ui/calling-code` | UIController#formDataForCallingCodes | COMMON_API.CALLING_CODES | / |
| GET | `/ui/forms` | UIController#formData | INVENTORY_API.GET_UNIT_CODE_REGEX<br>COMMON_API.FORM | / |
| GET | `/ui/graph-types` | UIController#graphTypes | DASHBOARD_API.REVENUE_GRAPH_TYPES | Graph Types |
| PUT | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}/payor/{urn:.+}` | ICICIBankControllerV2#updatePayorDetails | SETTINGS_INTEGRATION_API.UPDATE_PAYOR_ACCOUNT | Update Payor Details |
| PUT | `/v2/company/{companyUniqueName}/bank/{bankDetailsUniqueName:.+}` | ICICIBankControllerV2#updateBankDetails | SETTINGS_INTEGRATION_API.UPDATE_ACCOUNT | Update Bank Details |
| GET | `/v2/company/{companyUniqueName}/bank` | ICICIBankControllerV2#getAllRegistration | SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION | Only super Admin can perform the operation on this . |
| POST | `/v2/company/{companyUniqueName}/bank` | ICICIBankControllerV2#bankRegistrationForICICI | SETTINGS_INTEGRATION_API.BANK_ACCOUNT_REGISTRATION | Bank Registration For ICICI |
| GET | `/v2/company/{companyUniqueName}/gstr1-referenceIds` | GstReturnV2Controller#getGstr1ReferenceIds | GSTR_API.GET_FILING_STATUS_REFERENCE_ID | Get Gstr1Reference Ids |
| GET | `/v2/company/{companyUniqueName}/gstr1` | GstReturnV2Controller#getGstr1Data | GSTR_API.GSTR1_SUMMARY_DETAILS | Get Gstr1Data |
| POST | `/v2/company/{companyUniqueName}/logs` | AuditLogControllerV3#getLogs | LOGS_API.GET_AUDIT_LOGS_V2 | API to fetch Audit Logs |
| GET | `/v2/company/{companyUniqueName}/save-gstr1-status` | GstReturnV2Controller#saveGstr1Status | GSTR_API.GET_FILING_STATUS_RESPONSE | Save Gstr1Status |
| POST | `/v2/company/{companyUniqueName}/save-gstr1` | GstReturnV2Controller#saveGstr1Data | GSTR_API.FILE_GSTR1 | Save Gstr1Data |
| POST | `/v2/company/{companyUniqueName}/save-gstr3b` | GstReturnV2Controller#saveGstr3BData | GST_RETURN_API.FILE_GSTR3B | Save Gstr3BData |
| DELETE | `/v2/company/{companyUniqueName}/trigger/{uniqueName}` | TriggerControllerV2#deleteEmailTrigger | CUSTOM_EMAIL_TEMPLATE.DELETE_TRIGGER | Delete Email Trigger |
| GET | `/v2/company/{companyUniqueName}/trigger/{uniqueName}` | TriggerControllerV2#getEmailTrigger | CUSTOM_EMAIL_TEMPLATE.GET_TRIGGER_DETAILS | Get Email Trigger |
| PUT | `/v2/company/{companyUniqueName}/trigger/{uniqueName}` | TriggerControllerV2#updateEmailTrigger | CUSTOM_EMAIL_TEMPLATE.UPDATE_TRIGGERS | Update Email Trigger |
| GET | `/v2/company/{companyUniqueName}/trigger/all` | TriggerControllerV2#getAllEmailTrigger | CUSTOM_EMAIL_TEMPLATE.GET_ALL_TRIGGERS | Get All Email Trigger |
| POST | `/v2/company/{companyUniqueName}/trigger` | TriggerControllerV2#createEmailTrigger | CUSTOM_EMAIL_TEMPLATE.CREATE_TRIGGERS | Create Email Trigger |
| GET | `/white-label` | GiddhWhiteLabelController#getWhiteLabelDetailsByOrigin | INLINE.app.whiteLabel | Get White Label Details By Origin |

## C. New upload template

```md
### {Title}
- Method / URL: {METHOD} https://api.giddh.com{path}
- Headers: Auth-Key
- Path / Query / Body: copy from gap-analysis.json
- Response fields used by UI: from frontend evidence
- Controller: {Controller}#{handler}
```
