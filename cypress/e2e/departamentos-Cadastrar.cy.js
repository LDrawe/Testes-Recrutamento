/// <reference types="Cypress" />
import { randomBytes } from 'crypto'

describe('Test Case Departamentos - Cadastrar - US 60625', () => {
    before(() => {
        cy.clearCookies()
        cy.getCookies().should('be.empty')
    })

    beforeEach(() => {
        cy.visit('/')
        cy.title().should('contain', 'Recrutamento')
        cy.get('li > div.wrapper').eq(2).click()
        cy.contains('ul.sub-menu > li:nth-child(4)', 'Departamentos').click()
        cy.url().should('contain', 'setup-da-empresa/departamentos')
    })

    it('CT001 - Adicionar', () => {
        cy.get('button.secondary').click()
        cy.url().should('contain', '/form')
        cy.get('input#nomeDepartamento').should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        cy.get('input#abreviacao').should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 2)
        cy.get('div.ng-select-container').should('be.visible')
        cy.get('input#emailResponsavel').should('be.visible').and('be.disabled')
    })

    it('CT002 - Salvar sem dados', () => {
        cy.get('button.secondary').click()
        cy.get('input#nomeDepartamento').focus().blur()
        cy.get('input#abreviacao').focus().blur()
        cy.get('input#nomeDepartamento + span').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
        cy.get('input#abreviacao + span').should('be.visible').and('have.text', ' *Campo de preenchimento obrigatório ')

    })

    it('CT003 - Cadastrar com nome repetido', () => {
        cy.get('button.secondary').click()
        cy.get('input#nomeDepartamento').clear().type('ITIX GAMING')
        cy.get('input#abreviacao').clear().type('IG')
        cy.get('button.primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Erro na requisição')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Já existe um registro com essa descrição.')
        cy.get('button.swal2-confirm').click()
        cy.get('div.modal-content').should('not.exist')
    })

    it('CT004 - Cadastrar com Abreviação repetida', () => {
        cy.get('button.secondary').click()
        cy.get('input#nomeDepartamento').clear().type(randomBytes(3).toString('hex'))
        cy.get('input#abreviacao').clear().type('IG')
        cy.get('button.primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Erro na requisição')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Já existe um Departamento cadastrado com essa abreviação.')
        cy.get('button.swal2-confirm').click()
        cy.get('div.modal-content').should('not.exist')
    })

    it.skip('CT005 - Nome e Abreviação válida', () => {
        cy.get('button.secondary').click()
        cy.get('input#nomeDepartamento').clear().type(randomBytes(3).toString('hex'))
        cy.get('input#abreviacao').clear().type(randomBytes(1).toString('hex'))
        cy.get('button.primary').click()
        cy.get('h2#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Registro salvo com sucesso')
        cy.get('button.swal2-confirm').click()
        cy.get('div.modal-content').should('not.exist')
    })

    it('CT006 - Cancelar', () => {
        cy.get('button.secondary').click()
        cy.get('input#nomeDepartamento').clear().type(randomBytes(3).toString('hex'))
        cy.get('button.secondary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Confirmar')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Deseja sair SEM salvar as alterações feitas?')
        cy.get('button.swal2-cancel').click()
        cy.get('div.modal-content').should('not.exist')
        cy.get('button.secondary').click()
        cy.get('button.swal2-confirm').click()
        cy.get('div.modal-content').should('not.exist')
        cy.url().should('not.include', '/form')
    })
})