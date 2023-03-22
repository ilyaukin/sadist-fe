import { customElement, PropertyValues } from 'lit-element';
import { WiredBaseGraph } from '@my-handicapped-pet/wired-base-graph';

@customElement('wired-histogram')
export class WiredHistogram extends WiredBaseGraph {

  updated(_changedProperties: PropertyValues) {
    const rect = this.getBoundingClientRect();
    const lastSize = [...this.lastSize];

    super.updated(_changedProperties);
    if (!( rect.height === lastSize[1] )) {
      this.updateScale(rect.height, true);
    }
    if (!( rect.width === lastSize[0] && rect.height === lastSize[1] )) {
      this.poseData();
    }
  }

  protected poseData() {
    // assign space for each node
    const rect = this.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const wg = Math.floor(w / this.groups.length);
    const marging = this.legend.length === 1 ? 0 : Math.ceil(.1 * wg);
    const wsg = Math.max(Math.floor(( wg - 2 * marging ) / this.legend.length), 1);
    this.groups.forEach((g, i) => {
      this.legend.forEach(({}, j) => {
        g.nodes[j].style.position = 'absolute';
        g.nodes[j].style.bottom = `0px`;
        g.nodes[j].style.height = `${h}px`;
        g.nodes[j].style.left = `${i * wg + marging + j * wsg}px`;
        g.nodes[j].style.width = `${wsg}px`;
      });
    });
  }
}

