class TrialBalancePage {

    searchIcon(timeOut) {
        return cy.get('#showSearch')
    }

    typeSearchValue(searchValue) {
        cy.xpath('//input[@placeholder=\'Search\']').click({ force: true })
        cy.xpath('//input[@placeholder=\'Search\']').clear({ force: true })
        cy.xpath('//input[@placeholder=\'Search\']').type(searchValue, { delay: 500, force: true })
    }

    refreshIcon() {
        return cy.get('.icon-refresh')
    }

    searchAccountName() {
        return cy.xpath('//span[@class=\'ui-select-highlight\']')
    }

    searchAccountAmount() {
        return cy.xpath('//span[@class=\'ui-select-highlight\']/parent::div/following::div[1]')
    }



}

export default TrialBalancePage;
