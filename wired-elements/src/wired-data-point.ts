import { css, CSSResult, html, property, PropertyValues } from 'lit-element';
import { WiredBase } from './wired-base';
import { elementContainsPoint, formatNumber, Point } from './wired-lib';

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

  get element(): WiredDataPoint {
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

      :host(.wired-data-point-hovered) {
        cursor: pointer;
      }
      
      :host(.wired-data-point-hovered) svg, :host(.wired-data-point-selected) svg {
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

      :host(.wired-data-point-hovered) .label {
        display: block;
      }

      #border {
        stroke: #505050;
        stroke-width: 1;
        fill: none;
      }

      :host(.wired-data-point-selected) #border {
        stroke: black;
        stroke-width: 4;
      }
    `
  }

  protected render(): unknown {
    return html`
      <svg/>
      <div id="label" class="label">
        ${`${this['data-label'] || this['data-id']}: ${this.formatValue()}`}
      </div>
    `
  }

  updated(changed?: PropertyValues) {
    super.updated(changed);
    if (changed?.has('selected')) {
      if (this.selected) {
        this.classList.add('wired-data-point-selected');
      } else {
        this.classList.remove('wired-data-point-selected');
      }
    }
  }

  protected shouldUpdateWiredShapes(size: Point, changed: PropertyValues | undefined): boolean | undefined {
    return super.shouldUpdateWiredShapes(size, changed) || changed?.has('data-value') || changed?.has('data-scale');
  }

  hover(hover: boolean) {
    const wasHover = this.classList.contains('wired-data-point-hovered');
    if (wasHover != hover) {
      if (hover) {
        this.classList.add('wired-data-point-hovered');
      } else {
        this.classList.remove('wired-data-point-hovered');
      }
      // this.requestUpdate();
    }
  }

  containsPoint(x: number, y: number): boolean {
    return elementContainsPoint(this, x, y);
  }

  protected formatValue(): string {
    return formatNumber(this['data-value']);
  }
}