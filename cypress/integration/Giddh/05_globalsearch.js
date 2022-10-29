import GlobalSearchPage from "../../support/pageObjects/GlobalSearchPage";

describe('This is Global Search Test', function () {

    const globalSearchPage = new GlobalSearchPage()

    let testData = "";

    before(function () {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    });

    before('Login in Giddh Web App', () => {
        cy.viewport(1366, 768)
        cy.log(Cypress.env('url'))
        cy.loginWithEmail(testData.Email, testData.Password);
    });

    it('Verify Trial Balance using Global Search', () => {
        cy.globalSearch('.hamburger-menu', 'trial balance', 'Trial Balance')
    });

    it('Verify Invoice using Global Search', () => {
        cy.globalSearch('.hamburger-menu', 'Invoice', 'Invoice ')
    });

    it('Verify Customer module using Global Search', () => {
        cy.globalSearch('.hamburger-menu', 'Customer', 'Customer ')
    });

    it('Verify Vendor module using Global Search', () => {
        cy.globalSearch('.hamburger-menu', 'Vendor', 'Vendor ')
    });

    it('Verify Settings module using Global Search', () => {
        cy.globalSearch('.hamburger-menu', 'Settings', 'Settings > Taxes ')
    });

    it('Verify Walkover Account module using Global Search', () => {
        cy.globalSearch('.hamburger-menu', 'Walkover', 'Walkover Technologies Private Limited A/c')
    });

    it('Verify Cash Account module using Global Search', () => {
        cy.get('body').type('{ctrl}g', { force: true })
        if (globalSearchPage.getGlobalSearch(20000).should('be.visible')) {
            globalSearchPage.typeGlobalSearch("Cash")
            cy.wait(2000)
        }
        cy.get('.scrollable-content').find('.item-details.flex-grow-1 > .d-flex > .width-65 > p:nth-child(1)').each(($e1, index, $list) => {
            const text = $e1.text()
            if (text === 'Cash') {
                $e1.trigger("click")
            }
        })
    })

    it('Verify Sales Account module using Global Search', () => {
        cy.get('body').type('{ctrl}g', { force: true })
        if (globalSearchPage.getGlobalSearch(20000).should('be.visible')) {
            globalSearchPage.typeGlobalSearch("sales")
            cy.wait(2000)
        }
        cy.get('.scrollable-content').find('.item-details.flex-grow-1 > .d-flex > .width-65 > p:nth-child(1)').each(($e1, index, $list) => {
            const text = $e1.text()
            if (text === 'Sales') {
                $e1.trigger("click")
            }
        })
    })

})
