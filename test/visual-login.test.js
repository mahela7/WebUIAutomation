const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default;

describe('Visual Testing SauceDemo', function () {
    this.timeout(30000);
    let driver;

    it('Cek Visual Halaman login', async function () {
        // setup browser (headless)
        let options = new chrome.Options();
        options.addArguments('--headless', '--window-size=1920,1080');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('https://www.saucedemo.com');

        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');


        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, 'base64');
        fs.writeFileSync('current.png', imgBuffer);

        if (!fs.existsSync('baseline.png')) {
            fs.copyFileSync('current.png', 'baseline.png');
            console.log('Baseline image saved.');
        }

        let img1 = PNG.sync.read(fs.readFileSync('baseline.png'));
        let img2 = PNG.sync.read(fs.readFileSync('current.png'));
        let { width, height } = img1;
        let diff = new PNG({ width, height });

        let numDiffPixels = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            { threshold: 0.1 }
        );

        fs.writeFileSync('diff.png', PNG.sync.write(diff));

        if (numDiffPixels > 0) {
            console.log(`Visual differences found! Pixels different: ${numDiffPixels}`);
        } else {
            console.log('No visual differences found.');
        }

        await driver.quit();
    });
});
