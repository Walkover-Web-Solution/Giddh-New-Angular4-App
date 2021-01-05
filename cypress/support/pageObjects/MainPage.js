class MainPage {

    getLoginButton() {
        return cy.xpath('//a[@class=\'btn btn-login\']')
    }

}

export default MainPage;
