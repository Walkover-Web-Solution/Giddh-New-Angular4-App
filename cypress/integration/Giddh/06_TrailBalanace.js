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
        cy.deleteAllLedgersAPI('uitest').then(() => {
            cy.viewport(1366, 768)
            cy.loginWithEmail(testData.Email, testData.Password);
        })
    })

    it('Verify Trial Balance using Global Search', () => {
        cy.createLedgerAPI('uitest').then((response) => {
            if (response.status === 201) {
                cy.globalSearch('.active.nav-item > .nav-link > span', 'trial balance', 'Trial Balance')

            }
            cy.searchOnTrialBalance('uitest', '199.99  Dr. ')
            // allEntryUniqueName.forEach((item)=>{
            //     console.log(item.entryUniqueName)
            //     cy.log(item.entryUniqueName)
            // })
        })

    });

})
