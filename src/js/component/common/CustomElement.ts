/**
 * All custom elements from packages will be here.
 * (inspired by {@link https://coryrylan.com/blog/how-to-use-web-components-with-typescript-and-react}).
 */
import { ClassAttributes, DOMAttributes } from "react";
import '/packages/wired-spinner';
import { WiredSpinner } from '/packages/wired-spinner';
import '/packages/wired-listbox';
import { WiredListbox } from '/packages/wired-listbox';
import '/packages/wired-item';
import { WiredItem } from '/packages/wired-item';
import '/packages/wired-dialog';
import { WiredDialog } from "/packages/wired-dialog";
import '/packages/wired-card';
import { WiredCard } from '/packages/wired-card';
import '/packages/wired-button';
import { WiredButton } from '/packages/wired-button';
import '/packages/wired-divider';
import { WiredDivider } from '/packages/wired-divider';
import '/packages/wired-combo'
import { WiredCombo } from "/packages/wired-combo";
import '/packages/wired-radio';
import { WiredRadio } from '/packages/wired-radio';
import '/packages/wired-radio-group';
import { WiredRadioGroup } from '/packages/wired-radio-group';
import '/packages/wired-input';
import { WiredInput } from '/packages/wired-input';
import '/packages/wired-checkbox';
import { WiredCheckbox } from '/packages/wired-checkbox';
import '/packages/wired-combo-lazy';
import { WiredComboLazy } from '/packages/wired-combo-lazy';

type CustomElement<T> = Partial<Partial<T> & DOMAttributes<T> & ClassAttributes<T> & { children: any; }>;
type CustomElementWithEvent<T, K extends string> = CustomElement<T> & { [k in `on${K}`]?: (e: CustomEvent) => void };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['wired-divider']: CustomElement<WiredDivider>;
      ['wired-spinner']: CustomElement<WiredSpinner>;
      ['wired-item']: CustomElement<WiredItem>;
      ['wired-listbox']: CustomElementWithEvent<WiredListbox, 'selected'>;
      ['wired-dialog']: CustomElement<WiredDialog>;
      ['wired-card']: CustomElement<WiredCard>;
      ['wired-button']: CustomElement<WiredButton>;
      ['wired-combo']: CustomElementWithEvent<WiredCombo, 'selected'>;
      ['wired-radio']: CustomElement<WiredRadio>;
      ['wired-radio-group']: CustomElementWithEvent<WiredRadioGroup, 'selected'>;
      ['wired-input']: CustomElement<WiredInput>;
      ['wired-checkbox']: CustomElementWithEvent<WiredCheckbox, 'change'>;
      ['wired-combo-lazy']: CustomElementWithEvent<WiredComboLazy, 'selected'>;
    }
  }
}
