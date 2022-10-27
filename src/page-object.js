exports.PageObject = class pageObject {

    constructor(page) {
        this.page = page;

        this.buttonAcceptCookies = page.locator("data-testid=uc-accept-all-button");
        this.buttonAcceptDefaultCookies = page.locator("data-testid=uc-save-button");
        this.buttonDenyCookies = page.locator("data-testid=uc-deny-all-button");
        this.buttonScrollToTop = page.locator('.backToTop__ScrollToTopButton-mdwnp9-0');
        this.buttonLanguageDeutsch = page.locator('button', {hasText: 'DE'});
        this.buttonLanguageEnglish = page.locator('button', {hasText: 'EN'});
        this.buttonRegistration = page.locator('.dropdown-item', {hasText: /(Registrieren)|(Register)/});

        this.linkLanguageDropdown = page.locator('.nav-link', {hasText: 'language'});
        this.linkMyTapioDropdown = page.locator('.nav-link', {hasText: 'My tapio'});
        this.linkShop = page.getByText('Shop').nth(1);

        this.analyticScript = page.locator('script[src="https://www.google-analytics.com/analytics.js"]');
        this.header = page.locator('.header');
        this.footer = page.locator('footer');
        this.cookies = page.context().cookies();
    }

    async goto() {
        await this.page.goto('https://www.tapio.one/');
    }

    async denyCookies() {
        await this.buttonDenyCookies.click();
    }

    async acceptDefaultCookies() {
        await this.buttonAcceptDefaultCookies.click();
    }

    async acceptCookies() {
        await this.buttonAcceptCookies.click();
    }

    async scrollToTop() {
        await this.buttonScrollToTop.click();
    }

    async openLanguageDropdown() {
        await this.linkLanguageDropdown.click();
    }

    async switchToEnglish() {
        await this.buttonLanguageEnglish.click();
    }

    async switchToDeutsch() {
        await this.buttonLanguageDeutsch.click();
    }

    async openMyTapioDropdown() {
        await this.linkMyTapioDropdown.click();
    }

    async pressRegistrationButton() {
        await this.buttonRegistration.click();
    }
}