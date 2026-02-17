// pages/DatePickerPage.js
class DatePickerPage {
    constructor(driver) {
        this.driver = driver;
    }

    get screenTitle() {
        return this.driver.$('~Date Picker');
    }

    get dateButton() {
        return this.driver.$('XCUIElementTypeButton[label MATCHES ".*\\d{1,2} [A-Za-z]+ \\d{4}"]');
    }

    get dayCells() {
        // Assumes the current month name appears in the button's accessibility name
        return this.driver.$$('XCUIElementTypeButton[contains(@name, "February")]');
    }

    async waitForScreen(timeout = 5000) {
        await this.screenTitle.waitForExist({ timeout });
    }

    async openDatePicker() {
        await this.dateButton.click();
        await this.driver.waitUntil(async () => {
            const cells = await this.dayCells;
            return cells.length > 0;
        }, { timeout: 10000, timeoutMsg: 'Date picker modal did not appear' });
    }

    async selectDay(dayNumber) {
        const dayElement = await this.driver.$(`//XCUIElementTypeStaticText[@value="${dayNumber}"]/..`);
        await dayElement.click();
        await this.driver.pause(1000); // let the UI settle
    }

    // Double‑tap back: first closes the modal (if still open), second returns to main menu
    async goBackTwice() {
        const backButton = await this.driver.$('//XCUIElementTypeNavigationBar/XCUIElementTypeButton[1]');
        await backButton.click(); // dismiss modal
        await this.driver.pause(500);
        await backButton.click(); // go back to main menu
    }
}

module.exports = DatePickerPage;