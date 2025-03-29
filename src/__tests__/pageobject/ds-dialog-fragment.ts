import { Locator, Page } from '@playwright/test';

export interface DsDialogFragment extends Locator {
  tab: Locator;
  editor: Locator;

  getEditorContent(): Promise<string>;

  setEditorContent(content: string): Promise<void>;
}

export const dsDialogFragment = (page: Page) => {
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