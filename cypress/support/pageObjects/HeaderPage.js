class HeaderPage {

    clickGiddhLogoIcon(){
        //return cy.xpath('//img[@class=\'giddh-logo\']', { timeout: 50000 })
        return cy.get('.company-text > .giddh-logo', { timeout: 50000 } )
    }

}

export default HeaderPage;
