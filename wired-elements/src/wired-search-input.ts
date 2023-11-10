import {
  css,
  CSSResultArray,
  customElement,
  html,
  property,
  PropertyValues,
  query,
  TemplateResult
} from 'lit-element';
import { ellipse, fire, line, svgNode } from './wired-lib';
import { BaseCSS, WiredBase } from './wired-base';

@customElement('wired-search-input')
export class WiredSearchInput extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) placeholder = '';
  @property({ type: String }) autocomplete = '';
  @property({ type: String }) autocorrect = '';
  @property({ type: Boolean }) autofocus = false;

  @query('input') private textInput?: HTMLInputElement;

  private pendingValue?: string;
  private pendingFocus?: boolean;
  private searchIcon?: SVGElement;
  private closeIcon?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: sans-serif;
          width: 180px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }
        
        input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
        input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          display: none;
        }

        .thicker path {
          stroke-width: 1.5;
        }

        button {
          position: absolute;
          top: 0;
          right: 2px;
          width: 32px;
          height: 100%;
          box-sizing: border-box;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          opacity: 0;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <input type="search" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" 
      autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" 
      @change="${this.refire}" @input="${this.refire}">
    <div id="overlay">
      <svg></svg>
    </div>
    <button @click="${() => this.onClose()}"></button>
    `;
  }

  get input(): HTMLInputElement | undefined {
    return this.textInput;
  }

  get value(): string {
    const input = this.input;
    return (input && input.value) || '';
  }

  set value(v: string) {
    const input = this.input;
    if (input) {
      input.value = v;
      this.refreshIconState();
    } else {
      this.pendingValue = v;
    }
  }

  firstUpdated(_changed: PropertyValues) {
    super.firstUpdated(_changed);
    this.setAttribute(WiredBase.SHAPE_ATTR, 'rectangle:offset=2');
    this.value = this.pendingValue || this.value || this.getAttribute('value') || '';
    delete this.pendingValue;
    if (this.pendingFocus) {
      this.focus();
      delete this.pendingFocus;
    }
  }

  updated(_changed?: PropertyValues) {
    super.updated(_changed);
    this.refreshIconState();
  }

  protected renderWiredShapes() {
    super.renderWiredShapes();

    const size = this.getSize();
    this.searchIcon = svgNode('g');
    this.searchIcon.classList.add('thicker');
    this.svg!.appendChild(this.searchIcon);
    ellipse(this.searchIcon, size[0] - 30, (size[1] - 30) / 2 + 10, 20, 20);
    line(this.searchIcon, size[0] - 10, (size[1] - 30) / 2 + 30, size[0] - 25, (size[1] - 30) / 2 + 15);

    this.closeIcon = svgNode('g');
    this.closeIcon.classList.add('thicker');
    this.svg!.appendChild(this.closeIcon);
    line(this.closeIcon, size[0] - 33, (size[1] - 30) / 2 + 2, size[0] - 7, (size[1] - 30) / 2 + 28);
    line(this.closeIcon, size[0] - 7, (size[1] - 30) / 2 + 2, size[0] - 33, (size[1] - 30) / 2 + 28);
  }

  focus(options?: FocusOptions) {
    const input = this.input;
    if (input) {
      input.focus(options);
    } else {
      this.pendingFocus = true;
    }
  }

  private refreshIconState() {
    if (this.searchIcon && this.closeIcon) {
      this.searchIcon.style.display = this.value.trim() ? 'none' : '';
      this.closeIcon.style.display = this.value.trim() ? '' : 'none';
    }
  }

  private refire(event: Event) {
    this.refreshIconState();
    event.stopPropagation();
    fire(this, event.type, { sourceEvent: event });
  }

  private onClose() {
    this.value = '';
    fire(this, 'close', {});
  }
}