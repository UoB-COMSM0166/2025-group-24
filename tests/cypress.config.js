const { defineConfig } = require("cypress");
const mochawesome = require("cypress-mochawesome-reporter/plugin");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
<<<<<<< HEAD
    specPattern: 'cypress/e2e/Feb28/**/*.cy.{js,jsx,ts,tsx}',
=======
    specPattern: 'cypress/e2e/**/**/*.cy.{js,jsx,ts,tsx}',
>>>>>>> a3038c513ac968476e28c3ac8e8041ff9694c5e8
    setupNodeEvents(on, config) {
      mochawesome(on);
      return config;
    },
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: "Test Report",
  },
});
