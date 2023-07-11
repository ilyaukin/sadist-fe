import { customElement } from 'lit-element';
import { hachureFill, rectangle } from './wired-lib'
import { WiredDataPoint } from './wired-data-point';

@customElement('wired-bar')
export class WiredBar extends WiredDataPoint {

  protected renderWiredShapes() {
    if (this.data.value && this.data.scale) {
      const rect = this.getBoundingClientRect();
      const w = Math.max(rect.width, Math.floor(rect.height / 2));
      const x0 = w < rect.width ? Math.floor(( rect.width - w ) / 2) : 0;
      const x1 = w < rect.width ? Math.floor(( rect.width + w ) / 2) : rect.width;
      const h = Math.floor(this.data.value * this.data.scale);
      const y0 = rect.height - h;
      const y1 = rect.height;
      const svg = hachureFill([[x0, y0], [x0, y1], [x1, y1], [x1, y0]]);
      this.svg?.append(svg);
      rectangle(svg, x0, y0, x1 - x0, y1 - y0).id = 'border';
    }
  }
}