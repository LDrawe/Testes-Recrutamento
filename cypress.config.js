const { defineConfig } = require("cypress");
require('dotenv').config();
module.exports = defineConfig({
  projectId: process.env.PROJECT_ID,
  e2e: {
    baseUrl: 'https://app.dev.recrutamento.itixti-lab.com.br/?vid=f08297bcb6c2d06eb8b722ca4794204f',
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
