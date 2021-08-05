class GlobalSearchPage {

    typeGlobalSearch(searchValue) {
        cy.get('.search-element').clear()
        cy.get('.search-element').type(searchValue, { delay: 500 })
    }

    getGlobalSearch(timeOut) {
        return cy.get('.search-element', { timeout: timeOut })
    }

    selectFirstValueAfterSearch() {
        return cy.get(':nth-child(1) > .d-flex > .item-details > :nth-child(1)')
    }

}

export default GlobalSearchPage;
