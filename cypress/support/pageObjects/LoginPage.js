class LoginPage {

    getLoginWithGoogle() {
        return cy.xpath('//span[@class=\'login-with-google\']')
    }

    getLoginWithEmail(){
        return cy.xpath('//a[contains(text(),\'email and password\')]');
    }

    getSignUpButton(){
        return cy.xpath('//a[@class=\'btn btn-secondary\']');
    }

    enterEmailId(){
        return cy.get('#email');
    }

    enterPassword(){
        return cy.xpath('//input[@placeholder=\'Password\']');
    }

    clickLoginButton(){
        return cy.get('#demo > .btn')
    }

}

export default LoginPage;