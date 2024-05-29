/// <reference types="Cypress" />
import 'cypress-if'
import { randomBytes } from 'crypto'

describe('Suit Test Candidato - Cadastrar', () => {
    before(() => {
        cy.clearCookies()
        cy.getCookies().should('be.empty')
    })

    beforeEach(() => {
        cy.visit('/')
        cy.title().should('contain', 'Recrutamento')
        cy.get('li > div.wrapper').eq(1).click()
        cy.contains('ul.sub-menu > li:nth-child(1)', 'Candidatos').click()
        cy.get('a').click()
        cy.url().should('contain', '/banco-de-talentos/candidatos')
    })

    it('TC001- Verificar Pagina de adicionar Candidato', () => {
        cy.get('.rounded-circle').should('be.visible')
        cy.get('label.edit-profile-icon').should('be.visible')
        cy.get('#profile-image-input').should('be.enabled')
        cy.get('span.h1').should('be.visible').and('have.text', 'Clique para editar o nome').click()
        cy.get('.input-style').should('be.visible').and('be.enabled')
        cy.get('span.h6').should('be.visible').and('have.text', 'Clique para editar o email').click()
        cy.get('.col-5 > .input-style').should('be.visible').and('be.enabled').and('have.attr', 'type', 'email')
        cy.get(':nth-child(3) > .btn').should('be.visible').and('be.enabled').and('include.text', 'Anexar Currículo')
        cy.get('.justify-content-between > .col-3 > .btn').should('be.visible').and('be.enabled').and('include.text', 'Voltar')
        cy.get('#cargo > .ng-select-container').should('be.visible')
        cy.get('#cpf').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o CPF').and('have.attr', 'mask', '000.000.000-00')
        cy.get('#areaTrabalho').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe a área de trabalho')
        cy.get('#telefoneCelular').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', '(99)99999-9999').and('have.attr', 'mask', '(00)00000-0000')
        cy.get('#cep').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o CEP').and('have.attr', 'mask', '00000-000')
        cy.get('#endereco').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o endereço')
        cy.get('#bairro').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o bairro')
        cy.get('#complemento').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o complemento')
        cy.get('#referencia').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe a referência')
        cy.get('#cidade').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe a cidade')
        cy.get('#estado').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o estado')
        cy.get('#pais').should('be.visible').and('be.enabled').and('have.attr', 'placeholder', 'Informe o país')
        cy.get('#hardSkills > .custom > .ng-select-container').should('be.visible')
        cy.get('#softSkills > .custom > .ng-select-container').should('be.visible')
        cy.get('.col-2 > .btn').should('be.visible').and('be.enabled').and('include.text', 'Continuar')
    })

    it.skip('TC002- Validação tamanho da Imagem', () => {
        cy.get('#profile-image-input').selectFile('./cypress/downloads/200.png', { force: true })
        cy.get('img.rounded-circle').should('not.exist')
        cy.get('.clear-profile-icon').if().click()
        cy.get('#profile-image-input').selectFile('./cypress/downloads/1300.png', { force: true })
        cy.get('img.rounded-circle').should('not.exist')
    })

    it('TC003-Validação botão remover imagem', () => {
        cy.get('#profile-image-input').selectFile('./cypress/downloads/200.png', { force: true })
        cy.get('.clear-profile-icon').click().should('not.exist')
        cy.get('img.rounded-circle').should('have.attr', 'src', 'assets/images/User_03.png')
    })

    it('TC004- Validação Campo Nome vazio', () => {
        cy.get('span.h1').click()
        cy.get('.input-style').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', 'Campo de preenchimento obrigatório')
    })

    it.skip('TC005-Validação Formato da Imagem', () => {
        // cy.get('#profile-image-input').selectFile('./cypress/downloads/github.svg', { force: true })
        // cy.get('img.rounded-circle').should('not.exist')
        cy.get('#profile-image-input').selectFile('./cypress/downloads/lion.webp')
        cy.get('img.rounded-circle').should('not.exist')
    })

    it('TC006-Validação Nome Numero de Caracteres Máximo', () => {
        cy.get('span.h1').click()
        cy.get('.input-style').type(randomBytes(60).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC007-Validação E-mail Numero de Caracteres Máximo', () => {
        cy.get('span.h6').click()
        cy.get('.col-5 > .input-style').type(randomBytes(60).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC008-Validação Campo e-mail invalido', () => {
        cy.get('span.h6').click()
        cy.get('.col-5 > .input-style').type(randomBytes(6).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Email inválido ')
    })

    it('TC009-Validação campo Cargo vazio', () => {
        cy.get('#cargo > .ng-select-container').click()
        cy.get('body').click()
        cy.get('.p-0 > :nth-child(2) > .col-5 > .error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC010-Validação Campo Cargo Item não encontrado', () => {
        const text = randomBytes(4).toString('hex')
        cy.get('#cargo > .ng-select-container').click().type(text)
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
    })

    // it.only('TC011-Validação Campo Cargo Item encontrado', () => {
    //     cy.get('#cargo > .ng-select-container > .ng-value-container > .ng-input > input').click().type('Estagiário')
    //     const options = cy.get('span.ng-option-label')
    //     let flag = false
    //     for (const text in options) {
    //         if (text !== 'Estagiário') continue
    //         flag = true
    //     }
    //     expect(flag).to.be.true
    // })

    it('TC012-Validação campo CPF inserir Letras', () => {
        cy.get('#cpf').type('89415600785045').should('not.contain', 'a').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' CPF inválido ')
    })

    it('TC013-Validação campo CPF vazio', () => {
        cy.get('#cpf').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC014-Validação campo CPF invalido', () => {
        cy.get('#cpf').type('89415600785045').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' CPF inválido ')
    })

    it('TC015-Validação Área de Trabalho máximo de caracteres', () => {
        cy.get('#areaTrabalho').type(randomBytes(60).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC016-Validação Telefone Celular vazio', () => {
        cy.get('#telefoneCelular').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC017-Validação Telefone Celular numero inválido', () => {
        cy.get('#telefoneCelular').type('17884562190').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Telefone inválido ')
    })

    it('TC018-Validação CEP Vazio', () => {
        cy.get('#cep').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC019-Validação CEP menos de 8 caracteres', () => {
        cy.get('#cep').type('1234567').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo não atingiu o tamanho mínimo de caracteres ')
    })

    it('TC020-Validação CEP Encontrado', () => {
        cy.get('#cep').type('29500000').blur()
        cy.get('#cidade').should('have.value', 'Alegre')
        cy.get('#estado').should('have.value', 'ES')
        cy.get('#pais').should('have.value', 'Brasil')
    })

    it('TC021- Validação "Endereço" Vazio', () => {
        cy.get('#endereco').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC022- Validação "Bairro" Vazio', () => {
        cy.get('#bairro').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC023-Validação Campo "Complemento" mais de 160 caracteres', () => {
        cy.get('#complemento').type(randomBytes(90).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(160)
        })
    })

    it('TC024- Validação Campo "Complemento" Vazio', () => {
        cy.get('#complemento').focus().blur()
        cy.get('.error-msg').should('not.exist')
    })

    it('TC025- Validação "Referência"', () => {
        cy.get('#referencia').focus().blur()
        cy.get('.error-msg').should('not.exist')
    })

    it('TC026-Validação Campo "Referência" mais de 160 caracteres', () => {
        cy.get('#referencia').type(randomBytes(90).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(160)
        })
    })

    it('TC027- Validação Campo "Cidade" Vazio', () => {
        cy.get('#cidade').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC028- Validação Campo "Estado" Vazio', () => {
        cy.get('#estado').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC029- Validação Campo "Estado" mais de 2 caracteres', () => {
        cy.get('#estado').type('Espirito Santo').invoke('val').then(val => {
            expect(val.length).to.be.at.most(2)
        })
    })

    it('TC030- Validação Campo "País" Vazio', () => {
        cy.get('#pais').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC031- Validação Campo "Hard Skill" e "Soft Skill" Vazios', () => {
        cy.get('#hardSkills > .custom > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('#softSkills > .custom > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('.error-msg').should('not.exist')
    })

    it.only('TC032- Validação "Hard Skill" e "Soft Skill" item não encontrado', () => {
        const hardSkills = cy.get('#hardSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        hardSkills.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        hardSkills.click().invoke('val').then(val => expect(val).to.be.empty)
        const softSkills = cy.get('#softSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        softSkills.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        softSkills.click().invoke('val').then(val => expect(val).to.be.empty)

    })
})