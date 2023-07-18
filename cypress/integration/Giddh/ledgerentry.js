describe('This is Sundry Debtors Test', function () {
    let testData = "";
    let entryUniqueName = "";

    before(function () {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    });

    afterEach("Get Ledger and delete Ledger entries", ()=>{
        cy.getAllLedger(testData.uitest).then((response) => {
            expect(response.status).to.eq(200)
            const respBody = response.body;
            if(respBody.body.debitTransactions && respBody.body.debitTransactions.length > 0) {
                entryUniqueName =  respBody.body.debitTransactions[0].entryUniqueName;
            } else {
                entryUniqueName = "";
            }
        }).then(()=> {
            if (entryUniqueName) {
                cy.deleteLedger(testData.uitest, entryUniqueName).should((resp) =>{
                    expect(resp.status).to.eq(200)
                })
            }
        })
    })

    before('Login in Giddh Web App', () => {
        cy.viewport(1366, 768)
        cy.log(Cypress.env('url'))
        cy.loginWithEmail(testData.Email, testData.Password);
    });

    it('Ledger entry without taxes and Discount ', () => {
        cy.globalSearch('.hamburger-menu', 'uitest', 'Uitest').then(() => {
            cy.createLedger('Sales', '#select-menu-0 > .list-item > .item', '100.50')
        })
    });
})
