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
