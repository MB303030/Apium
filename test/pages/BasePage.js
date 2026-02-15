// test/pages/BasePage.js
class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async waitForElement(element, timeout = 5000) {
        await element.waitForDisplayed({ timeout });
        return element;
    }

    async click(element) {
        await this.waitForElement(element);
        await element.click();
    }

    async getText(element) {
        await this.waitForElement(element);
        return await element.getText();
    }

    async findByAccessibilityId(id) {
        return await this.driver.$(`~${id}`);
    }

    // NEW: Find by iOS predicate string
    async findByPredicate(predicate) {
        return await this.driver.$(`-ios predicate string:${predicate}`);
    }

    // Optional: Find by class chain
    async findByClassChain(chain) {
        return await this.driver.$(`-ios class chain:${chain}`);
    }
}

module.exports = BasePage;