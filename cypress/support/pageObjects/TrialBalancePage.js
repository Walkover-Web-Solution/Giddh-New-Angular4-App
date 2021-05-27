class TrialBalancePage {

    getTrailBalanceText(timeOut) {
        cy.get('.nav-item.active > .nav-link > span', { timeout: timeOut })
    }

}

export default TrialBalancePage;
