class CreateNewCompanyPage {

    companyName(companyName) {
        return cy.get('#name').clear().type(companyName);
    }

    country() {
        return cy.xpath("//sh-select[@id='country']");
    }

    countryList() {
        return cy.get("#select-menu-0 > .list-item > .item");
    }

    mobileNumber(contactNumber) {
        return cy.xpath("//input[@id='contactNo']").clear().type(contactNumber);
    }

    nextButton() {
        return cy.xpath("//button[@type='submit']").click()
    }

    submitButton() {
        return cy.xpath("//button[normalize-space()='Submit']").click()
    }

}

export default CreateNewCompanyPage
