// test/specs/ios/sanity.ios.js
const APP_BUNDLE_ID = 'com.example.apple-samplecode.UICatalog'; // <-- REPLACE WITH YOUR APP'S BUNDLE ID

describe('iOS Sanity Test', () => {
    beforeEach(async () => {
        // Launch the app fresh
        await driver.activateApp(APP_BUNDLE_ID);
    });

    afterEach(async () => {
        // Kill the app after test
        await driver.terminateApp(APP_BUNDLE_ID);
    });

    it('should open app, tap Activity Indicators, and return', async () => {
        // Wait for main screen to load
        await $('~UIKitCatalog').waitForDisplayed({ timeout: 10000 });

        // Tap the first menu item – "Activity Indicators"
        const activityIndicators = await $('-ios predicate string:label == "Activity Indicators"');
        await activityIndicators.waitForExist({ timeout: 5000 });
        await activityIndicators.click();

        // Verify we're on the Activity Indicators screen (adjust selector if needed)
        await $('~Activity Indicators').waitForDisplayed({ timeout: 5000 });

        // Go back to main menu
        await driver.back();

        // Confirm we're back
        await $('~UIKitCatalog').waitForDisplayed({ timeout: 5000 });
    });
});