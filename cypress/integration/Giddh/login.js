describe('This is Login Test', function() {

    let testData = "";
    beforeEach(() => {
        // "this" points at the test context object
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    })


    before(function() {
        cy.viewport(1366, 768)
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    })



    it('Login with Email', () => {
        cy.loginWithEmail(testData.Email, testData.Password)

    })

})
