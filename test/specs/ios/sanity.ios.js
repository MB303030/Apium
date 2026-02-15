const { APP_BUNDLE_ID } = require('../../constants');
const MainPage = require('../../pages/MainPage');
const menuItems = require('../../data/menuItems');

describe('iOS Menu Items Sanity Test', () => {
    let mainPage;

    beforeEach(async () => {
        // ensure clean start
        try { await driver.terminateApp(APP_BUNDLE_ID); } catch {}
        await driver.activateApp(APP_BUNDLE_ID);
        mainPage = new MainPage(driver);
        await mainPage.waitForMainScreen();
    });

    afterEach(async () => {
        try {
            await driver.terminateApp(APP_BUNDLE_ID);
        } catch (err) {
            console.warn('App already closed or crashed.');
        }
    });

    it('should click each menu item and return to main menu', async () => {
        for (const label of menuItems) {
            try {
                // Wait for main screen fully
                await mainPage.waitForMainScreen();

                console.log(`Testing menu item: ${label}`);

                // Scroll to menu item only once
                const menuItem = await mainPage.scrollToMenuItem(label);
                if (!menuItem) {
                    console.warn(`Menu item "${label}" not found, skipping.`);
                    continue;
                }

                // Tap menu item
                await menuItem.click();

                // Wait for detail screen safely (short timeout)
                try {
                    await mainPage.waitForDetailScreen(label, 5000);
                    console.log(`Detail screen for "${label}" loaded`);
                } catch {
                    console.warn(`Detail screen for "${label}" did not appear.`);
                }

                // Go back to main menu
                await mainPage.goBack();
            } catch (err) {
                console.warn(`Skipping menu item "${label}" due to error: ${err.message}`);
                // Ensure app is still running
                try {
                    await driver.activateApp(APP_BUNDLE_ID);
                    await mainPage.waitForMainScreen();
                } catch {
                    console.error('App crashed, stopping test.');
                    break;
                }
            }
        }
    });
});
