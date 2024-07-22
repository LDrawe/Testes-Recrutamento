/// <reference types="Cypress" />
import 'cypress-if'

describe('Suit Test Departamentos - Pesquisar', () => {

    beforeEach(() => {
        cy.authenticate()
        cy.intercept('/departamento/search*').as('pesquisa')
        cy.intercept('/usuario/multiselect-usuarios').as('select')
        cy.visit('/setup-da-empresa/departamentos', { failOnStatusCode: false })
        cy.url().should('contain', 'setup-da-empresa/departamentos')
    })

    it('CT001 - Pesquisar texto', () => {
        const searchButton = cy.get('button.primary')
        searchButton.should('be.visible').and('be.enabled').and('have.text', 'Pesquisar')
        const searchBox = cy.get('input[placeholder="Ex: Recursos Humanos"]')
        const searchInput = 'Itix Gaming'
        searchBox.should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        searchBox.clear().type(searchInput)
        searchBox.should('have.value', searchInput)
        searchButton.click()

        cy.wait('@pesquisa')
        cy.get('tbody tr').then(rows => {
            if (rows.length === 0) {
                cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
            } else {
                const rowTexts = []
                rows.find('td.description').each((i, td) => {
                    rowTexts.push(td.textContent.trim())
                })
                let flag = false
                for (const text of rowTexts) {
                    if (!text.toLowerCase().includes(searchInput.toLowerCase())) continue
                    flag = true
                }
                expect(flag).to.be.true
            }
        })
    })

    it('CT002 - Filtrar por responsável', () => {
        cy.wait(['@pesquisa', '@select'])
        const arrow = cy.get('div.ng-select-container:first span:first')
        arrow.click()
        cy.get('div.ng-dropdown-panel-items').should('be.visible')
        cy.get('div.ng-option').then(({ length }) => {
            arrow.click()
            for (let i = 0; i < length; i++) {
                cy.intercept('/departamento/search*').as('pesquisa')
                arrow.click()
                let responsavel = cy.get(`div.ng-option:nth(${i})`)
                responsavel.click()
                let responsavelText = ''
                responsavel.invoke('text').then((val) => {
                    responsavelText = val
                })
                let multiselect = cy.get('div.item-multiselect')
                multiselect.should('be.visible').and('include.text', responsavelText)
                cy.get('button.primary').click()
                cy.wait('@pesquisa')
                cy.wait(1000)
                cy.get('tbody tr').if().then(() => {
                    cy.get('td.description + td').each(name => {
                        expect(name.text().trim()).to.equal(responsavelText)
                    })
                }).else().get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
                cy.get('header > :nth-child(2) > span').click()
                cy.get('.item-multiselect').should('not.exist')
            }
        })
    })

    it('CT003- Um ou mais filtros', () => {
        cy.wait('@select').then(({ response }) => {
            for (let i = 0; i < response.body.length; i++) {
                const arrow = cy.get('#responsavel > .custom > .ng-select-container > .ng-arrow-wrapper')
                arrow.click()
                const options = []
                const random1 = Math.floor(Math.random() * response.body.length)
                let random2 = Math.floor(Math.random() * response.body.length)

                while (random1 == random2) {
                    random2 = Math.floor(Math.random() * response.body.length)
                }
                const option1 = cy.get(`div.ng-option:nth(${random1})`)
                const option2 = cy.get(`div.ng-option:nth(${random2})`)
                option1.click()
                option2.click()
                option1.invoke('text').then(val => options.push(val.toString()))
                option2.invoke('text').then(val => options.push(val.toString()))
                arrow.click()
                cy.get('button.primary').click()
                cy.wait('@pesquisa')
                cy.wait(1000)
                cy.get('td.description.text-start + td').if().each(responsible => {
                    expect(responsible.text().trim()).to.be.oneOf(options)
                })
                cy.get('header > :nth-child(2) > span').click()
            }
        })
    })

    it('CT004- Filtrar por status', () => {
        const states = ['Ativo', 'Inativo']

        for (let i = 0; i < states.length; i++) {
            cy.intercept('/departamento/search*').as('pesquisa')
            cy.get('header > :nth-child(2) > span').click()
            const arrow = cy.get('div.ng-select-container:nth(1)').find('span:first')
            arrow.click()
            cy.get('div.ng-dropdown-panel-items').should('be.visible')
            const option = cy.get(`div.ng-option:nth(${i})`)
            option.click()
            arrow.click()
            option.invoke('text').then(text => {
                cy.get('div.item-multiselect').should('be.visible').and('contain.text', text)
            })
            cy.get('button.primary').click()
            cy.wait('@pesquisa')
            cy.wait(300)
            cy.get('tbody tr > td:nth(3)').each(td => {
                expect(td.text().trim()).to.equal(states[i])
            })
        }
    })

    it('CT005 - Paginação', () => {
        const page1 = []
        cy.get('td.description').each(id => page1.push(id.text()))
        cy.get('.ci-chevron_right').click()
        cy.get('td.description').each(id => {
            expect(page1.includes(id)).to.be.false
        })
    })

    it('CT006 - Botão Limpar', () => {
        cy.get('input[placeholder="Ex: Recursos Humanos"]').clear().type('MAX VERSTAPPEN')
        cy.get('button.primary').click()
        cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
        cy.get('div.cluster-filter-select').find('span:first').click()
        cy.get('tbody').find('tr').should('have.length', 10)
    })
})