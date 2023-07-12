import { TemplateResult } from 'lit-element';
import { expect, fixture, html } from '@open-wc/testing';
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

  let elementus: WiredComboLazyElement;

  const __fixture = async (code: string | TemplateResult) => {
    elementus = await fixture<WiredComboLazyElement>(code);

    // add missing attributes
    Object.defineProperties(elementus, {
      container: {
        get() {
          return elementus.shadowRoot!.querySelector("#container");
        }
      },
      searchInput: {
        get() {
          return elementus.shadowRoot!.querySelector("#searchInput");
        }
      },
      cardElement: {
        get() {
          return elementus.shadowRoot!.querySelector('wired-card');
        }
      },
      itemContainer: {
        get() {
          return elementus.shadowRoot!.querySelector("#itemContainer");
        }
      },
      items: {
        get() {
          let result = [];
          for (let e = elementus.itemContainer.firstElementChild; e; e = e.nextElementSibling) {
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
    ( elementus.shadowRoot!.querySelector('#text') as HTMLElement ).click();
  }

  it('should show menu items on click', async () => {
    await __fixture_fruits();

    __click_on_combo();
    expect(elementus.cardElement).to.be.displayed;
    expect(elementus.items.length).to.be.equal(3);
    expect(elementus.items[0].innerText).to.be.equal('Apple');
    expect(elementus.items[1].innerText).to.be.equal('Banana');
    expect(elementus.items[2].innerText).to.be.equal('Cherry');
  });

  it('should display selected item by default', async function () {
    await __fixture_fruits('banana');

    expect(elementus.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });

  it('should display selected item when value changed from code', async function () {
    await __fixture_fruits();

    elementus.value = { value: 'banana', text: 'Banana' };

    await elementus.updateComplete;
    expect(elementus.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });
})