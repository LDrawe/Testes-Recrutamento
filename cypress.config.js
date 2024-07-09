const { defineConfig } = require("cypress")
require('dotenv').config()
module.exports = defineConfig({
  projectId: process.env.PROJECT_ID,
  env: {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD
  },
  e2e: {
    baseUrl: 'https://app.dev.recrutamento.itixti-lab.com.br/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: ['*/**/advanced-examples/*'],
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'cypress/reports/junit/test-results-[hash].xml',
      toConsole: true
    },
  },
  video: true,
});
