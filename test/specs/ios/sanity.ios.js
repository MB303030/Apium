// test/specs/ios/sanity.ios.js
const { APP_BUNDLE_ID, DEFAULT_TIMEOUT } = require('../../constants');
const MainPage = require('../../pages/MainPage');

describe('iOS Sanity Test', () => {
    let mainPage;

    beforeEach(async () => {
        // Launch the app fresh
        await driver.activateApp(APP_BUNDLE_ID);
        // Initialize the page object
        mainPage = new MainPage(driver);
        // Wait for main screen to load
        await mainPage.waitForMainScreen();
    });

    afterEach(async () => {
        // Kill the app after test
        await driver.terminateApp(APP_BUNDLE_ID);
    });

    it('should open app, tap Activity Indicators, and return', async () => {
        // Tap on "Activity Indicators" using page object method
        await mainPage.tapOnActivityIndicators();

        // Verify we're on the Activity Indicators screen
        // Using a predicate for the header (adjust if needed)
        const activityIndicatorsHeader = await mainPage.findByPredicate('label == "Activity Indicators"');
        await expect(activityIndicatorsHeader).toBeDisplayed();

        // Go back to main menu
        await mainPage.goBack();

        // Confirm we're back on main screen
        await mainPage.waitForMainScreen();
    });
});