class TrialBalancePage {

    searchIcon(timeOut){
        return cy.xpath('//i[@class=\'icon-search2\']', {timeout: 40000})
    }

    typeSearchValue(searchValue){
        cy.xpath('//input[@placeholder=\'Search\']').click({force:true})
        cy.xpath('//input[@placeholder=\'Search\']').clear({force:true})
        cy.xpath('//input[@placeholder=\'Search\']').type(searchValue, {delay:500, force:true})
    }

    refreshIcon(){
        return cy.get('.icon-refresh')
    }

    searchAccountName(){
       return  cy.xpath('//span[@class=\'ui-select-highlight\']')
    }

    searchAccountAmount(){
        return cy.get('tr > :nth-child(3)')
    }



}

export default TrialBalancePage;
