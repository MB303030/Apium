const path = require('path');
const addContext = require('mochawesome/addContext');

// Use environment variable, fallback to a sensible default (optional)
const appPath = process.env.APP_PATH || path.join(process.cwd(), 'DerivedData/Build/Products/Debug-iphonesimulator/UIKitCatalog.app');

exports.config = {
    runner: 'local',
    port: 4723,
    specs: ['./test/specs/**/*.ios.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:platformVersion': process.env.IOS_VERSION || '18.5',   // CI‑friendly default
        'appium:deviceName': process.env.DEVICE_NAME || 'iPhone 16',
        'appium:automationName': 'XCUITest',
        'appium:app': appPath,
        'appium:noReset': true,
        'appium:showXcodeLog': true
    }],
    // Everything below is identical to local config
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: [['mochawesome', { outputDir: './reports/mochawesome' }]],
    mochaOpts: { ui: 'bdd', timeout: 60000 },
    before: async function () { console.log('Starting tests...'); },
    afterTest: async function (test, context, { passed }) { /* ... */ },
    onPrepare: function () { console.log('Preparing test run...'); },
    onComplete: function(exitCode) { console.log('Finished with exit code:', exitCode); }
};