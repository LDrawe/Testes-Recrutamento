/// <reference types="Cypress" />
import 'cypress-if'
import { randomBytes } from 'crypto'

describe('US 70248 - CT Cadastro de Usuários - Pesquisar', () => {
    before(() => {
        cy.clearCookies()
        cy.getCookies().should('be.empty')
    })

    beforeEach(() => {
        cy.visit('/')
        cy.title().should('contain', 'Recrutamento')
        cy.get('li > div.wrapper').eq(3).click()
        cy.contains('ul.sub-menu > li:nth-child(3)', 'Usuários').click()
        cy.url().should('contain', 'administracao/usuarios')
    })

    it('CT001 - Test Botão Adicionar Usuário', () => {
        const addUser = cy.get('button.secondary')
        addUser.should('be.visible').and('be.enabled')
        addUser.click()
        cy.url().should('contain', 'administracao/usuarios/form')
    })

    it('CT002 - Teste filtro nome/campo alfanumérico', () => {
        const searchInput = cy.get('input[placeholder="Nome de Usuário"]')
        searchInput.should('be.visible').and('be.enabled')
        searchInput.type('Rubens Barrichello')
        searchInput.should('have.value', 'Rubens Barrichello')
    })

    it('CT003 - Teste filtro nome/tamanho do campo', () => {
        const searchInput = cy.get('input[placeholder="Nome de Usuário"]')
        searchInput.type(randomBytes(50).toString('hex'))
        searchInput.should(value => expect(value.val().length).to.be.equal(100)).and('have.attr', 'maxlength', 100)
    })

    it('CT004 - Teste lista de registros', () => {
        const registros = cy.get('tbody tr')
        registros.should('have.length', 10)
        registros.each($row => {
            cy.wrap($row).find('td')
                .then(($tds) => {
                    expect($tds, 'Quantidade de campos na linha deve ser 5').to.have.length(5)
                })
        })
    })

    it('CT005 - Teste filtros/Limpar', () => {
        const searchBox = cy.get('input[placeholder="Nome de Usuário"]')
        searchBox.type(randomBytes(6).toString('hex'))
        for (let i = 0; i < 3; i++) {
            let arrow = cy.get(`div.ng-select-container:nth(${i}) span:first`)
            arrow.click()
            cy.get('div.ng-option:nth(2)').click()
            arrow.click()
        }
        cy.get('button.btn-primary').click()
        cy.get('tbody tr').should('have.length', 0)
        cy.get('div.cluster-filter-select span:first').click()
        cy.get('tbody tr').should('have.length', 10)
        searchBox.should('have.value', '')
        cy.get('div.item-multiselect').should('not.exist')
    })

    it('CT006 - Teste lista/visualizar', () => {
        cy.get('tbody tr:first').click()
        cy.url().should('contain', '/usuarios/form?vid=')
    })

    it('CT007 - Teste listbox perfil', () => {
        const arrow = cy.get('div.ng-select-container:first').find('span:first')
        arrow.click()
        cy.get('div.ng-dropdown-panel-items').should('be.visible')
        cy.get('div.ng-option:nth(1)').click()
        arrow.click()
        cy.get('div.item-multiselect').should('be.visible')
    })

    it('CT008 - Teste listbox cargo', () => {
        const arrow = cy.get('div.ng-select-container:nth(1)').find('span:first')
        arrow.click()
        cy.get('div.ng-dropdown-panel-items').should('be.visible')
        cy.get('div.ng-option:nth(1)').click()
        arrow.click()
        cy.get('div.item-multiselect').should('be.visible')
    })

    it('CT009 - Teste listbox departamento', () => {
        const arrow = cy.get('div.ng-select-container:nth(2)').find('span:first')
        arrow.click()
        cy.get('div.ng-dropdown-panel-items').should('be.visible')
        const selectItem = cy.get('div.ng-option:nth(1)')
        selectItem.click()
        arrow.click()
        selectItem.invoke('text').then(text => {
            cy.get('div.item-multiselect').should('be.visible').and('contain.text', text);
        });
    })

    it('CT010- Teste Pesquisar ', () => {
        cy.get('span.ng-arrow-wrapper').each((arrow, categoryIndex) => {
            cy.wrap(arrow).click()
            cy.get('div.ng-option').then(({ length }) => {
                cy.get('div.ng-dropdown-panel-items').should('be.visible')
                cy.wrap(arrow).click()
                for (let i = 0; i < length; i++) {
                    cy.wrap(arrow).click()
                    const option = cy.get(`div.ng-option:nth(${i})`)
                    option.click()
                    let optionText = ''
                    option.invoke('text').then((val) => {
                        optionText = val
                    })
                    cy.wrap(arrow).click()
                    const multiselect = cy.get('div.item-multiselect')
                    multiselect.should('be.visible').and('include.text', optionText)
                    cy.get('button.btn-primary').click()
                    cy.wait(300)
                    cy.get('tbody').if().then(() => {
                        cy.get('tbody tr').each(() => {
                            cy.get(`td:nth(${categoryIndex + 1})`).each(name => {
                                expect(name.text().trim()).to.equal(optionText)
                            })
                        })
                    }).else().get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
                    cy.get('div.item-multiselect span.icon-multiselect').click()
                    multiselect.should('not.exist')
                }
            })
        })
    })
    it('CT011 - Teste nenhum resultado encontrado', () => {
        cy.get('input[placeholder="Nome de Usuário"]').type(randomBytes(5).toString('hex'))
        cy.get('button.btn-primary').click()
        cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
    })
})