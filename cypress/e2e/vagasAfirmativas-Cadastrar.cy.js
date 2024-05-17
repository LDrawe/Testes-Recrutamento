/// <reference types="Cypress" />
import { randomBytes } from 'crypto'

describe('Test Case Vagas Afirmativas - Cadastrar - US 60648', () => {
    before(() => {
        cy.clearCookies()
        cy.getCookies().should('be.empty')
    })

    beforeEach(() => {
        cy.visit('/')
        cy.title().should('contain', 'Recrutamento')
        cy.get('li > div.wrapper').eq(2).click()
        cy.get('.sub-menu > :nth-child(16)').click()
        cy.url().should('contain', 'setup-da-empresa/vagas-afirmativas')
    })

    it('CT001 - Adicionar', () => {
        cy.get('button.secondary').should('be.visible').and('be.enabled').click()
        cy.url().should('contain', 'setup-da-empresa/vagas-afirmativas/form')
        cy.get('input.inpunt-register').should('be.visible').and('be.enabled')
        cy.get('button.btn-secondary').should('be.visible').and('be.enabled')
        cy.get('button.btn-primary').should('be.visible').and('be.disabled')
    })

    it('CT002 - Botão Salvar', () => {
        cy.get('button.secondary').click()
        cy.get('input.inpunt-register').type('NAFJKANKFJA')
        cy.get('button.btn-primary').should('be.enabled')
    })

    it('CT003 - Salvar sem dados', () => {
        cy.get('button.secondary').click()
        cy.get('input.inpunt-register').focus().blur()
        cy.get('.form-group > span').should('be.visible').and('include.text', '*Campo de preenchimento obrigatório')
    })

    it('CT004 - Duplicidade de vagas', () => {
        cy.get('button.secondary').should('be.visible').and('be.enabled').click()
        cy.get('input.inpunt-register').type('Teste')
        cy.get('button.btn-primary').click()
        cy.get('h2#swal2-title').should('be.visible').and('have.text', 'Registro já existe!')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Já existe registro com essa descrição')
        cy.get('button.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('div.swal2-container').should('not.exist')
    })

    it.skip('CT005 - Salvar com sucesso', () => {
        cy.get('button.secondary').should('be.visible').and('be.enabled').click()
        cy.get('input.inpunt-register').type(randomBytes(4).toString('hex'))
        cy.get('button.btn-primary').click()
        cy.get('h2#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Registro salvo com sucesso')
        cy.get('button.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('div.swal2-container').should('not.exist')
    })

    it('CT006 - Sair sem salvar', () => {
        cy.get('button.secondary').should('be.visible').and('be.enabled').click()
        cy.get('input.inpunt-register').type(randomBytes(4).toString('hex'))
        const voltar = cy.get('button.btn-secondary')
        voltar.click()
        cy.get('h2#swal2-title').should('be.visible').and('have.text', 'Atenção')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Os dados serão perdidos, \ndeseja continuar?')
        //Clicando em não
        cy.get('button.swal2-cancel').should('be.visible').and('be.enabled').and('have.text', 'Não').click()
        cy.get('div.swal2-container').should('not.exist')
        //Clicando em sim
        voltar.click()
        cy.get('button.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Sim').click()
        cy.url().should('not.include', 'form')
    })
})