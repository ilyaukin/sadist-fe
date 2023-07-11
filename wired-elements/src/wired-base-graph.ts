import {
  css,
  CSSResult,
  html,
  property,
  PropertyValues,
  query,
  TemplateResult
} from 'lit-element';
import { fire, ncolor } from './wired-lib';
import { WiredBase } from './wired-base';
import { DataPoint, WiredDataPoint } from './wired-data-point';
import { WiredLegend } from './wired-legend';

export abstract class WiredBaseGraph extends WiredBase {

  /**
   * Width / height proportion of the graph
   */
  @property({ type: Number }) proportion: number = 1.62;

  /**
   * Scale of the graph data points;
   *
   * can be a number (multiplier of the data point's value),
   * 'auto' in which case it's calculated automatically,
   * or a map of data point's names to either number, 'auto',
   * or '$<name>', in which case it's calculated separately
   * for a data point series with a certain name, or refer to
   * a scale of the other data point series
   */
  @property({ type: Object }) scale: { [x: string]: any } | 'auto' | number = 'auto';

  @query("#slot") protected slotElement?: HTMLSlotElement;
  @query("#legend") protected legendElement?: WiredLegend;

  protected groups: { id: any; nodes: { [i: number]: HTMLElement }; }[] = [];
  protected legend: { name: string; style?: { [p: string]: string }; }[] = [];

  protected pointed?: DataPoint;

  protected _initialScale: typeof this.scale = this.scale;
  protected _base!: number;

  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
        position: relative;
        width: 100%;
        height: auto;
      }

      #container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      #legend {
        display: block;
        position: inherit;
        float: right;
        z-index: 2;
        opacity: .75;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <wired-legend id="legend"
                    legend=${JSON.stringify(this.legend)}></wired-legend>
      <div id="overlay">
        <svg/>
      </div>
      <div id="container">
        <slot id="slot" @slotchange="${this.onSlotChange}"></slot>
      </div>
    `;
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.initData();
    const rect = this.getBoundingClientRect();
    if (rect.height === 0) {
      const h = Math.ceil(rect.width / this.proportion);
      this.style.height = `${h}px`;
      // this.requestUpdate();
    }

    this.addEventListener('mousemove', this.onMouseMove);
    this.addEventListener('mouseout', this.onMouseOut)
    this.addEventListener('click', this.onClick);
  }

  protected getScale(name: string): number | undefined {
    if (typeof this.scale == 'number') {
      return this.scale;
    } else if (typeof this.scale == 'object' && typeof this.scale[name] == 'number') {
      return this.scale[name];
    } else {
      console.warn(`scale[${name}] is not a number: forgot to call updateScale()?`);
      return undefined;
    }
  }

  protected updateScale(base: number = 0) {
    this.scale = this._initialScale;
    base = base || this._base;
    this._base = base;
    const series: { [x: string]: number[]; } = {};
    const scales: { [x: string]: number; } = {};
    const name2key: { [x: string]: string; } = {};
    this.datapoints?.forEach(dp => {
      let key: string;
      if (typeof this.scale == 'number' || ( typeof this.scale == 'object' && typeof this.scale[dp.name] == 'number' )) {
        return;  // already have numeric scale
      }
      if (name2key[dp.name]) {
        key = name2key[dp.name];
      } else if (this.scale === 'auto') {
        key = '1';
      } else {
        key = ( ( this.scale[dp.name] || 'auto' ) === 'auto' ) ? `$${dp.name}` : this.scale[dp.name];
        name2key[dp.name] = key;
      }
      ( series[key] ||= [] ).push(dp.value);
    });
    Object.entries(series).forEach(([key, serie]) => {
      const min = Math.min(...serie), max = Math.max(...serie),
          scatter = min > 0 ? max : max - min, scale = base / scatter;
      scales[key] = scale;
    });
    if (this.scale === 'auto') {
      this.scale = scales['1'];
    } else if (typeof this.scale == 'object') {
      for (const [name, key] of Object.entries(name2key)) {
        this.scale[name] = scales[key];
      }
    }
    this.datapoints?.forEach(dp => {
      dp.scale = this.getScale(dp.name);
    });
  }

  protected initData() {
    // put data points to the structure
    // grouped by data-id, each group value is an array
    // of data point nodes
    this.groups = [];
    this.legend = [];
    const n2i: { [n: string]: number; } = {};
    this.datapoints?.forEach(dp => {
      let group: { id: any; nodes: { [p: number]: HTMLElement } };
      if (this.groups.length && this.groups[this.groups.length - 1].id === dp.id) {
        group = this.groups[this.groups.length - 1];
      } else {
        group = { id: dp.id, nodes: {} };
        this.groups.push(group);
      }
      let i = n2i[dp.name];
      if (i == undefined) {
        this.legend.push({ name: dp.name });
        i = n2i[dp.name] = this.legend.length - 1;
      }
      let color = dp.element.style.getPropertyValue('--color');
      if (!color) {
        dp.element.style.setProperty('--color', color = ncolor(i));
      }
      ( this.legend[i].style ||= {} ).color = color;
      group.nodes[i] = dp.element;
    });
  }

  get datapoints(): DataPoint[] | undefined {
    if (this.slotElement) {
      return this.slotElement.assignedNodes()
          .filter(node => {
            const element = node as HTMLElement;
            return node.nodeType === Node.ELEMENT_NODE && DataPoint.valid(element);
          })
          .map(node => new DataPoint(node as WiredDataPoint));
    }

    return undefined;
  }

  protected abstract poseData(): void;

  protected onMouseMove(event: MouseEvent) {
    if (this.pointed && !this.pointed.element.containsPoint(event.clientX, event.clientY)) {
      this.pointed.element.hover(false);
      this.pointed = undefined;
    }
    if (!this.pointed) {
      this.pointed = this.datapoints?.find((dp) => {
        return dp.element.containsPoint(event.clientX, event.clientY);
      });
      this.pointed?.element.hover(true);
    }
  }

  protected onMouseOut(_event: MouseEvent) {
    if (this.pointed) {
      this.pointed.element.hover(false);
      this.pointed = undefined;
    }
  }

  protected onClick(event: MouseEvent) {
    // move again to actual point just in case
    this.onMouseMove(event);
    if (this.pointed) {
      fire(this, 'selected', {
        id: this.pointed.id,
        element: this.pointed.element,
        sourceEvent: event
      });
    }
  }

  protected onSlotChange() {
    this.initData();
    this.updateScale();
    this.poseData();
  }

}