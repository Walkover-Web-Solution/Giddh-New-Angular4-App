class HeaderPage {

    clickGiddhLogoIcon() {
        return cy.xpath('//img[@class=\'giddh-logo\']', { timeout: 50000 })
    }

}

export default HeaderPage;
