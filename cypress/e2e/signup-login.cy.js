/// <reference types="cypress" />

describe("Signup", () => {
    let randomString = Math.random().toString(36).substring(2);
    let username = 'auto' + randomString;
    let email = 'auto_' + randomString + '@gmail.com';
    let password = "Password1";

    it("Test valid signup", () => {
        cy.intercept("POST", " **/users").as("newUser");
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign up").click();
        cy.get("[placeholder='Username']").type(username);
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign up").click();

        cy.wait("@newUser")
        cy.get("@newUser").should((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.request.body.user.username).to.eq(username);
            expect(xhr.request.body.user.email).to.eq(email);
        })
    })

    it("Test valid login", () => {
        cy.intercept("GET", "**/tags", { fixture: 'popularTags.json' })
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign in").click();
        cy.get(':nth-child(4) > .nav-link').should('be.visible')

        cy.get('.tag-list').should("contain", "qauni").and("contain", "automation-testing");
    })

    it.only("Mock global feed data", () => {
        cy.intercept("GET", "**/feed*", { fixture: 'testArticles.json' }).as("articles")
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign in").click();
        cy.wait("@articles")
    })
})