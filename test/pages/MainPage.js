const BasePage = require('./BasePage');

class MainPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    // ===== ELEMENTS =====

    get mainHeader() {
        return this.findByPredicate('label == "UIKitCatalog"');
    }

    get backButton() {
        return this.findByPredicate('type == "XCUIElementTypeButton"');
    }

    async getMenuItemByLabel(label) {
        return await this.findByPredicate(`label == "${label}"`);
    }

    // ===== ACTIONS =====

    async waitForMainScreen(timeout = 10000) {
        const header = await this.mainHeader;
        await this.waitForElement(header, timeout);
    }

    async goBack() {
        try {
            // Strategy 1: Try specific back button locators (by accessibility id or label)
            const backSelectors = [
                '~back', '~Back', '~backButton',                         // accessibility ids
                '-ios predicate string: label == "Back"',                // exact label
                '-ios predicate string: label CONTAINS "Back"',          // e.g., "Back to Main"
                '-ios predicate string: type == "XCUIElementTypeButton" AND name == "Back"',
                '-ios class chain: **/XCUIElementTypeNavigationBar/XCUIElementTypeButton[`label == "Back"`]'
            ];
    
            for (const selector of backSelectors) {
                const btn = await this.driver.$(selector);
                if (await btn.isExisting()) {
                    await btn.click();
                    await this.driver.pause(500);
                    return;
                }
            }
    
            // Strategy 2: Handle modal dismissal (Cancel/Done/Close buttons)
            const modalSelectors = [
                '-ios predicate string: label == "Cancel"',
                '-ios predicate string: label == "Done"',
                '-ios predicate string: label == "Close"'
            ];
            for (const selector of modalSelectors) {
                const btn = await this.driver.$(selector);
                if (await btn.isExisting()) {
                    await btn.click();
                    await this.driver.pause(500);
                    return;
                }
            }
    
            // Strategy 3: Try left‑edge swipe (works on any navigation stack)
            console.log('Trying swipe back gesture...');
            await this._swipeBack();
    
        } catch (err) {
            console.log('Swipe back failed, trying last resort...');
            // Strategy 4: Last resort – tap the first button in the navigation bar
            try {
                const firstNavBtn = await this.driver.$('//XCUIElementTypeNavigationBar/XCUIElementTypeButton[1]');
                await firstNavBtn.click();
                await this.driver.pause(500);
            } catch (err2) {
                console.error('All back navigation methods failed:', err2);
                throw err2; // rethrow if you want the test to fail
            }
        }
    }
    
    // Helper method for left‑edge swipe (add inside MainPage or BasePage)
    async _swipeBack() {
        const { width, height } = await this.driver.getWindowSize();
        const startX = 10;          // near left edge
        const startY = height / 2;
        const endX = width * 0.3;   // swipe to the right
        await this.driver.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: endX, y: startY },
            { action: 'release' }
        ]);
        await this.driver.pause(500);
    }

    async waitForDetailScreen(label, timeout = 5000) {
        const header = await this.findByPredicate(`label == "${label}"`);
        await this.waitForElement(header, timeout);
    }

    /**
     * Scroll directly to element safely, return null if not found
     */
    async scrollToMenuItem(label, maxScrolls = 10) {
        for (let i = 0; i < maxScrolls; i++) {
            try {
                const element = await this.driver.$(`-ios predicate string: label == "${label}"`);
                if (await element.isExisting()) {
                    // Scroll into view using mobile: scroll, then wait a bit
                    await this.driver.execute('mobile: scroll', {
                        direction: 'down',
                        element: element.elementId
                    });
                    await this.driver.pause(500);
    
                    // Check if visible now
                    if (await element.isDisplayed()) {
                        return element;
                    }
                }
            } catch {
                // If element is not yet in DOM, do a manual swipe
                const { width, height } = await this.driver.getWindowSize();
                await this.driver.touchAction([
                    { action: 'press', x: width / 2, y: height * 0.8 },
                    { action: 'moveTo', x: width / 2, y: height * 0.2 },
                    { action: 'release' }
                ]);
                await this.driver.pause(500);
            }
        }
        throw new Error(`Element with label "${label}" not found after ${maxScrolls} scroll attempts.`);
    }
    
}

module.exports = MainPage;
