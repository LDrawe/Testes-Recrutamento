/// <reference types="Cypress" />
import 'cypress-if'
import { randomBytes } from 'crypto'

describe('Suit Test Departamentos - Visualizar e Editar (US 67054)', () => {
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

    it('CT001 - Exibir departamentos', () => {
        cy.get('tbody tr').if().then(rows => {
            expect(rows.length).to.be.at.most(10)
            for (let i = 0; i < rows.length; i++) {
                let linha = cy.wrap(rows[i])
                linha.get('td.description').should('be.visible').and('not.be.empty')
                linha.get(`:nth-child(${i + 1}) > :nth-child(4) > label`).invoke('text').then(text => {
                    expect(text).to.match(/^(Ativo|Inativo)[^\w]*$/)
                })
            }
        }).else().then(() => cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado'))
    })

    it('[Bug] CT002 - Visualizar departamento', () => {
        cy.intercept('/departamento/*').as('departamento')
        cy.get('tbody tr').eq(1).click()
        cy.wait('@departamento')
        cy.url().should('contain', 'setup-da-empresa/departamentos/form')
        cy.get('input[type="checkbox"]').should('exist').and('be.disabled')
        cy.get('span.slider').should('be.visible')
        cy.get('#nomeDepartamento').should('be.visible').and('be.disabled').and('have.attr', 'maxlength', 100)
        cy.get('#abreviacao').should('be.visible').and('be.disabled').and('have.attr', 'maxlength', 2)
        cy.get('.ng-input > input').should('be.visible').and('be.disabled').and('have.attr', 'maxlength', 100)
        cy.get('#emailResponsavel').should('be.visible').and('be.disabled')

        cy.get('button.primary').should('be.visible').and('be.enabled')
        cy.get('button.secondary').should('be.visible').and('be.enabled')
    })

    it('CT003 - Editar departamento', () => {
        cy.intercept('/departamento/*').as('departamento')
        cy.get('tbody tr').eq(5).click()
        cy.wait('@departamento')
        cy.get('button.primary').click()
        cy.get('input:not([id="emailResponsavel"])').each(input => {
            expect(input).to.be.enabled
        })
    })

    it('CT004 - Remover dados', () => {
        cy.intercept('GET', '/departamento/*').as('departamento')
        cy.intercept('GET', '/usuario/usuario-email').as('email')
        cy.get('tbody tr').eq(5).click()
        cy.get('button.primary').click()
        cy.wait(['@departamento', '@email'])
        cy.get('input#nomeDepartamento').clear().blur()
        cy.get('input#abreviacao').clear().blur()
        cy.get('.col-8 > :nth-child(3)').should('be.visible').invoke('text').then(text => {
            expect(text.replace('kr', '').replace('\xa0', '').trim()).to.equal('Campo de preenchimento obrigatório')
        })
        cy.get('.col-3 > :nth-child(3)').should('be.visible').invoke('text').then(text => {
            expect(text.trim()).to.equal('*Campo de preenchimento obrigatório')
        })
    })

    it('CT005 - Responsável pelo Departamento', () => {
        cy.intercept('/departamento/*').as('departamento')
        cy.get('tbody tr').eq(5).click()
        cy.wait('@departamento')
        cy.get('button.primary').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('div.ng-option:nth(3)').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('#emailResponsavel').should('contain.value', '@')
    })

    it('CT006 - Apagar Responsável', () => {
        cy.get('tbody tr').eq(5).click()
        cy.get('button.primary').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('div.ng-option:nth(3)').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('.ng-clear-wrapper').click()
        cy.get('.ng-input > input').should('be.empty')
        cy.get('#emailResponsavel').should('be.empty')
    })

    it('CT007 - Voltar sem editar', () => {
        cy.get('tbody tr').eq(5).click()
        cy.get('button.secondary').click()
        cy.url().should('not.contain', '/form')
    })

    it('CT008 - Voltar após clicar em editar', () => {
        cy.get('tbody tr').eq(5).click()
        cy.get('button.primary').click()
        cy.get('button.secondary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Confirmar')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Deseja sair SEM salvar as alterações feitas?')
        cy.get('.swal2-cancel').click()
        cy.get('button.secondary').click()
        cy.get('.swal2-confirm').click()
        cy.url().should('not.contain', '/form')
    })

    it('CT008 - Salvar alterações', () => {
        cy.get('tbody tr').eq(5).click()
        cy.get('button.primary').click()
        cy.get('span.slider').click()
        cy.get('#nomeDepartamento').clear().type(randomBytes(3).toString('hex'))
        cy.get('#abreviacao').clear().type(randomBytes(2).toString('hex'))
        cy.get('.ng-arrow-wrapper').click()
        cy.get(`div.ng-option:nth(1)`).click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('button.primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Registro salvo com sucesso')
        cy.get('.swal2-confirm').click()
        cy.url().should('not.contain', '/form')
    })
})

