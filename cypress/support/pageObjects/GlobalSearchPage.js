class GlobalSearchPage {

    typeGlobalSearch(searchValue) {
        cy.get('.searchEle').clear({force:true})
        cy.get('.searchEle').type(searchValue, {delay:500, force:true})
    }

    getGlobalSearch(timeOut) {
        return cy.xpath('//input[@placeholder=\'Search\']', {timeout: timeOut})

    }

    selectFirstValueAfterSearch() {
       return  cy.get(':nth-child(1) > .d-flex > .item-details > :nth-child(1)')
    }

}

export default GlobalSearchPage;
