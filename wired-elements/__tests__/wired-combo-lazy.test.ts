import { TemplateResult } from 'lit-element';
import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { WiredComboLazy } from '../lib/wired-combo-lazy';
import '../lib/wired-combo-lazy';
import '../lib/wired-item';

interface WiredComboLazyElement extends WiredComboLazy {
  container: HTMLElement;
  searchInput: HTMLInputElement;
  cardElement: HTMLElement;
  itemContainer: HTMLElement;
  items: HTMLElement[];
}

describe('wired-combo-lazy', () => {

  let element: WiredComboLazyElement;

  const __fixture = async (code: string | TemplateResult) => {
    element = await fixture<WiredComboLazyElement>(code);

    // add missing attributes
    Object.defineProperties(element, {
      container: {
        get() {
          return element.shadowRoot!.querySelector("#container");
        }
      },
      searchInput: {
        get() {
          return element.shadowRoot!.querySelector("#searchInput");
        }
      },
      cardElement: {
        get() {
          return element.shadowRoot!.querySelector('wired-card');
        }
      },
      itemContainer: {
        get() {
          return element.shadowRoot!.querySelector("#itemContainer");
        }
      },
      items: {
        get() {
          let result = [];
          for (let e = element.itemContainer.firstElementChild; e; e = e.nextElementSibling) {
            result.push(e);
          }
          return result;
        }
      },
    });
  }

  async function __fixture_fruits(selected?: string) {
    const values = [
      { value: 'apple', text: 'Apple' },
      { value: 'banana', text: 'Banana' },
      { value: 'cherry', text: 'Cherry' },
    ]

    const code = html`
      <wired-combo-lazy values="${JSON.stringify(values)}"
                        selected="${selected}">
      </wired-combo-lazy>
    `
    await __fixture(code);
  }

  function __click_on_combo() {
    ( element.shadowRoot!.querySelector('#text') as HTMLElement ).click();
  }

  it('should show menu items on click', async () => {
    await __fixture_fruits();

    __click_on_combo();
    expect(element.cardElement).to.be.displayed;
    expect(element.items.length).to.be.equal(3);
    expect(element.items[0].innerText).to.be.equal('Apple');
    expect(element.items[1].innerText).to.be.equal('Banana');
    expect(element.items[2].innerText).to.be.equal('Cherry');
  });

  it('should display selected item by default', async function () {
    await __fixture_fruits('banana');

    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });

  it('should display selected item when value changed from code', async function () {
    await __fixture_fruits();

    element.value = { value: 'banana', text: 'Banana' };

    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });

  it('should display selected item when selected changed from code', async function () {
    await __fixture_fruits('banana');

    element.selected = 'apple';

    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Apple');
  });

  it('should display the last selected value after pressing Esc', async function () {
    await __fixture_fruits('banana');
    __click_on_combo();

    // arrow down
    await sendKeys({ press: 'ArrowDown' });

    // esc
    await sendKeys({ press: 'Escape' });
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });

  it('should display the last selected value when the component lose the focus', async function () {
    await __fixture_fruits('banana');
    __click_on_combo();

    // arrow down
    await sendKeys({ press: 'ArrowDown' });

    // click to another element
    // element.blur();
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });
});
