describe('Testes do site da Cat', () => {
    beforeEach(() => {
        cy.title().should('contain', 'Cartão de Visitas')
    })

    it('CT001 - Test Home Page', () => {
        cy.get('img[alt="Catterina"]').should('be.visible')
        cy.get('h2').should('contain.text', 'Catterina Vittorazzi Salvador')
        cy.get('p').should('contain.text', 'Trainee')

        // Check visibility of all links
        cy.get('a').each(link => {
            cy.wrap(link).should('be.visible').and('not.be.disabled')
        })
    })

    it('CT002 - Test Email Section', () => {
        cy.get('a:first').click()
        cy.url().should('equal', 'https://cartao-de-visitas-1f916.web.app/email')
        
        const labels = ['Nome', 'Email', 'Mensagem']
        const labelsElement = cy.get('label')

        for (let i = 0; i < labels.length; i++) {
            labelsElement.should('include.text', labels[i])
        }
        const enviar = cy.get('input[type="submit"]').should('contain.value', 'Enviar')
        const voltar = cy.get('button').should('contain.text', 'Voltar')

        const inputSelectors = [
            'input[name="user_name"]',
            'input[name="user_email"]',
            'textarea[name="message"]'
        ]
        let data = require('../../fixtures/example.json')
        data = Object.values(data)
        inputSelectors.forEach((selector, i) => {
            const campo = cy.get(selector)
            campo.should('be.enabled')
            campo.click()
            campo.should('be.focused')
            campo.type(data[i])
            campo.should('have.value', data[i])
        })

        enviar.click()
        // cy.intercept('POST', 'https://api.emailjs.com/api/v1.0/email/send-form').as('userSuccess')

        inputSelectors.forEach(selector => {
            cy.get(selector).should('have.value', '')
        })
        
        voltar.click()
        cy.url().should('equal', 'https://cartao-de-visitas-1f916.web.app/home?user_name=&user_email=&message=')
    })

    it('CT003 - Test WhatsApp Button', () => {
        const whatsButton = cy.get('a').eq(1)
        whatsButton.should('have.attr', 'href', 'https://wa.me/5528999596505?text=Olá!')
        // whatsButton.invoke('removeAttr', 'target').click()
    })

    it('CT004 - Test Instagram Button', () => {
        cy.get('a').eq(2).should('have.attr', 'href', 'https://www.instagram.com/catterinasalvador/')
    })
    it('CT005 - Test Linkedin Button', () => {
        cy.get('a').eq(3).should('have.attr', 'href', 'https://www.linkedin.com/in/catterina-salvador-2708035b/').click()
    })

    it('CT006 - Test Github Button', () => {
        cy.get('a').eq(4).should('have.attr', 'href', 'https://www.github.com/catterinavs').click()
    })

    it('CT007 - Test Surprise', () => {
        cy.get('a').eq(5).click()
        cy.get('img[alt="foto aleatória"]').should('be.visible')
        cy.get('p').eq(1).should('be.visible').and('contain.text', '')
        cy.get('button').should('be.visible').and('not.disabled').and('have.text', 'Voltar').click()
        cy.url().should('equal', 'https://cartao-de-visitas-1f916.web.app/home')
    })
})