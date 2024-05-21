/// <reference types="Cypress" />
import { randomBytes } from 'crypto'

describe('Test Case Vagas Afirmativas - Pesquisar e Editar - US 61449', () => {
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

    it('CT001 - Exibir vagas', () => {
        const table = cy.get('tbody').find('tr')
        table.should('have.length.at.most', 10)
        table.then(rows => {
            if (rows.length === 0) {
                cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
            }
        })

        table.each(td => {
            expect(td['0'].children[0].textContent).to.have.length.greaterThan(0)
            expect(td['0'].children[1].textContent.trim().toLowerCase()).to.include('ativo')
            expect(td['0'].children[2].textContent).to.equal('Editar')
        })
    })

    it('CT002 - Editar Vaga', () => {
        cy.get(':nth-child(1) > .rounded-end > .text-gray').click()
        cy.get('#vagaInput').should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        cy.get('#check').should('be.visible').and('be.enabled')
        cy.get('.btn-text').should('be.visible').and('be.enabled').and('have.text', 'Voltar')
        cy.get('.btn-primary').should('be.visible').and('be.enabled').and('have.text', 'Salvar')
    })

    it('CT003 - Removendo descrição da Vaga', () => {
        cy.get(':nth-child(1) > .rounded-end > .text-gray').click()
        cy.get('#vagaInput').clear().blur()
        cy.get('.btn-primary').should('be.visible').and('not.be.enabled')
        cy.get(':nth-child(3) > .text-danger').should('be.visible').and('have.text', 'O campo Vaga Afirmativa não pode estar vazio!')
    })

    it('CT004 - Editando descriçao da vaga', () => {
        cy.get(':nth-child(1) > .rounded-end > .text-gray').click()
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
        cy.get(':nth-child(1) > .rounded-end > .text-gray').click()
        cy.get('#vagaInput').clear().type('Teste')
        cy.get('.btn-primary').click()
        cy.get('span.text-danger').should('be.visible').and('have.text', '**Já existe um registro com essa descrição')
    })

    it('CT006 - Editar Vaga (Nome novo)', () => {
        cy.get(':nth-child(1) > .rounded-end > .text-gray').click()
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

        cy.get('input.inpunt-register').should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        cy.get('.btn-secondary').should('be.visible').and('be.enabled')
        cy.get('.btn-primary').should('be.visible').and('not.be.enabled')
    })

    it('CT008 - Removendo descriçao da nova vaga', () => {
        cy.get('button.secondary').click()

        cy.get('input.inpunt-register').clear().blur()
        cy.get('div.form-group > span').should('be.visible').and('contain.text', '*Campo de preenchimento obrigatório')
        cy.get('.btn-primary').should('be.visible').and('not.be.enabled')
    })

    it('CT009 - Editando descriçao da nova vaga', () => {
        cy.get('button.secondary').click()

        cy.get('input.inpunt-register').clear().type('HJBjhBJHAAK')
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

        cy.get('input.inpunt-register').clear().type('Teste')
        cy.get('.btn-primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Registro já existe!')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Já existe registro com essa descrição')
        cy.get('.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('div.swal2-modal').should('not.exist')
    })

    it.skip('CT011 - Nova Vaga (Nome novo)', () => {
        cy.get('button.secondary').click()

        cy.get('input.inpunt-register').clear().type(randomBytes(8).toString('hex'))
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