import { html, property, css, CSSResult, PropertyValues } from 'lit-element';
import { WiredBase } from '@my-handicapped-pet/wired-base';

export class DataPoint {
  private wrapped: WiredDataPoint;

  constructor(e: WiredDataPoint) {
    this.wrapped = e;
  }

  static valid(e: HTMLElement): boolean {
    return e instanceof WiredDataPoint;
  }

  get id(): any {
    return this.wrapped['data-id'];
  }

  get name(): string {
    return this.wrapped['data-name']!;
  }

  get value(): number {
    return this.wrapped['data-value']!;
  }

  get scale(): number | undefined {
    return this.wrapped['data-scale'];
  }

  set scale(scale: number | undefined) {
    this.wrapped['data-scale'] = scale;
  }

  get element(): HTMLElement {
    return this.wrapped;
  }
}

export class WiredDataPoint extends WiredBase {

  @property({ type: Map }) ['data-id']: any;
  @property({ type: String }) ['data-name']?: string;
  @property({ type: Number }) ['data-value']?: number;
  @property({ type: String }) ['data-label']?: string;
  @property({ type: Number }) ['data-scale']?: number;
  @property({ type: Boolean }) selected?: boolean;
  protected data: DataPoint;

  constructor() {
    super();
    this.data = new DataPoint(this);
  }

  static get styles(): CSSResult {
    return css`
      svg {
        stroke: var(--color, black);
        stroke-width: 1;
      }

      :host(:hover) {
        cursor: pointer;
      }
      
      :host(:hover) svg, :host(.data-point-selected) svg {
        stroke-width: 3;
      }

      .label {
        position: absolute;
        display: none;
        left: 5px;
        top: 5px;
        z-index: 1;
        border: solid 1px #cdcdcd;
        border-radius: 3px;
        background: #292929;
        color: #fff;
      }

      :host(:hover) .label {
        display: block;
      }

      #border {
        stroke: #505050;
        stroke-width: 1;
        fill: none;
      }

      :host(.data-point-selected) #border {
        stroke: black;
        stroke-width: 4;
      }
    `
  }

  protected render(): unknown {
    return html`
      <svg/>
      <div id="label" class="label">
        ${`${this['data-label'] || this['data-id']}: ${this['data-value']}`}
      </div>
    `
  }

  updated(changed?: PropertyValues) {
    super.updated(changed);
    if (changed?.has('selected')) {
      if (this.selected) {
        this.classList.add('data-point-selected');
      } else {
        this.classList.remove('data-point-selected');
      }
    }
  }
}