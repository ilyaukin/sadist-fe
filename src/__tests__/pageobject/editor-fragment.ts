import { Locator, Page } from '@playwright/test';

export interface EditorFragment extends Locator {
  getContent(): Promise<string>;

  setContent(content: string): Promise<void>;
}

export const editorFragment = (page: Page, parent: Page | Locator) => {
  const p: EditorFragment = Object.create(parent.getByRole('textbox', { name: 'Editor content' }));

  const controlKey = process.platform === 'darwin' ? 'Meta' : 'Control';
  p.getContent = async function () {
    // Focus > Ctrl+A > Ctrl+C > Read the buffer.
    // (this is dirty and platform-specific. but unless there is a better solution...)
    await this.focus();
    await page.keyboard.press(controlKey + '+KeyA');
    await page.keyboard.press(controlKey + '+KeyC');
    const content = await page.evaluate(() => navigator.clipboard.readText());
    return content.replaceAll("\u00A0", '');
  }

  p.setContent = async function (content: string) {
    await page.evaluate((data: string) => navigator.clipboard.writeText(data), content);
    await this.focus();
    await this.press(controlKey + '+KeyA');
    await this.press(controlKey + '+KeyV');
  }

  return p;
}