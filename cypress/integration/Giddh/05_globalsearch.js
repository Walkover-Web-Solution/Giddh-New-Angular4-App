// import TrialBalancePage from "../../support/pageObjects/TrialBalancePage";
// import GlobalSearchPage from "../../support/pageObjects/GlobalSearchPage";

// describe('This is Global Search Test', function() {

//     const globalSearchPage = new GlobalSearchPage()

//     let testData = "";
//     let entryUniqueName = "";

//     before(() => {
//         cy.fixture('example.json')
//             .then((data) => {
//                 // "this" is still the test context object
//                 testData = data
//             })
//     });

//     before(() => {
//         cy.loginWithEmail(testData.Email, testData.Password);
//     })

//     it('Verify Trial Balance using Global Search', () => {
//         cy.globalSearch('#giddh-page-heading-link > span', 'trial balance', 'Trial Balance')

//      });

//     it('Verify Invoice using Global Search', () => {
//         cy.globalSearch('#giddh-page-heading-link > span', 'Invoice', 'Invoice ')
//     });

//     it('Verify Customer module using Global Search', () => {
//         cy.globalSearch('#giddh-page-heading-link > span', 'Customer', 'Customer ')
//     });

//     it('Verify Vendor module using Global Search', () => {
//         cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span', 'Vendor', 'Vendor ')
//     });

//     it('Verify Settings module using Global Search', () => {
//         cy.globalSearch('#giddh-page-heading-link > span', 'Settings', 'Settings > Taxes ')
//     });

//     it('Verify Walkover Account module using Global Search', () => {
//         cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span', 'Walkover', 'Walkover Technologies Private Limited A/c')
//     });

//     it('Verify Cash Account module using Global Search', () => {
//         cy.get('body').type('{ctrl}g', {force: true})
//         if (globalSearchPage.getGlobalSearch(90000).should('be.visible')) {
//             globalSearchPage.typeGlobalSearch("Cash")
//             cy.wait(2000)
//         }

//         cy.get('.scrollable-content').find('#account-cash').click({force: true})

//     })

//     it('Verify Sales Account module using Global Search', () => {
//         cy.get('body').type('{ctrl}g', {force: true})
//         if (globalSearchPage.getGlobalSearch(90000).should('be.visible')) {
//             globalSearchPage.typeGlobalSearch("sales")
//             cy.wait(2000)
//         }
//         cy.get('.scrollable-content').find('#account-sales').click({force: true})
//     })
// })


