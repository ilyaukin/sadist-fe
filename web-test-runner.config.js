const { puppeteerLauncher } = require('@web/test-runner-puppeteer');
const esbuildPlugin = require("@web/dev-server-esbuild").esbuildPlugin;

module.exports = {
  files: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.spec.ts'],
  plugins: [esbuildPlugin({ ts: true })],
// uncomment to debug in real browser
  // browsers: [
  //   puppeteerLauncher({
  //     launchOptions: {
  //       headless: false,
  //     }
  //   })
  // ],
  // testFramework: {
  //   config: {
  //     timeout: 1000000,
  //   }
  // },
}