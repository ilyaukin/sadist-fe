import { test } from './base-fixture';
import { NewDialogFragment } from '../pageobject/new-dialog-fragment';

export const webCrawlerProviderTest = test.extend<{ newDialog: NewDialogFragment }>({
  newDialog: async ({ page }, use) => {
    await page.land('/');
    const newDialog = await page.openNewDialog();
    await newDialog.chooseWebCrawler();
    await newDialog.setupWebCrawler();
    await newDialog.next();

    return use(newDialog);
  },
});
