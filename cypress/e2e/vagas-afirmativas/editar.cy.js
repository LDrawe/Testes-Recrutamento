/// <reference types="Cypress" />
import 'cypress-if'
import { randomBytes } from 'crypto'

describe('Suit Test Vagas Afirmativas - Pesquisar e Editar (US 61449)', () => {
    beforeEach(() => {
        cy.authenticate()
        cy.intercept('vaga-afirmativa/search*').as('vagas')
        cy.visit('/setup-da-empresa/vagas-afirmativas', { failOnStatusCode: false })
        cy.url().should('contain', 'setup-da-empresa/vagas-afirmativas')
        cy.wait('@vagas')
    })

    it('CT001 - Exibir vagas', () => {
        cy.get('h5').if().should('be.visible').and('have.text', 'Nenhum resultado encontrado').else().then(() => {
            cy.get('tbody tr').should('have.length.at.most', 10)
        })
        cy.get('.description').each(name => cy.wrap(name).should('not.have.text', ''))
        cy.get('.description + td').each(status => {
            expect(status.text().toString().trim().toLocaleLowerCase()).to.include('ativo')
        })
    })

    it('CT002 - Editar Vaga', () => {
        cy.get('tr:not(:has(td:nth-child(2) label:contains("Inativo"))) > .rounded-end > .edit').eq(0).click()
        cy.get('#vagaInput').should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 50)
        cy.get('#check').should('be.enabled')
        cy.get('.slider').should('be.visible')
        cy.get('.btn-text').should('be.visible').and('be.enabled').and('have.text', 'Voltar')
        cy.get('.btn-primary').should('be.visible').and('be.enabled').and('include.text', 'Salvar')
    })

    it('CT003 - Removendo descrição da Vaga', () => {
        cy.get('tr:not(:has(td:nth-child(2) label:contains("Inativo"))) > .rounded-end > .edit').eq(0).click()
        cy.get('#vagaInput').clear().blur()
        cy.get('.btn-primary').should('be.visible').and('not.be.enabled')
        cy.get(':nth-child(3) > .text-danger').should('be.visible').and('have.text', 'O campo Vaga Afirmativa não pode estar vazio!')
    })

    it('CT004 - Editando descriçao da vaga', () => {
        cy.get('tr:not(:has(td:nth-child(2) label:contains("Inativo"))) > .rounded-end > .edit').eq(0).click()
        cy.get('#vagaInput').clear().type('Teste')
        cy.get('.btn-text').click()
        cy.get('.swal2-popup').should('be.visible')
        cy.get('.swal2-title').should('be.visible').and('have.text', 'Atenção')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Os dados serão perdidos, deseja continuar?')
        cy.get('.swal2-confirm').should('be.visible').and('be.enabled')
        cy.get('.swal2-cancel').should('be.visible').and('be.enabled').click()
        cy.get('div.modal-content').should('be.visible')
        cy.get('.btn-text').click()
        cy.get('.swal2-confirm').click()
        cy.get('div.modal-content').should('not.exist')
    })

    it('CT005 - Editar Vaga (Nome repetido)', () => {
        cy.get('tr:not(:has(td:nth-child(2) label:contains("Inativo"))) > .rounded-end > .edit').eq(0).click()
        cy.get('#vagaInput').clear().type('Teste')
        cy.get('.btn-primary').click()
        cy.get('span.text-danger').should('be.visible').and('have.text', '**Já existe um registro com essa descrição')
    })

    it('CT006 - Editar Vaga (Nome novo)', () => {
        cy.get('tr:not(:has(td:nth-child(2) label:contains("Inativo"))) > .rounded-end > .edit').eq(0).click()
        cy.get('#vagaInput').clear().type(randomBytes(6).toString('hex'))
        cy.get('.btn-primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Vaga Afirmativa alterada com sucesso!')
        cy.get('.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('app-modal-vaga-afirmativa').should('not.exist')
    })

    it('CT007 - Botão Adicionar Vaga', () => {
        cy.get('button.secondary').click()
        cy.url().should('contain', '/vagas-afirmativas/form')
        cy.get('.input-register').should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        cy.get('.btn-secondary').should('be.visible').and('be.enabled')
        cy.get('.btn-primary').should('be.visible').and('not.be.enabled')
    })

    it('CT008 - Removendo descriçao da nova vaga', () => {
        cy.get('button.secondary').click()
        cy.get('.input-register').clear().blur()
        cy.get('div.form-group > span').should('be.visible').and('contain.text', '*Campo de preenchimento obrigatório')
        cy.get('.btn-primary').should('be.visible').and('not.be.enabled')
    })

    it('CT009 - Editando descriçao da nova vaga', () => {
        cy.get('button.secondary').click()
        cy.get('.input-register').clear().type('HJBjhBJHAAK')
        cy.get('.btn-secondary').click()
        cy.get('.swal2-popup').should('be.visible')
        cy.get('.swal2-title').should('be.visible').and('have.text', 'Atenção')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Os dados serão perdidos, \ndeseja continuar?')
        cy.get('.swal2-confirm').should('be.visible').and('be.enabled')
        cy.get('.swal2-cancel').should('be.visible').and('be.enabled')

        //clicando em não
        cy.get('button.swal2-cancel').click()
        cy.get('div.swal2-modal').should('not.exist')
        cy.url().should('contain', '/vagas-afirmativas/form')

        //clicando em sim
        cy.get('.btn-secondary').click()
        cy.get('button.swal2-confirm').click()
        cy.get('div.swal2-modal').should('not.exist')
        cy.url().should('not.contain', 'form')
    })

    it('CT010 - Nova Vaga (Nome repetido)', () => {
        cy.get('button.secondary').click()
        cy.get('.input-register').clear().type('Teste')
        cy.get('.btn-primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Registro já existe!')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Já existe registro com essa descrição')
        cy.get('.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('div.swal2-modal').should('not.exist')
    })

    it.skip('CT011 - Nova Vaga (Nome novo)', () => {
        cy.get('button.secondary').click()

        cy.get('.input-register').clear().type(randomBytes(8).toString('hex'))
        cy.get('.btn-primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Registro salvo com sucesso')
        cy.get('.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('div.swal2-modal').should('not.exist')
        cy.url().should('not.contain', 'form')
    })

    it('CT012 - Pesquisar Descrição', () => {
        cy.get('input.ng-untouched').clear().type('Verstappen')
        cy.get('.row > .actions > :nth-child(1)').click()
        cy.get('tbody').should('not.exist')
        cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
    })

    it('CT013 - Botão Limpar', () => {
        cy.get('input.ng-untouched').clear().type('Verstappen')
        cy.get('.row > .actions > :nth-child(1)').click()
        cy.get('.actions > :nth-child(2)').click()
        cy.get('tbody').find('tr').should('have.length.at.most', 10)
    })
})