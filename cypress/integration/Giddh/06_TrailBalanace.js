import GlobalSearchPage from "../../support/pageObjects/GlobalSearchPage";

describe('This is TrialBalance Search Test', () => {

    let testData = "";
    let entryUniqueName = "";
    before(() => {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    });

    before(() => {
        let allAccountName = ['cash', 'uitest', "invoiceaccount"];
        allAccountName.forEach((accName) => {
            cy.deleteAllLedgersAPI(accName)
        })
        cy.viewport(1366, 768)
        cy.loginWithEmail(testData.Email, testData.Password);
    })

    xit('Verify Trial Balance Amount after Create Entry', () => {
        cy.createLedgerAPI('uitest').then((response) => {
            if (response.status === 201){
                cy.globalSearch('.active.nav-item > .nav-link > span', 'trial balance', 'Trial Balance')
            }
            cy.searchOnTrialBalance('uitest', '199.99')
        })
    });

    xit('Verify Balance Sheet Amount after Create Entry', () => {
        cy.createLedgerAPI('uitest').then((response) => {
            if (response.status === 201){
                cy.globalSearch('.active.nav-item > .nav-link > span', 'trial balance', 'Trial Balance')
            }
            cy.searchOnTrialBalance('uitest', '199.99')
        })
    });

})
