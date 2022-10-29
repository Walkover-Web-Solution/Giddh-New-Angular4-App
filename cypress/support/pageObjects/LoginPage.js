class LoginPage {

    getLoginWithGoogle() {
        return cy.xpath('//span[@class=\'login-with-google\']')
    }

    getLoginWithEmail() {
        return cy.xpath('//a[contains(text(),\'email and password\')]');
    }

    signUpButton() {
        return cy.xpath('//a[normalize-space()=\'Signup\']');
    }

    enterEmailId() {
        return cy.xpath('//input[@placeholder=\'Email Id\']');
    }

    enterPassword() {
        return cy.xpath('//input[@placeholder=\'Password\']');
    }

    clickLoginButton() {
        return cy.xpath('//button[@type=\'submit\']');
    }

}

export default LoginPage;
