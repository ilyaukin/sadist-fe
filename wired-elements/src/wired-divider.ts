import {
  css,
  CSSResultArray,
  customElement,
  html,
  property,
  TemplateResult
} from 'lit-element';
import { line, Point } from './wired-lib';
import { BaseCSS, WiredBaseLegacy } from "./wired-base-legacy";

@customElement('wired-divider')
export class WiredDivider extends WiredBaseLegacy {
  @property({ type: Number }) elevation = 1;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: block;
          position: relative;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`<svg></svg>`;
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    return [size.width, elev * 6];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    for (let i = 0; i < elev; i++) {
      line(svg, 0, (i * 6) + 3, size[0], (i * 6) + 3);
    }
  }
}