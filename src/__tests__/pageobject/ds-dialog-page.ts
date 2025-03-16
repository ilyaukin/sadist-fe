import { Locator, Page, test as playwrightTest, expect as playwrightExpect } from '@playwright/test';

export interface BasePage extends Page {
  dsDialog: DsDialogFragment;

  land(url?: string): Promise<BasePage>;
  openDsDialog(): Promise<DsDialogFragment>;
}

export interface DsDialogFragment extends Locator {
  tab: Locator;
  editor: Locator;

  getEditorContent(): Promise<string>;

  setEditorContent(content: string): Promise<void>;
}

export const test = playwrightTest.extend<{ page: BasePage }>({
  page: async ({ page }, use) => use(basePage(page)),
});

export const expect = playwrightExpect.extend({
  async toBeOpen(dialog: DsDialogFragment) {
    const open = await dialog.getAttribute('open');
    return {
      pass: open !== null,
      message: () => `Expected ${dialog} ${open !== null ? 'not ' : ''}to be open`,
    }
  }
});

const basePage = (page: Page) => {
  const p: BasePage = Object.create(page);

  p.land = async function(url: string = '/') {
    await this.goto(url);
    return this;
  }

  p.openDsDialog = async function () {
    await this.locator('#ds').hover();
    await this.getByRole('img', { name: 'Filtering' }).click();

    return dsDialogFragment(this);
  }

  return p;
}

const dsDialogFragment = (page: Page) => {
  const p: DsDialogFragment = Object.create(page.locator('.ds-dialog'));

  p.tab = p.locator('wired-tabs wired-item');
  p.editor = p.getByRole('textbox', { name: 'Editor content' });

  const controlKey = process.platform === 'darwin' ? 'Meta' : 'Control';
  p.getEditorContent = async function () {
    // Focus > Ctrl+A > Ctrl+C > Read the buffer.
    // (this is dirty and platform-specific. but unless there is a better solution...)
    await this.editor.focus();
    await page.keyboard.press(controlKey + '+KeyA');
    await page.keyboard.press(controlKey + '+KeyC');
    const content = await page.evaluate(() => navigator.clipboard.readText());
    return content.replaceAll("\u00A0", '');
  }

  p.setEditorContent = async function (content: string) {
    await page.evaluate((data: string) => navigator.clipboard.writeText(data), content);
    await this.editor.focus();
    await this.editor.press(controlKey + '+KeyA');
    await this.editor.press(controlKey + '+KeyV');
  }

  return p;
}