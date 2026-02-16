const path = require('path');
const addContext = require('mochawesome/addContext');

const appPath = process.env.APP_PATH || path.join(process.cwd(), 'DerivedData/Build/Products/Debug-iphonesimulator/UIKitCatalog.app');

exports.config = {
    runner: 'local',
    port: process.env.APPIUM_PORT || 4723,
    // 🚨 REMOVED the line: path: '/wd/hub',   (this was causing the timeout)
    specs: ['./test/specs/**/*.ios.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:platformVersion': '26.2',               // or use process.env.IOS_VERSION
        'appium:deviceName': 'iPhone 17 Pro',           // or use process.env.DEVICE_NAME
        'appium:automationName': 'XCUITest',
        'appium:app': appPath,
        'appium:noReset': true,
        'appium:showXcodeLog': true
    }],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',

    // Mochawesome reporter configuration
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
        console.log('Starting tests...');
    },
    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            addContext({ title: 'Test failed screenshot', value: 'path/to/screenshot.png' });
        }
    },
    onPrepare: function () {
        console.log('Preparing test run...');
    },
    onComplete: function (exitCode) {
        console.log('Finished with exit code:', exitCode);
    }
};