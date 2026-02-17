// test/specs/ios/datePicker.spec.js
const { APP_BUNDLE_ID } = require('../../constants');
const MainPage = require('../../pages/MainPage');
const DatePickerPage = require('../../pages/DatePickerPage');

describe('Date Picker', () => {
    let mainPage;
    let datePickerPage;

    before(async () => {
        await driver.activateApp(APP_BUNDLE_ID);
        mainPage = new MainPage(driver);
        await mainPage.waitForMainScreen();

        const menuItem = await mainPage.scrollToMenuItem('Date Picker');
        await menuItem.click();

        datePickerPage = new DatePickerPage(driver);
        await datePickerPage.waitForScreen();
    });

    after(async () => {
        await driver.terminateApp(APP_BUNDLE_ID);
    });

    it('should select a date and return to main menu', async () => {
        await datePickerPage.openDatePicker();
        await datePickerPage.selectDay(20);          // choose a different day
        await datePickerPage.goBackTwice();          // first dismiss modal, then go back
        await mainPage.waitForMainScreen();          // verify we are on the main screen
        console.log('Successfully returned to main menu');
    });
});