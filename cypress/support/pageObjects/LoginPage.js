class LoginPage {

    getLoginWithGoogle() {
        return cy.xpath('//span[@class=\'login-with-google\']')
    }

    getLoginWithEmail(){
        return cy.xpath('//a[contains(text(),\'email and password\')]');
    }

    signUpButton(){
        return cy.xpath('//a[normalize-space()=\'Signup\']');
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
