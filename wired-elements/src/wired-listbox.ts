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
  @property({ type: Boolean }) multiple = false;

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
  private baseIndex = 0;
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
          this.selectPrevious(event);
          break;
        case 39:
        case 40:
          event.preventDefault();
          this.selectNext(event);
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

  private getItem(value: string | undefined) {
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

    if (!this.multiple && this.selectedItem) {
      this.unsetSelected(this.selectedItem);
    }
    if (item) {
      this.setSelected(item);
    }
    this.selectedItem = item;
  }

  private setSelected(item: WiredListboxItem) {
    item.selected = true;
    item.setAttribute('aria-selected', 'true');
  }

  private unsetSelected(item: WiredListboxItem) {
    item.selected = false;
    item.removeAttribute('aria-selected');
  }

  private fireSelected() {
    this.selectedValue = this.getListboxValue(this.selectedItem);
    fire(this, 'selected', { selected: this.selected });
  }

  private getItemIndex(item: WiredListboxItem) {
    return this.itemNodes.findIndex(i => Object.is(i, item));
  }

  private selectRange(item: WiredListboxItem) {
    const itemIndex = this.getItemIndex(item);
    const baseIndex = this.baseIndex;
    const inRange = itemIndex < baseIndex ?
        (i: number) => itemIndex <= i && i <= baseIndex :
        (i: number) => baseIndex <= i && i <= itemIndex;
    this.itemNodes.forEach((itemNode, i) => {
      if (itemNode.selected && !inRange(i)) {
        this.unsetSelected(itemNode);
      }
      if (!itemNode.selected && inRange(i)) {
        this.setSelected(itemNode);
      }
    });
    this.select(item);
  }

  private selectSingle(item: WiredListboxItem) {
    this.itemNodes.forEach((itemNode) => {
      if (itemNode.selected && !Object.is(itemNode, item)) {
        this.unsetSelected(itemNode);
      }
    });
    this.select(item);
    this.baseIndex = this.getItemIndex(item);
  }

  private onItemClick(event: Event) {
    event.stopPropagation();
    if ((event.target as HTMLElement).tagName !== 'WIRED-ITEM') {
      return;
    }
    const item = event.target as WiredListboxItem;
    if (!this.multiple) {
      this.select(item);
    } else if (( event as MouseEvent ).ctrlKey) {
      // ctrl is held: inverse clicked item selection. keep others. change base
      if (item.selected) {
        this.unsetSelected(item);
      } else {
        this.select(item);
      }
      this.baseIndex = this.getItemIndex(item);
    } else if (( event as MouseEvent ).shiftKey) {
      // shift is held: select a range between the last selected item (base),
      // and clicked item
      this.selectRange(item);
    } else {
      // change selection to the current item, like without multiple
      this.selectSingle(item);
    }
    this.fireSelected();
  }

  private selectPrevious(event: KeyboardEvent) {
    const i = this.selectedItem ? this.getItemIndex(this.selectedItem) : -1;
    const j = 0 < i && i < this.itemNodes.length ? i - 1 :
        (!this.multiple ? this.itemNodes.length - 1 : 0);
    if (!this.multiple) {
      this.select(this.itemNodes[j]);
      this.fireSelected();
    } else if (event.ctrlKey) {
      this.baseIndex = j;
    } else if (event.shiftKey) {
      this.selectRange(this.itemNodes[j]);
      this.fireSelected();
    } else {
      this.selectSingle(this.itemNodes[j]);
      this.fireSelected();
    }
  }

  private selectNext(event: KeyboardEvent) {
    const i = this.selectedItem ? this.getItemIndex(this.selectedItem) : -1;
    const j = 0 <= i && i < this.itemNodes.length - 1 ? i + 1 :
        (!this.multiple ? 0 : this.itemNodes.length - 1);
    if (!this.multiple) {
      this.select(this.itemNodes[j]);
      this.fireSelected();
    } else if (event.ctrlKey) {
      this.baseIndex = j;
    } else if (event.shiftKey) {
      this.selectRange(this.itemNodes[j]);
      this.fireSelected();
    } else {
      this.selectSingle(this.itemNodes[j]);
      this.fireSelected();
    }
  }

  private onSlotChanged() {
    this.itemNodes = [];
    this.selectedItem = undefined;
    this.baseIndex = 0;
    const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes();
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i] as WiredListboxItem;
        if (node.tagName === 'WIRED-ITEM') {
          node.setAttribute('role', 'option');
          this.itemNodes.push(node);
          if (!this.multiple && node.value === this.selected) {
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