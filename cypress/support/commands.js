// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import LoginPage from '../support/pageObjects/LoginPage'
import HeaderPage from "./pageObjects/HeaderPage";
import GlobalSearchPage from "./pageObjects/GlobalSearchPage";
import LedgerPage from "./pageObjects/LedgerPage";
import SignUpPage from "./pageObjects/SignUpPage";
import CreateNewCompanyPage from "./pageObjects/CreateNewCompanyPage";
const loginPage = new LoginPage()
const signUpPage = new SignUpPage();
const headerPage = new HeaderPage()
const ledgerPage = new LedgerPage()
const globalSearchPage = new GlobalSearchPage()
const createNewCompanyPage = new CreateNewCompanyPage();


// Cypress.Commands.add("loginWithGoogle", (email, password) => {
//     cy.visit(Cypress.env('url'))
//     loginPage.getLoginWithGoogle().click()
// })

Cypress.Commands.add("loginWithEmail", (email, password) => {
    const loginPage = new LoginPage()
    cy.visit(Cypress.env('url'))
    loginPage.getLoginWithEmail().click()
    loginPage.enterEmailId().type(email)
    loginPage.enterPassword().type(password)
    loginPage.clickLoginButton().click()
    cy.wait(10000);

    headerPage.clickGiddhLogoIcon().should('have.attr', 'src')
        .should('include', 'assets/images/giddh-white-logo.svg')
})

Cypress.Commands.add("globalSearch", (elementPath, searchValue, expectedText) => {
    cy.get('body').type('{ctrl}g', { force: true })
    if (globalSearchPage.getGlobalSearch(20000).should('be.visible')) {
        headerPage.clickGiddhLogoIcon().then(($ele1) => {
            globalSearchPage.typeGlobalSearch(searchValue)
            globalSearchPage.selectFirstValueAfterSearch().then(($btn) => {
                cy.wait(2000)
                $btn.click();
                cy.wait(5000)
            })
        })
    }
})

Cypress.Commands.add("createLedger", (accountName, accountElementPath, amount) => {
    ledgerPage.clickAccount().click()
    ledgerPage.inputAccount().type(accountName, { delay: 300 })
    cy.wait(2000)
    cy.xpath('//input[@id=\'giddh-datepicker\']').scrollIntoView({ easing: 'linear' }).should('be.visible')
    cy.xpath('//div[@id=\'select-menu-0\']/a/div[1]').scrollIntoView({ offset: { top: 500, left: 0 } })
    cy.get('body').type('{pageup}')
    cy.xpath('//div[@id=\'select-menu-0\']/a/div[1]').scrollIntoView({ easing: 'linear' }).should('be.visible').then(() => {
        cy.wait(1000)
        cy.get(accountElementPath).click({ force: true })
        ledgerPage.enterAmount().clear().type(amount)
        ledgerPage.saveButton().click().then(() => {
            cy.get('div.snack-container', { timeout: 5000 }).should('be.visible')
        })
    })

})

Cypress.Commands.add("createLedgerWithTaxes", (accountName, accountElementPath, amount) => {
    ledgerPage.clickAccount().click()
    ledgerPage.inputAccount().type(accountName, { delay: 300 })
    cy.wait(2000)
    cy.get('body').type('{pageup}')
    cy.scrollTo(10, 10);
    cy.get(accountElementPath).scrollIntoView({ easing: 'linear' }).should('be.visible')
    cy.get(accountElementPath).click({ force: true })
    ledgerPage.selectTax()
    ledgerPage.enterAmount().clear().type(amount)
    ledgerPage.saveButton().click().then(() => {
        cy.get('div.snack-container', { timeout: 5000 }).should('be.visible')
    })
})

Cypress.Commands.add("getAllLedger", (accountUniqueName) => {
    cy.request({
        method: 'GET',
        url: Cypress.env('apiBaseURI') + "/accounts/" + accountUniqueName + "/giddh-ledger",
        'content-type': 'application/json; charset=utf-8',
        headers: {
            'Auth-Key': Cypress.env('authKey')
        }
    }).as('getAllLedgerAPI')
    return cy.get('@getAllLedgerAPI')
})

