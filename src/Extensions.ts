import { Page, test as base } from "@playwright/test";
import { PageObject } from "./PageObject";

export const test = base.extend<{
  page: Page & { isInViewPort: (selector: string) => boolean },
  pageObject: PageObject
}>({
  page: async ({ page }, use) => {
    (page as any).isInViewPort = async (selector) => {
      return page.$eval(selector, async (element) => {
        const visibleRatio: number = await new Promise((resolve) => {
          const observer = new IntersectionObserver((entries) => {
            resolve(entries[0].intersectionRatio);
            observer.disconnect();
          });
          observer.observe(element);
          requestAnimationFrame(() => {});
        });
        return visibleRatio > 0;
      });
    };
    await use(page);
  },
  pageObject: async ({ page}, use) => {
    const pageObject = new PageObject(page);
    await use(pageObject);
  }
});
