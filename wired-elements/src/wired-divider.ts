import {
  css,
  CSSResultArray,
  customElement,
  html,
  property,
  TemplateResult
} from 'lit-element';
import { line, Point } from './wired-lib';
import { BaseCSS, WiredBase } from './wired-base';

@customElement('wired-divider')
export class WiredDivider extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) orientation: 'horizontal' | 'vertical' = 'horizontal';

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

  protected getSize(): Point {
    const rect = this.getBoundingClientRect();
    const elev = this.getElev();
    if (this.orientation == 'vertical') {
      return [elev * 6, rect.height];
    } else {
      return [rect.width, elev * 6];
    }
  }

  protected renderWiredShapes() {
    super.renderWiredShapes();
    const rect = this.getBoundingClientRect();
    const elev = this.getElev();
    if (this.orientation == 'vertical') {
      for (let i = 0; i < elev; i++) {
        line(this.svg!, (i * 6) + 3, 0, (i * 6) + 3, rect.height);
      }
    } else {
      for (let i = 0; i < elev; i++) {
        line(this.svg!, 0, (i * 6) + 3, rect.width, (i * 6) + 3);
      }
    }
  }

  private getElev() {
    return Math.min(Math.max(1, this.elevation), 5);
  }
}