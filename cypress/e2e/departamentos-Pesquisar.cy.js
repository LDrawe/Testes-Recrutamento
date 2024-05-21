/// <reference types="Cypress" />
import 'cypress-if'

describe('US 61433 - Test Case Departamentos - Pesquisar', () => {
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

    it('CT001 - Pesquisar texto', () => {
        const searchButton = cy.get('button.primary')
        searchButton.should('be.visible').and('be.enabled').and('have.text', 'Pesquisar')
        const searchBox = cy.get('input[placeholder="Ex: Recursos Humanos"]')
        const searchInput = 'Itix Gaming'
        searchBox.should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        searchBox.clear().type(searchInput)
        searchBox.should('have.value', searchInput)
        searchButton.click()

        cy.wait(1500)
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
        cy.wait(500)
        const arrow = cy.get('div.ng-select-container:first span:first')
        arrow.click()
        cy.get('div.ng-dropdown-panel-items').should('be.visible')
        cy.get('div.ng-option').then(({ length }) => {
            arrow.click()
            for (let i = 0; i < length; i++) {
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
                cy.wait(500)
                cy.get('tbody tr').if().then(() => {
                    cy.get('td.description + td').each(name => {
                        expect(name.text().trim()).to.equal(responsavelText)
                    })
                }).else().get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
                cy.get('div.item-multiselect span.icon-multiselect').click()
                multiselect.should('not.exist')
            }
        })
    })

    it('CT003- Um ou mais filtros', () => {
        const arrow = cy.get('div.ng-select-container:first').find('span:first')
        arrow.click()
        cy.get('div.ng-option:nth(6)').click()
        cy.get('div.ng-option:nth(12)').click()
        arrow.click()
        cy.get('button.primary').click()
        cy.wait(1000)
        cy.get('td.description + td').each(responsible => {
            expect(responsible.text().trim()).to.be.oneOf(['Marcos Juan Thiago Cardoso', 'Conjunto Conjunto Residencial 47A'])
        })
    })

    it('CT004- Filtrar por status', () => {
        const states = ['Ativo', 'Inativo']

        for (let i = 0; i < states.length; i++) {
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
            cy.wait(1500)
            cy.get('tbody tr > td:nth(3)').each(td => {
                expect(td.text().trim()).to.equal(states[i])
            })
        }
    })

    it('CT005 - Paginação', () => {
        const page1 = []
        cy.get('td.description').each(id => page1.push(id.text()))
        cy.get('.ci-chevron_right').click()
        cy.wait(1000)
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