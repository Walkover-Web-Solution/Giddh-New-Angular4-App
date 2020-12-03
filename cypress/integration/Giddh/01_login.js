
describe('This is Login Test', function() {

    let testData = "";
    // beforeEach(function () {
    //     // "this" points at the test context object
    //     cy.fixture('example.json')
    //         .then((data) => {
    //             // "this" is still the test context object
    //             testData = data
    //         })
    // })


    before(function() {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    })


    // it('Login with Gmail', () => {
    //     // const loginPage = new LoginPage()
    //     // const mainPage = new MainPage()
    //     // cy.visit(Cypress.env('url'))
    //     // //mainPage.getLoginButton().click()
    //     // loginPage.getLoginWithGoogle().click()
    //     // //cy.visit(Cypress.env('baseUrl'))
    //    cy.loginWithGoogle("anc", "abc")
    // })

    it('Login with Email', () => {
        cy.loginWithEmail(testData.Email, testData.Password)

    })

})
