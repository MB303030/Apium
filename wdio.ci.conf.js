const path = require('path');
const addContext = require('mochawesome/addContext');

const appPath = process.env.APP_PATH || path.join(process.cwd(), 'DerivedData/Build/Products/Debug-iphonesimulator/UIKitCatalog.app');

exports.config = {
    runner: 'local',
    port: process.env.APPIUM_PORT || 4723,
    specs: ['./test/specs/**/*.ios.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:platformVersion': '26.2',
        'appium:deviceName': 'iPhone 17 Pro',
        'appium:udid': process.env.SIMULATOR_UDID,          // will be set by workflow
        'appium:automationName': 'XCUITest',
        'appium:app': appPath,
        'appium:noReset': true,
        'appium:showXcodeLog': true,
        // ⏱️ Massive timeouts for CI slowness
        'appium:simulatorStartupTimeout': 600000,           // 10 minutes
        'appium:wdaLaunchTimeout': 600000,                  // 10 minutes
        'appium:wdaStartupRetries': 10,
        'appium:wdaStartupRetryInterval': 30000,            // 30 seconds
        'appium:iosInstallPause': 5000,
        'appium:maxTypingFrequency': 10
    }],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 600000,                          // 10 minutes
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',

    reporters: [['mochawesome', {
        outputDir: './reports/mochawesome',
        outputFileFormat: function(opts) {
            return `results-${opts.cid}.html`;
        },
        mochawesomeOpts: {
            html: true,
            json: true,
            reportDir: './reports/mochawesome',
            reportFilename: 'index',
            overwrite: true,
            quiet: true
        }
    }]],

    mochaOpts: { ui: 'bdd', timeout: 60000 },

    before: async function () {
        console.log('Starting tests on iOS 26.2 simulator...');
    },
    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            const safeTitle = test.title.replace(/[^a-z0-9]/gi, '_');
            const screenshotPath = `./reports/mochawesome/${safeTitle}.png`;
            await browser.saveScreenshot(screenshotPath);
            addContext(this, { title: 'Failure Screenshot', value: screenshotPath });
        }
    },
    onPrepare: function () {
        console.log('Preparing test run...');
    },
    onComplete: function (exitCode) {
        console.log('Test run finished with exit code:', exitCode);
    }
};