import {
  css,
  CSSResultArray,
  customElement,
  html,
  property, PropertyValues,
  query,
  TemplateResult
} from 'lit-element';
import { ellipse, fire, Point, svgNode } from './wired-lib';
import { BaseCSS, WiredBase } from './wired-base';

@customElement('wired-radio')
export class WiredRadio extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) name?: string;
  @property({ type: String, reflect: true }) value?: string;
  @property() private focused = false;

  @query('input') private input?: HTMLInputElement;

  private svgCheck?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          font-family: inherit;
        }

        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }

        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }

        #container {
          display: flex;
          flex-direction: row;
          position: relative;
          user-select: none;
          min-height: 24px;
          cursor: pointer;
        }

        span {
          margin-left: 1.5ex;
          line-height: 24px;
        }

        input {
          opacity: 0;
        }

        path {
          stroke: var(--wired-radio-icon-color, currentColor);
          stroke-width: var(--wired-radio-default-swidth, 0.7);
        }

        g path {
          stroke-width: 0;
          fill: var(--wired-radio-icon-color, currentColor);
        }

        #container.focused {
          --wired-radio-default-swidth: 1.5;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
      <label id="container" class="${this.focused ? 'focused' : ''}">
        <input
          type="radio" name="${this.name}" value="${this.value}"
          .checked="${this.checked}" ?disabled="${this.disabled}"
          @change="${this.onChange}"
          @focus="${() => this.focused = true}"
          @blur="${() => this.focused = false}">
        <span><slot></slot></span>
        <div id="overlay">
          <svg data-wired-shape="ellipse"></svg>
        </div>
      </label>
    `;
  }

  updated(_changed?: PropertyValues) {
    super.updated(_changed);
    this.refreshCheckVisibility();
  }

  protected getSize(): Point {
    return [24, 24];
  }

  protected renderWiredShapes() {
    super.renderWiredShapes();
    this.svgCheck = svgNode('g');
    this.svg!.appendChild(this.svgCheck);
    const size = this.getSize();
    const iw = Math.max(size[0] * 0.6, 5);
    const ih = Math.max(size[1] * 0.6, 5);
    ellipse(this.svgCheck, size[0] / 2, size[1] / 2, iw, ih);
  }

  focus() {
    if (this.input) {
      this.input.focus();
    } else {
      super.focus();
    }
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshCheckVisibility();
    if (this.checked) {
      document.querySelectorAll(`wired-radio[name="${this.name}"]`).forEach(( element => {
        if (element != this) {
          ( element as WiredRadio ).checked = false;
        }
      } ));
    }
    fire(this, 'change', { checked: this.checked });
  }

  private refreshCheckVisibility() {
    if (this.svgCheck) {
      this.svgCheck.style.display = this.checked ? '' : 'none';
    }
  }
}