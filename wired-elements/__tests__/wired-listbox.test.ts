import { TemplateResult } from 'lit-element';
import { expect, fixture, html } from '@open-wc/testing';
import { WiredListbox } from '../lib/wired-listbox';
import '../lib/wired-listbox';
import '../lib/wired-item';

interface WiredListboxElement extends WiredListbox {
  slotElement: HTMLSlotElement;
  items: Array<HTMLElement>;
}

describe('wired-listbox', () => {
  const __fixture = async (code: string | TemplateResult): Promise<WiredListboxElement> => {
    const element: WiredListboxElement = await fixture(code);

    // add missing attributes
    Object.defineProperties(element, {
      slotElement: {
        get() {
          return element.shadowRoot!.querySelector('#slot');
        }
      },
      items: {
        get() {
          return element.slotElement.assignedNodes()
            .filter(node => node instanceof HTMLElement);
        }
      }
    })
    return element;
  }

  const events: CustomEvent[] = [];
  const listener: (evt: Event) => void = evt => events.push(<CustomEvent>evt);
  const __addEventListener = (element: WiredListboxElement): void => {
    element.addEventListener('selected', listener);
  }
  const __removeEventListener = (element: WiredListboxElement): void => {
    element.removeEventListener('selected', listener);
  }

  it('should select listbox item on click', async () => {
    const element = await __fixture(html`
    <wired-listbox>
      <wired-item value="1">Item #1</wired-item>
      <wired-item value="2">Item #2</wired-item>
      <wired-item value="3">Item #3</wired-item>
    </wired-listbox>
    `);
    __addEventListener(element);
    element.items[1].click();

    // check that it's selected
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');

    // check that "selected" event is fired
    const evt = events.pop();
    expect(evt).to.exist;
    expect(evt!.detail.selected).to.be.equal("2");

    // cleanup
    __removeEventListener(element);
  });

  it('should display selected item by default', async function () {
    const element = await __fixture(html`
      <wired-listbox selected="1">
        <wired-item value="1">Item #1</wired-item>
        <wired-item value="2">Item #2</wired-item>
        <wired-item value="3">Item #3</wired-item>
      </wired-listbox>
    `);

    expect(element.items[0].getAttribute('aria-selected')).to.be.equal('true');
  });

  it('should update value from code', async function () {
    const element = await __fixture(html`
      <wired-listbox selected="1">
        <wired-item value="1">Item #1</wired-item>
        <wired-item value="2">Item #2</wired-item>
        <wired-item value="3">Item #3</wired-item>
      </wired-listbox>
    `);

    element.value = { value: '2', text: 'Item #2' };

    await element.updateComplete;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
  });

  it('should update selected from code', async function () {
    const element = await __fixture(html`
      <wired-listbox selected="1">
        <wired-item value="1">Item #1</wired-item>
        <wired-item value="2">Item #2</wired-item>
        <wired-item value="3">Item #3</wired-item>
      </wired-listbox>
    `);

    element.selected = '2';

    await element.updateComplete;
    expect(element.items[1].getAttribute('aria-selected')).to.be.equal('true');
  });
});
