import {
  css,
  CSSResultArray,
  customElement,
  html,
  property,
  PropertyValues,
  TemplateResult
} from 'lit-element';
import { BaseCSS, WiredBase } from "./wired-base";

@customElement('wired-card')
export class WiredCard extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) fill?: string;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
        .cardFill path {
          stroke-width: 3.5;
          stroke: var(--wired-card-background-fill);
        }
        path {
          stroke: var(--wired-card-background-fill, currentColor);
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div id="overlay"><svg></svg></div>
    <div style="position: relative;">
      <slot @slotchange="${() => this.updated()}"></slot>
    </div>
    `;
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    if (this.fill && this.svg) {
      this.svg.style.setProperty('--wired-card-background-fill', this.fill.trim());
    }
    this.setAttribute(WiredBase.SHAPE_ATTR, `rectangle:offset=2,fill=hachure,elevation=${this.elevation},class=cardFill`);
  }
}