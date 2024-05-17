/// <reference types="Cypress" />

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
        addUser.should('be.visible').and('not.be.disabled')
        addUser.click()
        cy.url().should('contain', 'administracao/usuarios/form')
    })

    it('CT002 - Teste filtro nome/campo alfanumérico', () => {
        const searchInput = cy.get('input[placeholder="Nome de Usuário"]')
        searchInput.should('be.visible').and('not.be.disabled')
        searchInput.type('Rubens Barrichello')
        searchInput.should('have.value', 'Rubens Barrichello')
    })

    it('CT003 - Teste filtro nome/tamanho do campo', () => {
        const searchInput = cy.get('input[placeholder="Nome de Usuário"]')
        searchInput.type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue vulputate pharetra. Sed est lectus, commodo at e')
        searchInput.should(value => expect(value.val().length).to.be.equal(100))
    })

    it('CT004 - Teste lista de registros', () => {
        const registros = cy.get('tbody').find('tr')
        registros.should('have.length', 10)
        registros.each($row => {
            cy.wrap($row).find('td')
                .then(($tds) => {
                    expect($tds, 'Quantidade de campos na linha deve ser 5').to.have.length(5)
                })
        })
    })

    it('CT005 - CT005-Teste filtros/Limpar', () => {
        const searchInput = cy.get('input[placeholder="Nome de Usuário"]')
        searchInput.type('nauifnauifanuifpanfuipanaçanoçal')
        cy.get('button.btn.btn-primary').click()
        cy.wait(500)
        cy.get('tbody tr').should('have.length', 0)
        cy.get('div.cluster-filter-select').find('span:first').click()
        cy.get('tbody tr').should('have.length', 10)
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
})