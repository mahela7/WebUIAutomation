const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const PageLogin = require('../pages/page_login');
const PageInventory = require('../pages/page_inventory');

describe('SauceDemo Web UI Automation - POM Headless', function () {
    this.timeout(30000);
    let driver;

    before(async function () {
        let options = new chrome.Options();
        options.addArguments(
            '--headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920,1080'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Login success dan sort product Z to A', async function () {
        const pageLogin = new PageLogin(driver);
        const pageInventory = new PageInventory(driver);

        await pageLogin.open();
        await pageLogin.login('standard_user', 'secret_sauce');

        await pageInventory.waitUntilLoaded();

        let logoText = await pageInventory.getLogoText();
        assert.strictEqual(logoText, 'Swag Labs');

        await pageInventory.sortProductZtoA();

        let products = await pageInventory.getProductNames();
        assert.ok(products.length > 0, 'Product list harus muncul');

        let sortedZA = [...products].sort().reverse();
        assert.deepStrictEqual(
            products,
            sortedZA,
            'Product harus terurut dari Z ke A'
        );
    });
});
