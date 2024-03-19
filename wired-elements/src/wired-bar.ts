import { customElement, property } from 'lit-element';
import { elementContainsPoint, hachureFill, rectangle } from './wired-lib'
import { WiredDataPoint } from './wired-data-point';

@customElement('wired-bar')
export class WiredBar extends WiredDataPoint {

  /**
   * If a bar is clickable (selectable) on the whole area,
   * or just the filled one which represents the value.
   */
  @property({type: String}) ['selectable-area']: 'all' | 'filled' = 'all';
  private rectSvg?: SVGElement;

  protected renderWiredShapes() {
    if (this.data.value && this.data.scale) {
      const rect = this.getBoundingClientRect();
      const w = Math.max(rect.width, Math.floor(rect.height / 2));
      const x0 = w < rect.width ? Math.floor(( rect.width - w ) / 2) : 0;
      const x1 = w < rect.width ? Math.floor(( rect.width + w ) / 2) : rect.width;
      const h = Math.floor(this.data.value * this.data.scale);
      const y0 = rect.height - h;
      const y1 = rect.height;
      this.rectSvg = hachureFill([[x0, y0], [x0, y1], [x1, y1], [x1, y0]]);
      this.svg?.append(this.rectSvg);
      rectangle(this.rectSvg, x0, y0, x1 - x0, y1 - y0).id = 'border';
    }
  }

  containsPoint(x: number, y: number): boolean {
    return this['selectable-area'] === 'all' ?
        super.containsPoint(x, y) :
        !!this.rectSvg && elementContainsPoint(this.rectSvg, x, y);
  }
}