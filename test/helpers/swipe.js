/**
 * Perform a swipe gesture
 * @param {object} driver - WebdriverIO driver
 * @param {string} direction - 'up', 'down', 'left', 'right'
 * @param {number} distance - percentage of screen to swipe (e.g., 0.5 for half)
 */
async function swipe(driver, direction = 'down', distance = 0.5) {
    const { width, height } = await driver.getWindowRect();
    let startX, startY, endX, endY;
  
    switch (direction) {
      case 'up':
        startX = width / 2;
        startY = height * 0.7;
        endX = width / 2;
        endY = height * 0.3;
        break;
      case 'down':
        startX = width / 2;
        startY = height * 0.3;
        endX = width / 2;
        endY = height * 0.7;
        break;
      case 'left':
        startX = width * 0.7;
        startY = height / 2;
        endX = width * 0.3;
        endY = height / 2;
        break;
      case 'right':
        startX = width * 0.3;
        startY = height / 2;
        endX = width * 0.7;
        endY = height / 2;
        break;
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  
    await driver.touchPerform([
      { action: 'press', options: { x: startX, y: startY } },
      { action: 'wait', options: { ms: 100 } },
      { action: 'moveTo', options: { x: endX, y: endY } },
      { action: 'release' }
    ]);
  }
  
  module.exports = { swipe };