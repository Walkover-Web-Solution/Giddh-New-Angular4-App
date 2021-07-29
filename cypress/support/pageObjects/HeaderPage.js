class HeaderPage {

    clickGiddhLogoIcon() {
        return cy.get('.company-text > .giddh-logo', { timeout: 50000 })
    }

}

export default HeaderPage;
