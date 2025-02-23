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

test('resize the blocks', async ({ page }) => {

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

test('switch to full screen, switch back, close the dialog and open again', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Choose data source...').click();
  await page.getByRole('button', { name: '[+]New' }).click();
  await page.locator('#source-type #textPanel').click();
  await page.getByRole('button', { name: 'WebWeb Crawler' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('http://example.com');
  await page.getByRole('textbox').press('Tab');
  await page.locator('wired-combo-lazy').press('ArrowDown');
  await page.getByRole('button', { name: 'simple single-page scrapper' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Remember original dialog's card size
  const [card_w0, card_h0] = await page.locator('.new-dialog #container > div > div > wired-card')
      .evaluate((element) => [element.clientWidth, element.clientHeight]);

  await page.getByRole('img', { name: 'Full Screen' }).click();

  // Check that dialog's card fit the window
  const [card_w, card_h] = await page.locator('.new-dialog #container > div > div > wired-card')
      .evaluate((element) => [element.clientWidth, element.clientHeight]);
  const [win_w, win_h] = await page.evaluate(() => [window.innerWidth, window.innerHeight]);
  expect(card_w).toEqual(win_w);
  expect(card_h).toEqual(win_h);

  await page.getByRole('img', { name: 'Full Screen' }).click();

  // Check that dialog's card restores its original size
  // TODO sh**ty monaco-editor doesn't keep initial height, fix it!
  const [card_w1, card_h1] = await page.locator('.new-dialog #container > div > div > wired-card')
      .evaluate((element) => [element.clientWidth, element.clientHeight]);
  expect(card_w1).toEqual(card_w0);
  // expect(card_h1).toEqual(card_h0);

  await page.getByRole('img', { name: 'Close' }).nth(1).click();
  await page.getByRole('combobox').locator('#text').click();
  await page.getByRole('button', { name: '[+]New' }).click();

  // Check that dialog's card has the same size as before
  const [card_w2, card_h2] = await page.locator('.new-dialog #container > div > div > wired-card')
      .evaluate((element) => [element.clientWidth, element.clientHeight]);
  expect(card_w2).toEqual(card_w1);
  expect(card_h2).toEqual(card_h1);
  // Check that svg follows thr card's size
  expect(await page.locator('.new-dialog #container > div > div > wired-card #overlay > svg')
      .evaluate((element) => element.clientHeight)).toBeGreaterThanOrEqual(card_h2);
});
