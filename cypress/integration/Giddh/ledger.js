import TrialBalancePage from "../../support/pageObjects/TrialBalancePage";
import GlobalSearchPage from "../../support/pageObjects/GlobalSearchPage";

describe('This is Ledger Test', function() {
    let testData = "";
    let entryUniqueName = "";

    before(function() {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    });

    afterEach("Get Ledger and delete Ledger entries", ()=>{
        // cy.request({
        //     method: 'GET',
        //     url: Cypress.env('apiBaseURI')+ Cypress.env('getLedgerAPI'),
        //     'content-type': 'application/json; charset=utf-8',
        //     headers: {
        //         'Auth-Key': Cypress.env('authKey')
        //     }
        // })
         cy.getLedger().then((response) => {
            expect(response.status).to.eq(200)
            const respBody = response.body;
            entryUniqueName =  respBody.body.debitTransactions[0].entryUniqueName;
            // cy.wait(2000)
            // cy.log("This is testing "+ entryUniqueName)
        }).then(()=>{
            cy.deleteLedger("uitest", entryUniqueName).should((resp) =>{
                expect(resp.status).to.eq(200)
            })
        })
    })

    before('Login in Giddh Web App', function () {
        cy.log(Cypress.env('url'))
        cy.loginWithEmail(testData.Email, testData.Password);

    });

    it('Ledger entry without taxes and Discount ', function () {
        cy.globalSearch('.navbar_header > .nav > .hamburger-menu > .inline', 'uitest', 'uitest A/c').then(()=>{
            cy.createLedger('Sales','.hilighted > .list-item > .item', '100')
        })
    });

    it('Ledger entry with inventory ', function () {
        cy.globalSearch('.navbar_header > .nav > .hamburger-menu > .inline', 'uitest', 'uitest A/c').then(()=>{
            cy.createLedger('Sales',':nth-child(2) > .list-item > .item', '100')
        })

    });


})