Cypress.Commands.add("deleteLedger", (accountUniqueName, entryUniqueID) => {
    cy.request({
        method: 'DELETE',
        url: Cypress.env('apiBaseURI') + "/accounts/" + accountUniqueName + "/entries/" + entryUniqueID,
        'content-type': 'application/json; charset=utf-8',
        headers: {
            'Auth-Key': Cypress.env('authKey')
        }
    }).as('deleteLedgerAPI')

    return cy.get('@deleteLedgerAPI')
})

Cypress.Commands.add("getLedger", (accountUniqueName, entryUniqueID) => {
    cy.request({
        method: 'GET',
        url: Cypress.env('apiBaseURI') + "/accounts/" + accountUniqueName + "/ledgers/" + entryUniqueID,
        'content-type': 'application/json; charset=utf-8',
        headers: {
            'Auth-Key': Cypress.env('authKey')
        }
    }).as('getLedgerAPI')

    return cy.get('@getLedgerAPI')
})

Cypress.Commands.add("createLedgerAPI", (accountUniqueName) => {
    cy.request({
        method: 'POST',
        url: Cypress.env('apiBaseURI') + "/accounts/" + accountUniqueName + "/ledgers-v2",
        body: '{"transactions":[{"amount":169.49,"particular":"sales","taxes":["18"],"taxesVm":[{"name":"18","uniqueName":"18","type":"gst","amount":18,"isChecked":true,"isDisabled":false}],"tax":30.51,"convertedTax":30.51,"total":200,"convertedTotal":200,"discount":0,"convertedDiscount":0,"isStock":false,"convertedRate":0,"convertedAmount":169.49,"isChecked":false,"showTaxationDiscountBox":true,"itcAvailable":"","advanceReceiptAmount":0,"type":"DEBIT","discounts":[],"selectedAccount":{"currency":"INR","currencySymbol":"\u20b9","mobileNo":null,"stocks":null,"isFixed":true,"uniqueName":"sales","email":null,"parentGroups":[{"uniqueName":"revenuefromoperations","name":"Revenue From Operations"},{"uniqueName":"sales","name":"Sales"}],"mergedAccounts":"","applicableTaxes":[],"name":"Sales","nameStr":"Revenue From Operations, Sales","uNameStr":"revenuefromoperations, sales"},"isInclusiveTax":false,"shouldShowRcmEntry":false}],"voucherType":null,"entryDate":"19-08-2020","unconfirmedEntry":false,"attachedFile":"","attachedFileName":"","tag":null,"description":"","generateInvoice":false,"chequeNumber":"","chequeClearanceDate":"","invoiceNumberAgainstVoucher":"","compoundTotal":200,"convertedCompoundTotal":200,"invoicesToBePaid":[],"otherTaxModal":{"tcsCalculationMethod":"OnTaxableAmount"},"otherTaxesSum":0,"tdsTcsTaxesSum":0,"otherTaxType":"tcs","exchangeRate":1,"exchangeRateForDisplay":1,"valuesInAccountCurrency":true,"selectedCurrencyToDisplay":0,"baseCurrencyToDisplay":{"code":"INR","symbol":"\u20b9"},"foreignCurrencyToDisplay":{"code":"INR","symbol":"\u20b9"},"isOtherTaxesApplicable":false}',
        headers: {
            'Auth-Key': Cypress.env('authKey'),
            'content-type': 'application/json'
        }
    }).as('createLedgerAPI')

    return cy.get('@createLedgerAPI')
})

// Cypress.Commands.add("SignUp", (email, password) => {
//     cy.visit(Cypress.env('url'))
//     loginPage.signUpButton().click()
//     loginPage.getLoginWithEmail().click()
//     loginPage.enterEmailId().clear().type(email)
//     loginPage.enterPassword().clear().type(password)
//     loginPage.clickLoginButton().click()
//     signUpPage.enterVerificationCode("123456")
//     signUpPage.clickVerifyEmail()
//     cy.wait(2000);
//     //signUpPage.createNewCompany().should('have.value', 'Create New Company')
//     createNewCompanyPage.companyName("giddhautomation")
//     createNewCompanyPage.country().click()
//     createNewCompanyPage.countryList().click()
//     createNewCompanyPage.mobileNumber("1234567890")
//     createNewCompanyPage.nextButton().then(() => {
//         cy.wait(1500)
//         createNewCompanyPage.submitButton().then(() => {
//             cy.xpath('//div[@id=\'toast-container\']', { timeout: 5000 }).should('be.visible')
//         })
//     })
// })


