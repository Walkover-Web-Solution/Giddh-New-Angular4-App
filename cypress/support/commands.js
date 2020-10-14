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
import MainPage from '../support/pageObjects/MainPage'
import HeaderPage from "./pageObjects/HeaderPage";
import DashboardPage from "./pageObjects/DashboardPage";
import GlobalSearchPage from "./pageObjects/GlobalSearchPage";
import TrialBalancePage from "./pageObjects/TrialBalancePage";
import LedgerPage from "./pageObjects/LedgerPage";
const loginPage = new LoginPage()
const mainPage = new MainPage()
const headerPage = new HeaderPage()
const ledgerPage = new LedgerPage()
const globalSearchPage = new GlobalSearchPage()
const trialBalancePage = new TrialBalancePage()


Cypress.Commands.add("loginWithGoogle", (email, password) => {

    cy.visit('https://www.google.com/gmail/')

    cy.visit(Cypress.env('url'))
    //mainPage.getLoginButton().click()
    loginPage.getLoginWithGoogle().click()


})

Cypress.Commands.add("loginWithEmail", (email, password) => {
    const loginPage = new LoginPage()
    const mainPage = new MainPage()
    cy.visit(Cypress.env('url'))
    //mainPage.getLoginButton().click()
    loginPage.getLoginWithEmail().click()
    loginPage.enterEmailId().type(email)
    loginPage.enterPassword().type(password)
    loginPage.clickLoginButton().click()
    cy.wait(10000);
    //  cy.visit(Cypress.env('dashBoardUrl'))
    //  cy.location('pathname', {timeout: 60000})
    //      .should('include', '/pages/home');
    headerPage.clickGiddhLogoIcon().should('have.attr', 'src')
        .should('include','assets/images/giddh-white-logo.svg')
    // headerPage.clickGiddhLogoIcon().find('img').should('have.attr', 'src').should('include','assets/images/giddh-white-logo.svg')
    // headerPage.clickGiddhLogoIcon().click()
    // expect(headerPage.clickGiddhLogoIcon()).to.deep.equal({src : 'assets/images/giddh-white-logo.svg'})

})

Cypress.Commands.add("globalSearch", (elementPath, searchValue, expectedText) => {
    cy.get('body').type('{ctrl}g', {force: true})
    if (globalSearchPage.getGlobalSearch(90000).should('be.visible')){
        // dashboardPage.getTotalOverDues(60000).should('be.visible')
        // cy.visit(Cypress.env('dashBoardUrl'))
        headerPage.clickGiddhLogoIcon().then(($ele1) => {
            // headerPage.clickGiddhLogoIcon().type('{ctrl}g')
            globalSearchPage.typeGlobalSearch(searchValue)
            globalSearchPage.selectFirstValueAfterSearch().then(($btn) => {
                $btn.click();
                cy.wait(5000)
                cy.xpath(elementPath, {timeout: 50000}).should('be.visible')
                cy.xpath(elementPath, {timeout: 50000}).then((elementText) => {
                    cy.wait(5000).then(() =>{
                        const text = elementText.text();
                        //  expect(text).to.eq(expectedText)
                    })

                })

            })
        })
    }
    // cy.waitUntilVisible(trialBalancePage.getTrailBalanceText()).should('have.value', 'Trial Balance')
})


Cypress.Commands.add("createLedger", (accountName, accountElementPath, amount)=>{
    ledgerPage.clickAccount().click()
    ledgerPage.inputAccount().type(accountName)
    //cy.contains(accountElementPath).click();
    //ledgerPage.selectSalesAccount().click({force : true})
    cy.get(accountElementPath).click({force : true})
    ledgerPage.enterAmount().clear().type(amount)
    ledgerPage.saveButton().click().then(()=>{
        cy.xpath('//div[@id=\'toast-container\']', {timeout: 5000}).should('be.visible')
    })
})

Cypress.Commands.add("abc", (accountName, accountElementPath, amount)=>{
    cy.log("This is for testing")
    ledgerPage.clickAccount().click()
    ledgerPage.inputAccount().type(accountName)
    //cy.contains(accountElementPath).click();
    //ledgerPage.selectSalesAccount().click({force : true})
    cy.get(accountElementPath).click({force : true})
    ledgerPage.selectTax()
    ledgerPage.enterAmount().clear().type(amount)
    ledgerPage.saveButton().click().then(()=>{
        cy.xpath('//div[@id=\'toast-container\']', {timeout: 5000}).should('be.visible')
    })
})

Cypress.Commands.add("getAllLedger", () => {
    cy.request({
        method: 'GET',
        url: Cypress.env('apiBaseURI')+ Cypress.env('getLedgerAPI'),
        'content-type': 'application/json; charset=utf-8',
        headers: {
            'Auth-Key': Cypress.env('authKey')
        }
    }).as('getAllLedgerAPI')
    return  cy.get('@getAllLedgerAPI')
})

Cypress.Commands.add("deleteLedger", (accountUniqueName, entryUniqueID) => {
    cy.request({
        method: 'DELETE',
        url: Cypress.env('apiBaseURI')+ "/accounts/"+ accountUniqueName + "/entries/"+ entryUniqueID,
        'content-type': 'application/json; charset=utf-8',
        headers: {
            'Auth-Key': Cypress.env('authKey')
        }
    }).as('deleteLedgerAPI')

    return  cy.get('@deleteLedgerAPI')
})

Cypress.Commands.add("getLedger", (accountUniqueName, entryUniqueID) => {
    cy.request({
        method: 'GET',
        url: Cypress.env('apiBaseURI')+ "/accounts/"+ accountUniqueName + "/ledgers/"+ entryUniqueID,
        'content-type': 'application/json; charset=utf-8',
        headers: {
            'Auth-Key': Cypress.env('authKey')
        }
    }).as('getLedgerAPI')

    return  cy.get('@getLedgerAPI')
})
