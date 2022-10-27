import { Cookie, Locator, Page } from "@playwright/test";

class PageElement {
  public Selector: string;
  public Locator: Locator;

  constructor(page: Page, selector, options?) {
    this.Selector = selector;
    this.Locator = page.locator(selector, options);
  }
}

export class PageObject {
  readonly page: Page;
  readonly ButtonAcceptCookies: PageElement;
  readonly ButtonAcceptDefaultCookies: PageElement;
  readonly ButtonDenyCookies: PageElement;
  readonly ButtonScrollToTop: PageElement;
  readonly ButtonLanguageDeutsch: PageElement;
  readonly ButtonLanguageEnglish: PageElement;
  readonly ButtonRegistration: PageElement;
  readonly LinkLanguageDropdown: PageElement;
  readonly LinkMyTapioDropdown: PageElement;
  readonly LinkShop: Locator;
  readonly AnalyticScript: PageElement;
  readonly Header: PageElement;
  readonly Footer: PageElement;
  readonly Cookies: Promise<Cookie[]>;

  constructor(page: Page) {
    this.page = page;

    this.ButtonAcceptCookies = new PageElement(
      page,
      "data-testid=uc-accept-all-button"
    );
    this.ButtonAcceptDefaultCookies = new PageElement(
      page,
      "data-testid=uc-save-button"
    );
    this.ButtonDenyCookies = new PageElement(
      page,
      "data-testid=uc-deny-all-button"
    );
    this.ButtonScrollToTop = new PageElement(
      page,
      ".backToTop__ScrollToTopButton-mdwnp9-0"
    );
    this.ButtonLanguageDeutsch = new PageElement(page, "button", {
      hasText: "DE",
    });
    this.ButtonLanguageEnglish = new PageElement(page, "button", {
      hasText: "EN",
    });
    this.ButtonRegistration = new PageElement(page, ".dropdown-item", {
      hasText: /(Registrieren)|(Register)/,
    });

    this.LinkLanguageDropdown = new PageElement(page, ".nav-link", {
      hasText: "language",
    });
    this.LinkMyTapioDropdown = new PageElement(page, ".nav-link", {
      hasText: "My tapio",
    });
    this.LinkShop = page.getByText("Shop").nth(1);

    this.AnalyticScript = new PageElement(
      page,
      'script[src="https://www.google-analytics.com/analytics.js"]'
    );
    this.Header = new PageElement(page, ".header");
    this.Footer = new PageElement(page, "footer");
    this.Cookies = page.context().cookies();
  }

  async goto() {
    await this.page.goto("https://www.tapio.one/");
  }

  async denyCookies() {
    await this.ButtonDenyCookies.Locator.click();
  }

  async acceptDefaultCookies() {
    await this.ButtonAcceptDefaultCookies.Locator.click();
  }

  async acceptCookies() {
    await this.ButtonAcceptCookies.Locator.click();
  }

  async scrollToTop() {
    await this.ButtonScrollToTop.Locator.click();
  }

  async openLanguageDropdown() {
    await this.LinkLanguageDropdown.Locator.click();
  }

  async switchToEnglish() {
    await this.ButtonLanguageEnglish.Locator.click();
  }

  async switchToDeutsch() {
    await this.ButtonLanguageDeutsch.Locator.click();
  }

  async openMyTapioDropdown() {
    await this.LinkMyTapioDropdown.Locator.click();
  }

  async pressRegistrationButton() {
    await this.ButtonRegistration.Locator.click();
  }
}
