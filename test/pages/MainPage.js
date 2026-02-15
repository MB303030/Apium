// test/pages/MainPage.js
const BasePage = require('./BasePage');

class MainPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    // Element getters using accessibility IDs from the app
    get activityIndicatorsMenuItem() {
        return this.findByAccessibilityId('Activity Indicators');
    }

    get alertViewsMenuItem() {
        return this.findByAccessibilityId('Alert Views');
    }

    get buttonsMenuItem() {
        return this.findByAccessibilityId('Buttons');
    }

    get datePickerMenuItem() {
        return this.findByAccessibilityId('Date Picker');
    }

    // Add more as needed

    // Navigation bar title
    get mainHeader() {
        return this.findByAccessibilityId('UIKitCatalog');
    }

    // Back button (same as mainHeader on detail screens)
    get backButton() {
        return this.findByAccessibilityId('UIKitCatalog');
    }

    // Actions
    async tapOnActivityIndicators() {
        await this.click(await this.activityIndicatorsMenuItem);
    }

    async tapOnAlertViews() {
        await this.click(await this.alertViewsMenuItem);
    }

    async tapOnButtons() {
        await this.click(await this.buttonsMenuItem);
    }

    async goBack() {
        await this.click(await this.backButton);
    }
}

module.exports = MainPage;