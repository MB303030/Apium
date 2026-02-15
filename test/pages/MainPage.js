// test/pages/MainPage.js
const BasePage = require('./BasePage');
const { swipe } = require('../helpers/swipe'); // Adjust path if needed

class MainPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    // Element getters using predicate strings (based on visible labels)
    get activityIndicatorsMenuItem() {
        return this.findByPredicate('label == "Activity Indicators"');
    }

    get alertViewsMenuItem() {
        return this.findByPredicate('label == "Alert Views"');
    }

    get buttonsMenuItem() {
        return this.findByPredicate('label == "Buttons"');
    }

    get datePickerMenuItem() {
        return this.findByPredicate('label == "Date Picker"');
    }

    // Navigation bar title (acts as back button too)
    get mainHeader() {
        return this.findByPredicate('label == "UIKitCatalog"');
    }

    get backButton() {
        return this.mainHeader;
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

    async waitForMainScreen() {
        await this.waitForElement(await this.mainHeader);
    }

    // Scroll to a menu item using swipe helper
    async scrollToMenuItem(itemLabel, maxSwipes = 5) {
        let swipes = 0;
        while (swipes < maxSwipes) {
            try {
                const element = await this.findByPredicate(`label == "${itemLabel}"`);
                if (await element.isDisplayed()) {
                    return element;
                }
            } catch (err) {
                // element not found, continue swiping
            }
            await swipe(this.driver, 'up', 0.6);
            swipes++;
        }
        throw new Error(`Element with label "${itemLabel}" not found after ${maxSwipes} swipes`);
    }
}

module.exports = MainPage;