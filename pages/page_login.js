const { By } = require('selenium-webdriver');

class PageLogin {
    constructor(driver) {
        this.driver = driver;
        this.usernameInput = By.css('[data-test="username"]');
        this.passwordInput = By.css('[data-test="password"]');
        this.loginButton = By.id('login-button');
    }

    async open() {
        await this.driver.get('https://www.saucedemo.com');
    }

    async login(username, password) {
        await this.driver.findElement(this.usernameInput).sendKeys(username);
        await this.driver.findElement(this.passwordInput).sendKeys(password);
        await this.driver.findElement(this.loginButton).click();
    }
}

module.exports = PageLogin;
