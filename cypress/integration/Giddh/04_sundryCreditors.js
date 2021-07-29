describe('This is Sundry Creditors Test', function () {
    let testData = "";
    let entryUniqueName = "";

    before(function () {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    });

    // afterEach("Get Ledger and delete Ledger entries", ()=>{
    //     cy.wait(2000);
    //     cy.getAllLedger(testData.vendor1).then((response) => {
    //         expect(response.status).to.eq(200)
    //         const respBody = response.body;
    //         entryUniqueName =  respBody.body.debitTransactions[0].entryUniqueName;
    //     }).then(()=> {
    //         if (entryUniqueName != null || entryUniqueName !== undefined){
    //             cy.deleteLedger(testData.vendor1, entryUniqueName).should((resp) =>{
    //                 expect(resp.status).to.eq(200)
    //             })
    //         }
    //     })
    // })

    // before('Login in Giddh Web App', () => {
    //     cy.log('I run before test in spec file!!!!!!')
    //     cy.viewport(1366, 768)
    //     cy.log(Cypress.env('url'))
    //     cy.loginWithEmail(testData.Email, testData.Password);

    // });


    xit('Ledger entry without taxes and Discount ', () => {
        cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span', 'vendor1', 'vendor1 A/c').then(() => {
            cy.createLedger('Sales', '#select-menu-0 > .list-item > .item', '100.50')
        })
    });

    xit('Ledger entry with Inventory ', () => {
        cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span', 'vendor1', 'vendor1 A/c').then(() => {
            cy.createLedger('Sales', ':nth-child(2) > .list-item > .item', '177.80')
        })
    });

    xit('Ledger entry with Inventory & Taxes', () => {
        cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span', 'vendor1', 'vendor1 A/c').then(() => {
            cy.createLedgerWithTaxes('Sales', '#select-menu-0 > .list-item > .item', '100.50')
        })
    });


})
