class GlobalSearchPage {

    typeGlobalSearch(searchValue) {
        cy.get('.searchEle').type(searchValue, {delay:500})
    }

    getGlobalSearch(timeOut) {
        return cy.get('.searchEle' , {timeout: timeOut})
    }

    selectFirstValueAfterSearch() {
       return  cy.get(':nth-child(1) > .d-flex > .item-details > :nth-child(1)')
    }

}

export default GlobalSearchPage;