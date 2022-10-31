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
        return cy.xpath('//form[@id=\'demo\']//input[@placeholder=\'Email Id\']');
    }

    enterPassword() {
        return cy.xpath('//form[@id=\'demo\']//input[@placeholder=\'Password\']');
    }

    clickLoginButton() {
        return cy.xpath('//form[@id=\'demo\']//button[@type=\'submit\']');
    }

}

export default LoginPage;
