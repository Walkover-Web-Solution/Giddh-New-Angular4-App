class HeaderPage {

    clickGiddhLogoIcon(){
        return cy.xpath('//img[@class=\'giddh-logo\']')
    }

}

export default HeaderPage;