import { css, CSSResultArray, customElement, html, property, PropertyValues, TemplateResult } from 'lit-element';
import { fire } from './wired-lib';
import { BaseCSS, WiredBase } from "./wired-base";

interface WiredListboxItem extends HTMLElement {
  value: string;
  selected: boolean;
}

interface ListboxValue {
  value: string;
  text: string;
}

@customElement('wired-listbox')
export class WiredListbox extends WiredBase {
  @property({ type: Boolean }) horizontal = false;

  @property() get value(): ListboxValue | undefined {
    return this.selectedValue;
  }

  set value(value: ListboxValue | undefined) {
    this.select(value?.value);
    this.selectedValue = value;
    this.requestUpdate();
  }

  @property({ type: String }) get selected(): string {
    return this.selectedValue?.value || '';
  }

  set selected(selected: string | undefined) {
    this.select(selected);
    this.selectedValue = this.getListboxValue(this.selectedItem) ||
        ( selected ? { value: selected, text: '' } : undefined );
    this.requestUpdate();
  }

  private itemNodes: WiredListboxItem[] = [];
  private selectedItem?: WiredListboxItem;
  private selectedValue?: ListboxValue;
  private itemClickHandler = this.onItemClick.bind(this);

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          padding: 5px;
          outline: none;
        }

        :host(:focus) path {
          stroke-width: 1.5;
        }

        ::slotted(wired-item) {
          display: block;
        }

        :host(.wired-horizontal) ::slotted(wired-item) {
          display: inline-block;
        }

        #item-container {
          height: inherit;
          max-height: inherit;
          overflow-y: auto;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
      <div id="item-container">
        <slot id="slot" @slotchange="${(this.onSlotChanged)}"></slot>
      </div>
      <div id="overlay">
        <svg id="svg"></svg>
      </div>
    `;
  }

  firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)
    this.setAttribute(WiredListbox.SHAPE_ATTR, 'rectangle');
    this.setAttribute('role', 'listbox');
    this.tabIndex = +((this.getAttribute('tabindex') || 0));
    this.addEventListener('click', this.itemClickHandler);
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

  updated(_changed?: PropertyValues) {
    super.updated(_changed);
    if (this.horizontal) {
      this.classList.add('wired-horizontal');
    } else {
      this.classList.remove('wired-horizontal');
    }
  }

  private getItem(value: string | undefined = this.selected) {
    //first time look up item by "selected" attribute
    if (value) {
      return this.itemNodes.filter(node => node.value === value)[0];
    }
    return undefined;
  }

  private select(item: WiredListboxItem | string | undefined) {
    // if string, find an actual item
    if (typeof item == 'string') {
      item = this.getItem(item);
    }

    if (this.selectedItem) {
      this.selectedItem.selected = false;
      this.selectedItem.removeAttribute('aria-selected');
    }
    if (item) {
      item.selected = true;
      item.setAttribute('aria-selected', 'true');
    }
    this.selectedItem = item;
  }

  private fireSelected() {
    this.selectedValue = this.getListboxValue(this.selectedItem);
    fire(this, 'selected', { selected: this.selected });
  }

  private onItemClick(event: Event) {
    event.stopPropagation();
    this.select(event.target as WiredListboxItem);
    this.fireSelected();
  }

  private selectPrevious() {
    const item = this.selectedItem?.previousElementSibling ?
      this.selectedItem.previousElementSibling : this.itemNodes[this.itemNodes.length - 1];
    this.select(item as WiredListboxItem);
    this.fireSelected();
  }

  private selectNext() {
    const item = this.selectedItem?.nextElementSibling ?
      this.selectedItem.nextElementSibling : this.itemNodes[0];
    this.select(item as WiredListboxItem);
    this.fireSelected();
  }

  private onSlotChanged() {
    this.itemNodes = [];
    this.selectedItem = undefined;
    const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes();
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i] as WiredListboxItem;
        if (node.tagName === 'WIRED-ITEM') {
          node.setAttribute('role', 'option');
          this.itemNodes.push(node);
          if (node.value === this.selected) {
            this.select(node);
            this.selectedValue = this.getListboxValue(node);
          }
        }
      }
    }
    this.requestUpdate();
  }

  private getListboxValue(item: WiredListboxItem | undefined) {
    return item ? { value: item.value, text: item.textContent || '' } : undefined;
  }
}