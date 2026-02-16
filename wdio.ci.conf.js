const path = require('path');
const addContext = require('mochawesome/addContext');

const appPath = process.env.APP_PATH || path.join(process.cwd(), 'DerivedData/Build/Products/Debug-iphonesimulator/UIKitCatalog.app');

exports.config = {
    runner: 'local',
    port: process.env.APPIUM_PORT || 4723,   // matches WDIO Appium service default
    path: '/wd/hub',
    specs: ['./test/specs/**/*.ios.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:platformVersion': process.env.IOS_VERSION || '18.5',
        'appium:deviceName': process.env.DEVICE_NAME || 'iPhone 16',
        'appium:automationName': 'XCUITest',
        'appium:app': appPath,
        'appium:noReset': true,
        'appium:showXcodeLog': true
    }],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 180000,   // increased for CI reliability
    connectionRetryCount: 3,
    services: ['appium'],             // WDIO will start Appium automatically
    framework: 'mocha',
    reporters: [['mochawesome', { outputDir: './reports/mochawesome' }]],
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
