import { Locator, Page } from '@playwright/test';
import { editorFragment, EditorFragment } from './editor-fragment';

export interface DsDialogFragment extends Locator {
  tab: Locator;
  editor: EditorFragment;
}

export const dsDialogFragment = (page: Page) => {
  const p: DsDialogFragment = Object.create(page.locator('.ds-dialog'));

  p.tab = p.locator('wired-tabs wired-item');
  p.editor = editorFragment(page, p);

  return p;
}