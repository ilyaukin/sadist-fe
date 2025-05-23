/**
 * All custom elements from packages will be here.
 * (inspired by {@link https://coryrylan.com/blog/how-to-use-web-components-with-typescript-and-react}).
 */
import { HTMLProps } from "react";
import "/wired-elements/lib/wired-elements";
import {
  WiredDivider,
  WiredSpinner,
  WiredItem,
  WiredListbox,
  WiredDialog,
  WiredCard,
  WiredButton,
  WiredCombo,
  WiredRadio,
  WiredInput,
  WiredSearchInput,
  WiredSlider,
  WiredCheckbox,
  WiredComboLazy,
  WiredBar,
  WiredMarker,
  WiredHistogram,
  WiredGlobe,
  WiredDualSlider,
  WiredTabs,
  WiredTab
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
      ['wired-radio']: CustomElementWithEvent<WiredRadio, 'change'>;
      ['wired-input']: CustomElementWithEvent<WiredInput, 'change' | 'input'>;
      ['wired-search-input']: CustomElementWithEvent<WiredSearchInput, 'change' | 'input' | 'close'>;
      ['wired-slider']: CustomElementWithEvent<WiredSlider, 'change' | 'input'>;
      ['wired-dual-slider']: CustomElementWithEvent<WiredDualSlider, 'change' | 'input'>;
      ['wired-checkbox']: CustomElementWithEvent<WiredCheckbox, 'change'>;
      ['wired-combo-lazy']: CustomElementWithEvent<WiredComboLazy, 'selected'>;
      ['wired-tab']: CustomElement<WiredTab>;
      ['wired-tabs']: CustomElement<WiredTabs>;
      ['wired-bar']: CustomElement<WiredBar>;
      ['wired-marker']: CustomElement<WiredMarker>;
      ['wired-histogram']: CustomElementWithEvent<WiredHistogram, 'selected'>;
      ['wired-globe']: CustomElementWithEvent<WiredGlobe, 'selected'>;
    }
  }
}
