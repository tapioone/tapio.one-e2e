 export async function IsInViewport(page: any, selector: string): Promise<boolean> {
    return page.$eval(selector, async element => {
        const visibleRatio: number = await new Promise(resolve => {
            const observer = new IntersectionObserver(entries => {
                resolve(entries[0].intersectionRatio);
                observer.disconnect();
            });
            observer.observe(element);
            requestAnimationFrame(() => {
            });
        });
        return visibleRatio > 0;
    });
}