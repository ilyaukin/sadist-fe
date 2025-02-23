import { expect, Frame, test } from '@playwright/test';

let onWebpackOverlay = (frame: Frame) => {
  let promise = frame
      .$('#webpack-dev-server-client-overlay-div')
      .then((element) => element?.innerText())
      .then((content) => {
        if (typeof content === 'string' && content.includes('Uncaught runtime errors:\n')) {
          throw new Error(content);
        }
      }, () => {
        /* not a webpack error frame */
      });
  onWebpackOverlayPromise.push(promise);
};

let onWebpackOverlayPromise: any[] = [];

test.beforeEach(({ page }) => {
  page.on('frameattached', onWebpackOverlay);
});

test.afterEach(async ({ page }) => {
  await Promise.all(onWebpackOverlayPromise);
  page.off('frameattached', onWebpackOverlay);
})

test('test', async ({ page }) => {

  await page.goto('/');
  await page.getByText('Choose data source...').click();
  await page.getByRole('button', { name: '[+]New' }).click();
  await page.locator('#source-type #textPanel').click();
  await page.getByRole('button', { name: 'WebWeb Crawler' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('http://example.com');
  await page.getByRole('textbox').press('Tab');
  await page.locator('wired-combo-lazy').press('ArrowDown');
  await page.locator('wired-combo-lazy #searchInput').press('Enter');
  await page.getByRole('button', { name: 'Next' }).click();

  // Remember right block width
  const w0 = await page.locator('.site-html-tree-block').evaluate(
      (element) => element.clientWidth,
  );
  const w_editor0 = await page.locator('#script .monaco-editor').evaluate(
      (element) => element.clientWidth,
  );

  // Click vertical divider
  await page.locator('.new-dialog .dialog-content div > div:nth-child(2) wired-divider').first().dblclick();

  // New size
  const w1 = await page.locator('.site-html-tree-block').evaluate(
      (element) => element.clientWidth,
  );
  const w_editor1 = await page.locator('#script .monaco-editor').evaluate(
      (element) => element.clientWidth,
  );
  expect(w1).toBeGreaterThan(w0);
  expect(w_editor1).toBeGreaterThan(w_editor0);

  // Bug: it crawls to the right indefinitely...
  await page.waitForTimeout(500);
  const w2 = await page.locator('.site-html-tree-block').evaluate(
      (element) => element.clientWidth,
  );
  const w_editor2 = await page.locator('#script .monaco-editor').evaluate(
      (element) => element.clientWidth,
  )
  expect(w2).toEqual(w1);
  expect(w_editor2).toEqual(w_editor1);
});