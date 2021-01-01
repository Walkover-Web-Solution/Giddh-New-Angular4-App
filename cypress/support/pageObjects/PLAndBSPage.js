class PLAndBSPage {

    // searchIcon(){
    //     return cy.xpath('//i[@class=\'icon-search2\']', {timeout: 20000})
    // }
    //
    // typeSearchValue(searchValue){
    //     cy.xpath('//input[@placeholder=\'Search\']').click({force:true})
    //     cy.xpath('//input[@placeholder=\'Search\']').clear({force:true})
    //     cy.xpath('//input[@placeholder=\'Search\']').type(searchValue, {delay:500, force:true})
    // }
    //
    // searchAccountName(){
    //     return  cy.xpath('//span[@class=\'ui-select-highlight\']')
    // }

    searchAccountAmount(elementPath){
        return cy.get(elementPath, {timeout: 50000}).should('be.visible')
    }

}

export default PLAndBSPage
