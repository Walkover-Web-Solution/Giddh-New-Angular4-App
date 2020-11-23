
describe('This is SignUp Test', function() {

    let testData = "";
    before(function() {
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    })


    it('SingUp with Email', () => {
        let r = "giddhautomation_signup"+ Math.random().toString(36).substring(7)+ "@gmail.com";
        console.log("random", r);
        cy.SignUp(r, testData.Password)

    })

})
