/// <reference types="Cypress" />
import { randomBytes } from 'crypto'

describe('Suit Test Area do Candidato (US 70885)', () => {
    beforeEach(() => {
        cy.authenticate()
        cy.visit('/area-candidato/curriculo/form', { failOnStatusCode: false })
        cy.intercept('GET', '/cidade-estado/consulta-cep/*').as('cep')
    })

    it('TC001- Teste Página Currículo do Candidato', () => {
        cy.get('#nome').should('be.visible').and('be.enabled')
        cy.get('#sobrenome').should('be.visible').and('be.enabled')
        cy.get('#email').should('be.visible').and('be.enabled')
        cy.get('#dataNascimento').should('be.visible')
        cy.get('#telefone').should('be.visible').and('be.enabled')
        cy.get('#cpf').should('be.visible').and('be.enabled')
    })

    it('TC002- Teste Campo Nome Vazio', () => {
        cy.get('#nome').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC003- Teste Campo Nome mais de 60 caracteres', () => {
        cy.get('#nome').type(randomBytes(40).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(60)
        })
    })

    it('TC004- Teste Campo Sobrenome Vazio', () => {
        cy.get('#sobrenome').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC005- Teste Campo Sobrenome mais de 60 caracteres', () => {
        cy.get('#sobrenome').type(randomBytes(40).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(60)
        })
    })

    it('TC006- Teste Campo Email Vazio', () => {
        cy.get('#email').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC007- Teste Campo Email mais de 256 caracteres', () => {
        cy.get('#email').type(randomBytes(130).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(256)
        })
    })

    it('TC008- Teste Campo CPF Vazio', () => {
        cy.get('#cpf').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC009- Teste Campo CPF mais de 11 caracteres', () => {
        cy.get('#cpf').type('1234567891011121').invoke('val').then(val => {
            expect(val.length).to.be.at.most(14) // Tem que ser 14 por causa do traço e dois pontos
        })
    })

    it('TC010- Teste campo CPF Aceitando Letras', () => {
        cy.get('#cpf').type('rnbanfjnBILAKMNFQOÇJ').should('have.value', '')
    })

    it('TC011- Teste campo Data de Nascimento Vazio', () => {
        cy.get('.input-date-picker > img').click()
        cy.get('.ngb-dp-footer > :nth-child(3)').click()
        cy.get('.input-date-picker > img').click()
        cy.get('.ngb-dp-footer > :nth-child(2)').click()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC012- Teste campo Data de Nascimento data futura', () => {
        cy.get('.input-date-picker > img').click()
        cy.get('[aria-label="Select month"]').select('jun.')
        cy.get('[aria-label="Select year"]').select('2025')
        cy.get('[aria-label="domingo, 8 de junho de 2025"] > .btn-light').click()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' A data informada não pode ser maior que a data atual ')
    })

    it('TC013- Teste campo Telefone celular vazio', () => {
        cy.get('#telefone').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC014- Teste campo Telefone Celular aceitando Letras', () => {
        cy.get('#telefone').type('rnbanfjnBILAKMNFQOÇJ').should('not.have.text', '(')
    })

    it('TC015- Teste Campo Telefone Celular sem o digito 9 após o ddd', () => {
        cy.get('#telefone').type('3288844849').blur()
        cy.get('.col-lg-2 > .ng-star-inserted').should('be.visible').and('have.text', ' O telefone informado é inválido ')
    })

    it('TC016- Teste botão Avançar', () => {
        cy.fillCurriculumForm(false)
        cy.get('h5').should('be.visible').and('have.text', 'Endereço')
    })

    it('TC017- Teste Campo Cep Vazio', () => {
        cy.fillCurriculumForm(false)
        cy.get('#cep').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC018- Teste Campo Cep encontrado', () => {
        cy.fillCurriculumForm(true)
        cy.get('#cidade').should('not.have.value', '')
        cy.get('#estado').should('not.have.value', '')
        cy.get('#pais').should('not.have.value', '')
    })

    it('TC019- Teste Campo Cep não encontrado', () => {
        cy.fillCurriculumForm(true, '18304735')
        cy.get('#cidade').should('have.value', '').and('be.enabled')
        cy.get('#estado').should('have.value', '').and('be.enabled')
        cy.get('#pais').should('have.value', '').and('be.enabled')
    })

    it('TC020- Teste Campo Cep mais de 8 caracteres', () => {
        cy.fillCurriculumForm()
        cy.get('#cep').type('295000000000000').invoke('val').then(val => {
            expect(val.length).to.be.at.most(9) // Tem que ser 9 por causa do traço
        })
    })

    it('TC021- Teste Campo Cep aceitando letras', () => {
        cy.fillCurriculumForm(false)
        cy.get('#cep').type('abcdefghijklm').should('have.value', '')
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', 'CEP informado é inválido')
    })

    it('TC022- Teste Campo Endereço Vazio', () => {
        cy.fillCurriculumForm(true, '29500000')
        cy.get('#endereco').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC023- Teste Campo Bairro vazio', () => {
        cy.fillCurriculumForm(true, '29500000')
        cy.get('#bairro').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it.skip('TC024- Teste Campo Numero Vazio', () => {
        cy.fillCurriculumForm(false)
        cy.get('#numero').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC025- Teste Campo Complemento mais de 160 Caracteres', () => {
        cy.fillCurriculumForm(true, '29500000')
        cy.get('#complemento').type(randomBytes(100).toString('hex')).invoke('val').then((val) => {
            expect(val.length).to.be.at.most(160) // Tem que ser 9 por causa do traço
        })
    })

    it.skip('TC026- Teste Campo Número mais de 8 Caracteres', () => {
        cy.fillCurriculumForm(true, '29500000')
        cy.get('#numero').type(randomBytes(9).toString('hex')).invoke('val').then((val) => {
            expect(val.length).to.be.at.most(8)
        })
    })

    it.skip('TC027- Teste Campo Número aceitando Letras', () => {
        cy.fillCurriculumForm(false)
        cy.get('#numero').type('randomWord').should('have.value', '')
    })

    it('TC028- Teste Campo Referencia Vazio', () => {
        cy.fillCurriculumForm(true, '11111111')
        cy.get('#referencia').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('not.exist')
    })

    it('TC029- Teste Campo Referencia mais de 160 Caracteres', () => {
        cy.fillCurriculumForm(true, '29500000')
        cy.get('#referencia').type(randomBytes(100).toString('hex')).invoke('val').then((val) => {
            expect(val.length).to.be.at.most(160) // Tem que ser 9 por causa do traço
        })
    })

    it('TC030- Teste Campo Cidade Vazio', () => {
        cy.fillCurriculumForm(true, '11111111')
        cy.get('#cidade').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC031- Teste Campo Estado Vazio', () => {
        cy.fillCurriculumForm(true, '11111111')
        cy.get('#estado').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC032- Teste Campo Pais Vazio', () => {
        cy.fillCurriculumForm(true, '11111111')
        cy.get('#pais').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', 'Campo de preenchimento obrigatório')
    })

    it('TC033- Teste Campo Estado mais de 2 caracteres', () => {
        cy.fillCurriculumForm(true, '11111111')
        cy.get('#estado').type('Espírito Santo').invoke('val').then(val => {
            expect(val.length).to.equal(2)
        })
    })

    it('TC034- Teste Campo País mais de 100 caracteres', () => {
        cy.fillCurriculumForm(true, '11111111')
        cy.get('#pais').type(randomBytes(60).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(100)
        })
    })

    it('TC035- Teste Botão Voltar', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-secondary').click()
        cy.get('h5').should('be.visible').and('have.text', 'Dados pessoais')
    })

    it('TC036- Teste Botão Avançar', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('h5').should('be.visible').and('have.text', 'Experiência Acadêmica')
    })

    it('TC037- Validação campo "Formação" item não encontrado', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('#formacao').click().type('randomWord')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
    })

    it('TC038- Validação campo "Formação " vazio', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper').click().click()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC039- Validação Opções do Campo "Formação"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('#formacao').click()

        const options = ['Fundamental', 'Médio', 'Técnico', 'Superior']
        cy.get('div.ng-option').each((option, index) => {
            cy.wrap(option).should('have.text', options[index])
        })
    })

    it('TC040 - Validação Campo "Curso" vazio', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#curso').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC041 - Validação Campo "Curso" mais de 256 caracteres', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        formacao.click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#curso').type(randomBytes(130).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(256)
        })
    })

    it('TC042 - Validação Campo "Grau de Escolaridade" quando o campo "Formação" for diferente de "Superior"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        const formacao = cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper')
        for (let i = 0; i < 3; i++) {
            formacao.click();
            cy.get('div.ng-option').eq(i).click();
            cy.get('#grau > .ng-select-container > .ng-value-container > .ng-input > input').should('be.disabled');
        }
    })

    it('TC043 - Validação Campo "Grau de Escolaridade" quando o campo "Formação" for "Superior"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grau > .ng-select-container > .ng-value-container > .ng-input > input').should('be.enabled').click()
        const options = ['Tecnólogo', 'Graduação', 'Pós Graduação', 'Mestrado', 'Doutorado']
        cy.get('div.ng-option').each((option, index) => {
            cy.wrap(option).should('have.text', options[index])
        })
    })

    it('TC044 - Validação Campo "Instituição" vazio', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#instituicao').focus().blur()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
    })

    it('TC045 - Validação Campo "Instituição" mais de 256 caracteres', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('#formacao > .ng-select-container > .ng-arrow-wrapper').click()
        cy.get('div.ng-option').eq(2).click()
        cy.get('#instituicao').type(randomBytes(130).toString('hex')).invoke('val').then(val => {
            expect(val.length).to.be.at.most(256)
        })
    })

    it('TC046 - Validação Campo "Status" item não encontrado', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        const formacao = cy.get('#status')
        formacao.click().type('Random')
        cy.get('div.ng-option.ng-option-disabled').should('be.visible').and('have.text', 'Item não encontrado!')
        formacao.click().invoke('val').then(val => expect(val).to.be.empty)
    })

    it('TC047 - Validação Campo "Status" item encontrado', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        const formacao = cy.get('#status > .ng-select-container > .ng-value-container > .ng-input > input')
        const options = ['Concluído', 'Em Andamento', 'Incompleto']
        options.forEach(option => {
            formacao.clear().type(option)
            cy.get('div.ng-option').should('have.text', option)
        })
    })

    it('TC048 - Validação Campo "Curso" quando "Formação" for diferente de "Técnico" ou "Superior"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        for (let i = 0; i < 2; i++) {
            cy.get('#formacao').click()
            cy.get('div.ng-option').eq(i).click()
            cy.get('#curso').type('Eletricista').clear().blur()
            cy.get('span.ng-star-inserted:not(.hiUser)').should('not.exist')
        }
    })

    it('TC049 - Validação Campo "Curso" quando "Formação" for "Técnico" ou "Superior"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        for (let i = 2; i < 4; i++) {
            cy.get('#formacao').click()
            cy.get('div.ng-option').eq(i).click()
            cy.get('#curso').should('be.enabled').type('Eletricista').clear().blur()
            cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
        }
    })

    it('TC050 - Validação Campo "Data Término" quando campo "status" for Incompleto/Em andamento.', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grau').click()
        cy.get('div.ng-option').eq(3).click()

        for (let i = 1; i < 3; i++) {
            cy.get('#status').click()
            cy.get('div.ng-option').eq(i).click()
            cy.get('#dataTermino').should('not.exist')
        }
    })

    it('TC051 - Validação Campo "Data Término" quando campo "status" for Concluído', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grau').click()
        cy.get('div.ng-option').eq(3).click()

        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#dataInicio > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(2) > :nth-child(3) > .d-flex').click()
        cy.get('.curryear').click()
        cy.get('#dataTermino > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(4) > :nth-child(3) > .d-flex').click()
        cy.get('.curryear').click()
        cy.get('#dataTermino > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-input > .ng-untouched').should('not.have.value', '')
    })

    it('[Bug] TC052 - Validação campo "Data inicio" maior que a data atual', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grau').click()
        cy.get('div.ng-option').eq(3).click()

        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#dataInicio > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(1) > :nth-child(1) > .d-flex').click()
        cy.get('tbody > :nth-child(3) > :nth-child(3)').click()
        cy.get('#dataTermino > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(1) > :nth-child(1) > .d-flex').click()
        cy.get('tbody > :nth-child(2) > :nth-child(2)').click()
        cy.get(':nth-child(1) > span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Data de Início é maior que a Data Atual ')
    })

    it('[Bug] TC053 - Validação campo "Data Início" maior que a "Data Termino"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#grau').click()
        cy.get('div.ng-option').eq(3).click()
        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#dataInicio > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(2) > :nth-child(3) > .d-flex').click()
        cy.get('tbody > :nth-child(3) > :nth-child(3)').click()
        cy.get('#dataTermino > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(4) > :nth-child(3) > .d-flex').click()
        cy.get('.curryear').click()
        cy.get('span.ng-star-inserted:not(.hiUser)').should('be.visible').and('have.text', ' Data de Término é menor que a Data de Início ')
    })

    it('TC054 - Teste Botão "Adicionar outra formação"', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#instituicao').type('Equipe')
        cy.get('#dataInicio > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(1) > :nth-child(1) > .d-flex').click()
        cy.get('tbody > :nth-child(2) > :nth-child(1)').click()
        cy.get('#dataTermino > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(2) > :nth-child(3) > .d-flex').click()
        cy.get('tbody > :nth-child(3) > :nth-child(3)').click()
        cy.get('[formarrayname="experienciasAcademicas"] > :nth-child(2) > .btn').click()
        cy.get('.ng-touched.ng-invalid > :nth-child(2) > :nth-child(1)').should('be.visible').and('have.text', 'Experiência 02')
    })

    it('TC055 - Teste Botão "Adicionar outra formação" com campos  não preenchidos', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get('.ng-untouched.ng-invalid > :nth-child(2) > .btn').click()
        const selectors = ['#formacao', '#curso', '#status', '#instituicao', '[formcontrolname="dataInicio"]']
        for (const campo of selectors) {
            cy.get(`${campo} + divspan.ng-star-inserted:not(.hiUser)`).should('be.visible').and('have.text', ' Campo de preenchimento obrigatório ')
        }
    })

    it('TC056- Teste Botão Voltar ', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()

        cy.get(':nth-child(1) > .btn').click()
        cy.get('h5').should('be.visible').and('have.text', 'Endereço')
        cy.get('input.ng-pristine').each(campo => {
            cy.wrap(campo).should('not.have.value', '')
        })
    })

    it('TC057-Teste Botão Avançar ', () => {
        cy.fillCurriculumForm()
        cy.get('button.btn-primary').click()
        cy.get('#formacao').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#status').click()
        cy.get('div.ng-option').eq(0).click()
        cy.get('#instituicao').type('Equipe')
        cy.get('#dataInicio > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(1) > :nth-child(1) > .d-flex').click()
        cy.get('tbody > :nth-child(2) > :nth-child(1)').click()
        cy.get('#dataTermino > .date-picker > .date-picker-containers > .date-picker-container > .date-picker-actions > .date-picker-icon-wrapper > img').click()
        cy.get(':nth-child(2) > :nth-child(3) > .d-flex').click()
        cy.get('tbody > :nth-child(3) > :nth-child(3)').click()
        cy.get('button.btn-primary').click()
        cy.get('h5').should('be.visible').and('have.text', 'Experiência Profissional')
    })
})