
describe('This is SignUp Test', () => {

    let testData = "";
    before(() => {
        cy.viewport(1366, 768)
        cy.fixture('example.json')
            .then((data) => {
                // "this" is still the test context object
                testData = data
            })
    })


    xit('SingUp with Email', () => {
        let r = "giddhautomation_signup" + Math.random().toString(36).substring(7) + "@gmail.com";
        console.log("random", r);
        cy.SignUp(r, testData.Password)

    })

})
