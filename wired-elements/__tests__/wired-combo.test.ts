import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { TemplateResult } from "lit-element";
import { WiredCombo } from '../lib/wired-combo';
import '../lib/wired-combo';
import '../lib/wired-item';

interface WiredComboElement extends WiredCombo {
  container: HTMLElement;
  searchInput: HTMLInputElement;
  cardElement: HTMLElement;
  slotElement: HTMLSlotElement;
  items: Array<HTMLElement>;
}


describe('wired-combo', () => {
  let element: WiredComboElement;

  function __init_element(element: WiredComboElement) {
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
      slotElement: {
        get() {
          return element.shadowRoot!.querySelector('#slot');
        }
      },
      items: {
        get() {
          return element.slotElement.assignedNodes().filter(e => e instanceof HTMLElement);
        }
      },

    });
    return element;
  }

  const __fixture = async (code: string | TemplateResult) => {
    element = await fixture(code);

    // add missing attributes
    __init_element(element);
  }

  async function __fixture_fruits() {
    const code = html`
    <wired-combo>
      <wired-item value="apple">Apple</wired-item>
      <wired-item value="banana">Banana</wired-item>
      <wired-item value="cherry">Cherry</wired-item>
    </wired-combo>
    `
    await __fixture(code);
  }

  function __click_on_combo() {
    (element.shadowRoot!.querySelector('#text') as HTMLElement).click();
  }

  it('should show menu items on click', async () => {
    const code = html`
    <wired-combo>
      <wired-item value="apple">Apple</wired-item>
      <wired-item value="banana">Banana</wired-item>
    </wired-combo>
    `
    await __fixture(code);
    expect(element.cardElement).not.to.be.displayed;
    __click_on_combo();
    expect(element.cardElement).to.be.displayed;
  });

  it('should move to an item according to search input', async () => {
    await __fixture_fruits();
    __click_on_combo();
    expect(element.items.length).to.be.equal(3);
    expect(element.items[0].innerText).to.be.equal('Apple');
    expect(element.items[1].innerText).to.be.equal('Banana');
    expect(element.items[2].innerText).to.be.equal('Cherry');

    // non selected initially
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;

    // start typing
    await sendKeys({ type: 'ba' });
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;
  });

  it('should move back and forth by arrows', async () => {
    await __fixture_fruits();
    __click_on_combo();

    // non selected initially
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;

    // arrow down
    await sendKeys({ press: 'ArrowDown' })
    expect(element.items[0].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;

    // arrow down
    await sendKeys({ press: 'ArrowDown' })
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;

    // arrow up
    await sendKeys({ press: 'ArrowUp' });
    expect(element.items[0].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;
  });

  it('should move to an item according to search input (items added dynamically)', async () => {
    const code = html`
    <wired-combo>
    </wired-combo>
    `
    await __fixture(code);

    const addItem = (value: string, text: string) => {
      const item = document.createElement('wired-item');
      item.setAttribute('value', value);
      item.innerHTML = text;
      element.appendChild(item);
    }

    addItem('apple', 'Apple');
    addItem('banana', 'Banana');
    addItem('cherry', 'Cherry');

    await element.updateComplete;
    __click_on_combo();
    expect(element.items.length).to.be.equal(3);
    expect(element.items[0].innerText).to.be.equal('Apple');
    expect(element.items[1].innerText).to.be.equal('Banana');
    expect(element.items[2].innerText).to.be.equal('Cherry');

    // non selected initially
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;

    // start typing
    await sendKeys({ type: 'ba' });
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;
  });

  it('should render combo, cards and edit box of the same size', async () => {
    await __fixture_fruits();

    // have to expand items to get actual size
    __click_on_combo();

    const r1 = element.container.getBoundingClientRect();
    const r2 = element.cardElement.getBoundingClientRect();
    const r3 = element.searchInput.getBoundingClientRect();
    expect(r1.width).to.be.equal(r2.width);
    expect(r1.width).to.be.equal(r3.width + 34 /*dropdown width*/);
  });

  it('should display selected item by default', async function () {
    await __fixture(html`
      <wired-combo selected="banana">
        <wired-item value="apple">Apple</wired-item>
        <wired-item value="banana">Banana</wired-item>
        <wired-item value="cherry">Cherry</wired-item>
      </wired-combo>
    `);

    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });

  it('should display selected item when value changed from code', async function () {
    await __fixture(html`
      <wired-combo selected="banana">
        <wired-item value="apple">Apple</wired-item>
        <wired-item value="banana">Banana</wired-item>
        <wired-item value="cherry">Cherry</wired-item>
      </wired-combo>
    `);

    element.value = { value: 'apple', text: 'Apple' };

    await element.updateComplete;
    expect(element.items[0].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Apple');
  });

  it('should display selected item when selected changed from code', async function () {
    await __fixture(html`
      <wired-combo selected="banana">
        <wired-item value="apple">Apple</wired-item>
        <wired-item value="banana">Banana</wired-item>
        <wired-item value="cherry">Cherry</wired-item>
      </wired-combo>
    `);

    element.selected = 'apple';

    await element.updateComplete;
    expect(element.items[0].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Apple');
  });

  it('should display the last selected value after pressing Esc', async function () {
    await __fixture(html`
      <wired-combo selected="banana">
        <wired-item value="apple">Apple</wired-item>
        <wired-item value="banana">Banana</wired-item>
        <wired-item value="cherry">Cherry</wired-item>
      </wired-combo>
    `);
    __click_on_combo();

    // arrow down
    await sendKeys({ press: 'ArrowDown' });
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).to.be.equal('true');

    // esc
    await sendKeys({ press: 'Escape' });
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });

  it('should display the last selected value when the component lose the focus', async function () {
    await __fixture(html`
      <wired-combo selected="banana">
        <wired-item value="apple">Apple</wired-item>
        <wired-item value="banana">Banana</wired-item>
        <wired-item value="cherry">Cherry</wired-item>
      </wired-combo>
    `);
    __click_on_combo();

    // arrow down
    await sendKeys({ press: 'ArrowDown' });
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[2].getAttribute('aria-selected')).to.be.equal('true');

    // click to another element
    element.blur();
    expect(element.items[0].getAttribute('aria-selected')).not.to.exist;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
    expect(element.items[2].getAttribute('aria-selected')).not.to.exist;
    expect(element.shadowRoot!.querySelector('#text')!.textContent!.trim()).to.be.equal('Banana');
  });
});

