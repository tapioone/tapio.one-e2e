import {test, expect} from '@playwright/test';

const {PageObject} = require('./page-object');

test.beforeEach(async ({page}) => {
    const pageObject = new PageObject(page);
    await pageObject.goto();
})

test('Home Page has correct title and can open shop', async ({page, context}) => {
    const pageObject = new PageObject(page);

    // accept cookies
    await pageObject.acceptCookies();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home | tapio /);

    // create a locator
    const shopLink = pageObject.linkShop;

    // Expect an attribute "to be strictly equal" to the value.
    await expect(shopLink).toHaveAttribute('href', /https:\/\/customerportal.tapio.one\/marketplace/);

    // Click the get started link. this will open a new tab
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        shopLink.click(),
    ]);

    // Expects the URL to contain intro.
    await expect(newPage).toHaveURL(/https:\/\/customerportal.tapio.one\/marketplace/);
});


test('Register Button in nav menu should lead to https://my.tapio.one/signup/landing?register=customer in a new tab',
    async ({page, context}) => {
        const pageObject = new PageObject(page);

        // accept cookies
        await pageObject.acceptCookies();

        // Click the 'My tapio' link. this will open a dropdown menu
        await pageObject.openMyTapioDropdown();

        // Click the 'Register' link. this will open a new tab
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            pageObject.pressRegistrationButton()
        ])

        // Expects the URL to contain intro.
        await expect(newPage).toHaveURL('https://my.tapio.one/signup/landing?register=customer');
    });


test('Register Button in footer should lead to https://my.tapio.one/signup/landing?register=customer in a new tab',
    async ({page, context}) => {

        const pageObject = new PageObject(page);

        // accept cookies
        await pageObject.acceptCookies();

        // Click the 'Register' link. this will open a new tab
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            page.click('.call-to-action')
        ])

        // Expects the URL to contain intro.
        await expect(newPage).toHaveURL('https://my.tapio.one/signup/landing?register=customer');
    });

test('Switching the language should work', async ({page}) => {
    const pageObject = new PageObject(page);

    // accept cookies
    await pageObject.acceptCookies();

    // Click the 'My tapio' link. this will open a dropdown menu
    await pageObject.openLanguageDropdown();

    // Click the button with text 'DE'
    await pageObject.switchToDeutsch();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL('https://www.tapio.one/de/');

    // Click the 'My tapio' link. this will open a dropdown menu
    await pageObject.openLanguageDropdown();

    // Click the button with text 'EN'
    await pageObject.switchToEnglish();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL('https://www.tapio.one/en/');
});


test('Scroll to Top should work', async ({page}) => {
    const pageObject = new PageObject(page);

    // accept cookies
    await pageObject.acceptCookies();

    // find footer box
    const footerBox = await pageObject.footer.boundingBox();

    await page.waitForTimeout(1000)

    //scroll to the footer
    if (footerBox) {
        const y = footerBox.y;
        await page.mouse.wheel(0, y)
    }

    await page.waitForTimeout(1000)

    // click button 'to Top'
    await pageObject.scrollToTop();

    await page.waitForTimeout(1000)

    // find header box
    const headerBox = await pageObject.header.boundingBox();

    if (headerBox) {
        const headerY = headerBox.y
        expect(headerY).toBe(0)
    }
});


test.skip('Switching between monthly/yearly billing should change the price', async ({page, context}) => {
    // accept cookies
    await page.locator("data-testid=uc-accept-all-button").click();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home | tapio /);

    // create a locator
    const shopLink = page.getByText('Shop').nth(1);

    // Expect an attribute "to be strictly equal" to the value.
    await expect(shopLink).toHaveAttribute('href', /https:\/\/customerportal.tapio.one\/marketplace/);

    // Click the get started link. this will open a new tab
    const [shopPage] = await Promise.all([
        context.waitForEvent('page'),
        shopLink.click(),
    ]);

    // Expects the URL to contain intro.
    await expect(shopPage).toHaveURL(/https:\/\/customerportal.tapio.one\/marketplace/);

    await page.locator('#cookies-banner-accept-all').click();

    // I can't interact with this landing page =(
    await page.click('button.buynow >> nth=0');
    await page.locator('.PromotionTile').nth(0).click();
});


test('When saving the default state, Google Analytics should be disabled', async ({page}) => {
    const pageObject = new PageObject(page);

    // save services
    await pageObject.setDefaultCookies();

    //expect no google-analytics script
    await expect(pageObject.analyticScript).toHaveCount(0)

    // get quantity of cookies
    const cookiesArrayLength = await (await pageObject.cookies).length

    // expect no cookies
    await expect(cookiesArrayLength).toBe(0)
});


test('When declining all cookies no scripts should be loaded', async ({page}) => {
    const pageObject = new PageObject(page);

    // deny cookies
    await pageObject.denyCookies()

    //expect no google-analytics script
    await expect(pageObject.analyticScript).toHaveCount(0)

    // get quantity of cookies
    const cookiesArrayLength = await (await pageObject.cookies).length

    // expect no cookies
    await expect(cookiesArrayLength).toBe(0)
});

