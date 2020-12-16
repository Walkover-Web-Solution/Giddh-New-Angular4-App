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

    // before(() => {
    //     cy.viewport(1366, 768)
    //     cy.loginWithEmail(testData.Email, testData.Password);
    // })
    //
    // it('Verify Trial Balance using Global Search', () => {
    //     cy.globalSearch('#giddh-page-heading-link > span', 'trial balance', 'Trial Balance')
    //
    // });

})
