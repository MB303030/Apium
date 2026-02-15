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
}

module.exports = BasePage;
