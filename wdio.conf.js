const path = require('path');
const fs = require('fs');
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

    // ✅ Explicit Appium service config (more stable)
    services: [[
        'appium',
        {
            command: 'appium',
            args: {
                relaxedSecurity: true,
                logLevel: 'info'
            }
        }
    ]],

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

    // ✅ Ensure report directory exists before run
    onPrepare: function () {
        console.log('Preparing test run...');

        const dir = './reports/mochawesome';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    },

    before: async function (capabilities, specs) {
        console.log('Starting tests on iOS 26.2 simulator...');
    },

    // ✅ Command logger (Playwright-like visibility)
    beforeCommand: function (commandName, args) {
        console.log(`➡️  COMMAND: ${commandName}`);
        if (args.length) {
            console.log(`   ARGS: ${JSON.stringify(args)}`);
        }
    },

    afterCommand: function (commandName, args, result, error) {
        if (error) {
            console.log(`❌ ERROR in ${commandName}: ${error.message}`);
        }
    },

    afterTest: async function (test, context, { error, passed }) {
        if (!passed) {
            const safeTitle = test.title.replace(/[^a-z0-9]/gi, '_');
            const screenshotPath = `./reports/mochawesome/${safeTitle}.png`;
            const pageSourcePath = `./reports/mochawesome/${safeTitle}.xml`;

            await browser.saveScreenshot(screenshotPath);

            const source = await browser.getPageSource();
            fs.writeFileSync(pageSourcePath, source);

            addContext(context, {
                title: 'Failure Screenshot',
                value: screenshotPath
            });

            addContext(context, {
                title: 'Page Source',
                value: pageSourcePath
            });
        }
    },

    onComplete: function(exitCode) {
        console.log('Test run finished with exit code:', exitCode);
    }
};
