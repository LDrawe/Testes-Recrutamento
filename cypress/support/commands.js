// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('trim', selector =>
    cy.get(selector).invoke('text').then(text => text.replace('kr', '').replace('\xa0', '').trim())
)

Cypress.Commands.add('fillCandidatoForm', (continuar = true) => {
    cy.get('span.h1').click()
    cy.get('.input-style').type('Meu Nome Test')
    cy.get('span.h6').click()
    cy.get('.col-5 > .input-style').type('teste@gmail.com')
    cy.get('#cargo > .ng-select-container > .ng-arrow-wrapper').click()
    cy.get('div.ng-option').eq(0).click()
    cy.get('.input-date-picker > img').click()
    cy.get('.ngb-dp-footer > :nth-child(3)').click()
    cy.get('#cpf').type('49373753002')
    cy.get('#areaTrabalho').type('Manutenção')
    cy.get('#telefoneCelular').type('28987452147')
    cy.get('#cep').type('29500000')
    cy.wait('@cep')
    cy.get('#endereco').type('Rua Caixias De Freitas')
    cy.get('#bairro').type('Centro')
    cy.get('#complemento').type('Nº7 Apt 301')
    cy.get('#referencia').type('Do lado da CEF')
    cy.get('.col-2 > .btn').click()

    if (continuar) {
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#instituicao').type('Equipe')
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('[aria-label="sábado, 1 de junho de 2024"] > .btn-light').click()
        cy.get('#dataTermino > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('.col-2 > .btn').click()
    }
})

Cypress.Commands.add('fillCurriculumForm', (continuar = true, cep = '18304735') => {
    cy.get('#nome').type('Teste')
    cy.get('#sobrenome').type('Sobreteste')
    cy.get('#email').type('teste@gmail.com')
    cy.get('.input-date-picker > img').click()
    cy.get('.ngb-dp-footer > :nth-child(3)').click()
    cy.get('#telefone').type('32958475687')
    cy.get('#cpf').type('66654451007')
    cy.get('.btn').click()

    if (continuar) {
        cy.get('#cep').type(cep)
        cy.wait('@cep')
        cy.get('#numero').type('1')
        cy.get('#complemento').type('Apt 42')
        cy.get('#referencia').type('Subindo o morro')
    }
})