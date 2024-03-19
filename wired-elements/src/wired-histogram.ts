import { customElement, PropertyValues } from 'lit-element';
import { WiredBaseGraph } from './wired-base-graph';

@customElement('wired-histogram')
export class WiredHistogram extends WiredBaseGraph {

  updated(_changedProperties?: PropertyValues) {
    const rect = this.getBoundingClientRect();
    const lastSize = [...this.lastSize];

    super.updated(_changedProperties);
    if (!( rect.height === lastSize[1] )) {
      this.updateScale();
    }
    if (!( rect.width === lastSize[0] && rect.height === lastSize[1] )) {
      this.poseData();
    }
  }

  protected getBase(): number {
    return this.lastSize[1];
  }

  protected poseData() {
    // assign space for each node
    const rect = this.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    let wg = Math.floor(w / this.groups.length);
    const marging = this.legend.length === 1 ? 0 : Math.ceil(.1 * wg);
    let wsg = Math.max(Math.floor(( wg - 2 * marging ) / this.legend.length), 1);
    let margin0 = 0;
    if (this.groups[0]?.nodes[0]?.tagName == 'WIRED-BAR' && wsg > .1 * h) {
      // make a bar not wider than .1 of its possible maximum height
      wsg = Math.floor(.1 * h);
      wg = this.legend.length * wsg + 2 * marging;
      margin0 = Math.ceil((w - this.groups.length * wg) / 2);
    }
    this.groups.forEach((g, i) => {
      this.legend.forEach(({}, j) => {
        g.nodes[j].style.position = 'absolute';
        g.nodes[j].style.bottom = `0px`;
        g.nodes[j].style.height = `${h}px`;
        g.nodes[j].style.left = `${margin0 + i * wg + marging + j * wsg}px`;
        g.nodes[j].style.width = `${wsg}px`;
      });
    });
  }
}

