const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('SauceDemo Web UI Automation - Headless', function () {
    this.timeout(30000);

    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments(
            '--headless',
            '--mo-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920,1080'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('Login success dan sort product Z to A (Headless)', async function () {
        await driver.get('https://www.saucedemo.com');

        await driver.findElement(By.css('[data-test="username"]'))
            .sendKeys('standard_user');
        await driver.findElement(By.css('[data-test="password"]'))
            .sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();

        let cartIcon = await driver.wait(
            until.elementLocated(By.css('[data-test="shopping-cart-link"]')),
            10000
        );
        assert.strictEqual(await cartIcon.isDisplayed(), true);

        let appLogo = await driver.findElement(By.className('app_logo'));
        let logoText = await appLogo.getText();
        assert.strictEqual(logoText, 'Swag Labs');

        await driver.wait(
            until.elementsLocated(By.className('inventory_item_name')),
            10000
        );


        let dropdownSort = await driver.findElement(
            By.css('[data-test="product-sort-container"]')
        );
        await dropdownSort.click();

        let optionZA = await driver.findElement(
            By.xpath('//option[text()="Name (Z to A)"]')
        );
        await optionZA.click();

        await driver.wait(
            until.elementsLocated(By.className('inventory_item_name')),
            10000
        );

        let products = await driver.findElements(
            By.className('inventory_item_name')
        );


        assert.ok(products.length > 0, 'Product list harus muncul');

        let productNames = [];
        for (let product of products) {
            productNames.push(await product.getText());
        }


        let sortedZA = [...productNames].sort().reverse();
        assert.deepStrictEqual(
            productNames,
            sortedZA,
            'Product harus terurut dari Z ke A'
        );

    });
});
