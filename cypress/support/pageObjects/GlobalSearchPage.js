class GlobalSearchPage {

    typeGlobalSearch(searchValue) {
        cy.get('.search-element').clear({force:true})
        cy.get('.search-element').type(searchValue, {delay:700, force:true})
    }

    getGlobalSearch(timeOut) {
        return cy.xpath('//input[@placeholder=\'Search\']', {timeout: timeOut})

    }

    selectFirstValueAfterSearch() {
       return  cy.get(':nth-child(1) > .d-flex > .item-details > :nth-child(1)')
    }

}

export default GlobalSearchPage;
