class DashboardPage {

    getTotalOverDues(timeOut) {
        //cy.get('profit-loss > #live > .panel > .panel-heading > strong')
        return cy.get('profit-loss > #live > .panel > .panel-heading > strong', { timeout: timeOut })
    }

}

export default DashboardPage;
