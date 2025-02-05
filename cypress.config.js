const { defineConfig } = require('cypress');
const cypressOnFix = require('cypress-on-fix');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor'); // ✅ Import this

module.exports = defineConfig({
  projectId: 'h9vwxz',
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: true,
    html: true,
    json: true,
    inlineAssets: true, // Inline the CSS and JS assets in the report
    code: false, // Disable displaying code blocks, only show steps
    charts: true, // Include charts in the report
    embeddedScreenshots: true,
    reportTitle: "Bookcart Application Test Report",
    quiet: true,
    scenarioAsStep: true,
    inline:true
  },
  video: false,
  retries: 1,

  e2e: {
    watchForFileChanges: false,
    async setupNodeEvents(on, config) {
      on = cypressOnFix(on);
      require('cypress-mochawesome-reporter/plugin')(on);

      await addCucumberPreprocessorPlugin(on, config); // 
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin.default(config)],
        })
      );
      return config;
    },
    specPattern: 'cypress/e2e/**/*.feature',
    experimentalRunAllSpecs: true,
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    baseUrl: "https://bookcart.azurewebsites.net/",
    chromeWebSecurity: false,
    env: {
      url:"https://bookcart.azurewebsites.net/"
    } 
  },
});
