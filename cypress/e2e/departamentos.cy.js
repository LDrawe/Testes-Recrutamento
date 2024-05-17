/// <reference types="Cypress" />

import { randomBytes } from 'crypto'

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

describe('Test Case Departamentos - Visualizar e Editar - US 67054', () => {
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
        cy.get('tbody tr')
            .then(rows => {
                if (rows.length === 0) {
                    cy.get('h5').should('be.visible').and('have.text', 'Nenhum resultado encontrado')
                } else {
                    expect(rows.length).to.be.at.most(10)
                    for (let i = 0; i < rows.length; i++) {
                        let linha = cy.wrap(rows[i])
                        linha.get('td.description').should('be.visible').and('not.be.empty')
                        linha.get(`:nth-child(${i + 1}) > :nth-child(4) > label`).invoke('text').then(text => {
                            expect(text).to.match(/^(Ativo|Inativo)[^\w]*$/)
                        })
                    }
                }
            })
    })

    it('CT002 - Visualizar departamento', () => {
        cy.get('tbody tr').eq(0).click()
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
        cy.get('tbody tr').eq(0).click()
        cy.get('button.primary').click()
        cy.get('input:not([id="emailResponsavel"])').each(input => {
            expect(input).to.be.enabled
        })
    })

    it('CT004 - Remover dados', () => {
        cy.get('tbody tr').eq(0).click()
        cy.get('button.primary').click()
        cy.get('#nomeDepartamento').focus().clear().blur()
        cy.get('.col-8 > :nth-child(3)').should('be.visible').invoke('text').then(text => {
            expect(text.replace('kr', '').replace('\xa0', '').trim()).to.equal('Campo de preenchimento obrigatório')
        })
        cy.get('#abreviacao').focus().clear().blur()
        cy.get('.col-3 > :nth-child(3)').should('be.visible').invoke('text').then(text => {
            expect(text.replace('kr', '').replace('\xa0', '').trim()).to.equal('*Campo de preenchimento obrigatório')
        })
    })

    it('CT005 - Responsável pelo Departamento', () => {
        cy.get('tbody tr').eq(0).click()
        cy.get('button.primary').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('div.ng-option:nth(3)').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('#emailResponsavel').should('contain.value', '@')
    })

    it('CT006 - Apagar Responsável', () => {
        cy.get('tbody tr').eq(0).click()
        cy.get('button.primary').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('div.ng-option:nth(3)').click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('.ng-clear-wrapper').click()
        cy.get('.ng-input > input').should('be.empty')
        cy.get('#emailResponsavel').should('be.empty')
    })

    it('CT007 - Voltar sem editar', () => {
        cy.get('tbody tr').eq(0).click()
        cy.get('button.secondary').click()
        cy.url().should('not.contain', '/form')
    })

    it('CT008 - Voltar após clicar em editar', () => {
        cy.get('tbody tr').eq(0).click()
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
        cy.get('tbody tr').eq(0).click()
        cy.get('button.primary').click()
        cy.get('span.slider').click()
        cy.get('#nomeDepartamento').clear().type(randomBytes(3).toString('hex'))
        cy.get('#abreviacao').clear().type(randomBytes(2).toString('hex'))
        cy.get('.ng-arrow-wrapper').click()
        cy.get(`div.ng-option:nth(${Math.floor(Math.random() * 10)})`).click()
        cy.get('.ng-arrow-wrapper').click()
        cy.get('button.primary').click()
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Registro salvo com sucesso')
        cy.get('.swal2-confirm').click()
        cy.url().should('not.contain', '/form')
    })
})

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

    it('CT005 - Nome e Abreviação válida', () => {
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