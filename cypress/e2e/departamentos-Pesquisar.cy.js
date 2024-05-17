/// <reference types="Cypress" />

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
        const searchBox = cy.get('.grow > .ng-valid')

        // searchBox.should('be.visible').and('be.enabled').and('have.attr', 'maxlength', 100)
        const searchInput = 'Itix Gaming'
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
                console.log(rowTexts)
                expect(flag).to.be.true
            }
        })
    })

    it('CT002 - Filtrar por responsável', () => {
        const arrow = cy.get('div.ng-select-container:first').find('span:first')
        arrow.click()
        cy.get('div.ng-dropdown-panel-items').should('be.visible')
        const responsavel = cy.get('div.ng-option:nth(9)')
        responsavel.click()
        arrow.click()
        cy.get('div.item-multiselect').should('be.visible')
        cy.get('button.primary').click()
        cy.wait(1000)
        cy.get('tbody').find('tr').each(row => {
            cy.wrap(row).find('td:nth(1)')
                .then((tds) => {
                    responsavel.invoke('text').then(value => {
                        expect(tds.text().trim(), 'Responsavel to be filtered').to.equal(value)
                    })
                })
        })
    })

    it('CT003- Filtrar por status', () => {
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

    it('CT004 - Botão Limpar', () => {
        cy.get('input[placeholder="Ex: Recursos Humanos"]').clear().type('MAX VERSTAPPEN')
        cy.get('button.primary').click()
        cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
        cy.get('div.cluster-filter-select').find('span:first').click()
        cy.get('tbody').find('tr').should('have.length', 10)
    })
})