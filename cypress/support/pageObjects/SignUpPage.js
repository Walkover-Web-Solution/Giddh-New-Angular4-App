class SignUpPage {

    enterVerificationCode(code) {
        return cy.xpath("//input[@id='verificationCode']").clear().type(code);
    }

    clickVerifyEmail() {
        return cy.xpath("//button[normalize-space()='Verify Email']").click();
    }

    createNewCompany() {
        return cy.xpath('//h3[normalize-space()=\'Create New Company\']')
    }
}

export default SignUpPage;
