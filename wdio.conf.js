const path = require('path');
const addContext = require('mochawesome/addContext');

// Path to your compiled UIKitCatalog.app (update this!)
const appPath = path.resolve('/Users/mishka/Library/Developer/Xcode/DerivedData/UIKitCatalog-geaondeyrufcdydowlsmqcjsthix/Build/Products/Debug-iphonesimulator/UIKitCatalog.app');
exports.config = {
    runner: 'local',
    port: 4723,

    specs: [
        './test/specs/**/*.ios.js'
    ],
    

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
    baseUrl: '',
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['appium'],

    framework: 'mocha',
    reporters: [
        ['mochawesome', {
            outputDir: './reports/mochawesome',
            outputFileFormat: function(opts) {
                return `results-${opts.cid}.json`;
            }
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    before: async function (capabilities, specs) {
        console.log('Starting tests on iOS 26.2 simulator...');
        // Note: you might want to update the log message
    },

    afterTest: async function (test, context, { error, passed }) {
        if (!passed) {
            const safeTitle = test.title.replace(/[^a-z0-9]/gi, '_');
            const screenshotPath = `./reports/mochawesome/${safeTitle}.png`;
            await browser.saveScreenshot(screenshotPath);
            addContext(this, { title: 'Failure Screenshot', value: screenshotPath });
        }
    },

    onPrepare: function (config, capabilities) {
        console.log('Preparing test run...');
    },

    onComplete: function(exitCode, config, capabilities, results) {
        console.log('Test run finished with exit code:', exitCode);
    }
};