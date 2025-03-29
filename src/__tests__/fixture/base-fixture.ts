import {
  expect as playwrightExpect,
  test as playwrightTest
} from '@playwright/test';
import { basePage, BasePage } from '../pageobject/base-page';
import { DsDialogFragment } from '../pageobject/ds-dialog-fragment';

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

