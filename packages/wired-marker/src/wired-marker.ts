import { customElement } from 'lit-element';
import { WiredDataPoint } from '@my-handicapped-pet/wired-data-point';
import { ellipse, hachureEllipseFill } from '@my-handicapped-pet/wired-lib';

@customElement('wired-marker')
export class WiredMarker extends WiredDataPoint {
  protected renderWiredShapes() {
    if (this.data.value && this.data.scale) {
      const rect = this.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const xc = Math.floor(w / 2);
      const yc = Math.floor(h / 2);
      const r = Math.max(Math.floor(Math.sqrt(this.data.value * this.data.scale)), 20);
      const svg = hachureEllipseFill(xc, yc, r, r);
      this.svg?.append(svg);
      ellipse(svg, xc, yc, r, r).id = 'border';
    }
  }
}