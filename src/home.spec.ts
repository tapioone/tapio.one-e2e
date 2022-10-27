import { test, expect } from '@playwright/test';

test('Home Page has correct title and can open shop', async ({ page, context }) => {
  await page.goto('https://www.tapio.one/');

  // accept cookies 
  await page.locator("data-testid=uc-accept-all-button").click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home | tapio /);

  // create a locator
  const shopLink = page.getByText('Shop').nth(1);

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


test('Register Button in nav menu should lead to https://my.tapio.one/signup/landing?register=customer in a new tab', async ({ page, context }) => {
  await page.goto('https://www.tapio.one/');

  // accept cookies 
  await page.locator("data-testid=uc-accept-all-button").click();

  // Click the 'My tapio' link. this will open a dropdown menu
  await page.locator('.nav-link', { hasText: 'My tapio' }).click();

  // Click the 'Register' link. this will open a new tab
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('.dropdown-item', { hasText: /(Registrieren)|(Register)/ }).click()
  ])

  // Expects the URL to contain intro.
  await expect(newPage).toHaveURL('https://my.tapio.one/signup/landing?register=customer');
});


test('Register Button in footer should lead to https://my.tapio.one/signup/landing?register=customer in a new tab', async ({ page, context }) => {
  await page.goto('https://www.tapio.one/');

  // accept cookies 
  await page.locator("data-testid=uc-accept-all-button").click();

  // Click the 'Register' link. this will open a new tab
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('.call-to-action')
  ])

  // Expects the URL to contain intro.
  await expect(newPage).toHaveURL('https://my.tapio.one/signup/landing?register=customer');
});


test('Switching the language should work', async ({ page }) => {
  await page.goto('https://www.tapio.one/en/');

  // accept cookies 
  await page.locator("data-testid=uc-accept-all-button").click();

  // Click the 'My tapio' link. this will open a dropdown menu
  await page.locator('.nav-link', { hasText: 'language' }).click();

  // Click the button with text 'DE'
  await page.locator('button', { hasText: 'DE' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL('https://www.tapio.one/de/');

  // Click the 'My tapio' link. this will open a dropdown menu
  await page.locator('.nav-link', { hasText: 'language' }).click();

  // Click the button with text 'EN'
  await page.locator('button', { hasText: 'EN' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL('https://www.tapio.one/en/');
});


test('Scroll to Top should work', async ({ page }) => {
  await page.goto('https://www.tapio.one/en/');

  // accept cookies 
  await page.locator("data-testid=uc-accept-all-button").click();

  await page.screenshot()

  // find footer box
  const footerBox = await page.locator('footer').boundingBox();

  //scroll to the footer
  if (footerBox) {
    const y = footerBox.y;
    await page.mouse.wheel(0, y)
  }

  await page.waitForTimeout(1000)

  // click button 'to Top'
  await page.locator('.backToTop__ScrollToTopButton-mdwnp9-0').click()

  await page.waitForTimeout(1000)

  // find header box
  const headerBox = await page.locator('.header').boundingBox();

  if (headerBox) {
    const headerY = headerBox.y
    expect(headerY).toBe(0)
  }
});


test.skip('Switching between monthly/yearly billing should change the price', async ({ page, context }) => {
  await page.goto('https://www.tapio.one/');

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


test('When saving the default state, Google Analytics should be disabled', async ({ page, context }) => {
  await page.goto('https://www.tapio.one/');

  // save services
  await page.locator("data-testid=uc-save-button").click();

  //expect no google-analytics script
  await expect(page.locator('script[src="https://www.google-analytics.com/analytics.js"]')).toHaveCount(0)

  // get quantity of cookies
  const cookiesArrayLength = await (await context.cookies()).length

  // expect no cookies
  await expect(cookiesArrayLength).toBe(0)
});


test('When declining all cookies no scripts should be loaded', async ({ page, context }) => {
  await page.goto('https://www.tapio.one/');

  // deny cookies 
  await page.locator("data-testid=uc-deny-all-button").click();

  //expect no google-analytics script
  await expect(page.locator('script[src="https://www.google-analytics.com/analytics.js"]')).toHaveCount(0)

  // get quantity of cookies
  const cookiesArrayLength = await (await context.cookies()).length

  // expect no cookies
  await expect(cookiesArrayLength).toBe(0)
});

