import { Page } from '@playwright/test';

import { dsDialogFragment, DsDialogFragment } from './ds-dialog-fragment';
import { newDialogFragment, NewDialogFragment } from './new-dialog-fragment';

export interface BasePage extends Page {
  dsDialog?: DsDialogFragment;
  newDialog?: NewDialogFragment;

  land(url?: string): Promise<BasePage>;

  openDsDialog(): Promise<DsDialogFragment>;

  openNewDialog(): Promise<NewDialogFragment>;
}

export const basePage = (page: Page) => {
  const p: BasePage = Object.create(page);

  p.land = async function (url: string = '/') {
    await this.goto(url);
    return this;
  }

  p.openDsDialog = async function () {
    await this.locator('#ds').hover();
    await this.getByRole('img', { name: 'Filtering' }).click();

    return dsDialogFragment(this);
  }

  p.openNewDialog = async function() {
    await page.locator('#ds > wired-combo #text').click();
    await page.getByRole('button', { name: '[+]New' }).click();

    return newDialogFragment(this);
  }

  return p;
}