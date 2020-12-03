import TrialBalancePage from "../../support/pageObjects/TrialBalancePage";
import GlobalSearchPage from "../../support/pageObjects/GlobalSearchPage";

describe('This is Global Search Test', function() {

    const globalSearchPage = new GlobalSearchPage()

    before(function() {
        cy.loginWithEmail("giddhautomation@gmail.com", "giddhautomation1@")
    })

    it('Verify Trial Balance using Global Search', function () {
        cy.globalSearch('#giddh-page-heading-link > span', 'trial balance', 'Trial Balance')

    });

    it('Verify Invoice using Global Search', function () {
        cy.globalSearch('#giddh-page-heading-link > span','Invoice', 'Invoice ')

    });

    it('Verify Customer module using Global Search', function () {
        cy.globalSearch('#giddh-page-heading-link > span','Customer', 'Customer ')
    });

    it('Verify Vendor module using Global Search', function () {
        cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span','Vendor', 'Vendor ')
    });

    it('Verify Settings module using Global Search', function () {
        cy.globalSearch('#giddh-page-heading-link > span','Settings', 'Settings > Taxes ')
    });

    it('Verify Walkover Account module using Global Search', function () {
        cy.globalSearch('.hamburger-menu > #giddh-page-heading-link > span','Walkover', 'Walkover Technologies Private Limited A/c')
    });

    // xit.only('Verify Cash Account module using Global Search', function () {
    //     cy.get('body').type('{ctrl}g', {force: true})
    //     if (globalSearchPage.getGlobalSearch(90000).should('be.visible')){
    //         globalSearchPage.typeGlobalSearch("Cash")
    //         cy.wait(2000)
    //     }
    //     cy.get('.scrollable-content').find('.item-details.flex-grow-1 > .width-65 > p:nth-child(1)').each(($e1, index, $list) => {
    //         const text =  $e1.text()
    //         // cy.log(text, '\n')
    //         if (text === 'Cash'){
    //             // cy.log("In If statement")
    //             $e1.trigger("click")
    //             cy.wait(2000)
    //             cy.get('body').type('{enter}').then(()=>{
    //                 cy.get('.hamburger-menu > #giddh-page-heading-link > span', {timeout: 50000}).should('be.visible')
    //                 cy.wait(2000)
    //                 cy.get('.hamburger-menu > #giddh-page-heading-link > span', {timeout: 50000}).then((elementText) => {
    //                     cy.wait(5000).then(() =>{
    //                         const text = elementText.text();
    //                         cy.log(text)
    //                         expect(text).to.contain("Cash A/c")
    //                     })

    //                 })
    //             })
    //         }
    //     })
    // })

    // xit('Verify Sales Account module using Global Search', function () {
    //     cy.get('body').type('{ctrl}g', {force: true})
    //     if (globalSearchPage.getGlobalSearch(90000).should('be.visible')){
    //         globalSearchPage.typeGlobalSearch("sales")
    //         cy.wait(2000)
    //     }
    //     cy.get('.scrollable-content').find('.item-details.flex-grow-1 > p:nth-child(1)').each(($e1, index, $list) => {
    //         const text =  $e1.text()
    //         if (text === 'Sales'){
    //             // cy.log("In If statement")
    //             $e1.trigger("click")
    //             cy.wait(2000)
    //             cy.get('body').type('{enter}').then(()=>{
    //                 cy.get('.hamburger-menu > #giddh-page-heading-link > span', {timeout: 50000}).should('be.visible')
    //                 cy.wait(2000)
    //                 cy.get('.hamburger-menu > #giddh-page-heading-link > span', {timeout: 50000}).then((elementText) => {
    //                     cy.wait(5000).then(() =>{
    //                         const text = elementText.text();
    //                         cy.log(text)
    //                         expect(text).to.contain("Sales A/c")
    //                     })

    //                 })
    //             })
    //         }
    //     })
    // })

})
