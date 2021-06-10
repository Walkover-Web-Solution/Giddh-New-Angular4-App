class HeaderPage {

    clickGiddhLogoIcon() {
        return cy.xpath('//img[@class=\'giddh-logo\']', { timeout: 50000 })
    }

    trialBalanceOptions() {
        return cy.xpath('//a[@role=\'tab\']/child::span', { timeout: 20000 })
    }

}

export default HeaderPage;
