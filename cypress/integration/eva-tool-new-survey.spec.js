/// <reference types="cypress" />

context('Eva-Tool', () => {
    beforeEach(() => {
        cy.visit('localhost:3002/#/')
        cy.viewport(1920, 1080)
    })

    it('add-delete Survey', () => {
        // login
        cy.get('button').should('contain', 'Login')
        cy.get('button').click()
        cy.wait(5000)

        // show Survey page
        cy.contains('Umfragen').click()
        cy.wait(1000)

        // add new Survey
        cy.contains('Neue Umfrage').click()
        cy.wait(100)

        // show sidebar
        cy.get('aside').invoke('css', 'display', 'block')
        cy.wait(100)

        // new Survey data
        cy.get('aside input#name').type('Cypress Survey')
        cy.get('aside input.form-checkbox').eq(0).click({ force: true })
        cy.get('aside input#description').type('Cypress Survey Beschreibung')
        cy.wait(100)

        // save the new Survey
        cy.get('aside button').eq(1).click()

        // delete the last added Survey
        cy.wait(5000)
        cy.get('table tr').last().find('svg').eq(1).click()
    })
})
