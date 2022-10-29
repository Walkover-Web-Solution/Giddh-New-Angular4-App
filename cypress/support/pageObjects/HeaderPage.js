class HeaderPage {

    clickGiddhLogoIcon() {
        return cy.get('.logo-wrapper > img', { timeout: 50000 })
    }

}

export default HeaderPage;
