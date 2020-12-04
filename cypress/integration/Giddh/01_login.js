
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



    it('Login with Email1', () => {
        cy.loginWithEmail(testData.Email, testData.Password)

    })

})
