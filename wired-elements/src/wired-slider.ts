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
import { BaseCSS, WiredBase } from './wired-base';
import { ellipse, fire, formatDate, formatNumber, line } from './wired-lib';

@customElement('wired-slider')
export class WiredSlider extends WiredBase {
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) greyed = false;
  @property({ type: Boolean }) ['label-enabled'] = false;
  @property({ type: String }) ['label-format'] = 'number';
  @property({ type: String }) ['label-orientation'] = 'left';

  @query('input') private input?: HTMLInputElement;
  @query('.label') private label?: HTMLLabelElement;
  private knob?: SVGElement;
  private pendingValue?: number;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
          :host {
              display: inline-block;
              position: relative;
              width: 300px;
              box-sizing: border-box;
          }

          :host([disabled]), :host([greyed]) {
              opacity: 0.45 !important;
              background: rgba(0, 0, 0, 0.07);
              border-radius: 5px;
          }

          :host([disabled]) {
              cursor: default;
              pointer-events: none;
          }

          input[type=range] {
              -webkit-appearance: none;
              width: 100%;
              height: 40px;
              box-sizing: border-box;
              margin: 0;
              background: transparent;
              outline: none;
              position: relative;
          }

          input[type=range]:focus {
              outline: none;
          }

          input[type=range]::-ms-track {
              width: 100%;
              cursor: pointer;
              background: transparent;
              border-color: transparent;
              color: transparent;
          }

          input[type=range]::-moz-focus-outer {
              outline: none;
              border: 0;
          }

          input[type=range]::-moz-range-thumb {
              -webkit-appearance: none;
              pointer-events: all;
              border-radius: 50px;
              background: none;
              cursor: pointer;
              border: none;
              margin: 0;
              height: 20px;
              width: 20px;
              line-height: 1;
          }

          input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              pointer-events: all;
              border-radius: 50px;
              background: none;
              cursor: pointer;
              border: none;
              height: 20px;
              width: 20px;
              margin: 0;
              line-height: 1;
          }

          .knob {
              fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
              stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
          }

          .bar {
              stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
          }

          input:focus + div svg .knob {
              stroke: var(--wired-slider-knob-outline-color, #000);
              stroke-width: 3px;
          }

          .label {
              display: inline-block;
              position: absolute;
              font-size: small;
          }
      `
    ];
  }

  get value(): number {
    if (this.input) {
      return +this.input.value;
    }
    return this.min;
  }

  set value(v: number) {
    if (this.input) {
      this.input.value = `${v}`;
    } else {
      this.pendingValue = v;
    }
    this.updateThumbPosition();
  }

  firstUpdated(_changed: PropertyValues) {
    super.firstUpdated(_changed);
    this.value = this.pendingValue || this.value || +( this.getAttribute('value') || this.min );
    delete this.pendingValue;
  }

  render(): TemplateResult {
    return html`
      <div id="container">
        <input type="range"
               min="${this.min}"
               max="${this.max}"
               step="${this.step}"
               ?disabled="${this.disabled}"
               @input="${this.onInput}"
               @change="${this.onChange}"
        >
        <div id="overlay">
          <svg></svg>
        </div>
        <label class="label"></label>
      </div>
    `;
  }

  protected renderWiredShapes() {
    super.renderWiredShapes();
    const size = this.getSize();
    const midY = Math.round(size[1] / 2);
    line(this.svg!, 10, midY, size[0] - 10, midY).classList.add('bar');
    this.knob = ellipse(this.svg!, 10, midY, 20, 20);
    this.knob.classList.add('knob');
    this.updateThumbPosition();
  }

  focus() {
    if (this.input) {
      this.input.focus();
    } else {
      super.focus();
    }
  }

  protected onInput(e: Event) {
    e.stopPropagation();
    this.updateThumbPosition();
    if (this.input) {
      fire(this, 'input', { value: +this.input.value });
    }
  }

  protected onChange(e: Event) {
    e.stopPropagation();
    if (this.input) {
      fire(this, 'change', { value: +this.input.value });
    }
  }

  private updateThumbPosition() {
    if (this.input) {
      const size = this.getSize();
      const value = +this.input!.value;
      const delta = Math.max(this.step, this.max - this.min);
      const posX = (( value - this.min ) / delta) * (size[0] - 20);
      if (this.knob) {
        this.knob.style.transform = `translateX(${posX}px)`;
      }

      // update label
      if (this.label && this['label-enabled']) {
        let labelText: string;
        switch (this['label-format']) {
          case 'number':
            labelText = formatNumber(this.value);
            break;
          case 'datetime':
            labelText = formatDate(this.value);
            break;
          default:
            labelText = `${this.value}`;
        }

        this.label.textContent = labelText;
        const rect = this.label.getBoundingClientRect();
        if (this['label-orientation'] == 'right') {
          const x = Math.min(posX + 13, size[0] - rect.width);
          this.label.style.left = `${x}px`;
        } else {
          const x = Math.min(size[0] - posX + 3, size[0] - rect.width);
          this.label.style.right = `${x}px`
        }
        const y = Math.round(size[1] / 2) + 3;
        this.label.style.top = `${y}px`;
      }
    }
  }
}