import { customElement } from 'lit-element';
import { WiredDataPoint } from './wired-data-point';
import { ellipse, hachureEllipseFill } from './wired-lib';

@customElement('wired-marker')
export class WiredMarker extends WiredDataPoint {
  private r?: number;
  private xc?: number;
  private yc?: number;

  protected renderWiredShapes() {
    if (this.data.value && this.data.scale) {
      const rect = this.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      this.xc = Math.floor(w / 2);
      this.yc = Math.floor(h / 2);
      this.r = Math.max(Math.floor(Math.sqrt(this.data.value * this.data.scale)), 10);
      const svg = hachureEllipseFill(this.xc, this.yc, 2 * this.r, 2 * this.r);
      this.svg?.append(svg);
      ellipse(svg, this.xc, this.yc, 2 * this.r, 2 * this.r).id = 'border';

      // position label to make it near the marker
      const label = this.shadowRoot!.querySelector('.label');
      if (label) {
        ( label as HTMLElement ).style.top = `${Math.max(this.xc - this.r - 15, 5)}px`;
      }
    }
  }

  containsPoint(x: number, y: number): boolean {
    if (this.xc == undefined || this.yc == undefined || this.r == undefined) {
      return false;
    }

    const rect = this.getBoundingClientRect();
    const xLocal = x - rect.x - this.xc, yLocal = y - rect.y - this.yc;
    return xLocal * xLocal + yLocal * yLocal <= this.r * this.r;
  }
}