class HeaderPage {

    clickGiddhLogoIcon() {
        return cy.get('.logo-wrapper > img', { timeout: 10000 })
    }

}

export default HeaderPage;
