/**
 * Perform a swipe gesture using W3C Actions (Appium 3 compatible)
 * @param {object} driver - WebdriverIO driver
 * @param {string} direction - 'up', 'down', 'left', 'right'
 * @param {number} distance - percentage of screen to swipe (default 0.5)
 */
async function swipe(driver, direction = 'down', distance = 0.5) {
  const { width, height } = await driver.getWindowRect();

  let startX, startY, endX, endY;

  switch (direction) {
    case 'up':
      startX = width / 2;
      startY = height * 0.8;
      endX = width / 2;
      endY = height * (0.8 - distance);
      break;

    case 'down':
      startX = width / 2;
      startY = height * 0.2;
      endX = width / 2;
      endY = height * (0.2 + distance);
      break;

    case 'left':
      startX = width * 0.8;
      startY = height / 2;
      endX = width * (0.8 - distance);
      endY = height / 2;
      break;

    case 'right':
      startX = width * 0.2;
      startY = height / 2;
      endX = width * (0.2 + distance);
      endY = height / 2;
      break;

    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.floor(startX), y: Math.floor(startY) },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', duration: 500, x: Math.floor(endX), y: Math.floor(endY) },
        { type: 'pointerUp', button: 0 }
      ]
    }
  ]);

  await driver.releaseActions();
}

module.exports = { swipe };
