/**
 * All custom elements from packages will be here.
 * (inspired by {@link https://coryrylan.com/blog/how-to-use-web-components-with-typescript-and-react}).
 */
import { HTMLProps } from "react";
import "/wired-elements/lib/wired-elements";
import {
  WiredDivider, WiredSpinner, WiredItem, WiredListbox, WiredDialog,
  WiredCard, WiredButton, WiredCombo, WiredRadio, WiredRadioGroup,
  WiredInput, WiredSearchInput, WiredCheckbox, WiredComboLazy,
  WiredBar, WiredMarker, WiredHistogram, WiredGlobe
} from '/wired-elements/lib/wired-elements';

type CustomElement<T> = Partial<Omit<T, keyof HTMLElement> & Omit<HTMLProps<T>, keyof Omit<T, keyof HTMLElement>>>;
type CustomElementWithEvent<T, K extends string> =
    CustomElement<T>
    & { [k in `on${K}`]?: (e: CustomEvent) => void };

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
      ['wired-search-input']: CustomElementWithEvent<WiredSearchInput, 'close'>;
      ['wired-checkbox']: CustomElementWithEvent<WiredCheckbox, 'change'>;
      ['wired-combo-lazy']: CustomElementWithEvent<WiredComboLazy, 'selected'>;
      ['wired-bar']: CustomElement<WiredBar>;
      ['wired-marker']: CustomElement<WiredMarker>;
      ['wired-histogram']: CustomElementWithEvent<WiredHistogram, 'selected'>;
      ['wired-globe']: CustomElementWithEvent<WiredGlobe, 'selected'>;
    }
  }
}
