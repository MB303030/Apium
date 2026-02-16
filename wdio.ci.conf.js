const path = require('path');
const addContext = require('mochawesome/addContext');

// Use environment variable in CI, fallback to local path for dev
const appPath = process.env.APP_PATH || path.resolve('/Users/mishka/Library/Developer/Xcode/DerivedData/UIKitCatalog-geaondeyrufcdydowlsmqcjsthix/Build/Products/Debug-iphonesimulator/UIKitCatalog.app');

exports.config = {
    runner: 'local',
    port: 4723,
    specs: ['./test/specs/**/*.ios.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:platformVersion': '26.2',
        'appium:deviceName': 'iPhone 17 Pro',
        'appium:automationName': 'XCUITest',
        'appium:app': appPath,
        'appium:noReset': true,
        'appium:showXcodeLog': true
    }],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: [['mochawesome', {
        outputDir: './reports/mochawesome',
        outputFileFormat: function(opts) {
            return `results-${opts.cid}.json`;
        }
    }]],
    mochaOpts: { ui: 'bdd', timeout: 60000 },
    before: async function () { console.log('Starting tests on iOS 26.2 simulator...'); },
    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            const safeTitle = test.title.replace(/[^a-z0-9]/gi, '_');
            const screenshotPath = `./reports/mochawesome/${safeTitle}.png`;
            await browser.saveScreenshot(screenshotPath);
            addContext(this, { title: 'Failure Screenshot', value: screenshotPath });
        }
    },
    onPrepare: function () { console.log('Preparing test run...'); },
    onComplete: function(exitCode) { console.log('Test run finished with exit code:', exitCode); }
};