import { css, CSSResult, customElement, html, LitElement, property, PropertyValues, TemplateResult } from 'lit-element';
import { fire } from './wired-lib';

interface RadioItem extends HTMLElement {
  name: string;
  checked: boolean;
}

@customElement('wired-radio-group')
export class WiredRadioGroup extends LitElement {
  @property({ type: String }) selected?: string;
  private radioNodes: RadioItem[] = [];
  private selectedNode?: RadioItem;
  private checkListener = this.handleChecked.bind(this);

  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
        font-family: inherit;
        outline: none;
      }
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    `;
  }

  render(): TemplateResult {
    return html`<slot id="slot" @slotchange="${this.slotChange}"></slot>`;
  }

  firstUpdated() {
    this.setAttribute('role', 'radiogroup');
    this.tabIndex = +(this.getAttribute('tabindex') || 0);
    this.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
        case 38:
          event.preventDefault();
          this.selectPrevious();
          break;
        case 39:
        case 40:
          event.preventDefault();
          this.selectNext();
          break;
      }
    });
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    if (_changedProperties.has('selected')){
      const item = this.radioNodes.find(node => node.name === this.selected);
      if (this.selectedNode && this.selectedNode != item) {
        this.selectedNode.checked = false;
      }
      if (item) {
        item.checked = true;
      }
      this.selectedNode = item;
    }
  }

  private handleChecked(event: Event) {
    const checked = (event as CustomEvent).detail.checked;
    const item = event.target as RadioItem;
    const name = item.name || '';
    if (checked) {
      if (this.selectedNode && this.selectedNode != item){
        this.selectedNode.checked = false;
      }
      this.selectedNode = item;
      this.selected = name;
      this.fireSelected();
    } else {
      // item in radio group cannot be unchecked,
      // without checking the other item
      item.checked = true;
    }
  }

  private slotChange() {
    for (let node of this.radioNodes) {
      node.removeEventListener('change', this.checkListener);
    }

    const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    this.radioNodes = [];
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const element = nodes[i] as RadioItem;
        if (element.tagName === 'WIRED-RADIO') {
          this.radioNodes.push(element);
          const name = element.name || '';
          if (this.selected && (name === this.selected)) {
            element.checked = true;
            this.selectedNode = element;
          } else {
            element.checked = false;
          }
          element.addEventListener('change', this.checkListener);
        }
      }
    }
    this.requestUpdate();
  }

  private selectPrevious() {
    const list = this.radioNodes;
    if (list.length) {
      let radio = null;
      let index = -1;
      if (this.selected) {
        for (let i = 0; i < list.length; i++) {
          const n = list[i];
          if (n.name === this.selected) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          radio = list[0];
        } else {
          index--;
          if (index < 0) {
            index = list.length - 1;
          }
          radio = list[index];
        }
      } else {
        radio = list[0];
      }
      if (radio) {
        radio.focus();
        this.selected = radio.name;
        this.selectedNode = radio;
        this.fireSelected();
      }
    }
  }

  private selectNext() {
    const list = this.radioNodes;
    if (list.length) {
      let radio = null;
      let index = -1;
      if (this.selected) {
        for (let i = 0; i < list.length; i++) {
          const n = list[i];
          if (n.name === this.selected) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          radio = list[0];
        } else {
          index++;
          if (index >= list.length) {
            index = 0;
          }
          radio = list[index];
        }
      } else {
        radio = list[0];
      }
      if (radio) {
        radio.focus();
        this.selected = radio.name;
        this.selectedNode = radio;
        this.fireSelected();
      }
    }
  }

  private fireSelected() {
    fire(this, 'selected', { selected: this.selected });
  }
}