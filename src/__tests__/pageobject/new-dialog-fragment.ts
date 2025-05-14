import { Locator, Page } from '@playwright/test';
import { editorFragment, EditorFragment } from './editor-fragment';

export interface NewDialogFragment extends Locator {
  url: Locator;
  template: Locator;
  // TODO should it be on a separate fragment?
  editor: EditorFragment;

  chooseWebCrawler(): Promise<void>;

  setupWebCrawler(): Promise<void>;

  next(): Promise<void>;
}

export function newDialogFragment(page: Page) {
  const p: NewDialogFragment = Object.create(page.locator('.new-dialog'));

  p.url = page.locator('#webcrawler-provider-url input');
  p.template = page.locator('#webcrawler-provider-template');
  p.editor = editorFragment(page, p);

  p.chooseWebCrawler = async function () {
    await page.locator('#source-type #textPanel').click();
    await page.getByRole('button', { name: 'WebWeb Crawler' }).click();
  }

  p.setupWebCrawler = async function () {
    await this.url.click();
    await this.url.fill('http://example.com');
    await this.url.press('Tab');
    await this.template.press('ArrowDown');
    await this.template.locator('#searchInput').press('Enter');
  }

  p.next = async function () {
    await page.getByRole('button', { name: 'Next' }).click();
  }

  return p;
}
