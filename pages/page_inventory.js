const { By, until } = require('selenium-webdriver');

class PageInventory {
    constructor(driver) {
        this.driver = driver;
        this.cartIcon = By.css('[data-test="shopping-cart-link"]');
        this.appLogo = By.className('app_logo');
        this.sortDropdown = By.css('[data-test="product-sort-container"]');
        this.productNames = By.className('inventory_item_name');
    }

    async waitUntilLoaded() {
        await this.driver.wait(until.elementLocated(this.cartIcon), 10000);
        await this.driver.wait(until.elementsLocated(this.productNames), 10000);
    }

    async getLogoText() {
        return await this.driver.findElement(this.appLogo).getText();
    }

    async sortProductZtoA() {
        let dropdown = await this.driver.findElement(this.sortDropdown);
        await dropdown.click();
        await dropdown.findElement(
            By.xpath('//option[text()="Name (Z to A)"]')
        ).click();
    }

    async getProductNames() {
        let elements = await this.driver.findElements(this.productNames);
        let names = [];
        for (let el of elements) {
            names.push(await el.getText());
        }
        return names;
    }
}

module.exports = PageInventory;
