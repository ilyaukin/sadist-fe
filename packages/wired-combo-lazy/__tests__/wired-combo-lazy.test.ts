import { TemplateResult } from 'lit-element';
import { expect, fixture, html } from '@open-wc/testing';
import '..';
import '../../wired-item';

interface WiredComboLazyElement {
  shadowRoot: HTMLElement;
  container: HTMLElement;
  searchInput: HTMLInputElement;
  card: HTMLElement;
  itemContainer: HTMLElement;
  items: HTMLElement[];
}

describe('wired-combo-lazy', () => {

  let elementus: WiredComboLazyElement;

  const __fixture = async (code: string | TemplateResult) => {
    // @ts-ignore
    elementus = await fixture(code);

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
      card: {
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
    console.log(elementus.items)
    expect(elementus.card).to.be.displayed;
    expect(elementus.items.length).to.be.equal(3);
    expect(elementus.items[0].innerText).to.be.equal('Apple');
    expect(elementus.items[1].innerText).to.be.equal('Banana');
    expect(elementus.items[2].innerText).to.be.equal('Cherry');
  });

  it('should display selected item by default', async function () {
    await __fixture_fruits('banana');

    expect(elementus.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });
})