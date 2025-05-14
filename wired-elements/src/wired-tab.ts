import {
  css,
  CSSResultArray,
  customElement,
  html,
  property,
  PropertyValues,
  TemplateResult
} from 'lit-element';
import { BaseCSS, WiredBase } from './wired-base';

import './wired-item.js';

@customElement('wired-tab')
export class WiredTab extends WiredBase {
  @property({ type: String, reflect: true }) name = '';
  @property({ type: String }) label = '';

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
      <div style="flex: 1 1 auto;">
        <slot @slotchange="${() => this.updated()}"></slot>
      </div>
      <div id="overlay">
        <svg></svg>
      </div>
    `;
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.setAttribute(WiredBase.SHAPE_ATTR, 'rectangle:offset=2');
  }

  updated(changed?: PropertyValues) {
    super.updated(changed);
    if (( changed?.has('name') || changed?.has('label') ) && this.parentElement?.tagName?.toLowerCase() === 'wired-tabs' && typeof ( this.parentElement as any ).requestUpdate == 'function') {
      ( this.parentElement as any ).requestUpdate();
    }
  }
}