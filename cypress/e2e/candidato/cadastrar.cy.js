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
        cy.get('.ci-group').click()
        cy.contains('ul.sub-menu > li:nth-child(1)', 'Candidatos').click()
        cy.get('.justify-content-end > :nth-child(2)').click()
        cy.url().should('contain', '/banco-de-talentos/candidatos/form')
        cy.intercept('/consulta-cep/completed/29500000').as('cep')
    })

    it('TC001 - Verificar Pagina de adicionar Candidato', () => {
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

    it.skip('TC002 - Validação tamanho da Imagem', () => {
        cy.get('#profile-image-input').selectFile('./cypress/downloads/200.png', { force: true })
        cy.get('img.rounded-circle').should('not.exist')
        cy.get('.clear-profile-icon').if().click()
        cy.get('#profile-image-input').selectFile('./cypress/downloads/1300.png', { force: true })
        cy.get('img.rounded-circle').should('not.exist')
    })

    it('TC003 - Validação botão remover imagem', () => {
        cy.get('#profile-image-input').selectFile('./cypress/downloads/200.png', { force: true })
        cy.get('.clear-profile-icon').click().should('not.exist')
        cy.get('img.rounded-circle').should('have.attr', 'src', 'assets/images/User_03.png')
    })

    it('TC004 - Validação Campo Nome vazio', () => {
        cy.get('span.h1').click()
        cy.get('.input-style').focus().blur()
        cy.get('span.h1').click()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it.skip('TC005 - Validação Formato da Imagem', () => {
        // cy.get('#profile-image-input').selectFile('./cypress/downloads/github.svg', { force: true })
        // cy.get('img.rounded-circle').should('not.exist')
        cy.get('#profile-image-input').selectFile('./cypress/downloads/lion.webp')
        cy.get('img.rounded-circle').should('not.exist')
    })

    it('TC006 - Validação Nome Numero de Caracteres Máximo', () => {
        cy.get('span.h1').click()
        cy.get('.input-style').type(randomBytes(60).toString('hex')).blur()
        cy.get('div.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC007 - Validação E-mail Numero de Caracteres Máximo', () => {
        cy.get('span.h6').click()
        cy.get('.col-5 > .input-style').type(randomBytes(60).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC008 - Validação Campo e-mail invalido', () => {
        cy.get('span.h6').click()
        cy.get('.col-5 > .input-style').type(randomBytes(6).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Email inválido ')
    })

    it('TC009 - Validação campo Cargo vazio', () => {
        cy.get('#cargo > .ng-select-container').click()
        cy.get('body').click()
        cy.get('.p-0 > :nth-child(2) > .col-5 > .error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC010 - Validação Campo Cargo Item não encontrado', () => {
        const text = randomBytes(4).toString('hex')
        cy.get('#cargo > .ng-select-container').click().type(text)
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
    })

    it('TC011 - Validação Campo Cargo Item encontrado', () => {
        cy.get('#cargo').click().type('Estagiário')
        const option = cy.get('.ng-option')
        option.should('have.text', 'Estagiário')
    })

    it('TC012 - Validação campo CPF inserir Letras', () => {
        cy.get('#cpf').type('89415600785045').should('not.contain', 'a').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' CPF inválido ')
    })

    it('TC013 - Validação campo CPF vazio', () => {
        cy.get('#cpf').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC014 - Validação campo CPF invalido', () => {
        cy.get('#cpf').type('89415600785045').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' CPF inválido ')
    })

    it('[Bug] TC015 - Validação Área de Trabalho máximo de caracteres', () => {
        cy.get('input[placeholder="Informe a área de trabalho"]').type(randomBytes(60).toString('hex')).blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC016 - Validação Telefone Celular vazio', () => {
        cy.get('#telefoneCelular').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC017 - Validação Telefone Celular numero inválido', () => {
        cy.get('#telefoneCelular').type('17884562190').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Telefone inválido ')
    })

    it('TC018 - Validação CEP Vazio', () => {
        cy.get('#cep').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC019 - Validação CEP menos de 8 caracteres', () => {
        cy.get('#cep').type('1234567').blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo não atingiu o tamanho mínimo de caracteres ')
    })

    it('TC020 - Validação CEP Encontrado', () => {
        cy.get('#cep').type('29500000').blur()
        cy.get('#cidade').should('have.value', 'Alegre')
        cy.get('#estado').should('have.value', 'ES')
        cy.get('#pais').should('have.value', 'Brasil')
    })

    it('TC021 - Validação "Endereço" Vazio', () => {
        cy.get('#endereco').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC022 - Validação "Bairro" Vazio', () => {
        cy.get('#bairro').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC023 - Validação Campo "Complemento" mais de 160 caracteres', () => {
        cy.get('#complemento').type(randomBytes(90).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(160)
        })
    })

    it('TC024 - Validação Campo "Complemento" Vazio', () => {
        cy.get('#complemento').focus().blur()
        cy.get('.error-msg').should('not.exist')
    })

    it('TC025 - Validação "Referência"', () => {
        cy.get('#referencia').focus().blur()
        cy.get('.error-msg').should('not.exist')
    })

    it('TC026 - Validação Campo "Referência" mais de 160 caracteres', () => {
        cy.get('#referencia').type(randomBytes(90).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(160)
        })
    })

    it('TC027 - Validação Campo "Cidade" Vazio', () => {
        cy.get('#cidade').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC028 - Validação Campo "Estado" Vazio', () => {
        cy.get('#estado').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC029 - Validação Campo "Estado" mais de 2 caracteres', () => {
        cy.get('#estado').type('Espirito Santo').invoke('val').then(val => {
            expect(val.length).to.be.at.most(2)
        })
    })

    it('TC030 - Validação Campo "País" Vazio', () => {
        cy.get('#pais').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC031 - Validação Campo "Hard Skill" e "Soft Skill" Vazios', () => {
        cy.get('#hardSkills > .custom > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('#softSkills > .custom > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('.error-msg').should('not.exist')
    })

    it('TC032 - Validação "Hard Skill" e "Soft Skill" item não encontrado', () => {
        const hardSkills = cy.get('#hardSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        hardSkills.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        hardSkills.click().invoke('val').then(val => expect(val).to.be.empty)
        const softSkills = cy.get('#softSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        softSkills.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        softSkills.click().invoke('val').then(val => expect(val).to.be.empty)

    })

    it('TC033 - Validação "Hard Skill" e "Soft Skill" item encontrado', () => {
        const hardSkills = cy.get('#hardSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        hardSkills.click().type('Test')
        cy.get('div.ng-option').should('be.visible').and('have.text', 'Test')
        hardSkills.click()
        const softSkills = cy.get('#softSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        softSkills.click().type('Criatividade')
        cy.get('div.ng-option').should('be.visible').and('have.text', 'Criatividade')
        softSkills.click()
    })

    it('TC034 - Validação campos "Hard Skill" e "Soft Skill" múltiplos itens selecionados', () => {
        const hardSkills = cy.get('#hardSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        hardSkills.click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('div.ng-option').eq(1).click()
        hardSkills.click()
        cy.get('#hardSkills div.item-multiselect').each(select => cy.wrap(select).should('be.visible'))
        const softSkills = cy.get('#softSkills > .custom > .ng-select-container > .ng-arrow-wrapper')
        softSkills.click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('div.ng-option').eq(1).click()
        softSkills.click()
        cy.get('#softSkills div.item-multiselect').each(select => cy.wrap(select).should('be.visible'))
    })

    it('TC035 - Validação botão "Voltar" janela de confirmação', () => {
        cy.get('#endereco').type('Coisa')
        cy.get('.justify-content-between > .col-3 > .btn').click()
        cy.get('.swal2-popup').should('be.visible')
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Atenção')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Os dados serão perdidos, deseja continuar?')
        cy.get('.swal2-cancel').should('be.visible').and('have.text', 'Não')
        cy.get('.swal2-confirm').should('be.visible').and('have.text', 'Sim')
    })

    it('TC036 - Botão Continuar todos os campos obrigatórios preenchidos', () => {
        cy.fillCandidatoForm(false)
        cy.get('p.title-section').should('be.visible').and('have.text', 'Experiência Acadêmica')
    })

    it('TC037 - Botão Continuar sem ter todos os campos preenchidos', () => {
        cy.get('#cpf').type('49373753002')
        cy.get('.col-2 > .btn').click()
        cy.get('.swal2-popup').should('be.visible')
        cy.get('#swal2-title').should('be.visible').and('have.text', 'Preencha todos os campos')
        cy.get('#swal2-html-container').should('be.visible').and('have.text', 'Há Campos obrigatórios que não foram preenchidos')
        cy.get('.swal2-confirm').should('be.visible').and('have.text', 'Voltar')

    })

    it('TC038 - Validação campo "Formação" item não encontrado', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao')
        formacao.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        formacao.click().invoke('val').then(val => expect(val).to.be.empty)
    })

    it('TC039 - Validação campo "Formação " vazio', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao input')
        formacao.focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC040 - Validação Opções do Campo "Formação"', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        const options = ['Fundamental', 'Médio', 'Técnico', 'Superior']
        cy.get('div.ng-option').each((option, index) => {
            cy.wrap(option).should('have.text', options[index])
        })
    })

    it('[Bug] TC041 - Validação Campo "Curso" vazio', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#curso').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC042 - Validação Campo "Curso" mais de 256 caracteres', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#curso').type(randomBytes(130).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(256)
        })
    })

    it('TC043 - Validação Campo "Grau de Escolaridade" quando o campo "Formação" for diferente de "Superior"', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#curso').should('be.disabled')
        formacao.click()
        cy.get('div.ng-option').eq(1).click()
        cy.get('#curso').should('be.disabled')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#curso').should('be.enabled')
        formacao.click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#curso').should('be.enabled')
    })

    it('[Bug] TC044 - Validação Campo "Grau de Escolaridade" quando o campo "Formação" for diferente de "Superior"', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grauEscolaridade > .ng-select-container > .ng-value-container > .ng-input > input').should('be.enabled').click()
        const options = ['Tecnólogo', 'Graduação', 'Pós Graduação', 'Mestrado', 'Doutorado']
        cy.get('div.ng-option').each((option, index) => {
            cy.wrap(option).should('have.text', options[index])
        })
    })

    it('TC045 - Validação Campo "Instituição" vazio', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#instituicao').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC046 - Validação Campo "Instituição" mais de 256 caracteres', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#instituicao').type(randomBytes(130).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(256)
        })
    })

    it('TC047 - Validação Campo "Status" item não encontrado', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#status')
        formacao.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        formacao.click().invoke('val').then(val => expect(val).to.be.empty)
    })

    it('TC048 - Validação Campo "Status" item encontrado', () => {
        cy.fillCandidatoForm(false)
        const formacao = cy.get('#status > .ng-select-container > .ng-value-container > .ng-input > input')
        const options = ['Concluído', 'Em Andamento', 'Incompleto']
        options.forEach(option => {
            formacao.clear().type(option)
            cy.get('div.ng-option').should('have.text', option)
        })
    })

    it('TC049 - Validação Campo "Curso" quando "Formação" for diferente de "Técnico" ou "Superior"', () => {
        cy.fillCandidatoForm(false)
        for (let i = 0; i < 2; i++) {
            cy.get('#formacao').click()
            cy.get('div.ng-option').eq(i).click()
            cy.get('#curso').should('be.disabled')
        }
    })

    it('TC050 - Validação Campo "Curso" quando "Formação" for  "Técnico" ou "Superior"', () => {
        cy.fillCandidatoForm(false)
        for (let i = 2; i < 4; i++) {
            cy.get('#formacao').click()
            cy.get('div.ng-option').eq(i).click()
            cy.get('#curso').should('be.enabled')
        }
    })

    it('TC051 - Validação Campo "Data Término" quando campo "status" for Incompleto/Em andamento.', () => {
        cy.fillCandidatoForm(false)
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grauEscolaridade').click()
        cy.get('div.ng-option').eq(3).click()

        for (let i = 1; i < 3; i++) {
            cy.get('#status').click()
            cy.get('div.ng-option').eq(i).click()
            cy.get('#dataTermino > .input-date-picker > img').click()
            cy.get('div.ngb-dp-day').should('have.class', 'disabled')
            cy.get('.ngb-dp-footer > :nth-child(1)').click()
            cy.get('#dataTermino > .input-date-picker > .date-picker-input').should('have.value', '')
        }
    })

    it('TC052 - Validação Campo "Data Término" quando campo "status" for Concluído', () => {
        cy.fillCandidatoForm(false)
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grauEscolaridade').click()
        cy.get('div.ng-option').eq(3).click()

        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('[aria-label="Select year"]').select('2023')
        cy.get('[aria-label="Select month"]').select('jun.')
        cy.get('[aria-label="sexta-feira, 16 de junho de 2023"] > .btn-light').click()
        cy.get('#dataTermino > .input-date-picker > img').click()
        cy.get('.ngb-dp-footer > :nth-child(3)').click()
        cy.get('#dataTermino > .input-date-picker > .date-picker-input').should('not.have.value', '')
    })

    it('TC053 - Validação campo "Data inicio" maior que a data atual', () => {
        cy.fillCandidatoForm(false)
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grauEscolaridade').click()
        cy.get('div.ng-option').eq(3).click()

        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('[aria-label="Select year"]').select('2025')
        cy.get('[aria-label="domingo, 8 de junho de 2025"] > .btn-light').click()
        cy.get(':nth-child(1) > .error-msg').should('be.visible').and('have.text', ' Data de Início é maior que a Data Atual ')
    })

    it('TC054 - Validação campo "Data Início" maior que a "Data Termino"', () => {
        cy.fillCandidatoForm(false)
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grauEscolaridade').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('#dataTermino > .input-date-picker > img').click()
        cy.get('[aria-label="sábado, 1 de junho de 2024"] > .btn-light').click()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Data de Término é menor que a Data de Início ')
    })

    it('TC055 - Teste Botão "Adicionar outra formação"', () => {
        cy.fillCandidatoForm(false)
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#instituicao').type('Equipe')
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('[aria-label="sábado, 1 de junho de 2024"] > .btn-light').click()
        cy.get('#dataTermino > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('.col-sm-12 > .btn').click()
        cy.get('.group-form-area > :nth-child(1)').should('be.visible').and('have.text', 'Experiência 02')
    })

    it('TC056 - Teste Botão "Adicionar outra formação" com campos  não preenchidos', () => {
        cy.fillCandidatoForm(false)
        cy.get('.col-sm-12 > .btn').click()
        cy.get('div.title-section.group-form-area span').should('not.exist')
        cy.get('.error-msg').should('be.visible')
    })

    it('TC057 - Teste Botão "Continuar"', () => {
        cy.fillCandidatoForm()
        cy.get('p.title-section').should('be.visible').and('have.text', 'Experiência Profissional')
    })

    it('TC058 - Validação campo "Empresa" Vazio', () => {
        cy.fillCandidatoForm()
        cy.get('#empresa').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('[Bug] TC059 - Validação campo "Empresa" mais de 256 caracteres', () => {
        cy.fillCandidatoForm()
        cy.get('#empresa').type(randomBytes(130).toString('hex'))
        cy.get('div.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC060 - Validação campo "Cargo" Vazio', () => {
        cy.fillCandidatoForm()
        cy.get('.ng-arrow-wrapper').click().click()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC061 - Validação listbox "Cargo" item não encontrado', () => {
        cy.fillCandidatoForm()
        cy.get('#cargo').click().type('random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
    })

    it('TC062 - Validação listbox "Cargo" item encontrado', () => {
        cy.fillCandidatoForm()
        cy.get('#cargo').click().type('Desenvolvedor')
        cy.get('div.ng-option').should('be.visible').and('have.text', 'Desenvolvedor')
    })

    it('TC063 - Validação campo "Descrição das Atividades" Vazio', () => {
        cy.fillCandidatoForm()
        cy.get('#descricaoAtividades').focus().blur()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC064 - Validação campo "Descrição das Atividades" mais de 400 caracteres', () => {
        cy.fillCandidatoForm()
        cy.get('#descricaoAtividades').type(randomBytes(210).toString('hex')).blur()
        cy.get('div.error-msg').should('be.visible').and('have.text', ' Campo excedeu o tamanho limite de caracteres ')
    })

    it('TC065 - Validação campo "Data Início" maior que a data atual', () => {
        cy.fillCandidatoForm()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('[aria-label="Select year"]').select('2025')
        cy.get('[aria-label="domingo, 8 de junho de 2025"] > .btn-light').click()
        cy.get(':nth-child(1) > .error-msg').should('be.visible').and('have.text', ' Data de Início é maior que a Data Atual ')
    })

    it('TC066 - Validação campo "Data Início" maior que a "Data Termino"', () => {
        cy.fillCandidatoForm()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('#dataTermino > .input-date-picker > img').click()
        cy.get('[aria-label="sábado, 1 de junho de 2024"] > .btn-light').click()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Data de Término é menor que a Data de Início ')
    })

    it('TC067 - Validação campo "Data Início" vazio', () => {
        cy.fillCandidatoForm()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-footer > :nth-child(2)').click()
        cy.get('.ngb-dp-footer > :nth-child(1)').click()
        cy.get('.error-msg').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC068 - Teste Botão "Adicionar outra Experiência" com campos  não preenchidos', () => {
        cy.fillCandidatoForm()
        cy.get('.col-sm-12 > .btn').click()
        const selectors = ['#empresa', '#cargo', '#descricaoAtividades', 'div.errorBorder:has(#dataInicio)']
        for (const campo of selectors) {
            cy.get(`${campo} + div.error-msg`).should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
        }
    })

    it('TC069 - Teste Botão "Adicionar outra Experiência"', () => {
        cy.fillCandidatoForm()
        cy.get('#empresa').type(randomBytes(30).toString('hex'))
        cy.get('#cargo').click().type('Desenvolvedor')
        cy.get('div.ng-option').click()
        cy.get('#descricaoAtividades').type(randomBytes(50).toString('hex'))
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('.col-sm-12 > .btn').click()
        cy.get('.group-form-area > :nth-child(1)').should('be.visible').and('have.text', 'Experiência 02')
    })

    it('TC070 - Teste Botão "Adicionar outra Experiência"', () => {
        cy.fillCandidatoForm()
        cy.get('#empresa').type(randomBytes(30).toString('hex'))
        cy.get('#cargo').click().type('Desenvolvedor')
        cy.get('div.ng-option').click()
        cy.get('#descricaoAtividades').type(randomBytes(50).toString('hex'))
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('.col-sm-12 > .btn').click()
        cy.get('button.btn-outline-danger').click()
        cy.get('.group-form-area > :nth-child(1)').should('not.exist')
    })

    it.skip('TC071 - Teste Botão Continuar', () => {
        cy.fillCandidatoForm()
        cy.get('#empresa').type(randomBytes(30).toString('hex'))
        cy.get('#cargo').click().type('Desenvolvedor')
        cy.get('div.ng-option').click()
        cy.get('#descricaoAtividades').type(randomBytes(50).toString('hex'))
        cy.get('#dataInicio > .input-date-picker > img').click()
        cy.get('.ngb-dp-today > .btn-light').click()
        cy.get('.col-2 > .btn').click()
        cy.get('h2#swal2-title').should('be.visible').and('have.text', 'Sucesso')
        cy.get('div#swal2-html-container').should('be.visible').and('have.text', 'Registro salvo com sucesso')
        cy.get('button.swal2-confirm').should('be.visible').and('be.enabled').and('have.text', 'Voltar').click()
        cy.get('div.swal2-container').should('not.exist')
    })

    it('TC072 - Teste Botão "Voltar"  Experiência profissional.', () => {
        cy.fillCandidatoForm()
        cy.get('.justify-content-between > .col-3 > .btn').click()
        cy.get('p.title-section').should('be.visible').and('have.text', 'Experiência Acadêmica')
        cy.get('input.ng-pristine:not([id="curso"])').each(campo => {
            cy.wrap(campo).should('not.have.value', '')
        })
    })

    it('TC073 - Teste Botão voltar Formação Acadêmica', () => {
        cy.fillCandidatoForm()
        cy.get('.justify-content-between > .col-3 > .btn').click()
        cy.get('.justify-content-between > .col-3 > .btn').click()
        cy.get('.p-0 > :nth-child(1)').should('be.visible').and('have.text', ' Informações Pessoais ')
        cy.get('input.ng-pristine').each(campo => {
            cy.wrap(campo).should('not.have.value', '')
        })
    })
})